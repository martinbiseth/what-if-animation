import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, faceAt, FONT, Glow, SUBURB, OFFICE, officeHip, OfficeTable, Concourse, concourseWalker,
  MONEY, BalanceOver, BalanceTag, fmtMoney, stand, CLS, Classroom,
} from '../../../engine';
import words from './words.json';
import {
  YOU, MO, MUM, ELLIE, SUIT, StreetSet, KitchenSet, OfficeSet, faceCU, bigWord, balCU, people, at, span, handAt, Soft, talkShot, moneyCard,
} from '../common';

// Chapter 6, the choice: the man in the suit knows; "people who follow money"; the office over the station, where
// you point out the thieves in the crowd below; the paper with your mum's name and a million dollars; what you think
// about (Mum, Ellie's trip, Mo, "don't worry about it"); "and if I say no?"; his number, still zero; you sign.

const MORNING = StreetSet('morning', { cars: true });
const KIT = KitchenSet(0.15);
const CLASSB: React.FC<{ t: number; id?: string }> = ({ t }) => <Classroom t={t} />;
const OY = officeHip(1);

export const S1 = moneyCard({ kicker: 'CHAPTER 6', title: 'THE CHOICE', seed: 19 });

// ---------- S2: at the gate: "We need someone like you." "Who are you?" "People who follow money." ----------
export const S2 = talkShot({
  Set: MORNING, words, setT: 400,
  cast: [
    { look: YOU, x: 760, y: at(0).y, yaw: 0.45, talk: [span(words, 'Who', 'you', 1)], faces: [[0, 'worried']] },
    { look: SUIT, x: 1140, y: at(0).y, yaw: -0.45, talk: [span(words, 'We', 'you'), span(words, 'People', 'money')], faces: [[0, 'cool']], bal: 0, balS: 0.5 },
  ],
  cam: { from: [960, 520, 1.55], to: [960, 520, 1.65] },
});

// ---------- S3: "All of it. Except we can't see it. You can." ----------
export const S3 = faceCU({ look: SUIT, Bg: MORNING, faces: [[0, 'cool'], [60, 'smug']], yaw: -0.3, zoom: [2.8, 3.0], words, talk: span(words, 'All', 'can', 1) });

// ---------- S4: an office high above a train station ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 500, kf(t, [[0, 1.05], [len, 1.12]]))}>
    <OfficeSet t={t} id="s4" />
    {people(t, [
      { look: SUIT, pose: { x: kf(t, [[0, 1500], [50, 1200]]), y: OY, yaw: -0.5 }, faces: [[0, 'cool']], bal: 0, balS: 0.5 },
      { look: YOU, pose: { x: kf(t, [[0, 1750], [60, 1480]]), y: OY, yaw: -0.7, look: -0.8 }, faces: [[0, 'shock']] },
    ])}
  </g>
);

// ---------- S5: thousands of people walk past underneath, every one with a number ----------
const vals = (i: number) => {
  const r = Math.abs(Math.sin(i * 91.7) * 1000) % 1;
  return r < 0.7 ? Math.round(r * r * 60000) : -Math.round((r - 0.7) * 120000);
};
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Concourse t={t + 200} id="s5" n={46} />
    {Array.from({ length: 46 }).map((_, i) => {
      const w = concourseWalker(i, t + 200);
      return <BalanceTag key={i} x={w.x} y={w.y - 26} v={vals(i)} s={0.36} t={t + i * 9} pop={(t - (i % 10) * 2) / 6} />;
    })}
  </g>
);

// ---------- S6: "Point. Tell me which ones are stealing." ----------
export const S6 = talkShot({
  Set: OfficeSet, words, setT: 300,
  cast: [
    { look: YOU, x: 820, y: OY, yaw: 0.2, look_: 0.2, faces: [[0, 'worried']] },
    { look: SUIT, x: 1180, y: OY, yaw: -0.4, talk: [span(words, 'Point', 'Point'), span(words, 'Tell', 'stealing')], faces: [[0, 'cool']], bal: 0, balS: 0.5 },
  ],
  cam: { from: [1000, 500, 1.4], to: [1000, 500, 1.5] },
});

