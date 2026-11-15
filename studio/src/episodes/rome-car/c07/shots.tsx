import React from 'react';
import { Hero, Pose, kf, camT, clamp, backOut, ShotProps, idleBlink, Glow, factCard, TitleCard, walkPose, FONT } from '../../../engine';
import { YOU, MO, EMPEROR, faceCU, wordF, carShot, insert, onGround, fuelShot, bigWord, CarHeads, SchematicBg } from '../common';
import { Country, GROUND, Car, Torch, Key, Gps, Tracks } from '../sets';
import words from './words.json';

// Chapter 7, the tracks: the fuel light, ten kilometres, five; the engine dies at the foot of the hill where you
// arrived. The tunnel is gone: just a hillside. Torches coming down the road behind. Mo points at the ground: fresh
// tyre tracks that aren't yours, a different tread. Over the hill, an engine. You were never the only one. What would
// you do? Is any of this real? The carts ban, the Circus Maximus, distilling. Part two.

const W = words as { w: string; s: number; e: number }[];
const rel = (a: string, b: string, nb = 1) => wordF(W, b, nb) - wordF(W, a);
const NIGHT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Country t={t} id={id} mode="night" stone city={false} aqueduct={false} tunnel="hill" />;
const HILL = (t: number, glow = 0) => (
  <g>
    <Country t={t} mode="night" stone city={false} aqueduct={false} tunnel="hill" />
    {glow > 0 ? <Glow x={420} y={560} r={600} kind="cool" o={glow} /> : null}
  </g>
);

// ---------- S1: the fuel light comes on ----------
export const S1 = fuelShot(0.08, 0.04, 1, NIGHT);

// ---------- S2: ten kilometres left. Five. ----------
export const S2 = insert({
  Bg: NIGHT,
  draw: (t) => <Gps x={960} y={540} s={1.5} t={t} text={t < rel('Ten', 'Five') ? 'RANGE  10 km' : 'RANGE  5 km'} />,
});

// ---------- S3: the engine coughs and dies at the foot of the hill ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const die = rel('Then', 'dies');
  const v = 1 - clamp((t - die + 10) / 16);
  const x = 1500 - 500 * clamp(t / Math.max(1, die)) + (t > die ? 0 : 0);
  const lit = t < die ? (Math.sin(t * 1.7) > -0.6 ? 1 : 0.3) : clamp(1 - (t - die) / 6) * 0.4;
  return (
    <g transform={camT(kf(t, [[0, 1100], [len, 960]]), 600, kf(t, [[0, 1.05], [len, 1.12]]))}>
      {HILL(t)}
      <Car x={x} y={GROUND} s={0.7} flip t={t} lights={lit} spin={-t * 20 * v} bounce={t < die ? Math.abs(Math.sin(t * 2.5)) * 8 : 0} id="c7s3" inside={<CarHeads t={t} you={{ expr: 'worried' }} mo={{ expr: 'shock' }} />} />
      {[0, 1, 2].map((k) => {
        const p = clamp((t - die + 8 - k * 4) / 20);
        return p > 0 && p < 1 ? <circle key={k} cx={x + 380 + p * 120} cy={GROUND - 60 - p * 140} r={20 + p * 40} fill="#6A6A7A" opacity={0.6 * (1 - p)} /> : null;
      })}
    </g>
  );
};

// ---------- S4: you turn the key again. Nothing. ----------
export const S4 = faceCU({
  look: YOU, Bg: NIGHT, faces: [[0, 'worried'], [rel('You', 'Nothing'), 'oops']], yaw: 0.3, zoom: [3.3, 3.5], light: { x: 960, y: 700, kind: 'cool', o: 0.4 },
  pose: { armR: { a: 50, b: 80 } },
  extra: (t) => <Key x={1010} y={760} s={0.9} rot={-20 + (Math.floor(t / 6) % 2) * 30} />,
});

// ---------- S5: the tunnel is gone: just a hillside ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 520]]), 600, kf(t, [[0, 1.2], [len, 1.4]]))}>
    {HILL(t + 40)}
    <Car x={1180} y={GROUND} s={0.62} flip t={t} id="c7s5" inside={<g />} />
    <Hero look={YOU} pose={onGround(760, 0.66, { yaw: -0.6, look: -0.8, expr: 'shock', armL: { a: 30, b: -20 }, armR: { a: 30, b: -20 }, blink: idleBlink(t, 2) })} />
  </g>
);

