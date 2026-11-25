import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, FONT, SUBURB, Bedroom, BedDuvet, bedSit, WINDOW, stand, KITCHEN, KitchenIsland,
  Schematic, SCH, THINK, TitleCard, ThoughtBubble,
} from '../../../engine';
import words from './words.json';
import tl from './timeline.json';
import {
  YOU, MO, MUM, N1, N2, N3, N4, N5, KID, StreetSet, KitchenSet, faceCU, thinkCard, bigWord, people, at, scene, ThoughtField, cueIn,
} from '../common';

// Chapter 2, the rules: Monday the world is louder; any thought in words, like a whisper in your ear; not pictures,
// not feelings; voices sound like their owners (mum's, Mo's faster and ruder); ten steps; can't switch it off;
// louder when they're thinking about you (planted for c07); nobody can hear yours (broken in c07); the title.

const c = (shot: string, w: string, n = 1) => cueIn(words, tl, shot, w, n);
const DAY = StreetSet('day');
const MORNING = StreetSet('morning');
const KIT = KitchenSet(0.3);

export const S1 = thinkCard({ kicker: 'HOW IT WORKS', title: 'THE RULES', seed: 5 });

// ---------- S2: Monday morning: you wake, and the window is full of drifting thoughts ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.22);
  const up = clamp((t - 4) / 12);
  const me: Pose = { ...basePose, x: sit.x, y: sit.y - up * 10, scale: sit.scale, yaw: 0.5, look: 0.9, tilt: (1 - up) * -30, expr: t > 30 ? 'shock' : 'tired', blink: t < 8 ? 1 : 0, armR: { a: 30, b: -20 } };
  return (
    <g transform={camT(1080, 500, kf(t, [[0, 1.3], [len, 1.55]]))}>
      <Bedroom t={t} id="b2" veil={0.15} clock="07:00" lamp={0} duvet={false} />
      <Hero look={YOU} pose={me} />
      <BedDuvet knees={1} />
      <rect x={WINDOW.x0} y={WINDOW.y0} width={WINDOW.x1 - WINDOW.x0} height={WINDOW.y1 - WINDOW.y0} fill="#FFD9A8" opacity={0.7} />
      <g opacity={clamp((t - 10) / 20)}>
        {['milk', 'late', 'hm?', 'ugh', 'bus!'].map((s, i) => (
          <ThoughtBubble key={i} x={WINDOW.x0 + 40 + i * 50} y={WINDOW.y1 - 20 - ((t * 1.4 + i * 50) % 220)} text={s} s={0.32} t={t + i * 9} tail={false} side={0} seed={i} />
        ))}
      </g>
    </g>
  );
};

// ---------- S3: the street: a man walks past; his thought trails into your ear as a stream of little puffs ----------
export const S3: React.FC<ShotProps> = (p) => {
  const x = kf(p.t, [[0, 1500], [p.len, 1080]]);
  return scene({
    Set: MORNING, cam: [1000, 520, 1.7], to: [1040, 520, 1.8], setT: 200,
    cast: (t) => [
      { look: YOU, pose: at(860, { yaw: 0.4, look: 0.8, headTilt: 8 }), faces: [[0, 'neutral'], [40, 'shock']] },
      { look: N1, pose: at(x, { yaw: -0.5, legL: { a: Math.sin(t / 4) * 16, b: 0 }, legR: { a: -Math.sin(t / 4) * 16, b: 0 } }), think: { th: 'did I lock the door?', pop: 30, s: 0.55 } },
    ],
    over: (t) => (
      <g opacity={clamp((t - 20) / 10)}>
        {Array.from({ length: 6 }).map((_, i) => {
          const k = ((t / 40 + i / 6) % 1);
          return <circle key={i} cx={1480 - k * 640} cy={260 + Math.sin(k * 6) * 20 + k * 40} r={10 + 6 * (1 - k)} fill={THINK.paper} stroke={THINK.violet} strokeWidth={3} opacity={1 - k * 0.5} />;
        })}
      </g>
    ),
  })(p);
};

