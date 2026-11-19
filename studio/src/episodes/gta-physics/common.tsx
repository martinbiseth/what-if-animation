import React from 'react';
import {
  Hero, Look, LOOKS, Pose, ShotProps, Word, basePose, camT, clamp, kf, backOut, easeOut, easeIn, faceAt, idleBlink, talkAt, Expr, FONT, Glow, rnd,
  UI, LEG_LEN, makeRoom, RoomShell, Box, BackWindow, Pendant, pendantLight, LightVeil, FloorShadow, WallClock, stand, pts, S3, DuskSky, Sun, Skyline, Haze,
  Schematic, SCH, SchLabel, DrawOn, CountUp, NightSky, Stars, Moon,
} from '../../engine';
import { YOU, ELLIE, MOM, MO, Soft, span, wordF, faceCU, bigWord, handAt } from '../electricity/common';
import { Car, Bike, IceCream, StreetModern, STREETM, streetHip, LivingRoom, LIVING, CityWindowView, sofaSit } from '../electricity/sets';
import { Body, lie } from '../gravity/common';

// Shared by every chapter of "What if GTA6 physics were real?": the health bar (over your head and in the HUD),
// tumbling and flying bodies, the new sets (gym, hallway with lockers, hospital room, backyard with the tree house,
// a city at night for the blackouts) and the props (van, ramp, skateboard, beanbag, tablet, TV).

export { YOU, ELLIE, MOM, MO, Soft, span, wordF, faceCU, bigWord, handAt, Body, lie, Car, Bike, IceCream, StreetModern, STREETM, streetHip, LivingRoom, LIVING, CityWindowView, sofaSit };
export const SUIT: Look = { ...LOOKS.suit26 };
export const NURSE: Look = { ...LOOKS.doctor, jacket: '#4E9AA0', jacketShade: '#3C7E84', accent: '#E9F2F0' };
export const COACH: Look = { ...LOOKS.worker, jacket: '#B2382E', jacketShade: '#8E2C24', accent: '#F6EFE3', hat: 'cap' } as Look;

export type SetFC = React.FC<{ t: number; id?: string }>;

// ---------------------------------------------------------------- the health bar
export const BAR = { g: '#5BE36A', y: '#FFD23A', r: '#FF4A3A', back: '#120E1E' };
export const barColor = (p: number) => (p > 0.5 ? BAR.g : p > 0.2 ? BAR.y : BAR.r);

/** A small health bar floating over a head: x y its centre, `p` 0..1 full, `hit` 0..1 a white flash after a loss. */
export const HeadBar: React.FC<{ x: number; y: number; s?: number; p: number; t?: number; hit?: number; o?: number }> = ({ x, y, s = 1, p, t = 0, hit = 0, o = 1 }) => {
  const w = 200;
  const blink = p < 0.2 && p > 0 ? 0.55 + 0.45 * Math.sin(t / 2) : 1;
  const bob = Math.sin(t / 12) * 4;
  return (
    <g transform={`translate(${x} ${y + bob}) scale(${s})`} opacity={o}>
      <rect x={-w / 2 - 8} y={-20} width={w + 16} height={40} rx={20} fill={BAR.back} stroke="#F6EFE3" strokeWidth={4} opacity={0.92} />
      <rect x={-w / 2} y={-12} width={Math.max(0, w * clamp(p))} height={24} rx={12} fill={barColor(p)} opacity={blink} />
      <rect x={-w / 2} y={-12} width={Math.max(0, w * clamp(p))} height={8} rx={4} fill="#FFFFFF" opacity={0.3} />
      {hit > 0 ? <rect x={-w / 2 - 8} y={-20} width={w + 16} height={40} rx={20} fill="#FFFFFF" opacity={hit * 0.8} /> : null}
      <Heart x={-w / 2 - 34} y={0} s={0.9} c={barColor(p)} />
    </g>
  );
};

export const Heart: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = BAR.r }) => (
  <path transform={`translate(${x} ${y}) scale(${s})`} d="M 0 14 C -30 -6 -24 -30 -8 -26 C -2 -24 0 -18 0 -16 C 0 -18 2 -24 8 -26 C 24 -30 30 -6 0 14 Z" fill={c} stroke="#120E1E" strokeWidth={4} />
);

/** Where the head bar goes for a standing pose (over the head). */
export const overHead = (pose: { x: number; y: number; scale: number }) => ({ x: pose.x, y: pose.y - 300 * pose.scale, s: pose.scale * 0.9 });

/**
 * The HUD in the top left: a heart and your health. keys [frame, p]: p -1 hides it; between keys it drains over 10
 * frames with a white flash. `respawn` [frame] marks where a RESPAWN chip pops.
 */
