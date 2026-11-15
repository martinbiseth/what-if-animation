import React from 'react';
import { Pose, ShotProps, Schematic, SCH, SchLabel, FONT } from '../../../engine';
import words from './words.json';
import {
  YOU, ELLIE, SUIT, KID, N1, N2, N3, Hero, basePose, camT, clamp, kf, lerp, easeOut, backOut, idleBlink, faceAt, Glow, POWER,
  BridgeSet, BRIDGE, bridgeHip, propCU, faceCU, talkShot, sdCard, thingCard, Soft, Bus, XRay, BigHand, span, HeldPhone,
} from '../common';

// Chapter 6, the choice: day fourteen, ice; the school bus skids through the railing and hangs over the river with
// your sister in the front seat. Lifting it is easy; your arms are the problem. The suit says wait forty minutes.
// The bus slips. You push the way you practised, slowly, like carrying an egg; your arm cracks; the bus rolls back.
// She hugs you, and this time you let her. Every phone on the bridge was filming.

const BR = BridgeSet();
const BRG = BridgeSet({ gap: true });
const HIPB = bridgeHip(1);
// the bus hanging: centre and tilt at a slip amount (0 = settled, 1 = almost over)
const busAt = (slip: number) => ({ x: 900 + slip * 40, y: BRIDGE.deck + 10 + slip * 30, rot: 9 + slip * 5 });
const HangingBus: React.FC<{ slip: number; t: number; kids?: number; s?: number }> = ({ slip, t, kids = 7, s = 0.6 }) => {
  const b = busAt(slip);
  return <Bus x={b.x} y={b.y} s={s} rot={b.rot} kids={kids} sis={6} t={t} />;
};

export const S1 = sdCard({ kicker: 'CHAPTER 6', title: 'THE BRIDGE', day: 14, tint: '#2A4A7A' });

// ---------- S2: ice; the bus crosses the old bridge and skids ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const x = lerp(-200, 760, clamp(t / (len * 0.9)));
  const skid = clamp((t - len * 0.75) / (len * 0.25));
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 800]]), 560, 1.0)}>
      <BR t={t + 100} id="s2" />
      <Bus x={x} y={BRIDGE.deck + 4} s={0.6} rot={skid * 6} kids={7} sis={6} t={t} />
    </g>
  );
};

// ---------- S3: smash: through the railing, front wheels over the river ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`${camT(900, 640, kf(t, [[0, 1.3], [len, 1.4]]))} translate(${t < 8 ? Math.sin(t * 3) * 10 : 0} 0)`}>
    <BRG t={t + 200} id="s3" />
    <HangingBus slip={easeOut(clamp(t / 10)) * 0.2} t={t} />
    {Array.from({ length: 6 }, (_, i) => {
      const d = clamp(t / 30);
      return <rect key={i} x={950 + i * 20 + d * 60 * (i - 2)} y={BRIDGE.deck - 90 + d * d * 400} width={10} height={60} fill="#2A2A34" transform={`rotate(${d * 120 * (i % 2 ? 1 : -1)} ${960 + i * 20} ${BRIDGE.deck - 60})`} />;
    })}
  </g>
);

// ---------- S4: thirty kids inside; your sister in the front seat ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1180]]), BRIDGE.deck - 140, kf(t, [[0, 2.2], [len, 2.8]]))}>
    <BRG t={t + 260} id="s4" />
    <HangingBus slip={0.2} t={t} />
  </g>
);

// ---------- S5: you get there before the fire engines ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const run = easeOut(clamp(t / (len * 0.8)));
  const me: Pose = { ...basePose, x: lerp(0, 520, run), y: HIPB, yaw: 0.6, expr: 'worried', legL: { a: Math.sin(t / 3) * 35 * (1 - run), b: 10 }, legR: { a: -Math.sin(t / 3) * 35 * (1 - run), b: 10 }, armL: { a: Math.sin(t / 3) * 30, b: -40 }, armR: { a: -Math.sin(t / 3) * 30, b: -40 }, blink: idleBlink(t, 2) };
  return (
    <g transform={camT(700, 600, 1.05)}>
      <BRG t={t + 320} id="s5" />
      <HangingBus slip={0.2} t={t} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S6: a bus is twelve tonnes; you could lift sixty ----------
export const S6 = thingCard({ day: 14, thing: 'bus', label: 'A BUS: ~12 TONNES. YOU COULD LIFT 60.' });

// ---------- S7: the problem: fourteen-year-old bones ----------
export const S7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="arm" />
    <XRay x={640} y={640} s={0.9} label="AGE 14" crack={clamp((t - 160) / 16)} />
    <SchLabel x={1340} y={360} t={t - 10} text="MUSCLES: 819 T" size={56} color={POWER} />
    <SchLabel x={1340} y={470} t={t - 40} text="BONES: AGE 14" size={56} />
    <SchLabel x={1340} y={640} t={t - 110} text="GRAB AND PULL =" size={44} color={SCH.dim} />
    <SchLabel x={1340} y={730} t={t - 150} text="SNAP" size={90} color="#FF3A2A" />
  </g>
);

