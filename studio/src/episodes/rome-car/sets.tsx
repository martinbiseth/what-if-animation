import React from 'react';
import { Glow, LEG_LEN, rnd, clamp, lerp, Stars, Moon, makeRoom, RoomShell, Box, FloorShadow, LightVeil, Dust, FONT } from '../../engine';

// The sets and props of "What if you brought a modern car to ancient Rome?": the car (side, front, the dashboard and
// a view through the windscreen), horses, a chariot and a donkey, the Roman countryside with the aqueduct and the
// marble city on its hills (day, dusk, night, with the modern tunnel or without it), the city gate, the Forum by day
// and by torchlight, the Circus Maximus, the palace courtyard on the Palatine, a gold room and a storeroom.
// Exteriors are side-on with the ground line at GROUND; a character standing on it has hips at romeHip(scale).

export const P0 = '#100E16';
export const GROUND = 850;
export const romeHip = (s = 1) => GROUND - LEG_LEN * s;
type SetFC = React.FC<{ t: number; id?: string }>;
export type Mode = 'day' | 'dusk' | 'night';

const SKY: Record<Mode, [string, string, string]> = {
  day: ['#4F8FC9', '#9FC4DE', '#F6D9A6'],
  dusk: ['#3B2A5E', '#C0566A', '#FFB263'],
  night: ['#070A1E', '#14193A', '#2A2850'],
};
const HILL: Record<Mode, string[]> = {
  day: ['#B9B48A', '#9AA06A', '#7E8A52', '#6A7444'],
  dusk: ['#7A5068', '#5E3E5A', '#48304A', '#38263C'],
  night: ['#1E2140', '#181A34', '#13152A', '#0E1022'],
};
const MARBLE: Record<Mode, [string, string]> = { day: ['#F4EEE2', '#D6CBB8'], dusk: ['#F2C9A6', '#B88A86'], night: ['#5A6290', '#3A4068'] };

export const Sky: React.FC<{ id: string; mode: Mode; t: number; sunX?: number; sunY?: number }> = ({ id, mode, t, sunX = 1500, sunY = 360 }) => {
  const [a, b, c] = SKY[mode];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="-400" x2="0" y2="800" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={a} />
          <stop offset="62%" stopColor={b} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
      </defs>
      <rect x={-600} y={-500} width={3100} height={2100} fill={`url(#${id}sky)`} />
      {mode === 'night' ? (
        <g>
          <Stars seed={9} x0={-400} y0={-300} w={2700} h={900} t={t} n={120} o={0.9} />
          <Moon x={sunX} y={sunY - 120} r={46} />
        </g>
      ) : (
        <g>
          <Glow x={sunX} y={sunY} r={mode === 'dusk' ? 700 : 520} o={mode === 'dusk' ? 0.9 : 0.55} />
          <circle cx={sunX} cy={sunY} r={mode === 'dusk' ? 90 : 70} fill={mode === 'dusk' ? '#FFD38A' : '#FFF6DA'} />
        </g>
      )}
      {/* a few long clouds drifting */}
      {[0, 1, 2].map((i) => (
        <ellipse key={i} cx={((i * 830 + t * 0.15) % 3000) - 500} cy={120 + i * 90} rx={260 + i * 60} ry={22 + i * 6} fill={mode === 'night' ? '#2A2E58' : mode === 'dusk' ? '#F2A08A' : '#FFFFFF'} opacity={mode === 'night' ? 0.35 : 0.45} />
      ))}
    </g>
  );
};

/** A rolling hill line across the frame. */
const Hills: React.FC<{ y: number; amp: number; seed: number; color: string; x0?: number; x1?: number }> = ({ y, amp, seed, color, x0 = -600, x1 = 2600 }) => {
  let d = `M ${x0} ${y}`;
  for (let x = x0; x <= x1; x += 80) d += ` L ${x} ${y - amp * (0.5 + 0.5 * Math.sin(x / 260 + seed) * Math.cos(x / 610 + seed * 2))}`;
  d += ` L ${x1} 1700 L ${x0} 1700 Z`;
  return <path d={d} fill={color} />;
};

/** An Italian cypress: a tall dark flame of a tree, swaying a touch. */
export const Cypress: React.FC<{ x: number; y: number; h?: number; t?: number; color?: string }> = ({ x, y, h = 300, t = 0, color = '#2E3A26' }) => {
  const sw = Math.sin(t / 40 + x) * 4;
  return (
    <g>
      <path d={`M ${x} ${y} Q ${x - h * 0.16} ${y - h * 0.4} ${x + sw} ${y - h} Q ${x + h * 0.16} ${y - h * 0.4} ${x} ${y} Z`} fill={color} stroke={P0} strokeWidth={3} strokeOpacity={0.5} />
      <path d={`M ${x + 3} ${y - 10} Q ${x + h * 0.1} ${y - h * 0.45} ${x + sw} ${y - h * 0.95}`} stroke="#000" strokeOpacity={0.18} strokeWidth={h * 0.05} fill="none" />
    </g>
  );
};

/** An umbrella pine: a thin trunk and a flat dark crown. */
const Pine: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = '#36452C' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -6 0 Q -4 -120 14 -200 L 22 -200 Q 8 -110 8 0 Z" fill="#4A3628" />
    <ellipse cx={18} cy={-215} rx={120} ry={38} fill={color} />
    <ellipse cx={-30} cy={-205} rx={60} ry={22} fill={color} />
  </g>
);

/** The aqueduct: a long row of stone arches on piers, the channel on top. x0..x1 along y (its foot). */
export const Aqueduct: React.FC<{ x0: number; x1: number; y: number; h: number; mode: Mode; tiers?: 1 | 2 }> = ({ x0, x1, y, h, mode, tiers = 1 }) => {
  const stone = mode === 'night' ? '#3A3C5E' : mode === 'dusk' ? '#B98272' : '#CDB590';
  const dark = mode === 'night' ? '#22243E' : mode === 'dusk' ? '#7C5258' : '#9E8664';
  const span = h * 0.62;
  const n = Math.ceil((x1 - x0) / span);
  const arches: React.ReactNode[] = [];
  const th = h / tiers;
  for (let k = 0; k < tiers; k++) {
    const yb = y - k * th;
    for (let i = 0; i < n; i++) {
      const ax = x0 + i * span;
      const pw = span * 0.24;
      arches.push(
        <path key={`${k}-${i}`} d={`M ${ax + pw} ${yb} L ${ax + pw} ${yb - th * 0.62} A ${(span - pw) / 2} ${(span - pw) / 2} 0 0 1 ${ax + span} ${yb - th * 0.62} L ${ax + span} ${yb} Z`} fill={SKY[mode][2]} opacity={0} />,
      );
    }
  }
  // the wall with arch holes cut by an even-odd fill
  let d = '';
  for (let k = 0; k < tiers; k++) {
    const yb = y - k * th;
    d += ` M ${x0} ${yb} L ${x0} ${yb - th} L ${x1} ${yb - th} L ${x1} ${yb} Z`;
    for (let i = 0; i < n; i++) {
      const ax = x0 + i * span;
      const pw = span * 0.24;
      const r = (span - pw) / 2;
      const l = ax + pw, rr = Math.min(ax + span, x1);
      if (rr - l < r) continue;
      d += ` M ${l} ${yb} L ${l} ${yb - th * 0.88 + r} A ${r} ${r} 0 0 1 ${l + 2 * r} ${yb - th * 0.88 + r} L ${l + 2 * r} ${yb} Z`;
    }
  }
  return (
    <g>
      {arches}
      <path d={d} fill={stone} fillRule="evenodd" stroke={dark} strokeWidth={2} />
      <rect x={x0} y={y - h - h * 0.07} width={x1 - x0} height={h * 0.07} fill={dark} />
      {Array.from({ length: tiers }).map((_, k) => (
        <rect key={k} x={x0} y={y - k * th - th * 0.08} width={x1 - x0} height={3} fill={dark} opacity={0} />
      ))}
    </g>
  );
};

