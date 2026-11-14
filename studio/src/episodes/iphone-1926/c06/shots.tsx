import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, chapterCard, factCard, Street26, street26Hip, ShotProps, talkShot, idleBlink, Glow,
  Kitchen, Stairwell, Schematic, SchLabel, SCH, Look, Expr,
} from '../../../engine';
import { L, YOU, phoneCU, faceCU, bigWord, span } from '../common';
import words from './words.json';

// Chapter 6, the choice: Ellie's cut turns into a fever, the doctor can do nothing, the star, penicillin is two years
// away, the man in the grey suit offers a laboratory, Mo on the stairs, give it away or keep it. Battery 27 to 9.

const HIP = street26Hip(1);
const Home: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} period veil={0.7} />;
const Stairs: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Stairwell t={t} id={id} />;

/** A bed seen from above in a dark room: someone lying in it, head on the pillow, the duvet up to the chest. */
const BedAbove: React.FC<{ t: number; look: Look; expr: Expr; blink?: number; flush?: number; children?: React.ReactNode; dark?: number }> = ({ t, look, expr, blink, flush = 0, children, dark = 0.4 }) => {
  const me: Pose = { ...basePose, x: 850, y: 630, spin: -90, expr, armR: { a: 10, b: -70 }, armL: { a: 10, b: 0 }, blink: blink ?? idleBlink(t, 21), headTilt: Math.sin(t / 30) * 3 };
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#2A2436" />
      <rect x={300} y={360} width={1320} height={420} rx={30} fill="#E9DCC0" stroke="#141826" strokeWidth={8} />
      <ellipse cx={770} cy={560} rx={110} ry={160} fill="#F6EFE3" stroke="#141826" strokeWidth={6} />
      <Hero look={look} pose={me} shadow={0} />
      {flush > 0 ? <ellipse cx={760} cy={560} rx={70} ry={50} fill="#FF4A4A" opacity={0.14 * flush} /> : null}
      <path d="M 950 370 Q 1300 350 1620 390 L 1620 770 Q 1300 800 950 780 Z" fill="#8A5A6A" stroke="#141826" strokeWidth={6} />
      {Array.from({ length: 5 }).map((_, i) => (
        <path key={i} d={`M ${1060 + i * 110} 380 V 780`} stroke="#7A4A5A" strokeWidth={6} />
      ))}
      {children}
      <rect x={-400} y={-400} width={2800} height={1900} fill="#05060F" opacity={dark} />
    </g>
  );
};

export const S1 = chapterCard({ kicker: 'CHAPTER 6', title: 'THE CHOICE', red: 0.7 });

/** The street: Ellie running, trips on the kerb, sits up holding her knee. */
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const fall = easeOut(clamp((t - 14) / 8));
  const ellie: Pose = {
    ...basePose, x: kf(t, [[0, 600], [14, 900]]), y: HIP + 50 + fall * 80, scale: 0.7, yaw: 0.6, look: 0.6,
    spin: -70 * fall, expr: t > 22 ? 'worried' : 'happy', legL: { a: Math.sin(t / 3) * 24 * (1 - fall), b: -20 }, legR: { a: -Math.sin(t / 3) * 24 * (1 - fall), b: -20 },
    armL: { a: 40 + 60 * fall, b: -20 }, armR: { a: 40 + 60 * fall, b: -20 }, blink: idleBlink(t, 3),
  };
  return (
    <g transform={camT(900, 600, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <Street26 t={t + 6000} id="c6s2" cars={false} />
      <Hero look={L.ellie} pose={ellie} />
    </g>
  );
};

/** Insert: a small leg with a bandage, and the red lines creeping up from it. */
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len));
  return (
    <g>
      <rect width={1920} height={1080} fill="#E9DCC0" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M 0 ${i * 130} H 1920`} stroke="#DCCDB0" strokeWidth={6} />
      ))}
      <path d="M 300 700 Q 900 640 1700 520 L 1720 760 Q 900 860 300 900 Z" fill="#26232F" stroke="#100E16" strokeWidth={8} />
      <rect x={760} y={660} width={200} height={190} rx={20} fill="#F6EFE3" stroke="#100E16" strokeWidth={6} transform="rotate(-6 860 755)" />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${960} ${700 + i * 40} q ${200 * k} ${-30 - i * 10} ${400 * k} ${-60 - i * 20}`} stroke="#E04A4A" strokeWidth={8} fill="none" strokeLinecap="round" opacity={0.85} />
      ))}
    </g>
  );
};

