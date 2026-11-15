import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, faceAt, Glow, factCard, FONT, shake } from '../../../engine';
import { YOU, TULLIA, FELIX, SOLDIER, CITIZENS, faceCU, bigWord, wordF } from '../common';
import { RomeStreet, ShopInside, ShopCounter, Burger, Coin, Smoke, romeHip, SHOP, P0, RomeSky, FarRome } from '../sets';
import { street, shop, queue, onStreet, atCounter, insert, streetSet, shopSet, realCard, countCard, walker, Chip } from '../kit';
import words from './words.json';

// Chapter 4, the catch: July heat and no fridge (meat goes bad in hours, a delivery thrown in the river, Felix buys
// meat three times a day); snow for the rich (Nero's chilled water); pepper from India (fifty million sesterces a year);
// charcoal smoke under wooden balconies (blocks up to twenty metres), the neighbours bang; rival cooks scratch a word
// into the counter; the emperors' bans on cookshops (Tiberius, Claudius, Nero: no hot food but beans and vegetables);
// crowds talk, talk turns to riots; three hundred people in your line, and two soldiers watching.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const DAY = streetSet({ mode: 'day' });
const BUSY = shopSet({});

/** A blazing sun with heat shimmer lines. */
const HeatSun: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <Glow x={1500} y={160} r={420} kind="warm" o={0.9} />
    <circle cx={1500} cy={160} r={90} fill="#FFE27A" />
    {Array.from({ length: 6 }).map((_, k) => (
      <path key={k} d={`M ${200 + k * 300} 700 q 20 -20 0 -40 q -20 -20 0 -40 q 20 -20 0 -40`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.25 + 0.15 * Math.sin(t / 4 + k)} transform={`translate(0 ${-(t * 2 + k * 30) % 120})`} />
    ))}
  </g>
);

// ---------- S1: JULY over the blazing street ----------
export const S1: React.FC<ShotProps> = ({ t }) => {
  const B = bigWord({ word: 'JULY', color: '#FF8A3D', Bg: DAY });
  return (
    <g>
      <B t={t} len={60} f={t} />
      <HeatSun t={t} />
    </g>
  );
};

// ---------- S2: over thirty degrees in the shade, and no fridge ----------
export const S2 = countCard({ kicker: 'ROME IN JULY, IN THE SHADE', to: 31, dur: 26, suffix: '°C', Bg: DAY });

// ---------- S3: raw meat on the counter goes grey; flies circle ----------
export const S3 = insert({
  Bg: BUSY, zoom: [2.0, 2.15], cy: 600, dim: 0.25,
  draw: (t) => {
    const g = clamp(t / 50);
    const col = `rgb(${Math.round(170 - 70 * g)},${Math.round(70 + 40 * g)},${Math.round(70 + 30 * g)})`;
    return (
      <g>
        <rect x={400} y={660} width={1120} height={300} fill="#EDE6DA" />
        <path d="M 760 660 Q 740 560 880 550 Q 1020 520 1120 580 Q 1200 640 1160 660 Z" fill={col} stroke={P0} strokeWidth={5} />
        <path d="M 820 610 Q 900 580 980 600" stroke="#F6E0D0" strokeWidth={8} fill="none" opacity={0.6 * (1 - g)} />
        {[0, 1, 2].map((k) => (
          <circle key={k} cx={960 + Math.cos(t / 4 + k * 2) * (120 + k * 30)} cy={480 + Math.sin(t / 3 + k) * 50} r={7} fill={P0} />
        ))}
        {g > 0.5 ? [0, 1].map((k) => <path key={k} d={`M ${900 + k * 120} 520 q 14 -20 0 -40 q -14 -20 0 -40`} stroke="#8AC040" strokeWidth={8} fill="none" opacity={(g - 0.5) * 2} />) : null}
      </g>
    );
  },
});

// ---------- S4: day eight: you and Felix carry a stinking crate to the river ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const x = 500 + t * 3.4;
  const bob = Math.abs(Math.sin(t * 0.3)) * 5;
  const pose = (dx: number, look: typeof YOU, s: number, seed: number): Pose => ({ ...basePose, x: x + dx, y: romeHip(s) - bob, scale: s, yaw: 0.7, expr: 'oops', armR: { a: 60, b: -40 }, armL: { a: 60, b: -40 }, legL: { a: Math.sin(t * 0.3 + seed) * 22, b: 0 }, legR: { a: -Math.sin(t * 0.3 + seed) * 22, b: 0 }, blink: idleBlink(t, seed) });
  return (
    <g transform={camT(x + 120, 560, 1.35)}>
      <RomeStreet t={t + 100} />
      <Chip t={t - 4} text="DAY 8" x={x - 760} y={-60} />
      <Hero look={FELIX} pose={pose(0, FELIX, 0.92, 1)} />
      <rect x={x + 60} y={romeHip(1) - 40 - bob} width={160} height={90} fill="#8A5A32" stroke={P0} strokeWidth={5} />
      {[0, 1, 2].map((k) => <path key={k} d={`M ${x + 90 + k * 50} ${romeHip(1) - 60 - bob} q 14 -20 0 -40 q -14 -20 0 -40`} stroke="#8AC040" strokeWidth={8} fill="none" opacity={0.6 + 0.4 * Math.sin(t / 3 + k)} />)}
      <Hero look={YOU} pose={pose(280, YOU, 1, 3)} />
    </g>
  );
};

