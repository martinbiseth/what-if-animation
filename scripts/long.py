"""Long-form episodes (8 minutes and up): a series of chapters, each one a normal episode the other scripts already
know how to make, then joined, mastered and packaged for YouTube.

    python <skill>/scripts/long.py init    <slug> --id SkipSleep --topic "What if you never had to sleep?"
    python <skill>/scripts/long.py status  <slug>
    python <skill>/scripts/long.py render  <slug> [c03 c04] [--force] [--concurrency 6]
    python <skill>/scripts/long.py youtube <slug>

A chapter's slug is '<slug>/<chapter>' (e.g. skip-sleep/c03), so every per-episode script works on it unchanged:
    python <skill>/scripts/voice.py skip-sleep/c03
    python <skill>/scripts/plan.py  skip-sleep/c03
    node   <skill>/scripts/stills.mjs skip-sleep/c03

Files:
    src/episodes/<slug>/series.json          the series: chapters, shared defaults (voice, pace...), YouTube metadata
    src/episodes/<slug>/<chapter>/...        one episode per chapter (episode.json, shots.tsx, index.tsx, timeline.json)
    src/episodes/<slug>/index.ts             exports the chapters for the registry (init writes it)
    out/<slug>/<chapter>/<chapter>-raw.mp4   each chapter's render (render re-renders only what changed)
    out/<slug>/<slug>-final.mp4              the joined episode at -14 LUFS, and report.json
    out/<slug>/youtube/                      captions.srt, chapters.txt, description.txt, metadata.json, midrolls.txt,
                                             thumbnail.png (youtube writes them; upload.py sends them)
"""
import json, re, subprocess, sys, time

from wi import STUDIO, ep_dir, load_json, load_series, loudness, out_dir, save_json, stem

npx = 'npx.cmd' if sys.platform == 'win32' else 'npx'
MIN_LEN = 480  # YouTube lets you place mid-roll ads from 8:00

# The seven beats of the What If formula at full length (references/longform.md has the reasoning and the budgets).
BEATS = [
    ('c01', 'Cold open', '1 cold open: three or four quick demos of the power, the word said every time', 130, {'min_cuts': 24, 'max_hold': 4}),
    ('c02', 'The premise and its rules', '2 the premise: what changed overnight, the title card, the rules', 120, None),
    ('c03', 'The fun part', '3 the fun part: escalating wins in everyday life, the best friend joins in', 260, None),
    ('c04', 'The catch', '4 the not-so-fun part: the cost, built on real facts with numbers ("That\'s real.")', 260, None),
    ('c05', 'Someone notices', '5 someone powerful notices: the man in the suit', 200, None),
    ('c06', 'The choice', '6 a moral choice with family at stake: the little sister', 200, None),
    ('c07', 'Cliffhanger', '7 the cliffhanger: the choice made, a question left open, "is any of this real?"', 130, None),
]


def pascal(s):
    return re.sub(r'[^A-Za-z0-9]', '', s.title())


def chapters(slug):
    return load_series(slug)['chapters']


