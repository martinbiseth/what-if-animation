import React from 'react';
import { ShotProps, camT, kf, clamp, backOut, Bridge, Bicycle, Notebook, Folder, WantedStars, Hero, basePose, FONT, WANT, DESK, SUBURB, BRIDGE, rnd } from '../../../engine';
import words from './words.json';
import { YOU, MO, MUM, REYES, COP, N1, DeskSet, HomeSet, scene, faceCU, starsCU, insert, cueAt, starCard, span, people, StarField } from '../common';

// Chapter 7, six stars: the station: no cell, a desk, a form, a fine paid off in pocket money; Mum is not happy;
// Reyes and the folder: a traffic camera photo, a man on a highway bridge with six stars over his head; "the game
// only goes up to five"; "that's why I need your help"; Mo has written SIX; "Is that bad?"; is any of this real; run
// or walk out? Tell me in the comments.

const DAY = HomeSet('day');

// ---------- S1: chapter 7 ----------
export const S1 = starCard({ kicker: 'CHAPTER 7', title: 'SIX STARS', seed: 19, n: 0 });

// ---------- S2: at the station there's no cell: a desk, a form ----------
export const S2 = scene({
  Set: DeskSet, setT: 100, cam: { from: [960, 520, 1.25], to: [960, 520, 1.32] }, words,
  back: () => null,
  cast: [
    { look: COP, pose: { x: 900, y: DESK.feet - 170 - 40, yaw: 0.2, armR: { a: 60, b: -60 } }, faces: [[0, 'neutral']] },
    { look: MUM, pose: { x: 1500, y: DESK.feet - 170, yaw: -0.6, look: -0.6 }, faces: [[0, 'worried']] },
    { look: YOU, pose: { x: 1300, y: DESK.feet - 170, yaw: -0.6, look: -0.8 }, faces: [[0, 'tired']] },
  ],
});

// ---------- S3: a fine, paid off with your pocket money for a very long time ----------
export const S3 = insert({
  bgColor: '#2A2E3A', push: 0.08,
  draw: (t) => (
    <g>
      <g transform="translate(760 540) rotate(-4)">
        <rect x={-340} y={-420} width={680} height={840} fill="#F8F4E6" stroke="#8A8270" strokeWidth={6} />
        <text x={0} y={-320} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#14121C">NOTICE OF FINE</text>
        <text x={-280} y={-220} fontFamily={FONT.ui} fontSize={34} fill="#14121C">OFFENCE: FARE EVASION</text>
        {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-280} y={-160 + i * 50} width={380 + rnd(9, i) * 160} height={14} rx={6} fill="#C8C0B0" />)}
        <text x={-280} y={250} fontFamily={FONT.ui} fontSize={34} fill="#14121C">PAYMENT PLAN: WEEKLY</text>
      </g>
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i} opacity={clamp((t - i * 6) / 4)} transform={`translate(${1420 + (i % 3) * 30} ${820 - i * 26})`}>
          <ellipse rx={90} ry={26} fill="#E8C060" stroke="#7A5A08" strokeWidth={5} />
        </g>
      ))}
      <text x={1460} y={940} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#F6EFE3">POCKET MONEY</text>
    </g>
  ),
});

// ---------- S4: Mum is not happy ----------
export const S4 = faceCU({ look: MUM, Bg: DeskSet, faces: [[0, 'worried'], [20, 'tired']], yaw: -0.3, zoom: [2.7, 2.85] });

// ---------- S5: Reyes walks you to the door: "One more thing." ----------
export const S5 = scene({
  Set: DeskSet, setT: 300, cam: { from: [1500, 520, 1.6], to: [1500, 520, 1.7] }, words,
  cast: [
    { look: REYES, pose: { x: 1340, y: DESK.feet - 170, yaw: 0.5, look: 0.8 }, faces: [[0, 'neutral']], talk: [span(words, 'One', 'thing')] },
    { look: YOU, pose: { x: 1680, y: DESK.feet - 170, yaw: -0.5, look: -0.8 }, faces: [[0, 'neutral'], [60, 'worried']] },
  ],
  front: () => <Folder x={1440} y={DESK.feet - 330} s={0.3} rot={-10} />,
});

