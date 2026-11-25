import React from 'react';
import { factCard, Schematic, SchLabel, LOOKS } from '../../../engine';
import {
  PodRoom, FutureCity, Museum, Shop, ShopCounter, SkyCar, Vee, Citizen, Body, Big, PopWord, Soft, Holo, Glyphs, Phone26,
  scene, veeCU, bigWord, standAt, handAt, headAt, faceCU, YOU, MO, MO7, F1, F2, F3, KID, KID2, CLERK, CROWD, GROUND,
  camT, kf, clamp, backOut, easeOut, basePose, idleBlink, FONT, Glow, Hero, shk, rnd, ShotProps, Word, Pose,
} from '../common';
import words from './words.json';

// Chapter 3, the fun part: day one you're famous; a crowd at the museum, and the first face is Mo's: Mo Seven, his
// descendant (974 years is about 32 generations; 2^32 is over 4 billion ancestor spots, so family trees fold into
// each other). He shows you the city (a bus that comes when you look at the stop, printed dinner, a burger that never
// met a cow); you show off (handwriting, shoelaces, loading bars); museum tours make you rich. Day four: a sneeze.

const W = words as Word[];
const CITY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <FutureCity t={t} id={id} />;
const MUS: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Museum t={t} id={id} />;
const SHOP: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Shop t={t} id={id} />;

export const S1 = bigWord({ kicker: "DAY 1 · YOU'RE", word: 'FAMOUS', Bg: CITY, size: 240, color: '#FFD23A' });

// ---------------------------------------------------------------- S2: a crowd waits outside the museum; your face on a holo
const YourFaceHolo: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Holo x={0} y={0} w={420} h={300} t={t}>
      <g transform="translate(0 40) scale(0.9) translate(-960 -640)">
        <Hero look={YOU} pose={{ ...basePose, x: 960, y: 760, yaw: 0, expr: 'worried' }} shadow={0} />
      </g>
      <text x={0} y={-110} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FFD23A">FROM 2026!</text>
    </Holo>
  </g>
);
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 0.95], [len, 1.05]]))}>
    <FutureCity t={t + 100} />
    <rect x={460} y={260} width={1000} height={GROUND - 260} fill="#1E2A4A" stroke="#0B0816" strokeWidth={8} />
    <rect x={460} y={220} width={1000} height={60} fill="#F2C84A" stroke="#0B0816" strokeWidth={6} />
    <text x={960} y={264} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#1A1A22">CITY MUSEUM</text>
    <YourFaceHolo x={960} y={480} s={0.9} t={t} />
    {Array.from({ length: 14 }).map((_, i) => {
      const x = 120 + i * 125 + rnd(3, i) * 40;
      const look = CROWD[i % CROWD.length];
      return <Citizen key={i} look={look} pose={standAt(x, look === KID || look === KID2 ? 0.65 : 0.9 + rnd(4, i) * 0.15, GROUND + 60 + (i % 2) * 40, { yaw: x < 960 ? 0.5 : -0.5, armR: { a: 120 + Math.sin(t / 4 + i) * 30, b: -30 } })} t={t} faces={[[0, 'happy']]} seed={i} />;
    })}
  </g>
);

// ---------------------------------------------------------------- S3: the first face in the crowd: Mo
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.2}>
      <g transform={camT(960, 520, 1.6)}>
        <FutureCity t={t + 140} />
      </g>
    </Soft>
    <g transform={camT(960, 540, kf(t, [[0, 2.4], [len, 3.2]], easeOut))}>
      <Citizen look={F1} pose={standAt(660, 1, 900, { yaw: 0.4 })} t={t} faces={[[0, 'happy']]} />
      <Citizen look={F2} pose={standAt(1260, 1, 900, { yaw: -0.4 })} t={t} faces={[[0, 'happy']]} />
      <Citizen look={MO7} pose={{ ...basePose, x: 960, y: 700, yaw: 0, look: 0 }} t={t} faces={[[0, 'happy']]} shadow={0} />
    </g>
    <PopWord t={t} at={18} x={1500} y={260} text="MO?!" size={120} fill="#FFD23A" hold={len} rot={6} />
  </g>
);

