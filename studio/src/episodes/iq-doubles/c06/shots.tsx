import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, Schematic, SchLabel, SCH,
  STUDY, stand, talkShot, rnd, FloatLabel, bedSit, BedDuvet, Bedroom, BEDROOM, AlarmClock, FocusRings, Desk,
} from '../../../engine';
import {
  YOU, ELLIE, SUIT, faceCU, bigWord, Soft, cues, span, live, Icon, iqCard, BED_NIGHT, STUDY_SET, Car, STREETM, Notebook, OpenNotebook, handAt,
} from '../common';
import { StreetModern } from '../../electricity/sets';
import words from './words.json';

// Chapter 6, the choice. 3:12 AM, head burning; at 3,200 you finally see the thing that's been changing your brain
// and how to switch it off. The catch: it resets you to 100, everything gone. Or keep going with the suit and maybe
// cure a disease or two. Ellie knocks, sits on the end of the bed in dinosaur pajamas: "Will you still be my
// brother?" The easiest question in the world. Six hours of notebooks; Ellie asleep at your feet; the man in the car
// checking his watch; 6:59, the last line; switch it off.

const W = words as any;
const { rel } = cues(words);
const RED = '#FF4A3A';
const NIGHT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="night" power={1} car={false} />;
const DINO = { ...ELLIE, jacket: '#5AA06A', jacketShade: '#47845A', accent: '#F2C94C' } as any;

/** The bed with you sitting up awake; optional Ellie on the end of it; a lamp-lit night. */
const BedScene: React.FC<{ t: number; me: Partial<Pose>; ellie?: Partial<Pose> | null; lamp?: number; faces?: [number, any][]; efaces?: [number, any][]; W?: any; f?: number; talkMe?: [number, number][]; talkEllie?: [number, number][] }> = ({ t, me, ellie, lamp = 1, faces = [[0, 'tired']], efaces = [[0, 'neutral']] }) => {
  const b = bedSit(0.12);
  return (
    <g>
      <Bedroom t={t + 300} duvet={false} clock="03:12" lamp={lamp} veil={0.62} />
      <Hero look={YOU} pose={live(t, { ...b, yaw: 0.3, ...me }, faces, 3)} shadow={0} />
      <BedDuvet />
      {ellie ? <Hero look={DINO} pose={live(t, { ...ellie }, efaces, 6)} shadow={0} /> : null}
    </g>
  );
};
const B = bedSit(0.12);
const FOOT = BEDROOM.P(0.3, 0.83, 0.42);
const ELLIE_SIT: Partial<Pose> = { x: FOOT.x, y: FOOT.y - 10, scale: B.scale * 0.92, yaw: -0.5, look: -0.8, legL: { a: 80, b: -80 }, legR: { a: 76, b: -76 } };

// ---------- S1: 3 AM, you sitting up in bed, eyes wide open, sweating, a red heat glow round your head ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, B.x + 200], [len, B.x + 140]]), B.y - 60, kf(t, [[0, 1.8], [len, 2.0]]))}>
    <BedScene t={t} me={{ tilt: -4, headTilt: Math.sin(t / 3) * 3 }} lamp={0} faces={[[0, 'worried']]} />
    <Glow x={B.x + 14} y={B.y - 170 * B.scale} r={170 + 10 * Math.sin(t / 4)} kind="red" o={0.7} />
  </g>
);

// ---------- S2: the schematic brain, the paths lighting until one small switch glows: THE SWITCH ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const off = rel('At', 'switch');
  const found = rel('At', 'see');
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.12]]))}>
        <Schematic t={t} id="c6s2" />
        <Icon name="brain" x={960} y={540} s={4} />
        {Array.from({ length: 18 }).map((_, i) => {
          const a = rnd(4, i) * Math.PI * 2, r = 80 + rnd(5, i) * 250;
          const x = 960 + Math.cos(a) * r, y = 540 + Math.sin(a) * r * 0.7;
          const on = clamp((t - i * 2) / 6);
          return <g key={i} opacity={on}><circle cx={x} cy={y} r={7} fill={SCH.live} /><path d={`M ${x} ${y} L 1060 600`} stroke={SCH.live} strokeWidth={2} opacity={0.4} /></g>;
        })}
        {t > found ? (
          <g transform={`translate(1060 600) scale(${backOut(clamp((t - found) / 8))})`}>
            <Glow x={0} y={0} r={120} o={0.9} />
            <rect x={-40} y={-24} width={80} height={48} rx={24} fill="#14223A" stroke="#FFD23A" strokeWidth={6} />
            <circle cx={t > off + 6 ? -16 : 16} cy={0} r={16} fill="#FFD23A" />
          </g>
        ) : null}
      </g>
      <SchLabel x={960} y={980} t={t - found - 6} text="THE SWITCH" size={52} color="#FFD23A" />
    </g>
  );
};

