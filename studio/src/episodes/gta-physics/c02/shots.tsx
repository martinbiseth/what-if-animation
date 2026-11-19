import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, easeIn, backOut, ShotProps, FONT, LEG_LEN, Bedroom, BEDROOM, bedTop, stand, chapterCard, Kitchen, talkShot, Sparkle } from '../../../engine';
import {
  YOU, MO, MOM, Body, Soft, faceCU, bigWord, wordF, HeadBar, overHead, Pow, Dmg, BAR, ruleCard, RespawnBlack, Hallway, HALL, Gym, GYM, HospitalRoom, inBed, sitBed, Sheet, Pillow, lie,
} from '../common';
import { shk } from '../../gravity/common';
import { LOOKS } from '../../../engine';
import words from './words.json';

// Chapter 2, the rules: it started this morning (a DING instead of a thump), then the four rules (nothing hurts, sit
// still to heal, zero sends you to hospital, never tell Mom), Mo names it: respawn. Only you have a bar.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const BR: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} clock="07:00" duvet={true} lamp={0.6} veil={0.36} />;
const HL: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Hallway t={t} id={id} />;
const KIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} veil={0.3} />;

// ---------- S1: the title ----------
export const S1 = chapterCard({ kicker: 'WHAT IF', title: 'GAME PHYSICS WERE REAL?', sunY: 640 });

// ---------- S2: you roll out of bed and hit the floor: no thump, a DING ----------
export const S2: React.FC<ShotProps> = ({ t, len, f }) => {
  const hit = Math.max(10, rel(f, t, 'hit'));
  const ding = hit + 2;
  const top = bedTop(0.3, 0.32);
  const floor = BEDROOM.P(0.55, 1, 0.55);
  const s = stand(BEDROOM, 0.55, 0.55).scale;
  const k = easeIn(clamp((t - (hit - 10)) / 10));
  const x = top.x + (floor.x - top.x) * k;
  const y = top.y - 40 + (floor.y - top.y + 40) * k;
  const pose = lie(x, y - 40 * s, s, 1, { spin: 90 + 90 * (1 - k) * 0, expr: t < hit ? 'tired' : 'shock' });
  return (
    <g transform={`${shk(t, hit, 6, 6)} ${camT(kf(t, [[0, 820], [len, 860]]), 600, kf(t, [[0, 1.5], [len, 1.62]]))}`}>
      <BR t={t + 40} />
      <Body look={YOU} pose={{ ...pose, squash: t >= hit && t < hit + 6 ? 0.15 : 0 }} t={t} faces={[[0, 'tired'], [hit, 'shock']]} />
      <Pow x={floor.x + 180} y={floor.y - 160} t={t - ding} text="DING!" size={90} hold={30} color={BAR.g} />
      {t >= ding ? <HeadBar x={floor.x + 180} y={floor.y - 300} s={0.8 * backOut(clamp((t - ding) / 8))} p={1} t={t} /> : null}
    </g>
  );
};

// ---------- S3: your face on the floor, the bar floating over it ----------
export const S3 = faceCU({
  look: YOU, Bg: BR, faces: [[0, 'shock'], [30, 'oops']], yaw: 0.1, eyes: 0, pose: { headTilt: -6 }, zoom: [3.0, 3.2],
  extra: (t) => <HeadBar x={960} y={430} s={0.7} p={1} t={t} />,
});

// ---------- S4: by lunch: the rules ----------
export const S4 = bigWord({ kicker: 'BY LUNCH', word: 'THE RULES', color: '#F6EFE3', Bg: HL, size: 200 });

// ---------- S5: rule one ----------
export const S5 = ruleCard({ n: 'RULE 1', text: 'NOTHING HURTS', sub: 'A HIT JUST TAKES A CHUNK OFF THE BAR' });

