import React from 'react';
import {
  Hero, Pose, ShotProps, basePose, camT, kf, clamp, idleBlink, Glow, FONT, LEG_LEN,
} from '../../../engine';
import { YOU, MO, ELLIE, MOM, faceCU, bigWord, iconBoard, Soft } from '../common';
import { FadeStreet, Tunnel, tunHip, TUN, Bathroom, MIRROR, LightDot, HourHud } from '../sets';
import { withHud, Caption } from '../kit';

// Chapter 7, the cliffhanger: hour 34, deep underground, light slower than an ant; your hand moves two seconds before
// you see it. Everyone asleep. In the shelter's bathroom you wait for your reflection to catch up. It smiles. You
// didn't. It points behind you. Light only ever shows the past, so what is this mirror showing you? Comments, the
// facts, part two.

const TUNBG: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Tunnel t={t} id={id} people={false} />;
const BATH: React.FC<{ t: number; id?: string }> = ({ t }) => <Bathroom t={t} />;

// the reflection: you, facing the camera, inside the mirror
const reflPose = (t: number, o: Partial<Pose> = {}): Pose => ({ ...basePose, x: 960, y: 560, scale: 1.25, yaw: 0, expr: 'neutral', blink: idleBlink(t, 7), look: 0, ...o });
const Mirror: React.FC<{ t: number; refl: Pose; me?: boolean; flicker?: number; glint?: number }> = ({ t, refl, me = true, flicker = 0, glint = 0 }) => (
  <g>
    <Bathroom t={t} flicker={flicker} reflect={<Hero look={YOU} pose={{ ...refl, glint, glintColor: '#9AE8FF' }} shadow={0} />} />
    {me ? (
      // you, from behind, dark against the bulb: the hood and shoulders
      <g>
        <path d="M 640 1180 Q 660 900 860 860 L 1060 860 Q 1260 900 1280 1180 Z" fill="#C85E1C" stroke="#100E16" strokeWidth={10} />
        <ellipse cx={960} cy={780} rx={170} ry={180} fill="#C85E1C" stroke="#100E16" strokeWidth={10} />
        <ellipse cx={960} cy={790} rx={120} ry={130} fill="#A84E16" />
      </g>
    ) : null}
  </g>
);

// ---------- S1: the tunnel shelter, hour 34 ----------
export const S1 = withHud(((p: ShotProps) => <g transform={camT(960, 520, kf(p.t, [[0, 1.05], [p.len, 1.15]]))}><Tunnel t={p.t} /></g>) as React.FC<ShotProps>, 34, '5:00 PM');

// ---------- S2: on the platform floor: an ant overtakes a crawling dot of light ----------
const Ant: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 0, 1].map((k) => <path key={k} d={`M ${k * 40} 0 l ${-20 + Math.sin(t + k) * 10} 50 M ${k * 40} 0 l ${20 - Math.sin(t + k) * 10} 50`} stroke="#100E16" strokeWidth={8} />)}
    <ellipse cx={-70} cy={0} rx={50} ry={34} fill="#2A1A14" />
    <ellipse cx={10} cy={0} rx={36} ry={26} fill="#2A1A14" />
    <circle cx={80} cy={-6} r={30} fill="#2A1A14" />
    <path d="M 95 -30 q 30 -40 60 -30 M 90 -32 q 20 -50 50 -50" stroke="#2A1A14" strokeWidth={6} fill="none" />
  </g>
);
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len));
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2C34" />
      {Array.from({ length: 12 }).map((_, i) => <line key={i} x1={i * 180} y1={0} x2={i * 180 - 200} y2={1080} stroke="#24262E" strokeWidth={6} />)}
      <Ant x={300 + 1300 * k} y={700} s={1.4} t={t} />
      <circle cx={300 + 1000 * k} cy={760} r={18} fill="#FFF2B8" />
      <Glow x={300 + 1000 * k} y={760} r={90} kind="warm" o={0.8} />
      <Caption t={t} text="SLOWER THAN AN ANT" y={250} size={100} />
    </g>
  );
};