// ---------- S6: behind you, far away, a line of torches coming down the road ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1400], [len, 1460]]), 640, kf(t, [[0, 1.4], [len, 1.7]]))}>
    {HILL(t + 80)}
    {Array.from({ length: 9 }).map((_, i) => {
      const x = 1900 - i * 40 - t * 0.6;
      const y = 700 + Math.sin(i * 1.3) * 4 + Math.sin(t / 3 + i) * 2;
      return <Torch key={i} x={x} y={y} t={t} s={0.35} seed={i} />;
    })}
    <Hero look={MO} pose={onGround(1050, 0.62, { yaw: 0.7, look: 0.9, expr: 'worried', blink: idleBlink(t, 4) })} />
  </g>
);

// ---------- S7: Mo gets out, freezes, and points at the ground ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const fr = rel('Mo', 'freezes');
  const pt = rel('Mo', 'points');
  const x = kf(t, [[0, 980], [fr, 1180]]);
  const mo: Pose = t < fr
    ? walkPose(x, t * 0.5, GROUND, 0.8, { expr: 'neutral' }, 1)
    : onGround(1180, 0.8, { yaw: 0.2, look: 0.3, expr: 'shock', armR: { a: 30 + backOut(clamp((t - pt) / 8)) * 30, b: 0 }, handR: t > pt ? 'point' : undefined, headTilt: 10, blink: idleBlink(t, 4) });
  return (
    <g transform={camT(1050, 640, kf(t, [[0, 1.4], [len, 1.55]]))}>
      {HILL(t + 120)}
      <Car x={700} y={GROUND} s={0.7} flip t={t} id="c7s7" inside={<CarHeads t={t} mo={null} you={{ expr: 'worried' }} />} />
      <Hero look={MO} pose={mo} />
      <Tracks x={1300} y={GROUND + 120} t={t} reveal={clamp((t - pt) / 10) * 0.4} tread="block" color="#3A3048" />
    </g>
  );
};

// ---------- S8: tyre tracks in the dust, fresh ones ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#5A5068" />
    {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={(i * 397) % 1920} cy={(i * 211) % 1080} r={3 + (i % 4)} fill="#4A4258" />)}
    <g transform={camT(960, 640, kf(t, [[0, 1], [len, 1.12]]))}>
      <Tracks x={960} y={1120} t={t} reveal={clamp(t / 20)} tread="block" color="#2E2638" />
    </g>
    <Glow x={960} y={700} r={700} kind="cool" o={0.35} />
  </g>
);

// ---------- S9: the pattern is different ----------
export const S9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SchematicBg t={t} />
    <g transform="translate(560 860) scale(0.8)">
      <Tracks x={0} y={0} t={t} reveal={clamp(t / 16)} tread="zig" color="#9FC2E8" />
    </g>
    <g transform="translate(1360 860) scale(0.8)">
      <Tracks x={0} y={0} t={t} reveal={clamp((t - 8) / 16)} tread="block" color="#FF8A3D" />
    </g>
    <text x={560} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill="#9FC2E8" opacity={clamp(t / 6)}>YOUR CAR</text>
    <text x={1360} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill="#FF8A3D" opacity={clamp((t - 10) / 6)}>SOMEONE ELSE</text>
  </g>
);

// ---------- S10: from over the hill, you hear it ----------
export const S10 = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'worried'], [16, 'shock']], yaw: -0.2, zoom: [3.3, 3.7], pose: { look: -0.8, headTilt: -8 }, light: { x: 500, y: 460, kind: 'cool', o: 0.5 } });

// ---------- S11: an engine: headlights glow beyond the crest ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const g = clamp(t / 20);
  return (
    <g transform={camT(kf(t, [[0, 600], [len, 480]]), 580, kf(t, [[0, 1.3], [len, 1.6]]))}>
      {HILL(t + 160, g * 0.9)}
      {[0, 1].map((k) => <path key={k} d={`M ${380 + k * 60} 600 L ${200 + k * 160} 40 L ${300 + k * 160} 40 Z`} fill="#DDEBFF" opacity={g * 0.18} />)}
      <Hero look={YOU} pose={onGround(980, 0.62, { yaw: -0.7, look: -0.9, expr: 'shock', blink: idleBlink(t, 2) })} />
      <Hero look={MO} pose={onGround(1080, 0.62, { yaw: -0.6, look: -0.9, expr: 'shock', blink: idleBlink(t, 4) })} />
    </g>
  );
};

