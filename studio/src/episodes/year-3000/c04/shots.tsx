import React from 'react';
import { factCard, Schematic, SchLabel, SCH, CountUp } from '../../../engine';
import {
  PodRoom, FutureCity, Museum, GlassCase, Vee, Citizen, Body, Big, PopWord, Soft, Holo, Glyphs,
  scene, veeCU, bigWord, standAt, handAt, faceCU, YOU, MO7, ARCH, F1, F2, F3, KID, CLERK, GROUND,
  camT, kf, clamp, backOut, easeOut, basePose, idleBlink, FONT, Glow, Hero, shk, rnd, ShotProps, Word, Pose,
} from '../common';
import words from './words.json';

// Chapter 4, the catch: a "harmless" cold floors you (viruses keep changing: a new flu vaccine every year; your
// immune system only knows 2026; after 1492 about nine in ten people died in many places of the Americas); Vee's
// shot fixes you and costs nearly everything. The day is only 17 thousandths of a second longer. Without the earpiece
// nobody understands you (Beowulf, a thousand years old, starts "Hwaet"). Work: every job is done by machines (farm
// workers 41% in 1900, 1.9% in 2000). Your skills are a horse and cart. Someone starts paying attention.

const W = words as Word[];
const ROOM: React.FC<{ t: number; id?: string }> = ({ t, id }) => <PodRoom t={t} id={id} />;
const NIGHT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <PodRoom t={t} id={id} mode="night" />;
const CITY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <FutureCity t={t} id={id} />;
const MUS: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Museum t={t} id={id} />;

/** A low white bed, side view; the sleeper lies with the head on the left. */
const Bed: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-320} y={-110} width={640} height={90} rx={30} fill="#F2F6F8" stroke="#0B0816" strokeWidth={7} />
    <rect x={-300} y={-20} width={20} height={20} fill="#9AA8B4" />
    <rect x={280} y={-20} width={20} height={20} fill="#9AA8B4" />
  </g>
);
const Blanket: React.FC<{ x: number; y: number; s?: number; t: number; shiver?: number }> = ({ x, y, s = 1, t, shiver = 0 }) => (
  <g transform={`translate(${x + Math.sin(t * 1.7) * 3 * shiver} ${y}) scale(${s})`}>
    <path d="M -180 -100 Q -100 -170 60 -150 Q 240 -150 300 -110 L 300 -60 L -180 -60 Z" fill="#8AB0E0" stroke="#0B0816" strokeWidth={7} />
  </g>
);
const lying = (x: number, y: number, s = 1, extra: Partial<Pose> = {}): Pose => ({ ...basePose, x, y, scale: s, spin: -90, yaw: 0.2, ...extra });

// ---------------------------------------------------------------- S1: at first, it's just a sneeze
export const S1 = scene({
  Set: ROOM, words: W, cam: [960, 580, 1.6], cam1: [960, 580, 1.7],
  cast: [{ look: YOU, x: 900, yaw: 0.3, faces: [[0, 'oops'], [16, 'worried']], pose: (t) => ({ tilt: t < 10 ? 12 : 0 }) }],
  over: (t) => <PopWord t={t} at={2} x={1300} y={320} text="achoo" size={70} fill="#7FE07A" hold={30} rot={-4} />,
});

// ---------------------------------------------------------------- S2: then a fever
export const S2 = faceCU({
  look: YOU, Bg: ROOM, faces: [[0, 'tired']], yaw: 0.2, zoom: [3.1, 3.4], light: { x: 960, y: 520, kind: 'red', o: 0.7 },
  extra: (t) => (
    <g>
      {[0, 1, 2].map((i) => <path key={i} d={`M ${900 + i * 50} ${470 + ((t * 1.5 + i * 15) % 40)} q 6 10 0 18 q -6 -8 0 -18`} fill="#8AE0FF" stroke="#0B0816" strokeWidth={2} />)}
      <g transform="translate(1060 600) rotate(-30)">
        <rect x={-8} y={-60} width={16} height={90} rx={8} fill="#F2F6F8" stroke="#0B0816" strokeWidth={4} />
        <rect x={-4} y={-20 - clamp(t / 30) * 30} width={8} height={50 + clamp(t / 30) * 30} rx={4} fill="#E8453A" />
      </g>
    </g>
  ),
});

