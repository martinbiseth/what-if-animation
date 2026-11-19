import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, FONT, stand, Schematic, SCH, SchLabel, DrawOn, factCard, Kitchen, KITCHEN, KitchenIsland, talkShot, Glow, UI } from '../../../engine';
import {
  YOU, MOM, SUIT, Body, Soft, faceCU, bigWord, wordF, HeadBar, overHead, Pow, BAR, barColor, Car, StreetModern, STREETM, streetHip, CityNight, NewsTV, Hallway, HALL, Tablet, CityMap, Heart,
} from '../common';
import words from './words.json';

// Chapter 5, someone notices: two more days, two more respawns; the power company's chart (three blackouts, each one
// longer); the news; Mom; your stomach. A black car, the man in the grey suit at your locker, the tablet map with three
// red dots. Half a second, one, two: it doubles. Hospitals, traffic lights, elevators; ten more and it's half an hour.
// Don't respawn. Not once. A card with a number, and he's gone. The bar, full and green, and now you're scared of it.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const HL: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Hallway t={t} id={id} />;
const KIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} veil={0.3} />;
const span = (a: string, b: string, n = 1, m = 1): [number, number] => [at(a, n) / 30 - 0.1, at(b, m) / 30 + 0.4];
const YOUP = stand(HALL, 0.4, 0.55), SUITP = stand(HALL, 0.6, 0.55);

// ---------- S1: two more days, two more respawns ----------
export const S1 = bigWord({ kicker: 'TWO MORE DAYS', word: '2 MORE RESPAWNS', color: BAR.g, Bg: HL, size: 150 });

// ---------- S2: the power company's chart: three dips, each one longer ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const dips = [[520, 0.5], [960, 1], [1400, 2]] as const;
  let d = 'M 160 420';
  dips.forEach(([x, s]) => {
    const w = 40 * s;
    d += ` L ${x - w} 420 L ${x - w + 6} 820 L ${x + w - 6} 820 L ${x + w} 420`;
  });
  d += ' L 1760 420';
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
        <Schematic t={t} id="c5s2" />
      </g>
      <SchLabel x={960} y={200} t={t - 2} text="CITY POWER GRID · THIS WEEK" size={44} color={SCH.dim} />
      <DrawOn d={d} t={t - 4} dur={40} color={SCH.live} width={7} />
      {dips.map(([x, s], i) => (
        <g key={i}>
          <SchLabel x={x} y={900} t={t - 14 - i * 12} text={`${s} S`} size={44} color={SCH.live} />
          <g opacity={clamp((t - 14 - i * 12) / 6)}>
            <path d={`M ${x} 350 L ${x} 380 M ${x - 15} 365 L ${x + 15} 365`} stroke="#FF4A3A" strokeWidth={7} />
            <rect x={x - 26} y={338} width={52} height={54} rx={8} fill="none" stroke="#FF4A3A" strokeWidth={4} />
          </g>
        </g>
      ))}
    </g>
  );
};

// ---------- S3: the news: a grid glitch ----------
export const S3: React.FC<ShotProps> = ({ t }) => (
  <NewsTV t={t} banner='"A GRID GLITCH"'>
    <CityNight t={t + 40} power={0} />
  </NewsTV>
);

// ---------- S4: Mom at the kitchen island: "weird" ----------
const MOMP = stand(KITCHEN, 0.6, 0.4), YK = stand(KITCHEN, 0.38, 0.4);
export const S4 = talkShot({
  Set: KIT, words: W, id: 'c5s4',
  cast: [
    { look: YOU, ...YK, yaw: 0.5, faces: [[0, 'neutral'], [40, 'worried']] },
    { look: MOM, ...MOMP, yaw: -0.5, seed: 3, talk: [span('mom', 'weird')], faces: [[0, 'neutral']] },
  ],
  cam: { from: [960, YK.y - 80, 1.75], to: [960, YK.y - 80, 1.9] },
  front: () => <KitchenIsland />,
});

// ---------- S5: your face: the stomach drop ----------
export const S5 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'neutral'], [20, 'worried']], yaw: 0.2, zoom: [3.0, 3.5], extra: (t) => <HeadBar x={960} y={420} s={0.7} p={1} t={t} /> });

// ---------- S6: the next morning: a black car outside the school ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 560, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <StreetModern t={t + 30} mode="day" car={false} />
    <rect x={420} y={240} width={600} height={70} rx={8} fill="#16141C" opacity={0.85} />
    <text x={720} y={292} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#F6EFE3">WESTFIELD MIDDLE SCHOOL</text>
    <Car x={1300} y={STREETM.feet + 120} s={1.1} color="#14141A" />
    <Glow x={1420} y={STREETM.feet - 60} r={60} kind="cool" o={0.4} />
  </g>
);

