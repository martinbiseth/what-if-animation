import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, FONT, MONEY, Schematic, SCH, Suburb, SUBURB, suburbHip, shake, LEG_LEN, Glow, lerp, rnd,
} from '../../../engine';
import words from './words.json';
import timeline from './timeline.json';
import {
  Hill, hillY, Hydrant, Trolley, GasGrill, Fireball, Bridge, BRIDGE, bridgeHip, Splash, RescueBoat, CarPark, CP, cpTop, BoxPile, CarParkRoof, DownView, Ambulance,
} from '../kit';
import {
  YOU, MO, NURSE, MOSDAD, respawn, billPhone, billCU, faceCU, talkShot, bigWord, people, tumble, HospSet, StreetSet, HillSet, BridgeSet, CarParkSet, RoofSet,
  cueIn, phoneCU, billCard, HHIP, HeldPhone, span,
} from '../common';

// Chapter 3, the fun part: Mo's list of "Stunts Only You Can Do". The trolley down Hill Street into the hydrant, the
// leaking barbecue, the bridge. The clips go viral; the hospital gets used to you; then Mo points at the car park:
// ten floors and a pile of cardboard boxes. You climb up, look at the bill, and jump.

const W = words as { w: string; s: number; e: number; p: string }[];
const TL = timeline as { segments: { shot: string; a: number; t0: number }[] };
const cue = (shot: string, w: string, nth = 1, d = 10) => cueIn(TL, W, shot, w, nth, d);
const DAY = StreetSet('day');
const HOSP = HospSet();
const HILL = HillSet(0);
const ROOF = RoofSet();
const SLOPE = (Math.atan2(520, 2300) * 180) / Math.PI;

// ---------- S1: chapter card ----------
export const S1 = billCard({ kicker: 'CHAPTER 3', title: 'THE STUNTS', tod: 'day' });

// ---------- S2: Mo at your door with a camera and a list ----------
const ListPaper: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-40} y={-56} width={80} height={112} fill="#FBF8F0" stroke="#100E16" strokeWidth={4} />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-28} y={-40 + i * 18} width={56} height={5} fill="#5A5666" />)}
  </g>
);
export const S2 = talkShot({
  Set: DAY, words: W,
  cast: [
    { look: MO, x: 820, y: suburbHip(1), yaw: 0.5, faces: [[0, 'happy']], pose: { armR: { a: 80, b: -60 } } },
    { look: YOU, x: 1180, y: suburbHip(1), yaw: -0.5, faces: [[0, 'smug']] },
  ],
  cam: { from: [1000, 560, 1.6], to: [1000, 560, 1.72] },
  front: () => <ListPaper x={905} y={suburbHip(1) - 40} rot={-10} />,
});

// ---------- S3: the list ----------
export const S3: React.FC<ShotProps> = ({ t }) => {
  const items = ['1. TROLLEY + HILL ST', '2. THE OLD BARBECUE', '3. THE BRIDGE', '4. ???'];
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2438" />
      <g transform={`translate(960 560) rotate(-3) scale(${kf(t, [[0, 1], [90, 1.06]])})`}>
        <rect x={-430} y={-470} width={860} height={940} fill="#FBF8F0" stroke="#CFC8B8" strokeWidth={4} />
        {Array.from({ length: 14 }).map((_, i) => <rect key={i} x={-430} y={-330 + i * 60} width={860} height={2} fill="#A8C8E8" />)}
        <text x={0} y={-370} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#1D2033">STUNTS ONLY YOU</text>
        <text x={0} y={-300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill="#D82E2E">CAN DO</text>
        {items.map((it, i) => (
          <text key={i} x={-360} y={-160 + i * 120} fontFamily={FONT.title} fontWeight={700} fontSize={56} fill="#2A2830" opacity={clamp((t - 6 - i * 6) / 4)}>{it}</text>
        ))}
      </g>
    </g>
  );
};

