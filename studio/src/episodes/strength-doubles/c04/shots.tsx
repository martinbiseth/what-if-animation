import React from 'react';
import { Pose, ShotProps, KITCHEN, stand, KitchenIsland, ModernCar, Smartphone, Envelope, Schematic, SCH, SchLabel, Arrow, FONT, factCard } from '../../../engine';
import { listCard } from '../../internet-gone/common';
import {
  YOU, ELLIE, DOC, Hero, basePose, camT, clamp, kf, lerp, easeOut, backOut, idleBlink, faceAt, Glow, POWER,
  StreetSet, KitchenSet, HospitalRoom, propCU, faceCU, bigWord, talkShot, sdCard, liftShot, at, HIP, STREETM, Soft,
  BigHand, Toothbrush, Spoon, XRay, Cracks, Handprint,
} from '../common';

// Chapter 4, the catch: day nine, everything breaks (toothbrush, tap, spoon, phone, doors); control is the hard
// part; slow motion; feet sinking into the lawn; school says stay home; day eleven, the crack. The facts: muscles
// that break their own bones, 2,048 times, and two months of food to lift the Titanic one metre. The hug you refuse.

const KIT = KitchenSet(0.3);
const STREET = StreetSet('day', { car: false });
const Bathroom: React.FC<{ t: number; id?: string }> = () => (
  <g>
    <rect width={1920} height={1080} fill="#BFD8DC" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${i * 140} 0 V 1080`} stroke="#A8C4C8" strokeWidth={4} />)}
    {Array.from({ length: 9 }, (_, i) => <path key={`h${i}`} d={`M 0 ${i * 140} H 1920`} stroke="#A8C4C8" strokeWidth={4} />)}
    <rect x={0} y={780} width={1920} height={300} fill="#E8EEF0" stroke="#8AA0A4" strokeWidth={6} />
  </g>
);
const A = stand(KITCHEN, 0.5, 0.4);

export const S1 = sdCard({ kicker: 'CHAPTER 4', title: 'THE CATCH', day: 9, tint: '#7A2A2A' });

// ---------- S2: the toothbrush snaps ----------
export const S2 = propCU({ Bg: Bathroom, push: 0.06, draw: (t) => (
  <g>
    <Toothbrush x={900} y={560} s={2.2} rot={-10} snap={easeOut(clamp((t - 38) / 6))} />
    <BigHand x={680} y={590} s={0.9} rot={-10} />
  </g>
) });

// ---------- S3: the tap comes off ----------
export const S3 = propCU({ Bg: Bathroom, push: 0.04, draw: (t) => {
  const off = easeOut(clamp((t - 50) / 8));
  return (
    <g>
      <rect x={400} y={760} width={1120} height={60} rx={20} fill="#F6F6F8" stroke="#100E16" strokeWidth={6} />
      <rect x={900} y={560} width={60} height={200} fill="#B8BCC8" stroke="#100E16" strokeWidth={6} />
      <g transform={`translate(${930 + off * 200} ${540 - off * 160}) rotate(${off * 60})`}>
        <rect x={-30} y={-30} width={160} height={50} rx={14} fill="#C8CCD8" stroke="#100E16" strokeWidth={6} />
        <BigHand x={60} y={-10} s={0.7} rot={0} />
      </g>
      {off > 0 ? Array.from({ length: 16 }, (_, i) => <path key={i} d={`M 930 560 q ${(i - 8) * 30} ${-200 * off} ${(i - 8) * 60} ${-60 + 200 * off}`} stroke="#6AB8E8" strokeWidth={10} fill="none" opacity={0.8} />) : null}
    </g>
  );
} });

// ---------- S4: water everywhere ----------
export const S4 = faceCU({ look: YOU, Bg: Bathroom, faces: [[0, 'oops']], yaw: 0.2, zoom: [3.0, 3.2], front: (t) => (
  <g>{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 131) % 1920} cy={((i * 71) + t * 18) % 1080} r={8} fill="#6AB8E8" opacity={0.7} />)}</g>
) });

// ---------- S5: the spoon folds like paper ----------
export const S5 = propCU({ Bg: KIT, push: 0.05, draw: (t) => (
  <g>
    <rect x={300} y={820} width={1320} height={300} fill="#C8A87A" />
    <ellipse cx={1200} cy={840} rx={220} ry={50} fill="#F6F6F8" stroke="#100E16" strokeWidth={6} />
    <Spoon x={860} y={800} s={1.6} bend={easeOut(clamp((t - 10) / 12))} />
    <BigHand x={820} y={820} s={0.8} rot={-70} />
  </g>
) });

// ---------- S6: the phone cracks in your pocket ----------
export const S6 = propCU({ Bg: KIT, push: 0.08, draw: (t) => (
  <g>
    <Smartphone x={960} y={540} s={1.2} mode="home" t={t} battery={60} />
    <Cracks x={1000} y={480} s={2.2} p={easeOut(clamp((t - 8) / 10))} seed={4} color="#F6EFE3" />
  </g>
) });

// ---------- S7: every door has your fingerprints pressed into it ----------
export const S7 = propCU({ Bg: KIT, push: 0.06, draw: (t) => (
  <g>
    <rect x={560} y={-40} width={800} height={1200} fill="#E8DCC8" stroke="#100E16" strokeWidth={10} />
    {[[720, 300], [1100, 220], [900, 600], [1200, 760], [700, 860], [1050, 450]].map(([x, y], i) => (
      <Handprint key={i} x={x} y={y} s={1.1} o={clamp((t - i * 10) / 6)} />
    ))}
    <circle cx={1260} cy={540} r={34} fill="#E8C04A" stroke="#100E16" strokeWidth={6} />
  </g>
) });

// ---------- S8: strength is easy, control is hard ----------
export const S8: React.FC<ShotProps> = ({ t }) => {
  const a = backOut(clamp((t - 80) / 9)), b = backOut(clamp((t - 116) / 9));
  return (
    <g>
      <rect width={1920} height={1080} fill="#120C18" />
      <g transform={`translate(960 430) scale(${a})`}><text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#F6EFE3">STRENGTH: <tspan fill="#5BE08A">EASY</tspan></text></g>
      <g transform={`translate(960 640) scale(${b})`}><text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={140} fill="#F6EFE3">CONTROL: <tspan fill="#FF3A2A">HARD</tspan></text></g>
    </g>
  );
};

// ---------- S9: fourteen years of training on fifty kilos; now every push is 500x too big ----------
export const S9: React.FC<ShotProps> = ({ t }) => {
  const p = easeOut(clamp((t - 120) / 20));
  return (
    <g>
      <Schematic t={t} id="ctl" />
      <SchLabel x={960} y={200} t={t - 2} text="YOUR BRAIN WAS TRAINED FOR" size={40} color={SCH.dim} />
      <SchLabel x={960} y={300} t={t - 30} text="50 KG" size={90} />
      <rect x={460} y={460} width={20 + 980 * 0.002} height={70} fill={SCH.live} opacity={clamp((t - 30) / 5)} />
      <rect x={460} y={580} width={20 + 980 * p} height={70} fill={POWER} />
      <SchLabel x={1000} y={760} t={t - 130} text="EVERY TINY PUSH: 500x TOO BIG" size={56} color={POWER} />
    </g>
  );
};

// ---------- S10: slow motion: fingertips only ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const reach = easeOut(clamp(t / (len * 0.8)));
  const me: Pose = { ...basePose, ...A, yaw: 0.3, expr: 'worried', armR: { a: lerp(20, 70, reach), b: lerp(-10, -50, reach) }, blink: idleBlink(t, 3), headTilt: 6 };
  return (
    <g transform={camT(A.x, 420, kf(t, [[0, 2.2], [len, 2.4]]))}>
      <KIT t={t + 400} id="s10" />
      <Hero look={YOU} pose={me} />
      <KitchenIsland />
      <rect x={A.x + 70} y={A.y + 10} width={26} height={44} rx={4} fill="#BFE0F0" stroke="#100E16" strokeWidth={3} opacity={0.9} />
      <text x={A.x - 160} y={A.y - 260} fontFamily={FONT.ui} fontSize={34} fill={POWER} opacity={0.8}>0.1x</text>
    </g>
  );
};

// ---------- S11: day ten: try to lift Dad's car again ----------
export const S11 = liftShot({
  Set: STREET, setT: 200, x: 960, y: HIP, two: true, faces: [[0, 'smug'], [60, 'worried']],
  lift: (t) => easeOut(clamp((t - 10) / 20)) * 0.35,
  thing: (h, t) => <ModernCar x={960} y={STREETM.feet + 40 - easeOut(clamp((t - 10) / 20)) * 30} s={1} color="#3A6AB8" />,
  behind: true,
  cam: [960, 520, 1.3, 960, 540, 1.4],
});

// ---------- S12: feet sinking into the lawn ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const sink = easeOut(clamp(t / 50));
  return (
    <g transform={camT(960, 760, kf(t, [[0, 2.6], [len, 2.8]]))}>
      <rect x={-400} y={-400} width={2800} height={1200} fill="#8AB0D8" />
      <Hero look={YOU} pose={at(960, { y: HIP + sink * 50, yaw: 0, expr: 'worried', armL: { a: 170, b: 0 }, armR: { a: 170, b: 0 } })} />
      <rect x={-400} y={STREETM.feet + 4} width={2800} height={700} fill="#4E8A3E" />
      <path d={`M 880 ${STREETM.feet + 4} q 80 -20 160 0`} stroke="#3A2A1A" strokeWidth={10} fill="none" />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={880 + i * 18} y={STREETM.feet - 10 - rnd2(i) * 30 * sink} width={10} height={14} fill="#5A3A20" />)}
    </g>
  );
};
const rnd2 = (i: number) => Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;

// ---------- S13: the weight goes down through two small trainers ----------
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="press" />
    <SchLabel x={960} y={160} t={t - 2} text="ALL THAT WEIGHT HAS TO GO SOMEWHERE" size={40} color={SCH.dim} />
    {[760, 1160].map((x, i) => (
      <g key={i} opacity={clamp((t - 10) / 6)}>
        <Arrow x0={x} y0={260} x1={x} y1={700} t={t - 14} />
        <path d={`M ${x - 80} 760 q 0 -50 60 -50 h 70 q 30 0 30 50 Z`} fill="none" stroke={SCH.line} strokeWidth={6} />
      </g>
    ))}
    <SchLabel x={960} y={880} t={t - 50} text="51 TONNES ON TWO TRAINERS" size={56} color={POWER} />
  </g>
);

// ---------- S14: the school letter ----------
export const S14 = propCU({ Bg: KIT, push: 0.06, draw: (t) => (
  <g transform={`rotate(-4 960 540)`}>
    <rect x={560} y={160} width={800} height={820} fill="#F6F2E8" stroke="#100E16" strokeWidth={6} />
    <text x={620} y={260} fontFamily={FONT.ui} fontSize={34} fill="#3A3A50">SCHOOL OFFICE</text>
    <text x={620} y={380} fontFamily={FONT.hand} fontWeight={700} fontSize={56} fill="#100E16">Please stay at home</text>
    <text x={620} y={460} fontFamily={FONT.hand} fontWeight={700} fontSize={56} fill="#100E16">until further notice.</text>
    {[560, 620, 680, 740].map((y) => <path key={y} d={`M 620 ${y} H 1300`} stroke="#C8C2B8" strokeWidth={6} />)}
    <g opacity={clamp((t - 30) / 6)} transform="translate(1180 860) rotate(-14)">
      <rect x={-130} y={-40} width={260} height={80} fill="none" stroke="#C83A3A" strokeWidth={8} />
      <text textAnchor="middle" y={18} fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#C83A3A">HOME</text>
    </g>
  </g>
) });

// ---------- S15: day eleven: you sneeze and grab the counter ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const sn = clamp((t - 48) / 6);
  const face = faceAt(t, [[0, 'tired'], [48, 'shock']]);
  const me: Pose = { ...basePose, ...A, yaw: 0.2, ...face, blink: t > 38 && t < 52 ? 1 : face.blink, tilt: lerp(-6, 14, sn), armR: { a: lerp(30, 60, sn), b: -40 }, headTilt: lerp(-10, 10, sn) };
  return (
    <g transform={camT(A.x, 420, kf(t, [[0, 2.0], [len, 2.1]]))}>
      <KIT t={t + 500} id="s15" />
      <Hero look={YOU} pose={me} />
      <KitchenIsland />
      {sn > 0 ? <text x={A.x + 80} y={A.y - 200} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" stroke="#100E16" strokeWidth={6} paintOrder="stroke" opacity={1 - clamp((t - 50) / 10)}>ACHOO!</text> : null}
    </g>
  );
};

// ---------- S16: crack ----------
export const S16 = propCU({ Bg: KIT, push: 0.02, draw: (t) => (
  <g transform={`translate(${t < 8 ? Math.sin(t * 4) * 10 : 0} 0)`}>
    <rect x={0} y={640} width={1920} height={500} fill="#D8D0C0" stroke="#100E16" strokeWidth={6} />
    <Cracks x={1000} y={660} s={2} p={easeOut(clamp(t / 6))} seed={8} />
    <BigHand x={1000} y={620} s={1.3} rot={10} />
    <g opacity={clamp(1 - Math.abs(t - 6) / 4)}><Glow x={1000} y={600} r={260} kind="red" o={0.8} /></g>
  </g>
) });

// ---------- S17: the X-ray: fracture, from your own grip ----------
export const S17 = propCU({ bgColor: '#0B0E16', push: 0.08, draw: (t) => (
  <g>
    <XRay x={960} y={640} s={1.05} crack={easeOut(clamp((t - 10) / 14))} />
    <g opacity={clamp((t - 30) / 6)}><text x={1400} y={300} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FF3A2A">FRACTURE</text></g>
  </g>
) });

// ---------- S18: the rule: muscles double, bones don't ----------
export const S18 = listCard({ title: 'REMEMBER THE RULE', items: [{ at: 30, text: 'MUSCLES  x2', ok: true, hot: true }, { at: 80, text: 'BONES', ok: false }] });

// ---------- S19: a doctor: what happens when muscles pull harder than bones can take ----------
export const S19 = talkShot({
  Set: HospitalRoom, setT: 100,
  cast: [{ look: DOC, x: 960, y: 700, yaw: 0.2, faces: [[0, 'neutral'], [80, 'worried']], pose: { armR: { a: 60, b: -60 } } }],
  cam: { from: [960, 500, 2.0], to: [960, 500, 2.15] },
});

// ---------- S20: the real cases: seizure, electric shock ----------
export const S20: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="seiz" />
    <SchLabel x={560} y={300} t={t - 4} text="STRONG SEIZURE" size={52} />
    <SchLabel x={1360} y={300} t={t - 50} text="ELECTRIC SHOCK" size={52} />
    <Arrow x0={560} y0={360} x1={860} y1={540} t={t - 110} />
    <Arrow x0={1360} y0={360} x1={1060} y1={540} t={t - 110} />
    <SchLabel x={960} y={640} t={t - 124} text="DISLOCATED SHOULDER" size={60} color={POWER} />
    <SchLabel x={960} y={730} t={t - 172} text="BROKEN BONE" size={60} color={POWER} />
    <g opacity={clamp((t - 200) / 6)} transform={`translate(960 880) scale(${backOut(clamp((t - 200) / 9))})`}>
      <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#0B0816" stroke={SCH.live} strokeWidth={3} />
      <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
    </g>
  </g>
);

// ---------- S21: 2,048 times harder ----------
export const S21 = factCard({ value: 2048, suffix: 'x', label: 'DAY 11: HOW HARD YOUR MUSCLES PULL', sub: '2^11 = 2,048', real: false });

// ---------- S22: the food: you, a mountain of plates ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(A.x, 440, kf(t, [[0, 2.0], [len, 2.15]]))}>
    <KIT t={t + 600} id="s22" />
    <Hero look={YOU} pose={{ ...basePose, ...A, yaw: 0, expr: 'tired', blink: idleBlink(t, 2), armR: { a: 60, b: -100 } }} />
    <KitchenIsland />
    {Array.from({ length: 9 }, (_, i) => <ellipse key={i} cx={A.x - 120 + (i % 3) * 8} cy={A.y + 20 - i * 12} rx={60} ry={12} fill="#F6F6F8" stroke="#100E16" strokeWidth={3} />)}
    {Array.from({ length: 7 }, (_, i) => <ellipse key={`b${i}`} cx={A.x + 130 - (i % 2) * 8} cy={A.y + 20 - i * 12} rx={56} ry={11} fill="#F6F6F8" stroke="#100E16" strokeWidth={3} />)}
  </g>
);

// ---------- S23: two months of food to lift the Titanic one metre ----------
export const S23 = factCard({ value: 61, suffix: ' DAYS', label: 'FOOD TO LIFT THE TITANIC ONE METRE', sub: '514 MJ = 122,900 KCAL, AT 2,000 KCAL A DAY', real: true });

// ---------- S24: the glass of water shatters in your hand ----------
export const S24 = propCU({ Bg: KIT, push: 0.05, draw: (t) => {
  const s = clamp((t - 60) / 6);
  return (
    <g>
      {s < 0.1 ? <path d="M 900 380 L 1020 380 L 1000 700 L 920 700 Z" fill="#BFE0F0" opacity={0.6} stroke="#100E16" strokeWidth={6} /> : null}
      {s > 0 ? Array.from({ length: 14 }, (_, i) => <path key={i} d={`M ${960 + Math.cos(i) * 220 * s} ${540 + Math.sin(i * 1.7) * 200 * s + s * s * 120} l 30 10 l -14 28 Z`} fill="#BFE0F0" stroke="#100E16" strokeWidth={3} />) : null}
      {s > 0 ? Array.from({ length: 20 }, (_, i) => <circle key={`w${i}`} cx={960 + Math.cos(i * 2.3) * 260 * s} cy={560 + Math.sin(i * 1.1) * 180 * s + s * s * 200} r={10} fill="#6AB8E8" opacity={0.8} />) : null}
      <BigHand x={960 + 80} y={560} s={1.0} flip rot={-80} />
    </g>
  );
} });

// ---------- S25: your sister runs for a hug; you step back ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const run = easeOut(clamp(t / 40));
  const sis: Pose = { ...basePose, ...stand(KITCHEN, lerp(0.2, 0.42, run), 0.45), yaw: 0.6, expr: 'happy', armL: { a: 100, b: -10 }, armR: { a: 100, b: -10 }, blink: idleBlink(t, 2) };
  const back = easeOut(clamp((t - 30) / 20));
  const me: Pose = { ...basePose, ...stand(KITCHEN, lerp(0.58, 0.7, back), 0.45), yaw: -0.4, expr: t > 30 ? 'worried' : 'neutral', armR: { a: lerp(10, 60, back), b: -60 }, armL: { a: lerp(10, 60, back), b: -60 }, blink: idleBlink(t, 5) };
  return (
    <g transform={camT(960, 470, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <KIT t={t + 700} id="s25" />
      <Hero look={ELLIE} pose={{ ...sis, scale: sis.scale * 0.72, y: sis.y + 378 * sis.scale * 0.28 }} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};