// ---------- S5: Felix runs for meat three times a day ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, 1.3)}>
    <RomeStreet t={t + 300} />
    {walker(FELIX, 200, 1700, len * 0.7, t * 1.6, romeHip(0.92), 0.92, { expr: 'worried', tilt: 12 })}
    <Chip t={t - 10} text="× 3 A DAY" x={820} y={180} />
  </g>
);

// ---------- S6: snow, carried down from the mountains, packed in straw ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <RomeSky id="snw" t={t} mode="day" horizon={760} />
    {[[200, 900, 700], [900, 1200, 900], [1500, 1000, 760]].map(([cx, w, h], k) => (
      <g key={k}>
        <path d={`M ${cx - w / 2} 900 L ${cx} ${900 - h} L ${cx + w / 2} 900 Z`} fill={['#5A6A8A', '#4A5A7A', '#6A7A9A'][k]} stroke={P0} strokeWidth={5} />
        <path d={`M ${cx - w * 0.12} ${900 - h * 0.76} L ${cx} ${900 - h} L ${cx + w * 0.12} ${900 - h * 0.76} L ${cx + w * 0.05} ${900 - h * 0.72} L ${cx} ${900 - h * 0.78} L ${cx - w * 0.06} ${900 - h * 0.72} Z`} fill="#F6F8FF" />
      </g>
    ))}
    <rect x={-400} y={900} width={2800} height={400} fill="#8AA07A" />
    {/* a mule with two baskets of snow in straw */}
    <g transform={`translate(${300 + t * 4} 900)`}>
      <ellipse cx={0} cy={-90} rx={110} ry={50} fill="#7A6A5A" stroke={P0} strokeWidth={5} />
      <path d="M 90 -110 L 150 -170 L 170 -150 L 120 -90 Z" fill="#7A6A5A" stroke={P0} strokeWidth={5} />
      <path d="M 150 -170 L 140 -210 M 160 -168 L 166 -210" stroke={P0} strokeWidth={8} strokeLinecap="round" />
      {[-70, -30, 30, 70].map((lx, l) => <path key={l} d={`M ${lx} -50 L ${lx + Math.sin(t / 2 + l * 2) * 10} 0`} stroke={P0} strokeWidth={12} strokeLinecap="round" />)}
      <rect x={-80} y={-200} width={120} height={80} rx={14} fill="#D8B860" stroke={P0} strokeWidth={5} />
      <ellipse cx={-20} cy={-200} rx={56} ry={16} fill="#F6F8FF" stroke={P0} strokeWidth={4} />
    </g>
  </g>
);

// ---------- S7: the emperor drinks water chilled in snow ----------
export const S7 = realCard({ kicker: "THE EMPEROR'S DRINK", big: ['WATER CHILLED', 'IN SNOW'], sub: 'Pliny the Elder, Natural History 31.40', color: '#8FD3FF' });

// ---------- S8: you, with an almost empty purse ----------
export const S8 = faceCU({
  look: YOU, Bg: BUSY, faces: [[0, 'worried']], yaw: 0.2, eyes: 0.5, zoom: [2.8, 3.0], pose: { armR: { a: 120, b: -100 } },
  extra: () => (
    <g>
      <path d="M 1010 520 Q 980 460 1040 450 Q 1100 460 1070 520 Z" fill="#8A5A32" stroke={P0} strokeWidth={4} />
      <Coin x={1040} y={548} r={12} />
    </g>
  ),
});

