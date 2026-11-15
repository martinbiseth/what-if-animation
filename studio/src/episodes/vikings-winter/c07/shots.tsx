import React from 'react';
import { ShotProps, Word, clamp, easeOut, backOut, kf, camT, FONT, Glow, Hero, basePose, Giza, EG } from '../../../engine';
import { YOU, YOU_WOOL, KETIL, GUDRUN, ASA, LH, Farmyard, Bowl, Mittens, Cow, Skis, Stockfish, Sneakers, INK } from '../norse';
import { scene, faceCU, insert, bigWord, inside, outside, Caption, wordF, WHITE } from '../common';
import words from './words.json';

// Chapter 7, sunrise: ten in the morning, the sun finally over the mountains; 36.8, you made it; Gudrun nods once (a
// medal), the needle-bound mittens are yours; Asa waves, Ketil raises his bowl. You blink, and the cold is gone: heat,
// sand under your sneakers, 43 degrees, something enormous and half finished (next time: ancient Egypt). Is any of this
// real? The turf roofs, the cows, the skis, the stockfish, the frozen noses, the tinder fungus: all of it. Sources in
// the description. Would you have made it? Where should you wake up next? Tell us in the comments.

const W = words as Word[];
const at = (a: string, n = 1) => wordF(W, a, n);
const DAY = inside({ mode: 'day', fire: 1 });
const DAWN_OUT = outside({ tod: 'dawn', door: 0.5, snow: 0.2 });
const GIZA: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Giza t={t} id={id ?? 'gz'} tod="day" build={0.5} />;

const Label: React.FC<{ t: number; text: string; x?: number; y?: number; c?: string; s?: number }> = ({ t, text, x = 960, y = 960, c = '#FFD23A', s = 1 }) => {
  const k = easeOut(clamp(t / 8));
  const w = text.length * 36 + 120;
  return (
    <g opacity={k} transform={`translate(${x} ${y + (1 - k) * 40}) scale(${s})`}>
      <rect x={-w / 2} y={-56} width={w} height={100} rx={50} fill="#0B0816" opacity={0.8} />
      <text y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill={c}>{text}</text>
    </g>
  );
};
const Heat: React.FC<{ t: number }> = ({ t }) => (
  <g opacity={0.35}>
    {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${120 + i * 240} ${1000 - ((t * 4 + i * 60) % 500)} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#FFF2D0" strokeWidth={6} fill="none" strokeLinecap="round" />)}
  </g>
);

// ---------- S1: ten in the morning ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, kf(t, [[0, 540], [Math.max(1, len), 520]]), 1.0)}>
      <Farmyard t={t + 40} tod="dawn" door={0.5} snow={0.2} />
    </g>
    <Caption t={t} text="10:00 AM" />
  </g>
);

// ---------- S2: the sun finally drags itself over the mountains ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len));
  return (
    <g>
      <g transform={camT(960, kf(t, [[0, 460], [Math.max(1, len), 500]]), 1.25)}>
        <Farmyard t={t + 80} tod="dawn" door={0.5} snow={0.2} />
      </g>
      <Glow x={1300} y={420 - 120 * k} r={500} kind="warm" o={0.5 + 0.4 * k} />
    </g>
  );
};

// ---------- S3: the number in the corner reads 36.8 ----------
export const S3 = bigWord({ kicker: 'THE NUMBER IN THE CORNER', word: '36.8°C', Bg: DAWN_OUT, size: 230, color: '#FFB23A' });

// ---------- S4: you made it ----------
export const S4 = faceCU({ look: YOU_WOOL, Bg: DAWN_OUT, faces: [[0, 'neutral'], [10, 'happy']], yaw: 0.2, zoom: [3.0, 3.2], light: { x: 1150, y: 480, kind: 'warm', o: 0.7 } });

// ---------- S5: Gudrun looks at the fire, then at you, and nods once ----------
export const S5: React.FC<ShotProps> = (p) => {
  const t0 = at('Gudrun');
  const toYou = at('you', 2) - t0, nod = at('nods') - t0;
  const F = faceCU({
    look: GUDRUN, Bg: DAY, faces: [[0, 'neutral']], yaw: p.t < toYou ? 0.35 : -0.2, eyes: p.t < toYou ? 0.8 : -0.6, zoom: [3.1, 3.3], light: { x: 900, y: 680, o: 0.6 },
    pose: { headTilt: p.t > nod && p.t < nod + 12 ? Math.sin(((p.t - nod) / 12) * Math.PI) * 14 : 0 },
  });
  return <F {...p} />;
};

