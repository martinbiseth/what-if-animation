import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, easeIn, backOut, ShotProps, FONT, LEG_LEN, Stairwell, Banister, SW, hipGround, stepTop, walkPose, Schematic, SCH, SchLabel, DrawOn, DizzyStars } from '../../../engine';
import {
  YOU, MO, Body, Soft, faceCU, bigWord, wordF, HeadBar, overHead, flying, landed, arc, SpeedLines, Pow, Dmg, Van, Garage, GARAGE, StreetModern, STREETM, streetHip, BAR, barColor, Heart,
} from '../common';
import { shk } from '../../gravity/common';
import words from './words.json';

// Chapter 1, cold open: you trip on the school stairs and bounce down like a rubber doll, stand up; a van bumps you
// at walking speed and you fly thirty feet and land on your feet; Mo dares you off his garage roof; the green bar
// over your head. Game physics. What would it really do, and what happens when the bar runs out?

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const ST: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Stairwell t={t} id={id} />;
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" car={false} />;
const SC = 0.9;
const stairHip = (x: number) => hipGround(x) - LEG_LEN * SC;

// ---------- S1: top of the stairs, walking with a backpack; the toe catches and you pitch forward ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const trip = 18;
  const x = 200 + Math.min(t, trip) * 9 + Math.max(0, t - trip) * 6;
  const k = easeIn(clamp((t - trip) / 10));
  const base = walkPose(x, t * 0.6, stairHip(x), SC, { yaw: 0.6 }, 1);
  const pose: Pose = t < trip ? base : { ...base, y: stairHip(x) - 20 * k, tilt: 40 * k, spin: 30 * k, armL: { a: 120 * k, b: -20 }, armR: { a: 140 * k, b: -10 }, legR: { a: -50 * k, b: -20 } };
  return (
    <g transform={camT(kf(t, [[0, 420], [len, 560]]), 360, kf(t, [[0, 1.7], [len, 1.85]]))}>
      <ST t={t + 40} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'happy'], [trip, 'shock']]} shadow={1} />
      <Banister />
    </g>
  );
};

// ---------- S2: your face, mid-fall: "this is going to hurt" ----------
export const S2 = faceCU({ look: YOU, Bg: ST, faces: [[0, 'shock'], [20, 'worried']], yaw: 0.4, pose: { spin: 20, tilt: 10 }, zoom: [3.3, 3.6] });

// ---------- S3: the bounce: down every step like a rubber doll, BOING on each one ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const dur = Math.max(30, len - 6);
  const p = clamp(t / dur);
  const x = SW.x0 - 40 + p * (SW.w * SW.n + 80);
  const step = p * SW.n;
  const hop = Math.abs(Math.sin(step * Math.PI)) * 110;
  const y = stepTop(x) - 70 - hop;
  const pose = flying(x, y, SC, p * 1080, t, { expr: 'dizzy' });
  const hits = Array.from({ length: SW.n }).map((_, i) => Math.round(((i + 0.02) / SW.n) * dur));
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 1000]]), kf(t, [[0, 520], [len, 640]]), 0.95)}>
      <ST t={t + 60} />
      <Hero look={YOU} pose={pose} shadow={0} />
      {hits.map((h, i) => (i % 2 === 0 ? <Pow key={i} x={SW.x0 + SW.w * i + 60} y={SW.top + SW.h * i - 80} t={t - h} text="BOING!" size={60} hold={12} rot={i % 4 ? 8 : -8} /> : null))}
      <HeadBar {...overHead({ x, y: y - 20, scale: SC })} p={1 - p * 0.18} t={t} />
      <Banister />
    </g>
  );
};

