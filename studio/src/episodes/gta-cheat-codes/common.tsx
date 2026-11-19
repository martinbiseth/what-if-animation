import React from 'react';
import {
  Smartphone, Hero, LOOKS, Look, Pose, PhoneInHand, ScreenMode, ShotProps, Word, basePose, camT, clamp, kf, lerp, rnd, joints, toWorld,
  talkShot, idleBlink, faceAt, Expr, talkAt, FONT, backOut, Suburb, suburbHip, Tod, Shop, Kitchen, Bedroom, CastSpec,
  Bus, BusCab, Bank, Office, Pizzeria, Classroom, Bal, balAt, balFlash, BalanceOver, BalanceTag, MONEY,
} from '../../engine';

// Shared by every chapter of "What if video game cheat codes worked in real life?" (started from the bank-balance
// clothes), word spans for lip sync, sets as clocked components, and the shot builders. Every builder that draws a
// person can hang a balance over their head (`bal`: a number, or [[frame, value], ...] to make it tick).

const noHat = (l: Look): Look => ({ ...l, hat: undefined, hatColor: undefined, noPhones: undefined });

export const YOU = LOOKS.you;
export const MO: Look = { ...noHat(LOOKS.mo26), jacket: '#4E7A4A', jacketShade: '#3E6238', accent: '#E9C46A', shoe: '#E8504A' };
export const ELLIE = LOOKS.ellie;
export const MUM: Look = { ...LOOKS.mom26, jacket: '#8A5A8A', jacketShade: '#704870' };
export const SUIT: Look = { ...noHat(LOOKS.suit26), jacket: '#6A707C', jacketShade: '#545A66', accent: '#2A2E38' };
export const POSTMAN: Look = { ...LOOKS.worker, jacket: '#C83A3A', jacketShade: '#A82E2E', hatColor: '#C83A3A' };
export const DRIVER: Look = { ...LOOKS.worker, jacket: '#2E4A7A', jacketShade: '#243C66', hatColor: '#2E4A7A' };
export const RICH: Look = { ...noHat(LOOKS.lady), jacket: '#E84A8A', jacketShade: '#C03A72', accent: '#FFD34A' };
export const HOODIE: Look = { ...noHat(LOOKS.worker), jacket: '#5A5E6A', jacketShade: '#4A4E58', accent: '#8A8E9A', extra: 'hood' };
export const JAKE: Look = { ...LOOKS.ellie, jacket: '#2F7BE0', jacketShade: '#2460B0', accent: '#F6EFE3', extra: undefined };
export const QUIET: Look = { ...LOOKS.ellie, jacket: '#8A8A7A', jacketShade: '#707062', accent: '#8A8A7A', extra: 'bob' };
export const TEACHER: Look = { ...noHat(LOOKS.doctor), jacket: '#7A5A3A', jacketShade: '#62472D', hair: '#17131C', extra: undefined };
export const BUYER: Look = { ...noHat(LOOKS.gent), jacket: '#3A6A5A', jacketShade: '#2E5648', extra: undefined };
export const BRO: Look = { ...noHat(LOOKS.mo26), jacket: '#B8503A', jacketShade: '#9A4030', extra: 'curls' };
export const NEIGHBOUR: Look = { ...noHat(LOOKS.worker), jacket: '#E8A83A', jacketShade: '#C88A2A' };
export const WAITER: Look = { ...noHat(LOOKS.worker), jacket: '#F2EEE6', jacketShade: '#D8D2C6', accent: '#B8323A' };
export const GRAN: Look = { ...noHat(LOOKS.doctor), jacket: '#A8708A', jacketShade: '#8A5A72', hair: '#D8D4CC', extra: 'bob' };
export const SCAMMER: Look = { ...noHat(LOOKS.gent), jacket: '#2A5AA8', jacketShade: '#224A8A', accent: '#F6EFE3', extra: undefined };
export const GUARD: Look = noHat(LOOKS.cop);
export const CLERK: Look = { ...noHat(LOOKS.lady), jacket: '#1E3A5A', jacketShade: '#162E4A' };
export const N1: Look = { ...noHat(LOOKS.gent), jacket: '#B8503A', jacketShade: '#9A4030', extra: undefined };
export const N2: Look = { ...noHat(LOOKS.lady), jacket: '#E8A83A', jacketShade: '#C88A2A' };
export const N3: Look = { ...noHat(LOOKS.worker), jacket: '#5A4A8A', jacketShade: '#4A3A72' };
export const N4: Look = { ...noHat(LOOKS.doctor), jacket: '#4AA8A0', jacketShade: '#3A8A84', hair: '#17131C' };
export const KID: Look = { ...LOOKS.ellie, jacket: '#E8C04A', jacketShade: '#C8A03A', extra: undefined };
const NEIGHBOURS = [N1, N2, N3, N4, GRAN, NEIGHBOUR, BUYER, KID];

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

