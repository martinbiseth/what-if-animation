import React from 'react';
import {
  OldCity, Vault, NameDoor, SleepPod, FutureCity, Vee, Citizen, Body, Big, PopWord, Soft, RealTag,
  scene, setShot, standAt, faceCU, YOU, MO7, GROUND,
  camT, kf, clamp, backOut, easeOut, easeInOut, basePose, idleBlink, FONT, Glow, Hero, shk, ShotProps, Word, Pose,
} from '../common';
import words from './words.json';

// Chapter 7, the copy: a day's walk into the old city, a metal door with your family name, a cold vault and a second
// sleep pod, switched on. Asleep since 2026, wake date today. Mo Seven wipes the frost: the face inside is yours. A
// note in your sister's hand: one of you is the copy. So who woke up in the museum? Then the real science, and the ask.

const W = words as Word[];
const OC: React.FC<{ t: number; id?: string }> = ({ t, id }) => <OldCity t={t} id={id} />;
const VA: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Vault t={t} id={id} />;

const walkPose = (x: number, t: number, s: number, dir: 1 | -1, extra: Partial<Pose> = {}): Pose => {
  const ph = t * 0.32;
  return { ...standAt(x, s, GROUND, { yaw: 0.6 * dir }), legL: { a: 18 * Math.sin(ph), b: -10 }, legR: { a: -18 * Math.sin(ph), b: -10 }, armL: { a: 14 * Math.sin(ph), b: -10 }, armR: { a: -14 * Math.sin(ph), b: -10 }, facing: dir, ...extra };
};

// ---------------------------------------------------------------- S1: walking all day into the old city
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 200], [len, 1100]]);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1000]]), 560, 1.2)}>
      <OC t={t + 100} />
      <Citizen look={MO7} pose={walkPose(x - 170, t + 5, 0.9, 1)} t={t} faces={[[0, 'tired']]} light={false} shadow={1} />
      <Body look={YOU} pose={walkPose(x, t, 0.9, 1)} t={t} faces={[[0, 'tired']]} shadow={1} />
      <Vee x={x + 150} y={GROUND - 300} s={0.5} t={t} mood="scan" look={0.6} />
    </g>
  );
};