// ---------------------------------------------------------------- S4: same face: Mo 2026 and Mo Seven side by side
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={960} height={1080} fill="#F2A06A" />
    <rect x={960} width={960} height={1080} fill="#2FB8B0" />
    <defs>
      <clipPath id="c3L"><rect x={0} y={0} width={960} height={1080} /></clipPath>
      <clipPath id="c3R"><rect x={960} y={0} width={960} height={1080} /></clipPath>
    </defs>
    <g clipPath="url(#c3L)">
      <g transform={camT(1160, 600, 2.4)}>
        <Hero look={MO} pose={{ ...basePose, x: 960, y: 760, yaw: 0.2, expr: 'happy', blink: idleBlink(t, 2) }} shadow={0} />
      </g>
    </g>
    <g clipPath="url(#c3R)">
      <g transform={camT(760, 600, 2.4)}>
        <Citizen look={MO7} pose={{ ...basePose, x: 960, y: 760, yaw: -0.2 }} t={t} faces={[[0, 'happy']]} />
      </g>
    </g>
    <rect x={955} width={10} height={1080} fill="#0B0816" />
    <g transform="translate(480 150)">
      <rect x={-130} y={-50} width={260} height={90} rx={45} fill="#0B0816" />
      <text x={0} y={16} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} fill="#FFFFFF">2026</text>
    </g>
    <g transform="translate(1440 150)">
      <rect x={-130} y={-50} width={260} height={90} rx={45} fill="#0B0816" />
      <text x={0} y={16} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} fill="#FFFFFF">3000</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- S5: "I'm Mo Seven"
export const S5 = scene({
  Set: CITY, words: W, cam: [960, 560, 1.75], cam1: [960, 560, 1.85],
  cast: [
    { look: YOU, x: 760, yaw: 0.5, faces: [[0, 'shock']] },
    { look: MO7, x: 1150, yaw: -0.5, faces: [[0, 'happy']], talk: [["I'm", 'grandfather']], pose: (t) => ({ armL: { a: 60 + Math.sin(t / 5) * 15, b: -60 } }) },
  ],
  over: (t) => (
    <g transform={`translate(1350 260) scale(${backOut(clamp((t - 4) / 9))})`}>
      <rect x={-200} y={-50} width={400} height={90} rx={45} fill="#0B0816" opacity={0.85} />
      <text x={0} y={16} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#2FB8B0">MO SEVEN</text>
    </g>
  ),
});

// ---------------------------------------------------------------- S6: the family tree, doubling back 32 generations
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const rows = Math.min(7, 1 + Math.floor(t / 14));
  const gen = Math.min(32, Math.round(1 + 31 * clamp((t - 20) / Math.max(1, len - 40))));
  return (
    <g>
      <Schematic t={t} id="tree" />
      {Array.from({ length: rows }).map((_, r) => {
        const n = 2 ** r;
        const y = 900 - r * 110;
        return (
          <g key={r}>
            {Array.from({ length: n }).map((_, i) => {
              const x = 960 + (i - (n - 1) / 2) * Math.min(160, 1700 / n);
              const px = 960 + (Math.floor(i / 2) - (n / 2 - 1) / 2) * Math.min(160, 1700 / (n / 2));
              return (
                <g key={i}>
                  {r > 0 ? <path d={`M ${x} ${y + 14} L ${px} ${y + 96}`} stroke="#4AE8FF" strokeWidth={2} opacity={0.5} /> : null}
                  <circle cx={x} cy={y} r={Math.max(4, 22 - r * 3)} fill={r === 0 ? '#FF8A3D' : '#4AE8FF'} />
                </g>
              );
            })}
          </g>
        );
      })}
      <SchLabel x={960} y={150} t={t - 2} text={`GENERATIONS BACK: ${gen}`} size={48} />
    </g>
  );
};

export const S7 = factCard({ value: 4294967296, label: 'ANCESTOR SPOTS, 32 GENERATIONS BACK', sub: 'more than all the people alive in the year 1000' });

