import React from 'react';
import {
  Hero, Look, LOOKS, Pose, ShotProps, Word, Expr, basePose, camT, clamp, kf, backOut, easeOut, easeInOut, faceAt, idleBlink, talkAt, FONT, Glow, rnd, UI,
  LEG_LEN, HEAD, Stars, Bokeh, Foreground,
} from '../../engine';
import { YOU, MO, Soft, span, wordF, faceCU, bigWord, handAt } from '../electricity/common';
import { Body, shk } from '../gravity/common';
import { Big, PopWord, standAt, runPose, sitPose, GROUND, hipAt, PhoneFrame } from '../gta-24-hours/common';

// Shared by every chapter of "What if you woke up in the year 3000?": the cast (you from 2026, Mo Seven, Vee the
// museum robot, the woman from the Archive, your sister), the future city and its rooms (the pod room, the museum,
// the glass room, the records room, the old city, the vault), the props (sleep pod, glass case, water cube, sky cars,
// the blue ear light) and the shot builders. All of it is our own design.

export { YOU, MO, Soft, span, wordF, faceCU, bigWord, handAt, Body, shk, Big, PopWord, standAt, runPose, sitPose, GROUND, hipAt, PhoneFrame };
export { Stars, Bokeh, Foreground, LEG_LEN };

export type SetFC = React.FC<{ t: number; id?: string }>;

// ---------------------------------------------------------------- the cast
/** Mo Seven: Mo's face a thousand years on, in a teal jacket of the year 3000. */
export const MO7: Look = { ...MO, jacket: '#2FB8B0', jacketShade: '#23918B', accent: '#E8F4F2', limb: '#2A3A48', shoe: '#E8F4F2' };
/** The woman from the Archive: a silver suit. */
export const ARCH: Look = { ...LOOKS.mom26, jacket: '#C8CED6', jacketShade: '#A6AEB8', accent: '#6A7280', limb: '#8A929E', shoe: '#2A2E36', hair: '#E8E4DC', extra: 'bob' };
/** Your sister in 2071: an old woman, white hair, a teal cardigan. */
export const SIS_OLD: Look = { ...LOOKS.mom26, jacket: '#3E8C86', jacketShade: '#2F6E69', accent: '#F28C6A', hair: '#E6E2DA', extra: 'bob' };
/** Your sister as a kid (the trampoline photo). */
export const SIS = LOOKS.ellie;
/** People of the year 3000. */
export const F1: Look = { ...LOOKS.worker, jacket: '#8A5AD0', jacketShade: '#6E46AA', accent: '#E8F4F2', limb: '#3A3060', hat: undefined, shoe: '#E8F4F2' };
export const F2: Look = { ...LOOKS.lady, jacket: '#E86A9A', jacketShade: '#C4547E', accent: '#FFF', limb: '#5A3050', hat: undefined, hair: '#17131C' };
export const F3: Look = { ...LOOKS.worker, jacket: '#F2C84A', jacketShade: '#D0A830', accent: '#2A2A2A', limb: '#3A3446', hat: undefined };
export const KID: Look = { ...LOOKS.ellie, jacket: '#6AC8F0', jacketShade: '#4AA6D0', accent: '#FFFFFF' };
export const KID2: Look = { ...LOOKS.you, jacket: '#5AD08A', jacketShade: '#40AE6E', extra: undefined, limb: '#2A4A3A' };
export const CLERK: Look = { ...LOOKS.worker, jacket: '#F6F2EA', jacketShade: '#D8D2C6', accent: '#2FB8B0', hat: undefined };
export const CROWD = [F1, F2, F3, KID, KID2, CLERK];

/** Where the head is in world space. */
export const headAt = (p: Pose) => ({ x: p.x + (HEAD.x + p.yaw * 10) * p.scale, y: p.y + HEAD.y * p.scale });
/** The blue light behind the ear that everyone in the year 3000 has (you don't). */
export const EarLight: React.FC<{ pose: Pose; t: number; o?: number }> = ({ pose, t, o = 1 }) => {
  const h = headAt(pose);
  const side = pose.yaw >= 0 ? -1 : 1;
  const x = h.x + side * HEAD.r * 1.0 * pose.scale * (1 - 0.2 * Math.abs(pose.yaw));
  const y = h.y + 22 * pose.scale;
  const pulse = 0.75 + 0.25 * Math.sin(t / 6);
  return (
    <g opacity={o}>
      <circle cx={x} cy={y} r={26 * pose.scale} fill="#4AD8FF" opacity={0.25 * pulse} />
      <circle cx={x} cy={y} r={9 * pose.scale} fill="#8AF0FF" stroke="#0B0816" strokeWidth={2.5 * pose.scale} />
    </g>
  );
};
/** A cast member plus the ear light. */
export const Citizen: React.FC<{ look: Look; pose: Pose; t: number; faces?: [number, Expr][]; seed?: number; words?: Word[]; f?: number; talk?: [number, number][]; shadow?: number; light?: boolean }> = ({ light = true, ...p }) => (
  <g>
    <Body {...p} />
    {light ? <EarLight pose={p.pose} t={p.t} /> : null}
  </g>
);

