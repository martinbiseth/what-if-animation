import React from 'react';
import {
  Hero, Look, Pose, ShotProps, Word, basePose, camT, clamp, kf, backOut, faceAt, idleBlink, talkAt, Expr, FONT, Glow, UI, poseAt, easeOut,
} from '../../engine';
import { Longhouse, Farmyard, Lake, Tod, hipAt, LH, FEET, INK } from './norse';

// Shared by every chapter of "How Vikings Survived -30°C Winters": word spans for lip sync, shot builders (a scene on
// a set, a face close-up, an insert, a big word, a chapter card), and the body-temperature meter that is the
// episode's HUD.

/** Seconds from the start of word `a` (its nth occurrence) to the end of word `b` after it. */
export const span = (words: Word[], a: string, b: string, nth = 1): [number, number] => {
  const n = (w: string) => w.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '').replace(/^'+|'+$/g, '');
  let seen = 0;
  const i = words.findIndex((w) => n(w.w) === n(a) && ++seen === nth);
  if (i < 0) return [0, 0];
  const j = words.findIndex((w, k) => k >= i && n(w.w) === n(b));
  return [words[i].s, words[j >= 0 ? j : i].e + 0.05];
};
/** The frame (chapter clock) where word `a` (nth occurrence) starts. */
export const wordF = (words: Word[], a: string, nth = 1, fps = 30) => Math.round(span(words, a, a, nth)[0] * fps);

type SetFC = React.FC<{ t: number; id?: string }>;

/** Sets with their options baked in, as SetFC. */
export const inside = (o: { mode?: 'day' | 'night' | 'dark'; fire?: number | ((t: number) => number); cows?: boolean; smoke?: number } = {}): SetFC => {
  const S: SetFC = ({ t, id }) => <Longhouse t={t} id={id} mode={o.mode} fire={typeof o.fire === 'function' ? o.fire(t) : o.fire} cows={o.cows} smoke={o.smoke} />;
  return S;
};
export const outside = (o: { tod?: Tod; door?: number; snow?: number; wind?: number; well?: boolean; houseX?: number } = {}): SetFC => {
  const S: SetFC = ({ t, id }) => <Farmyard t={t} id={id} {...o} />;
  return S;
};
export const lake = (tod: Tod = 'day'): SetFC => {
  const S: SetFC = ({ t, id }) => <Lake t={t} id={id} tod={tod} />;
  return S;
};

/** A set drawn soft, for the background of an insert or a close-up. */
export const Soft: React.FC<{ blur?: 6 | 10 | 16; children: React.ReactNode; dim?: number }> = ({ blur = 10, children, dim = 0.25 }) => (
  <g>
    <g filter={`url(#blur${blur})`}>{children}</g>
    <rect x={-600} y={-400} width={3100} height={1900} fill="#0B0816" opacity={dim} />
  </g>
);

export type Who = {
  look: Look; x: number; feet?: number; s?: number; yaw?: number; eyes?: number; faces?: [number, Expr][]; talk?: [number, number][];
  pose?: Partial<Pose>; keys?: { f: number; p: Partial<Pose> }[]; seed?: number; rim?: string; shiver?: number;
};

/** One character on a set at shot clock t: idle breathing, blinks, lips, optional pose keys and shivering. */
export const person = (c: Who, t: number, f: number, words?: Word[]) => {
  const seed = c.seed ?? Math.round(c.x) % 7;
  const s = c.s ?? 1;
  const breathe = Math.sin((t + seed * 17) / 22);
  const open = words && c.talk ? talkAt(words, f, 30, c.talk) : 0;
  const sh = c.shiver ? Math.sin(t * 2.6) * 3 * c.shiver : 0;
  const base: Pose = {
    ...basePose, x: c.x + sh, y: hipAt(c.feet ?? LH.back, s), scale: s, yaw: c.yaw ?? 0, look: c.eyes ?? Math.sign(c.yaw ?? 0) * 0.5,
    tilt: breathe * 1.2, headTilt: breathe * 1.5 + (open > 0 ? Math.sin(f / 8) * 3 : 0), armR: { a: 12 + (open > 0 ? 18 + Math.sin(f / 9) * 12 : 0), b: open > 0 ? -40 : -8 },
    armL: { a: 12, b: -8 }, ...c.pose,
  };
  const pose = c.keys ? poseAt(t, [{ f: 0, p: base }, ...c.keys.map((k) => ({ f: k.f, p: k.p, ease: easeOut }))]) : base;
  const face = faceAt(t, c.faces ?? [[0, 'neutral']]);
  return <Hero look={c.look} pose={{ ...pose, ...face, blink: Math.max(face.blink, idleBlink(t, seed)), talk: open }} rimId={c.rim ?? 'rimR'} shadow={1} />;
};

