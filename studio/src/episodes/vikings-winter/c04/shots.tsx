import React from 'react';
import { ShotProps, Word, clamp, easeOut, backOut, kf, camT, FONT, Glow, walkPose, Hero, factCard, LOOKS, basePose, Pose } from '../../../engine';
import { YOU, YOU_WOOL, KETIL, KETIL_OUT, GUDRUN, ASA, LH, FEET, Farmyard, Bucket, Axe, Log, Mittens, GrassShoe, Breath, Snowfall, INK, norse } from '../norse';
import { scene, faceCU, insert, bigWord, inside, outside, NameTag, Caption, wordF, WHITE } from '../common';
import words from './words.json';

// Chapter 4, going outside: a bucket and the door; the air like a wall, the nose freezing (watch the number); bare skin
// freezes in 10-30 min at -30 (under 10 with wind); back in after forty seconds; Gudrun dresses you layer by layer
// (linen, wool tunic, trousers, leg wraps, needle-bound socks and mittens); wool holds about a third of its weight in
// water and still warms, cotton does the opposite; cloak and brooch, fur hat, grass in the shoes; outside again; the
// frozen well, the axe, the bucket; firewood, a mountain of it, all by hand; and only about five hours of daylight.

const W = words as Word[];
const at = (a: string, n = 1) => wordF(W, a, n);
const DAY = inside({ mode: 'day', fire: 1 });
const DAY_OUT = outside({ tod: 'day', door: 0.8, snow: 0.4 });
const WIND_OUT = outside({ tod: 'day', door: 0.8, snow: 1, wind: 4 });
const DUSK_OUT = outside({ tod: 'dusk', door: 0.6, snow: 0.3 });

// The dress-up, one layer at a time.
const SKIN = YOU_WOOL.skin;
const LINEN = norse({ jacket: '#E8E0CC', jacketShade: '#CFC6B0', limb: LOOKS.you.limb, shoe: '#F6EFE3', belt: '#B8A888' });
const TUNIC = { ...LINEN, jacket: '#8A6440', jacketShade: '#70502E', belt: '#4A2E1A' };
const TROUSERS = { ...TUNIC, limb: '#5A4A3A' };
const WRAPS = { ...TROUSERS, limb: '#8A7A64' };
const CLOAKED = { ...WRAPS, cloak: '#6A6E78', shoe: '#6A4A2E' };
void SKIN;
const SKIN_ASA = ASA.skin;

/** A screen-space caption over any shot. */
const withCap = (Shot: React.FC<ShotProps>, text: string, d = 6, y = 120): React.FC<ShotProps> => {
  const C: React.FC<ShotProps> = (p) => (
    <g>
      <Shot {...p} />
      <Caption t={p.t - d} text={text} y={y} />
    </g>
  );
  return C;
};

/** A garment label that slides in under the figure. */
const Label: React.FC<{ t: number; text: string; x?: number; y?: number }> = ({ t, text, x = 960, y = 960 }) => {
  const k = easeOut(clamp(t / 8));
  const w = text.length * 36 + 120;
  return (
    <g opacity={k} transform={`translate(${x} ${y + (1 - k) * 40})`}>
      <rect x={-w / 2} y={-56} width={w} height={100} rx={50} fill="#0B0816" opacity={0.8} />
      <text y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#FFD23A">{text}</text>
    </g>
  );
};

