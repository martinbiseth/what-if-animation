import React from 'react';
import {
  Museum, GlassRoom, RecordsRoom, PhoneCase, MapHolo, Vee, Citizen, Body, Big, PopWord, Soft, Glyphs,
  scene, standAt, faceCU, veeCU, span, YOU, MO7, ARCH, SIS, SIS_OLD, GROUND,
  camT, kf, clamp, backOut, easeOut, easeInOut, basePose, idleBlink, talkAt, FONT, Glow, Hero, ShotProps, Word, Pose,
} from '../common';
import words from './words.json';

// Chapter 6, the message: a sleepless night in the museum, a door marked Family records, a message from your little
// sister recorded in 2071 (an old woman with the same laugh), a trampoline photo, a dot on a map in the old city. In the
// morning the glass room is open; Mo Seven waits by the exit; Vee is not allowed to help, and the exit slides open anyway.
// You walk out. Behind you the woman in silver whispers into her sleeve: find them.

const W = words as Word[];
const MUSN: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Museum t={t} id={id} night={1} banner={false} />;
const MUS: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Museum t={t} id={id} cases={false} />;
const GR1: React.FC<{ t: number; id?: string }> = ({ t, id }) => <GlassRoom t={t} id={id} door={1} />;

const walkPose = (x: number, t: number, s: number, dir: 1 | -1, extra: Partial<Pose> = {}): Pose => {
  const ph = t * 0.32;
  return { ...standAt(x, s, GROUND, { yaw: 0.6 * dir }), legL: { a: 18 * Math.sin(ph), b: -10 }, legR: { a: -18 * Math.sin(ph), b: -10 }, armL: { a: 14 * Math.sin(ph), b: -10 }, armR: { a: -14 * Math.sin(ph), b: -10 }, facing: dir, ...extra };
};

// ---------------------------------------------------------------- S1: walking past your own phone at night
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 360], [len, 1560]]);
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 1100]]), 600, 1.3)}>
      <MUSN t={t + 100} />
      <PhoneCase x={960} y={GROUND - 20} s={1.0} on />
      <Glow x={960} y={GROUND - 260} r={260} kind="cool" o={0.35} />
      <Body look={YOU} pose={walkPose(x, t, 1.0, 1, { look: x > 760 && x < 1160 ? -0.4 : 0 })} t={t} faces={[[0, 'tired']]} shadow={1} />
      <Vee x={x - 170} y={GROUND - 330} s={0.55} t={t} mood="open" look={0.3} />
    </g>
  );
};

// ---------------------------------------------------------------- S2: a door marked Family records; Vee opens it
const RecDoor: React.FC<{ open: number }> = ({ open }) => (
  <g>
    <rect x={800} y={GROUND - 480} width={320} height={480} fill="#05070E" />
    <Glow x={960} y={GROUND - 240} r={260} kind="cool" o={0.7 * open} />
    <rect x={800 - open * 300} y={GROUND - 480} width={320} height={480} fill="#3A4660" stroke="#0B0816" strokeWidth={7} />
    <rect x={770} y={GROUND - 560} width={380} height={66} rx={10} fill="#0B0816" stroke="#4AE8FF" strokeWidth={4} />
    <text x={960} y={GROUND - 515} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} letterSpacing={4} fill="#8AF0FF">FAMILY RECORDS</text>
  </g>
);
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeInOut(clamp((t - 40) / 24));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Museum t={t + 160} night={1} cases={false} banner={false} />
      <RecDoor open={open} />
      <Body look={YOU} pose={standAt(560, 1.0, GROUND, { yaw: 0.5, look: open > 0.3 ? 0.2 : -0.2 })} t={t} faces={[[0, 'neutral'], [50, 'shock']]} shadow={1} />
      <Vee x={kf(t, [[0, 680], [30, 1180]])} y={GROUND - 300} s={0.6} t={t} mood={t > 30 ? 'scan' : 'open'} look={-0.4} />
      {t > 30 && t < 60 ? <path d={`M 1150 ${GROUND - 300} L 1110 ${GROUND - 260}`} stroke="#4AE8FF" strokeWidth={6} opacity={0.8} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- the screen inside the records room
const NameCard: React.FC<{ t: number }> = ({ t }) => {
  const type = 'ELLIE · BORN 2016'.slice(0, Math.max(0, Math.floor((t - 8) / 1.5)));
  return (
    <g>
      <rect x={570} y={220} width={300} height={380} rx={10} fill="#F2EEE4" stroke="#4AE8FF" strokeWidth={4} />
      <g transform="translate(720 300) scale(1)">
        <clipPath id="ph1"><rect x={-140} y={-70} width={280} height={360} /></clipPath>
        <g clipPath="url(#ph1)">
          <rect x={-140} y={-70} width={280} height={360} fill="#8AC8E8" />
          <Hero look={SIS} pose={{ ...basePose, x: 0, y: 330, scale: 0.9, yaw: 0, expr: 'happy', blink: 0 }} shadow={0} />
        </g>
      </g>
      <text x={940} y={300} fontFamily={FONT.ui} fontSize={36} fill="#8AF0FF">{type}</text>
      <text x={940} y={360} fontFamily={FONT.ui} fontSize={26} fill="#4AE8FF" opacity={clamp((t - 34) / 6)}>RELATION: SISTER</text>
      <Glyphs x={940} y={430} n={12} seed={41} size={24} />
      <Glyphs x={940} y={480} n={9} seed={42} size={24} />
    </g>
  );
};
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <RecordsRoom t={t + 100} on={clamp(t / 10)} screen={<NameCard t={t} />} />
    <Body look={YOU} pose={standAt(300, 1.05, GROUND + 60, { yaw: 0.5, look: -0.3 })} t={t} faces={[[0, 'neutral'], [30, 'shock']]} shadow={1} />
    <Vee x={1620} y={GROUND - 300} s={0.6} t={t} mood="open" look={-0.6} />
  </g>
);

