import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, talkShot, factCard, LEG_LEN, talkAt,
  Kitchen, KITCHEN, KitchenIsland, stand, SchLabel, SCH, CountUp, LOOKS,
} from '../../../engine';
import { YOU, MOM, ELLIE, NEIGHBOR, faceCU, bigWord, wordF, span, Soft, handAt, DarkBg, iconBoard, Icon, SchematicBg } from '../common';
import { StreetModern, streetHip, STREETM, Candle, WaterBottle, Can, Bat } from '../sets';
import words from './words.json';

// Chapter 5, someone notices: day five, the city turns (smashed windows, the man across the street guarding a garage
// full of cans); nobody's coming; rumours on foot; far away, reactors with no pumps (Fukushima 2011: three melted
// down; more than 400 on Earth); at home, five days of food and water; and a knock at night: the man with the bat
// has seen your water. A deal: half for half.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (cue: string, w: string, n = 1, cn = 1) => at(w, n) - at(cue, cn);
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" power={0} />;
const DARKK: React.FC<{ t: number; id?: string }> = ({ t, id }) => (
  <g>
    <Kitchen t={t} id={id} veil={0.85} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.5} />
  </g>
);
const SUIT = LOOKS.suit26;

/** The front hall at night: a wall, the open front door, the dark street beyond; a candle on the hall table. */
const Hall: React.FC<{ t: number; id?: string; open?: number }> = ({ t, id = 'hall', open = 1 }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#2A2638" />
    <g transform="translate(560 160) scale(0.42)">
      <clipPath id={`${id}dc`}><rect x={0} y={0} width={1920} height={1800} /></clipPath>
      <g clipPath={`url(#${id}dc)`}>
        <StreetModern t={t} id={`${id}st`} power={0} car={false} />
      </g>
    </g>
    <rect x={560} y={160} width={806} height={756} fill="none" stroke="#1A1620" strokeWidth={40} />
    {/* the door, swung in */}
    <polygon points={`560,160 ${560 + 806 * (1 - open)},${160 - 30 * open} ${560 + 806 * (1 - open)},${916 + 30 * open} 560,916`} fill="#6A3A3A" stroke="#100E16" strokeWidth={6} />
    <rect x={-400} y={916} width={2800} height={600} fill="#3A2A2A" />
    {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${-400 + i * 300} 916 L ${-600 + i * 340} 1500`} stroke="#2E2020" strokeWidth={4} />)}
    <rect x={1500} y={640} width={260} height={30} fill="#4A3A34" stroke="#100E16" strokeWidth={5} />
    <path d="M 1520 670 L 1520 916 M 1740 670 L 1740 916" stroke="#3A2A26" strokeWidth={12} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.35} />
    <Candle x={1630} y={642} s={0.8} t={t} />
  </g>
);

// ---------- S1: DAY 5 over the street, colder now ----------
export const S1 = bigWord({ kicker: 'THE CITY CHANGES', word: 'DAY 5', color: '#FF8A3D', Bg: DAY });

// ---------- S2: two neighbours tugging at the same box, the others watching ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const tug = Math.sin(t / 3) * 20;
  const a: Pose = { ...basePose, x: 820 + tug, y: streetHip(0.9), scale: 0.9, yaw: 0.5, expr: 'shock', armL: { a: 80, b: 0 }, armR: { a: 80, b: 0 }, tilt: -10 };
  const b: Pose = { ...basePose, x: 1120 + tug, y: streetHip(0.9), scale: 0.9, yaw: -0.5, expr: 'shock', armL: { a: 80, b: 0 }, armR: { a: 80, b: 0 }, tilt: 10 };
  return (
    <g transform={camT(980, 560, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <DAY t={t + 100} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#1A1A30" opacity={0.25} />
      <Hero look={{ ...MOM, jacket: '#4A6A8A', jacketShade: '#3A5470' }} pose={a} />
      <Hero look={{ ...NEIGHBOR, jacket: '#3A5A4A', hat: undefined }} pose={b} />
      <rect x={910 + tug} y={streetHip(0.9) - 210} width={120} height={90} fill="#C8A06A" stroke="#100E16" strokeWidth={6} />
    </g>
  );
};

// ---------- S3: a shop window, smashed: cracks run out across the glass ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const crack = easeOut(clamp(t / 6));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#D8D0C8" />
      <rect x={-200} y={-100} width={2300} height={200} fill="#2E9A5A" />
      <rect x={260} y={200} width={1400} height={760} fill="#A8C8E0" stroke="#100E16" strokeWidth={14} />
      <rect x={300} y={240} width={1320} height={680} fill="#2A2A36" opacity={0.6} />
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 + 0.3;
        const r = 600 * crack;
        return <path key={i} d={`M 960 560 L ${960 + Math.cos(a) * r * 0.5 + 20 * Math.sin(i)} ${560 + Math.sin(a) * r * 0.5} L ${960 + Math.cos(a) * r} ${560 + Math.sin(a) * r}`} stroke="#F6FAFF" strokeWidth={5} fill="none" />;
      })}
      {[120, 240, 360].map((r) => <circle key={r} cx={960} cy={560} r={r * crack} fill="none" stroke="#F6FAFF" strokeWidth={3} strokeDasharray="30 40" />)}
      <polygon points="960,560 1080,520 1040,660" fill="#1A1A26" />
    </g>
  );
};

// ---------- S4: the man across the street on a chair in front of his garage, a bat across his knees ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const s = 0.9;
  const g = { x: 250, y: STREETM.feet };
  const man: Pose = { ...basePose, x: g.x, y: g.y - 110 * s, scale: s, yaw: 0.2, expr: 'cool', legL: { a: 80, b: -80 }, legR: { a: 76, b: -78 }, facing: 1, armL: { a: 30, b: -60 }, armR: { a: 30, b: -60 }, blink: idleBlink(t, 3), look: 0.5 };
  return (
    <g transform={camT(kf(t, [[0, 360], [len, 300]]), 560, kf(t, [[0, 1.8], [len, 2]]))}>
      <StreetModern t={t + 200} mode="day" power={0} car={false} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#1A1A30" opacity={0.2} />
      <path d={`M ${g.x - 60} ${g.y} L ${g.x - 50} ${g.y - 110} L ${g.x + 60} ${g.y - 110} L ${g.x + 70} ${g.y} M ${g.x + 50} ${g.y - 110} L ${g.x + 56} ${g.y - 240}`} stroke="#5A4A3A" strokeWidth={12} fill="none" />
      <Hero look={NEIGHBOR} pose={man} />
      <Bat x={g.x - 120} y={g.y - 110 * s + 40} rot={70} s={1} />
    </g>
  );
};

// ---------- S5: his garage door rolls up a crack: shelves of cans, floor to ceiling ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(250, STREETM.feet - 90, kf(t, [[0, 2.8], [len, 3.0]]))}>
    <StreetModern t={t + 300} mode="day" power={0} car={false} garageOpen={kf(t, [[0, 0.2], [20, 0.9]], easeOut)} />
  </g>
);

// ---------- S6: nobody's coming: radio, phone, crossed on their words ----------
export const S6 = iconBoard({
  title: 'NOBODY IS COMING',
  items: [
    { name: 'radio', label: 'RADIOS', at: rel("nobody's", 'Radios') - 4, cross: rel("nobody's", 'Radios') + 6 },
    { name: 'phone', label: 'PHONES', at: rel("nobody's", 'Phones') - 4, cross: rel("nobody's", 'Phones') + 6 },
  ],
});

// ---------- S7: the man in the suit at a podium, tapping a dead microphone to an empty square ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const tap = t % 24 < 4;
  const p: Pose = { ...basePose, x: 960, y: 760 - LEG_LEN * 1.1, scale: 1.1, yaw: 0, expr: t > 20 ? 'worried' : 'neutral', armR: { a: tap ? 110 : 100, b: 40 }, blink: idleBlink(t, 2) };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#B8B0A8" />
      {[300, 560, 1360, 1620].map((x) => <rect key={x} x={x - 40} y={60} width={80} height={700} fill="#D8D0C8" stroke="#100E16" strokeWidth={6} />)}
      <path d="M 160 60 L 960 -160 L 1760 60 Z" fill="#C8C0B8" stroke="#100E16" strokeWidth={6} />
      <rect x={-400} y={760} width={2800} height={400} fill="#8A8690" />
      <Hero look={SUIT} pose={p} />
      <path d="M 820 760 L 840 560 L 1080 560 L 1100 760 Z" fill="#5A3A2A" stroke="#100E16" strokeWidth={6} />
      <path d="M 960 560 L 1000 470" stroke="#2A2632" strokeWidth={8} />
      <ellipse cx={1004} cy={462} rx={18} ry={24} fill="#2A2632" />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#1A1A30" opacity={0.25} />
      {t > 6 ? <text x={1180} y={420} fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#F6EFE3" transform="rotate(-6 1180 420)">tap... tap...</text> : null}
    </g>
  );
};

// ---------- S8: a kid runs down the street shouting the news, people turn ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1700], [len, 900]], (k) => k);
  const ph = t * 0.7;
  const sw = Math.sin(ph);
  const s = 0.62;
  const kid: Pose = { ...basePose, x, y: streetHip(s) - Math.abs(Math.cos(ph)) * 10, scale: s, yaw: -0.7, facing: -1, tilt: -12, legL: { a: 36 * sw, b: -30 }, legR: { a: -36 * sw, b: -30 }, armL: { a: -40 * sw, b: -40 }, armR: { a: 40 * sw, b: -40 }, expr: 'shock', talk: 0.6 + 0.4 * Math.sin(t) };
  return (
    <g transform={camT(kf(t, [[0, 1300], [len, 1000]]), 560, 1.3)}>
      <DAY t={t + 400} />
      <Hero look={{ ...ELLIE, jacket: '#C8A03A', jacketShade: '#A8862E', extra: 'curls' }} pose={kid} />
      {[600, 760].map((px, i) => (
        <Hero key={i} look={[MOM, NEIGHBOR][i]} pose={{ ...basePose, x: px, y: streetHip(0.85), scale: 0.85, yaw: t > 20 ? 0.6 : 0, expr: t > 20 ? 'shock' : 'neutral', blink: idleBlink(t, i + 2) }} />
      ))}
    </g>
  );
};

// ---------- S9: a rumour on the schematic: an arrow to downtown, FOOD? ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}>
    <SchematicBg t={t} />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={200 + (i % 4) * 400} y={180 + Math.floor(i / 4) * 260} width={320} height={190} fill="none" stroke="#3A4A66" strokeWidth={5} />)}
    <path d={`M 360 900 Q 700 ${700} ${360 + 900 * easeOut(clamp(t / 20))} ${900 - 500 * easeOut(clamp(t / 20))}`} stroke="#FF8A3D" strokeWidth={12} fill="none" strokeDasharray="30 20" />
    <circle cx={360} cy={900} r={20} fill="#F6EFE3" />
    <SchLabel x={360} y={980} t={t} text="YOU" size={36} />
    <SchLabel x={1260} y={330} t={t - 16} text="ARMY HANDING OUT FOOD?" size={44} color={SCH.live} />
  </g>
);

// ---------- S10: a globe, every city dark: the same everywhere? ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const spin = t * 2;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#05060F" />
      <circle cx={960} cy={540} r={380} fill="#0E1A30" stroke="#3A5A8A" strokeWidth={6} />
      <clipPath id="globe"><circle cx={960} cy={540} r={378} /></clipPath>
      <g clipPath="url(#globe)">
        {[[-200, -120, 180, 120], [100, -60, 220, 160], [-60, 160, 120, 90], [300, 160, 140, 80]].map(([dx, dy, rx, ry], i) => {
          const x = 960 + ((dx + spin + 800) % 1600) - 800;
          return <ellipse key={i} cx={x} cy={540 + dy} rx={rx} ry={ry} fill="#1E2E3A" />;
        })}
      </g>
      <circle cx={960} cy={540} r={380} fill="none" stroke="#6A9AE0" strokeWidth={3} opacity={0.5} />
      <text x={960} y={1010} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#F6EFE3" opacity={clamp(t / 8)}>THE SAME EVERYWHERE?</text>
    </g>
  );
};

// ---------- S11: close, you, thinking: only one of them is true ----------
export const S11 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'neutral'], [12, 'worried']], yaw: 0.35, zoom: [3.1, 3.3], pose: { headTilt: 6 } });

// ---------- S12: far away at dusk: a nuclear plant, cooling towers, not one light ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1], [len, 1.1]]))}>
    <defs>
      <linearGradient id="npsky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1A1840" />
        <stop offset="100%" stopColor="#B8586A" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2800} height={1100} fill="url(#npsky)" />
    <rect x={-400} y={700} width={2800} height={800} fill="#1E1A2A" />
    {[620, 960].map((x) => (
      <g key={x}>
        <path d={`M ${x - 170} 720 Q ${x - 100} 520 ${x - 120} 360 L ${x + 120} 360 Q ${x + 100} 520 ${x + 170} 720 Z`} fill="#4A4258" stroke="#100E16" strokeWidth={6} />
        {[0, 1].map((k) => <circle key={k} cx={x + Math.sin(t / 20 + k) * 20} cy={320 - ((t * 0.6 + k * 60) % 120)} r={50 + ((t * 0.6 + k * 60) % 120) * 0.6} fill="#D8D0D8" opacity={0.25 * (1 - ((t * 0.6 + k * 60) % 120) / 120)} />)}
      </g>
    ))}
    <rect x={1160} y={480} width={260} height={240} fill="#3A3448" stroke="#100E16" strokeWidth={6} />
    <path d="M 1160 480 Q 1290 380 1420 480" fill="#3A3448" stroke="#100E16" strokeWidth={6} />
    <rect x={1460} y={560} width={300} height={160} fill="#2E2A3A" stroke="#100E16" strokeWidth={6} />
  </g>
);

// ---------- S13: the reactor on the schematic: the core keeps heating; the pump crossed; the temperature climbs ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const heat = clamp(t / Math.max(1, len));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}>
      <SchematicBg t={t} />
      <rect x={560} y={240} width={360} height={560} rx={30} fill="none" stroke="#F6EFE3" strokeWidth={10} />
      {[0, 1, 2, 3, 4].map((k) => <rect key={k} x={610 + k * 60} y={380} width={30} height={360} fill={`rgb(${150 + 105 * heat},${80 - 40 * heat},${40})`} />)}
      <Glow x={740} y={560} r={300} kind="red" o={0.3 + 0.6 * heat} />
      <SchLabel x={740} y={200} t={t} text="FUEL: STILL MAKING HEAT" size={36} color={SCH.live} />
      <Icon name="pump" x={1260} y={500} s={1} />
      <path d="M 920 500 L 1180 500" stroke="#6AB8E8" strokeWidth={10} strokeDasharray="20 16" />
      <SchLabel x={1260} y={680} t={t - 6} text="COOLING PUMP" size={36} />
      <g stroke="#FF3A3A" strokeWidth={16} strokeLinecap="round" opacity={t > 14 ? 1 : 0}>
        <path d="M 1180 420 L 1340 580 M 1340 420 L 1180 580" />
      </g>
      <rect x={1520} y={260} width={60} height={520} rx={30} fill="none" stroke="#F6EFE3" strokeWidth={8} />
      <rect x={1532} y={770 - 500 * heat} width={36} height={500 * heat} rx={18} fill="#FF3A3A" />
    </g>
  );
};

// ---------- S14: FUKUSHIMA 2011 ----------
export const S14 = bigWord({ kicker: 'FUKUSHIMA, JAPAN', word: '2011', color: '#FFD23A' });

// ---------- S15: the fact: three reactors melted down when the backup power failed ----------
export const S15 = factCard({ value: 3, label: 'REACTORS MELTED DOWN WHEN BACKUP POWER FAILED', sub: 'IAEA, The Fukushima Daiichi Accident (2015)' });

// ---------- S16: dots over a world map: more than 400 reactors, not one pump ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(440, Math.floor(t * 9));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
      <SchematicBg t={t} />
      {[[520, 380, 260, 140], [560, 680, 120, 160], [1000, 360, 140, 120], [1060, 640, 140, 170], [1400, 400, 300, 170], [1580, 760, 110, 70]].map(([cx, cy, rx, ry], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill="#1C2C44" stroke="#3A4A66" strokeWidth={4} />
      ))}
      {Array.from({ length: n }).map((_, i) => {
        const hubs = [[560, 380], [1000, 350], [1450, 400], [1300, 450], [620, 420], [1550, 380]];
        const h = hubs[i % hubs.length];
        const a = (i * 2.399) % (Math.PI * 2);
        const r = Math.sqrt((i * 7.7) % 100) * 9;
        return <circle key={i} cx={h[0] + Math.cos(a) * r * 1.6} cy={h[1] + Math.sin(a) * r} r={5} fill="#FF3A3A" />;
      })}
      <text x={960} y={980} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3">400+ REACTORS. 0 PUMPS.</text>
    </g>
  );
};

// ---------- S17: somewhere, engineers in hard hats pass buckets hand to hand, red light behind them ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 560, 1.3)}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#140A12" />
    <Glow x={1700} y={500} r={900} kind="red" o={0.7} />
    <rect x={-400} y={820} width={2800} height={500} fill="#20141C" />
    {[0, 1, 2, 3, 4].map((i) => {
      const x = 380 + i * 280;
      const sw = Math.sin(t / 6 + i * 1.2);
      const s = 0.95;
      const p: Pose = { ...basePose, x, y: 820 - LEG_LEN * s, scale: s, yaw: 0.6, facing: 1, expr: 'worried', armL: { a: 60 + 30 * sw, b: -20 }, armR: { a: 70 + 30 * sw, b: -30 }, blink: idleBlink(t, i + 1) };
      const h = handAt(p, 'R');
      return (
        <g key={i}>
          <Hero look={{ ...NEIGHBOR, jacket: '#E8D84A', jacketShade: '#C8B83A', hat: undefined }} pose={p} />
          <path d={`M ${h.x - 30} ${h.y} L ${h.x + 30} ${h.y} L ${h.x + 22} ${h.y + 50} L ${h.x - 22} ${h.y + 50} Z`} fill="#8A8A9A" stroke="#100E16" strokeWidth={4} />
          <path d={`M ${x - 64} ${820 - 378 * s * 0.95} Q ${x} ${820 - 378 * s * 1.18} ${x + 64} ${820 - 378 * s * 0.95} Z`} fill="#FFFFFF" stroke="#100E16" strokeWidth={4} />
        </g>
      );
    })}
  </g>
);

// ---------- S18: the kitchen table by candlelight: mum counting what's left ----------
export const S18 = talkShot({
  Set: DARKK, setT: 700,
  cast: [
    { look: MOM, ...stand(KITCHEN, 0.5, 0.4), yaw: 0, faces: [[0, 'worried']], pose: { armL: { a: 30, b: 80 }, armR: { a: 30, b: 80 }, look: 0 } },
    { look: YOU, ...stand(KITCHEN, 0.32, 0.42), yaw: 0.4, faces: [[0, 'worried']] },
  ],
  cam: { from: [940, 600, 1.7], to: [940, 610, 1.8] },
  front: (t) => (
    <g>
      <KitchenIsland />
      <Glow x={960} y={640} r={420} o={0.8} />
      <Candle x={1120} y={668} s={0.4} t={t} />
      {[0, 1, 2].map((k) => <Can key={k} x={860 + k * 40} y={672} s={0.6} />)}
    </g>
  ),
});

// ---------- S19: insert, the table from above: cans, rice, bottles appearing as they're counted ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const rice = rel('Six', 'Half');
  const water = rel('Six', 'Twelve');
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#3A2A26" />
      <Glow x={960} y={540} r={800} o={0.6} />
      <g transform={`translate(960 560) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -560)`}>
        {Array.from({ length: 6 }).map((_, k) => {
          const pop = backOut(clamp((t - k * 3) / 6));
          return <g key={k} transform={`translate(${300 + (k % 3) * 140} ${k < 3 ? 520 : 700}) scale(${2 * pop})`}><Can x={0} y={0} /></g>;
        })}
        {t > rice ? (
          <g transform={`translate(960 640) scale(${backOut(clamp((t - rice) / 8))})`}>
            <path d="M -120 160 L -100 -140 Q 0 -190 100 -140 L 120 160 Z" fill="#E8DCC0" stroke="#100E16" strokeWidth={8} />
            <path d="M -110 0 L 110 0 L 115 160 L -115 160 Z" fill="#F6EFE3" />
            <text x={0} y={-50} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#8A3A2A">RICE</text>
          </g>
        ) : null}
        {Array.from({ length: 12 }).map((_, k) => {
          const pop = backOut(clamp((t - water - k * 1.2) / 6));
          if (pop <= 0) return null;
          return <g key={`w${k}`} transform={`translate(${1260 + (k % 4) * 110} ${k < 4 ? 440 : k < 8 ? 620 : 800}) scale(${1.4 * pop})`}><WaterBottle x={0} y={0} /></g>;
        })}
      </g>
    </g>
  );
};

// ---------- S20: 5 DAYS ----------
export const S20 = bigWord({ kicker: "IF YOU'RE CAREFUL", word: '5 DAYS', color: '#FF8A3D' });

// ---------- S21: the front door in the dark hall: three knocks shake it ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const k1 = rel('night', 'knocks');
  const knock = [0, 6, 12].some((d) => t >= k1 + d && t < k1 + d + 3);
  return (
    <g transform={`translate(${knock ? 6 : 0} 0)`}>
      <g transform={camT(960, 540, kf(t, [[0, 1.1], [len, 1.25]]))}>
        <Hall t={t + 100} open={0} />
      </g>
      {[0, 6, 12].map((d) => (t >= k1 + d && t < k1 + d + 8 ? <text key={d} x={760 + d * 30} y={420 + d * 10} fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3" opacity={1 - (t - k1 - d) / 8}>KNOCK</text> : null))}
    </g>
  );
};

// ---------- S22: the door open: the man with the bat in the frame, lit by mum's candle ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const man: Pose = { ...basePose, x: 960, y: 916 - LEG_LEN * 1.25, scale: 1.25, yaw: 0, expr: 'neutral', blink: idleBlink(t, 4), armR: { a: 20, b: -10 } };
  return (
    <g transform={camT(960, kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Hall t={t + 200} open={1} />
      <Hero look={NEIGHBOR} pose={man} />
      <Bat x={handAt(man).x} y={handAt(man).y} rot={170} s={1.2} />
      <Glow x={960} y={500} r={420} o={0.4} />
    </g>
  );
};

// ---------- S23: two-shot in the doorway: he talks, mum listens, you behind her ----------
export const S23 = talkShot({
  Set: ({ t, id }) => <Hall t={t} id={id} open={1} />, setT: 300, words: W,
  cast: [
    { look: NEIGHBOR, x: 1080, y: 916 - LEG_LEN * 1.2, scale: 1.2, yaw: -0.4, talk: [span(W, "I've", 'talk')], faces: [[0, 'neutral']] },
    { look: MOM, x: 760, y: 980 - LEG_LEN * 1.3, scale: 1.3, yaw: 0.5, faces: [[0, 'worried']] },
    { look: YOU, x: 560, y: 1000 - LEG_LEN * 1.25, scale: 1.25, yaw: 0.5, faces: [[0, 'worried']] },
  ],
  cam: { from: [880, 520, 1.25], to: [900, 520, 1.32] },
});

// ---------- S24: close, mum: she looks at you, at Ellie, back at him ----------
export const S24: React.FC<ShotProps> = (props) => {
  const looks = [[0, -0.8], [rel('looks', 'Ellie'), 0.8], [rel('looks', 'back'), 0]];
  const eyes = [...looks].reverse().find(([f]) => props.t >= f)?.[1] ?? 0;
  return faceCU({ look: MOM, Bg: ({ t, id }) => <Hall t={t} id={id} />, faces: [[0, 'worried']], yaw: 0.1, eyes, zoom: [3.3, 3.5], light: { x: 1100, y: 520, o: 0.6 } })(props);
};

// ---------- S25: mum, firm: half our water, for half your food ----------
export const S25 = faceCU({ look: MOM, Bg: ({ t, id }) => <Hall t={t} id={id} />, faces: [[0, 'cool']], yaw: 0.3, words: W, talk: span(W, 'Half', 'food'), zoom: [3.0, 3.1], light: { x: 1100, y: 520, o: 0.6 } });

// ---------- S26: close, the man: he thinks a long time, then nods ----------
export const S26: React.FC<ShotProps> = (props) => {
  const nod = rel('thinks', 'nods');
  const tilt = props.t > nod ? Math.sin((props.t - nod) / 3) * 10 * clamp(1 - (props.t - nod) / 20) : 0;
  return faceCU({ look: NEIGHBOR, Bg: ({ t, id }) => <Hall t={t} id={id} />, faces: [[0, 'neutral'], [nod, 'smug']], yaw: -0.3, zoom: [3.2, 3.5], pose: { headTilt: tilt, tilt: tilt * 0.3 }, light: { x: 900, y: 520, o: 0.5 } })(props);
};

void CountUp; void talkAt; void Soft; void DarkBg; void Icon;
