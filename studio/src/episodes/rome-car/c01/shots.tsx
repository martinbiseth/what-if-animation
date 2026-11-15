import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, TitleCard, walkPose, faceAt } from '../../../engine';
import { YOU, MO, FARMER, faceCU, wordF, carShot, povShot, insert, fuelShot, onGround, Soft } from '../common';
import { Country, GROUND, romeHip, Horse, Gps, Licence, Notes, TunnelView, Windscreen, FuelGauge, Car, RoadView } from '../sets';
import words from './words.json';

// Chapter 1, the tunnel: three days after your driving test, you and Mo drive into a tunnel; static, flicker, a flash;
// a dirt track in blazing sun, a man with a donkey who runs, the satnav gives up; Mo points at an aqueduct and a city
// of white marble. The title. Every kilometre now costs something you can never get back.

const W = words as { w: string; s: number; e: number }[];
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Country t={t} id={id} mode="day" city={false} aqueduct={false} />;
const MODERN: React.FC<{ t: number; id?: string }> = ({ t, id }) => <RoadView t={t} id={id} kind="modern" />;

// ---------- S1: the windscreen on an ordinary modern road, the satnav reads 8:40 ----------
export const S1 = povShot({ kind: 'modern', speed: 1.2, gps: '08:40  •  12 km/h over', zoom: [1.06, 1] });

// ---------- S2: you at the wheel, holding up the licence, very pleased ----------
export const S2 = faceCU({
  look: YOU, Bg: MODERN, faces: [[0, 'smug'], [24, 'happy']], yaw: 0.35, zoom: [3.1, 3.3], side: -40,
  pose: { armL: { a: 150, b: 30 } },
  extra: (t) => <Licence x={1060} y={430 - Math.sin(t / 8) * 6} s={0.55} rot={-8 + Math.sin(t / 10) * 3} />,
});

// ---------- S3: Mo in the passenger seat, scrolling his phone, notes rising ----------
export const S3 = faceCU({
  look: MO, Bg: MODERN, faces: [[0, 'happy'], [30, 'cool']], yaw: -0.35, zoom: [3.1, 3.25], side: 40,
  pose: { armR: { a: 40, b: 100 }, headTilt: 6 },
  extra: (t) => (
    <g>
      <rect x={1022} y={580} width={44} height={74} rx={8} fill="#1A1A22" stroke="#100E16" strokeWidth={4} transform="rotate(-14 1044 617)" />
      <Notes x={1050} y={570} t={t} s={0.55} />
      <g transform={`translate(0 ${Math.sin(t / 5) * 3})`} />
    </g>
  ),
});

// ---------- S4: wide, the car drives into the tunnel in the hillside ----------
export const S4 = carShot({
  Bg: (t) => <Country t={t} mode="day" city={false} aqueduct={false} tunnel="tunnel" />,
  car: { x: [1700, 560], s: 0.62, flip: true, lights: 1, ease: 'lin' },
  cam: { from: [1000, 600, 1], to: [820, 640, 1.12] },
});

// ---------- S5: inside the tunnel, the satnav loses the radio ----------
export const S5 = povShot({ scene: (t) => <TunnelView t={t} />, gps: 'FM 98.4  ~ static ~', shake: 3 });

// ---------- S6: the lights flicker ----------
export const S6 = povShot({ scene: (t) => <TunnelView t={t} flick={0.9} />, gps: '~ ~ ~', shake: 4, zoom: [1.04, 1.08] });

// ---------- S7: the flash ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const fl = kf(t, [[0, 0], [Math.min(10, len), 1]], easeOut);
  return (
    <g>
      <g transform={camT(960, 540, 1.04 + fl * 0.1)}>
        <Windscreen t={t} shake={6}>
          <TunnelView t={t} flash={fl} />
        </Windscreen>
      </g>
      <Glow x={960} y={470} r={1400} kind="cool" o={fl} />
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={fl * 0.9} />
    </g>
  );
};

// ---------- S8: you screw your eyes shut in the white light ----------
export const S8: React.FC<ShotProps> = (p) => {
  const Inner = faceCU({ look: YOU, Bg: ({ t }) => <rect x={-400} y={-400} width={2800} height={1900} fill="#E8F0FF" />, faces: [[0, 'shock']], yaw: 0.1, zoom: [3.3, 3.6], pose: { blink: 1, armR: { a: 150, b: 60 } }, light: { x: 960, y: 520, kind: 'cool', o: 1 } });
  return (
    <g>
      <Inner {...p} />
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={kf(p.t, [[0, 0.6], [12, 0.15]])} />
    </g>
  );
};

// ---------- S9: you open your eyes: warm sun pours over your face ----------
export const S9 = faceCU({
  look: YOU, Bg: DAY, faces: [[0, 'tired'], [10, 'shock']], yaw: 0.25, zoom: [3.4, 3.2], light: { x: 1150, y: 420, o: 1 },
  pose: { blink: 0 },
});

// ---------- S10: wide, the car on a dirt track in the blazing sun; no road, no tunnel ----------
export const S10 = carShot({
  Bg: (t) => <Country t={t} mode="day" city={false} aqueduct={false} tunnel="hill" />,
  car: { x: [760, 860], s: 0.7, flip: true, brake: 1, dust: 0.6, ease: 'io' },
  cam: { from: [960, 560, 1.15], to: [960, 600, 1.02] },
});

