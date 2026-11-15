import React from 'react';
import { Schematic, SCH, LEG_LEN, Hero, Look, Pose, basePose, camT, kf, clamp, easeOut, backOut, ShotProps, talkShot, CastSpec, Word, Expr, faceAt, idleBlink, talkAt, Foreground, Glow, FONT, walkPose } from '../../engine';
import { RomeStreet, ShopInside, ShopCounter, CircusMaximus, RomeAlley, romeHip, SHOP, CIRCUS, P0 } from './sets';
import { CITIZENS, span } from './common';

// Shot builders for the Rome episode: characters on the street, behind the counter, in the stands; a queue of
// customers; a close insert of a prop over a soft set.

type SetFC = React.FC<{ t: number; id?: string }>;
export type Mode = 'day' | 'dusk' | 'night';
export const streetSet = (o: { mode?: Mode; fire?: number; shop?: boolean; sign?: number; smoke?: number; open?: boolean } = {}): SetFC => {
  const S: SetFC = ({ t, id }) => <RomeStreet t={t} id={id} {...o} />;
  return S;
};
export const shopSet = (o: { night?: boolean; menu?: boolean; grill?: number; empty?: boolean; fire?: number; flip?: number } = {}): SetFC => {
  const S: SetFC = ({ t, id }) => <ShopInside t={t} id={id} {...o} />;
  return S;
};
export const circusSet = (o: { cheer?: number; race?: boolean; mode?: Mode; box?: number } = {}): SetFC => {
  const S: SetFC = ({ t, id }) => <CircusMaximus t={t} id={id} cheer={o.cheer} race={o.race ? (t % 300) / 300 : -1} mode={o.mode} box={o.box} />;
  return S;
};
export const AlleySet: SetFC = ({ t, id }) => <RomeAlley t={t} id={id} />;

/** A standing character on the street at x (feet on the pavement). */
export const onStreet = (look: Look, x: number, o: Partial<CastSpec> = {}, scale = 1): CastSpec => ({ look, x, y: romeHip(scale), scale, ...o });
/** A character behind the counter at x. */
export const atCounter = (look: Look, x: number, o: Partial<CastSpec> = {}, scale = 1): CastSpec => ({ look, x, y: SHOP.hip + (1 - scale) * 120, scale, ...o });
/** A character on the front aisle of the Circus. */
export const inStands = (look: Look, x: number, o: Partial<CastSpec> = {}, scale = 1): CastSpec => ({ look, x, y: CIRCUS.feet - LEG_LEN * scale, scale, ...o });

/** A queue of customers on the street from x0 to x1, facing left (toward the counter). */
export const queue = (n: number, x0: number, x1: number, seed = 1, o: { scale?: number; faces?: [number, Expr][]; yaw?: number } = {}): CastSpec[] =>
  Array.from({ length: n }).map((_, k) => {
    const s = (o.scale ?? 0.85) * (0.92 + ((k * 37 + seed * 11) % 10) / 60);
    return { look: CITIZENS[(k + seed) % CITIZENS.length], x: x0 + (k * (x1 - x0)) / Math.max(1, n - 1), y: romeHip(s), scale: s, yaw: o.yaw ?? -0.6, seed: k + seed, faces: o.faces ?? [[0, k % 3 ? 'neutral' : 'happy']] };
  });

/** A street scene. */
export const street = (o: { mode?: Mode; fire?: number; shop?: boolean; sign?: number; smoke?: number; open?: boolean; cast: CastSpec[]; cam?: { from: [number, number, number]; to?: [number, number, number] }; words?: Word[]; front?: (t: number) => React.ReactNode; back?: (t: number) => React.ReactNode; setT?: number }) =>
  talkShot({ Set: streetSet(o), cast: o.cast, cam: o.cam, words: o.words, front: o.front, back: o.back, setT: o.setT ?? 200, id: 'st' });

/** Behind the counter, seen from the street; `burgers` on the counter, `crowd` heads in front. */
export const shop = (o: { night?: boolean; menu?: boolean; grill?: number; empty?: boolean; fire?: number; flip?: number; cast: CastSpec[]; cam?: { from: [number, number, number]; to?: [number, number, number] }; words?: Word[]; burgers?: number; tokens?: boolean; crowd?: number; front?: (t: number) => React.ReactNode; back?: (t: number) => React.ReactNode }) =>
  talkShot({
    Set: shopSet(o), cast: o.cast, cam: o.cam ?? { from: [960, 520, 1.25], to: [960, 520, 1.32] }, words: o.words, back: o.back, setT: 300, id: 'sh',
    front: (t) => (
      <g>
        <ShopCounter burgers={o.burgers} tokens={o.tokens} night={o.night} />
        {o.front?.(t)}
        {o.crowd ? <Foreground blur={10}><HeadsFront t={t} n={o.crowd} /></Foreground> : null}
      </g>
    ),
  });