export const healthHud = (keys: [number, number][]): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
    let k = 0;
    keys.forEach((kk, i) => {
      if (f >= kk[0]) k = i;
    });
    const [f0, p1] = keys[k];
    const p0 = k > 0 ? keys[k - 1][1] : p1;
    if (p1 < 0) return null;
    const a = clamp((f - f0) / 10);
    const p = p0 < 0 ? p1 : p0 + (p1 - p0) * easeOut(a);
    const hit = k > 0 && p0 >= 0 && p1 < p0 ? clamp(1 - (f - f0) / 8) : 0;
    const appear = p0 < 0 ? backOut(clamp((f - f0) / 9)) : 1;
    const w = 420;
    const blink = p < 0.2 ? 0.5 + 0.5 * Math.sin(f / 2.5) : 1;
    return (
      <g transform={`translate(96 92) scale(${appear})`}>
        <rect x={-50} y={-40} width={w + 120} height={80} rx={40} fill={UI.pill} opacity={0.88} />
        <Heart x={-6} y={2} s={1.3} c={barColor(p)} />
        <rect x={40} y={-16} width={w} height={32} rx={16} fill={BAR.back} stroke="#F6EFE3" strokeWidth={3} />
        <rect x={42} y={-14} width={Math.max(0, (w - 4) * clamp(p))} height={28} rx={14} fill={barColor(p)} opacity={blink} />
        <rect x={42} y={-14} width={Math.max(0, (w - 4) * clamp(p))} height={9} rx={4} fill="#FFFFFF" opacity={0.3} />
        {hit > 0 ? <rect x={40} y={-16} width={w} height={32} rx={16} fill="#FFFFFF" opacity={hit} /> : null}
      </g>
    );
  };
  return Hud;
};

// ---------------------------------------------------------------- bodies in the air
/** A ragdoll in flight: limbs flung out and flapping, the whole body spinning by `spin` degrees. */
export const flying = (x: number, y: number, scale: number, spin: number, t: number, o: Partial<Pose> = {}): Pose => {
  const w = Math.sin(t / 2.2);
  return {
    ...basePose, x, y, scale, spin, yaw: 0.2,
    armL: { a: 120 + 30 * w, b: -30 }, armR: { a: 140 - 30 * w, b: -20 },
    legL: { a: 40 + 20 * w, b: -40 }, legR: { a: -30 - 20 * w, b: -30 },
    expr: 'shock', ...o,
  };
};

/** A superhero landing pose: knees deep, one hand on the ground, squashed by `k`. */
export const landed = (x: number, feetY: number, scale: number, k: number, o: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y: feetY - LEG_LEN * scale * (1 - 0.35 * k), scale, yaw: 0.3,
  squash: 0.12 * k, tilt: 10 * k,
  legL: { a: 50 * k, b: -90 * k }, legR: { a: -10 * k, b: -70 * k },
  armL: { a: 30 + 20 * k, b: -10 }, armR: { a: 20 + 50 * k, b: -20 },
  expr: 'cool', ...o,
});

/** A parabola from a to b over `dur` frames, peaking `h` above the higher end. Returns x, y and progress. */
export const arc = (t: number, a: [number, number], b: [number, number], h: number, dur: number) => {
  const p = clamp(t / dur);
  const x = a[0] + (b[0] - a[0]) * p;
  const top = Math.min(a[1], b[1]) - h;
  // quadratic through a, top (at p 0.5-ish), b
  const y = (1 - p) * (1 - p) * a[1] + 2 * (1 - p) * p * (2 * top - (a[1] + b[1]) / 2) + p * p * b[1];
  return { x, y, p };
};

/** Speed lines behind a moving thing. */
export const SpeedLines: React.FC<{ x: number; y: number; dir?: 1 | -1; t: number; n?: number; len?: number; o?: number }> = ({ x, y, dir = 1, t, n = 6, len = 220, o = 0.6 }) => (
  <g opacity={o}>
    {Array.from({ length: n }).map((_, i) => {
      const dy = (i - n / 2) * 26 + Math.sin(t + i) * 4;
      const l = len * (0.5 + rnd(i, 3) * 0.6);
      return <path key={i} d={`M ${x - dir * 40} ${y + dy} L ${x - dir * (40 + l)} ${y + dy}`} stroke="#F6EFE3" strokeWidth={5} strokeLinecap="round" opacity={0.5 + 0.5 * rnd(i, 7)} />;
    })}
  </g>
);

/** A comic impact word (BONK!, CRUNCH) popping and fading over `hold` frames. */
export const Pow: React.FC<{ x: number; y: number; t: number; text: string; color?: string; size?: number; hold?: number; rot?: number }> = ({ x, y, t, text, color = '#FFD23A', size = 90, hold = 18, rot = -8 }) => {
  if (t < 0 || t > hold) return null;
  const s = backOut(clamp(t / 5));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} opacity={1 - clamp((t - hold + 5) / 5)}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#0B0816" strokeWidth={size / 7} paintOrder="stroke">
        {text}
      </text>
    </g>
  );
};

/** A "−12" damage number rising off a head. */
export const Dmg: React.FC<{ x: number; y: number; t: number; text: string; color?: string }> = ({ x, y, t, text, color = BAR.r }) => {
  if (t < 0 || t > 26) return null;
  return (
    <text x={x} y={y - t * 3} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill={color} stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={1 - clamp((t - 18) / 8)}>
      {text}
    </text>
  );
};

