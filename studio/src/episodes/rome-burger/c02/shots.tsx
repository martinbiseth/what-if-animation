import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, faceAt, Glow, walkPose, LEG_LEN, factCard } from '../../../engine';
import { YOU, ELLIE, CITIZENS, faceCU, bigWord, wordF, iconBoard, span } from '../common';
import { RomeStreet, RomeAlley, Coin, PaperBag, Burger, romeHip, P0 } from '../sets';
import { street, onStreet, insert, streetSet, AlleySet, Chip, walker } from '../kit';
import { StreetModern, streetHip } from '../../electricity/sets';
import words from './words.json';

// Chapter 2, how you got here: walking home with takeaway in the present, a flash, a ringing; a narrow Roman street
// (smoke, donkeys, fish sauce), tunics, a carter shouting in Latin; Nero on a coin; Rome AD 64, a million people;
// the rules (no way back, a phone, one cold burger; no fridge, no fryer, no machines); what you know; and the plant:
// something about Rome in the summer of 64 sounds familiar.

const W = words;
const DAY = streetSet({ mode: 'day', shop: false });
const MODERN: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="dusk" power={1} car />;

// ---------- S1: the present, at dusk: you and Ellie walking home, a takeaway bag swinging ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const x = 700 + t * 2.4;
  const g = streetHip(1) + LEG_LEN;
  const you = walkPose(x, t * 0.5, g, 1, { yaw: 0.8, expr: 'happy', blink: idleBlink(t, 1) }, 1);
  const el = walkPose(x - 170, t * 0.6 + 1, streetHip(0.7) + LEG_LEN * 0.7, 0.7, { yaw: 0.8, expr: 'happy', blink: idleBlink(t, 2), talk: Math.max(0, Math.sin(t / 3)) * 0.5 }, 1);
  return (
    <g transform={camT(x + 40, 560, 1.45)}>
      <StreetModern t={t + 100} mode="dusk" power={1} car={false} />
      <Hero look={ELLIE} pose={el} />
      <Hero look={YOU} pose={you} />
      <PaperBag x={x + 66 + Math.sin(t / 4) * 6} y={g - 90} s={0.42} />
    </g>
  );
};

// ---------- S2: a white flash swallows the street ----------
export const S2: React.FC<ShotProps> = ({ t }) => {
  const f = clamp(t / 6);
  return (
    <g>
      <g transform={camT(960, 520, 1.6 + t * 0.03)}>
        <StreetModern t={t + 260} mode="dusk" power={1} car={false} />
      </g>
      <Glow x={960} y={500} r={400 + t * 60} kind="cool" o={1} />
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={f} />
    </g>
  );
};

// ---------- S3: your face, eyes squeezed, rings of sound around your head ----------
export const S3: React.FC<ShotProps> = (p) => {
  const Face = faceCU({ look: YOU, Bg: MODERN, faces: [[0, 'dizzy']], yaw: 0, zoom: [3.3, 3.6], dark: 0.3 });
  return (
    <g>
      <Face {...p} />
      {[0, 1, 2].map((k) => {
        const q = ((p.t + k * 8) % 24) / 24;
        return <circle key={k} cx={960} cy={480} r={240 + q * 400} fill="none" stroke="#FFFFFF" strokeWidth={10} opacity={0.6 * (1 - q)} />;
      })}
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={clamp(1 - p.t / 10) * 0.8} />
    </g>
  );
};

// ---------- S4: a narrow alley in Rome; you and Ellie, blinking, the bag still in your hand ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const face = faceAt(t, [[0, 'shock'], [50, 'worried']]);
  const look = Math.sin(t / 22);
  const you: Pose = { ...basePose, x: 900, y: 860 - LEG_LEN, yaw: look * 0.6, look, ...face, blink: Math.max(face.blink, idleBlink(t, 1)), armR: { a: 14, b: -8 } };
  const el: Pose = { ...basePose, x: 1080, y: 860 - LEG_LEN * 0.7, scale: 0.7, yaw: -0.4, look: -0.5, expr: 'worried', blink: idleBlink(t, 4), armL: { a: 60, b: -30 } };
  return (
    <g transform={camT(980, kf(t, [[0, 640], [len, 620]]), kf(t, [[0, 1.2], [len, 1.35]]))}>
      <RomeAlley t={t} flash={clamp(1 - t / 8)} />
      <Hero look={ELLIE} pose={el} />
      <Hero look={YOU} pose={you} />
      <PaperBag x={950} y={830} s={0.36} />
      {/* the smell: smoke drifting across the strip of sky */}
      {[0, 1, 2].map((k) => {
        const q = ((t * 0.6 + k * 30) % 90) / 90;
        return <circle key={k} cx={700 + q * 500} cy={300 - q * 80} r={60 + q * 60} fill="#D8D0C8" opacity={0.3 * Math.sin(q * Math.PI)} />;
      })}
    </g>
  );
};

