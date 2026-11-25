import React from 'react';
import { Hero, Mug } from '../../../engine';
import {
  YOU, MO, Soft, Body, Bedroom, Kitchen, KITCHEN, ShopStreet, standAt, GROUND, Schematic, SCH, SchLabel, PopWord, Big, faceCU, span,
  Brain, Sticky, FridgeFace, Glow, basePose, camT, clamp, kf, backOut, easeOut, easeInOut, idleBlink, FONT, UI, rnd, ShotProps, Pose, Word,
} from '../common';
import words from './words.json';

// Chapter 2, the broken alarm: the "sleep now" signal stopped; feeling tired and needing sleep are different; the
// alarm is adenosine (sand piling in an hourglass, sleep flips it, coffee blocks it); the alarm's broken, the clock
// still ticks; the rule: tell Mo (sticky note); Mo's deal, the fridge; "Remember the fridge."

const W = words as Word[];
const ST: React.FC<{ t: number; id?: string }> = ({ t, id }) => <ShopStreet t={t} id={id} />;
const BR: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} clock="07:30" crossed={0} />;

/** An hourglass; `fill` 0..1 is how much sand has piled at the bottom, `flip` 0..1 turns it over. */
const Hourglass: React.FC<{ x: number; y: number; s?: number; fill: number; flip?: number; t: number; stream?: boolean }> = ({ x, y, s = 1, fill, flip = 0, t, stream = true }) => {
  const top = 1 - fill;
  return (
    <g transform={`translate(${x} ${y}) rotate(${180 * easeInOut(flip)}) scale(${s})`}>
      <path d="M -150 -260 L 150 -260 L 20 0 L 150 260 L -150 260 L -20 0 Z" fill="none" stroke={SCH.line} strokeWidth={8} strokeLinejoin="round" />
      {/* sand in the top bulb */}
      {top > 0.02 ? <path d={`M ${-130 * top} ${-20 - 220 * top} L ${130 * top} ${-20 - 220 * top} L 12 -10 L -12 -10 Z`} fill="#E9C46A" /> : null}
      {/* sand piled at the bottom */}
      <path d={`M -140 250 L 140 250 L ${140 - 60 * fill} ${250 - 200 * fill} Q 0 ${230 - 260 * fill} ${-140 + 60 * fill} ${250 - 200 * fill} Z`} fill="#E9C46A" />
      {stream && top > 0.02 ? <rect x={-4} y={-6} width={8} height={250 - 200 * fill} fill="#E9C46A" opacity={0.85 + 0.15 * Math.sin(t)} /> : null}
      <rect x={-190} y={-290} width={380} height={30} rx={8} fill={SCH.line} />
      <rect x={-190} y={260} width={380} height={30} rx={8} fill={SCH.line} />
    </g>
  );
};

