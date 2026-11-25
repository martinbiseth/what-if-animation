import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, faceAt, FONT, Glow, walkPose, SUBURB, busHip, Bedroom, BedDuvet, bedSit, WINDOW,
  BusCabFront, Rooftop, stand, KITCHEN, KitchenIsland, CLS, THINK, ThoughtBubble,
} from '../../../engine';
import words from './words.json';
import tl from './timeline.json';
import {
  YOU, MO, MUM, DRIVER, SUITMAN, BABYMUM, TEACHER, N1, N2, N3, N4, N5, KID, StreetSet, KitchenSet, BusSet, CabSet, ClassSet, faceCU, thoughtCU,
  people, at, scene, ThoughtField, cueIn, span, Soft,
} from '../common';

// Chapter 1, the cold open: mum's "Morning, sweetheart!" and the cereal-bowl thought; the bus like a room full of
// radios (the driver's song, the pay-rise man, the "ugly baby"); the pigeon panic; Mo's "Nice!" haircut; the
// teacher's "Great question!"; every thought, only for you; the question. 24+ cuts a minute.

const c = (shot: string, w: string, n = 1) => cueIn(words, tl, shot, w, n);
const KIT = KitchenSet(0.3);
const BUSS = BusSet(7);
const MORNING = StreetSet('morning');
const DAY = StreetSet('day');
const CLASS = ClassSet(0);
const MU = stand(KITCHEN, 0.36, 0.4), ME = stand(KITCHEN, 0.7, 0.4);

// ---------- S1: you wake in bed, morning light ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.22);
  const face = faceAt(t, [[0, 'tired'], [16, 'neutral']]);
  const up = clamp((t - 6) / 14);
  const me: Pose = { ...basePose, x: sit.x, y: sit.y - up * 10, scale: sit.scale, yaw: 0.5, look: 0.7, tilt: (1 - up) * -30, ...face, blink: t < 10 ? 1 : face.blink, armR: { a: 30, b: -20 } };
  return (
    <g transform={camT(1000, 520, kf(t, [[0, 1.25], [len, 1.35]]))}>
      <Bedroom t={t} id="b1" veil={0.15} clock="07:12" lamp={0} duvet={false} />
      <Hero look={YOU} pose={me} />
      <BedDuvet knees={1} />
      <rect x={WINDOW.x0} y={WINDOW.y0} width={WINDOW.x1 - WINDOW.x0} height={WINDOW.y1 - WINDOW.y0} fill="#FFD9A8" opacity={0.85} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#FFE2B0" opacity={0.12} style={{ mixBlendMode: 'screen' }} />
    </g>
  );
};

// ---------- S2: the kitchen: you walk in, mum at the island turns and smiles ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, ME.x + 260], [30, ME.x]]);
  return scene({
    Set: KIT, cam: [960, 560, 1.25], to: [960, 560, 1.32], setT: 100,
    cast: [
      { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: kf(t, [[0, -0.6], [24, 0.7]]), armR: { a: 40, b: -60 } }, faces: [[0, 'neutral'], [26, 'happy']] },
      { look: YOU, pose: { x, y: ME.y, scale: ME.scale, yaw: -0.6, legL: { a: Math.sin(t / 3) * 14 * (t < 30 ? 1 : 0), b: 0 }, legR: { a: -Math.sin(t / 3) * 14 * (t < 30 ? 1 : 0), b: 0 } }, faces: [[0, 'tired']] },
    ],
    front: () => <KitchenIsland />,
  })({ t, len, f: t } as ShotProps);
};

// ---------- S3: mum, medium: "Morning, sweetheart!" ----------
const mumLine = span(words, 'Morning', 'sweetheart');
export const S3 = scene({
  Set: KIT, cam: [MU.x + 60, MU.y - 60, 2.4], to: [MU.x + 60, MU.y - 60, 2.55], setT: 160, words, talk: { 0: [mumLine] },
  cast: [{ look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.6, armL: { a: 120, b: -40 } }, faces: [[0, 'happy']] }],
  front: () => <KitchenIsland />,
});

// ---------- S4: you: something else, a whisper ----------
export const S4 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'tired'], [8, 'shock']], yaw: -0.35, zoom: [3.1, 3.35], glint: 1, glintColor: THINK.glow });

// ---------- S5: mum close, still smiling; rings rise from her head ----------
export const S5 = faceCU({ look: MUM, Bg: KIT, faces: [[0, 'happy']], yaw: 0.4, zoom: [2.9, 3.1], waves: 1 });