// ---------- S11: a man with a donkey, staring at the car ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const man: Pose = onGround(1010, 1, { yaw: -0.6, expr: 'shock', look: -0.8, armL: { a: 30, b: -30 }, armR: { a: 50, b: 80 }, blink: idleBlink(t, 3) });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1020]]), 600, kf(t, [[0, 1.6], [len, 1.8]]))}>
      <DAY t={t + 40} />
      <Car x={330} y={GROUND} s={0.7} flip t={t} />
      <Horse x={1340} y={GROUND} s={0.62} donkey color="#8A8478" flip t={t} />
      <path d="M 1100 728 q 50 -40 100 0 Z" fill="#C89A4A" stroke="#100E16" strokeWidth={4} />
      <Hero look={FARMER} pose={man} />
    </g>
  );
};

// ---------- S12: he drops the basket and runs off; apples roll; the donkey stays ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const run = clamp((t - 6) / Math.max(1, len - 6));
  const x = 1010 + run * 900;
  const man = t < 6 ? onGround(1010, 1, { yaw: -0.6, expr: 'shock', armL: { a: 120, b: 0 }, armR: { a: 130, b: 0 }, squash: 0.08 }) : walkPose(x, t * 1.1, GROUND, 1, { expr: 'shock', armL: { a: 150, b: 10 }, armR: { a: 150, b: -10 }, tilt: 14 }, 1);
  return (
    <g transform={camT(1050, 600, 1.45)}>
      <DAY t={t + 80} />
      <Horse x={1260} y={GROUND} s={0.62} donkey color="#8A8478" flip t={t} />
      {[0, 1, 2, 3, 4].map((k) => {
        const p = clamp((t - 6) / 30);
        return <circle key={k} cx={1040 + k * 30 + p * (60 + k * 50)} cy={GROUND - 12 - Math.abs(Math.sin(p * 6 + k)) * 30 * (1 - p)} r={12} fill="#C8302E" stroke="#100E16" strokeWidth={3} />;
      })}
      <path d={`M ${1000 + clamp((t - 6) / 10) * 40} ${GROUND - 20} q 50 -40 100 0 Z`} fill="#C89A4A" stroke="#100E16" strokeWidth={4} transform={`rotate(${clamp((t - 6) / 8) * 80} 1050 ${GROUND})`} />
      <Hero look={FARMER} pose={man} />
    </g>
  );
};

// ---------- S13: the satnav: RECALCULATING... then a blank grid ----------
export const S13: React.FC<ShotProps> = (p) => {
  const quiet = wordF(W, 'nothing') - wordF(W, 'GPS');
  const Inner = insert({ Bg: DAY, draw: (t) => <Gps x={960} y={540} s={1.5} t={t} text={t < quiet ? 'RECALCULATING...' : 'NO ROUTE'} lost={clamp((t - quiet) / 6)} /> });
  return <Inner {...p} />;
};

// ---------- S14: Mo points through the windscreen ----------
export const S14 = povShot({ kind: 'dirt', speed: 0, moPoint: (t) => backOut(clamp((t - 2) / 8)), city: [0, 0.6] });

// ---------- S15: the aqueduct striding across the hills ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 1150]]), 560, kf(t, [[0, 1.25], [len, 1.15]]))}>
    <Country t={t + 300} mode="day" city aqueduct />
    <Car x={300} y={GROUND} s={0.5} flip t={t} />
  </g>
);

// ---------- S16: push in on the marble city ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1250], [len, 1300]]), kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.4], [len, 2.1]]))}>
    <Country t={t + 360} mode="day" city aqueduct />
  </g>
);

// ---------- S17: the title over the car on the hill, the sun going down behind Rome ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.06]]))}>
      <Country t={t + 400} mode="dusk" city aqueduct cityX={1100} />
      <Car x={560} y={GROUND} s={0.6} lights={1} t={t} />
      <Hero look={YOU} pose={onGround(980, 0.6, { yaw: 0.5, look: 0.8, blink: idleBlink(t, 2) })} />
      <Hero look={MO} pose={onGround(1060, 0.6, { yaw: 0.4, look: 0.8, armR: { a: 110, b: 0 }, handR: 'point', blink: idleBlink(t, 5) })} />
    </g>
    <TitleCard t={t} lines={['WHAT IF YOU BROUGHT A', 'MODERN CAR TO ANCIENT ROME?']} size={96} accent="ROME" />
  </g>
);

// ---------- S18: you up on the car's sill, arms flung out over Rome ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const me = { ...onGround(930, 1, { yaw: 0.2, expr: 'happy' as const, armL: { a: 120, b: 0 }, armR: { a: 120, b: 0 } }), y: GROUND + 40 - 314 * 0.95 - 140 + Math.sin(t / 12) * 2, blink: idleBlink(t, 2) };
  return (
    <g transform={camT(980, kf(t, [[0, 520], [len, 480]]), kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Country t={t + 450} mode="dusk" city aqueduct cityX={1300} />
      <Glow x={1300} y={500} r={600} o={0.5} />
      <Car x={900} y={GROUND + 40} s={0.95} t={t} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S19: the fuel gauge ticks down off FULL ----------
export const S19 = fuelShot(1, 0.95, 0);
