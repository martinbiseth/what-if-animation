import React from 'react';
import {
  Hero, Look, LOOKS, Pose, ShotProps, Word, basePose, camT, clamp, kf, backOut, easeOut, faceAt, idleBlink, talkAt, Expr, FONT, Glow, rnd,
  Schematic, SCH, SchLabel, DrawOn, UI, LEG_LEN, Smartphone, DuskSky, Sun, Haze, Skyline, Bokeh, Foreground,
} from '../../engine';
import { YOU, ELLIE, MOM, MO, NEIGHBOR, Soft, span, wordF, faceCU, bigWord, handAt } from '../electricity/common';

// Shared by every chapter of "What if gravity doubled every hour?": the cast, the gravity HUD, the poses of a body
// that weighs too much, the dog, the pool yard, the TV, and the shot builders most shots are made from.

export { YOU, ELLIE, MOM, MO, Soft, span, wordF, faceCU, bigWord, handAt };
/** Mr. Patel next door: a cardigan and grey hair, no cap. */
export const PATEL: Look = { ...LOOKS.worker, jacket: '#7A6A4A', jacketShade: '#62553A', accent: '#C9B48A', hat: undefined, hair: '#B9B4AA' };
/** The scientist on the TV: a grey suit, no hat. */
export const SCIENTIST: Look = { ...LOOKS.suit26, hat: undefined };
export { NEIGHBOR };

export type SetFC = React.FC<{ t: number; id?: string }>;

// ---------------------------------------------------------------- the gravity HUD
/** The HUD in the top right: the clock and how many times normal gravity is, swapping with a pop at each key frame. */
export const gHud = (keys: [number, number, string][]): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
    let k = 0;
    keys.forEach((kk, i) => {
      if (f >= kk[0]) k = i;
    });
    const [f0, g, clock] = keys[k];
    const pop = k > 0 ? backOut(clamp((f - f0) / 8)) : 1;
    const flash = k > 0 ? clamp(1 - (f - f0) / 14) : 0;
    const col = g === 0 ? '#7FD4FF' : g >= 4 ? '#FF4A3A' : g >= 2 ? '#FFD23A' : '#F6EFE3';
    return (
      <g transform="translate(1660 96)">
        <rect x={-196} y={-52} width={392} height={104} rx={52} fill={UI.pill} opacity={0.9} />
        <text x={-110} y={16} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">{clock}</text>
        <rect x={-14} y={-34} width={3} height={68} fill="#F6EFE3" opacity={0.35} />
        <g transform={`translate(88 0) scale(${0.6 + 0.4 * pop})`}>
          {flash > 0 ? <circle r={70 + 30 * (1 - flash)} fill="none" stroke={col} strokeWidth={6} opacity={flash} /> : null}
          <text x={0} y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill={col} stroke="#0B0816" strokeWidth={8} paintOrder="stroke">
            {g === 0 ? '0G' : `${g}G`}
          </text>
        </g>
      </g>
    );
  };
  return Hud;
};

// ---------------------------------------------------------------- heavy bodies
/** A body under `g` times its weight: knees bent, shoulders down, arms hanging, a squash that grows with g. */
export const heavy = (g: number, o: Partial<Pose> = {}): Partial<Pose> => {
  const k = clamp((g - 1) / 3);
  return {
    squash: 0.08 * k,
    tilt: 8 * k,
    armL: { a: 4, b: -2 },
    armR: { a: 4, b: -2 },
    legL: { a: 14 * k, b: -26 * k },
    legR: { a: -4 * k, b: -18 * k },
    expr: k > 0.6 ? 'tired' : 'worried',
    ...o,
  };
};

/**
 * A body lying flat on its back on the floor at (x, floorY), head toward `dir` (1 right, -1 left). Arms lie along the
 * body unless `pose` says otherwise. The chest sits half a torso above the floor.
 */
