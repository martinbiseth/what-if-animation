import React from 'react';
import {
  Hero, Look, LOOKS, Pose, ShotProps, Word, basePose, camT, clamp, kf, backOut, easeOut, easeIn, easeInOut, faceAt, idleBlink, FONT, Glow, rnd,
  UI, LEG_LEN, NightSky, Stars, Moon, Sun, Skyline, Haze, Schematic, SCH, SchLabel, DrawOn, Arrow, CountUp,
} from '../../engine';
import { YOU, ELLIE, MOM, MO, Soft, span, wordF, faceCU, bigWord, handAt } from '../electricity/common';
import { MilkyWay, StreetModern, STREETM, streetHip, LivingRoom, LIVING, sofaSit, Car, RoofNight, ROOF, roofHip } from '../electricity/sets';
import { Body, lie, PATEL, SCIENTIST, setShot, shk } from '../gravity/common';
import { PhoneFrame } from '../gta-physics/common';

// Shared by every chapter of "What if the Moon disappeared tonight?": the roof with the telescope (Moon on, Moon gone,
// the starless hole), the harbor whose tide drains, the night beach with the turtle nest, the boardwalk and the
// lifeguard tower, the reef, the press room, the observatory and the Moon's surface; schematic pieces for the tides,
// the tilt and the laser; the hatchlings.

export { YOU, ELLIE, MOM, MO, Soft, span, wordF, faceCU, bigWord, handAt, Body, lie, StreetModern, STREETM, streetHip, LivingRoom, LIVING, sofaSit, Car, PhoneFrame, setShot, shk, MilkyWay, ROOF, roofHip };
export const GRANDPA: Look = { ...PATEL, jacket: '#2E5A7A', jacketShade: '#24485F', accent: '#E9C46A', hat: 'cap', hatColor: '#E9DCC0' } as Look;
export const SCI = SCIENTIST;
export const SCI2: Look = { ...LOOKS.doctor, jacket: '#5A4A6A', jacketShade: '#483B55', hair: '#17131C' };
export const TEACHER: Look = { ...LOOKS.lady, hat: undefined, jacket: '#6A4A3A', jacketShade: '#553B2E' } as Look;
export const NEIGH: Look = { ...LOOKS.lady, hat: undefined, jacket: '#8A6A9A', jacketShade: '#6E557B' } as Look;
export const NEIGH2: Look = { ...LOOKS.worker, hat: undefined, jacket: '#5A6A4A', jacketShade: '#48553B' } as Look;
export type SetFC = React.FC<{ t: number; id?: string }>;

export const MOONPOS = { x: 1420, y: 250, r: 120 };

/** The starless hole where the Moon was: a disc of the sky's own darkness, a faint rim, and no stars inside. */
export const Hole: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 1 }) => (
  <g opacity={o}>
    <circle cx={x} cy={y} r={r * 1.5} fill="#02020A" opacity={0.35} />
    <circle cx={x} cy={y} r={r} fill="#010106" />
    <circle cx={x} cy={y} r={r} fill="none" stroke="#3A3A6A" strokeWidth={2} opacity={0.35} />
  </g>
);

/** Night sky over the city from our roof: the full Moon (`moon` 0..1), or the hole (`hole`), stars, the city lit. */
export const SkyMoon: React.FC<{ t: number; id?: string; moon?: number; hole?: number; flash?: number; stars?: number; mx?: number; my?: number; mr?: number }> = ({
  t, id = 'skm', moon = 1, hole = 0, flash = 0, stars = 0, mx = MOONPOS.x, my = MOONPOS.y, mr = MOONPOS.r,
}) => (
  <g>
    <NightSky id={`${id}n`} horizonY={760} />
    <rect x={-400} y={-400} width={2800} height={1300} fill="#04040E" opacity={0.3 * (1 - moon)} />
    <Stars seed={41} x0={-300} y0={-300} w={2500} h={1000} t={t} n={Math.round(60 + 160 * Math.max(stars, 1 - moon))} o={0.55 + 0.4 * (1 - moon)} />
    {moon > 0 ? (
      <g opacity={moon}>
        <Glow x={mx} y={my} r={mr * 4} kind="cool" o={0.45} />
        <Moon x={mx} y={my} r={mr} bloom={1} />
      </g>
    ) : null}
    {hole > 0 ? <Hole x={mx} y={my} r={mr} o={hole} /> : null}
    {flash > 0 ? <circle cx={mx} cy={my} r={mr * (1 + flash * 1.5)} fill="#F6F2FF" opacity={flash * 0.8} /> : null}
  </g>
);

/** Our roof at night: the sky above (Moon / gone), the lit city, a parapet, the chimney stack. Feet on ROOF.feet. */
export const RoofMoon: React.FC<{ t: number; id?: string; moon?: number; hole?: number; flash?: number; power?: number }> = ({ t, id = 'rfm', moon = 1, hole = 0, flash = 0, power = 1 }) => (
  <g>
    <g>
      <RoofNight t={t} id={id} power={power} milky={0} />
    </g>
    <g>
      <rect x={-400} y={-400} width={2800} height={1000} fill="#05050F" opacity={0} />
      {moon > 0 ? (
        <g opacity={moon}>
          <Glow x={MOONPOS.x} y={MOONPOS.y} r={MOONPOS.r * 4} kind="cool" o={0.45} />
          <Moon x={MOONPOS.x} y={MOONPOS.y} r={MOONPOS.r} bloom={1} />
        </g>
      ) : null}
      {hole > 0 ? <Hole x={MOONPOS.x} y={MOONPOS.y} r={MOONPOS.r} o={hole} /> : null}
      {flash > 0 ? <circle cx={MOONPOS.x} cy={MOONPOS.y} r={MOONPOS.r * (1 + flash * 1.5)} fill="#F6F2FF" opacity={flash * 0.8} /> : null}
      {moon > 0 ? <rect x={-400} y={ROOF.feet - 40} width={2800} height={6} fill="#C8D4FF" opacity={0.25 * moon} /> : null}
    </g>
  </g>
);

