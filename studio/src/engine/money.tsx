import React from 'react';
import { FONT } from './fonts';
import { HEAD, Pose, toWorld } from './rig';

// Floating bank balances ("What if you could see everyone's bank balance?"): a glowing chip that hangs over a
// head, green when the person has money, red when they owe it, ticking live. Reusable for any number over a head.

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const backOut = (x: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

export const MONEY = { green: '#4BE38A', greenDeep: '#0F3A24', red: '#FF4A4A', redDeep: '#3E0F14', zero: '#E8E4F0', zeroDeep: '#24202E', gold: '#FFD34A' };

/** 4210000 -> "$4,210,000", -61000.5 -> "-$61,000.50" (cents when asked or when the value has them). */
export const fmtMoney = (v: number, cents?: boolean) => {
  const neg = v < -0.004;
  const a = Math.abs(v);
  const showC = cents ?? Math.abs(a - Math.round(a)) > 0.004;
  const whole = showC ? Math.floor(a + 1e-6) : Math.round(a);
  const c = Math.round((a - Math.floor(a + 1e-6)) * 100) % 100;
  const s = whole.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${neg ? '-' : ''}$${s}${showC ? '.' + String(Math.max(0, c)).padStart(2, '0') : ''}`;
};

/** A balance moving on the shot clock: [[frame, value], ...]; eases between keys (a count), holds after the last. */
export const moneyAt = (t: number, keys: [number, number][], step = false): number => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [f1, v1] = keys[i];
    const [f0, v0] = keys[i - 1];
    if (t < f1) {
      if (step) return v0;
      const k = (t - f0) / Math.max(1, f1 - f0);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      const v = v0 + (v1 - v0) * e;
      return Number.isInteger(v0) && Number.isInteger(v1) ? Math.round(v) : Math.round(v * 100) / 100;
    }
  }
  return keys[keys.length - 1][1];
};

/** A balance: a fixed number, or keys on the shot clock (see moneyAt). */
export type Bal = number | [number, number][];
export const balAt = (t: number, b: Bal) => (typeof b === 'number' ? b : moneyAt(t, b));
/** 0..1 for a few frames after a key in a Bal: the chip flashes when a change lands. */
export const balFlash = (t: number, b: Bal) => {
  if (typeof b === 'number') return 0;
  let fl = 0;
  for (let i = 1; i < b.length; i++) if (t >= b[i][0] && t < b[i][0] + 10) fl = 1 - (t - b[i][0]) / 10;
  return fl;
};

/**
 * The chip. (x, y) is its bottom centre; `s` scales it; `pop` 0..1 scales it in; `t` gives the float.
 * `text` replaces the number (for "???" or a word). `flash` 0..1 brightens it (a change landing). `cents` forces cents.
 */
export const BalanceTag: React.FC<{
  x: number; y: number; v: number; s?: number; pop?: number; t?: number; cents?: boolean; text?: string; flash?: number; color?: string; bob?: boolean;
}> = ({ x, y, v, s = 1, pop = 1, t = 0, cents, text, flash = 0, color, bob = true }) => {
  if (pop <= 0) return null;
  const label = text ?? fmtMoney(v, cents);
  const c = color ?? (Math.abs(v) < 0.005 ? MONEY.zero : v > 0 ? MONEY.green : MONEY.red);
  const deep = c === MONEY.green ? MONEY.greenDeep : c === MONEY.red ? MONEY.redDeep : MONEY.zeroDeep;
  const fs = 54;
  const w = Math.max(190, label.length * fs * 0.58 + 64);
  const h = 84;
  const dy = bob ? Math.sin(t / 18) * 6 : 0;
  const sc = s * backOut(clamp(pop));
  return (
    <g transform={`translate(${x} ${y + dy}) scale(${sc})`} opacity={clamp(pop * 3)}>
      <ellipse cx={0} cy={-h / 2} rx={w * 0.7} ry={h * 1.05} fill={c} opacity={0.14 + flash * 0.3} filter="url(#blur16)" />
      <rect x={-w / 2} y={-h} width={w} height={h} rx={h / 2} fill={deep} opacity={0.9} stroke={c} strokeWidth={5 + flash * 5} />
      <path d="M -14 -2 L 0 16 L 14 -2 Z" fill={c} />
      <text x={0} y={-h / 2 + fs * 0.36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={fs} fill={flash > 0.3 ? '#FFFFFF' : c} letterSpacing={1}>
        {label}
      </text>
    </g>
  );
};

/** Where a balance hangs over someone: a little above the top of their head, in world space. */
export const overHead = (pose: Pose, lift = 40): { x: number; y: number } => toWorld(pose, { x: pose.yaw * 8, y: HEAD.y - HEAD.r - lift });

/** A balance over a posed character: the chip at their head, scaled with them. */
export const BalanceOver: React.FC<{ pose: Pose; v: number; t: number; pop?: number; s?: number; cents?: boolean; text?: string; flash?: number; lift?: number; color?: string }> = ({
  pose, v, t, pop = 1, s = 0.6, cents, text, flash, lift, color,
}) => {
  const p = overHead(pose, lift);
  return <BalanceTag x={p.x} y={p.y} v={v} s={s * pose.scale} pop={pop} t={t + pose.x / 7} cents={cents} text={text} flash={flash} color={color} />;
};