// ---------- S6: her thought, over her smiling face: the cereal bowl ----------
export const S6 = scene({
  Set: KIT, cam: [MU.x + 160, MU.y - 250, 1.55], to: [MU.x + 160, MU.y - 260, 1.65], setT: 220,
  cast: [
    { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.6, armL: { a: 30, b: -40 } }, faces: [[0, 'happy']], think: { th: 'If he leaves that cereal bowl in the sink...', pop: 2, s: 0.75, wrap: 20, side: 0.6 } },
  ],
  front: () => <KitchenIsland />,
});

// ---------- S7: ONE MORE TIME ----------
export const S7 = thoughtCU({ text: 'ONE MORE TIME...', Bg: KIT, loud: 0.8, s: 1.7 });

// ---------- S8: the bus: everyone thinking at once, rings over every head ----------
const BUSFOLK = [N1, N2, N3, N4, N5, KID];
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 880], [len, 1040]]), 520, 1.05)}>
    <BUSS t={t} id="s8" />
    {people(t, BUSFOLK.map((look, i) => ({ look, pose: { x: 80 + i * 330, y: busHip(1), yaw: i % 2 ? -0.4 : 0.3, armR: { a: 170, b: 0 } }, waves: clamp((t - 4 - i * 5) / 8) })))}
  </g>
);

// ---------- S9: the driver, same three words on repeat ----------
const SONG = '♪ Dancing all night ♪';
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const k = Math.floor(clamp(t / len) * 3);
  return (
    <g transform={camT(800, 520, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <CabSet t={t} id="s9" />
      {people(t, [{ look: DRIVER, pose: { x: 700, y: 720, yaw: 0.35, headTilt: Math.sin(t / 4) * 5, armL: { a: 50, b: -70 }, armR: { a: 50, b: -70 } }, think: { th: [[c('S9', 'same'), SONG], [c('S9', 'stuck'), SONG + ' ' + SONG.replace(/♪ /g, '').replace(/ ♪/, '')]], s: 0.95, wrap: 24 } }])}
      {[0, 1, 2].map((i) => (i < k ? <text key={i} x={980 + i * 90} y={300 - i * 40} fontFamily={FONT.hand} fontSize={70} fill={THINK.glow} opacity={0.7}>♪</text> : null))}
      <BusCabFront />
    </g>
  );
};

// ---------- S10: a man in a suit, rehearsing under his breath ----------
export const S10 = scene({
  Set: BUSS, cam: [900, 470, 2.0], to: [900, 470, 2.12], setT: 130,
  cast: [{ look: SUITMAN, pose: { x: 900, y: busHip(1), yaw: 0.3, armR: { a: 170, b: 0 }, armL: { a: 60, b: -100 } }, faces: [[0, 'worried']], waves: 0.8 }],
});

// ---------- S11: "I deserve this. I DESERVE THIS." ----------
export const S11 = scene({
  Set: BUSS, cam: [960, 400, 2.3], to: [960, 400, 2.45], setT: 150,
  cast: [{ look: SUITMAN, pose: { x: 900, y: busHip(1), yaw: 0.3, armR: { a: 170, b: 0 }, armL: { a: 80, b: -110 } }, faces: [[0, 'worried'], [c('S11', 'I', 2), 'cool']], think: { th: [[2, 'I deserve this.'], [c('S11', 'I', 2), 'I DESERVE THIS.']], s: 0.75, side: 0.5 } }],
});

// ---------- S12: a woman smiles at a baby: "Ugly. Very ugly. Cute, though." ----------
const Pram: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -110 -40 A 110 90 0 0 1 110 -40 Z" fill="#4AA8A0" stroke="#26232F" strokeWidth={6} />
    <rect x={-120} y={-44} width={240} height={90} rx={30} fill="#5BC0B8" stroke="#26232F" strokeWidth={6} />
    <circle cx={-10} cy={-56} r={34} fill="#26232F" />
    <circle cx={-22} cy={-60} r={6} fill="#F6EFE3" />
    <circle cx={2} cy={-60} r={6} fill="#F6EFE3" />
    <ellipse cx={-10} cy={-42} rx={8 + Math.sin(t / 5) * 2} ry={5} fill="#F6EFE3" />
    <circle cx={-80} cy={70} r={22} fill="#26232F" />
    <circle cx={80} cy={70} r={22} fill="#26232F" />
  </g>
);
export const S12: React.FC<ShotProps> = (p) => {
  const k1 = c('S12', 'Ugly'), k2 = c('S12', 'Very'), k3 = c('S12', 'Cute');
  return scene({
    Set: BUSS, cam: [980, 470, 1.8], to: [980, 470, 1.9], setT: 170,
    cast: [{ look: BABYMUM, pose: { x: 860, y: busHip(1), yaw: 0.5, look: 0.8, armR: { a: 60, b: -60 }, armL: { a: 30, b: -40 } }, faces: [[0, 'happy']], think: { th: [[k1, 'Ugly.'], [k2, 'Very ugly.'], [k3, 'Cute, though.']], s: 0.7, side: -0.4 } }],
    front: (t) => <Pram x={1120} y={busHip(1) + 40} t={t} />,
  })(p);
};

