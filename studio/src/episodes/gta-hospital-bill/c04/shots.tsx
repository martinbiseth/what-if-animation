import React from 'react';
import {
  Hero, basePose, kf, camT, clamp, backOut, ShotProps, FONT, MONEY, Schematic, SCH, SchLabel, shake, LEG_LEN, lerp, Suburb, SUBURB,
} from '../../../engine';
import words from './words.json';
import timeline from './timeline.json';
import { CarPark, CP, BoxPile, Helicopter, HospitalBay, BAY } from '../kit';
import { GameScreen, Controller } from '../borrowed';
import {
  YOU, DOC, NURSE, MEDIC, respawn, billPhone, billCU, faceCU, talkShot, bigWord, people, tumble, HospSet, RoofSet, BaySet, cueIn, phoneCU, billCard,
  moneyFact, HHIP,
} from '../common';

// Chapter 4, the catch: the boxes don't break your fall. Your phone rings. The doctors can't believe your scans. Then
// the bill, line by line, and the real numbers behind it: the helicopter (GAO), the trauma team fee (KFF Health
// News), a high spinal cord injury (NSCISC), a day in a US hospital (KFF). New total: $1,573,043.

const W = words as { w: string; s: number; e: number; p: string }[];
const TL = timeline as { segments: { shot: string; a: number; t0: number }[] };
const cue = (shot: string, w: string, nth = 1, d = 10) => cueIn(TL, W, shot, w, nth, d);
const HOSP = HospSet();
const DUSK = HospSet({ tod: 'dusk', lights: 1 });

