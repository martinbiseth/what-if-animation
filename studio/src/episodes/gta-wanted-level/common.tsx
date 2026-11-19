import React from 'react';
import {
  Hero, LOOKS, Look, Pose, ShotProps, Word, basePose, camT, clamp, kf, lerp, rnd, idleBlink, faceAt, Expr, talkAt, FONT, backOut, walkPose, HEAD, toWorld, LEG_LEN, joints,
  Suburb, Tod, Kitchen, Bedroom, Classroom, Shop, SHOP, SUBURB, suburbHip,
  Downtown, ParkingLot, Laundromat, Subway, Alley, StationDesk, Mall, Bridge, TOWN, LOT, LAUND, SUB, ALLEY, DESK, MALL, BRIDGE, hipOn,
  StarsOver, StarK, WantedStars, starPath, SirenWash, WANT, sirenPhase,
} from '../../engine';

// Shared by every chapter of "What if you got a five-star wanted level in real life?": the cast, the sets as clocked
// components, word helpers for lip sync and cueing inside a shot, and the shot builders. Every builder that draws a
// person can hang the row of stars over their head (`stars`: a number, or [[frame, n], ...]; n.5 = flashing).

const noHat = (l: Look): Look => ({ ...l, hat: undefined, hatColor: undefined, noPhones: undefined });

export const YOU = LOOKS.you;
export const MO: Look = { ...noHat(LOOKS.mo26), jacket: '#4E7A4A', jacketShade: '#3E6238', accent: '#E9C46A', shoe: '#E8504A' };
export const ELLIE = LOOKS.ellie;
export const MUM: Look = { ...LOOKS.mom26, jacket: '#8A5A8A', jacketShade: '#704870' };
export const COP: Look = { ...LOOKS.cop };
export const DALE: Look = { ...LOOKS.cop, jacket: '#26365A', jacketShade: '#1C2A46', accent: '#F2C14E' };
export const REYES: Look = { ...noHat(LOOKS.lady), jacket: '#7A7E88', jacketShade: '#62666E', accent: '#E9DCC0', extra: 'bob' };
export const LADY1: Look = { ...noHat(LOOKS.lady), jacket: '#C87AA0', jacketShade: '#A8628A', hair: '#D8D4CC' };
export const LADY2: Look = { ...noHat(LOOKS.doctor), jacket: '#6A9AC8', jacketShade: '#527EA8', hair: '#D8D4CC', extra: 'bob' };
export const DOGLADY: Look = { ...noHat(LOOKS.lady), jacket: '#C8862A', jacketShade: '#A86E20' };
export const MAN: Look = { ...noHat(LOOKS.gent), jacket: '#3A6A5A', jacketShade: '#2E5648', extra: undefined };
export const CLERK: Look = { ...noHat(LOOKS.worker), jacket: '#C83A3A', jacketShade: '#A82E2E' };
export const N1: Look = { ...noHat(LOOKS.gent), jacket: '#B8503A', jacketShade: '#9A4030', extra: undefined };
export const N2: Look = { ...noHat(LOOKS.lady), jacket: '#E8A83A', jacketShade: '#C88A2A' };
export const N3: Look = { ...noHat(LOOKS.worker), jacket: '#5A4A8A', jacketShade: '#4A3A72' };
export const N4: Look = { ...noHat(LOOKS.doctor), jacket: '#4AA8A0', jacketShade: '#3A8A84', hair: '#17131C' };
export const PEOPLE = [N1, N2, N3, N4, MAN, LADY1, DOGLADY, LADY2];

