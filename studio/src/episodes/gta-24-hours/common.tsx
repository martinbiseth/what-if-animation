import React from 'react';
import {
  Hero, Look, LOOKS, Pose, ShotProps, Word, basePose, camT, clamp, kf, backOut, easeOut, easeInOut, faceAt, idleBlink, talkAt, Expr, FONT, Glow, rnd,
  Schematic, SCH, SchLabel, DrawOn, UI, LEG_LEN, walkPose, Bedroom, BEDROOM, stand,
} from '../../engine';
import { YOU, MO, MOM, Soft, span, wordF, faceCU, bigWord, handAt } from '../electricity/common';
import { Car } from '../electricity/sets';
import { Body, Dog, Pigeon, shk } from '../gravity/common';

// Shared by every chapter of "What if you acted like GTA 6 in real life for 24 hours?": the cast, the HUD (a clock and
// five wanted stars of our own design), the town sets (shop street, park, backyard, taxi, store, library hedge, station,
// cell, steps), the props, and the shot builders. Nothing here copies the game: no logos, no map, no characters, no
// game UI; the stars and the health bar are plain generic shapes.

export { YOU, MO, MOM, Soft, span, wordF, faceCU, bigWord, handAt, Body, Dog, Pigeon, shk, Car, Bedroom, BEDROOM, stand };
export { Schematic, SCH, SchLabel, DrawOn, LEG_LEN };

/** The little old lady with the baguette. */
export const LADY: Look = { ...LOOKS.lady, jacket: '#A8606A', jacketShade: '#8A4C56', hat: undefined, hair: '#C9C4BA' };
export const COP: Look = LOOKS.cop;
export const RANGER: Look = { ...LOOKS.worker, jacket: '#5E7A3A', jacketShade: '#4A622C', accent: '#E9C46A', hat: 'cap', hatColor: '#4A5E2E' };
/** The man in the pink bathrobe. */
export const ROBE: Look = { ...LOOKS.worker, jacket: '#E89AAE', jacketShade: '#C87E92', accent: '#F6EFE3', limb: '#E89AAE', hat: undefined, hair: '#6A5A4A' };
export const DRIVER: Look = { ...LOOKS.worker, jacket: '#3A4A5A', jacketShade: '#2E3A48', accent: '#E9C46A', hat: 'cap', hatColor: '#E9B92A' };
export const GUARD: Look = { ...LOOKS.suit26, jacket: '#2E3440', jacketShade: '#242833', hat: undefined };
export const VENDOR: Look = { ...LOOKS.worker, jacket: '#F2EEE6', jacketShade: '#D8D2C6', accent: '#E8453A', hat: 'cap', hatColor: '#E8453A' };
export const CELLMAN: Look = { ...LOOKS.gent, jacket: '#6A6A5A', jacketShade: '#545446', hat: undefined, hair: '#9A948A' };
export const SCOOTGUY: Look = { ...LOOKS.worker, jacket: '#3A8AC8', jacketShade: '#2E70A4', hat: 'cap', hatColor: '#F6EFE3' };
/** You in the store's outfits. */
export const YOU_TRACK: Look = { ...YOU, jacket: '#2E9A5A', jacketShade: '#227A46', extra: undefined, limb: '#2E9A5A' };
export const YOU_SUIT: Look = { ...YOU, jacket: '#4A4E5A', jacketShade: '#3A3E48', extra: 'suit', limb: '#4A4E5A' };
export const YOU_NOHOOD: Look = { ...YOU, jacket: '#F6EFE3', jacketShade: '#D8D2C6', extra: undefined, limb: '#3B3646' };

export type SetFC = React.FC<{ t: number; id?: string }>;
export const GROUND = 860;
export const hipAt = (scale = 1, ground = GROUND) => ground - LEG_LEN * scale;

// ---------------------------------------------------------------- the HUD
/** One five-point star. */
export const Star: React.FC<{ x: number; y: number; r: number; on: number; color?: string; stroke?: string }> = ({ x, y, r, on, color = '#FFD23A', stroke = '#0B0816' }) => {
  const pts = Array.from({ length: 10 }).map((_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    return `${x + Math.cos(a) * rr},${y + Math.sin(a) * rr}`;
  });
  return <polygon points={pts.join(' ')} fill={on > 0.5 ? color : '#3A3646'} fillOpacity={on > 0.5 ? 1 : 0.55} stroke={stroke} strokeWidth={r * 0.18} strokeLinejoin="round" />;
};

/**
 * The HUD top right: the clock and five stars, swapping with a pop at each key [frame, clock, stars]. stars -1 shows
 * the stars cracked and greyed out ("real police don't have stars"); stars -2 hides them, only the clock is left.
 */
export const hud = (keys: [number, string, number][]): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
    let k = 0;
    keys.forEach((kk, i) => {
      if (f >= kk[0]) k = i;
    });
    const [f0, clock, stars] = keys[k];
    const prev = k > 0 ? keys[k - 1][2] : stars;
    const ch = k > 0 && prev !== stars ? clamp(1 - (f - f0) / 16) : 0;
    const blinkOn = stars > 0 && Math.floor(f / 10) % 2 === 0 && ch > 0;
    return (
      <g transform="translate(1600 92)">
        <rect x={-250} y={-50} width={510} height={100} rx={50} fill={UI.pill} opacity={0.88} />
        <text x={-165} y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#F6EFE3">{clock}</text>
        <rect x={-72} y={-32} width={3} height={64} fill="#F6EFE3" opacity={0.35} />
        {stars > -2
          ? [0, 1, 2, 3, 4].map((i) => {
              const on = stars > i ? 1 : 0;
              const pop = on && i === stars - 1 && ch > 0 ? 1 + 0.5 * ch : 1;
              return (
                <g key={i} opacity={stars === -1 ? 0.35 : 1} transform={`translate(${-20 + i * 58} 0) scale(${pop})`}>
                  <Star x={0} y={0} r={24} on={blinkOn && i === stars - 1 ? 0 : on} />
                  {stars === -1 ? <path d="M -10 -22 L 4 -4 L -6 6 L 8 22" stroke="#0B0816" strokeWidth={4} fill="none" /> : null}
                </g>
              );
            })
          : null}
      </g>
    );
  };
  return Hud;
};

/** A plain health bar (bottom left in the "game" shots): a pill that fills with green. */
export const HealthBar: React.FC<{ x: number; y: number; p: number; w?: number; label?: string }> = ({ x, y, p, w = 420, label = 'HEALTH' }) => (
  <g transform={`translate(${x} ${y})`}>
    <text x={0} y={-18} fontFamily={FONT.ui} fontSize={30} letterSpacing={4} fill="#F6EFE3">{label}</text>
    <rect x={0} y={0} width={w} height={40} rx={20} fill="#14121C" stroke="#F6EFE3" strokeWidth={4} />
    <rect x={6} y={6} width={Math.max(0, (w - 12) * clamp(p))} height={28} rx={14} fill={p > 0.35 ? '#4AD06A' : '#E8453A'} />
  </g>
);

/** Big outlined caption text (the house style of the thumbnails and the punch words). */
export const Big: React.FC<{ x: number; y: number; size: number; fill?: string; anchor?: 'start' | 'middle' | 'end'; o?: number; rot?: number; children: React.ReactNode }> = ({ x, y, size, fill = '#FFFFFF', anchor = 'middle', o = 1, rot = 0, children }) => (
  <text x={x} y={y} transform={rot ? `rotate(${rot} ${x} ${y})` : undefined} textAnchor={anchor} opacity={o} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

/** A pop-in word at a moment of the shot clock, fading out after `hold` frames. */
export const PopWord: React.FC<{ t: number; at: number; x: number; y: number; text: string; size?: number; fill?: string; hold?: number; rot?: number }> = ({ t, at, x, y, text, size = 90, fill = '#FFD23A', hold = 40, rot = -4 }) => {
  if (t < at || t > at + hold + 8) return null;
  const s = backOut(clamp((t - at) / 7));
  const o = clamp((at + hold + 8 - t) / 8);
  return (
    <g transform={`translate(${x} ${y}) scale(${s}) translate(${-x} ${-y})`}>
      <Big x={x} y={y} size={size} fill={fill} o={o} rot={rot}>{text}</Big>
    </g>
  );
};

/** The "in the game / in real life" split: a two-panel label strip. */
export const SplitTag: React.FC<{ x: number; y: number; text: string; color?: string; t: number; at?: number }> = ({ x, y, text, color = '#4AD06A', t, at = 0 }) => {
  const s = backOut(clamp((t - at) / 8));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-210} y={-44} width={420} height={78} rx={39} fill={UI.pill} stroke={color} strokeWidth={4} />
      <text x={0} y={12} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} letterSpacing={4} fill={color}>{text}</text>
    </g>
  );
};

