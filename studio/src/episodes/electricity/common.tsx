import React from 'react';
import {
  Hero, LOOKS, Look, Pose, ShotProps, Word, basePose, camT, clamp, kf, backOut, faceAt, idleBlink, talkAt, Expr, FONT, Glow, joints, toWorld, rnd,
} from '../../engine';
import { GameScreen, Candle } from './sets';

// Shared by every chapter of "What if electricity disappeared forever?": the cast, word spans for lip sync, and the
// shot builders most of the shots are made from.

export const L = LOOKS;
export const YOU = LOOKS.you;
export const ELLIE = LOOKS.ellie;
export const MOM = LOOKS.mom26;
/** Mo, your best friend in the present: the ink cast's curls and headphones, a green bomber jacket. */
export const MO: Look = { ...LOOKS.mo26, jacket: '#4E7A4A', jacketShade: '#3E6238', accent: '#E9C46A', limb: '#3B3646', shoe: '#E9E2D2', noPhones: false, hat: undefined };
/** The man across the street: a grey work jacket and a flat cap. */
export const NEIGHBOR: Look = { ...LOOKS.worker, jacket: '#5E5A4E', jacketShade: '#4A473E', accent: '#9A8A6A', hat: 'cap', hatColor: '#3A3832' };
export const DOCTOR = LOOKS.doctor;

/** Seconds from the start of word `a` (its nth occurrence) to the end of word `b` after it: a character's line. */
export const span = (words: Word[], a: string, b: string, nth = 1): [number, number] => {
  const n = (w: string) => w.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '').replace(/^'+|'+$/g, '');
  let seen = 0;
  const i = words.findIndex((w) => n(w.w) === n(a) && ++seen === nth);
  if (i < 0) return [0, 0];
  const j = words.findIndex((w, k) => k >= i && n(w.w) === n(b));
  return [words[i].s, words[j >= 0 ? j : i].e + 0.05];
};
/** The frame (on the chapter's clock) where word `a` (nth occurrence) starts. */
export const wordF = (words: Word[], a: string, nth = 1, fps = 30) => Math.round(span(words, a, a, nth)[0] * fps);

/** A set drawn soft, for the background of an insert or a close-up. */
export const Soft: React.FC<{ blur?: 6 | 10 | 16; children: React.ReactNode; dim?: number }> = ({ blur = 10, children, dim = 0.25 }) => (
  <g>
    <g filter={`url(#blur${blur})`}>{children}</g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={dim} />
  </g>
);

type SetFC = React.FC<{ t: number; id?: string }>;

