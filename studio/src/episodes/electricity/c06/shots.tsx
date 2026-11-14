import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, talkShot, LEG_LEN, stand, SchLabel, SCH, walkPose,
} from '../../../engine';
import { YOU, MOM, ELLIE, MO, NEIGHBOR, DOCTOR, faceCU, bigWord, wordF, span, handAt, DarkBg, iconBoard, SchematicBg, HeldCandle } from '../common';
import { StreetModern, streetHip, STREETM, Candle, WaterBottle, Can, Trailer, PaperMap, BoardGame, Hospital, HOSP, CountryRoad, COUNTRY, countryHip } from '../sets';
import words from './words.json';

// Chapter 6, the road: Ellie's fever and the dark hospital; mum decides on grandpa's farm, 90 km away; Mo stays and
// gives you his dead bike lights; the man with the bat hands over the food and a paper map; the trailer, the walk out
// at sunrise past people walking the other way; a night on the floor of an empty school.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const norm = (w: string) => w.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '').replace(/^'+|'+$/g, '');
/** Frames from word `cue` to the first word `w` after it (both on the chapter clock). */
const rel = (cue: string, w: string) => {
  const i = W.findIndex((x) => norm(x.w) === norm(cue));
  const j = W.findIndex((x, k) => k > i && norm(x.w) === norm(w));
  return j < 0 || i < 0 ? 0 : Math.round((W[j].s - W[i].s) * 30);
};
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" power={0} car={false} />;
const DUSK: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="dusk" power={0} car={false} />;
const HOSPC = [HOSP.P(0.2, 1, 0.5), HOSP.P(0.8, 1, 0.7)];
const HOSPSET: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Hospital t={t} id={id} candles={HOSPC} />;
const P0 = '#100E16';

/** An empty classroom at night: desks pushed to the walls, a chalkboard, moonlight through tall windows. */
const School: React.FC<{ t: number; id?: string }> = ({ t, id = 'sch' }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#22263A" />
    {[200, 760, 1320].map((x, i) => (
      <g key={i}>
        <rect x={x} y={120} width={400} height={460} fill="#0E1430" stroke="#14141E" strokeWidth={14} />
        <path d={`M ${x + 200} 120 L ${x + 200} 580 M ${x} 350 L ${x + 400} 350`} stroke="#14141E" strokeWidth={10} />
        <circle cx={x + 300} cy={220} r={i === 1 ? 34 : 0} fill="#E8ECF8" opacity={0.9} />
        {Array.from({ length: 14 }).map((_, k) => (
          <circle key={k} cx={x + 20 + ((k * 97 + i * 31) % 360)} cy={140 + ((k * 61 + i * 13) % 190)} r={2.5} fill="#F6EFE3" opacity={0.7 + 0.3 * Math.sin(t / 9 + k)} />
        ))}
      </g>
    ))}
    {/* moonlight on the floor */}
    {[200, 760, 1320].map((x, i) => (
      <polygon key={`m${i}`} points={`${x},580 ${x + 400},580 ${x + 560},1000 ${x + 120},1000`} fill="#AFC0F0" opacity={0.08} />
    ))}
    <rect x={-400} y={800} width={2800} height={800} fill="#3A3442" />
    {Array.from({ length: 12 }).map((_, i) => (
      <path key={`fl${i}`} d={`M ${-400 + i * 260} 800 L ${-700 + i * 300} 1500`} stroke="#2E2A36" strokeWidth={4} />
    ))}
    {/* the chalkboard at the left, desks stacked on the right */}
    <rect x={-360} y={260} width={480} height={300} fill="#2A3A30" stroke="#5A4232" strokeWidth={16} />
    <text x={-120} y={360} textAnchor="middle" fontFamily="Caveat, cursive" fontSize={44} fill="#E8E8DC" opacity={0.75}>MATH TEST</text>
    <text x={-120} y={420} textAnchor="middle" fontFamily="Caveat, cursive" fontSize={40} fill="#E8E8DC" opacity={0.75}>MONDAY!</text>
    {[0, 1, 2].map((k) => (
      <g key={`d${k}`} transform={`translate(${1700 + k * 70} ${800 - k * 70})`}>
        <rect x={-110} y={-90} width={220} height={20} fill="#8A6A4A" stroke={P0} strokeWidth={4} />
        <path d="M -100 -70 L -100 0 M 100 -70 L 100 0" stroke="#4A4A52" strokeWidth={8} />
      </g>
    ))}
    <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.3} />
  </g>
);

