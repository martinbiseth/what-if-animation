import React from 'react';
import { ShotProps, camT, kf, clamp, backOut, TitleCard, Bicycle, PoliceCar, Helicopter, WalkSignal, DispatchMap, NewsScreen, FoodTable, TOWN, LOT, MALL, Hero, basePose, starPath, WANT, SirenWash } from '../../../engine';
import words from './words.json';
import { YOU, DALE, MAN, N1, N2, N3, N4, TownSet, LotSet, MallSet, BridgeSet, HIP, FEET, scene, faceCU, starsCU, insert, walk, run, cueAt, people, Soft, crouch } from '../common';
import series from '../series.json';

// Chapter 1, the cold open: you cross on red, a star; the bike cop; you run, two stars; sirens; you hide behind the
// skate ramp, three; the helicopter finds you; four: roadblocks, your face on the mall screens, the man and his
// burger; five: every officer in the city; you; all because you crossed on red; the title.

const DAY = TownSet('day');
const DAYP = TownSet('day', { police: 1 });
const DUSK = TownSet('dusk', { police: 0.6 });
const LOTD = LotSet({ tod: 'dusk', police: 0.6 });
const FACE = (x: number, y: number, w: number, h: number, i: number, t: number) => <NewsScreen x={x} y={y} w={w} h={h} t={t} headline="HAVE YOU SEEN THIS TEEN?" kind="face" id={`ns${i}`} stars={4} />;
const MALLS = MallSet(FACE);

// ---------- S1: you step off the kerb while the little man is still red ----------
export const S1 = scene({
  Set: DAY, cam: { from: [420, 560, 1.5], to: [360, 600, 1.6] }, words,
  back: () => <WalkSignal x={300} y={TOWN.feet + 6} red />,
  cast: (t) => [{ look: YOU, pose: walk(t, 720, 260, 0, 70, kf(t, [[30, TOWN.feet], [70, TOWN.feet + 70]]), 1), faces: [[0, 'cool']] }],
});

// ---------- S2: the little red man ----------
export const S2 = insert({ Bg: DAY, push: 0.12, draw: (t) => <g transform="translate(960 1180) scale(2.1)"><WalkSignal x={0} y={0} red /></g> });

// ---------- S3: Ding. A star above your head ----------
export const S3: React.FC<ShotProps> = (p) => {
  const ding = cueAt(words, p.f, p.t, 'Ding');
  const F = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'cool'], [ding + 6, 'shock']], yaw: 0.25, look_: 0, stars: [[0, 0], [ding + 2, 1.25]], zoom: [2.7, 2.9], pose: { headTilt: -6 } });
  return <F {...p} />;
};

// ---------- S4: a gold star lights up ----------
export const S4 = starsCU({ k: 1, Bg: DAY });

// ---------- S5: ten seconds later, a police bike turns the corner ----------
const rider = (x: number, t: number) => ({ x, y: TOWN.feet - 190, scale: 1, yaw: -0.8, facing: -1 as const, legL: { a: 30 + 30 * Math.sin(t / 4), b: -60 }, legR: { a: -10 - 30 * Math.sin(t / 4), b: -40 }, armR: { a: 70, b: -10 }, armL: { a: 70, b: -10 }, tilt: -6 });
export const S5 = scene({
  Set: DAY, cam: { from: [1300, 540, 1.35], to: [1200, 560, 1.45] }, words,
  cast: (t) => [{ look: DALE, pose: rider(kf(t, [[0, 2000], [50, 1350]]), t), faces: [[0, 'neutral']], tache: true }],
  front: (t) => <Bicycle x={kf(t, [[0, 2000], [50, 1350]]) + 10} y={TOWN.feet + 4} flip roll={1} t={t} />,
});

// ---------- S6: so you run ----------
export const S6 = scene({
  Set: DAY, setT: 300, cam: { from: [900, 560, 1.4], to: [700, 560, 1.45] }, words,
  cast: (t, f) => [{ look: YOU, pose: run(t, 1300, 300, 0, 60, TOWN.feet, 1), faces: [[0, 'shock']], stars: [[0, 1], [cueAt(words, f, t, 'Two'), 2.25]] }],
});

// ---------- S7: two stars ----------
export const S7 = starsCU({ k: [[0, 1], [4, 2.25]], Bg: DAYP, siren: 0.5 });

