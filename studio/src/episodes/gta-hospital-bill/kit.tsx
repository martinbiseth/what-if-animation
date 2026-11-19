import React from 'react';
import { DaySky, Tod, Glow, LEG_LEN, rnd, clamp, lerp, FONT, MONEY, fmtMoney, backOut, Skyline } from '../../engine';

// The sets and props of "What if you got the GTA6 hospital bill in real life?". All of it ours: a city hospital's
// emergency entrance (where you respawn), a garage, a steep hill with a fire hydrant at the bottom, a bridge over a
// brown river, a ten-floor car park with a pile of cardboard boxes, a hospital bay, a white lab. Props: an ambulance,
// a helicopter, a shopping trolley, a skateboard, a ramp, a trampoline, a greenhouse, a gas barbecue, a news van, the
// itemised bill. No game logos, no game art: the "game" is only ever a rule of this world.

const P0 = '#100E16';

// ---------------------------------------------------------------- hospital emergency entrance
export const HOSPF = { feet: 830 };
export const hospHip = (scale = 1) => HOSPF.feet - LEG_LEN * scale;

/** A white ambulance, side-on: x the middle, y the ground; `lights` flashes the bar (pass the clock). */
export const Ambulance: React.FC<{ x: number; y: number; s?: number; flip?: boolean; t?: number; lights?: number; spin?: number }> = ({ x, y, s = 1, flip = false, t = 0, lights = 0, spin = 0 }) => {
  const on = lights > 0 && Math.floor(t / 4) % 2 === 0;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={0} cy={6} rx={300} ry={18} fill="#000" opacity={0.3} />
      <path d="M -290 -40 L -290 -300 Q -290 -316 -274 -316 L 120 -316 Q 136 -316 136 -300 L 136 -200 L 220 -196 Q 252 -192 268 -150 L 292 -80 L 292 -40 Z" fill="#F4F2EE" stroke={P0} strokeWidth={6} strokeLinejoin="round" />
      <path d="M 150 -190 L 210 -188 Q 232 -186 244 -160 L 258 -120 L 150 -120 Z" fill="#2A3A4A" />
      <rect x={-290} y={-150} width={582} height={30} fill="#E83A3A" />
      <rect x={-290} y={-112} width={582} height={10} fill="#3A6AD8" />
      {/* a star of life, ours: a blue cross in a ring */}
      <g transform="translate(-80 -230)">
        <circle r={44} fill="#3A6AD8" />
        <path d="M -10 -32 H 10 V -10 H 32 V 10 H 10 V 32 H -10 V 10 H -32 V -10 H -10 Z" fill="#F4F2EE" />
      </g>
      <rect x={-270} y={-290} width={110} height={70} rx={6} fill="#C8D0D8" stroke={P0} strokeWidth={4} />
      <rect x={-30} y={-334} width={120} height={20} rx={8} fill={on ? '#FF3A3A' : '#8A2A2A'} />
      <rect x={30} y={-334} width={60} height={20} rx={8} fill={!on && lights > 0 ? '#4A8AFF' : '#2A3A6A'} />
      {lights > 0 ? <Glow x={on ? 0 : 60} y={-324} r={160} kind={on ? 'red' : 'cool'} o={0.9 * lights} /> : null}
      {[-180, 190].map((wx) => (
        <g key={wx} transform={`translate(${wx} -40)`}>
          <circle r={44} fill="#16141C" stroke={P0} strokeWidth={5} />
          <circle r={18} fill="#8A8898" />
          <path d="M -16 0 H 16" stroke="#4A4858" strokeWidth={4} transform={`rotate(${spin})`} />
        </g>
      ))}
    </g>
  );
};

/** The city hospital's emergency entrance: a pale block, the red EMERGENCY sign over a canopy, sliding glass doors
 * (`open` 0..1), an ambulance bay. `amb` parks an ambulance; `van` parks the news van (chapter 5). */
