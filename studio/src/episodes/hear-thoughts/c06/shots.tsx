import React from 'react';
import { Hero, kf, camT, clamp, backOut, ShotProps, FONT, SUBURB, stand, KITCHEN, KitchenIsland, CLS, THINK, ThoughtBubble } from '../../../engine';
import words from './words.json';
import tl from './timeline.json';
import {
  YOU, MO, ELLIE, NORA, TEACHER, PRIYA, StreetSet, KitchenSet, ClassSet, BedroomSet,
  faceCU, thinkCard, bigWord, thoughtCU, scene, at, noise, ThoughtField, cueIn, span, Silent,
} from '../common';

// Chapter 6, the choice: Nora at the gate (she had it six years, gave it away, can make yours stop: silence, forever);
// what silence would mean; "no catch", and for once you can't tell; home, Ellie's "school was great" and her head's
// "don't tell"; next morning, "No. I'm keeping it."; the teacher, Mo standing next to you ("I've got you"); the hug.

const c = (shot: string, w: string, n = 1) => cueIn(words, tl, shot, w, n);
const DAY = StreetSet('day');
const MORNING = StreetSet('morning');
const KIT = KitchenSet(0.35);
const CLASS = ClassSet(0);
const NIGHT = BedroomSet({ veil: 0.75, clock: '03:12' });

/** School railings and an open gate, drawn behind the cast on the street. */
const Gate: React.FC = () => {
  const f = SUBURB.feet;
  return (
    <g>
      {Array.from({ length: 26 }).map((_, i) => {
        const x = 1040 + i * 34;
        return i > 6 && i < 11 ? null : <rect key={i} x={x} y={f - 300} width={10} height={300} fill="#2E3A48" />;
      })}
      <rect x={1030} y={f - 290} width={900} height={12} fill="#2E3A48" />
      <rect x={1030} y={f - 120} width={900} height={12} fill="#2E3A48" />
      <rect x={1262} y={f - 380} width={30} height={380} fill="#3A4656" stroke="#1E2630" strokeWidth={4} />
      <rect x={1388} y={f - 380} width={30} height={380} fill="#3A4656" stroke="#1E2630" strokeWidth={4} />
      <rect x={1440} y={f - 470} width={300} height={70} rx={8} fill="#1F5A7A" stroke="#0E2A3A" strokeWidth={4} />
      <text x={1590} y={f - 424} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#F6EFE3">SCHOOL</text>
    </g>
  );
};
const NO_X = 1340, ME_X = 820;

export const S1 = thinkCard({ kicker: 'CHAPTER 6', title: 'THE CHOICE', seed: 23 });

// ---------- S2: after school, she's waiting at the gate ----------
export const S2 = scene({
  Set: DAY, cam: [1080, 470, 1.55], to: [1080, 460, 1.63], setT: 100, words, talk: { 1: [span(words, "It's", 'it')] },
  back: () => <Gate />,
  cast: [
    { look: YOU, pose: at(ME_X, { yaw: 0.4, look: 0.8 }), faces: [[0, 'neutral'], [c('S2', 'loud'), 'shock']] },
    { look: NORA, pose: at(NO_X, { yaw: -0.4, look: -0.8, headTilt: 6 }), faces: [[0, 'smug']] },
  ],
  over: (t) => <g transform={camT(1080, 470 - 10 * clamp(t / 63), 1.55 + 0.08 * clamp(t / 63))}><Silent x={NO_X} y={at(NO_X).y - 215} s={0.75} t={t} /></g>,
});
export const S3 = faceCU({ look: NORA, Bg: DAY, faces: [[0, 'neutral']], yaw: -0.3, zoom: [3.0, 3.2], words, talk: span(words, 'All', 'years'), look_: 0.4 });
export const S4 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'shock']], yaw: 0.3, zoom: [3.3, 3.5], words, talk: span(words, 'Had', 'Had'), look_: -0.4 });
export const S5 = faceCU({ look: NORA, Bg: DAY, faces: [[0, 'neutral'], [c('S5', 'make'), 'smug']], yaw: -0.25, zoom: [3.1, 3.4], words, talk: span(words, 'I', 'stop', 3), look_: 0.4, glint: 1, glintColor: THINK.glow });

