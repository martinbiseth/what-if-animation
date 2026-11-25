import React from 'react';
import { basePose, kf, camT, clamp, backOut, ShotProps, FONT, Pose } from '../../../engine';
import {
  YOU, MO, SCI, SCI2, Body, faceCU, bigWord, wordF, SchBg, SchLabel, Headline, MoonIcon, SunIcon, EarthIcon, Arrow, CountUp,
  PressRoom, pressHip, Observatory, MoonSurface, LivingRoom, LIVING, sofaSit, PhoneTall,
} from '../common';
import words from './words.json';

// Chapter 5, someone notices: day 3, the press conference. Laser mirrors (2.5 s, 3.8 cm a year), the light stopped
// coming back at 9:47. The tilt (23 degrees, seasons, the hand on the top, Mars), the day-length brake (18 h -> 24 h).
// Mo: "slow bad?" Not all of it. Ellie: they're hatching.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const LIVE = '#FF8A3D';
const DIM = '#7E8DA6';

// ---------- the press room, with the panel seated behind the table ----------
const TABLE_FRONT = (
  <g>
    <rect x={180} y={640} width={980} height={60} fill="#3A3254" stroke="#14121C" strokeWidth={5} />
    <rect x={200} y={700} width={940} height={150} fill="#2E2846" stroke="#14121C" strokeWidth={5} />
    <text x={670} y={790} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#9AA8D8" letterSpacing={6}>SPACE AGENCY BRIEFING</text>
    {[340, 670, 1000].map((x, i) => <g key={i}><path d={`M ${x} 640 L ${x} 590`} stroke="#14121C" strokeWidth={6} /><rect x={x - 10} y={570} width={20} height={30} rx={8} fill="#14121C" /></g>)}
  </g>
);
const TiltedEarth = (t: number) => (
  <g>
    <rect width={1920} height={1100} fill="#0B1020" />
    <EarthIcon x={960} y={550} r={300} tilt={23} spin={t} />
    <path d="M 960 550 m -170 -400 L 1130 950" stroke="#FF8A3D" strokeWidth={10} transform="rotate(0)" />
  </g>
);
const Panel: React.FC<{ t: number; screen?: (t: number) => React.ReactNode; faces?: [number, 'tired' | 'worried' | 'neutral'][] }> = ({ t, screen, faces = [[0, 'tired']] }) => (
  <g>
    <PressRoom t={t} screen={screen} />
    {[[340, SCI], [670, SCI2], [1000, SCI]].map(([x, look], i) => (
      <Body key={i} look={look as typeof SCI} pose={{ ...basePose, x: x as number, y: pressHip(0.8), scale: 0.8, yaw: 0.1 - i * 0.1 }} t={t + i * 11} faces={faces} seed={20 + i} />
    ))}
    {TABLE_FRONT}
  </g>
);
const PressBg: React.FC<{ t: number; id?: string }> = ({ t, id }) => <PressRoom t={t} id={id} />;

// ---------- S1: day 3, the press conference ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 760], [len, 800]]), 520, kf(t, [[0, 1.3], [len, 1.38]]))}><Panel t={t} /></g>
    <g transform={`translate(330 140) scale(${backOut(clamp((t - 4) / 8))})`}>
      <rect x={-170} y={-55} width={340} height={96} rx={48} fill="#14121C" opacity={0.85} />
      <text textAnchor="middle" y={16} fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#FFD23A">DAY 3</text>
    </g>
  </g>
);

// ---------- S2: a scientist with tired eyes ----------
export const S2 = faceCU({ look: SCI2, Bg: PressBg, faces: [[0, 'tired']], yaw: 0.15, eyes: 0, zoom: [3.1, 3.3] });