/** Ellie in bed, flushed with fever; Mo's mom's hand with a wet cloth. */
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(940, 560, kf(t, [[0, 1.5], [len, 1.62]]))}>
    <BedAbove t={t} look={L.ellie} expr="tired" flush={1} dark={0.35}>
      <rect x={720} y={470} width={110} height={40} rx={10} fill="#DDE8F0" stroke="#141826" strokeWidth={4} transform={`rotate(${Math.sin(t / 20) * 6} 775 490)`} />
    </BedAbove>
  </g>
);

/** The doctor at the foot of the bed, bag in hand, shaking his head. */
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const doc: Pose = { ...basePose, x: 900, y: 600, yaw: 0.3, look: 0.4, headTilt: Math.sin(t / 6) * 6, expr: 'worried', armL: { a: 14, b: -10 }, blink: idleBlink(t, 5) };
  const mom: Pose = { ...basePose, x: 1180, y: 600, yaw: -0.4, look: -0.6, expr: 'worried', armL: { a: 50, b: -110 }, armR: { a: 50, b: -110 }, blink: idleBlink(t, 6) };
  return (
    <g transform={camT(1020, 440, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <Home t={t + 1400} id="c6s5" />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={0.3} />
      <Hero look={L.mom26} pose={mom} />
      <Hero look={L.doctor} pose={doc} />
      <rect x={700} y={660} width={130} height={90} rx={14} fill="#3A2420" stroke="#100E16" strokeWidth={5} />
    </g>
  );
};

/** Mo at the bedside, pulling a silly face; Ellie barely smiles. */
export const S6 = talkShot({
  Set: Home, setT: 1600,
  cast: [{ look: L.mo26, x: 960, y: 640, scale: 0.85, yaw: 0.2, faces: [[0, 'oops'], [30, 'happy'], [60, 'worried']], seed: 7, pose: { armL: { a: 150, b: 40 }, armR: { a: 150, b: 40 } } }],
  cam: { from: [960, 470, 2.2], to: [960, 470, 2.35] },
});

/** The star on the ceiling again, over Ellie's bed. */
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(940, 560, kf(t, [[0, 1.4], [len, 1.5]]))}>
    <BedAbove t={t} look={L.ellie} expr={t > 20 ? 'happy' : 'tired'} flush={1} dark={0.5}>
      <g transform={`translate(1240 470) scale(${0.9 + Math.sin(t / 8) * 0.05})`}>
        <circle r={150} fill="#FFF3C0" opacity={0.3} />
        <path d="M 0 -80 L 21 -24 L 80 -24 L 32 10 L 50 70 L 0 34 L -50 70 L -32 10 L -80 -24 L -21 -24 Z" fill="#FFE27A" />
      </g>
    </BedAbove>
    <Glow x={1240} y={470} r={300} o={0.5} />
  </g>
);

/** Your face in the dark, lit from below by the flashlight: somehow that's worse. */
export const S8 = faceCU({ look: YOU, Bg: Home, faces: [[0, 'worried']], yaw: 0.2, zoom: [3.3, 3.6], extra: () => <rect x={-400} y={-400} width={2800} height={1900} fill="#05060F" opacity={0.25} /> });

export const S9 = factCard({ value: 1928, label: 'PENICILLIN IS DISCOVERED', sub: 'SEPTEMBER 1928', format: (v) => String(Math.round(v)) });

export const S10 = phoneCU({ mode: 'pharmacy', battery: 20, bgColor: '#1A1420', push: 0.1 });

/** A photo can't cure anyone: you, phone down, staring at the floor. */
export const S11 = faceCU({ look: YOU, Bg: Home, faces: [[0, 'worried'], [30, 'tired']], yaw: -0.3, look_: 0.2, zoom: [2.6, 2.8], pose: { headTilt: 14 } });

