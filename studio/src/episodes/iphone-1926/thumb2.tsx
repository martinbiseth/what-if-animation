import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, camT, Kitchen, Smartphone, Glow, FONT, ShotFrame } from '../../engine';
import { L, YOU } from './common';

// Part 2 thumbnail: night, the kitchen table. You, wide-eyed, holding up the phone with the message from Part 1's
// last shot glowing on it; the man in the grey suit behind you in the dark, smug. "WHO SENT IT?" with WHO in red,
// and a yellow PART 2 badge.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode; anchor?: 'start' | 'middle' }> = ({ x, y, size, fill, children, anchor = 'start' }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const Iphone1926P2Thumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: 0.2, look: 0.6, expr: 'shock', armR: { a: 150, b: 12 }, headTilt: 5, blink: 0, glint: 1 };
  const suit: Pose = { ...basePose, x: 0, y: 0, yaw: -0.45, look: -0.8, expr: 'smug', blink: 0, glint: 1, headTilt: -4 };
  return (
    <AbsoluteFill style={{ background: '#0E0C1E' }}>
      <ShotFrame>
        <g filter="url(#blur6)">
          <g transform={camT(980, 520, 1.3)}>
            <Kitchen t={400} id="thumb2" veil={0.55} />
          </g>
        </g>
        <rect width={1920} height={1080} fill="#1A2A6A" opacity={0.35} />
        <radialGradient id="th2v" cx="0.6" cy="0.5" r="0.75">
          <stop offset="0.45" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#05040A" stopOpacity={0.85} />
        </radialGradient>
        <rect width={1920} height={1080} fill="url(#th2v)" />
        {/* the man in the grey suit, in the dark behind you */}
        <g transform="translate(1700 1000) scale(3.3)">
          <Hero look={L.suit26} pose={suit} shadow={0} />
        </g>
        <linearGradient id="th2s" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#05040A" stopOpacity={0} />
          <stop offset="1" stopColor="#05040A" stopOpacity={0.6} />
        </linearGradient>
        <rect x={1300} y={0} width={620} height={1080} fill="url(#th2s)" />
        {/* you */}
        <g transform="translate(900 1000) scale(3.5)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        <Glow x={1230} y={400} r={480} kind="cool" o={1} />
        <Smartphone x={1240} y={400} s={0.95} rot={-8} mode="off" t={30} battery={1} bars={1} glow={2.6} />
        {/* the screen, drawn big so the message reads at thumbnail size */}
        <g transform="translate(1240 400) rotate(-8) scale(0.95)">
          <rect x={-136} y={-296} width={272} height={592} rx={34} fill="#101018" />
          <text x={0} y={-200} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#F6EFE3" opacity={0.7}>Unknown</text>
          <rect x={-118} y={-150} width={236} height={170} rx={30} fill="#3A7AFF" />
          <text x={0} y={-90} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#FFFFFF">DON'T</text>
          <text x={0} y={-40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={42} fill="#FFFFFF">GIVE IT</text>
          <text x={0} y={6} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={42} fill="#FFFFFF">TO HIM.</text>
        </g>
        <path d="M 1060 860 Q 1120 720 1190 640" stroke="#F07A2A" strokeWidth={74} strokeLinecap="round" fill="none" />
        <ellipse cx={1200} cy={610} rx={66} ry={60} fill="#26232F" stroke="#100E16" strokeWidth={8} />
        {/* text */}
        <T x={60} y={260} size={240} fill="#E8252A">WHO</T>
        <T x={60} y={480} size={200} fill="#FFFFFF">SENT IT?</T>
        <g transform="translate(230 760) rotate(-7)">
          <rect x={-200} y={-80} width={400} height={160} rx={36} fill="#FFD23A" stroke="#0B0816" strokeWidth={14} />
          <T x={0} y={34} size={88} fill="#FFFFFF" anchor="middle">PART 2</T>
        </g>
      </ShotFrame>
    </AbsoluteFill>
  );
};
