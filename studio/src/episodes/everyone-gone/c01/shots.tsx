import React from 'react';
import { ShotProps, camT, kf, clamp, backOut, TitleCard, Mug, CarKey, Smartphone, Laptop, Globe, Glow, Bus, Bedroom, BedDuvet, bedSit, Hero, basePose, KITCHEN, stand, FONT, TOWN, SUBURB, MALL, FoodTable, rnd } from '../../../engine';
import words from './words.json';
import series from '../series.json';
import {
  YOU, EG, TownSet, HomeSet, KitchenSet, ShopSet, MallSet, scene, faceCU, insert, walk, run, cueAt, people, Soft, Noodle, CityBus, StoppedCar, DigitalClock, DustField, BedroomSet,
} from '../common';

// Chapter 1, the cold open: 7:12 and silent; the street, the town; Mum's coffee still warm, her keys, her alarm;
// the bus with its engine running; a dog dragging its lead; you shout; you check everything; everything is where it
// was, except the people; the world's population counts down to one; you; the title.

const MORN = TownSet('morning');
const MORNB = TownSet('morning', { bus: true });
const HOME = HomeSet('morning');
const KIT = KitchenSet({ veil: 0.12 });
const BED = BedroomSet({ clock: '07:12', veil: 0.25 });

// ---------- S1: 7:12 ----------
export const S1 = insert({ Bg: BED, push: 0.1, draw: (t) => <DigitalClock x={960} y={540} s={1.3} text="7:12" t={t} /> });

// ---------- S2: you, in bed, eyes open: something is wrong ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const p = bedSit(0.2);
  const pose = { ...basePose, ...p, yaw: 0.2, look: kf(t, [[0, -0.6], [20, 0.6], [40, -0.2]]), headTilt: -6, expr: (t > 18 ? 'worried' : 'tired') as 'worried', blink: t < 8 ? 1 : 0 };
  return (
    <g transform={camT(p.x + 40, p.y - 60, kf(t, [[0, 2.1], [len, 2.3]]))}>
      <Bedroom t={t + 60} id="b2" veil={0.25} clock="07:12" lamp={0} crossed={0} duvet={false} />
      <Hero look={YOU} pose={pose} shadow={0} />
      <BedDuvet />
    </g>
  );
};

// ---------- S3: it's quiet, too quiet: the street from the window ----------
export const S3 = scene({ Set: HOME, cam: { from: [960, 500, 1.0], to: [960, 480, 1.08] } });

// ---------- S4: no traffic, no birds: downtown, stopped ----------
export const S4 = scene({ Set: MORN, cam: { from: [700, 520, 1.0], to: [900, 520, 1.05] } });

// ---------- S5: no Mum shouting: the kitchen, empty; you in the doorway ----------
export const S5 = scene({
  Set: KIT, cam: { from: [960, 520, 1.15], to: [960, 540, 1.2] },
  cast: (t) => [{ look: YOU, pose: { ...stand(KITCHEN, 0.85, 0.55), yaw: -0.5, look: -0.6 }, faces: [[0, 'neutral'], [26, 'worried']] }],
});

// ---------- S6: her coffee, still warm; her keys ----------
export const S6 = insert({
  Bg: KIT, push: 0.1,
  draw: (t) => (
    <g>
      <rect x={-100} y={760} width={2200} height={400} fill="#8A6A4A" />
      <rect x={-100} y={760} width={2200} height={14} fill="#A8885A" />
      <g transform="translate(960 760) scale(2.6) translate(-820 -760)"><Mug x={820} y={760} rot={0} steam={1} f={t} /></g>
    </g>
  ),
});

// ---------- S6B: her car keys next to it ----------
export const S6B = insert({
  Bg: KIT, push: 0.12,
  draw: () => (
    <g>
      <rect x={-100} y={700} width={2200} height={500} fill="#8A6A4A" />
      <rect x={-100} y={700} width={2200} height={14} fill="#A8885A" />
      <g transform="translate(960 780) scale(4) translate(-960 -780)"><CarKey x={960} y={780} s={1} rot={20} /></g>
    </g>
  ),
});

// ---------- S7: her phone's alarm going off, nobody turning it off ----------
export const S7 = insert({
  Bg: KIT, push: 0.08,
  draw: (t) => (
    <g transform={`translate(${Math.sin(t * 2.2) * 6} 0)`}>
      <Smartphone x={960} y={560} s={1.2} rot={-8} mode="clock" text="7:15" t={t} buzz={1} />
      {[0, 1].map((i) => <path key={i} d={`M ${1200 + i * 40} 420 q 30 40 0 80`} stroke="#F6EFE3" strokeWidth={8} fill="none" opacity={0.6 + 0.4 * Math.sin(t / 2 + i)} />)}
      {[0, 1].map((i) => <path key={`l${i}`} d={`M ${720 - i * 40} 420 q -30 40 0 80`} stroke="#F6EFE3" strokeWidth={8} fill="none" opacity={0.6 + 0.4 * Math.sin(t / 2 + i)} />)}
    </g>
  ),
});

