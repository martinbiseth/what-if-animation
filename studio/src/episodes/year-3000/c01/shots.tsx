import React from 'react';
import {
  PodRoom, FutureCity, Museum, Shop, ShopCounter, SleepPod, PhoneCase, GlassCase, Phone26, WaterCube, Vee, Citizen, Body, Big, PopWord, Soft, Glyphs,
  scene, veeCU, bigWord, podSit, standAt, headAt, handAt, YOU, KID, CLERK, F1, F2, F3, GROUND,
  camT, kf, clamp, backOut, easeOut, basePose, faceAt, idleBlink, FONT, Glow, Hero, shk, ShotProps, Pose, Word,
} from '../common';
import words from './words.json';

// Chapter 1, the cold open: you wake in a white room, a round robot says you've slept 974 years, the city outside
// (things fly without wings, towers above the clouds, no cars), a cube of water, your phone in a museum case, a kid
// who doesn't understand you, a shop that laughs at your wallet, and the question: how long would you last?

const W = words as Word[];
const POD_X = 960;
const POD_Y = GROUND;
const ROOM: React.FC<{ t: number; id?: string }> = ({ t, id }) => <PodRoom t={t} id={id} />;
const CITY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <FutureCity t={t} id={id} />;

// ---------------------------------------------------------------- S1: your eyes open (lying in the pod, face up)
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const open = clamp((t - 10) / 14);
  const blink = t < 10 ? 1 : 1 - open + (t > 34 && t < 38 ? 1 : 0);
  return (
    <g>
      <rect width={1920} height={1080} fill="#F2F6F8" />
      <Glow x={960} y={300} r={900} kind="cool" o={0.4} />
      <g transform={camT(960, 360, kf(t, [[0, 4.4], [len, 4.0]]))}>
        <Hero look={YOU} pose={{ ...basePose, x: 960, y: 560, yaw: 0, blink: clamp(blink), expr: t < 30 ? 'neutral' : 'worried', look: Math.sin(t / 8) * 0.6 }} shadow={0} />
      </g>
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={clamp(1 - t / 12) * 0.9} />
    </g>
  );
};

// ---------------------------------------------------------------- S2: everything is white; the room comes into focus
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len - 6));
  return (
    <g>
      <g transform={camT(960, 300, 1.4)}>
        <PodRoom t={t + 20} id="s2a" window={false} />
      </g>
      <g opacity={1 - k}>
        <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.85} />
      </g>
      <Glow x={960} y={200} r={700} kind="cool" o={0.5} />
    </g>
  );
};

// ---------------------------------------------------------------- S3: a little round robot floats over your face (POV)
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const y = kf(t, [[0, -300], [18, 560], [len, 540]], easeOut);
  return (
    <g>
      <g transform={camT(960, 300, 1.4)}>
        <PodRoom t={t + 30} id="s3" window={false} />
      </g>
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.25} />
      <Vee x={960} y={y} s={3.2} t={t} look={0} mood={t > 20 ? 'happy' : 'open'} />
    </g>
  );
};

export const S4 = veeCU({ Bg: ROOM, mood: 'happy', words: W, talk: ['Good', 'years'], zoom: [2.4, 2.7] });

export const S5 = bigWord({ kicker: 'YOU HAVE BEEN ASLEEP FOR', word: '974 YEARS', Bg: ROOM, size: 210, color: '#4AE8FF' });

// ---------------------------------------------------------------- S6: you sit up and laugh
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeOut(clamp(t / 10));
  const laugh = Math.sin(t / 2.5) * 4;
  const pose = podSit(POD_X - 120, POD_Y - 110 - up * 10 + laugh * 0.5, 1, { tilt: -30 + up * 30 + laugh, yaw: 0.4, armL: { a: 40, b: -60 }, armR: { a: 50, b: -90 } });
  return (
    <g transform={camT(POD_X + 40, 640, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <PodRoom t={t + 40} />
      <SleepPod x={POD_X} y={POD_Y} t={t} open={1} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'happy']]} />
      <Vee x={POD_X + 320} y={460} s={0.7} t={t} mood="happy" look={-0.6} />
      <PopWord t={t} at={6} x={POD_X - 300} y={260} text="HA!" size={90} fill="#FFFFFF" hold={len} />
    </g>
  );
};

