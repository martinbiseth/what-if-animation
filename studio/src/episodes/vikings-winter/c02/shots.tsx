import React from 'react';
import { ShotProps, Word, clamp, easeOut, backOut, kf, camT } from '../../../engine';
import { YOU, KETIL, KETIL_OUT, GUDRUN, ASA, LH, FEET, Flames, Sneakers, Farmyard } from '../norse';
import { scene, faceCU, insert, bigWord, inside, outside, NameTag, span } from '../common';
import words from './words.json';

// Chapter 2, the rules: one day, sunrise to sunrise; the body meter (37, hypothermia below 35); Ketil and his farm,
// Gudrun and her keys, Asa staring at your sneakers; the one rule: the fire never goes out. Tonight it's your job.

const W = words as Word[];
const DAY = inside({ mode: 'day', fire: 1 });
const NIGHTLOW = inside({ mode: 'night', fire: 0.3 });
const DAWN_OUT = outside({ tod: 'dawn', door: 0.5, snow: 0.2 });
const DAY_OUT = outside({ tod: 'day', door: 0.4, snow: 0.3 });

export const S1 = bigWord({ kicker: "HERE'S HOW THIS WORKS", word: 'ONE DAY', Bg: DAWN_OUT, size: 220, color: '#FFD23A' });

// ---------- S2: sunrise to sunrise: the sun comes up over the farm ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 480]]), 1.0)}>
    <Farmyard t={t + 100} tod="dawn" door={0.5} snow={0.2} />
  </g>
);

export const S3 = faceCU({ look: YOU, Bg: DAWN_OUT, faces: [[0, 'neutral'], [40, 'happy']], yaw: 0.2, zoom: [3.0, 3.2], light: { x: 1100, y: 500, kind: 'warm', o: 0.5 } });

// ---------- S4: that number in the corner is you: 37 ----------
export const S4: React.FC<ShotProps> = (p) => {
  const B = bigWord({ kicker: 'THE NUMBER IN THE CORNER IS YOU', word: '37.0°C', Bg: DAY, size: 230, color: '#FF8A3D', sub: 'NORMAL BODY TEMPERATURE' });
  const k = clamp((p.t - 14) / 10);
  return (
    <g>
      <B {...p} />
      <path d={`M 1300 420 Q ${1450} ${300} ${1300 + 280 * k} ${300 - 160 * k}`} stroke="#FF8A3D" strokeWidth={12} fill="none" strokeLinecap="round" opacity={k} />
    </g>
  );
};
export const S5 = bigWord({ kicker: 'BELOW', word: '35.0°C', Bg: NIGHTLOW, size: 230, color: '#7FD4FF', sub: 'HYPOTHERMIA' });
export const S6 = faceCU({ look: YOU, Bg: NIGHTLOW, faces: [[0, 'worried'], [30, 'dizzy']], yaw: -0.1, zoom: [3.0, 3.4], dark: 0.3, shiver: 1.5, light: { x: 960, y: 520, kind: 'cool', o: 0.6 } });

// ---------- S7: the man with the beard is Ketil ----------
export const S7 = scene({
  Set: DAY, setT: 50, words: W,
  cast: [{ look: KETIL, x: 900, feet: LH.back, s: 1, yaw: 0.3, faces: [[0, 'happy']], keys: [{ f: 6, p: { armR: { a: 150, b: -20 } } }, { f: 14, p: { armR: { a: 135, b: -30 } } }] }],
  cam: [[920, 600, 2.0], [920, 590, 2.1]],
  front: (t) => <NameTag x={1080} y={500} t={t - 22} text="KETIL" />,
});
export const S8 = scene({
  Set: DAY_OUT, setT: 90,
  cast: [{ look: KETIL_OUT, x: 700, feet: FEET + 40, s: 1, yaw: 0.6, faces: [[0, 'happy']], pose: { armR: { a: 100, b: -10 } } }],
  cam: [[900, 560, 1.0], [960, 560, 1.05]],
});

// ---------- S9: the woman with the keys: Gudrun ----------
export const S9 = scene({
  Set: DAY, setT: 140,
  cast: [{ look: GUDRUN, x: 1000, feet: LH.back, s: 0.97, yaw: -0.2, faces: [[0, 'neutral']], pose: { armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 } } }],
  cam: [[1000, 600, 2.0], [1000, 610, 2.15]],
  front: (t) => <NameTag x={1170} y={480} t={t - 40} text="GUDRUN" />,
});

