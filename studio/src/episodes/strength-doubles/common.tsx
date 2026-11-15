import React from 'react';
import {
  Hero, Look, Pose, ShotProps, basePose, camT, clamp, kf, lerp, rnd, backOut, easeOut, FONT, idleBlink, faceAt, Expr,
  Schematic, SCH, SchLabel, CountUp, Kitchen, Bedroom, Classroom, LEG_LEN, Glow,
} from '../../engine';
import { StreetModern, streetHip, STREETM, LivingRoom, CountryRoad, COUNTRY, countryHip } from '../electricity/sets';
import {
  YOU, MO, ELLIE, MUM, DAD, SUIT, NURSE, N1, N2, N3, GRAN, KID, Soft, span, phoneCU, propCU, faceCU, bigWord, talkShot, handAt, HeldPhone,
} from '../internet-gone/common';

// Shared by every chapter of "What if your strength doubled every day?": the cast (the ink cast), the strength HUD
// (day and how much you can lift), sets with a clock, the props the power breaks, and the cards.

export { YOU, MO, ELLIE, MUM, DAD, SUIT, NURSE, N1, N2, N3, GRAN, KID, Soft, span, phoneCU, propCU, faceCU, bigWord, talkShot, handAt, HeldPhone };
export const DOC: Look = { ...NURSE, jacket: '#E8EEF2', jacketShade: '#C8D2DA', accent: '#4AA8A0' };
export const TEACHER: Look = { ...N3, jacket: '#C83A3A', jacketShade: '#A02E2E', accent: '#F6EFE3' };
export const RUGBY: Look[] = [
  { ...N1, jacket: '#2A4A9A', jacketShade: '#223C80', accent: '#F6EFE3' },
  { ...N3, jacket: '#2A4A9A', jacketShade: '#223C80', accent: '#F6EFE3' },
  { ...DAD, jacket: '#2A4A9A', jacketShade: '#223C80', accent: '#F6EFE3' },
];

// ---------------------------------------------------------------- the power: how much you lift on day n
/** Kilograms you can lift on day n (50 kg on day 0, doubling every morning at six). */
export const liftKg = (day: number) => 50 * Math.pow(2, day);
export const liftLabel = (day: number) => {
  const kg = liftKg(day);
  if (kg < 1000) return `${Math.round(kg)} KG`;
  const t = kg / 1000;
  if (t < 10) return `${t.toFixed(1)} T`;
  return `${Math.round(t).toLocaleString('en-US')} T`;
};
export const POWER = '#FFD21F';

/** The HUD, top right: "DAY n" and the lift, with a x2 chip. Hidden until `hideUntil`. */
export const dayHud = (day: number, hideUntil = 20): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
    if (f < hideUntil) return null;
    const pop = clamp((f - hideUntil) / 8);
    const label = `DAY ${day}`;
    const lift = liftLabel(day);
    const w = 120 + label.length * 28 + lift.length * 24;
    return (
      <g transform={`translate(${1860 - w} 70)`} opacity={pop}>
        <rect x={0} y={0} width={w} height={86} rx={43} fill="#0B0816" opacity={0.68} />
        <circle cx={46} cy={43} r={28} fill={POWER} />
        <text x={46} y={55} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#0B0816">x2</text>
        <text x={92} y={58} fontFamily={FONT.title} fontWeight={800} fontSize={42} fill="#F6EFE3">{label}</text>
        <text x={102 + label.length * 28} y={57} fontFamily={FONT.ui} fontSize={34} fill={POWER}>{lift}</text>
      </g>
    );
  };
  return Hud;
};

