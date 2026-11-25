import React from 'react';
import { Hero, factCard } from '../../../engine';
import {
  YOU, YOU_PJ, MO, MOM, SUIT, TECH, Soft, Body, Bedroom, BEDROOM, Kitchen, KITCHEN, stand, Schematic, SCH, SchLabel, ShopStreet, standAt, GROUND,
  PopWord, Big, faceCU, bigWord, hourCard, Clinic, CLINIC, clinicTable, EEGLines, Wires, FridgeFace, CoatFigure, Wobble, OldPhoto, Bubble,
  Smartphone, handAt, headAt, Glow, basePose, camT, clamp, kf, backOut, easeOut, easeInOut, idleBlink, FONT, UI, rnd, phrase, ShotProps, Pose, Word, schShot,
} from '../common';
import words from './words.json';

// Chapter 5, someone notices: day 3, the fridge (mostly not talking); real: after ~3 days, hallucinations (edges,
// shadows, then whole things); that night the wallpaper ripples, the coat watches, every light on, the kitchen floor
// till morning; you tell Mo: "That's the fridge. I'm calling your mum."; day 5 the sleep clinic, wires, a busy line,
// "Everybody sleeps."; calls up the chain; day 7 the man in the grey suit, the folder, the photo; Randy Gardner,
// 11 days 25 minutes, Guinness stopped; "You'll pass him in four days. And we'd like to watch."

const W = words as Word[];
const rel = (a: string, b: string) => Math.max(0, Math.round((phrase(W, b)[0] - phrase(W, a)[0]) * 30));
const BRN: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} clock="02:47" crossed={0} lamp={0.4} veil={0.6} />;
const ST: React.FC<{ t: number; id?: string }> = ({ t, id }) => <ShopStreet t={t} id={id} />;
const CLN: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Clinic t={t} id={id} />;
const INT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Clinic t={t} id={id} table bed={false} day={1} />;

// ---------------------------------------------------------------- S1: day three: the fridge isn't really talking (it winks)
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const me = stand(KITCHEN, 0.55, 0.45);
  const wink = t > len - 20 && t < len - 10 ? 1 : 0;
  return (
    <g transform={camT(1150, 600, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Kitchen t={t + 900} />
      <FridgeFace t={t} o={0.85} look={-1} />
      {wink ? <rect x={KITCHEN.P(0.82, 0.27, 0.2).x} y={KITCHEN.P(0.82, 0.27, 0.2).y} width={50} height={40} fill="#8E9497" /> : null}
      <Body look={YOU} pose={{ ...basePose, ...me, yaw: 0.5, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } }} t={t} faces={[[0, 'tired'], [30, 'worried']]} seed={2} shadow={0} />
      <PopWord t={t} at={rel('Day three', 'Mostly')} x={760} y={330} text="MOSTLY." size={70} fill="#F6EFE3" hold={300} />
    </g>
  );
};

// ---------------------------------------------------------------- S2: real: after ~3 days, people see things
export const S2 = schShot({
  title: 'AFTER ABOUT 3 DAYS WITHOUT SLEEP',
  real: 60,
  draw: (t) => (
    <g>
      <g transform={`translate(960 520) scale(${backOut(clamp((t - 6) / 9))})`}>
        <Big x={0} y={40} size={170} fill="#C87ED8">HALLUCINATIONS</Big>
      </g>
      <SchLabel x={960} y={760} t={t - 24} text="PATTERNS · SHADOWS · VOICES · PEOPLE" size={40} />
    </g>
  ),
});

// ---------------------------------------------------------------- S3: patterns crawling on the wall, shadows in the corner of your eye
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(900, 480, kf(t, [[0, 1.8], [len, 2.0]]))}>
    <Wobble id="c5s3" t={t} amp={0.5 + 0.3 * Math.sin(t / 10)}>
      <BRN t={t + 100} />
      {Array.from({ length: 30 }).map((_, i) => (
        <path key={i} d={`M ${500 + rnd(3, i) * 900} ${330 + rnd(5, i) * 300} q 20 ${-20 + Math.sin(t / 6 + i) * 20} 40 0 q 20 ${20 - Math.sin(t / 6 + i) * 20} 40 0`} stroke="#C87ED8" strokeWidth={4} fill="none" opacity={0.5} />
      ))}
    </Wobble>
    <g opacity={0.6 + 0.3 * Math.sin(t / 7)}>
      <ellipse cx={kf(t, [[0, 1400], [len, 1300]])} cy={520} rx={60} ry={160} fill="#05050F" />
    </g>
  </g>
);

