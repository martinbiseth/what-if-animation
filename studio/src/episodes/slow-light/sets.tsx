import React from 'react';
import {
  FONT, Glow, Hero, Look, Pose, basePose, clamp, kf, rnd, makeRoom, RoomShell, Box, LightVeil, Stars, NightSky, Sun, Moon,
  Schematic, SCH, SchLabel, backOut, LEG_LEN, Pt,
} from '../../engine';
import { StreetModern, STREETM } from '../electricity/sets';

// Sets and props for "What if light kept getting slower every hour?". The street reuses the modern street from the
// electricity episode, with a sun that fades out; everything else here is new: the light-speed readout that runs
// through the episode, a beam you can watch crawl, the Sun-to-Earth diagram, the shelter tunnel, the bus and the mirror.

const C0 = 299792.458; // km/s

/** The speed of light at hour h of the slowdown, as the readout shows it. */
export const speedText = (h: number) => {
  const v = C0 / Math.pow(2, h); // km/s
  if (v >= 1) return `${Math.round(v).toLocaleString('en-US')} km/s`;
  const ms = v * 1000;
  if (ms >= 1) return `${ms >= 100 ? Math.round(ms) : ms.toFixed(1)} m/s`;
  const cms = ms * 100;
  if (cms >= 1) return `${cms.toFixed(1)} cm/s`;
  return `${(cms * 10).toFixed(1)} mm/s`;
};

/** The readout in the corner: which hour of the slowdown it is, the clock, and the speed of light right now. */
export const HourHud: React.FC<{ t: number; hour: number; clock: string; x?: number; y?: number }> = ({ t, hour, clock, x = 70, y = 70 }) => {
  const o = clamp(t / 6);
  return (
    <g transform={`translate(${x} ${y})`} opacity={o}>
      <rect x={0} y={0} width={470} height={132} rx={22} fill="#0B0816" opacity={0.78} />
      <circle cx={42} cy={44} r={12} fill="#FFD23A" opacity={0.6 + 0.4 * Math.sin(t / 5)} />
      <text x={68} y={56} fontFamily={FONT.ui} fontSize={34} letterSpacing={3} fill="#F6EFE3">{`HOUR ${hour} · ${clock}`}</text>
      <text x={30} y={110} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFD23A">{`LIGHT: ${speedText(hour)}`}</text>
    </g>
  );
};

// ---------------------------------------------------------------- the street, with a sun that fades out
/**
 * The street by day with the Sun at brightness `sun` (1 a normal sunny day, 0 gone): the day picture cross-fades into
 * the night one (street lamps on, `lamps`), and the Sun's disc dims in the clear sky. No clouds needed: it's the
 * light that's missing.
 */
export const FadeStreet: React.FC<{ t: number; id?: string; sun: number; sunX?: number; sunY?: number; stars?: number; car?: boolean }> = ({
  t, id = 'fst', sun, sunX = 1480, sunY = 170, stars = 0, car = false,
}) => (
  <g>
    <StreetModern t={t} id={`${id}n`} mode="night" power={1} car={car} milky={0} />
    {stars < 1 ? <rect x={-400} y={-400} width={2800} height={STREETM.horizon + 400} fill="#05050F" opacity={(1 - stars) * 0.85} /> : null}
    <g opacity={clamp(sun * 1.25)}>
      <StreetModern t={t} id={`${id}d`} mode="day" power={0} car={car} />
    </g>
    {sun > 0.02 ? (
      <g opacity={Math.min(1, sun * 1.6)}>
        <Glow x={sunX} y={sunY} r={260 * (0.5 + sun)} kind="warm" o={0.8 * sun} />
        <circle cx={sunX} cy={sunY} r={70} fill="#FFF3C8" opacity={0.4 + 0.6 * sun} />
      </g>
    ) : null}
  </g>
);