// ---------------------------------------------------------------- Vee, the museum robot
/** Vee: a floating white ball with one wide visor and a cyan eye; `mood` changes the eye. */
export const Vee: React.FC<{ x: number; y: number; s?: number; t: number; mood?: 'open' | 'happy' | 'sad' | 'scan' | 'alarm'; look?: number; talk?: number; blink?: number }> = ({
  x, y, s = 1, t, mood = 'open', look = 0, talk = 0, blink = 0,
}) => {
  const by = y + Math.sin(t / 11) * 8;
  const bl = Math.max(blink, idleBlink(t, 9));
  const eyeC = mood === 'alarm' ? '#FF5A4A' : '#4AE8FF';
  const ex = look * 26;
  return (
    <g transform={`translate(${x} ${by}) scale(${s})`}>
      <ellipse cx={0} cy={150 - Math.sin(t / 11) * 8} rx={50} ry={12} fill="#000" opacity={0.18} />
      <circle cx={0} cy={0} r={90} fill={eyeC} opacity={0.12} />
      <path d="M -10 -70 L -6 -104 M 6 -104" stroke="#0B0816" strokeWidth={6} strokeLinecap="round" />
      <circle cx={-6} cy={-108} r={9} fill={eyeC} stroke="#0B0816" strokeWidth={4} />
      <circle cx={0} cy={0} r={70} fill="#F2F6F8" stroke="#0B0816" strokeWidth={7} />
      <path d="M 40 -52 A 70 70 0 0 1 64 22" stroke="#C8D4DC" strokeWidth={12} fill="none" strokeLinecap="round" />
      <rect x={-52} y={-30} width={104} height={54} rx={27} fill="#14202C" stroke="#0B0816" strokeWidth={5} />
      {mood === 'happy' ? (
        <path d={`M ${ex - 22} 4 Q ${ex} -18 ${ex + 22} 4`} stroke={eyeC} strokeWidth={9} fill="none" strokeLinecap="round" />
      ) : mood === 'sad' ? (
        <g><ellipse cx={ex} cy={4} rx={18} ry={7} fill={eyeC} /><path d={`M ${ex - 26} -10 L ${ex + 22} -2`} stroke="#14202C" strokeWidth={10} /></g>
      ) : (
        <ellipse cx={ex} cy={-3} rx={mood === 'scan' ? 34 : 18} ry={Math.max(2, 16 * (1 - bl))} fill={eyeC} />
      )}
      {talk > 0 ? <rect x={-18} y={34} width={36} height={4 + talk * 10} rx={4} fill={eyeC} opacity={0.9} /> : <rect x={-12} y={36} width={24} height={4} rx={2} fill="#9AA8B4" />}
      {mood === 'scan' ? <rect x={-200} y={60 + ((t * 6) % 160)} width={400} height={6} fill={eyeC} opacity={0.45} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- props
/** The sleep pod, side view: a white base with a glass lid that slides up (`open` 0..1), frost, a status screen. */
export const SleepPod: React.FC<{ x: number; y: number; s?: number; t: number; open?: number; frost?: number; screen?: string; screen2?: string; glow?: number; inside?: React.ReactNode; dark?: boolean }> = ({
  x, y, s = 1, t, open = 0, frost = 0, screen, screen2, glow = 0.6, inside, dark = false,
}) => {
  const lift = open * 120;
  const body = dark ? '#5A6470' : '#EEF2F4';
  const shade = dark ? '#3E4650' : '#C8D2DA';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <ellipse cx={0} cy={12} rx={330} ry={22} fill="#000" opacity={0.2} />
      <rect x={-300} y={-90} width={600} height={90} rx={40} fill={body} stroke="#0B0816" strokeWidth={7} />
      <rect x={-300} y={-30} width={600} height={30} rx={14} fill={shade} />
      <rect x={-250} y={-72} width={360} height={14} rx={7} fill="#4AE8FF" opacity={0.4 + 0.3 * Math.sin(t / 9) * glow} />
      <rect x={-300} y={-106} width={600} height={24} rx={12} fill={shade} stroke="#0B0816" strokeWidth={5} />
      {inside}
      {open < 0.95 ? <g transform={`translate(${open * 380} ${-lift}) rotate(${open * 10} 290 -100)`}>
        <path d="M -290 -100 Q -280 -250 0 -260 Q 280 -250 290 -100 Z" fill="#BFEFFF" fillOpacity={0.28 + frost * 0.5} stroke="#0B0816" strokeWidth={7} />
        <path d="M -200 -210 Q -60 -244 90 -236" stroke="#FFFFFF" strokeWidth={12} fill="none" strokeLinecap="round" opacity={0.7} />
        {frost > 0
          ? Array.from({ length: 16 }).map((_, i) => (
              <circle key={i} cx={-250 + rnd(3, i) * 500} cy={-120 - rnd(5, i) * 120} r={8 + rnd(7, i) * 22} fill="#FFFFFF" opacity={0.35 * frost} />
            ))
          : null}
      </g> : null}
      <g transform="translate(200 -46)">
        <rect x={-80} y={-34} width={170} height={68} rx={10} fill="#0E1822" stroke="#0B0816" strokeWidth={5} />
        {screen ? (
          <>
            <text x={5} y={screen2 ? -6 : 10} textAnchor="middle" fontFamily={FONT.ui} fontSize={16} fill="#4AE8FF">{screen}</text>
            {screen2 ? <text x={5} y={20} textAnchor="middle" fontFamily={FONT.ui} fontSize={16} fill="#FFD23A">{screen2}</text> : null}
          </>
        ) : (
          <path d={`M -64 0 ${Array.from({ length: 14 }).map((_, i) => `L ${-64 + i * 10} ${(i + Math.floor(t / 3)) % 5 === 0 ? -20 : 0}`).join(' ')}`} stroke="#5BE08A" strokeWidth={4} fill="none" />
        )}
      </g>
    </g>
  );
};

/** A smartphone of 2026, flat and dark. */
export const Phone26: React.FC<{ x: number; y: number; s?: number; rot?: number; on?: boolean }> = ({ x, y, s = 1, rot = 0, on = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-36} y={-70} width={72} height={140} rx={14} fill="#1A1A22" stroke="#0B0816" strokeWidth={5} />
    <rect x={-30} y={-62} width={60} height={124} rx={9} fill={on ? '#3A6AC8' : '#2A2E3A'} />
    <path d="M -24 -50 L 14 -58" stroke="#FFFFFF" strokeWidth={4} opacity={0.3} />
    <rect x={-10} y={-66} width={20} height={4} rx={2} fill="#0B0816" />
  </g>
);

/** A museum glass case on a pedestal with a little label; `children` sit inside at (0, -110). */
export const GlassCase: React.FC<{ x: number; y: number; s?: number; label?: string; label2?: string; children?: React.ReactNode; lit?: number }> = ({ x, y, s = 1, label, label2, children, lit = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={130} ry={14} fill="#000" opacity={0.25} />
    <path d="M -90 0 L -80 -60 L 80 -60 L 90 0 Z" fill="#2A3442" stroke="#0B0816" strokeWidth={6} />
    <rect x={-100} y={-74} width={200} height={18} rx={6} fill="#3A4656" stroke="#0B0816" strokeWidth={5} />
    <circle cx={0} cy={-180} r={120} fill="#FFF4D8" opacity={0.12 * lit} />
    <g transform="translate(0 -150)">{children}</g>
    <rect x={-92} y={-260} width={184} height={186} rx={8} fill="#CFF2FF" fillOpacity={0.14} stroke="#0B0816" strokeWidth={6} />
    <path d="M -70 -240 L -40 -110" stroke="#FFFFFF" strokeWidth={8} opacity={0.4} strokeLinecap="round" />
    {label ? (
      <g transform="translate(0 -30)">
        <rect x={-88} y={-16} width={176} height={label2 ? 40 : 28} rx={5} fill="#F2EEE4" stroke="#0B0816" strokeWidth={3} />
        <text x={0} y={2} textAnchor="middle" fontFamily={FONT.ui} fontSize={label.length > 18 ? 9.5 : 13} fill="#1A1A22">{label}</text>
        {label2 ? <text x={0} y={18} textAnchor="middle" fontFamily={FONT.ui} fontSize={10} fill="#5A5A62">{label2}</text> : null}
      </g>
    ) : null}
  </g>
);

/** A clear cube of water (the future's glass of water). `bite` takes a bite out of a corner. */
export const WaterCube: React.FC<{ x: number; y: number; s?: number; bite?: number; rot?: number }> = ({ x, y, s = 1, bite = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d={bite > 0 ? 'M -40 -40 L 10 -40 Q 20 -24 40 -14 L 40 40 L -40 40 Z' : 'M -40 -40 L 40 -40 L 40 40 L -40 40 Z'} fill="#9AE6FF" fillOpacity={0.55} stroke="#0B0816" strokeWidth={5} strokeLinejoin="round" />
    <path d="M -28 -26 L -6 -26" stroke="#FFFFFF" strokeWidth={7} strokeLinecap="round" opacity={0.8} />
    <path d="M -40 -40 L -26 -52 L 52 -52 L 40 -40" fill="#C8F4FF" fillOpacity={0.6} stroke="#0B0816" strokeWidth={4} strokeLinejoin="round" />
  </g>
);

/** A flying car of the year 3000: a pill with a glass bubble and a glow underneath. */
export const SkyCar: React.FC<{ x: number; y: number; s?: number; flip?: boolean; color?: string; t?: number }> = ({ x, y, s = 1, flip = false, color = '#F2F6F8', t = 0 }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 9 + x / 300) * 6}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={42} rx={70} ry={12} fill="#4AE8FF" opacity={0.45} />
    <path d="M -110 10 Q -100 -26 -30 -30 L 60 -30 Q 120 -24 120 10 Q 118 34 70 36 L -80 36 Q -112 32 -110 10 Z" fill={color} stroke="#0B0816" strokeWidth={6} />
    <path d="M -40 -30 Q -20 -70 30 -68 Q 72 -64 80 -28 Z" fill="#9AD8F0" fillOpacity={0.8} stroke="#0B0816" strokeWidth={5} />
    <rect x={96} y={0} width={20} height={10} rx={5} fill="#FFE27A" />
    <rect x={-112} y={4} width={14} height={10} rx={5} fill="#FF5A4A" />
  </g>
);

/** A row of future script: blocky glyphs nobody from 2026 can read. */
export const Glyphs: React.FC<{ x: number; y: number; n: number; seed: number; size?: number; color?: string; anchor?: 'start' | 'middle' }> = ({ x, y, n, seed, size = 28, color = '#4AE8FF', anchor = 'start' }) => {
  const w = size * 0.9;
  const x0 = anchor === 'middle' ? x - (n * w) / 2 : x;
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => {
        const k = Math.floor(rnd(seed, i) * 6);
        const gx = x0 + i * w;
        const h = size;
        const d = [
          `M ${gx} ${y} L ${gx + h * 0.6} ${y} M ${gx + h * 0.3} ${y} L ${gx + h * 0.3} ${y - h}`,
          `M ${gx} ${y - h} L ${gx + h * 0.6} ${y - h * 0.5} L ${gx} ${y}`,
          `M ${gx + h * 0.3} ${y - h} A ${h * 0.3} ${h * 0.3} 0 1 0 ${gx + h * 0.31} ${y - h}`,
          `M ${gx} ${y} L ${gx} ${y - h} L ${gx + h * 0.6} ${y - h} M ${gx} ${y - h * 0.5} L ${gx + h * 0.4} ${y - h * 0.5}`,
          `M ${gx} ${y - h * 0.2} L ${gx + h * 0.3} ${y - h} L ${gx + h * 0.6} ${y - h * 0.2}`,
          `M ${gx} ${y - h} L ${gx + h * 0.6} ${y} M ${gx + h * 0.6} ${y - h} L ${gx + h * 0.3} ${y - h * 0.5}`,
        ][k];
        return <path key={i} d={d} stroke={color} strokeWidth={size * 0.13} fill="none" strokeLinecap="round" />;
      })}
    </g>
  );
};