/** A character close-up: one face filling the frame over a soft set, for reactions. */
export const faceCU = (o: {
  look: Look; Bg: SetC; faces: [number, Expr][]; yaw?: number; look_?: number; talk?: [number, number]; words?: Word[];
  zoom?: [number, number]; side?: number; pose?: Partial<Pose>; extra?: (t: number) => React.ReactNode; glint?: number; glintColor?: string; front?: (t: number) => React.ReactNode;
  bal?: Bal; balPop?: number; balS?: number;
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const face = faceAt(t, o.faces);
    const z = kf(t, [[0, o.zoom?.[0] ?? 3.2], [Math.max(1, len), o.zoom?.[1] ?? 3.45]]);
    const x = 960 + (o.side ?? 0);
    const open = o.words && o.talk ? talkAt(o.words, f, 30, [o.talk]) : 0;
    const pose: Pose = {
      ...basePose, x, y: 700, scale: 1, yaw: o.yaw ?? 0.3, look: o.look_ ?? -Math.sign(o.yaw ?? 0.3) * 0.4,
      headTilt: Math.sin(t / 25) * 2, ...o.pose, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, 3)), talk: open, glint: o.glint, glintColor: o.glintColor,
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
          {o.bal !== undefined ? <BalanceOver pose={pose} v={balAt(t, o.bal)} flash={balFlash(t, o.bal)} t={t} s={o.balS ?? 0.5} pop={(t - (o.balPop ?? 0)) / 8} lift={20} /> : null}
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
export const HeldPhone: React.FC<{ pose: Pose; side?: 'L' | 'R'; mode?: ScreenMode; t: number; battery?: number; s?: number; glow?: number; rot?: number }> = ({ pose, side = 'R', mode = 'home', t, battery = 70, s = 0.13, glow = 1.2, rot = 0 }) => {
  const h = handAt(pose, side);
  return <Smartphone x={h.x} y={h.y - 30 * pose.scale} s={s * pose.scale} rot={rot} mode={mode} t={t} battery={battery} glow={glow} status={false} />;
};

/** A cast member as a pose on the street's pavement. */
export const at = (x: number, o: Partial<Pose> = {}, scale = 1): Pose => ({ ...basePose, x, y: suburbHip(scale), scale, ...o });

// ---------------------------------------------------------------- cards
import { Schematic, SCH } from '../../engine';

/** Floating balances drifting up through the dark: the episode's signature ground (cards, transitions). */
export const MoneyField: React.FC<{ t: number; n?: number; seed?: number; blur?: boolean; bg?: boolean }> = ({ t, n = 18, seed = 3, blur = true, bg = true }) => (
  <g>
    {bg ? <rect x={-200} y={-200} width={2400} height={1500} fill="#0C1024" /> : null}
    <g filter={blur ? 'url(#blur6)' : undefined}>
      {Array.from({ length: n }).map((_, i) => {
        const r = (k: number) => rnd(seed * 31 + i, k);
        const v = r(1) < 0.55 ? Math.round(r(2) * r(2) * 250000) : -Math.round(r(3) * r(3) * 90000);
        const y = 1200 - ((t * (0.8 + r(4)) + r(5) * 1400) % 1500);
        return <BalanceTag key={i} x={r(6) * 1920} y={y} v={v} s={0.5 + r(7) * 0.5} t={t + i * 20} />;
      })}
    </g>
  </g>
);

/** A chapter opener: kicker, title, over the floating balances. */
export const moneyCard = (o: { kicker: string; title: string; seed?: number }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t, len }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    const z = kf(t, [[0, 1], [Math.max(len, 1), 1.06]]);
    return (
      <g>
        <g transform={camT(960, 540, z)}>
          <MoneyField t={t + 200} seed={o.seed ?? 3} />
        </g>
        <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.35} />
        <g transform={`translate(960 420) scale(${pop(1)})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill={MONEY.green}>{o.kicker}</text>
        </g>
        <g transform={`translate(960 545) scale(${pop(3)})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={o.title.length > 18 ? 100 : 124} fill="#F6EFE3" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">{o.title}</text>
        </g>
      </g>
    );
  };
  return Card;
};