// ---------- S3 / S23: you and Mo on the sofa, the news on the TV ----------
const sit = (w: number, o: Partial<Pose> = {}): Pose => ({
  ...basePose, ...sofaSit(w), yaw: -0.55, facing: -1, legL: { a: 84, b: -84 }, legR: { a: 78, b: -80 }, armL: { a: 40, b: 70 }, armR: { a: 36, b: 74 }, ...o,
});
const NewsTV: React.FC<{ t: number }> = ({ t }) => {
  const Q = LIVING.Q;
  return (
    <g>
      <polygon points={Q([[0, 0.32, 0.31], [0, 0.32, 0.59], [0, 0.6, 0.59], [0, 0.6, 0.31]])} fill="#1E2440" />
      <polygon points={Q([[0, 0.52, 0.31], [0, 0.52, 0.59], [0, 0.6, 0.59], [0, 0.6, 0.31]])} fill="#C8452A" />
      <polygon points={Q([[0, 0.36, 0.36], [0, 0.36, 0.42], [0, 0.48, 0.42], [0, 0.48, 0.36]])} fill="#6A7AAE" />
      <polygon points={Q([[0, 0.36, 0.46], [0, 0.36, 0.52], [0, 0.48, 0.52], [0, 0.48, 0.46]])} fill="#6A7AAE" opacity={0.7 + 0.3 * Math.sin(t / 4)} />
    </g>
  );
};
const Sofa: React.FC<{ t: number; mo?: Partial<Pose>; moFace?: [number, 'happy' | 'worried' | 'neutral' | 'shock'][]; youFace?: [number, 'happy' | 'worried' | 'neutral' | 'shock'][] }> = ({ t, mo = {}, moFace = [[0, 'worried']], youFace = [[0, 'worried']] }) => (
  <g>
    <LivingRoom t={t + 40} power={1} tv={0} veil={0.25} />
    <NewsTV t={t} />
    <Body look={YOU} pose={sit(0.42)} t={t} faces={youFace} />
    <Body look={MO} pose={sit(0.68, mo)} t={t} faces={moFace} seed={3} />
  </g>
);
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const s = sofaSit(0.55);
  return (
    <g transform={camT(kf(t, [[0, s.x - 200], [len, s.x - 160]]), s.y - 120, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Sofa t={t} />
    </g>
  );
};

// ---------- S4: the mirrors left on the Moon ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [len, 900]]), 640, kf(t, [[0, 1.1], [len, 1.3]]))}><MoonSurface t={t} /></g>
    <SchLabel x={960} y={1000} t={t - 8} text="MIRRORS LEFT BY THE ASTRONAUTS" size={44} color="#F6EFE3" />
  </g>
);

// ---------- S5: an observatory fires a laser ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 600], [len, 480]]), 1.05)}>
    <Observatory t={t} laser={clamp((t - 10) / 14)} />
  </g>
);

// ---------- S6 / S8: Earth to Moon and back ----------
const EX = 360, MX = 1560, Y = 520;
const Trip: React.FC<{ t: number; back: boolean }> = ({ t, back }) => {
  const cyc = 75; // 2.5 s
  const k = (t % (cyc + 20)) / cyc;
  const x = k < 0.5 ? EX + (MX - EX) * k * 2 : back ? MX - (MX - EX) * (k - 0.5) * 2 : -999;
  const y = k < 0.5 ? Y - 20 : Y + 20;
  return k <= 1 && x > 0 ? (
    <g>
      <circle cx={x} cy={y} r={14} fill="#5BFF7A" />
      <circle cx={x} cy={y} r={34} fill="#5BFF7A" opacity={0.25} />
    </g>
  ) : null;
};
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s6" />
    <EarthIcon x={EX} y={Y} r={130} />
    <MoonIcon x={MX} y={Y} r={60} />
    <path d={`M ${EX + 140} ${Y} L ${MX - 70} ${Y}`} stroke={DIM} strokeWidth={3} strokeDasharray="10 12" />
    <Trip t={t} back />
    <CountUp x={960} y={850} t={t - 4} to={2.5} dur={75} size={120} color="#5BFF7A" suffix=" S" format={(v) => v.toFixed(1)} />
    <SchLabel x={960} y={930} t={t - 10} text="THERE AND BACK" size={40} />
  </g>
);

// ---------- S7: 3.8 cm a year ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s7" />
    <EarthIcon x={EX} y={Y} r={130} />
    <MoonIcon x={MX + kf(t, [[0, 0], [len, 70]])} y={Y} r={60} />
    <Arrow x0={MX + 90} y0={Y - 110} x1={MX + 240} y1={Y - 110} t={t - 6} color={LIVE} bend={0} />
    <Headline y={860} t={t} text="3.8 CM A YEAR" size={120} color={LIVE} delay={8} />
    <SchLabel x={960} y={940} t={t - 20} text="THE MOON IS DRIFTING AWAY" size={40} />
  </g>
);

