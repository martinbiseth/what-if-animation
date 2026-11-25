"""Sound for every chapter of everyone-gone, from the shared library only (no new clips, no credits).
python3 src/episodes/everyone-gone/sound.py   (from studio/)"""
import hashlib, json, shutil
from pathlib import Path

D = Path(__file__).parent
LIB = D.parents[2] / 'library' / 'sfx'

C = {
    'card_hit': ['a cinematic title hit, a deep soft boom with a short shimmering tail', 2.0],
    'title_boom': ['a cinematic whoosh rising into a deep boom impact', 1.6],
    'whoosh': ['a quick soft cartoon whoosh, airy transition', 0.6],
    'pop': ['a short bright cartoon pop', 0.5],
    'ding': ['a bright bell ding, correct answer', 0.8],
    'sparkle': ['a short bright magical sparkle twinkle, cartoon', 0.8],
    'gulp': ['a nervous cartoon gulp, short', 0.5],
    'gasp': ['two young people gasping in surprise at the same moment, cartoon, short', 0.8],
    'step': ['a single sneaker footstep on a wooden stair, close', 0.5],
    'door_shut': ['an old wooden door closing firmly with a latch click', 1.0],
    'tick': ['a slow old clock ticking in a quiet room', 4.0],
    'heartbeat': ['a slow tense heartbeat, low and muffled', 3.0],
    'drone': ['a dark low cinematic tension drone, slowly rising', 8.0],
    'drone_hit': ['a dark ominous low drone hit, deep cinematic horror sting', 2.6],
    'power_down': ['a whole city losing power, a deep electrical power-down whine dropping in pitch into silence', 2.5],
    'power_hum': ['a deep electrical power grid hum swelling louder, transformers buzzing, rising', 3.0],
    'power_off': ['an electronic device powering off, a short descending tone into silence', 1.2],
    'switch_off': ['a heavy electrical breaker switching off with a dull clunk', 0.5],
    'beep': ['a soft electronic low battery warning beep', 0.6],
    'buzz': ['a smartphone vibrating on a wooden table, two short buzzes', 1.2],
    'notify': ['a soft modern smartphone message notification chime', 0.8],
    'radio_syn': ['procedural: a short police radio crackle with squelch', 1.2],
    'counter_tick': ['a fast mechanical counter ticking up rapidly, digits rolling over, getting faster', 1.6],
    'roof_wind': ['a gentle evening breeze on a city rooftop, distant traffic', 7.0],
    'wind': ['wind blowing on a city rooftop at dusk, distant traffic far below', 6.0],
    'room_tone': ['quiet indoor room tone in the evening, faint distant city hum, no voices', 12.5],
    'kids_cheer': ['a group of children cheering and clapping outdoors', 2.0],
    'dizzy': ['cartoon dizzy birds tweeting in a circle after a bonk', 1.4],
    'scratch': ['a vinyl record scratch, music stops abruptly', 0.8],
    'clink': ['a ceramic coffee mug knocked by a hand on a wooden desk, short clink and scrape', 0.7],
    'knock': ['three firm knocks on an old wooden door', 1.2],
    'paper': ['a newspaper snapped open, paper rustle', 0.8],
    'laugh_low': ['a man in a dark room laughing very softly, a quiet amused chuckle', 1.6],
    'm_curious': ['curious playful pizzicato strings and celesta, light mystery, instrumental background loop', 20.0],
    'm_fun': ['upbeat playful 1920s ragtime piano with clarinet, light and curious, instrumental background loop', 20.0],
    'm_sad': ['soft sad solo piano, slow and gentle, instrumental background loop', 20.0],
    'm_tense': ['dark suspenseful underscore, slow pulsing low strings, instrumental background loop', 20.0],
}
# library files whose original prompts live on other branches: filed again under this episode's own prompts
ADOPT = {
    'alarm': ('alarm-5f93b07e.mp3', 'a bedside alarm clock beeping, library', 2.0),
    'flies': ('flies-1d102555.mp3', 'flies buzzing around, library', 2.0),
    'river': ('river-edb1d3c3.mp3', 'a river flowing at night, library', 6.0),
    'splash': ('splash_syn-d3d296ab.mp3', 'water splashing, library', 1.0),
    'water': ('water_spray-9d529395.mp3', 'water rushing, library', 2.0),
}
for n, (src, pr, s) in ADOPT.items():
    h = hashlib.sha1(f'{pr}|{s}'.encode()).hexdigest()[:8]
    dst = LIB / f'{n}-{h}.mp3'
    if not dst.exists():
        shutil.copy(LIB / src, dst)
    C[n] = [pr, s]

def sound(music, events, music_lu=-10.5, until=None):
    used = {e[1] for e in events} | {music}
    m = {'clip': music, 'loop': True}
    if until:
        m['until'] = until
    return {'clips': {k: C[k] for k in sorted(used)}, 'events': events, 'music': m, 'levels': {'sfx_lu': -3.0, 'music_lu': music_lu}}