/** One stage of the dress-up: you in the middle in this layer, Gudrun tugging at it, a label. */
const dress = (look: typeof LINEN, label: string, o: { setT?: number; tug?: 'top' | 'legs' } = {}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const pop = backOut(clamp(t / 8));
    const sh = Math.sin(t / 3) * 2 * (1 - clamp(t / 20));
    return (
      <g>
        <g transform={camT(kf(t, [[0, 1000], [Math.max(1, len), 1010]]), 600, kf(t, [[0, 1.75], [Math.max(1, len), 1.85]]))}>
          <DAY t={t + (o.setT ?? 300)} id="dr" />
          <Glow x={980} y={560} r={420} kind="warm" o={0.25 * pop} />
          <Hero look={GUDRUN} pose={{ ...poseOf(1220, 0.97, -0.5), armR: { a: 70 + Math.sin(t / 4) * 10, b: -50 }, armL: { a: 60 + Math.cos(t / 4) * 10, b: -60 }, expr: 'neutral', blink: 0 }} rimId="rimR" shadow={1} />
          <Hero look={look} pose={{ ...poseOf(960 + sh, 0.95, 0.15), armL: { a: 40, b: -10 }, armR: { a: 40, b: -10 }, expr: t < 10 ? 'oops' : 'neutral', blink: 0 }} rimId="rimR" shadow={1} />
          {o.tug === 'legs' ? <path d={`M 1150 ${700 + Math.sin(t / 3) * 10} L 1010 ${740 + Math.sin(t / 3) * 10}`} stroke="#C8B898" strokeWidth={10} strokeLinecap="round" /> : null}
        </g>
        <Label t={t - 2} text={label} />
        {void f}
      </g>
    );
  };
  return Shot;
};
const poseOf = (x: number, s: number, yaw: number): Pose => ({
  ...basePose, x, y: LH.back - 140 * s, scale: s, facing: 1 as const, tilt: 0, spin: 0, headTilt: 0, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 },
  legL: { a: 4, b: 0 }, legR: { a: -4, b: 0 }, yaw, look: Math.sign(yaw) * 0.5, expr: 'neutral' as const, blink: 0, talk: 0,
});

/** Wind streaks across the screen. */
const Streaks: React.FC<{ t: number; o?: number }> = ({ t, o = 0.7 }) => (
  <g opacity={o}>
    {Array.from({ length: 14 }).map((_, i) => {
      const y = 80 + ((i * 137) % 920);
      const x = 2200 - (((t * 60) + i * 263) % 2800);
      return <path key={i} d={`M ${x} ${y} l ${-220 - (i % 3) * 80} ${10}`} stroke="#F2F8FF" strokeWidth={6 - (i % 3)} strokeLinecap="round" />;
    })}
  </g>
);

// ---------- S1: Ketil hands you a bucket and nods at the door ----------
export const S1 = scene({
  Set: DAY, setT: 30,
  cast: [
    { look: KETIL, x: 820, feet: LH.back, s: 1, yaw: 0.5, faces: [[0, 'happy']], keys: [{ f: 4, p: { armR: { a: 80, b: -10 } } }, { f: 30, p: { armR: { a: 120, b: -10 }, headTilt: -12 } }] },
    { look: YOU, x: 1120, feet: LH.back, s: 0.95, yaw: -0.4, faces: [[0, 'neutral'], [26, 'worried']] },
  ],
  cam: [[970, 620, 1.7], [980, 620, 1.8]],
  front: (t) => <Bucket x={kf(t, [[0, 900], [18, 1060]], easeOut)} y={kf(t, [[0, 640], [18, 700]], easeOut)} s={0.55} />,
});

// ---------- S2: water ----------
export const S2 = insert({
  Bg: DAY, dim: 0.35,
  draw: (t) => (
    <g>
      <g transform={`translate(960 760) rotate(${Math.sin(t / 6) * 6})`}><Bucket x={0} y={0} s={2.6} /></g>
      <Caption t={t - 2} text="WATER" y={180} />
    </g>
  ),
});

// ---------- S3: you step outside in your hoodie and your sneakers ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 815], [40, 900]], easeOut);
  return (
    <g transform={camT(kf(t, [[0, 860], [len, 900]]), 560, 1.6)}>
      <DAY_OUT t={t + 40} id="s3" />
      <Hero look={YOU} pose={{ ...walkPose(x, Math.min(t, 40) * 0.5, FEET + 10, 0.95, { expr: t < 30 ? 'neutral' : 'worried' }, 1) }} />
      <Breath x={x + 30} y={FEET - 300} t={t} s={0.5} />
    </g>
  );
};

