import React from 'react';
import { factCard, LOOKS } from '../../../engine';
import {
  PodRoom, FutureCity, Museum, SleepPod, Vee, Citizen, Body, Big, PopWord, Soft, Holo, EarLight,
  scene, veeCU, chapterTitle, podSit, standAt, handAt, headAt, YOU, F1, F2, F3, KID, CLERK, GROUND,
  camT, kf, clamp, backOut, easeOut, basePose, idleBlink, FONT, Glow, Hero, shk, ShotProps, Word,
} from '../common';
import words from './words.json';

// Chapter 2, the premise: in 2026 a clinic paid you $100 to test a sleep pod for one night; it went wrong and nobody
// woke you for almost a thousand years. Real: James Bedford, frozen in 1967, still waiting; nobody has ever been
// brought back. The title. Vee gives you an earpiece and the rules (seven days of free credit, then a job). Everyone
// here has a blue light behind the ear, except you. Vee says nothing.

const W = words as Word[];
const DOC = LOOKS.doctor;
const CLINIC: React.FC<{ t: number; id?: string }> = ({ t, id }) => (
  <g>
    <PodRoom t={t} id={id} window={false} />
    <rect x={300} y={180} width={360} height={240} rx={10} fill="#D8E4EA" stroke="#0B0816" strokeWidth={6} />
    <text x={480} y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#2A3A4A">SLEEP TEST</text>
    <text x={480} y={330} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#C8453A">2026</text>
  </g>
);
const ROOM: React.FC<{ t: number; id?: string }> = ({ t, id }) => <PodRoom t={t} id={id} />;
const MUS: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Museum t={t} id={id} />;

export const S1 = chapterTitle({ kicker: 'TWENTY TWENTY-SIX', title: 'HOW YOU GOT HERE', mode: 'dusk' });

// ---------------------------------------------------------------- S2: the clinic pays you $100
const Bill: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-60} y={-28} width={120} height={56} rx={4} fill="#9AC88A" stroke="#0B0816" strokeWidth={5} />
    <text x={0} y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#2A4A2A">100</text>
  </g>
);
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 8) / 14));
  const doc = standAt(1200, 1.15, GROUND + 60, { yaw: -0.5, armL: { a: 50 + 20 * k, b: -30 } });
  const you = standAt(720, 1.15, GROUND + 60, { yaw: 0.5, armR: { a: 40 + 30 * k, b: -30 } });
  const h = handAt(you);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <CLINIC t={t + 20} />
      <SleepPod x={1500} y={GROUND} s={0.7} t={t} open={1} />
      <Body look={DOC} pose={doc} t={t} faces={[[0, 'happy']]} seed={5} />
      <Body look={YOU} pose={you} t={t} faces={[[0, 'neutral'], [18, 'happy']]} />
      <Bill x={kf(t, [[8, 1080], [22, h.x + 20]], easeOut)} y={kf(t, [[8, 520], [22, h.y - 20]], easeOut)} s={0.8} rot={-10} />
      <PopWord t={t} at={20} x={960} y={250} text="$100" size={110} fill="#5BE08A" hold={len} />
    </g>
  );
};

// ---------------------------------------------------------------- S3: into the pod: "just one night"
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const close = clamp((t - 30) / 20);
  return (
    <g transform={camT(980, 640, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <CLINIC t={t + 60} />
      <Body look={YOU} pose={{ ...basePose, x: 880, y: GROUND - 95, scale: 1, spin: -90, yaw: 0.2 }} t={t} faces={[[0, 'happy'], [40, 'tired']]} />
      <SleepPod x={960} y={GROUND} t={t} open={1 - close} />
      <Body look={DOC} pose={standAt(1450, 1.1, GROUND + 20, { yaw: -0.5, armL: { a: 150, b: -40 } })} t={t} faces={[[0, 'happy']]} seed={5} />
      <PopWord t={t} at={22} x={1450} y={300} text="1 NIGHT!" size={80} fill="#FFFFFF" hold={len} rot={5} />
    </g>
  );
};

// ---------------------------------------------------------------- S4: something went wrong: the pod's screen
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const red = Math.floor(t / 6) % 2 === 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#10141F" />
      <Glow x={960} y={540} r={900} kind="red" o={red ? 0.5 : 0.2} />
      <g transform={`${shk(t, 2, 14, 10)} translate(960 560) scale(${kf(t, [[0, 3.4], [len, 3.7]])}) translate(-200 46)`}>
        <SleepPod x={0} y={0} t={t} open={0} frost={0.3} screen="ERROR" screen2="WAKE: FAILED" dark />
      </g>
      <PopWord t={t} at={6} x={960} y={200} text="ERROR" size={120} fill="#FF5A4A" hold={len} rot={-3} />
    </g>
  );
};