// ---------- S6: from Gudrun, that's a medal ----------
export const S6 = insert({
  Bg: DAY, dim: 0.45,
  draw: (t) => {
    const k = backOut(clamp((t - 2) / 10));
    return (
      <g transform={`translate(960 520) scale(${k}) rotate(${Math.sin(t / 8) * 6})`}>
        <path d="M -90 -330 L -20 -80 L 20 -80 L 90 -330 Z" fill="#B8503A" stroke={INK} strokeWidth={8} />
        <path d="M -20 -330 L 0 -80 L 20 -330 Z" fill="#3E5A8A" />
        <circle cx={0} cy={60} r={150} fill="#FFD23A" stroke={INK} strokeWidth={10} />
        <circle cx={0} cy={60} r={110} fill="none" stroke="#C8A040" strokeWidth={8} />
        <text y={92} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={88} fill="#8A6A1A">1st</text>
      </g>
    );
  },
});

// ---------- S7: she hands you a pair of needle-bound mittens ----------
export const S7 = insert({
  Bg: DAY, dim: 0.35,
  draw: (t) => (
    <g>
      <g transform={`translate(${(1 - easeOut(clamp(t / 12))) * -700} 0)`}><Mittens x={960} y={540} s={2.4} /></g>
      <Label t={t - 12} text="NEEDLE-BOUND MITTENS" y={900} />
    </g>
  ),
});

// ---------- S8: yours to keep ----------
export const S8 = faceCU({ look: YOU_WOOL, Bg: DAY, faces: [[0, 'happy']], yaw: 0.15, zoom: [3.0, 3.1], light: { x: 900, y: 680, o: 0.6 },
  extra: () => <Mittens x={960} y={830} s={0.7} /> });

// ---------- S9: Asa waves ----------
export const S9 = scene({
  Set: DAY, setT: 300,
  cast: [{ look: ASA, x: 960, feet: LH.back, s: 0.72, yaw: 0.1, faces: [[0, 'happy']], keys: [0, 8, 16, 24, 32, 40].map((f, i) => ({ f, p: { armR: { a: 160 + (i % 2 ? 20 : -15), b: -30 } } })) }],
  cam: [[960, 640, 2.4], [960, 640, 2.5]],
});

// ---------- S10: Ketil raises his bowl ----------
export const S10 = faceCU({
  look: KETIL, Bg: DAY, faces: [[0, 'happy']], yaw: 0.1, zoom: [2.4, 2.5], light: { x: 900, y: 680, o: 0.6 },
  pose: { armR: { a: 160, b: -20 } },
  extra: (t) => <Bowl x={1065} y={kf(t, [[0, 520], [10, 450]], easeOut)} s={0.5} t={t} />,
});

// ---------- S11: you blink ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len));
  const h = 560 * Math.sin(Math.min(1, k * 1.4) * Math.PI / 2);
  const F = faceCU({ look: YOU_WOOL, Bg: DAY, faces: [[0, 'neutral']], yaw: 0.1, zoom: [3.2, 3.2], light: { x: 900, y: 680, o: 0.6 } });
  return (
    <g>
      <F t={t} len={len} f={0} />
      <rect x={0} y={0} width={1920} height={h} fill="#05040A" />
      <rect x={0} y={1080 - h} width={1920} height={h} fill="#05040A" />
    </g>
  );
};

// ---------- S12: and the cold is gone ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 12));
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1.15], [Math.max(1, len), 1.05]]))}>
        <GIZA t={t + 60} id="s12" />
      </g>
      <Heat t={t} />
      <rect x={0} y={0} width={1920} height={560 * (1 - k)} fill="#05040A" />
      <rect x={0} y={1080 - 560 * (1 - k)} width={1920} height={560 * (1 - k)} fill="#05040A" />
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.5 * (1 - clamp((t - 6) / 12))} />
    </g>
  );
};

// ---------- S13: instead, heat. A wall of it ----------
export const S13 = faceCU({
  look: YOU, Bg: GIZA, faces: [[0, 'shock']], yaw: 0.1, zoom: [3.0, 3.2], light: { x: 1100, y: 420, kind: 'warm', o: 0.8 },
  extra: (t) => <g>{[0, 1].map((i) => <path key={i} d={`M ${910 + i * 110} ${460 + ((t * 2 + i * 20) % 50)} q 8 14 0 20 q -8 -6 0 -20`} fill="#BFE6FF" stroke={INK} strokeWidth={2} />)}</g>,
  front: (t) => <Heat t={t} />,
});

