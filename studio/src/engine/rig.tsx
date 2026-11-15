import React from 'react';
import { lerp, easeInOut } from './anim';

// The cast, drawn entirely in code: one rig, and a costume (a Look) per character. Every character is built
// once here, so they look identical in every shot: that's the "drawn, not guessed" point. Original
// characters only: never a channel's own hero or anything that resembles a famous cartoon character.

export const C = {
  skin: '#F6EFE3',
  skinShade: '#E2D3BE',
  ink: '#1D2033',
  jacket: '#F2B33D',
  jacketShade: '#D4922A',
  shoe: '#2FB7A6',
  orange: '#FF8A3D',
  limb: '#EFE2CC',
};

/** A costume for the rig: the same body and animation, different colours and one optional extra piece. */
export type Look = {
  skin: string;
  skinShade: string;
  hand: string;
  jacket: string;
  jacketShade: string;
  accent: string;
  limb: string;
  line: string;
  shoe: string;
  face: string;
  hair: string;
  extra?: 'hood' | 'curls' | 'bunches' | 'bob' | 'suit';
  hat?: 'cap' | 'bowler' | 'fedora' | 'cloche' | 'helmet' | 'palla' | 'wreath' | 'fur' | 'kerchief'; // period hats (1920s, ancient Rome, Viking Norway), drawn over the hair
  /** Viking Norway: a full beard in this colour, a wool cloak over the shoulders pinned with a round brooch, keys on the belt. */
  beard?: string;
  cloak?: string;
  keys?: boolean;
  hatColor?: string;
  /** Ancient Rome: a belted tunic whose skirt hangs over the thighs ('tunic'), or a toga draped over it ('toga'). */
  robe?: 'tunic' | 'toga' | 'dress';
  belt?: string; // the tunic's belt colour
  toga?: string; // the toga's cloth colour
  stripe?: string; // a coloured band on the toga's edge (a senator's purple stripe)
  noPhones?: boolean; // curls without the headphones (a period version of Mo)
};
export type CastName = 'pip' | 'pipHood' | 'pipInk' | 'mo' | 'sis' | 'mom' | 'suit' | 'you' | 'mo26' | 'ellie' | 'mom26' | 'suit26' | 'gent' | 'worker' | 'lady' | 'doctor' | 'cop';
const INK = '#26232F';
const INK2 = '#1C1A24';
export const LOOKS: Record<CastName, Look> = {
  // A: Pip as built
  pip: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: C.jacket, jacketShade: C.jacketShade, accent: C.jacketShade, limb: C.limb, line: C.ink, shoe: C.shoe, face: C.ink, hair: C.ink },
  // B: Pip in a dark hoodie with mustard drawstrings: the body goes dark and catches the rim light, the head stays the brightest thing
  pipHood: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: '#2E2B3D', jacketShade: '#24212F', accent: C.jacket, limb: '#2E2B3D', line: '#121019', shoe: C.shoe, face: C.ink, hair: C.ink, extra: 'hood' },
  // C: a dark head with light features, the genre's high-contrast convention, in Pip's mustard
  pipInk: { skin: '#26232F', skinShade: '#1C1A24', hand: '#26232F', jacket: C.jacket, jacketShade: C.jacketShade, accent: C.jacketShade, limb: '#26232F', line: '#121019', shoe: C.shoe, face: '#F6EFE3', hair: '#26232F' },
  // Mo, Pip's friend: a second recurring character with his own costume (curly hair, headphones round his neck)
  mo: { skin: '#C98E68', skinShade: '#B07A58', hand: '#C98E68', jacket: '#5E6E46', jacketShade: '#4C5A38', accent: '#E9C46A', limb: '#3A3446', line: '#1A1622', shoe: '#D9534F', face: C.ink, hair: '#2A1C18', extra: 'curls' },
  // the formula's recurring cast (beats 5 and 6): Pip's little sister (draw her at about 0.7 of Pip's scale), his mum,
  // and the man in a suit who notices the power. All three are ours: plain shapes, no famous silhouettes.
  sis: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: '#3E8C86', jacketShade: '#2F6E69', accent: '#F28C6A', limb: '#3A3446', line: '#14121C', shoe: '#F28C6A', face: C.ink, hair: '#3A2620', extra: 'bunches' },
  mom: { skin: C.skin, skinShade: C.skinShade, hand: C.skin, jacket: '#8A5A6A', jacketShade: '#704858', accent: '#E9C46A', limb: '#3A3446', line: '#14121C', shoe: '#5A4A6A', face: C.ink, hair: '#5A3226', extra: 'bob' },
  // The ink cast: dark heads with light features, the genre's high-contrast convention (the thumbnails' look).
  // 'you' is the hero of the time-travel episodes, in an orange hoodie from the present; the rest wear the 1920s.
  you: { skin: INK, skinShade: INK2, hand: INK, jacket: '#F07A2A', jacketShade: '#C85E1C', accent: '#F6EFE3', limb: '#3B3646', line: '#100E16', shoe: '#F6EFE3', face: '#F6EFE3', hair: INK, extra: 'hood' },
  mo26: { skin: INK, skinShade: INK2, hand: INK, jacket: '#7A5A3A', jacketShade: '#62472D', accent: '#C9B48A', limb: '#4A4038', line: '#100E16', shoe: '#3A2A20', face: '#F6EFE3', hair: '#17131C', extra: 'curls', noPhones: true, hat: 'cap', hatColor: '#6B6458' },
  ellie: { skin: INK, skinShade: INK2, hand: INK, jacket: '#3E8C86', jacketShade: '#2F6E69', accent: '#F28C6A', limb: '#3B3646', line: '#100E16', shoe: '#F28C6A', face: '#F6EFE3', hair: '#17131C', extra: 'bunches' },
  mom26: { skin: INK, skinShade: INK2, hand: INK, jacket: '#8A5A6A', jacketShade: '#704858', accent: '#E9DCC0', limb: '#3B3646', line: '#100E16', shoe: '#5A4A6A', face: '#F6EFE3', hair: '#17131C', extra: 'bob' },
  suit26: { skin: INK, skinShade: INK2, hand: INK, jacket: '#5A5F6B', jacketShade: '#474B55', accent: '#7A1F2A', limb: '#3B3646', line: '#0E0F14', shoe: '#14151A', face: '#F6EFE3', hair: '#17141A', extra: 'suit', hat: 'fedora', hatColor: '#3E424C' },
  gent: { skin: INK, skinShade: INK2, hand: INK, jacket: '#5B4636', jacketShade: '#4A3829', accent: '#B8A27A', limb: '#3B3646', line: '#100E16', shoe: '#1E1712', face: '#F6EFE3', hair: '#17131C', extra: 'suit', hat: 'bowler', hatColor: '#211C1A' },
  worker: { skin: INK, skinShade: INK2, hand: INK, jacket: '#4E5A66', jacketShade: '#3E4852', accent: '#A89A80', limb: '#3B3646', line: '#100E16', shoe: '#2A2420', face: '#F6EFE3', hair: '#17131C', hat: 'cap', hatColor: '#5A5248' },
  lady: { skin: INK, skinShade: INK2, hand: INK, jacket: '#6E7F5E', jacketShade: '#58664A', accent: '#E9DCC0', limb: '#3B3646', line: '#100E16', shoe: '#3A2A30', face: '#F6EFE3', hair: '#17131C', extra: 'bob', hat: 'cloche', hatColor: '#A8505A' },
  doctor: { skin: INK, skinShade: INK2, hand: INK, jacket: '#2E3440', jacketShade: '#242833', accent: '#E9E4DA', limb: '#3B3646', line: '#0E0F14', shoe: '#14151A', face: '#F6EFE3', hair: '#B9B4AA', extra: 'suit' },
  cop: { skin: INK, skinShade: INK2, hand: INK, jacket: '#2A3A5E', jacketShade: '#1F2C48', accent: '#E9C46A', limb: '#3B3646', line: '#0E0F14', shoe: '#14151A', face: '#F6EFE3', hair: '#17131C', hat: 'cap', hatColor: '#1E2A44' },
  suit: { skin: '#D9C6AE', skinShade: '#C2AE96', hand: '#D9C6AE', jacket: '#2B2F3A', jacketShade: '#20232C', accent: '#A8323E', limb: '#2B2F3A', line: '#0E0F14', shoe: '#14151A', face: C.ink, hair: '#17141A', extra: 'suit' },
};