// ---------------------------------------------------------------- S3: by night you can't get out of bed
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.2], [len, 1.35]]))}>
    <NIGHT t={t + 40} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0E24" opacity={0.45} />
    <Bed x={960} y={GROUND} />
    <Body look={YOU} pose={lying(840, GROUND - 75, 1, { armR: { a: 40, b: -20 } })} t={t} faces={[[0, 'tired']]} />
    <Blanket x={960} y={GROUND} t={t} shiver={1} />
    <Glow x={960} y={300} r={500} kind="cool" o={0.3} />
  </g>
);

// ---------------------------------------------------------------- S4: Vee scans you
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 600, kf(t, [[0, 1.4], [len, 1.5]]))}>
    <NIGHT t={t + 80} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0E24" opacity={0.4} />
    <Bed x={960} y={GROUND} />
    <Body look={YOU} pose={lying(840, GROUND - 75, 1)} t={t} faces={[[0, 'tired']]} />
    <Blanket x={960} y={GROUND} t={t} shiver={1} />
    <Vee x={kf(t, [[0, 700], [len, 1200]])} y={380} s={0.8} t={t} mood="scan" look={0} />
    <path d={`M ${kf(t, [[0, 700], [len, 1200]])} 420 L ${kf(t, [[0, 700], [len, 1200]]) - 140} ${GROUND - 120} L ${kf(t, [[0, 700], [len, 1200]]) + 140} ${GROUND - 120} Z`} fill="#4AE8FF" opacity={0.2} />
  </g>
);

export const S5 = veeCU({ Bg: NIGHT, mood: 'open', words: W, talk: ['This', 'nothing'], zoom: [2.5, 2.7] });

// ---------------------------------------------------------------- S6: viruses never stop changing
const Virus: React.FC<{ x: number; y: number; r: number; t: number; c: string; spikes?: number }> = ({ x, y, r, t, c, spikes = 10 }) => (
  <g transform={`translate(${x} ${y}) rotate(${t * 2})`}>
    {Array.from({ length: spikes }).map((_, i) => {
      const a = (i / spikes) * Math.PI * 2;
      return <g key={i}><path d={`M ${Math.cos(a) * r} ${Math.sin(a) * r} L ${Math.cos(a) * r * 1.4} ${Math.sin(a) * r * 1.4}`} stroke={c} strokeWidth={r * 0.12} /><circle cx={Math.cos(a) * r * 1.45} cy={Math.sin(a) * r * 1.45} r={r * 0.14} fill={c} /></g>;
    })}
    <circle r={r} fill={c} fillOpacity={0.35} stroke={c} strokeWidth={r * 0.1} />
  </g>
);
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="vir" />
    {[0, 1, 2, 3, 4].map((i) => {
      const on = clamp((t - i * 10) / 8);
      return (
        <g key={i} opacity={on} transform={`translate(0 ${(1 - on) * 30})`}>
          <Virus x={360 + i * 300} y={560} r={60} t={t} c={['#4AE8FF', '#5BE08A', '#FFD23A', '#FF8A3D', '#FF5A4A'][i]} spikes={8 + i * 2} />
          {i < 4 ? <path d={`M ${450 + i * 300} 560 l 100 0 m -20 -14 l 20 14 l -20 14`} stroke={SCH.dim} strokeWidth={4} fill="none" opacity={on} /> : null}
        </g>
      );
    })}
    <SchLabel x={960} y={260} t={t - 4} text="EVERY YEAR, A LITTLE DIFFERENT" size={44} />
  </g>
);

export const S7 = factCard({ value: 1, suffix: ' PER YEAR', label: 'A NEW FLU VACCINE', sub: 'because the virus keeps changing' });

// ---------------------------------------------------------------- S8: your 2026 shield vs a thousand years of new germs
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="shd" />
    <g transform="translate(560 560)">
      <path d="M 0 -200 L 160 -140 Q 160 80 0 200 Q -160 80 -160 -140 Z" fill="#4AE8FF" fillOpacity={0.15} stroke="#4AE8FF" strokeWidth={8} />
      <text x={0} y={20} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} fill="#FF8A3D">2026</text>
    </g>
    {Array.from({ length: 24 }).map((_, i) => {
      const on = clamp((t - i * 2) / 10);
      const x = 1000 + rnd(51, i) * 800 - on * 80 * Math.sin(t / 10 + i);
      const y = 200 + rnd(52, i) * 700;
      return <g key={i} opacity={on}><Virus x={x} y={y} r={18 + rnd(53, i) * 22} t={t + i * 20} c={['#FF5A4A', '#FFD23A', '#5BE08A', '#FF8A3D'][i % 4]} spikes={8 + (i % 5)} /></g>;
    })}
    <SchLabel x={1400} y={130} t={t - 20} text="974 YEARS OF NEW GERMS" size={40} color="#FF5A4A" />
  </g>
);

