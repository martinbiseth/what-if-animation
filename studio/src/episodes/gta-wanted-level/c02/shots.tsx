import React from 'react';
import { ShotProps, camT, kf, clamp, backOut, stand, BEDROOM, KITCHEN, CLS, KitchenIsland, Hero, basePose, FONT, WantedStars, WANT, SUBURB, Glow } from '../../../engine';
import words from './words.json';
import { YOU, MO, MUM, ELLIE, N1, KitchenSet, BedroomSet, ClassSet, HomeSet, scene, faceCU, starsCU, bigWord, insert, walk, cueAt, people, starCard, FEET } from '../common';

// Chapter 2, the rules: Tuesday, five empty stars like a crown; nobody else sees them (Mum, Ellie, Mo); your hand goes
// through them; the mirror; the rules: break any rule, a star; a crack in the sidewalk is not a rule; seen by police,
// they come; run, another star; hide long enough and they fade. At least at the start.

const BED = BedroomSet({ veil: 0.15, clock: '07:12' });
const KIT = KitchenSet();
const HOME = HomeSet('dusk');

// ---------- S1: Tuesday: you wake up; something floats above your head ----------
const P = stand(BEDROOM, 0.62, 0.35);
export const S1 = scene({
  Set: BED, cam: { from: [P.x, 520, 1.5], to: [P.x, 480, 1.65] }, words,
  cast: (t, f) => {
    const st = cueAt(words, f, t, 'floating');
    return [{ look: YOU, pose: { x: P.x, y: P.y, scale: P.scale, yaw: 0.1, armL: { a: kf(t, [[0, 170], [30, 150], [44, 15]]), b: -10 }, armR: { a: kf(t, [[0, 170], [30, 150], [44, 15]]), b: -10 }, look: kf(t, [[st, 0], [st + 8, 0.2]]), headTilt: kf(t, [[st, 0], [st + 8, -10]]) }, faces: [[0, 'tired'], [st + 6, 'shock']], stars: 0, starPop: st - 4 }];
  },
});

// ---------- S2: five empty stars, in a little row, like a crown ----------
export const S2 = starsCU({ k: 0, Bg: BED, label: 'FIVE EMPTY STARS' });

// ---------- S3: Mum doesn't see them. Ellie doesn't see them ----------
const MU = stand(KITCHEN, 0.3, 0.4), EL = stand(KITCHEN, 0.48, 0.46), ME = stand(KITCHEN, 0.7, 0.4);
export const S3 = scene({
  Set: KIT, setT: 200, cam: { from: [960, 560, 1.3], to: [960, 560, 1.4] }, words,
  cast: (t, f) => {
    const el = cueAt(words, f, t, 'Ellie');
    return [
      { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: -0.6, look: -0.5 }, faces: [[0, 'happy']] },
      { look: ELLIE, pose: { x: EL.x, y: EL.y, scale: EL.scale * 0.72, yaw: 0.4, look: kf(t, [[el, -0.5], [el + 6, 0.8]]) }, faces: [[0, 'neutral'], [el + 6, 'happy']] },
      { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.5, look: -0.6 }, faces: [[0, 'worried']], stars: 0 },
    ];
  },
  front: () => <KitchenIsland />,
});

// ---------- S4: at school, Mo walks straight past them ----------
const A = stand(CLS, 0.4, 0.6);
export const S4 = scene({
  Set: ClassSet, cam: { from: [A.x + 200, 470, 1.25], to: [A.x + 260, 470, 1.3] }, words,
  cast: (t, f) => [
    { look: YOU, pose: { x: A.x + 300, y: A.y, scale: A.scale, yaw: -0.4, look: kf(t, [[20, -0.6], [50, 0.6]]) }, faces: [[0, 'neutral'], [40, 'oops']], stars: 0 },
    { look: MO, pose: walk(t, A.x - 300, A.x + 900, 0, 110, A.y + 170 * A.scale, A.scale), faces: [[0, 'happy']] },
  ],
});

// ---------- S5: at breakfast you wave your hand through them. Nothing ----------
export const S5 = faceCU({
  look: YOU, Bg: KIT, faces: [[0, 'worried'], [40, 'oops']], yaw: 0.2, look_: 0, stars: 0, zoom: [2.4, 2.5], pose: { headTilt: -8 },
  extra: (t) => {
    const x = 960 + 90 * Math.sin(t / 6);
    return (
      <g>
        <path d={`M 1180 900 Q 1150 640 ${x + 14} 446`} stroke="#F07A2A" strokeWidth={34} fill="none" strokeLinecap="round" />
        <circle cx={x + 8} cy={436} r={20} fill="#26232F" stroke="#100E16" strokeWidth={4} />
      </g>
    );
  },
});

