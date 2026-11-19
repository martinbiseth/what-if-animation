import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, lerp, ShotProps, FONT, MONEY, Schematic, SCH, Stairwell, SW, stepTop, shake, LEG_LEN, walkPose, SUBURB,
  KITCHEN, KitchenIsland, stand, joints, toWorld,
} from '../../../engine';
import words from './words.json';
import timeline from './timeline.json';
import { Hill, hillY, Hydrant, Trolley, HospitalBay, BAY } from '../kit';
import {
  YOU, MO, MUM, ELLIE, billCU, faceCU, talkShot, tumble, StreetSet, KitchenSet, BaySet, StairSet, cueIn, billCard, propCU, span, moneyFact, HeldPhone,
} from '../common';

// Chapter 6, the choice: Mum has a letter from the hospital (you're under eighteen, so the bill goes to your parent):
// rule three breaks. Medical debt is real for about twenty million American adults. Then Mo, who tried the trolley
// on his own: a cast, six weeks, no respawn, and his own bill. Ellie on the stairs with her piggy bank. You dial.

const W = words as { w: string; s: number; e: number; p: string }[];
const TL = timeline as { segments: { shot: string; a: number; t0: number }[] };
const cue = (shot: string, w: string, nth = 1, d = 10) => cueIn(TL, W, shot, w, nth, d);
const KITCH = KitchenSet(0.35);
const NIGHT = KitchenSet(0.7);
const DUSK = StreetSet('dusk');
const MU = stand(KITCHEN, 0.32, 0.4), ME = stand(KITCHEN, 0.7, 0.4);
const SLOPE = (Math.atan2(520, 2300) * 180) / Math.PI;

/** The hospital letter, white with a blue header: kicker lines in grey, one line in red. */
const Letter: React.FC<{ t: number; hot?: number }> = ({ t, hot = 0 }) => (
  <g>
    <rect x={-380} y={-460} width={760} height={920} fill="#FBF8F0" stroke="#100E16" strokeWidth={6} />
    <rect x={-380} y={-460} width={760} height={110} fill="#2E5A8A" />
    <text x={-340} y={-390} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFFFFF">CITY GENERAL HOSPITAL</text>
    <text x={-340} y={-290} fontFamily={FONT.ui} fontSize={30} fill="#5A5666">Billing department</text>
    {[0, 1, 2].map((i) => <rect key={i} x={-340} y={-230 + i * 40} width={i === 2 ? 380 : 680} height={10} fill="#B8B2A6" />)}
    <g opacity={clamp(hot)}>
      <rect x={-354} y={-80} width={708} height={170} fill="#FFE2DC" />
      <text x={-330} y={-20} fontFamily={FONT.ui} fontSize={34} fill="#B81E2E">Patient is under 18.</text>
      <text x={-330} y={40} fontFamily={FONT.ui} fontSize={34} fill="#B81E2E">Bill transferred to parent / guardian.</text>
    </g>
    {[0, 1, 2, 3].map((i) => <rect key={i} x={-340} y={150 + i * 40} width={i === 3 ? 300 : 680} height={10} fill="#B8B2A6" />)}
    <text x={-340} y={400} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#1D2033">AMOUNT DUE</text>
    <text x={340} y={400} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={MONEY.red}>$2,140,000</text>
  </g>
);

/** A plaster cast over the left forearm of a pose, white with a sling. */
const ArmCast: React.FC<{ pose: Pose }> = ({ pose }) => {
  const j = joints(pose).armL;
  const a = toWorld(pose, j.mid), b = toWorld(pose, j.end);
  return (
    <g>
      <path d={`M ${lerp(a.x, b.x, 0.1)} ${lerp(a.y, b.y, 0.1)} L ${b.x} ${b.y}`} stroke="#100E16" strokeWidth={34 * pose.scale} strokeLinecap="round" />
      <path d={`M ${lerp(a.x, b.x, 0.1)} ${lerp(a.y, b.y, 0.1)} L ${b.x} ${b.y}`} stroke="#F6F4EE" strokeWidth={26 * pose.scale} strokeLinecap="round" />
    </g>
  );
};

/** A phone held up close, drawn here so the screen can be a message from Mo or a dialler. */
const BigPhone: React.FC<{ t: number; children: React.ReactNode; buzz?: number }> = ({ t, children, buzz = 0 }) => {
  const bx = buzz > 0 ? Math.sin(t * 3) * 6 * buzz : 0;
  return (
    <g transform={`translate(${960 + bx} ${560 + Math.sin(t / 14) * 6}) rotate(-4) scale(1.25)`}>
      <path d="M 120 520 L 200 220 L 360 250 L 330 600 Z" fill="#F07A2A" stroke="#100E16" strokeWidth={6} />
      <rect x={-200} y={-400} width={400} height={800} rx={56} fill="#15131C" stroke="#100E16" strokeWidth={6} />
      <rect x={-180} y={-380} width={360} height={760} rx={40} fill="#101018" />
      {children}
      <ellipse cx={200} cy={180} rx={70} ry={50} fill="#26232F" />
    </g>
  );
};