/** A floating hologram panel (cyan, scanlines); children are drawn inside its box. */
export const Holo: React.FC<{ x: number; y: number; w: number; h: number; t: number; on?: number; children?: React.ReactNode; color?: string }> = ({ x, y, w, h, t, on = 1, children, color = '#4AE8FF' }) => {
  const k = backOut(clamp(on));
  return (
    <g transform={`translate(${x} ${y}) scale(1 ${k})`} opacity={clamp(on * 2)}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={16} fill="#0A2A3A" fillOpacity={0.75} stroke={color} strokeWidth={5} />
      <g>{children}</g>
      {Array.from({ length: Math.floor(h / 14) }).map((_, i) => (
        <rect key={i} x={-w / 2 + 4} y={-h / 2 + i * 14 + ((t * 0.7) % 14)} width={w - 8} height={2} fill={color} opacity={0.12} />
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- the city of the year 3000
const FutureSky: React.FC<{ id: string; mode: 'day' | 'dusk' | 'night' }> = ({ id, mode }) => {
  const c = { day: ['#3A9AD8', '#8ED4EC', '#E4F6F4'], dusk: ['#2A2A6A', '#B85A9A', '#F2A06A'], night: ['#060A1E', '#141A44', '#2A2A5A'] }[mode];
  return (
    <g>
      <defs>
        <linearGradient id={`${id}fs`} x1="0" y1="-400" x2="0" y2="860" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={c[0]} />
          <stop offset="60%" stopColor={c[1]} />
          <stop offset="100%" stopColor={c[2]} />
        </linearGradient>
      </defs>
      <rect x={-1200} y={-600} width={4400} height={1700} fill={`url(#${id}fs)`} />
    </g>
  );
};

/** One slender tower: rings, lit windows, sometimes a sky garden; `h` above the base y. */
const Tower: React.FC<{ x: number; y: number; w: number; h: number; seed: number; c: string; lit: string; dark?: number }> = ({ x, y, w, h, seed, c, lit, dark = 0 }) => {
  const rings = 2 + Math.floor(rnd(seed, 1) * 3);
  const shape = Math.floor(rnd(seed, 2) * 3);
  const top = y - h;
  const path =
    shape === 0
      ? `M ${x - w / 2} ${y} L ${x - w * 0.35} ${top + 40} Q ${x} ${top - 30} ${x + w * 0.35} ${top + 40} L ${x + w / 2} ${y} Z`
      : shape === 1
        ? `M ${x - w / 2} ${y} L ${x - w / 2} ${top + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${x + w / 2} ${top + w / 2} L ${x + w / 2} ${y} Z`
        : `M ${x - w * 0.3} ${y} L ${x - w / 2} ${top + h * 0.5} L ${x - w * 0.2} ${top} L ${x + w * 0.2} ${top} L ${x + w / 2} ${top + h * 0.5} L ${x + w * 0.3} ${y} Z`;
  return (
    <g>
      <path d={path} fill={c} />
      {Array.from({ length: rings }).map((_, i) => {
        const ry = top + 80 + (i * (h - 120)) / rings;
        return <ellipse key={i} cx={x} cy={ry} rx={w * 0.75} ry={w * 0.12} fill="none" stroke={lit} strokeWidth={5} opacity={0.7 - dark * 0.5} />;
      })}
      {Array.from({ length: Math.floor(h / 40) }).map((_, i) =>
        rnd(seed, i + 10) > 0.55 ? <rect key={i} x={x - w * 0.25 + rnd(seed, i + 30) * w * 0.3} y={top + 50 + i * 40} width={w * 0.18} height={10} rx={3} fill={lit} opacity={0.8 - dark * 0.6} /> : null,
      )}
      {shape === 1 ? <circle cx={x} cy={top + w / 2} r={w * 0.18} fill={lit} opacity={0.9 - dark * 0.6} /> : null}
    </g>
  );
};

/** Far, mid and near towers. */
export const FutureSkyline: React.FC<{ y: number; mode: 'day' | 'dusk' | 'night'; seed?: number; x0?: number; x1?: number }> = ({ y, mode, seed = 1, x0 = -900, x1 = 2900 }) => {
  const far = mode === 'night' ? '#1E2450' : mode === 'dusk' ? '#5A4A8A' : '#9ABCD8';
  const mid = mode === 'night' ? '#141A3A' : mode === 'dusk' ? '#3A2E66' : '#6A90B8';
  const lit = mode === 'day' ? '#E8FAFF' : '#8AF0FF';
  const n = Math.floor((x1 - x0) / 120);
  return (
    <g>
      {Array.from({ length: n }).map((_, i) => (
        <Tower key={`f${i}`} x={x0 + i * 120 + rnd(seed, i) * 60} y={y} w={50 + rnd(seed + 1, i) * 40} h={300 + rnd(seed + 2, i) * 420} seed={seed * 10 + i} c={far} lit={lit} dark={0.4} />
      ))}
      {Array.from({ length: Math.floor(n / 2) }).map((_, i) => (
        <Tower key={`m${i}`} x={x0 + 60 + i * 240 + rnd(seed + 3, i) * 100} y={y + 20} w={80 + rnd(seed + 4, i) * 60} h={420 + rnd(seed + 5, i) * 520} seed={seed * 20 + i} c={mid} lit={lit} />
      ))}
    </g>
  );
};

/** The city: sky, towers, sky cars streaming in lanes, and a glossy walkway with a rail (feet at GROUND). */
export const FutureCity: React.FC<{ t: number; id?: string; mode?: 'day' | 'dusk' | 'night'; cars?: number; deck?: boolean }> = ({ t, id = 'fc', mode = 'day', cars = 1, deck = true }) => {
  const deckC = mode === 'night' ? '#1A2236' : '#D8E2EA';
  const deckS = mode === 'night' ? '#10162A' : '#AEBCC8';
  return (
    <g>
      <FutureSky id={id} mode={mode} />
      {mode === 'night' ? <Stars seed={4} x0={-900} y0={-500} w={3600} h={700} t={t} n={90} /> : null}
      {mode !== 'night' ? <circle cx={1500} cy={120} r={90} fill={mode === 'dusk' ? '#FFC07A' : '#FFF6D8'} opacity={0.9} /> : null}
      <FutureSkyline y={760} mode={mode} seed={2} />
      {Array.from({ length: Math.round(9 * cars) }).map((_, i) => {
        const lane = i % 3;
        const speed = 3 + lane * 1.6;
        const dir = lane === 1 ? -1 : 1;
        const span0 = 4200;
        const px = ((rnd(11, i) * span0 + dir * t * speed) % span0 + span0) % span0 - 1100;
        return <SkyCar key={i} x={px} y={120 + lane * 150 + rnd(12, i) * 40} s={0.35 + lane * 0.15} flip={dir < 0} t={t} color={['#F2F6F8', '#FFD23A', '#FF8AB0', '#7AE8D0'][i % 4]} />;
      })}
      {deck ? (
        <g>
          <rect x={-1200} y={GROUND - 10} width={4400} height={500} fill={deckC} />
          <rect x={-1200} y={GROUND - 10} width={4400} height={14} fill={deckS} />
          {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-1200 + i * 160} y={GROUND + 60} width={110} height={6} rx={3} fill={deckS} opacity={0.6} />)}
          <rect x={-1200} y={GROUND - 150} width={4400} height={8} rx={4} fill="#4AE8FF" opacity={0.6} />
          {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-1200 + i * 160} y={GROUND - 150} width={8} height={140} fill="#9AB0C0" opacity={0.7} />)}
          <rect x={-1200} y={GROUND - 150} width={4400} height={140} fill="#BFEFFF" opacity={0.08} />
        </g>
      ) : null}
    </g>
  );
};

/** The pod room: a white clinic room, a long window onto the city, soft ceiling light. Floor at GROUND. */
export const PodRoom: React.FC<{ t: number; id?: string; mode?: 'day' | 'dusk' | 'night'; window?: boolean }> = ({ t, id = 'pr', mode = 'day', window = true }) => (
  <g>
    <rect x={-1200} y={-600} width={4400} height={1800} fill="#E6ECF0" />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={-1200 + i * 280} y={-600} width={4} height={1460} fill="#C8D2DA" />)}
    {window ? (
      <g>
        <defs>
          <clipPath id={`${id}win`}>
            <rect x={380} y={150} width={1160} height={460} rx={40} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${id}win)`}>
          <g transform="translate(960 380) scale(0.55) translate(-960 -380)">
            <FutureCity t={t} id={`${id}c`} mode={mode} deck={false} />
          </g>
        </g>
        <rect x={380} y={150} width={1160} height={460} rx={40} fill="none" stroke="#0B0816" strokeWidth={8} />
        <rect x={380} y={150} width={1160} height={460} rx={40} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.6} />
      </g>
    ) : null}
    <rect x={-1200} y={GROUND - 10} width={4400} height={500} fill="#D2DCE2" />
    <rect x={-1200} y={GROUND - 10} width={4400} height={10} fill="#B4C0CA" />
    <ellipse cx={960} cy={-40} rx={500} ry={70} fill="#FFFFFF" opacity={0.7} />
    <Glow x={960} y={60} r={700} kind="cool" o={0.35} />
  </g>
);

/** The museum hall: deep blue, spotlights, a banner, glass cases at the back. Floor at GROUND. */
export const Museum: React.FC<{ t: number; id?: string; cases?: boolean; night?: number; banner?: boolean }> = ({ t, id = 'mu', cases = true, night = 0, banner = true }) => (
  <g>
    <rect x={-1200} y={-600} width={4400} height={1800} fill={night ? '#0E1428' : '#1E2A4A'} />
    {Array.from({ length: 12 }).map((_, i) => (
      <g key={i}>
        <rect x={-1100 + i * 380} y={-600} width={70} height={1460} fill="#18223E" />
        <rect x={-1100 + i * 380 + 70} y={-600} width={6} height={1460} fill="#2E3E66" />
      </g>
    ))}
    {banner ? (
      <g transform="translate(960 150)">
        <rect x={-430} y={-50} width={860} height={100} rx={12} fill="#F2C84A" stroke="#0B0816" strokeWidth={6} />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#1A1A22">THE EARLY 21ST CENTURY</text>
      </g>
    ) : null}
    {cases ? (
      <g>
        <GlassCase x={300} y={GROUND - 40} s={0.8} label="SNEAKER" lit={1 - night * 0.6}>
          <path d="M -50 10 Q -50 -20 -20 -22 L 10 -10 Q 40 -4 52 8 L 52 18 L -50 18 Z" fill="#F6F2EA" stroke="#0B0816" strokeWidth={5} />
        </GlassCase>
        <GlassCase x={1620} y={GROUND - 40} s={0.8} label="KEYBOARD" lit={1 - night * 0.6}>
          <rect x={-60} y={-14} width={120} height={34} rx={6} fill="#2A2E3A" stroke="#0B0816" strokeWidth={5} />
          {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-52 + (i % 5) * 22} y={-8 + Math.floor(i / 5) * 14} width={16} height={9} rx={2} fill="#C8CED6" />)}
        </GlassCase>
        <GlassCase x={-260} y={GROUND - 40} s={0.8} label="CAR KEY" lit={1 - night * 0.6}>
          <rect x={-18} y={-30} width={36} height={50} rx={10} fill="#2A2E3A" stroke="#0B0816" strokeWidth={5} />
        </GlassCase>
        <GlassCase x={2180} y={GROUND - 40} s={0.8} label="PAPER MONEY" lit={1 - night * 0.6}>
          <rect x={-54} y={-20} width={108} height={46} rx={4} fill="#9AC88A" stroke="#0B0816" strokeWidth={5} />
          <circle cx={0} cy={3} r={12} fill="#6A9A5A" />
        </GlassCase>
      </g>
    ) : null}
    <rect x={-1200} y={GROUND - 10} width={4400} height={500} fill={night ? '#141C30' : '#2A3658'} />
    <rect x={-1200} y={GROUND - 10} width={4400} height={8} fill="#4A5A84" />
    {Array.from({ length: 5 }).map((_, i) => (
      <path key={i} d={`M ${-200 + i * 600} -100 L ${-330 + i * 600} ${GROUND} L ${-70 + i * 600} ${GROUND} Z`} fill="#FFF4D8" opacity={0.07 * (1 - night * 0.7)} />
    ))}
    <Glow x={960} y={300} r={800} kind="warm" o={0.25 * (1 - night * 0.6)} />
  </g>
);

/** The phone's own case, centre stage in the museum. */
export const PhoneCase: React.FC<{ x: number; y: number; s?: number; on?: boolean }> = ({ x, y, s = 1, on = false }) => (
  <GlassCase x={x} y={y} s={s} label="SMARTPHONE · EARLY 21ST C." label2="DO NOT TOUCH">
    <Phone26 x={0} y={-10} s={0.7} rot={-8} on={on} />
  </GlassCase>
);

/** A future street shop: a counter with a glowing menu in glyphs, the city behind. Counter top at y 700. */
export const Shop: React.FC<{ t: number; id?: string }> = ({ t, id = 'sh' }) => (
  <g>
    <FutureCity t={t} id={id} mode="day" deck />
    <rect x={300} y={140} width={1320} height={560} rx={30} fill="#F2F6F8" stroke="#0B0816" strokeWidth={8} />
    <rect x={340} y={180} width={1240} height={180} rx={20} fill="#14202C" />
    <Glyphs x={400} y={260} n={14} seed={3} size={44} />
    <Glyphs x={400} y={330} n={10} seed={5} size={30} color="#FFD23A" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(${520 + i * 300} 470)`}>
        <rect x={-70} y={-60} width={140} height={120} rx={20} fill={['#FF8AB0', '#7AE8D0', '#FFD23A', '#9A8AF0'][i]} stroke="#0B0816" strokeWidth={5} />
        <rect x={-30} y={-30} width={60} height={60} rx={8} fill="#FFFFFF" fillOpacity={0.6} stroke="#0B0816" strokeWidth={4} />
      </g>
    ))}
  </g>
);
export const ShopCounter: React.FC = () => (
  <g>
    <rect x={200} y={700} width={1520} height={400} fill="#DCE4EA" stroke="#0B0816" strokeWidth={8} />
    <rect x={200} y={700} width={1520} height={26} fill="#4AE8FF" opacity={0.8} />
  </g>
);