// ---------- S6: the hallway: a locker door swings into your face. BONK. A chunk off the bar. ----------
export const S6: React.FC<ShotProps> = ({ t, len, f }) => {
  const bonk = Math.max(8, rel(f, t, 'chunk') - 4);
  const you = { ...basePose, ...stand(HALL, 0.6, 0.45), yaw: -0.3 };
  const door = stand(HALL, 0.5, 0.42);
  const sw = kf(t, [[0, 0], [bonk, 1], [bonk + 6, 0.92]]);
  const p = t < bonk ? 1 : 0.85;
  return (
    <g transform={`${shk(t, bonk, 6, 8)} ${camT(kf(t, [[0, you.x - 60], [len, you.x - 40]]), you.y - 80, kf(t, [[0, 2.0], [len, 2.1]]))}`}>
      <HL t={t + 30} />
      <Body look={YOU} pose={{ ...you, tilt: t >= bonk && t < bonk + 10 ? -12 : 0 }} t={t} faces={[[0, 'neutral'], [bonk, 'dizzy'], [bonk + 24, 'happy']]} shadow={1} />
      <g transform={`translate(${you.x - 210 * you.scale} ${you.y - 250 * you.scale})`}>
        <polygon points={`0,0 ${150 * sw * you.scale},${-40 * sw} ${150 * sw * you.scale},${400 * you.scale + 40 * sw} 0,${400 * you.scale}`} fill="#E8783A" stroke="#16202E" strokeWidth={5} />
      </g>
      <Pow x={you.x + 40} y={you.y - 330 * you.scale} t={t - bonk} text="BONK!" size={80} hold={16} />
      <HeadBar {...overHead(you)} p={p} t={t} hit={t >= bonk ? clamp(1 - (t - bonk) / 8) : 0} />
      <Dmg x={you.x + 200} y={you.y - 300 * you.scale} t={t - bonk} text="-15" />
    </g>
  );
};

// ---------- S7: rule two ----------
export const S7 = ruleCard({ n: 'RULE 2', text: 'SIT STILL = HEAL', sub: 'ONE MINUTE, AND THE BAR FILLS BACK UP' });

// ---------- S8: on the gym bench, the bar ticking back up ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(GYM, 0.5, 0.5);
  const pose: Pose = { ...basePose, x: s.x, y: s.y + 40 * s.scale, scale: s.scale, yaw: 0.1, legL: { a: 85, b: -85 }, legR: { a: 80, b: -80 }, armL: { a: 20, b: -30 }, armR: { a: 20, b: -30 } };
  const p = 0.85 + 0.15 * easeOut(clamp(t / Math.max(20, len - 10)));
  const b = GYM.P(0.5, 1, 0.5);
  return (
    <g transform={camT(s.x, s.y - 60, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <Gym t={t + 30} />
      <rect x={b.x - 220} y={s.y + 40 * s.scale} width={440} height={22} rx={6} fill="#8A6A4A" stroke="#2A1E18" strokeWidth={5} />
      <path d={`M ${b.x - 190} ${s.y + 60 * s.scale} L ${b.x - 190} ${b.y} M ${b.x + 190} ${s.y + 60 * s.scale} L ${b.x + 190} ${b.y}`} stroke="#2A1E18" strokeWidth={10} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'neutral'], [40, 'happy']]} />
      <HeadBar {...overHead({ ...pose, y: s.y })} p={p} t={t} />
      {[0, 1, 2].map((i) => <Pow key={i} x={s.x + 160 + i * 30} y={s.y - 360 * s.scale} t={t - 10 - i * 22} text="+5" size={44} hold={18} color={BAR.g} rot={0} />)}
    </g>
  );
};

// ---------- S9: rule three ----------
export const S9 = ruleCard({ n: 'RULE 3', text: 'ZERO = HOSPITAL', sub: 'EVERYTHING GOES BLACK. YOU WAKE UP FINE.' });

// ---------- S10: black: RESPAWNING ----------
export const S10 = RespawnBlack;

// ---------- S11: a hospital bed: you sit up, perfectly fine, thumbs up ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 8) / 10));
  const sit = sitBed(0.8, { armR: { a: 120 * k, b: -60 * k } });
  const pose = k < 0.5 ? inBed() : sit;
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1060]]), 560, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <HospitalRoom t={t + 40} night={false} />
      <Pillow />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'tired'], [10, 'happy']]} />
      <Sheet />
      {k > 0.5 ? <HeadBar x={sit.x} y={sit.y - 300 * 0.8} s={0.7} p={1} t={t} /> : null}
      <Pow x={sit.x + 230} y={sit.y - 260} t={t - 22} text="PERFECTLY FINE" size={52} hold={60} rot={-4} color={BAR.g} />
    </g>
  );
};

