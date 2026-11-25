import React from 'react';
import {
  Smartphone, Hero, LOOKS, Look, Pose, PhoneInHand, ScreenMode, ShotProps, Word, basePose, camT, clamp, kf, lerp, rnd, joints, toWorld,
  talkShot, idleBlink, faceAt, Expr, talkAt, FONT, backOut, Suburb, suburbHip, Tod, Shop, Kitchen, Bedroom, CastSpec,
  Bus, BusCab, Bank, Office, Pizzeria, Classroom, Hall, hallHip, Th, thAt, ThoughtBubble, ThoughtOver, ThinkWaves, THINK, Schematic, SCH,
} from '../../engine';

// Shared by every chapter of "What if you could hear everyone's thoughts?": the cast, sets as clocked components,
// and the shot builders. Every builder that draws a person can hang a heard thought over their head (`th`: a text,
// or [[frame, text], ...] to change it), typed on as it is heard.

const noHat = (l: Look): Look => ({ ...l, hat: undefined, hatColor: undefined, noPhones: undefined });

export const YOU = LOOKS.you;
export const MO: Look = { ...noHat(LOOKS.mo26), jacket: '#4E7A4A', jacketShade: '#3E6238', accent: '#E9C46A', shoe: '#E8504A' };
export const ELLIE = LOOKS.ellie;
export const MUM: Look = { ...LOOKS.mom26, jacket: '#8A5A8A', jacketShade: '#704870' };
export const NORA: Look = { ...LOOKS.ellie, jacket: '#2A2A3A', jacketShade: '#1E1E2C', accent: '#B9A4FF', shoe: '#B9A4FF', extra: 'bob' };
export const PRIYA: Look = { ...LOOKS.ellie, jacket: '#E8A83A', jacketShade: '#C88A2A', accent: '#F6EFE3', extra: 'bunches' };
export const TEACHER: Look = { ...noHat(LOOKS.doctor), jacket: '#7A5A3A', jacketShade: '#62472D', hair: '#17131C', extra: 'bob' };
export const DRIVER: Look = { ...LOOKS.worker, jacket: '#2E4A7A', jacketShade: '#243C66', hatColor: '#2E4A7A' };
export const SUITMAN: Look = { ...noHat(LOOKS.gent), jacket: '#3A4A6A', jacketShade: '#2E3C56', accent: '#E9E4DA' };
export const BABYMUM: Look = { ...noHat(LOOKS.lady), jacket: '#E84A8A', jacketShade: '#C03A72' };
export const SHOPMAN: Look = { ...noHat(LOOKS.worker), jacket: '#5A6A3A', jacketShade: '#48562E', extra: 'curls' };
export const ARTGIRL: Look = { ...LOOKS.ellie, jacket: '#C83A6A', jacketShade: '#A82E58', extra: 'bob' };
export const COACH: Look = { ...LOOKS.worker, jacket: '#C83A3A', jacketShade: '#A82E2E', hatColor: '#C83A3A' };
export const LEO: Look = { ...LOOKS.ellie, jacket: '#4AA8E0', jacketShade: '#3A88C0', extra: 'curls' };
export const LEOMUM: Look = { ...noHat(LOOKS.lady), jacket: '#4E7A9A', jacketShade: '#3E6280' };
export const N1: Look = { ...noHat(LOOKS.gent), jacket: '#B8503A', jacketShade: '#9A4030', extra: undefined };
export const N2: Look = { ...noHat(LOOKS.lady), jacket: '#E8A83A', jacketShade: '#C88A2A' };
export const N3: Look = { ...noHat(LOOKS.worker), jacket: '#5A4A8A', jacketShade: '#4A3A72' };
export const N4: Look = { ...noHat(LOOKS.doctor), jacket: '#4AA8A0', jacketShade: '#3A8A84', hair: '#17131C' };
export const N5: Look = { ...noHat(LOOKS.lady), jacket: '#7A9A4A', jacketShade: '#627E3A', extra: 'bunches' };
export const N6: Look = { ...noHat(LOOKS.gent), jacket: '#2A5AA8', jacketShade: '#224A8A', extra: undefined };
export const KID: Look = { ...LOOKS.ellie, jacket: '#E8C04A', jacketShade: '#C8A03A', extra: undefined };
export const NEIGHBOURS = [N1, N2, N3, N4, N5, N6, KID, SHOPMAN];

