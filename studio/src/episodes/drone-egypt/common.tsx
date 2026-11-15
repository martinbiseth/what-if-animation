import React from 'react';
import {
  Hero, Look, Pose, ShotProps, Word, basePose, camT, clamp, kf, lerp, rnd, joints, toWorld, talkShot, idleBlink, faceAt, Expr, talkAt, FONT, backOut,
  CastSpec, Giza, NileBank, Camp, Dunes, ThroneHall, AerialGiza, AerialNight, DroneHud, Drone, Controller, DroneView, EgTod, egyptHip, hallStand, Glow,
} from '../../engine';
import { CROWD } from './cast';

export * from './cast';
export { talkShot };

// Shared by every chapter of "What if you brought a drone to ancient Egypt?": sets with a clock, the drone's camera
// views, the shot builders (inserts, close-ups, the controller in your hands), cards and the battery HUD.

export type SetC = React.FC<{ t: number; id?: string }>;
export const GizaSet = (tod: EgTod = 'day', o: { build?: number; workers?: boolean; sledge?: boolean; scatter?: number; pyrX?: number; pyrW?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Giza t={t} id={id} tod={tod} {...o} />;
  return S;
};
export const NileSet = (tod: EgTod = 'day', o: { boat?: boolean; stuck?: boolean; boatX?: number; gold?: boolean } = {}): SetC => {
  const S: SetC = ({ t, id }) => <NileBank t={t} id={id} tod={tod} {...o} />;
  return S;
};
export const CampSet = (o: { fire?: boolean; dawn?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Camp t={t} id={id} {...o} />;
  return S;
};
export const HallSet = (o: { dim?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <ThroneHall t={t} id={id} {...o} />;
  return S;
};
export const DunesSet = (tod: EgTod = 'day', storm = 0): SetC => {
  const S: SetC = ({ t, id }) => <Dunes t={t} id={id} tod={tod} storm={storm} />;
  return S;
};

/** A pose standing on the desert floor. */
export const at = (x: number, o: Partial<Pose> = {}, scale = 1): Pose => ({ ...basePose, x, y: egyptHip(scale), scale, ...o });
/** A pose standing in the hall with feet at feetY. */
export const inHall = (x: number, feetY: number, o: Partial<Pose> = {}): Pose => {
  const h = hallStand(feetY);
  return { ...basePose, x, y: h.y, scale: h.scale, ...o };
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

export const Soft: React.FC<{ blur?: 6 | 10 | 16; children: React.ReactNode; dim?: number }> = ({ blur = 10, children, dim = 0.25 }) => (
  <g>
    <g filter={`url(#blur${blur})`}>{children}</g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={dim} />
  </g>
);

/** People of Giza standing in a row x0..x1 on the desert floor, reacting with `expr`, facing `faceTo`. */
export const crowd = (n: number, x0: number, x1: number, seed: number, o: { scale?: number; expr?: Expr; faceTo?: number; y?: number; looks?: Look[]; arms?: 'up' | 'down' | 'point' } = {}): CastSpec[] => {
  const L = o.looks ?? CROWD;
  const out: CastSpec[] = [];
  for (let i = 0; i < n; i++) {
    const sc = (o.scale ?? 1) * (0.9 + rnd(seed, i) * 0.14);
    const x = lerp(x0, x1, n > 1 ? i / (n - 1) : 0.5) + (rnd(seed + 1, i) - 0.5) * 40;
    const to = o.faceTo ?? 960;
    const up = o.arms === 'up';
    out.push({
      look: L[(i + seed) % L.length], x, y: o.y !== undefined ? o.y - (1 - sc) * 0 : egyptHip(sc), scale: sc,
      yaw: Math.max(-0.6, Math.min(0.6, (to - x) / 900)), faces: [[0, o.expr ?? 'neutral']], seed: seed * 10 + i, look_: up ? 0 : undefined,
      pose: up
        ? { armL: { a: 150 + rnd(seed + 2, i) * 20, b: 10 }, armR: { a: 150 + rnd(seed + 3, i) * 20, b: 10 }, look: 0 }
        : o.arms === 'point'
          ? { armR: { a: 120, b: 0 }, handR: 'point' }
          : { armL: { a: 10 + rnd(seed + 2, i) * 16, b: -20 }, armR: { a: 10 + rnd(seed + 3, i) * 20, b: -30 } },
    });
  }
  return out;
};

/** A thing, big, over a soft set: an insert. `draw` gets the shot clock. */
export const propCU = (o: { Bg?: SetC; bgColor?: string; draw: (t: number, len: number) => React.ReactNode; push?: number; blur?: 6 | 10 | 16; bgCam?: [number, number, number] }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, 1], [Math.max(1, len), 1 + (o.push ?? 0.06)]]);
    const [bx, by, bz] = o.bgCam ?? [960, 520, 1.3];
    return (
      <g>
        {o.Bg ? (
          <Soft blur={o.blur ?? 10} dim={0.3}>
            <g transform={camT(bx, by, bz)}>
              <o.Bg t={t + 200} id="prop" />
            </g>
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill={o.bgColor ?? '#1A1420'} />
        )}
        <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>{o.draw(t, len)}</g>
      </g>
    );
  };
  return Shot;
};

