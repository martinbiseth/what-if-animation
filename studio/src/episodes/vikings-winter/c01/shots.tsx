import React from 'react';
import { ShotProps, Word, clamp, easeOut, backOut, kf, PhoneInHand, Glow, camT, FONT } from '../../../engine';
import { YOU, KETIL, GUDRUN, ASA, Cow, Bowl, LH, FEET, Breath, Snowfall } from '../norse';
import { scene, faceCU, insert, bigWord, inside, outside, wordF } from '../common';
import { Log, Mittens, Flames } from '../norse';
import words from './words.json';

// Chapter 1, the cold open: you wake with a numb nose in the dark longhouse, a cow breathing on you, the phone dies at
// 14 %, Ketil with the bowl, inland Norway, January, AD 900, minus thirty; no heater, no electricity, no shower, no
// idea; the family by the fire; one day to find out.

const W = words as Word[];
const at = (a: string, n = 1) => wordF(W, a, n);
const DARK = inside({ mode: 'night', fire: 0.35 });
const DAWN = inside({ mode: 'night', fire: 0.9 });
const NIGHT_OUT = outside({ tod: 'night', door: 0.8, snow: 0.7 });

/** Eyelids: two dark bars that open from the middle over `dur` frames from `from`. */
const Lids: React.FC<{ t: number; from?: number; dur?: number }> = ({ t, from = 4, dur = 16 }) => {
  const k = easeOut(clamp((t - from) / dur));
  const flick = t > from + dur + 6 && t < from + dur + 10 ? 0.5 : 0;
  const h = 560 * (1 - k) + flick * 300;
  return (
    <g>
      <rect x={0} y={0} width={1920} height={h} fill="#05040A" />
      <rect x={0} y={1080 - h} width={1920} height={h} fill="#05040A" />
    </g>
  );
};

// ---------- S1: black, then your eyes open: frost on your nose, you can't feel it ----------
export const S1 = faceCU({
  look: YOU, Bg: DARK, faces: [[0, 'tired'], [24, 'worried']], yaw: 0.1, zoom: [3.6, 3.8], dark: 0.3,
  pose: { headTilt: -8 },
  extra: (t) => (
    <g>
      {/* frost on the tip of the nose */}
      <circle cx={966} cy={510} r={7} fill="#DFF4FF" opacity={0.9} />
      <Breath x={990} y={560} t={t} d={1} s={0.5} />
    </g>
  ),
  front: (t) => <Lids t={t} />,
});

// ---------- S2: it's dark; smoke hangs under the roof ----------
export const S2 = scene({ Set: DARK, cam: [[960, 520, 1.05], [960, 500, 1.15]], setT: 40 });

// ---------- S3: something warm and huge breathing on your face ----------
export const S3 = faceCU({
  look: YOU, Bg: DARK, faces: [[0, 'worried'], [30, 'shock']], yaw: -0.2, eyes: -0.6, zoom: [3.0, 3.2], side: -60,
  extra: (t) => (
    <g>
      <g transform={`translate(${740 - easeOut(clamp(t / 20)) * 40} 640)`}>
        <Cow x={0} y={0} s={0.85} t={t} breath={1} look={1} flip />
      </g>
    </g>
  ),
});

// ---------- S4: it's a cow ----------
export const S4 = scene({
  Set: DAWN, setT: 120,
  cast: [{ look: YOU, x: 1340, feet: LH.back, s: 0.95, yaw: 0.6, faces: [[0, 'shock']], pose: { armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 }, tilt: -8 } }],
  cam: [[1560, 560, 1.45], [1560, 560, 1.55]],
  front: (t) => <Cow x={1700} y={720} s={0.9} t={t} breath={1} chew />,
});

// ---------- S5: your phone: 14 %, then black ----------
export const S5 = insert({
  Bg: DARK, dim: 0.4,
  draw: (t) => {
    const dead = t >= 66;
    return (
      <g>
        <Glow x={960} y={460} r={420} kind="cool" o={dead ? 0.1 : 0.6} />
        <PhoneInHand x={960} y={420} s={0.95} rot={-4} mode={dead ? 'off' : 'battery'} battery={14} t={t} from="right" />
      </g>
    );
  },
});

// ---------- S6: in cold this deep, a phone battery just quits ----------
export const S6 = faceCU({
  look: YOU, Bg: DARK, faces: [[0, 'oops']], yaw: 0.25, zoom: [3.0, 3.1], dark: 0.2,
  pose: { armR: { a: 150, b: -60 } },
  extra: () => (
    <g transform="translate(1110 470) rotate(-10)">
      <rect x={-34} y={-62} width={68} height={124} rx={12} fill="#07060B" stroke="#3A3A44" strokeWidth={5} />
      <text x={0} y={8} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#FF5A4A">0%</text>
    </g>
  ),
});