// ---------- period hats ----------
/** A hat on the rig's head (1920s episodes): flat cap, bowler, fedora with a band, or a cloche. Turns with yaw. */
const Hat: React.FC<{ kind: NonNullable<Look['hat']>; color: string; line: string; yaw: number }> = ({ kind, color, line, yaw }) => {
  const y = HEAD.y;
  const sx = yaw * 10;
  const dark = 'rgba(0,0,0,0.22)';
  const sw = 4;
  if (kind === 'bowler')
    return (
      <g transform={`translate(${-sx} 0)`}>
        <ellipse cx={0} cy={y - 40} rx={84} ry={16} fill={color} stroke={line} strokeWidth={sw} />
        <path d={`M -54 ${y - 42} Q -58 ${y - 118} 0 ${y - 120} Q 58 ${y - 118} 54 ${y - 42} Z`} fill={color} stroke={line} strokeWidth={sw} />
        <path d={`M 18 ${y - 112} Q 46 ${y - 100} 50 ${y - 50}`} stroke="#FFFFFF" strokeOpacity={0.18} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    );
  if (kind === 'fedora')
    return (
      <g transform={`translate(${-sx} 0)`}>
        <ellipse cx={0} cy={y - 42} rx={96} ry={18} fill={color} stroke={line} strokeWidth={sw} />
        <path d={`M -52 ${y - 44} L -46 ${y - 104} Q -20 ${y - 92} 0 ${y - 106} Q 20 ${y - 92} 46 ${y - 104} L 52 ${y - 44} Z`} fill={color} stroke={line} strokeWidth={sw} strokeLinejoin="round" />
        <path d={`M -50 ${y - 50} L 50 ${y - 50} L 51 ${y - 62} L -51 ${y - 62} Z`} fill="#17141A" />
      </g>
    );
  if (kind === 'cloche')
    return (
      <g transform={`translate(${-sx} 0)`}>
        <path d={`M -74 ${y - 4} Q -82 ${y - 96} 0 ${y - 100} Q 82 ${y - 96} 74 ${y - 4} Q 70 ${y - 30} 0 ${y - 34} Q -70 ${y - 30} -74 ${y - 4} Z`} fill={color} stroke={line} strokeWidth={sw} />
        <path d={`M -66 ${y - 36} Q 0 ${y - 54} 66 ${y - 36}`} stroke={dark} strokeWidth={10} fill="none" />
        <circle cx={46} cy={y - 46} r={10} fill="#E9DCC0" stroke={line} strokeWidth={3} />
      </g>
    );
  if (kind === 'fur')
    // a round fur hat pulled down to the brows, a lighter fur band, tufts on top
    return (
      <g transform={`translate(${-sx * 0.6} 0)`}>
        <path d={`M -70 ${y - 22} Q -74 ${y - 104} 0 ${y - 108} Q 74 ${y - 104} 70 ${y - 22} Z`} fill={color} stroke={line} strokeWidth={sw} strokeLinejoin="round" />
        <path d={`M -76 ${y - 20} Q 0 ${y - 48} 76 ${y - 20} L 74 ${y - 2} Q 0 ${y - 30} -74 ${y - 2} Z`} fill="#D8C2A0" stroke={line} strokeWidth={sw} strokeLinejoin="round" />
        <path d={`M -50 ${y - 70} q 10 -8 20 0 M -10 ${y - 88} q 10 -8 20 0 M 28 ${y - 72} q 10 -8 20 0`} stroke={dark} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>
    );
  if (kind === 'kerchief')
    // a linen headscarf over the hair, knotted at the nape, a short tail
    return (
      <g transform={`translate(${-sx * 0.6} 0)`}>
        <path d={`M -68 ${y - 4} Q -76 ${y - 92} 0 ${y - 94} Q 76 ${y - 92} 68 ${y - 4} Q 56 ${y - 46} 0 ${y - 50} Q -56 ${y - 46} -68 ${y - 4} Z`} fill={color} stroke={line} strokeWidth={sw} strokeLinejoin="round" />
        <path d={`M -56 ${y - 44} Q 0 ${y - 66} 56 ${y - 44}`} stroke={dark} strokeWidth={6} fill="none" />
      </g>
    );
  if (kind === 'helmet')
    // a Roman soldier's helmet: a metal bowl, a neck guard, cheek pieces and a red crest
    return (
      <g transform={`translate(${-sx} 0)`}>
        <path d={`M -54 ${y - 70} Q -40 ${y - 104} 0 ${y - 106} Q 40 ${y - 104} 54 ${y - 70} Z`} fill="#D9334A" stroke={line} strokeWidth={sw} />
        <path d={`M -70 ${y + 6} Q -78 ${y - 84} 0 ${y - 86} Q 78 ${y - 84} 70 ${y + 6} L 56 ${y + 4} Q 58 ${y - 34} 40 ${y - 44} Q 0 ${y - 54} -40 ${y - 44} Q -58 ${y - 34} -56 ${y + 4} Z`} fill={color} stroke={line} strokeWidth={sw} strokeLinejoin="round" />
        <path d={`M -70 ${y - 40} L 70 ${y - 40}`} stroke={line} strokeWidth={sw} />
        <path d={`M -34 ${y - 74} Q 0 ${y - 82} 34 ${y - 74}`} stroke="#FFFFFF" strokeOpacity={0.3} strokeWidth={6} fill="none" strokeLinecap="round" />
      </g>
    );
  if (kind === 'palla')
    // a woman's mantle drawn up over the head, falling to the shoulders
    return (
      <g transform={`translate(${-sx} 0)`}>
        <path d={`M -80 ${y + 60} Q -88 ${y - 84} 0 ${y - 86} Q 88 ${y - 84} 80 ${y + 60} L 60 ${y + 58} Q 66 ${y - 26} 44 ${y - 46} Q 0 ${y - 62} -44 ${y - 46} Q -66 ${y - 26} -60 ${y + 58} Z`} fill={color} stroke={line} strokeWidth={sw} strokeLinejoin="round" />
        <path d={`M -60 ${y - 60} Q 0 ${y - 74} 60 ${y - 60}`} stroke={dark} strokeWidth={6} fill="none" />
      </g>
    );
  if (kind === 'wreath')
    // a laurel wreath: two rows of small leaves round the crown
    return (
      <g transform={`translate(${-sx * 0.6} 0)`}>
        {Array.from({ length: 9 }).map((_, k) => {
          const a = Math.PI * (1.08 + (k / 8) * 0.84);
          const cx = Math.cos(a) * 64, cy = y - 10 + Math.sin(a) * 52;
          return <ellipse key={k} cx={cx} cy={cy} rx={13} ry={7} transform={`rotate(${(a * 180) / Math.PI + 90} ${cx} ${cy})`} fill={color} stroke={line} strokeWidth={3} />;
        })}
      </g>
    );
  // flat cap: a soft crown pulled forward, a short peak toward the way the face turns
  const f = yaw >= 0 ? 1 : -1;
  return (
    <g transform={`translate(${-sx} 0)`}>
      <path d={`M -66 ${y - 30} Q -72 ${y - 92} 0 ${y - 94} Q 70 ${y - 92} 70 ${y - 34} Q 0 ${y - 46} -66 ${y - 30} Z`} fill={color} stroke={line} strokeWidth={sw} strokeLinejoin="round" />
      <path d={`M ${f * 10} ${y - 38} Q ${f * 70} ${y - 44} ${f * 92} ${y - 30} Q ${f * 60} ${y - 22} ${f * 10} ${y - 30} Z`} fill={color} stroke={line} strokeWidth={sw} strokeLinejoin="round" />
      <path d={`M -40 ${y - 84} Q 0 ${y - 70} 40 ${y - 84}`} stroke={dark} strokeWidth={5} fill="none" />
    </g>
  );
};

