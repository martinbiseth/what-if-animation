import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, talkShot, idleBlink, Glow,
  Kitchen, Stairwell, Smartphone, FONT, Schematic, SchLabel, SCH, Word, Rooftop,
} from '../../../engine';
import { L, YOU, phoneCU, faceCU, bigWord, span } from '../common';
import words from './words.json';

// Chapter 7, the cliffhanger: the phone on the table, one bar of signal in 1926, "Don't give it to him", one percent,
// black. The man laughs. The dead phone is warm. The question for the comments, the recap of what's real, part two.
// Battery 9 to 1, then off.

const W = words as Word[];
const Home: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} period veil={0.75} />;
const Dark: React.FC<{ t: number; id?: string }> = ({ t, id }) => (
  <g>
    <Kitchen t={t} id={id} period veil={0.9} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#030208" opacity={0.75} />
  </g>
);
const at = (w: string, nth = 1) => span(W, w, w, nth)[0] * 30;

/** The table from above: wood grain, the phone lying face up, whatever else is drawn on it. */
const TableTop: React.FC<{ t: number; mode: 'home' | 'off'; buzz?: number; bars?: number; children?: React.ReactNode; warm?: number }> = ({ t, mode, buzz = 0, bars, children, warm = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#6A4A34" />
    {Array.from({ length: 12 }).map((_, i) => (
      <path key={i} d={`M -20 ${i * 95 + 20} Q 960 ${i * 95 + (i % 2 ? 40 : 0)} 1940 ${i * 95 + 20}`} stroke="#5A3E2C" strokeWidth={5} fill="none" />
    ))}
    {warm > 0 ? <Glow x={960} y={540} r={360} o={warm} /> : null}
    <Smartphone x={960 + (buzz ? Math.sin(t * 3) * 6 : 0)} y={540} s={1.0} rot={-8} mode={mode} t={t} battery={8} bars={bars} buzz={buzz} glow={mode === 'off' ? 0 : 1} />
    {children}
  </g>
);

/** You walk down the stairs, slowly, the phone in your hand. */
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 520], [len, 1000]]);
  const y = 420 + ((x - 420) * 70) / 150 - 140;
  const me: Pose = { ...basePose, x, y, yaw: 0.5, look: 0.4, headTilt: 10, expr: 'worried', armR: { a: 40, b: -60 }, legL: { a: Math.sin(t / 5) * 18, b: -10 }, legR: { a: -Math.sin(t / 5) * 18, b: -10 }, blink: idleBlink(t, 2) };
  return (
    <g transform={camT(x, y + 40, 1.6)}>
      <Stairwell t={t + 900} id="c7s2" />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={0.4} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

/** Insert: your hand puts the phone down on the table. */
export const S3: React.FC<ShotProps> = ({ t }) => (
  <TableTop t={t} mode="home">
    <g opacity={1 - clamp((t - 24) / 8)}>
      <path d={`M 400 1200 Q 600 ${kf(t, [[0, 900], [20, 760]], easeOut)} 860 ${kf(t, [[0, 700], [20, 620]], easeOut)}`} stroke="#F07A2A" strokeWidth={110} fill="none" strokeLinecap="round" />
      <circle cx={880} cy={kf(t, [[0, 690], [20, 610]], easeOut)} r={70} fill="#26232F" stroke="#100E16" strokeWidth={8} />
    </g>
  </TableTop>
);

/** The grey sleeve reaches in from the other side. */
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp(t / Math.max(1, len * 0.9)));
  return (
    <TableTop t={t} mode="home">
      <path d={`M 2100 200 Q 1700 300 ${1600 - 360 * reach} ${360 + 60 * reach}`} stroke="#5A5F6A" strokeWidth={120} fill="none" strokeLinecap="round" />
      <circle cx={1580 - 360 * reach} cy={370 + 60 * reach} r={66} fill="#26232F" stroke="#100E16" strokeWidth={8} />
    </TableTop>
  );
};

/** It buzzes: one bar of signal. */
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) scale(${kf(t, [[0, 1.4], [len, 1.6]])}) translate(-960 -540)`}>
    <TableTop t={t} mode="home" buzz={1} bars={1} />
  </g>
);

export const S6 = bigWord({ kicker: 'ONE BAR OF SIGNAL, IN 1926', word: 'IMPOSSIBLE', color: '#FF4A4A', Bg: Dark });

/** Your face: unless someone else is here too. */
export const S7 = faceCU({ look: YOU, Bg: Home, faces: [[0, 'shock']], yaw: 0.25, zoom: [3.3, 3.7], glint: 1 });

export const S8 = phoneCU({ mode: 'signal', battery: 1, bars: 1, text: "Don't give it|to him.", bgColor: '#08060C', push: 0.16, s: 1.7, y: 560, buzz: (t) => (t < 10 ? 1 : 0) });

/** One percent, and the screen goes black. */
export const S9 = phoneCU({ mode: 'battery', battery: 1, bgColor: '#08060C', push: 0.1, modeAt: [[0, 'battery'], [44, 'off']] });

/** Black. In the dark, the man in the grey suit laughs softly: "Well. That changes things." */
export const S10 = talkShot({
  Set: Dark, setT: 2400, words,
  cast: [{ look: L.suit26, x: 960, y: 620, yaw: 0.1, faces: [[0, 'smug']], talk: [span(words, 'Well', 'things')], seed: 4, rim: 'rimBlue' }],
  cam: { from: [960, 470, 2.3], to: [960, 470, 2.6] },
});

/** Mo grabs your sleeve. */
export const S11 = talkShot({
  Set: Dark, setT: 2600,
  cast: [
    { look: L.mo26, x: 860, y: 660, scale: 0.85, yaw: 0.5, faces: [[0, 'worried']], seed: 5, pose: { armR: { a: 70, b: 10 } }, rim: 'rimBlue' },
    { look: YOU, x: 1060, y: 620, yaw: -0.3, faces: [[0, 'shock']], seed: 6, rim: 'rimBlue' },
  ],
  cam: { from: [960, 460, 2.1], to: [960, 460, 2.25] },
});

/** The dead phone on the table, black, and a faint warmth glowing round it, breathing. */
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.2], [len, 1.45]])}) translate(-960 -540)`}>
      <TableTop t={t} mode="off" warm={0.25 + 0.2 * Math.sin(t / 10)} />
    </g>
    <rect width={1920} height={1080} fill="#030208" opacity={0.55} />
  </g>
);