// ---------- S13: the bus stop: a pigeon struts past; you freeze ----------
const Pigeon: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => {
  const bob = Math.abs(Math.sin(t / 3)) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={-40} rx={56} ry={36} fill="#8A8E9E" stroke="#26232F" strokeWidth={5} />
      <path d="M -50 -40 L -96 -60 L -90 -30 Z" fill="#6A6E7E" stroke="#26232F" strokeWidth={5} />
      <g transform={`translate(${40 + bob * 0.6} ${-74 + bob * 0.4})`}>
        <circle r={24} fill="#7A7E8E" stroke="#26232F" strokeWidth={5} />
        <circle cx={8} cy={-4} r={5} fill="#FF8A3D" />
        <path d="M 22 2 L 38 6 L 22 10 Z" fill="#E8A83A" />
      </g>
      <path d="M -6 -6 V 14 M 14 -6 V 14" stroke="#E8504A" strokeWidth={5} />
    </g>
  );
};
export const S13: React.FC<ShotProps> = (p) =>
  scene({
    Set: MORNING, cam: [960, 560, 1.5], to: [1000, 560, 1.56], setT: 300,
    cast: [{ look: YOU, pose: at(760, { yaw: 0.5, look: 0.7 }), faces: [[0, 'neutral'], [c('S13', 'second'), 'shock']] }, { look: N2, pose: at(1380, { yaw: -0.3 }), waves: 0.6 }],
    front: (t) => <Pigeon x={kf(t, [[0, 1300], [p.len, 900]])} y={SUBURB.feet} t={t} s={0.9} />,
  })(p);

// ---------- S14: you, panicking: can you hear BIRDS? ----------
export const S14 = faceCU({ look: YOU, Bg: MORNING, faces: [[0, 'shock']], yaw: 0.35, zoom: [3.3, 3.5], shake: 1, think: { th: 'birds too?!', pop: 3, s: 0.38 } });

// ---------- S15: the street: just people, rings over every head, the pigeon silent ----------
export const S15 = scene({
  Set: MORNING, cam: [960, 540, 1.1], to: [960, 540, 1.16], setT: 340,
  cast: [
    { look: N1, pose: at(380, { yaw: 0.3 }), waves: 0.8 },
    { look: N3, pose: at(700, { yaw: -0.2 }), waves: 0.8 },
    { look: YOU, pose: at(980, { yaw: 0.1, look: 0.2 }), faces: [[0, 'worried'], [30, 'neutral']] },
    { look: N4, pose: at(1260, { yaw: -0.4 }), waves: 0.8 },
    { look: N5, pose: at(1560, { yaw: -0.3 }), waves: 0.8 },
  ],
  front: (t) => <Pigeon x={1120 - t * 2} y={SUBURB.feet + 10} t={t} s={0.6} />,
});

// ---------- S16: school: Mo looks at your new haircut ----------
const Tuft: React.FC<{ pose: Pose }> = ({ pose }) => (
  <path transform={`translate(${pose.x + pose.yaw * 10 * pose.scale} ${pose.y - 238 * pose.scale}) scale(${pose.scale})`} d="M -50 10 L -36 -34 L -16 4 L 0 -44 L 16 4 L 36 -32 L 50 10 Z" fill="#17131C" stroke="#100E16" strokeWidth={5} />
);
const ME_C = stand(CLS, 0.62, 0.62), MO_C = stand(CLS, 0.8, 0.62);
const HAIR = { ...YOU, extra: undefined };
export const S16: React.FC<ShotProps> = ({ t, len, f }) => {
  const me: Partial<Pose> = { x: ME_C.x, y: ME_C.y, scale: ME_C.scale, yaw: 0.5, look: 0.6 };
  return (
    <g transform={camT((ME_C.x + MO_C.x) / 2, ME_C.y - 130, kf(t, [[0, 1.55], [len, 1.65]]))}>
      <CLASS t={t + 100} id="s16" />
      {people(t, [
        { look: HAIR, pose: me, faces: [[0, 'smug']] },
        { look: MO, pose: { x: MO_C.x, y: MO_C.y, scale: MO_C.scale, yaw: -0.5, look: -0.7 }, faces: [[0, 'neutral'], [30, 'shock']] },
      ])}
      <Tuft pose={{ ...basePose, ...me } as Pose} />
    </g>
  );
};

