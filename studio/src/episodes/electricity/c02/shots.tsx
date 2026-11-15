import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, chapterCard, talkShot, LEG_LEN, PlantIcon, DrawOn, joints, toWorld, HEAD,
} from '../../../engine';
import { YOU, MOM, ELLIE, NEIGHBOR, faceCU, bigWord, wordF, iconBoard, Icon, SchematicBg, DarkBg, Soft } from '../common';
import { StreetModern, streetHip, LivingRoom, LIVING_WIN, Valley, VALLEY_LIGHT, Candle, CountryRoad, countryHip } from '../sets';
import words from './words.json';

// Chapter 2, the premise and its rules: not a blackout; how you know it's forever; nothing stored works; what's lost;
// what still works (fire, bikes, sails, steam, springs); the weird part (your own electricity); the rule, said
// plainly; and the plant: one night, you'll see it broken.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (cue: string, w: string, n = 1, cn = 1) => at(w, n) - at(cue, cn);
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" power={0} />;
const DARKLR: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={0} />;

// ---------- S1: chapter card on the schematic: NOT A BLACKOUT ----------
export const S1 = chapterCard({ kicker: 'THE RULES', title: 'NOT A BLACKOUT', ground: 'schematic' });

// ---------- S2: a wire with current running through it as dots; the dots slow, stop, and fade ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const stop = rel('Electricity', 'stopped');
  const v = t < stop ? 1 : Math.max(0, 1 - (t - stop) / 14);
  const fade = t < stop + 8 ? 1 : Math.max(0, 1 - (t - stop - 8) / 16);
  const d = 'M 120 600 Q 480 420 960 560 T 1800 520';
  const pos = (k: number) => {
    const x = 120 + k * 1680;
    const y = k < 0.5 ? 600 - Math.sin(k * 2 * Math.PI) * 120 + (k * 2) * -40 : 560 - Math.sin((k - 0.5) * 2 * Math.PI) * 80 - 40 * (k - 0.5);
    return { x, y };
  };
  const travel = t < stop ? t * 0.012 : stop * 0.012 + (1 - Math.pow(1 - clamp((t - stop) / 14), 2)) * 0.08;
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1.05], [len, 1.12]]))}>
        <SchematicBg t={t} />
        <path d={d} stroke="#7E8DA6" strokeWidth={22} fill="none" strokeLinecap="round" />
        <path d={d} stroke="#3A4A66" strokeWidth={10} fill="none" strokeLinecap="round" />
        {Array.from({ length: 22 }).map((_, i) => {
          const k = ((i / 22 + travel) % 1);
          const p = pos(k);
          return <g key={i} opacity={fade}><circle cx={p.x} cy={p.y} r={10} fill="#FF8A3D" /><Glow x={p.x} y={p.y} r={40} o={0.6 * v + 0.2} /></g>;
        })}
        <Icon name="plug" x={1800} y={520} s={0.8} live={fade > 0.5 ? 1 : 0} />
        <text x={960} y={860} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill={fade > 0.5 ? '#FF8A3D' : '#7E8DA6'}>{fade > 0.5 ? 'CURRENT FLOWING' : 'NO CURRENT. ANYWHERE.'}</text>
      </g>
    </g>
  );
};

// ---------- S3: the first morning: the street by day, everyone out on the pavement, waiting, looking at the wires ----------
export const S3 = talkShot({
  Set: DAY, setT: 300,
  cast: [
    { look: YOU, x: 700, y: streetHip(0.8), scale: 0.8, yaw: 0.2, look_: -0.2, faces: [[0, 'neutral']], pose: { headTilt: -8 } },
    { look: MOM, x: 820, y: streetHip(0.82), scale: 0.82, yaw: -0.1, faces: [[0, 'worried']], pose: { armL: { a: 30, b: 100 }, armR: { a: 30, b: 100 } } },
    { look: ELLIE, x: 600, y: streetHip(0.58), scale: 0.58, yaw: 0.3, faces: [[0, 'neutral']] },
    { look: NEIGHBOR, x: 1180, y: streetHip(0.84), scale: 0.84, yaw: -0.3, faces: [[0, 'neutral']], pose: { armR: { a: 10, b: 0 } } },
    { look: { ...MOM, jacket: '#4A6A8A', jacketShade: '#3A5470', extra: undefined }, x: 1340, y: streetHip(0.8), scale: 0.8, yaw: -0.2, faces: [[0, 'worried']] },
  ],
  cam: { from: [960, 520, 1.15], to: [980, 500, 1.22] },
});

