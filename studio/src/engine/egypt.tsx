import React from 'react';
import { clamp, lerp, rnd } from './anim';
import { Glow } from './light';
import { Moon, Stars } from './kit';
import { LEG_LEN } from './rig';
import { FONT } from './fonts';

// Ancient Egypt, about 2560 BC, for "What if you brought a drone to ancient Egypt?": Giza with the Great Pyramid
// half built, the Nile with a stone boat, the king's columned hall, the workers' camp at night, dunes, the site from
// the drone's camera straight down, and the props (the drone, its controller and batteries, the solar panel, a stone
// on its sledge, a camel, a goat, palms, boats, a throne, bread and beer). Flat fills, one darker side, a warm rim.
// Outdoor sets stand people on EG.feet (y 800): egyptHip(scale) gives the hip y.

export const EG = { feet: 800, horizon: 590 };
export const egyptHip = (scale = 1) => EG.feet - LEG_LEN * scale;
export type EgTod = 'day' | 'gold' | 'dusk' | 'dawn' | 'night';

const SKY: Record<EgTod, [string, string, string]> = {
  day: ['#4F8FD0', '#9CC8E8', '#F2DDB0'],
  gold: ['#4A6FB0', '#E8A86A', '#FFD48A'],
  dusk: ['#2A2456', '#B0506A', '#F49A5A'],
  dawn: ['#3A4A86', '#E08A9A', '#FFD0A0'],
  night: ['#070A1E', '#121A3E', '#26305A'],
};
const SAND: Record<EgTod, [string, string, string]> = {
  day: ['#E8C488', '#D9AE6E', '#C89858'],
  gold: ['#E8B070', '#D49A5A', '#B87E44'],
  dusk: ['#B87A5A', '#9A604A', '#7A4A3E'],
  dawn: ['#D8A07A', '#C08866', '#A06E54'],
  night: ['#3A3A52', '#2E2E46', '#24243A'],
};
export const sandOf = (tod: EgTod) => SAND[tod];

export const EgyptSky: React.FC<{ id: string; tod: EgTod; t: number; horizon?: number; sun?: [number, number] }> = ({ id, tod, t, horizon = EG.horizon, sun }) => {
  const [a, b, c] = SKY[tod];
  const sp = sun ?? (tod === 'day' ? [1500, 180] : tod === 'gold' ? [1560, 420] : tod === 'dusk' ? [380, horizon - 40] : tod === 'dawn' ? [1600, horizon - 30] : [1450, 200]);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sk`} x1="0" y1={-400} x2="0" y2={horizon + 40} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={a} />
          <stop offset="65%" stopColor={b} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
      </defs>
      <rect x={-1200} y={-1200} width={4320} height={horizon + 1240} fill={`url(#${id}sk)`} />
      {tod === 'night' ? (
        <g>
          <Stars seed={7} x0={-600} y0={-300} w={3100} h={horizon + 200} t={t} n={110} />
          <Moon x={sp[0]} y={sp[1]} r={46} />
        </g>
      ) : (
        <g>
          <circle cx={sp[0]} cy={sp[1]} r={tod === 'day' ? 300 : 420} fill="#FFF2C8" opacity={0.25} style={{ mixBlendMode: 'screen' }} />
          <circle cx={sp[0]} cy={sp[1]} r={tod === 'day' ? 62 : 90} fill={tod === 'day' ? '#FFF8E0' : '#FFE0A0'} />
        </g>
      )}
      {/* a few long thin clouds */}
      {tod !== 'night'
        ? [0, 1, 2].map((i) => (
            <ellipse key={i} cx={((200 + i * 700 + t * (0.3 + i * 0.1)) % 2800) - 400} cy={120 + i * 110} rx={240 - i * 40} ry={14} fill="#FFFFFF" opacity={tod === 'day' ? 0.35 : 0.22} />
          ))
        : null}
    </g>
  );
};

