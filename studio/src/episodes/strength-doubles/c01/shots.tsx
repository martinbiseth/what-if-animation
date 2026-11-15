import React from 'react';
import { Pose, ShotProps, KITCHEN, stand, KitchenIsland, islandTop, ModernCar, Football, AlarmClock, Mug, DizzyStars } from '../../../engine';
import words from './words.json';
import {
  YOU, MO, MUM, DAD, Hero, basePose, camT, clamp, kf, lerp, easeOut, backOut, idleBlink, faceAt, Glow, POWER,
  StreetSet, KitchenSet, BedroomSet, propCU, faceCU, bigWord, talkShot, ladderCard, liftShot, at, HIP, STREETM, Soft,
  PickleJar, SchoolBag, BigHand, DayTag, Cracks, span,
} from '../common';

// Chapter 1, the cold open: five quick demos across ten days (the jar, the door handle, the bag through the garage
// roof, the car lifted with one hand, the high five you don't dare finish), then the rule and the question.

const KIT = KitchenSet(0.28);
const BED = BedroomSet('06:00', 0.12);
const STREET = StreetSet('day', { car: false });
const A = stand(KITCHEN, 0.38, 0.4);
const B = stand(KITCHEN, 0.62, 0.4);

// ---------- S1: Monday, kitchen: Mum straining at the pickle jar ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const strain = Math.sin(t / 2.5) * 4;
  const mum: Pose = { ...basePose, ...A, yaw: 0.35, expr: 'worried', armR: { a: 60, b: -80 }, armL: { a: 55, b: -90 }, tilt: strain * 0.5, blink: idleBlink(t, 2) };
  const me: Pose = { ...basePose, ...B, yaw: -0.4, expr: 'neutral', blink: idleBlink(t, 5), look: -0.6 };
  const top = islandTop(0.45, 0);
  return (
    <g>
      <g transform={camT(960, 520, kf(t, [[0, 1.55], [len, 1.7]]))}>
        <KIT t={t + 40} id="s1" />
        <Hero look={MUM} pose={mum} />
        <Hero look={YOU} pose={me} />
        <KitchenIsland />
        <PickleJar x={A.x + 70 * A.scale} y={A.y - 10 * A.scale} s={0.32 * A.scale} rot={strain} />
        <PickleJar x={top.x + 220} y={top.y} s={0} />
      </g>
      <DayTag t={t} text="MONDAY" />
    </g>
  );
};

// ---------- S2: insert, the jar passed across into your hand ----------
export const S2 = propCU({ Bg: KIT, push: 0.05, draw: (t) => {
  const p = easeOut(clamp(t / 16));
  return (
    <g>
      <BigHand x={lerp(700, 900, p)} y={620} s={0.9} sleeve="#8A5A8A" rot={-6} />
      <PickleJar x={lerp(760, 1000, p)} y={640} s={1.5} />
      <BigHand x={lerp(1500, 1160, p)} y={560} s={0.9} flip rot={8} />
    </g>
  );
} });

// ---------- S3: Pop: the lid flies off, a spray of brine ----------
export const S3 = propCU({ Bg: KIT, push: 0.04, draw: (t) => {
  const p = clamp((t - 3) / 10);
  return (
    <g transform={`translate(${t < 4 ? Math.sin(t * 3) * 6 : 0} 0)`}>
      <PickleJar x={960} y={900} s={2.2} lid={easeOut(p) * 1.4} />
      {p > 0 ? Array.from({ length: 12 }, (_, i) => (
        <circle key={i} cx={960 + Math.cos(i) * 260 * p} cy={520 - Math.abs(Math.sin(i * 2)) * 260 * p} r={9} fill="#C8E8A8" opacity={1 - p} />
      )) : null}
      <BigHand x={1220} y={760} s={1.1} flip rot={10} />
    </g>
  );
} });

// ---------- S4: Easy: you, smug; Mum behind, mouth open ----------
export const S4 = talkShot({
  Set: KIT, setT: 300,
  cast: [
    { look: MUM, ...A, yaw: 0.4, faces: [[0, 'shock']], look_: 0.8 },
    { look: YOU, ...B, yaw: -0.2, faces: [[0, 'neutral'], [6, 'smug']], pose: { armR: { a: 70, b: -60 } } },
  ],
  cam: { from: [1090, 470, 2.4], to: [1090, 470, 2.55] },
  front: () => <KitchenIsland />,
});