// ---------------------------------------------------------------- S8: a huge part of this city could be his family
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.1], [len, 0.95]]))}>
    <FutureCity t={t + 200} />
    {Array.from({ length: 16 }).map((_, i) => {
      const x = 60 + i * 120;
      const turn = clamp((t - 6 - i * 1.5) / 6);
      return <Citizen key={i} look={i === 8 ? MO7 : CROWD[i % CROWD.length]} pose={standAt(x, 0.85, GROUND + (i % 2) * 40, { yaw: 0.6 - turn * 0.6, armR: { a: 20 + 130 * turn, b: -30 } })} t={t} faces={[[0, 'neutral'], [8 + i, 'happy']]} seed={i} />;
    })}
    <PopWord t={t} at={20} x={960} y={280} text="FAMILY?" size={110} fill="#FFD23A" hold={len} rot={-3} />
  </g>
);

// ---------------------------------------------------------------- S9: Mo Seven becomes your guide (walking the deck)
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const cx = 600 + t * 3;
  return (
    <g transform={camT(cx + 200, 600, 1.25)}>
      <FutureCity t={t + 260} />
      <Body look={YOU} pose={{ ...standAt(cx, 1, GROUND, { yaw: 0.6 }), legL: { a: 18 * Math.sin(t * 0.3), b: -10 }, legR: { a: -18 * Math.sin(t * 0.3), b: -10 }, armL: { a: 14 * Math.sin(t * 0.3), b: -10 } }} t={t} faces={[[0, 'happy']]} shadow={1} />
      <Citizen look={MO7} pose={{ ...standAt(cx + 260, 1, GROUND, { yaw: 0.3 }), legL: { a: 18 * Math.sin(t * 0.3 + 1), b: -10 }, legR: { a: -18 * Math.sin(t * 0.3 + 1), b: -10 }, armR: { a: 100, b: -40 } }} t={t} faces={[[0, 'happy']]} shadow={1} />
      <Vee x={cx + 520} y={GROUND - 520} s={0.5} t={t} mood="happy" />
    </g>
  );
};

// ---------------------------------------------------------------- S10: the bus comes when you look at the stop
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const bx = kf(t, [[10, 2600], [40, 1250]], easeOut);
  return (
    <g transform={camT(1050, 580, 1.15)}>
      <FutureCity t={t + 300} />
      <g transform={`translate(800 ${GROUND})`}>
        <rect x={-6} y={-380} width={12} height={380} fill="#3A4656" />
        <circle cx={0} cy={-400} r={46} fill="#2FB8B0" stroke="#0B0816" strokeWidth={6} />
        <circle cx={0} cy={-400} r={18} fill="#FFFFFF" opacity={0.5 + 0.5 * Math.sin(t / 3)} />
      </g>
      <g transform={`translate(${bx} ${GROUND - 230})`}>
        <ellipse cx={0} cy={140} rx={260} ry={22} fill="#4AE8FF" opacity={0.4} />
        <rect x={-330} y={-80} width={660} height={190} rx={90} fill="#FFD23A" stroke="#0B0816" strokeWidth={7} />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-260 + i * 140} y={-50} width={110} height={70} rx={20} fill="#9AD8F0" stroke="#0B0816" strokeWidth={5} />)}
      </g>
      <Body look={YOU} pose={standAt(640, 1, GROUND, { yaw: 0.5, look: 0.5 })} t={t} faces={[[0, 'neutral'], [20, 'shock']]} />
      <Citizen look={MO7} pose={standAt(470, 1, GROUND, { yaw: 0.5 })} t={t} faces={[[0, 'smug']]} />
    </g>
  );
};