// ---------- S5: Romans in tunics walk past; you stare ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, 1.3)}>
    <RomeStreet t={t + 120} shop={false} />
    {walker(CITIZENS[0], 1500, 600, len * 1.4, t, romeHip(0.9), 0.9, { expr: 'neutral' })}
    {walker(CITIZENS[2], 400, 1500, len * 1.6, t, romeHip(0.85), 0.85, { expr: 'neutral' })}
    <Hero look={YOU} pose={{ ...basePose, x: 1000, y: romeHip(1), yaw: 0.1, look: Math.sin(t / 10), ...faceAt(t, [[0, 'shock'], [44, 'oops']]), blink: idleBlink(t, 3) }} />
    {walker(CITIZENS[4], 1700, 300, len * 1.2, t, romeHip(0.95), 0.95, { expr: 'neutral' })}
  </g>
);

/** A wooden hand cart with a barrel, pushed from the left. */
const Cart: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-160} y={-120} width={300} height={70} fill="#8A5A32" stroke={P0} strokeWidth={5} />
    <path d="M -160 -90 L -260 -60" stroke="#6A4026" strokeWidth={12} strokeLinecap="round" />
    <rect x={-80} y={-210} width={120} height={100} rx={20} fill="#9A6A3A" stroke={P0} strokeWidth={5} />
    <path d="M -80 -180 L 40 -180 M -80 -140 L 40 -140" stroke="#5A3A22" strokeWidth={5} />
    <g transform={`translate(0 -30) rotate(${t * 4})`}>
      <circle r={50} fill="none" stroke="#5A3A22" strokeWidth={12} />
      {[0, 60, 120].map((a) => <path key={a} d="M -50 0 L 50 0" stroke="#5A3A22" strokeWidth={6} transform={`rotate(${a})`} />)}
    </g>
  </g>
);

// ---------- S6: a man with a cart shouts at you in Latin ----------
export const S6: React.FC<ShotProps> = ({ t, len, f }) => {
  const sp = span(W, 'shouts', 'Latin');
  const shout = f / 30 > sp[0] - 0.3 ? 0.6 + 0.4 * Math.abs(Math.sin(t / 2)) : 0;
  const man: Pose = { ...basePose, x: 820, y: romeHip(1), yaw: 0.5, expr: 'oops', armR: { a: 120 + Math.sin(t / 2) * 20, b: -30 }, handR: 'point', talk: shout, blink: idleBlink(t, 2) };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 560, 1.6)}>
      <RomeStreet t={t + 160} shop={false} />
      <Cart x={1060} y={romeHip(1) + LEG_LEN + 10} t={0} />
      <Hero look={CITIZENS[3]} pose={man} />
      <Hero look={YOU} pose={{ ...basePose, x: 1320, y: romeHip(1), yaw: -0.5, expr: 'shock', tilt: 8, blink: idleBlink(t, 5) }} />
      {shout > 0 ? <text x={760} y={340} fontFamily="Kalam" fontWeight={700} fontSize={64} fill="#FFFFFF" stroke={P0} strokeWidth={8} paintOrder="stroke" opacity={clamp((t - 10) / 4)}>CAVE!</text> : null}
    </g>
  );
};

// ---------- S7: a coin in the dirt, an emperor's head on it: NERO ----------
export const S7 = insert({
  Bg: DAY, zoom: [2.0, 2.3], cy: 560, dim: 0.35,
  draw: (t) => (
    <g>
      <ellipse cx={960} cy={600} rx={260} ry={80} fill="#5A4A3A" opacity={0.6} />
      <Coin x={960} y={540} r={120} metal="bronze" />
      <g opacity={clamp((t - 50) / 8)}>
        <text x={960} y={760} textAnchor="middle" fontFamily="Fragment Mono" fontSize={56} letterSpacing={12} fill="#F6EFE3" stroke={P0} strokeWidth={6} paintOrder="stroke">NERO</text>
      </g>
    </g>
  ),
});

// ---------- S8: the city wide: ROME, SUMMER AD 64 ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, kf(t, [[0, 500], [len, 460]]), kf(t, [[0, 0.78], [len, 0.84]]))}>
      <RomeStreet t={t + 300} shop={false} />
    </g>
    <Chip t={t - 10} text="ROME · SUMMER, AD 64" x={640} y={150} />
  </g>
);

// ---------- S9: around a million people ----------
export const S9 = factCard({ value: 1000000, label: 'PEOPLE IN ROME, AD 64', sub: 'the biggest city in the world (modern estimates)', real: false });

// ---------- S10: the rules: NO WAY BACK ----------
export const S10 = bigWord({ kicker: 'RULE ONE', word: 'NO WAY BACK', color: '#FF8A3D', Bg: AlleySet, size: 170 });