// ---------- S4: the bottom: you lie there, then pop up, dust off; a tiny bit of bar gone ----------
export const S4: React.FC<ShotProps> = ({ t, len, f }) => {
  const up = Math.max(8, rel(f, t, 'stand') - 4);
  const k = easeOut(clamp((t - up) / 10));
  const x = 1600;
  const floor = SW.top + SW.h * SW.n;
  const lying: Pose = { ...basePose, x, y: floor - 30, scale: SC, spin: 90, armL: { a: 30, b: -10 }, armR: { a: 50, b: -10 }, legL: { a: 10, b: 0 }, legR: { a: -10, b: 0 } };
  const standing: Pose = { ...basePose, x, y: floor - LEG_LEN * SC, scale: SC, yaw: 0.2, armR: { a: 40 + 30 * Math.sin(t / 3), b: -60 }, armL: { a: 20, b: -10 } };
  const pose: Pose = k < 1 ? { ...lying, ...{ spin: 90 * (1 - k), y: lying.y + (standing.y - lying.y) * k } } : standing;
  return (
    <g transform={camT(1500, floor - 160, kf(t, [[0, 2.0], [len, 2.15]]))}>
      <ST t={t + 120} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'dizzy'], [up, 'neutral'], [up + 16, 'cool']]} shadow={1} />
      {t < up ? <DizzyStars x={x + 90} y={floor - 60} t={t} rx={70} ry={26} /> : null}
      <HeadBar {...overHead({ x, y: standing.y, scale: SC })} p={0.82} t={t} o={k} />
      {t > up + 14 ? <Pow x={x + 260} y={floor - 330} t={t - up - 14} text="...FINE?" size={56} hold={30} rot={6} color="#F6EFE3" /> : null}
    </g>
  );
};

// ---------- S5: the crosswalk: the van rolls up at walking speed and bumps you ----------
const VAN_HIT = 34;
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const vx = kf(t, [[0, -200], [VAN_HIT, 520], [len, 600]]);
  const hit = t >= VAN_HIT;
  const yx = hit ? 820 + (t - VAN_HIT) * 26 : 820;
  const k = clamp((t - VAN_HIT) / 10);
  const pose: Pose = hit
    ? flying(yx, streetHip(1) - 160 * Math.sin(k * Math.PI * 0.5), 1, -60 * k, t)
    : { ...basePose, x: 820, y: streetHip(1), yaw: -0.5, look: -0.8, armR: { a: 40, b: -70 }, expr: 'neutral' };
  return (
    <g transform={`${shk(t, VAN_HIT, 6, 8)} ${camT(kf(t, [[0, 760], [len, 880]]), 560, 1.25)}`}>
      <DAY t={t + 40} />
      <g>
        {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={560 + i * 70} y={STREETM.feet + 30} width={44} height={110} fill="#F6EFE3" opacity={0.85} />)}
      </g>
      <Van x={vx} y={STREETM.feet + 120} s={0.85} spin={vx / 2} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'neutral'], [VAN_HIT - 6, 'oops'], [VAN_HIT, 'shock']]} shadow={hit ? 0 : 1} />
      <Pow x={760} y={420} t={t - VAN_HIT} text="BUMP." size={80} hold={16} color="#F6EFE3" />
    </g>
  );
};

// ---------- S6: wide: you sail thirty feet over the street, spinning twice ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const dur = Math.max(20, len + 4);
  const a = arc(t, [300, 560], [1700, 640], 260, dur);
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1200]]), 520, 0.9)}>
      <DAY t={t + 70} />
      <SpeedLines x={a.x} y={a.y} t={t} dir={1} len={260} />
      <Hero look={YOU} pose={flying(a.x, a.y, 0.95, a.p * 720, t)} shadow={0} />
      <HeadBar {...overHead({ x: a.x, y: a.y, scale: 0.95 })} p={0.8} t={t} />
      <g opacity={clamp((t - 6) / 6)}>
        <path d={`M 300 ${STREETM.feet + 60} L 1700 ${STREETM.feet + 60}`} stroke="#FFD23A" strokeWidth={6} strokeDasharray="20 14" />
        <text x={1000} y={STREETM.feet + 130} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill="#FFD23A" stroke="#0B0816" strokeWidth={6} paintOrder="stroke">30 FT</text>
      </g>
    </g>
  );
};

// ---------- S7: and land on your feet: the superhero landing, a puff of dust ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const land = 6;
  const x = 1000;
  const dropY = kf(t, [[0, 260], [land, STREETM.feet - LEG_LEN]]);
  const k = t < land ? 0 : Math.max(0, 1 - Math.max(0, t - land - 12) / 14);
  const pose = t < land ? flying(x, dropY, 1, 0, t) : landed(x, STREETM.feet, 1, k);
  return (
    <g transform={`${shk(t, land, 6, 10)} ${camT(x, 640, kf(t, [[0, 2.0], [len, 2.2]]))}`}>
      <DAY t={t + 100} />
      {t >= land ? [0, 1, 2, 3, 4].map((i) => {
        const d = (t - land) * (3 + i);
        return <circle key={i} cx={x - 120 + i * 60 + (i - 2) * d * 0.6} cy={STREETM.feet - 10 - d * 0.3} r={20 + d * 0.8} fill="#C9C2B0" opacity={clamp(1 - (t - land) / 20) * 0.7} />;
      }) : null}
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'shock'], [land, 'cool']]} shadow={1} />
      <HeadBar {...overHead({ x, y: STREETM.feet - LEG_LEN, scale: 1 })} p={0.72} t={t} hit={t >= land ? clamp(1 - (t - land) / 8) : 0} />
      <Dmg x={x + 140} y={STREETM.feet - 360} t={t - land} text="-8" />
    </g>
  );
};

