import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, easeIn, backOut, ShotProps, FONT, LEG_LEN, stand, walkPose, Schematic, SCH, SchLabel, CountUp, LOOKS, DizzyStars, Glow } from '../../../engine';
import {
  YOU, MO, ELLIE, NURSE, Body, Soft, faceCU, bigWord, wordF, HeadBar, overHead, flying, landed, arc, SpeedLines, Pow, Dmg, BAR, ruleCard, RespawnBlack,
  Gym, GYM, Ball, Ramp, Skateboard, TrashCan, Bike, StreetModern, STREETM, streetHip, HospitalRoom, inBed, Sheet, Pillow, PhoneFrame, LivingRoom, LIVING, sofaSit, WARD, lie,
} from '../common';
import { shk } from '../../gravity/common';
import words from './words.json';

// Chapter 3, stunt double: the basketball to the face, the bike off the loading ramp into a hedge, Mo filming, the
// skate-park overshoot and sled across the lot, Mo's tiny hop and his knee. Two million views; Ellie: again. Don't try
// this. The evening: one tiny trip on Mo's skateboard, the bar hits zero, black, a hospital bed, the nurse, the lights.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" car={false} />;
const DUSK: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="dusk" car={false} />;
const GY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Gym t={t} id={id} />;
const F = STREETM.feet;

/** A hedge: a row of round green bushes along the ground. */
const Hedge: React.FC<{ x0: number; x1: number; y: number; shake?: number; t?: number }> = ({ x0, x1, y, shake = 0, t = 0 }) => (
  <g>
    {Array.from({ length: Math.round((x1 - x0) / 90) }).map((_, i) => (
      <circle key={i} cx={x0 + i * 90 + Math.sin(t * 1.7 + i) * 6 * shake} cy={y - 70 - (i % 2) * 20} r={80} fill={i % 2 ? '#3E7A3A' : '#4A8A44'} stroke="#1E3A1A" strokeWidth={6} />
    ))}
  </g>
);

const leaves = (x: number, y: number, t: number) =>
  t < 0 || t > 30 ? null : (
    <g>
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        const d = t * (6 + (i % 3) * 3);
        return <ellipse key={i} cx={x + Math.cos(a) * d} cy={y + Math.sin(a) * d * 0.6 + t * t * 0.15} rx={14} ry={8} fill="#4A8A44" opacity={1 - t / 30} transform={`rotate(${i * 40 + t * 10} ${x + Math.cos(a) * d} ${y})`} />;
      })}
    </g>
  );

// ---------- S1: day one: STUNT DOUBLE ----------
export const S1 = bigWord({ kicker: 'FOR ONE WHOLE DAY', word: 'STUNT DOUBLE', color: '#FFD23A', Bg: GY, size: 180 });

// ---------- S2: gym: the basketball, full speed, into your face ----------
export const S2: React.FC<ShotProps> = ({ t, len, f }) => {
  const hit = Math.max(10, rel(f, t, 'face') - 2);
  const you = { ...basePose, ...stand(GYM, 0.55, 0.55), yaw: -0.2 };
  const head = { x: you.x, y: you.y - 176 * you.scale };
  const k = clamp(t / hit);
  const bx = t < hit ? 300 + (head.x - 300) * k : head.x - (t - hit) * 14;
  const by = t < hit ? 300 + (head.y - 300) * k : head.y - (t - hit) * 10 + (t - hit) * (t - hit) * 0.8;
  return (
    <g transform={`${shk(t, hit, 6, 10)} ${camT(kf(t, [[0, you.x - 200], [len, you.x - 120]]), you.y - 100, kf(t, [[0, 1.6], [len, 1.75]]))}`}>
      <GY t={t + 30} />
      <Body look={YOU} pose={{ ...you, tilt: t >= hit && t < hit + 10 ? 14 : 0 }} t={t} faces={[[0, 'neutral'], [hit - 4, 'oops'], [hit, 'dizzy']]} shadow={1} />
      <Ball x={bx} y={by} r={40 * you.scale} rot={t * 20} />
      {t < hit ? <SpeedLines x={bx} y={by} t={t} dir={1} len={160} o={0.5} /> : null}
      <Pow x={head.x + 120} y={head.y - 120} t={t - hit} text="BONK!" size={90} hold={18} />
      <HeadBar {...overHead(you)} p={1} t={t} />
    </g>
  );
};