// ---------- S14: sand under your sneakers ----------
export const S14 = insert({
  Bg: GIZA, dim: 0.2,
  draw: (t) => (
    <g>
      <path d="M -200 900 Q 960 840 2200 910 L 2200 1300 L -200 1300 Z" fill="#E8C890" />
      <Sneakers x={960} y={930} s={1.5} />
      {Array.from({ length: 10 }).map((_, i) => <circle key={i} cx={700 + i * 60} cy={930 - ((t + i * 7) % 20)} r={4} fill="#C8A060" opacity={0.7} />)}
      <Heat t={t} />
    </g>
  ),
});

// ---------- S15: forty-three degrees ----------
export const S15 = bigWord({ word: '43°C', Bg: GIZA, size: 300, color: '#FF5A3A', kicker: 'OUTSIDE' });

// ---------- S16: in the distance, something enormous made of stone ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [Math.max(1, len), 1100]]), 520, kf(t, [[0, 1.0], [Math.max(1, len), 1.25]]))}>
      <GIZA t={t + 120} id="s16" />
    </g>
    <Heat t={t} />
  </g>
);

// ---------- S17: and only half finished ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1180, 460, kf(t, [[0, 1.8], [Math.max(1, len), 1.9]]))}>
      <GIZA t={t + 160} id="s17" />
    </g>
    <Label t={t - 6} text="HALF FINISHED" y={180} />
  </g>
);

// ---------- S18: next time, you wake up in ancient Egypt ----------
export const S18 = bigWord({ kicker: 'NEXT TIME', word: 'ANCIENT EGYPT', Bg: GIZA, size: 170, color: '#FFD23A' });

// ---------- S19: but first: is any of this real? ----------
export const S19 = bigWord({ kicker: 'BUT FIRST', word: 'IS ANY OF THIS REAL?', Bg: DAY, size: 110, color: WHITE });

// ---------- S20: turf roofs, cows, skis, stockfish, frozen noses, tinder fungus ----------
const RECAP: [string, string][] = [['turf', 'TURF ROOFS'], ['cows', 'COWS INSIDE'], ['skis', 'SKIS'], ['stockfish', 'STOCKFISH'], ['noses', 'FROZEN NOSES'], ['tinder', 'TINDER FUNGUS']];
const Icon: React.FC<{ i: number; t: number }> = ({ i, t }) => {
  switch (i) {
    case 0:
      return <g><path d="M -110 30 Q 0 -60 110 30 L 110 60 L -110 60 Z" fill="#5E8A3A" stroke={INK} strokeWidth={6} /><rect x={-90} y={50} width={180} height={50} fill="#5A3E2C" stroke={INK} strokeWidth={5} /></g>;
    case 1:
      return <Cow x={0} y={80} s={0.45} t={t} />;
    case 2:
      return <g><Skis x={0} y={20} s={0.6} /><Skis x={10} y={50} s={0.6} /></g>;
    case 3:
      return <Stockfish x={0} y={40} s={0.7} />;
    case 4:
      return <g><circle cx={0} cy={30} r={60} fill="#26232F" stroke={INK} strokeWidth={5} /><path d="M 0 30 m -18 0 l 36 0 m -18 -18 l 0 36 m -12 -12 l 24 24 m 0 -24 l -24 24" stroke="#DFF4FF" strokeWidth={5} strokeLinecap="round" /></g>;
    default:
      return <g><path d="M -80 50 Q -84 -10 0 -16 Q 84 -10 80 50 Q 0 70 -80 50 Z" fill="#8A6A4A" stroke={INK} strokeWidth={6} /><ellipse cx={0} cy={20} rx={18} ry={9} fill="#FF7A1E" /></g>;
  }
};
export const S20 = insert({
  Bg: DAY, dim: 0.55,
  draw: (t) => {
    const t0 = at('turf');
    return (
      <g>
        {RECAP.map(([w, label], i) => {
          const d = at(w) - t0 - 2;
          const k = backOut(clamp((t - d) / 8));
          const x = 420 + (i % 3) * 540, y = 330 + Math.floor(i / 3) * 400;
          return (
            <g key={w} transform={`translate(${x} ${y}) scale(${k})`} opacity={clamp((t - d) / 4)}>
              <rect x={-230} y={-160} width={460} height={340} rx={30} fill="#1A1424" stroke="#FFD23A" strokeWidth={5} />
              <g transform="translate(0 -40)"><Icon i={i} t={t} /></g>
              <text y={140} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={42} fill={WHITE}>{label}</text>
            </g>
          );
        })}
      </g>
    );
  },
});

