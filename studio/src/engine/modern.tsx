import React from 'react';
import { rnd, clamp } from './anim';
import { FONT } from './fonts';
import { DuskSky } from './kit';
import { Glow, WallTexture } from './light';
import { LEG_LEN } from './rig';

// The modern kit ("What if the internet just disappeared forever?"): a suburban street of terraced houses, a corner
// shop, a community radio studio, and the everyday things that stop working when the network goes: a router, a
// laptop, a TV, a card terminal, a cash machine, a petrol pump. Flat fills, darker side away from the light.

// ---------------------------------------------------------------- skies
export type Tod = 'morning' | 'day' | 'dusk' | 'night';

export const DaySky: React.FC<{ id: string; horizonY: number; tod?: Tod }> = ({ id, horizonY, tod = 'day' }) => {
  if (tod === 'dusk') return <DuskSky id={id} horizonY={horizonY} />;
  const stops: Record<Exclude<Tod, 'dusk'>, [string, string, string]> = {
    morning: ['#5A8AD0', '#9CC4E8', '#FFD9A8'],
    day: ['#3E7AD0', '#7FB4EA', '#CFE6F5'],
    night: ['#070A1E', '#121636', '#2A2450'],
  };
  const [a, b, c] = stops[tod];
  return (
    <g>
      <defs>
        <linearGradient id={id} x1="0" y1="-400" x2="0" y2={horizonY + 60} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor={a} />
          <stop offset="0.6" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={2720} height={horizonY + 460} fill={`url(#${id})`} />
      {tod === 'night'
        ? Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={-300 + rnd(41, i) * 2500} cy={-300 + rnd(42, i) * (horizonY + 260)} r={1.5 + rnd(43, i) * 2} fill="#FFFFFF" opacity={0.4 + rnd(44, i) * 0.5} />)
        : [0, 1, 2].map((i) => (
            <g key={i} fill="#FFFFFF" opacity={tod === 'morning' ? 0.5 : 0.75}>
              <ellipse cx={200 + i * 700} cy={60 + i * 40} rx={130} ry={34} />
              <ellipse cx={260 + i * 700} cy={40 + i * 40} rx={80} ry={36} />
            </g>
          ))}
    </g>
  );
};

// ---------------------------------------------------------------- the suburban street
/** Feet on the pavement at y 800; the road from 836 down. */
export const SUBURB = { feet: 800, kerb: 836, roof: 150 };
export const suburbHip = (scale = 1) => SUBURB.feet - LEG_LEN * scale;

const HOUSES = [
  { x: -420, w: 470, wall: '#C98B6A', door: '#2E5A8A', n: 8 },
  { x: 50, w: 430, wall: '#E2C79A', door: '#B03A3A', n: 10 },
  { x: 480, w: 470, wall: '#8FB0A8', door: '#F2C14E', n: 12 },
  { x: 950, w: 440, wall: '#D9A8A0', door: '#3E7A4E', n: 14 },
  { x: 1390, w: 470, wall: '#B8B8C8', door: '#7A3A6A', n: 16 },
  { x: 1860, w: 520, wall: '#D6B07A', door: '#2E4A6A', n: 18 },
];

/** A modern hatchback seen from the side, centred on x with wheels on y. */
export const ModernCar: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean; dark?: boolean; lights?: number }> = ({ x, y, s = 1, color = '#3A6AB8', flip = false, dark = false, lights = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={8} rx={250} ry={16} fill="#000" opacity={0.3} />
    <path d="M -240 -20 L -240 -90 Q -230 -110 -190 -116 L -120 -120 L -60 -190 Q -40 -205 0 -205 L 110 -205 Q 150 -200 175 -170 L 215 -120 Q 245 -110 248 -80 L 248 -20 Z" fill={dark ? '#14151C' : color} stroke="#0E0F14" strokeWidth={6} />
    <path d="M -100 -125 L -48 -184 L 40 -184 L 40 -125 Z" fill={dark ? '#2A2C38' : '#A8C8E8'} opacity={0.9} />
    <path d="M 56 -184 L 108 -184 Q 140 -180 160 -150 L 178 -125 L 56 -125 Z" fill={dark ? '#2A2C38' : '#A8C8E8'} opacity={0.9} />
    <path d="M -240 -60 H 248" stroke="#000" strokeOpacity={0.18} strokeWidth={6} />
    <rect x={226} y={-100} width={22} height={16} rx={4} fill={lights > 0 ? '#FFF6C8' : '#E8E0C0'} />
    {lights > 0 ? <path d="M 248 -92 L 700 -170 L 700 0 Z" fill="#FFF6C8" opacity={0.18 * lights} /> : null}
    <rect x={-244} y={-100} width={14} height={16} rx={4} fill="#C83A3A" />
    {[-150, 150].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-14} r={42} fill="#16161C" />
        <circle cx={wx} cy={-14} r={20} fill="#8A8C98" />
      </g>
    ))}
  </g>
);

/** A modern lamp post: a slim pole with a flat LED head. */
export const LampPost: React.FC<{ x: number; y: number; on?: number }> = ({ x, y, on = 0 }) => (
  <g>
    <rect x={x - 6} y={y - 420} width={12} height={420} fill="#2A2C34" />
    <path d={`M ${x} ${y - 420} Q ${x} ${y - 450} ${x + 40} ${y - 450} H ${x + 90}`} stroke="#2A2C34" strokeWidth={12} fill="none" />
    <rect x={x + 60} y={y - 458} width={70} height={16} rx={6} fill="#2A2C34" />
    <rect x={x + 66} y={y - 444} width={58} height={6} rx={3} fill={on > 0 ? '#FFF2C8' : '#6A6C78'} />
    {on > 0 ? <Glow x={x + 95} y={y - 430} r={260} o={0.5 * on} /> : null}
  </g>
);

/**
 * The street: a terrace of six houses square-on from across the road, front gardens and low walls, lamp posts,
 * parked cars, the road in front. `tod` sets the light; `out` (0..1) empties the street of parked cars' shine (later
 * days); `windowsLit` how many windows glow (electricity still works, so evenings stay lit).
 */