// ---------------------------------------------------------------- props
export const Palm: React.FC<{ x: number; y: number; s?: number; t?: number; c?: string; trunk?: string }> = ({ x, y, s = 1, t = 0, c = '#3E7A3A', trunk = '#7A5A3A' }) => {
  const sw = Math.sin(t / 30 + x) * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M -8 0 Q -14 -150 ${6 + sw * 0.5} -300 L ${18 + sw * 0.5} -300 Q 0 -150 8 0 Z`} fill={trunk} stroke="#2A1E16" strokeWidth={3} />
      {Array.from({ length: 6 }).map((_, k) => (
        <path key={k} d={`M -9 ${-40 - k * 44} L 9 ${-48 - k * 44}`} stroke="#2A1E16" strokeWidth={3} opacity={0.5} />
      ))}
      <g transform={`translate(${12 + sw * 0.5} -302) rotate(${sw})`}>
        {[-160, -120, -75, -30, 15, 55, 100].map((a, k) => (
          <path key={k} transform={`rotate(${a})`} d="M 0 0 Q 70 -30 150 20 Q 80 -6 0 10 Z" fill={k % 2 ? c : '#336A30'} stroke="#1E3A1C" strokeWidth={3} />
        ))}
        <circle cx={0} cy={6} r={10} fill="#5A3A20" />
      </g>
    </g>
  );
};

/** A dressed limestone block in three-quarter view, x y the bottom-front centre. */
export const Block: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#E2C890' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -90 0 L 90 0 L 90 -100 L -90 -100 Z" fill={c} stroke="#3A2A1A" strokeWidth={4} />
    <path d="M -90 -100 L -50 -130 L 130 -130 L 90 -100 Z" fill="#F2DCA8" stroke="#3A2A1A" strokeWidth={4} strokeLinejoin="round" />
    <path d="M 90 0 L 130 -30 L 130 -130 L 90 -100 Z" fill="#B8955E" stroke="#3A2A1A" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -60 -40 l 30 -6 M 20 -70 l 40 4" stroke="#3A2A1A" strokeWidth={2} opacity={0.3} />
  </g>
);

/** A block on a wooden sledge with ropes running forward to (rx, ry) and a water jar man pouring in front. */
export const Sledge: React.FC<{ x: number; y: number; s?: number; rope?: [number, number]; t?: number }> = ({ x, y, s = 1, rope, t = 0 }) => (
  <g>
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -130 0 L 140 0 Q 175 0 180 -26 L -130 -26 Z" fill="#8A5A34" stroke="#2A1A10" strokeWidth={4} />
      <path d="M -120 -26 L -120 -40 M 120 -26 L 120 -40" stroke="#2A1A10" strokeWidth={6} />
      <Block x={0} y={-26} s={1} />
      <path d="M -100 -60 Q 0 -40 100 -60" stroke="#C8A060" strokeWidth={6} fill="none" />
      {/* wet sand in front of the runners */}
      <ellipse cx={230} cy={4} rx={60} ry={8} fill="#8A6A44" opacity={0.6} />
    </g>
    {rope ? <path d={`M ${x + 170 * s} ${y - 20 * s} Q ${(x + 170 * s + rope[0]) / 2} ${(y + rope[1]) / 2 + 20 + Math.sin(t / 6) * 3} ${rope[0]} ${rope[1]}`} stroke="#C8A060" strokeWidth={6 * s} fill="none" /> : null}
  </g>
);

/** A tiny hauler for distant crowds: a dark stick figure leaning on a rope, legs stepping with t. */
export const TinyWorker: React.FC<{ x: number; y: number; s?: number; t: number; lean?: number; seed?: number; c?: string; still?: boolean; arms?: 'up' | 'rope' }> = ({ x, y, s = 1, t, lean = 18, seed = 0, c = '#F2EAD8', still, arms = 'rope' }) => {
  const ph = still ? 0 : Math.sin(t / 4 + seed * 1.7);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <g transform={`rotate(${lean})`}>
        <path d={`M 0 -28 L ${-6 * ph} 0 M 0 -28 L ${6 * ph} 0`} stroke="#1A1620" strokeWidth={5} strokeLinecap="round" />
        <path d="M -7 -44 L 7 -44 L 8 -24 L -8 -24 Z" fill={c} />
        <path d="M 0 -44 L 0 -28" stroke="#1A1620" strokeWidth={6} />
        {arms === 'up' ? <path d={`M 0 -42 L -10 ${-60 - ph * 3} M 0 -42 L 10 ${-60 + ph * 3}`} stroke="#1A1620" strokeWidth={4} strokeLinecap="round" /> : <path d="M 0 -42 L 14 -36" stroke="#1A1620" strokeWidth={4} strokeLinecap="round" />}
        <circle cx={0} cy={-52} r={8} fill="#1A1620" />
      </g>
    </g>
  );
};

/** The Great Pyramid under construction, side-on: `build` 0..1 of its height, a ramp up the near face, haulers on it. */
export const Pyramid: React.FC<{ x: number; y: number; w?: number; build?: number; t: number; tod?: EgTod; workers?: boolean; id?: string; scatter?: number }> = ({ x, y, w = 1000, build = 0.6, t, tod = 'day', workers = true, id = 'pyr', scatter = 0 }) => {
  const H = w * 0.636; // the real slope, about 51.8 degrees
  const h = H * build;
  const half = w / 2;
  const topHalf = half * (1 - build);
  const night = tod === 'night';
  const lit = night ? '#5A5A78' : tod === 'dusk' ? '#D08A62' : tod === 'gold' || tod === 'dawn' ? '#F0B878' : '#F0D49A';
  const shade = night ? '#3A3A56' : tod === 'dusk' ? '#8A5048' : tod === 'gold' || tod === 'dawn' ? '#B87A50' : '#C49A62';
  const courses = Math.floor(h / 16);
  return (
    <g>
      <defs>
        <clipPath id={`${id}clip`}>
          <path d={`M ${x - half} ${y} L ${x - topHalf} ${y - h} L ${x + topHalf} ${y - h} L ${x + half} ${y} Z`} />
        </clipPath>
      </defs>
      {/* the faint outline of what it will be */}
      <path d={`M ${x - half} ${y} L ${x} ${y - H} L ${x + half} ${y} Z`} fill="none" stroke={night ? '#8A8AB0' : '#FFFFFF'} strokeOpacity={0.12} strokeWidth={3} strokeDasharray="10 12" />
      <path d={`M ${x - half} ${y} L ${x - topHalf} ${y - h} L ${x + topHalf * 0.15} ${y - h} L ${x + half * 0.15} ${y} Z`} fill={lit} />
      <path d={`M ${x + half * 0.15} ${y} L ${x + topHalf * 0.15} ${y - h} L ${x + topHalf} ${y - h} L ${x + half} ${y} Z`} fill={shade} />
      <g clipPath={`url(#${id}clip)`}>
        {Array.from({ length: courses }).map((_, k) => (
          <path key={k} d={`M ${x - half} ${y - k * 16} H ${x + half}`} stroke="#3A2A1A" strokeOpacity={0.18} strokeWidth={2} />
        ))}
        {Array.from({ length: courses * 3 }).map((_, k) => {
          const row = k % courses;
          return <path key={`v${k}`} d={`M ${x - half + rnd(3, k) * w} ${y - row * 16} v -16`} stroke="#3A2A1A" strokeOpacity={0.14} strokeWidth={2} />;
        })}
      </g>
      <path d={`M ${x - half} ${y} L ${x - topHalf} ${y - h} L ${x + topHalf} ${y - h} L ${x + half} ${y} Z`} fill="none" stroke="#2A1E14" strokeWidth={4} strokeLinejoin="round" />
      {/* the flat working top, a few blocks and a hoisting frame */}
      <path d={`M ${x - topHalf} ${y - h} L ${x - topHalf + 30} ${y - h - 14} L ${x + topHalf - 30} ${y - h - 14} L ${x + topHalf} ${y - h} Z`} fill={lit} stroke="#2A1E14" strokeWidth={3} />
      {[-0.5, -0.1, 0.35].map((u, k) => (
        <rect key={k} x={x + u * topHalf} y={y - h - 30} width={26} height={18} fill={lit} stroke="#2A1E14" strokeWidth={2} />
      ))}
      {/* the ramp: a mud-brick band climbing the near face from the left */}
      <path d={`M ${x - half - 260} ${y} L ${x - topHalf - 10} ${y - h + 6} L ${x - topHalf + 40} ${y - h + 6} L ${x - half - 140} ${y} Z`} fill={night ? '#4A4058' : '#A87A52'} stroke="#2A1E14" strokeWidth={3} strokeLinejoin="round" />
      {workers
        ? Array.from({ length: 14 }).map((_, i) => {
            const p = ((i / 14 + t * 0.0012) % 1);
            const sx = lerp(x - half - 220, x - topHalf + 10, p);
            const sy = lerp(y - 4, y - h + 4, p);
            const run = scatter * (rnd(9, i) - 0.5) * 300;
            return <TinyWorker key={i} x={sx + run} y={sy + scatter * rnd(4, i) * 40} s={0.55} t={t} seed={i} lean={scatter > 0 ? 0 : 22} arms={scatter > 0 ? 'up' : 'rope'} />;
          })
        : null}
      {night ? null : <Glow x={x - half * 0.4} y={y - h * 0.5} r={w * 0.5} o={0.12} />}
    </g>
  );
};

export const Camel: React.FC<{ x: number; y: number; s?: number; t?: number; run?: boolean; flip?: boolean }> = ({ x, y, s = 1, t = 0, run = false, flip = false }) => {
  const ph = run ? Math.sin(t / 2.2) : Math.sin(t / 10) * 0.1;
  const leg = (lx: number, k: number) => <path d={`M ${lx} -150 L ${lx + ph * 26 * k} -70 L ${lx + ph * 34 * k} 0`} stroke="#6A4A2A" strokeWidth={14} strokeLinecap="round" fill="none" />;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {leg(-70, -1)}
      {leg(60, 1)}
      <path d="M -110 -150 Q -120 -200 -60 -210 Q -30 -280 10 -210 Q 40 -250 80 -200 Q 120 -190 110 -150 Q 0 -126 -110 -150 Z" fill="#C8955A" stroke="#3A2414" strokeWidth={4} strokeLinejoin="round" />
      <path d={`M 100 -180 Q 150 -${200 + ph * 10} 150 -260 Q 156 -290 190 -284 L 206 -266 Q 186 -262 180 -250 Q 176 -200 120 -150 Z`} fill="#C8955A" stroke="#3A2414" strokeWidth={4} strokeLinejoin="round" />
      <circle cx={186} cy={-274} r={4} fill="#1A1010" />
      {leg(-40, 1)}
      {leg(90, -1)}
      <path d="M -112 -160 q -24 10 -28 40" stroke="#3A2414" strokeWidth={5} fill="none" />
    </g>
  );
};

export const Goat: React.FC<{ x: number; y: number; s?: number; t?: number; chew?: boolean; flip?: boolean }> = ({ x, y, s = 1, t = 0, chew = false, flip = false }) => {
  const j = chew ? Math.abs(Math.sin(t / 3)) * 4 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {[-40, -24, 30, 44].map((lx, k) => (
        <path key={k} d={`M ${lx} -40 L ${lx + (k % 2 ? 2 : -2)} 0`} stroke="#3A3030" strokeWidth={8} strokeLinecap="round" />
      ))}
      <ellipse cx={0} cy={-56} rx={62} ry={30} fill="#E8E0D0" stroke="#2A2020" strokeWidth={4} />
      <path d="M -60 -66 q -12 -10 -14 -2" stroke="#2A2020" strokeWidth={4} fill="none" />
      <g transform={`translate(58 -80)`}>
        <path d="M -6 10 L 0 -24 L 30 -30 L 46 -8 Q 40 6 20 4 Z" fill="#E8E0D0" stroke="#2A2020" strokeWidth={4} strokeLinejoin="round" />
        <path d="M 4 -24 q -6 -22 -24 -24 M 14 -26 q 0 -20 -14 -28" stroke="#6A5A4A" strokeWidth={5} fill="none" strokeLinecap="round" />
        <circle cx={26} cy={-18} r={3.5} fill="#1A1010" />
        <path d={`M 34 ${2 + j} q 4 10 -4 14`} stroke="#E8E0D0" strokeWidth={5} fill="none" />
      </g>
    </g>
  );
};