/** The glass room: a beautiful room inside a glass box in the museum, a sign with your name. */
export const GlassRoom: React.FC<{ t: number; id?: string; door?: number; sign?: boolean }> = ({ t, id = 'gr', door = 0, sign = true }) => (
  <g>
    <Museum t={t} id={id} cases={false} banner={false} />
    <rect x={460} y={160} width={1000} height={GROUND - 160} fill="#F6EFE6" />
    <rect x={460} y={GROUND - 120} width={1000} height={110} fill="#E0D2C0" />
    <rect x={540} y={GROUND - 200} width={360} height={110} rx={16} fill="#F2F2F2" stroke="#0B0816" strokeWidth={6} />
    <rect x={540} y={GROUND - 220} width={90} height={50} rx={16} fill="#FFFFFF" stroke="#0B0816" strokeWidth={5} />
    <rect x={540} y={GROUND - 170} width={360} height={30} fill="#8AB0E0" />
    <g transform={`translate(1300 ${GROUND - 40})`}>
      <path d="M -40 0 L -30 -60 L 30 -60 L 40 0 Z" fill="#C8704A" stroke="#0B0816" strokeWidth={5} />
      <path d="M 0 -60 Q -60 -160 -20 -200 M 0 -60 Q 30 -170 70 -180 M 0 -60 Q 0 -150 10 -220" stroke="#3A8A4A" strokeWidth={18} fill="none" strokeLinecap="round" />
    </g>
    <rect x={1040} y={260} width={260} height={180} rx={10} fill="#8AC8E8" stroke="#0B0816" strokeWidth={6} />
    <path d="M 1060 420 L 1130 330 L 1190 400 L 1230 360 L 1290 420 Z" fill="#5AA06A" />
    <Glow x={960} y={300} r={600} kind="warm" o={0.35} />
    <rect x={460} y={160} width={1000} height={GROUND - 160} fill="#CFF2FF" fillOpacity={0.12} stroke="#0B0816" strokeWidth={10} />
    <rect x={460 + 380} y={160} width={240} height={GROUND - 160} fill="none" stroke="#0B0816" strokeWidth={6} />
    <rect x={460 + 380 + 240 * door} y={162} width={240} height={GROUND - 164} fill="#CFF2FF" fillOpacity={0.15} stroke="#FFFFFF" strokeOpacity={0.5} strokeWidth={4} />
    {[0, 1, 2].map((i) => <path key={i} d={`M ${520 + i * 360} 200 L ${600 + i * 360} 520`} stroke="#FFFFFF" strokeWidth={14} opacity={0.25} strokeLinecap="round" />)}
    {sign ? (
      <g transform={`translate(1640 ${GROUND - 260})`}>
        <rect x={-6} y={0} width={12} height={250} fill="#3A4656" />
        <rect x={-150} y={-90} width={300} height={130} rx={12} fill="#F2EEE4" stroke="#0B0816" strokeWidth={6} />
        <text x={0} y={-42} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#1A1A22">LIVING EXHIBIT</text>
        <text x={0} y={8} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#C8453A">2026</text>
      </g>
    ) : null}
  </g>
);

