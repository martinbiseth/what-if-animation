import React from 'react';
import { rnd } from '../anim';
import { DuskSky } from '../kit';
import { Glow, WallTexture } from '../light';
import { LEG_LEN } from '../rig';
import { OldCar, StreetLamp } from '../props26';

// A New York street at dusk in 1926, seen square-on from the far kerb: brick fronts four storeys high with fire
// escapes, shopfronts with awnings and lit windows at street level (a diner, a hat shop, a newsstand, a bakery),
// cast-iron lamps, a sidewalk (feet at y 800), cobbles in front, a strip of dusk sky above the roofline.
// STREET.feet is the sidewalk line; street26Hip(scale) gives the hip y for someone standing on it.
export const STREET = { feet: 800, kerb: 836, roof: 120 };
export const street26Hip = (scale = 1) => STREET.feet - LEG_LEN * scale;

const FRONTS = [
  { x: -420, w: 520, brick: '#6A3A34', sign: 'HATS', awn: '#7A2E2E' },
  { x: 100, w: 470, brick: '#5A4038', sign: 'DINER', awn: '#2E5A4A' },
  { x: 570, w: 520, brick: '#74443A', sign: 'NEWS', awn: '#8A6A2E' },
  { x: 1090, w: 480, brick: '#5E3A3E', sign: 'BAKERY', awn: '#7A3A5A' },
  { x: 1570, w: 520, brick: '#6E4A3A', sign: 'HOTEL', awn: '#2E3E6A' },
  { x: 2090, w: 400, brick: '#5A3A34', sign: 'BARBER', awn: '#6A2E2E' },
];

