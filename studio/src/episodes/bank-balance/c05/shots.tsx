import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, faceAt, FONT, Glow, SUBURB, BANK, bankHip, factCard, MONEY, BalanceOver, BalanceTag,
} from '../../../engine';
import words from './words.json';
import {
  YOU, MUM, GRAN, SCAMMER, GUARD, CLERK, SUIT, N1, N2, N3, N4, KID, BUYER, StreetSet, BankSet, faceCU, bigWord, balCU, people, at, crowd, span, handAt,
  Soft, talkShot, moneyCard, MoneyField,
} from '../common';

// Chapter 5, someone notices: the bank, Mrs. Hale's life savings, the nice young man and his form; you watch the
// money move from her head to his; "Stop him!"; she gets it back; the reporter; the real number (fraud); then the man
// in the grey suit at the school gate, and his number: exactly zero.

const BANKS = BankSet();
const BANKW = BankSet({ counter: true, rope: true });
const BANKALARM = BankSet({ alarm: 1 });
const DAY = StreetSet('day');
const H = 18000;
const GX = 1420, SX = 1660; // Mrs. Hale and the young man at the counter

export const S1 = moneyCard({ kicker: 'CHAPTER 5', title: 'SOMEONE NOTICES', seed: 17 });

// ---------- S2: the bank: you and Mum in the queue ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 820], [len, 960]]), 520, 1.0)}>
    <BANKW t={t} id="s2" />
    {people(t, [
      { look: MUM, pose: { x: 420, y: bankHip(1), yaw: 0.4 }, faces: [[0, 'neutral']], bal: -6240, balS: 0.5 },
      { look: YOU, pose: { x: 640, y: bankHip(1), yaw: 0.4, look: 0.8 }, faces: [[0, 'neutral']] },
      { look: GRAN, pose: { x: GX, y: bankHip(1), yaw: 0.5 }, faces: [[0, 'happy']] },
      { look: CLERK, pose: { x: 1770, y: bankHip(1) - 40, yaw: -0.5 }, faces: [[0, 'neutral']] },
    ])}
  </g>
);

// ---------- S3: at the counter, Mrs. Hale: $18,000, her whole life's savings ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(GX + 60, 470, kf(t, [[0, 1.7], [len, 1.85]]))}>
    <BANKS t={t + 100} id="s3" />
    {people(t, [{ look: GRAN, pose: { x: GX, y: bankHip(1), yaw: 0.5, look: 0.3 }, faces: [[0, 'happy']], bal: H, balPop: 100, balS: 0.7 }])}
  </g>
);

// ---------- S4: next to her, a nice young man in a nice jacket, helping with a form ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 2000], [40, SX]]);
  return (
    <g transform={camT(1540, 480, kf(t, [[0, 1.45], [len, 1.55]]))}>
      <BANKS t={t + 200} id="s4" />
      {people(t, [
        { look: GRAN, pose: { x: GX, y: bankHip(1), yaw: 0.5 }, faces: [[0, 'neutral'], [60, 'happy']], bal: H, balS: 0.55 },
        { look: SCAMMER, pose: { x, y: bankHip(1), yaw: -0.5, armL: { a: 70, b: -50 } }, faces: [[0, 'happy']] },
      ])}
      <rect x={x - 120} y={bankHip(1) - 40} width={80} height={100} rx={4} fill="#F4F0E6" stroke="#26232F" strokeWidth={4} transform={`rotate(-10 ${x - 80} ${bankHip(1)})`} />
    </g>
  );
};

// ---------- S5: "Just sign here, and your money will be safe." His number: minus ninety thousand ----------
const scamLine = span(words, 'Just', 'safe');
export const S5: React.FC<ShotProps> = ({ t, len, f }) => (
  <g transform={camT(1560, 440, kf(t, [[0, 1.85], [len, 1.95]]))}>
    <BANKS t={t + 260} id="s5" />
    {people(t, [
      { look: GRAN, pose: { x: GX, y: bankHip(1), yaw: 0.5 }, faces: [[0, 'happy']], bal: H, balS: 0.55 },
      { look: SCAMMER, pose: { x: SX, y: bankHip(1), yaw: -0.5, armR: { a: 60, b: -60 }, handR: 'point' }, faces: [[0, 'happy']], bal: -90000, balPop: 70, balS: 0.7 },
    ], f, words, { 1: [scamLine] })}
    {t > 70 ? <Glow x={SX} y={bankHip(1) - 320} r={240} kind="red" o={0.5} /> : null}
  </g>
);

