import React from 'react';
import { ShotProps, camT, kf, clamp, backOut, Helicopter, PoliceCar, PoliceCarFront, Barrier, ChocBar, FONT, WANT, SUBURB, SHOP, stand, KITCHEN, KitchenIsland, starsAt, WantedStars } from '../../../engine';
import words from './words.json';
import { YOU, MUM, ELLIE, REYES, COP, CLERK, HomeSet, KitchenSet, ShopSet, scene, faceCU, starsCU, bigWord, insert, walk, cueAt, starCard, span, ChatPhone, Who, people } from '../common';

// Chapter 6, the choice: Ellie and the chocolate bar she forgot to pay for; a star fills in over her; the stars spread;
// four cars and a helicopter outside; Mum: "What did you do?"; you tell her everything; Mo: run; running made it worse,
// every time; Reyes: your choice; you walk Ellie back to the shop and pay; her star goes out; the street lit up, the
// megaphone; you walk out, hands where everyone can see them, and your stars go out one by one.

const KIT = KitchenSet({ veil: 0.18, police: 0.6 });
const OUT = HomeSet('morning', { police: 1 });
const ME = stand(KITCHEN, 0.66, 0.42), EL = stand(KITCHEN, 0.46, 0.46), MU = stand(KITCHEN, 0.3, 0.4);
const elS = EL.scale * 0.72;
const Cars: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <PoliceCar x={360} y={SUBURB.kerb + 140} s={0.85} t={t} />
    <PoliceCarFront x={1220} y={SUBURB.kerb + 200} s={0.85} t={t} seed={3} />
    <PoliceCar x={1700} y={SUBURB.kerb + 130} s={0.85} t={t} seed={5} flip />
    <Barrier x={820} y={SUBURB.kerb + 240} s={0.9} light={1} t={t} />
  </g>
);

// ---------- S1: chapter 6 ----------
export const S1 = starCard({ kicker: 'CHAPTER 6', title: 'THE CHOICE', seed: 17, n: 4 });

// ---------- S2: Ellie comes downstairs with a chocolate bar ----------
export const S2 = scene({
  Set: KIT, setT: 100, cam: { from: [800, 560, 1.4], to: [820, 560, 1.48] }, words,
  cast: (t) => [
    { look: ELLIE, pose: { ...walk(t, 300, EL.x, 0, 60, EL.y + 170 * elS, elS), armR: { a: 70, b: -60 } }, faces: [[0, 'happy']] },
    { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.5, look: -0.8 }, faces: [[0, 'worried']], stars: 4 },
  ],
  front: (t) => <ChocBar x={kf(t, [[0, 300], [60, EL.x]]) + 60} y={EL.y - 10} s={0.5} rot={-20} />,
});

// ---------- S3: she forgot to pay. She's seven ----------
export const S3 = insert({ Bg: KIT, push: 0.1, draw: (t) => (
  <g>
    <path d="M 0 900 Q 500 760 820 640" stroke="#3E8C86" strokeWidth={130} fill="none" strokeLinecap="round" />
    <circle cx={850} cy={620} r={80} fill="#26232F" />
    <ChocBar x={960} y={560} s={3} rot={-14} />
    <text x={1300} y={300} fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 20) / 6)}>NOT PAID</text>
  </g>
) });

// ---------- S4: above her head, very faint, one star begins to fill in ----------
export const S4: React.FC<ShotProps> = (p) => {
  const b = cueAt(words, p.f, p.t, 'begins');
  const F = faceCU({ look: ELLIE, Bg: KIT, faces: [[0, 'happy']], yaw: 0.2, zoom: [2.8, 3.0], pose: { scale: 0.75, y: 690 }, stars: [[0, 0], [b - 10, 0.5], [b + 14, 1.25]] });
  return <F {...p} />;
};

// ---------- S5: Ellie can't see it, but she can see your face: "Am I in trouble?" ----------
export const S5 = faceCU({ look: ELLIE, Bg: KIT, faces: [[0, 'neutral'], [40, 'worried']], yaw: 0.25, zoom: [3.0, 3.2], pose: { scale: 0.75, y: 690 }, stars: 1, words, talk: [span(words, 'Am', 'trouble')] });

// ---------- S6: you understand two things at once ----------
export const S6 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'shock']], yaw: -0.3, stars: 4, zoom: [2.6, 2.85], siren: 0.3 });

