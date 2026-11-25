"""The shot lists of every chapter: (id, cue word, size, set, note, key). Writes shots + edit into each episode.json.
Run from the studio folder: python src/episodes/moon-gone/shotlist.py [c01 ...]"""
import json, pathlib, sys

HERE = pathlib.Path(__file__).parent

L = {
 'c01': [
  ('S1', 'f:0', 'wide', 'roof night', 'the city at night, a huge full Moon, 9:47 PM', 30),
  ('S2', "You're", 'medium', 'roof night', 'you and Mo at the telescope', 40),
  ('S3', 'because', 'insert', 'roof night', "Ellie's sketchpad: MOON PROJECT, half a moon drawn", 40),
  ('S4', 'You', 'close-up', 'roof night', 'you look down, sharpening the pencil', 20),
  ('S5', 'You', 'close-up', 'roof night', 'you look back up', 20),
  ('S6', 'And', 'wide', 'sky', 'the Moon blinks out of existence', 20),
  ('S7', 'Not', 'insert', 'sky', 'a cloud drifts by: nothing behind it', 30),
  ('S8', 'Not', 'graphic', 'schematic', 'ECLIPSE? crossed out', 20),
  ('S9', "There's", 'close-up', 'sky', 'a round black hole where it was', 40),
  ('S10', 'Down', 'wide', 'street night', 'every dog barks: WOOF WOOF', 30),
  ('S11', 'Every#2', 'wide', 'street night', 'every window lights up with a phone', 30),
  ('S12', 'Mo', 'medium', 'roof night', 'Mo slowly lowers the telescope', 30),
  ('S13', 'Where', 'close-up', 'roof night', 'Mo: where did it go?', 20),
  ('S14', 'And', 'wide', 'harbor', 'next morning: the sea far out, boats on the mud', 40),
  ('S15', 'So', 'title', 'sky', 'WHAT IF THE MOON DISAPPEARED TONIGHT?', 40),
  ('S16', 'The#2', 'graphic', 'schematic', 'NIGHT 1 / YEAR 1 / 1,000,000 YEARS', 60),
 ],
 'c02': [
  ('S1', 'f:0', 'title', 'roof night', "the title over the empty sky: HERE'S THE DEAL", 30),
  ('S2', "There's", 'graphic', 'schematic', 'NO EXPLOSION', 20),
  ('S3', 'falling', 'graphic', 'schematic', 'NO ROCKS · NO CRATER', 40),
  ('S4', 'The', 'graphic', 'schematic', 'the Moon outline just stops existing', 40),
  ('S5', 'And', 'medium', 'bedroom', "you in bed: you don't float off", 40),
  ('S6', 'Your#2', 'insert', 'bathroom', 'the scale reads the same', 30),
  ('S7', 'The#2', 'graphic', 'schematic', 'Earth keeps going round the Sun', 60),
  ('S8', 'So', 'wide', 'street day', 'a normal morning', 30),
  ('S9', 'Your', 'medium', 'kitchen', 'Mom checks the news, shrugs', 40),
  ('S10', 'School', 'wide', 'street day', 'the bus stop: still late', 40),
  ('S11', 'But', 'graphic', 'schematic', "the Moon's jobs: TIDES · NIGHT LIGHT · CLOCK · BALANCE", 60),
  ('S12', 'because', 'insert', 'schematic', 'the time card stamped every night', 50),
  ('S13', "Mo's", 'wide', 'harbor', "Mo's grandpa on his boat, 50 years", 40),
  ('S14', 'He', 'insert', 'harbor', 'the tide table', 40),
  ('S15', 'And', 'wide', 'beach dusk', 'Ellie at the orange fence', 40),
  ('S16', 'A', 'insert', 'beach dusk', 'SEA TURTLE NEST sign', 40),
  ('S17', 'Remember', 'close-up', 'beach dusk', 'the sand of the nest, pushing in', 50),
 ],
}