// ---------- S6: Tonight. Silence. Forever. ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const ws: [string, number, string][] = [['Tonight.', c('S6', 'Tonight'), '#F6EFE3'], ['Silence.', c('S6', 'Silence'), THINK.glow], ['Forever.', c('S6', 'Forever'), '#F6EFE3']];
  const quiet = clamp((t - ws[1][1]) / 20);
  return (
    <g>
      <g opacity={1 - quiet * 0.9}>
        <ThoughtField t={t * 2} n={18} seed={31} />
      </g>
      <rect width={1920} height={1080} fill="#0B0816" opacity={0.4 + quiet * 0.5} />
      {ws.map(([w, k, col], i) => {
        const p = backOut(clamp((t - k) / 9));
        return (
          <text key={w} x={960} y={330 + i * 230} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill={col} opacity={clamp((t - k) / 4)} transform={`translate(960 ${330 + i * 230}) scale(${0.6 + 0.4 * p}) translate(-960 ${-(330 + i * 230)})`}>
            {w}
          </text>
        );
      })}
      <rect width={1920} height={1080} fill="#000" opacity={kf(t, [[len - 6, 0], [len, 0.3]])} />
    </g>
  );
};

// ---------- S7-S9: what silence would mean ----------
export const S7 = faceCU({
  look: YOU, Bg: NIGHT, faces: [[0, 'tired']], yaw: 0.1, zoom: [2.9, 3.1], pose: { blink: 1, headTilt: -12 },
  extra: (t, pose) => <text x={pose.x + 110} y={pose.y - 250} fontFamily={FONT.hand} fontWeight={700} fontSize={60} fill={THINK.calm} opacity={clamp((t - 8) / 10)}>z z z . . .</text>,
});
export const S8 = faceCU({ look: MO, Bg: NIGHT, faces: [[0, 'tired']], yaw: -0.2, zoom: [3.0, 3.2], think: { th: '. . . ?', pop: 8, s: 0.45, dim: 0.5 } });
export const S9 = thoughtCU({ text: 'No more lies.', s: 1.2, color: THINK.calm, dark: true });
export const S10 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'tired'], [20, 'neutral']], yaw: 0.25, zoom: [3.3, 3.5], look_: -0.6 });

// ---------- S11: what's the catch? No catch. ----------
export const S11 = scene({
  Set: DAY, cam: [1080, 460, 1.8], to: [1080, 460, 1.9], setT: 300, words, talk: { 0: [span(words, "What's", 'catch')], 1: [span(words, 'No', 'catch', 2)] },
  back: () => <Gate />,
  cast: [
    { look: YOU, pose: at(ME_X + 80, { yaw: 0.4, look: 0.8 }), faces: [[0, 'cool']] },
    { look: NORA, pose: at(NO_X - 80, { yaw: -0.4, look: -0.8 }), faces: [[0, 'neutral'], [c('S11', 'No'), 'happy']] },
  ],
  over: (t) => <g transform={camT(1080, 460, 1.8 + 0.1 * clamp(t / 120))}><Silent x={NO_X - 80} y={at(NO_X).y - 215} s={0.7} t={t} /></g>,
});
export const S12 = faceCU({ look: NORA, Bg: DAY, faces: [[0, 'happy']], yaw: -0.25, zoom: [2.6, 2.75], extra: (t, pose) => <Silent x={pose.x} y={pose.y - 190} s={0.8} t={t} /> });
export const S13 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'worried'], [c('S13', 'strange'), 'neutral'], [c('S13', 'nice'), 'happy']], yaw: 0.2, zoom: [2.9, 3.3], look_: -0.5 });