// ---------------------------------------------------------------- props
/** A white delivery van, side on, facing right; x the middle, y the ground. */
export const Van: React.FC<{ x: number; y: number; s?: number; spin?: number; flip?: boolean }> = ({ x, y, s = 1, spin = 0, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={4} rx={280} ry={18} fill="#000" opacity={0.35} />
    <path d="M -270 -40 L -270 -290 Q -270 -300 -258 -300 L 120 -300 Q 150 -300 170 -270 L 240 -170 Q 276 -160 278 -120 L 280 -40 Z" fill="#E9E6DE" stroke="#16141C" strokeWidth={6} strokeLinejoin="round" />
    <path d="M 130 -280 L 150 -280 L 220 -176 L 130 -176 Z" fill="#1A2030" />
    <rect x={-250} y={-250} width={340} height={90} rx={10} fill="#F2B33D" />
    <text x={-80} y={-192} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#16141C">QUICKDROP</text>
    <path d="M 100 -290 L 100 -48" stroke="#16141C" strokeWidth={4} opacity={0.5} />
    <rect x={250} y={-140} width={22} height={20} rx={4} fill="#FFF4C8" />
    {[-170, 170].map((wx) => (
      <g key={wx} transform={`translate(${wx} -36) rotate(${spin})`}>
        <circle r={44} fill="#16141C" stroke="#0B0816" strokeWidth={5} />
        <circle r={20} fill="#8A8898" />
        <path d="M -18 0 L 18 0" stroke="#16141C" strokeWidth={4} />
      </g>
    ))}
  </g>
);

/** A wooden ramp, rising to the right; x0..x1 on the ground y, height h. */
export const Ramp: React.FC<{ x0: number; x1: number; y: number; h: number; color?: string }> = ({ x0, x1, y, h, color = '#9A7A5A' }) => (
  <g>
    <ellipse cx={(x0 + x1) / 2} cy={y + 6} rx={(x1 - x0) / 2 + 20} ry={14} fill="#000" opacity={0.3} />
    <path d={`M ${x0} ${y} Q ${x0 + (x1 - x0) * 0.7} ${y} ${x1} ${y - h} L ${x1} ${y} Z`} fill={color} stroke="#1A1410" strokeWidth={6} strokeLinejoin="round" />
    <path d={`M ${x1} ${y - h} L ${x1 + 40} ${y - h} L ${x1 + 40} ${y} L ${x1} ${y}`} fill="#6A5240" stroke="#1A1410" strokeWidth={6} />
    {[0.35, 0.6, 0.85].map((k, i) => (
      <path key={i} d={`M ${x0 + (x1 - x0) * k} ${y - 4} L ${x0 + (x1 - x0) * k} ${y - h * Math.pow(k, 2.2) + 6}`} stroke="#1A1410" strokeWidth={3} opacity={0.5} />
    ))}
  </g>
);

/** A skateboard side on; x the middle, y the ground. */
export const Skateboard: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -90 -26 Q -100 -40 -84 -34 L 84 -34 Q 100 -40 90 -26 Z" fill="#E8453A" stroke="#16141C" strokeWidth={5} />
    {[-56, 56].map((wx) => <circle key={wx} cx={wx} cy={-12} r={12} fill="#F2E6C8" stroke="#16141C" strokeWidth={4} />)}
  </g>
);

/** The giant beanbag, slumped; `squish` flattens it when something lands on it. */
export const Beanbag: React.FC<{ x: number; y: number; s?: number; squish?: number; color?: string }> = ({ x, y, s = 1, squish = 0, color = '#E8783A' }) => (
  <g transform={`translate(${x} ${y}) scale(${s * (1 + 0.25 * squish)} ${s * (1 - 0.35 * squish)})`}>
    <ellipse cx={0} cy={0} rx={190} ry={20} fill="#000" opacity={0.3} />
    <path d="M -180 0 Q -200 -120 -60 -150 Q 40 -170 140 -120 Q 210 -80 180 0 Z" fill={color} stroke="#1A1018" strokeWidth={6} />
    <path d="M -100 -120 Q -40 -90 30 -140" stroke="#1A1018" strokeWidth={4} fill="none" opacity={0.4} />
    <path d="M -140 -80 Q -150 -110 -110 -130" stroke="#FFFFFF" strokeWidth={8} fill="none" opacity={0.25} strokeLinecap="round" />
  </g>
);

/** A dented metal trash can. */
export const TrashCan: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -50 0 L -58 -130 L 58 -130 L 50 0 Z" fill="#7A8490" stroke="#16141C" strokeWidth={5} />
    <rect x={-66} y={-146} width={132} height={18} rx={8} fill="#8A94A0" stroke="#16141C" strokeWidth={5} />
    {[-30, 0, 30].map((dx) => <path key={dx} d={`M ${dx} -120 L ${dx * 0.9} -10`} stroke="#16141C" strokeWidth={3} opacity={0.4} />)}
  </g>
);

/** A basketball. */
export const Ball: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 40, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle r={r} fill="#E8743A" stroke="#1A1018" strokeWidth={5} />
    <path d={`M ${-r} 0 L ${r} 0 M 0 ${-r} L 0 ${r} M ${-r * 0.7} ${-r * 0.7} Q 0 0 ${-r * 0.7} ${r * 0.7} M ${r * 0.7} ${-r * 0.7} Q 0 0 ${r * 0.7} ${r * 0.7}`} stroke="#1A1018" strokeWidth={3.5} fill="none" />
  </g>
);

/** A tablet held up: a dark slab with whatever `children` draw in its 560 x 380 screen (origin at the screen's top left). */
export const Tablet: React.FC<{ x: number; y: number; s?: number; rot?: number; children?: React.ReactNode }> = ({ x, y, s = 1, rot = 0, children }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <Glow x={0} y={0} r={420} kind="cool" o={0.35} />
    <rect x={-310} y={-220} width={620} height={440} rx={34} fill="#16141C" stroke="#3A3848" strokeWidth={6} />
    <g transform="translate(-280 -190)">
      <rect width={560} height={380} rx={10} fill="#0E1A2A" />
      {children}
    </g>
  </g>
);

