import React from 'react';
import { ShotProps, Word, clamp, easeOut, backOut, kf, camT, FONT, Glow, walkPose, Hero, factCard, basePose, Pose } from '../../../engine';
import { YOU_WOOL, KETIL, KETIL_OUT, GUDRUN, ASA, ASA_OUT, LH, FEET, Farmyard, Bowl, Stockfish, Hammer, Spread, DryingRack, BoneSkate, Skis, Snowfall, INK } from '../norse';
import { scene, faceCU, insert, bigWord, inside, outside, lake, Caption, wordF, span, SIT, seatFeet, WHITE } from '../common';
import words from './words.json';

// Chapter 5, fuel for the body: two meals a day (day meal, night meal); stockfish, hard as a plank, dried on racks in the
// wind, keeps for years, beaten with a hammer (Asa is far too good at it); porridge, butter, cheese, skyr, salted meat,
// all heavy with fat; the body is a furnace (arctic rations ~4,500 kcal a day; fat is the densest fuel); the frozen lake:
// Asa on bone skates, you fall, Ketil laughs, then skis off; skiing in Norway is thousands of years old (the Rødøy
// carving, 4,000+ years); and at three in the afternoon the light goes.

const W = words as Word[];
const at = (a: string, n = 1) => wordF(W, a, n);
const DAY = inside({ mode: 'day', fire: 1 });
const LAKE = lake('day');
const ICE = 830;
const DUSK_OUT = outside({ tod: 'dusk', door: 0.6, snow: 0.3 });
const DAY_OUT = outside({ tod: 'day', door: 0.6, snow: 0.6, wind: 3 });
const TABLE = '#6A4A2E';

const Label: React.FC<{ t: number; text: string; x?: number; y?: number; c?: string }> = ({ t, text, x = 960, y = 960, c = '#FFD23A' }) => {
  const k = easeOut(clamp(t / 8));
  const w = text.length * 36 + 120;
  return (
    <g opacity={k} transform={`translate(${x} ${y + (1 - k) * 40})`}>
      <rect x={-w / 2} y={-56} width={w} height={100} rx={50} fill="#0B0816" opacity={0.8} />
      <text y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill={c}>{text}</text>
    </g>
  );
};
const Burst: React.FC<{ x: number; y: number; t: number; text: string; s?: number }> = ({ x, y, t, text, s = 1 }) => {
  if (t < 0 || t > 14) return null;
  const k = backOut(clamp(t / 5));
  return (
    <g transform={`translate(${x} ${y}) scale(${k * s}) rotate(-8)`} opacity={1 - clamp((t - 9) / 5)}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFD23A" stroke={INK} strokeWidth={10} paintOrder="stroke">{text}</text>
    </g>
  );
};
const sit = (x: number, s: number, yaw: number, o: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y: seatFeet(s) - 140 * s, scale: s, yaw, look: Math.sign(yaw) * 0.5, ...SIT, ...o,
});

// ---------- S1: back inside, it's time to eat: everyone on the benches, bowls steaming ----------
export const S1 = scene({
  Set: DAY, setT: 30,
  cast: [
    { look: KETIL, x: 560, feet: seatFeet(1), s: 1, yaw: 0.4, faces: [[0, 'happy']], pose: SIT },
    { look: GUDRUN, x: 800, feet: seatFeet(0.97), s: 0.97, yaw: 0.3, faces: [[0, 'neutral']], pose: SIT },
    { look: ASA, x: 1010, feet: seatFeet(0.72), s: 0.72, yaw: 0.2, faces: [[0, 'happy']], pose: SIT },
    { look: YOU_WOOL, x: 1220, feet: seatFeet(0.95), s: 0.95, yaw: -0.3, faces: [[0, 'neutral'], [20, 'happy']], pose: SIT },
  ],
  cam: [[900, 640, 1.45], [910, 640, 1.55]],
  front: (t) => <g>{[560, 800, 1010, 1220].map((x, i) => <Bowl key={x} x={x + 40} y={LH.bench + 120} s={0.5} t={t + i * 9} />)}</g>,
});

