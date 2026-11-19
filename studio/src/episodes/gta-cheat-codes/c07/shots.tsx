import React from 'react';
import { Hero, basePose, kf, camT, clamp, backOut, ShotProps, FONT, Glow, LEG_LEN, stepTop, SUBURB, Suburb, Pose, DaySky } from '../../../engine';
import {
  YOU, SUIT, ELLIE, AGENT, STRANGER, StairSet, BedSet, faceCU, scene, fig, propCU, textCard, Controller, CheatText, CHEAT, OUR_DOOR, ROAD, SetC,
  SportsCar, Helicopter, SatVan, CodeField, CodeList, listCard,
} from '../common';
import { Bird, PauseScreen } from '../kit';

// Chapter 7, game paused: silence; Ellie, the man's hand and a bird stop mid-move; GAME PAUSED; across the street a door
// opens and someone with the same controller looks up and waves. Then "Is any of this real?", the comment ask and
// the series end card.

const Frozen: SetC = ({ t, id }) => <Suburb t={0} id={id} tod="dusk" cars={false} windowsLit={0.7} />;
const standY = (s = 1) => SUBURB.feet - LEG_LEN * s;
/** Desaturate whatever is under it a little, and frame it with the pause border. */
const Paused: React.FC<{ p: number }> = ({ p }) => (
  <g>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#7A8AA0" opacity={0.18 * clamp(p / 10)} style={{ mixBlendMode: 'saturation' }} />
    <PauseScreen p={p} />
  </g>
);
const EP = { ...ELLIE, jacket: '#B8A8E8', jacketShade: '#9A8AC8' };

// ---------- S1: no chime; silence ----------
export const S1 = faceCU({ look: YOU, Bg: BedSet, faces: [[0, 'worried'], [40, 'shock']], yaw: 0, zoom: [2.8, 3.2], front: (t) => <Paused p={t - 30} /> });

// ---------- S2: Ellie stops mid-word ----------
export const S2 = scene({
  Set: ({ t, id }) => <StairSet t={500} id={id} />, cam: [[700, 520, 2.0], [700, 520, 2.15]],
  draw: () => fig(EP, 0, { x: 700, y: stepTop(700) - LEG_LEN * 0.7, scale: 0.7, yaw: 0.6, look: 0.7, headTilt: -8, armR: { a: 60, b: -40 } }, [[0, 'shock']], 3, 0.8),
  front: (t) => <Paused p={t + 20} />,
});

// ---------- S3: the man's hand stops on the handle ----------
export const S3 = propCU({
  bgColor: '#3A2E26',
  draw: (t) => (
    <g>
      <rect x={300} y={0} width={1320} height={1080} fill="#5A4A3A" />
      <rect x={1100} y={420} width={160} height={260} rx={20} fill="#B8A890" />
      <rect x={1110} y={532} width={140} height={36} rx={18} fill="#C8A040" stroke="#5A4010" strokeWidth={5} />
      <path d="M 1900 700 Q 1500 650 1260 560" stroke="#3A3E4A" strokeWidth={110} fill="none" strokeLinecap="round" />
      <ellipse cx={1220} cy={555} rx={70} ry={58} fill="#1A1620" />
      <Paused p={t + 20} />
    </g>
  ),
});

// ---------- S4: outside, a bird hangs in the air ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <DaySky id="s4" horizonY={900} tod="dusk" />
      <Bird x={1300} y={330} s={1.5} flap={1.2} />
      {[0, 1, 2].map((i) => <circle key={i} cx={400 + i * 600} cy={760} r={4} fill="#FFFFFF" opacity={0.5} />)}
    </g>
    <path d="M 0 0 H 1920 V 1080 H 0 Z M 160 80 H 1760 V 1000 H 160 Z" fill="#3A3048" fillRule="evenodd" />
    <path d="M 960 80 V 1000 M 160 540 H 1760" stroke="#3A3048" strokeWidth={26} />
    <Paused p={t + 20} />
  </g>
);

// ---------- S5: the whole world, paused: the street with everyone stopped ----------
export const S5 = scene({
  Set: Frozen, cam: [[960, 540, 1.0], [960, 540, 1.05]],
  draw: () => (
    <g>
      {[0, 1, 2].map((i) => <SportsCar key={i} x={420 + i * 430} y={ROAD} s={0.6} color={['#E83A3A', '#3A8AF0', '#F07AB8'][i]} />)}
      <SatVan x={1500} y={ROAD + 230} s={0.8} />
      <Helicopter x={1300} y={150} s={0.8} t={1.7} beam={1} />
      {fig(AGENT, 0, { x: 300, y: standY(), yaw: 0.4 }, [[0, 'neutral']], 4)}
      {fig(AGENT, 0, { x: 1180, y: standY(), yaw: -0.4, legL: { a: 20, b: 0 }, legR: { a: -20, b: 0 } }, [[0, 'neutral']], 5)}
    </g>
  ),
  front: (t) => <Paused p={t + 20} />,
});

// ---------- S6: GAME PAUSED ----------
export const S6 = faceCU({
  look: YOU, Bg: BedSet, faces: [[0, 'shock']], yaw: 0, zoom: [2.3, 2.4], glint: 1, glintColor: CHEAT.glow,
  front: (t) => (
    <g>
      <Paused p={t + 20} />
      <CheatText x={960} y={240} p={t - 4} head="GAME PAUSED" s={1.05} />
    </g>
  ),
});