// ---------- S3: your hand rises in the lamplight; what you see of it trails two seconds behind ----------
const Hand: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => (
  <g opacity={o}>
    <path d={`M ${x - 60} ${y + 400} L ${x - 40} ${y + 60} L ${x + 40} ${y + 60} L ${x + 60} ${y + 400} Z`} fill="#F07A2A" stroke="#100E16" strokeWidth={8} />
    <ellipse cx={x} cy={y} rx={80} ry={100} fill="#26232F" stroke="#100E16" strokeWidth={8} />
    {[-50, -18, 16, 48].map((fx, i) => <rect key={i} x={x + fx - 14} y={y - 170 + Math.abs(fx) * 0.6} width={28} height={110} rx={14} fill="#26232F" stroke="#100E16" strokeWidth={6} />)}
  </g>
);
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const real = kf(t, [[0, 900], [len * 0.5, 420]]);
  const seen = kf(t, [[0, 900], [len * 0.35, 900], [len, 460]]);
  return (
    <g>
      <Soft blur={16} dim={0.35}><g transform={camT(960, 520, 1.4)}><TUNBG t={t + 60} /></g></Soft>
      <Hand x={900} y={real} o={0.25} />
      <Hand x={900} y={seen} />
      <text x={1250} y={real} fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3" opacity={0.6}>YOUR HAND</text>
      <text x={1250} y={seen} fontFamily={FONT.ui} fontSize={34} fill="#FFD23A">WHAT YOU SEE</text>
    </g>
  );
};

// ---------- S4: Ellie asleep on a camp bed next to Mom ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const lie = (x: number, y: number, s: number, seed: number): Pose => ({ ...basePose, x, y, scale: s, spin: -88, expr: 'tired', blink: 1, yaw: 0.2, tilt: Math.sin(t / 30 + seed) * 1 });
  return (
    <g transform={camT(960, 640, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <TUNBG t={t + 100} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={0.35} />
      <rect x={560} y={700} width={360} height={50} rx={10} fill="#5A6A4A" stroke="#100E16" strokeWidth={5} />
      <rect x={980} y={700} width={420} height={50} rx={10} fill="#5A6A4A" stroke="#100E16" strokeWidth={5} />
      <Hero look={ELLIE} pose={lie(740, 700, 0.45, 1)} shadow={0} />
      <Hero look={MOM} pose={lie(1190, 700, 0.6, 2)} shadow={0} />
      <rect x={560} y={680} width={360} height={30} rx={12} fill="#7A4A5A" opacity={0.9} />
      <rect x={980} y={672} width={420} height={36} rx={12} fill="#3A5A7A" opacity={0.9} />
    </g>
  );
};

// ---------- S5: close, Mo, snoring: Zzz ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    {faceCU({ look: MO, Bg: TUNBG, faces: [[0, 'tired']], yaw: 0.2, zoom: [3.2, 3.3], dark: 0.3, pose: { blink: 1, headTilt: 14 } as Partial<Pose> })({ t, len, f: t })}
    {[0, 1, 2].map((k) => <text key={k} x={1180 + k * 50} y={360 - k * 60 - (t % 30)} fontFamily={FONT.title} fontWeight={800} fontSize={60 + k * 14} fill="#F6EFE3" opacity={0.7}>z</text>)}
  </g>
);

// ---------- S6: above: the frozen, black city ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.06], [len, 1.0]]))}>
    <FadeStreet t={t + 900} sun={0} stars={0.15} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#000" opacity={0.6} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#9AC8F0" opacity={0.12} />
    {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={(i * 137) % 1920} cy={((i * 71) + t * 2) % 1080} r={3} fill="#E8F4FF" opacity={0.5} />)}
  </g>
);

// ---------- S7: close, you, in the lamp light: warm. For now. ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 960, y: tunHip(1), scale: 1, yaw: 0.25, expr: t > len * 0.6 ? 'worried' : 'neutral', blink: idleBlink(t, 4), look: 0.3 };
  return (
    <g>
      <Soft blur={10} dim={0.2}><g transform={camT(960, 520, 1.4)}><TUNBG t={t + 60} /></g></Soft>
      <g transform={camT(960, 520, kf(t, [[0, 2.8], [len, 3.0]]))}>
        <Glow x={1060} y={340} r={260} kind="warm" o={0.6} />
        <Hero look={YOU} pose={me} shadow={0} />
      </g>
    </g>
  );
};

// ---------- S8: the shelter bathroom: the mirror over the sink, your reflection arriving ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 0.85], [len, 0.95]]))}>
    <Mirror t={t} refl={reflPose(t)} />
  </g>
);

