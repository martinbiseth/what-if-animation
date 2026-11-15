import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, faceAt, Glow, factCard, LEG_LEN, FONT } from '../../../engine';
import { YOU, ELLIE, TULLIA, FELIX, GLADIATOR, BAKER, CITIZENS, faceCU, wordF, span } from '../common';
import { RomeStreet, ShopInside, ShopCounter, Burger, Coin, Token, TurnipFries, WaxTablet, Amphora, MenuBoard, Grill, HoneyCake, romeHip, SHOP, P0 } from '../sets';
import { street, shop, queue, onStreet, atCounter, insert, streetSet, shopSet, realCard, countCard, walker, Chip } from '../kit';
import words from './words.json';

// Chapter 3, opening Burgus Maximus: Rome already has street food (clay pots in marble counters; about eighty found in
// Pompeii); Tullia's empty counter by the Circus Maximus, Felix sweeping; the cold burger cut in three; she rolls up
// her sleeves; round loaves, cheese, lettuce; pork, and a real Roman meat-patty recipe; no ketchup or fries until after
// 1492 (turnip fries: Felix spits); the system (one grill, one job each, a picture menu, clay number tokens); two
// bronze coins; 40, then 400; the line round the block, and a gladiator proposes to Tullia.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const OLD = streetSet({ mode: 'day', shop: true, sign: 0, smoke: 0, open: false });
const DAY = streetSet({ mode: 'day' });
const EMPTY = shopSet({ menu: false, grill: 0, empty: true });
const BUSY = shopSet({});

// ---------- S1: a street of food counters; you and Ellie walking past them ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 900]]), 560, 1.2)}>
    <RomeStreet t={t + 50} shop={false} />
    {walker(YOU, 500, 1100, len, t, romeHip(1), 1, { expr: 'neutral' })}
    {walker(ELLIE, 360, 960, len, t, romeHip(0.7), 0.7, { expr: 'happy' })}
  </g>
);

// ---------- S2: a counter close: clay pots sunk in the stone, a cook ladling hot food into a bowl ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const ladle = Math.sin(t / 8);
  const cook: Pose = { ...basePose, x: 1000, y: SHOP.hip, yaw: 0.3, expr: 'happy', armR: { a: 70 + ladle * 30, b: -60 }, blink: idleBlink(t, 2) };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.4], [len, 1.55]]))}>
      <ShopInside t={t + 80} menu={false} />
      <Hero look={CITIZENS[0]} pose={cook} />
      <ShopCounter />
      <path d={`M ${1080 + ladle * 30} ${SHOP.counterY - 140} L ${820} ${SHOP.counterY - 30}`} stroke="#5A3A22" strokeWidth={10} strokeLinecap="round" />
      {[0, 1, 2].map((k) => {
        const q = ((t * 0.8 + k * 12) % 36) / 36;
        return <circle key={k} cx={820 + Math.sin(k + t / 8) * 10} cy={SHOP.counterY - 40 - q * 120} r={14 + q * 20} fill="#FFFFFF" opacity={0.4 * (1 - q)} />;
      })}
    </g>
  );
};

// ---------- S3: people with no kitchen of their own eat standing in the street ----------
export const S3 = street({
  shop: false,
  cast: [onStreet(CITIZENS[1], 700, { yaw: 0.5, faces: [[0, 'happy']], pose: { armR: { a: 100, b: -100 } } }, 0.9), onStreet(CITIZENS[2], 900, { yaw: -0.4, faces: [[0, 'happy']], pose: { armL: { a: 90, b: -100 } } }, 0.9), onStreet(CITIZENS[3], 1180, { yaw: -0.2, faces: [[0, 'neutral']] }, 0.9)],
  cam: { from: [940, 520, 1.4], to: [980, 500, 1.55] },
  front: () => (
    <g>
      <ellipse cx={770} cy={romeHip(0.9) - 40} rx={34} ry={12} fill="#B8643A" stroke={P0} strokeWidth={4} />
      <ellipse cx={840} cy={romeHip(0.9) - 30} rx={34} ry={12} fill="#B8643A" stroke={P0} strokeWidth={4} />
    </g>
  ),
});

// ---------- S4: about 80 street food counters found in Pompeii ----------
export const S4 = factCard({ value: 80, label: 'STREET FOOD COUNTERS FOUND IN POMPEII', sub: 'Pompeii Archaeological Park, 2020' });

// ---------- S5: Tullia's counter by the Circus Maximus: no smoke, no customers ----------
export const S5 = street({
  sign: 0, smoke: 0, open: false,
  cast: [onStreet(CITIZENS[4], 1300, { yaw: 0.7 }, 0.9)],
  cam: { from: [700, 520, 1.0], to: [620, 560, 1.35] },
});