// ---------------------------------------------------------------- sets with a clock
export type SetC = React.FC<{ t: number; id?: string }>;
export const StreetSet = (tod: Tod = 'day', o: { cars?: boolean; drive?: boolean; lit?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Suburb t={t} id={id} tod={tod} cars={o.cars ?? true} drive={o.drive} windowsLit={o.lit} />;
  return S;
};
export const ShopSet = (empty = 0): SetC => {
  const S: SetC = ({ t, id }) => <Shop t={t} id={id} empty={empty} terminal="idle" />;
  return S;
};
export const KitchenSet = (veil = 0.35): SetC => {
  const S: SetC = ({ t, id }) => <Kitchen t={t} id={id} veil={veil} />;
  return S;
};
export const BedroomSet = (o: { veil?: number; clock?: string; lamp?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Bedroom t={t} id={id} veil={o.veil ?? 0.2} clock={o.clock ?? '07:12'} lamp={o.lamp ?? 0} />;
  return S;
};
export const BusSet = (speed = 6): SetC => {
  const S: SetC = ({ t, id }) => <Bus t={t} id={id} speed={speed} />;
  return S;
};
export const CabSet: SetC = ({ t, id }) => <BusCab t={t} id={id} />;
export const BankSet = (o: { counter?: boolean; rope?: boolean; alarm?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Bank t={t} id={id} counter={o.counter} rope={o.rope} alarm={o.alarm} />;
  return S;
};
export const OfficeSet: SetC = ({ t, id }) => <Office t={t} id={id} />;
export const PizzaSet: SetC = ({ t, id }) => <Pizzeria t={t} id={id} />;
export const ClassSet = (laugh = 0): SetC => {
  const S: SetC = ({ t, id }) => <Classroom t={t} laugh={laugh} />;
  return S;
};
export const HIP = suburbHip(1);

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

/** Neighbours along the pavement: n of them spread x0..x1, reacting with `expr`. */
export const crowd = (n: number, x0: number, x1: number, seed: number, o: { scale?: number; expr?: Expr; faceTo?: number; y?: number; skip?: number[] } = {}): CastSpec[] => {
  const out: CastSpec[] = [];
  for (let i = 0; i < n; i++) {
    if (o.skip?.includes(i)) continue;
    const sc = (o.scale ?? 1) * (0.9 + rnd(seed, i) * 0.14);
    const x = lerp(x0, x1, n > 1 ? i / (n - 1) : 0.5) + (rnd(seed + 1, i) - 0.5) * 40;
    const to = o.faceTo ?? 960;
    out.push({
      look: NEIGHBOURS[(i + seed) % NEIGHBOURS.length], x, y: o.y ?? suburbHip(sc), scale: sc,
      yaw: Math.max(-0.6, Math.min(0.6, (to - x) / 900)), faces: [[0, o.expr ?? 'neutral']], seed: seed * 10 + i,
      pose: { armL: { a: 14 + rnd(seed + 2, i) * 20, b: -20 }, armR: { a: 14 + rnd(seed + 3, i) * 30, b: -30 } },
    });
  }
  return out;
};

/** The phone held up to camera over a soft background: the workhorse insert. */
export const phoneCU = (o: {
  mode: ScreenMode; battery?: number; text?: string; Bg?: SetC; bgColor?: string; from?: 'left' | 'right'; x?: number; y?: number; s?: number; rot?: number;
  push?: number; buzz?: (t: number) => number; modeAt?: [number, ScreenMode][]; textAt?: [number, string][]; time?: string; sleeve?: string;
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, 1], [Math.max(1, len), 1 + (o.push ?? 0.06)]]);
    const mode = o.modeAt ? [...o.modeAt].reverse().find(([f]) => t >= f)?.[1] ?? o.mode : o.mode;
    const text = o.textAt ? [...o.textAt].reverse().find(([f]) => t >= f)?.[1] ?? o.text : o.text;
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
          <PhoneInHand x={o.x ?? 960} y={(o.y ?? 520) + bob} s={o.s ?? 1.25} rot={o.rot ?? (o.from === 'left' ? 4 : -4)} from={o.from ?? 'right'} mode={mode} t={t} battery={o.battery ?? 70} text={text} bars={4} buzz={o.buzz ? o.buzz(t) : 0} time={o.time ?? '7:42'} sleeve={o.sleeve} />
        </g>
      </g>
    );
  };
  return Shot;
};

