import { Bal, BalanceOver, balAt, balFlash } from './money';
import React from 'react';
import { backOut, camT, clamp, easeOut, kf, rnd } from './anim';
import { basePose, Expr, faceAt, Hero, Look, Pose, poseAt } from './rig';
import { Rooftop } from './sets/rooftop';
import { CountUp, SchLabel, Schematic, SCH } from './sets/schematic';
import { UI } from './ui';
import { FONT } from './fonts';
import type { ShotProps } from './episode';

// Shot templates for long-form episodes. An 8-minute episode has 80 to 120 shots; drawing each by hand like the
// 20-second examples doesn't scale. These return a ready shot component from a few parameters, so the common shots
// (a chapter card, a fact, someone talking) are one line in shots.tsx and the hand-drawn effort goes where the story
// needs it. Every template is still a pure function of the shot clock t.

export type Word = { w: string; s: number; e: number; p?: string };

/**
 * How open a speaking mouth is at global frame f, from the chapter's words.json: 0 between words, a syllable-ish
 * flap (about four a second) inside them. `spans` limits it to stretches of the voice, in seconds ([[12.4, 15.0]]),
 * so a character only moves their lips on their own lines.
 */
export const talkAt = (words: Word[], f: number, fps = 30, spans?: [number, number][]) => {
  const s = f / fps;
  if (spans && !spans.some(([a, b]) => s >= a && s < b)) return 0;
  const w = words.find((x) => s >= x.s && s < x.e);
  if (!w) return 0;
  const k = (s - w.s) * fps;
  return 0.25 + 0.75 * Math.abs(Math.sin((k * Math.PI) / 7 + w.s * 3));
};

/** A blink every few seconds, staggered by seed: 1 on the shut frame, 0.5 either side. */
export const idleBlink = (t: number, seed = 1) => {
  const period = 84 + Math.floor(rnd(seed, 1) * 50);
  const k = (t + Math.floor(rnd(seed, 2) * period)) % period;
  return k === 0 ? 1 : k === 1 || k === period - 1 ? 0.5 : 0;
};

// ---------------------------------------------------------------- chapter card
/**
 * A chapter opener over the dusk rooftop (or the schematic): a small kicker line and a big title that pop on, with a
 * slow push in. Use it at the top of each chapter, or as the placeholder `long.py init` writes.
 */
