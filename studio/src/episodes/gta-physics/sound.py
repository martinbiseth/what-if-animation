"""The sound of every chapter, from library clips only (0 credits): writes "sound" into each episode.json.
Run from the studio folder: python src/episodes/gta-physics/sound.py"""
import json, pathlib

HERE = pathlib.Path(__file__).parent
# name -> (prompt, seconds): exactly as cached in library/sfx (the hash is prompt|seconds)
C = {
 'card_hit': ('a cinematic title hit, a deep soft boom with a short shimmering tail', 2.0),
 'title_boom': ('a cinematic whoosh rising into a deep boom impact', 1.6),
 'tumble': ('a cartoon character tumbling down wooden stairs, a quick series of bumps and thuds', 1.3),
 'land': ('a heavy body landing flat on a wooden floor, cartoon thud', 0.6),
 'thud': ('a cartoon body falling flat on cobblestones, soft thud', 0.8),
 'whoosh': ('a quick soft cartoon whoosh, airy transition', 0.6),
 'fall_whoosh': ('a small object falling fast through the air, short soft whoosh', 0.6),
 'pop': ('a cartoon speech bubble pop, short and bright', 0.5),
 'ding': ('a correct answer ding, bright bell chime', 0.8),
 'gasp': ('a small crowd of people gasping in surprise', 1.5),
 'laugh': ('a small classroom of kids bursting out laughing', 1.6),
 'kids_cheer': ('a group of children cheering and clapping outdoors', 2.0),
 'dizzy': ('cartoon dizzy birds tweeting in a circle after a bonk', 1.4),
 'drone_hit': ('a dark ominous low drone hit, deep cinematic horror sting', 2.6),
 'drone': ('a dark low cinematic tension drone, slowly rising', 8.0),
 'power_down': ('a whole city losing power, a deep electrical power-down whine dropping in pitch into silence', 2.5),
 'power_hum': ('a deep electrical power grid hum swelling louder, transformers buzzing, rising', 3.0),
 'switch_off': ('a heavy electrical breaker switching off with a dull clunk', 0.5),
 'glitch': ('a short digital glitch, an electric buzz and crackle flickering like an unstable hologram', 1.5),
 'paste_pop': ('a bright magical pop as an object appears out of thin air, a soft shimmering whoosh into a pop', 0.7),
 'sparkle': ('a short bright magical sparkle twinkle, cartoon', 0.8),
 'beep': ('a soft electronic low battery warning beep', 0.6),
 'heartbeat': ('a slow tense heartbeat, low and muffled', 3.0),
 'buzz': ('a smartphone vibrating on a wooden table, two short buzzes', 1.2),
 'notify': ('a soft modern smartphone message notification chime', 0.8),
 'crack': ('glass cracking sharply, the crack spreading across a pane', 1.1),
 'counter_tick': ('a fast mechanical counter ticking up rapidly, digits rolling over, getting faster', 1.6),
 'car_idle': ('a car engine idling outside a house, low steady rumble', 4.0),
 'door_shut': ('an old wooden door closing firmly with a latch click', 1.0),
 'step': ('a single sneaker footstep on a wooden stair, close', 0.5),
 'class_murmur': ('a quiet classroom murmur, kids whispering, chairs shuffling', 2.0),
 'roof_wind': ('a gentle evening breeze on a city rooftop, distant traffic', 7.0),
 'room_tone': ('quiet indoor room tone in the evening, faint distant city hum, no voices', 12.5),
 'paper': ('a newspaper snapped open, paper rustle', 0.8),
 'shutter': ('a smartphone camera shutter click', 0.5),
 'scratch': ('a vinyl record scratch, music stops abruptly', 0.8),
 'buzzer': ('a game show wrong answer buzzer, short', 0.8),
 'rumble': ('procedural: a deep heavy rumble pressing down', 2.2),
 'gulp': ('a nervous cartoon gulp, short', 0.5),
 'select_draw': ('a quick digital selection sound, a soft rising electronic shimmer as a box is drawn on screen, short', 0.6),
 'catch': ('a hand catching a ceramic mug mid-air, soft slap and thud', 0.5),
 'music': ('playful quirky cartoon background music, pizzicato strings, glockenspiel and soft bass, light and curious, 110 bpm, no vocals', 17.0),
 'm_curious': ('curious playful pizzicato strings and celesta, light mystery, instrumental background loop', 20.0),
 'm_tense': ('dark suspenseful underscore, slow pulsing low strings, instrumental background loop', 20.0),
 'm_sad': ('soft sad solo piano, slow and gentle, instrumental background loop', 20.0),
}