/** A thing, big, over a soft set: an insert of a prop (the card terminal, the inhaler...). `draw` gets the shot clock. */
export const propCU = (o: { Bg?: SetC; bgColor?: string; draw: (t: number, len: number) => React.ReactNode; push?: number; blur?: 6 | 10 | 16 }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, 1], [Math.max(1, len), 1 + (o.push ?? 0.06)]]);
    return (
      <g>
        {o.Bg ? (
          <Soft blur={o.blur ?? 10} dim={0.3}>
            <g transform={camT(960, 520, 1.3)}>
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

/** A big word or number on its own, popping on over a dark ground with a soft glow. */
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
          <text x={960} y={760} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill="#C8C2D8" opacity={clamp((t - 10) / 8)}>
            {o.sub}
          </text>
        ) : null}
      </g>
    );
  };
  return Shot;
};

export { talkShot };

/** Where a character's hand is (left or right), to put a thing in it. */
export const handAt = (pose: Pose, side: 'L' | 'R' = 'R') => toWorld(pose, (side === 'L' ? joints(pose).armL : joints(pose).armR).end);

/** The phone in a character's hand, small, glowing: for wides and mediums. */
export const HeldPhone: React.FC<{ pose: Pose; side?: 'L' | 'R'; mode?: ScreenMode; t: number; battery?: number; s?: number; glow?: number; rot?: number }> = ({ pose, side = 'R', mode = 'home', t, battery = 70, s = 0.13, glow = 1.2, rot = 0 }) => {
  const h = handAt(pose, side);
  return <Smartphone x={h.x} y={h.y - 30 * pose.scale} s={s * pose.scale} rot={rot} mode={mode} t={t} battery={battery} glow={glow} status={false} />;
};

/** A cast member as a pose on the street's pavement. */
export const at = (x: number, o: Partial<Pose> = {}, scale = 1): Pose => ({ ...basePose, x, y: suburbHip(scale), scale, ...o });


export const HallSet = (kind: 'mall' | 'station' = 'mall', o: { time?: number; dim?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Hall t={t} id={id} kind={kind} time={o.time} dim={o.dim} />;
  return S;
};
export { hallHip };

// ---------------------------------------------------------------- thoughts
/** How far a heard thought has typed on: `since` is the frame it was first heard. */
export const typed = (t: number, since: number, text: string, rate = 1.1) => clamp((t - since - 2) / Math.max(6, text.length * rate * 0.5));

/** A thought for a Who: text (or keys), the frame it pops (default 4), size, loudness. */
export type ThoughtSpec = { th: Th; pop?: number; s?: number; loud?: number; side?: number; dim?: number; wrap?: number; lift?: number; color?: string };

const drawThought = (t: number, pose: Pose, sp: ThoughtSpec) => {
  const k = thAt(t, sp.th);
  const since = typeof sp.th === 'string' ? sp.pop ?? 4 : k.since;
  if (!k.text || t < since) return null;
  return <ThoughtOver pose={pose} text={k.text} t={t} pop={(t - since) / 7} type={typed(t, since, k.text)} s={sp.s} loud={sp.loud} side={sp.side} dim={sp.dim} wrap={sp.wrap} lift={sp.lift} color={sp.color} />;
};

/** A figure on a set, posed by hand, with a heard thought: the builder for a medium of one or more people. */
export type Who = { look: Look; pose: Partial<Pose>; think?: ThoughtSpec; faces?: [number, Expr][]; seed?: number; held?: ScreenMode; waves?: number };
export const people = (t: number, list: Who[], f = 0, words?: Word[], talk?: Record<number, [number, number][]>) => {
  const poses = list.map((w, i) => {
    const face = faceAt(t, w.faces ?? [[0, (w.pose.expr as Expr) ?? 'neutral']]);
    const open = words && talk?.[i] ? talkAt(words, f, 30, talk[i]) : 0;
    const pose: Pose = { ...basePose, ...w.pose, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, w.seed ?? i + 1)), talk: open, headTilt: (w.pose.headTilt ?? 0) + Math.sin((t + i * 30) / 24) * 1.5 };
    return pose;
  });
  return (
    <g>
      {list.map((w, i) => (
        <g key={i}>
          <Hero look={w.look} pose={poses[i]} />
          {w.held ? <HeldPhone pose={poses[i]} t={t} mode={w.held} /> : null}
          {w.waves ? <ThinkWaves pose={poses[i]} t={t + i * 9} amt={w.waves} /> : null}
        </g>
      ))}
      {/* thoughts over everyone, so no body covers a cloud */}
      {list.map((w, i) => (w.think ? <g key={`th${i}`}>{drawThought(t, poses[i], w.think)}</g> : null))}
    </g>
  );
};

