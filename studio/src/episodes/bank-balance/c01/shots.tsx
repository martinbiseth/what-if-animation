import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, faceAt, FONT, Glow, CardTerminal, BankCard, walkPose, SUBURB, busHip,
  shopHip, BalanceOver, BalanceTag, moneyAt, MONEY, Bedroom, BedDuvet, bedSit, WINDOW, BusCabFront, Rooftop,
} from '../../../engine';
import words from './words.json';
import {
  YOU, MO, POSTMAN, DRIVER, RICH, HOODIE, JAKE, KID, N1, N2, N3, N4, GRAN, StreetSet, ShopSet, BusSet, CabSet, ClassSet, faceCU, bigWord, balCU,
  people, at, crowd, MoneyField, span, Soft,
} from '../common';

// Chapter 1, the cold open: you wake, and the postman has a number over his head. Then quick demos: the bus (the
// driver, the woman with the gold watch in the red, the kid with birthday money, the hoodie with millions), Jake
// and his dad's boat at eleven dollars, Mo's chocolate bar ticking his number down; every person, to the cent,
// live, only you; the question. 24+ cuts a minute.

const MORNING = StreetSet('morning');
const DAY = StreetSet('day');
const BUSS = BusSet(7);
const SHOPS = ShopSet(0);
const CLASS = ClassSet(0);

// ---------- S1: you wake in bed, morning light; you sit up and look at the window ----------
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
      <path d={`M ${WINDOW.x0} ${WINDOW.y0} L ${WINDOW.x1} ${WINDOW.y0} L 900 1100 L 520 1100 Z`} fill="#FFF3C0" opacity={0.14} />
      <rect x={WINDOW.x0} y={WINDOW.y0} width={WINDOW.x1 - WINDOW.x0} height={WINDOW.y1 - WINDOW.y0} fill="#FFD9A8" opacity={0.85} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#FFE2B0" opacity={0.12} style={{ mixBlendMode: 'screen' }} />
    </g>
  );
};

// ---------- S2: through the window: the postman walks up the path ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 520], [len, 900]]);
  const p = walkPose(x, t * 0.5, SUBURB.feet, 1, {}, 1);
  return (
    <g>
      <g transform={camT(800, 560, kf(t, [[0, 1.4], [len, 1.5]]))}>
        <MORNING t={t + 100} id="s2" />
        <Hero look={POSTMAN} pose={p} />
        <rect x={x + 30} y={p.y - 10} width={70} height={50} rx={6} fill="#C8A060" stroke="#6A4A30" strokeWidth={5} />
      </g>
      {/* the window frame */}
      <path d="M 0 0 H 1920 V 1080 H 0 Z M 180 120 V 960 H 1740 V 120 Z" fill="#F2EEE6" fillRule="evenodd" />
      <rect x={950} y={120} width={20} height={840} fill="#F2EEE6" />
      <rect x={180} y={520} width={1560} height={20} fill="#F2EEE6" />
    </g>
  );
};

// ---------- S3: medium, the postman at the gate; a number pops over his head and counts up ----------
const POST: [number, number][] = [[0, 0], [28, 840.12]];
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.7], [len, 1.85]]))}>
    <MORNING t={t + 160} id="s3" />
    {people(t, [{ look: POSTMAN, pose: at(960, { yaw: -0.3, armL: { a: 40, b: -60 } }), bal: POST, balPop: 6, balS: 0.75 }])}
  </g>
);

// ---------- S4: the number, huge ----------
export const S4 = balCU({ bal: 840.12, Bg: MORNING, cents: true });

// ---------- S5: your face: wonder, eyes glinting green ----------
export const S5 = faceCU({ look: YOU, Bg: MORNING, faces: [[0, 'shock'], [12, 'happy']], yaw: 0.3, zoom: [3.0, 3.25], glint: 1, glintColor: MONEY.green });

