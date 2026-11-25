import React from 'react';
import { FONT } from '../fonts';
import { LEG_LEN } from '../rig';

// A big indoor hall seen side on, at eye level: the shopping centre (two floors of shopfronts, a glass roof) or the
// train station (stone arches, a departure board, the big hanging clock). Feet at HALL.feet.

const rnd = (a: number, b: number) => {
  const x = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export const HALL = { feet: 840, clock: { x: 960, y: 250, r: 120 } };
export const hallHip = (scale = 1) => HALL.feet - LEG_LEN * scale;

const SHOPS = ['SHOES', 'COFFEE', 'GAMES', 'BOOKS', 'PHONES', 'SALE', 'TOYS', 'JEANS', 'PIZZA', 'SPORT'];
const SIGN = ['#FF6A4A', '#4AC8FF', '#FFD34A', '#7FE0A8', '#C88AFF', '#FF8AC0'];

/** The hall. `kind` 'mall' or 'station'; `time` the clock's hands (minutes past twelve, 0..720); `dim` darkens it. */
export const Hall: React.FC<{ t: number; id?: string; kind?: 'mall' | 'station'; time?: number; dim?: number; pan?: number }> = ({ t, id = 'hall', kind = 'mall', time = 255, dim = 0, pan = 0 }) => {
  const mall = kind === 'mall';
  return (
    <g>
      <defs>
        <linearGradient id={`${id}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mall ? '#3A3358' : '#5A4A44'} />
          <stop offset="0.7" stopColor={mall ? '#5A4E72' : '#7A665A'} />
          <stop offset="1" stopColor={mall ? '#6A5C7E' : '#8A7464'} />
        </linearGradient>
        <linearGradient id={`${id}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={mall ? '#D8CCE0' : '#C8B8A0'} />
          <stop offset="1" stopColor={mall ? '#9A8CB0' : '#8A7A64'} />
        </linearGradient>
        <radialGradient id={`${id}-sky`} cx="0.5" cy="0" r="0.8">
          <stop offset="0" stopColor="#FFF4D8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFF4D8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect x={-400} y={-400} width={2800} height={1900} fill={`url(#${id}-wall)`} />
      {mall ? (
        <g>
          {/* glass roof */}
          <path d="M -400 -40 L 960 -260 L 2320 -40 L 2320 60 L -400 60 Z" fill="#9AC4E8" opacity={0.5} />
          {Array.from({ length: 24 }).map((_, k) => (
            <path key={k} d={`M ${-400 + k * 120} 60 L ${960 + (k - 12) * 30} -250`} stroke="#2A2440" strokeWidth={6} opacity={0.6} />
          ))}
          <rect x={-400} y={-400} width={2800} height={900} fill={`url(#${id}-sky)`} />
          {/* two floors of shopfronts */}
          {[0, 1].map((fl) => (
            <g key={fl}>
              {Array.from({ length: 9 }).map((_, k) => {
                const x = -300 + k * 300 + (pan % 300);
                const y0 = fl === 0 ? 470 : 110;
                const name = SHOPS[(k + fl * 3) % SHOPS.length];
                const c = SIGN[(k + fl) % SIGN.length];
                return (
                  <g key={k}>
                    <rect x={x} y={y0} width={260} height={fl === 0 ? 340 : 250} fill="#2A2440" />
                    <rect x={x + 14} y={y0 + 74} width={232} height={fl === 0 ? 252 : 162} fill="#FFE9C0" opacity={0.75} />
                    {Array.from({ length: 3 }).map((_, j) => (
                      <rect key={j} x={x + 34 + j * 70} y={y0 + (fl === 0 ? 190 : 140) - rnd(k, j) * 50} width={44} height={60 + rnd(j, k) * 50} rx={6} fill={SIGN[(j + k) % SIGN.length]} opacity={0.7} />
                    ))}
                    <rect x={x + 14} y={y0 + 12} width={232} height={50} rx={8} fill="#1A1630" stroke={c} strokeWidth={4} />
                    <text x={x + 130} y={y0 + 48} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} letterSpacing={4} fill={c}>{name}</text>
                  </g>
                );
              })}
              {fl === 1 ? (
                <g>
                  <rect x={-400} y={360} width={2800} height={26} fill="#E8E0F0" />
                  {Array.from({ length: 70 }).map((_, k) => (
                    <rect key={k} x={-400 + k * 40} y={386} width={6} height={64} fill="#E8E0F0" opacity={0.8} />
                  ))}
                  <rect x={-400} y={446} width={2800} height={14} fill="#E8E0F0" />
                  <rect x={-400} y={460} width={2800} height={10} fill="#2A2440" opacity={0.5} />
                </g>
              ) : null}
            </g>
          ))}
        </g>
      ) : (
        <g>
          {/* station: stone arches, a glass roof behind them, the departure board, the big clock */}
          <rect x={-400} y={-400} width={2800} height={520} fill="#B8C8D8" opacity={0.35} />
          {Array.from({ length: 8 }).map((_, k) => {
            const x = -360 + k * 420 + (pan % 420);
            return (
              <g key={k}>
                <path d={`M ${x} 820 V 260 A 170 170 0 0 1 ${x + 340} 260 V 820`} fill="#3A2E2A" opacity={0.55} />
                <path d={`M ${x + 20} 820 V 270 A 150 150 0 0 1 ${x + 320} 270 V 820`} fill="#FFE8C0" opacity={0.18} />
                <rect x={x + 340} y={60} width={80} height={780} fill="#8A7464" />
                <rect x={x + 330} y={60} width={100} height={30} fill="#9A8474" />
              </g>
            );
          })}
          <rect x={-400} y={40} width={2800} height={40} fill="#9A8474" />
          <g transform={`translate(${1460 + (pan % 420) * 0} 470)`}>
            <rect x={-200} y={-90} width={400} height={180} rx={10} fill="#16181E" stroke="#2A2E38" strokeWidth={8} />
            {['10:42  NORTH', '10:55  COAST', '11:05  CITY'].map((l, i) => (
              <text key={i} x={-176} y={-38 + i * 52} fontFamily={FONT.ui} fontSize={34} fill="#F2C14E">{l}</text>
            ))}
          </g>
          <g transform={`translate(${HALL.clock.x} ${HALL.clock.y})`}>
            <rect x={-8} y={-300} width={16} height={180} fill="#2A2420" />
            <circle r={HALL.clock.r + 18} fill="#3A2E24" />
            <circle r={HALL.clock.r} fill="#F6EEDC" stroke="#C8A050" strokeWidth={10} />
            {Array.from({ length: 12 }).map((_, k) => {
              const a = (k / 12) * Math.PI * 2;
              return <rect key={k} x={-5} y={-HALL.clock.r + 10} width={10} height={k % 3 ? 16 : 28} fill="#2A2420" transform={`rotate(${(a * 180) / Math.PI})`} />;
            })}
            <rect x={-6} y={-70} width={12} height={74} rx={6} fill="#2A2420" transform={`rotate(${(time / 720) * 360})`} />
            <rect x={-4} y={-100} width={8} height={104} rx={4} fill="#2A2420" transform={`rotate(${((time % 60) / 60) * 360})`} />
            <circle r={10} fill="#C8A050" />
          </g>
        </g>
      )}
      {/* floor */}
      <rect x={-400} y={HALL.feet - 30} width={2800} height={900} fill={`url(#${id}-floor)`} />
      {Array.from({ length: 30 }).map((_, k) => (
        <path key={k} d={`M ${-400 + k * 110 + (pan % 110)} ${HALL.feet - 30} L ${-900 + k * 160 + (pan % 110) * 1.4} 1500`} stroke="#000" strokeWidth={3} opacity={0.08} />
      ))}
      <path d={`M -400 ${HALL.feet + 40} H 2400 M -400 ${HALL.feet + 130} H 2400`} stroke="#000" strokeWidth={3} opacity={0.08} />
      <rect x={-400} y={HALL.feet - 34} width={2800} height={8} fill="#000" opacity={0.12} />
      {dim > 0 ? <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={dim} /> : null}
    </g>
  );
};

/** The big clock on its own, close, for the cutaway (minutes past twelve). */
export const BigClock: React.FC<{ x: number; y: number; r?: number; time?: number }> = ({ x, y, r = 300, time = 255 }) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={r + 40} fill="#3A2E24" />
    <circle r={r} fill="#F6EEDC" stroke="#C8A050" strokeWidth={22} />
    {Array.from({ length: 12 }).map((_, k) => (
      <rect key={k} x={-10} y={-r + 22} width={20} height={k % 3 ? 34 : 64} fill="#2A2420" transform={`rotate(${k * 30})`} />
    ))}
    <rect x={-14} y={-r * 0.55} width={28} height={r * 0.6} rx={14} fill="#2A2420" transform={`rotate(${(time / 720) * 360})`} />
    <rect x={-9} y={-r * 0.82} width={18} height={r * 0.86} rx={9} fill="#2A2420" transform={`rotate(${((time % 60) / 60) * 360})`} />
    <circle r={24} fill="#C8A050" />
  </g>
);
