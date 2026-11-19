import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, FONT, Glow, LEG_LEN, rnd, SUBURB, BANK, Suburb, Globe, factCard, KitchenIsland, KITCHEN, stand,
} from '../../../engine';
import {
  YOU, TELLER, KitSet, BankS, HighSky, faceCU, scene, fig, propCU, textCard, listCard, bigWord, Flyer, Bill, MoneyBag, SportsCar, SpawnFlash,
  Flames, Smoke, CashStack, handAt, OUR_DOOR, ROAD, SetC, Soft,
} from '../common';
import { Jet } from '../../../engine';

// Chapter 4, the catch: the sleeve on fire (pain is an alarm; people born without it), the bank and the copied
// bills, the car from nothing (E = mc², a fifth of the world's energy), the jetpack that never runs out.

const K = stand(KITCHEN, 0.42, 0.55);

// ---------- S2: your sleeve, on fire ----------
export const S2 = propCU({
  Bg: KitSet,
  draw: (t) => (
    <g>
      <path d="M -100 700 L 1200 600 L 1210 760 L -100 860 Z" fill="#F07A2A" stroke="#1A1018" strokeWidth={8} />
      <path d="M 1200 600 Q 1400 590 1450 670 Q 1450 760 1210 760 Z" fill="#1A1620" />
      <rect x={1330} y={560} width={200} height={170} rx={30} fill="#D8A060" stroke="#6A4020" strokeWidth={6} transform="rotate(-8 1430 640)" />
      <Flames x={700} y={660} s={1.6} t={t} />
      <Flames x={1000} y={630} s={1.2} t={t + 7} />
      <Smoke x={850} y={500} t={t} />
    </g>
  ),
});

// ---------- S3: at the stove, calmly making toast, the sleeve burning ----------
export const S3 = scene({
  Set: KitSet, cam: [[K.x, 520, 1.6], [K.x + 20, 520, 1.7]],
  draw: (t) => {
    const pose: Pose = { ...basePose, x: K.x, y: K.y, scale: K.scale, yaw: 0.5, look: 0.5, armR: { a: 70 + Math.sin(t / 8) * 6, b: -40 }, expr: 'happy', blink: 0 };
    const h = handAt(pose, 'R');
    return (
      <g>
        {fig(YOU, t, pose, [[0, 'happy']])}
        <Flames x={h.x - 20} y={h.y + 20} s={0.7 * K.scale} t={t} />
        <Smoke x={h.x - 30} y={h.y - 40} t={t} />
      </g>
    );
  },
  front: () => null,
});

// ---------- S4: you didn't feel a thing ----------
export const S4 = faceCU({
  look: YOU, Bg: KitSet, faces: [[0, 'happy'], [40, 'shock']], yaw: 0.2, zoom: [2.6, 2.8],
  front: (t) => <g><Flames x={1350} y={1100} s={2} t={t} /><Smoke x={1350} y={850} t={t} n={6} /></g>,
});

// ---------- S5: pain is an alarm ----------
export const S5 = textCard({
  kicker: "PAIN ISN'T YOUR BODY BEING MEAN", lines: ["IT'S AN ALARM"], color: '#FF5A4A', size: 130, y: 560,
  art: (t) => (
    <g transform={`translate(960 330) rotate(${Math.sin(t * 1.5) * 8})`} opacity={clamp(t / 6)}>
      <Glow x={0} y={0} r={240} kind="red" o={0.5 + 0.3 * Math.sin(t / 2)} />
      <path d="M -70 40 Q -70 -70 0 -70 Q 70 -70 70 40 Z" fill="#FF4A4A" stroke="#2A0A0A" strokeWidth={8} />
      <rect x={-90} y={36} width={180} height={24} rx={8} fill="#2A0A0A" />
    </g>
  ),
});

// ---------- S6: people born without it ----------
export const S6 = textCard({ kicker: 'SOME PEOPLE ARE BORN WITHOUT IT', lines: ['CONGENITAL', 'INSENSITIVITY TO PAIN'], size: 96, sub: 'MedlinePlus Genetics, U.S. National Library of Medicine', real: true, y: 440 });

// ---------- S7, S7b: what it does ----------
export const S7 = listCard({ title: 'NOTHING TELLS THEM TO STOP', items: [{ at: 20, text: 'BITTEN TONGUES', ok: false }, { at: 60, text: 'BROKEN BONES', ok: false }] });
export const S7b = listCard({ title: 'NOTHING TELLS THEM TO STOP', items: [{ at: -20, text: 'BITTEN TONGUES', ok: false }, { at: -20, text: 'BROKEN BONES', ok: false }, { at: 4, text: 'BURNS', ok: false, hot: true }] });

// ---------- S8: your body can't be hurt; your clothes can ----------
export const S8 = scene({
  Set: KitSet, cam: [[K.x, 520, 1.8], [K.x, 520, 1.9]], setT: 400,
  draw: (t) => (
    <g>
      {fig({ ...YOU, jacket: '#5A3A2A', jacketShade: '#4A2E22' }, t, { x: K.x, y: K.y, scale: K.scale, yaw: 0.1, armL: { a: 30, b: -40 }, armR: { a: 50, b: -70 } }, [[0, 'oops']])}
      <Smoke x={K.x + 60} y={K.y - 120} t={t} />
      <Smoke x={K.x - 60} y={K.y - 60} t={t + 30} n={3} />
    </g>
  ),
});

