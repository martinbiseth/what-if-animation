import React from 'react';
import { Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, FONT, Glow, TitleCard } from '../../../engine';
import {
  YOU, MO, ELLIE, Body, faceCU, wordF, RoofMoon, roofHip, ROOF, MOONPOS, Telescope, Sketchpad, Pencil, SkyMoon, Hole, StreetModern, STREETM,
  Harbor, SchBg, SchLabel, Headline, XMark, MoonIcon, SunIcon, EarthIcon, Soft, shk,
} from '../common';
import { Dog } from '../../gravity/common';
import { Pow } from '../../gta-physics/common';
import words from './words.json';

// Chapter 1, the cold open: 9:47 PM on the roof, you, Mo and a borrowed telescope, Ellie's Moon drawing. You look
// down, you look up: the Moon is gone. Not a cloud, not an eclipse: a round black hole. Every dog barks, every phone
// lights up. Mo: "Where did it go?" Next morning the sea hasn't come back in. The question, and the three time scales.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const ME: Pose = { ...basePose, x: 760, y: roofHip(1), scale: 1, yaw: 0.45, look: 0.6 };
const MOP: Pose = { ...basePose, x: 1120, y: roofHip(1), scale: 1, yaw: -0.3 };
const SCOPE = { x: 930, y: ROOF.feet };
const Roof: React.FC<{ t: number; id?: string }> = ({ t, id }) => <RoofMoon t={t} id={id} />;
const RoofGone: React.FC<{ t: number; id?: string }> = ({ t, id }) => <RoofMoon t={t} id={id} moon={0} hole={1} />;

// ---------- S1: 9:47 PM, the city and a huge full Moon ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 1200], [len, 1100]]), kf(t, [[0, 380], [len, 460]]), kf(t, [[0, 1.5], [len, 1.25]]))}>
      <Roof t={t} />
      <Telescope x={SCOPE.x} y={SCOPE.y} ang={32} />
      <Body look={YOU} pose={{ ...ME, armR: { a: 40, b: -60 } }} t={t} faces={[[0, 'happy']]} />
      <Body look={MO} pose={MOP} t={t} faces={[[0, 'happy']]} seed={3} />
    </g>
    <g transform={`translate(1640 140) scale(${backOut(clamp((t - 4) / 8))})`}>
      <rect x={-200} y={-56} width={400} height={96} rx={48} fill="#14121C" stroke="#FFD23A" strokeWidth={5} opacity={0.92} />
      <text textAnchor="middle" y={18} fontFamily={FONT.ui} fontSize={56} fill="#FFD23A">9:47 PM</text>
    </g>
  </g>
);

// ---------- S2: you and Mo at the telescope ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const peek = kf(t, [[0, 0], [20, 1]]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 600, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <Roof t={t + 30} />
      <Telescope x={SCOPE.x} y={SCOPE.y} ang={32} />
      <Body look={MO} pose={{ ...MOP, x: 1040, tilt: -14 * peek, headTilt: -6, armL: { a: 70, b: -50 }, armR: { a: 40, b: -70 } }} t={t} faces={[[0, 'happy']]} seed={3} />
      <Body look={YOU} pose={{ ...ME, armR: { a: 50, b: -70 }, armL: { a: 30, b: -60 } }} t={t} faces={[[0, 'happy']]} />
      <Sketchpad x={ME.x + 60} y={ME.y - 10} s={0.25} rot={-20} drawn={0.5} />
    </g>
  );
};

// ---------- S3: Ellie's sketchpad, half a Moon in pencil ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.3}>
      <g transform={camT(1200, 400, 1.4)}><Roof t={t + 60} /></g>
    </Soft>
    <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Sketchpad x={960} y={560} s={1.4} rot={-4} drawn={kf(t, [[0, 0.35], [len, 0.55]])} />
      <Pencil x={1180} y={620} s={1.4} rot={-130} />
    </g>
    <g transform={`translate(1560 860) rotate(6) scale(${backOut(clamp((t - 10) / 8))})`}>
      <rect x={-210} y={-60} width={420} height={110} rx={10} fill="#FFE27A" stroke="#14121C" strokeWidth={5} />
      <text textAnchor="middle" y={-6} fontFamily={FONT.ui} fontSize={30} fill="#14121C">DUE TOMORROW!</text>
      <text textAnchor="middle" y={34} fontFamily={FONT.ui} fontSize={28} fill="#14121C">love, Ellie ♥</text>
    </g>
  </g>
);