// ---------------------------------------------------------------- S4: your face, lit by the screen
export const S4 = faceCU({
  look: YOU, Bg: (p) => <RecordsRoom {...p} screen={<NameCard t={60} />} />, faces: [[0, 'shock'], [24, 'worried']], yaw: 0.25, eyes: -0.2, zoom: [3.1, 3.4],
  light: { x: 1100, y: 500, kind: 'cool', o: 0.7 }, glint: 1, glintColor: '#8AF0FF',
});

// ---------------------------------------------------------------- S5: a message, recorded 2071
const Player: React.FC<{ t: number; play: number }> = ({ t, play }) => (
  <g>
    <rect x={540} y={200} width={840} height={460} rx={8} fill="#081420" />
    <circle cx={960} cy={410} r={80 * (1 - play)} fill="#4AE8FF" opacity={0.25} />
    <path d={`M 935 370 L 935 450 L 1005 410 Z`} fill="#8AF0FF" opacity={1 - play} />
    <rect x={580} y={612} width={760} height={10} rx={5} fill="#1E3A4A" />
    <rect x={580} y={612} width={760 * clamp(play * 0.1 + t * 0.0004)} height={10} rx={5} fill="#4AE8FF" />
    <text x={580} y={250} fontFamily={FONT.ui} fontSize={30} fill="#8AF0FF">MESSAGE · RECORDED 2071</text>
    <text x={1340} y={250} textAnchor="end" fontFamily={FONT.ui} fontSize={30} fill="#FFD23A">FOR: YOU</text>
  </g>
);
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 430, kf(t, [[0, 1.55], [len, 1.75]]))}>
    <RecordsRoom t={t + 140} screen={<Player t={t} play={0} />} />
    <g transform={`translate(960 ${300 - 30 * backOut(clamp((t - 30) / 10))})`} opacity={clamp((t - 30) / 6)}>
      <Big x={0} y={0} size={110} fill="#FFD23A">2071</Big>
    </g>
  </g>
);