/** The city map on the suit's tablet: streets, a river, and red dots (hospitals) popping on at `dots` frames. */
export const CityMap: React.FC<{ t: number; dots: { x: number; y: number; at: number; label: string }[] }> = ({ t, dots }) => (
  <g>
    {Array.from({ length: 9 }).map((_, i) => <path key={`h${i}`} d={`M 0 ${20 + i * 44} L 560 ${30 + i * 40}`} stroke="#2A4058" strokeWidth={i % 3 ? 3 : 7} />)}
    {Array.from({ length: 12 }).map((_, i) => <path key={`v${i}`} d={`M ${20 + i * 48} 0 L ${10 + i * 50} 380`} stroke="#2A4058" strokeWidth={i % 4 ? 3 : 7} />)}
    <path d="M -10 260 Q 140 200 260 250 Q 380 300 570 220" stroke="#2E6A9A" strokeWidth={22} fill="none" />
    {dots.map((d, i) => {
      const k = t - d.at;
      if (k < 0) return null;
      const s = backOut(clamp(k / 6));
      return (
        <g key={i} transform={`translate(${d.x} ${d.y})`}>
          <circle r={14 + (k % 30)} fill="none" stroke="#FF4A3A" strokeWidth={3} opacity={1 - (k % 30) / 30} />
          <circle r={14 * s} fill="#FF4A3A" stroke="#FFFFFF" strokeWidth={3} />
          <text x={22} y={-14} fontFamily={FONT.ui} fontSize={22} fill="#F6EFE3" opacity={clamp(k / 6)}>{d.label}</text>
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------- sets
/** The school gym: a basketball hoop on the back wall, high windows, pale boards, a scoreboard. */
export const GYM = makeRoom({ x: 960, y: 480 }, { x0: 420, x1: 1500, y0: 200, y1: 730 }, 3.2);
export const Gym: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'gym', veil = 0.3 }) => {
  const R = GYM;
  const { P, Q } = R;
  return (
    <g>
      <RoomShell r={R} id={id} floor="boards" wall="#4E6A8A" side="#3E5878" floorC="#C08A52" lines="#7A5232" />
      {/* high windows */}
      {[0.12, 0.3, 0.62, 0.8].map((u, i) => (
        <polygon key={i} points={Q([[u, 0.06, 0], [u + 0.1, 0.06, 0], [u + 0.1, 0.2, 0], [u, 0.2, 0]])} fill="#BFE0F2" stroke="#24344A" strokeWidth={5} />
      ))}
      {/* the painted stripe and the court lines */}
      <polygon points={Q([[0, 0.62, 0], [1, 0.62, 0], [1, 0.66, 0], [0, 0.66, 0]])} fill="#E9B44A" />
      <polygon points={Q([[0.3, 1, 0], [0.7, 1, 0], [0.7, 1, 0.45], [0.3, 1, 0.45]])} fill="none" stroke="#F6EFE3" strokeWidth={5} opacity={0.8} />
      <path d={`M ${P(0, 1, 0.6).x} ${P(0, 1, 0.6).y} L ${P(1, 1, 0.6).x} ${P(1, 1, 0.6).y}`} stroke="#F6EFE3" strokeWidth={5} opacity={0.8} />
      {/* the hoop */}
      {(() => {
        const b = P(0.5, 0.3, 0.02);
        return (
          <g>
            <rect x={b.x - 110} y={b.y - 70} width={220} height={140} fill="#F6EFE3" stroke="#1A1620" strokeWidth={6} />
            <rect x={b.x - 40} y={b.y - 10} width={80} height={60} fill="none" stroke="#E8452A" strokeWidth={6} />
            <ellipse cx={b.x} cy={b.y + 64} rx={56} ry={12} fill="none" stroke="#E8452A" strokeWidth={8} />
            <path d={`M ${b.x - 52} ${b.y + 66} L ${b.x - 30} ${b.y + 130} L ${b.x + 30} ${b.y + 130} L ${b.x + 52} ${b.y + 66}`} fill="none" stroke="#F6EFE3" strokeWidth={3} opacity={0.8} />
          </g>
        );
      })()}
      {/* scoreboard */}
      {(() => {
        const s = P(0.84, 0.36, 0);
        return (
          <g>
            <rect x={s.x - 80} y={s.y - 50} width={160} height={90} rx={8} fill="#16141C" stroke="#3A3848" strokeWidth={4} />
            <text x={s.x - 38} y={s.y + 14} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#FF4A3A">12</text>
            <text x={s.x + 38} y={s.y + 14} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#FFD23A">09</text>
          </g>
        );
      })()}
      <Pendant r={R} u={0.3} w={0.35} t={t} v={0.08} />
      <Pendant r={R} u={0.7} w={0.35} t={t} v={0.08} />
      <LightVeil id={`${id}v`} lights={[pendantLight(R, 0.3, 0.35, 0.08), pendantLight(R, 0.7, 0.35, 0.08), [960, 300, 500]]} o={veil} />
    </g>
  );
};

/** The school hallway: a row of lockers along the back wall, a notice board, tiles. */
export const HALL = makeRoom({ x: 960, y: 500 }, { x0: 360, x1: 1560, y0: 260, y1: 740 }, 3.4);
export const Hallway: React.FC<{ t: number; id?: string; veil?: number }> = ({ t, id = 'hall', veil = 0.35 }) => {
  const R = HALL;
  const { Q } = R;
  const lockers: React.ReactNode[] = [];
  for (let i = 0; i < 16; i++) {
    const u0 = 0.02 + i * 0.06;
    const c = i === 9 ? '#E8783A' : i % 2 ? '#3E6E9A' : '#4A7AA6';
    lockers.push(
      <g key={i}>
        <polygon points={Q([[u0, 0.3, 0], [u0 + 0.057, 0.3, 0], [u0 + 0.057, 0.98, 0], [u0, 0.98, 0]])} fill={c} stroke="#16202E" strokeWidth={4} />
        {[0.36, 0.39, 0.42].map((v, k) => (
          <polygon key={k} points={Q([[u0 + 0.012, v, 0], [u0 + 0.045, v, 0], [u0 + 0.045, v + 0.008, 0], [u0 + 0.012, v + 0.008, 0]])} fill="#16202E" opacity={0.6} />
        ))}
        <polygon points={Q([[u0 + 0.042, 0.6, 0], [u0 + 0.05, 0.6, 0], [u0 + 0.05, 0.66, 0], [u0 + 0.042, 0.66, 0]])} fill="#C9CED8" />
      </g>,
    );
  }
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#C9C2A8" side="#B2AA90" floorC="#8A8A80" lines="#5A5A54" />
      {lockers}
      <polygon points={Q([[0.4, 0.08, 0], [0.6, 0.08, 0], [0.6, 0.24, 0], [0.4, 0.24, 0]])} fill="#A07A50" stroke="#4A3A2A" strokeWidth={5} />
      {[0, 1, 2, 3].map((i) => (
        <polygon key={i} points={Q([[0.42 + i * 0.045, 0.1 + (i % 2) * 0.02, 0], [0.455 + i * 0.045, 0.1 + (i % 2) * 0.02, 0], [0.455 + i * 0.045, 0.2, 0], [0.42 + i * 0.045, 0.2, 0]])} fill={['#F6EFE3', '#FFD23A', '#9FD4F0', '#F6B0A0'][i]} />
      ))}
      <WallClock x={R.P(0.18, 0.15, 0).x} y={R.P(0.18, 0.15, 0).y} r={34} t={t} />
      <Pendant r={R} u={0.3} w={0.4} t={t} v={0.05} />
      <Pendant r={R} u={0.7} w={0.4} t={t} v={0.05} />
      <LightVeil id={`${id}v`} lights={[pendantLight(R, 0.3, 0.4, 0.05), pendantLight(R, 0.7, 0.4, 0.05)]} o={veil} />
    </g>
  );
};

/** A hospital room: the bed on the right (head against the back wall), a monitor, a window, a curtain. `power` 0 is the
 *  blackout (dark, a red exit glow), `emergency` the generators' dim yellow light. */
export const WARD = makeRoom({ x: 960, y: 500 }, { x0: 460, x1: 1460, y0: 300, y1: 740 }, 3.4);
export const BED = { u: [0.45, 0.85] as [number, number], w: [0.0, 0.55] as [number, number], top: 0.72 };
export const HospitalRoom: React.FC<{ t: number; id?: string; power?: number; emergency?: number; night?: boolean; beat?: boolean }> = ({ t, id = 'ward', power = 1, emergency = 0, night = true, beat = true }) => {
  const R = WARD;
  const { P, Q } = R;
  const dark = 1 - power;
  const m = P(0.93, 0.45, 0.06);
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#9FC4BE" side="#86AAA4" floorC="#B8BCB4" lines="#7A807A" />
      <BackWindow r={R} id={`${id}w`} t={t} x0={540} x1={820} y0={360} y1={560} sun={{ x: 700, y: 520 }} cols={2} curtains={false} night={night} />
      {/* curtain rail and a pulled-back curtain on the left */}
      <path d={`M ${P(0.02, 0.04, 0.2).x} ${P(0.02, 0.04, 0.2).y} L ${P(0.98, 0.04, 0.2).x} ${P(0.98, 0.04, 0.2).y}`} stroke="#8A9094" strokeWidth={6} />
      <polygon points={Q([[0.02, 0.05, 0.2], [0.1, 0.05, 0.2], [0.11, 0.98, 0.2], [0.02, 0.98, 0.2]])} fill="#7AA6C4" opacity={0.92} />
      {/* the monitor on a stand */}
      <rect x={m.x - 70} y={m.y - 60} width={140} height={100} rx={8} fill="#16141C" stroke="#3A3848" strokeWidth={4} />
      {power > 0.5 || emergency > 0.5 ? (
        <path d={`M ${m.x - 60} ${m.y - 6} L ${m.x - 30} ${m.y - 6} L ${m.x - 20} ${m.y - 40 + (beat ? Math.abs(Math.sin(t / 8)) * 10 : 0)} L ${m.x - 8} ${m.y + 24} L ${m.x + 4} ${m.y - 6} L ${m.x + 60} ${m.y - 6}`} stroke="#5BE36A" strokeWidth={4} fill="none" />
      ) : null}
      <path d={`M ${m.x} ${m.y + 40} L ${m.x} ${P(0.93, 1, 0.06).y}`} stroke="#8A9094" strokeWidth={6} />
      {/* the bed */}
      <Box r={R} u={BED.u} v={[BED.top, 0.92]} w={BED.w} front="#D9DCE0" top="#F2F2EE" side="#B8BCC4" />
      <Box r={R} u={[BED.u[0] - 0.01, BED.u[1] + 0.01]} v={[0.42, 0.92]} w={[0, 0.03]} front="#8AA0B8" side="#6A8098" top="#9AB0C8" />
      <FloorShadow r={R} u={BED.u} w={BED.w} />
      {/* ceiling light */}
      <Pendant r={R} u={0.5} w={0.45} t={t} v={0.04} glow={0.55 * power} cone={0.28 * power} />
      <LightVeil id={`${id}v`} lights={power > 0.5 ? [pendantLight(R, 0.5, 0.45, 0.04), [680, 460, 220]] : [[680, 460, 200]]} o={0.3 + 0.55 * dark * (1 - emergency * 0.4)} />
      {dark > 0.5 ? <Glow x={P(0.05, 0.1, 0).x} y={P(0.05, 0.1, 0).y} r={160} kind="red" o={0.6} /> : null}
      {emergency > 0 ? <rect x={-400} y={-400} width={2800} height={1900} fill="#FFC060" opacity={0.08 * emergency} /> : null}
    </g>
  );
};
/** A point on the bed's mattress. */
export const bedTopW = (u: number, w: number) => { const p = WARD.P(u, BED.top, w); return { x: p.x, y: p.y + 50 }; };
/** Someone lying in the hospital bed, head on the pillow at the right end, under a sheet (draw `Sheet` after them). */
export const inBed = (scale = 0.8, o: Partial<Pose> = {}): Pose => {
  const h = bedTopW(0.56, 0.3);
  return lie(h.x, h.y - 6, scale, 1, { armL: { a: 10, b: -4 }, armR: { a: 14, b: -4 }, ...o });
};
/** Sitting up in the hospital bed (shock), hips on the mattress. */
export const sitBed = (scale = 0.8, o: Partial<Pose> = {}): Pose => {
  const h = bedTopW(0.6, 0.3);
  return { ...basePose, x: h.x, y: h.y - 30 * scale, scale, yaw: 0, legL: { a: 85, b: -5 }, legR: { a: 80, b: -5 }, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 }, ...o };
};
export const Pillow: React.FC = () => {
  const p = bedTopW(0.56, 0.3);
  return <ellipse cx={p.x + 165} cy={p.y + 2} rx={66} ry={24} fill="#FFFFFF" stroke="#9AB0C8" strokeWidth={4} />;
};
export const Sheet: React.FC = () => {
  const a = bedTopW(0.455, 0.3);
  const b = bedTopW(0.6, 0.3);
  return <path d={`M ${a.x - 10} ${a.y + 40} L ${a.x} ${a.y - 12} Q ${(a.x + b.x) / 2} ${a.y - 34} ${b.x} ${b.y - 22} L ${b.x + 14} ${b.y + 40} Z`} fill="#E9F0F4" stroke="#9AB0C8" strokeWidth={4} />;
};