/** A big word or number on its own, popping on over a soft set. */
export const bigWord = (o: { kicker?: string; word: string; color?: string; Bg?: SetC; sub?: string; size?: number }): React.FC<ShotProps> => {
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
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={o.size ?? 230} fill={o.color ?? '#FF8A3D'} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">
            {o.word}
          </text>
        </g>
        {o.sub ? (
          <text x={960} y={760} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill="#E8E2F0" opacity={clamp((t - 10) / 8)}>
            {o.sub}
          </text>
        ) : null}
      </g>
    );
  };
  return Shot;
};

/** A character close-up: one face filling the frame over a soft set, for reactions. */
export const faceCU = (o: {
  look: Look; Bg: SetC; faces: [number, Expr][]; yaw?: number; look_?: number; talk?: [number, number]; words?: Word[];
  zoom?: [number, number]; side?: number; pose?: Partial<Pose>; extra?: (t: number) => React.ReactNode; glint?: number; front?: (t: number) => React.ReactNode; bgCam?: [number, number, number]; light?: string;
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
    const [bx, by, bz] = o.bgCam ?? [960, 520, 1.6];
    return (
      <g>
        <Soft blur={16} dim={0.15}>
          <g transform={camT(bx, by, bz)}>
            <o.Bg t={t + 120} id="fcu" />
          </g>
        </Soft>
        <g transform={camT(x, 540, z)}>
          <Hero look={o.look} pose={pose} shadow={0} />
          {o.extra?.(t)}
        </g>
        {o.light ? <rect width={1920} height={1080} fill={o.light} opacity={0.12} style={{ mixBlendMode: 'screen' }} /> : null}
        {o.front?.(t)}
      </g>
    );
  };
  return Shot;
};

/** Where a character's hand is. */
export const handAt = (pose: Pose, side: 'L' | 'R' = 'R') => toWorld(pose, (side === 'L' ? joints(pose).armL : joints(pose).armR).end);

/** The controller small in someone's hands, for wides and mediums. */
export const HeldController: React.FC<{ pose: Pose; t: number; view?: DroneView; battery?: number; s?: number; warn?: string }> = ({ pose, t, view, battery = 91, s = 0.14, warn }) => {
  const h = handAt(pose, 'R');
  return (
    <g>
      <Glow x={h.x} y={h.y - 60 * pose.scale} r={160 * pose.scale} kind="cool" o={0.35} />
      <Controller x={h.x - 40 * pose.scale} y={h.y - 10 * pose.scale} s={s * pose.scale} t={t} view={view} battery={battery} warn={warn} id={`hc${Math.round(h.x)}`} hud={false} />
    </g>
  );
};

