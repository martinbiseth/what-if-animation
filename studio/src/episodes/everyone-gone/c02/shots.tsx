import React from 'react';
import { BEDROOM, stand, ShotProps, kf, clamp, backOut, Glow, bedSit, FONT, TOWN, Cat, rnd } from '../../../engine';
import words from './words.json';
import {
  YOU, EG, TownSet, KitchenSet, ShopSet, BedroomSet, scene, faceCU, insert, cueAt, egCard, DigitalClock, PhoneUI, Walkie, ArmIn,
} from '../common';

// Chapter 2, the rules: by the end of day one, three rules on a notepad. One, 3:07: every phone's last message is
// from before it, the news desk is empty. Two, only people: cats, pigeons, goldfish. Three, everything stayed where
// it was: slippers, a toothbrush. The calls that ring and ring. Then Ellie's walkie-talkie, hissing on her bed.

const MORN = TownSet('morning');
const DUSK = TownSet('dusk');
const KIT = KitchenSet({ veil: 0.3 });
const ELLIEROOM = BedroomSet({ clock: '18:40', veil: 0.4, lamp: 1 });

const RULES = ['1. 3:07 AM', '2. ONLY PEOPLE', '3. THINGS STAYED'];
/** The notepad: `n` rules written, the last one writing on from frame `at`. */
const Pad: React.FC<{ t: number; n: number; at: number }> = ({ t, n, at }) => (
  <g transform="translate(960 560) rotate(-3)">
    <rect x={-420} y={-400} width={840} height={820} rx={12} fill="#FFF8E0" stroke="#14121C" strokeWidth={6} />
    {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M -380 ${-230 + i * 80} H 380`} stroke="#9AB8E0" strokeWidth={3} />)}
    <path d="M -300 -400 V 420" stroke="#E8A0A0" strokeWidth={3} />
    {Array.from({ length: 8 }).map((_, i) => <circle key={`r${i}`} cx={-340 + i * 96} cy={-400} r={16} fill="#2A2632" />)}
    <text x={-260} y={-270} fontFamily={FONT.hand} fontWeight={700} fontSize={70} fill="#1A2A6A">THE RULES</text>
    {RULES.slice(0, n).map((r, i) => {
      const k = i === n - 1 ? clamp((t - at) / 18) : 1;
      return (
        <g key={i}>
          <clipPath id={`pad${i}`}><rect x={-280} y={-140 + i * 160} width={700 * k} height={110} /></clipPath>
          <text x={-270} y={-60 + i * 160} fontFamily={FONT.hand} fontSize={72} fill="#1A2A6A" clipPath={`url(#pad${i})`}>{r}</text>
        </g>
      );
    })}
  </g>
);
// ---------- S1: day one ----------
export const S1 = egCard({ kicker: 'DAY 1', title: 'THE RULES', Bg: DUSK });

// ---------- S2: three rules. One ----------
export const S2: React.FC<ShotProps> = (p) => {
  const at = cueAt(words, p.f, p.t, 'One');
  const I = insert({ Bg: KIT, push: 0.06, draw: (t) => <Pad t={t} n={1} at={at} />, day: 1 });
  return <I {...p} />;
};

// ---------- S3: it happened at 3:07 ----------
export const S3 = insert({ Bg: ELLIEROOM, push: 0.1, draw: (t) => <DigitalClock x={960} y={540} s={1.3} text="3:07" t={t} /> });