// ---------- S5: Tuesday: bedroom, you swing the door shut ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const swing = easeOut(clamp(t / 14));
  const me: Pose = { ...basePose, x: 820, y: 640, scale: 0.92, yaw: -0.6, expr: 'neutral', armL: { a: lerp(40, 75, swing), b: -10 }, blink: idleBlink(t, 3) };
  return (
    <g>
      <g transform={camT(800, 520, kf(t, [[0, 1.5], [len, 1.6]]))}>
        <BED t={t + 120} id="s5" />
        {/* the door, hinged at x 560, swinging shut toward you */}
        <g transform={`translate(560 300)`}>
          <path d={`M 0 0 L ${lerp(70, 210, swing)} ${lerp(30, 0, swing)} L ${lerp(70, 210, swing)} ${lerp(460, 440, swing)} L 0 440 Z`} fill="#8A5A3A" stroke="#100E16" strokeWidth={6} />
          <circle cx={lerp(58, 182, swing)} cy={230} r={11} fill="#E8C04A" stroke="#100E16" strokeWidth={4} />
        </g>
        <Hero look={YOU} pose={me} />
      </g>
      <DayTag t={t} text="TUESDAY" />
    </g>
  );
};

// ---------- S6: insert: the handle comes away in your hand, a hole in the door ----------
export const S6 = propCU({ Bg: BED, push: 0.06, draw: (t) => {
  const p = easeOut(clamp((t - 4) / 10));
  return (
    <g>
      <rect x={560} y={-40} width={800} height={1200} fill="#8A5A3A" stroke="#100E16" strokeWidth={10} />
      <rect x={620} y={60} width={680} height={400} fill="none" stroke="#6A4228" strokeWidth={10} />
      <rect x={620} y={560} width={680} height={460} fill="none" stroke="#6A4228" strokeWidth={10} />
      <circle cx={1180} cy={520} r={44} fill="#100E16" opacity={p} />
      <Cracks x={1180} y={520} s={1.4} p={p} seed={3} color="#3A2414" />
      <g transform={`translate(${lerp(1180, 860, p)} ${lerp(520, 600, p)}) rotate(${p * -30})`}>
        <circle r={50} fill="#E8C04A" stroke="#100E16" strokeWidth={6} />
        <rect x={-20} y={-6} width={110} height={30} rx={14} fill="#E8C04A" stroke="#100E16" strokeWidth={6} />
        <rect x={-10} y={40} width={20} height={70} fill="#9A8A6A" />
      </g>
      <BigHand x={lerp(1180, 860, p) - 20} y={lerp(560, 640, p)} s={0.9} rot={-20} />
    </g>
  );
} });

// ---------- S7: Thursday, street: Mo kicks the ball, it lands on the garage roof ----------
const ROOF_Y = STREETM.feet - 470; // on the slope of the garage house's roof
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 8) / 26);
  const bx = lerp(820, 300, k), by = lerp(HIP + 300, ROOF_Y - 20, k) - Math.sin(k * Math.PI) * 300;
  const mo: Pose = at(900, { yaw: -0.5, expr: t > 34 ? 'oops' : 'happy', legR: { a: t > 6 && t < 14 ? -50 : 0, b: 10 }, armL: { a: 40, b: -10 }, blink: idleBlink(t, 2) });
  const me: Pose = at(1180, { yaw: -0.4, expr: t > 34 ? 'neutral' : 'happy', blink: idleBlink(t, 6), look: -0.8 });
  return (
    <g>
      <g transform={camT(kf(t, [[0, 820], [len, 700]]), 500, 1.15)}>
        <STREET t={t + 200} id="s7" />
        <Hero look={MO} pose={mo} />
        <Hero look={YOU} pose={me} />
        <Football x={bx} y={by} rot={t * 14} r={26} />
      </g>
      <DayTag t={t} text="THURSDAY" />
    </g>
  );
};