/** A phone face up, no signal: a crossed-out bar icon on its screen. */
const Phone: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-140} width={140} height={280} rx={22} fill="#1A1820" stroke={P0} strokeWidth={6} />
    <rect x={-58} y={-120} width={116} height={240} rx={10} fill="#2A3A5A" />
    {[0, 1, 2, 3].map((k) => <rect key={k} x={-30 + k * 16} y={-20 - k * 12} width={10} height={20 + k * 12} fill="#5A6A8A" />)}
    <path d="M -40 -70 L 40 20" stroke="#FF4A4A" strokeWidth={8} strokeLinecap="round" />
    <text x={0} y={70} textAnchor="middle" fontFamily="Fragment Mono" fontSize={20} fill="#F6EFE3">NO SIGNAL</text>
  </g>
);

// ---------- S11: what you have: the clothes you stand in, a phone with no signal, one cold burger in a bag ----------
export const S11 = insert({
  Bg: AlleySet, zoom: [1.3, 1.4], cy: 560, dim: 0.45,
  draw: (t, len) => {
    const pop = (d: number) => backOut(clamp((t - d) / 8));
    const sb = span(W, 'phone', 'signal'), bb = span(W, 'one', 'bag');
    const t0 = (sb[0] - W[0].s) * 30 - (span(W, 'You', 'wearing', 4)[0] * 30);
    return (
      <g>
        <ellipse cx={960} cy={760} rx={700} ry={90} fill="#000" opacity={0.25} />
        <g transform={`translate(560 600) scale(${pop(0)})`}><Hero look={YOU} pose={{ ...basePose, x: 0, y: 0, scale: 0.9, yaw: 0, expr: 'neutral', blink: idleBlink(t, 1) }} shadow={0} /></g>
        <g transform={`translate(960 560) scale(${pop(Math.max(10, t0 * 0 + 50))})`}><Phone x={0} y={0} s={0.9} rot={-6} /></g>
        <g transform={`translate(1360 720) scale(${pop(100)})`}>
          <PaperBag x={0} y={0} s={0.9} open={1} />
          <Burger x={10} y={-150} s={0.75} />
        </g>
        {void bb}
        {void len}
      </g>
    );
  },
});

// ---------- S12: no fridge, no fryer, no electricity, not one machine ----------
const w0 = wordF(W, 'No', 3);
const rel = (w: string, n = 1) => wordF(W, w, n) - w0 + 2;
export const S12 = iconBoard({
  title: 'NOT IN ROME',
  items: [
    { name: 'fridge', label: 'FRIDGE', at: 0, cross: 8 },
    { name: 'fire', label: 'FRYER', at: rel('fryer'), cross: rel('fryer') + 8 },
    { name: 'plug', label: 'ELECTRICITY', at: rel('electricity'), cross: rel('electricity') + 10 },
    { name: 'factory', label: 'MACHINES', at: rel('machine'), cross: rel('machine') + 8 },
  ],
});

// ---------- S13: but you know something nobody in Rome knows: your eyes light up ----------
export const S13 = faceCU({ look: YOU, Bg: AlleySet, faces: [[0, 'neutral'], [30, 'smug']], yaw: -0.25, zoom: [3.0, 3.4], glint: 0.6, glintColor: '#FFD23A', light: { x: 900, y: 420, kind: 'warm', o: 0.5 } });

// ---------- S14: the same food, every time, ready in ONE MINUTE ----------
export const S14: React.FC<ShotProps> = ({ t }) => {
  const k = clamp(t / 90);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0C0A16" />
      {[-1, 0, 1].map((d) => (
        <g key={d} transform={`translate(${960 + d * 420} 560) scale(${backOut(clamp((t - 4 - (d + 1) * 6) / 8))})`}>
          <Burger x={0} y={60} s={1.4} />
        </g>
      ))}
      <g transform="translate(960 860)">
        <rect x={-220} y={-60} width={440} height={100} rx={50} fill="#1A1626" stroke="#FF8A3D" strokeWidth={4} />
        <text y={10} textAnchor="middle" fontFamily="Fragment Mono" fontSize={56} fill="#FF8A3D">{`0:${String(Math.floor(k * 60)).padStart(2, '0')}`}</text>
      </g>
    </g>
  );
};

// ---------- S15: you, on the street, looking toward the Circus Maximus, frowning ----------
export const S15 = street({
  shop: false,
  cast: [onStreet(YOU, 960, { yaw: 0.5, look_: 0.6, faces: [[0, 'neutral'], [40, 'worried']], pose: { headTilt: -6 } }), onStreet(ELLIE, 780, { yaw: 0.5, faces: [[0, 'neutral']] }, 0.7)],
  cam: { from: [960, 520, 1.15], to: [1000, 500, 1.3] },
});

// ---------- S16: something from history class... you can't remember what ----------
export const S16: React.FC<ShotProps> = (p) => {
  const Face = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'worried']], yaw: 0.3, eyes: 0.8, zoom: [3.4, 3.8], pose: { headTilt: 8 } });
  return (
    <g>
      <Face {...p} />
      <Chip t={p.t - 20} text="SUMMER, AD 64 ... ?" x={1180} y={180} />
    </g>
  );
};