// ---------- S3: the class gasps ----------
const CLASS = [
  { u: 0.2, w: 0.45, look: LOOKS.ellie }, { u: 0.3, w: 0.62, look: MO }, { u: 0.42, w: 0.4, look: LOOKS.mo26 }, { u: 0.62, w: 0.42, look: LOOKS.lady },
  { u: 0.74, w: 0.6, look: LOOKS.worker }, { u: 0.86, w: 0.45, look: LOOKS.you },
];
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.1], [len, 1.2]]))}>
    <GY t={t + 60} />
    {CLASS.map((c, i) => {
      const s = stand(GYM, c.u, c.w);
      const lk = c.look === LOOKS.you ? { ...LOOKS.you, jacket: '#4A6AC8', jacketShade: '#3A5AA8' } : c.look;
      return <Body key={i} look={lk} pose={{ ...basePose, ...s, scale: s.scale * 0.9, yaw: (0.55 - c.u) * 1.6, armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 }, tilt: -4 }} t={t} seed={i + 2} faces={[[0, 'shock']]} shadow={1} />;
    })}
    <Pow x={960} y={300} t={t - 6} text="GASP!" size={110} hold={60} color="#F6EFE3" rot={0} />
  </g>
);

// ---------- S4: the bar: a tiny sliver ----------
export const S4: React.FC<ShotProps> = ({ t }) => {
  const p = 1 - 0.02 * easeOut(clamp((t - 6) / 8));
  return (
    <g>
      <Soft blur={16} dim={0.45}>
        <GY t={t + 90} />
      </Soft>
      <HeadBar x={1000} y={540} s={3.2} p={p} t={t} hit={clamp(1 - Math.abs(t - 8) / 8)} />
      <Dmg x={1500} y={420} t={t - 6} text="-2" />
    </g>
  );
};

// ---------- S5: blink, catch the rebound, cool ----------
export const S5: React.FC<ShotProps> = ({ t, len, f }) => {
  const c = Math.max(6, rel(f, t, 'catch'));
  const you = { ...basePose, ...stand(GYM, 0.5, 0.55), yaw: 0.1 };
  const k = easeOut(clamp((t - c) / 6));
  const hands = { x: you.x, y: you.y - 120 * you.scale };
  const bx = t < c ? hands.x + 260 - (t / c) * 260 : hands.x;
  const by = t < c ? hands.y - 200 + Math.pow((t / c) * 2 - 1, 2) * 200 - 0 : hands.y;
  return (
    <g transform={camT(you.x, you.y - 120, kf(t, [[0, 2.2], [len, 2.35]]))}>
      <GY t={t + 120} />
      <Body look={YOU} pose={{ ...you, armL: { a: 20 + 70 * k, b: -40 * k }, armR: { a: 20 + 70 * k, b: -40 * k } }} t={t} faces={[[0, 'neutral'], [c, 'cool']]} shadow={1} />
      <Ball x={bx} y={by} r={40 * you.scale} rot={t * 10} />
      <HeadBar {...overHead(you)} p={0.98} t={t} />
    </g>
  );
};

