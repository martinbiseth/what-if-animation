import React from 'react';
import {
  Hero, LOOKS, Look, Pose, ShotProps, Word, basePose, camT, clamp, kf, lerp, rnd, idleBlink, faceAt, Expr, talkAt, FONT, backOut, walkPose, LEG_LEN, joints,
  toWorld, Suburb, Tod, Kitchen, Bedroom, Classroom, Shop, SHOP, SUBURB, suburbHip, Rooftop, CitySkyline, DaySky, Glow, ModernCar,
  Downtown, Subway, Mall, Bridge, TOWN, SUB, MALL, BRIDGE, hipOn,
} from '../../engine';

// Shared by every chapter of "What if everyone disappeared except you?": the cast, the sets as clocked components
// (always empty of people), word helpers for lip sync and cueing inside a shot, the shot builders, and the episode's
// own props: Noodle the dog, the walkie-talkie, the stopped bus, the tree house, the day chip and the 3:07 clock.

const noHat = (l: Look): Look => ({ ...l, hat: undefined, hatColor: undefined, noPhones: undefined });

export const YOU = LOOKS.you;
export const ELLIE = LOOKS.ellie;
export const MUM: Look = { ...LOOKS.mom26, jacket: '#8A5A8A', jacketShade: '#704870' };
export const MO: Look = { ...noHat(LOOKS.mo26), jacket: '#4E7A4A', jacketShade: '#3E6238', accent: '#E9C46A', shoe: '#E8504A' };
export const SUIT: Look = { ...LOOKS.suit26 };
export const ROBE: Look = { ...LOOKS.you, jacket: '#F4F0E6', jacketShade: '#D8D0C0', accent: '#C8C0B0', extra: undefined };

export const EG = { gold: '#F2C14E', red: '#E8453A', night: '#0C1024', dust: '#B8A88A', torch: '#FFE7A8' };

