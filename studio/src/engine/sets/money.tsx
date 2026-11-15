import React from 'react';
import { rnd } from '../anim';
import { FONT } from '../fonts';
import { Glow, WallTexture } from '../light';
import { LEG_LEN } from '../rig';
import { DaySky } from '../modern';

// Sets for "What if you could see everyone's bank balance?": the inside of a city bus, a bank hall with its
// counters, an office high above a train station, and a pizzeria. Flat fills like the modern kit, the side away from
// the light darker. Each takes the shot clock `t` (passing scenery, flicker) and an `id`.

// ---------------------------------------------------------------- the bus
export const BUS = { feet: 840, winTop: 250, winBot: 560, seat: 640 };
export const busHip = (scale = 1) => BUS.feet - LEG_LEN * scale;

/** A city bus from inside, side-on: a run of windows with the street sliding past, yellow poles, seats along the far side. */
export const Bus: React.FC<{ t: number; id?: string; speed?: number; driver?: boolean }> = ({ t, id = 'bus', speed = 6 }) => {
  const off = (t * speed) % 600;
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#D8DCE4" />
      {/* the window band: sky and houses sliding left */}
      <clipPath id={`${id}win`}>
        {Array.from({ length: 7 }).map((_, i) => (
          <rect key={i} x={-300 + i * 400} y={BUS.winTop} width={360} height={BUS.winBot - BUS.winTop} rx={22} />
        ))}
      </clipPath>
      <g clipPath={`url(#${id}win)`}>
        <DaySky id={`${id}sky`} horizonY={BUS.winBot} tod="day" />
        {Array.from({ length: 14 }).map((_, i) => {
          const x = -600 + i * 300 - off * 1.0;
          const h = 160 + rnd(i % 6, 3) * 140;
          return <rect key={`h${i}`} x={x} y={BUS.winBot - h} width={260} height={h} fill={['#C98B6A', '#B0B8C8', '#E0C29A', '#8AA88A', '#C8A0A0', '#A8A0C0'][i % 6]} />;
        })}
        {Array.from({ length: 14 }).map((_, i) => {
          const x = -600 + i * 300 - off * 1.0 + 40;
          const h = 160 + rnd(i % 6, 3) * 140;
          return Array.from({ length: Math.floor(h / 70) }).map((__, r) => <rect key={`w${i}-${r}`} x={x} y={BUS.winBot - h + 24 + r * 66} width={50} height={36} fill="#6E8AA8" />);
        })}
        {Array.from({ length: 8 }).map((_, i) => (
          <circle key={`t${i}`} cx={-500 + i * 520 - ((off * 1.8) % 520)} cy={BUS.winBot - 40} r={70} fill="#4E7A4A" />
        ))}
      </g>
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={`f${i}`} x={-300 + i * 400} y={BUS.winTop} width={360} height={BUS.winBot - BUS.winTop} rx={22} fill="none" stroke="#5A6070" strokeWidth={14} />
      ))}
      {/* adverts strip and the ceiling rail */}
      <rect x={-400} y={120} width={2800} height={90} fill="#C8CCD6" />
      {Array.from({ length: 7 }).map((_, i) => (
        <rect key={`ad${i}`} x={-280 + i * 400} y={134} width={320} height={62} rx={6} fill={['#E8504A', '#4AA8E0', '#F2C14E', '#5BC08A'][i % 4]} opacity={0.85} />
      ))}
      <rect x={-400} y={226} width={2800} height={12} rx={6} fill="#F2C14E" />
      {/* seats along the far side */}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={`s${i}`}>
          <rect x={-330 + i * 400} y={BUS.seat - 110} width={150} height={150} rx={22} fill="#2E5A9A" />
          <rect x={-330 + i * 400} y={BUS.seat + 20} width={170} height={36} rx={12} fill="#244A82" />
          <rect x={-170 + i * 400} y={BUS.seat - 110} width={150} height={150} rx={22} fill="#2E5A9A" />
          <rect x={-170 + i * 400} y={BUS.seat + 20} width={170} height={36} rx={12} fill="#244A82" />
        </g>
      ))}
      <rect x={-400} y={BUS.seat + 56} width={2800} height={BUS.feet - BUS.seat - 56} fill="#9AA0AC" />
      <rect x={-400} y={BUS.feet} width={2800} height={700} fill="#5A5E6A" />
      {Array.from({ length: 40 }).map((_, k) => (
        <circle key={`d${k}`} cx={-400 + (k * 97) % 2800} cy={BUS.feet + 30 + (k * 53) % 260} r={4} fill="#4A4E5A" />
      ))}
      {/* poles */}
      {[-120, 520, 1180, 1820].map((x) => (
        <g key={x}>
          <rect x={x - 9} y={230} width={18} height={BUS.feet - 230} rx={9} fill="#F2C14E" />
          <rect x={x - 3} y={230} width={5} height={BUS.feet - 230} fill="#FFF0B0" opacity={0.6} />
          <rect x={x - 16} y={520} width={32} height={22} rx={6} fill="#E8504A" />
        </g>
      ))}
      <Glow x={960} y={380} r={900} kind="cool" o={0.18} />
    </g>
  );
};

