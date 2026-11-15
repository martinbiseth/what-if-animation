import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, FONT, talkAt, LEG_LEN, walkPose,
  Kitchen, KITCHEN, stand, Classroom, SchoolDesk, Paper, PizzaBox, PizzaSlice, Sparkle,
} from '../../../engine';
import { YOU, MO, MOM, GRANDMA, COACH, TEACHER, ELLIE, faceCU, bigWord, Soft, relW, dayK, span, MOM_K } from '../common';
import { SoccerField, FIELD, fieldHip, Ball, KidsMenu, Ticket, FridgeDoor, SchoolPhoto, RoofHatch, ageK } from '../sets';
import { StreetModern, STREETM, streetHip, LivingRoom, LIVING, CountryRoad, COUNTRY, Bike, RoofNight, ROOF } from '../../electricity/sets';
import words from './words.json';

// Chapter 3, the fun part: day 1 (14) no knee pain and a whole pizza, the history test twice; day 3 (12) six goals for
// Mo's little cousin's team and a coach who reads the birth certificate three times; kids' prices; day 4 (11) the old
// red bike and the lake; day 5 (10) grandma's fridge photo and the cheek pinching; the list on the roof; and then the
// roof hatch handle you can't reach any more.

const W = words;
const rel = relW(W);
const P0 = '#100E16';
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" />;
const DUSK: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="dusk" />;
const KIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} veil={0.18} />;
const FLD: React.FC<{ t: number; id?: string }> = ({ t, id }) => <SoccerField t={t} id={id} />;
const LIV: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={1} />;
const ROOFN: React.FC<{ t: number; id?: string }> = ({ t, id }) => <RoofNight t={t} id={id} power={1} milky={0} />;
const CLS: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Classroom t={t} id={id} />;
const dayCard = (day: number, Bg: React.FC<{ t: number; id?: string }>) => bigWord({ kicker: `DAY ${day}`, word: `AGE ${15 - day}`, color: '#FFD23A', Bg, size: 230 });

const ride = (x: number, groundY: number, s: number, ph: number, o: Partial<Pose> = {}): Pose => ({
  ...basePose, x: x - 20 * s, y: groundY - 176 * s, scale: s * 0.9, yaw: 0.7, facing: 1, tilt: 14,
  legL: { a: 40 + 30 * Math.sin(ph), b: -60 - 20 * Math.cos(ph) }, legR: { a: 40 - 30 * Math.sin(ph), b: -60 + 20 * Math.cos(ph) },
  armL: { a: 70, b: -20 }, armR: { a: 66, b: -18 }, ...o,
});

// ---------- S1: DAY 1 · AGE 14 ----------
export const S1 = dayCard(1, DAY);

// ---------- S2: the street: you skip down the pavement, a little jump on the good knee ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const k = dayK(1);
  const hop = Math.max(0, Math.sin(t / 7)) * 40;
  const p = walkPose(kf(t, [[0, 700], [len, 1150]], (v) => v), t / 3, STREETM.feet, k, { expr: 'happy', blink: idleBlink(t, 3), armL: { a: 130, b: 20 }, armR: { a: 40 * Math.sin(t / 3), b: 30 } });
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 1050]]), 560, 1.35)}>
      <DAY t={t + 40} />
      <Hero look={YOU} pose={{ ...p, y: p.y - hop }} />
      {t > rel("You're", 'skin') ? <Sparkle x={p.x + 10} y={p.y - hop - 176 * k} t={t - rel("You're", 'skin')} s={0.8} /> : null}
    </g>
  );
};

// ---------- S3: the kitchen island: an empty pizza box, the last slice going in ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const k = dayK(1);
  const st = stand(KITCHEN, 0.5, 0.5, 0.62 * k);
  const bite = clamp(t / 30);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 960]]), 520, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <KIT t={t + 100} />
      <Hero look={YOU} pose={{ ...basePose, ...st, yaw: 0.1, expr: 'happy', blink: idleBlink(t, 2), talk: Math.abs(Math.sin(t / 3)) * 0.5, armR: { a: 120, b: 70 } }} />
      <PizzaBox x={st.x - 30} y={st.y + 60 * st.scale} w={260 * st.scale} lid={false} />
      <PizzaSlice x={st.x + 60 * st.scale} y={st.y - 120 * st.scale} len={70 * st.scale} rot={-60} bite={bite} shadow={0} />
    </g>
  );
};