// ---------------------------------------------------------------- skies
const SkyGrad: React.FC<{ id: string; mode: 'day' | 'dusk' | 'night' | 'dawn'; h?: number }> = ({ id, mode, h = 700 }) => {
  const c = {
    day: ['#4A8ED0', '#9AC8E8', '#DCEEF4'],
    dawn: ['#3A4A80', '#C8A0B0', '#F6D0A0'],
    dusk: ['#2A2050', '#C8607A', '#F2A06A'],
    night: ['#06081A', '#141A3A', '#2A2A4A'],
  }[mode];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sk`} x1="0" y1="-300" x2="0" y2={h} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c[0]} />
          <stop offset="65%" stopColor={c[1]} />
          <stop offset="100%" stopColor={c[2]} />
        </linearGradient>
      </defs>
      <rect x={-600} y={-500} width={3200} height={h + 500} fill={`url(#${id}sk)`} />
      {mode === 'night'
        ? Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={-400 + rnd(3, i) * 2800} cy={-300 + rnd(5, i) * 700} r={1.5 + rnd(7, i) * 2} fill="#FFFFFF" opacity={0.5} />)
        : null}
    </g>
  );
};

const Clouds: React.FC<{ t: number; o?: number }> = ({ t, o = 0.9 }) => (
  <g opacity={o}>
    {[[200, 130, 150], [1150, 90, 190], [1800, 200, 120], [700, 240, 100]].map(([cx, cy, rx], i) => (
      <g key={i} transform={`translate(${((t * 0.25 * (i % 2 ? 1 : -1)) % 100)} 0)`}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.28} fill="#FFFFFF" />
        <ellipse cx={cx + rx * 0.35} cy={cy - rx * 0.14} rx={rx * 0.5} ry={rx * 0.3} fill="#FFFFFF" />
      </g>
    ))}
  </g>
);

