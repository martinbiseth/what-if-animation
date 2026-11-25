import React from 'react';
import { rnd, clamp } from '../anim';
import { FONT } from '../fonts';
import { Glow, WallTexture } from '../light';
import { LEG_LEN } from '../rig';
import { DaySky, Tod, ModernCar, LampPost, CitySkyline } from '../modern';
import { Barrier, PoliceCarFront, PoliceCar, Washer, TicketGate, Dumpster, TrafficCone, sirenPhase, WANT } from '../wanted';

// The wanted episode's places: a downtown block of shops (the bakery, the laundromat), the parking lot with the skate
// ramp, the subway station's ticket gates, the alley behind it, the inside of the laundromat, the police station's
// front desk, the shopping mall, and the bridge with the roadblock. Same rules as the other sets: square-on, a floor
// line (`feet`) the cast stands on, flat fills, the darker side away from the light.

const shade = (tod: Tod) => (tod === 'night' ? 0.55 : tod === 'dusk' ? 0.25 : tod === 'morning' ? 0.06 : 0);

// ---------------------------------------------------------------- downtown
export const TOWN = { feet: 800, kerb: 836 };
export const townHip = (scale = 1) => TOWN.feet - LEG_LEN * scale;
const SHOPS = [
  { x: -420, w: 480, wall: '#B8705A', sign: 'PHARMACY', awn: '#3A8A6A' },
  { x: 60, w: 520, wall: '#D8B86A', sign: 'BAKERY', awn: '#C84A3A' },
  { x: 580, w: 500, wall: '#6A8AA8', sign: 'LAUNDROMAT', awn: '#2E5A8A' },
  { x: 1080, w: 470, wall: '#A86A7A', sign: 'BOOKS', awn: '#6A3A5A' },
  { x: 1550, w: 520, wall: '#8AA86A', sign: 'PIZZA', awn: '#C8862A' },
  { x: 2070, w: 420, wall: '#B8705A', sign: 'SHOES', awn: '#3A3E6A' },
];
/** A downtown block square-on: two storeys of flats over shopfronts with awnings and signs. Feet at 800. */
export const Downtown: React.FC<{ t: number; id?: string; tod?: Tod; cars?: boolean; lit?: number; police?: number }> = ({ t, id = 'town', tod = 'day', cars = true, lit, police = 0 }) => {
  const night = tod === 'night';
  const L = lit ?? (night ? 0.7 : tod === 'dusk' ? 0.5 : 0.1);
  return (
    <g>
      <DaySky id={`${id}sky`} horizonY={260} tod={tod} />
      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={`ft${i}`} x={-300 + i * 290 + rnd(5, i) * 60} y={-60 - rnd(6, i) * 200} width={150 + rnd(7, i) * 60} height={500} fill={night ? '#151a30' : '#8AA0C0'} opacity={0.7} />
      ))}
      {SHOPS.map((s, i) => {
        const top = 70 + (i % 2) * 30;
        return (
          <g key={i}>
            <rect x={s.x} y={top} width={s.w + 2} height={TOWN.feet - top} fill={s.wall} />
            <rect x={s.x} y={top} width={s.w} height={20} fill="#2A2228" opacity={0.6} />
            {[0, 1].map((r) =>
              [0, 1, 2].map((c) => {
                const wx = s.x + 40 + c * ((s.w - 80) / 3);
                const wy = top + 50 + r * 140;
                const on = rnd(i * 9 + r * 3 + c, Math.floor(t / 900)) < L;
                return (
                  <g key={`${r}${c}`}>
                    <rect x={wx} y={wy} width={(s.w - 80) / 3 - 30} height={96} fill={on ? '#FFD88A' : night ? '#1E2238' : '#6E8AA8'} stroke="#F2EEE6" strokeWidth={6} />
                  </g>
                );
              }),
            )}
            {/* the shopfront */}
            <rect x={s.x + 20} y={TOWN.feet - 300} width={s.w - 40} height={300} fill="#2A2C34" />
            <rect x={s.x + 34} y={TOWN.feet - 250} width={s.w - 200} height={210} fill={night ? '#FFE0A0' : '#9ABAD0'} opacity={night ? 0.85 : 1} />
            {!night ? <path d={`M ${s.x + 60} ${TOWN.feet - 60} L ${s.x + 160} ${TOWN.feet - 240}`} stroke="#FFFFFF" strokeOpacity={0.3} strokeWidth={18} /> : null}
            <rect x={s.x + s.w - 150} y={TOWN.feet - 250} width={100} height={250} fill="#3A3E4A" stroke="#1A1C24" strokeWidth={4} />
            <circle cx={s.x + s.w - 64} cy={TOWN.feet - 120} r={6} fill="#E8C060" />
            {/* awning and sign */}
            <path d={`M ${s.x + 14} ${TOWN.feet - 300} L ${s.x + s.w - 14} ${TOWN.feet - 300} L ${s.x + s.w + 10} ${TOWN.feet - 240} L ${s.x - 10} ${TOWN.feet - 240} Z`} fill={s.awn} />
            {Array.from({ length: Math.floor(s.w / 60) }).map((_, k) => (
              <path key={k} d={`M ${s.x + k * 60 + 20} ${TOWN.feet - 300} L ${s.x + k * 60 + 10} ${TOWN.feet - 240} L ${s.x + k * 60 + 40} ${TOWN.feet - 240} L ${s.x + k * 60 + 50} ${TOWN.feet - 300} Z`} fill="#FFFFFF" opacity={0.22} />
            ))}
            <rect x={s.x + 30} y={TOWN.feet - 372} width={s.w - 60} height={62} rx={6} fill="#F4F0E6" stroke="#2A2228" strokeWidth={5} />
            <text x={s.x + s.w / 2} y={TOWN.feet - 326} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={s.sign.length > 8 ? 40 : 46} fill={s.awn}>{s.sign}</text>
          </g>
        );
      })}
      <WallTexture rect={[-420, 60, 2900, TOWN.feet - 60]} />
      <rect x={-420} y={TOWN.feet} width={2900} height={TOWN.kerb - TOWN.feet} fill="#A8A2A6" />
      {Array.from({ length: 30 }).map((_, k) => (
        <path key={k} d={`M ${-420 + k * 100} ${TOWN.feet} L ${-440 + k * 100} ${TOWN.kerb}`} stroke="#8A8488" strokeWidth={3} />
      ))}
      <rect x={-420} y={TOWN.kerb} width={2900} height={14} fill="#C8C2C6" />
      <rect x={-420} y={TOWN.kerb + 14} width={2900} height={700} fill="#3E3E46" />
      {/* a crosswalk at the left and the signal */}
      {Array.from({ length: 6 }).map((_, k) => (
        <rect key={`zc${k}`} x={-80} y={TOWN.kerb + 24 + k * 44} width={360} height={26} fill="#E8E4D8" opacity={0.85} />
      ))}
      {Array.from({ length: 10 }).map((_, k) => (
        <rect key={k} x={400 + k * 220} y={TOWN.kerb + 200} width={120} height={12} fill="#E8E4D8" opacity={0.8} />
      ))}
      {cars ? (
        <g>
          <ModernCar x={900} y={TOWN.kerb + 110} s={0.9} color="#E8A83A" />
          <ModernCar x={1760} y={TOWN.kerb + 110} s={0.9} color="#4A7AB8" flip />
        </g>
      ) : null}
      {[520, 1500].map((x) => <LampPost key={x} x={x} y={TOWN.feet + 10} on={night || tod === 'dusk' ? 1 : 0} />)}
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0A26" opacity={shade(tod)} />
      {police > 0 ? <rect x={-400} y={-400} width={2800} height={1900} fill={sirenPhase(t) ? WANT.red : WANT.blue} opacity={0.1 * police} /> : null}
    </g>
  );
};