// ---------------------------------------------------------------- S2: broken towers, green, quiet
export const S2 = setShot(OC, [600, 420, 1.15], [1300, 460, 1.2], (t) => (
  <g>
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M ${700 + i * 260 + t * 2} ${260 + i * 40} q 14 -12 28 0 q 14 -12 28 0`} stroke="#1E1828" strokeWidth={5} fill="none" />
    ))}
  </g>
));

// ---------------------------------------------------------------- S3: the door with your family name
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 960]]), 560, kf(t, [[0, 1.4], [len, 1.7]]))}>
    <OC t={t + 160} />
    <rect x={700} y={GROUND - 520} width={520} height={520} fill="#3A3448" stroke="#0B0816" strokeWidth={8} />
    <NameDoor x={960} y={GROUND} s={1.0} scratch={1} />
    <Body look={YOU} pose={standAt(640, 1.0, GROUND + 20, { yaw: 0.5, armR: { a: 70, b: -10 } })} t={t} faces={[[0, 'shock']]} shadow={1} />
    <Vee x={1320} y={GROUND - 340} s={0.55} t={t} mood="scan" look={-0.6} />
    <Glow x={960} y={GROUND - 220} r={200} kind="cool" o={0.4} />
  </g>
);

// ---------------------------------------------------------------- S4–S8: the vault and the second pod
const POD_X = 1060;
const Pod: React.FC<{ t: number; on?: number; frost?: number; s?: number }> = ({ t, on = 0, frost = 1, s = 1.4 }) => (
  <SleepPod x={POD_X} y={GROUND} s={s} t={t} open={0} frost={frost} glow={on} screen={on > 0.5 ? 'ASLEEP SINCE 2026' : undefined} screen2={on > 0.5 ? 'WAKE: TODAY' : undefined} dark={on < 0.5} />
);
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 520, kf(t, [[0, 1.0], [len, 1.15]]))}>
    <VA t={t + 100} />
    <Pod t={t} on={0} />
    <Body look={YOU} pose={standAt(420, 0.95, GROUND + 30, { yaw: 0.5, armL: { a: 30, b: -80 }, armR: { a: 30, b: -80 } })} t={t} faces={[[0, 'worried']]} shadow={1} />
    <Citizen look={MO7} pose={standAt(260, 0.95, GROUND + 20, { yaw: 0.5 })} t={t} faces={[[0, 'worried']]} light={false} shadow={1} />
    <path d={`M 200 ${GROUND - 380} q 10 -20 20 0`} stroke="#E8FAFF" strokeWidth={4} fill="none" opacity={0.5 * Math.abs(Math.sin(t / 10))} />
  </g>
);
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const on = clamp((t - 8) / 4);
  return (
    <g transform={`${shk(t, 8, 10, 6)} ${camT(POD_X, 600, kf(t, [[0, 1.5], [len, 1.6]]))}`}>
      <VA t={t + 160} />
      <Glow x={POD_X} y={GROUND - 200} r={500} kind="cool" o={0.6 * on} />
      <Pod t={t} on={on} />
      <PopWord t={t} at={9} x={POD_X} y={GROUND - 520} text="BEEP." size={80} fill="#4AE8FF" hold={len} rot={0} />
    </g>
  );
};
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const cnt = Math.min(2026, Math.floor(t * 80));
  return (
    <g>
      <rect width={1920} height={1080} fill="#0A1420" />
      <Glow x={960} y={540} r={700} kind="cool" o={0.5} />
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.08]])})`}>
        <rect x={-640} y={-260} width={1280} height={520} rx={24} fill="#0B0816" stroke="#2E3A56" strokeWidth={10} />
        <rect x={-610} y={-230} width={1220} height={460} rx={14} fill="#0E2232" />
        <text x={0} y={-90} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill="#8AF0FF">ASLEEP SINCE</text>
        <text x={0} y={10} textAnchor="middle" fontFamily={FONT.ui} fontSize={100} fill="#FFFFFF">{cnt}</text>
        <g opacity={clamp((t - 40) / 4)}>
          <text x={0} y={140} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} letterSpacing={4} fill="#FFD23A">WAKE DATE: TODAY</text>
        </g>
      </g>
    </g>
  );
};
const FrostWipe: React.FC<{ k: number }> = ({ k }) => (
  <ellipse cx={POD_X} cy={GROUND - 270} rx={150 * k} ry={110 * k} fill="#0E2232" />
);
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 10) / (len * 0.7)));
  return (
    <g transform={camT(POD_X - 60, 560, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <VA t={t + 200} />
      <Glow x={POD_X} y={GROUND - 200} r={500} kind="cool" o={0.6} />
      <Pod t={t} on={1} />
      <Citizen look={MO7} pose={standAt(POD_X - 250, 1.1, GROUND + 40, { yaw: 0.5, armR: { a: 95 + 25 * Math.sin(t / 3), b: -20 } })} t={t} faces={[[0, 'worried']]} light={false} shadow={1} />
      <Body look={YOU} pose={standAt(POD_X - 470, 1.05, GROUND + 50, { yaw: 0.5 })} t={t} faces={[[0, 'worried']]} shadow={1} />
      <ellipse cx={POD_X - 30} cy={GROUND - 260} rx={140 * k} ry={70 * k} fill="#E8FAFF" opacity={0.12} />
    </g>
  );
};
// the face inside: a close-up through the glass, frost around the edge, your face asleep
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1.0], [len, 1.12]]);
  const pose: Pose = { ...basePose, x: 960, y: 700, scale: 1, yaw: 0, look: 0, expr: 'neutral', blink: 1, headTilt: -4 };
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0816" />
      <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
        <rect x={0} y={0} width={1920} height={1080} fill="#1E3A4E" />
        <Glow x={960} y={500} r={600} kind="cool" o={0.6} />
        <g transform={camT(960, 560, 3.0)}>
          <Hero look={YOU} pose={pose} shadow={0} />
        </g>
        <defs>
          <radialGradient id="frost7" cx="50%" cy="50%" r="60%">
            <stop offset="55%" stopColor="#E8FAFF" stopOpacity={0} />
            <stop offset="100%" stopColor="#E8FAFF" stopOpacity={0.85} />
          </radialGradient>
        </defs>
        <rect width={1920} height={1080} fill="url(#frost7)" />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${300 + i * 600} 80 L ${520 + i * 600} 980`} stroke="#FFFFFF" strokeWidth={20} opacity={0.08} />)}
      </g>
      <g opacity={clamp((t - 30) / 8)}>
        <Big x={960} y={960} size={90} fill="#FFD23A">YOURS.</Big>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S9: Mo Seven's hand shaking
export const S9 = faceCU({
  look: MO7, Bg: VA, faces: [[0, 'shock']], yaw: 0.3, eyes: -0.4, zoom: [2.9, 3.1], light: { x: 1100, y: 520, kind: 'cool', o: 0.6 },
  extra: (t) => <g transform={`translate(${Math.sin(t * 2.3) * 5} ${Math.cos(t * 3.1) * 4})`}><circle cx={1060} cy={560} r={22} fill="#E8F4F2" stroke="#0B0816" strokeWidth={4} /></g>,
  pose: { armR: { a: 110, b: -30 } },
});

// ---------------------------------------------------------------- S10: the note on the glass
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const txt = 'One of you is the copy.';
  const start = Math.max(0, len - 90);
  const n = Math.floor(clamp((t - start) / 40) * txt.length);
  return (
    <g>
      <rect width={1920} height={1080} fill="#1E3A4E" />
      <Glow x={960} y={540} r={700} kind="cool" o={0.5} />
      <g transform={`translate(960 540) rotate(-3) scale(${kf(t, [[0, 1.0], [len, 1.1]])})`}>
        <rect x={-460} y={-260} width={920} height={520} fill="#FBF6EA" stroke="#0B0816" strokeWidth={6} />
        <rect x={-120} y={-300} width={240} height={70} fill="#E8E0B0" opacity={0.8} transform="rotate(4)" />
        {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M -420 ${-160 + i * 60} L 420 ${-160 + i * 60}`} stroke="#9AC8E8" strokeWidth={2} />)}
        <text x={-400} y={-60} fontFamily={FONT.hand} fontSize={52} fill="#2A2040" opacity={clamp(t / 10)}>for you. both of you.</text>
        <text x={-400} y={60} fontFamily={FONT.hand} fontSize={72} fill="#C8453A">{txt.slice(0, n)}</text>
        <text x={300} y={200} fontFamily={FONT.hand} fontSize={44} fill="#2A2040" opacity={clamp(t / 10)}>– E.</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S11: so who woke up in the museum?
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 520, kf(t, [[0, 3.0], [len, 2.2]]))}>
      <VA t={t + 260} />
      <Glow x={POD_X} y={GROUND - 200} r={500} kind="cool" o={0.6} />
      <Pod t={t} on={1} s={1.1} />
      <Hero look={YOU} pose={{ ...basePose, x: 760, y: 760, scale: 1, yaw: 0.4, look: 0.5, expr: 'shock', blink: idleBlink(t, 5) }} shadow={0} />
    </g>
    <PopWord t={t} at={14} x={960} y={200} text="WHO WOKE UP?" size={110} fill="#FFD23A" hold={len} rot={-2} />
  </g>
);