// ---------------------------------------------------------------- S11: dinner printed in front of you
const Burger: React.FC<{ x: number; y: number; s?: number; bite?: number; built?: number }> = ({ x, y, s = 1, bite = 0, built = 1 }) => {
  const layers: [number, string, number][] = [[30, '#E0A050', 34], [10, '#5A9A3A', 14], [-6, '#7A3A20', 26], [-26, '#F2C84A', 10], [-50, '#E0A050', 40]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <defs>
        <clipPath id="burgerBite">
          <path d={bite ? 'M -200 -200 L 200 -200 L 200 200 L -200 200 Z M 110 -30 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0' : 'M -200 -200 L 200 -200 L 200 200 L -200 200 Z'} clipRule="evenodd" />
        </clipPath>
      </defs>
      <g clipPath="url(#burgerBite)">
        {layers.slice(0, Math.ceil(layers.length * built)).map(([yy, c, h], i) => <rect key={i} x={-120} y={yy - h / 2} width={240} height={h} rx={h / 2.2} fill={c} stroke="#0B0816" strokeWidth={5} />)}
      </g>
    </g>
  );
};
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const built = clamp((t - 6) / 40);
  return (
    <g>
      <Soft blur={10} dim={0.2}>
        <g transform={camT(960, 520, 1.3)}>
          <SHOP t={t + 340} />
        </g>
      </Soft>
      <g transform="translate(960 620)">
        <rect x={-300} y={-360} width={600} height={460} rx={30} fill="#F2F6F8" stroke="#0B0816" strokeWidth={8} />
        <rect x={-250} y={-310} width={500} height={330} rx={20} fill="#14202C" />
        <rect x={-200} y={-260 + built * 200} width={400} height={8} fill="#4AE8FF" opacity={built < 1 ? 0.9 : 0} />
        <path d="M -40 -300 L 40 -300 L 20 -260 L -20 -260 Z" fill="#9AA8B4" stroke="#0B0816" strokeWidth={4} />
        <Burger x={0} y={-60} s={1} built={built} />
      </g>
      <PopWord t={t} at={44} x={1460} y={300} text="PRINTED" size={90} fill="#4AE8FF" hold={len} rot={5} />
    </g>
  );
};

// ---------------------------------------------------------------- S12: tastes like a burger, never met a cow
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.1}>
      <g transform={camT(960, 520, 1.4)}>
        <SHOP t={t + 380} />
      </g>
    </Soft>
    <g transform={camT(960, 540, kf(t, [[0, 2.8], [len, 3.0]]))}>
      <Hero look={YOU} pose={{ ...basePose, x: 920, y: 700, yaw: 0.35, expr: t > 16 ? 'happy' : 'neutral', talk: t > 8 && t < 16 ? 0.8 : 0, blink: idleBlink(t, 3) }} shadow={0} />
      <Burger x={1050} y={kf(t, [[0, 640], [8, 580]])} s={0.5} bite={t > 14 ? 1 : 0} />
    </g>
    <g opacity={clamp((t - 30) / 8)} transform="translate(1450 300)">
      <ellipse cx={0} cy={0} rx={220} ry={150} fill="#FFFFFF" stroke="#0B0816" strokeWidth={6} />
      <circle cx={-170} cy={170} r={20} fill="#FFFFFF" stroke="#0B0816" strokeWidth={5} />
      <ellipse cx={0} cy={10} rx={90} ry={60} fill="#F2EEE6" stroke="#0B0816" strokeWidth={5} />
      <circle cx={-40} cy={-6} r={18} fill="#2A2A2A" />
      <circle cx={30} cy={30} r={14} fill="#2A2A2A" />
      <path d="M -120 -110 L 120 110" stroke="#E8453A" strokeWidth={14} strokeLinecap="round" />
    </g>
  </g>
);

// ---------------------------------------------------------------- S13: you write your name with a pen; the kids gasp
export const S13: React.FC<ShotProps> = ({t, len}) => {
  const k = clamp((t - 4) / 40);
  const you = standAt(820, 1.25, GROUND + 80, { yaw: 0.4, tilt: 15, armR: { a: 70 + Math.sin(t / 2) * 6, b: -40 }, look: 0.6 });
  const h = handAt(you);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <MUS t={t + 400} />
      <rect x={760} y={GROUND - 120} width={520} height={30} rx={8} fill="#3A4656" stroke="#0B0816" strokeWidth={5} />
      <rect x={900} y={GROUND - 150} width={260} height={36} rx={4} fill="#F6F2EA" stroke="#0B0816" strokeWidth={4} />
      <path d={`M 920 ${GROUND - 128} q 20 -16 40 0 t 40 0 t 40 0 t 40 0 t 40 0`} stroke="#1A1A22" strokeWidth={4} fill="none" strokeDasharray={`${k * 260} 400`} />
      <Body look={YOU} pose={you} t={t} faces={[[0, 'smug']]} />
      <rect x={h.x - 4} y={h.y - 50} width={8} height={56} rx={4} fill="#3A6AC8" stroke="#0B0816" strokeWidth={3} transform={`rotate(20 ${h.x} ${h.y})`} />
      <Citizen look={KID} pose={standAt(1240, 0.8, GROUND + 60, { yaw: -0.5 })} t={t} faces={[[0, 'neutral'], [16, 'shock']]} />
      <Citizen look={KID2} pose={standAt(1400, 0.8, GROUND + 60, { yaw: -0.5 })} t={t} faces={[[0, 'neutral'], [20, 'shock']]} />
      <PopWord t={t} at={24} x={1350} y={360} text="MAGIC!" size={80} fill="#FFD23A" hold={len} />
    </g>
  );
};