/** The pedestrian signal: the little man, red or green. (x, y) the ground. */
export const WalkSignal: React.FC<{ x: number; y: number; s?: number; red?: boolean }> = ({ x, y, s = 1, red = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-8} y={-440} width={16} height={440} fill="#2A2C34" />
    <rect x={-60} y={-560} width={120} height={150} rx={12} fill="#1A1C24" stroke="#0E0F14" strokeWidth={5} />
    <g transform="translate(0 -485)" fill={red ? '#FF4A3A' : '#2A3A30'}>
      <circle cx={0} cy={-36} r={12} />
      <path d="M -18 -20 H 18 L 14 20 H 6 V 46 H -6 V 20 H -14 Z" />
    </g>
    {red ? <circle cx={0} cy={-485} r={80} fill="#FF4A3A" opacity={0.25} filter="url(#blur16)" /> : null}
  </g>
);

// ---------------------------------------------------------------- the parking lot with the skate ramp
export const LOT = { feet: 830 };
export const lotHip = (scale = 1) => LOT.feet - LEG_LEN * scale;
export const ParkingLot: React.FC<{ t: number; id?: string; tod?: Tod; ramp?: boolean; police?: number }> = ({ t, id = 'lot', tod = 'day', ramp = true, police = 0 }) => (
  <g>
    <DaySky id={`${id}sky`} horizonY={420} tod={tod} />
    {/* the back of a supermarket */}
    <rect x={-400} y={160} width={2800} height={LOT.feet - 300 - 160} fill="#C8C0B0" />
    <rect x={-400} y={160} width={2800} height={30} fill="#8A8278" />
    <rect x={300} y={210} width={700} height={90} rx={8} fill="#2E6A4A" />
    <text x={650} y={275} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#F4F0E6">SUPERSAVE</text>
    {[1250, 1500].map((x) => <rect key={x} x={x} y={330} width={200} height={LOT.feet - 300 - 330} fill="#8A929E" stroke="#5A5E6A" strokeWidth={6} />)}
    <rect x={-400} y={LOT.feet - 300} width={2800} height={1000} fill="#4A4A52" />
    {Array.from({ length: 12 }).map((_, k) => (
      <path key={k} d={`M ${-300 + k * 230} ${LOT.feet - 300} L ${-500 + k * 300} 1300`} stroke="#E8E4D8" strokeOpacity={0.7} strokeWidth={8} />
    ))}
    <ModernCar x={-60} y={LOT.feet - 120} s={0.8} color="#7A5A9A" />
    {ramp ? (
      <g transform={`translate(1380 ${LOT.feet})`}>
        <ellipse cx={0} cy={6} rx={320} ry={16} fill="#000" opacity={0.25} />
        <path d="M -300 0 Q -40 0 120 -180 L 300 -180 L 300 0 Z" fill="#C8A878" stroke="#5A4630" strokeWidth={6} />
        <path d="M 120 -180 L 300 -180 L 300 -196 L 116 -196 Z" fill="#8A929E" stroke="#3A3E4A" strokeWidth={4} />
        {[0, 1, 2].map((k) => <path key={k} d={`M ${-200 + k * 120} -4 Q ${-80 + k * 100} -40 ${30 + k * 70} -120`} stroke="#5A4630" strokeOpacity={0.3} strokeWidth={4} fill="none" />)}
      </g>
    ) : null}
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0A26" opacity={shade(tod)} />
    {police > 0 ? <rect x={-400} y={-400} width={2800} height={1900} fill={sirenPhase(t) ? WANT.red : WANT.blue} opacity={0.12 * police} /> : null}
  </g>
);

