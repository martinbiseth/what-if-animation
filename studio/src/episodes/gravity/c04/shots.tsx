import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, easeIn, backOut, ShotProps, FONT, Kitchen, KITCHEN, KitchenIsland, stand, rnd,
  Schematic, SCH, SchLabel, DrawOn, Arrow, factCard, LEG_LEN,
} from '../../../engine';
import { YOU, MOM, ELLIE, Soft, wordF, faceCU, Body, lie, heavy, Dog, PoolYard, YARD, gCard, phoneG, doublingShot, bigWord, shk } from '../common';
import { StreetModern, STREETM } from '../../electricity/sets';
import words from './words.json';

// Chapter 4, the catch: 8:00, four times normal. You drop to your knees. Your heart pushes blood 30 cm uphill and it
// now weighs four times as much. Pilots grey out at 3-4 g (real). You lie down and the grey clears; eight billion
// people do the same. Trained pilots in G-suits take 8-9 g for seconds; nobody has done it for an hour. Outside,
// things break. Biscuit shakes. Eight g in an hour, sixteen in two.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const KIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} veil={0.3} />;
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" car={true} />;
const kFloor = (u: number, w: number) => KITCHEN.P(u, 1, w);
const kScale = (u: number, w: number) => stand(KITCHEN, u, w).scale;

// ---------- S1: 4G ----------
export const S1 = gCard({ g: '4G', clock: '8:00 AM', color: '#FF4A3A', Bg: KIT });

// ---------- S2: the app: 19.6 jumps to 39.2 ----------
export const S2: React.FC<ShotProps> = (p) => phoneG({ from: '19.6', to: '39.2', at: rel(p.f, p.t, 'thirty'), Bg: KIT, zoom: [1.05, 1.15] })(p);

// ---------- S3: you at the counter, and then on your knees without deciding to ----------
export const S3: React.FC<ShotProps> = ({ t, len, f }) => {
  const kneel = rel(f, t, 'Now');
  const st = stand(KITCHEN, 0.36, 0.78);
  const fl = kFloor(0.36, 0.78);
  const k = easeIn(clamp((t - kneel + 4) / 6));
  const pose: Pose = {
    ...basePose, ...st, yaw: 0.35, ...heavy(4),
    y: st.y + (LEG_LEN * st.scale * 0.55) * k,
    legL: { a: 90 * k, b: -100 * k }, legR: { a: 80 * k, b: -95 * k },
    armL: { a: 20 + 30 * k, b: -40 * k }, armR: { a: 18, b: -10 },
    tilt: 6 + 20 * k, squash: 0.06,
  };
  return (
    <g transform={`${shk(t, kneel + 2, 8, 12)} ${camT(kf(t, [[0, st.x + 80], [len, st.x + 50]]), st.y - 40, kf(t, [[0, 1.35], [len, 1.5]]))}`}>
      <KIT t={t + 100} />
      <KitchenIsland />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'worried'], [Math.max(1, kneel), 'shock']]} shadow={1} />
      {t > kneel + 2 && t < kneel + 14 ? <ellipse cx={fl.x} cy={fl.y} rx={120 + (t - kneel) * 14} ry={16} fill="none" stroke="#F6EFE3" strokeWidth={4} opacity={1 - (t - kneel - 2) / 12} /> : null}
    </g>
  );
};

