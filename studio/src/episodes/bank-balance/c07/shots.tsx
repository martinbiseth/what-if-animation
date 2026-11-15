import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, faceAt, FONT, Glow, stand, KITCHEN, KitchenIsland, islandTop, BEDROOM, Bedroom, WINDOW,
  MONEY, BalanceOver, BalanceTag, Smartphone,
} from '../../../engine';
import words from './words.json';
import {
  YOU, MUM, ELLIE, KitchenSet, BedroomSet, faceCU, bigWord, balCU, listCard, people, span, handAt, Soft, moneyCard, MoneyField,
} from '../common';

// Chapter 7, the cliffhanger: Mum at the kitchen table crying at her phone, her number green; you say nothing; Ellie
// runs laps; that night at the window Ellie points, not at the street but at you: "Why is yours red?" The rule from
// chapter 2 breaks twice: Ellie can see them, and she reads out yours: minus one million dollars. Part 2; what's real.

const KIT = KitchenSet(0.15);
const NIGHT = BedroomSet({ veil: 0.5, clock: '22:47' });
const MU = stand(KITCHEN, 0.36, 0.4), ME = stand(KITCHEN, 0.7, 0.4);
const GREEN = 993760;
const BIG = -1000000;

export const S1 = moneyCard({ kicker: 'CHAPTER 7', title: 'THE WINDOW', seed: 23 });

// ---------- S2: home: Mum at the kitchen table, staring at her phone, crying ----------
const MumPhone: React.FC<{ t: number; s?: number }> = ({ t, s = 1 }) => {
  const p: Pose = { ...basePose, x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.2, armR: { a: 120, b: -110 }, armL: { a: 110, b: -110 } };
  const h = handAt(p, 'R');
  return <Smartphone x={h.x - 10} y={h.y - 20} s={0.12 * MU.scale * s} mode="bank" t={t} battery={60} glow={1.4} status={false} text="$993,760.00|Current account" />;
};
const tear = (t: number, x: number, y: number) => <ellipse cx={x} cy={y + ((t * 3) % 60)} rx={6} ry={10} fill="#8AD0F0" opacity={1 - ((t * 3) % 60) / 60} />;
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 500, kf(t, [[0, 1.25], [len, 1.35]]))}>
    <KIT t={t + 900} id="s2" />
    {people(t, [
      { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.2, armR: { a: 120, b: -110 }, armL: { a: 110, b: -110 }, headTilt: 10 }, faces: [[0, 'shock']] },
      { look: YOU, pose: { x: kf(t, [[0, 1700], [60, ME.x]]), y: ME.y, scale: ME.scale, yaw: -0.5 }, faces: [[0, 'neutral']] },
    ])}
    <MumPhone t={t} />
    <KitchenIsland />
  </g>
);

// ---------- S3: above her head, the red is gone: $993,760. Green ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(MU.x + 40, 440, kf(t, [[0, 1.7], [len, 1.85]]))}>
    <KIT t={t + 1000} id="s3" />
    {people(t, [{ look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.2, armR: { a: 120, b: -110 }, armL: { a: 110, b: -110 }, headTilt: 10 }, faces: [[0, 'happy']], bal: [[0, -6240], [56, -6240], [100, GREEN]], balS: 0.8 }])}
    <MumPhone t={t} />
    {tear(t, MU.x - 28, MU.y - 170)}
    <KitchenIsland />
    {t > 100 ? <Glow x={MU.x} y={MU.y - 320} r={300} kind="cool" o={0.4} /> : null}
  </g>
);

// ---------- S4: "There must be some mistake." ----------
export const S4 = faceCU({ look: MUM, Bg: KIT, faces: [[0, 'happy']], yaw: 0.2, zoom: [2.7, 2.85], words, talk: span(words, 'There', 'mistake'), bal: GREEN, balS: 0.5, extra: (t) => tear(t, 932, 520) });

// ---------- S5: you don't say anything; you promised ----------
export const S5 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'neutral'], [36, 'worried']], yaw: -0.3, zoom: [3.1, 3.3] });

// ---------- S6: Ellie runs laps around the kitchen; Mum's plans ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const ex = 960 + Math.sin(t / 16) * 520;
  const dir = Math.cos(t / 16) > 0 ? 1 : -1;
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.2], [len, 1.28]]))}>
      <KIT t={t + 1100} id="s6" />
      {people(t, [
        { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.4, armL: { a: 120, b: -20 } }, faces: [[0, 'happy']], bal: GREEN, balS: 0.55 },
        { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.4 }, faces: [[0, 'neutral']] },
      ])}
      <KitchenIsland />
      {people(t, [{ look: ELLIE, pose: { x: ex, y: 820, scale: 0.9, yaw: dir, legL: { a: Math.sin(t / 2.5) * 34, b: -20 }, legR: { a: -Math.sin(t / 2.5) * 34, b: -20 }, armL: { a: 120, b: 0 }, armR: { a: 120, b: 0 } }, faces: [[0, 'happy']] }])}
    </g>
  );
};

// ---------- S7: that night Ellie can't sleep; you take her to the window ----------
const WIN = { x: (WINDOW.x0 + WINDOW.x1) / 2, y: (WINDOW.y0 + WINDOW.y1) / 2 };
const PY = stand(BEDROOM, 0.74, 0.28), PE = stand(BEDROOM, 0.86, 0.3);
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1150, 500, kf(t, [[0, 1.4], [len, 1.55]]))}>
    <NIGHT t={t} id="s7" />
    {people(t, [
      { look: YOU, pose: { x: kf(t, [[0, PY.x - 260], [70, PY.x]]), y: PY.y, scale: PY.scale, yaw: 0.6 }, faces: [[0, 'tired']] },
      { look: ELLIE, pose: { x: kf(t, [[0, PE.x - 260], [70, PE.x]]), y: PE.y + 20 * PE.scale, scale: PE.scale * 0.8, yaw: 0.6 }, faces: [[0, 'tired']] },
    ])}
    <Glow x={WIN.x} y={WIN.y} r={260} kind="cool" o={0.4} />
  </g>
);