// ---------- S7: they spread to the people standing closest to you ----------
export const S7 = scene({
  Set: KIT, setT: 300, cam: { from: [(EL.x + ME.x) / 2, 500, 1.8], to: [(EL.x + ME.x) / 2, 500, 1.9] }, words,
  cast: [
    { look: ELLIE, pose: { x: EL.x, y: EL.y, scale: elS, yaw: 0.5, look: 0.8 }, faces: [[0, 'worried']], stars: 1 },
    { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.5, look: -0.8 }, faces: [[0, 'worried']], stars: 4 },
  ],
  over: (t) => <g transform={camT((EL.x + ME.x) / 2, 500, 1.85)}><path d={`M ${ME.x} ${ME.y - 330 * ME.scale} Q ${(EL.x + ME.x) / 2} ${ME.y - 460 * ME.scale} ${EL.x} ${EL.y - 300 * elS}`} stroke={WANT.gold} strokeWidth={5} strokeDasharray="12 12" strokeDashoffset={-t * 2} fill="none" opacity={0.8} /></g>,
});

// ---------- S8: outside, four police cars and a helicopter ----------
export const S8 = scene({
  Set: OUT, setT: 200, cam: { from: [960, 520, 1.0], to: [960, 540, 1.06] }, siren: 0.4,
  back: (t) => <Helicopter x={kf(t, [[0, 1500], [120, 1300]])} y={90} s={0.5} t={t} beam={{ a: 25, len: 1100, w: 300, o: 0.45 }} />,
  front: (t) => <Cars t={t} />,
});

// ---------- S9: Mum looks at the lights, then at you: "What did you do?" ----------
export const S9 = faceCU({ look: MUM, Bg: KIT, faces: [[0, 'shock'], [30, 'worried']], yaw: -0.3, look_: kf(0, [[0, 0]]), zoom: [2.6, 2.8], siren: 0.4, words, talk: [span(words, 'What', 'do')] });

// ---------- S10: for the first time, you tell her the truth. All of it ----------
export const S10 = scene({
  Set: KIT, setT: 400, cam: { from: [(MU.x + ME.x) / 2, 520, 1.5], to: [(MU.x + ME.x) / 2, 520, 1.6] }, words,
  cast: (t, f) => [
    { look: MUM, pose: { x: MU.x + 120, y: MU.y, scale: MU.scale, yaw: 0.5, look: 0.8 }, faces: [[0, 'worried'], [70, 'neutral']] },
    { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.5, look: -0.8 }, faces: [[0, 'worried']], stars: 4, talk: [[(f - t + 10) / 30, (f - t + 200) / 30]] },
  ],
});

// ---------- S11: Mo: "Run. Out the back, through the gardens. Hide long enough and they fade." ----------
export const S11: React.FC<ShotProps> = (p) => {
  const c = (w: string, n = 1) => cueAt(words, p.f, p.t, w, n);
  const I = insert({ Bg: KIT, push: 0.06, draw: (t) => (
    <ChatPhone x={960} y={560} s={1.2} t={t} name="Mo" msgs={[
      { at: c('Run') - 4, text: 'RUN' },
      { at: c('Out') - 2, text: 'out the back|through the gardens' },
      { at: c('Hide') - 2, text: 'hide long enough|and they fade' },
      { at: c('You', 1) - 2, text: 'you know that' },
    ]} />
  ) });
  return <I {...p} />;
};

// ---------- S12: but you know something else now ----------
export const S12 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'worried'], [40, 'neutral']], yaw: 0.3, stars: 4, zoom: [2.8, 3.1], siren: 0.25 });

// ---------- S13: running is what made it worse. Every single time ----------
export const S13 = bigWord({ kicker: 'EVERY SINGLE TIME', word: 'RUNNING MADE IT WORSE', color: WANT.red, size: 110 });

// ---------- S14: Reyes: "It's your choice. Not mine." ----------
export const S14 = faceCU({ look: REYES, Bg: KIT, faces: [[0, 'neutral']], yaw: 0.35, zoom: [2.7, 2.9], siren: 0.25, words, talk: [span(words, "It's", 'choice'), span(words, 'Not', 'mine')] });

// ---------- S15: you take Ellie's hand and walk her back to the corner store ----------
export const S15 = scene({
  Set: OUT, setT: 500, cam: { from: [700, 520, 1.35], to: [1000, 520, 1.4] }, words, siren: 0.2,
  cast: (t) => [
    { look: YOU, pose: { ...walk(t, 500, 1300, 0, 160, SUBURB.feet), armL: { a: 30, b: -10 } }, faces: [[0, 'neutral']], stars: 4 },
    { look: ELLIE, pose: { ...walk(t, 380, 1180, 0, 160, SUBURB.feet, 0.72), armR: { a: 40, b: -10 } }, faces: [[0, 'worried']], stars: 1 },
  ],
  front: (t) => <Cars t={t} />,
});