// ---------- S6: she signs ----------
export const S6: React.FC<ShotProps> = ({ t }) => {
  const k = clamp(t / 26);
  const pts = Array.from({ length: 20 }).map((_, i) => `${760 + i * 22},${640 + Math.sin(i * 1.3) * 22}`).slice(0, Math.max(1, Math.floor(k * 20)));
  return (
    <g>
      <Soft blur={16} dim={0.35}>
        <g transform={camT(1500, 520, 1.4)}>
          <BANKS t={t + 300} id="s6" />
        </g>
      </Soft>
      <rect x={560} y={260} width={800} height={560} rx={10} fill="#F4F0E6" stroke="#26232F" strokeWidth={6} transform="rotate(-4 960 540)" />
      <text x={640} y={360} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#26232F" transform="rotate(-4 960 540)">TRANSFER FORM</text>
      {[440, 490, 540].map((y) => <rect key={y} x={640} y={y} width={560} height={14} rx={7} fill="#C8C2B6" transform="rotate(-4 960 540)" />)}
      <polyline points={pts.join(' ')} stroke="#2A5AB8" strokeWidth={8} fill="none" strokeLinecap="round" transform="rotate(-4 960 540)" />
      <g transform={`translate(${760 + k * 420} ${640 - 30}) rotate(30)`}>
        <rect x={-10} y={-160} width={20} height={160} fill="#26232F" />
        <path d="M -10 0 L 0 26 L 10 0 Z" fill="#26232F" />
      </g>
    </g>
  );
};

// ---------- S7: and you watch it happen ----------
export const S7 = faceCU({ look: YOU, Bg: BANKS, faces: [[0, 'shock']], yaw: 0.35, zoom: [3.0, 3.2], glint: 1, glintColor: MONEY.red });

// ---------- S8: her number drops: eighteen thousand, nine thousand, zero ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(GX + 40, 440, kf(t, [[0, 2.0], [len, 2.2]]))}>
    <BANKS t={t + 360} id="s8" />
    {people(t, [{ look: GRAN, pose: { x: GX, y: bankHip(1), yaw: 0.5 }, faces: [[0, 'happy']], bal: [[0, H], [74, H], [82, 9000], [108, 9000], [116, 0]], balS: 0.75 }])}
  </g>
);

// ---------- S9: and his jumps by the same amount, at the same second ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1540, 460, kf(t, [[0, 1.6], [len, 1.7]]))}>
    <BANKS t={t + 420} id="s9" />
    {people(t, [
      { look: GRAN, pose: { x: GX, y: bankHip(1), yaw: 0.5 }, faces: [[0, 'happy']], bal: [[0, H], [14, H], [24, 0]], balS: 0.6 },
      { look: SCAMMER, pose: { x: SX, y: bankHip(1), yaw: -0.3 }, faces: [[0, 'neutral'], [24, 'smug']], bal: [[0, -90000], [14, -90000], [24, -72000]], balS: 0.6 },
    ])}
    {t > 14 && t < 30 ? <path d={`M ${GX + 60} ${bankHip(1) - 330} Q 1540 ${bankHip(1) - 430} ${SX - 60} ${bankHip(1) - 330}`} stroke={MONEY.green} strokeWidth={10} fill="none" strokeDasharray="20 16" strokeDashoffset={-t * 8} /> : null}
  </g>
);

// ---------- S10: "Stop him!" ----------
const stopLine = span(words, 'Stop', 'him');
export const S10 = faceCU({ look: YOU, Bg: BANKS, faces: [[0, 'shock']], yaw: 0.3, zoom: [2.8, 3.0], words, talk: stopLine, pose: { armR: { a: 150, b: -10 }, handR: 'point' } });

