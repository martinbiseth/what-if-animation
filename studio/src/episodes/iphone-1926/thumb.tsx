import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, camT, Street26, Smartphone, Glow, FONT, ShotFrame } from '../../engine';
import { L, YOU } from './common';

// The thumbnail (rendered 1920x1080, uploaded as 1280x720 JPEG): you, smug, holding up a blazing phone; two 1926
// faces behind you in total shock; huge text "IPHONE IN 1926?" with the year in yellow; a 1% battery badge.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode; anchor?: 'start' | 'middle' }> = ({ x, y, size, fill, children, anchor = 'start' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const Iphone1926Thumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.25, look: -0.5, expr: 'smug', armR: { a: 150, b: 12 }, headTilt: -6, blink: 0, glint: 1 };
  const gent: Pose = { ...basePose, x: 0, y: 0, yaw: -0.4, look: -0.9, expr: 'shock', blink: 0, glint: 1, headTilt: 8 };
  const lady: Pose = { ...basePose, x: 0, y: 0, yaw: -0.3, look: -0.9, expr: 'shock', blink: 0, glint: 1, headTilt: -6 };
  return (
    <AbsoluteFill style={{ background: '#0E0C1E' }}>
    <ShotFrame>
      <g filter="url(#blur6)">
        <g transform={camT(1100, 420, 1.35)}>
          <Street26 t={400} id="thumb" cars={false} />
        </g>
      </g>
      <rect width={1920} height={1080} fill="#FF6A1A" opacity={0.18} />
      <radialGradient id="thv" cx="0.6" cy="0.55" r="0.75">
        <stop offset="0.55" stopColor="#000" stopOpacity={0} />
        <stop offset="1" stopColor="#0B0816" stopOpacity={0.75} />
      </radialGradient>
      <rect width={1920} height={1080} fill="url(#thv)" />
      {/* the 1926 faces, big, behind */}
      <g transform="translate(1620 880) scale(3.1)">
        <Hero look={L.gent} pose={gent} shadow={0} />
      </g>
      <g transform="translate(1870 960) scale(2.7)">
        <Hero look={L.lady} pose={lady} shadow={0} />
      </g>
      {/* you, with the phone held up */}
      <g transform="translate(980 920) scale(3.4)">
        <Hero look={YOU} pose={me} shadow={0} />
      </g>
      <Glow x={1290} y={320} r={420} kind="cool" o={0.9} />
      <Smartphone x={1300} y={330} s={0.72} rot={14} mode="home" t={0} battery={1} glow={2.2} status={false} />
      <path d="M 1130 760 Q 1180 640 1240 560" stroke="#F07A2A" strokeWidth={70} strokeLinecap="round" fill="none" />
      <ellipse cx={1250} cy={530} rx={62} ry={56} fill="#26232F" stroke="#100E16" strokeWidth={8} />
      {/* text */}
      <T x={70} y={250} size={210} fill="#FFFFFF">IPHONE</T>
      <T x={70} y={470} size={210} fill="#FFFFFF">IN <tspan fill="#FFD23A">1926?</tspan></T>
      {/* the badge: one percent */}
      <g transform="translate(250 760) rotate(-8)">
        <rect x={-190} y={-90} width={380} height={180} rx={40} fill="#E8252A" stroke="#0B0816" strokeWidth={14} />
        <rect x={-150} y={-40} width={110} height={80} rx={12} fill="none" stroke="#FFFFFF" strokeWidth={12} />
        <rect x={-36} y={-16} width={14} height={32} rx={4} fill="#FFFFFF" />
        <rect x={-138} y={-28} width={12} height={56} rx={4} fill="#FFFFFF" />
        <T x={90} y={36} size={100} fill="#FFFFFF" anchor="middle">1%</T>
      </g>
    </ShotFrame>
    </AbsoluteFill>
  );
};
