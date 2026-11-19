import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame, LOOKS, MONEY } from '../../engine';
import { HospitalFront, Bill } from './kit';

// Thumbnail for "What If You Got the GTA6 Hospital Bill in Real Life?": you, a huge close-up in shock, an arm in a
// cast, holding up an itemised bill that runs off the frame, its total in red. Behind: the emergency entrance at dusk,
// red light, a helicopter. Text: "RESPAWN" white and "$1.5M" yellow. No game art or logos: our own cast and hospital.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const GtaHospitalBillThumb: React.FC = () => {
  const me: Pose = {
    ...basePose, x: 0, y: 0, yaw: -0.3, expr: 'shock', headTilt: -5, look: -0.7, blink: 0,
    armL: { a: 100, b: -40 }, armR: { a: 30, b: -20 },
  };
  return (
    <AbsoluteFill style={{ background: '#1A0A10' }}>
      <ShotFrame>
        <g filter="url(#blur10)">
          <g transform="translate(960 540) scale(1.25) translate(-960 -560)">
            <HospitalFront t={40} id="th" tod="dusk" ambLights={1} />
          </g>
        </g>
        <rect width={1920} height={1080} fill="#A00A24" opacity={0.38} />
        <Glow x={520} y={420} r={600} kind="red" o={0.85} />
        <radialGradient id="thv" cx="0.6" cy="0.5" r="0.8">
          <stop offset="0.45" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#06060F" stopOpacity={0.8} />
        </radialGradient>
        <rect width={1920} height={1080} fill="url(#thv)" />
        {/* you, huge, right of frame, in shock */}
        <Glow x={1460} y={420} r={480} kind="cool" o={0.45} />
        <g transform="translate(1480 1280) scale(4.5)">
          <Hero look={LOOKS.you} pose={me} shadow={0} />
        </g>
        {/* the bill, held up, running off the bottom of frame */}
        <g transform="translate(640 820) rotate(-8)">
          <Bill x={0} y={0} s={1.15} t={99}
            lines={[
              { label: 'Helicopter', v: 36400, at: 0 },
              { label: 'Trauma team', v: 50659, at: 0, hot: true },
              { label: 'Spine, year one', v: 1369755, at: 0, hot: true },
            ]}
            total={1573043} totalAt={0} />
        </g>
        <Glow x={640} y={980} r={300} kind="red" o={0.5} />
        {/* text */}
        <T x={60} y={200} size={200} fill="#FFFFFF">RESPAWN</T>
        <T x={60} y={400} size={200} fill="#FFD23A">$1.5M</T>
        <rect x={0} y={0} width={1920} height={1080} fill="none" stroke={MONEY.red} strokeWidth={0} />
      </ShotFrame>
    </AbsoluteFill>
  );
};