// ---------- S4: the air hits you like a wall ----------
export const S4 = faceCU({
  look: YOU, Bg: DAY_OUT, faces: [[0, 'shock']], yaw: 0.1, zoom: [3.2, 3.0], pose: { tilt: -6, headTilt: -10 },
  extra: (t) => <Breath x={990} y={560} t={t * 2} s={0.6} />,
  front: (t) => <Streaks t={t} o={0.8} />,
  light: { x: 960, y: 520, kind: 'cool', o: 0.5 },
});

// ---------- S5: you breathe in and the inside of your nose freezes ----------
export const S5 = faceCU({
  look: YOU, Bg: DAY_OUT, faces: [[0, 'neutral'], [26, 'shock']], yaw: 0.05, zoom: [4.2, 4.8], light: { x: 960, y: 500, kind: 'cool', o: 0.6 },
  extra: (t) => (
    <g opacity={clamp((t - 18) / 14)}>
      {[[-8, 0], [6, -6], [14, 4], [-2, 8], [20, -2]].map(([dx, dy], i) => (
        <path key={i} d={`M ${966 + dx} ${510 + dy} m -6 0 l 12 0 m -6 -6 l 0 12 m -4 -4 l 8 8 m 0 -8 l -8 8`} stroke="#DFF4FF" strokeWidth={2.4} strokeLinecap="round" />
      ))}
    </g>
  ),
});

// ---------- S6: at minus thirty the moisture in your nose turns to ice in seconds ----------
export const S6 = bigWord({ kicker: 'AT −30°C, THE WATER IN YOUR NOSE', word: 'ICE', sub: 'IN SECONDS', Bg: DAY_OUT, size: 260, color: '#7FD4FF' });

// ---------- S7: watch the number ----------
export const S7 = faceCU({
  look: YOU, Bg: DAY_OUT, faces: [[0, 'worried']], yaw: 0.35, eyes: 0.9, zoom: [3.0, 3.2], pose: { headTilt: -12 },
  front: (t) => {
    const k = easeOut(clamp((t - 6) / 12));
    return <path d={`M 1300 420 Q 1560 300 ${1300 + 400 * k} ${420 - 300 * k}`} stroke="#7FD4FF" strokeWidth={14} fill="none" strokeLinecap="round" opacity={k} />;
  },
});

// ---------- S8: bare skin can freeze in 10 to 30 minutes ----------
export const S8 = factCard({ value: 30, label: 'AT −30°C, BARE SKIN CAN FREEZE IN', format: (v) => `10–${Math.round(v)} MIN`, sub: 'Environment Canada, wind chill index' });

// ---------- S9: add a little wind and it's under ten ----------
export const S9 = withCap(scene({
  Set: WIND_OUT, setT: 160,
  cast: [{ look: YOU, x: 960, feet: FEET + 10, s: 0.95, yaw: -0.2, faces: [[0, 'worried']], shiver: 2, pose: { armL: { a: 30, b: -110 }, armR: { a: 30, b: -110 }, tilt: -10 } }],
  cam: [[960, 600, 1.7], [960, 600, 1.8]],
  front: (t) => <Snowfall t={t * 2.5} n={140} wind={5} />,
}), 'WIND: UNDER 10 MIN', 4);

// ---------- S10: about forty seconds, then you run back in ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1300], [len, 830]], (q) => q);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1150], [len, 950]]), 560, 1.3)}>
        <DAY_OUT t={t + 200} id="s10" />
        <Hero look={YOU} pose={{ ...walkPose(x, t * 0.9, FEET + 10, 0.95, { expr: 'shock', tilt: -14, armL: { a: 70 + Math.sin(t * 0.9) * 40, b: -70 }, armR: { a: 70 - Math.sin(t * 0.9) * 40, b: -70 } }, -1) }} />
      </g>
      <Caption t={t} text="40 SECONDS" />
    </g>
  );
};

