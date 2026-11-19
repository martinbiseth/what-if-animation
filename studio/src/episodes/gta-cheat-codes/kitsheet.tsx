import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotFrame, Stairwell, Bedroom, Kitchen, Bank, Suburb, Rooftop, Office } from '../../engine';
import { Controller, CodeList, CheatText, Bill, MoneyBag, SportsCar, Jetpack, Skateboard, Bird, Helicopter, SatVan, PowerGraph, WeatherTV, Flames, SpawnFlash, SkySet } from './kit';

// A sheet of the episode's props, for checking them by eye: npx remotion still src/index.ts GtaKit out/gtakit.png
export const GtaKitSheet: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: '#2A2838' }}>
      <ShotFrame>
        {f === 2 ? <Stairwell t={0} /> : f === 3 ? <Bedroom t={0} veil={0.2} lamp={0} clock="07:12" crossed={0} /> : f === 4 ? <Kitchen t={0} veil={0.3} /> : f === 5 ? <Bank t={0} /> : f === 6 ? <Suburb t={0} tod="dusk" /> : f === 7 ? <Rooftop t={0} /> : f === 8 ? <Office t={0} /> : f === 0 ? (
          <g>
            <rect width={1920} height={1080} fill="#3A3848" />
            <Controller x={300} y={200} s={0.8} press="r" />
            <CodeList x={800} y={500} s={0.6} />
            <CodeList x={1150} y={500} s={0.6} back />
            <CodeList x={1500} y={500} s={0.6} reveal={1} />
            <Bill x={300} y={500} s={0.6} hiSerial={1} />
            <MoneyBag x={300} y={850} s={0.8} />
            <SportsCar x={900} y={1000} s={0.8} />
            <Jetpack x={1750} y={850} s={1} t={5} />
            <Skateboard x={1400} y={1000} />
            <Bird x={1700} y={120} />
          </g>
        ) : (
          <g>
            <SkySet t={0} />
            <Helicopter x={300} y={200} t={3} beam={1} />
            <SatVan x={1500} y={1000} s={0.8} />
            <PowerGraph x={150} y={450} w={700} h={300} p={1} />
            <WeatherTV x={1400} y={420} s={0.8} clear={1} t={0} />
            <Flames x={900} y={1000} t={4} />
            <SpawnFlash x={900} y={700} p={6} />
            <CheatText x={960} y={160} p={30} name="INVINCIBLE" s={0.8} />
          </g>
        )}
      </ShotFrame>
    </AbsoluteFill>
  );
};