/** The backyard, side on: the porch on the left, the lawn, the big tree with the tree house in the middle, a fence. */
export const YARD = { ground: 860, house: { x0: 860, x1: 1240, floor: 470, roof: 340 }, porch: 300 };
export const Backyard: React.FC<{ t: number; id?: string; crack?: number; dusk?: number }> = ({ t, id = 'yd', crack = 0, dusk = 0 }) => {
  const Y = YARD;
  const H = Y.house;
  const sway = Math.sin(t / 30) * 4;
  return (
    <g>
      <DuskSky id={`${id}sky`} horizonY={680} red={0.05 + dusk * 0.5} />
      <Sun x={1650} y={260 + 200 * dusk} r={80} t={t} rays={false} />
      <Skyline y={700} seed={11} color="#6E7A9A" h={120} />
      <Haze y={600} o={0.2} />
      {/* fence */}
      <rect x={-400} y={700} width={2800} height={160} fill="#9A7A5A" />
      {Array.from({ length: 40 }).map((_, i) => <path key={i} d={`M ${-400 + i * 70} 700 L ${-400 + i * 70} 860`} stroke="#6A5240" strokeWidth={4} />)}
      {/* lawn */}
      <rect x={-400} y={Y.ground - 20} width={2800} height={400} fill="#5E9A4A" />
      <rect x={-400} y={Y.ground - 20} width={2800} height={14} fill="#7AB85E" />
      {/* the porch and back door on the left */}
      <rect x={-400} y={360} width={700} height={500} fill="#C9B08A" stroke="#2A1E18" strokeWidth={6} />
      <rect x={60} y={560} width={150} height={300} fill="#6A4A3A" stroke="#2A1E18" strokeWidth={6} />
      <rect x={-220} y={500} width={200} height={170} fill="#F2E2B0" stroke="#2A1E18" strokeWidth={6} />
      <rect x={-400} y={Y.ground - 40} width={740} height={30} fill="#8A6A4A" stroke="#2A1E18" strokeWidth={5} />
      {/* the tree */}
      <path d={`M 1000 ${Y.ground} L 1030 380 L 1110 380 L 1140 ${Y.ground} Z`} fill="#6A4A32" stroke="#2A1A12" strokeWidth={6} />
      <g transform={`translate(${sway} 0)`}>
        {[[900, 260, 200], [1160, 240, 210], [1040, 150, 220], [800, 380, 140], [1300, 360, 150]].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? '#3E7A3A' : '#4A8A44'} stroke="#1E3A1A" strokeWidth={6} />
        ))}
      </g>
      {/* the tree house: a platform, a little house with a pitched roof (the board that cracks is on the right) */}
      <rect x={H.x0 - 40} y={H.floor} width={H.x1 - H.x0 + 80} height={26} fill="#8A6A4A" stroke="#2A1A12" strokeWidth={6} />
      <rect x={H.x0} y={H.roof + 20} width={H.x1 - H.x0} height={H.floor - H.roof - 20} fill="#B88A5A" stroke="#2A1A12" strokeWidth={6} />
      <rect x={H.x0 + 140} y={H.roof + 60} width={100} height={70} fill="#2A2030" stroke="#2A1A12" strokeWidth={5} />
      <path d={`M ${H.x0 - 30} ${H.roof + 24} L ${(H.x0 + H.x1) / 2} ${H.roof - 50} L ${H.x1 + 30} ${H.roof + 24} Z`} fill="#8A3A34" stroke="#2A1A12" strokeWidth={6} />
      {crack > 0 ? (
        <path d={`M ${H.x1 - 60} ${H.roof - 6} l 14 18 l -10 10 l 16 14`} stroke="#0B0816" strokeWidth={5} fill="none" opacity={clamp(crack * 2)} />
      ) : null}
      {/* ladder */}
      {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M 1150 ${H.floor + 40 + i * 62} L 1210 ${H.floor + 40 + i * 62}`} stroke="#6A4A32" strokeWidth={8} />)}
      <path d={`M 1150 ${H.floor + 20} L 1150 ${Y.ground} M 1210 ${H.floor + 20} L 1210 ${Y.ground}`} stroke="#6A4A32" strokeWidth={10} />
    </g>
  );
};
/** The roof's surface height at x (the pitched roof of the tree house). */
export const roofY = (x: number) => {
  const H = YARD.house;
  const mid = (H.x0 + H.x1) / 2;
  const half = (H.x1 - H.x0) / 2 + 30;
  return H.roof - 50 + (74 * Math.abs(x - mid)) / half;
};

/** The city at night from a hospital window or a hill: three depths of buildings, lit windows; `power` 0..1. */
export const CityNight: React.FC<{ t: number; id?: string; power?: number; sweep?: number; hospital?: boolean }> = ({ t, id = 'cn', power = 1, sweep, hospital = true }) => {
  const rows = [
    { y: 640, h: 300, seed: 3, c: '#232040', n: 22, w: 120 },
    { y: 760, h: 360, seed: 5, c: '#1A1830', n: 16, w: 160 },
    { y: 900, h: 420, seed: 9, c: '#121022', n: 11, w: 220 },
  ];
  const on = (x: number) => (sweep === undefined ? power : x < sweep * 2800 - 400 ? 0 : power);
  return (
    <g>
      <NightSky id={`${id}s`} horizonY={700} />
      <Stars seed={21} x0={-300} y0={-300} w={2500} h={900} t={t} n={power > 0.5 ? 40 : 220} o={power > 0.5 ? 0.4 : 1} />
      <Moon x={1600} y={180} r={40} bloom={0.6} />
      {rows.map((r, ri) => (
        <g key={ri}>
          {Array.from({ length: r.n }).map((_, i) => {
            const x = -300 + i * (2600 / r.n) + rnd(r.seed, i) * 40;
            const h = r.h * (0.5 + rnd(r.seed + 1, i) * 0.8);
            const w = r.w * (0.7 + rnd(r.seed + 2, i) * 0.4);
            const lit = on(x);
            const wins: React.ReactNode[] = [];
            for (let wy = r.y - h + 30; wy < r.y - 20; wy += 34) {
              for (let wx = x + 14; wx < x + w - 20; wx += 30) {
                if (rnd(Math.round(wx), Math.round(wy)) < 0.45) wins.push(<rect key={`${wx}-${wy}`} x={wx} y={wy} width={14} height={18} fill="#FFD98A" opacity={lit * (0.6 + 0.4 * rnd(Math.round(wy), Math.round(wx)))} />);
              }
            }
            return (
              <g key={i}>
                <rect x={x} y={r.y - h} width={w} height={h + 400} fill={r.c} />
                {wins}
              </g>
            );
          })}
        </g>
      ))}
      {hospital ? (
        <g>
          <rect x={820} y={420} width={260} height={700} fill="#2A2848" />
          <rect x={900} y={380} width={100} height={60} fill="#2A2848" />
          <path d="M 950 392 L 950 428 M 932 410 L 968 410" stroke={power > 0.5 ? '#FF4A3A' : '#4A2A3A'} strokeWidth={10} />
          {power > 0.5 ? <Glow x={950} y={410} r={80} kind="red" o={0.6} /> : null}
        </g>
      ) : null}
      {power > 0.5 ? <Haze y={560} o={0.18} /> : null}
    </g>
  );
};

/** A street-level garage with a flat roof (Mo's), for the jump; x0..x1 at the street's feet line, roof at `roof`. */
export const GARAGE = { x0: 620, x1: 1180, roof: 470 };
export const Garage: React.FC = () => {
  const G = GARAGE;
  const f = STREETM.feet;
  return (
    <g>
      <rect x={G.x0} y={G.roof} width={G.x1 - G.x0} height={f - G.roof} fill="#A8785A" stroke="#1E1612" strokeWidth={6} />
      <rect x={G.x0 - 20} y={G.roof - 24} width={G.x1 - G.x0 + 40} height={28} fill="#5A3A2E" stroke="#1E1612" strokeWidth={6} />
      <rect x={G.x0 + 60} y={G.roof + 90} width={G.x1 - G.x0 - 120} height={f - G.roof - 90} fill="#D9CDB4" stroke="#1E1612" strokeWidth={6} />
      {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${G.x0 + 60} ${G.roof + 140 + i * 45} L ${G.x1 - 60} ${G.roof + 140 + i * 45}`} stroke="#8A7E66" strokeWidth={4} />)}
    </g>
  );
};

