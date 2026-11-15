import React from 'react';
import {
  Hero, Pose, ShotProps, basePose, camT, kf, clamp, idleBlink, factCard, Schematic, SCH, SchLabel, Glow, FONT, Smartphone, walkPose, LOOKS,
} from '../../../engine';
import { YOU, MO, ELLIE, MOM, MODAD, SUIT, faceCU, bigWord, span, Soft } from '../common';
import { FadeStreet, SkyUp, Tunnel, Bus, Megaphone, ShoutLines, Thermo, HospitalLit, hospStand, LightDot, STREETM } from '../sets';
import { streetShot, withHud, Caption, onStreet } from '../kit';
import words from './words.json';

// Chapter 5, someone notices: hour 25, light loses a race to Usain Bolt; no sunrise, frost; the man in the suit walks
// down the street with a megaphone (shouting is the fastest way to talk now): shelters underground, buses at noon.
// Why underground (the ground keeps its temperature). Ellie's cat can come. Is there room for everyone? No answer.
// Then you remember: Mom is at the hospital across town.

const W = words;
const FROST: React.FC<{ t: number; id?: string }> = ({ t, id }) => (
  <g>
    <FadeStreet t={t} id={id} sun={0} stars={0.25} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#9AC8F0" opacity={0.1} />
  </g>
);
const megaPose = (o: Partial<Pose> = {}): Partial<Pose> => ({ armR: { a: 100, b: -60 }, ...o });
const Mega: React.FC<{ p: Pose }> = ({ p }) => <Megaphone x={p.x + 50 * p.scale} y={p.y - 120 * p.scale} s={p.scale * 0.9} rot={-10} />;

// ---------- S1: HOUR 25 ----------
export const S1 = withHud(bigWord({ kicker: 'HOUR 25 · 8:00 AM', word: 'SLOWER THAN A SPRINTER', color: '#FFD23A', Bg: FROST, size: 120 }), 25, '8:00 AM');

// ---------- S2: 9.58 s ----------
export const S2 = factCard({ value: 9.58, suffix: ' s', label: 'USAIN BOLT, 100 METRES', format: (v) => v.toFixed(2), sub: 'World Athletics: Berlin, 2009, about 10.4 m/s' });

// ---------- S3: the race on a track: a sprinter pulls away from a dot of light ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len));
  const run = walkPose(300 + 1300 * k, t * 1.1, 900, 0.8, { expr: 'happy', tilt: 16, blink: idleBlink(t, 2), armL: { a: 60 * Math.sin(t * 1.1), b: 80 }, armR: { a: -60 * Math.sin(t * 1.1), b: 80 } });
  const lx = 300 + 1300 * k * 0.86;
  return (
    <g>
      <rect width={1920} height={1080} fill="#1A1A2A" />
      <rect x={0} y={720} width={1920} height={360} fill="#A8463A" />
      {[780, 860, 940, 1020].map((y) => <line key={y} x1={0} x2={1920} y1={y} y2={y} stroke="#F6EFE3" strokeWidth={5} opacity={0.7} />)}
      <line x1={1700} x2={1700} y1={720} y2={1080} stroke="#F6EFE3" strokeWidth={14} />
      <Hero look={{ ...LOOKS.worker, jacket: '#E8C84A', jacketShade: '#C8A83A', hat: undefined }} pose={run} />
      <circle cx={lx} cy={900} r={22} fill="#FFF2B8" />
      <Glow x={lx} y={900} r={120} kind="warm" o={0.9} />
      <text x={lx} y={980} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FFF2B8">LIGHT</text>
      <Caption t={t} text="LIGHT LOSES" y={240} size={110} />
    </g>
  );
};

// ---------- S4: no sunrise: the street at 8 AM, black sky, frost ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <FROST t={t + 100} />
    {Array.from({ length: 50 }).map((_, i) => <circle key={i} cx={(i * 137) % 1920} cy={((i * 71) + t * 2) % 1080} r={3} fill="#E8F4FF" opacity={0.6} />)}
  </g>
);

