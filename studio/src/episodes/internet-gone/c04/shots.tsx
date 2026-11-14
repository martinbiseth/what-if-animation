import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, FONT, factCard, CardTerminal, BankCard, CashMachine, PetrolPump, Notice, Tap, SeaCable,
  Jet, ModernCar, Schematic, SCH, SUBURB, SHOP, shopHip, LampPost, Smartphone,
} from '../../../engine';
import words from './words.json';
import {
  YOU, MUM, GRAN, NURSE, N1, N2, N3, DAD, KID, MO, StreetSet, ShopSet, KitchenSet, phoneCU, propCU, faceCU, bigWord, talkShot, netCard, at, crowd, span,
} from '../common';
import { S25 as Hub } from '../c03/shots';

// Chapter 4, the catch: day by day. Card payments and cash machines fail, shelves empty (just-in-time trucks; the
// three-day fact), planes stop (the 2024 crash), petrol queues, a pharmacy that can't see a prescription, boil-water
// notices, the shape of it, the sea cables that are fine; your phone at forty percent becomes worth something.

const DAY = StreetSet('day', { cars: false });
const SHOP0 = ShopSet(0.1);
const SHOP1 = ShopSet(0.75);
const KIT = KitchenSet(0.3);

export const S1 = netCard({ kicker: 'CHAPTER 4', title: 'DAY TWO', red: 0.2 });

// ---------- S2: the shop: Mum with a basket at the counter, the shopkeeper ----------
export const S2 = talkShot({
  Set: SHOP0, setT: 200,
  cast: [
    { look: MUM, x: 1300, y: shopHip(1.05), scale: 1.05, yaw: 0.5, faces: [[0, 'neutral']], pose: { armL: { a: 30, b: -60 } } },
    { look: N3, x: 1800, y: shopHip(1.05), scale: 1.05, yaw: -0.5, faces: [[0, 'worried']] },
  ],
  cam: { from: [1500, 520, 1.45], to: [1520, 520, 1.55] },
});

// ---------- S3: insert, the terminal: NO CONNECTION ----------
export const S3 = propCU({
  Bg: SHOP0,
  draw: (t) => (
    <g>
      <CardTerminal x={960} y={900} s={1.6} state={t < 10 ? 'idle' : 'error'} label={t < 10 ? 'CONNECTING' : 'NO CONNECTION'} t={t} />
      <BankCard x={1240} y={460} s={1.2} rot={-12} />
    </g>
  ),
});

// ---------- S4: a queue down the street to a cash machine: OUT OF SERVICE ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const q = crowd(8, 200, 1400, 21, { faceTo: 2400, expr: 'worried' });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1150]]), 560, 1.15)}>
      <DAY t={t + 2000} id="s4" />
      <rect x={1560} y={SUBURB.feet - 560} width={420} height={560} fill="#5A5248" />
      <CashMachine x={1770} y={SUBURB.feet - 60} s={0.9} t={t} />
      {q.map((c, i) => <Hero key={i} look={c.look} pose={{ ...basePose, x: c.x, y: c.y, scale: c.scale ?? 1, yaw: 0.5, expr: 'worried', look: 0.8, blink: idleBlink(t, i), armL: { a: 20, b: -20 } }} />)}
    </g>
  );
};

// ---------- S5: the shop, later: shelves stripped, two people grabbing the last tins ----------
export const S5 = talkShot({
  Set: SHOP1, setT: 400,
  cast: [
    { look: N1, x: 300, y: shopHip(1.05), scale: 1.05, yaw: -0.6, faces: [[0, 'worried']], pose: { armL: { a: 120, b: 20 } } },
    { look: N2, x: 760, y: shopHip(1.05), scale: 1.05, yaw: 0.6, faces: [[0, 'worried']], pose: { armR: { a: 110, b: 20 } } },
  ],
  cam: { from: [760, 520, 1.1], to: [800, 520, 1.18] },
});

