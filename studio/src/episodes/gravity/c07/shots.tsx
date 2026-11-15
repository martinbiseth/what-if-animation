import React from 'react';
import {
  basePose, kf, camT, clamp, easeOut, easeIn, backOut, ShotProps, FONT, rnd, Schematic, SCH, SchLabel, DuskSky, Skyline, Haze, LOOKS, Pose, Look,
} from '../../../engine';
import { YOU, MOM, ELLIE, PATEL, NEIGHBOR, wordF, Body, Dog, PoolYard, PoolFront, YARD, bigWord, gCard, doublingShot, shk, WallDial } from '../common';
import words from './words.json';

// Chapter 7, the top of the hour: 9:00, 8 g. The whole street floats in Mr. Patel's pool with only their faces out.
// A plane you can barely see lands on the highway. 9:59: Ellie squeezes your hand; 16 g is coming. 10:00: gravity
// doesn't double, it disappears. The water lifts out of the pool as one wobbling bubble with all of you inside, up
// past the roof and the trees, and down the street the ocean starts to rise. Then what's real, the comment ask, PART 2.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const Y: React.FC<{ t: number; id?: string }> = ({ t, id }) => <PoolYard t={t} id={id} broken={0.9} dusk={0.2} />;
const lv = YARD.poolY0 + 30;
const S = 0.62;

/** Someone floating upright in the pool with only the head out: x, a bob phase, a scale. */
const floater = (x: number, ph: number, t: number, s = S, o: Partial<Pose> = {}): Pose => ({
  ...basePose,
  x,
  y: lv + 118 + Math.sin(t / 10 + ph) * 5,
  scale: s,
  yaw: Math.sin(ph) * 0.3,
  armL: { a: 70, b: -20 },
  armR: { a: 70, b: -20 },
  sway: 0,
  ...o,
});

// ---------- S1: 9:00. 8G ----------
export const S1 = gCard({ g: '8G', clock: '9:00', color: '#FF4A3A', Bg: Y });

// ---------- S2: close: in the water you can breathe. Barely ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(820, lv - 20, kf(t, [[0, 3.2], [len, 3.5]]))}>
    <Y t={t + 60} />
    <Body look={YOU} pose={floater(820, 1, t, S, { squash: 0.04 * Math.max(0, Math.sin(t / 8)) })} t={t} faces={[[0, 'tired']]} />
    <PoolFront t={t} />
  </g>
);

// ---------- S21: Mom, Ellie, Mr. Patel, Biscuit, you, faces out, staring at the sky ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 980]]), lv - 40, kf(t, [[0, 2.0], [len, 2.25]]))}>
    <Y t={t + 100} />
    <Body look={MOM} pose={floater(640, 0, t)} t={t} faces={[[0, 'tired']]} seed={3} />
    <Body look={YOU} pose={floater(820, 1, t)} t={t} faces={[[0, 'tired']]} />
    <Body look={ELLIE} pose={floater(960, 2, t, S * 0.7, { y: lv + 108 + Math.sin(t / 10 + 2) * 5 })} t={t} faces={[[0, 'worried']]} seed={5} />
    <Body look={PATEL} pose={floater(1140, 3, t)} t={t} faces={[[0, 'tired']]} seed={7} />
    <Dog x={1300} y={lv + 34 + Math.sin(t / 9) * 4} s={0.34} t={t} look={-0.4} />
    <PoolFront t={t} />
  </g>
);

// ---------- S3: wider: the whole street is in that pool. Nobody talks ----------
const CROWD: [Look, number, number][] = [
  [NEIGHBOR, 600, 0.55], [LOOKS.worker, 700, 0.5], [MOM, 800, 0.62], [YOU, 900, 0.62], [ELLIE, 990, 0.44], [PATEL, 1080, 0.6],
  [LOOKS.suit26, 1180, 0.58], [NEIGHBOR, 1280, 0.52], [LOOKS.worker, 1380, 0.56], [LOOKS.suit26, 1470, 0.5],
];
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1040, lv - 120, kf(t, [[0, 1.45], [len, 1.55]]))}>
    <Y t={t + 200} />
    {CROWD.map(([look, x, s], i) => (
      <Body key={i} look={look} pose={floater(x, i * 1.7, t, s, { y: lv + 190 * s + Math.sin(t / 10 + i) * 4 })} t={t} faces={[[0, i % 3 === 0 ? 'worried' : 'tired']]} seed={i + 11} />
    ))}
    <PoolFront t={t} />
  </g>
);

