# Long form: 8 to 10 minute episodes

The full episodes on the What If channels run 7 to 10 minutes and use all seven beats (`formula.md`). At 8:00 and up
YouTube lets you place mid-roll ads, which is most of what a long video earns over a short one. This is how the
skill makes one: seven chapters, each a normal episode, joined at the end.

## Why chapters

- **Context.** One 20-second episode fills most of a 200K context. An 8-minute one in one session is impossible.
  Work one chapter per session; everything a later session needs is in the files (`series.json`, each chapter's
  `episode.json`, `timeline.json`, `shots.tsx`). Start every session with `long.py status <slug>`.
- **Cost of mistakes.** A render of 8 minutes takes about 50 minutes. Chapters render on their own and `long.py
  render` only re-renders the ones whose files changed.
- **Mid-rolls and YouTube chapters** land on chapter boundaries, which are pauses in the story, not mid-sentence.

## The shape

| Ch | Beat | Words | Seconds | Pace | What it does |
|---|---|---|---|---|---|
| c01 | 1. Cold open | 110-140 | 40-55 | 24+ cuts/min | Three or four quick demos, as the short episodes do; ends on the premise question. This is the hook: 30 s in, the viewer decides. |
| c02 | 2. Premise and rules | 100-130 | 40-50 | 10-14 | What changed overnight, the title card, the rules said plainly (and one rule the viewer will see broken later). |
| c03 | 3. The fun part | 230-280 | 90-110 | 8-12 | Escalating wins: school, money, the best friend finds out. Each win a small scene, not a list. |
| c04 | 4. The catch | 230-280 | 90-110 | 8-12 | The cost, from real science: two or three facts with numbers, each one shown (`factCard`), each followed by what it means for you. |
| c05 | 5. Someone notices | 180-220 | 70-85 | 8-12 | The man in the suit, a government, a company. Stakes go up from personal to the world. |
| c06 | 6. The choice | 180-220 | 70-85 | 10-14 | Family at stake (the little sister). One decision, made on screen. |
| c07 | 7. Cliffhanger | 110-140 | 40-55 | 12+ | What the choice costs, a question left open, then "Is any of this real?" over the facts. Ask for a comment. |

About 1,300 words at 2.6 words a second after `voice.py` tightens the pauses is 8:20. Aim for 8:30 to 9:30, so a
tight edit can't drop you under 8:00. `long.py status` shows where you are against the target at every step.

## Writing the long script

