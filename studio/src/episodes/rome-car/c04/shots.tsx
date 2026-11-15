import React from 'react';
import { Hero, Pose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, factCard, FONT, walkPose, SchLabel, SCH, DrawOn, FloatLabel, Toast, LEG_LEN } from '../../../engine';
import { YOU, MO, SOLDIER, EMPEROR, faceCU, bigWord, wordF, iconBoard, SchematicBg, carShot, onGround, romeCard, insert, CarHeads, DarkBg } from '../common';
import { Country, Forum, Palace, GROUND, Car, Amphora, Caliga, Hobnail, Horse, Spear } from '../sets';
import words from './words.json';

// Chapter 4, the catch: half the fuel gone in five days; no refinery, no distilled alcohol for a thousand years;
// Mo's olive oil (a diesel would have run on peanut oil in 1900; this isn't a diesel), the engine coughs, a night
// draining the tank; Roman hobnails and the flat tyre, the spare used, no rubber in Europe; but even dying, the car
// covers in an hour what Rome's fastest messengers cover in a day. Somebody important is thinking the same thing.

const W = words as { w: string; s: number; e: number }[];
const rel = (a: string, b: string) => wordF(W, b) - wordF(W, a);
const DUSK: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Country t={t} id={id} mode="dusk" stone />;
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Country t={t} id={id} mode="day" stone />;
const NIGHTC: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Country t={t} id={id} mode="night" stone />;
const sitOn = (x: number, y: number, s: number, o: Partial<Pose> = {}): Pose => ({ ...onGround(x, s), y, legL: { a: 80, b: -80 }, legR: { a: 75, b: -70 }, ...o });

// ---------- S1: card: THE CATCH ----------
export const S1 = romeCard({ kicker: 'DAY 5', title: 'THE CATCH', Bg: DUSK });

// ---------- S2: you by the car, worried; Mo sitting on the bonnet with the chips ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 990]]), 600, kf(t, [[0, 1.45], [len, 1.55]]))}>
    <DUSK t={t + 40} />
    <Car x={900} y={GROUND} s={0.85} t={t} id="c4s2" dirt={0.4} />
    <Hero look={MO} pose={sitOn(1180, GROUND - 160 - 112 * 0.8, 0.8, { yaw: -0.3, expr: 'happy', armR: { a: 60 + Math.abs(Math.sin(t / 6)) * 50, b: -120 }, blink: idleBlink(t, 4) })} />
    <Hero look={YOU} pose={onGround(1460, 0.95, { yaw: -0.5, look: -0.7, expr: 'worried', armL: { a: 20, b: -100 }, blink: idleBlink(t, 2) })} />
  </g>
);

// ---------- S3: crude oil -> refinery -> gasoline; Rome has nothing close ----------
export const S3 = iconBoard({
  title: 'HOW YOU GET GASOLINE',
  items: [
    { name: 'oil', label: 'CRUDE OIL', at: rel('Gasoline', 'crude') },
    { name: 'refinery', label: 'REFINERY', at: rel('Gasoline', 'refineries'), cross: rel('Gasoline', 'nothing') + 4 },
    { name: 'fuel', label: 'GASOLINE', at: rel('Gasoline', 'refineries') + 6, live: 0, cross: rel('Gasoline', 'close') + 4 },
  ],
});

// ---------- S4: distilled alcohol: crossed ----------
export const S4 = iconBoard({
  title: 'PLAN B: ALCOHOL',
  items: [
    { name: 'still', label: 'DISTILLING', at: 0, live: 0, cross: rel('Even', 'distilled') + 6 },
  ],
});

// ---------- S5: about a thousand years until Europe distils alcohol ----------
export const S5 = factCard({ value: 1000, suffix: ' YEARS', label: 'UNTIL EUROPE LEARNS TO DISTIL ALCOHOL', sub: 'School of Salerno, 12th century (Forbes 1948)', format: (v) => `~${Math.round(v)}` });

