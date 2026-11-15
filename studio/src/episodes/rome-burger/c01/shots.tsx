import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, faceAt, TitleCard, Glow, Foreground, LEG_LEN } from '../../../engine';
import { YOU, TULLIA, FELIX, SENATOR, SOLDIER, GLADIATOR, BAKER, BOY, CITIZENS, faceCU, wordF } from '../common';
import { RomeStreet, ShopInside, ShopCounter, Grill, Smoke, Burger, Coin, ShopSign, Token, romeHip, SHOP, CircusMaximus, CrowdFront } from '../sets';
import { street, shop, queue, onStreet, atCounter, insert, streetSet, shopSet, circusSet, Chip, walker } from '../kit';
import words from './words.json';

// Chapter 1, cold open: the smell of the grill, the line round the block (senators, soldiers, bakers), a gladiator
// orders twelve, a boy's first bite, a senator's silver coin, the sign you painted, ROME AD 64, the title, and the
// threat: loved by the crowd, and in eight days the city burns.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const DAY = streetSet({ mode: 'day' });
const SHOPD = shopSet({});

// ---------- S1: the grill close up, patties sizzling, smoke rising ----------
export const S1 = insert({
  Bg: SHOPD, zoom: [1.5, 1.7], cx: 960, cy: 600, dim: 0.2,
  draw: (t) => (
    <g>
      <Grill x={960} y={640} s={1.6} t={t} n={4} flip={2} />
      <Smoke x={900} y={520} t={t} o={1} h={500} />
    </g>
  ),
});

// ---------- S2: the street: smoke drifts out of the shop, a passer-by stops and sniffs ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const sniff = easeOut(clamp((t - 8) / 10));
  const p: Pose = { ...basePose, x: 960, y: romeHip(0.95), scale: 0.95, yaw: -0.4 - 0.4 * sniff, tilt: -6 * sniff, headTilt: -8 * sniff, expr: sniff > 0.5 ? 'happy' : 'neutral', blink: sniff > 0.5 ? 1 : idleBlink(t, 2) };
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 860]]), 560, 1.25)}>
      <RomeStreet t={t + 200} />
      <Hero look={CITIZENS[1]} pose={p} />
    </g>
  );
};

// ---------- S3: the burger builds itself in close-up: bun, patty, cheese, lettuce, bun ----------
export const S3 = insert({
  Bg: SHOPD, zoom: [2.2, 2.35], cy: 560, dim: 0.3,
  draw: (t) => {
    const k = clamp(t / 60);
    return (
      <g>
        <ellipse cx={960} cy={650} rx={200} ry={30} fill="#EDE6DA" />
        <g transform={`translate(0 ${(1 - easeOut(clamp(t / 10))) * -200})`}>
          <Burger x={960} y={640} s={2} steam={k} t={t} />
        </g>
      </g>
    );
  },
});

// ---------- S4: the line all the way round the block; the camera pans along it ----------
export const S4 = street({
  cast: [...queue(9, 860, 2060, 1)],
  cam: { from: [760, 540, 0.95], to: [1300, 540, 1.0] },
});

// ---------- S5: senators in white togas, waiting ----------
export const S5 = street({
  cast: [onStreet(SENATOR, 820, { yaw: -0.6, faces: [[0, 'smug']] }), onStreet({ ...SENATOR, stripe: '#5A2A7A', hair: '#17131C' }, 1060, { yaw: -0.6, seed: 4 }), ...queue(2, 1300, 1500, 3)],
  cam: { from: [1000, 560, 1.7], to: [1040, 560, 1.8] },
});

// ---------- S6: two soldiers in the line ----------
export const S6 = street({
  cast: [onStreet(SOLDIER, 880, { yaw: -0.6 }), onStreet(SOLDIER, 1080, { yaw: -0.6, seed: 3, faces: [[0, 'happy']] })],
  cam: { from: [990, 560, 1.85], to: [960, 560, 1.95] },
});

// ---------- S7: a baker still covered in flour, a puff of flour as he pats his tunic ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const pat = Math.sin(t / 3);
  const p: Pose = { ...basePose, x: 960, y: romeHip(1), yaw: -0.4, expr: 'happy', armR: { a: 30 + pat * 10, b: -70 }, armL: { a: 20, b: -20 }, blink: idleBlink(t, 5) };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 2.1], [len, 2.2]]))}>
      <RomeStreet t={t + 300} />
      <Hero look={BAKER} pose={p} />
      {Array.from({ length: 10 }).map((_, k) => {
        const q = ((t * 1.5 + k * 9) % 40) / 40;
        return <circle key={k} cx={960 + Math.sin(k * 2) * 60 + q * 40} cy={romeHip(1) - 60 - q * 90} r={8 + q * 20} fill="#FFFFFF" opacity={0.6 * (1 - q)} />;
      })}
    </g>
  );
};

