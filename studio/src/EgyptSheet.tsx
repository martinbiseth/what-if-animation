import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { ShotFrame, Giza, NileBank, Camp, Dunes, ThroneHall, AerialGiza, AerialNight, DroneHud, Drone, Controller, DroneBattery, SolarPanel, DroneCase, Camel, Goat, Rations, Papyrus, Spear, NileBoat, Sledge, Hero, basePose, egyptHip, camT } from './engine';
import { YOU, NEFER, HEMIUNU, KING, DJEDI, WORKER, WORKER2, WORKER3, FATHER, GUARD } from './episodes/drone-egypt/cast';

// The drone-in-Egypt kit: 0 Giza day, 1 Giza dusk, 2 Nile, 3 camp, 4 hall, 5 aerial, 6 aerial night + HUD, 7 props, 8 cast, 9 dunes storm
export const EgyptSheet: React.FC = () => {
  const f = useCurrentFrame();
  const t = 40;
  const cast = [YOU, NEFER, HEMIUNU, KING, DJEDI, WORKER, WORKER2, WORKER3, FATHER, GUARD];
  return (
    <AbsoluteFill style={{ background: '#111' }}>
      <ShotFrame>
        {f === 0 ? <Giza t={t} tod="day" /> : null}
        {f === 1 ? <Giza t={t} tod="dusk" /> : null}
        {f === 2 ? <NileBank t={t} /> : null}
        {f === 3 ? <Camp t={t} /> : null}
        {f === 4 ? <ThroneHall t={t} /> : null}
        {f === 5 ? <g transform={camT(900, 600, 0.55)}><AerialGiza t={t} shortcut={1} /></g> : null}
        {f === 6 ? <g><g transform={camT(960, 540, 1)}><AerialNight t={t} fire={[1100, 500]} wave /></g><DroneHud t={t} battery={18} warn="SIGNAL LOST" /></g> : null}
        {f === 7 ? (
          <g>
            <rect width={1920} height={1080} fill="#C8A878" />
            <Drone x={300} y={220} s={0.9} t={t} />
            <Drone x={700} y={220} s={0.7} t={t} on={false} folded />
            <Controller x={1250} y={330} s={0.5} t={t} view={(tt) => <g transform={camT(1100, 540, 0.6)}><AerialGiza t={tt} /></g>} warn="BATTERY TEMPERATURE TOO HIGH" />
            <DroneBattery x={1700} y={150} level={0.5} />
            <SolarPanel x={400} y={560} s={0.6} crack={1} />
            <DroneCase x={1000} y={620} s={0.5} open={1} />
            <Camel x={1500} y={760} s={0.8} t={t} />
            <Goat x={1800} y={760} s={0.9} t={t} chew />
            <Rations x={200} y={960} s={0.8} />
            <Papyrus x={600} y={900} s={0.6} />
            <Spear x={1000} y={960} rot={-10} />
            <NileBoat x={1500} y={1040} s={0.5} t={t} />
            <Sledge x={1100} y={1060} s={0.4} />
          </g>
        ) : null}
        {f === 8 ? (
          <g>
            <Giza t={t} tod="gold" workers={false} sledge={false} />
            {cast.map((L, i) => {
              const sc = L === NEFER ? 0.72 : 0.9;
              return <Hero key={i} look={L} pose={{ ...basePose, x: 120 + i * 185, y: egyptHip(sc), scale: sc, yaw: 0.25, expr: i % 3 ? 'neutral' : 'happy' }} />;
            })}
          </g>
        ) : null}
        {f === 9 ? <Dunes t={t} tod="dusk" storm={0.6} /> : null}
      </ShotFrame>
    </AbsoluteFill>
  );
};
