import React from 'react';
import { Hero, Cat, AlarmClock, bedSit, BedDuvet, Rooftop } from '../../../engine';
import {
  YOU, MOM, ELLIE, ELLIE_PJ, YOU_PJ, Soft, Body, Bedroom, BEDROOM, Kitchen, KITCHEN, KitchenIsland, stand, Schematic, SCH, SchLabel,
  ShopStreet, PopWord, Big, bigWord, faceCU, NoZ, Juggle, Book, Pancakes, Juice, Teddy, Brain, CoatFigure, Wobble, OldPhoto, Glow,
  basePose, camT, clamp, kf, backOut, easeOut, idleBlink, FONT, UI, rnd, headAt, ShotProps, Pose,
} from '../common';

// Chapter 1, cold open: 3 a.m., the house asleep (mum, Ellie, the cat), everyone except you; the switch in your head;
// no yawn, nothing; not ever again; a superpower (8 free hours: homework, hobby, breakfast); the catch in three
// flashes (hour 19, day 3 shadows, day 11 record nobody may attempt); the title question.

const BED: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} clock="03:00" crossed={0} lamp={0} veil={0.6} duvet={false} />;
const BEDLIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} clock="03:00" crossed={0} lamp={1} veil={0.45} />;

/** A small time chip, top left. */
const Chip: React.FC<{ text: string; t: number }> = ({ text, t }) => (
  <g transform={`translate(190 110) scale(${backOut(clamp(t / 8))})`}>
    <rect x={-130} y={-44} width={260} height={88} rx={44} fill={UI.pill} opacity={0.9} />
    <text x={0} y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3">{text}</text>
  </g>
);

/** Asleep close-up: eyes shut, slow breathing, little z's. */
const sleepCU = (look: typeof YOU, Bg: React.FC<{ t: number; id?: string }>, extra?: (t: number) => React.ReactNode, scale = 1): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const br = Math.sin(t / 18) * 4;
    const pose: Pose = { ...basePose, x: 960, y: 720 + br, scale, yaw: 0.25, expr: 'neutral', blink: 1, headTilt: -14 + Math.sin(t / 30) * 2 };
    const h = headAt(pose);
    return (
      <g>
        <Soft blur={16} dim={0.35}>
          <g transform={camT(940, 520, 1.6)}>
            <Bg t={t + 200} />
          </g>
        </Soft>
        <g transform={camT(960, 540, kf(t, [[0, 2.9], [Math.max(1, len), 3.1]]))}>
          <ellipse cx={960} cy={760} rx={260} ry={70} fill="#F2EEE6" />
          <Hero look={look} pose={pose} shadow={0} />
          <path d={`M 640 ${790} Q 960 ${740 + br} 1280 ${790} L 1300 1100 L 620 1100 Z`} fill="#5A6AA8" stroke="#14121C" strokeWidth={5} />
          {extra?.(t)}
          {[0, 1, 2].map((i) => {
            const k = (t / 36 + i / 3) % 1;
            return <text key={i} x={h.x + 70 + i * 16} y={h.y - 70 - k * 90} fontFamily={FONT.title} fontWeight={800} fontSize={26 + i * 8} fill="#C8D8F0" opacity={Math.sin(k * Math.PI)}>z</text>;
          })}
        </g>
      </g>
    );
  };
  return Shot;
};

// ---------------------------------------------------------------- S1: the clock, 03:00
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.5}>
      <g transform={camT(940, 560, 1.6)}>
        <BED t={t + 100} />
      </g>
    </Soft>
    <g transform={`translate(960 600) scale(${kf(t, [[0, 2.2], [len, 2.5]])}) translate(-960 -600)`}>
      <Glow x={960} y={600} r={300} kind="red" o={0.5} />
      <AlarmClock x={960} y={640} text="03:00" on={Math.floor(t / 15) % 2 ? 1 : 0.85} />
    </g>
  </g>
);

// ---------------------------------------------------------------- S2: the street at night, every window dark
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 900]]), 560, 1.05)}>
    <ShopStreet t={t} mode="night" />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.25} />
  </g>
);