// ---------- S4: you look down, sharpening the pencil ----------
export const S4 = faceCU({
  look: YOU, Bg: Roof, faces: [[0, 'neutral']], yaw: 0.35, eyes: 0.3, pose: { headTilt: 14, look: 0.2 }, zoom: [3.0, 3.2],
  extra: (t) => (
    <g transform={`translate(${1010 + Math.sin(t / 2) * 6} 640) rotate(-20)`}>
      <Pencil x={0} y={0} s={0.5} rot={Math.sin(t / 2) * 20} />
    </g>
  ),
});

// ---------- S5: you look back up ----------
export const S5 = faceCU({ look: YOU, Bg: Roof, faces: [[0, 'neutral'], [16, 'shock']], yaw: 0.4, eyes: 0.8, pose: { headTilt: -14 }, zoom: [3.1, 3.5], light: { x: 1100, y: 440, kind: 'cool', o: 0.5 } });

// ---------- S6: the Moon blinks out ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const g = 6;
  const flash = t >= g ? Math.max(0, 1 - (t - g) / 6) : 0;
  return (
    <g transform={`${shk(t, g, 8, 8)} ${camT(MOONPOS.x, MOONPOS.y + 60, kf(t, [[0, 1.5], [len, 1.6]]))}`}>
      <SkyMoon t={t} moon={t < g ? 1 : 0} hole={t < g ? 0 : clamp((t - g) / 4)} flash={flash} />
    </g>
  );
};

// ---------- S7: a cloud drifts past: nothing behind it ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[0, MOONPOS.x - 320], [len, MOONPOS.x + 320]]);
  return (
    <g transform={camT(MOONPOS.x, MOONPOS.y, 1.8)}>
      <SkyMoon t={t + 20} moon={0} hole={1} />
      <g opacity={0.85}>
        <ellipse cx={cx} cy={MOONPOS.y + 20} rx={220} ry={60} fill="#3A3A5A" />
        <ellipse cx={cx + 70} cy={MOONPOS.y - 10} rx={120} ry={60} fill="#3A3A5A" />
      </g>
      <SchLabel x={MOONPOS.x} y={MOONPOS.y + 210} t={t - 6} text="NOT A CLOUD" size={44} color="#F6EFE3" />
    </g>
  );
};

// ---------- S8: an eclipse? crossed out ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c1s8" />
    <SunIcon x={640} y={500} r={110} />
    <MoonIcon x={kf(t, [[0, 520], [14, 600]])} y={500} r={100} />
    <circle cx={kf(t, [[0, 520], [14, 600]])} cy={500} r={100} fill="#101A2A" opacity={0.85} />
    <SchLabel x={640} y={720} t={t - 2} text="ECLIPSE?" size={64} color={SCH_LIVE} />
    <XMark x={640} y={500} s={1.4} t={t - 10} />
    <EarthIcon x={1340} y={500} r={110} />
    <SchLabel x={1340} y={720} t={t - 14} text="NOTHING IN THE WAY" size={34} />
  </g>
);
const SCH_LIVE = '#FF8A3D';

// ---------- S9: the hole ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(MOONPOS.x, MOONPOS.y, kf(t, [[0, 2.0], [len, 2.6]]))}>
    <SkyMoon t={t + 40} moon={0} hole={1} />
  </g>
);

// ---------- S10: every dog barks ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 600, 1.1)}>
      <StreetModern t={t} mode="night" moon={false} car={false} />
      <Dog x={420} y={STREETM.feet + 10} s={1} t={t} />
      <Dog x={1500} y={STREETM.feet + 20} s={0.9} t={t + 13} flip />
    </g>
    <Pow x={430} y={620} t={t - 2} text="WOOF!" size={80} hold={40} />
    <Pow x={1400} y={540} t={t - 9} text="WOOF!" size={70} hold={40} rot={8} />
    <Pow x={900} y={380} t={t - 16} text="AWOOO!" size={60} hold={40} rot={-4} color="#F6EFE3" />
  </g>
);

