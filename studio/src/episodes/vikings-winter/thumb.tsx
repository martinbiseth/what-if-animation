import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, Look, basePose, LOOKS, Glow, FONT, ShotFrame, Smartphone, rnd } from '../../engine';

const VIKING: Look = { ...LOOKS.you, jacket: '#5E6E3A', jacketShade: '#48552C', accent: '#C8A040', robe: 'tunic', belt: '#4A2E1A', extra: undefined, hair: '#C2501E', shoe: '#5A3A22', noPhones: true };

// Thumbnail for "How Vikings Survived -30°C Winters With NO Electricity": you, huge and frozen in a blizzard (frost on
// the hood, an icicle under the nose, chattering teeth), a snowed-in longhouse with a glowing door behind, your phone
// dead at 0 %. Text: "-30°C" white and frosted, "NO POWER" with POWER in yellow.

const YOU = LOOKS.you;
const INK = '#0B0816';

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke={INK} strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

/** A snowed-in longhouse far behind: turf roof under snow, a warm glowing door, smoke from the roof hole. */
const Longhouse: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -330 0 L -300 -150 L 300 -150 L 330 0 Z" fill="#3A2A2E" />
    <path d="M -380 -130 Q 0 -330 380 -130 Q 0 -190 -380 -130 Z" fill="#E8F2FF" />
    <path d="M -380 -130 Q 0 -190 380 -130 L 360 -110 Q 0 -168 -360 -110 Z" fill="#B8CCE8" />
    <rect x={-40} y={-110} width={80} height={110} fill="#FFB347" />
    <rect x={-40} y={-110} width={80} height={110} fill="none" stroke="#2A1A1E" strokeWidth={10} />
    <path d="M -420 0 Q -200 -50 0 -14 Q 200 -50 420 0 L 420 30 L -420 30 Z" fill="#DCEAFB" />
    <path d="M 30 -268 q -30 -40 0 -80 q 30 -40 0 -80" stroke="#C8D4E4" strokeWidth={26} fill="none" strokeLinecap="round" opacity={0.6} />
  </g>
);

export const VikingsWinterThumb: React.FC = () => {
  const me: Pose = {
    ...basePose, x: 0, y: 0, yaw: -0.2, look: -0.35, expr: 'shock', headTilt: -4, blink: 0, tilt: -3,
    armL: { a: 30, b: -130 }, armR: { a: 25, b: -125 },
  };
  return (
    <AbsoluteFill style={{ background: '#0E2440' }}>
      <ShotFrame>
        <defs>
          <linearGradient id="vthbg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#0A1B3A" />
            <stop offset="0.55" stopColor="#1F5A96" />
            <stop offset="1" stopColor="#8FC8F0" />
          </linearGradient>
          <radialGradient id="vthfrost" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0.55" stopColor="#FFFFFF" stopOpacity="0" />
            <stop offset="1" stopColor="#DFF2FF" stopOpacity="0.85" />
          </radialGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#vthbg)" />
        {/* mountains */}
        <path d="M -40 760 L 260 470 L 430 610 L 700 380 L 980 640 L 1220 430 L 1500 660 L 1760 420 L 1980 600 L 1980 1080 L -40 1080 Z" fill="#2E5C8C" />
        <path d="M 700 380 L 780 455 L 735 450 L 700 480 L 660 445 L 625 452 Z M 1220 430 L 1300 505 L 1255 500 L 1220 525 L 1185 495 L 1150 500 Z M 1760 420 L 1840 495 L 1790 488 L 1760 512 L 1725 485 L 1690 492 Z" fill="#EAF4FF" />
        <path d="M -40 860 Q 500 780 1000 840 Q 1500 900 1980 820 L 1980 1080 L -40 1080 Z" fill="#CFE2F7" />
        <Longhouse x={430} y={890} s={0.95} />
        <Glow x={430} y={840} r={260} kind="warm" o={0.7} />
        {/* Ketil in the doorway: warm, smug, a red beard and a fur hat */}
        <g transform="translate(800 1020) scale(1.6)">
          <Glow x={0} y={-150} r={200} kind="warm" o={0.6} />
          <Hero look={VIKING} pose={{ ...basePose, x: 0, y: 0, yaw: 0.15, look: 0.6, expr: 'smug', blink: 0, armR: { a: 95, b: -10 }, armL: { a: 20, b: -80 } }} shadow={0} />
          <path d="M -60 -168 Q -70 -60 -6 -36 Q 14 -28 34 -40 Q 80 -70 66 -168 Q 52 -136 30 -128 Q 4 -122 -24 -128 Q -48 -136 -60 -168 Z" fill="#C2501E" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <path d="M -20 -112 Q 4 -104 30 -112" stroke="#E07A3A" strokeWidth={6} fill="none" strokeLinecap="round" />
          <path d="M -66 -206 Q -70 -282 4 -286 Q 78 -282 74 -206 Q 4 -222 -66 -206 Z" fill="#7A5232" stroke={INK} strokeWidth={4} />
          <path d="M -72 -210 Q 4 -230 78 -210 L 78 -190 Q 4 -210 -72 -190 Z" fill="#B88A5A" stroke={INK} strokeWidth={4} />
        </g>
        {/* blizzard behind */}
        {Array.from({ length: 90 }).map((_, i) => (
          <circle key={i} cx={rnd(3, i) * 1920} cy={rnd(7, i) * 1080} r={3 + rnd(11, i) * 7} fill="#FFFFFF" opacity={0.35 + rnd(5, i) * 0.4} />
        ))}
        <Glow x={1380} y={560} r={720} kind="cool" o={0.55} />
        {/* you, close */}
        <g transform="translate(1390 1230) scale(4.1)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        {/* icicle under the nose, chattering-teeth marks, breath cloud */}
        <path d="M 1300 520 L 1322 520 L 1310 600 Z" fill="#DFF4FF" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M 1180 470 l -40 -14 M 1172 520 l -46 4 M 1180 570 l -40 16" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" />
        <path d="M 1610 470 l 40 -14 M 1618 520 l 46 4 M 1610 570 l 40 16" stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" />
        <g opacity={0.9}>
          <circle cx={1150} cy={640} r={44} fill="#F2F8FF" />
          <circle cx={1090} cy={610} r={56} fill="#F2F8FF" />
          <circle cx={1020} cy={640} r={40} fill="#F2F8FF" />
        </g>
        {/* frosted frame edge */}
        <rect width={1920} height={1080} fill="url(#vthfrost)" opacity={0.35} />
        {/* the dead phone */}
        <g transform="translate(1720 880) rotate(14)">
          <Smartphone x={0} y={0} s={0.5} mode="off" t={0} status={false} />
          <g transform="translate(-60 -40)">
            <rect x={0} y={0} width={110} height={56} rx={10} fill="none" stroke="#FF2E2E" strokeWidth={10} />
            <rect x={110} y={16} width={12} height={24} rx={4} fill="#FF2E2E" />
            <rect x={12} y={12} width={10} height={32} fill="#FF2E2E" />
          </g>
          <text x={0} y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FF2E2E" stroke={INK} strokeWidth={8} paintOrder="stroke">0%</text>
        </g>
        {/* text */}
        <T x={50} y={270} size={260} fill="#FFFFFF">-30°C</T>
        <T x={60} y={470} size={170} fill="#FFFFFF">NO</T>
        <T x={60} y={640} size={170} fill="#FFD23A">POWER</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
