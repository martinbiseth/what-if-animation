import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, easeInOut, backOut, ShotProps, idleBlink, FONT, Glow, LEG_LEN,
  Kitchen, KITCHEN, KitchenIsland, stand, Bedroom, bedSit, BedDuvet, Schematic, SchLabel, SCH, factCard, OpenBook,
} from '../../../engine';
import { YOU, ELLIE, MOM, MO, faceCU, bigWord, Soft, relW, dayK, ELLIE_K, MOM_K } from '../common';
import { Bathroom, BATH, StepStool, DoorFrame, ageK, markH } from '../sets';
import { StreetModern, STREETM, Bike } from '../../electricity/sets';
import words from './words.json';

// Chapter 4, the catch: the body doesn't shrink, it un-builds. 5-6 cm a year (two inches a night), the bike, the step
// stool. 300 bones at birth, 206 grown up: they come apart again (skull, hips, spine). New clothes every two days and
// Ellie in your old hoodie. The brain: 90% by six, fastest before that; nobody remembers before about three, and a
// three-year-old's brain can't hold fifteen years. Day 8: you're 7, Ellie is 8, and your little sister is your big sister.

const W = words;
const rel = relW(W);
const P0 = '#100E16';
const KIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} veil={0.25} />;
const NIGHT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} veil={0.75} clock="00:00" lamp={0} />;
const DarkBg: React.FC<{ t: number; id?: string }> = () => <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />;
const SCHB: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Schematic t={t} id={id ?? 'c4s'} />;
const HOOD_E = { ...ELLIE, jacket: YOU.jacket, jacketShade: YOU.jacketShade, accent: YOU.accent, extra: 'hood' as const };

// ---------- S1: THE CATCH ----------
export const S1 = bigWord({ kicker: 'THE CATCH', word: 'IT UN-BUILDS', color: '#FF8A3D', Bg: SCHB, size: 200 });

// ---------- S2: you in a spotlight, shrinking in steps, a ruler beside you ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const step = Math.floor(t / 22);
  const k = ageK(13 - step) + (1 - easeOut(clamp((t % 22) / 8))) * 0.038;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />
      <ellipse cx={960} cy={860} rx={300} ry={50} fill="#F6EFE3" opacity={0.15} />
      <Glow x={960} y={600} r={500} kind="warm" o={0.35} />
      <g transform="translate(1260 860)">
        <rect x={0} y={-460} width={40} height={460} fill="#E8C23A" stroke={P0} strokeWidth={4} />
        {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M 0 ${-i * 38} l ${i % 2 ? 14 : 26} 0`} stroke={P0} strokeWidth={3} />)}
      </g>
      <Hero look={YOU} pose={{ ...basePose, x: 960, y: 860 - LEG_LEN * k, scale: k, yaw: 0.1, expr: 'worried', blink: idleBlink(t, 2), look: 0.6 }} />
    </g>
  );
};

// ---------- S3: the fact: 5-6 cm a year ----------
export const S3 = factCard({ value: 6, suffix: ' cm', label: 'HOW MUCH KIDS GROW EACH YEAR (AGE 4 TO PUBERTY)', sub: 'CDC growth charts; Nemours KidsHealth', format: (v: number) => `5-${Math.round(v)}` } as Parameters<typeof factCard>[0]);

// ---------- S4: the door frame: night after night the line drops, two inches at a time ----------
const FX = 760;
const FY = 980;
const FH = 820;
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(4, Math.floor(t / 16));
  const marks = [0, 1, 2, 3, 4].map((i) => ({ h: markH(14 - i), label: `${14 - i}`, on: i <= n ? 1 : 0, color: i === n ? '#C8323A' : '#3A3440' }));
  const k = (ageK(14 - n) * 1.5);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1.15]]))}>
      <DoorFrame x={FX} y={FY} h={FH} marks={marks} />
      <Hero look={YOU} pose={{ ...basePose, x: FX + 130, y: FY - LEG_LEN * k, scale: k, yaw: 0.05, expr: 'worried', blink: idleBlink(t, 3) }} />
      <g transform={`translate(1380 300) scale(${backOut(clamp((t - rel('So', 'two')) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FF5A3A" stroke={P0} strokeWidth={14} paintOrder="stroke">−2 IN</text>
        <text y={70} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={6} fill={P0}>EVERY NIGHT</text>
      </g>
    </g>
  );
};

// ---------- S5: the street: the red bike next to you, its saddle at your chest now ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const k = dayK(7);
  const gy = STREETM.kerb + 60;
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 920]]), 640, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <StreetModern t={t + 100} mode="day" />
      <Bike x={1040} y={gy} s={0.82} color="#E8252A" />
      <Hero look={{ ...YOU }} pose={{ ...basePose, x: 820, y: gy - LEG_LEN * k, scale: k, yaw: 0.5, expr: 'worried', blink: idleBlink(t, 3), look: 0.6, armR: { a: 80, b: -10 } }} />
      <text x={960} y={360} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFD23A" stroke={P0} strokeWidth={12} paintOrder="stroke" opacity={clamp((t - rel('clothes', 'bike')) / 6)}>DOESN'T FIT</text>
    </g>
  );
};