// ---------- S11: Gudrun sighs and dresses you like you're five ----------
export const S11 = scene({
  Set: DAY, setT: 260,
  cast: [
    { look: GUDRUN, x: 800, feet: LH.back, s: 0.97, yaw: 0.5, faces: [[0, 'tired'], [20, 'neutral']], pose: { armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 } } },
    { look: YOU, x: 1080, feet: LH.back, s: 0.95, yaw: -0.4, faces: [[0, 'oops']], shiver: 1.6 },
  ],
  cam: [[940, 620, 1.75], [950, 620, 1.85]],
});

// ---------- S12-S15: linen, wool tunic, wool trousers, leg wraps ----------
export const S12 = dress(LINEN, 'LINEN SHIRT', { setT: 300 });
export const S13 = dress(TUNIC, 'WOOL TUNIC', { setT: 340 });
export const S14 = dress(TROUSERS, 'WOOL TROUSERS', { setT: 370 });

// ---------- S15: wool wrapped tight from ankle to knee ----------
export const S15 = insert({
  Bg: DAY, dim: 0.35,
  draw: (t) => {
    const k = clamp(t / 50);
    return (
      <g>
        {[780, 1140].map((x, j) => (
          <g key={x}>
            <rect x={x - 60} y={140} width={120} height={720} fill="#5A4A3A" stroke={INK} strokeWidth={6} />
            {Array.from({ length: 12 }).map((_, i) => {
              const y = 840 - i * 52;
              const on = clamp(k * 13 - i - j * 0.5);
              return <path key={i} d={`M ${x - 64} ${y} L ${x + 64} ${y - 30}`} stroke="#B8A888" strokeWidth={34} strokeLinecap="round" opacity={on} />;
            })}
            <path d={`M ${x - 80} 900 L ${x - 70} 860 L ${x + 80} 860 Q ${x + 150} 870 ${x + 160} 900 Z`} fill="#6A4A2E" stroke={INK} strokeWidth={6} />
          </g>
        ))}
        <Label t={t - 4} text="LEG WRAPS" y={110} />
        <text x={1360} y={850} fontFamily={FONT.ui} fontSize={40} fill={WHITE} opacity={clamp((t - 10) / 6)}>ANKLE</text>
        <text x={1360} y={260} fontFamily={FONT.ui} fontSize={40} fill={WHITE} opacity={clamp((t - 40) / 6)}>KNEE</text>
      </g>
    );
  },
});

// ---------- S16: wool socks made with one needle: needle binding ----------
const NeedleSock: React.FC<{ t: number }> = ({ t }) => {
  const rows = Math.floor(clamp(t / 40) * 9);
  return (
    <g transform="translate(960 600) scale(1.6)">
      <path d="M -80 -260 L 60 -260 L 60 60 Q 220 60 230 150 Q 230 200 170 200 L -60 200 Q -100 200 -90 140 Z" fill="#9A8A70" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={i} d={`M -80 ${-240 + i * 46} ${Array.from({ length: 7 }).map(() => 'q 10 -18 20 0 q -4 14 0 0').join(' ')}`} stroke="#6A5A44" strokeWidth={4} fill="none" opacity={i < rows ? 1 : 0.15} />
      ))}
      <g transform={`translate(${70 + Math.sin(t / 4) * 20} ${-240 + rows * 46}) rotate(-30)`}>
        <rect x={-6} y={-90} width={12} height={150} rx={6} fill="#EEE6D2" stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={-70} r={4} fill={INK} />
      </g>
    </g>
  );
};
export const S16 = insert({ Bg: DAY, dim: 0.35, draw: (t) => <g><NeedleSock t={t} /><Label t={t - 6} text="NEEDLE BINDING" y={1000} /></g> });