// ---------- S7: a woman whose number jumps by five thousand every time she passes a cash machine ----------
const ATM: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-60} y={-80} width={120} height={110} rx={8} fill="#3A6A9A" stroke="#1A2A3A" strokeWidth={5} />
    <rect x={-40} y={-64} width={80} height={44} rx={4} fill="#9AD0F0" />
    <text x={0} y={18} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#F6EFE3">ATM</text>
  </g>
);
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 300], [len, 1600]]);
  const passes = [700, 1150, 1500].filter((ax) => x > ax).length;
  const justPassed = [700, 1150, 1500].some((ax) => x > ax && x < ax + 60);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1250]]), 520, 2.0)}>
      <Concourse t={t + 400} id="s7" n={30} />
      {[700, 1150, 1500].map((ax) => <ATM key={ax} x={ax} y={440} />)}
      <g transform={`translate(${x} 560)`}>
        <ellipse cx={8} cy={30} rx={26} ry={10} fill="#000" opacity={0.15} />
        <ellipse cx={0} cy={10} rx={26} ry={18} fill="#E84A8A" />
        <circle cx={3} cy={0} r={14} fill="#26232F" />
      </g>
      <BalanceTag x={x} y={534} v={2100 + passes * 5000} s={0.5} t={t} flash={justPassed ? 1 : 0} />
      {justPassed ? <text x={x + 90} y={480} fontFamily={FONT.title} fontWeight={800} fontSize={34} fill={MONEY.green} stroke="#0B0816" strokeWidth={5} paintOrder="stroke">+$5,000</text> : null}
    </g>
  );
};

// ---------- S8: a man whose number is so long it doesn't fit above his head ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1100], [len, 900]]);
  return (
    <g transform={camT(960, 520, 2.0)}>
      <Concourse t={t + 600} id="s8" n={30} />
      <g transform={`translate(${x} 560)`}>
        <ellipse cx={0} cy={10} rx={26} ry={18} fill="#2A2A34" />
        <circle cx={-3} cy={0} r={14} fill="#26232F" />
      </g>
      <BalanceTag x={x + 200} y={534} v={0} text="$84,302,991,550,207,..." s={0.62} t={t} color={MONEY.gold} />
    </g>
  );
};

// ---------- S9: you point; he writes it all down ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1000, 480, kf(t, [[0, 1.5], [len, 1.6]]))}>
    <OfficeSet t={t + 500} id="s9" />
    {people(t, [
      { look: YOU, pose: { x: 820, y: OY, yaw: 0.3, armR: { a: 140, b: -10 }, handR: 'point' }, faces: [[0, 'neutral']] },
      { look: SUIT, pose: { x: 1200, y: OY, yaw: -0.4, armL: { a: 60, b: -100 }, armR: { a: 50, b: -90 + Math.sin(t / 2) * 8 } }, faces: [[0, 'smug']], bal: 0, balS: 0.5 },
    ])}
    <rect x={1120} y={OY - 70} width={70} height={90} rx={4} fill="#F4F0E6" stroke="#26232F" strokeWidth={4} />
  </g>
);

// ---------- S10: he slides a piece of paper across the table ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.2], [len, 1.28]]))}>
    <OfficeSet t={t + 560} id="s10" />
    {people(t, [
      { look: YOU, pose: { x: 640, y: OY, yaw: 0.5 }, faces: [[0, 'worried']] },
      { look: SUIT, pose: { x: 1280, y: OY, yaw: -0.5, armR: { a: 70 - clamp(t / 30) * 10, b: -20 } }, faces: [[0, 'cool']], bal: 0, balS: 0.5 },
    ])}
    <OfficeTable paper x={kf(t, [[0, 1150], [30, 800]])} />
  </g>
);

// ---------- S11: "One year. You work for us. You tell nobody, not even your mum. And this happens." ----------
export const S11 = faceCU({ look: SUIT, Bg: OfficeSet, faces: [[0, 'cool'], [100, 'smug']], yaw: -0.3, zoom: [2.9, 3.05], words, talk: span(words, 'One', 'happens'), bal: 0, balS: 0.45 });