const Tree: React.FC<{ x: number; y: number; s?: number; c?: string; t?: number }> = ({ x, y, s = 1, c = '#3E7A4A', t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${Math.sin(t / 40 + x) * 1.2})`}>
    <rect x={-14} y={-160} width={28} height={160} fill="#5A3E2E" stroke="#1A1218" strokeWidth={5} />
    <circle cx={0} cy={-220} r={110} fill={c} stroke="#1A1218" strokeWidth={6} />
    <circle cx={-70} cy={-170} r={70} fill={c} stroke="#1A1218" strokeWidth={6} />
    <circle cx={70} cy={-180} r={75} fill={c} stroke="#1A1218" strokeWidth={6} />
    <circle cx={-30} cy={-250} r={50} fill="#FFFFFF" opacity={0.08} />
  </g>
);

// ---------------------------------------------------------------- the shop street
export type Shop = { name: string; wall: string; awning: string; door?: string };
export const SHOPS: Shop[] = [
  { name: 'FLOWERS', wall: '#7A5A8A', awning: '#E89AAE' },
  { name: 'BAKERY', wall: '#B8744A', awning: '#F2D06A' },
  { name: 'PHARMACY', wall: '#4E7A6A', awning: '#7FD4A8' },
  { name: 'BOOKS', wall: '#6A5A4A', awning: '#E8453A' },
  { name: 'CAFE', wall: '#5A6A8A', awning: '#F6EFE3' },
  { name: 'SHOES', wall: '#8A4A4A', awning: '#3A8AC8' },
];
const SHOP_W = 470;
/** Index of a shop's centre x (shop i starts at -420 + i * SHOP_W). */
export const shopX = (i: number) => -420 + i * SHOP_W + SHOP_W / 2;

/**
 * A town shopping street, side-on: shopfronts with striped awnings and signs, a sidewalk at GROUND, a kerb and the road
 * below (cars drive in the road band 900-1080). mode: day, dusk, night. `light`: a traffic light at x (red/green/off).
 */
export const ShopStreet: React.FC<{ t: number; id?: string; mode?: 'day' | 'dusk' | 'night' | 'dawn'; shops?: Shop[]; light?: { x: number; c: 'red' | 'green' } }> = ({ t, id = 'ss', mode = 'day', shops = SHOPS, light }) => {
  const night = mode === 'night';
  return (
    <g>
      <SkyGrad id={id} mode={mode} />
      {mode === 'day' ? <Clouds t={t} /> : null}
      {/* far skyline */}
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-500 + i * 260} y={260 - rnd(9, i) * 160} width={220} height={500} fill={night ? '#1A1A30' : '#8AA0B8'} opacity={0.6} />
      ))}
      {shops.map((s, i) => {
        const x0 = -420 + i * SHOP_W;
        const top = 300 + (i % 2) * 40;
        return (
          <g key={i}>
            <rect x={x0} y={top} width={SHOP_W} height={GROUND - top} fill={s.wall} stroke="#1A1218" strokeWidth={6} />
            {/* upstairs windows */}
            {[0, 1, 2].map((k) => (
              <rect key={k} x={x0 + 50 + k * 140} y={top + 40} width={90} height={110} rx={6} fill={night ? (rnd(i, k) > 0.4 ? '#F2C86A' : '#22223A') : '#BFD8EA'} stroke="#1A1218" strokeWidth={5} />
            ))}
            {/* sign */}
            <rect x={x0 + 50} y={top + 175} width={SHOP_W - 100} height={70} rx={8} fill="#1E1A28" stroke="#1A1218" strokeWidth={5} />
            <text x={x0 + SHOP_W / 2} y={top + 225} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill={s.awning}>{s.name}</text>
            {/* awning */}
            <g>
              <path d={`M ${x0 + 20} ${top + 265} L ${x0 + SHOP_W - 20} ${top + 265} L ${x0 + SHOP_W + 10} ${top + 345} L ${x0 - 10} ${top + 345} Z`} fill={s.awning} stroke="#1A1218" strokeWidth={6} />
              {Array.from({ length: 6 }).map((_, k) => (
                <path key={k} d={`M ${x0 + 20 + k * 76} ${top + 265} l 38 0 l 6 80 l -40 0 Z`} fill="#FFFFFF" opacity={0.35} />
              ))}
            </g>
            {/* shop window and door */}
            <rect x={x0 + 40} y={top + 370} width={250} height={GROUND - top - 400} rx={6} fill={night ? '#F2C86A' : '#9AC0D8'} opacity={night ? 0.8 : 1} stroke="#1A1218" strokeWidth={6} />
            <path d={`M ${x0 + 60} ${top + 390} l 80 0 l -60 120 Z`} fill="#FFFFFF" opacity={0.18} />
            <rect x={x0 + 320} y={top + 380} width={110} height={GROUND - top - 380} rx={4} fill={s.door ?? '#2E2A3A'} stroke="#1A1218" strokeWidth={6} />
            <circle cx={x0 + 410} cy={(top + 380 + GROUND) / 2} r={6} fill="#E9C46A" />
          </g>
        );
      })}
      {/* lamp posts */}
      {[50, 990, 1930].map((x, i) => (
        <g key={i}>
          <rect x={x - 7} y={420} width={14} height={GROUND - 420 + 10} fill="#2A2632" />
          <path d={`M ${x} 430 q 0 -40 50 -40`} stroke="#2A2632" strokeWidth={12} fill="none" />
          <rect x={x + 36} y={384} width={40} height={22} rx={6} fill={night || mode === 'dusk' ? '#FFE29A' : '#4A4652'} />
          {night ? <Glow x={x + 56} y={400} r={260} kind="warm" o={0.7} /> : null}
        </g>
      ))}
      {/* sidewalk, kerb, road */}
      <rect x={-600} y={GROUND} width={3200} height={42} fill={night ? '#3A3644' : '#B8B0A4'} />
      {Array.from({ length: 30 }).map((_, i) => (
        <rect key={i} x={-600 + i * 110} y={GROUND} width={3} height={42} fill="#1A1218" opacity={0.25} />
      ))}
      <rect x={-600} y={GROUND + 42} width={3200} height={16} fill={night ? '#4A4654' : '#D8D0C4'} stroke="#1A1218" strokeWidth={4} />
      <rect x={-600} y={GROUND + 58} width={3200} height={400} fill={night ? '#1C1A24' : '#4A4652'} />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={-600 + i * 220} y={1010} width={120} height={12} fill="#F6EFE3" opacity={0.7} />
      ))}
      {light ? <TrafficLight x={light.x} y={GROUND + 10} c={light.c} /> : null}
      {night ? <rect x={-600} y={-500} width={3200} height={2000} fill="#0A0A20" opacity={0.25} /> : null}
    </g>
  );
};

export const TrafficLight: React.FC<{ x: number; y: number; c: 'red' | 'green' | 'off'; s?: number }> = ({ x, y, c, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-8} y={-420} width={16} height={420} fill="#2A2632" />
    <rect x={-40} y={-560} width={80} height={170} rx={14} fill="#1E1A24" stroke="#0B0816" strokeWidth={5} />
    <circle cx={0} cy={-520} r={24} fill={c === 'red' ? '#FF3A2E' : '#4A2020'} />
    <circle cx={0} cy={-432} r={24} fill={c === 'green' ? '#3AE07A' : '#1A3A26'} />
    {c === 'red' ? <Glow x={0} y={-520} r={120} kind="red" o={0.8} /> : null}
  </g>
);

// ---------------------------------------------------------------- the park
export const Park: React.FC<{ t: number; id?: string; mode?: 'day' | 'dusk' }> = ({ t, id = 'pk', mode = 'day' }) => (
  <g>
    <SkyGrad id={id} mode={mode} h={620} />
    <Clouds t={t} o={mode === 'day' ? 0.9 : 0.4} />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={-500 + i * 340} y={300 - rnd(4, i) * 120} width={260} height={400} fill="#8AA0B8" opacity={0.5} />
    ))}
    <rect x={-600} y={600} width={3200} height={900} fill="#5E9A4A" />
    {[-300, 100, 1700, 2100].map((x, i) => <Tree key={i} x={x} y={640} s={0.9} t={t} c={i % 2 ? '#3E7A4A' : '#4E8A3A'} />)}
    {/* the path */}
    <path d="M -600 860 Q 600 760 1100 800 T 2600 840 L 2600 960 Q 1400 900 1000 930 T -600 1000 Z" fill="#D8C8A4" stroke="#1A1218" strokeWidth={5} />
    {/* fountain */}
    <g transform="translate(960 700)">
      <ellipse cx={0} cy={40} rx={260} ry={50} fill="#9AA8B8" stroke="#1A1218" strokeWidth={6} />
      <ellipse cx={0} cy={30} rx={230} ry={36} fill="#6AB8E8" />
      <rect x={-20} y={-120} width={40} height={150} fill="#9AA8B8" stroke="#1A1218" strokeWidth={6} />
      <ellipse cx={0} cy={-120} rx={90} ry={20} fill="#9AA8B8" stroke="#1A1218" strokeWidth={6} />
      {Array.from({ length: 6 }).map((_, i) => {
        const k = ((t * 2 + i * 10) % 60) / 60;
        return <circle key={i} cx={(i - 2.5) * 30 * k * 2} cy={-140 - 120 * Math.sin(k * Math.PI)} r={8} fill="#BFE6FF" opacity={0.9} />;
      })}
    </g>
    {/* benches */}
    {[300, 1600].map((x, i) => (
      <g key={i} transform={`translate(${x} 800)`}>
        <rect x={-130} y={-80} width={260} height={22} rx={6} fill="#8A5A3A" stroke="#1A1218" strokeWidth={5} />
        <rect x={-130} y={-40} width={260} height={22} rx={6} fill="#8A5A3A" stroke="#1A1218" strokeWidth={5} />
        <rect x={-110} y={-20} width={14} height={60} fill="#2A2632" />
        <rect x={96} y={-20} width={14} height={60} fill="#2A2632" />
      </g>
    ))}
  </g>
);

// ---------------------------------------------------------------- backyards and fences
/** A wooden plank fence from x0 to x1 with its top at y0 and its foot at y1. */
export const Fence: React.FC<{ x0: number; x1: number; y0: number; y1: number; c?: string }> = ({ x0, x1, y0, y1, c = '#C89A6A' }) => {
  const n = Math.ceil((x1 - x0) / 56);
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <path key={i} d={`M ${x0 + i * 56 + 3} ${y1} L ${x0 + i * 56 + 3} ${y0 + 14} L ${x0 + i * 56 + 27} ${y0} L ${x0 + i * 56 + 51} ${y0 + 14} L ${x0 + i * 56 + 51} ${y1} Z`} fill={c} stroke="#1A1218" strokeWidth={5} />
      ))}
      <rect x={x0} y={y0 + 50} width={x1 - x0} height={16} fill="#A8784A" stroke="#1A1218" strokeWidth={4} />
      <rect x={x0} y={y1 - 70} width={x1 - x0} height={16} fill="#A8784A" stroke="#1A1218" strokeWidth={4} />
    </g>
  );
};

/** The orange hoodie hanging from a fence top (or flying). */
export const Hoodie: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -60 0 Q -70 -40 -30 -60 Q 0 -80 30 -60 Q 70 -40 60 0 L 110 40 L 90 80 L 50 50 L 50 150 L -50 150 L -50 50 L -90 80 L -110 40 Z" fill={YOU.jacket} stroke="#0B0816" strokeWidth={6} strokeLinejoin="round" />
    <path d="M -30 -40 Q 0 -10 30 -40" stroke="#0B0816" strokeWidth={5} fill="none" />
    <rect x={-30} y={90} width={60} height={30} rx={8} fill={YOU.jacketShade} />
  </g>
);

export const Backyard: React.FC<{ t: number; id?: string }> = ({ t, id = 'by' }) => (
  <g>
    <SkyGrad id={id} mode="day" h={600} />
    <Clouds t={t} />
    {[-200, 2100].map((x, i) => <Tree key={i} x={x} y={560} s={1.1} t={t} />)}
    <Fence x0={-600} x1={2600} y0={420} y1={640} />
    {/* the house on the right */}
    <rect x={1380} y={160} width={1100} height={700} fill="#D8C8B0" stroke="#1A1218" strokeWidth={6} />
    <rect x={1500} y={260} width={200} height={180} rx={6} fill="#9AC0D8" stroke="#1A1218" strokeWidth={6} />
    <rect x={1800} y={500} width={150} height={360} rx={4} fill="#5A6A8A" stroke="#1A1218" strokeWidth={6} />
    <rect x={-600} y={640} width={3200} height={900} fill="#6AA84E" />
    {Array.from({ length: 60 }).map((_, i) => (
      <path key={i} d={`M ${-500 + rnd(2, i) * 2900} ${700 + rnd(3, i) * 380} l 6 -18 l 6 18`} stroke="#4E8A3A" strokeWidth={4} fill="none" />
    ))}
    {/* patio */}
    <rect x={1320} y={820} width={1200} height={80} fill="#B8A88A" stroke="#1A1218" strokeWidth={5} />
    <g transform="translate(1560 820)">
      <rect x={-90} y={-110} width={180} height={18} rx={6} fill="#F6EFE3" stroke="#1A1218" strokeWidth={5} />
      <rect x={-8} y={-92} width={16} height={92} fill="#F6EFE3" stroke="#1A1218" strokeWidth={4} />
    </g>
  </g>
);

// ---------------------------------------------------------------- props
export const Baguette: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -60 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-18} width={240} height={36} rx={18} fill="#D8A050" stroke="#1A1218" strokeWidth={5} />
    {[-70, -20, 30, 80].map((k) => <path key={k} d={`M ${k} -12 l 20 22`} stroke="#A8702A" strokeWidth={5} />)}
  </g>
);

export const HotDog: React.FC<{ x: number; y: number; s?: number; rot?: number; bite?: number }> = ({ x, y, s = 1, rot = 0, bite = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-80} y={-14} width={160} height={40} rx={20} fill="#E8B06A" stroke="#1A1218" strokeWidth={5} />
    <rect x={-95} y={-26} width={190 - bite * 60} height={26} rx={13} fill="#C8503A" stroke="#1A1218" strokeWidth={5} />
    <path d={`M -70 -16 q 15 -10 30 0 t 30 0 t 30 0 t 30 0`} stroke="#F2D02A" strokeWidth={6} fill="none" />
  </g>
);

export const HotDogCart: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-160} y={-200} width={320} height={160} rx={10} fill="#E8E2D6" stroke="#1A1218" strokeWidth={6} />
    <rect x={-160} y={-150} width={320} height={40} fill="#E8453A" />
    <text x={0} y={-120} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#FFFFFF">HOT DOGS</text>
    <rect x={-6} y={-420} width={12} height={220} fill="#2A2632" />
    <path d="M -180 -400 Q 0 -480 180 -400 Z" fill="#F2D02A" stroke="#1A1218" strokeWidth={6} />
    <path d="M -90 -428 L -60 -400 M 0 -440 L 0 -400 M 90 -428 L 60 -400" stroke="#E8453A" strokeWidth={14} />
    <circle cx={-110} cy={-20} r={30} fill="#2A2632" stroke="#1A1218" strokeWidth={5} />
    <circle cx={110} cy={-20} r={30} fill="#2A2632" stroke="#1A1218" strokeWidth={5} />
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M ${-60 + i * 50} -210 q 10 ${-20 - ((t + i * 9) % 20)} 0 -50`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.5} />
    ))}
  </g>
);

