"""Writes the script and science of every chapter into its episode.json, and the manus for Martin.
python src/episodes/never-sleep/script.py"""
import json, pathlib
D = pathlib.Path(__file__).resolve().parent

S = {
'c01': ("Hour zero", [
 "It's three a.m. Your whole house is asleep. Your mum. Your little sister Ellie. Even the cat.",
 "Everyone except you.",
 "Because last night, something switched off inside your head. You lay down, closed your eyes, and nothing happened. No yawn. No heavy eyelids. Nothing.",
 "You're not tired. And you won't be. Not tonight, not tomorrow, not ever again.",
 "At first, it sounds like a superpower. Eight free hours, every single night. Homework done by midnight. A new hobby by two. Breakfast for the whole family by six.",
 "But your body keeps its own clock. By hour nineteen, your brain works like it's had a few drinks. By day three, the shadows in the hallway start to move. And by day eleven, you'll be chasing a world record that nobody is even allowed to attempt anymore.",
 "So what really happens, hour by hour, if you never sleep again?",
], []),
'c02': ("The broken alarm", [
 "Here's the deal. Your brain has stopped sending the signal that says, sleep now. You don't feel tired. Your eyes don't burn. You don't yawn.",
 "But here's the catch nobody told you. Feeling tired and needing sleep are two different things.",
 "Feeling sleepy is just the alarm. It comes from a chemical called adenosine, which builds up in your brain every hour you're awake. Every hour you're awake, more of it piles up, like sand in an hourglass. Sleep is what tips the hourglass back over. Coffee works by blocking it.",
 "Your alarm is broken. But the clock is still ticking.",
 "So you make one rule. If anything weird happens, anything at all, you tell Mo. Mo is your best friend, and the most honest person you know. You even write it on a sticky note on your mirror. Tell Mo.",
 "Mo thinks about it. 'Deal. But if you ever start talking to the fridge, I'm calling your mum.'",
 "Remember the fridge.",
], [
 {"claim": "Sleepiness builds with adenosine during waking hours, and caffeine works by blocking adenosine receptors.",
  "working": "Adenosine accumulates in the basal forebrain during prolonged wakefulness and promotes sleep; caffeine is an adenosine receptor antagonist.",
  "source": "Porkka-Heiskanen et al., Science 276 (1997); Fredholm et al., Pharmacological Reviews 51 (1999)"},
]),
'c03': ("Eight free hours", [
 "Night one. Eight hours of silence. You've never had this much time.",
 "You finish all your homework by midnight. Then next week's homework. Then you reorganise your whole room by colour.",
 "Two a.m. You learn to juggle. Badly. Then a little less badly.",
 "Three a.m. You teach yourself four songs on the guitar, with the volume turned all the way down.",
 "Four a.m. You finish a three-hundred-page book and start another one. Then the sun comes up, and you watch the whole sunrise from the roof, like a movie made just for you.",
 "Do the maths. Most people sleep about a third of their life away. For most people, that's twenty-five years or more with their eyes closed. Twenty-five years you just got back.",
 "Six a.m. Your mum walks into the kitchen and finds breakfast already made. Pancakes. Fresh juice. Her coffee, just how she likes it. She looks at you. Then at the pancakes. Then back at you. 'What did you break?'",
 "At school, you're the first one there. You've read the whole chapter, and the next three. When the teacher asks a question, your hand is already up. Your friends are yawning into their lunch. You're on your third apple, explaining photosynthesis to anyone who will listen.",
 "Night two, you start a business. You walk dogs at midnight for people who work night shifts. Five dogs, five leashes, one very long walk. One of them is a Great Dane called Pickle. Mostly, Pickle walks you.",
 "Ellie catches you sneaking home at four a.m. with five leashes around your wrist. 'You don't sleep anymore,' she whispers. 'That's so cool.'",
 "And for about a day and a half, it is.",
 "Because there's something your brain does every night while you sleep. Something you just stopped doing.",
], [
 {"claim": "Adults sleep roughly a third of their life: at 8 hours a night, 25 years or more of a typical lifespan.",
  "working": "8 h / 24 h = 1/3. A 75-80 year life at 7-8 h a night is about 22-27 years asleep; '25 years or more' for most people at 8 h.",
  "source": "Arithmetic on WHO global life expectancy (73 years, 2019) and typical adult sleep of 7-9 h (AASM/SRS consensus, Sleep 2015)"},
]),
'c04': ("The catch", [
 "Hour nineteen. You're walking to school, and you can't remember if you locked the front door. Or which house is yours.",
 "That part is real. After about seventeen to nineteen hours awake, people do as badly on reaction tests as someone with a blood alcohol level of point zero five. In many countries, that's already over the limit for driving.",
 "Hour twenty-four. It's worse. Point one. Like being properly drunk, except you're completely sober, holding a sandwich in maths class.",
 "And then it starts. Microsleeps. Your brain switches off for a second or two, without asking you. Your eyes stay open. You just aren't there. Microsleeps are why tired drivers drift out of their lane. Their eyes are open, and for a few seconds, nobody is driving.",
 "You blink, and the teacher is on a different page. You blink again, and the lesson is over.",
 "Here's why. While you sleep, your brain cleans itself. Fluid washes through it and carries away the waste that builds up during the day. In sleeping mice, scientists found that the spaces between brain cells open up by about sixty percent, so the fluid can flush through.",
 "You're not getting that wash. In one study, a single night without sleep raised a waste protein called beta-amyloid, the one linked to Alzheimer's, by about five percent.",
 "And your memory? After one sleepless night, people's ability to store new memories dropped by about forty percent. You read three chapters last night. Today, you can't remember any of them.",
 "Hour forty-eight. Your stomach is roaring. Losing sleep pushes up the hormone that makes you hungry and pushes down the one that tells you you're full. You've eaten four lunches. Mo stops sharing his crisps.",
 "And on the morning of day three, you walk into the kitchen, and the fridge says good morning.",
], [
 {"claim": "After 17-19 hours awake, performance is equivalent to a blood alcohol concentration of 0.05%.",
  "working": "Subjects kept awake 17-19 h performed on several tests as badly as at 0.05% BAC.",
  "source": "Williamson & Feyer, Occupational and Environmental Medicine 57 (2000)"},
 {"claim": "After 24 hours awake, performance is equivalent to about 0.10% BAC.",
  "working": "Tracking performance after 24 h of wakefulness matched that at a BAC of roughly 0.10%.",
  "source": "Dawson & Reid, Nature 388 (1997)"},
 {"claim": "During sleep the interstitial space of the brain expands by about 60%, speeding the clearance of waste.",
  "working": "In mice, interstitial volume rose from ~14% to ~23% of brain volume during sleep, a 60% increase, with faster clearance of beta-amyloid.",
  "source": "Xie et al., Science 342 (2013)"},
 {"claim": "One night of sleep deprivation raised beta-amyloid in the brain by about 5%.",
  "working": "PET imaging in 20 healthy adults after one night without sleep showed ~5% more beta-amyloid in the hippocampus and thalamus.",
  "source": "Shokri-Kojori et al., PNAS 115 (2018)"},
 {"claim": "One night without sleep cut the ability to form new memories by about 40%.",
  "working": "Sleep-deprived subjects showed a ~40% deficit in memory encoding compared with rested subjects.",
  "source": "Yoo et al., Nature Neuroscience 10 (2007)"},
 {"claim": "Sleep loss raises ghrelin (hunger) and lowers leptin (fullness).",
  "working": "Two nights of 4 h sleep: ghrelin +28%, leptin -18%, hunger +24%.",
  "source": "Spiegel et al., Annals of Internal Medicine 141 (2004)"},
]),
'c05': ("Someone notices", [
 "Day three. The fridge isn't really talking. You know that. Mostly.",
 "This is real too. After about three days without sleep, people start to see things that aren't there. First it's the edges: patterns crawling on the wall, shadows moving in the corner of your eye. Then whole things. Voices. People.",
 "That night, the wallpaper in your room starts to ripple, like water. The coat on your door looks exactly like someone standing there, watching you. You turn on every light in the house, and sit in the middle of the kitchen until morning.",
 "You keep your promise. You tell Mo. Mo looks at you for a long time. 'Okay. That's the fridge. I'm calling your mum.'",
 "Day five. Your mum takes you to the doctor. The doctor sends you to a sleep clinic. The sleep clinic glues a tangle of wires to your head and watches you all night.",
 "You don't sleep for one second. The machine draws a busy, wide-awake line, hour after hour. 'That's not possible,' the technician says, tapping the screen. 'Everybody sleeps.' She calls her boss. Her boss calls someone else.",
 "Day seven. A man in a grey suit is waiting in the clinic. He doesn't have a name tag. He has a folder with your name on it. He sits down and slides a black-and-white photo across the table. A teenage boy, grinning, surrounded by scientists.",
 "'Do you know who Randy Gardner was?' he asks. In the winter of nineteen sixty-three, Randy was seventeen. For a school science fair, he stayed awake for eleven days and twenty-five minutes. It's still the longest scientifically recorded stretch without sleep. Guinness World Records stopped accepting attempts, because it's too dangerous.",
 "'You'll pass him in four days,' the man says. 'And we'd like to watch.'",
], [
 {"claim": "After about three days without sleep, people develop visual distortions and then complex hallucinations.",
  "working": "A review of 21 studies found perceptual distortions, anxiety and depersonalisation rising with time awake, with complex hallucinations and delusions after about 72 hours.",
  "source": "Waters et al., Frontiers in Psychiatry 9 (2018)"},
 {"claim": "Randy Gardner, aged 17, stayed awake 11 days and 25 minutes (264.4 hours) in 1963-64; Guinness no longer accepts sleep-deprivation records.",
  "working": "San Diego high-school science fair project, 28 Dec 1963 to 8 Jan 1964, observed by sleep researcher William Dement.",
  "source": "Gulevich, Dement & Johnson, Archives of General Psychiatry 15 (1966); Guinness World Records"},
]),
'c06': ("The choice", [
 "Day ten. You're in a white room with a window, a bed you never use, and a camera in the corner. They feed you well. They test you every hour.",
 "Your body is falling apart, quietly. Your hands shake. Your words come out in the wrong order. People who sleep less than six hours a night are about four times more likely to catch a cold. You haven't slept at all. You have three colds. You sneeze, and the scientist behind the glass writes it down.",
 "Then the man shows you a slide. Rats. In the nineteen-eighties, scientists kept rats awake on purpose, around the clock. Within about two to four weeks, every one of them died.",
 "'Your record falls on day eleven,' he says. 'Day twenty-one is the real question.'",
 "That night, Ellie video calls you. She's in her pajamas, holding her teddy. 'Mum says you're helping scientists. Are you coming home? I leave the hallway light on for you every night. Like you do for me.'",
 "Behind her, you can see your bedroom. Your bed. Your pillow. Things you haven't touched in ten days.",
 "And you decide. No record. You're going home, and you're going to learn to sleep again, even if your brain has forgotten how.",
 "You pull off the wires, walk past the camera, and ask for the one thing nobody in the building expected. 'Can someone please turn off the lights?' The man in the suit doesn't try to stop you. He just writes something in his folder, and smiles, like he already knew.",
], [
 {"claim": "People sleeping under 6 hours a night were about 4 times as likely to catch a cold.",
  "working": "164 adults exposed to a cold virus; those sleeping <6 h were 4.2 times more likely to develop a cold than those sleeping >7 h.",
  "source": "Prather et al., Sleep 38 (2015)"},
 {"claim": "Rats kept totally sleep deprived died within about two to four weeks.",
  "working": "In the disk-over-water experiments, totally sleep-deprived rats died or were sacrificed when moribund after 11-32 days.",
  "source": "Rechtschaffen et al., Sleep 12 (1989); Everson, Bergmann & Rechtschaffen, Sleep 12 (1989)"},
]),
'c07': ("Lights off", [
 "Day eleven. Lights off. You're back in your own bed. Ellie has left the hallway light on, just a crack. Mum sits at the end of the bed. Mo is asleep in a chair in the corner, snoring, still holding a packet of crisps.",
 "You close your eyes. You breathe slowly. You count. One. Two. Three.",
 "Breathe in. Breathe out. Your heartbeat slows down. The room starts to feel soft and far away.",
 "And for the first time in eleven days, something heavy pulls at your eyelids.",
 "Then your phone buzzes. A message, from a number you don't know. 'Don't fall asleep. Not yet. We need to talk about what you'll see when you do.'",
 "Is any of this real? The adenosine alarm, the brain wash, the drunk-like reaction times, Randy Gardner's eleven days, and the rats. All real. The sources are in the description.",
 "Would you take eight free hours a night, if you knew the price? Tell me in the comments. And subscribe, so you don't miss part two.",
], []),
}

