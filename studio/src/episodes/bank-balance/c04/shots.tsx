import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, faceAt, FONT, Glow, SUBURB, walkPose, stand, CLS, Classroom, KITCHEN, KitchenIsland,
  islandTop, factCard, MONEY, BalanceOver, BalanceTag, ModernCar, DaySky, BusCabFront, Envelope,
} from '../../../engine';
import words from './words.json';
import {
  YOU, MO, MUM, ELLIE, DRIVER, RICH, QUIET, GRAN, N1, N2, N3, N4, KID, BUYER, StreetSet, KitchenSet, CabSet, faceCU, bigWord, balCU, people, at, crowd,
  span, handAt, Soft, talkShot, MoneyField,
} from '../common';

// Chapter 4, the catch: Mum is red, and never said a word; once you see it you can't stop; the bus driver at $41 on
// the 26th; three real numbers ($400, a trillion on credit cards, one in a hundred is a millionaire), each shown on the
// street; it changes you; Mo's number going down all week, half a sandwich. "Seeing it doesn't fix anything."

const KIT = KitchenSet(0.15);
const DAY = StreetSet('day');
const CLASSB: React.FC<{ t: number; id?: string }> = ({ t }) => <Classroom t={t} />;
const MU = stand(KITCHEN, 0.36, 0.4), ME = stand(KITCHEN, 0.66, 0.4), EL = stand(KITCHEN, 0.6, 0.4);
const MUMBAL = -6240;

// ---------- S1: the kitchen: Mum, and over her head a red number ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(MU.x + 60, 470, kf(t, [[0, 1.6], [len, 1.75]]))}>
    <KIT t={t + 400} id="s1" />
    {people(t, [{ look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.3 }, faces: [[0, 'happy']], bal: [[0, 0], [14, MUMBAL]], balPop: 2, balS: 0.75 }])}
    <KitchenIsland />
  </g>
);

// ---------- S2: minus six thousand, two hundred and forty dollars ----------
export const S2 = balCU({ bal: MUMBAL, Bg: KIT, s: 2.6 });

// ---------- S3: she's been buying you the good cereal ----------
const Cereal: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-50} y={-150} width={100} height={150} rx={6} fill="#F2C14E" stroke="#26232F" strokeWidth={5} />
    <circle cx={0} cy={-90} r={30} fill="#E8504A" />
    <text x={0} y={-30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={22} fill="#26232F">CRUNCH</text>
    <path d="M -10 -128 L 0 -142 L 10 -128" stroke="#FFF" strokeWidth={4} fill="none" />
  </g>
);
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const top = islandTop(0.5, 0.5);
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <KIT t={t + 450} id="s3" />
      {people(t, [
        { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.5, armR: { a: 70, b: -40 } }, faces: [[0, 'happy']], bal: MUMBAL, balS: 0.6 },
        { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.5 }, faces: [[0, 'worried']] },
      ])}
      <KitchenIsland />
      <Cereal x={top.x - 60} y={top.y} s={0.8} />
      <ellipse cx={top.x + 80} cy={top.y - 10} rx={56} ry={16} fill="#F4F0E6" stroke="#26232F" strokeWidth={4} />
    </g>
  );
};

// ---------- S4: she paid for Ellie's school trip last week ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 500, kf(t, [[0, 1.45], [len, 1.55]]))}>
    <KIT t={t + 500} id="s4" />
    {people(t, [
      { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.5, armR: { a: 80, b: -20 } }, faces: [[0, 'happy']], bal: [[0, -6040], [20, -6040], [30, MUMBAL]], balS: 0.6 },
      { look: ELLIE, pose: { x: EL.x, y: EL.y + 30, scale: EL.scale * 0.8, yaw: -0.5, armL: { a: 120, b: -20 } }, faces: [[0, 'happy']] },
    ])}
    <KitchenIsland />
    <g transform={`translate(${kf(t, [[0, MU.x + 120], [20, EL.x - 90]])} ${MU.y - 40}) rotate(-8)`}>
      <rect x={-50} y={-32} width={100} height={64} rx={4} fill="#F4F0E6" stroke="#26232F" strokeWidth={4} />
      <text x={0} y={8} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={20} fill="#2A5AB8">TRIP $200</text>
    </g>
  </g>
);

// ---------- S5: she never said a word ----------
export const S5 = faceCU({ look: MUM, Bg: KIT, faces: [[0, 'happy']], yaw: 0.25, zoom: [2.7, 2.85], bal: MUMBAL, balS: 0.55 });