// ---------------------------------------------------------------- the laundromat, inside
export const LAUND = { feet: 830 };
export const laundHip = (scale = 1) => LAUND.feet - LEG_LEN * scale;
export const Laundromat: React.FC<{ t: number; id?: string; police?: number }> = ({ t, id = 'laund', police = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1300} fill="#BFD8D8" />
    <rect x={-400} y={360} width={2800} height={12} fill="#8AB0B0" />
    {Array.from({ length: 30 }).map((_, i) => <rect key={i} x={-400 + i * 100} y={372} width={96} height={LAUND.feet - 372} fill={i % 2 ? '#E8F0EC' : '#DCE8E4'} />)}
    {/* the front window onto the street, with the lettering backwards */}
    <rect x={60} y={40} width={900} height={300} fill="#8AB4D8" stroke="#F2EEE6" strokeWidth={14} />
    <text x={510} y={130} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#2E5A8A" transform="translate(1020 0) scale(-1 1)">LAUNDROMAT</text>
    {police > 0 ? <rect x={60} y={40} width={900} height={300} fill={sirenPhase(t) ? WANT.red : WANT.blue} opacity={0.35 * police} /> : null}
    {[1100, 1360, 1620].map((x) => <rect key={x} x={x} y={80} width={200} height={140} rx={8} fill="#F4F0E6" stroke="#2E5A8A" strokeWidth={6} />)}
    <text x={1460} y={170} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#2E5A8A">WASH  •  DRY  •  FOLD</text>
    {/* the bench under the window */}
    <rect x={120} y={LAUND.feet - 200} width={800} height={30} rx={8} fill="#C8862A" stroke="#5A3A1A" strokeWidth={5} />
    {[160, 860].map((x) => <rect key={x} x={x} y={LAUND.feet - 170} width={20} height={170} fill="#3A3E4A" />)}
    {/* the machines on the right */}
    {[1100, 1360, 1620, 1880].map((x, i) => <Washer key={x} x={x} y={LAUND.feet} t={t + i * 13} tint={['#4AA8E0', '#E8504A', '#F2C14E', '#5BC08A'][i]} />)}
    <rect x={-400} y={LAUND.feet} width={2800} height={500} fill="#D8D0C0" />
    {Array.from({ length: 20 }).map((_, k) => <path key={k} d={`M ${-400 + k * 140} ${LAUND.feet} L ${-600 + k * 180} 1500`} stroke="#C0B8A8" strokeWidth={3} />)}
    <Glow x={600} y={100} r={600} kind="cool" o={0.25} />
  </g>
);