export const Suburb: React.FC<{ t: number; id?: string; tod?: Tod; cars?: boolean; windowsLit?: number; drive?: boolean }> = ({ t, id = 'sub', tod = 'day', cars = true, windowsLit, drive = false }) => {
  const night = tod === 'night';
  const dusk = tod === 'dusk';
  const lit = windowsLit ?? (night ? 0.7 : dusk ? 0.45 : 0.05);
  const shade = night ? 0.55 : dusk ? 0.25 : tod === 'morning' ? 0.08 : 0;
  return (
    <g>
      <DaySky id={`${id}sky`} horizonY={SUBURB.roof + 120} tod={tod} />
      {/* trees behind the roofs */}
      {Array.from({ length: 9 }).map((_, i) => (
        <circle key={`tr${i}`} cx={-300 + i * 300 + rnd(9, i) * 80} cy={SUBURB.roof + 20 - rnd(10, i) * 60} r={110 + rnd(11, i) * 50} fill={night ? '#12202A' : '#4E7A4A'} opacity={0.85} />
      ))}
      {HOUSES.map((h, i) => {
        const top = SUBURB.roof + 80 + (i % 2) * 10;
        const ridge = top - 120;
        return (
          <g key={i}>
            {/* roof */}
            <path d={`M ${h.x - 10} ${top} L ${h.x + h.w / 2} ${ridge} L ${h.x + h.w + 10} ${top} Z`} fill={i % 2 ? '#5A3A3A' : '#4A4250'} />
            <rect x={h.x + h.w * 0.7} y={ridge + 20} width={40} height={70} fill="#6A4A40" />
            <rect x={h.x} y={top} width={h.w + 2} height={SUBURB.feet - top} fill={h.wall} />
            <rect x={h.x + h.w - 8} y={top} width={10} height={SUBURB.feet - top} fill="#000" opacity={0.12} />
            {/* upstairs windows */}
            {[0, 1].map((c) => {
              const wx = h.x + 60 + c * (h.w / 2);
              const on = rnd(i * 7 + c, Math.floor(t / 900)) < lit;
              return (
                <g key={c}>
                  <rect x={wx - 6} y={top + 46} width={h.w / 2 - 108} height={130} fill="#F2EEE6" />
                  <rect x={wx} y={top + 52} width={h.w / 2 - 120} height={118} fill={on ? '#FFD88A' : night ? '#1E2238' : '#6E8AA8'} />
                  <path d={`M ${wx + (h.w / 2 - 120) / 2} ${top + 52} V ${top + 170}`} stroke="#F2EEE6" strokeWidth={6} />
                  {!on && !night ? <path d={`M ${wx + 10} ${top + 160} L ${wx + 60} ${top + 60}`} stroke="#FFFFFF" strokeOpacity={0.25} strokeWidth={12} /> : null}
                </g>
              );
            })}
            {/* bay window downstairs and the door */}
            {(() => {
              const on = rnd(i * 7 + 5, Math.floor(t / 900)) < lit;
              return <rect x={h.x + 50} y={SUBURB.feet - 260} width={h.w - 210} height={150} fill={on ? '#FFD88A' : night ? '#1E2238' : '#6E8AA8'} stroke="#F2EEE6" strokeWidth={10} />;
            })()}
            <rect x={h.x + h.w - 130} y={SUBURB.feet - 280} width={90} height={200} fill={h.door} stroke="#F2EEE6" strokeWidth={8} />
            <rect x={h.x + h.w - 112} y={SUBURB.feet - 262} width={54} height={40} fill="#F2EEE6" opacity={0.6} />
            <circle cx={h.x + h.w - 56} cy={SUBURB.feet - 170} r={5} fill="#E8C060" />
            <text x={h.x + h.w - 85} y={SUBURB.feet - 292} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#2A2420">{h.n}</text>
            <rect x={h.x + h.w - 140} y={SUBURB.feet - 80} width={110} height={14} fill="#8A8288" />
            {/* the front garden wall and hedge */}
            <rect x={h.x} y={SUBURB.feet - 66} width={h.w - 150} height={66} fill="#8A6A5A" />
            <rect x={h.x} y={SUBURB.feet - 66} width={h.w - 150} height={10} fill="#A8887A" />
            <ellipse cx={h.x + (h.w - 150) / 2} cy={SUBURB.feet - 80} rx={(h.w - 150) / 2} ry={30} fill={night ? '#1E3020' : '#5A8A4A'} />
          </g>
        );
      })}
      <WallTexture rect={[-420, SUBURB.roof, 2900, SUBURB.feet - SUBURB.roof]} />
      {/* the pavement, the kerb, the road */}
      <rect x={-420} y={SUBURB.feet} width={2900} height={SUBURB.kerb - SUBURB.feet} fill="#9A949A" />
      {Array.from({ length: 30 }).map((_, k) => (
        <path key={k} d={`M ${-420 + k * 100} ${SUBURB.feet} L ${-440 + k * 100} ${SUBURB.kerb}`} stroke="#7E7880" strokeWidth={3} />
      ))}
      <rect x={-420} y={SUBURB.kerb} width={2900} height={14} fill="#C2BCC2" />
      <rect x={-420} y={SUBURB.kerb + 14} width={2900} height={700} fill="#3E3E46" />
      {Array.from({ length: 16 }).map((_, k) => (
        <rect key={k} x={-400 + k * 200} y={SUBURB.kerb + 200} width={110} height={12} fill="#E8E4D8" opacity={0.8} />
      ))}
      {cars ? (
        <g>
          <ModernCar x={330} y={SUBURB.kerb + 110} s={0.9} color="#C84A3A" />
          <ModernCar x={1640} y={SUBURB.kerb + 110} s={0.9} color="#4A7AB8" flip />
        </g>
      ) : null}
      {drive ? <ModernCar x={((t * 9) % 3400) - 700} y={SUBURB.kerb + 300} s={1} color="#E8E4D8" /> : null}
      {[60, 1000, 1940].map((x) => <LampPost key={x} x={x} y={SUBURB.feet + 10} on={night || dusk ? 1 : 0} />)}
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0A26" opacity={shade} />
    </g>
  );
};

// ---------------------------------------------------------------- the corner shop
export const SHOP = { feet: 820, counterTop: 600 };
export const shopHip = (scale = 1) => SHOP.feet - LEG_LEN * scale;

