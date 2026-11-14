import React from 'react';
import {
  BatteryHud, CastSpec, Smartphone, Hero, LOOKS, Look, Pose, PhoneInHand, ScreenMode, ShotProps, Street26, street26Hip, Word, basePose,
  camT, clamp, kf, lerp, rnd, joints, toWorld, talkShot, idleBlink, faceAt, Expr, talkAt, FONT, backOut,
} from '../../engine';

// Shared by every chapter of "What if you had an iPhone 100 years ago?": the cast, the battery HUD (the episode's
// clock), word spans for lip sync, and the shot builders most of the 100-odd shots are made from.

export const L = LOOKS;
export const YOU = LOOKS.you;

/** The battery HUD for a chapter: falls from `from` to `to` across it, pulses in the last 3 s (the "N percent" button). */
export const batteryHud = (from: number, to: number, hideUntil = 20): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f, total }) => {
    if (f < hideUntil) return null;
    const p = lerp(from, to, clamp(f / Math.max(1, total - 75)));
    return <BatteryHud p={p} t={f - hideUntil} pulse={f > total - 90} />;
  };
  return Hud;
};

/** Seconds from the start of word `a` (its nth occurrence) to the end of word `b` after it: a character's line. */
export const span = (words: Word[], a: string, b: string, nth = 1): [number, number] => {
  const n = (w: string) => w.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '').replace(/^'+|'+$/g, '');
  let seen = 0;
  const i = words.findIndex((w) => n(w.w) === n(a) && ++seen === nth);
  if (i < 0) return [0, 0];
  const j = words.findIndex((w, k) => k >= i && n(w.w) === n(b));
  return [words[i].s, words[j >= 0 ? j : i].e + 0.05];
};

/** A set drawn soft, for the background of an insert. */
export const Soft: React.FC<{ blur?: 6 | 10 | 16; children: React.ReactNode; dim?: number }> = ({ blur = 10, children, dim = 0.25 }) => (
  <g>
    <g filter={`url(#blur${blur})`}>{children}</g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={dim} />
  </g>
);

/** The street at dusk (or `night`), offset so its idle motion carries across cuts. */
export const StreetSet = (o: { night?: boolean; cars?: boolean } = {}) => {
  const S: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Street26 t={t} id={id} night={o.night} cars={o.cars} />;
  return S;
};

/** A crowd on the sidewalk: n extras in period costume, spread along x0..x1, reacting with `expr`. */
export const crowd = (n: number, x0: number, x1: number, seed: number, o: { scale?: number; expr?: Expr; faceTo?: number; y?: number; skip?: number[] } = {}): CastSpec[] => {
  const looks: Look[] = [L.gent, L.lady, L.worker, L.gent, L.lady, L.worker, L.mom26, L.doctor];
  const out: CastSpec[] = [];
  for (let i = 0; i < n; i++) {
    if (o.skip?.includes(i)) continue;
    const sc = (o.scale ?? 1) * (0.92 + rnd(seed, i) * 0.12);
    const x = lerp(x0, x1, n > 1 ? i / (n - 1) : 0.5) + (rnd(seed + 1, i) - 0.5) * 40;
    const to = o.faceTo ?? 960;
    out.push({
      look: looks[(i + seed) % looks.length], x, y: (o.y ?? street26Hip(1)) + (1 - sc) * 0, scale: sc,
      yaw: Math.max(-0.6, Math.min(0.6, (to - x) / 900)), faces: [[0, o.expr ?? 'shock']], seed: seed * 10 + i,
      pose: { armL: { a: 14 + rnd(seed + 2, i) * 20, b: -20 }, armR: { a: 14 + rnd(seed + 3, i) * 30, b: -30 } },
    });
  }
  return out;
};

/**
 * The phone held up to camera over a soft background (a set, or a colour): the workhorse insert. The screen's clock
 * is the shot's t, so spinners and waveforms run; `battery` is what the status bar and battery screen show.
 */