// ---------- S4: the trolley, down Hill Street, you inside, no brakes ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 0], [len, 1400]], (k) => k * k);
  const g = hillY(x);
  return (
    <g transform={camT(x + 260, g - 160, 1.35)}>
      <Hill t={t} />
      <g transform={`rotate(${SLOPE} ${x} ${g})`}>
        <Hero look={YOU} pose={{ ...basePose, x: x + 10, y: g - 230, yaw: 0.6, expr: t < len * 0.6 ? 'happy' : 'shock', armL: { a: 150, b: -10 }, armR: { a: 160, b: -10 } }} />
        <Trolley x={x} y={g} spin={t * 30} />
      </g>
      {[0, 1, 2].map((i) => <path key={i} d={`M ${x - 220 - i * 40} ${g - 180 + i * 50} l -140 -30`} stroke="#F6EFE3" strokeWidth={6} opacity={0.6} />)}
    </g>
  );
};

// ---------- S5: the hydrant: crash ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 8);
  const x = lerp(1450, 1720, k);
  const fly = clamp((t - 8) / 16);
  const sh = shake(t, 8, 12, 24);
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(1780, hillY(1780) - 220, 1.6)}`}>
      <Hill t={t + 40} spray={fly > 0 ? Math.min(1, fly * 2) : 0} />
      {fly <= 0 ? <Hydrant x={1780} y={hillY(1780) + 10} /> : null}
      <Trolley x={x} y={hillY(x)} rot={SLOPE + fly * 40} spin={t * 30} />
      <Hero look={YOU} pose={fly > 0 ? tumble(1780 + fly * 300, hillY(1780) - 250 - Math.sin(fly * Math.PI) * 300, fly * 400) : { ...basePose, x: x + 10, y: hillY(x) - 230, yaw: 0.6, expr: 'shock', armL: { a: 150, b: -10 }, armR: { a: 160, b: -10 } }} />
    </g>
  );
};

// ---------- S6: grey: lying in the spray ----------
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(1900, hillY(1900) - 120, 1.7)}>
    <Hill t={t + 60} spray={1} />
    <Hero look={YOU} pose={tumble(2000, hillY(2000) - 50, 90, { expr: 'dizzy', blink: 1 })} />
  </g>
);

// ---------- S7: the doors ----------
export const S7 = respawn({ appear: 2, faces: [[0, 'oops'], [16, 'happy']] });

// ---------- S8: emergency room again, and one fire hydrant ----------
export const S8 = billCU({
  lines: [
    { label: 'Emergency room', v: 2909, at: 2 },
    { label: 'One fire hydrant', v: 10000, at: cue('S8', 'fire', 1, 50), hot: true },
  ],
});

// ---------- S9: forty feet of water, Mo filming ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1500, 420, kf(t, [[0, 0.95], [len, 1.05]]))}>
    <Hill t={t + 100} spray={1} />
    {people(t, [{ look: MO, pose: { x: 1250, y: hillY(1250) - LEG_LEN, yaw: 0.6, armR: { a: 70, b: -110 }, expr: 'happy' }, held: 'record' }])}
  </g>
);

// ---------- S10: Mo reads the bill out loud like a football score ----------
export const S10 = faceCU({ look: MO, Bg: HILL, faces: [[0, 'happy']], yaw: 0.3, zoom: [3.0, 3.2], talk: span(W, 'reads', 'score'), words: W, pose: { armR: { a: 150, b: -20 } } });

// ---------- S11: the old gas barbecue ----------
const Patio: React.FC<{ t: number; boom?: number; leak?: number; crater?: boolean }> = ({ t, boom = 0, leak = 0, crater = false }) => (
  <g>
    <Suburb t={t} id="pt" tod="day" cars={false} />
    <rect x={-400} y={SUBURB.feet - 10} width={2800} height={600} fill="#B8B0A0" />
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${-400 + i * 220} ${SUBURB.feet} L ${-500 + i * 240} 1500`} stroke="#A8A090" strokeWidth={4} />)}
    {crater ? <ellipse cx={1100} cy={SUBURB.feet + 40} rx={220} ry={50} fill="#2A2420" /> : <GasGrill x={1100} y={SUBURB.feet + 30} t={t} boom={boom} leak={leak} />}
    {crater ? [0, 1, 2].map((i) => {
      const k = ((t * 0.6 + i * 25) % 70) / 70;
      return <circle key={i} cx={1100 + Math.sin(t / 9 + i) * 30} cy={SUBURB.feet - k * 300} r={40 + k * 60} fill="#6A6468" opacity={0.5 * (1 - k)} />;
    }) : null}
  </g>
);
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1000, 560, kf(t, [[0, 1.3], [len, 1.42]]))}>
    <Patio t={t} />
    {people(t, [
      { look: YOU, pose: { x: 760, y: suburbHip(1), yaw: 0.5 }, faces: [[0, 'smug']] },
      { look: MO, pose: { x: 1420, y: suburbHip(1), yaw: -0.5, armR: { a: 70, b: -110 } }, faces: [[0, 'worried']], held: 'record' },
    ])}
  </g>
);