// ---------------------------------------------------------------- S4: then whole things: voices, people
export const S4: React.FC<ShotProps> = ({ t, len, f }) => (
  <g>
    {faceCU({ look: YOU_PJ, Bg: BRN, faces: [[0, 'worried'], [20, 'shock']], yaw: 0.4, eyes: 0.9, zoom: [3.0, 3.3], dark: 0.2 })({ t, len, f })}
    <g opacity={clamp((t - 10) / 10) * 0.8}>
      {[0, 1, 2].map((i) => (
        <text key={i} x={1300 + i * 60} y={300 + i * 110 + Math.sin(t / 5 + i) * 10} fontFamily={FONT.hand} fontSize={54} fill="#C8D8F0" opacity={0.5 + 0.5 * Math.sin(t / 6 + i)}>psst...</text>
      ))}
    </g>
  </g>
);

// ---------------------------------------------------------------- S5: that night the wallpaper ripples like water
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.2], [len, 1.35]]))}>
    <Wobble id="c5s5" t={t} amp={1.2}>
      <BRN t={t + 200} />
    </Wobble>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#1A0A2A" opacity={0.25} />
  </g>
);

// ---------------------------------------------------------------- S6: the coat on your door looks like someone watching
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const b = { x: 1250, y: 560 };
  return (
    <g>
      <g transform={camT(kf(t, [[0, 700], [len, 640]]), 560, kf(t, [[0, 1.9], [len, 2.4]]))}>
        <BRN t={t + 300} />
        <g transform={`translate(${470} 480)`}>
          <CoatFigure x={0} y={0} s={0.95} who={clamp((t - 10) / 30)} t={t} />
        </g>
      </g>
      <rect width={1920} height={1080} fill="#05050F" opacity={clamp((t - 30) / 30) * 0.3} />
    </g>
  );
};

// ---------------------------------------------------------------- S7: every light on, you sit on the kitchen floor till morning
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const p = KITCHEN.P(0.5, 1, 0.75);
  const me: Pose = { ...basePose, x: p.x, y: p.y - 120, scale: 1.05, yaw: 0, legL: { a: 110, b: -150 }, legR: { a: 110, b: -150 }, armL: { a: 40, b: -100 }, armR: { a: 40, b: -100 }, expr: 'worried', blink: idleBlink(t, 3), look: Math.sin(t / 12) };
  return (
    <g transform={camT(960, 640, kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Kitchen t={t + 1000} veil={0.15} />
      <Glow x={960} y={300} r={900} kind="warm" o={0.6} />
      <Hero look={YOU_PJ} pose={me} shadow={1} />
      <g transform="translate(1700 120)">
        <rect x={-130} y={-44} width={260} height={88} rx={44} fill={UI.pill} opacity={0.9} />
        <text x={0} y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3">{t < len * 0.6 ? '03:12' : '06:58'}</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S8: you keep your promise: you tell Mo
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(980, 640, kf(t, [[0, 1.6], [len, 1.75]]))}>
    <ShopStreet t={t + 600} />
    <Body look={YOU} pose={standAt(860, 1, GROUND, { yaw: 0.5, armR: { a: 60 + 20 * Math.sin(t / 4), b: -70 }, armL: { a: 40, b: -60 } })} t={t} faces={[[0, 'tired']]} seed={2} shadow={1} />
    <Body look={MO} pose={standAt(1100, 1, GROUND, { yaw: -0.5 })} t={t} faces={[[0, 'neutral'], [30, 'worried']]} seed={5} shadow={1} />
  </g>
);

// ---------------------------------------------------------------- S9: Mo: "Okay. That's the fridge. I'm calling your mum."
export const S9 = faceCU({
  look: MO, Bg: ST, faces: [[0, 'worried']], yaw: -0.35, zoom: [3.0, 3.2], words: W, talk: phrase(W, "Okay That's the fridge I'm calling your mum"),
  extra: (t) => <Smartphone x={1130} y={700} s={0.5} rot={-8} mode="home" t={t} />,
});

export const S10 = hourCard({ big: 'DAY 5', kicker: 'THE DOCTOR. THEN THE SLEEP CLINIC.', Bg: CLN });

// ---------------------------------------------------------------- S11: the sleep clinic glues a tangle of wires to your head
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const P = CLINIC.P;
  const sit = P(0.2, 0.82, 0.25);
  const me: Pose = { ...basePose, x: sit.x, y: sit.y - 70, scale: 0.95, yaw: 0.35, legL: { a: 85, b: 0 }, legR: { a: 82, b: 0 }, armL: { a: 20, b: -20 }, armR: { a: 20, b: -20 }, expr: 'neutral', blink: idleBlink(t, 3) };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), 560, kf(t, [[0, 1.35], [len, 1.45]]))}>
      <CLN t={t + 100} />
      <Hero look={YOU_PJ} pose={me} shadow={0} />
      <Wires pose={me} to={[1180, 620]} o={clamp(t / 12)} />
      <Body look={TECH} pose={standAt(1350, 1, 990, { yaw: -0.5, armL: { a: 50, b: -70 } })} t={t} faces={[[0, 'neutral']]} seed={6} shadow={1} />
    </g>
  );
};