// ---------- S5: the man in the suit walks down the middle of the street, megaphone up ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1700], [len, 1150]], (k) => k);
  const p = walkPose(x, t * 0.55, STREETM.feet + 60, 0.9, { expr: 'neutral', blink: idleBlink(t, 3), ...megaPose() }, -1);
  return (
    <g transform={camT(kf(t, [[0, 1300], [len, 1100]]), 540, 1.15)}>
      <FROST t={t + 160} />
      <Hero look={SUIT} pose={p} />
      <Mega p={p} />
    </g>
  );
};

// ---------- S6: close, the suit shouting into the megaphone, sound lines rolling out ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const p: Pose = { ...basePose, x: 960, y: 700, scale: 1, yaw: -0.4, expr: 'shock', blink: idleBlink(t, 4), talk: 0.6 + 0.3 * Math.sin(t / 2), ...megaPose({ armR: { a: 120, b: -80 } }) };
  return (
    <g>
      <Soft blur={16} dim={0.2}><g transform={camT(960, 520, 1.6)}><FROST t={t + 200} /></g></Soft>
      <g transform={camT(960, 540, kf(t, [[0, 3.0], [len, 3.15]]))}>
        <Hero look={SUIT} pose={p} shadow={0} />
        <Megaphone x={890} y={500} s={1} rot={190} />
        <ShoutLines x={780} y={500} t={t} dir={-1} />
      </g>
    </g>
  );
};

// ---------- S7: SOUND BEATS LIGHT ----------
export const S7 = bigWord({ kicker: 'NOW', word: 'SOUND BEATS LIGHT', color: '#FFD23A', Bg: FROST, size: 140 });

// ---------- S8: wide, the suit in the street, neighbours in their coats around him ----------
export const S8 = streetShot({
  sun: 0, stars: 0.25, words: W,
  cam: { from: [960, 540, 1.1], to: [960, 540, 1.16] },
  cast: [
    { look: MOM, x: 420, scale: 0.85, yaw: 0.4, faces: [[0, 'worried']] },
    { look: ELLIE, x: 560, scale: 0.6, yaw: 0.4, faces: [[0, 'worried']] },
    { look: SUIT, x: 960, scale: 0.9, yaw: 0.2, faces: [[0, 'neutral']], talk: [span(W, "'Listen", 'noon', 1)], pose: () => megaPose() },
    { look: MODAD, x: 1350, scale: 0.85, yaw: -0.4, faces: [[0, 'worried']] },
    { look: MO, x: 1500, scale: 0.75, yaw: -0.4, faces: [[0, 'worried']] },
  ],
  front: () => <Megaphone x={1010} y={STREETM.feet - 230 * 0.9 - 110} s={0.8} rot={-10} />,
});

// ---------- S9: subway tunnels, lamps strung along: SHELTERS ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.1]]))}><Tunnel t={t} /></g>
    <Caption t={t} text="SHELTERS" y={220} size={110} />
  </g>
);

// ---------- S10: the buses lined up at the station, NOON ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <FROST t={t + 300} />
    <Bus x={500} y={STREETM.kerb + 110} s={0.75} />
    <Bus x={1350} y={STREETM.kerb + 110} s={0.75} />
    <Caption t={t} text="NOON" y={260} size={140} />
  </g>
);

// ---------- S11: why underground: a cut through the ground, -30 at the surface, steady a few metres down ----------
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#06060E" />
    <rect x={0} y={0} width={1920} height={360} fill="#0A0A18" />
    {Array.from({ length: 40 }).map((_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 53) % 300} r={2} fill="#8A8AAA" />)}
    <rect x={0} y={360} width={1920} height={40} fill="#E8F4FF" />
    <rect x={0} y={400} width={1920} height={680} fill="#4A3A30" />
    {Array.from({ length: 30 }).map((_, i) => <circle key={`r${i}`} cx={(i * 173) % 1920} cy={440 + ((i * 97) % 600)} r={8 + (i % 4) * 4} fill="#3A2E26" />)}
    <path d="M 760 1080 L 760 820 Q 960 720 1160 820 L 1160 1080 Z" fill="#2A2C34" stroke="#100E16" strokeWidth={8} />
    <Glow x={960} y={900} r={220} kind="warm" o={0.7} />
    <text x={1500} y={250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#9AD8FF" opacity={clamp(t / 8)}>-30°C</text>
    <text x={1500} y={900} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFB15A" opacity={clamp((t - 20) / 8)}>+12°C</text>
    <line x1={1300} y1={400} x2={1300} y2={780} stroke="#F6EFE3" strokeWidth={4} strokeDasharray="10 10" opacity={clamp((t - 20) / 8)} />
    <text x={1270} y={600} textAnchor="end" fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3" opacity={clamp((t - 20) / 8)}>A FEW METRES</text>
  </g>
);

