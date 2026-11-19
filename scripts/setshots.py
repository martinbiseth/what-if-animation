"""Write shots + edit into a chapter's episode.json from a compact list: python setshots.py <slug> '<json list>'
Each item: [id, cue, size, key, note]."""
import json, sys, pathlib
slug, items = sys.argv[1], json.loads(sys.argv[2] if len(sys.argv) > 2 else sys.stdin.read())
p = pathlib.Path(__file__).resolve().parent.parent / 'studio' / 'src' / 'episodes' / slug / 'episode.json'
ep = json.loads(p.read_text())
ep['shots'] = [{'id': i, 'size': s, 'key': k, 'note': n} for i, c, s, k, n in items]
ep['edit'] = [{'shot': i, 'at': c} for i, c, s, k, n in items]
ep.pop('end', None)
p.write_text(json.dumps(ep, indent=1, ensure_ascii=False))
print(slug, len(items), 'shots')