// ---------- S17: mittens the same way ----------
export const S17 = insert({
  Bg: DAY, dim: 0.35,
  draw: (t) => (
    <g>
      <g transform={`translate(0 ${(1 - backOut(clamp(t / 10))) * 300})`}><Mittens x={960} y={560} s={2.4} /></g>
      <Label t={t - 6} text="MITTENS" y={960} />
    </g>
  ),
});

// ---------- S18: wool is the secret ----------
export const S18 = bigWord({ kicker: 'THE SECRET', word: 'WOOL', Bg: DAY, size: 260, color: '#E8DCC0' });

// ---------- S19: it soaks up about a third of its weight in water before it feels wet ----------
export const S19 = factCard({ value: 33, label: 'OF ITS WEIGHT IN WATER, BEFORE WOOL EVEN FEELS WET', format: (v) => `~${Math.round(v)}%`, sub: 'The Woolmark Company' });

// ---------- S20: cotton, like your hoodie, does the opposite ----------
export const S20 = insert({
  Bg: DAY, dim: 0.4,
  draw: (t) => {
    const x = easeOut(clamp((t - 14) / 8));
    return (
      <g>
        <g transform="translate(960 560) scale(2.3)">
          <path d="M -120 -110 Q -60 -150 0 -130 Q 60 -150 120 -110 L 190 40 L 130 70 L 100 -10 L 100 170 L -100 170 L -100 -10 L -130 70 L -190 40 Z" fill={LOOKS.you.jacket} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
          <path d="M -50 -130 Q 0 -60 50 -130" fill={LOOKS.you.jacketShade} stroke={INK} strokeWidth={5} />
          <path d="M -24 -100 L -24 -40 M 24 -100 L 24 -40" stroke={WHITE} strokeWidth={5} />
          {[[-60, 40], [40, 90], [70, 0]].map(([a, b], i) => <path key={i} d={`M ${a} ${b} q 8 16 0 22 q -8 -6 0 -22`} fill="#6AA8D8" opacity={clamp((t - 4 - i * 3) / 4)} />)}
        </g>
        <g opacity={x} stroke="#E8303A" strokeWidth={34} strokeLinecap="round">
          <path d={`M ${660} ${260} L ${660 + 600 * x} ${260 + 600 * x}`} />
          <path d={`M ${1260} ${260} L ${1260 - 600 * x} ${260 + 600 * x}`} />
        </g>
        <Label t={t - 18} text="COTTON: WET = COLD" y={1000} />
      </g>
    );
  },
});