// ---------- S4: the classroom: you at the front desk, writing fast, the same test as last year ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const write = Math.sin(t * 1.2) * 6;
  const me: Pose = { ...basePose, x: 1260, y: 700, scale: 0.86 * dayK(1), yaw: -0.2, facing: -1, headTilt: 14, expr: 'smug', blink: idleBlink(t, 3), armR: { a: 40 + write, b: -70 }, armL: { a: 30, b: -80 } };
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1150]]), 540, kf(t, [[0, 1.5], [len, 1.7]]))}>
      <CLS t={t + 100} />
      <Hero look={YOU} pose={me} shadow={0} />
      <SchoolDesk x={1260} />
      <text x={1520} y={420} fontFamily={FONT.ui} fontSize={40} letterSpacing={4} fill="#F6EFE3" opacity={clamp(t / 10)}>HISTORY · AGAIN</text>
    </g>
  );
};

// ---------- S5: the test paper: A+ in red, circled ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#8A6452" />
    <Paper x={960} y={560} w={720} rot={-4} done grade="A+" fill={1} />
    <g transform={`translate(1240 360) scale(${backOut(clamp((t - 3) / 8))})`}>
      <circle r={110} fill="none" stroke="#E8323A" strokeWidth={12} />
      <text y={40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#E8323A">A+</text>
    </g>
  </g>
);