// ---------------------------------------------------------------- S6–S8: your sister, old, on the screen
const SisScreen: React.FC<{ t: number; f: number; z: number; laugh?: boolean; talk?: [string, string, number?][]; lean?: number }> = ({ t, f, z, laugh, talk, lean = 0 }) => {
  const open = talk ? talkAt(W, f, 30, talk.map(([a, b, n]) => span(W, a, b, n ?? 1))) : laugh ? 0.5 + 0.5 * Math.abs(Math.sin(t / 3)) : 0;
  const pose: Pose = {
    ...basePose, x: 960, y: 700 + (laugh ? Math.sin(t / 3) * 6 : 0), scale: 1, yaw: 0.05, look: 0, headTilt: (laugh ? 6 : 0) + Math.sin(t / 30) * 2,
    expr: laugh ? 'happy' : 'neutral', blink: idleBlink(t, 11), talk: open,
  };
  return (
    <g>
      <rect x={510} y={170} width={900} height={520} fill="#E8D8C2" />
      <rect x={1150} y={220} width={200} height={260} rx={6} fill="#C8B49A" stroke="#7A6450" strokeWidth={6} />
      <path d="M 560 560 Q 620 420 700 560" fill="#6A9A5A" />
      <g transform={`translate(960 ${470}) scale(${1.7 * z * (1 + lean * 0.25)}) translate(-960 -600)`}>
        <Hero look={SIS_OLD} pose={pose} shadow={0} />
      </g>
      <rect x={510} y={170} width={900} height={520} fill="url(#scanl)" opacity={0.15} />
      <text x={540} y={660} fontFamily={FONT.ui} fontSize={22} fill="#FFFFFF" opacity={0.8}>● REC 2071</text>
    </g>
  );
};
const ScreenShot = (o: { cam: [number, number, number]; cam1: [number, number, number]; z: number; laugh?: boolean; talk?: [string, string, number?][]; lean?: (t: number) => number; extra?: (t: number, len: number) => React.ReactNode }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => (
    <g transform={camT(kf(t, [[0, o.cam[0]], [len, o.cam1[0]]]), kf(t, [[0, o.cam[1]], [len, o.cam1[1]]]), kf(t, [[0, o.cam[2]], [len, o.cam1[2]]]))}>
      <defs>
        <pattern id="scanl" width={4} height={6} patternUnits="userSpaceOnUse"><rect width={4} height={2} fill="#000" /></pattern>
        <clipPath id="scr"><rect x={510} y={170} width={900} height={520} rx={10} /></clipPath>
      </defs>
      <RecordsRoom t={t + 180} />
      <g clipPath="url(#scr)">
        <SisScreen t={t} f={f} z={o.z} laugh={o.laugh} talk={o.talk} lean={o.lean?.(t) ?? 0} />
      </g>
      {o.extra?.(t, len)}
    </g>
  );
  return Shot;
};
export const S6 = ScreenShot({
  cam: [960, 430, 1.4], cam1: [960, 430, 1.55], z: 0.85, laugh: true,
  extra: (t) => <PopWord t={t} at={20} x={1250} y={260} text="HA HA!" size={56} fill="#FFD23A" hold={60} rot={-6} />,
});
export const S7 = ScreenShot({ cam: [960, 400, 1.8], cam1: [960, 400, 1.95], z: 0.95, talk: [['If', 'up'], ["I'm", 'up#2']] });
export const S8 = ScreenShot({ cam: [960, 380, 1.8], cam1: [960, 360, 2.1], z: 1.0, talk: [['And', 'name']], lean: (t) => easeOut(clamp(t / 30)) });

// ---------------------------------------------------------------- S9: the trampoline photo
const Trampoline: React.FC<{ t: number }> = ({ t }) => {
  const b = Math.abs(Math.sin(t / 10));
  return (
    <g>
      <rect x={-300} y={-220} width={600} height={440} fill="#8AC8F0" />
      <circle cx={210} cy={-140} r={50} fill="#FFE07A" />
      <rect x={-300} y={110} width={600} height={110} fill="#6AB05A" />
      <ellipse cx={0} cy={120} rx={240} ry={34} fill="#2A2E3A" stroke="#0B0816" strokeWidth={6} />
      {[-200, -80, 80, 200].map((x) => <rect key={x} x={x - 5} y={124} width={10} height={70} fill="#3A3E4A" />)}
      <g transform={`translate(0 ${-10 * b})`}>
        <Hero look={YOU} pose={{ ...basePose, x: -90, y: 110, scale: 0.5, yaw: 0.3, expr: 'happy', blink: 0, armL: { a: 150, b: 0 }, armR: { a: 150, b: 0 } }} shadow={0} />
        <Hero look={SIS} pose={{ ...basePose, x: 100, y: 70, scale: 0.42, yaw: -0.3, expr: 'happy', blink: 0, armL: { a: 150, b: 0 }, armR: { a: 150, b: 0 } }} shadow={0} />
      </g>
    </g>
  );
};
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 18));
  return (
    <g>
      <Soft blur={16} dim={0.35}>
        <g transform={camT(960, 430, 1.6)}><RecordsRoom t={t + 220} /></g>
      </Soft>
      <g transform={`translate(960 ${560 + (1 - k) * 600}) rotate(${-6 + 4 * k}) scale(${kf(t, [[0, 1.05], [len, 1.15]])})`}>
        <rect x={-340} y={-260} width={680} height={560} rx={6} fill="#FBF6EA" stroke="#0B0816" strokeWidth={7} />
        <Trampoline t={t} />
        <text x={0} y={272} textAnchor="middle" fontFamily={FONT.hand} fontSize={38} fill="#3A3040">us. 2025. rematch!!</text>
        <path d="M -330 -250 L -250 -250 L -330 -170 Z" fill="#E8D8A0" opacity={0.6} />
      </g>
      <PopWord t={t} at={Math.min(60, len * 0.5)} x={1500} y={240} text="REMATCH." size={70} fill="#FFFFFF" hold={len} rot={5} />
    </g>
  );
};

