import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame } from '../../engine';
import { YOU } from './common';
import { DoorFrame, markH } from './sets';

// Thumbnail: you as a little kid, eyes huge, in front of the kitchen door frame; the pencil marks run DOWN
// (15, 12, 9, 6) with a big red arrow pointing down. "AGING / BACKWARDS?" with BACKWARDS in yellow.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const AgingBackwardsThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.25, look: -0.4, expr: 'shock', headTilt: -6, blink: 0, glint: 1, glintColor: '#FFF4D0' };
  const FX = 520, FY = 1400, FH = 1200;
  const ages = [15, 12, 9, 6];
  const ys = ages.map((a) => FY - FH * markH(a));
  return (
    <AbsoluteFill style={{ background: '#E3C27A' }}>
      <ShotFrame>
        <DoorFrame x={FX} y={FY} h={FH} marks={[]} />
        <Glow x={1450} y={420} r={900} kind="warm" o={0.6} />
        {/* big pencil marks on the left jamb, going down */}
        {ages.map((a, i) => (
          <g key={a}>
            <path d={`M ${FX - 10} ${ys[i]} l 110 0`} stroke={i === ages.length - 1 ? '#E8252A' : '#2A2430'} strokeWidth={14} strokeLinecap="round" />
            <text x={FX - 30} y={ys[i] + 26} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill={i === ages.length - 1 ? '#E8252A' : '#2A2430'}>{a}</text>
          </g>
        ))}
        {/* the red arrow, pointing down */}
        <g transform={`translate(${FX - 190} 0)`}>
          <path d={`M 0 ${ys[0] - 10} L 0 ${ys[3] - 70}`} stroke="#0B0816" strokeWidth={60} strokeLinecap="round" />
          <path d={`M 0 ${ys[0] - 10} L 0 ${ys[3] - 70}`} stroke="#FF2E2E" strokeWidth={38} strokeLinecap="round" />
          <path d={`M -80 ${ys[3] - 110} L 0 ${ys[3] + 10} L 80 ${ys[3] - 110} Z`} fill="#FF2E2E" stroke="#0B0816" strokeWidth={12} strokeLinejoin="round" />
        </g>
        {/* you */}
        <g transform="translate(1500 1180) scale(3.6)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        <T x={60} y={230} size={190} fill="#FFFFFF">AGING</T>
        <T x={60} y={430} size={190} fill="#FFD23A">BACKWARDS?</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
