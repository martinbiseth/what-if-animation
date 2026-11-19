import React from 'react';
import { Kitchen, KITCHEN, KitchenIsland } from '../../../engine';
import {
  ShopStreet, Scooter, HotDog, HealthBar, Fence, Star, Big, Soft, PhoneFrame, VideoPost, ruleCard, versus,
  YOU, MO, MOM, Body, runPose, standAt, stand, GROUND, shopX, camT, kf, clamp, backOut, easeOut, basePose, Hero, FONT, span,
  ShotProps, Pose, Word,
} from '../common';
import words from './words.json';

// Chapter 2, the rules: five rules straight from the game (run, wheels, eat to heal, the city is your map, hide and
// the stars fade), Mo will film everything, Mom doesn't know yet, and a game day is less than an hour long.

const W = words as Word[];
const X = shopX(2);

// ---------------------------------------------------------------- S1: you and Mo on the kerb, making the deal
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const a = standAt(X - 160, 1);
  const b = standAt(X + 160, 1);
  return (
    <g transform={camT(X, 620, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <ShopStreet t={t + 300} />
      <Body look={YOU} pose={{ ...a, yaw: 0.5, armR: { a: 40 + 20 * Math.sin(t / 6), b: -60 } }} t={t} faces={[[0, 'smug']]} shadow={1} />
      <Body look={MO} pose={{ ...b, yaw: -0.5, armL: { a: 30, b: -40 } }} t={t} faces={[[0, 'happy']]} seed={2} shadow={1} />
    </g>
  );
};

const RunIcon: React.FC<{ t: number }> = ({ t }) => (
  <g transform="scale(0.8)">
    <Hero look={YOU} pose={runPose(0, t * 0.7, 140, 1)} shadow={0} />
  </g>
);

export const S2 = ruleCard({ n: 1, rule: 'NEVER WALK.\nALWAYS RUN.', icon: (t) => <RunIcon t={t} /> });
export const S3 = ruleCard({ n: 2, rule: 'ANYTHING WITH\nWHEELS IS A RIDE.', icon: (t) => <Scooter x={-30} y={130} s={1.3} spin={t * 12} /> });
export const S4 = ruleCard({
  n: 3, rule: 'HURT? EAT\nSOMETHING.', icon: (t) => (
    <g>
      <HotDog x={0} y={-40} s={1.5} rot={-8} />
      <HealthBar x={-210} y={110} p={0.2 + 0.8 * clamp((t - 10) / 20)} />
    </g>
  ),
});
export const S5 = ruleCard({ n: 4, rule: 'THE CITY IS\nYOUR MAP.', icon: () => <Fence x0={-200} x1={200} y0={-160} y1={140} /> });
export const S6 = ruleCard({ n: 5, rule: 'HIDE. THE STARS\nFADE.', color: '#FF5A4A', icon: (t) => <Star x={0} y={0} r={160} on={1} /> });

// ---------------------------------------------------------------- S7: five stars, fading one by one
export const S7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#14102A" />
    {[0, 1, 2, 3, 4].map((i) => {
      const fade = clamp((t - 20 - (4 - i) * 10) / 10);
      return (
        <g key={i} transform={`translate(${480 + i * 240} 500) scale(${1 - 0.3 * fade})`} opacity={1 - 0.85 * fade}>
          <Star x={0} y={0} r={90} on={1} />
        </g>
      );
    })}
    <g opacity={clamp((t - 70) / 8)}>
      <Big x={960} y={800} size={100}>EVERYBODY FORGETS</Big>
    </g>
  </g>
);

// ---------------------------------------------------------------- S8: Mo's face: best idea ever
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.2}>
      <g transform={camT(X, 560, 1.6)}>
        <ShopStreet t={t + 340} />
      </g>
    </Soft>
    <g transform={camT(960, 500, kf(t, [[0, 2.9], [len, 3.15]]))}>
      <Body look={MO} pose={{ ...basePose, x: 960, y: 700, yaw: -0.3, armL: { a: 140, b: -20 }, armR: { a: 140, b: -20 }, headTilt: Math.sin(t / 4) * 4 }} t={t} faces={[[0, 'happy']]} seed={2} />
    </g>
  </g>
);

