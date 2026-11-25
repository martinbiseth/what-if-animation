import React from 'react';
import { basePose, kf, camT, clamp, backOut, ShotProps, FONT, LEG_LEN, Glow, NightSky, Stars } from '../../../engine';
import {
  YOU, MO, ELLIE, GRANDPA, Body, faceCU, bigWord, wordF, SchBg, SchLabel, Headline, MoonIcon, SunIcon, CountUp, Soft, Sign,
  Beach, BEACH, Nest, Hatchlings, Hatchling, Hole, MOONPOS, Reef,
} from '../common';
import words from './words.json';

// Chapter 7, the cliffhanger: 112 turtles reach the sea. Thirty years. "How will they find it?" Then the water comes
// in fast, like the old tides, and one patch of sky has no stars. Is any of this real? The science recap, the
// question for the comments, and the subscribe ask over the dark spot.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const LIVE = '#FF8A3D';
const DIM = '#7E8DA6';
const B = BEACH;
const N = B.nest;
const r = (s: number, i: number) => { const x = Math.sin(s * 127.1 + i * 311.7) * 43758.5453; return x - Math.floor(x); };
const Dark: React.FC<{ t: number; id?: string; water?: number }> = ({ t, id, water = 0 }) => <Beach t={t} id={id} lights={0} stars={1} seaGlow={1} water={water} />;
const DarkBg: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Dark t={t} id={id} />;
const ellie = (o: Partial<typeof basePose> = {}) => ({ ...basePose, x: 1150, y: N.y - LEG_LEN * 0.72 + 10, scale: 0.72, yaw: 0.5, ...o });
const toSea = (d: number) => (i: number): [number, number] => [d * (0.7 + r(7, i) * 0.6), d * 0.1 * (r(8, i) - 0.2)];

// ---------- S1: one by one, the turtles turn around ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(N.x - 200, N.y - 60, kf(t, [[0, 2.6], [len, 2.4]]))}>
    <Dark t={t} />
    <Nest x={N.x} y={N.y} open={1} />
    <Hatchlings n={40} x={N.x - 280} y={N.y - 50} spread={180} t={t} s={0.6} go={(i) => (t < 6 + i * 0.5 ? [-(6 + i * 0.5 - t) * 2, 0] : [(t - 6 - i * 0.5) * 3, 0])} seed={61} />
  </g>
);

// ---------- S2: they scramble into the waves ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1250], [len, 1450]]), 820, 1.4)}>
    <Dark t={t + 40} />
    <Hatchlings n={70} x={1250} y={900} spread={260} t={t} s={0.6} go={toSea(t * 5)} seed={71} />
  </g>
);

// ---------- S3: Ellie counting: 112 ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1250, 640, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <Dark t={t + 80} />
      <Hatchlings n={14} x={1450} y={920} spread={160} t={t} s={0.6} go={toSea(t * 3)} seed={81} />
      <Body look={ELLIE} pose={ellie({ x: 1240, armR: { a: 80 + 10 * Math.sin(t / 3), b: -10 } })} t={t} faces={[[0, 'happy']]} seed={5} />
    </g>
    <rect x={260} y={90} width={400} height={180} rx={40} fill="#0B0816" opacity={0.75} />
    <CountUp x={460} y={230} t={t - 2} to={112} dur={Math.max(20, len - 12)} size={150} color="#F6EFE3" />
  </g>
);

// ---------- S4: Ellie crying and laughing: thirty years ----------
const tears = (t: number) => (
  <g>
    {[-1, 1].map((s) => <path key={s} d={`M ${960 + s * 46} ${600 + ((t * 2) % 50)} q 7 12 0 20 q -7 -8 0 -20`} fill="#BFE6FF" opacity={0.9} />)}
  </g>
);
export const S4 = faceCU({ look: ELLIE, Bg: DarkBg, faces: [[0, 'happy']], yaw: 0.2, eyes: -0.2, zoom: [3.2, 3.4], words: W, talk: [at('Thirty') / 30 - 0.05, at('eggs') / 30 + 0.4], extra: tears });

// ---------- S5: away and back: 30 years ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(20, len - 6));
  const a = k * Math.PI * 2;
  return (
    <g>
      <SchBg t={t} len={len} id="c7s5" />
      <ellipse cx={960} cy={520} rx={620} ry={260} fill="none" stroke={DIM} strokeWidth={4} strokeDasharray="12 12" />
      <rect x={280} y={430} width={90} height={180} rx={20} fill="#C8B488" opacity={0.6} />
      <SchLabel x={325} y={680} t={t} text="THIS BEACH" size={32} />
      <Hatchling x={960 - Math.cos(a) * 620} y={520 - Math.sin(a) * 260} s={1.4 + k * 1.4} dir={Math.sin(a) >= 0 ? 1 : -1} k={t * 0.9} />
      <Headline y={930} t={t} text="30 YEARS" size={130} color={LIVE} delay={10} />
    </g>
  );
};