// ---------------------------------------------------------------- sets with a clock
export type SetC = React.FC<{ t: number; id?: string }>;
export const StreetSet = (mode: 'day' | 'dusk' | 'night' = 'day', o: { car?: boolean; garage?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <StreetModern t={t} id={id} mode={mode} power={1} car={o.car ?? true} garageOpen={o.garage ?? 0} />;
  return S;
};
export const KitchenSet = (veil = 0.3): SetC => {
  const S: SetC = ({ t, id }) => <Kitchen t={t} id={id} veil={veil} />;
  return S;
};
export const BedroomSet = (clock = '06:00', veil = 0.15): SetC => {
  const S: SetC = ({ t, id }) => <Bedroom t={t} id={id} veil={veil} clock={clock} lamp={1} />;
  return S;
};
export const LivingSet: SetC = ({ t, id }) => <LivingRoom t={t} id={id} power={1} veil={0.2} />;
export const ClassSet: SetC = ({ t, id }) => <Classroom t={t} id={id} />;
export const CountrySet = (dusk = false): SetC => {
  const S: SetC = ({ t, id }) => <CountryRoad t={t} id={id} dusk={dusk} />;
  return S;
};
export { StreetModern, streetHip, STREETM, LivingRoom, CountryRoad, COUNTRY, countryHip };
export const HIP = streetHip(1);
export const at = (x: number, o: Partial<Pose> = {}, scale = 1): Pose => ({ ...basePose, x, y: streetHip(scale), scale, ...o });
export const atC = (x: number, o: Partial<Pose> = {}, scale = 1): Pose => ({ ...basePose, x, y: countryHip(scale), scale, ...o });

/** A plain bright clinical room (the hospital): pale wall, a window strip, a bed edge. */
export const HospitalRoom: SetC = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#C9D6DA" />
    <rect y={760} width={1920} height={320} fill="#A9B8BC" />
    <rect y={752} width={1920} height={14} fill="#8A9A9E" />
    <rect x={1180} y={180} width={520} height={360} fill="#9FC8E8" stroke="#7A8E94" strokeWidth={14} />
    <path d="M 1440 180 V 540 M 1180 360 H 1700" stroke="#7A8E94" strokeWidth={10} />
    <rect x={260} y={260} width={180} height={120} rx={10} fill="#2A3A3E" />
    <path d={`M 275 330 ${Array.from({ length: 12 }, (_, i) => `L ${280 + i * 13} ${330 + (i % 4 === 2 ? -40 + Math.sin(t / 3) * 6 : 0)}`).join(' ')}`} stroke="#5BE08A" strokeWidth={5} fill="none" />
    <Glow x={1440} y={360} r={420} kind="cool" o={0.4} />
  </g>
);

/** The old bridge over the river in winter, side-on: road deck at y 760, railing, the river far below. `gap` breaks the railing. */
export const BRIDGE = { deck: 760, edge: 1180 };
export const bridgeHip = (scale = 1) => BRIDGE.deck - LEG_LEN * scale;
export const BridgeSet = (o: { gap?: boolean; dusk?: boolean } = {}): SetC => {
  const S: SetC = ({ t, id = 'br' }) => (
    <g>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={o.dusk ? '#3A3A6A' : '#8AA8C8'} />
        <stop offset="1" stopColor={o.dusk ? '#C88A7A' : '#D8E4EC'} />
      </linearGradient>
      <rect width={1920} height={1080} fill={`url(#${id}sky)`} />
      {/* far bank with snowy trees */}
      <path d="M 0 640 Q 300 600 700 630 T 1400 620 T 1920 630 V 1080 H 0 Z" fill="#9AA8B4" />
      {Array.from({ length: 16 }, (_, i) => {
        const x = 40 + i * 125 + rnd(3, i) * 40;
        const h = 60 + rnd(4, i) * 50;
        return <path key={i} d={`M ${x} ${630} l 26 ${-h} l 26 ${h} Z`} fill="#6A7A88" />;
      })}
      {/* river */}
      <rect y={860} width={1920} height={220} fill="#3A5A72" />
      {Array.from({ length: 10 }, (_, i) => (
        <path key={i} d={`M ${((i * 230 + t * 1.5) % 2100) - 100} ${900 + (i % 3) * 50} h 90`} stroke="#8AB0C8" strokeWidth={5} strokeLinecap="round" opacity={0.6} />
      ))}
      {/* deck */}
      <rect x={-20} y={BRIDGE.deck} width={BRIDGE.edge + 20} height={46} fill="#5A5A64" />
      <rect x={-20} y={BRIDGE.deck} width={BRIDGE.edge + 20} height={8} fill="#E8EEF2" />
      <rect x={-20} y={BRIDGE.deck + 46} width={BRIDGE.edge + 20} height={18} fill="#3A3A44" />
      {/* the stone pier */}
      <path d={`M ${BRIDGE.edge - 260} ${BRIDGE.deck + 64} h 160 l 20 260 h -200 Z`} fill="#6A6460" />
      {/* railing */}
      {Array.from({ length: 24 }, (_, i) => {
        const x = 20 + i * 50;
        if (o.gap && x > 880 && x < 1060) return null;
        return <rect key={i} x={x} y={BRIDGE.deck - 90} width={10} height={90} fill="#2A2A34" />;
      })}
      <path d={o.gap ? `M -20 ${BRIDGE.deck - 92} H 880 M 1060 ${BRIDGE.deck - 92} H ${BRIDGE.edge}` : `M -20 ${BRIDGE.deck - 92} H ${BRIDGE.edge}`} stroke="#2A2A34" strokeWidth={12} />
      {o.gap ? <path d={`M 880 ${BRIDGE.deck - 92} l 40 60 M 1060 ${BRIDGE.deck - 92} l -30 70`} stroke="#2A2A34" strokeWidth={10} /> : null}
      {/* snow falling */}
      {Array.from({ length: 50 }, (_, i) => {
        const x = (rnd(7, i) * 2000 + t * (0.6 + rnd(8, i))) % 1960;
        const y = (rnd(9, i) * 1100 + t * (2 + rnd(10, i) * 2)) % 1100;
        return <circle key={i} cx={x} cy={y} r={2 + rnd(11, i) * 3} fill="#FFFFFF" opacity={0.8} />;
      })}
    </g>
  );
  return S;
};

