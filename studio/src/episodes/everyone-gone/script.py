"""Writes series.json and each chapter's script/science for "What if everyone disappeared except you?" (keeps shots/edit/sound already there)."""
import json, pathlib, re
D = pathlib.Path(__file__).resolve().parent
SLUG = 'everyone-gone'
TITLE = ['WHAT IF EVERYONE', 'DISAPPEARED EXCEPT YOU?']
CH = {}
CH['c01'] = ('Cold open', [
 ('wake', "You wake up at 7:12, and something is wrong. It's quiet. Too quiet. No traffic. No birds. No Mum shouting that you're going to be late."),
 ('kitchen', "Her coffee is on the kitchen table, still warm. Her car keys are next to it. Her phone's alarm is going off, and nobody is turning it off."),
 ('bus', "Outside, a bus is stopped in the middle of the road, doors open, engine running. Nobody on it. A dog trots down the empty street, dragging its lead. Nobody holding it."),
 ('shout', "You shout. Your voice bounces off a hundred windows, and nobody answers."),
 ('search', "You check every house on the street. Every shop. Every car. Everything is exactly where it was last night. Every light. Every open laptop. Every half-eaten sandwich. Except the people."),
 ('title', "Everyone on Earth is gone. Everyone, except you. What if everyone disappeared, except you?"),
])
CH['c02'] = ('The rules', [
 ('rules', "By the end of the first day, you have worked out three rules."),
 ('rule1', "One. It happened at 3:07 in the morning. Every phone you pick up has its last message from before 3:07. Nothing after. The TV shows the same thing on every channel: an empty news desk, with the studio lights still on."),
 ('rule2', "Two. Only people are gone. Dogs, cats, pigeons, the goldfish in the pet shop. All still here."),
 ('rule3', "Three. Everything people were holding stayed exactly where it was. A pair of slippers in the middle of the hallway. A toothbrush on the bathroom floor."),
 ('calls', "You call everyone you know. Mum. Your best friend Mo. Grandma. Every call just rings and rings, and you can picture each phone, buzzing on an empty table."),
 ('walkie', "And then there's one more thing. On your little sister Ellie's bed, her walkie-talkie is switched on, hissing quietly. Ellie never leaves it on. You switch it off. Remember that walkie-talkie."),
])
CH['c03'] = ('The fun part', [
 ('best', "And then, for a few days, it is the best thing that has ever happened to you."),
 ('toys', "Day two. You walk into the biggest toy store in the city and take whatever you want. Nobody stops you. There is no queue at the checkout, because there is nobody at the checkout."),
 ('note', "On the way home, you stop at Mo's house and stick a note on his door. Gone to the mall. Come find me. Every day after that, you check. Every day, the note is still there."),
 ('food', "Day three. Breakfast is ice cream. Lunch is ice cream. Dinner is a whole pizza from the food court, which you work out how to bake yourself. It's terrible. You eat all of it anyway."),
 ('bike', "Day four. You ride a bike down the middle of the motorway, past thousands of stopped cars, singing as loud as you can. Nobody tells you to stop."),
 ('hotel', "Day five. You move into the penthouse at the top of the fanciest hotel in the city. The bed is bigger than your bedroom. There's a hot tub on the balcony. You fall asleep in a bathrobe, watching the sun set over a city that belongs only to you."),
 ('cinema', "That night you watch a film alone in the biggest cinema in town, in the best seat, with a bucket of popcorn the size of a bin. It takes you an hour to work out the projector."),
 ('school', "Day six. You go to school, just to sit in the teacher's chair. On the board, in giant letters, you write: no homework, forever."),
 ('roof', "Then you climb up onto the roof, and you scream as loud as you can, just because you can. And for the first time, something answers. All across the city, thousands of dogs start barking back."),
 ('turn', "It's funny. For about a second. Then you realise the dogs are the loudest thing left. And that the city is about to start falling apart."),
])
CH['c04'] = ('The catch', [
 ('lights', "Day seven, the lights go out. People who have studied a world without humans think most power stations would shut down within hours. Nobody is left to balance the grid."),
 ('dam', "Your city was lucky. Its power comes from a dam in the mountains, and a dam can keep spinning on its own for weeks. Until something, somewhere, trips."),
 ('blackout', "You're on the hotel roof when it happens. One district goes dark, then the next, then the whole skyline, until the only light left is the moon. A few hours later, your phone drops to no signal. Phone masts have backup batteries, and most of them only last a few hours."),
 ('subway', "Then the water. Under the streets, the subway starts to flood. New York's subway pumps out about thirteen million gallons of water every single day. Without the pumps, its own engineers thought parts of it could flood in about thirty-six hours. That's real."),
 ('food', "Then the food. Without fridges, the fresh food in every supermarket rots within days. You smell the meat counter from the car park. Canned food lasts for years. If you can find a can opener."),
 ('fuel', "Then the fuel. Petrol starts to go stale after about three to six months. After that, every car in the city is just a very heavy chair."),
 ('nuclear', "And then the scary one. There are more than four hundred nuclear reactors on Earth. Without people, they shut themselves down. But their fuel stays hot for years, and it has to be cooled. When the power goes, backup diesel generators keep the cooling running. In the United States, they must carry fuel for about seven days."),
 ('count', "After that, nobody is there to refill them. You count on your fingers. Today is day eight."),
])
CH['c05'] = ('Someone notices', [
 ('alone', "Day twelve. You've stopped talking out loud. Well, except to the dog. He followed you home from the bus on the first morning. You call him Noodle."),
 ('routine', "You have a routine now. Wake up. Check Mo's door. Feed Noodle. Collect cans. Count the days on the wall with a marker. The silence is the worst part. Some nights you leave the radio on, just for the hiss."),
 ('lonely', "Scientists who study loneliness have found that being cut off from other people for a long time is about as bad for your health as smoking fifteen cigarettes a day. That's real. And you are starting to feel it."),
 ('window', "That night, from the hotel roof, you see it. Across the river, one window is lit. One. In a city with no power."),
 ('bridge', "At dawn, you cross the bridge. And standing in the middle of it, checking his watch, is a man in a grey suit. He isn't surprised to see you. He looks annoyed. His shoes are perfectly clean. Everything else in this city is covered in dust."),
 ('missed', "'You weren't supposed to be here,' he says. 'At 3:07, everyone was moved. You were missed.' Moved where? He doesn't answer. 'Who are you?' you ask. 'I count people,' he says. 'And today, my count is wrong by one.'"),
 ('door', "He just points at the lit window across the river. 'There's a door. It closes tomorrow at 3:07. I can take one more person through. Your mum, your friends, your whole life. Back to normal.' One more person. Just one."),
])
CH['c06'] = ('The choice', [
 ('pack', "You run home to pack a bag. You don't need much. Just the photo on the fridge. Mum, Ellie and you, at the beach, last summer."),
 ('hiss', "And that's when you hear it, from Ellie's room. Hissing. The walkie-talkie. The one you switched off on the very first day. It's on again."),
 ('voice', "And through the static, a tiny voice. 'Hello? Is anybody there? It's really dark.'"),
 ('ellie', "It's Ellie. She's here. Somewhere in this city. Missed, just like you. You grab the walkie-talkie. 'Ellie! Where are you?' 'In the hiding place,' she whispers. 'Our place. I've been calling for days. Nobody answered.' Then the static swallows her. Your stomach drops. You switched it off on day one. She has been calling ever since."),
 ('clock', "You look at the clock. It's 2:40 in the morning. The door closes at 3:07, and the man said one more person. One. Not two."),
 ('photo', "You look at the photo. Mum, smiling. If you go through the door, you could see her by breakfast. You could tell her everything. And Ellie would be here, in the dark, alone."),
 ('choice', "If you go to the bridge, you get your whole life back. If you go to find Ellie, you might never get out. You look at the photo one more time. Then you put it in your pocket, grab a torch, and run. Not towards the bridge. The other way. Through streets with no lights, the torch beam jumping over stopped cars, with Noodle at your heels."),
])
CH['c07'] = ('The other voice', [
 ('treehouse', "The hiding place is the old tree house at the end of the park. You climb up, and there she is, wrapped in a blanket, holding the other walkie-talkie. She hugs you so hard you can't breathe."),
 ('door', "Across the river, the lit window flickers, and goes out. 3:07. The door is closed. It's just the two of you now. Noodle barks once from the bottom of the ladder. And far away, on the bridge, a tiny figure in a grey suit is standing still, looking straight at your torch."),
 ('crackle', "Or is it? Because Ellie's walkie-talkie crackles one more time, and a voice you have never heard before says: 'We can see your torch. There are more of us. Don't trust the man in the suit.'"),
 ('who', "Ellie looks at you. 'Who was that?' You don't know. But somewhere out there in the dark, someone has been watching you for twelve days."),
 ('ask', "Would you have gone through the door? Tell us in the comments. Part two is coming."),
 ('real', "Is any of this real? The disappearing, no. But the blackout, the flooding subway, the reactors and the loneliness? All real. The sources are in the description."),
])
SCI = {
 'c04': [
  {'claim': 'Without people, most power stations would shut down within hours; a hydroelectric dam could keep running on its own for weeks.',
   'working': 'Grids need operators to match supply and demand every second; without them, protection systems trip plants offline within hours. Hydro plants with little maintenance need can keep generating far longer.',
   'source': 'Alan Weisman, The World Without Us (2007); National Geographic, Aftermath: Population Zero (2008)'},
  {'claim': 'Phone masts have backup batteries, and most only last a few hours.',
   'working': 'Typical cell sites carry battery backup of roughly 2 to 8 hours; the FCC proposed an 8-hour minimum after Hurricane Katrina.',
   'source': 'FCC Independent Panel Reviewing the Impact of Hurricane Katrina on Communications Networks (2006); FCC 07-177'},
  {'claim': "New York's subway pumps out about 13 million gallons of water a day; without the pumps parts could flood in about 36 hours.",
   'working': 'MTA: 753 pumps remove about 13 million gallons a day. NYC Transit hydraulics staff quoted by Weisman: within 36 hours some tunnels could fill.',
   'source': 'MTA New York City Transit; Alan Weisman, The World Without Us (2007), ch. 2'},
  {'claim': 'Petrol starts to go stale after about three to six months.',
   'working': 'Gasoline oxidises and loses its light components; typical shelf life without stabiliser is 3-6 months.',
   'source': 'US EIA / AAA fuel storage guidance; Popular Mechanics, How long does gas last'},
  {'claim': 'More than 400 nuclear reactors on Earth; their backup diesel generators in the US must carry fuel for about seven days.',
   'working': 'IAEA PRIS lists about 415-440 operable power reactors. Reactors scram automatically, but decay heat needs cooling. US NRC Regulatory Guide 1.137 / ANSI N195: on-site fuel for 7 days of emergency diesel generator operation.',
   'source': 'IAEA Power Reactor Information System (PRIS); US NRC Regulatory Guide 1.137'},
 ],
 'c05': [
  {'claim': 'Long-term social isolation is about as bad for your health as smoking 15 cigarettes a day.',
   'working': 'Meta-analysis of 148 studies (308,849 people): social connection raises survival odds by 50%; the US Surgeon General compares the mortality effect to smoking up to 15 cigarettes a day.',
   'source': 'Holt-Lunstad, Smith & Layton, PLoS Medicine (2010); US Surgeon General, Our Epidemic of Loneliness and Isolation (2023)'},
 ],
}
WORDS = {'c01': 140, 'c02': 120, 'c03': 260, 'c04': 260, 'c05': 200, 'c06': 200, 'c07': 130}
sp = D / 'series.json'
series = json.loads(sp.read_text()) if sp.exists() else {}
series.update({
 'id': 'EveryoneGone', 'slug': SLUG, 'topic': 'What if everyone disappeared except you?', 'title': TITLE, 'target_seconds': 540,
 'defaults': {'voice': {'id': 'TX3LPaxmHKxFdv7VOQHJ', 'model': 'eleven_multilingual_v2', 'settings': {'stability': 0.45, 'similarity_boost': 0.8, 'style': 0.3, 'use_speaker_boost': True}},
              'gaps': {'word': 0.14, 'comma': 0.25, 'sentence': 0.42, 'question': 0.6}, 'pace': {'min_cuts': 8, 'max_hold': 8}},
 'chapters': [{'slug': c, 'name': CH[c][0], 'words': WORDS[c]} for c in CH],
})
series.setdefault('youtube', {})
sp.write_text(json.dumps(series, indent=2, ensure_ascii=False) + '\n')
total = 0
manus = [f'# What If Everyone Disappeared Except You?\n']
for c, (name, beats) in CH.items():
    d = D / c
    d.mkdir(exist_ok=True)
    p = d / 'episode.json'
    ep = json.loads(p.read_text()) if p.exists() else {}
    ep.update({'id': f'EveryoneGone{c.upper()}', 'slug': f'{SLUG}/{c}', 'chapter': name, 'topic': series['topic'],
               'script': [{'beat': b, 'text': t} for b, t in beats], 'science': SCI.get(c, [])})
    ep.setdefault('shots', []); ep.setdefault('edit', []); ep.setdefault('fx', [])
    if c == 'c01':
        ep['title'] = TITLE
        ep.setdefault('pace', {'min_cuts': 14, 'max_hold': 5})
    p.write_text(json.dumps(ep, indent=1, ensure_ascii=False) + '\n')
    n = sum(len(t.split()) for _, t in beats)
    total += n
    manus.append(f'\n## {c} {name} ({n} words)\n')
    manus += [t + '\n' for _, t in beats]
    print(c, n)
print('total', total, 'words, est', round(total / 2.95 / 60, 2), 'min')
out = pathlib.Path('/mnt/project-files/what-if/everyone-gone')
out.mkdir(parents=True, exist_ok=True)
(out / 'manus.md').write_text('\n'.join(manus))