// ---------------------------------------------------------------- S3-S5: mum, Ellie, the cat
export const S3 = sleepCU(MOM, BED);
export const S4 = sleepCU(ELLIE_PJ, BED, (t) => <Teddy x={1130} y={800} s={0.9} rot={-12} />, 0.85);
export const S5: React.FC<ShotProps> = ({ t, len, f }) => (
  <g>
    <Soft blur={10} dim={0.35}>
      <g transform={camT(940, 600, 1.6)}>
        <BED t={t + 300} />
      </g>
    </Soft>
    <g transform={camT(960, 640, kf(t, [[0, 2.6], [len, 2.8]]))}>
      <ellipse cx={960} cy={700} rx={220} ry={60} fill="#7A4A6A" stroke="#14121C" strokeWidth={5} />
      <Cat x={960} y={680} mood="sleep" f={f} />
      {[0, 1].map((i) => {
        const k = (t / 30 + i / 2) % 1;
        return <text key={i} x={1040 + i * 14} y={600 - k * 70} fontFamily={FONT.title} fontWeight={800} fontSize={24 + i * 8} fill="#C8D8F0" opacity={Math.sin(k * Math.PI)}>z</text>;
      })}
    </g>
  </g>
);

// ---------------------------------------------------------------- S6: everyone except you: eyes wide open in the dark
export const S6 = faceCU({
  look: YOU_PJ, Bg: BED, faces: [[0, 'neutral']], yaw: 0.1, eyes: 0, zoom: [3.0, 3.6], dark: 0.3,
  light: { x: 1100, y: 420, kind: 'cool', o: 0.6 }, pose: { headTilt: 0 },
});

// ---------------------------------------------------------------- S7: something switches off in your head
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const off = clamp((t - 24) / 4);
  return (
    <g>
      <Schematic t={t} id="c1s7" />
      <Brain x={900} y={540} s={1.3} t={t} draw={t * 2} />
      <g transform="translate(1000 420)">
        <rect x={-60} y={-100} width={120} height={200} rx={20} fill="#14121C" stroke={SCH.line} strokeWidth={5} />
        <rect x={-40} y={-80 + off * 90} width={80} height={70} rx={12} fill={off > 0.5 ? '#FF5A4A' : '#5AE08A'} />
        <text x={0} y={150} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={off > 0.5 ? '#FF5A4A' : SCH.line}>{off > 0.5 ? 'SLEEP: OFF' : 'SLEEP: ON'}</text>
      </g>
      <SchLabel x={960} y={130} t={t - 2} text="LAST NIGHT" size={44} color={SCH.dim} />
    </g>
  );
};

// ---------------------------------------------------------------- S8: you lay down, closed your eyes, nothing happened
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.14);
  const shut = t > 10 && t < 40 ? 1 : 0;
  const me: Pose = { ...basePose, ...b, yaw: 0.25, tilt: -6, expr: 'neutral', blink: shut || idleBlink(t, 3), armL: { a: 20, b: -20 }, armR: { a: 20, b: -20 } };
  return (
    <g transform={camT(kf(t, [[0, 780], [len, 760]]), 560, kf(t, [[0, 1.55], [len, 1.7]]))}>
      <BED t={t + 120} />
      <Hero look={YOU_PJ} pose={me} shadow={0} />
      <BedDuvet />
      {t > 42 ? <NoZ x={me.x + 110} y={me.y - 260} t={t - 42} s={0.8} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- S9: no yawn, no heavy eyelids, nothing
export const S9 = faceCU({
  look: YOU_PJ, Bg: BED, faces: [[0, 'neutral'], [30, 'worried']], yaw: -0.2, eyes: 0.3, zoom: [3.3, 3.5], dark: 0.25,
  light: { x: 1100, y: 420, kind: 'cool', o: 0.5 },
  extra: (t) => (
    <g>
      <PopWord t={t} at={2} x={720} y={330} text="NO YAWN" size={60} fill="#F6EFE3" hold={200} />
      <PopWord t={t} at={18} x={1200} y={300} text="NO HEAVY EYES" size={54} fill="#F6EFE3" hold={200} rot={4} />
      <PopWord t={t} at={36} x={960} y={250} text="NOTHING." size={70} fill="#FFD23A" hold={200} />
    </g>
  ),
});

// ---------------------------------------------------------------- S10: you sit up, wide awake
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.14);
  const up = easeOut(clamp(t / 10));
  const me: Pose = { ...basePose, ...b, yaw: 0.35, tilt: -30 + 30 * up, expr: t > 12 ? 'happy' : 'neutral', blink: idleBlink(t, 5), armL: { a: 30, b: -40 }, armR: { a: 30 + 60 * up, b: -40 } };
  return (
    <g transform={camT(800, 560, kf(t, [[0, 1.75], [len, 1.9]]))}>
      <BEDLIT t={t + 160} />
      <Hero look={YOU_PJ} pose={me} shadow={0} />
      <BedDuvet />
    </g>
  );
};

