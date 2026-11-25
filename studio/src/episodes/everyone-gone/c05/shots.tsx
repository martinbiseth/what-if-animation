import React from 'react';
import { ShotProps, kf, clamp, backOut, FONT, Glow, KITCHEN, stand, TOWN, BRIDGE, hipOn, LEG_LEN, rnd } from '../../../engine';
import words from './words.json';
import timeline from './timeline.json';
import {
  YOU, SUIT, EG, TownSet, HomeSet, KitchenSet, BedroomSet, RoofSet, RiverSet, BridgeSet, scene, faceCU, insert, walk, cueAt, egCard, fact, bigWord, DoorNote, Noodle, Can, Tally, ArmIn, DigitalClock, BeachPhoto, sitFloor, DayChip,
} from '../common';

// Chapter 5, the lonely part: day twelve, Noodle the dog and the routine; the silence; the loneliness fact; one window
// lit across the river; at dawn on the bridge, the man in the grey suit: everyone was moved at 3:07, you were missed,
// and tomorrow at 3:07 a door closes. He can take one more person.

type W = { w: string; s: number; e: number };
const WORDS = words as W[];
const startOf = (id: string) => ((timeline as { shots: { id: string; first: number }[] }).shots.find((s) => s.id === id)?.first ?? 0) / 30;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
/** A spoken line: from word a (the first one at or after shot `id` starts) to the end of word b after it. */
const line = (id: string, a: string, b: string): [number, number] => {
  const t0 = startOf(id) - 0.4;
  const i = WORDS.findIndex((w) => w.s >= t0 && norm(w.w) === norm(a));
  if (i < 0) return [0, 0];
  const j = WORDS.findIndex((w, k) => k > i && norm(w.w) === norm(b));
  return [WORDS[i].s, WORDS[j >= 0 ? j : i].e + 0.05];
};

const KIT = KitchenSet({ veil: 0.25 });
const KITDARK = KitchenSet({ veil: 0.3, dark: 0.6 });
const kitFeet = (u: number, w: number) => KITCHEN.P(u, 1, w).y;
const BRIDGE_DAWN = BridgeSet({ dawn: 1 });
const bFeet = BRIDGE.feet;

// ---------- S1: day twelve ----------
export const S1 = egCard({ kicker: 'DAY 12', title: 'THE QUIET PART', Bg: KITDARK });

// ---------- S2: you've stopped talking out loud ----------
const youK = stand(KITCHEN, 0.6, 0.6);
export const S2 = scene({
  Set: KIT, cam: { from: [960, 520, 1.1], to: [960, 540, 1.18] }, day: 12,
  cast: [{ look: YOU, pose: { ...youK, yaw: 0.3 }, faces: [[0, 'tired']] }],
  front: (t) => <Noodle x={youK.x + 260} y={kitFeet(0.6, 0.6)} s={0.55} t={t} sit look={-1} flip />,
});

// ---------- S3: well, except to the dog ----------
export const S3 = scene({
  Set: KIT, cam: { from: [youK.x + 130, 620, 1.75], to: [youK.x + 140, 620, 1.85] }, day: 12,
  cast: [{ look: YOU, pose: { ...youK, yaw: 0.7, headTilt: 14, armR: { a: -40, b: -30 } }, faces: [[0, 'happy']] }],
  front: (t) => <Noodle x={youK.x + 260} y={kitFeet(0.6, 0.6)} s={0.55} t={t} sit look={-1} flip />,
});

// ---------- S4: he followed you home from the bus on the first morning ----------
export const S4 = scene({
  Set: TownSet('morning', { bus: true }), setT: 300, cam: { from: [900, 560, 1.2], to: [1000, 560, 1.25] }, day: 1,
  cast: (t) => [{ look: YOU, pose: walk(t, 640, 1240, 0, 120, TOWN.feet, 1), faces: [[0, 'neutral'], [50, 'happy']] }],
  front: (t) => <Noodle x={kf(t, [[10, 300], [128, 940]])} y={TOWN.feet + 6} s={0.6} t={t} walk={t > 10 ? 1 : 0} />,
  over: (t) => (
    <g>
      <rect width={1920} height={1080} fill="#C8A060" opacity={0.18} />
      <text x={1850} y={1020} textAnchor="end" fontFamily={FONT.hand} fontSize={64} fill="#F6EFE3" stroke="#14121C" strokeWidth={8} paintOrder="stroke" opacity={clamp((t - 60) / 10)}>NOODLE</text>
    </g>
  ),
});

