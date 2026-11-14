import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, chapterCard, factCard, Street26, street26Hip, ShotProps, talkShot, idleBlink,
  Kitchen, Rooftop, Envelope, OldCar, STREET, FONT, Schematic, SchLabel, SCH, Word,
} from '../../../engine';
import { L, YOU, StreetSet, phoneCU, faceCU, bigWord, span } from '../common';
import words from './words.json';

// Chapter 5, someone notices: the knocks at the door, the man in the grey suit in the kitchen, the envelope, "we'd
// just like to borrow it", the transistor, what changes if it's early, the look at Ellie, a sleepless night.
// Battery 41 to 27.

const W = words as Word[];
const NIGHT = StreetSet({ night: true, cars: false });
const HIP = street26Hip(1);
const Home: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} period veil={0.6} />;
/** The frame (in the episode's clock) where word `w` (its nth occurrence) starts. */
const at = (w: string, nth = 1) => span(W, w, w, nth)[0] * 30;

/** The kitchen table, drawn in front of whoever sits at it. */
const Table: React.FC = () => (
  <g>
    <rect x={640} y={700} width={640} height={30} fill="#7A5A40" stroke="#1A1218" strokeWidth={5} />
    <rect x={670} y={730} width={20} height={200} fill="#5A3E2C" />
    <rect x={1230} y={730} width={20} height={200} fill="#5A3E2C" />
  </g>
);

export const S1 = chapterCard({ kicker: 'CHAPTER 5', title: 'SOMEONE NOTICES', red: 0.5 });

/** Your door at night: a reporter with a notebook, talking fast. */
export const S2 = talkShot({
  Set: NIGHT, setT: 3100, words,
  cast: [
    { look: L.gent, x: 860, y: HIP, yaw: 0.5, faces: [[0, 'happy']], talk: [span(words, 'A', 'door')], seed: 1, pose: { armR: { a: 70, b: -80 } } },
    { look: YOU, x: 1120, y: HIP, yaw: -0.5, faces: [[0, 'worried']], seed: 2 },
  ],
  cam: { from: [990, 500, 1.85], to: [990, 500, 2.0] },
});

/** A professor, peering, wanting to examine the "lamp". */
export const S3 = faceCU({ look: L.doctor, Bg: NIGHT, faces: [[0, 'smug']], yaw: 0.35, talk: span(words, 'A', 'lamp', 2), words, zoom: [2.8, 3.0] });

/** The radio man, all teeth, offering a job. */
export const S4 = faceCU({ look: L.worker, Bg: NIGHT, faces: [[0, 'happy']], yaw: -0.35, talk: span(words, 'A', 'understand', 3), words, zoom: [2.8, 3.0] });

