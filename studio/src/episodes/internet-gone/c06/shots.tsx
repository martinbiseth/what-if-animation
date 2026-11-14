import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, backOut, easeOut, ShotProps, idleBlink, FONT, Inhaler, OldRadio, BroadcastMic, RADIO, radioHip, KITCHEN, stand, KitchenIsland, Smartphone, Glow } from '../../../engine';
import words from './words.json';
import { YOU, SUIT, MO, ELLIE, MUM, N1, GRAN, N3, StreetSet, KitchenSet, RadioSet, propCU, faceCU, talkShot, netCard, listCard, at, HeldPhone } from '../common';

// Chapter 6, the choice: the offer (food, fuel, medicine), Ellie's empty inhaler, a new one on the table; Mo: "nobody
// else gets the answers"; one night: the radio rule pays off, six hours reading pages on air, listeners writing in
// the dark; at sunrise the phone for the inhaler; Mo: "but now everyone else has it too".

const KIT = KitchenSet(0.45);
const NIGHT = StreetSet('night', { cars: false, lit: 0.3 });
const MORNING = StreetSet('morning', { cars: false });
const RADIO_OFF = RadioSet(0);
const RADIO_ON = RadioSet(1);

const K1 = stand(KITCHEN, 0.3, 0.45), K2 = stand(KITCHEN, 0.7, 0.45), K3 = stand(KITCHEN, 0.5, 0.25);

export const S1 = netCard({ kicker: 'CHAPTER 6', title: 'THE CHOICE', red: 0.7 });

// ---------- S2: the kitchen at night: the man at the table, you across, Mum behind ----------
export const S2 = talkShot({
  Set: KIT, setT: 4000, words,
  cast: [
    { look: SUIT, ...K1, yaw: 0.4, faces: [[0, 'smug']], talk: [[2.3, 5.3]] },
    { look: MUM, ...K3, yaw: 0.1, faces: [[0, 'worried']] },
    { look: YOU, ...K2, yaw: -0.4, faces: [[0, 'worried']] },
  ],
  cam: { from: [960, 560, 1.2], to: [960, 560, 1.28] },
  front: () => <KitchenIsland />,
});

export const S3 = listCard({ title: 'THE OFFER', items: [{ at: 3, text: 'FOOD', ok: true }, { at: 21, text: 'FUEL', ok: true }, { at: 39, text: 'MEDICINE', ok: true, hot: true }] });

// ---------- S4: Ellie on the sofa, coughing ----------
export const S4 = faceCU({
  look: ELLIE, Bg: KIT, faces: [[0, 'worried'], [8, 'tired'], [30, 'worried']], yaw: 0.2, zoom: [2.6, 2.8],
  pose: { headTilt: 0 },
  extra: (t) => (t > 6 && t < 40 ? <text x={1060} y={520} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#F6EFE3" opacity={0.8}>*cough*</text> : null),
});

// ---------- S5: insert, her inhaler: the counter on the side says 1 ----------
export const S5 = propCU({
  Bg: KIT,
  draw: (t) => (
    <g>
      <Inhaler x={960} y={620} s={2.2} rot={-8} />
      <g transform="translate(1260 380)">
        <rect x={-110} y={-70} width={220} height={140} rx={20} fill="#0B0816" opacity={0.8} />
        <text y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill={Math.floor(t / 8) % 2 ? '#FF3A2A' : '#F6EFE3'}>1 LEFT</text>
      </g>
    </g>
  ),
});

export const S6 = faceCU({ look: SUIT, Bg: KIT, faces: [[0, 'neutral'], [20, 'smug']], yaw: 0.3, zoom: [3.0, 3.2] });

// ---------- S7: insert, the table: a brand new inhaler slides into frame ----------
export const S7 = propCU({
  Bg: KIT,
  draw: (t) => {
    const x = kf(t, [[0, 1700], [24, 1000]], easeOut);
    return (
      <g>
        <rect x={-200} y={700} width={2400} height={600} fill="#8A6A4A" />
        <rect x={-200} y={700} width={2400} height={16} fill="#A8886A" />
        <Inhaler x={x} y={660} s={1.6} rot={0} color="#E8504A" />
        <ellipse cx={x + 230} cy={640} rx={80} ry={70} fill="#26232F" stroke="#100E16" strokeWidth={8} opacity={t < 34 ? 1 : 0} />
        <path d={`M ${x + 280} 660 Q 1900 700 2200 600`} stroke="#5A5F6B" strokeWidth={120} fill="none" opacity={t < 34 ? 1 : 0} />
      </g>
    );
  },
});

// ---------- S8: in the hall, Mo pulls you aside ----------
export const S8 = talkShot({
  Set: NIGHT, setT: 4100, words,
  cast: [
    { look: MO, x: 840, y: at(0).y, yaw: 0.45, faces: [[0, 'worried']], talk: [[23.0, 26.4]] },
    { look: YOU, x: 1100, y: at(0).y, yaw: -0.4, faces: [[0, 'worried']] },
  ],
  cam: { from: [970, 600, 1.9], to: [970, 600, 2.0] },
});

export const S9 = faceCU({ look: ELLIE, Bg: KIT, faces: [[0, 'worried']], yaw: -0.15, look_: 0.6, zoom: [2.9, 3.2], pose: { headTilt: -6 } });
export const S10 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'worried'], [30, 'neutral']], yaw: 0.1, zoom: [3.0, 3.4] });