export const Campfire: React.FC<{ x: number; y: number; s?: number; t: number; o?: number }> = ({ x, y, s = 1, t, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <Glow x={0} y={-40} r={380} o={0.55} />
    <path d="M -60 0 L 60 -16 M -56 -16 L 58 0" stroke="#4A2E1A" strokeWidth={14} strokeLinecap="round" />
    {[0, 1, 2].map((k) => {
      const fl = Math.sin(t / 3 + k * 2) * 8;
      return <path key={k} d={`M ${-30 + k * 30} -6 Q ${-50 + k * 30} ${-50 - fl} ${-10 + k * 20 + fl * 0.4} ${-100 - k * 10 - fl} Q ${10 + k * 20} ${-50} ${20 + k * 20} -6 Z`} fill={k === 1 ? '#FFD45A' : '#FF8A3D'} opacity={0.95} />;
    })}
    <path d={`M -10 -6 Q -16 -36 0 ${-60 - Math.sin(t / 2) * 6} Q 14 -36 10 -6 Z`} fill="#FFF2B0" />
  </g>
);

export const Torch: React.FC<{ x: number; y: number; s?: number; t: number; rot?: number }> = ({ x, y, s = 1, t, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <Glow x={0} y={-80} r={200} o={0.5} />
    <path d="M -6 0 L -9 -70 L 9 -70 L 6 0 Z" fill="#6A4A2A" stroke="#2A1A10" strokeWidth={3} />
    <path d={`M -14 -70 Q -20 -100 0 ${-130 - Math.sin(t / 2.5) * 8} Q 20 -100 14 -70 Z`} fill="#FF8A3D" />
    <path d={`M -6 -72 Q -8 -92 0 ${-108 - Math.sin(t / 2) * 5} Q 8 -92 6 -72 Z`} fill="#FFE07A" />
  </g>
);

/** A cargo boat of the Old Kingdom: a long hull with raised ends, a mast and a square sail, a stone block aboard. */
export const NileBoat: React.FC<{ x: number; y: number; s?: number; t?: number; sail?: boolean; cargo?: boolean; tilt?: number; flip?: boolean; gold?: boolean }> = ({ x, y, s = 1, t = 0, sail = true, cargo = true, tilt = 0, flip = false, gold = false }) => {
  const bob = Math.sin(t / 14) * 3;
  return (
    <g transform={`translate(${x} ${y + bob}) rotate(${tilt + Math.sin(t / 18) * 0.8}) scale(${flip ? -s : s} ${s})`}>
      {sail ? (
        <g>
          <path d="M 0 -30 L 0 -330" stroke="#5A3A20" strokeWidth={10} />
          <path d="M -110 -310 L 110 -310 Q 120 -200 110 -110 L -110 -110 Q -120 -200 -110 -310 Z" fill={gold ? "#C8302A" : "#EDE2C8"} stroke="#3A2A1A" strokeWidth={4} />
          <path d="M -116 -312 L 116 -312 M -114 -108 L 114 -108" stroke="#5A3A20" strokeWidth={8} />
        </g>
      ) : null}
      {cargo ? <Block x={-20} y={-30} s={0.7} /> : null}
      {gold ? (
        <g>
          <rect x={-90} y={-110} width={180} height={70} fill="#2A5AA8" stroke="#2A1A10" strokeWidth={4} />
          {[0, 1, 2, 3].map((k) => <rect key={k} x={-80 + k * 44} y={-100} width={24} height={50} fill="#E8B83A" />)}
          <Glow x={0} y={-60} r={260} o={0.4} />
        </g>
      ) : null}
      <path d="M -260 -70 Q -230 -20 -150 0 L 160 0 Q 230 -20 270 -80 Q 200 -40 140 -40 L -140 -40 Q -200 -40 -260 -70 Z" fill={gold ? "#E8B83A" : "#9A6A3A"} stroke="#2A1A10" strokeWidth={4} strokeLinejoin="round" />
      <path d="M -200 -30 L 200 -30" stroke="#2A1A10" strokeWidth={3} opacity={0.4} />
      <path d="M 200 -50 L 240 30" stroke="#5A3A20" strokeWidth={8} />
      <path d="M 232 20 l 20 30 l 10 -8 Z" fill="#5A3A20" />
    </g>
  );
};

export const Spear: React.FC<{ x: number; y: number; rot?: number; s?: number }> = ({ x, y, rot = 0, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -160 0 L 140 0" stroke="#7A5A34" strokeWidth={8} strokeLinecap="round" />
    <path d="M 140 -12 L 190 0 L 140 12 Z" fill="#C8B8A0" stroke="#2A2020" strokeWidth={3} />
  </g>
);

/** Bread loaves and a beer jar: the daily ration. */
export const Rations: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 70 0 Q 54 -40 70 -110 Q 90 -140 110 -140 Q 130 -140 150 -110 Q 166 -40 150 0 Z" fill="#B8603A" stroke="#2A1610" strokeWidth={4} />
    <ellipse cx={110} cy={-140} rx={26} ry={8} fill="#5A2A1A" />
    <path d="M 74 -80 Q 110 -70 146 -80" stroke="#2A1610" strokeWidth={3} opacity={0.4} fill="none" />
    {[[-80, 0], [-10, 0], [-46, -40]].map(([bx, by], k) => (
      <g key={k} transform={`translate(${bx} ${by})`}>
        <path d="M -40 0 Q -44 -50 0 -60 Q 44 -50 40 0 Z" fill="#D89A50" stroke="#3A2414" strokeWidth={4} />
        <path d="M -16 -40 l 10 10 M 4 -46 l 10 10" stroke="#8A5A2A" strokeWidth={4} strokeLinecap="round" />
      </g>
    ))}
  </g>
);

/** A papyrus logbook, unrolled, with columns of signs (marks, not real text). */
export const Papyrus: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-220} y={-140} width={440} height={280} fill="#E8D6A0" stroke="#5A4020" strokeWidth={4} />
    {Array.from({ length: 14 }).map((_, k) => (
      <path key={k} d={`M ${-220 + k * 32} -140 v 280`} stroke="#B8A070" strokeWidth={2} opacity={0.5} />
    ))}
    {Array.from({ length: 9 }).map((_, c) =>
      Array.from({ length: 6 }).map((__, r) => {
        const k = rnd(c + 3, r);
        const cx = -180 + c * 44;
        const cy = -100 + r * 40;
        return k < 0.33 ? <circle key={`${c}${r}`} cx={cx} cy={cy} r={8} fill="none" stroke="#2A1A10" strokeWidth={4} /> : k < 0.66 ? <path key={`${c}${r}`} d={`M ${cx - 10} ${cy + 8} L ${cx} ${cy - 10} L ${cx + 10} ${cy + 8}`} stroke="#2A1A10" strokeWidth={4} fill="none" /> : <path key={`${c}${r}`} d={`M ${cx - 12} ${cy} H ${cx + 12} M ${cx} ${cy - 10} V ${cy + 10}`} stroke={r === 0 ? '#A8302A' : '#2A1A10'} strokeWidth={4} />;
      }),
    )}
    <rect x={-240} y={-150} width={26} height={300} rx={12} fill="#C8B080" stroke="#5A4020" strokeWidth={4} />
    <rect x={214} y={-150} width={26} height={300} rx={12} fill="#C8B080" stroke="#5A4020" strokeWidth={4} />
  </g>
);

// ---------------------------------------------------------------- the drone and its kit
/**
 * A folding camera quadcopter in three-quarter view from slightly above: grey body, four arms, motors, the camera on
 * its gimbal at the front, a green and a red light. `on` spins the props into blurred discs; `tilt` banks it.
 */
