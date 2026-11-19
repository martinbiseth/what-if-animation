import React from 'react';
import { factCard, Mug } from '../../../engine';
import {
  ShopStreet, Park, Backyard, Store, Curtain, Sombrero, Fence, Scooter, HotDog, HotDogCart, HealthBar, PoliceDog, Pigeon, Big, PopWord, Soft,
  PhoneFrame, VideoPost, clockCard, versus, phoneShot,
  YOU, YOU_NOHOOD, YOU_TRACK, YOU_SUIT, MO, LADY, RANGER, ROBE, GUARD, VENDOR, SCOOTGUY, Body, runPose, wheeze, standAt, sitPose, hipAt, GROUND, shopX,
  camT, kf, clamp, backOut, easeOut, basePose, FONT, shk, ShotProps, Pose,
} from '../common';

// Chapter 3, the fun part: 9 AM rule one (ten seconds of amazing, then jelly legs: muscles' fastest fuel lasts about
// 10 s), 10 AM rule two (scooter "car chase" through the park, the ranger's whistle), 11 AM rule four (the backyard
// shortcut, the man in the bathrobe, his dog), noon rule three (six hot dogs: about 1,800 calories, no healing), 12:30
// the store (seven outfits, the guard), and Mo has been filming and posting all along.

const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <ShopStreet t={t} id={id} />;
const PK: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Park t={t} id={id} />;
const BY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Backyard t={t} id={id} />;
const ST: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Store t={t} id={id} />;
const PH = shopX(2); // the pharmacy

export const S1 = clockCard({ clock: '9:00 AM', kicker: 'RULE ONE', Bg: DAY });

// ---------------------------------------------------------------- S2: ten seconds of amazing: past people, a dog, a scooter
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[0, -100], [len, 1900]], (k) => k);
  const x = cx + 120;
  return (
    <g transform={camT(cx, 640, 1.3)}>
      <ShopStreet t={t + 40} />
      <Body look={LADY} pose={standAt(500, 0.95, GROUND, { yaw: 0.6 })} t={t} faces={[[0, 'neutral'], [8, 'shock']]} seed={4} shadow={1} />
      <Body look={VENDOR} pose={standAt(1200, 1, GROUND, { yaw: -0.5 })} t={t} faces={[[0, 'neutral'], [30, 'shock']]} seed={6} shadow={1} />
      <PoliceDog x={850} y={GROUND} s={0.6} t={t} harness={false} fur="#8A6A4A" flip />
      <Scooter x={kf(t, [[0, 1500], [len, 2000]], (k) => k)} y={GROUND} s={0.9} />
      <Body look={SCOOTGUY} pose={standAt(kf(t, [[0, 1500], [len, 2000]], (k) => k), 0.95, GROUND - 40, { yaw: 0.6, armR: { a: 70, b: -30 } })} t={t} seed={7} shadow={0} />
      <Body look={YOU} pose={runPose(x, t * 0.75, GROUND, 1)} t={t} faces={[[0, 'happy']]} shadow={1} />
      {[0, 1, 2].map((i) => <rect key={i} x={x - 230 - i * 40} y={GROUND - 260 + i * 70} width={140 - i * 30} height={8} rx={4} fill="#FFFFFF" opacity={0.6} />)}
    </g>
  );
};

// ---------------------------------------------------------------- S3: then your legs turn to jelly
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const w = Math.sin(t * 1.3) * 18;
  const pose: Pose = { ...basePose, x: PH - 200, y: hipAt(1) + 20, yaw: 0.5, tilt: 10, legL: { a: 20 + w, b: -40 - w }, legR: { a: -10 - w, b: -50 + w }, armL: { a: 20, b: 10 }, armR: { a: 20, b: 10 } };
  return (
    <g transform={camT(PH - 200, 700, kf(t, [[0, 2.0], [len, 2.2]]))}>
      <ShopStreet t={t + 80} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'worried'], [14, 'tired']]} shadow={1} />
      <PopWord t={t} at={10} x={PH} y={560} text="JELLY" size={90} fill="#7FE07A" hold={70} />
    </g>
  );
};