/** The front of the bus: the driver's cab, the windscreen, the ticket machine. Draw the driver behind `BusCabFront`. */
export const BusCab: React.FC<{ t: number; id?: string }> = ({ t, id = 'cab' }) => {
  const off = (t * 4) % 400;
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#C8CCD6" />
      <clipPath id={`${id}ws`}>
        <path d="M 200 120 H 1720 L 1800 600 H 120 Z" />
      </clipPath>
      <g clipPath={`url(#${id}ws)`}>
        <DaySky id={`${id}sky`} horizonY={600} tod="day" />
        <path d="M 960 360 L 300 620 H 1620 Z" fill="#4A4A54" />
        {Array.from({ length: 6 }).map((_, i) => {
          const k = ((i * 70 + off) % 400) / 400;
          return <rect key={i} x={960 - 6 - k * 30} y={360 + k * 260} width={12 + k * 60} height={8 + k * 20} fill="#E8E4D8" />;
        })}
        {[0, 1].map((s) => (
          <rect key={s} x={s ? 1260 : 200} y={260} width={460} height={340} fill={s ? '#B0B8C8' : '#C98B6A'} />
        ))}
      </g>
      <path d="M 200 120 H 1720 L 1800 600 H 120 Z" fill="none" stroke="#3A3E4A" strokeWidth={26} />
      <rect x={-400} y={600} width={2800} height={900} fill="#3A3E4A" />
      <rect x={-400} y={600} width={2800} height={40} fill="#4A4E5A" />
    </g>
  );
};
export const BusCabFront: React.FC = () => (
  <g>
    <rect x={-400} y={760} width={2800} height={600} fill="#2A2E38" />
    <circle cx={700} cy={930} r={170} fill="none" stroke="#1A1C22" strokeWidth={34} />
    <rect x={1300} y={640} width={220} height={140} rx={14} fill="#5A6070" />
    <rect x={1320} y={660} width={180} height={60} rx={6} fill="#7FD0A0" />
    <text x={1410} y={702} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#0F3A24">TAP CARD</text>
  </g>
);

// ---------------------------------------------------------------- the bank
export const BANK = { feet: 830, counter: 600 };
export const bankHip = (scale = 1) => BANK.feet - LEG_LEN * scale;

/** A bank hall: pale stone, tall windows, the BANK sign, a wall clock, a row of counters with glass screens on the right
 *  (`counter` false hides them, for a wide of the queue), queue posts with a red rope. */