// ---------------------------------------------------------------- S11: not tonight, not tomorrow, not ever again
export const S11 = bigWord({ kicker: 'NOT TONIGHT. NOT TOMORROW.', word: 'NOT EVER.', color: '#FFD23A', Bg: BED, size: 210 });

// ---------------------------------------------------------------- S12: a superpower: you stand on the bed, hero pose
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(BEDROOM, 0.5, 0.55);
  const k = backOut(clamp(t / 10));
  const me: Pose = { ...basePose, ...s, yaw: 0.1, expr: 'cool', squash: -0.08 * k, armL: { a: 150 * k, b: -10 }, armR: { a: 40, b: -90 * k }, glint: 0.8, glintColor: '#FFD23A' };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <BEDLIT t={t + 200} />
      <Glow x={s.x} y={s.y - 150} r={400} kind="warm" o={0.6 * k} />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M ${s.x} ${s.y - 150} L ${s.x + Math.cos(i / 1.9) * 700} ${s.y - 150 + Math.sin(i / 1.9) * 700}`} stroke="#FFD23A" strokeWidth={10} opacity={0.12 * k} />
      ))}
      <Hero look={YOU_PJ} pose={me} shadow={1} />
    </g>
  );
};

// ---------------------------------------------------------------- S13: eight free hours: the clock face lights up 8 hours
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 6) / 30));
  const a0 = -90 + 330; // 23:00 on a 24 h dial -> start at the 11 o'clock of night
  const wedge = (p: number) => {
    const r = 260;
    const a1 = ((a0 - 120 + 0) * Math.PI) / 180;
    const a2 = ((a0 - 120 + 120 * p) * Math.PI) / 180;
    return `M 0 0 L ${Math.cos(a1) * r} ${Math.sin(a1) * r} A ${r} ${r} 0 0 1 ${Math.cos(a2) * r} ${Math.sin(a2) * r} Z`;
  };
  return (
    <g>
      <Schematic t={t} id="c1s13" />
      <g transform="translate(960 560)">
        <circle r={300} fill="none" stroke={SCH.line} strokeWidth={6} />
        {Array.from({ length: 24 }).map((_, i) => (
          <path key={i} d={`M ${Math.cos((i / 24) * Math.PI * 2) * 280} ${Math.sin((i / 24) * Math.PI * 2) * 280} L ${Math.cos((i / 24) * Math.PI * 2) * 300} ${Math.sin((i / 24) * Math.PI * 2) * 300}`} stroke={SCH.line} strokeWidth={4} />
        ))}
        <path d={wedge(k)} fill="#FFD23A" opacity={0.85} />
        <circle r={14} fill={SCH.line} />
      </g>
      <g transform={`translate(1560 540) scale(${backOut(clamp((t - 30) / 9))})`}>
        <Big x={0} y={40} size={150} fill="#FFD23A">+8 h</Big>
        <text x={0} y={120} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={SCH.line}>EVERY NIGHT</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S14: homework done by midnight
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(BEDROOM, 0.62, 0.5);
  const me: Pose = { ...basePose, ...s, yaw: -0.3, expr: 'smug', blink: idleBlink(t, 2), armL: { a: 60, b: -70 }, armR: { a: 60, b: -70 } };
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1100], [len, 1060]]), 560, 1.8)}>
        <BEDLIT t={t + 240} />
        <Hero look={YOU_PJ} pose={me} shadow={1} />
        <Book x={s.x - 10} y={s.y - 40 * s.scale} s={0.7 * s.scale} />
      </g>
      <Chip text="00:00" t={t} />
    </g>
  );
};

// ---------------------------------------------------------------- S15: a new hobby by two: juggling
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(BEDROOM, 0.55, 0.55);
  const me: Pose = { ...basePose, ...s, yaw: 0, expr: 'happy', blink: idleBlink(t, 4), look: Math.sin(t / 9) * 0.5, armL: { a: 50 + Math.sin(t / 4.5) * 20, b: -80 }, armR: { a: 50 - Math.sin(t / 4.5) * 20, b: -80 } };
  return (
    <g>
      <g transform={camT(s.x, 520, kf(t, [[0, 1.7], [len, 1.85]]))}>
        <BEDLIT t={t + 280} />
        <Hero look={YOU_PJ} pose={me} shadow={1} />
        <Juggle x={s.x} y={s.y - 200 * s.scale} t={t} s={s.scale * 0.9} />
      </g>
      <Chip text="02:00" t={t} />
    </g>
  );
};

// ---------------------------------------------------------------- S16: breakfast for the whole family by six
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(KITCHEN, 0.5, 0.4);
  const me: Pose = { ...basePose, ...s, yaw: 0, expr: 'happy', blink: idleBlink(t, 6), armL: { a: 40, b: -60 }, armR: { a: 130, b: -20 } };
  return (
    <g>
      <g transform={camT(960, 600, kf(t, [[0, 1.5], [len, 1.62]]))}>
        <Kitchen t={t + 100} />
        <Hero look={YOU_PJ} pose={me} shadow={0} />
        <KitchenIsland />
        <Pancakes x={820} y={760} s={0.8} />
        <Pancakes x={1100} y={760} s={0.7} n={4} />
        <Juice x={960} y={770} s={0.9} />
        <Juice x={1230} y={770} s={0.9} />
      </g>
      <Chip text="06:00" t={t} />
    </g>
  );
};

// ---------------------------------------------------------------- S17: but your body keeps its own clock
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="c1s17" />
    <g transform={`translate(960 540) scale(${1 + 0.02 * Math.sin(t / 3)})`}>
      <circle r={280} fill="none" stroke="#FF5A4A" strokeWidth={8} />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M ${Math.cos((i / 12) * Math.PI * 2) * 240} ${Math.sin((i / 12) * Math.PI * 2) * 240} L ${Math.cos((i / 12) * Math.PI * 2) * 270} ${Math.sin((i / 12) * Math.PI * 2) * 270}`} stroke="#FF5A4A" strokeWidth={6} />
      ))}
      <path d={`M 0 0 L ${Math.cos((t / 4) * 0.105 - Math.PI / 2) * 220} ${Math.sin((t / 4) * 0.105 - Math.PI / 2) * 220}`} stroke="#F6EFE3" strokeWidth={8} strokeLinecap="round" />
      <path d="M 0 0 L 0 -150" stroke="#F6EFE3" strokeWidth={12} strokeLinecap="round" transform={`rotate(${t * 0.5})`} />
      <circle r={16} fill="#F6EFE3" />
    </g>
    <SchLabel x={960} y={940} t={t - 6} text="TICK. TICK. TICK." size={44} color="#FF5A4A" />
  </g>
);