// ---------- S6: he turns around; the number turns with him ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const yaw = kf(t, [[0, -0.6], [14, 0.6]]);
  const x = kf(t, [[0, 960], [len, 1060]]);
  return (
    <g transform={camT(980, 520, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <MORNING t={t + 200} id="s6" />
      {people(t, [{ look: POSTMAN, pose: at(x, { yaw }), bal: 840.12, balS: 0.75 }])}
    </g>
  );
};

// ---------- S7: on the bus: everyone has one ----------
const BUSFOLK = [N1, N2, N3, N4, GRAN, KID];
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const vals = [1840, 312.5, -4200, 27600, 96.1, 15.4];
  return (
    <g transform={camT(kf(t, [[0, 880], [len, 1040]]), 520, 1.05)}>
      <BUSS t={t} id="s7" />
      {people(
        t,
        BUSFOLK.map((look, i) => ({ look, pose: { x: 80 + i * 330, y: busHip(1), yaw: i % 2 ? -0.4 : 0.3, armR: { a: 170, b: 0 } }, bal: vals[i], balPop: 4 + i * 4 })),
      )}
    </g>
  );
};

// ---------- S8: the driver in his cab: $308 ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(800, 560, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <CabSet t={t} id="s8" />
    {people(t, [{ look: DRIVER, pose: { x: 700, y: 720, yaw: 0.35, armL: { a: 50, b: -70 }, armR: { a: 50, b: -70 } }, bal: 308, balPop: 26 }])}
    <BusCabFront />
  </g>
);

// ---------- S9: the woman with the gold watch and the designer bag: minus sixty-one thousand ----------
const Bag: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -22 -26 Q 0 -60 22 -26" stroke="#C89A2A" strokeWidth={7} fill="none" />
    <rect x={-38} y={-28} width={76} height={56} rx={10} fill="#FFD34A" stroke="#8A6A1A" strokeWidth={5} />
    <rect x={-10} y={-12} width={20} height={14} rx={3} fill="#8A6A1A" />
  </g>
);
// the number pops when the voice says it: drawn as its own shot so it can sit on the cue
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(900, 480, kf(t, [[0, 2.05], [len, 2.15]]))}>
    <BUSS t={t + 130} id="s9" />
    {people(t, [{ look: RICH, pose: { x: 880, y: busHip(1), yaw: 0.3, armR: { a: 170, b: 0 }, armL: { a: 20, b: -80 } }, faces: [[0, 'smug']], bal: -61000, balPop: 66, balS: 0.75 }])}
    <Bag x={830} y={busHip(1) - 40} />
    <Glow x={880} y={busHip(1) - 330} r={260} kind="red" o={0.5} />
  </g>
);

// ---------- S10: you: shock ----------
export const S10 = faceCU({ look: YOU, Bg: BUSS, faces: [[0, 'shock']], yaw: -0.3, zoom: [3.2, 3.4], glint: 1, glintColor: MONEY.red });

// ---------- S11: a kid your age with big headphones: nine thousand ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 500, kf(t, [[0, 1.9], [len, 2.0]]))}>
    <BUSS t={t + 160} id="s11" />
    {people(t, [{ look: { ...KID, extra: 'curls' }, pose: { x: 980, y: busHip(1), yaw: -0.2, headTilt: Math.sin(t / 5) * 6, armR: { a: 170, b: 0 } }, faces: [[0, 'cool']], bal: 9000, balPop: 6 }])}
    {/* the headphones */}
    <path d={`M 925 ${busHip(1) - 200} Q 980 ${busHip(1) - 290} 1035 ${busHip(1) - 200}`} stroke="#E8504A" strokeWidth={12} fill="none" />
    <rect x={905} y={busHip(1) - 215} width={30} height={46} rx={10} fill="#E8504A" />
    <rect x={1025} y={busHip(1) - 215} width={30} height={46} rx={10} fill="#E8504A" />
  </g>
);