// ---------- S8: she goes very quiet; then she points. Not at the street. At you ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const turn = clamp((t - 120) / 10);
  const raise = clamp((t - 56) / 10);
  return (
    <g transform={camT(1140, 470, kf(t, [[0, 1.75], [len, 1.95]]))}>
      <NIGHT t={t + 100} id="s8" />
      {people(t, [
        { look: YOU, pose: { x: PY.x, y: PY.y, scale: PY.scale, yaw: 0.6 - turn * 0.5, look: 0.6 }, faces: [[0, 'neutral'], [130, 'worried']] },
        {
          look: ELLIE, pose: { x: PE.x, y: PE.y + 20 * PE.scale, scale: PE.scale * 0.8, yaw: 0.6 - turn * 1.2, armR: { a: 20 + raise * 130, b: -10 * raise }, handR: raise > 0.5 ? 'point' : 'open', headTilt: -turn * 14 },
          faces: [[0, 'neutral'], [30, 'worried'], [124, 'shock']],
        },
      ])}
      <Glow x={WIN.x} y={WIN.y} r={260} kind="cool" o={0.4} />
    </g>
  );
};

// ---------- S9: "Why is yours red?" ----------
export const S9 = faceCU({ look: ELLIE, Bg: NIGHT, faces: [[0, 'worried']], yaw: -0.3, zoom: [2.6, 2.75], words, talk: span(words, 'Why', 'red'), look_: 0.6, pose: { headTilt: -14 }, glint: 1, glintColor: MONEY.red });

// ---------- S10: you have never seen your own number. You never could ----------
export const S10 = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'shock']], yaw: 0.3, zoom: [3.1, 3.35] });

// ---------- S11: Ellie, staring right at it, reads it out slowly ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(PE.x - 110, PE.y - 230 * PE.scale, kf(t, [[0, 2.2], [len, 2.45]]))}>
    <NIGHT t={t + 200} id="s11" />
    {people(t, [{ look: ELLIE, pose: { x: PE.x, y: PE.y + 20 * PE.scale, scale: PE.scale * 0.8, yaw: -0.5, headTilt: -16, look: -0.6 }, faces: [[0, 'shock']] }])}
    <Glow x={PE.x - 200} y={PE.y - 300} r={300} kind="red" o={0.5} />
  </g>
);

// ---------- S12: "Minus one million dollars." Over your head, for the first time, a number ----------
export const S12: React.FC<ShotProps> = ({ t, len, f }) => (
  <g transform={camT(PY.x + 40, 400, kf(t, [[0, 1.75], [len, 1.95]]))}>
    <NIGHT t={t + 260} id="s12" />
    <Glow x={PY.x} y={PY.y - 330 * PY.scale} r={380} kind="red" o={clamp((t - 4) / 10) * 0.8} />
    {people(t, [
      { look: YOU, pose: { x: PY.x, y: PY.y, scale: PY.scale, yaw: 0.1, look: -0.2 }, faces: [[0, 'shock']], bal: [[0, 0], [8, 0], [44, BIG]], balPop: 2, balS: 0.8 },
      { look: ELLIE, pose: { x: PE.x, y: PE.y + 20 * PE.scale, scale: PE.scale * 0.8, yaw: -0.6, headTilt: -14, look: -0.6 }, faces: [[0, 'shock']] },
    ], f, words, { 1: [span(words, 'Minus', 'dollars')] })}
  </g>
);

// ---------- S13: so what did you really sign? And how can Ellie see it? ----------
export const S13 = balCU({ bal: BIG, Bg: NIGHT, label: 'WHAT DID YOU SIGN?', sub: 'AND HOW CAN ELLIE SEE IT?', s: 2.6 });

// ---------- S14: that's for part two ----------
export const S14 = bigWord({ word: 'PART 2', size: 260, color: MONEY.red, Bg: ({ t }) => <MoneyField t={t} seed={29} /> });

// ---------- S15: is any of this real? ----------
export const S15 = bigWord({ kicker: 'THE NUMBERS? NO.', word: 'IS ANY OF THIS REAL?', size: 120, color: '#F6EFE3', Bg: ({ t }) => <MoneyField t={t} seed={31} /> });

// ---------- S16: the real parts ----------
export const S16 = listCard({
  title: "THAT'S REAL",
  items: [
    { at: 6, text: "4 IN 10 CAN'T COVER $400", ok: true },
    { at: 120, text: '$10 BILLION LOST TO FRAUD', ok: true },
  ],
});

// ---------- S17: would you have signed the paper? Tell me in the comments ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(PY.x + 40, 420, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <NIGHT t={t + 400} id="s17" />
      <Glow x={PY.x} y={PY.y - 330 * PY.scale} r={380} kind="red" o={0.6} />
      {people(t, [{ look: YOU, pose: { x: PY.x, y: PY.y, scale: PY.scale, yaw: 0, look: 0 }, faces: [[0, 'worried']], bal: BIG, balS: 0.7 }])}
    </g>
    <g transform={`translate(960 940) scale(${backOut(clamp((t - 30) / 10))})`}>
      <rect x={-470} y={-70} width={940} height={110} rx={55} fill="#0B0816" opacity={0.75} />
      <text x={0} y={8} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#F6EFE3">WOULD YOU SIGN? 👇</text>
    </g>
  </g>
);