// ---------- S12: the paper: your mum's name, and one million dollars ----------
export const S12: React.FC<ShotProps> = ({ t }) => {
  const m = backOut(clamp((t - 88) / 8));
  return (
    <g>
      <Soft blur={16} dim={0.4}>
        <g transform={camT(960, 560, 1.3)}>
          <OfficeSet t={t + 600} id="s12" />
        </g>
      </Soft>
      <g transform="rotate(-3 960 540)">
        <rect x={500} y={160} width={920} height={780} rx={10} fill="#F4F0E6" stroke="#26232F" strokeWidth={6} />
        <text x={960} y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#26232F" letterSpacing={8}>AGREEMENT</text>
        {[310, 350].map((y) => <rect key={y} x={580} y={y} width={760} height={12} rx={6} fill="#C8C2B6" />)}
        <text x={600} y={460} fontFamily={FONT.ui} fontSize={34} fill="#6A6458">PAY TO:</text>
        <text x={780} y={460} fontFamily={FONT.hand} fontWeight={700} fontSize={56} fill="#2A5AB8" opacity={clamp((t - 20) / 10)}>Your Mum</text>
        <text x={600} y={580} fontFamily={FONT.ui} fontSize={34} fill="#6A6458">AMOUNT:</text>
        <g transform={`translate(1070 600) scale(${m})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill={MONEY.greenDeep}>$1,000,000</text>
        </g>
        <path d="M 600 820 H 1000" stroke="#26232F" strokeWidth={4} />
        <text x={600} y={860} fontFamily={FONT.ui} fontSize={26} fill="#6A6458">SIGN HERE</text>
      </g>
    </g>
  );
};

// ---------- S13: you think about the red number above her head ----------
export const S13 = balCU({ bal: -6240, Bg: KIT, label: 'MUM', s: 2.4 });

// ---------- S14: about Ellie's school trip ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 500, kf(t, [[0, 2.0], [len, 2.1]]))}>
      <KIT t={t + 700} id="s14" />
      {people(t, [{ look: ELLIE, pose: { x: 960, y: 760, scale: 0.85, yaw: 0.1, armL: { a: 140, b: -20 } }, faces: [[0, 'happy']] }])}
      <g transform="translate(1040 520) rotate(-8)">
        <rect x={-50} y={-32} width={100} height={64} rx={4} fill="#F4F0E6" stroke="#26232F" strokeWidth={4} />
        <text x={0} y={8} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={20} fill="#2A5AB8">TRIP $200</text>
      </g>
    </g>
    <rect width={1920} height={1080} fill="#F2D08A" opacity={0.12} />
  </g>
);

// ---------- S15: about Mo pretending he isn't hungry ----------
const M2 = stand(CLS, 0.5, 0.6);
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(M2.x, 420, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <CLASSB t={t + 800} />
      {people(t, [{ look: MO, pose: { x: M2.x, y: M2.y, scale: M2.scale, yaw: 0.2, armL: { a: 20, b: -10 } }, faces: [[0, 'cool']], bal: 3.05, balS: 0.5 }])}
    </g>
    <rect width={1920} height={1080} fill="#F2D08A" opacity={0.12} />
  </g>
);

// ---------- S16: about how your mum smiled and said "don't worry about it", every single time ----------
export const S16 = faceCU({ look: MUM, Bg: KIT, faces: [[0, 'happy']], yaw: 0.25, zoom: [2.7, 2.85], words, talk: span(words, "don't", "it'"), bal: -6240, balS: 0.5 });

// ---------- S17: what's the work? "Just pointing. Nothing else." ----------
export const S17 = talkShot({
  Set: OfficeSet, words, setT: 700,
  cast: [
    { look: YOU, x: 760, y: OY, yaw: 0.45, talk: [[53.1, 54.1]], faces: [[0, 'worried']] },
    { look: SUIT, x: 1180, y: OY, yaw: -0.45, talk: [[54.6, 55.5], span(words, 'Nothing', 'else')], faces: [[0, 'smug']], bal: 0, balS: 0.5 },
  ],
  cam: { from: [970, 520, 1.5], to: [970, 520, 1.58] },
  front: () => <OfficeTable />,
});

// ---------- S18: it sounds easy; that's what worries you ----------
export const S18 = faceCU({ look: YOU, Bg: OfficeSet, faces: [[0, 'neutral'], [26, 'worried']], yaw: 0.3, zoom: [3.0, 3.2] });

// ---------- S19: "And if I say no?" He smiles. "Then you go home, and nothing changes. For anyone." ----------
export const S19 = talkShot({
  Set: OfficeSet, words, setT: 800,
  cast: [
    { look: YOU, x: 760, y: OY, yaw: 0.45, talk: [[59.7, 60.8]], faces: [[0, 'worried']] },
    { look: SUIT, x: 1180, y: OY, yaw: -0.45, talk: [[62.0, 64.9]], faces: [[0, 'cool'], [36, 'smug']], bal: 0, balS: 0.5 },
  ],
  cam: { from: [1000, 500, 1.6], to: [1080, 480, 1.85] },
  front: () => <OfficeTable />,
});

// ---------- S20: you look up at his number again: still zero ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1180, 430, kf(t, [[0, 2.1], [len, 2.3]]))}>
    <OfficeSet t={t + 900} id="s20" />
    {people(t, [{ look: SUIT, pose: { x: 1180, y: OY, yaw: -0.3 }, faces: [[0, 'smug']], bal: 0, balS: 0.75 }])}
  </g>
);

// ---------- S21: you look at the paper; you look at the pen ----------
export const S21: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Soft blur={16} dim={0.4}>
      <g transform={camT(960, 560, 1.3)}>
        <OfficeSet t={t + 950} id="s21" />
      </g>
    </Soft>
    <rect x={-100} y={640} width={2200} height={600} fill="#4A3A30" />
    <g transform="rotate(-6 960 760)">
      <rect x={560} y={560} width={760} height={400} rx={8} fill="#F4F0E6" stroke="#26232F" strokeWidth={5} />
      <text x={940} y={700} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill={MONEY.greenDeep}>$1,000,000</text>
      <path d="M 620 880 H 1000" stroke="#26232F" strokeWidth={4} />
    </g>
    <g transform={`translate(${1420} ${720}) rotate(${-30 + Math.sin(t / 10) * 2})`}>
      <rect x={-14} y={-200} width={28} height={200} rx={6} fill="#1A1A22" />
      <path d="M -14 0 L 0 34 L 14 0 Z" fill="#C8A040" />
    </g>
  </g>
);

// ---------- S22: and you sign it ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 24);
  const pts = Array.from({ length: 24 }).map((_, i) => `${640 + i * 16},${870 + Math.sin(i * 1.1) * 18 - i * 1.5}`).slice(0, Math.max(1, Math.floor(k * 24)));
  const z = kf(t, [[0, 1], [Math.max(1, len), 1.12]]);
  return (
    <g transform={`translate(960 760) scale(${z}) translate(-960 -760)`}>
      <Soft blur={16} dim={0.5}>
        <g transform={camT(960, 560, 1.3)}>
          <OfficeSet t={t + 1000} id="s22" />
        </g>
      </Soft>
      <rect x={-100} y={640} width={2200} height={600} fill="#4A3A30" />
      <g transform="rotate(-6 960 760)">
        <rect x={560} y={560} width={760} height={400} rx={8} fill="#F4F0E6" stroke="#26232F" strokeWidth={5} />
        <text x={940} y={700} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill={MONEY.greenDeep}>$1,000,000</text>
        <path d="M 620 880 H 1000" stroke="#26232F" strokeWidth={4} />
        <polyline points={pts.join(' ')} stroke="#2A5AB8" strokeWidth={7} fill="none" strokeLinecap="round" />
      </g>
      <g transform={`translate(${640 + k * 380} ${850 - k * 40}) rotate(30)`}>
        <rect x={-14} y={-200} width={28} height={200} rx={6} fill="#1A1A22" />
        <path d="M -14 0 L 0 34 L 14 0 Z" fill="#C8A040" />
      </g>
      <path d="M 740 1000 Q 640 1060 520 1120" stroke="#F07A2A" strokeWidth={80} fill="none" strokeLinecap="round" opacity={0} />
    </g>
  );
};