/** An electric rental scooter, side view facing right. */
export const Scooter: React.FC<{ x: number; y: number; s?: number; flip?: boolean; spin?: number; color?: string }> = ({ x, y, s = 1, flip = false, spin = 0, color = '#3AC88A' }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <rect x={-110} y={-36} width={200} height={20} rx={8} fill="#2A2632" stroke="#0B0816" strokeWidth={4} />
    <path d="M 80 -30 L 110 -230" stroke={color} strokeWidth={16} strokeLinecap="round" />
    <path d="M 90 -232 L 140 -232" stroke="#2A2632" strokeWidth={14} strokeLinecap="round" />
    {[-100, 110].map((wx, i) => (
      <g key={i} transform={`translate(${wx} -10) rotate(${spin})`}>
        <circle r={26} fill="#1A1820" stroke="#0B0816" strokeWidth={4} />
        <path d="M -16 0 L 16 0 M 0 -16 L 0 16" stroke="#6A6672" strokeWidth={4} />
      </g>
    ))}
    <rect x={-40} y={-60} width={80} height={22} rx={6} fill={color} />
  </g>
);

/** The police car: our own design (white body, dark-blue door panel, a light bar), side view facing right. */
export const PoliceCar: React.FC<{ x: number; y: number; s?: number; t: number; flip?: boolean; lights?: number }> = ({ x, y, s = 1, t, flip = false, lights = 1 }) => {
  const ph = Math.floor(t / 5) % 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M -260 -40 L -250 -110 L -150 -120 L -90 -190 L 110 -190 L 180 -120 L 260 -105 L 270 -40 Z" fill="#F2F0EA" stroke="#0B0816" strokeWidth={7} strokeLinejoin="round" />
      <path d="M -70 -176 L 90 -176 L 140 -122 L -110 -122 Z" fill="#7AA8C8" stroke="#0B0816" strokeWidth={5} />
      <rect x={-160} y={-110} width={300} height={60} fill="#1E2C4A" />
      <g transform={`translate(-10 0) scale(${flip ? -1 : 1} 1)`}><text x={0} y={-68} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#F2F0EA">POLICE</text></g>
      <rect x={-60} y={-214} width={120} height={24} rx={8} fill="#1A1820" />
      <rect x={-56} y={-212} width={54} height={20} rx={6} fill={lights && ph ? '#FF3A2E' : '#6A2020'} />
      <rect x={2} y={-212} width={54} height={20} rx={6} fill={lights && !ph ? '#3A7AFF' : '#20306A'} />
      {[-160, 170].map((wx, i) => (
        <g key={i}>
          <circle cx={wx} cy={-30} r={44} fill="#1A1820" stroke="#0B0816" strokeWidth={6} />
          <circle cx={wx} cy={-30} r={18} fill="#8A8692" />
        </g>
      ))}
      {lights ? <Glow x={ph ? -30 : 30} y={-200} r={240} kind={ph ? 'red' : 'cool'} o={0.8} /> : null}
    </g>
  );
};

/** A police helicopter seen from the side, facing left, rotor spinning. */
export const Helicopter: React.FC<{ x: number; y: number; s?: number; t: number; beam?: number }> = ({ x, y, s = 1, t, beam = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {beam > 0 ? <path d="M -40 40 L -360 900 L 260 900 L 20 40 Z" fill="#FFF6C8" opacity={0.18 * beam} /> : null}
    <ellipse cx={0} cy={0} rx={130} ry={60} fill="#2A3A5E" stroke="#0B0816" strokeWidth={6} />
    <path d="M -110 -20 Q -120 30 -60 40 L -40 -30 Z" fill="#9AC8E8" stroke="#0B0816" strokeWidth={5} />
    <path d="M 110 -10 L 330 -20 L 330 10 L 110 20 Z" fill="#2A3A5E" stroke="#0B0816" strokeWidth={5} />
    <path d="M 310 -60 L 340 -60 L 340 30 L 310 30 Z" fill="#2A3A5E" stroke="#0B0816" strokeWidth={4} />
    <path d="M -80 70 L 100 70 M -50 60 L -50 70 M 70 60 L 70 70" stroke="#0B0816" strokeWidth={8} />
    <rect x={-8} y={-80} width={16} height={24} fill="#0B0816" />
    <ellipse cx={0} cy={-84} rx={260 * Math.abs(Math.cos(t * 0.9))} ry={8} fill="#0B0816" opacity={0.75} />
    <ellipse cx={0} cy={-84} rx={260 * Math.abs(Math.sin(t * 0.9))} ry={8} fill="#0B0816" opacity={0.35} />
    <text x={0} y={18} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#F6EFE3">POLICE</text>
  </g>
);

/** Biscuit standing (the police dog): a sandy shepherd-ish mutt in a harness, side view facing right. */
export const PoliceDog: React.FC<{ x: number; y: number; s?: number; t: number; flip?: boolean; sit?: number; wag?: number; sniff?: number; harness?: boolean; fur?: string; run?: number }> = ({ x, y, s = 1, t, flip = false, sit = 0, wag = 1, sniff = 0, harness = true, fur = '#C8A06A', run = 0 }) => {
  const tail = Math.sin(t * 0.9) * 25 * wag;
  const nose = sniff ? Math.sin(t * 1.7) * 6 : 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <g transform={`rotate(${-20 * sit} -60 -40)`}>
        <path d={`M -100 -90 q -30 ${-30 - tail * 0.3} -50 ${-60 - tail}`} stroke={fur} strokeWidth={18} strokeLinecap="round" fill="none" />
        <ellipse cx={-10} cy={-80} rx={110} ry={50} fill={fur} stroke="#1A1218" strokeWidth={6} />
        {harness ? <rect x={-50} y={-120} width={80} height={70} rx={10} fill="#1E2C4A" /> : null}
        {harness ? <text x={-10} y={-74} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#F6EFE3">K9</text> : null}
        {[-80, -40, 30, 60].map((lx, i) => (
          <rect key={i} x={lx} y={-50} width={22} height={sit && i < 2 ? 30 : 60} rx={10} fill={fur} stroke="#1A1218" strokeWidth={5} transform={run ? `rotate(${Math.sin(t * 1.2 + i * 1.6) * 35 * run} ${lx + 11} -50)` : undefined} />
        ))}
      </g>
      <g transform={`translate(${90 + nose} ${-130 + 30 * sniff})`}>
        <ellipse cx={0} cy={0} rx={56} ry={46} fill={fur} stroke="#1A1218" strokeWidth={6} />
        <path d="M 30 -10 L 90 6 Q 96 26 70 28 L 30 26 Z" fill={fur} stroke="#1A1218" strokeWidth={6} />
        <circle cx={90} cy={10} r={10} fill="#1A1218" />
        <path d="M -30 -36 L -40 -96 L 0 -44 Z" fill="#8A6A3A" stroke="#1A1218" strokeWidth={5} />
        <circle cx={18} cy={-10} r={9} fill="#1A1218" />
        <circle cx={21} cy={-13} r={3} fill="#FFFFFF" />
        {wag > 0.5 && !sniff ? <path d="M 40 26 q 10 30 -6 34" fill="#E86A7A" stroke="#1A1218" strokeWidth={4} /> : null}
      </g>
    </g>
  );
};

/** A leafy hedge from x0 to x1, top at y0, standing on y1; `part` opens a gap at px. */
export const Hedge: React.FC<{ x0: number; x1: number; y0: number; y1: number; t: number; part?: number; px?: number; c?: string }> = ({ x0, x1, y0, y1, t, part = 0, px = 960, c = '#2E6A3A' }) => {
  const n = Math.ceil((x1 - x0) / 70);
  return (
    <g>
      <rect x={x0} y={y0 + 40} width={x1 - x0} height={y1 - y0 - 40} fill={c} stroke="#0B0816" strokeWidth={6} />
      {Array.from({ length: n }).map((_, i) => {
        const cx = x0 + 35 + i * 70;
        const d = cx - px;
        const push = part * Math.sign(d) * Math.max(0, 140 - Math.abs(d)) * 0.8;
        return <circle key={i} cx={cx + push} cy={y0 + 40 + Math.sin(i * 1.7 + t / 30) * 3} r={52} fill={i % 2 ? c : '#3A7A46'} stroke="#0B0816" strokeWidth={5} />;
      })}
    </g>
  );
};

/** The library at night with its hedge (the hedge drawn separately, in front of whoever hides). */
export const LibraryNight: React.FC<{ t: number; id?: string; mode?: 'dusk' | 'night'; police?: number }> = ({ t, id = 'lib', mode = 'dusk', police = 0 }) => (
  <g>
    <SkyGrad id={id} mode={mode} h={640} />
    <rect x={200} y={200} width={1520} height={660} fill="#8A7A6A" stroke="#0B0816" strokeWidth={6} />
    <path d="M 150 210 L 960 60 L 1770 210 Z" fill="#6A5A4E" stroke="#0B0816" strokeWidth={6} />
    <rect x={260} y={250} width={1400} height={50} fill="#5A4A3E" />
    <text x={960} y={290} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} letterSpacing={18} fill="#E9DCC0">PUBLIC LIBRARY</text>
    {[320, 560, 800, 1120, 1360, 1600].map((x, i) => (
      <rect key={i} x={x - 30} y={300} width={60} height={560} fill="#B8A88A" stroke="#0B0816" strokeWidth={5} />
    ))}
    {[440, 680, 1240, 1480].map((x, i) => (
      <rect key={i} x={x - 60} y={380} width={120} height={200} rx={60} fill={mode === 'night' ? '#F2C86A' : '#5A6A8A'} opacity={0.85} stroke="#0B0816" strokeWidth={5} />
    ))}
    <rect x={900} y={560} width={120} height={300} fill="#3A2A22" stroke="#0B0816" strokeWidth={6} />
    <rect x={-600} y={GROUND} width={3200} height={500} fill="#3A3644" />
    {police > 0 ? (
      <g>
        <Glow x={-100} y={700} r={500} kind={Math.floor(t / 5) % 2 ? 'red' : 'cool'} o={0.5 * police} />
        <Glow x={2000} y={700} r={500} kind={Math.floor(t / 5) % 2 ? 'cool' : 'red'} o={0.5 * police} />
      </g>
    ) : null}
    <rect x={-600} y={-500} width={3200} height={2000} fill="#0A0A20" opacity={mode === 'night' ? 0.35 : 0.1} />
  </g>
);