/** A balance, huge, over a soft set: the insert that sells a number. `bal` can tick; `label` sits under it. */
export const balCU = (o: { bal: Bal; Bg?: SetC; label?: string; sub?: string; s?: number; cents?: boolean; text?: string; color?: string }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, 1], [Math.max(1, len), 1.07]]);
    const v = balAt(t, o.bal);
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.45}>
            <g transform={camT(960, 520, 1.3)}>
              <o.Bg t={t + 400} id="bcu" />
            </g>
          </Soft>
        ) : (
          <MoneyField t={t} n={10} />
        )}
        <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
          <BalanceTag x={960} y={600} v={v} s={o.s ?? 2.4} pop={t / 7} t={t} cents={o.cents} text={o.text} flash={balFlash(t, o.bal)} color={o.color} />
          {o.label ? (
            <text x={960} y={720} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 6) / 6)}>
              {o.label}
            </text>
          ) : null}
          {o.sub ? (
            <text x={960} y={790} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#C8C2D8" opacity={clamp((t - 10) / 8)}>{o.sub}</text>
          ) : null}
        </g>
      </g>
    );
  };
  return Shot;
};

/** A figure on a set with a balance over the head, posed by hand: the builder for a medium of one or two people. */
export type Who = { look: Look; pose: Partial<Pose>; bal?: Bal; balPop?: number; balS?: number; faces?: [number, Expr][]; seed?: number; held?: ScreenMode; heldText?: string };
export const people = (t: number, list: Who[], f = 0, words?: Word[], talk?: Record<number, [number, number][]>) =>
  list.map((w, i) => {
    const face = faceAt(t, w.faces ?? [[0, (w.pose.expr as Expr) ?? 'neutral']]);
    const open = words && talk?.[i] ? talkAt(words, f, 30, talk[i]) : 0;
    const pose: Pose = { ...basePose, ...w.pose, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, w.seed ?? i + 1)), talk: open, headTilt: (w.pose.headTilt ?? 0) + Math.sin((t + i * 30) / 24) * 1.5 };
    return (
      <g key={i}>
        <Hero look={w.look} pose={pose} />
        {w.held ? <HeldPhone pose={pose} t={t} mode={w.held} /> : null}
        {w.bal !== undefined ? <BalanceOver pose={pose} v={balAt(t, w.bal)} flash={balFlash(t, w.bal)} t={t} s={w.balS} pop={(t - (w.balPop ?? 0)) / 8} /> : null}
      </g>
    );
  });

/** A list on the schematic: each item pops on at its frame, with a green tick (ok) or a red cross. */
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

// ================================================================ the cheat-codes episode
import { Stairwell, Glow, Rooftop, DaySky, SUBURB, BEDROOM, KITCHEN } from '../../engine';
import { Controller, CodeList, CheatText, CHEAT, SkySet, SportsCar, SpawnFlash, Jetpack, Bill, MoneyBag } from './kit';

export const AGENT: Look = { ...SUIT, jacket: '#22252E', jacketShade: '#181A22', accent: '#0E0F14' };
export const AGENT2: Look = { ...AGENT, jacket: '#2A2E3A', jacketShade: '#1E222C' };
export const SELLER: Look = { ...GRAN };
export const ENGINEER: Look = { ...noHat(LOOKS.worker), jacket: '#E8A83A', jacketShade: '#C88A2A' };
export const PILOT: Look = { ...noHat(LOOKS.cop), jacket: '#F2EEE6', jacketShade: '#D8D2C6', accent: '#1E3A5A' };
export const TELLER: Look = CLERK;
export const STRANGER: Look = { ...HOODIE, jacket: '#3A3E4A', jacketShade: '#2C3038' };

export const DuskStreet = StreetSet('dusk', { cars: false, lit: 0.6 });
export const DayStreet = StreetSet('day', { cars: false });
export const OUR_DOOR = 865; // x of our front door (house 12, yellow door) on the Suburb
export const ROAD = SUBURB.kerb + 110; // wheels of cars parked in front