/** A shot of people on a set: camera from/to [x, y, zoom], the cast with their thoughts, extra drawing before/after. */
export const scene = (o: {
  Set: SetC; cam: [number, number, number]; to?: [number, number, number]; cast: Who[] | ((t: number, len: number) => Who[]); setT?: number;
  back?: (t: number, len: number) => React.ReactNode; front?: (t: number, len: number) => React.ReactNode; over?: (t: number, len: number) => React.ReactNode;
  talk?: Record<number, [number, number][]>; words?: Word[]; shake?: (t: number) => number; dim?: number;
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const L = Math.max(1, len);
    const [x0, y0, z0] = o.cam;
    const [x1, y1, z1] = o.to ?? [x0, y0, z0 * 1.06];
    const sh = o.shake ? o.shake(t) : 0;
    const cast = typeof o.cast === 'function' ? o.cast(t, L) : o.cast;
    return (
      <g>
        <g transform={`translate(${sh * Math.sin(t * 3.1)} ${sh * Math.cos(t * 2.3)}) ${camT(kf(t, [[0, x0], [L, x1]]), kf(t, [[0, y0], [L, y1]]), kf(t, [[0, z0], [L, z1]]))}`}>
          <o.Set t={t + (o.setT ?? 60)} id={`sc${x0}${y0}`} />
          {o.back?.(t, L)}
          {people(t, cast, f, o.words, o.talk)}
          {o.front?.(t, L)}
        </g>
        {o.dim ? <rect width={1920} height={1080} fill="#0B0816" opacity={o.dim} /> : null}
        {o.over?.(t, L)}
      </g>
    );
  };
  return Shot;
};

/** A character close-up: one face filling the frame over a soft set, for reactions; optionally their thought. */
export const faceCU = (o: {
  look: Look; Bg: SetC; faces: [number, Expr][]; yaw?: number; look_?: number; talk?: [number, number]; words?: Word[];
  zoom?: [number, number]; side?: number; pose?: Partial<Pose>; extra?: (t: number, pose: Pose) => React.ReactNode; glint?: number; glintColor?: string;
  front?: (t: number) => React.ReactNode; think?: ThoughtSpec; waves?: number; shake?: number; hands?: 'ears' | 'head';
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const face = faceAt(t, o.faces);
    const z = kf(t, [[0, o.zoom?.[0] ?? 3.2], [Math.max(1, len), o.zoom?.[1] ?? 3.45]]);
    const x = 960 + (o.side ?? 0);
    const open = o.words && o.talk ? talkAt(o.words, f, 30, [o.talk]) : 0;
    const handsPose: Partial<Pose> = o.hands === 'ears' ? { armL: { a: 150, b: -150 }, armR: { a: 150, b: -150 } } : o.hands === 'head' ? { armL: { a: 165, b: -120 }, armR: { a: 165, b: -120 } } : {};
    const sh = o.shake ?? 0;
    const pose: Pose = {
      ...basePose, x: x + sh * Math.sin(t * 2.9) * 3, y: 700, scale: 1, yaw: o.yaw ?? 0.3, look: o.look_ ?? -Math.sign(o.yaw ?? 0.3) * 0.4,
      headTilt: Math.sin(t / 25) * 2, ...handsPose, ...o.pose, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, 3)), talk: open, glint: o.glint, glintColor: o.glintColor,
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
          {o.waves ? <ThinkWaves pose={pose} t={t} amt={o.waves} /> : null}
          {o.think ? drawThought(t, pose, { s: 0.42, lift: 4, ...o.think }) : null}
          {o.extra?.(t, pose)}
        </g>
        {o.front?.(t)}
      </g>
    );
  };
  return Shot;
};

