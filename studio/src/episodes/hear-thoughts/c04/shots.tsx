import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, FONT, SUBURB, stand, CLS, Bedroom, BedDuvet, bedSit, WINDOW, BusCabFront, busHip,
  THINK, ThoughtBubble, factCard, hallHip, Football,
} from '../../../engine';
import words from './words.json';
import tl from './timeline.json';
import {
  YOU, MO, MUM, ELLIE, TEACHER, DRIVER, ARTGIRL, COACH, BABYMUM, N1, N2, N3, N4, N5, N6, KID, SHOPMAN, StreetSet, ClassSet, CabSet, HallSet, BedroomSet,
  faceCU, thinkCard, bigWord, thoughtCU, sayThink, people, at, scene, noise, ThoughtField, cueIn, span, Soft,
} from '../common';

// Chapter 4, the catch: the shopping centre, everyone at once; a stadium of different songs; you can't hear your
// mum's real voice. 6,200 thoughts a day (Queen's, 2020); minds wander almost half the time (Harvard, 2010); the
// teacher's rent, the driver's old argument; 6 in 10 lie in ten minutes (UMass, 2002); say vs think; what people
// think about you (art, coach, Mo at the sleepover); no sleep, the street hums, you can never stop listening.

const c = (shot: string, w: string, n = 1) => cueIn(words, tl, shot, w, n);
const MALL = HallSet('mall');
const CLASS = ClassSet(0);
const NIGHT = StreetSet('night', { lit: 0.7, cars: false });
const DAY = StreetSet('day');
const DARK = BedroomSet({ veil: 0.75, clock: '02:14', lamp: 0 });

export const S1 = thinkCard({ kicker: 'CHAPTER 4', title: 'THE CATCH', seed: 12 });

// ---------- S2: the shopping centre: one thought after another, popping over the crowd on the line ----------
const MALLFOLK = [N1, N2, N3, N4, N5, N6, KID, SHOPMAN];
export const S2: React.FC<ShotProps> = (p) => {
  const lines: [string, string][] = [['Where', 'Where did I park?'], ['Is', 'Is that a spot on my face?'], ['Ninety', '$99 for a JACKET?'], ["I'm", "I'm so hungry."], ["I'm#2", "I'm so tired."]];
  const ks = lines.map(([w]) => (w.includes('#') ? c('S2', w.split('#')[0], 2) : c('S2', w)));
  return scene({
    Set: MALL, cam: [960, 520, 1.0], to: [960, 500, 1.1], setT: 300,
    cast: MALLFOLK.map((look, i) => {
      const li = ({ 0: 0, 2: 1, 4: 2, 6: 3, 1: 4 } as Record<number, number>)[i];
      return {
        look, pose: { x: 120 + i * 240, y: hallHip(i === 6 ? 0.8 : 1), scale: i === 6 ? 0.8 : 1, yaw: i % 2 ? -0.3 : 0.3 },
        waves: 0.7, think: li !== undefined ? { th: [[ks[li], lines[li][1]]] as [number, string][], s: 0.55, wrap: 14 } : undefined,
      };
    }),
  })(p);
};