export const phoneCU = (o: {
  mode: ScreenMode; battery: number; text?: string; bars?: number; Bg?: React.FC<{ t: number; id?: string }>; bgColor?: string;
  from?: 'left' | 'right'; x?: number; y?: number; s?: number; rot?: number; push?: number; buzz?: (t: number) => number; modeAt?: [number, ScreenMode][];
  textAt?: [number, string][]; batteryAt?: [number, number][];
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, 1], [Math.max(1, len), 1 + (o.push ?? 0.06)]]);
    const mode = o.modeAt ? [...o.modeAt].reverse().find(([f]) => t >= f)?.[1] ?? o.mode : o.mode;
    const text = o.textAt ? [...o.textAt].reverse().find(([f]) => t >= f)?.[1] ?? o.text : o.text;
    const battery = o.batteryAt ? Math.round(kf(t, o.batteryAt)) : o.battery;
    const bob = Math.sin(t / 14) * 6;
    return (
      <g>
        {o.Bg ? (
          <Soft>
            <g transform={camT(960, 520, 1.25)}>
              <o.Bg t={t + 300} id="pcu" />
            </g>
          </Soft>
        ) : (
          <rect x={0} y={0} width={1920} height={1080} fill={o.bgColor ?? '#1A1420'} />
        )}
        <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
          <PhoneInHand x={o.x ?? 960} y={(o.y ?? 520) + bob} s={o.s ?? 1.25} rot={o.rot ?? (o.from === 'left' ? 4 : -4)} from={o.from ?? 'right'} mode={mode} t={t} battery={battery} text={text} bars={o.bars} buzz={o.buzz ? o.buzz(t) : 0} />
        </g>
      </g>
    );
  };
  return Shot;
};

/** A big word or number on its own (a date, a year), popping on over a dark ground with a soft glow. */
export const bigWord = (o: { kicker?: string; word: string; color?: string; Bg?: React.FC<{ t: number; id?: string }> }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const pop = backOut(clamp((t - 3) / 9));
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.5}>
            <o.Bg t={t + 500} id="bw" />
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill="#120C18" />
        )}
        {o.kicker ? (
          <text x={960} y={400} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>
            {o.kicker}
          </text>
        ) : null}
        <g transform={`translate(960 600) scale(${pop})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={230} fill={o.color ?? '#FF8A3D'} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">
            {o.word}
          </text>
        </g>
      </g>
    );
  };
  return Shot;
};

/** A character close-up: one face filling the frame over a soft set, for reactions. */
export const faceCU = (o: {
  look: Look; Bg: React.FC<{ t: number; id?: string }>; faces: [number, Expr][]; yaw?: number; look_?: number; talk?: [number, number]; words?: Word[];
  zoom?: [number, number]; side?: number; pose?: Partial<Pose>; extra?: (t: number) => React.ReactNode; glint?: number;
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const face = faceAt(t, o.faces);
    const z = kf(t, [[0, o.zoom?.[0] ?? 3.2], [Math.max(1, len), o.zoom?.[1] ?? 3.45]]);
    const x = 960 + (o.side ?? 0);
    const open = o.words && o.talk ? talkAt(o.words, f, 30, [o.talk]) : 0;
    const pose: Pose = {
      ...basePose, x, y: 700, scale: 1, yaw: o.yaw ?? 0.3, look: o.look_ ?? -Math.sign(o.yaw ?? 0.3) * 0.4,
      headTilt: Math.sin(t / 25) * 2, ...o.pose, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, 3)), talk: open, glint: o.glint,
    };
    return (
      <g>
        <Soft blur={16} dim={0.15}>
          <g transform={camT(960, 520, 1.6)}>
            <o.Bg t={t + 120} id="fcu" />
          </g>
        </Soft>
        <g transform={camT(x, 540, z)}>
          <Hero look={o.look} pose={pose} shadow={0} />
          {o.extra?.(t)}
        </g>
      </g>
    );
  };
  return Shot;
};

export { talkShot };

/** Where a character's hand is (left or right), to put the phone in it. */
export const handAt = (pose: Pose, side: 'L' | 'R' = 'R') => toWorld(pose, (side === 'L' ? joints(pose).armL : joints(pose).armR).end);

/** The phone in a character's hand, small, glowing: for wides and mediums. */
export const HeldPhone: React.FC<{ pose: Pose; side?: 'L' | 'R'; mode?: ScreenMode; t: number; battery: number; s?: number; glow?: number; rot?: number }> = ({ pose, side = 'R', mode = 'home', t, battery, s = 0.13, glow = 1.2, rot = 0 }) => {
  const h = handAt(pose, side);
  return <Smartphone x={h.x} y={h.y - 30 * pose.scale} s={s * pose.scale} rot={rot} mode={mode} t={t} battery={battery} glow={glow} status={false} />;
};