// ---------------------------------------------------------------- the taxi
/** Inside the taxi, looking forward between the front seats: the windshield, the road, a blue car ahead, the meter. */
export const TaxiFront: React.FC<{ t: number; id?: string; meter?: string; blue?: number; store?: number }> = ({ t, meter = '$ 4.50', blue = 1, store = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#1A1820" />
    {/* windshield */}
    <clipPath id="tws"><path d="M 260 120 L 1660 120 L 1800 640 L 120 640 Z" /></clipPath>
    <g clipPath="url(#tws)">
      <rect x={0} y={0} width={1920} height={700} fill="#9AC8E8" />
      <Clouds t={t} />
      {Array.from({ length: 10 }).map((_, i) => {
        const k = ((t * 0.01 + i / 10) % 1);
        const xl = 960 - 120 - k * 1100;
        return <rect key={i} x={xl - 150 * k} y={420 - 200 * k - 120} width={180 * (0.3 + k)} height={300 * (0.3 + k)} fill={['#B8744A', '#4E7A6A', '#7A5A8A', '#5A6A8A'][i % 4]} opacity={0.9} />;
      })}
      {Array.from({ length: 10 }).map((_, i) => {
        const k = ((t * 0.01 + i / 10 + 0.05) % 1);
        const xr = 960 + 120 + k * 1100;
        return <rect key={i} x={xr} y={420 - 200 * k - 120} width={180 * (0.3 + k)} height={300 * (0.3 + k)} fill={['#8A4A4A', '#6A5A4A', '#B8A88A', '#5E7A6A'][i % 4]} opacity={0.9} />;
      })}
      <path d="M 900 420 L 1020 420 L 1800 700 L 120 700 Z" fill="#4A4652" />
      {Array.from({ length: 5 }).map((_, i) => {
        const k = ((t * 0.04 + i / 5) % 1);
        return <rect key={i} x={960 - 4 - 20 * k} y={420 + 280 * k * k} width={8 + 40 * k} height={10 + 40 * k} fill="#F6EFE3" />;
      })}
      {blue > 0 ? <g transform={`translate(960 ${470 + Math.sin(t / 20) * 6}) scale(0.5)`}><CarBack color="#3A6AC8" /></g> : null}
      {store > 0 ? (
        <g opacity={store}>
          <rect x={560} y={160} width={800} height={280} fill="#E8E2D6" stroke="#0B0816" strokeWidth={6} />
          <rect x={560} y={160} width={800} height={70} fill="#4AA84E" />
          <text x={960} y={214} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#FFFFFF">GROCERY</text>
        </g>
      ) : null}
    </g>
    <path d="M 260 120 L 1660 120 L 1800 640 L 120 640 Z" fill="none" stroke="#0B0816" strokeWidth={30} />
    {/* rear-view mirror */}
    <rect x={860} y={140} width={200} height={60} rx={12} fill="#2A2830" stroke="#0B0816" strokeWidth={6} />
    {/* dashboard */}
    <path d="M -400 640 L 2400 640 L 2400 1500 L -400 1500 Z" fill="#2A2632" />
    <rect x={-400} y={640} width={2800} height={30} fill="#3A3644" />
    {/* the meter */}
    <g transform="translate(1340 720)">
      <rect x={-150} y={-50} width={300} height={100} rx={12} fill="#0B0816" stroke="#4A4652" strokeWidth={6} />
      <text x={0} y={22} textAnchor="middle" fontFamily={FONT.ui} fontSize={56} fill="#FF4A3A">{meter}</text>
    </g>
    {/* the two front seats */}
    <path d="M -100 1100 L -60 560 Q 0 470 180 480 Q 340 490 360 600 L 400 1100 Z" fill="#3A3644" stroke="#0B0816" strokeWidth={8} />
    <path d="M 1520 1100 L 1560 600 Q 1580 490 1740 480 Q 1920 470 1980 560 L 2020 1100 Z" fill="#3A3644" stroke="#0B0816" strokeWidth={8} />
    {/* the driver's head and cap, from behind */}
    <g transform="translate(1760 470)">
      <circle cx={0} cy={0} r={90} fill="#26232F" stroke="#0B0816" strokeWidth={6} />
      <path d="M -94 -10 Q -90 -100 0 -100 Q 90 -100 94 -10 Z" fill="#E9B92A" stroke="#0B0816" strokeWidth={6} />
    </g>
  </g>
);

/** A car seen from behind (the blue car the taxi follows). */
export const CarBack: React.FC<{ color?: string }> = ({ color = '#3A6AC8' }) => (
  <g>
    <path d="M -220 0 L -200 -120 L -130 -200 L 130 -200 L 200 -120 L 220 0 Z" fill={color} stroke="#0B0816" strokeWidth={8} />
    <path d="M -120 -185 L 120 -185 L 170 -120 L -170 -120 Z" fill="#6A8AA8" stroke="#0B0816" strokeWidth={6} />
    <rect x={-200} y={-90} width={60} height={30} rx={6} fill="#E8453A" />
    <rect x={140} y={-90} width={60} height={30} rx={6} fill="#E8453A" />
    <rect x={-60} y={-70} width={120} height={36} rx={4} fill="#F6EFE3" stroke="#0B0816" strokeWidth={4} />
    <rect x={-200} y={-10} width={70} height={50} rx={10} fill="#1A1820" />
    <rect x={130} y={-10} width={70} height={50} rx={10} fill="#1A1820" />
  </g>
);

/** The taxi's back seat seen from the front: the rear window, you and Mo sit in it (draw the cast after). */
export const TaxiBack: React.FC<{ t: number; id?: string }> = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#1A1820" />
    <path d="M 420 150 L 1500 150 L 1600 470 L 320 470 Z" fill="#9AC8E8" stroke="#0B0816" strokeWidth={14} />
    {Array.from({ length: 6 }).map((_, i) => {
      const k = ((t * 0.012 + i / 6) % 1);
      return <rect key={i} x={340 + k * 1200} y={260 - 40 * k} width={160} height={210} fill={['#B8744A', '#4E7A6A', '#7A5A8A'][i % 3]} opacity={0.5} />;
    })}
    <path d="M 200 500 Q 960 430 1720 500 L 1800 980 L 120 980 Z" fill="#4A4250" stroke="#0B0816" strokeWidth={8} />
    <path d="M 120 830 L 1800 830 L 1900 1200 L 20 1200 Z" fill="#3A3442" stroke="#0B0816" strokeWidth={8} />
    <rect x={940} y={520} width={40} height={300} rx={10} fill="#3A3442" />
  </g>
);

