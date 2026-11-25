import React from 'react';
import { Pose, basePose, kf, camT, clamp, backOut, ShotProps, FONT, Glow, TitleCard, Bedroom, BedDuvet, bedSit, Kitchen, KITCHEN, KitchenIsland, stand, talkShot, LEG_LEN } from '../../../engine';
import {
  YOU, MO, ELLIE, MOM, GRANDPA, Body, faceCU, wordF, RoofMoon, SchBg, SchLabel, Headline, XMark, MoonIcon, SunIcon, EarthIcon, Soft,
  StreetModern, STREETM, streetHip, Harbor, HARBOR, dockHip, Beach, BEACH, Nest, Sign, DrawOn, Arrow,
} from '../common';
import words from './words.json';

// Chapter 2, the rules: no explosion, no rocks, the Moon just stops existing. What doesn't change: your weight, the
// Earth's orbit, the sunrise; a normal morning. But the Moon had jobs. Plants: Mo's grandpa and his tide table,
// Ellie's sea turtle nest behind the orange fence. "Remember that nest."

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const LIVE = '#FF8A3D';
const DIM = '#7E8DA6';

// ---------- S1: the title over the empty sky ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1300, 360, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <RoofMoon t={t + 300} moon={0} hole={1} />
    </g>
    <TitleCard t={t + 20} lines={["HERE'S", 'THE DEAL']} accent="#FFD23A" y={720} size={130} />
  </g>
);

// ---------- S2: no explosion ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c2s2" />
    <MoonIcon x={960} y={440} r={130} />
    {Array.from({ length: 10 }).map((_, i) => {
      const a = (i / 10) * Math.PI * 2;
      return <path key={i} d={`M ${960 + Math.cos(a) * 170} ${440 + Math.sin(a) * 170} L ${960 + Math.cos(a) * 260} ${440 + Math.sin(a) * 260}`} stroke={LIVE} strokeWidth={10} strokeLinecap="round" opacity={0.8} />;
    })}
    <XMark x={960} y={440} s={2} t={t - 6} />
    <Headline y={820} t={t} text="NO EXPLOSION" size={110} delay={4} />
  </g>
);

// ---------- S3: no rocks, no crater ----------
export const S3: React.FC<ShotProps> = ({ t, len, f }) => {
  const c = rel(f, t, 'crater');
  return (
    <g>
      <SchBg t={t} len={len} id="c2s3" />
      <EarthIcon x={960} y={1040} r={420} />
      {[[600, 260], [900, 160], [1280, 300]].map(([x, y], i) => (
        <path key={i} d={`M ${x - 40} ${y} l 30 -30 l 50 10 l 10 40 l -40 30 l -40 -10 Z`} fill="#8A8A9A" stroke="#F6EFE3" strokeWidth={4} transform={`translate(${kf(t, [[0, 0], [len, 40]])} ${kf(t, [[0, 0], [len, 120]])})`} />
      ))}
      <XMark x={900} y={260} s={1.6} t={t - 4} />
      <SchLabel x={560} y={520} t={t - 4} text="NO FALLING ROCKS" size={46} color={LIVE} />
      <SchLabel x={1360} y={520} t={t - c} text="NO GIANT CRATER" size={46} color={LIVE} />
    </g>
  );
};

