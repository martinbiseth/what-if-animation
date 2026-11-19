import React from 'react';
import { ShotProps, camT, kf, clamp, backOut, factCard, Helicopter, Badge, Folder, NewsScreen, DispatchMap, FONT, WANT, SUBURB, stand, KITCHEN, KitchenIsland, rnd } from '../../../engine';
import words from './words.json';
import { YOU, MUM, ELLIE, REYES, HomeSet, KitchenSet, scene, faceCU, starsCU, insert, cueAt, starCard, span, Who } from '../common';

// Chapter 5, someone notices: a knock on Saturday; Detective Reyes, grey coat, folder, badge; the kitchen table;
// thirty-seven calls in four days; she looks above your head; the US Marshals (73,000 in one year); "I know how this
// ends if you run"; the news: the dispatch computer keeps sending cars to your street; four stars; 18,000 agencies;
// the red dot is your house; the helicopter.

const DAY = HomeSet('morning');
const KIT = KitchenSet({ veil: 0.12 });
const KITP = KitchenSet({ veil: 0.2, police: 0.7 });
const FOLDER = (x: number, y: number, s = 0.32, rot = -10) => <Folder x={x} y={y} s={s} rot={rot} />;

// ---------- S1: chapter 5 ----------
export const S1 = starCard({ kicker: 'CHAPTER 5', title: 'SOMEONE NOTICES', seed: 13, n: 3 });

// ---------- S2: Saturday morning, a knock at the door ----------
export const S2 = scene({
  Set: DAY, setT: 100, cam: { from: [860, 540, 1.6], to: [880, 540, 1.7] }, words,
  cast: (t, f) => {
    const k = cueAt(words, f, t, 'knock');
    return [{ look: REYES, pose: { x: 930, y: SUBURB.feet - 170, yaw: -0.8, look: -0.8, armR: { a: kf(t, [[k - 6, 20], [k, 100], [k + 4, 80], [k + 8, 100], [k + 12, 80], [k + 18, 20]]), b: -60 } }, faces: [[0, 'neutral']] }];
  },
  front: () => FOLDER(980, 560),
});

// ---------- S3: not an officer in uniform: a woman in a grey coat, with a folder ----------
export const S3 = faceCU({ look: REYES, Bg: DAY, faces: [[0, 'neutral']], yaw: -0.3, zoom: [2.1, 2.25], extra: () => FOLDER(1060, 690, 0.45) });

// ---------- S4: Detective Reyes ----------
export const S4 = insert({ Bg: DAY, push: 0.1, draw: (t) => <Badge x={960} y={540} s={2.4 * backOut(clamp(t / 8))} rot={-6} /> });

// ---------- S5: the kitchen table; Mum makes coffee; Ellie stares at the badge ----------
const RE = stand(KITCHEN, 0.28, 0.42), MU = stand(KITCHEN, 0.84, 0.25), EL = stand(KITCHEN, 0.5, 0.5), ME = stand(KITCHEN, 0.68, 0.42);
const Mug: React.FC<{ x: number; y: number }> = ({ x, y }) => <g transform={`translate(${x} ${y})`}><rect x={-22} y={-40} width={44} height={40} rx={6} fill="#F4F0E6" stroke="#14151C" strokeWidth={4} /><path d="M 22 -30 q 18 10 0 22" stroke="#14151C" strokeWidth={4} fill="none" /></g>;
const KITCAST = (t: number, o: { reyesTalk?: [number, number][]; you?: Partial<Who>; reyes?: Partial<Who>; stars?: Who['stars'] } = {}): Who[] => [
  { look: REYES, pose: { x: RE.x, y: RE.y, scale: RE.scale, yaw: 0.6, look: 0.7 }, faces: [[0, 'neutral']], talk: o.reyesTalk, ...o.reyes },
  { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: -0.6, look: -0.8, armR: { a: 50, b: -70 } }, faces: [[0, 'worried']] },
  { look: ELLIE, pose: { x: EL.x, y: EL.y, scale: EL.scale * 0.72, yaw: -0.4, look: -1 }, faces: [[0, 'shock']] },
  { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.4, look: -0.6 }, faces: [[0, 'worried']], stars: o.stars ?? 3, ...o.you },
];
export const S5 = scene({
  Set: KIT, setT: 200, cam: { from: [960, 560, 1.25], to: [960, 560, 1.32] }, words,
  cast: (t) => KITCAST(t),
  front: () => <g><KitchenIsland /><Mug x={RE.x + 120} y={600} />{FOLDER(RE.x + 230, 600, 0.25, 0)}</g>,
});

// ---------- S6: "Thirty-seven police calls in four days" ----------
export const S6: React.FC<ShotProps> = (p) => {
  const c = (w: string) => cueAt(words, p.f, p.t, w);
  const items = [['37 CALLS / 4 DAYS', c('Thirtyseven')], ['candy wrapper', c('candy')], ['grass', c('grass')], ['library book', c('library')], ['skateboard', c('skateboard')]] as [string, number][];
  const I = insert({
    bgColor: '#4A3A30', push: 0.06,
    draw: (t) => (
      <Folder x={960} y={560} s={2.2} rot={-2} open={1} paper={
        <g>
          {items.map(([txt, at], i) => (
            <text key={i} x={14} y={-90 + i * 46} fontFamily="Kalam, cursive" fontWeight={700} fontSize={i ? 24 : 22} fill={i ? '#26232F' : '#C83A3A'} opacity={clamp((t - at) / 6)}>{txt}</text>
          ))}
        </g>
      } />
    ),
  });
  return <I {...p} />;
};

