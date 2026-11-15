import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, ShotProps, idleBlink, FONT, KITCHEN, stand, KitchenIsland, factCard, Envelope, Glow } from '../../../engine';
import words from './words.json';
import { S15 as FutureLine } from '../c02/shots';
import {
  YOU, MO, MUM10, SUIT, ELLIE, KIT, KITN, BEDN, DAY, DUSK, propCU, faceCU, bigWord, talkShot, netCard, laptopCU, chartShot, moneyCard, SuitCard,
  BigCalendar, BankLetter, Briefcase, WalletScreen, PasswordNote, Teddy, ButtonPhone, YardSign, HundredBill, at, span,
} from '../common';

// Chapter 6, the choice: his card and its date, Mum crying on the phone, the bank letter, a million homes, his offer
// against what the coins become, Mo says keep them, Ellie and Captain Buttons, the crash date is why he picked the
// 20th, the rule (don't change too much), you sell 2,000 coins at $30 on 8 June: $60,000 in an envelope for Mum,
// "Pizza." The house is saved; the password sewn into the teddy; you don't pick up.

export const S1 = netCard({ kicker: 'CHAPTER 6', title: 'THE CHOICE', red: 0.4, lit: 0.4 });
export const S2 = propCU({ Bg: KIT, push: 0.1, draw: () => <SuitCard x={960} y={540} s={1.9} rot={-4} /> });
export const S3 = propCU({ Bg: KIT, push: 0.12, draw: () => <BigCalendar x={960} y={560} s={1.4} month="JUNE" year="2011" ring={20} /> });

// ---------- S4: night, the kitchen: Mum on the phone, crying; you in the doorway ----------
const K1 = stand(KITCHEN, 0.36, 0.45), K3 = stand(KITCHEN, 0.86, 0.3);
export const S4 = talkShot({
  Set: KITN, setT: 200,
  cast: [
    { look: MUM10, ...K1, yaw: 0.3, faces: [[0, 'worried']], pose: { armR: { a: 150, b: 40 }, headTilt: -8 } },
    { look: YOU, ...K3, yaw: -0.5, faces: [[0, 'worried']] },
  ],
  cam: { from: [1000, 560, 1.2], to: [1000, 560, 1.3] },
});
export const S5 = propCU({ Bg: KITN, push: 0.1, draw: () => <BankLetter x={960} y={560} s={1.25} rot={3} /> });
export const S6 = faceCU({ look: YOU, Bg: KITN, faces: [[0, 'worried']], yaw: 0.25, zoom: [3.1, 3.35] });
export const S7 = factCard({ value: 1050000, label: 'US HOMES TAKEN BY BANKS IN 2010', sub: 'RealtyTrac, 2010 year-end report' });
export const S8 = propCU({ Bg: KITN, draw: () => <Briefcase x={960} y={640} s={1.6} open={1} /> });
export const S9 = chartShot({ p0: 0.2, p1: 1, dur: 70, title: 'WHAT THE COINS BECOME', marks: [{ year: 2025.77, price: 124000, label: '10,000 ₿ ≈ $1.2 BILLION', at: 72, color: '#FFD86A' }] });

// ---------- S10: Mo: keep them ----------
export const S10 = talkShot({
  Set: DAY, setT: 300, words,
  cast: [
    { look: MO, x: 820, y: at(0).y, yaw: 0.45, talk: [span(words, 'Mo', 'it')], faces: [[0, 'worried']] },
    { look: YOU, x: 1100, y: at(0).y, yaw: -0.45, faces: [[0, 'worried']] },
  ],
  cam: { from: [960, 560, 1.7], to: [960, 560, 1.8] },
});