// ---------- S12: it has a leak ----------
export const S12: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(1060, SUBURB.feet - 150, 2.8)}>
    <Patio t={t + 30} leak={1} />
  </g>
);

// ---------- S13: you click the lighter anyway ----------
export const S13 = faceCU({
  look: YOU, Bg: StreetSet('day'), faces: [[0, 'smug']], yaw: 0.35, zoom: [2.8, 3.0], pose: { armR: { a: 120, b: -90 } },
  extra: (t) => (
    <g transform="translate(1050 470)">
      <rect x={-14} y={-50} width={28} height={70} rx={6} fill="#E8504A" stroke="#100E16" strokeWidth={4} />
      {t > 10 ? <path d="M 0 -56 q -12 -20 0 -40 q 12 20 0 40" fill="#FFB43A" /> : null}
    </g>
  ),
});

// ---------- S14: boom ----------
export const S14: React.FC<ShotProps> = ({ t }) => {
  const sh = shake(t, 2, 16, 34);
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(1080, 560, 1.25)}`}>
      <Patio t={t + 60} boom={clamp(t / 30)} />
      {t > 6 ? <Hero look={YOU} pose={tumble(760 - t * 12, suburbHip(1) - 80 - t * 6, -t * 14)} /> : null}
    </g>
  );
};

// ---------- S15: the doors: soot and no eyebrows ----------
export const S15 = respawn({ appear: 2, faces: [[0, 'dizzy'], [18, 'oops']], front: (t) => (t > 4 ? <circle cx={1440} cy={HHIP - 230} r={46} fill="#2A2420" opacity={0.35} /> : null) });

// ---------- S16: burn unit, fire engine, eyebrows ----------
export const S16 = billCU({
  lines: [
    { label: 'Burn unit', v: 16800, at: 2, hot: true },
    { label: 'Fire engine call-out', v: 2300, at: cue('S16', 'fire', 1, 20) },
    { label: 'Two new eyebrows', v: 2900, at: cue('S16', 'two', 1, 40) },
  ],
  total: 22000, totalAt: cue('S16', 'Twenty', 1, 60),
});

// ---------- S17: Mo's dad, the crater, and back inside ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const back = clamp((t - len * 0.55) / 20);
  return (
    <g transform={camT(1000, 560, 1.35)}>
      <Patio t={t + 90} crater />
      {people(t, [{ look: MOSDAD, pose: { x: 1500 + back * 400, y: suburbHip(1), yaw: back > 0 ? 0.8 : -0.4, armL: { a: 20, b: -10 }, armR: { a: 40, b: -120 } }, faces: [[0, 'shock'], [30, 'tired']] }])}
    </g>
  );
};

// ---------- S18: the bridge: you on the railing ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1050, 330, kf(t, [[0, 1.35], [len, 1.45]]))}>
    <Bridge t={t} />
    {people(t, [
      { look: YOU, pose: { x: 1150, y: BRIDGE.deck - 110 - LEG_LEN, yaw: 0.3, armL: { a: 140, b: -10 }, armR: { a: 140, b: -10 } }, faces: [[0, 'happy']] },
      { look: MO, pose: { x: 820, y: bridgeHip(1), yaw: 0.5, armR: { a: 70, b: -110 } }, faces: [[0, 'happy']], held: 'record' },
    ])}
  </g>
);

// ---------- S19: thirty feet down, into the cold brown river ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 26);
  return (
    <g transform={camT(1160, 700, 0.95)}>
      <Bridge t={t + 30} splash={clamp((t - 26) / 24)} />
      {k < 1 ? <Hero look={YOU} pose={tumble(1160, lerp(BRIDGE.deck - 250, BRIDGE.water - 200, k * k), k * 30, { expr: 'shock', armL: { a: 170, b: 0 }, armR: { a: 170, b: 0 }, legL: { a: 4, b: 0 }, legR: { a: -4, b: 0 } })} /> : null}
    </g>
  );
};

// ---------- S20: the rescue boat ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1300, 700, 1.25)}>
    <Bridge t={t + 60} boat={clamp(t / Math.max(len, 1))} />
    <circle cx={1180} cy={BRIDGE.water - 160} r={34} fill="#26232F" />
  </g>
);

// ---------- S21: eighteen thousand ----------
export const S21 = billPhone({ v: 18000, time: '3:40', label: 'City General: water rescue' });

// ---------- S22: Mo uploads: the kid who can't get hurt ----------
const VideoCard: React.FC<{ t: number; views: number }> = ({ t, views }) => (
  <g>
    <rect width={1920} height={1080} fill="#18141F" />
    <g transform={`translate(960 520) scale(${kf(t, [[0, 0.96], [90, 1.04]])}) translate(-960 -520)`}>
      <rect x={360} y={140} width={1200} height={676} rx={18} fill="#0A0A10" />
      <g transform="translate(360 140) scale(0.625)">
        <Hill t={t + 120} spray={1} />
      </g>
      <circle cx={960} cy={478} r={70} fill="#000" opacity={0.55} />
      <path d="M 936 440 L 1000 478 L 936 516 Z" fill="#FFFFFF" />
      <rect x={360} y={800} width={1200 * clamp(t / 80)} height={10} fill="#E83A3A" />
      <text x={360} y={890} fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F6EFE3">THE KID WHO CAN'T GET HURT (100% REAL)</text>
      <text x={360} y={950} fontFamily={FONT.ui} fontSize={36} fill="#A8A2B8">{Math.round(views).toLocaleString('en-US')} views</text>
    </g>
  </g>
);
export const S22: React.FC<ShotProps> = ({ t }) => <VideoCard t={t} views={kf(t, [[0, 214], [60, 18400]])} />;

// ---------- S23: two million views ----------
export const S23: React.FC<ShotProps> = ({ t }) => <VideoCard t={t + 60} views={kf(t, [[0, 18400], [30, 2000000]])} />;

// ---------- S24: comments from everywhere ----------
const COMMENTS = ['how is this real??', 'Brazil 🇧🇷 watching', 'fake. obviously fake', 'Japan here, explain', 'my mum says call a doctor', 'the hydrant 😭', 'HOW', 'part 2 when'];
export const S24: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="cm" />
    {COMMENTS.map((c, i) => {
      const p = backOut(clamp((t - i * 5) / 8));
      const x = 260 + (i % 2) * 760 + rnd(4, i) * 120;
      const y = 200 + Math.floor(i / 2) * 200;
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${p})`} opacity={clamp((t - i * 5) / 4)}>
          <rect x={0} y={-56} width={c.length * 26 + 110} height={92} rx={46} fill="#26223A" stroke={SCH.line} strokeWidth={3} />
          <circle cx={44} cy={-10} r={26} fill={['#E8504A', '#4AA8C8', '#E8C04A', '#6AB86A'][i % 4]} />
          <text x={88} y={2} fontFamily={FONT.ui} fontSize={38} fill="#F6EFE3">{c}</text>
        </g>
      );
    })}
  </g>
);