// ---------- S1: the boxes don't break your fall ----------
export const S1: React.FC<ShotProps> = ({ t }) => {
  const k = clamp(t / 10);
  const sh = shake(t, 10, 14, 30);
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(1260, CP.feet - 200, 1.8)}`}>
      <CarPark t={t} boxes={0} />
      <BoxPile x={1260} y={CP.feet} s={0.9} crushed={clamp((t - 9) / 4)} />
      {k < 1 ? <Hero look={YOU} pose={tumble(1260, lerp(CP.feet - 900, CP.feet - 200, k), 90 + k * 30)} /> : null}
    </g>
  );
};

// ---------- S2: nothing in real life works like that (then grey) ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1260, CP.feet - 100, kf(t, [[0, 2.2], [len, 2.4]]))}>
    <CarPark t={t + 40} boxes={0} />
    <BoxPile x={1260} y={CP.feet} s={0.9} crushed={1} />
    <Hero look={YOU} pose={tumble(1260, CP.feet - 90, 90, { expr: 'dizzy', blink: 1 })} />
  </g>
);

// ---------- S3: the doors ----------
export const S3 = respawn({ appear: 2, faces: [[0, 'shock'], [20, 'worried']], tod: 'dusk', lights: 1 });

// ---------- S4: it rings ----------
export const S4 = phoneCU({ mode: 'message', Bg: DUSK, time: '6:31', text: 'City General Billing|is calling you...', buzz: (t) => (Math.floor(t / 12) % 2 === 0 ? 1 : 0), push: 0.1 });

// ---------- S5: a doctor stares at your scans, calls three more over ----------
const Lightbox: React.FC<{ x: number; y: number; s?: number; heal?: number }> = ({ x, y, s = 1, heal = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-150} width={400} height={300} rx={10} fill="#E8F4FA" stroke="#100E16" strokeWidth={6} />
    <rect x={-180} y={-130} width={360} height={260} fill="#16222E" />
    {[-60, -20, 20, 60].map((dx, i) => <rect key={i} x={dx - 12} y={-110 + Math.abs(dx) * 0.3} width={24} height={36} rx={6} fill="#C8DCE8" />)}
    <path d="M 0 -120 L 0 120" stroke="#C8DCE8" strokeWidth={30} strokeDasharray="30 8" />
    <path d="M -24 -10 L 20 6 L -10 20" stroke="#FF4A4A" strokeWidth={8} fill="none" opacity={1 - heal} />
  </g>
);
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const arrive = (i: number) => clamp((t - 10 - i * 10) / 16);
  return (
    <g transform={camT(900, 560, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <HospitalBay t={t} />
      <Lightbox x={900} y={360} />
      {people(t, [
        { look: DOC, pose: { x: 700, y: BAY.feet - LEG_LEN, yaw: 0.5, armR: { a: 120, b: -40 } }, faces: [[0, 'shock']] },
        ...[0, 1, 2].map((i) => ({ look: i === 1 ? NURSE : DOC, pose: { x: lerp(1900, 1000 + i * 160, arrive(i)), y: BAY.feet - LEG_LEN, yaw: -0.6 }, faces: [[0, 'shock']] as [number, 'shock'][] })),
      ])}
    </g>
  );
};

// ---------- S6: by the time they arrive, the scans are normal ----------
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(900, 360, 2.6)}>
    <HospitalBay t={t + 50} />
    <Lightbox x={900} y={360} heal={clamp((t - 10) / 10)} />
  </g>
);

// ---------- S7: line by line: the real part ----------
export const S7 = billCard({ kicker: 'CHAPTER 4', title: 'THE REAL BILL' });

// ---------- S8: a helicopter to the trauma centre ----------
const ROOF = RoofSet();
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 480, 1.1)}>
    <ROOF t={t} id="h8" />
    <Helicopter x={kf(t, [[0, -300], [Math.max(len, 1), 2100]], (k) => k)} y={300 + Math.sin(t / 10) * 10} s={1.1} t={t} />
  </g>
);

// ---------- S9: the helicopter fact ----------
export const S9 = moneyFact({ value: 36400, label: 'ONE HELICOPTER AMBULANCE FLIGHT', sub: 'median price charged, US', src: 'US Government Accountability Office, GAO-19-292 (2019)' });

// ---------- S10: six minutes ----------
export const S10 = bigWord({ kicker: 'YOU WERE IN IT FOR', word: '6 MINUTES', color: '#FFD23A', sub: 'about $6,000 a minute', Bg: ROOF });

// ---------- S11: the trauma team rushing to the door ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const k = (i: number) => clamp((t - i * 6) / 26);
  return (
    <g transform={camT(1200, 560, 1.5)}>
      <HOSP t={t + 100} id="tt" />
      {people(t, [0, 1, 2, 3, 4].map((i) => ({
        look: [DOC, NURSE, MEDIC, DOC, NURSE][i], pose: { x: lerp(-200 - i * 140, 900 + i * 130, k(i)), y: HHIP + Math.abs(Math.sin(t / 3 + i)) * -8, yaw: 0.7, tilt: 10, armL: { a: 40 * Math.sin(t / 3 + i), b: -60 }, armR: { a: -40 * Math.sin(t / 3 + i), b: -60 } },
        faces: [[0, 'worried']] as [number, 'worried'][],
      })))}
    </g>
  );
};

// ---------- S12: the trauma fee fact ----------
export const S12 = moneyFact({ value: 50659, label: 'TRAUMA TEAM ACTIVATION, ONE CALIFORNIA HOSPITAL', sub: 'before anyone has touched you', src: 'KFF Health News, "How ER bills can balloon by as much as $50K" (2019)' });

// ---------- S13: the spine ----------
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="sp" />
    <SchLabel x={960} y={160} t={t - 2} text="A FALL FROM TEN FLOORS" size={44} color={SCH.dim} />
    {Array.from({ length: 17 }).map((_, i) => {
      const hot = i >= 2 && i <= 5;
      const p = backOut(clamp((t - i * 1.5) / 6));
      return (
        <g key={i} transform={`translate(960 ${250 + i * 44}) scale(${p})`}>
          <rect x={-46 + Math.abs(i - 8) * 1.5} y={-16} width={92 - Math.abs(i - 8) * 3} height={32} rx={12} fill={hot && t > 24 ? MONEY.red : '#C8DCE8'} />
          <rect x={-90} y={-4} width={180} height={8} rx={4} fill="#5A7A8A" opacity={0.6} />
        </g>
      );
    })}
    {t > 24 ? <text x={1120} y={420} fontFamily={FONT.title} fontWeight={800} fontSize={54} fill={MONEY.red} opacity={clamp((t - 24) / 6)}>← HIGH SPINAL CORD</text> : null}
  </g>
);

// ---------- S14, S15: the spinal cord injury facts ----------
export const S14 = moneyFact({ value: 1369755, label: 'HIGH SPINAL CORD INJURY: THE FIRST YEAR', sub: 'health care and living costs', src: 'National Spinal Cord Injury Statistical Center, Facts and Figures 2024' });
export const S15 = moneyFact({ value: 237862, label: 'AND EVERY YEAR AFTER THAT', sub: 'for life', src: 'NSCISC, Facts and Figures 2024 (2023 dollars)' });

// ---------- S16: falls and vehicle crashes: two thirds ----------
export const S16: React.FC<ShotProps> = ({ t }) => {
  const bars: [string, number, string][] = [['VEHICLE CRASHES', 37.5, MONEY.red], ['FALLS', 31.7, '#FFB15A'], ['EVERYTHING ELSE', 30.8, '#5A6A7A']];
  return (
    <g>
      <Schematic t={t} id="bars" />
      <SchLabel x={960} y={200} t={t - 2} text="WHAT CAUSES SPINAL CORD INJURIES (US, SINCE 2015)" size={40} color={SCH.dim} />
      {bars.map(([l, v, c], i) => {
        const g = clamp((t - 6 - i * 6) / 20);
        return (
          <g key={i} transform={`translate(300 ${360 + i * 190})`}>
            <text x={0} y={-20} fontFamily={FONT.ui} fontSize={38} fill="#F6EFE3">{l}</text>
            <rect x={0} y={0} width={v * 30 * g} height={90} rx={12} fill={c} />
            <text x={v * 30 * g + 24} y={66} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={c}>{(v * g).toFixed(1)}%</text>
          </g>
        );
      })}
      <text x={960} y={1010} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill={SCH.dim}>NSCISC, Facts and Figures 2024</text>
    </g>
  );
};

// ---------- S17, S18: a day in a hospital bed ----------
export const S17 = moneyFact({ value: 3297, label: 'ONE DAY IN A US HOSPITAL, PER PATIENT', sub: 'average hospital expense, 2024', src: 'KFF State Health Facts, Hospital Adjusted Expenses per Inpatient Day' });
export const S18 = moneyFact({ value: 4744, label: 'THE SAME DAY IN CALIFORNIA', sub: 'the most expensive state', src: 'KFF State Health Facts (2024)', realAt: 40 });

// ---------- S19: you blinked and you healed ----------
export const S19 = faceCU({ look: YOU, Bg: DUSK, faces: [[0, 'neutral'], [30, 'worried']], yaw: 0.3, zoom: [2.9, 3.15] });

// ---------- S20: the new total ----------
export const S20 = billCU({
  Bg: DUSK, s: 1.0,
  lines: [
    { label: 'Earlier (Sat-Sun)', v: 116229, at: -1 },
    { label: 'Helicopter', v: 36400, at: 0 },
    { label: 'Trauma team', v: 50659, at: 2, hot: true },
    { label: 'Spine, first year', v: 1369755, at: 4, hot: true },
  ],
  total: 1573043, totalAt: 6,
});

// ---------- S21: more than three typical American homes ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 420, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <Suburb t={t} id="hm" tod="day" cars={false} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
    {[0, 1, 2].map((i) => {
      const p = backOut(clamp((t - i * 8) / 8));
      return (
        <g key={i} transform={`translate(${420 + i * 540} 300) scale(${p})`}>
          <rect x={-150} y={-46} width={300} height={92} rx={46} fill={MONEY.greenDeep} stroke={MONEY.green} strokeWidth={5} />
          <text y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={MONEY.green}>$420K</text>
        </g>
      );
    })}
    <text x={960} y={980} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 26) / 6)}>
      3 HOMES {'<'} YOUR BILL
    </text>
  </g>
);

// ---------- S22: the supermarket wants twelve dollars for the boxes ----------
export const S22 = phoneCU({ mode: 'bank', Bg: DUSK, from: 'left', time: '6:40', text: '-$12.00|SuperMart: cardboard boxes', buzz: (t) => (t < 12 ? 1 : 0) });

// ---------- S23: in the game: a slightly lighter wallet ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A1830" />
    <g transform={`translate(960 520) scale(${kf(t, [[0, 1.02], [len, 1.12]])}) translate(-960 -520)`}>
      <GameScreen x={360} y={180} w={1200} h={680} t={t} on={1} />
      <text x={1310} y={690} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">-$500</text>
    </g>
    <Controller x={960} y={1010} s={2.6} />
  </g>
);
