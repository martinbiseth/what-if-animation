import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, FONT, SUBURB, THINK, ThoughtBubble, Bedroom, BedDuvet, bedSit, WINDOW, faceAt, idleBlink, ThinkWaves } from '../../../engine';
import words from './words.json';
import tl from './timeline.json';
import { YOU, MUM, ELLIE, NORA, StreetSet, faceCU, thinkCard, bigWord, thoughtCU, scene, at, cueIn, Silent, listCard, ThoughtField } from '../common';
import type { Look } from '../../../engine';

// Chapter 7, the loudest voice: night, everything okay; a voice louder than anything, the window shakes (rule 3: the
// more someone thinks about you, the louder they get); it's Nora: she heard every thought you had, she gave it to you,
// tomorrow she takes it back. Then silence: not Mum, not Ellie, not the street. A girl under the streetlight looks up.
// Part two. Is any of this real? The three real facts. Would you want it? Tell me in the comments.

const c = (shot: string, w: string, n = 1) => cueIn(words, tl, shot, w, n);
const NIGHT = StreetSet('night');
const ROOM = ({ t, id }: { t: number; id?: string }) => <Bedroom t={t} id={id} veil={0.6} clock="23:48" lamp={0} />;
const LAMP_X = 1360;

/** Someone in bed: sits on the bed under the duvet; awake or asleep. */
const InBed: React.FC<{ t: number; look: Look; id: string; asleep?: boolean; expr?: Pose['expr']; tilt?: number; shake?: number; hands?: boolean; waves?: number; cam?: [number, number, number, number] }> = ({ t, look, id, asleep, expr = 'neutral', tilt = -40, shake = 0, hands, waves = 0, cam = [760, 600, 1.7, 1.8] }) => {
  const sit = bedSit(0.22);
  const face = faceAt(t, [[0, expr]]);
  const sh = shake * Math.sin(t * 2.7) * 4;
  const me: Pose = {
    ...basePose, x: sit.x + sh, y: sit.y, scale: sit.scale, yaw: 0.4, look: 0.5, tilt, expr: face.expr, blink: asleep ? 1 : Math.max(face.blink, idleBlink(t, 4)),
    ...(hands ? { armL: { a: 150, b: -150 }, armR: { a: 150, b: -150 } } : {}),
  };
  return (
    <g transform={camT(sit.x + 120, sit.y - 130 * sit.scale, kf(t, [[0, cam[2]], [200, cam[3]]]))}>
      <Bedroom t={t} id={id} veil={0.65} clock="23:48" lamp={0} duvet={false} />
      <Hero look={look} pose={me} />
      {waves ? <ThinkWaves pose={me} t={t} amt={waves} color={THINK.hot} /> : null}
      <BedDuvet knees={tilt > -20 ? 1 : 0} />
      {asleep ? <text x={sit.x + 120} y={sit.y - 220 * sit.scale} fontFamily={FONT.hand} fontWeight={700} fontSize={44} fill={THINK.calm} opacity={0.5 + 0.5 * Math.sin(t / 8)}>z z z</text> : null}
    </g>
  );
};

/** The streetlight across the road, with its pool of light. */
const StreetLamp: React.FC<{ x?: number }> = ({ x = LAMP_X }) => {
  const f = SUBURB.feet;
  return (
    <g>
      <path d={`M ${x - 20} ${f - 470} L ${x + 20} ${f - 470} L ${x + 230} ${f + 20} L ${x - 230} ${f + 20} Z`} fill="#FFE9A8" opacity={0.18} />
      <ellipse cx={x} cy={f + 10} rx={240} ry={34} fill="#FFE9A8" opacity={0.25} />
      <rect x={x - 7} y={f - 480} width={14} height={480} fill="#1E2630" />
      <rect x={x - 40} y={f - 490} width={80} height={18} rx={8} fill="#1E2630" />
      <ellipse cx={x} cy={f - 470} rx={30} ry={10} fill="#FFF3C0" />
    </g>
  );
};

export const S1 = thinkCard({ kicker: 'CHAPTER 7', title: 'THE LOUDEST VOICE', seed: 29 });

// ---------- S2-S5: that night, everything feels okay ----------
export const S2: React.FC<ShotProps> = ({ t }) => <InBed t={t} look={YOU} id="b2" expr="happy" tilt={-50} cam={[0, 0, 2.50, 2.60]} />;
export const S3: React.FC<ShotProps> = ({ t }) => <InBed t={t} look={MUM} id="b3" asleep tilt={-34} cam={[0, 0, 2.80, 2.90]} />;
export const S4: React.FC<ShotProps> = ({ t }) => <InBed t={t} look={ELLIE} id="b4" asleep tilt={-34} cam={[0, 0, 2.80, 2.90]} />;
export const S5 = scene({ Set: NIGHT, cam: [960, 520, 1.0], to: [960, 520, 1.04], setT: 100, cast: [], back: () => <StreetLamp /> });