export const S4 = factCard({ value: 10, suffix: ' s', label: 'ALL-OUT SPRINT, THEN YOU SLOW DOWN', sub: "your muscles' fastest fuel is used up" });

// ---------------------------------------------------------------- S5: bent over outside the pharmacy; the scooter guy waves
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const sx = kf(t, [[0, PH - 900], [len, PH + 700]], (k) => k);
  return (
    <g transform={camT(PH, 640, 1.45)}>
      <ShopStreet t={t + 120} />
      <Body look={YOU} pose={wheeze(PH - 40, GROUND, 1, t)} t={t} faces={[[0, 'tired']]} shadow={1} />
      <Scooter x={sx} y={GROUND + 60} s={0.95} />
      <Body look={SCOOTGUY} pose={standAt(sx, 0.95, GROUND + 20, { yaw: -0.2, armL: { a: 150 + Math.sin(t / 3) * 20, b: -20 } })} t={t} faces={[[0, 'happy']]} seed={7} shadow={0} />
      {Array.from({ length: 3 }).map((_, i) => (
        <text key={i} x={PH + 60 + i * 30} y={GROUND - 300 - ((t * 1.5 + i * 20) % 60)} fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#F6EFE3" opacity={0.8}>huff</text>
      ))}
    </g>
  );
};

export const S6 = clockCard({ clock: '10:00 AM', kicker: 'RULE TWO', Bg: PK });

// ---------------------------------------------------------------- S7: the scooter car chase through the park
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const k = t / Math.max(1, len);
  const x1 = -300 + 2600 * k;
  const x2 = x1 - 330;
  const yy = (x: number) => 900 + Math.sin(x / 260) * 30;
  const pig = clamp((x1 - 900) / 200);
  return (
    <g transform={camT(kf(t, [[0, 500], [len, 1500]]), 640, 1.15)}>
      <Park t={t + 20} />
      <Pigeon x={1100} y={900 - 200 * pig} s={1.1} flap={pig > 0 ? t : 0} lift={pig} />
      {[[x2, MO, 2], [x1, YOU, 1]].map(([x, look, seed], i) => (
        <g key={i}>
          <Scooter x={x as number} y={yy(x as number)} s={0.95} spin={t * 20} />
          <Body look={look as typeof YOU} pose={standAt(x as number, 0.95, yy(x as number) - 40, { yaw: 0.6, tilt: 12, armR: { a: 70, b: -30 }, armL: { a: 60, b: -30 } })} t={t} faces={[[0, 'happy']]} seed={seed as number} shadow={0} />
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- S8: the ranger blows a whistle
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.15}>
      <g transform={camT(960, 640, 1.5)}>
        <Park t={t + 60} />
      </g>
    </Soft>
    <g transform={`${shk(t, 6, 20, 5)} ${camT(960, 500, kf(t, [[0, 2.8], [len, 3.0]]))}`}>
      <Body look={RANGER} pose={{ ...basePose, x: 960, y: 700, yaw: 0.4, armR: { a: 150, b: -140 } }} t={t} faces={[[0, 'shock']]} seed={8} />
      <rect x={1010} y={505} width={40} height={18} rx={6} fill="#C8D0D8" stroke="#0B0816" strokeWidth={4} />
    </g>
    <PopWord t={t} at={4} x={1400} y={300} text="FWEEEET!" size={100} fill="#FFFFFF" hold={50} rot={6} />
  </g>
);

// ---------------------------------------------------------------- S9: you don't stop: you zoom past the spinning ranger
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const x1 = kf(t, [[0, 300], [len, 2100]], (k) => k);
  const spin = clamp((t - 14) / 20);
  return (
    <g transform={camT(1000, 640, 1.25)}>
      <Park t={t + 100} />
      <Body look={RANGER} pose={standAt(1000, 1, 900, { yaw: Math.cos(spin * 6.28) * 0.8, armR: { a: 150, b: -140 } })} t={t} faces={[[0, 'shock'], [20, 'dizzy']]} seed={8} shadow={1} />
      {[[x1 - 330, MO, 2], [x1, YOU, 1]].map(([x, look, seed], i) => (
        <g key={i}>
          <Scooter x={x as number} y={900} s={0.95} spin={t * 20} />
          <Body look={look as typeof YOU} pose={standAt(x as number, 0.95, 860, { yaw: 0.6, tilt: 12, armR: { a: 70, b: -30 } })} t={t} faces={[[0, 'cool']]} seed={seed as number} shadow={0} />
        </g>
      ))}
    </g>
  );
};

export const S10 = clockCard({ clock: '11:00 AM', kicker: 'RULE FOUR', Bg: BY });

// ---------------------------------------------------------------- S11: the backyard shortcut, past the man in the bathrobe
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 100], [len, 1300]], (k) => k);
  const rb = standAt(1420, 1, 840);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1100]]), 600, 1.15)}>
      <Backyard t={t + 120} />
      <Body look={ROBE} pose={{ ...rb, yaw: -0.4, armR: { a: 70, b: -110 } }} t={t} faces={[[0, 'neutral'], [Math.round(len * 0.5), 'shock']]} seed={9} shadow={1} />
      <Mug x={rb.x - 70} y={rb.y - 90} rot={0} steam={1} f={t} />
      <Body look={YOU_NOHOOD} pose={runPose(x, t * 0.65, 880, 1, 1, { armR: { a: 140, b: -20 } })} t={t} faces={[[0, 'happy']]} shadow={1} />
      <PopWord t={t} at={Math.round(len * 0.6)} x={x + 60} y={420} text="MORNING!" size={70} fill="#FFFFFF" hold={60} />
    </g>
  );
};