// ---------- S6: the bathroom: you on a step stool, on tiptoe, to reach the sink ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const k = dayK(8) * 1.9;
  const tip = Math.sin(t / 6) * 6;
  return (
    <g transform={camT(BATH.mx, 640, kf(t, [[0, 1.15], [len, 1.25]]))}>
      <Bathroom t={t} glass={<g />} />
      <StepStool x={BATH.mx} y={1180} s={1.6} />
      <Hero look={YOU} pose={{ ...basePose, x: BATH.mx, y: 1180 - 104 * 1.6 - LEG_LEN * k - tip, scale: k, yaw: 0, expr: 'worried', blink: idleBlink(t, 2), armL: { a: 150, b: -60 }, armR: { a: 150, b: -60 } }} />
      <path d={`M ${BATH.mx - 360} ${BATH.sink} L ${BATH.mx + 360} ${BATH.sink} L ${BATH.mx + 330} ${BATH.sink + 70} Q ${BATH.mx} ${BATH.sink + 120} ${BATH.mx - 330} ${BATH.sink + 70} Z`} fill="#F4F2EC" stroke={P0} strokeWidth={6} />
      <text x={BATH.mx} y={240} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} letterSpacing={10} fill={P0} opacity={clamp(t / 8)}>DAY 8</text>
    </g>
  );
};

// ---------- S7, S8: the bones: 300, then 206 ----------
export const S7 = factCard({ value: 300, label: 'BONES IN A NEWBORN BABY (ABOUT)', sub: 'Library of Congress, Everyday Mysteries' });
export const S8 = factCard({ value: 206, label: 'BONES IN AN ADULT', sub: 'many of them fuse as you grow' });

// ---------- S9: the skull from above: the plates fuse, then (backwards) pull apart again ----------
const plates = [
  'M 960 300 Q 800 310 760 460 L 940 470 L 960 300 Z',
  'M 960 300 Q 1120 310 1160 460 L 980 470 L 960 300 Z',
  'M 760 480 Q 760 660 900 720 L 940 490 Z',
  'M 1160 480 Q 1160 660 1020 720 L 980 490 Z',
];
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const fuse = clamp(t / 20);
  const apart = clamp((t - rel('As', 'apart')) / 20);
  const gap = (1 - fuse) * 24 + apart * 40;
  const c = [[-1, -1], [1, -1], [-1, 1], [1, 1]];
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <Schematic t={t} id="c4sk" />
      <SchLabel x={960} y={170} t={t - 2} text={apart > 0 ? 'GOING BACKWARDS: THEY COME APART' : 'GROWING UP: BONES FUSE'} size={44} color={apart > 0 ? SCH.live : SCH.line} />
      {plates.map((d, i) => (
        <path key={i} d={d} transform={`translate(${c[i][0] * gap} ${c[i][1] * gap})`} fill="#E9E4DA" stroke={P0} strokeWidth={6} opacity={0.95} />
      ))}
      <text x={960} y={900} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={SCH.dim}>THE SKULL, FROM ABOVE</text>
    </g>
  );
};