/** A temple front: steps, a row of columns, a pediment. x the middle, y the foot, w its width. */
export const Temple: React.FC<{ x: number; y: number; w: number; mode: Mode; cols?: number; gold?: boolean }> = ({ x, y, w, mode, cols = 6, gold = false }) => {
  const [m, ms] = MARBLE[mode];
  const h = w * 0.62;
  const x0 = x - w / 2;
  const colW = w / (cols * 1.9);
  const top = y - h * 0.18;
  const capY = y - h * 0.78;
  return (
    <g>
      {[0, 1, 2].map((k) => (
        <rect key={k} x={x0 - 20 + k * 12} y={y - (k + 1) * h * 0.05} width={w + 40 - k * 24} height={h * 0.05} fill={k % 2 ? ms : m} stroke={P0} strokeWidth={2} strokeOpacity={0.5} />
      ))}
      <rect x={x0 + 10} y={capY} width={w - 20} height={top - capY} fill={ms} opacity={0.75} />
      {Array.from({ length: cols }).map((_, i) => {
        const cx = x0 + colW + (i * (w - 2 * colW)) / (cols - 1);
        return (
          <g key={i}>
            <rect x={cx - colW / 2} y={capY} width={colW} height={top - capY} fill={m} stroke={P0} strokeWidth={2} strokeOpacity={0.5} />
            <path d={`M ${cx - colW * 0.18} ${capY} L ${cx - colW * 0.18} ${top} M ${cx + colW * 0.18} ${capY} L ${cx + colW * 0.18} ${top}`} stroke={ms} strokeWidth={2} />
            <rect x={cx - colW * 0.7} y={capY - 8} width={colW * 1.4} height={10} fill={m} stroke={P0} strokeWidth={2} strokeOpacity={0.5} />
          </g>
        );
      })}
      <rect x={x0} y={capY - h * 0.1} width={w} height={h * 0.1} fill={m} stroke={P0} strokeWidth={2} strokeOpacity={0.5} />
      <path d={`M ${x0 - 10} ${capY - h * 0.1} L ${x} ${capY - h * 0.32} L ${x0 + w + 10} ${capY - h * 0.1} Z`} fill={gold ? '#E8B84A' : m} stroke={P0} strokeWidth={2} strokeOpacity={0.6} />
      <path d={`M ${x0 + w * 0.12} ${capY - h * 0.12} L ${x} ${capY - h * 0.27} L ${x0 + w * 0.88} ${capY - h * 0.12} Z`} fill={ms} />
    </g>
  );
};

/** The marble city on its hills, far off: temples, a dome, the amphitheatre, red roofs. */
export const FarCity: React.FC<{ x: number; y: number; s?: number; mode: Mode; lit?: number }> = ({ x, y, s = 1, mode, lit = 0 }) => {
  const [m, ms] = MARBLE[mode];
  const roof = mode === 'night' ? '#3A2A40' : mode === 'dusk' ? '#9A4A44' : '#C0644A';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: 26 }).map((_, i) => {
        const bx = -560 + i * 44 + rnd(3, i) * 20;
        const bh = 30 + rnd(4, i) * 60 + (Math.abs(i - 13) < 6 ? 40 : 0);
        return (
          <g key={i}>
            <rect x={bx} y={-bh} width={40} height={bh} fill={i % 3 ? m : ms} />
            <path d={`M ${bx - 4} ${-bh} L ${bx + 20} ${-bh - 14} L ${bx + 44} ${-bh} Z`} fill={roof} />
            {lit > 0 && rnd(5, i) > 0.5 ? <rect x={bx + 14} y={-bh + 12} width={8} height={10} fill="#FFB24A" opacity={lit} /> : null}
          </g>
        );
      })}
      {/* the amphitheatre */}
      <path d="M -330 -60 L -330 -150 Q -230 -175 -130 -150 L -130 -60 Z" fill={m} />
      {[0, 1, 2].map((r) => Array.from({ length: 8 }).map((_, k) => <rect key={`${r}${k}`} x={-322 + k * 24} y={-142 + r * 28} width={12} height={18} rx={6} fill={ms} />))}
      {/* temples and a dome on the hill */}
      <path d="M 40 -150 A 70 60 0 0 1 180 -150 Z" fill={ms} />
      <rect x={40} y={-150} width={140} height={60} fill={m} />
      <path d="M -60 -120 L 0 -160 L 60 -120 Z" fill={m} />
      {Array.from({ length: 5 }).map((_, k) => <rect key={k} x={-52 + k * 24} y={-120} width={10} height={60} fill={m} />)}
      <path d="M 240 -110 L 300 -140 L 360 -110 Z" fill={m} />
      <rect x={244} y={-110} width={112} height={50} fill={ms} />
      {lit > 0 ? <Glow x={0} y={-80} r={500} o={0.35 * lit} /> : null}
    </g>
  );
};

/** A stone-paved Roman road seen side-on: big polygonal blocks along a strip, kerbs. Or a dirt track. */
const Road: React.FC<{ y: number; mode: Mode; stone: boolean; scroll?: number }> = ({ y, mode, stone, scroll = 0 }) => {
  const base = stone ? (mode === 'night' ? '#2A2C40' : mode === 'dusk' ? '#6A5058' : '#8E8678') : mode === 'night' ? '#2E2A36' : mode === 'dusk' ? '#8A6050' : '#C4A272';
  const line = stone ? (mode === 'night' ? '#1A1A2A' : '#5E5850') : 'transparent';
  return (
    <g>
      <rect x={-600} y={y - 40} width={3100} height={110} fill={base} />
      {stone
        ? Array.from({ length: 70 }).map((_, i) => {
            const bx = ((i * 64 - scroll) % 4480 + 4480) % 4480 - 1000;
            return <path key={i} d={`M ${bx} ${y - 40 + (i % 3) * 30} l 30 -2 l 26 12 l -4 22 l -30 4 l -24 -12 Z`} fill="none" stroke={line} strokeWidth={2.5} opacity={0.7} />;
          })
        : Array.from({ length: 40 }).map((_, i) => {
            const bx = ((i * 97 - scroll) % 3880 + 3880) % 3880 - 700;
            return <ellipse key={i} cx={bx} cy={y - 20 + (i % 4) * 22} rx={14} ry={3} fill="#000" opacity={0.12} />;
          })}
      <rect x={-600} y={y - 44} width={3100} height={6} fill="#000" opacity={0.2} />
    </g>
  );
};

/** The modern concrete tunnel mouth in a hillside (c01), or the same hillside with no tunnel (c07). */
export const TunnelHill: React.FC<{ x: number; y: number; mode: Mode; tunnel: boolean; flash?: number }> = ({ x, y, mode, tunnel, flash = 0 }) => (
  <g>
    <path d={`M ${x - 700} ${y + 40} Q ${x - 400} ${y - 420} ${x} ${y - 470} Q ${x + 420} ${y - 430} ${x + 760} ${y + 40} Z`} fill={HILL[mode][2]} />
    <path d={`M ${x - 520} ${y} Q ${x - 300} ${y - 330} ${x} ${y - 360}`} stroke="#000" strokeOpacity={0.12} strokeWidth={40} fill="none" />
    {tunnel ? (
      <g>
        <path d={`M ${x - 260} ${y} L ${x - 260} ${y - 220} Q ${x} ${y - 330} ${x + 260} ${y - 220} L ${x + 260} ${y} Z`} fill="#9C9A94" stroke={P0} strokeWidth={5} />
        <path d={`M ${x - 210} ${y} L ${x - 210} ${y - 200} Q ${x} ${y - 290} ${x + 210} ${y - 200} L ${x + 210} ${y} Z`} fill="#0C0B12" />
        {[0, 1, 2, 3].map((k) => (
          <circle key={k} cx={x - 120 + k * 80} cy={y - 220 + Math.abs(k - 1.5) * 14} r={7} fill="#FFB24A" opacity={0.85} />
        ))}
        {flash > 0 ? <Glow x={x} y={y - 120} r={600} kind="cool" o={flash} /> : null}
      </g>
    ) : (
      <g>
        {[[-120, -60, 50], [60, -20, 70], [180, -90, 40], [-40, -160, 30]].map(([dx, dy, r], i) => (
          <ellipse key={i} cx={x + dx} cy={y + dy} rx={r} ry={r * 0.6} fill="#7E7A6E" stroke={P0} strokeWidth={3} opacity={mode === 'night' ? 0.5 : 1} />
        ))}
      </g>
    )}
  </g>
);

/**
 * The Roman countryside, side-on: sky, far hills, the marble city on its hills, the aqueduct striding across, cypresses
 * and pines, and the road along the ground line. `scroll` slides the near layers for a tracking shot (parallax).
 */
