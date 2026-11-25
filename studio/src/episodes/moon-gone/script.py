"""The script of "What If the Moon Disappeared Tonight?": writes each chapter's script and science into its episode.json
and the readable manus to /mnt/project-files/what-if/moon-gone/manus.md. Run from the studio folder."""
import json, pathlib, re

HERE = pathlib.Path(__file__).parent

CH = {
 'c01': ('Cold open', [
  "It's nine forty-seven on a Tuesday night. You're on the roof with your best friend Mo and a borrowed telescope, because your little sister Ellie needs a drawing of the full Moon for school.",
  "You look down to sharpen your pencil. You look back up. And the Moon is gone.",
  "Not behind a cloud. Not an eclipse. There's just a round, black hole in the sky where it used to be.",
  "Down the street, every dog starts barking at once. Every phone in the neighborhood lights up.",
  "Mo slowly lowers the telescope. 'Okay,' he says. 'Where did it go?'",
  "And by the next morning, the ocean at the end of your street hasn't come back in.",
  "So what would really happen if the Moon disappeared tonight? The first night, the first year, and a million years from now.",
 ], []),
 'c02': ('The rules', [
  "Here's the deal. There's no explosion. No falling rocks. No giant crater. The Moon just stops existing.",
  "And some things don't change at all. You don't float off your bed. Your weight stays the same. The Earth keeps going around the Sun, and the Sun still comes up in the morning.",
  "So at first, it doesn't feel like a big deal.",
  "Your mom checks the news, shrugs, and makes breakfast. School is still on. The bus is still late.",
  "But the Moon was doing a lot of jobs. Nobody ever had to think about them, because the Moon always showed up for work.",
  "Mo's grandpa has fished the same bay for fifty years. He reads the tide table the way other people read the weather.",
  "And Ellie has been checking on something at the beach every day for two months. A sea turtle nest, behind a little orange fence. It's due to hatch any night now.",
  "Remember that nest. It's going to matter.",
 ], []),
 'c03': ('The first night', [
  "That first night is the darkest one you've ever seen.",
  "A full Moon lights up the ground about a hundred times brighter than starlight alone. Without it, every night is a moonless night. Forever.",
  "And honestly? It's beautiful. Out past the edge of town, the Milky Way spills across the sky like somebody knocked over a jar of glitter. Astronomers are having the best week of their lives.",
  "Mo sets up the telescope in your backyard and charges the neighbors a dollar a look. By midnight, he's made forty-three dollars.",
  "Mrs. Alvarez from next door sees Saturn's rings for the first time in her life and starts crying. Mo gives her a refund. Then he charges her husband double.",
  "Online, it's chaos. Hashtag where is the Moon is trending in every country. Somebody sells a jar of 'genuine moonlight' for ten thousand dollars. A werewolf fan club announces that it is officially shutting down.",
  "There will never be another total solar eclipse. No more Moon landings, either. The rockets being built to go back there suddenly have nowhere to go.",
  "And your teacher points out something weird. The word 'month' comes from the Moon. So does 'Monday'. Every calendar on Earth was built around a thing that isn't there anymore.",
  "Ellie is not having fun. She lies on the trampoline, staring at the empty spot in the sky. 'But what does the Moon actually do?' she asks.",
  "You don't have an answer. Not yet.",
  "The next morning, Mo calls you at six. 'You need to come down to the harbor,' he says. 'Grandpa's boat is stuck in the mud.'",
 ], []),
 'c04': ('The catch', [
  "Here's the first job the Moon was doing. The tides.",
  "The Moon's gravity pulls on the whole Earth. But it pulls hardest on the side facing it, and weakest on the far side. So the oceans stretch into two bulges, and as the Earth spins through them, the water rises and falls, about twice a day.",
  "The Sun makes tides too. But its pull on the oceans is less than half as strong as the Moon's. So without the Moon, the tides don't stop. They shrink, to about a third of a big tide today.",
  "In the Bay of Fundy in Canada, the water can rise sixteen meters. That's as tall as a five-story building, twice a day. Without the Moon, it's barely five.",
  "And that's a problem for everything that lives where the sea meets the land. Crabs, mussels, sea stars and snails live in tide pools that fill and drain on the Moon's schedule. With smaller tides, a lot of those pools just dry out.",
  "Then there's the deep ocean. Tides do about half the work of stirring it, mixing warm water down and cold water up. That stirring carries heat around the planet. Take half of it away, and over time, ocean currents and weather can start to change.",
  "And some animals use moonlight as a clock. On the Great Barrier Reef, the corals release their eggs all on the same few nights, right after a full Moon in late spring. Every year, it's one of the biggest spawning events on the planet.",
  "Without a Moon, that clock is gone.",
  "Nobody knows exactly what the corals will do now. Spawn on the wrong night? Spawn out of sync, so the eggs never meet? Scientists start counting the days.",
  "Grandpa stands on the dock, staring at his boat sitting in the mud. 'Fifty years,' he says. 'And the water never stood me up before.'",
 ], []),
 'c05': ('Someone notices', [
  "Three days later, the scientists hold a press conference. They look like they haven't slept.",
  "They explain something you never knew. When the astronauts went to the Moon, they left mirrors on the surface. For more than fifty years, observatories have fired lasers at those mirrors. About two and a half seconds later, a tiny bit of the light comes back. That's how we know the Moon is drifting away from us, nearly four centimeters every year.",
  "Last Tuesday at nine forty-seven, the light stopped coming back.",
  "Then they put up a picture of the Earth, tilted to one side. 'This is what really worries us,' one of them says.",
  "The Earth is tipped over by about twenty-three degrees. That tilt is why we have seasons. And the Moon works like a hand on a spinning top, keeping that tilt steady.",
  "Without it, the tilt can start to wander. Not in a day, or even in your lifetime. But over millions of years, some computer models say it could swing a lot. Mars has no big moon, and its tilt has swung by more than twenty degrees.",
  "A bigger tilt means wilder seasons. Hotter summers, longer winters.",
  "And there's one more slow change. The Moon's tides have been braking the Earth's spin like a giant hand brake. More than a billion years ago, a day was only about eighteen hours long. The Moon stretched it out to twenty-four. Without the Moon, that brake almost lets go.",
  "Mo raises his hand in your living room, like he's at school. 'So it's bad,' he says, 'but slow bad?'",
  "Mostly. But not all of it is slow. Because tonight, Ellie's turtles are hatching.",
 ], []),
 'c06': ('The choice', [
  "You get to the beach just after dark. Ellie is already there, inside the little orange fence, with her flashlight off, like the turtle lady told her.",
  "The sand starts to move. Then a tiny flipper pokes out. Then another. Then about a hundred baby sea turtles boil out of the nest at once.",
  "Here's how hatchlings find the ocean. They crawl toward the brightest horizon. For millions of years, that was the open sky over the water, with the Moon and the stars bouncing off the waves.",
  "But tonight there's no Moon. The sea is pitch black. And behind the beach, the boardwalk is lit up like a stadium, because the whole town came out for a Moon Vigil, with floodlights and phones and glowing lanterns.",
  "And the turtles turn around. All of them. They start crawling up the sand, away from the water, toward the lights and the road.",
  "Ellie grabs your arm. 'They're going the wrong way!'",
  "A few people at the vigil notice, and they run over to help. They switch on their phone flashlights to see. And it makes everything worse. Now even more turtles turn toward the lights.",
  "You can't carry a hundred turtles. Nobody can. But you know what they need. They don't need help. They need the dark.",
  "So you climb onto the lifeguard tower, and you shout as loud as you've ever shouted. 'Everybody! Lights off! Phones off! Now!'",
  "For a second, nobody moves. Then Mo runs to the snack shack and flips the big switch on the floodlights. Grandpa turns off his truck. One by one, the phones go dark, and the lanterns go out.",
  "And now the brightest thing left is the faint glow of starlight over the sea.",
 ], []),
 'c07': ('Cliffhanger', [
  "One by one, the turtles turn around. They scramble down the sand and into the waves. Ellie counts every single one. A hundred and twelve.",
  "Ellie is crying and laughing at the same time. 'Thirty years,' she whispers. 'The girls come back to this same beach in thirty years to lay their own eggs.' Then she looks up at the black sky. 'How will they find it?'",
  "But as the last one swims off, Grandpa looks at his watch and frowns. 'That's not right,' he says. The water is coming in. Fast. Higher than it's been all week, like the old tides. Like something out there is still pulling.",
  "Mo looks up. Right where the Moon used to be, one little patch of sky has no stars in it at all.",
  "So, is any of this real? The science is. The Sun's tides really are less than half as strong as the Moon's. The Bay of Fundy really rises sixteen meters. Corals really time their spawning to the Moon, and hatchlings really crawl toward the brightest horizon. Which is why beach towns turn the lights off during nesting season.",
  "Would you have turned off the lights? And what do you think is pulling on the ocean? Tell me in the comments. And subscribe, so you don't miss what's hiding in that dark spot in the sky.",
 ], []),
}