export const Drone: React.FC<{ x: number; y: number; s?: number; t?: number; on?: boolean; tilt?: number; folded?: boolean; lights?: boolean; dust?: boolean }> = ({ x, y, s = 1, t = 0, on = true, tilt = 0, folded = false, lights = true, dust = false }) => {
  const arms = folded
    ? [[-70, -6], [70, -6], [-74, 16], [74, 16]]
    : [[-150, -50], [150, -50], [-170, 40], [170, 40]];
  const hover = on ? Math.sin(t / 5) * 4 : 0;
  const blink = Math.floor(t / 8) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y + hover}) rotate(${tilt}) scale(${s})`}>
      {dust ? <ellipse cx={0} cy={260} rx={220 + Math.sin(t) * 10} ry={30} fill="#E8D0A0" opacity={0.35} /> : null}
      {arms.map(([ax, ay], k) => (
        <g key={k}>
          <path d={`M ${ax * 0.25} ${ay * 0.3} L ${ax} ${ay}`} stroke="#1A1C22" strokeWidth={22} strokeLinecap="round" />
          <path d={`M ${ax * 0.25} ${ay * 0.3} L ${ax} ${ay}`} stroke="#4A4E58" strokeWidth={14} strokeLinecap="round" />
          <ellipse cx={ax} cy={ay - 6} rx={20} ry={14} fill="#2A2C34" stroke="#121318" strokeWidth={3} />
          {folded ? null : on ? (
            <g>
              <ellipse cx={ax} cy={ay - 16} rx={96} ry={22} fill="#C8D0E0" opacity={0.28} />
              <ellipse cx={ax} cy={ay - 16} rx={96} ry={22} fill="none" stroke="#E8EEF8" strokeOpacity={0.35} strokeWidth={2} />
              <path transform={`rotate(${(t * 47 + k * 40) % 360} ${ax} ${ay - 16})`} d={`M ${ax - 90} ${ay - 16} L ${ax + 90} ${ay - 16}`} stroke="#1A1C22" strokeOpacity={0.25} strokeWidth={6} />
            </g>
          ) : (
            <path d={`M ${ax - 70} ${ay - 18} L ${ax + 70} ${ay - 14}`} stroke="#1A1C22" strokeWidth={8} strokeLinecap="round" />
          )}
        </g>
      ))}
      <path d="M -80 -20 Q -70 -60 0 -62 Q 70 -60 80 -20 L 70 30 Q 0 46 -70 30 Z" fill="#5A5E6A" stroke="#121318" strokeWidth={4} strokeLinejoin="round" />
      <path d="M -60 -30 Q 0 -54 60 -30" stroke="#8A90A0" strokeWidth={6} fill="none" strokeLinecap="round" />
      <path d="M -70 20 Q 0 34 70 20" stroke="#2A2C34" strokeWidth={6} fill="none" />
      {/* the camera on its gimbal, at the front */}
      <rect x={-26} y={30} width={52} height={36} rx={10} fill="#2A2C34" stroke="#121318" strokeWidth={3} />
      <circle cx={0} cy={48} r={13} fill="#121318" />
      <circle cx={-4} cy={44} r={5} fill="#6A8AD8" />
      {lights ? (
        <g>
          <circle cx={-64} cy={6} r={6} fill={blink ? '#5BE08A' : '#2A5A3A'} />
          <circle cx={64} cy={6} r={6} fill={blink ? '#FF4A3A' : '#5A2A2A'} />
          {blink ? <Glow x={-64} y={6} r={30} kind="cool" o={0.6} /> : null}
        </g>
      ) : null}
    </g>
  );
};

/** What the drone's camera sees, drawn into the controller screen or full frame. */
export type DroneView = (t: number) => React.ReactNode;

/**
 * The remote controller, from the pilot's side: two sticks, the phone-sized screen clipped on top showing `view`
 * (any SVG in a 640 x 360 box), the camera HUD over it. x y is the centre of the controller body.
 */
export const Controller: React.FC<{ x: number; y: number; s?: number; t?: number; view?: DroneView; battery?: number; warn?: string; sticks?: [number, number, number, number]; id?: string; hud?: boolean }> = ({ x, y, s = 1, t = 0, view, battery = 91, warn, sticks = [0, 0, 0, 0], id = 'ctl', hud = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {/* the screen on its clamp */}
    <rect x={-360} y={-470} width={720} height={420} rx={36} fill="#16171C" stroke="#08080A" strokeWidth={6} />
    <defs>
      <clipPath id={`${id}scr`}>
        <rect x={-320} y={-440} width={640} height={360} rx={14} />
      </clipPath>
    </defs>
    <g clipPath={`url(#${id}scr)`}>
      <rect x={-320} y={-440} width={640} height={360} fill="#22262E" />
      <g transform="translate(-320 -440) scale(0.3333)">{view ? view(t) : null}</g>
      {hud ? <g transform="translate(-320 -440) scale(0.3333)"><DroneHud t={t} battery={battery} warn={warn} compact /></g> : null}
    </g>
    <rect x={-320} y={-440} width={640} height={360} rx={14} fill="none" stroke="#000" strokeWidth={4} />
    <path d="M -40 -50 L -30 -10 L 30 -10 L 40 -50 Z" fill="#2A2C34" />
    {/* the body */}
    <path d="M -300 20 Q -320 -20 -250 -30 L 250 -30 Q 320 -20 300 20 L 280 150 Q 270 200 210 190 L 140 150 L -140 150 L -210 190 Q -270 200 -280 150 Z" fill="#3A3D46" stroke="#101116" strokeWidth={5} strokeLinejoin="round" />
    {[-1, 1].map((sd, k) => (
      <g key={sd}>
        <circle cx={sd * 170} cy={60} r={50} fill="#22242A" stroke="#101116" strokeWidth={4} />
        <circle cx={sd * 170 + sticks[k * 2] * 26} cy={60 + sticks[k * 2 + 1] * 26} r={24} fill="#5A5E6A" stroke="#101116" strokeWidth={4} />
      </g>
    ))}
    <circle cx={0} cy={50} r={14} fill="#22242A" stroke="#101116" strokeWidth={3} />
    <path d="M -6 46 l 12 4 l -12 4 Z" fill="#E8E8F0" />
    <circle cx={-60} cy={110} r={8} fill={battery > 20 ? '#5BE08A' : '#FF4A3A'} />
  </g>
);

/** The camera overlay: corner brackets, REC, battery, height and distance, signal; `warn` puts up a red banner. */
export const DroneHud: React.FC<{ t: number; battery?: number; alt?: number; dist?: number; warn?: string; compact?: boolean; signal?: number; rec?: boolean }> = ({ t, battery = 91, alt = 120, dist = 340, warn, compact = false, signal = 4, rec = true }) => {
  const low = battery <= 20;
  const fs = compact ? 46 : 34;
  return (
    <g fontFamily={FONT.ui}>
      {[[60, 60, 1, 1], [1860, 60, -1, 1], [60, 1020, 1, -1], [1860, 1020, -1, -1]].map(([x, y, a, b], k) => (
        <path key={k} d={`M ${x} ${y + b * 70} V ${y} H ${x + a * 70}`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.85} />
      ))}
      <path d="M 930 540 H 990 M 960 510 V 570" stroke="#FFFFFF" strokeWidth={3} opacity={0.6} />
      <rect x={0} y={0} width={1920} height={compact ? 110 : 90} fill="#000" opacity={0.35} />
      {rec ? (
        <g opacity={Math.floor(t / 15) % 2 ? 1 : 0.35}>
          <circle cx={120} cy={compact ? 56 : 46} r={14} fill="#FF3A2A" />
          <text x={146} y={(compact ? 56 : 46) + fs * 0.35} fontSize={fs} fill="#FFFFFF">REC</text>
        </g>
      ) : null}
      <text x={compact ? 420 : 380} y={(compact ? 56 : 46) + fs * 0.35} fontSize={fs} fill="#FFFFFF">{`H ${Math.round(alt)} m   D ${Math.round(dist)} m`}</text>
      {/* signal bars */}
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={1440 + k * 22} y={(compact ? 76 : 62) - k * 12} width={14} height={14 + k * 12} fill={k < signal ? '#FFFFFF' : '#FFFFFF'} opacity={k < signal ? 0.95 : 0.25} />
      ))}
      {/* battery */}
      <g transform={`translate(1580 ${compact ? 30 : 22})`}>
        <rect x={0} y={0} width={120} height={50} rx={8} fill="none" stroke={low ? '#FF4A3A' : '#FFFFFF'} strokeWidth={5} />
        <rect x={120} y={14} width={10} height={22} fill={low ? '#FF4A3A' : '#FFFFFF'} />
        <rect x={8} y={8} width={104 * clamp(battery / 100)} height={34} rx={4} fill={low ? '#FF4A3A' : battery < 50 ? '#FFC23A' : '#5BE08A'} />
        <text x={150} y={38} fontSize={fs} fill={low ? '#FF6A5A' : '#FFFFFF'}>{`${Math.round(battery)}%`}</text>
      </g>
      {warn ? (
        <g opacity={Math.floor(t / 8) % 2 ? 1 : 0.75}>
          <rect x={360} y={compact ? 860 : 880} width={1200} height={compact ? 130 : 100} rx={20} fill="#C8201A" opacity={0.92} />
          <text x={960} y={compact ? 945 : 948} textAnchor="middle" fontSize={compact ? 66 : 54} fontWeight={700} fill="#FFFFFF">{`⚠ ${warn}`}</text>
        </g>
      ) : null}
    </g>
  );
};