export const Country: React.FC<{ t: number; id?: string; mode?: Mode; city?: boolean; aqueduct?: boolean; stone?: boolean; scroll?: number; tunnel?: 'tunnel' | 'hill' | null; flash?: number; cityX?: number }> = ({
  t, id = 'cty', mode = 'day', city = true, aqueduct = true, stone = false, scroll = 0, tunnel = null, flash = 0, cityX = 1300,
}) => {
  const H = HILL[mode];
  return (
    <g>
      <Sky id={id} mode={mode} t={t} sunX={mode === 'dusk' ? 1560 : 1500} sunY={mode === 'dusk' ? 560 : 300} />
      <g transform={`translate(${-scroll * 0.1} 0)`}>
        <Hills y={640} amp={120} seed={1} color={H[0]} />
        {city ? <FarCity x={cityX} y={600} s={0.9} mode={mode} lit={mode === 'night' ? 1 : 0} /> : null}
      </g>
      <g transform={`translate(${-scroll * 0.25} 0)`}>
        <Hills y={700} amp={70} seed={4} color={H[1]} />
        {aqueduct ? <Aqueduct x0={-500} x1={2600} y={700} h={190} mode={mode} tiers={2} /> : null}
      </g>
      <g transform={`translate(${-scroll * 0.55} 0)`}>
        <Hills y={790} amp={40} seed={7} color={H[2]} x0={-800} x1={4000} />
        {[-300, 120, 560, 980, 1500, 1900, 2400, 2900].map((cx, i) => (
          <Cypress key={i} x={cx} y={790 - 10 * (i % 2)} h={180 + (i % 3) * 50} t={t} color={mode === 'night' ? '#10141E' : mode === 'dusk' ? '#2A2032' : '#33432A'} />
        ))}
        {[300, 1700, 2700].map((px, i) => <Pine key={`p${i}`} x={px} y={792} s={0.9} color={mode === 'night' ? '#121624' : mode === 'dusk' ? '#2E2436' : '#3E5030'} />)}
      </g>
      {tunnel ? <TunnelHill x={300 - scroll} y={GROUND - 40} mode={mode} tunnel={tunnel === 'tunnel'} flash={flash} /> : null}
      <rect x={-600} y={800} width={3100} height={900} fill={H[3]} />
      <Road y={GROUND} mode={mode} stone={stone} scroll={scroll} />
      {Array.from({ length: 30 }).map((_, i) => {
        const gx = ((i * 140 - scroll) % 4200 + 4200) % 4200 - 600;
        return <path key={i} d={`M ${gx} 960 q 6 -26 14 -34 M ${gx + 10} 962 q 2 -20 -6 -30`} stroke={H[2]} strokeWidth={4} fill="none" />;
      })}
      {mode === 'night' ? <rect x={-600} y={-500} width={3100} height={2100} fill="#05061A" opacity={0.25} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- the car
export const CAR_RED = '#D8352B';
/**
 * The car, side-on, facing right (flip to face left): about 940 units long at s 1 (a 4.3 m hatchback beside a 1.7 m
 * person at scale 1). x the middle, y the ground. `spin` turns the wheels (degrees), `bounce` lifts the body,
 * `lights` the headlights, `high` the high beams' reach, `sunroof` an open roof hatch (draw someone standing in it
 * BEFORE the car so the body hides their legs), `inside` draws through the side windows (the driver).
 */
export const Car: React.FC<{
  x: number; y: number; s?: number; flip?: boolean; color?: string; spin?: number; bounce?: number; lights?: number; high?: number; brake?: number;
  sunroof?: boolean; inside?: React.ReactNode; id?: string; dust?: number; t?: number; dirt?: number; flat?: number;
}> = ({ x, y, s = 1, flip = false, color = CAR_RED, spin = 0, bounce = 0, lights = 0, high = 0, brake = 0, sunroof = false, inside, id = 'car', dust = 0, t = 0, dirt = 0, flat = 0 }) => {
  const shade = 'rgba(0,0,0,0.22)';
  const body = 'M -470 -64 L -472 -170 Q -468 -206 -430 -214 L -300 -226 Q -220 -300 -120 -312 L 70 -314 Q 130 -312 170 -282 L 260 -214 Q 420 -204 456 -168 Q 476 -150 474 -110 L 470 -64 Z';
  const win = 'M -290 -222 Q -214 -290 -126 -296 L -20 -298 L -20 -222 Z M 0 -298 L 66 -298 Q 120 -296 156 -270 L 222 -222 L 0 -222 Z';
  const wheel = (wx: number, fl: number) => (
    <g key={wx} transform={`translate(${wx} ${-72})`}>
      <ellipse cx={0} cy={72 - fl * 6} rx={78} ry={10} fill="#000" opacity={0.3} />
      <g transform={`scale(1 ${1 - fl * 0.12}) translate(0 ${fl * 8})`}>
        <circle r={72} fill="#16141C" stroke={P0} strokeWidth={5} />
        <circle r={44} fill="#A8AAB4" stroke={P0} strokeWidth={4} />
        <g transform={`rotate(${spin})`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <path key={a} d="M -7 -10 L -9 -40 L 9 -40 L 7 -10 Z" fill="#6E707C" transform={`rotate(${a})`} />
          ))}
        </g>
        <circle r={12} fill="#55565E" stroke={P0} strokeWidth={3} />
      </g>
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {dust > 0
        ? Array.from({ length: 9 }).map((_, i) => {
            const p = ((t * 0.04 + i / 9) % 1);
            return <circle key={i} cx={-500 - p * 600} cy={-40 - p * 120 + Math.sin(i) * 20} r={40 + p * 120} fill="#E8D2A6" opacity={dust * 0.45 * (1 - p)} />;
          })
        : null}
      {high > 0 ? (
        <g opacity={clamp(high)}>
          <path d={`M 470 -150 L ${470 + 1400 * high} -330 L ${470 + 1400 * high} 40 L 470 -120 Z`} fill="#FFF6D0" opacity={0.28} />
          <Glow x={700} y={-130} r={420} o={0.8} />
        </g>
      ) : null}
      <g transform={`translate(0 ${-bounce})`}>
        <path d={body} fill={color} stroke={P0} strokeWidth={7} strokeLinejoin="round" />
        {/* the lower body in shade, the beltline crease, a sill */}
        <path d="M -472 -120 L 474 -116 L 470 -64 L -470 -64 Z" fill={shade} />
        <path d="M -460 -170 Q 0 -178 456 -160" stroke="#FFFFFF" strokeOpacity={0.3} strokeWidth={6} fill="none" />
        <rect x={-430} y={-74} width={860} height={12} rx={6} fill="#2A2830" />
        {dirt > 0 ? <path d="M -470 -64 L -472 -140 Q -300 -120 -100 -150 Q 200 -110 474 -140 L 470 -64 Z" fill="#8A6A44" opacity={0.5 * dirt} /> : null}
        <defs>
          <clipPath id={`${id}win`}>
            <path d={win} />
          </clipPath>
        </defs>
        <path d={win} fill="#1E2838" />
        <g clipPath={`url(#${id}win)`}>
          {inside}
          <path d="M -200 -300 L -150 -300 L -250 -200 L -300 -200 Z M -110 -300 L -90 -300 L -190 -200 L -210 -200 Z" fill="#FFFFFF" opacity={0.14} />
        </g>
        <path d={win} fill="none" stroke={P0} strokeWidth={6} strokeLinejoin="round" />
        <path d="M -10 -298 L -10 -70" stroke={P0} strokeWidth={5} opacity={0.7} />
        <path d="M 236 -214 L 236 -74" stroke={P0} strokeWidth={4} opacity={0.5} />
        <rect x={-120} y={-192} width={44} height={10} rx={5} fill={P0} opacity={0.7} />
        <rect x={110} y={-192} width={44} height={10} rx={5} fill={P0} opacity={0.7} />
        {/* side mirror */}
        <path d="M 214 -236 L 250 -246 L 262 -224 L 226 -216 Z" fill={color} stroke={P0} strokeWidth={4} />
        {/* the sunroof hatch, tipped open */}
        {sunroof ? <path d="M -120 -316 L 20 -318 L 40 -346 L -100 -344 Z" fill="#1E2838" stroke={P0} strokeWidth={5} /> : null}
        {/* lamps */}
        <path d="M 440 -176 Q 470 -168 472 -144 L 436 -148 Z" fill={lights > 0 ? '#FFF6D0' : '#D8D8DE'} stroke={P0} strokeWidth={4} />
        <rect x={-474} y={-196} width={20} height={44} rx={5} fill={brake > 0 ? '#FF2A2A' : '#9A2424'} stroke={P0} strokeWidth={4} />
        {lights > 0 ? <Glow x={480} y={-158} r={140} o={0.9 * lights} /> : null}
        {brake > 0 ? <Glow x={-470} y={-174} r={110} kind="red" o={brake} /> : null}
      </g>
      {wheel(-300, 0)}
      {wheel(300, flat)}
    </g>
  );
};

/**
 * The car head-on: about 420 units wide at s 1. x the middle, y the ground. `inside` draws through the windscreen
 * (two heads: driver on the left of frame for a right-hand-traffic car is on screen right, but keep it simple: you
 * on the left, Mo on the right). `lights` 0..1, `high` puts flares on.
 */
export const CarFront: React.FC<{ x: number; y: number; s?: number; color?: string; lights?: number; high?: number; inside?: React.ReactNode; id?: string; bounce?: number }> = ({ x, y, s = 1, color = CAR_RED, lights = 0, high = 0, inside, id = 'cf', bounce = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={250} ry={22} fill="#000" opacity={0.35} />
    {[-1, 1].map((sd) => (
      <rect key={sd} x={sd * 200 - 34} y={-90} width={68} height={92} rx={16} fill="#16141C" stroke={P0} strokeWidth={5} />
    ))}
    <g transform={`translate(0 ${-bounce})`}>
      <path d="M -226 -60 L -232 -170 Q -228 -200 -196 -210 L -160 -214 L -126 -300 Q -110 -320 -80 -322 L 80 -322 Q 110 -320 126 -300 L 160 -214 L 196 -210 Q 228 -200 232 -170 L 226 -60 Z" fill={color} stroke={P0} strokeWidth={7} strokeLinejoin="round" />
      <defs>
        <clipPath id={`${id}ws`}>
          <path d="M -150 -216 L -118 -296 Q -106 -308 -80 -308 L 80 -308 Q 106 -308 118 -296 L 150 -216 Z" />
        </clipPath>
      </defs>
      <path d="M -150 -216 L -118 -296 Q -106 -308 -80 -308 L 80 -308 Q 106 -308 118 -296 L 150 -216 Z" fill="#1E2838" />
      <g clipPath={`url(#${id}ws)`}>
        {inside}
        <path d="M -60 -308 L -20 -308 L -90 -216 L -130 -216 Z" fill="#FFFFFF" opacity={0.13} />
      </g>
      <path d="M -150 -216 L -118 -296 Q -106 -308 -80 -308 L 80 -308 Q 106 -308 118 -296 L 150 -216 Z" fill="none" stroke={P0} strokeWidth={6} />
      {[-1, 1].map((sd) => (
        <path key={`m${sd}`} d={`M ${sd * 160} -222 L ${sd * 210} -240 L ${sd * 214} -214 L ${sd * 166} -206 Z`} fill={color} stroke={P0} strokeWidth={4} />
      ))}
      {/* grille, plate, lamps */}
      <rect x={-110} y={-140} width={220} height={46} rx={14} fill="#1A1A22" stroke={P0} strokeWidth={4} />
      {[-80, -40, 0, 40, 80].map((gx) => <path key={gx} d={`M ${gx} -136 L ${gx} -98`} stroke="#3A3A44" strokeWidth={4} />)}
      <rect x={-56} y={-86} width={112} height={26} rx={4} fill="#F2F2EE" stroke={P0} strokeWidth={3} />
      <rect x={-232} y={-70} width={464} height={12} fill="#000" opacity={0.25} />
      {[-1, 1].map((sd) => (
        <g key={`l${sd}`}>
          <path d={`M ${sd * 130} -176 L ${sd * 214} -182 Q ${sd * 222} -160 ${sd * 210} -146 L ${sd * 132} -146 Z`} fill={lights > 0 ? '#FFF8DA' : '#D6D8DE'} stroke={P0} strokeWidth={4} />
          {lights > 0 ? <Glow x={sd * 172} y={-164} r={160 + 260 * high} o={lights} /> : null}
          {high > 0 ? <path d={`M ${sd * 172 - 300 * high} -164 L ${sd * 172 + 300 * high} -164 M ${sd * 172} ${-164 - 120 * high} L ${sd * 172} ${-164 + 120 * high}`} stroke="#FFFBE6" strokeWidth={6} opacity={0.8 * high} strokeLinecap="round" /> : null}
        </g>
      ))}
    </g>
  </g>
);

/** A fuel gauge dial, insert-sized: E to F over 120 degrees, the needle at p (0 empty .. 1 full), a warning lamp. */
export const FuelGauge: React.FC<{ x: number; y: number; s?: number; p: number; warn?: number; t?: number }> = ({ x, y, s = 1, p, warn = 0, t = 0 }) => {
  const a = -60 + 120 * clamp(p);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle r={230} fill="#101018" stroke="#3A3A48" strokeWidth={14} />
      <circle r={200} fill="#14141E" />
      {Array.from({ length: 9 }).map((_, i) => {
        const ta = ((-60 + i * 15 - 90) * Math.PI) / 180;
        const r0 = i % 2 ? 150 : 132;
        return <path key={i} d={`M ${Math.cos(ta) * r0} ${Math.sin(ta) * r0} L ${Math.cos(ta) * 180} ${Math.sin(ta) * 180}`} stroke={i < 2 ? '#FF4A3A' : '#F6EFE3'} strokeWidth={i % 2 ? 6 : 10} strokeLinecap="round" />;
      })}
      <text x={-118} y={-40} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill="#FF4A3A">E</text>
      <text x={118} y={-40} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill="#F6EFE3">F</text>
      {/* the pump icon */}
      <g transform="translate(0 90)" opacity={warn > 0 ? 0.4 + 0.6 * Math.abs(Math.sin(t / 5)) * warn : 0.35}>
        <rect x={-26} y={-34} width={36} height={56} rx={5} fill={warn > 0 ? '#FFB020' : '#6A6A78'} />
        <path d="M 10 -20 L 26 -8 L 26 20" stroke={warn > 0 ? '#FFB020' : '#6A6A78'} strokeWidth={7} fill="none" strokeLinecap="round" />
        <rect x={-20} y={-28} width={24} height={16} fill="#14141E" />
      </g>
      <g transform={`rotate(${a})`}>
        <path d="M -8 10 L 0 -176 L 8 10 Z" fill="#FF6A2A" />
      </g>
      <circle r={22} fill="#2A2A36" stroke="#55556A" strokeWidth={4} />
      <Glow x={0} y={-60} r={240} kind="warm" o={0.25} />
    </g>
  );
};

/**
 * The view through the windscreen from the back seat: the outside (children, drawn in screen space) framed by the
 * pillars and the roof, the dashboard and the steering wheel below, you at the wheel (left) and Mo (right) from behind.
 */
export const Windscreen: React.FC<{ t: number; children: React.ReactNode; shake?: number; gps?: string; you?: React.ReactNode; mo?: React.ReactNode; dash?: string }> = ({ t, children, shake = 0, gps, you, mo, dash = '#1A1A22' }) => {
  const jx = Math.sin(t * 1.7) * shake, jy = Math.cos(t * 2.3) * shake;
  return (
    <g>
      <g transform={`translate(${jx * 0.5} ${jy * 0.5})`}>{children}</g>
      <g transform={`translate(${jx} ${jy})`}>
        {/* roof lining, A-pillars */}
        <path d="M -200 -200 L 2120 -200 L 2120 120 Q 960 60 -200 120 Z" fill="#1E1C24" />
        <path d="M -200 -200 L 160 -200 L 260 120 L -40 780 L -200 780 Z" fill="#26242C" />
        <path d="M 2120 -200 L 1760 -200 L 1660 120 L 1960 780 L 2120 780 Z" fill="#26242C" />
        {/* rear-view mirror */}
        <rect x={880} y={110} width={160} height={50} rx={14} fill="#2A2832" stroke={P0} strokeWidth={4} />
        <rect x={890} y={118} width={140} height={34} rx={10} fill="#5E6A80" opacity={0.6} />
        {/* dashboard */}
        <path d="M -200 760 Q 960 640 2120 760 L 2120 1300 L -200 1300 Z" fill={dash} />
        <path d="M -200 760 Q 960 640 2120 760" stroke="#3A3842" strokeWidth={8} fill="none" />
        {gps !== undefined ? (
          <g>
            <rect x={860} y={720} width={200} height={120} rx={12} fill="#0A1420" stroke="#3A3842" strokeWidth={6} />
            <text x={960} y={790} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#7FD0FF">{gps}</text>
            <Glow x={960} y={780} r={160} kind="cool" o={0.4} />
          </g>
        ) : null}
        {you}
        {mo}
        {/* steering wheel, left */}
        <circle cx={520} cy={900} r={170} fill="none" stroke="#141218" strokeWidth={30} />
        <path d="M 360 920 L 680 920" stroke="#141218" strokeWidth={26} />
      </g>
    </g>
  );
};

/** A car interior seen from inside the tunnel's light: the orange lamps rushing past overhead (for the windscreen). */
export const TunnelView: React.FC<{ t: number; flick?: number; flash?: number }> = ({ t, flick = 0, flash = 0 }) => {
  const vp = { x: 960, y: 470 };
  return (
    <g>
      <rect x={-200} y={-200} width={2320} height={1500} fill="#1C1A20" />
      <path d={`M -200 1300 L ${vp.x - 40} ${vp.y + 30} L ${vp.x + 40} ${vp.y + 30} L 2120 1300 Z`} fill="#26242A" />
      <path d={`M -200 -200 L ${vp.x - 60} ${vp.y - 40} L ${vp.x + 60} ${vp.y - 40} L 2120 -200 Z`} fill="#2C2A30" />
      <rect x={vp.x - 60} y={vp.y - 40} width={120} height={70} fill="#0A0A0E" />
      {Array.from({ length: 10 }).map((_, i) => {
        const k = ((i / 10 + t * 0.03) % 1);
        const z = Math.pow(k, 2.2);
        const on = flick > 0 && Math.sin(t * 2.7 + i * 1.3) > 0.3 - flick ? 0.15 : 1;
        return [-1, 1].map((sd) => (
          <g key={`${i}${sd}`}>
            <rect x={vp.x + sd * (70 + 1100 * z) - 30 * (0.2 + z * 3)} y={vp.y - 50 - 600 * z} width={60 * (0.2 + z * 3)} height={8 * (0.3 + z * 3)} fill="#FFB24A" opacity={on} />
            <Glow x={vp.x + sd * (70 + 1100 * z)} y={vp.y - 50 - 600 * z} r={30 + z * 200} o={0.5 * on} />
          </g>
        ));
      })}
      {Array.from({ length: 8 }).map((_, i) => {
        const k = ((i / 8 + t * 0.03) % 1);
        const z = Math.pow(k, 2.2);
        return <rect key={`ln${i}`} x={vp.x - 6 - z * 30} y={vp.y + 40 + z * 760} width={12 + z * 60} height={10 + z * 120} fill="#E8E2C8" opacity={0.7} />;
      })}
      {flash > 0 ? <rect x={-200} y={-200} width={2320} height={1500} fill="#FFFFFF" opacity={flash} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- animals and the chariot
/**
 * A horse side-on, facing right (flip for left): hooves on y, about 360 units at the withers at s 1. `run` is the
 * gallop phase (0 stands), `rear` 0..1 lifts the front onto the hind legs, `color` its coat.
 */
export const Horse: React.FC<{ x: number; y: number; s?: number; flip?: boolean; run?: number; rear?: number; color?: string; mane?: string; donkey?: boolean; t?: number }> = ({
  x, y, s = 1, flip = false, run = 0, rear = 0, color = '#7A4A2E', mane = '#2A1A14', donkey = false, t = 0,
}) => {
  const ph = run;
  const gal = run !== 0 ? 1 : 0;
  const leg = (hx: number, hy: number, a: number, b: number, k: string) => {
    const r = (d: number) => (d * Math.PI) / 180;
    const kx = hx + Math.sin(r(a)) * 90, ky = hy + Math.cos(r(a)) * 90;
    const fx = kx + Math.sin(r(a + b)) * 92, fy = ky + Math.cos(r(a + b)) * 92;
    return (
      <g key={k}>
        <path d={`M ${hx} ${hy} L ${kx} ${ky} L ${fx} ${fy}`} stroke={P0} strokeWidth={30} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${hx} ${hy} L ${kx} ${ky} L ${fx} ${fy}`} stroke={color} strokeWidth={22} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x={fx - 14} y={fy - 4} width={28} height={16} rx={4} fill={P0} transform={`rotate(${-(a + b) * 0.3} ${fx} ${fy})`} />
      </g>
    );
  };
  const sw = (o: number, amp: number) => Math.sin(ph + o) * amp * gal;
  const bob = gal * Math.abs(Math.sin(ph)) * 14;
  const body = (
    <g>
      {leg(-110, -200, 10 + sw(Math.PI, 34), -10 - Math.max(0, sw(Math.PI + 1, 50)), 'bl')}
      {leg(110, -200, -6 + sw(0.6 + Math.PI, 38) - rear * 60, 10 + Math.max(0, sw(1.6 + Math.PI, 70)) + rear * 80, 'fl')}
      <path d="M -170 -250 Q -180 -330 -90 -340 L 110 -340 Q 170 -336 180 -280 Q 176 -200 110 -190 L -110 -190 Q -170 -196 -170 -250 Z" fill={color} stroke={P0} strokeWidth={6} />
      <path d="M -160 -230 Q 0 -200 170 -230 L 160 -200 Q 0 -180 -150 -200 Z" fill="#000" opacity={0.15} />
      {/* neck and head */}
      <path d="M 120 -320 Q 170 -400 210 -460 L 260 -440 Q 230 -380 190 -290 Z" fill={color} stroke={P0} strokeWidth={6} strokeLinejoin="round" />
      <path d="M 200 -470 Q 240 -500 300 -470 L 330 -420 Q 330 -396 300 -398 L 248 -420 Z" fill={color} stroke={P0} strokeWidth={6} strokeLinejoin="round" />
      {donkey ? (
        <g>
          <path d="M 214 -480 L 196 -580 L 226 -490 Z M 232 -484 L 230 -584 L 250 -490 Z" fill={color} stroke={P0} strokeWidth={5} strokeLinejoin="round" />
          <ellipse cx={316} cy={-414} rx={20} ry={14} fill="#D8D0C2" />
        </g>
      ) : (
        <g>
          <path d="M 214 -478 L 210 -510 L 230 -482 Z" fill={color} stroke={P0} strokeWidth={5} />
          <path d={`M 196 -470 Q ${150 + sw(1, 10)} -420 ${130 + sw(1.4, 14)} -330 L 160 -330 Q 180 -410 210 -458 Z`} fill={mane} />
        </g>
      )}
      <circle cx={262} cy={-452} r={7} fill={P0} />
      <circle cx={264} cy={-454} r={2.5} fill="#FFFFFF" />
      {/* tail */}
      <path d={`M -168 -310 Q ${-230 + sw(2, 20)} ${-270 - gal * 40} ${-220 + sw(2.6, 30)} ${-170 - gal * 70}`} stroke={donkey ? color : mane} strokeWidth={donkey ? 10 : 24} fill="none" strokeLinecap="round" />
      {leg(-90, -200, -10 + sw(0.3, 34), -10 - Math.max(0, sw(1.3, 50)), 'br')}
      {leg(130, -200, 8 + sw(0.9, 38) - rear * 50, 10 + Math.max(0, sw(1.9, 70)) + rear * 70, 'fr')}
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={6} rx={200} ry={16} fill="#000" opacity={0.25} />
      <g transform={`translate(0 ${-bob}) rotate(${-rear * 34} -120 -10)`}>{body}</g>
    </g>
  );
};

/** A two-wheeled racing chariot, facing right: x the axle, y the ground. Draw the charioteer standing at chariotStand. */
export const Chariot: React.FC<{ x: number; y: number; s?: number; spin?: number; color?: string; flip?: boolean }> = ({ x, y, s = 1, spin = 0, color = '#3E8A4A', flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M -70 -110 Q -80 -200 -10 -210 L 70 -200 L 80 -110 Z" fill={color} stroke={P0} strokeWidth={6} />
    <path d="M -60 -170 Q 0 -180 70 -170" stroke="#E8C46A" strokeWidth={8} fill="none" />
    <path d="M 70 -120 L 330 -170" stroke="#5A3A22" strokeWidth={12} strokeLinecap="round" />
    <g transform="translate(0 -95)">
      <circle r={95} fill="none" stroke="#5A3A22" strokeWidth={12} />
      <g transform={`rotate(${spin})`}>
        {[0, 45, 90, 135].map((a) => <path key={a} d="M -90 0 L 90 0" stroke="#5A3A22" strokeWidth={7} transform={`rotate(${a})`} />)}
      </g>
      <circle r={14} fill="#3A2614" />
    </g>
  </g>
);
export const chariotStand = (x: number, y: number, s = 1) => ({ x: x + 0 * s, y: y - 120 * s - LEG_LEN * 0.9 * s, scale: 0.9 * s });

// ---------------------------------------------------------------- crowds
const TUNICS = ['#B8463A', '#D8C8A6', '#5E7A9A', '#8A6A3A', '#E2DCCB', '#6E8A4A', '#A85A7A', '#C89A4A'];
/** A crowd as rows of heads and shoulders (from behind or front), bobbing; `cheer` raises arms, `t` animates. */
export const Crowd: React.FC<{ x0: number; x1: number; y: number; s?: number; rows?: number; t: number; cheer?: number; seed?: number; dark?: number; facing?: 'front' | 'back' }> = ({
  x0, x1, y, s = 1, rows = 2, t, cheer = 0, seed = 1, dark = 0, facing = 'front',
}) => (
  <g>
    {Array.from({ length: rows }).map((_, r) => {
      const n = Math.ceil((x1 - x0) / (70 * s));
      const rs = s * (1 - r * 0.12);
      return (
        <g key={r} opacity={1}>
          {Array.from({ length: n }).map((_, i) => {
            const cx = x0 + i * 70 * s + (r % 2) * 35 * s + rnd(seed + r, i) * 20 * s;
            const cy = y - r * 46 * s - Math.abs(Math.sin(t / 6 + i * 1.7 + r)) * 10 * s * (0.3 + cheer);
            const c = TUNICS[Math.floor(rnd(seed + 7, i + r * 31) * TUNICS.length)];
            const arm = cheer > 0 && rnd(seed + 11, i + r * 17) < cheer;
            const ang = Math.sin(t / 4 + i) * 12;
            return (
              <g key={i} transform={`translate(${cx} ${cy}) scale(${rs})`}>
                {arm ? <path d={`M -18 -30 L ${-30 + ang} -110 M 18 -30 L ${30 - ang} -110`} stroke="#26232F" strokeWidth={12} strokeLinecap="round" /> : null}
                <path d="M -34 40 Q -36 -24 0 -30 Q 36 -24 34 40 Z" fill={c} stroke={P0} strokeWidth={3} />
                <circle cx={0} cy={-58} r={28} fill="#26232F" stroke={P0} strokeWidth={3} />
                {facing === 'front' ? (
                  <g>
                    <ellipse cx={-9} cy={-60} rx={6} ry={8} fill="#F6EFE3" />
                    <ellipse cx={9} cy={-60} rx={6} ry={8} fill="#F6EFE3" />
                    <circle cx={-9 + Math.sin(i) * 2} cy={-59} r={3} fill={P0} />
                    <circle cx={9 + Math.sin(i) * 2} cy={-59} r={3} fill={P0} />
                    {cheer > 0.5 ? <ellipse cx={0} cy={-42} rx={7} ry={6} fill={P0} /> : null}
                  </g>
                ) : null}
              </g>
            );
          })}
          {dark > 0 ? <rect x={x0 - 60} y={y - r * 46 * s - 120 * s} width={x1 - x0 + 120} height={180 * s} fill="#0B0816" opacity={dark * (0.3 + r * 0.2)} /> : null}
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------- city sets
/** A burning torch on a wall bracket or a pole. */
export const Torch: React.FC<{ x: number; y: number; t: number; s?: number; seed?: number; glow?: number }> = ({ x, y, t, s = 1, seed = 1, glow = 1 }) => {
  const fl = 1 + 0.12 * Math.sin(t / 2 + seed) + 0.06 * Math.sin(t / 1.1 + seed * 3);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {glow > 0 ? <Glow x={0} y={-60} r={330 * fl} o={0.8 * glow} /> : null}
      <path d="M -8 0 L -12 -50 L 12 -50 L 8 0 Z" fill="#4A3020" stroke={P0} strokeWidth={4} />
      <g transform={`translate(0 -52) scale(1 ${fl}) skewX(${Math.sin(t / 3 + seed) * 6})`}>
        <path d="M 0 -70 Q 26 -30 18 -10 Q 12 4 0 4 Q -12 4 -18 -10 Q -26 -30 0 -70 Z" fill="#FF8A1A" />
        <path d="M 0 -46 Q 12 -24 8 -10 Q 4 0 0 0 Q -4 0 -8 -10 Q -12 -24 0 -46 Z" fill="#FFE27A" />
      </g>
    </g>
  );
};

/** The city wall and gate, side-on/frontal: towers either side of a big arch, the road running through. */
export const CityGate: React.FC<{ t: number; id?: string; mode?: Mode }> = ({ t, id = 'gate', mode = 'day' }) => {
  const [m, ms] = MARBLE[mode];
  const wall = mode === 'night' ? '#3A3A58' : mode === 'dusk' ? '#B07A66' : '#C9AE84';
  const wallD = mode === 'night' ? '#26263E' : mode === 'dusk' ? '#7E5250' : '#A68C64';
  return (
    <g>
      <Sky id={id} mode={mode} t={t} sunX={1650} sunY={mode === 'dusk' ? 600 : 260} />
      <FarCity x={960} y={460} s={1.3} mode={mode} />
      <rect x={-600} y={300} width={3100} height={560} fill={wall} />
      {Array.from({ length: 40 }).map((_, i) => (
        <rect key={i} x={-600 + i * 80} y={268} width={50} height={36} fill={wall} />
      ))}
      {Array.from({ length: 14 }).map((_, r) => (
        <path key={`r${r}`} d={`M -600 ${330 + r * 38} L 2500 ${330 + r * 38}`} stroke={wallD} strokeWidth={3} opacity={0.6} />
      ))}
      {[620, 1300].map((tx, i) => (
        <g key={i}>
          <rect x={tx - 130} y={160} width={260} height={700} fill={wall} stroke={wallD} strokeWidth={4} />
          {Array.from({ length: 4 }).map((_, k) => <rect key={k} x={tx - 130 + k * 70} y={124} width={50} height={40} fill={wall} />)}
          <rect x={tx - 26} y={260} width={52} height={90} rx={26} fill="#1A1420" />
        </g>
      ))}
      {/* the arch */}
      <path d={`M 750 860 L 750 520 A 210 210 0 0 1 1170 520 L 1170 860 Z`} fill="#2A2028" stroke={wallD} strokeWidth={8} />
      <path d={`M 790 860 L 790 530 A 170 170 0 0 1 1130 530 L 1130 860 Z`} fill={mode === 'night' ? '#141428' : '#E8D2A6'} opacity={0.6} />
      <rect x={730} y={290} width={460} height={70} fill={m} stroke={wallD} strokeWidth={4} />
      <text x={960} y={340} textAnchor="middle" fontFamily="Georgia, serif" fontSize={44} letterSpacing={14} fill={ms}>SPQR</text>
      <rect x={-600} y={850} width={3100} height={800} fill={mode === 'night' ? '#1E1C30' : mode === 'dusk' ? '#6A4A50' : '#B49A72'} />
      <Road y={GROUND + 20} mode={mode} stone />
      {mode === 'night' ? <Torch x={720} y={600} t={t} /> : null}
      {mode === 'night' ? <Torch x={1200} y={600} t={t} seed={3} /> : null}
    </g>
  );
};

/** The Forum: temple fronts on a raised line, a basilica colonnade, statues on plinths, the paved square in front. */
export const Forum: React.FC<{ t: number; id?: string; mode?: Mode; torches?: number; crowd?: number; cheer?: number }> = ({ t, id = 'forum', mode = 'day', torches = 0, crowd = 0, cheer = 0 }) => {
  const [m, ms] = MARBLE[mode];
  const pave = mode === 'night' ? '#24243C' : mode === 'dusk' ? '#9A7468' : '#D8C8A8';
  return (
    <g>
      <Sky id={id} mode={mode} t={t} sunX={300} sunY={mode === 'dusk' ? 560 : 240} />
      <FarCity x={1500} y={430} s={1.1} mode={mode} />
      {/* basilica colonnade across the back */}
      <rect x={-600} y={360} width={3100} height={20} fill={m} />
      {Array.from({ length: 30 }).map((_, i) => (
        <rect key={i} x={-580 + i * 100} y={380} width={36} height={270} fill={i % 2 ? m : ms} stroke={P0} strokeWidth={2} strokeOpacity={0.4} />
      ))}
      <rect x={-600} y={640} width={3100} height={30} fill={ms} />
      <Temple x={420} y={700} w={560} mode={mode} />
      <Temple x={1560} y={700} w={640} mode={mode} cols={8} gold />
      {/* statues */}
      {[960, 120, 1980].map((sx, i) => (
        <g key={i}>
          <rect x={sx - 50} y={520} width={100} height={180} fill={ms} stroke={P0} strokeWidth={3} strokeOpacity={0.5} />
          <path d={`M ${sx - 26} 520 L ${sx - 20} 420 Q ${sx} 400 ${sx + 20} 420 L ${sx + 26} 520 Z`} fill={m} />
          <circle cx={sx} cy={392} r={22} fill={m} />
          <path d={`M ${sx + 18} 430 L ${sx + 60} 380`} stroke={m} strokeWidth={14} strokeLinecap="round" />
        </g>
      ))}
      <rect x={-600} y={700} width={3100} height={1000} fill={pave} />
      {Array.from({ length: 16 }).map((_, i) => (
        <path key={`pv${i}`} d={`M ${-600 + i * 220} 700 L ${-900 + i * 260} 1700`} stroke="#000" strokeOpacity={0.08} strokeWidth={4} />
      ))}
      {[760, 820, 900, 1000].map((py, i) => <path key={`ph${i}`} d={`M -600 ${py} L 2500 ${py}`} stroke="#000" strokeOpacity={0.08} strokeWidth={3} />)}
      {crowd > 0 ? <Crowd x0={-300} x1={2300} y={760} s={0.7} rows={3} t={t} cheer={cheer} seed={3} /> : null}
      {torches > 0
        ? [180, 700, 1220, 1740].map((tx, i) => <Torch key={i} x={tx} y={640} t={t} seed={i} glow={torches} />)
        : null}
      {mode === 'night' ? <rect x={-600} y={-500} width={3100} height={2100} fill="#04040E" opacity={0.35} /> : null}
    </g>
  );
};

/**
 * The Circus Maximus, side-on from the inner edge of the track: tiers of stands packed with a cheering crowd behind,
 * the spina (the central barrier with its obelisk and the lap counters) in front, the sand track along the ground
 * line. `laps` shows how many of the seven bronze dolphins have tipped.
 */
export const Circus: React.FC<{ t: number; id?: string; cheer?: number; spina?: boolean; laps?: number; scroll?: number }> = ({ t, id = 'circ', cheer = 0.5, spina = true, laps = 0, scroll = 0 }) => (
  <g>
    <Sky id={id} mode="day" t={t} sunX={1700} sunY={160} />
    <g transform={`translate(${-scroll * 0.3} 0)`}>
      {/* the stands: three tiers rising to an arcade */}
      <rect x={-1200} y={120} width={5200} height={40} fill="#E8DCC4" />
      {Array.from({ length: 50 }).map((_, i) => (
        <rect key={i} x={-1200 + i * 104} y={150} width={60} height={70} rx={30} fill="#5A4A3A" opacity={0.5} />
      ))}
      <rect x={-1200} y={220} width={5200} height={380} fill="#CDBA98" />
      {[0, 1, 2].map((tier) => (
        <g key={tier}>
          <Crowd x0={-1200} x1={4000} y={330 + tier * 120} s={0.5} rows={2} t={t + tier * 10} cheer={cheer} seed={20 + tier} />
          <rect x={-1200} y={354 + tier * 120} width={5200} height={14} fill="#A8946E" />
        </g>
      ))}
      <rect x={-1200} y={600} width={5200} height={60} fill="#B8A07A" stroke={P0} strokeWidth={3} strokeOpacity={0.4} />
    </g>
    {/* the track */}
    <rect x={-600} y={660} width={3100} height={1000} fill="#D9B880" />
    {Array.from({ length: 40 }).map((_, i) => {
      const gx = ((i * 113 - scroll) % 4520 + 4520) % 4520 - 800;
      return <path key={i} d={`M ${gx} ${720 + (i % 5) * 50} l 60 0`} stroke="#B8945E" strokeWidth={4} opacity={0.6} />;
    })}
    {spina ? (
      <g transform={`translate(${-((scroll * 0.9) % 4000)} 0)`}>
        {[0, 4000].map((ox) => (
          <g key={ox} transform={`translate(${ox} 0)`}>
            <rect x={-600} y={930} width={3200} height={70} fill="#E8DCC4" stroke={P0} strokeWidth={4} strokeOpacity={0.5} />
            <path d="M 900 930 L 930 560 L 960 520 L 990 560 L 1020 930 Z" fill="#C8A878" stroke={P0} strokeWidth={4} strokeOpacity={0.6} />
            {/* the lap counters: seven dolphins on a frame */}
            <rect x={1400} y={820} width={360} height={10} fill="#8A6A3A" />
            {[1420, 1530, 1740].map((px) => <rect key={px} x={px} y={820} width={10} height={110} fill="#8A6A3A" />)}
            {Array.from({ length: 7 }).map((_, k) => (
              <path key={k} d={`M ${1430 + k * 48} 816 q 14 -26 30 -10 q -10 4 -14 12 Z`} fill="#C88A3A" transform={k < laps ? `rotate(150 ${1446 + k * 48} 812)` : undefined} />
            ))}
          </g>
        ))}
      </g>
    ) : null}
  </g>
);

/** The palace courtyard on the Palatine: a peristyle of marble columns, gilded capitals, a fountain, a patterned floor. */
export const PALACE = { feet: 860 };
export const Palace: React.FC<{ t: number; id?: string; mode?: Mode }> = ({ t, id = 'pal', mode = 'day' }) => {
  const night = mode === 'night';
  const m = night ? '#4A5078' : '#F2EADA', ms = night ? '#30355A' : '#D2C6AE';
  return (
    <g>
      <Sky id={id} mode={mode} t={t} sunX={1500} sunY={night ? 300 : 200} />
      <rect x={-600} y={200} width={3100} height={500} fill={night ? '#262A48' : '#C9A87A'} />
      {/* back colonnade: the far side of the courtyard */}
      <rect x={-600} y={240} width={3100} height={36} fill={m} />
      <rect x={-600} y={276} width={3100} height={10} fill="#D8A83A" />
      {Array.from({ length: 22 }).map((_, i) => (
        <g key={i}>
          <rect x={-560 + i * 140} y={286} width={50} height={380} fill={m} stroke={P0} strokeWidth={2} strokeOpacity={0.35} />
          <rect x={-570 + i * 140} y={286} width={70} height={18} fill="#E0B248" />
          <rect x={-570 + i * 140} y={656} width={70} height={14} fill={ms} />
        </g>
      ))}
      {/* doorways glowing in the shade */}
      {[200, 960, 1720].map((dx, i) => (
        <g key={`d${i}`}>
          <rect x={dx - 60} y={420} width={120} height={250} fill={night ? '#3A2A20' : '#5A3E2A'} />
          <Glow x={dx} y={560} r={140} o={night ? 0.7 : 0.3} />
        </g>
      ))}
      {/* the floor: marble in a pattern */}
      <rect x={-600} y={670} width={3100} height={1000} fill={night ? '#2A2E4A' : '#E6DCC8'} />
      {Array.from({ length: 18 }).map((_, i) => (
        <path key={`f${i}`} d={`M ${-600 + i * 200} 670 L ${-1400 + i * 300} 1600`} stroke={night ? '#20243C' : '#BFAF92'} strokeWidth={4} />
      ))}
      {[720, 790, 890, 1030].map((fy, i) => <path key={`fh${i}`} d={`M -600 ${fy} L 2500 ${fy}`} stroke={night ? '#20243C' : '#BFAF92'} strokeWidth={4} />)}
      <path d="M 560 760 L 1360 760 L 1460 840 L 460 840 Z" fill="#9A3A3A" opacity={0.35} />
      {/* fountain, back left */}
      <ellipse cx={240} cy={700} rx={150} ry={26} fill={ms} stroke={P0} strokeWidth={3} strokeOpacity={0.4} />
      <rect x={226} y={600} width={28} height={100} fill={m} />
      {[0, 1, 2].map((k) => {
        const p = ((t / 30 + k / 3) % 1);
        return <path key={k} d={`M 240 600 Q ${270 + p * 30} ${560 + p * 10} ${290 + p * 40} ${640 + p * 60}`} stroke="#BFE4FF" strokeWidth={4} fill="none" opacity={0.7 * (1 - p)} />;
      })}
      {/* near columns framing the shot */}
      {[-60, 1980].map((cx, i) => (
        <g key={`nc${i}`}>
          <rect x={cx - 70} y={-200} width={140} height={1100} fill={m} stroke={P0} strokeWidth={4} strokeOpacity={0.5} />
          <path d={`M ${cx - 30} -200 L ${cx - 30} 900 M ${cx + 30} -200 L ${cx + 30} 900`} stroke={ms} strokeWidth={6} />
        </g>
      ))}
      {night ? <rect x={-600} y={-500} width={3100} height={2100} fill="#04040E" opacity={0.3} /> : null}
    </g>
  );
};

/** A room in the palace: gold walls, a couch, an oil lamp and a window onto the night (or a storeroom of amphorae). */
export const GOLDROOM = makeRoom({ x: 960, y: 500 }, { x0: 520, x1: 1400, y0: 300, y1: 740 }, 3.4);
export const GoldRoom: React.FC<{ t: number; id?: string; store?: boolean; lamp?: number }> = ({ t, id = 'gold', store = false, lamp = 1 }) => {
  const R = GOLDROOM;
  const fl = 1 + 0.08 * Math.sin(t / 2.3);
  const lampP = R.P(0.78, 0.62, 0.15);
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall={store ? '#4A3A2E' : '#8A6A2E'} side={store ? '#3A2E24' : '#6E5222'} floorC={store ? '#3A3028' : '#5A3E2E'} />
      {!store ? (
        <g>
          {/* gold bands and painted panels on the back wall */}
          <rect x={520} y={330} width={880} height={14} fill="#E8B84A" />
          {[560, 800, 1040, 1250].map((px, i) => (
            <rect key={i} x={px} y={380} width={150} height={220} fill="#7A2A2A" stroke="#E8B84A" strokeWidth={6} />
          ))}
          {/* the window onto the night */}
          <rect x={890} y={390} width={140} height={190} fill="#141A3A" stroke="#E8B84A" strokeWidth={8} />
          <Stars seed={4} x0={896} y0={396} w={128} h={120} t={t} n={10} />
          <path d="M 960 390 L 960 580" stroke="#E8B84A" strokeWidth={5} />
          {/* a gilded couch */}
          <Box r={R} u={[0.08, 0.48]} v={[0.78, 1]} w={[0.05, 0.28]} front="#B8862E" top="#C8463A" side="#8A6222" rim />
          <FloorShadow r={R} u={[0.08, 0.48]} w={[0.05, 0.28]} />
          {/* a table with gold plates and a bowl of grapes */}
          <Box r={R} u={[0.62, 0.92]} v={[0.82, 1]} w={[0.06, 0.24]} front="#5A3A22" top="#7A5232" side="#3E2818" rim />
          {[0.68, 0.84].map((u, i) => {
            const p = R.P(u, 0.82, 0.12);
            return <ellipse key={i} cx={p.x} cy={p.y} rx={24} ry={8} fill="#E8B84A" stroke={P0} strokeWidth={2} />;
          })}
        </g>
      ) : (
        <g>
          {/* amphorae and sacks along the walls */}
          {[0.08, 0.18, 0.28, 0.72, 0.82].map((u, i) => {
            const p = R.P(u, 1, 0.08 + (i % 2) * 0.06);
            return (
              <g key={i}>
                <path d={`M ${p.x - 8} ${p.y} Q ${p.x - 40} ${p.y - 60} ${p.x - 20} ${p.y - 130} L ${p.x - 10} ${p.y - 150} L ${p.x + 10} ${p.y - 150} L ${p.x + 20} ${p.y - 130} Q ${p.x + 40} ${p.y - 60} ${p.x + 8} ${p.y} Z`} fill="#B0603A" stroke={P0} strokeWidth={3} />
                <path d={`M ${p.x - 12} ${p.y - 140} q -24 10 -18 34 M ${p.x + 12} ${p.y - 140} q 24 10 18 34`} stroke="#8A4A2A" strokeWidth={6} fill="none" />
              </g>
            );
          })}
          {[0.5, 0.58].map((u, i) => {
            const p = R.P(u, 1, 0.05);
            return <ellipse key={`s${i}`} cx={p.x} cy={p.y - 34} rx={46} ry={40} fill="#B8A07A" stroke={P0} strokeWidth={3} />;
          })}
        </g>
      )}
      {/* the oil lamp on a stand */}
      <path d={`M ${lampP.x} ${lampP.y + 200} L ${lampP.x} ${lampP.y + 10}`} stroke="#6A5222" strokeWidth={8} />
      <ellipse cx={lampP.x} cy={lampP.y + 6} rx={30} ry={10} fill="#C89A3A" stroke={P0} strokeWidth={3} />
      <path d={`M ${lampP.x + 22} ${lampP.y} q 6 -${22 * fl} 0 -${32 * fl} q -6 10 0 32`} fill="#FFB12A" opacity={lamp} />
      <LightVeil id={`${id}v`} lights={[[lampP.x, lampP.y, 520 * lamp], [960, 470, 220]]} o={store ? 0.6 : 0.45} />
      {lamp > 0 ? <Glow x={lampP.x + 22} y={lampP.y - 20} r={300 * fl} o={0.8 * lamp} /> : null}
      <Dust t={t} seed={5} x0={lampP.x - 300} y0={lampP.y - 300} w={600} h={500} n={14} o={0.4} />
    </g>
  );
};

// ---------------------------------------------------------------- small props
/** A spear, upright or at an angle (rot), its point at the top. x, y the butt. */
export const Spear: React.FC<{ x: number; y: number; len?: number; rot?: number }> = ({ x, y, len = 520, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d={`M 0 0 L 0 ${-len}`} stroke={P0} strokeWidth={13} strokeLinecap="round" />
    <path d={`M 0 0 L 0 ${-len}`} stroke="#8A6A44" strokeWidth={7} strokeLinecap="round" />
    <path d={`M 0 ${-len - 70} L 14 ${-len - 10} L 0 ${-len} L -14 ${-len - 10} Z`} fill="#B8BCC6" stroke={P0} strokeWidth={4} strokeLinejoin="round" />
  </g>
);
/** A Roman shield (scutum), front-on: red with a gold boss and wings. */
export const Shield: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-110} width={140} height={220} rx={18} fill="#B8302C" stroke={P0} strokeWidth={6} />
    <rect x={-60} y={-100} width={120} height={200} rx={14} fill="none" stroke="#E8B84A" strokeWidth={5} />
    <circle r={24} fill="#E8B84A" stroke={P0} strokeWidth={4} />
    <path d="M -50 -60 L -10 -20 M 50 -60 L 10 -20 M -50 60 L -10 20 M 50 60 L 10 20" stroke="#E8B84A" strokeWidth={8} strokeLinecap="round" />
  </g>
);
/** A wax writing tablet (two wooden leaves). */
export const WaxTablet: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-50} width={140} height={100} rx={6} fill="#8A5A32" stroke={P0} strokeWidth={4} />
    <rect x={-58} y={-38} width={116} height={76} fill="#3A2E24" />
    {[-20, 0, 20].map((ly) => <path key={ly} d={`M -48 ${ly} L 40 ${ly}`} stroke="#B8A47A" strokeWidth={3} strokeDasharray="10 6" />)}
  </g>
);
/** A leather bag of gold coins, a few spilling. */
export const CoinBag: React.FC<{ x: number; y: number; s?: number; spill?: number }> = ({ x, y, s = 1, spill = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -50 0 Q -70 -70 -20 -90 L -30 -110 L 30 -110 L 20 -90 Q 70 -70 50 0 Z" fill="#8A5A32" stroke={P0} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -26 -96 Q 0 -86 26 -96" stroke="#5A3A22" strokeWidth={6} fill="none" />
    {Array.from({ length: Math.round(spill * 6) }).map((_, i) => (
      <ellipse key={i} cx={-40 + i * 22} cy={6 - (i % 2) * 6} rx={14} ry={6} fill="#F2C64A" stroke={P0} strokeWidth={2} />
    ))}
  </g>
);
/** An amphora of olive oil, or a cup of it (cup). */
export const Amphora: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -10 0 Q -60 -70 -32 -170 L -18 -200 L 18 -200 L 32 -170 Q 60 -70 10 0 Z" fill="#B0603A" stroke={P0} strokeWidth={5} />
    <path d="M -16 -190 q -34 14 -26 50 M 16 -190 q 34 14 26 50" stroke="#8A4A2A" strokeWidth={9} fill="none" strokeLinecap="round" />
    <path d="M -30 -110 Q 0 -100 30 -110" stroke="#8A4A2A" strokeWidth={5} fill="none" />
  </g>
);
/** A hobnailed sandal (caliga) seen from below: the sole studded with iron nails. One nail can be loose (`loose`). */
export const Caliga: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -60 -200 Q 0 -230 60 -200 Q 80 -60 50 120 Q 0 170 -50 120 Q -80 -60 -60 -200 Z" fill="#6A4A2E" stroke={P0} strokeWidth={6} />
    {Array.from({ length: 22 }).map((_, i) => {
      const a = (i / 22) * Math.PI * 2;
      return <circle key={i} cx={Math.cos(a) * 52} cy={-30 + Math.sin(a) * 150} r={8} fill="#8A8E98" stroke={P0} strokeWidth={2} />;
    })}
    {[-20, 0, 20].map((dx) => [-120, -60, 0, 60].map((dy) => <circle key={`${dx}${dy}`} cx={dx} cy={dy} r={7} fill="#8A8E98" stroke={P0} strokeWidth={2} />))}
  </g>
);
/** One iron hobnail, big for an insert: a domed head and a short square shank. */
export const Hobnail: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -10 0 L -6 70 L 0 84 L 6 70 L 10 0 Z" fill="#5A5E68" stroke={P0} strokeWidth={4} />
    <path d="M -46 4 Q -40 -40 0 -44 Q 40 -40 46 4 Z" fill="#7A7E88" stroke={P0} strokeWidth={5} />
    <path d="M -24 -24 Q -10 -34 8 -34" stroke="#FFFFFF" strokeOpacity={0.4} strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);
/** A bunch of grapes. */
export const Grapes: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 -60 L 4 -80" stroke="#4A3A22" strokeWidth={5} />
    <path d="M 4 -74 q 20 -10 30 4 q -16 6 -30 -4" fill="#4E7A3A" />
    {[[0, -50], [-14, -36], [14, -36], [-22, -18], [0, -20], [22, -18], [-12, -2], [12, -2], [0, 14]].map(([gx, gy], i) => (
      <circle key={i} cx={gx} cy={gy} r={12} fill="#6A2A6A" stroke={P0} strokeWidth={2} />
    ))}
  </g>
);
/** A papyrus map of the palace, unrolled. */
export const PalaceMap: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-180} y={-120} width={360} height={240} fill="#E8D6A8" stroke={P0} strokeWidth={5} />
    <rect x={-196} y={-130} width={22} height={260} rx={11} fill="#B89A62" stroke={P0} strokeWidth={4} />
    <rect x={174} y={-130} width={22} height={260} rx={11} fill="#B89A62" stroke={P0} strokeWidth={4} />
    <path d="M -140 -80 L 140 -80 L 140 80 L -140 80 Z M -140 0 L 20 0 L 20 80 M 60 -80 L 60 20 L 140 20" stroke="#5A3A22" strokeWidth={5} fill="none" />
    <path d="M -110 50 Q -40 30 0 -30 Q 50 -60 110 -50" stroke="#C8302E" strokeWidth={5} strokeDasharray="12 8" fill="none" />
    <path d="M 100 -60 l 20 10 l -20 10" stroke="#C8302E" strokeWidth={5} fill="none" />
  </g>
);
/** A big key. */
export const Key: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle cx={-60} cy={0} r={30} fill="none" stroke="#C89A3A" strokeWidth={14} />
    <path d="M -30 0 L 70 0 M 50 0 L 50 26 M 70 0 L 70 22" stroke="#C89A3A" strokeWidth={14} strokeLinecap="round" />
  </g>
);
/** Tyre tracks in dust, seen from above at an angle: two bands of tread pattern running into the distance. */
export const Tracks: React.FC<{ x: number; y: number; t: number; reveal?: number; tread?: 'zig' | 'block'; color?: string }> = ({ x, y, t, reveal = 1, tread = 'zig', color = '#6A4A2E' }) => (
  <g transform={`translate(${x} ${y})`}>
    {[-1, 1].map((sd) => (
      <g key={sd}>
        {Array.from({ length: 16 }).map((_, i) => {
          const k = i / 16;
          if (k > reveal) return null;
          const yy = -k * 520;
          const w = 90 * (1 - k * 0.7);
          const cx = sd * (240 * (1 - k * 0.7));
          return tread === 'zig' ? (
            <path key={i} d={`M ${cx - w / 2} ${yy} L ${cx} ${yy - 20 * (1 - k * 0.6)} L ${cx + w / 2} ${yy}`} stroke={color} strokeWidth={10 * (1 - k * 0.6)} fill="none" opacity={0.8} />
          ) : (
            <g key={i}>
              <rect x={cx - w / 2} y={yy - 10} width={w * 0.4} height={14 * (1 - k * 0.6)} fill={color} opacity={0.8} />
              <rect x={cx + w * 0.1} y={yy - 22} width={w * 0.4} height={14 * (1 - k * 0.6)} fill={color} opacity={0.8} />
            </g>
          );
        })}
      </g>
    ))}
  </g>
);
