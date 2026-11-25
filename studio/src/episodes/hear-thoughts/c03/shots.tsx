import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, FONT, SUBURB, stand, KITCHEN, KitchenIsland, CLS, SHOP, shopHip, pizzaHip, PizzaTable,
  THINK, Glow, hallHip,
} from '../../../engine';
import words from './words.json';
import tl from './timeline.json';
import {
  YOU, MO, MUM, ELLIE, PRIYA, SHOPMAN, KID, N2, N5, StreetSet, KitchenSet, ShopSet, ClassSet, PizzaSet, HallSet, faceCU, thinkCard, bigWord, thoughtCU,
  people, at, scene, propCU, cueIn, span,
} from '../common';

// Chapter 3, the fun part: Priya's answer in the maths test (you feel a bit bad; an A); the game shop haggle; Mo
// finds out ("Never do that again. Also... do Priya."); Priya's thoughts at lunch, Mo says hi, tomato face; family
// cards; mum's blue boots; Mo's detective price list; Saturday, the shopping centre, and you stop laughing.

const c = (shot: string, w: string, n = 1) => cueIn(words, tl, shot, w, n);
const CLASS = ClassSet(0);
const SHOPS = ShopSet(0);
const DAY = StreetSet('day');
const DUSK = StreetSet('dusk');
const KIT = KitchenSet(0.45);
const KITD = KitchenSet(0.15);
const LUNCH = PizzaSet;
const MALL = HallSet('mall');

export const S1 = thinkCard({ kicker: 'CHAPTER 3', title: 'THE FUN PART', seed: 8 });

