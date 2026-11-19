import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, easeIn, backOut, ShotProps, FONT, LEG_LEN, Schematic, SCH, SchLabel, DrawOn, Arrow, factCard, walkPose, UI } from '../../../engine';
import {
  YOU, ELLIE, Body, Soft, faceCU, bigWord, wordF, HeadBar, overHead, flying, Pow, BAR, Backyard, YARD, roofY, Beanbag, lie,
} from '../common';
import { shk } from '../../gravity/common';
import words from './words.json';

// Chapter 6, the choice: four careful days, bar full. Ellie on the tree-house roof: "I've got the bar too!" She
// doesn't. The board cracks: ten feet, 17 mph, a trip to the emergency room. You run, with real physics: stop slower,
// and the force drops (an airbag). The beanbag, the dive, Ellie lands soft and laughing. Your bar: red. Zero.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const YD: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Backyard t={t} id={id} />;
const G = YARD.ground;
const ES = 0.7;
const EX = 1150;
const ellieOnRoof = (o: Partial<Pose> = {}): Pose => ({ ...basePose, x: EX, y: roofY(EX) - LEG_LEN * ES, scale: ES, yaw: 0.1, ...o });
const PORCH: Pose = { ...basePose, x: 120, y: G - 40 - 40, scale: 1, yaw: 0.3, legL: { a: 85, b: -85 }, legR: { a: 80, b: -80 }, armL: { a: 40, b: -90 }, armR: { a: 40, b: -90 } };
const BAG_X = 1080;

// ---------- S1: four days later ----------
export const S1 = bigWord({ kicker: 'FOUR DAYS LATER', word: 'NO STUNTS', color: BAR.g, Bg: YD, size: 200 });

// ---------- S2: on the porch steps with a book, bar full ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 260], [len, 300]]), 560, kf(t, [[0, 1.8], [len, 1.9]]))}>
    <YD t={t + 30} />
    <Body look={YOU} pose={PORCH} t={t} faces={[[0, 'happy']]} />
    <g transform={`translate(${PORCH.x + 20} ${PORCH.y - 60}) rotate(-10)`}>
      <rect x={-60} y={-40} width={120} height={80} rx={6} fill="#C8452A" stroke="#1A1018" strokeWidth={4} />
    </g>
    <HeadBar {...overHead({ ...PORCH, y: PORCH.y - 40 })} p={1} t={t} />
  </g>
);

// ---------- S3: you hear Ellie: your head snaps up ----------
export const S3 = faceCU({ look: YOU, Bg: YD, faces: [[0, 'neutral'], [8, 'shock']], yaw: 0.4, eyes: 0.8, pose: { headTilt: -10 }, zoom: [3.0, 3.3] });

// ---------- S4: wide: Ellie on the tree-house roof ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), kf(t, [[0, 560], [len, 480]]), kf(t, [[0, 0.95], [len, 1.15]]))}>
    <YD t={t + 60} />
    <Body look={ELLIE} pose={ellieOnRoof({ armL: { a: 120, b: 0 }, armR: { a: 120, b: 0 } })} t={t} faces={[[0, 'happy']]} seed={5} />
    <Body look={YOU} pose={{ ...PORCH, scale: 0.9 }} t={t} faces={[[0, 'shock']]} />
  </g>
);

// ---------- S5: low angle on Ellie: "Look! I've got the bar too! Watch me!" ----------
export const S5: React.FC<ShotProps> = ({ t, len, f }) => (
  <g transform={camT(EX, roofY(EX) - 60, kf(t, [[0, 2.2], [len, 2.4]]))}>
    <YD t={t + 90} />
    <Body look={ELLIE} pose={ellieOnRoof({ armL: { a: 150 + 15 * Math.sin(t / 4), b: 0 }, armR: { a: 150 - 15 * Math.sin(t / 4), b: 0 }, tilt: Math.sin(t / 6) * 4 })} t={t} faces={[[0, 'happy']]} seed={5} words={W} f={f} talk={[[at('Look') / 30 - 0.1, at('me') / 30 + 0.3]]} />
  </g>
);