// ---------- S21: a heavy wool cloak, pinned at the shoulder with a brooch ----------
export const S21: React.FC<ShotProps> = (p) => {
  const D = dress(CLOAKED, 'CLOAK + BROOCH', { setT: 420 });
  const g = clamp((p.t - 16) / 6) * (1 - clamp((p.t - 30) / 10));
  return (
    <g>
      <D {...p} />
      <g opacity={g} transform="translate(1035 345)">
        <path d="M -40 0 L 40 0 M 0 -40 L 0 40" stroke="#FFF4C0" strokeWidth={8} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------- S22: a fur hat ----------
export const S22 = faceCU({
  look: YOU_WOOL, Bg: DAY, faces: [[0, 'neutral'], [18, 'happy']], yaw: 0.2, zoom: [3.2, 3.0],
  front: (t) => <Label t={t - 4} text="FUR HAT" y={980} />,
});

// ---------- S23: leather shoes, which Asa stuffs with dry grass ----------
export const S23 = insert({
  Bg: DAY, dim: 0.35,
  draw: (t) => (
    <g>
      <GrassShoe x={960} y={760} s={2.6} grass={clamp((t - 8) / 30)} />
      {Array.from({ length: 8 }).map((_, i) => {
        const q = clamp((t - i * 5) / 14);
        return <path key={i} d={`M ${880 + i * 22} ${200 + q * 380} l ${(i % 3 - 1) * 16} 70`} stroke="#D8C870" strokeWidth={9} strokeLinecap="round" opacity={q < 1 ? 1 : 0} />;
      })}
    </g>
  ),
});
export const S24 = faceCU({ look: ASA, Bg: DAY, faces: [[0, 'happy']], yaw: -0.25, zoom: [3.6, 3.9], pose: { headTilt: 8 },
  extra: (t) => <g opacity={0.9}>{[0, 1, 2].map((i) => <text key={i} x={1060 + i * 40} y={440 - ((t * 2 + i * 20) % 60)} fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#FFD23A">ha</text>)}</g> });

// ---------- S25: the grass traps air and soaks up sweat ----------
export const S25 = insert({
  Bg: DAY, dim: 0.45,
  draw: (t) => (
    <g>
      <GrassShoe x={900} y={780} s={2.8} grass={1} />
      {[[760, 520], [900, 470], [1040, 520]].map(([x, y], i) => <circle key={i} cx={x} cy={y - ((t + i * 12) % 36) * 2} r={16} fill="none" stroke="#BFE6FF" strokeWidth={5} opacity={clamp((t - i * 4) / 6)} />)}
      <text x={1360} y={500} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#BFE6FF" opacity={clamp((t - 4) / 6)}>TRAPS AIR</text>
      <text x={1360} y={600} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFD23A" opacity={clamp((t - 30) / 6)}>SOAKS UP SWEAT</text>
    </g>
  ),
});

// ---------- S26: people in the North did this for hundreds of years: the family in wool ----------
export const S26 = scene({
  Set: DAY, setT: 520,
  cast: [
    { look: KETIL, x: 620, feet: LH.back, s: 1, yaw: 0.4, faces: [[0, 'happy']] },
    { look: GUDRUN, x: 820, feet: LH.back, s: 0.97, yaw: 0.3, faces: [[0, 'neutral']] },
    { look: ASA, x: 990, feet: LH.back, s: 0.72, yaw: 0.2, faces: [[0, 'happy']] },
    { look: YOU_WOOL, x: 1200, feet: LH.back, s: 0.95, yaw: -0.3, faces: [[0, 'neutral'], [30, 'smug']] },
  ],
  cam: [[910, 620, 1.45], [920, 620, 1.55]],
});

// ---------- S27: you step outside again ----------
export const S27: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 815], [40, 920]], easeOut);
  return (
    <g transform={camT(kf(t, [[0, 880], [len, 920]]), 560, 1.6)}>
      <DAY_OUT t={t + 260} id="s27" />
      <Hero look={YOU_WOOL} pose={{ ...walkPose(x, Math.min(t, 40) * 0.5, FEET + 10, 0.95, { expr: 'neutral' }, 1) }} />
      <Breath x={x + 30} y={FEET - 300} t={t} s={0.5} />
    </g>
  );
};

// ---------- S28: the cold is still there ----------
export const S28 = faceCU({ look: YOU_WOOL, Bg: DAY_OUT, faces: [[0, 'neutral'], [26, 'smug']], yaw: 0.25, zoom: [3.0, 3.2], light: { x: 980, y: 520, kind: 'cool', o: 0.4 },
  extra: (t) => <Breath x={995} y={560} t={t} s={0.5} /> });

// ---------- S29: but now it's outside the clothes and you're inside them ----------
export const S29: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 600, kf(t, [[0, 1.9], [Math.max(1, len), 2.0]]))}>
      <DAY_OUT t={t + 300} id="s29" />
      <Glow x={960} y={560} r={260} kind="warm" o={0.6} />
      <Hero look={YOU_WOOL} pose={{ ...poseOf(960, 0.95, 0.1), y: FEET + 10 - 140 * 0.95, expr: 'smug' }} rimId="rimR" shadow={1} />
      {[-1, 1].map((d) => [0, 1, 2].map((i) => {
        const q = ((t + i * 10) % 30) / 30;
        const x = 960 + d * (420 - 240 * Math.min(q * 1.4, 1));
        return <path key={`${d}${i}`} d={`M ${x} ${440 + i * 120} l ${-d * 50} 0 m ${d * 18} -18 l ${-d * 18} 18 l ${d * 18} 18`} stroke="#7FD4FF" strokeWidth={9} strokeLinecap="round" fill="none" opacity={1 - Math.max(0, q - 0.7) * 3} />;
      }))}
    </g>
    <g opacity={clamp((t - 4) / 6)}><rect x={420 - 280} y={116} width={560} height={96} rx={48} fill="#0B0816" opacity={0.8} /><text x={420} y={184} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#7FD4FF">COLD OUT HERE</text></g>
    <g opacity={clamp((t - 30) / 6)}><rect x={1500 - 280} y={116} width={560} height={96} rx={48} fill="#0B0816" opacity={0.8} /><text x={1500} y={184} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FF8A3D">WARM IN HERE</text></g>
  </g>
);

