import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, LOOKS, Glow, FONT, ShotFrame } from '../../engine';

// Thumbnail: you in close-up, eyes huge with a gold glint, head glowing hot red; a big pink brain, steaming, with a
// yellow ×2 badge; "IQ ×2" with ×2 in yellow, "EVERY DAY?" under it.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">{children}</text>
);

const Brain: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -10 -150 Q -90 -190 -150 -130 Q -230 -120 -230 -40 Q -280 20 -220 90 Q -210 160 -130 160 Q -70 200 -10 160 Z" fill="#FF8FB1" stroke="#100E16" strokeWidth={12} strokeLinejoin="round" />
    <path d="M 10 -150 Q 90 -190 150 -130 Q 230 -120 230 -40 Q 280 20 220 90 Q 210 160 130 160 Q 70 200 10 160 Z" fill="#FF8FB1" stroke="#100E16" strokeWidth={12} strokeLinejoin="round" />
    <g stroke="#C9507A" strokeWidth={10} fill="none" strokeLinecap="round">
      <path d="M -60 -110 Q -120 -80 -100 -30 Q -60 0 -130 40" />
      <path d="M -170 -40 Q -140 0 -170 60" />
      <path d="M -60 60 Q -100 110 -50 130" />
      <path d="M 60 -110 Q 120 -80 100 -30 Q 60 0 130 40" />
      <path d="M 170 -40 Q 140 0 170 60" />
      <path d="M 60 60 Q 100 110 50 130" />
    </g>
    {/* steam */}
    <g stroke="#FFFFFF" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.85}>
      <path d="M -120 -210 q -30 -40 0 -80 q 30 -40 0 -80" />
      <path d="M 0 -220 q -30 -40 0 -80 q 30 -40 0 -80" />
      <path d="M 120 -210 q -30 -40 0 -80 q 30 -40 0 -80" />
    </g>
  </g>
);

export const IqDoublesThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.18, look: -0.3, expr: 'shock', headTilt: -4, blink: 0, glint: 1, glintColor: '#FFE27A', armL: { a: 10, b: 0 }, armR: { a: 10, b: 0 } };
  return (
    <AbsoluteFill style={{ background: '#12060C' }}>
      <ShotFrame>
        <rect width={1920} height={1080} fill="#1A0710" />
        <Glow x={1420} y={420} r={1000} kind="red" o={1} />
        <Glow x={1420} y={380} r={500} kind="warm" o={0.6} />
        {/* heat rings */}
        {[0, 1, 2].map((i) => <circle key={i} cx={1420} cy={330} r={430 + i * 110} fill="none" stroke="#FF4A3A" strokeWidth={10} opacity={0.35 - i * 0.1} />)}
        <g transform="translate(1420 1500) scale(5.4)">
          <Hero look={LOOKS.you} pose={me} shadow={0} />
        </g>
        <Glow x={430} y={800} r={420} kind="warm" o={0.8} />
        <Brain x={430} y={820} s={1.05} />
        <g transform="translate(700 650) rotate(10)">
          <circle r={110} fill="#FFD23A" stroke="#0B0816" strokeWidth={14} />
          <text y={38} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#0B0816">×2</text>
        </g>
        <T x={60} y={250} size={240} fill="#FFFFFF">IQ <tspan fill="#FFD23A">×2</tspan></T>
        <T x={66} y={420} size={120} fill="#FFFFFF">EVERY DAY?</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
