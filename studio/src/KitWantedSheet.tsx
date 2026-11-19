import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import {
  ShotFrame, Hero, basePose, LOOKS, Downtown, WalkSignal, ParkingLot, Laundromat, Subway, Alley, StationDesk, Mall, FoodTable, Bridge,
  PoliceCar, PoliceCarFront, Helicopter, Barrier, TrafficCone, Bicycle, BusShelter, PostSign, Dumpster, Badge, Folder, Skateboard, ChocBar, Wrapper,
  LibraryBook, Notebook, DispatchMap, NewsScreen, ThermalView, ThermalHud, HOT, WantedStars, StarsOver, townHip, SirenWash,
} from './engine';

// The wanted episode's kit: 0 downtown, 1 lot, 2 laundromat, 3 subway, 4 alley, 5 station, 6 mall, 7 bridge, 8 props, 9 map+news, 10 thermal
export const KitWantedSheet: React.FC = () => {
  const f = useCurrentFrame();
  const t = 40;
  const you = { ...basePose, x: 900, y: townHip(1), scale: 1, yaw: 0.3 };
  return (
    <AbsoluteFill style={{ background: '#111' }}>
      <ShotFrame>
        {f === 0 ? <g><Downtown t={t} /><WalkSignal x={300} y={810} /><Hero look={LOOKS.you} pose={you} /><StarsOver pose={you} k={[[0, 2.25]]} t={t} /></g> : null}
        {f === 1 ? <g><ParkingLot t={t} police={1} /><PoliceCar x={600} y={900} t={t} /><Bicycle x={1200} y={900} /></g> : null}
        {f === 2 ? <Laundromat t={t} police={1} /> : null}
        {f === 3 ? <Subway t={t} gate={0.6} alarm={1} /> : null}
        {f === 4 ? <Alley t={t} light={1} /> : null}
        {f === 5 ? <StationDesk t={t} /> : null}
        {f === 6 ? <g><Mall t={t} screen={(x, y, w, h, i) => <NewsScreen x={x} y={y} w={w} h={h} t={t} headline="SEARCH FOR TEEN" kind="face" id={`ns${i}`} />} /><FoodTable x={960} y={900} /></g> : null}
        {f === 7 ? <g><Bridge t={t} /><Helicopter x={1300} y={200} s={0.7} t={t} beam={{ a: 20, len: 700, w: 300 }} /></g> : null}
        {f === 8 ? (
          <g>
            <rect width={1920} height={1080} fill="#4A5468" />
            <Barrier x={200} y={300} /><TrafficCone x={450} y={300} /><BusShelter x={750} y={520} s={0.9} /><PostSign x={1150} y={500} lines={['KEEP', 'OFF']} />
            <Dumpster x={1550} y={400} s={0.8} /><Badge x={150} y={700} s={0.7} /><Folder x={450} y={700} s={0.6} open={1} /><Skateboard x={750} y={700} />
            <ChocBar x={950} y={700} /><Wrapper x={1100} y={700} s={2} /><LibraryBook x={1300} y={760} s={0.6} stamp={1} /><PoliceCarFront x={1650} y={850} s={0.7} t={t} />
            <WantedStars x={500} y={1050} n={3} t={t} /><WantedStars x={1100} y={1050} n={6} max={6} t={t} />
          </g>
        ) : null}
        {f === 9 ? <g><DispatchMap t={t} close={0.6} label="EVANS ST" heli={1} /><NewsScreen x={1200} y={60} w={640} h={360} t={t} headline="DISPATCH GLITCH?" /></g> : null}
        {f === 10 ? <g><ThermalView><Alley t={t} /></ThermalView><Hero look={HOT as any} pose={{ ...basePose, x: 960, y: 640, scale: 1 }} /><ThermalHud t={t} lock={1} y={560} /></g> : null}
        {f === 11 ? <g><Downtown t={t} tod="night" police={1} /><Notebook x={960} y={540} t={200} title="THE RULES" lines={[{ at: 0, text: 'Library book: 1 star' }, { at: 0, text: 'Skateboard: 1 star' }, { at: 0, text: 'Running: 2 stars!', hot: true }]} /><SirenWash t={t} /></g> : null}
      </ShotFrame>
    </AbsoluteFill>
  );
};
