import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, easeIn, backOut, ShotProps, FONT, LEG_LEN, Schematic, SCH, SchLabel, DrawOn, CountUp, Arrow, factCard, chapterCard, UI, Glow } from '../../../engine';
import {
  YOU, Body, Soft, faceCU, bigWord, wordF, HeadBar, overHead, flying, landed, Pow, BAR, Car, StreetModern, STREETM, streetHip, CityNight, HospitalRoom, inBed, Sheet, Pillow, LivingRoom, sofaSit,
} from '../common';
import { Hospital } from '../../electricity/sets';
import { shk } from '../../gravity/common';
import words from './words.json';

// Chapter 4, the catch: in a game a fall is a number; in real life it's physics. Ten floors = 54 mph, gravity adds 22
// mph a second; the stop is the problem (hundreds of g in a few inches); Stapp's 46 g; a car at 30 needs 75 ft, six
// car lengths, and carries a three-story drop. Something else takes the hit: you appeared at the hospital, and E = mc²
// says your body is more than two days of the world's energy. The flicker spreads to the whole city.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" car={false} />;
const F = STREETM.feet;
const SchBg: React.FC<{ t: number; len: number; id: string }> = ({ t, len, id }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [Math.max(1, len), 1.04]]))}>
    <Schematic t={t} id={id} />
  </g>
);
const fig = (x: number, y: number, s = 1, spin = 0) => (
  <g transform={`translate(${x} ${y}) rotate(${spin}) scale(${s})`}>
    <circle cx={0} cy={-60} r={22} fill="none" stroke={SCH.line} strokeWidth={6} />
    <path d="M 0 -38 L 0 30 M 0 -20 L -34 14 M 0 -20 L 34 14 M 0 30 L -24 80 M 0 30 L 24 80" stroke={SCH.line} strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);
const carIcon = (x: number, y: number, s = 1, c = SCH.line) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -90 0 L -90 -34 L -50 -40 L -26 -70 L 40 -70 L 64 -40 L 90 -32 L 90 0 Z" fill="none" stroke={c} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={-52} cy={2} r={16} fill={SCH.ground} stroke={c} strokeWidth={6} />
    <circle cx={52} cy={2} r={16} fill={SCH.ground} stroke={c} strokeWidth={6} />
  </g>
);

// ---------- S1: the bill ----------
export const S1 = chapterCard({ kicker: 'THE CATCH', title: 'PHYSICS SENDS THE BILL', ground: 'schematic' });

// ---------- S2: GAME vs REAL ----------
export const S2: React.FC<ShotProps> = ({ t, len, f }) => {
  const real = rel(f, t, 'real');
  return (
    <g>
      <SchBg t={t} len={len} id="c4s2" />
      <path d="M 960 160 L 960 920" stroke={SCH.dim} strokeWidth={4} strokeDasharray="14 12" />
      <SchLabel x={480} y={220} t={t - 2} text="IN A GAME" size={46} color={BAR.g} />
      {fig(480, 520, 1.6, 0)}
      <HeadBar x={480} y={330} s={1.1} p={t > 14 ? 0.8 : 1} t={t} hit={clamp(1 - Math.abs(t - 16) / 6)} />
      <SchLabel x={480} y={760} t={t - 16} text="A FALL = −10" size={52} color={BAR.g} />
      <SchLabel x={1440} y={220} t={t - real} text="IN REAL LIFE" size={46} color={SCH.live} />
      {t >= real ? fig(1440, 520, 1.6, 0) : null}
      <SchLabel x={1440} y={760} t={t - real - 8} text="A FALL = PHYSICS" size={52} color={SCH.live} />
      <SchLabel x={1440} y={830} t={t - real - 16} text="F = m · a" size={40} color={SCH.dim} />
    </g>
  );
};

// ---------- S3: ten floors, a figure falling, the speed counting up ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const dur = Math.max(30, len - 20);
  const k = clamp(t / dur);
  const top = 180, bot = 900;
  const y = top + (bot - top) * k * k;
  return (
    <g>
      <SchBg t={t} len={len} id="c4s3" />
      <DrawOn d={`M 560 ${bot} L 560 ${top} L 820 ${top} L 820 ${bot} L 260 ${bot} L 1700 ${bot}`} t={t} dur={14} />
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}>
          <DrawOn d={`M 560 ${top + i * 72} L 820 ${top + i * 72}`} t={t - 4 - i} dur={6} color={SCH.dim} width={3} />
          <SchLabel x={540} y={bot - i * 72 - 26} t={t - 8 - i} text={`${i + 1}`} size={24} color={SCH.dim} anchor="end" />
        </g>
      ))}
      {fig(900, y - 20, 1, 30 * k)}
      <text x={1320} y={520} textAnchor="middle" fontFamily={FONT.ui} fontSize={150} fill={SCH.live}>{Math.round(54 * k)}</text>
      <SchLabel x={1320} y={600} t={t - 4} text="MILES AN HOUR" size={40} color={SCH.dim} />
    </g>
  );
};