// ---------- S6: the teacher, eyes narrowed: CHEATED? ----------
export const S6: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: TEACHER, Bg: CLS, faces: [[0, 'smug'], [rel('teacher', 'didnt') - 4, 'worried']], yaw: -0.3, zoom: [2.9, 3.15] });
  return (
    <g>
      <F {...p} />
      <g transform={`translate(960 210) scale(${backOut(clamp((p.t - rel('teacher', 'cheated')) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FF5A3A" stroke={P0} strokeWidth={14} paintOrder="stroke">CHEATED?</text>
      </g>
      <g opacity={clamp((p.t - rel('teacher', 'twice') + 4) / 6)}>
        <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.ui} fontSize={50} letterSpacing={6} fill="#F6EFE3" stroke={P0} strokeWidth={6} paintOrder="stroke">NOPE. JUST TWICE.</text>
      </g>
    </g>
  );
};

// ---------- S7: DAY 3 · AGE 12 ----------
export const S7 = dayCard(3, FLD);

// ---------- S8: the soccer field: Mo, grinning, hands you a jersey; little kids in the same jersey around you ----------
const KIDS = [
  { look: { ...ELLIE, jacket: '#E8C23A', jacketShade: '#C8A22A', extra: undefined }, x: 600, k: ageK(8) },
  { look: { ...MO, jacket: '#E8C23A', jacketShade: '#C8A22A', extra: undefined }, x: 760, k: ageK(9) },
  { look: { ...YOU, jacket: '#E8C23A', jacketShade: '#C8A22A', extra: undefined }, x: 1340, k: ageK(8) },
];
export const S8: React.FC<ShotProps> = ({ t, len, f }) => {
  const k = dayK(3);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 600, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <FLD t={t + 60} />
      {KIDS.map((c, i) => <Hero key={i} look={c.look} pose={{ ...basePose, x: c.x, y: fieldHip(c.k), scale: c.k, yaw: i < 2 ? 0.3 : -0.3, expr: 'happy', blink: idleBlink(t, i + 2), headTilt: -10 }} />)}
      <Hero look={{ ...YOU, jacket: '#E8C23A', jacketShade: '#C8A22A', extra: undefined }} pose={{ ...basePose, x: 960, y: fieldHip(k), scale: k, yaw: 0.2, expr: 'smug', blink: idleBlink(t, 5) }} />
      <Hero look={MO} pose={{ ...basePose, x: 1150, y: fieldHip(dayK(0)), scale: dayK(0), yaw: -0.4, facing: -1, expr: 'happy', blink: idleBlink(t, 3), talk: talkAt(W, f, 30, [span(W, 'Mo', 'team')]), armL: { a: 70, b: -20 } }} />
    </g>
  );
};

// ---------- S9: you kick: the ball flies into the net; a GOALS counter ticks 1 to 6 ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const k = dayK(3);
  const kick = (t % 16) / 16;
  const goals = Math.min(6, 1 + Math.floor(t / 10));
  const bx = 1080 + kick * 620;
  const by = FIELD.feet - 30 - Math.sin(kick * Math.PI) * 220;
  return (
    <g transform={camT(1200, 600, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <FLD t={t + 100} />
      <Hero look={{ ...YOU, jacket: '#E8C23A', jacketShade: '#C8A22A', extra: undefined }} pose={{ ...basePose, x: 960, y: fieldHip(k), scale: k, yaw: 0.6, expr: 'happy', blink: idleBlink(t, 2), legR: { a: kick < 0.2 ? -60 + kick * 500 : 30, b: -10 }, legL: { a: -10, b: 0 }, armL: { a: 60, b: 0 }, armR: { a: 50, b: 0 } }} />
      <Ball x={bx} y={by} r={26} spin={t * 30} />
      <g transform="translate(1600 300)">
        <rect x={-160} y={-60} width={320} height={120} rx={20} fill="#0B0816" opacity={0.85} />
        <text x={-130} y={20} fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">GOALS</text>
        <text x={120} y={30} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFD23A">{goals}</text>
      </g>
    </g>
  );
};

// ---------- S10: the other coach, red cap, pointing: BIRTH CERTIFICATE?! ----------
export const S10: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: COACH, Bg: FLD, faces: [[0, 'shock']], yaw: 0.3, zoom: [2.8, 3.0], pose: { armR: { a: 100, b: -10 }, handR: 'point' }, talk: span(W, 'The', 'certificate'), words: W });
  return (
    <g>
      <F {...p} />
      <g transform={`translate(960 200) scale(${backOut(clamp((p.t - rel('coach', 'birth')) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#FFD23A" stroke={P0} strokeWidth={14} paintOrder="stroke">BIRTH CERTIFICATE?!</text>
      </g>
    </g>
  );
};

// ---------- S11: the birth certificate in the coach's hands, read again and again (a counter: x3) ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const reads = Math.min(3, 1 + Math.floor(Math.max(0, t - rel('mom', 'reads')) / 12));
  const scan = (t % 24) / 24;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.08]]))}>
      <Soft blur={16} dim={0.2}><g transform={camT(960, 520, 1.6)}><FLD t={t + 200} /></g></Soft>
      <g transform="translate(960 560) rotate(-2)">
        <rect x={-440} y={-330} width={880} height={620} fill="#F8F2E0" stroke="#B8A27A" strokeWidth={14} />
        <rect x={-410} y={-300} width={820} height={560} fill="none" stroke="#C8B28A" strokeWidth={4} />
        <text y={-220} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#3A3440">CERTIFICATE OF BIRTH</text>
        <text x={-340} y={-100} fontFamily={FONT.ui} fontSize={38} fill="#3A3440">NAME: ████████</text>
        <text x={-340} y={-20} fontFamily={FONT.ui} fontSize={38} fill="#3A3440">AGE TODAY:</text>
        <text x={40} y={-10} fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#C8323A">15</text>
        <circle cx={300} cy={160} r={80} fill="none" stroke="#C8323A" strokeWidth={8} opacity={0.7} />
        <rect x={-340} y={120 + 0} width={420} height={6} fill="#9A90A0" />
        <rect x={-340} y={170} width={300} height={6} fill="#9A90A0" />
        {/* the coach's eyes, scanning down the page */}
        <rect x={-400} y={-280 + scan * 520} width={800} height={30} fill="#FFD23A" opacity={0.25} />
      </g>
      {/* his thumbs at the edges */}
      <ellipse cx={540} cy={820} rx={60} ry={40} fill="#26232F" />
      <ellipse cx={1380} cy={820} rx={60} ry={40} fill="#26232F" />
      <g transform={`translate(1620 220) scale(${backOut(clamp(((t - rel('mom', 'reads')) % 12) / 6))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFD23A" stroke={P0} strokeWidth={12} paintOrder="stroke">{`×${reads}`}</text>
      </g>
    </g>
  );
};

// ---------- S12: the cinema ticket: CHILD ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#3A1A2A" />
    {Array.from({ length: 20 }).map((_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 137) % 1080} r={6} fill="#FFD23A" opacity={0.3} />)}
    <Ticket x={960} y={560} s={1.5} rot={-6} stamp={clamp((t - 8) / 6)} />
  </g>
);

// ---------- S13: the kids' menu, a crayon finishing the maze ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.08]]))}>
    <KidsMenu t={t} />
  </g>
);

// ---------- S14: Mo at the diner, glaring at his bill: FULL PRICE ----------
export const S14: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: MO, Bg: ({ t, id }) => <KidsMenu t={t} key={id} />, faces: [[0, 'worried'], [rel('Mo', 'furious', 2) - 4, 'shock']], yaw: -0.3, zoom: [3.0, 3.3] });
  return (
    <g>
      <F {...p} />
      <g transform={`translate(1500 300) rotate(8) scale(${backOut(clamp((p.t - rel('Mo', 'full', 2)) / 8))})`}>
        <rect x={-190} y={-90} width={380} height={180} rx={16} fill="#FFFDF4" stroke={P0} strokeWidth={8} />
        <text y={-20} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={P0}>FULL PRICE</text>
        <text y={60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#C8323A">$14</text>
      </g>
    </g>
  );
};

// ---------- S15: DAY 4 · AGE 11 ----------
export const S15 = dayCard(4, DAY);

// ---------- S16: the garage: your old red bike with the stickers; you climb on and it fits ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const k = dayK(4);
  const gy = STREETM.kerb + 60;
  const on = clamp((t - 20) / 14);
  const me: Pose = on > 0.5 ? ride(900, gy, k, 0, { expr: 'happy', blink: idleBlink(t, 3) }) : { ...basePose, x: 760, y: gy - LEG_LEN * k, scale: k, yaw: 0.5, expr: 'happy', blink: idleBlink(t, 3), armR: { a: 70, b: -20 } };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 920]]), 600, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <DAY t={t + 300} />
      <Bike x={900} y={gy} s={0.7} color="#E8252A" />
      {[0, 1, 2].map((i) => <circle key={i} cx={860 + i * 40} cy={gy - 110} r={10} fill={['#FFD23A', '#3A8AE0', '#5AE0B0'][i]} stroke={P0} strokeWidth={3} />)}
      <Hero look={YOU} pose={me} />
      <text x={900} y={360} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFD23A" stroke={P0} strokeWidth={12} paintOrder="stroke" opacity={clamp((t - rel('old', 'fits', 3)) / 6)}>IT FITS.</text>
    </g>
  );
};

// ---------- S17: the country road at dusk: you and Mo riding side by side to the lake ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const gy = COUNTRY.feet + 20;
  const x = kf(t, [[0, 500], [len, 1400]], (v) => v);
  const ph = t * 0.5;
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1200]], (v) => v), 560, 1.3)}>
      <CountryRoad t={t} dusk />
      <Bike x={x} y={gy} s={0.62} spin={ph * 20} color="#E8252A" />
      <Hero look={YOU} pose={ride(x, gy, dayK(4) * 0.9, ph, { expr: 'happy', blink: idleBlink(t, 2) })} />
      <Bike x={x - 260} y={gy - 30} s={0.66} spin={ph * 20} color="#3A8AE0" />
      <Hero look={MO} pose={ride(x - 260, gy - 30, 0.92, ph + 1, { expr: 'happy', blink: idleBlink(t, 5) })} />
    </g>
  );
};

// ---------- S18: DAY 5 · AGE 10 ----------
export const S18 = dayCard(5, LIV);

// ---------- S19: the living room: grandma in the doorway, both hands to her face, crying; you, smaller ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const g = stand(LIVING, 0.36, 0.55, 0.62 * MOM_K);
  const y = stand(LIVING, 0.56, 0.55, 0.62 * dayK(5));
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 520, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <LIV t={t + 100} />
      <Hero look={GRANDMA} pose={{ ...basePose, ...g, yaw: 0.4, expr: 'worried', blink: Math.floor(t / 10) % 2 ? 1 : 0.5, armL: { a: 150, b: 130 }, armR: { a: 150, b: 130 }, headTilt: Math.sin(t / 3) * 3 }} />
      <Hero look={YOU} pose={{ ...basePose, ...y, yaw: -0.4, facing: -1, expr: 'oops', blink: idleBlink(t, 3) }} />
      {[0, 1].map((i) => <ellipse key={i} cx={g.x + (i ? 24 : -24) * g.scale} cy={g.y - 150 * g.scale + ((t * 3 + i * 20) % 60)} rx={6} ry={10} fill="#9FD8FF" opacity={0.9} />)}
    </g>
  );
};

// ---------- S20: grandma's fridge: your school photo from GRADE 5, the same face as today ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
    <FridgeDoor />
    <SchoolPhoto x={860} y={520} s={1.5} look={YOU} label="GRADE 5" rot={-3} />
  </g>
);

// ---------- S21: close, you: grandma's hands pinch both your cheeks ----------
export const S21: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: YOU, Bg: LIV, faces: [[0, 'oops'], [rel('pinches', 'let') - 2, 'happy']], yaw: 0, zoom: [3.2, 3.4] });
  const sq = Math.sin(p.t / 3) * 10;
  return (
    <g>
      <F {...p} />
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${960 + s * (250 - sq)} 560)`}>
          <path d={`M ${s * 400} 300 L ${s * 60} 20`} stroke="#9A86B8" strokeWidth={120} strokeLinecap="round" />
          <ellipse cx={0} cy={0} rx={80} ry={60} fill="#26232F" stroke={P0} strokeWidth={6} />
        </g>
      ))}
    </g>
  );
};

