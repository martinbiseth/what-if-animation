import React from 'react';
import { Hero, Rooftop, Classroom, SchoolDesk } from '../../../engine';
import {
  YOU, YOU_PJ, MO, MOM, ELLIE_PJ, Soft, Body, Bedroom, BEDROOM, Kitchen, KITCHEN, KitchenIsland, stand, Schematic, SCH, SchLabel,
  ShopStreet, standAt, GROUND, PopWord, Big, faceCU, hourCard, Juggle, Guitar, Book, Pancakes, Juice, Dog, Lead, Teddy, Brain, Bubble, handAt,
  Glow, basePose, camT, clamp, kf, backOut, easeOut, easeInOut, idleBlink, FONT, UI, rnd, phrase, ShotProps, Pose, Word,
} from '../common';
import { PoliceDog } from '../../gta-24-hours/common';
import words from './words.json';

// Chapter 3, eight free hours: night one (homework, next week's, the room by colour; juggling at 2; guitar at 3; a
// book at 4 and the sunrise from the roof); the maths (a third of a life, 25 years back); 6 a.m. breakfast and mum's
// "What did you break?"; school (hand up, friends yawning, third apple); night two the dog-walking business, Pickle;
// Ellie at 4 a.m.: "That's so cool"; a day and a half; something the brain does at night.

const W = words as Word[];
const BRL: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} clock="00:00" crossed={0} lamp={1} veil={0.42} />;
const KIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} />;
const CLS: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Classroom t={t} id={id} />;
const STN: React.FC<{ t: number; id?: string }> = ({ t, id }) => <ShopStreet t={t} id={id} mode="night" />;

const Chip: React.FC<{ text: string; t: number }> = ({ text, t }) => (
  <g transform={`translate(190 110) scale(${backOut(clamp(t / 8))})`}>
    <rect x={-130} y={-44} width={260} height={88} rx={44} fill={UI.pill} opacity={0.9} />
    <text x={0} y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3">{text}</text>
  </g>
);

export const S1 = hourCard({ big: 'NIGHT 1', kicker: 'EIGHT HOURS OF SILENCE', Bg: BRL });

// ---------------------------------------------------------------- S2: homework by midnight, then next week's
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(BEDROOM, 0.6, 0.5);
  const me: Pose = { ...basePose, ...s, yaw: -0.2, expr: 'smug', blink: idleBlink(t, 2), armL: { a: 40, b: -60 }, armR: { a: 60 + 30 * Math.sin(t / 3), b: -60 } };
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1080], [len, 1040]]), 580, 1.75)}>
        <BRL t={t + 240} />
        <Hero look={YOU_PJ} pose={me} shadow={1} />
        {Array.from({ length: 10 }).map((_, i) => {
          const k = ((t * 1.2 + i * 9) % 60) / 60;
          return (
            <g key={i} transform={`translate(${s.x + 80 + k * 400} ${s.y - 140 - Math.sin(k * Math.PI) * 220 + k * 300}) rotate(${k * 300 + i * 30})`} opacity={1 - k * 0.6}>
              <rect x={-40} y={-50} width={80} height={100} fill="#F6EFE3" stroke="#14121C" strokeWidth={3} />
              <path d="M -24 -20 L 24 -20 M -24 0 L 24 0 M -24 20 L 10 20" stroke="#9A948A" strokeWidth={4} />
              <path d="M 10 30 l 10 10 l 20 -24" stroke="#3AB06A" strokeWidth={6} fill="none" />
            </g>
          );
        })}
      </g>
      <Chip text="00:00" t={t} />
      <PopWord t={t} at={Math.round(phrase(W, 'next week')[0] * 30) - Math.round(phrase(W, 'You finish all')[0] * 30)} x={1350} y={260} text="+ NEXT WEEK'S" size={64} fill="#FFD23A" hold={300} />
    </g>
  );
};

// ---------------------------------------------------------------- S3: the whole room, sorted by colour
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const cols = ['#E8453A', '#F28C3A', '#E9C46A', '#5AB06A', '#4A9AC8', '#7A5AC8', '#C87ED8'];
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <BRL t={t + 300} />
      {/* a rainbow shelf of things over the dresser */}
      {cols.map((c, i) => {
        const k = backOut(clamp((t - i * 3) / 8));
        return (
          <g key={i} transform={`translate(${620 + i * 100} ${560}) scale(${k})`}>
            <rect x={-40} y={-120} width={80} height={120} rx={8} fill={c} stroke="#14121C" strokeWidth={4} />
            <rect x={-40} y={10} width={80} height={60} rx={8} fill={c} stroke="#14121C" strokeWidth={4} opacity={0.8} />
          </g>
        );
      })}
      <PopWord t={t} at={20} x={960} y={330} text="BY COLOUR" size={70} fill="#F6EFE3" hold={300} />
    </g>
  );
};