/** A scene: a set, a cast, a camera drift, and extras behind / in front of the cast. */
export const scene = (o: {
  Set: SetFC; cast?: Who[]; cam?: [number, number, number][]; words?: Word[]; back?: (t: number, len: number) => React.ReactNode;
  front?: (t: number, len: number) => React.ReactNode; setT?: number; shake?: [number, number];
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const cams = o.cam ?? [[960, 540, 1]];
    const L = Math.max(1, len);
    const keys = (k: 0 | 1 | 2) => cams.map((c, i) => [cams.length === 1 ? 0 : (i / (cams.length - 1)) * L, c[k]] as [number, number]);
    const sh = o.shake && t >= o.shake[0] && t < o.shake[0] + 10 ? Math.sin(t * 3) * o.shake[1] * (1 - (t - o.shake[0]) / 10) : 0;
    return (
      <g transform={camT(kf(t, keys(0)) + sh, kf(t, keys(1)), kf(t, keys(2)))}>
        <o.Set t={t + (o.setT ?? 60)} id="sc" />
        {o.back?.(t, len)}
        {(o.cast ?? []).map((c, i) => <g key={i}>{person(c, t, f, o.words)}</g>)}
        {o.front?.(t, len)}
      </g>
    );
  };
  return Shot;
};

/** A face close-up over a soft set, for reactions. */
export const faceCU = (o: {
  look: Look; Bg: SetFC; faces: [number, Expr][]; yaw?: number; eyes?: number; talk?: [number, number][]; words?: Word[]; zoom?: [number, number];
  side?: number; pose?: Partial<Pose>; extra?: (t: number) => React.ReactNode; light?: { x: number; y: number; kind?: 'warm' | 'cool' | 'red'; o?: number };
  dark?: number; front?: (t: number) => React.ReactNode; shiver?: number; bgCam?: [number, number, number];
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const face = faceAt(t, o.faces);
    const z = kf(t, [[0, o.zoom?.[0] ?? 3.0], [Math.max(1, len), o.zoom?.[1] ?? 3.25]]);
    const x = 960 + (o.side ?? 0) + (o.shiver ? Math.sin(t * 2.6) * 2.5 * o.shiver : 0);
    const open = o.words && o.talk ? talkAt(o.words, f, 30, o.talk) : 0;
    const pose: Pose = {
      ...basePose, x, y: 700, scale: 1, yaw: o.yaw ?? 0.3, look: o.eyes ?? -Math.sign(o.yaw ?? 0.3) * 0.4,
      headTilt: Math.sin(t / 25) * 2, ...o.pose, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, 3)), talk: open,
    };
    const bc = o.bgCam ?? [960, 560, 1.4];
    return (
      <g>
        <Soft blur={16} dim={0.15 + (o.dark ?? 0)}>
          <g transform={camT(bc[0], bc[1], bc[2])}>
            <o.Bg t={t + 120} id="fcu" />
          </g>
        </Soft>
        <g transform={camT(x, 540, z)}>
          {o.light ? <Glow x={o.light.x} y={o.light.y} r={260} kind={o.light.kind ?? 'warm'} o={o.light.o ?? 0.8} /> : null}
          <Hero look={o.look} pose={pose} shadow={0} />
          {o.extra?.(t)}
        </g>
        {o.front?.(t)}
      </g>
    );
  };
  return Shot;
};

