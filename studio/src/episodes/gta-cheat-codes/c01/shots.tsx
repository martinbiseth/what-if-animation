import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, FONT, Glow, LEG_LEN, stepTop, TitleCard, Bank, rnd, easeIn,
  BookFlat, Mug, DizzyStars, ModernCar, SUBURB, BANK,
} from '../../../engine';
import {
  YOU, SELLER, StairSet, BedSet, DayStreet, Sky, faceCU, ctrlCU, listCU, scene, fig, Flyer, CodeField, OUR_DOOR, ROAD, Soft,
  Controller, CheatText, SportsCar, SpawnFlash, CashStack, Bill, CHEAT, propCU, BankS, StreetSet,
} from '../common';

// Chapter 1, the cold open: four quick demos (the stairs, the sock drawer, the car from the sky, the jetpack), the
// yard-sale controller and its list with the scribbled last line, the title, then the catch.

const hipOn = (x: number, s = 1) => stepTop(x) - LEG_LEN * s;

// ---------- S1: down all fourteen stairs, tumbling ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 64);
  const x = 470 + k * 1000;
  const hop = Math.abs(Math.sin(k * Math.PI * 5)) * 60;
  const pose: Pose = {
    ...basePose, x, y: hipOn(x, 0.8) - hop + 40, scale: 0.8, spin: k * 720, expr: 'shock', yaw: 0.3,
    armL: { a: 120 + Math.sin(t / 3) * 30, b: -30 }, armR: { a: 140 + Math.cos(t / 3) * 30, b: -20 }, legL: { a: 50, b: 30 }, legR: { a: -40, b: 40 },
  };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1060]]), 600, 1.05)}>
      <StairSet t={t + 40} id="s1" />
      <Hero look={YOU} pose={pose} />
    </g>
  );
};

// ---------- S2: you land on your head (upside down, a squash, stars) ----------
export const S2: React.FC<ShotProps> = ({ t }) => {
  const land = clamp(t / 6);
  const sq = t > 6 && t < 14 ? Math.sin(((t - 6) / 8) * Math.PI) * 0.25 : 0;
  const pose: Pose = {
    ...basePose, x: 1500, y: 860 - (1 - land) * 160, scale: 0.9, spin: 180, squash: sq, expr: 'dizzy',
    legL: { a: 30, b: 10 }, legR: { a: -30, b: 10 }, armL: { a: 70, b: 0 }, armR: { a: 70, b: 0 }, yaw: 0.2,
  };
  return (
    <g transform={camT(1480, 820, 2.0)}>
      <StairSet t={t + 120} id="s2" />
      <Hero look={YOU} pose={pose} />
      {t > 8 ? <DizzyStars x={1500} y={980} t={t} rx={90} ry={30} /> : null}
    </g>
  );
};

// ---------- S3: you stand up, not a scratch; the letters glow ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1440, 700, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <StairSet t={t + 180} id="s3" />
      {fig(YOU, t, { x: 1500, y: 910 - LEG_LEN * 0.9 - 30, scale: 0.9, yaw: -0.3, look: -0.6, armR: { a: 40 + Math.sin(t / 4) * 20, b: -60 }, headTilt: 4 }, [[0, 'oops'], [16, 'smug']])}
    </g>
    <CheatText x={960} y={170} p={t - 10} head="INVINCIBLE" s={0.6} />
  </g>
);

// ---------- S4: the sock drawer slides open ----------
const Drawer: React.FC<{ open: number; cash: number }> = ({ open, cash }) => (
  <g>
    <rect x={460} y={320} width={1000} height={760} fill="#6A4A3A" stroke="#2A1A14" strokeWidth={8} />
    <rect x={500} y={360} width={920} height={180} fill="#7A5A44" stroke="#2A1A14" strokeWidth={6} />
    {/* the open drawer comes toward us: a box seen from above */}
    <g transform={`translate(0 ${open * 140})`}>
      <path d="M 470 560 H 1450 L 1500 980 H 420 Z" fill="#3A2A20" />
      {/* socks */}
      {[0, 1, 2, 3, 4].map((i) => (
        <ellipse key={i} cx={560 + i * 190} cy={640 + (i % 2) * 40} rx={80} ry={36} fill={['#E8504A', '#F6EFE3', '#4A7AB8', '#F2C14E', '#5BD08A'][i]} opacity={1 - cash * 0.8} />
      ))}
      {cash > 0
        ? Array.from({ length: 14 }).map((_, i) => (
            <g key={`c${i}`} opacity={clamp(cash * 14 - i)}>
              <CashStack x={560 + (i % 5) * 190} y={700 + Math.floor(i / 5) * 90} s={1.1} rot={(rnd(3, i) - 0.5) * 16} />
            </g>
          ))
        : null}
      <rect x={420} y={940} width={1080} height={160} fill="#8A6A52" stroke="#2A1A14" strokeWidth={8} />
      <rect x={880} y={990} width={160} height={30} rx={14} fill="#C8A878" />
    </g>
  </g>
);
export const S4 = propCU({ Bg: BedSet, draw: (t) => <Drawer open={kf(t, [[2, 0], [18, 1]])} cash={kf(t, [[14, 0], [40, 1]])} />, push: 0.05 });
export const S4b = propCU({
  Bg: BedSet,
  draw: (t) => (
    <g transform={`translate(960 600) scale(${kf(t, [[0, 1.5], [60, 1.7]])}) translate(-960 -700)`}>
      <Drawer open={1} cash={1} />
      <Glow x={960} y={760} r={500} o={0.35} />
    </g>
  ),
});