/** The sky alone, looking up: a clear sky that darkens with `sun`, the Sun's disc fading in the middle of it. */
export const SkyUp: React.FC<{ t: number; sun: number; id?: string; moon?: number; stars?: number }> = ({ t, sun, id = 'sky', moon = 0, stars = 0 }) => (
  <g>
    <defs>
      <radialGradient id={`${id}g`} cx="50%" cy="40%" r="75%">
        <stop offset="0%" stopColor="#8AC4F0" />
        <stop offset="100%" stopColor="#3A78C0" />
      </radialGradient>
    </defs>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#04040C" />
    <Stars seed={21} x0={-300} y0={-300} w={2500} h={1700} t={t} n={160} o={stars} />
    <rect x={-400} y={-400} width={2800} height={1900} fill={`url(#${id}g)`} opacity={clamp(sun)} />
    <Glow x={960} y={430} r={420 * (0.4 + sun)} kind="warm" o={0.9 * sun} />
    <circle cx={960} cy={430} r={110} fill="#FFF6D8" opacity={clamp(sun * 1.3)} />
    {moon > 0 ? <g opacity={moon}><Moon x={1500} y={300} r={60} bloom={0.6} /></g> : null}
    {/* rooftops and a tree along the bottom edge, silhouetted */}
    <path d="M -400 1080 L -400 900 L 200 900 L 200 820 L 520 820 L 520 940 L 900 940 L 900 860 L 1300 860 L 1300 960 L 1700 960 L 1700 840 L 2400 840 L 2400 1500 L -400 1500 Z" fill="#0E0C18" />
    <circle cx={1500} cy={800} r={130} fill="#0E0C18" />
    <circle cx={1620} cy={760} r={110} fill="#0E0C18" />
  </g>
);

// ---------------------------------------------------------------- a beam you can watch crawl
/** A flashlight at (x, y) pointing right, its beam reaching `reach` px, a bright wave front where the light is now. */
export const Beam: React.FC<{ x: number; y: number; reach: number; t: number; s?: number; color?: string; front?: boolean }> = ({ x, y, reach, t, s = 1, color = '#FFF2B8', front = true }) => {
  const r = Math.max(0, reach);
  const spread = 0.22;
  return (
    <g>
      {r > 2 ? (
        <g style={{ mixBlendMode: 'screen' }}>
          <defs>
            <linearGradient id={`bm${Math.round(x)}${Math.round(y)}`} x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={color} stopOpacity={0.85} />
              <stop offset="100%" stopColor={color} stopOpacity={0.35} />
            </linearGradient>
          </defs>
          <path d={`M ${x + 60 * s} ${y - 18 * s} L ${x + 60 * s + r} ${y - 18 * s - r * spread} L ${x + 60 * s + r} ${y + 18 * s + r * spread} L ${x + 60 * s} ${y + 18 * s} Z`} fill={`url(#bm${Math.round(x)}${Math.round(y)})`} />
          {front ? (
            <g>
              <ellipse cx={x + 60 * s + r} cy={y} rx={14 + 4 * Math.sin(t / 3)} ry={18 * s + r * spread} fill={color} opacity={0.9} />
              <Glow x={x + 60 * s + r} y={y} r={90 + r * 0.15} kind="warm" o={0.7} />
            </g>
          ) : null}
        </g>
      ) : null}
      <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-110} y={-24} width={150} height={48} rx={12} fill="#2E3A5A" stroke="#100E16" strokeWidth={6} />
        <path d="M 40 -32 L 66 -40 L 66 40 L 40 32 Z" fill="#3A4A6A" stroke="#100E16" strokeWidth={6} />
        <ellipse cx={66} cy={0} rx={8} ry={40} fill="#FFF6D8" stroke="#100E16" strokeWidth={4} />
      </g>
    </g>
  );
};

/** Little packets of light (dots with a tail) travelling from (x0,y0) toward (x1,y1); p is how far along (0..1). */
export const LightDot: React.FC<{ x0: number; y0: number; x1: number; y1: number; p: number; r?: number; color?: string }> = ({ x0, y0, x1, y1, p, r = 12, color = '#FFD23A' }) => {
  if (p <= 0 || p >= 1) return null;
  const x = x0 + (x1 - x0) * p;
  const y = y0 + (y1 - y0) * p;
  const tx = x - (x1 - x0) * 0.06;
  const ty = y - (y1 - y0) * 0.06;
  return (
    <g>
      <line x1={tx} y1={ty} x2={x} y2={y} stroke={color} strokeWidth={r} strokeLinecap="round" opacity={0.35} />
      <circle cx={x} cy={y} r={r} fill={color} />
      <Glow x={x} y={y} r={r * 5} kind="warm" o={0.6} />
    </g>
  );
};

