import React from 'react';
import {
  ShopStreet, LibraryNight, Hedge, PoliceCar, PoliceDog, Helicopter, Star, Big, PopWord, Soft, Glow,
  versus, bigWord, thermalShot, Schematic, SCH,
  YOU_NOHOOD, MO, COP, Body, runPose, wheeze, standAt, hipAt, GROUND,
  camT, kf, clamp, backOut, easeOut, basePose, FONT, shk, span, rnd, ShotProps, Word,
} from '../common';
import words from './words.json';

// Chapter 5, rule five: 5 PM a police car, every game instinct says run; ten seconds, then your legs quit. Running
// from an officer is a crime on its own. You hide in the hedge behind the library and wait for the stars to fade.
// Real police don't have stars, they have dogs (300 million scent receptors to your 6 million) and a helicopter with a
// thermal camera. Biscuit finds you in forty seconds. Eight minutes. "Are you the one from the video?"

const W = words as Word[];
const DUSK: React.FC<{ t: number; id?: string }> = ({ t, id }) => <ShopStreet t={t} id={id} mode="dusk" />;
const LIB: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LibraryNight t={t} id={id} mode="dusk" />;
const HX = 1180; // where you hide in the hedge
const HEDGE_Y0 = 690;

// ---------------------------------------------------------------- S1: 5 PM, a police car at the end of the street
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 900], [len, 1100]]), 700, 1.0)}>
      <ShopStreet t={t} mode="dusk" id="c5s1" />
      <PoliceCar x={kf(t, [[0, 2500], [30, 1700]], easeOut)} y={1040} s={0.9} t={t} flip />
      <Body look={YOU_NOHOOD} pose={standAt(500, 0.9, GROUND, { yaw: 0.6 })} t={t} faces={[[0, 'neutral'], [30, 'shock']]} shadow={1} />
    </g>
    <text x={80} y={110} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={clamp(t / 6)}>5:00 PM</text>
  </g>
);

// ---------------------------------------------------------------- S2: every game instinct
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.3}>
      <g transform={camT(800, 560, 1.6)}>
        <ShopStreet t={t + 100} mode="dusk" id="c5s2" />
      </g>
    </Soft>
    <Glow x={1920} y={500} r={700} kind={Math.floor(t / 5) % 2 ? 'red' : 'cool'} o={0.5} />
    <g transform={camT(960, 500, kf(t, [[0, 3.0], [len, 3.5]]))}>
      <Body look={YOU_NOHOOD} pose={{ ...basePose, x: 960, y: 700, yaw: 0.3, look: Math.sin(t / 3) > 0 ? 0.8 : -0.8 }} t={t} faces={[[0, 'worried']]} />
    </g>
  </g>
);

export const S3 = bigWord({ word: 'RUN.', color: '#FF4A3A', Bg: DUSK, size: 300 });

// ---------------------------------------------------------------- S4: so you run, for ten seconds
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 300], [len, 1500]], (k) => k);
  return (
    <g transform={camT(x, 640, 1.3)}>
      <ShopStreet t={t + 200} mode="dusk" id="c5s4" />
      <Body look={YOU_NOHOOD} pose={runPose(x, t * 0.8, GROUND, 1)} t={t} faces={[[0, 'shock']]} shadow={1} />
      <text x={x + 260} y={360} fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">{`${Math.max(0, 10 - Math.floor(t / 6))}`}</text>
    </g>
  );
};

// ---------------------------------------------------------------- S5: your legs quit
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1500, 700, kf(t, [[0, 1.8], [len, 2.0]]))}>
    <ShopStreet t={t + 260} mode="dusk" id="c5s5" />
    <Body look={YOU_NOHOOD} pose={wheeze(1500, GROUND, 1, t)} t={t} faces={[[0, 'tired']]} shadow={1} />
    <PopWord t={t} at={8} x={1400} y={580} text="LEGS: QUIT" size={70} fill="#FFFFFF" hold={60} />
  </g>
);