// ---------- S6-S8: then a voice starts; louder than anything; the glass shakes ----------
export const S6: React.FC<ShotProps> = ({ t }) => <InBed t={t} look={YOU} id="b6" expr="worried" tilt={-10} waves={clamp((t - 20) / 30)} cam={[0, 0, 2.70, 2.80]} />;
export const S7 = faceCU({ look: YOU, Bg: ROOM, faces: [[0, 'shock']], yaw: 0.1, zoom: [3.2, 3.6], hands: 'ears', shake: 3, waves: 1 });
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const k = c('S8', 'shakes');
  const amp = kf(t, [[0, 2], [k, 10], [len, 14]]);
  const sx = Math.sin(t * 3.1) * amp, sy = Math.cos(t * 2.3) * amp * 0.6;
  const cx = (WINDOW.x0 + WINDOW.x1) / 2, cy = (WINDOW.y0 + WINDOW.y1) / 2;
  return (
    <g transform={camT(cx, cy, kf(t, [[0, 3.4], [len, 3.7]]))}>
      <Bedroom t={t} id="b8" veil={0.5} clock="23:48" lamp={0} />
      <g transform={`translate(${sx} ${sy})`}>
        <rect x={WINDOW.x0} y={WINDOW.y0} width={WINDOW.x1 - WINDOW.x0} height={WINDOW.y1 - WINDOW.y0} fill="#B9A4FF" opacity={0.12 + 0.1 * Math.abs(Math.sin(t / 2))} />
        <path d={`M ${cx - 40} ${cy - 30} L ${cx + 10} ${cy + 5} L ${cx - 20} ${cy + 50} M ${cx + 10} ${cy + 5} L ${cx + 70} ${cy - 10}`} stroke="#F6EFE3" strokeWidth={2.5} fill="none" opacity={clamp((t - k) / 6)} />
      </g>
      {[0, 1, 2].map((i) => {
        const r = ((t * 4 + i * 40) % 120) + 10;
        return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={THINK.hot} strokeWidth={3} opacity={(1 - r / 130) * 0.7} />;
      })}
    </g>
  );
};
export const S9 = bigWord({ kicker: 'RULE 3', word: 'THE MORE THEY THINK OF YOU...', sub: 'the louder they get', color: THINK.hot, Bg: ROOM, size: 100 });

// ---------- S10-S14: it's Nora ----------
const NO = () => at(LAMP_X, { yaw: -0.3, look: -0.4, headTilt: -18 });
export const S10 = scene({
  Set: NIGHT, cam: [LAMP_X - 60, 440, 2.0], to: [LAMP_X - 60, 440, 2.15], setT: 200, back: () => <StreetLamp />, shake: () => 3,
  cast: [{ look: NORA, pose: NO(), faces: [[0, 'neutral']], waves: 1 }],
});
export const S11 = thoughtCU({ text: 'You thought your head was the only quiet place left.', s: 1.0, loud: 1, wrap: 22, color: THINK.glow, Bg: NIGHT });
export const S12 = faceCU({
  look: NORA, Bg: NIGHT, faces: [[0, 'neutral'], [c('S12', "I've"), 'smug']], yaw: -0.25, zoom: [2.5, 2.7], look_: 0.3, glint: 1, glintColor: THINK.glow, shake: 2,
  think: { th: [[0, 'It never was.'], [c('S12', "I've"), "I've heard every thought you've had."]], s: 0.42, loud: 1, side: 0.6, wrap: 22, lift: 2 },
});
export const S13 = faceCU({
  look: YOU, Bg: ROOM, faces: [[0, 'shock']], yaw: 0.2, zoom: [3.0, 3.3], hands: 'head', shake: 2,
  front: (t) => (t > 4 ? <ThoughtBubble x={1400} y={300} text={t < c('S13', 'I', 2) ? "I didn't give it away." : 'I gave it to you.'} s={0.9} pop={(t - 4) / 8} t={t} type={1} side={-0.4} loud={1} wrap={16} /> : null),
});
export const S14 = faceCU({
  look: NORA, Bg: NIGHT, faces: [[0, 'smug']], yaw: -0.25, zoom: [2.4, 2.6], look_: 0.3, glint: 1, glintColor: THINK.hot, shake: 3,
  think: { th: [[0, 'And tomorrow...'], [c('S14', "I'm"), "And tomorrow, I'm taking it back."]], s: 0.4, loud: 1, side: 0.6, wrap: 22, lift: 0.5, color: THINK.hot },
});

