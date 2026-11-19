import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame } from '../../engine';
import { YOU, Star, PoliceCar, Hedge } from './common';

// Thumbnail: you, close, peeking out of a hedge at night with wide eyes; red and blue police light behind; five wanted
// stars of our own design above, the last one cracked; "24 HOURS" with 24 in yellow. No game art, logos or fonts.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const Gta24HoursThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.2, look: -0.45, expr: 'shock', headTilt: -4, blink: 0, glint: 1, armL: { a: 30, b: -20 }, armR: { a: 160, b: 40 } };
  return (
    <AbsoluteFill style={{ background: '#0E1430' }}>
      <ShotFrame>
        <defs>
          <linearGradient id="g24bg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#0E1A5A" />
            <stop offset="0.55" stopColor="#1A1238" />
            <stop offset="1" stopColor="#6A0E1E" />
          </linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#g24bg)" />
        <Glow x={300} y={420} r={700} kind="cool" o={0.75} />
        <Glow x={1750} y={380} r={650} kind="red" o={0.8} />
        {/* the police car, small and far behind */}
        <g opacity={0.9}><PoliceCar x={420} y={980} s={1.3} t={5} /></g>
        {/* you, close, in the hedge */}
        <g transform="translate(1330 1250) scale(4.2)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        <Hedge x0={760} x1={2000} y0={860} y1={1100} t={0} />
        {/* five stars, the last cracked */}
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} x={110 + i * 130} y={110} r={56} on={1} />
        ))}
        <path d="M 640 60 L 625 100 L 650 118 L 632 165" stroke="#0B0816" strokeWidth={8} fill="none" />
        <T x={60} y={400} size={270} fill="#FFD23A">24</T>
        <T x={60} y={630} size={200} fill="#FFFFFF">HOURS</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