// ---------- S4: what you hear: not pictures, not feelings, just words ----------
export const S4: React.FC<ShotProps> = ({ t }) => {
  const items = [
    { at: c('S4', 'pictures'), text: 'PICTURES', ok: false },
    { at: c('S4', 'feelings'), text: 'FEELINGS', ok: false },
    { at: c('S4', 'words'), text: 'WORDS', ok: true },
  ];
  return (
    <g>
      <Schematic t={t} id="s4" />
      <text x={960} y={210} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill={SCH.dim}>WHAT YOU HEAR</text>
      {items.map((it, i) => {
        const pp = backOut(clamp((t - it.at) / 8));
        return (
          <g key={i} transform={`translate(${440 + i * 520} 560) scale(${pp})`} opacity={clamp((t - it.at) / 4)}>
            {it.ok ? (
              <ThoughtBubble x={0} y={120} text="words" s={1.1} t={t} tail={false} side={0} />
            ) : (
              <g>
                {i === 0 ? <path d="M -90 -60 H 90 V 60 H -90 Z M -60 30 L -10 -20 L 30 20 L 50 0 L 80 30" fill="none" stroke="#F6EFE3" strokeWidth={10} /> : <path d="M 0 60 C -120 -20 -60 -90 0 -30 C 60 -90 120 -20 0 60 Z" fill="none" stroke="#F6EFE3" strokeWidth={10} />}
                <path d="M -90 -90 L 90 90 M 90 -90 L -90 90" stroke="#FF3A2A" strokeWidth={16} strokeLinecap="round" />
              </g>
            )}
            <text x={0} y={200} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill={it.ok ? '#5BE08A' : '#F6EFE3'}>{it.text}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- S5: mum's thoughts sound like mum ----------
const MU = stand(KITCHEN, 0.4, 0.4), ME = stand(KITCHEN, 0.7, 0.4);
export const S5 = scene({
  Set: KIT, cam: [1000, MU.y - 160, 1.45], to: [1000, MU.y - 170, 1.55], setT: 300,
  cast: [
    { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.5, armR: { a: 60, b: -70 } }, faces: [[0, 'neutral']], think: { th: 'Did I turn the oven off?', pop: 40, s: 0.7, wrap: 16 } },
    { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.5 }, faces: [[0, 'neutral']] },
  ],
  front: () => <KitchenIsland />,
});

// ---------- S6: Mo's, faster and ruder: a pile-up of little clouds ----------
export const S6: React.FC<ShotProps> = (p) => {
  const ks: [number, string][] = [[4, 'hungry'], [16, 'hungry. maths.'], [c('S6', 'faster'), 'why is his face like that'], [c('S6', 'ruder'), 'ugh, LOSER. jk. hungry.']];
  return faceCU({ look: MO, Bg: DAY, faces: [[0, 'neutral'], [c('S6', 'ruder'), 'smug']], yaw: -0.3, zoom: [2.6, 2.8], think: { th: ks, s: 0.5, side: -0.5, wrap: 14 } })(p);
};

// ---------- S7: ten steps: a glowing ring on the pavement; inside it, thoughts; outside, they fade ----------
export const S7: React.FC<ShotProps> = (p) => {
  const ring = clamp((p.t - 30) / 20);
  return scene({
    Set: DAY, cam: [960, 560, 1.0], to: [960, 560, 1.06], setT: 400,
    back: (t) => (
      <g opacity={ring}>
        <ellipse cx={960} cy={SUBURB.feet + 10} rx={520 * ring} ry={60 * ring} fill={THINK.glow} opacity={0.15} />
        <ellipse cx={960} cy={SUBURB.feet + 10} rx={520 * ring} ry={60 * ring} fill="none" stroke={THINK.glow} strokeWidth={6} strokeDasharray="24 16" strokeDashoffset={-t * 2} />
      </g>
    ),
    cast: [
      { look: N4, pose: at(160, { yaw: 0.3 }), think: { th: 'nice day', pop: 60, s: 0.45, dim: 1 } },
      { look: N2, pose: at(620, { yaw: 0.4 }), think: { th: 'my feet hurt', pop: 30, s: 0.5 } },
      { look: YOU, pose: at(960, { yaw: 0, look: 0 }), faces: [[0, 'neutral']] },
      { look: N3, pose: at(1300, { yaw: -0.4 }), think: { th: 'chips tonight?', pop: 40, s: 0.5 } },
      { look: N5, pose: at(1760, { yaw: -0.3 }), think: { th: '...', pop: 60, s: 0.45, dim: 1 } },
    ],
    over: (t) => (
      <text x={960} y={1010} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 40) / 8)}>ABOUT 10 STEPS</text>
    ),
  })(p);
};

// ---------- S8: you jam earplugs in; it doesn't help ----------
const Plug: React.FC<{ x: number; y: number }> = ({ x, y }) => <rect x={x - 14} y={y - 22} width={28} height={44} rx={12} fill="#FFB15A" stroke="#26232F" strokeWidth={5} />;
export const S8 = faceCU({
  look: YOU, Bg: KIT, faces: [[0, 'worried'], [60, 'tired']], yaw: 0.05, zoom: [2.7, 2.9], hands: 'ears',
  think: { th: [[c('S8', 'help'), 'ugh, bins day'], [c('S8', 'coming'), 'is that kid ever quiet']], s: 0.42, side: 0.6 },
  extra: (t, pose) => (
    <g>
      <Plug x={pose.x - 68} y={pose.y - 180} />
      <Plug x={pose.x + 68} y={pose.y - 180} />
    </g>
  ),
});

// ---------- S9: the more someone thinks about you, the louder: Mo across the room, his cloud growing ----------
export const S9: React.FC<ShotProps> = (p) => {
  const loud = clamp((p.t - c('S9', 'louder')) / 12);
  return scene({
    Set: DAY, cam: [960, 520, 1.5], to: [960, 500, 1.6], setT: 500,
    cast: [
      { look: YOU, pose: at(700, { yaw: 0.4, look: 0.8 }), faces: [[0, 'neutral'], [c('S9', 'louder'), 'shock']] },
      { look: MO, pose: at(1240, { yaw: -0.4, look: -0.8 }), faces: [[0, 'smug']], think: { th: [[6, 'is he ignoring me?'], [c('S9', 'louder'), 'HEY. HEY. LOOK AT ME.']], s: 0.55 + loud * 0.25, loud, side: -0.4 } },
    ],
  })(p);
};

// ---------- S10: remember that ----------
export const S10 = bigWord({ kicker: 'RULE 3', word: 'REMEMBER THAT.', color: THINK.glow, Bg: DAY, size: 150, sub: 'it matters later' });

// ---------- S11: nobody can hear yours: your head, the only quiet place, a soft glow and no cloud ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const p: Pose = { ...basePose, x: 960, y: 760, scale: 1.1, yaw: 0, look: 0, expr: 'neutral', blink: 0, headTilt: Math.sin(t / 30) * 2 };
  return (
    <g>
      <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
        <ThoughtField t={t} n={20} seed={9} />
        <rect x={-200} y={-200} width={2400} height={1500} fill="#0B0816" opacity={0.3} />
        <circle cx={960} cy={540} r={kf(t, [[0, 200], [40, 330]])} fill="#120E26" />
        <circle cx={960} cy={540} r={kf(t, [[0, 200], [40, 330]])} fill="none" stroke={THINK.glow} strokeWidth={6} opacity={0.6} />
        <Hero look={YOU} pose={p} />
      </g>
      <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" opacity={clamp((t - c('S11', 'quiet') + 4) / 8)}>THE ONLY QUIET PLACE LEFT</text>
    </g>
  );
};

// ---------- S12: the title over the drifting thoughts ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [Math.max(1, len), 1.08]]))}>
      <ThoughtField t={t + 300} n={24} seed={11} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
    <TitleCard t={t} lines={['WHAT IF YOU COULD HEAR', "EVERYONE'S THOUGHTS?"]} accent={THINK.glow} accentT={30} y={420} size={110} />
  </g>
);