export const HospitalFront: React.FC<{ t: number; id?: string; tod?: Tod; open?: number; amb?: boolean; ambLights?: number; van?: boolean; crowd?: number }> = ({
  t, id = 'hf', tod = 'day', open = 0, amb = true, ambLights = 0, van = false,
}) => {
  const night = tod === 'night';
  const F = HOSPF.feet;
  const dx = open * 170;
  return (
    <g>
      <DaySky id={`${id}sky`} horizonY={300} tod={tod} />
      {/* the main block, behind: windows in a grid */}
      <rect x={-300} y={40} width={2520} height={F - 40} fill={night ? '#5A6470' : '#DCE2E4'} />
      <rect x={-300} y={40} width={2520} height={24} fill={night ? '#4A5260' : '#BCC6CA'} />
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 14 }).map((_, c) => (
          <rect key={`w${r}-${c}`} x={-240 + c * 180} y={170 + r * 72} width={120} height={50} rx={4}
            fill={night ? (rnd(r * 7 + 3, c) > 0.4 ? '#F2D88A' : '#2A3440') : '#8AB4CC'} stroke={night ? '#3A4250' : '#9AA6AE'} strokeWidth={3} />
        )),
      )}
      {/* the hospital's name across the top */}
      <text x={960} y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={0} fill="#2A3A5A">.</text>
      <rect x={560} y={58} width={800} height={86} rx={10} fill="#2A4A7A" />
      <text x={960} y={120} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} letterSpacing={6} fill="#F4F2EE">CITY GENERAL</text>
      {/* the lower front: the emergency wing */}
      <rect x={-300} y={470} width={2520} height={F - 470} fill={night ? '#6A7280' : '#EEF0EE'} />
      <rect x={-300} y={466} width={2520} height={12} fill="#AAB4B8" />
      {/* doors: dark inside, two glass panels that slide apart */}
      <rect x={760} y={560} width={400} height={F - 560} fill="#1C2A34" />
      <rect x={780} y={580} width={360} height={F - 580} fill={night ? '#F6E6B0' : '#CFE6EE'} opacity={0.35} />
      <g>
        <rect x={780 - dx} y={570} width={180} height={F - 570} fill="#A8D0E0" opacity={0.55} stroke="#6A8A98" strokeWidth={6} />
        <rect x={960 + dx} y={570} width={180} height={F - 570} fill="#A8D0E0" opacity={0.55} stroke="#6A8A98" strokeWidth={6} />
        <path d={`M ${800 - dx} 600 L ${840 - dx} 600 L ${800 - dx} 700 Z`} fill="#FFFFFF" opacity={0.35} />
      </g>
      <rect x={740} y={548} width={440} height={20} fill="#8A9AA2" />
      {/* the canopy and the sign */}
      <path d="M 600 470 L 1320 470 L 1360 520 L 560 520 Z" fill="#C8CED2" stroke={P0} strokeWidth={4} />
      <rect x={640} y={392} width={640} height={86} rx={10} fill="#D82E2E" stroke={P0} strokeWidth={5} />
      <text x={960} y={456} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={62} letterSpacing={8} fill="#FFFFFF">EMERGENCY</text>
      <Glow x={960} y={430} r={300} kind="red" o={night ? 0.7 : 0.25} />
      <rect x={600} y={520} width={18} height={F - 520} fill="#9AA4AA" />
      <rect x={1302} y={520} width={18} height={F - 520} fill="#9AA4AA" />
      {/* planters, a bench, a bin */}
      <rect x={220} y={F - 70} width={260} height={70} rx={8} fill="#8A8A86" />
      <ellipse cx={350} cy={F - 80} rx={150} ry={46} fill="#4E7A4A" />
      <rect x={1440} y={F - 70} width={260} height={70} rx={8} fill="#8A8A86" />
      <ellipse cx={1570} cy={F - 80} rx={150} ry={46} fill="#4E7A4A" />
      {/* the pavement and the road */}
      <rect x={-300} y={F} width={2520} height={40} fill="#B8B4AC" />
      <rect x={-300} y={F + 40} width={2520} height={400} fill={night ? '#2A2830' : '#4A4850'} />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={`d${i}`} x={-300 + i * 280} y={F + 160} width={150} height={12} fill="#E8E4D8" opacity={0.7} />
      ))}
      {amb ? <Ambulance x={1880} y={F + 120} s={0.9} t={t} lights={ambLights} /> : null}
      {van ? <NewsVan x={60} y={F + 130} s={0.9} t={t} /> : null}
      {night ? <rect x={-300} y={-400} width={2520} height={1900} fill="#0A0A20" opacity={0.25} /> : null}
    </g>
  );
};