export const S9 = factCard({ value: 90, suffix: '%', label: 'AMERICAS, AFTER 1492: POPULATION LOST', sub: 'within about a century, mostly to new diseases' });

// ---------------------------------------------------------------- S10: Vee's shot fixes you (and costs almost everything)
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const up = clamp((t - 40) / 20);
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <ROOM t={t + 120} />
      <Bed x={960} y={GROUND} />
      {up < 1 ? <Body look={YOU} pose={lying(840, GROUND - 75, 1)} t={t} faces={[[0, 'tired'], [30, 'neutral']]} /> : <Body look={YOU} pose={standAt(800, 1, GROUND, { yaw: 0.4, armL: { a: 150, b: -20 }, armR: { a: 150, b: -20 } })} t={t} faces={[[0, 'happy']]} />}
      {up < 1 ? <Blanket x={960} y={GROUND} t={t} /> : null}
      <Vee x={1180} y={420} s={0.8} t={t} mood="happy" look={-0.6} />
      <g transform={`translate(${kf(t, [[4, 1100], [18, 900]], easeOut)} ${kf(t, [[4, 480], [18, 640]], easeOut)}) rotate(-40)`}>
        <rect x={-10} y={-60} width={20} height={80} rx={6} fill="#F2F6F8" stroke="#0B0816" strokeWidth={4} />
        <rect x={-6} y={-40} width={12} height={40} fill="#4AE8FF" />
        <path d="M 0 20 L 0 44" stroke="#0B0816" strokeWidth={3} />
      </g>
      <PopWord t={t} at={50} x={1200} y={250} text="- 45,900" size={90} fill="#FF5A4A" hold={len} />
    </g>
  );
};

// ---------------------------------------------------------------- S11: Earth's spin is slowing down
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="earth" />
    <g transform="translate(960 560)">
      <circle r={240} fill="#1E4A7A" stroke="#4AE8FF" strokeWidth={6} />
      <g transform={`rotate(${t * 1.2})`}>
        <clipPath id="earthC"><circle r={240} /></clipPath>
        <g clipPath="url(#earthC)">
          <path d="M -160 -100 q 60 -60 120 -10 q 40 50 -20 90 q -80 30 -100 -80 Z" fill="#5AA06A" />
          <path d="M 60 40 q 80 -40 120 20 q 10 80 -60 100 q -60 -30 -60 -120 Z" fill="#5AA06A" />
        </g>
      </g>
      <path d="M -300 -40 A 300 80 0 0 0 300 -40" stroke="#FFD23A" strokeWidth={6} fill="none" />
      <path d="M 300 -40 l -24 -4 m 24 4 l -10 22" stroke="#FFD23A" strokeWidth={6} fill="none" />
    </g>
    <SchLabel x={960} y={200} t={t - 4} text="+0.002 s LONGER EVERY CENTURY" size={44} />
  </g>
);

export const S12 = factCard({ value: 17, suffix: ' ms', label: 'HOW MUCH LONGER YOUR DAY IS AFTER 974 YEARS', sub: 'seventeen thousandths of a second' });

// ---------------------------------------------------------------- S13: without the earpiece, nobody understands you
export const S13 = scene({
  Set: CITY, words: W, cam: [960, 580, 1.45], cam1: [960, 580, 1.55],
  cast: [
    { look: YOU, x: 720, yaw: 0.5, faces: [[0, 'happy'], [40, 'worried']], pose: (t) => ({ armR: { a: 70 + Math.sin(t / 4) * 15, b: -40 }, talk: Math.abs(Math.sin(t / 2.3)) * 0.6 }) },
    { look: F1, x: 1080, yaw: -0.5, faces: [[0, 'neutral'], [20, 'oops']] },
    { look: F2, x: 1320, yaw: -0.5, faces: [[0, 'neutral'], [26, 'oops']] },
  ],
  over: (t) => (
    <g>
      <g opacity={clamp((t - 4) / 4)}>
        <rect x={340} y={180} width={500} height={110} rx={50} fill="#FFFFFF" stroke="#0B0816" strokeWidth={6} />
        <text x={590} y={250} textAnchor="middle" fontFamily={FONT.hand} fontSize={44} fill="#1A1A22">Hi! I need a job!</text>
      </g>
      <g opacity={clamp((t - 30) / 4)}>
        <rect x={1100} y={180} width={480} height={110} rx={50} fill="#14202C" stroke="#4AE8FF" strokeWidth={5} />
        <Glyphs x={1340} y={250} n={9} seed={7} size={40} anchor="middle" />
        <text x={1340} y={330} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFD23A">???</text>
      </g>
    </g>
  ),
});

