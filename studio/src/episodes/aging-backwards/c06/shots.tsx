import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, FONT, Glow, LEG_LEN,
  Bedroom, bedSit, BedDuvet, factCard,
} from '../../../engine';
import { YOU, ELLIE, MOM, MO, faceCU, bigWord, Soft, relW, dayK, span, ELLIE_K, MOM_K } from '../common';
import { Rabbit, BlackCar } from '../sets';
import { StreetModern, STREETM, streetHip, Bike } from '../../electricity/sets';
import words from './words.json';

// Chapter 6, the choice: the last night at home. Ellie climbs into your bed and asks if you're going away. Stay (one
// more week, smaller, forgetting, then nobody knows) or go (maybe years, but no Ellie). Nine seconds of thinking, then
// "Go. Then when I'm big you'll still be my brother." Her rabbit (newborns sleep 14-17 hours a day). Five to
// midnight: the black car, mum, Mo trying not to cry, Ellie waving, your street sliding by. Midnight: six.

const W = words;
const rel = relW(W);
const P0 = '#100E16';
const K = dayK(8);
const NIGHT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} veil={0.65} clock="22:40" lamp={0.6} />;
const STN: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="night" power={1} car={false} />;
const ME = bedSit(0.2);
const EL = bedSit(0.3);

// ---------- S1: night, the bedroom: you sit up in bed, wide awake ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(880, 470, kf(t, [[0, 2.0], [len, 2.2]]))}>
    <NIGHT t={t} />
    <Hero look={YOU} pose={{ ...basePose, ...ME, scale: ME.scale * K, yaw: 0.4, expr: 'tired', blink: idleBlink(t, 3), look: 0.6, armL: { a: 20, b: -40 }, armR: { a: 20, b: -40 } }} />
    <BedDuvet from={0.13} knees={0.6} />
  </g>
);

// ---------- S2: the door opens a crack, Ellie pads in and climbs in next to you ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 30));
  return (
    <g transform={camT(880, 470, kf(t, [[0, 2.0], [len, 2.1]]))}>
      <NIGHT t={t + 60} />
      <Hero look={YOU} pose={{ ...basePose, ...ME, scale: ME.scale * K, yaw: 0.5, expr: 'happy', blink: idleBlink(t, 3), look: 0.7, armL: { a: 20, b: -40 }, armR: { a: 20, b: -40 } }} />
      <Hero look={ELLIE} pose={{ ...basePose, x: kf(k, [[0, EL.x + 160], [1, EL.x]]), y: kf(k, [[0, EL.y + 60], [1, EL.y]]), scale: EL.scale * ELLIE_K, yaw: -0.5, facing: -1, expr: 'neutral', blink: idleBlink(t, 6), armL: { a: 20, b: -40 }, armR: { a: 20, b: -40 } }} />
      <BedDuvet from={0.13} knees={0.6} />
    </g>
  );
};

// ---------- S3: close, you: a soft look; (that never happened) ----------
export const S3: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'happy'], [rel('Except', 'feels'), 'worried']], yaw: 0.35, zoom: [3.3, 3.5], light: { x: 1260, y: 480, kind: 'warm', o: 0.4 }, pose: { scale: K / 0.95 } });
  return (
    <g>
      <F {...p} />
      <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={6} fill="#F6EFE3" opacity={clamp((p.t - 4) / 6)}>(THAT NEVER HAPPENED)</text>
    </g>
  );
};

// ---------- S4: close, Ellie: "Are you going away?" ----------
export const S4 = faceCU({ look: ELLIE, Bg: NIGHT, faces: [[0, 'worried']], yaw: -0.35, zoom: [3.3, 3.5], talk: span(W, 'Are', 'away'), words: W, light: { x: 760, y: 480, kind: 'warm', o: 0.35 } });