// ---------------------------------------------------------------- props
export const PickleJar: React.FC<{ x: number; y: number; s?: number; lid?: number; rot?: number }> = ({ x, y, s = 1, lid = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-170} width={140} height={170} rx={24} fill="#9ACB8A" opacity={0.85} stroke="#100E16" strokeWidth={6} />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={-30 + i * 30} cy={-70 - (i % 2) * 40} rx={14} ry={40} fill="#5A8A3A" />)}
    <rect x={-60} y={-110} width={120} height={50} fill="#F6EFE3" stroke="#100E16" strokeWidth={4} />
    <text y={-77} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={24} fill="#3A5A2A">PICKLES</text>
    <g transform={`translate(${lid * 60} ${-180 - lid * 90}) rotate(${lid * 40})`}>
      <rect x={-76} y={-24} width={152} height={34} rx={8} fill="#C83A3A" stroke="#100E16" strokeWidth={6} />
    </g>
  </g>
);

export const SchoolBag: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-60} y={-80} width={120} height={150} rx={30} fill="#3A7AE0" stroke="#100E16" strokeWidth={6} />
    <rect x={-44} y={0} width={88} height={50} rx={12} fill="#2E62B8" stroke="#100E16" strokeWidth={4} />
    <path d="M -30 -80 Q 0 -120 30 -80" stroke="#100E16" strokeWidth={8} fill="none" />
  </g>
);

/** A box van, side view, wheels on y. */
export const Van: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean }> = ({ x, y, s = 1, color = '#E8E4DA', flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={8} rx={320} ry={16} fill="#000" opacity={0.3} />
    <rect x={-310} y={-330} width={430} height={310} rx={12} fill={color} stroke="#0E0F14" strokeWidth={6} />
    <path d="M 120 -250 H 220 Q 290 -240 310 -150 V -20 H 120 Z" fill={color} stroke="#0E0F14" strokeWidth={6} />
    <path d="M 140 -230 H 215 Q 265 -222 282 -160 H 140 Z" fill="#A8C8E8" />
    <rect x={-280} y={-260} width={360} height={80} fill="#E07A2A" />
    <text x={-100} y={-206} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#F6EFE3">DELIVERY</text>
    {[-200, 190].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-14} r={46} fill="#16161C" />
        <circle cx={wx} cy={-14} r={22} fill="#8A8C98" />
      </g>
    ))}
  </g>
);