// ---------- S1: chapter card ----------
export const S1 = billCard({ kicker: 'CHAPTER 6', title: 'THE CHOICE', tod: 'dusk' });

// ---------- S2: Mum at the kitchen table with an envelope from the hospital ----------
export const S2 = talkShot({
  Set: KITCH, words: W,
  cast: [
    { look: MUM, ...MU, yaw: 0.6, faces: [[0, 'worried']], talk: [span(W, 'It', 'parent')], pose: { armR: { a: 70, b: -90 }, armL: { a: 60, b: -90 } } },
    { look: YOU, ...ME, yaw: -0.4, faces: [[0, 'oops']] },
  ],
  cam: { from: [960, 560, 1.3], to: [960, 560, 1.42] },
  front: () => (
    <g>
      <KitchenIsland />
      <g transform={`translate(${MU.x + 120} ${MU.y - 40}) rotate(-8) scale(0.16)`}><Letter t={0} /></g>
    </g>
  ),
});

// ---------- S3: the letter: under eighteen, the bill goes to your parent ----------
export const S3 = propCU({
  Bg: KITCH, push: 0.08,
  draw: (t) => <g transform="translate(960 560) rotate(-3) scale(0.95)"><Letter t={t} hot={clamp((t - cue('S3', 'under', 1, 20)) / 8)} /></g>,
});

// ---------- S4: she puts the letter down; she doesn't shout ----------
export const S4 = faceCU({ look: MUM, Bg: KITCH, faces: [[0, 'worried'], [40, 'tired']], yaw: 0.3, zoom: [2.9, 3.1] });
// ---------- S5: that's worse ----------
export const S5 = faceCU({ look: YOU, Bg: KITCH, faces: [[0, 'oops'], [16, 'worried']], yaw: -0.3, zoom: [3.1, 3.3] });