// ---------------------------------------------------------------- S12: he does not say morning back
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.15}>
      <g transform={camT(1500, 500, 1.6)}>
        <Backyard t={t + 140} />
      </g>
    </Soft>
    <g transform={camT(960, 500, kf(t, [[0, 3.0], [len, 3.25]]))}>
      <Body look={ROBE} pose={{ ...basePose, x: 960, y: 700, yaw: -0.3, armR: { a: 70, b: -110 }, look: 0.5 }} t={t} faces={[[0, 'neutral']]} seed={9} />
      <Mug x={890} y={610} rot={0} steam={1} f={t} />
    </g>
  </g>
);

// ---------------------------------------------------------------- S13: his dog chases you to the next fence
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 500], [len, 1700]], (k) => k);
  const climb = clamp((x - 1450) / 200);
  return (
    <g transform={camT(kf(t, [[0, 800], [len, 1400]]), 600, 1.15)}>
      <Backyard t={t + 160} />
      <Fence x0={1500} x1={1760} y0={480} y1={880} c="#B88A5A" />
      <Body look={YOU_NOHOOD} pose={climb > 0 ? { ...basePose, x: 1560, y: hipAt(1, 880) - 260 * climb, yaw: 0.2, armL: { a: 170, b: 0 }, armR: { a: 160, b: 0 }, legL: { a: 60, b: -90 }, legR: { a: 20, b: -70 } } : runPose(x, t * 0.8, 880, 1)} t={t} faces={[[0, 'shock']]} shadow={1} />
      <PoliceDog x={Math.min(x - 260, 1380)} y={880} s={0.85} t={t} harness={false} fur="#6A5A4A" run={1} />
      <PopWord t={t} at={6} x={x - 200} y={560} text="WOOF WOOF" size={70} fill="#FFFFFF" hold={40} />
    </g>
  );
};

export const S14 = clockCard({ clock: '12:00 PM', kicker: 'RULE THREE', Bg: DAY });