// ---------- S8: a gladiator the size of a door at the counter, low angle: TWELVE ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const p: Pose = { ...basePose, x: 1250, y: 820, scale: 2.3, yaw: -0.6, expr: t > 20 ? 'smug' : 'neutral', armR: { a: 150, b: 10 }, handR: 'open', blink: idleBlink(t, 2), talk: 0 };
  return (
    <g transform={camT(960, kf(t, [[0, 600], [len, 560]]), 1.15)}>
      <ShopInside t={t + 300} />
      <Hero look={YOU} pose={{ ...basePose, x: 640, y: SHOP.hip, yaw: 0.5, expr: 'shock', blink: idleBlink(t, 3) }} />
      <ShopCounter />
      <Hero look={GLADIATOR} pose={p} shadow={0} />
      <g transform={`translate(760 230) scale(${backOut(clamp((t - 30) / 8))})`}>
        <Token x={0} y={0} n="XII" s={2} />
      </g>
    </g>
  );
};

// ---------- S9: he walks off with a stack of burgers, already eating ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const x = 700 + t * 7;
  const p: Pose = { ...basePose, x, y: romeHip(1.3) + Math.abs(Math.sin(t * 0.3)) * -6, scale: 1.3, yaw: 0.7, expr: 'happy', armL: { a: 70, b: -80 }, armR: { a: 60, b: -90 }, legL: { a: Math.sin(t * 0.3) * 25, b: 0 }, legR: { a: -Math.sin(t * 0.3) * 25, b: 0 }, talk: Math.max(0, Math.sin(t / 2)) * 0.6 };
  return (
    <g transform={camT(x + 120, 560, 1.4)}>
      <RomeStreet t={t + 330} />
      <Hero look={GLADIATOR} pose={p} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((k) => (
        <Burger key={k} x={x + 70} y={romeHip(1.3) - 70 - k * 22} s={0.42} />
      ))}
    </g>
  );
};

// ---------- S10: a little boy takes his first bite ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const bite = clamp((t - 18) / 6);
  const p: Pose = { ...basePose, x: 960, y: 640, scale: 1, yaw: 0.2, expr: 'neutral', armR: { a: 110, b: -110 }, armL: { a: 100, b: -110 }, blink: idleBlink(t, 4), talk: bite > 0 && bite < 1 ? 0.8 : 0 };
  return (
    <g transform={camT(960, 470, kf(t, [[0, 2.4], [len, 2.6]]))}>
      <RomeStreet t={t + 360} />
      <Hero look={BOY} pose={p} shadow={0} />
      <Burger x={1060} y={520} s={0.5} bite={bite} rot={-10} />
    </g>
  );
};

// ---------- S11: his eyes go huge ----------
export const S11 = faceCU({ look: BOY, Bg: DAY, faces: [[0, 'neutral'], [6, 'shock']], yaw: 0.15, zoom: [3.4, 3.9], glint: 0.8, glintColor: '#FFD23A', light: { x: 960, y: 420, kind: 'warm', o: 0.6 } });

// ---------- S12: a senator flips a silver coin onto the marble ----------
export const S12 = insert({
  Bg: SHOPD, zoom: [1.8, 1.9], cy: 600, dim: 0.2,
  draw: (t) => {
    const k = clamp(t / 14);
    const y = 300 + 340 * easeOut(k) - Math.sin(k * Math.PI) * 140;
    return (
      <g>
        <rect x={500} y={640} width={920} height={300} fill="#EDE6DA" />
        <rect x={500} y={630} width={920} height={20} fill="#F6F0E6" />
        <Coin x={960} y={y} r={46} metal="silver" spin={t * 0.9 * (1 - k)} />
        {k >= 1 ? <Glow x={960} y={640} r={120} o={0.5} /> : null}
      </g>
    );
  },
});

// ---------- S13: ...and walks off without his change ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, 1.3)}>
    <RomeStreet t={t + 400} />
    {walker(SENATOR, 820, 1260, len, t, romeHip(1), 1, { expr: 'smug', armR: { a: 120, b: -20 } })}
  </g>
);

// ---------- S14: tilt up to the painted sign: BURGUS MAXIMUS ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(600, kf(t, [[0, 760], [len * 0.5, 520]]), kf(t, [[0, 1.6], [len, 2.1]]))}>
    <RomeStreet t={t + 420} />
    {queue(4, 860, 1300, 2).map((c, k) => <Hero key={k} look={c.look} pose={{ ...basePose, x: c.x, y: c.y, scale: c.scale!, yaw: -0.6, blink: idleBlink(t, k) }} />)}
  </g>
);

