"""The shot lists of every chapter: (id, cue word, size, set, note, key). Writes shots + edit into each episode.json.
Run from the studio folder: python src/episodes/gta-physics/shotlist.py [c01 ...]"""
import json, pathlib, sys

HERE = pathlib.Path(__file__).parent

L = {
 'c01': [
  ('S1', 'f:0', 'medium', 'stairwell', 'you trip on the top step', 20),
  ('S2', 'Normally', 'close-up', 'stairwell', 'face: shock, mid-air', 12),
  ('S3', 'Today', 'wide', 'stairwell', 'you bounce down all the steps like a rubber doll', 40),
  ('S4', 'And', 'medium', 'stairwell', 'at the bottom you just stand up, dust off', 30),
  ('S5', 'At#2', 'wide', 'street day', 'the van bumps you at walking speed', 40),
  ('S6', 'You#2', 'wide', 'street day', 'you fly thirty feet, spinning', 20),
  ('S7', 'and', 'medium', 'street day', 'superhero landing on your feet', 20),
  ('S8', 'The', 'wide', 'street day', 'the van drives on', 20),
  ('S9', 'Your', 'medium', 'street day', 'Mo dares you, you on the garage roof', 40),
  ('S10', 'So', 'low wide', 'street day', 'you jump off the roof', 20),
  ('S11', 'You#2', 'medium', 'street day', 'roll, dust off, walk away; Mo stunned', 50),
  ('S12', 'And#2', 'close-up', 'street day', 'something floats over your head', 30),
  ('S13', 'A', 'insert', 'street day', 'the green bar ticks down', 40),
  ('S14', 'Today', 'big word', 'dark', 'GAME PHYSICS', 20),
  ('S15', 'But', 'graphic', 'schematic', 'a body outline: what would it really do?', 40),
  ('S16', 'And', 'insert', 'dark', 'the bar drains to zero', 40),
 ],
 'c02': [
  ('S1', 'f:0', 'title', 'rooftop', 'WHAT IF GAME PHYSICS WERE REAL?', 30),
  ('S2', 'You', 'wide', 'bedroom', 'you roll out of bed and hit the floor: DING', 40),
  ('S3', 'instead', 'close-up', 'bedroom', 'your face, the bar over it', 20),
  ('S4', 'By', 'big word', 'hallway', 'BY LUNCH: THE RULES', 20),
  ('S5', 'Rule', 'graphic', 'schematic', 'RULE 1 NOTHING HURTS', 30),
  ('S6', 'A', 'medium', 'hallway', 'a locker door BONK, -15', 30),
  ('S7', 'Rule', 'graphic', 'schematic', 'RULE 2 SIT STILL = HEAL', 30),
  ('S8', 'Sit', 'medium', 'gym', 'on the bench, the bar fills', 40),
  ('S9', 'Rule', 'graphic', 'schematic', 'RULE 3 ZERO = HOSPITAL', 30),
  ('S10', 'everything', 'black', 'black', 'RESPAWNING', 24),
  ('S11', 'and', 'medium', 'hospital room', 'you sit up, thumbs up, perfectly fine', 40),
  ('S12', 'And', 'graphic', 'schematic', 'RULE 4 NEVER TELL MOM', 30),
  ('S13', 'Never', 'close-up', 'kitchen', 'Mom, eyes narrowing', 24),
  ('S14', 'Mo', 'two-shot', 'hallway', 'Mo leans in: bro, GTA physics', 40),
  ('S15', 'respawn', 'big word', 'hallway', 'RESPAWN', 20),
  ('S16', "There's", 'wide', 'hallway', 'crowded hallway, only you have a bar', 40),
  ('S17', 'Nobody', 'close-up', 'hallway', 'Mo: no bar', 30),
 ],
}


def write(ch):
    p = HERE / ch / 'episode.json'
    ep = json.loads(p.read_text())
    ep['shots'] = [{'id': i, 'size': sz, 'set': st, 'note': n, 'key': k} for i, _, sz, st, n, k in L[ch]]
    ep['edit'] = [{'shot': i, 'at': c} for i, c, *_ in L[ch]]
    ep.pop('end', None)
    p.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + '\n')


for ch in (sys.argv[1:] or L.keys()):
    write(ch)
    print(ch, len(L[ch]), 'shots')
