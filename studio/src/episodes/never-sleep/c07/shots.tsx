import React from 'react';
import { Hero, bedSit, BedDuvet } from '../../../engine';
import {
  YOU_PJ, MOM, MO, Soft, Body, Bedroom, BEDROOM, Schematic, SCH, SchLabel, PopWord, Big, bigWord, faceCU, hourCard, phoneShot, Messages,
  Teddy, Brain, Rat, Smartphone, Glow, sitPose, headAt, basePose, camT, clamp, kf, backOut, easeOut, easeInOut, idleBlink, FONT, UI,
  phrase, ShotProps, Pose, Word, schShot,
} from '../common';
import words from './words.json';

// Chapter 7, lights off: day 11, back in your own bed; Ellie's hallway light, mum at the end of the bed, Mo asleep in a
// chair with crisps; you close your eyes and count; breathing, the heartbeat slows; the room goes soft; for the first
// time in eleven days your eyelids get heavy; then the phone buzzes: an unknown number, "Don't fall asleep. Not yet.";
// is any of this real (all real, sources in the description); would you take the deal; subscribe for part two.

const W = words as Word[];
const rel = (a: string, b: string, nb = 1) => Math.max(0, Math.round((phrase(W, b, nb)[0] - phrase(W, a)[0]) * 30));
const ROOM: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} clock="22:40" crossed={11} lamp={0.35} veil={0.55} duvet={false} />;
const ROOMD: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} clock="22:40" crossed={11} lamp={0.35} veil={0.55} />;

const k = (w: number) => BEDROOM.s(w) / BEDROOM.s(0.05);
/** Mum sitting on the foot of the bed. */
const mumPose = (t: number): Pose => {
  const p = BEDROOM.P(0.3, 0.79, 0.46);
  return sitPose(p.x, p.y, 0.62 * k(0.46), -0.5, { headTilt: 6, blink: idleBlink(t, 7), armL: { a: 30, b: -40 }, armR: { a: 20, b: -30 } });
};
/** Mo asleep in a chair in the front right corner, crisps on his lap. */
const moPose = (t: number): Pose => {
  const p = BEDROOM.P(0.74, 0.86, 0.62);
  return sitPose(p.x, p.y, 0.62 * k(0.62), -0.3, { tilt: -6, headTilt: 22 + Math.sin(t / 40) * 3, blink: 1, armL: { a: 40, b: -70 }, armR: { a: 30, b: -60 } });
};
const Chair: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-260} width={240} height={250} rx={30} fill="#5A3E4E" stroke="#14121C" strokeWidth={6} />
    <rect x={-140} y={-20} width={280} height={70} rx={20} fill="#6A4A5C" stroke="#14121C" strokeWidth={6} />
    <rect x={-120} y={50} width={20} height={70} fill="#2A1E26" />
    <rect x={100} y={50} width={20} height={70} fill="#2A1E26" />
  </g>
);
const Crisps: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -40 -60 L 40 -60 L 46 60 L -46 60 Z" fill="#E8453A" stroke="#14121C" strokeWidth={4} />
    <path d="M -40 -60 l 10 -8 l 10 8 l 10 -8 l 10 8 l 10 -8 l 10 8 l 10 -8 l 10 8" fill="#E8453A" stroke="#14121C" strokeWidth={3} />
    <ellipse cx={0} cy={6} rx={26} ry={18} fill="#FFD23A" />
    <text x={0} y={46} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={18} fill="#F6EFE3">CRISPS</text>
  </g>
);
/** Snoring z's above a head. */
const Zs: React.FC<{ x: number; y: number; t: number; s?: number; c?: string }> = ({ x, y, t, s = 1, c = '#C8D8F0' }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const q = (t / 30 + i / 3) % 1;
      return <text key={i} x={x + (20 + i * 16) * s} y={y - q * 90 * s} fontFamily={FONT.title} fontWeight={800} fontSize={(26 + i * 10) * s} fill={c} opacity={Math.sin(q * Math.PI)}>z</text>;
    })}
  </g>
);

