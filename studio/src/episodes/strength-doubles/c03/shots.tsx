import React from 'react';
import { Pose, ShotProps, KITCHEN, stand, KitchenIsland, ModernCar, Mug, FONT, Classroom, SchoolDesk } from '../../../engine';
import { LIVING } from '../../electricity/sets';
import words from './words.json';
import {
  YOU, MO, MUM, DAD, ELLIE, N1, N2, N3, KID, TEACHER, RUGBY, Hero, basePose, camT, clamp, kf, lerp, easeOut, backOut, idleBlink, faceAt, Glow, POWER,
  StreetSet, KitchenSet, LivingSet, CountrySet, BenchSet, propCU, faceCU, bigWord, talkShot, sdCard, liftShot, at, atC, HIP, STREETM, COUNTRY, Soft,
  Barbell, BigHand, Van, Bus, FallenTree, Trampoline, Cracks, Handprint, span, HeldPhone,
} from '../common';

// Chapter 3, the fun part: the best week ever. Gym (the bar, then the teacher on the bar), arm wrestling the rugby
// team with a sandwich in the other hand, the sofa, the piano, the fridge with Mum on it, the van moved across the
// road, Mo filming, two million views, the tree in front of the bus, Mo the manager, the trampoline, the turn.

const STREET = StreetSet('day', { car: false });
const DUSK = StreetSet('dusk', { car: false });
const KIT = KitchenSet(0.3);
const STORM = CountrySet(true);
const LunchRoom: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Classroom t={t} id={id} />;

export const S1 = sdCard({ kicker: 'CHAPTER 3', title: 'THE BEST WEEK EVER', day: 3, tint: '#2A6A5A' });

// ---------- S2: gym: you lift the bar (two hands) ----------
const GY = 760 - 378;
export const S2 = liftShot({
  Set: BenchSet, x: 960, y: GY, two: true, faces: [[0, 'neutral'], [30, 'smug']],
  lift: (t) => easeOut(clamp((t - 10) / 18)),
  thing: (h, t) => <Barbell x={960} y={h.y} s={0.9} />,
  cam: [960, 480, 1.25, 960, 460, 1.35],
  others: (t) => <Hero look={TEACHER} pose={{ ...basePose, x: 1450, y: GY, yaw: -0.5, expr: t > 30 ? 'shock' : 'neutral', blink: idleBlink(t, 2), armR: { a: 40, b: -60 } }} />,
});

// ---------- S3: then the bar with the teacher sitting on it ----------
export const S3 = liftShot({
  Set: BenchSet, setT: 200, x: 960, y: GY, two: true, faces: [[0, 'smug']],
  lift: (t) => 0.92 + Math.sin(t / 10) * 0.03,
  thing: (h, t) => (
    <g>
      <Barbell x={960} y={h.y} s={0.9} />
      <Hero look={TEACHER} pose={{ ...basePose, x: 1060, y: h.y - 60, scale: 0.8, yaw: -0.4, expr: 'shock', legL: { a: 80, b: -80 }, legR: { a: 70, b: -80 }, armL: { a: 30, b: -20 }, armR: { a: 110, b: -20 }, blink: 0 }} shadow={0} />
    </g>
  ),
  cam: [960, 420, 1.0, 960, 400, 1.08],
});

// ---------- S4: the class staring, nobody claps ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 470, kf(t, [[0, 1.4], [len, 1.5]]))}>
    <BenchSet t={t + 300} />
    {[N1, KID, ELLIE, N3, N2, KID].map((l, i) => (
      <Hero key={i} look={{ ...l }} pose={{ ...basePose, x: 560 + i * 160, y: GY + (i % 2) * 10, scale: 0.85, yaw: 0, expr: 'shock', blink: 0, look: 0, armL: { a: 10, b: 0 }, armR: { a: 10, b: 0 } }} />
    ))}
  </g>
);

// ---------- S5: lunch, Mo makes the bet ----------
const moBet = span(words, 'Mo', 'time');
export const S5 = talkShot({
  Set: LunchRoom, setT: 100, words,
  cast: [
    { look: MO, x: 1000, y: 700, yaw: 0.4, talk: [moBet], faces: [[0, 'smug']], pose: { armR: { a: 100, b: -40 } } },
    { look: YOU, x: 1300, y: 700, yaw: -0.4, faces: [[0, 'neutral'], [60, 'smug']] },
  ],
  cam: { from: [1150, 520, 1.9], to: [1150, 520, 2.0] },
  front: () => <SchoolDesk x={1150} />,
});