// ---------- S8: the van just drives on ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, 1.0)}>
    <DAY t={t + 130} />
    <Van x={kf(t, [[0, 500], [len, 1400]])} y={STREETM.feet + 120} s={0.85} spin={t * 6} />
    <Body look={YOU} pose={{ ...basePose, x: 1640, y: streetHip(1) + 120 * 0, scale: 0.9, yaw: -0.6, look: -1, armR: { a: 70, b: -30 } }} t={t} faces={[[0, 'oops']]} />
    <Pow x={1200} y={500} t={t - 10} text="...OK THEN" size={50} hold={40} rot={0} color="#F6EFE3" />
  </g>
);

// ---------- S9: Mo points up; you're on his garage roof ----------
const ROOF_Y = GARAGE.roof - 4;
export const S9: React.FC<ShotProps> = ({ t, len, f }) => {
  const dare = rel(f, t, 'dares');
  const mo: Pose = { ...basePose, x: 1420, y: streetHip(1), yaw: -0.5, look: -0.6, armR: { a: 150, b: -10 }, handR: 'point' };
  const you: Pose = { ...basePose, x: 900, y: ROOF_Y - LEG_LEN, yaw: 0.3, look: 0.8 };
  return (
    <g transform={camT(kf(t, [[0, 1160], [len, 1100]]), 500, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <DAY t={t + 160} />
      <Garage />
      <Body look={YOU} pose={you} t={t} faces={[[0, 'neutral'], [dare + 10, 'smug']]} shadow={0} />
      <HeadBar {...overHead(you)} p={0.72} t={t} />
      <Body look={MO} pose={mo} t={t} faces={[[0, 'happy']]} seed={4} words={W} f={f} talk={[[at('dares') / 30 - 0.2, at('roof') / 30 + 0.3]]} shadow={1} />
      {t > dare ? <Pow x={1480} y={480} t={t - dare} text="DO IT!" size={64} hold={40} rot={6} /> : null}
    </g>
  );
};

// ---------- S10: low wide: you step off the edge ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const x = 1100 + t * 10;
  const k = easeIn(clamp(t / Math.max(10, len)));
  const y = ROOF_Y - LEG_LEN + k * (STREETM.feet - ROOF_Y + 40);
  return (
    <g transform={camT(1100, 560, 0.95)}>
      <DAY t={t + 190} />
      <Garage />
      <Hero look={YOU} pose={{ ...flying(x, y, 1, 20 * k, t, { expr: 'happy' }), armL: { a: 160, b: 0 }, armR: { a: 160, b: 0 } }} shadow={0} />
      <SpeedLines x={x} y={y - 120} t={t} dir={1} len={120} o={0.4 * k} />
    </g>
  );
};

// ---------- S11: one roll, dust off the hoodie, walk away; Mo's jaw on the floor ----------
export const S11: React.FC<ShotProps> = ({ t, len, f }) => {
  const dust = rel(f, t, 'dust');
  const walk = rel(f, t, 'walk');
  const rollK = clamp(t / 12);
  let pose: Pose;
  if (t < 12) pose = { ...basePose, x: 700 + rollK * 220, y: STREETM.feet - 90, scale: 1, spin: 360 * rollK, legL: { a: 90, b: -120 }, legR: { a: 80, b: -120 }, armL: { a: 60, b: -90 }, armR: { a: 60, b: -90 } };
  else if (t < walk) pose = { ...basePose, x: 920, y: streetHip(1), yaw: 0.2, armR: { a: 30 + (t > dust ? 30 * Math.abs(Math.sin(t / 2)) : 0), b: -80 }, armL: { a: 30, b: -60 } };
  else pose = walkPose(920 + (t - walk) * 7, (t - walk) * 0.6, streetHip(1), 1, { yaw: 0.6 }, 1);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1100]]), 600, 1.35)}>
      <DAY t={t + 220} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'happy'], [14, 'cool']]} shadow={t < 12 ? 0 : 1} />
      <HeadBar {...overHead({ x: pose.x, y: streetHip(1), scale: 1 })} p={0.64} t={t} o={t < 12 ? 0 : 1} />
      <Body look={MO} pose={{ ...basePose, x: 1460, y: streetHip(1), yaw: -0.5, look: -0.7, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } }} t={t} faces={[[0, 'shock']]} seed={4} shadow={1} />
    </g>
  );
};