// ---------- S8: 9:47 PM, nothing comes back ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s8" />
    <EarthIcon x={EX} y={Y} r={130} />
    <MoonIcon x={MX} y={Y} r={60} dash />
    <path d={`M ${EX + 140} ${Y} L ${MX - 70} ${Y}`} stroke={DIM} strokeWidth={3} strokeDasharray="10 12" />
    <Trip t={t} back={false} />
    <text x={960} y={250} textAnchor="middle" fontFamily={FONT.ui} fontSize={110} fill="#F6EFE3">9:47 PM</text>
    <Headline y={860} t={t} text="NOTHING CAME BACK" size={110} color={LIVE} delay={40} />
  </g>
);

// ---------- S9: the screen: the Earth, tilted ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1100], [len, 1300]]), kf(t, [[0, 480], [len, 360]]), kf(t, [[0, 1.2], [len, 1.9]]))}>
    <Panel t={t + 60} screen={TiltedEarth} faces={[[0, 'worried']]} />
  </g>
);

// ---------- S10: this is what really worries us ----------
export const S10 = faceCU({ look: SCI, Bg: PressBg, faces: [[0, 'worried']], yaw: -0.2, eyes: 0.2, zoom: [3.1, 3.3], words: W, talk: [at('This') / 30 - 0.05, at('worries') / 30 + 0.8] });

// ---------- S11: the axis tilted 23 degrees ----------
const Axis: React.FC<{ x: number; y: number; r: number; tilt: number; t: number }> = ({ x, y, r, tilt, t }) => (
  <g>
    <EarthIcon x={x} y={y} r={r} tilt={tilt} spin={t * 2} />
    <g transform={`translate(${x} ${y}) rotate(${tilt})`}>
      <path d={`M 0 ${-r - 90} L 0 ${r + 90}`} stroke={LIVE} strokeWidth={8} strokeLinecap="round" />
    </g>
    <path d={`M ${x} ${y - r - 90} L ${x} ${y + r + 90}`} stroke={DIM} strokeWidth={4} strokeDasharray="12 10" />
  </g>
);
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s11" />
    <Axis x={960} y={520} r={230} tilt={kf(t, [[0, 0], [20, 23.4]])} t={t} />
    <CountUp x={1420} y={300} t={t} to={23} dur={20} size={110} color={LIVE} suffix="°" />
  </g>
);

// ---------- S12: seasons around the Sun ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s12" />
    <SunIcon x={960} y={520} r={90} />
    <ellipse cx={960} cy={520} rx={620} ry={250} fill="none" stroke={DIM} strokeWidth={3} strokeDasharray="10 10" />
    <Axis x={360} y={520} r={80} tilt={23} t={t} />
    <Axis x={1560} y={520} r={80} tilt={23} t={t} />
    <SchLabel x={360} y={880} t={t - 6} text="SUMMER UP NORTH" size={38} color={LIVE} />
    <SchLabel x={1560} y={880} t={t - 16} text="WINTER UP NORTH" size={38} color="#5AB4FF" />
  </g>
);

// ---------- S13 / S14: the spinning top and the hand ----------
const Top: React.FC<{ x: number; y: number; t: number; wobble: number; hand: number }> = ({ x, y, t, wobble, hand }) => {
  const a = Math.sin(t / 5) * (2 + wobble * 30);
  return (
    <g>
      <ellipse cx={x} cy={y + 10} rx={160} ry={24} fill="#000" opacity={0.25} />
      <g transform={`rotate(${a} ${x} ${y})`}>
        <path d={`M ${x} ${y} L ${x - 140} ${y - 170} Q ${x} ${y - 240} ${x + 140} ${y - 170} Z`} fill="#C8452A" stroke="#F6EFE3" strokeWidth={6} strokeLinejoin="round" />
        <path d={`M ${x - 140} ${y - 170} Q ${x} ${y - 110} ${x + 140} ${y - 170}`} stroke="#F6EFE3" strokeWidth={5} fill="none" />
        {[0, 1, 2].map((i) => <path key={i} d={`M ${x - 100 + ((t * 8 + i * 70) % 200)} ${y - 170} l 0 40`} stroke="#FFD23A" strokeWidth={8} opacity={0.6} />)}
        <path d={`M ${x} ${y - 215} L ${x} ${y - 320}`} stroke="#F6EFE3" strokeWidth={14} strokeLinecap="round" />
        {hand > 0 ? (
          <g opacity={hand} transform={`translate(${x} ${y - 340})`}>
            <rect x={-70} y={-120} width={140} height={110} rx={40} fill="#D8DCE8" stroke="#14121C" strokeWidth={5} />
            {[-45, -15, 15, 45].map((dx, i) => <rect key={i} x={dx - 13} y={-30} width={26} height={50} rx={13} fill="#D8DCE8" stroke="#14121C" strokeWidth={5} />)}
            <text y={-56} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#14121C">MOON</text>
          </g>
        ) : null}
      </g>
    </g>
  );
};
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s13" />
    <Top x={960} y={860} t={t} wobble={0} hand={clamp((t - 8) / 8)} />
    <SchLabel x={960} y={170} t={t - 4} text="THE MOON KEEPS THE TILT STEADY" size={46} />
  </g>
);
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s14" />
    <Top x={960} y={860} t={t} wobble={clamp(t / 30)} hand={1 - clamp(t / 6)} />
    <SchLabel x={960} y={170} t={t - 4} text="WITHOUT IT, THE TILT CAN WANDER" size={46} color={LIVE} />
  </g>
);

