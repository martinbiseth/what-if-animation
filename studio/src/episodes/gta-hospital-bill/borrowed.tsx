import React from 'react';
import { Glow } from '../../engine';

// Props borrowed from "What if electricity disappeared forever?": the game on the TV, a controller, a car, a bike.
const P0 = '#100E16';

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

