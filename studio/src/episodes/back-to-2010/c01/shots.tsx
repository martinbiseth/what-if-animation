import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, ShotProps, idleBlink, faceAt, FONT, KITCHEN, stand, KitchenIsland, CitySkyline, PizzaBox,
} from '../../../engine';
import {
  YOU, MUM10, ELLIE, KIT, BED, propCU, faceCU, bigWord, talkShot, tvCU, laptopCU, HundredBill, Coin, OldLaptop, ButtonPhone, BigCalendar,
  PhoneAd, FootballScreen, ForumScreen, PriceChart, BTC, FlatTV, Soft,
} from '../common';

// Chapter 1, the cold open: you wake in 2010 (no phone, a button phone, a chunky laptop, the iPhone 4 ad, the
// calendar), young Mum, tiny Ellie, the crumpled $100, everything you remember, the pizza, the question.

// ---------- S1: from above, you in bed: eyes open, something's wrong ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const face = faceAt(t, [[0, 'tired'], [16, 'neutral'], [34, 'worried']]);
  const me: Pose = { ...basePose, x: 860, y: 630, spin: -90, yaw: 0, look: 0.3, ...face, armR: { a: 40, b: -90 }, armL: { a: 10, b: 0 }, blink: t < 12 ? 1 : face.blink };
  return (
    <g>
      <g transform={camT(980, 560, kf(t, [[0, 1.8], [len, 2.0]]))}>
        <rect x={-400} y={-400} width={2800} height={1900} fill="#3A3048" />
        <rect x={300} y={360} width={1320} height={420} rx={30} fill="#4A8A7A" stroke="#141826" strokeWidth={8} />
        <ellipse cx={770} cy={560} rx={110} ry={160} fill="#DCDDE6" stroke="#141826" strokeWidth={6} />
        <Hero look={YOU} pose={me} shadow={0} />
        <path d="M 990 380 Q 1350 360 1620 400 L 1620 760 Q 1350 790 990 770 Z" fill="#E87A4A" stroke="#141826" strokeWidth={6} />
      </g>
      <path d="M 1300 0 L 1700 0 L 1300 1080 L 900 1080 Z" fill="#FFF3C0" opacity={0.12} />
    </g>
  );
};

export const S2 = faceCU({ look: YOU, Bg: BED, faces: [[0, 'neutral'], [8, 'worried']], yaw: 0.2, zoom: [3.0, 3.25] });

// ---------- S3: the bedside table: your hand pats around; no phone ----------
export const S3 = propCU({
  Bg: BED,
  draw: (t) => {
    const hx = 960 + Math.sin(t / 5) * 220;
    return (
      <g>
        <rect x={360} y={680} width={1200} height={500} fill="#7A5A4A" stroke="#141826" strokeWidth={8} />
        <rect x={420} y={600} width={160} height={90} rx={10} fill="#C8A86A" stroke="#141826" strokeWidth={6} />
        <path d={`M ${hx} 690 Q ${hx + 300} 620 1900 520`} stroke="#F07A2A" strokeWidth={100} fill="none" strokeLinecap="round" />
        <ellipse cx={hx} cy={680} rx={70} ry={42} fill="#26232F" stroke="#100E16" strokeWidth={8} />
        <text x={960} y={420} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp((t - 14) / 6)}>?</text>
      </g>
    );
  },
});

// ---------- S4: the desk: a chunky laptop and a phone with buttons ----------
export const S4 = propCU({
  Bg: BED,
  push: 0.1,
  draw: (t) => (
    <g>
      <rect x={200} y={820} width={1520} height={400} fill="#8A6A4A" stroke="#141826" strokeWidth={8} />
      <OldLaptop x={820} y={830} s={1.05} glow={0.6}>
        <rect width={536} height={340} fill="#3A7AC8" />
        <rect y={300} width={536} height={40} fill="#2A3A6A" />
        <rect x={6} y={306} width={80} height={28} rx={6} fill="#4AA85A" />
        {[0, 1, 2].map((i) => <rect key={i} x={30} y={30 + i * 80} width={50} height={50} rx={6} fill="#E8ECF4" opacity={0.85} />)}
      </OldLaptop>
      <ButtonPhone x={1420} y={760} s={0.9} rot={12} text="MAY 01" />
    </g>
  ),
});