// ---------- S6: business is terrible: Tullia leaning on the counter, Felix sweeping an empty floor ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const sweep = Math.sin(t / 7);
  const tul: Pose = { ...basePose, x: 760, y: SHOP.hip + 10, yaw: 0.2, tilt: 8, expr: 'tired', armL: { a: 40, b: -90 }, armR: { a: 40, b: -90 }, blink: idleBlink(t, 3) };
  const fx: Pose = { ...basePose, x: 1260, y: SHOP.hip, scale: 0.92, yaw: -0.6, tilt: -10, expr: 'tired', armR: { a: 50 + sweep * 18, b: -10 }, armL: { a: 40 + sweep * 18, b: -20 }, blink: idleBlink(t, 5) };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <ShopInside t={t + 120} menu={false} grill={0} empty />
      <Hero look={TULLIA} pose={tul} />
      <Hero look={FELIX} pose={fx} />
      <path d={`M ${1290 + sweep * 30} ${SHOP.hip - 30} L ${1200 + sweep * 60} ${SHOP.counterY - 20}`} stroke="#8A6A3A" strokeWidth={10} strokeLinecap="round" />
      <ShopCounter />
    </g>
  );
};

// ---------- S7: your cold burger on the marble, cut into three ----------
export const S7 = insert({
  Bg: EMPTY, zoom: [1.9, 2.0], cy: 600, dim: 0.25,
  draw: (t) => {
    const k = easeOut(clamp((t - 24) / 10));
    return (
      <g>
        <rect x={300} y={650} width={1320} height={400} fill="#EDE6DA" />
        <rect x={300} y={640} width={1320} height={20} fill="#F6F0E6" />
        {[-1, 0, 1].map((d) => (
          <g key={d} clipPath={`url(#third${d + 1})`} transform={`translate(${d * 70 * k} 0)`}>
            <defs><clipPath id={`third${d + 1}`}><rect x={960 + (d - 0.5) * 120} y={300} width={120} height={400} /></clipPath></defs>
            <Burger x={960} y={660} s={1.6} />
          </g>
        ))}
        {k < 1 ? <path d={`M ${880 + 0} ${380 + 300 * clamp(t / 24)} L 1040 ${380 + 300 * clamp(t / 24)}`} stroke="#C8C8D0" strokeWidth={8} strokeLinecap="round" opacity={t < 24 ? 1 : 0} /> : null}
      </g>
    );
  },
});

const chew = (t: number) => Math.max(0, Math.sin(t / 2.4)) * 0.7;
// ---------- S8: Tullia chews ----------
export const S8: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: TULLIA, Bg: EMPTY, faces: [[0, 'neutral']], yaw: 0.25, zoom: [3.2, 3.4], pose: { talk: chew(p.t), armR: { a: 140, b: -120 } } });
  return <F {...p} />;
};
// ---------- S9: Felix chews ----------
export const S9: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: FELIX, Bg: EMPTY, faces: [[0, 'neutral'], [26, 'shock']], yaw: -0.25, zoom: [3.2, 3.5], pose: { talk: p.t < 26 ? chew(p.t) : 0 } });
  return <F {...p} />;
};

// ---------- S10: silence... then Tullia rolls up her sleeves ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const roll = easeOut(clamp((t - (at('Then') - at('Silence'))) / 10));
  const face = faceAt(t, [[0, 'neutral'], [at('Then') - at('Silence'), 'smug']]);
  const tul: Pose = { ...basePose, x: 960, y: SHOP.hip, yaw: 0, ...face, armL: { a: 30 + 70 * roll, b: -100 * roll }, armR: { a: 30 + 70 * roll, b: -100 * roll }, blink: Math.max(face.blink, idleBlink(t, 3)) };
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.5], [len, 1.75]]))}>
      <ShopInside t={t + 160} menu={false} grill={0} empty />
      <Hero look={YOU} pose={{ ...basePose, x: 640, y: SHOP.hip, yaw: 0.4, expr: 'neutral', blink: idleBlink(t, 1) }} />
      <Hero look={FELIX} pose={{ ...basePose, x: 1280, y: SHOP.hip + 10, scale: 0.92, yaw: -0.4, expr: 'shock', blink: idleBlink(t, 2) }} />
      <Hero look={TULLIA} pose={tul} />
      <ShopCounter />
    </g>
  );
};