export const Street26: React.FC<{ t: number; id?: string; night?: boolean; cars?: boolean; lamps?: boolean; lit?: number }> = ({ t, id = 'st26', night = false, cars = true, lamps = true, lit = 1 }) => {
  const winLit = (i: number, k: number) => rnd(i + 3, k) < (night ? 0.65 : 0.35) * lit;
  return (
    <g>
      <DuskSky id={`${id}sky`} horizonY={STREET.roof + 80} />
      {night ? <rect x={-400} y={-400} width={2800} height={700} fill="#0A0A26" opacity={0.55} /> : null}
      {/* far towers behind the roofline, hazy */}
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={`ft${i}`} x={-300 + i * 260 + rnd(5, i) * 80} y={STREET.roof - 120 - rnd(6, i) * 160} width={120 + rnd(7, i) * 60} height={400} fill="#3A2A4A" opacity={0.7} />
      ))}
      {FRONTS.map((f, i) => {
        const top = STREET.roof + (i % 2) * 40;
        return (
          <g key={i}>
            <rect x={f.x} y={top} width={f.w + 2} height={STREET.feet - top} fill={f.brick} />
            {/* brick courses, very faint */}
            {Array.from({ length: Math.floor((STREET.feet - top) / 24) }).map((_, k) => (
              <path key={k} d={`M ${f.x} ${top + k * 24} H ${f.x + f.w}`} stroke="#000" strokeOpacity={0.08} strokeWidth={2} />
            ))}
            <rect x={f.x} y={top} width={f.w} height={22} fill="#2A1E22" />
            <rect x={f.x - 6} y={top - 8} width={f.w + 12} height={12} fill="#3A2C30" />
            {/* three storeys of sash windows */}
            {[0, 1, 2].map((r) =>
              [0, 1, 2].map((c) => {
                const wx = f.x + 50 + c * ((f.w - 100) / 3);
                const wy = top + 60 + r * 130;
                const on = winLit(i * 9 + r * 3 + c, Math.floor(t / 900));
                return (
                  <g key={`${r}${c}`}>
                    <rect x={wx - 4} y={wy - 4} width={(f.w - 100) / 3 - 30 + 8} height={94} fill="#2A1E22" />
                    <rect x={wx} y={wy} width={(f.w - 100) / 3 - 30} height={86} fill={on ? '#FFC870' : '#2E3248'} opacity={on ? 0.9 : 1} />
                    <path d={`M ${wx} ${wy + 43} H ${wx + (f.w - 100) / 3 - 30}`} stroke="#2A1E22" strokeWidth={6} />
                    <rect x={wx - 8} y={wy + 86} width={(f.w - 100) / 3 - 14} height={10} fill="#8A7A6A" />
                  </g>
                );
              }),
            )}
            {/* a fire escape on every other front */}
            {i % 2 === 1
              ? [0, 1, 2].map((r) => (
                  <g key={`fe${r}`} stroke="#151218" strokeWidth={5} fill="none">
                    <path d={`M ${f.x + 30} ${top + 152 + r * 130} H ${f.x + f.w - 30}`} strokeWidth={8} />
                    <path d={`M ${f.x + 30} ${top + 118 + r * 130} H ${f.x + f.w - 30}`} />
                    {Array.from({ length: 9 }).map((_, k) => (
                      <path key={k} d={`M ${f.x + 30 + k * ((f.w - 60) / 8)} ${top + 118 + r * 130} V ${top + 152 + r * 130}`} strokeWidth={3} />
                    ))}
                    <path d={`M ${f.x + f.w - 120} ${top + 152 + r * 130} L ${f.x + f.w - 60} ${top + 282 + r * 130}`} />
                  </g>
                ))
              : null}
            {/* the shopfront: a sign board, an awning, a big lit window and a door */}
            <rect x={f.x + 20} y={STREET.feet - 250} width={f.w - 40} height={54} fill="#1C1418" />
            <text x={f.x + f.w / 2} y={STREET.feet - 210} textAnchor="middle" fontFamily="Georgia, 'Times New Roman', serif" fontWeight={700} fontSize={38} letterSpacing={6} fill="#E9C77A">
              {f.sign}
            </text>
            <rect x={f.x + 30} y={STREET.feet - 186} width={f.w - 170} height={150} fill={night || lit > 0 ? '#FFD38A' : '#4A4038'} opacity={0.85} />
            <rect x={f.x + 30} y={STREET.feet - 186} width={f.w - 170} height={150} fill="none" stroke="#1C1418" strokeWidth={8} />
            <path d={`M ${f.x + 30 + (f.w - 170) / 2} ${STREET.feet - 186} V ${STREET.feet - 36}`} stroke="#1C1418" strokeWidth={6} />
            <rect x={f.x + f.w - 120} y={STREET.feet - 186} width={84} height={186} fill="#2A1C1A" stroke="#1C1418" strokeWidth={6} />
            <circle cx={f.x + f.w - 50} cy={STREET.feet - 90} r={5} fill="#C9A86A" />
            <path d={`M ${f.x + 14} ${STREET.feet - 196} L ${f.x + f.w - 14} ${STREET.feet - 196} L ${f.x + f.w + 6} ${STREET.feet - 150} L ${f.x - 6} ${STREET.feet - 150} Z`} fill={f.awn} />
            {Array.from({ length: Math.floor(f.w / 40) }).map((_, k) => (
              <path key={k} d={`M ${f.x + k * 40 + 20} ${STREET.feet - 196} L ${f.x + k * 40 + 14} ${STREET.feet - 150}`} stroke="#FFFFFF" strokeOpacity={0.18} strokeWidth={14} />
            ))}
            <Glow x={f.x + f.w / 2 - 60} y={STREET.feet - 110} r={260} o={0.45} />
          </g>
        );
      })}
      <WallTexture rect={[-420, STREET.roof, 2900, STREET.feet - STREET.roof]} />
      {/* the sidewalk, the kerb, the cobbled road */}
      <rect x={-420} y={STREET.feet} width={2900} height={STREET.kerb - STREET.feet} fill="#5A5258" />
      {Array.from({ length: 30 }).map((_, k) => (
        <path key={k} d={`M ${-420 + k * 100} ${STREET.feet} L ${-440 + k * 100} ${STREET.kerb}`} stroke="#3E383E" strokeWidth={3} />
      ))}
      <rect x={-420} y={STREET.kerb} width={2900} height={14} fill="#8A8288" />
      <rect x={-420} y={STREET.kerb + 14} width={2900} height={700} fill="#3A343C" />
      {Array.from({ length: 14 }).map((_, r) =>
        Array.from({ length: 50 }).map((__, c) => (
          <ellipse key={`${r}-${c}`} cx={-420 + c * 60 + (r % 2) * 30} cy={STREET.kerb + 34 + r * 24} rx={26} ry={9} fill="#2E2A32" opacity={0.7} />
        )),
      )}
      {cars ? <OldCar x={((t * 3) % 3200) - 600} y={STREET.kerb + 150} s={0.9} wheel={t * 6} /> : null}
      {lamps ? [260, 1180, 2000].map((x) => <StreetLamp key={x} x={x} y={STREET.feet + 16} on={night ? 1 : 0.7} />) : null}
      <rect x={-400} y={-400} width={2800} height={1900} fill="#140A1E" opacity={night ? 0.25 : 0.08} />
    </g>
  );
};