// ---------- S5: the button phone, close ----------
export const S5 = propCU({ Bg: BED, push: 0.12, draw: (t) => <ButtonPhone x={960} y={560} s={2.2} rot={-6 + Math.sin(t / 10) * 2} text="MAY 01" /> });

// ---------- S6: the TV: an ad for a brand new phone ----------
export const S6 = tvCU((t) => <PhoneAd t={t} />);

export const S7 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'shock']], yaw: -0.2, zoom: [3.1, 3.35] });

// ---------- S8: the calendar on the wall: MAY 2010 ----------
export const S8 = propCU({ Bg: BED, push: 0.14, draw: () => <BigCalendar x={960} y={560} s={1.45} ring={1} /> });

export const S9 = bigWord({ kicker: 'IT IS', word: '2010', color: '#FFD86A', Bg: BED });

// ---------- S10: wide, the kitchen: you run in; young Mum at the counter, tiny Ellie on the floor ----------
const K1 = stand(KITCHEN, 0.3, 0.45), K3 = stand(KITCHEN, 0.78, 0.42);
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const run = easeOut(clamp(t / 24));
  const x = 1700 - run * (1700 - K3.x);
  const me: Pose = { ...basePose, x, y: K3.y, scale: K3.scale, yaw: -0.5, expr: 'shock', blink: idleBlink(t, 2), legL: { a: Math.sin(t / 2) * 30 * (1 - run), b: 10 }, legR: { a: -Math.sin(t / 2) * 30 * (1 - run), b: 10 } };
  const mum: Pose = { ...basePose, x: K1.x, y: K1.y, scale: K1.scale, yaw: 0.4, expr: 'happy', blink: idleBlink(t, 5), armR: { a: 100, b: 30 } };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.15], [len, 1.2]]))}>
      <KIT t={t + 200} id="s10" />
      <Hero look={MUM10} pose={mum} />
      <KitchenIsland />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

export const S11 = faceCU({ look: MUM10, Bg: KIT, faces: [[0, 'happy']], yaw: 0.35, zoom: [3.0, 3.2] });

// ---------- S12: tiny Ellie in a onesie, cross-legged in front of cartoons ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const ellie: Pose = { ...basePose, x: 780, y: 840, scale: 0.8, yaw: 0.6, expr: 'happy', blink: idleBlink(t, 3), look: 0.8, legL: { a: 80, b: -120 }, legR: { a: -80, b: 120 } };
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Soft blur={6} dim={0.1}><KIT t={t + 260} id="s12" /></Soft>
      <rect x={-200} y={880} width={2400} height={400} fill="#5A4A5A" />
      <Hero look={{ ...ELLIE, jacket: '#F2B8D8', jacketShade: '#D898B8' }} pose={ellie} />
      <FlatTV x={1350} y={860} s={0.8}>
        <rect width={640} height={360} fill="#7AD0F0" />
        <circle cx={320 + Math.sin(t / 5) * 120} cy={200 - Math.abs(Math.sin(t / 4)) * 60} r={50} fill="#FFD86A" stroke="#100E16" strokeWidth={6} />
        <rect y={290} width={640} height={70} fill="#5AC85A" />
      </FlatTV>
    </g>
  );
};

// ---------- S13: your hand comes out of your pocket with one crumpled bill ----------
export const S13 = propCU({
  Bg: KIT,
  draw: (t) => {
    const up = easeOut(clamp(t / 20));
    return (
      <g>
        <rect x={0} y={760} width={1920} height={400} fill="#3A4A6A" />
        <path d="M 600 760 Q 960 700 1320 760" stroke="#2A3450" strokeWidth={14} fill="none" />
        <g transform={`translate(0 ${(1 - up) * 300})`}>
          <HundredBill x={960} y={560} s={0.8} rot={-8} crumple={1} />
          <path d="M 960 640 L 980 1200" stroke="#F07A2A" strokeWidth={130} strokeLinecap="round" />
          <ellipse cx={960} cy={650} rx={90} ry={60} fill="#26232F" stroke="#100E16" strokeWidth={8} />
        </g>
      </g>
    );
  },
});

