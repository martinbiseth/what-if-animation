import React from 'react';
import { rnd, clamp } from './anim';
import { FONT } from './fonts';
import { Glow } from './light';
import { HEAD, Pose, toWorld, LEG_LEN } from './rig';

// The wanted kit ("What if you got a five-star wanted level in real life?"): a row of stars that floats over a head,
// police cars with light bars, a helicopter with a searchlight, barriers and cones, a dispatch map, a news screen,
// the thermal camera's view, and the street things the chapters hide behind. Our own designs: no game's HUD, logo or
// art, just a generic star rating.

const backOut = (x: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

export const WANT = { gold: '#FFD23A', goldDeep: '#7A5A08', empty: '#F6EFE3', red: '#FF3B3B', blue: '#2F7BFF', ink: '#14121C', navy: '#1E2A44' };

/** A five-point star of outer radius r, centred on 0,0. */
export const starPath = (r: number, inner = 0.45) => {
  let d = '';
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * inner : r;
    d += `${i ? 'L' : 'M'} ${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)} `;
  }
  return d + 'Z';
};

/**
 * Stars on the shot clock. A number, or [[frame, value], ...] held from each key. A value with .5 (1.5) means that many
 * stars, flashing (the "fading" state); a value with .25 (2.25) means that many, the last one just snapping on.
 */
export type StarK = number | [number, number][];
export const starsAt = (t: number, k: StarK): { n: number; flash: boolean; since: number } => {
  if (typeof k === 'number') return { n: Math.floor(k), flash: k % 1 > 0.4, since: 999 };
  let cur = k[0];
  for (const key of k) if (t >= key[0]) cur = key;
  return { n: Math.floor(cur[1]), flash: cur[1] % 1 > 0.4, since: t - cur[0] };
};

/**
 * The row of stars. (x, y) is its bottom centre. n filled of `max`; `flash` blinks the filled ones; `since` frames
 * since the last change pops the newest star; `pop` scales the whole row in.
 */
export const WantedStars: React.FC<{
  x: number; y: number; n: number; max?: number; s?: number; t?: number; flash?: boolean; since?: number; pop?: number; bob?: boolean; plate?: boolean; hot?: number;
}> = ({ x, y, n, max = 5, s = 1, t = 0, flash = false, since = 99, pop = 1, bob = true, plate = true, hot }) => {
  if (pop <= 0) return null;
  const r = 34;
  const gap = 82;
  const w = (max - 1) * gap + r * 2 + 36;
  const dy = bob ? Math.sin(t / 18) * 6 : 0;
  const blinkOn = !flash || Math.floor(t / 7) % 2 === 0;
  const glow = hot ?? clamp(n / max);
  return (
    <g transform={`translate(${x} ${y + dy}) scale(${s * backOut(clamp(pop))})`} opacity={clamp(pop * 3)}>
      {n > 0 ? <ellipse cx={0} cy={-r - 8} rx={w * 0.62} ry={r * 2.2} fill={WANT.gold} opacity={(0.1 + glow * 0.25) * (blinkOn ? 1 : 0.4)} filter="url(#blur16)" /> : null}
      {plate ? <rect x={-w / 2} y={-r * 2 - 18} width={w} height={r * 2 + 20} rx={r + 10} fill={WANT.ink} opacity={0.55} /> : null}
      {Array.from({ length: max }).map((_, i) => {
        const cx = -((max - 1) * gap) / 2 + i * gap;
        const on = i < n;
        const newest = on && i === n - 1 && since >= 0 && since < 12;
        const sc = newest ? backOut(clamp(since / 8)) * (1 + 0.5 * clamp(1 - since / 12)) : 1;
        return (
          <g key={i} transform={`translate(${cx} ${-r - 8}) scale(${sc})`}>
            {on ? (
              <g opacity={blinkOn ? 1 : 0.25}>
                <path d={starPath(r)} fill={WANT.gold} stroke={WANT.goldDeep} strokeWidth={5} strokeLinejoin="round" />
                <path d={starPath(r * 0.5)} fill="#FFF6C8" opacity={0.6} transform="translate(-4 -6)" />
              </g>
            ) : (
              <path d={starPath(r)} fill="none" stroke={WANT.empty} strokeOpacity={0.75} strokeWidth={5} strokeLinejoin="round" />
            )}
            {newest ? <circle r={r * 1.6 * clamp(since / 10)} fill="none" stroke="#FFF6C8" strokeWidth={6} opacity={1 - clamp(since / 12)} /> : null}
          </g>
        );
      })}
    </g>
  );
};

/** Where the stars hang over someone: a little above the head, in world space. */
export const starsOverHead = (pose: Pose, lift = 46) => toWorld(pose, { x: pose.yaw * 8, y: HEAD.y - HEAD.r - lift });

/** Stars over a posed character, scaled with them. */
export const StarsOver: React.FC<{ pose: Pose; k: StarK; t: number; pop?: number; s?: number; lift?: number; max?: number; plate?: boolean }> = ({
  pose, k, t, pop = 1, s = 0.55, lift, max, plate,
}) => {
  const p = starsOverHead(pose, lift);
  const st = starsAt(t, k);
  return <WantedStars x={p.x} y={p.y} n={st.n} flash={st.flash} since={st.since} s={s * pose.scale} pop={pop} t={t + pose.x / 7} max={max} plate={plate} />;
};