/** A character close-up: one face filling the frame over a soft set, for reactions. `light` adds a glow on the face. */
export const faceCU = (o: {
  look: Look; Bg: SetFC; faces: [number, Expr][]; yaw?: number; eyes?: number; talk?: [number, number]; words?: Word[];
  zoom?: [number, number]; side?: number; pose?: Partial<Pose>; extra?: (t: number) => React.ReactNode; glint?: number; glintColor?: string;
  light?: { x: number; y: number; kind?: 'warm' | 'cool' | 'red'; o?: number }; dark?: number; front?: (t: number) => React.ReactNode;
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const face = faceAt(t, o.faces);
    const z = kf(t, [[0, o.zoom?.[0] ?? 3.2], [Math.max(1, len), o.zoom?.[1] ?? 3.45]]);
    const x = 960 + (o.side ?? 0);
    const open = o.words && o.talk ? talkAt(o.words, f, 30, [o.talk]) : 0;
    const pose: Pose = {
      ...basePose, x, y: 700, scale: 1, yaw: o.yaw ?? 0.3, look: o.eyes ?? -Math.sign(o.yaw ?? 0.3) * 0.4,
      headTilt: Math.sin(t / 25) * 2, ...o.pose, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, 3)), talk: open, glint: o.glint, glintColor: o.glintColor,
    };
    return (
      <g>
        <Soft blur={16} dim={0.15 + (o.dark ?? 0)}>
          <g transform={camT(960, 520, 1.6)}>
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

/** A big word or number on its own (DAY 2, 8:14 PM), popping on over a dark ground or a soft set. */
export const bigWord = (o: { kicker?: string; word: string; color?: string; Bg?: SetFC; size?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const pop = backOut(clamp((t - 3) / 9));
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.5}>
            <o.Bg t={t + 500} id="bw" />
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill="#0C0A16" />
        )}
        {o.kicker ? (
          <text x={960} y={400} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>
            {o.kicker}
          </text>
        ) : null}
        <g transform={`translate(960 600) scale(${pop})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={o.size ?? 230} fill={o.color ?? '#FFD23A'} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">
            {o.word}
          </text>
        </g>
      </g>
    );
  };
  return Shot;
};

/** A handheld games console held in two hands (orange sleeves from below), the game on its screen. */
export const Handheld: React.FC<{ x: number; y: number; s?: number; t: number; on: number; rot?: number; glitch?: number }> = ({ x, y, s = 1, t, on, rot = 0, glitch = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {on > 0 ? <Glow x={0} y={0} r={520} kind="cool" o={0.55 * on} /> : null}
    {[-1, 1].map((sd) => (
      <path key={sd} d={`M ${sd * 300} 600 Q ${sd * 330} 300 ${sd * 300} 120 L ${sd * 200} 160 Q ${sd * 210} 380 ${sd * 160} 600 Z`} fill="#F07A2A" stroke="#100E16" strokeWidth={8} />
    ))}
    <rect x={-430} y={-170} width={860} height={340} rx={150} fill="#2A2834" stroke="#100E16" strokeWidth={10} />
    <rect x={-430} y={-170} width={170} height={340} rx={80} fill="#E8252A" stroke="#100E16" strokeWidth={8} />
    <rect x={260} y={-170} width={170} height={340} rx={80} fill="#3A8AE0" stroke="#100E16" strokeWidth={8} />
    <circle cx={-345} cy={-50} r={34} fill="#1E1C26" stroke="#100E16" strokeWidth={6} />
    {[[330, -70], [380, -20], [330, 30], [280, -20]].map(([bx, by], i) => (
      <circle key={i} cx={bx} cy={by} r={18} fill="#1E1C26" stroke="#100E16" strokeWidth={5} />
    ))}
    <GameScreen x={-240} y={-140} w={480} h={280} t={t} on={on} glitch={glitch} />
    {[-1, 1].map((sd) => (
      <ellipse key={`h${sd}`} cx={sd * 300} cy={130} rx={110} ry={90} fill="#26232F" stroke="#100E16" strokeWidth={8} />
    ))}
    {[-1, 1].map((sd) => (
      <ellipse key={`th${sd}`} cx={sd * 330} cy={sd < 0 ? -40 : -20} rx={46} ry={34} fill="#26232F" stroke="#100E16" strokeWidth={7} />
    ))}
  </g>
);

/** Where a character's hand is (left or right). */
export const handAt = (pose: Pose, side: 'L' | 'R' = 'R') => toWorld(pose, (side === 'L' ? joints(pose).armL : joints(pose).armR).end);

/** A candle held in a character's hand. */
export const HeldCandle: React.FC<{ pose: Pose; side?: 'L' | 'R'; t: number; s?: number }> = ({ pose, side = 'R', t, s = 0.55 }) => {
  const h = handAt(pose, side);
  return <Candle x={h.x} y={h.y - 4 * pose.scale} s={s * pose.scale} t={t} seed={3} />;
};

/** A dark ground with a faint vignette, for inserts that happen in the blackout. */
export const DarkBg: SetFC = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0A14" />
    {Array.from({ length: 30 }).map((_, i) => (
      <circle key={i} cx={rnd(3, i) * 1920} cy={rnd(4, i) * 1080} r={1 + rnd(5, i) * 2} fill="#3A3A5A" opacity={0.3 + 0.2 * Math.sin(t / 20 + i)} />
    ))}
  </g>
);
