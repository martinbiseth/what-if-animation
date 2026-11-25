import React from 'react';
import { ShotProps, kf, clamp, backOut, FONT, Glow, hipOn } from '../../../engine';
import words from './words.json';
import {
  YOU, EG, TownSet, ShopSet, SubSet, RoofSet, scene, faceCU, insert, cueAt, egCard, fact, PhoneUI, Stink, Can, DamDiagram, ReactorDiagram, DayChip, sit, DustField,
} from '../common';

// Chapter 4, things fall apart: day 7 the lights go out (the dam trips), the phone loses signal, the subway floods,
// the food rots, the petrol goes stale, and the reactors run on seven days of diesel. You count: day eight.

const NIGHT = TownSet('night', { dark: 0.3 });
const DAY = TownSet('day', { dust: 0.4 });
const k01 = (t: number, a: number, b: number) => clamp((t - a) / Math.max(1, b - a));

// ---------- S1: day seven, the lights go out ----------
export const S1 = egCard({ kicker: 'DAY 7', title: 'THE LIGHTS GO OUT', Bg: NIGHT });

// a power station: chimneys, lit windows, smoke; `off` 0..1 shuts it down
const Station: React.FC<{ t: number; off: number }> = ({ t, off }) => (
  <g>
    <rect x={-200} y={760} width={2400} height={500} fill="#1A2234" />
    {[620, 820].map((cx, i) => (
      <g key={cx}>
        <path d={`M ${cx - 70} 760 L ${cx - 40} 360 L ${cx + 40} 360 L ${cx + 70} 760 Z`} fill="#8A8E98" stroke="#14121C" strokeWidth={6} />
        <rect x={cx - 42} y={400} width={84} height={22} fill={EG.red} />
        {[0, 1, 2].map((j) => {
          const u = ((t / 50 + j / 3 + i * 0.2) % 1);
          return <circle key={j} cx={cx + u * 120} cy={340 - u * 260} r={40 + u * 70} fill="#C8CCD6" opacity={(1 - u) * 0.6 * (1 - off)} />;
        })}
      </g>
    ))}
    <rect x={960} y={520} width={560} height={240} fill="#5A6070" stroke="#14121C" strokeWidth={6} />
    {Array.from({ length: 8 }).map((_, i) => (
      <rect key={i} x={990 + (i % 4) * 130} y={550 + Math.floor(i / 4) * 100} width={90} height={60} fill={off > (i + 1) / 9 ? '#2A3040' : '#FFE08A'} />
    ))}
    {off < 0.9 ? <Glow x={1240} y={640} r={360} kind="warm" o={0.35 * (1 - off)} /> : null}
    <path d="M 1520 600 L 1900 520" stroke="#3A4054" strokeWidth={6} />
  </g>
);