// ---------------------------------------------------------------- the subway station
export const SUB = { feet: 840 };
export const subHip = (scale = 1) => SUB.feet - LEG_LEN * scale;
/** White tiles, a line of ticket gates across the middle, the platform stairs behind. `gate` opens the paddle of the
 *  middle gate; `alarm` turns its light red and flashes the ceiling. */
export const Subway: React.FC<{ t: number; id?: string; gate?: number; alarm?: number; gates?: boolean }> = ({ t, id = 'sub', gate = 0, alarm = 0, gates = true }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1300} fill="#E8E8E0" />
    {Array.from({ length: 28 }).map((_, r) =>
      <path key={r} d={`M -400 ${-200 + r * 40} H 2400`} stroke="#CFCFC6" strokeWidth={3} />,
    )}
    {Array.from({ length: 40 }).map((_, c) => <path key={c} d={`M ${-400 + c * 80} -400 V ${SUB.feet}`} stroke="#CFCFC6" strokeWidth={3} />)}
    <rect x={-400} y={300} width={2800} height={40} fill="#2E6AB8" />
    <rect x={-400} y={-400} width={2800} height={200} fill="#3A3E4A" />
    {[200, 760, 1320, 1880].map((x) => <rect key={x} x={x - 120} y={-190} width={240} height={14} rx={7} fill={alarm && Math.floor(t / 6) % 2 ? '#FF6060' : '#FFFFFF'} />)}
    {/* the sign */}
    <rect x={640} y={10} width={640} height={110} rx={10} fill="#14121C" />
    {['#E8402A', '#2E9A5A', '#F2B02A'].map((c, i) => <circle key={c} cx={710 + i * 80} cy={65} r={30} fill={c} />)}
    <text x={950} y={88} fontFamily={FONT.title} fontWeight={800} fontSize={62} fill="#F4F0E6">SUBWAY</text>
    {/* the stairs down to the platforms, behind */}
    <rect x={1300} y={420} width={520} height={SUB.feet - 420} fill="#3A3E4A" />
    {Array.from({ length: 7 }).map((_, k) => <rect key={k} x={1300} y={440 + k * 56} width={520} height={18} fill="#5A5E6A" />)}
    <rect x={1290} y={380} width={540} height={40} fill="#8A929E" />
    <rect x={-400} y={SUB.feet} width={2800} height={500} fill="#8A8A84" />
    {Array.from({ length: 24 }).map((_, k) => <path key={k} d={`M ${-400 + k * 140} ${SUB.feet} L ${-700 + k * 200} 1500`} stroke="#7A7A74" strokeWidth={3} />)}
    {gates ? [360, 620, 880, 1140].map((x, i) => <TicketGate key={x} x={x} y={SUB.feet} s={0.95} open={i === 2 ? gate : 0} red={i === 2 && alarm > 0} />) : null}
    {alarm > 0 ? <rect x={-400} y={-400} width={2800} height={1900} fill="#FF3B3B" opacity={0.1 * alarm * (Math.floor(t / 6) % 2)} /> : null}
  </g>
);

