import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, LOOKS, Glow, FONT, ShotFrame, rnd } from '../../engine';
import { KETIL, KETIL_OUT, Longhouse, Flames, Cow, INK as K } from './norse';

// Thumbnail revision (external review, 2026-11-15): three distinct concepts, each with and without text.
// A "Fire and Ice": split frame, you freezing outside (blue) | Ketil relaxed by the fire inside (orange). Text -30°C.
// B "The Secret Heater": you lying confused between two cows in the longhouse. Text COW HEATER?!
// C "Survival Challenge": you and Ketil side by side in the same blizzard, you suffering, him comfortable. Text 24 HOURS.

const YOU = LOOKS.you;
const INK = '#0B0816';

const T: React.FC<{ x: number; y: number; size: number; fill: string; anchor?: 'start' | 'middle' | 'end'; children: React.ReactNode }> = ({ x, y, size, fill, anchor = 'start', children }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke={INK} strokeWidth={size * 0.14} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

const Snow: React.FC<{ n: number; seed?: number; x0?: number; x1?: number }> = ({ n, seed = 3, x0 = 0, x1 = 1920 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => (
      <circle key={i} cx={x0 + rnd(seed, i) * (x1 - x0)} cy={rnd(seed + 4, i) * 1080} r={4 + rnd(seed + 8, i) * 9} fill="#FFFFFF" opacity={0.45 + rnd(seed + 2, i) * 0.45} />
    ))}
  </g>
);
const Breath: React.FC<{ x: number; y: number; s?: number; d?: number }> = ({ x, y, s = 1, d = 1 }) => (
  <g opacity={0.92} transform={`translate(${x} ${y}) scale(${d * s} ${s})`}>
    <circle cx={0} cy={0} r={46} fill="#F2F8FF" />
    <circle cx={-62} cy={-26} r={58} fill="#F2F8FF" />
    <circle cx={-130} cy={4} r={42} fill="#F2F8FF" />
  </g>
);
/** Shiver marks either side of a head at (x, y) with radius r. */
const Shiver: React.FC<{ x: number; y: number; r: number; c?: string }> = ({ x, y, r, c = '#FFFFFF' }) => (
  <g stroke={c} strokeWidth={12} strokeLinecap="round">
    {[-1, 1].map((d) => (
      <g key={d}>
        <path d={`M ${x + d * (r + 30)} ${y - 60} l ${d * 44} -18`} />
        <path d={`M ${x + d * (r + 40)} ${y} l ${d * 52} 0`} />
        <path d={`M ${x + d * (r + 30)} ${y + 60} l ${d * 44} 18`} />
      </g>
    ))}
  </g>
);
const Icicle: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M -14 0 L 14 0 L 0 80 Z" fill="#DFF4FF" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
);

const freezing: Pose = { ...basePose, x: 0, y: 0, yaw: 0.05, look: 0, expr: 'shock', headTilt: -3, blink: 0, tilt: 0, armL: { a: 30, b: -135 }, armR: { a: 30, b: -135 } };