// ---------------------------------------------------------------- the Sun and the Earth, on the schematic
/**
 * The Sun at left, the Earth at right, on the schematic; light packets stream across. `speed` scales how fast they
 * move (1 normal); `stop` (0..1) is the fraction of the way past which new packets never make it (they slow and stall);
 * `cut` marks a red line "NEVER ARRIVES" from that frame.
 */
export const SunEarth: React.FC<{ t: number; speed: number; stall?: number; label?: string; earthDim?: number; cut?: number }> = ({ t, speed, stall = 0, label, earthDim = 0, cut }) => {
  const sx = 330, ex = 1600, y = 560;
  const n = 9;
  return (
    <g>
      <Schematic t={t} id="sune" />
      <Glow x={sx} y={y} r={300} kind="warm" o={0.9} />
      <circle cx={sx} cy={y} r={150} fill="#FFC94A" stroke="#FF8A3D" strokeWidth={8} />
      <text x={sx} y={y + 230} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={6} fill={SCH.line}>SUN</text>
      <circle cx={ex} cy={y} r={70} fill="#3A7AC8" stroke={SCH.line} strokeWidth={6} />
      <path d={`M ${ex - 40} ${y - 30} q 30 -10 40 20 q 20 20 -10 40 M ${ex + 10} ${y - 50} q 30 10 30 40`} stroke="#5AAA6A" strokeWidth={14} fill="none" strokeLinecap="round" />
      <circle cx={ex} cy={y} r={72} fill="#05050F" opacity={earthDim} />
      <text x={ex} y={y + 150} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={6} fill={SCH.line}>EARTH</text>
      {Array.from({ length: n }).map((_, i) => {
        // each packet's position: evenly spaced, moving at `speed`; stalled ones creep and fade
        const base = ((i / n + (t * 0.006 * speed)) % 1);
        const p = stall > 0 ? Math.min(base, stall * (1 - 0.02 * i)) : base;
        const x0 = sx + 160, x1 = ex - 80;
        return <LightDot key={i} x0={x0} y0={y} x1={x1} y1={y} p={Math.max(0.01, p)} r={12} />;
      })}
      {cut !== undefined && t > cut ? (
        <g opacity={clamp((t - cut) / 8)}>
          <line x1={sx + 160 + (ex - sx - 240) * stall} y1={y - 140} x2={sx + 160 + (ex - sx - 240) * stall} y2={y + 140} stroke="#FF3A3A" strokeWidth={8} strokeDasharray="20 14" />
          <text x={sx + 160 + (ex - sx - 240) * stall} y={y - 170} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} letterSpacing={4} fill="#FF5A5A">NEVER ARRIVES</text>
        </g>
      ) : null}
      {label ? <SchLabel x={960} y={200} t={t - 2} text={label} size={46} color={SCH.live} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- props
/** A thermometer, its red column at `p` (0..1), a label at the side. */
export const Thermo: React.FC<{ x: number; y: number; p: number; s?: number; label?: string }> = ({ x, y, p, s = 1, label }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-40} y={-360} width={80} height={400} rx={40} fill="#F6EFE3" stroke="#100E16" strokeWidth={8} />
    <circle cx={0} cy={70} r={70} fill="#E8252A" stroke="#100E16" strokeWidth={8} />
    <rect x={-18} y={40 - 380 * clamp(p)} width={36} height={380 * clamp(p) + 10} fill="#E8252A" />
    {[0, 1, 2, 3, 4, 5].map((k) => <line key={k} x1={40} x2={70} y1={-320 + k * 64} y2={-320 + k * 64} stroke="#F6EFE3" strokeWidth={5} />)}
    {label ? <text x={100} y={-320 + (1 - clamp(p)) * 340} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">{label}</text> : null}
  </g>
);

/** A city bus seen from the side, facing right; `door` 0..1 opens the doors, `lights` its headlights. */
export const Bus: React.FC<{ x: number; y: number; s?: number; door?: number; lights?: number; spin?: number; inside?: Look[] }> = ({ x, y, s = 1, door = 0, lights = 1, spin = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-300} width={840} height={260} rx={36} fill="#E8B83A" stroke="#100E16" strokeWidth={9} />
    <rect x={-420} y={-130} width={840} height={30} fill="#C8962A" />
    {[-360, -240, -120, 0, 120].map((wx, i) => <rect key={i} x={wx} y={-270} width={100} height={100} rx={12} fill="#2A3A5A" stroke="#100E16" strokeWidth={6} />)}
    {[-360, -240, -120, 0, 120].map((wx, i) => <rect key={`r${i}`} x={wx + 8} y={-262} width={30} height={84} fill="#4A6A9A" opacity={0.6} />)}
    {/* doors */}
    <rect x={250} y={-270} width={110} height={226} fill="#2A3A5A" stroke="#100E16" strokeWidth={6} />
    <rect x={250} y={-270} width={55 * (1 - door)} height={226} fill="#5A7AA0" stroke="#100E16" strokeWidth={4} />
    <rect x={360 - 55 * (1 - door)} y={-270} width={55 * (1 - door)} height={226} fill="#5A7AA0" stroke="#100E16" strokeWidth={4} />
    <rect x={380} y={-270} width={34} height={120} rx={10} fill="#2A3A5A" stroke="#100E16" strokeWidth={5} />
    {lights > 0 ? <Glow x={420} y={-80} r={120} kind="warm" o={0.8 * lights} /> : null}
    <circle cx={408} cy={-80} r={14} fill={lights > 0 ? '#FFF2B8' : '#5A5A6A'} stroke="#100E16" strokeWidth={4} />
    {[-280, 280].map((wx) => (
      <g key={wx} transform={`translate(${wx} -40) rotate(${spin})`}>
        <circle r={60} fill="#1E1C26" stroke="#100E16" strokeWidth={8} />
        <circle r={24} fill="#8A8A9A" />
        <line x1={-24} y1={0} x2={24} y2={0} stroke="#5A5A6A" strokeWidth={6} />
      </g>
    ))}
    <rect x={-300} y={-292} width={260} height={18} rx={6} fill="#100E16" />
    <text x={-170} y={-278} textAnchor="middle" fontFamily={FONT.ui} fontSize={14} fill="#FFD23A" letterSpacing={3}>SHELTER</text>
  </g>
);

/** A megaphone held at (x, y), pointing right. */
export const Megaphone: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 0 -18 L 90 -48 L 90 48 L 0 18 Z" fill="#F6EFE3" stroke="#100E16" strokeWidth={6} />
    <rect x={-30} y={-20} width={34} height={40} rx={6} fill="#E8252A" stroke="#100E16" strokeWidth={6} />
    <rect x={-20} y={16} width={16} height={40} rx={5} fill="#2A2834" stroke="#100E16" strokeWidth={5} />
  </g>
);

/** Sound waves (arcs) out of a point to the right, for a shout. */
export const ShoutLines: React.FC<{ x: number; y: number; t: number; dir?: 1 | -1; color?: string }> = ({ x, y, t, dir = 1, color = '#F6EFE3' }) => (
  <g>
    {[0, 1, 2].map((k) => {
      const ph = ((t / 10 + k / 3) % 1);
      const r = 40 + ph * 160;
      return <path key={k} d={`M ${x + dir * r * 0.5} ${y - r * 0.8} Q ${x + dir * r} ${y} ${x + dir * r * 0.5} ${y + r * 0.8}`} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round" opacity={1 - ph} />;
    })}
  </g>
);

// ---------------------------------------------------------------- the shelter: a subway tunnel, deep down
export const TUN = makeRoom({ x: 960, y: 470 }, { x0: 760, x1: 1160, y0: 330, y1: 610 }, 6);
export const tunHip = (scale = 1) => 900 - LEG_LEN * scale;
/** A subway platform turned shelter: an arched tunnel running away, work lamps strung along it, camp beds, people. */
export const Tunnel: React.FC<{ t: number; id?: string; lamps?: number; people?: boolean }> = ({ t, id = 'tun', lamps = 1, people = true }) => {
  const r = TUN;
  const { P, Q } = r;
  const lamp = (w: number) => P(0.5, 0.05, w);
  const ws = [0.05, 0.2, 0.38, 0.56, 0.74, 0.9];
  return (
    <g>
      <RoomShell r={r} id={id} floor="tiles" wall="#4A4E58" side="#3A3E48" floorC="#34363E" ceiling="#2A2C34" lines="#24262E" />
      {/* the arch ribs */}
      {[0.1, 0.3, 0.5, 0.7, 0.9].map((w, i) => {
        const a = P(0, 1, w), b = P(1, 1, w), c = P(0.5, -0.15, w);
        return <path key={i} d={`M ${a.x} ${a.y} L ${a.x} ${P(0, 0.25, w).y} Q ${c.x} ${c.y - (b.x - a.x) * 0.15} ${b.x} ${P(1, 0.25, w).y} L ${b.x} ${b.y}`} stroke="#2A2C34" strokeWidth={22 * r.s(w) / 3} fill="none" />;
      })}
      {/* the track bed, dropped, down the middle-left */}
      <polygon points={Q([[0.05, 1, 0], [0.4, 1, 0], [0.4, 1, 1], [0.05, 1, 1]])} fill="#22242A" />
      {[0.15, 0.3].map((u) => <polygon key={u} points={Q([[u, 1, 0], [u + 0.015, 1, 0], [u + 0.015, 1, 1], [u, 1, 1]])} fill="#6A6E78" />)}
      {/* the platform edge line */}
      <polygon points={Q([[0.4, 1, 0], [0.43, 1, 0], [0.43, 1, 1], [0.4, 1, 1]])} fill="#E8C84A" />
      {/* camp beds on the platform */}
      {ws.slice(1).map((w, i) => (
        <Box key={i} r={r} u={[0.55, 0.92]} v={[0.9, 0.96]} w={[w, w + 0.08]} front="#5A6A4A" top="#6E7E5A" side="#4A5A3A" />
      ))}
      {/* the cable and its work lamps */}
      <path d={ws.map((w, i) => `${i ? 'L' : 'M'} ${lamp(w).x} ${lamp(w).y}`).join(' ')} stroke="#14151A" strokeWidth={4} fill="none" />
      <LightVeil id={`${id}v`} lights={ws.map((w) => [lamp(w).x, lamp(w).y + 30, 380 * r.s(w) / 2] as [number, number, number])} o={0.55 + 0.35 * (1 - lamps)} />
      {ws.map((w, i) => (
        <g key={i}>
          <Glow x={lamp(w).x} y={lamp(w).y} r={120 * r.s(w) / 2} kind="warm" o={0.8 * lamps} />
          <circle cx={lamp(w).x} cy={lamp(w).y} r={8 * r.s(w) / 2} fill="#FFE7A8" opacity={lamps} />
        </g>
      ))}
      {people
        ? [0.3, 0.5, 0.7].map((w, i) => {
          const p = P(0.62 + 0.1 * (i % 2), 1, w);
          const sc = r.s(w) * 0.16;
          return <Hero key={i} look={i % 2 ? { ...silLook, jacket: '#4A4A5A' } : silLook} pose={{ ...basePose, x: p.x, y: p.y - LEG_LEN * sc, scale: sc, yaw: i % 2 ? -0.4 : 0.4, blink: 0 }} shadow={0.5} />;
        })
        : null}
    </g>
  );
};
const silLook: Look = { skin: '#2A2834', skinShade: '#24222C', hand: '#2A2834', jacket: '#3A3E4A', jacketShade: '#30343E', accent: '#3A3E4A', limb: '#2A2834', line: '#100E16', shoe: '#1A1820', face: '#8A8A9A', hair: '#1A1820' };

// ---------------------------------------------------------------- the shelter bathroom and its mirror
/**
 * A tiled bathroom, seen straight at the mirror over the sink. The mirror shows `reflect` (drawn by the caller, in a
 * mirrored group) dimmed and tinted; a single bulb above.
 */
export const MIRROR = { x0: 640, x1: 1280, y0: 170, y1: 640 };
export const Bathroom: React.FC<{ t: number; reflect?: React.ReactNode; flicker?: number }> = ({ t, reflect, flicker = 0 }) => {
  const m = MIRROR;
  const fl = flicker > 0 ? (rnd(7, Math.floor(t / 2)) > 0.7 ? 0.5 : 1) : 1;
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#3A4448" />
      {/* tiles */}
      {Array.from({ length: 30 }).map((_, i) => <line key={`v${i}`} x1={-300 + i * 90} y1={-400} x2={-300 + i * 90} y2={1500} stroke="#2E383C" strokeWidth={4} />)}
      {Array.from({ length: 22 }).map((_, i) => <line key={`h${i}`} x1={-400} y1={-300 + i * 90} x2={2400} y2={-300 + i * 90} stroke="#2E383C" strokeWidth={4} />)}
      {/* the mirror */}
      <rect x={m.x0 - 24} y={m.y0 - 24} width={m.x1 - m.x0 + 48} height={m.y1 - m.y0 + 48} rx={14} fill="#8A8E96" stroke="#100E16" strokeWidth={8} />
      <clipPath id="mirClip"><rect x={m.x0} y={m.y0} width={m.x1 - m.x0} height={m.y1 - m.y0} /></clipPath>
      <rect x={m.x0} y={m.y0} width={m.x1 - m.x0} height={m.y1 - m.y0} fill="#2A3238" />
      <g clipPath="url(#mirClip)">
        <rect x={m.x0} y={m.y0} width={m.x1 - m.x0} height={m.y1 - m.y0} fill="#3A4448" opacity={0.6} />
        {reflect}
        <rect x={m.x0} y={m.y0} width={m.x1 - m.x0} height={m.y1 - m.y0} fill="#9AB8C8" opacity={0.08} />
        <path d={`M ${m.x0 + 60} ${m.y0} L ${m.x0 + 160} ${m.y0} L ${m.x0 + 20} ${m.y1} L ${m.x0 - 80} ${m.y1} Z`} fill="#FFFFFF" opacity={0.06} />
      </g>
      {/* the sink */}
      <path d="M 700 760 L 1220 760 Q 1200 900 960 910 Q 720 900 700 760 Z" fill="#E8ECEE" stroke="#100E16" strokeWidth={8} />
      <rect x={940} y={700} width={40} height={70} rx={8} fill="#A8B0B8" stroke="#100E16" strokeWidth={6} />
      <rect x={-400} y={910} width={2800} height={600} fill="#2A3236" />
      {/* the bulb */}
      <line x1={960} y1={-400} x2={960} y2={60} stroke="#14151A" strokeWidth={5} />
      <Glow x={960} y={90} r={520} kind="warm" o={0.55 * fl} />
      <circle cx={960} cy={90} r={30} fill="#FFE7A8" opacity={fl} stroke="#100E16" strokeWidth={4} />
    </g>
  );
};