// ---------- S4: the schematic body: heart, brain, 30 cm uphill; the blood drops get heavier (x4) ----------
const BodyOutline: React.FC<{ t: number; x: number; y: number; flat?: boolean }> = ({ t, x, y, flat = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${flat ? -90 : 0})`}>
    <DrawOn d="M 0 -380 m -70 0 a 70 70 0 1 0 140 0 a 70 70 0 1 0 -140 0" t={t} dur={10} />
    <DrawOn d="M -60 -300 L -90 0 L -60 260 M 60 -300 L 90 0 L 60 260 M -90 -280 L -170 -40 M 90 -280 L 170 -40" t={t - 4} dur={12} />
    <path d="M 0 -60 C -50 -110 -80 -30 0 20 C 80 -30 50 -110 0 -60 Z" fill="#E8453A" stroke={SCH.line} strokeWidth={4} transform={`scale(${1 + 0.06 * Math.sin(t / 4)})`} />
    <ellipse cx={0} cy={-390} rx={44} ry={34} fill="#E8A0B8" stroke={SCH.line} strokeWidth={4} opacity={0.9} />
  </g>
);
export const S4: React.FC<ShotProps> = ({ t, len, f }) => {
  const four = rel(f, t, 'four', 2);
  const heavyK = t >= four ? 1 : 0;
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}>
        <Schematic t={t} id="c4s4" />
      </g>
      <BodyOutline t={t} x={760} y={600} />
      <DrawOn d="M 900 560 L 900 220" t={t - 20} dur={8} color={SCH.live} width={6} />
      <DrawOn d="M 880 560 L 920 560 M 880 220 L 920 220" t={t - 20} dur={4} color={SCH.live} width={6} />
      <SchLabel x={1010} y={400} t={t - 26} text="30 CM" size={48} color={SCH.live} anchor="start" />
      {Array.from({ length: 4 }).map((_, i) => {
        const y = 540 - ((t * (heavyK ? 1.2 : 3) + i * 80) % 320);
        return <circle key={i} cx={760} cy={y} r={heavyK ? 22 : 11} fill="#E8453A" />;
      })}
      {t >= four ? (
        <g transform={`translate(1400 700) scale(${backOut(clamp((t - four) / 8))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill={SCH.live}>×4</text>
          <text y={70} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.line}>AS HEAVY</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S5: the fighter pilot's g-meter: grey at 3 to 4 g, then dark ----------
export const S5: React.FC<ShotProps> = ({ t, len, f }) => {
  const gray = rel(f, t, 'gray');
  const needle = kf(t, [[0, 1], [Math.max(1, gray), 3.6], [Math.max(2, gray + 30), 5.2]]);
  const ang = (g: number) => -120 + (g - 1) * 30;
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
        <Schematic t={t} id="c4s5" />
      </g>
      <g transform="translate(960 600)">
        <circle r={300} fill="#0E1626" stroke={SCH.line} strokeWidth={6} />
        <path d={`M ${300 * Math.sin((ang(3) * Math.PI) / 180) * 0.86} ${-300 * Math.cos((ang(3) * Math.PI) / 180) * 0.86} A 258 258 0 0 1 ${258 * Math.sin((ang(4.5) * Math.PI) / 180)} ${-258 * Math.cos((ang(4.5) * Math.PI) / 180)}`} stroke="#8A8E9A" strokeWidth={40} fill="none" />
        <path d={`M ${258 * Math.sin((ang(4.5) * Math.PI) / 180)} ${-258 * Math.cos((ang(4.5) * Math.PI) / 180)} A 258 258 0 0 1 ${258 * Math.sin((ang(9) * Math.PI) / 180)} ${-258 * Math.cos((ang(9) * Math.PI) / 180)}`} stroke="#1A1A22" strokeWidth={40} fill="none" />
        {Array.from({ length: 9 }).map((_, i) => {
          const a = (ang(i + 1) * Math.PI) / 180;
          return <text key={i} x={200 * Math.sin(a)} y={-200 * Math.cos(a) + 14} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={SCH.line}>{i + 1}</text>;
        })}
        <path d="M -10 0 L 0 -240 L 10 0 Z" fill={SCH.live} transform={`rotate(${ang(needle)})`} />
        <circle r={20} fill={SCH.live} />
        <text y={140} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill={SCH.line}>G</text>
      </g>
      <SchLabel x={960} y={160} t={t - 4} text="FIGHTER PILOTS, NO HELP" size={46} />
      {t > gray ? <SchLabel x={1500} y={420} t={t - gray} text="GRAY" size={46} color="#B8BCC8" /> : null}
      {t > gray + 20 ? <SchLabel x={1500} y={760} t={t - gray - 20} text="DARK" size={46} color={SCH.live} /> : null}
    </g>
  );
};

// ---------- S6: your vision in the kitchen: graying from the edges, then going dark ----------
export const S6: React.FC<ShotProps> = ({ t, len, f }) => {
  const dark = rel(f, t, 'dark');
  const k = clamp(t / Math.max(1, dark));
  const d = clamp((t - dark) / 20);
  return (
    <g>
      <g transform={camT(960 + Math.sin(t / 9) * 20, 560, 1.4 + 0.1 * k)} style={{ filter: `grayscale(${k}) blur(${2 * d}px)` }}>
        <KIT t={t + 200} />
        <KitchenIsland />
      </g>
      <defs>
        <radialGradient id="c4tun">
          <stop offset={`${Math.max(5, 60 - 40 * k - 20 * d)}%`} stopColor="#000" stopOpacity={0} />
          <stop offset="100%" stopColor="#000" stopOpacity={0.6 + 0.4 * k} />
        </radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#c4tun)" />
      <rect width={1920} height={1080} fill="#000" opacity={0.85 * d} />
      {len > 0 ? null : null}
    </g>
  );
};

// ---------- S7: on your knees at four g, dizzy ----------
export const S7 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'dizzy']], yaw: 0.2, zoom: [3.0, 3.25], pose: { squash: 0.08, headTilt: 10 }, dark: 0.2 });