// ---------- S8: the man in the suit is already there ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 400], [len, 460]]), 520, 1.6)}>
    <BRG t={t + 400} id="s8" />
    <Hero look={SUIT} pose={{ ...basePose, x: 380, y: HIPB, yaw: 0.4, expr: 'neutral', blink: idleBlink(t, 3), look: 0.6 }} />
    <Hero look={YOU} pose={{ ...basePose, x: 620, y: HIPB, yaw: -0.5, expr: 'shock', blink: idleBlink(t, 6) }} />
  </g>
);

// ---------- S9: "Don't. Wait for the crane. Forty minutes." ----------
const suitDont = span(words, "'Don't", "minutes.'");
export const S9 = faceCU({ look: SUIT, Bg: BRG, faces: [[0, 'neutral'], [60, 'smug']], yaw: 0.3, words, talk: suitDont, zoom: [3.1, 3.3] });

// ---------- S10: the bus creaks and slides another ten centimetres ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`${camT(1050, BRIDGE.deck - 40, kf(t, [[0, 2.0], [len, 2.15]]))} translate(${t > 20 && t < 30 ? Math.sin(t * 4) * 6 : 0} 0)`}>
    <BRG t={t + 460} id="s10" />
    <HangingBus slip={0.2 + easeOut(clamp((t - 20) / 14)) * 0.4} t={t} />
  </g>
);

// ---------- S11: your sister's face pressed against the window ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#F0B82A" />
    <rect x={360} y={140} width={1200} height={800} rx={40} fill="#A8C8E8" stroke="#0E0F14" strokeWidth={18} />
    <g transform={camT(960, 560, kf(t, [[0, 3.0], [len, 3.15]]))}>
      <Hero look={ELLIE} pose={{ ...basePose, x: 960, y: 760, yaw: 0, expr: 'worried', blink: idleBlink(t, 2), armL: { a: 150, b: -20 }, armR: { a: 150, b: -20 } }} shadow={0} />
    </g>
    <rect x={360} y={140} width={1200} height={800} rx={40} fill="#DDEEFA" opacity={0.25} />
    <path d="M 420 220 L 560 180 M 1380 860 L 1500 820" stroke="#FFFFFF" strokeWidth={14} opacity={0.6} strokeLinecap="round" />
  </g>
);

// ---------- S12: "Forty minutes," the man says again ----------
const suitAgain = span(words, "'Forty", "minutes,'");
export const S12 = talkShot({
  Set: BRG, setT: 520, words,
  cast: [
    { look: SUIT, x: 380, y: HIPB, yaw: 0.5, talk: [suitAgain], faces: [[0, 'neutral']] },
    { look: YOU, x: 620, y: HIPB, yaw: 0.5, faces: [[0, 'worried']], look_: 0.8 },
  ],
  cam: { from: [640, 540, 1.3], to: [700, 540, 1.4] },
  back: (t) => <HangingBus slip={0.6} t={t} />,
});

// ---------- S13: your arm, the bus, one try ----------
export const S13 = faceCU({ look: YOU, Bg: BRG, faces: [[0, 'worried'], [40, 'neutral'], [80, 'cool']], yaw: 0.35, zoom: [3.2, 3.6], pose: { armR: { a: 60, b: -100 } } });