// ---------- S4: the Moon just stops existing ----------
export const S4: React.FC<ShotProps> = ({ t, len, f }) => {
  const g = rel(f, t, 'stops') + 4;
  const o = t < g ? 1 : clamp(1 - (t - g) / 6);
  return (
    <g>
      <SchBg t={t} len={len} id="c2s4" />
      <MoonIcon x={960} y={480} r={150} o={o} />
      <MoonIcon x={960} y={480} r={150} dash o={1 - o} />
      {t > g ? <text x={960} y={500} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#F6EFE3" opacity={clamp((t - g) / 4) * clamp(1 - (t - g - 20) / 10)}>POOF</text> : null}
      <SchLabel x={960} y={800} t={t - g} text="IT JUST STOPS EXISTING" size={52} />
    </g>
  );
};

// ---------- S5: you in bed: you don't float off ----------
const BS = bedSit(0.2);
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 860], [len, 880]]), 520, kf(t, [[0, 1.6], [len, 1.75]]))}>
    <Bedroom t={t} veil={0.6} lamp={0.4} clock="06:58" moon={false} />
    <Body look={YOU} pose={{ ...basePose, x: BS.x, y: BS.y, scale: BS.scale, yaw: 0.3, legL: { a: 90, b: 0 }, legR: { a: 88, b: 0 }, armL: { a: 30, b: -30 }, armR: { a: 50 + 10 * Math.sin(t / 8), b: -40 }, headTilt: -8 }} t={t} faces={[[0, 'worried'], [30, 'neutral']]} />
    <BedDuvet from={0.13} knees={0.3} />
  </g>
);

// ---------- S6: the scale reads the same ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#D8E4E8" />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={i * 180} y={0} width={176} height={1080} fill="#C8D6DA" opacity={i % 2 ? 0.6 : 0.3} />)}
    <g transform={`translate(960 ${kf(t, [[0, 620], [len, 600]])}) scale(${kf(t, [[0, 1], [len, 1.06]])})`}>
      <rect x={-380} y={-260} width={760} height={560} rx={60} fill="#F4F2FA" stroke="#14121C" strokeWidth={8} />
      <rect x={-220} y={-200} width={440} height={170} rx={20} fill="#14121C" />
      <text textAnchor="middle" y={-80} fontFamily={FONT.ui} fontSize={110} fill="#7FFFA0">48.6 kg</text>
      <ellipse cx={-130} cy={140} rx={90} ry={110} fill="#3B3646" />
      <ellipse cx={130} cy={140} rx={90} ry={110} fill="#3B3646" />
    </g>
    <g transform={`translate(1560 300) scale(${backOut(clamp((t - 10) / 8))})`}>
      <rect x={-220} y={-50} width={440} height={86} rx={43} fill="#14121C" />
      <text textAnchor="middle" y={12} fontFamily={FONT.ui} fontSize={40} fill="#7FFFA0">SAME AS YESTERDAY</text>
    </g>
  </g>
);

// ---------- S7: the Earth keeps going round the Sun ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const a = -0.6 + t / 80;
  return (
    <g>
      <SchBg t={t} len={len} id="c2s7" />
      <ellipse cx={960} cy={540} rx={600} ry={260} fill="none" stroke={DIM} strokeWidth={4} strokeDasharray="14 12" />
      <SunIcon x={960} y={540} r={110} />
      <EarthIcon x={960 + Math.cos(a) * 600} y={540 + Math.sin(a) * 260} r={60} spin={t * 3} />
      <MoonIcon x={960 + Math.cos(a) * 600 + 110} y={540 + Math.sin(a) * 260 - 40} r={20} dash />
      <SchLabel x={960} y={900} t={t - 4} text="THE EARTH KEEPS ITS ORBIT · THE SUN STILL RISES" size={40} />
    </g>
  );
};

// ---------- S8: a normal morning ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 540, 1.05)}>
    <StreetModern t={t} mode="day" car={false} />
  </g>
);

// ---------- S9: Mom checks the news, shrugs ----------
const MP = stand(KITCHEN, 0.42, 0.4);
export const S9: React.FC<ShotProps> = ({ t, len, f }) => {
  const shrug = rel(f, t, 'shrugs');
  const k = clamp(1 - Math.abs(t - shrug - 6) / 8);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 560, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <Kitchen t={t + 40} veil={0.3} />
      <Body look={MOM} pose={{ ...basePose, x: MP.x, y: MP.y, scale: MP.scale, yaw: 0.2, armL: { a: 30 + 60 * k, b: -80 }, armR: { a: 60 + 30 * k, b: -100 }, headTilt: 6 * k }} t={t} faces={[[0, 'neutral'], [shrug, 'smug']]} seed={4} />
      <KitchenIsland />
    </g>
  );
};