// ---------- S6: insert: five hands on yours ----------
export const S6 = propCU({ Bg: LunchRoom, push: 0.08, draw: (t) => {
  const strain = Math.sin(t * 1.5) * 4;
  return (
    <g>
      <rect x={200} y={760} width={1520} height={400} fill="#8A6A4A" />
      <BigHand x={980} y={560} s={1.1} rot={-90} />
      {[0, 1, 2, 3, 4].map((i) => <BigHand key={i} x={1060 + i * 18 + strain} y={500 + i * 30} s={0.95} rot={-110 + i * 6} flip sleeve="#2A4A9A" />)}
    </g>
  );
} });

// ---------- S7: you win, sandwich in the other hand; the team tumbles ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const win = easeOut(clamp((t - 6) / 10));
  const me: Pose = { ...basePose, x: 700, y: 700, yaw: 0.4, expr: 'smug', armR: { a: lerp(80, 120, win), b: -60 }, armL: { a: 60, b: -110 }, blink: idleBlink(t, 3), legL: { a: 80, b: -80 }, legR: { a: 80, b: -80 } };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <LunchRoom t={t + 200} id="s7" />
      <Hero look={YOU} pose={me} />
      <g transform={`translate(${me.x - 70} ${me.y - 150})`}><path d="M -50 0 L 50 0 L 0 -50 Z" fill="#E8C88A" stroke="#100E16" strokeWidth={5} /><path d="M -46 -4 L 46 -4" stroke="#5AA84A" strokeWidth={8} /></g>
      {RUGBY.concat(RUGBY.slice(0, 2)).map((l, i) => (
        <Hero key={i} look={l} pose={{ ...basePose, x: 1000 + i * 120 + win * 80, y: 700, yaw: -0.4, tilt: win * (30 + i * 6), expr: win > 0.5 ? 'dizzy' : 'worried', blink: 0, armL: { a: 100, b: -20 }, armR: { a: 60, b: -20 } }} />
      ))}
    </g>
  );
};