/** A respawn shimmer: rings and sparkles around a point (where you appear), 0..1 over `p`. */
export const Shimmer: React.FC<{ x: number; y: number; p: number; s?: number }> = ({ x, y, p, s = 1 }) => {
  if (p <= 0 || p >= 1) return null;
  const k = clamp(p);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={1 - k}>
      <ellipse cx={0} cy={140} rx={120 + k * 160} ry={30 + k * 40} fill="none" stroke="#FFFFFF" strokeWidth={10 * (1 - k)} />
      <rect x={-90} y={-260} width={180} height={400} rx={90} fill="#FFFFFF" opacity={0.6 * (1 - k)} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const r = 80 + k * 200;
        return <circle key={i} cx={Math.cos(a) * r} cy={-60 + Math.sin(a) * r * 1.2} r={8 * (1 - k)} fill="#FFFFFF" />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- garage
export const Garage: React.FC<{ x: number; y: number; s?: number; door?: string }> = ({ x, y, s = 1, door = '#C8C4BA' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-320} width={520} height={320} fill="#D8B48A" stroke={P0} strokeWidth={6} />
    <rect x={-280} y={-340} width={560} height={30} fill="#6A5A4E" stroke={P0} strokeWidth={5} />
    <rect x={-190} y={-250} width={380} height={250} fill={door} stroke={P0} strokeWidth={5} />
    {[0, 1, 2, 3, 4].map((i) => (
      <rect key={i} x={-190} y={-250 + i * 50} width={380} height={4} fill="#000" opacity={0.15} />
    ))}
    <rect x={-20} y={-30} width={40} height={10} rx={4} fill={P0} opacity={0.6} />
  </g>
);

// ---------------------------------------------------------------- the hill, with a hydrant at the bottom
/** The ground line of the hill street: high on the left, low on the right. */
export const hillY = (x: number) => 360 + clamp((x + 200) / 2300) * 520;
export const hillHip = (x: number, scale = 1) => hillY(x) - LEG_LEN * scale;
export const Hill: React.FC<{ t: number; id?: string; spray?: number }> = ({ t, id = 'hill', spray = 0 }) => (
  <g>
    <DaySky id={`${id}sky`} horizonY={420} tod="day" />
    {/* houses stepping down the hill */}
    {Array.from({ length: 7 }).map((_, i) => {
      const x = -180 + i * 340;
      const g = hillY(x + 150);
      const cols = ['#C87A6A', '#7AA0B8', '#E8C07A', '#9AB88A', '#B88AA8', '#D89A6A', '#8AA8C8'];
      return (
        <g key={i}>
          <rect x={x} y={g - 300} width={300} height={300} fill={cols[i]} stroke={P0} strokeWidth={5} />
          <path d={`M ${x - 20} ${g - 300} L ${x + 150} ${g - 420} L ${x + 320} ${g - 300} Z`} fill="#5A4A4E" stroke={P0} strokeWidth={5} />
          <rect x={x + 40} y={g - 250} width={80} height={70} fill="#A8D0E0" stroke={P0} strokeWidth={4} />
          <rect x={x + 180} y={g - 250} width={80} height={70} fill="#A8D0E0" stroke={P0} strokeWidth={4} />
          <rect x={x + 120} y={g - 130} width={60} height={130} fill="#5A3A2A" stroke={P0} strokeWidth={4} />
        </g>
      );
    })}
    {/* the street itself, a steep wedge */}
    <path d={`M -400 ${hillY(-400)} L 2400 ${hillY(2400)} L 2400 1500 L -400 1500 Z`} fill="#4A4850" />
    <path d={`M -400 ${hillY(-400)} L 2400 ${hillY(2400)}`} stroke="#B8B4AC" strokeWidth={30} />
    {Array.from({ length: 8 }).map((_, i) => {
      const x = -200 + i * 320;
      return <path key={i} d={`M ${x} ${hillY(x) + 120} L ${x + 150} ${hillY(x + 150) + 120}`} stroke="#E8E4D8" strokeWidth={12} opacity={0.7} />;
    })}
    <text x={300} y={hillY(300) + 90} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#E8E4D8" opacity={0.5} transform={`rotate(12.7 300 ${hillY(300) + 90})`}>HILL ST</text>
    <Hydrant x={1780} y={hillY(1780) + 10} spray={spray} t={t} />
  </g>
);

/** A red fire hydrant; `spray` 0..1 sends a column of water up (broken off). */
export const Hydrant: React.FC<{ x: number; y: number; s?: number; spray?: number; t?: number; down?: number }> = ({ x, y, s = 1, spray = 0, t = 0, down = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {spray > 0 ? (
      <g>
        <path d={`M -26 -60 Q ${-60 + Math.sin(t / 3) * 20} ${-400 * spray} ${-10 + Math.sin(t / 2) * 30} ${-760 * spray} Q ${40 + Math.cos(t / 3) * 20} ${-400 * spray} 26 -60 Z`} fill="#A8DCF4" opacity={0.85} />
        {Array.from({ length: 14 }).map((_, i) => {
          const k = ((t * 1.3 + i * 13) % 40) / 40;
          const side = i % 2 ? 1 : -1;
          return <circle key={i} cx={side * k * 260} cy={-760 * spray + k * k * 700} r={14 * (1 - k * 0.5)} fill="#C8ECFA" opacity={(1 - k) * spray} />;
        })}
      </g>
    ) : null}
    <g transform={`rotate(${down * 70} 40 0)`} opacity={spray > 0 ? 0 : 1}>
      <rect x={-34} y={-120} width={68} height={110} rx={10} fill="#D82E2E" stroke={P0} strokeWidth={5} />
      <path d="M -40 -120 Q 0 -170 40 -120 Z" fill="#D82E2E" stroke={P0} strokeWidth={5} />
      <rect x={-54} y={-90} width={108} height={24} rx={8} fill="#B82222" stroke={P0} strokeWidth={4} />
    </g>
    <rect x={-46} y={-14} width={92} height={18} rx={4} fill="#8A2020" stroke={P0} strokeWidth={4} />
  </g>
);

/** A shopping trolley, side-on: x the middle, y the ground, wheels spinning on `spin`. */
export const Trolley: React.FC<{ x: number; y: number; s?: number; rot?: number; spin?: number }> = ({ x, y, s = 1, rot = 0, spin = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -150 -220 L 140 -220 L 110 -80 L -120 -80 Z" fill="none" stroke="#9AA4AE" strokeWidth={10} strokeLinejoin="round" />
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={i} d={`M ${-140 + i * 50} -220 L ${-115 + i * 42} -80`} stroke="#9AA4AE" strokeWidth={5} />
    ))}
    <path d="M -150 -150 L 125 -150" stroke="#9AA4AE" strokeWidth={5} />
    <path d="M -150 -220 L -200 -270 L -230 -270" stroke="#9AA4AE" strokeWidth={10} fill="none" strokeLinecap="round" />
    <rect x={-250} y={-282} width={40} height={20} rx={8} fill="#E83A3A" />
    <path d="M -120 -80 L -110 -20 M 110 -80 L 100 -20" stroke="#9AA4AE" strokeWidth={8} />
    {[-110, 100].map((wx) => (
      <g key={wx} transform={`translate(${wx} -16)`}>
        <circle r={16} fill="#26232F" stroke={P0} strokeWidth={4} />
        <path d="M -12 0 H 12" stroke="#5A5666" strokeWidth={3} transform={`rotate(${spin})`} />
      </g>
    ))}
  </g>
);

/** A skateboard side-on: x the middle, y the top of the deck. */
export const Skateboard: React.FC<{ x: number; y: number; s?: number; rot?: number; spin?: number }> = ({ x, y, s = 1, rot = 0, spin = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -130 0 Q -150 -14 -140 -22 L 140 -22 Q 150 -14 130 0 Z" fill="#2E9A5A" stroke={P0} strokeWidth={5} />
    <rect x={-90} y={0} width={30} height={10} fill="#5A5666" />
    <rect x={60} y={0} width={30} height={10} fill="#5A5666" />
    {[-75, 75].map((wx) => (
      <g key={wx} transform={`translate(${wx} 22)`}>
        <circle r={14} fill="#F2D24A" stroke={P0} strokeWidth={4} />
        <path d="M -10 0 H 10" stroke={P0} strokeWidth={3} transform={`rotate(${spin})`} />
      </g>
    ))}
  </g>
);

/** A plank ramp on bricks. x the low end, y the ground. */
export const Ramp: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <rect x={260} y={-100} width={70} height={100} fill="#B85A3A" stroke={P0} strokeWidth={4} />
    <rect x={260} y={-50} width={70} height={4} fill={P0} opacity={0.4} />
    <path d="M 0 0 L 340 -116 L 350 -96 L 10 14 Z" fill="#C89A5A" stroke={P0} strokeWidth={5} />
  </g>
);