// ---------- S6: the bathroom mirror: still there, very faint ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1], [len, 1.06]]);
  const pose = { ...basePose, x: 960, y: 760, scale: 1.4, yaw: -0.1, look: 0, expr: 'worried' as const, blink: 0 };
  return (
    <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#BFD8D0" />
      {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M ${-200 + i * 90} -200 V 1300 M -200 ${-200 + i * 90} H 2200`} stroke="#A8C4BC" strokeWidth={4} />)}
      <rect x={520} y={60} width={880} height={900} rx={60} fill="#E8EEF0" stroke="#8A9AA0" strokeWidth={18} />
      <clipPath id="mirror"><rect x={540} y={80} width={840} height={860} rx={44} /></clipPath>
      <g clipPath="url(#mirror)">
        <rect x={540} y={80} width={840} height={860} fill="#9AB8C0" />
        <Hero look={YOU} pose={pose} shadow={0} />
        <g opacity={0.35 + 0.08 * Math.sin(t / 6)}><WantedStars x={960} y={290} n={0} s={0.85} t={t} /></g>
        <path d="M 600 400 L 760 120 M 640 520 L 860 140" stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={30} />
      </g>
      <rect x={480} y={980} width={960} height={60} rx={20} fill="#F4F2EC" stroke="#8A9AA0" strokeWidth={6} />
    </g>
  );
};

// ---------- S7: by lunch, you've worked out the rules ----------
export const S7 = starCard({ kicker: 'BY LUNCH', title: 'THE RULES', seed: 5 });

// ---------- S8: rule 1: break any rule, even a tiny one, and a star fills in ----------
export const S8: React.FC<ShotProps> = (p) => {
  const fills = cueAt(words, p.f, p.t, 'fills');
  const S = starsCU({ k: [[0, 0], [Math.max(6, fills + 4), 1.25]], label: 'RULE 1: BREAK ANY RULE', sub: 'even a tiny one = one star' });
  return <S {...p} />;
};

// ---------- S9: you step on a crack in the sidewalk. Nothing ----------
export const S9 = scene({
  Set: HOME, cam: { from: [900, 640, 1.9], to: [900, 660, 2.0] }, words,
  back: () => <path d="M 860 802 L 900 812 L 930 806 L 980 818 L 1010 810" stroke="#4A4448" strokeWidth={5} fill="none" />,
  cast: (t) => [{ look: YOU, pose: walk(t, 700, 920, 0, 40, SUBURB.feet, 1, t > 40 ? { look: 0.3, headTilt: -8 } : {}), faces: [[0, 'worried'], [48, 'oops']], stars: 0 }],
});

// ---------- S10: that's not a rule. Good to know ----------
export const S10 = faceCU({ look: YOU, Bg: HOME, faces: [[0, 'oops'], [16, 'smug']], yaw: -0.3, stars: 0, zoom: [2.6, 2.75] });

// ---------- S11: rule 2: a police officer sees you with a star: they come for you ----------
export const S11 = bigWord({ kicker: 'RULE 2', word: 'SEEN = CHASED', size: 170, sub: 'a police officer sees a star: they come for you', siren: 0.4 });

// ---------- S12: and if you run, you get another star ----------
export const S12: React.FC<ShotProps> = (p) => {
  const an = cueAt(words, p.f, p.t, 'another');
  const S = starsCU({ k: [[0, 1], [Math.max(6, an + 4), 2.25]], label: 'RULE 3: RUN = ONE MORE', siren: 0.4 });
  return <S {...p} />;
};

// ---------- S13: one more thing. Stay out of sight long enough ----------
export const S13 = bigWord({ kicker: 'RULE 4', word: 'HIDE', size: 230, sub: 'stay out of sight long enough...' });

// ---------- S14: the stars flash, and fade away ----------
export const S14: React.FC<ShotProps> = (p) => {
  const fl = cueAt(words, p.f, p.t, 'flash');
  const fade = cueAt(words, p.f, p.t, 'fade');
  const S = starsCU({ k: [[0, 2], [Math.max(2, fl), 2.5], [Math.max(14, fade + 14), 0]], label: '...AND THEY FADE' });
  return <S {...p} />;
};

// ---------- S15: at least, that's how it works at the start ----------
export const S15 = faceCU({ look: YOU, Bg: HOME, faces: [[0, 'smug'], [40, 'worried']], yaw: 0.35, stars: 0, zoom: [2.7, 3.0] });