// ---------- S11: night, the street: you and Mo awake under a lamp post ----------
export const S11 = talkShot({
  Set: NIGHT, setT: 4200,
  cast: [
    { look: MO, x: 860, y: at(0).y, yaw: 0.4, faces: [[0, 'tired']] },
    { look: YOU, x: 1060, y: at(0).y, yaw: -0.2, faces: [[0, 'neutral'], [60, 'shock']] },
  ],
  cam: { from: [960, 580, 1.6], to: [960, 580, 1.75] },
});
export const S12 = listCard({ title: 'REMEMBER?', items: [{ at: 2, text: 'RADIO STILL WORKS', ok: true, hot: true }] });

// ---------- S13: up the hill at night on bikes, the radio mast against the stars ----------
const Bike: React.FC<{ x: number; y: number; t: number; c: string }> = ({ x, y, t, c }) => (
  <g transform={`translate(${x} ${y})`}>
    {[-70, 70].map((wx) => (
      <g key={wx} transform={`rotate(${t * 12} ${wx} 0)`}>
        <circle cx={wx} cy={0} r={46} fill="none" stroke="#100E16" strokeWidth={8} />
        <path d={`M ${wx - 46} 0 H ${wx + 46} M ${wx} -46 V 46`} stroke="#5A5A64" strokeWidth={3} />
      </g>
    ))}
    <path d="M -70 0 L -10 -70 L 50 -70 L 70 0 M -10 -70 L 10 0 M 50 -70 L 60 -100" stroke={c} strokeWidth={10} fill="none" strokeLinejoin="round" />
  </g>
);
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const slope = (x: number) => 900 - (x - 200) * 0.22;
  const rider = (x: number, look: typeof YOU, c: string, seed: number) => {
    const y = slope(x);
    const p: Pose = { ...basePose, x: x - 10, y: y - 120, scale: 0.6, yaw: 0.6, tilt: 12, expr: 'neutral', legL: { a: 50 + Math.sin(t / 3) * 25, b: -60 }, legR: { a: 50 - Math.sin(t / 3) * 25, b: -60 }, armR: { a: 60, b: -10 }, blink: idleBlink(t, seed) };
    return (
      <g transform={`rotate(-12 ${x} ${y})`}>
        <Bike x={x} y={y - 30} t={t} c={c} />
        <Hero look={look} pose={p} shadow={0} />
      </g>
    );
  };
  const x0 = kf(t, [[0, 500], [len, 900]]);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0E26" />
      {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={(i * 331) % 1920} cy={(i * 197) % 600} r={2} fill="#FFFFFF" opacity={0.6} />)}
      <path d="M 1500 180 L 1560 620 M 1620 180 L 1560 620 M 1500 180 H 1620 M 1520 330 H 1600 M 1535 470 H 1585" stroke="#2A2E48" strokeWidth={10} />
      <circle cx={1560} cy={170} r={14} fill={Math.floor(t / 10) % 2 ? '#FF3A2A' : '#5A1A1A'} />
      <path d={`M -100 ${slope(-100)} L 2100 ${slope(2100)} V 1200 H -100 Z`} fill="#141428" />
      {rider(x0, MO, '#4E7A4A', 2)}
      {rider(x0 + 260, YOU, '#F07A2A', 5)}
    </g>
  );
};

