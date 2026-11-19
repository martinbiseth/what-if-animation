import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, ShotProps, faceAt, idleBlink, Suburb, SUBURB, suburbHip, FONT, MONEY, shake, Glow, lerp } from '../../../engine';
import words from './words.json';
import timeline from './timeline.json';
import { Garage, Hill, hillY, Skateboard, Ramp, Trampoline, Greenhouse, Splash, Ambulance } from '../kit';
import { GameScreen, Controller, Bike } from '../borrowed';
import {
  YOU, MO, respawn, billPhone, billCU, faceCU, talkShot, bigWord, people, tumble, HospSet, StreetSet, cueIn, Soft, HHIP,
} from '../common';

// Chapter 1, the cold open: four quick demos of living like a video game. The garage roof, the hill on Mo's
// skateboard, the bike and the river, the trampoline and the greenhouse; each one: grey, the hospital doors, a buzz,
// a bill. Then the game on the TV, where it costs a few hundred bucks, and the question. 24+ cuts a minute.

const W = words as { w: string; s: number; e: number; p: string }[];
const TL = timeline as { segments: { shot: string; a: number; t0: number }[] };
const cue = (shot: string, w: string, nth = 1, d = 10) => cueIn(TL, W, shot, w, nth, d);
const DAY = StreetSet('day');
const HOSP = HospSet();

// The back garden: the street behind, the garage in front. Garage roof at y 460.
const ROOF_Y = SUBURB.feet - 340;
const Yard: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Suburb t={t} id="yd" tod="day" cars={false} />
    <rect x={-400} y={SUBURB.feet - 10} width={2800} height={600} fill="#6A9A5A" />
    <Garage x={1100} y={SUBURB.feet} />
  </g>
);