/** The records room at night: a dark room with one big screen. `screen` draws inside the 900 x 520 box centred at (960, 430). */
export const RecordsRoom: React.FC<{ t: number; id?: string; screen?: React.ReactNode; on?: number }> = ({ t, id = 'rr', screen, on = 1 }) => (
  <g>
    <rect x={-1200} y={-600} width={4400} height={1800} fill="#0A0E1C" />
    {Array.from({ length: 8 }).map((_, i) => (
      <g key={i}>
        <rect x={-900 + i * 520} y={160} width={140} height={GROUND - 160} fill="#141A2E" stroke="#1E2640" strokeWidth={4} />
        {Array.from({ length: 10 }).map((_, j) => <rect key={j} x={-890 + i * 520} y={180 + j * 66} width={120} height={50} rx={4} fill="#1E2842" />)}
      </g>
    ))}
    <rect x={-1200} y={GROUND - 10} width={4400} height={500} fill="#10141F" />
    <Glow x={960} y={430} r={800} kind="cool" o={0.4 * on} />
    <rect x={490} y={150} width={940} height={560} rx={18} fill="#0B0816" stroke="#2E3A56" strokeWidth={8} />
    <g opacity={on}>
      <rect x={510} y={170} width={900} height={520} rx={10} fill="#0E2232" />
      {screen}
    </g>
  </g>
);

