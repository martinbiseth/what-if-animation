import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ShotFrame, camT, Hero, LOOKS, basePose } from '../../engine';
import { LivingRoom, StreetModern, RoofNight, Hospital, CountryRoad, Valley, LIVING, sofaSit, streetHip } from './sets';

// A dev sheet: every set of the episode, power on and off, in a 3x3 grid.
const cells: React.ReactNode[] = [
  <LivingRoom key="a" t={40} power={1} />,
  <LivingRoom key="b" t={40} power={0} candles={[LIVING.P(0.42, 0.86, 0.6)]} />,
  <StreetModern key="c" t={40} power={1} />,
  <StreetModern key="d" t={40} power={0} milky={1} />,
  <StreetModern key="e" t={40} mode="day" garageOpen={1} />,
  <RoofNight key="f" t={40} />,
  <Hospital key="g" t={40} />,
  <CountryRoad key="h" t={40} />,
  <Valley key="i" t={40} light={1} />,
];
export const ElecSets: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <ShotFrame>
      {cells.map((c, i) => (
        <g key={i} transform={`translate(${(i % 3) * 640} ${Math.floor(i / 3) * 360}) scale(${1 / 3})`}>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" overflow="hidden">{c}{i === 0 ? <Hero look={LOOKS.you} pose={{ ...basePose, ...sofaSit(0.6), yaw: -0.6, legL: { a: 85, b: -85 }, legR: { a: 80, b: -80 }, facing: -1 }} /> : null}{i === 2 ? <Hero look={LOOKS.you} pose={{ ...basePose, x: 900, y: streetHip(1) }} /> : null}</svg>
        </g>
      ))}
    </ShotFrame>
  </AbsoluteFill>
);