/** Views for the controller and the drone camera, as functions of t. */
export const viewGiza = (o: { cx?: number; cy?: number; z?: [number, number]; len?: number; scatter?: (t: number) => number; night?: boolean; shortcut?: (t: number) => number; stuck?: boolean; goat?: [number, number]; mark?: [number, number]; build?: number; drift?: [number, number] } = {}): DroneView => {
  const V: DroneView = (t) => {
    const len = o.len ?? 120;
    const z = kf(t, [[0, o.z?.[0] ?? 0.7], [len, o.z?.[1] ?? 0.62]]);
    const cx = (o.cx ?? 1000) + (o.drift?.[0] ?? 0) * clamp(t / len);
    const cy = (o.cy ?? 640) + (o.drift?.[1] ?? 0) * clamp(t / len);
    return (
      <g transform={camT(cx, cy, z)}>
        <AerialGiza t={t + 300} night={o.night} scatter={o.scatter?.(t) ?? 0} shortcut={o.shortcut?.(t) ?? 0} stuck={o.stuck} goat={o.goat ?? null} mark={o.mark ?? null} build={o.build} />
      </g>
    );
  };
  return V;
};
export const viewNight = (o: { fire?: [number, number] | null; z?: [number, number]; len?: number; pan?: [number, number, number, number]; wave?: boolean; brown?: (t: number) => number } = {}): DroneView => {
  const V: DroneView = (t) => {
    const len = o.len ?? 120;
    const p = clamp(t / len);
    const [x0, y0, x1, y1] = o.pan ?? [900, 540, 1000, 540];
    const z = kf(t, [[0, o.z?.[0] ?? 1], [len, o.z?.[1] ?? 1.1]]);
    return (
      <g>
        <g transform={camT(lerp(x0, x1, p), lerp(y0, y1, p), z)}>
          <AerialNight t={t} fire={o.fire ?? null} wave={o.wave} />
        </g>
        {o.brown ? <rect width={1920} height={1080} fill="#8A6A3A" opacity={o.brown(t)} /> : null}
      </g>
    );
  };
  return V;
};

/** The drone's camera, full frame: a view with the HUD on top. */
export const povShot = (o: { view: DroneView; battery?: number | ((t: number) => number); alt?: number | ((t: number) => number); dist?: number; warn?: string | ((t: number) => string | undefined); signal?: number | ((t: number) => number); freeze?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const v = (x: unknown, d: number) => (typeof x === 'function' ? (x as (t: number) => number)(t) : (x as number) ?? d);
    const tt = o.freeze !== undefined && t > o.freeze ? o.freeze : t;
    const w = typeof o.warn === 'function' ? o.warn(t) : o.warn;
    return (
      <g>
        {o.view(tt)}
        <DroneHud t={t} battery={v(o.battery, 91)} alt={v(o.alt, 120)} dist={o.dist ?? 340} warn={w} signal={v(o.signal, 4)} />
      </g>
    );
  };
  return Shot;
};

/** The controller in your hands, big, over a soft set: the workhorse insert for what the drone sees. */
export const screenCU = (o: { view: DroneView; Bg?: SetC; battery?: number | ((t: number) => number); warn?: string | ((t: number) => string | undefined); push?: number; sticks?: (t: number) => [number, number, number, number]; s?: number; bgCam?: [number, number, number] }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, 1], [Math.max(1, len), 1 + (o.push ?? 0.05)]]);
    const bat = typeof o.battery === 'function' ? o.battery(t) : o.battery ?? 91;
    const w = typeof o.warn === 'function' ? o.warn(t) : o.warn;
    const bob = Math.sin(t / 16) * 5;
    const [bx, by, bz] = o.bgCam ?? [960, 520, 1.3];
    return (
      <g>
        {o.Bg ? (
          <Soft blur={10} dim={0.35}>
            <g transform={camT(bx, by, bz)}>
              <o.Bg t={t + 260} id="scu" />
            </g>
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill="#1A1420" />
        )}
        <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
          <Glow x={960} y={430} r={700} kind="cool" o={0.25} />
          <Controller x={960} y={800 + bob} s={o.s ?? 1.35} t={t} view={o.view} battery={bat} warn={w} sticks={o.sticks?.(t)} id="scu" />
          {/* your hands: the ink mittens on the grips, orange cuffs */}
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`translate(${960 + sd * 330} ${1010 + bob})`}>
              <path d={`M ${sd * 40} 40 L ${sd * 140} 260`} stroke="#F07A2A" strokeWidth={130} strokeLinecap="round" />
              <ellipse cx={0} cy={0} rx={70} ry={90} fill="#26232F" stroke="#100E16" strokeWidth={8} />
              <ellipse cx={-sd * 50} cy={-50} rx={26} ry={40} transform={`rotate(${sd * 30} ${-sd * 50} -50)`} fill="#26232F" stroke="#100E16" strokeWidth={7} />
            </g>
          ))}
        </g>
      </g>
    );
  };
  return Shot;
};