// ---------- S14: the bill, flattened, glowing ----------
export const S14 = propCU({ Bg: KIT, push: 0.1, draw: (t) => <HundredBill x={960} y={540} s={2.1} rot={-3 + Math.sin(t / 20)} crumple={0.4} glow={1} /> });

export const S15 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'neutral'], [10, 'shock'], [30, 'smug']], yaw: 0.25, zoom: [3.0, 3.3], glint: 1 });

// ---------- S16-S18: everything you remember: a winner, a crash, an app ----------
export const S16 = tvCU((t) => <FootballScreen t={t} goal={clamp((t - 4) / 14)} score="1 - 0" />);
export const S17: React.FC<ShotProps> = ({ t }) => (
  <PriceChart t={t} p={clamp(0.62 + t / 60)} points={BTC} title="CRASH" marks={[{ year: 2018.96, price: 3200, label: '-84%', at: 10, color: '#FF5A4A' }]} />
);
export const S18: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A1A2E" />
    {[0, 1, 2, 3, 4, 5].map((i) => {
      const p = clamp((t - i * 3) / 6);
      const colors = ['#E8503A', '#3A8AE8', '#E8C04A', '#5AC85A', '#B85AE8', '#F07A2A'];
      return (
        <g key={i} transform={`translate(${560 + (i % 3) * 400} ${380 + Math.floor(i / 3) * 340}) scale(${p})`}>
          <rect x={-120} y={-120} width={240} height={240} rx={54} fill={colors[i]} stroke="#100E16" strokeWidth={8} />
          <circle r={60} fill="none" stroke="#F6EFE3" strokeWidth={16} />
        </g>
      );
    })}
  </g>
);

// ---------- S19: the forum on the laptop: "Pizza for bitcoins?" ----------
export const S19 = laptopCU((t) => <ForumScreen hot="Pizza for bitcoins?" t={t} />);

// ---------- S20: two pizza boxes; coins pour onto them ----------
export const S20 = propCU({
  bgColor: '#2A1A2A',
  draw: (t) => (
    <g>
      <PizzaBox x={820} y={760} w={420} />
      <PizzaBox x={1120} y={700} w={420} />
      {Array.from({ length: 14 }, (_, i) => {
        const k = clamp((t - i * 2) / 14);
        return <Coin key={i} x={700 + (i * 97) % 560} y={-100 + easeOut(k) * (560 + (i % 3) * 40)} r={46} spin={t / 20 + i * 0.1} />;
      })}
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#FFD86A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp((t - 20) / 6)}>10,000 ₿</text>
    </g>
  ),
});

export const S21 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'smug']], yaw: -0.3, zoom: [3.2, 3.5] });

// ---------- S22: the city of 2010 at dusk, your window the only one awake ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <CitySkyline t={t} id="s22" red={0.2} lit={0.7} />
    <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.25} />
  </g>
);

// ---------- S23: the question: you, the bill held up ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 960, y: 700, scale: 1, yaw: 0, expr: faceAt(t, [[0, 'neutral'], [30, 'smug']]).expr, blink: idleBlink(t, 4), armR: { a: 150, b: 20 }, look: 0 };
  return (
    <g>
      <Soft blur={10} dim={0.2}><g transform={camT(960, 520, 1.3)}><KIT t={t + 600} id="s23" /></g></Soft>
      <g transform={camT(960, 520, kf(t, [[0, 1.9], [len, 2.1]]))}>
        <Hero look={YOU} pose={me} shadow={0} />
        <HundredBill x={1160} y={300} s={0.32} rot={-12} glow={0.6} />
      </g>
    </g>
  );
};