// ---------- S7: "All of them for one fourteen-year-old... they just knew where to go" ----------
export const S7 = faceCU({ look: REYES, Bg: KIT, faces: [[0, 'neutral'], [90, 'worried']], yaw: 0.35, words, talk: [span(words, 'All', 'go')], zoom: [2.6, 2.75] });

// ---------- S8: she looks at the space above your head, for slightly too long ----------
export const S8 = faceCU({ look: REYES, Bg: KIT, faces: [[0, 'neutral'], [30, 'worried']], yaw: 0.35, look_: 0.8, zoom: [3.0, 3.2], pose: { headTilt: -14 } });
export const S9 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'worried'], [26, 'oops']], yaw: -0.35, stars: 3, zoom: [2.6, 2.8] });

// ---------- S10: "You're thinking of running. Everyone does." ----------
export const S10 = scene({
  Set: KIT, setT: 400, cam: { from: [(RE.x + EL.x) / 2, 500, 1.65], to: [(RE.x + EL.x) / 2, 500, 1.72] }, words,
  cast: (t) => KITCAST(t, { reyesTalk: [span(words, "You're", 'does')] }),
  front: () => <g><KitchenIsland /><Mug x={RE.x + 120} y={600} /></g>,
});

// ---------- S11: the US Marshals, more than 73,000 in one year ----------
export const S11 = factCard({ value: 73000, suffix: '+', label: 'PEOPLE ON THE RUN, CAUGHT IN ONE YEAR', sub: 'US Marshals Service, fiscal year 2023', format: (v) => Math.round(v).toLocaleString('en-US') });

// ---------- S12: "I don't know what's happening to you. But I know how this ends if you run." ----------
export const S12 = scene({
  Set: KIT, setT: 500, cam: { from: [(RE.x + ME.x) / 2, 500, 1.6], to: [(RE.x + ME.x) / 2, 500, 1.68] }, words,
  cast: (t) => KITCAST(t, { reyesTalk: [span(words, 'I', 'you'), span(words, 'But', 'run')], reyes: { faces: [[0, 'worried']] } }),
  front: () => <g><KitchenIsland /><Mug x={RE.x + 120} y={600} /></g>,
});

// ---------- S13: the TV switches to the news ----------
export const S13 = insert({
  Bg: KIT, push: 0.06,
  draw: (t) => (
    <g>
      <rect x={300} y={140} width={1320} height={780} rx={20} fill="#121218" stroke="#2A2A34" strokeWidth={10} />
      <NewsScreen x={320} y={160} w={1280} h={720} t={t} headline="DISPATCH COMPUTER GLITCH?" kind="map" id="tv13" />
    </g>
  ),
});

// ---------- S14: it keeps sending police cars to the same street. Your street ----------
export const S14 = insert({ bgColor: '#0E1626', push: 0.14, draw: (t) => <DispatchMap t={t} close={kf(t, [[0, 0.3], [90, 0.6]])} n={10} dot={{ x: 960, y: 540 }} label="MAPLE STREET" /> });

// ---------- S15: at four stars ----------
export const S15 = starsCU({ k: [[0, 3], [6, 4.25]], Bg: KITP, siren: 0.6, label: 'FOUR STARS' });

// ---------- S16: almost 18,000 police agencies, around 700,000 officers ----------
export const S16 = factCard({ value: 18000, label: 'POLICE AGENCIES IN AMERICA', sub: 'and around 700,000 officers (Bureau of Justice Statistics)', format: (v) => Math.round(v).toLocaleString('en-US') });

// ---------- S17: on the news, a map with a little red dot that won't stop flashing ----------
export const S17 = insert({ bgColor: '#0E1626', push: 0.3, draw: (t) => <NewsScreen x={0} y={0} w={1920} h={1080} t={t} headline="POLICE SURROUND STREET" kind="map" id="tv17" /> });

// ---------- S18: the dot is your house. Outside, a helicopter ----------
export const S18 = scene({
  Set: HomeSet('morning', { police: 1 }), setT: 300, cam: { from: [865, 420, 1.15], to: [865, 380, 1.25] }, siren: 0.3,
  back: (t) => <Helicopter x={kf(t, [[0, 1700], [90, 1250]])} y={60} s={0.6} t={t} beam={{ a: 22, len: 1100, w: 340, o: 0.5 }} />,
});

// ---------- S19: a helicopter ----------
export const S19 = faceCU({ look: YOU, Bg: KITP, faces: [[0, 'shock']], yaw: 0.2, look_: 0.3, stars: 4, zoom: [2.6, 2.9], siren: 0.6, pose: { headTilt: -10 } });

// ---------- S11B: "Most of them thought they had hidden really well." ----------
export const S11B = faceCU({ look: REYES, Bg: KIT, faces: [[0, 'neutral'], [40, 'smug']], yaw: 0.35, words, talk: [span(words, 'Most', 'well')], zoom: [2.7, 2.85] });