// ---------------------------------------------------------------- the clothing store
export const Store: React.FC<{ t: number; id?: string }> = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1300} fill="#F2E6D6" />
    <rect x={-400} y={GROUND} width={2800} height={600} fill="#C8B8A0" />
    {Array.from({ length: 20 }).map((_, i) => <rect key={i} x={-400 + i * 150} y={GROUND} width={4} height={600} fill="#A8987E" />)}
    {[160, 760].map((x0, k) => (
      <g key={k}>
        <rect x={x0} y={430} width={420} height={14} rx={7} fill="#8A8692" />
        <rect x={x0 + 10} y={430} width={10} height={430} fill="#8A8692" />
        <rect x={x0 + 400} y={430} width={10} height={430} fill="#8A8692" />
        {Array.from({ length: 7 }).map((_, i) => (
          <g key={i} transform={`translate(${x0 + 40 + i * 54} 440) rotate(${Math.sin(t / 30 + i) * 2})`}>
            <path d="M 0 0 L -26 30 L -22 200 L 22 200 L 26 30 Z" fill={['#E8453A', '#3A8AC8', '#F2D02A', '#2E9A5A', '#E89AAE', '#7A5A8A', '#F6EFE3'][(i + k * 3) % 7]} stroke="#1A1218" strokeWidth={4} />
          </g>
        ))}
      </g>
    ))}
    {/* the fitting room */}
    <rect x={1300} y={240} width={500} height={620} fill="#D8C8B0" stroke="#1A1218" strokeWidth={6} />
    <rect x={1300} y={220} width={500} height={24} fill="#8A8692" />
    <text x={1550} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} letterSpacing={6} fill="#5A4A3E">FITTING ROOM</text>
    {/* mirror */}
    <rect x={1860} y={280} width={200} height={560} rx={12} fill="#BFD8EA" stroke="#1A1218" strokeWidth={6} />
    <path d="M 1880 320 l 60 0 l -60 160 Z" fill="#FFFFFF" opacity={0.3} />
    <Glow x={960} y={100} r={900} kind="warm" o={0.3} />
  </g>
);

/** The fitting-room curtain, open by `open` (0 shut, 1 pulled right). */
export const Curtain: React.FC<{ open: number }> = ({ open }) => (
  <g>
    {Array.from({ length: 8 }).map((_, i) => {
      const w = 62 * (1 - 0.8 * open);
      const x = 1300 + 500 * open * 0.8 + i * w;
      return <rect key={i} x={x} y={244} width={w + 2} height={616} fill={i % 2 ? '#A8323E' : '#C8424E'} stroke="#1A1218" strokeWidth={3} />;
    })}
  </g>
);

export const Sombrero: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={190} ry={36} fill="#E8C86A" stroke="#1A1218" strokeWidth={6} />
    <path d="M -70 -6 Q -60 -130 0 -136 Q 60 -130 70 -6 Z" fill="#E8C86A" stroke="#1A1218" strokeWidth={6} />
    <path d="M -66 -36 Q 0 -20 66 -36" stroke="#E8453A" strokeWidth={14} fill="none" />
    {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={-160 + i * 40} cy={6} r={7} fill="#2E9A5A" />)}
  </g>
);

// ---------------------------------------------------------------- the station and the cell
export const Station: React.FC<{ t: number; id?: string }> = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1300} fill="#B8C0C4" />
    <rect x={-400} y={GROUND} width={2800} height={600} fill="#6A7074" />
    {/* the height chart */}
    <rect x={260} y={160} width={620} height={700} fill="#E6EAEC" stroke="#1A1218" strokeWidth={5} />
    {Array.from({ length: 14 }).map((_, i) => (
      <g key={i}>
        <rect x={260} y={200 + i * 48} width={620} height={3} fill="#2A2E36" opacity={0.6} />
        <text x={850} y={194 + i * 48} textAnchor="end" fontFamily={FONT.ui} fontSize={22} fill="#2A2E36">{`${7 - Math.floor(i / 2)}' ${i % 2 ? '6"' : '0"'}`}</text>
      </g>
    ))}
    {/* fluorescent lights */}
    {[400, 1300].map((x, i) => (
      <g key={i}>
        <rect x={x - 180} y={-40} width={360} height={30} rx={8} fill={Math.floor(t / 47) % 7 === 0 && i ? '#9AA0A4' : '#F6FAFF'} />
        <Glow x={x} y={0} r={500} kind="cool" o={0.35} />
      </g>
    ))}
    <rect x={1100} y={260} width={900} height={20} fill="#8A9094" />
  </g>
);

/** The booking counter, drawn in front of the cast. */
export const Counter: React.FC<{ x?: number }> = ({ x = 1080 }) => (
  <g>
    <rect x={x} y={640} width={1200} height={50} fill="#8A7A6A" stroke="#1A1218" strokeWidth={6} />
    <rect x={x + 20} y={690} width={1160} height={260} fill="#6A5E52" stroke="#1A1218" strokeWidth={6} />
  </g>
);

export const Cell: React.FC<{ t: number; id?: string; dawn?: number }> = ({ t, dawn = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1300} fill="#8A9094" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-400} y={-300 + i * 100} width={2800} height={3} fill="#6A7074" />)}
    <rect x={-400} y={GROUND} width={2800} height={600} fill="#5A6064" />
    {/* bench */}
    <rect x={140} y={640} width={1100} height={36} fill="#9AA0A8" stroke="#1A1218" strokeWidth={6} />
    <rect x={180} y={676} width={20} height={184} fill="#6A7074" />
    <rect x={1180} y={676} width={20} height={184} fill="#6A7074" />
    {/* the toilet with no seat */}
    <g transform="translate(1540 860)">
      <rect x={-50} y={-200} width={100} height={120} rx={10} fill="#C8D0D4" stroke="#1A1218" strokeWidth={5} />
      <ellipse cx={0} cy={-80} rx={90} ry={26} fill="#C8D0D4" stroke="#1A1218" strokeWidth={5} />
      <path d="M -70 -76 Q 0 30 70 -76" fill="#C8D0D4" stroke="#1A1218" strokeWidth={5} />
    </g>
    {/* the wall clock */}
    <g transform="translate(960 230)">
      <circle r={80} fill="#F6EFE3" stroke="#1A1218" strokeWidth={8} />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-3} y={-72} width={6} height={14} fill="#1A1218" transform={`rotate(${i * 30})`} />)}
    </g>
    {/* high little window */}
    <rect x={1700} y={140} width={240} height={110} fill={dawn > 0 ? '#F6D0A0' : '#14183A'} stroke="#1A1218" strokeWidth={6} />
    {[1760, 1820, 1880].map((x) => <rect key={x} x={x - 4} y={140} width={8} height={110} fill="#2A2E36" />)}
    {dawn > 0 ? <path d="M 1700 250 L 1940 250 L 1400 860 L 900 860 Z" fill="#F6D0A0" opacity={0.18 * dawn} /> : null}
  </g>
);