// ---------- S22: the roof at night: you and Mo sitting on the ledge, the city lit; you write on a notepad ----------
const sitp = (x: number, yaw: number, k: number, o: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y: ROOF.feet - 30 * k, scale: k, yaw, facing: yaw > 0 ? 1 : -1, headTilt: -6,
  legL: { a: 70, b: -110 }, legR: { a: 64, b: -104 }, armL: { a: 14, b: -30 }, armR: { a: 14, b: -30 }, ...o,
});
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 950]]), ROOF.feet - 260, kf(t, [[0, 1.6], [len, 1.75]]))}>
    <ROOFN t={t + 400} />
    <Hero look={YOU} pose={sitp(820, 0.35, dayK(5), { expr: 'happy', blink: idleBlink(t, 3), armR: { a: 50, b: -90 } })} />
    <Hero look={MO} pose={sitp(1080, -0.35, 1, { expr: 'happy', blink: idleBlink(t, 6), look: -0.3 })} />
    <rect x={870} y={ROOF.feet - 140} width={60} height={80} fill="#FFFDF4" stroke={P0} strokeWidth={3} transform={`rotate(-10 900 ${ROOF.feet - 100})`} />
  </g>
);

// ---------- S23: the list, each line written in as it's said ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const items: [string, string][] = [['RIDE THE KIDDIE RIDES', 'Ride'], ['GET CARRIED WHEN TIRED', 'Get'], ['EAT DESSERT FIRST', 'Eat']];
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
      <Soft blur={16} dim={0.4}><g transform={camT(960, ROOF.feet - 300, 1.6)}><ROOFN t={t + 500} /></g></Soft>
      <g transform="translate(960 560) rotate(-2)">
        <rect x={-480} y={-400} width={960} height={800} fill="#FFFDF4" stroke={P0} strokeWidth={6} />
        <text x={-400} y={-280} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#C8323A">ALLOWED AGAIN:</text>
        {items.map(([s, cue], i) => {
          const a = rel('Ride', cue, 2);
          const w = clamp((t - a) / 10);
          return (
            <g key={i}>
              <defs><clipPath id={`c3list${i}`}><rect x={-420} y={-180 + i * 150} width={880 * w} height={130} /></clipPath></defs>
              <text x={-400} y={-90 + i * 150} clipPath={`url(#c3list${i})`} fontFamily="'Comic Sans MS', 'Bricolage Grotesque', sans-serif" fontWeight={700} fontSize={56} fill="#26232F">{`${i + 1}. ${s}`}</text>
              <path d={`M -400 ${-80 + i * 150} l 20 20 l 40 -50`} stroke="#3AAA5A" strokeWidth={10} fill="none" opacity={clamp((t - a - 14) / 4)} transform="translate(780 0)" />
            </g>
          );
        })}
      </g>
    </g>
  );
};