// ---------- S2: the Vikings ate two big meals a day ----------
export const S2 = bigWord({ kicker: 'THE VIKINGS ATE', word: '2 MEALS', sub: 'A DAY', Bg: DAY, size: 230, color: '#FFD23A' });

// ---------- S3 / S4: the day meal in the morning, the night meal in the evening ----------
const meal = (sun: boolean, text: string): React.FC<ShotProps> => insert({
  Bg: DAY, dim: 0.4,
  draw: (t) => (
    <g>
      <g transform={`translate(${sun ? 720 : 1200} 360)`}>
        {sun ? (
          <g>
            <circle r={90} fill="#FFD23A" stroke={INK} strokeWidth={6} />
            {Array.from({ length: 10 }).map((_, i) => <path key={i} transform={`rotate(${i * 36 + t})`} d="M 0 -120 L 0 -160" stroke="#FFD23A" strokeWidth={14} strokeLinecap="round" />)}
          </g>
        ) : (
          <path d="M 40 -90 A 100 100 0 1 0 40 90 A 76 76 0 1 1 40 -90 Z" fill="#E8E4F8" stroke={INK} strokeWidth={6} />
        )}
      </g>
      <Bowl x={960} y={720} s={2.4} t={t} />
      <Label t={t - 2} text={text} y={980} />
    </g>
  ),
});
export const S3 = meal(true, 'DAY MEAL: MORNING');
export const S4 = meal(false, 'NIGHT MEAL: EVENING');

// ---------- S5: Gudrun hands you a fish ----------
export const S5 = scene({
  Set: DAY, setT: 120,
  cast: [
    { look: GUDRUN, x: 820, feet: LH.back, s: 0.97, yaw: 0.5, faces: [[0, 'neutral']], keys: [{ f: 6, p: { armR: { a: 80, b: -10 } } }] },
    { look: YOU_WOOL, x: 1120, feet: LH.back, s: 0.95, yaw: -0.4, faces: [[0, 'neutral'], [24, 'oops']] },
  ],
  cam: [[970, 620, 1.75], [980, 620, 1.85]],
  front: (t) => <Stockfish x={kf(t, [[0, 900], [20, 1010]], easeOut)} y={590} s={0.45} rot={-10} />,
});

// ---------- S6: flat, grey, and hard as a plank of wood ----------
export const S6 = insert({
  Bg: DAY, dim: 0.4,
  draw: (t) => (
    <g>
      <Stockfish x={960} y={520} s={2.6} rot={Math.sin(t / 10) * 3} />
      <Label t={t - 2} text="FLAT" x={560} y={860} c={WHITE} />
      <Label t={t - 14} text="GREY" x={960} y={860} c="#B8B0A0" />
      <Label t={t - 30} text="HARD AS WOOD" x={1430} y={860} />
    </g>
  ),
});

// ---------- S7: you knock it on the table. It knocks back ----------
export const S7 = insert({
  Bg: DAY, dim: 0.3, table: TABLE,
  draw: (t) => {
    const hits = [10, 30, 48];
    const last = hits.filter((h) => t >= h).pop() ?? -99;
    const lift = Math.max(0, 1 - (t - last) / 6) * 0 + (t < 10 ? 1 - t / 10 : Math.min(1, (t - last) / 8) * (t > 50 ? 0 : 1));
    return (
      <g>
        <Stockfish x={960} y={600 - lift * 120} s={2.2} rot={-20 + lift * 10} />
        {hits.map((h, i) => <Burst key={h} x={760 + i * 220} y={420 - i * 30} t={t - h} text={i === 2 ? 'KNOCK!' : 'KNOCK'} s={i === 2 ? 1.2 : 0.9} />)}
      </g>
    );
  },
});

// ---------- S8: this is stockfish ----------
export const S8 = insert({
  Bg: DAY, dim: 0.4,
  draw: (t) => (
    <g>
      <Stockfish x={960} y={520} s={kf(t, [[0, 2.4], [60, 2.6]])} />
      <Label t={t - 2} text="STOCKFISH" y={860} />
    </g>
  ),
});