/** Shelves full (empty = 0) or stripped bare (empty = 1), a counter with a card terminal on the right. */
export const Shop: React.FC<{ t: number; id?: string; empty?: number; counter?: boolean; terminal?: 'idle' | 'ok' | 'error' }> = ({ t, id = 'shop', empty = 0, counter = true, terminal = 'error' }) => {
  const COLS = ['#E8504A', '#F2C14E', '#4AA8E0', '#5BC08A', '#F28C3A', '#B07AD0', '#E8E4D8'];
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1300} fill="#E8E2D2" />
      <rect x={-400} y={-400} width={2800} height={480} fill="#F4F0E6" />
      {[200, 760, 1320].map((x) => (
        <g key={x}>
          <rect x={x - 70} y={-20} width={140} height={14} rx={7} fill="#FFFFFF" />
          <Glow x={x} y={40} r={300} kind="cool" o={0.25} />
        </g>
      ))}
      {/* three shelf units */}
      {[-260, 300, 860].map((sx, u) => (
        <g key={u}>
          <rect x={sx} y={180} width={520} height={SHOP.feet - 180} fill="#5A6070" />
          <rect x={sx + 14} y={194} width={492} height={SHOP.feet - 210} fill="#3E4250" />
          {[0, 1, 2, 3, 4].map((r) => {
            const sy = 290 + r * 110;
            return (
              <g key={r}>
                {Array.from({ length: 9 }).map((_, k) => {
                  const keep = rnd(u * 50 + r * 9 + k, 3) > empty;
                  if (!keep) return null;
                  const h = 50 + rnd(u + 7, r * 9 + k) * 40;
                  return <rect key={k} x={sx + 24 + k * 54} y={sy - h} width={44} height={h} rx={4} fill={COLS[(u * 3 + r + k) % COLS.length]} stroke="#1E2028" strokeWidth={3} />;
                })}
                <rect x={sx + 14} y={sy} width={492} height={14} fill="#C8CCD6" />
              </g>
            );
          })}
        </g>
      ))}
      <rect x={-400} y={SHOP.feet} width={2800} height={500} fill="#BDB6A6" />
      {Array.from({ length: 24 }).map((_, k) => (
        <path key={k} d={`M ${-400 + k * 140} ${SHOP.feet} L ${-600 + k * 180} 1500`} stroke="#A8A090" strokeWidth={3} />
      ))}
      {counter ? (
        <g>
          <rect x={1420} y={SHOP.counterTop} width={700} height={SHOP.feet - SHOP.counterTop + 40} fill="#7A4A3A" />
          <rect x={1400} y={SHOP.counterTop - 20} width={740} height={26} fill="#A8705A" />
          <CardTerminal x={1560} y={SHOP.counterTop - 20} s={0.7} state={terminal} t={t} />
          <rect x={1720} y={SHOP.counterTop - 120} width={200} height={100} fill="#2A2C34" />
          <rect x={1730} y={SHOP.counterTop - 110} width={180} height={70} fill="#8AA8C8" />
        </g>
      ) : null}
    </g>
  );
};

// ---------------------------------------------------------------- the radio studio on the hill
export const RADIO = { feet: 830, desk: 640 };
export const radioHip = (scale = 1) => RADIO.feet - LEG_LEN * scale;

/** A small community radio studio at night: egg-box foam on the walls, a mixing desk, a big mic, an ON AIR sign. */
export const RadioRoom: React.FC<{ t: number; id?: string; onAir?: number; dawn?: number }> = ({ t, id = 'radio', onAir = 0, dawn = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1300} fill="#2A2638" />
    {Array.from({ length: 12 }).map((_, r) =>
      Array.from({ length: 30 }).map((__, c) => (
        <rect key={`${r}-${c}`} x={-400 + c * 96 + (r % 2) * 48} y={-60 + r * 64} width={80} height={52} rx={10} fill={(r + c) % 2 ? '#332E44' : '#2E2A3E'} />
      )),
    )}
    {/* a window: night outside, or dawn */}
    <rect x={1300} y={140} width={420} height={300} fill="#1A1626" />
    <rect x={1316} y={156} width={388} height={268} fill={dawn > 0 ? '#F2A86A' : '#0E1230'} />
    {dawn > 0 ? <rect x={1316} y={156} width={388} height={268} fill="#3A4A8A" opacity={1 - dawn} /> : <circle cx={1620} cy={220} r={30} fill="#F2EEDA" />}
    <path d="M 1316 380 L 1400 330 L 1480 360 L 1560 310 L 1704 370 V 424 H 1316 Z" fill="#141226" />
    <path d="M 1510 156 V 424" stroke="#1A1626" strokeWidth={12} />
    {/* ON AIR */}
    <g transform="translate(560 120)">
      <rect x={-150} y={-46} width={300} height={92} rx={14} fill={onAir > 0 ? '#E8252A' : '#4A2228'} stroke="#100E16" strokeWidth={8} />
      <text y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={onAir > 0 ? '#FFFFFF' : '#8A5A60'}>ON AIR</text>
      {onAir > 0 ? <Glow x={0} y={0} r={300} kind="red" o={0.5 * onAir} /> : null}
    </g>
    {/* the desk and the mixer */}
    <rect x={-400} y={RADIO.feet} width={2800} height={500} fill="#1E1A28" />
    <rect x={200} y={RADIO.desk} width={1300} height={RADIO.feet - RADIO.desk + 60} fill="#4A3A34" />
    <rect x={180} y={RADIO.desk - 24} width={1340} height={30} fill="#6A5248" />
    <rect x={380} y={RADIO.desk - 90} width={560} height={70} rx={8} fill="#22202C" stroke="#100E16" strokeWidth={5} />
    {Array.from({ length: 12 }).map((_, k) => (
      <g key={k}>
        <rect x={404 + k * 44} y={RADIO.desk - 80} width={8} height={50} fill="#100E16" />
        <rect x={396 + k * 44} y={RADIO.desk - 70 + Math.sin(k * 2.1) * 12} width={24} height={14} rx={3} fill="#C8C2B6" />
        <circle cx={408 + k * 44} cy={RADIO.desk - 84} r={4} fill={onAir > 0 && rnd(k, Math.floor(t / 4)) > 0.4 ? '#5BE08A' : '#2E4A3A'} />
      </g>
    ))}
    {/* the old reel recorder on the right */}
    <rect x={1060} y={RADIO.desk - 170} width={300} height={150} rx={10} fill="#5A5A64" stroke="#100E16" strokeWidth={5} />
    {[1130, 1290].map((cx) => (
      <g key={cx} transform={`rotate(${onAir > 0 ? t * 4 : 0} ${cx} ${RADIO.desk - 100})`}>
        <circle cx={cx} cy={RADIO.desk - 100} r={48} fill="#2A2A30" />
        <path d={`M ${cx - 40} ${RADIO.desk - 100} H ${cx + 40} M ${cx} ${RADIO.desk - 140} V ${RADIO.desk - 60}`} stroke="#8A8A94" strokeWidth={6} />
      </g>
    ))}
    <Glow x={700} y={RADIO.desk - 200} r={500} o={0.35} />
  </g>
);