// ---------- S7: across the street, a front door opens ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const open = kf(t, [[6, 0], [30, 1]]);
  const dx = 1390 + 470 - 130; // house 16's door
  return (
    <g>
      <g transform={camT(dx - 200, 520, kf(t, [[0, 1.3], [len, 1.5]]))}>
        <Frozen t={0} id="s7" />
        <rect x={dx} y={SUBURB.feet - 280} width={90 * open} height={200} fill="#FFE8B0" />
        <Glow x={dx + 45} y={SUBURB.feet - 180} r={260 * open + 1} o={0.6} />
      </g>
      {/* your window frame in the foreground */}
      <path d="M -10 -10 H 1930 V 1090 H -10 Z M 120 60 H 1800 V 1020 H 120 Z" fill="#2A2234" fillRule="evenodd" />
      <Paused p={t + 20} />
    </g>
  );
};

// ---------- S7b: someone walks out, holding a controller exactly like yours ----------
export const S7b = scene({
  Set: Frozen, cam: [[1500, 520, 1.6], [1450, 520, 1.7]],
  draw: (t) => {
    const x = kf(t, [[0, 1780], [120, 1520]]);
    const pose: Pose = { ...basePose, x, y: standY(), yaw: -0.4, look: 0, expr: 'neutral', legL: { a: 20 * Math.sin(t / 6), b: -10 }, legR: { a: -20 * Math.sin(t / 6), b: -10 }, armR: { a: 40, b: -70 }, armL: { a: 40, b: -70 } };
    return (
      <g>
        <rect x={1730} y={SUBURB.feet - 280} width={90} height={200} fill="#FFE8B0" />
        <Hero look={STRANGER} pose={pose} />
        <Controller x={x} y={standY() - 50} s={0.16} glow={0.7} />
      </g>
    );
  },
  front: (t) => <Paused p={t + 20} />,
});

// ---------- S8: they look up at your window, and wave ----------
export const S8 = scene({
  Set: Frozen, cam: [[1520, 470, 2.4], [1520, 470, 2.5]],
  draw: (t) => (
    <g>
      {fig(STRANGER, t, { x: 1520, y: standY(), yaw: -0.1, look: 0, headTilt: -14, armR: { a: 150 + Math.sin(t / 3) * 20, b: -20 }, armL: { a: 40, b: -70 } }, [[0, 'neutral'], [30, 'smug']], 7)}
      <Controller x={1480} y={standY() - 50} s={0.16} glow={0.7} />
    </g>
  ),
  front: (t) => <Paused p={t + 20} />,
});

// ---------- S9, S9b: questions ----------
export const S9 = textCard({ kicker: 'PART 2', lines: ['WHO ELSE HAS', 'A CONTROLLER?'], size: 130, color: CHEAT.glow, y: 460 });
export const S9b = textCard({ kicker: 'AND WHAT HAPPENS WHEN SOMEONE', lines: ['PRESSES PLAY?'], size: 150, color: '#FFE27A', y: 560 });

// ---------- S10: is any of this real? ----------
export const S10 = textCard({ kicker: "THE CHEATS AREN'T. BUT EVERY CATCH IS.", lines: ['IS ANY OF', 'THIS REAL?'], size: 140, y: 470 });

// ---------- S11..S11d: the real catches, ticked one by one ----------
const ITEMS = ['NO PAIN = INJURIES', 'ONE SERIAL NUMBER EACH', '1 CAR = 1/5 WORLD ENERGY', 'JETPACK AT 3,000 FT'];
const real = (n: number) => listCard({ title: 'REAL', items: ITEMS.slice(0, n + 1).map((text, i) => ({ at: i < n ? -20 : 6, text, ok: true, hot: i === n })) });
export const S11 = real(0);
export const S11b = real(1);
export const S11c = real(2);
export const S11d = real(3);

// ---------- S12: which cheat would you enter first? ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <CodeField t={t} />
    <CodeList x={600} y={560} s={1.1} rot={-3} hi={Math.floor(t / 14) % 12} />
    <text x={1330} y={380} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={86} fill="#F6EFE3" stroke="#04100E" strokeWidth={10} paintOrder="stroke">WHICH CHEAT</text>
    <text x={1330} y={480} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={86} fill="#F6EFE3" stroke="#04100E" strokeWidth={10} paintOrder="stroke">FIRST?</text>
    <g opacity={clamp((t - 30) / 8)} transform={`translate(1330 640) scale(${backOut(clamp((t - 30) / 9))})`}>
      <rect x={-260} y={-56} width={520} height={92} rx={46} fill="#1A1430" stroke={CHEAT.glow} strokeWidth={4} />
      <text y={6} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={CHEAT.glow}>COMMENTS ↓</text>
    </g>
  </g>
);

// ---------- S13: the series end card (space for YouTube's end screen on the right) ----------
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <CodeField t={t + 200} seed={5} />
    <rect width={1920} height={1080} fill="#04100E" opacity={0.35} />
    <text x={140} y={300} fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill={CHEAT.glow} opacity={clamp(t / 6)}>THE SERIES</text>
    <text x={140} y={420} fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3" stroke="#04100E" strokeWidth={10} paintOrder="stroke">VIDEO GAMES</text>
    <text x={140} y={530} fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFE27A" stroke="#04100E" strokeWidth={10} paintOrder="stroke">IN REAL LIFE</text>
    <Controller x={460} y={800} s={0.8} glow={0.5} press={['r', 'b', 'g', 'y'][Math.floor(t / 12) % 4]} />
    <g opacity={clamp((t - 10) / 8)}>
      <rect x={1060} y={300} width={720} height={405} rx={20} fill="none" stroke="#F6EFE3" strokeWidth={6} strokeDasharray="24 16" />
      <text x={1420} y={520} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3">NEXT VIDEO →</text>
    </g>
  </g>
);