// ---------- S7: the man in the grey suit by your locker; you walk up ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, YOUP.x - 300], [Math.max(20, len - 20), YOUP.x]]);
  const walking = t < len - 20;
  const you: Pose = { ...basePose, x, y: YOUP.y + (walking ? Math.abs(Math.sin(t / 4)) * -6 : 0), scale: YOUP.scale, yaw: 0.6, legL: { a: walking ? 20 * Math.sin(t / 4) : 5, b: 0 }, legR: { a: walking ? -20 * Math.sin(t / 4) : -5, b: 0 } };
  return (
    <g transform={camT(960, YOUP.y - 80, kf(t, [[0, 1.3], [len, 1.45]]))}>
      <HL t={t + 30} />
      <Body look={SUIT} pose={{ ...basePose, ...SUITP, yaw: -0.4, armL: { a: 10, b: -40 }, armR: { a: 10, b: -40 } }} t={t} faces={[[0, 'neutral']]} seed={8} shadow={1} />
      <Body look={YOU} pose={you} t={t} faces={[[0, 'neutral'], [len - 18, 'worried']]} shadow={1} />
      <HeadBar {...overHead({ ...you, y: YOUP.y })} p={1} t={t} />
    </g>
  );
};

// ---------- S8: no hello: he holds up the tablet ----------
export const S8: React.FC<ShotProps> = ({ t, len, f }) => {
  const up = Math.max(6, rel(f, t, 'holds'));
  const k = easeOut(clamp((t - up) / 10));
  return (
    <g transform={camT(SUITP.x - 60, SUITP.y - 120, kf(t, [[0, 2.0], [len, 2.15]]))}>
      <HL t={t + 70} />
      <Body look={SUIT} pose={{ ...basePose, ...SUITP, yaw: -0.4, armL: { a: 10 + 70 * k, b: -60 * k }, armR: { a: 10 + 80 * k, b: -50 * k } }} t={t} faces={[[0, 'neutral']]} seed={8} shadow={1} />
      {k > 0 ? <Tablet x={SUITP.x - 120 * SUITP.scale} y={SUITP.y - 100 * SUITP.scale} s={0.35 * SUITP.scale * k} rot={-6} /> : null}
      <Body look={YOU} pose={{ ...basePose, ...YOUP, yaw: 0.5 }} t={t} faces={[[0, 'worried']]} shadow={1} />
    </g>
  );
};

// ---------- S9: the tablet: a map, three red dots, three times ----------
export const S9: React.FC<ShotProps> = ({ t, f }) => {
  const d = Math.max(10, rel(f, t, 'three'));
  return (
    <g>
      <Soft blur={16} dim={0.5}>
        <HL t={t + 100} />
      </Soft>
      <Tablet x={960} y={540} s={2.2} rot={-2}>
        <CityMap t={t} dots={[{ x: 120, y: 120, at: d, label: '7:42 PM' }, { x: 330, y: 300, at: d + 10, label: '11:15 AM' }, { x: 460, y: 90, at: d + 20, label: '6:03 PM' }]} />
      </Tablet>
    </g>
  );
};

// ---------- S10: the suit: "Half a second. Then one second. Then two." ----------
export const S10: React.FC<ShotProps> = (p) => {
  const S = faceCU({ look: SUIT, Bg: HL, faces: [[0, 'neutral']], yaw: -0.3, words: W, talk: span('Half', 'doubles'), zoom: [3.0, 3.2] });
  return <S {...p} />;
};

// ---------- S11: it doubles: three bars, then a question mark ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
      <Schematic t={t} id="c5s11" />
    </g>
    <SchLabel x={960} y={200} t={t - 2} text="EVERY RESPAWN, THE BLACKOUT DOUBLES" size={42} color={SCH.dim} />
    {[0.5, 1, 2, 4].map((s, i) => {
      const k = easeOut(clamp((t - 6 - i * 10) / 10));
      const h = 90 * s * k;
      return (
        <g key={i}>
          <rect x={460 + i * 280} y={860 - h} width={160} height={h} fill={i === 3 ? 'none' : SCH.live} stroke={SCH.live} strokeWidth={i === 3 ? 4 : 0} strokeDasharray={i === 3 ? '12 10' : undefined} />
          <SchLabel x={540 + i * 280} y={920} t={t - 6 - i * 10} text={i === 3 ? 'NEXT?' : `${s} S`} size={40} color={i === 3 ? '#FF4A3A' : SCH.line} />
        </g>
      );
    })}
  </g>
);

// ---------- S12: he leans closer ----------
export const S12 = talkShot({
  Set: HL, words: W, id: 'c5s12',
  cast: [
    { look: YOU, x: 860, y: 700, scale: 1, yaw: 0.5, faces: [[0, 'worried']] },
    { look: SUIT, x: 1100, y: 700, scale: 1, yaw: -0.5, seed: 8, talk: [span('Hospitals', 'Elevators')], faces: [[0, 'neutral']], pose: { tilt: -10 } },
  ],
  cam: { from: [980, 540, 2.2], to: [1000, 540, 2.45] },
});