// ---------- S24: close, Mo on the roof, delighted: the coolest thing ever ----------
export const S24 = faceCU({ look: MO, Bg: ROOFN, faces: [[0, 'happy']], yaw: -0.35, zoom: [3.1, 3.35], talk: span(W, 'Okay', 'says'), words: W });

// ---------- S25: the roof hatch handle; your hand reaching up, a hand's width short ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const reach = Math.sin(t / 5) * 16;
  return (
    <g transform={camT(960, 420, kf(t, [[0, 1.1], [len, 1.2]]))}>
      <RoofHatch t={t} />
      <path d={`M 960 1300 L 960 ${470 - reach}`} stroke="#F07A2A" strokeWidth={90} strokeLinecap="round" />
      <ellipse cx={960} cy={420 - reach} rx={48} ry={60} fill="#26232F" stroke={P0} strokeWidth={6} />
      <path d={`M 960 290 L 960 ${360 - reach}`} stroke="#FFD23A" strokeWidth={6} strokeDasharray="10 10" />
      <text x={1060} y={340} fontFamily={FONT.ui} fontSize={36} fill="#FFD23A" opacity={clamp((t - 20) / 6)}>SO CLOSE</text>
    </g>
  );
};

// ---------- S26: Mo reaches over you and opens the hatch ----------
export const S26: React.FC<ShotProps> = ({ t, len }) => {
  const k = dayK(5);
  const open = clamp(t / 16);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), ROOF.feet - 300, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <ROOFN t={t + 600} />
      <g transform={`translate(860 ${ROOF.feet - 30})`}>
        <rect x={-120} y={-30} width={240} height={30} fill="#3A3448" stroke={P0} strokeWidth={5} />
        <g transform={`translate(-120 -30) rotate(${-open * 100})`}>
          <rect x={0} y={-20} width={240} height={20} fill="#6A5A4A" stroke={P0} strokeWidth={5} />
        </g>
      </g>
      <Hero look={YOU} pose={{ ...basePose, x: 760, y: ROOF.feet - LEG_LEN * k, scale: k, yaw: 0.3, expr: 'worried', blink: idleBlink(t, 3), look: 0.5 }} />
      <Hero look={MO} pose={{ ...basePose, x: 1040, y: ROOF.feet - LEG_LEN, scale: 1, yaw: -0.5, facing: -1, tilt: -16, expr: 'neutral', blink: idleBlink(t, 6), armL: { a: 70 - open * 30, b: 20 } }} />
    </g>
  );
};

// ---------- S27: close, you: the smile goes ----------
export const S27 = faceCU({ look: YOU, Bg: ROOFN, faces: [[0, 'worried']], yaw: 0.3, zoom: [3.3, 3.7], dark: 0.1, light: { x: 960, y: 300, kind: 'cool', o: 0.3 } });

void MOM; void DUSK; void easeOut; void streetHip;