// ---------- S6: a photo from a traffic camera: a man on a highway bridge ----------
const Photo: React.FC<{ t: number; z?: number }> = ({ t, z = 1 }) => {
  const man = { ...basePose, x: 1000, y: BRIDGE.feet - 170, scale: 1, yaw: 0.2, expr: 'neutral' as const, blink: 0 };
  return (
    <g>
      <defs>
        <filter id="cam7" filterUnits="userSpaceOnUse" x={-400} y={-400} width={2800} height={1900}>
          <feColorMatrix type="matrix" values="0.3 0.5 0.1 0 0.02  0.3 0.5 0.1 0 0.02  0.3 0.5 0.12 0 0.04  0 0 0 1 0" />
        </filter>
      </defs>
      <g transform={camT(1000, 540, z)}>
        <g filter="url(#cam7)">
          <Bridge t={t} id="p7" block={0} />
          <Hero look={N1} pose={man} />
        </g>
        <WantedStars x={1000} y={BRIDGE.feet - 450} n={6} max={6} s={0.38} t={t} />
      </g>
      <text x={60} y={80} fontFamily={FONT.ui} fontSize={36} fill="#F6EFE3">TRAFFIC CAM 2207  HWY 40 BRIDGE</text>
      <text x={1860} y={80} textAnchor="end" fontFamily={FONT.ui} fontSize={36} fill="#F6EFE3">03:12:44</text>
    </g>
  );
};
export const S6 = insert({
  bgColor: '#C8A060', push: 0.06,
  draw: (t) => (
    <g transform="translate(960 540) rotate(-2) scale(0.78) translate(-960 -540)">
      <rect x={-30} y={-30} width={1980} height={1140} fill="#F8F4E6" />
      <clipPath id="ph6"><rect x={0} y={0} width={1920} height={1080} /></clipPath>
      <g clipPath="url(#ph6)"><Photo t={t} z={1} /></g>
    </g>
  ),
});

// ---------- S7: above his head, very small, six stars ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Photo t={t} z={kf(t, [[0, 1.8], [len, 3.4]])} />
    <rect width={1920} height={1080} fill="none" stroke="#FF3B3B" strokeWidth={12} opacity={Math.floor(t / 8) % 2} />
  </g>
);

// ---------- S8: "The game only goes up to five," you say ----------
export const S8 = faceCU({ look: YOU, Bg: DeskSet, faces: [[0, 'shock'], [30, 'worried']], yaw: -0.35, zoom: [2.6, 2.8], words, talk: [span(words, 'The', 'five')] });

// ---------- S9: "I know. That's why I need your help." ----------
export const S9 = faceCU({ look: REYES, Bg: DeskSet, faces: [[0, 'neutral'], [40, 'smug']], yaw: 0.35, zoom: [2.6, 2.8], words, talk: [span(words, 'I', 'know'), span(words, "That's", 'help')] });

// ---------- S10: outside, Mo is waiting on his bike with the notebook ----------
export const S10 = scene({
  Set: DAY, setT: 200, cam: { from: [960, 540, 1.5], to: [960, 540, 1.58] }, words,
  cast: [{ look: MO, pose: { x: 900, y: SUBURB.feet - 170, yaw: 0.5, armR: { a: 50, b: -70 }, armL: { a: 40, b: -60 } }, faces: [[0, 'neutral']] }],
  front: () => <g><Bicycle x={1160} y={SUBURB.feet + 4} color="#E8402A" /><rect x={940} y={SUBURB.feet - 250} width={90} height={110} rx={6} fill="#2A2420" /></g>,
});

