import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame, LOOKS, Look, ModernCar, joints, toWorld } from '../../engine';

// Thumbnail for "What If Your Strength Doubled Every Day?": you, close and smug-shocked, holding a car over your
// head with one hand; Mo behind, jaw on the floor; a yellow "x2" badge; text "TOO STRONG" with STRONG in yellow.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

const noHat = (l: Look): Look => ({ ...l, hat: undefined, hatColor: undefined, noPhones: undefined });
const MO: Look = { ...noHat(LOOKS.mo26), jacket: '#4E7A4A', jacketShade: '#3E6238', accent: '#E9C46A', shoe: '#E8504A' };

const Badge: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y}) rotate(-10)`}>
    <circle r={128} fill="#FFD21F" stroke="#0B0816" strokeWidth={16} />
    <circle r={104} fill="none" stroke="#0B0816" strokeWidth={5} strokeDasharray="12 10" opacity={0.5} />
    <text y={44} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={130} fill="#0B0816">x2</text>
    <text y={92} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#0B0816" letterSpacing={3}>EVERY DAY</text>
  </g>
);

export const StrengthDoublesThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.15, expr: 'smug', armR: { a: 148, b: 8 }, handR: 'open', armL: { a: 28, b: -40 }, headTilt: -4, look: -0.3, blink: 0, glint: 1, glintColor: '#FFD21F' };
  const pal: Pose = { ...basePose, x: 0, y: 0, yaw: 0.45, look: 0.9, expr: 'shock', blink: 0, glint: 1, headTilt: 10, armL: { a: 120, b: 70 }, armR: { a: 120, b: 70 } };
  const S = 3.6, OX = 1150, OY = 1180;
  const hl = joints({ ...me, x: 0, y: 0, scale: 1 }).armR.end;
  const hx = OX + hl.x * S, hy = OY + hl.y * S;
  return (
    <AbsoluteFill style={{ background: '#0B0920' }}>
      <ShotFrame>
        <linearGradient id="sdsky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C2E8A" />
          <stop offset="0.55" stopColor="#4A2A9A" />
          <stop offset="1" stopColor="#E0603A" />
        </linearGradient>
        <rect width={1920} height={1080} fill="url(#sdsky)" />
        {/* speed rays behind the car */}
        <g opacity={0.22}>
          {Array.from({ length: 18 }, (_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return <path key={i} d={`M 1330 260 L ${1330 + Math.cos(a) * 1600} ${260 + Math.sin(a) * 1600} L ${1330 + Math.cos(a + 0.12) * 1600} ${260 + Math.sin(a + 0.12) * 1600} Z`} fill="#FFFFFF" />;
          })}
        </g>
        <radialGradient id="sdv" cx="0.6" cy="0.5" r="0.8">
          <stop offset="0.55" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#07050F" stopOpacity={0.75} />
        </radialGradient>
        <rect width={1920} height={1080} fill="url(#sdv)" />
        {/* Mo behind, shocked */}
        <g transform="translate(1800 1010) scale(2.3)">
          <Hero look={MO} pose={pal} shadow={0} />
        </g>
        <Glow x={hx} y={hy - 120} r={420} kind="warm" o={0.7} />
        {/* you, close, one arm up */}
        <g transform={`translate(${OX} ${OY}) scale(${S})`}>
          <Hero look={LOOKS.you} pose={me} shadow={0} />
        </g>
        {/* the car, held up */}
        <g transform={`rotate(-8 ${hx} ${hy})`}>
          <ModernCar x={hx + 40} y={hy + 6} s={1.25} color="#E8302A" />
        </g>
        {/* crack lines under the feet are out of frame: dust puffs at the bottom instead */}
        <T x={60} y={250} size={210} fill="#FFFFFF">TOO</T>
        <T x={60} y={470} size={210} fill="#FFD21F">STRONG</T>
        <Badge x={260} y={790} />
      </ShotFrame>
    </AbsoluteFill>
  );
};
