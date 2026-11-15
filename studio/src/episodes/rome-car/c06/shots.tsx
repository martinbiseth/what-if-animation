import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, Glow, walkPose, SchLabel, SCH, DrawOn, talkAt, LEG_LEN } from '../../../engine';
import { YOU, MO, GUARD, SOLDIER, EMPEROR, ENGINEER, faceCU, wordF, span, SchematicBg, carShot, povShot, insert, onGround, fuelShot, CarHeads } from '../common';
import { Country, Forum, Palace, PALACE, GoldRoom, GOLDROOM, CityGate, GROUND, Car, CarFront, Spear, Horse, Torch, Key, PalaceMap, Grapes, RoadView, Windscreen } from '../sets';
import words from './words.json';

// Chapter 6, the escape: the maths (a quarter tank is 150 km, the war is 2,000 km away); the tunnel is 40 km south.
// Apollodorus knocks: "Go home", a key and a map. Mo in a storeroom eating grapes. The car pushed out in silence, the
// engine at the foot of the hill, a guard shouts; dark streets, Mo navigating by phone light; the soldiers at the gate
// step aside. Cavalry on the Roman road; the high beams; the horses rear; south on the Appian Way on the last fuel.

const W = words as { w: string; s: number; e: number }[];
const rel = (a: string, b: string, nb = 1) => wordF(W, b, nb) - wordF(W, a);
const GOLD: React.FC<{ t: number; id?: string }> = ({ t, id }) => <GoldRoom t={t} id={id} />;
const NIGHTPAL: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Palace t={t} id={id} mode="night" />;
const NIGHTROAD: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Country t={t} id={id} mode="night" stone city={false} />;
const STREETS: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Forum t={t} id={id} mode="night" torches={1} />;
const PF = PALACE.feet;
const onPal = (x: number, s = 1, o: Partial<Pose> = {}): Pose => ({ ...onGround(x, s), y: PF - LEG_LEN * s, ...o });
const R = GOLDROOM;
const inRoom = (u: number, w: number, s: number, o: Partial<Pose> = {}): Pose => {
  const p = R.P(u, 1, w);
  return { ...basePose, x: p.x, y: p.y - LEG_LEN * s, scale: s, ...o };
};
const roomDoor = (open: number) => (
  <g>
    <polygon points={R.Q([[0, 0.38, 0.2], [0, 0.38, 0.55], [0, 1, 0.55], [0, 1, 0.2]])} fill="#2A1C10" stroke="#100E16" strokeWidth={5} />
    <polygon points={R.Q([[0, 0.38, 0.2], [0.02 + open * 0.16, 0.36, 0.2 + (1 - open) * 0.35], [0.02 + open * 0.16, 1.02, 0.2 + (1 - open) * 0.35], [0, 1, 0.2]])} fill="#6A4A2A" stroke="#100E16" strokeWidth={5} />
  </g>
);

/** A cavalryman on a horse, facing right (flip faces left); `rear` lifts the horse, `fly` throws the rider off backwards. */
const Rider: React.FC<{ x: number; y: number; s?: number; t: number; run?: number; flip?: boolean; rear?: number; fly?: number; color?: string; torch?: boolean }> = ({ x, y, s = 0.62, t, run = 0, flip = false, rear = 0, fly = 0, color = '#5A3A26', torch = false }) => {
  const d = flip ? -1 : 1;
  const bob = run ? Math.abs(Math.sin(run)) * 14 * s : 0;
  const hs = s * 1.0;
  const rider: Pose = {
    ...basePose, x: x - d * (20 * s + fly * 260 * s), y: y - 330 * s - bob - rear * 120 * s - Math.sin(fly * Math.PI) * 220 * s, scale: hs,
    yaw: 0.6 * d, look: 0.6 * d, tilt: d * (8 - rear * 30 - fly * 120), expr: fly > 0 ? 'shock' : rear > 0 ? 'shock' : 'neutral',
    legL: { a: 30 * d, b: 40 * d }, legR: { a: 20 * d, b: 50 * d }, armR: { a: fly > 0 ? 160 : 70, b: fly > 0 ? 0 : -20 }, armL: { a: fly > 0 ? 150 : 60, b: -10 }, blink: idleBlink(t, 3),
  };
  return (
    <g>
      <Horse x={x} y={y} s={s} flip={flip} run={run} rear={rear} color={color} />
      <Hero look={GUARD} pose={rider} shadow={0} />
      {torch && !fly ? <Torch x={rider.x + d * 60 * s} y={rider.y - 140 * s} t={t} s={s * 1.2} /> : null}
    </g>
  );
};

