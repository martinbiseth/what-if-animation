import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame, Smartphone } from '../../engine';
import { YOU } from './common';

// Thumbnail: you, close, squashed flat under huge gravity, eyes bulging; giant arrows pressing down; "GRAVITY / x16"
// with x16 in red; your phone's gravity app reading 156.9 as the one object.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

const Down: React.FC<{ x: number; y: number; s: number; o?: number }> = ({ x, y, s, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <path d="M -40 -160 L 40 -160 L 40 0 L 95 0 L 0 110 L -95 0 L -40 0 Z" fill="#FFD23A" stroke="#0B0816" strokeWidth={12} strokeLinejoin="round" />
  </g>
);

export const GravityThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.15, look: -0.3, expr: 'shock', squash: 0.22, headTilt: 0, blink: 0, glint: 1, armL: { a: 20, b: -10 }, armR: { a: 150, b: 60 } };
  return (
    <AbsoluteFill style={{ background: '#2A0E1E' }}>
      <ShotFrame>
        <defs>
          <linearGradient id="gthbg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#3A0F3A" />
            <stop offset="0.6" stopColor="#C2361E" />
            <stop offset="1" stopColor="#FF8A2A" />
          </linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#gthbg)" />
        {Array.from({ length: 14 }).map((_, i) => (
          <rect key={i} x={760 + i * 85} y={0} width={10} height={1080} fill="#FFFFFF" opacity={0.06} />
        ))}
        <Glow x={1350} y={640} r={700} kind="warm" o={0.6} />
        {/* the floor */}
        <rect x={0} y={1000} width={1920} height={80} fill="#1A0E14" />
        <path d="M 1000 1000 L 1100 1030 L 1180 1010 L 1300 1050 L 1420 1015 L 1560 1045 L 1700 1005" stroke="#0B0816" strokeWidth={8} fill="none" />
        {/* you, squashed */}
        <g transform="translate(1360 1160) scale(3.9)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        {/* sweat */}
        {[[1050, 520], [1680, 470], [1720, 600]].map(([x, y], i) => (
          <path key={i} d={`M ${x} ${y} q 22 36 0 56 q -22 -20 0 -56 Z`} fill="#8FD3FF" stroke="#0B0816" strokeWidth={6} />
        ))}
        <Down x={1060} y={150} s={1.0} />
        <Down x={1360} y={110} s={1.25} />
        <Down x={1680} y={150} s={1.0} />
        {/* text */}
        <T x={60} y={250} size={210} fill="#FFFFFF">GRAVITY</T>
        <T x={60} y={500} size={260} fill="#FF2E2E">x16</T>
        {/* the phone */}
        <g transform="translate(300 830) rotate(-10)">
          <Smartphone x={0} y={0} s={0.62} mode="gmeter" text="156.9" t={40} status={false} />
        </g>
      </ShotFrame>
    </AbsoluteFill>
  );
};
