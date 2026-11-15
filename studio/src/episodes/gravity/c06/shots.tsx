import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, easeIn, backOut, ShotProps, FONT, rnd, Smartphone, talkAt, idleBlink,
  Schematic, SCH, SchLabel, Arrow,
} from '../../../engine';
import { YOU, MOM, ELLIE, PATEL, Soft, wordF, faceCU, Body, lie, slide, Dog, PoolYard, PoolFront, YARD, bigWord, shk } from '../common';
import words from './words.json';

// Chapter 6, the crawl: you can't stand or crawl, you slide on your stomach. Mom first, dragging Biscuit; you next;
// Ellie behind you, then she isn't. She's stopped mid-yard, crying. 8:52. Mo on the phone; you can't answer. Mom is at
// the pool fence. The choice: keep sliding or go back. You go back. Every inch costs you; the pool filter sounds a mile
// away. You grab her backpack strap: "Hold on to me." Mr. Patel reaches out a hand. 8:58: you roll into the water and,
// for the first time in two hours, feel light.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const sec = (a: string, n = 1) => at(a, n) / 30;
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const Y: React.FC<{ t: number; id?: string }> = ({ t, id }) => <PoolYard t={t} id={id} broken={0.8} dusk={0.1} />;
const G = 905; // the lawn line the sliders lie on, in front of the fence, left of the pool
const S = 0.62;

// ---------- S1: wide: the back door, the family sliding out on their stomachs across the lawn ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const ph = t * 0.12;
  return (
    <g transform={camT(kf(t, [[0, 520], [len, 600]]), 640, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Y t={t + 100} />
      <Dog x={360 + t * 0.5} y={G - 10} s={0.35} t={t} flat={1} />
      <Body look={MOM} pose={slide(260 + t * 0.5, G, S, 1, ph)} t={t} faces={[[0, 'tired']]} seed={3} />
      <Body look={YOU} pose={slide(60 + t * 0.4, G + 60, S, 1, ph + 1)} t={t} faces={[[0, 'tired']]} />
      <Body look={ELLIE} pose={slide(-120 + t * 0.35, G + 110, S * 0.7, 1, ph + 2)} t={t} faces={[[0, 'worried']]} seed={5} />
    </g>
  );
};

// ---------- S2: close: you on your stomach, pulling yourself forward with your arms, like a soldier ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 300], [len, 330]]), G - 60, kf(t, [[0, 2.6], [len, 2.8]]))}>
    <Y t={t + 140} />
    <Body look={YOU} pose={slide(240 + t * 0.3, G, S, 1, t * 0.15, { squash: 0.04 })} t={t} faces={[[0, 'tired']]} />
  </g>
);

// ---------- S3: Mom goes first, dragging Biscuit by his collar ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const x = 340 + t * 0.4;
  return (
    <g transform={camT(x - 40, G - 60, kf(t, [[0, 2.2], [len, 2.3]]))}>
      <Y t={t + 180} />
      <Dog x={x + 150} y={G - 6} s={0.36} t={t} flat={1} look={-0.6} />
      <Body look={MOM} pose={slide(x, G, S, 1, t * 0.15, { armR: { a: 170, b: -10 } })} t={t} faces={[[0, 'tired']]} seed={3} />
    </g>
  );
};

// ---------- S4: you next, and Ellie right behind you ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 140], [len, 180]]), G - 40, kf(t, [[0, 2.0], [len, 2.1]]))}>
    <Y t={t + 220} />
    <Body look={YOU} pose={slide(260 + t * 0.4, G, S, 1, t * 0.15)} t={t} faces={[[0, 'tired']]} />
    <Body look={ELLIE} pose={slide(20 + t * 0.4, G + 30, S * 0.7, 1, t * 0.15 + 2)} t={t} faces={[[0, 'worried']]} seed={5} />
  </g>
);

// ---------- S5: you turn your head, and it takes everything: the space behind you is empty ----------
export const S5 = faceCU({ look: YOU, Bg: Y, faces: [[0, 'tired'], [30, 'shock']], yaw: -0.6, eyes: -1, zoom: [3.0, 3.3], pose: { spin: -60, squash: 0.06 } });