// ---------- S12: the same, all year: a thermometer underground that doesn't move ----------
export const S12: React.FC<ShotProps> = ({ t }) => {
  const seasons = ['SUMMER', 'WINTER', 'SUN', 'NO SUN'];
  const k = Math.min(3, Math.floor(t / 22));
  return (
    <g>
      <Schematic t={t} id="c5gr" />
      <Thermo x={960} y={720} p={0.45} s={1.0} label="SAME" />
      <SchLabel x={960} y={150} t={t} text={seasons[k]} size={60} color={SCH.live} />
      <g opacity={clamp((t - 80) / 6)} transform="translate(960 980)">
        <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#0B0816" stroke={SCH.live} strokeWidth={3} />
        <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
      </g>
    </g>
  );
};

// ---------- S13: down in the tunnel, people settling in on camp beds ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => <g transform={camT(1080, 560, kf(t, [[0, 1.3], [len, 1.4]]))}><Tunnel t={t + 90} /></g>;

// ---------- S14: other streets: a soldier and a teacher with megaphones too ----------
export const S14 = streetShot({
  sun: 0, stars: 0.25,
  cam: { from: [960, 540, 1.0], to: [1000, 540, 1.04] },
  cast: [
    { look: { ...LOOKS.cop, jacket: '#4A5A3A', jacketShade: '#3A4A2E', hatColor: '#3A4A2E' }, x: 520, scale: 0.85, yaw: 0.3, faces: [[0, 'neutral']], pose: (t) => ({ ...megaPose(), talk: 0.5 + 0.3 * Math.sin(t / 2) }) },
    { look: LOOKS.lady, x: 1400, scale: 0.85, yaw: -0.3, faces: [[0, 'worried']], pose: (t) => ({ ...megaPose(), talk: 0.5 + 0.3 * Math.sin(t / 2.3) }) },
  ],
  front: (t) => (
    <g>
      <ShoutLines x={620} y={480} t={t} />
      <ShoutLines x={1300} y={480} t={t + 5} dir={-1} />
    </g>
  ),
});

// ---------- S15: Ellie tugs the suit's sleeve: can my cat come? ----------
export const S15 = streetShot({
  sun: 0, stars: 0.25, words: W,
  cam: { from: [1000, 560, 1.7], to: [1000, 560, 1.8] },
  cast: [
    { look: SUIT, x: 1080, scale: 0.9, yaw: -0.4, faces: [[0, 'neutral']], pose: () => ({ headTilt: 10, look: -0.8 }) },
    { look: ELLIE, x: 900, scale: 0.6, yaw: 0.5, faces: [[0, 'worried']], talk: [span(W, "'Can", 'come', 1)], pose: () => ({ armR: { a: 70, b: -10 }, headTilt: -12 }) },
  ],
});

// ---------- S16: close, the suit looks down at her, a long moment: yes, the cat can come ----------
export const S16 = faceCU({ look: SUIT, Bg: FROST, faces: [[0, 'neutral'], [40, 'happy']], yaw: -0.3, eyes: -0.5, zoom: [3.1, 3.2], words: W, talk: span(W, "'Yes", 'come', 1), pose: { headTilt: 12 } });

// ---------- S17: Mo's dad: is there room for everyone? ----------
export const S17 = faceCU({ look: MODAD, Bg: FROST, faces: [[0, 'worried']], yaw: 0.35, zoom: [3.1, 3.25], words: W, talk: span(W, "'Is", 'everyone', 1) });