/** The wall clock's hands at hh:mm (drawn over Cell at 960, 230). */
export const CellClock: React.FC<{ hh: number; mm: number; x?: number; y?: number; r?: number }> = ({ hh, mm, x = 960, y = 230, r = 80 }) => (
  <g transform={`translate(${x} ${y}) scale(${r / 80})`}>
    <rect x={-5} y={-44} width={10} height={48} rx={5} fill="#1A1218" transform={`rotate(${(hh % 12) * 30 + mm * 0.5})`} />
    <rect x={-3} y={-64} width={6} height={68} rx={3} fill="#1A1218" transform={`rotate(${mm * 6})`} />
    <circle r={8} fill="#E8453A" />
  </g>
);

/** The cell's bars, in front of everything. */
export const Bars: React.FC<{ x0?: number; x1?: number; o?: number }> = ({ x0 = -400, x1 = 2400, o = 1 }) => (
  <g opacity={o}>
    {Array.from({ length: Math.ceil((x1 - x0) / 120) }).map((_, i) => (
      <rect key={i} x={x0 + i * 120} y={-400} width={22} height={1900} fill="#3A3E46" stroke="#14161A" strokeWidth={4} />
    ))}
    <rect x={x0} y={60} width={x1 - x0} height={22} fill="#3A3E46" />
    <rect x={x0} y={980} width={x1 - x0} height={22} fill="#3A3E46" />
  </g>
);

/** The station's front steps in the morning. */
export const Steps: React.FC<{ t: number; id?: string }> = ({ t, id = 'stp' }) => (
  <g>
    <SkyGrad id={id} mode="dawn" h={600} />
    <Clouds t={t} o={0.5} />
    <rect x={-600} y={120} width={3200} height={560} fill="#B8B0A4" stroke="#0B0816" strokeWidth={6} />
    {[100, 500, 1420, 1820].map((x) => <rect key={x} x={x - 40} y={160} width={80} height={520} fill="#D8D0C4" stroke="#0B0816" strokeWidth={5} />)}
    <rect x={760} y={360} width={400} height={320} fill="#3A3E46" stroke="#0B0816" strokeWidth={6} />
    <text x={960} y={330} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} letterSpacing={14} fill="#2A2E36">POLICE</text>
    {Array.from({ length: 5 }).map((_, i) => (
      <rect key={i} x={-600} y={680 + i * 36} width={3200} height={36} fill={i % 2 ? '#C8C0B4' : '#D8D0C4'} stroke="#0B0816" strokeWidth={3} />
    ))}
    <rect x={-600} y={860} width={3200} height={400} fill="#9A948A" />
  </g>
);

// ---------------------------------------------------------------- the phone screens
/** A phone held up, its screen drawn by `screen` (in a 260 x 540 box centred on 0, 0). */
export const PhoneFrame: React.FC<{ x: number; y: number; s?: number; rot?: number; children: React.ReactNode }> = ({ x, y, s = 1, rot = 0, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-150} y={-300} width={300} height={600} rx={44} fill="#1A1922" stroke="#4A4858" strokeWidth={6} />
    <clipPath id="pfclip"><rect x={-130} y={-270} width={260} height={540} rx={26} /></clipPath>
    <g clipPath="url(#pfclip)">{children}</g>
    <circle cx={0} cy={-250} r={7} fill="#05050A" />
  </g>
);

/** Mo's video post: a thumbnail of you mid-jump, a growing view count, hearts. */
export const VideoPost: React.FC<{ t: number; views: number; title?: string }> = ({ t, views, title = 'MY FRIEND IS LIVING LIKE A GAME 😂' }) => (
  <g>
    <rect x={-130} y={-270} width={260} height={540} fill="#0E0E14" />
    <rect x={-130} y={-200} width={260} height={300} fill="#5A9AD8" />
    <rect x={-130} y={30} width={260} height={70} fill="#6AA84E" />
    <Fence x0={-130} x1={130} y0={-40} y1={40} />
    <g transform="translate(10 -40) scale(0.32)">
      <Hero look={YOU} pose={{ ...basePose, x: 0, y: 0, expr: 'happy', armL: { a: 150, b: 0 }, armR: { a: 150, b: 0 }, legL: { a: 50, b: -60 }, legR: { a: -30, b: -40 } }} shadow={0} />
    </g>
    <circle cx={0} cy={-50} r={34} fill="#000" opacity={0.4} />
    <path d="M -10 -66 L 18 -50 L -10 -34 Z" fill="#FFFFFF" />
    <text x={-118} y={140} fontFamily={FONT.ui} fontSize={19} fill="#F6EFE3">{title.slice(0, 22)}</text>
    <text x={-118} y={166} fontFamily={FONT.ui} fontSize={19} fill="#F6EFE3">{title.slice(22)}</text>
    <text x={-118} y={214} fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#FFD23A">{views >= 1000 ? `${Math.round(views / 1000)}K` : Math.round(views)} views</text>
    {Array.from({ length: 4 }).map((_, i) => {
      const k = ((t + i * 11) % 44) / 44;
      return <text key={i} x={90 + Math.sin(i + t / 9) * 10} y={240 - 280 * k} fontSize={30} opacity={1 - k}>❤️</text>;
    })}
  </g>
);

/** A call screen: a name, a timer and the round buttons. */
export const CallScreen: React.FC<{ t: number; name: string; status?: string }> = ({ t, name, status = 'calling...' }) => (
  <g>
    <rect x={-130} y={-270} width={260} height={540} fill="#1E2A3A" />
    <circle cx={0} cy={-120} r={60} fill="#3A4A5E" />
    <text x={0} y={-100} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3">{name[0]}</text>
    <text x={0} y={0} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#F6EFE3">{name}</text>
    <text x={0} y={40} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#9AB0C8">{status}</text>
    <circle cx={0} cy={190} r={36} fill="#E8453A" />
    <circle cx={0} cy={190} r={36 + ((t % 30) / 30) * 20} fill="none" stroke="#E8453A" strokeWidth={3} opacity={1 - (t % 30) / 30} />
  </g>
);

/** Text messages: bubbles that pop in at frames `at`. */
export const Messages: React.FC<{ t: number; from: string; msgs: { text: string; at: number }[] }> = ({ t, from, msgs }) => (
  <g>
    <rect x={-130} y={-270} width={260} height={540} fill="#F2F0EA" />
    <rect x={-130} y={-270} width={260} height={70} fill="#E2DED6" />
    <text x={0} y={-224} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#14121C">{from}</text>
    {msgs.map((m, i) => {
      const s = backOut(clamp((t - m.at) / 8));
      const lines = m.text.match(/.{1,16}(\s|$)/g) ?? [m.text];
      return t >= m.at ? (
        <g key={i} transform={`translate(-110 ${-170 + i * 150}) scale(${s})`}>
          <rect x={0} y={0} width={220} height={30 + lines.length * 30} rx={18} fill="#D8D4CC" />
          {lines.map((l, k) => (
            <text key={k} x={14} y={36 + k * 30} fontFamily={FONT.ui} fontSize={24} fill="#14121C">{l.trim()}</text>
          ))}
        </g>
      ) : null;
    })}
  </g>
);

// ---------------------------------------------------------------- poses
/** A running pose: a walk with longer strides, arms pumping, a forward lean. */
export const runPose = (x: number, phase: number, ground: number, scale = 1, facing: 1 | -1 = 1, extra: Partial<Pose> = {}): Pose => {
  const s = Math.sin(phase);
  return {
    ...walkPose(x, phase, ground, scale, {}, facing),
    y: ground - LEG_LEN * scale - Math.abs(Math.cos(phase)) * 16 * scale,
    tilt: 14 * facing,
    legL: { a: 50 * s, b: -Math.max(10, 80 * Math.sin(phase + 1.2)) },
    legR: { a: -50 * s, b: -Math.max(10, 80 * Math.sin(phase + 1.2 + Math.PI)) },
    armL: { a: -50 * s, b: 70 },
    armR: { a: 50 * s, b: 70 },
    ...extra,
  };
};

/** Bent over, hands on knees, wheezing (`t` drives the breathing). */
export const wheeze = (x: number, ground: number, scale: number, t: number, facing: 1 | -1 = 1): Pose => ({
  ...basePose, x, y: ground - LEG_LEN * scale * 0.92 + Math.sin(t / 3) * 3, scale, facing, yaw: 0.6 * facing,
  tilt: 40 * facing, headTilt: -20 * facing, armL: { a: -20, b: 30 }, armR: { a: -10, b: 30 },
  legL: { a: 10, b: -16 }, legR: { a: -10, b: -16 }, expr: 'tired',
});

