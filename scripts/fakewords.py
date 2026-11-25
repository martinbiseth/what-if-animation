"""Placeholder word timings (no API): estimate words.json from the script so shots can be planned before the voice.
python fakewords.py <slug/chapter>"""
import json, re, sys, pathlib
slug = sys.argv[1]
d = pathlib.Path(__file__).resolve().parent.parent / 'studio' / 'src' / 'episodes' / slug
ep = json.loads((d / 'episode.json').read_text())
t, out = 0.3, []
for b in ep['script']:
    for w in b['text'].split():
        core = ''.join(ch for ch in w if ch.isalnum())
        dur = 0.06 + 0.043 * max(1, len(core))
        m = re.match(r"^(.*?)([.,!?;:]*)('?)$", w)
        out.append({'w': m.group(1) + m.group(3), 'p': m.group(2), 's': round(t, 3), 'e': round(t + dur, 3)})
        t += dur
        t += 0.5 if w.endswith('?') or w.endswith("?'") else 0.36 if w[-1] in '.!' or w.endswith(".'") else 0.2 if w[-1] in ',;:' or w.endswith(",'") else 0.03
(d / 'words.json').write_text(json.dumps(out))
print(slug, len(out), 'words', round(t, 1), 's')