// ---------------------------------------------------------------- sets with a clock
export type SetC = React.FC<{ t: number; id?: string }>;
const Dim: React.FC<{ k: number; c?: string }> = ({ k, c = '#0A0A26' }) => (k > 0 ? <rect x={-600} y={-600} width={3200} height={2300} fill={c} opacity={k} /> : null);
/** Downtown with nobody in it: cars stopped where they were, doors open, a shop light still on. */
export const TownSet = (tod: Tod = 'day', o: { lit?: number; dark?: number; bus?: boolean; dust?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => (
    <g>
      <Downtown t={t} id={id} tod={tod} cars={false} lit={o.lit} />
      <StoppedCar x={o.bus ? 240 : 760} y={TOWN.kerb + 110} s={0.9} color="#E8A83A" door />
      {o.bus ? <CityBus x={1500} y={TOWN.kerb + 150} s={0.95} t={t} doors={1} /> : <StoppedCar x={1700} y={TOWN.kerb + 110} s={0.9} color="#4A7AB8" flip />}
      {o.dust ? <Leaves t={t} k={o.dust} /> : null}
      <Dim k={o.dark ?? 0} />
    </g>
  );
  return S;
};
export const HomeSet = (tod: Tod = 'morning', o: { lit?: number; dark?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => (
    <g>
      <Suburb t={t} id={id} tod={tod} cars={false} windowsLit={o.lit} />
      <StoppedCar x={1500} y={SUBURB.kerb + 110} s={0.9} color="#C83A3A" door />
      <Dim k={o.dark ?? 0} />
    </g>
  );
  return S;
};
export const KitchenSet = (o: { veil?: number; dark?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => (
    <g>
      <Kitchen t={t} id={id} veil={o.veil ?? 0.15} />
      <Dim k={o.dark ?? 0} />
    </g>
  );
  return S;
};
export const BedroomSet = (o: { veil?: number; clock?: string; lamp?: number; dark?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => (
    <g>
      <Bedroom t={t} id={id} veil={o.veil ?? 0.2} clock={o.clock ?? '07:12'} lamp={o.lamp ?? 0} crossed={0} />
      <Dim k={o.dark ?? 0} />
    </g>
  );
  return S;
};
export const ClassSet = (board?: React.ReactNode): SetC => {
  const S: SetC = ({ t, id }) => <Classroom t={t} id={id} board={board} empty />;
  return S;
};
export const ShopSet = (o: { empty?: number; rot?: number; dark?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => (
    <g>
      <Shop t={t} id={id} terminal="idle" empty={o.empty} />
      {o.rot ? <Stink t={t} k={o.rot} x0={-200} x1={1400} y={500} /> : null}
      <Dim k={o.dark ?? 0} />
    </g>
  );
  return S;
};
export const MallSet = (o: { dark?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => (
    <g>
      <Mall t={t} id={id} />
      <Dim k={o.dark ?? 0} />
    </g>
  );
  return S;
};
export const SubSet = (o: { water?: number; dark?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => (
    <g>
      <Subway t={t} id={id} gates />
      <Dim k={o.dark ?? 0} c="#06101C" />
      {o.water ? <Water t={t} top={SUB.feet + 120 - o.water * 520} /> : null}
    </g>
  );
  return S;
};
/** The roof of the hotel at dusk; `blackout` 0..1 sweeps the city dark, `night` darkens the sky. */
export const RoofSet = (o: { blackout?: number; night?: number; lit?: number; low?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => (
    <g>
      <Rooftop t={t} sunY={700} cityLit={o.lit ?? 2.5} blackout={o.blackout ?? 0} low={o.low ?? 0} />
      <Dim k={o.night ?? 0} c="#060A1E" />
    </g>
  );
  return S;
};
/** Night over the river: the far bank's skyline, every window dark but one (`one` 0..1). */
export const RiverSet = (o: { one?: number; moon?: boolean; dawn?: number } = {}): SetC => {
  const S: SetC = ({ t, id = 'riv' }) => <River t={t} id={id} one={o.one ?? 0} moon={o.moon ?? true} dawn={o.dawn ?? 0} />;
  return S;
};
export const BridgeSet = (o: { dawn?: number; dark?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => (
    <g>
      <Bridge t={t} id={id} block={0} lit={0} />
      {o.dawn ? <rect x={-600} y={-600} width={3200} height={1300} fill="#F29A6A" opacity={0.22 * o.dawn} /> : null}
      <Dim k={o.dark ?? 0} />
    </g>
  );
  return S;
};

// floors
export const HIP = {
  town: (s = 1) => hipOn(TOWN.feet, s), home: (s = 1) => suburbHip(s), sub: (s = 1) => hipOn(SUB.feet, s), mall: (s = 1) => hipOn(MALL.feet, s),
  bridge: (s = 1) => hipOn(BRIDGE.feet, s), shop: (s = 1) => hipOn(SHOP.feet, s), roof: (s = 1) => hipOn(860, s),
};
export const FEET = { town: TOWN.feet, home: SUBURB.feet, sub: SUB.feet, mall: MALL.feet, bridge: BRIDGE.feet, shop: SHOP.feet, roof: 860 };

// ---------------------------------------------------------------- words
const norm = (w: string) => w.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '').replace(/^'+|'+$/g, '');
export const wordAt = (words: Word[], w: string, nth = 1): number => {
  let seen = 0;
  const i = words.findIndex((x) => norm(x.w) === norm(w) && ++seen === nth);
  return i < 0 ? 0 : words[i].s;
};
/** The shot-clock frame of a word: use inside a shot as cueAt(words, f, t, 'run'). */
export const cueAt = (words: Word[], f: number, t: number, w: string, nth = 1) => {
  const start = (f - t) / 30 - 0.3;
  let seen = 0;
  const x = words.find((x) => x.s >= start && norm(x.w) === norm(w) && ++seen === nth);
  return x ? x.s * 30 - (f - t) : 9999;
};
/** Seconds from word a to the end of word b after it: a character's line. */
export const span = (words: Word[], a: string, b: string, nth = 1): [number, number] => {
  let seen = 0;
  const i = words.findIndex((w) => norm(w.w) === norm(a) && ++seen === nth);
  if (i < 0) return [0, 0];
  const j = words.findIndex((w, k) => k >= i && norm(w.w) === norm(b));
  return [words[i].s, words[j >= 0 ? j : i].e + 0.05];
};

// ---------------------------------------------------------------- people
export type Who = {
  look: Look; pose: Partial<Pose> | ((t: number) => Partial<Pose>); faces?: [number, Expr][]; seed?: number;
  talk?: [number, number][]; hide?: (t: number) => boolean; floor?: number;
};
export const people = (t: number, list: Who[], f = 0, words?: Word[]) =>
  list.map((w, i) => {
    if (w.hide?.(t)) return null;
    const p0 = typeof w.pose === 'function' ? w.pose(t) : w.pose;
    const face = faceAt(t, w.faces ?? [[0, (p0.expr as Expr) ?? 'neutral']]);
    const open = words && w.talk ? talkAt(words, f, 30, w.talk) : 0;
    const pose: Pose = { ...basePose, ...p0, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, w.seed ?? i + 1)), talk: open, headTilt: (p0.headTilt ?? 0) + Math.sin((t + i * 30) / 24) * 1.5 + (open ? Math.sin(f / 7) * 2 : 0) };
    return (
      <g key={i}>
        {w.floor !== undefined ? <ellipse cx={pose.x} cy={w.floor} rx={110 * pose.scale} ry={16 * pose.scale} fill="#000" opacity={0.28} /> : null}
        <Hero look={w.look} pose={pose} shadow={w.floor !== undefined ? 0 : undefined} />
      </g>
    );
  });

export const walk = (t: number, a: number, b: number, f0: number, f1: number, feet: number, scale = 1, extra: Partial<Pose> = {}): Partial<Pose> => {
  const k = clamp((t - f0) / Math.max(1, f1 - f0));
  const x = lerp(a, b, k);
  const dir = (b >= a ? 1 : -1) as 1 | -1;
  if (t <= f0 || t >= f1) return { x, y: feet - LEG_LEN * scale, scale, yaw: 0.5 * dir, ...extra };
  return { ...walkPose(x, Math.abs(x - a) / (34 * scale), feet, scale, {}, dir), ...extra, x };
};
export const run = (t: number, a: number, b: number, f0: number, f1: number, feet: number, scale = 1, extra: Partial<Pose> = {}): Partial<Pose> => {
  const k = clamp((t - f0) / Math.max(1, f1 - f0));
  const x = lerp(a, b, k);
  const dir = (b >= a ? 1 : -1) as 1 | -1;
  const ph = Math.abs(x - a) / (30 * scale) + t * 0.05;
  const s = Math.sin(ph);
  return {
    x, y: feet - LEG_LEN * scale - Math.abs(Math.cos(ph)) * 14 * scale, scale, yaw: dir, facing: dir, tilt: 12 * dir,
    legL: { a: 46 * s, b: -Math.max(0, 70 * Math.sin(ph + 1.2)) }, legR: { a: -46 * s, b: -Math.max(0, 70 * Math.sin(ph + 1.2 + Math.PI)) },
    armL: { a: -50 * s, b: 70 }, armR: { a: 50 * s, b: 70 }, ...extra,
  };
};
export const plant = (p: Partial<Pose>, feet: number): Partial<Pose> => {
  const full: Pose = { ...basePose, ...p };
  const j = joints({ ...full, x: 0, y: 0, scale: 1 });
  const low = Math.max(j.legL.end.y, j.legR.end.y) + 14;
  return { ...p, y: feet - low * full.scale };
};
/** Sitting on the floor in profile, knees up. */
export const sitFloor = (x: number, feet: number, dir: 1 | -1 = 1, scale = 1, extra: Partial<Pose> = {}): Partial<Pose> =>
  plant({ x, scale, yaw: dir, facing: dir, legL: { a: 75, b: -120 }, legR: { a: 65, b: -110 }, armR: { a: 40, b: -40 }, armL: { a: 30, b: -30 }, ...extra }, feet);
/** Seated on a chair or a ledge in profile (hips at `seat`). */
export const sit = (x: number, seat: number, dir: 1 | -1 = 1, scale = 1, extra: Partial<Pose> = {}): Partial<Pose> => ({
  x, y: seat - 8 * scale, scale, yaw: dir, facing: dir, legL: { a: 80, b: -80 }, legR: { a: 74, b: -86 }, armR: { a: 30, b: -40 }, armL: { a: 24, b: -30 }, ...extra,
});

// ---------------------------------------------------------------- the scene builder
export type Cam = [number, number, number, number][];
const camAt = (t: number, len: number, cam: { from: [number, number, number]; to?: [number, number, number] } | Cam) => {
  if (Array.isArray(cam)) {
    const k = (i: number) => cam.map((c) => [c[0] < 0 ? len + c[0] : c[0], c[i]] as [number, number]);
    return camT(kf(t, k(1)), kf(t, k(2)), kf(t, k(3)));
  }
  const [x0, y0, z0] = cam.from;
  const [x1, y1, z1] = cam.to ?? cam.from;
  const L = Math.max(1, len);
  return camT(kf(t, [[0, x0], [L, x1]]), kf(t, [[0, y0], [L, y1]]), kf(t, [[0, z0], [L, z1]]));
};
export const scene = (o: {
  Set: SetC; setT?: number; id?: string; cam: { from: [number, number, number]; to?: [number, number, number] } | Cam;
  cast?: Who[] | ((t: number, f: number) => Who[]); words?: Word[];
  back?: (t: number, len: number, f: number) => React.ReactNode; front?: (t: number, len: number, f: number) => React.ReactNode;
  over?: (t: number, len: number, f: number) => React.ReactNode; shake?: number; day?: number | string;
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const cast = typeof o.cast === 'function' ? o.cast(t, f) : o.cast ?? [];
    const sh = o.shake ? Math.sin(t * 2.7) * o.shake : 0;
    return (
      <g>
        <g transform={`translate(${sh} ${sh * 0.6}) ${camAt(t, len, o.cam)}`}>
          <o.Set t={t + (o.setT ?? 60)} id={o.id ?? 'sc'} />
          {o.back?.(t, len, f)}
          {people(t, cast, f, o.words)}
          {o.front?.(t, len, f)}
        </g>
        {o.over?.(t, len, f)}
        {o.day !== undefined ? <DayChip t={t} day={o.day} /> : null}
      </g>
    );
  };
  return Shot;
};

export const Soft: React.FC<{ blur?: 6 | 10 | 16; children: React.ReactNode; dim?: number }> = ({ blur = 10, children, dim = 0.25 }) => (
  <g>
    <g filter={`url(#blur${blur})`}>{children}</g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={dim} />
  </g>
);

/** One face filling the frame over a soft set, for reactions. */
export const faceCU = (o: {
  look: Look; Bg: SetC; faces: [number, Expr][]; yaw?: number; talk?: [number, number][]; words?: Word[]; zoom?: [number, number]; side?: number;
  pose?: Partial<Pose>; extra?: (t: number, len: number, f: number) => React.ReactNode; over?: (t: number, len: number, f: number) => React.ReactNode; look_?: number; shake?: number; day?: number | string; torch?: number; dim?: number;
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const face = faceAt(t, o.faces);
    const z = kf(t, [[0, o.zoom?.[0] ?? 3.0], [Math.max(1, len), o.zoom?.[1] ?? 3.25]]);
    const x = 960 + (o.side ?? 0);
    const open = o.words && o.talk ? talkAt(o.words, f, 30, o.talk) : 0;
    const sh = o.shake ? Math.sin(t * 2.7) * o.shake * clamp(1 - t / 20) : 0;
    const pose: Pose = {
      ...basePose, x, y: 720, scale: 1, yaw: o.yaw ?? 0.3, look: o.look_ ?? -Math.sign(o.yaw ?? 0.3) * 0.4,
      headTilt: Math.sin(t / 25) * 2, ...o.pose, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, 3)), talk: open,
    };
    return (
      <g>
        <Soft blur={16} dim={o.dim ?? 0.15}>
          <g transform={camT(960, 520, 1.6)}>
            <o.Bg t={t + 120} id="fcu" />
          </g>
        </Soft>
        <g transform={`translate(${sh} 0) ${camT(x, 520, z)}`}>
          <Hero look={o.look} pose={pose} shadow={0} />
          {o.extra?.(t, len, f)}
        </g>
        {o.torch ? <rect width={1920} height={1080} fill="#06070F" opacity={0.25 * o.torch} /> : null}
        {o.over?.(t, len, f)}
        {o.day !== undefined ? <DayChip t={t} day={o.day} /> : null}
      </g>
    );
  };
  return Shot;
};

/** A thing held up close over a soft set: the insert. */
export const insert = (o: { Bg?: SetC; bgColor?: string; push?: number; draw: (t: number, len: number, f: number) => React.ReactNode; dim?: number; day?: number | string; over?: (t: number, len: number, f: number) => React.ReactNode }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const z = kf(t, [[0, 1], [Math.max(1, len), 1 + (o.push ?? 0.06)]]);
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={o.dim ?? 0.35}>
            <g transform={camT(960, 520, 1.3)}>
              <o.Bg t={t + 200} id="ins" />
            </g>
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill={o.bgColor ?? '#1A1420'} />
        )}
        <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>{o.draw(t, len, f)}</g>
        {o.over?.(t, len, f)}
        {o.day !== undefined ? <DayChip t={t} day={o.day} /> : null}
      </g>
    );
  };
  return Shot;
};

