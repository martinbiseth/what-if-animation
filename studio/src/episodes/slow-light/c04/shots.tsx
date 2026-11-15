import React from 'react';
import {
  Hero, Pose, ShotProps, basePose, camT, kf, clamp, idleBlink, factCard, chapterCard, Schematic, SCH, SchLabel, Glow, FONT, Smartphone, backOut,
} from '../../../engine';
import { YOU, MO, ELLIE, MOM, faceCU, bigWord, iconBoard, Soft } from '../common';
import { FadeStreet, SunEarth, LightDot, Thermo, STREETM } from '../sets';
import { LivingRoom, LIVING, Car } from '../../electricity/sets';
import { withHud, Caption, Stopwatch } from '../kit';
import words from './words.json';

// Chapter 4, the catch: why the Sun went dark (light halving faster than it could cross), what that means (heat:
// below freezing in a week, -73 C in a year; no plants), then the signals: GPS, maps, ships, a taxi in a lake; the
// family camping around one heater; a call that takes two hours; and at 3 AM light falls below the speed of sound.

const W = words as { w: string; s: number; e: number }[];
const ws = (w: string, n = 1) => { let k = 0; const x = W.find((q) => q.w.replace(/[^\w]/g, '').toLowerCase() === w.toLowerCase() && ++k === n); return x ? x.s : 0; };
const rel = (a: string, b: string, na = 1, nb = 1) => Math.round((ws(b, nb) - ws(a, na)) * 30) + 2;
const NIGHT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <FadeStreet t={t} id={id} sun={0} stars={0.3} />;
const ROOM: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={1} />;

// ---------- S1: chapter card ----------
export const S1 = chapterCard({ kicker: 'CHAPTER 4', title: 'THE CATCH', ground: 'schematic' });

// ---------- S2: 8 min 20 s ----------
export const S2 = factCard({ value: 500, label: 'SUNLIGHT, SUN TO EARTH', format: (v) => `${Math.floor(v / 60)} min ${Math.round(v % 60)} s`, sub: 'NASA: 150 million km at 299,792 km/s' });

// ---------- S3: the diagram: light leaving the Sun, the packets slowing every hour ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => <SunEarth t={t} speed={kf(t, [[0, 2], [len, 0.5]])} label="LIGHT HALVES FASTER THAN IT CAN CROSS" />;

// ---------- S4: the packets stall half way. NEVER ARRIVES. ----------
export const S4: React.FC<ShotProps> = ({ t }) => <SunEarth t={t} speed={0.6} stall={0.62} cut={rel('Any', 'never')} label="ANY LIGHT THAT LEFT AFTER 10:20 AM" earthDim={clamp((t - 60) / 60) * 0.6} />;

// ---------- S5: CUT OFF ----------
export const S5 = bigWord({ kicker: "THE SUN DIDN'T GO OUT", word: 'CUT OFF', color: '#FF5A5A', size: 230 });

// ---------- S6: the thermometer, warm, the Sun's glow on it: sunlight is heat ----------
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="c4th" />
    <Glow x={500} y={420} r={360} kind="warm" o={0.6} />
    <circle cx={500} cy={420} r={110} fill="#FFC94A" stroke="#FF8A3D" strokeWidth={8} />
    <Thermo x={1200} y={700} p={0.7} s={1.1} label="HEAT" />
    <SchLabel x={960} y={150} t={t} text="SUNLIGHT IS HEAT" size={46} color={SCH.live} />
  </g>
);

// ---------- S7: one week: below freezing ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="c4t2" />
    <Thermo x={900} y={720} p={kf(t, [[0, 0.7], [len, 0.38]])} s={1.1} label={t > len * 0.6 ? '0°C' : ''} />
    <SchLabel x={960} y={150} t={t} text="WITHOUT SUNLIGHT: 1 WEEK" size={46} color={SCH.live} />
  </g>
);

// ---------- S8: one year: -73 C ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="c4t3" />
    <Thermo x={900} y={720} p={kf(t, [[0, 0.38], [len * 0.6, 0.04]])} s={1.1} label={t > len * 0.4 ? '-73°C' : ''} />
    <SchLabel x={960} y={150} t={t} text="1 YEAR" size={46} color={SCH.live} />
    <g opacity={clamp((t - rel('Within', "That's", 1, 1)) / 6)} transform="translate(960 980)">
      <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#0B0816" stroke={SCH.live} strokeWidth={3} />
      <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
    </g>
  </g>
);