// ---------- S6: and now you can't stop seeing it ----------
export const S6 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'worried']], yaw: -0.3, zoom: [3.1, 3.3], glint: 1, glintColor: MONEY.red });

// ---------- S7: that's the catch ----------
export const S7 = bigWord({ word: "THAT'S THE CATCH.", size: 150, color: MONEY.red, sub: "ONCE YOU SEE IT, YOU CAN'T STOP SEEING IT", Bg: ({ t }) => <MoneyField t={t} seed={13} /> });

// ---------- S8: the bus driver who always says good morning: $41, on the 26th ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(800, 560, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <CabSet t={t + 100} id="s8" />
      {people(t, [{ look: DRIVER, pose: { x: 700, y: 720, yaw: 0.35, armR: { a: 120 + Math.sin(t / 4) * 20, b: -40 } }, faces: [[0, 'happy']], bal: 41.08, balPop: 60 }])}
      <BusCabFront />
    </g>
    {/* the calendar chip */}
    <g transform={`translate(1700 150) scale(${backOut(clamp((t - 100) / 8))})`}>
      <rect x={-110} y={-90} width={220} height={190} rx={14} fill="#F4F0E6" stroke="#26232F" strokeWidth={6} />
      <rect x={-110} y={-90} width={220} height={54} rx={14} fill="#E8504A" />
      <text x={0} y={-50} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FFFFFF">MONTH</text>
      <text x={0} y={70} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#26232F">26</text>
    </g>
  </g>
);

// ---------- S9: almost four in ten US adults couldn't pay a surprise $400 bill in cash ----------
export const S9 = factCard({ value: 37, suffix: '%', label: "US ADULTS WHO COULDN'T PAY A SURPRISE $400 WITH CASH", sub: 'Federal Reserve, Economic Well-Being of U.S. Households (2024)' });

// ---------- S10: and you see it everywhere: small numbers, normal faces, smiles ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const folk = crowd(8, 140, 1780, 6, { expr: 'happy' });
  const vals = [12.4, 64, 3.1, 220, 27.9, 140, 8.5, 91];
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 520, 1.08)}>
      <DAY t={t + 1600} id="s10" />
      {people(t, folk.map((c, i) => ({ look: c.look, pose: { x: c.x, y: c.y, scale: c.scale, yaw: c.yaw ?? 0 }, faces: [[0, 'happy'] as [number, 'happy']], bal: vals[i], balPop: i * 3 })))}
    </g>
  );
};

// ---------- S11: Americans owe more than a trillion dollars on credit cards ----------
export const S11 = factCard({ value: 1.03, suffix: ' TRILLION', format: (v) => `$${v.toFixed(2)}`, label: 'OWED ON US CREDIT CARDS', sub: 'New York Fed, Household Debt and Credit Report (Q2 2023)' });

// ---------- S12: the nice car, the nice watch, the nice clothes: red ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 540, 1.3)}>
    <StreetSetNoCars t={t + 1700} />
    <ModernCar x={560} y={SUBURB.kerb + 110} s={1.0} color="#1A1A22" />
    {people(t, [
      { look: { ...N1, jacket: '#2A2A34', jacketShade: '#1E1E26', accent: '#FFD34A' }, pose: at(860, { yaw: 0.3, armL: { a: 30, b: -90 } }), faces: [[0, 'smug']], bal: -48200, balPop: 10, balS: 0.6 },
      { look: RICH, pose: at(1200, { yaw: -0.3 }), faces: [[0, 'cool']], bal: -23900, balPop: 26, balS: 0.6 },
    ])}
    <circle cx={808} cy={at(0).y - 60} r={9} fill="#FFD34A" stroke="#8A6A1A" strokeWidth={3} />
  </g>
);
const StreetSetNoCars = StreetSet('day', { cars: false });

// ---------- S13: only about one in a hundred adults on Earth is a millionaire ----------
export const S13 = factCard({ value: 1, suffix: ' IN 100', label: 'ADULTS ON EARTH WITH $1 MILLION OR MORE', sub: 'UBS, Global Wealth Report 2023' });