// ---------------------------------------------------------------- sets with a clock
export type SetC = React.FC<{ t: number; id?: string }>;
export const TownSet = (tod: Tod = 'day', o: { cars?: boolean; police?: number; lit?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Downtown t={t} id={id} tod={tod} cars={o.cars} police={o.police} lit={o.lit} />;
  return S;
};
export const HomeSet = (tod: Tod = 'day', o: { police?: number; cars?: boolean; lit?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => (
    <g>
      <Suburb t={t} id={id} tod={tod} cars={o.cars ?? true} windowsLit={o.lit} />
      {o.police ? <rect x={-400} y={-400} width={2800} height={1900} fill={sirenPhase(t) ? WANT.red : WANT.blue} opacity={0.14 * o.police} /> : null}
    </g>
  );
  return S;
};
export const LotSet = (o: { tod?: Tod; police?: number; ramp?: boolean } = {}): SetC => {
  const S: SetC = ({ t, id }) => <ParkingLot t={t} id={id} tod={o.tod} police={o.police} ramp={o.ramp} />;
  return S;
};
export const LaundSet = (police = 0): SetC => {
  const S: SetC = ({ t, id }) => <Laundromat t={t} id={id} police={police} />;
  return S;
};
export const SubSet = (o: { gate?: number; alarm?: number; gates?: boolean } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Subway t={t} id={id} gate={o.gate} alarm={o.alarm} gates={o.gates} />;
  return S;
};
export const AlleySet = (light = 0, tod: Tod = 'dusk'): SetC => {
  const S: SetC = ({ t, id }) => <Alley t={t} id={id} light={light} tod={tod} />;
  return S;
};
export const DeskSet: SetC = ({ t, id }) => <StationDesk t={t} id={id} />;
export const MallSet = (screen?: (x: number, y: number, w: number, h: number, i: number, t: number) => React.ReactNode): SetC => {
  const S: SetC = ({ t, id }) => <Mall t={t} id={id} screen={screen ? (x, y, w, h, i) => screen(x, y, w, h, i, t) : undefined} />;
  return S;
};
export const BridgeSet = (block = 1): SetC => {
  const S: SetC = ({ t, id }) => <Bridge t={t} id={id} block={block} />;
  return S;
};
export const KitchenSet = (o: { veil?: number; police?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => (
    <g>
      <Kitchen t={t} id={id} veil={o.veil ?? 0.15} />
      {o.police ? <rect x={-400} y={-400} width={2800} height={1900} fill={sirenPhase(t) ? WANT.red : WANT.blue} opacity={0.12 * o.police} /> : null}
    </g>
  );
  return S;
};
export const BedroomSet = (o: { veil?: number; clock?: string; lamp?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Bedroom t={t} id={id} veil={o.veil ?? 0.2} clock={o.clock ?? '07:12'} lamp={o.lamp ?? 0} crossed={0} />;
  return S;
};
export const ClassSet: SetC = ({ t, id }) => <Classroom t={t} id={id} />;
export const ShopSet: SetC = ({ t, id }) => <Shop t={t} id={id} terminal="idle" />;

// floors
export const HIP = {
  town: (s = 1) => hipOn(TOWN.feet, s), home: (s = 1) => suburbHip(s), lot: (s = 1) => hipOn(LOT.feet, s), laund: (s = 1) => hipOn(LAUND.feet, s),
  sub: (s = 1) => hipOn(SUB.feet, s), alley: (s = 1) => hipOn(ALLEY.feet, s), desk: (s = 1) => hipOn(DESK.feet, s), mall: (s = 1) => hipOn(MALL.feet, s),
  bridge: (s = 1) => hipOn(BRIDGE.feet, s), shop: (s = 1) => hipOn(SHOP.feet, s),
};
export const FEET = { town: TOWN.feet, home: SUBURB.feet, lot: LOT.feet, laund: LAUND.feet, sub: SUB.feet, alley: ALLEY.feet, desk: DESK.feet, mall: MALL.feet, bridge: BRIDGE.feet, shop: SHOP.feet };

// ---------------------------------------------------------------- words
const norm = (w: string) => w.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '').replace(/^'+|'+$/g, '');
/** Seconds at the start of the nth occurrence of a word in the chapter. */
export const wordAt = (words: Word[], w: string, nth = 1): number => {
  let seen = 0;
  const i = words.findIndex((x) => norm(x.w) === norm(w) && ++seen === nth);
  return i < 0 ? 0 : words[i].s;
};
/** The shot-clock frame of a word: use inside a shot as cueAt(words, f, t, 'run'). */
export const cueAt = (words: Word[], f: number, t: number, w: string, nth = 1) => {
  const start = (f - t) / 30 - 0.3; // the nth occurrence from this shot's start
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
/** A moustache for Officer Dale, drawn over the head of a posed character. */
export const Tache: React.FC<{ pose: Pose }> = ({ pose }) => {
  const p = toWorld(pose, { x: pose.yaw * 22, y: HEAD.y + HEAD.r * 0.42 });
  const s = pose.scale;
  return <path transform={`translate(${p.x} ${p.y}) scale(${s})`} d="M -30 0 Q -16 -12 0 -4 Q 16 -12 30 0 Q 18 10 0 4 Q -18 10 -30 0 Z" fill="#6A4A2A" stroke="#0E0F14" strokeWidth={3} />;
};

export type Who = {
  look: Look; pose: Partial<Pose> | ((t: number) => Partial<Pose>); faces?: [number, Expr][]; stars?: StarK; starPop?: number; starS?: number; seed?: number;
  talk?: [number, number][]; tache?: boolean; hide?: (t: number) => boolean; max?: number; floor?: number;
};
/** Characters on a set, posed by hand (pose can be a function of t), with blinks, breathing, lips and stars. */
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
        {w.tache ? <Tache pose={pose} /> : null}
        {w.stars !== undefined ? <StarsOver pose={pose} k={w.stars} t={t} s={w.starS ?? 0.55} pop={(t - (w.starPop ?? -10)) / 8} max={w.max} /> : null}
      </g>
    );
  });

/** A walk along a floor at `feet`: x from a to b over frames f0..f1; stands, facing the way it went, outside them. */
export const walk = (t: number, a: number, b: number, f0: number, f1: number, feet: number, scale = 1, extra: Partial<Pose> = {}): Partial<Pose> => {
  const k = clamp((t - f0) / Math.max(1, f1 - f0));
  const x = lerp(a, b, k);
  const dir = (b >= a ? 1 : -1) as 1 | -1;
  if (t <= f0 || t >= f1) return { x, y: feet - LEG_LEN * scale, scale, yaw: 0.5 * dir, ...extra };
  return { ...walkPose(x, Math.abs(x - a) / (34 * scale), feet, scale, {}, dir), ...extra, x };
};
/** A run: bigger strides, leaning in. */
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

/** Put a pose's lowest foot on the floor at `feet` (for crouches, kneels, sits on the ground). */
export const plant = (p: Partial<Pose>, feet: number): Partial<Pose> => {
  const full: Pose = { ...basePose, ...p };
  const j = joints({ ...full, x: 0, y: 0, scale: 1 });
  const low = Math.max(j.legL.end.y, j.legR.end.y) + 14;
  return { ...p, y: feet - low * full.scale };
};
/** A crouch in profile behind cover, facing `dir`. */
export const crouch = (x: number, feet: number, dir: 1 | -1 = -1, scale = 1, extra: Partial<Pose> = {}): Partial<Pose> =>
  plant({ x, scale, yaw: dir, facing: dir, legL: { a: 70, b: -135 }, legR: { a: 45, b: -110 }, armR: { a: 50, b: -70 }, armL: { a: 30, b: -50 }, tilt: 14 * dir, ...extra }, feet);

// ---------------------------------------------------------------- the scene builder
export type Cam = [number, number, number, number][]; // [frame, x, y, zoom]
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
/** Most shots: a set, a camera move, a cast, things behind and in front, and an overlay in screen space. */
export const scene = (o: {
  Set: SetC; setT?: number; id?: string; cam: { from: [number, number, number]; to?: [number, number, number] } | Cam;
  cast?: Who[] | ((t: number, f: number) => Who[]); words?: Word[];
  back?: (t: number, len: number, f: number) => React.ReactNode; front?: (t: number, len: number, f: number) => React.ReactNode;
  over?: (t: number, len: number, f: number) => React.ReactNode; siren?: number; shake?: number;
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
        {o.siren ? <SirenWash t={t} k={o.siren} /> : null}
        {o.over?.(t, len, f)}
      </g>
    );
  };
  return Shot;
};