/** Ellie bundled in a blanket, sitting in a trailer (hip at x, y). */
const sitPose = (x: number, y: number, s: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y, scale: s, yaw: 0.4, legL: { a: 80, b: -90 }, legR: { a: 76, b: -88 }, armL: { a: 20, b: -60 }, armR: { a: 20, b: -60 }, ...extra,
});
const Blanket: React.FC<{ x: number; y: number; s: number }> = ({ x, y, s }) => (
  <path d={`M ${x - 70 * s} ${y + 40 * s} Q ${x - 80 * s} ${y - 120 * s} ${x} ${y - 130 * s} Q ${x + 80 * s} ${y - 120 * s} ${x + 72 * s} ${y + 40 * s} Z`} fill="#8A5AA0" stroke={P0} strokeWidth={5} />
);

// ---------- S1: close, Ellie with a fever: flushed, eyes half shut, candle light ----------
export const S1 = faceCU({
  look: ELLIE, Bg: ({ t, id }) => <DarkBg t={t} id={id} />, faces: [[0, 'tired']], yaw: 0.2, zoom: [3.5, 3.7], light: { x: 1080, y: 560, o: 0.7 },
  extra: (t) => (
    <g>
      <ellipse cx={928} cy={552} rx={14} ry={8} fill="#FF5A5A" opacity={0.5} />
      <ellipse cx={994} cy={552} rx={14} ry={8} fill="#FF5A5A" opacity={0.5} />
      {[0, 1].map((k) => {
        const p = ((t + k * 25) % 50) / 50;
        return <path key={k} d={`M ${1000 + k * 14} ${478 + p * 40} q 5 8 0 13 q -5 -5 0 -13`} fill="#A9D4F0" opacity={1 - p} />;
      })}
    </g>
  ),
});

// ---------- S2: the hospital corridor, dark: mum carries Ellie in, you beside her, candles on the floor ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const w = kf(t, [[0, 0.4], [len, 0.62]]);
  const m = stand(HOSP, 0.45, w, 0.6);
  const y = stand(HOSP, 0.64, w + 0.04, 0.5);
  const ph = t * 0.5;
  const mom = walkPose(m.x, ph, m.y + LEG_LEN * m.scale, m.scale, { yaw: 0.1, facing: 1, expr: 'worried', armL: { a: 60, b: -80 }, armR: { a: 60, b: -80 }, blink: idleBlink(t, 2) });
  const me = walkPose(y.x, ph + 1.5, y.y + LEG_LEN * y.scale, y.scale, { yaw: 0.1, expr: 'worried', blink: idleBlink(t, 5) });
  const ellie = { ...sitPose(handAt(mom, 'R').x, handAt(mom, 'R').y - 30 * m.scale, m.scale * 0.5), yaw: 0.6, expr: 'tired' as const, blink: 0.7 };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.05], [len, 1.18]]))}>
      <HOSPSET t={t + 100} />
      <Hero look={YOU} pose={me} />
      <Hero look={MOM} pose={mom} />
      <Hero look={ELLIE} pose={ellie} />
    </g>
  );
};

// ---------- S3: the backup generator on the schematic: dead like everything else ----------
export const S3 = iconBoard({
  title: 'BACKUP POWER',
  items: [
    { name: 'generator', label: 'GENERATORS', at: 0, live: 1, cross: rel('backup', 'dead') + 4 },
    { name: 'fuel', label: 'FUEL PUMPS', at: 8, live: 1, cross: rel('backup', 'everything') + 4 },
  ],
});

// ---------- S4: doctors working by candlelight: one walks up the corridor holding a candle ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const d = stand(HOSP, kf(t, [[0, 0.55], [len, 0.5]]), kf(t, [[0, 0.3], [len, 0.55]]), 0.62);
  const doc = walkPose(d.x, t * 0.4, d.y + LEG_LEN * d.scale, d.scale, { facing: 1, yaw: 0, expr: 'tired', armR: { a: 40, b: 70 }, blink: idleBlink(t, 3) });
  const n = stand(HOSP, 0.18, 0.62, 0.6);
  const nurse: Pose = { ...basePose, ...n, yaw: 0.6, expr: 'worried', armR: { a: 50, b: 60 }, blink: idleBlink(t, 6) };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.15], [len, 1.3]]))}>
      <HOSPSET t={t + 200} />
      <Hero look={DOCTOR} pose={nurse} />
      <HeldCandle pose={nurse} t={t} s={0.5 * n.scale} />
      <Glow x={handAt(doc).x} y={handAt(doc).y - 40} r={300} o={0.7} />
      <Hero look={DOCTOR} pose={doc} />
      <HeldCandle pose={doc} t={t} s={0.55 * d.scale} />
    </g>
  );
};