/** Dust motes over the dark: the episode's ground for cards. */
export const DustField: React.FC<{ t: number; n?: number; seed?: number; color?: string }> = ({ t, n = 40, seed = 3, color = '#0C1024' }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill={color} />
    <ellipse cx={960} cy={1100} rx={1100} ry={500} fill="#3A4A8A" opacity={0.25} filter="url(#blur16)" />
    {Array.from({ length: n }).map((_, i) => {
      const r = (k: number) => rnd(seed * 31 + i, k);
      const y = ((r(5) * 1300 + t * (0.25 + r(4) * 0.5)) % 1300) - 100;
      const x = r(6) * 1920 + Math.sin(t / 40 + i) * 30;
      return <circle key={i} cx={x} cy={1080 - y} r={2 + r(7) * 5} fill="#F6EFE3" opacity={0.15 + r(9) * 0.35} />;
    })}
  </g>
);

/** A chapter opener: kicker, title and the day chip, over the dust. */
export const egCard = (o: { kicker: string; title: string; seed?: number; Bg?: SetC }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t, len }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    const z = kf(t, [[0, 1], [Math.max(len, 1), 1.06]]);
    return (
      <g>
        <g transform={camT(960, 540, z)}>
          {o.Bg ? (
            <Soft blur={10} dim={0.55}>
              <o.Bg t={t + 300} id="card" />
            </Soft>
          ) : (
            <DustField t={t + 200} seed={o.seed ?? 3} />
          )}
        </g>
        <g transform={`translate(960 430) scale(${pop(1)})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill={EG.gold}>{o.kicker}</text>
        </g>
        <g transform={`translate(960 580) scale(${pop(3)})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={o.title.length > 18 ? 100 : 124} fill="#F6EFE3" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">{o.title}</text>
        </g>
      </g>
    );
  };
  return Card;
};

/** A big word or number on its own, popping on over the dust (or a soft set). */
export const bigWord = (o: { kicker?: string; word: string; color?: string; Bg?: SetC; sub?: string; size?: number; day?: number | string }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const pop = backOut(clamp((t - 2) / 9));
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.55}>
            <g transform={camT(960, 520, 1.3)}>
              <o.Bg t={t + 500} id="bw" />
            </g>
          </Soft>
        ) : (
          <DustField t={t} n={30} />
        )}
        {o.kicker ? <text x={960} y={400} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>{o.kicker}</text> : null}
        <g transform={`translate(960 610) scale(${pop})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={o.size ?? 200} fill={o.color ?? EG.gold} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">{o.word}</text>
        </g>
        {o.sub ? <text x={960} y={770} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#C8C2D8" opacity={clamp((t - 10) / 8)}>{o.sub}</text> : null}
        {o.day !== undefined ? <DayChip t={t} day={o.day} /> : null}
      </g>
    );
  };
  return Shot;
};

/** A fact as a card over a soft set: label, a big number that counts up, the working, then THAT'S REAL. */
export const fact = (o: { Bg?: SetC; label: string; value: number; prefix?: string; suffix?: string; sub?: string; real?: boolean; format?: (v: number) => string; color?: string; icon?: (t: number) => React.ReactNode }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const k = clamp((t - 8) / 36);
    const e = 1 - Math.pow(1 - k, 3);
    const v = o.value * e;
    const txt = o.format ? o.format(v) : Math.round(v).toLocaleString('en-US');
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.6}>
            <g transform={camT(960, 520, 1.3)}>
              <o.Bg t={t + 500} id="fact" />
            </g>
          </Soft>
        ) : (
          <DustField t={t} n={30} />
        )}
        {o.icon?.(t)}
        <text x={960} y={330} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill="#F6EFE3" opacity={clamp(t / 6)}>{o.label}</text>
        <g transform={`translate(960 560) scale(${backOut(clamp((t - 6) / 9))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={170} fill={o.color ?? EG.gold} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">{(o.prefix ?? '') + txt + (o.suffix ?? '')}</text>
        </g>
        {o.sub ? <text x={960} y={690} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill="#C8C2D8" opacity={clamp((t - 30) / 8)}>{o.sub}</text> : null}
        {o.real !== false ? (
          <g opacity={clamp((t - 48) / 6)} transform={`translate(960 830) scale(${backOut(clamp((t - 48) / 9))})`}>
            <rect x={-170} y={-50} width={340} height={76} rx={38} fill="#14182C" stroke={EG.gold} strokeWidth={4} />
            <text textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={EG.gold}>{"THAT'S REAL."}</text>
          </g>
        ) : null}
      </g>
    );
  };
  return Shot;
};

// ---------------------------------------------------------------- HUD
/** The day counter in the corner: DAY n, with a tiny "population" line under it. */
export const DayChip: React.FC<{ t: number; day: number | string; pop?: string }> = ({ t, day, pop = 'POPULATION: 1' }) => (
  <g transform={`translate(70 70)`} opacity={clamp((t + 2) / 6)}>
    <rect x={0} y={0} width={300} height={104} rx={20} fill="#0E1024" opacity={0.78} stroke="#F6EFE3" strokeOpacity={0.25} strokeWidth={3} />
    <text x={26} y={56} fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#F6EFE3">{typeof day === 'number' ? `DAY ${day}` : day}</text>
    <text x={28} y={88} fontFamily={FONT.ui} fontSize={22} letterSpacing={3} fill={EG.gold}>{pop}</text>
  </g>
);

/** A big digital clock reading `text` (3:07), its colon blinking. */
export const DigitalClock: React.FC<{ x: number; y: number; s?: number; text: string; t: number; color?: string }> = ({ x, y, s = 1, text, t, color = '#FF4A3A' }) => {
  const [h, m] = text.split(':');
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-330} y={-150} width={660} height={300} rx={40} fill="#14121C" stroke="#2E2A3A" strokeWidth={10} />
      <rect x={-300} y={-120} width={600} height={240} rx={20} fill="#0A0810" />
      <Glow x={0} y={0} r={300} kind="red" o={0.35} />
      <text x={-40} y={70} textAnchor="end" fontFamily={FONT.ui} fontSize={200} fill={color}>{h}</text>
      <text x={0} y={60} textAnchor="middle" fontFamily={FONT.ui} fontSize={180} fill={color} opacity={Math.floor(t / 15) % 2 ? 0.25 : 1}>:</text>
      <text x={40} y={70} fontFamily={FONT.ui} fontSize={200} fill={color}>{m}</text>
    </g>
  );
};

// ---------------------------------------------------------------- props
/** A parked car with its driver's door hanging open (the people who left it are gone). */
export const StoppedCar: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean; door?: boolean; dark?: boolean }> = ({ x, y, s = 1, color, flip = false, door = false, dark }) => (
  <g>
    <ModernCar x={x} y={y} s={s} color={color} flip={flip} dark={dark} />
    {door ? (
      <g transform={`translate(${x + (flip ? 60 : -60) * s} ${y - 120 * s}) scale(${s})`}>
        <path d={`M 0 0 L ${flip ? 70 : -70} -20 L ${flip ? 80 : -80} 70 L 0 80 Z`} fill={color ?? '#3A6AB8'} stroke="#14151C" strokeWidth={5} />
        <path d={`M ${flip ? 10 : -10} 8 L ${flip ? 60 : -60} -6 L ${flip ? 64 : -64} 30 L ${flip ? 10 : -10} 36 Z`} fill="#9ABAD0" stroke="#14151C" strokeWidth={4} />
      </g>
    ) : null}
  </g>
);