// ---------- S14: the way you practised: no grabbing, no pulling ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const step = clamp(t / len);
  const me: Pose = { ...basePose, x: lerp(560, 640, step), y: HIPB, yaw: 0.6, expr: 'cool', legL: { a: Math.sin(t / 6) * 15, b: 5 }, legR: { a: -Math.sin(t / 6) * 15, b: 5 }, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 }, blink: idleBlink(t, 3) };
  return (
    <g transform={camT(760, 600, kf(t, [[0, 1.4], [len, 1.55]]))}>
      <BRG t={t + 600} id="s14" />
      <HangingBus slip={0.6} t={t} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S15: shoulder under the back of the bus; push with everything ----------
const PUSH_X = 560;
const pushPose = (t: number, k: number, o: Partial<Pose> = {}): Pose => ({
  ...basePose, x: PUSH_X + k * 60, y: HIPB + 20, yaw: 0.7, expr: 'worried', tilt: 28, headTilt: 10,
  armL: { a: 100, b: -40 }, armR: { a: 90, b: -30 }, legL: { a: -30, b: 20 }, legR: { a: 20, b: 10 }, blink: idleBlink(t, 4), ...o,
});
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / len)) * 0.15;
  return (
    <g transform={camT(760, 600, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <BRG t={t + 660} id="s15" />
      <HangingBus slip={0.6 - k} t={t} />
      <Hero look={YOU} pose={pushPose(t, k, { glint: 0.7, glintColor: POWER })} />
      <Glow x={PUSH_X + 120} y={HIPB - 80} r={200} kind="warm" o={0.35} />
    </g>
  );
};

// ---------- S16: slowly, like carrying an egg ----------
export const S16 = propCU({ Bg: BRG, push: 0.08, draw: (t) => (
  <g>
    <BigHand x={980} y={620} s={1.2} rot={-90} />
    <ellipse cx={960} cy={460} rx={90} ry={120} fill="#F6EFE3" stroke="#100E16" strokeWidth={8} />
    <Glow x={960} y={460} r={240} kind="warm" o={0.4} />
  </g>
) });

// ---------- S17: your arm cracks; you keep going ----------
export const S17 = faceCU({
  look: YOU, Bg: BRG, faces: [[0, 'cool'], [12, 'shock'], [40, 'worried']], yaw: 0.4, zoom: [3.4, 3.6], glint: 0.8,
  front: (t) => <rect width={1920} height={1080} fill="#FF2A2A" opacity={0.5 * clamp(1 - Math.abs(t - 12) / 6)} />,
});

// ---------- S18: inch by inch, the bus rolls back onto the road ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / len));
  const b = busAt(0);
  return (
    <g transform={camT(800, 600, 1.0)}>
      <BRG t={t + 720} id="s18" />
      <Bus x={lerp(b.x, 560, k)} y={lerp(b.y, BRIDGE.deck + 4, k)} s={0.6} rot={lerp(b.rot + 3, 0, k)} kids={7} sis={6} t={t} />
      <Hero look={YOU} pose={pushPose(t, 0, { x: lerp(PUSH_X - 100, 120, k), yaw: 0.7 })} />
    </g>
  );
};

// ---------- S19: the doors open; thirty kids run out ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(700, 580, 1.2)}>
    <BR t={t + 780} id="s19" />
    <Bus x={560} y={BRIDGE.deck + 4} s={0.6} kids={0} />
    {Array.from({ length: 8 }, (_, i) => {
      const k = clamp((t - i * 6) / 40);
      const sc = 0.62;
      return <Hero key={i} look={[KID, N1, N2, N3][i % 4]} pose={{ ...basePose, x: 840 + k * (220 + i * 30), y: bridgeHip(sc), scale: sc, yaw: 0.6, expr: 'happy', legL: { a: Math.sin((t + i * 5) / 3) * 30, b: 10 }, legR: { a: -Math.sin((t + i * 5) / 3) * 30, b: 10 }, blink: 0 }} />;
    })}
  </g>
);

// ---------- S20: she runs at you for a hug; this time you let her ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const run = easeOut(clamp(t / 50));
  const hug = clamp((t - 110) / 20);
  const sc = 0.72;
  const sis: Pose = { ...basePose, x: lerp(1300, 1030, run), y: bridgeHip(sc), scale: sc, yaw: -0.6, expr: 'happy', armL: { a: 100, b: -20 }, armR: { a: 100, b: -20 }, blink: idleBlink(t, 3) };
  const me: Pose = { ...basePose, x: 920, y: HIPB, yaw: 0.5, expr: t > 110 ? 'happy' : 'worried', armL: { a: lerp(15, 70, hug), b: lerp(-10, -70, hug) }, armR: { a: 20, b: -10 }, blink: t > 140 ? 1 : idleBlink(t, 5), headTilt: hug * 10 };
  return (
    <g transform={camT(980, 470, kf(t, [[0, 1.7], [len, 2.1]]))}>
      <BR t={t + 840} id="s20" />
      <Hero look={YOU} pose={me} />
      <Hero look={ELLIE} pose={sis} />
    </g>
  );
};

// ---------- S21: every phone on the bridge was filming ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 600], [len, 700]]), 520, 1.15)}>
    <BR t={t + 900} id="s21" />
    {[N1, N2, N3, KID, N1, N2, KID].map((l, i) => {
      const sc = l === KID ? 0.7 : 1;
      const p: Pose = { ...basePose, x: 220 + i * 170, y: bridgeHip(sc), scale: sc, yaw: 0.5, expr: 'shock', armR: { a: 120, b: -60 }, blink: idleBlink(t, i) };
      return <g key={i}><Hero look={l} pose={p} /><HeldPhone pose={p} t={t} mode="record" glow={1} /></g>;
    })}
  </g>
);