// ---------- S5, S6: the choice as two columns: STAY and GO ----------
const Column: React.FC<{ t: number; x: number; title: string; color: string; rows: [string, number][]; on: number }> = ({ t, x, title, color, rows, on }) => (
  <g transform={`translate(${x} 0)`} opacity={0.35 + 0.65 * on}>
    <rect x={-400} y={140} width={800} height={800} rx={30} fill="#0B0816" stroke={color} strokeWidth={on ? 8 : 3} />
    <text y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill={color}>{title}</text>
    {rows.map(([s, a], i) => (
      <g key={s} opacity={on ? clamp((t - a) / 6) : 1} transform={`translate(0 ${400 + i * 130})`}>
        <text textAnchor="middle" fontFamily={FONT.ui} fontSize={46} fill="#F6EFE3">{s}</text>
      </g>
    ))}
  </g>
);
const STAY: [string, string][] = [['1 MORE WEEK', 'week'], ['SMALLER EVERY DAY', 'smaller'], ['FORGETTING MORE', 'forgetting'], ['THEN... ?', 'nobody']];
const GO: [string, string][] = [['MAYBE YEARS', 'years'], ['NO ELLIE', 'see'], ['NO BIRTHDAY', 'birthday'], ['MAYBE NOT EVER', 'ever']];
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#14101E" />
    <Column t={t} x={520} title="STAY" color="#FFD23A" rows={STAY.map(([s, c]) => [s, rel('If', c)])} on={1} />
    <Column t={t} x={1400} title="GO" color="#7FD4FF" rows={GO.map(([s]) => [s, 0])} on={0} />
  </g>
);
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.04], [len, 1.08]]))}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#14101E" />
    <Column t={t} x={520} title="STAY" color="#FFD23A" rows={STAY.map(([s]) => [s, 0])} on={0} />
    <Column t={t} x={1400} title="GO" color="#7FD4FF" rows={GO.map(([s, c]) => [s, rel('If', c, 2)])} on={1} />
  </g>
);

// ---------- S7: close, Ellie, thinking hard (eyes up), a timer counting nine seconds ----------
export const S7: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: ELLIE, Bg: NIGHT, faces: [[0, 'neutral'], [rel('Ellie', 'nine', 2) + 10, 'smug']], yaw: -0.2, eyes: 0, pose: { headTilt: 10, look: 0.5 }, zoom: [3.2, 3.4] });
  const sec = Math.min(9, Math.floor(p.t / 10));
  return (
    <g>
      <F {...p} />
      <g transform="translate(1600 220)">
        <circle r={110} fill="#0B0816" opacity={0.85} />
        <circle r={96} fill="none" stroke="#FFD23A" strokeWidth={10} strokeDasharray={`${(sec / 9) * 603} 603`} transform="rotate(-90)" />
        <text y={34} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#FFD23A">{sec}</text>
      </g>
      <text x={1600} y={390} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} letterSpacing={4} fill="#F6EFE3">SECONDS</text>
    </g>
  );
};

// ---------- S8: close, Ellie: "Go. If you go, then when I'm big, you'll still be my brother." ----------
export const S8 = faceCU({ look: ELLIE, Bg: NIGHT, faces: [[0, 'neutral'], [70, 'happy']], yaw: -0.35, zoom: [3.4, 3.7], talk: span(W, 'Go', 'brother', 2), words: W, light: { x: 760, y: 480, kind: 'warm', o: 0.45 } });

// ---------- S9: insert: Ellie's hands hold out her old stuffed rabbit ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 20));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.08]]))}>
      <Soft blur={16} dim={0.35}><g transform={camT(880, 470, 2.4)}><NIGHT t={t + 200} /></g></Soft>
      <Glow x={960} y={500} r={500} kind="warm" o={0.4} />
      <g transform={`translate(${1100 - k * 140} 600)`}>
        <Rabbit x={0} y={0} s={2.2} rot={-8 + k * 8} />
        <ellipse cx={-150} cy={180} rx={60} ry={44} fill="#26232F" stroke={P0} strokeWidth={6} />
        <ellipse cx={150} cy={180} rx={60} ry={44} fill="#26232F" stroke={P0} strokeWidth={6} />
        <path d="M 150 200 L 520 500 M -150 200 L 260 560" stroke="#3E8C86" strokeWidth={100} strokeLinecap="round" />
      </g>
    </g>
  );
};

// ---------- S10: close, Ellie: "He sleeps all day. Like babies." ----------
export const S10: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: ELLIE, Bg: NIGHT, faces: [[0, 'smug']], yaw: -0.35, zoom: [3.1, 3.3], talk: span(W, 'He', 'babies'), words: W, light: { x: 760, y: 480, kind: 'warm', o: 0.35 } });
  return (
    <g>
      <F {...p} />
      <Rabbit x={1440} y={760} s={1.6} rot={10} />
    </g>
  );
};

