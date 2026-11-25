import React from 'react';
import { basePose, kf, camT, clamp, backOut, ShotProps, FONT, LEG_LEN } from '../../../engine';
import {
  GRANDPA, Body, faceCU, bigWord, wordF, SchBg, SchLabel, Headline, XMark, MoonIcon, SunIcon, EarthIcon, Soft, Arrow, CountUp,
  Harbor, HARBOR, dockHip, Shore, TidePool, Reef,
} from '../common';
import words from './words.json';

// Chapter 4, the Moon's job #1: the tides. Two bulges, the Sun's smaller share (a third left), Fundy 16 m -> 5 m,
// tide pools drying, tides do half the deep-ocean stirring, the coral spawning clock. Grandpa on the dock.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const LIVE = '#FF8A3D';
const DIM = '#7E8DA6';
const WARM = '#FF7A4A';
const COLD = '#5AB4FF';
const Sea: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Shore t={t} id={id} tide={0.8} />;

// ---------- S1: the Moon's job #1: the tides ----------
export const S1 = bigWord({ kicker: "THE MOON'S JOB #1", word: 'THE TIDES', color: '#F6EFE3', Bg: Sea, size: 170 });

// shared: Earth in the middle, the Moon on the right
const E = { x: 760, y: 540, r: 170 };
const M = { x: 1560, y: 540, r: 70 };

// ---------- S2: the Moon pulls on the whole Earth ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s2" />
    <EarthIcon x={E.x} y={E.y} r={E.r} />
    <MoonIcon x={M.x} y={M.y} r={M.r} />
    {[-120, 0, 120].map((dy, i) => <Arrow key={i} x0={E.x + 60} y0={E.y + dy} x1={E.x + 360} y1={E.y + dy * 0.5} t={t - 6 - i * 3} color={LIVE} bend={0} />)}
    <SchLabel x={960} y={900} t={t - 12} text="THE MOON'S GRAVITY PULLS ON THE WHOLE EARTH" size={44} />
  </g>
);

// ---------- S3: strongest near, weakest far ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s3" />
    <EarthIcon x={E.x} y={E.y} r={E.r} />
    <MoonIcon x={M.x} y={M.y} r={M.r} />
    <Arrow x0={E.x + E.r + 10} y0={E.y} x1={E.x + E.r + 330} y1={E.y} t={t - 4} color={LIVE} bend={0} />
    <Arrow x0={E.x - 70} y0={E.y} x1={E.x + 90} y1={E.y} t={t - 14} color={'#F6EFE3'} bend={0} />
    <Arrow x0={E.x - E.r - 80} y0={E.y} x1={E.x - E.r + 10} y1={E.y} t={t - 24} color={DIM} bend={0} />
    <SchLabel x={E.x + E.r + 170} y={E.y - 50} t={t - 6} text="STRONGEST" size={38} color={LIVE} />
    <SchLabel x={E.x - E.r - 40} y={E.y - 50} t={t - 26} text="WEAKEST" size={38} color={DIM} />
  </g>
);

// ---------- S4: two bulges; a town spins through them ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const a = (t * 2.2 * Math.PI) / 180;
  const bx = E.x + Math.cos(a) * (E.r + 10), by = E.y + Math.sin(a) * (E.r + 10);
  const high = Math.abs(Math.cos(a));
  return (
    <g>
      <SchBg t={t} len={len} id="c4s4" />
      <EarthIcon x={E.x} y={E.y} r={E.r} ocean={clamp(t / 20)} spin={t * 2.2} />
      <MoonIcon x={M.x} y={M.y} r={M.r} />
      <circle cx={bx} cy={by} r={16} fill={LIVE} stroke="#14121C" strokeWidth={4} />
      <g transform="translate(1260 860)">
        <rect x={-30} y={-180} width={60} height={180} rx={8} fill="none" stroke={DIM} strokeWidth={4} />
        <rect x={-26} y={-6 - 160 * high} width={52} height={160 * high + 2} rx={6} fill="#3E7AC8" />
      </g>
      <SchLabel x={1260} y={920} t={t - 8} text="YOUR BEACH" size={32} color={DIM} />
      <SchLabel x={E.x} y={900} t={t - 4} text="UP AND DOWN, TWICE A DAY" size={44} />
    </g>
  );
};

// ---------- S5: the Sun makes tides too ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s5" />
    <SunIcon x={260} y={540} r={130} />
    <EarthIcon x={1100} y={540} r={170} ocean={0.45} />
    <MoonIcon x={1700} y={540} r={60} o={0.5} />
    <Arrow x0={900} y0={540} x1={500} y1={540} t={t - 6} color="#FFC23A" bend={0} />
    <SchLabel x={700} y={860} t={t - 10} text="THE SUN MAKES TIDES TOO" size={48} color="#FFC23A" />
  </g>
);