// ---------- S12: a guy in a hoodie eating crisps: four point two million ----------
export const S12: React.FC<ShotProps> = ({ t, len, f }) => {
  const hand = Math.abs(Math.sin(t / 6));
  return (
    <g transform={camT(980, 500, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <BUSS t={t + 190} id="s12" />
      {people(t, [{ look: HOODIE, pose: { x: 980, y: busHip(1), yaw: 0.25, armL: { a: 30, b: -100 }, armR: { a: 40 + hand * 40, b: -120 } }, faces: [[0, 'neutral']], bal: [[80, 0], [96, 4200000]], balPop: 80 }])}
      <path d="M 880 640 L 960 640 L 950 730 L 890 730 Z" fill="#F2C14E" stroke="#8A6A1A" strokeWidth={5} />
      <text x={920} y={694} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={24} fill="#B8323A">CRISPS</text>
    </g>
  );
};

// ---------- S13: at school, Jake brags about his dad's boat ----------
const jakeBal: [number, number][] = [[0, 0], [1, 11]];
export const S13: React.FC<ShotProps> = ({ t, len, f }) => (
  <g transform={camT(1080, 520, kf(t, [[0, 1.5], [len, 1.6]]))}>
    <CLASS t={t} id="s13" />
    {people(
      t,
      [
        { look: JAKE, pose: { x: 900, y: 700, yaw: 0.4, armR: { a: 110 + Math.sin(t / 5) * 20, b: -40 }, armL: { a: 30, b: -20 } }, faces: [[0, 'smug']], bal: jakeBal, balPop: 96 },
        { look: KID, pose: { x: 1260, y: 700, yaw: -0.4 }, faces: [[0, 'neutral']] },
      ],
      f,
      words,
      { 0: [[33.0, 36.0]] },
    )}
    {/* the boat he's describing, a thought bubble */}
    <g transform="translate(700 260)" opacity={clamp((t - 10) / 8)}>
      <ellipse cx={0} cy={0} rx={170} ry={100} fill="#F6EFE3" stroke="#26232F" strokeWidth={6} />
      <circle cx={120} cy={110} r={18} fill="#F6EFE3" stroke="#26232F" strokeWidth={5} />
      <path d="M -110 20 L 110 20 L 80 60 L -80 60 Z" fill="#E8E4D8" stroke="#26232F" strokeWidth={5} />
      <path d="M -20 20 V -70 L 60 10 Z" fill="#4AA8E0" stroke="#26232F" strokeWidth={5} />
    </g>
  </g>
);
// the boat kid's number, close
export const S14 = balCU({ bal: 11, Bg: CLASS, label: "JAKE'S DAD'S BOAT?", s: 2.6 });

// ---------- S15: Mo, your best friend, at the tuck shop: $3.12 ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1100, 520, kf(t, [[0, 1.5], [len, 1.62]]))}>
    <SHOPS t={t} id="s15" />
    {people(t, [
      { look: MO, pose: { x: 1180, y: shopHip(1), yaw: 0.4 }, faces: [[0, 'happy']], bal: 3.12, balPop: 8 },
      { look: YOU, pose: { x: 880, y: shopHip(1), yaw: 0.5, look: 0.8 }, faces: [[0, 'neutral']] },
    ])}
  </g>
);

// ---------- S16: insert, he taps his card for a chocolate bar ----------
export const S16: React.FC<ShotProps> = ({ t }) => {
  const tap = clamp((t - 6) / 6);
  return (
    <g>
      <Soft blur={16} dim={0.35}>
        <g transform={camT(1400, 520, 1.4)}>
          <SHOPS t={t + 200} id="s16" />
        </g>
      </Soft>
      <rect x={300} y={720} width={1400} height={400} fill="#7A4A3A" />
      <rect x={280} y={700} width={1440} height={30} fill="#A8705A" />
      <CardTerminal x={1080} y={700} s={2.0} state={t > 14 ? 'ok' : 'idle'} t={t} />
      <g transform={`translate(${kf(t, [[0, 1500], [10, 1180]])} ${kf(t, [[0, 600], [10, 470]])}) rotate(-20)`}>
        <BankCard x={0} y={0} s={2.2} />
      </g>
      <g transform="translate(560 660) rotate(-8)">
        <rect x={-150} y={-46} width={300} height={92} rx={10} fill="#5A2A1A" />
        <rect x={-150} y={-46} width={300} height={40} rx={10} fill="#B8323A" />
        <text x={0} y={-16} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#F6EFE3">CHOCO</text>
      </g>
      {tap > 0.99 ? <text x={1080} y={200} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill={MONEY.red} stroke="#0B0816" strokeWidth={8} paintOrder="stroke">-$1.50</text> : null}
    </g>
  );
};

// ---------- S17: Mo's number ticks down: $3.12 -> $1.62 ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1180, 440, kf(t, [[0, 2.2], [len, 2.35]]))}>
    <SHOPS t={t + 60} id="s17" />
    {people(t, [{ look: MO, pose: { x: 1180, y: shopHip(1), yaw: 0.3, armR: { a: 120, b: -100 } }, faces: [[0, 'happy']], bal: [[0, 3.12], [6, 3.12], [16, 1.62]], balS: 0.7 }])}
    <g transform="translate(1290 440) rotate(-15)">
      <rect x={-40} y={-14} width={80} height={28} rx={6} fill="#B8323A" />
    </g>
  </g>
);