// ---------- S12: you were never the only one ----------
export const S12 = bigWord({ kicker: 'YOU WERE NEVER', word: 'THE ONLY ONE', color: '#FFD23A', Bg: NIGHT, size: 170 });

// ---------- S13: so what would you do? Give it up, or run? ----------
export const S13: React.FC<ShotProps> = ({ t }) => {
  const split = backOut(clamp(t / 10));
  return (
    <g>
      <g>
        <rect width={960} height={1080} fill="#2A1A3A" />
        <g transform={`translate(${-960 * (1 - split)} 0)`}>
          <Hero look={EMPEROR} pose={{ ...onGround(480, 1.1), y: 880 - 154, yaw: 0.2, expr: 'smug', armR: { a: 80, b: 0 }, handR: 'point', blink: idleBlink(t, 7) }} />
          <text x={480} y={190} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#E8B84A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">GIVE IT UP</text>
        </g>
      </g>
      <g>
        <rect x={960} width={960} height={1080} fill="#121A2E" />
        <g transform={`translate(${960 * (1 - split)} 0)`}>
          <path d="M 1060 900 Q 1440 420 1820 900 Z" fill="#26304A" stroke="#100E16" strokeWidth={6} />
          <path d="M 1360 900 Q 1440 720 1520 900 Z" fill="#05060E" />
          <Glow x={1440} y={820} r={260} kind="cool" o={0.5 + Math.sin(t / 4) * 0.1} />
          <text x={1440} y={190} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#9FC2E8" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">RUN</text>
        </g>
      </g>
      <rect x={952} width={16} height={1080} fill="#0B0816" />
      <g transform={`translate(960 560) scale(${backOut(clamp((t - 12) / 8))})`}>
        <circle r={90} fill="#0B0816" stroke="#F6EFE3" strokeWidth={6} />
        <text y={34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#F6EFE3">?</text>
      </g>
    </g>
  );
};

// ---------- S14: tell me in the comments ----------
export const S14 = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'smug']], yaw: 0, zoom: [3.0, 3.1], pose: { armR: { a: 40, b: 20 }, handR: 'point' }, light: { x: 960, y: 500, o: 0.5 } });

// ---------- S15: is any of this real? ----------
export const S15 = bigWord({ kicker: 'IS ANY OF THIS', word: 'REAL?', color: '#FFD23A', Bg: NIGHT });

// ---------- S16: Caesar banned carts by day ----------
export const S16 = factCard({ value: 45, suffix: ' BC', label: 'CAESAR BANS CARTS FROM ROME BY DAY', sub: 'THE LEX JULIA MUNICIPALIS', format: (v) => `${Math.round(v)}` });

// ---------- S17: the Circus Maximus held 150,000 people ----------
export const S17 = factCard({ value: 150000, label: 'SEATS IN THE CIRCUS MAXIMUS', format: (v) => Math.round(v).toLocaleString('en-US') });

// ---------- S18: nobody in Europe distilled alcohol for another thousand years ----------
export const S18 = factCard({ value: 1100, suffix: 's', label: 'FIRST DISTILLED ALCOHOL IN EUROPE', sub: 'SALERNO, ITALY', format: (v) => `${Math.round(v)}` });

// ---------- S19: and whoever made those tracks... ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 520]]), kf(t, [[0, 700], [len, 600]]), kf(t, [[0, 1.2], [len, 1.8]]))}>
    {HILL(t + 200, 0.6)}
    <Tracks x={900} y={GROUND + 140} t={t} reveal={1} tread="block" color="#3A3048" />
  </g>
);

// ---------- S20: part two ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(520, 600, kf(t, [[0, 1.6], [len, 1.75]]))}>{HILL(t + 240, 0.9)}</g>
    <rect width={1920} height={1080} fill="#05060E" opacity={0.35} />
    <TitleCard t={t} lines={['TO BE CONTINUED', 'PART TWO']} size={110} accent="TWO" />
  </g>
);
