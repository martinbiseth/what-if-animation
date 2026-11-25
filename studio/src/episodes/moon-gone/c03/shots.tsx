import React from 'react';
import { basePose, kf, camT, clamp, backOut, ShotProps, FONT, Glow, Classroom, CLS, stand, LEG_LEN, Kitchen, KITCHEN } from '../../../engine';
import {
  YOU, MO, ELLIE, NEIGH, NEIGH2, TEACHER, Body, faceCU, bigWord, wordF, SchBg, SchLabel, Headline, XMark, MoonIcon, SunIcon, EarthIcon, Soft,
  StreetModern, STREETM, streetHip, Harbor, YardNight, yardHip, YARDN, Telescope, Observatory, LaunchPad, PhoneTall, Sign, Hole, RoofMoon, MilkyWay, Arrow,
} from '../common';
import { NightSky, Stars } from '../../../engine';
import words from './words.json';

// Chapter 3, the first night: the darkest night you've seen (a full Moon is ~100x starlight). It's beautiful: the
// Milky Way, astronomers' best week, Mo's $1 telescope (43 dollars, Saturn, a refund, double for the husband).
// Online chaos, no more eclipses or Moon landings, "month" and "Monday". Ellie on the trampoline: what does the Moon
// actually do? Six AM: Mo calls. Grandpa's boat is stuck in the mud.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const LIVE = '#FF8A3D';
const DIM = '#7E8DA6';
const NightSt: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="night" moon={false} car={false} power={0.6} />;
const Yard: React.FC<{ t: number; id?: string }> = ({ t, id }) => <YardNight t={t} id={id} />;

// ---------- S1: night 1 ----------
export const S1 = bigWord({ kicker: 'NIGHT 1', word: 'THE DARKEST NIGHT', color: '#F6EFE3', Bg: NightSt, size: 150 });

// ---------- S2: full Moon vs starlight: 100x ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c3s2" />
    <MoonIcon x={560} y={380} r={110} />
    <SchLabel x={560} y={570} t={t - 2} text="FULL MOON" size={44} />
    <SchLabel x={560} y={630} t={t - 6} text="~0.2 LUX" size={36} color={DIM} />
    {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={1300 + (i % 3) * 80 + (i % 2) * 20} cy={320 + Math.floor(i / 3) * 60} r={5} fill="#EAF0FF" />)}
    <SchLabel x={1360} y={570} t={t - 10} text="STARLIGHT ONLY" size={44} />
    <SchLabel x={1360} y={630} t={t - 14} text="~0.002 LUX" size={36} color={DIM} />
    <Headline y={860} t={t} text="100× BRIGHTER" size={130} color={LIVE} delay={24} />
  </g>
);