// ---------- S8: outside, a bus stopped in the middle of the road, doors open, engine running ----------
export const S8 = scene({
  Set: MORNB, cam: { from: [1150, 600, 1.1], to: [1200, 610, 1.16] }, words,
  cast: (t) => [{ look: YOU, pose: walk(t, 560, 760, 0, 50, TOWN.kerb + 40, 1, { look: 0.8 }), faces: [[0, 'worried']], floor: TOWN.kerb + 40 }],
});

// ---------- S8B: doors open, engine running ----------
export const S8B: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1050], [len, 1100]]), 820, 2.4)}>
    <MORNB t={t + 400} id="b8" />
  </g>
);

// ---------- S9: nobody on it ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 900]]), 520, 1.1)}>
    <Bus t={t} id="b9" speed={0} />
  </g>
);

// ---------- S10: a dog trots down the empty street, dragging its lead ----------
export const S10 = scene({
  Set: MORN, setT: 300, cam: { from: [960, 560, 1.2], to: [1060, 560, 1.25] },
  front: (t) => <Noodle x={kf(t, [[0, 400], [60, 1400]])} y={TOWN.kerb + 70} s={0.9} t={t} walk={1} lead />,
});

// ---------- S11: low and close: the dog, the lead dragging, nobody holding it ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 700], [len, 1100]]);
  return (
    <g transform={camT(x + 20, TOWN.kerb - 40, 2.4)}>
      <MORN t={t + 640} id="b11" />
      <Noodle x={x} y={TOWN.kerb + 70} s={0.9} t={t} walk={1} lead look={-0.5} />
    </g>
  );
};