// ---------------------------------------------------------------- S12: the machine draws a busy, wide-awake line, hour after hour
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#0E141C" />
    <rect x={160} y={140} width={1600} height={800} rx={30} fill="#1A222C" stroke="#3E4A56" strokeWidth={8} />
    <EEGLines x={200} y={220} w={1520} h={620} t={t} awake={1} />
    <text x={220} y={200} fontFamily={FONT.ui} fontSize={36} fill="#5AE08A">EEG · STAGE: AWAKE</text>
    <text x={1700} y={200} textAnchor="end" fontFamily={FONT.ui} fontSize={36} fill="#F6EFE3">{`0${Math.min(7, 1 + Math.floor(t / 20))}:00`}</text>
    <text x={220} y={900} fontFamily={FONT.ui} fontSize={32} fill="#FF7A6A">SLEEP: 0 MIN</text>
  </g>
);

// ---------------------------------------------------------------- S13: the technician: "That's not possible. Everybody sleeps."
export const S13 = faceCU({
  look: TECH, Bg: CLN, faces: [[0, 'shock'], [30, 'worried']], yaw: 0.35, zoom: [3.0, 3.25], words: W, talk: phrase(W, "That's not possible"),
  extra: (t) => <Bubble x={1300} y={300} text={'Everybody\nsleeps.'} t={t} at={rel("That's not possible", 'Everybody sleeps')} size={40} />,
});

// ---------------------------------------------------------------- S14: she calls her boss; her boss calls someone else
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#14102A" />
    {[0, 1, 2].map((i) => {
      const k = backOut(clamp((t - i * 18) / 9));
      return (
        <g key={i} transform={`translate(${420 + i * 540} 540) scale(${k})`}>
          <Smartphone x={0} y={0} s={0.8} rot={-4 + i * 4} mode="home" t={t} buzz={i === Math.min(2, Math.floor(t / 18)) ? 1 : 0} />
          <text x={0} y={330} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3">{['TECHNICIAN', 'HER BOSS', '???'][i]}</text>
        </g>
      );
    })}
    {[0, 1].map((i) => <text key={i} x={690 + i * 540} y={560} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFD23A" opacity={clamp((t - 12 - i * 18) / 6)}>→</text>)}
  </g>
);

// ---------------------------------------------------------------- S15: day seven: a man in a grey suit is waiting, with a folder
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const P = CLINIC.P;
  const tb = clinicTable(0.5, 0.5);
  const suit = { ...basePose, x: P(0.58, 0.9, 0.42).x, y: tb.y - 20, scale: 1.0, yaw: -0.3, legL: { a: 80, b: -80 }, legR: { a: 76, b: -84 }, armL: { a: 40, b: -80 }, armR: { a: 40, b: -80 } } as Pose;
  return (
    <g>
      <g transform={camT(960, 600, kf(t, [[0, 1.3], [len, 1.5]]))}>
        <INT t={t + 100} />
        <Body look={SUIT} pose={suit} t={t} faces={[[0, 'neutral']]} seed={9} shadow={0} />
        <polygon points={CLINIC.Q([[0.35, 0.72, 0.62], [0.65, 0.72, 0.62], [0.65, 0.8, 0.62], [0.35, 0.8, 0.62]])} fill="#D9D2C4" stroke="#8E979E" strokeWidth={3} />
        <g transform={`translate(${tb.x + 30} ${tb.y - 6})`}>
          <path d="M -90 -10 L 90 -10 L 100 10 L -100 10 Z" fill="#C8A06A" stroke="#14121C" strokeWidth={4} />
          <text x={0} y={6} textAnchor="middle" fontFamily={FONT.hand} fontSize={22} fill="#14121C">YOU</text>
        </g>
      </g>
      <PopWord t={t} at={4} x={960} y={220} text="DAY 7" size={90} fill="#FF7A6A" hold={300} />
    </g>
  );
};

