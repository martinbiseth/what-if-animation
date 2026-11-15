import React from 'react';
import { Glow, Cone, Dust, Stars, Moon, LEG_LEN, rnd, clamp, lerp, FONT, Schematic, SCH } from '../../engine';

// The sets of "What if you opened a McDonald's in ancient Rome?" (a generic burger counter: no real brand anywhere).
// A Roman street under the Palatine (insulae with wooden balconies, shop arches, basalt paving, the Circus Maximus
// arcade far off), Tullia's food counter from the customer's side (the marble counter with clay pots sunk in it, the
// grill, amphorae, a painted menu), the stands of the Circus Maximus, and a map of Rome's fourteen districts for the
// fire. Every outdoor set takes `mode` (day, dusk, night) and `fire` (0..1: the orange sky of 18 July AD 64).

export const P0 = '#140E10';
export const ROME = { feet: 840, horizon: 600 };
export const romeHip = (scale = 1) => ROME.feet - LEG_LEN * scale;
type Mode = 'day' | 'dusk' | 'night';

// ---------------------------------------------------------------- props
/** A burger from the side: x, y the bottom of the bun; s its scale; bite eats a bite out of the right side (0..1). */
export const Burger: React.FC<{ x: number; y: number; s?: number; bite?: number; rot?: number; steam?: number; t?: number }> = ({ x, y, s = 1, bite = 0, rot = 0, steam = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <defs>
      <clipPath id={`bite${Math.round(x)}${Math.round(y)}`}>
        <path d={`M -80 -130 L 80 -130 L 80 10 L -80 10 Z ${bite > 0 ? `M ${84 - bite * 40} -60 m -${22 + bite * 18} 0 a ${22 + bite * 18} ${30 + bite * 14} 0 1 0 ${2 * (22 + bite * 18)} 0 a ${22 + bite * 18} ${30 + bite * 14} 0 1 0 -${2 * (22 + bite * 18)} 0` : ''}`} clipRule="evenodd" fillRule="evenodd" />
      </clipPath>
    </defs>
    <ellipse cx={0} cy={4} rx={70} ry={9} fill="#000" opacity={0.22} />
    <g clipPath={`url(#bite${Math.round(x)}${Math.round(y)})`}>
      <path d="M -62 -2 Q -66 -26 -58 -26 L 58 -26 Q 66 -26 62 -2 Q 0 8 -62 -2 Z" fill="#D9963E" stroke={P0} strokeWidth={4} />
      <path d="M -66 -26 Q -60 -48 -40 -46 L 40 -46 Q 60 -48 66 -26 Z" fill="#6A3420" stroke={P0} strokeWidth={4} />
      <path d="M -70 -44 L 70 -44 L 62 -54 L 48 -46 L 30 -56 L 12 -46 L -6 -58 L -24 -46 L -42 -56 L -58 -46 Z" fill="#F2C440" stroke={P0} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M -72 -54 Q -60 -66 -46 -58 Q -32 -68 -18 -58 Q -4 -68 10 -58 Q 24 -68 38 -58 Q 52 -68 72 -56 L 66 -50 L -66 -50 Z" fill="#6DB54A" stroke={P0} strokeWidth={3.5} strokeLinejoin="round" />
      <path d="M -64 -58 Q -64 -118 0 -120 Q 64 -118 64 -58 Z" fill="#E0A04A" stroke={P0} strokeWidth={4} />
      <path d="M 10 -116 Q 52 -110 60 -64 L 40 -62 Q 40 -100 10 -116 Z" fill="#C07F30" opacity={0.6} />
      {[[-30, -96], [-8, -106], [16, -98], [36, -84], [-44, -78], [0, -84], [24, -76]].map(([sx, sy], k) => (
        <ellipse key={k} cx={sx} cy={sy} rx={4} ry={2.4} fill="#FFF3D6" transform={`rotate(${k * 37} ${sx} ${sy})`} />
      ))}
      <path d="M -40 -106 Q -20 -116 0 -114" stroke="#FFF3D6" strokeWidth={5} strokeLinecap="round" fill="none" opacity={0.55} />
    </g>
    {steam > 0
      ? [-20, 6, 30].map((sx, k) => {
          const p = ((t * 0.7 + k * 23) % 60) / 60;
          return <path key={k} d={`M ${sx} ${-130 - p * 60} q 10 -14 0 -28 q -10 -14 0 -28`} stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" opacity={steam * 0.5 * Math.sin(p * Math.PI)} />;
        })
      : null}
  </g>
);

/** A takeaway paper bag (brown, folded top), from the present: x, y the bottom centre. */
export const PaperBag: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={66} ry={8} fill="#000" opacity={0.22} />
    <path d="M -56 0 L -50 -150 L 50 -150 L 56 0 Z" fill="#C89A64" stroke={P0} strokeWidth={4} strokeLinejoin="round" />
    <path d="M 20 -150 L 50 -150 L 56 0 L 26 0 Z" fill="#A87C4C" opacity={0.6} />
    {open > 0 ? (
      <path d={`M -50 -150 L ${-56 - open * 20} ${-176 - open * 10} M 50 -150 L ${56 + open * 20} ${-176 - open * 10}`} stroke={P0} strokeWidth={4} />
    ) : (
      <path d="M -52 -150 L 52 -150 L 52 -172 L -52 -172 Z" fill="#B88A54" stroke={P0} strokeWidth={4} />
    )}
    <circle cx={0} cy={-80} r={20} fill="none" stroke="#7A4E2A" strokeWidth={5} />
    <path d="M -10 -80 L 10 -80" stroke="#7A4E2A" strokeWidth={5} strokeLinecap="round" />
  </g>
);

/** A coin face-on: silver (a denarius) or bronze (an as), with a head in profile. */
export const Coin: React.FC<{ x: number; y: number; r?: number; metal?: 'silver' | 'bronze'; spin?: number }> = ({ x, y, r = 24, metal = 'bronze', spin = 0 }) => {
  const c = metal === 'silver' ? ['#D8D6D0', '#A8A6A0'] : ['#C8803A', '#9A5A26'];
  const sx = Math.max(0.12, Math.abs(Math.cos(spin)));
  return (
    <g transform={`translate(${x} ${y}) scale(${sx} 1)`}>
      <circle r={r} fill={c[0]} stroke={P0} strokeWidth={3} />
      <circle r={r * 0.8} fill="none" stroke={c[1]} strokeWidth={2} strokeDasharray="3 3" />
      <path d={`M ${-r * 0.2} ${r * 0.45} Q ${-r * 0.45} ${0} ${-r * 0.1} ${-r * 0.42} Q ${r * 0.32} ${-r * 0.4} ${r * 0.3} ${0} L ${r * 0.42} ${r * 0.1} L ${r * 0.24} ${r * 0.2} Q ${r * 0.2} ${r * 0.45} ${-r * 0.2} ${r * 0.45} Z`} fill={c[1]} />
    </g>
  );
};