export const lie = (x: number, floorY: number, scale: number, dir: 1 | -1 = 1, o: Partial<Pose> = {}): Pose => ({
  ...basePose,
  x, y: floorY + 40 * scale, scale, spin: 90 * dir, yaw: 0, facing: 1,
  armL: { a: 24, b: -6 }, armR: { a: 34, b: -6 }, legL: { a: 4, b: 0 }, legR: { a: -4, b: 0 },
  ...o,
});

/** On the stomach, sliding forward (dir): arms reaching ahead in turn, legs pushing; `phase` runs the crawl. */
export const slide = (x: number, floorY: number, scale: number, dir: 1 | -1, phase: number, o: Partial<Pose> = {}): Pose => {
  const a = Math.sin(phase);
  return {
    ...basePose,
    x, y: floorY + 46 * scale, scale, spin: -90 * dir, yaw: 0.5 * dir, facing: dir,
    headTilt: 70 * dir,
    armL: { a: 150 + 26 * a, b: -30 - 20 * a }, armR: { a: 150 - 26 * a, b: -30 + 20 * a },
    legL: { a: 10 + 14 * a, b: -30 - 30 * Math.max(0, a) }, legR: { a: -6 - 14 * a, b: -30 - 30 * Math.max(0, -a) },
    ...o,
  };
};

/** A cast member at a pose with an expression track and idle blinks: the small wrapper most hand-drawn shots use. */
export const Body: React.FC<{ look: Look; pose: Pose; t: number; faces?: [number, Expr][]; seed?: number; words?: Word[]; f?: number; talk?: [number, number][]; rim?: string; shadow?: number }> = ({
  look, pose, t, faces, seed = 1, words, f = 0, talk, rim = 'rimR', shadow = 0,
}) => {
  const face = faces ? faceAt(t, faces) : { expr: pose.expr, blink: 0 };
  const open = words && talk ? talkAt(words, f, 30, talk) : 0;
  return <Hero look={look} pose={{ ...pose, expr: face.expr, blink: Math.max(face.blink, pose.blink, idleBlink(t, seed)), talk: open }} rimId={rim} shadow={shadow} />;
};

// ---------------------------------------------------------------- props
/** Biscuit, the dog: a sandy mutt lying on his belly, side view facing right; `flat` presses him into the floor. */
export const Dog: React.FC<{ x: number; y: number; s?: number; t: number; flat?: number; shake?: number; flip?: boolean; look?: number }> = ({ x, y, s = 1, t, flat = 0, shake = 0, flip = false, look = 0 }) => {
  const sq = 1 - 0.35 * flat;
  const jx = shake > 0 ? Math.sin(t * 2.3) * 3 * shake : 0;
  const tail = Math.sin(t / (flat > 0.5 ? 14 : 5)) * (flat > 0.5 ? 6 : 22);
  const breathe = 1 + Math.sin(t / 14) * 0.02;
  return (
    <g transform={`translate(${x + jx} ${y}) scale(${(flip ? -1 : 1) * s} ${s})`}>
      <ellipse cx={0} cy={0} rx={190} ry={18} fill="#000" opacity={0.3} />
      <g transform={`scale(1 ${sq})`}>
        <path d={`M -150 -20 Q -180 ${-40 + tail * 0.2} -210 ${-50 - tail}`} stroke="#C98E4E" strokeWidth={18} strokeLinecap="round" fill="none" />
        <g transform={`scale(1 ${breathe})`}>
          <path d="M -160 0 Q -170 -86 -60 -92 L 70 -92 Q 130 -90 140 -40 L 140 0 Z" fill="#D9A262" stroke="#1A1410" strokeWidth={6} />
          <path d="M -80 -92 Q -40 -70 20 -92" fill="#C98E4E" />
        </g>
        {[-120, -60, 70, 120].map((lx, i) => (
          <ellipse key={i} cx={lx + 20} cy={-8} rx={34} ry={14} fill="#C98E4E" stroke="#1A1410" strokeWidth={5} />
        ))}
        <g transform={`translate(150 ${-70 + 30 * flat})`}>
          <ellipse cx={0} cy={0} rx={70} ry={58} fill="#D9A262" stroke="#1A1410" strokeWidth={6} />
          <ellipse cx={58} cy={18} rx={36} ry={26} fill="#E9C08A" stroke="#1A1410" strokeWidth={5} />
          <ellipse cx={88} cy={10} rx={12} ry={9} fill="#1A1410" />
          <path d={`M -36 -36 Q -70 ${10 + 20 * flat} -50 ${40 + 20 * flat} Q -20 ${10 + 10 * flat} -14 -40 Z`} fill="#8A5A30" stroke="#1A1410" strokeWidth={5} />
          <circle cx={20 + look * 4} cy={-12} r={11} fill="#1A1410" />
          <circle cx={23 + look * 4} cy={-16} r={3.5} fill="#FFFFFF" />
          {flat > 0.5 ? <path d="M 6 -30 Q 22 -38 38 -30" stroke="#1A1410" strokeWidth={4} fill="none" /> : null}
        </g>
      </g>
    </g>
  );
};