// ---------- S10: a skeleton glyph: skull, hips and the bottom of the spine light up as each is said ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const spots: [number, number, string, string][] = [[960, 250, 'SKULL', 'skull'], [960, 620, 'HIPS', 'hips'], [960, 700, 'SPINE', 'bottom']];
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <Schematic t={t} id="c4sb" />
      <g stroke={SCH.line} strokeWidth={10} fill="none" strokeLinecap="round">
        <circle cx={960} cy={250} r={90} />
        <path d="M 960 340 L 960 700 M 860 420 L 1060 420 M 880 470 Q 960 500 1040 470 M 890 520 Q 960 550 1030 520 M 860 600 Q 960 680 1060 600 M 860 420 L 790 640 M 1060 420 L 1130 640 M 900 650 L 870 940 M 1020 650 L 1050 940" />
      </g>
      {spots.map(([x, y, label, cue], i) => {
        const a = i === 0 ? 0 : rel('skull', cue);
        const k = clamp((t - a) / 6);
        return (
          <g key={label} opacity={k}>
            <circle cx={x} cy={y} r={70 + 10 * Math.sin(t / 4)} fill="none" stroke={SCH.live} strokeWidth={8} />
            <text x={x + (i === 1 ? -150 : 150)} y={y + 14} textAnchor={i === 1 ? 'end' : 'start'} fontFamily={FONT.ui} fontSize={50} fill={SCH.live}>{label}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- S11: night: you asleep sitting up; at midnight a warm pulse runs over you ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const s = bedSit(0.22);
  const pulse = clamp((t - 20) / 14);
  return (
    <g transform={camT(900, 470, kf(t, [[0, 2.2], [len, 2.35]]))}>
      <NIGHT t={t} />
      <Hero look={YOU} pose={{ ...basePose, ...s, scale: s.scale * dayK(8), yaw: 0.3, expr: 'tired', blink: 1, headTilt: 12, armL: { a: 20, b: -40 }, armR: { a: 20, b: -40 } }} />
      <BedDuvet from={0.13} knees={0.6} />
      {pulse > 0 && pulse < 1 ? <circle cx={s.x} cy={s.y - 80 * s.scale} r={40 + pulse * 260} fill="none" stroke="#FFB15A" strokeWidth={10 * (1 - pulse)} opacity={1 - pulse} /> : null}
    </g>
  );
};

// ---------- S12: a rail of new clothes, each smaller than the last, the size tags reading down ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const sizes = ['13', '12', '11', '10', '9', '8'];
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 1100]]), 540, 1)}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#E8DCCB" />
      <rect x={-400} y={880} width={2800} height={600} fill="#B89A7A" />
      <path d="M -200 220 L 2200 220" stroke="#8A8E94" strokeWidth={16} />
      {sizes.map((s, i) => {
        const k = 1 - i * 0.1;
        const x = 300 + i * 300;
        const on = clamp((t - i * 8) / 6);
        return (
          <g key={s} transform={`translate(${x} 220) scale(${k * on})`}>
            <path d="M 0 0 L 0 30" stroke="#5A5E64" strokeWidth={6} />
            <path d="M -120 60 L 0 30 L 120 60 L 170 200 L 120 220 L 110 160 L 110 520 L -110 520 L -110 160 L -120 220 L -170 200 Z" fill={['#F07A2A', '#3E8C86', '#E8C23A', '#6A8ACA', '#C84A6A', '#5AA84E'][i]} stroke={P0} strokeWidth={8} />
            <rect x={-40} y={80} width={80} height={60} rx={6} fill="#FFFDF4" stroke={P0} strokeWidth={4} />
            <text y={124} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={P0}>{s}</text>
          </g>
        );
      })}
      <text x={1100} y={960} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill={P0} opacity={clamp((t - rel('mom', 'Smaller')) / 6)}>SMALLER EVERY TIME</text>
    </g>
  );
};