/** A clay order token with a number painted on it. */
export const Token: React.FC<{ x: number; y: number; n: number | string; s?: number; rot?: number }> = ({ x, y, n, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={36} ry={30} fill="#7A3A22" stroke={P0} strokeWidth={4} />
    <ellipse cx={0} cy={0} rx={36} ry={30} fill="#C8643A" stroke={P0} strokeWidth={4} />
    <text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={38} fill="#FFF0D6">
      {n}
    </text>
  </g>
);

/** A wax tablet: a wooden frame round dark wax with scratched lines; `sign` scratches a signature on (0..1). */
export const WaxTablet: React.FC<{ x: number; y: number; s?: number; rot?: number; lines?: number; sign?: number; seal?: boolean }> = ({ x, y, s = 1, rot = 0, lines = 7, sign = 0, seal = true }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-84} width={240} height={168} rx={10} fill="#8A5A32" stroke={P0} strokeWidth={5} />
    <rect x={-100} y={-66} width={200} height={132} rx={4} fill="#2E2A22" />
    {Array.from({ length: lines }).map((_, k) => (
      <path key={k} d={`M -84 ${-48 + k * 15} L ${40 + rnd(3, k) * 40} ${-48 + k * 15}`} stroke="#B8A880" strokeWidth={3} strokeLinecap="round" strokeDasharray="10 4 18 5 6 4" opacity={0.8} />
    ))}
    {sign > 0 ? (
      <path d="M -70 52 q 12 -22 20 0 q 8 18 18 -6 q 8 -16 16 2 q 10 16 22 -8 q 10 -10 30 -2" stroke="#F2E6C8" strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="220" strokeDashoffset={220 * (1 - sign)} />
    ) : null}
    {seal ? <circle cx={78} cy={44} r={14} fill="#8A2A3A" stroke={P0} strokeWidth={3} /> : null}
  </g>
);

/** A little coral hair tie (Ellie's). */
export const HairTie: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={30} ry={18} fill="none" stroke={P0} strokeWidth={14} />
    <ellipse cx={0} cy={0} rx={30} ry={18} fill="none" stroke="#F28C6A" strokeWidth={9} />
    <circle cx={26} cy={-8} r={11} fill="#F28C6A" stroke={P0} strokeWidth={3} />
  </g>
);

/** A round honey cake with a glossy top. */
export const HoneyCake: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={40} ry={16} fill="#B8742E" stroke={P0} strokeWidth={4} />
    <path d="M -40 0 L -40 -14 Q 0 -34 40 -14 L 40 0" fill="#D8963E" stroke={P0} strokeWidth={4} />
    <ellipse cx={0} cy={-16} rx={36} ry={12} fill="#F2B848" />
    <path d="M -18 -20 Q 0 -26 18 -20" stroke="#FFF0C8" strokeWidth={4} fill="none" strokeLinecap="round" />
  </g>
);

/** A clay amphora standing (or leaning on a wall). */
export const Amphora: React.FC<{ x: number; y: number; s?: number; c?: string; rot?: number }> = ({ x, y, s = 1, c = '#B8643A', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -10 -150 L 10 -150 L 12 -126 Q 40 -116 40 -70 Q 40 -24 6 0 L -6 0 Q -40 -24 -40 -70 Q -40 -116 -12 -126 Z" fill={c} stroke={P0} strokeWidth={4} strokeLinejoin="round" />
    <path d="M -12 -132 Q -32 -132 -28 -110 M 12 -132 Q 32 -132 28 -110" stroke={P0} strokeWidth={6} fill="none" />
    <path d="M 14 -116 Q 36 -100 34 -66 Q 32 -36 10 -10" stroke="#000" strokeOpacity={0.18} strokeWidth={12} fill="none" />
  </g>
);

/** A cone of turnip fries (pale, sad). */
export const TurnipFries: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-22, -10, 2, 14, 24].map((fx, k) => (
      <rect key={k} x={fx - 5} y={-96 + (k % 2) * 10} width={10} height={70} rx={3} fill="#E9E2C8" stroke={P0} strokeWidth={3} transform={`rotate(${(k - 2) * 6} ${fx} -30)`} />
    ))}
    <path d="M -36 -40 L 36 -40 L 22 30 L -22 30 Z" fill="#C8A878" stroke={P0} strokeWidth={4} />
  </g>
);

/** Smoke from the grill: soft puffs rising and drifting; `o` its strength. */
export const Smoke: React.FC<{ x: number; y: number; t: number; o?: number; h?: number; dark?: boolean }> = ({ x, y, t, o = 1, h = 300, dark = false }) => (
  <g opacity={o}>
    {Array.from({ length: 7 }).map((_, k) => {
      const p = ((t * 0.5 + k * 13) % 90) / 90;
      return <circle key={k} cx={x + Math.sin(p * 4 + k) * 24 + p * 50} cy={y - p * h} r={20 + p * 60} fill={dark ? '#3A3036' : '#D8D0C8'} opacity={0.35 * Math.sin(p * Math.PI)} />;
    })}
  </g>
);

