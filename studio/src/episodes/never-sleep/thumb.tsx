import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame, AlarmClock } from '../../engine';
import { YOU_PJ } from './common';

// Thumbnail: you, close, in pyjamas, eyes wide open with dark rings, lit by a red alarm clock reading 03:00;
// "NO SLEEP" with NO in yellow.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const NeverSleepThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.25, look: -0.5, expr: 'shock', headTilt: 4, blink: 0, glint: 1, armL: { a: 20, b: -20 }, armR: { a: 20, b: -20 } };
  return (
    <AbsoluteFill style={{ background: '#0E1430' }}>
      <ShotFrame>
        <defs>
          <linearGradient id="nsbg" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#141A4A" />
            <stop offset="0.6" stopColor="#1A1238" />
            <stop offset="1" stopColor="#4A0E2A" />
          </linearGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#nsbg)" />
        <Glow x={1500} y={700} r={800} kind="red" o={0.7} />
        <Glow x={300} y={300} r={600} kind="cool" o={0.45} />
        {/* you, close */}
        <g transform="translate(1250 1300) scale(4.3)">
          <Hero look={YOU_PJ} pose={me} shadow={0} />
        </g>
        {/* the alarm clock: 03:00 */}
        <g transform="rotate(-6 560 860)">
          <AlarmClock x={560} y={920} s={2.2} text="03:00" />
        </g>
        <Glow x={560} y={790} r={360} kind="red" o={0.6} />
        <T x={60} y={300} size={260} fill="#FFD23A">NO</T>
        <T x={60} y={540} size={230} fill="#FFFFFF">SLEEP</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