// ---------------------------------------------------------------- the alley behind the station, at dusk
export const ALLEY = { feet: 840 };
export const alleyHip = (scale = 1) => ALLEY.feet - LEG_LEN * scale;
export const Alley: React.FC<{ t: number; id?: string; light?: number; tod?: Tod }> = ({ t, id = 'alley', light = 0, tod = 'dusk' }) => (
  <g>
    <DaySky id={`${id}sky`} horizonY={200} tod={tod} />
    <rect x={-400} y={80} width={2800} height={ALLEY.feet - 80} fill="#6A4A44" />
    {Array.from({ length: 34 }).map((_, k) => <path key={k} d={`M -400 ${100 + k * 24} H 2400`} stroke="#000" strokeOpacity={0.1} strokeWidth={2} />)}
    {[200, 900, 1600].map((x) => (
      <g key={x}>
        <rect x={x} y={160} width={260} height={180} fill="#2A2C3A" stroke="#4A3A34" strokeWidth={10} />
        <path d={`M ${x - 40} 360 H ${x + 300} M ${x - 40} 360 L ${x - 40} 560 M ${x + 300} 360 V 560 M ${x - 40} 470 H ${x + 300}`} stroke="#1E1E26" strokeWidth={8} fill="none" />
      </g>
    ))}
    <rect x={560} y={ALLEY.feet - 300} width={160} height={300} fill="#3A3E4A" stroke="#1E1E26" strokeWidth={6} />
    <rect x={590} y={ALLEY.feet - 340} width={100} height={30} fill="#2E9A5A" />
    <text x={640} y={ALLEY.feet - 318} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#F4F0E6">EXIT</text>
    <Dumpster x={1000} y={ALLEY.feet} s={1.1} />
    <Dumpster x={1480} y={ALLEY.feet} s={1.05} color="#2E5A8A" />
    <rect x={-400} y={ALLEY.feet} width={2800} height={500} fill="#4A4A50" />
    <path d="M -400 960 H 2400" stroke="#3A3A40" strokeWidth={14} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0A26" opacity={tod === 'night' ? 0.5 : 0.3} />
    {light > 0 ? (
      <g>
        <ellipse cx={1200} cy={ALLEY.feet - 80} rx={420 * light} ry={160 * light} fill="#FFF6D0" opacity={0.45} filter="url(#blur16)" />
        <path d={`M ${1200 - 80} -400 L ${1200 - 420 * light} ${ALLEY.feet} L ${1200 + 420 * light} ${ALLEY.feet} L ${1200 + 80} -400 Z`} fill="#FFF6D0" opacity={0.18} />
      </g>
    ) : null}
  </g>
);