E = {
 'c01': ('music', None, [
  ('S1+18', 'whoosh', 0.3), ('S3+0', 'tumble', 0.35), ('S3+30', 'tumble', 0.3), ('S4+0', 'dizzy', 0.25), ('S4+40', 'ding', 0.2),
  ('S5+34', 'thud', 0.4), ('S6+0', 'whoosh', 0.35), ('S7+6', 'land', 0.45), ('S8+0', 'car_idle', 0.12, 'onset', 'S9'),
  ('S10+0', 'fall_whoosh', 0.35), ('S11+0', 'land', 0.4), ('S12+8', 'sparkle', 0.3), ('S13+0', 'select_draw', 0.3), ('S14+0', 'card_hit', 0.18),
  ('S15+0', 'pop', 0.3), ('S16+0', 'beep', 0.25), ('S16+40', 'drone_hit', 0.15),
 ]),
 'c02': ('m_curious', None, [
  ('S1+0', 'title_boom', 0.2), ('S2+0', 'land', 0.4), ('S2+2', 'ding', 0.45), ('S5+0', 'select_draw', 0.3), ('S6+0', 'land', 0.35),
  ('S7+0', 'select_draw', 0.3), ('S8+20', 'sparkle', 0.2), ('S9+0', 'select_draw', 0.3), ('S10+0', 'power_down', 0.15), ('S11+0', 'paste_pop', 0.35),
  ('S12+0', 'select_draw', 0.3), ('S13+10', 'gulp', 0.35), ('S14+0', 'class_murmur', 0.1, 'onset', 'S15'), ('S15+0', 'card_hit', 0.18), ('S17+0', 'pop', 0.25),
 ]),
 'c03': ('music', None, [
  ('S1+0', 'card_hit', 0.15), ('S2+0', 'whoosh', 0.3), ('S3+0', 'gasp', 0.3), ('S4+6', 'beep', 0.2), ('S5+6', 'catch', 0.4),
  ('S6+0', 'whoosh', 0.25), ('S7+10', 'whoosh', 0.3), ('S8+0', 'pop', 0.3), ('S9+0', 'shutter', 0.3), ('S10+0', 'whoosh', 0.25),
  ('S11+30', 'land', 0.4), ('S12+0', 'kids_cheer', 0.2), ('S13+0', 'thud', 0.35), ('S14+0', 'buzzer', 0.2), ('S15+0', 'counter_tick', 0.25),
  ('S16+0', 'laugh', 0.12), ('S17+0', 'scratch', 0.3), ('S19+10', 'thud', 0.3), ('S20+8', 'beep', 0.3), ('S21+0', 'power_down', 0.15),
  ('S22+0', 'paste_pop', 0.35), ('S23+0', 'gasp', 0.2), ('S25+10', 'glitch', 0.35), ('S25+10', 'switch_off', 0.35),
 ], 'S17'),
 'c04': ('m_curious', None, [
  ('S1+0', 'card_hit', 0.18), ('S2+0', 'select_draw', 0.25), ('S22+0', 'paper', 0.4), ('S23+0', 'fall_whoosh', 0.35), ('S3+0', 'counter_tick', 0.2),
  ('S4+0', 'ding', 0.25), ('S5+0', 'select_draw', 0.25), ('S6+0', 'card_hit', 0.18), ('S7+10', 'land', 0.35), ('S8+0', 'whoosh', 0.25),
  ('S9+0', 'drone_hit', 0.15), ('S10+0', 'ding', 0.25), ('S11+0', 'whoosh', 0.35), ('S12+20', 'thud', 0.3), ('S13+0', 'select_draw', 0.25),
  ('S14+30', 'fall_whoosh', 0.3), ('S16+0', 'heartbeat', 0.2), ('S17+6', 'paste_pop', 0.35), ('S18+10', 'title_boom', 0.18),
  ('S19+0', 'ding', 0.25), ('S20+0', 'power_hum', 0.2), ('S21+8', 'glitch', 0.3), ('S21+30', 'power_down', 0.25),
 ]),
 'c05': ('m_tense', None, [
  ('S1+0', 'card_hit', 0.15), ('S2+4', 'select_draw', 0.25), ('S21+0', 'power_down', 0.2), ('S3+0', 'scratch', 0.0001), ('S5+20', 'gulp', 0.35),
  ('S6+0', 'car_idle', 0.12, 'onset', 'S7'), ('S7+0', 'step', 0.3), ('S8+20', 'select_draw', 0.25), ('S9+0', 'pop', 0.3), ('S11+0', 'counter_tick', 0.15),
  ('S13+20', 'power_down', 0.25), ('S14+0', 'drone_hit', 0.15), ('S17+6', 'paper', 0.35), ('S18+0', 'heartbeat', 0.2), ('S20+20', 'switch_off', 0.3),
 ]),
 'c06': ('m_curious', 'S3', [
  ('S1+0', 'card_hit', 0.15), ('S3+0', 'scratch', 0.3), ('S5+0', 'kids_cheer', 0.0001), ('S8+0', 'crack', 0.4), ('S9+0', 'ding', 0.2),
  ('S10+0', 'drone_hit', 0.15), ('S11+0', 'step', 0.3), ('S12+0', 'select_draw', 0.25), ('S13+10', 'pop', 0.3), ('S14+0', 'whoosh', 0.25),
  ('S15+0', 'whoosh', 0.35), ('S16+0', 'whoosh', 0.35), ('S16+14', 'land', 0.35), ('S17+0', 'fall_whoosh', 0.35), ('S17+20', 'land', 0.45),
  ('S18+0', 'laugh', 0.12), ('S19+0', 'heartbeat', 0.25), ('S20+4', 'beep', 0.35), ('S20+12', 'drone_hit', 0.2),
 ], None, 'm_tense', 'S3'),
 'c07': ('m_tense', 'S13', [
  ('S1+0', 'paste_pop', 0.3), ('S3+0', 'drone', 0.12, 'onset', 'S7'), ('S5+0', 'power_down', 0.15), ('S6+0', 'counter_tick', 0.25),
  ('S7+14', 'switch_off', 0.4), ('S7+16', 'power_hum', 0.12), ('S9+0', 'heartbeat', 0.15), ('S10+0', 'buzz', 0.35), ('S10+6', 'notify', 0.3),
  ('S12+40', 'sparkle', 0.25), ('S13+0', 'card_hit', 0.18), ('S14+0', 'ding', 0.25), ('S15+0', 'ding', 0.25), ('S16+0', 'ding', 0.25),
  ('S18+0', 'title_boom', 0.2), ('S18+16', 'pop', 0.3),
 ]),
}

for ch, spec in E.items():
    bed, until, events = spec[0], spec[1], spec[2]
    p = HERE / ch / 'episode.json'
    ep = json.loads(p.read_text())
    ids = {s['id'] for s in ep['shots']}
    evs = [list(e) for e in events if e[0].split('+')[0] in ids and e[2] > 0.001]
    used = sorted({e[1] for e in evs} | {bed})
    music = {'clip': bed, 'loop': True}
    if until:
        music['until'] = until
    ep['sound'] = {
        'clips': {n: list(C[n]) for n in used},
        'events': evs,
        'music': music,
        'levels': {'sfx_lu': -8.0, 'music_lu': -16.0},
    }
    p.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + '\n')
    print(ch, len(evs), 'events,', len(used), 'clips')
