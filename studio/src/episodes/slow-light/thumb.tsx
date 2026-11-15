import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, LOOKS, Glow, FONT, ShotFrame, NightSky, Stars, rnd, joints } from '../../engine';

// Thumbnail: night street dark, you close up and terrified, holding a flashlight whose beam stops dead in mid-air
// a short way out, its glowing front frozen; a dying Sun in the sky. "LIGHT IS / SLOWING" with SLOWING in yellow.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">{children}</text>
);

const Skyline: React.FC<{ y: number; seed: number; color: string; h: number }> = ({ y, seed, color, h }) => {
  let d = `M -100 ${y}`;
  let x = -100;
  let i = 0;
  while (x < 2020) {
    const bw = 90 + rnd(seed, i) * 160;
    const bh = 120 + rnd(seed + 1, i) * h;
    d += ` L ${x} ${y - bh} L ${x + bw} ${y - bh}`;
    x += bw;
    i++;
  }
  d += ` L 2020 ${y} L 2020 1200 L -100 1200 Z`;
  return <path d={d} fill={color} />;
};

export const SlowLightThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: 0.25, look: 0.45, expr: 'shock', armL: { a: 10, b: -8 }, headTilt: -4, blink: 0, glint: 1, glintColor: '#FFF2B8' };
  const HX = 1480, HY = 1120, HS = 3.6;
  const e = joints(me).armL.end;
  const hand = { x: HX + e.x * HS, y: HY + e.y * HS };
  const fx = 1100, fy = 800; void hand; // flashlight lens, pointing left
  const front = 380; // how far the beam got
  return (
    <AbsoluteFill style={{ background: '#070814' }}>
      <ShotFrame>
        <NightSky id="slth" horizonY={760} />
        <rect width={1920} height={1080} fill="#050612" opacity={0.5} />
        <Stars seed={9} x0={0} y0={0} w={1920} h={620} t={0} n={90} o={0.8} />
        {/* the dying Sun */}
        <Glow x={1020} y={190} r={260} kind="warm" o={0.45} />
        <circle cx={1020} cy={190} r={70} fill="#8A6A3A" opacity={0.9} />
        <Skyline y={1080} seed={5} color="#151627" h={460} />
        <Skyline y={1080} seed={17} color="#0B0B16" h={260} />
        {/* you */}
        <Glow x={HX - 100} y={520} r={600} kind="warm" o={0.5} />
        <g transform={`translate(${HX} ${HY}) scale(${HS})`}>
          <Hero look={LOOKS.you} pose={me} shadow={0} />
        </g>
        {/* the beam, stopped in mid-air */}
        <path d={`M ${fx} ${fy - 30} L ${fx - front} ${fy - 30 - front * 0.28} L ${fx - front} ${fy + 30 + front * 0.28} L ${fx} ${fy + 30} Z`} fill="#FFF2B8" opacity={0.75} />
        <Glow x={fx - front} y={fy} r={300} kind="warm" o={1} />
        <ellipse cx={fx - front} cy={fy} rx={26} ry={30 + front * 0.28} fill="#FFFBE0" />
        {[1, 2, 3].map((k) => <ellipse key={k} cx={fx - front - k * 60} cy={fy} rx={6} ry={(30 + front * 0.28) * (1 - k * 0.2)} fill="none" stroke="#FFF2B8" strokeWidth={6} strokeDasharray="14 18" opacity={0.5 - k * 0.12} />)}
        <path d="M 1380 760 Q 1300 780 1220 790 L 1220 850 Q 1310 846 1390 840 Z" fill="#F07A2A" stroke="#100E16" strokeWidth={8} />
        {/* the flashlight in your hand, lens to the left */}
        <g transform={`translate(${fx} ${fy})`}>
          <rect x={10} y={-34} width={150} height={68} rx={16} fill="#2E3A5A" stroke="#100E16" strokeWidth={8} />
          <path d="M 10 -46 L -26 -56 L -26 56 L 10 46 Z" fill="#3A4A6A" stroke="#100E16" strokeWidth={8} />
          <ellipse cx={-26} cy={0} rx={10} ry={56} fill="#FFFBE0" stroke="#100E16" strokeWidth={5} />
          <ellipse cx={80} cy={0} rx={64} ry={58} fill="#1E1B26" stroke="#100E16" strokeWidth={8} />
        </g>
        <T x={60} y={250} size={190} fill="#FFFFFF">LIGHT IS</T>
        <T x={60} y={460} size={210} fill="#FFD23A">SLOWING</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