// ---------- S9: no plants, no crops, no food ----------
export const S9 = iconBoard({
  title: 'NO SUNLIGHT',
  items: [
    { name: 'wheat', label: 'PLANTS', at: 2, cross: rel('No', 'growing') },
    { name: 'tractor', label: 'CROPS', at: rel('No', 'crops'), cross: rel('No', 'crops') + 8 },
    { name: 'fridge', label: 'FOOD', at: rel('No', 'food'), cross: rel('No', 'food') + 8 },
  ],
});

// ---------- S10: SIGNALS ----------
export const S10 = bigWord({ kicker: 'THEN THE SIGNALS GO', word: 'GPS', color: '#5AE0FF', size: 260 });

// ---------- S11: 20,200 km ----------
export const S11 = factCard({ value: 20200, suffix: ' km', label: 'HOW HIGH GPS SATELLITES FLY', sub: 'GPS.gov: medium Earth orbit' });

// ---------- S12: your phone and three satellites: signals timed to a billionth of a second ----------
const Sat: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-30} y={-30} width={60} height={60} rx={6} fill="#C8CCD4" stroke="#100E16" strokeWidth={6} />
    <rect x={-130} y={-20} width={90} height={40} fill="#3A5A9A" stroke="#100E16" strokeWidth={5} />
    <rect x={40} y={-20} width={90} height={40} fill="#3A5A9A" stroke="#100E16" strokeWidth={5} />
  </g>
);
export const S12: React.FC<ShotProps> = ({ t }) => {
  const sats = [[400, 220], [960, 140], [1520, 220]];
  return (
    <g>
      <Schematic t={t} id="c4gps" />
      <path d="M -100 1080 Q 960 760 2020 1080" fill="#2E6AB8" stroke={SCH.line} strokeWidth={6} />
      {sats.map(([x, y], i) => <Sat key={i} x={x} y={y} s={0.9} />)}
      {sats.map(([x, y], i) => [0, 0.5].map((d) => <LightDot key={`${i}${d}`} x0={x} y0={y + 40} x1={960} y1={820} p={((t * 0.03 + i * 0.2 + d) % 1)} r={8} color="#5AE0FF" />))}
      <Smartphone x={960} y={880} s={0.3} mode="map" t={t} />
      <SchLabel x={960} y={560} t={t - 10} text="TIMED TO A BILLIONTH OF A SECOND" size={40} color={SCH.live} />
    </g>
  );
};