/** You in bed, propped on the pillows. */
const youPose = (t: number, shut = 0): Pose => {
  const b = bedSit(0.16);
  return { ...basePose, ...b, yaw: 0.25, tilt: -14, expr: 'tired', blink: Math.max(shut, idleBlink(t, 4)), armL: { a: 20, b: -20 }, armR: { a: 20, b: -20 } };
};
const BedScene: React.FC<{ t: number; shut?: number; mum?: boolean; mo?: boolean }> = ({ t, shut = 0, mum = true, mo = true }) => {
  const m = moPose(t);
  const mh = headAt(m);
  return (
    <g>
      <ROOM t={t} />
      <Hero look={YOU_PJ} pose={youPose(t, shut)} shadow={0} />
      <BedDuvet />
      {mum ? <Hero look={MOM} pose={mumPose(t)} shadow={0} /> : null}
      {mo ? (
        <g>
          <Chair x={m.x} y={m.y + 40 * m.scale} s={m.scale} />
          <Hero look={MO} pose={m} shadow={0} />
          <Crisps x={m.x + 40 * m.scale} y={m.y - 10 * m.scale} s={m.scale * 0.9} rot={-20} />
          <Zs x={mh.x} y={mh.y - 60 * m.scale} t={t} s={m.scale} />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------- S1: DAY 11, lights off
export const S1 = hourCard({ big: 'DAY 11', kicker: 'LIGHTS OFF', Bg: ROOMD });

// ---------------------------------------------------------------- S2: back in your own bed (wide)
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 820], [len, 800]]), 560, kf(t, [[0, 1.45], [len, 1.6]]))}>
    <BedScene t={t} mum={false} mo={false} />
    <Glow x={700} y={560} r={420} kind="warm" o={0.25} />
  </g>
);

// ---------------------------------------------------------------- S3: Ellie has left the hallway light on, just a crack
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const d = BEDROOM.P(0, 0.6, 0.54);
  const glow = 0.6 + 0.1 * Math.sin(t / 10);
  return (
    <g transform={camT(d.x + 60, d.y, kf(t, [[0, 2.6], [len, 2.9]], easeInOut))}>
      <ROOM t={t + 100} />
      <Glow x={d.x} y={d.y - 40} r={260} kind="warm" o={glow} />
      <PopWord t={t} at={rel('Ellie has left', 'just a crack')} x={d.x + 180} y={d.y - 200} text="JUST A CRACK" size={34} fill="#FFC27A" hold={300} rot={-3} />
    </g>
  );
};

// ---------------------------------------------------------------- S4: mum sits at the end of the bed
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(760, 600, kf(t, [[0, 1.8], [len, 1.95]]))}>
    <BedScene t={t + 200} mo={false} />
    <Glow x={760} y={560} r={360} kind="warm" o={0.2} />
  </g>
);

// ---------------------------------------------------------------- S5: Mo asleep in the chair, snoring, crisps
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const m = moPose(t);
  return (
    <g transform={camT(m.x - 20, m.y - 120 * m.scale, kf(t, [[0, 2.5], [len, 2.7]]))}>
      <BedScene t={t + 300} />
      <PopWord t={t} at={rel('Mo is asleep', 'snoring')} x={m.x + 150 * m.scale} y={m.y - 330 * m.scale} text="SNORK" size={22} fill="#C8D8F0" hold={30} rot={8} />
    </g>
  );
};

/** A close-up of you on your pillow: eyes closing (shut 0..1), slow breathing. */
const pillowCU = (o: { shut: (t: number, len: number) => number; zoom?: [number, number]; blur?: (t: number, len: number) => number; extra?: (t: number, len: number) => React.ReactNode; expr?: Pose['expr'] }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const br = Math.sin(t / 22) * 4;
    const pose: Pose = { ...basePose, x: 960, y: 720 + br, scale: 1, yaw: 0.2, expr: o.expr ?? 'tired', blink: clamp(o.shut(t, len)), headTilt: -12 };
    const bl = o.blur?.(t, len) ?? 0;
    return (
      <g>
        <Soft blur={16} dim={0.4 + bl * 0.3}>
          <g transform={camT(760, 520, 1.6 + bl * 0.2)}>
            <ROOMD t={t + 400} />
          </g>
        </Soft>
        <g transform={camT(960, 560, kf(t, [[0, o.zoom?.[0] ?? 2.8], [Math.max(1, len), o.zoom?.[1] ?? 3.0]]))}>
          <ellipse cx={960} cy={headAt(pose).y + 30} rx={210} ry={80} fill="#E4E0EC" />
          <Hero look={YOU_PJ} pose={pose} shadow={0} />
          <path d={`M 560 650 Q 960 ${600 + br} 1360 650 L 1380 1100 L 540 1100 Z`} fill="#4A6AA8" stroke="#14121C" strokeWidth={5} />
        </g>
        {bl > 0 ? <rect width={1920} height={1080} fill="#1A1630" opacity={bl * 0.45} /> : null}
        {o.extra?.(t, len)}
      </g>
    );
  };
  return Shot;
};