// ---------- S25: a nurse asks for a selfie ----------
export const S25 = talkShot({
  Set: HOSP, words: W,
  cast: [
    { look: NURSE, x: 1240, y: HHIP, yaw: 0.2, faces: [[0, 'happy']], pose: { armR: { a: 150, b: -40 } } },
    { look: YOU, x: 1440, y: HHIP, yaw: -0.2, faces: [[0, 'cool']] },
  ],
  cam: { from: [1340, 540, 1.9], to: [1340, 540, 2.0] },
  front: (t) => (t > 20 && t < 26 ? <rect x={-400} y={-400} width={2800} height={1900} fill="#FFFFFF" opacity={1 - (t - 20) / 6} /> : null),
});

// ---------- S26: the ambulance parks outside your house, just in case ----------
export const S26: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.1], [len, 1.18]]))}>
    <Suburb t={t} id="amb" tod="day" cars={false} />
    <Ambulance x={kf(t, [[0, 2500], [30, 1100]])} y={SUBURB.kerb + 60} s={0.8} t={t} lights={1} spin={t * 20} />
  </g>
);

// ---------- S27: Mo points at the car park: ten floors ----------
export const S27: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 700], [len, 380]]), 0.8)}>
    <CarPark t={t} />
    {people(t, [
      { look: MO, pose: { x: 300, y: CP.feet - LEG_LEN, yaw: 0.5, armR: { a: 150, b: 0 }, handR: 'point' }, faces: [[0, 'smug']] },
      { look: YOU, pose: { x: 140, y: CP.feet - LEG_LEN, yaw: 0.5, headTilt: -20 }, faces: [[0, 'shock']] },
    ])}
  </g>
);