// ---------- S15: millions of years ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s15" />
    <Axis x={960} y={560} r={210} tilt={23 + Math.sin(t / 12) * 22} t={t} />
    <Headline y={170} t={t} text="OVER MILLIONS OF YEARS" size={90} color="#F6EFE3" delay={4} />
  </g>
);

// ---------- S16: Mars, no big moon ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const tilt = 25 + Math.sin(t / 10) * 14;
  return (
    <g>
      <SchBg t={t} len={len} id="c5s16" />
      <g transform={`translate(960 540) rotate(${tilt})`}>
        <circle r={220} fill="#C8643A" stroke="#F6EFE3" strokeWidth={6} />
        <ellipse cx={-60} cy={-40} rx={70} ry={30} fill="#A84E2A" />
        <ellipse cx={80} cy={70} rx={50} ry={22} fill="#A84E2A" />
        <ellipse cx={0} cy={-200} rx={60} ry={16} fill="#F6EFE3" />
        <path d="M 0 -320 L 0 320" stroke={LIVE} strokeWidth={8} strokeLinecap="round" />
      </g>
      <SchLabel x={960} y={150} t={t - 2} text="MARS · NO BIG MOON" size={52} />
      <SchLabel x={960} y={970} t={t - 14} text="ITS TILT HAS SWUNG BY MORE THAN 20°" size={44} color={LIVE} />
    </g>
  );
};

// ---------- S17: hotter summers, longer winters ----------
const Thermo: React.FC<{ x: number; t: number; hot: boolean; label: string }> = ({ x, t, hot, label }) => {
  const k = clamp(t / 16);
  const lvl = hot ? 0.4 + 0.55 * k : 0.4 - 0.32 * k;
  const c = hot ? '#FF5A3A' : '#5AB4FF';
  return (
    <g>
      <rect x={x - 40} y={240} width={80} height={480} rx={40} fill="#F6EFE3" stroke="#14121C" strokeWidth={6} />
      <circle cx={x} cy={760} r={70} fill={c} stroke="#14121C" strokeWidth={6} />
      <rect x={x - 22} y={700 - 440 * lvl} width={44} height={440 * lvl + 20} rx={20} fill={c} />
      <text x={x} y={920} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={c}>{label}</text>
    </g>
  );
};
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s17" />
    <Thermo x={640} t={t} hot label="HOTTER SUMMERS" />
    <Thermo x={1280} t={t - 10} hot={false} label="LONGER WINTERS" />
  </g>
);

// ---------- S18: one more slow change ----------
const SchFC: React.FC<{ t: number; id?: string }> = ({ t, id }) => <SchBg t={t} len={100} id={id ?? 'c5s18b'} />;
export const S18 = bigWord({ word: 'ONE MORE SLOW CHANGE', color: '#F6EFE3', Bg: SchFC, size: 120 });

// ---------- S19: the tides brake the spinning Earth ----------
const Brake: React.FC<{ x: number; y: number; t: number; on: number }> = ({ x, y, t, on }) => (
  <g transform={`translate(${x} ${y}) rotate(${-30 + 40 * (1 - on)})`}>
    <rect x={-20} y={-180} width={40} height={180} rx={14} fill="#B8BCC8" stroke="#14121C" strokeWidth={5} />
    <rect x={-44} y={-240} width={88} height={80} rx={26} fill="#C8452A" stroke="#14121C" strokeWidth={5} />
  </g>
);
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s19" />
    <EarthIcon x={760} y={540} r={220} ocean={0.6} spin={t * kf(t, [[0, 4], [len, 2]])} />
    <MoonIcon x={1500} y={540} r={70} />
    <Arrow x0={560} y0={260} x1={980} y1={280} t={t - 4} color={DIM} bend={0.3} />
    <Brake x={1180} y={900} t={t} on={clamp((t - 10) / 8)} />
    <SchLabel x={960} y={970} t={t - 14} text="THE TIDES WORK LIKE A HAND BRAKE" size={44} color={LIVE} />
  </g>
);