/** A single-deck bus, side view, wheels on y, ~1100 long at s 1. `kids` puts faces in the windows. */
export const Bus: React.FC<{ x: number; y: number; s?: number; color?: string; kids?: number; t?: number; sis?: number; rot?: number }> = ({ x, y, s = 1, color = '#F0B82A', kids = 0, t = 0, sis = -1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={560} ry={20} fill="#000" opacity={0.3} />
    <rect x={-550} y={-330} width={1100} height={310} rx={30} fill={color} stroke="#0E0F14" strokeWidth={7} />
    <rect x={-550} y={-110} width={1100} height={26} fill="#0E0F14" opacity={0.2} />
    {Array.from({ length: 7 }, (_, i) => {
      const wx = -500 + i * 140;
      return (
        <g key={i}>
          <rect x={wx} y={-290} width={120} height={130} rx={10} fill="#A8C8E8" stroke="#0E0F14" strokeWidth={4} />
          {i < kids ? (
            <g transform={`translate(${wx + 60} ${-190 + Math.sin(t / 5 + i) * 3})`}>
              <circle r={36} fill={i === sis ? '#17131C' : '#26232F'} />
              <circle cx={-12} cy={-6} r={8} fill="#F6EFE3" /><circle cx={12} cy={-6} r={8} fill="#F6EFE3" />
              <ellipse cx={0} cy={16} rx={8} ry={10} fill="#F6EFE3" />
              {i === sis ? <g><circle cx={-38} cy={-20} r={14} fill="#17131C" /><circle cx={38} cy={-20} r={14} fill="#17131C" /><circle cx={-38} cy={-20} r={5} fill="#F28C6A" /></g> : null}
            </g>
          ) : null}
        </g>
      );
    })}
    <rect x={480} y={-290} width={60} height={200} rx={8} fill="#A8C8E8" stroke="#0E0F14" strokeWidth={4} />
    <text x={-60} y={-60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#0E0F14">SCHOOL BUS</text>
    {[-370, 360].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-14} r={58} fill="#16161C" />
        <circle cx={wx} cy={-14} r={26} fill="#8A8C98" />
      </g>
    ))}
  </g>
);

/** A fallen tree trunk across the road, seen from the side (a log with a root ball and a few branches). */
export const FallenTree: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={520} ry={18} fill="#000" opacity={0.3} />
    <path d="M -500 -60 Q 0 -100 500 -50 L 500 10 Q 0 -20 -500 10 Z" fill="#6A4A2A" stroke="#100E16" strokeWidth={6} />
    <ellipse cx={-500} cy={-25} rx={50} ry={60} fill="#8A6A3A" stroke="#100E16" strokeWidth={6} />
    {[-300, -60, 200, 380].map((bx, i) => (
      <g key={i}>
        <path d={`M ${bx} -80 l ${30 + i * 10} -110`} stroke="#5A3A20" strokeWidth={16} strokeLinecap="round" />
        <circle cx={bx + 40 + i * 10} cy={-210} r={70} fill="#3E7A3E" />
        <circle cx={bx + 90 + i * 10} cy={-170} r={55} fill="#4A8A46" />
      </g>
    ))}
  </g>
);

/** A round trampoline, three-quarter view, centre x, legs on y. */
export const Trampoline: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-200, -70, 70, 200].map((lx) => <path key={lx} d={`M ${lx} -110 L ${lx * 1.05} 0`} stroke="#2A2A34" strokeWidth={10} />)}
    <ellipse cx={0} cy={-110} rx={240} ry={56} fill="#2A6AC8" stroke="#100E16" strokeWidth={6} />
    <ellipse cx={0} cy={-112} rx={200} ry={42} fill="#16161C" />
  </g>
);

/** A barbell with plates, side on, centred. */
export const Barbell: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-330} y={-8} width={660} height={16} rx={8} fill="#B8BCC8" stroke="#100E16" strokeWidth={4} />
    {[-1, 1].map((d) => (
      <g key={d}>
        <rect x={d * 230 - 22} y={-90} width={44} height={180} rx={8} fill="#26232F" stroke="#100E16" strokeWidth={4} />
        <rect x={d * 270 - 16} y={-64} width={32} height={128} rx={6} fill="#C83A3A" stroke="#100E16" strokeWidth={4} />
      </g>
    ))}
  </g>
);

