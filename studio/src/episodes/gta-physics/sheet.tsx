import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ShotFrame, Hero, basePose, stand } from '../../engine';
import { Gym, GYM, Hallway, HALL, HospitalRoom, WARD, inBed, Sheet, Pillow, Backyard, YARD, roofY, CityNight, Garage, GARAGE, StreetModern, STREETM, streetHip, Van, Ramp, Beanbag, Skateboard, TrashCan, Ball, YOU, ELLIE, MO, SUIT, NURSE, HeadBar, overHead, flying, landed, Tablet, CityMap, NewsTV } from './common';

const p1 = { ...basePose, ...stand(GYM, 0.4, 0.6) };
const cells: React.ReactNode[] = [
  <g key="a"><Gym t={40} /><Hero look={YOU} pose={p1} /><HeadBar {...overHead(p1)} p={0.8} /></g>,
  <g key="b"><Hallway t={40} /><Hero look={SUIT} pose={{ ...basePose, ...stand(HALL, 0.55, 0.5), yaw: -0.4 }} /></g>,
  <g key="c"><HospitalRoom t={40} /><Pillow /><Hero look={YOU} pose={inBed()} /><Sheet /><Hero look={NURSE} pose={{ ...basePose, ...stand(WARD, 0.25, 0.6) }} /></g>,
  <g key="d"><Backyard t={40} crack={1} /><Hero look={ELLIE} pose={{ ...basePose, x: 1100, y: roofY(1100) - 140 * 0.7, scale: 0.7 }} /><Beanbag x={700} y={YARD.ground} /></g>,
  <g key="e"><CityNight t={40} power={1} /></g>,
  <g key="f"><CityNight t={40} power={0} /></g>,
  <g key="g"><StreetModern t={40} mode="day" car={false} /><Garage /><Hero look={YOU} pose={{ ...basePose, x: 900, y: GARAGE.roof - 140 }} /><Van x={1500} y={STREETM.feet + 20} s={0.8} /></g>,
  <g key="h"><StreetModern t={40} mode="day" car={false} /><Ramp x0={500} x1={1000} y={STREETM.feet + 20} h={200} /><Hero look={YOU} pose={flying(1200, 400, 1, 40, 5)} /><Skateboard x={300} y={STREETM.feet + 20} /><TrashCan x={1600} y={STREETM.feet + 20} /><Ball x={400} y={500} /></g>,
  <g key="i"><NewsTV t={40} banner="CITY BLACKOUT #3"><CityNight t={40} power={0} /></NewsTV></g>,
];
export const GtaSets: React.FC = () => (
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