/** A round garden trampoline, side-on. */
export const Trampoline: React.FC<{ x: number; y: number; s?: number; dip?: number }> = ({ x, y, s = 1, dip = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-200, -70, 70, 200].map((lx) => (
      <path key={lx} d={`M ${lx} -120 L ${lx * 1.05} 0`} stroke="#3A3A4A" strokeWidth={10} />
    ))}
    <path d={`M -230 -120 Q 0 ${-120 + dip * 60} 230 -120`} stroke="#1A1A22" strokeWidth={14} fill="none" />
    <rect x={-240} y={-132} width={480} height={20} rx={10} fill="#3A7AD8" stroke={P0} strokeWidth={4} />
  </g>
);

/** The neighbour's greenhouse; `smash` 0..1 shatters the glass. */
export const Greenhouse: React.FC<{ x: number; y: number; s?: number; smash?: number }> = ({ x, y, s = 1, smash = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -200 0 L -200 -200 L 0 -300 L 200 -200 L 200 0 Z" fill="#CFEFE8" opacity={0.5 * (1 - smash)} stroke="#E8ECEE" strokeWidth={8} />
    <path d="M -200 -200 L 200 -200 M 0 -300 L 0 0 M -100 -250 L -100 0 M 100 -250 L 100 0" stroke="#E8ECEE" strokeWidth={6} />
    {Array.from({ length: 6 }).map((_, i) => (
      <ellipse key={i} cx={-150 + i * 60} cy={-30} rx={26} ry={36} fill="#5A9A4A" />
    ))}
    {smash > 0
      ? Array.from({ length: 22 }).map((_, i) => {
          const a = rnd(5, i) * Math.PI * 2;
          const r = smash * (80 + rnd(6, i) * 260);
          return (
            <path key={`g${i}`} d="M 0 0 l 22 6 l -10 18 Z" fill="#E8FAFF" stroke="#A8C8D0" strokeWidth={2}
              transform={`translate(${Math.cos(a) * r} ${-180 + Math.sin(a) * r + smash * smash * 120}) rotate(${i * 47 + smash * 300})`} opacity={1 - smash * 0.4} />
          );
        })
      : null}
  </g>
);

/** A gas barbecue on wheels with a propane bottle; `boom` 0..1 is the fireball. */
export const GasGrill: React.FC<{ x: number; y: number; s?: number; t?: number; boom?: number; leak?: number }> = ({ x, y, s = 1, t = 0, boom = 0, leak = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {boom < 0.3 ? (
      <g>
        <rect x={-130} y={-120} width={260} height={110} fill="#3A3A44" stroke={P0} strokeWidth={5} />
        <path d="M -150 -120 Q 0 -260 150 -120 Z" fill="#26262E" stroke={P0} strokeWidth={5} />
        <rect x={-30} y={-210} width={60} height={14} rx={6} fill="#8A8A92" />
        <rect x={-160} y={-130} width={320} height={16} rx={4} fill="#5A5A64" stroke={P0} strokeWidth={4} />
        <rect x={-100} y={-90} width={60} height={70} rx={18} fill="#E8E4D8" stroke={P0} strokeWidth={4} />
        {[-110, 110].map((wx) => <circle key={wx} cx={wx} cy={-6} r={16} fill="#16141C" />)}
        {leak > 0
          ? [0, 1, 2].map((i) => {
              const k = ((t * 0.7 + i * 20) % 60) / 60;
              return <path key={i} d={`M ${-70 + k * 40} ${-100 - k * 80} q 10 -10 20 0 q 10 10 20 0`} stroke="#B8D8A8" strokeWidth={5} fill="none" opacity={(1 - k) * leak} />;
            })
          : null}
      </g>
    ) : null}
    {boom > 0 ? <Fireball x={0} y={-150} p={boom} s={1.6} /> : null}
  </g>
);

/** A cartoon fireball blooming then turning to smoke, p 0..1. */
export const Fireball: React.FC<{ x: number; y: number; p: number; s?: number }> = ({ x, y, p, s = 1 }) => {
  const k = clamp(p);
  const r = backOut(clamp(k * 2.2)) * 220;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Glow x={0} y={0} r={r * 2.4} o={0.9 * (1 - k)} />
      {Array.from({ length: 9 }).map((_, i) => {
        const a = (i / 9) * Math.PI * 2;
        const rr = r * (0.55 + rnd(4, i) * 0.4);
        const smoke = clamp((k - 0.45) / 0.55);
        return (
          <circle key={i} cx={Math.cos(a) * rr * 0.7} cy={Math.sin(a) * rr * 0.6 - k * 120} r={rr * 0.6}
            fill={smoke > 0.5 ? '#5A5458' : i % 2 ? '#FF8A2A' : '#FFC83A'} opacity={1 - smoke * 0.6} />
        );
      })}
      <circle cx={0} cy={-k * 120} r={r * 0.45} fill="#FFF2A8" opacity={1 - k} />
    </g>
  );
};

// ---------------------------------------------------------------- the river, the bridge
export const BRIDGE = { deck: 470, water: 900 };
export const bridgeHip = (scale = 1) => BRIDGE.deck - LEG_LEN * scale;
export const Bridge: React.FC<{ t: number; id?: string; boat?: number; splash?: number; tod?: Tod }> = ({ t, id = 'br', boat = -1, splash = 0, tod = 'day' }) => (
  <g>
    <DaySky id={`${id}sky`} horizonY={560} tod={tod} />
    <path d="M -400 640 Q 300 560 900 620 Q 1500 570 2400 630 L 2400 900 L -400 900 Z" fill="#6A8A6A" />
    {/* the water */}
    <rect x={-400} y={BRIDGE.water - 160} width={2800} height={900} fill="#7A6A4A" />
    {Array.from({ length: 14 }).map((_, i) => (
      <path key={i} d={`M ${-300 + ((i * 220 + t * 2) % 2600)} ${BRIDGE.water - 120 + (i % 4) * 60} q 30 -10 60 0`} stroke="#A8987A" strokeWidth={5} fill="none" />
    ))}
    {/* the bridge: deck, railings, arches down into the water */}
    <rect x={-400} y={BRIDGE.deck} width={2800} height={60} fill="#8A8278" stroke={P0} strokeWidth={5} />
    {[100, 900, 1700].map((ax) => (
      <path key={ax} d={`M ${ax - 300} ${BRIDGE.deck + 60} Q ${ax} ${BRIDGE.deck + 280} ${ax + 300} ${BRIDGE.deck + 60} L ${ax + 340} ${BRIDGE.water - 160} L ${ax - 340} ${BRIDGE.water - 160} Z`} fill="#9A9288" stroke={P0} strokeWidth={4} opacity={0.6} />
    ))}
    <rect x={-400} y={BRIDGE.deck - 110} width={2800} height={12} fill="#5A5A64" />
    {Array.from({ length: 30 }).map((_, i) => (
      <rect key={`r${i}`} x={-380 + i * 100} y={BRIDGE.deck - 110} width={10} height={110} fill="#5A5A64" />
    ))}
    {splash > 0 ? <Splash x={1160} y={BRIDGE.water - 150} p={splash} /> : null}
    {boat >= 0 ? <RescueBoat x={lerp(2300, 1300, clamp(boat))} y={BRIDGE.water - 130} t={t} /> : null}
  </g>
);

export const Splash: React.FC<{ x: number; y: number; p: number; s?: number }> = ({ x, y, p, s = 1 }) => {
  if (p <= 0 || p >= 1) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {Array.from({ length: 12 }).map((_, i) => {
        const a = -Math.PI * (0.1 + 0.8 * (i / 11));
        const r = p * 300;
        return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 1.3 + p * p * 260} r={18 * (1 - p)} fill="#D8E8F0" />;
      })}
      <ellipse cx={0} cy={0} rx={60 + p * 200} ry={14 + p * 30} fill="none" stroke="#D8E8F0" strokeWidth={10 * (1 - p)} />
    </g>
  );
};