export const Bank: React.FC<{ t: number; id?: string; counter?: boolean; rope?: boolean; alarm?: number }> = ({ t, id = 'bank', counter = true, rope = true, alarm = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1300} fill="#E6DED0" />
    {/* stone blocks */}
    {Array.from({ length: 10 }).map((_, r) => (
      <path key={r} d={`M -400 ${r * 90} H 2400`} stroke="#D2C8B6" strokeWidth={3} />
    ))}
    {/* tall windows with columns */}
    {[-200, 260, 720].map((x, i) => (
      <g key={i}>
        <rect x={x} y={60} width={260} height={480} rx={130} fill="#F4EEE2" />
        <rect x={x + 18} y={78} width={224} height={444} rx={112} fill="#A8C8E8" />
        <path d={`M ${x + 130} 78 V 522 M ${x + 18} 300 H ${x + 242}`} stroke="#F4EEE2" strokeWidth={10} />
        <rect x={x + 290} y={20} width={60} height={BANK.feet - 20} fill="#D8CEBC" />
        <rect x={x + 278} y={20} width={84} height={30} fill="#CABFAC" />
      </g>
    ))}
    <WallTexture rect={[-400, -400, 2800, 1230]} />
    {/* the sign and the clock */}
    <rect x={1150} y={40} width={560} height={110} rx={10} fill="#1E3A5A" />
    <text x={1430} y={118} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={74} fill="#F2D08A" letterSpacing={14}>BANK</text>
    <circle cx={1000} cy={110} r={56} fill="#F4EEE2" stroke="#8A7A5A" strokeWidth={8} />
    <path d={`M 1000 110 L ${1000 + 32 * Math.sin(t / 300)} ${110 - 32 * Math.cos(t / 300)} M 1000 110 L 1000 72`} stroke="#2A2420" strokeWidth={6} strokeLinecap="round" />
    {/* floor */}
    <rect x={-400} y={BANK.feet} width={2800} height={600} fill="#C8BCA8" />
    {Array.from({ length: 16 }).map((_, k) => (
      <path key={k} d={`M ${-400 + k * 200} ${BANK.feet} L ${-700 + k * 260} 1500`} stroke="#B4A892" strokeWidth={4} />
    ))}
    <path d={`M -400 ${BANK.feet + 120} H 2400 M -400 ${BANK.feet + 300} H 2400`} stroke="#B4A892" strokeWidth={4} />
    {counter ? (
      <g>
        <rect x={1180} y={BANK.counter} width={1300} height={BANK.feet - BANK.counter + 10} fill="#6A4A3A" />
        <rect x={1160} y={BANK.counter - 22} width={1340} height={28} fill="#8A6A52" />
        {[1260, 1620, 1980].map((x) => (
          <g key={x}>
            <rect x={x} y={BANK.counter - 330} width={300} height={310} fill="#BFE0F0" opacity={0.35} stroke="#8AA8B8" strokeWidth={6} />
            <rect x={x + 90} y={BANK.counter - 60} width={120} height={36} rx={4} fill="#4A4E5A" />
          </g>
        ))}
        <rect x={1180} y={BANK.counter + 40} width={1300} height={12} fill="#5A3E30" />
      </g>
    ) : null}
    {rope ? (
      <g>
        {[220, 520, 820].map((x) => (
          <g key={x}>
            <rect x={x - 8} y={BANK.feet - 150} width={16} height={150} fill="#C8A040" />
            <ellipse cx={x} cy={BANK.feet} rx={34} ry={10} fill="#A88030" />
            <circle cx={x} cy={BANK.feet - 156} r={14} fill="#E8C060" />
          </g>
        ))}
        <path d={`M 220 ${BANK.feet - 140} Q 370 ${BANK.feet - 80} 520 ${BANK.feet - 140} Q 670 ${BANK.feet - 80} 820 ${BANK.feet - 140}`} stroke="#B8323A" strokeWidth={14} fill="none" />
      </g>
    ) : null}
    {alarm > 0 ? <rect x={-400} y={-400} width={2800} height={1900} fill="#FF2A2A" opacity={alarm * (0.12 + 0.1 * Math.sin(t / 3))} /> : null}
    <Glow x={400} y={300} r={700} kind="warm" o={0.25} />
  </g>
);

// ---------------------------------------------------------------- the office over the station
export const OFFICE = { feet: 850, table: 690 };
export const officeHip = (scale = 1) => OFFICE.feet - LEG_LEN * scale;

/** The station concourse seen from high above: tiles, the departure board, tiny commuters streaming along lanes.
 *  `people` gives each walker a position at time t; scenes draw them (and their balances) on top. */