/** The question: Ellie on one side, the future on the other. */
export const S13: React.FC<ShotProps> = ({ t, f }) => {
  const a = at('Save');
  const b = at('save', 2);
  const ellie: Pose = { ...basePose, x: 480, y: 700, yaw: 0.2, expr: 'tired', blink: idleBlink(t, 7) };
  return (
    <g>
      <rect width={1920} height={1080} fill="#1A1420" />
      <g transform="translate(-480 0)" opacity={clamp((f - a) / 6)}>
        <g transform={camT(480, 560, 2.2)}>
          <rect x={-400} y={-400} width={2800} height={1900} fill="#2A2436" />
          <Hero look={L.ellie} pose={ellie} shadow={0} />
        </g>
      </g>
      <g opacity={clamp((f - b) / 6)}>
        <rect x={960} y={0} width={960} height={1080} fill={SCH.ground} />
        <g transform="translate(1440 520)">
          <circle r={200} fill="none" stroke={SCH.line} strokeWidth={6} />
          <ellipse rx={90} ry={200} fill="none" stroke={SCH.dim} strokeWidth={4} />
          <path d="M -200 0 H 200 M -175 -100 H 175 M -175 100 H 175" stroke={SCH.dim} strokeWidth={4} />
        </g>
      </g>
      <rect x={950} y={0} width={20} height={1080} fill="#0B0816" />
      <text x={480} y={950} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={backOut(clamp((f - a) / 8))}>SAVE ELLIE</text>
      <text x={1440} y={950} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFE27A" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={backOut(clamp((f - b) / 8))}>SAVE THE FUTURE</text>
      <g transform={`translate(960 520) scale(${backOut(clamp((f - b - 10) / 8))})`}>
        <circle r={80} fill="#FF4A4A" stroke="#0B0816" strokeWidth={8} />
        <text y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#fff">?</text>
      </g>
    </g>
  );
};

/** "Tell me in the comments": a comment bubble popping on. */
export const S14: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#120C18" />
    <g transform={`translate(960 520) scale(${backOut(clamp((t - 2) / 10))})`}>
      <path d="M -520 -170 H 520 Q 560 -170 560 -130 V 120 Q 560 160 520 160 H -300 L -400 260 L -380 160 H -520 Q -560 160 -560 120 V -130 Q -560 -170 -520 -170 Z" fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} />
      <text y={-30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#1A1420">ELLIE, OR THE FUTURE?</text>
      <text y={70} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#5A5466">tell me in the comments</text>
    </g>
  </g>
);

/** What's real: the rules, ticking on one by one with the voice. */
export const S15: React.FC<ShotProps> = ({ t, f }) => {
  const rows: [string, string, number][] = [
    ['CELL NETWORK', '1979', at('cell')],
    ['GPS', '1978', at('GPS')],
    ['PENICILLIN', '1928', at('penicillin')],
    ['"COMPUTER" = A PERSON', '1926', at('computer')],
  ];
  return (
    <g>
      <Schematic t={t} id="c7real" />
      <SchLabel x={960} y={200} t={t - 2} text="WHAT'S REAL" size={56} color={SCH.live} />
      {rows.map(([name, year, a], i) => {
        const k = clamp((f - a) / 6);
        return (
          <g key={name} opacity={k} transform={`translate(${380 + (1 - k) * -40} ${340 + i * 150})`}>
            <path d="M 0 -6 l 16 18 l 34 -40" stroke={SCH.live} strokeWidth={10} fill="none" strokeLinecap="round" opacity={clamp((f - a - 6) / 4)} />
            <text x={90} y={14} fontFamily={FONT.ui} fontSize={52} fill={SCH.line}>{name}</text>
            <text x={1160} y={14} textAnchor="end" fontFamily={FONT.ui} fontSize={52} fill={SCH.glow}>{year}</text>
          </g>
        );
      })}
    </g>
  );
};

/** The message again, glowing on a dead screen: who sent it? */
export const S16 = phoneCU({ mode: 'signal', battery: 1, bars: 1, text: "Don't give it|to him.", bgColor: '#030208', push: 0.2, s: 1.7, y: 560 });

/** End card: the rooftop at night, PART 2. */
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Rooftop t={t + 7000} sunY={900} red={0.4} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
    <text x={960} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 8)}>WHO SENT THE MESSAGE?</text>
    <g transform={`translate(960 600) scale(${backOut(clamp((t - 8) / 10))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={220} fill="#FF8A3D" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">PART 2</text>
    </g>
  </g>
);

export const S18 = bigWord({ kicker: 'AND IS ANY OF THIS', word: 'REAL?', color: '#FFE27A', Bg: Dark });

export const S19 = bigWord({ kicker: 'IN 1926, A COMPUTER WAS', word: 'A PERSON', color: '#FF8A3D' });
