import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, FONT, Glow, ShotFrame } from '../../engine';
import { YOU, HeadBar, SpeedLines, flying } from './common';

// Thumbnail: you, close, flung through the air with a shocked face; a huge health bar over your head down to a red
// sliver as the one object; "RESPAWN / IRL?" with RESPAWN in yellow. Our own character and colours only.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const GtaPhysicsThumb: React.FC = () => {
  const me = { ...flying(0, 0, 1, -18, 3), look: 0.4, glint: 1, blink: 0 };
  return (
    <AbsoluteFill style={{ background: '#1B0F33' }}>
      <ShotFrame>
        <defs>
          <linearGradient id="gtthbg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#1B0F33" />
            <stop offset="0.55" stopColor="#5B1E6E" />
            <stop offset="1" stopColor="#FF7A2A" />
          </linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#gtthbg)" />
        <Glow x={1380} y={560} r={720} kind="warm" o={0.55} />
        <g opacity={0.9}>
          <SpeedLines x={900} y={420} dir={-1} t={6} n={7} len={360} o={0.5} />
          <SpeedLines x={980} y={760} dir={-1} t={11} n={6} len={300} o={0.4} />
        </g>
        {/* you, flung */}
        <g transform="translate(1470 900) scale(3.3)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        {/* the health bar: the one object */}
        <HeadBar x={1560} y={100} s={2.2} p={0.08} t={0} />
        <T x={1700} y={250} size={100} fill="#FF4A3A">-96</T>
        {/* text */}
        <T x={50} y={300} size={200} fill="#FFD23A">RESPAWN</T>
        <T x={50} y={560} size={250} fill="#FFFFFF">IRL?</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
