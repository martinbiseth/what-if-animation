import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, faceAt, FONT, Glow, Smartphone, Router, CardTerminal, BankCard, TVSet,
  ModernCar, CarKey, Laptop, Tap, CitySkyline, Globe, WifiIcon, SHOP, shopHip, KITCHEN, stand, KitchenIsland,
} from '../../../engine';
import {
  YOU, MUM, DAD, ELLIE, StreetSet, ShopSet, KitchenSet, BedroomSet, phoneCU, propCU, faceCU, bigWord, talkShot, crowd, HeldPhone, at, HIP, Soft,
} from '../common';

// Chapter 1, the cold open: you wake to "Offline", then quick demos of everything that stops (messages, map, card,
// TV, car, laptop), what still works, every screen on Earth saying the same word, and the question. 24+ cuts a minute.

const MORNING = StreetSet('morning');
const KIT = KitchenSet(0.3);
const SHOPS = ShopSet(0);
const BED = BedroomSet();

// ---------- S1: from above, you in bed, the phone lighting your face; eyes open ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const face = faceAt(t, [[0, 'tired'], [18, 'neutral'], [40, 'worried']]);
  const me: Pose = { ...basePose, x: 860, y: 630, spin: -90, yaw: 0, look: 0.3, ...face, armR: { a: 40, b: -90 }, armL: { a: 10, b: 0 }, blink: t < 14 ? 1 : face.blink };
  return (
    <g>
      <g transform={camT(980, 560, kf(t, [[0, 1.8], [len, 2.0]]))}>
        <rect x={-400} y={-400} width={2800} height={1900} fill="#2A3048" />
        <rect x={300} y={360} width={1320} height={420} rx={30} fill="#5A6A9A" stroke="#141826" strokeWidth={8} />
        <ellipse cx={770} cy={560} rx={110} ry={160} fill="#DCDDE6" stroke="#141826" strokeWidth={6} />
        <Hero look={YOU} pose={me} shadow={0} />
        <path d="M 990 380 Q 1350 360 1620 400 L 1620 760 Q 1350 790 990 770 Z" fill="#E8A84A" stroke="#141826" strokeWidth={6} />
        <Smartphone x={930} y={470} s={0.2} rot={-90} mode="offline" t={t} battery={70} glow={1.4} status={false} />
      </g>
      <rect width={1920} height={1080} fill="#FFE2B0" opacity={0.08} />
      <path d={`M 1300 0 L 1700 0 L 1300 1080 L 900 1080 Z`} fill="#FFF3C0" opacity={0.1} />
    </g>
  );
};

// ---------- S2: insert, the phone: OFFLINE ----------
export const S2 = phoneCU({ mode: 'offline', Bg: BED, push: 0.12 });

// ---------- S3: insert, the router: off and on again; the lights blink orange, then go red ----------
export const S3 = propCU({
  Bg: KIT,
  draw: (t) => {
    const state = t < 8 ? 'ok' : t < 24 ? 'blink' : 'red';
    const press = t > 2 && t < 8;
    return (
      <g>
        <rect x={360} y={700} width={1200} height={500} fill="#6A4A3A" />
        <rect x={360} y={690} width={1200} height={20} fill="#8A6A5A" />
        <Router x={960} y={690} s={2.2} state={state} t={t} />
        <path d={`M ${1260} ${press ? 610 : 560} Q 1500 640 1700 1100`} stroke="#F07A2A" strokeWidth={90} fill="none" strokeLinecap="round" />
        <ellipse cx={1250} cy={press ? 600 : 550} rx={60} ry={50} fill="#26232F" stroke="#100E16" strokeWidth={8} />
      </g>
    );
  },
});

// ---------- S4: close, your face: still offline ----------
export const S4 = faceCU({ look: YOU, Bg: BED, faces: [[0, 'neutral'], [6, 'worried']], yaw: 0.2, zoom: [3.0, 3.2] });

// ---------- S5: insert, messages: not delivered ----------
export const S5 = phoneCU({ mode: 'nosignal', text: 'u up?', Bg: BED, from: 'left', push: 0.08 });

// ---------- S6: insert, the map: blank grey squares ----------
export const S6 = phoneCU({ mode: 'mapblank', Bg: MORNING, push: 0.08 });

// ---------- S7: medium, the corner shop: Mum at the counter, card out ----------
export const S7 = talkShot({
  Set: SHOPS, setT: 100,
  cast: [
    { look: MUM, x: 1380, y: shopHip(1.05), scale: 1.05, yaw: 0.5, faces: [[0, 'neutral']], pose: { armR: { a: 70, b: -50 } } },
  ],
  cam: { from: [1500, 520, 1.5], to: [1520, 520, 1.6] },
});