// ---------- S3: a stadium where everyone shouts a different song: clouds everywhere, the camera shaking ----------
const SONGS = ['♪ la la la ♪', 'MILK', '♪ dum dum ♪', 'where is he', 'SALE?!', 'ugh', '♪ na na ♪', 'my feet', 'TOILET', 'rent!', 'so loud'];
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(${Math.sin(t * 2.7) * 6} ${Math.cos(t * 2.1) * 6})`}>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <ThoughtField t={t * 3} n={10} seed={2} />
      {SONGS.map((s, i) => {
        const x = 140 + ((i * 397) % 1700), y = 200 + ((i * 211) % 700);
        return t > i * 3 ? <ThoughtBubble key={i} x={x} y={y + 120} text={s} s={0.7 + (i % 3) * 0.15} pop={(t - i * 3) / 6} t={t} tail={false} side={0} loud={i % 3 === 0 ? 0.6 : 0} seed={i} /> : null;
      })}
    </g>
  </g>
);

// ---------- S4: you grab mum's arm; her mouth moves, but you can't hear her ----------
export const S4 = scene({
  Set: MALL, cam: [960, 470, 1.7], to: [960, 470, 1.8], setT: 360, words, talk: { 0: [[13.4, 16.2]] }, shake: () => 2,
  cast: [
    { look: MUM, pose: { x: 1120, y: hallHip(1), yaw: -0.4 }, faces: [[0, 'worried']] },
    { look: YOU, pose: { x: 860, y: hallHip(1), yaw: 0.4, armR: { a: 70, b: -10 } }, faces: [[0, 'shock']] },
    { look: ELLIE, pose: { x: 1340, y: hallHip(0.8), scale: 0.8, yaw: -0.3 }, faces: [[0, 'neutral']], waves: 0.7 },
  ],
  over: (t) => (
    <g opacity={0.8}>
      {['bins', 'LATE', 'pizza?', 'WHO', 'socks', 'my phone'].map((s, i) => (
        <ThoughtBubble key={i} x={200 + i * 300} y={330 + (i % 2) * 120} text={s} s={0.5} pop={(t - i * 4) / 6} t={t} tail={false} side={0} seed={i} />
      ))}
    </g>
  ),
});

// ---------- S5: 6,200 thoughts a day ----------
export const S5 = factCard({ value: 6200, label: 'SEPARATE THOUGHTS, PER PERSON, PER DAY', sub: "Tseng & Poppenk, Queen's University, 2020" });

// ---------- S6: a busy shopping centre: millions ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <MALL t={t + 500} id="s6" />
      {Array.from({ length: 14 }).map((_, i) => (
        <Hero key={i} look={MALLFOLK[i % 8]} pose={{ ...basePose, x: 60 + i * 140, y: hallHip(0.7) + 40, scale: 0.7, yaw: i % 2 ? -0.3 : 0.3, expr: 'neutral', blink: 0 }} />
      ))}
      <g opacity={clamp((t - 20) / 20)}><ThoughtField t={t * 2} n={22} bg={false} seed={4} blur={false} /></g>
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={clamp((t - c('S6', 'millions') + 6) / 10) * 0.45} />
    <g transform={`translate(960 600) scale(${backOut(clamp((t - c('S6', 'millions')) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={180} fill={THINK.glow} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">MILLIONS</text>
      <text y={90} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3">OF THOUGHTS. AROUND YOU.</text>
    </g>
  </g>
);

// ---------- S7: minds wander almost half the time ----------
export const S7 = factCard({ value: 46.9, suffix: '%', format: (v) => v.toFixed(1), label: 'OF THE TIME, OUR MINDS ARE SOMEWHERE ELSE', sub: 'Killingsworth & Gilbert, Harvard, Science 2010' });

// ---------- S8: the teacher, explaining fractions, thinking about her rent ----------
const T = stand(CLS, 0.3, 0.3);
export const S8 = scene({
  Set: CLASS, cam: [T.x + 200, T.y - 220, 1.55], to: [T.x + 200, T.y - 230, 1.65], setT: 500, words, talk: { 0: [[37.2, 41.0]] },
  cast: [{ look: TEACHER, pose: { x: T.x, y: T.y, scale: T.scale, yaw: 0.4, armL: { a: 120, b: -20 } }, faces: [[0, 'happy']], think: { th: [[c('S8', 'thinking'), 'rent... rent is due... RENT']], s: 0.75, side: 0.6, wrap: 14 } }],
});

// ---------- S9: the driver, replaying an old argument ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(800, 470, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <CabSet t={t + 200} id="s9" />
    {people(t, [{ look: DRIVER, pose: { x: 700, y: 720, yaw: 0.35, armL: { a: 50, b: -70 }, armR: { a: 50, b: -70 } }, faces: [[0, 'cool']], think: { th: [[c('S9', 'replaying'), "...and ANOTHER thing, Gary..."]], s: 0.95, wrap: 18 } }])}
    <BusCabFront />
  </g>
);

// ---------- S10: six in ten lie in a ten-minute chat ----------
export const S10 = factCard({ value: 60, suffix: '%', label: 'LIED AT LEAST ONCE IN A 10-MINUTE CHAT', sub: 'Feldman et al., University of Massachusetts, 2002' });

// ---------- S24: now you hear every single one: a street of smiling liars ----------
export const S24 = scene({
  Set: DAY, cam: [960, 520, 1.15], to: [960, 520, 1.2], setT: 700,
  cast: [
    { look: N1, pose: at(400, { yaw: 0.4 }), faces: [[0, 'happy']], think: { th: 'lie', pop: 6, s: 0.6, loud: 0.6 } },
    { look: N2, pose: at(700, { yaw: -0.4 }), faces: [[0, 'happy']], think: { th: 'lie', pop: 12, s: 0.6, loud: 0.6 } },
    { look: N4, pose: at(1220, { yaw: 0.4 }), faces: [[0, 'happy']], think: { th: 'lie', pop: 18, s: 0.6, loud: 0.6 } },
    { look: N5, pose: at(1520, { yaw: -0.4 }), faces: [[0, 'happy']], think: { th: 'lie', pop: 24, s: 0.6, loud: 0.6 } },
  ],
});

// ---------- S11: what they say, what they think ----------
export const S11: React.FC<ShotProps> = (p) =>
  sayThink({ rows: [{ at: 0, say: "I'm fine.", think: 'not fine' }, { at: c('S11', 'I'), say: 'I love it!', think: 'hates it' }, { at: c('S11', 'Five'), say: '5 minutes away!', think: "hasn't left the house" }] })(p);

// ---------- S12: and worst of all ----------
export const S12 = faceCU({ look: YOU, Bg: CLASS, faces: [[0, 'worried']], yaw: 0.25, zoom: [3.1, 3.3], waves: 0.6 });

// ---------- S13: the girl next to you in art: "He's a bit weird." ----------
export const S13 = faceCU({ look: ARTGIRL, Bg: CLASS, faces: [[0, 'happy']], yaw: -0.3, zoom: [2.6, 2.75], think: { th: "He's a bit weird.", pop: c('S13', "He's"), s: 0.5, side: -0.5 } });

// ---------- S14: the coach: "Not good enough for Saturday." ----------
export const S14 = scene({
  Set: DAY, cam: [1000, 400, 1.7], to: [1000, 390, 1.8], setT: 900,
  cast: [
    { look: COACH, pose: at(1120, { yaw: -0.4, armL: { a: 30, b: -40 } }), faces: [[0, 'cool']], think: { th: 'Not good enough for Saturday.', pop: c('S14', 'Not'), s: 0.65, side: -0.5, wrap: 16 } },
    { look: YOU, pose: at(800, { yaw: 0.4 }), faces: [[0, 'happy'], [c('S14', 'Not') + 20, 'worried']] },
  ],
  front: () => <Football x={880} y={SUBURB.feet - 30} r={34} />,
});

// ---------- S15: and Mo ----------
export const S15 = faceCU({ look: MO, Bg: DARK, faces: [[0, 'neutral']], yaw: -0.3, zoom: [3.0, 3.15] });

// ---------- S16: the sleepover, in the dark; you pretend to sleep; his thought ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const k = c('S16', 'Sometimes');
  const mo: Pose = { ...basePose, x: 1220, y: 720, scale: 0.9, yaw: -0.2, tilt: -80, expr: 'worried', blink: 0, look: -0.4 };
  const me: Pose = { ...basePose, x: 700, y: 730, scale: 0.9, yaw: 0.2, tilt: 80, expr: 'tired', blink: 1 };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Bedroom t={t + 100} id="s16" veil={0.8} clock="23:52" lamp={0} />
      <Hero look={YOU} pose={me} />
      <Hero look={MO} pose={mo} />
      <rect x={480} y={740} width={420} height={70} rx={30} fill="#3A3E6A" />
      <rect x={1020} y={740} width={420} height={70} rx={30} fill="#4E7A4A" />
      {t > k ? <ThoughtBubble x={1180} y={560} text="Sometimes I think he only hangs out with me because nobody else will." s={0.55} pop={(t - k) / 8} t={t} type={clamp((t - k) / 80)} side={-0.5} wrap={22} /> : null}
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0A24" opacity={0.25} />
    </g>
  );
};