// ---------- S8: Mo selling tickets ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const mo: Pose = { ...basePose, x: 960, y: 700, yaw: 0.1, expr: 'happy', armR: { a: 120 + Math.sin(t / 3) * 10, b: -30 }, blink: idleBlink(t, 4) };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 2.4], [len, 2.6]]))}>
      <Soft blur={10} dim={0.2}><LunchRoom t={t + 300} id="s8" /></Soft>
      <Hero look={MO} pose={mo} />
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(1080 ${430 + Math.sin(t / 3) * 6}) rotate(${-30 + i * 18})`}>
          <rect x={0} y={-20} width={110} height={44} rx={6} fill={POWER} stroke="#100E16" strokeWidth={4} />
          <text x={55} y={10} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#100E16">TICKET</text>
        </g>
      ))}
    </g>
  );
};

// ---------- S9: day five: Mum asks you to move the sofa ----------
const LA = stand(LIVING, 0.3, 0.55), LB = stand(LIVING, 0.55, 0.55);
const mumAsk = span(words, 'Mum', 'vacuum');
export const S9 = talkShot({
  Set: LivingSet, setT: 100, words,
  cast: [
    { look: MUM, ...LA, yaw: 0.4, talk: [mumAsk], faces: [[0, 'neutral']], pose: { armR: { a: 70, b: -30 } } },
    { look: YOU, ...LB, yaw: -0.4, faces: [[0, 'neutral'], [50, 'smug']] },
  ],
  cam: { from: [900, 500, 1.4], to: [900, 500, 1.5] },
});

const Sofa: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-260} y={-110} width={520} height={110} rx={30} fill="#3A5A9A" stroke="#100E16" strokeWidth={6} />
    <rect x={-260} y={-200} width={520} height={110} rx={30} fill="#4A6AAA" stroke="#100E16" strokeWidth={6} />
    <rect x={-290} y={-140} width={70} height={140} rx={24} fill="#3A5A9A" stroke="#100E16" strokeWidth={6} />
    <rect x={220} y={-140} width={70} height={140} rx={24} fill="#3A5A9A" stroke="#100E16" strokeWidth={6} />
  </g>
);
const Piano: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-220} y={-300} width={440} height={300} rx={8} fill="#1A1620" stroke="#000" strokeWidth={6} />
    <rect x={-220} y={-150} width={440} height={36} fill="#F6EFE3" />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={-214 + i * 31} y={-150} width={18} height={22} fill="#100E16" />)}
  </g>
);

// ---------- S10: you lift the sofa ----------
export const S10 = liftShot({
  Set: LivingSet, setT: 200, x: LB.x, y: LB.y, scale: LB.scale, two: true, faces: [[0, 'smug']],
  lift: (t) => easeOut(clamp(t / 12)),
  thing: (h, t) => <Sofa x={h.x - 40} y={h.y + 20} s={0.5} />,
  cam: [900, 480, 1.4, 900, 470, 1.45],
  others: (t) => <Hero look={MUM} pose={{ ...basePose, ...LA, yaw: 0.4, expr: 'shock', blink: 0 }} />,
});

// ---------- S11: and the piano (sofa down, piano up, in one hand) ----------
export const S11 = liftShot({
  Set: LivingSet, setT: 260, x: LB.x, y: LB.y, scale: LB.scale, faces: [[0, 'smug']],
  lift: (t) => easeOut(clamp(t / 10)),
  thing: (h, t) => <Piano x={h.x + 30} y={h.y + 10} s={0.45} />,
  cam: [LB.x, 460, 1.9, LB.x, 450, 2.0],
});

// ---------- S12: and the fridge, with Mum still holding the door ----------
const KA = stand(KITCHEN, 0.5, 0.5);
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp(t / 14));
  const me: Pose = { ...basePose, ...KA, yaw: 0.2, expr: 'smug', armR: { a: lerp(30, 170, p), b: 0 }, armL: { a: lerp(30, 170, p), b: 0 }, blink: idleBlink(t, 3) };
  const fy = KA.y - 120 * KA.scale - p * 210 * KA.scale;
  return (
    <g transform={camT(KA.x, 420, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <KIT t={t + 100} id="s12" />
      <Hero look={YOU} pose={me} />
      <g transform={`translate(${KA.x} ${fy})`}>
        <rect x={-80} y={-300} width={160} height={300} rx={12} fill="#D8DCE4" stroke="#100E16" strokeWidth={6} />
        <path d="M -80 -190 H 80" stroke="#100E16" strokeWidth={4} />
        <g transform={`rotate(${-50 * p} 80 -150)`}><rect x={80} y={-300} width={20} height={300} fill="#C8CCD4" stroke="#100E16" strokeWidth={4} /></g>
        <Hero look={MUM} pose={{ ...basePose, x: 150, y: -120, scale: 0.6, yaw: -0.5, expr: 'shock', blink: 0, armL: { a: 120, b: -10 }, armR: { a: 120, b: -10 }, legL: { a: 20 + Math.sin(t / 2) * 20, b: 0 }, legR: { a: -10 - Math.sin(t / 2) * 20, b: 0 } }} shadow={0} />
      </g>
    </g>
  );
};

// ---------- S13: day six: Dad's car boxed in by a van ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 980]]), 520, 1.05)}>
    <STREET t={t + 300} id="s13" />
    <ModernCar x={760} y={STREETM.feet + 40} s={1} color="#3A6AB8" />
    <Van x={1230} y={STREETM.feet + 60} s={0.95} />
    <Hero look={DAD} pose={at(500, { yaw: 0.4, expr: 'worried', blink: idleBlink(t, 2), armR: { a: 100, b: -100 } })} />
  </g>
);

// ---------- S14: you carry the van across the road ----------
export const S14 = liftShot({
  Set: STREET, setT: 360, x: (t) => lerp(1200, 600, easeOut(clamp((t - 14) / 60))), y: HIP, two: true, faces: [[0, 'smug']],
  lift: (t) => easeOut(clamp(t / 12)),
  thing: (h, t) => <Van x={h.x} y={h.y + 20} s={0.6} />,
  cam: [1000, 380, 0.9],
  others: (t) => <ModernCar x={760} y={STREETM.feet + 40} s={1} color="#3A6AB8" />,
});

// ---------- S15: neatly: the van set down, perfectly parked across the road ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const down = easeOut(clamp(t / 10));
  return (
    <g transform={camT(1200, 600, kf(t, [[0, 1.2], [len, 1.25]]))}>
      <STREET t={t + 420} id="s15" />
      <Van x={1300} y={STREETM.feet + 230 - (1 - down) * 80} s={1} flip />
      <Hero look={YOU} pose={at(900, { yaw: 0.3, expr: 'smug', armR: { a: 40, b: -90 }, blink: idleBlink(t, 3) })} />
      <text x={1300} y={STREETM.feet - 380} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={70} fill="#F6EFE3" stroke="#100E16" strokeWidth={8} paintOrder="stroke" opacity={clamp((t - 10) / 6)}>neatly.</text>
    </g>
  );
};

// ---------- S16: Dad at the window, mug halfway to his mouth ----------
export const S16: React.FC<ShotProps> = ({ t, len, f }) => (
  <g>
    <rect width={1920} height={1080} fill="#8A6A5A" />
    <rect x={460} y={160} width={1000} height={760} fill="#3A3A50" stroke="#100E16" strokeWidth={20} />
    <g transform={camT(960, 560, kf(t, [[0, 2.4], [len, 2.55]]))}>
      <Hero look={DAD} pose={{ ...basePose, x: 960, y: 760, yaw: 0, expr: 'shock', blink: 0, armR: { a: 40, b: -120 } }} shadow={0} />
      <Mug x={1010} y={600} rot={-10} steam={1} f={f} />
    </g>
    <path d="M 960 160 V 920 M 460 540 H 1460" stroke="#F6EFE3" strokeWidth={14} />
    <rect x={460} y={160} width={1000} height={760} fill="#BFE0F0" opacity={0.18} />
  </g>
);

// ---------- S17: Mo films everything: again, slower ----------
const moAgain = span(words, "'Again", 'video');
export const S17: React.FC<ShotProps> = ({ t, len, f }) => {
  const mo: Pose = at(800, { yaw: 0.5, expr: 'happy', armR: { a: 100, b: -50 }, blink: idleBlink(t, 2) });
  return (
    <g transform={camT(980, 470, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <STREET t={t + 480} id="s17" />
      <Hero look={MO} pose={{ ...mo, talk: Math.abs(Math.sin(t / 3)) * (t > 50 ? 0.7 : 0) }} />
      <HeldPhone pose={mo} t={t} mode="record" glow={1} />
      <Hero look={YOU} pose={at(1180, { yaw: -0.4, expr: 'smug', armR: { a: 160, b: 0 }, blink: idleBlink(t, 5) })} />
    </g>
  );
};

// ---------- S18: two million views ----------
export const S18 = bigWord({ word: '2,000,000', color: POWER, size: 210, sub: 'VIEWS BY THE NEXT MORNING', Bg: STREET });

// ---------- S19: the comments ----------
export const S19: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#16141E" />
    {[['fake', 30], ['CGI', 60], ['bro is on wires 💀', 90]].map(([c, a], i) => {
      const p = backOut(clamp((t - (a as number)) / 8));
      return (
        <g key={i} transform={`translate(${540 + i * 60} ${300 + i * 200}) scale(${p})`} opacity={clamp((t - (a as number)) / 4)}>
          <rect x={0} y={-60} width={860} height={130} rx={24} fill="#2A2834" />
          <circle cx={70} cy={5} r={40} fill={['#C83A3A', '#3A7AE0', '#5AA84A'][i]} />
          <text x={140} y={-8} fontFamily={FONT.ui} fontSize={28} fill="#8A8698">{['@realtalk99', '@noway_jose', '@gymbro_k'][i]}</text>
          <text x={140} y={42} fontFamily={FONT.title} fontWeight={700} fontSize={48} fill="#F6EFE3">{c}</text>
        </g>
      );
    })}
  </g>
);

// ---------- S20: day seven, storm: a tree across the road in front of a bus ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 560, 1.0)}>
    <STORM t={t + 100} id="s20" />
    <Bus x={1350} y={COUNTRY.feet + 70} s={0.75} kids={0} />
    <FallenTree x={760} y={COUNTRY.feet + 80} s={0.8} rot={-4} />
    {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M ${(i * 97 + t * 25) % 2000 - 40} ${(i * 53 + t * 40) % 1100} l -14 36`} stroke="#A8B8D8" strokeWidth={3} opacity={0.5} />)}
    <rect width={1920} height={1080} fill="#1A2040" opacity={0.25} />
  </g>
);