// ---------- S12: close: your eyes go up; a green bar fades in over your head ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 8) / 14));
  return (
    <g>
      <Soft blur={16} dim={0.2}>
        <g transform={camT(960, 520, 1.6)}>
          <DAY t={t + 260} />
        </g>
      </Soft>
      <g transform={camT(960, 520, kf(t, [[0, 2.8], [len, 3.0]]))}>
        <Body look={YOU} pose={{ ...basePose, x: 960, y: 720, yaw: 0.1, look: 0, headTilt: -8 }} t={t} faces={[[0, 'neutral'], [10, 'shock']]} />
        <g opacity={k}>
          <HeadBar x={960} y={410 - 20 * k} s={0.8} p={0.64} t={t} />
        </g>
        {[0, 1].map((i) => <circle key={i} cx={940 + i * 40} cy={560} r={0} />)}
      </g>
    </g>
  );
};

// ---------- S13: insert: the bar, big: every landing takes a bite ----------
export const S13: React.FC<ShotProps> = ({ t, f }) => {
  const shrink = rel(f, t, 'shrinks');
  const bites = [shrink, shrink + 14, shrink + 28];
  let p = 0.64;
  bites.forEach((b) => {
    if (t >= b) p -= 0.06 * easeOut(clamp((t - b) / 6));
  });
  const hit = Math.max(0, ...bites.map((b) => (t >= b ? 1 - (t - b) / 8 : 0)));
  return (
    <g>
      <Soft blur={16} dim={0.45}>
        <g transform={camT(960, 520, 1.6)}>
          <DAY t={t + 300} />
        </g>
      </Soft>
      <HeadBar x={1000} y={540} s={3.2} p={p} t={t} hit={clamp(hit)} />
      {bites.map((b, i) => <Dmg key={i} x={1300 + i * 70} y={420} t={t - b} text="-6" />)}
    </g>
  );
};

// ---------- S14: GAME PHYSICS ----------
export const S14 = bigWord({ kicker: 'TODAY, YOU RUN ON', word: 'GAME PHYSICS', color: BAR.g, Bg: DAY, size: 190 });

// ---------- S15: the schematic: a body outline, the fall, a question mark ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}>
      <Schematic t={t} id="c1s15" />
    </g>
    <g opacity={0.95}>
      <DrawOn d="M 900 260 a 60 60 0 1 0 0.1 0 M 900 380 L 900 620 M 900 420 L 800 540 M 900 420 L 1000 540 M 900 620 L 830 820 M 900 620 L 970 820" t={t} dur={20} color={SCH.line} width={6} />
      <DrawOn d="M 640 200 L 640 820 M 610 200 L 670 200 M 610 820 L 670 820" t={t - 10} dur={12} color={SCH.dim} width={4} />
    </g>
    <SchLabel x={560} y={520} t={t - 18} text="10 FLOORS" size={34} color={SCH.dim} anchor="end" />
    <g transform={`translate(1250 560) scale(${backOut(clamp((t - 26) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={340} fill={SCH.live}>?</text>
    </g>
    <SchLabel x={960} y={960} t={t - 30} text="A REAL HUMAN BODY" size={40} color={SCH.live} />
  </g>
);

// ---------- S16: the bar drains to nothing, the heart goes grey ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const p = 0.46 * (1 - easeIn(clamp((t - 6) / Math.max(10, len - 14))));
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />
      <HeadBar x={1000} y={540} s={3.2} p={p} t={t} />
      {p <= 0.001 ? <Heart x={1000 - 3.2 * 134} y={540} s={2.9} c="#4A4458" /> : null}
      {p <= 0.001 ? <text x={1000} y={720} textAnchor="middle" fontFamily={FONT.ui} fontSize={56} letterSpacing={10} fill={BAR.r}>0 %</text> : null}
    </g>
  );
};