export const DroneBattery: React.FC<{ x: number; y: number; s?: number; level?: number; rot?: number }> = ({ x, y, s = 1, level = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-40} width={140} height={80} rx={14} fill="#4A4E58" stroke="#101116" strokeWidth={4} />
    <rect x={-70} y={-40} width={140} height={20} rx={10} fill="#6A6E7A" />
    {[0, 1, 2, 3].map((k) => (
      <rect key={k} x={-44 + k * 24} y={14} width={16} height={10} rx={3} fill={k < Math.ceil(level * 4) ? '#5BE08A' : '#22242A'} />
    ))}
  </g>
);

/** The folding solar panel: four cells in a fabric frame; `crack` draws a shattered cell. */
export const SolarPanel: React.FC<{ x: number; y: number; s?: number; crack?: number; sun?: number; rot?: number }> = ({ x, y, s = 1, crack = 0, sun = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-330} y={-110} width={660} height={220} rx={12} fill="#2A2A30" stroke="#101014" strokeWidth={5} />
    {[0, 1, 2, 3].map((k) => (
      <g key={k}>
        <rect x={-316 + k * 160} y={-96} width={150} height={192} fill="#1E3A7A" stroke="#0A1430" strokeWidth={3} />
        {[1, 2, 3].map((r) => <path key={r} d={`M ${-316 + k * 160} ${-96 + r * 48} h 150`} stroke="#5A7AC8" strokeWidth={2} opacity={0.6} />)}
        {[1, 2].map((r) => <path key={`c${r}`} d={`M ${-316 + k * 160 + r * 50} -96 v 192`} stroke="#5A7AC8" strokeWidth={2} opacity={0.6} />)}
        <path d={`M ${-306 + k * 160} -86 L ${-226 + k * 160} -86 L ${-296 + k * 160} 0 Z`} fill="#FFFFFF" opacity={0.08 + sun * 0.18} />
      </g>
    ))}
    {crack > 0 ? (
      <g opacity={clamp(crack * 3)} stroke="#E8F0FF" strokeWidth={4} fill="none" strokeLinecap="round">
        {Array.from({ length: 9 }).map((_, k) => {
          const a = (k / 9) * Math.PI * 2 + 0.3;
          const len = 40 + rnd(5, k) * 110 * clamp(crack);
          return <path key={k} d={`M -80 0 L ${-80 + Math.cos(a) * len * 0.5} ${Math.sin(a) * len * 0.5 + 6} L ${-80 + Math.cos(a) * len} ${Math.sin(a) * len}`} />;
        })}
        <circle cx={-80} cy={0} r={14} fill="#0A1430" />
      </g>
    ) : null}
  </g>
);

/** The hard case, open, with the drone folded in its foam. */
export const DroneCase: React.FC<{ x: number; y: number; s?: number; open?: number; t?: number }> = ({ x, y, s = 1, open = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-300} y={-150} width={600} height={300} rx={30} fill="#2A2C32" stroke="#0E0F12" strokeWidth={6} />
    <rect x={-270} y={-120} width={540} height={240} rx={16} fill="#3A3D46" />
    {open > 0.5 ? <Drone x={-40} y={0} s={1.1} folded on={false} lights={false} t={t} /> : null}
    <DroneBattery x={190} y={-50} s={0.8} rot={90} />
    <DroneBattery x={190} y={60} s={0.8} rot={90} />
    <rect x={-300} y={-150 - 300 * open} width={600} height={300 * open} rx={30} fill="#33363E" stroke="#0E0F12" strokeWidth={6} opacity={open > 0.02 ? 1 : 0} />
  </g>
);

// ---------------------------------------------------------------- sets
/**
 * Giza from the desert floor: the Great Pyramid half built in the distance with its ramp and haulers, the green Nile
 * strip and palms on the left horizon, workers' huts, scattered blocks, a sledge with a team in the middle ground.
 * Feet on EG.feet. `scatter` 0..1 sends the distant haulers running (the cold open).
 */
export const Giza: React.FC<{ t: number; id?: string; tod?: EgTod; build?: number; pyrX?: number; pyrW?: number; workers?: boolean; sledge?: boolean; scatter?: number; fires?: boolean }> = ({ t, id = 'giza', tod = 'day', build = 0.62, pyrX = 1180, pyrW = 980, workers = true, sledge = true, scatter = 0, fires }) => {
  const [s0, s1, s2] = SAND[tod];
  const night = tod === 'night';
  return (
    <g>
      <EgyptSky id={`${id}s`} tod={tod} t={t} />
      {/* far horizon: the Nile valley, a green band and palms */}
      <path d={`M -1200 ${EG.horizon} L -1200 ${EG.horizon - 20} Q 0 ${EG.horizon - 40} 600 ${EG.horizon - 14} L 900 ${EG.horizon} Z`} fill={night ? '#1E2A34' : '#5A8A4A'} opacity={0.9} />
      {[-300, -180, -60, 80, 210, 350, 480].map((px, k) => (
        <Palm key={k} x={px} y={EG.horizon - 4} s={0.22 + rnd(2, k) * 0.08} t={t} c={night ? '#1E2E2A' : '#3E6A3A'} trunk={night ? '#2A2630' : '#6A5038'} />
      ))}
      <rect x={-1200} y={EG.horizon} width={4320} height={1400} fill={s0} />
      <Pyramid x={pyrX} y={EG.horizon + 20} w={pyrW} build={build} t={t} tod={tod} workers={workers} id={`${id}p`} scatter={scatter} />
      {/* huts of the workers' town, low mud brick */}
      {[0, 1, 2, 3, 4].map((k) => (
        <g key={k} transform={`translate(${-80 + k * 120} ${EG.horizon + 60})`}>
          <rect x={0} y={-40} width={100} height={40} fill={night ? '#3A3448' : '#B88A5A'} stroke="#2A1E14" strokeWidth={3} />
          <rect x={36} y={-24} width={22} height={24} fill="#2A1E14" />
          {night && (fires ?? true) && k % 2 === 0 ? <Glow x={50} y={-10} r={60} o={0.5} /> : null}
        </g>
      ))}
      {/* sand: bands of shade toward camera, ripples */}
      <path d={`M -1200 ${EG.horizon + 90} Q 400 ${EG.horizon + 60} 3100 ${EG.horizon + 110} L 3100 2000 L -1200 2000 Z`} fill={s1} />
      <path d={`M -1200 ${EG.feet - 40} Q 600 ${EG.feet - 80} 3100 ${EG.feet - 30} L 3100 2000 L -1200 2000 Z`} fill={s2} />
      {Array.from({ length: 18 }).map((_, k) => (
        <path key={k} d={`M ${-400 + rnd(11, k) * 2800} ${EG.feet - 30 + rnd(12, k) * 300} q 60 -10 120 0`} stroke="#000" strokeOpacity={0.1} strokeWidth={4} fill="none" />
      ))}
      {[[-200, EG.horizon + 150, 0.4], [1900, EG.horizon + 130, 0.35], [2100, EG.horizon + 170, 0.45]].map(([bx, by, bs], k) => (
        <Block key={k} x={bx} y={by} s={bs} />
      ))}
      {sledge ? (
        <g>
          <Sledge x={-60} y={EG.horizon + 200} s={0.42} rope={[260, EG.horizon + 190]} t={t} />
          {Array.from({ length: 6 }).map((_, i) => (
            <TinyWorker key={i} x={130 + i * 26 + (t * 0.25 % 26)} y={EG.horizon + 200} s={0.95} t={t} seed={i + 30} lean={20} />
          ))}
        </g>
      ) : null}
      {night ? <rect x={-1200} y={-1200} width={4320} height={3400} fill="#0A0C26" opacity={0.28} /> : null}
    </g>
  );
};