// ---------------------------------------------------------------- S12–S16: is any of this real?
const RealBg: React.FC<{ t: number; children?: React.ReactNode }> = ({ t, children }) => (
  <g>
    <Soft blur={16} dim={0.5}>
      <g transform={camT(960, 520, 1.1)}><FutureCity t={t + 400} id="rb" mode="dusk" deck={false} /></g>
    </Soft>
    {children}
  </g>
);
export const S12: React.FC<ShotProps> = ({ t }) => (
  <RealBg t={t}>
    <g transform={`translate(960 520) scale(${backOut(clamp(t / 9))})`}>
      <Big x={0} y={0} size={120} fill="#FFFFFF">IS ANY OF THIS</Big>
      <Big x={0} y={140} size={150} fill="#5BE08A">REAL?</Big>
    </g>
  </RealBg>
);
const Germ: React.FC<{ x: number; y: number; r: number; c: string; t: number }> = ({ x, y, r, c, t }) => (
  <g transform={`translate(${x} ${y}) rotate(${t * 2})`}>
    {Array.from({ length: 10 }).map((_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return <g key={i}><path d={`M ${Math.cos(a) * r} ${Math.sin(a) * r} L ${Math.cos(a) * r * 1.35} ${Math.sin(a) * r * 1.35}`} stroke="#0B0816" strokeWidth={6} /><circle cx={Math.cos(a) * r * 1.4} cy={Math.sin(a) * r * 1.4} r={r * 0.12} fill={c} stroke="#0B0816" strokeWidth={4} /></g>;
    })}
    <circle r={r} fill={c} stroke="#0B0816" strokeWidth={7} />
  </g>
);
export const S13: React.FC<ShotProps> = ({ t }) => {
  const cols = ['#5BE08A', '#FFD23A', '#FF8A4A', '#FF5A8A', '#9A7AF0'];
  return (
    <RealBg t={t}>
      {cols.map((c, i) => (
        <g key={i} opacity={clamp((t - i * 8) / 6)}>
          <Germ x={360 + i * 300} y={440} r={70} c={c} t={t} />
          <text x={360 + i * 300} y={590} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FFFFFF">{`${2026 + i * 200}`}</text>
        </g>
      ))}
      <RealTag x={960} y={800} t={t} at={10} text="Viruses change faster than immunity" />
    </RealBg>
  );
};
export const S14: React.FC<ShotProps> = ({ t }) => (
  <RealBg t={t}>
    <g opacity={clamp(t / 8)}>
      <text x={560} y={420} textAnchor="middle" fontFamily={FONT.hand} fontSize={110} fill="#F2C84A">Hwæt!</text>
      <text x={560} y={500} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#C8CED6">ENGLISH, YEAR 1000</text>
    </g>
    <g opacity={clamp((t - 12) / 8)}>
      <text x={1360} y={420} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFFFFF">Listen!</text>
      <text x={1360} y={500} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#C8CED6">ENGLISH, TODAY</text>
    </g>
    <path d="M 860 400 L 1060 400" stroke="#4AE8FF" strokeWidth={8} markerEnd="" opacity={clamp((t - 8) / 6)} />
    <path d="M 1030 375 L 1062 400 L 1030 425" stroke="#4AE8FF" strokeWidth={8} fill="none" opacity={clamp((t - 8) / 6)} />
    <RealTag x={960} y={800} t={t} at={18} text="1,000 years makes English hard to read" />
  </RealBg>
);
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const rows = 6;
  return (
    <RealBg t={t}>
      {Array.from({ length: rows }).map((_, r) => {
        const n = 2 ** r;
        const show = clamp((t - r * 5) / 5);
        return Array.from({ length: n }).map((__, i) => (
          <circle key={`${r}-${i}`} cx={960 + (i - (n - 1) / 2) * (1500 / Math.max(n, 2)) * (r === 0 ? 0 : 1)} cy={160 + r * 90} r={Math.max(6, 26 - r * 4)} fill={r === 0 ? '#FF8A2A' : '#4AE8FF'} opacity={show} />
        ));
      })}
      <g transform={`translate(960 ${720}) scale(${backOut(clamp((t - 30) / 9))})`}>
        <Big x={0} y={0} size={100} fill="#FFD23A">2³² = 4,294,967,296</Big>
      </g>
      <RealTag x={960} y={880} t={t} at={36} text="32 generations: nearly everyone is family" />
    </RealBg>
  );
};
export const S16: React.FC<ShotProps> = ({ t }) => (
  <RealBg t={t}>
    <g transform={`translate(960 520) scale(${backOut(clamp(t / 9))})`}>
      <rect x={-520} y={-120} width={1040} height={240} rx={30} fill="#F6EFE3" stroke="#0B0816" strokeWidth={8} />
      <text x={0} y={-20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#1A1A22">SOURCES</text>
      <text x={0} y={60} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#3A3E4A">in the description ↓</text>
    </g>
  </RealBg>
);

// ---------------------------------------------------------------- S17: what would you do first?
export const S17 = scene({
  Set: (p) => <FutureCity {...p} mode="day" />, words: W, cam: [960, 560, 1.3], cam1: [960, 560, 1.4],
  cast: [
    { look: MO7, x: 700, yaw: 0.4, faces: [[0, 'happy']], light: false },
    { look: YOU, x: 960, yaw: 0.1, faces: [[0, 'neutral'], [20, 'smug']], pose: (t) => ({ armR: { a: 40, b: -100 }, headTilt: Math.sin(t / 15) * 4 }) },
  ],
  vee: { x: 1200, y: GROUND - 330, s: 0.6, mood: 'happy', look: -0.4 },
  over: (t) => <PopWord t={t} at={10} x={960} y={200} text="WHAT WOULD YOU DO FIRST?" size={80} fill="#FFFFFF" hold={400} rot={-2} />,
});

// ---------------------------------------------------------------- S18: comment, subscribe, part two
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const press = t > 60 && t < 70;
  const subbed = t >= 66;
  return (
    <g>
      <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
        <FutureCity t={t + 500} id="end" mode="dusk" deck={false} />
      </g>
      <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.45} />
      <g transform={`translate(1100 300) scale(${backOut(clamp(t / 9))})`}>
        <Big x={0} y={0} size={130} fill="#FFD23A">PART 2</Big>
        <text x={0} y={80} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={6} fill="#4AE8FF">THE COPY</text>
      </g>
      <g transform={`translate(820 640) scale(${backOut(clamp((t - 14) / 9))})`}>
        <rect x={-230} y={-60} width={460} height={120} rx={60} fill="#F6EFE3" stroke="#0B0816" strokeWidth={6} />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#1A1A22">💬 COMMENT</text>
      </g>
      <g transform={`translate(1360 640) scale(${backOut(clamp((t - 26) / 9)) * (press ? 0.92 : 1)})`}>
        <rect x={-260} y={-60} width={520} height={120} rx={60} fill={subbed ? '#3A3E4A' : '#E8322A'} stroke="#0B0816" strokeWidth={6} />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#FFFFFF">{subbed ? 'SUBSCRIBED ✓' : 'SUBSCRIBE'}</text>
      </g>
      <g transform={`translate(${kf(t, [[30, 1800], [60, 1400]])} ${kf(t, [[30, 1000], [60, 670]])})`} opacity={clamp((t - 30) / 6)}>
        <path d="M 0 0 L 0 70 L 18 54 L 32 84 L 44 78 L 30 50 L 54 50 Z" fill="#FFFFFF" stroke="#0B0816" strokeWidth={5} />
      </g>
      <Vee x={1720} y={880} s={0.7} t={t} mood="happy" look={-0.5} />
      <Hero look={YOU} pose={{ ...basePose, x: 260, y: 980, scale: 1.4, yaw: 0.4, look: 0.4, expr: 'smug', blink: idleBlink(t, 9) }} shadow={0} />
    </g>
  );
};