// ---------- S6: MOON 100 vs SUN 46 ----------
const Bar: React.FC<{ x: number; t: number; h: number; color: string; label: string; val: string }> = ({ x, t, h, color, label, val }) => {
  const k = clamp(t / 14);
  return (
    <g>
      <rect x={x - 90} y={860 - 560 * h * k} width={180} height={560 * h * k} rx={10} fill={color} stroke="#14121C" strokeWidth={5} />
      <text x={x} y={930} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#F6EFE3">{label}</text>
      <text x={x} y={840 - 560 * h * k} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill={color} opacity={k}>{val}</text>
    </g>
  );
};
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s6" />
    <SchLabel x={960} y={150} t={t} text="PULL ON THE OCEANS" size={48} />
    <Bar x={720} t={t - 2} h={1} color="#D8DCE8" label="MOON" val="100" />
    <Bar x={1200} t={t - 12} h={0.46} color="#FFC23A" label="SUN" val="46" />
  </g>
);

// ---------- S7: today vs no Moon: a third ----------
const Wave: React.FC<{ x: number; t: number; amp: number; color: string }> = ({ x, t, amp, color }) => {
  const pts = Array.from({ length: 61 }).map((_, i) => `${x - 300 + i * 10},${540 - Math.sin(i / 6 + t / 10) * amp}`).join(' ');
  return <polyline points={pts} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />;
};
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s7" />
    <Wave x={560} t={t} amp={210} color="#5AB4FF" />
    <SchLabel x={560} y={860} t={t - 2} text="A BIG TIDE TODAY" size={44} />
    <g opacity={clamp((t - 14) / 8)}>
      <Wave x={1360} t={t} amp={70} color={LIVE} />
      <SchLabel x={1360} y={860} t={t - 16} text="NO MOON: ABOUT A THIRD" size={44} color={LIVE} />
    </g>
  </g>
);

// ---------- S8-S10: the Bay of Fundy ----------
const Fundy: React.FC<{ t: number; level: number; label?: string; showBuilding?: number; mark5?: number }> = ({ t, level, showBuilding = 0, mark5 = 0 }) => {
  const base = 920, perM = 34;
  const wy = base - level * perM;
  return (
    <g>
      {/* building, 5 storeys */}
      <g opacity={showBuilding}>
        <rect x={1140} y={base - 16 * perM} width={340} height={16 * perM} fill="#3A3650" stroke="#F6EFE3" strokeWidth={5} />
        {Array.from({ length: 5 }).map((_, k) => (
          <g key={k}>
            <path d={`M 1140 ${base - (k + 1) * 3.2 * perM} L 1480 ${base - (k + 1) * 3.2 * perM}`} stroke="#6A6680" strokeWidth={3} />
            {[0, 1, 2].map((j) => <rect key={j} x={1170 + j * 105} y={base - (k + 1) * 3.2 * perM + 30} width={70} height={60} fill="#FFD27A" opacity={0.7} />)}
          </g>
        ))}
      </g>
      {/* the water */}
      <rect x={-400} y={wy} width={2800} height={1500} fill="#3E7AC8" opacity={0.75} />
      <path d={Array.from({ length: 30 }).map((_, i) => `${i ? 'L' : 'M'} ${-400 + i * 100} ${wy + Math.sin(i + t / 6) * 6}`).join(' ')} stroke="#A8D4EE" strokeWidth={6} fill="none" />
      {/* the ruler */}
      <g>
        <path d={`M 520 ${base} L 520 ${base - 16 * perM}`} stroke="#F6EFE3" strokeWidth={5} />
        {[0, 4, 8, 12, 16].map((m) => (
          <g key={m}>
            <path d={`M 500 ${base - m * perM} L 540 ${base - m * perM}`} stroke="#F6EFE3" strokeWidth={4} />
            <text x={480} y={base - m * perM + 12} textAnchor="end" fontFamily={FONT.ui} fontSize={30} fill="#F6EFE3">{m} m</text>
          </g>
        ))}
        {mark5 ? <path d={`M 500 ${base - 5 * perM} L 1600 ${base - 5 * perM}`} stroke={LIVE} strokeWidth={4} strokeDasharray="14 10" opacity={mark5} /> : null}
      </g>
    </g>
  );
};
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s8" />
    <Fundy t={t} level={kf(t, [[0, 0], [40, 16]])} />
    <CountUp x={960} y={180} t={t} to={16} dur={40} size={150} color="#F6EFE3" suffix=" M" />
    <SchLabel x={960} y={250} t={t - 6} text="BAY OF FUNDY, CANADA" size={42} color="#F6EFE3" />
  </g>
);
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s9" />
    <Fundy t={t} level={kf(t, [[0, 2], [40, 16]])} showBuilding={clamp(t / 8)} />
    <SchLabel x={960} y={130} t={t - 4} text="A FIVE-STORY BUILDING" size={56} />
    <SchLabel x={960} y={200} t={t - 20} text="TWICE A DAY" size={42} color={LIVE} />
  </g>
);
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s10" />
    <Fundy t={t} level={kf(t, [[0, 16], [30, 5]])} showBuilding={1} mark5={clamp((t - 24) / 6)} />
    <Headline y={200} t={t} text="BARELY 5 M" size={120} color={LIVE} delay={24} />
  </g>
);