// ---------------------------------------------------------------- S7: then you look out the window (from behind)
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const turn = easeOut(clamp(t / 14));
  return (
    <g transform={camT(960, 470, kf(t, [[0, 1.25], [len, 1.4]]))}>
      <PodRoom t={t + 60} />
      <Body look={YOU} pose={standAt(960, 1.25, GROUND + 160, { yaw: 0.9 - turn * 0.9, look: 0, armL: { a: 8, b: -6 }, armR: { a: 8, b: -6 } })} t={t} faces={[[0, 'neutral'], [14, 'shock']]} />
      <rect x={-200} y={-200} width={2400} height={1500} fill="#000" opacity={0} />
    </g>
  );
};

// ---------------------------------------------------------------- S8: the sky full of things that fly without wings
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 1250]]), 380, 1.05)}>
    <FutureCity t={t + 200} id="s8" cars={2.2} deck={false} />
  </g>
);

// ---------------------------------------------------------------- S9: the towers are taller than the clouds (tilt up)
const Clouds: React.FC<{ t: number; y: number; o?: number }> = ({ t, y, o = 0.85 }) => (
  <g opacity={o}>
    {Array.from({ length: 9 }).map((_, i) => {
      const x = ((i * 420 + t * 1.2) % 3600) - 900;
      return (
        <g key={i}>
          <ellipse cx={x} cy={y + (i % 3) * 30} rx={240} ry={60} fill="#FFFFFF" />
          <ellipse cx={x + 120} cy={y - 30 + (i % 3) * 30} rx={150} ry={60} fill="#FFFFFF" />
        </g>
      );
    })}
  </g>
);
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const cy = kf(t, [[0, 700], [len, -260]]);
  return (
    <g transform={camT(960, cy, 1.1)}>
      <FutureCity t={t + 260} id="s9" deck={false} />
      <g transform="translate(960 760)">
        <path d="M -110 0 L -70 -1500 Q 0 -1640 70 -1500 L 110 0 Z" fill="#5A80B0" />
        {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={0} cy={-160 - i * 150} rx={150} ry={20} fill="none" stroke="#E8FAFF" strokeWidth={8} opacity={0.8} />)}
        <circle cx={0} cy={-1560} r={30} fill="#E8FAFF" />
      </g>
      <Clouds t={t} y={-120} />
    </g>
  );
};

// ---------------------------------------------------------------- S10: and there are no cars. Not one.
export const S10 = scene({
  Set: CITY, words: W, cam: [960, 600, 1.0], cam1: [1060, 600, 1.05],
  cast: [
    { look: F1, x: 300, walk: 2.2, s: 0.9 }, { look: F2, x: 1500, walk: -1.8, s: 0.85 }, { look: KID, x: 1200, walk: -2.4, s: 0.65 }, { look: F3, x: 700, walk: 1.6, s: 0.95 },
  ],
  over: (t) => (
    <g>
      <PopWord t={t} at={16} x={960} y={300} text="0 CARS" size={130} fill="#FFD23A" hold={200} rot={-3} />
    </g>
  ),
});

// ---------------------------------------------------------------- S11: Vee hands you a little clear cube
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 30) / 14));
  const you = standAt(780, 1.2, GROUND + 60, { yaw: 0.5, armR: { a: 60 - 10 * k, b: -30 } });
  const h = handAt(you);
  const vx = kf(t, [[30, 1180], [44, 1060]], easeOut);
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.55], [len, 1.65]]))}>
      <PodRoom t={t + 80} />
      <Body look={YOU} pose={you} t={t} faces={[[0, 'neutral'], [34, 'shock']]} words={W} f={0} />
      <Vee x={vx} y={380} s={0.8} t={t} mood="happy" look={-0.6} />
      <WaterCube x={kf(t, [[30, 1060], [46, h.x + 10]], easeOut)} y={kf(t, [[30, 470], [46, h.y - 20]], easeOut)} s={0.8} />
    </g>
  );
};