/** The grill: an iron plate on a brick hearth, glowing charcoal underneath, patties sizzling (n of them). */
export const Grill: React.FC<{ x: number; y: number; s?: number; t: number; n?: number; heat?: number; flip?: number }> = ({ x, y, s = 1, t, n = 4, heat = 1, flip = -1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-160} y={0} width={320} height={120} fill="#8A4A36" stroke={P0} strokeWidth={5} />
    {[0, 1, 2].map((r) => Array.from({ length: 6 }).map((_, k) => <rect key={`${r}${k}`} x={-160 + k * 54 + (r % 2) * 27} y={r * 40} width={54} height={40} fill="none" stroke="#5A2E22" strokeWidth={3} />))}
    <rect x={-120} y={30} width={240} height={60} fill="#1A0E0C" stroke={P0} strokeWidth={4} />
    {Array.from({ length: 9 }).map((_, k) => (
      <ellipse key={k} cx={-104 + k * 26} cy={78} rx={14} ry={8} fill={heat > 0 ? (rnd(k, Math.floor(t / 6)) > 0.5 ? '#FF7A2A' : '#C83A1A') : '#2A2220'} />
    ))}
    {heat > 0 ? <Glow x={0} y={60} r={150} kind="warm" o={0.6 * heat} /> : null}
    <rect x={-170} y={-14} width={340} height={16} rx={4} fill="#2A2628" stroke={P0} strokeWidth={4} />
    {Array.from({ length: n }).map((_, k) => {
      const px = -120 + k * (240 / Math.max(1, n - 1 || 1));
      const lift = k === flip ? Math.sin(clamp((t % 30) / 14) * Math.PI) * 50 : 0;
      return (
        <g key={k} transform={`translate(${n === 1 ? 0 : px} ${-20 - lift})`}>
          <ellipse cx={0} cy={0} rx={34} ry={10} fill="#5A2E1E" stroke={P0} strokeWidth={3} />
          <path d="M -24 -2 L 24 -2" stroke="#3A1A10" strokeWidth={3} />
        </g>
      );
    })}
    {heat > 0
      ? Array.from({ length: 5 }).map((_, k) => {
          const p = ((t * 1.3 + k * 11) % 30) / 30;
          return <circle key={`sz${k}`} cx={-110 + k * 55 + Math.sin(t / 3 + k) * 6} cy={-24 - p * 40} r={3} fill="#FFE8B8" opacity={(1 - p) * heat} />;
        })
      : null}
  </g>
);