export const concourseWalker = (i: number, t: number) => {
  const lane = i % 6;
  const dir = lane % 2 ? -1 : 1;
  const speed = 0.9 + rnd(i, 2) * 0.8;
  const x0 = rnd(i, 1) * 2400 - 240;
  const x = ((((x0 + dir * t * speed * 2.2) % 2400) + 2400) % 2400) - 240;
  const y = 330 + lane * 110 + rnd(i, 3) * 60;
  return { x, y, dir, step: Math.sin((t * speed) / 3 + i) };
};
export const Concourse: React.FC<{ t: number; id?: string; n?: number; hi?: number[] }> = ({ t, id = 'conc', n = 46 }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#CFC6B6" />
    {Array.from({ length: 30 }).map((_, k) => (
      <path key={`v${k}`} d={`M ${-400 + k * 100} -400 V 1500`} stroke="#BDB3A2" strokeWidth={3} />
    ))}
    {Array.from({ length: 20 }).map((_, k) => (
      <path key={`h${k}`} d={`M -400 ${-400 + k * 100} H 2400`} stroke="#BDB3A2" strokeWidth={3} />
    ))}
    {/* platforms at the top edge, a train */}
    <rect x={-400} y={-400} width={2800} height={620} fill="#5A5E6A" />
    <rect x={-400} y={120} width={2800} height={100} fill="#E8D84A" opacity={0.85} />
    <rect x={-200 + ((t * 2) % 300)} y={-60} width={2200} height={150} rx={40} fill="#B8323A" />
    {Array.from({ length: 12 }).map((_, k) => (
      <rect key={`tw${k}`} x={-140 + k * 180 + ((t * 2) % 300)} y={-30} width={120} height={60} rx={8} fill="#2A2E38" />
    ))}
    {/* departure board */}
    <rect x={760} y={240} width={400} height={70} rx={6} fill="#1A1C22" />
    <text x={960} y={287} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#F2C14E">DEPARTURES</text>
    {/* walkers from above: a head and shoulders, a tiny shadow */}
    {Array.from({ length: n }).map((_, i) => {
      const w = concourseWalker(i, t);
      const col = ['#E8504A', '#4AA8E0', '#F2C14E', '#5BC08A', '#B07AD0', '#3A3E4A', '#E8E4D8', '#F28C3A'][i % 8];
      return (
        <g key={i} transform={`translate(${w.x} ${w.y})`}>
          <ellipse cx={8} cy={30} rx={26} ry={10} fill="#000" opacity={0.15} />
          <ellipse cx={0} cy={10} rx={26} ry={18} fill={col} />
          <circle cx={w.dir * 3} cy={0} r={14} fill="#26232F" />
          <rect x={-20 + w.step * 4} y={26} width={8} height={14} rx={4} fill="#26232F" />
          <rect x={12 - w.step * 4} y={26} width={8} height={14} rx={4} fill="#26232F" />
        </g>
      );
    })}
  </g>
);

/** The office: a dark room, one huge window onto the concourse below (drawn small and soft), a long table in front. */
export const Office: React.FC<{ t: number; id?: string; view?: boolean }> = ({ t, id = 'office', view = true }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#22263A" />
    <rect x={160} y={60} width={1600} height={640} fill="#141826" />
    <clipPath id={`${id}win`}>
      <rect x={180} y={80} width={1560} height={600} />
    </clipPath>
    {view ? (
      <g clipPath={`url(#${id}win)`}>
        <g transform="translate(180 80) scale(0.78)">
          <Concourse t={t} id={`${id}c`} n={60} />
        </g>
        <rect x={180} y={80} width={1560} height={600} fill="#8AB0D8" opacity={0.18} />
      </g>
    ) : null}
    {[700, 1220].map((x) => <rect key={x} x={x - 8} y={80} width={16} height={600} fill="#141826" />)}
    <path d="M 240 120 L 420 120 L 260 420 Z" fill="#FFFFFF" opacity={0.06} />
    <rect x={-400} y={OFFICE.feet - 150} width={2800} height={150} fill="#1C2030" />
    <rect x={-400} y={OFFICE.feet} width={2800} height={600} fill="#2E3246" />
    <Glow x={960} y={380} r={900} kind="cool" o={0.3} />
  </g>
);
/** The long table across the foreground: draw it after the characters to hide their legs. `paper` puts the contract on it. */
export const OfficeTable: React.FC<{ paper?: boolean; x?: number }> = ({ paper = false, x = 960 }) => (
  <g>
    <rect x={-400} y={OFFICE.table} width={2800} height={40} fill="#4A3A30" />
    <rect x={-400} y={OFFICE.table + 40} width={2800} height={500} fill="#2A2028" />
    <rect x={-400} y={OFFICE.table} width={2800} height={8} fill="#6A5240" />
    {paper ? (
      <g transform={`translate(${x} ${OFFICE.table + 4})`}>
        <path d="M -150 0 L 150 0 L 130 -26 L -130 -26 Z" fill="#F4F0E6" />
      </g>
    ) : null}
  </g>
);