// ---------------------------------------------------------------- S16: he slides a black-and-white photo across the table
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 6) / 20));
  return (
    <g>
      <rect width={1920} height={1080} fill="#E9E4DA" />
      {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={0} y={i * 140} width={1920} height={2} fill="#C9C2B4" />)}
      <g transform={`translate(${kf(t, [[0, 1500], [26, 960]], easeOut)} 540)`}>
        <OldPhoto x={0} y={0} s={2} rot={-6 + 4 * k} />
      </g>
      {/* the hand that slides it, a grey sleeve */}
      <g transform={`translate(${kf(t, [[0, 1900], [26, 1360], [40, 1360], [60, 2200]], easeInOut)} 640)`}>
        <rect x={0} y={-60} width={700} height={120} fill="#5A5F6B" stroke="#14121C" strokeWidth={6} />
        <ellipse cx={0} cy={0} rx={70} ry={56} fill="#26232F" stroke="#14121C" strokeWidth={6} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S17: "Do you know who Randy Gardner was?"
export const S17 = faceCU({
  look: SUIT, Bg: INT, faces: [[0, 'smug']], yaw: -0.35, zoom: [3.0, 3.2], words: W, talk: phrase(W, 'Do you know who Randy Gardner was'),
  light: { x: 800, y: 400, kind: 'cool', o: 0.4 },
});

// ---------------------------------------------------------------- S18: 1963, Randy, 17, a school science fair
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2622" />
    <g transform={`translate(760 540) scale(${kf(t, [[0, 1.7], [len, 1.9]])})`}>
      <OldPhoto x={0} y={0} s={1} rot={-3} />
    </g>
    <g opacity={clamp((t - 10) / 8)}>
      <text x={1500} y={420} textAnchor="middle" fontFamily={FONT.ui} fontSize={54} fill="#E9C46A">WINTER 1963</text>
      <text x={1500} y={520} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F6EFE3">RANDY, 17</text>
      <text x={1500} y={600} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#C8C0B0">SCHOOL SCIENCE FAIR</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- S19: 11 days 25 minutes: the longest recorded
export const S19 = factCard({ value: 264, suffix: ' HOURS', label: '11 DAYS, 25 MINUTES AWAKE', sub: 'the longest scientifically recorded, 1964' });

// ---------------------------------------------------------------- S20: Guinness stopped accepting attempts
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const st = backOut(clamp((t - 12) / 8));
  return (
    <g>
      <rect width={1920} height={1080} fill="#14102A" />
      <g transform="translate(960 480)">
        <rect x={-360} y={-200} width={720} height={400} rx={20} fill="#F6EFE3" stroke="#14121C" strokeWidth={6} />
        <text x={0} y={-110} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#5A5A6A">WORLD RECORDS</text>
        <text x={0} y={-20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#14121C">LONGEST TIME</text>
        <text x={0} y={50} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#14121C">WITHOUT SLEEP</text>
        <g transform={`rotate(-14) scale(${st})`} opacity={st > 0 ? 1 : 0}>
          <rect x={-330} y={90} width={660} height={110} rx={14} fill="none" stroke="#FF3A2E" strokeWidth={12} />
          <text x={0} y={170} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={62} fill="#FF3A2E">TOO DANGEROUS</text>
        </g>
      </g>
      <text x={960} y={900} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill="#C8C0D8" opacity={clamp((t - 20) / 8)}>NO MORE ATTEMPTS ACCEPTED</text>
    </g>
  );
};

// ---------------------------------------------------------------- S21: "You'll pass him in four days. And we'd like to watch."
export const S21 = faceCU({
  look: SUIT, Bg: INT, faces: [[0, 'neutral'], [40, 'smug']], yaw: -0.2, eyes: 0, zoom: [3.2, 3.9], words: W,
  talk: [phrase(W, "You'll pass him in four days")[0], phrase(W, "we'd like to watch")[1]], dark: 0.2,
  light: { x: 800, y: 400, kind: 'red', o: 0.35 },
});
