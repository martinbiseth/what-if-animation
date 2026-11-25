import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame, THINK, ThoughtBubble } from '../../engine';
import { YOU, MO } from './common';

// Thumbnail for "What If You Could Hear Everyone's Thoughts?": you, a huge close-up on the right, eyes glowing violet,
// hands at your sides; your best friend grinning beside you, and over his head one giant red thought: "UGLY."
// Text: "I HEAR YOU", HEAR in yellow.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

/** Faint thought clouds drifting behind, for colour. */
const Clouds: React.FC = () => {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 18; i++) {
    const r = (k: number) => Math.abs(Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1;
    out.push(<ellipse key={i} cx={r(1) * 1920} cy={r(2) * 1080} rx={70 + r(3) * 90} ry={36 + r(4) * 40} fill={THINK.paper} opacity={0.18} />);
  }
  return <g filter="url(#blur6)">{out}</g>;
};

export const HearThoughtsThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.3, expr: 'shock', headTilt: -5, look: -0.8, blink: 0, glint: 1, glintColor: THINK.glow, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } };
  const mo: Pose = { ...basePose, x: 0, y: 0, yaw: 0.35, look: 0.5, expr: 'happy', blink: 0, glint: 0, headTilt: 6, armR: { a: 100, b: -100 } };
  return (
    <AbsoluteFill style={{ background: '#140E2A' }}>
      <ShotFrame>
        <linearGradient id="htsky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2A1A5A" />
          <stop offset="0.55" stopColor="#4A2A7A" />
          <stop offset="1" stopColor="#120A26" />
        </linearGradient>
        <rect width={1920} height={1080} fill="url(#htsky)" />
        <Clouds />
        <radialGradient id="htv" cx="0.6" cy="0.5" r="0.8">
          <stop offset="0.45" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#06060F" stopOpacity={0.85} />
        </radialGradient>
        <rect width={1920} height={1080} fill="url(#htv)" />
        {/* the friend, mid-ground left, grinning, thumbs-up arm */}
        <g transform="translate(900 1260) scale(2.2)">
          <Hero look={MO} pose={mo} shadow={0} />
        </g>
        <Glow x={900} y={620} r={420} kind="red" o={0.6} />
        <ThoughtBubble x={900} y={800} text="UGLY." s={2.3} side={0.1} loud={1} color={THINK.hot} bob={false} wrap={12} />
        {/* you, a huge close-up on the right, in shock */}
        <Glow x={1500} y={430} r={460} kind="cool" o={0.5} />
        <g transform="translate(1530 1250) scale(4.6)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        <T x={50} y={200} size={180} fill="#FFFFFF">I</T>
        <T x={150} y={200} size={180} fill="#FFD23A">HEAR</T>
        <T x={50} y={390} size={180} fill="#FFFFFF">YOU</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