// ---------- S12: you shout ----------
export const S12 = faceCU({ look: YOU, Bg: MORN, faces: [[0, 'worried'], [4, 'shock']], yaw: 0.15, look_: 0, zoom: [2.6, 2.75], pose: { headTilt: -10 }, shake: 3,
  over: (t) => (
    <g transform={`translate(1380 300) rotate(8) scale(${backOut(clamp((t - 3) / 8))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={130} fill="#F6EFE3" stroke="#14121C" strokeWidth={14} paintOrder="stroke">HELLO?!</text>
    </g>
  ),
});

// ---------- S13: your voice bounces off a hundred windows, and nobody answers ----------
export const S13: React.FC<ShotProps> = (p) => {
  const S = scene({
    Set: MORN, setT: 500, cam: { from: [960, 540, 1.3], to: [960, 500, 0.95] },
    cast: [{ look: YOU, pose: { x: 960, y: TOWN.feet - 300 + 18, scale: 0.9, yaw: 0, look: 0, headTilt: -12 }, faces: [[0, 'worried']] }],
    back: (t) => (
      <g>
        {[0, 1, 2].map((i) => {
          const k = clamp((t - i * 10) / 40);
          return k > 0 && k < 1 ? <circle key={i} cx={960} cy={540} r={60 + k * 900} fill="none" stroke="#F6EFE3" strokeWidth={6} opacity={(1 - k) * 0.6} /> : null;
        })}
      </g>
    ),
  });
  return <S {...p} />;
};

// ---------- S14: you check every house on the street ----------
export const S14 = scene({
  Set: HOME, setT: 200, cam: { from: [700, 560, 1.15], to: [1100, 560, 1.15] },
  cast: (t) => [{ look: YOU, pose: run(t, 300, 1500, 0, 60, SUBURB.feet, 0.95), faces: [[0, 'worried']] }],
});

// ---------- S15: every shop ----------
export const S15 = scene({
  Set: ShopSet(), cam: { from: [700, 520, 1.2], to: [760, 520, 1.25] },
  cast: [{ look: YOU, pose: { x: 1250, y: 820 - 300 * 0.95 + 12, scale: 0.95, yaw: -0.6, look: -0.8 }, faces: [[0, 'worried']] }],
});

// ---------- S16: every car, door open, nobody in it ----------
export const S16 = scene({
  Set: MORN, setT: 700, cam: { from: [720, 680, 1.7], to: [740, 680, 1.78] },
  cast: [{ look: YOU, pose: { x: 520, y: TOWN.kerb + 40 - 290, scale: 0.95, yaw: 0.6, look: 0.8, headTilt: 8 }, faces: [[0, 'worried']], floor: TOWN.kerb + 40 }],
});

// ---------- S17: everything exactly where it was last night: the food court, trays left ----------
const Tray: React.FC<{ x: number; y: number; s?: number; i?: number }> = ({ x, y, s = 1, i = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-80} y={-14} width={160} height={14} rx={4} fill="#C83A3A" />
    <circle cx={-30} cy={-24} r={18} fill="#E8A83A" />
    <rect x={20} y={-60} width={34} height={46} rx={4} fill={['#4AA8E0', '#5BC08A', '#F2C14E'][i % 3]} />
  </g>
);
export const S17 = scene({
  Set: MallSet(), cam: { from: [960, 500, 1.05], to: [960, 520, 1.12] },
  front: () => (
    <g>
      <FoodTable x={500} y={MALL.feet + 40} />
      <FoodTable x={1000} y={MALL.feet + 70} />
      <FoodTable x={1450} y={MALL.feet + 40} />
      <Tray x={490} y={MALL.feet - 250} s={0.8} />
      <Tray x={1010} y={MALL.feet - 222} s={0.8} i={1} />
      <Tray x={1440} y={MALL.feet - 250} s={0.8} i={2} />
    </g>
  ),
});

// ---------- S18: every light ----------
export const S18 = insert({
  Bg: KIT, push: 0.06,
  draw: (t) => (
    <g>
      <path d="M 960 -20 L 960 300" stroke="#14121C" strokeWidth={8} />
      <path d="M 820 300 L 1100 300 L 1020 420 L 900 420 Z" fill="#E8A83A" stroke="#14121C" strokeWidth={6} />
      <circle cx={960} cy={440} r={40} fill="#FFF4C8" />
      <Glow x={960} y={460} r={420} kind="warm" o={0.8 + 0.05 * Math.sin(t / 3)} />
    </g>
  ),
});

// ---------- S19: every open laptop ----------
export const S19 = insert({ Bg: KIT, push: 0.08, draw: (t) => <Laptop x={960} y={600} s={2.2} msg="3 new messages" t={t} /> });

// ---------- S20: every half-eaten sandwich ----------
export const S20 = insert({
  Bg: KIT, push: 0.08,
  draw: () => (
    <g transform="translate(960 600) scale(2.4)">
      <ellipse cx={0} cy={40} rx={170} ry={30} fill="#F4F0E6" stroke="#8A8278" strokeWidth={3} />
      <path d="M -130 20 L -130 -20 L 60 -20 Q 40 -5 70 5 Q 50 15 60 20 Z" fill="#E8C890" stroke="#14121C" strokeWidth={4} />
      <path d="M -130 -20 L -130 -34 L 64 -34 Q 44 -26 60 -20 Z" fill="#5BC08A" />
      <path d="M -130 -34 L -130 -74 L 60 -74 Q 40 -60 70 -48 Q 50 -40 64 -34 Z" fill="#E8C890" stroke="#14121C" strokeWidth={4} />
    </g>
  ),
});

// ---------- S21: except the people ----------
export const S21 = faceCU({ look: YOU, Bg: MORN, faces: [[0, 'worried']], yaw: -0.25, zoom: [3.0, 3.2] });

// ---------- S22: everyone on Earth is gone: the population counts down to one ----------
export const S22 = insert({
  bgColor: '#0C1024', push: 0.08,
  draw: (t, len) => {
    const k = clamp((t - 6) / Math.max(10, len - 22));
    const e = Math.pow(k, 0.35);
    const n = Math.max(1, Math.round(8.2e9 * (1 - e)));
    return (
      <g>
        <DustField t={t} n={30} />
        <Globe x={960} y={430} r={250} t={t} spin={1} />
        <text x={960} y={800} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill="#C8C2D8">PEOPLE ON EARTH</text>
        <text x={960} y={930} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill={n === 1 ? EG.red : EG.gold} stroke="#0B0816" strokeWidth={12} paintOrder="stroke">{n.toLocaleString('en-US')}</text>
      </g>
    );
  },
});

// ---------- S23: except you: alone in the middle of the street, the camera cranes up and away ----------
export const S23 = scene({
  Set: MORN, setT: 900, cam: [[0, 960, 600, 1.5], [-1, 960, 520, 0.85]],
  cast: [{ look: YOU, pose: { x: 960, y: TOWN.kerb + 120 - 300, scale: 1, yaw: 0, look: 0, headTilt: -14 }, faces: [[0, 'worried']], floor: TOWN.kerb + 120 }],
});

// ---------- S24: what if everyone disappeared, except you? ----------
export const S24: React.FC<ShotProps> = (p) => {
  const { t, len } = p;
  const pose = { ...basePose, x: 960, y: 720, scale: 1, yaw: 0, look: 0 };
  return (
    <g>
      <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.08]]))}>
        <Soft blur={10} dim={0.4}>
          <g transform={camT(960, 560, 1.2)}>
            <MORN t={t + 900} id="ti" />
          </g>
        </Soft>
      </g>
      <g transform={camT(960, 600, 1.7)}>{people(t, [{ look: YOU, pose, faces: [[0, 'worried']] }])}</g>
      <TitleCard t={t} lines={series.title as [string, string]} accent={EG.gold} accentT={30} size={96} />
    </g>
  );
};