// ---------------------------------------------------------------- lights
/** The light bar's state at time t: 1 = red phase, 0 = blue phase (a quick double flash each side). */
export const sirenPhase = (t: number, seed = 0) => Math.floor((t + seed) / 6) % 2;

/** A full-frame red/blue wash from lights off screen. `k` 0..1 strength. */
export const SirenWash: React.FC<{ t: number; k?: number; seed?: number }> = ({ t, k = 1, seed = 0 }) => {
  if (k <= 0) return null;
  const red = sirenPhase(t, seed) === 1;
  return (
    <g style={{ mixBlendMode: 'screen' } as React.CSSProperties}>
      <rect x={-400} y={-400} width={2800} height={1900} fill={red ? WANT.red : WANT.blue} opacity={0.16 * k} />
      <ellipse cx={red ? 0 : 1920} cy={500} rx={900} ry={700} fill={red ? WANT.red : WANT.blue} opacity={0.22 * k} filter="url(#blur16)" />
    </g>
  );
};

const LightBar: React.FC<{ x: number; y: number; w: number; t: number; on: number; seed?: number }> = ({ x, y, w, t, on, seed = 0 }) => {
  const red = sirenPhase(t, seed) === 1;
  return (
    <g>
      <rect x={x - w / 2} y={y - 18} width={w} height={22} rx={8} fill="#1A1C24" />
      <rect x={x - w / 2 + 4} y={y - 15} width={w / 2 - 6} height={16} rx={6} fill={on && red ? '#FF5050' : '#7A2020'} />
      <rect x={x + 2} y={y - 15} width={w / 2 - 6} height={16} rx={6} fill={on && !red ? '#5A9AFF' : '#1E3A7A'} />
      {on ? <circle cx={red ? x - w / 4 : x + w / 4} cy={y - 8} r={60 + 20 * on} fill={red ? WANT.red : WANT.blue} opacity={0.35 * on} filter="url(#blur16)" /> : null}
    </g>
  );
};

/** A police patrol car, side view: white doors, dark bonnet and boot, a blue stripe, POLICE, a light bar. (x, y) is
 *  the ground under its middle. `lights` 0..1. `flip` faces it left. */
export const PoliceCar: React.FC<{ x: number; y: number; s?: number; t?: number; flip?: boolean; lights?: number; seed?: number; dim?: number }> = ({
  x, y, s = 1, t = 0, flip = false, lights = 1, seed = 0, dim = 0,
}) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={8} rx={260} ry={18} fill="#000" opacity={0.32} />
    <path d="M -250 -20 L -250 -92 Q -240 -112 -196 -118 L -124 -122 L -64 -192 Q -44 -206 -4 -206 L 112 -206 Q 152 -202 178 -172 L 218 -122 Q 250 -112 254 -82 L 254 -20 Z" fill="#F4F2EC" stroke="#0E0F14" strokeWidth={6} strokeLinejoin="round" />
    <path d="M -250 -20 L -250 -92 Q -240 -112 -196 -118 L -150 -120 L -150 -20 Z" fill="#1A1C26" />
    <path d="M 196 -122 L 218 -122 Q 250 -112 254 -82 L 254 -20 L 196 -20 Z" fill="#1A1C26" />
    <path d="M -104 -126 L -52 -186 L 44 -186 L 44 -126 Z" fill="#9ABAD8" stroke="#0E0F14" strokeWidth={4} />
    <path d="M 56 -126 L 56 -186 L 108 -186 Q 140 -182 160 -160 L 186 -126 Z" fill="#9ABAD8" stroke="#0E0F14" strokeWidth={4} />
    <rect x={-150} y={-84} width={346} height={20} fill="#1E4FA8" />
    <text x={22} y={-36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#1A1C26" transform={flip ? 'translate(44 0) scale(-1 1)' : undefined}>POLICE</text>
    <path d="M 50 -126 V -24" stroke="#0E0F14" strokeWidth={4} />
    <path d="M -46 -126 V -24" stroke="#0E0F14" strokeWidth={3} opacity={0.5} />
    <rect x={236} y={-74} width={20} height={16} rx={4} fill="#FFE9A0" />
    <rect x={-254} y={-78} width={14} height={18} rx={4} fill="#D83A3A" />
    {[-150, 156].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-18} r={46} fill="#14151C" stroke="#0E0F14" strokeWidth={6} />
        <circle cx={wx} cy={-18} r={20} fill="#9A9AA6" />
      </g>
    ))}
    <LightBar x={-8} y={-208} w={150} t={t} on={lights} seed={seed} />
    {dim ? <rect x={-270} y={-230} width={540} height={250} fill="#0A0A26" opacity={dim} /> : null}
  </g>
);