export const RescueBoat: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y + Math.sin(t / 8) * 6}) scale(${s})`}>
    <path d="M -200 -60 L 200 -60 Q 190 20 120 30 L -170 30 Q -210 0 -200 -60 Z" fill="#F07A2A" stroke={P0} strokeWidth={5} />
    <rect x={-60} y={-150} width={140} height={90} rx={8} fill="#F4F2EE" stroke={P0} strokeWidth={5} />
    <rect x={-40} y={-130} width={100} height={40} fill="#2A3A4A" />
    <text x={0} y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#F4F2EE">RESCUE</text>
    <rect x={0} y={-176} width={40} height={16} rx={6} fill={Math.floor(t / 4) % 2 ? '#3A6AFF' : '#1A2A6A'} />
  </g>
);

// ---------------------------------------------------------------- the car park
export const CP = { feet: 830, floors: 10, h: 120, x0: 380, x1: 1540 };
export const cpTop = CP.feet - CP.floors * CP.h;
/** The ten-floor car park from the street: concrete decks, a ramp glimpse, a pile of cardboard boxes at its foot. */
export const CarPark: React.FC<{ t: number; id?: string; boxes?: number; crushed?: number; tod?: Tod }> = ({ t, id = 'cp', boxes = 1, crushed = 0, tod = 'day' }) => (
  <g>
    <DaySky id={`${id}sky`} horizonY={600} tod={tod} />
    <Skyline y={CP.feet - 200} seed={4} color="#7A8AA8" h={300} />
    <rect x={CP.x0} y={cpTop - 40} width={CP.x1 - CP.x0} height={CP.feet - cpTop + 40} fill="#9A968E" stroke={P0} strokeWidth={6} />
    {Array.from({ length: CP.floors }).map((_, i) => {
      const y = cpTop + i * CP.h;
      return (
        <g key={i}>
          <rect x={CP.x0 + 20} y={y + 30} width={CP.x1 - CP.x0 - 40} height={CP.h - 50} fill="#2E2C34" />
          {Array.from({ length: 6 }).map((_, k) => (
            <rect key={k} x={CP.x0 + 60 + k * 180} y={y + CP.h - 60} width={120} height={36} rx={8} fill={['#C83A3A', '#3A6AB8', '#E8E4D8', '#4A8A5A', '#E8C04A', '#5A5A64'][(i + k) % 6]} opacity={rnd(i, k) > 0.35 ? 0.9 : 0} />
          ))}
          {Array.from({ length: 8 }).map((_, k) => (
            <rect key={`c${k}`} x={CP.x0 + 20 + k * 145} y={y + 30} width={16} height={CP.h - 50} fill="#8A867E" />
          ))}
        </g>
      );
    })}
    <rect x={CP.x0 + 30} y={cpTop - 70} width={180} height={40} rx={6} fill="#2A5AB8" />
    <text x={CP.x0 + 120} y={cpTop - 38} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#FFFFFF">P</text>
    <rect x={-400} y={CP.feet} width={2800} height={600} fill="#4A4850" />
    <rect x={-400} y={CP.feet} width={2800} height={30} fill="#B8B4AC" />
    {boxes > 0 ? <BoxPile x={1260} y={CP.feet} s={0.9} crushed={crushed} /> : null}
  </g>
);

/** A pile of flattened and whole cardboard boxes. `crushed` 0..1 flattens it. */
export const BoxPile: React.FC<{ x: number; y: number; s?: number; crushed?: number }> = ({ x, y, s = 1, crushed = 0 }) => {
  const k = 1 - crushed * 0.75;
  const B = [[-150, 0, 120, 100], [-20, 0, 140, 110], [110, 0, 110, 90], [-90, -100, 120, 100], [40, -110, 120, 90], [-30, -200, 110, 90]];
  return (
    <g transform={`translate(${x} ${y}) scale(${s} ${s * k})`}>
      {B.map(([bx, by, w, h], i) => (
        <g key={i} transform={`rotate(${(rnd(3, i) - 0.5) * 10 + crushed * (i % 2 ? 20 : -20)} ${bx + w / 2} ${by - h / 2})`}>
          <rect x={bx} y={by - h} width={w} height={h} fill={i % 2 ? '#C89A5A' : '#B8884A'} stroke={P0} strokeWidth={4} />
          <rect x={bx + w / 2 - 12} y={by - h} width={24} height={h} fill="#D8B888" opacity={0.6} />
        </g>
      ))}
    </g>
  );
};

/** The top deck of the car park: concrete, a low wall, the city behind, wind. */
export const CarParkRoof: React.FC<{ t: number; id?: string; tod?: Tod; indoor?: boolean }> = ({ t, id = 'cpr', tod = 'day', indoor = false }) => (
  <g>
    {indoor ? (
      <g>
        <rect x={-400} y={-400} width={2800} height={1300} fill="#F2F4F6" />
        {Array.from({ length: 9 }).map((_, i) => (
          <rect key={i} x={-300 + i * 300} y={-200} width={180} height={20} fill="#FFFFFF" />
        ))}
        <rect x={-400} y={560} width={2800} height={8} fill="#D8DCE0" />
      </g>
    ) : (
      <g>
        <DaySky id={`${id}sky`} horizonY={640} tod={tod} />
        <Skyline y={700} seed={7} color="#6A7A98" h={220} />
      </g>
    )}
    <rect x={-400} y={700} width={2800} height={130} fill="#9A968E" />
    <rect x={-400} y={830} width={2800} height={500} fill="#8A867E" />
    {Array.from({ length: 7 }).map((_, i) => (
      <path key={i} d={`M ${-200 + i * 380} 1100 L ${-60 + i * 380} 830`} stroke="#F2F0E8" strokeWidth={10} opacity={0.7} />
    ))}
    <rect x={-400} y={680} width={2800} height={24} fill="#B8B4AC" stroke={P0} strokeWidth={4} />
    <text x={1500} y={790} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F2F0E8" opacity={0.6}>LEVEL 10</text>
  </g>
);

/** Looking straight down from the top deck: the street far below, Mo a dot, the boxes a smudge. */
export const DownView: React.FC<{ t: number; id?: string; fall?: number }> = ({ t, fall = 0 }) => {
  const z = 1 + fall * 3;
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#4A4850" />
      <g transform={`translate(960 640) scale(${z}) translate(-960 -640)`}>
        <rect x={-400} y={-400} width={2800} height={500} fill="#B8B4AC" />
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={i} x={-300 + i * 420} y={420} width={200} height={20} fill="#E8E4D8" opacity={0.6} />
        ))}
        <ModernCarTop x={420} y={520} c="#3A6AB8" />
        <ModernCarTop x={1500} y={300} c="#C83A3A" />
        <g transform="translate(960 640)">
          {[[-30, -20], [20, -24], [0, 16], [-24, 22], [30, 18]].map(([bx, by], i) => (
            <rect key={i} x={bx - 18} y={by - 14} width={36} height={28} fill="#C89A5A" stroke={P0} strokeWidth={2} />
          ))}
        </g>
        <circle cx={1060} cy={600} r={14} fill="#4E7A4A" stroke={P0} strokeWidth={3} />
        <circle cx={1060} cy={600} r={7} fill="#17131C" />
      </g>
      {/* the parapet's edge at the bottom of frame, your shoes */}
      <rect x={-400} y={960} width={2800} height={200} fill="#9A968E" />
      <rect x={-400} y={950} width={2800} height={20} fill="#B8B4AC" />
      <ellipse cx={860} cy={1000} rx={70} ry={34} fill="#F6EFE3" stroke={P0} strokeWidth={5} opacity={1 - fall} />
      <ellipse cx={1060} cy={1000} rx={70} ry={34} fill="#F6EFE3" stroke={P0} strokeWidth={5} opacity={1 - fall} />
    </g>
  );
};
const ModernCarTop: React.FC<{ x: number; y: number; c: string }> = ({ x, y, c }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-50} y={-100} width={100} height={200} rx={26} fill={c} stroke={P0} strokeWidth={4} />
    <rect x={-38} y={-60} width={76} height={50} rx={10} fill="#2A3A4A" />
  </g>
);

/** A helicopter air ambulance: white and red, rotor turning on t. */
export const Helicopter: React.FC<{ x: number; y: number; s?: number; t?: number; flip?: boolean }> = ({ x, y, s = 1, t = 0, flip = false }) => {
  const w = Math.abs(Math.cos(t * 1.7));
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <path d="M -60 -40 L -340 -60 L -360 -110 L -330 -110 L -300 -70 L -60 -70 Z" fill="#F4F2EE" stroke={P0} strokeWidth={5} />
      <rect x={-372} y={-130} width={30} height={80} rx={8} fill="#D82E2E" stroke={P0} strokeWidth={4} />
      <path d="M -120 -130 Q -120 -170 -40 -172 L 120 -172 Q 220 -170 240 -90 Q 250 -20 180 -10 L -100 -10 Q -130 -30 -120 -130 Z" fill="#F4F2EE" stroke={P0} strokeWidth={6} />
      <path d="M 120 -160 Q 210 -156 226 -96 L 120 -96 Z" fill="#2A3A4A" />
      <rect x={-120} y={-80} width={300} height={22} fill="#D82E2E" />
      <path d="M -60 20 L 200 20 M -30 -10 L -40 20 M 150 -10 L 160 20" stroke={P0} strokeWidth={8} strokeLinecap="round" />
      <rect x={10} y={-200} width={20} height={30} fill={P0} />
      <ellipse cx={20} cy={-204} rx={360 * w + 30} ry={10} fill="#3A3A44" opacity={0.75} />
      <ellipse cx={20} cy={-204} rx={360} ry={18} fill="#3A3A44" opacity={0.15} />
    </g>
  );
};

/** A TV news van with a dish. */
export const NewsVan: React.FC<{ x: number; y: number; s?: number; t?: number; flip?: boolean }> = ({ x, y, s = 1, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={6} rx={280} ry={16} fill="#000" opacity={0.3} />
    <path d="M -270 -40 L -270 -270 L 150 -270 L 160 -200 L 250 -190 Q 270 -150 270 -40 Z" fill="#2A4A8A" stroke={P0} strokeWidth={6} strokeLinejoin="round" />
    <path d="M 165 -184 L 240 -178 Q 252 -150 252 -130 L 165 -130 Z" fill="#1A2030" />
    <text x={-60} y={-160} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFFFFF">NEWS 7</text>
    <rect x={-270} y={-120} width={520} height={16} fill="#F2B33D" />
    <path d="M -120 -270 L -120 -340" stroke={P0} strokeWidth={10} />
    <path d="M -200 -360 Q -120 -420 -40 -360 Z" fill="#E8E4D8" stroke={P0} strokeWidth={5} />
    {[-170, 180].map((wx) => (
      <g key={wx} transform={`translate(${wx} -40)`}>
        <circle r={42} fill="#16141C" stroke={P0} strokeWidth={5} />
        <circle r={16} fill="#8A8898" />
      </g>
    ))}
  </g>
);

// ---------------------------------------------------------------- a hospital bay (Mo, chapter 6)
export const BAY = { feet: 900 };
export const HospitalBay: React.FC<{ t: number; id?: string; beat?: boolean }> = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1400} fill="#CFE0DA" />
    <rect x={-400} y={560} width={2800} height={14} fill="#A8BEB6" />
    <rect x={-400} y={BAY.feet} width={2800} height={500} fill="#B8C4C0" />
    {Array.from({ length: 12 }).map((_, i) => (
      <path key={i} d={`M ${-400 + i * 260} ${BAY.feet} L ${-600 + i * 300} 1500`} stroke="#A8B4B0" strokeWidth={4} />
    ))}
    {/* the curtain on its rail, both sides */}
    <rect x={-400} y={40} width={2800} height={10} fill="#8A9A96" />
    {[-300, 1680].map((cx, k) => (
      <g key={k}>
        {Array.from({ length: 6 }).map((_, i) => (
          <path key={i} d={`M ${cx + i * 50} 50 Q ${cx + i * 50 + 25 + Math.sin(t / 30 + i) * 6} 480 ${cx + i * 50} ${BAY.feet - 40}`} stroke="#6AA8B8" strokeWidth={50} fill="none" opacity={0.9} />
        ))}
      </g>
    ))}
    {/* the monitor, beeping */}
    <g transform="translate(1440 300)">
      <rect x={-120} y={-80} width={240} height={160} rx={12} fill="#26303A" stroke={P0} strokeWidth={5} />
      <rect x={-104} y={-64} width={208} height={128} rx={6} fill="#0E1418" />
      <path d={`M -100 0 ${Array.from({ length: 10 }).map((_, i) => { const x = -100 + i * 20; const ph = (i * 20 + t * 4) % 200; return ph < 20 ? `L ${x} -40 L ${x + 6} 30 L ${x + 12} 0` : `L ${x + 20} 0`; }).join(' ')}`} stroke="#4BE38A" strokeWidth={4} fill="none" />
      <text x={70} y={-38} fontFamily={FONT.ui} fontSize={26} fill="#4BE38A">72</text>
      <rect x={-6} y={80} width={12} height={240} fill="#5A6A72" />
    </g>
    {/* the bed */}
    <g transform="translate(860 780)">
      <rect x={-420} y={-40} width={840} height={70} rx={14} fill="#E8EEF0" stroke={P0} strokeWidth={5} />
      <rect x={-420} y={-20} width={840} height={30} fill="#8AB4C8" opacity={0.5} />
      <path d="M -440 -120 L -440 120 M 440 -60 L 440 120" stroke="#7A8A92" strokeWidth={14} strokeLinecap="round" />
      <path d="M -440 60 L 440 60" stroke="#7A8A92" strokeWidth={10} />
      {[-380, 380].map((wx) => <circle key={wx} cx={wx} cy={126} r={14} fill="#26232F" />)}
    </g>
  </g>
);

// ---------------------------------------------------------------- the company: a white room
export const LAB = { feet: 860 };
export const labHip = (scale = 1) => LAB.feet - LEG_LEN * scale;
export const WhiteRoom: React.FC<{ t: number; id?: string; door?: number; chair?: boolean }> = ({ t, id = 'wr', door = 0, chair = true }) => (
  <g>
    <defs>
      <radialGradient id={`${id}g`} cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#D4DAE0" />
      </radialGradient>
    </defs>
    <rect x={-400} y={-400} width={2800} height={1300} fill={`url(#${id}g)`} />
    <rect x={-400} y={LAB.feet} width={2800} height={600} fill="#E4E8EC" />
    <rect x={-400} y={LAB.feet - 4} width={2800} height={8} fill="#C8CED4" />
    {/* the sliding door: when it opens, the rebuilt car-park deck shows through */}
    <g>
      <rect x={1240} y={300} width={440} height={LAB.feet - 300} fill="#B8C0C8" />
      <clipPath id={`${id}dc`}><rect x={1240} y={300} width={440} height={LAB.feet - 300} /></clipPath>
      <g clipPath={`url(#${id}dc)`}>
        <rect x={1240} y={300} width={440} height={600} fill="#F6F8FA" />
        <rect x={1240} y={700} width={440} height={200} fill="#9A968E" />
        <rect x={1240} y={690} width={440} height={16} fill="#B8B4AC" />
        <BoxPile x={1460} y={860} s={0.5} />
        <rect x={1240 + door * 440} y={300} width={440} height={LAB.feet - 300} fill="#EEF2F6" stroke="#C8CED4" strokeWidth={6} />
      </g>
    </g>
    {/* a heartbeat-line logo on the wall */}
    <g transform="translate(600 300)" opacity={0.85}>
      <path d="M -160 0 L -60 0 L -30 -60 L 10 70 L 40 -20 L 60 0 L 160 0" stroke="#D82E4A" strokeWidth={14} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </g>
    {chair ? (
      <g transform={`translate(760 ${LAB.feet})`}>
        <rect x={-70} y={-150} width={140} height={20} rx={6} fill="#26232F" />
        <rect x={-70} y={-290} width={20} height={160} rx={6} fill="#26232F" />
        <path d="M -60 -130 L -70 0 M 60 -130 L 70 0" stroke="#26232F" strokeWidth={10} />
      </g>
    ) : null}
  </g>
);