// ---------- S18: every person: the street, everyone with a number ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const folk = crowd(9, 120, 1800, 4, { expr: 'neutral' });
  const vals = [420.1, -12400, 3100, 88, 152000, -830, 9600, 41, 2210];
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 520, 1.05)}>
      <DAY t={t + 300} id="s18" />
      {people(t, folk.map((c, i) => ({ look: c.look, pose: { x: c.x, y: c.y, scale: c.scale, yaw: c.yaw ?? 0 }, bal: vals[i], balPop: i * 2 })))}
    </g>
  );
};

// ---------- S19: every account: the numbers drift up ----------
export const S19 = bigWord({ word: 'EVERY ACCOUNT', size: 170, color: MONEY.green, Bg: ({ t }) => <MoneyField t={t} /> });

// ---------- S20: to the cent: a number ticking by cents ----------
export const S20 = balCU({ bal: [[0, 1204.37], [10, 1204.37], [12, 1204.38], [22, 1204.38], [24, 1204.12], [34, 1204.12], [36, 1203.62]], cents: true, label: 'TO THE CENT' });

// ---------- S21: LIVE ----------
export const S21: React.FC<ShotProps> = ({ t }) => (
  <g>
    <MoneyField t={t + 80} />
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.4} />
    <g transform={`translate(960 600) scale(${backOut(clamp((t - 2) / 8))})`}>
      <circle cx={-260} cy={-70} r={46} fill="#FF3A3A" opacity={0.6 + 0.4 * Math.sin(t / 3)} />
      <text x={40} y={0} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={230} fill="#F6EFE3" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">LIVE</text>
    </g>
  </g>
);

// ---------- S22: nobody else can see them: people go about their day; only you look up ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const folk = crowd(7, 160, 1760, 7, { expr: 'neutral', skip: [3] });
  const vals = [61.2, -2300, 18400, 7.5, 640, 3300, -150];
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.15], [len, 1.25]]))}>
      <DAY t={t + 400} id="s22" />
      {people(t, [
        ...folk.map((c, i) => ({ look: c.look, pose: { x: c.x, y: c.y, scale: c.scale, yaw: (c.yaw ?? 0) * -1, look: 0 }, bal: vals[i] })),
        { look: YOU, pose: at(960, { yaw: 0, look: 0, headTilt: -10 }), faces: [[0, 'worried'] as [number, 'worried']] },
      ])}
    </g>
  );
};

// ---------- S23: just you ----------
export const S23 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'neutral'], [10, 'smug']], yaw: 0.15, zoom: [3.1, 3.3], glint: 1, glintColor: MONEY.green });

// ---------- S24: the question: pull back from you on a rooftop at dusk, the city full of numbers ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1.9], [len, 1.0]]);
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), z)}>
      <Rooftop t={t} sunX={1300} sunY={560} />
      <g opacity={clamp((t - 10) / 20)}>
        <MoneyField t={t + 500} n={24} blur bg={false} />
      </g>
      {people(t, [{ look: YOU, pose: { x: 960, y: 820 - 230, yaw: -0.2, look: 0.3 }, faces: [[0, 'neutral']] }])}
    </g>
  );
};
