"""Writes a chapter's shots + edit from plans/<ch>.txt: one line per shot: 'S3 | cue | size | set | note'.
python src/episodes/never-sleep/setplan.py c01"""
import json, pathlib, sys
D = pathlib.Path(__file__).resolve().parent
ch = sys.argv[1]
p = D / ch / 'episode.json'
ep = json.loads(p.read_text())
shots, edit = [], []
for line in (D / 'plans' / f'{ch}.txt').read_text().splitlines():
    if not line.strip() or line.startswith('#'):
        continue
    sid, cue, size, st, note = [x.strip() for x in line.split('|')]
    shots.append({'id': sid, 'size': size, 'set': st, 'key': 30, 'note': note})
    edit.append({'shot': sid, 'at': cue})
ep['shots'], ep['edit'] = shots, edit
ep.pop('end', None)
p.write_text(json.dumps(ep, indent=1, ensure_ascii=False))
print(ch, len(shots), 'shots')