// ---------- S7: a man with a red beard the size of a cat leans over you ----------
export const S7 = faceCU({
  look: KETIL, Bg: DAWN, faces: [[0, 'happy']], yaw: -0.25, zoom: [2.6, 3.0], side: 20, light: { x: 900, y: 600, o: 0.7 },
  pose: { tilt: -10, headTilt: -10 },
});

// ---------- S8: he hands you a wooden bowl ----------
export const S8 = insert({
  Bg: DAWN, dim: 0.3,
  draw: (t) => {
    const k = easeOut(clamp(t / 18));
    const x = 1500 - k * 540;
    return (
      <g>
        <path d={`M ${x + 120} 760 Q ${x + 400} 820 2100 900 L 2100 1200 Q ${x + 380} 1000 ${x + 110} 900 Z`} fill="#5E6E3A" stroke="#100E16" strokeWidth={8} />
        <Bowl x={x} y={720} s={2.2} t={t} />
        <ellipse cx={x + 150} cy={780} rx={60} ry={80} fill="#26232F" stroke="#100E16" strokeWidth={8} />
        <ellipse cx={x - 150} cy={780} rx={60} ry={80} fill="#26232F" stroke="#100E16" strokeWidth={8} />
      </g>
    );
  },
});

// ---------- S9: he says something; it sounds friendly ----------
export const S9 = scene({
  Set: DAWN, setT: 200,
  cast: [
    { look: KETIL, x: 860, feet: LH.back, s: 1, yaw: 0.5, faces: [[0, 'happy']], talk: [[20.9, 22.6]], pose: { armL: { a: 60, b: -60 } } },
    { look: YOU, x: 1110, feet: LH.back, s: 0.95, yaw: -0.5, faces: [[0, 'worried']], pose: { armL: { a: 40, b: -110 }, armR: { a: 40, b: -110 } } },
  ],
  words: W,
  cam: [[980, 560, 1.7], [990, 560, 1.8]],
  front: (t) => <Bowl x={1050} y={688} s={0.55} t={t} />,
});

// ---------- S10: probably ----------
export const S10 = faceCU({ look: YOU, Bg: DAWN, faces: [[0, 'neutral'], [8, 'oops']], yaw: -0.3, eyes: 0.6, zoom: [3.2, 3.4] });

// ---------- S11: inland Norway: the farm under the night sky, the northern lights ----------
export const S11 = scene({
  Set: NIGHT_OUT, setT: 300, cam: [[960, 480, 1.0], [900, 500, 1.08]],
  front: (t) => (
    <g opacity={clamp((t - 6) / 8)}>
      <rect x={560} y={70} width={800} height={110} rx={55} fill="#0B0816" opacity={0.75} />
      <text x={960} y={146} textAnchor="middle" fontFamily={FONT.ui} fontSize={56} letterSpacing={8} fill="#F6EFE3">INLAND NORWAY</text>
    </g>
  ),
});

// ---------- S12: January ----------
export const S12 = bigWord({ word: 'JANUARY', Bg: NIGHT_OUT, size: 200 });
// ---------- S13: the year 900 ----------
export const S13 = bigWord({ kicker: 'THE YEAR', word: 'AD 900', Bg: NIGHT_OUT, size: 230, color: '#FFD23A' });