// ---------------------------------------------------------------- S6: you close your eyes, you count: one, two, three
export const S6 = pillowCU({
  shut: (t) => clamp((t - 6) / 10),
  extra: (t) => (
    <g>
      {['One', 'Two', 'Three'].map((n, i) => (
        <PopWord key={n} t={t} at={rel('You close your eyes', n)} x={620 + i * 340} y={260} text={['1', '2', '3'][i]} size={110} fill="#C8D8F0" hold={300} />
      ))}
    </g>
  ),
});

// ---------------------------------------------------------------- S7: breathe in, breathe out: the heartbeat slows (schematic)
export const S7 = schShot({
  title: 'BREATHE IN. BREATHE OUT.',
  real: 0,
  draw: (t) => {
    const bpm = Math.round(kf(t, [[0, 96], [rel('Breathe in', 'Your heartbeat'), 90], [rel('Breathe in', 'down') + 30, 58]]));
    const per = 60 / bpm;
    const pts: string[] = [];
    for (let x = 0; x <= 1200; x += 6) {
      const sec = (x / 1200) * 4 + t / 30;
      const ph = (sec % per) / per;
      const y = ph < 0.06 ? -Math.sin((ph / 0.06) * Math.PI) * 140 : ph < 0.1 ? Math.sin(((ph - 0.06) / 0.04) * Math.PI) * 40 : 0;
      pts.push(`${360 + x} ${560 + y}`);
    }
    const bx = Math.sin(t / 16);
    return (
      <g>
        <circle cx={960} cy={300} r={60 + 30 * bx} fill="none" stroke={SCH.dim} strokeWidth={5} />
        <text x={960} y={316} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={SCH.line}>{bx > 0 ? 'IN' : 'OUT'}</text>
        <path d={`M ${pts.join(' L ')}`} stroke="#FF6A5A" strokeWidth={6} fill="none" />
        <Big x={960} y={860} size={110} fill={bpm < 70 ? '#5AE08A' : '#FF6A5A'}>{`${bpm} BPM`}</Big>
      </g>
    );
  },
});

// ---------------------------------------------------------------- S8: the room starts to feel soft and far away
export const S8 = pillowCU({ shut: () => 1, zoom: [3.0, 2.2], blur: (t, len) => easeInOut(clamp(t / Math.max(1, len))), expr: 'neutral' });

// ---------------------------------------------------------------- S9: for the first time in eleven days, something heavy pulls at your eyelids
export const S9 = pillowCU({
  shut: (t, len) => kf(t, [[0, 0.2], [len * 0.5, 0.55], [len, 0.85]]), zoom: [3.6, 4.4], expr: 'tired',
  extra: (t) => <PopWord t={t} at={rel('And for the first time', 'heavy')} x={960} y={230} text="HEAVY..." size={80} fill="#C8D8F0" hold={300} />,
});

// ---------------------------------------------------------------- S10: then your phone buzzes (eyes snap open)
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const ns = BEDROOM.P(0.48, 0.78, 0.06);
  return (
    <g transform={camT(ns.x, ns.y - 40, kf(t, [[0, 3.0], [len, 3.3]]))}>
      <ROOMD t={t + 500} />
      <Glow x={ns.x} y={ns.y - 20} r={160} kind="cool" o={0.5 + 0.3 * Math.sin(t)} />
      <Smartphone x={ns.x} y={ns.y - 8} s={0.16} rot={80} mode="home" t={t} buzz={1} />
      <PopWord t={t} at={2} x={ns.x} y={ns.y - 90} text="BZZT" size={26} fill="#F6EFE3" hold={40} rot={-6} />
      <PopWord t={t} at={22} x={ns.x + 10} y={ns.y - 110} text="BZZT" size={26} fill="#F6EFE3" hold={40} rot={6} />
    </g>
  );
};