/** A TV screen filling most of the frame with the evening news: a picture `children` and a red banner. */
export const NewsTV: React.FC<{ t: number; banner: string; ticker?: string; children?: React.ReactNode }> = ({ t, banner, ticker = 'POWER COMPANY: "A GRID GLITCH"  ·  THIRD BLACKOUT THIS WEEK  ·  ', children }) => (
  <g>
    <rect width={1920} height={1080} fill="#0C0A16" />
    <rect x={160} y={90} width={1600} height={900} rx={24} fill="#16141C" stroke="#2A2838" strokeWidth={10} />
    <svg x={190} y={120} width={1540} height={840} viewBox="0 0 1920 1080" overflow="hidden">
      {children}
      <rect x={0} y={800} width={1920} height={150} fill="#C8202A" />
      <rect x={0} y={800} width={300} height={150} fill="#F6EFE3" />
      <text x={150} y={898} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#C8202A">LIVE</text>
      <text x={340} y={900} fontFamily={FONT.title} fontWeight={800} fontSize={74} fill="#F6EFE3">{banner}</text>
      <rect x={0} y={950} width={1920} height={130} fill="#16141C" />
      <text x={1920 - ((t * 6) % 2400)} y={1030} fontFamily={FONT.ui} fontSize={46} fill="#F6EFE3">{ticker + ticker}</text>
    </svg>
  </g>
);

