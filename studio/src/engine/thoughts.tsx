import React from 'react';
import { FONT } from './fonts';
import { HEAD, Pose, toWorld } from './rig';

// Heard thoughts ("What if you could hear everyone's thoughts?"): a hand-lettered cloud that hangs over a head, with
// a trail of little puffs down to it, the words typing on as they are "heard". Reusable for any inner voice.

const clamp = (x: number, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const backOut = (x: number) => {
  const c = 1.9;
  return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2);
};

export const THINK = {
  paper: '#F7F1FF', ink: '#2A1F44', glow: '#B9A4FF', violet: '#8C6CFF', hot: '#FF5A5A', warm: '#FFD34A', calm: '#7FE0C8',
};

/** A thought on the shot clock: a fixed text, or [[frame, text], ...] (the latest key at or before t wins). */
export type Th = string | [number, string][];
export const thAt = (t: number, th: Th): { text: string; since: number } => {
  if (typeof th === 'string') return { text: th, since: 0 };
  let cur = { text: '', since: 0 };
  for (const [f, s] of th) if (t >= f) cur = { text: s, since: f };
  return cur;
};

/** Break text into lines of at most n characters. */
export const wrapText = (s: string, n = 18) => {
  const out: string[] = [];
  let line = '';
  for (const w of s.split(' ')) {
    if (line && (line + ' ' + w).length > n) {
      out.push(line);
      line = w;
    } else line = line ? line + ' ' + w : w;
  }
  if (line) out.push(line);
  return out;
};

/** The cloud outline around a w x h box: bumps all round. */
const cloudPath = (w: number, h: number, seed = 1) => {
  const n = Math.max(8, Math.round((w + h) / 46));
  const pts: string[] = [];
  const rx = w / 2 + 18, ry = h / 2 + 16;
  for (let i = 0; i <= n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const x = Math.cos(a0) * rx, y = Math.sin(a0) * ry;
    if (i === 0) pts.push(`M ${x.toFixed(1)} ${y.toFixed(1)}`);
    else {
      const am = ((i - 0.5) / n) * Math.PI * 2;
      const bump = 1.28 + 0.06 * Math.sin(i * 2.3 + seed);
      pts.push(`Q ${(Math.cos(am) * rx * bump).toFixed(1)} ${(Math.sin(am) * ry * bump).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
  }
  return pts.join(' ') + ' Z';
};

/**
 * The cloud. (x, y) is the point the trail ends at (just above the head); the cloud floats up and to the `side`.
 * `type` 0..1 is how much of the text is typed on (default all); `pop` scales it in; `s` scales it; `loud` 0..1
 * makes it bigger, redder and shaky (a thought about you, a shout); `dim` fades it for a crowd behind.
 */
export const ThoughtBubble: React.FC<{
  x: number; y: number; text: string; s?: number; pop?: number; t?: number; type?: number; side?: number; loud?: number; dim?: number;
  color?: string; wrap?: number; seed?: number; bob?: boolean; tail?: boolean;
}> = ({ x, y, text, s = 1, pop = 1, t = 0, type = 1, side = 0.35, loud = 0, dim = 0, color, wrap = 18, seed = 1, bob = true, tail = true }) => {
  if (pop <= 0 || !text) return null;
  const lines = wrapText(text, wrap);
  const fs = 50;
  const lh = fs * 1.12;
  const longest = Math.max(...lines.map((l) => l.length));
  const w = Math.max(170, longest * fs * 0.5 + 40);
  const h = lines.length * lh + 18;
  const shake = loud > 0 ? Math.sin(t * 2.7) * 4 * loud : 0;
  const dy = bob ? Math.sin(t / 17 + seed) * 6 : 0;
  const sc = s * (1 + loud * 0.25) * backOut(clamp(pop));
  const cx = side * (w * 0.5 + 40), cy = -(h / 2 + 120);
  const edge = color ?? (loud > 0.5 ? THINK.hot : THINK.violet);
  const fill = loud > 0.5 ? '#FFF0F0' : THINK.paper;
  // type on character by character across the lines
  const total = lines.join(' ').length;
  let left = Math.round(total * clamp(type));
  const shown = lines.map((l) => {
    const k = Math.max(0, Math.min(l.length, left));
    left -= l.length + 1;
    return l.slice(0, k);
  });
  return (
    <g transform={`translate(${x + shake} ${y + dy}) scale(${sc})`} opacity={clamp(pop * 3) * (1 - dim * 0.6)}>
      {tail ? (
        <g>
          <circle cx={side * 10} cy={-16} r={9} fill={fill} stroke={edge} strokeWidth={4} />
          <circle cx={side * 34} cy={-46} r={14} fill={fill} stroke={edge} strokeWidth={4} />
          <circle cx={side * 62} cy={-84} r={19} fill={fill} stroke={edge} strokeWidth={4} />
        </g>
      ) : null}
      <g transform={`translate(${cx} ${cy})`}>
        <ellipse cx={0} cy={0} rx={w * 0.75} ry={h * 1.1} fill={edge} opacity={0.12 + loud * 0.25} filter="url(#blur16)" />
        <path d={cloudPath(w, h, seed)} fill={fill} stroke={edge} strokeWidth={6 + loud * 4} />
        {shown.map((l, i) => (
          <text key={i} x={0} y={(i - (lines.length - 1) / 2) * lh + fs * 0.34} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={fs} fill={loud > 0.5 ? '#9A1E1E' : THINK.ink}>
            {l}
          </text>
        ))}
      </g>
    </g>
  );
};

/** Where a thought hangs over someone: a little above the top of the head, in world space. */
export const aboveHead = (pose: Pose, lift = 20): { x: number; y: number } => toWorld(pose, { x: pose.yaw * 8, y: HEAD.y - HEAD.r - lift });

/** A thought over a posed character, scaled with them. */
export const ThoughtOver: React.FC<{
  pose: Pose; text: string; t: number; pop?: number; s?: number; type?: number; side?: number; loud?: number; dim?: number; lift?: number; wrap?: number; color?: string;
}> = ({ pose, text, t, pop = 1, s = 0.62, type, side, loud, dim, lift, wrap, color }) => {
  const p = aboveHead(pose, lift);
  return <ThoughtBubble x={p.x} y={p.y} text={text} s={s * pose.scale} pop={pop} t={t + pose.x / 7} type={type} side={side ?? (pose.x > 960 ? -0.35 : 0.35)} loud={loud} dim={dim} wrap={wrap} seed={Math.round(pose.x)} color={color} />;
};

/** Faint rings rising from a head: someone thinking (heard but not shown as words), or the crowd's noise. */
export const ThinkWaves: React.FC<{ pose: Pose; t: number; amt?: number; color?: string }> = ({ pose, t, amt = 1, color = THINK.glow }) => {
  if (amt <= 0) return null;
  const p = aboveHead(pose, 0);
  return (
    <g opacity={amt}>
      {[0, 1, 2].map((i) => {
        const k = ((t / 30 + i / 3) % 1);
        return <ellipse key={i} cx={p.x} cy={p.y - 20 * pose.scale - k * 60 * pose.scale} rx={(30 + k * 70) * pose.scale} ry={(10 + k * 22) * pose.scale} fill="none" stroke={color} strokeWidth={4 * pose.scale} opacity={(1 - k) * 0.7} />;
      })}
    </g>
  );
};