// ---------- S1: you do the maths in the gold room ----------
export const S1 = faceCU({ look: YOU, Bg: GOLD, faces: [[0, 'worried']], yaw: 0.3, zoom: [3.2, 3.4], pose: { armR: { a: 120, b: 110 }, headTilt: 8 }, light: { x: 1200, y: 500, o: 0.7 } });

// ---------- S2: a quarter of a tank, about 150 km ----------
const RANGE = (t: number, km: number, max: number, color: string, y: number, label: string, t0 = 0) => {
  const w = (km / max) * 1400 * clamp((t - t0) / 18);
  return (
    <g>
      <rect x={260} y={y - 30} width={w} height={60} rx={10} fill={color} />
      <SchLabel x={260 + Math.max(w, 10) + 20} y={y + 14} t={t - t0 - 18} text={label} size={40} color={color} anchor="start" />
    </g>
  );
};
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SchematicBg t={t} />
    <SchLabel x={960} y={220} t={t - 2} text="A QUARTER OF A TANK" size={56} color={SCH.dim} />
    {RANGE(t, 150, 2000, SCH.live, 540, '≈ 150 KM', 6)}
    <path d="M 260 470 L 260 610" stroke={SCH.line} strokeWidth={6} />
    <SchLabel x={260} y={680} t={t - 4} text="ROME" size={32} />
  </g>
);

// ---------- S3: the war in the east, more than 2,000 km away ----------
export const S3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SchematicBg t={t} />
    <SchLabel x={960} y={220} t={t - 2} text="THE WAR IN THE EAST" size={56} color={SCH.dim} />
    {RANGE(t + 40, 150, 2000, SCH.live, 460, '150 KM', 0)}
    <DrawOn d="M 260 640 L 1660 640" t={t - 4} dur={26} color="#FF4A3A" width={14} />
    <SchLabel x={1660} y={720} t={t - 30} text="2,000+ KM" size={52} color="#FF4A3A" />
    <path d="M 260 400 L 260 700" stroke={SCH.line} strokeWidth={6} />
    <SchLabel x={260} y={770} t={t} text="ROME" size={32} />
  </g>
);

// ---------- S4: the car dead in the desert ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 580, kf(t, [[0, 1.05], [len, 1.2]]))}>
    <Country t={t + 500} mode="day" city={false} aqueduct={false} />
    <rect x={-600} y={-500} width={3100} height={2100} fill="#F2B24A" opacity={0.28} />
    <Car x={900} y={GROUND} s={0.7} t={t} dirt={0.8} flat={1} id="c6s4" />
    <Hero look={YOU} pose={onGround(1330, 0.72, { yaw: -0.2, expr: 'tired', armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 }, headTilt: 16, blink: idleBlink(t, 2) })} />
    {[0, 1].map((k) => (
      <path key={k} d={`M ${700 + k * 300 + Math.sin(t / 9 + k) * 80} ${220 + k * 40} q 30 -24 60 0 q 30 -24 60 0`} stroke="#26232F" strokeWidth={6} fill="none" />
    ))}
  </g>
);

// ---------- S5: the emperor finds out it's useless ----------
export const S5 = faceCU({ look: EMPEROR, Bg: NIGHTPAL, faces: [[0, 'neutral'], [20, 'cool']], yaw: -0.3, zoom: [3.2, 3.6], side: 40, light: { x: 760, y: 520, o: 0.6 } });

