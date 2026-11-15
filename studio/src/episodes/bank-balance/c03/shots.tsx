import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, faceAt, FONT, Glow, SUBURB, walkPose, stand, CLS, Classroom, BEDROOM, Bedroom, WINDOW,
  KITCHEN, KitchenIsland, PIZZA, pizzaHip, PizzaTable, MONEY, BalanceOver, BalanceTag,
} from '../../../engine';
import words from './words.json';
import {
  YOU, MO, MUM, TEACHER, KID, QUIET, BUYER, BRO, NEIGHBOUR, WAITER, N1, N2, N3, N4, GRAN, StreetSet, KitchenSet, PizzaSet, faceCU, bigWord, balCU,
  phoneCU, moneyCard, people, at, crowd, span, handAt, Soft, talkShot,
} from '../common';

// Chapter 3, the fun part: guess the number in class (the teacher, the trainers, the quiet girl); the bike sale; Mo
// finds out and checks his app; his brother pays up; payday at midnight; the waiter's tips and the table that left
// nothing; the car boot sale and Mo's business plan; then you look at your mum and stop laughing.

const DAY = StreetSet('day');
const NIGHT = StreetSet('night', { cars: true, lit: 0.35 });
const NIGHTLIT = StreetSet('night', { cars: true, lit: 0.9 });
const KIT = KitchenSet(0.12);
const CLASSB: React.FC<{ t: number; id?: string }> = ({ t }) => <Classroom t={t} />;

export const S1 = moneyCard({ kicker: 'CHAPTER 3', title: 'THE FUN PART', seed: 7 });

// ---------- S2: class: you lean over to Mo: guess the number ----------
const A = stand(CLS, 0.62, 0.62), B = stand(CLS, 0.8, 0.62);
export const S2 = talkShot({
  Set: CLASSB, words, setT: 100,
  cast: [
    { look: YOU, x: A.x, y: A.y, scale: A.scale, yaw: 0.5, talk: [[3.0, 5.2]], faces: [[0, 'smug']] },
    { look: MO, x: B.x, y: B.y, scale: B.scale, yaw: -0.5, faces: [[0, 'neutral'], [40, 'happy']] },
  ],
  cam: { from: [1180, 520, 1.55], to: [1180, 520, 1.65] },
});

// ---------- S3: the teacher who drives the tiny old car: $41,000 saved ----------
const T = stand(CLS, 0.3, 0.3);
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(T.x + 60, 460, kf(t, [[0, 1.6], [len, 1.72]]))}>
    <Classroom t={t + 200} board={<text x={740} y={360} textAnchor="middle" fontFamily="Kalam, cursive" fontWeight={700} fontSize={90} fill="#F6EFE3">FRACTIONS</text>} />
    {people(t, [{ look: TEACHER, pose: { x: T.x, y: T.y, scale: T.scale, yaw: 0.3, armR: { a: 130, b: -20 }, handR: 'point' }, faces: [[0, 'neutral']], bal: 41000, balPop: 68 }])}
    {/* the tiny old car, a thought */}
    <g transform={`translate(${T.x + 330} 250) scale(${backOut(clamp((t - 10) / 10))})`}>
      <ellipse cx={0} cy={0} rx={150} ry={90} fill="#F6EFE3" stroke="#26232F" strokeWidth={6} />
      <path d="M -80 30 L -70 -10 Q -40 -40 20 -40 Q 60 -40 80 0 L 90 30 Z" fill="#9AC8A0" stroke="#26232F" strokeWidth={5} />
      <circle cx={-45} cy={34} r={16} fill="#26232F" />
      <circle cx={55} cy={34} r={16} fill="#26232F" />
    </g>
  </g>
);

// ---------- S4: the kid with the expensive trainers: red ----------
const K = stand(CLS, 0.5, 0.55);
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(K.x, 470, kf(t, [[0, 1.55], [len, 1.65]]))}>
    <CLASSB t={t + 300} />
    {people(t, [{ look: { ...KID, shoe: '#F2F2F2' }, pose: { x: K.x, y: K.y, scale: K.scale, yaw: 0.2, legR: { a: -10, b: 0 } }, faces: [[0, 'cool']], bal: -240, balPop: 70 }])}
    {/* sparkle on the trainers */}
    {[0, 1].map((i) => (
      <path key={i} d="M 0 -18 L 5 -5 L 18 0 L 5 5 L 0 18 L -5 5 L -18 0 L -5 -5 Z" fill="#FFF3A0" transform={`translate(${K.x + (i ? 40 : -30)} ${K.y + 230 * K.scale}) scale(${0.6 + 0.4 * Math.sin(t / 4 + i * 2)})`} />
    ))}
  </g>
);