// ---------- S4: a power worker in a hard hat walks under the wires on a country road, looks up, shrugs ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 700], [len, 1100]], (k) => k);
  const ph = t * 0.55;
  const walking = t < len - 30;
  const sw = walking ? Math.sin(ph) : 0;
  const s = 0.9;
  const pose: Pose = {
    ...basePose, x, y: countryHip(s) - (walking ? Math.abs(Math.cos(ph)) * 6 : 0), scale: s, yaw: walking ? 0.7 : 0.1, facing: 1,
    legL: { a: 22 * sw, b: -10 }, legR: { a: -22 * sw, b: -10 }, armL: { a: walking ? -16 * sw : 60, b: walking ? -10 : 80 }, armR: { a: walking ? 16 * sw : 60, b: walking ? -10 : 80 },
    expr: walking ? 'neutral' : 'worried', headTilt: walking ? 0 : -10, blink: idleBlink(t, 3), look: walking ? 0.5 : 0,
  };
  const hw = toWorld(pose, joints(pose).head);
  const head = { x: hw.x, y: hw.y - (HEAD.r - 6) * s };
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 1060]]), 560, 1.6)}>
      <CountryRoad t={t + 100} />
      <Hero look={{ ...NEIGHBOR, jacket: '#E07A2A', jacketShade: '#C0621C', hat: undefined }} pose={pose} />
      {/* the hard hat */}
      <path d={`M ${head.x - 70 * s} ${head.y + 28 * s} Q ${head.x} ${head.y - 62 * s} ${head.x + 70 * s} ${head.y + 28 * s} Z`} fill="#FFD23A" stroke="#100E16" strokeWidth={5} />
      <path d={`M ${head.x - 86 * s} ${head.y + 28 * s} L ${head.x + 86 * s} ${head.y + 28 * s}`} stroke="#100E16" strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};

// ---------- S5: the power plants on the schematic, all intact, all dark: FINE. FINE. FINE. ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const kinds: ('tower' | 'wind' | 'solar' | 'dam' | 'factory')[] = ['tower', 'wind', 'solar', 'dam'];
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
        <SchematicBg t={t} />
        {kinds.map((k, i) => {
          const x = 330 + i * 420;
          const pop = backOut(clamp((t - i * 5) / 8));
          return (
            <g key={k} transform={`translate(${x} 520) scale(${pop}) translate(${-x} -520)`}>
              <PlantIcon x={x} y={560} kind={k} on={0} t={t} s={1.4} />
              <text x={x} y={760} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={6} fill="#7E8DA6">{['COAL / GAS', 'WIND', 'SOLAR', 'HYDRO'][i]}</text>
              {t > 12 + i * 5 ? <text x={x} y={830} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#5AE09A">INTACT</text> : null}
            </g>
          );
        })}
      </g>
    </g>
  );
};

// ---------- S6: nothing stored works: battery, generator, solar panel, watch, crossed out on their words ----------
export const S6 = iconBoard({
  title: 'NOTHING STORED, NOTHING MADE',
  items: [
    { name: 'battery', label: 'BATTERIES', at: 0, cross: rel('No', 'batteries', 1, 2) + 6 },
    { name: 'generator', label: 'GENERATORS', at: rel('No', 'generators', 1, 2) - 4, cross: rel('No', 'generators', 1, 2) + 8 },
    { name: 'solar', label: 'SOLAR', at: rel('No', 'solar', 1, 2) - 4, cross: rel('No', 'solar', 1, 2) + 10 },
    { name: 'watch', label: 'YOUR WATCH', at: rel('No', 'watch', 1, 2) - 6, cross: rel('No', 'watch', 1, 2) + 6 },
  ],
});