/** A city bus side-on, facing left, at (x, y) the road under its middle; `doors` 0..1 open. Engine shimmer on t. */
export const CityBus: React.FC<{ x: number; y: number; s?: number; t: number; doors?: number; dark?: boolean }> = ({ x, y, s = 1, t, doors = 1, dark = false }) => {
  const shake = Math.sin(t * 1.7) * 1.5;
  return (
    <g transform={`translate(${x} ${y + shake}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={560} ry={26} fill="#000" opacity={0.3} />
      <rect x={-540} y={-380} width={1080} height={340} rx={40} fill={dark ? '#7A2A2A' : '#D8423A'} stroke="#14151C" strokeWidth={8} />
      <rect x={-540} y={-120} width={1080} height={60} fill={dark ? '#5A1E1E' : '#B8342E'} />
      <rect x={-520} y={-360} width={1040} height={40} rx={14} fill="#F2C14E" />
      <text x={-470} y={-330} fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#14151C">24  CITY CENTRE</text>
      {Array.from({ length: 6 }).map((_, i) => (
        <rect key={i} x={-300 + i * 140} y={-300} width={120} height={150} rx={12} fill={dark ? '#2A3448' : '#8AB0D0'} stroke="#14151C" strokeWidth={5} />
      ))}
      {/* front window and the doors (front left) */}
      <path d="M -540 -340 Q -540 -380 -500 -380 L -460 -380 L -460 -150 L -540 -150 Z" fill={dark ? '#2A3448' : '#8AB0D0'} stroke="#14151C" strokeWidth={5} />
      <rect x={-440} y={-310} width={130} height={270} fill="#1A1C24" />
      <rect x={-440 - 60 * doors} y={-310} width={62} height={270} fill={dark ? '#2A3448' : '#9ABAD0'} stroke="#14151C" strokeWidth={4} opacity={0.95} />
      <rect x={-372 + 60 * doors} y={-310} width={62} height={270} fill={dark ? '#2A3448' : '#9ABAD0'} stroke="#14151C" strokeWidth={4} opacity={0.95} />
      {[-360, 360].map((wx) => (
        <g key={wx}>
          <circle cx={wx} cy={-30} r={64} fill="#1A1C24" />
          <circle cx={wx} cy={-30} r={30} fill="#8A8E98" />
        </g>
      ))}
      <circle cx={-540} cy={-80} r={18} fill="#FFE8A0" />
      {/* exhaust puffs: the engine is still running */}
      {[0, 1, 2].map((i) => {
        const k = ((t / 30 + i / 3) % 1);
        return <circle key={i} cx={560 + k * 120} cy={-50 - k * 60} r={16 + k * 34} fill="#C8C8D0" opacity={0.45 * (1 - k)} />;
      })}
    </g>
  );
};

/** Noodle: a scruffy brown-and-cream mutt, side on, facing right (flip for left). `walk` > 0 moves the legs on t;
 *  `bark` 0..1 opens the mouth; `lead` trails a red lead behind. (x, y) the ground under his middle. */
export const Noodle: React.FC<{ x: number; y: number; s?: number; t: number; flip?: boolean; walk?: number; bark?: number; lead?: boolean; sit?: boolean; look?: number }> = ({ x, y, s = 1, t, flip = false, walk = 0, bark = 0, lead = false, sit = false, look = 0 }) => {
  const ph = t * 0.45 * walk;
  const leg = (o: number) => Math.sin(ph + o) * 26 * walk;
  const tail = Math.sin(t / 3.5) * 24;
  const bob = walk ? Math.abs(Math.sin(ph)) * 6 : Math.sin(t / 14) * 2;
  const L = (lx: number, a: number, back = false) => (
    <path d={`M ${lx} -70 L ${lx + Math.sin((a * Math.PI) / 180) * 70} ${-2}`} stroke={back ? '#7A4E2A' : '#9A6634'} strokeWidth={22} strokeLinecap="round" />
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      <ellipse cx={0} cy={0} rx={130} ry={14} fill="#000" opacity={0.3} />
      {lead ? <path d={`M 112 ${-118 - bob} Q 40 ${-60} -60 ${-10} Q -160 ${6} -260 ${0}`} stroke="#D8423A" strokeWidth={8} fill="none" strokeLinecap="round" /> : null}
      <g transform={`translate(0 ${-bob})`}>
        {sit ? (
          <g>
            <path d="M -90 -10 L -40 -10" stroke="#7A4E2A" strokeWidth={24} strokeLinecap="round" />
            <path d="M 60 -70 L 70 -4 M 90 -70 L 100 -4" stroke="#9A6634" strokeWidth={22} strokeLinecap="round" />
          </g>
        ) : (
          <g>
            {L(-70, leg(0), true)}
            {L(60, leg(Math.PI), true)}
            {L(-50, leg(Math.PI))}
            {L(80, leg(0))}
          </g>
        )}
        <path d={`M -100 ${sit ? -40 : -96} Q -140 ${-130 - tail * 0.3} -150 ${-160 - tail}`} stroke="#9A6634" strokeWidth={18} strokeLinecap="round" fill="none" />
        <g transform={sit ? 'rotate(-28 40 -60)' : ''}>
          <ellipse cx={0} cy={-100} rx={120} ry={52} fill="#B07A44" stroke="#1A1410" strokeWidth={6} />
          <ellipse cx={20} cy={-80} rx={70} ry={26} fill="#E8CFA0" />
          <path d="M -60 -140 Q -20 -158 30 -146" stroke="#8A5A30" strokeWidth={10} fill="none" strokeLinecap="round" />
        </g>
        <g transform={`translate(${sit ? 120 : 118} ${sit ? -178 : -150}) rotate(${bark * -10})`}>
          <ellipse cx={0} cy={0} rx={60} ry={52} fill="#B07A44" stroke="#1A1410" strokeWidth={6} />
          <path d={`M 30 10 Q 80 ${4 + bark * 6} 92 20 Q 84 ${36 + bark * 26} 44 ${36 + bark * 10} Z`} fill="#E8CFA0" stroke="#1A1410" strokeWidth={5} />
          {bark > 0.1 ? <path d={`M 56 ${30} Q 74 ${36 + bark * 24} 86 ${30}`} fill="#7A2A2A" /> : null}
          <ellipse cx={90} cy={14} rx={11} ry={9} fill="#1A1410" />
          <circle cx={22 + look * 6} cy={-10} r={10} fill="#1A1410" />
          <circle cx={25 + look * 6} cy={-14} r={3.5} fill="#FFFFFF" />
          <path d="M -30 -40 Q -64 -10 -50 36 Q -26 10 -14 -30 Z" fill="#6A4020" stroke="#1A1410" strokeWidth={5} />
          <rect x={-40} y={34} width={60} height={14} rx={7} fill="#D8423A" transform="rotate(-20)" />
        </g>
      </g>
    </g>
  );
};

/** "WOOF" marks over a barking dog, or across the city. */
export const Woof: React.FC<{ x: number; y: number; t: number; s?: number; seed?: number }> = ({ x, y, t, s = 1, seed = 1 }) => {
  const k = ((t + seed * 7) % 24) / 24;
  return (
    <g transform={`translate(${x} ${y - k * 40}) scale(${s * (0.8 + k * 0.4)})`} opacity={k < 0.8 ? 1 : (1 - k) * 5}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#F6EFE3" stroke="#14121C" strokeWidth={8} paintOrder="stroke">WOOF</text>
    </g>
  );
};

/** A chunky kids' walkie-talkie, upright: (x, y) its base. `on` lights the LED; `hiss` > 0 draws static marks. */
export const Walkie: React.FC<{ x: number; y: number; s?: number; rot?: number; on?: number; hiss?: number; t?: number; color?: string }> = ({ x, y, s = 1, rot = 0, on = 1, hiss = 0, t = 0, color = '#F2C14E' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={40} y={-400} width={22} height={160} rx={10} fill="#1A1A22" />
    <circle cx={51} cy={-404} r={16} fill="#1A1A22" />
    <rect x={-90} y={-270} width={180} height={270} rx={34} fill={color} stroke="#14121C" strokeWidth={8} />
    <rect x={-66} y={-236} width={132} height={100} rx={16} fill="#2A2632" />
    {Array.from({ length: 4 }).map((_, i) => <rect key={i} x={-54} y={-222 + i * 22} width={108} height={8} rx={4} fill="#14121C" />)}
    <circle cx={-46} cy={-100} r={14} fill={on ? '#FF3A2A' : '#5A2A2A'} />
    {on ? <Glow x={-46} y={-100} r={40} kind="red" o={0.8 * on} /> : null}
    <rect x={-20} y={-114} width={70} height={30} rx={8} fill="#14121C" />
    <rect x={-60} y={-70} width={120} height={46} rx={20} fill="#E8453A" stroke="#14121C" strokeWidth={6} />
    <text x={0} y={-38} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#F6EFE3">TALK</text>
    {hiss > 0
      ? [0, 1, 2].map((i) => {
          const k = ((t / 10 + i / 3) % 1);
          return <path key={i} d={`M ${110 + k * 60} ${-220 - k * 30} q 14 -14 0 -28 q -14 -14 0 -28`} transform={`rotate(${30} 110 -220)`} stroke="#F6EFE3" strokeWidth={6} fill="none" opacity={hiss * (1 - k)} />;
        })
      : null}
  </g>
);

/** A torch held out: a warm cone from (x, y) at angle `a` (degrees, 0 = right). */
export const TorchBeam: React.FC<{ x: number; y: number; a: number; len?: number; w?: number; o?: number }> = ({ x, y, a, len = 900, w = 300, o = 0.6 }) => (
  <g transform={`translate(${x} ${y}) rotate(${a})`} style={{ mixBlendMode: 'screen' }}>
    <path d={`M 0 -10 L ${len} ${-w / 2} L ${len} ${w / 2} L 0 10 Z`} fill="url(#g3cone)" opacity={o} />
    <path d={`M 0 -10 L ${len} ${-w / 2} L ${len} ${w / 2} L 0 10 Z`} fill={EG.torch} opacity={o * 0.25} filter="url(#blur16)" />
    <rect x={-60} y={-14} width={60} height={28} rx={8} fill="#2A2A34" />
  </g>
);

/** The photo from the fridge: Mum, Ellie and you at the beach, drawn simply. */
export const BeachPhoto: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -4 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-170} y={-130} width={340} height={280} fill="#F6F2EA" stroke="#14121C" strokeWidth={5} />
    <rect x={-150} y={-110} width={300} height={200} fill="#7AC8E8" />
    <rect x={-150} y={10} width={300} height={80} fill="#E8D49A" />
    <rect x={-150} y={-10} width={300} height={24} fill="#3A8AC0" />
    <circle cx={110} cy={-80} r={20} fill="#FFE27A" />
    {[[-70, '#8A5A8A', 1], [0, '#F07A2A', 0.85], [60, '#3E8C86', 0.65]].map(([cx, c, k], i) => (
      <g key={i} transform={`translate(${cx} 70) scale(${k})`}>
        <rect x={-22} y={-80} width={44} height={70} rx={14} fill={c as string} />
        <circle cx={0} cy={-104} r={26} fill="#14121C" />
        <path d="M -10 -100 Q 0 -90 10 -100" stroke="#F6EFE3" strokeWidth={4} fill="none" />
      </g>
    ))}
    <rect x={-30} y={-148} width={60} height={30} fill="#F2C14E" opacity={0.8} transform="rotate(4)" />
  </g>
);

/** A note on a door: the lines hand-written. */
export const DoorNote: React.FC<{ x: number; y: number; s?: number; lines: string[]; rot?: number; age?: number }> = ({ x, y, s = 1, lines, rot = -3, age = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-150} y={-110} width={300} height={220} fill={age > 0.5 ? '#E8DCB0' : '#FFF6C8'} stroke="#14121C" strokeWidth={4} />
    <rect x={-40} y={-124} width={80} height={28} fill="#C8C8D0" opacity={0.8} />
    {lines.map((l, i) => (
      <text key={i} x={0} y={-40 + i * 56} textAnchor="middle" fontFamily={FONT.hand} fontSize={38} fill="#1A2A6A">{l}</text>
    ))}
  </g>
);

/** Water rising in a frame: a wavy top at `top`, everything below a murky blue-green. */
export const Water: React.FC<{ t: number; top: number }> = ({ t, top }) => {
  let d = `M -600 ${top}`;
  for (let x = -600; x <= 2600; x += 80) d += ` Q ${x + 40} ${top + Math.sin(t / 8 + x / 120) * 14} ${x + 80} ${top + Math.sin(t / 8 + (x + 80) / 120) * 6}`;
  d += ' L 2600 2000 L -600 2000 Z';
  return (
    <g>
      <path d={d} fill="#1E4A5A" opacity={0.85} />
      <path d={d} fill="none" stroke="#8AC8D8" strokeWidth={6} opacity={0.7} />
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={i} d={`M ${((i * 260 + t * 2) % 2400) - 300} ${top + 40 + (i % 3) * 40} h 120`} stroke="#8AC8D8" strokeWidth={4} opacity={0.35} />
      ))}
    </g>
  );
};

/** Stink lines and flies over rotting food. */
export const Stink: React.FC<{ t: number; k: number; x0: number; x1: number; y: number }> = ({ t, k, x0, x1, y }) => (
  <g opacity={k}>
    {Array.from({ length: 9 }).map((_, i) => {
      const x = x0 + ((x1 - x0) * i) / 8;
      const u = ((t / 40 + i * 0.37) % 1);
      return <path key={i} d={`M ${x} ${y - u * 160} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#8AC85A" strokeWidth={7} fill="none" opacity={(1 - u) * 0.8} />;
    })}
    {Array.from({ length: 14 }).map((_, i) => (
      <circle key={`f${i}`} cx={x0 + rnd(81, i) * (x1 - x0) + Math.sin(t / 3 + i) * 40} cy={y - 100 - rnd(82, i) * 200 + Math.cos(t / 2.4 + i) * 30} r={5} fill="#14121C" />
    ))}
  </g>
);