/** A telescope on a tripod, the tube at `ang` degrees above the horizon (pointing right). */
export const Telescope: React.FC<{ x: number; y: number; s?: number; ang?: number; flip?: boolean }> = ({ x, y, s = 1, ang = 30, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M 0 -150 L -60 0 M 0 -150 L 60 0 M 0 -150 L 8 0" stroke="#2A2632" strokeWidth={8} strokeLinecap="round" />
    <g transform={`translate(0 -160) rotate(${-ang})`}>
      <rect x={-70} y={-20} width={190} height={40} rx={8} fill="#D9DCE6" stroke="#14121C" strokeWidth={5} />
      <rect x={110} y={-26} width={30} height={52} rx={6} fill="#B8BCC8" stroke="#14121C" strokeWidth={5} />
      <rect x={-90} y={-12} width={24} height={24} rx={4} fill="#3A3646" stroke="#14121C" strokeWidth={4} />
      <circle cx={0} cy={0} r={10} fill="#3A3646" />
    </g>
  </g>
);

/** A sketchpad with the Moon half drawn in pencil and "MOON PROJECT - ELLIE" on top. */
export const Sketchpad: React.FC<{ x: number; y: number; s?: number; rot?: number; drawn?: number; erase?: number }> = ({ x, y, s = 1, rot = -6, drawn = 0.5, erase = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-260} y={-190} width={520} height={380} rx={10} fill="#F4EEDC" stroke="#1A1620" strokeWidth={6} />
    {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={-220 + i * 55} cy={-190} r={9} fill="#8A8A9A" />)}
    <text x={0} y={-130} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#3A3646" letterSpacing={4}>MOON PROJECT · ELLIE</text>
    <circle cx={0} cy={40} r={120} fill="none" stroke="#6A6A7A" strokeWidth={5} strokeDasharray={754} strokeDashoffset={754 * (1 - drawn)} />
    {drawn > 0.6 ? [[-40, 10, 26], [30, 70, 18], [45, -30, 14]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="#8A8A9A" strokeWidth={4} />) : null}
  </g>
);

/** A pencil. */
export const Pencil: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-90} y={-10} width={160} height={20} fill="#F2C440" stroke="#1A1620" strokeWidth={4} />
    <path d="M 70 -10 L 100 0 L 70 10 Z" fill="#E9D2A8" stroke="#1A1620" strokeWidth={4} />
    <path d="M 92 -3 L 100 0 L 92 3 Z" fill="#2A2632" />
    <rect x={-104} y={-10} width={16} height={20} fill="#E87A8A" stroke="#1A1620" strokeWidth={4} />
  </g>
);

// ---------------------------------------------------------------- the harbor
/** The harbor by day, side on: a dock on posts on the left, the sea on the right at `tide` (1 = high, 0 = drained
 * to the mud), grandpa's boat floating or lying tilted on the mud. Tide marks on the posts. */
export const HARBOR = { dock: 560, high: 640, low: 900 };
export const Harbor: React.FC<{ t: number; id?: string; tide?: number; boat?: boolean; dusk?: number; dark?: number }> = ({ t, id = 'hb', tide = 1, boat = true, dusk = 0, dark = 0 }) => {
  const wy = tide < 0.3 ? HARBOR.low + 30 : HARBOR.low - (HARBOR.low - HARBOR.high) * tide + Math.sin(t / 18) * 4 * tide;
  const sx = tide < 0.3 ? 1500 + (0.3 - tide) * 1000 : -400;
  const bob = tide > 0.3 ? Math.sin(t / 16) * 5 : 0;
  const boatY = tide < 0.3 ? HARBOR.low + 10 : wy + bob;
  const tilt = tide > 0.3 ? Math.sin(t / 20) * 2 : -9;
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="-300" x2="0" y2="620" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={dusk ? '#2A2050' : '#6AA6DA'} />
          <stop offset="80%" stopColor={dusk ? '#E88A6A' : '#B8DAEE'} />
          <stop offset="100%" stopColor={dusk ? '#F6C08A' : '#E8F2F4'} />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={2800} height={1100} fill={`url(#${id}sky)`} />
      {[[300, 150, 150], [1250, 110, 190], [1750, 220, 120]].map(([cx, cy, rx], i) => (
        <g key={i} transform={`translate(${(t * 0.25 * (i % 2 ? 1 : -1)) % 60} 0)`} opacity={0.9}>
          <ellipse cx={cx} cy={cy} rx={rx} ry={rx * 0.28} fill="#FFFFFF" />
          <ellipse cx={cx + rx * 0.4} cy={cy - rx * 0.12} rx={rx * 0.5} ry={rx * 0.3} fill="#FFFFFF" />
        </g>
      ))}
      {/* far headland */}
      <path d="M 900 600 Q 1300 470 1700 560 Q 2000 600 2400 590 L 2400 640 L 900 640 Z" fill="#6A8A7A" />
      <path d="M -400 610 Q 100 540 500 600 L 500 640 L -400 640 Z" fill="#7A9A8A" />
      {/* far flats out to the horizon, then the sea bed (mud) */}
      <rect x={-400} y={630} width={2800} height={400} fill="#7A6A56" />
      <rect x={-400} y={628} width={2800} height={14} fill="#5E8AA6" opacity={0.8} />
      <path d={`M -400 ${HARBOR.low + 20} Q 600 ${HARBOR.low - 20} 1400 ${HARBOR.low + 10} T 2400 ${HARBOR.low} L 2400 1500 L -400 1500 Z`} fill="#6A5A48" />
      <path d={`M -400 ${HARBOR.low + 40} Q 800 ${HARBOR.low + 10} 2400 ${HARBOR.low + 30}`} stroke="#4E4236" strokeWidth={6} fill="none" />
      {Array.from({ length: 14 }).map((_, i) => <ellipse key={i} cx={-200 + i * 190 + rnd(3, i) * 60} cy={HARBOR.low + 60 + rnd(4, i) * 120} rx={30 + rnd(5, i) * 30} ry={8} fill="#5A4C3C" />)}
      {/* the sea: at low tide it pulls back to the far right and drops below the mud line */}
      <rect x={sx} y={wy} width={2800} height={1500} fill="#3E7AA6" opacity={0.92} />
      <rect x={sx} y={wy} width={2800} height={10} fill="#A8D4EE" opacity={0.8} />
      {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${Math.max(sx + 20, -300 + i * 280 + ((t * 2) % 280))} ${wy + 40 + (i % 3) * 50} q 30 -10 60 0`} stroke="#A8D4EE" strokeWidth={4} fill="none" opacity={0.6} />)}
      {tide < 0.5 ? Array.from({ length: 8 }).map((_, i) => <ellipse key={`p${i}`} cx={-200 + i * 230 + rnd(9, i) * 80} cy={HARBOR.low + 40 + rnd(8, i) * 80} rx={60} ry={10} fill="#7AA6C6" opacity={0.6} />) : null}
      {/* the dock: deck on posts, tide marks */}
      {[-300, -100, 100, 300, 500].map((x, i) => (
        <g key={i}>
          <rect x={x} y={HARBOR.dock} width={30} height={HARBOR.low - HARBOR.dock + 60} fill="#5A4030" stroke="#2A1E16" strokeWidth={4} />
          <rect x={x} y={HARBOR.high} width={30} height={(HARBOR.low - HARBOR.high) * 0.6} fill="#2E4A2E" opacity={0.6} />
        </g>
      ))}
      <rect x={-400} y={HARBOR.dock - 30} width={960} height={34} fill="#8A6A4A" stroke="#2A1E16" strokeWidth={5} />
      {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${-400 + i * 60} ${HARBOR.dock - 30} L ${-400 + i * 60} ${HARBOR.dock + 4}`} stroke="#5A4030" strokeWidth={3} />)}
      <rect x={480} y={HARBOR.dock - 70} width={30} height={40} fill="#3A3036" />
      {/* the boat */}
      {boat ? (
        <g transform={`translate(1060 ${boatY}) rotate(${tilt})`}>
          <path d="M -260 -70 L 260 -70 L 200 30 L -210 30 Z" fill="#E9E2D2" stroke="#1A1620" strokeWidth={6} strokeLinejoin="round" />
          <rect x={-260} y={-70} width={520} height={20} fill="#C8452A" />
          <rect x={-100} y={-200} width={170} height={130} fill="#F4EEDC" stroke="#1A1620" strokeWidth={6} />
          <rect x={-80} y={-180} width={60} height={50} fill="#9AC8E8" stroke="#1A1620" strokeWidth={4} />
          <rect x={0} y={-180} width={50} height={50} fill="#9AC8E8" stroke="#1A1620" strokeWidth={4} />
          <path d="M 120 -70 L 120 -260" stroke="#1A1620" strokeWidth={8} />
          <text x={-170} y={8} fontFamily={FONT.ui} fontSize={34} fill="#2E5A7A">MARGIT</text>
        </g>
      ) : null}
      {dark > 0 ? <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={dark} /> : null}
    </g>
  );
};
export const dockHip = (s = 1) => HARBOR.dock - 30 - LEG_LEN * s;