def probe_len(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', str(path)], capture_output=True, text=True)
    return float(r.stdout.strip()) if r.stdout.strip() else 0.0


def has_audio(path):
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', str(path)], capture_output=True, text=True)
    return bool(r.stdout.strip())


def chapter_seconds(slug, ch):
    """A chapter's real length: its render if there is one, else its timeline, else its voice, else a word estimate."""
    raw = out_dir(f'{slug}/{ch}') / f'{ch}-raw.mp4'
    if raw.exists():
        return probe_len(raw), 'render'
    tl = load_json(ep_dir(f'{slug}/{ch}') / 'timeline.json', {}) or {}
    if tl.get('total', 0) > 1:
        return tl['total'] / tl.get('fps', 30), 'timeline'
    words = load_json(ep_dir(f'{slug}/{ch}') / 'words.json', [])
    if words:
        return words[-1]['e'] + 0.9, 'voice'
    ep = load_json(ep_dir(f'{slug}/{ch}') / 'episode.json', {}) or {}
    n = sum(len(b.get('text', '').split()) for b in ep.get('script', []))
    return n / 2.6, 'estimate'


def fmt(sec):
    sec = int(round(sec))
    return f'{sec // 3600}:{sec % 3600 // 60:02d}:{sec % 60:02d}' if sec >= 3600 else f'{sec // 60}:{sec % 60:02d}'


# ---------------------------------------------------------------- init
def init(slug, args):
    sid = args[args.index('--id') + 1] if '--id' in args else pascal(slug)
    topic = args[args.index('--topic') + 1] if '--topic' in args else ''
    base = ep_dir(slug)
    if (base / 'series.json').exists():
        raise SystemExit(f'{base}/series.json exists already')
    base.mkdir(parents=True, exist_ok=True)
    series = {
        'id': sid, 'slug': slug, 'topic': topic,
        'title': ['WHAT IF YOU COULD', ''],
        'target_seconds': 540,
        'defaults': {
            'voice': {'id': 'TX3LPaxmHKxFdv7VOQHJ', 'model': 'eleven_multilingual_v2',
                      'settings': {'stability': 0.45, 'similarity_boost': 0.8, 'style': 0.3, 'use_speaker_boost': True}},
            'gaps': {'word': 0.14, 'comma': 0.25, 'sentence': 0.42, 'question': 0.6},
            'pace': {'min_cuts': 8, 'max_hold': 8},
        },
        'chapters': [{'slug': c, 'name': n, 'words': w} for c, n, _, w, _ in BEATS],
        'youtube': {
            'title': topic, 'tags': ['what if', 'animation', 'science'], 'category': 27, 'language': 'en',
            'privacy': 'private', 'made_for_kids': False, 'synthetic_media': False,
            'intro': 'One line on what the episode is about, for the top of the description.',
            'thumbnail': {'chapter': 'c02', 'frame': 60},
            'midroll_gap': 120,
        },
    }
    save_json(base / 'series.json', series)
    for c, n, beat, w, pace in BEATS:
        d = base / c
        d.mkdir(exist_ok=True)
        cid = f'{sid}{c.upper()}'
        ep = {'id': cid, 'slug': f'{slug}/{c}', 'chapter': n, 'topic': topic,
              'script': [{'beat': beat, 'text': ''}], 'science': [],
              'shots': [{'id': 'S1', 'size': 'wide', 'set': 'rooftop', 'key': 30, 'note': f'placeholder card: {n}'}],
              'edit': [{'shot': 'S1', 'at': 'f:0'}], 'end': 'f:90', 'fx': []}
        if pace:
            ep['pace'] = pace
        if c == 'c02':
            ep['title'] = series['title']
        save_json(d / 'episode.json', ep)
        (d / 'shots.tsx').write_text(
            "import { chapterCard } from '../../../engine';\n\n"
            f"// Placeholder until this chapter is drawn: a card with the chapter's name. Replace with real shots.\n"
            f"export const S1 = chapterCard({{ kicker: 'CHAPTER {int(c[1:])}', title: {json.dumps(n.upper())} }});\n", encoding='utf-8')
        (d / 'index.tsx').write_text(
            "import { defineEpisode, Timeline } from '../../../engine';\n"
            "import timeline from './timeline.json';\n"
            "import * as shots from './shots';\n\n"
            f"export const {c} = defineEpisode({json.dumps(cid)}, {{ timeline: timeline as Timeline, shots }});\n", encoding='utf-8')
        save_json(d / 'timeline.json', {'slug': f'{slug}/{c}', 'title': n, 'fps': 30, 'total': 90,
                                        'segments': [{'shot': 'S1', 'a': 0, 'b': 90, 't0': 0, 't1': 90, 'line': ''}],
                                        'shots': [{'id': 'S1', 'size': 'wide', 'key': 30, 'len': 90, 'first': 0, 'line': '', 'note': n}],
                                        'fx': [], 'audio': {}})
    var = re.sub(r'^[A-Z]', lambda m: m.group(0).lower(), sid)
    lines = [f"import {{ {c} }} from './{c}';" for c, *_ in BEATS]
    lines.append(f"\n// The chapters in order: the registry gives each its own composition, long.py renders and joins them.\nexport const {var}Chapters = [{', '.join(c for c, *_ in BEATS)}];")
    (base / 'index.ts').write_text('\n'.join(lines) + '\n', encoding='utf-8')
    reg = STUDIO / 'src' / 'episodes' / 'index.ts'
    r = reg.read_text(encoding='utf-8')
    if f'./{slug}' not in r:
        r = r.replace('export const EPISODES = [', f"import {{ {var}Chapters }} from './{slug}';\n\nexport const EPISODES = [", 1)
        r = re.sub(r'export const EPISODES = \[(.*?)\];', lambda m: f'export const EPISODES = [{m.group(1)}, ...{var}Chapters];', r, count=1, flags=re.S)
        reg.write_text(r, encoding='utf-8')
    print(f'Made {base} with {len(BEATS)} chapters ({sum(b[3] for b in BEATS)} words planned, about {sum(b[3] for b in BEATS) / 2.6 / 60:.1f} min).')
    print('Next: write the script of every chapter (references/longform.md), then voice and plan each one:')
    print(f'  python <skill>/scripts/voice.py {slug}/c01 && python <skill>/scripts/plan.py {slug}/c01')
    print(f'  python <skill>/scripts/long.py status {slug}')


# ---------------------------------------------------------------- status
def status(slug, args):
    s = load_series(slug)
    rows, total = [], 0.0
    print(f"{s['id']}: {s.get('topic', '')}")
    print(f"{'ch':5} {'name':28} {'words':>6} {'plan':>6} {'length':>8} {'from':9} {'shots':>5} {'cuts/min':>8} {'credits':>7}")
    for c in s['chapters']:
        cs = f"{slug}/{c['slug']}"
        ep = load_json(ep_dir(cs) / 'episode.json', {}) or {}
        words = sum(len(b.get('text', '').split()) for b in ep.get('script', []))
        sec, src = chapter_seconds(slug, c['slug'])
        tl = load_json(ep_dir(cs) / 'timeline.json', {}) or {}
        nseg = len(tl.get('segments', []))
        cpm = (nseg - 1) / sec * 60 if sec and nseg > 1 else 0
        cr = sum(r['credits'] for r in load_json(out_dir(cs) / 'costs.json', []))
        total += sec
        print(f"{c['slug']:5} {c.get('name', '')[:28]:28} {words:>6} {c.get('words', 0):>6} {fmt(sec):>8} {src:9} {len(tl.get('shots', [])):>5} {cpm:>8.1f} {cr:>7}")
    tgt = s.get('target_seconds', MIN_LEN)
    print(f'total {fmt(total)} (target {fmt(tgt)}, mid-rolls need {fmt(MIN_LEN)})')
    if total < MIN_LEN:
        print(f'  ! {fmt(MIN_LEN - total)} short of 8:00: lengthen the thinnest chapters (more story, not slower speech)')


# ---------------------------------------------------------------- render
def newest_input(cs):
    d = ep_dir(cs)
    files = [*d.glob('*'), *(STUDIO / 'src' / 'engine').rglob('*')]
    for k in ('voice', 'sfx', 'music'):
        f = stem(cs, k)
        if f:
            files.append(f)
    return max(f.stat().st_mtime for f in files if f.is_file())


def render(slug, args):
    s = load_series(slug)
    only = [a for a in args if not a.startswith('--') and (args.index(a) == 0 or args[args.index(a) - 1] != '--concurrency')]
    force = '--force' in args
    conc = args[args.index('--concurrency') + 1] if '--concurrency' in args else None
    od = out_dir(slug)
    parts = []
    for c in s['chapters']:
        cs = f"{slug}/{c['slug']}"
        ep = json.loads((ep_dir(cs) / 'episode.json').read_text(encoding='utf-8'))
        raw = out_dir(cs) / f"{c['slug']}-raw.mp4"
        stale = not raw.exists() or raw.stat().st_mtime < newest_input(cs)
        if force or (c['slug'] in only) or (not only and stale):
            t0 = time.time()
            # --enforce-audio-track: a chapter with no sound yet still gets a (silent) track, so the join lines up
            cmd = [npx, 'remotion', 'render', 'src/index.ts', ep['id'], str(raw), '--log', 'error', '--enforce-audio-track']
            if conc:
                cmd += ['--concurrency', conc]
            print(f"{c['slug']}: rendering {ep['id']}")
            subprocess.run(cmd, cwd=STUDIO, check=True)
            print(f"{c['slug']}: {probe_len(raw):.1f} s in {time.time() - t0:.0f} s")
        elif not raw.exists():
            raise SystemExit(f"{c['slug']} has no render yet: run without chapter names, or name it")
        else:
            print(f"{c['slug']}: up to date")
        if not has_audio(raw):  # rendered before --enforce-audio-track: add silence rather than re-render
            fixed = raw.with_name(raw.stem + '-a.mp4')
            subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(raw), '-f', 'lavfi', '-i', 'anullsrc=r=48000:cl=stereo', '-map', '0:v', '-map', '1:a',
                            '-c:v', 'copy', '-c:a', 'aac', '-shortest', str(fixed)], check=True)
            fixed.replace(raw)
        parts.append(raw)
    # Join: the video is copied untouched (every chapter comes out of the same renderer settings); the audio is
    # decoded to PCM across the joins so no AAC priming gap clicks at a chapter boundary.
    lst = od / 'concat.txt'
    lst.write_text(''.join(f"file '{p.as_posix()}'\n" for p in parts), encoding='utf-8')
    joined = od / f'{slug}-joined.mkv'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c:v', 'copy', '-c:a', 'pcm_s16le', str(joined)], check=True)
    I, TP, LRA = -14.0, -1.5, 11
    first = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(joined), '-af', f'loudnorm=I={I}:TP={TP}:LRA={LRA}:print_format=json', '-f', 'null', '-'],
                           capture_output=True, text=True, encoding='utf-8', errors='ignore').stderr
    m = json.loads(first[first.rfind('{'):first.rfind('}') + 1])
    filt = (f"loudnorm=I={I}:TP={TP}:LRA={LRA}:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}"
            f":measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    final = od / f'{slug}-final.mp4'
    subprocess.run(['ffmpeg', '-y', '-v', 'error', '-i', str(joined), '-c:v', 'copy', '-af', filt, '-ar', '48000', '-c:a', 'aac', '-b:a', '256k', '-movflags', '+faststart', str(final)], check=True)
    joined.unlink()
    lufs, _ = loudness(final)
    dur = probe_len(final)
    costs = [dict(r, chapter=c['slug']) for c in s['chapters'] for r in load_json(out_dir(f"{slug}/{c['slug']}") / 'costs.json', [])]
    report = {'episode': s['id'], 'file': str(final), 'seconds': round(dur, 2), 'length': fmt(dur), 'lufs': lufs,
              'chapters': [{'slug': c['slug'], 'name': c.get('name', ''), 'seconds': round(probe_len(p), 2)} for c, p in zip(s['chapters'], parts)],
              'elevenlabs_credits': sum(r['credits'] for r in costs), 'cost_lines': costs}
    save_json(od / 'report.json', report)
    print(json.dumps({k: v for k, v in report.items() if k != 'cost_lines'}, indent=1))
    if dur < MIN_LEN:
        print(f'! {fmt(dur)} is under 8:00: no mid-roll ads on this one')


# ---------------------------------------------------------------- youtube
def srt_time(t):
    ms = int(round(t * 1000))
    return f'{ms // 3600000:02d}:{ms % 3600000 // 60000:02d}:{ms % 60000 // 1000:02d},{ms % 1000:03d}'


def cues(words, offset, max_chars=42, max_secs=5.5):
    """Words to caption cues: up to two lines of max_chars, broken at sentence ends, commas, then length."""
    out, cur = [], []

    def flush():
        if cur:
            text = ' '.join(w['w'] + w.get('p', '').strip() for w in cur)
            if len(text) > max_chars:  # two lines, split near the middle on a space
                mid = len(text) // 2
                sp = min((i for i, ch in enumerate(text) if ch == ' '), key=lambda i: abs(i - mid))
                text = text[:sp] + '\n' + text[sp + 1:]
            out.append((cur[0]['s'] + offset, cur[-1]['e'] + offset, text))
            cur.clear()

    for w in words:
        cand = ' '.join(x['w'] for x in cur + [w])
        if cur and (len(cand) > 2 * max_chars or w['e'] - cur[0]['s'] > max_secs):
            flush()
        cur.append(w)
        p = w.get('p', '')
        if any(ch in p for ch in '.?!') or (',' in p and len(cand) > max_chars * 0.8):
            flush()
    flush()
    return out


def youtube(slug, args):
    s = load_series(slug)
    Y = s.get('youtube', {})
    yd = out_dir(slug) / 'youtube'
    yd.mkdir(exist_ok=True)
    starts, t = [], 0.0
    srt, n = [], 1
    sources = []
    for c in s['chapters']:
        cs = f"{slug}/{c['slug']}"
        sec, src = chapter_seconds(slug, c['slug'])
        starts.append((t, c.get('name', c['slug']), src))
        for a, b, text in cues(load_json(ep_dir(cs) / 'words.json', []), t):
            srt.append(f'{n}\n{srt_time(a)} --> {srt_time(b)}\n{text}\n')
            n += 1
        ep = load_json(ep_dir(cs) / 'episode.json', {}) or {}
        sources += [x for x in ep.get('science', []) if x.get('claim')]
        t += sec
    total = t
    (yd / 'captions.srt').write_text('\n'.join(srt), encoding='utf-8')
    # YouTube chapters: the first at 0:00, at least three, each at least 10 s long.
    problems = []
    if len(starts) < 3:
        problems.append('YouTube needs at least three chapters')
    for (a, name, _), (b, *_ ) in zip(starts, starts[1:] + [(total, '', '')]):
        if b - a < 10:
            problems.append(f'chapter "{name}" is {b - a:.0f} s: YouTube wants 10 s or more')
    chap = '\n'.join(f'{fmt(a)} {name}' for a, name, _ in starts)
    (yd / 'chapters.txt').write_text(chap + '\n', encoding='utf-8')
    # Mid-roll suggestions: at chapter starts, from 2:00 on, at least `midroll_gap` seconds apart. A break between
    # chapters lands on a pause, not mid-sentence, which is what keeps people watching through the ad.
    gap = Y.get('midroll_gap', 120)
    mids, last = [], 0.0
    for a, name, _ in starts[1:]:
        if a >= 120 and a - last >= gap and total - a >= 60:
            mids.append((a, name))
            last = a
    (yd / 'midrolls.txt').write_text(
        ('\n'.join(f'{fmt(a)}  before "{name}"' for a, name in mids) + '\n') if total >= MIN_LEN else
        f'Under 8:00 ({fmt(total)}): YouTube does not allow mid-roll ads on this video.\n', encoding='utf-8')
    src_lines = []
    for x in sources:
        src_lines.append(f"- {x['claim']} Source: {x.get('source', 'see working')}")
    desc = [Y.get('intro', s.get('topic', '')), '', 'Chapters', chap]
    if src_lines:
        desc += ['', 'Is any of this real? The facts in this episode, and where they come from:', *src_lines]
    desc += ['', 'Animated in code. Characters and story are original.']
    (yd / 'description.txt').write_text('\n'.join(desc) + '\n', encoding='utf-8')
    meta = {'title': Y.get('title') or s.get('topic', ''), 'description_file': 'description.txt', 'tags': Y.get('tags', []),
            'category': Y.get('category', 27), 'language': Y.get('language', 'en'), 'privacy': Y.get('privacy', 'private'),
            'made_for_kids': Y.get('made_for_kids', False), 'synthetic_media': Y.get('synthetic_media', False),
            'video': str(out_dir(slug) / f'{slug}-final.mp4'), 'captions': 'captions.srt', 'thumbnail': None,
            'seconds': round(total, 2), 'length': fmt(total)}
    th = Y.get('thumbnail')
    if th and '--no-thumb' not in args:
        ep = load_json(ep_dir(f"{slug}/{th['chapter']}") / 'episode.json')
        out = yd / 'thumbnail.png'
        subprocess.run([npx, 'remotion', 'still', 'src/index.ts', ep['id'], str(out), '--frame', str(th.get('frame', 0)), '--log', 'error'], cwd=STUDIO, check=True)
        meta['thumbnail'] = 'thumbnail.png'
    if len(meta['title']) > 100:
        problems.append(f'title is {len(meta["title"])} characters: YouTube allows 100')
    if len('\n'.join(desc).encode()) > 5000:
        problems.append('description is over 5000 bytes')
    save_json(yd / 'metadata.json', meta)
    print(f'{yd}: captions.srt ({n - 1} cues), chapters.txt, midrolls.txt ({len(mids)}), description.txt, metadata.json' + (', thumbnail.png' if meta['thumbnail'] else ''))
    print(f'length {fmt(total)}' + ('' if all(x[2] == 'render' for x in starts) else ' (some chapters not rendered yet: times are from timelines or estimates)'))
    for p in problems:
        print('  ! ' + p)


if __name__ == '__main__':
    if len(sys.argv) < 3 or sys.argv[1] not in ('init', 'status', 'render', 'youtube'):
        raise SystemExit(__doc__)
    {'init': init, 'status': status, 'render': render, 'youtube': youtube}[sys.argv[1]](sys.argv[2], sys.argv[3:])
