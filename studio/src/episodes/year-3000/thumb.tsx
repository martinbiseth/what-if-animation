import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame } from '../../engine';
import { YOU, FutureCity, Vee, SkyCar } from './common';

// Thumbnail: you, close, shocked, with the year-3000 city behind (sky cars, glowing towers) and Vee floating at your
// shoulder; "YEAR 3000" with 3000 in yellow. One clear object: the robot.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const Year3000Thumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.25, look: -0.5, expr: 'shock', headTilt: 5, blink: 0, glint: 1, glintColor: '#8AF0FF', armL: { a: 30, b: -20 }, armR: { a: 30, b: -20 } };
  return (
    <AbsoluteFill style={{ background: '#1A1238' }}>
      <ShotFrame>
        <g transform="translate(960 540) scale(1.15) translate(-960 -600)">
          <FutureCity t={40} id="th" mode="dusk" deck={false} />
        </g>
        <rect width={1920} height={1080} fill="#120C2A" opacity={0.25} />
        <SkyCar x={820} y={180} s={1.2} color="#FFD23A" />
        <SkyCar x={260} y={900} s={0.9} flip />
        <Glow x={1350} y={520} r={700} kind="cool" o={0.7} />
        <g transform="translate(1380 1330) scale(4.3)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        <Vee x={820} y={850} s={1.7} t={0} mood="happy" look={0.6} />
        <T x={60} y={330} size={230} fill="#FFFFFF">YEAR</T>
        <T x={60} y={620} size={310} fill="#FFD23A">3000</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
