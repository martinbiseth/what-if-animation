import React from 'react';
import {
  Hero, basePose, kf, camT, clamp, backOut, ShotProps, FONT, MONEY, Suburb, SUBURB, suburbHip, shake, LEG_LEN, lerp, walkPose, Football, Glow, DaySky,
  OfficeTable, officeHip, Office,
} from '../../../engine';
import words from './words.json';
import timeline from './timeline.json';
import { NewsVan } from '../kit';
import {
  YOU, SUIT, RECEP, MUM, ELLIE, respawn, billPhone, billCU, faceCU, talkShot, people, tumble, HospSet, StreetSet, cueIn, phoneCU, billCard, propCU, span, HHIP,
  MallSet, OfficeSet, Hero as H2,
} from '../common';
import { listCard } from '../../bank-balance/common';

// Chapter 5, someone notices: the hospital knows you by name; you try to be careful on Monday and fail (a football in
// PE); a news van follows you home. On Tuesday the man in the grey suit is waiting at the doors with your bill: he
// works for a company with a very big building, wants to know how you heal, and slides a contract across the table.

const W = words as { w: string; s: number; e: number; p: string }[];
const TL = timeline as { segments: { shot: string; a: number; t0: number }[] };
const cue = (shot: string, w: string, nth = 1, d = 10) => cueIn(TL, W, shot, w, nth, d);
const HOSP = HospSet();
const DAY = StreetSet('day');
const DUSK = StreetSet('dusk');
const SUIT_LINES: [number, number][] = [span(W, 'Fourteen', 'time'), span(W, 'Our', 'unit'), span(W, 'We', 'takes'), span(W, 'Then', 'yourself')];

// ---------- S1: chapter card ----------
export const S1 = billCard({ kicker: 'CHAPTER 5', title: 'SOMEONE NOTICES', tod: 'day' });

// ---------- S2: the receptionist just waves ----------
export const S2 = talkShot({
  Set: HOSP, words: W,
  cast: [
    { look: RECEP, x: 1230, y: HHIP, yaw: 0.5, faces: [[0, 'happy']], pose: { armR: { a: 160, b: -20 } } },
    { look: YOU, x: 1520, y: HHIP, yaw: -0.5, faces: [[0, 'oops']] },
  ],
  cam: { from: [1375, 560, 1.75], to: [1375, 560, 1.85] },
});

// ---------- S3: your pyjamas have their own hook ----------
export const S3 = propCU({
  bgColor: '#CFE0DA',
  draw: () => (
    <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#CFE0DA" />
      <rect x={560} y={260} width={800} height={40} rx={10} fill="#8A9A96" />
      <circle cx={960} cy={300} r={22} fill="#5A6A72" />
      <path d="M 820 320 L 1100 320 L 1160 700 L 1040 700 L 1000 520 L 960 900 L 820 900 L 800 520 L 760 700 L 660 700 Z" fill="#F07A2A" stroke="#100E16" strokeWidth={8} />
      <rect x={1180} y={320} width={260} height={90} rx={10} fill="#FBF8F0" stroke="#100E16" strokeWidth={5} transform="rotate(8 1310 365)" />
      <text x={1310} y={382} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#D82E2E" transform="rotate(8 1310 365)">RESERVED</text>
    </g>
  ),
});

// ---------- S4: Monday: careful, looking both ways twice ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const x = 500 + t * 2.2;
  const look = Math.sin(t / 10);
  return (
    <g transform={camT(x + 100, 560, 1.5)}>
      <DAY t={t} id="s4" />
      <Hero look={YOU} pose={{ ...walkPose(x, t * 0.25, SUBURB.feet, 1), yaw: look * 0.9, expr: 'worried' }} />
    </g>
  );
};

// ---------- S5: careful is hard after a weekend of not caring ----------
export const S5 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'worried'], [20, 'smug']], yaw: 0.3, zoom: [3.0, 3.2] });