// ---------- S14-S19: home: Ellie at the kitchen table ----------
const EL = stand(KITCHEN, 0.42, 0.42), ME = stand(KITCHEN, 0.75, 0.42);
const Drawing: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-6)`}>
    <rect x={-70} y={-48} width={140} height={96} fill="#FBF8F0" stroke="#26232F" strokeWidth={3} />
    <circle cx={-34} cy={-18} r={14} fill="#FFD34A" />
    <path d="M -50 30 L -20 0 L 10 30 Z" fill="#7FB86A" />
    <path d="M 20 34 L 20 0 M 10 10 L 30 10" stroke="#26232F" strokeWidth={3} />
  </g>
);
export const S14: React.FC<ShotProps> = (p) =>
  scene({
    Set: KIT, cam: [(EL.x + ME.x) / 2, EL.y - 180, 1.75], to: [(EL.x + ME.x) / 2, EL.y - 190, 1.85], setT: 200,
    cast: (t) => [
      { look: ELLIE, pose: { x: EL.x, y: EL.y, scale: EL.scale * 0.85, yaw: 0.2, headTilt: 14, armR: { a: 70, b: -60 } }, faces: [[0, 'neutral']] },
      { look: YOU, pose: { x: kf(t, [[0, ME.x + 300], [40, ME.x]]), y: ME.y, scale: ME.scale, yaw: -0.4 }, faces: [[0, 'happy']] },
    ],
    front: () => (
      <g>
        <KitchenIsland />
        <Drawing x={EL.x + 90} y={EL.y + 30} s={0.6} />
      </g>
    ),
  })(p);
export const S15 = faceCU({ look: ELLIE, Bg: KIT, faces: [[0, 'neutral'], [c('S15', 'smiles'), 'happy']], yaw: 0.25, zoom: [3.0, 3.2], pose: { headTilt: 8 }, words, talk: span(words, 'School', 'great') });
export const S16 = faceCU({
  look: ELLIE, Bg: KIT, faces: [[0, 'happy'], [c('S16', 'something'), 'worried']], yaw: 0.25, zoom: [3.0, 3.3], pose: { headTilt: 8 },
  think: { th: [[c('S16', "Don't"), "Don't tell."], [c('S16', 'If'), "If you tell, they'll do it more."]], s: 0.5, side: 0.6, wrap: 18, color: THINK.hot },
});
export const S17 = noise({
  Set: KIT, cam: [EL.x, EL.y - 200, 2.0], to: [EL.x, EL.y - 200, 2.2], every: 5, shake: 1,
  cast: [{ look: ELLIE, pose: { x: EL.x, y: EL.y, scale: EL.scale * 0.85, yaw: 0.2, headTilt: 14 }, faces: [[0, 'worried']] }],
  texts: ["don't tell", "don't tell", 'DON\'T TELL', "don't tell", "don't tell"],
});
export const S18: React.FC<ShotProps> = (p) =>
  scene({
    Set: KIT, cam: [(EL.x + ME.x) / 2, EL.y - 160, 1.5], to: [(EL.x + ME.x) / 2, EL.y - 160, 1.6], setT: 260, dim: 0.35,
    cast: [
      { look: ELLIE, pose: { x: EL.x, y: EL.y, scale: EL.scale * 0.85, yaw: 0.2, headTilt: 14, armR: { a: 70, b: -60 } }, faces: [[0, 'worried']] },
      { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.4, look: -0.6 }, faces: [[0, 'worried']] },
    ],
    front: () => (
      <g>
        <KitchenIsland />
        <Drawing x={EL.x + 90} y={EL.y + 30} s={0.6} />
      </g>
    ),
  })(p);
export const S19 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'worried'], [c('S19', 'Except'), 'cool']], yaw: -0.3, zoom: [3.2, 3.5], look_: 0.6, glint: 1, glintColor: THINK.glow });

// ---------- S20-S24: next morning: "No. I'm keeping it." ----------
export const S20 = scene({
  Set: MORNING, cam: [1080, 470, 1.55], to: [1080, 470, 1.65], setT: 400, words, talk: { 1: [span(words, 'Well', 'Well')] },
  back: () => <Gate />,
  cast: [
    { look: YOU, pose: at(ME_X, { yaw: 0.4, look: 0.8 }), faces: [[0, 'neutral']] },
    { look: NORA, pose: at(NO_X, { yaw: -0.4, look: -0.8, headTilt: 6 }), faces: [[0, 'smug']] },
  ],
  over: (t) => <g transform={camT(1080, 470, 1.55 + 0.1 * clamp(t / 84))}><Silent x={NO_X} y={at(NO_X).y - 215} s={0.75} t={t} /></g>,
});
export const S21 = faceCU({ look: ELLIE, Bg: KIT, faces: [[0, 'worried']], yaw: 0.25, zoom: [3.0, 3.1], pose: { headTilt: 8 }, think: { th: "don't tell", pop: 0, s: 0.4, side: 0.6, color: THINK.hot } });
export const S22 = faceCU({ look: YOU, Bg: MORNING, faces: [[0, 'cool']], yaw: 0.3, zoom: [3.3, 3.5], words, talk: span(words, 'No', 'it', 3), look_: -0.4 });
export const S23 = faceCU({ look: NORA, Bg: MORNING, faces: [[0, 'smug'], [c('S23', 'smiling'), 'neutral']], yaw: -0.3, zoom: [3.0, 3.2], words, talk: span(words, 'Okay', 'choice'), look_: 0.4 });
export const S24: React.FC<ShotProps> = (p) =>
  scene({
    Set: MORNING, cam: [1080, 520, 1.2], to: [1080, 520, 1.25], setT: 500,
    back: () => <Gate />,
    cast: (t) => [
      { look: YOU, pose: at(ME_X, { yaw: 0.4, look: 0.8 }), faces: [[0, 'neutral']] },
      { look: NORA, pose: at(kf(t, [[0, NO_X], [45, NO_X + 420]]), { yaw: 0.6, legL: { a: Math.sin(t / 3) * 16, b: 0 }, legR: { a: -Math.sin(t / 3) * 16, b: 0 } }), faces: [[0, 'neutral']] },
    ],
  })(p);

// ---------- S25: Ellie's teacher ----------
const T = stand(CLS, 0.3, 0.3), E2 = stand(CLS, 0.5, 0.4), Y2 = stand(CLS, 0.62, 0.4), M2 = stand(CLS, 0.74, 0.4);
export const S25 = scene({
  Set: CLASS, cam: [(T.x + Y2.x) / 2, T.y - 120, 1.3], to: [(T.x + Y2.x) / 2, T.y - 130, 1.4], setT: 600, words, talk: { 2: [span(words, 'You', 'name', 2)] },
  cast: [
    { look: TEACHER, pose: { x: T.x, y: T.y, scale: T.scale, yaw: 0.4 }, faces: [[0, 'neutral'], [c('S25', 'name'), 'worried']], think: { th: [[c('S25', 'exactly'), 'oh no.'], [c('S25', 'name'), 'oh no. oh, sweetheart.']], s: 0.6, side: 0.4 } },
    { look: ELLIE, pose: { x: E2.x, y: E2.y, scale: E2.scale * 0.85, yaw: -0.3, headTilt: 10 }, faces: [[0, 'worried']] },
    { look: YOU, pose: { x: Y2.x, y: Y2.y, scale: Y2.scale, yaw: -0.4, armL: { a: 120, b: -30 } }, faces: [[0, 'cool']] },
  ],
});

// ---------- S26-S27: Mo comes too ----------
export const S26 = scene({
  Set: CLASS, cam: [(E2.x + M2.x) / 2, E2.y - 140, 1.5], to: [(E2.x + M2.x) / 2, E2.y - 150, 1.6], setT: 660,
  cast: (t) => [
    { look: ELLIE, pose: { x: E2.x, y: E2.y, scale: E2.scale * 0.85, yaw: -0.3, headTilt: 10 }, faces: [[0, 'worried']] },
    { look: YOU, pose: { x: Y2.x, y: Y2.y, scale: Y2.scale, yaw: -0.4 }, faces: [[0, 'cool'], [60, 'happy']] },
    { look: MO, pose: { x: kf(t, [[0, M2.x + 360], [50, M2.x]]), y: M2.y, scale: M2.scale, yaw: -0.4, legL: { a: t < 50 ? Math.sin(t / 3) * 16 : 0, b: 0 }, legR: { a: t < 50 ? -Math.sin(t / 3) * 16 : 0, b: 0 } }, faces: [[0, 'neutral']] },
  ],
});
export const S27 = faceCU({
  look: MO, Bg: CLASS, faces: [[0, 'neutral'], [c('S27', 'got'), 'happy']], yaw: -0.3, zoom: [3.0, 3.2], words, talk: span(words, "I've", 'you', 2), look_: 0.4,
  think: { th: [[c('S27', "I've"), "I've got you."]], s: 0.5, side: -0.5, color: THINK.warm },
});
export const S28 = bigWord({ kicker: 'BY FRIDAY', word: "IT'S OVER.", color: THINK.calm, Bg: DAY, size: 160 });

// ---------- S29: Ellie hugs you so hard your ribs hurt ----------
export const S29 = scene({
  Set: KIT, cam: [EL.x + 160, EL.y - 180, 1.7], to: [EL.x + 160, EL.y - 190, 1.8], setT: 320,
  cast: [
    { look: YOU, pose: { x: EL.x + 230, y: EL.y, scale: EL.scale, yaw: -0.4, tilt: -6, armL: { a: 70, b: -80 }, armR: { a: 70, b: -80 } }, faces: [[0, 'oops'], [40, 'happy']] },
    { look: ELLIE, pose: { x: EL.x + 120, y: EL.y, scale: EL.scale * 0.85, yaw: 0.4, tilt: 10, armL: { a: 120, b: -40 }, armR: { a: 120, b: -40 } }, faces: [[0, 'happy']], think: { th: 'thank you thank you', pop: 12, s: 0.5, side: -0.5, color: THINK.warm } },
  ],
});
