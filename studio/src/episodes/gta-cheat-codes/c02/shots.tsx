import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, FONT, Glow, LEG_LEN, stepTop, BookFlat, rnd, bedSit, BEDROOM } from '../../../engine';
import { YOU, BedSet, StairSet, faceCU, ctrlCU, listCU, scene, fig, codeCard, propCU, Controller, CheatText, CHEAT, CodeList } from '../common';

// Chapter 2, the rules: Saturday, the controller that plugs into nothing, the first code, CHEAT ACTIVATED, the fork,
// the dictionary, the stairs on purpose, and the three rules on the back of the list.

export const S1 = codeCard({ kicker: 'SATURDAY', title: 'THE RULES', seed: 4 });

// ---------- S2: you on the bed turn the controller over: no cable, no batteries ----------
export const S2 = scene({
  Set: BedSet, cam: [[760, 560, 1.7], [780, 560, 1.85]],
  draw: (t) => {
    const flip = Math.sin(t / 14);
    return (
      <g>
        {fig(YOU, t, { x: 700, y: 640, yaw: 0.4, look: 0.5, armL: { a: 40, b: -90 }, armR: { a: 40, b: -90 }, legL: { a: 80, b: -80 }, legR: { a: 76, b: -84 } }, [[0, 'neutral'], [60, 'worried']])}
        <g transform={`translate(760 560) scale(${flip} 1) translate(-760 -560)`}>
          <Controller x={760} y={560} s={0.25} />
        </g>
        {/* the empty battery hatch: a question mark */}
        {t > 60 ? <text x={860} y={460} fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFE27A" stroke="#1A1018" strokeWidth={8} paintOrder="stroke" opacity={clamp((t - 60) / 6)}>?</text> : null}
      </g>
    );
  },
});

// ---------- S3: the first code, read off the list ----------
export const S3 = ctrlCU({ Bg: BedSet, seq: [[30, 'r'], [40, 'r'], [50, 'up'], [60, 'g'], [70, 'b']], glow: (t) => kf(t, [[70, 0], [100, 0.8]]) });

// ---------- S4: something chimes: a glow in front of your face, letters forming ----------
export const S4 = faceCU({
  look: YOU, Bg: BedSet, faces: [[0, 'neutral'], [20, 'shock']], yaw: 0.05, zoom: [2.4, 2.7], glint: 1, glintColor: CHEAT.glow,
  front: (t) => (
    <g>
      <Glow x={960} y={300} r={600} kind="cool" o={clamp(t / 20) * 0.7} />
      {Array.from({ length: 30 }).map((_, i) => {
        const k = clamp((t - i * 2) / 60);
        return <rect key={i} x={460 + rnd(1, i) * 1000} y={kf(k, [[0, 900], [1, 200 + rnd(2, i) * 120]])} width={22} height={22} fill={CHEAT.glow} opacity={0.8 * (1 - Math.abs(k - 0.5))} />;
      })}
    </g>
  ),
});
export const S4b = faceCU({
  look: YOU, Bg: BedSet, faces: [[0, 'shock'], [30, 'happy']], yaw: 0.05, zoom: [2.2, 2.3], glint: 1, glintColor: CHEAT.glow,
  front: (t) => <CheatText x={960} y={260} p={t + 2} name="INVINCIBLE" s={0.95} />,
});

// ---------- S5: a fork to the arm. Nothing ----------
export const S5 = propCU({
  Bg: BedSet,
  draw: (t) => {
    const jab = kf(t, [[6, 0], [14, 1], [20, 1], [28, 0.6]]);
    return (
      <g>
        {/* your forearm across the frame */}
        <path d="M -100 640 L 1300 560 L 1310 700 L -100 800 Z" fill="#F07A2A" stroke="#1A1018" strokeWidth={8} />
        <path d="M 1300 560 Q 1500 540 1560 620 Q 1560 720 1310 700 Z" fill="#1A1620" />
        {/* the fork, from above */}
        <g transform={`translate(${900} ${kf(jab, [[0, 200], [1, 560]], (x) => x)}) rotate(20)`}>
          <rect x={-14} y={-420} width={28} height={330} rx={12} fill="#C8CCD6" stroke="#22242C" strokeWidth={5} />
          {[-24, -8, 8, 24].map((dx) => <rect key={dx} x={dx - 4} y={-90} width={8} height={90} fill="#C8CCD6" stroke="#22242C" strokeWidth={3} />)}
        </g>
        {t > 22 ? (
          <text x={960} y={920} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" transform={`translate(960 900) scale(${backOut(clamp((t - 22) / 8))}) translate(-960 -900)`}>
            NOTHING.
          </text>
        ) : null}
      </g>
    );
  },
});

// ---------- S6: a dictionary on your foot. Not even a red mark ----------
export const S6 = scene({
  Set: BedSet, cam: [[1180, 700, 2.2], [1180, 700, 2.3]], setT: 300,
  draw: (t) => {
    const fall = clamp((t - 4) / 10);
    const y = kf(fall, [[0, 300], [1, 818]], (x) => x * x);
    return (
      <g>
        {fig(YOU, t, { x: 1150, y: 818 - LEG_LEN, yaw: 0.2, look: 0.3, headTilt: 10, armL: { a: 20, b: -20 }, armR: { a: 20, b: -20 } }, [[0, 'worried'], [20, 'oops'], [40, 'happy']])}
        <g transform={`translate(1200 ${y}) rotate(${fall < 1 ? t * 12 : 8})`}>
          <rect x={-90} y={-60} width={180} height={60} rx={6} fill="#8A2A2A" stroke="#2A1010" strokeWidth={6} />
          <rect x={-80} y={-18} width={160} height={12} fill="#F2E8D0" />
          <text x={0} y={-28} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={24} fill="#F2C14E">DICTIONARY</text>
        </g>
      </g>
    );
  },
});

// ---------- S7: down all fourteen stairs, on purpose, arms out ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 16) / 70);
  const x = 470 + k * 1000;
  const hop = Math.abs(Math.sin(k * Math.PI * 5)) * 50;
  const ground = stepTop(x) - LEG_LEN * 0.8;
  const pose: Pose = {
    ...basePose, x, y: t < 16 ? ground - kf(t, [[0, 0], [12, 80]]) : ground - hop + 40 * Math.min(1, k * 4), scale: 0.8, spin: k * 1080, expr: k > 0.98 ? 'cool' : 'happy',
    armL: { a: 150, b: 0 }, armR: { a: 150, b: 0 }, legL: { a: 10, b: 0 }, legR: { a: -10, b: 0 },
  };
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 1080]]), 600, 1.05)}>
      <StairSet t={t + 300} id="s7" />
      <Hero look={YOU} pose={pose} />
    </g>
  );
};