// ---------------------------------------------------------------- S14: you tie your shoelaces; a small crowd films it
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const kneel: Pose = { ...basePose, x: 900, y: GROUND - 90, scale: 1, yaw: 0.5, tilt: 35, legL: { a: 80, b: 80 }, legR: { a: -10, b: 90 }, armL: { a: 60 + Math.sin(t / 2) * 10, b: -20 }, armR: { a: 55 - Math.sin(t / 2) * 10, b: -20 } };
  return (
    <g transform={camT(960, 620, kf(t, [[0, 1.5], [len, 1.65]]))}>
      <FutureCity t={t + 440} />
      {[0, 1, 2].map((i) => {
        const p = standAt(1200 + i * 170, 1, GROUND, { yaw: -0.5, armL: { a: 110, b: -60 } });
        const h = handAt(p, 'L');
        return (
          <g key={i}>
            <Citizen look={[F1, F2, F3][i]} pose={p} t={t} faces={[[0, 'shock']]} seed={i + 3} />
            <rect x={h.x - 50} y={h.y - 40} width={60} height={44} rx={6} fill="#4AE8FF" fillOpacity={0.5} stroke="#0B0816" strokeWidth={3} />
            {Math.floor(t / 8 + i) % 3 === 0 ? <circle cx={h.x - 20} cy={h.y - 18} r={30} fill="#FFFFFF" opacity={0.6} /> : null}
          </g>
        );
      })}
      <Body look={YOU} pose={kneel} t={t} faces={[[0, 'neutral']]} shadow={1} />
    </g>
  );
};

// ---------------------------------------------------------------- S15: loading bars: she bursts into tears
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const p = (t * 0.006) % 0.4;
  const tears = t > 60;
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <FutureCity t={t + 480} />
      <Body look={YOU} pose={standAt(800, 1, GROUND, { yaw: 0.5, tilt: 14, armR: { a: 100, b: -40 } })} t={t} faces={[[0, 'happy']]} words={W} />
      <Citizen look={KID} pose={standAt(1120, 0.7, GROUND, { yaw: -0.5 })} t={t} faces={[[0, 'neutral'], [40, 'worried'], [60, 'tired']]} />
      <Holo x={960} y={360} w={420} h={120} t={t} on={clamp((t - 20) / 8)}>
        <rect x={-170} y={-20} width={340} height={40} rx={20} fill="none" stroke="#FFFFFF" strokeWidth={4} />
        <rect x={-164} y={-14} width={328 * p} height={28} rx={14} fill="#4AE8FF" />
        <text x={0} y={-30} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#FFFFFF">LOADING...</text>
      </Holo>
      {tears
        ? [0, 1].map((i) => (
            <g key={i}>
              {Array.from({ length: 4 }).map((_, j) => {
                const k = ((t - 60) * 2 + j * 12) % 48;
                return <circle key={j} cx={1100 + i * 44 + (i ? 1 : -1) * k * 0.6} cy={GROUND - 210 + k} r={6} fill="#4AE8FF" />;
              })}
            </g>
          ))
        : null}
    </g>
  );
};