// ---------- S11: security grabs him at the door ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 900], [30, 560]]);
  return (
    <g transform={camT(700, 520, kf(t, [[0, 1.3], [len, 1.38]]))}>
      <BANKALARM t={t} id="s11" />
      {people(t, [
        { look: SCAMMER, pose: { x, y: bankHip(1), yaw: -0.9, tilt: -10, armL: { a: 60, b: 0 }, armR: { a: 60, b: 0 } }, faces: [[0, 'shock']], bal: -72000, balS: 0.5 },
        { look: GUARD, pose: { x: x - 220 + clamp((t - 20) / 10) * 120, y: bankHip(1), yaw: 0.6, armR: { a: 100, b: -10 }, armL: { a: 90, b: -10 } }, faces: [[0, 'cool']] },
      ])}
    </g>
  );
};

// ---------- S12: the bank freezes the transfer; Mrs. Hale gets every cent back ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(GX + 40, 450, kf(t, [[0, 1.8], [len, 1.9]]))}>
    <BANKS t={t + 500} id="s12" />
    {people(t, [{ look: GRAN, pose: { x: GX, y: bankHip(1), yaw: 0.4 }, faces: [[0, 'worried'], [62, 'happy']], bal: [[0, 0], [58, 0], [70, H]], balS: 0.75 }])}
    <g transform={`translate(${GX} 290) scale(${backOut(clamp((t - 4) / 8))})`}>
      <rect x={-210} y={-44} width={420} height={70} rx={10} fill="#1E3A5A" />
      <text x={0} y={6} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#9AD0F0" letterSpacing={4}>TRANSFER FROZEN</text>
    </g>
  </g>
);

// ---------- S13: she hugs you and won't let go ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1000, 460, kf(t, [[0, 1.8], [len, 1.9]]))}>
    <BANKS t={t + 560} id="s13" />
    {people(t, [
      { look: YOU, pose: { x: 1060, y: bankHip(1), yaw: -0.3, armL: { a: 30, b: -20 } }, faces: [[0, 'oops']] },
      { look: GRAN, pose: { x: 920, y: bankHip(1), yaw: 0.5, tilt: 8, armR: { a: 80, b: -60 }, armL: { a: 70, b: -70 } }, faces: [[0, 'happy']], bal: H, balS: 0.55 },
    ])}
  </g>
);

// ---------- S14: the manager wants your name; a reporter takes your picture ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const flash = t > 82 && t < 88 ? 1 - (t - 82) / 6 : 0;
  return (
    <g>
      <g transform={camT(960, 500, kf(t, [[0, 1.4], [len, 1.48]]))}>
        <BANKS t={t + 620} id="s14" />
        {people(t, [
          { look: { ...N1, jacket: '#1E3A5A', jacketShade: '#162E4A' }, pose: { x: 700, y: bankHip(1), yaw: 0.5, armR: { a: 70, b: -50 } }, faces: [[0, 'happy']], bal: 64000, balS: 0.5 },
          { look: YOU, pose: { x: 960, y: bankHip(1), yaw: 0.2 }, faces: [[0, 'oops'], [70, 'happy']] },
          { look: N2, pose: { x: 1260, y: bankHip(1), yaw: -0.5, armR: { a: 100, b: -80 }, armL: { a: 100, b: -80 } }, faces: [[0, 'happy']], bal: 2100, balS: 0.5 },
        ])}
        <rect x={1150} y={bankHip(1) - 120} width={70} height={50} rx={6} fill="#26232F" />
        <circle cx={1170} cy={bankHip(1) - 95} r={14} fill="#8AA8C8" />
      </g>
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={flash * 0.8} />
    </g>
  );
};

// ---------- S15: more than ten billion dollars reported lost to fraud in one year ----------
export const S15 = factCard({ value: 10, suffix: ' BILLION', format: (v) => `$${Math.round(v)}`, label: 'REPORTED LOST TO FRAUD IN THE US IN ONE YEAR', sub: 'US Federal Trade Commission (Feb 2024)' });

// ---------- S16: nobody else in that bank saw it happen ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 980]]), 520, 1.0)}>
    <BANKW t={t + 700} id="s16" />
    {people(t, [
      { look: N3, pose: { x: 300, y: bankHip(1), yaw: 0.3, look: 0.5 }, faces: [[0, 'tired']], bal: 512, balS: 0.45 },
      { look: N4, pose: { x: 560, y: bankHip(1), yaw: -0.3 }, faces: [[0, 'neutral']], bal: 9300, balS: 0.45 },
      { look: YOU, pose: { x: 960, y: bankHip(1), yaw: 0 }, faces: [[0, 'worried']] },
      { look: GRAN, pose: { x: GX, y: bankHip(1), yaw: 0.5 }, faces: [[0, 'happy']], bal: H, balS: 0.45 },
      { look: CLERK, pose: { x: 1770, y: bankHip(1) - 40, yaw: -0.5 }, faces: [[0, 'neutral']] },
    ])}
  </g>
);

