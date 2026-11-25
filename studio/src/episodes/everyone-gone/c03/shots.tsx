import React from 'react';
import { ShotProps, camT, kf, clamp, backOut, FONT, SHOP, MALL, SUBURB, FoodTable, PizzaBox, Bicycle, Bedroom, BedDuvet, bedSit, Hero, basePose, CardTerminal, Pose } from '../../../engine';
import words from './words.json';
import {
  YOU, ROBE, EG, TownSet, HomeSet, ShopSet, MallSet, RoofSet, ClassSet, scene, faceCU, insert, walk, cueAt, egCard, DoorNote, Motorway, MOTOR, HotTub, Cinema, Popcorn, Noodle, Woof, handAt, riderPose, IceCream, Notes, sit,
} from '../common';

// Chapter 3, the fun part, days 2 to 6: the toy store; the note on Mo's door; ice cream for every meal and a terrible
// pizza; a bike down the empty motorway; the penthouse and the hot tub; a film alone; NO HOMEWORK FOREVER; a scream
// from the school roof, and every dog in the city barks back.

const DAY = TownSet('day');
const HOME = HomeSet('day');
const TOYS = ShopSet();
const MALLS = MallSet();
const ROOF = RoofSet();
const MW: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Motorway t={t} id={id} />;
const shopFeet = SHOP.feet;

// ---------- S1: days 2 to 6 ----------
export const S1 = egCard({ kicker: 'DAYS 2 TO 6', title: 'THE FUN PART', Bg: DAY });

// a tower of toy boxes in your arms
const Toys: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[['#E8504A', 130], ['#4AA8E0', 110], ['#F2C14E', 120], ['#5BC08A', 90]].map(([c, w], i) => (
      <rect key={i} x={-(w as number) / 2 + (i % 2) * 10} y={-60 - i * 56} width={w as number} height={56} rx={6} fill={c as string} stroke="#14121C" strokeWidth={4} />
    ))}
    <circle cx={10} cy={-300} r={30} fill="#B07AD0" stroke="#14121C" strokeWidth={4} />
  </g>
);

// ---------- S2: day two: the biggest toy store, take whatever you want ----------
export const S2 = scene({
  Set: TOYS, cam: { from: [800, 520, 1.15], to: [860, 520, 1.2] }, day: 2,
  cast: (t) => [{ look: YOU, pose: { x: 820, y: shopFeet - 300 + 14, scale: 1, yaw: 0.2, armR: { a: -60, b: -40 }, armL: { a: -60, b: -40 } }, faces: [[0, 'happy']] }],
  front: () => <Toys x={820} y={shopFeet - 70} s={0.8} />,
});