// ---------------------------------------------------------------- S4: 2 a.m. juggling, badly
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(BEDROOM, 0.55, 0.55);
  const drop = clamp((t - 30) / 8);
  const me: Pose = { ...basePose, ...s, yaw: 0, expr: drop > 0.5 ? 'oops' : 'happy', blink: idleBlink(t, 4), look: Math.sin(t / 9) * 0.5, armL: { a: 50 + Math.sin(t / 4.5) * 20, b: -80 }, armR: { a: 50 - Math.sin(t / 4.5) * 20, b: -80 } };
  return (
    <g>
      <g transform={camT(s.x, 520, kf(t, [[0, 1.7], [len, 1.85]]))}>
        <BRL t={t + 280} />
        <Hero look={YOU_PJ} pose={me} shadow={1} />
        <Juggle x={s.x} y={s.y - 200 * s.scale} t={t} s={s.scale * 0.9} drop={drop} />
      </g>
      <Chip text="02:00" t={t} />
    </g>
  );
};

// ---------------------------------------------------------------- S5: 3 a.m. guitar, volume all the way down
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(BEDROOM, 0.5, 0.5);
  const me: Pose = { ...basePose, ...s, yaw: 0.2, expr: 'cool', blink: idleBlink(t, 6), armL: { a: 70, b: -90 }, armR: { a: 40 + Math.sin(t * 1.3) * 10, b: -70 } };
  return (
    <g>
      <g transform={camT(s.x, 540, kf(t, [[0, 2.0], [len, 2.15]]))}>
        <BRL t={t + 320} />
        <Hero look={YOU_PJ} pose={me} shadow={1} />
        <Guitar x={s.x + 10} y={s.y - 70 * s.scale} s={s.scale * 0.8} rot={-20} />
        {[0, 1, 2].map((i) => {
          const k = ((t / 24 + i / 3) % 1);
          return <text key={i} x={s.x + 120 + i * 30} y={s.y - 220 - k * 90} fontSize={40} fill="#F6EFE3" opacity={0.35 * Math.sin(k * Math.PI)}>♪</text>;
        })}
      </g>
      <Chip text="03:00" t={t} />
      <g transform="translate(1700 980)">
        <rect x={-150} y={-40} width={300} height={70} rx={35} fill={UI.pill} />
        <text x={-110} y={10} fontFamily={FONT.ui} fontSize={32} fill="#F6EFE3">VOL</text>
        <rect x={-30} y={-8} width={150} height={12} rx={6} fill="#4A4A5A" />
        <rect x={-30} y={-8} width={10} height={12} rx={6} fill="#FFD23A" />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S6: 4 a.m. a whole book, then another
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const b = BEDROOM.P(0.7, 1, 0.55);
  const me: Pose = { ...basePose, x: b.x, y: b.y - 130, scale: 0.95, yaw: 0.3, legL: { a: 80, b: -80 }, legR: { a: 76, b: -84 }, armL: { a: 50, b: -80 }, armR: { a: 50, b: -80 }, expr: 'happy', blink: idleBlink(t, 3), look: 0.3 };
  return (
    <g>
      <g transform={camT(b.x - 40, 600, kf(t, [[0, 1.9], [len, 2.05]]))}>
        <BRL t={t + 360} />
        <ellipse cx={b.x} cy={b.y - 40} rx={170} ry={80} fill="#C86A3A" stroke="#14121C" strokeWidth={5} />
        <Hero look={YOU_PJ} pose={me} shadow={0} />
        <Book x={b.x + 40} y={b.y - 210} s={0.7} c="#C84A4A" />
        {[0, 1, 2].map((i) => <rect key={i} x={b.x - 260} y={b.y - 30 - i * 30} width={110} height={26} fill={['#4A7AA0', '#5AB06A', '#E9C46A'][i]} stroke="#14121C" strokeWidth={3} />)}
      </g>
      <Chip text="04:00" t={t} />
    </g>
  );
};

// ---------------------------------------------------------------- S7: the sunrise from the roof, just for you
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 960, y: 790, scale: 0.75, yaw: 0, legL: { a: 80, b: -80 }, legR: { a: 76, b: -84 }, armL: { a: 30, b: -20 }, armR: { a: 30, b: -20 }, expr: 'happy', blink: idleBlink(t, 8) };
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.05], [len, 1.15]]))}>
      <Rooftop t={t + 500} sunY={kf(t, [[0, 760], [len, 600]])} />
      <Hero look={YOU_PJ} pose={me} shadow={1} />
    </g>
  );
};