/** An airliner in profile facing right, x y its centre. */
const Airliner: React.FC<{ x: number; y: number; s?: number; rot?: number; gear?: boolean }> = ({ x, y, s = 1, rot = 0, gear = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -300 -10 Q -300 -40 -250 -40 L 240 -40 Q 320 -36 330 0 Q 320 30 240 30 L -260 30 Q -300 30 -300 -10 Z" fill="#E9EEF4" stroke="#1A1E28" strokeWidth={6} />
    <path d="M -240 -40 L -300 -140 L -250 -140 L -170 -40 Z" fill="#3A6AA8" stroke="#1A1E28" strokeWidth={6} />
    <path d="M -40 10 L -140 120 L -90 120 L 60 10 Z" fill="#C9D2DE" stroke="#1A1E28" strokeWidth={6} />
    {gear ? <path d="M -60 30 L -60 70 M 160 30 L 160 66" stroke="#1A1E28" strokeWidth={10} /> : null}
  </g>
);

// ---------- S4: high above, a plane you can barely see comes down, slow and careful, onto the highway. It makes it ----------
export const S4: React.FC<ShotProps> = ({ t, len, f }) => {
  const land = rel(f, t, 'makes');
  const k = easeOut(clamp(t / Math.max(1, land)));
  const x = 300 + 1000 * k;
  const y = 260 + 560 * k;
  const roll = t > land ? (t - land) * 4 : 0;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1150]]), kf(t, [[0, 500], [len, 640]]), kf(t, [[0, 1.0], [len, 1.25]]))}>
      <DuskSky id="c7sky" horizonY={880} red={0.35} />
      <Skyline y={900} seed={9} color="#4A3A60" h={110} />
      <Haze y={800} o={0.3} />
      <rect x={-400} y={880} width={2800} height={300} fill="#3A3448" />
      <rect x={-400} y={850} width={2800} height={44} fill="#55505E" stroke="#22202A" strokeWidth={4} />
      {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-380 + i * 100} y={869} width={50} height={6} fill="#E9E2D2" opacity={0.7} />)}
      {Array.from({ length: 6 }).map((_, i) => <circle key={i} cx={200 + i * 260} cy={872} r={8} fill={i % 2 ? '#FF4A3A' : '#FFE9A8'} opacity={0.4 + 0.4 * Math.sin(t / 6 + i)} />)}
      <Airliner x={x + roll} y={Math.min(y, 822)} s={0.3} rot={t < land ? 8 * (1 - k) : 0} gear={k > 0.6} />
      {t > land && t < land + 30 ? <ellipse cx={x + roll - 80} cy={846} rx={30 + (t - land) * 3} ry={10} fill="#E9E2D2" opacity={0.6 * (1 - (t - land) / 30)} /> : null}
    </g>
  );
};

// ---------- S5: Mr. Patel lets out a breath he's been holding for an hour ----------
export const S5: React.FC<ShotProps> = ({ t, len, f }) => {
  const b = rel(f, t, 'lets');
  return (
    <g transform={camT(1140, lv - 30, kf(t, [[0, 3.0], [len, 3.2]]))}>
      <Y t={t + 300} />
      <Body look={PATEL} pose={floater(1140, 3, t)} t={t} faces={[[0, 'worried'], [b + 4, 'happy']]} seed={7} />
      {t > b && t < b + 40 ? (
        <g opacity={1 - (t - b) / 40}>
          {[0, 1, 2].map((i) => <circle key={i} cx={1190 + (t - b) * 1.2 + i * 14} cy={lv - 40 - i * 10 - (t - b) * 0.4} r={8 + i * 5 + (t - b) * 0.2} fill="#F6EFE3" opacity={0.5} />)}
        </g>
      ) : null}
      <PoolFront t={t} />
    </g>
  );
};