/** A helium balloon on a string; x y the knot, `tug` swings the string. */
export const Balloon: React.FC<{ x: number; y: number; s?: number; color?: string; string?: number; t?: number; squish?: number }> = ({ x, y, s = 1, color = '#E8453A', string = 160, t = 0, squish = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M 0 0 Q ${Math.sin(t / 6) * 26} ${string / 2} ${Math.sin(t / 9) * 10} ${string}`} stroke="#F6EFE3" strokeWidth={3} fill="none" />
    <g transform={`scale(${1 + squish * 0.25} ${1 - squish * 0.3}) translate(0 ${-squish * 8})`}>
      <ellipse cx={0} cy={-84} rx={66} ry={80} fill={color} stroke="#1A1018" strokeWidth={5} />
      <ellipse cx={-22} cy={-118} rx={14} ry={24} fill="#FFFFFF" opacity={0.35} transform="rotate(-20 -22 -118)" />
    </g>
    <path d="M -10 2 L 10 2 L 0 -8 Z" fill={color} stroke="#1A1018" strokeWidth={4} />
  </g>
);

/** A pigeon side on, facing right; `flap` 0..1 raises the wings, `lift` the body off its feet. */
export const Pigeon: React.FC<{ x: number; y: number; s?: number; flap?: number; lift?: number }> = ({ x, y, s = 1, flap = 0, lift = 0 }) => (
  <g transform={`translate(${x} ${y - lift}) scale(${s})`}>
    {lift < 4 ? <path d="M -6 0 L -6 -22 M 10 0 L 10 -22" stroke="#C8604A" strokeWidth={5} /> : null}
    <ellipse cx={0} cy={-46} rx={46} ry={30} fill="#8A90A4" stroke="#1A1A22" strokeWidth={5} />
    <path d="M -40 -46 L -78 -30 L -70 -56 Z" fill="#6A7084" stroke="#1A1A22" strokeWidth={4} />
    <circle cx={40} cy={-78} r={22} fill="#7A8094" stroke="#1A1A22" strokeWidth={5} />
    <path d="M 60 -80 L 76 -74 L 60 -70 Z" fill="#E8B04A" />
    <circle cx={46} cy={-82} r={4} fill="#E8603A" />
    <path d={`M -10 -56 Q -30 ${-60 - 70 * flap} 20 ${-56 - 90 * flap} Q 26 -60 10 -50 Z`} fill="#A0A6B8" stroke="#1A1A22" strokeWidth={4} />
  </g>
);

/** The kitchen's wall clock: a round dial with the hands at hh:mm, the minute hand ticking on `tick`. */
export const WallDial: React.FC<{ x: number; y: number; r?: number; hh: number; mm: number; red?: number }> = ({ x, y, r = 120, hh, mm, red = 0 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r + 14} fill="#2A2632" />
    <circle r={r} fill="#F6EFE3" stroke="#1A1620" strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, i) => (
      <rect key={i} x={-4} y={-r + 10} width={8} height={i % 3 === 0 ? 26 : 14} fill="#1A1620" transform={`rotate(${i * 30})`} />
    ))}
    <rect x={-6} y={-r * 0.5} width={12} height={r * 0.55} rx={6} fill="#1A1620" transform={`rotate(${(hh % 12) * 30 + mm * 0.5})`} />
    <rect x={-4} y={-r * 0.8} width={8} height={r * 0.85} rx={4} fill={red > 0 ? '#E8252A' : '#1A1620'} transform={`rotate(${mm * 6})`} />
    <circle r={10} fill="#E8252A" />
  </g>
);

// ---------------------------------------------------------------- the pool yard (Mr. Patel's back garden)
export const YARD = { lawn: 700, poolY0: 780, poolY1: 960, poolX0: 520, poolX1: 1560, fence: 690 };
/**
 * The two back gardens seen from the side, in the morning: your back door on the left, the fence with its gate, Mr.
 * Patel's pool across the right half (its near wall cut away so we see the water and whoever floats in it), his
 * house behind. `lift` (0..1) raises the water out of the pool as one wobbling blob (the cliffhanger); `night` darker.
 */
export const PoolYard: React.FC<{ t: number; id?: string; lift?: number; dusk?: number; broken?: number; noPool?: boolean }> = ({ t, id = 'py', lift = 0, dusk = 0, broken = 0 }) => {
  const Y = YARD;
  const lv = Y.poolY0 + 30;
  const wob = (i: number) => Math.sin(t / 7 + i * 1.3) * 6;
  const up = -lift * 900;
  return (
    <g>
      <DuskSky id={`${id}sky`} horizonY={620} red={0.15 + dusk * 0.5} />
      <Sun x={1500} y={300 - 60 * (1 - dusk)} r={90} t={t} rays={false} />
      <Skyline y={640} seed={7} color="#6E5A80" h={140} />
      <Haze y={560} o={0.25} />
      {/* Patel's house on the right */}
      <g>
        <rect x={1180} y={300} width={760} height={400} fill="#C9A27A" stroke="#2A1E18" strokeWidth={6} />
        <path d="M 1150 310 L 1560 140 L 1970 310 Z" fill="#6A3A34" stroke="#2A1E18" strokeWidth={6} />
        <rect x={1260} y={400} width={160} height={150} fill="#A8C8DA" stroke="#2A1E18" strokeWidth={6} />
        <rect x={1640} y={420} width={200} height={280} fill="#E9DCC0" stroke="#2A1E18" strokeWidth={6} />
        <path d="M 1740 420 L 1740 700" stroke="#2A1E18" strokeWidth={5} />
      </g>
      {/* your back door on the left */}
      <g>
        <rect x={-400} y={260} width={720} height={440} fill="#7A8AA0" stroke="#1E2230" strokeWidth={6} />
        <rect x={90} y={440} width={150} height={260} fill="#3A4A6A" stroke="#1E2230" strokeWidth={6} />
        <rect x={-180} y={380} width={180} height={150} fill="#F2E2B0" stroke="#1E2230" strokeWidth={6} />
        <circle cx={220} cy={580} r={8} fill="#E9C46A" />
      </g>
      {/* lawn */}
      <rect x={-400} y={Y.lawn} width={2800} height={600} fill="#5E9A4E" />
      {Array.from({ length: 60 }).map((_, i) => (
        <path key={i} d={`M ${-300 + i * 42} ${Y.lawn + 30 + rnd(2, i) * 360} l 6 -16 l 6 16`} stroke="#4E8A40" strokeWidth={4} fill="none" />
      ))}
      {/* the fence and the gate */}
      <g>
        {Array.from({ length: 34 }).map((_, i) => {
          const x = -380 + i * 34;
          if (x > 470) return null;
          const lean = broken > 0 && i % 5 === 2 ? broken * 18 : 0;
          return <rect key={i} x={x} y={Y.fence - 170} width={28} height={180} fill="#D9C49A" stroke="#6A5A3A" strokeWidth={4} transform={`rotate(${lean} ${x + 14} ${Y.fence + 10})`} />;
        })}
        <rect x={-400} y={Y.fence - 130} width={880} height={14} fill="#B8A27A" />
        <rect x={-400} y={Y.fence - 50} width={880} height={14} fill="#B8A27A" />
      </g>
      {/* the pool: deck, back wall, water, the near wall cut away */}
      <rect x={Y.poolX0 - 60} y={Y.poolY0 - 26} width={Y.poolX1 - Y.poolX0 + 120} height={40} fill="#E9E2D2" stroke="#7A7268" strokeWidth={5} />
      <rect x={Y.poolX0} y={Y.poolY0} width={Y.poolX1 - Y.poolX0} height={Y.poolY1 - Y.poolY0} fill="#3A8AB0" stroke="#24566E" strokeWidth={6} />
      {lift < 0.05 ? (
        <g>
          <rect x={Y.poolX0 + 3} y={lv} width={Y.poolX1 - Y.poolX0 - 6} height={Y.poolY1 - lv - 3} fill="#5EC0E0" />
          <path d={`M ${Y.poolX0 + 3} ${lv} ${Array.from({ length: 21 }).map((_, i) => `L ${Y.poolX0 + 3 + i * ((Y.poolX1 - Y.poolX0 - 6) / 20)} ${lv + wob(i)}`).join(' ')} L ${Y.poolX1 - 3} ${lv}`} stroke="#BFEFFF" strokeWidth={6} fill="none" />
          {Array.from({ length: 8 }).map((_, i) => (
            <path key={i} d={`M ${Y.poolX0 + 80 + i * 120 + Math.sin(t / 11 + i) * 20} ${lv + 60 + (i % 3) * 30} q 30 -10 60 0`} stroke="#BFEFFF" strokeWidth={4} fill="none" opacity={0.6} />
          ))}
        </g>
      ) : (
        <g transform={`translate(0 ${up})`}>
          <path
            d={`M ${Y.poolX0 + 20} ${lv + 40} Q ${Y.poolX0 - 60 - wob(1) * 4} ${lv - 140 - lift * 140} ${(Y.poolX0 + Y.poolX1) / 2} ${lv - 220 - lift * 200 + wob(2) * 3} Q ${Y.poolX1 + 60 + wob(3) * 4} ${lv - 140 - lift * 140} ${Y.poolX1 - 20} ${lv + 40} Q ${(Y.poolX0 + Y.poolX1) / 2} ${lv + 160 + wob(4) * 4} ${Y.poolX0 + 20} ${lv + 40} Z`}
            fill="#5EC0E0" opacity={0.85} stroke="#BFEFFF" strokeWidth={8}
          />
          {Array.from({ length: 14 }).map((_, i) => (
            <circle key={i} cx={Y.poolX0 + 60 + rnd(5, i) * (Y.poolX1 - Y.poolX0 - 120)} cy={lv - 80 - rnd(6, i) * 200 - ((t * 2 + i * 20) % 200)} r={6 + rnd(7, i) * 12} fill="#BFEFFF" opacity={0.7} />
          ))}
        </g>
      )}
      {/* the pool filter box by the deck */}
      <rect x={Y.poolX1 + 70} y={Y.poolY0 - 110} width={90} height={84} rx={8} fill="#5A6070" stroke="#2A2E38" strokeWidth={5} />
    </g>
  );
};
/** The near wall of the pool, drawn after the swimmers so only their heads and shoulders show above the water. */
export const PoolFront: React.FC<{ t: number; lift?: number }> = ({ t, lift = 0 }) => {
  const Y = YARD;
  const lv = Y.poolY0 + 30;
  if (lift > 0.05) return null;
  return (
    <g>
      <rect x={Y.poolX0 + 3} y={lv + 34} width={Y.poolX1 - Y.poolX0 - 6} height={Y.poolY1 - lv - 37} fill="#5EC0E0" opacity={0.78} />
      <path d={`M ${Y.poolX0 + 3} ${lv + 34} ${Array.from({ length: 21 }).map((_, i) => `L ${Y.poolX0 + 3 + i * ((Y.poolX1 - Y.poolX0 - 6) / 20)} ${lv + 34 + Math.sin(t / 7 + i * 1.3) * 5}`).join(' ')} L ${Y.poolX1 - 3} ${lv + 34}`} stroke="#DFF7FF" strokeWidth={5} fill="none" />
      <rect x={Y.poolX0 - 60} y={Y.poolY1} width={Y.poolX1 - Y.poolX0 + 120} height={160} fill="#E9E2D2" stroke="#7A7268" strokeWidth={5} />
    </g>
  );
};

// ---------------------------------------------------------------- the TV news
/** A TV news picture: the scientist lying on his side on the studio floor, a lower third and a red ticker. */
export const NewsPicture: React.FC<{ t: number; f?: number; words?: Word[]; talk?: [number, number][]; headline?: string; ticker?: string; faces?: [number, Expr][] }> = ({
  t, f = 0, words, talk, headline = 'GRAVITY DOUBLES AGAIN', ticker = 'LIE DOWN · STAY DOWN · PLANES ORDERED TO LAND BEFORE 9:00 · ', faces = [[0, 'worried']],
}) => {
  const open = words && talk ? talkAt(words, f, 30, talk) : 0;
  const face = faceAt(t, faces);
  const pose = lie(900, 820, 1.25, -1, { yaw: 0.2, armR: { a: 70, b: -60 }, headTilt: -10, look: 0.3 });
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#1A2440" />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={-200 + i * 260} y={120} width={180} height={420} rx={10} fill="#22305A" />
      ))}
      <Glow x={960} y={300} r={700} kind="cool" o={0.5} />
      <rect x={-400} y={760} width={2800} height={500} fill="#2A2238" />
      <path d="M 700 760 L 1500 760" stroke="#3A3250" strokeWidth={6} />
      <Hero look={SCIENTIST} pose={{ ...pose, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, 4)), talk: open }} shadow={0} />
      <g>
        <rect x={0} y={880} width={1920} height={110} fill="#F6EFE3" />
        <rect x={0} y={880} width={300} height={110} fill="#E8252A" />
        <text x={150} y={950} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#FFFFFF">LIVE</text>
        <text x={340} y={952} fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#14121C">{headline}</text>
        <rect x={0} y={990} width={1920} height={90} fill="#14121C" />
        <text x={1920 - ((t * 9) % 2400)} y={1048} fontFamily={FONT.ui} fontSize={40} fill="#FFD23A">{ticker + ticker}</text>
      </g>
    </g>
  );
};

/** A big gravity number card: "2G", "4G", with the clock above, slamming down. */
export const gCard = (o: { g: string; clock: string; color?: string; Bg?: SetFC }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const drop = kf(t, [[0, -500], [7, 0]], easeOut);
    const sq = t > 7 ? Math.max(0, 0.2 - (t - 7) * 0.025) : 0;
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.55}>
            <o.Bg t={t + 500} id="gc" />
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill="#0C0A16" />
        )}
        <text x={960} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={56} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 5)}>{o.clock}</text>
        <g transform={`translate(960 ${700 + drop}) scale(${1 + sq} ${1 - sq})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={300} fill={o.color ?? '#FFD23A'} stroke="#0B0816" strokeWidth={18} paintOrder="stroke">{o.g}</text>
        </g>
        {t > 7 && t < 20 ? <ellipse cx={960} cy={720} rx={300 + (t - 7) * 30} ry={30} fill="none" stroke="#F6EFE3" strokeWidth={6} opacity={1 - (t - 7) / 13} /> : null}
      </g>
    );
  };
  return Shot;
};