// ---------------------------------------------------------------- S6: running from the police doesn't make it go away
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="c5s6" />
    <g opacity={clamp(t / 6)}>
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={8} fill={SCH.dim}>WHAT THE GAME NEVER TELLS YOU</text>
    </g>
    <g transform={`translate(960 560) scale(${backOut(clamp((t - 14) / 10))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill={SCH.live}>RUNNING DOESN'T</text>
      <text y={120} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill={SCH.live}>MAKE IT GO AWAY</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- S7: a few tickets become something much bigger
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const m = easeOut(clamp((t - 50) / 20));
  return (
    <g>
      <rect width={1920} height={1080} fill="#E9E2D2" />
      {[0, 1, 2, 3].map((i) => {
        const x0 = 360 + i * 400;
        const x = x0 + (960 - x0) * m;
        return (
          <g key={i} transform={`translate(${x} ${460 + Math.sin(i) * 40 * (1 - m)}) rotate(${(i - 1.5) * 8 * (1 - m)})`} opacity={1 - 0.6 * m}>
            <rect x={-130} y={-170} width={260} height={340} rx={10} fill="#FFFFFF" stroke="#14121C" strokeWidth={5} />
            <rect x={-100} y={-130} width={200} height={30} fill="#E8453A" />
            {[0, 1, 2, 3].map((k) => <rect key={k} x={-100} y={-70 + k * 50} width={200} height={14} rx={7} fill="#9A948A" />)}
          </g>
        );
      })}
      <g transform={`translate(960 520) rotate(-8) scale(${backOut(clamp((t - 64) / 10)) * 1.3})`}>
        <rect x={-430} y={-110} width={860} height={200} rx={20} fill="none" stroke="#E8253A" strokeWidth={14} />
        <text x={0} y={34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#E8253A">MUCH BIGGER</text>
      </g>
      <text x={960} y={950} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#2A2E46" opacity={clamp(t / 8)}>IN A LOT OF PLACES, RUNNING FROM AN OFFICER IS A CRIME ON ITS OWN</text>
      {len > 0 ? null : null}
    </g>
  );
};

// ---------------------------------------------------------------- S8: you crawl into the hedge behind the library
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len - 10));
  const x = 500 + (HX - 500) * easeOut(k);
  const fl = GROUND + 40;
  return (
    <g transform={camT(1000, 640, 1.2)}>
      <LibraryNight t={t} mode="dusk" />
      <Body look={YOU_NOHOOD} pose={{ ...basePose, x, y: fl - 120, spin: 70, yaw: 0.6, facing: 1, headTilt: -50, armL: { a: 170 + 10 * Math.sin(t / 3), b: -20 }, armR: { a: 170 - 10 * Math.sin(t / 3), b: -20 }, legL: { a: 20, b: -60 }, legR: { a: -10, b: -50 } }} t={t} faces={[[0, 'worried']]} />
      <Hedge x0={700} x1={2400} y0={HEDGE_Y0} y1={fl} t={t} />
    </g>
  );
};

// ---------------------------------------------------------------- S9: inside the hedge: rule five, wait for the stars to fade
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#14301E" />
    <g transform={camT(960, 520, kf(t, [[0, 2.9], [len, 3.1]]))}>
      <Body look={YOU_NOHOOD} pose={{ ...basePose, x: 960, y: 700, yaw: 0.2, look: Math.sin(t / 10) * 0.6 }} t={t} faces={[[0, 'smug']]} />
    </g>
    {Array.from({ length: 26 }).map((_, i) => (
      <ellipse key={i} cx={rnd(3, i) * 1920} cy={rnd(5, i) * 1080} rx={110} ry={60} fill={i % 2 ? '#2E6A3A' : '#3A7A46'} stroke="#0B0816" strokeWidth={4} transform={`rotate(${rnd(7, i) * 180} ${rnd(3, i) * 1920} ${rnd(5, i) * 1080})`} opacity={Math.abs(rnd(3, i) * 1920 - 960) < 330 && Math.abs(rnd(5, i) * 1080 - 520) < 330 ? 0 : 1} />
    ))}
    <text x={960} y={960} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#F6EFE3" opacity={clamp((t - 30) / 8)}>WAITING FOR THE STARS TO FADE...</text>
  </g>
);

// ---------------------------------------------------------------- S10: real police don't have stars: they crack
export const S10: React.FC<ShotProps> = ({ t }) => {
  const cr = clamp((t - 30) / 10);
  return (
    <g>
      <rect width={1920} height={1080} fill="#14102A" />
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${480 + i * 240} ${460 + 600 * Math.pow(clamp((t - 44 - i * 3) / 20), 2)}) rotate(${cr * (i - 2) * 12})`} opacity={1 - 0.5 * cr}>
          <Star x={0} y={0} r={90} on={1} />
          {cr > 0 ? <path d="M -30 -80 L 10 -20 L -20 10 L 30 80" stroke="#0B0816" strokeWidth={10} fill="none" /> : null}
        </g>
      ))}
      <g opacity={clamp((t - 10) / 8)}>
        <Big x={960} y={220} size={86}>REAL POLICE DON'T HAVE STARS</Big>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S11: they have dogs: Biscuit and his officer
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(800, 640, kf(t, [[0, 1.7], [len, 1.85]]))}>
    <LibraryNight t={t + 60} mode="dusk" police={1} />
    <Body look={COP} pose={standAt(640, 1.05, GROUND + 20, { yaw: 0.5, armR: { a: 40, b: -20 } })} t={t} faces={[[0, 'neutral']]} seed={12} shadow={1} />
    <path d={`M ${700} ${hipAt(1.05, GROUND + 20) + 20} Q 780 820 850 ${GROUND - 60}`} stroke="#14121C" strokeWidth={5} fill="none" />
    <PoliceDog x={900} y={GROUND + 20} s={1.0} t={t} sniff={1} />
    <Hedge x0={1100} x1={2400} y0={HEDGE_Y0} y1={GROUND + 40} t={t} />
    <PopWord t={t} at={6} x={900} y={560} text="BISCUIT" size={70} fill="#FFD23A" hold={60} />
  </g>
);