/** Sitting (on a bench, a seat): hips at y, thighs forward. */
export const sitPose = (x: number, y: number, scale: number, yaw = 0, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y, scale, yaw, legL: { a: 80, b: -80 }, legR: { a: 76, b: -84 }, armL: { a: 20, b: -30 }, armR: { a: 20, b: -30 }, ...extra,
});

/** A standing pose at a ground line. */
export const standAt = (x: number, scale = 1, ground = GROUND, extra: Partial<Pose> = {}): Pose => ({ ...basePose, x, y: ground - LEG_LEN * scale, scale, ...extra });

// ---------------------------------------------------------------- shot builders
/** A "clock card": the time of day slamming in big over the blurred set, with a kicker (RULE ONE...). */
export const clockCard = (o: { clock: string; kicker?: string; Bg: SetFC; color?: string }) => bigWord({ kicker: o.kicker, word: o.clock, color: o.color ?? '#FFD23A', Bg: o.Bg, size: 230 });

/** A rule card: "RULE 3" small, the rule big, an icon drawn by `icon`. */
export const ruleCard = (o: { n: number; rule: string; sub?: string; icon?: (t: number) => React.ReactNode; color?: string }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    return (
      <g>
        <rect width={1920} height={1080} fill="#14102A" />
        {Array.from({ length: 16 }).map((_, i) => (
          <rect key={i} x={-200 + i * 160 + ((t * 2) % 160)} y={-100} width={60} height={1300} fill="#FFFFFF" opacity={0.03} transform="rotate(20 960 540)" />
        ))}
        <g transform={`translate(560 540) scale(${pop(0)})`}>
          <circle r={250} fill={o.color ?? '#FFD23A'} opacity={0.12} />
          {o.icon?.(t)}
        </g>
        <g transform={`translate(1000 400) scale(${pop(3)})`}>
          <text fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill={o.color ?? '#FFD23A'}>{`RULE ${o.n}`}</text>
        </g>
        <g transform={`translate(1000 540) scale(${pop(6)})`}>
          {o.rule.split('\n').map((l, i) => (
            <Big key={i} x={0} y={i * 110} size={100} anchor="start">{l}</Big>
          ))}
        </g>
        {o.sub ? (
          <g opacity={clamp((t - 20) / 8)}>
            <text x={1000} y={800} fontFamily={FONT.ui} fontSize={36} fill="#C8C0D8">{o.sub}</text>
          </g>
        ) : null}
        {kf(t, [[0, 0], [Math.max(1, len), 1]]) > 2 ? null : null}
      </g>
    );
  };
  return Shot;
};

/** The schematic "IN THE GAME / IN REAL LIFE" comparison: two columns that fill in. */
export const versus = (o: { game: string; real: string; gameIcon?: (t: number) => React.ReactNode; realIcon?: (t: number) => React.ReactNode; at?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const a = o.at ?? 24;
    return (
      <g>
        <g transform={camT(960, 540, kf(t, [[0, 1], [Math.max(1, len), 1.04]]))}>
          <Schematic t={t} id="vs" />
        </g>
        <rect x={958} y={160} width={4} height={760} fill={SCH.line} opacity={0.5} />
        <g opacity={clamp(t / 6)}>
          <text x={480} y={230} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#4AD06A">IN THE GAME</text>
          <g transform="translate(480 520)">{o.gameIcon?.(t)}</g>
          <text x={480} y={820} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#F6EFE3">{o.game}</text>
        </g>
        <g opacity={clamp((t - a) / 6)}>
          <text x={1440} y={230} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#FF5A4A">IN REAL LIFE</text>
          <g transform="translate(1440 520)">{o.realIcon?.(t - a)}</g>
          <text x={1440} y={820} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#F6EFE3">{o.real}</text>
        </g>
      </g>
    );
  };
  return Shot;
};

/** A plain set shot with a camera drift and anything drawn on top. */
export const setShot = (Set: SetFC, cam: [number, number, number], cam1?: [number, number, number], extra?: (t: number, len: number, f: number) => React.ReactNode, front?: (t: number, len: number, f: number) => React.ReactNode): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const [a, b, c] = cam;
    const [a1, b1, c1] = cam1 ?? cam;
    const L = Math.max(1, len);
    return (
      <g>
        <g transform={camT(kf(t, [[0, a], [L, a1]]), kf(t, [[0, b], [L, b1]]), kf(t, [[0, c], [L, c1]]))}>
          <Set t={t + 100} />
          {extra?.(t, len, f)}
        </g>
        {front?.(t, len, f)}
      </g>
    );
  };
  return Shot;
};

/** A phone held up in front of a blurred set, its screen drawn by `screen(t)`. */
export const phoneShot = (o: { Bg: SetFC; screen: (t: number, len: number) => React.ReactNode; zoom?: [number, number]; rot?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, o.zoom?.[0] ?? 1.3], [Math.max(1, len), o.zoom?.[1] ?? 1.42]]);
    return (
      <g>
        <Soft blur={16} dim={0.35}>
          <g transform={camT(960, 520, 1.5)}>
            <o.Bg t={t + 300} id="ph" />
          </g>
        </Soft>
        <g transform={`translate(960 560) scale(${z}) translate(-960 -560)`}>
          <PhoneFrame x={960} y={540} rot={o.rot ?? -3}>{o.screen(t, len)}</PhoneFrame>
          {[-1, 1].map((sd) => (
            <ellipse key={sd} cx={960 + sd * 170} cy={800} rx={60} ry={90} fill="#26232F" stroke="#100E16" strokeWidth={8} />
          ))}
        </g>
      </g>
    );
  };
  return Shot;
};

/** Thermal-camera view: everything blue-black, one hot white-yellow body in the hedge, a crosshair and a readout. */
export const thermalShot = (o: { lock?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const lock = o.lock ?? 30;
    const k = clamp((t - lock) / 10);
    const cx = kf(t, [[0, 700], [lock, 1010]], easeInOut);
    const cy = kf(t, [[0, 420], [lock, 640]], easeInOut);
    return (
      <g>
        <rect width={1920} height={1080} fill="#0A0A2A" />
        {/* the hedge and the library, cold */}
        <rect x={200} y={120} width={1520} height={500} fill="#141A4A" />
        {Array.from({ length: 22 }).map((_, i) => <circle key={i} cx={40 + i * 90} cy={640 + Math.sin(i) * 10} r={70} fill="#1A2A6A" />)}
        <rect x={0} y={660} width={1920} height={420} fill="#121A50" />
        {/* the hot body */}
        <defs>
          <radialGradient id="therm">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.35" stopColor="#FFE65A" />
            <stop offset="0.7" stopColor="#FF6A2A" />
            <stop offset="1" stopColor="#FF2A6A" stopOpacity={0} />
          </radialGradient>
        </defs>
        <g transform={`translate(1010 640) scale(${1 + 0.03 * Math.sin(t / 4)})`}>
          <ellipse cx={0} cy={0} rx={150} ry={95} fill="url(#therm)" />
          <circle cx={-90} cy={-40} r={60} fill="url(#therm)" />
        </g>
        {/* crosshair */}
        <g transform={`translate(${cx} ${cy})`} stroke={k > 0.5 ? '#FF3A2E' : '#F6EFE3'} strokeWidth={5} fill="none">
          <rect x={-160 + 40 * k} y={-120 + 30 * k} width={320 - 80 * k} height={240 - 60 * k} />
          <path d="M -220 0 L -120 0 M 120 0 L 220 0 M 0 -170 L 0 -90 M 0 90 L 0 170" />
        </g>
        <text x={60} y={80} fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3">THERMAL · WHT HOT</text>
        <text x={60} y={1030} fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3">{`TGT 37.0°C   ALT 900 FT`}</text>
        {k > 0.5 ? <text x={1860} y={80} textAnchor="end" fontFamily={FONT.ui} fontSize={40} fill="#FF3A2E">LOCKED</text> : null}
        {Array.from({ length: 30 }).map((_, i) => (
          <rect key={i} x={0} y={i * 36 + ((t * 3) % 36)} width={1920} height={2} fill="#FFFFFF" opacity={0.04} />
        ))}
        {kf(t, [[0, 0], [Math.max(1, len), 1]]) > 2 ? null : null}
      </g>
    );
  };
  return Shot;
};

export { Hero, basePose, camT, clamp, kf, backOut, easeOut, faceAt, idleBlink, talkAt, FONT, Glow, rnd };
export type { Pose, Expr, Word, ShotProps, Look };