/** A round loaf (a bun) seen from the side. */
const Bun: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -60 0 Q -64 -70 0 -72 Q 64 -70 60 0 Z" fill="#E0A04A" stroke={P0} strokeWidth={4} />
    <path d="M 10 -68 Q 50 -60 56 -6 L 36 -4 Q 36 -50 10 -68 Z" fill="#C07F30" opacity={0.6} />
  </g>
);

// ---------- S11: at the bakery: the baker turns his loaves round for you ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.45], [len, 1.6]]))}>
    <RomeStreet t={t + 200} shop={false} />
    <Hero look={BAKER} pose={{ ...basePose, x: 820, y: romeHip(1), yaw: 0.4, expr: 'happy', armR: { a: 80, b: -40 }, blink: idleBlink(t, 2), talk: Math.max(0, Math.sin(t / 3)) * 0.4 }} />
    <Hero look={YOU} pose={{ ...basePose, x: 1180, y: romeHip(1), yaw: -0.4, expr: 'happy', blink: idleBlink(t, 4) }} />
    <rect x={860} y={romeHip(1) - 10} width={260} height={30} fill="#8A5A32" stroke={P0} strokeWidth={4} />
    {[0, 1, 2].map((k) => (
      <g key={k} transform={`translate(0 ${-backOut(clamp((t - 10 - k * 12) / 8)) * 0})`} opacity={clamp((t - 8 - k * 12) / 4)}>
        <Bun x={900 + k * 90} y={romeHip(1) - 10} s={0.5} />
      </g>
    ))}
  </g>
);

// ---------- S12: cheese, lettuce, onions: ticked off on the counter ----------
export const S12 = insert({
  Bg: BUSY, zoom: [1.3, 1.36], cy: 560, dim: 0.4,
  draw: (t) => {
    const items = [
      { at: 0, label: 'CHEESE', draw: <g><path d="M -70 30 L 70 30 L 70 -10 L -70 -60 Z" fill="#F2C440" stroke={P0} strokeWidth={5} /><circle cx={-10} cy={6} r={10} fill="#D8A030" /><circle cx={30} cy={14} r={7} fill="#D8A030" /></g> },
      { at: at('Lettuce') - at('Cheese'), label: 'LETTUCE', draw: <g><path d="M -70 20 Q -80 -50 -30 -40 Q -10 -80 20 -50 Q 70 -70 70 0 Q 60 30 0 34 Q -60 34 -70 20 Z" fill="#6DB54A" stroke={P0} strokeWidth={5} /></g> },
      { at: at('onions') - at('Cheese'), label: 'ONIONS', draw: <g><circle r={50} fill="#C8A0D8" stroke={P0} strokeWidth={5} /><circle r={32} fill="none" stroke="#A878B8" strokeWidth={4} /><circle r={16} fill="none" stroke="#A878B8" strokeWidth={4} /></g> },
    ];
    return (
      <g>
        {items.map((it, k) => {
          const p = backOut(clamp((t - it.at) / 8));
          return (
            <g key={k} transform={`translate(${560 + k * 400} 520) scale(${p})`}>
              {it.draw}
              <text y={130} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={4} fill="#F6EFE3">{it.label}</text>
              <path d="M -30 170 L -6 196 L 40 146" stroke="#6AE08A" strokeWidth={12} fill="none" strokeLinecap="round" opacity={clamp((t - it.at - 10) / 4)} />
            </g>
          );
        })}
      </g>
    );
  },
});

// ---------- S13: the meat: cows pull ploughs here, so: pork ----------
export const S13 = realCard({ kicker: 'THE MEAT', big: ['COWS PULL PLOUGHS', 'SO: PORK'], real: false });

// ---------- S14: Tullia unrolls an old recipe: minced meat, pepper, pine nuts, fish sauce, pressed into a patty ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const k0 = at('Minced') - at('Then');
  const items = ['MINCED MEAT', 'PEPPER', 'PINE NUTS', 'FISH SAUCE'];
  const iat = [at('Minced'), at('pepper'), at('pine'), at('fish')].map((v) => v - at('Then'));
  return (
    <g>
      <g filter="url(#blur16)"><g transform={camT(960, 560, 1.4)}><ShopInside t={t + 400} /></g></g>
      <rect width={1920} height={1080} fill="#0B0816" opacity={0.4} />
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
        <rect x={560} y={160} width={800} height={760} rx={20} fill="#E8D8B0" stroke={P0} strokeWidth={6} />
        <text x={960} y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={64} fill="#7A2E20" opacity={clamp((t - 6) / 6)}>ISICIA OMENTATA</text>
        {items.map((s, k) => (
          <g key={k} opacity={clamp((t - iat[k]) / 5)} transform={`translate(${640} ${380 + k * 110})`}>
            <circle cx={20} cy={-14} r={14} fill="#7A2E20" />
            <text x={60} y={0} fontFamily={FONT.hand} fontWeight={700} fontSize={56} fill="#3A2A20">{s}</text>
          </g>
        ))}
        <g opacity={clamp((t - (at('pressed') - at('Then'))) / 6)}>
          <ellipse cx={1180} cy={840} rx={90} ry={26} fill="#5A2E1E" stroke={P0} strokeWidth={4} />
        </g>
        {void k0}
      </g>
    </g>
  );
};