// ---------- S28: the boxes, like the ones in the games ----------
export const S28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1260, CP.feet - 140, kf(t, [[0, 2.4], [len, 2.6]]))}>
    <CarPark t={t + 50} />
  </g>
);

// ---------- S29: "Final stunt. Then we're famous." ----------
export const S29 = faceCU({ look: MO, Bg: CarParkSet(), faces: [[0, 'smug']], yaw: -0.3, zoom: [3.0, 3.2], words: W, talk: span(W, 'Final', 'famous') });

// ---------- S30: the top deck: wind ----------
export const S30: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <CarParkRoof t={t} />
    {people(t, [{ look: YOU, pose: { x: 960, y: 830 - LEG_LEN, yaw: 0.2, sway: Math.sin(t / 5) * 20, headTilt: Math.sin(t / 9) * 4 }, faces: [[0, 'neutral']] }])}
  </g>
);

// ---------- S31: down below, Mo is a tiny dot ----------
export const S31: React.FC<ShotProps> = ({ t }) => <DownView t={t} />;

// ---------- S32: the phone: one hundred and sixteen thousand ----------
export const S32 = phoneCU({ mode: 'bank', Bg: ROOF, time: '6:12', text: '-$116,229|City General: amount due', push: 0.1 });

// ---------- S33: it's just a number ----------
export const S33 = faceCU({ look: YOU, Bg: ROOF, faces: [[0, 'worried'], [30, 'smug']], yaw: 0.25, zoom: [3.0, 3.25] });

// ---------- S34: you jump ----------
export const S34: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 6) / 20);
  return (
    <g transform={camT(960, 560, 1.15)}>
      <CarParkRoof t={t + 60} />
      <rect x={-400} y={800} width={2800} height={60} fill="#B8B4AC" />
      <Hero look={YOU} pose={{ ...basePose, x: 960, y: 830 - LEG_LEN - k * 200 + Math.max(0, k - 0.5) * 900, yaw: 0, scale: 1 - k * 0.3, expr: 'happy', armL: { a: 160, b: 0 }, armR: { a: 160, b: 0 } }} />
    </g>
  );
};