// ---------- S6: Ellie stopped in the middle of the yard, crying: "I can't. It's too heavy." ----------
export const S6: React.FC<ShotProps> = ({ t, len, f }) => {
  const x = 180;
  const open = talkAt(W, f, 30, [[sec('I'), sec('can\'t', 3) + 0.4]]);
  const p = slide(x, G, S * 0.7, 1, 0, { headTilt: 40, armL: { a: 150, b: -60 }, armR: { a: 140, b: -50 } });
  return (
    <g transform={camT(x + 20, G - 50, kf(t, [[0, 2.9], [len, 3.1]]))}>
      <Y t={t + 260} />
      <Hero look={ELLIE} pose={{ ...p, expr: 'worried', talk: open, blink: idleBlink(t, 5) }} shadow={0} />
      {[0, 1].map((i) => {
        const k = ((t + i * 14) % 28) / 28;
        return <path key={i} d={`M ${x + 55 + i * 10} ${G - 70 + k * 40} q 4 8 0 14 q -4 -6 0 -14 Z`} fill="#8FD3FF" opacity={1 - k} />;
      })}
    </g>
  );
};

// ---------- S7: 8:52 ----------
export const S7 = bigWord({ kicker: 'EIGHT MINUTES', word: '8:52', color: '#FF4A3A', Bg: Y, size: 260 });

// ---------- S8: the phone in your back pocket, lit, buzzing: Mo ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.4}>
      <g transform={camT(300, G - 100, 2)}>
        <Y t={t + 300} />
      </g>
    </Soft>
    <path d="M -100 1100 Q 700 820 2100 940 L 2100 1200 L -100 1200 Z" fill="#3B3646" />
    <g transform={`translate(960 640) rotate(-12) scale(${kf(t, [[0, 1.2], [len, 1.3]])})`}>
      <rect x={-260} y={-120} width={520} height={420} rx={30} fill="#4A4458" stroke="#100E16" strokeWidth={8} />
      <Smartphone x={0} y={-60} s={0.7} mode="home" t={t} buzz={1} />
      <rect x={-260} y={60} width={520} height={240} rx={20} fill="#3B3646" stroke="#100E16" strokeWidth={8} />
    </g>
    <g transform={`translate(1380 260) scale(${backOut(clamp((t - 6) / 8))})`}>
      <rect x={-380} y={-60} width={760} height={110} rx={55} fill="#F6EFE3" stroke="#0B0816" strokeWidth={6} />
      <text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#0B0816">MO: "ARE YOU IN THE WATER?"</text>
    </g>
  </g>
);

// ---------- S9: your face in the grass: you can't answer, you don't have the breath ----------
export const S9 = faceCU({ look: YOU, Bg: Y, faces: [[0, 'tired']], yaw: 0.3, zoom: [3.4, 3.6], pose: { spin: -70, squash: 0.08 }, dark: 0.1 });

// ---------- S10: wide: Mom already at the pool fence, you halfway, Ellie stuck behind ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 420], [len, 460]]), 680, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <Y t={t + 340} />
    <Dog x={560} y={YARD.poolY0 - 40} s={0.32} t={t} flat={1} />
    <Body look={MOM} pose={slide(420, G - 20, S, 1, 0, { headTilt: 80 })} t={t} faces={[[0, 'worried']]} seed={3} />
    <Body look={YOU} pose={slide(160, G + 50, S, 1, t * 0.05)} t={t} faces={[[0, 'tired']]} />
    <Body look={ELLIE} pose={slide(-160, G + 100, S * 0.7, 1, 0, { headTilt: 40 })} t={t} faces={[[0, 'worried']]} seed={5} />
  </g>
);