// ---------------------------------------------------------------- the bill
export type Line = { label: string; v: number; at: number; hot?: boolean };
/** The itemised hospital bill: a paper slip that slides up, lines landing at their frames, the total counting. */
export const Bill: React.FC<{ x: number; y: number; s?: number; rot?: number; t: number; lines: Line[]; total?: number; totalAt?: number; title?: string; stamp?: string; stampAt?: number }> = ({
  x, y, s = 1, rot = 0, t, lines, total, totalAt = 999, title = 'CITY GENERAL HOSPITAL', stamp, stampAt = 999,
}) => {
  const h = 200 + lines.length * 74 + (total !== undefined ? 130 : 0);
  const shown = lines.filter((l) => t >= l.at);
  const sum = total ?? lines.reduce((a, l) => a + l.v, 0);
  const tk = clamp((t - totalAt) / 16);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-330} y={-h / 2 + 14} width={660} height={h} fill="#000" opacity={0.3} transform="translate(12 12)" />
      <path d={`M -330 ${-h / 2} H 330 V ${h / 2} ${Array.from({ length: 22 }).map((_, i) => `L ${330 - (i + 0.5) * 30} ${h / 2 + (i % 2 ? 0 : 14)}`).join(' ')} L -330 ${h / 2} Z`} fill="#FBF8F0" stroke="#CFC8B8" strokeWidth={3} />
      <rect x={-330} y={-h / 2} width={660} height={16} fill="#3A6AD8" />
      <text x={0} y={-h / 2 + 70} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#1D2033">{title}</text>
      <text x={0} y={-h / 2 + 112} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} letterSpacing={6} fill="#7A7468">STATEMENT · PATIENT: YOU</text>
      <rect x={-290} y={-h / 2 + 132} width={580} height={3} fill="#CFC8B8" />
      {shown.map((l, i) => {
        const p = backOut(clamp((t - l.at) / 7));
        const ly = -h / 2 + 190 + i * 74;
        return (
          <g key={i} transform={`translate(0 ${ly}) scale(${p} 1)`} opacity={clamp((t - l.at) / 3)}>
            <text x={-290} y={0} fontFamily={FONT.ui} fontSize={30} fill={l.hot ? '#C82A2A' : '#2A2830'}>{l.label}</text>
            <text x={290} y={0} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill={l.hot ? '#C82A2A' : '#1D2033'}>{fmtMoney(l.v)}</text>
          </g>
        );
      })}
      {total !== undefined && t >= totalAt ? (
        <g transform={`translate(0 ${h / 2 - 70})`}>
          <rect x={-290} y={-64} width={580} height={4} fill="#1D2033" />
          <text x={-290} y={10} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#1D2033">TOTAL</text>
          <text x={290} y={12} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#D82E2E">{fmtMoney(Math.round(sum * tk))}</text>
        </g>
      ) : null}
      {stamp && t >= stampAt ? (
        <g transform={`translate(30 ${-h / 2 + 260}) rotate(-14) scale(${backOut(clamp((t - stampAt) / 6)) * 1})`} opacity={0.88}>
          <rect x={-240} y={-62} width={480} height={124} rx={14} fill="none" stroke="#D82E2E" strokeWidth={10} />
          <text x={0} y={26} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={74} fill="#D82E2E">{stamp}</text>
        </g>
      ) : null}
    </g>
  );
};