// ---------------------------------------------------------------- S10: Vee's map, a dot in the old city
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1000, 460, kf(t, [[0, 1.2], [len, 1.35]]))}>
    <RecordsRoom t={t + 260} on={0.3} />
    <MapHolo x={1060} y={430} s={1.1} t={t} on={easeOut(clamp(t / 12))} />
    <path d={`M 700 ${GROUND - 300} L ${790} 430`} stroke="#4AE8FF" strokeWidth={4} opacity={0.4} />
    <Vee x={640} y={GROUND - 290} s={0.65} t={t} mood="scan" look={0.6} />
    <Body look={YOU} pose={standAt(360, 1.0, GROUND + 60, { yaw: 0.5, look: -0.4 })} t={t} faces={[[0, 'neutral'], [40, 'smug']]} shadow={1} />
  </g>
);

// ---------------------------------------------------------------- S11: morning, the woman by the open glass room
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.05], [len, 1.0]]))}>
    <GlassRoom t={t + 300} door={easeOut(clamp(t / 30))} />
    <Citizen look={ARCH} pose={standAt(1640 - 300, 1.0, GROUND + 50, { yaw: -0.5, armL: { a: 80, b: 0 } })} t={t} faces={[[0, 'happy']]} shadow={1} />
    {['FOOD', 'SAFETY', 'DOCTORS', 'FOREVER'].map((s, i) => (
      <PopWord key={s} t={t} at={40 + i * 22} x={620 + i * 230} y={120 + (i % 2) * 40} text={s} size={i === 3 ? 66 : 50} fill={i === 3 ? '#FFD23A' : '#FFFFFF'} hold={len} rot={(i % 2 ? 4 : -4)} />
    ))}
  </g>
);

// ---------------------------------------------------------------- the exit: a tall door at the end of the hall
const EX = 1300;
const Exit: React.FC<{ open: number }> = ({ open }) => (
  <g>
    <rect x={EX - 210} y={GROUND - 560} width={420} height={560} fill="#FFF6DA" />
    <Glow x={EX} y={GROUND - 280} r={420} kind="warm" o={0.9 * open} />
    <rect x={EX - 210 - open * 200} y={GROUND - 560} width={210} height={560} fill="#9AA6B4" stroke="#0B0816" strokeWidth={7} />
    <rect x={EX + open * 200} y={GROUND - 560} width={210} height={560} fill="#9AA6B4" stroke="#0B0816" strokeWidth={7} />
    <rect x={EX - 240} y={GROUND - 610} width={480} height={52} rx={8} fill="#2A3446" stroke="#0B0816" strokeWidth={6} />
    <text x={EX} y={GROUND - 572} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} letterSpacing={6} fill="#5BE08A">EXIT</text>
    <path d={`M ${EX - 210 * open} ${GROUND} L ${EX - 520 * open} ${GROUND + 200} L ${EX + 520 * open} ${GROUND + 200} L ${EX + 210 * open} ${GROUND} Z`} fill="#FFF0C0" opacity={0.25 * open} />
  </g>
);
const MUSX = (open: number): React.FC<{ t: number; id?: string }> => ({ t, id }) => (
  <g>
    <Museum t={t} id={id} cases={false} banner={false} />
    <Exit open={open} />
  </g>
);