// ---------- S9: pepper, on ships from India ----------
export const S9 = insert({
  Bg: DAY, zoom: [1.3, 1.4], cy: 540, dim: 0.4,
  draw: (t) => (
    <g>
      <path d="M 700 760 L 640 480 Q 760 420 880 480 L 820 760 Z" fill="#C8A878" stroke={P0} strokeWidth={6} />
      {Array.from({ length: 30 }).map((_, k) => <circle key={k} cx={680 + ((k * 37) % 180)} cy={470 + ((k * 13) % 30)} r={9} fill="#2A2224" />)}
      <g transform={`translate(${1200 + Math.sin(t / 20) * 30} ${600 + Math.sin(t / 8) * 6})`}>
        <path d="M -200 0 L 200 0 L 150 80 L -150 80 Z" fill="#8A5A32" stroke={P0} strokeWidth={6} />
        <path d="M 0 0 L 0 -260" stroke="#5A3A22" strokeWidth={12} />
        <path d="M 10 -250 Q 140 -150 10 -40 Z" fill="#E9E2D2" stroke={P0} strokeWidth={5} />
      </g>
      <text x={1200} y={820} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={6} fill="#F6EFE3" opacity={clamp((t - 20) / 6)}>FROM INDIA</text>
    </g>
  ),
});

// ---------- S10: fifty million sesterces a year ----------
export const S10 = factCard({ value: 50000000, label: 'SESTERCES A YEAR, DRAINED TO INDIA', sub: 'Pliny the Elder, Natural History 6.101' });

// ---------- S11: you shake pepper over a whole row of patties; Tullia winces ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const shakeA = Math.sin(t * 1.2) * 12;
  return (
    <g transform={camT(760, 500, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <ShopInside t={t + 400} />
      <Hero look={TULLIA} pose={{ ...basePose, x: 1100, y: SHOP.hip, yaw: -0.4, expr: 'worried', blink: idleBlink(t, 3) }} />
      <Hero look={YOU} pose={{ ...basePose, x: 700, y: SHOP.hip, yaw: 0.2, expr: 'happy', armR: { a: 100 + shakeA, b: -40 }, blink: idleBlink(t, 1) }} />
      <ShopCounter />
      {Array.from({ length: 12 }).map((_, k) => <circle key={k} cx={800 + Math.sin(k * 3) * 50} cy={480 + ((t * 8 + k * 20) % 220)} r={4} fill="#2A2224" />)}
    </g>
  );
};

// ---------- S12: the smoke climbs the front of the apartment block, past the wooden balconies ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(600, kf(t, [[0, 700], [len, 420]]), kf(t, [[0, 1.5], [len, 1.3]]))}>
    <RomeStreet t={t + 500} smoke={1.4} />
    <Smoke x={600} y={500} t={t + 30} o={1} h={500} dark />
    <Chip t={t - (at('twenty') - at('Then', 2))} text="UP TO 20 M TALL" x={900} y={160} />
  </g>
);

// ---------- S13: upstairs a neighbour bangs on the floor and shouts down through the smoke ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const bang = Math.abs(Math.sin(t / 3));
  return (
    <g transform={`${shake(t, 4, 30, 6)} ${camT(500, 280, 2.1)}`}>
      <RomeStreet t={t + 560} />
      <rect x={420} y={150} width={160} height={180} fill="#2A1E1E" stroke={P0} strokeWidth={5} />
      <Hero look={CITIZENS[5]} pose={{ ...basePose, x: 500, y: 330, scale: 0.8, yaw: 0, expr: 'oops', armR: { a: 150 - bang * 40, b: -20 }, talk: 0.4 + 0.5 * bang, blink: 0 }} shadow={0} />
      <rect x={400} y={300} width={200} height={40} fill="#6A4026" stroke={P0} strokeWidth={4} />
      <Smoke x={480} y={420} t={t + 50} o={0.8} h={300} dark />
    </g>
  );
};

// ---------- S14: across the street, the other cooks glare, arms folded ----------
export const S14 = street({
  shop: false,
  cast: [0, 1, 2].map((k) => onStreet(CITIZENS[k * 2], 760 + k * 220, { yaw: -0.3, faces: [[0, 'smug'], [40, 'oops']], pose: { armL: { a: 60, b: -120 }, armR: { a: 60, b: -120 } } }, 0.95)),
  cam: { from: [980, 540, 1.5], to: [980, 520, 1.7] },
});

// ---------- S15: a word scratched into your counter ----------
export const S15 = insert({
  Bg: BUSY, zoom: [1.9, 2.05], cy: 620, dim: 0.2,
  draw: (t) => (
    <g>
      <rect x={300} y={500} width={1320} height={400} fill="#EDE6DA" />
      <path d="M 300 560 L 1620 560" stroke="#C8BCA8" strokeWidth={4} />
      <text x={960} y={760} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={200} fill="none" stroke="#7A6A5A" strokeWidth={6} strokeDasharray="1600" strokeDashoffset={1600 * (1 - clamp(t / 30))}>
        FVR!
      </text>
    </g>
  ),
});

