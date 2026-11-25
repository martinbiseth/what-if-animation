"""The sound of every chapter, from library clips only (0 credits): writes "sound" into each episode.json.
Run from the studio folder: python src/episodes/moon-gone/sound.py"""
import json, pathlib

HERE = pathlib.Path(__file__).parent
# name -> (prompt, seconds): exactly as cached in library/sfx (the hash is prompt|seconds)
C = {
 'card_hit': ('a cinematic title hit, a deep soft boom with a short shimmering tail', 2.0),
 'title_boom': ('a cinematic whoosh rising into a deep boom impact', 1.6),
 'whoosh': ('a quick soft cartoon whoosh, airy transition', 0.6),
 'fall_whoosh': ('a small object falling fast through the air, short soft whoosh', 0.6),
 'pop': ('a short bright cartoon pop', 0.5),
 'ding': ('a bright bell ding, correct answer', 0.8),
 'gasp': ('two young people gasping in surprise at the same moment, cartoon, short', 0.8),
 'kids_cheer': ('a group of children cheering and clapping outdoors', 2.0),
 'crowd_cheer': ('a large outdoor crowd cheering and laughing happily, many voices, no clear words', 2.5),
 'crowd_shout': ('a large crowd of workers outdoors shouting in alarm and surprise, many voices, no clear words', 2.5),
 'drone_hit': ('a dark ominous low drone hit, deep cinematic horror sting', 2.6),
 'drone': ('a dark low cinematic tension drone, slowly rising', 8.0),
 'power_down': ('a whole city losing power, a deep electrical power-down whine dropping in pitch into silence', 2.5),
 'switch_off': ('a heavy electrical breaker switching off with a dull clunk', 0.5),
 'sparkle': ('a short bright magical sparkle twinkle, cartoon', 0.8),
 'beep': ('a soft electronic low battery warning beep', 0.6),
 'heartbeat': ('a slow tense heartbeat, low and muffled', 3.0),
 'buzz': ('a smartphone vibrating on a wooden table, two short buzzes', 1.2),
 'notify': ('a soft modern smartphone message notification chime', 0.8),
 'counter_tick': ('a fast mechanical counter ticking up rapidly, digits rolling over, getting faster', 1.6),
 'step': ('a single sneaker footstep on a wooden stair, close', 0.5),
 'class_murmur': ('a quiet classroom murmur, kids whispering, chairs shuffling', 2.0),
 'roof_wind': ('a gentle evening breeze on a city rooftop, distant traffic', 7.0),
 'room_tone': ('quiet indoor room tone in the evening, faint distant city hum, no voices', 12.5),
 'select_draw': ('a quick digital selection sound, a soft rising electronic shimmer as a box is drawn on screen, short', 0.6),
 'm_curious': ('curious playful pizzicato strings and celesta, light mystery, instrumental background loop', 20.0),
 'm_tense': ('dark suspenseful underscore, slow pulsing low strings, instrumental background loop', 20.0),
 'm_sad': ('soft sad solo piano, slow and gentle, instrumental background loop', 20.0),
 'river': ('gentle river water lapping against a wooden boat, soft breeze in reeds, no voices', 10.0),
 'night_desert': ('a quiet desert at night, soft breeze, distant crickets, no voices', 10.0),
 'tick': ('a slow old clock ticking in a quiet room', 4.0),
 'alarm': ('a digital bedside alarm clock beeping, fast repeated beeps', 1.5),
 'cash': ('an old mechanical cash register ding and drawer', 1.2),
 'shutter': ('a smartphone camera shutter click', 0.5),
 'splash_syn': ('procedural: a heavy body splashing into a pool', 1.4),
 'pool_syn': ('procedural: calm pool water lapping with a soft filter hum', 8.0),
 'paste_pop': ('a bright magical pop as an object appears out of thin air, a soft shimmering whoosh into a pop', 0.7),
 'scratch': ('a vinyl record scratch, music stops abruptly', 0.8),
 'paper': ('a newspaper snapped open, paper rustle', 0.8),
 'glitch': ('a short digital glitch, an electric buzz and crackle flickering like an unstable hologram', 1.5),
 'jar_pop': ('a glass jar lid twisting and popping off with a loud suction pop, close', 0.6),
 'rumble_syn': ('procedural: a deep heavy rumble pressing down', 2.2),
 'power_off': ('an electronic device powering off, a short descending tone into silence', 1.2),
 'car_idle': ('a car engine idling outside a house, low steady rumble', 4.0),
 'laugh': ('a small classroom of kids bursting out laughing', 1.6),
}