// ---------- S6: Ellie looks up: how will they find it? ----------
export const S6 = faceCU({ look: ELLIE, Bg: DarkBg, faces: [[0, 'worried']], yaw: 0.2, eyes: 0, pose: { headTilt: -16 }, zoom: [3.2, 3.4], words: W, talk: [at('How') / 30 - 0.05, at('find') / 30 + 0.5] });

// ---------- S7: grandpa looks at his watch and frowns ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 820], [len, 860]]), 600, kf(t, [[0, 1.8], [len, 1.9]]))}>
    <Dark t={t + 120} />
    <Body look={GRANDPA} pose={{ ...basePose, x: 860, y: N.y - LEG_LEN * 0.78 + 20, scale: 0.78, yaw: 0.3, headTilt: 14, armL: { a: 60, b: 90 } }} t={t} faces={[[0, 'neutral'], [16, 'worried']]} seed={6} />
  </g>
);

// ---------- S8: grandpa: that's not right ----------
export const S8 = faceCU({ look: GRANDPA, Bg: DarkBg, faces: [[0, 'worried']], yaw: 0.3, eyes: 0.5, zoom: [3.0, 3.2], words: W, talk: [at("That's") / 30 - 0.05, at('right') / 30 + 0.4] });

// ---------- S9: the water rushes in, fast ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1300], [len, 1200]]), 700, 1.3)}>
    <Dark t={t + 160} water={kf(t, [[0, 0], [len, 0.9]])} />
  </g>
);