// ---------- S7: what's lost: your photos, messages, saved games, locked in dark machines ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const fade = clamp(1 - (t - rel('Every', 'locked')) / 20);
  return (
    <g>
      <DarkBg t={t} />
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.1]])}) translate(-960 -540)`}>
        {Array.from({ length: 18 }).map((_, i) => {
          const c = i % 6;
          const r = Math.floor(i / 6);
          const x = 330 + c * 230;
          const y = 260 + r * 230;
          const pop = backOut(clamp((t - i * 1.5) / 8));
          const hues = ['#E8A84A', '#4A8AC8', '#C84A6A', '#5AA86A', '#8A6AC8', '#E86A4A'];
          return (
            <g key={i} transform={`translate(${x} ${y}) scale(${pop * (0.85 + 0.15 * fade)})`} opacity={0.2 + 0.8 * fade}>
              <rect x={-100} y={-100} width={200} height={200} rx={16} fill={fade > 0.1 ? hues[(i * 5) % 6] : '#1A1A26'} stroke="#100E16" strokeWidth={6} />
              {i % 3 === 0 ? <g><circle cx={-20} cy={-20} r={30} fill="#F6EFE3" opacity={0.7} /><path d="M -70 70 L -10 10 L 30 40 L 70 0 L 70 70 Z" fill="#100E16" opacity={0.3} /></g> : i % 3 === 1 ? <path d="M -60 -30 L 60 -30 M -60 0 L 40 0 M -60 30 L 20 30" stroke="#F6EFE3" strokeWidth={10} strokeLinecap="round" opacity={0.7} /> : <text x={0} y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#F6EFE3" opacity={0.8}>LV {i * 3}</text>}
            </g>
          );
        })}
      </g>
      {fade < 0.6 ? (
        <g transform="translate(960 560)" opacity={1 - fade}>
          <rect x={-120} y={-40} width={240} height={190} rx={20} fill="#2A2834" stroke="#F6EFE3" strokeWidth={10} />
          <path d="M -80 -40 L -80 -120 Q -80 -200 0 -200 Q 80 -200 80 -120 L 80 -40" stroke="#F6EFE3" strokeWidth={16} fill="none" />
          <circle cx={0} cy={50} r={22} fill="#F6EFE3" />
        </g>
      ) : null}
    </g>
  );
};

// ---------- S8: but fire works: a match strikes, a candle catches, warm light opens up the dark ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const strike = 10;
  const lit = t > strike + 6;
  return (
    <g>
      <DarkBg t={t} />
      <g transform={`translate(960 600) scale(${kf(t, [[0, 1.6], [len, 1.75]])}) translate(-960 -600)`}>
        <Candle x={960} y={820} s={2.6} t={t} glow={lit ? 1 : 0} h={1.1} />
        {!lit ? <rect x={900} y={360} width={120} height={180} fill="#0A0A14" /> : null}
        <g transform={`translate(${kf(t, [[0, 1300], [strike, 1080], [strike + 8, 1010]], easeOut)} ${kf(t, [[0, 520], [strike, 470], [strike + 8, 430]], easeOut)}) rotate(-30)`}>
          <rect x={0} y={-6} width={200} height={12} rx={4} fill="#E8C88A" stroke="#100E16" strokeWidth={4} />
          <circle cx={0} cy={0} r={12} fill="#C83A2A" stroke="#100E16" strokeWidth={4} />
          {t > strike ? <path d="M -6 -50 Q 20 -20 10 -6 Q 0 4 -10 -6 Q -24 -24 -6 -50 Z" fill="#FFB12A" /> : null}
        </g>
      </g>
      {t > strike && t < strike + 4 ? <rect width={1920} height={1080} fill="#FFD08A" opacity={0.2} /> : null}
    </g>
  );
};

// ---------- S9: what still works, popping on their words: bikes, sailboats, steam trains, the wind-up clock ----------
export const S9 = iconBoard({
  title: 'NO ELECTRIC PARTS? STILL WORKS',
  items: [
    { name: 'bike', label: 'BIKES', at: 0, live: 0 },
    { name: 'boat', label: 'SAILBOATS', at: rel('Bikes', 'Sailboats') - 4, live: rel('Bikes', 'Sailboats') },
    { name: 'train', label: 'STEAM', at: rel('Bikes', 'steam') - 4, live: rel('Bikes', 'steam') },
    { name: 'clock', label: 'WIND-UP CLOCK', at: rel('Bikes', 'wind') - 4, live: rel('Bikes', 'wind') },
  ],
});

// ---------- S10: the weird part: a brain and a heart on the schematic, tiny sparks running through them ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const beat = Math.pow(Math.max(0, Math.sin(t / 6)), 10);
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.08]]))}>
        <SchematicBg t={t} />
        <g transform="translate(620 520)">
          <Icon name="brain" x={0} y={0} s={2.2} live={1} />
          {Array.from({ length: 10 }).map((_, i) => {
            const a = t / 4 + i * 0.7;
            return <circle key={i} cx={Math.cos(a * 1.3 + i) * 150} cy={Math.sin(a + i * 2) * 110} r={8} fill="#FFE27A" opacity={0.5 + 0.5 * Math.sin(t / 2 + i)} />;
          })}
        </g>
        <g transform={`translate(1300 540) scale(${1 + beat * 0.12})`}>
          <Icon name="heart" x={0} y={0} s={2} live={1} />
        </g>
        <path d={`M 1000 820 L 1120 820 L 1150 ${820 - 120 * beat - 20} L 1180 860 L 1210 820 L 1600 820`} stroke="#FF8A3D" strokeWidth={8} fill="none" />
        <text x={960} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={8} fill="#FF8A3D">YOUR OWN ELECTRICITY: STILL ON</text>
      </g>
    </g>
  );
};

// ---------- S11: close, you, a little smug: otherwise this would be a very short video ----------
export const S11 = faceCU({ look: YOU, Bg: DARKLR, faces: [[0, 'neutral'], [10, 'smug']], yaw: -0.3, zoom: [3.2, 3.4], light: { x: 900, y: 600, o: 0.6 }, pose: { headTilt: -6 } });

// ---------- S12: the rule, said plainly: wire, chip, screen, each going dark on its word ----------
export const S12 = iconBoard({
  title: 'THE RULE: IF PEOPLE BUILT IT TO CARRY ELECTRICITY, IT’S DEAD',
  items: [
    { name: 'wire', label: 'EVERY WIRE', at: rel('So', 'wire', 2) - 6, cross: rel('So', 'wire', 2) + 4 },
    { name: 'chip', label: 'EVERY CHIP', at: rel('So', 'chip') - 6, cross: rel('So', 'chip') + 4 },
    { name: 'screen', label: 'EVERY SCREEN', at: rel('So', 'screen') - 6, cross: rel('So', 'screen') + 4 },
  ],
});

// ---------- S13: SILENT. FOREVER. ----------
export const S13 = bigWord({ kicker: 'SILENT', word: 'FOREVER.', color: '#FF3A3A' });

// ---------- S14: you at the dark window, from behind, looking out over the city with no lights ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const cx = (LIVING_WIN.x0 + LIVING_WIN.x1) / 2;
  const me: Pose = { ...basePose, x: cx - 30, y: 980 - LEG_LEN * 1.5, scale: 1.5, yaw: 0, expr: 'neutral', blink: 1, look: 0, armL: { a: 10, b: 0 }, armR: { a: 10, b: 0 } };
  return (
    <g transform={camT(cx, kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 2.0], [len, 2.25]]))}>
      <LivingRoom t={t + 200} power={0} />
      {/* the back of your hood: you, from behind (a dark silhouette against the window) */}
      <g opacity={0.95}>
        <ellipse cx={me.x} cy={me.y - 330} rx={110} ry={120} fill="#C85E1C" stroke="#100E16" strokeWidth={8} />
        <path d={`M ${me.x - 120} ${me.y + 200} L ${me.x - 100} ${me.y - 230} Q ${me.x} ${me.y - 270} ${me.x + 100} ${me.y - 230} L ${me.x + 120} ${me.y + 200} Z`} fill="#C85E1C" stroke="#100E16" strokeWidth={8} />
        <path d={`M ${me.x - 60} ${me.y - 400} Q ${me.x} ${me.y - 440} ${me.x + 60} ${me.y - 400}`} stroke="#A04A14" strokeWidth={8} fill="none" />
      </g>
    </g>
  );
};

// ---------- S15: the valley at night, far from home; something on the far side flickers, once ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const flick = t > len - 22 && t < len - 16 ? 1 : 0;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, VALLEY_LIGHT.x - 120]]), kf(t, [[0, 560], [len, VALLEY_LIGHT.y]]), kf(t, [[0, 1], [len, 1.6]]))}>
      <Valley t={t + 100} light={flick} />
    </g>
  );
};

void Soft; void Hero; void DrawOn; void easeOut;