/** The old city: broken towers overgrown with green, a low orange sun, rubble. Ground at GROUND. */
export const OldCity: React.FC<{ t: number; id?: string; mode?: 'dusk' | 'day' }> = ({ t, id = 'oc', mode = 'dusk' }) => (
  <g>
    <FutureSky id={id} mode={mode === 'dusk' ? 'dusk' : 'day'} />
    <circle cx={1300} cy={520} r={150} fill="#FFB86A" opacity={0.9} />
    {Array.from({ length: 14 }).map((_, i) => {
      const x = -700 + i * 260 + rnd(21, i) * 80;
      const h = 260 + rnd(22, i) * 380;
      const w = 120 + rnd(23, i) * 80;
      const cut = rnd(24, i) * 60;
      return (
        <g key={i}>
          <path d={`M ${x} ${GROUND} L ${x} ${GROUND - h} L ${x + w * 0.4} ${GROUND - h + cut} L ${x + w * 0.7} ${GROUND - h - 30} L ${x + w} ${GROUND - h + 40} L ${x + w} ${GROUND} Z`} fill={mode === 'dusk' ? '#3A2E4A' : '#6A7A8A'} />
          {Array.from({ length: Math.floor(h / 60) }).map((_, j) => <rect key={j} x={x + 20} y={GROUND - h + 50 + j * 60} width={w - 40} height={22} fill="#1E1828" opacity={0.6} />)}
          <path d={`M ${x + w * 0.2} ${GROUND - h + 20} Q ${x + w * 0.1} ${GROUND - h * 0.5} ${x + w * 0.3} ${GROUND}`} stroke="#3A7A3A" strokeWidth={18} fill="none" />
          <circle cx={x + w * 0.7} cy={GROUND - h - 10} r={34} fill="#3A8A4A" />
          <circle cx={x + w * 0.4} cy={GROUND - h + 10} r={26} fill="#4A9A4A" />
        </g>
      );
    })}
    <rect x={-1200} y={GROUND - 10} width={4400} height={500} fill="#4A5A3A" />
    {Array.from({ length: 24 }).map((_, i) => (
      <path key={i} d={`M ${-1100 + i * 180} ${GROUND + 20} l 30 -60 l 40 50 Z`} fill="#6A6A5A" stroke="#0B0816" strokeWidth={3} />
    ))}
    {Array.from({ length: 40 }).map((_, i) => (
      <path key={i} d={`M ${-1100 + i * 90} ${GROUND + 5} q 6 -${26 + rnd(25, i) * 30} ${14 + Math.sin(t / 20 + i) * 4} -${40 + rnd(26, i) * 30}`} stroke="#5A9A4A" strokeWidth={6} fill="none" />
    ))}
  </g>
);

/** The vault in the old city: dark metal walls, frost, one cold light. Floor at GROUND. */
export const Vault: React.FC<{ t: number; id?: string; door?: number }> = ({ t, id = 'va', door = 0 }) => (
  <g>
    <rect x={-1200} y={-600} width={4400} height={1800} fill="#1A2230" />
    {Array.from({ length: 16 }).map((_, i) => (
      <g key={i}>
        <rect x={-1100 + i * 260} y={-600} width={250} height={1460} fill="#222C3C" stroke="#141A26" strokeWidth={6} />
        {[0, 1, 2, 3].map((j) => <circle key={j} cx={-1080 + i * 260} cy={60 + j * 220} r={6} fill="#3A4656" />)}
      </g>
    ))}
    <rect x={-1200} y={GROUND - 10} width={4400} height={500} fill="#141A26" />
    <path d={`M -1200 ${GROUND} L 3200 ${GROUND}`} stroke="#C8F0FF" strokeWidth={6} opacity={0.3} />
    <Glow x={960} y={100} r={600} kind="cool" o={0.45} />
    <path d="M 860 -100 L 560 860 L 1360 860 L 1060 -100 Z" fill="#C8F0FF" opacity={0.06} />
    {Array.from({ length: 30 }).map((_, i) => (
      <circle key={i} cx={-200 + rnd(31, i) * 2400} cy={((rnd(32, i) * 900 + t * (0.6 + rnd(33, i))) % 1000) - 60} r={2 + rnd(34, i) * 3} fill="#E8FAFF" opacity={0.5} />
    ))}
  </g>
);