// ---------- S10: the tide post: water climbs past the line ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const lvl = kf(t, [[0, 820], [len, 470]]);
  return (
    <g>
      <Soft blur={16} dim={0.5}><g transform={camT(1500, 600, 1.4)}><DarkBg t={t + 200} /></g></Soft>
      <rect x={900} y={180} width={120} height={900} fill="#6A5240" stroke="#14121C" strokeWidth={6} />
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M 900 ${260 + i * 80} L 960 ${260 + i * 80}`} stroke="#F6EFE3" strokeWidth={5} />)}
      <path d="M 860 600 L 1060 600" stroke={LIVE} strokeWidth={8} strokeDasharray="20 12" />
      <text x={1080} y={612} fontFamily={FONT.ui} fontSize={36} fill={LIVE}>THIS WEEK'S HIGH TIDE</text>
      <rect x={-400} y={lvl} width={2800} height={1200} fill="#1E3A6A" opacity={0.85} />
      <path d={Array.from({ length: 30 }).map((_, i) => `${i ? 'L' : 'M'} ${-400 + i * 100} ${lvl + Math.sin(i + t / 4) * 8}`).join(' ')} stroke="#8AA4E0" strokeWidth={6} fill="none" />
    </g>
  );
};

// ---------- S11: Mo looks up ----------
export const S11 = faceCU({ look: MO, Bg: DarkBg, faces: [[0, 'worried'], [12, 'shock']], yaw: -0.2, eyes: 0, pose: { headTilt: -18 }, zoom: [3.1, 3.3] });

// ---------- S12: one patch of sky with no stars ----------
const Sky: React.FC<{ t: number; hole: number; id: string }> = ({ t, hole, id }) => (
  <g>
    <NightSky id={id} horizonY={1000} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#02020A" opacity={0.35} />
    <Stars seed={99} x0={-300} y0={-300} w={2500} h={1500} t={t} n={520} o={1} />
    <Hole x={MOONPOS.x - 460} y={MOONPOS.y + 200} r={150} o={hole} />
  </g>
);
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1200], [len, 960]]), kf(t, [[0, 700], [len, 450]]), kf(t, [[0, 1.0], [len, 1.6]]))}>
    <Sky t={t} hole={clamp(t / 30)} id="c7s12" />
  </g>
);

// ---------- S13: is any of this real? ----------
const SchFC: React.FC<{ t: number; id?: string }> = ({ t, id }) => <SchBg t={t} len={100} id={id ?? 'c7s13b'} />;
export const S13 = bigWord({ word: 'IS ANY OF THIS REAL?', color: '#F6EFE3', Bg: SchFC, size: 140 });

// ---------- S14: the Sun's tides: 46% of the Moon's ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c7s14" />
    <MoonIcon x={620} y={420} r={130} />
    <SunIcon x={1300} y={420} r={130 * 0.68} />
    <SchLabel x={620} y={640} t={t - 2} text="MOON: 100" size={52} />
    <SchLabel x={1300} y={640} t={t - 10} text="SUN: 46" size={52} color="#FFC23A" />
    <SchLabel x={960} y={860} t={t - 18} text="REAL: THE SUN'S TIDES ARE LESS THAN HALF AS STRONG" size={42} color={LIVE} />
    <SchLabel x={960} y={930} t={t - 24} text="NOAA" size={30} color={DIM} />
  </g>
);

// ---------- S15: Bay of Fundy: 16 m ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c7s15" />
    <rect x={-400} y={kf(t, [[0, 900], [30, 420]])} width={2800} height={1200} fill="#3E7AC8" opacity={0.6} />
    <Headline y={330} t={t} text="16 M" size={190} color="#F6EFE3" delay={2} />
    <SchLabel x={960} y={420} t={t - 8} text="REAL: BAY OF FUNDY, CANADA" size={44} color={LIVE} />
  </g>
);

// ---------- S16: corals time to the Moon, hatchlings to the brightest horizon ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c7s16" />
    <g opacity={clamp(t / 6)}>
      <svg x={180} y={200} width={720} height={480} viewBox="0 0 1920 1280" overflow="hidden"><Reef t={t} spawn={0.6} /></svg>
      <rect x={180} y={200} width={720} height={480} fill="none" stroke="#F6EFE3" strokeWidth={5} />
      <SchLabel x={540} y={760} t={t - 2} text="CORALS SPAWN BY THE MOON" size={38} />
    </g>
    <g opacity={clamp((t - 20) / 6)}>
      <rect x={1020} y={200} width={720} height={480} fill="#0C1426" stroke="#F6EFE3" strokeWidth={5} />
      <Glow x={1620} y={380} r={220} kind="cool" o={0.8} />
      {[0, 1, 2, 3, 4].map((i) => <Hatchling key={i} x={1120 + i * 70 + ((t * 2) % 60)} y={560 + (i % 2) * 40} s={1.3} k={t + i} />)}
      <SchLabel x={1380} y={760} t={t - 22} text="HATCHLINGS CRAWL TO THE LIGHT" size={38} />
    </g>
    <SchLabel x={960} y={900} t={t - 30} text="BOTH REAL" size={56} color={LIVE} />
  </g>
);

// ---------- S17: lights out: turtle nesting season ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.5}><g transform={camT(700, 500, 1.3)}><DarkBg t={t + 240} /></g></Soft>
    <g transform={`translate(960 ${kf(t, [[0, 560], [len, 540]])}) scale(${backOut(clamp(t / 8))})`}>
      <Sign x={0} y={0} s={1.2} w={820} lines={['LIGHTS OUT', 'TURTLE NESTING SEASON', 'MAY – OCTOBER']} color="#FFE27A" />
    </g>
  </g>
);

// ---------- S18: you on the dark beach ----------
export const S18 = faceCU({ look: YOU, Bg: DarkBg, faces: [[0, 'neutral'], [20, 'smug']], yaw: 0.1, eyes: 0, zoom: [3.0, 3.2] });

// ---------- S19: what's pulling the ocean? ----------
export const S19 = bigWord({ word: "WHAT'S PULLING THE OCEAN?", color: '#F6EFE3', Bg: DarkBg, size: 120 });

// ---------- S20: end card: the dark spot, subscribe ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(MOONPOS.x - 460, MOONPOS.y + 200, kf(t, [[0, 1.4], [len, 1.8]]))}>
      <Sky t={t + 300} hole={1} id="c7s20" />
      <Glow x={MOONPOS.x - 460} y={MOONPOS.y + 200} r={260} kind="cool" o={0.15 + 0.1 * Math.sin(t / 6)} />
    </g>
    <g transform={`translate(960 860) scale(${backOut(clamp((t - 12) / 8))})`}>
      <rect x={-260} y={-70} width={520} height={130} rx={65} fill="#E53935" />
      <text textAnchor="middle" y={22} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFFFFF">SUBSCRIBE</text>
    </g>
    <SchLabel x={960} y={200} t={t - 4} text="WHAT'S HIDING IN THE DARK SPOT?" size={52} color="#F6EFE3" />
  </g>
);
