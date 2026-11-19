import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame, LOOKS, WantedStars, PoliceCarFront, Helicopter, WANT } from '../../engine';

// Thumbnail for "What If You Got a 5-Star Wanted Level in Real Life?": you, a huge close-up in shock, five gold
// stars blazing above your head, red and blue police light on either side, a helicopter beam from above.
// Text: "5 STARS", the 5 in yellow.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const GtaWantedLevelThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.25, expr: 'shock', headTilt: -5, look: -0.3, blink: 0, glint: 1, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } };
  return (
    <AbsoluteFill style={{ background: '#0B1024' }}>
      <ShotFrame>
        <linearGradient id="wsky" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7A0E1A" />
          <stop offset="0.5" stopColor="#120E26" />
          <stop offset="1" stopColor="#0E2A7A" />
        </linearGradient>
        <rect width={1920} height={1080} fill="url(#wsky)" />
        <Glow x={0} y={760} r={700} kind="red" o={0.9} />
        <Glow x={1920} y={760} r={700} kind="cool" o={0.9} />
        <Helicopter x={1800} y={500} s={0.5} t={3} beam={{ a: -40, len: 900, w: 380, o: 0.5 }} />
        <PoliceCarFront x={330} y={1060} s={1.3} t={0} lights={1} beams={1} />
        {/* you, a huge close-up on the right, in shock */}
        <Glow x={1400} y={600} r={420} kind="warm" o={0.45} />
        <g transform="translate(1400 1420) scale(4.2)">
          <Hero look={LOOKS.you} pose={me} shadow={0} />
        </g>
        <Glow x={1420} y={220} r={420} kind="warm" o={0.8} />
        <WantedStars x={1420} y={215} n={5} s={1.8} t={0} bob={false} />
        {/* text */}
        <T x={70} y={300} size={260} fill={WANT.gold}>5</T>
        <T x={250} y={300} size={260} fill="#FFFFFF">STARS</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
