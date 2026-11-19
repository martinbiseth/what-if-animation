"""The script of "What If GTA6 Physics Were Real?": writes each chapter's script and science into its episode.json and
the readable manus to /mnt/project-files/what-if/gta-physics/manus.md. Run from the studio folder."""
import json, pathlib, re, sys

HERE = pathlib.Path(__file__).parent

CH = {
 'c01': ('Cold open', [
  "You trip on the top step at school. Normally, that's a very bad day. Today, you bounce.",
  "Down all twelve steps, like a rubber doll. And at the bottom, you just stand up.",
  "At the crosswalk, a delivery van bumps you at walking speed. You fly thirty feet, spin twice in the air, and land on your feet. The driver doesn't even stop.",
  "Your best friend Mo dares you to jump off his garage roof. So you do. You roll once, dust off your hoodie, and walk away.",
  "And floating over your head, there's something new. A little green bar. It shrinks a bit every time you land.",
  "Today, you run on video game physics.",
  "But what would all of this really do to a human body? And what happens when that little bar runs out?",
 ], []),
 'c02': ('The rules', [
  "It started this morning. You rolled out of bed, hit the floor, and instead of a thump, you heard a sound. Ding.",
  "By lunch, you've figured out the rules.",
  "Rule one. Nothing really hurts you. A hit just takes a chunk off the bar.",
  "Rule two. Sit still for a minute, and the bar fills back up.",
  "Rule three. If the bar ever hits zero, everything goes black, and you wake up in the nearest hospital. Perfectly fine.",
  "And rule four, which Mo makes up on the spot. Never, ever tell Mom.",
  "Mo stares at you. 'Bro. You've got GTA physics. You've got respawn.'",
  "There's just one thing you haven't noticed yet. The bar only floats over your head. Nobody else has one.",
 ], []),
 'c03': ('Stunt double', [
  "And for one whole day, you are basically a stunt double.",
  "In gym class, a basketball hits you right in the face at full speed. The whole class gasps. Your bar loses a tiny sliver. You blink, and catch the rebound.",
  "After school, you ride your bike off the loading ramp behind the grocery store, flip once in the air, and land in a hedge. The bike is ruined. You're not.",
  "Mo is screaming. Mo is also filming.",
  "At the skate park, you go for the biggest ramp. You overshoot it by twenty feet, bounce off a trash can, and slide across the parking lot on your back like a sled. A little kid with an ice cream claps. You take a bow.",
  "Then Mo tries a tiny hop off the curb, lands on his knee, and says 'ow' for ten straight minutes. Same curb. No bar.",
  "By dinnertime, the video has two million views. Your little sister Ellie watches it nine times in a row. 'Again,' she says. 'Do it again.'",
  "And here's the part you need to hear. Don't try any of this. You don't have the bar. Nobody does.",
  "By the evening, your bar is almost empty from all the stunts. You're walking home, waving at Ellie, and you trip on Mo's skateboard. One tiny trip. The bar hits zero.",
  "Everything goes black.",
  "You open your eyes in a hospital bed, in a clean gown. A nurse is staring at you like you just walked through a wall. Because, technically, you did. Twenty seconds ago, you weren't in this building.",
  "And at that exact second, every light in the hospital flickers.",
 ], []),
 'c04': ('The catch', [
  "Here's the thing. In a game, a fall is just a number on a bar. In real life, it's physics. And physics always sends the bill.",
  "Jump off a ten-story building, and by the time you reach the ground, you're doing about fifty-four miles an hour. That's real. Gravity adds twenty-two miles an hour for every second you fall.",
  "But the speed isn't the problem. The stopping is. A game character stops and rolls. A real body stops in a few inches, in a few thousandths of a second. That's hundreds of g.",
  "The most a human has ever taken on purpose is about forty-six g. An Air Force doctor named John Stapp did it in 1954, strapped into a rocket sled. And he was strapped in tight.",
  "And cars? In a game, a car stops on a dime. A real car going thirty miles an hour needs about seventy-five feet to stop. That's six car lengths. And at that speed, a car carries the same energy as if you dropped it off a three-story building.",
  "So a real body couldn't do anything you did today. Which means something else is taking the hit.",
  "Then you think about the hospital. You didn't walk there. You appeared there.",
  "And making a whole person out of nothing takes energy. Einstein's famous equation, E equals m c squared, says your body is worth more than two days of all the energy the whole world uses.",
  "Every time you respawn, that energy has to come from somewhere. And tonight, it isn't only the hospital that flickers. It's the whole city.",
 ], [
  {"claim": "Jumping off a ten-story building (about 30 m), you hit the ground at about 54 mph.",
   "working": "v = sqrt(2gh) = sqrt(2 x 9.81 x 30) = 24.3 m/s = 87 km/h = 54 mph (air resistance at this speed changes it only a little).",
   "source": "Free fall, basic mechanics"},
  {"claim": "Gravity adds about 22 mph to a falling body for every second it falls.",
   "working": "g = 9.81 m/s per second = 35.3 km/h = 21.9 mph per second.",
   "source": "Standard gravity, 9.80665 m/s2 (NIST)"},
  {"claim": "Stopping from 54 mph in a few inches means hundreds of g in a few thousandths of a second.",
   "working": "a = v2 / 2d = 24.3^2 / (2 x 0.05) = 5,900 m/s2 = about 600 g; t = 2d / v = 0.004 s.",
   "source": "Constant deceleration, basic mechanics"},
  {"claim": "John Paul Stapp, a US Air Force doctor, took 46.2 g on the Sonic Wind rocket sled on 10 December 1954.",
   "working": "The sled went from 632 mph to a stop in about 1.4 s; Stapp was strapped in.",
   "source": "US Air Force, 'Dr. John Paul Stapp'; Smithsonian National Air and Space Museum"},
  {"claim": "A car at 30 mph needs about 23 m (75 ft), six car lengths, to stop.",
   "working": "9 m thinking distance + 14 m braking distance = 23 m.",
   "source": "UK Highway Code, rule 126, typical stopping distances"},
  {"claim": "A car at 30 mph carries the same energy as if it were dropped from about three stories.",
   "working": "1/2 m v2 = m g h, so h = v2 / 2g = 13.4^2 / 19.6 = 9.2 m, about three stories.",
   "source": "Kinetic and potential energy, basic mechanics"},
  {"claim": "The energy in a 45 kg body is more than two days of all the energy the world uses.",
   "working": "E = mc2 = 45 x (3.0e8)^2 = 4.0e18 J. World primary energy 2023 = 620 EJ a year = 1.7e18 J a day, so 2.4 days.",
   "source": "Energy Institute, Statistical Review of World Energy 2024"},
 ]),
 'c05': ('Someone notices', [
  "You keep the stunts going for two more days. Two more respawns. And the power company notices. Three blackouts, each one centered on a hospital, and each one longer than the last.",
  "On the news, they call it a grid glitch. Your mom calls it weird. You don't call it anything, because your stomach just dropped.",
  "The next morning, there's a black car outside your school. A man in a grey suit is waiting by your locker. He doesn't say hello. He just holds up a tablet. A map of the city, with three red dots. Three hospitals. Three times.",
  "'Half a second,' he says. 'Then one second. Then two. Every time you come back, the city goes dark, and it doubles.'",
  "He leans closer. 'Hospitals run on that power. Traffic lights. Elevators. Today it's two seconds. Do it ten more times, and it's over half an hour.'",
  "'So I just don't respawn,' you say.",
  "'Exactly,' he says. 'Don't. Not once. Not until we understand it.'",
  "He hands you a card with a phone number, and he's gone.",
  "For the first time since the bar showed up, you're scared of it. It's still floating there, full and green. But now every chunk it loses is a step closer to the next blackout.",
 ], [
  {"claim": "A blackout that doubles each time, from 2 seconds, passes half an hour after ten more doublings.",
   "working": "2 s x 2^10 = 2,048 s = 34 minutes.",
   "source": "Doubling, arithmetic (the story's rule)"},
 ]),
 'c06': ('The choice', [
  "Four days later, you've been perfect. No stunts. No falls. Bar full.",
  "Then you hear Ellie. She's standing on top of the old tree house in the backyard. Not inside it. On the roof.",
  "'Look!' she shouts. 'I've got the bar too! Watch me!'",
  "She doesn't. There's nothing over her head. Just air. The bar only works for you.",
  "And then the roof board cracks.",
  "That roof is about ten feet up. A fall from there hits the ground at around seventeen miles an hour. In a game, that's nothing. For a seven-year-old, it's a trip to the emergency room.",
  "You run. And this time, you use real physics, not game physics.",
  "What hurts in a fall isn't the speed. It's stopping too fast. Stop over a longer distance, and the force drops. Make the stop ten times longer, and it's ten times gentler. That's exactly how an airbag works.",
  "So you don't try to catch her with your arms. You grab the giant beanbag off the porch, throw it under the tree house, and dive in underneath it.",
  "Ellie lands on the beanbag, and the beanbag lands on you. She's safe. She's laughing, even.",
  "You're not laughing. Your bar was full. Now it's flashing red.",
  "Zero.",
 ], [
  {"claim": "A fall from about ten feet (3 m) hits the ground at about 17 mph.",
   "working": "v = sqrt(2 x 9.81 x 3.05) = 7.7 m/s = 17 mph.",
   "source": "Free fall, basic mechanics"},
  {"claim": "Stopping over ten times the distance makes the force ten times smaller; this is how an airbag works.",
   "working": "Average force F = m v2 / 2d: for the same speed, F is proportional to 1/d. An airbag and a crumple zone lengthen d.",
   "source": "Work-energy theorem; NHTSA, 'Air Bags'"},
 ]),
 'c07': ('Cliffhanger', [
  "You open your eyes in the hospital bed again. The nurse doesn't look surprised this time. She looks scared.",
  "Because the room is dark. The whole hospital is dark. Out the window, the whole city is dark. And it's been a lot longer than four seconds.",
  "The backup generators kick in. The man in the suit is standing at the end of your bed. 'It didn't come back,' he says quietly. 'Not this time.'",
  "Your phone buzzes. A video from Mom. Ellie, safe at home, holding a flashlight, waving at the camera. And over her head, very faint, there's a little green bar.",
  "So, is any of this real? The physics is. A ten-story fall really ends at fifty-four miles an hour. John Stapp really survived forty-six g. And a car at thirty really needs six car lengths to stop.",
  "Would you have made the dive? Tell me in the comments. And subscribe, because next time, we find out what happens when Ellie respawns.",
 ], []),
}

