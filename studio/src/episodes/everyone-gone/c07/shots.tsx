import React from 'react';
import { ShotProps, kf, clamp, backOut, FONT, Glow, hipOn, LEG_LEN } from '../../../engine';
import words from './words.json';
import timeline from './timeline.json';
import {
  YOU, ELLIE, SUIT, EG, RiverSet, BridgeSet, scene, faceCU, insert, cueAt, egCard, bigWord, Walkie, DigitalClock, Bubble, DustField,
  TreeHouse, TREE, TorchBeam, Noodle, Woof, sitFloor, SetC, handAt,
} from '../common';

// Chapter 7, the other voice: the tree house, Ellie, the hug; across the river the window goes out at 3:07; the man
// in the grey suit watching from the bridge; then a stranger on the walkie: "We can see your torch. There are more of
// us. Don't trust the man in the suit." The question for the comments, what was real, and the end screen.

type W = { w: string; s: number; e: number };
const WORDS = words as W[];
const startOf = (id: string) => ((timeline as { shots: { id: string; first: number }[] }).shots.find((s) => s.id === id)?.first ?? 0) / 30;
const norm = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '');
const line = (id: string, a: string, b: string): [number, number] => {
  const t0 = startOf(id) - 0.4;
  const i = WORDS.findIndex((w) => w.s >= t0 && norm(w.w) === norm(a));
  if (i < 0) return [0, 0];
  const j = WORDS.findIndex((w, k) => k > i && norm(w.w) === norm(b));
  return [WORDS[i].s, WORDS[j >= 0 ? j : i].e + 0.05];
};

const PARK: SetC = ({ t, id }) => <TreeHouse t={t} id={id} lamp={0.6} window={1} />;
const PARK_OUT: SetC = ({ t, id }) => <TreeHouse t={t} id={id} lamp={0.6} window={0} />;
const S_TH = 0.55; // people in the tree house
const ladderX = TREE.x1 - 80;

// Ellie, sitting wrapped in a blanket on the platform
const blanket = (x: number) => (
  <path d={`M ${x - 60} ${TREE.floor} Q ${x - 76} ${TREE.floor - 60} ${x - 30} ${TREE.floor - 92} Q ${x + 10} ${TREE.floor - 104} ${x + 50} ${TREE.floor - 86} Q ${x + 84} ${TREE.floor - 50} ${x + 70} ${TREE.floor} Z`} fill="#8A4A6A" stroke="#14121C" strokeWidth={5} />
);

// ---------- S1: the hiding place is the old tree house at the end of the park ----------
export const S1 = egCard({ kicker: '2:58 AM', title: 'THE TREE HOUSE', Bg: PARK });

// ---------- S2: you climb up ----------
export const S2 = scene({
  Set: PARK, setT: 100, cam: { from: [1100, 700, 1.4], to: [1100, 620, 1.5] },
  cast: (t, f) => [{ look: YOU, pose: { x: ladderX, y: kf(t, [[0, hipOn(TREE.ground, S_TH) - 40], [28, hipOn(TREE.floor, S_TH) + 60]]), scale: S_TH, yaw: 0, armR: { a: -160 + Math.sin(t / 2) * 15, b: 0 }, armL: { a: 160 - Math.sin(t / 2) * 15, b: 0 }, legL: { a: 20 + Math.sin(t / 2) * 20, b: -40 } }, faces: [[0, 'worried']] }],
  front: (t) => <Noodle x={ladderX - 240} y={TREE.ground} s={0.4} t={t} sit look={1} />,
});

// ---------- S3: there she is, wrapped in a blanket, holding the other walkie-talkie ----------
export const S3 = scene({
  Set: PARK, setT: 140, cam: { from: [960, 500, 2.0], to: [960, 500, 2.15] },
  cast: [
    { look: ELLIE, pose: sitFloor(860, TREE.floor, 1, S_TH, { headTilt: 6 }), faces: [[0, 'worried'], [30, 'shock']] },
    { look: YOU, pose: { x: 1120, y: hipOn(TREE.floor, S_TH), scale: S_TH, yaw: -0.6 }, faces: [[0, 'happy']] },
  ],
  front: (t) => (
    <g>
      {blanket(860)}
      <Walkie x={900} y={TREE.floor - 70} s={0.16} on={1} t={t} color="#4AA8E0" />
    </g>
  ),
});