// ---------- S6: Mo has an idea ----------
export const S6 = faceCU({
  look: MO, Bg: DUSK, faces: [[0, 'neutral'], [8, 'smug']], yaw: -0.3, zoom: [3.2, 3.4], glint: 0.8, glintColor: '#FFE27A',
  pose: { armR: { a: 160, b: 10 }, handR: 'point' },
  extra: (t) => <g opacity={clamp((t - 8) / 4)}><Glow x={1010} y={320} r={120} o={0.9} /><circle cx={1010} cy={330} r={30} fill="#FFF2B0" stroke="#100E16" strokeWidth={4} /></g>,
});

// ---------- S7: olive oil everywhere; Mo hugging an amphora ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 980]]), 620, kf(t, [[0, 1.25], [len, 1.35]]))}>
    <Forum t={t + 60} />
    {Array.from({ length: 22 }).map((_, i) => (
      <Amphora key={i} x={300 + (i % 11) * 130 + (i > 10 ? 60 : 0)} y={GROUND + (i > 10 ? 70 : 0)} s={0.55 + (i > 10 ? 0.1 : 0)} rot={Math.sin(i) * 6} />
    ))}
    <Hero look={MO} pose={onGround(1100, 0.9, { y: GROUND + 120 - LEG_LEN * 0.9, yaw: 0.2, expr: 'happy', armL: { a: 40, b: -110 }, armR: { a: 40, b: -110 }, blink: idleBlink(t, 4) })} />
    <Amphora x={1100} y={GROUND + 60} s={0.8} />
  </g>
);

// ---------- S8: 1900, Paris: a diesel engine ran on peanut oil ----------
export const S8 = factCard({ value: 1900, label: "PARIS WORLD'S FAIR", sub: 'a diesel engine ran on peanut oil', format: (v) => `${Math.round(v)}` });

// ---------- S9: but this isn't a diesel ----------
export const S9 = bigWord({ kicker: 'YOUR CAR RUNS ON GASOLINE', word: 'NOT A DIESEL', color: '#FF4A3A', size: 170, Bg: DUSK });

// ---------- S10: Mo pours a cup of olive oil into the filler ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const pour = clamp((t - 6) / 10);
  return (
    <g transform={camT(560, 560, kf(t, [[0, 2.4], [len, 2.6]]))}>
      <DUSK t={t + 100} />
      <Car x={900} y={GROUND} s={0.9} t={t} id="c4s10" />
      <rect x={470} y={GROUND - 190} width={40} height={34} rx={6} fill="#1A1A22" stroke="#100E16" strokeWidth={4} />
      <Hero look={MO} pose={onGround(360, 0.9, { yaw: 0.5, expr: 'smug', armR: { a: 90 + pour * 20, b: -30 }, armL: { a: 70, b: -50 }, blink: idleBlink(t, 4) })} />
      <g transform={`translate(450 ${GROUND - 300}) rotate(${-pour * 100})`}>
        <path d="M -20 0 L -16 50 L 16 50 L 20 0 Z" fill="#C89A6A" stroke="#100E16" strokeWidth={4} />
      </g>
      {pour > 0.5 ? <path d={`M 466 ${GROUND - 300} Q 480 ${GROUND - 240} 490 ${GROUND - 186}`} stroke="#C8B23A" strokeWidth={8} fill="none" opacity={0.9} /> : null}
    </g>
  );
};