// ---------- S8: you lie down flat on the kitchen floor; the gray lifts ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const fl = kFloor(0.5, 0.82);
  const s = kScale(0.5, 0.82);
  const k = easeOut(clamp(t / 14));
  const kneelPose: Pose = { ...basePose, x: fl.x, y: fl.y - LEG_LEN * s * 0.45, scale: s, yaw: 0.3, legL: { a: 90, b: -100 }, legR: { a: 80, b: -95 }, tilt: 26 };
  const flat = lie(fl.x, fl.y, s, -1, {});
  const pose: Pose = { ...flat, x: kneelPose.x + (flat.x - kneelPose.x) * k, y: kneelPose.y + (flat.y - kneelPose.y) * k, spin: -90 * k, legL: { a: 90 * (1 - k) + 4 * k, b: -100 * (1 - k) }, legR: { a: 80 * (1 - k) - 4 * k, b: -95 * (1 - k) } };
  const g = clamp(1 - t / 40);
  return (
    <g>
      <g transform={camT(kf(t, [[0, fl.x], [len, fl.x - 30]]), fl.y - 140, kf(t, [[0, 1.9], [len, 2.1]]))} style={{ filter: `grayscale(${g})` }}>
        <KIT t={t + 260} />
        <KitchenIsland />
        <Body look={YOU} pose={pose} t={t} faces={[[0, 'dizzy'], [24, 'tired']]} />
      </g>
    </g>
  );
};

// ---------- S9: lying down, heart and brain at the same height: no climb ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}>
      <Schematic t={t} id="c4s9" />
    </g>
    <BodyOutline t={t} x={1000} y={620} flat />
    <DrawOn d="M 1000 700 L 600 700" t={t - 14} dur={8} color={SCH.live} width={6} />
    <SchLabel x={800} y={790} t={t - 20} text="NO CLIMB" size={48} color={SCH.live} />
    <SchLabel x={960} y={200} t={t - 4} text="LIE FLAT" size={56} />
  </g>
);

// ---------- S10: across the planet: everyone lying down in the street, on the sidewalk, in the road ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const looks = [YOU, MOM, ELLIE, MOM, YOU, MOM];
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1200]]), 640, kf(t, [[0, 1.1], [len, 1.25]]))}>
      <DAY t={t + 100} />
      {looks.map((l, i) => {
        const x = 200 + i * 300;
        const y = i % 2 ? STREETM.feet : STREETM.kerb + 90;
        return <Body key={i} look={l} pose={lie(x, y, i === 2 ? 0.45 : 0.6, i % 2 ? 1 : -1)} t={t} faces={[[0, i % 3 ? 'tired' : 'worried']]} seed={i + 1} />;
      })}
    </g>
  );
};

// ---------- S11: the fact: trained pilots in G-suits, 8 to 9 g, for seconds ----------
export const S11 = factCard({ value: 9, suffix: ' G', label: 'TRAINED PILOTS IN G-SUITS', sub: 'for a few seconds, in a jet, with a suit squeezing their legs' });

// ---------- S12: nobody has ever done it for an hour ----------
export const S12 = bigWord({ kicker: 'NOBODY HAS EVER DONE IT FOR', word: 'AN HOUR', color: '#FF4A3A', Bg: KIT, size: 220 });