// ---------- S30: the well is frozen ----------
export const S30 = scene({ Set: outside({ tod: 'day', door: 0.6, snow: 0.3 }), setT: 340, cam: [[1560, 650, 2.6], [1560, 660, 2.8]],
  front: () => <ellipse cx={1560} cy={690} rx={70} ry={14} fill="#DDEEFF" stroke={INK} strokeWidth={3} /> });

// ---------- S31: Ketil smashes the ice with an axe ----------
export const S31 = insert({
  Bg: DAY_OUT, dim: 0.3,
  draw: (t) => {
    const hit = 14;
    const rot = kf(t, [[0, -80], [hit, 10], [hit + 8, 0]], easeOut);
    const cr = clamp((t - hit) / 6);
    return (
      <g transform={t >= hit && t < hit + 8 ? `translate(${Math.sin(t * 3) * 10} 0)` : undefined}>
        <ellipse cx={960} cy={800} rx={520} ry={130} fill="#DDEEFF" stroke={INK} strokeWidth={8} />
        <g opacity={cr} stroke="#7A9ABA" strokeWidth={6} strokeLinecap="round" fill="none">
          <path d="M 960 790 L 760 740 L 640 770 M 960 790 L 1120 720 L 1260 750 M 960 790 L 1000 880 M 960 790 L 840 860 L 720 900" />
          <ellipse cx={960} cy={800} rx={110 * cr} ry={30 * cr} fill="#1A3A5A" stroke="none" />
        </g>
        {t >= hit ? [0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={960 + Math.cos(i) * (t - hit) * 18} y={760 - (t - hit) * 20 + (t - hit) * (t - hit) * 0.9} width={24} height={16} fill="#EEF6FF" stroke={INK} strokeWidth={3} transform={`rotate(${i * 30} 960 760)`} />) : null}
        <g transform={`translate(1500 260) rotate(${rot}) translate(-1500 -260)`}>
          <Axe x={1000} y={760} s={2.4} rot={-70} />
        </g>
      </g>
    );
  },
});

// ---------- S32: you fill the bucket ----------
export const S32 = insert({ Bg: DAY_OUT, dim: 0.35, draw: (t) => <Bucket x={960} y={860} s={3} water={clamp(t / 40)} /> });

// ---------- S33: then you haul firewood ----------
export const S33: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1700], [len, 1250]], (q) => q);
  return (
    <g transform={camT(kf(t, [[0, 1550], [len, 1350]]), 600, 1.5)}>
      <DAY_OUT t={t + 380} id="s33" />
      <Hero look={YOU_WOOL} pose={{ ...walkPose(x, t * 0.4, FEET + 10, 0.95, { expr: 'tired', armL: { a: 80, b: -80 }, armR: { a: 80, b: -80 }, tilt: 6 }, -1) }} />
      {[0, 1, 2].map((i) => <Log key={i} x={x - 30} y={FEET - 210 - i * 40} s={0.55} rot={4 - i * 4} />)}
      <Breath x={x - 40} y={FEET - 310} t={t} d={-1} s={0.5} />
    </g>
  );
};

