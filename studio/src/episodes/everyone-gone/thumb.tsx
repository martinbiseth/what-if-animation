import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame, camT } from '../../engine';
import { YOU, EG, TownSet, Soft } from './common';

// Thumbnail for "What If Everyone Disappeared Except You?": you, a huge close-up in shock, over an empty street with
// a stopped bus, doors open. Text "EVERYONE GONE", GONE in yellow; one clear object: a red POPULATION: 1 sign.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);
const STREET = TownSet('dusk', { bus: true });

export const EveryoneGoneThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.25, expr: 'shock', headTilt: -6, look: -0.3, blink: 0, glint: 1, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } };
  return (
    <AbsoluteFill style={{ background: '#0B1024' }}>
      <ShotFrame>
        <Soft blur={6} dim={0.2}>
          <g transform={camT(900, 560, 1.15)}>
            <STREET t={200} id="th" />
          </g>
        </Soft>
        <rect width={1920} height={1080} fill="#2A0E3A" opacity={0.25} />
        {/* you, a huge close-up on the right, in shock */}
        <Glow x={1420} y={600} r={460} kind="warm" o={0.5} />
        <g transform="translate(1420 1440) scale(4.3)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        {/* the sign */}
        <g transform="translate(420 820) rotate(-6)">
          <rect x={-300} y={-90} width={600} height={170} rx={24} fill={EG.red} stroke="#0B0816" strokeWidth={12} />
          <text x={0} y={-24} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill="#F6EFE3">POPULATION</text>
          <text x={0} y={60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#FFFFFF">1</text>
        </g>
        {/* text */}
        <T x={60} y={250} size={210} fill="#FFFFFF">EVERYONE</T>
        <T x={60} y={500} size={260} fill={EG.gold}>GONE</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