// ---------- S6: a football to the face in PE ----------
const Field: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <DaySky id="fld" horizonY={520} tod="day" />
    <rect x={-400} y={520} width={2800} height={1000} fill="#5A9A4A" />
    {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={-400 + i * 360} y={520} width={180} height={1000} fill="#6AAA5A" />)}
    <path d="M 1500 520 L 1500 340 L 1900 340 L 1900 520" stroke="#F6EFE3" strokeWidth={12} fill="none" />
  </g>
);
export const S6: React.FC<ShotProps> = ({ t }) => {
  const k = clamp(t / 10);
  const hit = t >= 10;
  const sh = shake(t, 10, 10, 20);
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(900, 520, 1.6)}`}>
      <Field t={t} />
      <Hero look={YOU} pose={hit ? tumble(900 + (t - 10) * 6, 560 - LEG_LEN + 120 + (t - 10) * 4, -(t - 10) * 8, { expr: 'dizzy' }) : { ...basePose, x: 900, y: 660 - LEG_LEN, yaw: 0.6, expr: 'shock' }} />
      <Football x={hit ? 1000 + (t - 10) * 20 : lerp(1700, 960, k)} y={hit ? 380 - (t - 10) * 10 : lerp(300, 390, k)} r={34} rot={t * 20} />
    </g>
  );
};

// ---------- S7: the doors, then four thousand ----------
export const S7 = respawn({ appear: 2, faces: [[0, 'dizzy'], [14, 'tired']] });
export const S8 = billPhone({ v: 4000, time: '11:20', label: 'City General: football, face' });

// ---------- S9: a news van follows you home ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const x = 700 + t * 3;
  return (
    <g transform={camT(x - 50, 560, 1.15)}>
      <Suburb t={t} id="nv" tod="dusk" cars={false} />
      <Hero look={YOU} pose={{ ...walkPose(x, t * 0.3, SUBURB.feet, 1), expr: 'worried', yaw: 0.6 }} />
      <NewsVan x={x - 650} y={SUBURB.kerb + 70} s={0.8} />
    </g>
  );
};

// ---------- S10: Tuesday: a very small accident with an escalator ----------
export const S10: React.FC<ShotProps> = ({ t }) => {
  const k = clamp(t / 30);
  return (
    <g transform={camT(960, 560, 1.1)}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#D8CFC0" />
      <rect x={-400} y={820} width={2800} height={600} fill="#B8AE9E" />
      <path d="M 300 820 L 1300 220 L 1460 220 L 1460 260 L 380 900 Z" fill="#5A5E6A" stroke="#100E16" strokeWidth={6} />
      {Array.from({ length: 16 }).map((_, i) => {
        const p = ((i / 16 + t * 0.004) % 1);
        return <rect key={i} x={lerp(330, 1320, p)} y={lerp(810, 214, p)} width={70} height={12} fill="#8A8E9A" />;
      })}
      <path d="M 280 760 L 1290 150" stroke="#2A2A30" strokeWidth={20} strokeLinecap="round" />
      <text x={1000} y={120} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#5A5E6A">MALL · LEVEL 2</text>
      <Hero look={YOU} pose={tumble(lerp(1200, 500, k), lerp(330, 760, k) - 120, -k * 700, { expr: 'oops' })} />
    </g>
  );
};

// ---------- S11: back at the doors: someone is already waiting ----------
export const S11 = respawn({
  appear: 6, faces: [[0, 'oops'], [26, 'shock']], zoom: [1.5, 1.6], cx: 1370, x: 1520,
  others: [{ look: SUIT, pose: { x: 1230, y: HHIP, yaw: 0.5, armR: { a: 50, b: -100 } }, faces: [[0, 'smug']] }],
});

// ---------- S12: a man in a grey suit, holding a printout of your bill ----------
export const S12 = faceCU({
  look: SUIT, Bg: HOSP, faces: [[0, 'smug']], yaw: 0.3, zoom: [2.6, 2.8], pose: { armR: { a: 60, b: -110 } },
  extra: () => <g transform="translate(1040 640) rotate(-6)"><rect x={-60} y={-80} width={120} height={160} fill="#FBF8F0" stroke="#100E16" strokeWidth={4} />{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-46} y={-60 + i * 22} width={92} height={6} fill="#5A5666" />)}<rect x={-46} y={70} width={92} height={8} fill="#D82E2E" /></g>,
});

// ---------- S13: he knows Mum's name, he knows Ellie's school ----------
const Photo: React.FC<{ x: number; y: number; look: typeof MUM; label: string; rot: number; p: number }> = ({ x, y, look, label, rot, p }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${p})`}>
    <rect x={-200} y={-240} width={400} height={480} fill="#FBF8F0" stroke="#100E16" strokeWidth={6} />
    <rect x={-170} y={-210} width={340} height={340} fill="#A8C0D0" />
    <g transform="translate(0 260) scale(1.6)">
      <Hero look={look} pose={{ ...basePose, x: 0, y: 0, expr: 'neutral' }} shadow={0} />
    </g>
    <rect x={-200} y={140} width={400} height={100} fill="#FBF8F0" />
    <text x={0} y={205} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#1D2033">{label}</text>
  </g>
);
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2E38" />
    <rect x={260} y={140} width={1400} height={800} rx={12} fill="#E8DCC0" />
    <Photo x={700} y={540} look={MUM} label="MUM" rot={-6} p={backOut(clamp(t / 8))} />
    <Photo x={1220} y={540} look={ELLIE} label="ELLIE · YEAR 4" rot={5} p={backOut(clamp((t - cue('S13', 'He', 2, 30)) / 8))} />
  </g>
);