// ---------------------------------------------------------------- S8: the maths: a third of your life, 25 years back
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 10) / 30));
  const back = clamp((t - 60) / 20);
  return (
    <g>
      <Schematic t={t} id="c3s8" />
      <SchLabel x={960} y={200} t={t - 2} text="ONE LIFETIME" size={44} color={SCH.dim} />
      <g transform="translate(260 480)">
        <rect x={0} y={0} width={1400} height={120} rx={16} fill="none" stroke={SCH.line} strokeWidth={6} />
        <rect x={6} y={6} width={(1400 / 3 - 12) * k} height={108} rx={12} fill={back > 0.5 ? '#FFD23A' : '#4A6AA8'} />
        <text x={233} y={80} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3" opacity={k}>{back > 0.5 ? 'YOURS NOW' : 'ASLEEP'}</text>
        <text x={933} y={80} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={SCH.line}>AWAKE</text>
      </g>
      <g transform={`translate(960 800) scale(${backOut(clamp((t - 30) / 9))})`}>
        <Big x={0} y={40} size={140} fill="#FFD23A">25+ YEARS</Big>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S9: 6 a.m. mum walks into breakfast
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const me = stand(KITCHEN, 0.55, 0.4);
  const mx = kf(t, [[0, 200], [30, 560]], easeOut);
  const mumIn: Pose = standAt(mx, 1.05, 990, { yaw: 0.6, legL: { a: Math.sin(t / 3) * 20 * (t < 30 ? 1 : 0), b: 0 }, legR: { a: -Math.sin(t / 3) * 20 * (t < 30 ? 1 : 0), b: 0 } });
  return (
    <g>
      <g transform={camT(960, 600, kf(t, [[0, 1.45], [len, 1.55]]))}>
        <KIT t={t + 140} />
        <Body look={YOU} pose={{ ...basePose, ...me, yaw: -0.3, armL: { a: 30, b: -40 }, armR: { a: 120, b: -20 } }} t={t} faces={[[0, 'happy']]} seed={3} />
        <KitchenIsland />
        <Pancakes x={840} y={760} s={0.8} />
        <Juice x={1000} y={770} s={0.9} />
        <Pancakes x={1130} y={760} s={0.7} n={4} />
        <Body look={MOM} pose={mumIn} t={t} faces={[[0, 'tired'], [40, 'shock']]} seed={9} shadow={1} />
      </g>
      <Chip text="06:00" t={t} />
    </g>
  );
};

// ---------------------------------------------------------------- S10: mum: "What did you break?"
export const S10 = faceCU({
  look: MOM, Bg: KIT, faces: [[0, 'shock'], [30, 'worried']], yaw: 0.35, zoom: [3.0, 3.3], words: W, talk: phrase(W, 'What did you break'),
  extra: (t) => <Bubble x={1220} y={330} text="What did you break?" t={t} at={Math.max(0, Math.round((phrase(W, 'What did you break')[0] - phrase(W, 'She looks at you')[0]) * 30))} size={40} />,
});

// ---------------------------------------------------------------- S11: school: first one there, hand already up
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1200], [len, 1180]]), 600, kf(t, [[0, 1.6], [len, 1.7]]))}>
    <CLS t={t + 100} />
    <Body look={YOU} pose={{ ...basePose, x: 1260, y: 700, scale: 0.9, yaw: -0.35, armL: { a: 145 + Math.sin(t / 4) * 4, b: -10 }, armR: { a: 14, b: -10 } }} t={t} faces={[[0, 'happy']]} seed={4} shadow={0} />
    <SchoolDesk x={1260} />
  </g>
);

