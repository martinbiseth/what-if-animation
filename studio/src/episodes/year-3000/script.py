import json, pathlib
root = pathlib.Path(__file__).resolve().parent
CH = [
 ("c01", "Wake up", [
  "You open your eyes. Everything is white. A little round robot floats over your face and says, 'Good morning. You have been asleep for nine hundred and seventy-four years.'",
  "You laugh. Then you look out the window.",
  "The sky is full of things that fly without wings. The towers are taller than the clouds. And there are no cars. Not one.",
  "You ask the robot for a glass of water. It hands you a little clear cube. You bite it. It's water.",
  "You reach for your phone. It's not in your pocket. It's in a glass case across the room, with a little sign: 'Smartphone. Early twenty-first century. Do not touch.'",
  "You ask a kid where you are. He stares at you like you just barked.",
  "You pull out your wallet to buy a drink. The whole shop laughs.",
  "This is the year three thousand. And everything you know is from twenty twenty-six. So how long would you actually last?",
 ], []),
 ("c02", "How you got here", [
  "Here's how it happened. Back in twenty twenty-six, a clinic paid you one hundred dollars to test a new sleep pod. 'Just one night,' they said.",
  "Something went wrong. Nobody came to wake you up. For almost a thousand years.",
  "That sounds crazy, but people really try this. In nineteen sixty-seven, a man named James Bedford became the first person ever frozen after he died, hoping the future could fix him. He is still waiting. Nobody has ever been brought back.",
  "Except you. What if you woke up in the year three thousand?",
  "The robot's name is Vee. It works for the city museum. It gives you a tiny earpiece so you can understand people, and it gives you the rules. 'You get seven days of free credit. After that, you need a job, like everyone else.'",
  "Then you notice something. Everyone here has a tiny blue light behind their ear. Everyone except you. Vee sees you looking, and says nothing.",
 ], [
  {"claim": "James Bedford was the first person to be cryopreserved after legal death, in January 1967, and is still in storage; no cryopreserved person has ever been revived.",
   "working": "Bedford, a psychology professor, was frozen on 12 January 1967 and is kept at the Alcor Life Extension Foundation. No technology exists to revive a cryopreserved human.",
   "source": "Alcor Life Extension Foundation, 'Dr. James Bedford' (alcor.org); Shoffstall, 'Freeze, wait, reanimate', Health Matrix 26 (2016)"},
 ]),
 ("c03", "The fun part", [
  "Day one. You're famous.",
  "News moves fast in the year three thousand. By lunch, a crowd is waiting outside the museum to see the person from twenty twenty-six.",
  "And the first face in the crowd stops your heart. It's Mo. Your best friend, Mo. Same face, same grin, same laugh.",
  "'I'm Mo Seven,' he says. 'Your Mo was my great, great, great... a lot of greats... grandfather.'",
  "That's not as crazy as it sounds. Nine hundred and seventy-four years is about thirty-two generations. Go back thirty-two generations, and your family tree has over four billion spots for ancestors. That's more people than were alive back then, so family trees fold into each other. If Mo had kids, a huge part of this city could be his family.",
  "Mo Seven becomes your guide. And you start showing off.",
  "First he shows you his city. The bus comes when you look at the stop. Dinner gets printed in front of you, in any shape you like. You ask for a burger. It looks like a burger, tastes like a burger, and has never been anywhere near a cow.",
  "You write your name with a pen. Nobody here has written by hand in five hundred years. The kids gasp like it's magic.",
  "You tie your shoelaces. A small crowd films it.",
  "A little girl asks if it's true that people used to wait for things. You tell her about loading bars. She bursts into tears.",
  "At the museum, you give tours of your own time. You explain that the glass rectangle was mostly for watching short videos of cats. They think you're joking. You're not.",
  "Every tour pays you credits. By day three, you're rich. Mo Seven says you're the most famous person in the city.",
  "You think you've got this figured out.",
  "But on day four, you sneeze.",
 ], [
  {"claim": "974 years is about 32 generations, and 32 generations back a family tree has over 4 billion ancestor slots, more than the people alive then, so trees overlap; within roughly a thousand years a person with descendants is likely an ancestor of a large share of their region.",
   "working": "974 / 30 years per generation = 32.5. 2^32 = 4,294,967,296 ancestor slots, while the world population around the year 1000 was roughly 250-300 million, so the same people fill many slots (pedigree collapse). Modelling puts the common ancestor of everyone alive only a few thousand years back.",
   "source": "Rohde, Olson & Chang, 'Modelling the recent common ancestry of all living humans', Nature 431 (2004); Our World in Data, world population over the long run"},
 ]),
 ("c04", "The catch", [
  "At first, it's just a sneeze. Then a fever. By night, you can't get out of bed.",
  "Vee scans you. 'This is a common cold. Children here catch it and feel nothing.'",
  "Here's the problem. Viruses never stop changing. The flu changes so much that scientists make a new flu vaccine every single year. Your body learned to fight the germs of twenty twenty-six. It has never seen almost a thousand years of new ones.",
  "It has happened before. After fourteen ninety-two, diseases from Europe reached the Americas, where nobody had immunity. Within about a century, in many places, around nine out of ten people had died.",
  "Vee gives you a shot that fixes you in an hour. Without the future's medicine, that little cold could have been the end of you.",
  "Some things barely change. Earth's spin is slowing down, so the day gets about two thousandths of a second longer every century. After nine hundred and seventy-four years, your day is longer by about seventeen thousandths of a second. That's the one change you will never notice.",
  "Then comes the next problem. Talking. Without your earpiece, nobody understands a word you say.",
  "That's real too. English changes all the time. Beowulf was written in English about a thousand years ago, and today almost nobody can read it without lessons. It starts with the word 'Hwaet.' To the people of the year three thousand, you sound just as strange.",
  "And then, the worst one. Work. Your seven days of credit are almost gone, and the tours are getting old.",
  "You look for a job. Every job you know how to do is done by machines.",
  "That happened to your great-grandparents too. In nineteen hundred, about four in ten American workers worked on farms. By the year two thousand, it was fewer than two in a hundred.",
  "In the year three thousand, your skills are like a horse and cart. Fun to look at. Useless.",
  "And that's when someone else starts paying attention.",
 ], [
  {"claim": "Influenza viruses change constantly (antigenic drift), so the flu vaccine is reviewed and updated every year.",
   "working": "Small mutations in the flu virus's surface proteins add up each season; WHO meets twice a year to recommend the strains for the next vaccine.",
   "source": "CDC, 'How the Flu Virus Can Change: Drift and Shift'; WHO, recommendations for influenza vaccine composition"},
  {"claim": "After 1492, diseases introduced from Europe contributed to a population collapse in the Americas of about 90% within roughly a century.",
   "working": "Koch et al. estimate about 60.5 million people lived in the Americas in 1492 and about 56 million died by 1600, a decline of around 90%, mostly from introduced epidemic diseases.",
   "source": "Koch, Brierley, Maslin & Lewis, 'Earth system impacts of the European arrival and Great Dying in the Americas after 1492', Quaternary Science Reviews 207 (2019)"},
  {"claim": "Beowulf, written in Old English about a thousand years ago, cannot be read by modern English speakers without study; its first word is 'Hwaet'.",
   "working": "The only manuscript (Cotton MS Vitellius A XV) is dated to roughly 975-1025 AD. Old English grammar, spelling and vocabulary differ so much from modern English that it is studied like a foreign language.",
   "source": "British Library, 'Beowulf' (Cotton MS Vitellius A XV)"},
  {"claim": "The length of the day grows by about 1.8 thousandths of a second per century, so after 974 years a day is roughly 17 thousandths of a second longer.",
   "working": "Historical eclipse records give an average increase in the length of day of 1.78 ms per century; 1.78 x 9.74 = 17.3 ms.",
   "source": "Stephenson, Morrison & Hohenkerk, 'Measurement of the Earth's rotation: 720 BC to AD 2015', Proc. R. Soc. A 472 (2016)"},
  {"claim": "In 1900 about 41% of the US workforce worked in agriculture; by 2000 it was 1.9%.",
   "working": "USDA figures: 41 percent of the workforce in 1900, 1.9 percent in 2000.",
   "source": "Dimitri, Effland & Conklin, 'The 20th Century Transformation of U.S. Agriculture and Farm Policy', USDA ERS EIB-3 (2005)"},
 ]),
 ("c05", "The Archive", [
  "Day six. A woman in a silver suit walks into the museum. Everybody steps aside for her.",
  "'I am from the Archive,' she says. 'We keep the history of the human race. And you are history.'",
  "She smiles. It is not a friendly smile.",
  "'Your credit runs out tomorrow. You have no light. To the city, you do not exist. You cannot buy food, open a door, or ride a train.'",
  "So that's what the blue light is. It's everyone's name, money and key, all in one. And you don't have one.",
  "To prove it, she walks you to a door. It slides open for her. You step up. Nothing. The door doesn't even see you. Mo Seven says nobody here has opened a door by hand in two hundred years.",
  "'But we can give you a home,' she says. 'A beautiful room. Food. Doctors. Forever.'",
  "She shows you the room. It is beautiful. It's also made of glass. And outside the glass, there's a sign with your name on it, and the words: 'Living exhibit. Twenty twenty-six.'",
  "Mo Seven grabs your arm. 'If you go in there, they will never let you out.'",
  "The woman hears him. 'Mo Seven,' she says, 'helping a person with no light is a crime.'",
  "Now it's not just you who's in trouble.",
  "You have until tomorrow to decide.",
 ], []),
 ("c06", "One message", [
  "That night, you can't sleep. So you walk through the empty museum, past your own phone in its glass case.",
  "At the back, there's a room you've never seen. A sign says 'Family records.' Vee opens the door.",
  "Inside, on a screen, is a name you know. Your little sister.",
  "There's a message. It was recorded in twenty seventy-one. She's an old woman now, with the same laugh.",
  "'If you ever wake up,' she says, 'I'm sorry we couldn't wait for you. I looked for you every year. I never gave up.'",
  "Then she leans close to the camera. 'And don't let anyone put you in a box. I left you something. Look for our name.'",
  "She holds up an old photo of the two of you on a trampoline. 'And you still owe me a rematch.'",
  "Vee shows a map. A tiny dot glows at the edge of the old city, in a place nobody goes anymore.",
  "In the morning, the woman in silver is waiting by the glass room. The door is open. Food, safety, doctors. Forever.",
  "Mo Seven is standing by the exit. No light. No money. No promises.",
  "Vee floats beside you. 'I am not allowed to help you leave,' it says. Then, very quietly, the exit door slides open.",
  "You look at the glass room. You look at Mo Seven.",
  "And you walk out the door.",
  "Behind you, the woman whispers two words into her sleeve. 'Find them.'",
 ], []),
 ("c07", "Our name", [
  "It takes you all day to reach the old city. Broken towers, green with plants, quiet as a library.",
  "The dot leads you to a metal door. On it, scratched by hand, is your family name.",
  "Inside, it's cold. There's a sleep pod. Exactly like yours.",
  "And it's switched on.",
  "The screen says: 'Asleep since twenty twenty-six. Wake date: today.' Mo Seven wipes the frost off the glass.",
  "And the face inside... is yours.",
  "Mo Seven's hand is shaking. There's a note taped to the glass, in your sister's handwriting. It says: 'One of you is the copy.'",
  "So who woke up in the museum?",
  "Is any of this real? The science is. Germs change faster than your body can learn them. A thousand years makes English almost unreadable. And thirty-two generations make nearly everyone family. The sources are in the description.",
  "What would you do first in the year three thousand? Tell me in the comments, and subscribe so you don't miss part two.",
 ], []),
]
V = {"id": "TX3LPaxmHKxFdv7VOQHJ", "model": "eleven_multilingual_v2", "settings": {"stability": 0.45, "similarity_boost": 0.8, "style": 0.3, "use_speaker_boost": True}}
G = {"word": 0.14, "comma": 0.25, "sentence": 0.42, "question": 0.6}
topic = "What if you woke up in the year 3000?"
series = {"id": "Year3000", "slug": "year-3000", "topic": topic, "title": ["WHAT IF YOU WOKE UP", "IN THE YEAR 3000?"], "target_seconds": 540,
  "defaults": {"voice": V, "gaps": G, "pace": {"min_cuts": 8, "max_hold": 8}}, "chapters": []}