/** Autumn leaves blowing along a street (dust, neglect). */
export const Leaves: React.FC<{ t: number; k: number }> = ({ t, k }) => (
  <g opacity={k}>
    {Array.from({ length: 16 }).map((_, i) => {
      const x = ((rnd(91, i) * 2600 + t * (3 + rnd(92, i) * 3)) % 2800) - 400;
      const y = TOWN.kerb + 30 + rnd(93, i) * 200 + Math.sin(t / 6 + i) * 10;
      return <ellipse key={i} cx={x} cy={y} rx={14} ry={7} fill={['#C8862A', '#A84A2A', '#D8A83A'][i % 3]} transform={`rotate(${t * 5 + i * 40} ${x} ${y})`} />;
    })}
  </g>
);

/** The far bank at night across a river, every window dark; one window lights up (`one`). */
export const River: React.FC<{ t: number; id: string; one: number; moon: boolean; dawn: number }> = ({ t, id, one, moon, dawn }) => (
  <g>
    <DaySky id={`${id}sky`} horizonY={600} tod={dawn > 0.5 ? 'morning' : 'night'} />
    {moon ? (
      <g>
        <circle cx={1500} cy={200} r={70} fill="#F4EED8" />
        <Glow x={1500} y={200} r={260} kind="cool" o={0.4} />
      </g>
    ) : null}
    <g transform="translate(0 40)">
      <CitySkyline t={t} id={`${id}c`} red={0} lit={0} />
    </g>
    {one > 0 ? (
      <g>
        <rect x={1130} y={470} width={26} height={34} fill="#FFD88A" opacity={one} />
        <Glow x={1143} y={487} r={90} kind="warm" o={0.9 * one} />
      </g>
    ) : null}
    <rect x={-400} y={640} width={2800} height={600} fill="#0A1426" />
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${-300 + i * 180 + Math.sin(t / 20 + i) * 20} ${680 + (i % 4) * 50} h 90`} stroke="#8AA0C8" strokeOpacity={0.3} strokeWidth={4} />)}
    {one > 0 ? <path d={`M 1143 660 L 1143 900`} stroke="#FFD88A" strokeWidth={14} opacity={0.35 * one} filter="url(#blur6)" /> : null}
    {/* our bank: a railing in front */}
    <rect x={-400} y={900} width={2800} height={400} fill="#14121C" />
    <rect x={-400} y={840} width={2800} height={10} fill="#3A3E52" />
    {Array.from({ length: 30 }).map((_, k) => <rect key={k} x={-400 + k * 100} y={840} width={8} height={60} fill="#3A3E52" />)}
  </g>
);

/** The tree house at the end of the park at night: a big oak, a plank house on a platform, a rope ladder. */
export const TREE = { floor: 620, ground: 960, x0: 640, x1: 1280 };
export const TreeHouse: React.FC<{ t: number; id?: string; lamp?: number; window?: number }> = ({ t, id = 'th', lamp = 0, window = 1 }) => (
  <g>
    <DaySky id={`${id}sky`} horizonY={820} tod="night" />
    <circle cx={1650} cy={180} r={60} fill="#F4EED8" />
    <Glow x={1650} y={180} r={240} kind="cool" o={0.35} />
    <g transform="translate(0 260)">
      <CitySkyline t={t} id={`${id}c`} red={0} lit={0} />
    </g>
    {window > 0 ? (
      <g>
        <rect x={1460} y={735} width={14} height={18} fill="#FFD88A" opacity={window} />
        <Glow x={1467} y={744} r={50} kind="warm" o={0.8 * window} />
      </g>
    ) : null}
    <rect x={-400} y={820} width={2800} height={600} fill="#16261E" />
    <path d="M -400 830 Q 400 800 960 830 T 2400 820 L 2400 1500 L -400 1500 Z" fill="#1E3424" />
    {/* trunk and branches */}
    <path d={`M 860 ${TREE.ground} Q 880 760 900 600 L 960 300 L 1010 600 Q 1040 760 1080 ${TREE.ground} Z`} fill="#4A3424" stroke="#1A120C" strokeWidth={6} />
    <path d="M 930 420 Q 760 330 560 300 M 990 380 Q 1200 300 1380 280 M 960 330 Q 980 200 1000 80" stroke="#4A3424" strokeWidth={34} strokeLinecap="round" fill="none" />
    {/* canopy */}
    {[[560, 220, 260], [960, 120, 300], [1380, 220, 260], [760, 300, 220], [1180, 300, 220]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill={i % 2 ? '#1E3A2A' : '#24432E'} stroke="#0E1A12" strokeWidth={6} />
    ))}
    {/* the platform and the house */}
    <rect x={TREE.x0 - 40} y={TREE.floor} width={TREE.x1 - TREE.x0 + 80} height={28} fill="#7A5A3A" stroke="#1A120C" strokeWidth={5} />
    <rect x={TREE.x0} y={TREE.floor - 300} width={TREE.x1 - TREE.x0} height={300} fill="#8A6844" stroke="#1A120C" strokeWidth={6} opacity={0.0} />
    <path d={`M ${TREE.x0 + 20} ${TREE.floor - 330} L ${(TREE.x0 + TREE.x1) / 2} ${TREE.floor - 440} L ${TREE.x1 - 20} ${TREE.floor - 330} Z`} fill="#6A3A2A" stroke="#1A120C" strokeWidth={6} />
    {[TREE.x0 + 30, TREE.x1 - 30].map((px) => <rect key={px} x={px - 12} y={TREE.floor - 330} width={24} height={330} fill="#6A4A2C" stroke="#1A120C" strokeWidth={4} />)}
    {Array.from({ length: 10 }).map((_, k) => <rect key={k} x={TREE.x0 - 30 + k * 66} y={TREE.floor - 90} width={14} height={90} fill="#6A4A2C" />)}
    <rect x={TREE.x0 - 40} y={TREE.floor - 96} width={TREE.x1 - TREE.x0 + 80} height={14} fill="#7A5A3A" />
    {/* rope ladder */}
    <path d={`M ${TREE.x1 - 120} ${TREE.floor + 20} L ${TREE.x1 - 130} ${TREE.ground} M ${TREE.x1 - 40} ${TREE.floor + 20} L ${TREE.x1 - 30} ${TREE.ground}`} stroke="#C8A878" strokeWidth={6} />
    {Array.from({ length: 6 }).map((_, k) => <path key={k} d={`M ${TREE.x1 - 124 - k * 1.5} ${TREE.floor + 70 + k * 55} L ${TREE.x1 - 36 + k * 1.5} ${TREE.floor + 70 + k * 55}`} stroke="#C8A878" strokeWidth={8} />)}
    {lamp > 0 ? <Glow x={(TREE.x0 + TREE.x1) / 2} y={TREE.floor - 120} r={420} kind="warm" o={0.5 * lamp} /> : null}
    {/* fireflies */}
    {Array.from({ length: 10 }).map((_, i) => (
      <circle key={`ff${i}`} cx={200 + rnd(71, i) * 1500 + Math.sin(t / 20 + i) * 40} cy={700 + rnd(72, i) * 200 + Math.cos(t / 17 + i) * 20} r={4} fill="#E8F08A" opacity={0.4 + 0.4 * Math.sin(t / 6 + i)} />
    ))}
  </g>
);

/** The penthouse balcony: a hot tub with steam, on the hotel roof. (x, y) the floor under its middle. */
export const HotTub: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={330} ry={30} fill="#000" opacity={0.35} />
    <rect x={-300} y={-170} width={600} height={170} rx={20} fill="#8A6A4A" stroke="#1A120C" strokeWidth={6} />
    {Array.from({ length: 9 }).map((_, k) => <path key={k} d={`M ${-300 + k * 75} -170 V 0`} stroke="#6A4A30" strokeWidth={4} />)}
    <ellipse cx={0} cy={-170} rx={300} ry={40} fill="#3AB0C8" stroke="#1A120C" strokeWidth={6} />
    <ellipse cx={0} cy={-170} rx={240} ry={26} fill="#7AD8E8" opacity={0.6} />
    {[0, 1, 2, 3].map((i) => {
      const k = ((t / 50 + i / 4) % 1);
      return <ellipse key={i} cx={-160 + i * 110 + Math.sin(t / 9 + i) * 20} cy={-200 - k * 160} rx={40 + k * 30} ry={20 + k * 14} fill="#F6EFE3" opacity={0.3 * (1 - k)} />;
    })}
  </g>
);

/** A slice of the cinema: the screen's glow over rows of seats, from behind. */
export const Cinema: React.FC<{ t: number; id?: string; screen?: number }> = ({ t, id = 'cin', screen = 1 }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#120C16" />
    <rect x={160} y={80} width={1600} height={600} fill="#1E1A26" />
    <rect x={200} y={110} width={1520} height={540} fill="#3A6AA8" opacity={screen} />
    <rect x={200} y={460} width={1520} height={190} fill="#4A8A5A" opacity={screen} />
    <circle cx={1400} cy={260} r={80} fill="#FFE27A" opacity={screen} />
    <path d={`M ${600 + Math.sin(t / 20) * 60} 470 q 60 -120 120 0`} fill="#E8453A" opacity={screen} />
    <Glow x={960} y={380} r={900} kind="cool" o={0.4 * screen} />
    <path d="M 160 80 Q 0 400 -200 1100 M 1760 80 Q 1920 400 2120 1100" stroke="#5A1A2A" strokeWidth={60} />
    {[0, 1, 2, 3].map((r) =>
      Array.from({ length: 14 }).map((_, k) => {
        const y = 760 + r * 110;
        const w = 120 + r * 14;
        const x = 960 + (k - 6.5) * (w + 10);
        return <path key={`${r}-${k}`} d={`M ${x - w / 2} ${y + 60} L ${x - w / 2} ${y} Q ${x} ${y - 40} ${x + w / 2} ${y} L ${x + w / 2} ${y + 60} Z`} fill={r % 2 ? '#7A1E2A' : '#8A2432'} stroke="#2A0A10" strokeWidth={4} />;
      }),
    )}
  </g>
);

/** The motorway: two lanes of cars stopped nose to tail, guard rail, a sign, hills. Feet at 860. */
export const MOTOR = { feet: 860 };
export const Motorway: React.FC<{ t: number; id?: string }> = ({ t, id = 'mw' }) => (
  <g>
    <DaySky id={`${id}sky`} horizonY={520} tod="day" />
    <path d="M -400 560 Q 300 420 900 520 T 2400 480 L 2400 900 L -400 900 Z" fill="#7AA86A" />
    <path d="M -400 620 Q 500 540 1200 600 T 2400 580 L 2400 900 L -400 900 Z" fill="#5A8A4E" />
    <rect x={-400} y={640} width={2800} height={600} fill="#4A4A52" />
    <rect x={-400} y={636} width={2800} height={8} fill="#E8E4D8" />
    {Array.from({ length: 20 }).map((_, k) => <rect key={k} x={-380 + k * 160} y={MOTOR.feet + 40} width={90} height={10} fill="#E8E4D8" opacity={0.85} />)}
    <rect x={-400} y={600} width={2800} height={14} fill="#B8BCC8" />
    {Array.from({ length: 40 }).map((_, k) => <rect key={k} x={-400 + k * 80} y={600} width={8} height={40} fill="#8A8E98" />)}
    <g>
      <rect x={1300} y={240} width={16} height={400} fill="#5A5E68" />
      <rect x={1600} y={240} width={16} height={400} fill="#5A5E68" />
      <rect x={1250} y={240} width={420} height={140} rx={10} fill="#2A7A4A" stroke="#F6EFE3" strokeWidth={6} />
      <text x={1460} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#F6EFE3">CITY CENTRE</text>
      <text x={1460} y={355} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3">↑  M4</text>
    </g>
    {Array.from({ length: 9 }).map((_, k) => (
      <StoppedCar key={`a${k}`} x={-300 + k * 330} y={760} s={0.62} color={['#E8A83A', '#4A7AB8', '#C83A3A', '#5BC08A', '#E8E4D8', '#8A5A8A'][k % 6]} flip />
    ))}
    {Array.from({ length: 8 }).map((_, k) => (
      <StoppedCar key={`b${k}`} x={-200 + k * 380} y={MOTOR.feet + 220} s={0.8} color={['#4A7AB8', '#E8E4D8', '#C83A3A', '#3A3A44', '#E8A83A'][k % 5]} door={k % 3 === 1} />
    ))}
  </g>
);

/** The dam in the mountains, as a section: water behind, the wall, a turbine that spins (`spin`), a spark (`trip`). */
export const DamDiagram: React.FC<{ t: number; spin: number; trip?: number }> = ({ t, spin, trip = 0 }) => {
  const a = t * 6 * spin;
  return (
    <g>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#0E1A2C" />
      {Array.from({ length: 26 }).map((_, i) => <path key={i} d={`M ${i * 80} 0 V 1080`} stroke="#1E2E48" strokeWidth={2} />)}
      {Array.from({ length: 14 }).map((_, i) => <path key={`h${i}`} d={`M 0 ${i * 80} H 1920`} stroke="#1E2E48" strokeWidth={2} />)}
      <path d="M -100 900 L 300 380 L 520 520 L 700 300 L 820 400 L 820 900 Z" fill="#3A4A5A" />
      <path d="M -100 900 L 820 900 L 820 460 L -100 460 Z" fill="#2A6AA8" opacity={0.75} />
      <path d="M 820 260 L 980 260 L 1120 900 L 820 900 Z" fill="#8A8E98" stroke="#F6EFE3" strokeWidth={5} />
      <path d={`M 900 700 Q 1100 720 1200 800`} stroke="#7AC8E8" strokeWidth={36} fill="none" opacity={0.85 * (0.3 + 0.7 * spin)} />
      <g transform={`translate(1300 820)`}>
        <circle r={110} fill="#1A2638" stroke="#F6EFE3" strokeWidth={6} />
        <g transform={`rotate(${a})`}>
          {Array.from({ length: 6 }).map((_, i) => <path key={i} d="M 0 0 L 90 -20 L 90 20 Z" transform={`rotate(${i * 60})`} fill="#7AC8E8" />)}
        </g>
        <circle r={20} fill="#F6EFE3" />
      </g>
      <path d="M 1410 820 L 1600 820 L 1600 300 L 1900 300" stroke={trip > 0.5 ? '#5A5E68' : EG.gold} strokeWidth={10} fill="none" />
      {spin > 0 && trip < 0.5 ? Array.from({ length: 4 }).map((_, i) => {
        const k = ((t / 20 + i / 4) % 1);
        const p = k < 0.4 ? { x: 1410 + (k / 0.4) * 190, y: 820 } : k < 0.8 ? { x: 1600, y: 820 - ((k - 0.4) / 0.4) * 520 } : { x: 1600 + ((k - 0.8) / 0.2) * 300, y: 300 };
        return <circle key={i} cx={p.x} cy={p.y} r={14} fill={EG.gold} />;
      }) : null}
      <g transform="translate(1600 300)">
        <rect x={-60} y={-80} width={120} height={160} rx={12} fill="#2A3448" stroke="#F6EFE3" strokeWidth={5} />
        <path d={trip > 0.5 ? 'M -30 40 L 30 -40' : 'M -30 40 L -30 -40'} stroke={trip > 0.5 ? EG.red : '#5BC08A'} strokeWidth={14} strokeLinecap="round" />
        {trip > 0 && trip < 0.6 ? <Glow x={0} y={0} r={200} kind="warm" o={1 - trip} /> : null}
      </g>
      <text x={500} y={980} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} letterSpacing={4} fill="#8AA8C8">RESERVOIR</text>
      <text x={1300} y={990} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} letterSpacing={4} fill="#8AA8C8">TURBINE</text>
      <text x={1600} y={190} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} letterSpacing={4} fill={trip > 0.5 ? EG.red : '#8AA8C8'}>{trip > 0.5 ? 'TRIPPED' : 'BREAKER'}</text>
    </g>
  );
};

/** A reactor as a section: the dome, the hot core (`heat`), the cooling loop with a pump, the diesel generator and its
 *  fuel gauge (`fuel` 0..1, `days` shown). */
export const ReactorDiagram: React.FC<{ t: number; heat?: number; fuel?: number; days?: number; pump?: number }> = ({ t, heat = 1, fuel = 1, days = 7, pump = 1 }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#0E1A2C" />
    {Array.from({ length: 26 }).map((_, i) => <path key={i} d={`M ${i * 80} 0 V 1080`} stroke="#1E2E48" strokeWidth={2} />)}
    {Array.from({ length: 14 }).map((_, i) => <path key={`h${i}`} d={`M 0 ${i * 80} H 1920`} stroke="#1E2E48" strokeWidth={2} />)}
    <path d="M 260 900 L 260 520 Q 260 280 560 280 Q 860 280 860 520 L 860 900 Z" fill="#2A3448" stroke="#F6EFE3" strokeWidth={6} />
    <rect x={460} y={560} width={200} height={260} rx={14} fill="#3A2A2A" stroke="#F6EFE3" strokeWidth={5} />
    <rect x={480} y={580} width={160} height={220} rx={10} fill={EG.red} opacity={0.4 + 0.5 * heat} />
    <Glow x={560} y={690} r={220} kind="red" o={0.6 * heat} />
    {/* the cooling loop */}
    <path d="M 640 620 L 1100 620 L 1100 820 L 640 820" stroke="#7AC8E8" strokeWidth={18} fill="none" />
    {pump > 0 ? Array.from({ length: 6 }).map((_, i) => {
      const k = ((t / 30) * pump + i / 6) % 1;
      const L = 460 + 200 + 460;
      const d = k * L;
      const p = d < 460 ? { x: 640 + d, y: 620 } : d < 660 ? { x: 1100, y: 620 + (d - 460) } : { x: 1100 - (d - 660), y: 820 };
      return <circle key={i} cx={p.x} cy={p.y} r={12} fill="#F6EFE3" />;
    }) : null}
    <g transform="translate(1100 720)">
      <circle r={60} fill="#1A2638" stroke="#F6EFE3" strokeWidth={5} />
      <g transform={`rotate(${t * 10 * pump})`}><path d="M -40 0 H 40 M 0 -40 V 40" stroke="#7AC8E8" strokeWidth={12} /></g>
    </g>
    {/* the diesel generator and its tank */}
    <path d="M 1160 720 L 1360 720" stroke={EG.gold} strokeWidth={8} strokeDasharray={pump > 0 ? '0' : '14 14'} />
    <rect x={1360} y={620} width={300} height={200} rx={18} fill="#4A4A3A" stroke="#F6EFE3" strokeWidth={5} />
    <text x={1510} y={735} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#F6EFE3">DIESEL</text>
    {pump > 0 ? [0, 1].map((i) => {
      const k = ((t / 24 + i / 2) % 1);
      return <circle key={i} cx={1620 + k * 40} cy={600 - k * 100} r={14 + k * 26} fill="#8A8E98" opacity={0.6 * (1 - k)} />;
    }) : null}
    <g transform="translate(1510 340)">
      <rect x={-200} y={-90} width={400} height={180} rx={20} fill="#14182C" stroke="#F6EFE3" strokeWidth={5} />
      <text x={0} y={-36} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} letterSpacing={3} fill="#8AA8C8">FUEL LEFT</text>
      <rect x={-160} y={-10} width={320} height={40} rx={12} fill="#2A3048" />
      <rect x={-160} y={-10} width={320 * fuel} height={40} rx={12} fill={fuel < 0.25 ? EG.red : EG.gold} />
      <text x={0} y={76} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#F6EFE3">{`${Math.max(0, Math.ceil(days * fuel))} DAYS`}</text>
    </g>
    <text x={560} y={980} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} letterSpacing={4} fill="#8AA8C8">REACTOR</text>
    <text x={880} y={590} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} letterSpacing={3} fill="#7AC8E8">COOLING</text>
  </g>
);

/** A wall of tally marks: `n` days counted, the last one drawing on over `draw` 0..1. */
export const Tally: React.FC<{ x: number; y: number; n: number; s?: number; draw?: number }> = ({ x, y, n, s = 1, draw = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: n }).map((_, i) => {
      const g = Math.floor(i / 5);
      const k = i % 5;
      const last = i === n - 1;
      const p = last ? draw : 1;
      if (k === 4) return <path key={i} d={`M ${g * 150 - 10} 90 L ${g * 150 - 10 + 130 * p} ${90 - 80 * p}`} stroke="#14121C" strokeWidth={9} strokeLinecap="round" />;
      return <path key={i} d={`M ${g * 150 + k * 28} 0 L ${g * 150 + k * 28 + 4} ${100 * p}`} stroke="#14121C" strokeWidth={9} strokeLinecap="round" />;
    })}
  </g>
);

/** A tin can, label and all. */
export const Can: React.FC<{ x: number; y: number; s?: number; label?: string; color?: string; rot?: number }> = ({ x, y, s = 1, label = 'BEANS', color = '#C83A3A', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-180} width={140} height={180} rx={10} fill="#B8BCC8" stroke="#14121C" strokeWidth={5} />
    <rect x={-70} y={-150} width={140} height={120} fill={color} />
    <text x={0} y={-80} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#F6EFE3">{label}</text>
    <ellipse cx={0} cy={-180} rx={70} ry={16} fill="#D8DCE4" stroke="#14121C" strokeWidth={5} />
  </g>
);

/** Popcorn in a striped bucket. */
export const Popcorn: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={-80 + rnd(41, i) * 160} cy={-250 - rnd(42, i) * 60} r={24} fill="#FFF4D0" stroke="#C8A85A" strokeWidth={3} />)}
    <path d="M -110 -240 L 110 -240 L 80 0 L -80 0 Z" fill="#F6EFE3" stroke="#14121C" strokeWidth={6} />
    {[-70, -20, 30, 80].map((x0, i) => <path key={i} d={`M ${x0 - 10} -240 L ${x0 + 20} -240 L ${x0 + 10} 0 L ${x0 - 14} 0 Z`} fill={EG.red} />)}
  </g>
);

export { lerp };

/** A phone with our own screen: `screen` draws inside a 280 x 600 box centred on 0,0. */
export const PhoneUI: React.FC<{ x: number; y: number; s?: number; rot?: number; t?: number; buzz?: number; screen: React.ReactNode; bg?: string; id?: string }> = ({ x, y, s = 1, rot = 0, t = 0, buzz = 0, screen, bg = '#F2F2F6', id = 'pui' }) => {
  const jx = buzz > 0 ? Math.sin(t * 9.1) * 6 * buzz : 0;
  return (
    <g transform={`translate(${x + jx} ${y}) rotate(${rot}) scale(${s})`}>
      <Glow x={0} y={0} r={420} kind="cool" o={0.35} />
      <rect x={-160} y={-330} width={320} height={660} rx={46} fill="#1A1922" stroke="#4A4858" strokeWidth={5} />
      <clipPath id={id}><rect x={-140} y={-300} width={280} height={600} rx={32} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <rect x={-140} y={-300} width={280} height={600} fill={bg} />
        {screen}
      </g>
      {buzz > 0
        ? [-1, 1].map((sd) => (
            <g key={sd} stroke="#CFE6FF" strokeWidth={8} strokeLinecap="round" fill="none" opacity={0.8 * buzz}>
              <path d={`M ${sd * 200} -90 q ${sd * 20} 60 0 120`} />
              <path d={`M ${sd * 240} -130 q ${sd * 30} 100 0 200`} />
            </g>
          ))
        : null}
    </g>
  );
};

/** A sleeve and a mitten coming in from off frame to (x, y): an arm for inserts. */
export const ArmIn: React.FC<{ from: [number, number]; to: [number, number]; color?: string; w?: number }> = ({ from, to, color = '#F07A2A', w = 120 }) => (
  <g>
    <path d={`M ${from[0]} ${from[1]} Q ${(from[0] + to[0]) / 2} ${(from[1] + to[1]) / 2 + 60} ${to[0]} ${to[1]}`} stroke="#14121C" strokeWidth={w + 12} fill="none" strokeLinecap="round" />
    <path d={`M ${from[0]} ${from[1]} Q ${(from[0] + to[0]) / 2} ${(from[1] + to[1]) / 2 + 60} ${to[0]} ${to[1]}`} stroke={color} strokeWidth={w} fill="none" strokeLinecap="round" />
    <circle cx={to[0]} cy={to[1]} r={w * 0.55} fill="#26232F" stroke="#14121C" strokeWidth={6} />
  </g>
);

/** A speech line from a walkie or a phone, as a rounded caption that pops on. */
export const Bubble: React.FC<{ x: number; y: number; t: number; at: number; text: string; color?: string; size?: number; italic?: boolean }> = ({ x, y, t, at, text, color = '#F6EFE3', size = 48, italic = false }) => {
  if (t < at) return null;
  const k = backOut(clamp((t - at) / 7));
  const w = text.length * size * 0.56 + 70;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.5} rx={size * 0.75} fill="#14121C" opacity={0.85} stroke={color} strokeWidth={3} />
      <text x={0} y={size * 0.12} textAnchor="middle" fontFamily={FONT.hand} fontStyle={italic ? 'italic' : 'normal'} fontSize={size} fill={color}>{text}</text>
    </g>
  );
};

/** Where a posed character's hand is, in world space ('R' or 'L'). */
export const handAt = (p: Partial<Pose>, side: 'R' | 'L' = 'R') => {
  const pose: Pose = { ...basePose, ...p };
  const j = joints(pose);
  return toWorld(pose, side === 'R' ? j.armR.end : j.armL.end);
};
/** On a bike, side on, facing `dir`; hips at the saddle above (x, ground). */
export const riderPose = (x: number, ground: number, t: number, dir: 1 | -1 = 1, s = 1): Partial<Pose> => ({
  x, y: ground - 190 * s, scale: s, yaw: 0.8 * dir, facing: dir, legL: { a: 30 + 30 * Math.sin(t / 4), b: -60 }, legR: { a: -10 - 30 * Math.sin(t / 4), b: -40 },
  armR: { a: 70, b: -10 }, armL: { a: 70, b: -10 }, tilt: 6 * dir,
});
/** An ice cream cone, (x, y) the bottom of the cone. */
export const IceCream: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -30 -60 L 30 -60 L 0 0 Z" fill="#D8A860" stroke="#14121C" strokeWidth={4} />
    <circle cx={0} cy={-76} r={30} fill="#F4A8C8" stroke="#14121C" strokeWidth={4} />
    <circle cx={-6} cy={-112} r={24} fill="#F6EFE3" stroke="#14121C" strokeWidth={4} />
  </g>
);
/** Music notes rising from (x, y). */
export const Notes: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g>
    {[0, 1, 2].map((i) => {
      const k = ((t / 30 + i / 3) % 1);
      return (
        <g key={i} transform={`translate(${x + i * 40 + Math.sin(t / 6 + i) * 20} ${y - k * 200})`} opacity={1 - k}>
          <circle cx={0} cy={0} r={14} fill={EG.gold} />
          <path d="M 12 0 V -50 L 34 -40" stroke={EG.gold} strokeWidth={6} fill="none" />
        </g>
      );
    })}
  </g>
);