// ---------- S8: sirens, from three directions at once ----------
export const S8 = scene({
  Set: DAYP, setT: 600, cam: { from: [960, 600, 1.0], to: [960, 620, 1.1] }, siren: 0.6,
  back: (t) => (
    <g>
      <PoliceCar x={kf(t, [[0, -500], [40, 380]])} y={TOWN.feet + 150} s={0.8} t={t} />
      <PoliceCar x={kf(t, [[0, 2400], [46, 1500]])} y={TOWN.feet + 170} s={0.85} t={t} seed={3} flip />
      <PoliceCar x={kf(t, [[6, 960], [50, 960]])} y={kf(t, [[6, 1500], [50, TOWN.feet + 260]])} s={1} t={t} seed={5} />
    </g>
  ),
});

// ---------- S9: you hide behind the skate park. Three stars ----------

export const S9 = scene({
  Set: LOTD, cam: { from: [1300, 600, 1.5], to: [1340, 640, 1.65] }, words, siren: 0.3,
  cast: (t, f) => [{ look: YOU, pose: { ...crouch(1770, LOT.feet), look: 0.6 }, faces: [[0, 'worried']], floor: LOT.feet, stars: [[0, 2], [cueAt(words, f, t, 'Three'), 3.25]] }],
});

// ---------- S10: a helicopter rises over the rooftops ----------
export const S10 = scene({
  Set: DUSK, cam: { from: [960, 260, 1.5], to: [960, 220, 1.6] },
  back: (t) => <Helicopter x={1000} y={kf(t, [[0, 520], [70, 120]])} s={0.8} t={t} tilt={kf(t, [[0, -4], [70, 6]])} />,
});

// ---------- S11: its searchlight finds you straight away ----------
export const S11 = scene({
  Set: LotSet({ tod: 'night', police: 0.4 }), cam: { from: [1400, 520, 1.15], to: [1500, 560, 1.3] }, words,
  back: (t) => <Helicopter x={1200} y={60} s={0.6} t={t} beam={{ a: kf(t, [[0, -25], [24, 34]]), len: 1450, w: 380 }} />,
  cast: [{ look: YOU, pose: { ...crouch(1770, LOT.feet), look: 0.3, headTilt: -14 }, faces: [[0, 'shock']], stars: 3, floor: LOT.feet }],
});

// ---------- S12: four stars ----------
export const S12 = starsCU({ k: [[0, 3], [4, 4.25]], siren: 0.8 });

// ---------- S13: roadblocks on every bridge out of town ----------
export const S13 = scene({ Set: BridgeSet(1), cam: { from: [960, 600, 1.0], to: [960, 640, 1.12] }, back: (t) => <Helicopter x={kf(t, [[0, 1700], [120, 1300]])} y={160} s={0.45} t={t} beam={{ a: 16, len: 900, w: 260, o: 0.7 }} /> });

// ---------- S14: your face on every screen in the mall ----------
export const S14 = scene({
  Set: MALLS, cam: { from: [960, 420, 1.0], to: [960, 360, 1.15] }, words,
  front: () => <g><FoodTable x={600} y={MALL.feet + 60} /><FoodTable x={1350} y={MALL.feet + 80} /></g>,
  cast: [
    { look: N1, pose: { x: 420, y: HIP.mall(1), yaw: -0.3, look: -0.8, headTilt: -10 }, faces: [[0, 'shock']] },
    { look: N2, pose: { x: 1560, y: HIP.mall(1), yaw: 0.3, look: 0.8, headTilt: -10 }, faces: [[0, 'neutral'], [30, 'shock']] },
  ],
});