// ---------- S5: 200 YEARS AGO ----------
export const S5 = bigWord({ kicker: 'MEDICINE THE WAY IT WAS', word: '200 YEARS AGO', color: '#FF8A3D', size: 170, Bg: ({ t, id }) => <HOSPSET t={t} id={id} /> });

// ---------- S6: nothing is coming: medicine, ambulance, crossed on the words ----------
export const S6 = iconBoard({
  title: 'NOTHING IS COMING',
  items: [
    { name: 'truck', label: 'MEDICINE', at: 0, cross: rel('No', 'coming') + 4 },
    { name: 'phone', label: 'AMBULANCE', at: rel('No', 'ambulance') - 6, cross: rel('No', 'ambulance') + 8 },
  ],
});

// ---------- S7: the tired doctor with a candle talks to mum, you beside her ----------
export const S7 = talkShot({
  Set: HOSPSET, setT: 400, words: W,
  cast: [
    { look: DOCTOR, ...stand(HOSP, 0.68, 0.62, 0.62), yaw: -0.5, talk: [span(W, 'telling', 'water')], faces: [[0, 'tired']], gesture: true },
    { look: MOM, ...stand(HOSP, 0.42, 0.6, 0.6), yaw: 0.5, faces: [[0, 'worried']] },
    { look: YOU, ...stand(HOSP, 0.24, 0.66, 0.52), yaw: 0.5, faces: [[0, 'worried']] },
  ],
  cam: { from: [960, 520, 1.3], to: [960, 520, 1.42] },
  front: (t) => {
    const d = stand(HOSP, 0.68, 0.62, 0.62);
    return (
      <g>
        <Glow x={d.x - 60} y={d.y - 40} r={320} o={0.6} />
        <Candle x={d.x - 70} y={d.y + 10} s={0.5} t={t} />
      </g>
    );
  },
});

// ---------- S8: close, mum: a decision ----------
export const S8 = faceCU({ look: MOM, Bg: HOSPSET, faces: [[0, 'worried'], [18, 'cool']], yaw: 0.25, zoom: [3.1, 3.4], light: { x: 1100, y: 560, o: 0.6 } });

// ---------- S9: the schematic map: the city, a dashed line out to grandpa's farm, 90 KM ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 8) / 30));
  const x0 = 420, y0 = 720, x1 = 1500, y1 = 360;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <SchematicBg t={t} />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={300 + (i % 3) * 90} y={640 + Math.floor(i / 3) * 60} width={70} height={44} fill="none" stroke="#3A4A66" strokeWidth={4} />)}
      <SchLabel x={x0} y={900} t={t} text="THE CITY" size={36} />
      <path d={`M ${x0 + 120} ${y0} Q 1000 ${700} ${x0 + 120 + (x1 - x0 - 120) * k} ${y0 + (y1 - y0) * k}`} stroke={SCH.live} strokeWidth={10} fill="none" strokeDasharray="26 18" />
      <g transform={`translate(${x1} ${y1}) scale(${backOut(clamp((t - 34) / 8))})`}>
        <rect x={-60} y={-40} width={120} height={70} fill="none" stroke="#F6EFE3" strokeWidth={6} />
        <path d="M -76 -40 L 0 -100 L 76 -40" stroke="#F6EFE3" strokeWidth={6} fill="none" />
      </g>
      <SchLabel x={x1} y={y1 + 90} t={t - 36} text="GRANDPA'S FARM" size={38} color={SCH.live} />
      <SchLabel x={1000} y={600} t={t - rel("Grandpa's", 'ninety')} text="90 KM" size={64} />
    </g>
  );
};

// ---------- S10: what the farm has: a hand pump, a wood stove, chickens, a field ----------
export const S10 = iconBoard({
  title: "GRANDPA'S FARM",
  items: [
    { name: 'pump', label: 'HAND PUMP', at: rel('well', 'hand') - 6, live: 1 },
    { name: 'fire', label: 'WOOD STOVE', at: rel('well', 'wood') - 6, live: 1 },
    { name: 'heart', label: 'CHICKENS', at: rel('well', 'chickens') - 6, live: 1 },
    { name: 'wheat', label: 'A FIELD', at: rel('well', 'field') - 6, live: 1 },
  ],
  cols: 4,
});