// ---------------------------------------------------------------- the beach
/** The beach at night (or dusk), looking along the shore: the boardwalk with its floodlights, lanterns and crowd on the
 * left, the sand in front, the nest with its little orange fence, the lifeguard tower, the sea on the right. `lights`
 * 0..1 turns the boardwalk off (`sweep` from the right), `moon` puts a moon over the sea and glitter on the water. */
export const BEACH = { horizon: 560, sand: 640, nest: { x: 900, y: 850 }, tower: { x: 1260, deck: 520 }, water: 2300 };
export const Beach: React.FC<{ t: number; id?: string; lights?: number; sweep?: number; moon?: number; dusk?: number; crowd?: number; water?: number; vigil?: boolean; seaGlow?: number; stars?: number }> = ({
  t, id = 'bch', lights = 1, sweep, moon = 0, dusk = 0, crowd = 1, water = 0, vigil = true, seaGlow = 0, stars = 0,
}) => {
  const B = BEACH;
  const on = (x: number) => (sweep === undefined ? lights : (x + 400) / 2800 < 1 - sweep ? lights : 0);
  const shoreX = B.water - 500 * water;
  const SW = 1200;
  return (
    <g>
      {dusk > 0 ? (
        <g>
          <defs>
            <linearGradient id={`${id}d`} x1="0" y1="-300" x2="0" y2={B.horizon} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#24204A" />
              <stop offset="70%" stopColor="#B85A7A" />
              <stop offset="100%" stopColor="#F2A06A" />
            </linearGradient>
          </defs>
          <rect x={-400} y={-400} width={2800} height={1000} fill={`url(#${id}d)`} />
          <circle cx={1700} cy={B.horizon - 30} r={80} fill="#FFD08A" />
        </g>
      ) : (
        <g>
          <NightSky id={`${id}n`} horizonY={B.horizon} />
          <rect x={-400} y={-400} width={2800} height={1000} fill="#02020A" opacity={moon ? 0 : 0.35} />
          <Stars seed={57} x0={-300} y0={-300} w={2500} h={850} t={t} n={Math.round(120 + 120 * stars)} o={0.7 + 0.3 * stars} />
          {moon > 0 ? <g opacity={moon}><Glow x={1650} y={220} r={420} kind="cool" o={0.4} /><Moon x={1650} y={220} r={70} /></g> : null}
        </g>
      )}
      {/* the sea, right of the shore line */}
      <path d={`M ${shoreX - SW} ${B.horizon} L 2400 ${B.horizon} L 2400 1500 L ${shoreX} 1500 Q ${shoreX - SW * 0.47} 900 ${shoreX - SW} ${B.horizon} Z`} fill={dusk ? '#3A5A8A' : '#0C1426'} />
      {seaGlow > 0 ? (
        <g opacity={seaGlow}>
          <defs>
            <linearGradient id={`${id}sg`} x1="0" y1={B.horizon - 260} x2="0" y2={B.horizon + 200} gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#6A86C8" stopOpacity={0} />
              <stop offset="60%" stopColor="#8AA4E0" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#8AA4E0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <rect x={shoreX - SW} y={B.horizon - 260} width={3400} height={460} fill={`url(#${id}sg)`} />
          {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={shoreX - SW + 200 + rnd(63, i) * 1400} y={B.horizon + 20 + i * 36} width={40 + rnd(64, i) * 60} height={4} fill="#B8C8F0" opacity={0.25 + 0.25 * Math.sin(t / 6 + i)} />)}
        </g>
      ) : null}
      {moon > 0 ? Array.from({ length: 14 }).map((_, i) => <rect key={i} x={1640 + rnd(61, i) * 180 + Math.sin(t / 8 + i) * 10} y={B.horizon + 20 + i * 40} width={60 + rnd(62, i) * 80} height={6} fill="#DDE6FF" opacity={moon * (0.4 + 0.4 * Math.sin(t / 5 + i))} />) : null}
      {Array.from({ length: 6 }).map((_, i) => {
        const k = ((t / 60 + i / 6) % 1);
        const y = B.horizon + 60 + i * 140;
        const x = shoreX - SW + (y - B.horizon) * 0.47 + 40 * Math.sin(t / 20 + i);
        return <path key={i} d={`M ${x} ${y} q 60 -16 140 0`} stroke="#9AB4E0" strokeWidth={5} fill="none" opacity={(dusk ? 0.8 : 0.35) * (0.5 + 0.5 * Math.sin(k * 6.28))} />;
      })}
      {/* foam along the shore */}
      <path d={`M ${shoreX - SW} ${B.horizon + 4} Q ${shoreX - SW * 0.47} ${900 + Math.sin(t / 14) * 10} ${shoreX + 10 * Math.sin(t / 12)} 1500`} stroke="#DDE6FF" strokeWidth={8} fill="none" opacity={dusk ? 0.9 : 0.5} />
      {/* the sand */}
      <path d={`M -400 ${B.sand - 40} L ${shoreX - SW} ${B.horizon} Q ${shoreX - SW * 0.47} 900 ${shoreX} 1500 L -400 1500 Z`} fill={dusk ? '#D8B488' : '#4A4250'} />
      {Array.from({ length: 30 }).map((_, i) => <ellipse key={i} cx={-300 + rnd(71, i) * 1900} cy={680 + rnd(72, i) * 380} rx={14 + rnd(73, i) * 20} ry={3} fill={dusk ? '#B89468' : '#3A3440'} />)}
      {/* the boardwalk (left), its lights and the vigil crowd */}
      <rect x={-400} y={B.sand - 210} width={1050} height={30} fill="#5A4636" />
      <rect x={-400} y={B.sand - 180} width={1050} height={140} fill="#3A2E2A" />
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-380 + i * 90} y={B.sand - 180} width={14} height={150} fill="#2A201C" />)}
      {[-260, 0, 260, 520].map((x, i) => {
        const l = on(x);
        return (
          <g key={i}>
            <path d={`M ${x} ${B.sand - 210} L ${x} ${B.sand - 470}`} stroke="#2A2632" strokeWidth={10} />
            <rect x={x - 40} y={B.sand - 500} width={80} height={36} rx={6} fill={l > 0.5 ? '#FFF2C8' : '#3A3646'} stroke="#14121C" strokeWidth={4} />
            {l > 0.5 ? (
              <g>
                <Glow x={x} y={B.sand - 480} r={260} kind="warm" o={0.85 * l} />
                <path d={`M ${x - 40} ${B.sand - 470} L ${x - 260} ${B.sand + 260} L ${x + 380} ${B.sand + 260} L ${x + 40} ${B.sand - 470} Z`} fill="#FFE8A8" opacity={0.09 * l} />
              </g>
            ) : null}
          </g>
        );
      })}
      {crowd > 0
        ? Array.from({ length: 16 }).map((_, i) => {
            const x = -360 + i * 64 + rnd(81, i) * 20;
            const h = 90 + rnd(82, i) * 30;
            const lit = on(x);
            return (
              <g key={i} opacity={crowd}>
                <circle cx={x} cy={B.sand - 210 - h} r={18} fill="#14121C" />
                <path d={`M ${x - 22} ${B.sand - 210} L ${x - 16} ${B.sand - 200 - h + 16} L ${x + 16} ${B.sand - 200 - h + 16} L ${x + 22} ${B.sand - 210} Z`} fill="#14121C" />
                {lit > 0.5 && i % 2 === 0 ? <g><rect x={x + 10} y={B.sand - 200 - h + 30} width={12} height={20} rx={3} fill="#CFE6FF" /><Glow x={x + 16} y={B.sand - 200 - h + 40} r={40} kind="cool" o={0.7} /></g> : null}
                {lit > 0.5 && i % 3 === 1 ? <g><circle cx={x - 14} cy={B.sand - 260 - h} r={14} fill="#FFB85A" /><Glow x={x - 14} y={B.sand - 260 - h} r={50} kind="warm" o={0.8} /></g> : null}
              </g>
            );
          })
        : null}
      {vigil ? (
        <g opacity={0.4 + 0.6 * on(200)}>
          <rect x={60} y={B.sand - 600} width={420} height={70} rx={8} fill="#2E2A46" stroke="#14121C" strokeWidth={4} />
          <text x={270} y={B.sand - 552} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={on(200) > 0.5 ? '#FFD23A' : '#6A6680'}>MOON VIGIL</text>
        </g>
      ) : null}
      {/* the lifeguard tower */}
      <g>
        <path d={`M ${B.tower.x - 70} ${B.sand + 210} L ${B.tower.x - 40} ${B.tower.deck} M ${B.tower.x + 70} ${B.sand + 210} L ${B.tower.x + 40} ${B.tower.deck}`} stroke="#6A5A4A" strokeWidth={14} />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${B.tower.x + 74} ${B.sand + 190 - i * 70} L ${B.tower.x + 140} ${B.sand + 200 - i * 70}`} stroke="#6A5A4A" strokeWidth={8} />)}
        <rect x={B.tower.x - 100} y={B.tower.deck - 20} width={200} height={24} fill="#8A6A4A" stroke="#1A1410" strokeWidth={4} />
        <rect x={B.tower.x - 80} y={B.tower.deck - 150} width={160} height={130} fill="#C8452A" opacity={0.85} stroke="#1A1410" strokeWidth={4} />
        <path d={`M ${B.tower.x - 100} ${B.tower.deck - 150} L ${B.tower.x} ${B.tower.deck - 200} L ${B.tower.x + 100} ${B.tower.deck - 150} Z`} fill="#E9E2D2" stroke="#1A1410" strokeWidth={4} />
      </g>
      {/* the nest: a low mound inside a little orange fence */}
      <Nest x={B.nest.x} y={B.nest.y} />
      {/* the boardwalk's light falling on the sand */}
      {lights > 0 ? <ellipse cx={200} cy={B.sand + 40} rx={900} ry={240} fill="#FFD98A" opacity={0.12 * (sweep === undefined ? lights : lights * (1 - sweep))} /> : null}
      {dusk ? null : <rect x={-400} y={-400} width={2800} height={1900} fill="#05051A" opacity={0.18} />}
    </g>
  );
};

/** The nest: a sandy mound with stakes and an orange fence round it; `move` makes the sand wobble. */
export const Nest: React.FC<{ x: number; y: number; s?: number; move?: number; t?: number; open?: number }> = ({ x, y, s = 1, move = 0, t = 0, open = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={150} ry={36} fill="#3A3240" />
    <ellipse cx={0} cy={0} rx={110 + Math.sin(t * 1.3) * 6 * move} ry={30 + Math.cos(t * 1.7) * 4 * move} fill="#5A5060" />
    {open > 0 ? <ellipse cx={0} cy={-2} rx={50 * open} ry={14 * open} fill="#1E1A24" /> : null}
    {[-170, -60, 60, 170].map((dx, i) => <path key={i} d={`M ${dx} ${30 - Math.abs(dx) * 0.05} L ${dx} ${-60 - Math.abs(dx) * 0.05}`} stroke="#8A6A4A" strokeWidth={8} />)}
    <path d="M -170 -48 L -60 -55 L 60 -55 L 170 -48" stroke="#FF7A2A" strokeWidth={7} fill="none" />
    <path d="M -170 -20 L -60 -27 L 60 -27 L 170 -20" stroke="#FF7A2A" strokeWidth={7} fill="none" />
  </g>
);

/** A baby sea turtle, top-down-ish (drawn side-on, small): `dir` 1 crawls right (to the sea), -1 left; `k` flipper phase. */
export const Hatchling: React.FC<{ x: number; y: number; s?: number; dir?: number; k?: number; o?: number }> = ({ x, y, s = 1, dir = 1, k = 0, o = 1 }) => {
  const f = Math.sin(k) * 14;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * (dir < 0 ? -1 : 1)} ${s})`} opacity={o}>
      <path d={`M -8 4 L -30 ${16 + f * 0.6}`} stroke="#2A3A30" strokeWidth={7} strokeLinecap="round" />
      <path d={`M 14 4 L 34 ${18 - f * 0.6}`} stroke="#2A3A30" strokeWidth={7} strokeLinecap="round" />
      <ellipse cx={0} cy={0} rx={26} ry={13} fill="#3E5A48" stroke="#14121C" strokeWidth={3} />
      <path d="M -12 -6 L -4 6 M 4 -8 L 10 6" stroke="#2A3A30" strokeWidth={2} />
      <circle cx={30} cy={-2} r={9} fill="#4E6A58" stroke="#14121C" strokeWidth={3} />
      <circle cx={33} cy={-4} r={2} fill="#F6EFE3" />
    </g>
  );
};

