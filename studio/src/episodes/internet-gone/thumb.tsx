import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Smartphone, Glow, FONT, ShotFrame, LOOKS, Look } from '../../engine';

// Thumbnail for "What If Internet Just Disappeared FOREVER Without Warning?!": you, in total shock, holding up a
// phone with no signal; a friend behind in panic; a city going dark; a huge red crossed-out Wi-Fi sign;
// text "NO INTERNET FOREVER" with FOREVER in red.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode; anchor?: 'start' | 'middle' }> = ({ x, y, size, fill, children, anchor = 'start' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

const FRIEND: Look = { ...LOOKS.ellie, jacket: '#2F7BE0', jacketShade: '#2460B0', accent: '#2460B0', extra: 'curls' };

/** A skyline whose windows are switching off from left to right. */
const DarkCity: React.FC = () => {
  const blocks: React.ReactNode[] = [];
  let x = -20;
  let i = 0;
  while (x < 1960) {
    const w = 110 + ((i * 53) % 90);
    const h = 260 + ((i * 137) % 380);
    const top = 1080 - h;
    blocks.push(<rect key={`b${i}`} x={x} y={top} width={w} height={h} fill={i % 2 ? '#141029' : '#1A1533'} />);
    for (let wy = top + 24; wy < 1060; wy += 38) {
      for (let wx = x + 14; wx < x + w - 20; wx += 30) {
        const r = Math.abs(Math.sin(wx * 12.9898 + wy * 78.233) * 43758.5453) % 1;
        const lit = r > 0.35 + (x / 1960) * 0.6; // fewer lights to the right: the blackout spreading
        blocks.push(<rect key={`w${wx}-${wy}`} x={wx} y={wy} width={14} height={20} fill={lit ? '#FFD37A' : '#0E0B1E'} opacity={lit ? 0.85 : 1} />);
      }
    }
    x += w + 6;
    i++;
  }
  return <g>{blocks}</g>;
};

const WifiX: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-8)`}>
    <circle r={150} fill="#FFFFFF" stroke="#0B0816" strokeWidth={16} />
    <g fill="none" stroke="#1A1533" strokeLinecap="round" strokeWidth={24}>
      <path d="M -100 -10 Q 0 -100 100 -10" />
      <path d="M -64 30 Q 0 -25 64 30" />
      <path d="M -30 66 Q 0 42 30 66" />
    </g>
    <circle cx={0} cy={100} r={17} fill="#1A1533" />
    <circle r={128} fill="none" stroke="#E8252A" strokeWidth={30} />
    <path d="M -90 -90 L 90 90" stroke="#E8252A" strokeWidth={30} strokeLinecap="round" />
  </g>
);

export const InternetGoneThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.2, expr: 'shock', armR: { a: 150, b: 12 }, headTilt: 5, look: 0.5, blink: 0, glint: 1 };
  const pal: Pose = { ...basePose, x: 0, y: 0, yaw: -0.4, look: -0.8, expr: 'worried', blink: 0, glint: 1, headTilt: -8, armL: { a: 40, b: -30 }, armR: { a: 40, b: -30 } };
  return (
    <AbsoluteFill style={{ background: '#0B0920' }}>
      <ShotFrame>
        <linearGradient id="igsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A0E3E" />
          <stop offset="0.6" stopColor="#5A1A4A" />
          <stop offset="1" stopColor="#B8323A" />
        </linearGradient>
        <rect width={1920} height={1080} fill="url(#igsky)" />
        <g filter="url(#blur6)"><DarkCity /></g>
        <radialGradient id="igv" cx="0.62" cy="0.55" r="0.75">
          <stop offset="0.5" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#07050F" stopOpacity={0.8} />
        </radialGradient>
        <rect width={1920} height={1080} fill="url(#igv)" />
        {/* the friend behind, panicking */}
        <g transform="translate(1790 900) scale(2.6)">
          <Hero look={FRIEND} pose={pal} shadow={0} />
        </g>
        {/* you, phone held up */}
        <g transform="translate(1200 980) scale(3.3)">
          <Hero look={LOOKS.you} pose={me} shadow={0} />
        </g>
        <Glow x={1500} y={400} r={380} kind="cool" o={0.8} />
        <Smartphone x={1510} y={400} s={0.68} rot={12} mode="nosignal" t={0} battery={64} bars={0} glow={2} />
        <path d="M 1330 760 Q 1380 660 1450 600" stroke="#F07A2A" strokeWidth={68} strokeLinecap="round" fill="none" />
        <ellipse cx={1458} cy={585} rx={56} ry={50} fill="#26232F" stroke="#100E16" strokeWidth={8} />
        {/* text */}
        <T x={60} y={200} size={175} fill="#FFFFFF">NO</T>
        <T x={60} y={390} size={175} fill="#FFFFFF">INTERNET</T>
        <T x={60} y={580} size={175} fill="#FF2A2A">FOREVER</T>
        <WifiX x={270} y={830} s={1.05} />
      </ShotFrame>
    </AbsoluteFill>
  );
};