// ---------- S6: 9:59 ----------
export const S6 = bigWord({ kicker: 'ONE MINUTE', word: '9:59', color: '#FF4A3A', Bg: Y, size: 260 });

// ---------- S7: Ellie squeezes your hand under the water ----------
export const S7: React.FC<ShotProps> = ({ t, len, f }) => {
  const sq = rel(f, t, 'squeezes');
  const ring = t > sq ? clamp(1 - (t - sq) / 16) : 0;
  return (
    <g transform={camT(890, lv + 10, kf(t, [[0, 2.8], [len, 3.0]]))}>
      <Y t={t + 400} />
      <Body look={YOU} pose={floater(820, 1, t, S, { yaw: 0.35, armR: { a: 40, b: -10 } })} t={t} faces={[[0, 'tired'], [sq + 6, 'worried']]} />
      <Body look={ELLIE} pose={floater(960, 2, t, S * 0.7, { y: lv + 108, yaw: -0.4, armL: { a: 40, b: -10 } })} t={t} faces={[[0, 'worried']]} seed={5} />
      <PoolFront t={t} />
      {ring > 0 ? <circle cx={895} cy={lv + 80} r={20 + 30 * (1 - ring)} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={ring} /> : null}
    </g>
  );
};

// ---------- S8: sixteen g is coming: the ladder, 16G lit ----------
export const S8 = doublingShot({ lit: 4, at: [0, 0, 0, 0, 4] });

// ---------- S9: ten o'clock: the clock on Patel's wall ticks to 10 ----------
export const S9: React.FC<ShotProps> = ({ t }) => {
  const mm = t < 10 ? 59.5 + t * 0.05 : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2238" />
      <g transform={`${shk(t, 10, 8, 12)}`}>
        <WallDial x={960} y={540} r={300} hh={t < 10 ? 9 : 10} mm={mm} red={t >= 10 ? 1 : 0} />
      </g>
    </g>
  );
};

// ---------- S10: and gravity doesn't double ----------
export const S10 = bigWord({ kicker: '10:00', word: "DOESN'T DOUBLE", color: '#FFD23A', Bg: Y, size: 150 });

// ---------- S11: it disappears: 0G ----------
export const S11 = gCard({ g: '0G', clock: '10:00', color: '#7FD4FF', Bg: Y });

/** The pool's water as one wobbling bubble at cx, cy, with everyone inside it, turning slowly. */
const Bubble: React.FC<{ cx: number; cy: number; t: number; s?: number }> = ({ cx, cy, t, s = 1 }) => {
  const wob = (i: number) => Math.sin(t / 7 + i * 1.3) * 10;
  const rx = 520 * s;
  const ry = 300 * s;
  const d = `M ${cx - rx} ${cy} Q ${cx - rx - wob(1)} ${cy - ry} ${cx} ${cy - ry - wob(2)} Q ${cx + rx + wob(3)} ${cy - ry} ${cx + rx} ${cy} Q ${cx + rx - wob(4)} ${cy + ry} ${cx} ${cy + ry + wob(5)} Q ${cx - rx + wob(6)} ${cy + ry} ${cx - rx} ${cy} Z`;
  const ppl: [Look, number, number, number, string][] = [
    [MOM, -260, -20, 0.62, 'shock'], [YOU, -60, 30, 0.62, 'shock'], [ELLIE, 120, -10, 0.44, 'happy'], [PATEL, 300, 40, 0.6, 'shock'],
  ];
  return (
    <g>
      <path d={d} fill="#5EC0E0" opacity={0.75} />
      {ppl.map(([look, dx, dy, sc, e], i) => (
        <Body key={i} look={look} t={t} faces={[[0, e as never]]} seed={i + 3}
          pose={{ ...basePose, x: cx + dx * s, y: cy + dy * s + 120 * sc * s + Math.sin(t / 12 + i) * 10, scale: sc * s, spin: Math.sin(t / 30 + i) * 30 + i * 15, armL: { a: 120, b: -30 }, armR: { a: 130, b: -20 }, legL: { a: 20, b: 10 }, legR: { a: -20, b: 10 }, sway: 0 }} />
      ))}
      <Dog x={cx + 200 * s} y={cy - 120 * s + Math.sin(t / 9) * 8} s={0.3 * s} t={t} flip />
      <path d={d} fill="#BFEFFF" opacity={0.22} stroke="#DFF7FF" strokeWidth={8} />
      {Array.from({ length: 12 }).map((_, i) => (
        <circle key={i} cx={cx + (rnd(5, i) - 0.5) * rx * 1.6} cy={cy + (rnd(6, i) - 0.5) * ry * 1.4 - ((t * 1.5 + i * 20) % 120)} r={5 + rnd(7, i) * 9} fill="#FFFFFF" opacity={0.5} />
      ))}
      <path d={`M ${cx - rx * 0.6} ${cy - ry * 0.55} q ${rx * 0.3} ${-ry * 0.25} ${rx * 0.6} ${-ry * 0.2}`} stroke="#FFFFFF" strokeWidth={10} fill="none" opacity={0.6} strokeLinecap="round" />
    </g>
  );
};