// ---------------------------------------------------------------- S12: 300 million vs 6 million
const Nose: React.FC<{ n: number; color: string; t: number }> = ({ n, color, t }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => (
      <circle key={i} cx={(rnd(2, i) - 0.5) * 380} cy={(rnd(4, i) - 0.5) * 380} r={9} fill={color} opacity={clamp((t - i * 0.4) / 6)} />
    ))}
  </g>
);
export const S12 = versus({
  game: 'DOG: 300 MILLION', real: 'YOU: 6 MILLION', at: 40,
  gameIcon: (t) => <Nose n={150} color="#FFD23A" t={t} />,
  realIcon: (t) => <Nose n={3} color="#FF5A4A" t={t} />,
});

// ---------------------------------------------------------------- S13: you're a big sweaty sign that says HERE
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp((t - Math.round(len * 0.55)) / 10));
  return (
    <g transform={camT(HX, 640, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <LibraryNight t={t + 100} mode="dusk" police={1} />
      <Hedge x0={700} x1={2400} y0={HEDGE_Y0} y1={GROUND + 40} t={t} />
      {Array.from({ length: 5 }).map((_, i) => {
        const k = ((t + i * 9) % 45) / 45;
        return <path key={i} d={`M ${HX - 80 + i * 40} ${HEDGE_Y0 + 20 - 200 * k} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#9AE07A" strokeWidth={8} fill="none" opacity={1 - k} />;
      })}
      <g transform={`translate(${HX} ${HEDGE_Y0 - 260}) scale(${pop})`}>
        <rect x={-200} y={-80} width={400} height={140} rx={20} fill="#FF3A6A" stroke="#0B0816" strokeWidth={8} />
        <text x={0} y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#FFFFFF">HERE</text>
        <path d="M -40 70 L 40 70 L 0 140 Z" fill="#FF3A6A" stroke="#0B0816" strokeWidth={8} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S14: and there's a helicopter
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`${shk(t, 0, 200, 2)} ${camT(960, 520, kf(t, [[0, 1.0], [len, 1.08]]))}`}>
    <LibraryNight t={t + 140} mode="night" police={1} />
    <Helicopter x={kf(t, [[0, 2300], [len, 1400]], easeOut)} y={200} s={1.2} t={t} beam={1} />
    <Hedge x0={-300} x1={2400} y0={HEDGE_Y0} y1={GROUND + 40} t={t} />
  </g>
);

export const S15 = thermalShot({ lock: 70 });

// ---------------------------------------------------------------- S16: in the game, you hide behind a dumpster and it flies past
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g style={{ filter: 'saturate(1.5) hue-rotate(-10deg)' }}>
      <g transform={camT(960, 560, 1.0)}>
        <ShopStreet t={t + 400} mode="night" id="c5s16" />
        <g transform="translate(1100 870)">
          <rect x={-200} y={-220} width={400} height={220} rx={10} fill="#2E6A4A" stroke="#0B0816" strokeWidth={8} />
          <rect x={-210} y={-240} width={420} height={30} rx={6} fill="#22553A" stroke="#0B0816" strokeWidth={6} />
        </g>
        <Body look={YOU_NOHOOD} pose={standAt(860, 0.9, GROUND, { yaw: 0.6, squash: 0.15, legL: { a: 70, b: -120 }, legR: { a: 60, b: -120 }, y: hipAt(0.9) + 60 })} t={t} faces={[[0, 'cool']]} shadow={1} />
        <Helicopter x={kf(t, [[0, -400], [len, 2400]], (k) => k)} y={180} s={0.9} t={t} beam={1} />
      </g>
    </g>
    <rect x={40} y={40} width={330} height={80} rx={40} fill="#14121C" opacity={0.8} />
    <text x={205} y={96} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={6} fill="#4AD06A">IN THE GAME</text>
  </g>
);

// ---------------------------------------------------------------- S17: in real life, the pilot just says it into the radio
export const S17: React.FC<ShotProps> = ({ t, len, f }) => {
  const line = span(W, 'Hedge', 'library');
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1220" />
      <path d="M 1100 -50 Q 1900 100 2000 900 L 2000 -50 Z" fill="#1A2440" stroke="#0B0816" strokeWidth={12} />
      <path d="M 1200 60 Q 1850 180 1920 800 L 1920 60 Z" fill="#14183A" />
      {Array.from({ length: 30 }).map((_, i) => <circle key={i} cx={1300 + rnd(2, i) * 600} cy={100 + rnd(3, i) * 600} r={3} fill="#F2C86A" opacity={0.8} />)}
      <g transform={camT(900, 520, kf(t, [[0, 2.6], [len, 2.8]]))}>
        <Body look={COP} pose={{ ...basePose, x: 900, y: 700, yaw: 0.6, armR: { a: 130, b: -130 } }} t={t} f={f} words={W} talk={[line]} faces={[[0, 'neutral']]} seed={13} />
        <path d="M 850 470 Q 900 400 990 460" stroke="#14121C" strokeWidth={14} fill="none" />
        <rect x={970} y={480} width={34} height={50} rx={12} fill="#14121C" />
        <path d="M 990 525 Q 980 570 950 575" stroke="#14121C" strokeWidth={6} fill="none" />
      </g>
      <rect x={0} y={880} width={1920} height={200} fill="#1A1E2E" />
      {[0, 1, 2].map((i) => <rect key={i} x={200 + i * 260} y={920} width={200} height={110} rx={10} fill="#0A2A1A" stroke="#4AD06A" strokeWidth={4} />)}
    </g>
  );
};

// ---------------------------------------------------------------- S18: Biscuit finds you, sits, wags
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 30);
  const dx = 400 + (HX - 330 - 400) * easeOut(k);
  return (
    <g transform={camT(HX - 300, 680, kf(t, [[0, 1.5], [len, 1.65]]))}>
      <LibraryNight t={t + 200} mode="night" police={1} />
      <PoliceDog x={dx} y={GROUND + 30} s={1.0} t={t} sniff={k < 1 ? 1 : 0} sit={k >= 1 ? 1 : 0} wag={k >= 1 ? 2 : 0.5} run={k < 1 ? 1 : 0} />
      <Hedge x0={HX - 140} x1={2400} y0={HEDGE_Y0} y1={GROUND + 40} t={t} />
      <text x={HX - 500} y={420} fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={clamp((t - 20) / 6)}>{`0:${String(Math.min(40, Math.round(t * 0.6))).padStart(2, '0')}`}</text>
    </g>
  );
};

export const S19 = bigWord({ kicker: 'RULE FIVE LASTED', word: '8 MINUTES', color: '#FF4A3A', Bg: LIB, size: 200 });

// ---------------------------------------------------------------- S20: the officer parts the leaves: "Are you the one from the video?"
export const S20: React.FC<ShotProps> = ({ t, len, f }) => {
  const part = easeOut(clamp(t / 16));
  const line = span(W, 'Are', 'video');
  return (
    <g>
      <rect width={1920} height={1080} fill="#14183A" />
      <g transform={camT(960, 600, kf(t, [[0, 2.2], [len, 2.4]]))}>
        <Glow x={960} y={300} r={700} kind="cool" o={0.4} />
        <Body look={COP} pose={{ ...basePose, x: 960, y: 760, yaw: 0, tilt: 0, headTilt: 10, look: 0, armL: { a: 150, b: -40 }, armR: { a: 150, b: -40 } }} t={t} f={f} words={W} talk={[line]} faces={[[0, 'neutral'], [Math.round(len * 0.4), 'smug']]} seed={12} />
      </g>
      {Array.from({ length: 24 }).map((_, i) => {
        const side = i % 2 ? 1 : -1;
        const x0 = 960 + side * (60 + rnd(2, i) * 900);
        const x = x0 + side * part * 700;
        const y = rnd(5, i) * 1080;
        return <ellipse key={i} cx={x} cy={y} rx={180} ry={90} fill={i % 3 ? '#2E6A3A' : '#3A7A46'} stroke="#0B0816" strokeWidth={5} transform={`rotate(${rnd(7, i) * 180} ${x} ${y})`} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- S21: somewhere, Mo is still filming
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const m = standAt(250, 0.8, GROUND + 20);
  return (
    <g transform={camT(kf(t, [[0, 600], [len, 400]]), 600, 1.3)}>
      <LibraryNight t={t + 260} mode="night" police={1} />
      <Hedge x0={700} x1={2400} y0={HEDGE_Y0} y1={GROUND + 40} t={t} />
      <PoliceDog x={HX - 230} y={GROUND + 30} s={1.0} t={t} sit={1} wag={2} />
      <Body look={MO} pose={{ ...m, yaw: 0.5, armR: { a: 140, b: -60 }, armL: { a: 130, b: -50 } }} t={t} faces={[[0, 'smug']]} seed={2} shadow={1} />
      <g opacity={Math.floor(t / 12) % 2 ? 1 : 0.3}>
        <circle cx={m.x - 40} cy={m.y - 330} r={14} fill="#FF3A2E" />
        <text x={m.x - 15} y={m.y - 319} fontFamily={FONT.ui} fontSize={30} fill="#FF3A2E">REC</text>
      </g>
    </g>
  );
};