// ---------- S9: the bank: one stack on the counter ----------
export const S9 = scene({
  Set: BankS, cam: [[1300, 540, 1.5], [1320, 540, 1.56]],
  draw: (t) => (
    <g>
      {fig(TELLER, t, { x: 1500, y: BANK.feet - LEG_LEN - 20, yaw: -0.4, look: -0.6 }, [[0, 'happy']], 2)}
      <rect x={1160} y={BANK.counter - 22} width={600} height={28} fill="#8A6A52" />
      {fig(YOU, t, { x: 1080, y: BANK.feet - LEG_LEN, yaw: 0.5, look: 0.6, armR: { a: 70, b: -30 } }, [[0, 'happy']])}
      <CashStack x={1230} y={BANK.counter - 22} s={0.8} />
    </g>
  ),
});

// ---------- S10: a bill held up to the light ----------
export const S10 = propCU({
  Bg: BankS,
  draw: (t) => (
    <g>
      <Glow x={960} y={460} r={700} o={0.6} />
      <Bill x={960} y={kf(t, [[0, 640], [16, 480]])} s={1.4} rot={-3} />
      <ellipse cx={540} cy={kf(t, [[0, 700], [16, 540]])} rx={60} ry={80} fill="#5A3A2A" />
      <ellipse cx={1380} cy={kf(t, [[0, 700], [16, 540]])} rx={60} ry={80} fill="#5A3A2A" />
    </g>
  ),
});

// ---------- S11: side by side: the same serial number ----------
export const S11 = propCU({
  bgColor: '#C8B8A0',
  draw: (t) => (
    <g>
      <rect width={1920} height={1080} fill="#8A6A52" />
      <Bill x={kf(t, [[0, 700], [14, 960]])} y={330} s={1.3} hiSerial={clamp((t - 30) / 8)} />
      <Bill x={kf(t, [[0, 1220], [14, 960]])} y={740} s={1.3} hiSerial={clamp((t - 30) / 8)} />
    </g>
  ),
});

// ---------- S12: her other hand slides under the desk, to the button ----------
export const S12 = propCU({
  bgColor: '#2A2018',
  draw: (t) => {
    const press = kf(t, [[10, 0], [30, 1]]);
    return (
      <g>
        <rect x={0} y={0} width={1920} height={380} fill="#6A4A3A" />
        <rect x={0} y={360} width={1920} height={30} fill="#4A3228" />
        <rect x={1100} y={400} width={180} height={90} rx={10} fill="#3A3C46" />
        <circle cx={1190} cy={445} r={30} fill="#E83A3A" />
        {press > 0.9 ? <Glow x={1190} y={445} r={160} kind="red" o={0.8} /> : null}
        <path d={`M 200 1200 Q 500 ${800 - press * 100} ${kf(press, [[0, 700], [1, 1110]])} ${kf(press, [[0, 600], [1, 500]])}`} stroke="#1E3A5A" strokeWidth={90} fill="none" strokeLinecap="round" />
        <ellipse cx={kf(press, [[0, 720], [1, 1150]])} cy={kf(press, [[0, 590], [1, 490]])} rx={54} ry={46} fill="#1A1620" />
      </g>
    );
  },
});

// ---------- S13: the same serial number ----------
export const S13 = textCard({
  kicker: 'EVERY BILL HAS ITS OWN SERIAL NUMBER', lines: ['KB 40261187 C', 'KB 40261187 C'], color: '#FFE27A', size: 100, y: 420,
  sub: 'Yours all have the same one.', real: true,
  art: (t) => <text x={1450} y={480} fontFamily={FONT.title} fontWeight={800} fontSize={140} fill="#FF4A4A" opacity={clamp((t - 14) / 6)}>=</text>,
});

// ---------- S14: every bag is the same bag, copied ----------
export const S14 = propCU({
  bgColor: '#120C18',
  draw: (t) => (
    <g>
      {Array.from({ length: 15 }).map((_, i) => (
        <g key={i} opacity={clamp((t - i * 3) / 4)}>
          <MoneyBag x={300 + (i % 5) * 330} y={330 + Math.floor(i / 5) * 290} s={0.55} />
          <text x={300 + (i % 5) * 330} y={330 + Math.floor(i / 5) * 290 + 50} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FFE27A">COPY</text>
        </g>
      ))}
    </g>
  ),
});

// ---------- S15: counterfeit ----------
export const S15 = textCard({ kicker: 'LEGALLY, YOU MADE', lines: ['COUNTERFEIT', 'MONEY'], color: '#FF4A4A', size: 130, sub: '$250,000 × 40 = $10,000,000', y: 430 });