// ---------- S17: you, eyes open in the dark ----------
export const S17 = faceCU({ look: YOU, Bg: DARK, faces: [[0, 'worried']], yaw: 0.2, zoom: [3.3, 3.4], glint: 1, glintColor: THINK.glow });

// ---------- S18: every house on the street hums like a fridge ----------
const HouseHum: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {[220, 560, 900, 1240, 1580].map((x, i) => (
      <g key={i}>
        {[0, 1, 2].map((j) => {
          const k = ((t / 40 + j / 3 + i * 0.13) % 1);
          return <ellipse key={j} cx={x} cy={380 - k * 80} rx={60 + k * 120} ry={20 + k * 30} fill="none" stroke={THINK.glow} strokeWidth={4} opacity={(1 - k) * 0.6} />;
        })}
      </g>
    ))}
  </g>
);
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <NIGHT t={t + 100} id="s18" />
    <HouseHum t={t} />
  </g>
);

// ---------- S19: 2 a.m., the man next door at his window, worrying about money ----------
export const S19 = scene({
  Set: NIGHT, cam: [700, 420, 1.8], to: [700, 410, 1.9], setT: 160, dim: 0.1,
  cast: [{ look: N1, pose: at(640, { yaw: 0.2, armL: { a: 150, b: -140 } }), faces: [[0, 'worried']], think: { th: [[c('S19', 'worrying') - 10, 'bills... the car... bills...']], s: 0.7, side: 0.5, wrap: 14 } }],
});