// ---------- S3: BUT ----------
export const S3 = bigWord({ kicker: 'BUT', word: "THERE'S A CATCH", color: RED, size: 170 });

// ---------- S4: the IQ rolls all the way back down: RESET: 100 ----------
export const S4 = iqCard({ kicker: 'IT RESETS YOU', iq: 100, from: 3200, Bg: BED_NIGHT, color: '#F6EFE3' });

// ---------- S5: everything you learned floating off and fading: JAPANESE, CHESS, THE PROOF, ... ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const items = ['日本語', 'CHESS', 'THE PROOF', 'WHY THE SKY IS BLUE', '412 PAGES OF HISTORY', '∫ x² e^(-x)'];
  const Inner = faceCU({ look: YOU, Bg: BED_NIGHT, faces: [[0, 'worried']], yaw: 0.1, zoom: [3.0, 3.2], dark: 0.3 });
  return (
    <g>
      <Inner t={t} len={len} f={t} />
      {items.map((w, i) => {
        const k = clamp((t - i * 6) / 50);
        const a = (i / items.length) * Math.PI * 2 + 0.4;
        return <text key={w} x={960 + Math.cos(a) * (360 + k * 300)} y={420 + Math.sin(a) * (200 + k * 140) - k * 80} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#FFE27A" opacity={(1 - k) * clamp((t - i * 6) / 4)}>{w}</text>;
      })}
      <text x={960} y={990} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - rel('Everything', 'gone')) / 6)}>GONE.</text>
    </g>
  );
};

// ---------- S6: the fork in the road on the schematic: SWITCH IT OFF / KEEP GOING ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 4) / 16));
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}><Schematic t={t} id="c6s6" /></g>
      <path d={`M 960 1000 L 960 700 L ${960 - 420 * k} ${700 - 300 * k} M 960 700 L ${960 + 420 * k} ${700 - 300 * k}`} stroke={SCH.line} strokeWidth={12} fill="none" />
      <circle cx={960} cy={1000} r={18} fill="#FFD23A" />
      <g opacity={clamp((t - 16) / 8)}>
        <text x={500} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={SCH.line}>SWITCH IT OFF</text>
        <text x={500} y={360} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim}>IQ 100. YOU.</text>
        <text x={1420} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={RED}>KEEP GOING</text>
        <text x={1420} y={360} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim}>THE LAB. CURES. DAY 8.</text>
      </g>
    </g>
  );
};

// ---------- S7: MILLIONS COULD LIVE: a field of people lighting up ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.05], [len, 1]]))}><Schematic t={t} id="c6s7" /></g>
    {Array.from({ length: 140 }).map((_, i) => {
      const x = 200 + (i % 20) * 80, y = 300 + Math.floor(i / 20) * 86;
      const lit = t > rnd(7, i) * 60 + 4;
      return (
        <g key={i} transform={`translate(${x} ${y})`} stroke={lit ? '#5AE09A' : SCH.dim} strokeWidth={4} fill="none">
          <circle cy={-18} r={10} />
          <path d="M 0 -8 L 0 14 M -12 2 L 12 2 M 0 14 L -8 30 M 0 14 L 8 30" />
        </g>
      );
    })}
    <SchLabel x={960} y={190} t={t - 2} text="MILLIONS COULD LIVE" size={52} color="#5AE09A" />
  </g>
);

// ---------- S8: close-up: all it would cost is you ----------
export const S8 = faceCU({ look: YOU, Bg: BED_NIGHT, faces: [[0, 'worried']], yaw: -0.15, zoom: [3.5, 3.8], dark: 0.3, light: { x: 1200, y: 600, kind: 'warm', o: 0.5 } });

// ---------- S9: Ellie at the door in dinosaur pajamas, then on the end of your bed: "Are you going away with that man?" ----------
export const S9: React.FC<ShotProps> = ({ t, len, f }) => {
  const sit = rel('Ellie', 'sits');
  const [a, b] = span(W, 'Are', 'man');
  const s = (f ?? 0) / 30;
  const talk = s >= a && s < b ? Math.abs(Math.sin(t / 2.3)) : 0;
  const door = BEDROOM.P(0.02, 1, 0.55);
  const e: Partial<Pose> = t < sit
    ? { x: door.x + 60, y: door.y - 170 * B.scale * 1.2, scale: B.scale * 1.1, yaw: 0.6, look: 0.6 }
    : { ...ELLIE_SIT, talk };
  return (
    <g transform={camT(kf(t, [[0, B.x + 120], [len, B.x + 160]]), B.y - 40, kf(t, [[0, 1.6], [len, 1.8]]))}>
      <BedScene t={t} me={{ tilt: -4, yaw: 0.1 }} ellie={e} lamp={1} faces={[[0, 'tired']]} efaces={[[0, 'worried']]} />
    </g>
  );
};