// ---------- S11: the engine coughs: black smoke, shuddering, you and Mo jump ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const cough = Math.max(0, Math.sin(t / 3)) ** 3;
  return (
    <g transform={camT(960 + cough * 6, 600, kf(t, [[0, 1.35], [len, 1.45]]))}>
      <DUSK t={t + 140} />
      {Array.from({ length: 8 }).map((_, k) => {
        const p = ((t / 30 + k / 8) % 1);
        return <circle key={k} cx={480 - p * 300} cy={GROUND - 60 - p * 260} r={30 + p * 110} fill="#1A1820" opacity={0.75 * (1 - p)} />;
      })}
      <Car x={960} y={GROUND} s={0.9} t={t} bounce={cough * 18} id="c4s11" />
      <Hero look={YOU} pose={onGround(1520, 0.9, { yaw: -0.4, expr: 'shock', squash: -cough * 0.1, armL: { a: 100, b: 0 }, armR: { a: 100, b: 0 }, blink: 0 })} />
      <Hero look={MO} pose={onGround(1700, 0.9, { yaw: -0.4, expr: 'oops', armR: { a: 150, b: 40 }, blink: 0 })} />
      <FloatLabel x={400} y={420} t={t - 4} text="COUGH!" color="#F6EFE3" size={80} />
    </g>
  );
};

// ---------- S12: night: you under the car with a bowl, draining it by hand; Mo asleep against a wheel ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 640, kf(t, [[0, 1.5], [len, 1.6]]))}>
    <NIGHTC t={t + 30} />
    <Glow x={760} y={GROUND - 40} r={260} o={0.6} />
    <Car x={960} y={GROUND} s={0.9} t={t} id="c4s12" />
    <Hero look={YOU} pose={{ ...onGround(640, 0.85), y: GROUND - 40, spin: -84, yaw: 0, expr: 'tired', armR: { a: 170, b: 20 }, blink: idleBlink(t, 2) }} />
    <ellipse cx={720} cy={GROUND - 6} rx={60} ry={16} fill="#B0603A" stroke="#100E16" strokeWidth={4} />
    {[0, 1].map((k) => {
      const p = ((t / 20 + k / 2) % 1);
      return <circle key={k} cx={724} cy={GROUND - 70 + p * 54} r={6} fill="#C8B23A" opacity={1 - p * 0.5} />;
    })}
    <Hero look={MO} pose={sitOn(1450, GROUND - LEG_LEN * 0.85 * 0.3, 0.85, { yaw: -0.2, expr: 'tired', blink: 1, headTilt: 18 })} />
    <text x={1520} y={560 - ((t * 0.6) % 40)} fontFamily={FONT.hand} fontSize={50} fill="#F6EFE3" opacity={0.7}>z z z</text>
  </g>
);

// ---------- S13: a Roman sandal sole, studded with iron nails ----------
export const S13 = insert({ draw: (t) => <Caliga x={960} y={560} s={1.6} rot={-10 + Math.sin(t / 20) * 3} />, zoom: [1, 1.08] });

// ---------- S14: a trail of lost hobnails marking an army's march ----------
const TRAIL = 'M 200 820 Q 500 700 700 760 Q 950 830 1150 600 Q 1350 380 1720 300';
export const S14: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SchematicBg t={t} />
    <DrawOn d={TRAIL} t={t - 2} dur={60} color={SCH.dim} width={4} />
    {Array.from({ length: 30 }).map((_, i) => {
      const k = i / 30;
      const x = 200 + k * 1520 + Math.sin(i * 1.7) * 18;
      const y = 820 - k * 520 + Math.sin(k * 6) * 90 + Math.cos(i * 2.3) * 14;
      return t > 4 + i * 2 ? <circle key={i} cx={x} cy={y} r={7} fill={SCH.live} /> : null;
    })}
    <SchLabel x={960} y={170} t={t - 2} text="LOST HOBNAILS = WHERE THE ARMY MARCHED" size={42} color={SCH.dim} />
    <g opacity={clamp((t - 70) / 6)} transform={`translate(960 940) scale(${backOut(clamp((t - 70) / 9))})`}>
      <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#1A1A2A" stroke={SCH.live} strokeWidth={3} />
      <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
    </g>
  </g>
);

