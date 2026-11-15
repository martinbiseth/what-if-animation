import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame, Drone, Giza } from '../../engine';
import { YOU, KING } from './cast';

// Thumbnail for "What If You Brought a Drone to Ancient Egypt?": you in shock in the foreground, the pharaoh behind
// staring up, a big glowing drone over the Great Pyramid at golden hour; text "DRONE IN EGYPT?" with EGYPT in yellow.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#140C10" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const DroneEgyptThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.2, expr: 'shock', armR: { a: 150, b: 12 }, headTilt: 5, look: 0.5, blink: 0, glint: 1 };
  const king: Pose = { ...basePose, x: 0, y: 0, yaw: -0.3, look: 0.6, expr: 'shock', blink: 0, glint: 1, headTilt: -10, armL: { a: 40, b: -30 }, armR: { a: 40, b: -30 } };
  return (
    <AbsoluteFill style={{ background: '#2A1410' }}>
      <ShotFrame>
        <g filter="url(#blur4)" transform="translate(-200 -120) scale(1.2)">
          <Giza t={0} tod="gold" id="th" pyrX={1300} />
        </g>
        <radialGradient id="dev" cx="0.65" cy="0.5" r="0.75">
          <stop offset="0.5" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#140A08" stopOpacity={0.75} />
        </radialGradient>
        <rect width={1920} height={1080} fill="url(#dev)" />
        <g transform="translate(1850 1100) scale(2.3)"><Hero look={KING} pose={king} shadow={0} /></g>
        <g transform="translate(1180 1130) scale(3.0)"><Hero look={YOU} pose={me} shadow={0} /></g>
        <Glow x={1580} y={150} r={300} kind="warm" o={0.9} />
        <Drone x={1580} y={150} s={0.95} t={0} tilt={-8} />
        <T x={60} y={230} size={190} fill="#FFFFFF">DRONE</T>
        <T x={60} y={430} size={190} fill="#FFFFFF">IN</T>
        <T x={60} y={640} size={190} fill="#FFC21A">EGYPT?</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