// ---------- the maths test ----------
const Paper: React.FC<{ x: number; y: number; s?: number; ans?: string; grade?: string; t?: number }> = ({ x, y, s = 1, ans = '', grade, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-4)`}>
    <rect x={-260} y={-330} width={520} height={660} rx={8} fill="#F8F4EA" stroke="#C8C0B0" strokeWidth={4} />
    <text x={-220} y={-260} fontFamily={FONT.ui} fontSize={34} fill="#26232F">MATHS TEST</text>
    {['1.  4 x 7 = 28', '2.  81 / 9 = 9', '3.  30% of 50 = 15', '4.  50 / 4 = '].map((l, i) => (
      <text key={i} x={-220} y={-170 + i * 90} fontFamily={FONT.hand} fontSize={40} fill="#26232F">{l}</text>
    ))}
    <text x={110} y={100} fontFamily={FONT.hand} fontWeight={700} fontSize={48} fill="#2A4AB8">{ans}</text>
    {grade ? (
      <g transform={`translate(150 220) scale(${backOut(clamp(t / 8))})`}>
        <circle r={80} fill="none" stroke="#E8302A" strokeWidth={10} />
        <text y={36} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={110} fill="#E8302A">{grade}</text>
      </g>
    ) : null}
  </g>
);
const ME_C = stand(CLS, 0.55, 0.7), PR_C = stand(CLS, 0.85, 0.55);
export const S2 = scene({
  Set: CLASS, cam: [960, 520, 1.15], to: [990, 520, 1.22], setT: 300,
  cast: [
    { look: YOU, pose: { x: ME_C.x, y: ME_C.y, scale: ME_C.scale, yaw: 0.1, look: 0.2, headTilt: 10, armR: { a: 40, b: -90 } }, faces: [[0, 'worried']] },
    { look: PRIYA, pose: { x: PR_C.x, y: PR_C.y, scale: PR_C.scale, yaw: -0.1, headTilt: 10, armR: { a: 40, b: -90 } }, faces: [[0, 'cool']] },
  ],
});
export const S3 = faceCU({ look: YOU, Bg: CLASS, faces: [[0, 'worried']], yaw: 0.1, zoom: [3.0, 3.2], pose: { headTilt: 12 }, think: { th: 'question four...?', pop: 6, s: 0.4, side: 0.5 } });
export const S4 = scene({
  Set: CLASS, cam: [PR_C.x - 60, PR_C.y - 180, 1.8], to: [PR_C.x - 60, PR_C.y - 180, 1.92], setT: 340,
  cast: [{ look: PRIYA, pose: { x: PR_C.x, y: PR_C.y, scale: PR_C.scale, yaw: -0.1, headTilt: 10, armR: { a: 40, b: -90 } }, faces: [[0, 'cool']], waves: 1 }],
});
export const S5 = scene({
  Set: CLASS, cam: [PR_C.x - 160, PR_C.y - 300, 1.4], to: [PR_C.x - 160, PR_C.y - 310, 1.48], setT: 380,
  cast: [{ look: PRIYA, pose: { x: PR_C.x, y: PR_C.y, scale: PR_C.scale, yaw: -0.1, headTilt: 10, armR: { a: 40, b: -90 } }, faces: [[0, 'smug']], think: { th: [[2, '12.5'], [c('S5', 'Easy'), '12.5. Easy.']], s: 0.9, side: -0.4 } }],
});
export const S6 = propCU({ Bg: CLASS, draw: (t) => <Paper x={960} y={560} s={1.25} ans={'12.5'.slice(0, Math.floor(clamp((t - 10) / 30) * 4))} />, push: 0.05 });
export const S7 = faceCU({ look: YOU, Bg: CLASS, faces: [[0, 'oops']], yaw: 0.2, zoom: [3.0, 3.15], pose: { headTilt: -6 } });
export const S8 = propCU({ Bg: CLASS, draw: (t) => <Paper x={960} y={560} s={1.25} ans="12.5" grade="A" t={t - 4} />, push: 0.06 });

// ---------- the game shop ----------
const GameBox: React.FC<{ x: number; y: number; s?: number; price?: string }> = ({ x, y, s = 1, price }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-60} y={-80} width={120} height={160} rx={8} fill="#2A5AA8" stroke="#16182A" strokeWidth={5} />
    <path d="M -40 30 L 0 -40 L 40 30 Z" fill="#FFD34A" />
    <text y={62} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={22} fill="#F6EFE3">ROBO 3</text>
    {price ? (
      <g transform="translate(46 -70) rotate(12)">
        <rect x={-34} y={-18} width={68} height={36} rx={6} fill="#FFE04A" stroke="#26232F" strokeWidth={3} />
        <text y={10} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={26} fill="#26232F">{price}</text>
      </g>
    ) : null}
  </g>
);
const fortyLine = span(words, 'Forty', 'price');
export const S9 = scene({
  Set: SHOPS, cam: [1040, 500, 1.5], to: [1040, 500, 1.6], setT: 200, words, talk: { 1: [fortyLine] },
  cast: [
    { look: YOU, pose: { x: 760, y: shopHip(1), yaw: 0.5, look: 0.7 }, faces: [[0, 'neutral']] },
    { look: SHOPMAN, pose: { x: 1300, y: shopHip(1), yaw: -0.5, armL: { a: 60, b: -60 } }, faces: [[0, 'cool']] },
  ],
  front: () => <GameBox x={1040} y={SHOP.counterTop - 80} s={1.1} price="$40" />,
});
export const S10 = scene({
  Set: SHOPS, cam: [1200, 470, 1.6], to: [1200, 460, 1.7], setT: 260,
  cast: [{ look: SHOPMAN, pose: { x: 1300, y: shopHip(1), yaw: -0.5, armL: { a: 60, b: -60 } }, faces: [[0, 'cool']], think: { th: [[c('S10', "I'd"), "I'd take twenty."], [c('S10', 'just'), "I'd take twenty. I just want it gone."]], s: 0.75, side: -0.5, wrap: 18 } }],
});
export const S11: React.FC<ShotProps> = (p) => {
  const sigh = c('S11', 'sighs'), fine = c('S11', 'Fine'), clever = c('S11', 'Clever');
  return scene({
    Set: SHOPS, cam: [1040, 440, 1.6], to: [1040, 430, 1.7], setT: 320, words, talk: { 0: [span(words, 'say', 'twenty', 1)], 1: [span(words, 'Fine', 'Fine')] },
    cast: [
      { look: YOU, pose: { x: 760, y: shopHip(1), yaw: 0.5, look: 0.7, armR: { a: 70, b: -40 } }, faces: [[0, 'smug']] },
      { look: SHOPMAN, pose: { x: 1300, y: shopHip(1), yaw: -0.5, tilt: p.t > sigh && p.t < fine ? 6 : 0 }, faces: [[0, 'cool'], [sigh, 'tired'], [clever, 'smug']], think: { th: [[clever, 'Clever kid.']], s: 0.75, side: -0.5 } },
    ],
    front: () => <GameBox x={1040} y={SHOP.counterTop - 80} s={1.1} price={p.t > fine ? '$20' : '$40'} />,
  })(p);
};

// ---------- Mo finds out ----------
const MO_X = 1180, YOU_X = 760;
export const S12 = scene({
  Set: DAY, cam: [960, 520, 1.6], to: [960, 520, 1.7], setT: 600, words, talk: { 1: [span(words, 'How', 'that')] },
  cast: [
    { look: YOU, pose: at(YOU_X, { yaw: 0.45 }), faces: [[0, 'neutral']] },
    { look: MO, pose: at(MO_X, { yaw: -0.45, armL: { a: 120, b: -40 } }), faces: [[0, 'shock']] },
  ],
});
export const S13: React.FC<ShotProps> = (p) => {
  const quiet = c('S13', 'quiet');
  return scene({
    Set: DAY, cam: [960, 470, 1.9], to: [960, 470, 2.05], setT: 660, words, talk: { 0: [span(words, 'tell', 'him', 1), span(words, 'exactly', 'now')] },
    cast: [
      { look: YOU, pose: at(YOU_X + 80, { yaw: 0.45, armR: { a: 80, b: -60 } }), faces: [[0, 'smug']] },
      { look: MO, pose: at(MO_X - 80, { yaw: -0.45 }), faces: [[0, 'smug'], [c('S13', 'exactly'), 'shock'], [quiet, 'worried']], think: { th: [[c('S13', 'exactly'), 'he is so making this up. also I need a wee.']], s: 0.5, side: -0.5, wrap: 16 } },
    ],
  })(p);
};
export const S14 = faceCU({ look: MO, Bg: DAY, faces: [[0, 'worried'], [c('S14', 'Also'), 'smug']], yaw: -0.3, zoom: [3.0, 3.2], words, talk: span(words, 'Okay', 'Priya') });

// ---------- Priya at lunch ----------
export const S15: React.FC<ShotProps> = (p) => {
  const k2 = c('S15', "He's");
  return scene({
    Set: LUNCH, cam: [1000, 420, 1.35], to: [1000, 410, 1.42], setT: 200,
    cast: [
      { look: MO, pose: { x: 640, y: pizzaHip(1), yaw: 0.4, look: 0.8 }, faces: [[0, 'neutral']] },
      { look: PRIYA, pose: { x: 1360, y: pizzaHip(1), yaw: -0.5, look: -0.8 }, faces: [[0, 'neutral'], [k2, 'happy']], think: { th: [[c('S15', 'Why'), 'Why is he always staring at me?'], [k2, "He's kind of funny, though."]], s: 0.7, side: -0.5, wrap: 18 } },
    ],
    front: () => <PizzaTable x={1000} w={1400} slices={3} />,
  })(p);
};
export const S16 = scene({
  Set: LUNCH, cam: [1100, 470, 1.6], to: [1150, 470, 1.7], setT: 260, words, talk: { 0: [span(words, 'says', 'hi', 1)] },
  cast: (t) => [
    { look: MO, pose: { x: kf(t, [[0, 700], [50, 1100]]), y: pizzaHip(1), yaw: 0.4, armR: { a: 140 + Math.sin(t / 3) * 20, b: -20 } }, faces: [[0, 'happy']] },
    { look: PRIYA, pose: { x: 1360, y: pizzaHip(1), yaw: -0.5 }, faces: [[0, 'neutral']] },
  ],
});
export const S28 = faceCU({ look: MO, Bg: LUNCH, faces: [[0, 'oops']], yaw: 0.3, zoom: [3.2, 3.4], extra: (t, pose) => <circle cx={pose.x} cy={pose.y - 176} r={64 * clamp(t / 20)} fill="#FF3A2A" opacity={0.55} /> });
export const S29 = scene({
  Set: LUNCH, cam: [1250, 420, 2.0], to: [1250, 420, 2.1], setT: 300, words, talk: { 1: [span(words, 'hi', 'back')] },
  cast: [
    { look: MO, pose: { x: 1100, y: pizzaHip(1), yaw: 0.4 }, faces: [[0, 'oops'], [40, 'happy']] },
    { look: PRIYA, pose: { x: 1360, y: pizzaHip(1), yaw: -0.5, armR: { a: 130, b: -30 } }, faces: [[0, 'happy']] },
  ],
});

// ---------- family cards ----------
const Cards: React.FC<{ x: number; y: number; s?: number; fan?: number }> = ({ x, y, s = 1, fan = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 0, 1].map((k) => (
      <g key={k} transform={`rotate(${k * 14 * fan}) translate(0 -40)`}>
        <rect x={-30} y={-44} width={60} height={88} rx={6} fill="#F8F4EA" stroke="#26232F" strokeWidth={3} />
        <text y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill={k ? '#C8302A' : '#26232F'}>K</text>
      </g>
    ))}
  </g>
);
const MU = stand(KITCHEN, 0.3, 0.42), EL = stand(KITCHEN, 0.5, 0.42), ME = stand(KITCHEN, 0.72, 0.42);
export const S17 = scene({
  Set: KITD, cam: [MU.x + 220, MU.y - 160, 1.5], to: [MU.x + 220, MU.y - 170, 1.6], setT: 100,
  cast: [
    { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.5, armR: { a: 60, b: -100 } }, faces: [[0, 'cool']], think: { th: [[c('S17', 'Two'), 'Two kings.'], [c('S17', "Don't"), "Two kings. Don't smile."]], s: 0.7, side: 0.4 } },
    { look: ELLIE, pose: { x: EL.x, y: EL.y, scale: EL.scale, yaw: -0.2, armR: { a: 60, b: -100 } }, faces: [[0, 'neutral']] },
    { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.5, armL: { a: 60, b: -100 } }, faces: [[0, 'smug']] },
  ],
  front: () => (
    <g>
      <KitchenIsland />
      <Cards x={MU.x + 70} y={MU.y - 10} s={0.6} />
    </g>
  ),
});
export const S27 = faceCU({ look: ELLIE, Bg: KITD, faces: [[0, 'neutral']], yaw: 0.2, zoom: [3.0, 3.2], pose: { headTilt: 12 }, think: { th: 'I have no idea what game this is.', pop: c('S27', 'I'), s: 0.45, side: 0.6, wrap: 16 } });
export const S18: React.FC<ShotProps> = (p) =>
  scene({
    Set: KITD, cam: [MU.x + 220, MU.y - 60, 1.5], to: [MU.x + 220, MU.y - 60, 1.6], setT: 160, words, talk: { 0: [span(words, 'Are', 'cheating')] },
    cast: [
      { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.5, armR: { a: 60, b: -100 } }, faces: [[0, 'neutral'], [c('S18', 'narrows'), 'cool']] },
      { look: ELLIE, pose: { x: EL.x, y: EL.y, scale: EL.scale, yaw: -0.2 }, faces: [[0, 'happy']] },
      { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.5, armL: { a: 150, b: -10 }, armR: { a: 150, b: -10 } }, faces: [[0, 'happy']] },
    ],
    front: (t) => (
      <g>
        <KitchenIsland />
        {Array.from({ length: Math.min(4, 1 + Math.floor(t / 12)) }).map((_, k) => (
          <text key={k} x={ME.x - 120 + k * 40} y={ME.y - 120} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#5BE08A">✓</text>
        ))}
      </g>
    ),
  })(p);
export const S19 = faceCU({ look: YOU, Bg: KITD, faces: [[0, 'smug'], [c('S19', 'technically'), 'cool']], yaw: -0.3, zoom: [3.1, 3.3], words, talk: span(words, 'No', 'No') });

// ---------- mum's birthday: the blue boots ----------
const Boot: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M -30 -120 H 30 V -20 L 90 -10 Q 110 0 100 30 H -30 Z" fill="#3A7AE0" stroke="#1A2A5A" strokeWidth={6} />
    <rect x={-30} y={22} width={130} height={14} rx={6} fill="#1A2A5A" />
  </g>
);
export const S20 = scene({
  Set: KIT, cam: [MU.x + 260, MU.y - 230, 1.9], to: [MU.x + 260, MU.y - 240, 2.0], setT: 400,
  cast: [
    { look: MUM, pose: { x: MU.x + 100, y: MU.y, scale: MU.scale, yaw: 0.2, look: 0.6, headTilt: -8, armR: { a: 30, b: -90 } }, faces: [[0, 'happy']], think: { th: [[c('S20', 'thinking'), 'those blue boots...'], [c('S20', 'week'), 'those blue boots. sigh.']], s: 0.7, side: 0.5 } },
  ],
  front: () => <KitchenIsland />,
  over: (t) => <g transform={`translate(1520 300) scale(${backOut(clamp((t - 40) / 8)) * 0.7})`}><Boot x={0} y={0} /><Boot x={70} y={10} /></g>,
});
export const S21: React.FC<ShotProps> = (p) => {
  const open = clamp((p.t - 6) / 10);
  return scene({
    Set: KIT, cam: [MU.x + 160, MU.y - 80, 1.9], to: [MU.x + 160, MU.y - 80, 2.0], setT: 460, words, talk: { 0: [span(words, 'How', 'know')] },
    cast: [{ look: MUM, pose: { x: MU.x + 100, y: MU.y, scale: MU.scale, yaw: 0.4, armL: { a: 70, b: -80 }, armR: { a: 70, b: -80 } }, faces: [[0, 'shock'], [16, 'happy']] }],
    front: (t) => (
      <g>
        <KitchenIsland />
        <g transform={`translate(${MU.x + 260} ${MU.y - 70})`}>
          <rect x={-120} y={-40} width={240} height={90} rx={6} fill="#E8D8B8" stroke="#8A6A3A" strokeWidth={5} />
          <g transform={`translate(0 ${-40 - open * 40}) rotate(${-open * 30})`}><rect x={-126} y={-16} width={252} height={24} rx={4} fill="#F2E4C4" stroke="#8A6A3A" strokeWidth={5} /></g>
          <g opacity={open}><Boot x={-40} y={-10} s={0.6} /><Boot x={30} y={-6} s={0.6} /></g>
        </g>
        {t > 20 ? <path d={`M ${MU.x + 80} ${MU.y - 160} q -4 ${20 + (t % 20)} 0 ${30 + (t % 20)}`} stroke="#9FC0FF" strokeWidth={6} fill="none" opacity={0.8} /> : null}
      </g>
    ),
  })(p);
};

// ---------- Mo's detective agency ----------
export const S22 = scene({
  Set: DUSK, cam: [960, 520, 1.6], to: [960, 520, 1.7], setT: 800, words, talk: { 1: [span(words, 'We', 'mug')] },
  cast: [
    { look: YOU, pose: at(760, { yaw: 0.45 }), faces: [[0, 'neutral'], [140, 'happy']] },
    { look: MO, pose: at(1180, { yaw: -0.45, armL: { a: 130, b: -30 } }), faces: [[0, 'happy']] },
  ],
});
export const S23 = propCU({
  Bg: DUSK,
  draw: (t) => (
    <g transform="translate(960 600) rotate(-8)">
      <path d="M -260 260 L -200 -120 Q -180 -220 -60 -230 L 160 -220 Q 260 -200 250 -100 L 230 260 Z" fill="#26232F" />
      <text x={-150} y={-120} fontFamily={FONT.hand} fontWeight={700} fontSize={58} fill="#F6EFE3" opacity={clamp(t / 10)}>MO + CO</text>
      <text x={-150} y={-30} fontFamily={FONT.hand} fontWeight={700} fontSize={50} fill="#FFD34A" opacity={clamp((t - c('S23', 'Five')) / 8)}>$5 a question</text>
      <text x={-150} y={50} fontFamily={FONT.hand} fontWeight={700} fontSize={50} fill="#FF7A6A" opacity={clamp((t - c('S23', 'Ten')) / 8)}>$10 the truth</text>
    </g>
  ),
});
export const S24 = scene({
  Set: DUSK, cam: [960, 470, 1.8], to: [960, 470, 1.85], setT: 860,
  cast: (t) => [
    { look: YOU, pose: at(840, { yaw: 0.45, headTilt: -10 + Math.sin(t) * 4 }), faces: [[0, 'happy']] },
    { look: MO, pose: at(1080, { yaw: -0.45 }), faces: [[0, 'smug']] },
  ],
});

// ---------- Saturday: the shopping centre ----------
export const S25 = scene({
  Set: MALL, cam: [960, 520, 1.0], to: [1000, 520, 1.1], setT: 100,
  cast: (t) => [
    { look: MUM, pose: { x: kf(t, [[0, 300], [126, 760]]), y: hallHip(1), yaw: 0.5, legL: { a: Math.sin(t / 4) * 16, b: 0 }, legR: { a: -Math.sin(t / 4) * 16, b: 0 } }, faces: [[0, 'happy']] },
    { look: ELLIE, pose: { x: kf(t, [[0, 160], [126, 620]]), y: hallHip(0.8), scale: 0.8, yaw: 0.5, legL: { a: Math.sin(t / 3) * 16, b: 0 }, legR: { a: -Math.sin(t / 3) * 16, b: 0 } }, faces: [[0, 'happy']] },
    { look: YOU, pose: { x: kf(t, [[0, 40], [126, 500]]), y: hallHip(1), yaw: 0.5, legL: { a: Math.sin(t / 4) * 16, b: 0 }, legR: { a: -Math.sin(t / 4) * 16, b: 0 } }, faces: [[0, 'happy']] },
    { look: N2, pose: { x: 1300, y: hallHip(1), yaw: -0.3 }, waves: 0.8 },
    { look: N5, pose: { x: 1560, y: hallHip(1), yaw: 0.3 }, waves: 0.8 },
    { look: KID, pose: { x: 1760, y: hallHip(0.8), scale: 0.8, yaw: -0.3 }, waves: 0.8 },
  ],
});
export const S26 = faceCU({ look: YOU, Bg: MALL, faces: [[0, 'happy'], [c('S26', 'stop'), 'shock']], yaw: 0.2, zoom: [3.1, 3.4], waves: 1, glint: 1, glintColor: THINK.hot });