// ---------------------------------------------------------------- S12: you bite it. It's water.
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const bite = t > 10 ? 1 : 0;
  return (
    <g>
      <Soft blur={16} dim={0.1}>
        <g transform={camT(960, 520, 1.5)}>
          <PodRoom t={t + 100} />
        </g>
      </Soft>
      <g transform={camT(960, 520, kf(t, [[0, 3.0], [len, 3.2]]))}>
        <Hero look={YOU} pose={{ ...basePose, x: 930, y: 700, yaw: 0.35, expr: t > 22 ? 'happy' : t > 10 ? 'shock' : 'neutral', blink: idleBlink(t, 3), talk: t > 4 && t < 10 ? 0.8 : 0 }} shadow={0} />
        <WaterCube x={1040} y={kf(t, [[0, 560], [8, 520]])} s={0.6} bite={bite} rot={-10} />
        {t > 10 && t < 30
          ? Array.from({ length: 8 }).map((_, i) => (
              <circle key={i} cx={1000 + Math.cos(i) * (t - 10) * 4} cy={510 + Math.sin(i * 1.7) * (t - 10) * 3 + (t - 10) * 1.5} r={6} fill="#9AE6FF" stroke="#0B0816" strokeWidth={2} />
            ))
          : null}
      </g>
      <PopWord t={t} at={14} x={1400} y={300} text="WATER?!" size={100} fill="#4AE8FF" hold={len} />
    </g>
  );
};

// ---------------------------------------------------------------- S13: you reach for your phone; not in your pocket
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const pat = Math.sin(t / 3) * 20;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.7], [len, 1.9]]))}>
      <PodRoom t={t + 120} />
      <Body look={YOU} pose={standAt(960, 1.2, GROUND + 60, { yaw: 0.1, armL: { a: 20 + pat, b: -60 }, armR: { a: 20 - pat, b: -60 }, look: -0.5 })} t={t} faces={[[0, 'neutral'], [10, 'worried'], [30, 'oops']]} />
      <PopWord t={t} at={18} x={1320} y={330} text="PHONE?" size={80} fill="#FFFFFF" hold={len} />
    </g>
  );
};

// ---------------------------------------------------------------- S14: it's in a glass case across the room
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 780], [len, 980]]), 600, kf(t, [[0, 1.1], [len, 1.3]]))}>
    <Museum t={t + 40} />
    <PhoneCase x={1100} y={GROUND - 20} s={1.1} />
    <Body look={YOU} pose={standAt(560, 1.35, GROUND + 140, { yaw: 0.8 })} t={t} faces={[[0, 'shock']]} shadow={1} />
  </g>
);

// ---------------------------------------------------------------- S15: the little sign
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={10} dim={0.25}>
      <g transform={camT(960, 600, 1.2)}>
        <Museum t={t + 60} cases={false} />
      </g>
    </Soft>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <g transform="translate(960 640) scale(3.8)">
        <GlassCase x={0} y={60} s={1} label="SMARTPHONE · EARLY 21ST C." label2="DO NOT TOUCH">
          <Phone26 x={0} y={-10} s={0.7} rot={-8} />
        </GlassCase>
      </g>
    </g>
  </g>
);

// ---------------------------------------------------------------- S16: you ask a kid where you are
export const S16 = scene({
  Set: CITY, words: W, cam: [960, 600, 1.7], cam1: [960, 610, 1.8],
  cast: [
    { look: YOU, x: 820, yaw: 0.5, faces: [[0, 'happy']], pose: (t) => ({ tilt: 18, armR: { a: 70 + Math.sin(t / 4) * 10, b: -40 }, talk: Math.abs(Math.sin(t / 2.2)) * 0.7 }) },
    { look: KID, x: 1120, s: 0.7, yaw: -0.5, faces: [[0, 'neutral']] },
  ],
  over: (t) => (
    <g opacity={clamp((t - 6) / 4)}>
      <rect x={300} y={200} width={560} height={110} rx={50} fill="#FFFFFF" stroke="#0B0816" strokeWidth={6} />
      <text x={580} y={270} textAnchor="middle" fontFamily={FONT.hand} fontSize={46} fill="#1A1A22">Where am I?</text>
    </g>
  ),
});

// ---------------------------------------------------------------- S17: he stares at you like you just barked
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.15}>
      <g transform={camT(960, 520, 1.6)}>
        <FutureCity t={t + 140} id="s17" />
      </g>
    </Soft>
    <g transform={camT(960, 540, kf(t, [[0, 3.0], [len, 3.2]]))}>
      <Citizen look={KID} pose={{ ...basePose, x: 960, y: 700, yaw: -0.3, headTilt: 10 + Math.sin(t / 15) * 3, look: 0.4 }} t={t} faces={[[0, 'neutral'], [8, 'oops']]} shadow={0} />
    </g>
    <PopWord t={t} at={10} x={1450} y={320} text="WOOF?" size={110} fill="#FFD23A" hold={len} rot={6} />
  </g>
);