export const BenchSet: SetC = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#4A4A6A" />
    <rect y={780} width={1920} height={300} fill="#8A6A4A" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M ${i * 170} 780 V 1080`} stroke="#7A5A3A" strokeWidth={4} />)}
    <rect x={120} y={200} width={1680} height={40} fill="#3A3A5A" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={160 + i * 210} y={120} width={14} height={80} fill="#2A2A44" />)}
    <text x={960} y={180} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" opacity={0.5}>GYM</text>
    <Glow x={960} y={240} r={600} kind="warm" o={0.3 + Math.sin(t / 30) * 0.02} />
  </g>
);

export const Toothbrush: React.FC<{ x: number; y: number; s?: number; rot?: number; snap?: number }> = ({ x, y, s = 1, rot = 0, snap = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-160} y={-12} width={170} height={24} rx={12} fill="#3AB0C8" stroke="#100E16" strokeWidth={4} />
    <g transform={`translate(10 0) rotate(${snap * 40})`}>
      <rect x={0} y={-12} width={150} height={24} rx={12} fill="#3AB0C8" stroke="#100E16" strokeWidth={4} />
      <rect x={110} y={-40} width={40} height={30} fill="#F6EFE3" stroke="#100E16" strokeWidth={3} />
    </g>
  </g>
);

export const Spoon: React.FC<{ x: number; y: number; s?: number; bend?: number }> = ({ x, y, s = 1, bend = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M 0 0 Q ${bend * 60} -120 ${bend * 160} ${-220 + bend * 90}`} stroke="#C8CCD8" strokeWidth={22} strokeLinecap="round" fill="none" />
    <ellipse cx={bend * 170} cy={-250 + bend * 110} rx={40} ry={56} transform={`rotate(${bend * 70} ${bend * 170} ${-250 + bend * 110})`} fill="#D8DCE8" stroke="#100E16" strokeWidth={5} />
  </g>
);

/** A hand X-ray on a light box: bones white on blue-black; `crack` draws a fracture line, `thick` thickens the bones. */
export const XRay: React.FC<{ x: number; y: number; s?: number; crack?: number; thick?: number; t?: number; label?: string }> = ({ x, y, s = 1, crack = 0, thick = 0, t = 0, label }) => {
  const w = 18 + thick * 12;
  const fingers = [[-110, -80, -330], [-45, -40, -400], [20, -30, -420], [85, -40, -380], [150, 40, -230]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-320} y={-520} width={640} height={720} rx={18} fill="#0E1A2A" stroke="#6A7A8A" strokeWidth={12} />
      <Glow x={0} y={-160} r={380} kind="cool" o={0.35} />
      <g stroke="#E8F2FA" strokeLinecap="round" fill="none" opacity={0.92}>
        {fingers.map(([fx, base, tip], i) => (
          <g key={i}>
            <path d={`M ${fx * 0.4} 120 L ${fx * 0.8} ${base}`} strokeWidth={w + 4} />
            <path d={`M ${fx * 0.8} ${base - 14} L ${fx} ${(base + tip) / 2}`} strokeWidth={w} />
            <path d={`M ${fx} ${(base + tip) / 2 - 14} L ${fx * 1.05} ${tip}`} strokeWidth={w - 4} />
          </g>
        ))}
        <ellipse cx={0} cy={150} rx={120} ry={40} strokeWidth={w} />
      </g>
      {crack > 0 ? (
        <path d="M -60 -10 l 18 -14 l -10 -12 l 16 -16" stroke="#FF3A2A" strokeWidth={8} fill="none" strokeDasharray="120" strokeDashoffset={120 * (1 - crack)} />
      ) : null}
      <text x={-290} y={-480} fontFamily={FONT.ui} fontSize={26} fill="#8AA0B8">R · HAND · {label ?? (thick > 0 ? 'DAY 15' : 'DAY 11')}</text>
    </g>
  );
};