// ---------- S6: over her head: nothing ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(EX, roofY(EX) - 200, kf(t, [[0, 2.6], [len, 2.9]]))}>
    <YD t={t + 120} />
    <Body look={ELLIE} pose={ellieOnRoof({ armL: { a: 150, b: 0 }, armR: { a: 150, b: 0 } })} t={t} faces={[[0, 'happy']]} seed={5} />
    <g opacity={clamp((t - 6) / 8)}>
      <rect x={EX - 70} y={roofY(EX) - LEG_LEN * ES - 300 * ES - 14} width={140} height={28} rx={14} fill="none" stroke="#F6EFE3" strokeWidth={3} strokeDasharray="10 8" />
      <text x={EX} y={roofY(EX) - LEG_LEN * ES - 300 * ES - 30} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#F6EFE3">NO BAR</text>
    </g>
  </g>
);

// ---------- S8: the board cracks under her feet ----------
export const S8: React.FC<ShotProps> = ({ t, len, f }) => {
  const c = Math.max(6, rel(f, t, 'cracks') - 2);
  const k = clamp((t - c) / 10);
  return (
    <g transform={`${shk(t, c, 8, 6)} ${camT(EX, roofY(EX) - 30, kf(t, [[0, 2.8], [len, 3.1]]))}`}>
      <Backyard t={t + 150} crack={k} />
      <Body look={ELLIE} pose={ellieOnRoof({ tilt: 12 * k, armL: { a: 100 + 40 * k, b: -20 }, armR: { a: 120 + 40 * k, b: -20 }, y: roofY(EX) - LEG_LEN * ES + 10 * k })} t={t} faces={[[0, 'happy'], [c, 'shock']]} seed={5} />
      <Pow x={EX + 120} y={roofY(EX) - 120} t={t - c} text="CRACK" size={70} hold={30} color="#F6EFE3" />
    </g>
  );
};

// ---------- S9: ten feet, 17 mph ----------
export const S9 = factCard({ value: 17, suffix: ' MPH', label: 'A FALL FROM 10 FEET (3 M) HITS AT', sub: 'v = √(2gh) = 7.7 m/s · IN A GAME: NOTHING' });

// ---------- S10: for a seven-year-old: the emergency room ----------
export const S10 = bigWord({ kicker: 'FOR A SEVEN-YEAR-OLD', word: 'EMERGENCY ROOM', color: BAR.r, Bg: YD, size: 160 });

// ---------- S11: you run ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const x = 200 + t * 14;
  const pose = walkPose(x, t * 1.1, G - LEG_LEN, 1, { yaw: 0.8, tilt: 16, armL: { a: 40 * Math.sin(t / 2), b: -60 }, armR: { a: -40 * Math.sin(t / 2), b: -60 } }, 1);
  return (
    <g transform={camT(x + 100, 600, 1.4)}>
      <YD t={t + 180} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'worried']]} shadow={1} />
      <HeadBar {...overHead({ ...pose, y: G - LEG_LEN })} p={1} t={t} />
    </g>
  );
};