// ---------- S10: close-up, you: "I don't know." ----------
export const S10 = faceCU({ look: YOU, Bg: BED_NIGHT, words: W, talk: span(W, 'I', 'know'), faces: [[0, 'worried']], yaw: -0.35, zoom: [3.3, 3.5], light: { x: 1200, y: 600, kind: 'warm', o: 0.6 } });

// ---------- S11: close-up, Ellie: "Will you still be my brother? If you stop?" ----------
export const S11 = faceCU({ look: DINO, Bg: BED_NIGHT, words: W, talk: span(W, 'Will', 'stop'), faces: [[0, 'worried']], yaw: 0.35, zoom: [3.8, 4.0], glint: 1, light: { x: 800, y: 600, kind: 'warm', o: 0.6 } });

// ---------- S12: the two of you on the bed, the camera slowly pushing in; you smile at her ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, B.x + 140], [len, B.x + 130]]), B.y - 60, kf(t, [[0, 1.8], [len, 2.3]]))}>
    <BedScene t={t} me={{ tilt: -4, yaw: 0.4, look: 0.8 }} ellie={ELLIE_SIT} lamp={1} faces={[[0, 'worried'], [60, 'happy']]} efaces={[[0, 'worried'], [90, 'happy']]} />
  </g>
);

// ---------- S13: notebooks slamming down on the desk, one after another ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.4}><g transform={camT(960, 560, 1.8)}><STUDY_SET t={t + 300} /></g></Soft>
    {Array.from({ length: 6 }).map((_, i) => {
      const d = i * 7;
      const k = easeOut(clamp((t - d) / 5));
      return k > 0 ? <Notebook key={i} x={960 + Math.sin(i * 2.1) * 40} y={700 - i * 30 - (1 - k) * 500} w={420} rot={Math.sin(i * 1.3) * 10} i={i} /> : null;
    })}
  </g>
);

// ---------- S14: the desk lamp, you writing hard, the wall clock spinning through the hours ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const me = stand(STUDY, 0.5, 0.62);
  return (
    <g transform={camT(960, 600, 1.4)}>
      <STUDY_SET t={t + 400} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.45} />
      <Hero look={YOU} pose={live(t, { ...me, y: me.y + 40, yaw: 0, headTilt: 18, armR: { a: 50 + Math.sin(t * 1.8) * 8, b: 70 }, armL: { a: 40, b: 70 } }, [[0, 'neutral']], 3)} />
      <Desk x0={660} x1={1260} y={880} laptop={false} lamp />
      <Glow x={1180} y={760} r={420} kind="warm" o={0.6} />
      <g transform="translate(1500 380)">
        <circle r={60} fill="#F4EEE0" stroke="#100E16" strokeWidth={6} />
        <path d={`M 0 0 L ${Math.sin(t / 2) * 40} ${-Math.cos(t / 2) * 40} M 0 0 L ${Math.sin(t / 24) * 26} ${-Math.cos(t / 24) * 26}`} stroke="#100E16" strokeWidth={6} strokeLinecap="round" />
      </g>
      <text x={1500} y={490} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#F6EFE3">{`${1 + Math.floor(t / 8) % 6}:00 AM`}</text>
    </g>
  );
};

// ---------- S15: the notebook filling, labels popping: CURES, THE PROOF, CLEAN ENERGY ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const tags = [['CURES', rel('Cures', 'Cures')], ['THE PROOF', rel('Cures', 'proof')], ['CLEAN ENERGY', rel('Cures', 'Clean')]] as const;
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2232" />
      <Glow x={1500} y={200} r={700} kind="warm" o={0.4} />
      <OpenNotebook x={960} y={600} w={1300} fill={clamp(t / Math.max(1, len))} seed={Math.floor(t / 20)} />
      {tags.map(([w, at], i) => (t > at ? (
        <g key={w} transform={`translate(${520 + i * 440} ${200}) scale(${backOut(clamp((t - at) / 8))})`}>
          <rect x={-180} y={-46} width={360} height={80} rx={40} fill="#16131F" stroke="#FFD23A" strokeWidth={4} />
          <text y={12} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#FFD23A">{w}</text>
        </g>
      ) : null))}
    </g>
  );
};

// ---------- S16: Ellie asleep curled at the foot of the bed; you at the desk beyond, the lamp on ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, B.x + 160], [len, B.x + 180]]), B.y - 40, 1.7)}>
    <Bedroom t={t + 600} duvet clock="05:20" lamp={1} veil={0.62} />
    <Hero look={DINO} pose={{ ...basePose, ...ELLIE_SIT, x: FOOT.x - 20, y: FOOT.y - 4, tilt: -30, headTilt: 30, expr: 'tired', blink: 1, armL: { a: 60, b: 90 }, armR: { a: 60, b: 90 } } as Pose} shadow={0} />
    <text x={FOOT.x + 60} y={FOOT.y - 160 * B.scale - ((t / 2) % 30)} fontFamily={FONT.hand} fontSize={30} fill="#F6EFE3" opacity={0.7}>z</text>
  </g>
);