// ---------- S6: rule three just broke ----------
export const S6: React.FC<ShotProps> = ({ t }) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  const br = clamp((t - cue('S6', 'broke', 1, 18)) / 6);
  const sh = br > 0 && br < 1 ? shake(t, cue('S6', 'broke', 1, 18), 10, 14) : { x: 0, y: 0 };
  return (
    <g transform={`translate(${sh.x} ${sh.y})`}>
      <Schematic t={t} id="r3b" />
      <g transform={`translate(960 380) scale(${pop(0)})`}>
        <rect x={-150} y={-60} width={300} height={84} rx={42} fill={MONEY.red} />
        <text y={2} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#FFFFFF">RULE 3</text>
      </g>
      <g transform={`translate(960 560) scale(${pop(2)})`}>
        <g transform={`translate(${-br * 30} ${br * 20}) rotate(${-br * 4})`}>
          <clipPath id="r3l"><rect x={-800} y={-200} width={800} height={300} /></clipPath>
          <text clipPath="url(#r3l)" textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">ONLY YOU PAY</text>
        </g>
        <g transform={`translate(${br * 30} ${-br * 10}) rotate(${br * 3})`}>
          <clipPath id="r3r"><rect x={0} y={-200} width={800} height={300} /></clipPath>
          <text clipPath="url(#r3r)" textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">ONLY YOU PAY</text>
        </g>
        {br > 0 ? <path d="M 0 -130 L -20 -60 L 18 -10 L -14 40 L 6 90" stroke={MONEY.red} strokeWidth={10} fill="none" opacity={br} /> : null}
      </g>
      <g transform={`translate(960 760) scale(${pop(cue('S6', 'her', 1, 120))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill={MONEY.red}>NOW MUM PAYS</text>
      </g>
    </g>
  );
};

// ---------- S7: two point one four million, pay within thirty days ----------
export const S7 = billCU({
  lines: [{ label: 'To: Mum', v: 2140000, at: 2 }],
  total: 2140000, totalAt: 10, stamp: 'DUE IN 30 DAYS', stampAt: cue('S7', 'thirty', 1, 70),
});

// ---------- S8: about twenty million American adults owe medical debt ----------
export const S8 = moneyFact({ value: 20000000, prefix: '', label: 'US ADULTS WITH MEDICAL DEBT', sub: 'not a game number', src: 'Peterson-KFF Health System Tracker, "The burden of medical debt in the United States"' });
// ---------- S9: at least two hundred and twenty billion dollars ----------
export const S9 = moneyFact({ value: 220, suffix: ' BILLION', label: 'WHAT THEY OWE, BETWEEN THEM', sub: 'at least', src: 'Peterson-KFF Health System Tracker (2024)', dur: 24, realAt: 40 });
// ---------- S10: Mum is about to become one of them ----------
export const S10 = faceCU({ look: MUM, Bg: KITCH, faces: [[0, 'tired']], yaw: 0.35, zoom: [3.0, 3.2] });

// ---------- S11: tonight she's on the phone to the bank ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const mum: Pose = { ...basePose, ...MU, yaw: 0.4, expr: 'worried', armR: { a: 150, b: -150 }, headTilt: 8 };
  return (
    <g transform={camT(MU.x + 150, MU.y - 80, kf(t, [[0, 1.7], [len, 1.85]]))}>
      <NIGHT t={t} id="k11" />
      <Hero look={MUM} pose={mum} />
      <HeldPhone pose={mum} t={t} mode="home" s={0.14} rot={-30} glow={1.4} />
      <KitchenIsland />
    </g>
  );
};

// ---------- S12: your phone buzzes: it's Mo ----------
export const S12 = propCU({
  bgColor: '#1A1420',
  draw: (t) => (
    <BigPhone t={t} buzz={t < 16 ? 1 : 0}>
      <text x={0} y={-300} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3">Mo</text>
      <g opacity={clamp((t - 4) / 6)}>
        <rect x={-160} y={-240} width={300} height={110} rx={30} fill="#2A2A36" />
        <text x={-136} y={-196} fontFamily={FONT.ui} fontSize={28} fill="#fff">in the ER</text>
        <text x={-136} y={-156} fontFamily={FONT.ui} fontSize={28} fill="#fff">tried the trolley</text>
      </g>
      <g opacity={clamp((t - cue('S12', 'emergency', 1, 30)) / 6)}>
        <rect x={-160} y={-110} width={220} height={70} rx={30} fill="#2A2A36" />
        <text x={-136} y={-64} fontFamily={FONT.ui} fontSize={28} fill="#fff">on my own</text>
      </g>
    </BigPhone>
  ),
});

// ---------- S13: Mo tries the trolley stunt on his own ----------
export const S13: React.FC<ShotProps> = ({ t }) => {
  const k = clamp(t / 50);
  const x = lerp(300, 1300, k * k);
  const g = hillY(x);
  return (
    <g transform={camT(x + 120, g - 240, 1.35)}>
      <Hill t={t + 300} />
      <Hydrant x={1780} y={hillY(1780) + 10} />
      <g transform={`rotate(${SLOPE} ${x} ${g})`}>
        <Trolley x={x} y={g} spin={t * 30 * k} />
        <Hero look={MO} pose={{ ...basePose, x: x + 10, y: g - 230, yaw: 0.6, expr: k > 0.5 ? 'shock' : 'happy', armL: { a: 150, b: -10 }, armR: { a: 160, b: -10 } }} />
      </g>
    </g>
  );
};

// ---------- S14: without your rules ----------
export const S14: React.FC<ShotProps> = ({ t }) => {
  const k = clamp(t / 6);
  const x = lerp(1600, 1740, k);
  const fly = clamp((t - 6) / 14);
  const sh = shake(t, 6, 14, 24);
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(1780, hillY(1780) - 220, 1.6)}`}>
      <Hill t={t + 360} spray={fly > 0 ? Math.min(1, fly * 2) : 0} />
      {fly <= 0 ? <Hydrant x={1780} y={hillY(1780) + 10} /> : null}
      <Trolley x={x} y={hillY(x)} rot={SLOPE + fly * 40} spin={t * 30} />
      <Hero look={MO} pose={fly > 0 ? tumble(1780 + fly * 260, hillY(1780) - 250 - Math.sin(fly * Math.PI) * 240, fly * 300, { expr: 'dizzy' }) : { ...basePose, x: x + 10, y: hillY(x) - 230, yaw: 0.6, expr: 'shock', armL: { a: 150, b: -10 }, armR: { a: 160, b: -10 } }} />
    </g>
  );
};

// ---------- S15: you run all the way there ----------
export const S15: React.FC<ShotProps> = ({ t }) => {
  const x = 500 + t * 7;
  return (
    <g transform={camT(x + 80, 520, 1.25)}>
      <DUSK t={t} id="run" />
      <Hero look={YOU} pose={{ ...walkPose(x, t * 0.55, SUBURB.feet, 1), expr: 'worried', yaw: 0.6, tilt: 8 }} />
    </g>
  );
};