/** Customers' heads and shoulders from behind, in the foreground. */
export const HeadsFront: React.FC<{ t: number; n?: number; y?: number; seed?: number }> = ({ t, n = 4, y = 1000, seed = 2 }) => (
  <g>
    {Array.from({ length: n }).map((_, k) => {
      const cx = 200 + k * (1600 / Math.max(1, n - 1)) + ((k * 53 + seed * 7) % 80);
      const b = Math.sin(t / 14 + k) * 6;
      const c = ['#8A5A6A', '#5A6A8A', '#C8B08A', '#6A8A5A', '#B86A4A'][(k + seed) % 5];
      return (
        <g key={k} transform={`translate(${cx} ${y + b})`}>
          <path d="M -150 260 Q -150 70 0 70 Q 150 70 150 260 Z" fill={c} stroke={P0} strokeWidth={7} />
          <circle cx={0} cy={-30} r={100} fill="#26232F" stroke={P0} strokeWidth={7} />
        </g>
      );
    })}
  </g>
);

/** A close insert: a prop drawn big over a soft, dimmed set, with a slow push-in. */
export const insert = (o: { Bg: SetFC; draw: (t: number, len: number) => React.ReactNode; zoom?: [number, number]; dim?: number; cx?: number; cy?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => (
    <g>
      <g filter="url(#blur16)">
        <g transform={camT(960, 560, 1.4)}>
          <o.Bg t={t + 400} id="ins" />
        </g>
      </g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={o.dim ?? 0.35} />
      <g transform={camT(o.cx ?? 960, o.cy ?? 540, kf(t, [[0, o.zoom?.[0] ?? 1], [Math.max(1, len), o.zoom?.[1] ?? 1.08]]))}>{o.draw(t, len)}</g>
    </g>
  );
  return Shot;
};

/** A walking figure (profile) across a set: x from a to b over the shot. */
export const walker = (look: Look, a: number, b: number, len: number, t: number, y: number, scale = 1, extra: Partial<Pose> = {}) => {
  const x = a + (b - a) * clamp(t / Math.max(1, len));
  const facing: 1 | -1 = b >= a ? 1 : -1;
  return <Hero look={look} pose={{ ...walkPose(x, t * 0.6, y + LEG_LEN * scale, scale, { yaw: facing * 0.8, ...extra }, facing) }} />;
};

/** A caption chip (a date, a place) that pops on in the corner. */
export const Chip: React.FC<{ t: number; text: string; x?: number; y?: number; color?: string }> = ({ t, text, x = 120, y = 110, color = '#FF8A3D' }) => {
  const k = backOut(clamp(t / 8));
  const w = text.length * 24 + 60;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`} opacity={clamp(t / 4)}>
      <rect x={0} y={-36} width={w} height={64} rx={32} fill="#140E1C" opacity={0.85} stroke={color} strokeWidth={3} />
      <text x={w / 2} y={8} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} letterSpacing={3} fill="#F6EFE3">
        {text}
      </text>
    </g>
  );
};

export { span, Glow, easeOut, basePose, faceAt, idleBlink, talkAt };

/** A fact on the schematic that isn't a single number: a kicker, a big line (or two), a source line, THAT'S REAL. */
export const realCard = (o: { kicker: string; big: string[]; sub?: string; real?: boolean; color?: string; draw?: (t: number) => React.ReactNode }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [Math.max(1, len), 1.05]]))}>
        <Schematic t={t} id="rcard" />
      </g>
      {o.draw?.(t)}
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} letterSpacing={8} fill={SCH.dim} opacity={clamp(t / 6)}>{o.kicker}</text>
      {o.big.map((b, k) => (
        <g key={k} transform={`translate(960 ${480 + k * 130}) scale(${backOut(clamp((t - 6 - k * 8) / 9))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={b.length > 16 ? 96 : 120} fill={k === 0 ? (o.color ?? '#FF8A3D') : '#F6EFE3'} stroke="#0B0816" strokeWidth={10} paintOrder="stroke">{b}</text>
        </g>
      ))}
      {o.sub ? <text x={960} y={480 + o.big.length * 130} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#F6EFE3" opacity={clamp((t - 30) / 8)}>{o.sub}</text> : null}
      {o.real !== false ? (
        <g opacity={clamp((t - 48) / 6)} transform={`translate(960 900) scale(${backOut(clamp((t - 48) / 9))})`}>
          <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#140E1C" stroke={SCH.live} strokeWidth={3} />
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
        </g>
      ) : null}
    </g>
  );
  return Shot;
};

/** A count that ticks up from 0 to `to` in the middle of a dark frame, with a kicker. */
export const countCard = (o: { kicker: string; to: number; dur?: number; suffix?: string; Bg?: React.FC<{ t: number; id?: string }> }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const v = Math.round(o.to * easeOut(clamp(t / (o.dur ?? 30))));
    return (
      <g>
        {o.Bg ? <g filter="url(#blur16)"><o.Bg t={t + 500} id="cc" /></g> : <rect width={1920} height={1080} fill="#0C0A16" />}
        <rect width={1920} height={1080} fill="#0B0816" opacity={0.45} />
        <text x={960} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>{o.kicker}</text>
        <text x={960} y={640} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={240} fill="#FFD23A" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">{v.toLocaleString('en-US')}{o.suffix ?? ''}</text>
      </g>
    );
  };
  return Shot;
};