// ---------- S3: the street with no moonlight ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 500, 1.05)}><NightSt t={t} /></g>
    <rect width={1920} height={1080} fill="#02020A" opacity={kf(t, [[0, 0.1], [len, 0.4]])} />
    <g transform={`translate(960 900) scale(${backOut(clamp((t - 30) / 8))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">FOREVER.</text>
    </g>
  </g>
);

// ---------- S4: you look up: beautiful ----------
export const S4 = faceCU({ look: YOU, Bg: Yard, faces: [[0, 'neutral'], [20, 'happy']], yaw: 0.2, eyes: 0.4, pose: { headTilt: -16 }, zoom: [3.0, 3.25], glint: 0.6, glintColor: '#CFE6FF' });

// ---------- S5: the Milky Way spills across the sky ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 700], [len, 460]]), 1.0)}>
    <NightSky id="c3s5" horizonY={820} />
    <rect x={-400} y={-400} width={2800} height={1300} fill="#02020A" opacity={0.3} />
    <Stars seed={91} x0={-300} y0={-400} w={2500} h={1300} t={t} n={420} o={1} />
    <MilkyWay x0={-300} y0={900} x1={2200} y1={-250} o={kf(t, [[0, 0.3], [40, 1]])} t={t} w={380} />
    <path d="M -400 860 Q 400 800 960 840 Q 1500 880 2400 820 L 2400 1500 L -400 1500 Z" fill="#0A0A14" />
    <Body look={YOU} pose={{ ...basePose, x: 820, y: 850 - LEG_LEN * 0.6, scale: 0.6, yaw: 0.2, headTilt: -14 }} t={t} faces={[[0, 'happy']]} />
    <Body look={MO} pose={{ ...basePose, x: 960, y: 850 - LEG_LEN * 0.6, scale: 0.6, yaw: -0.1, headTilt: -14, armR: { a: 140, b: -10 } }} t={t} faces={[[0, 'happy']]} seed={3} />
  </g>
);

// ---------- S6: astronomers cheering ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}><Observatory t={t} /></g>
    <g transform={`translate(1260 360) scale(${backOut(clamp((t - 6) / 8))})`}>
      <path d="M -220 -80 L 220 -80 L 220 60 L 0 60 L -40 110 L -60 60 L -220 60 Z" fill="#F6EFE3" stroke="#14121C" strokeWidth={6} />
      <text textAnchor="middle" y={10} fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#14121C">BEST. WEEK.</text>
    </g>
  </g>
);

// ---------- S7: Mo charges a dollar a look ----------
const SC = { x: 900, y: YARDN.feet };
const queue = (t: number, n = 4) =>
  Array.from({ length: n }).map((_, i) => (
    <Body key={i} look={i % 2 ? NEIGH2 : NEIGH} pose={{ ...basePose, x: 1260 + i * 150, y: yardHip(0.85), scale: 0.85, yaw: -0.4 }} t={t + i * 9} faces={[[0, i % 2 ? 'neutral' : 'happy']]} seed={10 + i} />
  ));
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1060]]), 580, kf(t, [[0, 1.25], [len, 1.32]]))}>
    <Yard t={t} />
    <Telescope x={SC.x} y={SC.y} ang={40} />
    {queue(t)}
    <Body look={MO} pose={{ ...basePose, x: 1080, y: yardHip(1), yaw: -0.2, armR: { a: 100 + 10 * Math.sin(t / 6), b: -40 } }} t={t} faces={[[0, 'smug']]} seed={3} />
    <g transform="translate(700 800)">
      <rect x={-130} y={-80} width={260} height={110} rx={8} fill="#F4EEDC" stroke="#14121C" strokeWidth={5} />
      <text textAnchor="middle" y={-6} fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#14121C">$1 A LOOK</text>
      <path d="M -100 30 L -100 80 M 100 30 L 100 80" stroke="#6A5240" strokeWidth={10} />
    </g>
  </g>
);

// ---------- S8: the jar: $43 ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(43, Math.round(kf(t, [[0, 12], [Math.max(10, len - 20), 43]])));
  return (
    <g>
      <Soft blur={16} dim={0.4}><g transform={camT(1000, 600, 1.6)}><Yard t={t + 50} /></g></Soft>
      <g transform="translate(960 600)">
        <rect x={-180} y={-260} width={360} height={420} rx={50} fill="#BFE6FF" opacity={0.35} stroke="#E0F2FF" strokeWidth={8} />
        <rect x={-150} y={-300} width={300} height={50} rx={12} fill="#8A6A4A" stroke="#14121C" strokeWidth={5} />
        {Array.from({ length: Math.min(30, n) }).map((_, i) => <rect key={i} x={-140 + (i % 5) * 56} y={120 - Math.floor(i / 5) * 36} width={52} height={30} rx={4} fill="#7AB85E" stroke="#3E6A2E" strokeWidth={3} transform={`rotate(${(i * 37) % 20 - 10} ${-114 + (i % 5) * 56} ${135 - Math.floor(i / 5) * 36})`} />)}
      </g>
      <text x={960} y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#7FFFA0" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">${n}</text>
    </g>
  );
};

// ---------- S9: Saturn's rings in the eyepiece ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#000" />
    <circle cx={960} cy={540} r={430} fill="#04040C" />
    <Stars seed={97} x0={560} y0={140} w={800} h={800} t={t} n={40} o={0.8} />
    <g transform={`translate(${960 + Math.sin(t / 14) * 8} 540) rotate(-18) scale(${kf(t, [[0, 1], [len, 1.12]])})`}>
      <ellipse cx={0} cy={0} rx={300} ry={70} fill="none" stroke="#E8D4A0" strokeWidth={22} />
      <circle r={130} fill="#E8C47A" />
      <path d="M -126 -30 Q 0 -44 126 -30 M -120 30 Q 0 44 120 30" stroke="#C8A05A" strokeWidth={14} fill="none" />
      <path d="M -300 0 A 300 70 0 0 0 300 0" fill="none" stroke="#E8D4A0" strokeWidth={22} />
    </g>
    <circle cx={960} cy={540} r={430} fill="none" stroke="#000" strokeWidth={60} />
    <SchLabel x={960} y={1030} t={t - 20} text="SATURN" size={40} color="#E8D4A0" />
  </g>
);

// ---------- S10: a refund; then double for her husband ----------
export const S10: React.FC<ShotProps> = ({ t, len, f }) => {
  const d = rel(f, t, 'double');
  return (
    <g transform={camT(1150, 560, kf(t, [[0, 1.8], [len, 1.9]]))}>
      <Yard t={t + 90} />
      <Telescope x={SC.x} y={SC.y} ang={40} />
      <Body look={NEIGH} pose={{ ...basePose, x: 1260, y: yardHip(0.85), scale: 0.85, yaw: -0.4, armL: { a: 120, b: -100 } }} t={t} faces={[[0, 'happy']]} seed={10} />
      <Body look={NEIGH2} pose={{ ...basePose, x: 1420, y: yardHip(0.85), scale: 0.85, yaw: -0.4 }} t={t} faces={[[0, 'neutral'], [d + 6, 'shock']]} seed={11} />
      <Body look={MO} pose={{ ...basePose, x: 1080, y: yardHip(1), yaw: 0.3, armR: { a: 80, b: -20 } }} t={t} faces={[[0, 'happy'], [d, 'smug']]} seed={3} />
      <g transform={`translate(1100 380) scale(${backOut(clamp((t - d) / 8))})`}>
        <rect x={-90} y={-50} width={180} height={86} rx={43} fill="#14121C" />
        <text textAnchor="middle" y={14} fontFamily={FONT.ui} fontSize={48} fill="#7FFFA0">$2</text>
      </g>
    </g>
  );
};

// ---------- S11: #WhereIsTheMoon trending ----------
export const S11: React.FC<ShotProps> = ({ t }) => (
  <PhoneTall t={t}>
    <rect width={900} height={160} fill="#2E2A46" />
    <text x={450} y={105} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3">TRENDING</text>
    {['#WhereIsTheMoon', '#MoonGone', '#BringBackTheMoon', '#NightSky', '#Werewolves'].map((h, i) => (
      <g key={i} opacity={clamp((t - 4 - i * 5) / 5)}>
        <rect x={40} y={210 + i * 260} width={820} height={220} rx={24} fill={i === 0 ? '#FFE27A' : '#FFFFFF'} stroke="#D8D4E4" strokeWidth={4} />
        <text x={80} y={300 + i * 260} fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#14121C">{h}</text>
        <text x={80} y={370 + i * 260} fontFamily={FONT.ui} fontSize={36} fill="#6A6680">{`${[48, 21, 9, 4, 2][i]}.${(i * 3) % 10}M posts`}</text>
      </g>
    ))}
  </PhoneTall>
);

// ---------- S12: genuine moonlight, $10,000 ----------
export const S12: React.FC<ShotProps> = ({ t }) => (
  <PhoneTall t={t} rot={3}>
    <rect width={900} height={1720} fill="#FFFFFF" />
    <rect x={60} y={80} width={780} height={780} rx={20} fill="#14122A" />
    <g transform="translate(450 470)">
      <Glow x={0} y={0} r={300} kind="cool" o={0.8 + 0.2 * Math.sin(t / 5)} />
      <rect x={-150} y={-200} width={300} height={380} rx={60} fill="#CFE6FF" opacity={0.35} stroke="#F4F8FF" strokeWidth={8} />
      <rect x={-120} y={-240} width={240} height={50} rx={12} fill="#8A6A4A" />
      <circle r={70} fill="#F4F8FF" opacity={0.85} />
    </g>
    <text x={60} y={960} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#14121C">GENUINE MOONLIGHT</text>
    <text x={60} y={1040} fontFamily={FONT.ui} fontSize={38} fill="#6A6680">collected Monday night. last one!!</text>
    <text x={60} y={1180} fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#C8452A">$10,000</text>
    <rect x={60} y={1260} width={780} height={130} rx={65} fill="#FFD23A" />
    <text x={450} y={1345} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#14121C">BUY NOW</text>
  </PhoneTall>
);

// ---------- S13: werewolf fan club: closed ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={10} dim={0.4}><g transform={camT(960, 500, 1.2)}><NightSt t={t + 40} /></g></Soft>
    <g transform={`translate(960 ${kf(t, [[0, 520], [len, 500]])}) rotate(${-3 + Math.sin(t / 12)})`}>
      <rect x={-400} y={-240} width={800} height={480} rx={14} fill="#3A2A2A" stroke="#14121C" strokeWidth={10} />
      <text textAnchor="middle" y={-120} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#E9DCC0">WEREWOLF FAN CLUB</text>
      <g transform="translate(0 0)">
        {[[-30, -20], [0, -35], [30, -20]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={12} ry={16} fill="#E9DCC0" />)}
        <ellipse cx={0} cy={15} rx={34} ry={26} fill="#E9DCC0" />
      </g>
      <g transform={`rotate(-10) scale(${backOut(clamp((t - 10) / 8))})`}>
        <rect x={-260} y={70} width={520} height={110} fill="#C8452A" stroke="#14121C" strokeWidth={6} />
        <text textAnchor="middle" y={150} fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#FFFFFF">CLOSED</text>
      </g>
    </g>
  </g>
);

// ---------- S14: no more total solar eclipses ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c3s14" />
    <SunIcon x={960} y={440} r={140} />
    <MoonIcon x={960} y={440} r={140} dash />
    <XMark x={960} y={440} s={1.8} t={t - 10} />
    <SchLabel x={960} y={700} t={t - 4} text="NO MORE TOTAL SOLAR ECLIPSES" size={56} color={LIVE} />
    <SchLabel x={960} y={780} t={t - 14} text="NOTHING LEFT TO COVER THE SUN" size={36} />
  </g>
);

// ---------- S15: the rocket with nowhere to go ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(980, kf(t, [[0, 520], [len, 470]]), kf(t, [[0, 1.0], [len, 1.1]]))}><LaunchPad t={t} /></g>
    <g transform={`translate(1350 330) scale(${backOut(clamp((t - 30) / 8))})`}>
      <circle r={90} fill="#F6EFE3" stroke="#14121C" strokeWidth={6} />
      <text textAnchor="middle" y={45} fontFamily={FONT.title} fontWeight={800} fontSize={130} fill="#14121C">?</text>
    </g>
    <SchLabel x={960} y={980} t={t - 10} text="DESTINATION: ???" size={48} color="#F6EFE3" />
  </g>
);

// ---------- S16: your teacher at the board ----------
const TP = stand(CLS, 0.75, 0.25);
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1100], [len, 1140]]), 480, kf(t, [[0, 1.4], [len, 1.5]]))}>
    <Classroom t={t} board={<text x={900} y={260} textAnchor="middle" fontFamily={FONT.ui} fontSize={50} fill="#F6EFE3">MOON → ?</text>} />
    <Body look={TEACHER} pose={{ ...basePose, x: TP.x, y: TP.y, scale: TP.scale, yaw: -0.3, armL: { a: 130, b: -20 } }} t={t} faces={[[0, 'happy']]} seed={8} />
  </g>
);

// ---------- S17: MOON -> MONTH, MONDAY ----------
export const S17: React.FC<ShotProps> = ({ t, len, f }) => {
  const m = rel(f, t, 'Monday');
  const word = (x: number, y: number, s: string, d: number, hi: number) => (
    <g transform={`translate(${x} ${y}) scale(${backOut(clamp((t - d) / 8))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">
        <tspan fill={LIVE}>{s.slice(0, hi)}</tspan>
        {s.slice(hi)}
      </text>
    </g>
  );
  return (
    <g>
      <SchBg t={t} len={len} id="c3s17" />
      <MoonIcon x={960} y={240} r={80} />
      {word(960, 460, 'MOON', 2, 3)}
      {word(620, 760, 'MONTH', 10, 3)}
      {word(1300, 760, 'MONDAY', m, 3)}
      <Arrow x0={880} y0={500} x1={680} y1={660} t={t - 8} color={DIM} />
      <Arrow x0={1040} y0={500} x1={1240} y1={660} t={t - m + 2} color={DIM} />
    </g>
  );
};

// ---------- S18: a calendar of moon phases fades ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c3s18" />
    <g transform="translate(960 560)">
      <rect x={-560} y={-380} width={1120} height={720} rx={16} fill="#F4EEDC" stroke="#14121C" strokeWidth={8} />
      <rect x={-560} y={-380} width={1120} height={110} rx={16} fill="#C8452A" />
      <text textAnchor="middle" y={-300} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFFFFF">NOVEMBER</text>
      {Array.from({ length: 28 }).map((_, i) => {
        const x = -480 + (i % 7) * 160, y = -200 + Math.floor(i / 7) * 140;
        const ph = (i / 29.5) * Math.PI * 2;
        const fade = clamp((t - 10 - i * 1.2) / 6);
        return (
          <g key={i}>
            <text x={x - 40} y={y - 30} fontFamily={FONT.ui} fontSize={26} fill="#6A6680">{i + 1}</text>
            <g opacity={1 - fade}>
              <circle cx={x + 20} cy={y + 10} r={34} fill="#3A3646" />
              <ellipse cx={x + 20 + Math.cos(ph) * 17} cy={y + 10} rx={34 * Math.abs(Math.sin(ph / 2))} ry={34} fill="#E9E4DA" />
            </g>
          </g>
        );
      })}
    </g>
  </g>
);