// ---------- S4: 54 mph: that's real ----------
export const S4 = factCard({ value: 54, suffix: ' MPH', label: 'TEN FLOORS (30 M), AT THE GROUND', sub: 'v = √(2gh) = 24 m/s' });

// ---------- S5: +22 mph every second ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s5" />
    <SchLabel x={960} y={220} t={t - 2} text="GRAVITY ADDS, EVERY SECOND YOU FALL" size={40} color={SCH.dim} />
    {[1, 2, 3].map((s, i) => {
      const k = easeOut(clamp((t - 8 - i * 14) / 12));
      const h = 150 * s * k;
      return (
        <g key={i}>
          <rect x={560 + i * 320} y={860 - h} width={160} height={h} fill={SCH.live} opacity={0.85} />
          <SchLabel x={640 + i * 320} y={920} t={t - 8 - i * 14} text={`${s} S`} size={36} />
          <SchLabel x={640 + i * 320} y={830 - 150 * s} t={t - 16 - i * 14} text={`${22 * s} MPH`} size={40} color={SCH.live} />
        </g>
      );
    })}
    <g opacity={clamp((t - 50) / 6)} transform="translate(960 380)">
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3">+22 MPH / SECOND</text>
    </g>
  </g>
);

// ---------- S6: it's not the speed, it's the stop ----------
export const S6 = bigWord({ kicker: "IT'S NOT THE SPEED", word: "IT'S THE STOP", color: SCH.live, size: 190 });

// ---------- S7: in a game: land, roll, up ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const land = 10;
  const x = 700 + Math.max(0, t - land) * 9;
  let pose: Pose;
  if (t < land) pose = flying(700, kf(t, [[0, 300], [land, F - LEG_LEN]]), 1, 0, t);
  else if (t < land + 14) pose = { ...basePose, x, y: F - 90, scale: 1, spin: 360 * ((t - land) / 14), legL: { a: 90, b: -120 }, legR: { a: 80, b: -120 }, armL: { a: 60, b: -90 }, armR: { a: 60, b: -90 } };
  else pose = { ...landed(x, F, 1, Math.max(0, 1 - (t - land - 14) / 8)), expr: 'cool' };
  return (
    <g>
    <g transform={camT(kf(t, [[0, 800], [len, 1000]]), 600, 1.3)}>
      <DAY t={t + 40} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'happy'], [land + 14, 'cool']]} shadow={t < land ? 0 : 1} />
    </g>
      <g transform="translate(260 180)">
        <rect x={-140} y={-46} width={280} height={80} rx={40} fill={UI.pill} stroke={BAR.g} strokeWidth={4} />
        <text textAnchor="middle" y={10} fontFamily={FONT.ui} fontSize={40} fill={BAR.g}>GAME</text>
      </g>
    </g>
  );
};

// ---------- S8: in real life: 54 mph to zero in a few inches ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s8" />
    <SchLabel x={960} y={200} t={t - 2} text="A REAL BODY STOPS" size={44} color={SCH.dim} />
    <DrawOn d="M 300 760 L 1620 760" t={t} dur={10} color={SCH.dim} width={4} />
    <DrawOn d="M 300 360 L 1300 360 Q 1340 360 1350 760" t={t - 6} dur={20} color={SCH.live} width={8} />
    <SchLabel x={360} y={330} t={t - 8} text="54 MPH" size={40} color={SCH.live} anchor="start" />
    <SchLabel x={1500} y={740} t={t - 26} text="0" size={40} color={SCH.live} />
    <Arrow x0={1300} y0={860} x1={1360} y1={860} t={t - 30} dur={8} />
    <SchLabel x={1330} y={930} t={t - 30} text="5 CM · 0.004 S" size={40} />
  </g>
);

// ---------- S9: hundreds of g ----------
export const S9 = factCard({ value: 600, suffix: ' G', label: 'STOPPING FROM 54 MPH IN 5 CM', sub: 'a = v² / 2d ≈ 5,900 m/s²', format: (v) => `~${Math.round(v)}` });