// ---------------------------------------------------------------- S11: the message from an unknown number
export const S11 = phoneShot({
  Bg: ROOMD,
  zoom: [1.35, 1.55],
  screen: (t) => (
    <Messages t={t} from="UNKNOWN" msgs={[
      { text: "Don't fall asleep.", at: rel('A message from', "Don't") },
      { text: 'Not yet.', at: rel('A message from', 'Not yet') },
      { text: "Need to talk about what you'll see.", at: rel('A message from', 'We need') },
    ]} />
  ),
});

// ---------------------------------------------------------------- S12: is any of this real? All real.
const FACTS = [
  ['THE ADENOSINE ALARM', 'adenosine'],
  ['THE BRAIN WASH', 'brain'],
  ['DRUNK-LIKE REACTION TIMES', 'drunk-like'],
  ["RANDY GARDNER'S 11 DAYS", "Gardner's"],
  ['THE RATS', 'rats'],
] as const;
export const S12 = schShot({
  title: 'IS ANY OF THIS REAL?',
  real: 0,
  draw: (t) => (
    <g>
      {FACTS.map(([txt, cue], i) => {
        const at = rel('Is any of this real', cue);
        const s = backOut(clamp((t - at) / 8));
        return (
          <g key={txt} transform={`translate(560 ${300 + i * 105})`} opacity={clamp((t - at) / 4)}>
            <g transform={`scale(${s})`}>
              <rect x={-36} y={-36} width={72} height={72} rx={12} fill="none" stroke={SCH.line} strokeWidth={5} />
              <path d="M -20 0 L -6 16 L 22 -18" stroke="#5AE08A" strokeWidth={9} fill="none" strokeLinecap="round" />
            </g>
            <text x={70} y={16} fontFamily={FONT.ui} fontSize={46} fill={SCH.line}>{txt}</text>
          </g>
        );
      })}
      <g transform={`translate(1500 400) rotate(-8) scale(${backOut(clamp((t - rel('Is any of this real', 'All real')) / 9))})`}>
        <Big x={0} y={0} size={110} fill="#5AE08A">ALL REAL</Big>
      </g>
      <SchLabel x={960} y={930} t={t - rel('Is any of this real', 'sources')} text="SOURCES IN THE DESCRIPTION" size={38} />
    </g>
  ),
});

// ---------------------------------------------------------------- S13: would you take eight free hours a night, if you knew the price?
export const S13 = bigWord({ kicker: 'WOULD YOU TAKE', word: '8 FREE HOURS?', color: '#FFD23A', Bg: ROOMD, size: 190 });

// ---------------------------------------------------------------- S14: tell me in the comments
export const S14 = bigWord({ kicker: 'TELL ME', word: 'IN THE COMMENTS', color: '#FF8A3D', Bg: ROOMD, size: 150 });

// ---------------------------------------------------------------- S15: end card: the glowing phone in the dark, PART 2, subscribe
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <rect width={1920} height={1080} fill="#0B0816" />
      <Glow x={960} y={600} r={420} kind="cool" o={0.5} />
      <Smartphone x={960} y={640} s={0.7} rot={-6} mode="home" t={t} buzz={t % 60 < 12 ? 1 : 0} />
    </g>
    <text x={960} y={190} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 8)}>WHAT WILL YOU SEE WHEN YOU SLEEP?</text>
    <g transform={`translate(960 360) scale(${backOut(clamp((t - 8) / 10))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={200} fill="#C87ED8" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">PART 2</text>
    </g>
    <g transform={`translate(960 960) scale(${backOut(clamp((t - rel('Would you take', 'subscribe')) / 10))})`}>
      <rect x={-230} y={-56} width={460} height={112} rx={20} fill="#E8302A" />
      <text y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#FFFFFF">SUBSCRIBE</text>
    </g>
  </g>
);