// ---------- S15: a real Roman cookbook has one ----------
export const S15 = realCard({ kicker: 'A REAL ROMAN COOKBOOK', big: ['A MEAT PATTY'], sub: 'Apicius, "isicia omentata" (De re coquinaria, book 2)' });

// ---------- S16: you press a patty into a round bun, laughing: they just forgot the bun ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const press = easeOut(clamp((t - 30) / 8));
  return (
    <g transform={camT(960, 500, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <ShopInside t={t + 440} menu={false} />
      <Hero look={YOU} pose={{ ...basePose, x: 960, y: SHOP.hip, yaw: 0, expr: press > 0.5 ? 'happy' : 'smug', armR: { a: 50, b: -70 }, armL: { a: 50, b: -70 }, blink: idleBlink(t, 2) }} />
      <Hero look={TULLIA} pose={{ ...basePose, x: 660, y: SHOP.hip, yaw: 0.4, expr: 'happy', blink: idleBlink(t, 4) }} />
      <ShopCounter />
      <g transform={`translate(0 ${-40 * (1 - press)})`}><Burger x={960} y={SHOP.counterY - 36} s={0.8} /></g>
    </g>
  );
};

// ---------- S17: tomatoes come from the Americas: not in Europe until after 1492 ----------
export const S17 = realCard({
  kicker: 'NO KETCHUP', big: ['TOMATOES: AMERICAS', 'NOT IN EUROPE TILL 1492+'], sub: 'About 1,400 years after Rome, AD 64',
  draw: (t) => (
    <g opacity={0.8}>
      <circle cx={360} cy={860} r={70} fill="#E2342A" stroke={P0} strokeWidth={5} opacity={clamp(t / 8)} />
      <path d="M 330 800 L 360 820 L 390 800" stroke="#4A9A3A" strokeWidth={10} fill="none" opacity={clamp(t / 8)} />
      <circle cx={1560} cy={860} r={70} fill="#C8A060" stroke={P0} strokeWidth={5} opacity={clamp((t - 30) / 8)} />
    </g>
  ),
});

// ---------- S18: no potatoes, so no fries: you try turnip fries ----------
export const S18 = insert({
  Bg: BUSY, zoom: [2.0, 2.2], cy: 560, dim: 0.3,
  draw: (t) => (
    <g>
      <TurnipFries x={960} y={640} s={2} />
      <g opacity={clamp((t - 20) / 6)}>
        <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={70} fill="#F6EFE3" stroke={P0} strokeWidth={8} paintOrder="stroke">TURNIP FRIES</text>
      </g>
    </g>
  ),
});

// ---------- S19: Felix spits his into a pot ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const spit = clamp((t - 14) / 6);
  return (
    <g transform={camT(1100, 520, kf(t, [[0, 1.8], [len, 1.9]]))}>
      <ShopInside t={t + 480} />
      <Hero look={FELIX} pose={{ ...basePose, x: 1100, y: SHOP.hip, yaw: -0.5, tilt: -14 * spit, headTilt: -10 * spit, expr: spit > 0 ? 'oops' : 'worried', armR: { a: 100, b: -100 }, blink: idleBlink(t, 3) }} />
      <ShopCounter />
      <Amphora x={840} y={SHOP.counterY - 20} s={0.7} />
      {spit > 0 && spit < 1 ? <circle cx={1050 - 180 * spit} cy={420 + 200 * spit * spit} r={10} fill="#E9E2C8" /> : null}
    </g>
  );
};

// ---------- S20: but your real secret isn't the food ----------
export const S20 = faceCU({ look: YOU, Bg: BUSY, faces: [[0, 'smug']], yaw: -0.3, zoom: [3.1, 3.3], glint: 0.5, glintColor: '#FFD23A' });