// ---------- S5: a routine. Wake up ----------
export const S5 = insert({
  Bg: BedroomSet({ clock: '07:12', veil: 0.2 }), push: 0.1,
  draw: (t) => (
    <g transform={`translate(${Math.sin(t * 2.2) * (t < 30 ? 4 : 0)} 0)`}>
      <DigitalClock x={960} y={540} s={1.3} text="7:12" t={t} />
      {t < 30 ? [-1, 1].map((sd) => <path key={sd} d={`M ${960 + sd * 420} 400 q ${sd * 40} 140 0 280`} stroke="#F6EFE3" strokeWidth={10} fill="none" strokeLinecap="round" opacity={0.7} />) : null}
    </g>
  ),
});

// ---------- S6: check Mo's door ----------
export const S6 = insert({
  Bg: HomeSet('day'), push: 0.08,
  draw: () => (
    <g>
      <rect x={560} y={-100} width={800} height={1300} fill="#3A8A5A" stroke="#14121C" strokeWidth={10} />
      <circle cx={1280} cy={620} r={22} fill="#E8C060" />
      <DoorNote x={960} y={520} s={2} lines={['GONE TO THE MALL.', 'COME FIND ME.', '- you']} age={1} rot={-12} />
    </g>
  ),
});

// ---------- S7: feed Noodle ----------
export const S7 = insert({
  Bg: KIT, push: 0.1,
  draw: (t) => (
    <g>
      <rect x={-100} y={760} width={2200} height={500} fill="#C8B49A" />
      <path d="M 760 860 L 1160 860 L 1110 960 L 810 960 Z" fill={EG.red} stroke="#14121C" strokeWidth={8} />
      <text x={960} y={930} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#F6EFE3">NOODLE</text>
      {Array.from({ length: 14 }).map((_, i) => {
        const land = 860 - (i % 5) * 10;
        const y = Math.min(land, -100 + (t - i * 1.5) * 40);
        return <circle key={i} cx={800 + rnd(5, i) * 320} cy={y} r={16} fill="#8A5A30" stroke="#14121C" strokeWidth={3} />;
      })}
    </g>
  ),
});

// ---------- S8: collect cans ----------
export const S8 = insert({
  Bg: KIT, push: 0.06,
  draw: (t) => (
    <g>
      <rect x={-100} y={860} width={2200} height={400} fill="#C8B49A" />
      {Array.from({ length: 10 }).map((_, i) => {
        const row = i < 4 ? 0 : i < 7 ? 1 : i < 9 ? 2 : 3;
        const idx = i < 4 ? i : i < 7 ? i - 4 : i < 9 ? i - 7 : 0;
        const x = 960 + (idx - (3 - row) / 2) * 160;
        const y = 860 - row * 190;
        const k = backOut(clamp((t - i * 2.5) / 6));
        return <g key={i} transform={`translate(0 ${(1 - k) * -300})`} opacity={k > 0 ? 1 : 0}><Can x={x} y={y} s={1} label={['BEANS', 'SOUP', 'CORN', 'TUNA'][i % 4]} color={['#C83A3A', '#3A7AC8', '#F2C14E', '#5BC08A'][i % 4]} /></g>;
      })}
    </g>
  ),
});