// ---------- S8: you throw your schoolbag up at the roof ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const wind = clamp(t / 8), rel = clamp((t - 8) / 4);
  const me: Pose = at(820, { yaw: -0.5, expr: 'smug', armR: { a: lerp(lerp(30, -40, wind), 160, rel), b: -20 }, tilt: lerp(0, -8, rel), blink: idleBlink(t, 3) });
  const k = clamp((t - 11) / 14);
  return (
    <g transform={camT(700, 520, kf(t, [[0, 1.3], [len, 1.2]]))}>
      <STREET t={t + 240} id="s8" />
      <Football x={300} y={ROOF_Y - 20} r={26} />
      <Hero look={YOU} pose={me} />
      {t < 11 ? <SchoolBag x={me.x + 60} y={me.y + 40} s={0.4} /> : <SchoolBag x={lerp(880, 320, k)} y={lerp(HIP, ROOF_Y - 30, k) - Math.sin(k * Math.PI) * 200} s={0.4} rot={t * 20} />}
    </g>
  );
};

// ---------- S9: the bag punches through the roof; Mo's face ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const hit = clamp(t / 3);
  const mo: Pose = at(760, { yaw: -0.5, expr: 'shock', armL: { a: 150, b: 30 }, armR: { a: 150, b: 30 }, blink: 0, look: -0.9 });
  return (
    <g transform={camT(kf(t, [[0, 420], [len, 520]]), 420, 1.7)}>
      <STREET t={t + 280} id="s9" />
      <ellipse cx={300} cy={ROOF_Y + 10} rx={60 * hit} ry={20 * hit} fill="#100E16" />
      <Cracks x={300} y={ROOF_Y + 10} s={1.2} p={hit} seed={9} />
      {Array.from({ length: 10 }, (_, i) => {
        const d = clamp(t / 20);
        return <rect key={i} x={300 + Math.cos(i * 1.7) * 160 * d} y={ROOF_Y - Math.sin(i * 2.1) * 140 * d + d * d * 260} width={22} height={12} fill="#3A2A2A" transform={`rotate(${i * 40 + t * 10})`} />;
      })}
      <Hero look={MO} pose={mo} />
    </g>
  );
};

// ---------- S10: Saturday: the ball rolls under Dad's car (low, by the wheels) ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 30));
  return (
    <g>
      <g transform={camT(960, 760, kf(t, [[0, 2.2], [len, 2.3]]))}>
        <STREET t={t + 320} id="s10" />
        <Football x={lerp(1300, 980, k)} y={STREETM.feet + 16} rot={-t * 12 * (1 - k)} r={26} />
        <ModernCar x={900} y={STREETM.feet + 40} s={1} color="#3A6AB8" />
      </g>
      <DayTag t={t} text="SATURDAY" />
    </g>
  );
};

// ---------- S11: so you lift the car, with one hand ----------
export const S11 = liftShot({
  Set: STREET, setT: 360, x: 960, y: HIP, yaw: 0.1, faces: [[0, 'neutral'], [20, 'smug']],
  lift: (t) => easeOut(clamp((t - 6) / 22)),
  thing: (h, t) => {
    const p = easeOut(clamp((t - 6) / 22));
    return <g transform={`rotate(${lerp(0, -6, p)} ${h.x} ${h.y})`}><ModernCar x={h.x + 20} y={lerp(STREETM.feet + 40, h.y + 10, p)} s={1} color="#3A6AB8" /></g>;
  },
  behind: false,
  cam: [960, 420, 0.95, 960, 380, 1.05],
  others: (t) => <Football x={1150} y={STREETM.feet + 16} r={26} />,
});

// ---------- S12: Dad in the doorway, the coffee mug falling ----------
export const S12: React.FC<ShotProps> = ({ t, len, f }) => {
  const face = faceAt(t, [[0, 'neutral'], [4, 'shock']]);
  const dad: Pose = { ...basePose, x: 960, y: 700, yaw: -0.2, look: 0.4, ...face, blink: face.blink, armR: { a: lerp(60, 40, clamp(t / 6)), b: -70 } };
  const fall = clamp((t - 6) / 14);
  return (
    <g>
      <Soft blur={16} dim={0.15}><g transform={camT(960, 520, 1.6)}><STREET t={t + 400} id="s12" /></g></Soft>
      <g transform={camT(960, 540, kf(t, [[0, 3.0], [len, 3.2]]))}>
        <Hero look={DAD} pose={dad} shadow={0} />
        <g transform={`translate(${1020 + fall * 20} ${700 + fall * fall * 420}) rotate(${fall * 160})`}><Mug x={0} y={0} rot={0} steam={1 - fall} f={f} /></g>
      </g>
    </g>
  );
};