// ---------- S11: every window lights up with a phone ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 520, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <StreetModern t={t + 30} mode="night" moon={false} car={false} />
    </g>
    {Array.from({ length: 14 }).map((_, i) => {
      const on = clamp((t - i * 2) / 4);
      const x = 120 + ((i * 397) % 1700);
      const y = 260 + ((i * 211) % 420);
      return (
        <g key={i} opacity={on}>
          <Glow x={x} y={y} r={70} kind="cool" o={0.9} />
          <rect x={x - 10} y={y - 16} width={20} height={32} rx={4} fill="#CFE6FF" />
        </g>
      );
    })}
    <g transform={`translate(960 900) scale(${backOut(clamp((t - 10) / 8))})`}>
      <rect x={-330} y={-50} width={660} height={86} rx={43} fill="#14121C" stroke="#7FB4FF" strokeWidth={4} />
      <text textAnchor="middle" y={12} fontFamily={FONT.ui} fontSize={40} fill="#CFE6FF">🔔 WHERE IS THE MOON?</text>
    </g>
  </g>
);

// ---------- S12: Mo slowly lowers the telescope ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(20, len - 20));
  return (
    <g transform={camT(980, 560, kf(t, [[0, 2.1], [len, 2.25]]))}>
      <RoofGone t={t + 80} />
      <Telescope x={SCOPE.x} y={SCOPE.y} ang={32 - 26 * k} />
      <Body look={MO} pose={{ ...MOP, x: 1040, tilt: -14 * (1 - k), armL: { a: 70 - 40 * k, b: -50 }, armR: { a: 40, b: -70 } }} t={t} faces={[[0, 'shock']]} seed={3} />
      <Body look={YOU} pose={{ ...ME, headTilt: -10, armL: { a: 20, b: -20 } }} t={t} faces={[[0, 'shock']]} />
    </g>
  );
};

// ---------- S13: Mo: where did it go? ----------
export const S13: React.FC<ShotProps> = (p) => {
  const S = faceCU({ look: MO, Bg: RoofGone, faces: [[0, 'worried']], yaw: -0.3, eyes: 0.6, pose: { headTilt: -6 }, zoom: [3.2, 3.4], words: W, talk: [at('Where') / 30 - 0.05, at('go') / 30 + 0.3] });
  return <S {...p} />;
};

// ---------- S14: next morning: the sea far out, boats on the mud ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 800], [len, 960]]), 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <Harbor t={t} tide={0.05} />
    </g>
    <g transform={`translate(260 140) scale(${backOut(clamp((t - 4) / 8))})`}>
      <rect x={-190} y={-50} width={380} height={86} rx={43} fill="#14121C" opacity={0.85} />
      <text textAnchor="middle" y={12} fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3">7:12 AM</text>
    </g>
  </g>
);

// ---------- S15: the question ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(MOONPOS.x - 200, MOONPOS.y + 160, kf(t, [[0, 1.1], [len, 1.2]]))}>
      <SkyMoon t={t + 60} moon={0} hole={1} />
    </g>
    <TitleCard t={t} lines={['WHAT IF THE MOON', 'DISAPPEARED TONIGHT?']} accent="#FFD23A" y={700} size={110} />
  </g>
);

// ---------- S16: three time scales ----------
export const S16: React.FC<ShotProps> = ({ t, len, f }) => {
  const a = rel(f, t, 'first'), b = rel(f, t, 'first', 2), c = rel(f, t, 'million');
  return (
    <g>
      <SchBg t={t} len={len} id="c1s16" />
      <path d="M 260 560 L 1660 560" stroke={'#7E8DA6'} strokeWidth={6} strokeDasharray="16 12" />
      {[
        [400, a, 'NIGHT 1'],
        [960, b, 'YEAR 1'],
        [1520, c, '1,000,000 YEARS'],
      ].map(([x, s, label], i) => (
        <g key={i} transform={`translate(${x} 560) scale(${backOut(clamp((t - (s as number)) / 8))})`}>
          <circle r={34} fill={i === 2 ? SCH_LIVE : '#F6EFE3'} stroke="#0B0816" strokeWidth={6} />
          <text y={-80} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={i === 2 ? 66 : 80} fill={i === 2 ? SCH_LIVE : '#F6EFE3'} stroke="#0B0816" strokeWidth={8} paintOrder="stroke">{label}</text>
        </g>
      ))}
      <Hole x={1520} y={760} r={60} o={clamp((t - c) / 8)} />
    </g>
  );
};