// ---------- S4: every phone's last message is from before 3:07 ----------
const Msg: React.FC<{ y: number; text: string; time: string; me?: boolean }> = ({ y, text, time, me }) => (
  <g transform={`translate(0 ${y})`}>
    <rect x={me ? -10 : -125} y={-34} width={135} height={56} rx={20} fill={me ? '#2F7BFF' : '#FFFFFF'} stroke="#D0D0DA" strokeWidth={me ? 0 : 2} />
    <text x={me ? 4 : -112} y={2} fontFamily={FONT.ui} fontSize={18} fill={me ? '#FFF' : '#14121C'}>{text}</text>
    <text x={me ? 112 : -10} y={40} textAnchor="end" fontFamily={FONT.ui} fontSize={14} fill="#8A8A9A">{time}</text>
  </g>
);
export const S4 = insert({
  Bg: KIT, push: 0.1,
  draw: (t) => (
    <g>
      <PhoneUI x={960} y={560} s={1.25} rot={-4} t={t} id="p4" screen={
        <g>
          <rect x={-140} y={-300} width={280} height={80} fill="#E2E2EA" />
          <text x={0} y={-252} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#14121C">Mum</text>
          <Msg y={-160} text="night love x" time="23:41" />
          <Msg y={-70} text="night!" time="23:42" me />
          <Msg y={20} text="dont forget" time="02:58" />
          <Msg y={110} text="ur lunch" time="03:06" />
          <text x={0} y={240} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#C83A3A" opacity={clamp((t - 20) / 8)}>nothing after 03:07</text>
        </g>
      } />
    </g>
  ),
});

// ---------- S5: the TV, every channel: an empty news desk, the studio lights still on ----------
export const S5 = insert({
  Bg: KIT, push: 0.08,
  draw: (t) => (
    <g>
      <rect x={300} y={170} width={1320} height={780} rx={30} fill="#14121C" />
      <clipPath id="tv5"><rect x={340} y={210} width={1240} height={700} rx={10} /></clipPath>
      <g clipPath="url(#tv5)">
        <rect x={340} y={210} width={1240} height={700} fill="#1E3A6A" />
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={340 + i * 220} y={210} width={110} height={700} fill="#24447A" />)}
        <Glow x={700} y={210} r={400} kind="cool" o={0.6} />
        <Glow x={1300} y={210} r={400} kind="cool" o={0.6} />
        <path d="M 560 640 L 1360 640 L 1300 910 L 620 910 Z" fill="#C8CCD6" stroke="#14121C" strokeWidth={6} />
        <rect x={560} y={620} width={800} height={30} fill="#E8EAF0" stroke="#14121C" strokeWidth={5} />
        <rect x={880} y={560} width={60} height={62} rx={6} fill="#3A3E4A" />
        <rect x={340} y={800} width={1240} height={110} fill="#C83A3A" />
        <text x={380} y={872} fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#F6EFE3">LIVE</text>
        <text x={560} y={872} fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">{'...'.slice(0, 1 + (Math.floor(t / 10) % 3))}</text>
        <rect x={1380} y={240} width={170} height={60} rx={8} fill="#C83A3A" opacity={Math.floor(t / 15) % 2 ? 0.4 : 1} />
        <text x={1465} y={282} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#F6EFE3">LIVE</text>
      </g>
      <rect x={900} y={950} width={120} height={40} fill="#14121C" />
    </g>
  ),
});

// ---------- S6: two. Only people are gone ----------
export const S6: React.FC<ShotProps> = (p) => {
  const at = cueAt(words, p.f, p.t, 'Two');
  const I = insert({ Bg: KIT, push: 0.06, draw: (t) => <Pad t={t} n={2} at={Math.max(0, at)} />, day: 1 });
  return <I {...p} />;
};

// ---------- S7: dogs, cats, pigeons ----------
const Pigeon: React.FC<{ x: number; y: number; s?: number; t: number; seed?: number }> = ({ x, y, s = 1, t, seed = 0 }) => {
  const peck = Math.max(0, Math.sin(t / 6 + seed * 2)) * 20;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -6 0 L -6 -22 M 10 0 L 10 -22" stroke="#C8604A" strokeWidth={5} />
      <ellipse cx={0} cy={-46} rx={46} ry={30} fill="#8A90A4" stroke="#1A1A22" strokeWidth={5} />
      <path d="M -40 -46 L -78 -30 L -70 -56 Z" fill="#6A7084" stroke="#1A1A22" strokeWidth={4} />
      <g transform={`rotate(${peck} 30 -60)`}>
        <circle cx={40} cy={-78} r={22} fill="#7A8094" stroke="#1A1A22" strokeWidth={5} />
        <path d="M 60 -80 L 76 -74 L 60 -70 Z" fill="#E8B04A" />
        <circle cx={46} cy={-82} r={4} fill="#E8603A" />
      </g>
    </g>
  );
};
export const S7 = scene({
  Set: MORN, setT: 300, cam: { from: [900, 640, 1.5], to: [980, 640, 1.55] },
  front: (t) => (
    <g>
      <Cat x={620} y={TOWN.feet + 10} mood="alert" f={t} />
      {[0, 1, 2, 3, 4].map((i) => <Pigeon key={i} x={900 + i * 120 + rnd(3, i) * 40} y={TOWN.kerb + 60 + (i % 2) * 40} s={0.8} t={t} seed={i} />)}
    </g>
  ),
});

