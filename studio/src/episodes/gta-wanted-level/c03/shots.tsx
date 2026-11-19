import React from 'react';
import { ShotProps, camT, kf, clamp, backOut, Bicycle, PoliceCar, BusShelter, PostSign, Wrapper, Skateboard, Notebook, WantedStars, FONT, WANT, TOWN, LOT, LAUND, SUBURB, rnd } from '../../../engine';
import words from './words.json';
import { YOU, MO, DALE, COP, DOGLADY, LADY1, LADY2, TownSet, LotSet, LaundSet, HomeSet, scene, faceCU, starsCU, bigWord, insert, walk, run, cueAt, starCard, plant, span, Who } from '../common';

// Chapter 3, the fun part: the candy wrapper, one star, the radio; Officer Dale on his bike; you hide behind the bus
// shelter and it fades; Mo saw it; the grass, Dale again like a bus; his moustache and his bell; Mo tries and gets
// nothing; the notebook; two stars means a patrol car; the laundromat; practising; your record; the best thing ever.

const DAY = TownSet('day');
const HOME = HomeSet('dusk');
const rider = (x: number, t: number, dir: 1 | -1 = -1) => ({ x, y: TOWN.feet - 190, scale: 1, yaw: 0.8 * dir, facing: dir, legL: { a: 30 + 30 * Math.sin(t / 4), b: -60 }, legR: { a: -10 - 30 * Math.sin(t / 4), b: -40 }, armR: { a: 70, b: -10 }, armL: { a: 70, b: -10 }, tilt: 6 * dir });
const Bin: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={4} rx={70} ry={10} fill="#000" opacity={0.25} />
    <path d="M -56 -170 L 56 -170 L 46 0 L -46 0 Z" fill="#3A6A4A" stroke="#14151C" strokeWidth={5} />
    <rect x={-64} y={-186} width={128} height={20} rx={6} fill="#2A4A36" stroke="#14151C" strokeWidth={4} />
  </g>
);
const Grass: React.FC = () => (
  <g>
    <rect x={1040} y={TOWN.feet - 6} width={620} height={46} rx={10} fill="#5A9A4A" stroke="#3A6A30" strokeWidth={5} />
    {Array.from({ length: 40 }).map((_, i) => <path key={i} d={`M ${1050 + i * 15} ${TOWN.feet - 4} l 4 -14`} stroke="#3A6A30" strokeWidth={3} />)}
    <PostSign x={1600} y={TOWN.feet + 10} s={0.8} lines={['KEEP OFF', 'THE GRASS']} />
  </g>
);
const Dog: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={4} rx={70} ry={10} fill="#000" opacity={0.25} />
    <ellipse cx={0} cy={-60} rx={70} ry={34} fill="#C8A060" stroke="#14151C" strokeWidth={5} />
    <circle cx={-66} cy={-96} r={30} fill="#C8A060" stroke="#14151C" strokeWidth={5} />
    <ellipse cx={-80} cy={-118} rx={12} ry={22} fill="#8A6A3A" transform="rotate(-20 -80 -118)" />
    <circle cx={-76} cy={-100} r={5} fill="#14151C" />
    {[-40, -14, 20, 46].map((lx) => <rect key={lx} x={lx - 6} y={-36} width={12} height={36} fill="#C8A060" stroke="#14151C" strokeWidth={3} />)}
    <path d={`M 66 -70 q 30 ${-20 + 14 * Math.sin(t / 2)} 40 -40`} stroke="#C8A060" strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);

// ---------- S1: chapter 3 ----------
export const S1 = starCard({ kicker: 'CHAPTER 3', title: 'THE FUN PART', seed: 7, n: 1 });

// ---------- S2: Wednesday: a candy wrapper outside the bakery. One star ----------
export const S2 = scene({
  Set: DAY, setT: 100, cam: { from: [380, 560, 1.7], to: [380, 580, 1.8] }, words,
  cast: (t, f) => [{ look: YOU, pose: { x: 380, y: TOWN.feet - 170, yaw: 0.3, armR: { a: kf(t, [[0, 40], [16, 60], [24, 30]]), b: -30 } }, faces: [[0, 'cool']], stars: [[0, 0], [cueAt(words, f, t, 'One'), 1.25]] }],
  front: (t) => <Wrapper x={kf(t, [[18, 460], [40, 520]])} y={kf(t, [[18, 520], [40, TOWN.feet - 8]], (x) => x * x)} s={0.8} rot={t * 6} />,
});