// ---------- S20: 18 hours, a billion years ago ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s20" />
    <Headline y={520} t={t} text="18-HOUR DAYS" size={150} color={LIVE} delay={2} />
    <SchLabel x={960} y={640} t={t - 12} text="MORE THAN A BILLION YEARS AGO" size={48} />
  </g>
);

// ---------- S21: the day stretches from 18 to 24 ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const h = Math.round(kf(t, [[4, 18], [Math.max(20, len - 10), 24]]));
  return (
    <g>
      <SchBg t={t} len={len} id="c5s21" />
      <g transform="translate(960 480)">
        <circle r={260} fill="#14122A" stroke="#F6EFE3" strokeWidth={10} />
        {Array.from({ length: h }).map((_, i) => {
          const a = (i / h) * Math.PI * 2 - Math.PI / 2;
          return <path key={i} d={`M ${Math.cos(a) * 220} ${Math.sin(a) * 220} L ${Math.cos(a) * 250} ${Math.sin(a) * 250}`} stroke="#F6EFE3" strokeWidth={6} />;
        })}
        <path d={`M 0 0 L ${Math.cos(t / 8) * 180} ${Math.sin(t / 8) * 180}`} stroke={LIVE} strokeWidth={10} strokeLinecap="round" />
      </g>
      <text x={960} y={900} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3">{h} HOURS</text>
    </g>
  );
};

// ---------- S22: the brake lets go ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c5s22" />
    <EarthIcon x={760} y={540} r={220} spin={t * 4} />
    <MoonIcon x={1500} y={540} r={70} dash />
    <Brake x={1180} y={900} t={t} on={1 - clamp((t - 4) / 8)} />
    <SchLabel x={960} y={970} t={t - 8} text="THE BRAKE ALMOST LETS GO" size={48} color={LIVE} />
  </g>
);

// ---------- S23: Mo raises his hand ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const s = sofaSit(0.55);
  const up = clamp((t - 6) / 8);
  return (
    <g transform={camT(kf(t, [[0, s.x - 120], [len, s.x - 90]]), s.y - 140, kf(t, [[0, 2.0], [len, 2.1]]))}>
      <Sofa t={t} mo={{ armL: { a: 40 + 110 * up, b: 70 - 40 * up } }} moFace={[[0, 'neutral']]} youFace={[[0, 'neutral']]} />
    </g>
  );
};

// ---------- S24: Mo: slow bad? / S25: you: not all of it is slow ----------
const SofaBg: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={1} tv={0} veil={0.25} />;
export const S24 = faceCU({ look: MO, Bg: SofaBg, faces: [[0, 'worried']], yaw: -0.3, eyes: 0.4, zoom: [3.1, 3.3], words: W, talk: [at('So') / 30 - 0.05, at('slow', 2) / 30 + 0.7] });
export const S25 = faceCU({ look: YOU, Bg: SofaBg, faces: [[0, 'neutral'], [30, 'worried']], yaw: 0.3, eyes: -0.4, zoom: [3.1, 3.3] });

// ---------- S26: Ellie: THEY'RE HATCHING!! ----------
export const S26: React.FC<ShotProps> = ({ t }) => (
  <PhoneTall t={t} rot={-3}>
    <rect width={900} height={1720} fill="#F4F2FA" />
    <rect width={900} height={180} fill="#2E2A46" />
    <text x={450} y={115} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#F6EFE3">ELLIE</text>
    {['the nest is moving', "THEY'RE HATCHING!!", 'come NOW!!'].map((m, i) => (
      <g key={i} transform={`translate(60 ${300 + i * 250}) scale(${backOut(clamp((t - 4 - i * 10) / 6))})`}>
        <rect x={0} y={0} width={780} height={190} rx={50} fill={i === 1 ? '#FF8A3D' : '#E4E0F0'} />
        <text x={40} y={122} fontFamily={FONT.title} fontWeight={800} fontSize={66} fill={i === 1 ? '#FFFFFF' : '#14121C'}>{m}</text>
      </g>
    ))}
  </PhoneTall>
);