// ---------------------------------------------------------------- the police station's front desk
export const DESK = { feet: 850, top: 640 };
export const deskHip = (scale = 1) => DESK.feet - LEG_LEN * scale;
export const StationDesk: React.FC<{ t: number; id?: string; desk?: boolean }> = ({ t, id = 'desk', desk = true }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1300} fill="#C8CCD4" />
    <rect x={-400} y={480} width={2800} height={DESK.feet - 480} fill="#8A9AB0" />
    <rect x={-400} y={470} width={2800} height={14} fill="#5A6A80" />
    <rect x={560} y={60} width={800} height={130} rx={10} fill="#1E2A44" />
    <text x={960} y={150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill="#F4F0E6" letterSpacing={8}>POLICE</text>
    {/* the notice board */}
    <rect x={-140} y={160} width={520} height={300} fill="#B8905A" stroke="#6A5030" strokeWidth={8} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-110 + (i % 3) * 160} y={190 + Math.floor(i / 3) * 140} width={130} height={110} fill={i === 1 ? '#F8E080' : '#F8F4E6'} transform={`rotate(${(rnd(3, i) - 0.5) * 8} ${-45 + (i % 3) * 160} ${245 + Math.floor(i / 3) * 140})`} />)}
    {/* the clock */}
    <circle cx={1600} cy={230} r={70} fill="#F8F4E6" stroke="#2A2C34" strokeWidth={8} />
    <path d={`M 1600 230 L ${1600 + 40 * Math.sin(t / 200)} ${230 - 40 * Math.cos(t / 200)} M 1600 230 L 1600 180`} stroke="#2A2C34" strokeWidth={6} strokeLinecap="round" />
    {/* chairs along the wall */}
    {[1500, 1660, 1820].map((x) => <g key={x}><rect x={x - 60} y={DESK.feet - 180} width={120} height={20} fill="#2E6AB8" /><rect x={x - 56} y={DESK.feet - 300} width={16} height={130} fill="#2E6AB8" /><rect x={x - 50} y={DESK.feet - 160} width={10} height={160} fill="#3A3E4A" /><rect x={x + 40} y={DESK.feet - 160} width={10} height={160} fill="#3A3E4A" /></g>)}
    <rect x={-400} y={DESK.feet} width={2800} height={500} fill="#6A7080" />
    {Array.from({ length: 24 }).map((_, k) => <path key={k} d={`M ${-400 + k * 140} ${DESK.feet} L ${-700 + k * 200} 1500`} stroke="#5A6070" strokeWidth={3} />)}
    {desk ? (
      <g>
        <rect x={420} y={DESK.top} width={1000} height={DESK.feet - DESK.top + 20} fill="#5A4636" />
        <rect x={400} y={DESK.top - 22} width={1040} height={28} fill="#7A604A" />
        <rect x={1180} y={DESK.top - 130} width={170} height={110} fill="#2A2C34" />
        <rect x={1190} y={DESK.top - 120} width={150} height={80} fill="#5A8AC8" />
        <rect x={560} y={DESK.top - 30} width={180} height={10} fill="#F8F4E6" />
      </g>
    ) : null}
    <Glow x={960} y={-50} r={700} kind="cool" o={0.2} />
  </g>
);

// ---------------------------------------------------------------- the mall
export const MALL = { feet: 840 };
export const mallHip = (scale = 1) => MALL.feet - LEG_LEN * scale;
/** A shopping mall atrium: two levels of shopfronts, big screens on the pillars (draw your own screen content in
 *  `screen`, called with each screen's rect), food-court tables in front. */
export const Mall: React.FC<{ t: number; id?: string; screen?: (x: number, y: number, w: number, h: number, i: number) => React.ReactNode }> = ({ t, id = 'mall', screen }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1300} fill="#E8E0D4" />
    <rect x={-400} y={-400} width={2800} height={160} fill="#CFC6B6" />
    {[-200, 300, 800, 1300, 1800].map((x, i) => <rect key={x} x={x} y={-240} width={380} height={30} fill="#F8F4E6" />)}
    {[0, 1].map((lv) =>
      Array.from({ length: 6 }).map((_, i) => {
        const x = -360 + i * 440;
        const y = lv ? 470 : 70;
        const c = ['#C84A3A', '#2E6AB8', '#3A8A6A', '#C8862A', '#7A4A9A', '#2A2C34'][(i + lv * 3) % 6];
        return (
          <g key={`${lv}${i}`}>
            <rect x={x} y={y} width={400} height={300} fill="#F4F0E6" stroke="#B8B0A0" strokeWidth={6} />
            <rect x={x + 20} y={y + 70} width={360} height={230} fill="#9ABAD0" opacity={0.7} />
            <rect x={x} y={y} width={400} height={56} fill={c} />
          </g>
        );
      }),
    )}
    <rect x={-400} y={400} width={2800} height={40} fill="#B8B0A0" />
    <rect x={-400} y={440} width={2800} height={10} fill="#8A8278" />
    {[240, 1680].map((x, i) => (
      <g key={x}>
        <rect x={x - 40} y={-240} width={80} height={MALL.feet + 240} fill="#D8D0C4" />
        <rect x={x - 220} y={140} width={440} height={260} rx={10} fill="#14121C" />
        <rect x={x - 205} y={155} width={410} height={230} fill="#1E2A44" />
        {screen ? screen(x - 205, 155, 410, 230, i) : null}
      </g>
    ))}
    <rect x={-400} y={MALL.feet} width={2800} height={500} fill="#D8D0C0" />
    {Array.from({ length: 20 }).map((_, k) => <path key={k} d={`M ${-400 + k * 160} ${MALL.feet} L ${-700 + k * 220} 1500`} stroke="#C4BCAC" strokeWidth={3} />)}
    <Glow x={960} y={-100} r={900} kind="warm" o={0.2} />
  </g>
);
/** A food-court table with a tray. (x, y) the floor. */
export const FoodTable: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={4} rx={200} ry={14} fill="#000" opacity={0.2} />
    <rect x={-8} y={-230} width={16} height={230} fill="#3A3E4A" />
    <rect x={-200} y={-250} width={400} height={24} rx={8} fill="#F4F0E6" stroke="#8A8278" strokeWidth={4} />
    <rect x={-90} y={-268} width={140} height={20} rx={4} fill="#C84A3A" />
    <path d="M -60 -268 Q -30 -310 0 -268 Z" fill="#E8A83A" />
  </g>
);

