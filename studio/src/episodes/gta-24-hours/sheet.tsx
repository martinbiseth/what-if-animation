import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotFrame, Hero, basePose } from '../../engine';
import {
  ShopStreet, Park, Backyard, TaxiFront, TaxiBack, Store, Curtain, Station, Counter, Cell, CellClock, Bars, Steps, LibraryNight, Hedge,
  PoliceCar, Helicopter, PoliceDog, Scooter, HotDogCart, HotDog, Baguette, Hoodie, Car, Sombrero, YOU, MO, MOM, LADY, COP, RANGER, ROBE, DRIVER, GUARD, VENDOR, CELLMAN, SCOOTGUY,
  YOU_TRACK, YOU_SUIT, hipAt, GROUND, hud, HealthBar, runPose, wheeze, PhoneFrame, VideoPost, Messages, CallScreen, Bedroom,
} from './common';

// The GTA episode's kit at a glance, one frame per set:  npx remotion still src/index.ts GtaKit out/gk.png --frame N
const H = hud([[0, '9:00 AM', 3]]);
export const GtaKitSheet: React.FC = () => {
  const f = useCurrentFrame();
  const t = 40;
  const cast = [YOU, MO, MOM, LADY, COP, RANGER, ROBE, DRIVER, GUARD, VENDOR, CELLMAN, SCOOTGUY, YOU_TRACK, YOU_SUIT];
  return (
    <AbsoluteFill style={{ backgroundColor: '#14101C' }}>
      <ShotFrame>
        {f === 0 ? (
          <g>
            <ShopStreet t={t} light={{ x: 1500, c: 'red' }} />
            {cast.slice(0, 7).map((c, i) => <Hero key={i} look={c} pose={{ ...basePose, x: 160 + i * 240, y: hipAt(0.8), scale: 0.8, yaw: i % 2 ? -0.4 : 0.4 }} />)}
            <Car x={600} y={1040} s={0.8} />
            <PoliceCar x={1500} y={1060} s={0.8} t={t} />
            <H f={0} total={1} />
          </g>
        ) : null}
        {f === 1 ? (
          <g>
            <Park t={t} />
            {cast.slice(7).map((c, i) => <Hero key={i} look={c} pose={{ ...basePose, x: 160 + i * 260, y: hipAt(0.8, 900), scale: 0.8, yaw: 0.3 }} />)}
            <Scooter x={1500} y={960} />
            <HotDogCart x={300} y={960} t={t} />
          </g>
        ) : null}
        {f === 2 ? (
          <g>
            <Backyard t={t} />
            <Hoodie x={400} y={440} rot={10} />
            <Hero look={YOU} pose={runPose(900, 1, GROUND, 1)} />
            <Hero look={YOU} pose={wheeze(1300, GROUND, 1, t)} />
            <PoliceDog x={600} y={900} t={t} />
            <HealthBar x={80} y={1000} p={0.3} />
          </g>
        ) : null}
        {f === 3 ? <TaxiFront t={t} meter="$ 38.00" /> : null}
        {f === 4 ? <TaxiBack t={t} /> : null}
        {f === 5 ? (
          <g>
            <Store t={t} />
            <Curtain open={0.5} />
            <Sombrero x={700} y={300} />
          </g>
        ) : null}
        {f === 6 ? (
          <g>
            <Station t={t} />
            <Counter />
          </g>
        ) : null}
        {f === 7 ? (
          <g>
            <Cell t={t} />
            <CellClock hh={3} mm={0} />
            <Bars />
          </g>
        ) : null}
        {f === 8 ? <Steps t={t} /> : null}
        {f === 9 ? (
          <g>
            <LibraryNight t={t} police={1} />
            <Hedge x0={-200} x1={2100} y0={700} y1={GROUND + 40} t={t} part={0.6} px={960} />
            <Helicopter x={1400} y={200} t={t} beam={1} />
          </g>
        ) : null}
        {f === 10 ? (
          <g>
            <rect width={1920} height={1080} fill="#2A2238" />
            <PhoneFrame x={400} y={540}><VideoPost t={t} views={50000} /></PhoneFrame>
            <PhoneFrame x={960} y={540}><Messages t={t} from="Mo" msgs={[{ text: "Bro. Tomorrow, I'm trying the cheat codes.", at: 0 }, { text: "And this time, you're filming.", at: 10 }]} /></PhoneFrame>
            <PhoneFrame x={1500} y={540}><CallScreen t={t} name="Mom" /></PhoneFrame>
            <HotDog x={960} y={950} />
            <Baguette x={1700} y={950} />
          </g>
        ) : null}
        {f === 11 ? <Bedroom t={t} /> : null}
      </ShotFrame>
    </AbsoluteFill>
  );
};