// ---------- S15: a nail in the front tyre, hissing ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1260, 760, kf(t, [[0, 3.2], [len, 3.5]]))}>
    <DAY t={t + 60} />
    <Car x={960} y={GROUND} s={1} t={t} flat={clamp(t / 40)} id="c4s15" />
    <Hobnail x={1300} y={GROUND - 70} s={0.4} rot={-30} />
    {[0, 1, 2].map((k) => {
      const p = ((t / 10 + k / 3) % 1);
      return <path key={k} d={`M ${1320 + p * 50} ${GROUND - 90 - p * 30} l 20 -4`} stroke="#F6EFE3" strokeWidth={4} opacity={1 - p} />;
    })}
    <FloatLabel x={1380} y={GROUND - 140} t={t - 2} text="ssss..." color="#F6EFE3" size={30} />
  </g>
);

// ---------- S16: you change to the spare, sweating; then no spare left ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1120], [len, 1160]]), 640, kf(t, [[0, 1.6], [len, 1.7]]))}>
    <DAY t={t + 100} />
    <Car x={960} y={GROUND - 20} s={0.9} t={t} id="c4s16" />
    <rect x={1180} y={GROUND - 40} width={40} height={40} fill="#5A5A64" stroke="#100E16" strokeWidth={4} />
    <Hero look={YOU} pose={onGround(1440, 0.9, { y: GROUND - LEG_LEN * 0.9 + 50, yaw: -0.5, expr: 'tired', legL: { a: 70, b: -100 }, legR: { a: 10, b: -80 }, armR: { a: 60 + Math.sin(t / 3) * 20, b: -40 }, armL: { a: 50 + Math.cos(t / 3) * 20, b: -40 }, blink: idleBlink(t, 2) })} />
    <path d="M 1430 380 q 6 12 0 18 q -6 -6 0 -18" fill="#A9D4F0" opacity={0.5 + 0.5 * Math.sin(t / 5)} />
    <Toast x={1400} y={300} t={t - rel('put', 'Now') } text="SPARE: 0" hold={80} color="#FF4A3A" />
  </g>
);

// ---------- S17: rubber grows in South America; nobody in Rome knows it exists ----------
export const S17 = iconBoard({
  title: 'A NEW TYRE?',
  items: [
    { name: 'tire', label: 'RUBBER', at: 0, cross: rel('rubber', 'exist') + 4 },
    { name: 'globe', label: 'SOUTH AMERICA', at: rel('rubber', 'South') },
  ],
});

// ---------- S18: the dirty car at dusk, you leaning on it: dying, slowly ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 980], [len, 940]]), 620, kf(t, [[0, 1.35], [len, 1.5]]))}>
    <DUSK t={t + 180} />
    <Car x={960} y={GROUND} s={0.9} t={t} dirt={1} id="c4s18" />
    <Hero look={YOU} pose={onGround(1460, 0.9, { yaw: -0.6, tilt: -10, expr: 'tired', armL: { a: 50, b: 0 }, blink: idleBlink(t, 2) })} />
  </g>
);

// ---------- S19: a messenger galloping past a road station ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, -200], [len, 1900]], (p) => p);
  const s = 0.75;
  const ph = t * 0.6;
  return (
    <g transform={camT(960, 600, 1.1)}>
      <DAY t={t + 220} />
      {/* the road station: a small house with a red roof and a post */}
      <rect x={1300} y={GROUND - 260} width={300} height={220} fill="#E2D2B2" stroke="#100E16" strokeWidth={4} />
      <path d="M 1280 610 L 1450 520 L 1620 610 Z" fill="#B8503A" stroke="#100E16" strokeWidth={4} />
      <rect x={1420} y={GROUND - 150} width={60} height={110} fill="#5A3A22" />
      <Horse x={1700} y={GROUND} s={0.6} color="#6A4A32" t={t} />
      <Horse x={x} y={GROUND + 30} s={s} run={ph} color="#4A3022" t={t} />
      <Hero look={SOLDIER} pose={{ ...onGround(x + 20, 0.75), y: GROUND + 30 - 330 * s - LEG_LEN * 0.3 - Math.abs(Math.sin(ph)) * 14 * s, yaw: 0.8, tilt: 14, legL: { a: 50, b: 40 }, legR: { a: 50, b: 40 }, armR: { a: 70, b: -50 }, expr: 'neutral' }} />
    </g>
  );
};