// ---------- S5: the quiet girl at the back in the same jumper: $230,000 ----------
const Q = stand(CLS, 0.14, 0.2);
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(Q.x + 40, 470, kf(t, [[0, 1.9], [len, 2.1]]))}>
    <CLASSB t={t + 400} />
    {people(t, [{ look: QUIET, pose: { x: Q.x, y: Q.y, scale: Q.scale, yaw: 0.3, look: 0.5, headTilt: 6 }, faces: [[0, 'neutral']], bal: 230000, balPop: 98 }])}
  </g>
);

// ---------- S6: you have no idea why; you decide not to ask ----------
export const S6 = faceCU({ look: YOU, Bg: CLASSB, faces: [[0, 'shock'], [44, 'oops']], yaw: 0.3, zoom: [3.0, 3.2] });

// ---------- S7: you put your old bike up for sale ----------
export const S7 = phoneCU({ mode: 'listing', text: 'Old bike for sale|$150', Bg: DAY, push: 0.1, time: '16:20' });

// ---------- S8: a man comes to look at it: "Best I can do is fifty" ----------
const Bike: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke="#26232F" strokeWidth={10} strokeLinecap="round">
    <circle cx={-90} cy={-60} r={60} />
    <circle cx={90} cy={-60} r={60} />
    <path d="M -90 -60 L -30 -150 L 60 -150 L 90 -60 M -30 -150 L 0 -60 L 60 -150 M -45 -175 H -10 M 60 -150 L 45 -185 H 80" stroke="#E8504A" strokeWidth={12} />
  </g>
);
const buyerLine = span(words, 'Best', 'fifty');
export const S8 = talkShot({
  Set: DAY, words, setT: 900,
  cast: [
    { look: YOU, x: 700, y: at(0).y, yaw: 0.45, faces: [[0, 'neutral']] },
    { look: BUYER, x: 1240, y: at(0).y, yaw: -0.45, talk: [buyerLine], faces: [[0, 'neutral'], [60, 'worried']] },
  ],
  cam: { from: [970, 560, 1.5], to: [970, 560, 1.6] },
  front: () => <Bike x={960} y={SUBURB.feet + 4} s={1.1} />,
});

// ---------- S9: his number says nine thousand ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1240, 430, kf(t, [[0, 2.3], [len, 2.45]]))}>
    <DAY t={t + 960} id="s9" />
    {people(t, [{ look: BUYER, pose: at(1240, { yaw: -0.45 }), faces: [[0, 'worried']], bal: 9000, balPop: 18, balS: 0.75 }])}
  </g>
);

// ---------- S10: you say a hundred and twenty; he pays ----------
const meLine = span(words, 'hundred', 'twenty');
export const S10: React.FC<ShotProps> = ({ t, len, f }) => {
  const pay = clamp((t - 46) / 12);
  const buyer: Partial<Pose> = { ...at(1180, { yaw: -0.45, armR: { a: 20 + pay * 60, b: -20 } }) };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.55], [len, 1.62]]))}>
      <DAY t={t + 1000} id="s10" />
      {people(t, [
        { look: YOU, pose: at(760, { yaw: 0.45, armR: { a: 20 + pay * 50, b: -30 } }), faces: [[0, 'smug']] },
        { look: BUYER, pose: buyer, faces: [[0, 'oops'], [46, 'neutral']], bal: [[0, 9000], [56, 9000], [66, 8880]], balS: 0.55 },
      ], f, words, { 0: [meLine] })}
      <Bike x={960} y={SUBURB.feet + 4} s={1.1} />
      {pay > 0 ? (
        <g transform={`translate(${kf(t, [[46, 1100], [58, 900]])} ${at(0).y - 40}) rotate(-10)`} opacity={pay}>
          <rect x={-46} y={-22} width={92} height={44} rx={5} fill="#5FBF7A" stroke="#2E7A48" strokeWidth={4} />
          <rect x={-40} y={-30} width={92} height={44} rx={5} fill="#6FD08A" stroke="#2E7A48" strokeWidth={4} />
        </g>
      ) : null}
    </g>
  );
};