// ---------- S8: the goldfish in the pet shop ----------
export const S8 = insert({
  Bg: ShopSet(), push: 0.1,
  draw: (t) => {
    const fx = 960 + Math.sin(t / 20) * 120;
    const dir = Math.cos(t / 20) > 0 ? 1 : -1;
    return (
      <g>
        <rect x={500} y={820} width={920} height={60} fill="#7A4A3A" />
        <ellipse cx={960} cy={560} rx={330} ry={300} fill="#7AC8E8" opacity={0.45} stroke="#F6EFE3" strokeWidth={8} />
        <ellipse cx={960} cy={340} rx={220} ry={40} fill="none" stroke="#F6EFE3" strokeWidth={8} />
        <path d="M 680 760 Q 960 860 1240 760" fill="#E8D49A" />
        <g transform={`translate(${fx} ${560 + Math.sin(t / 7) * 20}) scale(${dir} 1)`}>
          <ellipse cx={0} cy={0} rx={70} ry={44} fill="#F28C3A" stroke="#14121C" strokeWidth={5} />
          <path d={`M -60 0 L -120 ${-40 + Math.sin(t / 3) * 10} L -120 ${40 + Math.sin(t / 3) * 10} Z`} fill="#F28C3A" stroke="#14121C" strokeWidth={5} />
          <circle cx={36} cy={-10} r={9} fill="#14121C" />
        </g>
        {[0, 1, 2].map((i) => <circle key={i} cx={fx + 80} cy={500 - ((t * 2 + i * 40) % 160)} r={8} fill="none" stroke="#F6EFE3" strokeWidth={3} />)}
      </g>
    );
  },
});

// ---------- S9: three. Everything people were holding stayed where it was ----------
export const S9: React.FC<ShotProps> = (p) => {
  const at = cueAt(words, p.f, p.t, 'Three');
  const I = insert({ Bg: KIT, push: 0.06, draw: (t) => <Pad t={t} n={3} at={Math.max(0, at)} />, day: 1 });
  return <I {...p} />;
};