// ---------- S14: "Fourteen admissions in four days" ----------
export const S14 = talkShot({
  Set: HOSP, words: W,
  cast: [
    { look: SUIT, x: 1080, y: HHIP, yaw: 0.5, faces: [[0, 'smug']], talk: SUIT_LINES, gesture: true },
    { look: YOU, x: 1420, y: HHIP, yaw: -0.5, faces: [[0, 'worried']] },
  ],
  cam: { from: [1250, 560, 1.8], to: [1250, 560, 1.95] },
});

// ---------- S15: a company you've never heard of, a very big building ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 800], [len, 420]]), 0.85)}>
    <DaySky id="tw" horizonY={900} tod="day" />
    <rect x={640} y={-700} width={640} height={1700} fill="#5A7A9A" stroke="#100E16" strokeWidth={6} />
    {Array.from({ length: 30 }).map((_, r) => Array.from({ length: 6 }).map((_, c) => <rect key={`${r}-${c}`} x={670 + c * 100} y={-670 + r * 56} width={80} height={40} fill="#8AB4CC" opacity={0.85} />))}
    <g transform="translate(960 -760)">
      <rect x={-200} y={-70} width={400} height={140} rx={16} fill="#F6EFE3" />
      <path d="M -160 0 L -60 0 L -30 -50 L 10 50 L 40 -20 L 60 0 L 160 0" stroke="#D82E4A" strokeWidth={14} fill="none" strokeLinejoin="round" strokeLinecap="round" />
    </g>
    <rect x={-400} y={1000} width={2800} height={400} fill="#4A4850" />
  </g>
);

// ---------- S16: "Our scientists would like to understand how you heal" ----------
export const S16 = faceCU({ look: SUIT, Bg: HOSP, faces: [[0, 'smug'], [60, 'happy']], yaw: 0.3, zoom: [3.0, 3.2], words: W, talk: SUIT_LINES[1] });

// ---------- S17: no helicopter, no cast, no burn unit ----------
export const S17 = listCard({ title: 'A WORLD WITH NO', items: [
  { at: 2, text: 'HELICOPTERS', ok: false },
  { at: cue('S17', 'cast', 1, 20), text: 'CASTS', ok: false },
  { at: cue('S17', 'burn', 1, 40), text: 'BURN UNITS', ok: false },
] });