// ---------- S21: all of it. Real ----------
export const S21 = bigWord({ word: 'ALL OF IT', sub: 'REAL. EVERY ONE.', Bg: DAY, size: 220, color: '#FFD23A' });

// ---------- S22: the sources are in the description ----------
export const S22 = insert({
  Bg: DAY, dim: 0.55,
  draw: (t) => (
    <g>
      <rect x={560} y={220} width={800} height={560} rx={30} fill="#F6EFE3" stroke={INK} strokeWidth={8} />
      <text x={620} y={310} fontFamily={FONT.title} fontWeight={800} fontSize={54} fill={INK}>SOURCES</text>
      {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={620} y={360 + i * 64} width={(560 - (i % 3) * 90) * clamp((t - 4 - i * 3) / 8)} height={24} rx={12} fill="#B8B0A0" />)}
      <path d={`M 960 ${820 + Math.sin(t / 4) * 14} l 0 110 m -50 -50 l 50 50 l 50 -50`} stroke="#FFD23A" strokeWidth={18} fill="none" strokeLinecap="round" />
    </g>
  ),
});

// ---------- S23: so, would you have made it through the night? ----------
export const S23: React.FC<ShotProps> = (p) => {
  const S = scene({
    Set: DAY, setT: 500,
    cast: [
      { look: KETIL, x: 620, feet: LH.back, s: 1, yaw: 0.4, faces: [[0, 'happy']] },
      { look: GUDRUN, x: 820, feet: LH.back, s: 0.97, yaw: 0.3, faces: [[0, 'neutral']] },
      { look: ASA, x: 990, feet: LH.back, s: 0.72, yaw: 0.2, faces: [[0, 'happy']] },
      { look: YOU_WOOL, x: 1200, feet: LH.back, s: 0.95, yaw: -0.3, faces: [[0, 'happy']] },
    ],
    cam: [[910, 620, 1.45], [920, 620, 1.55]],
  });
  return <g><S {...p} /><Caption t={p.t} text="WOULD YOU HAVE MADE IT?" y={130} /></g>;
};

// ---------- S24: where should you wake up next? ----------
export const S24 = insert({
  Bg: DAY, dim: 0.55,
  draw: (t) => (
    <g>
      <text x={960} y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill={WHITE} opacity={clamp(t / 6)}>WHERE NEXT?</text>
      {['ANCIENT ROME?', 'FEUDAL JAPAN?', 'THE ICE AGE?'].map((s, i) => (
        <g key={s} opacity={clamp((t - 6 - i * 6) / 6)} transform={`translate(960 ${430 + i * 170})`}>
          <rect x={-380} y={-60} width={760} height={120} rx={60} fill="#1A1424" stroke="#FFD23A" strokeWidth={5} />
          <text y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFD23A">{s}</text>
        </g>
      ))}
    </g>
  ),
});

// ---------- S25: tell us in the comments ----------
export const S25 = insert({
  Bg: DAY, dim: 0.5,
  draw: (t) => {
    const txt = 'I would have made it...';
    const n = Math.floor(clamp((t - 4) / 18) * txt.length);
    return (
      <g transform={`translate(960 540) scale(${backOut(clamp(t / 8))})`}>
        <path d="M -520 -170 L 520 -170 Q 560 -170 560 -130 L 560 110 Q 560 150 520 150 L -300 150 L -380 230 L -380 150 L -520 150 Q -560 150 -560 110 L -560 -130 Q -560 -170 -520 -170 Z" fill="#F6EFE3" stroke={INK} strokeWidth={8} />
        <circle cx={-450} cy={-80} r={44} fill="#F07A2A" stroke={INK} strokeWidth={5} />
        <text x={-380} y={-64} fontFamily={FONT.ui} fontSize={40} fill="#6A6460">you · now</text>
        <text x={-470} y={50} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={INK}>{txt.slice(0, n)}{t % 20 < 10 ? '|' : ''}</text>
      </g>
    );
  },
});

void [EG, Hero, basePose];