L['c03'] = [
  ('S1', 'f:0', 'title', 'dark', 'NIGHT 1: THE DARKEST NIGHT', 30),
  ('S2', 'A', 'graphic', 'schematic', 'FULL MOON vs STARLIGHT: 100x', 70),
  ('S3', 'Without', 'wide', 'street night', 'the street with no moonlight', 40),
  ('S4', 'And', 'close-up', 'street night', 'you look up: beautiful', 30),
  ('S5', 'Out', 'wide', 'field night', 'the Milky Way spills across the sky', 60),
  ('S6', 'Astronomers', 'wide', 'observatory', 'the observatory dome, an astronomer cheering', 40),
  ('S7', 'Mo', 'wide', 'backyard night', 'Mo charges a dollar a look, a line of neighbours', 50),
  ('S8', 'By', 'insert', 'backyard night', 'the jar: $43', 40),
  ('S9', 'Mrs', 'insert', 'eyepiece', "Saturn's rings in the eyepiece", 40),
  ('S10', 'Mo', 'medium', 'backyard night', 'refund; then double for her husband', 50),
  ('S11', 'Online', 'insert', 'phone', '#WhereIsTheMoon trending', 40),
  ('S12', 'Somebody', 'insert', 'phone', 'GENUINE MOONLIGHT $10,000', 40),
  ('S13', 'A#2', 'insert', 'street night', 'WEREWOLF FAN CLUB: CLOSED', 30),
  ('S14', 'There', 'graphic', 'schematic', 'NO MORE TOTAL SOLAR ECLIPSES', 40),
  ('S15', 'No', 'wide', 'launch pad', 'the rocket with nowhere to go', 50),
  ('S16', 'And', 'medium', 'classroom', 'your teacher at the board', 30),
  ('S17', 'The', 'graphic', 'schematic', 'MOON → MONTH · MONDAY', 60),
  ('S18', 'Every', 'insert', 'schematic', 'a calendar of moon phases fades', 40),
  ('S19', 'Ellie', 'wide', 'backyard night', 'Ellie on the trampoline, staring up', 40),
  ('S20', 'But', 'close-up', 'backyard night', 'Ellie: what does the Moon actually do?', 30),
  ('S21', 'You', 'close-up', 'backyard night', "you: no answer, not yet", 30),
  ('S22', 'The', 'insert', 'phone', 'MO calling, 6:00 AM', 20),
  ('S23', 'You#2', 'close-up', 'kitchen', 'you on the phone, half asleep', 30),
  ('S24', "Grandpa's", 'wide', 'harbor', "grandpa's boat stuck in the mud", 40),
]

L['c04'] = [
  ('S1', 'f:0', 'title', 'schematic', "THE MOON'S JOB #1: THE TIDES", 30),
  ('S2', 'The#4', 'graphic', 'schematic', "the Moon's gravity pulls on the whole Earth", 40),
  ('S3', 'But', 'graphic', 'schematic', 'arrows: strongest near, weakest far', 60),
  ('S4', 'So', 'graphic', 'schematic', 'two bulges; a town spins through them', 80),
  ('S5', 'Sun', 'graphic', 'schematic', 'the Sun makes tides too', 30),
  ('S6', 'But', 'graphic', 'schematic', 'MOON 100 vs SUN 46', 60),
  ('S7', 'So', 'graphic', 'schematic', 'today vs no Moon: a third', 80),
  ('S8', 'In', 'graphic', 'schematic', '16 M, BAY OF FUNDY', 60),
  ('S9', "That's", 'graphic', 'schematic', 'a five-story building, water to the roof', 60),
  ('S10', 'Without', 'graphic', 'schematic', 'the water drops to 5 m', 40),
  ('S11', 'And', 'wide', 'shore', 'rocks and tide pools where the sea meets the land', 40),
  ('S12', 'Crabs', 'close-up', 'tide pool', 'crab, sea star, snails in the pool', 50),
  ('S13', 'With', 'close-up', 'tide pool', 'the pool dries out, the crab sweats', 50),
  ('S14', 'Then', 'graphic', 'schematic', 'the deep ocean, cross-section', 30),
  ('S15', 'Tides', 'graphic', 'schematic', 'stirring arrows: tides do HALF', 70),
  ('S16', 'That', 'graphic', 'schematic', 'a globe with the currents carrying heat', 50),
  ('S17', 'Take', 'graphic', 'schematic', 'half the arrows fade: currents and weather change?', 70),
  ('S18', 'And#2', 'graphic', 'schematic', 'the Moon as a clock face', 40),
  ('S19', 'On', 'wide', 'reef', 'the corals release their eggs together', 80),
  ('S20', 'Without', 'graphic', 'schematic', 'the clock face goes blank', 40),
  ('S21', 'Nobody', 'wide', 'reef', 'the reef at night, question marks', 40),
  ('S22', 'Scientists', 'insert', 'schematic', 'a calendar, days being crossed off', 40),
  ('S23', 'Grandpa', 'wide', 'harbor', 'grandpa on the dock, the boat in the mud', 40),
  ('S24', 'Fifty', 'close-up', 'harbor', 'grandpa: never stood me up before', 30),
]