/** A broadcast microphone on a desk arm. */
export const BroadcastMic: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 0 0 L -60 -160 L 40 -260" stroke="#2A2830" strokeWidth={14} fill="none" strokeLinecap="round" />
    <rect x={20} y={-370} width={90} height={150} rx={45} fill="#3A3844" stroke="#100E16" strokeWidth={6} />
    {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M 30 ${-340 + k * 24} H 100`} stroke="#5A5864" strokeWidth={5} />)}
    <rect x={-30} y={-10} width={60} height={14} rx={4} fill="#2A2830" />
  </g>
);

// ---------------------------------------------------------------- things that stop working
/** A home Wi-Fi router: lights green (ok), blinking orange, or red. */
export const Router: React.FC<{ x: number; y: number; s?: number; state?: 'ok' | 'blink' | 'red'; t?: number }> = ({ x, y, s = 1, state = 'ok', t = 0 }) => {
  const on = state === 'blink' ? Math.floor(t / 6) % 2 === 0 : true;
  const c = state === 'ok' ? '#5BE08A' : state === 'blink' ? '#FFB13D' : '#FF3A2A';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-150} y={-60} width={300} height={70} rx={18} fill="#ECECF2" stroke="#1E2028" strokeWidth={6} />
      <rect x={-120} y={-170} width={16} height={115} rx={8} fill="#ECECF2" stroke="#1E2028" strokeWidth={5} />
      <rect x={104} y={-170} width={16} height={115} rx={8} fill="#ECECF2" stroke="#1E2028" strokeWidth={5} />
      {[0, 1, 2, 3].map((k) => (
        <circle key={k} cx={-75 + k * 50} cy={-25} r={9} fill={on || k === 0 ? (k === 0 ? '#5BE08A' : c) : '#5A5A64'} />
      ))}
      {on && state !== 'ok' ? <Glow x={0} y={-25} r={120} kind={state === 'red' ? 'red' : 'warm'} o={0.6} /> : null}
    </g>
  );
};

/** The Wi-Fi symbol, crossed out when `off`. */
export const WifiIcon: React.FC<{ x: number; y: number; s?: number; off?: boolean; color?: string }> = ({ x, y, s = 1, off = false, color = '#F6EFE3' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <g fill="none" stroke={color} strokeLinecap="round" strokeWidth={24}>
      <path d="M -100 -10 Q 0 -100 100 -10" />
      <path d="M -64 30 Q 0 -25 64 30" />
      <path d="M -30 66 Q 0 42 30 66" />
    </g>
    <circle cx={0} cy={100} r={17} fill={color} />
    {off ? (
      <g>
        <path d="M -110 -80 L 110 140" stroke="#0B0816" strokeWidth={44} strokeLinecap="round" />
        <path d="M -110 -80 L 110 140" stroke="#FF3A2A" strokeWidth={26} strokeLinecap="round" />
      </g>
    ) : null}
  </g>
);

/** A spinning loading circle. */
export const Spinner: React.FC<{ x: number; y: number; r?: number; t: number; color?: string; w?: number }> = ({ x, y, r = 40, t, color = '#F6EFE3', w = 10 }) => (
  <g transform={`translate(${x} ${y}) rotate(${(t * 14) % 360})`}>
    <circle r={r} fill="none" stroke={color} strokeOpacity={0.2} strokeWidth={w} />
    <path d={`M 0 ${-r} A ${r} ${r} 0 0 1 ${r} 0`} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" />
  </g>
);

/** A laptop from the front with a message box on screen. */
export const Laptop: React.FC<{ x: number; y: number; s?: number; msg?: string; t?: number }> = ({ x, y, s = 1, msg = 'Cannot connect to server', t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-330} width={520} height={330} rx={16} fill="#2A2C34" stroke="#100E16" strokeWidth={6} />
    <rect x={-240} y={-310} width={480} height={290} rx={6} fill="#3A6AB8" />
    <rect x={-190} y={-230} width={380} height={140} rx={10} fill="#F4F4F8" />
    <rect x={-190} y={-230} width={380} height={34} rx={10} fill="#D8D8E0" />
    <circle cx={-150} cy={-150} r={22} fill="#E8504A" />
    <text x={-150} y={-141} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#fff">!</text>
    <text x={-112} y={-142} fontFamily={FONT.ui} fontSize={msg.length > 22 ? 19 : 22} fill="#2A2C34">{msg}</text>
    <path d="M -300 0 H 300 L 280 26 H -280 Z" fill="#4A4C58" stroke="#100E16" strokeWidth={6} />
  </g>
);

/** A wall TV with a spinning circle, a "No connection" line, or a test pattern. */
export const TVSet: React.FC<{ x: number; y: number; s?: number; t?: number; mode?: 'spin' | 'off' | 'error' }> = ({ x, y, s = 1, t = 0, mode = 'spin' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-250} width={840} height={490} rx={14} fill="#121218" stroke="#2A2A34" strokeWidth={8} />
    <rect x={-400} y={-230} width={800} height={450} fill={mode === 'off' ? '#0A0A10' : '#14162A'} />
    {mode === 'spin' ? <Spinner x={0} y={-20} r={60} t={t} w={14} /> : null}
    {mode !== 'off' ? (
      <text x={0} y={mode === 'spin' ? 110 : 20} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#C8CCE0">
        {mode === 'spin' ? 'Loading...' : 'No internet connection'}
      </text>
    ) : null}
    <rect x={-60} y={240} width={120} height={20} fill="#2A2A34" />
  </g>
);

/** A card payment terminal: idle, approved (green tick) or error/declined (red cross). */
export const CardTerminal: React.FC<{ x: number; y: number; s?: number; state?: 'idle' | 'ok' | 'error'; t?: number; label?: string }> = ({ x, y, s = 1, state = 'idle', t = 0, label }) => {
  const col = state === 'ok' ? '#4AC07A' : state === 'error' ? '#E8403A' : '#3A6AB8';
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-110} y={-300} width={220} height={300} rx={26} fill="#2A2C34" stroke="#100E16" strokeWidth={6} />
      <rect x={-90} y={-280} width={180} height={120} rx={10} fill={col} />
      {state === 'error' ? (
        <g>
          <path d="M -24 -246 L 24 -198 M 24 -246 L -24 -198" stroke="#fff" strokeWidth={12} strokeLinecap="round" />
          <text x={0} y={-170} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill="#fff">{label ?? 'DECLINED'}</text>
        </g>
      ) : state === 'ok' ? (
        <path d="M -30 -222 L -8 -200 L 32 -246" stroke="#fff" strokeWidth={12} fill="none" strokeLinecap="round" />
      ) : (
        <text x={0} y={-212} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#fff">{label ?? 'TAP CARD'}</text>
      )}
      {Array.from({ length: 12 }).map((_, k) => (
        <rect key={k} x={-72 + (k % 3) * 52} y={-140 + Math.floor(k / 3) * 34} width={40} height={24} rx={6} fill={k === 9 ? '#E8403A' : k === 11 ? '#4AC07A' : '#5A5C68'} />
      ))}
      {state === 'error' && Math.floor(t / 8) % 2 === 0 ? <Glow x={0} y={-220} r={160} kind="red" o={0.5} /> : null}
    </g>
  );
};

/** A bank card in a hand-free float. */
export const BankCard: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-76} width={240} height={152} rx={14} fill="#3A4AA8" stroke="#100E16" strokeWidth={5} />
    <rect x={-90} y={-30} width={46} height={36} rx={6} fill="#E8C060" />
    <rect x={-90} y={30} width={150} height={10} rx={5} fill="#C8D0F0" opacity={0.7} />
  </g>
);

/** A cash machine set in a wall: OUT OF SERVICE. */
export const CashMachine: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-460} width={400} height={460} rx={16} fill="#5A6070" stroke="#100E16" strokeWidth={6} />
    <rect x={-150} y={-420} width={300} height={190} rx={8} fill="#101218" />
    <text x={0} y={-340} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#FF5A4A" opacity={Math.floor(t / 10) % 2 ? 1 : 0.6}>OUT OF</text>
    <text x={0} y={-296} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={30} fill="#FF5A4A" opacity={Math.floor(t / 10) % 2 ? 1 : 0.6}>SERVICE</text>
    {Array.from({ length: 12 }).map((_, k) => (
      <rect key={k} x={-90 + (k % 3) * 64} y={-200 + Math.floor(k / 3) * 40} width={50} height={30} rx={6} fill="#C8CCD6" />
    ))}
    <rect x={-120} y={-30} width={240} height={14} rx={7} fill="#101218" />
  </g>
);

/** A petrol pump with a hand-written sign taped on: CASH ONLY or CARD ONLY. */
export const PetrolPump: React.FC<{ x: number; y: number; s?: number; sign?: string }> = ({ x, y, s = 1, sign }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-110} y={-420} width={220} height={420} rx={14} fill="#E8504A" stroke="#100E16" strokeWidth={6} />
    <rect x={-80} y={-380} width={160} height={90} rx={8} fill="#101218" />
    <text x={0} y={-322} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#FFB13D">-- . --</text>
    <rect x={-80} y={-260} width={160} height={60} rx={6} fill="#F4F0E6" />
    <path d="M 110 -240 Q 180 -240 180 -140 V -40" stroke="#1E2028" strokeWidth={14} fill="none" />
    <rect x={160} y={-60} width={40} height={70} rx={8} fill="#1E2028" />
    {sign ? (
      <g transform="translate(0 -150) rotate(-6)">
        <rect x={-100} y={-34} width={200} height={68} fill="#F8F4E0" stroke="#8A8270" strokeWidth={3} />
        <text y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#2A2420">{sign}</text>
      </g>
    ) : null}
  </g>
);

/** A paper notice taped to a lamp post or a door, a few words big. */
export const Notice: React.FC<{ x: number; y: number; s?: number; lines: string[]; rot?: number; color?: string }> = ({ x, y, s = 1, lines, rot = -3, color = '#C83A3A' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-170} y={-220} width={340} height={440} fill="#000" opacity={0.25} transform="translate(8 10)" />
    <rect x={-170} y={-220} width={340} height={440} fill="#F8F4E6" />
    <rect x={-40} y={-236} width={80} height={30} fill="#E8E0B0" opacity={0.85} />
    {lines.map((l, i) => (
      <text key={i} x={0} y={-120 + i * 80} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={i === 0 ? 62 : 46} fill={i === 0 ? color : '#2A2420'}>{l}</text>
    ))}
  </g>
);

/** An asthma inhaler: an L-shaped plastic body with a canister. */
export const Inhaler: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string }> = ({ x, y, s = 1, rot = 0, color = '#3A7AE0' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-40} y={-180} width={80} height={170} rx={20} fill="#C8CCD6" stroke="#100E16" strokeWidth={6} />
    <path d="M -50 -40 H 50 V 40 Q 50 60 30 60 H -110 Q -130 60 -130 40 V 10 Q -130 -10 -110 -10 H -50 Z" fill={color} stroke="#100E16" strokeWidth={6} />
    <rect x={-50} y={-60} width={100} height={40} rx={8} fill={color} stroke="#100E16" strokeWidth={6} />
  </g>
);

/** A transistor radio with a telescopic aerial, the tuning dial glowing when `on`. */
export const OldRadio: React.FC<{ x: number; y: number; s?: number; on?: number; t?: number }> = ({ x, y, s = 1, on = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M 120 -200 L 260 -480" stroke="#B8BCC8" strokeWidth={8} strokeLinecap="round" />
    <rect x={-200} y={-220} width={400} height={220} rx={26} fill="#8A4A3A" stroke="#100E16" strokeWidth={6} />
    <rect x={-170} y={-190} width={190} height={160} rx={14} fill="#3A2420" />
    {Array.from({ length: 7 }).map((_, k) => <path key={k} d={`M -160 ${-176 + k * 22} H 10`} stroke="#5A3A30" strokeWidth={8} />)}
    <rect x={50} y={-180} width={120} height={60} rx={8} fill={on > 0 ? '#FFD88A' : '#C8B898'} />
    <path d={`M ${70 + ((t * 0.5) % 80) * on} -176 V -124`} stroke="#C83A3A" strokeWidth={4} />
    <circle cx={110} cy={-70} r={30} fill="#C8B898" stroke="#100E16" strokeWidth={5} />
    {on > 0 ? <Glow x={110} y={-150} r={180} o={0.5 * on} /> : null}
    {on > 0
      ? [0, 1, 2].map((k) => {
          const p = ((t + k * 12) % 36) / 36;
          return <path key={k} d={`M ${-230 - p * 80} ${-160 - p * 40} q ${-30} ${70} 0 ${140 + p * 80}`} stroke="#FFE7A8" strokeWidth={8} fill="none" opacity={(1 - p) * on} strokeLinecap="round" />;
        })
      : null}
  </g>
);

/** A big cooking pot with a phone inside it, playing music (note glyphs rise out of it). */
export const PotSpeaker: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={-170} rx={190} ry={44} fill="#1E1E26" />
    <path d="M -190 -170 V -30 Q -190 0 -160 0 H 160 Q 190 0 190 -30 V -170" fill="#A8B0BE" stroke="#100E16" strokeWidth={7} />
    <ellipse cx={0} cy={-170} rx={190} ry={44} fill="none" stroke="#100E16" strokeWidth={7} />
    <path d="M -190 -150 H -250 M 190 -150 H 250" stroke="#2A2C34" strokeWidth={22} strokeLinecap="round" />
    <path d="M -160 -130 V -40" stroke="#FFFFFF" strokeOpacity={0.3} strokeWidth={22} strokeLinecap="round" />
    <Glow x={0} y={-180} r={200} kind="cool" o={0.6} />
    {[0, 1, 2, 3].map((k) => {
      const p = ((t * 2 + k * 30) % 120) / 120;
      return (
        <text key={k} x={-80 + k * 50 + Math.sin(t / 6 + k) * 30} y={-200 - p * 300} fontFamily={FONT.title} fontSize={70} fill={['#FFE27A', '#7FD4FF', '#FF8AB0', '#9AF08A'][k]} opacity={1 - p} textAnchor="middle">
          {k % 2 ? '♫' : '♪'}
        </text>
      );
    })}
  </g>
);

/** A kettle barbecue with smoke. */
export const Barbecue: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -80 0 L -40 -150 M 80 0 L 40 -150 M 0 0 L 0 -150" stroke="#2A2C34" strokeWidth={12} />
    <path d="M -150 -160 Q -150 -60 0 -60 Q 150 -60 150 -160 Z" fill="#1E1E26" stroke="#100E16" strokeWidth={6} />
    <rect x={-160} y={-176} width={320} height={16} rx={6} fill="#5A5A64" />
    {[-90, -20, 50].map((sx, k) => <rect key={k} x={sx} y={-196} width={50} height={20} rx={10} fill="#9A4A2A" />)}
    {[0, 1, 2].map((k) => {
      const p = ((t + k * 20) % 60) / 60;
      return <circle key={k} cx={Math.sin(t / 10 + k) * 30 + k * 20 - 20} cy={-220 - p * 260} r={30 + p * 50} fill="#E8E4EA" opacity={(1 - p) * 0.5} />;
    })}
  </g>
);

/** A football. */
export const Football: React.FC<{ x: number; y: number; r?: number; rot?: number }> = ({ x, y, r = 34, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <circle r={r} fill="#F6F6F6" stroke="#100E16" strokeWidth={4} />
    <path d={`M 0 ${-r * 0.35} L ${r * 0.33} ${-r * 0.1} L ${r * 0.2} ${r * 0.3} L ${-r * 0.2} ${r * 0.3} L ${-r * 0.33} ${-r * 0.1} Z`} fill="#100E16" />
  </g>
);

/** A folded paper road map, opened. */
export const PaperMap: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {[0, 1, 2, 3].map((k) => (
      <path key={k} d={`M ${-240 + k * 120} -150 L ${-120 + k * 120} ${k % 2 ? -140 : -160} L ${-120 + k * 120} 150 L ${-240 + k * 120} ${k % 2 ? 160 : 140} Z`} fill={k % 2 ? '#EDE6CC' : '#F6F0DA'} stroke="#8A8270" strokeWidth={3} />
    ))}
    <path d="M -220 60 Q -100 -40 20 30 T 220 -60" stroke="#E8504A" strokeWidth={10} fill="none" />
    <path d="M -180 -120 Q -60 0 -40 140" stroke="#E8B04A" strokeWidth={8} fill="none" />
    <path d="M 60 -150 Q 120 0 220 120" stroke="#4AA8E0" strokeWidth={14} fill="none" opacity={0.7} />
    <circle cx={30} cy={30} r={12} fill="#2A2420" />
  </g>
);

/** A board game box lid and board with a few counters. */
export const BoardGame: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-200} y={-140} width={400} height={280} rx={8} fill="#F2E6C8" stroke="#100E16" strokeWidth={5} />
    {Array.from({ length: 16 }).map((_, k) => (
      <rect key={k} x={-180 + (k % 8) * 45} y={k < 8 ? -120 : 80} width={40} height={40} fill={['#E8504A', '#F2C14E', '#4AA8E0', '#5BC08A'][k % 4]} />
    ))}
    <circle cx={-40} cy={0} r={18} fill="#B03A3A" stroke="#100E16" strokeWidth={4} />
    <circle cx={30} cy={20} r={18} fill="#3A6AB8" stroke="#100E16" strokeWidth={4} />
    <rect x={90} y={-20} width={40} height={40} rx={8} fill="#FFFFFF" stroke="#100E16" strokeWidth={4} />
    <circle cx={110} cy={0} r={5} fill="#100E16" />
  </g>
);

/** A jet seen from the side, on the ground or tilted in the air. */
export const Jet: React.FC<{ x: number; y: number; s?: number; rot?: number; color?: string }> = ({ x, y, s = 1, rot = 0, color = '#F4F4F8' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -380 -20 Q -380 -60 -320 -60 H 300 Q 380 -60 400 -20 Q 380 10 300 10 H -320 Q -380 10 -380 -20 Z" fill={color} stroke="#100E16" strokeWidth={6} />
    <path d="M -300 -60 L -360 -180 H -300 L -200 -60 Z" fill="#3A6AB8" stroke="#100E16" strokeWidth={6} />
    <path d="M -40 0 L -160 120 H -100 L 60 0 Z" fill="#C8CCD6" stroke="#100E16" strokeWidth={6} />
    {Array.from({ length: 14 }).map((_, k) => <circle key={k} cx={-240 + k * 36} cy={-34} r={8} fill="#3A4A6A" />)}
    <path d="M 330 -50 Q 370 -45 384 -26 H 330 Z" fill="#3A4A6A" />
  </g>
);

/** A grey server rack with blinking lights (or all dark). */
export const ServerRack: React.FC<{ x: number; y: number; s?: number; t?: number; dead?: boolean }> = ({ x, y, s = 1, t = 0, dead = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-130} y={-600} width={260} height={600} rx={8} fill="#22242E" stroke="#100E16" strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, k) => (
      <g key={k}>
        <rect x={-110} y={-580 + k * 48} width={220} height={38} rx={4} fill="#2E3240" />
        {[0, 1, 2].map((j) => (
          <circle key={j} cx={70 + j * 14} cy={-561 + k * 48} r={4} fill={dead ? '#3A2A2A' : rnd(k * 3 + j, Math.floor(t / 3)) > 0.5 ? '#5BE08A' : '#2E4A3A'} />
        ))}
      </g>
    ))}
  </g>
);

/** The sea floor with a cable lying across it, a few fish: the internet's backbone. */
export const SeaCable: React.FC<{ t: number; pulse?: number }> = ({ t, pulse = 0 }) => (
  <g>
    <defs>
      <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0E3A5A" />
        <stop offset="1" stopColor="#061626" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2800} height={1900} fill="url(#seaG)" />
    {Array.from({ length: 6 }).map((_, i) => (
      <path key={i} d={`M ${i * 380 - 200} -400 L ${i * 380 - 60} 700 L ${i * 380 + 40} 700 L ${i * 380 - 100} -400 Z`} fill="#4AB0E0" opacity={0.05} />
    ))}
    <path d="M -400 860 Q 400 780 960 840 T 2400 820 V 1500 H -400 Z" fill="#2A3A3A" />
    <path d="M -400 830 Q 300 760 960 800 T 2400 790" stroke="#1A1A20" strokeWidth={34} fill="none" />
    <path d="M -400 830 Q 300 760 960 800 T 2400 790" stroke="#3A3A44" strokeWidth={16} fill="none" />
    {pulse > 0
      ? Array.from({ length: 6 }).map((_, k) => {
          const px = ((t * 20 + k * 500) % 2800) - 400;
          return <circle key={k} cx={px} cy={800 + Math.sin(px / 300) * 10} r={14} fill="#7FE8FF" opacity={pulse} />;
        })
      : null}
    {[0, 1, 2].map((k) => {
      const fx = ((t * (2 + k) + k * 700) % 2600) - 300;
      return (
        <g key={k} transform={`translate(${fx} ${300 + k * 140})`}>
          <ellipse rx={40} ry={18} fill="#F2A84A" opacity={0.8} />
          <path d="M -40 0 L -70 -18 L -70 18 Z" fill="#F2A84A" opacity={0.8} />
        </g>
      );
    })}
  </g>
);

/** A black saloon car seen from the front, headlights on: the man in the suit arrives. */
export const BlackCarFront: React.FC<{ x: number; y: number; s?: number; lights?: number }> = ({ x, y, s = 1, lights = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={330} ry={30} fill="#000" opacity={0.4} />
    <path d="M -300 0 V -130 Q -290 -170 -240 -180 L -180 -300 Q -170 -320 -140 -320 H 140 Q 170 -320 180 -300 L 240 -180 Q 290 -170 300 -130 V 0 Z" fill="#14151C" stroke="#05050A" strokeWidth={6} />
    <path d="M -165 -190 L -120 -290 H 120 L 165 -190 Z" fill="#2A3040" />
    <rect x={-120} y={-120} width={240} height={50} rx={8} fill="#22242E" />
    {[-210, 210].map((hx) => (
      <g key={hx}>
        <ellipse cx={hx} cy={-110} rx={50} ry={26} fill={lights > 0 ? '#FFF6D8' : '#5A5A64'} />
        {lights > 0 ? <Glow x={hx} y={-110} r={260} o={0.7 * lights} /> : null}
      </g>
    ))}
    <rect x={-290} y={-30} width={60} height={50} rx={8} fill="#0A0A10" />
    <rect x={230} y={-30} width={60} height={50} rx={8} fill="#0A0A10" />
  </g>
);

/** A sheet of paper pinned to a board, hand-written lines (`title` on top). */
export const PinnedPage: React.FC<{ x: number; y: number; s?: number; rot?: number; title: string }> = ({ x, y, s = 1, rot = 0, title }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-160} width={240} height={320} fill="#F8F4E6" stroke="#B8B0A0" strokeWidth={2} />
    <circle cx={0} cy={-145} r={10} fill="#E8403A" />
    <text x={0} y={-100} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#2A2420">{title}</text>
    {Array.from({ length: 7 }).map((_, k) => (
      <path key={k} d={`M -90 ${-60 + k * 30} Q -40 ${-66 + k * 30} 0 ${-60 + k * 30} T ${60 + rnd(k, 2) * 30} ${-60 + k * 30}`} stroke="#4A4A6A" strokeWidth={4} fill="none" />
    ))}
  </g>
);

/** A car key fob. */
export const CarKey: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-60} y={-100} width={120} height={180} rx={50} fill="#1E1E26" stroke="#100E16" strokeWidth={5} />
    <circle cx={0} cy={-40} r={20} fill="#3A3A46" />
    <circle cx={0} cy={20} r={20} fill="#3A3A46" />
    <rect x={-14} y={80} width={28} height={130} fill="#B8BCC8" stroke="#5A5A64" strokeWidth={4} />
    <circle cx={0} cy={-130} r={28} fill="none" stroke="#B8BCC8" strokeWidth={8} />
  </g>
);

export const offlineProgress = (t: number, a: number, b: number) => clamp((t - a) / Math.max(1, b - a));

/** A city skyline at night square-on; `screens` (0..1) of its windows glow blue-white like screens, and `red` tints the sky. */
export const CitySkyline: React.FC<{ t: number; id?: string; red?: number; lit?: number; spread?: number }> = ({ t, id = 'city', red = 0.6, lit = 0.6, spread = 0 }) => {
  const blocks: React.ReactNode[] = [];
  let x = -400;
  let i = 0;
  while (x < 2320) {
    const w = 110 + ((i * 53) % 90);
    const h = 300 + ((i * 137) % 420);
    const top = 1080 - h;
    blocks.push(<rect key={`b${i}`} x={x} y={top} width={w} height={h + 400} fill={i % 2 ? '#141029' : '#1A1533'} />);
    for (let wy = top + 24; wy < 1060; wy += 38) {
      for (let wx = x + 14; wx < x + w - 20; wx += 30) {
        const r = Math.abs(Math.sin(wx * 12.9898 + wy * 78.233) * 43758.5453) % 1;
        const on = r < lit * (1 - spread * clamp((x + 400) / 2700 + 0.2));
        blocks.push(<rect key={`w${wx}-${wy}`} x={wx} y={wy} width={14} height={20} fill={on ? '#FFD37A' : '#0E0B1E'} opacity={on ? 0.85 : 1} />);
      }
    }
    x += w + 6;
    i++;
  }
  return (
    <g>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1A0E3A" />
          <stop offset="0.6" stopColor={red > 0.3 ? '#5A1A4A' : '#2A2458'} />
          <stop offset="1" stopColor={red > 0.3 ? '#B8323A' : '#4A3A7A'} />
        </linearGradient>
      </defs>
      <rect x={-400} y={-400} width={2800} height={1900} fill={`url(#${id}sky)`} />
      {blocks}
      <rect x={-400} y={-400} width={2800} height={1900} fill="#000" opacity={0.05 + Math.sin(t / 30) * 0.02} />
    </g>
  );
};