// ---------- S6: the supply chain on the schematic: computer orders -> truck -> shop; then the orders stop ----------
const Truck: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#F6EFE3' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke={c} strokeWidth={6}>
    <rect x={-120} y={-80} width={160} height={90} rx={6} />
    <path d="M 40 -50 H 90 L 120 -20 V 10 H 40 Z" />
    <circle cx={-80} cy={20} r={18} /><circle cx={80} cy={20} r={18} />
  </g>
);
export const S6: React.FC<ShotProps> = ({ t }) => {
  const broken = t > 186;
  const tx = broken ? 960 : 520 + ((t * 6) % 880);
  return (
    <g>
      <Schematic t={t} id="supply" />
      {[['COMPUTER', 360], ['TRUCKS', 960], ['SHOP', 1560]].map(([label, x]) => (
        <g key={label as string}>
          <rect x={(x as number) - 170} y={400} width={340} height={200} rx={20} fill="#101A2A" stroke={broken && label !== 'SHOP' ? '#FF3A2A' : SCH.line} strokeWidth={5} />
          <text x={x as number} y={680} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#F6EFE3">{label}</text>
        </g>
      ))}
      <g fill="none" stroke={SCH.line} strokeWidth={6}>
        <rect x={300} y={440} width={120} height={80} rx={6} />
        <path d="M 340 540 H 380 M 360 520 V 540" />
        <rect x={1500} y={450} width={120} height={110} />
        <path d="M 1490 450 L 1560 420 L 1630 450" />
      </g>
      <Truck x={tx} y={520} c={broken ? '#7E8DA6' : '#F6EFE3'} />
      <path d="M 540 500 H 780 M 1140 500 H 1380" stroke={broken ? '#3A2A3A' : SCH.live} strokeWidth={8} strokeDasharray="18 14" strokeDashoffset={broken ? 0 : -t * 3} />
      {broken ? (
        <g transform={`translate(660 500) scale(${backOut(clamp((t - 186) / 8))})`}>
          <path d="M -50 -50 L 50 50 M 50 -50 L -50 50" stroke="#FF3A2A" strokeWidth={22} strokeLinecap="round" />
        </g>
      ) : null}
      {broken ? <text x={960} y={330} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FF3A2A">WHERE TO?</text> : null}
    </g>
  );
};

export const S7 = factCard({ value: 3, suffix: ' DAYS', label: 'IF TRUCKS STOP, GROCERY STORES RUN SHORT IN', sub: 'AMERICAN TRUCKING ASSOCIATIONS', format: (v) => String(Math.round(v)) });
export const S8 = bigWord({ word: 'DAY 3', color: '#F6EFE3', size: 220 });

// ---------- S9: the airport: a jet parked at the gate, the departures board all CANCELLED ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#9AB8D8" />
    <rect x={-400} y={700} width={2800} height={800} fill="#5A5A64" />
    <path d="M -400 820 H 2400" stroke="#E8E4D8" strokeWidth={10} strokeDasharray="60 40" />
    <Jet x={1300} y={680} s={1.1} />
    <g transform="translate(120 120)">
      <rect width={760} height={480} rx={14} fill="#101218" stroke="#2A2C34" strokeWidth={10} />
      <text x={30} y={70} fontFamily={FONT.ui} fontSize={40} fill="#FFD86A">DEPARTURES</text>
      {['LONDON', 'PARIS', 'TOKYO', 'NEW YORK', 'BERLIN', 'MADRID'].map((c, i) => (
        <g key={c}>
          <text x={30} y={140 + i * 58} fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3">{c}</text>
          <text x={430} y={140 + i * 58} fontFamily={FONT.ui} fontSize={34} fill={t > i * 5 ? '#FF4A3D' : '#5BE08A'}>{t > i * 5 ? 'CANCELLED' : 'ON TIME'}</text>
        </g>
      ))}
    </g>
  </g>
);

export const S10 = factCard({ value: 8.5, suffix: ' MILLION', label: 'COMPUTERS CRASHED BY ONE BAD UPDATE', sub: 'JULY 2024 · THOUSANDS OF FLIGHTS CANCELLED', format: (v) => v.toFixed(1) });
export const S11 = bigWord({ kicker: 'THAT WAS ONE UPDATE.', word: 'THIS IS EVERYTHING.', color: '#FF3A2A', size: 150 });

// ---------- S12: the petrol queue: cars nose to tail down the road to the one pump that takes cash ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 600], [len, 1700]]), 600, 1.0)}>
    <DAY t={t + 2200} id="s12" />
    {Array.from({ length: 9 }).map((_, i) => (
      <ModernCar key={i} x={-300 + i * 300} y={SUBURB.kerb + 230} s={0.62} color={['#C84A3A', '#3A6AB8', '#E8E4D8', '#5A8A5A', '#2A2C34', '#E8B04A'][i % 6]} lights={0} />
    ))}
    <PetrolPump x={2340} y={SUBURB.kerb + 240} s={0.95} sign="CASH ONLY" />
    <text x={1100} y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp((t - 60) / 8)}>2 KM</text>
  </g>
);