/** One thought, huge, over a soft set: the insert that sells a line. */
export const thoughtCU = (o: { text: string; Bg?: SetC; s?: number; loud?: number; pop?: number; wrap?: number; color?: string; dark?: boolean }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, 1], [Math.max(1, len), 1.07]]);
    const p = o.pop ?? 2;
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={o.dark ? 0.6 : 0.4}>
            <g transform={camT(960, 520, 1.3)}>
              <o.Bg t={t + 400} id="tcu" />
            </g>
          </Soft>
        ) : (
          <ThoughtField t={t} />
        )}
        <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
          <ThoughtBubble x={900} y={860} text={o.text} s={o.s ?? 1.5} pop={(t - p) / 7} t={t} type={typed(t, p, o.text)} side={0.2} loud={o.loud} wrap={o.wrap ?? 16} color={o.color} />
        </g>
      </g>
    );
  };
  return Shot;
};

const FIELD = ['hungry', 'where did I park?', 'so tired', 'is she looking?', 'late again', 'pizza?', 'did I lock it?', 'ugh, Monday', 'I miss her', 'what was that?', 'rent...', 'nice shoes', "don't cry", 'he forgot', 'five more minutes', 'me?', 'why?', 'boring'];

/** Heard thoughts drifting up through the dark: the episode's signature ground (cards, transitions, the noise). */
export const ThoughtField: React.FC<{ t: number; n?: number; seed?: number; blur?: boolean; bg?: boolean; loud?: number }> = ({ t, n = 16, seed = 3, blur = true, bg = true, loud = 0 }) => (
  <g>
    {bg ? <rect x={-200} y={-200} width={2400} height={1500} fill="#120E26" /> : null}
    <g filter={blur ? 'url(#blur6)' : undefined}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: number) => rnd(seed * 31 + i, k);
        const y = 1300 - ((t * (0.9 + r(4)) * (1 + loud) + r(5) * 1500) % 1600);
        return <ThoughtBubble key={i} x={r(6) * 1920} y={y} text={FIELD[(i + seed) % FIELD.length]} s={0.5 + r(7) * 0.45} t={t + i * 20} tail={false} side={0} seed={i} />;
      })}
    </g>
  </g>
);

/** A chapter opener: kicker, title, over the drifting thoughts. */
export const thinkCard = (o: { kicker: string; title: string; seed?: number }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t, len }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    const z = kf(t, [[0, 1], [Math.max(len, 1), 1.06]]);
    return (
      <g>
        <g transform={camT(960, 540, z)}>
          <ThoughtField t={t + 200} seed={o.seed ?? 3} />
        </g>
        <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.4} />
        <g transform={`translate(960 420) scale(${pop(1)})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill={THINK.glow}>{o.kicker}</text>
        </g>
        <g transform={`translate(960 545) scale(${pop(3)})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={o.title.length > 18 ? 100 : 124} fill="#F6EFE3" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">{o.title}</text>
        </g>
      </g>
    );
  };
  return Card;
};

/** A big number counting up on the schematic, with label, source and THAT'S REAL. (the science beat). */
export { factCard } from '../../engine';