/** A set drawn soft, for the background of an insert. */
export const Soft: React.FC<{ blur?: 6 | 10 | 16; children: React.ReactNode; dim?: number }> = ({ blur = 10, children, dim = 0.25 }) => (
  <g>
    <g filter={`url(#blur${blur})`}>{children}</g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={dim} />
  </g>
);

/** One face filling the frame over a soft set, for reactions, with the stars over it. */
export const faceCU = (o: {
  look: Look; Bg: SetC; faces: [number, Expr][]; yaw?: number; talk?: [number, number][]; words?: Word[]; zoom?: [number, number]; side?: number;
  pose?: Partial<Pose>; stars?: StarK; starPop?: number; extra?: (t: number, len: number, f: number) => React.ReactNode; siren?: number; tache?: boolean; look_?: number; shake?: number;
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
        <Soft blur={16} dim={0.15}>
          <g transform={camT(960, 520, 1.6)}>
            <o.Bg t={t + 120} id="fcu" />
          </g>
        </Soft>
        <g transform={`translate(${sh} 0) ${camT(x, 520, z)}`}>
          <Hero look={o.look} pose={pose} shadow={0} />
          {o.tache ? <Tache pose={pose} /> : null}
          {o.stars !== undefined ? <StarsOver pose={pose} k={o.stars} t={t} s={0.42} pop={(t - (o.starPop ?? -10)) / 8} lift={14} /> : null}
          {o.extra?.(t, len, f)}
        </g>
        {o.siren ? <SirenWash t={t} k={o.siren} /> : null}
      </g>
    );
  };
  return Shot;
};