L['c05'] = [
  ('S1', 'f:0', 'wide', 'press room', 'DAY 3: the scientists at the press conference', 40),
  ('S2', 'They', 'close-up', 'press room', 'a scientist with tired eyes', 30),
  ('S3', 'They#2', 'wide', 'living room', 'you and Mo watching on TV', 40),
  ('S4', 'When', 'wide', 'moon surface', 'the mirror left on the Moon', 50),
  ('S5', 'For', 'wide', 'observatory', 'an observatory fires a laser at the sky', 50),
  ('S6', 'About', 'graphic', 'schematic', 'Earth to Moon and back: 2.5 seconds', 80),
  ('S7', "That's", 'graphic', 'schematic', '3.8 CM A YEAR, THAT\'S REAL', 60),
  ('S8', 'Last', 'graphic', 'schematic', '9:47 PM: the laser goes out, nothing comes back', 90),
  ('S9', 'Then', 'wide', 'press room', 'the screen: the Earth, tilted', 40),
  ('S10', 'This', 'close-up', 'press room', 'scientist: this is what worries us', 30),
  ('S11', 'Earth', 'graphic', 'schematic', 'the axis tilted 23.4 degrees', 60),
  ('S12', 'That', 'graphic', 'schematic', 'seasons round the Sun', 70),
  ('S13', 'And', 'graphic', 'schematic', 'a spinning top steadied by a hand', 60),
  ('S14', 'Without', 'graphic', 'schematic', 'the top starts to wobble', 60),
  ('S15', 'But', 'graphic', 'schematic', 'MILLIONS OF YEARS: the tilt swings', 70),
  ('S16', 'Mars', 'graphic', 'schematic', 'Mars, no big moon, its tilt swung 20+', 60),
  ('S17', 'A', 'graphic', 'schematic', 'hotter summers / longer winters', 50),
  ('S18', 'And', 'graphic', 'schematic', 'ONE MORE SLOW CHANGE', 20),
  ('S19', 'The', 'graphic', 'schematic', 'the tides brake the spinning Earth', 60),
  ('S20', 'More', 'graphic', 'schematic', '18 HOURS, a billion years ago', 60),
  ('S21', 'The', 'graphic', 'schematic', 'a clock stretching from 18 to 24', 60),
  ('S22', 'Without', 'graphic', 'schematic', 'the brake lets go', 40),
  ('S23', 'Mo', 'two-shot', 'living room', 'Mo raises his hand', 40),
  ('S24', 'So', 'close-up', 'living room', 'Mo: slow bad?', 30),
  ('S25', 'Mostly', 'close-up', 'living room', 'you: not all of it is slow', 30),
  ('S26', 'Because', 'insert', 'phone', "Ellie: THEY'RE HATCHING!!", 40),
]