// ---------- S13: a map on a phone, the blue dot jumping, wrong, wrong again ----------
export const S13 = withHud(((p: ShotProps) => {
  const { t, len } = p;
  const j = Math.floor(t / 12);
  return (
    <g>
      <Soft blur={16} dim={0.5}><NIGHT t={t + 200} /></Soft>
      <g transform={`translate(960 560) scale(${kf(t, [[0, 1.3], [len, 1.4]])}) translate(-960 -560)`}>
        <Smartphone x={960} y={560} s={1.2} mode="map" t={t} />
        <circle cx={900 + ((j * 97) % 160)} cy={480 + ((j * 53) % 200)} r={16} fill="#3A8AFF" stroke="#FFFFFF" strokeWidth={5} />
        <text x={960} y={250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#FF5A5A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">WRONG PLACE</text>
      </g>
    </g>
  );
}) as React.FC<ShotProps>, 9, '4:00 PM');

// ---------- S14: ships, planes, trucks stop ----------
export const S14 = iconBoard({
  title: 'STOP WHERE THEY ARE',
  items: [
    { name: 'boat', label: 'SHIPS', at: 2, cross: 10 },
    { name: 'train', label: 'PLANES', at: rel('Ships', 'planes'), cross: rel('Ships', 'planes') + 8 },
    { name: 'truck', label: 'TRUCKS', at: rel('Ships', 'trucks'), cross: rel('Ships', 'trucks') + 8 },
  ],
});

// ---------- S15: a taxi nose-down in a lake, the driver standing on its roof, phone held up ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const drv: Pose = { ...basePose, x: 1010, y: 520, scale: 0.7, yaw: 0.2, expr: 'oops', blink: idleBlink(t, 3), armR: { a: 160, b: 0 } };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <rect x={-400} y={-400} width={2800} height={1100} fill="#1A2238" />
      <rect x={-400} y={620} width={2800} height={900} fill="#1E4A6A" />
      {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${-200 + i * 260 + (t % 40)} ${700 + (i % 3) * 60} q 30 -10 60 0`} stroke="#5A8AAA" strokeWidth={5} fill="none" />)}
      <g transform="rotate(-12 980 700)">
        <Car x={980} y={760} s={1.0} color="#F2C14E" />
        <rect x={930} y={565} width={100} height={30} rx={6} fill="#100E16" />
        <text x={980} y={588} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#F2C14E">TAXI</text>
      </g>
      <rect x={-400} y={740} width={2800} height={800} fill="#1E4A6A" opacity={0.85} />
      <Hero look={{ ...MO, jacket: '#5A5A6A', jacketShade: '#4A4A5A' }} pose={drv} />
      <Smartphone x={1060} y={330} s={0.12} mode="map" t={t} />
    </g>
  );
};

// ---------- S16: the living room: Mom taping a blanket over the window ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const mom: Pose = { ...basePose, x: 1150, y: 560, scale: 0.85, yaw: 0.6, expr: 'worried', blink: idleBlink(t, 4), armR: { a: 150 + Math.sin(t / 5) * 8, b: 20 }, armL: { a: 130, b: 30 } };
  return (
    <g transform={camT(1100, 480, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <ROOM t={t + 100} />
      <rect x={1000} y={350} width={kf(t, [[0, 120], [len * 0.7, 290]])} height={210} fill="#7A4A5A" stroke="#100E16" strokeWidth={5} />
      <Hero look={MOM} pose={mom} />
    </g>
  );
};

// ---------- S17: the whole family on mattresses around one glowing electric heater ----------
const Heater: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={-60} r={260} kind="warm" o={0.8 + 0.05 * Math.sin(t / 3)} />
    <rect x={-80} y={-130} width={160} height={130} rx={14} fill="#3A3E48" stroke="#100E16" strokeWidth={6} />
    {[0, 1, 2].map((k) => <rect key={k} x={-60} y={-110 + k * 36} width={120} height={14} rx={7} fill="#FF7A3A" />)}
  </g>
);
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const sitP = (x: number, sc: number, yaw: number, ex: Pose['expr'], seed: number): Pose => ({ ...basePose, x, y: 720, scale: sc, yaw, expr: ex, blink: idleBlink(t, seed), legL: { a: 80, b: -80 }, legR: { a: 76, b: -84 }, armL: { a: 30, b: 60 }, armR: { a: 30, b: 60 } });
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.2], [len, 1.28]]))}>
      <ROOM t={t + 150} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={0.45} />
      <rect x={500} y={780} width={420} height={60} rx={14} fill="#C8B8A8" stroke="#100E16" strokeWidth={5} />
      <rect x={1000} y={780} width={420} height={60} rx={14} fill="#A8B8C8" stroke="#100E16" strokeWidth={5} />
      <Heater x={960} y={820} s={0.9} t={t} />
      <Hero look={MOM} pose={sitP(640, 0.75, 0.5, 'worried', 2)} />
      <Hero look={ELLIE} pose={{ ...sitP(780, 0.55, 0.5, 'neutral', 4), y: 760 }} />
      <Hero look={YOU} pose={sitP(1200, 0.72, -0.5, 'tired', 6)} />
    </g>
  );
};

// ---------- S18: close, Ellie: when is the Sun coming back? ----------
export const S18 = faceCU({ look: ELLIE, Bg: ROOM, faces: [[0, 'worried']], yaw: 0.3, zoom: [3.4, 3.6], dark: 0.3, light: { x: 900, y: 650, kind: 'warm', o: 0.7 } });

// ---------- S19: close, Mom, looking away; no answer ----------
export const S19 = faceCU({ look: MOM, Bg: ROOM, faces: [[0, 'tired']], yaw: -0.3, eyes: 0.5, zoom: [3.2, 3.3], dark: 0.3, light: { x: 1000, y: 650, kind: 'warm', o: 0.6 } });

// ---------- S20: midnight: a call to the other side of the world, two hours in transit ----------
export const S20 = withHud(((p: ShotProps) => (
  <g>
    <Schematic t={p.t} id="c4mid" />
    <Smartphone x={420} y={560} s={0.4} mode="home" t={p.t} />
    <Smartphone x={1500} y={560} s={0.4} mode="home" t={p.t} />
    <path d="M 560 560 Q 960 300 1360 560" stroke={SCH.dim} strokeWidth={4} strokeDasharray="12 12" fill="none" />
    <LightDot x0={560} y0={480} x1={1360} y1={480} p={0.05 + 0.08 * clamp(p.t / Math.max(1, p.len))} r={12} />
    <SchLabel x={960} y={300} t={p.t} text="ARRIVES IN ALMOST 2 HOURS" size={46} color={SCH.live} />
  </g>
)) as React.FC<ShotProps>, 17, '12:00 AM');

// ---------- S21: a laptop page loading: 0%... ----------
export const S21: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Soft blur={16} dim={0.6}><ROOM t={t + 300} /></Soft>
    <rect x={560} y={260} width={800} height={520} rx={20} fill="#1A1A24" stroke="#100E16" strokeWidth={10} />
    <rect x={590} y={290} width={740} height={460} fill="#F6EFE3" />
    <circle cx={960} cy={500} r={60} fill="none" stroke="#C8CCD4" strokeWidth={14} />
    <path d={`M 960 440 A 60 60 0 0 1 ${960 + 60 * Math.sin(t / 8)} ${500 - 60 * Math.cos(t / 8)}`} stroke="#3A8AE0" strokeWidth={14} fill="none" />
    <text x={960} y={640} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#3A3A4A">Loading... estimated: 7 h</text>
    <rect x={480} y={780} width={960} height={40} rx={10} fill="#2A2A34" stroke="#100E16" strokeWidth={8} />
  </g>
);

// ---------- S22: 3 AM: slower than sound ----------
export const S22 = withHud(bigWord({ kicker: 'LIGHT IS NOW', word: 'SLOWER THAN SOUND', color: '#FFD23A', size: 140 }), 20, '3:00 AM');

// ---------- S23: 343 m/s ----------
export const S23 = factCard({ value: 343, suffix: ' m/s', label: 'THE SPEED OF SOUND', sub: 'NASA Glenn: in air at 20°C' });

// ---------- S24: in the dark, your hands clap: the sound rings out first, the light of it arrives after ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const clap = 20;
  const shut = t > clap ? 1 : clamp(t / clap);
  const lit = t > clap + 40 ? 1 : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#06060E" />
      {t > clap ? [0, 1, 2].map((k) => {
        const r = (t - clap - k * 8) * 14;
        return r > 0 ? <circle key={k} cx={960} cy={540} r={r} fill="none" stroke="#F6EFE3" strokeWidth={6} opacity={Math.max(0, 1 - r / 900)} /> : null;
      }) : null}
      <g opacity={0.25 + 0.75 * lit}>
        <ellipse cx={960 - 120 * (1 - shut) - 40} cy={540} rx={90} ry={130} fill="#26232F" stroke="#100E16" strokeWidth={8} />
        <ellipse cx={960 + 120 * (1 - shut) + 40} cy={540} rx={90} ry={130} fill="#26232F" stroke="#100E16" strokeWidth={8} />
      </g>
      {t > clap ? <text x={960} y={250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3">CLAP</text> : null}
      <text x={960} y={900} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={4} fill="#FFD23A" opacity={lit}>...THEN YOU SEE IT</text>
    </g>
  );
};

// ---------- S25: outside, the street at 4 AM, frost on everything ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <FadeStreet t={t + 900} sun={0} stars={0.2} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#9AC8F0" opacity={0.12} />
    {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={(i * 137) % 1920} cy={((i * 71) + t * 2) % 1080} r={3} fill="#E8F4FF" opacity={0.6} />)}
  </g>
);

// ---------- S26: EVERY HOUR, WORSE ----------
export const S26 = bigWord({ kicker: 'AND EVERY HOUR', word: 'IT GETS WORSE', color: '#FF5A5A', size: 160 });