// ---------------------------------------------------------------- the bridge out of town, with the roadblock
export const BRIDGE = { feet: 880, deck: 700 };
export const bridgeHip = (scale = 1) => BRIDGE.feet - LEG_LEN * scale;
/** Night, the city behind, a bridge deck across the frame with its railings; `block` adds the roadblock: police cars
 *  nose to nose, barriers, cones, lights. */
export const Bridge: React.FC<{ t: number; id?: string; block?: number; heli?: boolean; lit?: number }> = ({ t, id = 'bridge', block = 1, lit = 0.75 }) => (
  <g>
    <DaySky id={`${id}sky`} horizonY={500} tod="night" />
    <g transform="translate(0 -40)">
      <CitySkyline t={t} id={`${id}city`} red={0} lit={lit} />
    </g>
    <rect x={-400} y={560} width={2800} height={600} fill="#0A1426" />
    {Array.from({ length: 16 }).map((_, i) => <path key={i} d={`M ${-300 + i * 160} ${600 + (i % 3) * 30} h 80`} stroke={lit > 0.2 ? '#FFD88A' : '#8AA0C8'} strokeOpacity={0.35} strokeWidth={4} />)}
    {/* towers and cables */}
    {[-60, 1980].map((x) => (
      <g key={x}>
        <rect x={x - 40} y={-200} width={80} height={BRIDGE.feet + 200} fill="#2A3048" />
        {Array.from({ length: 8 }).map((_, k) => <path key={k} d={`M ${x} ${-160 + k * 30} L ${x < 960 ? x + 300 + k * 120 : x - 300 - k * 120} ${BRIDGE.deck}`} stroke="#4A5070" strokeWidth={3} />)}
      </g>
    ))}
    <rect x={-400} y={BRIDGE.deck} width={2800} height={60} fill="#3A3E52" />
    {Array.from({ length: 30 }).map((_, k) => <rect key={k} x={-400 + k * 100} y={BRIDGE.deck - 70} width={8} height={70} fill="#5A6078" />)}
    <rect x={-400} y={BRIDGE.deck - 76} width={2800} height={10} fill="#6A7090" />
    <rect x={-400} y={BRIDGE.deck + 60} width={2800} height={600} fill="#2E2E36" />
    {Array.from({ length: 12 }).map((_, k) => <rect key={k} x={-380 + k * 240} y={BRIDGE.feet + 60} width={130} height={12} fill="#E8E4D8" opacity={0.6} />)}
    {block > 0 ? (
      <g opacity={clamp(block * 2)}>
        <PoliceCarFront x={700} y={BRIDGE.feet} s={0.9} t={t} seed={0} beams={1} />
        <PoliceCar x={1250} y={BRIDGE.feet + 10} s={0.9} t={t} seed={3} flip />
        <Barrier x={420} y={BRIDGE.feet + 40} s={1} w={320} light={1} t={t} />
        <Barrier x={1600} y={BRIDGE.feet + 40} s={1} w={320} light={1} t={t + 4} />
        {[230, 990, 1800].map((x) => <TrafficCone key={x} x={x} y={BRIDGE.feet + 60} s={0.8} />)}
        <rect x={-400} y={-400} width={2800} height={1900} fill={sirenPhase(t) ? WANT.red : WANT.blue} opacity={0.1} />
      </g>
    ) : null}
  </g>
);