/** The phone's gravity app held up to camera, the reading `from` jumping to `to` at frame `at` (shot clock). */
export const phoneG = (o: { from: string; to?: string; at?: number; Bg: SetFC; zoom?: [number, number] }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const v = o.to && t >= (o.at ?? 0) ? o.to : o.from;
    const jolt = o.to && t >= (o.at ?? 0) ? Math.max(0, 1 - (t - (o.at ?? 0)) / 8) : 0;
    const z = kf(t, [[0, o.zoom?.[0] ?? 1], [Math.max(1, len), o.zoom?.[1] ?? 1.1]]);
    return (
      <g>
        <Soft blur={16} dim={0.4}>
          <g transform={camT(960, 520, 1.5)}>
            <o.Bg t={t + 300} id="pg" />
          </g>
        </Soft>
        <g transform={`translate(960 ${560 + jolt * 30}) scale(${z}) translate(-960 -560)`}>
          <Smartphone x={960} y={540} s={1.35} mode="gmeter" text={v} t={t} status={false} />
          {[-1, 1].map((sd) => (
            <ellipse key={sd} cx={960 + sd * 200} cy={880} rx={80} ry={110} fill="#26232F" stroke="#100E16" strokeWidth={8} />
          ))}
        </g>
      </g>
    );
  };
  return Shot;
};

