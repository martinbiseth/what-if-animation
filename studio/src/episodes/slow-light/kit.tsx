import React from 'react';
import { Hero, Look, Pose, ShotProps, basePose, camT, kf, idleBlink, faceAt, Expr, LEG_LEN, talkAt, Word, clamp, FONT, backOut } from '../../engine';
import { FadeStreet, HourHud, STREETM } from './sets';

// Builders shared by the chapters of this episode: people on the street, the hour readout over any shot, and a
// stopwatch / big caption.

/** A pose standing on the street's pavement at x. */
export const onStreet = (x: number, scale = 0.85, o: Partial<Pose> = {}): Pose => ({ ...basePose, x, y: STREETM.feet - LEG_LEN * scale, scale, ...o });

/** Wraps a shot with the hour readout in the corner. */
export const withHud = (Shot: React.FC<ShotProps>, hour: number, clock: string): React.FC<ShotProps> => {
  const W: React.FC<ShotProps> = (p) => (
    <g>
      <Shot {...p} />
      <HourHud t={p.t} hour={hour} clock={clock} />
    </g>
  );
  return W;
};

export type StreetCast = {
  look: Look; x: number; scale?: number; yaw?: number; faces?: [number, Expr][]; pose?: (t: number) => Partial<Pose>;
  talk?: [number, number][]; seed?: number;
};
/** People on the street with the Sun at brightness `sun` (a number or a function of the shot clock). */
export const streetShot = (o: {
  sun: number | ((t: number) => number); cast: StreetCast[]; cam?: { from: [number, number, number]; to?: [number, number, number] };
  words?: Word[]; back?: (t: number, len: number) => React.ReactNode; front?: (t: number, len: number) => React.ReactNode; setT?: number; stars?: number; car?: boolean;
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const [x0, y0, z0] = o.cam?.from ?? [960, 540, 1];
    const [x1, y1, z1] = o.cam?.to ?? [x0, y0, z0];
    const L = Math.max(1, len);
    const sun = typeof o.sun === 'number' ? o.sun : o.sun(t);
    return (
      <g transform={camT(kf(t, [[0, x0], [L, x1]]), kf(t, [[0, y0], [L, y1]]), kf(t, [[0, z0], [L, z1]]))}>
        <FadeStreet t={t + (o.setT ?? 100)} sun={sun} stars={o.stars ?? 0} car={o.car} />
        {o.back?.(t, len)}
        {o.cast.map((c, i) => {
          const face = faceAt(t, c.faces ?? [[0, 'neutral']]);
          const seed = c.seed ?? i + 2;
          const open = o.words && c.talk ? talkAt(o.words, f, 30, c.talk) : 0;
          const br = Math.sin((t + seed * 13) / 22);
          const p = onStreet(c.x, c.scale ?? 0.85, { yaw: c.yaw ?? 0, look: Math.sign(c.yaw ?? 0) * 0.5, tilt: br * 1.2, headTilt: br * 1.5, ...c.pose?.(t) });
          return <Hero key={i} look={c.look} pose={{ ...p, ...face, blink: Math.max(face.blink, idleBlink(t, seed)), talk: open }} />;
        })}
        {o.front?.(t, len)}
      </g>
    );
  };
  return Shot;
};

/** A wave: the right arm up, the hand swinging. */
export const wave = (t: number, on = 1): Partial<Pose> => (on > 0 ? { armR: { a: 150 + Math.sin(t / 2.2) * 14, b: 20 + Math.sin(t / 2.2) * 25 } } : {});

/** A big caption in the lower third (a number, a time). */
export const Caption: React.FC<{ t: number; text: string; color?: string; y?: number; size?: number }> = ({ t, text, color = '#FFD23A', y = 900, size = 120 }) => (
  <g transform={`translate(960 ${y}) scale(${backOut(clamp((t - 2) / 9))})`}>
    <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#0B0816" strokeWidth={14} paintOrder="stroke">{text}</text>
  </g>
);

/** A stopwatch counting from `from` to `to` seconds over the shot. */
export const Stopwatch: React.FC<{ t: number; len: number; to: number; from?: number; x?: number; y?: number; s?: number }> = ({ t, len, to, from = 0, x = 960, y = 540, s = 1 }) => {
  const v = from + (to - from) * clamp(t / Math.max(1, len - 6));
  const a = (v / 60) * Math.PI * 2 * 4;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-30} y={-300} width={60} height={50} rx={10} fill="#C8CCD4" stroke="#100E16" strokeWidth={8} />
      <circle r={250} fill="#F6EFE3" stroke="#100E16" strokeWidth={14} />
      {Array.from({ length: 12 }).map((_, k) => <line key={k} x1={0} y1={-220} x2={0} y2={-190} stroke="#100E16" strokeWidth={8} transform={`rotate(${k * 30})`} />)}
      <line x1={0} y1={0} x2={Math.sin(a) * 190} y2={-Math.cos(a) * 190} stroke="#E8252A" strokeWidth={12} strokeLinecap="round" />
      <circle r={18} fill="#100E16" />
      <text y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#100E16">{`${Math.floor(v)}s`}</text>
    </g>
  );
};