// ---------- S6: after school: the bike, up the grocery store's loading ramp ----------
const RAMP = { x0: 520, x1: 1060, h: 230 };
const rampY = (x: number) => {
  const k = clamp((x - RAMP.x0) / (RAMP.x1 - RAMP.x0));
  return F + 20 - RAMP.h * Math.pow(k, 2.2);
};
const rider = (x: number, y: number, s: number, spin = 0, o: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y: y - 210 * s, scale: s, yaw: 0.7, spin, tilt: 18, legL: { a: 70, b: -80 }, legR: { a: 30, b: -70 }, armL: { a: 70, b: -10 }, armR: { a: 75, b: -10 }, ...o,
});
const Store: React.FC = () => (
  <g>
    <rect x={-400} y={300} width={2800} height={F - 300 + 20} fill="#8A7A6A" stroke="#2A1E18" strokeWidth={6} />
    <rect x={-400} y={300} width={2800} height={60} fill="#C8452A" />
    <text x={300} y={348} fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#F6EFE3">FRESH MART · DELIVERIES</text>
    <rect x={1300} y={480} width={420} height={F - 460} fill="#5A5048" stroke="#2A1E18" strokeWidth={6} />
    {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M 1300 ${500 + i * 44} L 1720 ${500 + i * 44}`} stroke="#3A3430" strokeWidth={4} />)}
    <rect x={-400} y={F + 20} width={2800} height={400} fill="#4A4A52" />
  </g>
);
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 0], [len, RAMP.x1 - 40]]);
  const y = Math.min(F + 20, rampY(x));
  const rot = x > RAMP.x0 ? -30 * clamp((x - RAMP.x0) / (RAMP.x1 - RAMP.x0)) : 0;
  return (
    <g transform={camT(kf(t, [[0, 600], [len, 900]]), 600, 1.1)}>
      <Store />
      <Ramp x0={RAMP.x0} x1={RAMP.x1} y={F + 20} h={RAMP.h} />
      <g transform={`rotate(${rot} ${x} ${y})`}>
        <Bike x={x} y={y} s={1} spin={t * 20} color="#2E8AE0" />
        <Hero look={YOU} pose={{ ...rider(x, y, 1), expr: 'happy' }} shadow={0} />
      </g>
      <SpeedLines x={x - 60} y={y - 160} t={t} dir={1} len={200} o={0.5} />
    </g>
  );
};

// ---------- S7: the flip, and the hedge ----------
export const S7: React.FC<ShotProps> = ({ t, f }) => {
  const land = Math.max(24, rel(f, t, 'hedge'));
  const a = arc(t, [RAMP.x1, rampY(RAMP.x1)], [1700, F], 300, land);
  const spin = -360 * clamp(t / land);
  const inHedge = t >= land;
  return (
    <g transform={`${shk(t, land, 8, 10)} ${camT(kf(t, [[0, 1160], [land, 1500]]), 520, 0.95)}`}>
      <Store />
      <Ramp x0={RAMP.x0} x1={RAMP.x1} y={F + 20} h={RAMP.h} />
      {!inHedge ? (
        <g transform={`rotate(${spin} ${a.x} ${a.y - 120})`}>
          <Bike x={a.x} y={a.y} s={1} spin={t * 20} color="#2E8AE0" />
          <Hero look={YOU} pose={{ ...rider(a.x, a.y, 1), expr: 'happy', armL: { a: 150, b: 0 } }} shadow={0} />
        </g>
      ) : (
        <g>
          <Bike x={1500} y={F + 20} s={1} spin={90} color="#2E8AE0" />
          <Hero look={YOU} pose={{ ...flying(1700, F - 120, 1, 170, t), legL: { a: 160, b: -20 }, legR: { a: 200, b: -20 } }} shadow={0} />
        </g>
      )}
      <Hedge x0={1500} x1={2100} y={F + 20} shake={inHedge ? clamp(1 - (t - land) / 20) : 0} t={t} />
      {leaves(1700, F - 120, t - land)}
      <Pow x={1700} y={420} t={t - land} text="CRUNCH!" size={90} hold={22} color="#7AD45A" />
    </g>
  );
};

// ---------- S8: the bike is ruined; you pop out of the hedge, thumbs up ----------
export const S8: React.FC<ShotProps> = ({ t, len, f }) => {
  const pop = Math.max(8, rel(f, t, "You're") - 6);
  const k = backOut(clamp((t - pop) / 8));
  const you: Pose = { ...basePose, x: 1260, y: F - LEG_LEN - 40 - 60 * (1 - k) + 60, scale: 1, yaw: -0.2, armR: { a: 150 * k, b: -60 * k } };
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1080]]), 640, 1.5)}>
      <Store />
      {/* the bike in bits on the pavement */}
      <g transform={`translate(780 ${F + 20})`}>
        <circle cx={0} cy={-50} r={56} fill="none" stroke="#16141C" strokeWidth={9} transform="scale(0.6 1)" />
        <circle cx={150} cy={-12} r={56} fill="none" stroke="#16141C" strokeWidth={9} transform="scale(1 0.25) translate(0 -20)" />
        <path d="M 40 -20 L 140 -70 M 100 -10 L 220 -40 M 200 -10 L 260 -20" stroke="#2E8AE0" strokeWidth={10} strokeLinecap="round" />
      </g>
      {t >= pop ? <Body look={YOU} pose={you} t={t} faces={[[0, 'happy']]} /> : null}
      <Hedge x0={1000} x1={1600} y={F + 20} t={t} shake={t >= pop ? clamp(1 - (t - pop) / 12) : 0} />
      {leaves(1260, F - 280, t - pop)}
      {t >= pop ? <HeadBar {...overHead({ ...you, y: F - LEG_LEN })} p={0.78} t={t} /> : null}
      <Pow x={760} y={F - 200} t={t - 4} text="RUINED" size={60} hold={pop} rot={-6} color="#F6EFE3" />
    </g>
  );
};

// ---------- S9: Mo, screaming, filming ----------
export const S9: React.FC<ShotProps> = ({ t, len, f }) => {
  const film = rel(f, t, 'filming');
  const mo: Pose = { ...basePose, x: 960, y: 720, yaw: -0.2, armR: { a: 110, b: -70 }, armL: { a: t >= film ? 110 : 30, b: -70 } };
  return (
    <g>
      <Soft blur={16} dim={0.15}>
        <g transform={camT(960, 520, 1.6)}>
          <Store />
        </g>
      </Soft>
      <g transform={`${shk(t, 0, 30, 4)} ${camT(960, 540, kf(t, [[0, 2.6], [len, 2.8]]))}`}>
        <Body look={MO} pose={mo} t={t} faces={[[0, 'shock'], [film, 'happy']]} seed={4} />
        {t >= film ? (
          <g transform="translate(1010 560) rotate(-8)">
            <rect x={-40} y={-70} width={80} height={140} rx={12} fill="#16141C" stroke="#3A3848" strokeWidth={4} />
            <circle cx={0} cy={-46} r={8} fill="#FF3030" opacity={Math.floor(t / 15) % 2 ? 1 : 0.3} />
          </g>
        ) : null}
        <Pow x={790} y={380} t={t} text="AAAAA!" size={60} hold={film} rot={-10} color="#F6EFE3" />
      </g>
    </g>
  );
};

// ---------- S10: the skate park: the biggest ramp ----------
const PARK = { x0: 400, x1: 1000, h: 300 };
const Lot: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <DAY t={t} />
    <rect x={-400} y={F + 20} width={2800} height={400} fill="#5A5A64" />
    {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${-200 + i * 300} ${F + 60} L ${-160 + i * 300} ${F + 200}`} stroke="#F6EFE3" strokeWidth={8} opacity={0.6} />)}
  </g>
);
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, -100], [len, PARK.x0 + 200]]);
  const k = clamp((x - PARK.x0) / (PARK.x1 - PARK.x0));
  const y = F + 20 - PARK.h * Math.pow(k, 2.2);
  return (
    <g transform={camT(kf(t, [[0, 500], [len, 700]]), 560, 1.05)}>
      <Lot t={t + 30} />
      <Ramp x0={PARK.x0} x1={PARK.x1} y={F + 20} h={PARK.h} color="#B9BCC4" />
      <Skateboard x={x} y={y} s={1} rot={-40 * k} />
      <Hero look={YOU} pose={{ ...basePose, x, y: y - 34 - LEG_LEN, yaw: 0.8, tilt: 10, armL: { a: 70, b: 0 }, armR: { a: 80, b: 0 }, legL: { a: 20, b: -30 }, legR: { a: -20, b: -30 }, expr: 'cool' }} shadow={0} />
      <SpeedLines x={x - 40} y={y - 140} t={t} dir={1} len={160} o={0.5} />
    </g>
  );
};