// ---------- S3: somewhere, a radio crackles ----------
export const S3 = insert({
  bgColor: '#1E2A44', push: 0.1,
  draw: (t) => (
    <g transform="translate(960 560)">
      <rect x={-150} y={-300} width={300} height={560} rx={40} fill="#14151C" stroke="#3A3E4A" strokeWidth={8} />
      <rect x={-40} y={-420} width={40} height={140} rx={10} fill="#14151C" />
      <rect x={-110} y={-230} width={220} height={120} rx={14} fill={Math.floor(t / 5) % 2 ? '#7AE08A' : '#4AA85A'} />
      <text x={0} y={-155} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#0E2A14">CH 4</text>
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-110} y={-60 + i * 30} width={220} height={12} rx={6} fill="#2A2C36" />)}
      {[0, 1, 2].map((k) => <path key={k} d={`M ${200 + k * 50} -200 q 30 ${60} 0 120`} stroke="#F6EFE3" strokeWidth={10} fill="none" opacity={0.3 + 0.7 * ((Math.floor(t / 3) + k) % 3 === 0 ? 1 : 0)} />)}
    </g>
  ),
});

// ---------- S4: ninety seconds later, an officer on a bicycle, looking left, looking right ----------
export const S4 = scene({
  Set: DAY, setT: 300, cam: { from: [1200, 520, 1.4], to: [1150, 540, 1.5] }, words,
  cast: (t) => [{ look: DALE, pose: { ...rider(kf(t, [[0, 2000], [50, 1250]]), t), look: kf(t, [[50, -0.8], [62, 0.8], [80, 0.8], [92, -0.8]]) }, faces: [[0, 'neutral']], tache: true }],
  front: (t) => <Bicycle x={kf(t, [[0, 2000], [50, 1250]]) + 10} y={TOWN.feet + 4} flip roll={1} t={t} />,
});

// ---------- S5: you step behind a bus shelter and count. The star flashes, then it's gone ----------
export const S5 = scene({
  Set: DAY, setT: 400, cam: { from: [700, 560, 1.7], to: [700, 560, 1.8] }, words,
  cast: (t, f) => [{ look: YOU, pose: { x: 930, y: TOWN.feet - 170, yaw: 0.6, look: 0.8, armR: { a: 30, b: -100 } }, faces: [[0, 'worried'], [cueAt(words, f, t, 'gone') + 4, 'smug']], stars: [[0, 1], [cueAt(words, f, t, 'flashes'), 1.5], [cueAt(words, f, t, 'gone'), 0]] }],
  front: () => <BusShelter x={800} y={TOWN.feet + 6} />,
});

// ---------- S6: the officer shrugs and rides away ----------
export const S6 = scene({
  Set: DAY, setT: 500, cam: { from: [1000, 540, 1.3], to: [900, 540, 1.3] }, words,
  cast: (t) => [{ look: DALE, pose: { ...rider(kf(t, [[14, 1200], [70, -200]]), t), armL: { a: kf(t, [[0, 70], [6, 140], [12, 70]]), b: -40 } }, faces: [[0, 'neutral']], tache: true }],
  front: (t) => <Bicycle x={kf(t, [[14, 1200], [70, -200]]) + 10} y={TOWN.feet + 4} flip roll={1} t={t} />,
});

