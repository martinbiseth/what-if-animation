import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, FONT, stand, factCard, Glow, LOOKS } from '../../../engine';
import {
  YOU, ELLIE, SUIT, NURSE, Body, Soft, faceCU, bigWord, wordF, HeadBar, overHead, Pow, BAR, HospitalRoom, WARD, inBed, Sheet, Pillow, CityNight, PhoneFrame, LivingRoom, LIVING,
} from '../common';
import { Hospital } from '../../electricity/sets';
import words from './words.json';

// Chapter 7, cliffhanger: the hospital bed again, the nurse scared. Dark room, dark hospital, dark city, much longer
// than four seconds. Generators. The suit at the end of the bed: "It didn't come back. Not this time." A video from Mom:
// Ellie with a flashlight, waving, and over her head a faint green bar. Is any of this real? The facts. Would you have
// made the dive? Subscribe: next time, Ellie respawns.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const span = (a: string, b: string, n = 1, m = 1): [number, number] => [at(a, n) / 30 - 0.1, at(b, m) / 30 + 0.4];
const GOWN = { ...YOU, jacket: '#B8D4E8', jacketShade: '#98B4C8', accent: '#E9F2F8' };
const DARKWARD: React.FC<{ t: number; id?: string }> = ({ t, id }) => <HospitalRoom t={t} id={id} power={0} />;
const EMWARD: React.FC<{ t: number; id?: string }> = ({ t, id }) => <HospitalRoom t={t} id={id} power={0} emergency={1} />;

// ---------- S1: your eyes open in the hospital bed, again ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1100, 560, kf(t, [[0, 2.3], [len, 2.1]]))}>
    <HospitalRoom t={t + 20} night={true} power={0} />
    <Pillow />
    <Body look={GOWN} pose={inBed()} t={t} faces={[[0, 'tired'], [14, 'worried']]} />
    <Sheet />
  </g>
);

// ---------- S2: the nurse: not surprised, scared ----------
export const S2 = faceCU({ look: NURSE, Bg: DARKWARD, faces: [[0, 'neutral'], [30, 'worried']], yaw: 0.3, zoom: [3.0, 3.2], dark: 0.25, light: { x: 900, y: 500, kind: 'cool', o: 0.4 } });

// ---------- S3: the room is dark ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <HospitalRoom t={t + 60} power={0} />
    <Pillow />
    <Body look={GOWN} pose={{ ...basePose, ...(() => { const p = WARD.P(0.6, 0.72, 0.3); return { x: p.x, y: p.y + 20 }; })(), scale: 0.8, legL: { a: 85, b: -5 }, legR: { a: 80, b: -5 } } as Pose} t={t} faces={[[0, 'worried']]} />
    <Sheet />
    <Body look={NURSE} pose={{ ...basePose, ...stand(WARD, 0.22, 0.6), yaw: 0.5 }} t={t} faces={[[0, 'worried']]} shadow={1} />
  </g>
);

// ---------- S4: the whole hospital is dark ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
      <Hospital t={t + 30} />
    </g>
    <rect width={1920} height={1080} fill="#000" opacity={0.45} />
  </g>
);

// ---------- S5: out the window, the whole city ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.1], [len, 0.95]]))}>
    <CityNight t={t + 30} power={0} hospital={false} />
  </g>
);

// ---------- S6: much longer than four seconds: a timer running past ----------
export const S6: React.FC<ShotProps> = ({ t }) => {
  const secs = Math.round(4 + Math.pow(Math.max(0, t), 1.6) * 0.8);
  const mm = Math.floor(secs / 60), ss = secs % 60;
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#06050C" />
      <text x={960} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill="#F6EFE3" opacity={0.7}>BLACKOUT</text>
      <text x={960} y={600} textAnchor="middle" fontFamily={FONT.ui} fontSize={220} fill={BAR.r}>{`${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`}</text>
      <text x={960} y={720} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#7E8DA6" textDecoration="line-through" opacity={clamp(t / 10)}>EXPECTED: 4 S</text>
    </g>
  );
};

// ---------- S7: the generators kick in: a dim yellow light ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const on = t > 14 ? 1 : 0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.05], [len, 1.0]]))}>
      <HospitalRoom t={t + 90} power={0} emergency={on} />
      <Pillow />
      <Body look={GOWN} pose={inBed()} t={t} faces={[[0, 'worried']]} />
      <Sheet />
      {on ? <Glow x={960} y={200} r={500} kind="warm" o={0.35} /> : null}
      <Pow x={1500} y={300} t={t - 14} text="CLUNK" size={70} hold={20} color="#F6EFE3" rot={0} />
    </g>
  );
};

// ---------- S8: the man in the suit at the end of your bed ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const sp = stand(WARD, 0.3, 0.75);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 900]]), 520, kf(t, [[0, 1.2], [len, 1.35]]))}>
      <HospitalRoom t={t + 120} power={0} emergency={1} />
      <Pillow />
      <Body look={GOWN} pose={inBed()} t={t} faces={[[0, 'shock']]} />
      <Sheet />
      <Body look={SUIT} pose={{ ...basePose, ...sp, yaw: 0.4, look: 0.6 }} t={t} faces={[[0, 'neutral']]} seed={8} shadow={1} />
    </g>
  );
};