// ---------- S16: the cars have to come from somewhere ----------
export const S16 = textCard({
  kicker: 'THE CARS ARE WORSE', lines: [], y: 300,
  art: (t) => (
    <g>
      <g transform="translate(960 760) scale(1.3)"><SportsCar x={0} y={0} /></g>
      <text x={960} y={420} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={180} fill="#FFE27A" opacity={clamp((t - 20) / 6)}>?</text>
    </g>
  ),
});

// ---------- S17: E = mc² ----------
export const S17 = textCard({ kicker: 'EINSTEIN, 1905: MASS AND ENERGY ARE THE SAME THING', lines: ['E = mc²'], size: 220, color: '#FFB15A', y: 700 });

// ---------- S17b: one car, out of nothing: 1,500 kg ----------
export const S17b = textCard({
  kicker: 'ONE CAR OUT OF NOTHING', lines: ['1,500 KG'], size: 140, y: 380,
  art: (t) => (
    <g opacity={0.9}>
      <g transform="translate(960 830) scale(1.2)" opacity={clamp(t / 10)}>
        <SportsCar x={0} y={0} color="#1C2C44" shine={0} />
      </g>
    </g>
  ),
});

// ---------- S18: the energy it takes ----------
export const S18 = factCard({ value: 1.35, label: "THE ENERGY IN ONE CAR (E = mc²)", format: (v) => `${v.toFixed(2)} × 10²⁰ J`, sub: '1,500 kg × (300,000,000 m/s)² = 135 billion billion joules' });

// ---------- S19: a fifth of all the energy the world uses in a year ----------
export const S19: React.FC<ShotProps> = ({ t }) => {
  const p = clamp((t - 8) / 30) * 0.22;
  const a = p * Math.PI * 2;
  const r = 300;
  return (
    <g>
      {textCard({ kicker: "THE WHOLE WORLD'S ENERGY FOR A YEAR", lines: [], y: 270 })({ t, len: 100, f: t })}
      <Globe x={760} y={580} r={r} t={t} spin={0.004} />
      <path d={`M 760 580 L 760 ${580 - r} A ${r} ${r} 0 0 1 ${760 + Math.sin(a) * r} ${580 - Math.cos(a) * r} Z`} fill="#FF8A3D" opacity={0.85} />
      <text x={1380} y={560} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#FF8A3D" opacity={clamp((t - 30) / 6)}>1/5</text>
      <text x={1380} y={650} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3" opacity={clamp((t - 36) / 6)}>FOR ONE CAR</text>
      <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#7E8DA6">World energy use ≈ 620 EJ a year (Energy Institute, 2024)</text>
    </g>
  );
};

// ---------- S20: every light on your street flickers ----------
const Dusk: SetC = ({ t, id }) => <Suburb t={t} id={id} tod="dusk" cars={false} windowsLit={0.9} />;
export const S20 = scene({
  Set: Dusk, cam: [[960, 540, 1.0], [960, 540, 1.04]],
  draw: (t) => (
    <g>
      <SportsCar x={600} y={ROAD} s={0.8} />
      <SportsCar x={1350} y={ROAD} s={0.8} color="#3A8AF0" />
      <SpawnFlash x={1350} y={ROAD - 60} p={t - 20} r={300} />
    </g>
  ),
  front: (t) => {
    const off = (t > 20 && t < 26) || (t > 30 && t < 33) || (t > 38 && t < 44);
    return <rect width={1920} height={1080} fill="#05060E" opacity={off ? 0.7 : 0} />;
  },
});

// ---------- S21: real jetpacks fly for about ten minutes ----------
export const S21 = factCard({ value: 10, suffix: ' MIN', label: 'A REAL JETPACK, ONE TANK OF FUEL', sub: 'JetPack Aviation, turbine jetpacks' });

// ---------- S21b: yours never runs out ----------
export const S21b = propCU({
  Bg: HighSky,
  draw: (t) => (
    <g transform="translate(960 560)">
      <circle r={260} fill="#1A1A22" stroke="#C8CCD6" strokeWidth={16} />
      <path d="M -200 60 A 210 210 0 0 1 200 60" stroke="#3A3C46" strokeWidth={30} fill="none" />
      <text x={-190} y={130} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FF4A4A">E</text>
      <text x={160} y={130} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#4BD86A">F</text>
      <g transform={`rotate(${62 + Math.sin(t * 2) * 1.5})`}>
        <path d="M 0 0 L 0 -200" stroke="#FF8A2A" strokeWidth={14} strokeLinecap="round" />
      </g>
      <circle r={26} fill="#C8CCD6" />
      <text y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">FUEL</text>
    </g>
  ),
});

// ---------- S22: three thousand feet up, in your socks, next to a plane ----------
export const S22 = scene({
  Set: HighSky, cam: [[960, 540, 1.0], [960, 540, 1.06]],
  draw: (t, f, len) => (
    <g>
      <Jet x={kf(t, [[0, 1500], [len, 900]])} y={560} s={2.2} />
      <Flyer x={kf(t, [[0, 700], [len, 740]])} y={kf(t, [[0, 820], [len, 800]])} s={0.7} t={t} socks expr={t > 40 ? 'shock' : 'happy'} />
    </g>
  ),
});