// ---------- S9: count the days on the wall with a marker ----------
export const S9 = insert({
  bgColor: '#E8DCC8', push: 0.06,
  draw: (t) => {
    const k = clamp((t - 20) / 10);
    const g = Math.floor(11 / 5);
    const tip = { x: 640 + g * 150 + (11 % 5) * 28 + 4, y: 420 + 100 * k };
    return (
      <g>
        <rect x={-100} y={-100} width={2200} height={1300} fill="#E8DCC8" />
        {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M ${i * 70} 0 V 1080`} stroke="#D8CCB8" strokeWidth={3} />)}
        <Tally x={640} y={420} n={12} s={1} draw={k} />
        <ArmIn from={[2100, 1200]} to={[tip.x + 40, tip.y + 50]} w={120} />
        <rect x={tip.x - 4} y={tip.y - 6} width={22} height={70} rx={6} fill="#14121C" transform={`rotate(-30 ${tip.x} ${tip.y})`} />
        <text x={960} y={760} textAnchor="middle" fontFamily={FONT.hand} fontSize={70} fill="#14121C" opacity={clamp((t - 34) / 8)}>12</text>
      </g>
    );
  },
});

// ---------- S10: the silence is the worst part ----------
export const S10 = scene({
  Set: KITDARK, cam: { from: [960, 520, 1.0], to: [960, 520, 1.08] },
  cast: [{ look: YOU, pose: { ...stand(KITCHEN, 0.45, 0.75), yaw: 0 }, faces: [[0, 'tired']] }],
  front: (t) => <Noodle x={1240} y={kitFeet(0.7, 0.75)} s={0.45} t={t} sit flip />,
});

// a small kitchen radio with its dial lit
const Radio: React.FC<{ t: number }> = ({ t }) => (
  <g transform="translate(960 620)">
    <rect x={-360} y={-200} width={720} height={380} rx={50} fill="#C85A3A" stroke="#14121C" strokeWidth={10} />
    <circle cx={-170} cy={0} r={130} fill="#3A2A2A" stroke="#14121C" strokeWidth={8} />
    {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M -270 ${-90 + i * 30} H -70`} stroke="#14121C" strokeWidth={6} />)}
    <rect x={30} y={-120} width={280} height={110} rx={14} fill="#FFD88A" />
    <Glow x={170} y={-65} r={200} kind="warm" o={0.5} />
    <path d="M 60 -65 H 280" stroke="#8A6A3A" strokeWidth={4} />
    <rect x={150 + Math.sin(t / 30) * 40} y={-110} width={8} height={90} fill={EG.red} />
    <circle cx={110} cy={80} r={44} fill="#2A2232" />
    <circle cx={240} cy={80} r={44} fill="#2A2232" />
    {[0, 1, 2].map((i) => {
      const k = ((t / 12 + i / 3) % 1);
      return <path key={i} d={`M ${-330 - k * 140} ${-120 - k * 30} q -24 30 0 60 q 24 30 0 60`} stroke="#F6EFE3" strokeWidth={7} fill="none" opacity={0.8 * (1 - k)} />;
    })}
    <text x={-430} y={-260} textAnchor="middle" fontFamily={FONT.hand} fontSize={54} fill="#F6EFE3" opacity={0.8}>shhhhh</text>
  </g>
);

// ---------- S11: some nights you leave the radio on, just for the hiss ----------
export const S11 = insert({ Bg: KITDARK, push: 0.06, dim: 0.5, draw: (t) => <Radio t={t} /> });

// ---------- S12: scientists who study loneliness ----------
export const S12 = scene({
  Set: RoofSet({ night: 0.55, blackout: 1 }), setT: 1400, cam: { from: [960, 520, 1.0], to: [960, 560, 1.12] }, day: 12,
  cast: [{ look: YOU, pose: sitFloor(1100, 900, -1, 0.7, { headTilt: 16 }), faces: [[0, 'tired']] }],
});

// ---------- S12B: as bad as smoking fifteen cigarettes a day. That's real ----------
const Cig: React.FC<{ t: number }> = ({ t }) => (
  <g transform="translate(960 880)" opacity={0.2}>
    {Array.from({ length: 15 }).map((_, i) => <rect key={i} x={-560 + i * 76} y={-14} width={56} height={150} rx={8} fill={i * 3 < t ? '#F6EFE3' : '#3A3E52'} />)}
  </g>
);
export const S12B = fact({ Bg: RoofSet({ night: 0.55, blackout: 1 }), label: 'LONELINESS HURTS YOUR HEALTH AS MUCH AS', value: 15, suffix: ' CIGARETTES', sub: 'A DAY · Holt-Lunstad, 2010', icon: (t) => <Cig t={t} /> });

// ---------- S13: and you are starting to feel it ----------
export const S13 = faceCU({ look: YOU, Bg: RoofSet({ night: 0.55, blackout: 1 }), faces: [[0, 'tired']], yaw: -0.2, zoom: [3.0, 3.2], pose: { headTilt: 10 }, day: 12 });

// ---------- S14: that night, from the hotel roof, you see it ----------
export const S14 = scene({
  Set: RoofSet({ night: 0.75, blackout: 1 }), setT: 1500, cam: { from: [900, 560, 1.15], to: [940, 560, 1.25] },
  cast: (t) => [{ look: YOU, pose: { x: 760, y: hipOn(900, 0.9), scale: 0.9, yaw: -0.9, headTilt: -6 }, faces: [[0, 'tired'], [50, 'shock']] }],
});

// ---------- S15: across the river, one window is lit. One. In a city with no power ----------
export const S15: React.FC<ShotProps> = (p) => {
  const one = cueAt(words, p.f, p.t, 'One');
  const k = clamp((p.t - 6) / 16);
  const S = scene({
    Set: RiverSet({ one: k }), setT: 200,
    cam: [[0, 960, 520, 1.0], [Math.max(one, 10), 960, 520, 1.0], [Math.max(one, 10) + 30, 1143, 500, 2.6], [-1, 1143, 500, 2.8]],
  });
  return <S {...p} />;
};

// ---------- S16: at dawn, you cross the bridge ----------
export const S16 = scene({
  Set: BRIDGE_DAWN, setT: 100, cam: { from: [700, 560, 1.15], to: [900, 560, 1.15] }, day: 13,
  cast: (t, f) => [{ look: YOU, pose: walk(t, 100, 1000, 0, 63, bFeet, 0.9), faces: [[0, 'worried']] }],
});

// ---------- S17: standing in the middle of it, checking his watch: a man in a grey suit ----------
const suitWatch = { x: 1260, y: hipOn(bFeet, 0.95), scale: 0.95, yaw: -0.5, armL: { a: -70, b: -110 }, headTilt: 12 };
export const S17: React.FC<ShotProps> = (p) => {
  const reveal = cueAt(words, p.f, p.t, 'man');
  const S = scene({
    Set: BRIDGE_DAWN, setT: 170, cam: [[0, 1000, 560, 1.15], [Math.max(reveal - 30, 1), 1000, 560, 1.15], [-1, 1150, 560, 1.4]],
    cast: [
      { look: YOU, pose: { x: 820, y: hipOn(bFeet, 0.9), scale: 0.9, yaw: 0.6 }, faces: [[0, 'worried'], [reveal, 'shock']] },
      { look: SUIT, pose: suitWatch, faces: [[0, 'neutral']] },
    ],
  });
  return <S {...p} />;
};

// ---------- S18: he isn't surprised. He looks annoyed ----------
export const S18: React.FC<ShotProps> = (p) => {
  const ann = cueAt(words, p.f, p.t, 'annoyed');
  const F = faceCU({ look: SUIT, Bg: BRIDGE_DAWN, faces: [[0, 'neutral'], [ann, 'smug']], yaw: -0.3, zoom: [2.8, 2.95], pose: { headTilt: -4 } });
  return <F {...p} />;
};

// ---------- S19: his shoes are perfectly clean; everything else is covered in dust ----------
const Shoe: React.FC<{ x: number; flip?: boolean }> = ({ x, flip }) => (
  <g transform={`translate(${x} 800) scale(${flip ? -1 : 1} 1)`}>
    <path d="M -150 0 L -150 -110 Q -60 -130 0 -100 Q 120 -70 170 -30 Q 190 0 160 0 Z" fill="#14151A" stroke="#05060A" strokeWidth={6} />
    <path d="M -120 -96 Q -40 -112 20 -86" stroke="#F6EFE3" strokeWidth={10} strokeLinecap="round" opacity={0.7} fill="none" />
    <rect x={-160} y={-260} width={110} height={160} fill="#5A5F6B" />
  </g>
);
export const S19: React.FC<ShotProps> = (p) => {
  const dust = cueAt(words, p.f, p.t, 'dust');
  const I = insert({
    Bg: BRIDGE_DAWN, push: 0.08,
    draw: (t) => (
      <g>
        <rect x={-100} y={790} width={2200} height={400} fill="#8A8070" />
        {Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={rnd(11, i) * 1920} cy={820 + rnd(12, i) * 260} r={4 + rnd(13, i) * 10} fill="#B8A88A" opacity={0.7} />)}
        <Shoe x={760} />
        <Shoe x={1160} />
        {[0, 1, 2].map((i) => {
          const k = ((t / 16 + i / 3) % 1);
          return <path key={i} d="M 0 -20 L 6 -6 L 20 0 L 6 6 L 0 20 L -6 6 L -20 0 L -6 -6 Z" fill="#FFFFFF" transform={`translate(${700 + i * 220} ${690 + (i % 2) * 30}) scale(${Math.sin(k * Math.PI) * 1.6})`} />;
        })}
        {Array.from({ length: 20 }).map((_, i) => {
          const u = ((t / 60 + rnd(14, i)) % 1);
          return <circle key={`d${i}`} cx={rnd(15, i) * 1920 + Math.sin(t / 10 + i) * 30} cy={760 - u * 500} r={6} fill="#D8C8A8" opacity={clamp((t - dust + 10) / 10) * 0.6 * (1 - u)} />;
        })}
      </g>
    ),
  });
  return <I {...p} />;
};