/** You shut the door on them all and lean back against it. */
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 960, y: 640, yaw: 0, look: 0, headTilt: -8, expr: 'tired', armL: { a: 30, b: -40 }, armR: { a: 30, b: -40 }, blink: idleBlink(t, 3) };
  return (
    <g transform={camT(960, 480, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <Home t={t + 100} id="c5s5" />
      <rect x={820} y={180} width={280} height={600} fill="#4A3424" stroke="#1A1218" strokeWidth={8} />
      <circle cx={1060} cy={500} r={12} fill="#C9A050" />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

/** The kitchen: the man in the grey suit at the table, hat on, Mo's mom nervous at the stove. */
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const suit: Pose = { ...basePose, x: 960, y: 600, yaw: 0.1, look: 0.2, expr: 'smug', armL: { a: 40, b: -90 }, armR: { a: 40, b: -90 }, blink: idleBlink(t, 4) };
  const mom: Pose = { ...basePose, x: 1340, y: 620, yaw: -0.5, look: -0.8, expr: 'worried', armL: { a: 40, b: -100 }, armR: { a: 40, b: -100 }, blink: idleBlink(t, 5) };
  return (
    <g transform={camT(1000, 470, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <Home t={t + 300} id="c5s6" />
      <Hero look={L.mom26} pose={mom} />
      <Hero look={L.suit26} pose={suit} />
      <Table />
    </g>
  );
};

/** Close on him: "the telephone company". He doesn't. */
export const S7 = faceCU({ look: L.suit26, Bg: Home, faces: [[0, 'smug']], yaw: 0.3, talk: span(words, 'He', 'company', 2), words, zoom: [3.0, 3.3] });

/** You across the table, not believing a word. */
export const S8 = faceCU({ look: YOU, Bg: Home, faces: [[0, 'worried']], yaw: -0.3, zoom: [3.0, 3.2] });

/** Insert: the envelope sliding across the table, banknotes showing. */
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A1C16" />
    <rect x={-100} y={420} width={2120} height={800} fill="#7A5A40" />
    {Array.from({ length: 7 }).map((_, i) => (
      <path key={i} d={`M -100 ${480 + i * 90} H 2020`} stroke="#6A4A34" strokeWidth={4} />
    ))}
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.1]])}) translate(-960 -540)`}>
      <Envelope x={kf(t, [[0, 400], [24, 960]], easeOut)} y={700} s={2.2} rot={kf(t, [[0, -14], [24, -4]], easeOut)} />
    </g>
  </g>
);

export const S10 = bigWord({ kicker: 'IN 1926, A FORTUNE', word: '$10,000', color: '#9CE07A', Bg: Home });

/** "We'd just like to borrow it. Take a look inside." */
export const S11 = talkShot({
  Set: Home, setT: 600, words,
  cast: [
    { look: L.suit26, x: 860, y: 600, yaw: 0.5, faces: [[0, 'smug']], talk: [span(words, "We'd", 'inside')], seed: 6, pose: { armR: { a: 60, b: -40 } } },
    { look: YOU, x: 1120, y: 600, yaw: -0.5, faces: [[0, 'worried']], seed: 7 },
  ],
  cam: { from: [990, 440, 1.9], to: [990, 440, 2.05] },
  front: () => <Table />,
});

/** What "a look inside" means: the phone drawn as a schematic, coming apart into its layers. */
export const S12: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(clamp((t - 6) / 30));
  const layers = ['SCREEN', 'BATTERY', 'CHIP', 'CASE'];
  return (
    <g>
      <Schematic t={t} id="c5x" />
      {layers.map((name, i) => {
        const y = 540 + (i - 1.5) * 170 * k;
        const x = 960 + (i - 1.5) * 120 * k;
        return (
          <g key={name} transform={`translate(${x} ${y}) skewX(-20) scale(1 0.5)`}>
            <rect x={-150} y={-300} width={300} height={600} rx={46} fill={SCH.ground} stroke={i === 2 ? SCH.live : SCH.line} strokeWidth={6} opacity={0.95} />
            {i === 2 ? <rect x={-50} y={-50} width={100} height={100} fill="none" stroke={SCH.glow} strokeWidth={6} /> : null}
          </g>
        );
      })}
      {layers.map((name, i) => (
        <SchLabel key={`l${name}`} x={1500} y={540 + (i - 1.5) * 170} t={t - 30 - i * 3} text={name} size={34} color={i === 2 ? SCH.live : SCH.dim} anchor="start" />
      ))}
    </g>
  );
};

export const S13 = factCard({ value: 1947, label: 'THE FIRST TRANSISTOR', sub: 'BELL LABS, DECEMBER 1947', format: (v) => String(Math.round(v)) });

export const S14 = factCard({ value: 19, suffix: ' BILLION', label: 'TRANSISTORS IN THE CHIP ALONE', sub: 'A17 PRO' });

export const S15 = bigWord({ kicker: 'TWO OF ITS THREE INVENTORS, IN 1926', word: 'AGE 16 & 18', color: '#FFE27A' });

/** Everything early: RADIO, COMPUTERS, ROCKETS, WAR, each popping on with its word. */
export const S16: React.FC<ShotProps> = ({ t, f }) => {
  const items: [string, number][] = [['RADIO', at('Radio')], ['COMPUTERS', at('Computers')], ['ROCKETS', at('Rockets')], ['WAR', at('War')]];
  return (
    <g>
      <Schematic t={t} id="c5w" />
      {items.map(([name, a], i) => {
        const s = backOut(clamp((f - a) / 8));
        return (
          <g key={name} transform={`translate(${360 + i * 400} 540) scale(${s})`}>
            <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={i === 3 ? 130 : 88} fill={i === 3 ? '#FF4A4A' : SCH.line} stroke="#0B0816" strokeWidth={10} paintOrder="stroke">
              {name}
            </text>
          </g>
        );
      })}
      <SchLabel x={960} y={800} t={f - at('All')} text="ALL OF IT, TWENTY YEARS EARLY" size={40} color={SCH.dim} />
    </g>
  );
};

/** Maybe much, much worse: the city at dusk, the sky turning red, you small at the parapet. */
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 960, y: 640, scale: 0.8, yaw: 0.05, look: 0, expr: 'worried', blink: idleBlink(t, 8) };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Rooftop t={t + 4000} sunY={860} red={kf(t, [[0, 0.2], [len, 1]])} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

/** You say no; he smiles: "Think about it. Everyone has a price." */
export const S18 = talkShot({
  Set: Home, setT: 900, words,
  cast: [
    { look: YOU, x: 1120, y: 600, yaw: -0.5, faces: [[0, 'worried']], talk: [span(words, 'You', 'no', 5)], seed: 9 },
    { look: L.suit26, x: 860, y: 600, yaw: 0.5, faces: [[0, 'smug']], talk: [span(words, 'Think', 'price')], seed: 10 },
  ],
  cam: { from: [990, 440, 1.9], to: [990, 440, 2.0] },
  front: () => <Table />,
});

/** On his way out, at the kitchen door, he looks down at Ellie. She steps behind her mother. */
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const suit: Pose = { ...basePose, x: 1200, y: 600, yaw: -0.6, look: -1, headTilt: 12, expr: 'smug', blink: idleBlink(t, 11) };
  const ellie: Pose = { ...basePose, x: 760, y: 650, scale: 0.7, yaw: 0.6, look: 1, headTilt: -12, expr: 'worried', blink: idleBlink(t, 12) };
  const mom: Pose = { ...basePose, x: 680, y: 600, yaw: 0.5, look: 0.8, expr: 'worried', armR: { a: 60, b: -60 }, blink: idleBlink(t, 13) };
  return (
    <g transform={camT(960, 450, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <Home t={t + 1200} id="c5s19" />
      <Hero look={L.ellie} pose={ellie} />
      <Hero look={L.mom26} pose={mom} />
      <Hero look={L.suit26} pose={suit} />
    </g>
  );
};

/** That night, from above: you on your back in bed, the phone face down on your chest, headlights sweeping across. */
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 860, y: 630, spin: -90, yaw: 0, look: 0, expr: 'worried', armR: { a: 10, b: -70 }, armL: { a: 10, b: 0 }, blink: idleBlink(t, 14) };
  const sweep = ((t * 16) % 2800) - 700;
  return (
    <g>
      <g transform={camT(980, 560, kf(t, [[0, 1.9], [len, 2.05]]))}>
        <rect x={-400} y={-400} width={2800} height={1900} fill="#1E2236" />
        <rect x={300} y={360} width={1320} height={420} rx={30} fill="#3A4466" stroke="#141826" strokeWidth={8} />
        <ellipse cx={770} cy={560} rx={110} ry={160} fill="#C9CCD8" stroke="#141826" strokeWidth={6} />
        <Hero look={YOU} pose={me} shadow={0} />
        <path d="M 990 380 Q 1350 360 1620 400 L 1620 760 Q 1350 790 990 770 Z" fill="#4A5A8A" stroke="#141826" strokeWidth={6} />
        <rect x={885} y={520} width={100} height={56} rx={10} fill="#1A1820" stroke="#100E16" strokeWidth={4} />
      </g>
      <rect width={1920} height={1080} fill="#05060F" opacity={0.45} />
      <path d={`M ${sweep} 0 L ${sweep + 260} 0 L ${sweep + 560} 1080 L ${sweep + 200} 1080 Z`} fill="#FFF3C0" opacity={0.13} />
    </g>
  );
};

export const S21 = phoneCU({ mode: 'battery', battery: 27, bgColor: '#0B0610', push: 0.14, batteryAt: [[0, 29], [30, 27]] });



/** From the window: a car on the night street below slows down, its lamps on, and stops outside. */
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1000, 700, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Street26 t={t + 5000} id="c5s22" night cars={false} />
      <OldCar x={kf(t, [[0, -200], [Math.max(len, 1) * 0.8, 1100]], easeOut)} y={STREET.kerb + 190} s={1.1} wheel={kf(t, [[0, 0], [len, 400]], easeOut)} />
    </g>
    <rect width={1920} height={1080} fill="none" stroke="#0B0816" strokeWidth={120} />
    <path d="M 960 0 V 1080 M 0 540 H 1920" stroke="#0B0816" strokeWidth={30} />
  </g>
);