words = 0
md = ['# What If GTA6 Physics Were Real?', '', 'Series: GTA in Real Life (2 of 5). Channel: Classroom 4B.', '']
for ch, (name, lines, sci) in CH.items():
    p = HERE / ch / 'episode.json'
    ep = json.loads(p.read_text())
    ep['chapter'] = name
    ep['script'] = [{'beat': f'p{i + 1}', 'text': t} for i, t in enumerate(lines)]
    ep['science'] = sci
    p.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + '\n')
    n = sum(len(re.findall(r"[A-Za-z0-9'-]+", t)) for t in lines)
    words += n
    md += [f'## {ch}: {name} ({n} words)', ''] + [t + '\n' for t in lines]
    if sci:
        md += ['**Science**', ''] + [f"- {s['claim']} ({s['working']}; {s['source']})" for s in sci] + ['']
md.insert(3, f'{words} words, about {words / 2.6 / 60:.1f} min at 2.6 words a second.\n')
out = pathlib.Path('/mnt/project-files/what-if/gta-physics')
out.mkdir(parents=True, exist_ok=True)
(out / 'manus.md').write_text('\n'.join(md))
print(words, 'words')
for ch, (name, lines, _) in CH.items():
    print(ch, name, sum(len(re.findall(r"[A-Za-z0-9'-]+", t)) for t in lines))