// ---------------------------------------------------------------- A: fire and ice
export const VWThumbA: React.FC<{ text?: boolean }> = ({ text = true }) => (
  <AbsoluteFill style={{ background: '#0E2440' }}>
    <ShotFrame>
      <defs>
        <linearGradient id="taCold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#081834" />
          <stop offset="0.6" stopColor="#1D5A9A" />
          <stop offset="1" stopColor="#A8D4F4" />
        </linearGradient>
        <clipPath id="taRight"><path d="M 1060 0 L 1920 0 L 1920 1080 L 940 1080 Z" /></clipPath>
        <clipPath id="taLeft"><path d="M 0 0 L 1060 0 L 940 1080 L 0 1080 Z" /></clipPath>
      </defs>
      {/* left: the cold */}
      <g clipPath="url(#taLeft)">
        <rect width={1920} height={1080} fill="url(#taCold)" />
        <path d="M -40 820 Q 400 760 1100 830 L 1100 1080 L -40 1080 Z" fill="#DCEBFA" />
        <Snow n={70} seed={3} x0={0} x1={1080} />
        <Glow x={520} y={560} r={560} kind="cool" o={0.5} />
        <g transform="translate(540 1330) scale(4.0)"><Hero look={YOU} pose={freezing} shadow={0} /></g>
        <Shiver x={540} y={600} r={250} />
        <Icicle x={560} y={640} s={1.3} />
        <Breath x={300} y={760} s={1.1} d={1} />
      </g>
      {/* right: the warm longhouse, Ketil at ease by the fire */}
      <g clipPath="url(#taRight)">
        <g transform="translate(-260 -420) scale(1.55)"><Longhouse t={40} mode="night" fire={1} cows={false} smoke={0.4} /></g>
        <rect x={900} y={0} width={1020} height={1080} fill="#FF8A2A" opacity={0.12} />
        <Glow x={1480} y={900} r={640} kind="warm" o={0.85} />
        <g transform="translate(1440 1250) scale(3.0)">
          <Hero look={KETIL} pose={{ ...basePose, x: 0, y: 0, yaw: -0.3, look: -0.7, expr: 'smug', blink: 0, tilt: -8, headTilt: 8, legL: { a: -80, b: 82 }, legR: { a: -74, b: 86 }, armL: { a: 150, b: -120 }, armR: { a: 150, b: -120 } }} shadow={0} />
        </g>
        <g transform="translate(1780 1090) scale(1.5)"><Flames x0={-160} x1={160} y={0} t={20} k={1.1} /></g>
      </g>
      {/* the seam: frost meeting firelight */}
      <path d="M 1060 0 L 940 1080" stroke="#FFFFFF" strokeWidth={16} />
      <path d="M 1060 0 L 940 1080" stroke={INK} strokeWidth={6} />
      {text ? <T x={50} y={250} size={250} fill="#FFFFFF">-30°C</T> : null}
    </ShotFrame>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- B: the secret heater
export const VWThumbB: React.FC<{ text?: boolean }> = ({ text = true }) => (
  <AbsoluteFill style={{ background: '#2A1A12' }}>
    <ShotFrame>
      <g transform="translate(-700 -380) scale(1.7)"><Longhouse t={40} mode="night" fire={0.6} cows={false} smoke={0.2} /></g>
      <rect width={1920} height={1080} fill="#1A0E08" opacity={0.35} />
      <Glow x={960} y={760} r={760} kind="warm" o={0.75} />
      {/* straw */}
      <path d="M -40 980 Q 960 860 1960 980 L 1960 1080 L -40 1080 Z" fill="#C8A050" />
      {Array.from({ length: 40 }).map((_, i) => <path key={i} d={`M ${rnd(5, i) * 1920} ${930 + rnd(6, i) * 120} l ${-30 + rnd(7, i) * 60} -26`} stroke="#E8C870" strokeWidth={6} strokeLinecap="round" />)}
      {/* two cows, heads toward the middle */}
      <Cow x={200} y={920} s={2.5} t={0} flip c="#8A5A3A" look={1} />
      <Cow x={1720} y={920} s={2.5} t={20} c="#6A4430" look={-1} />
      {/* heat coming off them */}
      <g stroke="#FF8A2A" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.9}>
        {[220, 330, 1590, 1700].map((x) => <path key={x} d={`M ${x} 560 q 22 -34 0 -68 q -22 -34 0 -68`} />)}
      </g>
      {/* you, squeezed in between, lying on your back in the straw, very confused */}
      <g transform="translate(1000 900) rotate(-72) scale(2.9)">
        <Hero look={YOU} pose={{ ...basePose, x: 0, y: 0, yaw: 0, look: 0.4, expr: 'worried', blink: 0, headTilt: 62, armL: { a: 40, b: -30 }, armR: { a: 70, b: -40 } }} shadow={0} />
      </g>
      <g fontFamily={FONT.title} fontWeight={800} fill="#FFFFFF" stroke={INK} strokeWidth={10} paintOrder="stroke">
        <text x={820} y={540} fontSize={220} transform="rotate(14 820 540)">?</text>
        <text x={380} y={560} fontSize={170} transform="rotate(-14 380 560)">?</text>
      </g>
      {text ? (
        <g>
          <T x={960} y={250} size={210} fill="#FFFFFF" anchor="middle">COW <tspan fill="#FFD23A">HEATER?!</tspan></T>
        </g>
      ) : null}
    </ShotFrame>
  </AbsoluteFill>
);

// ---------------------------------------------------------------- C: survival challenge
export const VWThumbC: React.FC<{ text?: boolean }> = ({ text = true }) => (
  <AbsoluteFill style={{ background: '#0E2440' }}>
    <ShotFrame>
      <defs>
        <linearGradient id="tcBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0A1B3A" />
          <stop offset="0.6" stopColor="#2A6AA8" />
          <stop offset="1" stopColor="#B8DCF6" />
        </linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#tcBg)" />
      <path d="M -40 760 L 300 520 L 520 660 L 820 470 L 1100 680 L 1400 500 L 1700 690 L 1980 540 L 1980 1080 L -40 1080 Z" fill="#2E5C8C" />
      <path d="M -40 900 Q 960 820 1980 900 L 1980 1080 L -40 1080 Z" fill="#DCEBFA" />
      <Snow n={110} seed={9} />
      {/* you: frozen stiff, blue light */}
      <Glow x={560} y={600} r={520} kind="cool" o={0.6} />
      <g transform="translate(560 1360) scale(3.9)"><Hero look={YOU} pose={{ ...freezing, yaw: 0.15, look: 0.5, tilt: 4 }} shadow={0} /></g>
      <Shiver x={570} y={620} r={240} />
      <Icicle x={590} y={660} s={1.2} />
      <Breath x={400} y={790} s={0.9} />
      {/* Ketil: wrapped in wool and fur, perfectly fine */}
      <Glow x={1380} y={620} r={480} kind="warm" o={0.45} />
      <g transform="translate(1380 1300) scale(3.7)">
        <Hero look={KETIL_OUT} pose={{ ...basePose, x: 0, y: 0, yaw: -0.15, look: -0.6, expr: 'smug', blink: 0, tilt: -3, headTilt: 5, armL: { a: 35, b: -100 }, armR: { a: 35, b: -100 } }} shadow={0} />
      </g>
      {text ? <T x={960} y={230} size={220} fill="#FFD23A" anchor="middle">24 HOURS</T> : null}
    </ShotFrame>
  </AbsoluteFill>
);

const noText = (C: React.FC<{ text?: boolean }>): React.FC => {
  const N: React.FC = () => <C text={false} />;
  return N;
};
export const VWThumbAClean = noText(VWThumbA);
export const VWThumbBClean = noText(VWThumbB);
export const VWThumbCClean = noText(VWThumbC);
void K;