// ---------- S11: rocks and tide pools ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 800], [len, 1100]]), 620, 1.15)}>
    <Shore t={t} tide={1} />
  </g>
);

// ---------- S12: life in the pool ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <TidePool t={t} level={1} />
  </g>
);

// ---------- S13: the pool dries, the crab sweats ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1000, 680, kf(t, [[0, 1.1], [len, 1.35]]))}>
    <TidePool t={t} level={kf(t, [[0, 1], [len * 0.8, 0.1]])} />
  </g>
);

// ---------- S14-S17: the deep ocean ----------
const Ocean: React.FC<{ t: number; stir: number; fade?: number }> = ({ t, stir, fade = 0 }) => (
  <g>
    <rect x={160} y={240} width={1600} height={640} rx={20} fill="#0E2A4A" stroke="#F6EFE3" strokeWidth={5} />
    <rect x={160} y={240} width={1600} height={170} rx={20} fill="#C86A4A" opacity={0.55} />
    <rect x={160} y={700} width={1600} height={180} rx={20} fill="#2A5AA8" opacity={0.6} />
    <text x={200} y={300} fontFamily={FONT.ui} fontSize={34} fill="#FFD2B8">WARM</text>
    <text x={200} y={850} fontFamily={FONT.ui} fontSize={34} fill="#B8D8FF">COLD</text>
    {stir > 0
      ? [0, 1, 2, 3, 4, 5].map((i) => {
          const o = i % 2 ? 1 - fade : 1;
          const cx = 380 + i * 240, a = (t * 4 + i * 60) % 360;
          return (
            <g key={i} opacity={stir * o} transform={`rotate(${a} ${cx} 560)`}>
              <path d={`M ${cx - 90} 560 A 90 150 0 1 1 ${cx + 60} 670`} fill="none" stroke={i % 2 ? COLD : WARM} strokeWidth={10} strokeLinecap="round" />
              <path d={`M ${cx + 60} 670 l -10 -40 l 40 20 z`} fill={i % 2 ? COLD : WARM} />
            </g>
          );
        })
      : null}
  </g>
);
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s14" />
    <g transform={camT(960, 560, kf(t, [[0, 0.9], [len, 1]]))}><Ocean t={t} stir={0} /></g>
    <SchLabel x={960} y={170} t={t - 2} text="THE DEEP OCEAN" size={52} />
  </g>
);
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s15" />
    <Ocean t={t} stir={clamp(t / 12)} />
    <Headline y={170} t={t} text="TIDES DO HALF THE STIRRING" size={84} color={LIVE} delay={16} />
  </g>
);
const Globe: React.FC<{ t: number; fade: number }> = ({ t, fade }) => (
  <g>
    <EarthIcon x={960} y={560} r={300} />
    {[0, 1, 2, 3].map((i) => {
      const warm = i % 2 === 0;
      const y = 380 + i * 120;
      const dash = (t * 6) % 60;
      return (
        <path key={i} d={`M ${720} ${y} Q 960 ${y + (warm ? -60 : 60)} ${1200} ${y}`} stroke={warm ? WARM : COLD} strokeWidth={12} fill="none" strokeDasharray="34 26" strokeDashoffset={-dash} opacity={i >= 2 ? 1 - fade : 1} strokeLinecap="round" />
      );
    })}
  </g>
);
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s16" />
    <Globe t={t} fade={0} />
    <SchLabel x={960} y={970} t={t - 4} text="CURRENTS CARRY HEAT AROUND THE PLANET" size={44} />
  </g>
);
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s17" />
    <Globe t={t} fade={clamp((t - 6) / 20)} />
    <g transform={`translate(1460 300) scale(${backOut(clamp((t - 30) / 8))})`}>
      <circle r={80} fill="#F6EFE3" stroke="#14121C" strokeWidth={6} />
      <text textAnchor="middle" y={40} fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#14121C">?</text>
    </g>
    <SchLabel x={960} y={970} t={t - 30} text="CURRENTS AND WEATHER START TO CHANGE" size={44} color={LIVE} />
  </g>
);

