import React from 'react';
import {
  makeRoom, Box, RoomShell, FloorShadow, WallFrame, Glow, Cone, LightVeil, FloorPlant, NightSky, Stars, Moon, LEG_LEN, rnd, lerp, clamp, Pt,
} from '../../engine';

// The sets of "What if electricity disappeared forever?": a living room (the game, the TV, the window onto the city),
// a modern street at night or by day (houses, a garage, street lamps, a traffic light, power lines, a far skyline
// that goes dark in a sweep), the city from a roof under the Milky Way, a dark hospital corridor, the countryside
// (a road by day, a valley at night with one impossible light). Every set takes `power` (1 on, 0 off) where it
// matters, so the same set plays before and after 8:14 PM.

const P0 = '#100E16';

// ---------------------------------------------------------------- props
/** A candle on a saucer: x, y the saucer, s its scale; the flame flickers on t. */
export const Candle: React.FC<{ x: number; y: number; s?: number; t: number; seed?: number; glow?: number; h?: number }> = ({ x, y, s = 1, t, seed = 1, glow = 1, h = 1 }) => {
  const fl = 1 + 0.08 * Math.sin(t / 2.3 + seed) + 0.05 * Math.sin(t / 1.3 + seed * 2);
  const sway = Math.sin(t / 3.1 + seed) * 3;
  const top = -70 * h;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow > 0 ? <Glow x={0} y={top - 30} r={260 * fl} o={0.75 * glow} /> : null}
      <ellipse cx={0} cy={0} rx={42} ry={11} fill="#3A3442" stroke={P0} strokeWidth={4} />
      <path d={`M -16 0 L -16 ${top} Q -6 ${top - 5} 2 ${top - 1} Q 10 ${top - 6} 16 ${top} L 16 0 Z`} fill="#FFF1D6" stroke={P0} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M 6 ${top} Q 10 ${top + 18} 8 ${top + 30} Q 12 ${top + 34} 14 ${top + 28} L 14 ${top}`} fill="#F2DDB6" />
      <path d={`M 0 ${top - 2} L 1 ${top - 12}`} stroke={P0} strokeWidth={3} strokeLinecap="round" />
      <g transform={`translate(1 ${top - 10}) scale(1 ${fl}) skewX(${sway})`}>
        <path d="M 0 -46 Q 16 -20 12 -8 Q 8 2 0 2 Q -8 2 -12 -8 Q -16 -20 0 -46 Z" fill="#FFB12A" />
        <path d="M 0 -32 Q 8 -16 6 -8 Q 4 -2 0 -2 Q -4 -2 -6 -8 Q -8 -16 0 -32 Z" fill="#FFF3B0" />
      </g>
    </g>
  );
};

/** A flat-screen TV seen square-on: `on` 0..1 shows the game, else a black glass with a reflection. */
export const GameScreen: React.FC<{ x: number; y: number; w: number; h: number; t: number; on: number; glitch?: number }> = ({ x, y, w, h, t, on, glitch = 0 }) => {
  const id = `gs${Math.round(x)}${Math.round(y)}`;
  const run = (t * 6) % (w * 0.8);
  return (
    <g>
      <rect x={x - 8} y={y - 8} width={w + 16} height={h + 16} rx={6} fill="#0B0A10" stroke={P0} strokeWidth={4} />
      <clipPath id={id}>
        <rect x={x} y={y} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={x} y={y} width={w} height={h} fill="#06060A" />
        {on > 0 ? (
          <g opacity={on} transform={glitch ? `translate(${Math.sin(t * 3) * 8 * glitch} 0)` : undefined}>
            <rect x={x} y={y} width={w} height={h} fill="#3A6AE0" />
            <rect x={x} y={y + h * 0.55} width={w} height={h * 0.45} fill="#2E9A5A" />
            {[0, 1, 2, 3].map((i) => (
              <ellipse key={i} cx={x + ((i * w * 0.33 - t * 2) % (w * 1.3)) + w * 0.2} cy={y + h * (0.18 + (i % 2) * 0.1)} rx={w * 0.08} ry={h * 0.05} fill="#FFFFFF" opacity={0.85} />
            ))}
            {[0.15, 0.45, 0.75].map((k, i) => (
              <rect key={`pl${i}`} x={x + w * k} y={y + h * (0.42 - i * 0.04)} width={w * 0.14} height={h * 0.05} fill="#8A5A3A" />
            ))}
            {/* the hero of the game, mid-jump, and the boss */}
            <rect x={x + w * 0.1 + run} y={y + h * 0.42 - Math.abs(Math.sin(t / 4)) * h * 0.12} width={w * 0.05} height={h * 0.12} fill="#F07A2A" />
            <rect x={x + w * 0.72} y={y + h * 0.26} width={w * 0.16} height={h * 0.3} fill="#7A2AA0" />
            <circle cx={x + w * 0.77} cy={y + h * 0.34} r={w * 0.015} fill="#FFE27A" />
            <circle cx={x + w * 0.83} cy={y + h * 0.34} r={w * 0.015} fill="#FFE27A" />
            {/* the HUD: one level to go, the boss's health nearly gone */}
            <rect x={x + w * 0.62} y={y + h * 0.07} width={w * 0.32} height={h * 0.06} fill="#0B0816" />
            <rect x={x + w * 0.625} y={y + h * 0.08} width={w * 0.04} height={h * 0.04} fill="#FF3A3A" />
            <text x={x + w * 0.05} y={y + h * 0.13} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={h * 0.09} fill="#FFFFFF">LEVEL 99</text>
          </g>
        ) : (
          <path d={`M ${x + w * 0.1} ${y + h} L ${x + w * 0.45} ${y} L ${x + w * 0.6} ${y} L ${x + w * 0.25} ${y + h} Z`} fill="#FFFFFF" opacity={0.05} />
        )}
      </g>
    </g>
  );
};

/** A game controller held in both hands, from the front, small. */
export const Controller: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -60 -18 Q -40 -30 0 -26 Q 40 -30 60 -18 Q 78 20 62 34 Q 48 40 34 18 L -34 18 Q -48 40 -62 34 Q -78 20 -60 -18 Z" fill="#26232F" stroke={P0} strokeWidth={5} />
    <circle cx={34} cy={-6} r={6} fill="#E8252A" />
    <circle cx={46} cy={-14} r={6} fill="#2E9A5A" />
    <path d="M -42 -10 L -26 -10 M -34 -18 L -34 -2" stroke="#4A4456" strokeWidth={6} strokeLinecap="round" />
  </g>
);

/** A modern hatchback side-on: x the middle, y the ground, `lights` its head and tail lights. */
export const Car: React.FC<{ x: number; y: number; s?: number; color?: string; lights?: number; flip?: boolean }> = ({ x, y, s = 1, color = '#3E6E9A', lights = 0, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={4} rx={230} ry={16} fill="#000" opacity={0.35} />
    <path d="M -220 -40 L -214 -96 Q -200 -112 -150 -116 L -96 -176 Q -80 -190 -40 -190 L 80 -190 Q 120 -190 140 -170 L 190 -118 Q 222 -110 226 -84 L 228 -40 Z" fill={color} stroke={P0} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -84 -120 L -50 -170 L 20 -170 L 20 -120 Z M 36 -120 L 36 -170 L 98 -170 Q 112 -170 122 -160 L 160 -120 Z" fill="#1A2030" />
    <path d="M -40 -168 L -20 -168 L -60 -122 L -76 -122 Z" fill="#FFFFFF" opacity={0.12} />
    <path d="M 28 -118 L 28 -44" stroke={P0} strokeWidth={4} opacity={0.6} />
    <rect x={-6} y={-100} width={22} height={6} rx={3} fill={P0} opacity={0.6} />
    <rect x={-222} y={-58} width={452} height={10} fill="#000" opacity={0.18} />
    {[-140, 150].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-36} r={40} fill="#16141C" stroke={P0} strokeWidth={5} />
        <circle cx={wx} cy={-36} r={18} fill="#6A6878" />
      </g>
    ))}
    <rect x={212} y={-100} width={16} height={18} rx={4} fill={lights > 0 ? '#FFF4C8' : '#8A8A90'} />
    <rect x={-222} y={-100} width={12} height={22} rx={3} fill={lights > 0 ? '#FF3030' : '#6A2A2A'} />
    {lights > 0 ? (
      <g opacity={lights}>
        <Glow x={240} y={-90} r={120} o={0.9} />
        <path d="M 228 -98 L 620 -150 L 620 -10 L 228 -84 Z" fill="#FFF4C8" opacity={0.18} />
        <Glow x={-224} y={-90} r={70} kind="red" o={0.8} />
      </g>
    ) : null}
  </g>
);

/** A bicycle side-on, wheels turning on `spin`. x the middle, y the ground. */
export const Bike: React.FC<{ x: number; y: number; s?: number; spin?: number; color?: string; flip?: boolean }> = ({ x, y, s = 1, spin = 0, color = '#E8252A', flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {[-95, 95].map((wx) => (
      <g key={wx} transform={`translate(${wx} -62)`}>
        <circle r={60} fill="none" stroke={P0} strokeWidth={9} />
        <circle r={56} fill="none" stroke="#4A4456" strokeWidth={3} />
        {[0, 60, 120].map((a) => (
          <path key={a} d="M -54 0 L 54 0" stroke="#5A5466" strokeWidth={2.5} transform={`rotate(${a + spin})`} />
        ))}
        <circle r={7} fill={P0} />
      </g>
    ))}
    <path d="M -95 -62 L -20 -62 L 40 -150 L -50 -150 Z M -20 -62 L -60 -170 M 95 -62 L 60 -190 M 40 -150 L 66 -168" stroke={color} strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    <path d="M -80 -176 L -36 -176" stroke={P0} strokeWidth={12} strokeLinecap="round" />
    <path d="M 50 -196 L 84 -192" stroke={P0} strokeWidth={8} strokeLinecap="round" />
    <circle cx={-20} cy={-62} r={12} fill="#3A3444" stroke={P0} strokeWidth={4} />
  </g>
);

/** The bike trailer: a little two-wheeled cart, loaded or empty; `ellie` leaves room for someone in a blanket. */
export const Trailer: React.FC<{ x: number; y: number; s?: number; spin?: number; load?: number }> = ({ x, y, s = 1, spin = 0, load = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {load > 0 ? (
      <g>
        <rect x={-120} y={-170} width={90} height={60} rx={8} fill="#6A8AA8" stroke={P0} strokeWidth={5} />
        <path d="M -20 -110 L -20 -190 Q 30 -200 70 -186 L 76 -110 Z" fill="#8A4A5A" stroke={P0} strokeWidth={5} />
        <rect x={-110} y={-200} width={36} height={40} rx={6} fill="#A9D4F0" stroke={P0} strokeWidth={4} opacity={0.9} />
        <rect x={-66} y={-206} width={36} height={46} rx={6} fill="#A9D4F0" stroke={P0} strokeWidth={4} opacity={0.9} />
      </g>
    ) : null}
    <path d="M -140 -120 L 120 -120 L 108 -50 L -128 -50 Z" fill="#2E5A8A" stroke={P0} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 120 -90 L 260 -70" stroke={P0} strokeWidth={8} strokeLinecap="round" />
    <g transform="translate(0 -46)">
      <circle r={44} fill="none" stroke={P0} strokeWidth={8} />
      {[0, 60, 120].map((a) => (
        <path key={a} d="M -40 0 L 40 0" stroke="#5A5466" strokeWidth={2.5} transform={`rotate(${a + spin})`} />
      ))}
    </g>
  </g>
);

/** A kettle barbecue with smoke, x y its feet. */
export const Barbecue: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => {
      const k = ((t * 0.8 + i * 30) % 90) / 90;
      return <circle key={i} cx={Math.sin(t / 10 + i) * 20 + k * 30} cy={-190 - k * 220} r={30 + k * 50} fill="#D8D0D8" opacity={0.35 * (1 - k)} />;
    })}
    <path d="M -60 0 L -30 -110 M 60 0 L 30 -110 M 0 0 L 0 -110" stroke="#2A2632" strokeWidth={8} />
    <path d="M -90 -150 Q -86 -84 0 -80 Q 86 -84 90 -150 Z" fill="#1E1C26" stroke={P0} strokeWidth={6} />
    <path d="M -96 -150 L 96 -150" stroke="#5A5466" strokeWidth={6} />
    {[-60, -10, 40].map((sx, i) => (
      <g key={i}>
        <ellipse cx={sx + 10} cy={-158} rx={26} ry={9} fill="#8A3A2A" stroke={P0} strokeWidth={3} />
        <path d={`M ${sx - 6} -160 L ${sx + 24} -156`} stroke="#4A1A12" strokeWidth={3} />
      </g>
    ))}
    <Glow x={0} y={-150} r={120} kind="red" o={0.4} />
  </g>
);

/** A tub of ice cream (from the front), lid on or off. */
export const IceCream: React.FC<{ x: number; y: number; s?: number; open?: boolean; color?: string; melt?: number }> = ({ x, y, s = 1, open = false, color = '#F6B8C8', melt = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -50 -90 L 50 -90 L 42 0 L -42 0 Z" fill="#F6EFE3" stroke={P0} strokeWidth={5} />
    <rect x={-46} y={-62} width={92} height={28} fill="#E8252A" />
    <text x={0} y={-41} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={20} fill="#FFFFFF">ICE CREAM</text>
    {open ? (
      <g>
        <ellipse cx={0} cy={-90} rx={50} ry={12} fill={color} stroke={P0} strokeWidth={4} />
        <path d={`M -30 -90 Q -30 ${-90 + 20 * melt} -26 ${-90 + 30 * melt} M 20 -90 Q 22 ${-90 + 14 * melt} 18 ${-90 + 24 * melt}`} stroke={color} strokeWidth={10} strokeLinecap="round" />
      </g>
    ) : (
      <ellipse cx={0} cy={-92} rx={54} ry={12} fill="#E8252A" stroke={P0} strokeWidth={4} />
    )}
  </g>
);

/** A bottle of water, x y its base. */
export const WaterBottle: React.FC<{ x: number; y: number; s?: number; level?: number }> = ({ x, y, s = 1, level = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -18 0 L -18 -80 Q -18 -96 -8 -104 L -8 -116 L 8 -116 L 8 -104 Q 18 -96 18 -80 L 18 0 Z" fill="#CFE8F8" stroke={P0} strokeWidth={4} opacity={0.95} />
    <path d={`M -15 -3 L -15 ${-3 - 76 * level} L 15 ${-3 - 76 * level} L 15 -3 Z`} fill="#6AB8E8" opacity={0.6} />
    <rect x={-10} y={-124} width={20} height={10} rx={2} fill="#2E6EC8" stroke={P0} strokeWidth={3} />
    <rect x={-18} y={-60} width={36} height={22} fill="#2E6EC8" opacity={0.8} />
  </g>
);

/** A can of beans, front-on. */
export const Can: React.FC<{ x: number; y: number; s?: number; label?: string }> = ({ x, y, s = 1, label = '#C84A2A' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-24} y={-62} width={48} height={62} rx={4} fill="#9A98A6" stroke={P0} strokeWidth={4} />
    <rect x={-24} y={-50} width={48} height={38} fill={label} />
    <ellipse cx={0} cy={-31} rx={12} ry={8} fill="#F6EFE3" opacity={0.8} />
  </g>
);

/** A baseball bat, held at the handle (x, y), angle in degrees from straight up. */
export const Bat: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -5 20 L -7 -60 Q -16 -170 -14 -200 Q 0 -214 14 -200 Q 16 -170 7 -60 L 5 20 Z" fill="#C89A5A" stroke={P0} strokeWidth={5} />
    <rect x={-8} y={4} width={16} height={18} rx={4} fill="#3A2A20" />
  </g>
);

/** A folded paper map, opened. */
export const PaperMap: React.FC<{ x: number; y: number; s?: number; rot?: number; route?: number }> = ({ x, y, s = 1, rot = 0, route = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -150 -100 L -50 -84 L 50 -100 L 150 -84 L 150 96 L 50 80 L -50 96 L -150 80 Z" fill="#EADDB8" stroke={P0} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -50 -84 L -50 96 M 50 -100 L 50 80" stroke="#C8B890" strokeWidth={3} />
    <path d="M -140 40 Q -80 -10 -20 20 Q 40 50 140 -40" stroke="#6AA8D8" strokeWidth={8} fill="none" />
    <path d="M -130 -60 Q -60 -40 10 -60 Q 80 -80 130 20" stroke="#C84A2A" strokeWidth={4} fill="none" strokeDasharray="10 6" />
    <ellipse cx={-90} cy={60} rx={30} ry={18} fill="#9AB880" opacity={0.7} />
    <ellipse cx={80} cy={40} rx={40} ry={22} fill="#9AB880" opacity={0.7} />
    {route > 0 ? (
      <g>
        <path d="M -120 -52 Q -40 0 20 -10 Q 90 -20 118 26" stroke="#E8252A" strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={`${360 * route} 400`} />
        <circle cx={-120} cy={-52} r={10} fill="#E8252A" />
        {route > 0.95 ? <path d="M 110 10 L 126 10 L 118 -6 Z M 112 30 L 124 30" stroke={P0} strokeWidth={3} fill="#F6EFE3" /> : null}
      </g>
    ) : null}
  </g>
);

/** A board game laid flat, seen from above at a slant (a ring of coloured squares, pieces on it). */
export const BoardGame: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => {
  const cols = ['#E8252A', '#FFD23A', '#2E9A5A', '#3A6AE0'];
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * 0.45})`}>
      <rect x={-150} y={-150} width={300} height={300} rx={10} fill="#F2E6CC" stroke={P0} strokeWidth={8} />
      {Array.from({ length: 24 }).map((_, i) => {
        const side = Math.floor(i / 6);
        const k = i % 6;
        const px = side === 0 ? -125 + k * 50 : side === 1 ? 125 : side === 2 ? 125 - k * 50 : -125;
        const py = side === 0 ? -125 : side === 1 ? -125 + k * 50 : side === 2 ? 125 : 125 - k * 50;
        return <rect key={i} x={px - 20} y={py - 20} width={40} height={40} fill={cols[i % 4]} opacity={0.85} />;
      })}
      {[0, 1, 2].map((i) => (
        <circle key={`pc${i}`} cx={-60 + i * 50} cy={10 + Math.sin(t / 8 + i) * 4} r={18} fill={cols[(i + 1) % 4]} stroke={P0} strokeWidth={6} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- the Milky Way
/** A soft band of light and dense small stars across the sky, from (x0, y0) to (x1, y1). */
export const MilkyWay: React.FC<{ x0: number; y0: number; x1: number; y1: number; o?: number; t: number; w?: number }> = ({ x0, y0, x1, y1, o = 1, t, w = 260 }) => {
  if (o <= 0) return null;
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  const len = Math.hypot(x1 - x0, y1 - y0);
  return (
    <g opacity={o} transform={`translate(${x0} ${y0}) rotate(${ang})`}>
      <g filter="url(#blur16)">
        {Array.from({ length: 18 }).map((_, i) => {
          const u = (i + 0.5) / 18;
          const wv = w * (0.25 + 0.35 * Math.sin(u * Math.PI) + rnd(88, i) * 0.2);
          return <ellipse key={i} cx={u * len} cy={(rnd(89, i) - 0.5) * w * 0.3} rx={len / 12} ry={wv} fill={i % 3 ? '#9AA8E8' : '#E8D0F0'} opacity={0.1 + 0.08 * Math.sin(u * Math.PI)} />;
        })}
        {Array.from({ length: 10 }).map((_, i) => {
          const u = 0.2 + (i / 10) * 0.6;
          return <ellipse key={`c${i}`} cx={u * len} cy={(rnd(87, i) - 0.5) * w * 0.15} rx={len / 16} ry={w * (0.1 + rnd(86, i) * 0.1)} fill="#FFF2E2" opacity={0.16} />;
        })}
        {Array.from({ length: 9 }).map((_, i) => (
          <ellipse key={`d${i}`} cx={(0.1 + i * 0.1) * len} cy={(rnd(85, i) - 0.4) * w * 0.12} rx={len / 18} ry={w * (0.03 + rnd(84, i) * 0.04)} fill="#06061A" opacity={0.5} />
        ))}
      </g>
      {Array.from({ length: 260 }).map((_, i) => {
        const u = rnd(91, i);
        const v = (rnd(92, i) + rnd(93, i) + rnd(94, i) - 1.5) * w * 0.55;
        const tw = 0.6 + 0.4 * Math.sin(t / (6 + rnd(95, i) * 8) + i);
        return <circle key={i} cx={u * len} cy={v} r={0.6 + rnd(96, i) * 1.6} fill="#F4F0FF" opacity={tw * (0.5 + rnd(97, i) * 0.5)} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- living room
// One-point perspective. The TV hangs on the left wall; the sofa stands against the right wall, facing it, so the
// player is seen three-quarter on; the window on the back wall looks out over the city. `power` drives the lamps, the
// TV and the city lights; `candles` are lit candles in world points (they open holes in the dark veil).
export const LIVING = makeRoom({ x: 960, y: 470 }, { x0: 540, x1: 1380, y0: 300, y1: 700 }, 3.4);
const LR = { wall: '#3A3A56', side: '#2F2F4A', floor: '#3A2A2A', ceiling: '#1A1A2C', lines: '#2A1E20' };
/** Where someone sits on the sofa (u along the sofa), facing the TV: hip and scale. */
export const sofaSit = (w: number) => {
  const p = LIVING.P(0.86, 0.83, w);
  return { x: p.x, y: p.y, scale: (0.62 * 400 * LIVING.s(w)) / 378 };
};
export const LIVING_TV = (() => {
  const a = LIVING.P(0, 0.3, 0.32);
  const b = LIVING.P(0, 0.62, 0.62);
  return { a, b };
})();
export const LIVING_WIN = { x0: 1000, x1: 1290, y0: 350, y1: 560 };

export const CityWindowView: React.FC<{ x0: number; y0: number; x1: number; y1: number; t: number; power: number; sweep?: number; id: string; stars?: number }> = ({ x0, y0, x1, y1, t, power, sweep, id, stars = 0 }) => {
  const w = x1 - x0;
  const h = y1 - y0;
  return (
    <g>
      <clipPath id={id}>
        <rect x={x0} y={y0} width={w} height={h} />
      </clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={x0} y={y0} width={w} height={h} fill={power > 0.5 ? '#2A2A5A' : '#0C0E24'} />
        <rect x={x0} y={y0 + h * 0.55} width={w} height={h * 0.45} fill={power > 0.5 ? '#8A4A6A' : '#141630'} opacity={0.6} />
        <Stars seed={41} x0={x0} y0={y0} w={w} h={h * 0.6} t={t} n={Math.round(8 + 60 * (1 - power) + 60 * stars)} o={0.5 + 0.5 * (1 - power)} />
        {Array.from({ length: 14 }).map((_, i) => {
          const bx = x0 + (i / 14) * w * 1.05 - 10;
          const bh = h * (0.18 + rnd(42, i) * 0.4);
          const lit = sweep === undefined ? power : clamp((bx - x0) / w > sweep ? 1 : 0);
          return (
            <g key={i}>
              <rect x={bx} y={y1 - bh} width={w / 14 + 2} height={bh} fill="#161428" />
              {Array.from({ length: 6 }).map((__, k) => {
                const q = rnd(43 + i, k);
                return q > 0.45 && lit > 0.5 ? <rect key={k} x={bx + 4 + (k % 2) * 9} y={y1 - bh + 8 + Math.floor(k / 2) * 14} width={5} height={7} fill="#FFC27A" opacity={0.7} /> : null;
              })}
            </g>
          );
        })}
      </g>
    </g>
  );
};

export const LivingRoom: React.FC<{ t: number; id?: string; power?: number; candles?: Pt[]; tv?: number; sweep?: number; veil?: number }> = ({ t, id = 'lr', power = 1, candles = [], tv, sweep, veil }) => {
  const r = LIVING;
  const { P, Q } = r;
  const tvOn = tv ?? power;
  const tvA = P(0, 0.3, 0.3);
  const tvB = P(0, 0.62, 0.6);
  const lampTop = P(0.94, 0.42, 0.26);
  const lampFoot = P(0.94, 1, 0.26);
  const pend = P(0.5, 0.22, 0.45);
  const lights: [number, number, number][] = [
    ...(power > 0 ? ([[pend.x, pend.y + 60, 520], [lampTop.x, lampTop.y, 360]] as [number, number, number][]) : []),
    ...(tvOn > 0 ? ([[tvA.x + 60, (tvA.y + tvB.y) / 2, 380]] as [number, number, number][]) : []),
    ...candles.map((c) => [c.x, c.y - 90, 330] as [number, number, number]),
    [(LIVING_WIN.x0 + LIVING_WIN.x1) / 2, (LIVING_WIN.y0 + LIVING_WIN.y1) / 2, power > 0 ? 200 : 150],
  ];
  return (
    <g>
      <RoomShell r={r} id={id} wall={LR.wall} side={LR.side} floorC={LR.floor} ceiling={LR.ceiling} lines={LR.lines} />
      {/* the window and its city */}
      <CityWindowView x0={LIVING_WIN.x0} y0={LIVING_WIN.y0} x1={LIVING_WIN.x1} y1={LIVING_WIN.y1} t={t} power={power} sweep={sweep} id={`${id}cw`} />
      <g fill="#1E1824">
        <rect x={LIVING_WIN.x0 - 12} y={LIVING_WIN.y0 - 12} width={LIVING_WIN.x1 - LIVING_WIN.x0 + 24} height={14} />
        <rect x={LIVING_WIN.x0 - 12} y={LIVING_WIN.y1 - 2} width={LIVING_WIN.x1 - LIVING_WIN.x0 + 24} height={12} />
        <rect x={LIVING_WIN.x0 - 12} y={LIVING_WIN.y0 - 12} width={14} height={LIVING_WIN.y1 - LIVING_WIN.y0 + 22} />
        <rect x={LIVING_WIN.x1 - 2} y={LIVING_WIN.y0 - 12} width={14} height={LIVING_WIN.y1 - LIVING_WIN.y0 + 22} />
        <rect x={(LIVING_WIN.x0 + LIVING_WIN.x1) / 2 - 5} y={LIVING_WIN.y0} width={10} height={LIVING_WIN.y1 - LIVING_WIN.y0} />
      </g>
      {[LIVING_WIN.x0 - 70, LIVING_WIN.x1 + 6].map((cx, i) => (
        <path key={i} d={`M ${cx} ${LIVING_WIN.y0 - 24} L ${cx + 64} ${LIVING_WIN.y0 - 24} L ${cx + 60} ${LIVING_WIN.y1 + 90} Q ${cx + 32} ${LIVING_WIN.y1 + 96} ${cx + 4} ${LIVING_WIN.y1 + 90} Z`} fill="#3E5A5A" opacity={0.9} />
      ))}
      {/* back wall: a bookshelf, two frames, a clock */}
      <Box r={r} u={[0.04, 0.3]} v={[0.28, 1]} w={[0, 0.07]} front="#4A3638" top="#5A4446" side="#3A2A2C" rim />
      {[0.4, 0.58, 0.76].map((v, i) => (
        <g key={`sh${i}`}>
          <polygon points={Q([[0.05, v, 0.07], [0.29, v, 0.07], [0.29, v + 0.012, 0.07], [0.05, v + 0.012, 0.07]])} fill="#2A1E20" />
          {Array.from({ length: 8 }).map((_, k) => {
            const a = P(0.06 + k * 0.028, v - 0.12 + rnd(i + 5, k) * 0.03, 0.07);
            const b = P(0.06 + k * 0.028 + 0.022, v, 0.07);
            return <rect key={k} x={a.x} y={a.y} width={b.x - a.x} height={b.y - a.y} fill={['#C84A3A', '#3A6A8A', '#D8B04A', '#4A7A5A', '#8A5A8A'][(k + i) % 5]} opacity={0.8} />;
          })}
        </g>
      ))}
      <WallFrame x={780} y={360} w={120} h={90} art={2} />
      <WallFrame x={1330} y={390} w={40} h={60} art={1} />
      {/* the left wall: the TV on a low cabinet */}
      <polygon points={Q([[0, 0.72, 0.26], [0, 0.72, 0.66], [0, 1, 0.66], [0, 1, 0.26]])} fill="#2A2234" />
      <polygon points={Q([[0, 0.72, 0.26], [0.06, 0.72, 0.26], [0.06, 0.72, 0.66], [0, 0.72, 0.66]])} fill="#3A3044" />
      <polygon points={Q([[0, 0.3, 0.3], [0, 0.3, 0.6], [0, 0.62, 0.6], [0, 0.62, 0.3]])} fill="#0B0A10" stroke={P0} strokeWidth={6} />
      {tvOn > 0 ? (
        <g opacity={tvOn}>
          <polygon points={Q([[0, 0.32, 0.31], [0, 0.32, 0.59], [0, 0.6, 0.59], [0, 0.6, 0.31]])} fill="#3A6AE0" />
          <polygon points={Q([[0, 0.48, 0.31], [0, 0.48, 0.59], [0, 0.6, 0.59], [0, 0.6, 0.31]])} fill="#2E9A5A" />
          <polygon points={Q([[0, 0.4, 0.4], [0, 0.4, 0.43], [0, 0.48, 0.43], [0, 0.48, 0.4]])} fill="#F07A2A" />
          <polygon points={Q([[0, 0.34, 0.5], [0, 0.34, 0.56], [0, 0.48, 0.56], [0, 0.48, 0.5]])} fill="#7A2AA0" />
          <polygon points={Q([[0.02, 1, 0.3], [0.3, 1, 0.3], [0.5, 1, 0.75], [0.02, 1, 0.75]])} fill="#6A9AFF" opacity={0.12} style={{ mixBlendMode: 'screen' }} />
          <Glow x={(tvA.x + tvB.x) / 2 + 40} y={(tvA.y + tvB.y) / 2} r={420} kind="cool" o={0.55} />
        </g>
      ) : null}
      {/* a console under it, a plant beside it */}
      <polygon points={Q([[0.02, 0.69, 0.4], [0.02, 0.69, 0.5], [0.02, 0.72, 0.5], [0.02, 0.72, 0.4]])} fill="#1E1C26" />
      {power > 0 ? <circle cx={P(0.02, 0.705, 0.42).x} cy={P(0.02, 0.705, 0.42).y} r={4} fill="#5AF0A0" /> : null}
      <FloorPlant r={r} u={0.04} w={0.14} size={1.1} />
      {/* the rug and the coffee table */}
      <polygon points={Q([[0.22, 1, 0.38], [0.78, 1, 0.38], [0.82, 1, 0.8], [0.18, 1, 0.8]])} fill="#5A3A4A" />
      <polygon points={Q([[0.25, 1, 0.41], [0.75, 1, 0.41], [0.79, 1, 0.77], [0.21, 1, 0.77]])} fill="none" stroke="#7A5060" strokeWidth={5} />
      <FloorShadow r={r} u={[0.36, 0.64]} w={[0.48, 0.66]} />
      <Box r={r} u={[0.36, 0.64]} v={[0.86, 0.9]} w={[0.48, 0.66]} front="#5A4038" top="#7A5747" side="#3A2826" rim />
      {[[0.38, 0.5], [0.62, 0.5], [0.38, 0.64], [0.62, 0.64]].map(([u, w], i) => (
        <polygon key={`tl${i}`} points={Q([[u - 0.01, 0.9, w], [u + 0.01, 0.9, w], [u + 0.01, 1, w], [u - 0.01, 1, w]])} fill="#3A2826" />
      ))}
      {/* snacks on the table: a bowl of crisps and a can */}
      {(() => {
        const b = P(0.45, 0.86, 0.57);
        const c = P(0.56, 0.86, 0.55);
        const k = r.s(0.57) / 2.2;
        return (
          <g>
            <path d={`M ${b.x - 40 * k} ${b.y - 8 * k} Q ${b.x} ${b.y + 26 * k} ${b.x + 40 * k} ${b.y - 8 * k} Z`} fill="#C84A3A" />
            {[-20, -4, 12, 26].map((dx, i) => (
              <ellipse key={i} cx={b.x + dx * k} cy={b.y - 12 * k} rx={10 * k} ry={6 * k} fill="#F2C84A" />
            ))}
            <rect x={c.x - 10 * k} y={c.y - 34 * k} width={20 * k} height={34 * k} rx={3 * k} fill="#2E9AC8" />
          </g>
        );
      })()}
      {/* the sofa against the right wall, facing the TV */}
      <FloorShadow r={r} u={[0.74, 1]} w={[0.36, 0.86]} o={0.45} />
      <Box r={r} u={[0.92, 1]} v={[0.6, 1]} w={[0.36, 0.86]} front="#2E4A6A" top="#3A5A7E" side="#243C58" />
      <Box r={r} u={[0.76, 0.98]} v={[0.8, 1]} w={[0.36, 0.86]} front="#2E4A6A" top="#3E608A" side="#243C58" rim />
      <Box r={r} u={[0.74, 0.98]} v={[0.7, 1]} w={[0.32, 0.38]} front="#2A4462" top="#3A5A7E" side="#22385A" />
      {/* the floor lamp at the sofa's back end */}
      <path d={`M ${lampFoot.x} ${lampFoot.y} L ${lampTop.x} ${lampTop.y}`} stroke="#14121A" strokeWidth={6} />
      <ellipse cx={lampFoot.x} cy={lampFoot.y} rx={30} ry={7} fill="#14121A" />
      <path d={`M ${lampTop.x - 34} ${lampTop.y} L ${lampTop.x + 34} ${lampTop.y} L ${lampTop.x + 22} ${lampTop.y - 54} L ${lampTop.x - 22} ${lampTop.y - 54} Z`} fill={power > 0 ? '#F2D6A0' : '#4A4250'} stroke={P0} strokeWidth={4} />
      {power > 0 ? <Glow x={lampTop.x} y={lampTop.y - 20} r={260} o={0.7 * power} /> : null}
      {/* the pendant over the table */}
      {(() => {
        const top = P(0.5, 0, 0.45);
        return (
          <g>
            <path d={`M ${top.x} ${top.y} L ${pend.x} ${pend.y - 30}`} stroke="#120E16" strokeWidth={3} />
            <path d={`M ${pend.x - 20} ${pend.y - 32} L ${pend.x + 20} ${pend.y - 32} L ${pend.x + 54} ${pend.y} L ${pend.x - 54} ${pend.y} Z`} fill="#1C1620" />
            <ellipse cx={pend.x} cy={pend.y} rx={54} ry={9} fill={power > 0 ? '#FFE2B0' : '#3A3440'} />
            {power > 0 ? (
              <g opacity={power}>
                <Cone d={`M ${pend.x - 50} ${pend.y} L ${pend.x + 50} ${pend.y} L ${pend.x + 300} ${pend.y + 560} L ${pend.x - 300} ${pend.y + 560} Z`} o={0.25} />
                <Glow x={pend.x} y={pend.y + 6} r={260} o={0.55} />
              </g>
            ) : null}
          </g>
        );
      })()}
      {/* the light: lamps and the TV while there's power, then only candles and the window */}
      <LightVeil id={`${id}v`} lights={lights} o={veil ?? (power > 0 ? 0.35 : 0.78)} />
      {candles.map((c, i) => (
        <Candle key={i} x={c.x} y={c.y} s={r.s(0.55) / 2.6} t={t} seed={i + 1} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- the street
// A residential street seen square-on from the far kerb: four houses and an apartment block, a garage with its door,
// trees, a street lamp every 600 units, a traffic light at the corner, power poles and their wires, a parked car, the
// city's towers behind the roofs. `mode` night (default), day or dusk; `power` the lights; `sweep` 0..1 runs the
// blackout across the far city from left to right; `milky` the Milky Way.
export const STREETM = { feet: 830, kerb: 862, horizon: 640 };
export const streetHip = (scale = 1) => STREETM.feet - LEG_LEN * scale;

const HOUSES = [
  { x: -380, w: 420, h: 470, wall: '#5A6A7A', roof: '#2E2A3A', door: '#8A3A3A', kind: 'house' },
  { x: 60, w: 380, h: 420, wall: '#8A6A5A', roof: '#3A2A2A', door: '#2E4A6A', kind: 'garage' },
  { x: 460, w: 520, h: 660, wall: '#6A5060', roof: '#2A2232', door: '#3A2A2A', kind: 'block' },
  { x: 1000, w: 400, h: 450, wall: '#5E7A6A', roof: '#2A3230', door: '#C89A3A', kind: 'house' },
  { x: 1420, w: 420, h: 430, wall: '#7A6A8A', roof: '#2E2A3E', door: '#8A3A5A', kind: 'house' },
  { x: 1860, w: 440, h: 480, wall: '#6A5A4A', roof: '#2E2622', door: '#3A5A4A', kind: 'house' },
];

export const StreetModern: React.FC<{ t: number; id?: string; mode?: 'night' | 'day' | 'dusk'; power?: number; sweep?: number; milky?: number; car?: boolean; garageOpen?: number; signal?: 'red' | 'green' | 'off' }> = ({
  t, id = 'stm', mode = 'night', power = 1, sweep, milky = 0, car = true, garageOpen = 0, signal,
}) => {
  const night = mode === 'night';
  const dusk = mode === 'dusk';
  const dark = night ? 1 - power : 0;
  const winOn = (i: number, k: number) => night && power > 0.5 && rnd(i + 11, k) < 0.6;
  const sig = signal ?? (power > 0.5 ? (Math.floor(t / 90) % 2 ? 'green' : 'red') : 'off');
  const lampXs = [-120, 540, 1200, 1860];
  const tint = (c: string) => c;
  return (
    <g>
      {/* sky */}
      {night ? (
        <g>
          <NightSky id={`${id}sky`} horizonY={STREETM.horizon} />
          <rect x={-400} y={-400} width={2800} height={1100} fill="#04040E" opacity={0.25 + 0.35 * dark} />
          <Stars seed={13} x0={-300} y0={-300} w={2500} h={900} t={t} n={Math.round(30 + 200 * dark)} o={0.5 + 0.5 * dark} />
          <MilkyWay x0={-200} y0={560} x1={2100} y1={-150} o={milky} t={t} w={300} />
          {power > 0.5 ? <rect x={-400} y={STREETM.horizon - 260} width={2800} height={300} fill="url(#kitShaft)" opacity={0.25} /> : null}
          <Moon x={1650} y={170} r={34} bloom={0.6} />
        </g>
      ) : (
        <g>
          <defs>
            <linearGradient id={`${id}day`} x1="0" y1="-300" x2="0" y2={STREETM.horizon} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor={dusk ? '#2A2050' : '#5A9AD8'} />
              <stop offset="70%" stopColor={dusk ? '#C8607A' : '#9AC8E8'} />
              <stop offset="100%" stopColor={dusk ? '#F2A06A' : '#D8ECF4'} />
            </linearGradient>
          </defs>
          <rect x={-400} y={-400} width={2800} height={1100} fill={`url(#${id}day)`} />
          {[[300, 160, 140], [1300, 110, 180], [900, 260, 100]].map(([cx, cy, rx], i) => (
            <g key={i} transform={`translate(${(t * 0.3 * (i % 2 ? 1 : -1)) % 80} 0)`} opacity={dusk ? 0.5 : 0.9}>
              <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.28} fill="#FFFFFF" />
              <ellipse cx={cx + rx * 0.4} cy={cy - rx * 0.12} rx={rx * 0.5} ry={rx * 0.3} fill="#FFFFFF" />
            </g>
          ))}
          {dusk ? <circle cx={1500} cy={560} r={90} fill="#FFD08A" opacity={0.9} /> : null}
        </g>
      )}
      {/* the far city */}
      {Array.from({ length: 16 }).map((_, i) => {
        const bx = -320 + i * 160 + rnd(5, i) * 40;
        const bh = 160 + rnd(6, i) * 280;
        const on = night && (sweep === undefined ? power > 0.5 : (bx + 300) / 2400 > sweep);
        return (
          <g key={`ft${i}`}>
            <rect x={bx} y={STREETM.horizon + 120 - bh} width={110 + rnd(7, i) * 50} height={bh} fill={night ? '#1A1A34' : dusk ? '#6A4A6A' : '#9AAAC0'} opacity={night ? 1 : 0.75} />
            {on
              ? Array.from({ length: 12 }).map((__, k) => (rnd(8 + i, k) > 0.4 ? <rect key={k} x={bx + 12 + (k % 3) * 30} y={STREETM.horizon + 140 - bh + Math.floor(k / 3) * 34} width={12} height={16} fill="#FFC27A" opacity={0.6} /> : null))
              : null}
            {on && i % 3 === 0 ? <circle cx={bx + 50} cy={STREETM.horizon + 116 - bh} r={4} fill="#FF4A4A" /> : null}
          </g>
        );
      })}
      {/* the houses */}
      {HOUSES.map((h, i) => {
        const top = STREETM.feet - h.h;
        const wall = night ? h.wall : h.wall;
        return (
          <g key={`h${i}`}>
            <rect x={h.x} y={top} width={h.w} height={h.h} fill={tint(wall)} stroke={P0} strokeWidth={5} />
            {h.kind === 'block' ? (
              <g>
                <rect x={h.x - 10} y={top - 16} width={h.w + 20} height={20} fill={h.roof} stroke={P0} strokeWidth={5} />
                {Array.from({ length: 5 }).map((_, rr) =>
                  Array.from({ length: 4 }).map((__, c) => {
                    const on = winOn(i, rr * 4 + c);
                    const wx = h.x + 40 + c * 120;
                    const wy = top + 40 + rr * 100;
                    return (
                      <g key={`${rr}${c}`}>
                        <rect x={wx} y={wy} width={70} height={62} fill={on ? '#FFC98A' : night ? '#1A1A2E' : '#8AAAC8'} stroke={P0} strokeWidth={4} />
                        <path d={`M ${wx + 35} ${wy} L ${wx + 35} ${wy + 62}`} stroke={P0} strokeWidth={3} />
                        {on ? <Glow x={wx + 35} y={wy + 31} r={70} o={0.5} /> : null}
                      </g>
                    );
                  }),
                )}
                <rect x={h.x + h.w / 2 - 50} y={STREETM.feet - 110} width={100} height={110} fill="#2A2232" stroke={P0} strokeWidth={5} />
                <rect x={h.x + h.w / 2 - 44} y={STREETM.feet - 104} width={88} height={60} fill={night && power > 0.5 ? '#FFE2B0' : '#3A3A50'} />
              </g>
            ) : (
              <g>
                <path d={`M ${h.x - 30} ${top + 4} L ${h.x + h.w / 2} ${top - h.w * 0.32} L ${h.x + h.w + 30} ${top + 4} Z`} fill={h.roof} stroke={P0} strokeWidth={5} strokeLinejoin="round" />
                <rect x={h.x + h.w * 0.7} y={top - h.w * 0.26} width={34} height={70} fill={h.roof} stroke={P0} strokeWidth={5} />
                {/* windows: two up, one down */}
                {[[0.18, 0.18], [0.6, 0.18], h.kind === 'garage' ? null : [0.6, 0.56]].filter(Boolean).map((p, k) => {
                  const [u, v] = p as number[];
                  const on = winOn(i, k);
                  const wx = h.x + h.w * u;
                  const wy = top + h.h * v;
                  return (
                    <g key={k}>
                      <rect x={wx} y={wy} width={h.w * 0.22} height={h.h * 0.22} fill={on ? '#FFC98A' : night ? '#1A1A2E' : '#9ABAD8'} stroke={P0} strokeWidth={4} />
                      <path d={`M ${wx + h.w * 0.11} ${wy} L ${wx + h.w * 0.11} ${wy + h.h * 0.22} M ${wx} ${wy + h.h * 0.11} L ${wx + h.w * 0.22} ${wy + h.h * 0.11}`} stroke={P0} strokeWidth={3} />
                      {on ? <Glow x={wx + h.w * 0.11} y={wy + h.h * 0.11} r={90} o={0.55} /> : null}
                    </g>
                  );
                })}
                {h.kind === 'garage' ? (
                  <g>
                    <rect x={h.x + 30} y={STREETM.feet - 150} width={h.w - 60} height={150} fill="#1A1820" stroke={P0} strokeWidth={5} />
                    {garageOpen > 0 ? (
                      <g>
                        {[0, 1, 2, 3, 4].map((k) => (
                          <Can key={k} x={h.x + 70 + k * 46} y={STREETM.feet - 6} s={0.8} label={['#C84A2A', '#3A8A4A', '#D8A03A'][k % 3]} />
                        ))}
                        {[0, 1, 2, 3].map((k) => (
                          <Can key={`u${k}`} x={h.x + 92 + k * 46} y={STREETM.feet - 56} s={0.8} label={['#3A8A4A', '#C84A2A', '#D8A03A'][k % 3]} />
                        ))}
                        <path d={`M ${h.x + 40} ${STREETM.feet - 112} L ${h.x + h.w - 40} ${STREETM.feet - 112}`} stroke="#5A4A3A" strokeWidth={6} />
                      </g>
                    ) : null}
                    <rect x={h.x + 30} y={STREETM.feet - 150} width={h.w - 60} height={150 * (1 - garageOpen)} fill="#C8C0B8" stroke={P0} strokeWidth={5} />
                    {Array.from({ length: Math.max(0, Math.floor(5 * (1 - garageOpen))) }).map((_, k) => (
                      <path key={k} d={`M ${h.x + 30} ${STREETM.feet - 150 + (k + 1) * 28} L ${h.x + h.w - 30} ${STREETM.feet - 150 + (k + 1) * 28}`} stroke="#9A928A" strokeWidth={3} />
                    ))}
                  </g>
                ) : (
                  <g>
                    <rect x={h.x + h.w * 0.2} y={STREETM.feet - 140} width={70} height={140} fill={h.door} stroke={P0} strokeWidth={5} />
                    <circle cx={h.x + h.w * 0.2 + 56} cy={STREETM.feet - 70} r={5} fill="#E8C86A" />
                    {night && power > 0.5 ? <circle cx={h.x + h.w * 0.2 + 90} cy={STREETM.feet - 150} r={8} fill="#FFE2B0" /> : null}
                    {night && power > 0.5 ? <Glow x={h.x + h.w * 0.2 + 90} y={STREETM.feet - 150} r={80} o={0.6} /> : null}
                  </g>
                )}
              </g>
            )}
          </g>
        );
      })}
      {/* hedges and trees */}
      {[-260, 420, 990, 1640].map((tx, i) => (
        <g key={`tr${i}`} transform={`rotate(${Math.sin(t / 30 + i) * 1.2} ${tx} ${STREETM.feet})`}>
          <rect x={tx - 10} y={STREETM.feet - 200} width={20} height={200} fill="#2A1E1A" />
          <circle cx={tx} cy={STREETM.feet - 250} r={90} fill={night ? '#1E3A2E' : '#3E7A4A'} stroke={P0} strokeWidth={5} />
          <circle cx={tx - 50} cy={STREETM.feet - 200} r={60} fill={night ? '#1A3228' : '#3A6E44'} stroke={P0} strokeWidth={5} />
          <circle cx={tx + 50} cy={STREETM.feet - 210} r={64} fill={night ? '#22402E' : '#4A8A52'} stroke={P0} strokeWidth={5} />
        </g>
      ))}
      {/* the power line: poles and sagging wires */}
      {[-200, 860, 1920].map((px, i) => (
        <g key={`pp${i}`}>
          <rect x={px - 9} y={STREETM.feet - 620} width={18} height={620} fill="#2A2026" />
          <rect x={px - 70} y={STREETM.feet - 600} width={140} height={12} fill="#2A2026" />
        </g>
      ))}
      {[-60, 0, 60].map((dx, k) => (
        <path key={`w${k}`} d={`M ${-200 + dx} ${STREETM.feet - 600} Q ${330 + dx} ${STREETM.feet - 520} ${860 + dx} ${STREETM.feet - 600} Q ${1390 + dx} ${STREETM.feet - 520} ${1920 + dx} ${STREETM.feet - 600}`} stroke="#120E14" strokeWidth={3} fill="none" />
      ))}
      {/* the sidewalk, kerb and road */}
      <rect x={-400} y={STREETM.feet} width={2800} height={STREETM.kerb - STREETM.feet} fill={night ? '#3A3644' : '#9A96A0'} />
      <rect x={-400} y={STREETM.kerb} width={2800} height={12} fill={night ? '#4A4654' : '#B8B4BC'} />
      <rect x={-400} y={STREETM.kerb + 12} width={2800} height={500} fill={night ? '#1E1C26' : '#4A4652'} />
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={`ln${i}`} x={-380 + i * 240} y={STREETM.kerb + 130} width={130} height={10} fill="#E8E0C8" opacity={0.6} />
      ))}
      {/* street lamps */}
      {lampXs.map((lx, i) => (
        <g key={`lp${i}`}>
          <rect x={lx - 7} y={STREETM.feet - 380} width={14} height={380} fill="#2A2630" />
          <path d={`M ${lx} ${STREETM.feet - 380} Q ${lx} ${STREETM.feet - 410} ${lx + 60} ${STREETM.feet - 410}`} stroke="#2A2630" strokeWidth={10} fill="none" />
          <path d={`M ${lx + 40} ${STREETM.feet - 414} L ${lx + 96} ${STREETM.feet - 414} L ${lx + 86} ${STREETM.feet - 398} L ${lx + 50} ${STREETM.feet - 398} Z`} fill="#2A2630" />
          <rect x={lx + 52} y={STREETM.feet - 400} width={32} height={6} fill={night && power > 0.5 ? '#FFE8B8' : '#5A5460'} />
          {night && power > 0.5 ? (
            <g opacity={power}>
              <Cone d={`M ${lx + 50} ${STREETM.feet - 396} L ${lx + 86} ${STREETM.feet - 396} L ${lx + 240} ${STREETM.feet + 60} L ${lx - 100} ${STREETM.feet + 60} Z`} o={0.35} />
              <Glow x={lx + 68} y={STREETM.feet - 398} r={160} o={0.85} />
              <ellipse cx={lx + 68} cy={STREETM.feet + 30} rx={220} ry={34} fill="#FFD9A0" opacity={0.18} />
            </g>
          ) : null}
        </g>
      ))}
      {/* the traffic light at the corner */}
      <g>
        <rect x={1592} y={STREETM.feet - 330} width={14} height={330} fill="#2A2630" />
        <rect x={1570} y={STREETM.feet - 450} width={58} height={130} rx={10} fill="#1A1820" stroke={P0} strokeWidth={4} />
        {['red', 'amber', 'green'].map((c, k) => {
          const on = sig === c;
          const col = c === 'red' ? '#FF3A30' : c === 'amber' ? '#FFB02A' : '#3AE080';
          return (
            <g key={c}>
              <circle cx={1599} cy={STREETM.feet - 425 + k * 40} r={14} fill={on ? col : '#2E2C36'} />
              {on ? <Glow x={1599} y={STREETM.feet - 425 + k * 40} r={70} kind={c === 'red' ? 'red' : 'warm'} o={0.8} /> : null}
            </g>
          );
        })}
      </g>
      {car ? <Car x={300} y={STREETM.kerb + 40} s={0.9} color="#3E6E9A" lights={0} /> : null}
      {night ? <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.42 * dark} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- the roof under the Milky Way
// A flat roof at night, the city below without a single light, the Milky Way across the sky. `power` lights the city
// (for the before shots); `milky` fades the band in.
export const ROOF = { feet: 860 };
export const roofHip = (scale = 1) => ROOF.feet - LEG_LEN * scale;
export const RoofNight: React.FC<{ t: number; id?: string; power?: number; milky?: number; sweep?: number }> = ({ t, id = 'rfn', power = 0, milky = 1, sweep }) => (
  <g>
    <NightSky id={`${id}sky`} horizonY={700} />
    <rect x={-400} y={-400} width={2800} height={1200} fill="#03030C" opacity={0.35 * (1 - power)} />
    <Stars seed={17} x0={-300} y0={-300} w={2500} h={1000} t={t} n={Math.round(40 + 260 * (1 - power))} o={0.6 + 0.4 * (1 - power)} />
    <MilkyWay x0={-300} y0={760} x1={2200} y1={-200} o={milky * (1 - power)} t={t} w={340} />
    {[0, 1].map((layer) => (
      <g key={layer}>
        {Array.from({ length: 22 }).map((_, i) => {
          const bx = -360 + i * 120 + rnd(30 + layer, i) * 40;
          const bh = (layer ? 120 : 220) + rnd(31 + layer, i) * (layer ? 160 : 260);
          const base = layer ? 820 : 760;
          const on = sweep === undefined ? power > 0.5 : (bx + 360) / 2700 > sweep;
          return (
            <g key={i}>
              <rect x={bx} y={base - bh} width={110 + rnd(32, i) * 40} height={bh + 60} fill={layer ? '#0E0E1E' : '#16162C'} />
              {on
                ? Array.from({ length: 10 }).map((__, k) => (rnd(33 + i + layer * 7, k) > 0.45 ? <rect key={k} x={bx + 14 + (k % 3) * 30} y={base - bh + 16 + Math.floor(k / 3) * 30} width={12} height={16} fill="#FFC27A" opacity={0.65} /> : null))
                : null}
            </g>
          );
        })}
      </g>
    ))}
    {power > 0.5 ? <rect x={-400} y={560} width={2800} height={260} fill="url(#kitShaft)" opacity={0.35} /> : null}
    {/* our roof */}
    <rect x={-400} y={ROOF.feet - 40} width={2800} height={40} fill="#2A2632" />
    <rect x={-400} y={ROOF.feet - 40} width={2800} height={3} fill="#8A9AE0" opacity={0.25} />
    <rect x={-400} y={ROOF.feet} width={2800} height={600} fill="#15131C" />
    <rect x={220} y={ROOF.feet - 120} width={200} height={100} rx={6} fill="#2E2A38" />
    <circle cx={320} cy={ROOF.feet - 70} r={32} fill="#221F2A" />
    <path d={`M 1500 ${ROOF.feet} L 1500 ${ROOF.feet - 160} M 1460 ${ROOF.feet - 160} L 1540 ${ROOF.feet - 160}`} stroke="#2A2632" strokeWidth={10} />
  </g>
);

// ---------------------------------------------------------------- hospital corridor
export const HOSP = makeRoom({ x: 960, y: 500 }, { x0: 800, x1: 1120, y0: 380, y1: 620 }, 5.5);
export const Hospital: React.FC<{ t: number; id?: string; candles?: Pt[] }> = ({ t, id = 'hsp', candles }) => {
  const r = HOSP;
  const { P, Q } = r;
  const cs = candles ?? [P(0.15, 1, 0.55), P(0.85, 1, 0.75)];
  return (
    <g>
      <RoomShell r={r} id={id} floor="tiles" wall="#5A6A6E" side="#4A5A5E" floorC="#3A4448" ceiling="#2A3236" lines="#2A3236" />
      {/* doors down both sides, a dead exit sign at the end, ceiling panels off */}
      {[0.15, 0.35, 0.55, 0.75].map((w, i) => (
        <g key={i}>
          <polygon points={Q([[0, 0.3, w], [0, 0.3, w + 0.1], [0, 1, w + 0.1], [0, 1, w]])} fill="#3A5A6A" stroke={P0} strokeWidth={3} />
          <polygon points={Q([[1, 0.3, w], [1, 0.3, w + 0.1], [1, 1, w + 0.1], [1, 1, w]])} fill="#3A5A6A" stroke={P0} strokeWidth={3} />
          <polygon points={Q([[0.3, 0, w], [0.7, 0, w], [0.7, 0, w + 0.06], [0.3, 0, w + 0.06]])} fill="#3A4448" />
        </g>
      ))}
      <rect x={920} y={400} width={80} height={30} fill="#1A3A2A" stroke={P0} strokeWidth={3} />
      <text x={960} y={422} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={20} fill="#2A5A3A">EXIT</text>
      <polygon points={Q([[0, 0.55, 0], [1, 0.55, 0], [1, 0.55, 1], [0, 0.55, 1]])} fill="none" />
      {/* a trolley, a wheelchair, a bench with someone's coat */}
      <Box r={r} u={[0.72, 0.95]} v={[0.82, 0.88]} w={[0.42, 0.58]} front="#C8D0D4" top="#E0E8EC" side="#A8B0B4" />
      <Box r={r} u={[0.04, 0.2]} v={[0.86, 1]} w={[0.62, 0.82]} front="#4A4A5A" top="#5A5A6A" side="#3A3A4A" />
      <LightVeil id={`${id}v`} lights={cs.map((c) => [c.x, c.y - 80, 420] as [number, number, number])} o={0.82} />
      {cs.map((c, i) => (
        <Candle key={i} x={c.x} y={c.y} s={r.s(0.6) / 5} t={t} seed={i + 3} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- countryside
// A road through fields by day (the walk), or a valley at night seen from a hill (the light). Wide panoramas.
export const COUNTRY = { feet: 820 };
export const countryHip = (scale = 1) => COUNTRY.feet - LEG_LEN * scale;
export const CountryRoad: React.FC<{ t: number; id?: string; dusk?: boolean; people?: number }> = ({ t, id = 'cr', dusk = false }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="-300" x2="0" y2="620" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={dusk ? '#2A2050' : '#7AB0E0'} />
        <stop offset="100%" stopColor={dusk ? '#F2A06A' : '#E8F0F0'} />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2800} height={1100} fill={`url(#${id}sky)`} />
    {dusk ? <circle cx={1400} cy={560} r={110} fill="#FFD08A" /> : <circle cx={1500} cy={170} r={70} fill="#FFF4C8" opacity={0.9} />}
    <path d="M -400 620 Q 200 500 700 600 Q 1200 520 1600 590 Q 2000 540 2400 610 L 2400 900 L -400 900 Z" fill={dusk ? '#4A3A5A' : '#7A9AB0'} opacity={0.8} />
    <path d="M -400 680 Q 300 600 900 670 Q 1500 610 2400 680 L 2400 900 L -400 900 Z" fill={dusk ? '#3A4A3A' : '#6A9A5A'} />
    {/* fields in stripes, a farmhouse far off, a line of dead power poles along the road */}
    {Array.from({ length: 8 }).map((_, i) => (
      <path key={i} d={`M -400 ${700 + i * 16} Q 960 ${690 + i * 18} 2400 ${700 + i * 16}`} stroke={dusk ? '#2E3E2E' : '#5A8A4A'} strokeWidth={6} fill="none" opacity={0.6} />
    ))}
    <g transform="translate(1480 668)">
      <rect x={-40} y={-40} width={80} height={40} fill="#C8B8A0" />
      <path d="M -48 -40 L 0 -76 L 48 -40 Z" fill="#8A3A2A" />
    </g>
    {Array.from({ length: 9 }).map((_, i) => {
      const k = i / 8;
      const x = lerp(-200, 2200, k);
      const h = 170;
      return (
        <g key={`pp${i}`}>
          <rect x={x - 5} y={COUNTRY.feet - 40 - h} width={10} height={h} fill="#3A2A26" />
          <rect x={x - 34} y={COUNTRY.feet - 40 - h} width={68} height={6} fill="#3A2A26" />
        </g>
      );
    })}
    <path d={`M -200 ${COUNTRY.feet - 210} ${Array.from({ length: 8 }).map((_, i) => `Q ${lerp(-200, 2200, (i + 0.5) / 8)} ${COUNTRY.feet - 180} ${lerp(-200, 2200, (i + 1) / 8)} ${COUNTRY.feet - 210}`).join(' ')}`} stroke="#1A1416" strokeWidth={2} fill="none" />
    <rect x={-400} y={COUNTRY.feet - 30} width={2800} height={60} fill={dusk ? '#5A4A40' : '#A8987A'} />
    <rect x={-400} y={COUNTRY.feet + 30} width={2800} height={500} fill={dusk ? '#2E3A2A' : '#5A8A44'} />
    {Array.from({ length: 30 }).map((_, i) => (
      <path key={`gr${i}`} d={`M ${-300 + rnd(71, i) * 2500} ${COUNTRY.feet + 60 + rnd(72, i) * 200} l 6 -24 l 6 24 l 6 -18`} stroke={dusk ? '#3E4E36' : '#6EA050'} strokeWidth={4} fill="none" transform={`rotate(${Math.sin(t / 20 + i) * 4} ${-300 + rnd(71, i) * 2500} ${COUNTRY.feet + 60 + rnd(72, i) * 200})`} />
    ))}
  </g>
);

export const VALLEY_LIGHT = { x: 1380, y: 560 };
export const Valley: React.FC<{ t: number; id?: string; light?: number; blink?: number }> = ({ t, id = 'val', light = 0, blink = 0 }) => (
  <g>
    <NightSky id={`${id}sky`} horizonY={560} />
    <rect x={-400} y={-400} width={2800} height={1100} fill="#02020A" opacity={0.4} />
    <Stars seed={19} x0={-300} y0={-300} w={2500} h={850} t={t} n={260} o={1} />
    <MilkyWay x0={-300} y0={300} x1={2200} y1={-250} o={0.85} t={t} w={300} />
    <path d="M -400 560 Q 200 470 700 540 Q 1200 480 1700 530 Q 2100 490 2400 540 L 2400 900 L -400 900 Z" fill="#141428" />
    <path d="M -400 620 Q 400 560 1000 610 Q 1600 570 2400 620 L 2400 900 L -400 900 Z" fill="#0E0E1E" />
    {light > 0 ? (
      <g opacity={light * (1 - blink)}>
        <circle cx={VALLEY_LIGHT.x} cy={VALLEY_LIGHT.y} r={7} fill="#F4FAFF" />
        <circle cx={VALLEY_LIGHT.x} cy={VALLEY_LIGHT.y} r={60} fill="#CFE8FF" opacity={0.25} />
        <Glow x={VALLEY_LIGHT.x} y={VALLEY_LIGHT.y} r={180} kind="cool" o={0.9} />
      </g>
    ) : null}
    {/* our hill in the foreground, a tent and the trailer as silhouettes */}
    <path d="M -400 760 Q 300 690 900 740 Q 1500 790 2400 760 L 2400 1500 L -400 1500 Z" fill="#08080F" />
    <path d="M 260 740 L 380 620 L 500 740 Z" fill="#14121E" stroke="#2A2840" strokeWidth={3} />
    <path d="M 380 620 L 380 740" stroke="#2A2840" strokeWidth={3} />
  </g>
);