// ---------- S13: outside, things break: the tree groans and a branch rips off, the gutters fold, the fence leans ----------
export const S13: React.FC<ShotProps> = ({ t, len, f }) => {
  const rip = rel(f, t, 'rips');
  const k = easeIn(clamp((t - rip) / 6));
  const bx = 900;
  return (
    <g transform={`${shk(t, rip + 6, 8, 10)} ${camT(kf(t, [[0, 800], [len, 760]]), 480, kf(t, [[0, 1.2], [len, 1.3]]))}`}>
      <PoolYard t={t + 100} broken={clamp(t / 40)} />
      <rect x={bx - 30} y={300} width={60} height={YARD.lawn - 300} fill="#6A4A30" stroke="#2A1A10" strokeWidth={6} />
      <circle cx={bx} cy={280} r={150} fill="#4E8A40" stroke="#2A4A20" strokeWidth={6} />
      <circle cx={bx - 110} cy={340} r={90} fill="#5E9A4E" stroke="#2A4A20" strokeWidth={6} />
      <g transform={`translate(${bx + 20} 360) rotate(${100 * k}) translate(0 ${400 * k})`}>
        <path d="M 0 0 L 200 -40" stroke="#6A4A30" strokeWidth={24} strokeLinecap="round" />
        <circle cx={220} cy={-50} r={80} fill="#5E9A4E" stroke="#2A4A20" strokeWidth={6} />
      </g>
      <path d={`M -400 260 L 320 ${260 + 40 * clamp(t / 30)}`} stroke="#8A8E9A" strokeWidth={18} />
      {t >= rip && t < rip + 10 ? <text x={bx + 200} y={260} fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">CRACK!</text> : null}
    </g>
  );
};

// ---------- S14: the kitchen shelves snap and the plates come down like bullets ----------
export const S14: React.FC<ShotProps> = ({ t, len, f }) => {
  const snap = rel(f, t, 'snap');
  return (
    <g transform={`${shk(t, snap, 10, 14)} ${camT(1240, 420, kf(t, [[0, 2.2], [len, 2.3]]))}`}>
      <KIT t={t + 300} />
      <g transform={`rotate(${t >= snap ? 14 : 0} 1150 380)`}>
        <rect x={1150} y={370} width={220} height={16} fill="#8A6A4A" stroke="#2A1A10" strokeWidth={4} />
      </g>
      {Array.from({ length: 5 }).map((_, i) => {
        const fy = t >= snap ? Math.min(760, 340 + Math.pow((t - snap) * (1 + i * 0.1), 2) * 6) : 340;
        const broken = fy >= 760;
        return broken ? (
          <g key={i}>
            {[0, 1, 2].map((j) => <path key={j} d={`M ${1180 + i * 40 + j * 16} 760 l ${10 - j * 8} -16 l 12 4 Z`} fill="#F6EFE3" stroke="#1A1620" strokeWidth={3} />)}
          </g>
        ) : (
          <g key={i}>
            <ellipse cx={1180 + i * 40} cy={fy} rx={26} ry={10} fill="#F6EFE3" stroke="#1A1620" strokeWidth={4} />
            {t >= snap ? <path d={`M ${1180 + i * 40} ${fy - 14} l 0 -40`} stroke="#F6EFE3" strokeWidth={4} opacity={0.6} /> : null}
          </g>
        );
      })}
      {len > 0 ? null : null}
    </g>
  );
};

// ---------- S15: Biscuit crawls across the floor on his belly and lies down next to you, shaking ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const fl = kFloor(0.5, 0.82);
  const s = kScale(0.5, 0.82);
  const dx = kf(t, [[0, 600], [Math.max(1, len * 0.6), 220]]);
  return (
    <g transform={camT(fl.x + 120, fl.y - 120, kf(t, [[0, 2.2], [len, 2.4]]))}>
      <KIT t={t + 340} />
      <KitchenIsland />
      <Body look={YOU} pose={lie(fl.x, fl.y, s, -1)} t={t} faces={[[0, 'tired'], [Math.round(len * 0.7), 'worried']]} />
      <Dog x={fl.x + dx} y={fl.y + 10} s={s * 0.6} t={t} flat={1} flip shake={1} look={-0.5} />
    </g>
  );
};

// ---------- S16: the math: 8G in one hour, 16G in two ----------
export const S16: React.FC<ShotProps> = (p) => {
  const r = (w: string, n = 1) => rel(p.f, p.t, w, n);
  const lit = p.t >= r('sixteen') ? 4 : 3;
  return doublingShot({ lit, at: [-60, -50, -40, Math.max(0, r('eight', 4)), Math.max(10, r('sixteen'))] })(p);
};

// ---------- S17: you on the floor, close: nobody knows how to survive sixteen ----------
export const S17 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'worried'], [30, 'shock']], yaw: 0.1, zoom: [3.4, 3.8], pose: { spin: -90, squash: 0 }, dark: 0.15 });

// ---------- S18: close on you, on your knees, a hand to your chest: every beat ----------
export const S18 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'worried']], yaw: 0.3, zoom: [2.6, 2.8], pose: { squash: 0.06, armR: { a: 150, b: -120 }, tilt: 8 }, extra: (t) => <circle cx={985} cy={600} r={18 + 6 * Math.abs(Math.sin(t / 5))} fill="#E8453A" opacity={0.5} /> });