/** The same car seen from the front: for roadblocks and head-on shots. (x, y) the ground under it. */
export const PoliceCarFront: React.FC<{ x: number; y: number; s?: number; t?: number; lights?: number; seed?: number; beams?: number }> = ({ x, y, s = 1, t = 0, lights = 1, seed = 0, beams = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={230} ry={18} fill="#000" opacity={0.35} />
    {beams ? <path d="M -150 -70 L -420 220 L 120 220 L 150 -70 Z" fill="#FFF3C8" opacity={0.08 * beams} filter="url(#blur16)" /> : null}
    <path d="M -200 -20 L -206 -110 Q -200 -130 -170 -136 L -136 -206 Q -126 -222 -100 -222 L 100 -222 Q 126 -222 136 -206 L 170 -136 Q 200 -130 206 -110 L 200 -20 Z" fill="#F4F2EC" stroke="#0E0F14" strokeWidth={6} strokeLinejoin="round" />
    <path d="M -122 -140 L -96 -200 L 96 -200 L 122 -140 Z" fill="#9ABAD8" stroke="#0E0F14" strokeWidth={4} />
    <rect x={-196} y={-108} width={392} height={70} rx={10} fill="#1A1C26" />
    <rect x={-80} y={-96} width={160} height={44} rx={6} fill="#2A2C36" />
    {[-1, 1].map((k) => (
      <g key={k}>
        <rect x={k * 150 - 34} y={-100} width={68} height={30} rx={8} fill="#FFF3C8" />
        {beams ? <circle cx={k * 150} cy={-85} r={50} fill="#FFF3C8" opacity={0.4 * beams} filter="url(#blur16)" /> : null}
        <rect x={k * 170 - 26} y={-30} width={52} height={36} rx={6} fill="#14151C" />
      </g>
    ))}
    <text x={0} y={-150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#1A1C26" opacity={0}>.</text>
    <LightBar x={0} y={-224} w={220} t={t} on={lights} seed={seed} />
  </g>
);

/** The police helicopter, side view. (x, y) its middle. `beam`: a searchlight from under the nose, angle in degrees
 *  from straight down (+ toward the nose), its length, its spread. */
export const Helicopter: React.FC<{ x: number; y: number; s?: number; t?: number; flip?: boolean; beam?: { a: number; len: number; w?: number; o?: number }; tilt?: number; night?: boolean }> = ({
  x, y, s = 1, t = 0, flip = false, beam, tilt = 6, night = true,
}) => {
  const blade = Math.sin(t * 2.3);
  const body = night ? '#1E2A44' : '#2A3A5E';
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {beam ? (
        <g transform={`translate(150 70) rotate(${-beam.a})`}>
          <defs>
            <linearGradient id={`heliBeam${Math.round(x)}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#FFF6D0" stopOpacity={0.85 * (beam.o ?? 1)} />
              <stop offset="1" stopColor="#FFF6D0" stopOpacity={0.12 * (beam.o ?? 1)} />
            </linearGradient>
          </defs>
          <path d={`M -10 0 L 10 0 L ${(beam.w ?? 300) / 2} ${beam.len} L ${-(beam.w ?? 300) / 2} ${beam.len} Z`} fill={`url(#heliBeam${Math.round(x)})`} />
          <ellipse cx={0} cy={beam.len} rx={(beam.w ?? 300) / 2} ry={(beam.w ?? 300) / 7} fill="#FFF6D0" opacity={0.45 * (beam.o ?? 1)} filter="url(#blur16)" />
        </g>
      ) : null}
      <g transform={`rotate(${tilt})`}>
        {/* tail boom and fin */}
        <path d="M -60 -10 L -420 -30 L -420 -6 L -60 30 Z" fill={body} stroke="#0B0E18" strokeWidth={5} />
        <path d="M -400 -30 L -440 -110 L -410 -110 L -380 -28 Z" fill={body} stroke="#0B0E18" strokeWidth={5} />
        <ellipse cx={-420} cy={-30} rx={10 + 40 * Math.abs(Math.sin(t * 3))} ry={46} fill="#9AA6C0" opacity={0.35} />
        {/* the cabin */}
        <path d="M -120 40 Q -140 -40 -60 -70 L 80 -74 Q 170 -70 200 0 Q 210 60 150 70 L -80 70 Q -114 68 -120 40 Z" fill={body} stroke="#0B0E18" strokeWidth={6} />
        <path d="M 70 -60 Q 160 -56 186 6 L 186 30 L 60 30 Z" fill="#7FA4D0" stroke="#0B0E18" strokeWidth={4} />
        <path d="M -40 -50 L 40 -54 L 40 20 L -40 20 Z" fill="#7FA4D0" stroke="#0B0E18" strokeWidth={4} opacity={0.9} />
        <rect x={-110} y={-6} width={160} height={14} fill="#F4F2EC" />
        <text x={-10} y={56} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#F4F2EC" transform={flip ? 'translate(-20 0) scale(-1 1)' : undefined}>POLICE</text>
        {/* skids */}
        <path d="M -90 70 L -100 104 M 110 70 L 120 104 M -150 104 H 190 Q 210 104 214 92" stroke="#0B0E18" strokeWidth={8} fill="none" strokeLinecap="round" />
        {/* the searchlight */}
        <circle cx={150} cy={72} r={14} fill={beam ? '#FFF6D0' : '#3A4458'} stroke="#0B0E18" strokeWidth={4} />
        {/* blinking beacon */}
        {Math.floor(t / 10) % 2 ? <circle cx={-10} cy={-84} r={10} fill="#FF4040" /> : null}
        {/* rotor mast and the blurred blades */}
        <rect x={-12} y={-100} width={24} height={30} fill="#0B0E18" />
        <ellipse cx={0} cy={-104} rx={330} ry={14} fill="#9AA6C0" opacity={0.28} />
        <path d={`M ${-330 * blade} -104 L ${330 * blade} -104`} stroke="#0B0E18" strokeWidth={8} strokeLinecap="round" opacity={0.85} />
      </g>
    </g>
  );
};

/** A striped barrier on legs (a sawhorse), side on. (x, y) the ground under its middle. */
export const Barrier: React.FC<{ x: number; y: number; s?: number; w?: number; light?: number; t?: number }> = ({ x, y, s = 1, w = 300, light = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={w * 0.55} ry={10} fill="#000" opacity={0.28} />
    {[-1, 1].map((k) => (
      <path key={k} d={`M ${k * (w / 2 - 30)} -110 L ${k * (w / 2 - 50)} 0 M ${k * (w / 2 - 30)} -110 L ${k * (w / 2 - 6)} 0`} stroke="#2A2C34" strokeWidth={10} strokeLinecap="round" />
    ))}
    <clipPath id={`bar${Math.round(x)}`}>
      <rect x={-w / 2} y={-140} width={w} height={46} rx={6} />
    </clipPath>
    <rect x={-w / 2} y={-140} width={w} height={46} rx={6} fill="#F4F2EC" stroke="#14151C" strokeWidth={5} />
    <g clipPath={`url(#bar${Math.round(x)})`}>
      {Array.from({ length: Math.ceil(w / 40) + 2 }).map((_, i) => (
        <path key={i} d={`M ${-w / 2 + i * 60 - 40} -94 L ${-w / 2 + i * 60} -140 L ${-w / 2 + i * 60 + 30} -140 L ${-w / 2 + i * 60 - 10} -94 Z`} fill="#E8402A" />
      ))}
    </g>
    <rect x={-w / 2} y={-140} width={w} height={46} rx={6} fill="none" stroke="#14151C" strokeWidth={5} />
    {light ? <circle cx={w / 2 - 24} cy={-152} r={12} fill={Math.floor(t / 9) % 2 ? '#FFB020' : '#7A5010'} /> : null}
  </g>
);

/** A traffic cone. (x, y) its base. */
export const TrafficCone: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={2} rx={60} ry={10} fill="#000" opacity={0.25} />
    <rect x={-56} y={-14} width={112} height={16} rx={4} fill="#E8602A" stroke="#14151C" strokeWidth={4} />
    <path d="M -38 -14 L -10 -120 L 10 -120 L 38 -14 Z" fill="#F07A2A" stroke="#14151C" strokeWidth={5} strokeLinejoin="round" />
    <path d="M -28 -52 L -20 -82 L 20 -82 L 28 -52 Z" fill="#F4F2EC" />
  </g>
);

/** A bicycle, side on, red frame. (x, y) the ground under its middle. */
export const Bicycle: React.FC<{ x: number; y: number; s?: number; t?: number; roll?: number; color?: string; flip?: boolean }> = ({ x, y, s = 1, t = 0, roll = 0, color = '#1E4FA8', flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`} fill="none" stroke="#26232F" strokeWidth={10} strokeLinecap="round">
    {[-95, 95].map((cx) => (
      <g key={cx}>
        <circle cx={cx} cy={-62} r={60} />
        <g transform={`translate(${cx} -62) rotate(${roll * t * 8})`} strokeWidth={3} opacity={0.6}>
          <path d="M -56 0 H 56 M 0 -56 V 56 M -40 -40 L 40 40 M -40 40 L 40 -40" />
        </g>
      </g>
    ))}
    <path d="M -95 -62 L -35 -150 L 60 -150 L 95 -62 M -35 -150 L 0 -62 L 60 -150 M -50 -172 H -14 M 60 -150 L 48 -190 H 84" stroke={color} strokeWidth={12} />
    <rect x={70} y={-170} width={40} height={24} rx={4} fill="#F4F2EC" stroke="#26232F" strokeWidth={4} />
  </g>
);

/** A bus shelter: a glass box with a roof and an advert. (x, y) the ground at its middle. */
export const BusShelter: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={260} ry={14} fill="#000" opacity={0.25} />
    <rect x={-240} y={-420} width={480} height={26} rx={6} fill="#2A3A5E" />
    {[-230, 222].map((px) => <rect key={px} x={px} y={-396} width={10} height={396} fill="#3A3E4A" />)}
    <rect x={-220} y={-380} width={440} height={340} fill="#BCD4E8" opacity={0.45} stroke="#E8EEF4" strokeWidth={4} />
    <rect x={-200} y={-360} width={170} height={260} fill="#E8A83A" stroke="#2A2420" strokeWidth={4} />
    <text x={-115} y={-260} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#2A2420">ICE</text>
    <text x={-115} y={-216} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#2A2420">CREAM</text>
    <rect x={-160} y={-120} width={320} height={16} fill="#5A5E6A" />
    <rect x={-150} y={-104} width={10} height={104} fill="#3A3E4A" />
    <rect x={140} y={-104} width={10} height={104} fill="#3A3E4A" />
    <circle cx={160} cy={-470} r={34} fill="#F4F2EC" stroke="#2A3A5E" strokeWidth={6} />
    <text x={160} y={-458} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#2A3A5E">B</text>
    <rect x={155} y={-436} width={10} height={20} fill="#3A3E4A" />
  </g>
);

/** A small sign on a post. (x, y) the ground. */
export const PostSign: React.FC<{ x: number; y: number; s?: number; lines: string[]; color?: string; ink?: string; rot?: number }> = ({ x, y, s = 1, lines, color = '#F4F2EC', ink = '#C83A3A', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-6} y={-220} width={12} height={220} fill="#4A4038" />
    <rect x={-120} y={-300} width={240} height={50 + lines.length * 46} rx={8} fill={color} stroke={ink} strokeWidth={8} />
    {lines.map((l, i) => (
      <text key={i} x={0} y={-250 + i * 46} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill={ink}>{l}</text>
    ))}
  </g>
);

/** A big green dumpster. (x, y) the ground. */
export const Dumpster: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = '#3A6A4A' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={230} ry={14} fill="#000" opacity={0.3} />
    <path d="M -210 -250 L 210 -250 L 190 -20 L -190 -20 Z" fill={color} stroke="#14151C" strokeWidth={6} strokeLinejoin="round" />
    <path d="M -224 -262 L 224 -262 L 214 -236 L -214 -236 Z" fill="#2A4A36" stroke="#14151C" strokeWidth={5} />
    {[-120, 0, 120].map((k) => <path key={k} d={`M ${k} -226 V -40`} stroke="#000" strokeOpacity={0.18} strokeWidth={10} />)}
    <circle cx={-150} cy={-12} r={16} fill="#14151C" />
    <circle cx={150} cy={-12} r={16} fill="#14151C" />
  </g>
);

/** A subway ticket gate, front-ish: a waist-high box with a paddle. (x, y) the ground. */
export const TicketGate: React.FC<{ x: number; y: number; s?: number; open?: number; red?: boolean }> = ({ x, y, s = 1, open = 0, red = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={120} ry={10} fill="#000" opacity={0.25} />
    <rect x={-60} y={-260} width={120} height={260} rx={10} fill="#8A929E" stroke="#14151C" strokeWidth={5} />
    <rect x={-50} y={-250} width={100} height={30} rx={6} fill="#2A2C36" />
    <rect x={-30} y={-244} width={60} height={18} rx={4} fill={red ? '#FF4A4A' : '#4BE38A'} />
    <path d={`M 60 -170 L ${60 + 110 * Math.cos(open * 1.5)} ${-170 - 110 * Math.sin(open * 1.5) * 0.3}`} stroke="#C8CCD6" strokeWidth={22} strokeLinecap="round" />
    <path d={`M 60 -170 L ${60 + 110 * Math.cos(open * 1.5)} ${-170 - 110 * Math.sin(open * 1.5) * 0.3}`} stroke="#E8402A" strokeWidth={8} strokeLinecap="round" />
  </g>
);

/** A front-loading washing machine. (x, y) the ground. `spin` turns the drum. */
export const Washer: React.FC<{ x: number; y: number; s?: number; t?: number; spin?: number; tint?: string }> = ({ x, y, s = 1, t = 0, spin = 1, tint = '#4AA8E0' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-120} y={-270} width={240} height={270} rx={14} fill="#F4F2EC" stroke="#14151C" strokeWidth={5} />
    <rect x={-120} y={-270} width={240} height={50} rx={12} fill="#DAD6CC" stroke="#14151C" strokeWidth={5} />
    <circle cx={70} cy={-245} r={12} fill="#5A5E6A" />
    <circle cx={0} cy={-115} r={84} fill="#8A929E" stroke="#14151C" strokeWidth={6} />
    <circle cx={0} cy={-115} r={66} fill="#1E2A44" />
    <g transform={`translate(0 -115) rotate(${t * 12 * spin})`}>
      <path d="M -50 10 Q 0 50 50 10 Q 30 -40 -10 -40 Q -50 -30 -50 10 Z" fill={tint} opacity={0.85} />
      <circle cx={-20} cy={-20} r={14} fill="#F2C14E" opacity={0.8} />
    </g>
    <path d="M -40 -160 Q -10 -175 20 -168" stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={8} fill="none" />
  </g>
);

/** A police badge (the detective's). (x, y) its middle. */
export const Badge: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-90} y={-120} width={180} height={240} rx={16} fill="#2A2420" />
    <path d={starPath(70, 0.55)} fill="#E8C060" stroke="#7A5A08" strokeWidth={6} />
    <circle r={26} fill="#C8A040" stroke="#7A5A08" strokeWidth={4} />
    <text x={0} y={92} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#E8C060">DETECTIVE</text>
  </g>
);

/** A manila folder, open or shut. `paper` draws content on the right page. */
export const Folder: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number; paper?: React.ReactNode }> = ({ x, y, s = 1, rot = 0, open = 0, paper }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-200} y={-140} width={400} height={280} rx={10} fill="#C8A060" stroke="#6A5020" strokeWidth={5} />
    {open > 0 ? (
      <g>
        <rect x={-190} y={-130} width={380} height={260} fill="#F8F4E6" />
        <path d="M 0 -130 V 130" stroke="#C8BFA8" strokeWidth={3} />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-170} y={-100 + i * 36} width={130 + rnd(5, i) * 20} height={10} rx={4} fill="#B8B0A0" />)}
        {paper}
      </g>
    ) : (
      <g>
        <path d="M -200 -140 L -200 -166 L -60 -166 L -40 -140 Z" fill="#C8A060" stroke="#6A5020" strokeWidth={5} />
        <rect x={-120} y={-40} width={240} height={50} fill="#F8F4E6" />
        <text x={0} y={-4} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#C83A3A">CASE 37</text>
      </g>
    )}
  </g>
);

/** A skateboard. (x, y) under its middle. */
export const Skateboard: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -110 -26 Q -130 -26 -134 -40 L 134 -40 Q 130 -26 110 -26 Z" fill="#E8402A" stroke="#14151C" strokeWidth={5} />
    <circle cx={-70} cy={-12} r={14} fill="#F2C14E" stroke="#14151C" strokeWidth={4} />
    <circle cx={70} cy={-12} r={14} fill="#F2C14E" stroke="#14151C" strokeWidth={4} />
  </g>
);

/** A chocolate bar in a bright wrapper. */
export const ChocBar: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-80} y={-28} width={160} height={56} rx={6} fill="#7A3A9A" stroke="#14151C" strokeWidth={4} />
    <path d="M -80 -28 L -96 -20 L -96 20 L -80 28 M 80 -28 L 96 -20 L 96 20 L 80 28" fill="#C8C2D8" stroke="#14151C" strokeWidth={3} />
    <text x={0} y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#FFD23A">CHOCO</text>
  </g>
);

/** A crumpled candy wrapper. */
export const Wrapper: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -30 -10 L -14 -22 L 4 -14 L 26 -24 L 34 -4 L 22 10 L 30 22 L 6 18 L -12 26 L -26 12 Z" fill="#E8402A" stroke="#14151C" strokeWidth={4} strokeLinejoin="round" />
    <path d="M -10 -6 L 12 4" stroke="#FFD23A" strokeWidth={6} />
  </g>
);

/** A library book with an overdue stamp. */
export const LibraryBook: React.FC<{ x: number; y: number; s?: number; rot?: number; stamp?: number }> = ({ x, y, s = 1, rot = 0, stamp = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-160} width={240} height={320} rx={8} fill="#2E6A8A" stroke="#14151C" strokeWidth={6} />
    <rect x={-120} y={-160} width={30} height={320} fill="#245670" />
    <rect x={-60} y={-110} width={150} height={60} fill="#F4F2EC" />
    <text x={15} y={-70} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#2E6A8A">SPACE</text>
    {stamp > 0 ? (
      <g transform={`translate(10 60) rotate(-14) scale(${backOut(clamp(stamp))})`}>
        <rect x={-100} y={-34} width={200} height={68} rx={8} fill="none" stroke="#E8402A" strokeWidth={8} />
        <text x={0} y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#E8402A">3 DAYS LATE</text>
      </g>
    ) : null}
  </g>
);

/** Mo's notebook, open, with lines of handwriting that appear one by one (`lines` with the frame each lands). */
export const Notebook: React.FC<{ x: number; y: number; s?: number; rot?: number; t?: number; lines: { at: number; text: string; hot?: boolean }[]; title?: string }> = ({ x, y, s = 1, rot = 0, t = 0, lines, title }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-430} y={-280} width={860} height={560} rx={16} fill="#2A2420" />
    <rect x={-412} y={-264} width={410} height={530} fill="#F8F4E6" />
    <rect x={2} y={-264} width={410} height={530} fill="#FBF8EE" />
    {Array.from({ length: 12 }).map((_, i) => (
      <g key={i}>
        <path d={`M -400 ${-210 + i * 42} H -14`} stroke="#B8D0E8" strokeWidth={2} />
        <path d={`M 14 ${-210 + i * 42} H 400`} stroke="#B8D0E8" strokeWidth={2} />
      </g>
    ))}
    {title ? <text x={-206} y={-222} textAnchor="middle" fontFamily="Kalam, cursive" fontWeight={700} fontSize={40} fill="#C83A3A">{title}</text> : null}
    {lines.map((l, i) => {
      const k = clamp((t - l.at) / 10);
      if (k <= 0) return null;
      const col = i < 6 ? -390 : 26;
      const row = i < 6 ? i : i - 6;
      return (
        <text key={i} x={col} y={-174 + row * 84} fontFamily="Kalam, cursive" fontWeight={700} fontSize={l.hot ? 40 : 34} fill={l.hot ? '#C83A3A' : '#26232F'} opacity={k}>
          {l.text}
        </text>
      );
    })}
  </g>
);

// ---------------------------------------------------------------- screens
/** The dispatch map: a street grid seen from above, police cars (blue dots) closing on a pulsing red dot. `close`
 *  0..1 is how far they've come; `n` cars. `label` sits over the dot. */
export const DispatchMap: React.FC<{ t: number; close?: number; n?: number; dot?: { x: number; y: number }; label?: string; heli?: number; seed?: number }> = ({
  t, close = 0.5, n = 8, dot = { x: 1000, y: 560 }, label, heli = 0, seed = 4,
}) => {
  const pulse = (t % 30) / 30;
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0E1626" />
      {Array.from({ length: 26 }).map((_, i) => (
        <g key={i} stroke="#24324A" strokeWidth={i % 4 === 0 ? 22 : 9}>
          <path d={`M ${-300 + i * 110} -300 V 1400`} />
          <path d={`M -300 ${-300 + i * 90} H 2300`} />
        </g>
      ))}
      <path d="M -300 900 Q 500 760 1100 980 T 2300 860" stroke="#1E3A5E" strokeWidth={70} fill="none" />
      {Array.from({ length: 30 }).map((_, i) => (
        <rect key={`b${i}`} x={-280 + rnd(seed, i) * 2400} y={-280 + rnd(seed + 1, i) * 1500} width={60 + rnd(seed + 2, i) * 60} height={40 + rnd(seed + 3, i) * 40} fill="#1A2438" />
      ))}
      {Array.from({ length: n }).map((_, i) => {
        const a = (i / n) * Math.PI * 2 + rnd(seed, i * 3);
        const r0 = 700 + rnd(seed + 5, i) * 300;
        const r = r0 * (1 - 0.82 * clamp(close + Math.sin(t / 20 + i) * 0.01));
        const cx = dot.x + Math.cos(a) * r;
        const cy = dot.y + Math.sin(a) * r * 0.75;
        const on = sirenPhase(t, i * 3) === 1;
        return (
          <g key={i}>
            <path d={`M ${dot.x + Math.cos(a) * r0} ${dot.y + Math.sin(a) * r0 * 0.75} L ${cx} ${cy}`} stroke="#2F7BFF" strokeOpacity={0.25} strokeWidth={6} strokeDasharray="12 12" />
            <circle cx={cx} cy={cy} r={20} fill={on ? '#5A9AFF' : '#2F5ACF'} stroke="#DDE8FF" strokeWidth={4} />
          </g>
        );
      })}
      {heli > 0 ? (
        <g transform={`translate(${dot.x + 220 * (1 - heli)} ${dot.y - 180 * (1 - heli)})`}>
          <circle r={130} fill="none" stroke="#FFD23A" strokeWidth={4} strokeDasharray="10 10" opacity={0.7} />
          <text y={-150} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FFD23A">AIR 1</text>
        </g>
      ) : null}
      <circle cx={dot.x} cy={dot.y} r={30 + pulse * 120} fill="none" stroke="#FF3B3B" strokeWidth={8} opacity={1 - pulse} />
      <circle cx={dot.x} cy={dot.y} r={26} fill="#FF3B3B" stroke="#FFFFFF" strokeWidth={6} />
      {label ? (
        <g transform={`translate(${dot.x} ${dot.y - 70})`}>
          <rect x={-label.length * 13 - 20} y={-44} width={label.length * 26 + 40} height={56} rx={10} fill="#14121C" stroke="#FF3B3B" strokeWidth={4} />
          <text y={-6} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3">{label}</text>
        </g>
      ) : null}
    </g>
  );
};

/** A news broadcast filling a screen of w x h at (x, y) (top-left): a red BREAKING bar, a headline, and either the
 *  dispatch map or a face silhouette with stars. */
export const NewsScreen: React.FC<{ x: number; y: number; w: number; h: number; t: number; headline: string; kind?: 'map' | 'face' | 'heli'; stars?: number; id?: string }> = ({
  x, y, w, h, t, headline, kind = 'map', stars = 4, id = 'news',
}) => (
  <g transform={`translate(${x} ${y})`}>
    <clipPath id={`${id}clip`}>
      <rect x={0} y={0} width={w} height={h} />
    </clipPath>
    <g clipPath={`url(#${id}clip)`}>
      <g transform={`scale(${w / 1920} ${h / 1080})`}>
        {kind === 'map' ? <DispatchMap t={t} close={0.55} dot={{ x: 1100, y: 480 }} /> : null}
        {kind === 'face' ? (
          <g>
            <rect width={1920} height={1080} fill="#1E2A44" />
            <circle cx={960} cy={420} r={190} fill="#26232F" />
            <path d="M 700 900 Q 700 640 960 640 Q 1220 640 1220 900 Z" fill="#F07A2A" />
            <text x={960} y={440} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={200} fill="#F6EFE3" opacity={0.7}>?</text>
            <WantedStars x={960} y={200} n={stars} s={1.6} t={t} />
          </g>
        ) : null}
        {kind === 'heli' ? (
          <g>
            <rect width={1920} height={1080} fill="#0B1020" />
            <Helicopter x={900} y={420} s={1.4} t={t} beam={{ a: 10, len: 700, w: 420 }} />
          </g>
        ) : null}
        <rect x={0} y={820} width={1920} height={260} fill="#F4F2EC" />
        <rect x={0} y={820} width={420} height={110} fill="#D8262A" />
        <text x={210} y={896} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFFFFF">BREAKING</text>
        <text x={470} y={898} fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#14121C">{headline}</text>
        <rect x={0} y={960} width={1920} height={120} fill="#14121C" />
        <text x={1960 - ((t * 6) % 3200)} y={1036} fontFamily={FONT.ui} fontSize={48} fill="#F6EFE3">POLICE ASK RESIDENTS TO STAY INDOORS  •  ROADS CLOSED ON ALL BRIDGES  •  HELICOPTER OVER THE NORTH SIDE</text>
        <circle cx={1820} cy={70} r={16} fill="#FF3B3B" opacity={Math.floor(t / 15) % 2 ? 1 : 0.3} />
        <text x={1790} y={84} textAnchor="end" fontFamily={FONT.ui} fontSize={40} fill="#FFFFFF">LIVE</text>
      </g>
    </g>
  </g>
);

/** The thermal camera's look over whatever it wraps: everything goes cold grey-blue. Draw the hot figure after it
 *  with `HOT` (a look that glows). Wrap in <ThermalView>; add the crosshair HUD with ThermalHud. */
export const ThermalView: React.FC<{ children: React.ReactNode; id?: string }> = ({ children, id = 'thermal' }) => (
  <g>
    <defs>
      <filter id={id} filterUnits="userSpaceOnUse" x={-400} y={-400} width={2800} height={1900}>
        <feColorMatrix type="matrix" values="0.3 0.4 0.1 0 0  0.3 0.4 0.1 0 0  0.3 0.4 0.1 0 0  0 0 0 1 0" />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.02 0.08 0.2 0.32" />
          <feFuncG type="table" tableValues="0.03 0.12 0.26 0.4" />
          <feFuncB type="table" tableValues="0.1 0.26 0.42 0.55" />
        </feComponentTransfer>
      </filter>
    </defs>
    <g filter={`url(#${id})`}>{children}</g>
  </g>
);

/** A person as heat: white-hot core, yellow, orange edges. */
export const HOT = { skin: '#FFFFFF', skinShade: '#FFF2B0', hand: '#FFF6C0', jacket: '#FFD23A', jacketShade: '#FF9A2A', accent: '#FFF6C0', limb: '#FFB02A', line: '#FF6A1A', shoe: '#E8501A', face: '#FF6A1A', hair: '#FFF2B0' } as const;

/** The thermal camera's overlay: crosshair, corner brackets, readouts. `lock` 0..1 draws the box closing on (x, y). */
export const ThermalHud: React.FC<{ t: number; x?: number; y?: number; lock?: number; label?: string }> = ({ t, x = 960, y = 540, lock = 0, label = 'THERMAL' }) => {
  const b = 260 - 120 * clamp(lock);
  return (
    <g fill="none" stroke="#E8F0FF" strokeWidth={4} fontFamily={FONT.ui}>
      <path d="M 960 470 V 520 M 960 560 V 610 M 890 540 H 940 M 980 540 H 1030" />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sy], i) => (
        <path key={i} d={`M ${120 * -sx + (sx > 0 ? 1920 : 0) - sx * 0} ${sy < 0 ? 120 : 960} h ${sx * -80} M ${sx > 0 ? 1800 : 120} ${sy < 0 ? 120 : 960} v ${sy * -80}`} />
      ))}
      {lock > 0 ? (
        <g stroke="#FFD23A">
          <rect x={x - b / 2} y={y - b * 0.9} width={b} height={b * 1.8} strokeWidth={6} opacity={0.5 + 0.5 * Math.abs(Math.sin(t / 4))} />
          <text x={x + b / 2 + 20} y={y - b * 0.9 + 30} fill="#FFD23A" stroke="none" fontSize={34}>LOCK</text>
        </g>
      ) : null}
      <text x={150} y={110} fill="#E8F0FF" stroke="none" fontSize={34}>{label}  WH</text>
      <text x={1770} y={110} textAnchor="end" fill="#E8F0FF" stroke="none" fontSize={34}>ALT 800 FT</text>
      <text x={150} y={1000} fill="#E8F0FF" stroke="none" fontSize={30}>ZOOM 12X</text>
      <text x={1770} y={1000} textAnchor="end" fill="#E8F0FF" stroke="none" fontSize={30}>{`00:${String(14 + Math.floor(t / 30)).padStart(2, '0')}:${String(Math.floor(t) % 30).padStart(2, '0')}`}</text>
    </g>
  );
};

/** Hip height for a standing figure on a floor at `feet`. */
export const hipOn = (feet: number, scale = 1) => feet - LEG_LEN * scale;