// ---------- S11: Mo figures it out: "How did you know that?" ----------
const moHow = span(words, 'How', 'that');
export const S11 = talkShot({
  Set: DAY, words, setT: 1100,
  cast: [
    { look: MO, x: 760, y: at(0).y, yaw: 0.45, talk: [moHow], faces: [[0, 'neutral'], [70, 'shock']], pose: { armL: { a: 60, b: -90 }, armR: { a: 60, b: -90 } } },
    { look: YOU, x: 1120, y: at(0).y, yaw: -0.45, faces: [[0, 'smug'], [110, 'neutral']] },
  ],
  cam: { from: [940, 560, 1.6], to: [940, 560, 1.75] },
});

// ---------- S12: he doesn't believe you, so you prove it ----------
export const S12: React.FC<ShotProps> = ({ t, len, f }) => (
  <g transform={camT(960, 500, kf(t, [[0, 1.55], [len, 1.62]]))}>
    <DAY t={t + 1200} id="s12" />
    {people(t, [
      { look: MO, pose: at(820, { yaw: 0.45, armL: { a: 70, b: -110 }, armR: { a: 70, b: -110 } }), faces: [[0, 'smug']] },
      { look: YOU, pose: at(1110, { yaw: -0.45, armR: { a: 100, b: -10 }, handR: 'point' }), faces: [[0, 'neutral'], [50, 'cool']], bal: undefined },
    ], f, words, { 1: [[44.5, 46.6]] })}
    <BalanceTag x={820} y={300} v={47.3} s={0.9} pop={(t - 60) / 8} t={t} text="$47.30?" color={MONEY.zero} />
  </g>
);

// ---------- S13: he checks the app: $47.30 ----------
export const S13 = phoneCU({ mode: 'bank', text: '$47.30|Current account', Bg: DAY, push: 0.12, time: '17:05', from: 'left' });

// ---------- S14: Mo goes very quiet: "Okay. Do my brother." ----------
const moOk = span(words, 'Okay', 'brother');
export const S14 = faceCU({ look: MO, Bg: DAY, faces: [[0, 'shock'], [40, 'smug']], yaw: -0.25, zoom: [2.9, 3.1], words, talk: moOk });

