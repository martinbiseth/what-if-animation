import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, LOOKS, Glow, FONT, ShotFrame, NightSky, Stars, rnd, joints } from '../../engine';

// Thumbnail: the whole city dark, you lit only by a candle you hold up, eyes huge; "NO POWER / FOREVER?" with
// FOREVER in red; a crossed-out lightning badge.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode; anchor?: 'start' | 'middle' }> = ({ x, y, size, fill, children, anchor = 'start' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

const DarkCity: React.FC<{ y: number; seed: number; color: string; h: number }> = ({ y, seed, color, h }) => {
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

const Candle: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* holder */}
    <ellipse cx={0} cy={150} rx={95} ry={26} fill="#3A3442" stroke="#100E16" strokeWidth={8} />
    {/* wax */}
    <path d="M -46 -60 L -46 150 L 46 150 L 46 -60 Q 30 -70 18 -62 Q 4 -54 -10 -66 Q -28 -74 -46 -60 Z" fill="#FFF4DE" stroke="#100E16" strokeWidth={8} strokeLinejoin="round" />
    <path d="M 18 -62 Q 26 -20 22 10 Q 18 26 26 30 Q 34 26 30 10 L 34 -58" fill="#FFF4DE" stroke="#100E16" strokeWidth={6} strokeLinejoin="round" />
    <rect x={20} y={-60} width={22} height={200} fill="#E9D3AE" opacity={0.6} />
    {/* wick + flame */}
    <path d="M 0 -64 L 2 -88" stroke="#100E16" strokeWidth={7} strokeLinecap="round" />
    <path d="M 2 -230 Q 46 -150 36 -110 Q 28 -78 2 -78 Q -26 -78 -34 -110 Q -42 -150 2 -230 Z" fill="#FFB12A" />
    <path d="M 2 -180 Q 26 -130 20 -108 Q 14 -90 2 -90 Q -12 -90 -16 -108 Q -20 -130 2 -180 Z" fill="#FFF3B0" />
  </g>
);

export const ElectricityThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.2, look: -0.35, expr: 'shock', armR: { a: 35, b: 115 }, headTilt: 5, blink: 0, glint: 1, glintColor: '#FFD27A' };
  const HX = 1430, HY = 1100, HS = 3.75;
  const e = joints(me).armR.end;
  const hand = { x: HX + e.x * HS, y: HY + e.y * HS };
  return (
    <AbsoluteFill style={{ background: '#070814' }}>
      <ShotFrame>
        <NightSky id="thsky" horizonY={760} />
        <rect width={1920} height={1080} fill="#050612" opacity={0.45} />
        <Stars seed={7} x0={0} y0={0} w={1920} h={620} t={0} n={110} o={1} />
        <DarkCity y={1080} seed={11} color="#151627" h={520} />
        <DarkCity y={1080} seed={23} color="#0B0B16" h={300} />
        {/* dead power line across the sky */}
        <path d="M -20 300 Q 700 420 1940 250" stroke="#05050C" strokeWidth={8} fill="none" />
        <Glow x={1450} y={430} r={950} kind="warm" o={0.9} />
        {/* you */}
        <g transform={`translate(${HX} ${HY}) scale(${HS})`}>
          <Hero look={LOOKS.you} pose={me} shadow={0} />
        </g>
        <Glow x={hand.x} y={hand.y - 300} r={380} kind="warm" o={1} />
        <Candle x={hand.x} y={hand.y - 150} s={1.15} />
        <ellipse cx={hand.x} cy={hand.y} rx={58} ry={54} fill="#1E1B26" stroke="#100E16" strokeWidth={8} />
        {/* text */}
        <T x={60} y={240} size={200} fill="#FFFFFF">NO POWER</T>
        <T x={60} y={460} size={200} fill="#FF2E2E">FOREVER?</T>
        {/* badge: lightning, crossed out */}
        <g transform="translate(240 790) rotate(-8)">
          <circle r={150} fill="#FFD23A" stroke="#0B0816" strokeWidth={16} />
          <path d="M 20 -110 L -60 15 L -5 15 L -25 110 L 60 -20 L 5 -20 Z" fill="#0B0816" />
          <path d="M -105 -105 L 105 105" stroke="#E8252A" strokeWidth={30} strokeLinecap="round" />
        </g>
      </ShotFrame>
    </AbsoluteFill>
  );
};
