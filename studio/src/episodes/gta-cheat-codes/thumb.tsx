import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame, LOOKS } from '../../engine';
import { Controller, SportsCar, Bill, CHEAT, Jetpack, SpawnFlash } from './kit';

// Thumbnail for "What If GTA6 Cheat Codes Worked in Real Life?": you, a huge close-up in shock, eyes glowing cheat-green,
// the grey controller in your hands with a button lit; behind, a red sports car dropping out of a flash in the sky and
// bills raining. Text: "CHEATS ON", ON in yellow, plus the glowing CHEAT ACTIVATED strip.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

export const GtaCheatCodesThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.2, expr: 'shock', headTilt: -5, look: -0.3, blink: 0, glint: 1, glintColor: CHEAT.glow, armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 } };
  return (
    <AbsoluteFill style={{ background: '#0E1430' }}>
      <ShotFrame>
        <linearGradient id="gtsky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1A3A8A" />
          <stop offset="0.55" stopColor="#7A2A9A" />
          <stop offset="1" stopColor="#E85A3A" />
        </linearGradient>
        <rect width={1920} height={1080} fill="url(#gtsky)" />
        {/* bills raining */}
        <g filter="url(#blur6)" opacity={0.75}>
          {Array.from({ length: 16 }).map((_, i) => {
            const r = (k: number) => Math.abs(Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1;
            return <Bill key={i} x={r(1) * 1920} y={r(2) * 1080} s={0.3 + r(3) * 0.2} rot={r(4) * 80 - 40} />;
          })}
        </g>
        {/* the car dropping out of a flash, top right-centre */}
        <SpawnFlash x={1000} y={330} p={5} r={330} color="#FFF6C8" />
        <Glow x={1000} y={360} r={420} o={0.8} />
        <g transform="translate(1000 520) rotate(-12)">
          <SportsCar x={0} y={0} s={1.15} color="#FF2A2A" />
        </g>
        <radialGradient id="gtv" cx="0.5" cy="0.5" r="0.8">
          <stop offset="0.5" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#06060F" stopOpacity={0.8} />
        </radialGradient>
        <rect width={1920} height={1080} fill="url(#gtv)" />
        {/* you, huge, right, with the controller */}
        <Glow x={1500} y={460} r={520} kind="cool" o={0.65} />
        <g transform="translate(1520 1330) scale(4.3)">
          <Jetpack x={-40} y={-120} s={0.8} flame={0} />
          <Hero look={LOOKS.you} pose={me} shadow={0} />
        </g>
        <Controller x={1500} y={960} s={1.05} press="g" glow={1} />
        {/* text */}
        <T x={60} y={230} size={220} fill="#FFFFFF">CHEATS</T>
        <T x={60} y={460} size={220} fill="#FFD23A">ON</T>
        <g transform="translate(70 560)">
          <rect x={0} y={0} width={640} height={96} rx={16} fill="#06140F" stroke={CHEAT.glow} strokeWidth={6} />
          <text x={320} y={66} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={50} letterSpacing={4} fill={CHEAT.glow}>IN REAL LIFE</text>
        </g>
      </ShotFrame>
    </AbsoluteFill>
  );
};