// ---------- S9: you stand perfectly still; the reflection is still catching up (it fades in) ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 480, kf(t, [[0, 1.05], [len, 1.15]]))}>
    <Bathroom t={t} reflect={<g opacity={kf(t, [[0, 0.1], [len, 1]])}><Hero look={YOU} pose={reflPose(t)} shadow={0} /></g>} />
    <path d="M 640 1180 Q 660 900 860 860 L 1060 860 Q 1260 900 1280 1180 Z" fill="#C85E1C" stroke="#100E16" strokeWidth={10} />
    <ellipse cx={960} cy={780} rx={170} ry={180} fill="#C85E1C" stroke="#100E16" strokeWidth={10} />
    <ellipse cx={960} cy={790} rx={120} ry={130} fill="#A84E16" />
  </g>
);

// ---------- S10: close on the mirror: the reflection... smiles ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 360, kf(t, [[0, 1.7], [len, 1.9]]))}>
    <Mirror t={t} refl={reflPose(t, { expr: t > 14 ? 'smug' : 'neutral', blink: 0 })} me={false} />
  </g>
);

// ---------- S11: close, the real you: you didn't smile ----------
export const S11 = faceCU({ look: YOU, Bg: BATH, faces: [[0, 'shock']], yaw: 0.15, eyes: 0, zoom: [3.3, 3.6], light: { x: 960, y: 200, kind: 'warm', o: 0.5 } });

// ---------- S12: the reflection slowly lifts its hand and points past you ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const a = kf(t, [[0, 10], [len * 0.7, 120]]);
  return (
    <g transform={camT(960, 440, 1.3)}>
      <Mirror t={t} refl={reflPose(t, { expr: 'smug', blink: 0, armR: { a, b: 0 }, handR: 'point' as Pose['handR'] })} />
    </g>
  );
};

// ---------- S13: the rule ----------
export const S13 = bigWord({ kicker: 'THE RULE', word: 'LIGHT SHOWS THE PAST', color: '#FFD23A', size: 130 });

// ---------- S14: the mirror, slow push in, the bulb flickering, the reflection still smiling ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 380, kf(t, [[0, 1.2], [len, 1.6]]))}>
    <Mirror t={t} refl={reflPose(t, { expr: 'smug', blink: 0, armR: { a: 120, b: 0 } })} flicker={1} />
  </g>
);

// ---------- S15: what would you do? ----------
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#0C0A16" />
    <text x={960} y={330} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#F6EFE3" opacity={clamp(t / 6)}>WHAT WOULD YOU DO?</text>
    {['THE BUS', 'YOUR MOM'].map((s, i) => {
      const k = clamp((t - 10 - i * 14) / 8);
      return (
        <g key={s} opacity={k} transform={`translate(${620 + i * 680} 600) scale(${0.7 + 0.3 * k})`}>
          <rect x={-280} y={-90} width={560} height={160} rx={30} fill={i ? '#E8252A' : '#3A8AE0'} stroke="#100E16" strokeWidth={8} />
          <text y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#F6EFE3">{s}</text>
        </g>
      );
    })}
    <text x={960} y={620} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3">OR</text>
    <text x={960} y={880} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill="#FFD23A" opacity={clamp((t - 40) / 6)}>TELL ME IN THE COMMENTS</text>
  </g>
);

// ---------- S16: is any of this real? The facts ----------
export const S16 = iconBoard({
  title: 'IS ANY OF THIS REAL?',
  items: [
    { name: 'clock', label: 'SUNLIGHT: 8 MIN', at: 36, live: 36 },
    { name: 'fire', label: 'NO SUN: FROZEN IN A WEEK', at: 130, live: 130 },
    { name: 'chip', label: 'GPS RUNS ON LIGHT', at: 180, live: 180 },
  ],
});

// ---------- S17: the mirror again, darker, the reflection's eyes catching the light ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 360, kf(t, [[0, 1.8], [len, 2.1]]))}>
    <Mirror t={t} refl={reflPose(t, { expr: 'smug', blink: 0 })} me={false} glint={0.8} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#000" opacity={0.35} />
  </g>
);

// ---------- S18: PART 2 ----------
export const S18 = bigWord({ kicker: 'FIND OUT IN', word: 'PART 2', color: '#FFD23A', size: 260 });
