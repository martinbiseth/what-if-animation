import React from 'react';
import { ShotProps, Word, clamp, easeOut, backOut, kf, camT, FONT, Glow, walkPose, Hero, factCard, LEG_LEN } from '../../../engine';
import { YOU, KETIL, KETIL_OUT, GUDRUN, ASA, LH, FEET, Farmyard, Longhouse, Cow, Shovel, Smoke, INK, Sleeper } from '../norse';
import { scene, faceCU, insert, bigWord, inside, outside, NameTag, SIT, seatFeet, wordF, span } from '../common';
import words from './words.json';

// Chapter 3, the house that breathes: the longhouse (one room, ~30 m, timber walls, a turf roof on birch bark about
// 20 cm thick), snow shovelled against the walls (fresh snow >90 % air), the long hearth (heater, stove, light), no
// chimney (the smoke hole), benches as beds, and the cows under the same roof (a person ~100 W, a cow several times more).

const W = words as Word[];
const at = (a: string, n = 1) => wordF(W, a, n);
const DAY = inside({ mode: 'day', fire: 1 });
const DAY_OUT = outside({ tod: 'day', door: 0.5, snow: 0.3 });

// ---------- S1: where you woke up: the farm in daylight, the camera drifts along the house ----------
export const S1 = scene({ Set: DAY_OUT, setT: 20, cam: [[700, 540, 1.15], [960, 540, 1.0]] });

// ---------- S2: one single room, about thirty metres long: a pan along the inside ----------
export const S2 = scene({
  Set: DAY, setT: 60, cam: [[300, 560, 1.25], [1700, 560, 1.25]],
  cast: [{ look: GUDRUN, x: 800, feet: LH.back, s: 0.95, yaw: 0.3 }, { look: ASA, x: 1250, feet: LH.back, s: 0.72, yaw: -0.3, faces: [[0, 'happy']] }],
  front: (t, len) => {
    const k = clamp((t - 30) / 20);
    return (
      <g opacity={k}>
        <path d={`M -200 1040 L ${-200 + 2600 * k} 1040`} stroke="#FFD23A" strokeWidth={10} strokeLinecap="round" />
        <text x={kf(t, [[0, 300], [len, 1700]])} y={1010} textAnchor="middle" fontFamily={FONT.ui} fontSize={54} fill="#FFD23A">≈ 30 m</text>
      </g>
    );
  },
});

// ---------- S3: thick timber walls ----------
export const S3 = scene({ Set: DAY, setT: 100, cam: [[1200, 420, 2.4], [1260, 430, 2.5]], front: (t) => <NameTag x={1250} y={330} t={t - 8} text="THICK TIMBER" s={0.45} /> });