// ---------- S16: Mo on a bed, his arm in a cast ----------
const moSit = (o: Partial<Pose> = {}): Pose => ({
  ...basePose, x: 760, y: 735, yaw: 0.45, expr: 'tired', legL: { a: 80, b: -80 }, legR: { a: 70, b: -70 }, armL: { a: 30, b: -95 }, armR: { a: 15, b: -10 }, ...o,
});
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const mo = moSit();
  return (
    <g transform={camT(980, 560, kf(t, [[0, 1.35], [len, 1.45]]))}>
      <HospitalBay t={t} />
      <Hero look={MO} pose={mo} />
      <ArmCast pose={mo} />
      <g transform="translate(1180 735) rotate(4)">
        <rect x={-60} y={-40} width={120} height={80} fill="#FBF8F0" stroke="#100E16" strokeWidth={4} />
        <rect x={-44} y={-22} width={88} height={6} fill="#8A8478" />
        <rect x={-44} y={-4} width={88} height={6} fill="#8A8478" />
        <rect x={-44} y={18} width={60} height={8} fill={MONEY.red} />
      </g>
    </g>
  );
};

// ---------- S17: he doesn't blink back healed ----------
export const S17: React.FC<ShotProps> = ({ t }) => {
  const pop = backOut(clamp((t - 4) / 9));
  return (
    <g>
      <g transform={camT(960, 560, 1.15)}>
        <g style={{ filter: 'blur(10px)' }} opacity={0.55}>
          <HospitalBay t={t} />
        </g>
      </g>
      <rect width={1920} height={1080} fill="#0B0816" opacity={0.45} />
      <g transform={`translate(960 520) scale(${pop})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={170} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">NO RESPAWN</text>
      </g>
      <text x={960} y={660} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#C8C2D0" opacity={clamp((t - 14) / 8)}>a broken arm takes about six weeks to heal</text>
    </g>
  );
};

// ---------- S18: six weeks of cast ahead of him ----------
export const S18 = faceCU({ look: MO, Bg: BaySet, faces: [[0, 'tired']], yaw: 0.3, zoom: [2.8, 3.0] });

// ---------- S19: his own bill: five thousand, eight hundred dollars ----------
export const S19 = billCU({
  Bg: BaySet,
  lines: [
    { label: 'Emergency room', v: 2350, at: 2 },
    { label: 'X-ray, forearm', v: 450, at: 8 },
    { label: 'Setting the bone, cast', v: 2600, at: 14 },
    { label: 'Follow-up visit', v: 400, at: 20 },
  ],
  total: 5800, totalAt: 26,
});

// ---------- S20: "It's fine. It's only six weeks." ----------
export const S20 = talkShot({
  Set: BaySet, words: W,
  cast: [
    { look: MO, x: 760, y: 735, yaw: 0.45, faces: [[0, 'happy']], talk: [span(W, "It's", 'weeks')], pose: { legL: { a: 80, b: -80 }, legR: { a: 70, b: -70 }, armL: { a: 30, b: -95 } } },
    { look: YOU, x: 1240, y: BAY.feet - LEG_LEN, yaw: -0.5, faces: [[0, 'worried']] },
  ],
  cam: { from: [1000, 560, 1.55], to: [1000, 560, 1.65] },
  front: () => <ArmCast pose={{ ...basePose, x: 760, y: 735, yaw: 0.45, armL: { a: 30, b: -95 } }} />,
});

// ---------- S21: but his hand shakes when he picks up the bill ----------
export const S21 = propCU({
  Bg: BaySet, push: 0.05,
  draw: (t) => {
    const s = Math.sin(t * 1.9) * 5 + Math.sin(t * 3.1) * 3;
    return (
      <g transform={`translate(${960 + s} ${560 + Math.cos(t * 2.3) * 3}) rotate(${-4 + s * 0.2})`}>
        <rect x={-300} y={-380} width={600} height={760} fill="#FBF8F0" stroke="#100E16" strokeWidth={6} />
        <text x={-260} y={-300} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#1D2033">CITY GENERAL HOSPITAL</text>
        <text x={-260} y={-250} fontFamily={FONT.ui} fontSize={28} fill="#5A5666">Patient: Mo</text>
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-260} y={-190 + i * 50} width={i % 2 ? 400 : 520} height={10} fill="#B8B2A6" />)}
        <text x={-260} y={250} fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#1D2033">TOTAL</text>
        <text x={260} y={250} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill={MONEY.red}>$5,800</text>
        <path d="M -380 300 Q -320 240 -250 280 L -240 420 L -380 420 Z" fill="#6B3E26" stroke="#100E16" strokeWidth={6} />
        <path d="M 380 300 Q 320 240 250 280 L 240 420 L 380 420 Z" fill="#6B3E26" stroke="#100E16" strokeWidth={6} />
      </g>
    );
  },
});

// ---------- S22: the game only works for you ----------
export const S22 = faceCU({ look: YOU, Bg: BaySet, faces: [[0, 'worried'], [40, 'tired']], yaw: -0.3, zoom: [3.1, 3.4] });

// ---------- S23: Ellie on the stairs with her piggy bank ----------
const Piggy: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={70} ry={52} fill="#F4A0B8" stroke="#100E16" strokeWidth={6} />
    <ellipse cx={66} cy={-6} rx={18} ry={22} fill="#F4A0B8" stroke="#100E16" strokeWidth={5} />
    <path d="M -30 -46 L -20 -70 L 0 -48" fill="#F4A0B8" stroke="#100E16" strokeWidth={5} />
    <rect x={-20} y={-54} width={40} height={8} rx={4} fill="#100E16" />
    <circle cx={34} cy={-14} r={6} fill="#100E16" />
    {[-40, 30].map((lx) => <rect key={lx} x={lx} y={40} width={16} height={22} fill="#F4A0B8" stroke="#100E16" strokeWidth={4} />)}
  </g>
);
const EX = SW.x0 + SW.w * 3 + SW.w / 2;
const ellie = (o: Partial<Pose> = {}): Pose => ({
  ...basePose, x: EX, y: stepTop(EX) - 8, scale: 0.72, yaw: -0.4, expr: 'worried', legL: { a: 80, b: -80 }, legR: { a: 75, b: -75 }, armL: { a: 40, b: -100 }, armR: { a: 40, b: -100 }, ...o,
});
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const e = ellie();
  return (
    <g transform={camT(EX + 60, stepTop(EX) - 120, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <Stairwell t={t + 120} id="s23" />
      <Hero look={ELLIE} pose={e} />
      <Piggy x={EX + 40} y={stepTop(EX) - 40} s={0.8} />
    </g>
  );
};

// ---------- S24: "Is it enough?" ----------
export const S24 = faceCU({
  look: ELLIE, Bg: StairSet, faces: [[0, 'worried']], yaw: -0.3, zoom: [3.0, 3.2], words: W, talk: span(W, 'Is', 'enough'),
  front: () => <Piggy x={1060} y={880} s={1.8} />,
});

// ---------- S25: you take out the card with the heartbeat line ----------
export const S25 = propCU({
  Bg: StairSet,
  draw: (t) => (
    <g transform={`translate(960 ${lerp(760, 540, backOut(clamp(t / 12)))}) rotate(-5)`}>
      <rect x={-420} y={-240} width={840} height={480} rx={18} fill="#F6F8FA" stroke="#100E16" strokeWidth={6} />
      <path d="M -260 -40 L -110 -40 L -70 -120 L -10 60 L 40 -80 L 80 -40 L 260 -40" stroke="#D82E4A" strokeWidth={16} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <text x={0} y={140} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} letterSpacing={6} fill="#1D2033">+1 (555) 014-0000</text>
      <path d="M 300 160 Q 380 120 460 200 L 520 400 L 340 420 Z" fill="#F07A2A" stroke="#100E16" strokeWidth={6} />
    </g>
  ),
});

// ---------- S26: and you dial the number ----------
const DIAL = '+1 (555) 014-0000';
export const S26 = propCU({
  bgColor: '#120E18', push: 0.12,
  draw: (t) => {
    const n = Math.min(DIAL.length, Math.floor(clamp((t - 2) / 20) * DIAL.length));
    const call = t > 26;
    return (
      <BigPhone t={t}>
        <text x={0} y={-250} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">{DIAL.slice(0, n)}</text>
        {call ? <text x={0} y={-190} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#8A8496">{`calling${'.'.repeat(1 + (Math.floor(t / 10) % 3))}`}</text> : null}
        {Array.from({ length: 12 }).map((_, i) => (
          <circle key={i} cx={-100 + (i % 3) * 100} cy={-90 + Math.floor(i / 3) * 100} r={38} fill={i === (n * 7) % 12 && !call ? '#5A5666' : '#2A2834'} />
        ))}
        <circle cx={0} cy={320} r={44} fill={call ? '#E04A4A' : '#3ACB6A'} />
      </BigPhone>
    );
  },
});