// ---------- S12: rule four, Mo's ----------
export const S12 = ruleCard({ n: 'RULE 4', text: 'NEVER TELL MOM', sub: "(MO'S RULE)" });

// ---------- S13: Mom, in the kitchen, eyes narrowing ----------
export const S13 = faceCU({ look: MOM, Bg: KIT, faces: [[0, 'neutral'], [16, 'smug']], yaw: -0.3, eyes: 0.5, zoom: [3.0, 3.25] });

// ---------- S14: the hallway: Mo leans in, whispering ----------
const MOP = stand(HALL, 0.62, 0.55), YOUP = stand(HALL, 0.42, 0.55);
export const S14: React.FC<ShotProps> = (props) => {
  const { f } = props;
  const Shot = talkShot({
    Set: HL, words: W, id: 'c2s14',
    cast: [
      { look: YOU, ...YOUP, yaw: 0.5, faces: [[0, 'neutral'], [40, 'smug']] },
      { look: MO, ...MOP, yaw: -0.5, seed: 4, talk: [[at('Bro') / 30 - 0.1, at('respawn') / 30 + 0.6]], faces: [[0, 'shock'], [30, 'happy']] },
    ],
    cam: { from: [960, YOUP.y - 60, 1.8], to: [960, YOUP.y - 60, 1.95] },
    front: (t) => <HeadBar {...overHead({ ...YOUP })} p={1} t={t} />,
  });
  return <Shot {...props} f={f} />;
};

// ---------- S15: RESPAWN ----------
export const S15 = bigWord({ kicker: "YOU'VE GOT", word: 'RESPAWN', color: BAR.g, Bg: HL, size: 220 });

// ---------- S16: the hallway, crowded: one bar in the whole school ----------
const KIDS = [
  { u: 0.12, w: 0.5, look: LOOKS.ellie, s: 1.25 }, { u: 0.25, w: 0.35, look: LOOKS.worker }, { u: 0.36, w: 0.62, look: MO },
  { u: 0.66, w: 0.4, look: LOOKS.lady }, { u: 0.78, w: 0.6, look: LOOKS.gent }, { u: 0.9, w: 0.42, look: LOOKS.mo26 },
];
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const you = { ...basePose, ...stand(HALL, 0.52, 0.5), yaw: 0.1 };
  return (
    <g transform={camT(kf(t, [[0, 880], [len, 1040]]), 560, kf(t, [[0, 1.15], [len, 1.25]]))}>
      <HL t={t + 70} />
      {KIDS.map((k, i) => {
        const s = stand(HALL, k.u, k.w);
        return <Body key={i} look={k.look} pose={{ ...basePose, ...s, scale: s.scale * 0.92, yaw: i % 2 ? -0.5 : 0.5 }} t={t} seed={i + 3} faces={[[0, i % 3 ? 'neutral' : 'happy']]} shadow={1} />;
      })}
      <Body look={YOU} pose={you} t={t} faces={[[0, 'neutral']]} shadow={1} />
      <HeadBar {...overHead(you)} p={1} t={t} />
      <Glow2 x={you.x} y={you.y - 300 * you.scale} />
    </g>
  );
};
const Glow2: React.FC<{ x: number; y: number }> = ({ x, y }) => <circle cx={x} cy={y} r={140} fill={BAR.g} opacity={0.08} />;

// ---------- S17: Mo close: nothing over his head, a dotted empty slot ----------
export const S17 = faceCU({
  look: MO, Bg: HL, faces: [[0, 'neutral']], yaw: -0.2, zoom: [3.0, 3.2],
  extra: (t) => (
    <g opacity={clamp((t - 8) / 8)}>
      <rect x={860} y={410} width={200} height={40} rx={20} fill="none" stroke="#F6EFE3" strokeWidth={4} strokeDasharray="12 10" opacity={0.7} />
      <text x={960} y={392} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#F6EFE3" opacity={0.8}>NO BAR</text>
    </g>
  ),
});