// ---------- S2: most power stations would shut down within hours ----------
export const S2: React.FC<ShotProps> = (p) => {
  const at = cueAt(words, p.f, p.t, 'shut');
  const off = clamp((p.t - at) / 40);
  const I = insert({
    bgColor: '#0E1426', push: 0.06,
    draw: (t) => (
      <g>
        <Station t={t} off={off} />
        <g transform={`translate(960 210) scale(${backOut(clamp((t - at - 10) / 9))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill={EG.gold} stroke="#0B0816" strokeWidth={14} paintOrder="stroke">WITHIN HOURS</text>
        </g>
      </g>
    ),
  });
  return <I {...p} />;
};

// ---------- S3: nobody is left to balance the grid ----------
export const S3 = insert({
  bgColor: '#0E1426', push: 0.05,
  draw: (t) => {
    const tilt = Math.sin(t / 9) * (6 + t / 6);
    return (
      <g>
        <text x={960} y={190} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={8} fill="#F6EFE3">THE GRID</text>
        <path d="M 960 780 L 900 900 L 1020 900 Z" fill="#5A6070" stroke="#F6EFE3" strokeWidth={5} />
        <g transform={`rotate(${tilt} 960 780)`}>
          <rect x={460} y={760} width={1000} height={30} rx={10} fill="#8A8E98" stroke="#F6EFE3" strokeWidth={4} />
          <rect x={470} y={620} width={260} height={140} rx={14} fill="#2A6AA8" stroke="#F6EFE3" strokeWidth={4} />
          <text x={600} y={705} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#F6EFE3">MADE</text>
          <rect x={1190} y={620} width={260} height={140} rx={14} fill={EG.red} stroke="#F6EFE3" strokeWidth={4} />
          <text x={1320} y={705} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#F6EFE3">USED</text>
        </g>
        {/* the empty control chair */}
        <g transform="translate(1600 960)" opacity={clamp((t - 10) / 8)}>
          <rect x={-60} y={-110} width={120} height={20} rx={8} fill="#3A4054" />
          <rect x={-56} y={-230} width={112} height={120} rx={14} fill="#3A4054" />
          <path d="M 0 -90 V -20 M -50 -10 H 50" stroke="#3A4054" strokeWidth={10} />
          <text x={0} y={60} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} letterSpacing={3} fill="#8AA8C8">NOBODY</text>
        </g>
      </g>
    );
  },
});

// ---------- S4: your city's power comes from a dam, it keeps spinning for weeks ----------
export const S4 = insert({ bgColor: '#0E1A2C', push: 0.04, draw: (t) => <DamDiagram t={t} spin={1} /> });

// ---------- S5: until something, somewhere, trips ----------
export const S5: React.FC<ShotProps> = (p) => {
  const at = cueAt(words, p.f, p.t, 'trips');
  const trip = clamp((p.t - at) / 14);
  const I = insert({ bgColor: '#0E1A2C', push: 0.08, draw: (t) => <DamDiagram t={t} spin={1 - trip * 0.9} trip={trip} /> });
  return <I {...p} />;
};

// the city from the hotel roof; `k` 0..1 how dark it has gone, `moon` shows the moon
const Moon: React.FC<{ o: number }> = ({ o }) => (
  <g opacity={o}>
    <Glow x={1520} y={170} r={300} kind="cool" o={0.5} />
    <circle cx={1520} cy={170} r={64} fill="#F4EED8" />
    <circle cx={1500} cy={160} r={12} fill="#D8D0B8" />
  </g>
);
const roofYou = { look: YOU, pose: { x: 760, y: hipOn(900, 0.9), scale: 0.9, yaw: -0.85, headTilt: -4 }, faces: [[0, 'worried']] as [number, 'worried'][] };

// ---------- S6: on the hotel roof: one district goes dark, then the next ----------
export const S6: React.FC<ShotProps> = (p) => {
  const one = cueAt(words, p.f, p.t, 'One');
  const nx = cueAt(words, p.f, p.t, 'next');
  const k = 0.3 * k01(p.t, one, one + 8) + 0.3 * k01(p.t, nx, nx + 8);
  const S = scene({ Set: RoofSet({ blackout: k, night: 0.2 + k * 0.2 }), setT: 1200, cam: { from: [960, 560, 1.15], to: [980, 560, 1.2] }, cast: [roofYou] });
  return <S {...p} />;
};

// ---------- S7: then the whole skyline, until the only light left is the moon ----------
export const S7: React.FC<ShotProps> = (p) => {
  const k = 0.6 + 0.4 * k01(p.t, 4, 24);
  const moon = cueAt(words, p.f, p.t, 'moon');
  const S = scene({
    Set: RoofSet({ blackout: k, night: 0.4 + 0.25 * k01(p.t, 4, 30) }), setT: 1300, cam: { from: [960, 520, 1.0], to: [960, 500, 1.05] },
    cast: [{ ...roofYou, pose: { ...roofYou.pose, x: 820, y: hipOn(900, 0.75), scale: 0.75 } }],
    over: () => <Moon o={k01(p.t, moon - 10, moon + 4)} />,
  });
  return <S {...p} />;
};

// ---------- S8: a few hours later, your phone drops to no signal ----------
export const S8: React.FC<ShotProps> = (p) => {
  const at = cueAt(words, p.f, p.t, 'signal');
  const lost = clamp((p.t - at + 16) / 10);
  const I = insert({
    Bg: RoofSet({ blackout: 1, night: 0.6 }), push: 0.08,
    draw: (t) => (
      <PhoneUI x={960} y={560} s={1.25} rot={-3} t={t} id="p8" bg="#121626" screen={
        <g>
          {[0, 1, 2, 3].map((i) => <rect key={i} x={-110 + i * 22} y={-270 - i * 10} width={14} height={18 + i * 10} rx={3} fill="#F6EFE3" opacity={i < Math.round(4 * (1 - lost)) ? 1 : 0.2} />)}
          <text x={0} y={-40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#F6EFE3">03:52</text>
          <text x={0} y={60} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={lost > 0.5 ? EG.red : '#8AA8C8'}>{lost > 0.5 ? 'NO SIGNAL' : 'searching...'}</text>
          <circle cx={0} cy={170} r={50} fill="none" stroke="#4A5068" strokeWidth={6} />
          <path d="M -30 140 L 30 200 M 30 140 L -30 200" stroke={EG.red} strokeWidth={8} opacity={lost} />
        </g>
      } />
    ),
  });
  return <I {...p} />;
};

// ---------- S9: phone masts have backup batteries; most last a few hours ----------
export const S9 = insert({
  bgColor: '#0C1024', push: 0.05,
  draw: (t, len) => {
    const b = 1 - clamp(t / Math.max(1, len - 20));
    return (
      <g>
        <DustField t={t} n={30} />
        <g transform="translate(640 900)">
          <path d="M -120 0 L -20 -640 L 20 -640 L 120 0" fill="none" stroke="#8A8E98" strokeWidth={10} />
          {Array.from({ length: 7 }).map((_, i) => {
            const y = -i * 90;
            const w = 120 - (i * 100) / 7;
            return <path key={i} d={`M ${-w} ${y} L ${w - 12} ${y - 90} M ${w} ${y} L ${-w + 12} ${y - 90}`} stroke="#6A6E78" strokeWidth={5} />;
          })}
          {[-1, 1].map((sd) => <rect key={sd} x={sd * 40 - 15} y={-680} width={30} height={90} rx={6} fill="#F6EFE3" />)}
          {b > 0.05 ? [1, 2].map((i) => <path key={i} d={`M ${-60 - i * 40} ${-660 - i * 20} q ${-30} 50 0 100 M ${60 + i * 40} ${-660 - i * 20} q 30 50 0 100`} stroke="#CFE6FF" strokeWidth={7} fill="none" opacity={b * (0.5 + 0.5 * Math.sin(t / 4 + i))} />) : null}
        </g>
        <g transform="translate(1300 520)">
          <rect x={-200} y={-120} width={380} height={240} rx={26} fill="#14182C" stroke="#F6EFE3" strokeWidth={8} />
          <rect x={180} y={-40} width={30} height={80} rx={8} fill="#F6EFE3" />
          <rect x={-176} y={-96} width={332 * b} height={192} rx={16} fill={b < 0.25 ? EG.red : b < 0.5 ? EG.gold : '#5BC08A'} />
          <text x={0} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={4} fill="#F6EFE3">BACKUP BATTERY</text>
          <text x={0} y={260} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#C8C2D8">A FEW HOURS</text>
        </g>
      </g>
    );
  },
});

// ---------- S10: under the streets, the subway starts to flood ----------
export const S10: React.FC<ShotProps> = (p) => {
  const w = kf(p.t, [[0, 0.05], [p.len, 0.55]]);
  const S = scene({ Set: SubSet({ water: w, dark: 0.35 }), setT: 400, cam: { from: [960, 560, 1.05], to: [960, 600, 1.15] } });
  return <S {...p} />;
};

// ---------- S11: New York's subway pumps out 13 million gallons a day ----------
export const S11 = fact({
  Bg: SubSet({ water: 0.2, dark: 0.3 }), label: "NEW YORK'S SUBWAY PUMPS OUT", value: 13, suffix: ' MILLION', sub: 'GALLONS OF WATER, EVERY DAY', real: false,
});

// ---------- S12: without the pumps, parts could flood in about 36 hours. That's real ----------
export const S12 = fact({
  Bg: SubSet({ water: 0.6, dark: 0.3 }), label: 'WITHOUT PUMPS, PARTS FLOOD IN ABOUT', value: 36, suffix: ' HOURS', sub: 'its own engineers, in The World Without Us',
});

// ---------- S13: the fresh food in every supermarket rots within days ----------
export const S13 = scene({
  Set: ShopSet({ empty: 1, rot: 1, dark: 0.15 }), setT: 300, cam: { from: [700, 520, 1.1], to: [760, 520, 1.25] },
});

// ---------- S14: you smell the meat counter from the car park ----------
export const S14 = faceCU({
  look: YOU, Bg: DAY, faces: [[0, 'shock'], [14, 'dizzy']], yaw: 0.35, zoom: [2.9, 3.1], pose: { headTilt: 8 },
  over: (t) => <Stink t={t} k={clamp(t / 8)} x0={1150} x1={1900} y={700} />,
});

// ---------- S15: canned food lasts for years. If you can find a can opener ----------
export const S15: React.FC<ShotProps> = (p) => {
  const at = cueAt(words, p.f, p.t, 'opener');
  const I = insert({
    Bg: ShopSet({ empty: 1 }), push: 0.08,
    draw: (t) => (
      <g>
        <rect x={-100} y={760} width={2200} height={400} fill="#C8CCD6" />
        {[[700, 780, 'BEANS', '#C83A3A', -4], [900, 780, 'SOUP', '#3A7AC8', 2], [1100, 780, 'PEACHES', '#E8A83A', -2], [800, 600, 'TUNA', '#5BC08A', 3], [1000, 600, 'CORN', '#F2C14E', -3], [900, 420, 'BEANS', '#C83A3A', 1]].map(([x, y, l, c, r], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${backOut(clamp((t - i * 4) / 8))}) translate(${-(x as number)} ${-(y as number)})`}>
            <Can x={x as number} y={y as number} s={1.1} label={l as string} color={c as string} rot={r as number} />
          </g>
        ))}
        <text x={960} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={6} fill="#F6EFE3">LASTS FOR YEARS</text>
        <g transform={`translate(1480 360) scale(${backOut(clamp((t - at + 4) / 9))})`}>
          <circle r={130} fill="#14182C" stroke={EG.gold} strokeWidth={6} />
          <text y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill={EG.gold}>?</text>
          <text y={190} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3">CAN OPENER</text>
        </g>
      </g>
    ),
  });
  return <I {...p} />;
};