// ---------- S14: the radio studio: dusty, dark; a switch, and the desk lights up ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const on = t > 51 ? 1 : 0;
  const R = on ? RADIO_ON : RADIO_OFF;
  return (
    <g transform={camT(860, 520, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <R t={t + 100} id="s14" />
      <Hero look={MO} pose={{ ...basePose, x: 500, y: radioHip(1), yaw: 0.4, expr: on ? 'happy' : 'worried', blink: idleBlink(t, 2) }} />
      <Hero look={YOU} pose={{ ...basePose, x: 780, y: radioHip(1), yaw: 0.2, expr: on ? 'shock' : 'neutral', armR: { a: 70, b: -30 }, blink: idleBlink(t, 6) }} />
      <rect width={1920} height={1080} fill="#000" opacity={on ? 0 : 0.45} />
    </g>
  );
};

// ---------- S15: on air: you at the microphone reading from the phone ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 820, y: radioHip(1), yaw: 0.3, expr: 'neutral', armR: { a: 75, b: -60 }, blink: idleBlink(t, 3), talk: Math.abs(Math.sin(t / 2.6)) * 0.7, look: 0.5 };
  return (
    <g transform={camT(860, 470, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <RADIO_ON t={t + 300} id="s15" />
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={me} t={t} mode="wiki" glow={1.3} />
      <BroadcastMic x={1010} y={RADIO.desk - 20} s={0.8} />
      <Hero look={MO} pose={{ ...basePose, x: 380, y: radioHip(1), yaw: 0.4, expr: 'tired', blink: idleBlink(t, 9) }} />
    </g>
  );
};

export const S16 = listCard({ title: 'ON AIR', items: [{ at: 3, text: 'CLEAN WATER', ok: true }, { at: 33, text: 'FIRST AID', ok: true }, { at: 63, text: 'GROWING FOOD', ok: true }] });

// ---------- S17: three dark rooms across the region: a radio glowing, someone writing every word ----------
export const S17: React.FC<ShotProps> = ({ t }) => {
  const panels: [typeof N1, number][] = [[N1, 0], [GRAN, 1], [N3, 2]];
  return (
    <g>
      <rect width={1920} height={1080} fill="#07060E" />
      {panels.map(([look, i]) => {
        const x0 = 40 + i * 627;
        return (
          <g key={i} opacity={clamp((t - i * 10) / 8)}>
            <clipPath id={`pan${i}`}><rect x={x0} y={140} width={600} height={800} rx={16} /></clipPath>
            <g clipPath={`url(#pan${i})`}>
              <rect x={x0} y={140} width={600} height={800} fill="#14122A" />
              <rect x={x0} y={700} width={600} height={240} fill="#3A2A22" />
              <OldRadio x={x0 + 150} y={700} s={0.5} on={1} t={t + i * 9} />
              <Hero look={look} pose={{ ...basePose, x: x0 + 400, y: 560, yaw: -0.3, expr: 'neutral', armR: { a: 60, b: -70 + Math.sin(t / 2 + i) * 10 }, blink: idleBlink(t, i + 1), look: -0.4 }} />
              <rect x={x0 + 300} y={680} width={170} height={110} fill="#F8F4E6" transform={`rotate(-6 ${x0 + 380} 730)`} />
              <Glow x={x0 + 160} y={580} r={300} o={0.5} />
            </g>
            <rect x={x0} y={140} width={600} height={800} rx={16} fill="none" stroke="#2A2840" strokeWidth={6} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- S18: sunrise: you walking home alone down the empty street ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = at(kf(t, [[0, 500], [len, 900]]), { yaw: 0.6, expr: 'tired', legL: { a: Math.sin(t / 5) * 20, b: 0 }, legR: { a: -Math.sin(t / 5) * 20, b: 0 }, blink: idleBlink(t, 3) });
  return (
    <g transform={camT(800, 560, 1.3)}>
      <MORNING t={t + 4500} id="s18" />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S19: the kitchen: you hand him the phone ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const reach = clamp(t / 30);
  const me: Pose = { ...basePose, ...K2, yaw: -0.4, expr: 'worried', armR: { a: 40 + reach * 50, b: -20 }, blink: idleBlink(t, 3) };
  const him: Pose = { ...basePose, ...K1, yaw: 0.4, expr: t > 40 ? 'smug' : 'neutral', armR: { a: 40 + reach * 50, b: -20 }, blink: idleBlink(t, 7) };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <KIT t={t + 4600} id="s19" />
      <Hero look={SUIT} pose={him} />
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={t < 40 ? me : him} side="R" t={t} mode="wikihome" glow={1} />
      <KitchenIsland />
    </g>
  );
};

// ---------- S20: Ellie takes a breath: a full one ----------
export const S20 = faceCU({
  look: ELLIE, Bg: MORNING, faces: [[0, 'worried'], [30, 'neutral'], [50, 'happy']], yaw: 0.15, zoom: [2.8, 2.6],
  extra: (t) => <Inhaler x={1010} y={kf(t, [[0, 700], [20, 640], [45, 640], [60, 760]])} s={0.35} rot={-20} color="#E8504A" />,
});

// ---------- S21: morning, on the pavement: Mo, quiet; you ----------
export const S21 = talkShot({
  Set: MORNING, setT: 4700, words,
  cast: [
    { look: MO, x: 840, y: at(0).y, yaw: 0.45, faces: [[0, 'worried']], talk: [[67.0, 68.8]] },
    { look: YOU, x: 1100, y: at(0).y, yaw: -0.4, faces: [[0, 'tired'], [130, 'smug']], talk: [[69.9, 71.4]] },
  ],
  cam: { from: [970, 600, 1.75], to: [970, 600, 1.9] },
});