/** The running total, in screen space: a red chip top right that ticks up, with "+$X" floating off when it lands. */
export const BillChip: React.FC<{ v: number; prev: number; since: number; o?: number; label?: string }> = ({ v, prev, since, o = 1, label = 'HOSPITAL BILL' }) => {
  if (o <= 0) return null;
  const add = v - prev;
  const fl = clamp(1 - since / 10);
  const txt = fmtMoney(v);
  const w = Math.max(300, 60 + txt.length * 34);
  return (
    <g transform={`translate(${1860 - w} 52) scale(${1 + fl * 0.08})`} opacity={o}>
      <rect x={0} y={0} width={w} height={108} rx={20} fill="#1A0E14" opacity={0.82} stroke={fl > 0 ? '#FFFFFF' : MONEY.red} strokeWidth={4} />
      <text x={26} y={36} fontFamily={FONT.ui} fontSize={24} letterSpacing={5} fill="#F6A0A0">{label}</text>
      <text x={26} y={88} fontFamily={FONT.title} fontWeight={800} fontSize={52} fill={MONEY.red}>{txt}</text>
      {add > 0 && since < 40 ? (
        <text x={w - 20} y={150 + since * 0.8} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFFFFF" stroke="#1A0E14" strokeWidth={8} paintOrder="stroke" opacity={1 - since / 40}>
          +{fmtMoney(add)}
        </text>
      ) : null}
    </g>
  );
};