// ---------- S10: 46 g, the most ever taken on purpose ----------
export const S10 = factCard({ value: 46, suffix: ' G', label: 'THE MOST A HUMAN HAS TAKEN ON PURPOSE', sub: 'JOHN PAUL STAPP · ROCKET SLED · 10 DEC 1954' });

// ---------- S11: the rocket sled on its rails, a strapped-in figure, 632 mph to a stop ----------
export const S11: React.FC<ShotProps> = ({ t, len, f }) => {
  const tight = rel(f, t, 'tight');
  const x = kf(t, [[0, -300], [Math.max(10, len * 0.55), 1300], [len, 1420]]);
  return (
    <g>
      <SchBg t={t} len={len} id="c4s11" />
      <DrawOn d="M -100 720 L 2000 720 M -100 740 L 2000 740" t={t} dur={10} color={SCH.dim} width={4} />
      {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M ${-100 + i * 70} 740 L ${-100 + i * 70} 770`} stroke={SCH.dim} strokeWidth={4} />)}
      <g transform={`translate(${x} 700)`}>
        <path d="M -220 0 L -220 -60 L 60 -60 L 160 0 Z" fill="none" stroke={SCH.line} strokeWidth={6} />
        <path d="M -260 -20 L -320 -40 L -320 0 Z" fill={SCH.live} opacity={x < 1200 ? 0.6 + 0.4 * Math.sin(t) : 0} />
        <g transform="translate(-40 -110)">
          <circle cx={0} cy={-40} r={22} fill="none" stroke={SCH.line} strokeWidth={6} />
          <path d="M 0 -18 L 0 50" stroke={SCH.line} strokeWidth={6} />
          <path d="M -26 0 L 26 30 M 26 0 L -26 30" stroke={SCH.live} strokeWidth={6} opacity={t >= tight ? 1 : 0.4} />
        </g>
      </g>
      <SchLabel x={960} y={260} t={t - 4} text="STAPP · 632 MPH → 0 IN 1.4 S" size={44} />
      {t >= tight ? <SchLabel x={960} y={900} t={t - tight} text="STRAPPED IN TIGHT" size={48} color={SCH.live} /> : null}
    </g>
  );
};

// ---------- S12: in a game, a car stops on a dime ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const stop = 22;
  const x = t < stop ? -300 + t * 50 : -300 + stop * 50;
  return (
    <g>
    <g transform={`${shk(t, stop, 4, 4)} ${camT(800, 560, 1.15)}`}>
      <DAY t={t + 60} />
      <g transform={`rotate(${t >= stop && t < stop + 6 ? -3 : 0} ${x} ${F + 120})`}>
        <Car x={x} y={F + 120} s={1} color="#C8202A" />
      </g>
      {t < stop ? <path d={`M ${x - 240} ${F + 80} L ${x - 500} ${F + 80} M ${x - 240} ${F + 40} L ${x - 440} ${F + 40}`} stroke="#F6EFE3" strokeWidth={6} opacity={0.6} /> : null}
      <Pow x={x + 120} y={F - 160} t={t - stop} text="STOP." size={80} hold={40} rot={0} color="#F6EFE3" />
    </g>
    <g>
      <g transform="translate(260 180)">
        <rect x={-140} y={-46} width={280} height={80} rx={40} fill={UI.pill} stroke={BAR.g} strokeWidth={4} />
        <text textAnchor="middle" y={10} fontFamily={FONT.ui} fontSize={40} fill={BAR.g}>GAME</text>
      </g>
    </g>
  );
};

// ---------- S13: a real car at 30 mph: 75 feet, six car lengths ----------
export const S13: React.FC<ShotProps> = ({ t, len, f }) => {
  const six = Math.max(30, rel(f, t, 'six'));
  const k = easeOut(clamp((t - 6) / Math.max(20, six - 6)));
  return (
    <g>
      <SchBg t={t} len={len} id="c4s13" />
      <SchLabel x={960} y={200} t={t - 2} text="A REAL CAR AT 30 MPH" size={44} color={SCH.dim} />
      <DrawOn d="M 120 720 L 1800 720" t={t} dur={10} color={SCH.dim} width={4} />
      {carIcon(240 + 1360 * k, 700, 1.1, SCH.live)}
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i} opacity={clamp((t - six - i * 4) / 4)}>
          {carIcon(330 + i * 238, 860, 0.9, SCH.dim)}
        </g>
      ))}
      <Arrow x0={240} y0={600} x1={1600} y1={600} t={t - 10} dur={30} />
      <SchLabel x={920} y={560} t={t - 30} text="75 FT (23 M) TO STOP" size={48} color={SCH.live} />
      <SchLabel x={960} y={980} t={t - six - 20} text="= 6 CAR LENGTHS" size={44} />
    </g>
  );
};

// ---------- S14: the same energy as a car dropped from three stories ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeIn(clamp((t - 30) / 26));
  return (
    <g>
      <SchBg t={t} len={len} id="c4s14" />
      <DrawOn d="M 440 880 L 440 380 L 700 380 L 700 880 M 200 880 L 1760 880" t={t} dur={12} />
      {[0, 1, 2].map((i) => <DrawOn key={i} d={`M 440 ${380 + i * 166} L 700 ${380 + i * 166}`} t={t - 6 - i * 2} dur={6} color={SCH.dim} width={3} />)}
      <SchLabel x={570} y={330} t={t - 8} text="3 STORIES" size={36} color={SCH.dim} />
      {carIcon(860, 380 + 480 * k, 1, SCH.live)}
      {carIcon(1420, 860, 1, SCH.line)}
      <Arrow x0={1260} y0={800} x1={1340} y1={800} t={t - 10} dur={8} />
      <SchLabel x={1420} y={740} t={t - 12} text="30 MPH" size={44} color={SCH.line} />
      <g opacity={clamp((t - 20) / 6)} transform="translate(1140 560)">
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill={SCH.live}>=</text>
      </g>
      <SchLabel x={960} y={200} t={t - 2} text="THE SAME ENERGY" size={48} />
    </g>
  );
};

// ---------- S15: so what took the hit? you on the sofa, thinking ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const s = sofaSit(0.6);
  return (
    <g transform={camT(s.x - 40, s.y - 100, kf(t, [[0, 2.2], [len, 2.45]]))}>
      <LivingRoom t={t + 40} power={1} veil={0.4} />
      <Body look={YOU} pose={{ ...basePose, ...s, yaw: -0.4, look: 0.3, legL: { a: 80, b: -80 }, legR: { a: 75, b: -75 }, armR: { a: 150, b: -150 }, headTilt: 6 }} t={t} faces={[[0, 'neutral'], [40, 'worried']]} />
      <HeadBar {...overHead(s)} p={1} t={t} />
    </g>
  );
};

// ---------- S16: the hospital hallway: you didn't walk here ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Hospital t={t + 30} />
    </g>
    <rect width={1920} height={1080} fill="#B9D4E8" opacity={0.12} />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} opacity={0.35 * clamp((t - i * 6) / 6)}>
        <ellipse cx={960 + (i % 2 ? 30 : -30)} cy={1000 - i * 70} rx={24} ry={10} fill="#F6EFE3" />
      </g>
    ))}
    <g opacity={clamp((t - 24) / 6)}>
      <path d="M 900 800 L 1020 1000 M 1020 800 L 900 1000" stroke="#FF4A3A" strokeWidth={14} strokeLinecap="round" />
    </g>
  </g>
);

// ---------- S17: the bed: you appear out of light ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 6) / 14);
  return (
    <g transform={camT(1100, 560, kf(t, [[0, 1.9], [len, 2.0]]))}>
      <HospitalRoom t={t + 60} night={true} />
      <Pillow />
      <g opacity={k}>
        <Body look={{ ...YOU, jacket: '#B8D4E8', jacketShade: '#98B4C8', accent: '#E9F2F8' }} pose={inBed()} t={t} faces={[[0, 'neutral']]} />
      </g>
      <Sheet />
      {k > 0 && k < 1 ? <Glow x={inBed().x} y={inBed().y} r={300 * (1 - k) + 120} kind="cool" o={0.9 * (1 - k)} /> : null}
      {Array.from({ length: 14 }).map((_, i) => (
        <rect key={i} x={inBed().x - 200 + (i * 37) % 400} y={inBed().y - 120 + ((i * 53) % 160) - k * 40} width={10} height={10} fill="#7FD4FF" opacity={(1 - k) * (k > 0 ? 1 : 0)} />
      ))}
    </g>
  );
};

// ---------- S18: E = mc² ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s18" />
    <g transform={`translate(960 560) scale(${backOut(clamp((t - 10) / 10))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={260} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">E = mc²</text>
    </g>
    <SchLabel x={960} y={260} t={t - 2} text="A WHOLE PERSON, OUT OF NOTHING" size={44} color={SCH.dim} />
  </g>
);

// ---------- S19: more than two days of the world's energy ----------
export const S19 = factCard({ value: 2.4, suffix: ' DAYS', label: "YOUR BODY'S ENERGY (45 KG × c²)", sub: 'OF ALL THE ENERGY THE WHOLE WORLD USES', format: (v) => v.toFixed(1) });

// ---------- S20: every respawn: the energy has to come from somewhere: power lines into the hospital ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <CityNight t={t + 30} power={1} />
    {[[-200, 300], [200, 900], [1700, 260], [2100, 800], [600, 1100], [1400, 1100]].map(([x, y], i) => {
      const k = clamp((t - i * 4) / 30);
      const mx = x + (950 - x) * k, my = y + (410 - y) * k;
      return (
        <g key={i}>
          <path d={`M ${x} ${y} L ${mx} ${my}`} stroke="#FFD23A" strokeWidth={6} opacity={0.7} strokeDasharray="30 20" strokeDashoffset={-t * 8} />
          <circle cx={mx} cy={my} r={12} fill="#FFF4C8" />
        </g>
      );
    })}
    <Glow x={950} y={410} r={220 + 40 * Math.sin(t / 3)} kind="warm" o={0.8} />
  </g>
);

// ---------- S21: tonight the whole city flickers ----------
export const S21: React.FC<ShotProps> = ({ t, len, f }) => {
  const city = rel(f, t, 'city');
  const fl = t > 8 && t < city ? (Math.floor(t / 4) % 3 === 0 ? 0 : 1) : t >= city ? (t - city < 30 ? 0 : 1) : 1;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 0.95], [len, 1.05]]))}>
      <CityNight t={t + 60} power={fl} />
    </g>
  );
};