// ---------------------------------------------------------------- S5: nobody came: the years count up to 3000
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len - 10));
  const year = Math.round(2026 + 974 * easeOut(k) ** 1.4);
  const dark = Math.floor(t / 3) % 7 === 0 ? 0.5 : 0.25;
  return (
    <g>
      <g transform={camT(960, 640, 1.2)}>
        <CLINIC t={t * 8} />
        <SleepPod x={960} y={GROUND} t={t} open={0} frost={0.2 + k * 0.6} screen="ASLEEP" screen2={`${year}`} />
        {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={(i * 197 + t * 9) % 1920} cy={(i * 131) % 900} r={3} fill="#FFFFFF" opacity={0.4} />)}
      </g>
      <rect width={1920} height={1080} fill="#0B0816" opacity={dark} />
      <g transform="translate(960 230)">
        <rect x={-260} y={-90} width={520} height={150} rx={75} fill="#0B0816" opacity={0.85} />
        <text x={0} y={20} textAnchor="middle" fontFamily={FONT.ui} fontSize={100} fill={year >= 3000 ? '#FFD23A' : '#4AE8FF'}>{year}</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S6: that sounds crazy (you in the pod, asleep under frost)
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A2230" />
    <Glow x={960} y={400} r={700} kind="cool" o={0.4} />
    <g transform={camT(960, 520, kf(t, [[0, 3.0], [len, 3.3]]))}>
      <Hero look={YOU} pose={{ ...basePose, x: 960, y: 720, yaw: 0, blink: 1, expr: 'tired' }} shadow={0} />
      <rect x={760} y={360} width={400} height={300} rx={120} fill="#BFEFFF" opacity={0.35} />
      {Array.from({ length: 14 }).map((_, i) => <circle key={i} cx={780 + ((i * 53) % 380)} cy={380 + ((i * 89) % 260)} r={10 + (i % 4) * 6} fill="#FFFFFF" opacity={0.3} />)}
    </g>
  </g>
);

export const S7 = factCard({ value: 1967, suffix: '', label: 'FIRST PERSON EVER FROZEN AFTER DEATH', sub: 'James Bedford, still in storage today', format: (v) => String(Math.round(v)) });
export const S8 = factCard({ value: 0, suffix: '', label: 'PEOPLE EVER BROUGHT BACK', sub: 'nobody, so far' });

export const S9 = chapterTitle({ kicker: 'WHAT IF YOU WOKE UP', title: 'IN THE YEAR 3000?', mode: 'day' });