/** The bank of the Nile: far bank with palms and fields, the water with ripples, a stone boat sailing, papyrus reeds. */
export const NileBank: React.FC<{ t: number; id?: string; tod?: EgTod; boat?: boolean; boatX?: number; stuck?: boolean; gold?: boolean }> = ({ t, id = 'nile', tod = 'day', boat = true, boatX, stuck = false, gold = false }) => {
  const [s0, , s2] = SAND[tod];
  const night = tod === 'night';
  const water = night ? '#1A2A4A' : tod === 'dusk' ? '#5A4A7A' : '#3A7AA8';
  return (
    <g>
      <EgyptSky id={`${id}s`} tod={tod} t={t} horizon={520} />
      <rect x={-1200} y={500} width={4320} height={60} fill={night ? '#1E2A2A' : '#5A8A3A'} />
      {Array.from({ length: 16 }).map((_, k) => (
        <Palm key={k} x={-600 + k * 200 + rnd(4, k) * 80} y={540} s={0.35 + rnd(5, k) * 0.1} t={t} c={night ? '#1E2E2A' : '#3A6A34'} />
      ))}
      <rect x={-1200} y={556} width={4320} height={260} fill={water} />
      {Array.from({ length: 30 }).map((_, k) => {
        const yy = 580 + rnd(6, k) * 220;
        const xx = ((rnd(7, k) * 3000 + t * 0.6) % 3200) - 600;
        return <path key={k} d={`M ${xx} ${yy} h ${40 + rnd(8, k) * 80}`} stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={4} strokeLinecap="round" />;
      })}
      {stuck ? <ellipse cx={(boatX ?? 980) + 30} cy={700} rx={340} ry={30} fill={s0} opacity={0.85} /> : null}
      {boat ? <NileBoat x={boatX ?? (stuck ? 980 : ((t * 1.2) % 2800) - 400)} y={stuck ? 694 : 700} s={0.9} t={stuck ? 0 : t} tilt={stuck ? -4 : 0} gold={gold} cargo={!gold} /> : null}
      <path d={`M -1200 ${EG.feet - 10} Q 600 ${EG.feet - 40} 3100 ${EG.feet - 6} L 3100 2000 L -1200 2000 Z`} fill={s2} />
      {Array.from({ length: 9 }).map((_, c) => {
        const cx = -500 + c * 340 + rnd(9, c) * 120;
        return (
          <g key={c}>
            {Array.from({ length: 7 }).map((__, k) => {
              const rx = cx + (k - 3) * 14;
              const hgt = 70 + rnd(c + 3, k) * 70;
              const sw = Math.sin(t / 20 + c + k) * 4 + (k - 3) * 6;
              return (
                <g key={k}>
                  <path d={`M ${rx} ${EG.feet - 4} Q ${rx + sw * 0.5} ${EG.feet - hgt / 2} ${rx + sw} ${EG.feet - hgt}`} stroke={night ? '#1E3A2A' : '#4A7A3A'} strokeWidth={5} fill="none" />
                  <path d={`M ${rx + sw} ${EG.feet - hgt} l -16 -22 l 16 5 l 16 -5 Z`} fill={night ? '#2A4A34' : '#6A9A4A'} />
                </g>
              );
            })}
          </g>
        );
      })}
      {night ? <rect x={-1200} y={-1200} width={4320} height={3400} fill="#0A0C26" opacity={0.3} /> : null}
    </g>
  );
};

/** Night camp by the site: mud-brick huts, a fire, the pyramid black against the stars. Fire at (FIRE.x, FIRE.y). */
export const FIRE = { x: 760, y: 830 };
export const Camp: React.FC<{ t: number; id?: string; fire?: boolean; dawn?: number }> = ({ t, id = 'camp', fire = true, dawn = 0 }) => (
  <g>
    <EgyptSky id={`${id}s`} tod="night" t={t} />
    {dawn > 0 ? <rect x={-1200} y={-1200} width={4320} height={1800} fill="#E8906A" opacity={dawn * 0.5} /> : null}
    <rect x={-1200} y={EG.horizon} width={4320} height={1400} fill="#2E2E46" />
    <Pyramid x={1300} y={EG.horizon + 20} w={900} build={0.62} t={t} tod="night" workers={false} id={`${id}p`} />
    <path d={`M -1200 ${EG.feet - 60} Q 600 ${EG.feet - 90} 3100 ${EG.feet - 40} L 3100 2000 L -1200 2000 Z`} fill="#3A3448" />
    {[[60, 0.9], [1500, 1.05]].map(([hx, hs], k) => (
      <g key={k} transform={`translate(${hx} ${EG.feet - 30}) scale(${hs})`}>
        <rect x={-150} y={-220} width={300} height={220} fill="#5A4A50" stroke="#1A1418" strokeWidth={4} />
        <rect x={-170} y={-236} width={340} height={22} fill="#4A3C42" stroke="#1A1418" strokeWidth={4} />
        <rect x={-36} y={-140} width={72} height={140} fill="#16121A" />
        {fire ? <rect x={-36} y={-140} width={72} height={140} fill="#FF8A3D" opacity={0.18} /> : null}
      </g>
    ))}
    <DroneCaseClosed x={1180} y={EG.feet + 30} />
    {fire ? <Campfire x={FIRE.x} y={FIRE.y} s={1} t={t} /> : null}
    <rect x={-1200} y={-1200} width={4320} height={3400} fill="#0A0C26" opacity={0.15} />
  </g>
);
const DroneCaseClosed: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-90} y={-60} width={180} height={60} rx={10} fill="#2A2C32" stroke="#0E0F12" strokeWidth={4} />
    <rect x={-30} y={-72} width={60} height={14} rx={6} fill="#1A1C20" />
  </g>
);

/** Dunes, side-on, rolling to the horizon: day or moonlit. */
export const Dunes: React.FC<{ t: number; id?: string; tod?: EgTod; storm?: number }> = ({ t, id = 'dunes', tod = 'day', storm = 0 }) => {
  const [s0, s1, s2] = SAND[tod];
  return (
    <g>
      <EgyptSky id={`${id}s`} tod={tod} t={t} />
      {[[EG.horizon, s0, 0.3], [EG.horizon + 80, s1, 0.6], [EG.horizon + 200, s2, 1]].map(([y, c, k], i) => (
        <path key={i} d={`M -1200 ${y} ${Array.from({ length: 12 }).map((_, j) => `Q ${-1000 + j * 380} ${(y as number) - 60 - rnd(i + 2, j) * 80 * (k as number)} ${-800 + j * 380} ${y}`).join(' ')} L 3500 2000 L -1200 2000 Z`} fill={c as string} />
      ))}
      {storm > 0 ? (
        <g>
          <rect x={-1200} y={-1200} width={4320} height={3400} fill="#C8905A" opacity={storm * 0.55} />
          {Array.from({ length: 40 }).map((_, k) => (
            <path key={k} d={`M ${((rnd(3, k) * 3000 + t * 18) % 3200) - 600} ${rnd(4, k) * 1080} h ${120 + rnd(5, k) * 200}`} stroke="#F2D8A8" strokeOpacity={0.4 * storm} strokeWidth={4} strokeLinecap="round" />
          ))}
        </g>
      ) : null}
    </g>
  );
};