// ---------- S9: cod hung outside on racks, dried in the cold wind ----------
export const S9 = scene({
  Set: DAY_OUT, setT: 160, cam: [[1300, 560, 1.4], [1340, 560, 1.5]],
  front: (t) => (
    <g>
      <DryingRack x={1300} y={FEET + 20} s={0.95} t={t * 3} />
      <Snowfall t={t * 2} n={90} wind={5} o={0.6} />
      <text x={1300} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={WHITE} stroke={INK} strokeWidth={8} paintOrder="stroke" opacity={clamp((t - at('water') + at('Cod')) / 6)}>WATER → GONE</text>
    </g>
  ),
});

// ---------- S10: dried like this, it keeps for years ----------
export const S10 = bigWord({ kicker: 'DRIED LIKE THIS, IT KEEPS FOR', word: 'YEARS', Bg: DAY_OUT, size: 260, color: '#E8DCC0' });

// ---------- S11: to eat it you beat it with a hammer, then soak it ----------
export const S11 = insert({
  Bg: DAY, dim: 0.3, table: TABLE,
  draw: (t) => {
    const ph = (t % 16) / 16;
    const rot = ph < 0.5 ? -50 + ph * 2 * 50 : 0 - (ph - 0.5) * 2 * 50;
    const soak = clamp((t - (at('soak') - at('To', 2))) / 10);
    return (
      <g>
        {soak < 1 ? <Stockfish x={900} y={620} s={2} split={clamp(t / 40)} /> : null}
        <g opacity={1 - soak}><g transform={`rotate(${rot} 1300 760)`}><Hammer x={1000} y={540} s={2} rot={-60} /></g></g>
        <g opacity={soak}>
          <ellipse cx={960} cy={620} rx={360} ry={70} fill="#6AA8D8" stroke={INK} strokeWidth={6} />
          <Stockfish x={960} y={610} s={1.6} split={1} />
          <Label t={soak * 10 - 2} text="SOAK" y={300} c="#BFE6FF" />
        </g>
      </g>
    );
  },
});

// ---------- S12: Asa shows you how ----------
export const S12 = scene({
  Set: DAY, setT: 220,
  cast: [
    { look: ASA, x: 900, feet: LH.back, s: 0.72, yaw: 0.4, faces: [[0, 'happy']], keys: [{ f: 4, p: { armR: { a: 170, b: -20 } } }, { f: 14, p: { armR: { a: 60, b: -10 } } }, { f: 22, p: { armR: { a: 170, b: -20 } } }, { f: 32, p: { armR: { a: 60, b: -10 } } }] },
    { look: YOU_WOOL, x: 1160, feet: LH.back, s: 0.95, yaw: -0.4, faces: [[0, 'neutral']] },
  ],
  cam: [[1020, 640, 1.8], [1030, 640, 1.9]],
});

// ---------- S13: she is way too good at the hammer part ----------
export const S13 = insert({
  Bg: DAY, dim: 0.3, table: TABLE,
  draw: (t) => {
    const ph = (t % 6) / 6;
    const rot = ph < 0.5 ? -60 + ph * 120 : 0 - (ph - 0.5) * 120;
    return (
      <g transform={`translate(${Math.sin(t * 2.2) * 4} 0)`}>
        <Stockfish x={900} y={620} s={2} split={1} />
        <g transform={`rotate(${rot} 1300 760)`}><Hammer x={1000} y={540} s={2} rot={-60} /></g>
        {Array.from({ length: 10 }).map((_, i) => {
          const q = ((t * 1.4 + i * 7) % 20) / 20;
          return <rect key={i} x={900 + Math.cos(i * 1.7) * q * 360} y={600 - Math.sin(i) * q * 260 + q * q * 200} width={14} height={10} fill="#D8D0C0" stroke={INK} strokeWidth={2} />;
        })}
        <Burst x={1300} y={300} t={(t % 18)} text="BAM!" s={0.8} />
      </g>
    );
  },
});