// ---------- S10: the keys mean she runs this house ----------
export const S10 = insert({
  Bg: DAY, dim: 0.3,
  draw: (t) => {
    const sw = Math.sin(t / 5) * 8;
    return (
      <g transform={`translate(960 380) rotate(${sw}) scale(3.2)`}>
        <circle cx={0} cy={0} r={34} fill="none" stroke="#C8A040" strokeWidth={10} />
        {[-36, -12, 12, 36].map((a, i) => (
          <g key={i} transform={`rotate(${a}) translate(0 34)`}>
            <path d="M 0 0 L 0 110 M 0 90 l 18 0 M 0 104 l 12 0" stroke="#C8A040" strokeWidth={9} strokeLinecap="round" fill="none" />
          </g>
        ))}
      </g>
    );
  },
});

// ---------- S11: the girl staring at your sneakers ----------
export const S11 = insert({
  Bg: DAY, dim: 0.2,
  draw: (t) => (
    <g>
      <Sneakers x={1150} y={1000} s={1.6} />
      <g transform={`translate(${560} ${560 + Math.sin(t / 10) * 6}) scale(2.2)`}>
        <circle r={62} fill="#26232F" stroke="#100E16" strokeWidth={4} />
        <circle cx={-72} cy={-24} r={24} fill="#E8C060" stroke="#100E16" strokeWidth={4} />
        <circle cx={72} cy={-24} r={24} fill="#E8C060" stroke="#100E16" strokeWidth={4} />
        <ellipse cx={-14} cy={4} rx={13} ry={17} fill="#F6EFE3" />
        <ellipse cx={22} cy={4} rx={13} ry={17} fill="#F6EFE3" />
        <circle cx={-8} cy={12} r={6} fill="#100E16" />
        <circle cx={28} cy={12} r={6} fill="#100E16" />
        <ellipse cx={6} cy={36} rx={7} ry={9} fill="#F6EFE3" />
      </g>
    </g>
  ),
});
export const S12 = faceCU({ look: ASA, Bg: DAY, faces: [[0, 'happy']], yaw: 0.2, zoom: [3.6, 3.8], extra: (t) => <NameTag x={1090} y={470} t={t - 14} text="ASA" s={0.4} /> });

// ---------- S13: Asa has decided you're the funniest thing ever: she laughs, pointing ----------
export const S13 = scene({
  Set: DAY, setT: 200,
  cast: [
    { look: ASA, x: 820, feet: LH.back, s: 0.72, yaw: 0.6, faces: [[0, 'happy']], keys: [{ f: 0, p: { armR: { a: 95, b: -5 } } }], pose: { tilt: -6 } },
    { look: YOU, x: 1100, feet: LH.back, s: 0.95, yaw: -0.4, faces: [[0, 'oops']] },
  ],
  cam: [[960, 620, 1.9], [970, 620, 2.0]],
});

// ---------- S14: Gudrun points at the fire ----------
export const S14 = scene({
  Set: DAY, setT: 260,
  cast: [{ look: GUDRUN, x: 760, feet: LH.back, s: 0.97, yaw: 0.5, faces: [[0, 'neutral']], keys: [{ f: 6, p: { armR: { a: 70, b: -10 } } }] }],
  cam: [[900, 700, 1.4], [920, 720, 1.5]],
});
const gTalk = span(W, 'The', 'ever', 4);
export const S15 = faceCU({ look: GUDRUN, Bg: DAY, faces: [[0, 'neutral']], yaw: -0.15, zoom: [3.2, 3.5], light: { x: 900, y: 640, o: 0.6 } });

// ---------- S16: the fire never goes out ----------
export const S16 = insert({
  Bg: DAY, dim: 0.35,
  draw: (t) => (
    <g>
      <g transform="translate(960 800) scale(2.6)"><Flames x0={-200} x1={200} y={0} t={t} k={1.2} /></g>
    </g>
  ),
});
export const S17 = faceCU({ look: GUDRUN, Bg: DAY, faces: [[0, 'neutral']], yaw: 0, zoom: [3.0, 3.1], words: W, talk: [gTalk], pose: { armR: { a: 160, b: -10 } } });
export const S18 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'worried']], yaw: 0.2, zoom: [3.0, 3.3] });

// ---------- S19: tonight it's your job: the house at night, the fire low, you alone beside it ----------
export const S19 = scene({
  Set: NIGHTLOW, setT: 400,
  cast: [{ look: YOU, x: 1100, feet: LH.back, s: 0.95, yaw: -0.5, faces: [[0, 'worried']], eyes: -0.6 }],
  cam: [[1000, 620, 1.3], [1020, 640, 1.5]],
});