/** The chapter opener: the code grid (button dots drifting) behind a kicker and a title. */
export const CodeField: React.FC<{ t: number; seed?: number }> = ({ t, seed = 2 }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#081A1A" />
    <g filter="url(#blur6)" opacity={0.7}>
      {Array.from({ length: 70 }).map((_, i) => {
        const r = (k: number) => rnd(seed * 17 + i, k);
        const col = [CHEAT.red, CHEAT.blue, CHEAT.green, '#F2C14E'][i % 4];
        const y = 1200 - ((t * (0.6 + r(1)) + r(2) * 1500) % 1500);
        return <circle key={i} cx={r(3) * 1920} cy={y} r={10 + r(4) * 22} fill={col} opacity={0.35 + r(5) * 0.4} />;
      })}
    </g>
    {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={-100} y={k * 90 + ((t * 2) % 90)} width={2200} height={2} fill={CHEAT.glow} opacity={0.08} />)}
  </g>
);
export const codeCard = (o: { kicker: string; title: string; seed?: number }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t, len }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    const z = kf(t, [[0, 1], [Math.max(len, 1), 1.06]]);
    return (
      <g>
        <g transform={camT(960, 540, z)}>
          <CodeField t={t + 100} seed={o.seed} />
        </g>
        <g transform={`translate(960 420) scale(${pop(1)})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={42} letterSpacing={10} fill={CHEAT.glow}>{o.kicker}</text>
        </g>
        <g transform={`translate(960 548) scale(${pop(3)})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={o.title.length > 16 ? 104 : 128} fill="#F6EFE3" stroke="#04100E" strokeWidth={12} paintOrder="stroke">{o.title}</text>
        </g>
      </g>
    );
  };
  return Card;
};

/** Hands (dark mittens in orange sleeves) round the controller, big, over a soft set. `seq` is [[frame, key], ...]:
 * each key is pressed for 6 frames. `cheat` pops CHEAT ACTIVATED + name at its frame. */
export const ctrlCU = (o: { Bg?: SetC; bgColor?: string; seq?: [number, string][]; cheat?: { at: number; name: string; head?: string }; glow?: (t: number) => number; sleeve?: string; s?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, 1], [Math.max(1, len), 1.08]]);
    const cur = (o.seq ?? []).find(([f]) => t >= f && t < f + 6);
    const press = cur?.[1];
    const s = o.s ?? 1.35;
    const thumbL = press && ['up', 'down', 'left', 'right'].includes(press);
    const thumbR = press && !thumbL;
    const bob = Math.sin(t / 16) * 5;
    const cy = 700 + bob;
    const sl = o.sleeve ?? '#F07A2A';
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.35}>
            <g transform={camT(960, 520, 1.3)}>
              <o.Bg t={t + 300} id="ccu" />
            </g>
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill={o.bgColor ?? '#141020'} />
        )}
        <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
          {/* sleeves from the bottom corners */}
          <path d={`M 300 1200 L ${960 - 330 * s} ${cy + 140 * s} L ${960 - 200 * s} ${cy + 190 * s} L 620 1200 Z`} fill={sl} stroke="#1A1018" strokeWidth={8} />
          <path d={`M 1620 1200 L ${960 + 330 * s} ${cy + 140 * s} L ${960 + 200 * s} ${cy + 190 * s} L 1300 1200 Z`} fill={sl} stroke="#1A1018" strokeWidth={8} />
          <Controller x={960} y={cy} s={s} press={press} glow={o.glow ? o.glow(t) : 0} />
          {/* the mittens: palms under the grips, thumbs over the d-pad and the buttons */}
          <ellipse cx={960 - 250 * s} cy={cy + 90 * s} rx={70 * s} ry={80 * s} fill="#1A1620" />
          <ellipse cx={960 + 250 * s} cy={cy + 90 * s} rx={70 * s} ry={80 * s} fill="#1A1620" />
          <ellipse cx={960 - 150 * s + (thumbL ? 0 : -40 * s)} cy={cy + (thumbL ? 0 : 50) * s} rx={34 * s} ry={26 * s} fill="#241E2A" stroke="#0E0A12" strokeWidth={4} transform={`rotate(-30 ${960 - 150 * s} ${cy})`} />
          <ellipse cx={960 + 150 * s + (thumbR ? 0 : 40 * s)} cy={cy + (thumbR ? 0 : 50) * s} rx={34 * s} ry={26 * s} fill="#241E2A" stroke="#0E0A12" strokeWidth={4} transform={`rotate(30 ${960 + 150 * s} ${cy})`} />
        </g>
        {o.cheat ? <CheatText x={960} y={230} p={t - o.cheat.at} name={o.cheat.name} head={o.cheat.head} s={0.9} /> : null}
      </g>
    );
  };
  return Shot;
};

/** The list, big, on a soft ground: `back` shows the rules; `reveal(t)` lets the sun through; `hi` lights a line;
 * `focus` pushes the camera onto the scribbled line. */