// ---------------------------------------------------------------- the pizzeria
export const PIZZA = { feet: 830, table: 660 };
export const pizzaHip = (scale = 1) => PIZZA.feet - LEG_LEN * scale;

/** A warm little pizzeria: red-and-cream walls, a wood-fired oven glowing at the back, string lights, a checked floor. */
export const Pizzeria: React.FC<{ t: number; id?: string }> = ({ t, id = 'pizza' }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1300} fill="#F2E2C8" />
    <rect x={-400} y={480} width={2800} height={PIZZA.feet - 480} fill="#B8423A" />
    <rect x={-400} y={470} width={2800} height={16} fill="#8A2A24" />
    {/* the oven */}
    <path d="M 1180 470 Q 1180 180 1460 180 Q 1740 180 1740 470 Z" fill="#A8604A" />
    <path d="M 1300 470 Q 1300 330 1460 330 Q 1620 330 1620 470 Z" fill="#2A1410" />
    <path d="M 1340 470 Q 1400 400 1460 430 Q 1520 380 1580 470 Z" fill="#FF9A3A" opacity={0.75 + 0.2 * Math.sin(t / 4)} />
    <Glow x={1460} y={420} r={300} kind="warm" o={0.6 + 0.1 * Math.sin(t / 5)} />
    {/* menu board and pictures */}
    <rect x={160} y={140} width={420} height={260} rx={10} fill="#2A2420" />
    {['MARGHERITA', 'PEPPERONI', 'FUNGHI'].map((s, i) => (
      <text key={s} x={190} y={210 + i * 64} fontFamily={FONT.hand} fontWeight={700} fontSize={40} fill="#F4EEE2">{s}</text>
    ))}
    <rect x={700} y={180} width={180} height={140} fill="#E8C060" stroke="#6A4A30" strokeWidth={10} />
    {/* string lights */}
    <path d="M -400 60 Q 400 140 960 60 Q 1500 140 2400 60" stroke="#2A2420" strokeWidth={4} fill="none" />
    {Array.from({ length: 22 }).map((_, i) => {
      const x = -380 + i * 130;
      const y = 60 + 40 * Math.sin(((x + 400) / 1360) * Math.PI) * 1;
      return <circle key={i} cx={x} cy={y + 14} r={10} fill="#FFD88A" opacity={0.7 + 0.3 * Math.sin(t / 6 + i)} />;
    })}
    {/* checked floor */}
    <rect x={-400} y={PIZZA.feet} width={2800} height={600} fill="#EDE6D8" />
    {Array.from({ length: 28 }).map((_, c) =>
      Array.from({ length: 4 }).map((__, r) => ((c + r) % 2 ? <rect key={`${c}-${r}`} x={-400 + c * 100} y={PIZZA.feet + r * 70} width={100} height={70} fill="#2A2A30" /> : null)),
    )}
    <WallTexture rect={[-400, -400, 2800, 1230]} />
  </g>
);
/** A table in front with a pizza on it: draw after the characters. */
export const PizzaTable: React.FC<{ x?: number; w?: number; slices?: number }> = ({ x = 960, w = 900, slices = 8 }) => (
  <g>
    <rect x={x - w / 2} y={PIZZA.table} width={w} height={30} rx={8} fill="#E8E4D8" />
    {Array.from({ length: Math.floor(w / 60) }).map((_, i) => (
      <rect key={i} x={x - w / 2 + i * 60} y={PIZZA.table} width={30} height={30} fill="#C8423A" opacity={0.9} />
    ))}
    <rect x={x - w / 2 + 30} y={PIZZA.table + 30} width={w - 60} height={400} fill="#5A3A2A" />
    <ellipse cx={x} cy={PIZZA.table - 6} rx={170} ry={34} fill="#C8A060" />
    <ellipse cx={x} cy={PIZZA.table - 10} rx={150} ry={28} fill="#E8B84A" />
    {Array.from({ length: slices }).map((_, i) => (
      <circle key={i} cx={x + Math.cos(i * 0.8) * 90} cy={PIZZA.table - 10 + Math.sin(i * 0.8) * 16} r={14} fill="#B8323A" />
    ))}
  </g>
);
