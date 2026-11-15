import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, faceAt, Glow, FONT, walkPose, LEG_LEN } from '../../../engine';
import { YOU, ELLIE, TULLIA, FELIX, OFFICIAL, BOY, CITIZENS, faceCU, wordF, span } from '../common';
import { RomeStreet, ShopInside, ShopCounter, CircusMaximus, CrowdFront, WaxTablet, HairTie, HoneyCake, Grill, Smoke, romeHip, SHOP, P0 } from '../sets';
import { street, shop, onStreet, atCounter, insert, streetSet, shopSet, realCard, walker, Chip } from '../kit';
import words from './words.json';

// Chapter 6, the choice: Ellie doesn't come back from the market; Felix and Tullia search; a boy puts down Ellie's
// coral hair tie and the unsigned contract; sign and she comes home, don't and you may never see her again; the cost
// (Tullia's shop, every cook on the street, an empire that turns hungry crowds into loyal ones); every time-travel
// movie; Tullia: "Family first. Shops can be rebuilt." You sign. Ellie walks back in with a honey cake; the hug; the
// palace orders two hundred burgers, cooked here, all night; a hot dry wind; the date: the eighteenth of July.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const DUSK = streetSet({ mode: 'dusk' });
const NIGHT = streetSet({ mode: 'night' });
const BUSY = shopSet({});
const NSHOP = shopSet({ night: true });

// ---------- S1: two days later: the market at dusk; you call for Ellie ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 540, 1.3)}>
    <RomeStreet t={t + 50} mode="dusk" />
    <Hero look={YOU} pose={{ ...basePose, x: 1000, y: romeHip(1), yaw: Math.sin(t / 12) * 0.7, look: Math.sin(t / 12), expr: 'worried', talk: Math.max(0, Math.sin(t / 4)) * 0.7, blink: idleBlink(t, 2) }} />
    <Chip t={t - 2} text="TWO DAYS LATER" x={480} y={110} />
  </g>
);

// ---------- S2: Felix runs every street around the Circus ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, 1.3)}>
    <RomeStreet t={t + 120} mode="dusk" shop={false} />
    {walker(FELIX, 1800, 100, len * 0.8, t * 1.5, romeHip(0.92), 0.92, { expr: 'worried', tilt: -12 })}
  </g>
);

// ---------- S3: Tullia asks every shopkeeper; nobody saw anything ----------
export const S3 = street({
  mode: 'dusk', shop: false,
  cast: [onStreet(TULLIA, 860, { yaw: 0.5, faces: [[0, 'worried']], pose: { armR: { a: 60, b: -60 } } }), onStreet(CITIZENS[0], 1080, { yaw: -0.5, faces: [[0, 'neutral'], [40, 'worried']], pose: { headTilt: 10 } })],
  cam: { from: [970, 520, 1.6], to: [970, 520, 1.7] },
});

// ---------- S4: a boy you've never seen walks up to the counter ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(800, 560, 1.3)}>
    <RomeStreet t={t + 160} mode="dusk" />
    {walker(BOY, 1500, 880, len * 0.8, t, romeHip(0.75), 0.75, { expr: 'neutral' })}
  </g>
);

// ---------- S5: he puts down a little coral hair tie: Ellie's ----------
export const S5 = insert({
  Bg: BUSY, zoom: [2.2, 2.4], cy: 600, dim: 0.25,
  draw: (t) => {
    const k = easeOut(clamp(t / 12));
    return (
      <g>
        <rect x={300} y={620} width={1320} height={400} fill="#EDE6DA" />
        <rect x={300} y={610} width={1320} height={20} fill="#F6F0E6" />
        <g transform={`translate(0 ${-80 * (1 - k)})`}><HairTie x={960} y={640} s={1.8} /></g>
        <path d={`M ${1100 + 60 * k} ${520 - 60 * k} L 1400 300`} stroke={P0} strokeWidth={30} strokeLinecap="round" opacity={1 - k} />
      </g>
    );
  },
});

// ---------- S6: next to it, the wax tablet: the contract, unsigned ----------
export const S6 = insert({
  Bg: BUSY, zoom: [1.7, 1.8], cy: 600, dim: 0.3,
  draw: (t) => (
    <g>
      <rect x={200} y={620} width={1520} height={400} fill="#EDE6DA" />
      <HairTie x={700} y={700} s={1.2} />
      <WaxTablet x={1100} y={660} s={1.3} />
      <g opacity={clamp((t - (at('Unsigned') - at('Next'))) / 6)} transform={`translate(1100 880) rotate(-6)`}>
        <rect x={-200} y={-46} width={400} height={80} rx={10} fill="none" stroke="#FF4A3A" strokeWidth={6} />
        <text y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#FF4A3A">UNSIGNED</text>
      </g>
    </g>
  ),
});

// ---------- S7: you know what it means ----------
export const S7 = faceCU({ look: YOU, Bg: DUSK, faces: [[0, 'shock']], yaw: 0.1, zoom: [3.4, 3.6], dark: 0.2 });

