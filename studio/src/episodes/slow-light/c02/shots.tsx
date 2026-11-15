import React from 'react';
import {
  Hero, Pose, ShotProps, basePose, camT, kf, clamp, idleBlink, factCard, chapterCard, Schematic, SCH, SchLabel, Glow, FONT, backOut,
  Bedroom, AlarmClock, Kitchen, KITCHEN, stand,
} from '../../../engine';
import { YOU, MO, faceCU, bigWord, iconBoard } from '../common';
import { FadeStreet, LightDot, speedText } from '../sets';
import { Caption } from '../kit';
import words from './words.json';

// Chapter 2, the rules: how fast light is, how it halves every hour from Monday 7 AM, what slows and what doesn't,
// and the oldest rule in physics: everything you see already happened. That rule pays off in chapters 6 and 7.

const W = words as { w: string; s: number; e: number }[];
const ws = (w: string, n = 1) => { let k = 0; const x = W.find((q) => q.w.replace(/[^\w]/g, '').toLowerCase() === w.toLowerCase() && ++k === n); return x ? x.s : 0; };
const rel = (a: string, b: string, na = 1, nb = 1) => Math.round((ws(b, nb) - ws(a, na)) * 30) + 2;

// ---------- S1: chapter card ----------
export const S1 = chapterCard({ kicker: 'HOW IT WORKS', title: 'THE RULES', ground: 'schematic' });

// ---------- S2: the Earth from space, a dot of light lapping it seven and a half times in one second ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const laps = clamp(t / Math.max(1, len - 10)) * 7.5;
  const a = laps * Math.PI * 2;
  return (
    <g>
      <Schematic t={t} id="c2orb" />
      <circle cx={960} cy={560} r={250} fill="#2E6AB8" stroke={SCH.line} strokeWidth={6} />
      <path d="M 820 440 q 80 -40 120 30 q 60 60 -20 120 q -60 40 -100 -30 Z M 1020 620 q 60 -10 90 40 q 10 60 -60 70 Z" fill="#4E9A5E" />
      <ellipse cx={960} cy={560} rx={330} ry={330} fill="none" stroke={SCH.dim} strokeWidth={3} strokeDasharray="10 12" />
      {[0, 0.06, 0.12, 0.18].map((d, i) => (
        <circle key={i} cx={960 + Math.cos(a - d * 6) * 330} cy={560 + Math.sin(a - d * 6) * 330} r={16 - i * 3} fill="#FFD23A" opacity={1 - i * 0.22} />
      ))}
      <Glow x={960 + Math.cos(a) * 330} y={560 + Math.sin(a) * 330} r={80} kind="warm" o={0.8} />
      <text x={960} y={980} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#FFD23A">{`${laps.toFixed(1)} LAPS`}</text>
      <SchLabel x={960} y={170} t={t} text="IN ONE SECOND" size={44} color={SCH.dim} />
    </g>
  );
};

// ---------- S3: the number ----------
export const S3 = factCard({ value: 299792, suffix: ' km/s', label: 'THE SPEED OF LIGHT', sub: 'NIST: exactly 299,792,458 metres a second' });

// ---------- S4: Monday, 7:00 AM: your bedroom, the alarm going ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 990]]), 520, kf(t, [[0, 1.05], [len, 1.12]]))}>
    <Bedroom t={t + 40} clock="7:00" />
    <g transform={`translate(${Math.sin(t * 1.3) * 3} 0)`}><AlarmClock x={760} y={620} s={1.1} text="7:00" /></g>
    <Caption t={t} text="MONDAY, 7:00 AM" y={200} size={96} />
  </g>
);

// ---------- S5: ÷2 ----------
export const S5 = bigWord({ kicker: 'EVERY HOUR', word: 'HALF AS FAST', color: '#FFD23A', size: 170 });

// ---------- S6: the bars: the speed of light at each hour, halving, bar after bar, labelled ----------
export const S6: React.FC<ShotProps> = ({ t }) => {
  const hours = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const at1 = rel('Hour', 'one'), at2 = rel('Hour', 'two'), at10 = rel('Hour', 'ten');
  const show = (h: number) => (h === 0 ? 0 : h === 1 ? at1 : h === 2 ? at2 : at2 + ((h - 2) * (at10 - at2)) / 8);
  return (
    <g>
      <Schematic t={t} id="c2bar" />
      <SchLabel x={960} y={140} t={t} text="THE SPEED OF LIGHT, HOUR BY HOUR" size={42} color={SCH.dim} />
      {hours.map((h) => {
        const k = backOut(clamp((t - show(h)) / 8));
        const H = 640 / Math.pow(2, h);
        const x = 260 + h * 140;
        return (
          <g key={h} opacity={k > 0 ? 1 : 0}>
            <rect x={x - 45} y={880 - Math.max(3, H) * k} width={90} height={Math.max(3, H) * k} fill={h === 0 ? SCH.line : '#FFD23A'} rx={6} />
            <text x={x} y={930} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={SCH.line}>{h}</text>
            {h === 0 || h === 1 || h === 2 || h === 10 ? <text x={x} y={860 - Math.max(3, H) * k} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill={SCH.line}>{speedText(h)}</text> : null}
          </g>
        );
      })}
      <text x={960} y={990} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} letterSpacing={6} fill={SCH.dim}>HOUR</text>
    </g>
  );
};