/** Cracks spreading from a point (a handprint in a door, the floor under your feet). */
export const Cracks: React.FC<{ x: number; y: number; s?: number; p: number; seed?: number; color?: string }> = ({ x, y, s = 1, p, seed = 1, color = '#100E16' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round">
    {Array.from({ length: 7 }, (_, i) => {
      const a = (i / 7) * Math.PI * 2 + rnd(seed, i);
      const L = (70 + rnd(seed + 1, i) * 90) * clamp(p);
      const mx = Math.cos(a) * L * 0.5 + (rnd(seed + 2, i) - 0.5) * 20;
      const my = Math.sin(a) * L * 0.5 + (rnd(seed + 3, i) - 0.5) * 20;
      return <path key={i} d={`M 0 0 L ${mx} ${my} L ${Math.cos(a) * L} ${Math.sin(a) * L}`} />;
    })}
  </g>
);

/** A dented handprint pressed into a surface. */
export const Handprint: React.FC<{ x: number; y: number; s?: number; o?: number }> = ({ x, y, s = 1, o = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <ellipse cx={0} cy={20} rx={50} ry={56} fill="#000" opacity={0.25} />
    {[[-48, -50, -20], [-18, -78, -5], [14, -82, 5], [44, -64, 18], [66, 10, 40]].map(([fx, fy, r], i) => (
      <rect key={i} x={fx - 11} y={fy - 34} width={22} height={60} rx={11} transform={`rotate(${r} ${fx} ${fy})`} fill="#000" opacity={0.25} />
    ))}
  </g>
);

// ---------------------------------------------------------------- cards
/** A chapter opener: kicker and title over a warm gradient with "x2" chips drifting up. */
export const sdCard = (o: { kicker: string; title: string; day?: number; tint?: string }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t, len }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    return (
      <g>
        <linearGradient id="sdcg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1C1A4A" />
          <stop offset="1" stopColor={o.tint ?? '#7A2A5A'} />
        </linearGradient>
        <rect width={1920} height={1080} fill="url(#sdcg)" />
        {Array.from({ length: 14 }, (_, i) => {
          const x = 80 + rnd(21, i) * 1760;
          const y = 1150 - ((t * (1.2 + rnd(22, i)) + rnd(23, i) * 1200) % 1300);
          return (
            <g key={i} transform={`translate(${x} ${y})`} opacity={0.18}>
              <circle r={34} fill={POWER} />
              <text y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#0B0816">x2</text>
            </g>
          );
        })}
        <g transform={`translate(960 410) scale(${pop(1)})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill={POWER}>{o.kicker}</text>
        </g>
        <g transform={`translate(960 545) scale(${pop(3) * kf(t, [[0, 1], [Math.max(len, 1), 1.04]])})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={o.title.length > 18 ? 100 : 124} fill="#F6EFE3" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">{o.title}</text>
        </g>
        {o.day !== undefined ? (
          <g transform={`translate(960 660) scale(${pop(7)})`}>
            <text textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill="#C8C2D8">{`DAY ${o.day} · ${liftLabel(o.day)}`}</text>
          </g>
        ) : null}
      </g>
    );
  };
  return Card;
};

/** The doubling ladder on the schematic: day by day, each bar twice the last, the lift beside it. */
export const ladderCard = (o: { days: number[]; step?: number; title?: string; hot?: number }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t }) => {
    const step = o.step ?? 14;
    const max = Math.log2(liftKg(o.days[o.days.length - 1]) / 50) + 1;
    return (
      <g>
        <Schematic t={t} id="ladder" />
        {o.title ? <text x={960} y={170} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} letterSpacing={10} fill={SCH.dim}>{o.title}</text> : null}
        {o.days.map((d, i) => {
          const p = clamp((t - 4 - i * step) / 8);
          const y = 260 + i * (640 / o.days.length);
          const w = 80 + (Math.log2(liftKg(d) / 50) + 1) / max * 900;
          const hot = o.hot === d;
          return (
            <g key={i} opacity={clamp((t - 4 - i * step) / 3)}>
              <text x={380} y={y + 34} textAnchor="end" fontFamily={FONT.ui} fontSize={40} fill={SCH.dim}>{`DAY ${d}`}</text>
              <rect x={420} y={y} width={w * easeOut(p)} height={48} rx={10} fill={hot ? POWER : SCH.live} opacity={hot ? 1 : 0.8} />
              <text x={440 + w * easeOut(p)} y={y + 38} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={hot ? POWER : '#F6EFE3'}>{liftLabel(d)}</text>
            </g>
          );
        })}
      </g>
    );
  };
  return Card;
};