// ---------- S11: STAY: the water runs out (a bottle draining on the left) ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <DarkBg t={t} />
    <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={130} fill="#F6EFE3">STAY</text>
    <WaterBottle x={960} y={860} s={4.2} level={kf(t, [[0, 0.8], [len, 0.05]])} />
    <text x={960} y={960} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#FF3A3A" opacity={clamp((t - 30) / 10)}>THE WATER RUNS OUT</text>
  </g>
);

// ---------- S12: GO: 4 DAYS ON FOOT ----------
export const S12 = bigWord({ kicker: 'GO: ON FOOT, WITH A SICK SISTER', word: '4 DAYS', color: '#FFD23A', Bg: ({ t, id }) => <CountryRoad t={t} id={id} /> });

// ---------- S13: on the street: Mo says they're staying, the power has to come back ----------
export const S13 = talkShot({
  Set: DAY, setT: 500, words: W,
  cast: [
    { look: MO, x: 1080, y: streetHip(1.1), scale: 1.1, yaw: -0.4, talk: [span(W, "It'll", 'back'), span(W, 'power', 'back')], faces: [[0, 'happy']], gesture: true },
    { look: YOU, x: 760, y: streetHip(1.1), scale: 1.1, yaw: 0.4, faces: [[0, 'worried']] },
  ],
  cam: { from: [920, 560, 1.5], to: [920, 560, 1.62] },
});

// ---------- S14: close, you: you know the rule ----------
export const S14 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'worried']], yaw: 0.3, zoom: [3.3, 3.5], pose: { headTilt: -5 } });

// ---------- S15: IT DOESN'T. ----------
export const S15 = bigWord({ kicker: 'THE RULE', word: "IT DOESN'T.", color: '#FF3A3A', size: 190 });