// ---------- S22: the bill: a receipt unrolling, PHYSICS at the top ----------
export const S22: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(clamp(t / 40));
  const items = [['GRAVITY', '9.81 m/s²'], ['SPEED', '54 MPH'], ['THE STOP', '0.004 S'], ['FORCE', '???']];
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />
      <g transform="translate(960 120)">
        <rect x={-300} y={0} width={600} height={160 + 680 * k} fill="#F6EFE3" />
        <path d={`M -300 ${160 + 680 * k} ${Array.from({ length: 15 }).map((_, i) => `L ${-300 + (i + 0.5) * 40} ${172 + 680 * k} L ${-300 + (i + 1) * 40} ${160 + 680 * k}`).join(' ')}`} fill="#F6EFE3" />
        <text textAnchor="middle" y={100} fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#16141C">PHYSICS</text>
        <path d="M -260 140 L 260 140" stroke="#16141C" strokeWidth={4} strokeDasharray="10 8" />
        {items.map(([a, b], i) => (
          <g key={i} opacity={clamp((t - 10 - i * 8) / 4)}>
            <text x={-260} y={230 + i * 110} fontFamily={FONT.ui} fontSize={44} fill="#16141C">{a}</text>
            <text x={260} y={230 + i * 110} textAnchor="end" fontFamily={FONT.ui} fontSize={44} fill={i === 3 ? '#C8202A' : '#16141C'}>{b}</text>
          </g>
        ))}
      </g>
    </g>
  );
};

