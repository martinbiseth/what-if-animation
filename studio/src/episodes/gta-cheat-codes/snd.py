"""Sound for every chapter: library clips only (0 credits). python snd.py"""
import json, pathlib
D = pathlib.Path(__file__).parent
CAT = json.load(open('/tmp/claude-0/-home-claude/9b8aac2a-47a3-542e-93e9-4b5529bb0a03/scratchpad/catalog_ok.json')) if pathlib.Path('/tmp/claude-0/-home-claude/9b8aac2a-47a3-542e-93e9-4b5529bb0a03/scratchpad/catalog_ok.json').exists() else None
CH = {
 'c01': {'music': 'music', 'ev': [
   ['S1+2','tumble',0.5],['S2+6','land',0.5],['S2+10','dizzy',0.3],['S3+10','sparkle',0.4],['S4+4','slide',0.4],['S4b+2','cash',0.4],
   ['S5+0','paste_pop',0.3],['S6+3','select_draw',0.3],['S7+2','paste_pop',0.45],['S7+16','land',0.5],['S8+0','jet_syn',0.25,'onset','S10'],
   ['S10+0','street',0.12,'onset','S11'],['S11+0','paper',0.4],['S12+20','scratch',0.25],['S13+0','title_boom',0.55,'peak'],['S13b+36','power_off',0.4],
   ['S14+0','whoosh',0.3],['S16+0','whoosh',0.3],['S17+0','drone_hit',0.5,'peak']], 'until': 'S17'},
 'c02': {'music': 'm_curious', 'ev': [
   ['S1+0','card_hit',0.4,'peak'],['S2+0','room_tone',0.15,'onset','S8'],['S3+30','select_draw',0.3],['S3+70','select_draw',0.3],['S4+0','sparkle',0.45],
   ['S4b+0','glitch',0.35],['S5+14','clink',0.4],['S6+14','land',0.45],['S7+16','tumble',0.5],['S7+90','land',0.4],['S8+0','paper',0.4],
   ['S9+0','pop',0.3],['S10+0','pop',0.3],['S11+0','drone_hit',0.35,'peak'],['S12+0','heartbeat',0.2]]},
 'c03': {'music': 'music', 'ev': [
   ['S1+0','card_hit',0.4,'peak'],['S4+0','fall_whoosh',0.3],['S5+0','whoosh',0.4,'peak'],['S5+52','thud',0.5],['S6+40','sparkle',0.25],
   ['S7+10','phone_crack',0.4],['S9+44','paste_pop',0.4],['S10+12','land',0.45],['S11+60','counter_tick',0.3],['S12+0','cash',0.3],
   ['S13+0','kids_cheer',0.25],['S14+0','storm',0.25,'onset','S15'],['S15+20','sparkle',0.4],['S16+0','gasp',0.2],
   ['S17+36','paste_pop',0.4],['S18+4','rumble_syn',0.4],['S18+30','land',0.5],['S18b+0','shades',0.4],['S19+0','paste_pop',0.3],
   ['S20+0','paste_pop',0.3],['S21+36','paste_pop',0.4],['S22+12','title_boom',0.45,'peak'],['S22+14','jet_syn',0.3,'onset','S24'],
   ['S24+20','alarm',0.25],['S24+24','land',0.4],['S26+0','crowd_cheer',0.15],['S28+0','fire',0.15]], 'until': 'S28'},
 'c04': {'music': 'm_curious', 'ev': [
   ['S2+0','fire',0.35,'onset','S5'],['S5+0','alarm',0.3],['S6+0','card_hit',0.3,'peak'],['S7+20','buzzer',0.25],['S7b+4','buzzer',0.25],
   ['S9+0','room_tone',0.12,'onset','S12'],['S10+0','paper',0.3],['S11+30','ding',0.3],['S12+30','beep',0.35],['S13+0','drone_hit',0.35,'peak'],
   ['S15+0','title_boom',0.4,'peak'],['S17+0','card_hit',0.35,'peak'],['S18+8','counter_tick',0.25],['S19+8','power_hum',0.25],
   ['S20+20','power_down',0.35],['S21+8','counter_tick',0.2],['S22+0','jet_syn',0.35,'onset']]},
 'c05': {'music': 'm_tense', 'ev': [
   ['S2+0','jet_syn',0.2,'onset','S4'],['S4+0','card_hit',0.3,'peak'],['S5+0','notify',0.3],['S6+0','notify',0.4],['S7+60','drone_hit',0.25],
   ['S9+0','buzz',0.3],['S10b+0','card_hit',0.35,'peak'],['S12+0','car_idle',0.2,'onset','S13'],['S13+20','doorbell',0.4],
   ['S15+0','car_idle',0.15,'onset','S16'],['S16+6','buzz',0.4],['S17+0','drone_buzz',0.2,'onset','S18'],['S18+0','drone_hit',0.4,'peak']]},
 'c06': {'music': 'm_tense', 'ev': [
   ['S3+0','card_hit',0.3,'peak'],['S6+0','door_shut',0.35],['S7+0','cough',0.25],['S9b+0','drone_hit',0.3,'peak'],['S10+0','step',0.4],['S10+10','step',0.4],
   ['S10+20','step',0.4],['S11+14','door_shut',0.4],['S13+0','heartbeat',0.25,'onset','S14'],['S14+0','title_boom',0.5,'peak'],['S15+20','step',0.45],
   ['S15+40','step',0.45],['S15+60','step',0.45],['S16+0','knock',0.35],['S17+4','buzz',0.4],['S20+0','heartbeat',0.25,'onset','S21'],['S21+0','select_draw',0.3]],
   'until': 'S20'},
 'c07': {'music': 'm_sad', 'from': 'S9', 'ev': [
   ['S1+30','power_off',0.4],['S5+0','drone',0.2,'onset','S9'],['S6+4','glitch',0.4],['S7+6','door_shut',0.35],['S8+20','sparkle',0.3],
   ['S9+0','drone_hit',0.4,'peak'],['S10+0','card_hit',0.3,'peak'],['S11+6','ding',0.3],['S11b+6','ding',0.3],['S11c+6','ding',0.3],['S11d+6','ding',0.3],
   ['S12+0','pop',0.3],['S13+0','title_boom',0.35,'peak']]},
}
for ch, s in CH.items():
    p = D / ch / 'episode.json'
    ep = json.loads(p.read_text())
    names = {e[1] for e in s['ev']} | {s['music']}
    clips = {n: CAT[n] for n in sorted(names)}
    music = {'clip': s['music'], 'loop': True}
    if 'until' in s: music['until'] = s['until']
    if 'from' in s: music['from'] = s['from']
    ep['sound'] = {'clips': clips, 'events': s['ev'], 'music': music, 'levels': {'sfx_lu': -8.0, 'music_lu': -16.0}}
    p.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + '\n')
print('ok')