manus = ['# What If You Never Slept Again?\n']
total = 0
for ch, (name, lines, sci) in S.items():
    p = D / ch / 'episode.json'
    ep = json.loads(p.read_text())
    ep['chapter'] = name
    ep['script'] = [{'beat': f'p{i+1}', 'text': t} for i, t in enumerate(lines)]
    ep['science'] = sci
    p.write_text(json.dumps(ep, indent=1, ensure_ascii=False))
    n = sum(len(t.split()) for t in lines)
    total += n
    manus.append(f'\n## {ch}: {name} ({n} words)\n\n' + '\n\n'.join(lines) + '\n')
    if sci:
        manus.append('\nFacts:\n' + '\n'.join(f'- {s["claim"]} ({s["source"]})' for s in sci) + '\n')
sp = D / 'series.json'
se = json.loads(sp.read_text())
for c in se['chapters']:
    c['name'] = S[c['slug']][0]
    c['words'] = sum(len(t.split()) for t in S[c['slug']][1])
sp.write_text(json.dumps(se, indent=1, ensure_ascii=False))
out = pathlib.Path('/mnt/project-files/what-if/never-sleep'); out.mkdir(parents=True, exist_ok=True)
(out / 'manus.md').write_text(''.join(manus))
print('total words', total, 'chars', sum(len(t) for v in S.values() for t in v[1]))