// ---------- S6: the tunnel is only 40 km south ----------
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SchematicBg t={t} />
    <circle cx={960} cy={300} r={18} fill={SCH.line} />
    <SchLabel x={1060} y={312} t={t - 2} text="ROME" size={40} anchor="start" />
    <DrawOn d="M 960 330 Q 900 520 960 760" t={t - 6} dur={22} color={SCH.live} width={10} />
    <g opacity={clamp((t - 26) / 6)}>
      <path d="M 900 800 Q 960 720 1020 800 Z" fill="none" stroke={SCH.live} strokeWidth={8} />
    </g>
    <SchLabel x={1060} y={800} t={t - 28} text="THE TUNNEL" size={44} color={SCH.live} anchor="start" />
    <SchLabel x={820} y={560} t={t - 18} text="40 KM" size={52} color={SCH.live} anchor="end" />
    <SchLabel x={1700} y={180} t={t} text="N ↑" size={32} color={SCH.dim} />
  </g>
);

// ---------- S7: maybe it still works, maybe it doesn't ----------
export const S7 = faceCU({ look: YOU, Bg: GOLD, faces: [[0, 'worried'], [rel('Maybe', 'Maybe', 2), 'oops']], yaw: 0.25, zoom: [3.3, 3.2], pose: { look: -0.6 }, light: { x: 1200, y: 500, o: 0.7 } });

// ---------- S8: the last fuel for nothing ----------
export const S8 = fuelShot(0.25, 0.03, 1, GOLD);

// ---------- S9: a knock; Apollodorus slips in and shuts the door ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const kn = rel('Then', "It's");
  const open = clamp((t - kn) / 8) * (1 - clamp((t - kn - 30) / 8));
  const ex = kf(t, [[0, 0.02], [kn, 0.02], [kn + 26, 0.22]]);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1.15]]))}>
      <GoldRoom t={t} />
      {roomDoor(open)}
      {t > kn ? <Hero look={ENGINEER} pose={walkPose(R.P(ex, 1, 0.38).x, t * 0.4, R.P(ex, 1, 0.38).y, 0.72, { expr: 'worried' }, 1)} /> : null}
      <Hero look={YOU} pose={inRoom(0.6, 0.45, 0.74, { yaw: -0.5, look: -0.7, expr: t > kn ? 'shock' : 'tired', blink: idleBlink(t, 2) })} />
      {t < kn + 6 ? [0, 1, 2].map((k) => <path key={k} d={`M ${R.P(0, 0.6, 0.4).x + 30 + k * 14} ${R.P(0, 0.6, 0.4).y - 20 - k * 20} l 20 -6`} stroke="#F6EFE3" strokeWidth={5} opacity={clamp((t - k * 3) / 3)} />) : null}
    </g>
  );
};

// ---------- S10: "Go home." ----------
export const S10 = faceCU({
  look: ENGINEER, Bg: GOLD, faces: [[0, 'worried'], [rel('An', 'Go'), 'neutral']], yaw: -0.3, zoom: [3.3, 3.5], side: 40, words: W,
  talk: span(W, 'An', 'home') as [number, number], light: { x: 1200, y: 500, o: 0.8 },
});

// ---------- S11: a key and a map of the palace in your hands ----------
export const S11 = insert({
  Bg: GOLD,
  draw: (t) => (
    <g>
      <g transform={`translate(0 ${(1 - backOut(clamp(t / 10))) * 300})`}>
        <Key x={760} y={560} s={2.2} rot={-20} />
      </g>
      <g opacity={clamp((t - rel('He', 'map')) / 6)} transform={`translate(0 ${(1 - backOut(clamp((t - rel('He', 'map')) / 10))) * 300})`}>
        <PalaceMap x={1180} y={540} s={1.6} rot={6} />
      </g>
    </g>
  ),
});