/** The kitchen at night: the grey suit is back, and behind him the shapes of flasks and equipment on the table. */
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const suit: Pose = { ...basePose, x: 900, y: 600, yaw: 0.4, look: 0.6, expr: 'smug', blink: idleBlink(t, 8) };
  return (
    <g transform={camT(980, 450, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Home t={t + 1800} id="c6s12" />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={0.35} />
      <Hero look={L.suit26} pose={suit} />
      <g transform="translate(1180 620)">
        <path d="M -40 0 L -10 -60 V -110 H 10 V -60 L 40 0 Z" fill="#9FD8C0" opacity={0.8} stroke="#100E16" strokeWidth={4} />
        <rect x={60} y={-80} width={24} height={80} rx={8} fill="#E0A0D0" opacity={0.8} stroke="#100E16" strokeWidth={4} />
        <rect x={100} y={-120} width={70} height={120} fill="#3A3440" stroke="#100E16" strokeWidth={4} />
        <circle cx={135} cy={-90} r={10} fill="#7FE07A" opacity={0.5 + 0.5 * Math.sin(t / 4)} />
      </g>
    </g>
  );
};

/** "Give us the phone, and we'll make your medicine." */
export const S13 = talkShot({
  Set: Home, setT: 2000, words,
  cast: [
    { look: L.suit26, x: 860, y: 600, yaw: 0.5, faces: [[0, 'smug']], talk: [span(words, 'Give', 'medicine', 2)], seed: 9, pose: { armR: { a: 60, b: -20 }, handR: 'point' } },
    { look: YOU, x: 1120, y: 600, yaw: -0.5, faces: [[0, 'worried']], seed: 10 },
  ],
  cam: { from: [990, 440, 2.0], to: [990, 440, 2.15] },
  front: () => <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={0.25} />,
});

/** Mo on the stairs, knees up, having heard everything. */
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const mo: Pose = { ...basePose, x: 880, y: 560 - 30, scale: 0.85, yaw: 0.4, look: 0.6, headTilt: 10, expr: 'worried', legL: { a: 85, b: -95 }, legR: { a: 80, b: -95 }, armL: { a: 40, b: -90 }, armR: { a: 40, b: -90 }, blink: idleBlink(t, 11) };
  return (
    <g transform={camT(900, 480, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Stairs t={t + 300} id="c6s14" />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={0.35} />
      <Hero look={L.mo26} pose={mo} />
    </g>
  );
};

/** Ellie asleep, burning hot. */
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(860, 560, kf(t, [[0, 2.0], [len, 2.2]]))}>
    <BedAbove t={t} look={L.ellie} expr="tired" blink={1} flush={1.6} dark={0.5} />
  </g>
);

/** The scales: GIVE IT AWAY (the whole world, millions of dots) against KEEP IT (one small figure). */
export const S16: React.FC<ShotProps> = ({ t, f }) => {
  const keepAt = span(words, 'Keep', 'Keep')[0] * 30;
  const tip = keepAt > 0 && f >= keepAt ? easeOut(clamp((f - keepAt) / 20)) : 0;
  const a = -8 + 16 * tip;
  return (
    <g>
      <Schematic t={t} id="c6sc" />
      <path d="M 960 820 L 960 380" stroke={SCH.line} strokeWidth={8} />
      <path d="M 900 820 H 1020" stroke={SCH.line} strokeWidth={8} />
      <g transform={`rotate(${a} 960 380)`}>
        <path d="M 560 380 H 1360" stroke={SCH.line} strokeWidth={8} />
        <g transform={`translate(560 380) rotate(${-a})`}>
          <path d="M 0 0 L -120 200 M 0 0 L 120 200 M -140 200 H 140" stroke={SCH.dim} strokeWidth={5} />
          {Array.from({ length: 60 }).map((_, i) => (
            <circle key={i} cx={-110 + (i % 12) * 20} cy={190 - Math.floor(i / 12) * 18} r={6} fill={SCH.glow} opacity={clamp((t - i * 0.3) / 6)} />
          ))}
        </g>
        <g transform={`translate(1360 380) rotate(${-a})`}>
          <path d="M 0 0 L -120 200 M 0 0 L 120 200 M -140 200 H 140" stroke={SCH.dim} strokeWidth={5} />
          <g stroke={SCH.live} strokeWidth={6} fill="none" opacity={clamp((f - keepAt) / 6)}>
            <circle cx={0} cy={120} r={20} />
            <path d="M 0 140 V 170 M 0 150 L -16 162 M 0 150 L 16 162 M 0 170 L -12 196 M 0 170 L 12 196" />
          </g>
        </g>
      </g>
      <SchLabel x={560} y={300} t={t - 4} text="GIVE IT AWAY" size={44} />
      <SchLabel x={1360} y={300} t={f - keepAt} text="KEEP IT" size={44} color={SCH.live} />
    </g>
  );
};

export const S17 = bigWord({ kicker: 'EVERY TIME TRAVEL MOVIE', word: "DON'T TOUCH", color: '#FF8A3D', Bg: Stairs });

/** You on the bottom step, head in your hands. */
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 1460, y: 900 - 34, yaw: -0.2, look: 0.3, headTilt: 18, expr: 'tired', legL: { a: 85, b: -95 }, legR: { a: 80, b: -95 }, armL: { a: 150, b: -150 }, armR: { a: 150, b: -150 }, blink: idleBlink(t, 12) };
  return (
    <g transform={camT(1400, 700, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <Stairs t={t + 600} id="c6s18" />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={0.4} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

export const S19 = phoneCU({ mode: 'battery', battery: 9, bgColor: '#120608', push: 0.16, batteryAt: [[0, 11], [30, 9]] });