// ---------- S2B: nobody stops you: out past the counter with a trolley ----------
const Trolley: React.FC<{ x: number; y: number; t: number }> = ({ x, y, t }) => (
  <g transform={`translate(${x} ${y})`}>
    <path d="M -180 -260 L 160 -260 L 130 -60 L -150 -60 Z" fill="none" stroke="#8A8E98" strokeWidth={10} />
    {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${-150 + i * 56} -260 L ${-130 + i * 50} -60`} stroke="#8A8E98" strokeWidth={5} />)}
    {[['#E8504A', -120], ['#4AA8E0', -40], ['#F2C14E', 40], ['#5BC08A', 100]].map(([c, dx], i) => <rect key={i} x={dx as number} y={-330 - (i % 2) * 40} width={70} height={110} rx={6} fill={c as string} stroke="#14121C" strokeWidth={4} />)}
    <path d="M 160 -260 L 240 -300" stroke="#8A8E98" strokeWidth={10} />
    {[-120, 110].map((wx) => <circle key={wx} cx={wx} cy={-20} r={22} fill="#26232F" transform={`rotate(${t * 20} ${wx} -20)`} />)}
  </g>
);
export const S2B = scene({
  Set: TOYS, setT: 200, cam: { from: [1200, 520, 1.15], to: [1300, 520, 1.15] }, day: 2,
  cast: (t) => [{ look: YOU, pose: walk(t, 900, 1500, 0, 80, SHOP.feet, 1, { armR: { a: -70, b: -10 } }), faces: [[0, 'smug']] }],
  front: (t) => <Trolley x={kf(t, [[0, 900], [80, 1500]]) - 280} y={SHOP.feet + 10} t={t} />,
});

// ---------- S3: no queue at the checkout, nobody at the checkout ----------
export const S3 = insert({
  Bg: TOYS, push: 0.1,
  draw: (t) => (
    <g>
      <rect x={-100} y={640} width={2200} height={500} fill="#7A4A3A" />
      <rect x={-100} y={620} width={2200} height={30} fill="#A8705A" />
      <g transform="translate(960 640) scale(2.2) translate(-960 -640)"><CardTerminal x={960} y={640} s={1} state="idle" t={t} /></g>
      <rect x={1300} y={260} width={420} height={110} rx={14} fill="#14121C" />
      <text x={1510} y={332} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#5BC08A">TILL OPEN</text>
    </g>
  ),
});

// ---------- S4: on the way home, a note on Mo's door ----------
export const S4 = scene({
  Set: HOME, setT: 100, cam: { from: [1050, 520, 1.7], to: [1080, 520, 1.8] },
  cast: [{ look: YOU, pose: { x: 1240, y: SUBURB.feet - 300 + 10, scale: 1, yaw: -0.7, armL: { a: -100, b: 20 } }, faces: [[0, 'happy']] }],
  back: () => <DoorNote x={1110} y={560} s={0.25} lines={['GONE TO', 'THE MALL!']} />,
});

// ---------- S5: GONE TO THE MALL. COME FIND ME. ----------
export const S5 = insert({
  Bg: HOME, push: 0.1,
  draw: () => (
    <g>
      <rect x={560} y={-100} width={800} height={1300} fill="#3A8A5A" stroke="#14121C" strokeWidth={10} />
      <circle cx={1280} cy={620} r={22} fill="#E8C060" />
      <DoorNote x={960} y={520} s={2} lines={['GONE TO THE MALL.', 'COME FIND ME.', '- you']} />
    </g>
  ),
});

// ---------- S6: every day you check: every day, the note is still there ----------
export const S6: React.FC<ShotProps> = (p) => {
  const day = 2 + Math.min(4, Math.floor(p.t / 25));
  const I = insert({
    Bg: HOME, push: 0.04, day,
    draw: (t) => (
      <g>
        <rect x={560} y={-100} width={800} height={1300} fill="#3A8A5A" stroke="#14121C" strokeWidth={10} />
        <circle cx={1280} cy={620} r={22} fill="#E8C060" />
        <DoorNote x={960} y={520} s={2} lines={['GONE TO THE MALL.', 'COME FIND ME.', '- you']} age={day / 6} rot={-3 - (day - 2) * 1.5} />
        <rect x={-100} y={-100} width={2200} height={1300} fill={t % 25 < 3 ? '#F6EFE3' : '#000'} opacity={t % 25 < 3 ? 0.25 : 0} />
      </g>
    ),
  });
  return <I {...p} />;
};

// ---------- S7: day three: breakfast is ice cream, lunch is ice cream ----------
const icePose = (t: number): Partial<Pose> => ({ x: 960, y: MALL.feet - 300 + 12, scale: 1, yaw: 0.3, armR: { a: -40 + Math.sin(t / 10) * 6, b: -100 } });
export const S7 = scene({
  Set: MALLS, cam: { from: [960, 520, 1.4], to: [960, 520, 1.5] }, day: 3,
  cast: (t) => [{ look: YOU, pose: icePose(t), faces: [[0, 'happy']] }],
  front: (t) => {
    const h = handAt(icePose(t));
    return (
      <g>
        <FoodTable x={600} y={MALL.feet + 60} />
        <IceCream x={h.x} y={h.y - 4} s={1.1} />
      </g>
    );
  },
});

// ---------- S8: dinner: a whole pizza you bake yourself. It's terrible ----------
export const S8 = insert({
  Bg: MALLS, push: 0.08,
  draw: (t) => (
    <g>
      <rect x={-100} y={700} width={2200} height={500} fill="#C8CCD6" />
      <g transform="translate(960 720) scale(1 0.45)">
        <circle r={380} fill="#3A2214" stroke="#14121C" strokeWidth={10} />
        <circle r={330} fill="#5A3A1E" />
        {Array.from({ length: 9 }).map((_, i) => <circle key={i} cx={Math.cos(i * 2.1) * 200} cy={Math.sin(i * 2.1) * 200} r={40} fill="#1E1410" />)}
      </g>
      {[0, 1, 2].map((i) => {
        const k = ((t / 40 + i / 3) % 1);
        return <circle key={i} cx={860 + i * 100} cy={600 - k * 300} r={40 + k * 60} fill="#4A4A52" opacity={0.6 * (1 - k)} />;
      })}
    </g>
  ),
});

// ---------- S9: you eat all of it anyway ----------
export const S9 = faceCU({ look: YOU, Bg: MALLS, faces: [[0, 'oops'], [30, 'happy']], yaw: 0.2, zoom: [2.9, 3.05] });

// ---------- S10: day four: a bike down the middle of the motorway ----------
export const S10 = scene({
  Set: MW, cam: { from: [600, 560, 1.0], to: [1300, 560, 1.0] }, day: 4,
  cast: (t, f) => [{ look: YOU, pose: riderPose(kf(t, [[0, 300], [150, 1900]]), MOTOR.feet + 110, t), faces: [[0, 'happy']] }],
  front: (t) => <Bicycle x={kf(t, [[0, 300], [150, 1900]]) + 10} y={MOTOR.feet + 110} roll={1} t={t} />,
});

// ---------- S11: singing as loud as you can ----------
export const S11 = scene({
  Set: MW, setT: 400, cam: { from: [1000, 760, 1.9], to: [1100, 760, 1.9] }, words,
  cast: (t) => [{ look: YOU, pose: { ...riderPose(kf(t, [[0, 900], [120, 1300]]), MOTOR.feet + 110, t), headTilt: -12 }, faces: [[0, 'happy']], talk: [[0, 999]] }],
  front: (t) => (
    <g>
      <Bicycle x={kf(t, [[0, 900], [120, 1300]]) + 10} y={MOTOR.feet + 110} roll={1} t={t} />
      <Notes x={kf(t, [[0, 900], [120, 1300]]) + 80} y={MOTOR.feet - 320} t={t} />
    </g>
  ),
});

// ---------- S12: day five: the penthouse at the top of the fanciest hotel ----------
export const S12 = scene({
  Set: ROOF, cam: { from: [960, 640, 1.1], to: [960, 660, 1.18] }, day: 5,
  front: (t) => <HotTub x={1260} y={950} s={0.9} t={t} />,
  cast: (t) => [{ look: ROBE, pose: walk(t, 300, 660, 0, 60, 940, 1), faces: [[0, 'happy']] }],
});

// ---------- S13: the bed is bigger than your bedroom ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const p = bedSit(0.22);
  const hop = Math.abs(Math.sin(t / 7)) * 60;
  const pose: Pose = { ...basePose, x: p.x, y: p.y - 90 - hop, scale: p.scale, yaw: 0, armR: { a: -150, b: 10 }, armL: { a: -150, b: 10 }, expr: 'happy', legL: { a: 10, b: -20 }, legR: { a: -10, b: -20 } };
  return (
    <g transform={camT(p.x + 120, p.y - 40, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <Bedroom t={t + 60} id="b13" veil={0.15} clock="21:04" lamp={1} crossed={0} />
      <Hero look={ROBE} pose={pose} shadow={0} />
    </g>
  );
};

// ---------- S14: asleep in a bathrobe, watching the sun set over a city that belongs only to you ----------
export const S14 = scene({
  Set: ROOF, setT: 400, cam: { from: [960, 620, 1.0], to: [960, 600, 1.08] },
  front: (t) => (
    <g>
      <path d="M 520 900 L 900 900 L 860 860 L 560 860 Z" fill="#E8E4D8" stroke="#14121C" strokeWidth={5} />
      <path d="M 560 860 L 520 760" stroke="#E8E4D8" strokeWidth={22} />
      {[540, 880].map((x) => <path key={x} d={`M ${x} 900 V 960`} stroke="#14121C" strokeWidth={8} />)}
      <HotTub x={1420} y={950} s={0.7} t={t} />
    </g>
  ),
  cast: (t) => [{ look: ROBE, pose: { ...sit(680, 860, 1, 1), tilt: -26, headTilt: 18 }, faces: [[0, 'tired']] }],
  over: (t) => <rect width={1920} height={1080} fill="#F29A6A" opacity={0.08} />,
});

// ---------- S15: that night, a film alone in the biggest cinema, the best seat ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Cinema t={t} />
    {/* you, from behind, in the middle of row two */}
    <g transform="translate(960 870)">
      <ellipse cx={0} cy={-40} rx={60} ry={70} fill="#F07A2A" stroke="#14121C" strokeWidth={6} />
      <circle cx={0} cy={-110} r={46} fill="#C85E1C" stroke="#14121C" strokeWidth={6} />
      <g transform="translate(90 20) scale(0.4)"><Popcorn x={0} y={0} /></g>
    </g>
  </g>
);

// ---------- S15B: a bucket of popcorn the size of a bin ----------
export const S15B = insert({ Bg: (pp) => <Cinema t={pp.t} />, push: 0.1, dim: 0.5, draw: () => <Popcorn x={960} y={960} s={2.6} /> });

// ---------- S16: an hour to work out the projector ----------
export const S16 = faceCU({ look: YOU, Bg: (pp) => <Cinema t={pp.t} />, faces: [[0, 'dizzy']], yaw: 0.1, zoom: [2.9, 3.0], dim: 0.4 });

// ---------- S17: day six: school, just to sit in the teacher's chair ----------
const CLS = ClassSet(<g />);
export const S17 = scene({
  Set: CLS, cam: { from: [900, 520, 1.1], to: [900, 520, 1.16] }, day: 6,
  cast: [{ look: YOU, pose: { x: 1240, y: 590, scale: 0.62, yaw: -0.3, armR: { a: -150, b: 0 }, armL: { a: 30, b: -20 } }, faces: [[0, 'smug']] }],
});

// ---------- S17B: on the board, in giant letters: NO HOMEWORK. FOREVER. ----------
export const S17B: React.FC<ShotProps> = (p) => {
  const at = Math.max(0, cueAt(words, p.f, p.t, 'no'));
  const I = insert({
    bgColor: '#2A3A30', push: 0.06, day: 6,
    draw: (t) => {
      const k = clamp((t - at) / 40);
      return (
        <g>
          <rect x={-100} y={-100} width={2200} height={1300} fill="#2E4A3A" />
          <rect x={-100} y={940} width={2200} height={40} fill="#8A6A4A" />
          <clipPath id="chalk"><rect x={0} y={0} width={1920 * k + 10} height={1080} /></clipPath>
          <g clipPath="url(#chalk)">
            <text x={960} y={440} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={220} fill="#F6EFE3">NO HOMEWORK.</text>
            <text x={960} y={720} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={220} fill={EG.gold}>FOREVER.</text>
          </g>
        </g>
      );
    },
  });
  return <I {...p} />;
};

// ---------- S18: on the roof, you scream as loud as you can ----------
export const S18 = scene({
  Set: ROOF, setT: 800, cam: { from: [960, 640, 1.3], to: [960, 620, 1.15] }, words,
  cast: [{ look: YOU, pose: { x: 960, y: 900 - 300, scale: 1, yaw: 0, armR: { a: -140, b: 10 }, armL: { a: -140, b: 10 }, headTilt: -14 }, faces: [[0, 'shock']], talk: [[0, 999]] }],
});

// ---------- S19: something answers: woofs across the city ----------
export const S19 = scene({
  Set: ROOF, setT: 1000, cam: { from: [960, 560, 1.0], to: [960, 560, 1.04] },
  over: (t) => (
    <g>
      {Array.from({ length: 10 }).map((_, i) => (t > i * 5 ? <Woof key={i} x={150 + ((i * 173) % 1650)} y={520 + ((i * 97) % 220)} t={t - i * 5} s={0.6 + (i % 3) * 0.2} seed={i} /> : null))}
    </g>
  ),
});

// ---------- S20: thousands of dogs bark back ----------
export const S20 = scene({
  Set: DAY, setT: 300, cam: { from: [1250, 700, 1.7], to: [1250, 700, 1.8] },
  front: (t) => (
    <g>
      <Noodle x={1300} y={835} s={1.1} t={t} bark={Math.max(0, Math.sin(t / 3))} lead />
      <Woof x={1500} y={560} t={t} s={1.2} />
    </g>
  ),
});

// ---------- S21: it's funny. For about a second ----------
export const S21: React.FC<ShotProps> = (p) => {
  const sec = cueAt(words, p.f, p.t, 'second');
  const F = faceCU({ look: YOU, Bg: ROOF, faces: [[0, 'happy'], [sec + 6, 'worried']], yaw: 0.25, zoom: [2.9, 3.05] });
  return <F {...p} />;
};

// ---------- S22: the dogs are the loudest thing left; the city is about to start falling apart ----------
export const S22 = scene({
  Set: RoofSet({ night: 0.25 }), setT: 1200, cam: [[0, 960, 640, 1.4], [-1, 960, 560, 1.0]],
  cast: [{ look: YOU, pose: { x: 960, y: 900 - 300, scale: 0.9, yaw: 0, headTilt: -6 }, faces: [[0, 'worried']] }],
});