// ---------------------------------------------------------------- S15: six hot dogs from the cart
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(6, Math.floor(t / 10) + 1);
  const me = standAt(1080, 1);
  return (
    <g transform={camT(960, 620, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <ShopStreet t={t + 200} />
      <HotDogCart x={760} y={GROUND} t={t} />
      <Body look={VENDOR} pose={standAt(620, 1, GROUND - 20, { yaw: 0.5 })} t={t} faces={[[0, 'happy'], [40, 'shock']]} seed={6} shadow={1} />
      <Body look={YOU_NOHOOD} pose={{ ...me, yaw: -0.5, armR: { a: 110 + Math.sin(t / 3) * 10, b: -110 } }} t={t} faces={[[0, 'happy']]} shadow={1} />
      {Array.from({ length: n }).map((_, i) => <HotDog key={i} x={1200 + (i % 3) * 100} y={500 - Math.floor(i / 3) * 50} s={0.45} />)}
      <text x={1260} y={420} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">{`x${n}`}</text>
    </g>
  );
};

// ---------------------------------------------------------------- S16: in the game, the health bar fills right back up
export const S16: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#14102A" />
    <text x={960} y={260} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#4AD06A">IN THE GAME</text>
    <HotDog x={960} y={430} s={2.2} rot={-6} bite={clamp(t / 20)} />
    <g transform="translate(560 640) scale(1.9)">
      <HealthBar x={0} y={0} p={0.18 + 0.82 * easeOut(clamp((t - 8) / 20))} />
    </g>
    <g opacity={clamp((t - 30) / 6)}>
      <Big x={960} y={900} size={90} fill="#7FE07A">+100% HEALTH</Big>
    </g>
  </g>
);

export const S17 = factCard({ value: 1800, label: 'CALORIES IN SIX HOT DOGS WITH BUNS', sub: 'and not one scrape healed', format: (v) => Math.round(v).toLocaleString('en-US') });

// ---------------------------------------------------------------- S18: your stomach is very upset with you
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const p = sitPose(300, 690, 1, 0.2, { tilt: 14, armL: { a: -20, b: 60 }, armR: { a: -10, b: 60 }, headTilt: -8 });
  return (
    <g transform={camT(330, 560, kf(t, [[0, 2.2], [len, 2.4]]))}>
      <Park t={t + 220} />
      <Body look={{ ...YOU_NOHOOD, skin: '#3E5A3A', skinShade: '#334A30', hand: '#3E5A3A' }} pose={p} t={t} faces={[[0, 'dizzy']]} />
      <PopWord t={t} at={10} x={520} y={420} text="GURGLE" size={70} fill="#9AE07A" hold={60} rot={8} />
    </g>
  );
};

// ---------------------------------------------------------------- S19: 12:30, you walk into the clothing store
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 0], [len, 900]], (k) => k);
  return (
    <g transform={camT(800, 600, 1.2)}>
      <Store t={t} />
      <Curtain open={0} />
      <Body look={GUARD} pose={standAt(1180, 1, GROUND, { yaw: -0.4, armL: { a: 50, b: -110 }, armR: { a: 50, b: -110 } })} t={t} faces={[[0, 'neutral']]} seed={10} shadow={1} />
      <Body look={YOU_NOHOOD} pose={{ ...runPose(x, t * 0.35, GROUND, 1), tilt: 4, legL: { a: 25 * Math.sin(t * 0.35), b: -20 }, legR: { a: -25 * Math.sin(t * 0.35), b: -20 } }} t={t} faces={[[0, 'smug']]} shadow={1} />
      <text x={200} y={200} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={clamp(t / 6)}>12:30 PM</text>
    </g>
  );
};