L['c06'] = [
  ('S1', 'f:0', 'wide', 'beach night', 'the beach after dark, the boardwalk lit behind', 40),
  ('S2', 'Ellie', 'medium', 'beach night', 'Ellie inside the orange fence, flashlight off', 50),
  ('S3', 'The#3', 'insert', 'beach night', 'the sand starts to move', 30),
  ('S4', 'Then', 'close-up', 'beach night', 'a tiny flipper, then another', 40),
  ('S5', 'Then#2', 'wide', 'beach night', 'a hundred hatchlings boil out', 50),
  ('S6', "Here's", 'graphic', 'schematic', 'HOW HATCHLINGS FIND THE SEA', 20),
  ('S7', 'They', 'graphic', 'schematic', 'they crawl to the BRIGHTEST horizon', 50),
  ('S8', 'For', 'wide', 'beach moon', 'the sea glittering under a moon, turtles to the water', 60),
  ('S9', 'But', 'wide', 'beach night', 'no Moon: the sea pitch black', 40),
  ('S10', 'And', 'wide', 'boardwalk', 'the boardwalk like a stadium: MOON VIGIL', 60),
  ('S11', 'And#3', 'insert', 'beach night', 'the hatchlings turn around', 40),
  ('S12', 'All', 'wide', 'beach night', 'they crawl up the sand toward the lights', 60),
  ('S13', 'Ellie', 'close-up', 'beach night', "Ellie: they're going the wrong way!", 30),
  ('S14', 'A', 'wide', 'beach night', 'people from the vigil run over', 40),
  ('S15', 'They#2', 'insert', 'beach night', 'phone flashlights switch on', 40),
  ('S16', 'Now', 'wide', 'beach night', 'even more turtles turn to the lights', 40),
  ('S17', 'You', 'close-up', 'beach night', "you: can't carry a hundred", 30),
  ('S18', 'They#3', 'title', 'dark', 'THEY NEED THE DARK', 20),
  ('S19', 'So', 'wide', 'beach night', 'you climb the lifeguard tower', 40),
  ('S20', 'Everybody', 'close-up', 'beach night', 'you shout: LIGHTS OFF!', 30),
  ('S21', 'For', 'wide', 'boardwalk', 'nobody moves', 30),
  ('S22', 'Mo', 'medium', 'boardwalk', 'Mo flips the floodlight switch', 40),
  ('S23', 'Grandpa', 'insert', 'boardwalk', "grandpa's truck lights go off", 30),
  ('S24', 'One', 'wide', 'boardwalk', 'one by one the phones and lanterns go out', 60),
  ('S25', 'And#2', 'wide', 'beach night', 'the faint starlight over the sea', 60),
]

L['c07'] = [
  ('S1', 'f:0', 'insert', 'beach night', 'one by one the turtles turn around', 40),
  ('S2', 'They', 'wide', 'beach night', 'they scramble into the waves', 50),
  ('S3', 'Ellie', 'medium', 'beach night', 'Ellie counting: 112', 50),
  ('S4', 'Ellie', 'close-up', 'beach night', 'Ellie crying and laughing', 30),
  ('S5', 'The#2', 'graphic', 'schematic', 'a turtle swims away and back: 30 YEARS', 60),
  ('S6', 'Then', 'close-up', 'beach night', 'Ellie looks up: how will they find it?', 40),
  ('S7', 'But', 'medium', 'beach night', 'grandpa looks at his watch and frowns', 40),
  ('S8', "That's", 'close-up', 'beach night', "grandpa: that's not right", 30),
  ('S9', 'The', 'wide', 'beach night', 'the water rushes in, fast', 40),
  ('S10', 'Higher', 'insert', 'beach night', 'the tide post: water climbs past the line', 60),
  ('S11', 'Mo', 'close-up', 'beach night', 'Mo looks up', 20),
  ('S12', 'Right', 'wide', 'sky', 'one patch of sky with no stars', 80),
  ('S13', 'So', 'title', 'dark', 'IS ANY OF THIS REAL?', 20),
  ('S14', 'The#2', 'graphic', 'schematic', "SUN'S TIDES: 46% OF THE MOON'S", 60),
  ('S15', 'The#2', 'graphic', 'schematic', 'BAY OF FUNDY: 16 M', 50),
  ('S16', 'Corals', 'graphic', 'schematic', 'CORALS TIME TO THE MOON · HATCHLINGS TO THE BRIGHTEST HORIZON', 70),
  ('S17', 'Which', 'insert', 'beach night', 'LIGHTS OUT: TURTLE NESTING SEASON', 40),
  ('S18', 'Would', 'close-up', 'beach night', 'you on the dark beach', 30),
  ('S19', 'And', 'title', 'dark', "WHAT'S PULLING THE OCEAN?", 30),
  ('S20', 'And', 'end card', 'sky', 'the dark spot · SUBSCRIBE', 60),
]


def write(ch):
    p = HERE / ch / 'episode.json'
    ep = json.loads(p.read_text())
    ep['shots'] = [{'id': i, 'size': sz, 'set': st, 'note': n, 'key': k} for i, _, sz, st, n, k in L[ch]]
    ep['edit'] = [{'shot': i, 'at': c} for i, c, *_ in L[ch]]
    ep.pop('end', None)
    if ch == 'c07':
        ep['tail'] = 2.5
    p.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + '\n')


for ch in (sys.argv[1:] or L.keys()):
    write(ch)
    print(ch, len(L[ch]), 'shots')