// ---------- S11: night, your bed: Ellie climbs on with Captain Buttons ----------
export const S11: React.FC<ShotProps> = ({ t, len, f }) => {
  const climb = easeOut(clamp(t / 20));
  const sp = span(words, 'Are', 'moving');
  const sec = f / 30;
  const talking = sec >= sp[0] && sec <= sp[1];
  const ellie: Pose = { ...basePose, x: 1120, y: 760 - climb * 60, scale: 0.62, yaw: -0.5, expr: 'worried', blink: idleBlink(t, 2), look: -0.6, talk: talking ? 0.5 + 0.5 * Math.sin(t) : 0, armR: { a: 40, b: -60 }, armL: { a: 30, b: -40 } };
  const me: Pose = { ...basePose, x: 820, y: 720, scale: 0.85, yaw: 0.4, expr: 'worried', blink: idleBlink(t, 5), look: 0.6, legL: { a: 80, b: -90 }, legR: { a: 70, b: -90 } };
  return (
    <g transform={camT(980, 600, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <BEDN t={t + 400} id="s11" />
      <rect x={560} y={760} width={800} height={160} rx={30} fill="#4A8A7A" stroke="#141826" strokeWidth={8} />
      <Hero look={YOU} pose={me} />
      <Hero look={ELLIE} pose={ellie} />
      <Teddy x={1050} y={700 - climb * 60} s={0.28} rot={-10} />
    </g>
  );
};

export const S12 = faceCU({ look: YOU, Bg: BEDN, faces: [[0, 'worried'], [14, 'shock']], yaw: 0.25, zoom: [3.1, 3.4], glint: 1 });
export const S13 = propCU({ Bg: BEDN, push: 0.12, draw: (t) => (
  <g>
    <BigCalendar x={960} y={560} s={1.4} month="JUNE" year="2011" ring={t < 66 ? 19 : 20} />
    <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill={t < 66 ? '#FF5A4A' : '#F6EFE3'} stroke="#0B0816" strokeWidth={10} paintOrder="stroke">{t < 66 ? '19: THE CRASH' : '20: HIS DATE'}</text>
  </g>
) });
export const S14 = faceCU({ look: SUIT, Bg: KITN, faces: [[0, 'smug']], yaw: -0.3, zoom: [3.0, 3.25] });
export const S15 = FutureLine;
export const S16 = faceCU({ look: YOU, Bg: BEDN, faces: [[0, 'neutral'], [10, 'smug']], yaw: -0.25, zoom: [3.0, 3.2] });
export const S17 = laptopCU(() => <WalletScreen coins="SELL 2,000 ₿" usd="at $30 each" note="8 June 2011" />);
export const S18 = moneyCard({ kicker: '2,000 COINS × $30', from: 0, to: 60000 });

// ---------- S19: an envelope of cash, pushed across the kitchen table ----------
export const S19 = propCU({
  Bg: KIT,
  draw: (t) => {
    const k = easeOut(clamp(t / 24));
    return (
      <g>
        <rect y={700} width={1920} height={400} fill="#B9AE9C" />
        <g transform={`translate(${1300 - k * 400} 0)`}>
          <HundredBill x={0} y={700} s={0.5} rot={-8} />
          <Envelope x={0} y={760} s={1.6} rot={-4} open={1} />
          <path d="M 60 800 L 600 1100" stroke="#F07A2A" strokeWidth={110} strokeLinecap="round" />
          <ellipse cx={60} cy={800} rx={80} ry={60} fill="#26232F" stroke="#100E16" strokeWidth={8} />
        </g>
      </g>
    );
  },
});

const M1 = stand(KITCHEN, 0.4, 0.45), M2 = stand(KITCHEN, 0.64, 0.45);
export const S20 = talkShot({
  Set: KIT, setT: 600, words,
  cast: [
    { look: MUM10, ...M1, yaw: 0.45, faces: [[0, 'shock'], [60, 'happy']] },
    { look: YOU, ...M2, yaw: -0.45, talk: [span(words, 'Pizza', 'Pizza')], faces: [[0, 'smug']] },
  ],
  cam: { from: [1020, 520, 1.6], to: [1020, 520, 1.72] },
  front: () => <KitchenIsland />,
});

// ---------- S21: the house is saved: the bank's sign comes down ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const fall = easeOut(clamp((t - 10) / 20));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.2], [len, 1.26]]))}>
      <DUSK t={t + 500} id="s21" />
      <g opacity={1 - clamp((t - 30) / 10)}><YardSign x={700} y={900} s={1} rot={fall * 80} /></g>
      <Hero look={MUM10} pose={at(1000, { yaw: -0.3, expr: 'happy', blink: idleBlink(t, 2), armR: { a: 150, b: 20 }, armL: { a: 150, b: 20 } })} />
      <Hero look={ELLIE} pose={at(1180, { yaw: -0.4, expr: 'happy', blink: idleBlink(t, 4) }, 0.62)} />
    </g>
  );
};

export const S22 = laptopCU(() => <WalletScreen coins="8,000 ₿" usd="kept" note="for 2026" />);
export const S23 = propCU({ Bg: BEDN, draw: (t) => <PasswordNote x={960} y={540} s={1.7} rot={-3} fold={easeOut(clamp((t - 40) / 24))} /> });

// ---------- S24: the note sewn inside Captain Buttons ----------
export const S24 = propCU({
  Bg: BEDN,
  push: 0.1,
  draw: (t) => {
    const k = clamp((t - 6) / 40);
    return (
      <g>
        <PasswordNote x={960} y={lerp(560, 700, k)} s={0.9} fold={1} />
        <Teddy x={960} y={500} s={1.3} seam={k} />
      </g>
    );
  },
});
function lerp(a: number, b: number, k: number) { return a + (b - a) * k; }

// ---------- S25: the 20th: the phone rings on the bedside; nobody picks up ----------
export const S25 = propCU({
  Bg: BEDN,
  draw: (t) => {
    const buzz = Math.floor(t / 20) % 2 === 0 ? Math.sin(t * 2.5) * 6 : 0;
    return (
      <g>
        <rect x={360} y={760} width={1200} height={400} fill="#7A5A4A" stroke="#141826" strokeWidth={8} />
        <Glow x={960} y={560} r={260} kind="cool" o={buzz ? 0.5 : 0.25} />
        <ButtonPhone x={960 + buzz} y={700} s={1.4} rot={-80} text="555-0142" />
        <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">20 JUNE</text>
      </g>
    );
  },
});