// ---------- S34: a lot of firewood ----------
export const S34 = insert({
  Bg: DAY_OUT, dim: 0.3,
  draw: (t) => {
    const n = Math.floor(clamp(t / 40) * 28);
    return (
      <g>
        {Array.from({ length: n }).map((_, i) => {
          const row = Math.floor(i / 7), col = i % 7;
          return <g key={i} transform={`translate(${520 + col * 140 + (row % 2) * 70} ${880 - row * 100})`}><ellipse rx={64} ry={48} fill="#D8B888" stroke={INK} strokeWidth={6} /><ellipse rx={30} ry={22} fill="none" stroke="#A88858" strokeWidth={4} /></g>;
        })}
      </g>
    );
  },
});

// ---------- S35: a farm like this burns through a mountain of it every winter ----------
export const S35 = withCap(scene({
  Set: DAY_OUT, setT: 420, cam: [[1500, 560, 1.3], [1460, 560, 1.2]],
  back: () => (
    <g>
      {Array.from({ length: 60 }).map((_, i) => {
        const row = Math.floor(i / 12), col = i % 12;
        return <ellipse key={i} cx={1620 + col * 52 - row * 6 + (row % 2) * 26} cy={790 - row * 40} rx={26} ry={20} fill="#D8B888" stroke={INK} strokeWidth={3} />;
      })}
    </g>
  ),
}), 'A MOUNTAIN OF WOOD', 4);

// ---------- S36: and every log was cut by hand ----------
export const S36 = insert({
  Bg: DAY_OUT, dim: 0.3,
  draw: (t) => {
    const hit = 12;
    const sp = clamp((t - hit) / 6);
    return (
      <g>
        <rect x={760} y={800} width={400} height={120} rx={20} fill="#7A5232" stroke={INK} strokeWidth={6} />
        <g transform={`translate(${-70 * sp} 0) rotate(${-10 * sp} 960 800)`}><rect x={860} y={560} width={100} height={240} fill="#C8A070" stroke={INK} strokeWidth={6} /></g>
        <g transform={`translate(${70 * sp} 0) rotate(${10 * sp} 960 800)`}><rect x={960} y={560} width={100} height={240} fill="#C8A070" stroke={INK} strokeWidth={6} /></g>
        <g transform={`rotate(${kf(t, [[0, -60], [hit, 0]], easeOut)} 1400 300)`}><Axe x={990} y={560} s={2} rot={-60} /></g>
        <Label t={t - 18} text="BY HAND" y={180} />
      </g>
    );
  },
});

// ---------- S37: and you have to do all of it fast ----------
export const S37: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 500], [len, 1400]], (q) => q);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1200]]), 600, 1.4)}>
      <DAY_OUT t={t + 460} id="s37" />
      <Hero look={YOU_WOOL} pose={{ ...walkPose(x, t * 0.9, FEET + 10, 0.95, { expr: 'worried', tilt: 12 }, 1) }} />
      <Bucket x={x + 50} y={FEET - 100} s={0.45} water={1} />
    </g>
  );
};

// ---------- S38: because in January this far north... ----------
export const S38: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [Math.max(1, len), 500]]), 1.0)}>
    <Farmyard t={t + 500} tod="dusk" door={0.6} snow={0.3} />
  </g>
);

// ---------- S39: the sun is only up for about five hours ----------
export const S39 = bigWord({ kicker: 'DAYLIGHT IN JANUARY', word: '~5 HOURS', Bg: DUSK_OUT, size: 220, color: '#FFD23A' });

void [KETIL_OUT, at, Glow, NameTag, TROUSERS, WRAPS, clamp];
