import React from 'react';
import {
  Museum, GlassRoom, Vee, Citizen, Body, Big, PopWord, Soft, Holo, EarLight,
  scene, standAt, handAt, headAt, faceCU, YOU, MO7, ARCH, F1, F2, F3, KID, CLERK, CROWD, GROUND,
  camT, kf, clamp, backOut, easeOut, basePose, idleBlink, FONT, Glow, Hero, shk, ShotProps, Word, Pose,
} from '../common';
import words from './words.json';

// Chapter 5, someone notices: day six, the woman from the Archive. You are history; your credit runs out tomorrow;
// with no light you don't exist to the city (no food, no doors, no trains). A door opens for her and doesn't see you.
// She offers a home forever: a beautiful glass room with a sign, LIVING EXHIBIT 2026. Mo Seven: they'll never let you
// out. Helping someone with no light is a crime. You have until tomorrow.

const W = words as Word[];
const MUS: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Museum t={t} id={id} />;
const GR: React.FC<{ t: number; id?: string }> = ({ t, id }) => <GlassRoom t={t} id={id} />;

// ---------------------------------------------------------------- S1: the woman in silver walks into the museum
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1900], [len, 1150]]);
  const ph = t * 0.35;
  return (
    <g transform={camT(1100, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <MUS t={t + 100} />
      <Citizen look={ARCH} pose={{ ...standAt(x, 1.05, GROUND, { yaw: -0.6 }), legL: { a: -18 * Math.sin(ph), b: -10 }, legR: { a: 18 * Math.sin(ph), b: -10 }, facing: -1 }} t={t} faces={[[0, 'neutral']]} shadow={1} />
      <Body look={YOU} pose={standAt(560, 1, GROUND, { yaw: 0.5 })} t={t} faces={[[0, 'neutral'], [20, 'worried']]} shadow={1} />
      <Citizen look={MO7} pose={standAt(400, 1, GROUND, { yaw: 0.5 })} t={t} faces={[[0, 'neutral']]} shadow={1} />
    </g>
  );
};

// ---------------------------------------------------------------- S2: everybody steps aside
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 20));
  return (
    <g transform={camT(960, 640, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <MUS t={t + 140} />
      {[F1, F2, F3, CLERK].map((l, i) => {
        const side = i < 2 ? -1 : 1;
        return <Citizen key={i} look={l} pose={standAt(960 + side * (120 + (i % 2) * 160) + side * 260 * k, 1.1, GROUND + 40, { yaw: -side * 0.5 })} t={t} faces={[[0, 'worried']]} seed={i + 3} />;
      })}
      <Citizen look={ARCH} pose={standAt(960, 1.25, GROUND + 80, { yaw: 0 })} t={t} faces={[[0, 'neutral']]} shadow={1} />
    </g>
  );
};

// ---------------------------------------------------------------- S3: "I am from the Archive"
export const S3: React.FC<ShotProps> = (p) => {
  const Inner = faceCU({ look: ARCH, Bg: MUS, faces: [[0, 'neutral']], yaw: -0.3, words: W, talk: span3(), zoom: [2.8, 3.0] });
  return <Inner {...p} />;
};
function span3(): [number, number] {
  const ws = W;
  const n = (w: string) => w.toLowerCase().replace(/[^\w']/g, '');
  const i = ws.findIndex((w) => n(w.w) === 'i');
  const j = ws.findIndex((w, k) => k > i && n(w.w) === 'history');
  return [ws[Math.max(0, i)].s, ws[Math.max(0, j)].e + 0.05];
}

// ---------------------------------------------------------------- S4: "and you are history" (she points at you)
export const S4 = scene({
  Set: MUS, words: W, cam: [960, 560, 1.7], cam1: [960, 560, 1.8],
  cast: [
    { look: YOU, x: 720, yaw: 0.5, faces: [[0, 'shock']] },
    { look: ARCH, x: 1180, yaw: -0.5, faces: [[0, 'smug']], talk: [['And', 'history']], pose: () => ({ armL: { a: 85, b: 0 }, handL: 'point' }) },
  ],
});

export const S5 = faceCU({ look: ARCH, Bg: MUS, faces: [[0, 'neutral'], [8, 'smug']], yaw: -0.25, zoom: [3.3, 3.6], dark: 0.15 });

// ---------------------------------------------------------------- S6: your credit runs out tomorrow
export const S6 = scene({
  Set: MUS, words: W, cam: [1060, 560, 1.9], cam1: [1000, 560, 2.0],
  cast: [
    { look: ARCH, x: 1200, yaw: -0.5, faces: [[0, 'neutral']], talk: [['Your', 'train']] },
    { look: YOU, x: 820, yaw: 0.5, faces: [[0, 'worried']] },
  ],
});

// ---------------------------------------------------------------- S7: to the city, you do not exist (you fade)
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const fade = 1 - 0.75 * clamp((t - 6) / 24);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <MUS t={t + 180} />
      <Citizen look={F1} pose={standAt(560, 1.1, GROUND, { yaw: 0.4 })} t={t} />
      <Citizen look={F2} pose={standAt(1360, 1.1, GROUND, { yaw: -0.4 })} t={t} />
      <g opacity={fade}>
        <Body look={YOU} pose={standAt(960, 1.1, GROUND, { yaw: 0.1 })} t={t} faces={[[0, 'worried']]} />
      </g>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={760} y={300 + ((t * 4 + i * 120) % 500)} width={400} height={4} fill="#4AE8FF" opacity={0.4 * (1 - fade)} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- S8: no food, no door, no train
const Cross: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const k = clamp((t - at) / 6);
  return <path d={`M -70 -70 L ${-70 + 140 * k} ${-70 + 140 * k} M 70 -70 L ${70 - 140 * clamp((t - at - 4) / 6)} ${-70 + 140 * clamp((t - at - 4) / 6)}`} stroke="#FF5A4A" strokeWidth={16} strokeLinecap="round" />;
};
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.4}>
      <g transform={camT(960, 560, 1.2)}>
        <MUS t={t + 220} />
      </g>
    </Soft>
    {[0, 1, 2].map((i) => {
      const x = 480 + i * 480;
      const on = backOut(clamp((t - i * 14) / 9));
      return (
        <g key={i} transform={`translate(${x} 540) scale(${on})`}>
          <circle r={160} fill="#0A2A3A" stroke="#4AE8FF" strokeWidth={6} />
          {i === 0 ? <g><ellipse cx={0} cy={20} rx={80} ry={30} fill="#E0A050" stroke="#0B0816" strokeWidth={5} /><rect x={-80} y={-20} width={160} height={30} rx={14} fill="#7A3A20" stroke="#0B0816" strokeWidth={5} /><ellipse cx={0} cy={-34} rx={80} ry={34} fill="#E0A050" stroke="#0B0816" strokeWidth={5} /></g> : null}
          {i === 1 ? <g><rect x={-60} y={-100} width={120} height={190} rx={8} fill="#9AA8B4" stroke="#0B0816" strokeWidth={6} /><circle cx={34} cy={0} r={10} fill="#0B0816" /></g> : null}
          {i === 2 ? <g><rect x={-100} y={-60} width={200} height={110} rx={40} fill="#FFD23A" stroke="#0B0816" strokeWidth={6} /><rect x={-70} y={-40} width={60} height={40} rx={10} fill="#9AD8F0" /><rect x={10} y={-40} width={60} height={40} rx={10} fill="#9AD8F0" /></g> : null}
          <Cross t={t} at={i * 14 + 10} />
          <text x={0} y={220} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#FFFFFF">{['FOOD', 'DOORS', 'TRAINS'][i]}</text>
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------- S9: the light is your name, money and key
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = { ...basePose, x: 560, y: 700, yaw: 0.5 };
  return (
    <g>
      <rect width={1920} height={1080} fill="#0A1424" />
      <Glow x={560} y={500} r={500} kind="cool" o={0.4} />
      <g transform={camT(560, 540, 2.2)}>
        <Citizen look={F2} pose={pose} t={t} faces={[[0, 'neutral']]} />
      </g>
      {['NAME', 'MONEY', 'KEY'].map((s, i) => {
        const on = backOut(clamp((t - 10 - i * 14) / 9));
        const y = 300 + i * 220;
        return (
          <g key={i}>
            <path d={`M 560 ${470} Q 900 ${470} 1100 ${y}`} stroke="#4AE8FF" strokeWidth={5} fill="none" opacity={clamp((t - 6 - i * 14) / 6)} strokeDasharray="14 10" />
            <g transform={`translate(1350 ${y}) scale(${on})`}>
              <rect x={-220} y={-60} width={440} height={110} rx={55} fill="#0A2A3A" stroke="#4AE8FF" strokeWidth={5} />
              <text x={0} y={18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFFFFF">{s}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- S10 / S11: the door opens for her, not for you
const DOOR_X = 1000;
const SlideDoor: React.FC<{ open: number }> = ({ open }) => (
  <g>
    <rect x={DOOR_X - 200} y={GROUND - 520} width={400} height={520} fill="#0A0E1C" />
    <Glow x={DOOR_X} y={GROUND - 260} r={260} kind="warm" o={0.6 * open} />
    <rect x={DOOR_X - 200 - open * 190} y={GROUND - 520} width={200} height={520} fill="#C8D2DA" stroke="#0B0816" strokeWidth={7} />
    <rect x={DOOR_X + open * 190} y={GROUND - 520} width={200} height={520} fill="#C8D2DA" stroke="#0B0816" strokeWidth={7} />
    <rect x={DOOR_X - 230} y={GROUND - 560} width={460} height={44} rx={8} fill="#3A4656" stroke="#0B0816" strokeWidth={6} />
    <circle cx={DOOR_X} cy={GROUND - 538} r={10} fill={open > 0 ? '#5BE08A' : '#FF5A4A'} />
  </g>
);
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp((t - 30) / 12));
  return (
    <g transform={camT(DOOR_X - 100, 600, 1.45)}>
      <Museum t={t + 260} cases={false} />
      <SlideDoor open={open} />
      <Citizen look={ARCH} pose={standAt(kf(t, [[0, 600], [30, 860], [len, 1000]]), 1.05, GROUND, { yaw: 0.5 })} t={t} faces={[[0, 'smug']]} shadow={1} />
      <Body look={YOU} pose={standAt(420, 1.05, GROUND, { yaw: 0.5 })} t={t} faces={[[0, 'neutral']]} shadow={1} />
    </g>
  );
};
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const bump = t > 24 && t < 34;
  const x = kf(t, [[0, 640], [24, 790], [34, 760]]);
  return (
    <g transform={`${bump ? shk(t, 24, 10, 8) : ''} ${camT(DOOR_X - 100, 600, 1.45)}`}>
      <Museum t={t + 300} cases={false} />
      <SlideDoor open={0} />
      <Body look={YOU} pose={standAt(x, 1.05, GROUND, { yaw: 0.5, tilt: bump ? -10 : 0 })} t={t} faces={[[0, 'neutral'], [26, 'oops'], [40, 'worried']]} shadow={1} />
      <PopWord t={t} at={26} x={DOOR_X} y={240} text="BONK" size={90} fill="#FFD23A" hold={30} />
      <PopWord t={t} at={60} x={DOOR_X + 100} y={260} text="NOTHING." size={80} fill="#FFFFFF" hold={len} rot={3} />
    </g>
  );
};

export const S12 = faceCU({ look: MO7, Bg: MUS, faces: [[0, 'worried']], yaw: -0.3, zoom: [2.8, 3.0], pose: { armL: { a: 60, b: -90 }, armR: { a: 60, b: -90 } } });

// ---------------------------------------------------------------- S13: we can give you a home
export const S13 = scene({
  Set: MUS, words: W, cam: [1100, 520, 2.4], cam1: [1100, 520, 2.6],
  cast: [{ look: ARCH, x: 1100, yaw: -0.3, faces: [[0, 'happy']], talk: [['But', 'Forever']], pose: (t) => ({ armL: { a: 70 + Math.sin(t / 8) * 10, b: -50 }, armR: { a: 60, b: -40 } }) }],
});

// ---------------------------------------------------------------- S14: the glass room
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 0.95], [len, 1.05]]))}>
    <GlassRoom t={t + 340} sign={false} />
    <Citizen look={ARCH} pose={standAt(300, 1.0, GROUND + 60, { yaw: 0.5, armR: { a: 90, b: 0 } })} t={t} faces={[[0, 'happy']]} shadow={1} />
    <Body look={YOU} pose={standAt(160, 1.0, GROUND + 80, { yaw: 0.5 })} t={t} faces={[[0, 'shock'], [40, 'neutral']]} shadow={1} />
  </g>
);

// ---------------------------------------------------------------- S15: the sign with your name
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1640, GROUND - 330, kf(t, [[0, 2.6], [len, 2.9]]))}>
    <GlassRoom t={t + 380} />
    <g transform={`translate(1640 ${GROUND - 260})`}>
      <text x={0} y={-112} textAnchor="middle" fontFamily={FONT.hand} fontSize={26} fill="#F2EEE4">(your name)</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- S16: Mo Seven grabs your arm