// ---------- S12: Mo locked in a storeroom, eating grapes ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const open = clamp(t / 10);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.1], [len, 1.3]]))}>
      <GoldRoom t={t} id="store" store lamp={0.6} />
      <Glow x={300} y={620} r={700} o={open * 0.5} />
      <Hero look={MO} pose={{ ...inRoom(0.55, 0.5, 0.74), y: R.P(0.55, 1, 0.5).y - 70, yaw: -0.3, expr: 'happy', legL: { a: 80, b: -80 }, legR: { a: 76, b: -76 }, armR: { a: 150, b: 40 + Math.sin(t / 3) * 10 }, talk: Math.max(0, Math.sin(t / 2)) * 0.5, blink: idleBlink(t, 4) }} />
      <Grapes x={R.P(0.55, 1, 0.5).x + 50} y={R.P(0.55, 1, 0.5).y - 270} s={0.5} />
    </g>
  );
};

// ---------- S13: "Took you long enough." ----------
export const S13 = faceCU({
  look: MO, Bg: (p) => <GoldRoom {...p} store lamp={0.6} />, faces: [[0, 'smug']], yaw: -0.3, zoom: [3.2, 3.3], side: 40, words: W,
  talk: span(W, 'Took', 'enough') as [number, number], pose: { armR: { a: 140, b: 50 } },
  extra: () => <Grapes x={1060} y={520} s={0.7} />,
});

// ---------- S14: you push the car out of the courtyard, headlights off ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 820], [len, 1040]]);
  const push = (dx: number, look: typeof YOU, k: number) => (
    <Hero look={look} pose={{ ...walkPose(x - 400 + dx, t * 0.25, PF, 0.78, { expr: 'worried', tilt: 18, armL: { a: 80, b: 0 }, armR: { a: 84, b: 0 } }, 1), blink: idleBlink(t, k) }} />
  );
  return (
    <g transform={camT(960, 600, 1.1)}>
      <NIGHTPAL t={t} />
      <Car x={x} y={PF + 40} s={0.7} t={t} spin={t * 3} id="c6s14" inside={<g />} />
      {push(0, YOU, 2)}
      {push(-90, MO, 4)}
    </g>
  );
};

// ---------- S15: at the bottom of the hill, the engine starts ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const on = rel('At', 'start');
  const lit = clamp((t - on) / 4);
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <NIGHTROAD t={t} />
      <Car x={900} y={GROUND} s={0.75} t={t} lights={lit} bounce={lit * Math.abs(Math.sin(t * 2)) * 4} id="c6s15" inside={<CarHeads t={t} you={{ expr: 'worried' }} mo={{ expr: 'shock' }} />} />
      {lit > 0 ? [0, 1, 2].map((k) => <circle key={k} cx={420 - ((t * 4 + k * 30) % 90)} cy={GROUND - 50 - ((t * 2 + k * 15) % 40)} r={14 + ((t * 2 + k * 20) % 30)} fill="#8A8A9A" opacity={0.4 * lit} />) : null}
    </g>
  );
};

// ---------- S16: up on the palace, a guard with a torch shouts ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.3], [len, 1.5]]))}>
    <NIGHTPAL t={t + 60} />
    <Torch x={1160} y={PF - 420} t={t} s={1.2} />
    <Hero look={GUARD} pose={onPal(1050, 1, { yaw: 0.3, expr: 'shock', armR: { a: 130, b: 20 }, handR: 'point', talk: Math.abs(Math.sin(t / 2)), blink: idleBlink(t, 3) })} />
  </g>
);

// ---------- S17: racing through the dark streets ----------
export const S17 = carShot({
  Bg: (t) => <STREETS t={t} />,
  car: { x: [-200, 2100], s: 0.62, lights: 1, ease: 'lin', you: { expr: 'worried' }, mo: { expr: 'shock' } },
  cam: { from: [760, 600, 1.05], to: [1160, 600, 1.05] },
});