/** The stars, huge, over a soft set: the insert that sells a change. `k` ticks like any StarK. */
export const starsCU = (o: { k: StarK; Bg?: SetC; label?: string; sub?: string; max?: number; s?: number; siren?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, 1], [Math.max(1, len), 1.08]]);
    const st = typeof o.k === 'number' ? { n: Math.floor(o.k), flash: o.k % 1 > 0.4, since: 99 } : (() => {
      let cur = o.k[0];
      for (const key of o.k) if (t >= key[0]) cur = key;
      return { n: Math.floor(cur[1]), flash: cur[1] % 1 > 0.4, since: t - cur[0] };
    })();
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.5}>
            <g transform={camT(960, 520, 1.3)}>
              <o.Bg t={t + 400} id="scu" />
            </g>
          </Soft>
        ) : (
          <StarField t={t} />
        )}
        <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
          <WantedStars x={960} y={620} n={st.n} flash={st.flash} since={st.since} s={o.s ?? 2.2} pop={(t + 2) / 7} t={t} max={o.max} />
          {o.label ? (
            <text x={960} y={760} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp((t - 6) / 6)}>
              {o.label}
            </text>
          ) : null}
          {o.sub ? <text x={960} y={830} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill="#C8C2D8" opacity={clamp((t - 10) / 8)}>{o.sub}</text> : null}
        </g>
        {o.siren ? <SirenWash t={t} k={o.siren} /> : null}
      </g>
    );
  };
  return Shot;
};

/** Gold stars drifting through the dark: the episode's signature ground (cards, transitions). */
export const StarField: React.FC<{ t: number; n?: number; seed?: number }> = ({ t, n = 26, seed = 3 }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#0C1024" />
    <ellipse cx={0} cy={540} rx={700} ry={600} fill={WANT.red} opacity={0.1} filter="url(#blur16)" />
    <ellipse cx={1920} cy={540} rx={700} ry={600} fill={WANT.blue} opacity={0.12} filter="url(#blur16)" />
    <g filter="url(#blur6)">
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: number) => rnd(seed * 31 + i, k);
        const y = 1200 - ((t * (0.8 + r(4)) + r(5) * 1400) % 1500);
        return <path key={i} d={starPath(14 + r(7) * 26)} transform={`translate(${r(6) * 1920} ${y}) rotate(${t * (r(8) - 0.5) * 2})`} fill={WANT.gold} opacity={0.25 + r(9) * 0.5} />;
      })}
    </g>
  </g>
);