export const S16 = scene({
  Set: GR, words: W, cam: [700, 600, 1.8], cam1: [700, 600, 1.9],
  cast: [
    { look: YOU, x: 760, yaw: 0.4, faces: [[0, 'shock']], pose: () => ({ armL: { a: 40, b: -10 } }) },
    { look: MO7, x: 520, yaw: 0.5, faces: [[0, 'worried']], talk: [['If', 'out']], pose: () => ({ armR: { a: 80, b: -10 }, tilt: 8 }) },
  ],
});

export const S17 = faceCU({ look: ARCH, Bg: GR, faces: [[0, 'neutral']], yaw: -0.4, zoom: [3.0, 3.3], light: { x: 960, y: 560, kind: 'red', o: 0.5 } });
export const S18 = faceCU({ look: MO7, Bg: GR, faces: [[0, 'worried']], yaw: 0.3, zoom: [3.0, 3.2] });

// ---------------------------------------------------------------- S19: until tomorrow to decide
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 520, 1.0)}>
      <GlassRoom t={t + 420} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
    <g transform={camT(960, 560, kf(t, [[0, 2.4], [len, 2.7]]))}>
      <Hero look={YOU} pose={{ ...basePose, x: 960, y: 760, yaw: 0.1, look: -0.3, expr: 'worried', blink: idleBlink(t, 7) }} shadow={0} />
    </g>
    <g transform="translate(960 160)" opacity={clamp((t - 10) / 6)}>
      <rect x={-200} y={-50} width={400} height={90} rx={45} fill="#0B0816" opacity={0.85} />
      <text x={0} y={16} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} fill="#FF5A4A">{`23:59:${String(59 - (Math.floor(t / 30) % 60)).padStart(2, '0')}`}</text>
    </g>
  </g>
);