// ---------- S11: the choice: two arrows, KEEP SLIDING to the pool, GO BACK to Ellie ----------
export const S11: React.FC<ShotProps> = ({ t, len, f }) => {
  const back = rel(f, t, 'Or');
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}>
        <Schematic t={t} id="c6s11" />
      </g>
      <circle cx={960} cy={560} r={34} fill={SCH.line} />
      <Arrow x0={1010} y0={560} x1={1600} y1={560} t={t - 6} dur={10} color="#7FD4FF" bend={0} />
      <SchLabel x={1320} y={500} t={t - 10} text="KEEP SLIDING" size={50} color="#7FD4FF" />
      <SchLabel x={1320} y={640} t={t - 14} text="THE POOL" size={36} color={SCH.dim} />
      <Arrow x0={910} y0={560} x1={320} y1={560} t={t - back} dur={10} color={SCH.live} bend={0} />
      <SchLabel x={600} y={500} t={t - back - 4} text="GO BACK" size={50} color={SCH.live} />
      <SchLabel x={600} y={640} t={t - back - 8} text="ELLIE" size={36} color={SCH.dim} />
      <SchLabel x={960} y={180} t={t - 2} text="8:53 · SEVEN MINUTES" size={44} />
    </g>
  );
};

// ---------- S12: you go back: your face sets ----------
export const S12 = faceCU({ look: YOU, Bg: Y, faces: [[0, 'worried'], [14, 'cool']], yaw: -0.4, eyes: -1, zoom: [3.2, 3.6], pose: { spin: -60, squash: 0.06 } });

// ---------- S13: every inch: you sliding back toward Ellie, arms shaking, a car on your chest ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`${shk(t, 0, 999, 2)} ${camT(kf(t, [[0, 280], [len, 230]]), G - 60, kf(t, [[0, 2.4], [len, 2.6]]))}`}>
    <Y t={t + 380} />
    <Body look={YOU} pose={slide(300 - t * 0.25, G, S, -1, t * 0.08, { squash: 0.08 })} t={t} faces={[[0, 'tired']]} />
    <g transform={`translate(${300 - t * 0.25} ${G - 110})`} opacity={0.35}>
      <path d="M -120 0 L -100 -40 L 60 -40 L 110 0 Z" fill="#3E6E9A" />
      <text y={-60} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#F6EFE3">LIKE A CAR ON YOUR CHEST</text>
    </g>
  </g>
);

// ---------- S14: the pool filter humming on the other side of the fence, soft and far ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(YARD.poolX1 + 115, YARD.poolY0 - 70, kf(t, [[0, 3.2], [len, 3.0]]))} style={{ filter: 'blur(1.5px)' }}>
      <Y t={t + 420} />
    </g>
    {[0, 1, 2].map((i) => {
      const k = ((t + i * 16) % 48) / 48;
      return <circle key={i} cx={960} cy={540} r={80 + k * 400} fill="none" stroke="#F6EFE3" strokeWidth={4} opacity={0.4 * (1 - k)} />;
    })}
    <text x={960} y={940} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} letterSpacing={8} fill="#F6EFE3" opacity={0.7}>hmmmmmmm</text>
  </g>
);

// ---------- S15: you reach Ellie and grab her backpack strap: "Hold on to me. Don't let go." ----------
export const S15: React.FC<ShotProps> = ({ t, len, f }) => {
  const open = talkAt(W, f, 30, [[sec('Hold'), sec('go', 2) + 0.4]]);
  const x = 180;
  return (
    <g transform={camT(x + 100, G - 40, kf(t, [[0, 2.5], [len, 2.7]]))}>
      <Y t={t + 460} />
      <Body look={ELLIE} pose={slide(x, G + 10, S * 0.7, 1, 0, { headTilt: 60, armR: { a: 170, b: -20 } })} t={t} faces={[[0, 'worried'], [30, 'neutral']]} seed={5} />
      <Hero look={YOU} pose={{ ...slide(x + 160, G - 6, S, -1, 0.4, { armL: { a: 170, b: -40 } }), expr: 'tired', talk: open, blink: idleBlink(t, 2) }} shadow={0} />
    </g>
  );
};