// ---------- S8: sign, and Ellie comes home tonight. Don't sign, and... ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const d = at("Don't") - at('Sign');
  return (
    <g>
      <rect width={1920} height={1080} fill="#0C0A16" />
      <rect x={0} y={0} width={960} height={1080} fill="#1E3A2E" opacity={clamp(t / 6)} />
      <rect x={960} y={0} width={960} height={1080} fill="#3A1418" opacity={clamp((t - d) / 6)} />
      <g opacity={clamp(t / 6)}>
        <text x={480} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#6AE08A" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">SIGN</text>
        <Hero look={ELLIE} pose={{ ...basePose, x: 480, y: 700, scale: 1.2, yaw: 0, expr: 'happy', blink: idleBlink(t, 2) }} shadow={0} />
      </g>
      <g opacity={clamp((t - d) / 6)}>
        <text x={1440} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FF4A3A" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">{"DON'T"}</text>
        <text x={1440} y={720} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={300} fill="#5A2A2E">?</text>
      </g>
    </g>
  );
};

// ---------- S9: but Tullia loses the shop her husband built ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 500, kf(t, [[0, 1.5], [len, 1.6]]))}>
    <ShopInside t={t + 200} grill={0.3} />
    <Hero look={TULLIA} pose={{ ...basePose, x: 960, y: SHOP.hip + 10, yaw: 0.1, tilt: 6, look: -0.3, expr: 'worried', armR: { a: 30, b: -70 }, blink: idleBlink(t, 3) }} />
    <ShopCounter />
  </g>
);

// ---------- S10: every cook on this street loses everything ----------
export const S10 = street({
  mode: 'dusk', shop: false,
  cast: [0, 1, 2, 3].map((k) => onStreet(CITIZENS[k + 1], 700 + k * 190, { yaw: k % 2 ? -0.2 : 0.2, faces: [[0, 'worried']], seed: k + 2 }, 0.92)),
  cam: { from: [980, 520, 1.4], to: [980, 520, 1.5] },
});

// ---------- S11: the most powerful men in Rome get a machine that turns hungry crowds into loyal ones ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [len, 1180]]), kf(t, [[0, 420], [len, 290]]), kf(t, [[0, 0.95], [len, 1.8]]))}>
      <CircusMaximus t={t + 300} cheer={1.2} mode="dusk" />
    </g>
    <rect width={1920} height={1080} fill="#3A0A30" opacity={0.25} />
  </g>
);

// ---------- S12: maybe you just taught an empire a new way to control people ----------
export const S12 = faceCU({ look: YOU, Bg: NSHOP, faces: [[0, 'worried']], yaw: -0.2, eyes: -0.5, zoom: [3.2, 3.5], dark: 0.3 });

// ---------- S13: every time-travel movie: don't change history, don't help the bad guys ----------
export const S13 = realCard({ kicker: 'EVERY TIME-TRAVEL MOVIE', big: ["DON'T CHANGE HISTORY", "DON'T HELP THE BAD GUYS"], real: false });

// ---------- S14: easy to say, when it isn't your sister: the hair tie in your hand ----------
export const S14 = faceCU({
  look: YOU, Bg: NSHOP, faces: [[0, 'worried']], yaw: 0.2, eyes: 0.6, zoom: [2.6, 2.7], pose: { armR: { a: 120, b: -110 } }, dark: 0.3,
  extra: () => <HairTie x={1010} y={560} s={0.5} />,
});

// ---------- S15: Tullia puts a hand on your shoulder: "Family first. Shops can be rebuilt." ----------
export const S15 = shop({
  night: true, grill: 0.5,
  cast: [atCounter(YOU, 900, { yaw: 0.4, faces: [[0, 'worried']] }), atCounter(TULLIA, 1120, { yaw: -0.4, faces: [[0, 'neutral'], [60, 'happy']], talk: [span(W, "'Family", 'says', 1), span(W, "'Shops", "rebuilt")], pose: { armR: { a: 85, b: -10 } } })],
  words: W, cam: { from: [1000, 480, 2.0], to: [1010, 470, 2.15] },
});

// ---------- S16: so you sign ----------
export const S16 = insert({
  Bg: NSHOP, zoom: [2.2, 2.3], cy: 560, dim: 0.35,
  draw: (t) => (
    <g>
      <WaxTablet x={960} y={560} s={2} sign={clamp(t / 30)} />
      <path d={`M ${860 + 300 * clamp(t / 30)} ${640 - Math.sin(t) * 10} L ${1060 + 300 * clamp(t / 30)} 420`} stroke="#C8B08A" strokeWidth={14} strokeLinecap="round" />
    </g>
  ),
});