// ---------- S16: Felix, very quietly, leans in to tell you something ----------
export const S16 = shop({
  cast: [atCounter(YOU, 820, { yaw: 0.4, faces: [[0, 'neutral'], [40, 'worried']] }), atCounter(FELIX, 1040, { yaw: -0.5, faces: [[0, 'worried']], talk: [[60.2, 62.4]], pose: { tilt: -8 } }, 0.92)],
  words: W, cam: { from: [930, 480, 2.0], to: [930, 470, 2.15] }, grill: 0.4,
});

// ---------- S17: Roman emperors don't like places where crowds gather ----------
export const S17 = realCard({ kicker: 'ROMAN EMPERORS', big: ['DO NOT LIKE', 'CROWDS THAT EAT'], real: false });

// ---------- S18: Tiberius: not even pastries. Claudius: taverns shut ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const c = at('Claudius') - at('Tiberius');
  const R = realCard({ kicker: 'THE BANS', big: [], real: false });
  const row = (y: number, who: string, what: string, t0: number) => (
    <g opacity={clamp((t - t0) / 6)} transform={`translate(0 ${(1 - easeOut(clamp((t - t0) / 8))) * 40})`}>
      <text x={500} y={y} fontFamily={FONT.title} fontWeight={700} fontSize={84} fill="#FF8A3D">{who}</text>
      <text x={1060} y={y} fontFamily={FONT.ui} fontSize={48} fill="#F6EFE3">{what}</text>
    </g>
  );
  return (
    <g>
      <R t={t} len={len} f={t} />
      {row(470, 'TIBERIUS', 'NOT EVEN PASTRIES', 4)}
      {row(640, 'CLAUDIUS', 'TAVERNS SHUT', c)}
    </g>
  );
};

// ---------- S19: Nero, the emperor right now: no hot food, except beans and vegetables ----------
export const S19 = realCard({ kicker: 'NERO, THE EMPEROR RIGHT NOW', big: ['NO HOT FOOD', 'EXCEPT BEANS & VEG'], sub: 'Suetonius, Nero 16 · Tiberius 34 · Cassius Dio 60.6', color: '#FF4A3A' });

// ---------- S20: hundreds of people meet at your counter every day, and talk ----------
export const S20: React.FC<ShotProps> = (p) => {
  const S = shop({ cast: [atCounter(YOU, 760, { yaw: 0.2, faces: [[0, 'neutral']] }), atCounter(TULLIA, 1100, { yaw: -0.2, faces: [[0, 'neutral']] })], burgers: 3, crowd: 5, cam: { from: [960, 560, 1.1], to: [960, 560, 1.18] } });
  return (
    <g>
      <S {...p} />
      {[0, 1, 2, 3].map((k) => {
        const q = backOut(clamp((p.t - k * 18) / 8)) * (p.t - k * 18 < 50 ? 1 : 0);
        return <g key={k} transform={`translate(${300 + k * 420} ${640 - (k % 2) * 80}) scale(${q})`}><ellipse rx={70} ry={44} fill="#F6EFE3" stroke={P0} strokeWidth={4} /><text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={40} fill={P0}>...</text></g>;
      })}
    </g>
  );
};

// ---------- S21: in Rome, talk can turn into a riot: an angry crowd at dusk ----------
export const S21 = street({
  mode: 'dusk', shop: false,
  cast: Array.from({ length: 6 }).map((_, k) => onStreet(CITIZENS[k], 560 + k * 170, { yaw: k % 2 ? -0.3 : 0.3, faces: [[0, 'oops']], pose: { armR: { a: 150 + (k % 3) * 8, b: -20 } }, seed: k }, 0.9)),
  cam: { from: [990, 540, 1.3], to: [990, 520, 1.45] },
});

// ---------- S22: you look out at the line: three hundred people, all talking ----------
export const S22 = street({
  cast: [onStreet(YOU, 520, { yaw: 0.6, faces: [[0, 'worried']] }), ...queue(10, 860, 2200, 6, { faces: [[0, 'happy']] })],
  cam: { from: [900, 540, 1.05], to: [1100, 540, 0.95] },
});

// ---------- S23: across the street, two soldiers watching ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 990]]), 500, kf(t, [[0, 1.4], [len, 1.9]]))}>
    <RomeStreet t={t + 700} shop={false} />
    <Hero look={SOLDIER} pose={{ ...basePose, x: 880, y: romeHip(1), yaw: 0.1, look: 0.3, expr: 'smug', armL: { a: 60, b: -120 }, armR: { a: 60, b: -120 }, blink: idleBlink(t, 2) }} />
    <Hero look={SOLDIER} pose={{ ...basePose, x: 1080, y: romeHip(1), yaw: -0.1, look: 0.3, expr: 'neutral', blink: idleBlink(t, 5) }} />
  </g>
);