// ---------- S8: insert, the terminal: the card taps, DECLINED ----------
export const S8 = propCU({
  Bg: SHOPS,
  draw: (t) => {
    const tap = easeOut(clamp(t / 8));
    const state = t < 9 ? 'idle' : 'error';
    return (
      <g>
        <CardTerminal x={960} y={900} s={1.6} state={state} t={t} />
        <BankCard x={1300 - tap * 330} y={420 + tap * 40} s={1.3} rot={-20 + tap * 10} />
        <ellipse cx={1420 - tap * 330} cy={500 + tap * 40} rx={80} ry={70} fill="#26232F" stroke="#100E16" strokeWidth={8} />
        <path d={`M ${1460 - tap * 330} ${540 + tap * 40} Q 1650 700 1800 1100`} stroke="#8A5A8A" strokeWidth={110} fill="none" strokeLinecap="round" />
      </g>
    );
  },
});

// ---------- S9: the TV on the kitchen wall: a spinning circle ----------
export const S9 = propCU({ Bg: KIT, push: 0.1, draw: (t) => <TVSet x={960} y={520} s={1.6} t={t} mode="spin" /> });

// ---------- S10: wide, the street: Dad jabbing at his phone; the car doesn't blink ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const jab = Math.sin(t / 3) > 0.3 ? 1 : 0;
  const dad: Pose = at(1100, { yaw: -0.3, expr: t > 30 ? 'worried' : 'neutral', armR: { a: 110 + jab * 10, b: 30 }, blink: idleBlink(t, 5), look: -0.5 });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 920]]), 560, kf(t, [[0, 1.35], [len, 1.45]]))}>
      <MORNING t={t + 100} id="s10" />
      <ModernCar x={720} y={940} s={1.05} color="#5A8A5A" />
      <Hero look={DAD} pose={dad} />
      <HeldPhone pose={dad} t={t} s={0.15} mode="offline" />
      <text x={760} y={680} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={t > 12 ? 1 : 0}>?</text>
    </g>
  );
};

// ---------- S11: insert, the actual key, dangling from a hook ----------
export const S11 = propCU({
  Bg: KIT,
  draw: (t) => (
    <g>
      <rect x={700} y={300} width={520} height={30} rx={8} fill="#8A6A4A" />
      <circle cx={960} cy={350} r={14} fill="#C8CCD6" />
      <g transform={`rotate(${Math.sin(t / 6) * 8 * Math.max(0, 1 - t / 60)} 960 350)`}>
        <CarKey x={960} y={540} s={1.4} />
      </g>
    </g>
  ),
});

// ---------- S12: insert, Mum's work laptop: cannot connect to server ----------
export const S12 = propCU({ Bg: KIT, push: 0.08, draw: (t) => <Laptop x={960} y={820} s={1.7} t={t} /> });

// ---------- S13: wide, the kitchen: lights on, Ellie eating cereal, Mum on hold; everything else normal ----------
const K1 = stand(KITCHEN, 0.32, 0.45), K2 = stand(KITCHEN, 0.55, 0.5), K3 = stand(KITCHEN, 0.76, 0.42);
export const S13 = talkShot({
  Set: KIT, setT: 300,
  cast: [
    { look: MUM, ...K1, yaw: 0.3, faces: [[0, 'worried']], pose: { armR: { a: 150, b: 40 } } },
    { look: ELLIE, ...K2, scale: K2.scale * 0.72, y: K2.y + 40, yaw: 0, faces: [[0, 'neutral']] },
    { look: YOU, ...K3, yaw: -0.4, faces: [[0, 'worried']], pose: { armR: { a: 60, b: -40 } } },
  ],
  cam: { from: [960, 560, 1.15], to: [960, 560, 1.22] },
  front: () => <KitchenIsland />,
});

// ---------- S14: insert, the tap: the water still runs ----------
export const S14 = propCU({ Bg: KIT, draw: (t) => <Tap x={860} y={560} s={1.5} t={t} /> });

// ---------- S15: insert, the battery: seventy percent ----------
export const S15 = phoneCU({ mode: 'battery', battery: 70, Bg: KIT, push: 0.1 });