// ---------------------------------------------------------------- S16: tours: the glass rectangle was for cat videos
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1.15]]))}>
    <MUS t={t + 520} />
    <Body look={YOU} pose={standAt(600, 1.05, GROUND, { yaw: 0.5, armR: { a: 120, b: -20 } })} t={t} faces={[[0, 'happy']]} />
    <Holo x={980} y={440} w={360} h={420} t={t}>
      <rect x={-90} y={-170} width={180} height={340} rx={24} fill="#1A1A22" stroke="#FFFFFF" strokeWidth={4} />
      <g transform={`translate(0 ${Math.sin(t / 4) * 6})`}>
        <ellipse cx={0} cy={40} rx={60} ry={44} fill="#F2A06A" />
        <circle cx={0} cy={-20} r={40} fill="#F2A06A" />
        <path d="M -36 -48 L -26 -80 L -8 -54 M 36 -48 L 26 -80 L 8 -54" fill="#F2A06A" stroke="#F2A06A" strokeWidth={6} />
        <circle cx={-14} cy={-24} r={5} fill="#1A1A22" />
        <circle cx={14} cy={-24} r={5} fill="#1A1A22" />
      </g>
    </Holo>
    {[0, 1, 2, 3].map((i) => <Citizen key={i} look={[F1, F2, F3, CLERK][i]} pose={standAt(1280 + i * 150, 0.95, GROUND + 40 + (i % 2) * 30, { yaw: -0.6, tilt: Math.sin(t / 3 + i) * 4 })} t={t} faces={[[0, 'happy']]} seed={i + 4} />)}
    <PopWord t={t} at={60} x={1560} y={300} text="HA HA!" size={80} fill="#FFFFFF" hold={len} rot={6} />
  </g>
);

// ---------------------------------------------------------------- S17: credits pour in; rich by day three
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 580, kf(t, [[0, 1.5], [len, 1.6]]))}>
    <MUS t={t + 560} />
    <Body look={YOU} pose={standAt(820, 1.1, GROUND + 40, { yaw: 0.3, armL: { a: 160, b: -10 }, armR: { a: 160, b: -10 }, squash: Math.max(0, Math.sin(t / 4)) * -0.1 })} t={t} faces={[[0, 'happy']]} />
    <Citizen look={MO7} pose={standAt(1160, 1.1, GROUND + 40, { yaw: -0.4, armL: { a: 150, b: -20 } })} t={t} faces={[[0, 'happy']]} />
    {Array.from({ length: 18 }).map((_, i) => {
      const y = ((t * 6 + i * 70) % 900) - 200;
      const x = 500 + rnd(41, i) * 900;
      return <path key={i} transform={`translate(${x} ${y}) rotate(${t * 4 + i * 20})`} d="M -16 -10 L 0 -20 L 16 -10 L 16 10 L 0 20 L -16 10 Z" fill="#4AE8FF" stroke="#0B0816" strokeWidth={3} />;
    })}
    <PopWord t={t} at={30} x={960} y={250} text="RICH!" size={120} fill="#FFD23A" hold={len} />
  </g>
);

export const S18 = faceCU({ look: YOU, Bg: MUS, faces: [[0, 'smug'], [20, 'cool']], yaw: 0.25, zoom: [3.0, 3.3] });

// ---------------------------------------------------------------- S19: day four: ACHOO
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const sn = t > 40;
  return (
    <g>
      <Soft blur={16} dim={0.15}>
        <g transform={camT(960, 520, 1.5)}>
          <MUS t={t + 600} />
        </g>
      </Soft>
      <g transform={`${sn ? shk(t, 41, 12, 18) : ''} ${camT(960, 540, kf(t, [[0, 3.0], [len, 3.4]]))}`}>
        <Hero look={YOU} pose={{ ...basePose, x: 960, y: 700, yaw: 0.2, tilt: sn ? 10 : -8 * clamp((t - 20) / 20), headTilt: sn ? 10 : -10 * clamp((t - 20) / 20), expr: sn ? 'oops' : t > 20 ? 'worried' : 'neutral', blink: sn ? 1 : idleBlink(t, 5), talk: sn ? 1 : 0.3 * clamp((t - 20) / 20) }} shadow={0} />
      </g>
      <PopWord t={t} at={40} x={1300} y={340} text="ACHOO!" size={140} fill="#7FE07A" hold={len} rot={-6} />
    </g>
  );
};