/** The drone in the air over a set, framed close: hovering, banking, its shadow on the sand. */
export const droneShot = (o: { Bg: SetC; cam?: [number, number, number]; cam2?: [number, number, number]; x?: (t: number) => number; y?: (t: number) => number; s?: number; tilt?: (t: number) => number; on?: boolean; dust?: boolean; extra?: (t: number) => React.ReactNode }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const [cx0, cy0, z0] = o.cam ?? [960, 540, 1];
    const [cx1, cy1, z1] = o.cam2 ?? [cx0, cy0, z0];
    const L = Math.max(1, len);
    return (
      <g transform={camT(kf(t, [[0, cx0], [L, cx1]]), kf(t, [[0, cy0], [L, cy1]]), kf(t, [[0, z0], [L, z1]]))}>
        <o.Bg t={t + 100} id="dr" />
        {o.extra?.(t)}
        <Drone x={o.x ? o.x(t) : 960} y={o.y ? o.y(t) : 420} s={o.s ?? 0.6} t={t} tilt={o.tilt ? o.tilt(t) : 0} on={o.on ?? true} dust={o.dust} />
      </g>
    );
  };
  return Shot;
};

/** A chapter opener over Giza: kicker, title, a slow push. */
export const egCard = (o: { kicker: string; title: string; tod?: EgTod }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t, len }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    const z = kf(t, [[0, 1], [Math.max(len, 1), 1.06]]);
    return (
      <g>
        <g transform={camT(1100, 420, z)}>
          <Giza t={t + 400} id="card" tod={o.tod ?? 'dusk'} sledge={false} />
        </g>
        <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.42} />
        <g transform={`translate(960 420) scale(${pop(1)})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill="#FFB15A">{o.kicker}</text>
        </g>
        <g transform={`translate(960 545) scale(${pop(3)})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={o.title.length > 18 ? 100 : 124} fill="#F6EFE3" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">{o.title}</text>
        </g>
      </g>
    );
  };
  return Card;
};

/** The battery chip, top right: three cells, each with its charge. Hidden on chapter cards (before hideUntil). */
export const battHud = (levels: number[] | ((f: number) => number[]), hideUntil = 20): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
    if (f < hideUntil) return null;
    const lv = typeof levels === 'function' ? levels(f) : levels;
    const pop = clamp((f - hideUntil) / 8);
    return (
      <g transform="translate(1520 60)" opacity={pop}>
        <rect x={0} y={0} width={340} height={86} rx={43} fill="#0B0816" opacity={0.65} />
        {lv.map((l, k) => (
          <g key={k} transform={`translate(${38 + k * 98} 24)`}>
            <rect x={0} y={0} width={74} height={38} rx={7} fill="none" stroke="#F6EFE3" strokeWidth={4} />
            <rect x={74} y={11} width={6} height={16} fill="#F6EFE3" />
            <rect x={5} y={5} width={64 * clamp(l)} height={28} rx={4} fill={l <= 0.2 ? '#FF4A3A' : l < 0.6 ? '#FFC23A' : '#5BE08A'} />
          </g>
        ))}
      </g>
    );
  };
  return Hud;
};
