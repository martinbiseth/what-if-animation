import React from 'react';
import { Pose, ShotProps, Schematic, SCH, SchLabel, DrawOn, FONT, factCard, AlarmClock, ModernCar } from '../../../engine';
import words from './words.json';
import {
  YOU, SUIT, DOC, Hero, basePose, camT, clamp, kf, lerp, easeOut, backOut, idleBlink, faceAt, Glow, POWER,
  HospitalRoom, StreetSet, propCU, faceCU, talkShot, sdCard, thingCard, bigWord, Soft, XRay, span, liftLabel, at, STREETM,
} from '../common';

// Chapter 7, the cliffhanger: the hospital, the X-ray: your bones are thicker than yesterday. The rule just broke.
// What else is changing? Two black cars outside. 5:59, one minute to day fifteen. Then "is any of this real?" over
// the facts (the Titanic, muscles that break bones, the food, myostatin), the question for the comments, Part 2.

const DUSK = StreetSet('dusk', { car: false });
const CAST = '#F6F6F8';

export const S1 = sdCard({ kicker: 'CHAPTER 7', title: 'DAY FIFTEEN', tint: '#4A2A6A' });

// ---------- S2: hospital bed, arm in a cast ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 820, y: 640, yaw: 0.4, expr: 'tired', armR: { a: 60, b: -90 }, legL: { a: 85, b: -5 }, legR: { a: 85, b: -5 }, blink: idleBlink(t, 3), look: 0.5 };
  return (
    <g transform={camT(900, 560, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <HospitalRoom t={t} />
      <rect x={560} y={700} width={800} height={120} rx={20} fill="#E8EEF2" stroke="#8A9A9E" strokeWidth={6} />
      <rect x={560} y={820} width={30} height={200} fill="#8A9A9E" /><rect x={1330} y={820} width={30} height={200} fill="#8A9A9E" />
      <Hero look={YOU} pose={me} />
      <rect x={880} y={480} width={70} height={130} rx={30} fill={CAST} stroke="#100E16" strokeWidth={5} transform="rotate(-30 915 545)" />
      <rect x={620} y={690} width={720} height={80} rx={30} fill="#A8C4D8" />
    </g>
  );
};

// ---------- S3: the doctor holds the X-ray up to the light ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const doc: Pose = { ...basePose, x: 1300, y: 640, yaw: 0.3, expr: t > 60 ? 'worried' : 'neutral', armR: { a: 160, b: -10 }, armL: { a: 150, b: 20 }, blink: idleBlink(t, 2) };
  return (
    <g transform={camT(1300, 440, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <HospitalRoom t={t + 100} />
      <Hero look={DOC} pose={doc} />
      <XRay x={1440} y={330} s={0.32} />
    </g>
  );
};

// ---------- S4: thicker than yesterday ----------
export const S4 = propCU({ bgColor: '#0B0E16', push: 0.06, draw: (t) => (
  <g>
    <g transform="translate(-320 0)"><XRay x={960} y={640} s={0.85} label="DAY 11" /></g>
    <g transform="translate(320 0)"><XRay x={960} y={640} s={0.85} thick={easeOut(clamp((t - 30) / 40))} label="DAY 15" /></g>
    <text x={1280} y={140} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill={POWER} opacity={clamp((t - 60) / 6)}>THICKER</text>
  </g>
) });

// ---------- S5: the rule just broke ----------
export const S5: React.FC<ShotProps> = ({ t }) => {
  const x = clamp((t - 6) / 8);
  return (
    <g>
      <Schematic t={t} id="rule" />
      <SchLabel x={960} y={260} t={t} text="THE RULE" size={40} color={SCH.dim} />
      <text x={960} y={480} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3">BONES: NORMAL</text>
      <path d={`M 460 450 L ${460 + 1000 * x} ${450 - 20 * x}`} stroke="#FF3A2A" strokeWidth={20} strokeLinecap="round" />
      <g opacity={clamp((t - 40) / 6)} transform={`translate(960 700) scale(${backOut(clamp((t - 40) / 9))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill={POWER}>YOUR BODY IS CATCHING UP</text>
      </g>
    </g>
  );
};

// ---------- S6: "If your bones can change... what else is changing?" ----------
const docAsk = span(words, "'If", "changing?'");
export const S6 = faceCU({ look: DOC, Bg: HospitalRoom, faces: [[0, 'neutral'], [60, 'worried']], yaw: -0.3, words, talk: docAsk, zoom: [3.0, 3.3] });

// ---------- S7: outside the window: two black cars ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 560, 1.4)}>
      <DUSK t={t + 100} id="s7" />
      <ModernCar x={760} y={STREETM.feet + 60} s={1} dark lights={0.5} />
      <g opacity={clamp((t - 30) / 10)}><ModernCar x={1340} y={STREETM.feet + 60} s={1} dark lights={0.5} /></g>
    </g>
    <rect x={0} y={0} width={1920} height={1080} fill="none" stroke="#C9D6DA" strokeWidth={140} />
    <path d="M 960 0 V 1080" stroke="#C9D6DA" strokeWidth={30} />
  </g>
);

// ---------- S8: 5:59, one minute until your alarm ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.12]]))}>
    <Soft blur={16} dim={0.5}><HospitalRoom t={t + 200} /></Soft>
    <AlarmClock x={960} y={640} s={3.2} text="05:59" />
  </g>
);

// ---------- S9: day fifteen ----------
export const S9 = bigWord({ word: 'DAY 15', color: POWER, size: 240, sub: liftLabel(15) });

// ---------- S10: is any of this real? The doubling: the Titanic ----------
export const S10 = thingCard({ day: 20, thing: 'ship', label: 'IS ANY OF THIS REAL? 50 KG x 2^20 = THE TITANIC', real: true });

// ---------- S11: muscles really can break their own bones ----------
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="mb" />
    <XRay x={700} y={640} s={0.85} crack={easeOut(clamp((t - 10) / 14))} label="REAL CASES" />
    <SchLabel x={1360} y={440} t={t - 10} text="SEIZURES, ELECTRIC SHOCKS:" size={40} color={SCH.dim} />
    <SchLabel x={1360} y={540} t={t - 20} text="MUSCLES CAN BREAK" size={56} color={POWER} />
    <SchLabel x={1360} y={620} t={t - 26} text="THEIR OWN BONES" size={56} color={POWER} />
  </g>
);

// ---------- S12: a mountain of food ----------
export const S12 = factCard({ value: 61, suffix: ' DAYS', label: 'FOOD TO LIFT THE TITANIC ONE METRE', sub: 'AND THAT IS IF YOUR BODY WASTED NOTHING', real: true });

// ---------- S13: myostatin ----------
export const S13: React.FC<ShotProps> = ({ t }) => {
  const helix = (ph: number) => Array.from({ length: 40 }, (_, i) => `${i ? 'L' : 'M'} ${260 + i * 35} ${560 + Math.sin(i / 3 + ph + t / 20) * 120}`).join(' ');
  return (
    <g>
      <Schematic t={t} id="myo" />
      <DrawOn d={helix(0)} t={t - 2} dur={30} color={SCH.line} width={8} />
      <DrawOn d={helix(Math.PI)} t={t - 6} dur={30} color={SCH.live} width={8} />
      <SchLabel x={960} y={260} t={t - 20} text="SUPER-STRONG KIDS EXIST" size={52} color={POWER} />
      <g opacity={clamp((t - 60) / 6)}>
        <rect x={760} y={500} width={400} height={120} rx={16} fill="#0B0816" stroke={POWER} strokeWidth={4} />
        <text x={960} y={578} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={POWER}>MYOSTATIN</text>
      </g>
      <SchLabel x={960} y={850} t={t - 120} text="A RARE CHANGE LETS MUSCLES KEEP GROWING" size={40} />
    </g>
  );
};

// ---------- S14: a baby boy born with unusually huge muscles ----------
export const S14: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="nejm" />
    <SchLabel x={960} y={300} t={t - 2} text="NEW ENGLAND JOURNAL OF MEDICINE, 2004" size={40} color={SCH.dim} />
    <SchLabel x={960} y={480} t={t - 20} text="A BABY BOY BORN WITH" size={64} />
    <SchLabel x={960} y={580} t={t - 30} text="UNUSUALLY HUGE MUSCLES" size={64} color={POWER} />
    <SchLabel x={960} y={800} t={t - 120} text="JUST NOT DOUBLING EVERY DAY." size={48} />
  </g>
);

// ---------- S15: yet ----------
export const S15 = bigWord({ word: 'YET.', color: '#FF3A2A', size: 300 });

// ---------- S16: go with the man in the suit, or run? ----------
export const S16: React.FC<ShotProps> = ({ t }) => {
  const run = (t / 3) % (Math.PI * 2);
  return (
    <g>
      <rect width={960} height={1080} fill="#2A2A3A" />
      <rect x={960} width={960} height={1080} fill="#3A2A2A" />
      <g transform="translate(480 760) scale(1.6)"><Hero look={SUIT} pose={{ ...basePose, x: 0, y: 0, yaw: 0.3, expr: 'smug', armR: { a: 80, b: -20 }, blink: idleBlink(t, 2) }} shadow={0} /></g>
      <g transform="translate(1440 760) scale(1.6)"><Hero look={YOU} pose={{ ...basePose, x: 0, y: 0, yaw: 0.8, expr: 'worried', legL: { a: Math.sin(run) * 40, b: 20 }, legR: { a: -Math.sin(run) * 40, b: 20 }, armL: { a: -Math.sin(run) * 40, b: -60 }, armR: { a: Math.sin(run) * 40, b: -60 }, tilt: 10, blink: 0 }} shadow={0} /></g>
      <text x={480} y={170} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">GO WITH HIM?</text>
      <text x={1440} y={170} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill={POWER} stroke="#0B0816" strokeWidth={10} paintOrder="stroke">RUN?</text>
      <path d="M 960 0 V 1080" stroke="#F6EFE3" strokeWidth={10} />
      <g opacity={clamp((t - 70) / 8)}>
        <rect x={660} y={940} width={600} height={90} rx={45} fill="#0B0816" opacity={0.85} />
        <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">TELL ME IN THE COMMENTS 👇</text>
      </g>
    </g>
  );
};

// ---------- S17: Part 2 is coming ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 500, kf(t, [[0, 1], [len, 1.05]]))}>
      <DUSK t={t + 300} id="s17" />
      <Hero look={YOU} pose={at(960, { yaw: 0, expr: 'cool', blink: idleBlink(t, 3), glint: 1, glintColor: POWER })} />
    </g>
    <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.5} />
    <g transform={`translate(960 460) scale(${backOut(clamp((t - 2) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={170} fill="#F6EFE3" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">PART <tspan fill={POWER}>2</tspan></text>
    </g>
    <g opacity={clamp((t - 14) / 8)}>
      <rect x={760} y={600} width={400} height={96} rx={48} fill="#E8302A" />
      <text x={960} y={664} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#F6EFE3">SUBSCRIBE</text>
    </g>
  </g>
);
