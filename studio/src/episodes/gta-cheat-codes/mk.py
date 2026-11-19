"""Write a chapter's shots and edit into its episode.json from a compact list (keeps script, science, sound).
python mk.py c01   (reads SHOTS[c01] below)"""
import json, sys, pathlib
D = pathlib.Path(__file__).parent
SHOTS = {
 'c01': [('S1','wide','f:0','fall down the stairs'),('S2','close','land','land on your head'),('S3','medium','stand','stand up, INVINCIBLE'),
         ('S4','insert','open','sock drawer opens'),('S4b','insert','quarter','cash in the drawer'),('S5','close','Again','smug, bills raining'),('S6','insert','press','controller, five buttons'),
         ('S7','wide','bright','red car drops onto the street'),('S8','wide','this','jetpack over the traffic'),('S9','medium','With','you on the jetpack'),
         ('S10','wide','Five','yard sale, $2'),('S11','insert','Taped','the list on the back'),('S12','insert','one','the scribbled line'),
         ('S13','card','So#2','title'),('S13b','insert','Not','a game on a TV'),('S14','wide','street','your street'),('S15','close','body','your body'),('S16','wide','bank','your bank'),
         ('S17','close','every','a catch')],
 'c03': [('S1','card','f:0','MONDAY'),('S2','two-shot','bets','top of the hill'),('S3','wide','Nobody','the hill'),
         ('S4','wide','don\'t','skating down'),('S5','wide','fly','over the van into the hedge'),('S6','medium','stand','leaf in hair'),
         ('S7','close','drops','Mo drops his phone'),('S8','close','Do','do it again'),('S9','insert','Tuesday','MONEY'),
         ('S10','medium','sports','a bag drops on the bed'),('S11','insert','Inside','the stacks'),('S12','wide','enter','a room of bags'),
         ('S13','medium','pizza','eleven hundred pizzas'),('S14','wide','raining','rain'),('S15','wide','Sunshine','clouds part'),
         ('S16','insert','TV','weather map'),('S17','insert','Wednesday','SPAWN CAR'),('S18','wide','rumble','the car drops'),('S18b','insert','Brand','brand new, keys in'),
         ('S19','medium','fourteen','keys, can\'t drive, a blue one'),('S20','medium','Ellie','Ellie in her car'),('S21','insert','Thursday','JETPACK'),
         ('S22','wide','bang','lift off, shoes stay'),('S23','wide','fly','over the traffic and the bus'),('S23b','wide','principal\'s','over the principal\'s car'),('S24','wide','land','school roof'),
         ('S25','medium','waiting','Mo waiting'),('S26','close','Okay','me next'),('S27','wide','For','luckiest'),('S28','close','Then','smell burning')],
 'c04': [('S2','insert','f:0','sleeve on fire'),('S3','wide','leaned','at the stove, calm'),
         ('S4','close','didn\'t','you didn\'t feel a thing'),('S5','card','Pain','PAIN = ALARM'),('S6','card','real','born without it'),
         ('S7','card','Kids','bitten tongues, broken bones'),('S7b','card','burn','burns'),('S8','medium','body','your clothes still can'),('S9','wide','money','the bank'),
         ('S10','insert','teller','held up to the light'),('S11','insert','side','side by side'),('S12','insert','hand','silent alarm'),
         ('S13','insert','serial','same serial number'),('S14','card','bag','the same bag, copied'),('S15','card','counterfeit','COUNTERFEIT'),
         ('S16','card','cars','from somewhere'),('S17','card','Einstein','E = mc2'),('S17b','card','To','one car from nothing'),('S18','card','need','135 billion billion joules'),
         ('S19','card','fifth','a fifth of the world\'s energy'),('S20','wide','every','the street lights flicker'),('S21','card','jetpack','10 minutes'),
         ('S21b','insert','Yours','the gauge never moves'),('S22','wide','Which','3,000 ft, next to a plane')],
 'c02': [('S1','card','f:0','SATURDAY'),('S2','medium','controller','no cable, no batteries'),('S3','insert','But','first code'),
         ('S4','close','something','a chime, letters forming'),('S4b','close','Cheat','CHEAT ACTIVATED: INVINCIBLE'),('S5','insert','poke','fork'),('S6','insert','drop','dictionary on foot'),
         ('S7','wide','throw','down the stairs on purpose'),('S8','insert','rules','the rules'),('S9','insert','One','rule 1'),
         ('S10','insert','Two','rule 2'),('S11','insert','three','rule 3'),('S12','insert','Under','the scribbles')],
}
EXTRA = {'c01': {'pace': {'min_cuts': 24, 'max_hold': 4}, 'tail': 0.6}}
ch = sys.argv[1]
p = D / ch / 'episode.json'
ep = json.loads(p.read_text())
ep['shots'] = [{'id': i, 'size': s, 'note': n, 'key': 30} for i, s, c, n in SHOTS[ch]]
ep['edit'] = [{'shot': i, 'at': c} for i, s, c, n in SHOTS[ch]]
ep.setdefault('fx', [])
ep.update(EXTRA.get(ch, {}))
p.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + '\n')
print(ch, len(ep['shots']), 'shots')