// ---------- S13: traffic lights and elevators going dark: a night street losing power ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <StreetModern t={t + 30} mode="night" power={t < 20 ? 1 : 0} sweep={undefined} car={true} />
    {t >= 20 ? <rect x={-400} y={-400} width={2800} height={1900} fill="#000" opacity={0.25} /> : null}
  </g>
);

// ---------- S14: ten more and it's over half an hour ----------
export const S14 = factCard({ value: 34, suffix: ' MIN', label: 'TEN MORE RESPAWNS', sub: '2 S × 2¹⁰ = 2,048 S', real: false });

// ---------- S15: you: "So I just don't respawn." ----------
export const S15: React.FC<ShotProps> = (p) => {
  const S = faceCU({ look: YOU, Bg: HL, faces: [[0, 'worried']], yaw: 0.3, words: W, talk: span('So', 'respawn'), zoom: [3.0, 3.15], extra: (t) => <HeadBar x={960} y={420} s={0.7} p={1} t={t} /> });
  return <S {...p} />;
};

// ---------- S16: the suit: "Exactly. Don't. Not once." ----------
export const S16: React.FC<ShotProps> = (p) => {
  const S = faceCU({ look: SUIT, Bg: HL, faces: [[0, 'neutral']], yaw: -0.25, words: W, talk: span('Exactly', 'understand'), zoom: [3.2, 3.5], dark: 0.1 });
  return <S {...p} />;
};

// ---------- S17: a card with a phone number; then he's gone ----------
export const S17: React.FC<ShotProps> = ({ t, len, f }) => {
  const gone = rel(f, t, 'gone');
  return (
    <g>
      <g transform={camT(960, YOUP.y - 80, 1.3)}>
        <HL t={t + 130} />
        {t < gone ? <Body look={SUIT} pose={{ ...basePose, ...SUITP, yaw: -0.4, armR: { a: 70, b: -20 } }} t={t} faces={[[0, 'neutral']]} seed={8} shadow={1} /> : null}
        <Body look={YOU} pose={{ ...basePose, ...YOUP, yaw: t < gone ? 0.5 : 0, armR: { a: 50, b: -60 } }} t={t} faces={[[0, 'worried'], [gone, 'shock']]} shadow={1} />
      </g>
      <g transform={`translate(1500 300) rotate(-6) scale(${backOut(clamp((t - 6) / 8))})`}>
        <rect x={-220} y={-120} width={440} height={240} rx={14} fill="#F6EFE3" stroke="#16141C" strokeWidth={5} />
        <text textAnchor="middle" y={-30} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#16141C">GRID SECURITY</text>
        <text textAnchor="middle" y={40} fontFamily={FONT.ui} fontSize={44} fill="#16141C">555-0199</text>
      </g>
    </g>
  );
};

// ---------- S18: alone in the hallway, the bar over your head ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.15]]))}>
    <HL t={t + 160} />
    <Body look={YOU} pose={{ ...basePose, ...stand(HALL, 0.5, 0.5), yaw: 0 }} t={t} faces={[[0, 'worried']]} shadow={1} />
    <HeadBar {...overHead(stand(HALL, 0.5, 0.5))} p={1} t={t} />
  </g>
);

// ---------- S19: the bar, close: full and green ----------
export const S19: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Soft blur={16} dim={0.45}>
      <HL t={t + 200} />
    </Soft>
    <HeadBar x={1000} y={540} s={3.2} p={1} t={t} />
  </g>
);

// ---------- S20: every chunk = a step closer to the next blackout: the bar's chunks against city lights ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const n = 6;
  const gone = Math.min(n, Math.floor(Math.max(0, t - 20) / 14));
  return (
    <g>
      <g transform={camT(960, 640, 1.0)}>
        <CityNight t={t + 50} power={1 - gone / n} hospital={false} />
      </g>
      <rect width={1920} height={1080} fill="#000" opacity={0.25 + 0.4 * (gone / n)} />
      <g transform="translate(560 300)">
        <Heart x={-60} y={0} s={2} c={barColor(1 - gone / n)} />
        {Array.from({ length: n }).map((_, i) => (
          <rect key={i} x={i * 140} y={-40} width={124} height={80} rx={14} fill={i < n - gone ? barColor(1 - gone / n) : '#2A2438'} stroke="#F6EFE3" strokeWidth={4} />
        ))}
      </g>
    </g>
  );
};

// ---------- S21: the city dark, and in the middle of it a hospital ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(950, 520, kf(t, [[0, 1.0], [len, 1.35]]))}>
      <CityNight t={t + 90} power={0} hospital={true} />
      <Glow x={950} y={410} r={140 + 20 * Math.sin(t / 4)} kind="red" o={0.7} />
    </g>
  </g>
);