/** A hanging bronze oil lamp with a flame (lit 0..1). */
export const OilLamp: React.FC<{ x: number; y: number; t: number; s?: number; lit?: number; chain?: number }> = ({ x, y, t, s = 1, lit = 1, chain = 120 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M 0 ${-chain} L 0 -10`} stroke="#5A4630" strokeWidth={3} strokeDasharray="6 3" />
    <path d="M -34 0 Q -30 -14 0 -14 Q 30 -14 40 0 L 56 -4 L 52 4 Q 30 14 0 12 Q -30 12 -34 0 Z" fill="#B88A3A" stroke={P0} strokeWidth={4} />
    {lit > 0 ? (
      <g opacity={lit}>
        <path d={`M 54 -4 Q ${48 + Math.sin(t / 3) * 3} -24 54 -34 Q ${62 + Math.sin(t / 4) * 3} -20 58 -4 Z`} fill="#FFC85A" />
        <Glow x={55} y={-16} r={120} kind="warm" o={0.8} />
      </g>
    ) : null}
  </g>
);

/** A torch on a wall bracket or carried (flame flickers). */
export const Torch: React.FC<{ x: number; y: number; t: number; s?: number; rot?: number }> = ({ x, y, t, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-7} y={0} width={14} height={110} fill="#5A3A22" stroke={P0} strokeWidth={3} />
    <path d="M -14 0 L 14 0 L 10 -16 L -10 -16 Z" fill="#3A2A20" stroke={P0} strokeWidth={3} />
    <path d={`M -14 -16 Q ${-18 + Math.sin(t / 2) * 4} -50 ${Math.sin(t / 3) * 6} -84 Q ${18 + Math.sin(t / 2.5) * 4} -50 14 -16 Z`} fill="#FF8A2A" />
    <path d={`M -7 -16 Q ${-8 + Math.sin(t / 2) * 2} -40 ${Math.sin(t / 3) * 3} -60 Q ${8 + Math.sin(t / 2.5) * 2} -40 7 -16 Z`} fill="#FFE08A" />
    <Glow x={0} y={-40} r={180} kind="warm" o={0.8} />
  </g>
);

/** A basket of wrapped burgers (Felix sells them in the stands). */
export const BurgerBasket: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-40, 0, 40, -20, 20].map((bx, k) => (
      <g key={k} transform={`translate(${bx} ${k < 3 ? -40 : -64})`}>
        <path d="M -24 0 Q -26 -30 0 -32 Q 26 -30 24 0 Z" fill="#E0A04A" stroke={P0} strokeWidth={3} />
        <rect x={-26} y={-6} width={52} height={14} fill="#E9DCC0" stroke={P0} strokeWidth={3} />
      </g>
    ))}
    <path d="M -76 -40 L 76 -40 L 60 30 L -60 30 Z" fill="#B8884A" stroke={P0} strokeWidth={4} strokeLinejoin="round" />
    {[-50, -20, 10, 40].map((lx, k) => <path key={k} d={`M ${lx} -38 L ${lx + 8} 28`} stroke="#8A5E2E" strokeWidth={3} />)}
    <path d="M -60 -40 Q 0 -150 60 -40" stroke="#8A5E2E" strokeWidth={8} fill="none" />
  </g>
);

/** The shop sign: a painted board with BURGUS MAXIMUS and a burger. */
export const ShopSign: React.FC<{ x: number; y: number; s?: number; paint?: number }> = ({ x, y, s = 1, paint = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-380} y={-70} width={760} height={140} rx={10} fill="#2E5A4A" stroke={P0} strokeWidth={6} />
    <rect x={-366} y={-56} width={732} height={112} rx={6} fill="none" stroke="#E9C46A" strokeWidth={4} />
    <g clipPath="url(#signPaint)">
      <defs>
        <clipPath id="signPaint">
          <rect x={-380} y={-80} width={760 * paint} height={160} />
        </clipPath>
      </defs>
      <text x={56} y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={62} letterSpacing={2} fill="#FFF0D6" stroke={P0} strokeWidth={6} paintOrder="stroke">
        BURGUS MAXIMUS
      </text>
      <Burger x={-300} y={36} s={0.5} />
    </g>
  </g>
);

/** The painted menu board: three pictures (burger, fries, cup) with numerals I, II, III. */
export const MenuBoard: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-90} width={400} height={180} rx={8} fill="#EDE2C8" stroke={P0} strokeWidth={5} />
    {[-130, 0, 130].map((mx, k) => (
      <g key={k}>
        <rect x={mx - 56} y={-74} width={112} height={110} rx={6} fill="#F8F0DC" stroke="#8A5A32" strokeWidth={3} />
        {k === 0 ? <Burger x={mx} y={26} s={0.62} /> : k === 1 ? <TurnipFries x={mx} y={8} s={0.62} /> : (
          <g transform={`translate(${mx} 22)`}>
            <path d="M -24 -60 L 24 -60 L 18 0 L -18 0 Z" fill="#8A3A4A" stroke={P0} strokeWidth={4} />
            <path d="M -20 -48 L 20 -48" stroke="#F2B8C0" strokeWidth={4} />
          </g>
        )}
        <text x={mx} y={70} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={32} fill="#8A2A2A">
          {['I', 'II', 'III'][k]}
        </text>
      </g>
    ))}
  </g>
);

// ---------------------------------------------------------------- sky and far city
const skyStops = (mode: Mode, fire: number): [string, string, string] => {
  if (mode === 'night') return fire > 0 ? ['#140A1E', '#5A1E22', '#E2622A'] : ['#0A0A22', '#1E2148', '#3A3A62'];
  if (mode === 'dusk') return ['#2E2458', '#C8607A', '#F6B070'];
  return ['#4E8ECC', '#9CC8E6', '#F2E2C4'];
};

export const RomeSky: React.FC<{ id: string; t: number; mode?: Mode; fire?: number; horizon?: number }> = ({ id, t, mode = 'day', fire = 0, horizon = ROME.horizon }) => {
  const [a, b, c] = skyStops(mode, fire);
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="-400" x2="0" y2={horizon + 60} gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={a} />
          <stop offset="65%" stopColor={b} />
          <stop offset="100%" stopColor={c} />
        </linearGradient>
      </defs>
      <rect x={-500} y={-500} width={2920} height={horizon + 600} fill={`url(#${id}sky)`} />
      {mode === 'night' ? <Stars seed={7} x0={-400} y0={-400} w={2700} h={horizon + 200} t={t} n={fire > 0 ? 40 : 140} o={fire > 0 ? 0.4 : 0.8} /> : null}
      {mode === 'night' && fire === 0 ? <Moon x={1560} y={140} r={36} bloom={0.6} /> : null}
      {mode === 'day'
        ? [[260, 120, 150], [1200, 70, 190], [1700, 190, 120]].map(([cx, cy, rx], i) => (
            <g key={i} transform={`translate(${(t * 0.25 * (i % 2 ? 1 : -1)) % 90} 0)`} opacity={0.9}>
              <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.26} fill="#FFFFFF" />
              <ellipse cx={cx + rx * 0.35} cy={cy - rx * 0.12} rx={rx * 0.48} ry={rx * 0.28} fill="#FFFFFF" />
            </g>
          ))
        : null}
      {mode === 'dusk' ? <circle cx={1450} cy={horizon - 40} r={90} fill="#FFD08A" opacity={0.9} /> : null}
      {fire > 0 ? (
        <g opacity={fire}>
          <Glow x={1300} y={horizon} r={900} kind="red" o={0.9} />
          <Glow x={1300} y={horizon - 40} r={500} kind="warm" o={0.9} />
          {Array.from({ length: 6 }).map((_, k) => {
            const p = ((t * 0.35 + k * 17) % 100) / 100;
            return <circle key={k} cx={1150 + k * 60 + p * 120} cy={horizon - p * 520} r={60 + p * 140} fill="#2A1A1E" opacity={0.5 * Math.sin(p * Math.PI)} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

/** The Palatine hill with temples and cypresses, and (optionally) the long two-storey arcade of the Circus Maximus. */
export const FarRome: React.FC<{ mode?: Mode; circus?: boolean; fire?: number; y?: number }> = ({ mode = 'day', circus = true, fire = 0, y = ROME.horizon }) => {
  const hill = mode === 'night' ? '#1E1A2E' : mode === 'dusk' ? '#5A3E5E' : '#8AA07A';
  const stone = mode === 'night' ? '#2E2A3E' : mode === 'dusk' ? '#B8867A' : '#E2CFAE';
  const shade = mode === 'night' ? '#16121E' : mode === 'dusk' ? '#6A4656' : '#B89E7A';
  return (
    <g>
      <path d={`M -500 ${y + 40} Q 0 ${y - 160} 500 ${y - 150} Q 900 ${y - 140} 1100 ${y - 60} Q 1500 ${y - 120} 2420 ${y + 20} L 2420 ${y + 200} L -500 ${y + 200} Z`} fill={hill} />
      {/* temples on the hill */}
      {[[180, y - 150, 1], [700, y - 150, 0.8]].map(([tx, ty, ts], i) => (
        <g key={i} transform={`translate(${tx} ${ty}) scale(${ts})`}>
          <path d="M -120 -110 L 0 -160 L 120 -110 Z" fill={stone} stroke={P0} strokeWidth={4} />
          <rect x={-120} y={-110} width={240} height={16} fill={stone} stroke={P0} strokeWidth={4} />
          {Array.from({ length: 6 }).map((_, k) => <rect key={k} x={-108 + k * 42} y={-94} width={16} height={86} fill={stone} stroke={P0} strokeWidth={3} />)}
          <rect x={-130} y={-8} width={260} height={18} fill={shade} stroke={P0} strokeWidth={4} />
        </g>
      ))}
      {[40, 380, 520, 900, 1020].map((cx, i) => (
        <path key={i} d={`M ${cx} ${y - 110 + (i % 2) * 30} q -18 -40 0 -120 q 18 80 0 120 Z`} fill={mode === 'night' ? '#121822' : '#3E5A3A'} stroke={P0} strokeWidth={3} />
      ))}
      {circus ? (
        <g>
          <rect x={-500} y={y - 60} width={2920} height={140} fill={stone} stroke={P0} strokeWidth={4} />
          {Array.from({ length: 34 }).map((_, k) => (
            <g key={k}>
              <path d={`M ${-480 + k * 86} ${y + 70} L ${-480 + k * 86} ${y + 14} Q ${-450 + k * 86} ${y - 16} ${-420 + k * 86} ${y + 14} L ${-420 + k * 86} ${y + 70} Z`} fill={fire > 0 ? '#C8502A' : shade} />
              <path d={`M ${-474 + k * 86} ${y - 4} L ${-474 + k * 86} ${y - 34} Q ${-450 + k * 86} ${y - 54} ${-426 + k * 86} ${y - 34} L ${-426 + k * 86} ${y - 4} Z`} fill={shade} />
            </g>
          ))}
          <rect x={-500} y={y - 70} width={2920} height={12} fill={shade} />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------- the street
const INSULAE = [
  { x: -460, w: 420, h: 560, wall: '#D8935A', shop: '#3A2620' },
  { x: -40, w: 380, h: 640, wall: '#E8C890', shop: '#3A2A22' },
  { x: 340, w: 520, h: 520, wall: '#C8664A', shop: '#2E1E1A' },
  { x: 1060, w: 400, h: 600, wall: '#E2B87A', shop: '#3A2620' },
  { x: 1460, w: 420, h: 540, wall: '#D88A6A', shop: '#30201C' },
  { x: 1880, w: 460, h: 620, wall: '#E8D2A8', shop: '#3A2A22' },
];

const darken = (mode: Mode) => (mode === 'night' ? 0.62 : mode === 'dusk' ? 0.25 : 0);

/**
 * A Roman street: apartment blocks with red tiled eaves, small shuttered windows, wooden balconies and shop arches with
 * striped awnings, a raised pavement (feet at ROME.feet) and basalt paving. `shop` puts Burgus Maximus in the middle
 * (x 860 to 1060: its counter faces the street, its sign above), `smoke` its grill smoke, `fire` the night of the fire.
 */
export const RomeStreet: React.FC<{ t: number; id?: string; mode?: Mode; shop?: boolean; sign?: number; smoke?: number; fire?: number; circus?: boolean; open?: boolean }> = ({
  t, id = 'rst', mode = 'day', shop = true, sign = 1, smoke = 1, fire = 0, circus = true, open = true,
}) => {
  const dk = darken(mode);
  const F = ROME.feet;
  return (
    <g>
      <RomeSky id={id} t={t} mode={mode} fire={fire} />
      <FarRome mode={mode} circus={circus} fire={fire} />
      {INSULAE.map((h, i) => {
        const top = F - h.h;
        return (
          <g key={i}>
            <rect x={h.x} y={top} width={h.w} height={h.h} fill={h.wall} stroke={P0} strokeWidth={5} />
            <rect x={h.x + h.w * 0.62} y={top} width={h.w * 0.38} height={h.h} fill="#000" opacity={0.08} />
            {/* eaves: a red tiled roof line */}
            <path d={`M ${h.x - 24} ${top} L ${h.x + h.w + 24} ${top} L ${h.x + h.w + 10} ${top - 30} L ${h.x - 10} ${top - 30} Z`} fill="#A8442E" stroke={P0} strokeWidth={5} />
            {Array.from({ length: Math.floor(h.w / 30) }).map((_, k) => (
              <path key={k} d={`M ${h.x - 10 + k * 30} ${top} q 15 10 30 0`} stroke="#7A2E20" strokeWidth={4} fill="none" />
            ))}
            {/* upper floors: shuttered windows */}
            {Array.from({ length: Math.floor((h.h - 230) / 110) }).map((_, r) =>
              Array.from({ length: Math.floor(h.w / 120) }).map((__, c) => {
                const wx = h.x + 34 + c * 120;
                const wy = top + 40 + r * 110;
                const lit = mode === 'night' && rnd(i + 3, r * 5 + c) > 0.55;
                return (
                  <g key={`${r}${c}`}>
                    <rect x={wx} y={wy} width={52} height={64} fill={lit ? '#FFB860' : '#2A1E1E'} stroke={P0} strokeWidth={4} />
                    <rect x={wx - 22} y={wy} width={20} height={64} fill="#5A7A5A" stroke={P0} strokeWidth={3} />
                    {rnd(i, r * 7 + c) > 0.5 ? <rect x={wx + 54} y={wy} width={20} height={64} fill="#5A7A5A" stroke={P0} strokeWidth={3} /> : null}
                    {lit ? <Glow x={wx + 26} y={wy + 32} r={80} o={0.5} /> : null}
                  </g>
                );
              })
            )}
            {/* a wooden balcony on the first floor */}
            {i % 2 === 0 ? (
              <g>
                <rect x={h.x + 30} y={F - 250} width={h.w - 60} height={14} fill="#6A4026" stroke={P0} strokeWidth={4} />
                {Array.from({ length: Math.floor((h.w - 60) / 26) }).map((_, k) => (
                  <rect key={k} x={h.x + 36 + k * 26} y={F - 300} width={6} height={50} fill="#6A4026" />
                ))}
                <rect x={h.x + 30} y={F - 304} width={h.w - 60} height={10} fill="#6A4026" stroke={P0} strokeWidth={3} />
                {i === 2 ? <path d={`M ${h.x + 60} ${F - 290} q 40 30 80 0 q 40 30 80 0`} stroke="#E8E0D0" strokeWidth={10} fill="none" /> : null}
              </g>
            ) : null}
            {/* ground floor: shop arches with awnings (the middle block holds our shop) */}
            {(shop && i === 2 ? [] : [0, 1]).map((k) => {
              const ax = h.x + 40 + k * (h.w / 2);
              const aw = h.w / 2 - 70;
              return (
                <g key={`a${k}`}>
                  <path d={`M ${ax} ${F} L ${ax} ${F - 150} Q ${ax + aw / 2} ${F - 210} ${ax + aw} ${F - 150} L ${ax + aw} ${F} Z`} fill={h.shop} stroke={P0} strokeWidth={5} />
                  <Glow x={ax + aw / 2} y={F - 80} r={90} o={mode === 'day' ? 0.15 : 0.45} />
                  <path d={`M ${ax - 14} ${F - 196} L ${ax + aw + 14} ${F - 196} L ${ax + aw + 30} ${F - 156} L ${ax - 30} ${F - 156} Z`} fill={['#C83A3A', '#3A6AA8', '#D8A03A'][(i + k) % 3]} stroke={P0} strokeWidth={4} />
                  {Array.from({ length: 5 }).map((__, s2) => (
                    <path key={s2} d={`M ${ax - 14 + (s2 + 0.5) * ((aw + 28) / 5)} ${F - 196} L ${ax - 30 + (s2 + 0.5) * ((aw + 60) / 5)} ${F - 156}`} stroke="#F2E6CC" strokeWidth={10} opacity={0.7} />
                  ))}
                  <Amphora x={ax + aw + 24} y={F} s={0.5} c={['#B8643A', '#A8543A', '#C8784A'][k % 3]} />
                </g>
              );
            })}
          </g>
        );
      })}
      {shop ? (
        <g>
          {/* Burgus Maximus: a wide opening, the warm grill inside, the counter, the sign */}
          <rect x={420} y={F - 260} width={360} height={260} fill="#2A1612" stroke={P0} strokeWidth={6} />
          <Glow x={600} y={F - 120} r={220} o={open ? 0.7 : 0.2} />
          {open ? <rect x={470} y={F - 150} width={120} height={22} fill="#2A2628" /> : null}
          {open ? <Glow x={530} y={F - 130} r={90} kind="red" o={0.5} /> : null}
          {sign > 0 ? <ShopSign x={600} y={F - 320} s={0.55} paint={sign} /> : null}
          <path d={`M 400 ${F - 110} L 800 ${F - 110} L 800 ${F} L 400 ${F} Z`} fill="#EDE6DA" stroke={P0} strokeWidth={5} />
          {[[430, 0.6], [520, 0.4], [650, 0.5], [740, 0.3]].map(([mx, o], k) => (
            <path key={k} d={`M ${mx} ${F - 110} q 20 40 0 110`} stroke="#B8A898" strokeWidth={4} fill="none" opacity={o} />
          ))}
          <rect x={390} y={F - 124} width={420} height={18} fill="#D8CFC2" stroke={P0} strokeWidth={4} />
          {smoke > 0 && open ? <Smoke x={520} y={F - 300} t={t} o={smoke} h={420} /> : null}
        </g>
      ) : null}
      {/* pavement and paving */}
      <rect x={-500} y={F} width={2920} height={34} fill={'#C8BCA8'} stroke={P0} strokeWidth={4} />
      <rect x={-500} y={F + 34} width={2920} height={500} fill="#4A4652" />
      {Array.from({ length: 60 }).map((_, k) => {
        const r = Math.floor(k / 15);
        const cx = -460 + (k % 15) * 200 + (r % 2) * 100 + rnd(9, k) * 30;
        const cy = F + 70 + r * 70;
        return <path key={k} d={`M ${cx - 70} ${cy} L ${cx - 40} ${cy - 26} L ${cx + 50} ${cy - 24} L ${cx + 76} ${cy + 4} L ${cx + 40} ${cy + 28} L ${cx - 50} ${cy + 26} Z`} fill="#5A5664" stroke="#2E2A36" strokeWidth={4} />;
      })}
      {dk > 0 ? <rect x={-500} y={-500} width={2920} height={2000} fill="#0A0818" opacity={dk * (fire > 0 ? 0.6 : 1)} /> : null}
      {fire > 0 ? <rect x={-500} y={-500} width={2920} height={2000} fill="#FF6A2A" opacity={0.14 * fire} style={{ mixBlendMode: 'screen' }} /> : null}
      {mode !== 'day' && shop && open ? <Glow x={600} y={F - 120} r={300} o={0.55} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- the counter from the customer's side
/**
 * Inside Tullia's counter, looking in from the street: a painted back wall (a red band, a green fresco of a duck and
 * a jar), shelves of amphorae, the grill on the left, the menu board, oil lamps. Characters stand behind the counter
 * (feet hidden: hips at about y 600 at scale 1); draw <ShopCounter /> after them. `night` lights only the lamps and the
 * grill, `crowd` adds blurred heads of customers in front, `cheap` the turnip-fries era (no menu yet).
 */
export const SHOP = { hip: 610, counterY: 720 };
export const ShopInside: React.FC<{ t: number; id?: string; night?: boolean; menu?: boolean; grill?: number; flip?: number; empty?: boolean; fire?: number }> = ({
  t, id = 'shp', night = false, menu = true, grill = 1, flip = -1, empty = false, fire = 0,
}) => (
  <g>
    <rect x={-500} y={-500} width={2920} height={2000} fill="#B8603E" />
    <rect x={-500} y={-500} width={2920} height={620} fill="#E8D2A8" />
    <rect x={-500} y={110} width={2920} height={20} fill="#7A2E20" />
    <rect x={-500} y={560} width={2920} height={500} fill="#8A3A28" />
    {/* the fresco: a duck and a jar, in the style of the Pompeii counters */}
    <g transform="translate(1180 330)">
      <rect x={-170} y={-140} width={340} height={260} fill="#EAD8B0" stroke="#7A2E20" strokeWidth={8} />
      <path d="M -90 40 Q -110 -10 -60 -20 Q -40 -60 -10 -40 Q 0 -20 -20 -10 Q 40 -10 60 30 Q 0 60 -90 40 Z" fill="#3A7A6A" stroke={P0} strokeWidth={4} />
      <path d="M -10 -40 L 8 -36 L -6 -28" fill="#E8A03A" stroke={P0} strokeWidth={3} />
      <Amphora x={110} y={90} s={0.8} c="#A8543A" />
    </g>
    {/* shelves of amphorae and jars */}
    {[220, 400].map((sy, r) => (
      <g key={r}>
        <rect x={1420} y={sy} width={520} height={16} fill="#6A4026" stroke={P0} strokeWidth={4} />
        {Array.from({ length: 6 }).map((_, k) => (
          <Amphora key={k} x={1460 + k * 82} y={sy} s={0.62} c={['#B8643A', '#C8784A', '#A8543A'][(k + r) % 3]} rot={k % 2 ? -4 : 3} />
        ))}
      </g>
    ))}
    {menu ? <MenuBoard x={640} y={300} s={1} /> : null}
    {/* the grill against the left wall */}
    <Grill x={140} y={520} s={1} t={t} n={empty ? 0 : 4} heat={grill} flip={flip} />
    <Smoke x={140} y={420} t={t} o={0.6 * grill} h={400} />
    <OilLamp x={420} y={150} t={t} lit={1} />
    <OilLamp x={1680} y={140} t={t + 20} lit={1} />
    {night ? <rect x={-500} y={-500} width={2920} height={2000} fill="#0A0818" opacity={0.55} /> : null}
    {night ? <><Glow x={474} y={134} r={300} o={0.7} /><Glow x={1734} y={124} r={300} o={0.7} /><Glow x={140} y={540} r={360} o={0.8} /></> : null}
    {fire > 0 ? <rect x={-500} y={-500} width={2920} height={2000} fill="#FF5A1A" opacity={0.16 * fire} style={{ mixBlendMode: 'screen' }} /> : null}
    <Dust t={t} seed={4} x0={300} y0={100} w={1200} h={600} n={20} o={0.35} />
  </g>
);

/** The marble counter in front, with the round mouths of the clay pots sunk in its top; burgers waiting on it. */
export const ShopCounter: React.FC<{ t?: number; burgers?: number; tokens?: boolean; night?: boolean }> = ({ burgers = 0, tokens = false, night = false }) => (
  <g>
    <rect x={-500} y={SHOP.counterY} width={2920} height={500} fill="#EDE6DA" stroke={P0} strokeWidth={6} />
    {/* coloured marble inlays */}
    {Array.from({ length: 12 }).map((_, k) => (
      <path key={k} d={`M ${-420 + k * 240} ${SHOP.counterY + 60} l 80 0 l -20 120 l -80 0 Z`} fill={['#C88A6A', '#8AA08A', '#D8B8A0'][k % 3]} stroke={P0} strokeWidth={3} opacity={0.85} />
    ))}
    <rect x={-500} y={SHOP.counterY - 40} width={2920} height={44} fill="#F6F0E6" stroke={P0} strokeWidth={6} />
    {[300, 820, 1500].map((px, k) => (
      <g key={k}>
        <ellipse cx={px} cy={SHOP.counterY - 18} rx={70} ry={14} fill="#3A1E14" stroke={P0} strokeWidth={4} />
        <ellipse cx={px} cy={SHOP.counterY - 20} rx={56} ry={9} fill="#6A3A22" />
      </g>
    ))}
    {Array.from({ length: burgers }).map((_, k) => (
      <Burger key={k} x={1020 + k * 90 - (burgers - 1) * 45} y={SHOP.counterY - 36} s={0.55} />
    ))}
    {tokens ? [[1180, 'IV'], [1260, 'V'], [1330, 'VI']].map(([tx, n], k) => <Token key={k} x={tx as number} y={SHOP.counterY - 46} n={n as string} s={0.7} />) : null}
    {night ? <rect x={-500} y={SHOP.counterY - 40} width={2920} height={540} fill="#0A0818" opacity={0.45} /> : null}
  </g>
);

// ---------------------------------------------------------------- the Circus Maximus
/**
 * The stands of the Circus Maximus seen across the track: tiers of tiny spectators (they bounce with `cheer`), the
 * emperor's box with a purple awning, the spina with its obelisk in the middle of the sand, chariots (`race` 0..1 runs
 * them across). Characters walk the front aisle at feet CIRCUS.feet.
 */
export const CIRCUS = { feet: 900 };
export const CircusMaximus: React.FC<{ t: number; id?: string; cheer?: number; race?: number; mode?: Mode; box?: number }> = ({ t, id = 'cm', cheer = 0.3, race = -1, mode = 'day', box = 1 }) => (
  <g>
    <RomeSky id={id} t={t} mode={mode} horizon={140} />
    {/* far stands */}
    <path d="M -500 140 L 2420 140 L 2420 470 L -500 470 Z" fill="#C8A884" stroke={P0} strokeWidth={5} />
    {Array.from({ length: 9 }).map((_, r) =>
      Array.from({ length: 70 }).map((__, k) => {
        const cx = -480 + k * 42 + (r % 2) * 21;
        const cy = 170 + r * 34;
        const b = Math.max(0, Math.sin(t / 3 + k * 0.7 + r)) * 8 * cheer;
        return <circle key={`${r}-${k}`} cx={cx} cy={cy - b} r={11} fill={['#E9DCC0', '#C84A3A', '#3A6AA8', '#D8A03A', '#E8E2D6', '#6A8A5A'][Math.floor(rnd(r * 3 + 1, k) * 6)]} stroke={P0} strokeWidth={2} />;
      })
    )}
    {/* the emperor's box */}
    <g transform="translate(1180 250)" opacity={box}>
      <rect x={-140} y={-40} width={280} height={150} fill="#E9DCC0" stroke={P0} strokeWidth={5} />
      <path d="M -170 -40 L 170 -40 L 150 -90 L -150 -90 Z" fill="#6A2C7A" stroke={P0} strokeWidth={5} />
      {[-110, -40, 40, 110].map((cx) => <rect key={cx} x={cx - 8} y={-40} width={16} height={150} fill="#F6F0E6" stroke={P0} strokeWidth={3} />)}
      <circle cx={0} cy={30} r={22} fill="#26232F" stroke={P0} strokeWidth={3} />
      <path d="M -26 54 L 26 54 L 30 110 L -30 110 Z" fill="#6A2C7A" stroke={P0} strokeWidth={3} />
    </g>
    <rect x={-500} y={470} width={2920} height={30} fill="#8A6A4A" stroke={P0} strokeWidth={4} />
    {/* the sand and the spina */}
    <rect x={-500} y={500} width={2920} height={300} fill="#E2C890" />
    <rect x={-500} y={600} width={2920} height={36} fill="#C8B08A" stroke={P0} strokeWidth={4} />
    <path d="M 900 600 L 920 360 L 940 600 Z" fill="#D8C8A8" stroke={P0} strokeWidth={4} />
    {[300, 1500].map((mx) => (
      <g key={mx}>
        <rect x={mx - 30} y={520} width={60} height={80} fill="#C8B08A" stroke={P0} strokeWidth={4} />
        {[-16, 0, 16].map((d) => <path key={d} d={`M ${mx + d - 8} 520 L ${mx + d} 470 L ${mx + d + 8} 520 Z`} fill="#D8C8A8" stroke={P0} strokeWidth={3} />)}
      </g>
    ))}
    {race >= 0
      ? [0, 1].map((k) => {
          const cx = -300 + ((race * 2600 + k * 320) % 2700);
          return (
            <g key={k} transform={`translate(${cx} ${680 + k * 50})`}>
              {[0, 1].map((h) => (
                <g key={h} transform={`translate(${60 + h * 14} ${-h * 8})`}>
                  <ellipse cx={0} cy={-40} rx={46} ry={20} fill={k ? '#5A3A2A' : '#E8E2D6'} stroke={P0} strokeWidth={3} />
                  <path d={`M 34 -50 L 60 -76 L 70 -64 L 44 -40 Z`} fill={k ? '#5A3A2A' : '#E8E2D6'} stroke={P0} strokeWidth={3} />
                  {[-26, -6, 16, 30].map((lx, l) => <path key={l} d={`M ${lx} -26 L ${lx + Math.sin(t / 1.5 + l * 2) * 12} 0`} stroke={P0} strokeWidth={5} />)}
                </g>
              ))}
              <path d="M -50 -40 L 0 -40 L 0 -4 L -40 -4 Z" fill={k ? '#3A6AA8' : '#C83A3A'} stroke={P0} strokeWidth={4} />
              <circle cx={-34} cy={-2} r={20} fill="none" stroke={P0} strokeWidth={5} />
              <circle cx={-22} cy={-70} r={14} fill="#26232F" />
            </g>
          );
        })
      : null}
    <rect x={-500} y={800} width={2920} height={20} fill="#8A6A4A" stroke={P0} strokeWidth={4} />
    {/* the front tier: an aisle of stone steps */}
    <rect x={-500} y={820} width={2920} height={400} fill="#D8C4A0" />
    {[860, 940, 1020].map((sy) => <path key={sy} d={`M -500 ${sy} L 2420 ${sy}`} stroke="#A88E6A" strokeWidth={5} />)}
    {mode === 'dusk' ? <rect x={-500} y={-500} width={2920} height={2000} fill="#2A1030" opacity={0.25} /> : null}
  </g>
);

/** A row of spectators' heads and shoulders in the foreground (blur them with Foreground), cheering with `cheer`. */
export const CrowdFront: React.FC<{ t: number; y?: number; n?: number; cheer?: number; seed?: number; scale?: number }> = ({ t, y = 1000, n = 9, cheer = 0.5, seed = 1, scale = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, k) => {
      const cx = -300 + k * (2500 / n) + rnd(seed, k) * 80;
      const b = Math.max(0, Math.sin(t / 3.5 + k * 1.3)) * 22 * cheer;
      const c = ['#C84A3A', '#3A6AA8', '#D8A03A', '#E9DCC0', '#6A8A5A'][Math.floor(rnd(seed + 2, k) * 5)];
      return (
        <g key={k} transform={`translate(${cx} ${y - b}) scale(${scale})`}>
          <path d="M -110 200 Q -110 40 0 40 Q 110 40 110 200 Z" fill={c} stroke={P0} strokeWidth={6} />
          <circle cx={0} cy={-30} r={78} fill="#26232F" stroke={P0} strokeWidth={6} />
          {cheer > 0.4 && k % 2 ? <path d={`M 80 70 L ${140 + Math.sin(t / 3 + k) * 20} -140`} stroke="#26232F" strokeWidth={30} strokeLinecap="round" /> : null}
        </g>
      );
    })}
  </g>
);

// ---------------------------------------------------------------- the alley (arrival)
/** A narrow alley at street level, walls close on both sides, a strip of sky, washing lines, a donkey cart. */
export const RomeAlley: React.FC<{ t: number; id?: string; flash?: number }> = ({ t, id = 'ral', flash = 0 }) => (
  <g>
    <RomeSky id={id} t={t} mode="day" horizon={500} />
    <path d="M -500 -500 L 640 -500 L 760 860 L -500 1200 Z" fill="#D8935A" stroke={P0} strokeWidth={6} />
    <path d="M 2420 -500 L 1280 -500 L 1160 860 L 2420 1200 Z" fill="#C8664A" stroke={P0} strokeWidth={6} />
    <rect x={760} y={360} width={400} height={500} fill="#E8C890" stroke={P0} strokeWidth={5} />
    <path d="M 860 860 L 860 680 Q 960 620 1060 680 L 1060 860 Z" fill="#3A2620" stroke={P0} strokeWidth={5} />
    {[[200, 260], [380, 520], [1500, 300], [1680, 560]].map(([wx, wy], k) => (
      <g key={k}>
        <rect x={wx} y={wy} width={90} height={120} fill="#2A1E1E" stroke={P0} strokeWidth={5} />
        <rect x={wx - 34} y={wy} width={30} height={120} fill="#5A7A5A" stroke={P0} strokeWidth={4} />
      </g>
    ))}
    <path d="M 300 140 Q 960 260 1620 140" stroke="#5A4A3A" strokeWidth={4} fill="none" />
    {[[520, 190, '#E8E0D0'], [760, 214, '#C84A3A'], [1100, 214, '#3A6AA8'], [1380, 188, '#E8E0D0']].map(([cx, cy, c], k) => (
      <path key={k} d={`M ${cx as number - 40} ${cy} L ${cx as number + 40} ${cy} L ${cx as number + 34 + Math.sin(t / 10 + k) * 4} ${cy as number + 90} L ${cx as number - 34 + Math.sin(t / 10 + k) * 4} ${cy as number + 90} Z`} fill={c as string} stroke={P0} strokeWidth={4} />
    ))}
    <path d="M -500 1200 L 760 860 L 1160 860 L 2420 1200 Z" fill="#5A5664" />
    {Array.from({ length: 18 }).map((_, k) => {
      const r = Math.floor(k / 6);
      const cx = 600 + (k % 6) * 150 - 200 + r * 20 + (r % 2) * 60 - (r * 300) * ((k % 6) - 2.5) / 6;
      const cy = 900 + r * 80;
      return <ellipse key={k} cx={cx} cy={cy} rx={60 + r * 20} ry={18 + r * 6} fill="#6A6674" stroke="#2E2A36" strokeWidth={4} />;
    })}
    <Amphora x={360} y={1000} s={0.9} c="#B8643A" rot={-6} />
    <Amphora x={440} y={1010} s={0.8} c="#A8543A" />
    {flash > 0 ? <rect x={-500} y={-500} width={2920} height={2000} fill="#FFFFFF" opacity={flash} /> : null}
  </g>
);

// ---------------------------------------------------------------- the map of Rome
/** Rome's fourteen districts on the schematic, the Tiber, the Circus Maximus; `burn` 0..1 spreads the fire from it. */
const DISTRICTS: [number, number, number][] = [
  [960, 560, 1], [1080, 480, 1], [1150, 600, 2], [860, 460, 2], [1040, 680, 2], [1240, 470, 2], [880, 680, 2],
  [760, 560, 3], [1200, 340, 3], [960, 330, 3], [1330, 600, 3], [1100, 820, 4], [780, 360, 4], [620, 720, 4],
];
export const RomeMap: React.FC<{ t: number; id?: string; burn?: number; labels?: boolean }> = ({ t, id = 'rmap', burn = 0, labels = true }) => (
  <g>
    <Schematic t={t} id={id} />
    <path d="M 520 140 Q 640 360 560 540 Q 480 720 640 960" stroke="#3A7AC8" strokeWidth={34} fill="none" opacity={0.7} />
    {DISTRICTS.map(([cx, cy, ring], k) => {
      const lit = burn > 0 && ring <= 1 + burn * 3.2 && ring !== 4;
      const scorch = lit ? clamp(1 + burn * 3.2 - ring) : 0;
      return (
        <g key={k}>
          <path d={`M ${cx - 80} ${cy - 50} L ${cx + 70} ${cy - 66} L ${cx + 88} ${cy + 40} L ${cx - 60} ${cy + 64} Z`} fill={lit ? '#E2622A' : 'none'} fillOpacity={0.25 + 0.5 * scorch} stroke={lit ? '#FF9A5A' : SCH.line} strokeWidth={3} />
          {labels ? <text x={cx} y={cy + 10} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill={lit ? '#FFE0C0' : SCH.dim}>{['XI', 'X', 'II', 'VIII', 'XII', 'III', 'XIII', 'IX', 'V', 'VI', 'I', 'XIV', 'VII', 'IV'][k]}</text> : null}
          {lit ? <Glow x={cx} y={cy} r={120 * scorch} kind="red" o={0.6} /> : null}
        </g>
      );
    })}
    <g transform="translate(960 560)">
      <rect x={-120} y={-22} width={240} height={44} rx={22} fill="none" stroke="#F6EFE3" strokeWidth={4} />
    </g>
  </g>
);

export { lerp, Cone };