export const S12 = scene({
  Set: MUSX(0), words: W, cam: [1200, 560, 1.6], cam1: [1240, 560, 1.75],
  cast: [{ look: MO7, x: 1000, yaw: 0.2, faces: [[0, 'neutral']], light: false, pose: (t) => ({ armL: { a: 20, b: -100 }, armR: { a: 20, b: -100 }, headTilt: Math.sin(t / 30) * 3 }) }],
  over: (t) => (
    <g>
      {['NO LIGHT', 'NO MONEY', 'NO PROMISES'].map((s, i) => <PopWord key={s} t={t} at={30 + i * 22} x={1500} y={300 + i * 110} text={s} size={52} fill={i === 2 ? '#FFD23A' : '#FFFFFF'} hold={300} rot={0} />)}
    </g>
  ),
});

export const S13 = veeCU({ Bg: MUS, mood: 'sad', words: W, talk: ['I', 'leave'], zoom: [2.6, 2.9], look: -0.4 });

export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeInOut(clamp((t - 20) / 40));
  return (
    <g transform={camT(EX, 560, kf(t, [[0, 1.5], [len, 1.4]]))}>
      <Museum t={t + 340} cases={false} banner={false} />
      <Exit open={open} />
      <Citizen look={MO7} pose={standAt(EX - 330, 1.0, GROUND, { yaw: 0.4, look: -0.3 })} t={t} faces={[[0, 'neutral'], [40, 'shock'], [70, 'happy']]} light={false} shadow={1} />
      <Vee x={EX + 380} y={GROUND - 330} s={0.6} t={t} mood={t > 30 ? 'happy' : 'sad'} look={-0.6} />
    </g>
  );
};

// ---------------------------------------------------------------- S15 / S16: you look at the glass room, then at Mo Seven
const LookCU = (look: number, Bg: React.FC<{ t: number; id?: string }>, faces: [number, 'neutral' | 'worried' | 'cool' | 'smug'][], yaw: number) =>
  faceCU({ look: YOU, Bg, faces, yaw, eyes: look, zoom: [3.3, 3.5] });
export const S15 = LookCU(-0.6, GR1, [[0, 'worried']], -0.3);
export const S16 = LookCU(0.6, MUSX(1), [[0, 'worried'], [20, 'cool']], 0.3);

// ---------------------------------------------------------------- S17: you walk out the door
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 820], [len, EX + 40]]);
  const into = clamp((x - (EX - 120)) / 160);
  return (
    <g transform={camT(kf(t, [[0, 1050], [len, EX]]), 560, kf(t, [[0, 1.2], [len, 1.4]]))}>
      <Museum t={t + 380} cases={false} banner={false} />
      <Exit open={1} />
      <g opacity={1 - into * 0.7}>
        <Body look={YOU} pose={walkPose(x, t, 1.0, 1)} t={t} faces={[[0, 'cool']]} shadow={1} />
      </g>
      <Citizen look={MO7} pose={walkPose(x - 180, t + 6, 1.0, 1)} t={t} faces={[[0, 'happy']]} light={false} shadow={1} />
      <Vee x={x + 140} y={GROUND - 340} s={0.55} t={t} mood="happy" look={0.6} />
      <rect x={-2000} y={-2000} width={6000} height={6000} fill="#FFF6DA" opacity={clamp((t - len + 14) / 14) * 0.8} />
    </g>
  );
};

const wS = (w: string) => W.find((x) => x.w.replace(/[^\w]/g, '') === w)?.s ?? 0;
const FIND_AT = Math.max(0, Math.round((wS('Find') - wS('Behind')) * 30));

// ---------------------------------------------------------------- S18: the woman in silver whispers into her sleeve
export const S18 = faceCU({
  look: ARCH, Bg: GR1, faces: [[0, 'neutral'], [30, 'smug']], yaw: -0.4, eyes: 0.4, zoom: [3.2, 3.6], dark: 0.25,
  words: W, talk: span(W, 'Find', 'them'), light: { x: 900, y: 520, kind: 'red', o: 0.6 },
  pose: { armR: { a: 150, b: -120 } },
  front: (t) => <PopWord t={t} at={FIND_AT} x={960} y={900} text="FIND THEM." size={110} fill="#FF5A4A" hold={400} rot={0} />,
});