/** The metal door with your family name scratched into it. */
export const NameDoor: React.FC<{ x: number; y: number; s?: number; open?: number; scratch?: number }> = ({ x, y, s = 1, open = 0, scratch = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-180} y={-420} width={360} height={420} fill="#0B0816" />
    <Glow x={0} y={-200} r={200} kind="cool" o={0.4 * open} />
    <g transform={`translate(${-180} 0) scale(${1 - open * 0.85} 1) translate(180 0)`}>
      <rect x={-180} y={-420} width={360} height={420} fill="#6A6E74" stroke="#0B0816" strokeWidth={8} />
      {[0, 1, 2].map((i) => <rect key={i} x={-160} y={-400 + i * 140} width={320} height={120} fill="none" stroke="#545860" strokeWidth={6} />)}
      <path d="M -150 -380 L 120 -30 M 80 -390 L 150 -250" stroke="#8A6040" strokeWidth={10} opacity={0.5} />
      <g opacity={scratch}>
        <text x={0} y={-220} textAnchor="middle" fontFamily={FONT.hand} fontSize={70} fill="none" stroke="#E8E4DC" strokeWidth={4}>OUR NAME</text>
      </g>
      <circle cx={130} cy={-200} r={14} fill="#3A3E44" stroke="#0B0816" strokeWidth={4} />
    </g>
  </g>
);

/** The holographic map with streets and a glowing dot at the edge of the old city. */
export const MapHolo: React.FC<{ x: number; y: number; s?: number; t: number; on?: number }> = ({ x, y, s = 1, t, on = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Holo x={0} y={0} w={620} h={400} t={t} on={on}>
      {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M -290 ${-180 + i * 45} L 290 ${-170 + i * 40}`} stroke="#4AE8FF" strokeWidth={2} opacity={0.4} />)}
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${-280 + i * 50} -190 L ${-260 + i * 46} 190`} stroke="#4AE8FF" strokeWidth={2} opacity={0.4} />)}
      <path d="M -300 120 Q -100 40 60 110 T 300 80" stroke="#4AE8FF" strokeWidth={10} opacity={0.5} fill="none" />
      <rect x={-260} y={-160} width={260} height={180} fill="#4AE8FF" opacity={0.18} />
      <text x={-130} y={-60} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#8AF0FF">MUSEUM</text>
      <text x={190} y={-120} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#FFD23A">OLD CITY</text>
      <circle cx={210} cy={-60} r={22 + Math.sin(t / 4) * 8} fill="#FFD23A" opacity={0.35} />
      <circle cx={210} cy={-60} r={11} fill="#FFD23A" stroke="#0B0816" strokeWidth={3} />
      <path d={`M -130 -40 Q 40 ${-30 - Math.sin(t / 8) * 10} 200 -60`} stroke="#FFD23A" strokeWidth={4} strokeDasharray="12 10" fill="none" />
    </Holo>
  </g>
);

// ---------------------------------------------------------------- the HUD: day and credits
/** Top right: the day and your credits. keys: [frame, day label, credits]. */
export const hud = (keys: [number, string, number][]): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
    let k = 0;
    keys.forEach((kk, i) => {
      if (f >= kk[0]) k = i;
    });
    if (f < keys[0][0]) return null;
    const [f0, day, cr] = keys[k];
    const prev = k > 0 ? keys[k - 1][2] : cr;
    const p = clamp((f - f0) / 24);
    const shown = Math.round(prev + (cr - prev) * easeOut(p));
    const pop = k > 0 && prev !== cr ? 1 + 0.25 * Math.sin(p * Math.PI) : 1;
    return (
      <g transform="translate(1600 92)">
        <rect x={-250} y={-50} width={510} height={100} rx={50} fill={UI.pill} opacity={0.88} />
        <text x={-150} y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#F6EFE3">{day}</text>
        <rect x={-50} y={-32} width={3} height={64} fill="#F6EFE3" opacity={0.35} />
        <g transform={`translate(110 0) scale(${pop})`}>
          <path d="M -104 -18 L -86 -28 L -68 -18 L -68 2 L -86 12 L -104 2 Z" fill="none" stroke="#4AE8FF" strokeWidth={5} transform="translate(0 6)" />
          <text x={30} y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={cr <= 0 ? UI.bad : '#4AE8FF'}>{shown.toLocaleString('en-US')}</text>
        </g>
      </g>
    );
  };
  return Hud;
};

// ---------------------------------------------------------------- shot builders
/** A plain set shot with a camera move and extra layers. */
export const setShot = (Set: SetFC, cam: [number, number, number], cam1?: [number, number, number], extra?: (t: number, len: number, f: number) => React.ReactNode, front?: (t: number, len: number, f: number) => React.ReactNode, setT = 100): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const [a, b, c] = cam;
    const [a1, b1, c1] = cam1 ?? cam;
    const L = Math.max(1, len);
    return (
      <g>
        <g transform={camT(kf(t, [[0, a], [L, a1]]), kf(t, [[0, b], [L, b1]]), kf(t, [[0, c], [L, c1]]))}>
          <Set t={t + setT} />
          {extra?.(t, len, f)}
        </g>
        {front?.(t, len, f)}
      </g>
    );
  };
  return Shot;
};

/** A Vee close-up talking over a soft set. */
export const veeCU = (o: { Bg: SetFC; mood?: 'open' | 'happy' | 'sad' | 'scan' | 'alarm'; words?: Word[]; talk?: [string, string, number?]; zoom?: [number, number]; look?: number; extra?: (t: number) => React.ReactNode }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const open = o.words && o.talk ? talkAt(o.words, f, 30, [span(o.words, o.talk[0], o.talk[1], o.talk[2] ?? 1)]) : 0;
    const z = kf(t, [[0, o.zoom?.[0] ?? 2.6], [Math.max(1, len), o.zoom?.[1] ?? 2.8]]);
    return (
      <g>
        <Soft blur={16} dim={0.2}>
          <g transform={camT(960, 520, 1.5)}>
            <o.Bg t={t + 140} id="vcu" />
          </g>
        </Soft>
        <g transform={camT(960, 520, z)}>
          <Vee x={960} y={520} s={1.2} t={t} mood={o.mood} talk={open} look={o.look ?? -0.2} />
          {o.extra?.(t)}
        </g>
      </g>
    );
  };
  return Shot;
};

