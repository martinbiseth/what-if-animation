import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, faceAt, FONT, Glow, CardTerminal, BankCard, SUBURB, shopHip, TitleCard,
  Schematic, SCH, BalanceTag, MONEY, fmtMoney, walkPose,
} from '../../../engine';
import words from './words.json';
import {
  YOU, MUM, N1, N2, N3, N4, GRAN, KID, BUYER, StreetSet, ShopSet, faceCU, bigWord, balCU, listCard, moneyCard, people, at, crowd, MoneyField, Soft,
} from '../common';

// Chapter 2, the premise and its rules: one Monday morning everyone has a number over their head; what it counts
// (bank and savings minus debts; not cash, a house or a car); green and red; it updates live (a card tap); the rules:
// only in real life, only you, and never your own (the mirror, the shop window: planted for the cliffhanger); title.

const MORNING = StreetSet('morning');
const DAY = StreetSet('day');
const SHOPS = ShopSet(0);

export const S1 = moneyCard({ kicker: 'CHAPTER 2', title: 'THE NUMBERS', seed: 5 });

// ---------- S2: Monday morning, the street: numbers pop over every head, one by one ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const folk = crowd(8, 140, 1780, 2, { expr: 'neutral', skip: [4] });
  const vals = [2310.55, -740, 58200, 19.99, 0, 1250, -18300, 430];
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 520, kf(t, [[0, 1.12], [len, 1.04]]))}>
      <MORNING t={t + 500} id="s2" />
      {people(t, [
        ...folk.map((c, i) => ({ look: c.look, pose: { x: c.x, y: c.y, scale: c.scale, yaw: c.yaw ?? 0 }, bal: vals[i], balPop: 14 + i * 7 })),
        { look: YOU, pose: at(960, { yaw: 0, look: 0 }), faces: [[0, 'shock'] as [number, 'shock']] },
      ])}
    </g>
  );
};

// ---------- S3: what it counts: the sum on the schematic ----------
const Row: React.FC<{ t: number; at: number; y: number; sign: string; label: string; value: number; col: string }> = ({ t, at, y, sign, label, value, col }) => {
  const p = backOut(clamp((t - at) / 8));
  return (
    <g transform={`translate(420 ${y}) scale(${p})`} opacity={clamp((t - at) / 4)}>
      <text x={0} y={0} fontFamily={FONT.title} fontWeight={800} fontSize={86} fill={col}>{sign}</text>
      <text x={90} y={0} fontFamily={FONT.title} fontWeight={700} fontSize={70} fill="#F6EFE3">{label}</text>
      <text x={1080} y={0} textAnchor="end" fontFamily={FONT.ui} fontSize={60} fill={col}>{fmtMoney(value)}</text>
    </g>
  );
};
export const S3: React.FC<ShotProps> = ({ t }) => {
  const total = clamp((t - 120) / 10);
  return (
    <g>
      <Schematic t={t} id="s3" />
      <text x={960} y={190} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill={SCH.dim}>THE NUMBER =</text>
      <Row t={t} at={36} y={360} sign="+" label="BANK ACCOUNT" value={1840} col={MONEY.green} />
      <Row t={t} at={64} y={490} sign="+" label="SAVINGS" value={6200} col={MONEY.green} />
      <Row t={t} at={100} y={620} sign="−" label="DEBTS" value={-5300} col={MONEY.red} />
      <path d="M 420 680 H 1500" stroke={SCH.dim} strokeWidth={6} opacity={total} />
      <BalanceTag x={1250} y={860} v={2740} s={1.6} pop={total} t={t} />
    </g>
  );
};

// ---------- S4: what it doesn't count: cash, a house, a car ----------
export const S4 = listCard({
  title: "IT DOESN'T COUNT",
  items: [
    { at: 16, text: 'CASH UNDER THE MATTRESS', ok: false },
    { at: 56, text: 'A HOUSE', ok: false },
    { at: 74, text: 'A CAR', ok: false },
    { at: 104, text: 'BANK MONEY ONLY', ok: true, hot: true },
  ],
});

// ---------- S5: green if they have money ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 500, kf(t, [[0, 1.9], [len, 2.0]]))}>
    <DAY t={t + 600} id="s5" />
    {people(t, [{ look: N4, pose: at(960, { yaw: 0.2 }), faces: [[0, 'happy']], bal: 12480, balPop: 2, balS: 0.75 }])}
    <Glow x={960} y={260} r={300} kind="cool" o={0.3} />
  </g>
);

// ---------- S6: red if they owe more than they own ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 500, kf(t, [[0, 1.9], [len, 2.0]]))}>
    <DAY t={t + 700} id="s6" />
    {people(t, [{ look: N1, pose: at(960, { yaw: -0.2 }), faces: [[0, 'worried']], bal: -8900, balPop: 2, balS: 0.75 }])}
    <Glow x={960} y={260} r={300} kind="red" o={0.4} />
  </g>
);

// ---------- S7: it updates live, to the cent ----------
export const S7 = balCU({ bal: [[0, 523.4], [12, 523.4], [16, 523.41], [28, 523.41], [32, 519.91], [44, 519.91], [48, 1519.91]], cents: true, label: 'LIVE, TO THE CENT', Bg: DAY });

// ---------- S8: somebody taps a card, and you watch the number drop ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const tap = 26;
  const reach = clamp((t - 10) / 14);
  return (
    <g transform={camT(1380, 500, kf(t, [[0, 1.55], [len, 1.65]]))}>
      <SHOPS t={t + 200} id="s8" />
      {people(t, [
        { look: N2, pose: { x: 1340, y: shopHip(1), yaw: 0.5, armR: { a: 40 + reach * 60, b: -30 * (1 - reach) } }, faces: [[0, 'neutral']], bal: [[0, 86.2], [tap + 6, 86.2], [tap + 26, 42.7]], balS: 0.75 },
      ])}
      <BankCard x={1340 + 70 + reach * 70} y={shopHip(1) - 90 - reach * 50} s={0.5} rot={-20} />
      {t > tap + 4 ? <text x={1600} y={480} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={MONEY.red} stroke="#0B0816" strokeWidth={6} paintOrder="stroke" opacity={clamp((t - tap - 4) / 4)}>-$43.50</text> : null}
    </g>
  );
};