// ---------------------------------------------------------------- S14: Beowulf: HWAET
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A1E14" />
    <Glow x={960} y={540} r={800} kind="warm" o={0.5} />
    <g transform={`translate(960 560) scale(${kf(t, [[0, 1.0], [len, 1.08]])}) rotate(-2)`}>
      <rect x={-460} y={-420} width={920} height={840} rx={10} fill="#E8D8B0" stroke="#0B0816" strokeWidth={8} />
      <text x={-380} y={-250} fontFamily="serif" fontWeight={700} fontSize={130} fill="#8A2A1A">HWÆT</text>
      {Array.from({ length: 9 }).map((_, i) => (
        <text key={i} x={-380} y={-120 + i * 58} fontFamily="serif" fontStyle="italic" fontSize={40} fill="#3A2A1A" opacity={0.85}>
          {['we gardena in geardagum', 'þeodcyninga þrym gefrunon', 'hu ða æþelingas ellen fremedon', 'oft scyld scefing sceaþena þreatum', 'monegum mægþum meodosetla ofteah', 'egsode eorlas syððan ærest wearð', 'feasceaft funden he þæs frofre gebad', 'weox under wolcnum weorðmyndum þah', 'oð þæt him æghwylc þara ymbsittendra'][i]}
        </text>
      ))}
    </g>
    <g opacity={clamp((t - 30) / 6)} transform="translate(1560 180)">
      <rect x={-240} y={-50} width={480} height={90} rx={45} fill="#0B0816" opacity={0.9} />
      <text x={0} y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#FFD23A">ENGLISH, ~1000 YEARS AGO</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- S15: you sound just as strange
export const S15 = faceCU({
  look: YOU, Bg: CITY, faces: [[0, 'neutral'], [12, 'oops']], yaw: 0.3, zoom: [2.8, 3.0],
  front: (t) => (
    <g opacity={clamp((t - 6) / 6)}>
      <rect x={1180} y={200} width={560} height={130} rx={60} fill="#FFFFFF" stroke="#0B0816" strokeWidth={6} />
      <text x={1460} y={285} textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize={60} fill="#8A2A1A">{t > 24 ? 'hwæt?' : 'hello?'}</text>
    </g>
  ),
});

export const S16 = bigWord({ kicker: 'THE WORST ONE', word: 'WORK', Bg: CITY, size: 260, color: '#FF5A4A' });

// ---------------------------------------------------------------- S17: the tours are getting old
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.1], [len, 1.2]]))}>
    <MUS t={t + 700} />
    <Body look={YOU} pose={standAt(640, 1.05, GROUND, { yaw: 0.5, armR: { a: 100 - Math.sin(t / 8) * 10, b: -20 } })} t={t} faces={[[0, 'happy'], [30, 'worried']]} />
    <Citizen look={KID} pose={standAt(1300, 0.7, GROUND + 40, { yaw: -0.4, headTilt: 12 })} t={t} faces={[[0, 'tired']]} />
    <PopWord t={t} at={40} x={1360} y={420} text="yawn" size={60} fill="#FFFFFF" hold={len} rot={4} />
  </g>
);