// ---------- S1: you on the garage roof, a crouch, the jump ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const j = clamp((t - 14) / 18);
  const crouch = t < 14 ? clamp(t / 10) : 1 - j;
  const x = lerp(1060, 1460, j);
  const y = ROOF_Y - 140 + crouch * 30 - Math.sin(j * Math.PI) * 120 + j * j * 300;
  const me: Pose = {
    ...basePose, x, y, yaw: 0.6, expr: j > 0 ? 'happy' : 'cool', squash: crouch * 0.2, tilt: j * 20,
    armL: { a: 20 + j * 130, b: -20 }, armR: { a: 20 + j * 140, b: -20 }, legL: { a: 10 + j * 30, b: -crouch * 50 }, legR: { a: -10, b: -crouch * 50 - j * 40 },
  };
  return (
    <g transform={camT(1200, 480, kf(t, [[0, 1.35], [len, 1.2]]))}>
      <Yard t={t} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S2: you land wrong: one leg folds, the camera jolts ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 6);
  const sh = shake(t, 5, 10, 22);
  const me: Pose = {
    ...basePose, x: 1500, y: suburbHip(1) + 10 + k * 40, yaw: 0.4, expr: t < 6 ? 'happy' : 'shock', squash: k > 0.9 ? 0.3 : 0, tilt: k * -35,
    armL: { a: 120, b: -40 }, armR: { a: 150, b: -20 }, legL: { a: 50, b: -100 * k }, legR: { a: -30, b: 40 * k },
  };
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(1450, 560, kf(t, [[0, 1.8], [len, 1.95]]))}`}>
      <Yard t={t + 40} />
      <Hero look={YOU} pose={me} />
      {t > 5 && t < 14 ? <path d="M 1380 800 l -40 -30 M 1620 800 l 40 -30 M 1500 790 l 0 -50" stroke="#F6EFE3" strokeWidth={8} strokeLinecap="round" opacity={1 - (t - 5) / 9} /> : null}
    </g>
  );
};

// ---------- S3: grey: you on the lawn, still ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1500, 700, kf(t, [[0, 2.0], [len, 2.25]]))}>
    <Yard t={t + 60} />
    <Hero look={YOU} pose={tumble(1500, SUBURB.feet - 40, 90, { expr: 'dizzy', blink: 1 })} />
  </g>
);

// ---------- S4: the respawn: the hospital doors, you appear, look down at yourself ----------
export const S4 = respawn({ appear: 3, faces: [[0, 'shock'], [20, 'oops']] });

// ---------- S5: not a scratch on you ----------
export const S5 = faceCU({ look: YOU, Bg: HOSP, faces: [[0, 'shock'], [14, 'happy']], yaw: 0.2, zoom: [3.0, 3.2], pose: { headTilt: -10, look: 0.2 } });

// ---------- S6: the phone buzzes: the first bill ----------
export const S6 = billPhone({ v: 6411, time: '9:14' });

// ---------- S7: the itemised bill, line by line ----------
export const S7 = billCU({
  lines: [
    { label: 'Ambulance', v: 1200, at: 2 },
    { label: 'Emergency room', v: 2909, at: cue('S7', 'Emergency', 1, 30) },
    { label: 'X-ray, cast, crutches', v: 2302, at: cue('S7', 'X', 1, 60) },
  ],
});

// ---------- S8: the total ----------
export const S8 = billCU({
  lines: [
    { label: 'Ambulance', v: 1200, at: -1 },
    { label: 'Emergency room', v: 2909, at: -1 },
    { label: 'X-ray, cast, crutches', v: 2302, at: -1 },
  ],
  total: 6411, totalAt: 4, s: 1.35, y: 470,
});

// ---------- S9: Mo hands you his skateboard ----------
export const S9 = talkShot({
  Set: DAY, words: W,
  cast: [
    { look: MO, x: 760, y: suburbHip(1), yaw: 0.5, faces: [[0, 'smug']], pose: { armR: { a: 70, b: -40 } } },
    { look: YOU, x: 1160, y: suburbHip(1), yaw: -0.5, faces: [[0, 'happy']] },
  ],
  cam: { from: [960, 560, 1.6], to: [960, 560, 1.72] },
  front: (t) => <Skateboard x={lerp(880, 1060, clamp(t / 20))} y={suburbHip(1) - 10} rot={-20} s={0.9} />,
});

// ---------- S10: the steepest hill in town: you fly down it ----------
const SLOPE = (Math.atan2(520, 2300) * 180) / Math.PI;
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 0], [len, 1500]], (k) => k * k);
  const g = hillY(x);
  const me: Pose = {
    ...basePose, x, y: g - 30 - 120, yaw: 0.7, tilt: SLOPE - 8, expr: t < len * 0.5 ? 'happy' : 'shock',
    armL: { a: 80, b: -10 }, armR: { a: 100, b: -20 }, legL: { a: 25, b: -30 }, legR: { a: -20, b: -30 },
  };
  return (
    <g transform={camT(x + 200, g - 120, 1.4)}>
      <Hill t={t} />
      <Skateboard x={x} y={g - 26} rot={SLOPE} spin={t * 40} />
      <Hero look={YOU} pose={me} />
      {[0, 1, 2].map((i) => <path key={i} d={`M ${x - 140 - i * 40} ${g - 160 + i * 40} l -120 -26`} stroke="#F6EFE3" strokeWidth={6} opacity={0.6} />)}
    </g>
  );
};

// ---------- S11: grey: the board stops, you don't ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 14);
  const x = 1500 + k * 300;
  return (
    <g transform={camT(1650, hillY(1650) - 150, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Hill t={t + 80} />
      <Skateboard x={1500 + k * 60} y={hillY(1500) - 26} rot={SLOPE + k * 60} />
      <Hero look={YOU} pose={tumble(x, hillY(x) - 100 - Math.sin(k * Math.PI) * 140, k * 320)} />
    </g>
  );
};

// ---------- S12: the phone again: eleven thousand ----------
export const S12 = billPhone({ v: 11000, time: '9:31', from: 'left' });

// ---------- S13: your bike, a ramp of planks, the river ----------
const BANK_Y = 720;
const River: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1300} fill="#9CC4E8" />
    <path d="M -400 520 Q 400 470 1100 520 Q 1700 480 2400 530 L 2400 900 L -400 900 Z" fill="#6A9A6A" />
    <rect x={900} y={BANK_Y + 30} width={1600} height={600} fill="#7A6A4A" />
    {Array.from({ length: 10 }).map((_, i) => (
      <path key={i} d={`M ${950 + ((i * 190 + t * 2) % 1500)} ${BANK_Y + 80 + (i % 3) * 60} q 30 -10 60 0`} stroke="#A8987A" strokeWidth={5} fill="none" />
    ))}
    <path d={`M -400 ${BANK_Y} L 960 ${BANK_Y} Q 990 ${BANK_Y + 30} 980 ${BANK_Y + 200} L -400 ${BANK_Y + 200} Z`} fill="#5A8A44" />
    <path d="M 1900 760 Q 2100 700 2400 720 L 2400 900 L 1900 900 Z" fill="#5A8A44" />
  </g>
);
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 200], [len, 560]]);
  return (
    <g transform={camT(800, 560, kf(t, [[0, 1.15], [len, 1.25]]))}>
      <River t={t} />
      <Ramp x={620} y={BANK_Y} s={1} />
      <Bike x={x} y={BANK_Y} s={0.9} spin={t * 20} />
      <Hero look={YOU} pose={{ ...basePose, x: x - 30, y: BANK_Y - 170, yaw: 0.8, tilt: 25, expr: 'cool', armL: { a: 80, b: -20 }, armR: { a: 85, b: -20 }, legL: { a: 60, b: -80 }, legR: { a: 20, b: -70 } }} />
    </g>
  );
};

// ---------- S14: you don't make it ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(len, 1));
  const x = lerp(980, 1500, k);
  const y = BANK_Y - 340 - Math.sin(Math.min(1, k * 1.4) * Math.PI) * 160 + Math.max(0, k - 0.6) * 900;
  return (
    <g transform={camT(1200, 600, 1.15)}>
      <River t={t + 30} />
      <Ramp x={620} y={BANK_Y} s={1} />
      <Bike x={x + 30} y={y + 175 + k * 60} s={0.9} spin={t * 30} />
      <Hero look={YOU} pose={{ ...tumble(x, y, k * 60), expr: k < 0.4 ? 'happy' : 'shock' }} />
    </g>
  );
};

// ---------- S15: grey: the splash ----------
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(1400, 700, 1.4)}>
    <River t={t + 60} />
    <Splash x={1400} y={BANK_Y + 120} p={clamp(t / 24)} s={1.2} />
  </g>
);

// ---------- S16: the doors again, dripping wet ----------
export const S16 = respawn({
  appear: 2, faces: [[0, 'oops'], [16, 'tired']],
  front: (t) => (
    <g>
      {Array.from({ length: 8 }).map((_, i) => {
        const k = ((t * 1.2 + i * 9) % 30) / 30;
        return <ellipse key={i} cx={1380 + i * 16} cy={HHIP - 120 + k * 260} rx={5} ry={9} fill="#9CD4F0" opacity={t > 6 ? 1 - k : 0} />;
      })}
    </g>
  ),
});

// ---------- S17: buzz: thirty-four thousand ----------
export const S17 = billPhone({ v: 34000, time: '9:58' });

// ---------- S18: Mo's trampoline, the neighbour's greenhouse ----------
const Garden: React.FC<{ t: number; smash?: number }> = ({ t, smash = 0 }) => (
  <g>
    <Suburb t={t} id="gd" tod="day" cars={false} />
    <rect x={-400} y={SUBURB.feet - 10} width={2800} height={600} fill="#6A9A5A" />
    <rect x={1180} y={SUBURB.feet - 150} width={20} height={160} fill="#8A6A4A" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={1180 + i * 0} y={SUBURB.feet - 150 + i * 13} width={1300} height={6} fill="#A8805A" opacity={0} />)}
    <rect x={1190} y={SUBURB.feet - 120} width={1300} height={120} fill="#B8905E" stroke="#6A4A2A" strokeWidth={4} />
    <Trampoline x={800} y={SUBURB.feet + 60} s={1} dip={0} />
    <Greenhouse x={1560} y={SUBURB.feet + 40} s={1} smash={smash} />
  </g>
);
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const b = Math.abs(Math.sin(t / 9));
  const up = clamp((t - 20) / 20);
  const x = 800 + up * 500;
  const y = suburbHip(1) - 120 - b * 260 * (1 - up) - Math.sin(up * Math.PI) * 420;
  return (
    <g transform={camT(1050, 480, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <Garden t={t} />
      <Hero look={YOU} pose={{ ...basePose, x, y, yaw: 0.5, expr: 'happy', spin: up * 200, armL: { a: 160, b: -10 }, armR: { a: 150, b: -10 }, legL: { a: 10, b: -20 * b }, legR: { a: -10, b: -20 * b } }} />
      <Hero look={MO} pose={{ ...basePose, x: 420, y: suburbHip(1), yaw: 0.5, expr: 'happy', armR: { a: 150, b: -30 }, blink: idleBlink(t, 4) }} />
    </g>
  );
};

// ---------- S19: grey: the greenhouse ----------
export const S19: React.FC<ShotProps> = ({ t }) => {
  const sh = shake(t, 0, 10, 18);
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(1560, 600, 1.5)}`}>
      <Garden t={t + 50} smash={clamp(t / 20)} />
      <Hero look={YOU} pose={tumble(1560, SUBURB.feet - 120, 160)} />
    </g>
  );
};