// ---------- S4: she hugs you so hard you can't breathe ----------
export const S4 = scene({
  Set: PARK, setT: 180, cam: { from: [990, 480, 2.3], to: [990, 480, 2.45] },
  cast: [
    { look: YOU, pose: { x: 1000, y: hipOn(TREE.floor, S_TH), scale: S_TH, yaw: -0.7, armL: { a: -30, b: -100 }, armR: { a: -30, b: -100 }, headTilt: -6 }, faces: [[0, 'shock'], [20, 'happy']] },
    { look: ELLIE, pose: { x: 965, y: hipOn(TREE.floor, S_TH * 0.92), scale: S_TH * 0.92, yaw: 0.7, armL: { a: -30, b: -100 }, armR: { a: -30, b: -100 }, headTilt: 10 }, faces: [[0, 'happy']] },
  ],
});

// ---------- S5: across the river, the lit window flickers, and goes out. 3:07 ----------
export const S5: React.FC<ShotProps> = (p) => {
  const fl = cueAt(words, p.f, p.t, 'flickers');
  const out = cueAt(words, p.f, p.t, 'out');
  const one = p.t < fl ? 1 : p.t < out + 4 ? (Math.sin(p.t * 1.9) > 0 ? 1 : 0.2) : 0;
  const S = scene({ Set: RiverSet({ one }), setT: 300, cam: { from: [1100, 500, 1.6], to: [1143, 490, 2.2] } });
  return <S {...p} />;
};

// ---------- S6: the door is closed ----------
export const S6 = insert({ bgColor: '#060A1A', push: 0.1, draw: (t) => <DigitalClock x={960} y={540} s={1.3} text="3:07" t={t} /> });

// ---------- S7: it's just the two of you now ----------
export const S7 = scene({
  Set: PARK_OUT, setT: 220, cam: { from: [960, 560, 1.25], to: [960, 560, 1.35] },
  cast: [
    { look: ELLIE, pose: sitFloor(880, TREE.floor, 1, S_TH * 0.92), faces: [[0, 'tired']] },
    { look: YOU, pose: sitFloor(1000, TREE.floor, -1, S_TH), faces: [[0, 'tired']] },
  ],
  front: () => blanket(880),
});

// ---------- S8: Noodle barks once from the bottom of the ladder ----------
export const S8: React.FC<ShotProps> = (p) => {
  const b = cueAt(words, p.f, p.t, 'barks');
  const S = scene({
    Set: PARK_OUT, setT: 260, cam: { from: [ladderX - 100, 820, 2.0], to: [ladderX - 100, 820, 2.1] },
    front: (t) => (
      <g>
        <Noodle x={ladderX - 200} y={TREE.ground} s={0.5} t={t} bark={t > b && t < b + 10 ? 1 : 0} look={1} />
        {t > b && t < b + 22 ? <Woof x={ladderX - 100} y={TREE.ground - 160} t={t - b} s={0.8} /> : null}
      </g>
    ),
  });
  return <S {...p} />;
};

// ---------- S9: far away, on the bridge, a tiny figure in a grey suit, looking straight at your torch ----------
export const S9 = scene({
  Set: BridgeSet({ dark: 0.45 }), setT: 500, cam: { from: [960, 560, 1.0], to: [1000, 620, 2.4] },
  cast: [{ look: SUIT, pose: { x: 1000, y: hipOn(880, 0.5), scale: 0.5, yaw: 0, look: 0 }, faces: [[0, 'neutral']] }],
  over: () => <rect width={1920} height={1080} fill="#060A1A" opacity={0.2} />,
});