/** A crowd of hatchlings: each one at a seeded start near (x, y), crawling with heading `dir(i)` for `go` px. */
export const Hatchlings: React.FC<{ n: number; x: number; y: number; spread?: number; t: number; go: (i: number) => [number, number]; s?: number; seed?: number; o?: number }> = ({ n, x, y, spread = 120, t, go, s = 1, seed = 1, o = 1 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const [dx, dy] = go(i);
      const x0 = x + (rnd(seed, i) - 0.5) * spread * 2;
      const y0 = y + (rnd(seed + 1, i) - 0.5) * spread * 0.6;
      return <Hatchling key={i} x={x0 + dx} y={y0 + dy} s={s * (0.8 + rnd(seed + 2, i) * 0.4)} dir={dx >= 0 ? 1 : -1} k={t * 0.9 + i * 1.7} o={o} />;
    })}
  </g>
);

// ---------------------------------------------------------------- a backyard at night (telescope, trampoline)
export const YARDN = { feet: 860 };
export const yardHip = (s = 1) => YARDN.feet - LEG_LEN * s;
export const YardNight: React.FC<{ t: number; id?: string; milky?: number; tramp?: boolean; house?: boolean }> = ({ t, id = 'ydn', milky = 0.8, tramp = true, house = true }) => (
  <g>
    <NightSky id={`${id}s`} horizonY={700} />
    <rect x={-400} y={-400} width={2800} height={1100} fill="#03030C" opacity={0.3} />
    <Stars seed={63} x0={-300} y0={-300} w={2500} h={1000} t={t} n={240} o={0.9} />
    <MilkyWay x0={-300} y0={760} x1={2200} y1={-200} o={milky} t={t} w={320} />
    <Skyline y={740} seed={19} color="#0E0E1E" h={110} />
    {/* fence */}
    <rect x={-400} y={680} width={2800} height={130} fill="#2A2430" />
    {Array.from({ length: 40 }).map((_, i) => <path key={i} d={`M ${-400 + i * 70} 680 L ${-400 + i * 70} 810`} stroke="#1A1620" strokeWidth={4} />)}
    <rect x={-400} y={YARDN.feet - 40} width={2800} height={700} fill="#1E2A24" />
    <rect x={-400} y={YARDN.feet - 40} width={2800} height={8} fill="#2E3E34" />
    {house ? (
      <g>
        <rect x={-400} y={300} width={560} height={560} fill="#2E2A3A" stroke="#14121C" strokeWidth={6} />
        <rect x={-200} y={440} width={180} height={150} fill="#FFC27A" opacity={0.75} stroke="#14121C" strokeWidth={6} />
        <Glow x={-110} y={515} r={240} kind="warm" o={0.4} />
        <rect x={40} y={620} width={110} height={240} fill="#3A2A2A" stroke="#14121C" strokeWidth={6} />
      </g>
    ) : null}
    {tramp ? (
      <g>
        <ellipse cx={1380} cy={760} rx={300} ry={60} fill="#14121C" stroke="#3A4A6A" strokeWidth={10} />
        {[-240, -80, 80, 240].map((dx, i) => <path key={i} d={`M ${1380 + dx} ${770} L ${1380 + dx * 1.04} ${YARDN.feet - 30}`} stroke="#3A4A6A" strokeWidth={10} />)}
      </g>
    ) : null}
  </g>
);