// ---------- S13: the kitchen: Ellie in your old orange hoodie, sleeves rolled; you beside her in kids' clothes ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const e = stand(KITCHEN, 0.42, 0.5, 0.62 * ELLIE_K);
  const y = stand(KITCHEN, 0.6, 0.5, 0.62 * dayK(7));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 560, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <KIT t={t + 200} />
      <Hero look={HOOD_E} pose={{ ...basePose, ...e, yaw: 0.3, expr: 'smug', blink: idleBlink(t, 3), armL: { a: 40, b: -100 }, armR: { a: 30, b: -100 } }} />
      <Hero look={{ ...YOU, jacket: '#6A8ACA', jacketShade: '#5070A8', extra: undefined }} pose={{ ...basePose, ...y, yaw: -0.3, facing: -1, expr: 'worried', blink: idleBlink(t, 5) }} />
    </g>
  );
};

// ---------- S14: close, you, the light going down ----------
export const S14 = faceCU({ look: YOU, Bg: DarkBg, faces: [[0, 'worried']], yaw: 0.2, zoom: [3.2, 3.6], dark: 0.3, pose: { scale: dayK(8) / 0.95 } });

// ---------- S15: the brain: 90% by age 6 ----------
export const S15 = factCard({ value: 90, suffix: '%', label: 'OF ADULT BRAIN SIZE, BY AGE 6', sub: 'Lenroot & Giedd, Neuroscience & Biobehavioral Reviews 2006' });

// ---------- S16: the growth curve of the brain, then a dot running back down its steep start ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const X = (age: number) => 360 + age * 64;
  const Y = (age: number) => 860 - 560 * (1 - Math.exp(-age / 2.2)) * 1.02;
  const pts = Array.from({ length: 41 }).map((_, i) => i / 2);
  const back = clamp((t - rel('Before', 'backwards')) / 50);
  const age = 15 - easeInOut(back) * 15;
  const draw = clamp(t / 30);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.05]]))}>
      <Schematic t={t} id="c4g" />
      <SchLabel x={960} y={170} t={t - 2} text="BRAIN SIZE BY AGE" size={46} />
      <path d="M 360 860 L 1640 860 M 360 860 L 360 260" stroke={SCH.dim} strokeWidth={4} />
      {[0, 3, 6, 10, 15].map((a) => <text key={a} x={X(a)} y={910} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={SCH.dim}>{a}</text>)}
      <path d={pts.filter((a) => a <= 20 * draw).map((a, i) => `${i ? 'L' : 'M'} ${X(a)} ${Y(a)}`).join(' ')} stroke={SCH.line} strokeWidth={8} fill="none" />
      <rect x={X(0)} y={260} width={X(6) - X(0)} height={600} fill={SCH.live} opacity={0.08 + 0.1 * clamp((t - rel('Before', 'grows')) / 10)} />
      <text x={(X(0) + X(6)) / 2} y={320} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live} opacity={clamp((t - rel('Before', 'faster')) / 8)}>FASTEST</text>
      {back > 0 ? (
        <g>
          <circle cx={X(age)} cy={Y(age)} r={22} fill={SCH.live} />
          <text x={X(age) + 30} y={Y(age) - 30} fontFamily={FONT.ui} fontSize={36} fill={SCH.live}>YOU</text>
        </g>
      ) : null}
      <SchLabel x={1300} y={700} t={t - rel('Before', 'shrinks')} text="SHRINKS FASTER" size={48} color={SCH.live} />
    </g>
  );
};

// ---------- S17: earliest memories: about age 3 ----------
export const S17 = factCard({ value: 3, label: 'AVERAGE AGE OF YOUR EARLIEST MEMORY (ABOUT)', sub: 'Akhtar et al., Psychological Science 2018: 3.2 years' });