// ---------- S19: Ellie on the trampoline ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1250], [len, 1320]]), 520, kf(t, [[0, 1.3], [len, 1.45]]))}>
    <YardNight t={t} />
    <Body look={ELLIE} pose={{ ...basePose, x: 1380, y: 740, scale: 0.7, spin: -80, yaw: 0, headTilt: -10, armL: { a: 100, b: 0 }, armR: { a: 100, b: 0 } }} t={t} faces={[[0, 'worried']]} seed={5} />
  </g>
);

// ---------- S20: Ellie: what does the Moon actually do? ----------
export const S20 = faceCU({ look: ELLIE, Bg: Yard, faces: [[0, 'worried']], yaw: 0.2, eyes: -0.2, pose: { headTilt: -10 }, zoom: [3.3, 3.5], words: W, talk: [at('actually') / 30 - 1.3, at('actually') / 30 + 0.9] });

// ---------- S21: you: no answer, not yet ----------
export const S21 = faceCU({ look: YOU, Bg: Yard, faces: [[0, 'worried']], yaw: -0.3, eyes: 0.4, zoom: [3.1, 3.3] });

// ---------- S22: Mo calling, 6:00 AM ----------
export const S22: React.FC<ShotProps> = ({ t }) => (
  <PhoneTall t={t} bg="#1A1830">
    <rect width={900} height={1720} fill="#2E2A46" />
    <text x={450} y={260} textAnchor="middle" fontFamily={FONT.ui} fontSize={90} fill="#F6EFE3">6:00</text>
    <circle cx={450} cy={620} r={170} fill="#5E7A4E" />
    <text x={450} y={670} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={140} fill="#F6EFE3">MO</text>
    <text x={450} y={920} textAnchor="middle" fontFamily={FONT.ui} fontSize={56} fill="#F6EFE3">incoming call…</text>
    <circle cx={250} cy={1400} r={90} fill="#E8453A" />
    <circle cx={650} cy={1400} r={90 + 8 * Math.sin(t / 3)} fill="#5BE36A" />
  </PhoneTall>
);

// ---------- S23: you on the phone, half asleep ----------
export const S23 = faceCU({
  look: YOU, Bg: ({ t, id }) => <Kitchen t={t} id={id} veil={0.6} />, faces: [[0, 'tired']], yaw: 0.3, eyes: 0.2, zoom: [3.0, 3.2], pose: { armR: { a: 150, b: -150 } },
});

// ---------- S24: grandpa's boat stuck in the mud ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1100], [len, 1060]]), 700, kf(t, [[0, 1.5], [len, 1.4]]))}>
    <Harbor t={t} tide={0.05} />
  </g>
);