// ---------- the hero ----------
/** Mitten hands: open (a palm and a thumb) or pointing (a fist with the index finger out). */
export type HandKind = 'open' | 'point';
export type Expr = 'neutral' | 'happy' | 'smug' | 'shock' | 'worried' | 'oops' | 'cool' | 'dizzy' | 'tired';
export type Limb = { a: number; b: number }; // a: upper segment angle, b: bend of the lower segment (degrees)
export type Pose = {
  x: number;
  y: number; // hip point
  scale: number;
  facing: 1 | -1;
  tilt: number; // torso lean around the hips, degrees, + leans screen-right
  spin: number; // whole-body rotation around the chest (tumbles)
  headTilt: number;
  armL: Limb;
  armR: Limb;
  legL: Limb;
  legR: Limb;
  expr: Expr;
  blink: number; // 0 open, 1 shut
  look: number; // -1..1 eye offset
  glasses: number; // 0..1
  yaw: number; // -1 profile facing screen-left, 0 front, 1 profile facing screen-right
  squash: number; // + squashes (landing), - stretches (jump), about the feet
  handL: HandKind;
  handR: HandKind;
  sway: number; // secondary motion: how far loose things (the hood's drawstrings) swing, degrees-ish
  glint?: number; // 0..1 the eyes light up in the power's colour (set it after poseAt: it isn't interpolated)
  glintColor?: string;
  talk?: number; // 0..1 how open the mouth is while speaking (from talkAt; set it after poseAt, it isn't interpolated)
};

export const basePose: Pose = {
  x: 960,
  y: 700,
  scale: 1,
  facing: 1,
  tilt: 0,
  spin: 0,
  headTilt: 0,
  armL: { a: 10, b: -8 },
  armR: { a: 10, b: -8 },
  legL: { a: 5, b: 0 },
  legR: { a: -5, b: 0 },
  expr: 'neutral',
  blink: 0,
  look: 0,
  glasses: 0,
  yaw: 0,
  squash: 0,
  handL: 'open',
  handR: 'open',
  sway: 0,
};

type Key = { f: number; p: Partial<Pose>; ease?: (t: number) => number };

const mixLimb = (a: Limb, b: Limb, t: number): Limb => ({ a: lerp(a.a, b.a, t), b: lerp(a.b, b.b, t) });