// ---------- S16: Mr. Patel, lying at the edge of his pool, reaches out a hand ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 18));
  return (
    <g transform={camT(kf(t, [[0, 640], [len, 600]]), YARD.poolY0 - 40, kf(t, [[0, 2.2], [len, 2.35]]))}>
      <Y t={t + 500} />
      <Body look={PATEL} pose={lie(720, YARD.poolY0 - 26, S, -1, { armL: { a: 20 + 140 * k, b: -10 }, look: -1, yaw: -0.3 })} t={t} faces={[[0, 'worried']]} seed={7} />
      <Body look={MOM} pose={lie(1000, YARD.poolY0 - 26, S, 1)} t={t} faces={[[0, 'worried']]} seed={3} />
    </g>
  );
};

// ---------- S17: 8:58 ----------
export const S17 = bigWord({ kicker: 'TWO MINUTES', word: '8:58', color: '#FF4A3A', Bg: Y, size: 260 });

// ---------- S18: you roll over the edge and into the water, Ellie with you: SPLASH ----------
export const S18: React.FC<ShotProps> = ({ t, len, f }) => {
  const sp = rel(f, t, 'water');
  const k = easeIn(clamp((t - (sp - 12)) / 12));
  const x0 = 470;
  const roll = k * 180;
  return (
    <g transform={`${shk(t, sp, 6, 8)} ${camT(kf(t, [[0, 600], [len, 640]]), YARD.poolY0 + 10, kf(t, [[0, 2.0], [len, 2.1]]))}`}>
      <Y t={t + 540} />
      {t < sp ? (
        <g>
          <Body look={YOU} pose={{ ...lie(x0 + 120 * k, YARD.poolY0 - 26 + 60 * k, S, 1), spin: 90 + roll }} t={t} faces={[[0, 'tired']]} />
          <Body look={ELLIE} pose={{ ...lie(x0 - 60 + 120 * k, YARD.poolY0 - 20 + 60 * k, S * 0.7, 1), spin: 90 + roll }} t={t} faces={[[0, 'worried']]} seed={5} />
        </g>
      ) : null}
      <PoolFront t={t} />
      {t >= sp ? (
        <g>
          {Array.from({ length: 14 }).map((_, i) => {
            const a = -Math.PI / 2 + (rnd(2, i) - 0.5) * 1.6;
            const d = (t - sp) * (14 + rnd(3, i) * 10);
            const g = Math.pow(t - sp, 2) * 1.2;
            return <circle key={i} cx={620 + Math.cos(a) * d} cy={YARD.poolY0 + 30 + Math.sin(a) * d + g} r={10 + rnd(4, i) * 10} fill="#BFEFFF" opacity={clamp(1 - (t - sp) / 24)} />;
          })}
        </g>
      ) : null}
    </g>
  );
};

// ---------- S19: in the water: you float, and for the first time in two hours you feel light ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const lv = YARD.poolY0 + 30;
  const bob = Math.sin(t / 10) * 6;
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 720]]), lv - 20, kf(t, [[0, 2.4], [len, 2.6]]))}>
      <Y t={t + 580} />
      <Body look={YOU} pose={{ ...basePose, x: 700, y: lv + 120 + bob, scale: S, yaw: 0.2, armL: { a: 70, b: -20 }, armR: { a: 70, b: -20 }, sway: 0 }} t={t} faces={[[0, 'tired'], [30, 'happy']]} />
      <Body look={ELLIE} pose={{ ...basePose, x: 820, y: lv + 110 - bob, scale: S * 0.7, yaw: -0.2, armL: { a: 80, b: -20 }, armR: { a: 70, b: -20 } }} t={t} faces={[[0, 'worried'], [40, 'happy']]} seed={5} />
      <Body look={MOM} pose={{ ...basePose, x: 560, y: lv + 126 + bob, scale: S, yaw: 0.4, armL: { a: 70, b: -20 }, armR: { a: 70, b: -20 } }} t={t} faces={[[0, 'happy']]} seed={3} />
      <PoolFront t={t} />
    </g>
  );
};