// ---------- S9: the rules: real life only ----------
export const S9 = bigWord({ kicker: 'THE RULES', word: 'REAL LIFE ONLY', size: 160, color: MONEY.green, Bg: ({ t }) => <MoneyField t={t} /> });

// ---------- S10: not on TV, not in photos, not on video calls ----------
export const S10 = listCard({
  items: [
    { at: 2, text: 'NOT ON TV', ok: false },
    { at: 24, text: 'NOT IN PHOTOS', ok: false },
    { at: 48, text: 'NOT ON VIDEO CALLS', ok: false },
  ],
});

// ---------- S11: only you can see it ----------
export const S11 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'neutral'], [8, 'smug']], yaw: -0.2, zoom: [3.0, 3.2], glint: 1, glintColor: MONEY.green });

// ---------- S12: and never your own: you in the bathroom mirror, no number over your head ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const face = faceAt(t, [[0, 'neutral'], [40, 'worried'], [80, 'oops']]);
  const me: Pose = { ...basePose, x: 960, y: 900, scale: 2.1, yaw: 0, look: 0, ...face, blink: Math.max(face.blink, idleBlink(t, 2)), headTilt: Math.sin(t / 10) * 8 };
  const q = clamp((t - 30) / 10);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#CFE0E6" />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${-400 + i * 240} -400 V 1500`} stroke="#B8CCD4" strokeWidth={4} />)}
      {Array.from({ length: 8 }).map((_, i) => <path key={`h${i}`} d={`M -400 ${i * 160} H 2400`} stroke="#B8CCD4" strokeWidth={4} />)}
      <rect x={520} y={90} width={880} height={820} rx={60} fill="#E8EEF2" stroke="#8A9AA6" strokeWidth={22} />
      <clipPath id="s12m"><rect x={540} y={110} width={840} height={780} rx={46} /></clipPath>
      <g clipPath="url(#s12m)">
        <rect x={540} y={110} width={840} height={780} fill="#B8D0DA" />
        <Hero look={YOU} pose={me} shadow={0} />
        <path d="M 600 160 L 760 160 L 600 420 Z" fill="#FFFFFF" opacity={0.25} />
        {/* where the number should be: a dashed empty chip and a question mark */}
        <g opacity={q} transform="translate(960 250)">
          <rect x={-150} y={-62} width={300} height={84} rx={42} fill="none" stroke="#5A6A76" strokeWidth={6} strokeDasharray="18 14" />
          <text x={0} y={2} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#5A6A76">?</text>
        </g>
      </g>
      <rect x={400} y={930} width={1120} height={60} rx={20} fill="#F4F6F8" />
    </g>
  );
};

// ---------- S13: not in a shop window: everyone behind you reflected with a number; you, none ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const folk = crowd(5, 260, 1660, 9, { expr: 'neutral', skip: [2] });
  const vals = [330, -2450, 71000, 18.2];
  return (
    <g>
    <g transform={camT(960, 520, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <DAY t={t + 800} id="s13" />
      {/* the reflection in the glass: people behind you, each with a number, and you with none */}
      <g opacity={0.9}>
        {people(t, [
          ...folk.map((c, i) => ({ look: c.look, pose: { x: c.x, y: c.y - 30, scale: (c.scale ?? 1) * 0.85, yaw: -(c.yaw ?? 0) }, bal: vals[i], balS: 0.55 })),
          { look: YOU, pose: at(960, { yaw: 0, look: 0, scale: 1.05 }), faces: [[0, 'worried'] as [number, 'worried']] },
        ])}
      </g>
      {/* the glass: a cool sheen, a frame, the shop's name */}
      <rect x={-400} y={-400} width={2800} height={1900} fill="#8AB8D8" opacity={0.28} />
      <path d="M 200 0 L 520 0 L 0 900 L -200 900 Z" fill="#FFFFFF" opacity={0.12} />
      <path d="M 1300 0 L 1420 0 L 900 1080 L 780 1080 Z" fill="#FFFFFF" opacity={0.1} />
    </g>
      <path d="M -10 -10 H 1930 V 1090 H -10 Z M 50 120 H 1870 V 1030 H 50 Z" fill="#2A3A4A" fillRule="evenodd" />
      <text x={960} y={84} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} fill="#F2D08A" letterSpacing={14}>CORNER SHOP</text>
      <g transform="translate(960 250)" opacity={clamp((t - 20) / 10)}>
        <rect x={-150} y={-62} width={300} height={84} rx={42} fill="none" stroke="#F6EFE3" strokeWidth={6} strokeDasharray="18 14" />
        <text x={0} y={2} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3">?</text>
      </g>
    </g>
  );
};

// ---------- S14: remember that ----------
export const S14 = bigWord({ word: 'REMEMBER THAT.', size: 170, color: MONEY.red, sub: 'IT MATTERS LATER', Bg: ({ t }) => <MoneyField t={t} seed={8} /> });

// ---------- S15: the title over the floating numbers ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [Math.max(1, len), 1.08]]))}>
      <MoneyField t={t + 300} n={26} seed={11} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
    <TitleCard t={t} lines={['WHAT IF YOU COULD SEE', "EVERYONE'S BANK BALANCE?"]} accent={MONEY.green} accentT={30} y={420} size={110} />
  </g>
);