// ---------- S10: or is it? ----------
export const S10 = faceCU({ look: YOU, Bg: PARK_OUT, faces: [[0, 'worried']], yaw: 0.3, zoom: [2.9, 3.05], dim: 0.35 });

// ---------- S11: Ellie's walkie crackles, and a voice you have never heard: 'We can see your torch. There are more of us.' ----------
export const S11: React.FC<ShotProps> = (p) => {
  const c = (w: string) => cueAt(words, p.f, p.t, w);
  const I = insert({
    Bg: PARK_OUT, push: 0.06, dim: 0.55,
    draw: (t) => (
      <g>
        <Walkie x={640} y={1000} s={1.7} rot={-6} on={1} hiss={1} t={t} color="#4AA8E0" />
        <Bubble x={1250} y={360} t={t} at={c('We')} text="We can see your torch." color="#8AE8A8" />
        <Bubble x={1250} y={560} t={t} at={c('There')} text="There are more of us." color="#8AE8A8" />
      </g>
    ),
  });
  return <I {...p} />;
};

// ---------- S11B: 'Don't trust the man in the suit.' ----------
export const S11B: React.FC<ShotProps> = (p) => {
  const S = scene({
    Set: PARK_OUT, setT: 300, cam: { from: [960, 470, 2.4], to: [960, 470, 2.6] },
    cast: [
      { look: ELLIE, pose: { x: 900, y: hipOn(TREE.floor, S_TH * 0.92), scale: S_TH * 0.92, yaw: 0.6, look: 0.8 }, faces: [[0, 'shock']] },
      { look: YOU, pose: { x: 1020, y: hipOn(TREE.floor, S_TH), scale: S_TH, yaw: -0.6, look: -0.8 }, faces: [[0, 'shock']] },
    ],
    over: (t) => <Bubble x={960} y={160} t={t} at={0} text="Don't trust the man in the suit." color="#8AE8A8" size={52} />,
  });
  return <S {...p} />;
};

// ---------- S12: Ellie looks at you. 'Who was that?' You don't know ----------
const L12 = line('S12', 'Who', 'that');
export const S12 = scene({
  Set: PARK_OUT, setT: 340, cam: { from: [960, 470, 2.4], to: [960, 470, 2.5] }, words,
  cast: [
    { look: ELLIE, pose: { x: 900, y: hipOn(TREE.floor, S_TH * 0.92), scale: S_TH * 0.92, yaw: 0.6, look: 0.8 }, faces: [[0, 'worried']], talk: [L12] },
    { look: YOU, pose: { x: 1020, y: hipOn(TREE.floor, S_TH), scale: S_TH, yaw: -0.4, armL: { a: -40, b: -90 }, armR: { a: -40, b: -90 } }, faces: [[0, 'worried']] },
  ],
});

// ---------- S13: somewhere out there in the dark, someone has been watching you for twelve days ----------
export const S13: React.FC<ShotProps> = (p) => {
  const S = scene({
    Set: RiverSet({ one: 0 }), setT: 400, cam: { from: [960, 520, 1.0], to: [800, 520, 1.3] },
    front: (t) =>
      [[420, 520], [760, 470], [1560, 540]].map(([x, y], i) => {
        const on = clamp((t - 20 - i * 25) / 6) * (0.6 + 0.4 * Math.sin(t / 5 + i));
        return (
          <g key={i} opacity={on}>
            <circle cx={x} cy={y} r={7} fill="#F6EFE3" />
            <Glow x={x} y={y} r={60} kind="cool" o={0.6} />
          </g>
        );
      }),
  });
  return <S {...p} />;
};