// ---------- S12: the physics: same speed, a short stop vs a long stop ----------
export const S12: React.FC<ShotProps> = ({ t, len, f }) => {
  const ten = Math.max(30, rel(f, t, 'ten', 2));
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
        <Schematic t={t} id="c6s12" />
      </g>
      <SchLabel x={960} y={180} t={t - 2} text="WHAT HURTS IS STOPPING TOO FAST" size={42} color={SCH.dim} />
      {[[540, 'STOP IN 3 CM', 1, SCH.live], [1380, 'STOP IN 30 CM', 0.1, BAR.g]].map(([x, lab, force, c], i) => {
        const k = i === 1 ? clamp((t - ten) / 10) : clamp((t - 10) / 10);
        return (
          <g key={i} opacity={i === 1 ? clamp((t - ten + 6) / 6) : 1}>
            <SchLabel x={x as number} y={300} t={(i ? t - ten : t - 6)} text={lab as string} size={40} color={c as string} />
            <rect x={(x as number) - 90} y={880 - 460 * (force as number) * k} width={180} height={460 * (force as number) * k} fill={c as string} />
            <SchLabel x={x as number} y={940} t={(i ? t - ten - 8 : t - 14)} text={i ? 'FORCE ÷ 10' : 'FORCE'} size={40} color={c as string} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- S13: that's how an airbag works ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const k = backOut(clamp((t - 10) / 8));
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
        <Schematic t={t} id="c6s13" />
      </g>
      <DrawOn d="M 640 760 L 640 560 L 760 440 L 1180 440 L 1300 560 L 1300 760 Z" t={t} dur={12} />
      <DrawOn d="M 760 760 L 760 600 L 880 600" t={t - 4} dur={8} color={SCH.dim} />
      <g transform={`translate(1000 580) scale(${k})`}>
        <ellipse rx={130} ry={110} fill="none" stroke={SCH.live} strokeWidth={8} />
      </g>
      <SchLabel x={960} y={880} t={t - 16} text="AN AIRBAG = A LONGER STOP" size={48} color={SCH.live} />
    </g>
  );
};

// ---------- S14: not your arms: grab the giant beanbag off the porch ----------
export const S14: React.FC<ShotProps> = ({ t, len, f }) => {
  const grab = Math.max(6, rel(f, t, 'grab'));
  const k = easeOut(clamp((t - grab) / 10));
  const you: Pose = { ...basePose, x: 260, y: G - 40 - LEG_LEN, yaw: 0.5, tilt: 20 - 20 * k, armL: { a: 60 + 90 * k, b: -20 }, armR: { a: 70 + 90 * k, b: -20 } };
  return (
    <g transform={camT(320, 560, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <YD t={t + 210} />
      <Body look={YOU} pose={you} t={t} faces={[[0, 'worried']]} shadow={1} />
      <Beanbag x={360} y={G - 40 - 200 * k} s={0.8} />
      <g opacity={clamp(1 - (t - grab) / 6)}>
        <path d="M 560 380 L 660 480 M 660 380 L 560 480" stroke={BAR.r} strokeWidth={14} strokeLinecap="round" />
        <text x={610} y={340} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3">NOT YOUR ARMS</text>
      </g>
    </g>
  );
};

// ---------- S15: throw it under the tree house ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(16, len - 4));
  const x = 360 + (BAG_X - 360) * k;
  const y = G - 260 - Math.sin(k * Math.PI) * 220 + 220 * k;
  return (
    <g transform={camT(800, 540, 0.95)}>
      <YD t={t + 240} />
      <Body look={ELLIE} pose={ellieOnRoof({ tilt: 12, armL: { a: 140, b: -20 }, armR: { a: 160, b: -20 } })} t={t} faces={[[0, 'shock']]} seed={5} />
      <Body look={YOU} pose={{ ...basePose, x: 300, y: G - LEG_LEN, yaw: 0.6, armL: { a: 150, b: 0 }, armR: { a: 160, b: 0 } }} t={t} faces={[[0, 'worried']]} shadow={1} />
      <g transform={`rotate(${k * 200} ${x} ${y})`}>
        <Beanbag x={x} y={y + 80} s={0.8} />
      </g>
    </g>
  );
};

// ---------- S16: dive in underneath it ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const a = Math.min(1, t / 14);
  const x = 600 + (BAG_X - 80 - 600) * a;
  const y = G - 200 + 140 * a - Math.sin(a * Math.PI) * 120;
  return (
    <g transform={camT(900, 640, 1.4)}>
      <YD t={t + 270} />
      {a < 1 ? <Hero look={YOU} pose={{ ...flying(x, y, 1, 80, t, { expr: 'worried' }), armL: { a: 170, b: 0 }, armR: { a: 180, b: 0 } }} shadow={0} /> : <Hero look={YOU} pose={lie(BAG_X - 40, G - 6, 1, -1, { armL: { a: 160, b: 0 }, armR: { a: 170, b: 0 }, expr: 'worried' })} />}
      <Beanbag x={BAG_X} y={G} s={0.9} />
    </g>
  );
};

// ---------- S17: Ellie falls; the beanbag catches her; the beanbag lands on you ----------
export const S17: React.FC<ShotProps> = ({ t, len, f }) => {
  const land = Math.max(14, rel(f, t, 'beanbag', 2) + 2);
  const k = easeIn(clamp(t / land));
  const y0 = roofY(EX) - LEG_LEN * ES;
  const y1 = G - 150;
  const ex = EX + (BAG_X - EX) * k;
  const ey = y0 + (y1 - y0) * k;
  const sq = t >= land ? Math.max(0, 1 - (t - land) / 10) : 0;
  return (
    <g transform={`${shk(t, land, 8, 8)} ${camT(kf(t, [[0, 1100], [land, 1080]]), kf(t, [[0, 420], [land, 680]]), 1.25)}`}>
      <Backyard t={t + 300} crack={1} />
      <Hero look={YOU} pose={lie(BAG_X - 40, G - 6, 1, -1, { armL: { a: 160, b: 0 }, armR: { a: 170, b: 0 }, expr: t >= land ? 'dizzy' : 'worried' })} />
      <Beanbag x={BAG_X} y={G} s={0.9} squish={sq} />
      <Body look={ELLIE} pose={t < land ? flying(ex, ey, ES, 30 * k, t, { expr: 'shock' }) : { ...basePose, x: BAG_X + 10, y: y1 + 20, scale: ES, legL: { a: 85, b: -60 }, legR: { a: 70, b: -50 }, armL: { a: 120, b: -20 }, armR: { a: 130, b: -20 } }} t={t} faces={[[0, 'shock'], [land + 6, 'happy']]} seed={5} />
      <Pow x={BAG_X + 200} y={G - 300} t={t - land} text="FLUMP" size={80} hold={22} color="#F6EFE3" />
    </g>
  );
};

// ---------- S18: Ellie, safe, laughing ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(BAG_X, G - 200, kf(t, [[0, 2.4], [len, 2.6]]))}>
    <YD t={t + 330} />
    <Hero look={YOU} pose={lie(BAG_X - 40, G - 6, 1, -1, { armL: { a: 160, b: 0 }, armR: { a: 170, b: 0 }, expr: 'dizzy' })} />
    <Beanbag x={BAG_X} y={G} s={0.9} squish={0.3} />
    <Body look={ELLIE} pose={{ ...basePose, x: BAG_X + 10, y: G - 130, scale: ES, legL: { a: 85, b: -60 }, legR: { a: 70, b: -50 }, armL: { a: 140 + 10 * Math.sin(t / 3), b: -20 }, armR: { a: 150, b: -20 }, tilt: Math.sin(t / 3) * 4 }} t={t} faces={[[0, 'happy']]} seed={5} />
    {[0, 1].map((i) => <text key={i} x={BAG_X + 140 + i * 60} y={G - 330 - ((t * 2 + i * 30) % 60)} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFD23A" opacity={0.8}>ha</text>)}
  </g>
);

// ---------- S19: you, under it: the bar flashing red ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.3}>
      <g transform={camT(960, 520, 1.6)}>
        <YD t={t + 360} />
      </g>
    </Soft>
    <g transform={camT(960, 560, kf(t, [[0, 3.0], [len, 3.3]]))}>
      <Hero look={YOU} pose={{ ...basePose, x: 960, y: 720, yaw: 0, headTilt: -20, expr: 'tired', blink: 0.3 }} shadow={0} />
      <HeadBar x={960} y={430} s={0.7} p={kf(t, [[0, 0.3], [30, 0.08]])} t={t} />
    </g>
  </g>
);

// ---------- S20: zero ----------
export const S20: React.FC<ShotProps> = ({ t }) => {
  const p = 0.08 * (1 - easeIn(clamp((t - 4) / 6)));
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />
      <g transform="translate(-40 0)">
        <rect x={680} y={490} width={680} height={100} rx={50} fill="#120E1E" stroke="#F6EFE3" strokeWidth={8} />
        <rect x={700} y={510} width={640 * p} height={60} rx={30} fill={BAR.r} />
      </g>
      <g transform={`translate(960 400) scale(${backOut(clamp((t - 10) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={180} fill={BAR.r} stroke="#0B0816" strokeWidth={14} paintOrder="stroke">ZERO</text>
      </g>
    </g>
  );
};

// ---------- S24: on the roof, not inside: a medium on Ellie, arms out for balance ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(EX - 40, roofY(EX) - 80, kf(t, [[0, 1.9], [len, 2.1]]))}>
    <YD t={t + 400} />
    <Body look={ELLIE} pose={ellieOnRoof({ armL: { a: 90, b: 0 }, armR: { a: 90, b: 0 }, tilt: Math.sin(t / 8) * 6 })} t={t} faces={[[0, 'happy']]} seed={5} />
  </g>
);

// ---------- S22: the height: a 10 FT marker beside the tree house ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const top = roofY(EX);
  const k = easeOut(clamp((t - 4) / 14));
  return (
    <g transform={camT(1000, 600, kf(t, [[0, 0.95], [len, 1.0]]))}>
      <YD t={t + 430} />
      <Body look={ELLIE} pose={ellieOnRoof({ armL: { a: 100, b: 0 }, armR: { a: 110, b: 0 } })} t={t} faces={[[0, 'happy']]} seed={5} />
      <path d={`M 1400 ${G} L 1400 ${G - (G - top) * k} M 1370 ${G} L 1430 ${G} M 1370 ${G - (G - top) * k} L 1430 ${G - (G - top) * k}`} stroke="#FFD23A" strokeWidth={8} />
      <text x={1450} y={(G + top) / 2} fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={k}>10 FT</text>
    </g>
  );
};

// ---------- S21: Ellie wobbling at the edge ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`${shk(t, 0, 200, 2)} ${camT(EX, roofY(EX) - 60, kf(t, [[0, 2.4], [len, 2.7]]))}`}>
    <Backyard t={t + 460} crack={1} />
    <Body look={ELLIE} pose={ellieOnRoof({ tilt: 14 * Math.sin(t / 5), armL: { a: 120 + 30 * Math.sin(t / 3), b: -20 }, armR: { a: 140 - 30 * Math.sin(t / 3), b: -20 } })} t={t} faces={[[0, 'shock']]} seed={5} />
  </g>
);

// ---------- S23: close on the cracked board, her sneakers sliding ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(EX + 10, roofY(EX) - 10, kf(t, [[0, 4.2], [len, 4.6]]))}>
    <Backyard t={t + 490} crack={1} />
    <Body look={ELLIE} pose={ellieOnRoof({ x: EX + Math.min(20, t * 0.6), tilt: 18, legL: { a: 30, b: -10 }, legR: { a: -20, b: -10 } })} t={t} faces={[[0, 'shock']]} seed={5} />
  </g>
);

// ---------- S25: a fall from that roof takes less than a second ----------
export const S25 = factCard({ value: 0.79, suffix: ' S', label: 'A FALL FROM THE TREE-HOUSE ROOF TAKES', sub: 't = √(2h / g), 3 M', format: (v) => v.toFixed(2) });

// ---------- S26: stunt air cushions, gym mats: soft and deep beats strong arms ----------
export const S26: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
      <Schematic t={t} id="c6s26" />
    </g>
    <SchLabel x={960} y={180} t={t - 2} text="THE SAME TRICK, EVERYWHERE" size={42} color={SCH.dim} />
    <g opacity={clamp((t - 4) / 6)}>
      <rect x={260} y={600} width={560} height={200} rx={50} fill="none" stroke={SCH.live} strokeWidth={6} />
      <path d="M 300 640 L 780 640 M 300 700 L 780 700 M 300 760 L 780 760" stroke={SCH.dim} strokeWidth={3} />
      <SchLabel x={540} y={880} t={t - 8} text="STUNT AIR CUSHION" size={40} color={SCH.live} />
    </g>
    <g opacity={clamp((t - 16) / 6)}>
      <rect x={1100} y={700} width={560} height={100} rx={16} fill="none" stroke={BAR.g} strokeWidth={6} />
      <SchLabel x={1380} y={880} t={t - 20} text="GYM MAT" size={40} color={BAR.g} />
    </g>
  </g>
);

// ---------- S27: soft and deep beats strong arms ----------
export const S27 = bigWord({ kicker: 'SOFT + DEEP', word: 'BEATS STRONG ARMS', color: BAR.g, Bg: YD, size: 140 });