// ---------- S10: the bus stop: still late ----------
const BY = streetHip(1);
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 930]]), 600, kf(t, [[0, 1.5], [len, 1.6]]))}>
    <StreetModern t={t + 80} mode="day" car={false} />
    <g transform={`translate(1180 ${STREETM.feet})`}>
      <path d="M 0 0 L 0 -360" stroke="#3A3646" strokeWidth={12} />
      <rect x={-70} y={-420} width={140} height={90} rx={10} fill="#2E5A9A" stroke="#14121C" strokeWidth={5} />
      <text textAnchor="middle" y={-360} fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#F6EFE3">BUS</text>
    </g>
    <Body look={YOU} pose={{ ...basePose, x: 840, y: BY, yaw: 0.3, armL: { a: 20, b: -20 }, armR: { a: 70, b: -120 } }} t={t} faces={[[0, 'tired']]} />
    <Body look={MO} pose={{ ...basePose, x: 1020, y: BY, yaw: -0.3, headTilt: 8 }} t={t} faces={[[0, 'tired']]} seed={3} />
    <g transform={`translate(1360 300) scale(${backOut(clamp((t - 8) / 8))})`}>
      <rect x={-170} y={-50} width={340} height={86} rx={43} fill="#14121C" />
      <text textAnchor="middle" y={12} fontFamily={FONT.ui} fontSize={40} fill="#FFD23A">LATE: 8 MIN</text>
    </g>
  </g>
);

// ---------- S11: the Moon's jobs ----------
const JOBS = ['TIDES', 'NIGHT LIGHT', 'CLOCK', 'BALANCE'];
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c2s11" />
    <MoonIcon x={960} y={330} r={110} />
    <SchLabel x={960} y={520} t={t - 2} text="THE MOON'S JOBS" size={48} color={DIM} />
    {JOBS.map((j, i) => (
      <g key={i} transform={`translate(${360 + i * 400} 700) scale(${backOut(clamp((t - 10 - i * 8) / 8))})`}>
        <rect x={-170} y={-60} width={340} height={110} rx={18} fill="#1C2C44" stroke={LIVE} strokeWidth={5} />
        <text textAnchor="middle" y={14} fontFamily={FONT.title} fontWeight={800} fontSize={j.length > 8 ? 46 : 56} fill="#F6EFE3">{j}</text>
      </g>
    ))}
  </g>
);

// ---------- S12: the time card, stamped every night ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c2s12" />
    <g transform={`translate(960 540) rotate(-3) scale(${kf(t, [[0, 1], [len, 1.06]])})`}>
      <rect x={-380} y={-360} width={760} height={720} rx={14} fill="#F4EEDC" stroke="#14121C" strokeWidth={8} />
      <text textAnchor="middle" y={-280} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#14121C">TIME CARD: THE MOON</text>
      {Array.from({ length: 7 }).map((_, i) => {
        const last = i === 6;
        return (
          <g key={i}>
            <path d={`M -340 ${-200 + i * 80} L 340 ${-200 + i * 80}`} stroke="#B8AE96" strokeWidth={3} />
            <text x={-320} y={-150 + i * 80} fontFamily={FONT.ui} fontSize={36} fill="#3A3646">{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}</text>
            {!last && t > 4 + i * 4 ? <text x={200} y={-150 + i * 80} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#2E5A9A" transform={`rotate(-4 200 ${-150 + i * 80})`}>✓ ON TIME</text> : null}
            {last ? <text x={200} y={-150 + i * 80} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#C8452A" opacity={clamp((t - 36) / 6)}>— ? —</text> : null}
          </g>
        );
      })}
    </g>
  </g>
);

// ---------- S13: Mo's grandpa on his boat ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 700], [len, 760]]), 520, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Harbor t={t} tide={1} />
      <Body look={GRANDPA} pose={{ ...basePose, x: 1010, y: HARBOR.high - 70 - LEG_LEN * 0.8 + Math.sin(t / 16) * 5, scale: 0.8, yaw: -0.3, armR: { a: 150 + 15 * Math.sin(t / 5), b: -20 } }} t={t} faces={[[0, 'happy']]} seed={6} />
    </g>
    <g transform={`translate(330 160) scale(${backOut(clamp((t - 6) / 8))})`}>
      <rect x={-230} y={-50} width={460} height={86} rx={43} fill="#14121C" opacity={0.85} />
      <text textAnchor="middle" y={12} fontFamily={FONT.ui} fontSize={40} fill="#FFD23A">50 YEARS AT SEA</text>
    </g>
  </g>
);