S = {}
S['c01'] = sound('m_curious', [
    ['S1+0', 'alarm', 0.35, 'onset', 'S2+0'], ['S2+10', 'room_tone', 0.12], ['S6+6', 'clink', 0.35], ['S7+4', 'alarm', 0.25, 'onset', 'S8+0'],
    ['S8B+0', 'whoosh', 0.3, 'peak'], ['S8+0', 'wind', 0.15], ['S12+4', 'gasp', 0.35], ['S14+0', 'knock', 0.3], ['S18+0', 'drone', 0.15],
    ['S22+0', 'counter_tick', 0.35], ['S23+0', 'wind', 0.15], ['S24+0', 'title_boom', 0.5, 'peak'],
])
S['c02'] = sound('m_curious', [
    ['S1+0', 'card_hit', 0.4, 'peak'], ['S2+6', 'pop', 0.3], ['S3+0', 'tick', 0.12], ['S4+6', 'notify', 0.3],
    ['S6+0', 'pop', 0.3], ['S9+0', 'pop', 0.3], ['S12+0', 'buzz', 0.3], ['S14+0', 'radio_syn', 0.4], ['S15+0', 'radio_syn', 0.35],
    ['S17+18', 'power_off', 0.35], ['S18+4', 'drone_hit', 0.4, 'peak'],
])
S['c03'] = sound('m_fun', [
    ['S1+0', 'card_hit', 0.4, 'peak'], ['S3+10', 'ding', 0.35], ['S5+4', 'paper', 0.3], ['S7+6', 'sparkle', 0.3],
    ['S9+0', 'gulp', 0.35], ['S11+0', 'whoosh', 0.35, 'peak'], ['S13+0', 'splash', 0.35], ['S17+0', 'kids_cheer', 0.3],
    ['S19+0', 'scratch', 0.35], ['S21+4', 'drone', 0.15],
], music_lu=-11)
S['c04'] = sound('m_tense', [
    ['S1+0', 'card_hit', 0.45, 'peak'], ['S2+10', 'power_hum', 0.3], ['S3+0', 'tick', 0.1], ['trips', 'switch_off', 0.55],
    ['trips+4', 'power_down', 0.5], ['S6+0', 'roof_wind', 0.15], ['S7+4', 'power_down', 0.35], ['signal', 'power_off', 0.35],
    ['S9+30', 'beep', 0.3], ['S10+0', 'water', 0.17], ['S11+6', 'counter_tick', 0.3], ['S12+48', 'ding', 0.3],
    ['S13+0', 'flies', 0.2], ['S14+10', 'dizzy', 0.3], ['S15+0', 'pop', 0.25], ['S16+6', 'counter_tick', 0.25],
    ['S18+0', 'drone_hit', 0.45, 'peak'], ['S19+0', 'heartbeat', 0.15], ['S22+30', 'beep', 0.35], ['S23+0', 'tick', 0.12],
])
S['c05'] = sound('m_sad', [
    ['S1+0', 'card_hit', 0.35, 'peak'], ['S5+0', 'alarm', 0.3, 'onset', 'S6+0'], ['S6+0', 'knock', 0.3], ['S7+4', 'splash', 0.15],
    ['S8+0', 'pop', 0.2], ['S9+20', 'paper', 0.2], ['S10+0', 'room_tone', 0.15], ['S11+0', 'radio_syn', 0.35],
    ['S12+0', 'roof_wind', 0.15], ['S12B+8', 'counter_tick', 0.25], ['S15+6', 'sparkle', 0.3], ['S16+0', 'river', 0.12],
    ['S17+0', 'drone', 0.17], ['S19+0', 'sparkle', 0.3], ['S22+0', 'counter_tick', 0.25], ['S24+0', 'door_shut', 0.25],
    ['S25+0', 'drone_hit', 0.45, 'peak'],
], until='S17+0')
S['c06'] = sound('m_tense', [
    ['S1+0', 'card_hit', 0.4, 'peak'], ['S2+0', 'room_tone', 0.12], ['S4+6', 'gasp', 0.35], ['S5+0', 'radio_syn', 0.45],
    ['S5B+0', 'radio_syn', 0.4], ['S6+0', 'radio_syn', 0.4], ['S7+0', 'heartbeat', 0.17], ['S9+0', 'radio_syn', 0.35],
    ['S10+0', 'radio_syn', 0.35], ['S10B+0', 'radio_syn', 0.5], ['S11+0', 'drone_hit', 0.4, 'peak'], ['S12+20', 'power_off', 0.3],
    ['S13+0', 'tick', 0.15], ['S14+10', 'door_shut', 0.4], ['S15+0', 'card_hit', 0.4, 'peak'], ['S16B+0', 'sparkle', 0.25],
    ['S19+30', 'switch_off', 0.3], ['S20+0', 'step', 0.4], ['S21+0', 'whoosh', 0.3, 'peak'],
])
S['c07'] = sound('m_tense', [
    ['S1+0', 'card_hit', 0.4, 'peak'], ['S2+0', 'step', 0.3], ['S2+12', 'step', 0.3], ['S4+0', 'gasp', 0.3],
    ['flickers', 'power_off', 0.35], ['S6+0', 'door_shut', 0.45], ['S6+2', 'drone_hit', 0.45, 'peak'], ['barks', 'step', 0.01],
    ['S9+0', 'drone', 0.2], ['S11+0', 'radio_syn', 0.5], ['S11B+0', 'drone_hit', 0.5, 'peak'], ['S13+0', 'heartbeat', 0.15],
    ['S14+0', 'card_hit', 0.4, 'peak'], ['S15+0', 'whoosh', 0.3, 'peak'], ['S15B+0', 'title_boom', 0.45, 'peak'],
    ['S16+0', 'whoosh', 0.3, 'peak'],
], music_lu=-11)
for c, s in S.items():
    p = D / c / 'episode.json'
    ep = json.loads(p.read_text())
    ep['sound'] = s
    p.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + '\n')
    print(c, len(s['events']), 'events')