// ---------- S15-S20: then everything stops ----------
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g>
    <InBed t={t} look={YOU} id="b15" expr="shock" tilt={0} waves={clamp(1 - t / 10)} cam={[0, 0, 2.70, 2.75]} />
    <rect width={1920} height={1080} fill="#0B0816" opacity={kf(t, [[0, 0], [c('S15', 'Everything'), 0.15], [c('S15', 'Everything') + 10, 0.35]])} />
  </g>
);
export const S16 = faceCU({ look: YOU, Bg: ROOM, faces: [[0, 'worried']], yaw: 0.05, zoom: [3.1, 3.4], look_: -0.6 });
export const S17: React.FC<ShotProps> = ({ t }) => (
  <g>
    <InBed t={t} look={MUM} id="b17" asleep tilt={-34} cam={[0, 0, 2.80, 2.85]} />
  </g>
);
export const S18: React.FC<ShotProps> = ({ t }) => <InBed t={t} look={ELLIE} id="b18" asleep tilt={-34} cam={[0, 0, 2.80, 2.85]} />;
export const S19 = scene({ Set: NIGHT, cam: [960, 520, 1.0], to: [960, 520, 1.02], setT: 300, cast: [], back: () => <StreetLamp /> });
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#07050E" />
    <text x={960} y={560} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={64} fill={THINK.glow} opacity={clamp((t - 6) / 12) * kf(t, [[len - 8, 1], [len, 0.6]])}>silence.</text>
  </g>
);

// ---------- S21-S22: a girl under the streetlight, looking up at your window ----------
export const S21 = scene({
  Set: NIGHT, cam: [LAMP_X - 200, 480, 1.25], to: [LAMP_X - 100, 470, 1.4], setT: 400, back: () => <StreetLamp />,
  cast: [{ look: NORA, pose: NO(), faces: [[0, 'neutral']] }],
  over: (t) => <g transform={camT(LAMP_X - 200 + 100 * clamp(t / 135), 480 - 10 * clamp(t / 135), 1.25 + 0.15 * clamp(t / 135))}><Silent x={LAMP_X} y={at(LAMP_X).y - 215} s={0.7} t={t} /></g>,
});
export const S22 = faceCU({ look: NORA, Bg: NIGHT, faces: [[0, 'neutral'], [60, 'smug']], yaw: -0.2, zoom: [2.9, 3.3], pose: { headTilt: -14 }, look_: 0.2, glint: 1, glintColor: THINK.glow, extra: (t, pose) => <Silent x={pose.x} y={pose.y - 190} s={0.8} t={t} /> });
export const S23 = bigWord({ kicker: 'TO BE CONTINUED', word: 'PART TWO', color: THINK.glow, Bg: NIGHT, size: 170 });

// ---------- S24-S27: is any of this real? ----------
export const S24 = bigWord({ kicker: 'HEARING THOUGHTS? NO.', word: 'IS ANY OF THIS REAL?', size: 120, color: '#F6EFE3', Bg: ({ t }) => <ThoughtField t={t} n={16} seed={41} /> });
export const S25 = listCard({
  title: "THAT'S REAL",
  items: [
    { at: 26, text: '6,000+ THOUGHTS A DAY', ok: true },
    { at: 96, text: 'A WANDERING MIND: 47%', ok: true },
  ],
});
export const S27 = listCard({
  title: "THAT'S REAL",
  items: [
    { at: -20, text: '6,000+ THOUGHTS A DAY', ok: true },
    { at: -20, text: 'A WANDERING MIND: 47%', ok: true },
    { at: 12, text: 'INNER SPEECH DECODED', ok: true },
  ],
});

// ---------- S26: would you want to hear everyone's thoughts? Tell me in the comments ----------
export const S26: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 460, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <ThoughtField t={t} n={20} seed={47} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.45} />
    <g transform={`translate(960 ${430}) scale(${backOut(clamp((t - 4) / 10))})`}>
      <text x={0} y={0} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">WOULD YOU WANT IT?</text>
    </g>
    <g transform={`translate(960 940) scale(${backOut(clamp((t - c('S26', 'Tell')) / 10))})`}>
      <rect x={-420} y={-70} width={840} height={110} rx={55} fill="#0B0816" opacity={0.8} />
      <text x={0} y={8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={THINK.warm}>TELL ME IN THE COMMENTS</text>
    </g>
  </g>
);