// ---------- S14: would you have gone through the door? Tell us in the comments. Part two ----------
export const S14: React.FC<ShotProps> = (p) => {
  const tell = cueAt(words, p.f, p.t, 'Tell');
  const t = p.t;
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  return (
    <g>
      <DustField t={t} />
      <text x={960} y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp(t / 6)}>WOULD YOU HAVE GONE</text>
      <text x={960} y={360} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill={EG.gold} stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp((t - 4) / 6)}>THROUGH THE DOOR?</text>
      {[[600, 'THE DOOR', 'see Mum again', '#FFD88A'], [1320, 'ELLIE', 'stay in the dark', '#4AA8E0']].map(([x, a, b, c], i) => (
        <g key={i} transform={`translate(${x} 620) scale(${pop(12 + i * 6)})`}>
          <rect x={-260} y={-110} width={520} height={220} rx={30} fill="#14182C" stroke={c as string} strokeWidth={6} />
          <text y={0} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill={c as string}>{a}</text>
          <text y={60} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#C8C2D8">{b}</text>
        </g>
      ))}
      <text x={960} y={630} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" opacity={clamp((t - 18) / 6)}>OR</text>
      <g transform={`translate(960 900) scale(${pop(tell)})`}>
        <rect x={-360} y={-56} width={720} height={92} rx={46} fill={EG.red} />
        <text y={4} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} letterSpacing={4} fill="#F6EFE3">TELL US IN THE COMMENTS</text>
      </g>
    </g>
  );
};

// ---------- S15: is any of this real? The disappearing, no. But the blackout, the subway, the reactors, loneliness? ----------
export const S15: React.FC<ShotProps> = (p) => {
  const c = (w: string) => cueAt(words, p.f, p.t, w);
  const t = p.t;
  const rows: [string, string, boolean][] = [
    ['disappearing', 'EVERYONE DISAPPEARING', false],
    ['blackout', 'THE BLACKOUT', true],
    ['subway', 'THE FLOODING SUBWAY', true],
    ['reactors', 'THE REACTORS', true],
    ['loneliness', 'THE LONELINESS', true],
  ];
  return (
    <g>
      <DustField t={t} />
      <text x={960} y={200} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp((c('Is') - 2 < t ? t - c('Is') + 2 : 0) / 6)}>IS ANY OF THIS REAL?</text>
      {rows.map(([w, label, real], i) => {
        const at = c(w);
        const k = backOut(clamp((t - at + 4) / 8));
        return (
          <g key={i} transform={`translate(560 ${340 + i * 130}) scale(${k})`}>
            <text x={0} y={20} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3">{label}</text>
            <g transform="translate(860 0)">
              <circle r={44} fill={real ? '#3A8A5A' : EG.red} />
              <path d={real ? 'M -20 0 L -6 16 L 22 -16' : 'M -16 -16 L 16 16 M 16 -16 L -16 16'} stroke="#F6EFE3" strokeWidth={10} fill="none" strokeLinecap="round" />
            </g>
          </g>
        );
      })}
    </g>
  );
};

// ---------- S15B: all real. The sources are in the description ----------
export const S15B = bigWord({ word: 'ALL REAL.', color: EG.gold, sub: 'SOURCES IN THE DESCRIPTION', size: 220 });

// ---------- S16: end screen (no voice): room for YouTube's end-screen video and subscribe elements ----------
export const S16: React.FC<ShotProps> = ({ t }) => {
  const k = backOut(clamp(t / 12));
  return (
    <g>
      <DustField t={t} n={30} />
      <text x={960} y={150} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={10} fill={EG.gold} opacity={clamp(t / 10)}>PART 2 IS COMING</text>
      <text x={960} y={235} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={86} fill="#F6EFE3" opacity={clamp((t - 6) / 10)}>WATCH NEXT</text>
      <g transform={`translate(640 600) scale(${k})`}>
        <rect x={-430} y={-242} width={860} height={484} rx={24} fill="#0B0816" opacity={0.55} stroke={EG.gold} strokeWidth={6} strokeDasharray="22 14" />
      </g>
      <g transform={`translate(1460 600) scale(${k})`}>
        <circle r={190} fill="#0B0816" opacity={0.55} stroke="#F6EFE3" strokeWidth={6} strokeDasharray="22 14" />
      </g>
      <g transform="translate(960 960)" opacity={clamp((t - 12) / 10)}>
        <Walkie x={0} y={60} s={0.4} on={(Math.floor(t / 15) % 2)} t={t} />
      </g>
    </g>
  );
};