E = {
 'c01': ('m_curious', 'S6', [
  ('S1+0', 'roof_wind', 0.2, 'onset', 'S6'), ('S2+10', 'step', 0.25), ('S3+6', 'paper', 0.3), ('S4+0', 'jar_pop', 0.0001),
  ('S6+0', 'power_off', 0.3), ('S6+2', 'drone_hit', 0.25), ('S7+0', 'whoosh', 0.25), ('S8+0', 'buzzer', 0.0001), ('S8+6', 'select_draw', 0.3),
  ('S9+0', 'drone', 0.15, 'onset', 'S12'), ('S10+0', 'crowd_shout', 0.25), ('S11+0', 'notify', 0.3), ('S11+8', 'buzz', 0.3),
  ('S13+0', 'heartbeat', 0.2), ('S14+0', 'river', 0.18, 'onset', 'S15'), ('S15+0', 'title_boom', 0.25), ('S16+0', 'card_hit', 0.2),
 ]),
 'c02': ('m_curious', None, [
  ('S1+0', 'card_hit', 0.18), ('S2+6', 'scratch', 0.25), ('S3+6', 'pop', 0.3), ('S4+10', 'sparkle', 0.25), ('S5+0', 'room_tone', 0.12, 'onset', 'S7'),
  ('S6+8', 'ding', 0.25), ('S7+0', 'whoosh', 0.25), ('S8+0', 'alarm', 0.2), ('S9+20', 'paper', 0.3), ('S10+0', 'car_idle', 0.12, 'onset', 'S11'),
  ('S11+0', 'select_draw', 0.3), ('S12+8', 'cash', 0.25), ('S13+0', 'river', 0.2, 'onset', 'S15'), ('S14+0', 'paper', 0.3),
  ('S15+0', 'night_desert', 0.15, 'onset', 'S17'), ('S16+0', 'pop', 0.25), ('S17+20', 'rumble_syn', 0.2),
 ]),
 'c03': ('m_curious', None, [
  ('S1+0', 'card_hit', 0.2), ('S2+20', 'ding', 0.25), ('S3+0', 'night_desert', 0.12, 'onset', 'S6'), ('S5+0', 'sparkle', 0.25),
  ('S6+6', 'crowd_cheer', 0.15), ('S7+0', 'night_desert', 0.12, 'onset', 'S11'), ('S8+0', 'coins', 0.0001), ('S8+4', 'counter_tick', 0.25), ('S9+10', 'sparkle', 0.3),
  ('S10+10', 'cash', 0.3), ('S11+0', 'notify', 0.2), ('S11+10', 'buzz', 0.15), ('S12+0', 'shutter', 0.3), ('S13+10', 'scratch', 0.25),
  ('S14+10', 'buzzer', 0.0001), ('S14+10', 'drone_hit', 0.15), ('S15+30', 'pop', 0.25), ('S16+0', 'class_murmur', 0.15), ('S17+10', 'ding', 0.25),
  ('S18+10', 'tick', 0.2), ('S19+0', 'night_desert', 0.15, 'onset', 'S22'), ('S22+0', 'buzz', 0.35), ('S23+0', 'room_tone', 0.12),
  ('S24+0', 'river', 0.2), ('S24+0', 'drone_hit', 0.15),
 ]),
 'c04': ('m_curious', None, [
  ('S1+0', 'card_hit', 0.18), ('S1+0', 'river', 0.15), ('S2+6', 'whoosh', 0.25), ('S4+0', 'pool_syn', 0.15, 'onset', 'S5'), ('S5+0', 'sparkle', 0.2),
  ('S6+2', 'select_draw', 0.25), ('S7+14', 'select_draw', 0.25), ('S8+0', 'pool_syn', 0.2, 'onset', 'S10'), ('S8+0', 'counter_tick', 0.2),
  ('S10+24', 'drone_hit', 0.12), ('S11+0', 'river', 0.2, 'onset', 'S14'), ('S13+20', 'gulp', 0.0001), ('S14+0', 'rumble_syn', 0.18),
  ('S15+0', 'pool_syn', 0.18, 'onset', 'S16'), ('S17+30', 'pop', 0.25), ('S18+0', 'tick', 0.2), ('S19+0', 'sparkle', 0.3),
  ('S20+0', 'power_off', 0.3), ('S22+4', 'counter_tick', 0.2), ('S23+0', 'river', 0.18, 'onset', 'S24'),
 ]),
 'c05': ('m_tense', None, [
  ('S1+0', 'shutter', 0.3), ('S1+20', 'shutter', 0.25), ('S2+0', 'class_murmur', 0.1), ('S3+0', 'room_tone', 0.12, 'onset', 'S4'),
  ('S5+10', 'glitch', 0.25), ('S6+0', 'beep', 0.25), ('S7+8', 'select_draw', 0.25), ('S8+0', 'tick', 0.2), ('S8+40', 'drone_hit', 0.2),
  ('S9+0', 'shutter', 0.25), ('S11+0', 'whoosh', 0.25), ('S13+8', 'pop', 0.25), ('S14+0', 'drone', 0.12, 'onset', 'S16'),
  ('S16+0', 'whoosh', 0.25), ('S18+0', 'card_hit', 0.18), ('S19+10', 'switch_off', 0.3), ('S21+0', 'clock_back', 0.0001), ('S21+0', 'counter_tick', 0.2),
  ('S22+4', 'switch_off', 0.3), ('S23+0', 'room_tone', 0.12, 'onset', 'S26'), ('S26+0', 'buzz', 0.35), ('S26+4', 'notify', 0.3), ('S26+14', 'notify', 0.3),
 ]),
 'c06': ('m_tense', 'S21', [
  ('S1+0', 'pool_syn', 0.15, 'onset', 'S3'), ('S1+0', 'crowd_cheer', 0.08), ('S3+0', 'rumble_syn', 0.2), ('S4+0', 'pop', 0.25), ('S5+0', 'kids_cheer', 0.12),
  ('S6+0', 'card_hit', 0.18), ('S8+0', 'pool_syn', 0.18, 'onset', 'S10'), ('S10+0', 'crowd_cheer', 0.18), ('S11+14', 'drone_hit', 0.18),
  ('S13+0', 'gasp', 0.3), ('S14+0', 'crowd_shout', 0.15), ('S15+4', 'switch_off', 0.0001), ('S15+4', 'pop', 0.2), ('S15+12', 'pop', 0.2), ('S15+20', 'pop', 0.2),
  ('S16+0', 'heartbeat', 0.2), ('S18+0', 'card_hit', 0.2), ('S19+0', 'step', 0.25), ('S19+14', 'step', 0.25),
  ('S20+8', 'title_boom', 0.2), ('S21+0', 'pool_syn', 0.15, 'onset', 'S22'), ('S22+16', 'switch_off', 0.35), ('S22+17', 'power_down', 0.3),
  ('S23+12', 'switch_off', 0.35), ('S24+0', 'power_off', 0.2), ('S24+20', 'power_off', 0.2), ('S25+0', 'pool_syn', 0.2), ('S25+0', 'sparkle', 0.2),
 ]),
 'c07': ('m_sad', 'S9', [
  ('S1+0', 'pool_syn', 0.15, 'onset', 'S3'), ('S2+0', 'splash_syn', 0.15), ('S3+0', 'counter_tick', 0.2), ('S3+30', 'kids_cheer', 0.15),
  ('S5+10', 'sparkle', 0.2), ('S7+16', 'tick', 0.2), ('S9+0', 'river', 0.3, 'onset', 'S11'), ('S9+0', 'drone', 0.15, 'onset', 'S12'),
  ('S10+0', 'rumble_syn', 0.2), ('S11+12', 'gasp', 0.25), ('S12+20', 'drone_hit', 0.25), ('S13+0', 'scratch', 0.25), ('S14+0', 'ding', 0.25),
  ('S15+0', 'ding', 0.25), ('S16+30', 'ding', 0.25), ('S17+0', 'pop', 0.25), ('S19+0', 'card_hit', 0.18), ('S20+12', 'pop', 0.3), ('S20+0', 'drone', 0.12),
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
        'levels': {'sfx_lu': -10.0, 'music_lu': -16.0},
    }
    p.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + '\n')
    print(ch, len(evs), 'events,', len(used), 'clips')