// ---------- S17: Mo, close, thumbs up: "Nice!" ----------
export const S17 = faceCU({ look: MO, Bg: CLASS, faces: [[0, 'happy']], yaw: -0.35, zoom: [3.0, 3.2], words, talk: span(words, 'Nice', 'Nice'), pose: { armR: { a: 120, b: -120 } } });

// ---------- S18: same smile; his thought: "Oh no. What did he do?" ----------
export const S18 = faceCU({
  look: MO, Bg: CLASS, faces: [[0, 'happy']], yaw: -0.35, zoom: [2.6, 2.75], pose: { armR: { a: 120, b: -120 } },
  think: { th: [[c('S18', 'Oh'), 'Oh no.'], [c('S18', 'What'), 'Oh no. What did he do?']], s: 0.5, side: -0.5 },
});

// ---------- S19: the teacher at the board: "Great question!" ----------
const T = stand(CLS, 0.3, 0.3);
const tLine = span(words, 'Great', 'question');
export const S19 = scene({
  Set: CLASS, cam: [T.x + 80, T.y - 120, 1.7], to: [T.x + 80, T.y - 120, 1.82], setT: 140, words, talk: { 0: [tLine] },
  cast: [{ look: TEACHER, pose: { x: T.x, y: T.y, scale: T.scale, yaw: 0.4, armL: { a: 120, b: -20 } }, faces: [[0, 'happy']] }],
});

// ---------- S20: same smile, the thought stacking up: "Please. Stop. Asking. Questions." ----------
export const S20: React.FC<ShotProps> = (p) => {
  const ks = ['Please.', 'Stop.', 'Asking.', 'Questions.'];
  const keys: [number, string][] = ks.map((w, i) => [c('S20', w.replace('.', '')), ks.slice(0, i + 1).join(' ')]);
  return scene({
    Set: CLASS, cam: [T.x + 200, T.y - 250, 1.55], to: [T.x + 200, T.y - 260, 1.65], setT: 200,
    cast: [{ look: TEACHER, pose: { x: T.x, y: T.y, scale: T.scale, yaw: 0.4, armL: { a: 120, b: -20 } }, faces: [[0, 'happy']], think: { th: keys, s: 0.8, side: 0.7, wrap: 14, loud: 0 } }],
  })(p);
};

// ---------- S21: every person, every thought: a street of clouds ----------
const TEXTS = ['milk', 'late!', 'is it Friday?', 'nice dog', 'my back...', 'pizza', "don't trip", 'she hates me'];
export const S21 = scene({
  Set: DAY, cam: [960, 520, 1.0], to: [960, 520, 1.08], setT: 400,
  cast: [N1, N2, N3, N4, N5, KID].map((look, i) => ({ look, pose: at(200 + i * 300, { yaw: i % 2 ? -0.3 : 0.3 }), think: { th: TEXTS[i], pop: 2 + i * 4, s: 0.5 } })),
});

// ---------- S22: you, close, alone with all of it: only you ----------
export const S22 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'worried']], yaw: 0.2, zoom: [3.2, 3.45], glint: 1, glintColor: THINK.glow, front: (t) => <g opacity={0.5}><ThoughtField t={t} n={8} bg={false} /></g> });

// ---------- S23: the question, on the rooftop at dusk over a city of drifting thoughts ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const p: Pose = { ...basePose, x: 960, y: 760, scale: 0.9, yaw: 0.1, look: -0.2, headTilt: -6 + Math.sin(t / 30) * 2, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } };
  return (
    <g>
      <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1.18]]))}>
        <Rooftop t={t + 300} />
        <g opacity={0.85}><ThoughtField t={t + 100} bg={false} n={12} blur={false} seed={7} /></g>
        <Hero look={YOU} pose={{ ...p, expr: 'worried', blink: 0 }} />
      </g>
    </g>
  );
};