// ---------- S15: you, smug, a smear of green paint on your cheek ----------
export const S15 = faceCU({
  look: YOU, Bg: SHOPD, faces: [[0, 'smug']], yaw: -0.2, zoom: [3.2, 3.4],
  extra: () => <path d="M 1000 300 q 20 -6 34 4" stroke="#3A8A6A" strokeWidth={10} strokeLinecap="round" />,
});

// ---------- S16: the whole city: the Palatine, the Circus, the roofs. ROME, AD 64 ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, kf(t, [[0, 420], [len, 470]]), kf(t, [[0, 0.82], [len, 0.75]]))}>
      <RomeStreet t={t + 450} />
    </g>
    <Chip t={t - 22} text="ROME · AD 64" x={760} y={150} />
  </g>
);

// ---------- S17: the crowd at the counter, first bites, faces lighting up ----------
export const S17 = shop({
  cast: [atCounter(YOU, 760, { yaw: 0.2, faces: [[0, 'happy']] }), atCounter(TULLIA, 1100, { yaw: -0.2, faces: [[0, 'happy']] })],
  burgers: 4, crowd: 4, cam: { from: [960, 560, 1.15], to: [960, 560, 1.22] },
});

// ---------- S18: you hold a burger up; Tullia and Felix either side ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeOut(clamp(t / 10));
  const you: Pose = { ...basePose, x: 960, y: SHOP.hip, yaw: 0, expr: 'happy', armR: { a: 20 + 140 * up, b: 0 }, blink: idleBlink(t, 1) };
  const hand = { x: 960 - 70 * up, y: SHOP.hip - 120 - 120 * up };
  return (
    <g transform={camT(960, 470, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <ShopInside t={t + 480} />
      <Hero look={TULLIA} pose={{ ...basePose, x: 700, y: SHOP.hip, yaw: 0.3, expr: 'happy', blink: idleBlink(t, 2) }} />
      <Hero look={FELIX} pose={{ ...basePose, x: 1220, y: SHOP.hip + 20, scale: 0.9, yaw: -0.3, expr: 'happy', armL: { a: 150, b: 20 }, blink: idleBlink(t, 3) }} />
      <Hero look={YOU} pose={you} />
      <Burger x={hand.x - 30} y={hand.y - 10} s={0.6} />
      {up > 0.9 ? <Glow x={hand.x - 30} y={hand.y - 50} r={160} o={0.6} /> : null}
      <ShopCounter burgers={2} />
    </g>
  );
};

// ---------- S19: the title over the street at dusk ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 0.95], [len, 1.0]]))}>
    <RomeStreet t={t + 500} mode="dusk" />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0E0C1E" opacity={0.3} />
    <TitleCard t={t} lines={['WHAT IF YOU OPENED A', 'BURGER JOINT IN ROME?']} accent="ROME" size={110} y={200} />
  </g>
);

// ---------- S20: coins pile up on the counter; you count them, grinning ----------
export const S20 = insert({
  Bg: SHOPD, zoom: [1.9, 2.0], cy: 640, dim: 0.25,
  draw: (t) => (
    <g>
      <rect x={300} y={680} width={1320} height={300} fill="#EDE6DA" />
      {Array.from({ length: Math.min(40, Math.floor(t / 1.2)) }).map((_, k) => (
        <Coin key={k} x={760 + (k % 6) * 72 + (Math.floor(k / 6) % 2) * 30} y={720 - Math.floor(k / 6) * 16} r={34} metal={k % 5 ? 'bronze' : 'silver'} />
      ))}
    </g>
  ),
});

// ---------- S21: the crowd chanting at the Circus; up in the emperor's box, a figure leans forward ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 900], [len, 1180]]), kf(t, [[0, 420], [len, 300]]), kf(t, [[0, 1.0], [len, 1.9]]))}>
      <CircusMaximus t={t + 100} cheer={1} />
    </g>
    <Foreground blur={10}>
      <CrowdFront t={t} cheer={1} y={1040} />
    </Foreground>
  </g>
);

// ---------- S22: night: the sky over the roofs glows orange; you look up ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const f = clamp(t / 40);
  const face = faceAt(t, [[0, 'neutral'], [16, 'worried']]);
  return (
    <g transform={camT(960, kf(t, [[0, 600], [len, 540]]), kf(t, [[0, 1.2], [len, 1.4]]))}>
      <RomeStreet t={t + 600} mode="night" fire={f} open={false} />
      <Hero look={YOU} pose={{ ...basePose, x: 960, y: romeHip(1), yaw: 0.2, look: 0.4, headTilt: -10, ...face, blink: Math.max(face.blink, idleBlink(t, 2)) }} rimId="rimRed" />
    </g>
  );
};