export const listCU = (o: { Bg?: SetC; back?: boolean; reveal?: (t: number) => number; hi?: number; focus?: 'top' | 'bottom' | 'rule3'; rot?: number; window?: boolean }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const L = Math.max(1, len);
    const target = o.focus === 'bottom' ? [960, 880, 2.0] : o.focus === 'rule3' ? [960, 640, 1.9] : [960, 540, 1.15];
    const zx = kf(t, [[0, 960], [L, target[0]]]);
    const zy = kf(t, [[0, 560], [L, target[1]]]);
    const zs = kf(t, [[0, 1.05], [L, target[2]]]);
    const rv = o.reveal ? o.reveal(t) : 0;
    return (
      <g>
        {o.window ? (
          <g>
            <rect width={1920} height={1080} fill="#2A1A2A" />
            <g opacity={0.9}>
              <DaySky id="lwin" horizonY={900} tod="dusk" />
            </g>
            <Glow x={960} y={500} r={900} o={0.5 + 0.5 * rv} />
            <path d="M 0 0 H 1920 V 1080 H 0 Z M 160 80 H 1760 V 1000 H 160 Z" fill="#E8DCCC" fillRule="evenodd" />
            <path d="M 960 80 V 1000 M 160 540 H 1760" stroke="#E8DCCC" strokeWidth={26} opacity={0.6} />
          </g>
        ) : o.Bg ? (
          <Soft blur={16} dim={0.4}>
            <g transform={camT(960, 520, 1.3)}>
              <o.Bg t={t + 300} id="lcu" />
            </g>
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill="#1A1420" />
        )}
        <g transform={camT(zx, zy, zs)}>
          <CodeList x={960} y={560} s={1.25} rot={o.rot ?? -2} back={o.back} reveal={rv} hi={o.hi} />
          {o.window ? (
            <g>
              <ellipse cx={560} cy={700} rx={70} ry={90} fill="#1A1620" opacity={0.9} />
              <ellipse cx={1360} cy={420} rx={70} ry={90} fill="#1A1620" opacity={0.9} />
            </g>
          ) : null}
        </g>
      </g>
    );
  };
  return Shot;
};

/** A free shot: a set under a drifting camera plus whatever `draw` adds on the shot clock (people, props). */
export const scene = (o: { Set: SetC; cam: [number, number, number][]; draw?: (t: number, f: number, len: number) => React.ReactNode; front?: (t: number, f: number, len: number) => React.ReactNode; setT?: number; id?: string }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const L = Math.max(1, len);
    const c0 = o.cam[0], c1 = o.cam[1] ?? o.cam[0];
    return (
      <g>
        <g transform={camT(kf(t, [[0, c0[0]], [L, c1[0]]]), kf(t, [[0, c0[1]], [L, c1[1]]]), kf(t, [[0, c0[2]], [L, c1[2]]]))}>
          <o.Set t={t + (o.setT ?? 100)} id={o.id ?? 'sc'} />
          {o.draw?.(t, f, L)}
        </g>
        {o.front?.(t, f, L)}
      </g>
    );
  };
  return Shot;
};

/** One posed figure (pose computed by the caller each frame), with blink and face keys. */
export const fig = (look: Look, t: number, p: Partial<Pose>, faces: [number, Expr][] = [[0, 'neutral']], seed = 1, talk = 0) => {
  const face = faceAt(t, faces);
  return <Hero look={look} pose={{ ...basePose, ...p, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, seed)), talk }} />;
};

export const StairSet: SetC = ({ t, id }) => <Stairwell t={t} id={id} />;
export const BedSet = BedroomSet({ veil: 0.22, clock: '16:40', lamp: 1 });
export const KitSet = KitchenSet(0.22);
export const BankS = BankSet({ counter: true });
export const RoofSet: SetC = ({ t }) => <Rooftop t={t} sunY={760} cityLit={0.6} />;
export const Sky: SetC = ({ t, id }) => <SkySet t={t} id={id} />;
export const HighSky: SetC = ({ t, id }) => <SkySet t={t} id={id} town={0} />;