// ---------- S11: overshoot by twenty feet, bounce off a trash can, slide across the lot on your back ----------
export const S11: React.FC<ShotProps> = ({ t, len, f }) => {
  const can = Math.max(20, rel(f, t, 'bounce'));
  const slide = Math.max(can + 10, rel(f, t, 'slide'));
  let x: number, y: number, pose: Pose;
  if (t < can) {
    const a = arc(t, [PARK.x1, F + 20 - PARK.h - 40], [1900, F - 200], 300, can);
    x = a.x; y = a.y;
    pose = flying(x, y, 1, -540 * a.p, t, { expr: 'happy' });
  } else if (t < slide) {
    const a = arc(t - can, [1900, F - 200], [2300, F - 60], 120, slide - can);
    x = a.x; y = a.y;
    pose = flying(x, y, 1, -540 - 200 * a.p, t);
  } else {
    x = 2300 + (t - slide) * 16;
    y = F - 20;
    pose = lie(x, F - 6, 1, -1, { armL: { a: 160, b: 0 }, armR: { a: 170, b: 0 }, expr: 'happy' });
  }
  const camX = kf(t, [[0, 900], [can, 1700], [slide, 2100], [Math.max(slide + 1, len), 2700]]);
  return (
    <g transform={`${shk(t, can, 6, 10)} ${camT(camX, 520, 0.95)}`}>
      <Lot t={t + 60} />
      <rect x={2400} y={-400} width={2000} height={2000} fill="none" />
      <Ramp x0={PARK.x0} x1={PARK.x1} y={F + 20} h={PARK.h} color="#B9BCC4" />
      <TrashCan x={1960} y={F + 20} s={1.2} rot={t >= can ? Math.min(20, (t - can) * 3) : 0} />
      <Hero look={YOU} pose={pose} shadow={0} />
      {t < can ? <g opacity={clamp((t - 8) / 6)}><path d={`M ${PARK.x1} ${F + 70} L 1900 ${F + 70}`} stroke="#FFD23A" strokeWidth={6} strokeDasharray="20 14" /><text x={1450} y={F + 140} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill="#FFD23A" stroke="#0B0816" strokeWidth={6} paintOrder="stroke">+20 FT</text></g> : null}
      <Pow x={1960} y={F - 260} t={t - can} text="BONG!" size={90} hold={18} />
      {t >= slide ? <SpeedLines x={x - 80} y={F - 40} t={t} dir={1} len={240} o={0.6} /> : null}
      {t >= slide ? [0, 1, 2].map((i) => <circle key={i} cx={x - 120 - i * 60} cy={F - 4} r={8 + i * 3} fill="#FFD23A" opacity={0.6} />) : null}
    </g>
  );
};