/** The weight of a thing, drawn simply, on a scale against the number: a suitcase, a truck, the ship, the pyramid, a bus. */
export type Thing = 'suitcase' | 'truck' | 'ship' | 'pyramid' | 'bus' | 'car';
export const ThingIcon: React.FC<{ name: Thing; x: number; y: number; s?: number }> = ({ name, x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke="#F6EFE3" strokeWidth={8} strokeLinejoin="round" strokeLinecap="round">
    {name === 'suitcase' && <g><rect x={-90} y={-130} width={180} height={130} rx={16} /><path d="M -34 -130 v -30 h 68 v 30" /></g>}
    {name === 'truck' && <g><rect x={-220} y={-150} width={300} height={130} rx={8} /><path d="M 80 -110 h 80 l 60 50 v 40 h -140 Z" /><circle cx={-150} cy={-12} r={26} /><circle cx={140} cy={-12} r={26} /></g>}
    {name === 'ship' && <g><path d="M -330 -60 L 300 -60 L 240 0 L -280 0 Z" /><rect x={-200} y={-120} width={360} height={60} /><path d="M -120 -120 v -70 h 50 v 70 M 0 -120 v -70 h 50 v 70 M 120 -120 v -70 h 50 v 70" /></g>}
    {name === 'pyramid' && <g><path d="M -260 0 L 0 -230 L 260 0 Z" /><path d="M -170 -80 H 170 M -85 -155 H 85" opacity={0.5} /></g>}
    {name === 'bus' && <g><rect x={-220} y={-140} width={440} height={120} rx={20} /><path d="M -190 -120 h 360 v 50 h -360 Z" /><circle cx={-140} cy={-12} r={26} /><circle cx={140} cy={-12} r={26} /></g>}
    {name === 'car' && <g><path d="M -160 -20 v -50 q 10 -20 40 -24 l 50 -46 h 120 l 60 50 q 50 6 50 30 v 40 Z" /><circle cx={-90} cy={-12} r={24} /><circle cx={100} cy={-12} r={24} /></g>}
  </g>
);

/** "Day n: the weight of a thing" card: the icon draws on, the lift counts up beside its comparison. */
export const thingCard = (o: { day: number; thing: Thing; label: string; sub?: string; real?: boolean }): React.FC<ShotProps> => {
  const Card: React.FC<ShotProps> = ({ t }) => {
    const kg = liftKg(o.day);
    const tonnes = kg >= 1000;
    return (
      <g>
        <Schematic t={t} id="thing" />
        <SchLabel x={960} y={200} t={t - 2} text={`DAY ${o.day}`} size={56} color={POWER} />
        <g opacity={clamp((t - 4) / 6)} transform={`translate(0 ${(1 - easeOut(clamp((t - 4) / 10))) * 40})`}>
          <ThingIcon name={o.thing} x={960} y={560} s={1.25} />
        </g>
        <CountUp x={960} y={760} t={t - 10} to={tonnes ? Math.round(kg / 1000) : kg} dur={30} size={110} suffix={tonnes ? ' TONNES' : ' KG'} />
        <SchLabel x={960} y={850} t={t - 40} text={o.label} size={40} />
        {o.sub ? <SchLabel x={960} y={910} t={t - 48} text={o.sub} size={30} color={SCH.dim} /> : null}
        {o.real ? (
          <g opacity={clamp((t - 60) / 6)} transform={`translate(1600 960) scale(${backOut(clamp((t - 60) / 9))})`}>
            <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#0B0816" stroke={SCH.live} strokeWidth={3} />
            <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
          </g>
        ) : null}
      </g>
    );
  };
  return Card;
};

// ---------------------------------------------------------------- shot helpers
/** You (or anyone) lifting something overhead with one or two hands on a set, the thing drawn by `thing(hand, t)`. */
export const liftShot = (o: {
  Set: SetC; setT?: number; who?: Look; x: number; y: number; scale?: number; yaw?: number; faces?: [number, Expr][];
  lift: (t: number) => number; // 0 on the ground .. 1 overhead
  two?: boolean; thing: (hand: { x: number; y: number }, t: number) => React.ReactNode; behind?: boolean;
  cam: [number, number, number, number?, number?, number?]; others?: (t: number) => React.ReactNode; front?: (t: number) => React.ReactNode;
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const p = clamp(o.lift(t));
    const face = faceAt(t, o.faces ?? [[0, 'smug']]);
    const sc = o.scale ?? 1;
    const pose: Pose = {
      ...basePose, x: o.x, y: o.y, scale: sc, yaw: o.yaw ?? 0, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, 5)),
      armR: { a: lerp(30, 172, p), b: lerp(-60, 0, p) }, armL: o.two ? { a: lerp(30, 172, p), b: lerp(-60, 0, p) } : { a: 18, b: -20 },
      squash: p > 0.05 && p < 0.4 ? 0.05 : 0, look: -0.2,
    };
    const h = handAt(pose, 'R');
    const [cx, cy, z, cx1, cy1, z1] = o.cam;
    const L = Math.max(len, 1);
    return (
      <g transform={camT(kf(t, [[0, cx], [L, cx1 ?? cx]]), kf(t, [[0, cy], [L, cy1 ?? cy]]), kf(t, [[0, z], [L, z1 ?? z]]))}>
        <o.Set t={t + (o.setT ?? 100)} id="lift" />
        {o.others?.(t)}
        {o.behind ? o.thing(h, t) : null}
        <Hero look={o.who ?? YOU} pose={pose} />
        {!o.behind ? o.thing(h, t) : null}
        {o.front?.(t)}
      </g>
    );
  };
  return Shot;
};