SCI = {
 'c03': [
  {"claim": "A full Moon lights the ground about a hundred times more than starlight alone.",
   "working": "Full Moon illuminance about 0.1-0.3 lux; a clear moonless sky about 0.001-0.002 lux.",
   "source": "Schlyter, 'Radiometry and photometry in astronomy'; Kyba et al. 2017, Scientific Reports"},
  {"claim": "'Month' and 'Monday' both come from the Moon.",
   "working": "Old English monath (from mona, Moon) and Monandaeg, 'Moon's day'.",
   "source": "Oxford English Dictionary / Online Etymology Dictionary"},
 ],
 'c04': [
  {"claim": "The Sun's tide-raising force is about 46% of the Moon's.",
   "working": "Tidal force scales with mass / distance^3; for the Sun vs the Moon that ratio is about 0.46.",
   "source": "NOAA National Ocean Service, 'Tides and Water Levels'"},
  {"claim": "Without the Moon, tides would be about a third of a big (spring) tide today.",
   "working": "Spring tide = Moon + Sun = 1 + 0.46 = 1.46; Sun alone = 0.46; 0.46 / 1.46 = 0.32.",
   "source": "From NOAA's 46% figure"},
  {"claim": "Tides in the Bay of Fundy can rise up to 16 m, the largest range in the world.",
   "working": "16 m x 0.32 is about 5 m with the Sun alone.",
   "source": "NOAA / Bay of Fundy Tourism; Government of Canada, Fisheries and Oceans"},
  {"claim": "Tides supply about half of the power that mixes the deep ocean.",
   "working": "About 2 TW is needed; roughly 1 TW comes from tides, the rest from wind.",
   "source": "Munk & Wunsch 1998, 'Abyssal recipes II', Deep-Sea Research"},
  {"claim": "Corals on the Great Barrier Reef mass-spawn on a few nights after a full Moon in late spring (October-December).",
   "working": "Moonlight is one of the cues that synchronises the spawning.",
   "source": "Australian Institute of Marine Science (AIMS); Great Barrier Reef Marine Park Authority"},
 ],
 'c05': [
  {"claim": "Apollo astronauts left retroreflectors on the Moon; lasers fired at them return in about 2.5 seconds.",
   "working": "Round trip 2 x 384,400 km / 299,792 km/s = 2.56 s.",
   "source": "NASA, 'Lunar Laser Ranging'; Apache Point Observatory Lunar Laser-ranging Operation"},
  {"claim": "The Moon moves away from Earth about 3.8 cm a year.",
   "working": "Measured by lunar laser ranging since 1969.",
   "source": "NASA"},
  {"claim": "Earth's axis is tilted about 23.4 degrees, which causes the seasons, and the Moon helps keep it steady.",
   "working": "Without the Moon, models disagree on how far it would drift: early work said up to 85 degrees, newer work says roughly 10-20 degrees over hundreds of millions of years.",
   "source": "Laskar, Joutel & Robutel 1993, Nature; Lissauer, Barnes & Chambers 2012, Icarus"},
  {"claim": "Mars has no large moon and its tilt has varied by more than 20 degrees.",
   "working": "Mars's obliquity has ranged from about 15 to 45 degrees over the last ~20 million years.",
   "source": "Laskar et al. 2004, Icarus"},
  {"claim": "About 1.4 billion years ago a day lasted about 18 hours; tidal braking by the Moon has lengthened it.",
   "working": "Today the day still lengthens by about 1.8 milliseconds a century.",
   "source": "Meyers & Malinverno 2018, PNAS; Stephenson et al. 2016, Proc. R. Soc. A"},
 ],
 'c06': [
  {"claim": "Sea turtle hatchlings find the sea by crawling toward the brightest horizon, and artificial lights pull them the wrong way.",
   "working": "Over an open beach the sky above the sea is the brightest direction; lights behind the beach reverse that.",
   "source": "Florida Fish and Wildlife Conservation Commission; Witherington & Martin, 'Understanding, assessing and resolving light-pollution problems on sea turtle nesting beaches'"},
 ],
 'c07': [
  {"claim": "Female sea turtles return to nest on the beach where they hatched, after about 20-30 years.",
   "working": "Natal homing, guided partly by Earth's magnetic field.",
   "source": "NOAA Fisheries; Lohmann et al. 2008, PNAS"},
  {"claim": "Many beach towns have lights-out rules during sea turtle nesting season.",
   "working": "Lighting ordinances in coastal counties, e.g. in Florida, from about May to October.",
   "source": "Florida Fish and Wildlife Conservation Commission, Model Lighting Ordinance"},
 ],
}

words = 0
md = ['# What If the Moon Disappeared Tonight?', '', 'Channel: Classroom 4B.', '']
for ch, (name, lines, _) in CH.items():
    sci = SCI.get(ch, [])
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
out = pathlib.Path('/mnt/project-files/what-if/moon-gone')
out.mkdir(parents=True, exist_ok=True)
(out / 'manus.md').write_text('\n'.join(md))
print(words, 'words')
for ch, (name, lines, _) in CH.items():
    print(ch, name, sum(len(re.findall(r"[A-Za-z0-9'-]+", t)) for t in lines), sum(len(t) for t in lines), 'chars')