// ---------- S20: across the road, a baby too little for words; her mum awake, counting hours ----------
const Baby: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <ellipse cx={0} cy={20} rx={60} ry={40} fill="#F2E8F8" stroke="#26232F" strokeWidth={5} />
    <circle cx={0} cy={-20} r={30} fill="#26232F" />
    <circle cx={-10} cy={-24} r={5} fill="#F6EFE3" />
    <circle cx={10} cy={-24} r={5} fill="#F6EFE3" />
  </g>
);
export const S20 = scene({
  Set: NIGHT, cam: [1260, 420, 1.8], to: [1260, 410, 1.9], setT: 220, dim: 0.1,
  cast: [{ look: BABYMUM, pose: at(1260, { yaw: -0.2, armL: { a: 60, b: -110 }, armR: { a: 60, b: -110 } }), faces: [[0, 'tired']], think: { th: [[c('S20', 'counting') - 8, '4 hours till morning... 3...']], s: 0.65, side: -0.5, wrap: 14 } }],
  front: (t) => <Baby x={1290} y={at(0).y - 40 + Math.sin(t / 10) * 4} />,
});

// ---------- S21: you put a pillow over your head; it doesn't help ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.3);
  const me: Pose = { ...basePose, x: sit.x, y: sit.y, scale: sit.scale, yaw: 0.2, tilt: -10, expr: 'tired', blink: 0, armL: { a: 160, b: -60 }, armR: { a: 160, b: -60 } };
  return (
    <g transform={camT(sit.x + 100, sit.y - 80, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Bedroom t={t + 300} id="s21" veil={0.75} clock="02:41" lamp={0.2} duvet={false} />
      <Hero look={YOU} pose={me} />
      <ellipse cx={sit.x} cy={sit.y - 170 * sit.scale} rx={110 * sit.scale} ry={50 * sit.scale} fill="#E8E4F0" stroke="#6A6488" strokeWidth={5} />
      <BedDuvet knees={1} />
      {t > c('S21', 'doesn\'t') ? (
        <g opacity={0.9}>
          {['money...', 'cry?', 'bins', '3 more hours'].map((s, i) => (
            <ThoughtBubble key={i} x={sit.x - 300 + i * 220} y={sit.y - 260 - (i % 2) * 80} text={s} s={0.4} pop={(t - c('S21', "doesn't") - i * 4) / 6} t={t} tail={false} side={0} seed={i} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

// ---------- S22: even the quiet people aren't quiet: the whole street from above, every house humming ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 480, kf(t, [[0, 1.2], [len, 0.95]]))}>
      <NIGHT t={t + 300} id="s22" />
      <HouseHum t={t * 1.6} />
      <g opacity={0.7}><ThoughtField t={t} n={10} bg={false} seed={14} /></g>
    </g>
  </g>
);

// ---------- S23: you, at the window, can never stop listening ----------
export const S23 = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'tired']], yaw: 0.1, zoom: [3.0, 3.3], waves: 1, glint: 1, glintColor: THINK.glow });