// ---------------------------------------------------------------- reef
export const Reef: React.FC<{ t: number; id?: string; spawn?: number; night?: number }> = ({ t, id = 'reef', spawn = 0, night = 1 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}w`} x1="0" y1="-300" x2="0" y2="1100" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor={night ? '#0E2A4A' : '#3E9ACA'} />
        <stop offset="100%" stopColor={night ? '#050E1E' : '#0E3A5A'} />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2800} height={1900} fill={`url(#${id}w)`} />
    {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${200 + i * 300} -300 L ${120 + i * 300 + Math.sin(t / 30 + i) * 40} 900`} stroke="#6AB4E8" strokeWidth={60} opacity={0.05} />)}
    <path d="M -400 860 Q 300 800 900 850 T 2400 830 L 2400 1500 L -400 1500 Z" fill="#2A2A3A" />
    {[[100, 820, '#E8708A'], [380, 800, '#F2A040'], [700, 840, '#C86AE0'], [1000, 810, '#F2D25A'], [1300, 830, '#6AE0B4'], [1620, 805, '#E8708A'], [1880, 830, '#F2A040']].map(([x, y, c], i) => (
      <g key={i}>
        {Array.from({ length: 5 }).map((_, k) => {
          const a = -70 + k * 35 + Math.sin(t / 24 + i + k) * 4;
          const len = 90 + rnd(91 + i, k) * 70;
          const ex = (x as number) + Math.sin((a * Math.PI) / 180) * len;
          const ey = (y as number) - Math.cos((a * Math.PI) / 180) * len;
          return (
            <g key={k}>
              <path d={`M ${x} ${y} L ${ex} ${ey}`} stroke={c as string} strokeWidth={22} strokeLinecap="round" />
              <circle cx={ex} cy={ey} r={16} fill={c as string} />
            </g>
          );
        })}
        <ellipse cx={x as number} cy={(y as number) + 20} rx={80} ry={30} fill={c as string} opacity={0.7} />
      </g>
    ))}
    {spawn > 0
      ? Array.from({ length: 140 }).map((_, i) => {
          const x = -200 + rnd(101, i) * 2300;
          const y0 = 820 - rnd(102, i) * 60;
          const rise = (spawn * 900 + rnd(103, i) * 300) % 1200;
          return <circle key={i} cx={x + Math.sin(t / 10 + i) * 12} cy={y0 - rise * spawn} r={5 + rnd(104, i) * 5} fill="#FFB4C8" opacity={0.85 * clamp(spawn * 3)} />;
        })
      : null}
  </g>
);

// ---------------------------------------------------------------- rocky shore and a tide pool
export const Shore: React.FC<{ t: number; id?: string; tide?: number }> = ({ t, id = 'shr', tide = 1 }) => (
  <g>
    <defs>
      <linearGradient id={`${id}s`} x1="0" y1="-300" x2="0" y2="560" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#6AA6DA" />
        <stop offset="100%" stopColor="#E0F0F4" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2800} height={1000} fill={`url(#${id}s)`} />
    <rect x={-400} y={540} width={2800} height={1000} fill="#3E7AA6" />
    <Sun x={300} y={150} r={70} t={t} rays={false} />
    {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${-300 + i * 340 + ((t * 1.5) % 340)} ${580 + (i % 3) * 30} q 40 -12 80 0`} stroke="#A8D4EE" strokeWidth={4} fill="none" />)}
    <path d="M -400 760 Q 200 640 600 720 Q 900 780 1200 700 Q 1600 620 2400 740 L 2400 1500 L -400 1500 Z" fill="#6A6058" />
    {[[200, 760, 160], [700, 800, 220], [1250, 740, 180], [1750, 790, 200]].map(([x, y, r], i) => <ellipse key={i} cx={x} cy={y} rx={r} ry={r * 0.45} fill="#7A7068" stroke="#3A322E" strokeWidth={6} />)}
    {[[450, 900, 160], [1050, 920, 220], [1550, 900, 150]].map(([x, y, r], i) => (
      <g key={i}>
        <ellipse cx={x} cy={y} rx={r} ry={r * 0.32} fill="#3A322E" />
        <ellipse cx={x} cy={y - 4} rx={r * 0.9 * (0.5 + 0.5 * tide)} ry={r * 0.26 * (0.5 + 0.5 * tide)} fill="#4E8AB0" />
      </g>
    ))}
  </g>
);

/** A tide pool close up: water level `level` 1 full .. 0 dry, a crab (sweating when dry), a sea star, snails, mussels. */
export const TidePool: React.FC<{ t: number; level?: number }> = ({ t, level = 1 }) => {
  const wy = 520 + (1 - level) * 380;
  const sweat = clamp((0.5 - level) * 3);
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#7A7068" />
      {Array.from({ length: 30 }).map((_, i) => <ellipse key={i} cx={rnd(111, i) * 1920} cy={rnd(112, i) * 1080} rx={30 + rnd(113, i) * 60} ry={14 + rnd(114, i) * 20} fill="#6A6058" />)}
      <ellipse cx={960} cy={720} rx={860} ry={380} fill="#3A322E" />
      <path d={`M 100 ${wy} Q 960 ${wy - 10} 1820 ${wy} L 1820 1200 L 100 1200 Z`} fill="#4E8AB0" opacity={0.75 * clamp(level * 2)} />
      <rect x={100} y={wy} width={1720} height={6} fill="#C8E8F8" opacity={0.6 * clamp(level * 2)} />
      {/* mussels */}
      {Array.from({ length: 9 }).map((_, i) => <ellipse key={i} cx={260 + i * 40} cy={760 + (i % 2) * 20} rx={24} ry={12} fill="#1E2236" stroke="#0E101A" strokeWidth={3} transform={`rotate(${-20 + i * 6} ${260 + i * 40} ${760 + (i % 2) * 20})`} />)}
      {/* sea star */}
      <g transform={`translate(1380 820) rotate(${t * 0.2})`}>
        {Array.from({ length: 5 }).map((_, i) => <path key={i} d="M 0 0 L -22 -10 L 0 -96 L 22 -10 Z" fill="#E8783A" stroke="#7A3010" strokeWidth={4} transform={`rotate(${i * 72})`} />)}
        <circle r={26} fill="#E8783A" />
      </g>
      {/* snails */}
      {[[700, 900], [820, 940], [1580, 680]].map(([x, y], i) => (
        <g key={i}><path d={`M ${x - 26} ${y} L ${x + 30} ${y}`} stroke="#B89A7A" strokeWidth={10} strokeLinecap="round" /><circle cx={x} cy={y - 16} r={22} fill="#C8A86A" stroke="#5A4630" strokeWidth={4} /><path d={`M ${x - 8} ${y - 16} a 8 8 0 1 1 8 8`} stroke="#5A4630" strokeWidth={3} fill="none" /></g>
      ))}
      {/* the crab */}
      <g transform={`translate(1000 ${700 + Math.sin(t / 6) * 6})`}>
        {[-1, 1].map((s) => (
          <g key={s}>
            {[0, 1, 2].map((k) => <path key={k} d={`M ${s * 60} ${10 + k * 12} L ${s * (110 + k * 6)} ${40 + k * 18}`} stroke="#B83A2A" strokeWidth={9} strokeLinecap="round" />)}
            <path d={`M ${s * 50} -20 L ${s * 100} -70`} stroke="#B83A2A" strokeWidth={12} strokeLinecap="round" />
            <ellipse cx={s * 112} cy={-86 + Math.sin(t / 5 + s) * 6} rx={30} ry={22} fill="#D8483A" stroke="#6A1A10" strokeWidth={4} />
          </g>
        ))}
        <ellipse cx={0} cy={0} rx={80} ry={50} fill="#D8483A" stroke="#6A1A10" strokeWidth={5} />
        <path d="M -20 -48 L -24 -78 M 20 -48 L 24 -78" stroke="#6A1A10" strokeWidth={5} />
        <circle cx={-24} cy={-82} r={10} fill="#F6EFE3" stroke="#14121C" strokeWidth={3} />
        <circle cx={24} cy={-82} r={10} fill="#F6EFE3" stroke="#14121C" strokeWidth={3} />
        <circle cx={-24 + Math.sin(t / 9) * 3} cy={-82} r={4} fill="#14121C" />
        <circle cx={24 + Math.sin(t / 9) * 3} cy={-82} r={4} fill="#14121C" />
        {sweat > 0 ? [[-60, -40], [60, -30], [0, -64]].map(([dx, dy], i) => <path key={i} d={`M ${dx} ${dy + ((t * 2 + i * 10) % 30)} q 6 10 0 16 q -6 -6 0 -16`} fill="#BFE6FF" opacity={sweat} />) : null}
      </g>
      {level < 0.4 ? <rect x={-400} y={-400} width={2800} height={1900} fill="#FFB85A" opacity={(0.4 - level) * 0.4} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- the press room
export const PressRoom: React.FC<{ t: number; id?: string; screen?: (t: number) => React.ReactNode }> = ({ t, id = 'pr', screen }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#1E2440" />
    {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-300 + i * 280} y={-200} width={14} height={1100} fill="#252C4E" />)}
    <Glow x={960} y={300} r={800} kind="cool" o={0.35} />
    {/* the screen */}
    <rect x={1080} y={120} width={720} height={420} rx={10} fill="#0B1020" stroke="#3A4470" strokeWidth={8} />
    <svg x={1090} y={130} width={700} height={400} viewBox="0 0 1920 1100" overflow="hidden">
      <rect width={1920} height={1100} fill="#101A2A" />
      {screen?.(t)}
    </svg>
    <rect x={-400} y={760} width={2800} height={800} fill="#2A2238" />
    {/* the long table with microphones */}
    <rect x={180} y={640} width={980} height={60} fill="#3A3254" stroke="#14121C" strokeWidth={5} />
    <rect x={200} y={700} width={940} height={150} fill="#2E2846" stroke="#14121C" strokeWidth={5} />
    <text x={670} y={790} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#9AA8D8" letterSpacing={6}>SPACE AGENCY BRIEFING</text>
    {[340, 670, 1000].map((x, i) => <g key={i}><path d={`M ${x} 640 L ${x} 590`} stroke="#14121C" strokeWidth={6} /><rect x={x - 10} y={570} width={20} height={30} rx={8} fill="#14121C" /></g>)}
    {/* camera flashes */}
    {[0, 1, 2].map((i) => {
      const on = Math.floor((t + i * 37) / 23) % 7 === 0;
      return on ? <circle key={i} cx={100 + i * 700} cy={960} r={60} fill="#FFFFFF" opacity={0.7} /> : null;
    })}
  </g>
);
export const pressHip = (s = 1) => 700 - LEG_LEN * s * 0.35;

// ---------------------------------------------------------------- observatory, the Moon's surface, launch pad
export const Observatory: React.FC<{ t: number; id?: string; laser?: number; happy?: boolean }> = ({ t, id = 'obs', laser = 0 }) => (
  <g>
    <NightSky id={`${id}s`} horizonY={760} />
    <rect x={-400} y={-400} width={2800} height={1200} fill="#02020A" opacity={0.3} />
    <Stars seed={77} x0={-300} y0={-300} w={2500} h={1000} t={t} n={260} o={0.9} />
    <MilkyWay x0={-300} y0={700} x1={2200} y1={-250} o={0.6} t={t} w={300} />
    <path d="M -400 800 Q 300 700 900 760 Q 1500 820 2400 720 L 2400 1500 L -400 1500 Z" fill="#14121C" />
    <path d="M -400 740 L 100 560 L 500 720 L 900 600 L 1400 760 Z" fill="#1A1826" />
    <g transform="translate(960 760)">
      <rect x={-200} y={-180} width={400} height={180} fill="#C8CCD8" stroke="#14121C" strokeWidth={6} />
      <path d="M -220 -180 A 220 200 0 0 1 220 -180 Z" fill="#E0E4EE" stroke="#14121C" strokeWidth={6} />
      <path d="M -40 -370 L 40 -370 L 40 -180 L -40 -180 Z" fill="#14121C" />
      <rect x={-50} y={-120} width={100} height={120} fill="#3A3646" />
    </g>
    {laser > 0 ? (
      <g>
        <path d={`M 960 470 L ${960 + 700 * laser} ${470 - 900 * laser}`} stroke="#5BFF7A" strokeWidth={8} opacity={0.9} />
        <path d={`M 960 470 L ${960 + 700 * laser} ${470 - 900 * laser}`} stroke="#5BFF7A" strokeWidth={30} opacity={0.2} />
        <Glow x={960} y={470} r={80} kind="cool" o={0.8} />
      </g>
    ) : null}
  </g>
);

export const MoonSurface: React.FC<{ t: number; id?: string; ping?: number }> = ({ t, id = 'ms', ping = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#03030A" />
    <Stars seed={83} x0={-300} y0={-300} w={2500} h={900} t={t} n={200} o={0.9} />
    {/* the Earth in the sky */}
    <g transform="translate(1500 230)">
      <circle r={120} fill="#3E7AC8" />
      <path d="M -60 -80 Q -20 -40 -50 0 Q -80 40 -30 70 Q 10 50 0 0 Q 30 -40 -10 -100 Z" fill="#5A9A5A" />
      <path d="M 40 -60 Q 80 -20 60 30 Q 90 50 100 10 Q 110 -50 60 -90 Z" fill="#5A9A5A" />
      <path d="M -120 0 A 120 120 0 0 0 120 0 A 120 60 0 0 1 -120 0" fill="#000" opacity={0.35} />
    </g>
    <path d="M -400 700 Q 400 640 1000 690 Q 1600 740 2400 660 L 2400 1500 L -400 1500 Z" fill="#9A9AA4" />
    {[[300, 820, 120], [1200, 900, 180], [1700, 760, 90], [700, 1000, 70]].map(([x, y, r], i) => (
      <g key={i}><ellipse cx={x} cy={y} rx={r} ry={r * 0.3} fill="#7A7A84" /><ellipse cx={x} cy={y - 6} rx={r * 0.8} ry={r * 0.22} fill="#6A6A74" /></g>
    ))}
    {/* the mirror array: a tilted panel of corner cubes on legs */}
    <g transform="translate(860 790)">
      <path d="M -120 0 L -100 -60 M 120 0 L 100 -60" stroke="#5A5A64" strokeWidth={8} />
      <g transform="rotate(-18)">
        <rect x={-150} y={-150} width={300} height={100} fill="#C8CCD8" stroke="#2A2A34" strokeWidth={6} />
        {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={-130 + (i % 10) * 29} cy={-130 + Math.floor(i / 10) * 30} r={11} fill="#2A2E4A" stroke="#8A90B0" strokeWidth={2} />)}
      </g>
      {ping > 0 ? <Glow x={0} y={-110} r={200} kind="cool" o={ping} /> : null}
    </g>
  </g>
);

export const LaunchPad: React.FC<{ t: number; id?: string }> = ({ t, id = 'lp' }) => (
  <g>
    <defs>
      <linearGradient id={`${id}s`} x1="0" y1="-300" x2="0" y2="800" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#2A2050" />
        <stop offset="100%" stopColor="#E8907A" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2800} height={1300} fill={`url(#${id}s)`} />
    <rect x={-400} y={820} width={2800} height={700} fill="#3A3240" />
    {/* the tower */}
    <rect x={760} y={120} width={90} height={700} fill="none" stroke="#2A2232" strokeWidth={10} />
    {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M 760 ${130 + i * 70} L 850 ${190 + i * 70}`} stroke="#2A2232" strokeWidth={6} />)}
    {/* the rocket */}
    <g transform={`translate(1000 ${820})`}>
      <rect x={-50} y={-640} width={100} height={600} fill="#F4EEDC" stroke="#14121C" strokeWidth={6} />
      <path d="M -50 -640 Q 0 -760 50 -640 Z" fill="#C8452A" stroke="#14121C" strokeWidth={6} />
      <path d="M -50 -120 L -110 -20 L -50 -40 Z M 50 -120 L 110 -20 L 50 -40 Z" fill="#C8452A" stroke="#14121C" strokeWidth={6} />
      <rect x={-50} y={-420} width={100} height={20} fill="#2E5A7A" />
      <circle cx={0} cy={-520} r={22} fill="#9AC8E8" stroke="#14121C" strokeWidth={5} />
    </g>
  </g>
);

// ---------------------------------------------------------------- schematic pieces
export const SchBg: React.FC<{ t: number; len: number; id: string }> = ({ t, len, id }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [Math.max(1, len), 1.04]]))}>
    <Schematic t={t} id={id} />
  </g>
);

export const EarthIcon: React.FC<{ x: number; y: number; r: number; tilt?: number; spin?: number; ocean?: number; line?: string }> = ({ x, y, r, tilt = 0, spin = 0, ocean = 0, line = SCH.line }) => (
  <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
    {ocean > 0 ? <ellipse cx={0} cy={0} rx={r * (1 + 0.22 * ocean)} ry={r * (1 - 0.04 * ocean)} fill="#3E7AC8" opacity={0.5} stroke="#7FB4FF" strokeWidth={4} /> : null}
    <circle r={r} fill="#1E3A6A" stroke={line} strokeWidth={6} />
    <g transform={`rotate(${spin})`}>
      <path d={`M ${-r * 0.5} ${-r * 0.6} Q ${-r * 0.1} ${-r * 0.3} ${-r * 0.4} 0 Q ${-r * 0.7} ${r * 0.4} ${-r * 0.2} ${r * 0.6} Q ${r * 0.1} ${r * 0.4} 0 0 Q ${r * 0.3} ${-r * 0.4} ${-r * 0.1} ${-r * 0.8} Z`} fill="#4E8A5A" />
      <path d={`M ${r * 0.4} ${-r * 0.4} Q ${r * 0.8} 0 ${r * 0.5} ${r * 0.3} Q ${r * 0.7} ${r * 0.5} ${r * 0.8} ${r * 0.1} Z`} fill="#4E8A5A" />
    </g>
  </g>
);

export const MoonIcon: React.FC<{ x: number; y: number; r: number; o?: number; dash?: boolean }> = ({ x, y, r, o = 1, dash = false }) => (
  <g opacity={o}>
    {dash ? (
      <circle cx={x} cy={y} r={r} fill="none" stroke={SCH.dim} strokeWidth={5} strokeDasharray="12 10" />
    ) : (
      <g>
        <circle cx={x} cy={y} r={r} fill="#D8DCE8" stroke={SCH.line} strokeWidth={5} />
        {[[-0.35, -0.2, 0.22], [0.1, 0.35, 0.16], [0.3, -0.35, 0.12]].map(([dx, dy, k], i) => <circle key={i} cx={x + dx * r} cy={y + dy * r} r={k * r} fill="#A8ACBA" />)}
      </g>
    )}
  </g>
);

export const SunIcon: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 1 }) => (
  <g opacity={o}>
    <Glow x={x} y={y} r={r * 3} kind="warm" o={0.5} />
    <circle cx={x} cy={y} r={r} fill="#FFC23A" stroke={SCH.line} strokeWidth={5} />
  </g>
);

/** A big pop-on headline on the schematic (for "NO EXPLOSION", "ONE MORE SLOW CHANGE"...). */
export const Headline: React.FC<{ x?: number; y: number; t: number; text: string; size?: number; color?: string; delay?: number }> = ({ x = 960, y, t, text, size = 110, color = '#F6EFE3', delay = 2 }) => (
  <g transform={`translate(${x} ${y}) scale(${backOut(clamp((t - delay) / 9))})`}>
    <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#0B0816" strokeWidth={size * 0.11} paintOrder="stroke">{text}</text>
  </g>
);

/** A red cross drawing over something at (x, y). */
export const XMark: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const a = clamp(t / 6);
  const b = clamp((t - 5) / 6);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M -80 -80 L ${-80 + 160 * a} ${-80 + 160 * a}`} stroke="#FF4A3A" strokeWidth={22} strokeLinecap="round" />
      {b > 0 ? <path d={`M 80 -80 L ${80 - 160 * b} ${-80 + 160 * b}`} stroke="#FF4A3A" strokeWidth={22} strokeLinecap="round" /> : null}
    </g>
  );
};

/** A sign on a post (beach signs, the fan-club notice). */
export const Sign: React.FC<{ x: number; y: number; s?: number; lines: string[]; color?: string; ink?: string; w?: number }> = ({ x, y, s = 1, lines, color = '#F4EEDC', ink = '#1A1620', w = 520 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-14} y={0} width={28} height={420} fill="#6A5240" />
    <rect x={-w / 2} y={-60 - lines.length * 70} width={w} height={60 + lines.length * 70} rx={10} fill={color} stroke={ink} strokeWidth={8} />
    {lines.map((l, i) => (
      <text key={i} x={0} y={-30 - (lines.length - 1 - i) * 70} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={l.length > 14 ? 46 : 58} fill={ink}>{l}</text>
    ))}
  </g>
);

/** A portrait phone filling the frame, showing `children` (drawn in a 900x1600 screen). */
export const PhoneTall: React.FC<{ t: number; x?: number; y?: number; s?: number; rot?: number; children: React.ReactNode; bg?: string }> = ({ t, x = 960, y = 560, s = 1, rot = -4, children, bg = '#0C0A16' }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill={bg} />
    <g transform={`translate(${x} ${y + Math.sin(t / 20) * 6}) rotate(${rot + Math.sin(t / 30)}) scale(${s})`}>
      <rect x={-260} y={-480} width={520} height={960} rx={60} fill="#16141C" stroke="#3A3848" strokeWidth={10} />
      <svg x={-235} y={-450} width={470} height={900} viewBox="0 0 900 1720" overflow="hidden">
        <rect width={900} height={1720} fill="#F4F2FA" />
        {children}
      </svg>
      <rect x={-60} y={-470} width={120} height={20} rx={10} fill="#0C0A16" />
    </g>
  </g>
);

export const at = (W: Word[]) => (a: string, n = 1) => wordF(W, a, n);
export { SCH, SchLabel, DrawOn, Arrow, CountUp };