// ---------- S11: newborns sleep 14-17 hours a day ----------
export const S11 = factCard({ value: 17, label: 'HOURS A DAY A NEWBORN SLEEPS', sub: 'National Sleep Foundation, Sleep Health 2015', format: (v: number) => `14-${Math.round(v)}` });

// ---------- S12: close, you, holding the rabbit under your chin ----------
export const S12: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'worried'], [30, 'happy']], yaw: 0.25, zoom: [3.3, 3.5], light: { x: 1200, y: 480, kind: 'warm', o: 0.45 }, pose: { scale: K / 0.95 } });
  return (
    <g>
      <F {...p} />
      <Rabbit x={1180} y={1080} s={1.6} rot={-6} />
    </g>
  );
};

// ---------- S13: the street at night, five to midnight: a black car waiting by your house, lights off ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 1000], [len, 960]]), 600, kf(t, [[0, 1.25], [len, 1.32]]))}>
      <STN t={t} />
      <BlackCar x={1100} y={STREETM.kerb + 66} s={1.05} />
    </g>
    <g opacity={clamp(t / 8)}>
      <rect x={60} y={60} width={300} height={100} rx={16} fill="#0B0816" opacity={0.8} />
      <text x={210} y={130} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3">11:55</text>
    </g>
  </g>
);

// ---------- S14: you hug mum on the pavement, her chin on your head ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const km = MOM_K;
  return (
    <g transform={camT(980, 560, kf(t, [[0, 2.0], [len, 2.15]]))}>
      <STN t={t + 100} />
      <BlackCar x={1500} y={STREETM.kerb + 66} s={1.05} />
      <Hero look={MOM} pose={{ ...basePose, x: 1040, y: streetHip(km) + 30, scale: km, yaw: -0.5, facing: -1, tilt: -14, headTilt: -10, expr: 'tired', blink: 1, armL: { a: 70, b: 60 }, armR: { a: 50, b: 70 } }} />
      <Hero look={YOU} pose={{ ...basePose, x: 930, y: streetHip(K), scale: K, yaw: 0.6, expr: 'tired', blink: 1, armL: { a: 80, b: 40 }, armR: { a: 80, b: 40 } }} />
    </g>
  );
};

// ---------- S15: close, Mo: pretending not to cry, badly (a wobbling smile, a tear) ----------
export const S15: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: MO, Bg: STN, faces: [[0, 'happy'], [rel('Mo', 'bad') - 4, 'worried']], yaw: -0.3, zoom: [3.0, 3.2], pose: { headTilt: Math.sin(p.t / 2) * 3 } });
  const tear = (p.t % 30) / 30;
  return (
    <g>
      <F {...p} />
      <path d={`M 900 ${560 + tear * 160} q -14 24 0 34 q 14 -10 0 -34 Z`} fill="#9FD8FF" stroke={P0} strokeWidth={3} opacity={p.t > 10 ? 1 : 0} />
    </g>
  );
};

// ---------- S16: the house front at night: Ellie in the lit window, waving ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const wave = Math.sin(t / 3.5) * 30;
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1], [len, 1.08]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#2A3048" />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M -400 ${i * 90} L 2400 ${i * 90}`} stroke="#222840" strokeWidth={4} />)}
      <rect x={560} y={200} width={800} height={640} fill="#FFC870" stroke={P0} strokeWidth={14} />
      <Glow x={960} y={520} r={700} kind="warm" o={0.5} />
      <g>
        <defs><clipPath id="c6win"><rect x={560} y={200} width={800} height={640} /></clipPath></defs>
        <g clipPath="url(#c6win)">
          <rect x={560} y={200} width={800} height={640} fill="#E8A860" />
          <Hero look={ELLIE} pose={{ ...basePose, x: 960, y: 860, scale: 1.7, yaw: 0, expr: 'happy', blink: idleBlink(t, 3), armR: { a: 150 + wave, b: -20 }, armL: { a: 10, b: 0 } }} shadow={0} />
        </g>
      </g>
      <path d="M 960 200 L 960 840 M 560 520 L 1360 520" stroke="#F4EEE2" strokeWidth={18} />
      <rect x={520} y={840} width={880} height={30} fill="#F4EEE2" stroke={P0} strokeWidth={6} />
    </g>
  );
};

