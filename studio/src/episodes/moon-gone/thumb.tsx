import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, FONT, Glow, ShotFrame, basePose, NightSky, Stars } from '../../engine';
import { YOU, Hole } from './common';

// Thumbnail: you, close, shocked, looking up; the one object is a black, starless hole in the sky where the Moon was,
// with the Moon's dashed ghost outline. "MOON / GONE?" with MOON in yellow. Our own character and colours only.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const MoonGoneThumb: React.FC = () => {
  const me = { ...basePose, x: 0, y: 0, scale: 1, yaw: -0.3, look: -0.7, headTilt: -10, expr: 'shock' as const, blink: 0, glint: 1, glintColor: '#CFE6FF' };
  return (
    <AbsoluteFill style={{ background: '#070B1E' }}>
      <ShotFrame>
        <NightSky id="mgth" horizonY={1080} />
        <rect width={1920} height={1080} fill="#02020A" opacity={0.25} />
        <Stars seed={7} x0={0} y0={0} w={1920} h={1080} t={0} n={360} o={1} />
        {/* the hole: the one object */}
        <Glow x={540} y={330} r={420} kind="cool" o={0.35} />
        <Hole x={540} y={330} r={220} />
        <circle cx={540} cy={330} r={232} fill="none" stroke="#CFE6FF" strokeWidth={8} strokeDasharray="26 20" opacity={0.85} />
        {/* you, close, lit by what's left */}
        <g transform="translate(1440 1020) scale(3.4)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        <T x={60} y={830} size={230} fill="#FFD23A">MOON</T>
        <T x={60} y={1040} size={210} fill="#FFFFFF">GONE?</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