// ---------- S18: Mo reads the map by the light of his phone ----------
export const S18 = faceCU({
  look: MO, Bg: STREETS, faces: [[0, 'neutral']], yaw: 0.3, zoom: [3.2, 3.3], side: -40, pose: { look: 0.4, headTilt: 10, armL: { a: 40, b: 100 }, armR: { a: 40, b: 100 } },
  light: { x: 960, y: 680, kind: 'cool', o: 1 },
  extra: (t) => (
    <g>
      <PalaceMap x={920} y={800} s={0.9} rot={-4} />
      <rect x={1110} y={720} width={50} height={84} rx={8} fill="#DDEBFF" stroke="#100E16" strokeWidth={4} />
      <Glow x={1135} y={760} r={300} kind="cool" o={0.6 + Math.sin(t / 4) * 0.05} />
    </g>
  ),
});

// ---------- S19: the city gate at night; the soldiers see you coming ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const lit = 1;
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.15], [len, 1.25]]))}>
      <CityGate t={t} mode="night" />
      <Glow x={200} y={760} r={700} kind="cool" o={0.5 * lit} />
      {[1250, 1450].map((x, i) => (
        <g key={i}>
          <Spear x={x + 40} y={GROUND - 20} len={420} rot={-4} />
          <Hero look={SOLDIER} pose={onGround(x, 0.9, { yaw: -0.6, look: -0.8, expr: 'shock', armR: { a: 30, b: -60 }, blink: idleBlink(t, i + 3) })} />
        </g>
      ))}
    </g>
  );
};

// ---------- S20: this time they don't even raise their spears ----------
export const S20 = faceCU({ look: SOLDIER, Bg: (p) => <CityGate {...p} mode="night" />, faces: [[0, 'shock'], [24, 'tired']], yaw: -0.3, zoom: [3.1, 3.2], side: 40, light: { x: 500, y: 560, kind: 'cool', o: 0.9 }, pose: { armR: { a: 20, b: -10 } } });

// ---------- S21: they step aside; the car flies through the gate ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const step = clamp(t / 12);
  return (
    <g transform={camT(960, 600, 1.1)}>
      <CityGate t={t} mode="night" />
      {[[760, -1], [1160, 1]].map(([x, d], i) => (
        <g key={i}>
          <Spear x={x + d * 180 * step + d * 40} y={GROUND - 20} len={420} rot={d * 6} />
          <Hero look={SOLDIER} pose={onGround(x + d * 180 * step, 0.9, { yaw: d * -0.4, expr: 'tired', blink: idleBlink(t, i + 3) })} />
        </g>
      ))}
      <Car x={kf(t, [[0, -500], [len, 2400]])} y={GROUND + 20} s={0.7} t={t} lights={1} spin={t * 30} id="c6s21" inside={<CarHeads t={t} />} />
    </g>
  );
};

// ---------- S22: horses: cavalry across the road ahead ----------
export const S22 = povShot({
  mode: 'night', shake: 5,
  scene: (t) => (
    <g>
      <RoadView t={t} kind="stone" mode="night" speed={1.6} beams={0.5} />
      {[700, 860, 1040, 1200].map((x, i) => (
        <Rider key={i} x={x + Math.sin(t / 6 + i) * 10} y={620 + (i % 2) * 14} s={0.22 + t * 0.0012} t={t} flip={i % 2 === 1} run={t * 0.4 + i} torch color={['#5A3A26', '#4A3022', '#7A4A2E', '#3A2A20'][i]} />
      ))}
    </g>
  ),
});

// ---------- S23: on a smooth highway you'd leave them behind in seconds ----------
export const S23: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SchematicBg t={t} />
    <SchLabel x={960} y={200} t={t - 2} text="ON A SMOOTH HIGHWAY" size={50} color={SCH.dim} />
    <DrawOn d="M 200 560 L 1720 560" t={t - 2} dur={10} color={SCH.dim} width={6} />
    <g transform={`translate(${200 + clamp(t / 30) * 1400} 0)`}>
      <rect x={-120} y={470} width={180} height={70} rx={20} fill={SCH.live} />
      <SchLabel x={-30} y={440} t={t - 4} text="CAR" size={30} color={SCH.live} />
    </g>
    <g transform={`translate(${200 + clamp(t / 30) * 300} 0)`}>
      <rect x={-60} y={480} width={110} height={60} rx={10} fill={SCH.line} />
      <SchLabel x={-5} y={640} t={t - 4} text="HORSES" size={30} />
    </g>
    <SchLabel x={960} y={820} t={t - 26} text="GONE IN SECONDS" size={60} color={SCH.live} />
  </g>
);