// ---------- S4: the roof in cross-section: rafters, birch bark, turf, snow ----------
export const S4: React.FC<ShotProps> = ({ t }) => {
  const layer = (d: number) => easeOut(clamp((t - d) / 10));
  const lab = (x: number, y: number, s: string, d: number) => (
    <text x={x} y={y} fontFamily={FONT.ui} fontSize={46} fill="#F6EFE3" opacity={clamp((t - d) / 6)}>{s}</text>
  );
  return (
    <g>
      <rect width={1920} height={1080} fill="#16121E" />
      <g transform="translate(160 0)">
        <rect x={0} y={700} width={1100} height={60 * layer(0)} fill="#6A4A2E" stroke={INK} strokeWidth={5} />
        {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={40 + i * 190} y={700} width={60} height={160 * layer(0)} fill="#5A3E2C" stroke={INK} strokeWidth={4} />)}
        <rect x={0} y={700 - 26 * layer(at('birch') - at('roof') + 2)} width={1100} height={26 * layer(at('birch') - at('roof') + 2)} fill="#F2EEE2" stroke={INK} strokeWidth={4} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${60 + i * 220} 684 l 60 0`} stroke="#3A3A3A" strokeWidth={3} opacity={layer(at('birch') - at('roof') + 2)} />)}
        <rect x={0} y={674 - 150 * layer(at('grass') - at('roof'))} width={1100} height={150 * layer(at('grass') - at('roof'))} fill="#5A4030" stroke={INK} strokeWidth={4} />
        <path d={`M 0 ${674 - 150 * layer(at('grass') - at('roof'))} ${Array.from({ length: 30 }).map((_, i) => `l 18 ${i % 2 ? 18 : -18}`).join(' ')}`} stroke="#5E8A3A" strokeWidth={12} fill="none" opacity={layer(at('grass') - at('roof'))} />
        <path d={`M -20 ${510} Q 550 ${430} 1120 510 L 1120 ${524} L -20 524 Z`} fill="#F2F8FF" stroke={INK} strokeWidth={4} opacity={layer(at('Turf') - at('roof') + 8)} />
      </g>
      {lab(1320, 810, 'RAFTERS', 4)}
      {lab(1320, 700, 'BIRCH BARK', at('birch') - at('roof') + 6)}
      {lab(1320, 610, 'TURF', at('grass') - at('roof') + 4)}
      {lab(1320, 500, 'SNOW', at('Turf') - at('roof') + 12)}
    </g>
  );
};

// ---------- S5: a living roof, about 20 cm thick, like a wool hat ----------
export const S5 = scene({
  Set: DAY_OUT, setT: 160, cam: [[820, 440, 1.9], [820, 440, 2.05]],
  front: (t) => (
    <g opacity={clamp((t - 18) / 6)}>
      <path d="M 1280 400 L 1280 470" stroke="#FFD23A" strokeWidth={8} />
      <path d="M 1262 400 L 1298 400 M 1262 470 L 1298 470" stroke="#FFD23A" strokeWidth={8} />
      <text x={1310} y={448} fontFamily={FONT.ui} fontSize={40} fill="#FFD23A" stroke="#0B0816" strokeWidth={6} paintOrder="stroke">≈ 20 cm</text>
    </g>
  ),
});

// ---------- S6: the family shovels snow up against the walls ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const sw = Math.sin(t / 7);
  return (
    <g transform={camT(kf(t, [[0, 520], [len, 560]]), 560, 1.55)}>
      <Farmyard t={t + 200} tod="day" door={0.4} snow={0.3} />
      <Hero look={KETIL_OUT} pose={{ ...walkPose(560, 0, FEET + 20, 1, {}, 1), tilt: 18 + sw * 8, armR: { a: 40 + sw * 40, b: -30 }, armL: { a: 30 + sw * 40, b: -50 }, legL: { a: 10, b: 0 }, legR: { a: -14, b: 0 }, expr: 'happy' }} />
      <Shovel x={650 + sw * 40} y={FEET - 30} rot={-50 + sw * 30} load={sw < 0} />
      {sw > 0.6 ? <circle cx={420} cy={620 - sw * 60} r={30} fill="#F2F8FF" /> : null}
    </g>
  );
};
export const S7 = factCard({ value: 90, suffix: '%+', label: 'OF FRESH SNOW CAN BE TRAPPED AIR', sub: 'US National Snow and Ice Data Center' });

// ---------- S8: trapped air keeps heat in; the snow is part of the house (warm glow inside the banked walls) ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(800, 560, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <Farmyard t={t + 260} tod="dusk" door={1} snow={0.2} banks={1.3} />
    {[0, 1, 2, 3].map((i) => {
      const q = ((t + i * 12) % 48) / 48;
      return <path key={i} d={`M ${500 + i * 200} 640 q 0 ${-40 * q} 30 ${-60 * q}`} stroke="#FF8A3D" strokeWidth={10} fill="none" opacity={0.7 * (1 - q)} strokeLinecap="round" />;
    })}
  </g>
);

// ---------- S9: the long hearth, a fire pit as long as a car ----------
export const S9 = scene({ Set: DAY, setT: 300, cam: [[960, 860, 1.9], [960, 860, 1.75]],
  front: (t) => (
    <g opacity={clamp((t - 50) / 6)}>
      <rect x={720} y={980} width={480} height={56} rx={28} fill="#0B0816" opacity={0.7} />
      <text x={960} y={1020} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#FFD23A">≈ AS LONG AS A CAR</text>
    </g>
  ),
});

// ---------- S10: heater, stove, light: Gudrun stirs the cauldron ----------
export const S10 = scene({
  Set: DAY, setT: 340,
  cast: [{ look: GUDRUN, x: 1250, feet: LH.back, s: 0.97, yaw: -0.5, faces: [[0, 'neutral']], pose: { armR: { a: 70, b: -30 } }, keys: [] }],
  cam: [[1150, 640, 1.9], [1150, 650, 2.0]],
});

// ---------- S11: and the chimney? there isn't one: up to the smoke hole ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, kf(t, [[0, 500], [len, 120]]), kf(t, [[0, 1.3], [len, 2.2]]))}>
      <Longhouse t={t + 380} mode="day" fire={1} smoke={1.6} />
    </g>
    <text x={1500} y={300} fontFamily={FONT.title} fontWeight={800} fontSize={200} fill="#FFD23A" stroke="#0B0816" strokeWidth={14} paintOrder="stroke" opacity={clamp((t - 6) / 6)}>?</text>
  </g>
);

// ---------- S12: your eyes sting ----------
export const S12 = faceCU({
  look: YOU, Bg: DAY, faces: [[0, 'tired']], yaw: 0.1, zoom: [3.0, 3.2], pose: { armR: { a: 160, b: -120 } },
  extra: (t) => <Smoke x={800} y={700} tx={1100} ty={300} t={t} o={0.45} n={6} r={30} />,
});
export const S13 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'neutral'], [16, 'oops']], yaw: 0.4, eyes: 0.8, zoom: [2.8, 3.0], pose: { headTilt: 14 } });

// ---------- S14: wide wooden benches along both walls ----------
export const S14 = scene({ Set: DAY, setT: 420, cam: [[400, 680, 1.6], [700, 690, 1.6]] });

// ---------- S15: at night you sleep on them: everyone, side by side ----------
export const S15 = scene({
  Set: inside({ mode: 'night', fire: 0.6 }), setT: 450, cam: [[640, 640, 1.5], [660, 640, 1.6]],
  back: (t) => (
    <g>
      <Sleeper x={180} y={LH.bench + 6} s={0.8} t={t} c="#7A5A3A" hair="#C2501E" beard="#C2501E" />
      <Sleeper x={520} y={LH.bench + 6} s={0.8} t={t + 20} c="#5A6A8A" hair="#E0B060" />
      <Sleeper x={820} y={LH.bench + 6} s={0.6} t={t + 40} c="#8A4A3A" hair="#E8C060" />
      <Sleeper x={1120} y={LH.bench + 6} s={0.8} t={t + 60} c="#A88A60" hair="#F07A2A" />
    </g>
  ),
});

// ---------- S16: you walk to the far end; the cow looks up ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1000], [len, 1420]], (q) => q);
  return (
    <g transform={camT(kf(t, [[0, 1250], [len, 1500]]), 600, 1.5)}>
      <Longhouse t={t + 500} mode="day" fire={1} />
      <Hero look={YOU} pose={{ ...walkPose(x, t * 0.55, LH.back, 0.95, { expr: 'neutral' }, 1) }} />
    </g>
  );
};

// ---------- S17: the animals live under the same roof ----------
export const S17 = scene({ Set: DAY, setT: 540, cam: [[1880, 600, 1.6], [1870, 600, 1.7]] });
export const S18 = factCard({ value: 100, suffix: ' W', label: 'HEAT FROM ONE RESTING PERSON', sub: 'ASHRAE Handbook of Fundamentals' });

// ---------- S19: a cow: several times more ----------
export const S19 = insert({
  Bg: DAY, dim: 0.45,
  draw: (t) => (
    <g>
      <g transform="translate(560 760) scale(0.9)">
        <circle cx={0} cy={-260} r={60} fill="#26232F" stroke={INK} strokeWidth={6} />
        <rect x={-46} y={-200} width={92} height={200} rx={30} fill="#F07A2A" stroke={INK} strokeWidth={6} />
        <text x={0} y={90} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} fill="#F6EFE3">100 W</text>
      </g>
      <Cow x={1280} y={760} s={1.1} t={t} chew />
      <g transform={`translate(1280 920) scale(${backOut(clamp((t - 10) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={86} fill="#FF8A3D" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">SEVERAL × MORE</text>
      </g>
      {[0, 1, 2, 3].map((i) => {
        const q = ((t + i * 10) % 40) / 40;
        return <path key={i} d={`M ${1160 + i * 70} 560 q 14 ${-40 * q} 0 ${-80 * q}`} stroke="#FF8A3D" strokeWidth={10} fill="none" opacity={0.8 * (1 - q)} strokeLinecap="round" />;
      })}
    </g>
  ),
});

// ---------- S20: two cows: a heater that also makes milk ----------
export const S20 = scene({
  Set: DAY, setT: 600, cam: [[1880, 580, 1.6], [1880, 580, 1.68]],
  front: (t) => (
    <g opacity={clamp((t - at('heater', 2) + at('Two') - 4) / 6)}>
      <rect x={1640} y={300} width={620} height={90} rx={45} fill="#0B0816" opacity={0.75} />
      <text x={1950} y={362} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} fill="#FFD23A">HEATER + MILK</text>
    </g>
  ),
});

// ---------- S21: Asa pats the cow and says something to you ----------
export const S21 = scene({
  Set: DAY, setT: 640,
  cast: [
    { look: ASA, x: 1560, feet: LH.back, s: 0.72, yaw: 0.6, faces: [[0, 'happy']], pose: { armR: { a: 110, b: -20 } } },
    { look: YOU, x: 1300, feet: LH.back, s: 0.95, yaw: 0.5, faces: [[0, 'neutral']] },
  ],
  cam: [[1550, 600, 1.6], [1560, 600, 1.7]],
});
export const S22 = faceCU({ look: ASA, Bg: DAY, faces: [[0, 'happy']], yaw: -0.2, zoom: [3.6, 3.8], words: W, talk: [span(W, 'this', 'oven', 2)],
  extra: (t) => (
    <g transform={`translate(1110 400) scale(${backOut(clamp((t - 10) / 8)) * 0.35})`}>
      <rect x={-260} y={-70} width={520} height={120} rx={60} fill="#F6EFE3" stroke={INK} strokeWidth={8} />
      <text y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill={INK}>OUR OVEN!</text>
    </g>
  ) });
