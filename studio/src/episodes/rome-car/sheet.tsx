import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ShotFrame, Hero, basePose, Pose } from '../../engine';
import { Country, CityGate, Forum, Circus, Palace, GoldRoom, Car, CarFront, Horse, Chariot, chariotStand, FuelGauge, Windscreen, TunnelView, romeHip, GROUND } from './sets';
import { YOU, MO, SOLDIER, GUARD, SENATOR, EMPEROR, ENGINEER, CHARIOTEER, OFFICIAL, CITIZENS, FARMER } from './common';

// Dev sheets: every set of the episode in a 3x3 grid, and the cast.
const at = (x: number, s = 1, o: Partial<Pose> = {}): Pose => ({ ...basePose, x, y: romeHip(s), scale: s, ...o });
const cells: React.ReactNode[] = [
  <g key="a"><Country t={40} mode="day" tunnel="tunnel" /><Car x={1100} y={GROUND} s={0.8} /></g>,
  <g key="b"><Country t={40} mode="dusk" stone /><Horse x={700} y={GROUND} run={1} /><Horse x={1300} y={GROUND} s={0.7} donkey color="#8A8478" /></g>,
  <g key="c"><Country t={40} mode="night" stone tunnel="hill" /><Car x={1000} y={GROUND} s={0.8} lights={1} high={0.8} /></g>,
  <g key="d"><CityGate t={40} /><Hero look={SOLDIER} pose={at(700)} /><Hero look={SOLDIER} pose={at(1220, 1, { yaw: -0.4 })} /></g>,
  <g key="e"><Forum t={40} crowd={1} cheer={0.6} /></g>,
  <g key="f"><Forum t={40} mode="night" torches={1} /></g>,
  <g key="g"><Circus t={40} laps={3} /><Horse x={500} y={GROUND} run={2} s={0.7} /><Chariot x={150} y={GROUND} s={0.8} /></g>,
  <g key="h"><Palace t={40} /><Hero look={EMPEROR} pose={at(1300, 1, { yaw: -0.4 })} /></g>,
  <g key="i"><GoldRoom t={40} /></g>,
];
export const RomeSets: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <ShotFrame>
      {cells.map((c, i) => (
        <g key={i} transform={`translate(${(i % 3) * 640} ${Math.floor(i / 3) * 360}) scale(${1 / 3})`}>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" overflow="hidden">{c}</svg>
        </g>
      ))}
    </ShotFrame>
  </AbsoluteFill>
);
const cast = [YOU, MO, SOLDIER, GUARD, SENATOR, EMPEROR, ENGINEER, CHARIOTEER, OFFICIAL, FARMER, ...CITIZENS.slice(0, 2)];
export const RomeCast: React.FC = () => (
  <AbsoluteFill style={{ background: '#2A2434' }}>
    <ShotFrame>
      {cast.map((l, i) => (
        <Hero key={i} look={l} pose={{ ...basePose, x: 160 + (i % 6) * 320, y: 330 + Math.floor(i / 6) * 500, scale: 0.85, yaw: 0.25 }} />
      ))}
      <g transform="translate(0 0)">
        <Car x={1500} y={1060} s={0.35} sunroof />
        <CarFront x={300} y={1060} s={0.35} lights={1} />
        <FuelGauge x={960} y={980} s={0.35} p={0.5} />
        <Horse x={1200} y={1060} s={0.3} run={1} />
      </g>
    </ShotFrame>
  </AbsoluteFill>
);