// ---------- S23: you falling past the windows of a tall building, speed lines ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const scroll = (t * t * 0.4 + t * 6) % 300;
  return (
    <g>
      <rect width={1920} height={1080} fill="#8FC4E8" />
      <g transform={`translate(0 ${-scroll})`}>
        <rect x={1100} y={-400} width={900} height={2400} fill="#6A5060" />
        {Array.from({ length: 10 }).map((_, i) => Array.from({ length: 4 }).map((__, j) => <rect key={`${i}-${j}`} x={1160 + j * 200} y={-300 + i * 300} width={120} height={160} fill="#B9D4E8" stroke="#2A1E2A" strokeWidth={6} />))}
      </g>
      <SpeedLines2 t={t} />
      <Hero look={YOU} pose={flying(760, 540, 1.3, Math.sin(t / 6) * 20, t, { expr: 'shock', armL: { a: 170, b: 0 }, armR: { a: 190, b: 0 } })} shadow={0} />
      <HeadBar x={760} y={140} s={1} p={1} t={t} />
    </g>
  );
};
const SpeedLines2: React.FC<{ t: number }> = ({ t }) => (
  <g opacity={0.6}>
    {Array.from({ length: 10 }).map((_, i) => {
      const x = 300 + i * 90;
      const y = ((i * 137 + t * 40) % 1300) - 200;
      return <path key={i} d={`M ${x} ${y} L ${x} ${y - 220}`} stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />;
    })}
  </g>
);