/** The noise: a crowd on a set with thoughts popping everywhere, faster and denser as `amt` rises. */
export const noise = (o: { Set: SetC; cam: [number, number, number]; to?: [number, number, number]; cast: Who[]; texts: string[]; every?: number; shake?: number; dimAll?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const L = Math.max(1, len);
    const [x0, y0, z0] = o.cam;
    const [x1, y1, z1] = o.to ?? [x0, y0, z0 * 1.08];
    const ev = o.every ?? 7;
    const sh = (o.shake ?? 0) * clamp(t / L);
    return (
      <g>
        <g transform={`translate(${sh * Math.sin(t * 3.1)} ${sh * Math.cos(t * 2.3)}) ${camT(kf(t, [[0, x0], [L, x1]]), kf(t, [[0, y0], [L, y1]]), kf(t, [[0, z0], [L, z1]]))}`}>
          <o.Set t={t + 60} id={`nz${x0}`} />
          {people(t, o.cast.map((w, i) => {
            const since = 2 + i * ev;
            return { ...w, waves: 0.6, think: w.think ?? { th: [[since, o.texts[i % o.texts.length]]], s: 0.5, wrap: 14 } };
          }))}
        </g>
        {o.dimAll ? <rect width={1920} height={1080} fill="#0B0816" opacity={o.dimAll} /> : null}
      </g>
    );
  };
  return Shot;
};

/** The schematic list (ticks and crosses), reused for "what people say / what they think". */
export const sayThink = (o: { rows: { at: number; say: string; think: string }[] }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t }) => (
    <g>
      <Schematic t={t} id="st" />
      <text x={560} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill={SCH.dim}>THEY SAY</text>
      <text x={1360} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill={THINK.glow}>THEY THINK</text>
      {o.rows.map((r, i) => {
        const y = 360 + i * 200;
        const a = backOut(clamp((t - r.at) / 8));
        const b = backOut(clamp((t - r.at - 14) / 8));
        return (
          <g key={i}>
            <g transform={`translate(560 ${y}) scale(${a})`} opacity={clamp((t - r.at) / 4)}>
              <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F6EFE3">{`"${r.say}"`}</text>
            </g>
            <g transform={`translate(1360 ${y}) scale(${b})`} opacity={clamp((t - r.at - 14) / 4)}>
              <text textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={76} fill="#FF7A6A">{r.think}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
  return Card;
};

/** Frame, on a shot's own clock, at which word `w` (its nth occurrence at or after the shot's start) begins. */
export const cueIn = (words: Word[], tl: { shots: { id: string; first: number }[] }, shot: string, w: string, nth = 1): number => {
  const first = tl.shots.find((s) => s.id === shot)?.first ?? 0;
  const n = (x: string) => x.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '').replace(/^'+|'+$/g, '');
  let seen = 0;
  for (const x of words) {
    if (x.s * 30 < first - 3) continue;
    if (n(x.w) === n(w) && ++seen === nth) return Math.round(x.s * 30 - first);
  }
  return 0;
};
/** A character's speaking span on the chapter clock, as [from, to] seconds (for talkShot/people talk). */
export const lineSpan = span;

/** An empty, dashed cloud: the silent head. */
export const Silent: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={0.8}>
    <ellipse cx={0} cy={-150} rx={130} ry={70} fill="#0B0816" opacity={0.5} stroke={THINK.glow} strokeWidth={5} strokeDasharray="14 12" strokeDashoffset={t} />
    <text y={-136} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={44} fill={THINK.glow}>. . .</text>
  </g>
);

/** The real-facts checklist for the recap. */
export const listCard = (o: { title?: string; items: { at: number; text: string; ok: boolean; hot?: boolean }[] }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t }) => (
    <g>
      <Schematic t={t} id="list" />
      {o.title ? <text x={960} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill={SCH.dim}>{o.title}</text> : null}
      {o.items.map((it, i) => {
        const p = backOut(clamp((t - it.at) / 8));
        const y = 330 + i * (560 / Math.max(o.items.length, 1));
        return (
          <g key={i} transform={`translate(560 ${y}) scale(${p})`} opacity={clamp((t - it.at) / 4)}>
            {it.ok ? (
              <path d="M -40 0 L -10 30 L 44 -34" stroke="#5BE08A" strokeWidth={18} fill="none" strokeLinecap="round" />
            ) : (
              <path d="M -34 -34 L 34 34 M 34 -34 L -34 34" stroke="#FF3A2A" strokeWidth={18} strokeLinecap="round" />
            )}
            <text x={90} y={26} fontFamily={FONT.title} fontWeight={800} fontSize={it.hot ? 92 : 76} fill={it.hot ? '#FFB15A' : '#F6EFE3'} textDecoration={it.ok ? undefined : 'line-through'}>{it.text}</text>
          </g>
        );
      })}
    </g>
  );
  return Card;
};