/** A flat globe: blue sea, green blobs for land; `marks` red X marks pop on over time (each at its own frame). */
export const Globe: React.FC<{ x: number; y: number; r: number; t: number; marks?: number; spin?: number }> = ({ x, y, r, t, marks = 0, spin = 0 }) => {
  const LAND = [[-0.45, -0.3, 0.32, 0.25], [-0.3, 0.25, 0.18, 0.3], [0.15, -0.35, 0.35, 0.2], [0.2, 0.05, 0.18, 0.3], [0.55, 0.15, 0.15, 0.12], [0.6, -0.25, 0.22, 0.15]];
  const off = ((spin * t) % 2) - 1;
  return (
    <g transform={`translate(${x} ${y})`}>
      <clipPath id="globeClip"><circle r={r} /></clipPath>
      <circle r={r + 14} fill="#7FD4FF" opacity={0.15} />
      <circle r={r} fill="#2A5AA8" />
      <g clipPath="url(#globeClip)">
        {[0, 2].map((k) =>
          LAND.map(([lx, ly, rx, ry], i) => (
            <ellipse key={`${k}${i}`} cx={(lx + off + k - 1) * r} cy={ly * r} rx={rx * r} ry={ry * r} fill="#4AA86A" />
          )),
        )}
        {Array.from({ length: Math.floor(marks) }).map((_, i) => {
          const mx = (rnd(71, i) - 0.5) * 1.5 * r;
          const my = (rnd(72, i) - 0.5) * 1.4 * r;
          const k = 22;
          return <path key={i} d={`M ${mx - k} ${my - k} L ${mx + k} ${my + k} M ${mx + k} ${my - k} L ${mx - k} ${my + k}`} stroke="#FF3A2A" strokeWidth={12} strokeLinecap="round" />;
        })}
        <circle cx={-r * 0.35} cy={-r * 0.35} r={r * 0.9} fill="#FFFFFF" opacity={0.07} />
      </g>
      <circle r={r} fill="none" stroke="#0B0816" strokeWidth={10} />
    </g>
  );
};