// ---------- S18 / S20: the Moon as a clock ----------
const MoonClock: React.FC<{ t: number; blank: number }> = ({ t, blank }) => (
  <g transform="translate(960 520)">
    <circle r={330} fill="#14122A" stroke="#F6EFE3" strokeWidth={10} />
    {Array.from({ length: 8 }).map((_, i) => {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const ph = (i / 8) * Math.PI * 2;
      const x = Math.cos(a) * 250, y = Math.sin(a) * 250;
      return (
        <g key={i} opacity={1 - clamp(blank * 2 - i * 0.12)}>
          <circle cx={x} cy={y} r={38} fill="#3A3646" />
          <ellipse cx={x + Math.cos(ph) * 19} cy={y} rx={38 * Math.abs(Math.sin(ph / 2))} ry={38} fill="#E9E4DA" />
        </g>
      );
    })}
    <g transform={`rotate(${blank > 0 ? 200 + Math.sin(t / 3) * 3 : t * 3})`} opacity={1 - blank * 0.6}>
      <path d="M 0 20 L 0 -190" stroke={LIVE} strokeWidth={14} strokeLinecap="round" />
    </g>
    <circle r={22} fill={LIVE} />
  </g>
);
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s18" />
    <MoonClock t={t} blank={0} />
    <SchLabel x={960} y={1000} t={t - 6} text="MOONLIGHT IS A CLOCK" size={48} />
  </g>
);
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s20" />
    <MoonClock t={t} blank={clamp(t / 30)} />
    <SchLabel x={960} y={1000} t={t - 20} text="THE CLOCK IS GONE" size={52} color={LIVE} />
  </g>
);

// ---------- S19: the corals spawn together ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, kf(t, [[0, 640], [len, 520]]), kf(t, [[0, 1.2], [len, 1.05]]))}>
      <Reef t={t} spawn={clamp(t / Math.max(20, len))} />
    </g>
    <g transform={`translate(330 160) scale(${backOut(clamp((t - 10) / 8))})`}>
      <rect x={-260} y={-50} width={520} height={86} rx={43} fill="#14121C" opacity={0.85} />
      <text textAnchor="middle" y={12} fontFamily={FONT.ui} fontSize={38} fill="#FFD23A">GREAT BARRIER REEF</text>
    </g>
  </g>
);

// ---------- S21: the reef at night, question marks ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 600, 1.15)}><Reef t={t} /></g>
    {[[560, 380, 0], [1000, 300, 8], [1420, 420, 16]].map(([x, y, d], i) => (
      <g key={i} transform={`translate(${x} ${y + Math.sin(t / 8 + i) * 10}) scale(${backOut(clamp((t - d) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">?</text>
      </g>
    ))}
  </g>
);

// ---------- S22: scientists count the days ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c4s22" />
    <g transform="translate(960 560)">
      <rect x={-520} y={-340} width={1040} height={640} rx={16} fill="#F4EEDC" stroke="#14121C" strokeWidth={8} />
      <rect x={-520} y={-340} width={1040} height={100} rx={16} fill="#2E5A7A" />
      <text textAnchor="middle" y={-268} fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#FFFFFF">DAYS WITHOUT A MOON</text>
      {Array.from({ length: 21 }).map((_, i) => {
        const x = -440 + (i % 7) * 146, y = -170 + Math.floor(i / 7) * 150;
        const k = clamp((t - 4 - i * 1.6) / 4);
        return (
          <g key={i}>
            <text x={x} y={y} fontFamily={FONT.ui} fontSize={40} fill="#6A6680">{i + 1}</text>
            {k > 0 ? <path d={`M ${x - 10} ${y - 40} L ${x - 10 + 80 * k} ${y + 30 * k}`} stroke="#C8452A" strokeWidth={8} strokeLinecap="round" /> : null}
          </g>
        );
      })}
    </g>
  </g>
);

// ---------- S23: grandpa on the dock, the boat in the mud ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 600], [len, 660]]), 500, kf(t, [[0, 1.25], [len, 1.32]]))}>
    <Harbor t={t} tide={0.05} />
    <Body look={GRANDPA} pose={{ ...basePose, x: 400, y: dockHip(0.8), scale: 0.8, yaw: 0.5, armL: { a: 20, b: 0 }, armR: { a: 20, b: 0 } }} t={t} faces={[[0, 'worried']]} seed={6} />
  </g>
);

// ---------- S24: grandpa: never stood me up before ----------
const HarborBg: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Harbor t={t} id={id} tide={0.05} />;
export const S24 = faceCU({ look: GRANDPA, Bg: HarborBg, faces: [[0, 'worried']], yaw: 0.3, eyes: 0.2, zoom: [3.0, 3.2], words: W, talk: [at('Fifty') / 30 - 0.05, at('before') / 30 + 0.5] });

// keep imports used
void XMark; void Soft; void HARBOR; void LEG_LEN; void rel;
