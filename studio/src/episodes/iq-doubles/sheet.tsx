import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ShotFrame, Hero, LOOKS, basePose, Bedroom, Kitchen, Classroom, Study, Rooftop, stand, KITCHEN, CLS, STUDY, BEDROOM, bedSit } from '../../engine';
import { LivingRoom, StreetModern } from '../electricity/sets';

const cells: React.ReactNode[] = [
  <Bedroom key="a" t={40} clock="07:00" />,
  <Kitchen key="b" t={40} />,
  <Classroom key="c" t={40} />,
  <Study key="d" t={40} />,
  <LivingRoom key="e" t={40} power={1} />,
  <StreetModern key="f" t={40} mode="day" power={0} />,
  <StreetModern key="g" t={40} mode="dusk" power={1} />,
  <Rooftop key="h" t={40} />,
  <Bedroom key="i" t={40} clock="03:00" lamp={1} />,
];
const people: Record<number, React.ReactNode> = {
  1: <Hero look={LOOKS.you} pose={{ ...basePose, ...stand(KITCHEN, 0.4, 0.45) }} />,
  2: <Hero look={LOOKS.you} pose={{ ...basePose, ...stand(CLS, 0.3, 0.5) }} />,
  3: <Hero look={LOOKS.you} pose={{ ...basePose, ...stand(STUDY, 0.5, 0.5) }} />,
  0: <Hero look={LOOKS.you} pose={{ ...basePose, ...stand(BEDROOM, 0.3, 0.5) }} />,
};
export const IqSets: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <ShotFrame>
      {cells.map((c, i) => (
        <g key={i} transform={`translate(${(i % 3) * 640} ${Math.floor(i / 3) * 360}) scale(${1 / 3})`}>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" overflow="hidden">{c}{people[i]}</svg>
        </g>
      ))}
    </ShotFrame>
  </AbsoluteFill>
);