// ---------- S14: a busy street: past about a hundred grown-ups to find one ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const n = 11;
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <StreetSetNoCars t={t + 1800} />
      {Array.from({ length: n }).map((_, i) => {
        const dir = i % 2 ? -1 : 1;
        const x = ((((i * 197 + dir * t * 3.2) % 2200) + 2200) % 2200) - 140;
        const p = walkPose(x, t * 0.5 + i, SUBURB.feet, 0.95, {}, dir as 1 | -1);
        const hero = i === 5;
        const look = [N1, N2, N3, N4, GRAN, BUYER, KID, RICH][i % 8];
        return (
          <g key={i}>
            <Hero look={look} pose={{ ...p, blink: idleBlink(t, i) }} />
            {hero ? <Glow x={p.x} y={p.y - 300} r={200} kind="cool" o={0.6} /> : null}
            <BalanceOver pose={p} v={hero ? 1210000 : [42, 380, -900, 15, 2600, 77, -40, 610, 9, 1400, 33][i]} t={t} s={hero ? 0.6 : 0.45} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- S15: the man in the huge house at the end of your road: very red ----------
const Mansion: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <DaySky id="s15sky" horizonY={500} tod="day" />
    <rect x={-400} y={700} width={2800} height={800} fill="#5A8A4A" />
    <rect x={360} y={200} width={1200} height={560} fill="#F4F0E6" />
    <path d="M 320 210 L 960 40 L 1600 210 Z" fill="#8A5A4A" />
    {[460, 640, 820, 1100, 1280, 1460].map((x) => <rect key={x} x={x - 14} y={300} width={28} height={460} fill="#E2DCD0" />)}
    {[520, 700, 1180, 1360].map((x) => (
      <g key={x}>
        <rect x={x - 50} y={290} width={100} height={130} fill="#6E8AA8" stroke="#FFFFFF" strokeWidth={8} />
        <rect x={x - 50} y={500} width={100} height={130} fill="#6E8AA8" stroke="#FFFFFF" strokeWidth={8} />
      </g>
    ))}
    <rect x={900} y={520} width={120} height={240} fill="#3A2A20" />
    <rect x={-400} y={790} width={2800} height={40} fill="#C8C0B0" />
    <circle cx={230} cy={600} r={110} fill="#3E6A3A" />
    <circle cx={1700} cy={600} r={110} fill="#3E6A3A" />
  </g>
);
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.05], [len, 1.18]]))}>
    <Mansion t={t} />
    {people(t, [{ look: { ...N1, jacket: '#F4F0E6', jacketShade: '#D8D2C6' }, pose: { x: 960, y: 800 - 230 * 0.95, scale: 0.95, yaw: 0, armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 } }, faces: [[0, 'smug']], bal: [[0, -890000], [92, -890000], [100, -1890000]], balPop: 70, balS: 0.75 }])}
    {t > 92 ? <Glow x={960} y={240} r={420} kind="red" o={0.5} /> : null}
  </g>
);

// ---------- S16: the lady who sweeps the school yard: quietly, more than the head teacher ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const sweep = Math.sin(t / 7);
  const p: Pose = at(1000, { yaw: -0.4, armR: { a: 50 + sweep * 15, b: -40 }, armL: { a: 40 + sweep * 15, b: -60 } });
  const h = handAt({ ...basePose, ...p }, 'R');
  return (
    <g transform={camT(980, 520, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <StreetSetNoCars t={t + 1900} />
      {people(t, [
        { look: GRAN, pose: p, faces: [[0, 'happy']], bal: 310000, balPop: 60, balS: 0.6 },
        { look: { ...N1, jacket: '#2A3A5E', jacketShade: '#1F2C48' }, pose: at(1500, { yaw: -0.3 }), faces: [[0, 'cool']], bal: 18200, balPop: 92, balS: 0.5 },
      ])}
      <path d={`M ${h.x} ${h.y} L ${h.x - 120 + sweep * 30} ${SUBURB.feet}`} stroke="#8A6A3A" strokeWidth={10} strokeLinecap="round" />
      <path d={`M ${h.x - 160 + sweep * 30} ${SUBURB.feet} L ${h.x - 80 + sweep * 30} ${SUBURB.feet} L ${h.x - 100 + sweep * 30} ${SUBURB.feet - 40} Z`} fill="#C8A040" />
      <text x={1500} y={at(0).y - 330} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#F6EFE3" stroke="#0B0816" strokeWidth={5} paintOrder="stroke" opacity={clamp((t - 92) / 8)}>HEAD TEACHER</text>
    </g>
  );
};

// ---------- S17: it changes you: extra nice to a man because his number is big ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.55], [len, 1.65]]))}>
    <DAY t={t + 2000} id="s17" />
    {people(t, [
      { look: YOU, pose: at(760, { yaw: 0.45, armR: { a: 100, b: -20 }, armL: { a: 40, b: -20 }, tilt: 10 }), faces: [[0, 'happy']] },
      { look: { ...BUYER, jacket: '#2A2A34', jacketShade: '#1E1E26' }, pose: at(1160, { yaw: -0.45 }), faces: [[0, 'smug']], bal: 2400000, balS: 0.6 },
    ])}
  </g>
);