/** You on the jetpack, flying: body tilted forward, legs trailing, flames out back. */
export const Flyer: React.FC<{ x: number; y: number; s?: number; t: number; look?: Look; expr?: Expr; tilt?: number; socks?: boolean }> = ({ x, y, s = 1, t, look = YOU, expr = 'happy', tilt = 28, socks = false }) => {
  const bob = Math.sin(t / 9) * 8;
  const pose: Pose = {
    ...basePose, x, y: y + bob, scale: s, yaw: 0.6, tilt, expr, blink: idleBlink(t, 4), look: 0.5,
    armL: { a: 40, b: -30 }, armR: { a: 150 + Math.sin(t / 7) * 8, b: -20 }, legL: { a: -30, b: 30 }, legR: { a: -18, b: 20 }, sway: 6,
  };
  const pack = toWorld(pose, { x: -46, y: -120 });
  return (
    <g>
      <Jetpack x={pack.x} y={pack.y} s={s * 0.8} t={t} rot={tilt + 12} />
      <Hero look={socks ? { ...look, shoe: '#F2F2F2' } : look} pose={pose} />
    </g>
  );
};

export { Controller, CodeList, CheatText, CHEAT, SportsCar, SpawnFlash, Jetpack, Bill, MoneyBag, BEDROOM, KITCHEN };
export { CashStack, Skateboard, Bird, Helicopter, SatVan, PowerGraph, WeatherTV, Flames, Smoke, PauseScreen, SkySet, CODES } from "./kit";

/** Words on the schematic: a kicker, one or two big lines, a sub line, and THAT'S REAL. `art` draws behind the words. */
export const textCard = (o: { kicker?: string; lines: string[]; sub?: string; real?: boolean; color?: string; size?: number; art?: (t: number) => React.ReactNode; y?: number }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t, len }) => (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [Math.max(1, len), 1.05]]))}>
        <Schematic t={t} id="tc" />
      </g>
      {o.art?.(t)}
      {o.kicker ? <text x={960} y={(o.y ?? 420) - 130} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill={SCH.dim} opacity={clamp(t / 6)}>{o.kicker}</text> : null}
      {o.lines.map((l, i) => (
        <g key={i} transform={`translate(960 ${(o.y ?? 420) + i * ((o.size ?? 110) * 1.05)}) scale(${backOut(clamp((t - 3 - i * 5) / 9))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={o.size ?? 110} fill={o.color ?? '#F6EFE3'} stroke="#0B0816" strokeWidth={10} paintOrder="stroke">{l}</text>
        </g>
      ))}
      {o.sub ? <text x={960} y={(o.y ?? 420) + o.lines.length * (o.size ?? 110) * 1.05 + 30} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#C8C2D8" opacity={clamp((t - 18) / 8)}>{o.sub}</text> : null}
      {o.real ? (
        <g opacity={clamp((t - 40) / 6)} transform={`translate(960 900) scale(${backOut(clamp((t - 40) / 9))})`}>
          <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#1A1430" stroke={SCH.live} strokeWidth={3} />
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
        </g>
      ) : null}
    </g>
  );
  return Card;
};

/** A text from Mo, big: a phone face filling the middle of the frame, his name on top, bubbles popping in turn. */
export const msgCU = (o: { from?: string; bubbles: { at: number; text: string[]; big?: boolean }[]; Bg?: SetC }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const z = kf(t, [[0, 1], [Math.max(1, len), 1.06]]);
    const buzz = t < 10 ? Math.sin(t * 3) * 6 : 0;
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.45}>
            <g transform={camT(960, 520, 1.3)}>
              <o.Bg t={t + 200} id="msg" />
            </g>
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill="#14101C" />
        )}
        <g transform={`translate(${960 + buzz} 560) scale(${z}) rotate(-3)`}>
          <rect x={-330} y={-560} width={660} height={1200} rx={70} fill="#16161C" />
          <rect x={-300} y={-530} width={600} height={1140} rx={50} fill="#101018" />
          <circle cx={0} cy={-420} r={50} fill="#4E7A4A" />
          <text x={0} y={-330} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={44} fill="#F6EFE3">{o.from ?? 'Mo'}</text>
          {o.bubbles.map((b, i) => {
            const p = backOut(clamp((t - b.at) / 8));
            const y = -250 + i * 190;
            return (
              <g key={i} transform={`translate(-260 ${y}) scale(${p})`} opacity={clamp((t - b.at) / 3)}>
                <rect x={0} y={0} width={500} height={60 + b.text.length * 50} rx={36} fill="#2A2A36" />
                {b.text.map((l, k) => (
                  <text key={k} x={30} y={68 + k * 50} fontFamily={FONT.ui} fontSize={b.big ? 46 : 38} fill="#FFFFFF">{l}</text>
                ))}
              </g>
            );
          })}
        </g>
      </g>
    );
  };
  return Shot;
};