/** Interpolates every numeric part of a pose between keys; the face swaps (never morphs) at its key. */
export const poseAt = (f: number, keys: Key[], from: Pose = basePose): Pose => {
  // resolve each key into a full pose, carrying values forward
  const full: { f: number; p: Pose; ease?: (t: number) => number }[] = [];
  let cur = from;
  for (const k of keys) {
    cur = { ...cur, ...k.p };
    full.push({ f: k.f, p: cur, ease: k.ease });
  }
  if (f <= full[0].f) return full[0].p;
  for (let i = 0; i < full.length - 1; i++) {
    const A = full[i];
    const B = full[i + 1];
    if (f <= B.f) {
      const t = (B.ease ?? easeInOut)((f - A.f) / Math.max(1e-6, B.f - A.f));
      return {
        x: lerp(A.p.x, B.p.x, t),
        y: lerp(A.p.y, B.p.y, t),
        scale: lerp(A.p.scale, B.p.scale, t),
        facing: t < 0.5 ? A.p.facing : B.p.facing,
        tilt: lerp(A.p.tilt, B.p.tilt, t),
        spin: lerp(A.p.spin, B.p.spin, t),
        headTilt: lerp(A.p.headTilt, B.p.headTilt, t),
        armL: mixLimb(A.p.armL, B.p.armL, t),
        armR: mixLimb(A.p.armR, B.p.armR, t),
        legL: mixLimb(A.p.legL, B.p.legL, t),
        legR: mixLimb(A.p.legR, B.p.legR, t),
        expr: A.p.expr, // a face swaps when its own key lands, so hold the earlier one
        handL: A.p.handL,
        handR: A.p.handR,
        blink: lerp(A.p.blink, B.p.blink, t),
        look: lerp(A.p.look, B.p.look, t),
        glasses: lerp(A.p.glasses, B.p.glasses, t),
        yaw: lerp(A.p.yaw, B.p.yaw, t),
        squash: lerp(A.p.squash, B.p.squash, t),
        sway: lerp(A.p.sway, B.p.sway, t),
      };
    }
  }
  return full[full.length - 1].p;
};

// body measurements (local space: hips at 0,0, y down)
const UPPER_ARM = 62;
const FORE_ARM = 58;
const THIGH = 72;
const SHIN = 68;
const SHOULDER = { x: 42, y: -108 };
const HIP = { x: 17, y: 0 };
export const HEAD = { x: 0, y: -176, r: 62 };
export const LEG_LEN = THIGH + SHIN;

const rad = (d: number) => (d * Math.PI) / 180;
type P = { x: number; y: number };
const rot = (p: P, deg: number, c: P = { x: 0, y: 0 }): P => {
  const r = rad(deg);
  const dx = p.x - c.x;
  const dy = p.y - c.y;
  return { x: c.x + dx * Math.cos(r) - dy * Math.sin(r), y: c.y + dx * Math.sin(r) + dy * Math.cos(r) };
};

/** Joint positions in local space (before the hip translate/scale), so scenes can attach props to hands. */
export const joints = (pose: Pose) => {
  const side = (s: 1 | -1, limb: Limb, root: P, l1: number, l2: number, isLeg: boolean) => {
    // arms swing outward (away from the body) on their own side; legs swing forward in the facing direction
    const dir = isLeg ? pose.facing : s;
    const d1 = { x: dir * Math.sin(rad(limb.a)), y: Math.cos(rad(limb.a)) };
    const mid = { x: root.x + d1.x * l1, y: root.y + d1.y * l1 };
    const a2 = limb.a + limb.b;
    const d2 = { x: dir * Math.sin(rad(a2)), y: Math.cos(rad(a2)) };
    return { root, mid, end: { x: mid.x + d2.x * l2, y: mid.y + d2.y * l2 } };
  };
  const torsoRot = (p: P) => rot(p, pose.tilt);
  const sp = limbSpread(pose.yaw);
  const shL = { x: -SHOULDER.x * sp + pose.yaw * 6, y: SHOULDER.y };
  const shR = { x: SHOULDER.x * sp + pose.yaw * 6, y: SHOULDER.y };
  const armL = side(-1, pose.armL, shL, UPPER_ARM, FORE_ARM, false);
  const armR = side(1, pose.armR, shR, UPPER_ARM, FORE_ARM, false);
  const legL = side(-1, pose.legL, { x: -HIP.x * sp, y: 0 }, THIGH, SHIN, true);
  const legR = side(1, pose.legR, { x: HIP.x * sp, y: 0 }, THIGH, SHIN, true);
  const r = (o: { root: P; mid: P; end: P }) => ({ root: torsoRot(o.root), mid: torsoRot(o.mid), end: torsoRot(o.end) });
  return { armL: r(armL), armR: r(armR), legL, legR, head: torsoRot(HEAD) };
};

/** How wide the body reads as it turns: full width face-on, about 60% in profile. */
export const turnWidth = (yaw: number) => 1 - 0.4 * Math.min(1, Math.abs(yaw));
/** Shoulders and hips close up as he turns, so in profile the limbs overlap the body. */
export const limbSpread = (yaw: number) => 1 - 0.85 * Math.min(1, Math.abs(yaw));

/** Face swaps happen through a blink: two frames shut either side of each change, as in the genre. */
export const faceAt = (f: number, keys: [number, Expr][]): { expr: Expr; blink: number } => {
  let expr = keys[0][1];
  let blink = 0;
  for (let i = 0; i < keys.length; i++) {
    const [k, e] = keys[i];
    if (f >= k) expr = e;
    if (i > 0 && f >= k - 2 && f < k + 1) blink = 1;
  }
  return { expr, blink };
};

/** A local point to world space, for attaching props (the mug in Pip's hand). */
export const toWorld = (pose: Pose, p: P): P => {
  const spun = rot(p, pose.spin, { x: 0, y: -90 });
  return { x: pose.x + spun.x * pose.scale, y: pose.y + spun.y * pose.scale };
};

/** Straight-arm reach: the right arm angle (local) that points the hand at a world target. */
export const reachAngle = (pose: Pose, target: P) => {
  const sh = toWorld(pose, rot({ x: SHOULDER.x * limbSpread(pose.yaw) + pose.yaw * 6, y: SHOULDER.y }, pose.tilt));
  const world = (Math.atan2(target.x - sh.x, target.y - sh.y) * 180) / Math.PI; // 0 = straight down
  return world - pose.tilt;
};