// ---------- S7: you put the wrapper in the trash. Mo saw the whole thing: "Okay. What just happened?" ----------
export const S7 = scene({
  Set: DAY, setT: 600, cam: { from: [560, 560, 1.6], to: [600, 560, 1.68] }, words,
  back: () => <Bin x={300} y={TOWN.feet + 6} />,
  cast: (t, f) => {
    const mo = cueAt(words, f, t, 'saw');
    return [
      { look: YOU, pose: { x: 420, y: TOWN.feet - 170, yaw: -0.5, armL: { a: kf(t, [[0, 20], [14, 70], [26, 20]]), b: -10 } }, faces: [[0, 'neutral'], [mo + 10, 'oops']] },
      { look: MO, pose: walk(t, 1100, 780, mo - 30, mo + 6, TOWN.feet), faces: [[0, 'shock']], talk: [span(words, 'Okay', 'happened')] },
    ];
  },
});

// ---------- S8: you walk on the grass next to the Keep Off sign. One star ----------
export const S8 = scene({
  Set: DAY, setT: 700, cam: { from: [1250, 560, 1.3], to: [1280, 560, 1.4] }, words,
  back: () => <Grass />,
  cast: (t, f) => [
    { look: YOU, pose: walk(t, 1000, 1300, 6, 50, TOWN.feet - 12), faces: [[0, 'smug']], stars: [[0, 0], [cueAt(words, f, t, 'One'), 1.25]] },
    { look: MO, pose: { x: 860, y: TOWN.feet - 170, yaw: 0.6, look: 0.8 }, faces: [[0, 'neutral'], [cueAt(words, f, t, 'One') + 6, 'shock']] },
  ],
});

// ---------- S9: there's the officer again, right on time. Mo nearly falls over ----------
export const S9 = scene({
  Set: DAY, setT: 800, cam: { from: [1200, 540, 1.15], to: [1150, 540, 1.2] }, words,
  back: () => <Grass />,
  cast: (t, f) => {
    const fall = cueAt(words, f, t, 'falls');
    return [
      { look: DALE, pose: rider(kf(t, [[0, 2100], [40, 1640]]), t), faces: [[0, 'neutral']], tache: true },
      { look: YOU, pose: { x: 1300, y: TOWN.feet - 182, yaw: 0.5, look: 0.8 }, faces: [[0, 'oops']], stars: 1 },
      { look: MO, pose: { x: 860, y: TOWN.feet - 170, yaw: 0.6, look: 0.8, tilt: kf(t, [[fall, 0], [fall + 8, -24], [fall + 20, -14]]), armL: { a: kf(t, [[fall, 20], [fall + 6, 120]]), b: -20 }, armR: { a: kf(t, [[fall, 20], [fall + 6, 120]]), b: -20 } }, faces: [[0, 'shock']] },
    ];
  },
  front: (t) => <Bicycle x={kf(t, [[0, 2100], [40, 1640]]) + 10} y={TOWN.feet + 4} flip roll={1} t={t} />,
});

// ---------- S10: Officer Dale. A moustache, and a bell he rings when he's annoyed. By the third time he sighs and waves ----------
export const S10: React.FC<ShotProps> = (p) => {
  const bell = cueAt(words, p.f, p.t, 'rings');
  const sigh = cueAt(words, p.f, p.t, 'sighs');
  const F = faceCU({
    look: DALE, Bg: DAY, tache: true, faces: [[0, 'neutral'], [bell, 'worried'], [sigh, 'tired']], yaw: -0.3, zoom: [2.4, 2.55],
    pose: { armR: { a: kf(p.t, [[sigh + 6, 20], [sigh + 14, 150]]), b: -30 + 20 * Math.sin(p.t / 3) } },
    extra: (t) => (t > bell && t < bell + 30 ? (
      <g transform="translate(1180 520)">
        <circle r={36} fill="#E8C060" stroke="#14151C" strokeWidth={5} />
        {[0, 1, 2].map((k) => <path key={k} d={`M ${50 + k * 26} -30 q 20 30 0 60`} stroke="#F6EFE3" strokeWidth={8} fill="none" opacity={(Math.floor(t / 2) + k) % 2} />)}
        <text x={110} y={-50} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">DING DING</text>
      </g>
    ) : null),
  });
  return <F {...p} />;
};