// ---------------------------------------------------------------- S9: Mo films everything
export const S9: React.FC<ShotProps> = ({ t, len, f }) => {
  const b = standAt(X + 80, 1.15, GROUND + 30);
  const line = span(W, "I'll", 'legendary');
  return (
    <g transform={camT(X + 60, 600, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <ShopStreet t={t + 360} />
      <Body look={MO} pose={{ ...b, yaw: -0.4, armR: { a: 150, b: -60 }, armL: { a: 140, b: -50 } }} t={t} f={f} words={W} talk={[line]} faces={[[0, 'happy']]} seed={2} shadow={1} />
      <g transform={`translate(${b.x - 150} ${b.y - 250}) rotate(-6) scale(0.22)`}>
        <rect x={-150} y={-300} width={300} height={600} rx={44} fill="#1A1922" stroke="#4A4858" strokeWidth={10} />
        <circle cx={-80} cy={-220} r={22} fill="#0B0816" stroke="#6A6672" strokeWidth={6} />
      </g>
      <g opacity={Math.floor(t / 12) % 2 ? 1 : 0.3}>
        <circle cx={b.x + 260} cy={b.y - 360} r={16} fill="#FF3A2E" />
        <text x={b.x + 290} y={b.y - 348} fontFamily={FONT.ui} fontSize={34} fill="#FF3A2E">REC</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S10: Mom, at home, no idea. Yet.
const MP = stand(KITCHEN, 0.6, 0.4);
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(MP.x - 60, MP.y + 10, kf(t, [[0, 2.0], [len, 2.15]]))}>
    <Kitchen t={t + 100} veil={0.15} />
    <Body look={MOM} pose={{ ...basePose, ...MP, yaw: -0.3, armR: { a: 110, b: -120 }, headTilt: 3 }} t={t} faces={[[0, 'happy']]} seed={3} />
    <KitchenIsland />
    <g transform={`translate(${MP.x - 220} ${MP.y - 260}) scale(${backOut(clamp((t - 30) / 9))})`}>
      <Big x={0} y={0} size={90} fill="#FFD23A">...YET.</Big>
    </g>
  </g>
);

// ---------------------------------------------------------------- S11: a game day is under an hour; a real one isn't
const Clock: React.FC<{ t: number; speed: number; color: string }> = ({ t, speed, color }) => (
  <g>
    <circle r={160} fill="#14121C" stroke={color} strokeWidth={10} />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-4} y={-150} width={8} height={22} fill={color} transform={`rotate(${i * 30})`} />)}
    <rect x={-6} y={-90} width={12} height={96} rx={6} fill="#F6EFE3" transform={`rotate(${t * speed / 12})`} />
    <rect x={-4} y={-130} width={8} height={136} rx={4} fill={color} transform={`rotate(${t * speed})`} />
    <circle r={12} fill={color} />
  </g>
);
export const S11 = versus({
  game: 'A DAY: UNDER AN HOUR', real: 'A DAY: 24 HOURS', at: 40,
  gameIcon: (t) => <Clock t={t} speed={40} color="#4AD06A" />,
  realIcon: (t) => <Clock t={t} speed={0.5} color="#FF5A4A" />,
});

// ---------------------------------------------------------------- S12: fist bump, "which one breaks first?"
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 16));
  const a = standAt(X - 140, 1);
  const b = standAt(X + 140, 1);
  return (
    <g>
      <g transform={camT(X, 620, kf(t, [[0, 1.55], [len, 1.4]]))}>
        <ShopStreet t={t + 400} />
        <Body look={YOU} pose={{ ...a, yaw: 0.6, armR: { a: 20 + 70 * k, b: -10 } }} t={t} faces={[[0, 'smug']]} shadow={1} />
        <Body look={MO} pose={{ ...b, yaw: -0.6, armR: { a: 20 + 70 * k, b: -10 } }} t={t} faces={[[0, 'happy']]} seed={2} shadow={1} />
      </g>
      <g opacity={clamp((t - 40) / 8)}>
        <Big x={960} y={290} size={90} fill="#FFD23A">WHICH ONE BREAKS FIRST?</Big>
      </g>
    </g>
  );
};