// ---------- S18: he slides a contract across the table ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 18);
  return (
    <g>
      <rect width={1920} height={1080} fill="#3A3E4A" />
      <rect x={-100} y={420} width={2120} height={800} fill="#5A3E2E" />
      <g transform={`translate(${lerp(1500, 960, k)} 680) rotate(${lerp(-20, -4, k)})`}>
        <rect x={-260} y={-320} width={520} height={640} fill="#FBF8F0" stroke="#100E16" strokeWidth={5} />
        <text x={0} y={-230} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#1D2033">CONTRACT</text>
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-210} y={-170 + i * 40} width={i % 3 === 2 ? 260 : 420} height={10} fill="#8A8478" />)}
        <path d="M -200 250 L 120 250" stroke="#1D2033" strokeWidth={4} />
        <text x={-200} y={290} fontFamily={FONT.ui} fontSize={28} fill="#7A7468">SIGN HERE</text>
      </g>
      <g transform={`translate(${lerp(1700, 1260, k)} 620)`}>
        <path d="M 0 0 L 400 -40 L 420 60 L 0 80 Z" fill="#6A707C" />
        <circle cx={-20} cy={40} r={50} fill="#26232F" />
      </g>
    </g>
  );
};

// ---------- S19: "We pay every bill. Every cent." ----------
export const S19 = billCU({
  lines: [
    { label: 'Saturday', v: 63320, at: -1 },
    { label: 'Sunday', v: 1509723, at: -1 },
    { label: 'Monday, Tuesday', v: 566957, at: -1 },
  ],
  total: 2140000, totalAt: 0, stamp: 'PAID', stampAt: cue('S19', 'gone', 1, 50),
});

// ---------- S20: "come with us, for as long as it takes" ----------
export const S20 = faceCU({ look: SUIT, Bg: HOSP, faces: [[0, 'neutral']], yaw: 0.25, zoom: [3.2, 3.4], words: W, talk: SUIT_LINES[2] });
// ---------- S21: "And if I say no?" ----------
export const S21 = faceCU({ look: YOU, Bg: HOSP, faces: [[0, 'worried']], yaw: -0.3, zoom: [3.2, 3.4], words: W, talk: span(W, 'And', 'no') });
// ---------- S22: "Then I'm sure you'll pay it yourself." ----------
export const S22 = faceCU({ look: SUIT, Bg: HOSP, faces: [[0, 'smug']], yaw: 0.3, zoom: [3.4, 3.7], words: W, talk: SUIT_LINES[3] });

// ---------- S23: the card: no name, a number, a heartbeat logo ----------
export const S23 = propCU({
  bgColor: '#2A2E38',
  draw: (t) => (
    <g transform={`translate(960 540) rotate(-5) scale(${backOut(clamp(t / 8))})`}>
      <rect x={-420} y={-240} width={840} height={480} rx={18} fill="#F6F8FA" stroke="#100E16" strokeWidth={6} />
      <path d="M -260 -40 L -110 -40 L -70 -120 L -10 60 L 40 -80 L 80 -40 L 260 -40" stroke="#D82E4A" strokeWidth={16} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <text x={0} y={140} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} letterSpacing={6} fill="#1D2033">+1 (555) 014-0000</text>
    </g>
  ),
});

// ---------- S24: you walk home at dusk ----------
export const S24: React.FC<ShotProps> = ({ t }) => {
  const x = 600 + t * 2.5;
  return (
    <g transform={camT(x, 520, 1.2)}>
      <DUSK t={t} id="wh" />
      <Hero look={YOU} pose={{ ...walkPose(x, t * 0.25, SUBURB.feet, 1), expr: 'worried', yaw: 0.6 }} />
    </g>
  );
};

// ---------- S25: the number ticks up, all by itself ----------
export const S25 = phoneCU({ mode: 'bank', Bg: DUSK, time: '7:02', text: '-$2,140,000.00|City General: amount due',
  textAt: [[0, '-$2,140,000.00|City General: amount due'], [20, '-$2,140,104.21|+ interest'], [40, '-$2,140,208.42|+ interest'], [60, '-$2,140,312.63|+ interest']], push: 0.1 });