// ---------- S12: a little kid with an ice cream claps; you take a bow ----------
export const S12: React.FC<ShotProps> = ({ t, len, f }) => {
  const bow = Math.max(10, rel(f, t, 'bow') - 4);
  const kb = easeOut(clamp((t - bow) / 8));
  const kid: Pose = { ...basePose, x: 1260, y: F - LEG_LEN * 0.62, scale: 0.62, yaw: -0.4, armL: { a: 70 + 20 * Math.abs(Math.sin(t / 3)), b: -60 }, armR: { a: 70 + 20 * Math.abs(Math.sin(t / 3 + 1)), b: -60 } };
  const you: Pose = { ...basePose, x: 820, y: streetHip(1), yaw: 0.3, tilt: 40 * kb, armR: { a: 40 + 50 * kb, b: -40 }, armL: { a: 10, b: -10 } };
  const kidLook = { ...LOOKS.ellie, jacket: '#E8B43A', jacketShade: '#C8942A' };
  return (
    <g transform={camT(1020, 600, kf(t, [[0, 1.55], [len, 1.65]]))}>
      <Lot t={t + 90} />
      <Body look={YOU} pose={you} t={t} faces={[[0, 'happy'], [bow, 'cool']]} shadow={1} />
      <HeadBar {...overHead({ ...you, y: streetHip(1) })} p={0.6} t={t} o={1 - kb * 0.3} />
      <Body look={kidLook} pose={kid} t={t} faces={[[0, 'happy']]} seed={7} shadow={1} />
      <g transform={`translate(${1300} ${kid.y - 60}) rotate(-10)`}>
        <path d="M -16 0 L 16 0 L 0 50 Z" fill="#D9A262" stroke="#1A1018" strokeWidth={4} />
        <circle cx={0} cy={-12} r={22} fill="#F6B8C8" stroke="#1A1018" strokeWidth={4} />
      </g>
      <Pow x={1300} y={F - 300} t={t - 4} text="clap clap" size={44} hold={50} rot={6} color="#F6EFE3" />
    </g>
  );
};