// ---------- S24: but this is a Roman road: the wheel hammering over stone blocks ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const b = Math.abs(Math.sin(t * 0.9)) * 18;
  return (
    <g transform={camT(kf(t, [[0, 600], [len, 640]]), 760 - b * 0.3, 2.4)}>
      <Country t={t} mode="night" stone city={false} scroll={t * 40} />
      <Car x={700} y={GROUND} s={0.8} t={t} lights={1} spin={-t * 40} bounce={b} id="c6s24" inside={<CarHeads t={t} you={{ expr: 'shock' }} mo={{ expr: 'shock' }} />} />
      {b > 14 ? <path d={`M 500 ${GROUND - 10} l -30 -30 M 520 ${GROUND - 20} l -10 -40 M 900 ${GROUND - 10} l 30 -30`} stroke="#F6EFE3" strokeWidth={5} /> : null}
    </g>
  );
};

// ---------- S25: you do the one thing they've never seen ----------
export const S25 = faceCU({ look: YOU, Bg: NIGHTROAD, faces: [[0, 'worried'], [16, 'smug']], yaw: 0.3, zoom: [3.3, 3.6], light: { x: 1000, y: 700, kind: 'cool', o: 0.6 } });

// ---------- S26: the high beams flare on ----------
export const S26: React.FC<ShotProps> = ({ t, len }) => {
  const hi = clamp((t - 8) / 4);
  return (
    <g>
      <g transform={camT(960, 600, kf(t, [[0, 1.2], [len, 1.1]]))}>
        <NIGHTROAD t={t} />
        <CarFront x={960} y={GROUND + 60} s={1.3} lights={1} high={hi} id="c6s26" inside={<CarHeads t={t} you={{ expr: 'smug' }} />} />
      </g>
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={hi * (1 - clamp((t - 12) / 8)) * 0.7} />
    </g>
  );
};

// ---------- S27: the horses rear, the riders go flying ----------
export const S27: React.FC<ShotProps> = ({ t, len, f }) => {
  const r0 = 0;
  const fly0 = rel('The', 'riders');
  return (
    <g transform={camT(1000, 600, kf(t, [[0, 1.1], [len, 1.2]]))}>
      <NIGHTROAD t={t} />
      <Car x={420} y={GROUND} s={0.62} t={t} lights={1} high={1} id="c6s27" inside={<CarHeads t={t} you={{ expr: 'smug' }} mo={{ expr: 'shock' }} />} />
      <Glow x={1300} y={640} r={800} kind="cool" o={0.45} />
      {[1150, 1380, 1600].map((x, i) => (
        <Rider key={i} x={x} y={GROUND + (i % 2) * 20} s={0.6} t={t} flip rear={backOut(clamp((t - r0 - i * 3) / 10)) * (1 - clamp((t - fly0 - 30) / 20) * 0.5)} fly={clamp((t - fly0 - i * 2) / 16)} color={['#5A3A26', '#4A3022', '#7A4A2E'][i]} />
      ))}
    </g>
  );
};

// ---------- S28: south on the Appian Way, in the dark, on the last of the fuel ----------
export const S28 = carShot({
  Bg: (t, scroll) => <Country t={t + 300} mode="night" stone city={false} scroll={scroll} />,
  scroll: 26,
  car: { x: [700, 1300], s: 0.55, lights: 1, high: 1, ease: 'lin', bounce: 4, you: { expr: 'smug' }, mo: { expr: 'happy' } },
  cam: { from: [960, 560, 1.15], to: [1100, 500, 0.95] },
});