/**
 * The king's hall, square-on: two rows of lotus columns stepping back to a dais and the throne under a painted back
 * wall with a sunlit doorway, braziers burning, a polished floor. hallStand(feetY) gives { y, scale } for someone
 * standing with their feet at feetY (0.5 at the dais, 1 at the front, y 900).
 */
export const HALL = { vp: [960, 470] as [number, number], dais: 640, front: 900 };
export const hallStand = (feetY: number) => {
  const scale = clamp((feetY - 500) / 400, 0.2, 1.4);
  return { y: feetY - LEG_LEN * scale, scale };
};
export const ThroneHall: React.FC<{ t: number; id?: string; throne?: boolean; dim?: number }> = ({ t, id = 'hall', throne = true, dim = 0 }) => {
  const [vx, vy] = HALL.vp;
  const col = (side: 1 | -1, k: number) => {
    const depth = [1, 0.74, 0.56, 0.43][k];
    const x = vx + side * (760 - k * 40) * depth * 1.05;
    const feet = vy + (HALL.front + 120 - vy) * depth;
    const h = 980 * depth;
    const w = 120 * depth;
    return (
      <g key={`${side}${k}`}>
        <ellipse cx={x} cy={feet} rx={w * 0.9} ry={w * 0.18} fill="#000" opacity={0.25} />
        <rect x={x - w / 2} y={feet - h} width={w} height={h} fill="#D8C49A" stroke="#3A2A1A" strokeWidth={4 * depth} />
        <rect x={x - w / 2 + w * 0.6} y={feet - h} width={w * 0.4} height={h} fill="#B09A70" />
        {[0.25, 0.5, 0.75].map((b) => (
          <rect key={b} x={x - w / 2} y={feet - h * b} width={w} height={14 * depth} fill={b === 0.5 ? '#2A5AA8' : '#A83A2A'} />
        ))}
        <path d={`M ${x - w / 2} ${feet - h} Q ${x - w * 1.1} ${feet - h - 90 * depth} ${x - w * 0.9} ${feet - h - 130 * depth} L ${x + w * 0.9} ${feet - h - 130 * depth} Q ${x + w * 1.1} ${feet - h - 90 * depth} ${x + w / 2} ${feet - h} Z`} fill="#3E8A6A" stroke="#1A3A2A" strokeWidth={4 * depth} />
        <rect x={x - w * 0.95} y={feet - h - 160 * depth} width={w * 1.9} height={32 * depth} fill="#C8B080" stroke="#3A2A1A" strokeWidth={3 * depth} />
      </g>
    );
  };
  return (
    <g>
      <rect x={-1200} y={-1200} width={4320} height={3400} fill="#3A2A2A" />
      {/* the back wall with its painted bands and the bright doorway */}
      <rect x={420} y={150} width={1080} height={HALL.dais - 150} fill="#C8A878" />
      {[220, 300].map((y, k) => (
        <rect key={y} x={420} y={y} width={1080} height={18} fill={k ? '#2A5AA8' : '#A83A2A'} />
      ))}
      {Array.from({ length: 12 }).map((_, k) => (
        <g key={k} transform={`translate(${470 + k * 88} 270)`}>
          <circle cx={0} cy={-8} r={8} fill="#2A1A10" />
          <path d="M 0 0 L 0 22 M -10 8 L 10 8" stroke="#2A1A10" strokeWidth={5} />
        </g>
      ))}
      <rect x={880} y={330} width={160} height={HALL.dais - 330} fill="#FFE8B0" />
      <path d={`M 880 ${HALL.dais} L 1040 ${HALL.dais} L 1300 1100 L 620 1100 Z`} fill="#FFE8B0" opacity={0.12} />
      {/* floor, polished, lines toward the vanishing point */}
      <path d={`M -1200 ${HALL.dais} H 3100 V 2000 H -1200 Z`} fill="#6A4A3A" />
      {Array.from({ length: 13 }).map((_, k) => (
        <path key={k} d={`M ${vx + (k - 6) * 90} ${HALL.dais} L ${vx + (k - 6) * 520} 1300`} stroke="#000" strokeOpacity={0.15} strokeWidth={3} />
      ))}
      {[700, 780, 900, 1060].map((y) => <path key={y} d={`M -1200 ${y} H 3100`} stroke="#000" strokeOpacity={0.12} strokeWidth={3} />)}
      {/* the dais and the throne */}
      <rect x={760} y={HALL.dais - 30} width={400} height={50} fill="#8A6A4A" stroke="#2A1A10" strokeWidth={4} />
      {throne ? <Throne x={960} y={HALL.dais - 30} s={0.62} /> : null}
      {[3, 2, 1, 0].map((k) => col(-1, k))}
      {[3, 2, 1, 0].map((k) => col(1, k))}
      {[[640, HALL.dais + 40, 0.6], [1280, HALL.dais + 40, 0.6], [260, 980, 1], [1660, 980, 1]].map(([bx, by, bs], k) => (
        <Brazier key={k} x={bx} y={by} s={bs} t={t + k * 7} />
      ))}
      <rect x={-1200} y={-1200} width={4320} height={3400} fill="#140A10" opacity={0.18 + dim} />
    </g>
  );
};

export const Throne: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -110 0 L -110 -320 Q -110 -350 -80 -350 L 80 -350 Q 110 -350 110 -320 L 110 0 Z" fill="#C89A3A" stroke="#3A2410" strokeWidth={5} />
    <rect x={-80} y={-320} width={160} height={150} fill="#2A5AA8" />
    {[0, 1, 2, 3].map((k) => <rect key={k} x={-80} y={-310 + k * 36} width={160} height={14} fill="#E8C85A" />)}
    <rect x={-140} y={-150} width={280} height={40} fill="#B8862A" stroke="#3A2410" strokeWidth={5} />
    <path d="M -140 -110 L -130 0 M 140 -110 L 130 0" stroke="#3A2410" strokeWidth={14} />
  </g>
);

export const Brazier: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={-200} r={320} o={0.5} />
    <path d="M -10 0 L -24 -150 M 10 0 L 24 -150 M 0 0 L 0 -150" stroke="#3A2A1A" strokeWidth={8} />
    <path d="M -60 -150 L 60 -150 L 40 -190 L -40 -190 Z" fill="#B8862A" stroke="#3A2410" strokeWidth={4} />
    <Campfire x={0} y={-186} s={0.6} t={t} />
  </g>
);

// ---------------------------------------------------------------- the drone's eye, straight down
/**
 * Giza from straight above, for the drone's camera: the pyramid as a square with a flat working top and four
 * shaded faces, its ramp, haulers as dots, the workers' town, sand, the Nile with boats along the left. World
 * coordinates; frame it with camT. `scatter` sends the dots running outward; `night` greys it all to moonlight.
 */