// ---------- S21: the system: you on the grill, Tullia building, Felix at the front; the picture menu above ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const flip = Math.sin(t / 5);
  return (
    <g transform={camT(kf(t, [[0, 600], [len, 900]]), 480, 1.15)}>
      <ShopInside t={t + 520} flip={Math.floor(t / 30) % 4} />
      <Hero look={YOU} pose={{ ...basePose, x: 300, y: SHOP.hip, yaw: -0.5, expr: 'cool', armR: { a: 90 + flip * 20, b: -40 }, blink: idleBlink(t, 1) }} />
      <Hero look={TULLIA} pose={{ ...basePose, x: 760, y: SHOP.hip, yaw: 0.1, expr: 'happy', armL: { a: 60 + flip * 10, b: -80 }, armR: { a: 60 - flip * 10, b: -80 }, blink: idleBlink(t, 2) }} />
      <Hero look={FELIX} pose={{ ...basePose, x: 1200, y: SHOP.hip + 10, scale: 0.92, yaw: -0.1, expr: 'happy', armR: { a: 100, b: -40 }, blink: idleBlink(t, 3), talk: Math.max(0, Math.sin(t / 3)) * 0.5 }} />
      <ShopCounter burgers={3} tokens />
    </g>
  );
};

// ---------- S22: clay tokens with numbers, handed over one by one ----------
export const S22 = insert({
  Bg: BUSY, zoom: [1.7, 1.8], cy: 560, dim: 0.3,
  draw: (t) => (
    <g>
      {['VII', 'VIII', 'IX', 'X'].map((n, k) => (
        <g key={n} transform={`translate(0 ${(1 - easeOut(clamp((t - k * 14) / 8))) * 300})`} opacity={clamp((t - k * 14) / 4)}>
          <Token x={720 + k * 160} y={560} n={n} s={1.6} rot={(k - 1.5) * 6} />
        </g>
      ))}
    </g>
  ),
});

// ---------- S23: two bronze coins for a burger; in Pompeii a cup of wine cost one ----------
export const S23 = insert({
  Bg: BUSY, zoom: [1.3, 1.36], cy: 540, dim: 0.45,
  draw: (t) => {
    const k2 = at('In', 2) - at('set') + 4;
    return (
      <g>
        <Burger x={620} y={560} s={1.4} />
        <text x={620} y={330} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={66} fill="#F6EFE3">=</text>
        <Coin x={560} y={720} r={50} />
        <Coin x={680} y={720} r={50} />
        <g opacity={clamp((t - k2) / 6)}>
          <path d="M 1260 420 L 1360 420 L 1340 560 L 1280 560 Z" fill="#8A3A4A" stroke={P0} strokeWidth={5} />
          <Coin x={1310} y={720} r={50} />
          <text x={1310} y={850} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3">A CUP OF WINE, POMPEII</text>
        </g>
      </g>
    );
  },
});

// ---------- S24: the count: 40 the first day, 400 the third ----------
export const S24: React.FC<ShotProps> = (p) => {
  const second = at('third') - at('first', 2) + 2;
  const C1 = countCard({ kicker: 'DAY 1', to: 40, dur: 20, Bg: BUSY });
  const C2 = countCard({ kicker: 'DAY 3', to: 400, dur: 24, Bg: BUSY });
  return p.t < second ? <C1 {...p} /> : <C2 {...p} t={p.t - second} />;
};

// ---------- S25: the line round the block, and a gladiator on one knee in front of Tullia ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const kneel = easeOut(clamp((t - (at('gladiator') - at('By'))) / 10));
  const g: Pose = { ...basePose, x: 820, y: romeHip(1.25) + 50 * kneel, scale: 1.25, yaw: -0.6, expr: 'happy', legL: { a: -80 * kneel, b: 90 * kneel }, legR: { a: 10, b: 80 * kneel }, armR: { a: 110 * kneel, b: -20 }, blink: idleBlink(t, 2) };
  return (
    <g transform={camT(kf(t, [[0, 1200], [len, 760]]), 540, kf(t, [[0, 0.95], [len, 1.35]]))}>
      <RomeStreet t={t + 600} />
      {queue(10, 1000, 2200, 4).map((c, k) => <Hero key={k} look={c.look} pose={{ ...basePose, x: c.x, y: c.y, scale: c.scale!, yaw: -0.6, expr: 'happy', blink: idleBlink(t, k) }} />)}
      <Hero look={TULLIA} pose={{ ...basePose, x: 640, y: romeHip(1), yaw: 0.5, expr: kneel > 0.5 ? 'shock' : 'neutral', blink: idleBlink(t, 3) }} />
      <Hero look={GLADIATOR} pose={g} />
      {kneel > 0.8 ? <HoneyCake x={700} y={romeHip(1.25) - 20} s={0.6} /> : null}
    </g>
  );
};