/** A chapter title on the city: kicker and title over a dusk skyline. */
export const chapterTitle = (o: { kicker: string; title: string; mode?: 'day' | 'dusk' | 'night' }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    return (
      <g>
        <g transform={camT(960, 520, kf(t, [[0, 1.0], [Math.max(1, len), 1.07]]))}>
          <FutureCity t={t + 300} id="cht" mode={o.mode ?? 'dusk'} deck={false} />
        </g>
        <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.4} />
        <g transform={`translate(960 420) scale(${pop(2)})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill="#4AE8FF">{o.kicker}</text>
        </g>
        <g transform={`translate(960 580) scale(${pop(6)})`}>
          <Big x={0} y={0} size={130} fill="#FFFFFF">{o.title}</Big>
        </g>
      </g>
    );
  };
  return Shot;
};

/** Your hand (orange sleeve) reaching in from the bottom right to a point, for inserts. */
export const Sleeve: React.FC<{ x: number; y: number; from?: [number, number]; s?: number; look?: Look }> = ({ x, y, from = [1800, 1200], s = 1, look = YOU }) => {
  const ang = (Math.atan2(y - from[1], x - from[0]) * 180) / Math.PI;
  const len = Math.hypot(x - from[0], y - from[1]);
  return (
    <g transform={`translate(${from[0]} ${from[1]}) rotate(${ang})`}>
      <rect x={0} y={-60 * s} width={len} height={120 * s} rx={60 * s} fill={look.jacket} stroke="#0B0816" strokeWidth={8} />
      <circle cx={len} cy={0} r={52 * s} fill={look.hand} stroke="#0B0816" strokeWidth={8} />
    </g>
  );
};

/** The "Is any of this real?" line: a cream tag with a tick. */
export const RealTag: React.FC<{ x: number; y: number; t: number; text: string; at?: number }> = ({ x, y, t, text, at = 0 }) => {
  const s = backOut(clamp((t - at) / 8));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-360} y={-44} width={720} height={84} rx={42} fill={UI.pill} stroke="#5BE08A" strokeWidth={4} />
      <path d="M -320 -2 l 14 14 l 26 -30" stroke="#5BE08A" strokeWidth={7} fill="none" strokeLinecap="round" />
      <text x={-260} y={12} fontFamily={FONT.ui} fontSize={32} fill="#F6EFE3">{text}</text>
    </g>
  );
};

export { basePose, camT, clamp, kf, backOut, easeOut, easeInOut, faceAt, idleBlink, talkAt, FONT, Glow, rnd, UI, Hero };
export type { Pose, ShotProps, Word, Expr, Look };

// ---------------------------------------------------------------- the scene builder most shots use
export type Actor = {
  look: Look; x: number; s?: number; ground?: number; yaw?: number; faces?: [number, Expr][]; seed?: number;
  pose?: (t: number, len: number) => Partial<Pose>; light?: boolean; talk?: [string, string, number?][]; shadow?: number; walk?: number;
};
/**
 * A set, a camera move and a cast: each actor stands at x on the ground (or walks: `walk` px per frame), with an
 * expression track, an optional pose override per frame, lips on their own words (talk: [first word, last word, nth]),
 * and the ear light unless `light: false`. `vee` adds the robot. back/front draw behind and in front of the cast.
 */
export const scene = (o: {
  Set: SetFC; words?: Word[]; cam: [number, number, number]; cam1?: [number, number, number]; cast?: Actor[];
  vee?: { x: number; y: number; s?: number; mood?: 'open' | 'happy' | 'sad' | 'scan' | 'alarm'; look?: number; talk?: [string, string, number?]; move?: (t: number, len: number) => { x?: number; y?: number } };
  back?: (t: number, len: number, f: number) => React.ReactNode; front?: (t: number, len: number, f: number) => React.ReactNode; over?: (t: number, len: number, f: number) => React.ReactNode;
  setT?: number; shake?: [number, number, number];
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const L = Math.max(1, len);
    const [a, b, c] = o.cam;
    const [a1, b1, c1] = o.cam1 ?? o.cam;
    const W = o.words ?? [];
    const sp = (tk?: [string, string, number?][]) => (tk ? tk.map(([x, y, n]) => span(W, x, y, n ?? 1)) : undefined);
    const vm = o.vee?.move?.(t, L) ?? {};
    return (
      <g>
        <g transform={`${o.shake ? shk(t, o.shake[0], o.shake[1], o.shake[2]) : ''} ${camT(kf(t, [[0, a], [L, a1]]), kf(t, [[0, b], [L, b1]]), kf(t, [[0, c], [L, c1]]))}`}>
          <o.Set t={t + (o.setT ?? 100)} />
          {o.back?.(t, L, f)}
          {(o.cast ?? []).map((ac, i) => {
            const s = ac.s ?? 1;
            const g = ac.ground ?? GROUND;
            const x = ac.x + (ac.walk ?? 0) * t;
            const base: Pose = ac.walk
              ? { ...runPose(x, t * 0.6, g, s, ac.walk > 0 ? 1 : -1), legL: { a: 18 * Math.sin(t * 0.3), b: -10 }, legR: { a: -18 * Math.sin(t * 0.3), b: -10 }, armL: { a: 14 * Math.sin(t * 0.3), b: -10 }, armR: { a: -14 * Math.sin(t * 0.3), b: -10 }, tilt: 0, yaw: ac.walk > 0 ? 0.6 : -0.6 }
              : standAt(x, s, g, { yaw: ac.yaw ?? 0 });
            const pose: Pose = { ...base, ...(ac.yaw !== undefined && ac.walk ? { yaw: ac.yaw } : {}), ...(ac.pose?.(t, L) ?? {}) };
            return (
              <Citizen key={i} look={ac.look} pose={pose} t={t} faces={ac.faces} seed={ac.seed ?? i + 2} words={W} f={f} talk={sp(ac.talk)} shadow={ac.shadow ?? 1} light={ac.light ?? (ac.look !== YOU)} />
            );
          })}
          {o.vee ? <Vee x={vm.x ?? o.vee.x} y={vm.y ?? o.vee.y} s={o.vee.s ?? 0.8} t={t} mood={o.vee.mood} look={o.vee.look} talk={o.vee.talk ? talkAt(W, f, 30, [span(W, o.vee.talk[0], o.vee.talk[1], o.vee.talk[2] ?? 1)]) : 0} /> : null}
          {o.front?.(t, L, f)}
        </g>
        {o.over?.(t, L, f)}
      </g>
    );
  };
  return Shot;
};

/** Sitting up in the pod: hips on the pod bed, legs forward. */
export const podSit = (x: number, y: number, s = 1, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y, scale: s, yaw: 0.5, legL: { a: 85, b: 0 }, legR: { a: 80, b: 0 }, armL: { a: 30, b: -20 }, armR: { a: 30, b: -20 }, ...extra,
});