// ---------------------------------------------------------------- S12: friends yawning into lunch; you, third apple, photosynthesis
export const S12: React.FC<ShotProps> = ({ t, len, f }) => {
  const yawn = Math.max(0, Math.sin(t / 10));
  const a = standAt(760, 1, GROUND, { yaw: 0.4, armL: { a: 40, b: -90 }, armR: { a: 90 + 20 * Math.sin(t / 5), b: -40 } });
  const m = standAt(1160, 1, GROUND, { yaw: -0.4, armL: { a: 150 * yawn, b: -30 }, headTilt: -10 * yawn });
  const h = handAt(a, 'L');
  return (
    <g transform={camT(960, 640, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <ShopStreet t={t + 200} />
      <Body look={YOU} pose={a} t={t} faces={[[0, 'happy']]} seed={2} shadow={1} />
      <circle cx={h.x} cy={h.y - 10} r={26} fill="#D84A3A" stroke="#14121C" strokeWidth={4} />
      <Hero look={MO} pose={{ ...m, expr: 'tired', blink: yawn > 0.5 ? 1 : 0, talk: yawn }} shadow={1} />
      <PopWord t={t} at={8} x={1250} y={360} text="*YAWN*" size={56} fill="#C8D8F0" hold={300} />
      <PopWord t={t} at={40} x={640} y={380} text="PHOTOSYNTHESIS!" size={50} fill="#5AE08A" hold={300} />
      <Chip text="APPLE #3" t={t - 20} />
    </g>
  );
};

// ---------------------------------------------------------------- S13: night two: the midnight dog walking business, Pickle walks you
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[0, 500], [len, 1500]]);
  const me = standAt(cx, 1, GROUND, { yaw: 0.5, tilt: 14, legL: { a: Math.sin(t / 2.4) * 30, b: -10 }, legR: { a: -Math.sin(t / 2.4) * 30, b: -10 }, armR: { a: 80, b: -10 }, armL: { a: 60, b: -10 } });
  const hand = handAt(me, 'R');
  const dogs = [0, 1, 2, 3].map((i) => ({ x: cx + 180 + i * 85, y: GROUND - 10 + (i % 2) * 20 }));
  return (
    <g>
      <g transform={camT(cx + 300, 640, 1.2)}>
        <ShopStreet t={t + 300} mode="night" />
        {dogs.map((d, i) => <Lead key={i} from={hand} to={{ x: d.x - 30, y: d.y - 50 }} c={['#E8453A', '#4A9AC8', '#E9C46A', '#5AB06A'][i]} />)}
        {dogs.map((d, i) => <PoliceDog key={i} x={d.x} y={d.y} s={0.4 + rnd(9, i) * 0.12} t={t + i * 7} harness={false} run={1} fur={['#C8A06A', '#5A4A3E', '#E9E2D2', '#8A6A4A'][i]} />)}
        {/* Pickle the Great Dane, out front, pulling */}
        <Lead from={hand} to={{ x: cx + 560, y: GROUND - 150 }} c="#C87ED8" />
        <PoliceDog x={cx + 600} y={GROUND} s={0.95} t={t} harness={false} run={1} fur="#7A7E8A" />
        <Body look={YOU} pose={me} t={t} faces={[[0, 'worried']]} seed={2} shadow={1} />
        <PopWord t={t} at={50} x={cx + 600} y={GROUND - 380} text="PICKLE" size={56} fill="#C87ED8" hold={300} />
      </g>
      <Chip text="00:00" t={t} />
    </g>
  );
};

// ---------------------------------------------------------------- S14: Ellie at 4 a.m.: "You don't sleep anymore... That's so cool."
export const S14: React.FC<ShotProps> = ({ t, len, f }) => {
  const sp = phrase(W, "don't sleep anymore");
  const sp2 = phrase(W, "That's so cool");
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), 600, kf(t, [[0, 1.9], [len, 2.1]]))}>
      <Bedroom t={t + 600} clock="04:00" crossed={0} lamp={0.3} veil={0.6} />
      <Body look={YOU} pose={standAt(1060, 0.95, 960, { yaw: -0.5, armR: { a: 20, b: -10 }, armL: { a: 30, b: -20 } })} t={t} faces={[[0, 'oops'], [50, 'happy']]} seed={2} shadow={1} />
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={1000} cy={760 + i * 8} r={30 + i * 4} fill="none" stroke={['#E8453A', '#4A9AC8', '#E9C46A', '#5AB06A', '#C87ED8'][i]} strokeWidth={5} opacity={0.9} />)}
      <Body look={ELLIE_PJ} pose={standAt(800, 0.7, 960, { yaw: 0.5, armL: { a: 30, b: -60 } })} t={t} faces={[[0, 'shock'], [40, 'happy']]} seed={8} shadow={1} words={W} f={f} talk={[sp, sp2]} />
      <Teddy x={760} y={900} s={0.5} rot={-10} />
    </g>
  );
};

// ---------------------------------------------------------------- S15: and for a day and a half, it is
export const S15 = faceCU({ look: YOU, Bg: ({ t, id }) => <Rooftop t={t} sunY={640} />, faces: [[0, 'cool']], yaw: 0.2, zoom: [2.8, 3.0], light: { x: 1200, y: 400, kind: 'warm', o: 0.7 } });

// ---------------------------------------------------------------- S16: something your brain does every night... that you stopped doing
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Schematic t={t} id="c3s16" />
    <Brain x={960} y={540} s={1.3} t={t} draw={t * 2} dirt={clamp(t / 30)} color={kf(t, [[0, 1], [len, 1]]) ? SCH.line : SCH.line} />
    <g transform={`translate(1450 360) scale(${backOut(clamp((t - 40) / 9))})`}>
      <Big x={0} y={40} size={180} fill="#FF5A4A">?</Big>
    </g>
  </g>
);