export const chapterCard = (o: { kicker?: string; title: string; ground?: 'rooftop' | 'schematic'; red?: number; sunY?: number }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t, len }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    const z = kf(t, [[0, 1], [Math.max(len, 1), 1.06]]);
    return (
      <g>
        <g transform={camT(960, 560, z)}>
          {o.ground === 'schematic' ? <Schematic t={t} id="chCard" /> : <Rooftop t={t + 200} red={o.red ?? 0} sunY={o.sunY ?? 700} />}
        </g>
        <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.35} />
        {o.kicker ? (
          <g transform={`translate(960 420) scale(${pop(2)})`}>
            <text textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill={UI.live}>
              {o.kicker}
            </text>
          </g>
        ) : null}
        <g transform={`translate(960 540) scale(${pop(5)})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={o.title.length > 18 ? 100 : 128} fill="#F6EFE3" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">
            {o.title}
          </text>
        </g>
      </g>
    );
  };
  return Card;
};

// ---------------------------------------------------------------- fact card
/**
 * The science beat as a card on the schematic: a number counting up, its unit, a label above and a line of working
 * below, each drawing on in turn. The number must be in the chapter's `science` field with its source.
 */
export const factCard = (o: { value: number; suffix?: string; label: string; sub?: string; format?: (v: number) => string; real?: boolean }): React.FC<ShotProps> => {
  const Fact: React.FC<ShotProps> = ({ t }) => (
    <g>
      <Schematic t={t} id="fact" />
      <SchLabel x={960} y={360} t={t - 2} text={o.label} size={44} color={SCH.dim} />
      <CountUp x={960} y={560} t={t - 8} to={o.value} dur={36} size={150} suffix={o.suffix ?? ''} format={o.format} />
      {o.sub ? <SchLabel x={960} y={680} t={t - 46} text={o.sub} size={36} /> : null}
      {o.real !== false ? (
        <g opacity={clamp((t - 60) / 6)} transform={`translate(960 820) scale(${backOut(clamp((t - 60) / 9))})`}>
          <rect x={-150} y={-46} width={300} height={70} rx={35} fill={UI.pill} stroke={SCH.live} strokeWidth={3} />
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>
            {"THAT'S REAL."}
          </text>
        </g>
      ) : null}
    </g>
  );
  return Fact;
};

// ---------------------------------------------------------------- talk shot
export type CastSpec = {
  look: Look;
  x: number;
  y: number;
  scale?: number;
  yaw?: number;
  look_?: number; // eye direction
  faces?: [number, Expr][]; // expression swaps on the shot clock
  talk?: [number, number][]; // stretches of the voice (seconds) when this one speaks; omit for a listener
  gesture?: boolean; // the near arm moves while talking
  rim?: string;
  seed?: number;
  pose?: Partial<Pose>; // anything else, held for the shot
  bal?: Bal; // a bank balance over the head (money.tsx): a number or keys on the shot clock
  balPop?: number; // frame the balance pops on (default 0)
  balS?: number; // its size (default 0.6)
};

/**
 * Characters on a set, talking or listening: idle breathing, staggered blinks, lips on their own lines (from the
 * chapter's words), a small gesture while they speak, and a camera that drifts from one framing to another. The
 * workhorse for dialogue and narration over a scene in beats 3, 5 and 6.
 *
 *   export const S7 = talkShot({ Set: Kitchen, words, cast: [{ look: LOOKS.pipHood, x: 820, y: 700, yaw: 0.5, talk: [[41.2, 44.0]] },
 *                                                         { look: LOOKS.mo, x: 1120, y: 700, yaw: -0.5, faces: [[0, 'worried']] }],
 *                               cam: { from: [970, 560, 1.7], to: [990, 560, 1.85] } });
 */
export const talkShot = (o: {
  Set: React.FC<{ t: number; id?: string }>;
  id?: string;
  cast: CastSpec[];
  cam?: { from: [number, number, number]; to?: [number, number, number] };
  words?: Word[];
  fps?: number;
  back?: (t: number) => React.ReactNode; // drawn after the set, behind the cast
  front?: (t: number) => React.ReactNode; // drawn after the cast (furniture that hides legs, foreground)
  setT?: number; // offset into the set's clock so its idle motion carries across cuts
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const [cx0, cy0, z0] = o.cam?.from ?? [960, 560, 1];
    const [cx1, cy1, z1] = o.cam?.to ?? [cx0, cy0, z0];
    const L = Math.max(len, 1);
    return (
      <g transform={camT(kf(t, [[0, cx0], [L, cx1]]), kf(t, [[0, cy0], [L, cy1]]), kf(t, [[0, z0], [L, z1]]))}>
        <o.Set t={t + (o.setT ?? 60)} id={o.id ?? 'talk'} />
        {o.back?.(t)}
        {o.cast.map((c, i) => {
          const seed = c.seed ?? i + 1;
          const open = o.words && c.talk ? talkAt(o.words, f, o.fps ?? 30, c.talk) : 0;
          const speaking = open > 0;
          const breathe = Math.sin((t + seed * 17) / 22);
          const g = c.gesture !== false && speaking ? Math.sin((f + seed * 9) / 9) : 0;
          const base: Partial<Pose> = {
            x: c.x, y: c.y, scale: c.scale ?? 1, yaw: c.yaw ?? 0, look: c.look_ ?? Math.sign(c.yaw ?? 0) * 0.6,
            tilt: breathe * 1.2 + g * 1.5, headTilt: breathe * 1.5 + (speaking ? g * 3 : 0),
            armR: { a: 12 + (speaking ? 22 + g * 14 : 0), b: speaking ? -40 - g * 10 : -8 },
            ...c.pose,
          };
          const face = faceAt(t, c.faces ?? [[0, 'neutral']]);
          const pose = poseAt(0, [{ f: 0, p: base, ease: easeOut }], basePose);
          return <Hero key={i} look={c.look} pose={{ ...pose, ...face, blink: Math.max(face.blink, idleBlink(t, seed)), talk: open }} rimId={c.rim ?? 'rimR'} shadow={1} />;
        })}
        {o.cast.map((c, i) =>
          c.bal === undefined ? null : (
            <BalanceOver key={`b${i}`} pose={{ ...basePose, x: c.x, y: c.y, scale: c.scale ?? 1, yaw: c.yaw ?? 0, ...c.pose }} v={balAt(t, c.bal)} flash={balFlash(t, c.bal)} t={t} s={c.balS} pop={(t - (c.balPop ?? 0)) / 8} />
          ),
        )}
        {o.front?.(t)}
      </g>
    );
  };
  return Shot;
};