/** A rule card: "RULE 1" over a big line, on the schematic. */
export const ruleCard = (o: { n: string; text: string; sub?: string; icon?: (t: number) => React.ReactNode }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [Math.max(1, len), 1.05]]))}>
        <Schematic t={t} id="rule" />
      </g>
      <g transform={`translate(960 330) scale(${backOut(clamp((t - 2) / 8))})`}>
        <rect x={-150} y={-50} width={300} height={80} rx={40} fill={UI.pill} stroke={SCH.live} strokeWidth={4} />
        <text textAnchor="middle" y={8} fontFamily={FONT.ui} fontSize={40} fill={SCH.live} letterSpacing={6}>{o.n}</text>
      </g>
      <g transform={`translate(960 520) scale(${backOut(clamp((t - 6) / 9))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={o.text.length > 16 ? 96 : 120} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">{o.text}</text>
      </g>
      {o.sub ? <SchLabel x={960} y={640} t={t - 14} text={o.sub} size={40} color={SCH.dim} /> : null}
      {o.icon?.(t)}
    </g>
  );
  return Shot;
};

/** Black, with a small "RESPAWNING…" and a spinner: the moment between zero and the hospital. */
export const RespawnBlack: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#000" />
    <g opacity={clamp((t - 10) / 8)}>
      <text x={960} y={560} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={12} fill="#F6EFE3" opacity={0.7 + 0.3 * Math.sin(t / 4)}>
        RESPAWNING
      </text>
      {[0, 1, 2].map((i) => <circle key={i} cx={930 + i * 30} cy={620} r={8} fill="#F6EFE3" opacity={((Math.floor(t / 6) % 3) === i ? 1 : 0.3)} />)}
    </g>
  </g>
);

/** A phone held in landscape filming: whatever `children` draws fills its screen (in a 1920x1080 world, scaled). */
export const PhoneFrame: React.FC<{ t: number; children: React.ReactNode; rec?: boolean; label?: string }> = ({ t, children, rec = true, label }) => (
  <g>
    <rect width={1920} height={1080} fill="#0C0A16" />
    <rect x={120} y={120} width={1680} height={840} rx={80} fill="#16141C" stroke="#3A3848" strokeWidth={8} />
    <svg x={200} y={160} width={1520} height={760} viewBox="0 0 1920 960" overflow="hidden">
      {children}
      {rec ? (
        <g>
          <circle cx={70} cy={60} r={16} fill="#FF3030" opacity={Math.floor(t / 15) % 2 ? 1 : 0.3} />
          <text x={100} y={74} fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">REC</text>
        </g>
      ) : null}
      {label ? <text x={1880} y={74} textAnchor="end" fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">{label}</text> : null}
    </svg>
  </g>
);

export const at = (W: Word[]) => (a: string, n = 1) => wordF(W, a, n);