// ---------------------------------------------------------------- S18: hour 19: your brain like a few drinks (woozy)
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <Wobble id="c1s18" t={t} amp={0.5}>
    {faceCU({ look: YOU, Bg: ({ t, id }) => <ShopStreet t={t} id={id} />, faces: [[0, 'dizzy']], yaw: 0.2, zoom: [3.0, 3.2], pose: { headTilt: Math.sin(t / 8) * 10 },
      extra: (tt) => <PopWord t={tt} at={4} x={960} y={240} text="HOUR 19" size={90} fill="#FFD23A" hold={300} /> })({ t, len, f: 0 })}
  </Wobble>
);

// ---------------------------------------------------------------- S19: day 3: the shadows in the hallway start to move
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const door = BEDROOM.P(0, 0.6, 0.64);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 700], [len, 640]]), 600, kf(t, [[0, 1.8], [len, 2.1]]))}>
        <Wobble id="c1s19" t={t} amp={0.6}>
          <BED t={t + 400} />
        </Wobble>
        <g transform={`translate(${430 + Math.sin(t / 10) * 20} 470)`}>
          <CoatFigure x={0} y={0} s={0.9} who={clamp(t / 20)} t={t} />
        </g>
      </g>
      <PopWord t={t} at={4} x={1400} y={240} text="DAY 3" size={90} fill="#FF7A6A" hold={300} />
    </g>
  );
};