- **Same voice as the short ones:** second person, present tense, short sentences, every line a picture.
- **A reason to keep watching at least once a minute.** End each chapter on an open question ("But that's not the
  weird part."), and plant something early that pays off late (the rule in c02 that breaks in c06).
- **Characters talk.** In the long form Mo, the sister and the man in the suit have lines. Write them as quotes in
  the script and voice them with a second voice (`voices` below), or have the narrator report them ("Mo just
  stares at you. 'Do it again.'").
- **Facts.** Each one in the chapter's `science` field with its working and source, as before. `long.py youtube`
  puts them all in the description under "Is any of this real?".
- **Don't pad.** Slower speech or longer pauses to reach 8:00 lose viewers, and YouTube's ranking follows how much
  of the video people watch. Add story (another demo, another consequence), not air.

## Pace after the cold open

The short episodes cut 27 times a minute. Keep that for c01. After it, 8 to 12 cuts a minute with shots of up to
8 s reads as calm, not slow, as long as something moves inside every shot: a camera drift, a character's gesture,
a blink, the lips on a line, a light changing. `series.json` sets `"pace": {"min_cuts": 8, "max_hold": 8}` as the
default, and c01 overrides it with the short episodes' 24 and 4, so `plan.py` warns at the right place.

An 8-minute episode is then about 80 to 110 shots. Draw by hand the ones the story turns on (the demos, the power,
the choice) and build the rest from templates.

## Templates (`engine/templates.tsx`)

| Template | Use |
|---|---|
| `chapterCard({ kicker, title, ground, red })` | A chapter opener on the dusk rooftop or the schematic. The placeholder `long.py init` writes. |
| `factCard({ value, suffix, label, sub, format, real })` | The science beat: a number counting up, its label and working, then "THAT'S REAL." |
| `talkShot({ Set, cast, cam, words, back, front })` | Characters on a set, talking or listening: breathing, staggered blinks, lips on their own lines, a gesture while they speak, a camera drift. |
| `talkAt(words, f, fps, spans)` | The mouth's opening at frame f from the chapter's `words.json`, for hand-drawn shots (`pose.talk`). |
| `idleBlink(t, seed)` | A blink every few seconds, for hand-drawn shots. |

```tsx
import { talkShot, factCard, Kitchen, KitchenIsland, KITCHEN, stand, LOOKS } from '../../../engine';
import words from './words.json';
const A = stand(KITCHEN, 0.36, 0.4), B = stand(KITCHEN, 0.64, 0.4);
export const S7 = talkShot({
  Set: Kitchen, words,
  cast: [{ look: LOOKS.pipHood, ...A, yaw: 0.5, talk: [[41.2, 44.0]], faces: [[0, 'happy']] },
         { look: LOOKS.mo, ...B, yaw: -0.5, faces: [[0, 'neutral'], [60, 'worried']] }],
  cam: { from: [960, 600, 1.6], to: [960, 600, 1.75] },
  front: () => <KitchenIsland />,
});
export const S8 = factCard({ value: 29925, suffix: ' TWh', label: 'ALL THE ELECTRICITY ON EARTH, 2023', sub: 'Ember, Global Electricity Review 2024' });
```

When a template doesn't fit, draw the shot by hand as in the short episodes. When you've drawn the same kind of
shot three times, make it a template.

## Sound and music over 8 minutes

- **One bed doesn't last 8 minutes.** Give each chapter its own `sound.music` clip, matched to the beat (light for
  c03, tense for c04 to c06), and its own ambiences. The sound library carries clips across chapters and episodes,
  so later episodes cost less.
- `mixcheck.py <slug>/<chapter>` per chapter, as before; `long.py render` masters the whole episode to -14 LUFS at
  the end, so chapters mixed a little differently still come out level.

## Costs

ElevenLabs bills about one credit per character on the multilingual voices. 1,300 words is about 7,500 characters,
plus sound clips: count on 9,000 to 12,000 credits for a first long episode, less once the library is full. The free
plan isn't for commercial use: a monetised channel needs a paid plan that allows it (check the current plans and
terms). Rendering is local and free; budget about 6 minutes of render per minute of video on a laptop.

## Packaging and publishing

`long.py youtube <slug>` writes `out/<slug>/youtube/`:

- `captions.srt` from every chapter's word timings, offset to its place in the episode
- `chapters.txt` (YouTube chapters: first at 0:00, at least three, each 10 s or longer; it warns if not)
- `description.txt`: the intro, the chapters, the facts with their sources
- `midrolls.txt`: suggested ad breaks at chapter starts from 2:00, at least `midroll_gap` seconds apart
- `thumbnail.png`: a frame from the chapter and frame in `series.json` `youtube.thumbnail`. A thumbnail sells the
  video more than anything else: draw a shot for it (one face, one big object, three words at most).
- `metadata.json`: what `upload.py` sends

`upload.py <slug>` uploads it private, with the captions and the thumbnail. Watch it on YouTube, set the ad breaks
in YouTube Studio from `midrolls.txt` (the API can't place them), then publish.

## YouTube's rules that matter here

- **Monetisation** needs the YouTube Partner Program: 1,000 subscribers and 4,000 public watch hours in the last
  12 months, or 10 million Shorts views in 90 days. Shorts cut from the cold open (`c01`) are the cheapest way to
  grow toward it; point them at the long video.
- **Inauthentic (mass-produced, repetitive) content isn't monetised.** Videos that look templated and differ only
  in the topic are the risk with a pipeline like this. What protects the channel: a different story, cast use and
  sets each episode, real research, and the hand-drawn shots where the story turns.
- **Altered or synthetic content:** YouTube asks you to disclose realistic content made with AI that viewers could
  mistake for real people, places or events. A stick-figure cartoon with an AI voice is generally not that; set
  `synthetic_media` in `series.json` if an episode ever is.
- **Original characters and stories only**, as in the main skill. Never a channel's own hero or episode.