// ---------------------------------------------------------------- a lit hospital corridor (the power is fine here)
export const HOSPL = makeRoom({ x: 960, y: 500 }, { x0: 800, x1: 1120, y0: 380, y1: 620 }, 5.5);
export const HospitalLit: React.FC<{ t: number; id?: string }> = ({ t, id = 'hsl' }) => {
  const r = HOSPL;
  const { P, Q } = r;
  return (
    <g>
      <RoomShell r={r} id={id} floor="tiles" wall="#B8C8C8" side="#9AAEAE" floorC="#8A9A9C" ceiling="#D8E0E0" lines="#7A8A8C" />
      {[0.12, 0.32, 0.52, 0.72].map((w, i) => (
        <g key={i}>
          <polygon points={Q([[0, 0.3, w], [0, 0.3, w + 0.1], [0, 1, w + 0.1], [0, 1, w]])} fill="#5A8A9A" stroke="#100E16" strokeWidth={3} />
          <polygon points={Q([[1, 0.3, w], [1, 0.3, w + 0.1], [1, 1, w + 0.1], [1, 1, w]])} fill="#5A8A9A" stroke="#100E16" strokeWidth={3} />
          <polygon points={Q([[0.3, 0, w], [0.7, 0, w], [0.7, 0, w + 0.06], [0.3, 0, w + 0.06]])} fill="#FFFBEA" />
          <Glow x={P(0.5, 0, w + 0.03).x} y={P(0.5, 0, w + 0.03).y + 20} r={160 * r.s(w) / 2} kind="cool" o={0.4} />
        </g>
      ))}
      <rect x={920} y={400} width={80} height={30} fill="#1A6A3A" stroke="#100E16" strokeWidth={3} />
      <text x={960} y={422} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={20} fill="#BFF0C8">EXIT</text>
      <polygon points={Q([[0, 0.62, 0], [1, 0.62, 0], [1, 0.62, 1], [0, 0.62, 1]])} fill="none" />
      <Box r={r} u={[0.72, 0.95]} v={[0.82, 0.88]} w={[0.42, 0.58]} front="#E8EEF0" top="#F6FAFA" side="#C8D0D4" />
    </g>
  );
};
/** Where to stand someone in the corridor: u across (0 left wall, 1 right), w depth (0 near, 1 far). */
export const hospStand = (u: number, w: number) => {
  const p = HOSPL.P(u, 1, w);
  const scale = (0.6 * (HOSPL.back.y1 - HOSPL.back.y0) * HOSPL.s(w)) / 330;
  return { x: p.x, y: p.y - LEG_LEN * scale, scale };
};