// ---------------------------------------------------------------- S18: you pull out your wallet to buy a drink
const Wallet: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-50} y={-34} width={100} height={68} rx={10} fill="#6A4A30" stroke="#0B0816" strokeWidth={5} />
    <rect x={-40} y={-44} width={60} height={20} rx={3} fill="#9AC88A" stroke="#0B0816" strokeWidth={3} />
    <path d="M -50 -6 L 50 -6" stroke="#4A3220" strokeWidth={4} />
  </g>
);
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 6) / 10));
  const you = standAt(700, 1.1, 1010, { yaw: 0.6, armR: { a: 40 + 40 * k, b: -40 + 20 * k } });
  const h = handAt(you);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Shop t={t + 160} />
      <Citizen look={CLERK} pose={standAt(1180, 1.0, 900, { yaw: -0.4 })} t={t} faces={[[0, 'neutral'], [24, 'oops']]} shadow={0} />
      <ShopCounter />
      <Body look={YOU} pose={you} t={t} faces={[[0, 'happy']]} />
      <Wallet x={h.x + 20} y={h.y - 10} s={0.9} />
    </g>
  );
};

// ---------------------------------------------------------------- S19: the whole shop laughs
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const sh = (i: number) => Math.sin(t / 2 + i) * 6;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Shop t={t + 200} />
      <Citizen look={CLERK} pose={standAt(1180, 1.0, 900, { yaw: -0.3, tilt: sh(1) })} t={t} faces={[[0, 'happy']]} shadow={0} />
      <ShopCounter />
      <Citizen look={F1} pose={standAt(300, 1.1, 1040, { yaw: 0.5, tilt: -12 + sh(2) })} t={t} faces={[[0, 'happy']]} />
      <Citizen look={F2} pose={standAt(1600, 1.05, 1040, { yaw: -0.6, tilt: 10 + sh(3) })} t={t} faces={[[0, 'happy']]} />
      <Body look={YOU} pose={standAt(800, 1.1, 1040, { yaw: 0.4, armR: { a: 80, b: -20 } })} t={t} faces={[[0, 'oops']]} />
      <PopWord t={t} at={4} x={330} y={560} text="HA HA" size={80} fill="#FFFFFF" hold={len} rot={-8} />
      <PopWord t={t} at={10} x={1640} y={560} text="HA!" size={90} fill="#FFFFFF" hold={len} rot={8} />
    </g>
  );
};

export const S20 = bigWord({ kicker: 'THIS IS THE', word: 'YEAR 3000', Bg: CITY, size: 240, color: '#FFD23A' });

// ---------------------------------------------------------------- S21: everything you know is from 2026
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.1}>
      <g transform={camT(960, 420, 1.3)}>
        <FutureCity t={t + 300} id="s21" />
      </g>
    </Soft>
    <g transform={camT(960, 540, kf(t, [[0, 3.1], [len, 3.4]]))}>
      <Hero look={YOU} pose={{ ...basePose, x: 960, y: 700, yaw: 0.25, look: -0.4, headTilt: -6, expr: 'worried', blink: idleBlink(t, 4) }} shadow={0} />
    </g>
    <g opacity={clamp((t - 8) / 6)} transform="translate(360 260)">
      <rect x={-170} y={-60} width={340} height={110} rx={55} fill="#0B0816" opacity={0.85} />
      <text x={0} y={20} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} fill="#FF8A3D">2026</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- S22: how long would you actually last? (pull back)
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 700], [len, 520]]), kf(t, [[0, 2.2], [len, 0.85]], easeOut))}>
    <FutureCity t={t + 340} id="s22" mode="dusk" cars={1.5} />
    <Body look={YOU} pose={standAt(960, 0.8, GROUND, { yaw: 0.1, look: -0.4 })} t={t} faces={[[0, 'worried']]} shadow={1} />
    <Citizen look={F3} pose={standAt(1500 - t * 1.5, 0.75, GROUND, { yaw: -0.6 })} t={t} />
    <Citizen look={F1} pose={standAt(400 + t * 1.2, 0.75, GROUND, { yaw: 0.6 })} t={t} />
  </g>
);