/** A kitchen tap with water running (or not). */
export const Tap: React.FC<{ x: number; y: number; s?: number; t: number; on?: boolean }> = ({ x, y, s = 1, t, on = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={160} width={520} height={60} rx={10} fill="#B8BCC8" stroke="#100E16" strokeWidth={6} />
    <path d="M -40 160 V -120 Q -40 -200 60 -200 H 140 Q 180 -200 180 -160 V -110" stroke="#C8CCD6" strokeWidth={50} fill="none" strokeLinecap="round" />
    <path d="M -40 160 V -120 Q -40 -200 60 -200 H 140 Q 180 -200 180 -160 V -110" stroke="#100E16" strokeWidth={6} fill="none" opacity={0.3} />
    <rect x={-90} y={-20} width={100} height={30} rx={10} fill="#C8CCD6" stroke="#100E16" strokeWidth={5} />
    {on ? (
      <g>
        <rect x={164} y={-100} width={32} height={260} fill="#9AD8F8" opacity={0.85} />
        {[0, 1, 2, 3].map((k) => <rect key={k} x={170} y={-100 + ((t * 18 + k * 65) % 260)} width={8} height={30} rx={4} fill="#FFFFFF" opacity={0.7} />)}
        <ellipse cx={180} cy={160} rx={60} ry={14} fill="#9AD8F8" opacity={0.7} />
      </g>
    ) : null}
  </g>
);
