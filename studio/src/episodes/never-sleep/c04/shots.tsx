import React from 'react';
import { Hero, Classroom, SchoolDesk, factCard } from '../../../engine';
import {
  YOU, MO, TEACHER, Soft, Body, Kitchen, KITCHEN, KitchenIsland, stand, Schematic, SCH, SchLabel, ShopStreet, standAt, GROUND, PopWord, Big,
  faceCU, bigWord, hourCard, Book, Brain, Cells, FridgeFace, Bubble, Wobble, handAt, Glow, basePose, camT, clamp, kf, backOut, easeOut, easeInOut,
  idleBlink, FONT, UI, rnd, phrase, ShotProps, Pose, Word, schShot,
} from '../common';
import words from './words.json';

// Chapter 4, the catch: hour 19 (which house is yours?), 0.05% like alcohol; hour 24 0.10%, a sandwich in maths;
// microsleeps (eyes open, nobody home; drivers drifting); blink: the lesson's over; the brain wash (+60% between cells
// in sleeping mice); no wash: beta-amyloid +5%; memory -40%; hour 48: hunger hormones, four lunches, Mo's crisps;
// day three: the fridge says good morning.

const W = words as Word[];
const ST: React.FC<{ t: number; id?: string }> = ({ t, id }) => <ShopStreet t={t} id={id} />;
const CL: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Classroom t={t} id={id} />;
const rel = (a: string, b: string) => Math.max(0, Math.round((phrase(W, b)[0] - phrase(W, a)[0]) * 30));

export const S1 = hourCard({ big: 'HOUR 19', kicker: 'WALKING TO SCHOOL', Bg: ST });

// ---------------------------------------------------------------- S2: which house is yours?
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const look = Math.sin(t / 8);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 620, 1.4)}>
      <Wobble id="c4s2" t={t} amp={0.25}>
        <ShopStreet t={t + 100} />
      </Wobble>
      <Body look={YOU} pose={standAt(960, 1, GROUND, { yaw: look * 0.8, headTilt: look * 8, armL: { a: 30, b: -30 }, armR: { a: 60, b: -100 } })} t={t} faces={[[0, 'worried']]} seed={2} shadow={1} />
      {[0, 1, 2].map((i) => <PopWord key={i} t={t} at={10 + i * 8} x={620 + i * 330} y={300 + (i % 2) * 60} text="?" size={110} fill="#FFD23A" hold={300} rot={-8 + i * 8} />)}
    </g>
  );
};

// ---------------------------------------------------------------- S3: 17-19 hours awake = 0.05% blood alcohol
export const S3 = factCard({ value: 0.05, format: (v) => `${v.toFixed(2)}%`, label: 'AFTER 17-19 HOURS AWAKE, LIKE A BLOOD ALCOHOL OF', sub: 'over the driving limit in many countries' });

export const S3B = schShot({
  title: 'IN MANY COUNTRIES',
  draw: (t) => (
    <g>
      <g transform="translate(960 540)" fill="none" stroke="#FFD23A" strokeWidth={10} strokeLinecap="round">
        <circle cx={-120} cy={0} r={80} />
        <path d="M -40 0 L 200 0 M 140 0 L 140 50 M 190 0 L 190 40" />
      </g>
      <g opacity={clamp((t - 10) / 6)}>
        <path d="M 700 300 L 1220 780 M 1220 300 L 700 780" stroke="#FF5A4A" strokeWidth={18} strokeLinecap="round" />
      </g>
      <SchLabel x={960} y={900} t={t - 14} text="TOO DRUNK TO DRIVE" size={48} color="#FF5A4A" />
    </g>
  ),
});

export const S4 = hourCard({ big: 'HOUR 24', kicker: 'IT GETS WORSE', Bg: CL, color: '#FF7A6A' });
export const S5 = bigWord({ kicker: 'LIKE A BLOOD ALCOHOL OF', word: '0.10%', Bg: CL, color: '#FF7A6A' });