// ---------- S17: outside, night: the black car; the man in it glances up at your window, checks his watch ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const four = rel('Outside', 'four'), five = rel('Outside', 'five');
  const check = (t > four - 4 && t < four + 14) || (t > five - 4 && t < five + 14);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1240], [len, 1300]]), STREETM.kerb - 80, kf(t, [[0, 2.2], [len, 2.6]]))}>
        <NIGHT t={t + 900} />
        <Car x={1320} y={STREETM.kerb + 60} s={1} color="#17181F" />
        <clipPath id="c6win"><rect x={1196} y={STREETM.kerb - 124} width={150} height={66} /></clipPath>
        <g clipPath="url(#c6win)">
          <Hero look={SUIT} pose={{ ...basePose, x: 1260, y: STREETM.kerb - 20, scale: 0.42, yaw: -0.4, expr: 'neutral', blink: idleBlink(t, 3), look: check ? 0.6 : -0.6, headTilt: check ? 14 : -10, armR: check ? { a: 120, b: 100 } : { a: 10, b: 0 } }} shadow={0} />
        </g>
        <rect x={1060} y={STREETM.feet - 560} width={70} height={70} fill="#FFD27A" opacity={0.9} />
        <Glow x={1095} y={STREETM.feet - 525} r={120} kind="warm" o={0.6} />
      </g>
      <text x={1640} y={140} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill="#F6EFE3">{t > five ? '5:00 AM' : t > four ? '4:00 AM' : '3:40 AM'}</text>
    </g>
  );
};

// ---------- S18: insert, your hand shaking so hard on the pen, the writing wobbling ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const j = Math.sin(t * 3.1) * 6 + Math.sin(t * 5.3) * 3;
  return (
    <g>
      <rect width={1920} height={1080} fill="#F4EEE0" />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M 0 ${120 + i * 80} L 1920 ${120 + i * 80}`} stroke="#9AB4D6" strokeWidth={3} opacity={0.6} />)}
      <path d={`M 200 600 ${Array.from({ length: Math.floor(t * 2) }).map((_, k) => `L ${200 + k * 12} ${600 + Math.sin(k * 1.7) * 14 + (rnd(3, k) - 0.5) * 30}`).join(' ')}`} stroke="#2A2A5A" strokeWidth={6} fill="none" />
      <g transform={`translate(${Math.min(1500, 200 + t * 24) + j} ${560 + j * 0.6}) rotate(-30)`}>
        <rect x={-14} y={-300} width={28} height={300} rx={8} fill="#2E7DE0" stroke="#100E16" strokeWidth={5} />
        <path d="M -14 0 L 0 40 L 14 0 Z" fill="#E9D3AE" stroke="#100E16" strokeWidth={5} />
        <ellipse cx={30} cy={-150} rx={110} ry={90} fill="#26232F" stroke="#100E16" strokeWidth={7} />
        <path d="M 60 -220 Q 200 -300 400 -360 L 420 -260 Q 220 -200 110 -100 Z" fill="#F07A2A" stroke="#100E16" strokeWidth={7} />
      </g>
      <text x={1700} y={150} textAnchor="end" fontFamily={FONT.ui} fontSize={52} fill="#3A3446">6:30 AM</text>
    </g>
  );
};

// ---------- S19: the alarm clock at 06:59; the last line written ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.35}><g transform={camT(1150, 520, 2.2)}><BED_NIGHT t={t + 50} /></g></Soft>
    <g transform={`translate(960 640) scale(${kf(t, [[0, 2.8], [len, 3.3]])})`}>
      <AlarmClock x={0} y={0} s={1} text="06:59" />
    </g>
  </g>
);

// ---------- S20: then you switch it off: a click, a ring of light, white, then black ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const off = rel('Then', 'off', 3);
  const flash = t > off ? clamp(1 - (t - off) / 14) : 0;
  const Inner = faceCU({ look: YOU, Bg: BED_NIGHT, faces: [[0, 'neutral'], [off, 'tired']], yaw: 0, eyes: 0, zoom: [3.2, 3.6], dark: 0.3, light: { x: 960, y: 300, kind: 'red', o: 0.5 } });
  return (
    <g>
      <Inner t={t} len={len} f={t} />
      <FocusRings x={960} y={360} t={t - off} r0={60} color="#FFFFFF" />
      <rect width={1920} height={1080} fill="#FFFFFF" opacity={flash} />
      <rect width={1920} height={1080} fill="#000000" opacity={t > off + 10 ? clamp((t - off - 10) / 10) : 0} />
    </g>
  );
};