const Face: React.FC<{ expr: Expr; blink: number; look: number; glasses: number; yaw?: number; ink?: string; glint?: number; glintColor?: string; talk?: number }> = ({ expr, blink, look, glasses, yaw = 0, ink = C.ink, glint = 0, glintColor = '#8FF0FF', talk = 0 }) => {
  const ex = look * 7;
  const ay = Math.min(1, Math.abs(yaw));
  const farHidden = ay > 0.72;
  const farSide = yaw > 0 ? -1 : 1; // facing screen-right hides the screen-left eye
  const eyeY = HEAD.y - 4;
  // heavy lids: half shut when smug or cool, more than half when tired (with dark rings under the eyes)
  const lid = expr === 'smug' || expr === 'cool' ? 0.45 : expr === 'tired' ? 0.58 : 0;
  const open = Math.max(0.08, 1 - Math.max(blink, lid));
  const eye = (cx: number) => {
    if (farHidden && Math.sign(cx) === farSide) return null;
    if (expr === 'happy') return <path d={`M ${cx - 10} ${eyeY + 3} Q ${cx} ${eyeY - 9} ${cx + 10} ${eyeY + 3}`} stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" />;
    if (expr === 'oops') return <path d={`M ${cx - 9} ${eyeY - 6} L ${cx + 4} ${eyeY} L ${cx - 9} ${eyeY + 6}`} transform={cx > 0 ? `translate(${2 * cx},0) scale(-1,1)` : undefined} stroke={ink} strokeWidth={6} fill="none" strokeLinecap="round" strokeLinejoin="round" />;
    if (expr === 'dizzy') return <g stroke={ink} strokeWidth={5} strokeLinecap="round"><path d={`M ${cx - 7} ${eyeY - 7} L ${cx + 7} ${eyeY + 7} M ${cx + 7} ${eyeY - 7} L ${cx - 7} ${eyeY + 7}`} /></g>;
    // shut (a blink's middle frame, or asleep): the closed lid's curve, with the tired rings kept
    if (blink >= 0.95)
      return (
        <g>
          <path d={`M ${cx - 12} ${eyeY + 1} Q ${cx} ${eyeY + 8} ${cx + 12} ${eyeY + 1}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />
          {expr === 'tired' ? <path d={`M ${cx - 12} ${eyeY + 15} Q ${cx} ${eyeY + 22} ${cx + 12} ${eyeY + 15}`} stroke="#8C7AA6" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.85} /> : null}
        </g>
      );
    const big = expr === 'shock';
    const rx = big ? 11 : 7;
    const ry = (big ? 13 : 10) * open;
    return (
      <g>
        <ellipse cx={cx + ex} cy={eyeY + (lid ? 3 : 0)} rx={rx} ry={ry} fill={ink} />
        {big && open > 0.5 ? <circle cx={cx + ex + 3.5} cy={eyeY - 4} r={3.4} fill="#fff" /> : null}
        {lid ? <path d={expr === 'tired' ? `M ${cx - 13} ${eyeY - 1} Q ${cx} ${eyeY - 5} ${cx + 13} ${eyeY - 1}` : `M ${cx - 12} ${eyeY - 4} L ${cx + 12} ${eyeY - 2}`} stroke={ink} strokeWidth={4} strokeLinecap="round" fill="none" /> : null}
        {expr === 'tired' ? <path d={`M ${cx - 12} ${eyeY + 14} Q ${cx} ${eyeY + 21} ${cx + 12} ${eyeY + 14}`} stroke="#8C7AA6" strokeWidth={4.5} fill="none" strokeLinecap="round" opacity={0.85} /> : null}
      </g>
    );
  };
  const brows: Record<Expr, string> = {
    neutral: '',
    happy: '',
    smug: `M -34 ${eyeY - 22} L -12 ${eyeY - 20} M 12 ${eyeY - 26} L 34 ${eyeY - 30}`,
    shock: `M -32 ${eyeY - 28} Q -21 ${eyeY - 36} -10 ${eyeY - 29} M 10 ${eyeY - 29} Q 21 ${eyeY - 36} 32 ${eyeY - 28}`,
    worried: `M -32 ${eyeY - 18} L -12 ${eyeY - 26} M 12 ${eyeY - 26} L 32 ${eyeY - 18}`,
    oops: `M -32 ${eyeY - 20} L -12 ${eyeY - 16} M 12 ${eyeY - 16} L 32 ${eyeY - 20}`,
    cool: '',
    dizzy: '',
    tired: `M -33 ${eyeY - 17} Q -22 ${eyeY - 21} -11 ${eyeY - 19} M 11 ${eyeY - 19} Q 22 ${eyeY - 21} 33 ${eyeY - 17}`,
  };
  const mY = HEAD.y + 28;
  const mouth: Record<Expr, React.ReactNode> = {
    neutral: <path d={`M -10 ${mY} Q 0 ${mY + 4} 10 ${mY}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    happy: <path d={`M -18 ${mY - 4} Q 0 ${mY + 20} 18 ${mY - 4} Z`} fill={ink} />,
    smug: <path d={`M -12 ${mY + 2} Q 4 ${mY + 8} 16 ${mY - 6}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    shock: <ellipse cx={0} cy={mY + 4} rx={10} ry={14} fill={ink} />,
    worried: <path d={`M -16 ${mY + 4} Q -8 ${mY - 4} 0 ${mY + 4} Q 8 ${mY + 12} 16 ${mY + 4}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    oops: <g><rect x={-18} y={mY - 6} width={36} height={16} rx={6} fill={ink} /><path d={`M -14 ${mY + 2} L 14 ${mY + 2}`} stroke="#fff" strokeWidth={3} /></g>,
    cool: <path d={`M -12 ${mY + 2} Q 4 ${mY + 8} 16 ${mY - 6}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    dizzy: <path d={`M -14 ${mY + 4} Q -7 ${mY - 4} 0 ${mY + 4} Q 7 ${mY + 12} 14 ${mY + 4}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
    tired: <path d={`M -11 ${mY + 4} Q 0 ${mY} 11 ${mY + 4}`} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" />,
  };
  return (
    <g transform={`translate(${yaw * 30} 0) scale(${1 - 0.28 * ay} 1)`}>
      {eye(-21)}
      {eye(21)}
      {brows[expr] ? <path d={brows[expr]} stroke={ink} strokeWidth={5} fill="none" strokeLinecap="round" /> : null}
      {talk > 0.05 ? (
        // speaking: an open mouth whose height follows the syllables; keeps a smile's width when happy
        <ellipse cx={0} cy={mY + 4} rx={expr === 'happy' ? 16 : 11} ry={3 + 11 * Math.min(1, talk)} fill={ink} />
      ) : (
        mouth[expr]
      )}
      {expr === 'shock' || expr === 'oops' ? <path d={`M 52 ${HEAD.y - 30} q 6 10 0 16 q -6 -6 0 -16 Z`} fill="#8FD3FF" /> : null}
      {/* a power lighting the eyes: a soft halo, a bright iris, a white catchlight (none while the lids are shut) */}
      {glint > 0.01 && blink < 0.95
        ? [-21, 21].map((cx) =>
            farHidden && Math.sign(cx) === farSide ? null : (
              <g key={`gl${cx}`} opacity={Math.min(1, glint)}>
                <circle cx={cx + ex} cy={eyeY} r={17} fill={glintColor} opacity={0.2} />
                <circle cx={cx + ex} cy={eyeY} r={12} fill={glintColor} opacity={0.28} />
                <ellipse cx={cx + ex} cy={eyeY + (lid ? 3 : 0)} rx={8} ry={Math.max(2, 11 * open)} fill={glintColor} />
                <circle cx={cx + ex + 2.5} cy={eyeY - 3} r={2.6} fill="#FFFFFF" />
              </g>
            ),
          )
        : null}
      {glasses > 0.01 ? (
        <g opacity={glasses} transform={`translate(0 ${(1 - glasses) * -60})`}>
          {/* classic shades: a full bar across, two big lenses, one bright glint so it reads at feed size */}
          <path d={`M -58 ${eyeY - 12} L 58 ${eyeY - 12}`} stroke={ink} strokeWidth={6} strokeLinecap="round" />
          <path d={`M -50 ${eyeY - 14} L -6 ${eyeY - 14} L -10 ${eyeY + 8} Q -28 ${eyeY + 18} -46 ${eyeY + 8} Z`} fill="#0D0F1C" stroke={ink} strokeWidth={3} />
          <path d={`M 6 ${eyeY - 14} L 50 ${eyeY - 14} L 46 ${eyeY + 8} Q 28 ${eyeY + 18} 10 ${eyeY + 8} Z`} fill="#0D0F1C" stroke={ink} strokeWidth={3} />
          <path d={`M -40 ${eyeY + 2} L -26 ${eyeY - 10} M 16 ${eyeY + 2} L 30 ${eyeY - 10}`} stroke="#ffffff" strokeWidth={4} strokeLinecap="round" opacity={0.85} />
        </g>
      ) : null}
    </g>
  );
};

export const Hero: React.FC<{ pose: Pose; shadow?: number; rimId?: string; look?: Look }> = ({ pose, shadow = 1, rimId = 'rimR', look = LOOKS.pipHood }) => {
  const j = joints(pose);
  const L = look;
  // limbs are light with a dark outline, so they read on the dark sets (navy limbs vanished on navy walls)
  const limb = (o: { root: P; mid: P; end: P }, w: number) => {
    const d = `M ${o.root.x} ${o.root.y} L ${o.mid.x} ${o.mid.y} L ${o.end.x} ${o.end.y}`;
    return (
      <g>
        <path d={d} stroke={L.line} strokeWidth={w + 7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <path d={d} stroke={L.limb} strokeWidth={w} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    );
  };
  const shoe = (o: { root: P; mid: P; end: P }) => (
    <ellipse cx={o.end.x + pose.facing * 9} cy={o.end.y + 4} rx={22} ry={11} fill={L.shoe} stroke={L.line} strokeWidth={4} />
  );
  // a mitten along the forearm: the palm, the thumb toward the body, two knuckle marks; or a pointing fist
  const hand = (o: { mid: P; end: P }, side: 1 | -1, kind: HandKind) => {
    const ang = (Math.atan2(o.end.x - o.mid.x, o.end.y - o.mid.y) * 180) / Math.PI;
    return (
      <g transform={`translate(${o.end.x} ${o.end.y}) rotate(${-ang})`}>
        {kind === 'point' ? (
          <g>
            <rect x={-4} y={10} width={8} height={24} rx={4} fill={L.hand} stroke={L.line} strokeWidth={3.5} />
            <path d="M -11 -2 Q -14 14 -6 18 L 7 18 Q 14 14 11 -2 Z" fill={L.hand} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
            <ellipse cx={side * 10} cy={6} rx={4.5} ry={7} fill={L.hand} stroke={L.line} strokeWidth={3.5} />
          </g>
        ) : (
          <g>
            <ellipse cx={side * 10} cy={3} rx={5.5} ry={9} transform={`rotate(${side * -28} ${side * 10} 3)`} fill={L.hand} stroke={L.line} strokeWidth={4} />
            <ellipse cx={0} cy={10} rx={11} ry={15} fill={L.hand} stroke={L.line} strokeWidth={4} />
            <path d="M -4 17 L -4 23 M 3 18 L 3 24" stroke={L.line} strokeWidth={2} opacity={0.45} strokeLinecap="round" />
          </g>
        )}
      </g>
    );
  };
  const kw = turnWidth(pose.yaw);
  const torso = (
    <g transform={`rotate(${pose.tilt}) translate(${pose.yaw * 6} 0) scale(${kw} 1)`}>
      <path d="M -46 -112 Q 0 -124 46 -112 L 40 2 Q 0 12 -40 2 Z" fill={L.jacket} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
      <path d="M 10 -116 Q 30 -114 46 -112 L 40 2 Q 26 8 12 9 Z" fill={L.jacketShade} opacity={0.55} />
      {L.robe ? null : <path d="M 0 -112 L 0 4" stroke={L.jacketShade} strokeWidth={4} />}
      {L.robe ? (
        // the tunic's skirt over the thighs (a long one for a dress or a toga), a belt at the waist
        <g>
          <path d={L.robe === 'tunic' ? 'M -42 -14 L 42 -14 L 56 64 Q 0 76 -56 64 Z' : 'M -42 -14 L 42 -14 L 60 112 Q 0 126 -60 112 Z'} fill={L.robe === 'toga' ? (L.toga ?? '#EDE6D6') : L.jacket} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
          <path d={L.robe === 'tunic' ? 'M 14 -12 L 42 -14 L 56 64 Q 36 70 18 72 Z' : 'M 14 -12 L 42 -14 L 60 112 Q 40 118 20 120 Z'} fill={L.robe === 'toga' ? '#000' : L.jacketShade} opacity={L.robe === 'toga' ? 0.12 : 0.55} />
          {L.robe === 'toga' ? <path d="M -60 112 Q 0 126 60 112" stroke={L.stripe ?? 'none'} strokeWidth={9} fill="none" /> : null}
          <path d="M -10 -4 L -14 60 M 22 -4 L 28 58" stroke={L.line} strokeWidth={3} opacity={0.25} />
          {L.robe !== 'toga' ? <path d="M -44 -22 Q 0 -14 44 -22" stroke={L.belt ?? L.accent} strokeWidth={9} fill="none" strokeLinecap="round" /> : null}
        </g>
      ) : null}
      {L.robe === 'toga' ? (
        // the toga: a wide band of cloth from the left shoulder across the chest to the right hip, its edge striped
        <g>
          <path d="M -48 -118 Q -20 -124 -4 -116 L 48 -24 L 44 4 Q 20 2 10 -10 L -44 -96 Z" fill={L.toga ?? '#EDE6D6'} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
          {L.stripe ? <path d="M -4 -116 L 48 -24" stroke={L.stripe} strokeWidth={10} strokeLinecap="round" /> : null}
          <path d="M -30 -100 Q -2 -70 22 -30 M -20 -110 Q 10 -76 34 -40" stroke={L.line} strokeWidth={3} opacity={0.22} fill="none" />
        </g>
      ) : null}
      {L.robe ? null : L.extra === 'suit' ? (
        // a white shirt in the V of the jacket and a tie in the accent colour
        <g>
          <path d="M -24 -116 L 0 -54 L 24 -116 Z" fill="#EDE8DE" />
          <path d="M -7 -112 L 7 -112 L 9 -100 L 5 -64 L 0 -56 L -5 -64 L -9 -100 Z" fill={L.accent} />
          <path d="M -26 -116 L 0 -54 M 26 -116 L 0 -54" stroke={L.line} strokeWidth={4} />
        </g>
      ) : (
        <path d="M -22 -118 Q 0 -100 22 -118" stroke={L.accent} strokeWidth={6} fill="none" strokeLinecap="round" />
      )}
      {L.keys ? (
        <g>
          <circle cx={-26} cy={-6} r={9} fill="none" stroke="#C8A040" strokeWidth={4} />
          <path d="M -30 2 L -34 34 M -24 2 L -20 30 M -34 34 l -6 0 M -20 30 l 6 0" stroke="#C8A040" strokeWidth={4} strokeLinecap="round" />
        </g>
      ) : null}
      {L.cloak ? (
        // a wool cloak over both shoulders, open at the front, pinned on the right shoulder with a round brooch
        <g>
          <path d="M -52 -118 Q 0 -132 52 -118 L 60 -40 L 40 -46 L 36 -104 Q 0 -112 -36 -104 L -40 -46 L -60 -40 Z" fill={L.cloak} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
          <circle cx={30} cy={-106} r={11} fill="#D8B040" stroke={L.line} strokeWidth={3} />
        </g>
      ) : null}
    </g>
  );
  const head = (
    <g transform={`rotate(${pose.tilt}) rotate(${pose.headTilt} 0 ${HEAD.y + 40})`}>
      <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill={L.skin} stroke={L.line} strokeWidth={4} />
      <path d={`M ${HEAD.x + 14} ${HEAD.y + 58} A ${HEAD.r} ${HEAD.r} 0 0 0 ${HEAD.x + 60} ${HEAD.y + 14} A 70 70 0 0 1 ${HEAD.x + 14} ${HEAD.y + 58} Z`} fill={L.skinShade} />
      {L.extra === 'bunches' || L.extra === 'bob' || L.extra === 'suit' ? null : (
        <path transform={`translate(${-pose.yaw * 16} 0)`} d={`M -6 ${HEAD.y - 60} q 10 -26 30 -18 q -16 2 -14 16 q -8 -10 -16 2 Z`} fill={L.hair} />
      )}
      {L.extra === 'bunches' ? (
        // a fringe cap and two bunches tied with coral bands; the bunches swing a little with sway
        <g>
          {[-1, 1].map((sd) => (
            <g key={sd} transform={`rotate(${pose.sway * 0.5} ${sd * 58} ${HEAD.y - 30})`}>
              <circle cx={sd * 72 - pose.yaw * 10} cy={HEAD.y - 24} r={24} fill={L.hair} stroke={L.line} strokeWidth={4} />
              <circle cx={sd * 55 - pose.yaw * 10} cy={HEAD.y - 30} r={8} fill={L.accent} />
            </g>
          ))}
          <path transform={`translate(${-pose.yaw * 14} 0)`} d={`M -60 ${HEAD.y - 22} Q -62 ${HEAD.y - 66} 0 ${HEAD.y - 66} Q 62 ${HEAD.y - 66} 60 ${HEAD.y - 22} Q 40 ${HEAD.y - 46} 14 ${HEAD.y - 40} Q 0 ${HEAD.y - 50} -14 ${HEAD.y - 40} Q -40 ${HEAD.y - 46} -60 ${HEAD.y - 22} Z`} fill={L.hair} />
        </g>
      ) : null}
      {L.extra === 'bob' ? (
        // a chin-length bob framing the face, a side parting
        <path
          transform={`translate(${-pose.yaw * 12} 0)`}
          d={`M -74 ${HEAD.y + 34} Q -84 ${HEAD.y - 70} 0 ${HEAD.y - 72} Q 84 ${HEAD.y - 70} 74 ${HEAD.y + 34} L 56 ${HEAD.y + 34} Q 60 ${HEAD.y - 20} 40 ${HEAD.y - 40} Q 10 ${HEAD.y - 34} -16 ${HEAD.y - 48} Q -52 ${HEAD.y - 30} -56 ${HEAD.y + 34} Z`}
          fill={L.hair}
          stroke={L.line}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      ) : null}
      {L.extra === 'suit' ? (
        // short combed-back hair with a hard side parting
        <path transform={`translate(${-pose.yaw * 14} 0)`} d={`M -60 ${HEAD.y - 18} Q -64 ${HEAD.y - 70} 4 ${HEAD.y - 68} Q 64 ${HEAD.y - 64} 60 ${HEAD.y - 18} Q 52 ${HEAD.y - 44} 18 ${HEAD.y - 46} L 12 ${HEAD.y - 54} L 6 ${HEAD.y - 46} Q -44 ${HEAD.y - 46} -60 ${HEAD.y - 18} Z`} fill={L.hair} />
      ) : null}
      <Face expr={pose.expr} blink={pose.blink} look={pose.look} glasses={pose.glasses} yaw={pose.yaw} ink={L.face} glint={pose.glint} glintColor={pose.glintColor} talk={pose.talk} />
      {L.beard ? (
        // a full beard from cheek to cheek, the mouth left clear above it, a lighter streak down the middle
        <g transform={`translate(${pose.yaw * 14} 0)`}>
          <path d={`M -60 ${HEAD.y + 4} Q -66 ${HEAD.y + 96} -4 ${HEAD.y + 118} Q 4 ${HEAD.y + 122} 12 ${HEAD.y + 116} Q 70 ${HEAD.y + 92} 62 ${HEAD.y + 4} Q 50 ${HEAD.y + 34} 34 ${HEAD.y + 42} Q 4 ${HEAD.y + 52} -28 ${HEAD.y + 42} Q -48 ${HEAD.y + 34} -60 ${HEAD.y + 4} Z`} fill={L.beard} stroke={L.line} strokeWidth={4} strokeLinejoin="round" />
          <path d={`M -16 ${HEAD.y + 24} Q 4 ${HEAD.y + 16} 24 ${HEAD.y + 24}`} stroke={L.beard} strokeWidth={10} strokeLinecap="round" fill="none" />
          <path d={`M 2 ${HEAD.y + 62} L 4 ${HEAD.y + 104}`} stroke="#FFFFFF" strokeOpacity={0.22} strokeWidth={6} strokeLinecap="round" />
        </g>
      ) : null}
      {L.extra === 'curls'
        ? [-150, -125, -100, -78, -55, -30].map((deg, k) => {
            const a = (deg * Math.PI) / 180;
            return <circle key={k} cx={Math.cos(a) * 54} cy={HEAD.y + Math.sin(a) * 54} r={24} fill={L.hair} />;
          })
        : null}
      {L.hat ? <Hat kind={L.hat} color={L.hatColor ?? '#2A2420'} line={L.line} yaw={pose.yaw} /> : null}
    </g>
  );
  return (
    <g>
      {shadow > 0 ? <ellipse cx={pose.x} cy={pose.y + LEG_LEN * pose.scale + 10} rx={70 * pose.scale} ry={12 * pose.scale} fill="#000" opacity={0.25 * shadow} /> : null}
      <g transform={`translate(${pose.x} ${pose.y}) scale(${pose.scale}) rotate(${pose.spin} 0 -90)`} filter={`url(#${rimId})`}>
        <g transform={`translate(0 ${LEG_LEN}) scale(${1 + 0.6 * pose.squash} ${1 - pose.squash}) translate(0 ${-LEG_LEN})`}>
          {/* the far side is drawn first, so a turned body overlaps itself the right way */}
          {pose.yaw < 0 ? <>{limb(j.legR, 12)}{shoe(j.legR)}{limb(j.legL, 12)}{shoe(j.legL)}</> : <>{limb(j.legL, 12)}{shoe(j.legL)}{limb(j.legR, 12)}{shoe(j.legR)}</>}
          {pose.yaw < 0 ? <>{limb(j.armR, 11)}{hand(j.armR, -1, pose.handR)}</> : <>{limb(j.armL, 11)}{hand(j.armL, 1, pose.handL)}</>}
          {torso}
          {pose.yaw < 0 ? <>{limb(j.armL, 11)}{hand(j.armL, 1, pose.handL)}</> : <>{limb(j.armR, 11)}{hand(j.armR, -1, pose.handR)}</>}
          {L.extra === 'hood' ? (
            <g transform={`rotate(${pose.tilt}) rotate(${pose.headTilt * 0.5} 0 ${HEAD.y + 40})`}>
              <path d={`M -70 ${HEAD.y + 14} Q -80 ${HEAD.y - 74} 0 ${HEAD.y - 80} Q 80 ${HEAD.y - 74} 70 ${HEAD.y + 14} Q 52 -100 0 -106 Q -52 -100 -70 ${HEAD.y + 14} Z`} fill={L.jacket} stroke={L.line} strokeWidth={4} />
              {(() => {
                const sw = pose.sway * 0.7 - pose.tilt * 0.6;
                return (
                  <g>
                    <path d={`M -12 -108 Q ${-14 + sw * 0.3} -88 ${-16 + sw} -66 M 12 -108 Q ${14 + sw * 0.3} -88 ${16 + sw} -66`} stroke={L.accent} strokeWidth={5} strokeLinecap="round" fill="none" />
                    <circle cx={-16 + sw} cy={-64} r={5} fill={L.accent} />
                    <circle cx={16 + sw} cy={-64} r={5} fill={L.accent} />
                  </g>
                );
              })()}
            </g>
          ) : null}
          {L.extra === 'curls' && !L.noPhones ? (
            <g transform={`rotate(${pose.tilt})`}>
              <path d="M -46 -110 Q 0 -86 46 -110" stroke="#E06A5A" strokeWidth={8} fill="none" strokeLinecap="round" />
              <rect x={-60} y={-126} width={20} height={32} rx={8} fill="#E06A5A" stroke={L.line} strokeWidth={4} />
              <rect x={40} y={-126} width={20} height={32} rx={8} fill="#E06A5A" stroke={L.line} strokeWidth={4} />
            </g>
          ) : null}
          {head}
        </g>
      </g>
    </g>
  );
};


/** A character is the rig in a costume: <Actor> is the same as <Hero>, named for scenes with more than one person. */
export const Actor = Hero;

/**
 * A walk in profile. `phase` advances about 0.6 a frame for a normal walk; `ground` is the floor height under the hips
 * (a number, or a function of x for stairs and slopes). Leans into the step, bobs the head, bends the elbows, swings
 * loose things (the drawstrings) a beat behind the body.
 */
export const walkPose = (x: number, phase: number, ground: number | ((x: number) => number), scale = 0.9, extra: Partial<Pose> = {}, facing: 1 | -1 = 1): Pose => {
  const s = Math.sin(phase);
  const g = typeof ground === 'number' ? ground : ground(x);
  return {
    ...basePose,
    x,
    y: g - LEG_LEN * scale - Math.abs(Math.cos(phase)) * 7,
    scale,
    facing,
    yaw: facing,
    tilt: 5 * facing,
    headTilt: 2 * Math.sin(phase * 2),
    sway: 10 * Math.sin(phase + 0.8),
    legL: { a: 28 * s, b: -Math.max(0, 40 * Math.sin(phase + 1.2)) },
    legR: { a: -28 * s, b: -Math.max(0, 40 * Math.sin(phase + 1.2 + Math.PI)) },
    armL: { a: 24 * s, b: 12 + 14 * Math.abs(s) },
    armR: { a: 24 * s, b: 12 + 14 * Math.abs(s) },
    ...extra,
  };
};

/** Where the feet are for a pose standing at hip y: use it to put a character on a floor (y = floor - feetBelowHips). */
export const feetBelowHips = (scale: number) => LEG_LEN * scale;