// ---------- S17: that evening, Ellie walks back in with another honey cake, completely fine ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const x = 1500 - 500 * clamp(t / (len * 0.7));
  const walking = t < len * 0.7;
  const el: Pose = walking ? walkPose(x, t * 0.6, romeHip(0.7) + LEG_LEN * 0.7, 0.7, { yaw: -0.8, expr: 'happy' }, -1) : { ...basePose, x, y: romeHip(0.7), scale: 0.7, yaw: -0.3, expr: 'happy', talk: Math.max(0, Math.sin(t / 3)) * 0.6, blink: idleBlink(t, 2) };
  return (
    <g transform={camT(900, 580, 1.3)}>
      <RomeStreet t={t + 300} mode="dusk" />
      <Hero look={YOU} pose={{ ...basePose, x: 760, y: romeHip(1), yaw: 0.5, expr: walking ? 'shock' : 'happy', blink: idleBlink(t, 1) }} />
      <Hero look={ELLIE} pose={el} />
      <HoneyCake x={x - 50} y={romeHip(0.7) - 6} s={0.4} />
    </g>
  );
};

// ---------- S18: you hug her so hard she complains ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 2.0], [len, 2.15]]))}>
    <RomeStreet t={t + 360} mode="dusk" />
    <Hero look={ELLIE} pose={{ ...basePose, x: 1010, y: romeHip(0.7) - 10, scale: 0.7, yaw: -0.2, expr: 'oops', blink: 0, armL: { a: 140, b: 0 }, armR: { a: 140, b: 0 } }} />
    <Hero look={YOU} pose={{ ...basePose, x: 920, y: romeHip(1) + 30, yaw: 0.5, tilt: 14, expr: 'happy', blink: 1, armR: { a: 80, b: -60 }, armL: { a: 80, b: -60 }, legL: { a: -30, b: 50 }, legR: { a: 20, b: 40 } }} />
  </g>
);

// ---------- S19: a messenger from the palace: a feast tonight, two hundred burgers ----------
export const S19 = shop({
  night: true, grill: 0.7,
  cast: [atCounter(YOU, 760, { yaw: 0.5, faces: [[0, 'neutral'], [80, 'shock']] }), atCounter(FELIX, 520, { yaw: 0.5, faces: [[0, 'worried']] }, 0.92)],
  cam: { from: [1000, 500, 1.4], to: [1040, 500, 1.55] },
  front: (t) => (
    <g>
      <Hero look={{ ...BOY, jacket: '#6A2C7A', jacketShade: '#521F60' }} pose={{ ...basePose, x: 1300, y: 780, scale: 1.7, yaw: -0.6, expr: 'neutral', armR: { a: 90, b: -20 }, blink: idleBlink(t, 3), talk: Math.max(0, Math.sin(t / 3)) * 0.4 }} shadow={0} />
      <g opacity={clamp((t - (at('hundred') - at('messenger') + 4)) / 6)}><Chip t={t - (at('hundred') - at('messenger') + 4)} text="200 BURGERS · TONIGHT" x={1100} y={160} /></g>
    </g>
  ),
});

// ---------- S20: cooked fresh, here, on your grill, all night ----------
export const S20 = insert({
  Bg: NSHOP, zoom: [1.6, 1.7], cy: 600, dim: 0.35,
  draw: (t) => (
    <g>
      <Grill x={960} y={640} s={1.8} t={t} n={4} flip={(Math.floor(t / 30) % 4)} />
      <Glow x={960} y={700} r={500} kind="red" o={0.5} />
      <Smoke x={900} y={520} t={t} o={1} h={500} dark />
    </g>
  ),
});

// ---------- S21: outside, a hot dry wind: awnings snap, dust blows down the street ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 800]]), 540, 1.2)}>
    <RomeStreet t={t + 400} mode="night" smoke={1.6} />
    {Array.from({ length: 24 }).map((_, k) => {
      const q = ((t * 2 + k * 31) % 120) / 120;
      return <path key={k} d={`M ${-200 + q * 2600} ${200 + ((k * 97) % 700)} l 60 -6`} stroke="#E8D8B8" strokeWidth={3} opacity={0.5 * Math.sin(q * Math.PI)} />;
    })}
    <Hero look={FELIX} pose={{ ...basePose, x: 980, y: romeHip(0.92), scale: 0.92, yaw: -0.4, tilt: -6, expr: 'worried', blink: idleBlink(t, 3) }} rimId="rimRed" />
    <Hero look={YOU} pose={{ ...basePose, x: 1140, y: romeHip(1), yaw: -0.5, tilt: -6, expr: 'worried', talk: t > len * 0.6 ? Math.max(0, Math.sin(t / 3)) * 0.5 : 0, blink: idleBlink(t, 1) }} rimId="rimRed" />
  </g>
);

// ---------- S22: Felix thinks for a moment: "The eighteenth of July." ----------
export const S22: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: FELIX, Bg: NIGHT, faces: [[0, 'neutral']], yaw: -0.3, zoom: [3.3, 3.6], words: W, talk: span(W, "'The", 'July'), light: { x: 960, y: 420, kind: 'warm', o: 0.5 } });
  const d = 12;
  return (
    <g>
      <F {...p} />
      <Chip t={p.t - d} text="18 JULY, AD 64" x={1220} y={180} color="#FF4A3A" />
    </g>
  );
};