// ---------- S13: the pharmacy counter: Mo's grandma, the pharmacist shaking her head ----------
export const S13 = talkShot({
  Set: ShopSet(0.25), setT: 600,
  cast: [
    { look: GRAN, x: 1290, y: shopHip(1.0), scale: 1.0, yaw: 0.5, faces: [[0, 'worried']] },
    { look: NURSE, x: 1800, y: shopHip(1.05), scale: 1.05, yaw: -0.5, faces: [[0, 'worried']], pose: { headTilt: 6 } },
    { look: MO, x: 1080, y: shopHip(1.0), scale: 1.0, yaw: 0.5, faces: [[0, 'worried']] },
  ],
  cam: { from: [1450, 520, 1.45], to: [1470, 520, 1.55] },
});

// ---------- S14: insert, a small paper bag of pills and a hand-written note: 3 DAYS ----------
export const S14 = propCU({
  Bg: ShopSet(0.25),
  draw: () => (
    <g>
      <rect x={300} y={760} width={1320} height={400} fill="#7A4A3A" />
      <path d="M 640 760 V 420 L 680 380 H 900 L 940 420 V 760 Z" fill="#E8DCC0" stroke="#100E16" strokeWidth={6} />
      <rect x={700} y={520} width={180} height={140} rx={10} fill="#FFFFFF" stroke="#C83A3A" strokeWidth={6} />
      <path d="M 790 545 V 635 M 745 590 H 835" stroke="#C83A3A" strokeWidth={18} />
      <g transform="translate(1180 640) rotate(6)">
        <rect x={-180} y={-130} width={360} height={260} fill="#F8F4E6" stroke="#B8B0A0" strokeWidth={3} />
        <text y={-30} textAnchor="middle" fontFamily="Kalam, cursive" fontWeight={700} fontSize={70} fill="#2A2A6A">3 DAYS</text>
        <text y={60} textAnchor="middle" fontFamily="Kalam, cursive" fontSize={44} fill="#2A2A6A">rest: on paper</text>
      </g>
    </g>
  ),
});

export const S15 = propCU({ Bg: KIT, draw: (t) => <Tap x={860} y={560} s={1.5} t={t} /> });

// ---------- S16: a lamp post, a notice taped to it: BOIL YOUR WATER ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1000, 420, kf(t, [[0, 2.2], [len, 2.4]]))}>
    <DAY t={t + 2400} id="s16" />
    <Notice x={1000} y={kf(t, [[0, 360], [8, 420]])} s={0.55} lines={['BOIL', 'YOUR', 'WATER']} />
  </g>
);

export const S17 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'neutral'], [16, 'worried']], yaw: 0.2, zoom: [3.0, 3.2] });
export const S18 = Hub;
export const S19 = phoneCU({ mode: 'offline', text: 'Call failed', Bg: KIT, push: 0.08, battery: 45 });

// ---------- S20: the sea floor: the cable is fine; the pulses stop ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1.15]]))}>
    <SeaCable t={t} pulse={t < 234 ? 1 : 0} />
    {t > 140 ? (
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill={t < 234 ? '#5BE08A' : '#FF3A2A'} stroke="#0B0816" strokeWidth={10} paintOrder="stroke">
        {t < 234 ? 'THE CABLES ARE FINE' : 'THE CONNECTION IS GONE'}
      </text>
    ) : null}
  </g>
);

export const S21 = bigWord({ word: 'NOBODY KNOWS WHY.', color: '#F6EFE3', size: 140 });
export const S22 = phoneCU({ mode: 'battery', battery: 40, Bg: KIT, push: 0.1 });
export const S23 = faceCU({
  look: YOU, Bg: KIT, faces: [[0, 'neutral'], [20, 'shock']], yaw: 0.05, look_: 0.3, zoom: [2.6, 3.0], glint: 1,
  extra: (t) => <Smartphone x={1060} y={640} s={0.2} mode="home" t={t} battery={40} glow={1.2} status={false} />,
});
