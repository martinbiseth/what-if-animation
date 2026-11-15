import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame, LOOKS } from '../../engine';
import { Coin, HundredBill } from './kit';

// Thumbnail for "What If You Went Back to 2010 With $100?": you, wide-eyed and grinning, holding up a glowing
// bitcoin; a green price arrow rocketing up behind; a $100 bill flying; text "$100 IN 2010" with 2010 in yellow.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const BackTo2010Thumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.2, expr: 'shock', armR: { a: 150, b: 12 }, headTilt: 6, look: 0.5, blink: 0, glint: 1 };
  return (
    <AbsoluteFill style={{ background: '#0B1A14' }}>
      <ShotFrame>
        <linearGradient id="b10sky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0E2A3A" />
          <stop offset="0.6" stopColor="#123A2A" />
          <stop offset="1" stopColor="#1E6A3A" />
        </linearGradient>
        <rect width={1920} height={1080} fill="url(#b10sky)" />
        {[200, 400, 600, 800].map((y) => <line key={y} x1={0} x2={1920} y1={y} y2={y} stroke="#2A5A4A" strokeWidth={4} opacity={0.6} />)}
        {/* the price arrow, rocketing */}
        <path d="M 640 1040 L 860 900 L 960 960 L 1120 700 L 1220 760 L 1420 380 L 1520 450 L 1800 60" stroke="#0B0816" strokeWidth={70} fill="none" strokeLinejoin="round" />
        <path d="M 640 1040 L 860 900 L 960 960 L 1120 700 L 1220 760 L 1420 380 L 1520 450 L 1800 60" stroke="#3CE06A" strokeWidth={46} fill="none" strokeLinejoin="round" />
        <path d="M 1700 70 L 1840 20 L 1810 170 Z" fill="#3CE06A" stroke="#0B0816" strokeWidth={10} strokeLinejoin="round" />
        <radialGradient id="b10v" cx="0.62" cy="0.55" r="0.75">
          <stop offset="0.5" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#050A08" stopOpacity={0.75} />
        </radialGradient>
        <rect width={1920} height={1080} fill="url(#b10v)" />
        <HundredBill x={1700} y={820} s={0.7} rot={-24} />
        {/* you, coin held up */}
        <g transform="translate(1180 990) scale(3.3)">
          <Hero look={LOOKS.you} pose={me} shadow={0} />
        </g>
        <path d="M 1310 770 Q 1360 670 1430 610" stroke="#F07A2A" strokeWidth={68} strokeLinecap="round" fill="none" />
        <Glow x={1490} y={390} r={420} kind="warm" o={0.9} />
        <Coin x={1490} y={390} r={195} />
        <ellipse cx={1440} cy={585} rx={56} ry={50} fill="#26232F" stroke="#100E16" strokeWidth={8} />
        {/* text */}
        <T x={60} y={330} size={300} fill="#FFFFFF">$100</T>
        <T x={60} y={560} size={190} fill="#FFFFFF">IN</T>
        <T x={330} y={560} size={190} fill="#FFD21A">2010</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