// ---------- S18: the suit says nothing; the megaphone comes down ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const a = kf(t, [[0, 100], [len * 0.8, 20]]);
  const p: Pose = { ...basePose, x: 960, y: 700, scale: 1, yaw: -0.3, expr: 'tired', blink: idleBlink(t, 6), look: 0.4, armR: { a, b: -60 + (100 - a) * 0.5 } };
  return (
    <g>
      <Soft blur={16} dim={0.25}><g transform={camT(960, 520, 1.6)}><FROST t={t + 400} /></g></Soft>
      <g transform={camT(960, 560, kf(t, [[0, 2.4], [len, 2.6]]))}><Hero look={SUIT} pose={p} shadow={0} /></g>
    </g>
  );
};

// ---------- S19: wide, the suit walks on, calling back over his shoulder: the buses won't wait ----------
export const S19 = streetShot({
  sun: 0, stars: 0.25, words: W,
  cam: { from: [960, 540, 1.1], to: [960, 540, 1.14] },
  cast: [
    { look: MOM, x: 420, scale: 0.85, yaw: 0.4, faces: [[0, 'worried']] },
    { look: YOU, x: 700, scale: 0.8, yaw: 0.4, faces: [[0, 'worried']] },
    { look: SUIT, x: 1300, scale: 0.9, yaw: -0.3, faces: [[0, 'neutral']], talk: [span(W, "'Be", 'wait', 1)] },
  ],
});

// ---------- S20: close, you: then you remember ----------
export const S20 = faceCU({ look: YOU, Bg: FROST, faces: [[0, 'neutral'], [10, 'shock']], yaw: 0.25, zoom: [3.2, 3.5] });

// ---------- S21: the hospital: a long lit corridor, Mom far down it in scrubs ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const s = hospStand(0.5, 0.75);
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <HospitalLit t={t} />
      <Hero look={{ ...MOM, jacket: '#5AA8A0', jacketShade: '#4A8A84' }} pose={{ ...basePose, ...s, yaw: 0.3, expr: 'tired', blink: idleBlink(t, 2) }} />
    </g>
  );
};

// ---------- S22: your phone: "Mom where are you??" — sending... sending... ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.5}><FROST t={t + 500} /></Soft>
    <g transform={`translate(960 560) scale(${kf(t, [[0, 1.25], [len, 1.32]])}) translate(-960 -560)`}>
      <Smartphone x={960} y={560} s={1.2} mode="message" t={t} text="Mom where are you??" />
      <rect x={800} y={740} width={320} height={50} rx={12} fill="#0B0816" opacity={0.85} />
      <text x={960} y={774} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#FF8A3D">{`SENDING${'.'.repeat(1 + (Math.floor(t / 10) % 3))}`}</text>
    </g>
  </g>
);

// ---------- S23: the map: home, the hospital 3 km away, the station; the clock to noon ----------
export const S23: React.FC<ShotProps> = ({ t }) => {
  const pts = { home: [400, 700], hosp: [1500, 360], stat: [1100, 820] };
  return (
    <g>
      <Schematic t={t} id="c5map" />
      <path d={`M ${pts.home[0]} ${pts.home[1]} Q 900 400 ${pts.hosp[0]} ${pts.hosp[1]}`} stroke="#FFD23A" strokeWidth={8} strokeDasharray="20 14" fill="none" />
      <path d={`M ${pts.home[0]} ${pts.home[1]} L ${pts.stat[0]} ${pts.stat[1]}`} stroke={SCH.dim} strokeWidth={6} strokeDasharray="12 12" fill="none" />
      {[['HOME', pts.home], ['HOSPITAL', pts.hosp], ['STATION', pts.stat]].map(([n, p]) => (
        <g key={n as string}>
          <circle cx={(p as number[])[0]} cy={(p as number[])[1]} r={26} fill={SCH.live} stroke={SCH.line} strokeWidth={5} />
          <text x={(p as number[])[0]} y={(p as number[])[1] - 46} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={SCH.line}>{n as string}</text>
        </g>
      ))}
      <text x={980} y={470} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFD23A">3 KM</text>
      <text x={1600} y={1000} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FF5A5A">BUSES: 12:00</text>
      <LightDot x0={400} y0={700} x1={1500} y1={360} p={-1} />
    </g>
  );
};