// ---------- S14: the tide table ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.35}><g transform={camT(900, 500, 1.4)}><Harbor t={t + 100} tide={1} /></g></Soft>
    <g transform={`translate(960 560) rotate(3) scale(${kf(t, [[0, 1], [len, 1.08]])})`}>
      <rect x={-420} y={-380} width={840} height={760} rx={10} fill="#F4EEDC" stroke="#14121C" strokeWidth={8} />
      <text textAnchor="middle" y={-300} fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#14121C">TIDE TABLE · NOVEMBER</text>
      <text x={-360} y={-220} fontFamily={FONT.ui} fontSize={30} fill="#6A6680">DAY   HIGH     LOW      HIGH     LOW</text>
      {['24', '25', '26', '27', '28', '29', '30'].map((d, i) => (
        <text key={i} x={-360} y={-150 + i * 70} fontFamily={FONT.ui} fontSize={34} fill={i === 1 ? '#C8452A' : '#14121C'}>
          {`${d}    ${String(5 + Math.floor(i * 0.8)).padStart(2, '0')}:${String((12 + i * 50) % 60).padStart(2, '0')}    ${String(11 + Math.floor(i * 0.8)).padStart(2, '0')}:${String((24 + i * 50) % 60).padStart(2, '0')}    ${String(17 + Math.floor(i * 0.8)).padStart(2, '0')}:${String((36 + i * 50) % 60).padStart(2, '0')}    ${String(23 - Math.floor(i * 0.3)).padStart(2, '0')}:${String((48 + i * 50) % 60).padStart(2, '0')}`}
        </text>
      ))}
      <ellipse cx={0} cy={-80} rx={400} ry={36} fill="none" stroke="#C8452A" strokeWidth={6} opacity={clamp((t - 20) / 8)} />
    </g>
  </g>
);

// ---------- S15: Ellie at the orange fence ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 940]]), 620, kf(t, [[0, 1.25], [len, 1.35]]))}>
    <Beach t={t} dusk={1} lights={0} crowd={0} vigil={false} />
    <Body look={ELLIE} pose={{ ...basePose, x: 1150, y: BEACH.nest.y - LEG_LEN * 0.72 + 10, scale: 0.72, yaw: -0.5, tilt: -10, armR: { a: 60, b: -40 } }} t={t} faces={[[0, 'happy']]} seed={5} />
  </g>
);

// ---------- S16: the sign ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(BEACH.nest.x, BEACH.nest.y - 120, kf(t, [[0, 2.2], [len, 2.35]]))}>
      <Beach t={t + 40} dusk={1} lights={0} crowd={0} vigil={false} />
      <Sign x={BEACH.nest.x - 210} y={BEACH.nest.y - 50} s={0.42} lines={['SEA TURTLE NEST', 'DO NOT DISTURB', 'DUE: ANY NIGHT']} color="#FFE27A" />
    </g>
  </g>
);

// ---------- S17: the sand of the nest, pushing in ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(BEACH.nest.x, BEACH.nest.y - 10, kf(t, [[0, 2.8], [len, 4.2]]))}>
      <Beach t={t + 80} dusk={1} lights={0} crowd={0} vigil={false} />
      <Nest x={BEACH.nest.x} y={BEACH.nest.y} move={t > 50 ? 0.4 : 0} t={t} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={kf(t, [[0, 0], [len, 0.35]])} />
  </g>
);