// ---------- S21: you lift the trunk and roll it into the ditch ----------
export const S21 = liftShot({
  Set: STORM, setT: 200, x: 820, y: COUNTRY.feet - 378, two: true, faces: [[0, 'neutral'], [30, 'smug']],
  lift: (t) => easeOut(clamp((t - 6) / 16)) * 0.7,
  thing: (h, t) => <FallenTree x={h.x - 60 + clamp((t - 40) / 20) * 300} y={h.y + 60 + clamp((t - 40) / 20) * 120} s={0.7} rot={-8 + clamp((t - 40) / 20) * 30} />,
  cam: [960, 560, 1.05],
  others: (t) => <Bus x={1500} y={COUNTRY.feet + 70} s={0.75} />,
});

// ---------- S22: the bus driver shakes your hand, very carefully ----------
export const S22 = talkShot({
  Set: STORM, setT: 300,
  cast: [
    { look: N1, x: 860, y: COUNTRY.feet - 378, yaw: 0.5, faces: [[0, 'worried'], [40, 'happy']], pose: { armR: { a: 70, b: -20 } } },
    { look: YOU, x: 1100, y: COUNTRY.feet - 378, yaw: -0.5, faces: [[0, 'oops']], pose: { armR: { a: 70, b: -20 } } },
  ],
  cam: { from: [980, 360, 1.8], to: [980, 360, 1.95] },
});

