import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame } from '../../engine';
import { Sky, FarCity, Aqueduct, Cypress, CarFront, Temple } from './sets';
import { YOU, SOLDIER } from './common';

// Thumbnail: sunset over Rome, a red modern car head-on with its headlights blazing, you huge on the right, smug, a
// legionary behind the car gaping; "CAR VS / ROME" with ROME in yellow.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const RomeCarThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.25, look: -0.5, expr: 'smug', headTilt: -6, armL: { a: -20, b: -40 }, armR: { a: 10, b: -10 }, blink: 0 };
  const sol: Pose = { ...basePose, x: 0, y: 0, yaw: 0.3, look: 0.6, expr: 'shock', armR: { a: 150, b: 20 }, armL: { a: -150, b: -20 }, blink: 0 };
  return (
    <AbsoluteFill style={{ background: '#1A1020' }}>
      <ShotFrame>
        <Sky id="rth" mode="dusk" t={0} sunX={980} sunY={700} />
        <FarCity x={1000} y={760} s={1.6} mode="dusk" />
        <Aqueduct x0={-300} x1={2300} y={860} h={260} mode="dusk" tiers={2} />
        <Temple x={300} y={900} w={520} mode="dusk" gold />
        <Cypress x={1180} y={920} h={420} color="#2A1A2E" />
        <rect x={0} y={880} width={1920} height={300} fill="#3A2434" />
        {/* the soldier behind the car, arms flung up */}
        <g transform="translate(1170 700) scale(1.6)">
          <Hero look={SOLDIER} pose={sol} shadow={0} />
        </g>
        {/* the car, headlights on */}
        <Glow x={660} y={800} r={700} o={0.35} />
        <CarFront x={660} y={1130} s={2.05} lights={1} high={0} id="thcar" />
        {[-1, 1].map((sd) => (
          <g key={sd} transform={`translate(${660 + sd * 352} 794)`}>
            <Glow x={0} y={0} r={200} o={0.9} />
            <path d="M -170 0 L 170 0 M 0 -90 L 0 90" stroke="#FFFBE6" strokeWidth={7} strokeLinecap="round" opacity={0.85} />
          </g>
        ))}
        {/* you, huge on the right */}
        <g transform="translate(1560 1150) scale(3.5)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        <T x={50} y={215} size={200} fill="#FFFFFF">CAR VS</T>
        <T x={50} y={420} size={210} fill="#FFD23A">ROME</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