// a petrol pump for the fuel card
const Pump: React.FC<{ t: number }> = ({ t }) => (
  <g transform="translate(1560 820) scale(0.9)" opacity={clamp(t / 8)}>
    <rect x={-90} y={-360} width={180} height={360} rx={18} fill={EG.red} stroke="#14121C" strokeWidth={6} />
    <rect x={-60} y={-320} width={120} height={90} rx={8} fill="#14182C" />
    <text x={0} y={-262} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#5A5E68">----</text>
    <path d="M 90 -200 Q 160 -200 160 -120 L 160 -60" stroke="#14121C" strokeWidth={12} fill="none" />
    <rect x={-110} y={-10} width={220} height={20} fill="#3A4054" />
  </g>
);

// ---------- S16: petrol starts to go stale after about three to six months ----------
export const S16 = fact({
  Bg: DAY, label: 'PETROL GOES STALE AFTER', value: 6, format: (v) => (v < 3 ? `${Math.max(1, Math.round(v))}` : `3–${Math.round(v)}`), suffix: ' MONTHS',
  icon: (t) => <Pump t={t} />,
});

// ---------- S17: every car in the city is just a very heavy chair ----------
export const S17 = scene({
  Set: DAY, setT: 500, cam: { from: [900, 640, 1.7], to: [920, 640, 1.8] }, day: 'MONTH 4',
  cast: [{ look: YOU, pose: { ...sit(905, 850, -1, 0.9), headTilt: 14, armL: { a: -150, b: -150 } }, faces: [[0, 'tired']] }],
});