// ---------- S12: the water lifts out of the pool like a giant wobbling bubble ----------
export const S12: React.FC<ShotProps> = ({ t, len, f }) => {
  const up = rel(f, t, 'lifts');
  const k = easeIn(clamp((t - up) / 40));
  return (
    <g transform={camT(1040, kf(t, [[0, 640], [len, 520]]), kf(t, [[0, 1.2], [len, 1.1]]))}>
      <PoolYard t={t + 500} broken={0.9} dusk={0.2} lift={t >= up ? 3 : 0} />
      {t < up ? (
        <g>
          {CROWD.slice(2, 6).map(([look, x, s], i) => <Body key={i} look={look} pose={floater(x, i, t, s, { y: lv + 190 * s })} t={t} faces={[[0, 'tired']]} seed={i + 11} />)}
          <PoolFront t={t} />
        </g>
      ) : (
        <Bubble cx={1040} cy={lv - 40 - 420 * k} t={t} s={0.9 + 0.1 * k} />
      )}
    </g>
  );
};

/** Two round trees, drawn at the yard's scale. */
const Tree: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-22} y={-260} width={44} height={260} fill="#5A3E2A" stroke="#2A1E18" strokeWidth={6} />
    <circle cx={0} cy={-330} r={150} fill="#3E7A3A" stroke="#1E3A1E" strokeWidth={6} />
    <circle cx={-90} cy={-260} r={90} fill="#4A8A44" stroke="#1E3A1E" strokeWidth={6} />
    <circle cx={90} cy={-270} r={100} fill="#4A8A44" stroke="#1E3A1E" strokeWidth={6} />
  </g>
);

// ---------- S13/S14: floating up inside it: past the roof, past the trees. The world sinks away below ----------
const rise = (from: number, to: number): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const k = kf(t, [[0, from], [len, to]]);
    return (
      <g>
        <DuskSky id="c7up" horizonY={1400} red={0.25} />
        <g transform={`translate(0 ${k}) translate(960 540) scale(0.8) translate(-960 -540)`}>
          <PoolYard t={t + 600} broken={0.9} dusk={0.2} lift={4} />
          <Tree x={-60} y={YARD.lawn + 10} s={1.3} />
          <Tree x={1980} y={YARD.lawn + 10} s={1.4} />
        </g>
        <Bubble cx={960} cy={520 + Math.sin(t / 20) * 10} t={t} s={0.85} />
      </g>
    );
  };
  return Shot;
};
export const S13 = rise(0, 300);
export const S14 = rise(300, 1100);