// ---------------------------------------------------------------- S10: the robot's name is Vee
export const S10 = veeCU({
  Bg: MUS, mood: 'happy', words: W, look: -0.3, zoom: [2.2, 2.4],
  extra: (t) => (
    <g transform={`translate(1080 400) scale(${backOut(clamp((t - 6) / 9)) * 0.4})`}>
      <rect x={-120} y={-50} width={240} height={90} rx={45} fill="#0B0816" />
      <text x={0} y={18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#4AE8FF">VEE</text>
    </g>
  ),
});

// ---------------------------------------------------------------- S11: the earpiece goes in
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 4) / 16));
  const pose = { ...basePose, x: 960, y: 700, yaw: 0.5, look: -0.6, expr: (t > 24 ? 'happy' : 'neutral') as 'happy' | 'neutral', blink: idleBlink(t, 2) };
  const h = headAt(pose);
  const ex = h.x - 60;
  const ey = h.y + 20;
  return (
    <g>
      <Soft blur={16} dim={0.1}>
        <g transform={camT(960, 520, 1.6)}>
          <ROOM t={t + 160} />
        </g>
      </Soft>
      <g transform={camT(940, 520, kf(t, [[0, 3.0], [len, 3.3]]))}>
        <Hero look={YOU} pose={pose} shadow={0} />
        <g transform={`translate(${kf(t, [[4, ex - 200], [20, ex]], easeOut)} ${kf(t, [[4, ey - 120], [20, ey]], easeOut)})`}>
          <circle r={16} fill="#F2F6F8" stroke="#0B0816" strokeWidth={4} />
          <circle r={6} fill="#4AE8FF" />
        </g>
        <Vee x={kf(t, [[0, 640], [20, 740]])} y={360} s={0.45} t={t} mood="happy" look={0.6} />
      </g>
      {t > 22 ? <PopWord t={t} at={22} x={1400} y={300} text="CLICK" size={80} fill="#4AE8FF" hold={len} rot={6} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- S12: the rules
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const r = (i: number, d: number) => backOut(clamp((t - d) / 9));
  return (
    <g>
      <Soft blur={10} dim={0.35}>
        <g transform={camT(960, 520, 1.3)}>
          <MUS t={t + 200} />
        </g>
      </Soft>
      <Vee x={420} y={560} s={1.1} t={t} mood="open" look={0.7} talk={Math.abs(Math.sin(t / 3)) * 0.8} />
      <Holo x={1180} y={540} w={980} h={560} t={t} on={clamp(t / 10)}>
        <text x={0} y={-200} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={6} fill="#8AF0FF">THE RULES</text>
        <g transform={`translate(-380 -70) scale(${r(1, 20)})`}>
          <text x={0} y={0} fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#FFFFFF">1. 7 DAYS FREE CREDIT</text>
        </g>
        <g transform={`translate(-380 70) scale(${r(2, 70)})`}>
          <text x={0} y={0} fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#FFD23A">2. THEN: GET A JOB</text>
        </g>
      </Holo>
    </g>
  );
};

// ---------------------------------------------------------------- S13: everyone has a tiny blue light behind the ear
export const S13 = scene({
  Set: MUS, words: W, cam: [960, 560, 1.15], cam1: [960, 520, 1.45],
  cast: [
    { look: F1, x: 380, yaw: 0.6, s: 1.1 }, { look: F2, x: 760, yaw: -0.6, s: 1.05 }, { look: KID, x: 1040, yaw: 0.6, s: 0.7 }, { look: F3, x: 1300, yaw: -0.6, s: 1.1 }, { look: CLERK, x: 1620, yaw: -0.4, s: 1.0 },
  ],
  over: (t) => <Glow x={960} y={400} r={900} kind="cool" o={0.15 + 0.1 * Math.sin(t / 6)} />,
});

// ---------------------------------------------------------------- S14: everyone except you
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 6) / 12));
  return (
    <g>
      <Soft blur={16} dim={0.15}>
        <g transform={camT(960, 520, 1.5)}>
          <MUS t={t + 240} />
        </g>
      </Soft>
      <g transform={camT(960, 560, kf(t, [[0, 2.6], [len, 2.8]]))}>
        <Hero look={YOU} pose={{ ...basePose, x: 960, y: 720, yaw: -0.4, look: 0.6, armR: { a: 150 * k, b: -150 * k }, expr: t > 14 ? 'worried' : 'neutral', blink: idleBlink(t, 6) }} shadow={0} />
        <g opacity={clamp((t - 18) / 6)}>
          <circle cx={1030} cy={560} r={30} fill="none" stroke="#FF5A4A" strokeWidth={5} strokeDasharray="8 6" />
          <text x={1080} y={530} fontFamily={FONT.ui} fontSize={26} fill="#FF5A4A">NO LIGHT</text>
        </g>
      </g>
    </g>
  );
};

export const S15 = veeCU({ Bg: MUS, mood: 'sad', zoom: [2.6, 2.9], look: 0.6 });