// ---------- S20: 80 km a day ----------
export const S20 = factCard({ value: 80, suffix: ' KM', label: "A DAY: ROME'S FASTEST MESSENGERS", sub: 'cursus publicus (Casson, Travel in the Ancient World)' });

// ---------- S21: the car blasting down the Roman road: under an hour ----------
export const S21 = carShot({
  Bg: (t, sc) => <Country t={t + 260} mode="day" stone scroll={sc} />,
  scroll: 40,
  car: { x: [900, 1000], s: 0.7, dust: 1, ease: 'lin' },
  cam: { from: [960, 620, 1.15] },
  front: (t) => <FloatLabel x={1300} y={340} t={t - 10} text="80 KM < 1 HOUR" color="#FFD23A" size={70} />,
  shakeAmp: 2,
});

// ---------- S22: the empire map: a message from the edge in 1 day instead of 7 ----------
const SEA = 'M 300 520 Q 420 430 600 470 Q 760 400 900 480 Q 1040 420 1180 470 Q 1320 430 1460 500 Q 1560 560 1600 640 Q 1480 690 1320 650 Q 1160 700 1000 660 Q 860 720 700 650 Q 540 700 420 640 Q 320 610 300 520 Z';
const EMPIRE = 'M 160 380 Q 400 250 700 300 Q 1000 230 1300 300 Q 1560 330 1720 520 Q 1780 700 1680 820 Q 1500 860 1300 800 Q 1000 860 700 820 Q 400 840 220 740 Q 120 600 160 380 Z';
export const S22: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SchematicBg t={t} />
    <path d={EMPIRE} fill="none" stroke={SCH.dim} strokeWidth={5} />
    <path d={SEA} fill="none" stroke={SCH.grid} strokeWidth={5} />
    <circle cx={860} cy={500} r={14} fill={SCH.live} />
    <DrawOn d="M 1620 420 Q 1240 300 870 490" t={t - 4} dur={24} color={SCH.live} width={8} />
    <SchLabel x={1620} y={390} t={t - 2} text="THE FRONTIER" size={32} />
    <SchLabel x={960} y={900} t={t - rel('message', 'day')} text="1 DAY" size={80} color={SCH.live} />
    <SchLabel x={1320} y={900} t={t - rel('message', 'week')} text="not 7" size={50} color={SCH.dim} />
  </g>
);

// ---------- S23: an army that never gets tired: the car leading an endless legion ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1100]]), 600, 1.0)}>
    <Country t={t + 300} mode="dusk" stone />
    {Array.from({ length: 14 }).map((_, i) => {
      const x = 1250 - i * 110 + t * 1.2;
      return (
        <g key={i}>
          <Spear x={x + 26} y={GROUND - 10 - (i % 2) * 20} len={300} rot={0} />
          <Hero look={SOLDIER} pose={walkPose(x, t * 0.5 + i, GROUND - (i % 2) * 20, 0.6, { expr: 'neutral' }, 1)} />
        </g>
      );
    })}
    <Car x={1650 + t * 1.2} y={GROUND + 40} s={0.6} t={t} spin={t * 6} lights={1} id="c4s23" />
  </g>
);

// ---------- S24: night, the palace: a figure at a window, watching; somebody very important ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 1040]]), 560, kf(t, [[0, 1.2], [len, 1.6]]))}>
    <Palace t={t} mode="night" />
    <Glow x={1040} y={560} r={260} o={0.7} />
    <Hero look={EMPEROR} pose={onGround(1040, 0.95, { y: 860 - LEG_LEN * 0.95, yaw: 0.9, look: 1, expr: 'neutral', armL: { a: 20, b: -100 }, armR: { a: 20, b: -100 }, blink: idleBlink(t, 7) })} rimId="rimBlue" />
    <rect x={-600} y={-500} width={3100} height={2100} fill="#04040E" opacity={0.25} />
  </g>
);