export const AerialGiza: React.FC<{ t: number; id?: string; night?: boolean; scatter?: number; dots?: number; build?: number; stuck?: boolean; goat?: [number, number] | null; mark?: [number, number] | null; shortcut?: number }> = ({ t, id = 'aer', night = false, scatter = 0, dots = 120, build = 0.62, stuck = false, goat = null, mark = null, shortcut = 0 }) => {
  const sand = night ? '#3A3A50' : '#E2BC80';
  const cx = 1100, cy = 540, R = 380;
  const r = R * (1 - build);
  const face = (pts: string, c: string) => <path d={pts} fill={c} stroke="#2A1E14" strokeWidth={3} strokeLinejoin="round" />;
  return (
    <g>
      <rect x={-2000} y={-2000} width={6000} height={5000} fill={sand} />
      {Array.from({ length: 60 }).map((_, k) => (
        <path key={k} d={`M ${-800 + rnd(21, k) * 3600} ${-600 + rnd(22, k) * 2300} q 80 -14 160 0`} stroke="#000" strokeOpacity={0.07} strokeWidth={6} fill="none" />
      ))}
      {/* the Nile and its green banks down the left */}
      <path d="M -2000 -2000 L -260 -2000 Q -200 0 -320 3000 L -2000 3000 Z" fill={night ? '#22343A' : '#5A8A44'} />
      <path d="M -1400 -2000 L -480 -2000 Q -420 0 -560 3000 L -1400 3000 Z" fill={night ? '#16223E' : '#3A7AA8'} />
      {[[-760, 120], [-900, 700], [-700, -400]].map(([bx, by], k) => (
        <g key={k} transform={`translate(${bx} ${by + (stuck && k === 0 ? 0 : (t * 0.8) % 400)}) rotate(90)`}>
          <path d="M -70 -14 Q 0 -26 70 -14 L 70 14 Q 0 26 -70 14 Z" fill="#9A6A3A" stroke="#2A1A10" strokeWidth={3} />
          <rect x={-14} y={-10} width={28} height={20} fill="#E2C890" />
        </g>
      ))}
      {stuck ? <ellipse cx={-740} cy={120} rx={60} ry={140} fill={sand} opacity={0.8} /> : null}
      {/* the town: a grid of roofs */}
      {Array.from({ length: 24 }).map((_, k) => (
        <rect key={k} x={-120 + (k % 6) * 70} y={760 + Math.floor(k / 6) * 70} width={54} height={54} fill={night ? '#4A4458' : '#B88A5A'} stroke="#2A1E14" strokeWidth={2} />
      ))}
      {/* the pyramid: four faces up to the working top */}
      {face(`M ${cx - R} ${cy - R} L ${cx + R} ${cy - R} L ${cx + r} ${cy - r} L ${cx - r} ${cy - r} Z`, night ? '#6A6A86' : '#F2D8A0')}
      {face(`M ${cx + R} ${cy - R} L ${cx + R} ${cy + R} L ${cx + r} ${cy + r} L ${cx + r} ${cy - r} Z`, night ? '#4A4A66' : '#C8A06A')}
      {face(`M ${cx + R} ${cy + R} L ${cx - R} ${cy + R} L ${cx - r} ${cy + r} L ${cx + r} ${cy + r} Z`, night ? '#3E3E58' : '#B08A58')}
      {face(`M ${cx - R} ${cy + R} L ${cx - R} ${cy - R} L ${cx - r} ${cy - r} L ${cx - r} ${cy + r} Z`, night ? '#5A5A76' : '#E2C48A')}
      {Array.from({ length: 10 }).map((_, k) => {
        const q = R - (k + 1) * ((R - r) / 11);
        return <rect key={k} x={cx - q} y={cy - q} width={q * 2} height={q * 2} fill="none" stroke="#2A1E14" strokeOpacity={0.15} strokeWidth={2} />;
      })}
      <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill={night ? '#5A5A76' : '#EAD098'} stroke="#2A1E14" strokeWidth={3} />
      {/* the ramp from the south-west corner */}
      <path d={`M ${cx - R - 300} ${cy + R + 160} L ${cx - R + 10} ${cy + R - 10} L ${cx - R + 60} ${cy + R + 30} L ${cx - R - 250} ${cy + R + 220} Z`} fill={night ? '#4A4058' : '#A87A52'} stroke="#2A1E14" strokeWidth={3} />
      {/* the long way round, and the shortcut */}
      {shortcut > 0 ? (
        <g>
          <Block x={150} y={1680} s={0.5} />
          <path d={`M 150 1650 Q 1200 1950 1050 1350 Q 800 1120 ${cx - R - 300} ${cy + R + 160}`} stroke="#FF4A3A" strokeWidth={10} strokeDasharray="20 16" fill="none" opacity={0.8} />
          <path d={`M 150 1650 L ${cx - R - 300} ${cy + R + 160}`} stroke="#5BE08A" strokeWidth={14} fill="none" strokeDasharray={`${shortcut * 900} 2000`} strokeLinecap="round" />
        </g>
      ) : null}
      {/* haulers: dots streaming up the ramp and around the base; scatter flings them outward */}
      {Array.from({ length: dots }).map((_, i) => {
        const p = (rnd(31, i) + t * 0.0015) % 1;
        const onRamp = i % 3 === 0;
        let x = onRamp ? lerp(cx - R - 300, cx - R + 30, p) : cx - R - 60 + rnd(32, i) * (2 * R + 120);
        let y = onRamp ? lerp(cy + R + 190, cy + R + 10, p) : cy + R + 40 + rnd(33, i) * 260;
        if (!onRamp && i % 3 === 1) { x = cx + R + 40 + rnd(34, i) * 200; y = cy - R + rnd(35, i) * (2 * R); }
        const a = Math.atan2(y - cy, x - cx);
        x += Math.cos(a) * scatter * (120 + rnd(36, i) * 300);
        y += Math.sin(a) * scatter * (120 + rnd(36, i) * 300);
        return (
          <g key={i}>
            <circle cx={x + 5} cy={y + 6} r={7} fill="#000" opacity={0.2} />
            <circle cx={x} cy={y} r={7} fill={night ? '#B8B8D0' : '#F6EFE3'} stroke="#1A1620" strokeWidth={3} />
          </g>
        );
      })}
      {goat ? <circle cx={goat[0]} cy={goat[1]} r={11} fill="#F6F2E8" stroke="#1A1620" strokeWidth={3} /> : null}
      {mark ? (
        <g>
          <circle cx={mark[0]} cy={mark[1]} r={60 + Math.sin(t / 4) * 6} fill="none" stroke="#FF4A3A" strokeWidth={8} />
          <path d={`M ${mark[0]} ${mark[1] - 90} v -60`} stroke="#FF4A3A" strokeWidth={8} />
        </g>
      ) : null}
      {night ? <rect x={-2000} y={-2000} width={6000} height={5000} fill="#0A0C26" opacity={0.35} /> : null}
    </g>
  );
};

/** Moonlit desert from above: grey dune crests, rocks, and optionally a fire with people around it at (fx, fy). */
export const AerialNight: React.FC<{ t: number; fire?: [number, number] | null; people?: number; wave?: boolean; grain?: boolean }> = ({ t, fire = null, people = 6, wave = false, grain = true }) => (
  <g>
    <rect x={-2000} y={-2000} width={6000} height={5000} fill="#24242E" />
    {Array.from({ length: 26 }).map((_, k) => (
      <path key={k} d={`M ${-800 + rnd(41, k) * 3600} ${-400 + rnd(42, k) * 2000} q 160 -${60 + rnd(43, k) * 60} 320 0 q -160 30 -320 0`} fill="#30303C" stroke="#3A3A48" strokeWidth={4} />
    ))}
    {Array.from({ length: 30 }).map((_, k) => (
      <circle key={`r${k}`} cx={-600 + rnd(44, k) * 3200} cy={-300 + rnd(45, k) * 1800} r={6 + rnd(46, k) * 14} fill="#1A1A22" />
    ))}
    {fire ? (
      <g>
        <Glow x={fire[0]} y={fire[1]} r={160} o={0.8} />
        <circle cx={fire[0]} cy={fire[1]} r={16 + Math.sin(t / 2) * 3} fill="#FF9A3D" />
        <circle cx={fire[0]} cy={fire[1]} r={8} fill="#FFF2B0" />
        {Array.from({ length: people }).map((_, i) => {
          const a = (i / people) * Math.PI * 2;
          const px = fire[0] + Math.cos(a) * 60;
          const py = fire[1] + Math.sin(a) * 60;
          const w = wave ? Math.sin(t / 3 + i) * 10 : 0;
          return (
            <g key={i}>
              <circle cx={px} cy={py} r={11} fill="#C8B8A0" stroke="#100E14" strokeWidth={3} />
              {wave ? <path d={`M ${px} ${py} l ${Math.cos(a) * 24 + w} ${Math.sin(a) * 24 - 10}`} stroke="#C8B8A0" strokeWidth={5} strokeLinecap="round" /> : null}
            </g>
          );
        })}
      </g>
    ) : null}
    {grain
      ? Array.from({ length: 160 }).map((_, k) => (
          <rect key={`g${k}`} x={rnd(k + Math.floor(t), 1) * 1920 - 200} y={rnd(k + Math.floor(t), 2) * 1080 - 100} width={4} height={4} fill="#FFFFFF" opacity={0.12} />
        ))
      : null}
  </g>
);