// ---------- S7: close, you, smug: you could beat it in a race ----------
export const S7 = faceCU({ look: YOU, Bg: ({ t, id }) => <FadeStreet t={t} id={id} sun={1} />, faces: [[0, 'neutral'], [14, 'smug']], yaw: 0.3, zoom: [3.1, 3.3] });

// ---------- S8: what slows down: radio, Wi-Fi, phone signals, GPS ----------
export const S8 = iconBoard({
  title: 'SLOWS DOWN',
  items: [
    { name: 'radio', label: 'RADIO', at: rel('Only', 'Radio') },
    { name: 'tower', label: 'WI-FI', at: rel('Only', 'Wi') },
    { name: 'phone', label: 'PHONE SIGNALS', at: rel('Only', 'Phone') },
    { name: 'chip', label: 'GPS', at: rel('Only', 'GPS') },
  ],
});

// ---------- S9: what doesn't: your body, electricity, atoms ----------
export const S9 = iconBoard({
  title: 'STILL WORKS FINE',
  items: [
    { name: 'heart', label: 'YOUR BODY', at: 4, live: 4 },
    { name: 'plug', label: 'ELECTRICITY', at: rel('Your', 'electricity'), live: rel('Your', 'electricity') },
    { name: 'brain', label: 'ATOMS', at: rel('Your', 'atoms'), live: rel('Your', 'atoms') },
  ],
});

// ---------- S10: close, you, a wink: otherwise this would be a very short video ----------
export const S10 = faceCU({ look: YOU, Bg: ({ t, id }) => <FadeStreet t={t} id={id} sun={1} />, faces: [[0, 'smug'], [20, 'happy']], yaw: -0.3, zoom: [3.3, 3.4] });

// ---------- S11: the oldest rule ----------
export const S11 = bigWord({ kicker: 'THE OLDEST RULE IN PHYSICS', word: 'YOU SEE THE PAST', color: '#FFD23A', size: 150 });

// ---------- S12: the kitchen: Mo across the island, light dots leaving him and arriving at your eye ----------
export const S12: React.FC<ShotProps> = ({ t }) => {
  const A = stand(KITCHEN, 0.3, 0.45), B = stand(KITCHEN, 0.72, 0.45);
  const me: Pose = { ...basePose, ...A, yaw: 0.5, expr: 'neutral', blink: idleBlink(t, 2), look: 0.5 };
  const mo: Pose = { ...basePose, ...B, yaw: -0.5, expr: 'happy', blink: idleBlink(t, 5), look: -0.5, armR: { a: 150 + Math.sin(t / 3) * 12, b: 30 } };
  const ph = (t % 40) / 40;
  return (
    <g transform={camT(960, 540, 1.35)}>
      <Kitchen t={t + 30} />
      <Hero look={YOU} pose={me} />
      <Hero look={MO} pose={mo} />
      {[0, 0.33, 0.66].map((d, i) => <LightDot key={i} x0={B.x - 30} y0={B.y - 160 * B.scale} x1={A.x + 30} y1={A.y - 170 * A.scale} p={(ph + d) % 1} r={8} />)}
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={clamp(t / 10)}>WHAT YOU SEE ALREADY HAPPENED</text>
    </g>
  );
};

// ---------- S13: a billionth of a second ----------
export const S13 = bigWord({ kicker: 'TODAY, THAT PAST IS', word: '0.000000001 s', color: '#F6EFE3', size: 150 });

// ---------- S14: close, you, serious, slow push in ----------
export const S14 = faceCU({ look: YOU, Bg: ({ t, id }) => <FadeStreet t={t} id={id} sun={0.8} />, faces: [[0, 'neutral']], yaw: 0.1, eyes: 0, zoom: [3.0, 3.6] });

// ---------- S15: wide, the street, the sun beginning to dim: very, very noticeable ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.12], [len, 1.0]]))}>
    <FadeStreet t={t + 300} sun={kf(t, [[0, 1], [len, 0.55]])} />
  </g>
);