// ---------------------------------------------------------------- a lab: the scientist and her machine
/** A dark lab: a long optics table, a laser line across it and a screen with a number that won't sit still. */
export const Lab: React.FC<{ t: number; id?: string; reading?: string; alarm?: number }> = ({ t, id = 'lab', reading = '299,792 km/s', alarm = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#141826" />
    {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-300 + i * 180} y={-400} width={4} height={1000} fill="#1C2234" />)}
    {/* the table */}
    <rect x={-200} y={720} width={2300} height={40} fill="#5A6070" stroke="#100E16" strokeWidth={6} />
    <rect x={-200} y={760} width={2300} height={600} fill="#2A2E3A" />
    {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={-160 + i * 80} cy={740} r={4} fill="#3A3E4A" />)}
    {/* laser, mirrors */}
    <rect x={120} y={640} width={160} height={80} rx={8} fill="#3A4A6A" stroke="#100E16" strokeWidth={6} />
    {[700, 1280].map((mx) => <rect key={mx} x={mx} y={600} width={24} height={120} fill="#A8B8C8" stroke="#100E16" strokeWidth={5} />)}
    <line x1={280} y1={660} x2={1280} y2={660} stroke="#FF3A3A" strokeWidth={6} opacity={0.9} />
    <Glow x={1280} y={660} r={60} kind="red" o={0.8} />
    {/* the screen */}
    <rect x={1420} y={300} width={460} height={300} rx={14} fill="#0A0E18" stroke="#100E16" strokeWidth={8} />
    <rect x={1420} y={600} width={40} height={120} fill="#3A3E4A" />
    <text x={1650} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} letterSpacing={3} fill="#7E8DA6">SPEED OF LIGHT</text>
    <text x={1650} y={480} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill={alarm > 0 && Math.floor(t / 6) % 2 ? '#FF5A5A' : '#7FF0A8'}>{reading}</text>
    {alarm > 0 ? <text x={1650} y={560} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FF5A5A" opacity={Math.floor(t / 6) % 2 ? 1 : 0.3}>ERROR?</text> : null}
    <Glow x={1650} y={450} r={300} kind="cool" o={0.35} />
  </g>
);

// ---------------------------------------------------------------- tiny helpers
export const gLine = (x0: number, y0: number, x1: number, y1: number, p: number) => ({ x: x0 + (x1 - x0) * p, y: y0 + (y1 - y0) * p });
export { STREETM };
export type { Pt, Pose };