// ---------- S14: barley porridge, butter, hard cheese, skyr, salted meat ----------
const FOOD = ['porridge', 'Butter', 'cheese', 'skyr', 'meat'] as const;
const FOOD_LABEL = ['BARLEY PORRIDGE', 'BUTTER', 'HARD CHEESE', 'SKYR', 'SALTED MEAT'];
export const S14 = insert({
  Bg: DAY, dim: 0.3, table: TABLE,
  draw: (t) => {
    const t0 = at("There's");
    const n = FOOD.filter((w) => t >= at(w) - t0 - 4).length;
    return (
      <g>
        <Spread x={1000} y={700} s={1.5} n={Math.max(1, n)} />
        {n > 0 ? <Label t={t - (at(FOOD[n - 1]) - t0 - 4)} text={FOOD_LABEL[n - 1]} y={260} /> : null}
      </g>
    );
  },
});

// ---------- S15: all of it heavy with fat ----------
export const S15 = bigWord({ kicker: 'ALL OF IT HEAVY WITH', word: 'FAT', Bg: DAY, size: 280, color: '#F2D86A' });

// ---------- S16: that's not an accident ----------
export const S16 = faceCU({ look: GUDRUN, Bg: DAY, faces: [[0, 'neutral'], [14, 'smug']], yaw: -0.2, zoom: [3.2, 3.4], pose: { headTilt: 6 } });

// ---------- S17: your body is a furnace too ----------
export const S17 = insert({
  Bg: DAY, dim: 0.5,
  draw: (t) => {
    const k = 0.6 + 0.4 * clamp(t / 40) + Math.sin(t / 3) * 0.05;
    return (
      <g>
        <g transform="translate(960 560)">
          <circle cx={0} cy={-300} r={90} fill="#2A2632" stroke={INK} strokeWidth={6} />
          <path d="M -130 -200 Q 0 -230 130 -200 L 160 200 L -160 200 Z" fill="#2A2632" stroke={INK} strokeWidth={6} />
          <path d="M -60 200 L -70 420 M 60 200 L 70 420" stroke="#2A2632" strokeWidth={60} strokeLinecap="round" />
          <Glow x={0} y={20} r={260 * k} kind="warm" o={0.9} />
          <g transform={`scale(${k})`}>
            <path d="M 0 -120 Q 70 -20 60 60 Q 50 130 0 140 Q -50 130 -60 60 Q -70 -20 0 -120 Z" fill="#FF8A3D" />
            <path d="M 0 -40 Q 36 20 30 70 Q 20 110 0 112 Q -20 110 -30 70 Q -36 20 0 -40 Z" fill="#FFD23A" />
          </g>
        </g>
        <Label t={t - 6} text="BODY = FURNACE" x={960} y={140} />
        <Label t={t - (at('fuel') - at('Your'))} text="BURNS FUEL FAST" x={960} y={1010} c="#FF8A3D" />
      </g>
    );
  },
});

// ---------- S18: modern arctic rations: about 4,500 calories a day ----------
export const S18 = factCard({ value: 4500, label: 'CALORIES A DAY FOR SOLDIERS IN ARCTIC COLD', format: (v) => `~${Math.round(v / 10) * 10}`, sub: 'US Army, Meal Cold Weather ration' });

// ---------- S19: fat is the most packed fuel there is ----------
export const S19 = insert({
  Bg: DAY, dim: 0.55,
  draw: (t) => {
    const rows: [string, number, string][] = [['FAT', 9, '#F2D86A'], ['CARBS', 4, '#C8A070'], ['PROTEIN', 4, '#B8504A']];
    return (
      <g>
        <text x={960} y={240} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill={WHITE} opacity={clamp(t / 6)}>CALORIES PER GRAM</text>
        {rows.map(([n, v, c], i) => {
          const k = easeOut(clamp((t - 4 - i * 4) / 14));
          return (
            <g key={n} transform={`translate(560 ${380 + i * 190})`}>
              <text x={-30} y={30} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={WHITE}>{n}</text>
              <rect x={0} y={-40} width={v * 95 * k} height={100} rx={20} fill={c} stroke={INK} strokeWidth={5} />
              <text x={v * 95 * k + 30} y={30} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill={c} opacity={k}>{v}</text>
            </g>
          );
        })}
      </g>
    );
  },
});