// ---------- S16: you pay for it. Her star flickers and goes out ----------
export const S16 = scene({
  Set: ShopSet, setT: 300, cam: { from: [1350, 520, 1.5], to: [1350, 520, 1.6] }, words,
  cast: (t, f) => {
    const fl = cueAt(words, f, t, 'flickers');
    return [
      { look: CLERK, pose: { x: 1780, y: SHOP.feet - 170, yaw: -0.6 }, faces: [[0, 'neutral'], [fl, 'happy']] },
      { look: ELLIE, pose: { x: 1180, y: SHOP.feet - 170 * 0.72, scale: 0.72, yaw: 0.5, look: 0.5 }, faces: [[0, 'worried'], [fl + 20, 'happy']], stars: [[0, 1], [fl, 1.5], [fl + 24, 0]] },
      { look: YOU, pose: { x: 1400, y: SHOP.feet - 170, yaw: 0.6, armR: { a: kf(t, [[0, 20], [20, 80]]), b: -20 } }, faces: [[0, 'neutral']], stars: 4 },
    ];
  },
  front: () => <ChocBar x={1540} y={SHOP.counterTop - 40} s={0.6} />,
});

// ---------- S17: the street lit up blue and red; an officer with a megaphone ----------
const Megaphone: React.FC<{ x: number; y: number }> = ({ x, y }) => <g transform={`translate(${x} ${y})`}><path d="M 0 -18 L 70 -50 L 70 50 L 0 18 Z" fill="#F4F2EC" stroke="#14151C" strokeWidth={5} /><rect x={-30} y={-18} width={34} height={36} fill="#E8402A" stroke="#14151C" strokeWidth={4} /></g>;
export const S17 = scene({
  Set: OUT, setT: 600, cam: { from: [1300, 560, 1.4], to: [1300, 560, 1.48] }, words, siren: 0.35,
  cast: [{ look: COP, pose: { x: 1300, y: SUBURB.kerb + 60 - 170, yaw: -0.6, armR: { a: 80, b: -60 } }, faces: [[0, 'neutral']], talk: [span(words, 'Nobody', 'way')] }],
  front: (t) => <g><Megaphone x={1210} y={SUBURB.kerb - 170} /><PoliceCarFront x={1620} y={SUBURB.kerb + 160} s={0.85} t={t} seed={3} /></g>,
});

// ---------- S18: you walk back out, slowly, hands where everyone can see them, towards the lights ----------
export const S18 = scene({
  Set: OUT, setT: 700, cam: { from: [960, 560, 1.25], to: [960, 600, 1.45] }, words, siren: 0.45,
  cast: (t, f) => {
    const one = cueAt(words, f, t, 'one');
    return [{ look: YOU, pose: { ...walk(t, 760, 1100, 0, 120, SUBURB.feet + 60, 1.05), armL: { a: 110, b: -40 }, armR: { a: 110, b: -40 }, handL: 'open', handR: 'open' }, faces: [[0, 'worried'], [one + 30, 'neutral']], stars: [[0, 4], [one, 3.25], [one + 12, 2.25], [one + 24, 1.25], [one + 36, 0]] }];
  },
  front: (t) => <g><PoliceCarFront x={480} y={SUBURB.kerb + 170} s={0.9} t={t} beams={1} /><PoliceCarFront x={1480} y={SUBURB.kerb + 170} s={0.9} t={t} seed={4} beams={1} /></g>,
});

// ---------- S19: one by one, your stars go out ----------
export const S19 = starsCU({ k: [[0, 3], [10, 2.25], [22, 1.25], [34, 0]], Bg: OUT });

// ---------- S17W: the whole street lit up blue and red, neighbours at every window ----------
export const S17W = scene({
  Set: HomeSet('morning', { police: 1, lit: 0.8 }), setT: 650, cam: { from: [960, 480, 1.0], to: [960, 470, 1.08] }, siren: 0.5,
  back: (t) => <Helicopter x={kf(t, [[0, 600], [150, 800]])} y={60} s={0.5} t={t} beam={{ a: -10, len: 1100, w: 300, o: 0.4 }} />,
  front: (t) => <Cars t={t} />,
});