export { Hero, basePose, camT, clamp, kf, lerp, rnd, backOut, easeOut, idleBlink, faceAt, FONT, Glow };

/** A big mitten hand, for inserts (the ink cast's hand: dark, with a thumb). `side` 1 = right hand reaching from the left. */
export const BigHand: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string; sleeve?: string; flip?: boolean }> = ({ x, y, s = 1, rot = 0, color = '#26232F', sleeve = '#F07A2A', flip = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${flip ? -s : s} ${s})`}>
    <rect x={-900} y={-70} width={820} height={140} rx={60} fill={sleeve} stroke="#100E16" strokeWidth={8} />
    <rect x={-160} y={-58} width={90} height={116} fill={color} />
    <ellipse cx={0} cy={0} rx={110} ry={92} fill={color} stroke="#100E16" strokeWidth={8} />
    <ellipse cx={-10} cy={-86} rx={34} ry={50} transform="rotate(-30 -10 -86)" fill={color} stroke="#100E16" strokeWidth={8} />
  </g>
);

/** A day caption popping in at the top left (cold open: MONDAY, TUESDAY...). */
export const DayTag: React.FC<{ t: number; text: string; sub?: string }> = ({ t, text, sub }) => {
  const p = backOut(clamp((t - 1) / 7));
  return (
    <g transform={`translate(80 80) scale(${p})`} opacity={clamp(t / 4)}>
      <rect x={0} y={0} width={70 + text.length * 34 + (sub ? 40 + sub.length * 24 : 0)} height={92} rx={46} fill="#0B0816" opacity={0.7} />
      <text x={36} y={64} fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#F6EFE3">{text}</text>
      {sub ? <text x={60 + text.length * 34} y={62} fontFamily={FONT.ui} fontSize={36} fill={POWER}>{sub}</text> : null}
    </g>
  );
};

/** The HUD driven by a list of [second, day] steps (the day changes mid-chapter). Hidden until `hideUntil` frames. */
export const daySteps = (steps: [number, number][], hideUntil = 20, fps = 30): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f, total }) => {
    const s = f / fps;
    const cur = [...steps].reverse().find(([a]) => s >= a);
    if (!cur) return null;
    const H = dayHud(cur[1], hideUntil);
    return <H f={f} total={total} />;
  };
  return Hud;
};