// ---------- S20: 'You weren't supposed to be here. At 3:07, everyone was moved. You were missed.' ----------
const L20 = line('S19', 'You', 'missed');
export const S20 = scene({
  Set: BRIDGE_DAWN, setT: 260, cam: { from: [1030, 540, 1.6], to: [1040, 540, 1.7] }, words,
  cast: [
    { look: YOU, pose: { x: 820, y: hipOn(bFeet, 0.9), scale: 0.9, yaw: 0.6 }, faces: [[0, 'worried']] },
    { look: SUIT, pose: { x: 1240, y: hipOn(bFeet, 0.95), scale: 0.95, yaw: -0.6, armR: { a: -30, b: -60 } }, faces: [[0, 'neutral']], talk: [L20] },
  ],
});

// ---------- S20B: moved where? He doesn't answer ----------
export const S20B = faceCU({ look: YOU, Bg: BRIDGE_DAWN, faces: [[0, 'worried'], [40, 'shock']], yaw: 0.3, zoom: [2.9, 3.05] });

// ---------- S21: 'Who are you?' you ask ----------
const L21 = line('S21', 'Who', 'you');
export const S21 = faceCU({ look: YOU, Bg: BRIDGE_DAWN, faces: [[0, 'worried']], yaw: 0.25, zoom: [3.0, 3.1], words, talk: [L21] });