// ---------- S23: day eight: Mo the manager, fifteen percent ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 470, kf(t, [[0, 2.0], [len, 2.15]]))}>
    <STREET t={t + 600} id="s23" />
    <Hero look={MO} pose={at(900, { yaw: 0.2, expr: 'smug', armR: { a: 150, b: -60 }, blink: idleBlink(t, 3), glasses: clamp((t - 10) / 8) })} />
    <g transform={`translate(1080 ${HIP - 160}) scale(${backOut(clamp((t - 40) / 9))})`}>
      <rect x={-20} y={-60} width={300} height={110} rx={16} fill="#F6EFE3" stroke="#100E16" strokeWidth={6} />
      <text x={130} y={-12} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#100E16">MANAGER</text>
      <text x={130} y={36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#C83A3A">15%</text>
    </g>
  </g>
);

// ---------- S24: your sister by the trampoline ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.4], [len, 1.5]]))}>
    <STREET t={t + 700} id="s24" />
    <Trampoline x={760} y={STREETM.feet + 20} />
    <Hero look={ELLIE} pose={at(1000, { scale: 0.72, y: STREETM.feet - 378 * 0.72, yaw: -0.3, expr: 'happy', armR: { a: 150, b: -20 }, armL: { a: 150, b: -20 }, blink: idleBlink(t, 2) }, 0.72)} />
    <Hero look={YOU} pose={at(1200, { yaw: -0.4, expr: 'smug', blink: idleBlink(t, 4) })} />
  </g>
);

// ---------- S25: the whole trampoline overhead, her on it, laughing ----------
export const S25 = liftShot({
  Set: STREET, setT: 760, x: 960, y: HIP, two: true, faces: [[0, 'happy']],
  lift: (t) => easeOut(clamp(t / 12)),
  thing: (h, t) => {
    const b = Math.abs(Math.sin(t / 6));
    return (
      <g>
        <Trampoline x={h.x - 20} y={h.y + 120} s={0.8} />
        <Hero look={ELLIE} pose={{ ...basePose, x: h.x - 20, y: h.y - 80 - b * 70, scale: 0.6, yaw: 0, expr: 'happy', armL: { a: 150, b: -20 }, armR: { a: 150, b: -20 }, squash: b < 0.2 ? 0.1 : -0.05, blink: 0 }} shadow={0} />
      </g>
    );
  },
  cam: [960, 360, 0.95, 960, 340, 1.02],
});

// ---------- S26: dusk: the strongest person who ever lived ----------
export const S26: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 470]]), kf(t, [[0, 1.0], [len, 1.4]]))}>
    <DUSK t={t + 800} id="s26" />
    <Glow x={960} y={HIP} r={260} kind="warm" o={0.5} />
    <Hero look={YOU} pose={at(960, { yaw: 0.1, expr: 'smug', armR: { a: 20, b: -10 }, blink: idleBlink(t, 3), glint: 0.8, glintColor: POWER })} />
  </g>
);

// ---------- S27: insert: your hand on the door frame, cracks spreading ----------
export const S27 = propCU({ Bg: DUSK, push: 0.1, draw: (t) => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#E8DCC8" opacity={0.92} />
    <Handprint x={1000} y={540} s={1.6} o={clamp((t - 50) / 10)} />
    <Cracks x={1000} y={540} s={2.4} p={clamp((t - 60) / 40)} seed={12} color="#5A4A3A" />
    <BigHand x={lerp(1300, 1060, easeOut(clamp(t / 30)))} y={560} s={1.1} flip rot={0} />
  </g>
) });