// ---------- S15: his big brother swears he's broke; you point; he pays ----------
const broLine: [number, number] = [52.7, 55.9];
export const S15: React.FC<ShotProps> = ({ t, len, f }) => {
  const point = clamp((t - 140) / 8);
  const pays = clamp((t - 200) / 10);
  return (
    <g transform={camT(980, 540, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <DAY t={t + 1300} id="s15" />
      {people(t, [
        { look: MO, pose: at(560, { yaw: 0.4 }), faces: [[0, 'neutral'], [160, 'happy']] },
        { look: YOU, pose: at(800, { yaw: 0.45, armR: { a: 20 + point * 120, b: -10 * point }, handR: point > 0.5 ? 'point' : 'open' }), faces: [[0, 'neutral'], [140, 'smug']] },
        { look: BRO, pose: at(1280, { yaw: -0.45, armL: { a: 50 + Math.sin(t / 6) * 10, b: -60 }, armR: { a: 20 + pays * 60, b: -20 } }), faces: [[0, 'cool'], [150, 'oops']], bal: [[150, 1340.2], [210, 1340.2], [222, 1320.2]], balPop: 148 },
      ], f, words, { 2: [broLine] })}
      {pays > 0 ? (
        <g transform={`translate(${kf(t, [[200, 1210], [214, 900]])} ${at(0).y - 40}) rotate(8)`} opacity={pays}>
          <rect x={-46} y={-22} width={92} height={44} rx={5} fill="#6FD08A" stroke="#2E7A48" strokeWidth={4} />
        </g>
      ) : null}
    </g>
  );
};

// ---------- S16: Friday night: you can't sleep; you look out of the window ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const p = stand(BEDROOM, 0.78, 0.25);
  return (
    <g transform={camT(1180, 500, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Bedroom t={t} id="s16" veil={0.5} clock="23:59" lamp={0} />
      {people(t, [{ look: YOU, pose: { x: p.x, y: p.y, scale: p.scale, yaw: 0.9, look: 0.8 }, faces: [[0, 'tired']] }])}
      <Glow x={(WINDOW.x0 + WINDOW.x1) / 2} y={(WINDOW.y0 + WINDOW.y1) / 2} r={260} kind="cool" o={0.35} />
    </g>
  );
};

// ---------- S17: a neighbour walks home; midnight: his number jumps by two thousand ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 520], [len, 1240]]);
  const p = walkPose(x, t * 0.45, SUBURB.feet, 1, {}, 1);
  const jump = 112;
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 1120]]), 520, 1.45)}>
      <NIGHT t={t + 200} id="s17" />
      <Hero look={NEIGHBOUR} pose={{ ...p, expr: t > jump + 6 ? 'happy' : 'tired', blink: idleBlink(t, 3) }} />
      <BalanceOver pose={p} v={t < jump ? 412.06 : 2412.06} flash={t >= jump && t < jump + 12 ? 1 - (t - jump) / 12 : 0} t={t} s={0.7} />
      {t >= jump ? <text x={p.x + 120} y={p.y - 360 - (t - jump) * 1.5} fontFamily={FONT.title} fontWeight={800} fontSize={48} fill={MONEY.green} opacity={clamp(1 - (t - jump - 20) / 20)} stroke="#0B0816" strokeWidth={6} paintOrder="stroke">+$2,000</text> : null}
      <g transform={`translate(${kf(t, [[0, 760], [len, 1120]]) + 520} 120)`}>
        <rect x={-120} y={-44} width={240} height={88} rx={14} fill="#0B0816" opacity={0.7} />
        <text x={0} y={22} textAnchor="middle" fontFamily={FONT.ui} fontSize={56} fill={t >= jump ? MONEY.green : '#F6EFE3'}>{t >= jump ? '00:00' : '23:59'}</text>
      </g>
    </g>
  );
};

// ---------- S18: PAYDAY ----------
export const S18 = bigWord({ word: 'PAYDAY', size: 260, color: MONEY.green, Bg: NIGHT });

// ---------- S19: all along the road, in every dark window, numbers going up ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 420, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <NIGHTLIT t={t + 300} id="s19" />
    {[180, 520, 760, 1110, 1380, 1700].map((x, i) => (
      <BalanceTag key={i} x={x} y={300 + (i % 2) * 230} v={i % 3 === 2 ? -1200 + Math.min(1, t / (30 + i * 9)) * 2100 : 300 + Math.min(1, t / (30 + i * 9)) * 2000 + i * 410} s={0.55} t={t + i * 30} pop={(t - i * 6) / 8} />
    ))}
  </g>
);

// ---------- S20: pizza with Mo and his mum; the waiter's number ticks up with every tip ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1500], [len, 1260]]);
  return (
    <g transform={camT(980, 520, kf(t, [[0, 1.2], [len, 1.28]]))}>
      <PizzaSet t={t} id="s20" />
      {people(t, [
        { look: MUM, pose: { x: 560, y: pizzaHip(1), yaw: 0.5 }, faces: [[0, 'happy']] },
        { look: MO, pose: { x: 780, y: pizzaHip(1), yaw: 0.4 }, faces: [[0, 'happy']] },
        { look: YOU, pose: { x: 1000, y: pizzaHip(1), yaw: 0.4, look: 0.9 }, faces: [[0, 'smug']] },
        { look: WAITER, pose: { x, y: pizzaHip(1), yaw: -0.4, armR: { a: 150, b: -30 } }, faces: [[0, 'happy']], bal: [[0, 61.4], [40, 61.4], [48, 64.4], [90, 64.4], [98, 69.4], [140, 69.4], [148, 71.9]], balS: 0.7 },
      ])}
      <PizzaTable x={780} w={760} />
    </g>
  );
};

