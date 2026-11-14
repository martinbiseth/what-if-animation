import React from 'react';
import {
  Smartphone, Hero, LOOKS, Look, Pose, PhoneInHand, ScreenMode, ShotProps, Word, basePose, camT, clamp, kf, lerp, rnd, joints, toWorld,
  talkShot, idleBlink, faceAt, Expr, talkAt, FONT, backOut, Suburb, suburbHip, Tod, Shop, RadioRoom, Kitchen, Bedroom, WifiIcon, CastSpec,
} from '../../engine';

// Shared by every chapter of "What if the internet just disappeared forever?": the cast (the ink cast in modern
// clothes), the day counter HUD, word spans for lip sync, sets as clocked components, and the shot builders.

const noHat = (l: Look): Look => ({ ...l, hat: undefined, hatColor: undefined, noPhones: undefined });

export const YOU = LOOKS.you;
export const MO: Look = { ...noHat(LOOKS.mo26), jacket: '#4E7A4A', jacketShade: '#3E6238', accent: '#E9C46A', shoe: '#E8504A' };
export const ELLIE = LOOKS.ellie;
export const MUM: Look = { ...LOOKS.mom26, jacket: '#8A5A8A', jacketShade: '#704870' };
export const DAD: Look = { ...noHat(LOOKS.worker), jacket: '#3A5A8A', jacketShade: '#2E4A72', accent: '#C8D0E0' };
export const SUIT: Look = noHat(LOOKS.suit26);
export const NURSE: Look = { ...noHat(LOOKS.doctor), jacket: '#4AA8A0', jacketShade: '#3A8A84', accent: '#E9F0F0', hair: '#17131C' };
export const FARMER: Look = { ...LOOKS.worker, jacket: '#6A7A3A', jacketShade: '#566230', hatColor: '#8A6A3A' };
export const N1: Look = { ...noHat(LOOKS.gent), jacket: '#B8503A', jacketShade: '#9A4030', extra: undefined };
export const N2: Look = { ...noHat(LOOKS.lady), jacket: '#E8A83A', jacketShade: '#C88A2A' };
export const N3: Look = { ...noHat(LOOKS.worker), jacket: '#5A4A8A', jacketShade: '#4A3A72' };
export const GRAN: Look = { ...noHat(LOOKS.doctor), jacket: '#A8708A', jacketShade: '#8A5A72', hair: '#D8D4CC', extra: 'bob' };
export const KID: Look = { ...LOOKS.ellie, jacket: '#E8C04A', jacketShade: '#C8A03A', extra: undefined };
const NEIGHBOURS = [N1, N2, N3, DAD, GRAN, NURSE, MUM, KID];

// ---------------------------------------------------------------- sets with a clock
export type SetC = React.FC<{ t: number; id?: string }>;
export const StreetSet = (tod: Tod = 'day', o: { cars?: boolean; drive?: boolean; lit?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Suburb t={t} id={id} tod={tod} cars={o.cars ?? true} drive={o.drive} windowsLit={o.lit} />;
  return S;
};
export const ShopSet = (empty = 0): SetC => {
  const S: SetC = ({ t, id }) => <Shop t={t} id={id} empty={empty} />;
  return S;
};
export const RadioSet = (onAir = 0, dawn = 0): SetC => {
  const S: SetC = ({ t, id }) => <RadioRoom t={t} id={id} onAir={onAir} dawn={dawn} />;
  return S;
};
export const KitchenSet = (veil = 0.35): SetC => {
  const S: SetC = ({ t, id }) => <Kitchen t={t} id={id} veil={veil} />;
  return S;
};
export const BedroomSet = (o: { veil?: number; clock?: string } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Bedroom t={t} id={id} veil={o.veil ?? 0.2} clock={o.clock ?? '07:42'} lamp={0} />;
  return S;
};
export const HIP = suburbHip(1);

// ---------------------------------------------------------------- the HUD: the day, offline
/** A chip top right: the crossed-out Wi-Fi and "DAY n" (the episode's clock). Hidden on chapter cards. */
export const dayHud = (label: string, hideUntil = 20): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
    if (f < hideUntil) return null;
    const pop = clamp((f - hideUntil) / 8);
    const w = 150 + label.length * 30;
    return (
      <g transform={`translate(${1860 - w} 70)`} opacity={pop}>
        <rect x={0} y={0} width={w} height={86} rx={43} fill="#0B0816" opacity={0.65} />
        <WifiIcon x={56} y={32} s={0.26} off />
        <text x={102} y={58} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#F6EFE3">{label}</text>
      </g>
    );
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
          <PhoneInHand x={o.x ?? 960} y={(o.y ?? 520) + bob} s={o.s ?? 1.25} rot={o.rot ?? (o.from === 'left' ? 4 : -4)} from={o.from ?? 'right'} mode={mode} t={t} battery={o.battery ?? 70} text={text} bars={0} buzz={o.buzz ? o.buzz(t) : 0} time={o.time ?? '7:42'} sleeve={o.sleeve} />
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

/** A character close-up: one face filling the frame over a soft set, for reactions. */
export const faceCU = (o: {
  look: Look; Bg: SetC; faces: [number, Expr][]; yaw?: number; look_?: number; talk?: [number, number]; words?: Word[];
  zoom?: [number, number]; side?: number; pose?: Partial<Pose>; extra?: (t: number) => React.ReactNode; glint?: number; front?: (t: number) => React.ReactNode;
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
        {o.front?.(t)}
      </g>
    );
  };
  return Shot;
};

export { talkShot };

/** Where a character's hand is (left or right), to put a thing in it. */
export const handAt = (pose: Pose, side: 'L' | 'R' = 'R') => toWorld(pose, (side === 'L' ? joints(pose).armL : joints(pose).armR).end);

/** The phone in a character's hand, small, glowing: for wides and mediums. */
export const HeldPhone: React.FC<{ pose: Pose; side?: 'L' | 'R'; mode?: ScreenMode; t: number; battery?: number; s?: number; glow?: number; rot?: number }> = ({ pose, side = 'R', mode = 'offline', t, battery = 70, s = 0.13, glow = 1.2, rot = 0 }) => {
  const h = handAt(pose, side);
  return <Smartphone x={h.x} y={h.y - 30 * pose.scale} s={s * pose.scale} rot={rot} mode={mode} t={t} battery={battery} glow={glow} status={false} />;
};

/** A cast member as a pose on the street's pavement. */
export const at = (x: number, o: Partial<Pose> = {}, scale = 1): Pose => ({ ...basePose, x, y: suburbHip(scale), scale, ...o });