// an atom for the reactor card
const Atom: React.FC<{ t: number }> = ({ t }) => (
  <g transform="translate(960 560)" opacity={0.25}>
    {[0, 60, 120].map((a) => <ellipse key={a} rx={420} ry={140} fill="none" stroke={EG.gold} strokeWidth={6} transform={`rotate(${a + t * 0.5})`} />)}
    <circle r={50} fill={EG.gold} />
  </g>
);

// ---------- S18: there are more than 400 nuclear reactors on Earth ----------
export const S18 = fact({ label: 'NUCLEAR REACTORS ON EARTH', value: 400, prefix: 'OVER ', icon: (t) => <Atom t={t} />, sub: 'IAEA reactor database', real: false });

const Tag: React.FC<{ x: number; y: number; t: number; at: number; text: string; color?: string }> = ({ x, y, t, at, text, color = EG.gold }) => (
  <g transform={`translate(${x} ${y}) scale(${backOut(clamp((t - at) / 9))})`}>
    <rect x={-text.length * 15 - 30} y={-46} width={text.length * 30 + 60} height={76} rx={20} fill="#14182C" stroke={color} strokeWidth={5} />
    <text y={6} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={3} fill={color}>{text}</text>
  </g>
);

// ---------- S19: they shut themselves down, but the fuel stays hot for years ----------
export const S19: React.FC<ShotProps> = (p) => {
  const hot = cueAt(words, p.f, p.t, 'hot');
  const cool = cueAt(words, p.f, p.t, 'cooled');
  const I = insert({
    bgColor: '#0E1A2C', push: 0.05,
    draw: (t) => (
      <g>
        <ReactorDiagram t={t} heat={1} fuel={1} pump={1} />
        <Tag x={560} y={180} t={t} at={4} text="SHUT DOWN" color="#5BC08A" />
        <Tag x={560} y={470} t={t} at={hot - 4} text="STILL HOT" color={EG.red} />
        <Tag x={880} y={520} t={t} at={cool - 4} text="KEEP COOL" color="#7AC8E8" />
      </g>
    ),
  });
  return <I {...p} />;
};

