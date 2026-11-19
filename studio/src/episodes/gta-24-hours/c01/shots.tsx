import React from 'react';
import { bedSit, Schematic, SCH, PaperStack, Glow as G2 } from '../../../engine';
import {
  ShopStreet, Backyard, Bedroom, Car, Fence, Hoodie, Baguette, TrafficLight, Big, PopWord, Star, Soft,
  YOU, YOU_NOHOOD, LADY, Body, runPose, standAt, hipAt, GROUND, shopX, camT, kf, clamp, backOut, easeOut, basePose, Hero, FONT, Glow, shk, rnd,
  ShotProps, Pose, setShot, bigWord,
} from '../common';
import words from './words.json';

// Chapter 1, the cold open: 8 AM, you decide to live like the game for 24 hours. You sprint to the bus stop, cross on
// red (a bus honks you back), jump the fence and lose your hoodie, grab the handle of a car outside the bakery: locked,
// the alarm, and the owner with her baguette right behind you. "This is where the paperwork starts." Title.

const W = words as { w: string; s: number; e: number }[];
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <ShopStreet t={t} id={id} />;
const BAK = shopX(1); // the bakery's centre

// ---------------------------------------------------------------- the bus
const Bus: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-330} width={840} height={300} rx={30} fill="#E8B92A" stroke="#0B0816" strokeWidth={8} />
    {Array.from({ length: 6 }).map((_, i) => <rect key={i} x={-390 + i * 130} y={-300} width={110} height={110} rx={10} fill="#9AC0D8" stroke="#0B0816" strokeWidth={5} />)}
    <rect x={-420} y={-150} width={840} height={30} fill="#C8962A" />
    {[-280, 280].map((wx) => <circle key={wx} cx={wx} cy={-30} r={56} fill="#1A1820" stroke="#0B0816" strokeWidth={7} />)}
    <rect x={-440} y={-120} width={40} height={40} rx={8} fill="#FFF6C8" />
  </g>
);

// ---------------------------------------------------------------- S1: 8 AM, you sit up in bed, decided
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const st = bedSit(0.32);
  const up = easeOut(clamp(t / 14));
  const pose: Pose = { ...basePose, ...st, yaw: 0.35, tilt: -30 * (1 - up), legL: { a: 80, b: -80 }, legR: { a: 76, b: -84 }, armR: { a: 40 + 100 * clamp((t - 30) / 8), b: -60 } };
  return (
    <g transform={camT(st.x + 80, st.y - 60, kf(t, [[0, 1.9], [len, 2.1]]))}>
      <Bedroom t={t + 80} veil={0.1} clock="08:00" lamp={0} crossed={0} />
      <Glow x={1200} y={460} r={600} kind="warm" o={0.5} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'tired'], [16, 'smug']]} />
    </g>
  );
};