// ---------------------------------------------------------------- S20: day 11: a world record nobody may attempt
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const st = backOut(clamp((t - 24) / 8));
  return (
    <g>
      <rect width={1920} height={1080} fill="#14102A" />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={-200 + i * 160 + ((t * 2) % 160)} y={-100} width={60} height={1300} fill="#FFFFFF" opacity={0.03} transform="rotate(20 960 540)" />
      ))}
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.08]])})`}>
        {/* a trophy */}
        <g transform="translate(0 40)">
          <path d="M -120 -220 L 120 -220 L 90 -40 Q 0 20 -90 -40 Z" fill="#FFD23A" stroke="#14121C" strokeWidth={7} />
          <path d="M -120 -190 Q -210 -180 -170 -100 Q -140 -60 -96 -70" fill="none" stroke="#14121C" strokeWidth={14} />
          <path d="M -120 -190 Q -210 -180 -170 -100 Q -140 -60 -96 -70" fill="none" stroke="#FFD23A" strokeWidth={7} />
          <path d="M 120 -190 Q 210 -180 170 -100 Q 140 -60 96 -70" fill="none" stroke="#14121C" strokeWidth={14} />
          <path d="M 120 -190 Q 210 -180 170 -100 Q 140 -60 96 -70" fill="none" stroke="#FFD23A" strokeWidth={7} />
          <rect x={-24} y={-30} width={48} height={90} fill="#E0B020" stroke="#14121C" strokeWidth={6} />
          <rect x={-110} y={60} width={220} height={50} rx={6} fill="#5A4A3E" stroke="#14121C" strokeWidth={6} />
          <text x={0} y={-120} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#14121C">11</text>
        </g>
        <text x={0} y={-260} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#F6EFE3">DAY 11: WORLD RECORD</text>
        <g transform={`rotate(-12) scale(${st})`} opacity={st > 0 ? 1 : 0}>
          <rect x={-330} y={110} width={660} height={120} rx={14} fill="none" stroke="#FF3A2E" strokeWidth={12} />
          <text x={0} y={195} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#FF3A2E">NOT ALLOWED</text>
        </g>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S21: the title: on the roof at night, the city asleep
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 960, y: 820 - 196 * 0.8, scale: 0.8, yaw: 0, expr: 'neutral', blink: idleBlink(t, 7), look: 0, armL: { a: 12, b: -8 }, armR: { a: 12, b: -8 } };
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  return (
    <g>
      <g transform={camT(960, kf(t, [[0, 600], [len, 560]]), kf(t, [[0, 1.0], [len, 1.1]]))}>
        <Rooftop t={t + 300} sunY={1200} lightsOut={1} cityLit={0.3} />
        <rect x={-400} y={-400} width={2800} height={1900} fill="#05081A" opacity={0.45} />
        <Hero look={YOU_PJ} pose={me} shadow={1} />
      </g>
      <g transform={`translate(960 250) scale(${pop(4)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">WHAT IF YOU</text>
      </g>
      <g transform={`translate(960 400) scale(${pop(10)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={130} fill="#FFD23A" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">NEVER SLEPT AGAIN?</text>
      </g>
    </g>
  );
};