// ---------- S18-S20: your memories as photos in the dark: they pop on as named, then fade ----------
type Snap = { x: number; y: number; rot: number; look: typeof YOU; label: string; cue: string };
const SNAPS: Snap[] = [
  { x: 520, y: 420, rot: -8, look: MO, label: 'MO', cue: 'Mo' },
  { x: 960, y: 360, rot: 4, look: MOM, label: 'MOM', cue: 'mom' },
  { x: 1400, y: 440, rot: -3, look: ELLIE, label: 'ELLIE', cue: 'Ellie' },
  { x: 700, y: 760, rot: 6, look: YOU, label: 'AGE 9', cue: '' },
  { x: 1220, y: 780, rot: -6, look: YOU, label: 'AGE 13', cue: '' },
];
const Snapshot: React.FC<{ s: Snap; o: number; k?: number }> = ({ s, o, k = 1 }) => (
  <g transform={`translate(${s.x} ${s.y}) rotate(${s.rot}) scale(${k})`} opacity={o}>
    <rect x={-150} y={-170} width={300} height={340} fill="#FFFDF4" stroke={P0} strokeWidth={6} />
    <rect x={-130} y={-150} width={260} height={250} fill="#6A9ACA" />
    <defs><clipPath id={`snap${s.label.replace(/\W/g, '')}`}><rect x={-130} y={-150} width={260} height={250} /></clipPath></defs>
    <g clipPath={`url(#snap${s.label.replace(/\W/g, '')})`}>
      <g transform="translate(0 150) scale(1)"><Hero look={s.look} pose={{ ...basePose, x: 0, y: 0, expr: 'happy' }} shadow={0} /></g>
    </g>
    <text y={150} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={P0}>{s.label}</text>
  </g>
);
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.1], [len, 1.0]]))}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />
    <Glow x={960} y={540} r={700} kind="warm" o={0.2} />
    {SNAPS.map((s, i) => <Snapshot key={i} s={s} o={clamp((t - i * 6) / 8) * 0.9} />)}
    <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#F6EFE3" opacity={clamp((t - rel('brain', 'memories')) / 8)}>MEMORIES</text>
  </g>
);
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.08]]))}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />
    <Glow x={960} y={540} r={700} kind="warm" o={0.3} />
    <text x={960} y={160} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFD23A" stroke={P0} strokeWidth={12} paintOrder="stroke" opacity={clamp(t / 8)}>15 YEARS</text>
    {SNAPS.slice(0, 3).map((s, i) => {
      const a = rel('Fifteen', s.cue);
      return <Snapshot key={i} s={{ ...s, y: 560 }} o={clamp((t - a) / 4)} k={backOut(clamp((t - a) / 8)) * 1.2} />;
    })}
  </g>
);
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const fade = clamp((t - rel('But', 'hold')) / 20);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.08], [len, 1.0]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />
      {SNAPS.slice(0, 3).map((s, i) => <Snapshot key={i} s={{ ...s, y: 560 + fade * (40 + i * 30) }} o={1 - fade * 0.85} k={1.2 - fade * 0.2} />)}
      <text x={960} y={960} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={6} fill="#FF8A3D" opacity={clamp(t / 8)}>A 3-YEAR-OLD'S BRAIN CAN'T HOLD THIS</text>
    </g>
  );
};

// ---------- S21: DAY 8 · AGE 7 ----------
export const S21 = bigWord({ kicker: 'DAY 8', word: 'AGE 7', color: '#FF5A3A', Bg: KIT, size: 230 });

// ---------- S22: the door frame: you and Ellie back to back; Ellie's head is higher now ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const ky = ageK(7) * 1.5;
  const ke = ELLIE_K * 1.5;
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 600, kf(t, [[0, 1.15], [len, 1.22]]))}>
      <DoorFrame x={FX} y={FY} h={FH} marks={[{ h: markH(7), label: '7' }, { h: markH(8), label: 'ELLIE 8', side: 'R', color: '#C8323A' }, { h: markH(14), label: '14' }]} />
      <Hero look={YOU} pose={{ ...basePose, x: FX + 110, y: FY - LEG_LEN * ky, scale: ky, yaw: 0.4, expr: 'worried', blink: idleBlink(t, 3), look: 0.6 }} />
      <Hero look={ELLIE} pose={{ ...basePose, x: FX + 260, y: FY - LEG_LEN * ke, scale: ke, yaw: -0.4, facing: -1, expr: 'smug', blink: idleBlink(t, 5) }} />
      <path d={`M ${FX + 60} ${FY - FH * markH(8)} L ${FX + 340} ${FY - FH * markH(8)}`} stroke="#C8323A" strokeWidth={5} strokeDasharray="14 10" opacity={clamp((t - 10) / 8)} />
    </g>
  );
};