// ---------- S16: montage, every screen at once: phones, laptops, TVs, all saying OFFLINE ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1.5], [len, 1.15]]);
  const items = Array.from({ length: 35 }).map((_, i) => ({ c: i % 7, r: Math.floor(i / 7), k: i % 3 }));
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E0C1E" />
      <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
        {items.map(({ c, r, k }, i) => {
          const x = 160 + c * 270;
          const y = 120 + r * 210;
          const show = t > i * 0.6;
          if (!show) return null;
          return (
            <g key={i}>
              {k === 0 ? <Smartphone x={x} y={y} s={0.28} mode="offline" t={t} battery={70} glow={0.3} status={false} /> : null}
              {k === 1 ? (
                <g transform={`translate(${x} ${y}) scale(0.32)`}>
                  <rect x={-260} y={-170} width={520} height={330} rx={16} fill="#2A2C34" />
                  <rect x={-240} y={-150} width={480} height={290} fill="#14162A" />
                  <WifiIcon x={0} y={-40} s={0.8} off />
                  <text y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3">OFFLINE</text>
                </g>
              ) : null}
              {k === 2 ? (
                <g transform={`translate(${x} ${y}) scale(0.24)`}>
                  <rect x={-420} y={-250} width={840} height={490} rx={14} fill="#121218" />
                  <WifiIcon x={0} y={-60} s={1.1} off />
                  <text y={150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3">OFFLINE</text>
                </g>
              ) : null}
            </g>
          );
        })}
      </g>
    </g>
  );
};

// ---------- S17: the word, huge, over the city at night ----------
const CITY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <CitySkyline t={t} id={id} />;
export const S17 = bigWord({ word: 'OFFLINE', color: '#FF3A2A', Bg: CITY });

// ---------- S18: the globe, red crosses popping on everywhere ----------
export const S18: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B0920" />
    {Array.from({ length: 50 }).map((_, i) => (
      <circle key={i} cx={(i * 397) % 1920} cy={(i * 211) % 1080} r={2} fill="#FFFFFF" opacity={0.5} />
    ))}
    <Globe x={960} y={560} r={380} t={t} marks={clamp(t / 40) * 18} spin={0.004} />
  </g>
);

// ---------- S19: a phone clock: 7:42, every phone at once ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#0E0C1E" />
    {[-1, 0, 1].map((k) => (
      <Smartphone key={k} x={960 + k * 480} y={560} s={k === 0 ? 1.2 : 0.9} rot={k * 6} mode="clock" text="7:42" t={t} battery={70} glow={k === 0 ? 1 : 0.4} />
    ))}
    <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.2 * Math.abs(Math.sin(t / 10))} />
  </g>
);

// ---------- S20: wide, the street: every neighbour out on the pavement holding a phone up for a signal ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const people = crowd(8, 180, 1740, 3, { expr: 'worried', faceTo: 960 });
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.1], [len, 1.02]]))}>
      <MORNING t={t + 400} id="s20" />
      {people.map((c, i) => {
        const up = Math.sin((t + i * 11) / 12) > 0;
        const p: Pose = { ...basePose, x: c.x, y: c.y, scale: c.scale ?? 1, yaw: c.yaw ?? 0, expr: 'worried', armR: { a: up ? 160 : 120, b: 10 }, blink: idleBlink(t, i + 2), look: -0.3 };
        return (
          <g key={i}>
            <Hero look={c.look} pose={p} />
            <HeldPhone pose={p} t={t} glow={0.5} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- S21: close, you, on the pavement: the question ----------
export const S21 = faceCU({ look: YOU, Bg: MORNING, faces: [[0, 'worried'], [40, 'shock']], yaw: 0.05, look_: 0, zoom: [2.6, 3.1] });

// ---------- S22: the pull-back: you, small, on a street; the city behind, every screen dark ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 2.2], [len, 1.0]], easeOut);
  const me: Pose = { ...basePose, x: 960, y: 820, scale: 0.5, yaw: 0, expr: 'worried', armR: { a: 120, b: 10 }, blink: idleBlink(t, 3) };
  return (
    <g>
      <g transform={camT(960, kf(t, [[0, 720], [len, 560]]), z)}>
        <CitySkyline t={t} id="s22" lit={0.55} spread={clamp(t / 60)} />
        <rect x={-400} y={900} width={2800} height={600} fill="#100C1E" />
        <Hero look={YOU} pose={me} shadow={0} />
        <HeldPhone pose={me} t={t} glow={1.5} />
      </g>
      <g transform={`translate(960 200) scale(${backOut(clamp((t - 2) / 10))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#F6EFE3" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">FOREVER.</text>
      </g>
    </g>
  );
};