// ---------- S10: slippers in the middle of the hallway ----------
const Slipper: React.FC<{ x: number; y: number; rot?: number }> = ({ x, y, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <ellipse cx={0} cy={0} rx={150} ry={62} fill="#8A5A8A" stroke="#14121C" strokeWidth={6} />
    <path d="M 20 -50 Q 120 -40 140 0 Q 120 40 20 50 Z" fill="#B07AB0" stroke="#14121C" strokeWidth={5} />
    <ellipse cx={-50} cy={0} rx={60} ry={26} fill="#6A3A6A" />
  </g>
);
export const S10 = insert({
  bgColor: '#3A2E2A', push: 0.08,
  draw: () => (
    <g>
      {Array.from({ length: 10 }).map((_, i) => <rect key={i} x={-100} y={i * 120} width={2200} height={116} fill={i % 2 ? '#7A5A3E' : '#86644A'} />)}
      <rect x={-100} y={0} width={2200} height={240} fill="#C8B89A" />
      <Slipper x={800} y={640} rot={-14} />
      <Slipper x={1160} y={720} rot={22} />
    </g>
  ),
});

// ---------- S11: a toothbrush on the bathroom floor ----------
export const S11 = insert({
  bgColor: '#DCE4EA', push: 0.08,
  draw: () => (
    <g>
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${i * 180} 0 V 1080`} stroke="#B8C4CE" strokeWidth={6} />)}
      {Array.from({ length: 8 }).map((_, i) => <path key={`h${i}`} d={`M 0 ${i * 180} H 1920`} stroke="#B8C4CE" strokeWidth={6} />)}
      <g transform="translate(960 600) rotate(-18)">
        <rect x={-380} y={-24} width={600} height={48} rx={24} fill="#4AA8E0" stroke="#14121C" strokeWidth={6} />
        <rect x={220} y={-40} width={170} height={64} rx={10} fill="#F6EFE3" stroke="#14121C" strokeWidth={5} />
        {Array.from({ length: 7 }).map((_, i) => <rect key={i} x={234 + i * 22} y={-74} width={12} height={40} rx={4} fill="#E8F4FF" stroke="#14121C" strokeWidth={2} />)}
        <path d="M 240 -78 Q 300 -110 370 -80" fill="#F6F6FF" stroke="#C8D8E8" strokeWidth={4} />
      </g>
    </g>
  ),
});

// ---------- S12: you call everyone you know: Mum. Mo. Grandma ----------
export const S12: React.FC<ShotProps> = (p) => {
  const mo = cueAt(words, p.f, p.t, 'Mo');
  const gr = cueAt(words, p.f, p.t, 'Grandma');
  const F = faceCU({
    look: YOU, Bg: KIT, faces: [[0, 'worried']], yaw: 0.35, side: -320, zoom: [2.8, 2.95],
    over: (t) => {
      const name = t >= gr ? 'GRANDMA' : t >= mo ? 'MO' : 'MUM';
      const since = t - (t >= gr ? gr : t >= mo ? mo : 0);
      return (
        <g transform={`translate(1340 540) scale(${backOut(clamp((since + 2) / 7))})`}>
          <rect x={-300} y={-200} width={600} height={400} rx={40} fill="#14121C" opacity={0.88} stroke="#5BC08A" strokeWidth={4} />
          <text x={0} y={-110} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} letterSpacing={6} fill="#8A8A9A">CALLING</text>
          <text x={0} y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3">{name}</text>
          <text x={0} y={120} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#5BC08A">{'ringing' + '...'.slice(0, 1 + (Math.floor(t / 8) % 3))}</text>
        </g>
      );
    },
  });
  return <F {...p} />;
};

// ---------- S12B: every call just rings and rings ----------
export const S12B = insert({
  Bg: KIT, push: 0.1,
  draw: (t) => (
    <PhoneUI x={960} y={560} s={1.25} rot={4} t={t} id="p12" bg="#1E2A3A" screen={
      <g>
        <circle cx={0} cy={-140} r={70} fill="#5A6A8A" />
        <text x={0} y={-110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3">G</text>
        <text x={0} y={-20} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#F6EFE3">Grandma</text>
        <text x={0} y={20} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#8AA8C8">{'ringing' + '...'.slice(0, 1 + (Math.floor(t / 8) % 3))}</text>
        <circle cx={0} cy={200} r={44} fill="#E8453A" />
        <path d="M -24 200 Q 0 186 24 200" stroke="#F6EFE3" strokeWidth={8} fill="none" />
      </g>
    } />
  ),
});

// ---------- S13: each phone, buzzing on an empty table ----------
const TablePhone: React.FC<{ x: number; t: number; name: string; seed: number; wood: string }> = ({ x, t, name, seed, wood }) => (
  <g>
    <clipPath id={`tp${seed}`}><rect x={x - 300} y={0} width={600} height={1080} /></clipPath>
    <g clipPath={`url(#tp${seed})`}>
      <rect x={x - 300} y={0} width={600} height={1080} fill="#1E1A26" />
      <rect x={x - 300} y={620} width={600} height={460} fill={wood} />
      <g transform={`translate(${x + Math.sin((t + seed * 5) * 2.3) * 6} 700) scale(1 0.42)`}>
        <rect x={-110} y={-200} width={220} height={400} rx={30} fill="#14121C" />
        <rect x={-96} y={-184} width={192} height={368} rx={22} fill="#2F7BFF" opacity={0.85} />
      </g>
      <Glow x={x} y={700} r={220} kind="cool" o={0.5} />
      <text x={x} y={560} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#8AA8C8">{name}</text>
      {[-1, 1].map((sd) => <path key={sd} d={`M ${x + sd * 140} 650 q ${sd * 16} 40 0 80`} stroke="#CFE6FF" strokeWidth={6} fill="none" opacity={0.5 + 0.5 * Math.sin(t / 2)} />)}
    </g>
    <rect x={x - 304} y={0} width={8} height={1080} fill="#0A0810" />
  </g>
);
export const S13 = insert({
  bgColor: '#0A0810', push: 0.04,
  draw: (t) => (
    <g>
      <TablePhone x={340} t={t} name="MUM'S DESK" seed={1} wood="#6A4A30" />
      <TablePhone x={960} t={t} name="MO'S ROOM" seed={2} wood="#4A5A6A" />
      <TablePhone x={1580} t={t} name="GRANDMA'S" seed={3} wood="#8A6A4A" />
    </g>
  ),
});

// ---------- S14: and then one more thing: Ellie's room ----------
const BED = bedSit(0.3);
export const S14 = scene({
  Set: ELLIEROOM, cam: { from: [940, 560, 1.15], to: [900, 580, 1.25] },
  back: (t) => (
    <g>
      <Walkie x={BED.x + 30} y={BED.y + 30} s={0.22} rot={-70} on={1} hiss={1} t={t} />
      <Glow x={BED.x - 20} y={BED.y + 10} r={70} kind="red" o={0.6} />
    </g>
  ),
  cast: [{ look: YOU, pose: { ...stand(BEDROOM, 0.82, 0.62), yaw: -0.6, look: -0.8 }, faces: [[0, 'neutral'], [30, 'worried']] }],
});

// ---------- S15: her walkie-talkie, switched on, hissing quietly ----------
export const S15 = insert({
  Bg: ELLIEROOM, push: 0.1, dim: 0.5,
  draw: (t) => (
    <g>
      <path d="M -100 820 Q 960 700 2100 820 L 2100 1200 L -100 1200 Z" fill="#3A4A8A" />
      <path d="M -100 820 Q 960 700 2100 820" stroke="#5A6AAA" strokeWidth={10} fill="none" />
      <Walkie x={960} y={900} s={1.6} rot={-8} on={1} hiss={1} t={t} />
    </g>
  ),
});

// ---------- S16: Ellie never leaves it on ----------
export const S16 = faceCU({ look: YOU, Bg: ELLIEROOM, faces: [[0, 'worried']], yaw: -0.3, zoom: [3.0, 3.15] });

// ---------- S17: you switch it off ----------
export const S17: React.FC<ShotProps> = (p) => {
  const off = Math.min(cueAt(words, p.f, p.t, 'off'), 22);
  const I = insert({
    Bg: ELLIEROOM, push: 0.04, dim: 0.5,
    draw: (t) => (
      <g>
        <path d="M -100 820 Q 960 700 2100 820 L 2100 1200 L -100 1200 Z" fill="#3A4A8A" />
        <Walkie x={960} y={900} s={1.6} rot={-8} on={t < off ? 1 : 0} hiss={t < off ? 1 : 0} t={t} />
        <ArmIn from={[2100, 300]} to={[kf(t, [[0, 1500], [off - 2, 1060]]), kf(t, [[0, 420], [off - 2, 560]])]} w={130} />
      </g>
    ),
  });
  return <I {...p} />;
};

// ---------- S18: remember that walkie-talkie ----------
export const S18 = insert({
  bgColor: '#06070F', push: 0.18,
  draw: (t) => (
    <g>
      <path d="M -100 820 Q 960 700 2100 820 L 2100 1200 L -100 1200 Z" fill="#1A2244" />
      <Walkie x={960} y={900} s={1.6} rot={-8} on={0} t={t} />
    </g>
  ),
});