// ---------------------------------------------------------------- S2: 24 HOURS, five empty stars
export const S2: React.FC<ShotProps> = ({ t }) => {
  const pop = backOut(clamp((t - 2) / 9));
  return (
    <g>
      <Soft blur={16} dim={0.55}>
        <ShopStreet t={t + 400} id="s2" />
      </Soft>
      <g transform={`translate(960 520) scale(${pop})`}>
        <Big x={0} y={0} size={240} fill="#FFD23A">24 HOURS</Big>
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${720 + i * 120} 690) scale(${backOut(clamp((t - 8 - i * 3) / 8))})`}>
          <Star x={0} y={0} r={46} on={0} />
        </g>
      ))}
      <text x={960} y={850} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#F6EFE3" opacity={clamp((t - 20) / 8)}>LIVING LIKE THE GAME</text>
    </g>
  );
};

// ---------------------------------------------------------------- S3: you sprint along the shops
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, -200], [len, 2100]], (k) => k);
  return (
    <g transform={camT(kf(t, [[0, 500], [len, 1400]]), 600, 1.25)}>
      <ShopStreet t={t + 20} />
      <Body look={YOU} pose={runPose(x, t * 0.7, GROUND, 1)} t={t} faces={[[0, 'happy']]} shadow={1} />
      {[0, 1, 2].map((i) => <rect key={i} x={x - 220 - i * 40} y={GROUND - 260 + i * 70} width={140 - i * 30} height={8} rx={4} fill="#FFFFFF" opacity={0.6} />)}
    </g>
  );
};

// ---------------------------------------------------------------- S4: close-up, running, arms pumping, wind lines
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const ph = t * 0.8;
  const pose: Pose = { ...runPose(960, ph, 1120, 1.9), y: 1120 - 140 * 1.9 + Math.abs(Math.cos(ph)) * -10 };
  return (
    <g>
      <g transform={`translate(${-((t * 40) % 470)} 0)`}>
        <Soft blur={10} dim={0.1}>
          <g transform={camT(960, 500, 1.4)}>
            <ShopStreet t={t} id="s4" />
          </g>
        </Soft>
      </g>
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'cool']]} />
      {Array.from({ length: 8 }).map((_, i) => {
        const y = 150 + rnd(4, i) * 780;
        const x = 1920 - ((t * 60 + i * 300) % 2400);
        return <rect key={i} x={x} y={y} width={220} height={8} rx={4} fill="#FFFFFF" opacity={0.5} />;
      })}
      {kf(t, [[0, 0], [Math.max(1, len), 1]]) > 2 ? null : null}
    </g>
  );
};

// ---------------------------------------------------------------- S5: the light is red
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1500, 420, kf(t, [[0, 2.4], [len, 2.7]]))}>
    <ShopStreet t={t + 60} light={{ x: 1500, c: 'red' }} />
  </g>
);

// ---------------------------------------------------------------- S6: you step into the road anyway
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1100], [len, 1300]]);
  return (
    <g transform={camT(1250, 760, 1.3)}>
      <ShopStreet t={t + 70} light={{ x: 1500, c: 'red' }} />
      <Body look={YOU} pose={{ ...runPose(x, t * 0.4, GROUND + 90, 1), tilt: 6 }} t={t} faces={[[0, 'smug']]} shadow={1} />
    </g>
  );
};

// ---------------------------------------------------------------- S7: the bus honks, you jump back onto the curb
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const bx = kf(t, [[0, 2600], [16, 1900], [len, 1840]], easeOut);
  const jump = clamp((t - 10) / 8);
  const x = 1300 - 200 * easeOut(jump);
  const hop = Math.sin(jump * Math.PI) * 110;
  return (
    <g transform={`${shk(t, 8, 14, 12)} ${camT(1450, 700, 1.15)}`}>
      <ShopStreet t={t + 80} light={{ x: 1500, c: 'red' }} />
      <Body look={YOU} pose={{ ...basePose, x, y: hipAt(1, jump < 1 ? GROUND + 90 - 90 * jump : GROUND) - hop, yaw: -0.5, facing: 1, armL: { a: 150, b: 0 }, armR: { a: 150, b: 0 }, legL: { a: 30, b: -60 }, legR: { a: -20, b: -40 } }} t={t} faces={[[0, 'shock']]} shadow={1} />
      <Bus x={bx} y={1060} s={1} />
      <PopWord t={t} at={6} x={1700} y={560} text="HOOONK!" size={110} />
    </g>
  );
};

// ---------------------------------------------------------------- S8: you jump the neighbour's fence
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 30);
  const x = 500 + 700 * k;
  const y = hipAt(1, 860) - Math.sin(k * Math.PI) * 330;
  return (
    <g transform={camT(860, 560, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <Backyard t={t + 30} />
      <Fence x0={720} x1={1000} y0={500} y1={860} c="#B88A5A" />
      <Body look={YOU} pose={{ ...basePose, x, y, yaw: 0.6, spin: 30 * Math.sin(k * Math.PI), armL: { a: 160, b: 0 }, armR: { a: 120, b: -20 }, legL: { a: 70, b: -90 }, legR: { a: -10, b: -60 } }} t={t} faces={[[0, 'happy']]} shadow={1} />
    </g>
  );
};

// ---------------------------------------------------------------- S9: the hoodie stays on the fence; you don't
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1100], [len, 1700]], (k) => k);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1100]]), 560, 1.2)}>
      <Backyard t={t + 60} />
      <Fence x0={720} x1={1000} y0={500} y1={860} c="#B88A5A" />
      <Hoodie x={860} y={470} rot={Math.sin(t / 6) * 6} s={1.1} />
      <Body look={YOU_NOHOOD} pose={runPose(x, t * 0.6, 860, 1)} t={t} faces={[[0, 'happy']]} shadow={1} />
      <PopWord t={t} at={14} x={860} y={300} text="HOODIE: STAYS" size={60} fill="#FFFFFF" hold={60} />
    </g>
  );
};

// ---------------------------------------------------------------- S10: a car parked outside the bakery
export const S10 = setShot(DAY, [BAK, 620, 1.2], [BAK + 60, 650, 1.3], (t) => <Car x={BAK} y={1030} s={1.05} color="#3E6E9A" />);

// ---------------------------------------------------------------- S11: in the game, that's your car now
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const st = standAt(BAK - 380, 1);
  return (
    <g transform={camT(BAK - 200, 640, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <ShopStreet t={t + 100} />
      <Car x={BAK} y={1030} s={1.05} color="#3E6E9A" />
      <Body look={YOU_NOHOOD} pose={{ ...st, yaw: 0.6, armR: { a: 50, b: -40 } }} t={t} faces={[[0, 'smug']]} shadow={1} />
      <g transform={`translate(${st.x + 120} ${st.y - 300}) scale(${backOut(clamp((t - 6) / 9))})`}>
        <ellipse cx={0} cy={0} rx={190} ry={80} fill="#F6EFE3" stroke="#0B0816" strokeWidth={6} />
        <circle cx={-80} cy={100} r={16} fill="#F6EFE3" stroke="#0B0816" strokeWidth={5} />
        <text x={0} y={18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#14121C">MY CAR NOW</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S12: your hand grabs the door handle (insert)
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp(t / 10));
  const pull = t > 14 ? Math.sin(Math.min(1, (t - 14) / 6) * Math.PI) * 12 : 0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <rect width={1920} height={1080} fill="#3E6E9A" />
      <rect x={-100} y={-100} width={2200} height={400} fill="#7AA8C8" stroke="#0B0816" strokeWidth={10} />
      <path d="M -100 300 L 2100 300" stroke="#2E5A82" strokeWidth={8} />
      <rect x={1100} y={520} width={300} height={70} rx={35} fill="#C8D0D8" stroke="#0B0816" strokeWidth={8} />
      <g transform={`translate(${2100 - 750 * reach - pull} 560)`}>
        <rect x={0} y={-60} width={900} height={120} rx={60} fill={YOU_NOHOOD.jacket} stroke="#0B0816" strokeWidth={8} />
        <ellipse cx={0} cy={0} rx={90} ry={70} fill={YOU.skin} stroke="#0B0816" strokeWidth={8} />
        {[-40, -10, 20].map((dy) => <rect key={dy} x={-150} y={dy - 12} width={90} height={26} rx={13} fill={YOU.skin} stroke="#0B0816" strokeWidth={6} />)}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S13: LOCKED, the alarm
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const on = Math.floor(t / 5) % 2 === 0;
  const st = standAt(BAK - 330, 1);
  return (
    <g transform={`${shk(t, 0, 18, 8)} ${camT(BAK - 100, 650, kf(t, [[0, 1.45], [len, 1.5]]))}`}>
      <ShopStreet t={t + 120} />
      <Car x={BAK} y={1030} s={1.05} color="#3E6E9A" lights={on ? 1 : 0} />
      {on ? <G2 x={BAK - 250} y={950} r={260} kind="warm" o={0.9} /> : null}
      {on ? <G2 x={BAK + 250} y={950} r={260} kind="red" o={0.8} /> : null}
      <Body look={YOU_NOHOOD} pose={{ ...st, yaw: 0.6, armR: { a: 80, b: -10 }, armL: { a: 30, b: -20 } }} t={t} faces={[[0, 'oops']]} shadow={1} />
      <PopWord t={t} at={2} x={BAK + 100} y={640} text="LOCKED" size={110} fill="#FF4A3A" hold={18} rot={3} />
      <PopWord t={t} at={22} x={BAK + 60} y={640} text="WEE-OOO WEE-OOO" size={80} fill="#FFD23A" hold={60} rot={-3} />
    </g>
  );
};

// ---------------------------------------------------------------- S14: the owner, right behind you, with her baguette
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const me = standAt(BAK - 300, 1.15, GROUND + 20);
  const her = standAt(BAK - 620, 0.92, GROUND + 20);
  return (
    <g transform={camT(BAK - 420, 600, kf(t, [[0, 1.55], [len, 1.7]]))}>
      <ShopStreet t={t + 140} />
      <Car x={BAK} y={1030} s={1.05} color="#3E6E9A" lights={Math.floor(t / 5) % 2} />
      <Body look={LADY} pose={{ ...her, yaw: 0.5, armR: { a: 70, b: -90 }, armL: { a: 20, b: -10 } }} t={t} faces={[[0, 'neutral'], [30, 'smug']]} seed={4} shadow={1} />
      <Baguette x={her.x + 70} y={her.y - 60} s={0.8} rot={-70} />
      <Body look={YOU_NOHOOD} pose={{ ...me, yaw: 0.7, armR: { a: 80, b: -10 } }} t={t} faces={[[0, 'oops']]} shadow={1} />
    </g>
  );
};

// ---------------------------------------------------------------- S15: your face as you turn around
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const yaw = kf(t, [[0, 0.7], [10, -0.5]]);
  return (
    <g>
      <Soft blur={16} dim={0.2}>
        <g transform={camT(BAK - 300, 560, 1.6)}>
          <ShopStreet t={t + 160} />
        </g>
      </Soft>
      <g transform={camT(960, 500, kf(t, [[0, 3.0], [len, 3.3]]))}>
        <Body look={YOU_NOHOOD} pose={{ ...basePose, x: 960, y: 700, yaw, look: -0.6 }} t={t} faces={[[0, 'oops'], [10, 'shock']]} />
        <path d="M 1050 470 q 10 30 0 44 q -12 -14 0 -44 Z" fill="#8FD3FF" stroke="#0B0816" strokeWidth={3} opacity={t > 12 ? 1 : 0} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S16: "in the game, this is where the fun starts": a star pops
export const S16: React.FC<ShotProps> = ({ t }) => {
  const pop = backOut(clamp((t - 10) / 10));
  return (
    <g>
      <rect width={1920} height={1080} fill="#14102A" />
      {Array.from({ length: 16 }).map((_, i) => (
        <rect key={i} x={-200 + i * 160 + ((t * 3) % 160)} y={-100} width={60} height={1300} fill="#FFD23A" opacity={0.05} transform="rotate(20 960 540)" />
      ))}
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#4AD06A" opacity={clamp(t / 6)}>IN THE GAME</text>
      <g transform={`translate(960 560) scale(${pop}) rotate(${(1 - pop) * 90})`}>
        <Star x={0} y={0} r={190} on={1} />
      </g>
      <g opacity={clamp((t - 18) / 6)}>
        <Big x={960} y={900} size={110} fill="#FFFFFF">THE FUN STARTS</Big>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S17: "in real life, the paperwork starts": forms land on a desk
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(14, Math.floor(t / 3));
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2A3A" />
      <rect x={0} y={760} width={1920} height={320} fill="#6A5442" />
      <G2 x={960} y={200} r={800} kind="cool" o={0.3} />
      <text x={960} y={220} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#FF5A4A" opacity={clamp(t / 6)}>IN REAL LIFE</text>
      <PaperStack x={960} y={780} n={n} w={520} />
      {Array.from({ length: 3 }).map((_, i) => {
        const k = ((t + i * 7) % 21) / 21;
        return <rect key={i} x={760 + i * 120} y={-100 + 860 * k} width={260} height={30} rx={4} fill="#F6EFE3" stroke="#0B0816" strokeWidth={4} transform={`rotate(${(i - 1) * 8} ${880 + i * 120} ${-100 + 860 * k})`} opacity={k < 0.95 ? 1 : 0} />;
      })}
      <g opacity={clamp((t - 14) / 6)}>
        <Big x={960} y={420} size={120} fill="#FFFFFF">THE PAPERWORK</Big>
      </g>
      {kf(t, [[0, 0], [Math.max(1, len), 1]]) > 2 ? null : null}
    </g>
  );
};

// ---------------------------------------------------------------- S18: the title
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  return (
    <g>
      <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1.12]]))}>
        <ShopStreet t={t + 200} mode="dusk" id="s18" />
      </g>
      <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.45} />
      <g transform={`translate(960 380) scale(${pop(2)})`}>
        <Big x={0} y={0} size={120}>WHAT IF YOU ACTED</Big>
      </g>
      <g transform={`translate(960 560) scale(${pop(8)})`}>
        <Big x={0} y={0} size={150} fill="#FFD23A">LIKE GTA 6</Big>
      </g>
      <g transform={`translate(960 730) scale(${pop(14)})`}>
        <Big x={0} y={0} size={110}>FOR 24 HOURS?</Big>
      </g>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${720 + i * 120} 880) scale(${backOut(clamp((t - 20 - i * 3) / 8))})`}>
          <Star x={0} y={0} r={40} on={0} />
        </g>
      ))}
    </g>
  );
};