/** A bell alarm clock icon in schematic lines; `crack` breaks it. */
const AlarmIcon: React.FC<{ x: number; y: number; s?: number; t: number; ring?: number; crack?: number; color?: string }> = ({ x, y, s = 1, t, ring = 0, crack = 0, color = SCH.line }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(${ring * Math.sin(t * 2.4) * 8})`} fill="none" stroke={color} strokeWidth={8} strokeLinecap="round">
    <circle r={150} />
    <path d="M -110 -150 a 60 60 0 0 1 90 -30 M 110 -150 a 60 60 0 0 0 -90 -30" />
    <path d="M -100 140 L -130 190 M 100 140 L 130 190" />
    <path d="M 0 0 L 0 -90 M 0 0 L 60 30" />
    {crack > 0 ? <path d="M -20 -150 L 10 -80 L -30 -20 L 20 40 L -10 110 L 15 150" stroke="#FF5A4A" strokeWidth={10} opacity={crack} /> : null}
  </g>
);

// ---------------------------------------------------------------- S1: the brain stops sending "SLEEP NOW"
export const S1: React.FC<ShotProps> = ({ t }) => {
  const x = (k: number) => clamp((t - k) / 30);
  return (
    <g>
      <Schematic t={t} id="c2s1" />
      <Brain x={620} y={540} s={1.1} t={t} />
      {[0, 1].map((i) => {
        const k = ((t + i * 20) % 40) / 40;
        return (
          <g key={i} opacity={t > 30 ? 0.15 : Math.sin(k * Math.PI)}>
            <text x={900 + k * 500} y={520} fontFamily={FONT.ui} fontSize={48} fill="#C8D8F0">SLEEP NOW</text>
          </g>
        );
      })}
      <g opacity={x(30)}>
        <path d="M 1050 420 L 1450 620 M 1450 420 L 1050 620" stroke="#FF5A4A" strokeWidth={16} strokeLinecap="round" />
      </g>
      <SchLabel x={960} y={150} t={t - 2} text="THE SIGNAL: GONE" size={44} color={SCH.dim} />
    </g>
  );
};

// ---------------------------------------------------------------- S2: not tired, eyes don't burn, no yawn
export const S2 = faceCU({
  look: YOU, Bg: ST, faces: [[0, 'happy']], yaw: 0.3, zoom: [3.0, 3.3],
  extra: (t) => (
    <g>
      <PopWord t={t} at={3} x={720} y={300} text="NOT TIRED" size={56} fill="#F6EFE3" hold={300} />
      <PopWord t={t} at={22} x={1220} y={320} text="EYES FINE" size={50} fill="#F6EFE3" hold={300} rot={4} />
      <PopWord t={t} at={40} x={960} y={240} text="NO YAWN" size={60} fill="#FFD23A" hold={300} />
    </g>
  ),
});

// ---------------------------------------------------------------- S3: feeling tired ≠ needing sleep
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="c2s3" />
    <g opacity={clamp(t / 6)}>
      <text x={500} y={500} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={86} fill="#F6EFE3">FEELING</text>
      <text x={500} y={600} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={86} fill="#F6EFE3">TIRED</text>
    </g>
    <g transform={`translate(960 550) scale(${backOut(clamp((t - 20) / 9))})`}>
      <Big x={0} y={50} size={200} fill="#FF5A4A">≠</Big>
    </g>
    <g opacity={clamp((t - 12) / 6)}>
      <text x={1420} y={500} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={86} fill="#FFD23A">NEEDING</text>
      <text x={1420} y={600} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={86} fill="#FFD23A">SLEEP</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- S4: sleepiness is just the alarm
export const S4: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="c2s4" />
    <AlarmIcon x={960} y={540} t={t} ring={1} />
    <SchLabel x={960} y={880} t={t - 6} text="FEELING SLEEPY = THE ALARM" size={44} />
  </g>
);

// ---------------------------------------------------------------- S5: adenosine: molecules piling up in the brain
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(60, Math.floor(t / 1.6));
  return (
    <g>
      <Schematic t={t} id="c2s5" />
      <Brain x={960} y={560} s={1.25} t={t} />
      {Array.from({ length: n }).map((_, i) => (
        <g key={i} transform={`translate(${720 + rnd(51, i) * 480} ${430 + rnd(53, i) * 260})`}>
          <circle r={10} fill="#C87ED8" />
          <circle cx={14} cy={-6} r={7} fill="#C87ED8" />
        </g>
      ))}
      <SchLabel x={960} y={150} t={t - 2} text="ADENOSINE" size={56} color="#C87ED8" />
    </g>
  );
};

// ---------------------------------------------------------------- S6: every hour awake: sand piling in an hourglass
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len));
  return (
    <g>
      <Schematic t={t} id="c2s6" />
      <Hourglass x={960} y={540} s={1.2} fill={0.1 + 0.75 * k} t={t} />
      <SchLabel x={1500} y={540} t={t - 4} text={`HOURS AWAKE: ${Math.round(2 + 14 * k)}`} size={40} color="#E9C46A" />
    </g>
  );
};

// ---------------------------------------------------------------- S7: sleep tips the hourglass back over
export const S7: React.FC<ShotProps> = ({ t }) => {
  const fl = clamp((t - 10) / 20);
  return (
    <g>
      <Schematic t={t} id="c2s7" />
      <Hourglass x={960} y={540} s={1.2} fill={fl > 0.5 ? 0.15 : 0.85} flip={fl} t={t} stream={fl > 0.99} />
      <SchLabel x={960} y={150} t={t - 6} text="SLEEP = RESET" size={48} color={SCH.live} />
    </g>
  );
};

// ---------------------------------------------------------------- S8: coffee blocks it
export const S8: React.FC<ShotProps> = ({ t, f }) => (
  <g>
    <Schematic t={t} id="c2s8" />
    <g transform="translate(560 640) scale(2.6)">
      <Mug x={0} y={0} rot={0} f={f} />
    </g>
    {Array.from({ length: 8 }).map((_, i) => {
      const k = clamp((t - i * 3) / 20);
      return (
        <g key={i} transform={`translate(${1500 - k * 360} ${360 + i * 50})`}>
          <circle r={12} fill="#C87ED8" />
          <circle cx={16} cy={-7} r={8} fill="#C87ED8" />
        </g>
      );
    })}
    <rect x={1090} y={300} width={24} height={460} rx={12} fill="#E9A84A" opacity={clamp((t - 4) / 6)} />
    <SchLabel x={1100} y={860} t={t - 10} text="CAFFEINE BLOCKS THE ALARM" size={40} />
  </g>
);

// ---------------------------------------------------------------- S9: the alarm is broken, the clock still ticks
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="c2s9" />
    <AlarmIcon x={560} y={540} s={0.9} t={t} crack={clamp((t - 4) / 6)} color="#8A94A8" />
    <Hourglass x={1360} y={540} s={0.9} fill={0.3 + 0.3 * clamp(t / Math.max(1, len))} t={t} />
    <SchLabel x={560} y={860} t={t - 6} text="ALARM: BROKEN" size={40} color="#FF5A4A" />
    <SchLabel x={1360} y={860} t={t - 30} text="CLOCK: STILL TICKING" size={40} color="#E9C46A" />
  </g>
);

// ---------------------------------------------------------------- S10: one rule: you and Mo on the street
export const S10: React.FC<ShotProps> = ({ t, len, f }) => {
  const a = standAt(860, 1, GROUND, { yaw: 0.5, armR: { a: 50 + 10 * Math.sin(t / 6), b: -60 } });
  const b = standAt(1100, 1, GROUND, { yaw: -0.5 });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 990]]), 640, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <ShopStreet t={t + 200} />
      <Body look={YOU} pose={a} t={t} faces={[[0, 'neutral']]} shadow={1} seed={2} />
      <Body look={MO} pose={b} t={t} faces={[[0, 'neutral'], [40, 'happy']]} shadow={1} seed={5} />
      <PopWord t={t} at={10} x={980} y={360} text="RULE: TELL MO" size={70} fill="#FFD23A" hold={400} />
    </g>
  );
};

// ---------------------------------------------------------------- S11: the sticky note on the mirror
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.35}>
      <g transform={camT(940, 520, 1.6)}>
        <BR t={t + 100} />
      </g>
    </Soft>
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-960 -540)`}>
      <ellipse cx={960} cy={540} rx={420} ry={480} fill="#5A4A3E" stroke="#14121C" strokeWidth={8} />
      <ellipse cx={960} cy={540} rx={380} ry={440} fill="#9AB0C0" />
      <path d="M 700 300 L 820 180 M 740 380 L 900 220" stroke="#FFFFFF" strokeWidth={14} opacity={0.4} />
      <g transform={`translate(1120 420) scale(${backOut(clamp((t - 4) / 9))})`}>
        <Sticky x={0} y={0} text={'TELL\nMO!'} s={1.3} />
      </g>
    </g>
  </g>
);

// ---------------------------------------------------------------- S12: Mo: "Deal. But if you ever start talking to the fridge..."
export const S12 = faceCU({
  look: MO, Bg: ST, faces: [[0, 'neutral'], [40, 'smug']], yaw: -0.35, zoom: [3.0, 3.25], words: W, talk: span(W, 'Deal', 'mum'),
});

// ---------------------------------------------------------------- S13: remember the fridge: slow push in, it blinks once
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const c = KITCHEN.P(0.885, 0.5, 0.2);
  return (
    <g transform={camT(kf(t, [[0, 1100], [len, c.x]], easeInOut), kf(t, [[0, 560], [len, c.y]], easeInOut), kf(t, [[0, 1.6], [len, 2.6]], easeInOut))}>
      <Kitchen t={t + 400} veil={0.7} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.3} />
      {t > len - 24 ? <FridgeFace t={t} o={clamp((t - (len - 24)) / 6)} /> : null}
    </g>
  );
};