// ---------- S22: 'I count people. And today, my count is wrong by one.' ----------
const L22 = line('S21', 'I', 'one');
export const S22: React.FC<ShotProps> = (p) => {
  const wrong = cueAt(words, p.f, p.t, 'wrong');
  const F = faceCU({
    look: SUIT, Bg: BRIDGE_DAWN, faces: [[0, 'neutral'], [wrong, 'smug']], yaw: -0.3, zoom: [2.8, 2.9], words, talk: [L22], side: 200,
    over: (t) => (
      <g transform="translate(470 520)" opacity={clamp((t - 6) / 8)}>
        <rect x={-300} y={-170} width={600} height={340} rx={30} fill="#14182C" stroke="#F6EFE3" strokeOpacity={0.4} strokeWidth={4} />
        <text x={0} y={-90} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} letterSpacing={4} fill="#8AA8C8">LEFT BEHIND</text>
        <text x={0} y={-10} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#F6EFE3">EXPECTED: 0</text>
        <text x={0} y={70} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill={t >= wrong ? EG.red : '#F6EFE3'}>COUNTED: 1</text>
      </g>
    ),
  });
  return <F {...p} />;
};

// ---------- S23: he just points at the lit window across the river ----------
export const S23 = scene({
  Set: BRIDGE_DAWN, setT: 330, cam: { from: [1040, 520, 1.3], to: [1080, 500, 1.35] },
  cast: (t) => [
    { look: YOU, pose: { x: 820, y: hipOn(bFeet, 0.9), scale: 0.9, yaw: 0.3, look: 0.6 }, faces: [[0, 'worried']] },
    { look: SUIT, pose: { x: 1240, y: hipOn(bFeet, 0.95), scale: 0.95, yaw: 0.7, facing: 1, armL: { a: kf(t, [[0, 10], [10, -105]]), b: 0 } }, faces: [[0, 'neutral']] },
  ],
});

// ---------- S24: 'There's a door. It closes tomorrow at 3:07. I can take one more person through.' ----------
export const S24 = insert({
  bgColor: '#060A1A', push: 0.1,
  draw: (t) => (
    <g>
      <rect x={560} y={140} width={800} height={800} fill="#1A1E30" stroke="#3A3E52" strokeWidth={14} />
      <rect x={590} y={170} width={740} height={740} fill="#FFD88A" />
      <Glow x={960} y={540} r={700} kind="warm" o={0.6} />
      <rect x={830} y={300} width={260} height={610} fill="#F6EFE3" stroke="#14121C" strokeWidth={8} />
      <path d={`M 830 300 L ${830 + 260 * kf(t, [[0, 1], [40, 0.75]])} 330 L ${830 + 260 * kf(t, [[0, 1], [40, 0.75]])} 880 L 830 910 Z`} fill="#8A6A44" stroke="#14121C" strokeWidth={8} />
      <g transform="translate(960 1010)" opacity={clamp((t - 30) / 8)}>
        <rect x={-260} y={-60} width={520} height={90} rx={20} fill="#14182C" />
        <text x={0} y={6} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={3} fill={EG.gold}>CLOSES TOMORROW 3:07</text>
      </g>
    </g>
  ),
});

// ---------- S24B: your mum, your friends, your whole life. Back to normal ----------
export const S24B = insert({
  Bg: KIT, push: 0.1,
  draw: (t) => (
    <g>
      <BeachPhoto x={960} y={520} s={2.2} rot={kf(t, [[0, -8], [80, -3]])} />
    </g>
  ),
});

// ---------- S25: one more person. Just one ----------
export const S25 = bigWord({ kicker: 'ONE MORE PERSON', word: 'ONE', color: EG.red, size: 260 });