// ---------- S17: but somebody saw you: a man in grey outside the window ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 520], [len, 480]]), 360, kf(t, [[0, 2.2], [len, 2.5]]))}>
    <BANKS t={t + 760} id="s17" />
    <clipPath id="s17w"><rect x={478} y={78} width={224} height={444} rx={112} /></clipPath>
    <g clipPath="url(#s17w)">
      <rect x={478} y={78} width={224} height={444} fill="#7FB4EA" />
      <Hero look={SUIT} pose={{ ...basePose, x: 590, y: 420, scale: 0.9, yaw: 0.2, look: 0.6, expr: 'cool', blink: idleBlink(t, 5) }} shadow={0} />
      <rect x={478} y={78} width={224} height={444} fill="#A8C8E8" opacity={0.25} />
    </g>
  </g>
);

// ---------- S18: next morning: the man in the grey suit at the school gate ----------
const Gate: React.FC = () => (
  <g>
    {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-400 + i * 100} y={SUBURB.feet - 260} width={14} height={260} fill="#2A2E38" />)}
    <rect x={-400} y={SUBURB.feet - 250} width={2800} height={14} fill="#2A2E38" />
    <rect x={-400} y={SUBURB.feet - 120} width={2800} height={14} fill="#2A2E38" />
  </g>
);
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <StreetSetMorning t={t + 100} />
    <Gate />
    {people(t, [
      { look: KID, pose: at(kf(t, [[0, 300], [len, 520]]), { yaw: 0.6 }), faces: [[0, 'happy']] },
      { look: YOU, pose: at(800, { yaw: 0.5 }), faces: [[0, 'neutral'], [40, 'worried']] },
      { look: SUIT, pose: at(1200, { yaw: -0.5 }), faces: [[0, 'cool']] },
    ])}
  </g>
);
const StreetSetMorning = StreetSet('morning', { cars: true });

// ---------- S19: "You knew. Before the bank did. Before anyone. How?" ----------
const suitLines: [number, number][] = [span(words, 'You', 'knew'), span(words, 'Before', 'How')];
export const S19 = talkShot({
  Set: StreetSetMorning, words, setT: 200,
  cast: [
    { look: YOU, x: 760, y: at(0).y, yaw: 0.45, faces: [[0, 'worried']] },
    { look: SUIT, x: 1140, y: at(0).y, yaw: -0.45, talk: suitLines, faces: [[0, 'cool'], [90, 'smug']] },
  ],
  cam: { from: [990, 520, 1.6], to: [1060, 500, 1.85] },
  front: () => <Gate />,
});

// ---------- S20: you look at the space above his head ----------
export const S20 = faceCU({ look: YOU, Bg: StreetSetMorning, faces: [[0, 'neutral'], [70, 'shock']], yaw: -0.3, zoom: [3.0, 3.25], pose: { headTilt: -8 }, look_: 0.8, glint: 1, glintColor: '#E8E4F0' });

// ---------- S21: it just says zero. Exactly zero ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const glitch = (t % 23 < 2) ? 6 : 0;
  return (
    <g transform={camT(1140, 380, kf(t, [[0, 2.0], [len, 2.3]]))}>
      <StreetSetMorning t={t + 300} />
      <Gate />
      {people(t, [{ look: SUIT, pose: at(1140, { yaw: -0.3 }), faces: [[0, 'cool']] }])}
      <g transform={`translate(${glitch} 0)`}>
        <BalanceOver pose={{ ...basePose, ...at(1140, { yaw: -0.3 }) }} v={0} t={t} s={0.75} pop={(t - 6) / 8} cents />
      </g>
    </g>
  );
};

// ---------- S22: a man in a perfect suit with nothing at all; as if he doesn't exist ----------
export const S22 = balCU({ bal: 0, cents: true, label: "AS IF HE DOESN'T EXIST", Bg: StreetSetMorning, s: 2.8 });