// ---------- S11: Mo wants a go: the wrapper, the grass, the middle of the road, until a lady with a dog tells him off ----------
export const S11 = scene({
  Set: DAY, setT: 900, cam: { from: [960, 600, 1.25], to: [960, 620, 1.32] }, words,
  back: (t) => <Dog x={560} y={TOWN.feet + 6} t={t} />,
  cast: (t, f) => {
    const lady = cueAt(words, f, t, 'lady');
    return [
      { look: MO, pose: { ...walk(t, 1300, 1000, 0, 40, TOWN.feet + 140, 1.05), armL: { a: kf(t, [[40, 20], [50, 150]]), b: -20 }, armR: { a: kf(t, [[40, 20], [50, 150]]), b: -20 } }, faces: [[0, 'smug'], [lady + 10, 'oops']] },
      { look: DOGLADY, pose: { x: 720, y: TOWN.feet - 170, yaw: 0.6, look: 0.6, armR: { a: kf(t, [[lady + 6, 20], [lady + 12, 110]]), b: -20 }, handR: 'point' }, faces: [[0, 'neutral'], [lady + 6, 'worried']], talk: [[(lady + 10 + (p0(f, t))) / 30, (lady + 60 + p0(f, t)) / 30]] },
    ] as Who[];
  },
});
function p0(f: number, t: number) { return f - t; }

// ---------- S12: nothing. No stars. It only works on you ----------
export const S12 = faceCU({ look: MO, Bg: DAY, faces: [[0, 'worried'], [40, 'tired']], yaw: 0.3, zoom: [2.7, 2.85] });

// ---------- S13: by Thursday, Mo is writing it all down in a notebook ----------
export const S13: React.FC<ShotProps> = (p) => {
  const c = (w: string, n = 1) => cueAt(words, p.f, p.t, w, n);
  const I = insert({
    bgColor: '#3A2E28', push: 0.06,
    draw: (t) => (
      <Notebook x={960} y={540} s={1.7} rot={-2} t={t} title="THE STAR RULES"
        lines={[
          { at: c('Library'), text: 'Library book, 3 days late' },
          { at: c('One') + 4, text: '= 1 star' },
          { at: c('Skateboard'), text: 'Skateboard in lot' },
          { at: c('One', 2) + 4, text: '= 1 star' },
          { at: c('Running'), text: 'Running from 1 star' },
          { at: c('Two') + 4, text: '= 2 STARS!!', hot: true },
        ]}
      />
    ),
  });
  return <I {...p} />;
};

// ---------- S14: two stars means a patrol car, and a very confused officer ----------
export const S14 = scene({
  Set: LotSet({ police: 0.8 }), setT: 200, cam: { from: [900, 560, 1.15], to: [950, 560, 1.3] }, words, siren: 0.3,
  back: (t) => <g><PoliceCar x={kf(t, [[0, -400], [40, 520]])} y={LOT.feet + 30} t={t} /><Skateboard x={1150} y={LOT.feet + 10} s={1.2} rot={-8} /></g>,
  cast: (t) => [{ look: COP, pose: { ...walk(t, 760, 1020, 50, 90, LOT.feet + 14), look: 0.6, headTilt: 10 }, faces: [[0, 'neutral'], [100, 'oops']], hide: (tt) => tt < 46 }],
});

// ---------- S15: the laundromat, between two old ladies with magazines. The stars flash and fade ----------
const sit = (x: number, dir: 1 | -1, extra = {}) => plant({ x, yaw: dir, facing: dir, legL: { a: 80, b: -80 }, legR: { a: 75, b: -85 }, armR: { a: 70, b: -80 }, armL: { a: 60, b: -80 }, ...extra }, LAUND.feet);
const Mag: React.FC<{ x: number; y: number; c: string }> = ({ x, y, c }) => <g transform={`translate(${x} ${y})`}><rect x={-50} y={-66} width={100} height={132} rx={6} fill={c} stroke="#14151C" strokeWidth={4} /><rect x={-36} y={-50} width={72} height={30} fill="#F4F0E6" /></g>;
export const S15 = scene({
  Set: LaundSet(0), setT: 300, cam: { from: [520, 520, 1.45], to: [520, 540, 1.55] }, words,
  back: (t) => <rect x={60} y={40} width={900} height={300} fill={Math.floor(t / 6) % 2 ? WANT.red : WANT.blue} opacity={0.4 * clamp(1 - t / 120)} />,
  cast: (t, f) => {
    const fl = cueAt(words, f, t, 'flash');
    const fade = cueAt(words, f, t, 'fade');
    return [
      { look: LADY1, pose: { ...sit(300, 1), y: (sit(300, 1).y as number) - 0 }, faces: [[0, 'neutral']] },
      { look: YOU, pose: sit(520, 1, { look: -0.6 }), faces: [[0, 'worried'], [fade + 6, 'smug']], stars: [[0, 2], [fl, 2.5], [fade + 4, 0]] },
      { look: LADY2, pose: sit(740, 1), faces: [[0, 'tired']] },
    ];
  },
  front: () => <g><Mag x={360} y={530} c="#E8504A" /><Mag x={800} y={530} c="#4AA8E0" /></g>,
});