// ---------- S15: down the street, the whole ocean is starting to rise ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeIn(clamp(t / Math.max(1, len)));
  const h = 120 + 380 * k;
  const wob = (i: number) => Math.sin(t / 8 + i) * 12;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.15], [len, 1.0]]))}>
      <DuskSky id="c7sea" horizonY={760} red={0.4} />
      <path d={`M -200 760 Q 400 ${760 - h * 0.4 + wob(1)} 960 ${760 - h + wob(2)} Q 1520 ${760 - h * 0.4 + wob(3)} 2120 760 L 2120 1080 L -200 1080 Z`} fill="#2E6A9A" stroke="#BFEFFF" strokeWidth={6} />
      {Array.from({ length: 10 }).map((_, i) => (
        <circle key={i} cx={300 + i * 140 + Math.sin(i) * 40} cy={760 - h * 0.8 - ((t * 2 + i * 37) % 300)} r={6 + (i % 3) * 5} fill="#BFEFFF" opacity={0.6} />
      ))}
      <Skyline y={920} seed={3} color="#2A2238" h={150} />
      <rect x={-200} y={920} width={2320} height={200} fill="#1E1A28" />
      {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-100 + i * 150} y={860} width={20} height={14} fill="#FFE9A8" opacity={0.6} />)}
    </g>
  );
};

// ---------- S16: is any of this real? The physics is ----------
export const S16: React.FC<ShotProps> = ({ t, f }) => {
  const rows: [string, string, number][] = [
    ['BLOOD WEIGHS MORE AS G GROWS', 'REAL', rel(f, t, 'blood')],
    ['PILOTS BLACK OUT AT A FEW G', '3–4 G', rel(f, t, 'Pilots')],
    ['WATER PUSHES BACK HARDER', 'REAL', rel(f, t, 'push')],
  ];
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [330, 1.08]]))}>
      <Schematic t={t} id="c7real" />
      <SchLabel x={960} y={200} t={t - 2} text="THE PHYSICS IS" size={56} color={SCH.live} />
      {rows.map(([name, tag, a], i) => {
        const k = clamp((t - a) / 6);
        return (
          <g key={name} opacity={k} transform={`translate(${300 + (1 - k) * -40} ${380 + i * 170})`}>
            <path d="M 0 -6 l 16 18 l 34 -40" stroke={SCH.live} strokeWidth={10} fill="none" strokeLinecap="round" opacity={clamp((t - a - 6) / 4)} />
            <text x={90} y={14} fontFamily={FONT.ui} fontSize={50} fill={SCH.line}>{name}</text>
            <text x={1320} y={14} textAnchor="end" fontFamily={FONT.ui} fontSize={50} fill={SCH.glow}>{tag}</text>
          </g>
        );
      })}
      <SchLabel x={960} y={940} t={t - rel(f, t, 'sources')} text="SOURCES IN THE DESCRIPTION" size={38} />
    </g>
  );
};

// ---------- S20: is any of this real? The physics is ----------
export const S20 = bigWord({ kicker: 'IS ANY OF THIS', word: 'REAL?', color: '#7FD4FF', size: 240 });

// ---------- S17: but who flipped the switch? ----------
export const S17 = bigWord({ kicker: 'BUT WHO FLIPPED', word: 'THE SWITCH?', color: '#FFD23A', size: 190 });

// ---------- S18: tell me your theory in the comments ----------
export const S18 = bigWord({ kicker: 'YOUR THEORY', word: 'IN THE COMMENTS', color: '#FF8A3D', size: 150 });

// ---------- S19: end card: the bubble high in the sky, PART 2, subscribe ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <DuskSky id="c7end" horizonY={1400} red={0.3} />
      <Bubble cx={960} cy={650 + Math.sin(t / 20) * 10} t={t} s={0.55} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
    <text x={960} y={220} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 8)}>WHAT HAPPENS WITH NO GRAVITY?</text>
    <g transform={`translate(960 400) scale(${backOut(clamp((t - 8) / 10))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={200} fill="#7FD4FF" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">PART 2</text>
    </g>
    <g transform={`translate(960 900) scale(${backOut(clamp((t - 24) / 10))})`}>
      <rect x={-230} y={-56} width={460} height={112} rx={20} fill="#E8302A" />
      <text y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#FFFFFF">SUBSCRIBE</text>
    </g>
  </g>
);