// ---------- S20: after eating, Asa drags you out to the frozen lake ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 500], [len, 1300]], (q) => q);
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 1150]]), 600, 1.4)}>
      <LAKE t={t + 40} id="s20" />
      <Hero look={YOU_WOOL} pose={{ ...walkPose(x - 220, t * 0.6, ICE, 0.95, { expr: 'worried', tilt: 14, armR: { a: 95, b: 0 } }, 1) }} />
      <Hero look={ASA_OUT} pose={{ ...walkPose(x, t * 0.8, ICE, 0.72, { expr: 'happy', armL: { a: 100, b: 0 } }, 1) }} />
    </g>
  );
};

// ---------- S21: she straps on skates made from animal bone ----------
export const S21 = insert({
  Bg: LAKE, dim: 0.3,
  draw: (t) => (
    <g>
      <BoneSkate x={960} y={600} s={2.6} />
      <Label t={t - 10} text="SKATES MADE OF BONE" y={900} />
    </g>
  ),
});

// ---------- S22: ...and glides away ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 800], [len, 1500]], easeOut);
  const sw = Math.sin(t / 12);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1200]]), 600, 1.4)}>
      <LAKE t={t + 80} id="s22" />
      <Hero look={ASA_OUT} pose={{ ...basePose, x, y: ICE - 140 * 0.72, scale: 0.72, yaw: 0.6, look: 0.5, tilt: 10, legL: { a: 20 * sw, b: 0 }, legR: { a: -20 * sw - 10, b: -10 }, armL: { a: 60, b: -10 }, armR: { a: 60, b: -10 }, expr: 'happy' }} rimId="rimR" shadow={1} />
      <path d={`M ${x - 600} ${ICE + 4} L ${x - 40} ${ICE + 4}`} stroke="#FFFFFF" strokeWidth={4} opacity={0.8} />
    </g>
  );
};

// ---------- S23: you try ----------
export const S23: React.FC<ShotProps> = ({ t }) => {
  const w = Math.sin(t / 3) * 14;
  return (
    <g transform={camT(960, 620, 1.9)}>
      <LAKE t={t + 120} id="s23" />
      <Hero look={YOU_WOOL} pose={{ ...basePose, x: 960, y: ICE - 140 * 0.95, scale: 0.95, yaw: 0.2, look: 0, tilt: w, armL: { a: 100 + w * 3, b: -10 }, armR: { a: 100 - w * 3, b: -10 }, legL: { a: 14 + w, b: 0 }, legR: { a: -14 + w, b: 0 }, expr: 'worried' }} rimId="rimR" shadow={1} />
    </g>
  );
};

// ---------- S24: you fall ----------
export const S24: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(clamp(t / 10));
  const sh = t > 10 && t < 18 ? Math.sin(t * 3) * 10 : 0;
  return (
    <g transform={camT(960 + sh, 640, 1.9)}>
      <LAKE t={t + 160} id="s24" />
      <Hero look={YOU_WOOL} pose={{ ...basePose, x: 960 - k * 40, y: ICE - 140 * 0.95 + k * 120, scale: 0.95, yaw: 0.2, look: 0, spin: -80 * k, armL: { a: 150, b: -10 }, armR: { a: 150, b: -10 }, legL: { a: 50 * k, b: 0 }, legR: { a: 30 * k, b: 0 }, expr: 'dizzy' }} rimId="rimR" shadow={1} />
      {t > 12 ? [0, 1, 2].map((i) => <text key={i} x={860 + Math.cos(t / 5 + i * 2.1) * 80} y={640 + Math.sin(t / 5 + i * 2.1) * 20} fontSize={40} fill="#FFD23A">★</text>) : null}
    </g>
  );
};

// ---------- S25: Ketil laughs so hard he has to sit down in the snow ----------
export const S25 = scene({
  Set: LAKE, setT: 200,
  cast: [{ look: KETIL_OUT, x: 960, feet: ICE, s: 1, yaw: 0.2, faces: [[0, 'happy']], keys: [{ f: 0, p: { tilt: -14, armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 } } }, { f: 22, p: { ...SIT, y: ICE - 70, tilt: -20, armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 } } }] }],
  cam: [[960, 620, 1.9], [960, 640, 2.0]],
  front: (t) => <g>{[0, 1, 2].map((i) => <text key={i} x={1060 + i * 50} y={430 - ((t * 2 + i * 20) % 60)} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFD23A" stroke={INK} strokeWidth={6} paintOrder="stroke">HA</text>)}</g>,
});