// ---------- S13: Day ten: Mo comes in for a high five ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeOut(clamp(t / 10));
  const mo: Pose = at(lerp(700, 840, up), { yaw: 0.5, expr: 'happy', armR: { a: lerp(30, 150, up), b: -10 }, blink: idleBlink(t, 2) });
  const me: Pose = at(1140, { yaw: -0.5, expr: t > 26 ? 'worried' : 'happy', armR: { a: lerp(30, 140, clamp((t - 8) / 10)), b: -10 }, blink: idleBlink(t, 4) });
  return (
    <g>
      <g transform={camT(980, 470, kf(t, [[0, 1.75], [len, 1.9]]))}>
        <STREET t={t + 440} id="s13" />
        <Hero look={MO} pose={mo} />
        <Hero look={YOU} pose={me} />
      </g>
      <DayTag t={t} text="DAY 10" sub="51 T" />
    </g>
  );
};

// ---------- S14: insert: two hands an inch apart, yours trembling, glowing ----------
export const S14 = propCU({ Bg: STREET, push: 0.1, draw: (t) => {
  const shake = Math.sin(t * 2.2) * 3;
  return (
    <g>
      <BigHand x={820} y={560} s={1.1} rot={-4} sleeve="#4E7A4A" />
      <Glow x={1090} y={540} r={200} kind="warm" o={0.6 + Math.sin(t / 3) * 0.1} />
      <BigHand x={1100 + shake} y={540} s={1.1} rot={4} flip />
    </g>
  );
} });

// ---------- S15: you, close: you know what would happen ----------
const imagine = (t: number) => clamp((t - 18) / 6);
export const S15 = faceCU({
  look: YOU, Bg: STREET, faces: [[0, 'worried'], [30, 'oops']], yaw: -0.3, zoom: [3.2, 3.5], glint: 0.6,
  front: (t) => (
    <g opacity={imagine(t) * 0.9}>
      {/* the thought: Mo flying off into a hedge, in a bubble */}
      <ellipse cx={1500} cy={300} rx={330} ry={210} fill="#F6EFE3" stroke="#100E16" strokeWidth={8} />
      <circle cx={1180} cy={520} r={26} fill="#F6EFE3" stroke="#100E16" strokeWidth={6} />
      <circle cx={1130} cy={590} r={16} fill="#F6EFE3" stroke="#100E16" strokeWidth={6} />
      <g transform={`translate(${1380 + clamp((t - 20) / 14) * 240} ${330 - Math.sin(clamp((t - 20) / 14) * Math.PI) * 90}) scale(0.35) rotate(${t * 20})`}>
        <Hero look={MO} pose={{ ...basePose, x: 0, y: 0, expr: 'dizzy', armL: { a: 150, b: 20 }, armR: { a: 150, b: 20 } }} shadow={0} />
      </g>
      <ellipse cx={1680} cy={410} rx={110} ry={60} fill="#3E7A3E" />
    </g>
  ),
});

// ---------- S16: the alarm clock: 06:00 ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const ring = Math.sin(t * 2.4) * (t % 20 < 12 ? 6 : 0);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.08]]))}>
      <Soft blur={16} dim={0.4}><g transform={camT(960, 520, 1.4)}><BED t={t + 500} id="s16" /></g></Soft>
      <g transform={`translate(${960 + ring} 640) rotate(${ring * 0.6})`}>
        <AlarmClock x={0} y={0} s={3.2} text="06:00" />
      </g>
    </g>
  );
};

// ---------- S17: x2 ----------
export const S17 = bigWord({ word: 'x2', color: POWER, size: 320, sub: 'YOUR STRENGTH, EVERY MORNING AT SIX' });

// ---------- S18: it never stops: the ladder ----------
export const S18 = ladderCard({ days: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], step: 4, title: 'IT NEVER STOPS', hot: 10 });

// ---------- S19: you in the street, looking at your hands; the question ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const face = faceAt(t, [[0, 'neutral'], [40, 'worried']]);
  const me: Pose = at(960, { yaw: 0, ...face, blink: Math.max(face.blink, idleBlink(t, 3)), look: 0, headTilt: 8, armR: { a: 50, b: -80 }, armL: { a: 50, b: -80 }, glint: 0.8, glintColor: POWER });
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 440]]), kf(t, [[0, 1.0], [len, 1.9]]))}>
      <STREET t={t + 560} id="s19" />
      <Glow x={960} y={HIP - 40} r={160} kind="warm" o={0.5} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};