// ---------- S14: outside that door: minus thirty ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp((t - 28) / 9));
  return (
    <g>
      <g transform={camT(kf(t, [[0, 820], [len, 815]]), kf(t, [[0, 600], [len, 620]]), kf(t, [[0, 1.4], [len, 2.1]]))}>
        <NIGHT_OUT t={t + 340} id="s14" />
      </g>
      <g transform={`translate(960 560) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={260} fill="#BFE6FF" stroke="#0B0816" strokeWidth={18} paintOrder="stroke">-30°C</text>
      </g>
    </g>
  );
};

// ---------- S15–S17: no heater, no electricity, no hot shower ----------
const noCard = (icon: (t: number) => React.ReactNode, label: string) =>
  insert({
    Bg: DARK, dim: 0.55,
    draw: (t) => {
      const x = clamp((t - 8) / 5);
      return (
        <g>
          <g transform={`translate(960 470) scale(${backOut(clamp(t / 7))})`}>{icon(t)}</g>
          {x > 0 ? <path d="M 760 270 L 1160 670 M 1160 270 L 760 670" stroke="#FF5A4A" strokeWidth={34} strokeLinecap="round" strokeDasharray={570} strokeDashoffset={570 * (1 - x)} /> : null}
          <text x={960} y={820} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">{label}</text>
        </g>
      );
    },
  });
export const S15 = noCard(() => (
  <g>
    {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-150 + i * 52} y={-130} width={40} height={250} rx={18} fill="#E8E2D6" stroke="#100E16" strokeWidth={8} />)}
    <rect x={-170} y={100} width={340} height={30} rx={10} fill="#C8C2B6" stroke="#100E16" strokeWidth={8} />
  </g>
), 'NO HEATER');
export const S16 = noCard(() => (
  <g>
    <rect x={-90} y={-120} width={180} height={190} rx={40} fill="#F2EAD8" stroke="#100E16" strokeWidth={10} />
    <rect x={-60} y={-200} width={30} height={90} rx={8} fill="#B8B8C0" stroke="#100E16" strokeWidth={8} />
    <rect x={30} y={-200} width={30} height={90} rx={8} fill="#B8B8C0" stroke="#100E16" strokeWidth={8} />
    <path d="M 0 70 Q 0 160 80 200" stroke="#3A3A44" strokeWidth={26} fill="none" strokeLinecap="round" />
  </g>
), 'NO ELECTRICITY');
export const S17 = noCard((t) => (
  <g>
    <path d="M -40 -200 L -40 -120 Q -40 -80 0 -80 L 60 -80" stroke="#B8B8C0" strokeWidth={22} fill="none" strokeLinecap="round" />
    <path d="M 20 -110 L 140 -110 L 120 -50 L 40 -50 Z" fill="#C8C8D0" stroke="#100E16" strokeWidth={8} />
    {Array.from({ length: 8 }).map((_, i) => {
      const q = ((t * 2 + i * 9) % 40) / 40;
      return <path key={i} d={`M ${50 + (i % 4) * 22} ${-40 + q * 220} l 0 22`} stroke="#7FD4FF" strokeWidth={8} strokeLinecap="round" />;
    })}
  </g>
), 'NO HOT SHOWER');

// ---------- S18: no idea what you're doing ----------
export const S18 = faceCU({ look: YOU, Bg: DAWN, faces: [[0, 'oops']], yaw: 0, zoom: [2.6, 2.7], pose: { armL: { a: 70, b: -70 }, armR: { a: 70, b: -70 }, headTilt: 10 } });

// ---------- S19: how did the Vikings survive? the family round the fire, morning ----------
export const S19 = scene({
  Set: DAWN, setT: 400,
  cast: [
    { look: KETIL, x: 700, feet: LH.back, s: 1, yaw: 0.3, faces: [[0, 'happy']], pose: { armR: { a: 50, b: -70 } } },
    { look: GUDRUN, x: 900, feet: LH.back, s: 0.95, yaw: 0.1, faces: [[0, 'neutral']] },
    { look: ASA, x: 1060, feet: LH.back, s: 0.72, yaw: -0.2, faces: [[0, 'happy']] },
    { look: YOU, x: 1270, feet: LH.back, s: 0.95, yaw: -0.5, faces: [[0, 'worried']], shiver: 1, pose: { armL: { a: 30, b: -120 }, armR: { a: 30, b: -120 } } },
  ],
  cam: [[960, 560, 1.1], [980, 600, 1.3]],
});

// ---------- S20: one day to find out ----------
export const S20 = faceCU({ look: YOU, Bg: DAWN, faces: [[0, 'worried'], [20, 'neutral']], yaw: 0.2, zoom: [2.8, 3.3], light: { x: 980, y: 600, o: 0.6 } });

// ---------- S21: get it wrong, and the cold won't wait: you at the door, a snowstorm ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 820], [len, 820]]), 620, kf(t, [[0, 1.6], [len, 1.3]]))}>
      <NIGHT_OUT t={t + 500} id="s21" />
    </g>
    <Snowfall t={t * 2} n={160} wind={3} />
    <rect x={0} y={0} width={1920} height={1080} fill="#BFE6FF" opacity={0.12} />
  </g>
);


// ---------- S22: nothing but wood, wool and fire ----------
export const S22 = insert({
  Bg: DAWN, dim: 0.5,
  draw: (t) => {
    const p = (d: number) => backOut(clamp((t - d) / 8));
    return (
      <g>
        <g transform={`translate(520 520) scale(${p(12) * 1.6})`}><Log x={0} y={0} /><Log x={0} y={-50} rot={4} /></g>
        <g transform={`translate(960 540) scale(${p(28) * 1.4})`}><Mittens x={0} y={0} c="#8A6440" /></g>
        <g transform={`translate(1400 600) scale(${p(46) * 1.3})`}><Flames x0={-140} x1={140} y={0} t={t} k={1.2} /></g>
        {['WOOD', 'WOOL', 'FIRE'].map((w, i) => (
          <text key={w} x={520 + i * 440} y={800} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - [14, 30, 48][i]) / 4)}>{w}</text>
        ))}
      </g>
    );
  },
});