// ---------- S20: the doors, with a bit of glass in your hair ----------
export const S20 = respawn({ appear: 2, faces: [[0, 'tired']], zoom: [1.75, 1.85] });

// ---------- S21: the bill, and a line for the greenhouse ----------
export const S21 = billCU({
  lines: [
    { label: 'Emergency care', v: 9000, at: 0 },
    { label: "Neighbour's greenhouse", v: 2400, at: cue('S21', 'greenhouse', 2, 30), hot: true },
  ],
  stamp: 'EXTRA', stampAt: cue('S21', 'extra', 1, 40) + 4,
});

// ---------- S22: in the games: the respawn is a few hundred bucks ----------
const LIVING_BG = '#1A1830';
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1], [len, 1.12]]);
  const fee = clamp((t - 30) / 8);
  return (
    <g>
      <rect width={1920} height={1080} fill={LIVING_BG} />
      <g transform={`translate(960 520) scale(${z}) translate(-960 -520)`}>
        <GameScreen x={360} y={180} w={1200} h={680} t={t} on={1} />
        {/* on the game's screen: a tiny hero standing at a pixel hospital, a small fee */}
        <rect x={1180} y={540} width={260} height={160} fill="#E8ECEE" opacity={fee} />
        <rect x={1250} y={510} width={120} height={36} fill="#D82E2E" opacity={fee} />
        <text x={1310} y={690} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={fee}>
          -$500
        </text>
      </g>
      <Controller x={960} y={1010} s={2.6} />
    </g>
  );
};

// ---------- S23: you walk out whistling (in the game): you, grinning, controller glow ----------
export const S23 = faceCU({ look: YOU, Bg: ({ t }) => <rect x={-400} y={-400} width={2800} height={1900} fill="#2A2A5A" />, faces: [[0, 'smug']], yaw: -0.2, zoom: [2.7, 2.85], glint: 0.6, glintColor: '#6AA8FF' });

// ---------- S24: dusk, the hospital, you with your phone: the question ----------
export const S24 = respawn({ tod: 'dusk', appear: -40, faces: [[0, 'worried']], zoom: [1.1, 1.22], lights: 1, phone: true });

// ---------- S25: the real bill? ----------
export const S25 = bigWord({ kicker: 'IN REAL LIFE', word: 'THE REAL BILL?', color: MONEY.red, Bg: HospSet({ tod: 'dusk', lights: 1 }), size: 170 });