// ---------- S26: then he clips on a pair of long wooden skis ----------
export const S26 = insert({
  Bg: LAKE, dim: 0.3,
  draw: (t) => (
    <g>
      <g transform={`translate(${(1 - easeOut(clamp(t / 12))) * -900} 0)`}>
        <Skis x={960} y={560} s={3.4} />
        <Skis x={1000} y={640} s={3.4} />
      </g>
      <Label t={t - 10} text="LONG WOODEN SKIS" y={900} />
    </g>
  ),
});

// ---------- S27: and is gone across the valley in seconds ----------
export const S27: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 700], [len, 2300]], (q) => q * q);
  return (
    <g transform={camT(960, 540, 1.0)}>
      <LAKE t={t + 240} id="s27" />
      <g transform={`translate(${x} 700) scale(0.4)`}>
        <Hero look={KETIL_OUT} pose={{ ...basePose, x: 0, y: -140, scale: 1, yaw: 0.6, look: 0.5, tilt: 22, legL: { a: 20, b: -10 }, legR: { a: -24, b: -10 }, armL: { a: 120, b: 0 }, armR: { a: 40, b: 0 }, expr: 'happy' }} rimId="rimR" shadow={0} />
        <Skis x={0} y={6} s={1.2} />
      </g>
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${x - 80 - i * 40} ${650 + i * 12} l -200 0`} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.8} />)}
    </g>
  );
};

// ---------- S28: people in Norway have been skiing for thousands of years ----------
export const S28 = bigWord({ kicker: 'NORWAY HAS BEEN', word: 'SKIING', sub: 'FOR THOUSANDS OF YEARS', Bg: LAKE, size: 230, color: '#FFFFFF' });

// ---------- S29: a rock carving of a skier, more than 4,000 years old ----------
export const S29 = insert({
  Bg: LAKE, dim: 0.5,
  draw: (t) => {
    const k = clamp(t / 30);
    return (
      <g>
        <path d="M 360 860 Q 300 420 620 300 Q 960 200 1320 300 Q 1640 420 1560 860 Z" fill="#7A7A80" stroke={INK} strokeWidth={8} />
        <path d="M 520 700 Q 700 640 820 720 M 1200 380 Q 1300 420 1380 520" stroke="#66666C" strokeWidth={6} fill="none" />
        <g stroke="#C8503A" strokeWidth={14} strokeLinecap="round" fill="none" strokeDasharray="1200" strokeDashoffset={1200 * (1 - k)}>
          <circle cx={960} cy={400} r={34} />
          <path d="M 940 370 L 920 320 M 980 370 L 1000 320" />
          <path d="M 960 434 L 950 560 L 900 660 M 950 560 L 1010 660 M 955 470 L 880 540 M 955 470 L 1040 520 L 1080 680" />
          <path d="M 760 690 L 1160 670 Q 1200 668 1210 640" />
        </g>
        <Label t={t - 20} text="4,000+ YEARS OLD" y={180} />
        <text x={960} y={960} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={WHITE} opacity={clamp((t - 30) / 8)}>The Rødøy skier, northern Norway</text>
      </g>
    );
  },
});

// ---------- S30: and then, at three in the afternoon ----------
export const S30: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, kf(t, [[0, 520], [Math.max(1, len), 500]]), 1.0)}>
      <Farmyard t={t + 600} tod="dusk" door={0.6} snow={0.3} />
    </g>
    <Caption t={t} text="3:00 PM" />
  </g>
);

// ---------- S31: ...the light starts to go ----------
export const S31 = faceCU({ look: YOU_WOOL, Bg: DUSK_OUT, faces: [[0, 'neutral'], [16, 'worried']], yaw: 0.3, eyes: 0.9, zoom: [3.0, 3.2], pose: { headTilt: -10 }, dark: 0.25, light: { x: 1100, y: 500, kind: 'cool', o: 0.4 } });

void [span, KETIL, Glow];
