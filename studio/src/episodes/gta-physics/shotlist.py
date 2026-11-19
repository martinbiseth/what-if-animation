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
 'c03': [
  ('S1', 'f:0', 'big word', 'gym', 'STUNT DOUBLE', 20),
  ('S2', 'In', 'medium', 'gym', 'basketball to the face, BONK', 40),
  ('S3', 'The#2', 'wide', 'gym', 'the class gasps', 20),
  ('S4', 'Your', 'insert', 'gym', 'a tiny sliver off the bar', 16),
  ('S5', 'You', 'medium', 'gym', 'blink, catch the rebound', 30),
  ('S6', 'After', 'wide', 'store', 'bike up the loading ramp', 40),
  ('S7', 'flip', 'wide', 'store', 'the flip, into the hedge', 40),
  ('S8', 'The#2', 'medium', 'store', 'bike ruined, you pop out thumbs up', 80),
  ('S9', 'Mo', 'close-up', 'store', 'Mo screaming, filming', 40),
  ('S10', 'At', 'wide', 'skate park', 'the biggest ramp', 30),
  ('S11', 'You#2', 'wide pan', 'skate park', 'overshoot, trash can, sled across the lot', 50),
  ('S12', 'A#3', 'medium', 'skate park', 'kid with ice cream claps, you bow', 50),
  ('S13', 'Then', 'medium', 'street day', 'Mo hops off the curb: OW', 60),
  ('S14', 'Same', 'big word', 'street day', 'SAME CURB. NO BAR.', 20),
  ('S15', 'By', 'insert', 'phone', '2,000,000 views', 50),
  ('S16', 'Your', 'medium', 'living room', 'Ellie: again', 60),
  ('S17', 'And', 'graphic', 'schematic', "WARNING: DON'T TRY THIS", 40),
  ('S18', 'By', 'wide', 'street dusk', 'walking home, bar nearly empty, waving at Ellie', 50),
  ('S19', 'and', 'medium', 'street dusk', 'one tiny trip on the skateboard', 30),
  ('S20', 'The', 'insert', 'dark', 'the bar hits zero', 24),
  ('S21', 'Everything', 'black', 'black', 'RESPAWNING', 20),
  ('S22', 'You', 'medium', 'hospital room', 'your eyes open in a hospital bed', 30),
  ('S23', 'A#3', 'close-up', 'hospital room', 'the nurse staring', 20),
  ('S26', 'Because', 'close-up', 'hospital room', 'you, in the gown: technically, you did', 20),
  ('S24', 'Twenty', 'medium', 'hospital room', '20 SECONDS AGO: empty bed, then you', 20),
  ('S25', 'And', 'wide', 'hospital room', 'every light flickers', 50),
 ],
 'c04': [
  ('S1', 'f:0', 'title', 'schematic', 'THE CATCH: PHYSICS SENDS THE BILL', 30),
  ('S2', 'In', 'graphic', 'schematic', 'GAME: a fall = -10 / REAL: a fall = physics', 70),
  ('S22', 'And', 'insert', 'dark', 'a long bill printing out: PHYSICS', 40),
  ('S23', 'Jump', 'wide', 'city day', 'you falling past windows, speed lines', 30),
  ('S3', 'by', 'graphic', 'schematic', 'ten floors, the speed counting to 54', 120),
  ('S4', "That's", 'graphic', 'schematic', '54 MPH, THAT\'S REAL', 70),
  ('S5', 'Gravity', 'graphic', 'schematic', '+22 mph every second', 60),
  ('S6', 'But', 'big word', 'dark', "IT'S NOT THE SPEED, IT'S THE STOP", 20),
  ('S7', 'A', 'medium', 'street day', 'GAME: land, roll, up', 30),
  ('S8', 'A', 'graphic', 'schematic', '54 mph to zero in 5 cm, 0.004 s', 50),
  ('S9', "That's", 'graphic', 'schematic', '~600 G', 70),
  ('S10', 'The', 'graphic', 'schematic', '46 G, STAPP 1954', 70),
  ('S11', 'An', 'graphic', 'schematic', 'the rocket sled, strapped in tight', 160),
  ('S12', 'And#2', 'wide', 'street day', 'GAME: a car stops on a dime', 30),
  ('S13', 'A#4', 'graphic', 'schematic', '75 ft to stop, 6 car lengths', 90),
  ('S14', 'And', 'graphic', 'schematic', 'a car dropped three stories = 30 mph', 60),
  ('S15', 'So', 'medium', 'living room', 'you on the sofa, thinking', 40),
  ('S16', 'Then', 'wide', 'hospital hall', "the hospital hallway: you didn't walk here", 40),
  ('S17', 'You#3', 'medium', 'hospital room', 'you appear out of light', 14),
  ('S18', 'And', 'graphic', 'schematic', 'E = mc2', 30),
  ('S19', 'says', 'graphic', 'schematic', '2.4 DAYS of the world energy', 70),
  ('S20', 'Every', 'wide', 'city night', 'power flowing into the hospital', 30),
  ('S21', 'And', 'wide', 'city night', 'the whole city flickers', 60),
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