/** An insert: props drawn in screen space over a soft set (or a surface). */
export const insert = (o: { Bg: SetFC; draw: (t: number, len: number) => React.ReactNode; dim?: number; zoom?: [number, number]; table?: string; bgCam?: [number, number, number] }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, o.zoom?.[0] ?? 1], [Math.max(1, len), o.zoom?.[1] ?? 1.06]]);
    const bc = o.bgCam ?? [960, 560, 1.6];
    return (
      <g>
        <Soft blur={16} dim={o.dim ?? 0.25}>
          <g transform={camT(bc[0], bc[1], bc[2])}>
            <o.Bg t={t + 300} id="ins" />
          </g>
        </Soft>
        <g transform={camT(960, 540, z)}>
          {o.table ? (
            <g>
              <rect x={-200} y={640} width={2400} height={700} fill={o.table} />
              <rect x={-200} y={630} width={2400} height={16} fill="#00000040" />
              {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M -200 ${700 + i * 70} L 2200 ${690 + i * 72}`} stroke="#00000022" strokeWidth={4} />)}
            </g>
          ) : null}
          {o.draw(t, len)}
        </g>
      </g>
    );
  };
  return Shot;
};

/** A big word or number popping on over a soft set (MINUS 30, 4:00 PM, 900 AD). */
export const bigWord = (o: { kicker?: string; word: string; sub?: string; color?: string; Bg?: SetFC; size?: number; bgCam?: [number, number, number] }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const pop = backOut(clamp((t - 3) / 9));
    const bc = o.bgCam ?? [960, 560, 1.2];
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.45}>
            <g transform={camT(bc[0], bc[1], bc[2])}>
              <o.Bg t={t + 500} id="bw" />
            </g>
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill="#0C0A16" />
        )}
        {o.kicker ? (
          <text x={960} y={390} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>
            {o.kicker}
          </text>
        ) : null}
        <g transform={`translate(960 600) scale(${pop})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={o.size ?? 230} fill={o.color ?? '#FFFFFF'} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">
            {o.word}
          </text>
        </g>
        {o.sub ? (
          <text x={960} y={760} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={4} fill="#F6EFE3" opacity={clamp((t - 10) / 6)}>
            {o.sub}
          </text>
        ) : null}
      </g>
    );
  };
  return Shot;
};

/** A chapter opener over a soft winter set. */
export const chapter = (o: { n: number; title: string; Bg: SetFC; bgCam?: [number, number, number] }) =>
  bigWord({ kicker: `CHAPTER ${o.n}`, word: o.title, Bg: o.Bg, size: o.title.length > 14 ? 120 : 150, color: '#F6EFE3', bgCam: o.bgCam });

// ---------------------------------------------------------------- the body temperature meter (the episode's HUD)
/** Body temperature through a chapter: [frame, °C] keys on the chapter clock; `from` the frame it appears. */
export const tempHud = (keys: [number, number][], from = 0, outside?: [number, number][], until = 1e9): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
    if (f < from || f >= until) return null;
    const v = kf(f, keys, (x) => x);
    const pop = backOut(clamp((f - from) / 8));
    const cold = v < 36.5;
    const danger = v < 35.8;
    const col = danger ? '#7FD4FF' : cold ? '#BFE6FF' : UI.live;
    const p = clamp((v - 34) / 3.5);
    const blink = danger && Math.floor(f / 10) % 2 === 0;
    return (
      <g transform={`translate(1660 92) scale(${pop})`}>
        <rect x={-150} y={-46} width={330} height={92} rx={46} fill={UI.pill} opacity={0.78} />
        <rect x={-150} y={-46} width={330} height={92} rx={46} fill="none" stroke={danger ? '#7FD4FF' : UI.text} strokeWidth={3} opacity={blink ? 1 : 0.7} />
        {/* the thermometer */}
        <g transform="translate(-110 0)">
          <rect x={-9} y={-32} width={18} height={50} rx={9} fill="none" stroke={UI.text} strokeWidth={3} />
          <rect x={-4} y={18 - 44 * p} width={8} height={44 * p} fill={col} />
          <circle cx={0} cy={24} r={13} fill={col} stroke={UI.text} strokeWidth={3} />
        </g>
        <text x={-82} y={-12} fontFamily={FONT.ui} fontSize={20} letterSpacing={3} fill={UI.text} opacity={0.75}>BODY</text>
        <text x={-82} y={28} fontFamily={FONT.ui} fontSize={44} fill={col}>{v.toFixed(1)}°C</text>
        {outside ? (
          <text x={92} y={10} fontFamily={FONT.ui} fontSize={22} fill="#BFE6FF" opacity={0.85}>{`AIR ${kf(f, outside, (x) => x).toFixed(0)}°`}</text>
        ) : null}
      </g>
    );
  };
  return Hud;
};

export const WHITE = '#F6EFE3';

/** A name tag that pops on in world coordinates (KETIL, GUDRUN, ASA). */
export const NameTag: React.FC<{ x: number; y: number; t: number; text: string; s?: number }> = ({ x, y, t, text, s = 1 }) => {
  if (t < 0) return null;
  const k = backOut(clamp(t / 7));
  const w = text.length * 30 + 70;
  return (
    <g transform={`translate(${x} ${y}) scale(${k * s})`}>
      <rect x={-w / 2} y={-38} width={w} height={68} rx={34} fill={UI.pill} opacity={0.85} />
      <rect x={-w / 2} y={-38} width={w} height={68} rx={34} fill="none" stroke={UI.live} strokeWidth={3} />
      <text y={12} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} letterSpacing={4} fill={WHITE}>{text}</text>
    </g>
  );
};

/** Screen-space caption pill (a time of day, a place). */
export const Caption: React.FC<{ t: number; text: string; y?: number }> = ({ t, text, y = 120 }) => {
  const o = clamp((t - 4) / 8);
  const w = text.length * 34 + 100;
  return (
    <g opacity={o}>
      <rect x={960 - w / 2} y={y - 50} width={w} height={96} rx={48} fill={UI.pill} opacity={0.75} />
      <text x={960} y={y + 14} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} letterSpacing={6} fill={WHITE}>{text}</text>
    </g>
  );
};

/** A seated pose (legs forward over the bench edge), facing right for yaw > 0. */
export const SIT = { legL: { a: -80, b: 82 }, legR: { a: -74, b: 86 } };
/** Feet value that puts a seated hip on the bench top. */
export const seatFeet = (s = 1) => LH.bench + 140 * s - 6;
export { FEET, LH, INK };