/** A chapter opener: kicker, title, over the drifting stars. */
export const starCard = (o: { kicker: string; title: string; seed?: number; n?: number }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t, len }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    const z = kf(t, [[0, 1], [Math.max(len, 1), 1.06]]);
    return (
      <g>
        <g transform={camT(960, 540, z)}>
          <StarField t={t + 200} seed={o.seed ?? 3} />
        </g>
        <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.3} />
        <g transform={`translate(960 330) scale(${pop(0)})`}>
          <WantedStars x={0} y={0} n={o.n ?? 0} s={1} t={t} plate={false} />
        </g>
        <g transform={`translate(960 450) scale(${pop(1)})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill={WANT.gold}>{o.kicker}</text>
        </g>
        <g transform={`translate(960 580) scale(${pop(3)})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={o.title.length > 18 ? 100 : 124} fill="#F6EFE3" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">{o.title}</text>
        </g>
      </g>
    );
  };
  return Card;
};

/** A big word or number on its own, popping on over a dark ground (or a soft set). */
export const bigWord = (o: { kicker?: string; word: string; color?: string; Bg?: SetC; sub?: string; size?: number; siren?: number }): React.FC<ShotProps> => {
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
          <StarField t={t} n={14} />
        )}
        {o.kicker ? <text x={960} y={400} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>{o.kicker}</text> : null}
        <g transform={`translate(960 610) scale(${pop})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={o.size ?? 200} fill={o.color ?? WANT.gold} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">{o.word}</text>
        </g>
        {o.sub ? <text x={960} y={770} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#C8C2D8" opacity={clamp((t - 10) / 8)}>{o.sub}</text> : null}
        {o.siren ? <SirenWash t={t} k={o.siren} /> : null}
      </g>
    );
  };
  return Shot;
};

/** A thing held up close over a soft set: the insert. `draw` gets the shot clock. */
export const insert = (o: { Bg?: SetC; bgColor?: string; push?: number; draw: (t: number, len: number, f: number) => React.ReactNode; siren?: number; dim?: number }): React.FC<ShotProps> => {
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
        {o.siren ? <SirenWash t={t} k={o.siren} /> : null}
      </g>
    );
  };
  return Shot;
};

/** A phone held up with a chat on it: messages appear at their frames. */
export const ChatPhone: React.FC<{ x: number; y: number; s?: number; t: number; name: string; msgs: { at: number; text: string; me?: boolean }[]; rot?: number }> = ({ x, y, s = 1, t, name, msgs, rot = -3 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M 120 300 Q 260 330 340 460 L 400 700 L 120 700 Z" fill="#F07A2A" />
    <rect x={-190} y={-380} width={380} height={760} rx={50} fill="#14121C" />
    <rect x={-172} y={-360} width={344} height={720} rx={36} fill="#F2F2F6" />
    <rect x={-172} y={-360} width={344} height={110} rx={36} fill="#E2E2EA" />
    <circle cx={-110} cy={-300} r={30} fill="#4E7A4A" />
    <text x={-66} y={-290} fontFamily={FONT.ui} fontSize={34} fill="#14121C">{name}</text>
    {msgs.map((m, i) => {
      const k = backOut(clamp((t - m.at) / 7));
      if (t < m.at) return null;
      const lines = m.text.split('|');
      const h = 26 + lines.length * 36;
      const yy = -220 + msgs.slice(0, i).reduce((a, mm) => a + 44 + mm.text.split('|').length * 36, 0);
      return (
        <g key={i} transform={`translate(${m.me ? 160 : -160} ${yy}) scale(${k})`}>
          <rect x={m.me ? -310 : 0} y={0} width={310} height={h} rx={24} fill={m.me ? '#2F7BFF' : '#FFFFFF'} stroke="#D0D0DA" strokeWidth={m.me ? 0 : 3} />
          {lines.map((l, j) => (
            <text key={j} x={m.me ? -292 : 16} y={42 + j * 36} fontFamily={FONT.ui} fontSize={24} fill={m.me ? '#FFFFFF' : '#14121C'}>{l}</text>
          ))}
        </g>
      );
    })}
  </g>
);

export { WANT, sirenPhase, SirenWash };