// ---------- S13: Mo's tiny hop off the curb: lands on his knee. OW. ----------
export const S13: React.FC<ShotProps> = ({ t, len, f }) => {
  const land = Math.max(10, rel(f, t, 'lands'));
  const k = clamp(t / land);
  const kerbY = F - 30;
  const mo: Pose = t < land
    ? { ...basePose, x: 700 + 200 * k, y: kerbY - LEG_LEN - 40 * Math.sin(k * Math.PI) + 30 * k, yaw: 0.6, armL: { a: 60, b: -20 }, armR: { a: 70, b: -20 }, legL: { a: 30, b: -40 }, legR: { a: -10, b: -30 } }
    : { ...basePose, x: 960, y: F - 70, yaw: 0.4, tilt: 20, legL: { a: 90, b: -100 }, legR: { a: -10, b: -120 }, armL: { a: 40, b: -90 }, armR: { a: 50, b: -100 } };
  return (
    <g transform={`${shk(t, land, 6, 6)} ${camT(kf(t, [[0, 900], [len, 940]]), 640, kf(t, [[0, 1.8], [len, 1.95]]))}`}>
      <DAY t={t + 120} />
      <rect x={-400} y={kerbY} width={1240} height={60} fill="#B9B4AA" stroke="#2A2A30" strokeWidth={5} />
      <Body look={MO} pose={mo} t={t} faces={[[0, 'happy'], [land, 'shock'], [land + 10, 'worried']]} seed={4} shadow={1} />
      {t >= land ? [0, 1, 2].map((i) => <Pow key={i} x={1080 + i * 50} y={F - 260 - i * 40} t={t - land - i * 18} text="OW" size={56 + i * 10} hold={30} rot={i * 6 - 6} color="#F6EFE3" />) : null}
    </g>
  );
};

// ---------- S14: SAME CURB. NO BAR. ----------
export const S14 = bigWord({ kicker: 'SAME CURB.', word: 'NO BAR.', color: BAR.r, Bg: DAY, size: 230 });

// ---------- S15: the video on a phone: the views counting to two million ----------
export const S15: React.FC<ShotProps> = ({ t }) => (
  <PhoneFrame t={t} rec={false} label="9:41">
    <rect width={1920} height={960} fill="#101018" />
    <rect x={120} y={110} width={1100} height={620} rx={20} fill="#6A9AC8" />
    <g transform="translate(670 420)">
      <circle r={90} fill="#000" opacity={0.5} />
      <path d="M -30 -50 L 50 0 L -30 50 Z" fill="#F6EFE3" />
    </g>
    <text x={150} y={800} fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#F6EFE3">KID FLIPS BIKE INTO HEDGE, WALKS AWAY</text>
    <CountUp x={1560} y={360} t={t - 4} to={2000000} dur={40} size={110} color="#FFD23A" />
    <text x={1560} y={440} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} fill="#F6EFE3">VIEWS</text>
  </PhoneFrame>
);