// ---------- S15: a man in the food court looks up from his phone, at the screen, then at you ----------
const Burger: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -50 0 Q -50 -44 0 -44 Q 50 -44 50 0 Z" fill="#E8A83A" stroke="#14151C" strokeWidth={4} />
    <rect x={-54} y={0} width={108} height={14} rx={6} fill="#6A3A1A" stroke="#14151C" strokeWidth={3} />
    <rect x={-56} y={12} width={112} height={8} rx={4} fill="#5BC08A" />
    <path d="M -50 20 H 50 Q 50 40 0 40 Q -50 40 -50 20 Z" fill="#E8A83A" stroke="#14151C" strokeWidth={4} />
  </g>
);
export const S15: React.FC<ShotProps> = (p) => {
  const { t, len, f } = p;
  const atScreen = cueAt(words, f, t, 'screen');
  const atYou = cueAt(words, f, t, 'you');
  const back = cueAt(words, f, t, 'back');
  const lookV = kf(t, [[atScreen - 4, 0.6], [atScreen + 2, -0.8], [atYou - 2, -0.8], [atYou + 4, 1], [back - 2, 1], [back + 4, -0.8]]);
  const S = scene({
    Set: MALLS, setT: 300, cam: { from: [880, 560, 1.75], to: [900, 560, 1.85] }, words,
    front: () => <g><FoodTable x={760} y={MALL.feet + 40} s={1.1} /><Burger x={700} y={MALL.feet - 300} s={0.9} /></g>,
    cast: (tt) => [{ look: MAN, pose: { x: 860, y: HIP.mall(1), yaw: 0.2, look: lookV, headTilt: kf(tt, [[atScreen - 4, 10], [atScreen + 2, -10]]), armR: { a: 60, b: -70 } }, faces: [[0, 'neutral'], [atYou + 4, 'shock'], [back + 4, 'worried']] }],
  });
  return <S {...p} />;
};

// ---------- S16: then he slowly puts his burger down ----------
export const S16 = insert({
  Bg: MALLS, push: 0.08,
  draw: (t, len) => {
    const k = clamp(t / Math.max(20, len - 10));
    return (
      <g>
        <rect x={300} y={780} width={1320} height={60} rx={20} fill="#F4F0E6" stroke="#8A8278" strokeWidth={6} />
        <path d={`M 1700 ${kf(t, [[0, 360], [len, 700]])} Q 1400 ${kf(t, [[0, 420], [len, 720]])} 1100 ${kf(t, [[0, 460], [len, 740]])}`} stroke="#3A6A5A" strokeWidth={110} fill="none" strokeLinecap="round" />
        <circle cx={1090} cy={kf(t, [[0, 460], [len, 740]])} r={70} fill="#26232F" />
        <Burger x={1000} y={kf(t, [[0, 420], [len, 700]])} s={2.6 - 0.2 * k} />
      </g>
    );
  },
});

// ---------- S17: and then the fifth star lights up ----------
export const S17: React.FC<ShotProps> = (p) => {
  const fifth = cueAt(words, p.f, p.t, 'fifth');
  const S = starsCU({ k: [[0, 4], [Math.max(4, fifth + 2), 5.25]], siren: 1 });
  return <S {...p} />;
};

// ---------- S18: every police officer in the city now has one job ----------
export const S18 = insert({ bgColor: '#0E1626', push: 0.1, draw: (t) => <DispatchMap t={t} close={kf(t, [[0, 0.1], [90, 0.75]])} n={14} dot={{ x: 960, y: 560 }} label="ALL UNITS" heli={clamp(t / 40)} /> });

// ---------- S19: you ----------
export const S19 = faceCU({ look: YOU, Bg: DAYP, faces: [[0, 'shock']], yaw: 0, look_: 0, stars: 5, zoom: [2.6, 2.8], siren: 0.8, shake: 8 });

// ---------- S20: all because you crossed on red ----------
export const S20 = insert({ Bg: DAY, push: 0.05, draw: (t) => <g transform="translate(960 1180) scale(2.1)"><WalkSignal x={0} y={0} red /></g> });

// ---------- S21: what if you got a five-star wanted level in real life? ----------
export const S21: React.FC<ShotProps> = (p) => {
  const { t, len } = p;
  const pose = { ...basePose, x: 960, y: 720, scale: 1, yaw: 0, look: 0 };
  return (
    <g>
      <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.08]]))}>
        <Soft blur={10} dim={0.35}>
          <g transform={camT(960, 560, 1.2)}>
            <DUSK t={t + 900} id="ti" />
          </g>
        </Soft>
        <Helicopter x={1500} y={220} s={0.5} t={t} beam={{ a: 30, len: 900, w: 300, o: 0.6 }} />
      </g>
      <g transform={camT(960, 600, 1.7)}>
        {people(t, [{ look: YOU, pose, faces: [[0, 'worried']], stars: 5, starS: 0.5 }])}
      </g>
      <TitleCard t={t} lines={series.title as [string, string]} accent={WANT.gold} accentT={30} size={100} />
      <SirenWash t={t} k={0.4} />
    </g>
  );
};