// ---------- S18: you stop listening to a girl in class because hers is small ----------
const G = stand(CLS, 0.58, 0.6), Y = stand(CLS, 0.78, 0.6);
export const S18 = talkShot({
  Set: CLASSB, words, setT: 600,
  cast: [
    { look: QUIET, x: G.x, y: G.y, scale: G.scale, yaw: 0.5, talk: [[68.4, 71.1]], faces: [[0, 'happy'], [70, 'worried']], bal: 14.2, balS: 0.5 },
    { look: YOU, x: Y.x, y: Y.y, scale: Y.scale, yaw: 0.6, look_: 0.9, faces: [[0, 'tired']] },
  ],
  cam: { from: [1100, 440, 1.25], to: [1100, 440, 1.32] },
});

// ---------- S19: you hate it; you can't switch it off ----------
export const S19 = faceCU({ look: YOU, Bg: CLASSB, faces: [[0, 'worried']], yaw: 0.2, zoom: [3.1, 3.3], glint: 1, glintColor: MONEY.red, pose: { headTilt: -6 } });

// ---------- S20: Mo's number goes down every day that week ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const days = ['MON', 'TUE', 'WED', 'THU'];
  const vals = [47.3, 31.1, 12.8, 3.05];
  const k = Math.min(3, Math.floor(t / 18));
  return (
    <g>
      <Soft blur={16} dim={0.45}>
        <g transform={camT(960, 520, 1.3)}>
          <DAY t={t + 2100} id="s20" />
        </g>
      </Soft>
      <BalanceTag x={960} y={600} v={vals[k]} s={2.4} t={t} flash={t % 18 < 6 && t > 6 ? 1 - (t % 18) / 6 : 0} />
      <text x={960} y={330} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} letterSpacing={12} fill="#F6EFE3">{"MO · " + days[k]}</text>
    </g>
  );
};

// ---------- S21: at lunch Mo pretends he isn't hungry; you give him half your sandwich ----------
const Sandwich: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -40 10 L 40 10 L 0 -40 Z" fill="#E8C890" stroke="#8A6A3A" strokeWidth={4} />
    <path d="M -34 4 L 34 4" stroke="#5BC08A" strokeWidth={6} />
  </g>
);
const M2 = stand(CLS, 0.46, 0.6), Y2 = stand(CLS, 0.68, 0.6);
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const give = clamp((t - 60) / 20);
  const hy: Pose = { ...basePose, x: Y2.x, y: Y2.y, scale: Y2.scale, yaw: -0.5, armR: { a: 30 + give * 60, b: -30 } };
  const h = handAt(hy, 'R');
  return (
    <g transform={camT(1000, 440, kf(t, [[0, 1.25], [len, 1.32]]))}>
      <CLASSB t={t + 700} />
      {people(t, [
        { look: MO, pose: { x: M2.x, y: M2.y, scale: M2.scale, yaw: 0.5, armL: { a: 20, b: -10 }, armR: { a: 20 + give * 50, b: -20 } }, faces: [[0, 'cool'], [80, 'worried']], bal: 3.05, balS: 0.5 },
        { look: YOU, pose: hy, faces: [[0, 'worried']] },
      ])}
      <Sandwich x={h.x} y={h.y - 10} s={Y2.scale * 0.9} />
    </g>
  );
};

// ---------- S22: neither of you says anything. Seeing it doesn't fix anything ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1000, 440, kf(t, [[0, 1.15], [len, 1.35]]))}>
    <CLASSB t={t + 900} />
    {people(t, [
      { look: MO, pose: { x: M2.x, y: M2.y, scale: M2.scale, yaw: 0.2, armR: { a: 90, b: -110 } }, faces: [[0, 'tired']], bal: 3.05, balS: 0.5 },
      { look: YOU, pose: { x: Y2.x, y: Y2.y, scale: Y2.scale, yaw: -0.2, look: -0.5 }, faces: [[0, 'tired']] },
    ])}
  </g>
);