// ---------- S17: the back seat: you small against the big seat, the rabbit in your lap, the street sliding past the window ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const slide = t * 14;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.06]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#14141C" />
      {/* the window: the night street sliding by */}
      <defs><clipPath id="c6car"><path d="M 1000 200 L 1700 200 Q 1800 210 1820 400 L 1820 620 L 1000 620 Z" /></clipPath></defs>
      <g clipPath="url(#c6car)">
        <g transform={`translate(${-slide % 1920} 0)`}>
          <g transform={camT(960, 560, 1.2)}><STN t={t + 200} /></g>
          <g transform="translate(1920 0)"><g transform={camT(960, 560, 1.2)}><STN t={t + 200} /></g></g>
        </g>
      </g>
      <path d="M 1000 200 L 1700 200 Q 1800 210 1820 400 L 1820 620 L 1000 620 Z" fill="none" stroke="#2A2A34" strokeWidth={24} />
      {/* the seat */}
      <path d="M 300 360 Q 300 260 420 260 L 900 260 Q 980 260 980 360 L 980 1100 L 300 1100 Z" fill="#3A3640" stroke={P0} strokeWidth={8} />
      <rect x={260} y={760} width={1600} height={400} fill="#2E2A34" stroke={P0} strokeWidth={8} />
      <Hero look={YOU} pose={{ ...basePose, x: 640, y: 800, scale: 2.4 * dayK(9), yaw: 0.4, expr: 'worried', blink: idleBlink(t, 4), look: 0.8, legL: { a: 84, b: -60 }, legR: { a: 80, b: -60 }, armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 } }} />
      <Rabbit x={700} y={780} s={1.3} rot={6} />
    </g>
  );
};

// ---------- S18: through the car window: your house, the roof, Mo's bike lying on the lawn, sliding away ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 700], [len, 1300]], (v) => v), 600, 1.3)}>
      <STN t={t + 300} />
      <g transform={`translate(1100 ${STREETM.feet - 10}) rotate(-90) translate(0 0)`}>
        <Bike x={0} y={0} s={0.6} color="#3A8AE0" />
      </g>
    </g>
    {[['YOUR HOUSE', 'house'], ['THE ROOF', 'roof'], ["MO'S BIKE", 'bike']].map(([s, cue], i) => (
      <text key={s} x={960} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#F6EFE3"
        opacity={clamp((t - rel('house', cue)) / 5) * (1 - clamp((t - rel('house', ['roof', 'bike', 'Midnight'][i])) / 5))}>{s}</text>
    ))}
    <path d="M 0 0 L 1920 0 L 1920 1080 L 0 1080 Z M 160 140 L 1700 140 Q 1840 160 1860 420 L 1860 940 L 160 940 Z" fill="#14141C" fillRule="evenodd" />
  </g>
);

// ---------- S19: the dashboard clock: 00:00 ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0C12" />
    <rect x={560} y={380} width={800} height={320} rx={30} fill="#141820" stroke="#2A2E3A" strokeWidth={10} />
    <Glow x={960} y={540} r={500} kind="red" o={0.4} />
    <text x={960} y={610} textAnchor="middle" fontFamily={FONT.ui} fontSize={200} fill="#FF5A3A">00:00</text>
  </g>
);

// ---------- S20: close, you in the dark car: the shift runs through you (a pulse, a flinch) ----------
export const S20: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: YOU, Bg: ({ t }) => <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0C14" key={t} />, faces: [[0, 'shock']], yaw: 0.3, zoom: [4.3, 3.9], dark: 0.2, light: { x: 1260, y: 520, kind: 'red', o: 0.4 }, pose: { scale: dayK(9) / 0.95 } });
  const pulse = clamp(p.t / 14);
  return (
    <g>
      <F {...p} />
      {pulse < 1 ? <circle cx={960} cy={540} r={100 + pulse * 700} fill="none" stroke="#FFB15A" strokeWidth={20 * (1 - pulse)} opacity={1 - pulse} /> : null}
    </g>
  );
};

// ---------- S21: AGE 6 ----------
export const S21 = bigWord({ kicker: 'MIDNIGHT', word: 'AGE 6', color: '#FF5A3A', size: 280 });

void LEG_LEN; void backOut;