// ---------- S16: Ellie on the sofa: "Again. Do it again." ----------
export const S16: React.FC<ShotProps> = ({ t, len, f }) => {
  const s = sofaSit(0.62);
  const ellie: Pose = { ...basePose, x: s.x, y: s.y, scale: s.scale * 0.72, yaw: -0.5, look: -0.5, legL: { a: 80, b: -80 }, legR: { a: 75, b: -75 }, armR: { a: 70, b: -80 }, armL: { a: 40, b: -60 } };
  return (
    <g transform={camT(kf(t, [[0, s.x - 80], [len, s.x - 60]]), s.y - 80, kf(t, [[0, 2.4], [len, 2.55]]))}>
      <LivingRoom t={t + 40} power={1} veil={0.3} />
      <Body look={ELLIE} pose={ellie} t={t} faces={[[0, 'happy']]} seed={5} words={W} f={f} talk={[[at('Again') / 30 - 0.1, at('again', 2) / 30 + 0.4]]} />
      <g transform={`translate(${s.x - 90} ${s.y - 110 * s.scale}) rotate(-14)`}>
        <rect x={-30} y={-55} width={60} height={110} rx={10} fill="#16141C" />
        <rect x={-24} y={-46} width={48} height={92} rx={6} fill="#6A9AC8" />
      </g>
      <Glow x={s.x - 90} y={s.y - 140 * s.scale} r={120} kind="cool" o={0.5} />
      <text x={s.x - 260} y={s.y - 260 * s.scale} fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3" opacity={clamp(t / 8)}>{`WATCHED ${Math.min(9, 1 + Math.floor(t / 10))}×`}</text>
    </g>
  );
};

// ---------- S17: don't try this ----------
export const S17 = ruleCard({ n: 'WARNING', text: "DON'T TRY THIS", sub: "YOU DON'T HAVE THE BAR. NOBODY DOES." });

// ---------- S18: dusk, walking home, the bar red and nearly empty, waving at Ellie ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const x = 500 + t * 5;
  const pose = walkPose(x, t * 0.6, streetHip(1), 1, { yaw: 0.6, armR: { a: 150 + 20 * Math.sin(t / 4), b: -20 } }, 1);
  const el: Pose = { ...basePose, x: 1500, y: F - LEG_LEN * 0.7, scale: 0.7, yaw: -0.5, armR: { a: 150 + 20 * Math.sin(t / 4 + 1), b: -20 } };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 580, 1.15)}>
      <DUSK t={t + 30} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'tired'], [20, 'happy']]} shadow={1} />
      <HeadBar {...overHead({ ...pose, y: streetHip(1) })} p={0.08} t={t} />
      <Body look={ELLIE} pose={el} t={t} faces={[[0, 'happy']]} seed={5} shadow={1} />
      <Skateboard x={x + 320} y={F + 10} s={1} />
    </g>
  );
};

// ---------- S19: the tiny trip on Mo's skateboard ----------
export const S19: React.FC<ShotProps> = ({ t, len, f }) => {
  const trip = Math.max(8, rel(f, t, 'trip') - 2);
  const k = easeIn(clamp((t - trip) / 8));
  const x = 900 + Math.min(t, trip) * 5 + k * 60;
  const pose: Pose = t < trip ? walkPose(x, t * 0.6, streetHip(1), 1, { yaw: 0.6 }, 1) : { ...basePose, x, y: streetHip(1) + 90 * k, scale: 1, spin: 80 * k, armL: { a: 120, b: -10 }, armR: { a: 140, b: -10 }, legR: { a: -40, b: -10 } };
  return (
    <g transform={`${shk(t, trip + 8, 6, 6)} ${camT(x, 700, kf(t, [[0, 2.0], [len, 2.15]]))}`}>
      <DUSK t={t + 80} />
      <Skateboard x={1010 + (t >= trip ? (t - trip) * 10 : 0)} y={F + 10} s={1} rot={t >= trip ? (t - trip) * 6 : 0} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'happy'], [trip, 'oops']]} shadow={1} />
      <Pow x={x + 120} y={F - 200} t={t - trip - 8} text="tap." size={60} hold={24} color="#F6EFE3" rot={0} />
    </g>
  );
};

// ---------- S20: the bar hits zero ----------
export const S20: React.FC<ShotProps> = ({ t }) => {
  const p = 0.08 * (1 - easeIn(clamp((t - 6) / 8)));
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />
      <HeadBar x={1000} y={540} s={3.2} p={p} t={t} hit={clamp(1 - Math.abs(t - 10) / 6)} />
      {t > 14 ? <text x={1000} y={720} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} letterSpacing={10} fill={BAR.r}>0 %</text> : null}
    </g>
  );
};

// ---------- S21: black ----------
export const S21 = RespawnBlack;