// ---------- S16: you and Mo hug goodbye on the street, dusk ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1;
  const close = easeOut(clamp(t / 14));
  const me: Pose = { ...basePose, x: 900 + 20 * close, y: streetHip(s), scale: s, yaw: 0.6, expr: 'worried', blink: Math.max(idleBlink(t, 2), close > 0.9 ? 1 : 0), armL: { a: 20 + 30 * close, b: -100 * close }, armR: { a: 20 + 30 * close, b: -100 * close }, headTilt: 8 * close };
  const mo: Pose = { ...basePose, x: 1050 - 20 * close, y: streetHip(s), scale: s, yaw: -0.6, expr: 'worried', blink: Math.max(idleBlink(t, 5), close > 0.9 ? 1 : 0), armL: { a: 20 + 30 * close, b: -100 * close }, armR: { a: 20 + 30 * close, b: -100 * close }, headTilt: -8 * close };
  return (
    <g transform={camT(970, 560, kf(t, [[0, 1.6], [len, 1.8]]))}>
      <DUSK t={t + 600} />
      <Hero look={MO} pose={mo} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S17: insert, the bike lights in your palm: click, click, nothing ----------
export const S17: React.FC<ShotProps> = ({ t }) => {
  const c1 = rel('gives', "don't");
  const clicks = [c1 - 4, c1 + 4];
  return (
    <g>
      <DarkBg t={t} />
      <Glow x={960} y={560} r={500} kind="cool" o={0.35} />
      {/* an orange sleeve, an open hand */}
      <path d="M -100 900 L 520 700 L 600 900 L 0 1180 Z" fill="#FF8A3D" stroke={P0} strokeWidth={8} />
      <path d="M 520 690 Q 760 560 1120 600 Q 1260 640 1200 720 Q 1000 820 620 900 Z" fill="#3B3646" stroke={P0} strokeWidth={8} />
      {/* the two lights: white front, red back */}
      {[0, 1].map((k) => (
        <g key={k} transform={`translate(${800 + k * 200} ${640 - k * 20}) rotate(${-8 + k * 10})`}>
          <rect x={-60} y={-40} width={120} height={80} rx={20} fill="#2A2A34" stroke={P0} strokeWidth={6} />
          <rect x={-40} y={-24} width={80} height={48} rx={12} fill={k ? '#5A1A1A' : '#4A4A56'} />
          <circle cx={0} cy={-52} r={10} fill="#5A5A66" stroke={P0} strokeWidth={4} />
        </g>
      ))}
      {clicks.map((c, i) => (t >= c && t < c + 8 ? <text key={i} x={820 + i * 220} y={500} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" opacity={1 - (t - c) / 8}>click</text> : null))}
    </g>
  );
};

// ---------- S18: close, you: you take them anyway ----------
export const S18 = faceCU({ look: YOU, Bg: DUSK, faces: [[0, 'worried'], [12, 'happy']], yaw: 0.25, zoom: [3.2, 3.4], glint: 0.6 });

// ---------- S19: back across the street: the man with the bat hands over a box of cans ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1;
  const give = easeOut(clamp((t - 30) / 20));
  const man: Pose = { ...basePose, x: 420, y: streetHip(s), scale: s, yaw: 0.5, expr: 'neutral', blink: idleBlink(t, 4), armL: { a: 80 * give, b: 0 }, armR: { a: 80 * give, b: 0 } };
  const me: Pose = { ...basePose, x: 760, y: streetHip(s), scale: s, yaw: -0.5, expr: 'worried', blink: idleBlink(t, 6), armL: { a: 70 * give, b: 0 }, armR: { a: 70 * give, b: 0 } };
  const bx = (handAt(man).x + handAt(me).x) / 2;
  const by = Math.min(handAt(man).y, handAt(me).y) - 10;
  return (
    <g transform={camT(kf(t, [[0, 520], [len, 580]]), 560, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <StreetModern t={t + 700} mode="day" power={0} car={false} garageOpen={1} />
      <Hero look={NEIGHBOR} pose={man} />
      <Hero look={YOU} pose={me} />
      {give > 0.1 ? (
        <g>
          <rect x={bx - 70} y={by - 60} width={140} height={70} fill="#C8A070" stroke={P0} strokeWidth={5} />
          {[0, 1, 2].map((k) => <Can key={k} x={bx - 40 + k * 40} y={by - 56} s={0.45} label={['#C84A2A', '#2E9A5A', '#E8B83A'][k]} />)}
        </g>
      ) : null}
    </g>
  );
};

// ---------- S20: insert: a paper map unfolds, a route drawn on it ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <DarkBg t={t} />
    <Glow x={960} y={560} r={600} o={0.5} />
    <g transform={`translate(0 ${kf(t, [[0, 40], [12, 0]], easeOut)})`}>
      <PaperMap x={960} y={560} s={kf(t, [[0, 2.2], [len, 2.6]])} rot={-4} route={clamp((t - rel('something', 'paper')) / 30)} />
    </g>
  </g>
);

// ---------- S21: A MAP: suddenly the most valuable thing you own ----------
export const S21 = bigWord({ kicker: 'SUDDENLY THE MOST VALUABLE THING YOU OWN', word: 'A MAP', color: '#FFD23A' });

// ---------- S22: dawn on the street: the old bike trailer, loaded one thing at a time ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const items = [
    { w: 'Water', node: (x: number, y: number) => <WaterBottle x={x} y={y} s={0.7} /> },
    { w: 'Rice', node: (x: number, y: number) => <g><path d={`M ${x - 30} ${y} L ${x - 26} ${y - 70} Q ${x} ${y - 84} ${x + 26} ${y - 70} L ${x + 30} ${y} Z`} fill="#F2EAD8" stroke={P0} strokeWidth={4} /></g> },
    { w: 'Blankets', node: (x: number, y: number) => <rect x={x - 50} y={y - 50} width={100} height={50} rx={14} fill="#8A5AA0" stroke={P0} strokeWidth={4} /> },
    { w: 'board', node: (x: number, y: number) => <BoardGame x={x} y={y - 20} s={0.3} t={t} /> },
  ];
  const tx = 960, ty = STREETM.kerb + 90;
  return (
    <g transform={camT(960, 820, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <DUSK t={t + 800} />
      <Trailer x={tx} y={ty} s={1.2} load={0} />
      {items.map((it, i) => {
        const f = rel('load', it.w);
        if (t < f - 4) return null;
        const drop = 1 - easeOut(clamp((t - f + 4) / 8));
        return <g key={i} transform={`translate(0 ${-120 * drop})`}>{it.node(tx - 110 + i * 70, ty - 140)}</g>;
      })}
    </g>
  );
};

// ---------- S23: on the move: Ellie wrapped up in the trailer, mum pulling, you pushing ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const s = 0.95;
  const x = kf(t, [[0, 700], [len, 1100]]);
  const ph = t * 0.4;
  const gy = STREETM.kerb + 110;
  const mom = walkPose(x + 300, ph, gy, s, { expr: 'cool', armL: { a: -30, b: 10 }, armR: { a: -30, b: 10 }, blink: idleBlink(t, 3) });
  const me = walkPose(x - 260, ph + 1.6, gy, s * 0.9, { expr: 'worried', armL: { a: 80, b: 0 }, armR: { a: 80, b: 0 }, tilt: 14, blink: idleBlink(t, 5) });
  const ellie = { ...sitPose(x - 30, gy - 180 * s, s * 0.6), expr: 'tired' as const, blink: 0.5 };
  return (
    <g transform={camT(x + 20, 620, 1.6)}>
      <DUSK t={t + 900} />
      <Hero look={MOM} pose={mom} />
      <Hero look={ELLIE} pose={ellie} />
      <Blanket x={x - 30} y={gy - 105 * s} s={s} />
      <Trailer x={x} y={gy} s={1.1} spin={t * 6} load={0} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S24: sunrise: three small figures and a trailer walk out of the city along the country road ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const s = 0.5;
  const x = kf(t, [[0, 300], [len, 900]]);
  const ph = t * 0.4;
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1000]]), 560, 1.1)}>
      <CountryRoad t={t} dusk />
      {/* the dead city behind, left */}
      {[-300, -180, -60, 60].map((cx, i) => <rect key={i} x={cx} y={COUNTRY.feet - 380 + i * 40} width={110} height={380 - i * 40} fill="#2A2238" />)}
      <Hero look={YOU} pose={walkPose(x - 120, ph + 1.6, COUNTRY.feet, s * 0.9)} />
      <Trailer x={x} y={COUNTRY.feet} s={0.55} spin={t * 6} load={1} />
      <Hero look={MOM} pose={walkPose(x + 160, ph, COUNTRY.feet, s)} />
    </g>
  );
};