// ---------- S21: the table that left nothing at all: six figures ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 500, kf(t, [[0, 1.6], [len, 1.72]]))}>
    <PizzaSet t={t + 300} id="s21" />
    {people(t, [
      { look: { ...N1, jacket: '#2A2A34', jacketShade: '#1E1E26' }, pose: { x: 820, y: pizzaHip(1), yaw: -0.5 }, faces: [[0, 'smug']], bal: 412000, balPop: 56, balS: 0.7 },
      { look: { ...N2, jacket: '#E8E4D8', jacketShade: '#C8C2B6' }, pose: { x: 1080, y: pizzaHip(1), yaw: -0.5 }, faces: [[0, 'cool']] },
    ])}
    <PizzaTable x={960} w={700} slices={0} />
    <g transform={`translate(960 ${PIZZA.table - 16})`}>
      <rect x={-60} y={-8} width={120} height={14} rx={3} fill="#F4F0E6" />
      <text x={0} y={-16} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={30} fill="#B8323A" opacity={clamp((t - 10) / 8)}>TIP: $0</text>
    </g>
  </g>
);

// ---------- S22: Saturday, the car boot sale: you and Mo never overpay ----------
const Table: React.FC<{ x: number }> = ({ x }) => (
  <g>
    <rect x={x - 200} y={SUBURB.feet - 150} width={400} height={20} fill="#C8A070" />
    <rect x={x - 190} y={SUBURB.feet - 130} width={14} height={130} fill="#8A6A4A" />
    <rect x={x + 176} y={SUBURB.feet - 130} width={14} height={130} fill="#8A6A4A" />
    {['#E8504A', '#4AA8E0', '#F2C14E', '#5BC08A', '#B07AD0'].map((c, i) => (
      <rect key={i} x={x - 180 + i * 72} y={SUBURB.feet - 150 - 30 - (i % 2) * 20} width={56} height={30 + (i % 2) * 20} rx={6} fill={c} stroke="#26232F" strokeWidth={4} />
    ))}
  </g>
);
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 880], [len, 1040]]), 540, 1.3)}>
    <DAY t={t + 1500} id="s22" />
    {people(t, [
      { look: GRAN, pose: at(560, { yaw: 0.4 }), faces: [[0, 'smug']], bal: 52300, balS: 0.55 },
      { look: N3, pose: at(1450, { yaw: -0.4 }), faces: [[0, 'neutral']], bal: 8800, balS: 0.55 },
      { look: YOU, pose: at(900, { yaw: -0.4, armR: { a: 60, b: -40 } }), faces: [[0, 'smug']] },
      { look: MO, pose: at(1090, { yaw: 0.4 }), faces: [[0, 'cool']] },
    ])}
    <Table x={560} />
    <Table x={1450} />
  </g>
);

// ---------- S23: Mo's business plan; you laugh ----------
const moPlan = span(words, 'We', 'money');
export const S23 = talkShot({
  Set: DAY, words, setT: 1600,
  cast: [
    { look: MO, x: 780, y: at(0).y, yaw: 0.45, talk: [moPlan], faces: [[0, 'happy']], pose: { armL: { a: 120, b: -30 } } },
    { look: YOU, x: 1140, y: at(0).y, yaw: -0.45, faces: [[0, 'neutral'], [90, 'happy']] },
  ],
  cam: { from: [960, 560, 1.6], to: [960, 560, 1.7] },
});

// ---------- S24: Sunday morning, the kitchen: you, still laughing, turn to your mum ----------
const MU = stand(KITCHEN, 0.32, 0.4), ME = stand(KITCHEN, 0.68, 0.4);
export const S24 = talkShot({
  Set: KIT, setT: 300,
  cast: [
    { look: MUM, x: MU.x, y: MU.y, scale: MU.scale, yaw: -0.8, faces: [[0, 'happy']] },
    { look: YOU, x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.3, faces: [[0, 'happy'], [80, 'neutral']] },
  ],
  cam: { from: [960, 560, 1.3], to: [960, 560, 1.4] },
  front: () => <KitchenIsland />,
});

// ---------- S25: and you stop laughing ----------
export const S25 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'happy'], [10, 'shock']], yaw: -0.3, zoom: [3.2, 3.5], glint: 1, glintColor: MONEY.red });