// ---------------------------------------------------------------- S6: completely sober, holding a sandwich in maths
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 1260, y: 700, scale: 0.9, yaw: -0.35, tilt: Math.sin(t / 10) * 6, headTilt: Math.sin(t / 8) * 10, armL: { a: 60, b: -80 }, armR: { a: 14, b: -10 } };
  const h = handAt(me, 'L');
  return (
    <g transform={camT(1200, 560, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <CL t={t + 300} />
      <Hero look={YOU} pose={{ ...me, expr: 'dizzy', blink: 0 }} shadow={0} />
      <g transform={`translate(${h.x} ${h.y - 10}) rotate(-10)`}>
        <path d="M -60 0 Q 0 -40 60 0 L 60 20 L -60 20 Z" fill="#E0B060" stroke="#14121C" strokeWidth={4} />
        <rect x={-62} y={6} width={124} height={10} fill="#6AB04A" />
        <rect x={-60} y={16} width={120} height={16} rx={4} fill="#E0B060" stroke="#14121C" strokeWidth={4} />
      </g>
      <SchoolDesk x={1260} />
    </g>
  );
};

// ---------------------------------------------------------------- S7: microsleep: eyes open, nobody home (picture blinks off)
export const S7: React.FC<ShotProps> = ({ t, len, f }) => {
  const b0 = rel('And then it starts', 'switches off');
  const off = t > b0 && t < b0 + 45 ? 1 : 0;
  return (
    <g>
      {faceCU({ look: YOU, Bg: CL, faces: [[0, 'neutral']], yaw: 0, eyes: 0, zoom: [3.2, 3.6], pose: { glint: 0 } })({ t, len, f })}
      {off ? (
        <g>
          <rect width={1920} height={1080} fill="#000" opacity={0.92} />
          <text x={960} y={560} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} letterSpacing={12} fill="#5A5A6A">MICROSLEEP</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------- S8: drivers drift out of their lane
export const S8 = schShot({
  title: 'EYES OPEN. NOBODY DRIVING.',
  draw: (t, len) => {
    const k = clamp((t - 20) / 40);
    const x = 960 + 260 * easeInOut(k);
    return (
      <g>
        {[560, 960, 1360].map((lx, i) => (
          <path key={i} d={`M ${lx} 200 L ${lx} 900`} stroke={SCH.line} strokeWidth={6} strokeDasharray={i === 1 ? '40 30' : undefined} opacity={0.8} />
        ))}
        <g transform={`translate(${x - 200} ${780 - t * 3}) rotate(${18 * Math.sin(k * Math.PI)})`}>
          <rect x={-60} y={-100} width={120} height={200} rx={30} fill="none" stroke="#FFD23A" strokeWidth={8} />
          <rect x={-40} y={-60} width={80} height={50} rx={10} fill="none" stroke="#FFD23A" strokeWidth={5} />
        </g>
      </g>
    );
  },
});

// ---------------------------------------------------------------- S9: you blink, and the lesson jumps; blink again, it's over
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const b1 = rel('You blink and', 'teacher is on') + 4;
  const b2 = rel('You blink and', 'You blink again') + 8;
  const step = t < b1 ? 0 : t < b2 ? 1 : 2;
  const flash = (t > b1 - 4 && t < b1) || (t > b2 - 4 && t < b2);
  return (
    <g>
      <g transform={camT(800, 470, 1.4)}>
        <Classroom t={step * 900 + t} board={step === 0 ? <text x={740} y={360} textAnchor="middle" fontFamily={FONT.hand} fontSize={80} fill="#F6EFE3">p. 12</text> : step === 1 ? <text x={740} y={360} textAnchor="middle" fontFamily={FONT.hand} fontSize={80} fill="#F6EFE3">p. 47 ?!</text> : <text x={740} y={360} textAnchor="middle" fontFamily={FONT.hand} fontSize={70} fill="#F6EFE3">HOMEWORK: ...</text>} />
        {step < 2 ? <Body look={TEACHER} pose={standAt(step ? 1100 : 560, 0.95, 820, { yaw: step ? -0.5 : 0.4, armR: { a: 120, b: -10 } })} t={t} faces={[[0, 'neutral']]} seed={7} shadow={1} /> : null}
      </g>
      {flash ? <rect width={1920} height={1080} fill="#000" /> : null}
      <PopWord t={t} at={b2 + 6} x={960} y={200} text="LESSON OVER" size={80} fill="#FF7A6A" hold={300} />
    </g>
  );
};

// ---------------------------------------------------------------- S10: while you sleep, the brain washes itself
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="c4s10" />
    <Brain x={960} y={560} s={1.35} t={t} wash={clamp((t - 10) / 20)} dirt={1} />
    <SchLabel x={960} y={150} t={t - 2} text="WHILE YOU SLEEP: THE BRAIN WASH" size={44} color="#4AC8F0" />
  </g>
);

// ---------------------------------------------------------------- S11: in sleeping mice, the gaps between cells open ~60%
export const S11 = schShot({
  title: 'SLEEPING MICE: SPACE BETWEEN BRAIN CELLS',
  real: 70,
  draw: (t) => {
    const k = easeInOut(clamp((t - 10) / 30));
    return (
      <g>
        <Cells x={960} y={540} t={t} open={k} flow={k} />
        <g transform={`translate(960 900) scale(${backOut(clamp((t - 40) / 9))})`}>
          <Big x={0} y={30} size={110} fill="#4AC8F0">+60%</Big>
        </g>
      </g>
    );
  },
});

// ---------------------------------------------------------------- S12: no wash: beta-amyloid +5% after one night
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="c4s12" />
    <Brain x={760} y={560} s={1.2} t={t} dirt={clamp(t / 20) * 1.4} />
    <SchLabel x={1440} y={400} t={t - 6} text="BETA-AMYLOID" size={44} color="#F2A03A" />
    <SchLabel x={1440} y={460} t={t - 10} text="(LINKED TO ALZHEIMER'S)" size={30} color={SCH.dim} />
    <g transform={`translate(1440 620) scale(${backOut(clamp((t - 30) / 9))})`}>
      <Big x={0} y={40} size={150} fill="#F2A03A">+5%</Big>
    </g>
    <SchLabel x={1440} y={760} t={t - 40} text="AFTER ONE NIGHT AWAKE" size={32} />
  </g>
);

// ---------------------------------------------------------------- S13: memory: -40%
export const S13 = factCard({ value: 40, format: (v) => `-${Math.round(v)}%`, label: 'AFTER ONE SLEEPLESS NIGHT: STORING NEW MEMORIES', sub: 'Yoo et al., Nature Neuroscience, 2007' });

// ---------------------------------------------------------------- S14: three chapters last night; today the pages are blank
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const fade = clamp((t - 20) / 30);
  return (
    <g>
      {faceCU({ look: YOU, Bg: CL, faces: [[0, 'neutral'], [30, 'worried']], yaw: 0.1, zoom: [2.6, 2.8] })({ t, len, f: 0 })}
      <g transform={`translate(960 900) scale(1.8)`}>
        <path d="M -110 -60 L 0 -46 L 110 -60 L 110 40 L 0 54 L -110 40 Z" fill="#4A7AA0" stroke="#14121C" strokeWidth={4} />
        <path d="M -100 -52 L 0 -40 L 100 -52 L 100 32 L 0 44 L -100 32 Z" fill="#F6EFE3" />
        {Array.from({ length: 5 }).map((_, i) => (
          <g key={i} opacity={1 - fade}>
            <path d={`M -88 ${-34 + i * 14} L -14 ${-26 + i * 14}`} stroke="#9A948A" strokeWidth={3} />
            <path d={`M 14 ${-26 + i * 14} L 88 ${-34 + i * 14}`} stroke="#9A948A" strokeWidth={3} />
          </g>
        ))}
      </g>
      <PopWord t={t} at={40} x={1400} y={300} text="???" size={90} fill="#FFD23A" hold={300} />
    </g>
  );
};