// ---------- S20: when the power goes, backup diesel keeps the cooling running ----------
export const S20: React.FC<ShotProps> = (p) => {
  const ds = cueAt(words, p.f, p.t, 'diesel');
  const I = insert({
    bgColor: '#0E1A2C', push: 0.05,
    draw: (t) => (
      <g>
        <ReactorDiagram t={t} heat={1} fuel={1} pump={1} />
        <Tag x={1510} y={110} t={t} at={2} text="GRID: OFF" color={EG.red} />
        <Tag x={1510} y={900} t={t} at={ds - 4} text="DIESEL: ON" color={EG.gold} />
      </g>
    ),
  });
  return <I {...p} />;
};

// ---------- S21: in the United States, they must carry fuel for about seven days ----------
export const S21: React.FC<ShotProps> = (p) => {
  const sv = cueAt(words, p.f, p.t, 'seven');
  const I = insert({
    bgColor: '#0E1A2C', push: 0.12,
    draw: (t) => (
      <g>
        <ReactorDiagram t={t} heat={1} fuel={1} pump={1} days={7} />
        {sv < 9000 ? <Glow x={1510} y={340} r={360} kind="warm" o={0.5 * clamp((t - sv) / 6)} /> : null}
        <text x={1510} y={540} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#C8C2D8" opacity={clamp((t - 20) / 8)}>US RULE: ABOUT 7 DAYS ON SITE</text>
      </g>
    ),
  });
  return <I {...p} />;
};

// ---------- S22: after that, nobody is there to refill them ----------
export const S22 = insert({
  bgColor: '#0E1A2C', push: 0.05,
  draw: (t, len) => {
    const fuel = 1 - clamp(t / Math.max(1, len * 0.6));
    const pump = fuel > 0 ? 1 : 0;
    return (
      <g>
        <ReactorDiagram t={t} heat={1 + (1 - fuel) * 0.3} fuel={fuel} pump={pump} days={7} />
        <Tag x={1510} y={900} t={t} at={len * 0.45} text="NOBODY TO REFILL" color={EG.red} />
      </g>
    );
  },
});

// ---------- S23: you count on your fingers. Today is day eight ----------
export const S23: React.FC<ShotProps> = (p) => {
  const eight = cueAt(words, p.f, p.t, 'eight');
  const n = Math.min(8, 1 + Math.floor(Math.max(0, p.t - 4) / 6));
  const F = faceCU({
    look: YOU, Bg: NIGHT, faces: [[0, 'worried'], [eight + 4, 'shock']], yaw: 0.2, zoom: [2.6, 2.8], dim: 0.3,
    pose: { armR: { a: -60, b: -100 } },
    over: (t) => (
      <g>
        {Array.from({ length: n }).map((_, i) => (
          <text key={i} x={1320 + (i % 4) * 110} y={360 + Math.floor(i / 4) * 140} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96}
            fill={i === 6 ? EG.red : '#F6EFE3'} stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 4 - i * 6) / 4)}>{i + 1}</text>
        ))}
        {t >= eight ? <DayChip t={t - eight} day={8} /> : <DayChip t={t} day={7} />}
      </g>
    ),
  });
  return <F {...p} />;
};