// ---------- S11: SIX on a new page, underlined twice ----------
export const S11 = insert({
  bgColor: '#3A2E28', push: 0.08,
  draw: (t) => (
    <g>
      <Notebook x={960} y={540} s={1.7} rot={-3} t={t} lines={[]} />
      <g transform="translate(1280 520) rotate(-3)">
        <text textAnchor="middle" fontFamily="Kalam, cursive" fontWeight={700} fontSize={200} fill="#C83A3A" opacity={clamp(t / 8)}>SIX</text>
        <path d="M -200 40 Q 0 20 200 36" stroke="#C83A3A" strokeWidth={12} fill="none" strokeDasharray={420} strokeDashoffset={420 * (1 - clamp((t - 10) / 8))} />
        <path d="M -190 76 Q 0 58 190 72" stroke="#C83A3A" strokeWidth={12} fill="none" strokeDasharray={400} strokeDashoffset={400 * (1 - clamp((t - 20) / 8))} />
      </g>
    </g>
  ),
});

// ---------- S12: "So. Is that bad?" ----------
export const S12 = faceCU({ look: MO, Bg: DAY, faces: [[0, 'neutral'], [20, 'oops']], yaw: 0.35, zoom: [2.7, 2.9], words, talk: [span(words, 'So', 'So'), span(words, 'Is', 'bad')] });

// ---------- S13: is any of this real? ----------
export const S13: React.FC<ShotProps> = (p) => {
  const c = (w: string) => cueAt(words, p.f, p.t, w);
  const items = [
    { at: c('stars'), text: 'THE STARS', ok: false },
    { at: c('helicopters'), text: 'THERMAL HELICOPTERS', ok: true },
    { at: c('cameras'), text: 'PLATE CAMERAS', ok: true },
    { at: c('warrants'), text: 'WARRANTS THAT NEVER RUN OUT', ok: true },
    { at: c('running'), text: 'RUNNING MAKES IT WORSE', ok: true },
  ];
  const { t } = p;
  return (
    <g>
      <StarField t={t} n={12} />
      <text x={960} y={190} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#F6EFE3">IS ANY OF THIS REAL?</text>
      {items.map((it, i) => {
        const k = backOut(clamp((t - it.at) / 8));
        return (
          <g key={i} transform={`translate(420 ${320 + i * 140}) scale(${k})`} opacity={clamp((t - it.at) / 4)}>
            {it.ok ? <path d="M -40 0 L -10 30 L 44 -34" stroke="#5BE08A" strokeWidth={18} fill="none" strokeLinecap="round" /> : <path d="M -34 -34 L 34 34 M 34 -34 L -34 34" stroke="#FF3A2A" strokeWidth={18} strokeLinecap="round" />}
            <text x={90} y={26} fontFamily={FONT.title} fontWeight={800} fontSize={72} fill={it.ok ? '#F6EFE3' : '#9A94A8'} textDecoration={it.ok ? undefined : 'line-through'}>{it.text}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- S14: run, or walk out? Tell me in the comments ----------
export const S14: React.FC<ShotProps> = ({ t, len, f }) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  const cm = cueAt(words, f, t, 'Tell');
  return (
    <g>
      <g transform={camT(960, 520, kf(t, [[0, 1.2], [len, 1.28]]))}>
        <DAY t={t + 400} id="end" />
      </g>
      <rect width={1920} height={1080} fill="#0B0816" opacity={0.45} />
      <g transform={camT(960, 560, 1.5)}>{people(t, [{ look: YOU, pose: { x: 960, y: SUBURB.feet - 170, yaw: 0, look: 0 }, faces: [[0, 'neutral']], stars: 0 }])}</g>
      <g transform={`translate(480 520) scale(${pop(4)})`}>
        <rect x={-260} y={-90} width={520} height={160} rx={30} fill={WANT.red} stroke="#0B0816" strokeWidth={8} />
        <text y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#FFFFFF">RUN?</text>
      </g>
      <g transform={`translate(1440 520) scale(${pop(14)})`}>
        <rect x={-300} y={-90} width={600} height={160} rx={30} fill="#2E9A5A" stroke="#0B0816" strokeWidth={8} />
        <text y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFFFFF">WALK OUT?</text>
      </g>
      <g transform={`translate(960 940) scale(${pop(cm)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">TELL ME IN THE COMMENTS</text>
      </g>
    </g>
  );
};
