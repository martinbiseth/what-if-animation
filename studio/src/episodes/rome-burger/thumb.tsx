import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, LOOKS, Glow, FONT, ShotFrame, joints } from '../../engine';
import { RomeStreet, Burger } from './sets';

// Thumbnail: you in close-up on a Roman street at night, the sky over the Circus glowing orange behind you, holding
// up a huge burger; "BURGERS IN / ROME?" with ROME? in yellow. A generic burger, no brand anywhere.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const RomeBurgerThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.25, look: -0.3, expr: 'shock', armR: { a: 40, b: 110 }, headTilt: 6, blink: 0, glint: 1, glintColor: '#FFC27A' };
  const HX = 1260, HY = 1180, HS = 3.6;
  const e = joints(me).armR.end;
  const hand = { x: HX + e.x * HS, y: HY + e.y * HS };
  return (
    <AbsoluteFill style={{ background: '#140E10' }}>
      <ShotFrame>
        <g style={{ filter: 'blur(5px)' }}>
          <RomeStreet t={0} id="thst" mode="night" fire={1} shop sign={1} smoke={1} />
        </g>
        <rect width={1920} height={1080} fill="#1A0A06" opacity={0.35} />
        <Glow x={1300} y={300} r={1100} kind="warm" o={0.85} />
        <Glow x={1500} y={0} r={900} kind="red" o={0.6} />
        <g transform={`translate(${HX} ${HY}) scale(${HS})`}>
          <Hero look={LOOKS.you} pose={me} shadow={0} />
        </g>
        <Glow x={hand.x} y={hand.y - 160} r={360} kind="warm" o={0.9} />
        <Burger x={hand.x} y={hand.y + 30} s={2.4} rot={-6} />
        <ellipse cx={hand.x} cy={hand.y + 20} rx={56} ry={52} fill="#1E1B26" stroke="#100E16" strokeWidth={8} />
        <T x={60} y={250} size={190} fill="#FFFFFF">BURGERS IN</T>
        <T x={60} y={500} size={260} fill="#FFD23A">ROME?</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