// ---------------------------------------------------------------- S18: every job you know is done by machines
const Bot: React.FC<{ x: number; y: number; s?: number; t: number; c?: string; job?: 'mop' | 'tray' | 'box' }> = ({ x, y, s = 1, t, c = '#F2F6F8', job = 'tray' }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 8 + x) * 4}) scale(${s})`}>
    <rect x={-50} y={-200} width={100} height={150} rx={30} fill={c} stroke="#0B0816" strokeWidth={6} />
    <rect x={-36} y={-176} width={72} height={34} rx={17} fill="#14202C" />
    <circle cx={0} cy={-159} r={8} fill="#4AE8FF" />
    <rect x={-30} y={-50} width={60} height={30} rx={6} fill="#9AA8B4" stroke="#0B0816" strokeWidth={5} />
    <ellipse cx={0} cy={-8} rx={40} ry={10} fill="#4AE8FF" opacity={0.5} />
    {job === 'mop' ? <path d={`M 50 -120 L ${90 + Math.sin(t / 3) * 20} 0`} stroke="#8A6A4A" strokeWidth={8} /> : null}
    {job === 'tray' ? <rect x={40} y={-130} width={80} height={10} rx={4} fill="#C8CED6" stroke="#0B0816" strokeWidth={4} /> : null}
    {job === 'box' ? <rect x={-50} y={-270} width={100} height={70} fill="#C89A6A" stroke="#0B0816" strokeWidth={5} /> : null}
  </g>
);
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 580, kf(t, [[0, 1.1], [len, 1.2]]))}>
    <FutureCity t={t + 760} />
    <Bot x={420 + t * 1.5} y={GROUND} t={t} job="mop" />
    <Bot x={1000} y={GROUND} t={t} job="tray" c="#FFD23A" />
    <Bot x={1500 - t * 1.2} y={GROUND} t={t} job="box" c="#7AE8D0" />
    <Body look={YOU} pose={standAt(720, 1, GROUND, { yaw: 0.4, armR: { a: 40, b: -20 } })} t={t} faces={[[0, 'worried']]} />
    <g opacity={clamp((t - 14) / 6)}>
      <rect x={760} y={170} width={400} height={90} rx={45} fill="#0B0816" opacity={0.85} />
      <text x={960} y={230} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#FF5A4A">JOBS OPEN: 0</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- S19: farm workers: 41% in 1900, 1.9% in 2000
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const a = clamp((t - 30) / 30);
  const b = clamp((t - 80) / 30);
  return (
    <g>
      <Schematic t={t} id="farm" />
      <SchLabel x={960} y={170} t={t - 2} text="US WORKERS ON FARMS" size={46} />
      <g transform="translate(700 880)">
        <rect x={-100} y={-560 * 0.41 * 2 * a} width={200} height={560 * 0.41 * 2 * a} fill="#FFD23A" />
        <text x={0} y={60} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={SCH.dim}>1900</text>
        <text x={0} y={-470 * a - 30} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} fill="#FFD23A" opacity={a}>41%</text>
      </g>
      <g transform="translate(1220 880)">
        <rect x={-100} y={-560 * 0.019 * 2 * b} width={200} height={560 * 0.019 * 2 * b} fill="#FF5A4A" />
        <text x={0} y={60} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={SCH.dim}>2000</text>
        <text x={0} y={-60} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} fill="#FF5A4A" opacity={b}>1.9%</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S20: your skills: a horse and cart in a glass case
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.5], [len, 1.6]]))}>
    <Museum t={t + 800} cases={false} />
    <g transform={`translate(960 ${GROUND - 30}) scale(2.4)`}>
      <GlassCase x={0} y={0} s={1} label="YOUR SKILLS · 2026">
        <g transform="translate(0 0)">
          <rect x={-30} y={-26} width={50} height={26} fill="#8A5A3A" stroke="#0B0816" strokeWidth={3} />
          <circle cx={-18} cy={6} r={12} fill="none" stroke="#0B0816" strokeWidth={4} />
          <circle cx={10} cy={6} r={12} fill="none" stroke="#0B0816" strokeWidth={4} />
          <path d="M 22 -16 L 40 -16 L 50 -40 L 60 -40 L 56 -20 L 50 -16 L 50 10 M 32 -16 L 32 10" stroke="#5A3A20" strokeWidth={5} fill="none" strokeLinecap="round" />
        </g>
      </GlassCase>
    </g>
    <PopWord t={t} at={36} x={1340} y={300} text="USELESS" size={80} fill="#FF5A4A" hold={len} rot={6} />
  </g>
);

// ---------------------------------------------------------------- S21: someone starts paying attention
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#06080F" />
    <Glow x={960} y={560} r={500} kind="cool" o={0.35} />
    <g transform={camT(960, 520, kf(t, [[0, 3.6], [len, 4.0]]))}>
      <Citizen look={ARCH} pose={{ ...basePose, x: 960, y: 720, yaw: -0.3, look: 0.5 }} t={t} faces={[[0, 'neutral'], [24, 'smug']]} />
    </g>
    <rect width={1920} height={1080} fill="#06080F" opacity={0.35} />
    <g transform="translate(400 540)" opacity={0.7}>
      <Holo x={0} y={0} w={420} h={300} t={t}>
        <g transform="scale(0.9) translate(-960 -660)">
          <Hero look={YOU} pose={{ ...basePose, x: 960, y: 760, yaw: 0.2, expr: 'worried' }} shadow={0} />
        </g>
      </Holo>
    </g>
  </g>
);