// ---------- S9: "It didn't come back. Not this time." ----------
export const S9: React.FC<ShotProps> = (p) => {
  const S = faceCU({ look: SUIT, Bg: EMWARD, faces: [[0, 'neutral'], [20, 'worried']], yaw: 0.3, words: W, talk: span('It', 'time', 1, 2), zoom: [3.2, 3.5], dark: 0.3, light: { x: 900, y: 400, kind: 'warm', o: 0.4 } });
  return <S {...p} />;
};

// ---------- S10: your phone buzzes: a video from Mom ----------
export const S10: React.FC<ShotProps> = ({ t }) => {
  const buzz = t < 20 ? Math.sin(t * 3) * 6 : 0;
  return (
    <g>
      <Soft blur={16} dim={0.5}>
        <EMWARD t={t + 150} />
      </Soft>
      <g transform={`translate(${960 + buzz} 560) rotate(-4)`}>
        <Glow x={0} y={0} r={420} kind="cool" o={0.5} />
        <rect x={-190} y={-380} width={380} height={760} rx={50} fill="#16141C" stroke="#3A3848" strokeWidth={8} />
        <rect x={-170} y={-350} width={340} height={700} rx={30} fill="#1C2A40" />
        <g transform={`translate(0 -200) scale(${backOut(clamp((t - 6) / 8))})`}>
          <rect x={-150} y={-60} width={300} height={130} rx={20} fill="#F6EFE3" />
          <text x={-124} y={-14} fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#16141C">MOM</text>
          <text x={-124} y={34} fontFamily={FONT.ui} fontSize={26} fill="#16141C">sent a video ▶</text>
        </g>
      </g>
    </g>
  );
};

// ---------- S11: the video: Ellie, safe at home, flashlight, waving; a faint green bar over her head ----------
const VidRoom: React.FC<{ t: number; faint: number; zoom?: number }> = ({ t, faint, zoom = 1.9 }) => {
  const s = { x: 960, y: 700, scale: 1 };
  const ellie: Pose = { ...basePose, x: s.x, y: s.y, scale: 0.9, yaw: 0, armR: { a: 150 + 20 * Math.sin(t / 4), b: -20 }, armL: { a: 70, b: -60 } };
  return (
    <g transform={camT(960, 520, zoom)}>
      <LivingRoom t={t + 40} power={0} veil={0.6} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#000" opacity={0.35} />
      <Glow x={880} y={600} r={260} kind="warm" o={0.8} />
      <Body look={ELLIE} pose={ellie} t={t} faces={[[0, 'happy']]} seed={5} />
      <g transform="translate(870 620) rotate(-30)">
        <rect x={-14} y={-50} width={28} height={70} rx={6} fill="#C8C8D0" stroke="#16141C" strokeWidth={4} />
      </g>
      <g opacity={faint * (0.45 + 0.25 * Math.sin(t / 5))}>
        <HeadBar x={960} y={700 - 300 * 0.9} s={0.7} p={1} t={t} />
      </g>
    </g>
  );
};
export const S11: React.FC<ShotProps> = ({ t, f }) => (
  <PhoneFrame t={t} rec={false} label="MOM · 0:12">
    <VidRoom t={t} faint={0} zoom={1.6} />
  </PhoneFrame>
);

// ---------- S12: and over her head: very faint, a little green bar ----------
export const S12: React.FC<ShotProps> = ({ t, len, f }) => {
  const fa = rel(f, t, 'faint');
  return (
    <PhoneFrame t={t} rec={false} label="MOM · 0:14">
      <VidRoom t={t + 60} faint={clamp((t - fa) / 14)} zoom={kf(t, [[0, 1.9], [len, 2.6]])} />
    </PhoneFrame>
  );
};

// ---------- S13: is any of this real? ----------
export const S13 = bigWord({ kicker: 'SO', word: 'IS ANY OF THIS REAL?', color: '#F6EFE3', size: 140 });

// ---------- S14-S16: the facts ----------
export const S14 = factCard({ value: 54, suffix: ' MPH', label: 'A TEN-STORY FALL ENDS AT', sub: 'v = √(2gh), 30 M' });
export const S15 = factCard({ value: 46, suffix: ' G', label: 'JOHN STAPP SURVIVED', sub: 'ROCKET SLED · 10 DECEMBER 1954' });
export const S16 = factCard({ value: 6, suffix: ' CAR LENGTHS', label: 'A CAR AT 30 MPH NEEDS', sub: '23 M (75 FT) · UK HIGHWAY CODE' });

// ---------- S17: you, in the dark: would you have made the dive? ----------
export const S17 = faceCU({ look: GOWN, Bg: EMWARD, faces: [[0, 'worried'], [30, 'neutral']], yaw: 0.2, eyes: 0, zoom: [3.0, 3.3], dark: 0.2, light: { x: 900, y: 450, kind: 'warm', o: 0.35 } });

// ---------- S18: the end card: subscribe; next time, Ellie respawns ----------
export const S18: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />
    <g transform={`translate(960 330) scale(${backOut(clamp((t - 4) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill="#F6EFE3">NEXT TIME</text>
      <text y={130} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill={BAR.g} stroke="#0B0816" strokeWidth={12} paintOrder="stroke">ELLIE RESPAWNS</text>
    </g>
    <g transform={`translate(960 760) scale(${backOut(clamp((t - 16) / 9))})`}>
      <rect x={-240} y={-60} width={480} height={120} rx={60} fill="#E8252A" />
      <text y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFFFFF">SUBSCRIBE</text>
    </g>
    <text x={960} y={920} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#7E8DA6" opacity={clamp((t - 24) / 8)}>GTA IN REAL LIFE · THE SERIES</text>
  </g>
);