// ---------- S5: "Again." You, smug, bills drifting down ----------
export const S5 = faceCU({
  look: YOU, Bg: BedSet, faces: [[0, 'smug']], yaw: 0.25, zoom: [3.1, 3.3],
  front: (t) => (
    <g>
      {Array.from({ length: 10 }).map((_, i) => (
        <Bill key={i} x={rnd(5, i) * 1920} y={-200 + ((t * (6 + rnd(6, i) * 4) + rnd(7, i) * 900) % 1400)} s={0.35} rot={Math.sin(t / 10 + i) * 30} />
      ))}
    </g>
  ),
});

// ---------- S6: five buttons ----------
export const S6 = ctrlCU({ Bg: DayStreet, seq: [[3, 'r'], [10, 'b'], [17, 'up'], [24, 'g'], [31, 'y']] });

// ---------- S7: a red sports car drops out of the sky onto the street in front of the house ----------
export const S7 = scene({
  Set: DayStreet, cam: [[900, 600, 1.15], [920, 600, 1.2]],
  draw: (t) => {
    const fall = clamp((t - 4) / 12, 0, 1);
    const y = -500 + easeIn(fall) * (ROAD + 500);
    const sq = t > 16 && t < 26 ? Math.sin(((t - 16) / 10) * Math.PI) * 0.12 : 0;
    return (
      <g>
        <SpawnFlash x={1050} y={-40} p={t - 2} r={260} />
        <g transform={`translate(1050 ${y}) scale(${1 + sq} ${1 - sq}) translate(-1050 ${-y})`}>
          <SportsCar x={1050} y={y} s={0.95} />
        </g>
        <SpawnFlash x={1050} y={ROAD - 60} p={t - 16} r={320} color="#FFE27A" />
        {fig(YOU, t, { x: 520, y: SUBURB.feet - LEG_LEN, yaw: 0.5, look: 0.7, armR: { a: 50, b: -70 } }, [[0, 'neutral'], [18, 'shock']])}
        <Controller x={575} y={SUBURB.feet - LEG_LEN - 50} s={0.16} />
      </g>
    );
  },
});

// ---------- S8: over the traffic on a jetpack ----------
export const S8 = scene({
  Set: Sky, cam: [[960, 540, 1], [980, 540, 1.04]],
  draw: (t) => (
    <g>
      {/* a jam of tiny cars on the road below */}
      {Array.from({ length: 22 }).map((_, i) => (
        <rect key={i} x={-300 + i * 110} y={928 + Math.sin(i) * 6 - i * 2.5} width={70} height={30} rx={8} fill={['#C84A3A', '#4A7AB8', '#E8E4D8', '#F2C14E', '#3A3C46'][i % 5]} />
      ))}
      <Flyer x={kf(t, [[0, 300], [97, 1500]])} y={kf(t, [[0, 520], [97, 400]])} s={0.7} t={t} />
    </g>
  ),
});

// ---------- S9: you on the jetpack, closer, grinning ----------
export const S9 = scene({
  Set: Sky, cam: [[960, 520, 1.6], [960, 500, 1.7]], setT: 400,
  draw: (t) => <Flyer x={960} y={560} s={1} t={t} expr="happy" />,
});

