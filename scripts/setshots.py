"""Write shots + edit into a chapter's episode.json from a compact list: python setshots.py <slug> '<json list>'
Each item: [id, cue, size, key, note]. A cue with spaces is a phrase ("You crouch"): it becomes word#n, counted from
the previous cut the way plan.py counts."""
import json, re, sys, pathlib
slug, items = sys.argv[1], json.loads(sys.argv[2] if len(sys.argv) > 2 else sys.stdin.read())
d = pathlib.Path(__file__).resolve().parent.parent / 'studio' / 'src' / 'episodes' / slug
p = d / 'episode.json'
ep = json.loads(p.read_text())
words = json.loads((d / 'words.json').read_text())
norm = lambda w: re.sub(r"^'+|'+$", '', re.sub(r"[^\w']", '', w.lower().replace('’', "'")))
W = [norm(w['w']) for w in words]
prev = 0
edit = []
for i, c, s, k, n in items:
    if c.startswith(('f:', 's:', '+')):
        edit.append({'shot': i, 'at': c}); continue
    if '#' in c and ' ' not in c:
        w, nth = c.split('#'); nth = int(nth)
        seen = 0
        for j in range(prev, len(W)):
            if W[j] == norm(w):
                seen += 1
                if seen == nth: break
        else: raise SystemExit(f'{i}: {c} not found')
        edit.append({'shot': i, 'at': c}); prev = j + 1; continue
    ph = [norm(x).replace("'", '') for x in c.split()]
    W2 = [w.replace("'", '') for w in W]
    for j in range(prev, len(W)):
        if W2[j:j + len(ph)] == ph: break
    else: raise SystemExit(f'{i}: phrase "{c}" not found after word {prev}')
    nth = sum(1 for q in range(prev, j + 1) if W[q] == W[j])
    edit.append({'shot': i, 'at': W[j] if nth == 1 else f'{W[j]}#{nth}'})
    prev = j + 1
ep['shots'] = [{'id': i, 'size': s, 'key': k, 'note': n} for i, c, s, k, n in items]
ep['edit'] = edit
ep.pop('end', None)
p.write_text(json.dumps(ep, indent=1, ensure_ascii=False))
print(slug, len(items), 'shots')