export const S15 = hourCard({ big: 'HOUR 48', kicker: 'YOUR STOMACH IS ROARING', Bg: ST, color: '#FF7A6A' });

// ---------------------------------------------------------------- S16: hunger hormone up, fullness hormone down
export const S16 = schShot({
  title: 'LOSING SLEEP',
  real: 60,
  draw: (t) => {
    const k = easeOut(clamp((t - 8) / 30));
    const bar = (x: number, p: number, c: string, label: string, arrow: string) => (
      <g transform={`translate(${x} 0)`}>
        <rect x={-80} y={300} width={160} height={460} rx={14} fill="none" stroke={SCH.line} strokeWidth={6} />
        <rect x={-70} y={750 - 440 * p} width={140} height={440 * p} rx={10} fill={c} />
        <text x={0} y={830} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={SCH.line}>{label}</text>
        <text x={140} y={540} fontFamily={FONT.title} fontWeight={800} fontSize={100} fill={c}>{arrow}</text>
      </g>
    );
    return (
      <g>
        {bar(620, 0.45 + 0.4 * k, '#FF7A4A', 'HUNGRY', '↑')}
        {bar(1180, 0.7 - 0.4 * k, '#4AC8F0', 'FULL', '↓')}
      </g>
    );
  },
});

// ---------------------------------------------------------------- S17: four lunches; Mo stops sharing his crisps
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const a = standAt(800, 1, GROUND, { yaw: 0.4, armL: { a: 60 + 20 * Math.sin(t / 2), b: -110 }, armR: { a: 40, b: -60 } });
  const hide = clamp((t - (len - 40)) / 10);
  const m = standAt(1150, 1, GROUND, { yaw: -0.4 + 0.9 * hide, armL: { a: 60, b: -70 }, armR: { a: 40, b: -40 } });
  const hm = handAt(m, 'L');
  return (
    <g transform={camT(960, 640, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <ShopStreet t={t + 500} />
      {[0, 1, 2].map((i) => <rect key={i} x={560 + i * 30} y={GROUND - 20 - i * 6} width={90} height={20} rx={6} fill="#C8A06A" stroke="#14121C" strokeWidth={3} />)}
      <Body look={YOU} pose={a} t={t} faces={[[0, 'happy']]} seed={2} shadow={1} />
      <Body look={MO} pose={m} t={t} faces={[[0, 'neutral'], [Math.max(1, len - 40), 'worried']]} seed={5} shadow={1} />
      <g transform={`translate(${hm.x} ${hm.y - 30})`}>
        <path d="M -40 -50 L 40 -50 L 34 50 L -34 50 Z" fill="#E8453A" stroke="#14121C" strokeWidth={4} />
        <text x={0} y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={22} fill="#FFD23A">CRISPS</text>
      </g>
      <PopWord t={t} at={6} x={700} y={420} text="LUNCH #4" size={64} fill="#FFD23A" hold={300} />
    </g>
  );
};

// ---------------------------------------------------------------- S18: morning of day three: you walk into the kitchen
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 600], [len, 900]]);
  return (
    <g transform={camT(1000, 600, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Kitchen t={t + 700} />
      <Body look={YOU} pose={standAt(x, 1.05, 990, { yaw: 0.6, legL: { a: Math.sin(t / 3) * 20, b: 0 }, legR: { a: -Math.sin(t / 3) * 20, b: 0 } })} t={t} faces={[[0, 'tired']]} seed={2} shadow={1} />
      <PopWord t={t} at={4} x={960} y={330} text="DAY 3" size={90} fill="#FF7A6A" hold={300} />
    </g>
  );
};

// ---------------------------------------------------------------- S19: the fridge says good morning
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const c = KITCHEN.P(0.885, 0.45, 0.2);
  return (
    <g transform={camT(c.x - 60, c.y, kf(t, [[0, 2.6], [len, 2.8]]))}>
      <Kitchen t={t + 800} />
      <FridgeFace t={t} talk={t > 6 && t < 40 ? 1 : 0} />
      <Bubble x={c.x - 360} y={c.y - 40} text={'GOOD\nMORNING!'} t={t} at={6} size={44} tail="r" />
    </g>
  );
};