// ---------- S25: on the road: crowds walking the other way, into the city ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const people = Array.from({ length: 9 });
  const looks = [NEIGHBOR, MOM, MO, NEIGHBOR, DOCTOR, MOM, NEIGHBOR, MO, NEIGHBOR];
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <CountryRoad t={t + 200} />
      {people.map((_, i) => {
        const x = 1900 - ((t * 2.4 + i * 260) % 2300);
        const s = 0.55 + (i % 3) * 0.05;
        return <Hero key={i} look={looks[i]} pose={walkPose(x, t * 0.35 + i, COUNTRY.feet + (i % 3) * 14, s, { expr: i % 2 ? 'tired' : 'worried' }, -1)} />;
      })}
      <Hero look={YOU} pose={walkPose(840 + t * 0.8, t * 0.4, COUNTRY.feet + 40, 0.62, { expr: 'worried' })} />
      <Trailer x={960 + t * 0.8} y={COUNTRY.feet + 40} s={0.6} spin={t * 6} load={1} />
      <Hero look={MOM} pose={walkPose(1120 + t * 0.8, t * 0.4 + 1.6, COUNTRY.feet + 40, 0.65, { expr: 'cool' })} />
    </g>
  );
};

// ---------- S26: the empty school at night: mum and you asleep against the wall, Ellie in her blanket ----------
export const S26: React.FC<ShotProps> = ({ t, len }) => {
  const s = 0.95;
  const fy = 830;
  const sit = (x: number, k: number, extra: Partial<Pose>): Pose => ({ ...basePose, x, y: fy - 10 * k, scale: k, yaw: 0.5, legL: { a: 86, b: -8 }, legR: { a: 82, b: -6 }, armL: { a: 20, b: -40 }, armR: { a: 20, b: -40 }, blink: 1, ...extra });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), 600, kf(t, [[0, 1.2], [len, 1.32]]))}>
      <School t={t} />
      <Hero shadow={0} look={MOM} pose={sit(1040, s, { expr: 'tired', headTilt: 12 })} />
      <Hero shadow={0} look={YOU} pose={sit(760, s * 0.9, { expr: 'tired', headTilt: -10 })} />
      <ellipse cx={1240} cy={fy - 10} rx={120} ry={34} fill="#8A5AA0" stroke={P0} strokeWidth={5} />
      <circle cx={1150} cy={fy - 40} r={30} fill="#3B3646" stroke={P0} strokeWidth={5} />
      <Trailer x={1550} y={fy + 20} s={0.7} load={1} />
    </g>
  );
};

// ---------- S27: close, you, awake in the moonlight: the building you were so happy to skip ----------
export const S27 = faceCU({ look: YOU, Bg: School, faces: [[0, 'worried'], [40, 'tired']], yaw: -0.3, zoom: [3.2, 3.6], light: { x: 820, y: 460, kind: 'cool', o: 0.5 }, dark: 0.1 });

void Candle; void countryHip; void at;