// ---------------------------------------------------------------- S20: seven outfits in five minutes
const OUTFITS = [YOU_TRACK, YOU_SUIT, { ...YOU_NOHOOD, jacket: '#E89AAE', jacketShade: '#C87E92' }, YOU_TRACK, { ...YOU_NOHOOD, jacket: '#F2D02A', jacketShade: '#C8A82A' }, YOU_SUIT, YOU_NOHOOD];
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const per = Math.max(10, Math.floor(len / 7));
  const i = Math.min(6, Math.floor(t / per));
  const k = (t % per) / per;
  const open = k < 0.2 ? k / 0.2 : k > 0.85 ? (1 - k) / 0.15 : 1;
  const look = OUTFITS[i];
  const big = look === YOU_SUIT;
  return (
    <g transform={camT(1500, 560, 1.6)}>
      <Store t={t + 40} />
      <Body look={look} pose={standAt(1550, big ? 1.12 : 1, GROUND, { yaw: 0, armL: { a: big ? 40 : 30, b: -10 }, armR: { a: big ? 40 : 30, b: -10 }, squash: big ? -0.05 : 0 })} t={t} faces={[[0, 'cool']]} shadow={1} />
      {i === 2 || i === 6 ? <Sombrero x={1550} y={hipAt(1) - 230} s={0.9} /> : null}
      <Curtain open={open} />
      <text x={1180} y={200} fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">{`OUTFIT ${i + 1}/7`}</text>
    </g>
  );
};

// ---------------------------------------------------------------- S21: the guard watches every change
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.15}>
      <g transform={camT(1200, 500, 1.6)}>
        <Store t={t + 60} />
      </g>
    </Soft>
    <g transform={camT(960, 500, kf(t, [[0, 2.9], [len, 3.1]]))}>
      <Body look={GUARD} pose={{ ...basePose, x: 960, y: 700, yaw: 0.4, look: Math.sin(t / 8) * 0.3 + 0.5, armL: { a: 50, b: -110 }, armR: { a: 50, b: -110 } }} t={t} faces={[[0, 'neutral'], [20, 'smug']]} seed={10} />
    </g>
  </g>
);

// ---------------------------------------------------------------- S22: you leave in your own clothes, minus the hoodie
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 900], [len, 1900]], (k) => k);
  return (
    <g transform={camT(960, 640, 1.3)}>
      <ShopStreet t={t + 240} shops={[{ name: 'FLOWERS', wall: '#7A5A8A', awning: '#E89AAE' }, { name: 'CLOTHES', wall: '#2E6A8A', awning: '#F2D02A' }, { name: 'BAKERY', wall: '#B8744A', awning: '#F2D06A' }, { name: 'BOOKS', wall: '#6A5A4A', awning: '#E8453A' }, { name: 'CAFE', wall: '#5A6A8A', awning: '#F6EFE3' }, { name: 'SHOES', wall: '#8A4A4A', awning: '#3A8AC8' }]} />
      <Body look={YOU_NOHOOD} pose={{ ...runPose(x, t * 0.35, GROUND, 1), tilt: 4, legL: { a: 25 * Math.sin(t * 0.35), b: -20 }, legR: { a: -25 * Math.sin(t * 0.35), b: -20 } }} t={t} faces={[[0, 'neutral']]} shadow={1} />
      <PopWord t={t} at={14} x={1300} y={320} text="MINUS THE HOODIE" size={70} fill="#FFFFFF" hold={60} />
    </g>
  );
};

// ---------------------------------------------------------------- S23: Mo is filming, and posting
export const S23 = phoneShot({ Bg: DAY, screen: (t) => <VideoPost t={t} views={120 + t * 40} /> });

// ---------------------------------------------------------------- S24: that's the part you forgot about
export const S24: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.25}>
      <g transform={camT(960, 560, 1.6)}>
        <ShopStreet t={t + 260} />
      </g>
    </Soft>
    <g transform={camT(960, 500, kf(t, [[0, 3.0], [len, 3.4]]))}>
      <Body look={YOU_NOHOOD} pose={{ ...basePose, x: 960, y: 700, yaw: 0.2, look: -0.4 }} t={t} faces={[[0, 'happy'], [Math.round(len * 0.45), 'worried']]} />
    </g>
  </g>
);