// ---------- S8..S11: the rules on the back ----------
export const S8 = listCU({ Bg: BedSet, back: true });
const rule = (n: number, lines: string[], red = false): React.FC<ShotProps> => {
  const R: React.FC<ShotProps> = ({ t, len }) => (
    <g>
      <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.06]]))} opacity={0.35} filter="url(#blur10)">
        <rect x={-200} y={-200} width={2400} height={1500} fill="#2A2418" />
        <CodeList x={960} y={560} s={1.4} back rot={-2} />
      </g>
      <rect width={1920} height={1080} fill="#14100C" opacity={0.45} />
      <g transform={`translate(960 330) scale(${backOut(clamp(t / 9))})`}>
        <circle r={110} fill={red ? '#C81A1A' : '#EADFB4'} stroke="#2A2418" strokeWidth={8} />
        <text y={44} textAnchor="middle" fontFamily="Kalam, cursive" fontWeight={700} fontSize={130} fill={red ? '#FFFFFF' : '#2A2418'}>{n}</text>
      </g>
      {lines.map((l, i) => (
        <text key={i} x={960} y={600 + i * 110} textAnchor="middle" fontFamily="Kalam, cursive" fontWeight={700} fontSize={92} fill={red ? '#FF6A5A' : '#F6EFE3'} opacity={clamp((t - 6 - i * 6) / 6)}>
          {l}
        </text>
      ))}
    </g>
  );
  return R;
};
export const S9 = rule(1, ['A cheat stays on until', 'you enter it again.']);
export const S10 = rule(2, ['Nobody else can', 'see the letters.']);
export const S11 = rule(3, ['NEVER enter', 'the last code.'], true);

// ---------- S12: the scribbles, a word under them ----------
export const S12 = listCU({ Bg: BedSet, focus: 'bottom', reveal: (t) => 0.15 + 0.1 * Math.sin(t / 10) });