// ---------- S16: on the way home you practise: one star, hide, count, fade ----------
export const S16 = insert({
  Bg: HOME, push: 0.08,
  draw: (t) => {
    const cyc = t % 40;
    const n = cyc < 8 ? 0 : cyc < 22 ? 1 : 1.5;
    const sec = Math.floor((t % 40) * 0.7) + 2;
    return (
      <g>
        <WantedStars x={960} y={560} n={Math.floor(n)} flash={n % 1 > 0} since={cyc - 8} s={2} t={t} />
        <text x={960} y={740} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">{`0:${String(sec).padStart(2, '0')}`}</text>
        <text x={960} y={840} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#C8C2D8">{['STAR', 'HIDE', 'COUNT', 'FADE'][Math.floor(cyc / 10)]}</text>
      </g>
    );
  },
});

// ---------- S17: your record is twenty-eight seconds ----------
export const S17 = bigWord({ kicker: 'YOUR RECORD', word: '0:28', size: 260, Bg: HOME });

// ---------- S18: "This is the best thing that has ever happened to anyone," says Mo ----------
export const S18 = scene({
  Set: HOME, setT: 200, cam: { from: [960, 560, 1.55], to: [960, 560, 1.65] }, words,
  cast: [
    { look: MO, pose: { x: 780, y: SUBURB.feet - 170, yaw: 0.5, armL: { a: 150, b: -20 }, armR: { a: 150, b: -20 } }, faces: [[0, 'happy']], talk: [span(words, 'This', 'anyone')] },
    { look: YOU, pose: { x: 1140, y: SUBURB.feet - 170, yaw: -0.5 }, faces: [[0, 'smug']], stars: 0 },
  ],
});

// ---------- S19: and for one more day, you believe him ----------
export const S19 = faceCU({ look: YOU, Bg: HOME, faces: [[0, 'smug'], [50, 'neutral']], yaw: -0.3, stars: 0, zoom: [2.7, 3.0] });

// ---------- S10B: by the third time, he just sighs and waves ----------
export const S10B = scene({
  Set: DAY, setT: 1000, cam: { from: [1300, 520, 1.5], to: [1300, 520, 1.6] }, words,
  cast: (t) => [
    { look: DALE, pose: { ...rider(1500, 0), armL: { a: 150 + 20 * Math.sin(t / 3), b: -30 } }, faces: [[0, 'tired']], tache: true },
    { look: YOU, pose: { x: 1060, y: TOWN.feet - 170, yaw: 0.5, armR: { a: 140 + 20 * Math.sin(t / 3 + 1), b: -30 } }, faces: [[0, 'happy']], stars: 1 },
  ],
  front: () => <Bicycle x={1510} y={TOWN.feet + 4} flip />,
});

// ---------- S14B: a real officer, very confused, over a skateboard ----------
export const S14B = faceCU({
  look: COP, Bg: LotSet({ police: 0.8 }), faces: [[0, 'oops'], [40, 'worried']], yaw: 0.2, zoom: [2.5, 2.65], siren: 0.3,
  pose: { headTilt: 12, look: 0.6 },
  extra: (t) => <text x={1110} y={420} fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 10) / 6)}>?</text>,
});