// ---------- S22: a hospital bed, a clean gown: your eyes open ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1100, 560, kf(t, [[0, 2.2], [len, 2.0]]))}>
    <HospitalRoom t={t + 20} night={true} />
    <Pillow />
    <Body look={{ ...YOU, jacket: '#B8D4E8', jacketShade: '#98B4C8', accent: '#E9F2F8' }} pose={inBed()} t={t} faces={[[0, 'neutral'], [12, 'shock']]} />
    <Sheet />
  </g>
);

// ---------- S23: the nurse, frozen in the doorway ----------
export const S23 = faceCU({
  look: NURSE, Bg: ({ t, id }) => <HospitalRoom t={t} id={id} />, faces: [[0, 'shock']], yaw: 0.3, zoom: [3.0, 3.3],
  extra: (t) => <Pow x={1150} y={380} t={t - 30} text="?!" size={110} hold={200} rot={8} color="#F6EFE3" />,
});

// ---------- S24: twenty seconds ago, this bed was empty ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 30) / 6);
  return (
    <g>
      <g transform={camT(1100, 560, 1.8)}>
        <HospitalRoom t={t + 80} night={true} />
        <Pillow />
        {k > 0.5 ? <Body look={{ ...YOU, jacket: '#B8D4E8', jacketShade: '#98B4C8', accent: '#E9F2F8' }} pose={inBed()} t={t} faces={[[0, 'oops']]} /> : null}
        <Sheet />
      </g>
      <rect width={1920} height={1080} fill="#7FD4FF" opacity={k > 0 && k < 1 ? 0.4 : 0} />
      <g opacity={1 - k} transform="translate(960 220)">
        <rect x={-260} y={-50} width={520} height={84} rx={42} fill="#16141C" opacity={0.85} />
        <text textAnchor="middle" y={12} fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3">20 SECONDS AGO</text>
      </g>
      <rect width={1920} height={1080} fill="#B9C8D4" opacity={0.18 * (1 - k)} />
    </g>
  );
};

// ---------- S25: and at that exact second, every light in the hospital flickers ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const fl = t > 10 && t < 40 ? (Math.floor(t / 3) % 2 ? 1 : 0) : 1;
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <HospitalRoom t={t + 120} power={fl} night={true} />
      <Pillow />
      <Body look={{ ...YOU, jacket: '#B8D4E8', jacketShade: '#98B4C8', accent: '#E9F2F8' }} pose={sitBedish()} t={t} faces={[[0, 'worried']]} />
      <Sheet />
      <Body look={NURSE} pose={{ ...basePose, ...stand(WARD, 0.22, 0.6), yaw: 0.5, look: 0.2 }} t={t} faces={[[0, 'shock']]} shadow={1} />
      {fl === 0 ? <rect x={-400} y={-400} width={2800} height={1900} fill="#000" opacity={0.55} /> : null}
    </g>
  );
};
const sitBedish = () => {
  const p = WARD.P(0.6, 0.72, 0.3);
  return { ...basePose, x: p.x, y: p.y + 20, scale: 0.8, legL: { a: 85, b: -5 }, legR: { a: 80, b: -5 } } as Pose;
};

// ---------- S26: you, in the gown, looking down at yourself ----------
export const S26 = faceCU({
  look: { ...YOU, jacket: '#B8D4E8', jacketShade: '#98B4C8', accent: '#E9F2F8' }, Bg: ({ t, id }) => <HospitalRoom t={t} id={id} />,
  faces: [[0, 'oops'], [24, 'worried']], yaw: 0.1, eyes: 0, pose: { headTilt: 10 }, zoom: [3.0, 3.2],
});

// ---------- S27: real stunt pros: mats, airbags, practice ----------
export const S27 = ruleCard({ n: 'STUNT PROS', text: 'MATS · AIRBAGS · PRACTICE', sub: 'AND THEY STILL GET HURT SOMETIMES' });

// ---------- S28: you: a green bar and no practice at all, a sheepish grin ----------
export const S28 = faceCU({
  look: YOU, Bg: DAY, faces: [[0, 'oops'], [40, 'happy']], yaw: 0.15, zoom: [3.0, 3.2],
  extra: (t) => <HeadBar x={960} y={430} s={0.7} p={0.5} t={t} />,
});