// ---------- S10: the yard sale, two dollars ----------
const Table: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={720} y={SUBURB.feet - 210} width={620} height={24} fill="#C8A878" stroke="#5A4030" strokeWidth={5} />
    <path d="M 750 590 V 800 M 1310 590 V 800" stroke="#5A4030" strokeWidth={14} />
    <BookFlat x={800} y={SUBURB.feet - 214} w={140} i={1} />
    <BookFlat x={800} y={SUBURB.feet - 236} w={130} i={3} />
    <Mug x={1270} y={SUBURB.feet - 250} rot={0} steam={0} f={t} />
    <Controller x={1050} y={SUBURB.feet - 240} s={0.22} />
    <g transform={`translate(1110 ${SUBURB.feet - 300}) rotate(8)`}>
      <rect x={-46} y={-30} width={92} height={56} rx={6} fill="#FFF3A0" stroke="#5A4030" strokeWidth={3} />
      <text y={14} textAnchor="middle" fontFamily="Kalam, cursive" fontWeight={700} fontSize={40} fill="#2A2418">$2</text>
    </g>
  </g>
);
export const S10 = scene({
  Set: DayStreet, cam: [[1020, 560, 1.55], [1040, 560, 1.65]], setT: 700,
  draw: (t) => (
    <g>
      {fig(SELLER, t, { x: 1220, y: SUBURB.feet - LEG_LEN - 10, yaw: -0.4, look: -0.5 }, [[0, 'happy']], 2)}
      <Table t={t} />
      {fig(YOU, t, { x: 820, y: SUBURB.feet - LEG_LEN + 40, yaw: 0.5, look: 0.6, armR: { a: 60 + kf(t, [[40, 0], [70, 20]]), b: -40 } }, [[0, 'neutral'], [60, 'happy']], 3)}
    </g>
  ),
});

// ---------- S11, S12: the list on the back; push in on the scribbled line ----------
export const S11 = listCU({ Bg: DayStreet, focus: 'top' });
export const S12 = listCU({ Bg: DayStreet, focus: 'bottom' });

// ---------- S13: the title ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <CodeField t={t} />
    </g>
    <Controller x={960} y={kf(t, [[0, 820], [len, 790]])} s={0.9} glow={0.6} press={['r', 'b', 'g', 'y'][Math.floor(t / 10) % 4]} />
    <TitleCard t={t} lines={['WHAT IF CHEAT CODES', 'WORKED IN REAL LIFE?']} accent="REAL" y={240} size={118} />
  </g>
);

// ---------- S13b: "Not in a game." A blocky game on an old TV, switched off ----------
export const S13b: React.FC<ShotProps> = ({ t }) => {
  const off = clamp((t - 36) / 6);
  return (
    <g>
      <rect width={1920} height={1080} fill="#1A1420" />
      <rect x={460} y={190} width={1000} height={700} rx={40} fill="#2A2830" />
      <rect x={510} y={240} width={900} height={600} rx={20} fill="#3A8AF0" />
      <g opacity={1 - off}>
        <rect x={510} y={700} width={900} height={140} fill="#4BD86A" />
        {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={600 + i * 120} cy={560 + Math.sin(t / 5 + i) * 10} r={22} fill="#F2C14E" stroke="#2A2418" strokeWidth={5} />)}
        <rect x={700 + ((t * 8) % 500)} y={600} width={60} height={100} fill="#F07A2A" stroke="#1A1018" strokeWidth={6} />
        <text x={540} y={300} fontFamily={FONT.ui} fontSize={40} fill="#FFFFFF">SCORE 004200</text>
      </g>
      <rect x={510} y={240} width={900} height={600} rx={20} fill="#0A0A10" opacity={off} />
      <rect x={510} y={540 - 300 * (1 - off) * 0} width={900} height={off > 0 && off < 1 ? 6 : 0} fill="#FFFFFF" />
      <rect x={820} y={890} width={280} height={80} fill="#2A2830" />
    </g>
  );
};

// ---------- S14: your street ----------
export const S14 = scene({
  Set: DayStreet, cam: [[OUR_DOOR, 520, 1.3], [OUR_DOOR, 520, 1.36]], setT: 900,
  draw: (t) => (
    <g>
      {fig(YOU, t, { x: OUR_DOOR - 140, y: SUBURB.feet - LEG_LEN, yaw: 0.2, armR: { a: 30, b: -60 } }, [[0, 'smug']])}
      <Controller x={OUR_DOOR - 92} y={SUBURB.feet - LEG_LEN - 40} s={0.15} glow={0.4} />
    </g>
  ),
});

// ---------- S15: your body ----------
export const S15 = faceCU({ look: YOU, Bg: DayStreet, faces: [[0, 'cool']], yaw: -0.2, zoom: [2.3, 2.5], glint: 1, glintColor: CHEAT.glow });

// ---------- S16: your bank ----------
export const S16 = scene({
  Set: BankS, cam: [[900, 560, 1.2], [930, 560, 1.26]],
  draw: (t) => fig(YOU, t, { x: 800, y: BANK.feet - LEG_LEN, yaw: 0.5, look: 0.6, armR: { a: 20, b: -10 } }, [[0, 'happy']]),
});

// ---------- S17: the catch ----------
export const S17 = faceCU({
  look: YOU, Bg: StreetSet('dusk', { cars: false }), faces: [[0, 'neutral'], [30, 'worried']], yaw: 0.1, zoom: [3.2, 3.6],
  front: (t) => <rect width={1920} height={1080} fill="#3A0A10" opacity={clamp((t - 30) / 20) * 0.35} />,
});