// ---------- S23: dinner: Ellie leans over and cuts your food into little squares ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const e = stand(KITCHEN, 0.44, 0.42, 0.62 * ELLIE_K);
  const y = stand(KITCHEN, 0.6, 0.42, 0.62 * dayK(8));
  const cut = Math.sin(t / 2.5) * 10;
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 990]]), 600, kf(t, [[0, 2.0], [len, 2.1]]))}>
      <KIT t={t + 300} />
      <Hero look={MOM} pose={{ ...basePose, ...stand(KITCHEN, 0.26, 0.3, 0.62 * MOM_K), yaw: 0.4, expr: 'worried', blink: idleBlink(t, 4) }} />
      <Hero look={ELLIE} pose={{ ...basePose, ...e, yaw: 0.6, tilt: 10, expr: 'happy', blink: idleBlink(t, 2), armR: { a: 80 + cut, b: -30 } }} />
      <Hero look={YOU} pose={{ ...basePose, ...y, yaw: -0.4, facing: -1, expr: 'oops', blink: idleBlink(t, 3) }} />
      <KitchenIsland />
    </g>
  );
};

// ---------- S24: bedtime: Ellie on the edge of your bed with a book, doing the voices; you under the duvet ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const s = bedSit(0.2);
  const e = bedSit(0.34, 0.2);
  const voice = Math.floor(t / 20) % 3;
  return (
    <g transform={camT(860, 480, kf(t, [[0, 2.0], [len, 2.15]]))}>
      <Bedroom t={t + 100} veil={0.55} clock="20:30" lamp={1} />
      <Hero look={YOU} pose={{ ...basePose, ...s, scale: s.scale * dayK(8), yaw: 0.4, expr: 'happy', blink: idleBlink(t, 3), armL: { a: 20, b: -40 }, armR: { a: 20, b: -40 } }} />
      <BedDuvet from={0.13} knees={0.6} />
      <Hero look={ELLIE} pose={{ ...basePose, ...e, scale: e.scale * ELLIE_K, yaw: -0.5, facing: -1, expr: (['happy', 'shock', 'smug'] as const)[voice], blink: idleBlink(t, 5), talk: Math.abs(Math.sin(t / 2.4)) * 0.8, armL: { a: 50, b: -90 }, armR: { a: 50, b: -90 }, legL: { a: 80, b: -80 }, legR: { a: 76, b: -76 } }} />
      <OpenBook x={e.x - 40 * e.scale} y={e.y - 60 * e.scale} w={70 * e.scale} rot={-6} turn={(t % 40) / 40} />
    </g>
  );
};

// ---------- S25: close, you, lights out: you realize ----------
export const S25 = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'tired'], [14, 'shock']], yaw: 0.3, zoom: [3.4, 3.8], dark: 0.3, light: { x: 1260, y: 400, kind: 'cool', o: 0.35 }, pose: { scale: dayK(8) / 0.95 } });

// ---------- S26: YOUR LITTLE SISTER → BIG SISTER ----------
export const S26: React.FC<ShotProps> = ({ t }) => {
  const sw = clamp((t - (rel('sister', 'big') + 6)) / 8);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0C0A16" />
      <Glow x={960} y={560} r={600} kind="warm" o={0.3} />
      <text x={960} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>YOUR LITTLE SISTER IS NOW YOUR</text>
      <g transform={`translate(960 640) scale(${backOut(sw)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={220} fill="#FF5A3A" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">BIG SISTER</text>
      </g>
    </g>
  );
};

void MO; void Soft; void easeOut;