md = ["# What If You Woke Up in the Year 3000?\n"]
total = 0
for slug, name, lines, sci in CH:
    d = root / slug; d.mkdir(parents=True, exist_ok=True)
    n = sum(len(l.split()) for l in lines); total += n
    series["chapters"].append({"slug": slug, "name": name, "words": n})
    ep = {"id": f"Year3000{slug.upper()}", "slug": f"year-3000/{slug}", "chapter": name, "topic": topic,
          "script": [{"beat": f"p{i+1}", "text": t} for i, t in enumerate(lines)], "science": sci}
    if slug == "c01": ep["pace"] = {"min_cuts": 18, "max_hold": 5}
    p = d / "episode.json"
    if p.exists():
        old = json.loads(p.read_text()); old.update({k: ep[k] for k in ("script", "science", "chapter")}); ep = old
    p.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + "\n")
    md.append(f"\n## {slug}: {name} ({n} words)\n\n" + "\n\n".join(lines) + "\n")
    for s in sci: md.append(f"\n> **Fact:** {s['claim']}  \n> {s['working']}  \n> _Source: {s['source']}_\n")
sp = root / "series.json"
if sp.exists():
    old = json.loads(sp.read_text()); old["chapters"] = series["chapters"]; series = old
sp.write_text(json.dumps(series, indent=1, ensure_ascii=False) + "\n")
md.insert(1, f"\n{total} words, 7 chapters.\n")
out = pathlib.Path('/mnt/project-files/what-if/year-3000'); out.mkdir(parents=True, exist_ok=True)
(out / "manus.md").write_text("".join(md))
print(total, [c["words"] for c in series["chapters"]])