/** The schematic with the doubling ladder: bars for 1, 2, 4, 8, 16 g growing in turn, the current one lit. */
export const doublingShot = (o: { lit: number; at?: number[]; labels?: string[] }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const vals = [1, 2, 4, 8, 16];
    const labels = o.labels ?? ['BEFORE 7', '7:00', '8:00', '9:00', '10:00'];
    const at = o.at ?? [0, 10, 20, 30, 40];
    return (
      <g>
        <g transform={camT(960, 540, kf(t, [[0, 1], [Math.max(1, len), 1.04]]))}>
          <Schematic t={t} id="dbl" />
        </g>
        {vals.map((v, i) => {
          const g = easeOut(clamp((t - at[i]) / 12));
          const x = 400 + i * 280;
          const h = 30 * v * g;
          const lit = i === o.lit;
          return (
            <g key={i} opacity={clamp((t - at[i]) / 4)}>
              <rect x={x - 70} y={860 - h} width={140} height={h} fill={lit ? SCH.live : '#2A3C58'} stroke={SCH.line} strokeWidth={4} />
              <text x={x} y={840 - h} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill={lit ? SCH.live : SCH.line}>{v}G</text>
              <text x={x} y={920} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={SCH.dim}>{labels[i]}</text>
            </g>
          );
        })}
        <DrawOn d="M 260 860 L 1700 860" t={t} dur={10} />
      </g>
    );
  };
  return Shot;
};

/** A plain set wide with no one in it (a cutaway). */
export const setShot = (Set: SetFC, cam: [number, number, number], cam1?: [number, number, number], extra?: (t: number) => React.ReactNode): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const [a, b, c] = cam;
    const [a1, b1, c1] = cam1 ?? cam;
    const L = Math.max(1, len);
    return (
      <g transform={camT(kf(t, [[0, a], [L, a1]]), kf(t, [[0, b], [L, b1]]), kf(t, [[0, c], [L, c1]]))}>
        <Set t={t + 100} />
        {extra?.(t)}
      </g>
    );
  };
  return Shot;
};

export { Schematic, SCH, SchLabel, DrawOn, Bokeh, Foreground, LEG_LEN };

/** A camera shake as an SVG transform string (the engine's shake() gives {x, y}). */
export const shk = (t: number, from: number, len = 8, amp = 10) => {
  const k = t >= from && t < from + len ? 1 - (t - from) / len : 0;
  return `translate(${Math.sin(t * 2.9) * amp * k} ${Math.cos(t * 3.7) * amp * 0.7 * k})`;
};
