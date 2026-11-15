import React from 'react';
import {
  Hero, Pose, ShotProps, basePose, camT, kf, clamp, idleBlink, Classroom, Bedroom, BEDROOM, stand, Schematic, SCH, SchLabel, Glow, FONT,
  Smartphone, Moon, talkAt, backOut,
} from '../../../engine';
import { YOU, MO, ELLIE, MOM, MODAD, SCI, faceCU, bigWord, span, Handheld } from '../common';
import { FadeStreet, SkyUp, Lab, LightDot, Bus, STREETM } from '../sets';
import { Barbecue } from '../../electricity/sets';
import { streetShot, withHud, Stopwatch, Caption, onStreet } from '../kit';
import words from './words.json';

// Chapter 3, the fun part: hour one, nobody notices but one scientist; hour three, every online game lags; then the
// Sun dims at eleven in the morning on a cloudless day, school sends everyone home, the street throws a darkness
// party, a call to Grandma takes a minute each way, and by evening Mo asks where the Moon went.

const W = words;
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <FadeStreet t={t} id={id} sun={1} />;
const DIM: React.FC<{ t: number; id?: string }> = ({ t, id }) => <FadeStreet t={t} id={id} sun={0.25} />;
const DARK: React.FC<{ t: number; id?: string }> = ({ t, id }) => <FadeStreet t={t} id={id} sun={0} />;
const MOROOM: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} clock="10:00" />;

// ---------- S1: HOUR 1 ----------
export const S1 = bigWord({ kicker: 'HOUR 1 · 8:00 AM', word: 'HALF AS FAST', color: '#FFD23A', Bg: DAY, size: 170 });

// ---------- S2: the classroom: the teacher's red laser dot dancing on the board ----------
export const S2 = withHud(((p: ShotProps) => (
  <g transform={camT(900, 470, kf(p.t, [[0, 1.0], [p.len, 1.06]]))}>
    <Classroom t={p.t + 40} />
    <circle cx={880 + Math.sin(p.t / 6) * 120} cy={300 + Math.cos(p.t / 5) * 40} r={9} fill="#FF2A2A" />
    <Glow x={880 + Math.sin(p.t / 6) * 120} y={300 + Math.cos(p.t / 5) * 40} r={40} kind="red" o={0.8} />
  </g>
)) as React.FC<ShotProps>, 1, '8:30 AM');

// ---------- S3: the bus pulls in, late as always; you check your watch-less wrist ----------
export const S3 = streetShot({
  sun: 1, cam: { from: [960, 540, 1.0], to: [960, 540, 1.04] },
  cast: [{ look: YOU, x: 300, scale: 0.85, yaw: 0.5, faces: [[0, 'tired']], pose: () => ({ armL: { a: -60, b: -100 } }) }],
  front: (t, len) => <Bus x={kf(t, [[0, 2400], [len * 0.8, 1100]])} y={STREETM.kerb + 120} s={0.9} spin={-t * 6} />,
});

// ---------- S4: the lab, wide: the laser line, the screen with its number ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1100]]), 520, 1.05)}>
    <Lab t={t} reading="149,896 km/s" alarm={1} />
  </g>
);

// ---------- S5: the scientist at the screen, leaning in, checking again ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const sci: Pose = { ...basePose, x: 1260, y: 640, scale: 0.95, yaw: 0.6, expr: t > 30 ? 'shock' : 'worried', blink: idleBlink(t, 3), look: 0.5, tilt: 8, armR: { a: 70 + Math.sin(t / 4) * 10, b: -60 } };
  return (
    <g transform={camT(kf(t, [[0, 1400], [len, 1440]]), 520, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Lab t={t + 30} reading={t % 40 < 20 ? '149,896 km/s' : '149,895 km/s'} alarm={1} />
      <Hero look={SCI} pose={sci} />
    </g>
  );
};

// ---------- S6: close, the scientist on the phone: either my equipment is broken, or the universe is ----------
export const S6 = faceCU({
  look: SCI, Bg: ({ t, id }) => <Lab t={t} id={id} reading="149,896 km/s" alarm={1} />, faces: [[0, 'worried']], yaw: 0.3, zoom: [3.1, 3.25],
  words: W, talk: span(W, "'Either", 'is', 1), pose: { armR: { a: 150, b: 140 } }, light: { x: 1200, y: 450, kind: 'cool', o: 0.5 },
});

// ---------- S7: HOUR 3 ----------
export const S7 = bigWord({ kicker: 'HOUR 3 · 10:00 AM', word: 'LAG', color: '#FF5A5A', Bg: DAY, size: 260 });

// ---------- S8: the game on a console, freezing and stuttering ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#0C0A16" />
    <g transform={`translate(960 560) scale(${kf(t, [[0, 1.15], [len, 1.25]])}) translate(-960 -560)`}>
      <Handheld x={960} y={560} s={1.25} t={Math.floor(t / 9) * 9} on={1} glitch={Math.floor(t / 7) % 2} />
    </g>
    {Math.floor(t / 7) % 2 ? <text x={960} y={250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FF5A5A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">LAG 999 ms</text> : null}
  </g>
);

// ---------- S9: under the ocean: a glass cable on the sea floor, light pulses inside it, slowing ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const sp = kf(t, [[0, 1], [len, 0.25]]);
  return (
    <g>
      <defs>
        <linearGradient id="sea" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#1A4A7A" /><stop offset="100%" stopColor="#081A2E" /></linearGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#sea)" />
      <path d="M -10 820 Q 400 780 800 830 T 1930 810 L 1930 1090 L -10 1090 Z" fill="#2A2A30" />
      <path d="M -10 760 Q 500 700 960 760 T 1930 740" stroke="#4A5A6A" strokeWidth={26} fill="none" />
      {Array.from({ length: 8 }).map((_, i) => {
        const p = ((i / 8 + t * 0.01 * sp) % 1);
        const x = p * 1940 - 10;
        const y = 760 + Math.sin((x / 1940) * Math.PI * 2) * -30;
        return <g key={i}><circle cx={x} cy={y} r={9} fill="#FFD23A" /><Glow x={x} y={y} r={50} kind="warm" o={0.7} /></g>;
      })}
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">THE INTERNET RIDES ON LIGHT</text>
    </g>
  );
};

// ---------- S10: Mo in his bedroom, cross-legged on the bed, his phone flying ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const A = stand(BEDROOM, 0.45, 0.5);
  const thr = 30;
  const mo: Pose = { ...basePose, ...A, yaw: 0.2, expr: t > thr ? 'shock' : 'cool', blink: idleBlink(t, 3), armR: t > thr ? { a: 160, b: 10 } : { a: 40, b: -110 }, armL: { a: 40, b: -110 } };
  const px = t > thr ? A.x + (t - thr) * 22 : A.x + 40;
  const py = t > thr ? A.y - 120 - (t - thr) * 8 + (t - thr) * (t - thr) * 0.6 : A.y - 60;
  return (
    <g transform={camT(940, 500, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <MOROOM t={t + 60} />
      <Hero look={MO} pose={mo} />
      <Smartphone x={px} y={py} s={0.18} rot={(t - thr) * (t > thr ? 18 : 0)} mode="video" t={t} />
    </g>
  );
};

// ---------- S11: close, Mo: LAG! IN THE FINAL ROUND! ----------
export const S11 = faceCU({ look: MO, Bg: MOROOM, faces: [[0, 'shock']], yaw: 0.2, zoom: [3.3, 3.5], words: W, talk: span(W, "'Lag", 'round', 1), pose: { armL: { a: -150, b: -40 }, armR: { a: 150, b: 40 } } });

// ---------- S12: looking up: the Sun fading in a clear sky ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => <g transform={camT(960, 600, kf(t, [[0, 1.0], [len, 1.1]]))}><SkyUp t={t} sun={kf(t, [[0, 0.8], [len, 0.55]])} /></g>;

// ---------- S13: the street at 11 AM, darkening as if dusk ----------
export const S13 = withHud(streetShot({
  sun: (t) => kf(t, [[0, 0.6], [120, 0.35]]),
  cam: { from: [960, 540, 1.0], to: [980, 540, 1.05] },
  cast: [{ look: YOU, x: 900, scale: 0.85, yaw: 0.2, faces: [[0, 'worried']], pose: () => ({ headTilt: -10 }) }],
}), 4, '11:00 AM');

// ---------- S14: close, you, squinting up: it's fading like a dimmer switch ----------
export const S14 = faceCU({ look: YOU, Bg: ({ t, id }) => <FadeStreet t={t} id={id} sun={0.45} />, faces: [[0, 'worried']], yaw: 0.2, eyes: -0.2, zoom: [3.2, 3.4], light: { x: 1150, y: 260, kind: 'warm', o: 0.4 }, pose: { headTilt: -10 } });

// ---------- S15: the streetlights flicker on, at lunchtime ----------
export const S15 = withHud(((p: ShotProps) => (
  <g transform={camT(960, 520, kf(p.t, [[0, 1.05], [p.len, 1.0]]))}>
    <FadeStreet t={p.t + 200} sun={kf(p.t, [[0, 0.3], [p.len, 0.2]])} />
  </g>
)) as React.FC<ShotProps>, 5, '12:00 PM');

// ---------- S16: the classroom erupts: sent home ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(900, 480, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Classroom t={t + 120} laugh={1} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={0.35} />
  </g>
);

// ---------- S17: BEST. DAY. EVER. ----------
export const S17: React.FC<ShotProps> = ({ t }) => {
  const ws = ['BEST.', 'DAY.', 'EVER.'];
  return (
    <g>
      <g filter="url(#blur16)"><DIM t={t + 300} /></g>
      <rect width={1920} height={1080} fill="#0B0816" opacity={0.4} />
      {ws.map((w, i) => {
        const k = backOut(clamp((t - i * 22) / 8));
        return <g key={i} transform={`translate(${520 + i * 440} 600) scale(${k})`}><text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={200} fill={i === 2 ? '#FFD23A' : '#F6EFE3'} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">{w}</text></g>;
      })}
    </g>
  );
};

// ---------- S18: Mo's phone: the upload bar crawling, 1%... 2% ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const p = t < len * 0.55 ? 1 : 2;
  return (
    <g>
      <g filter="url(#blur16)"><DIM t={t + 400} /></g>
      <rect width={1920} height={1080} fill="#0B0816" opacity={0.3} />
      <g transform={`translate(960 560) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -560)`}>
        <Smartphone x={960} y={560} s={1.4} mode="video" t={t} />
        <rect x={790} y={760} width={340} height={70} rx={14} fill="#0B0816" opacity={0.85} />
        <rect x={810} y={790} width={300} height={16} rx={8} fill="#3A3A4A" />
        <rect x={810} y={790} width={300 * p / 100 + 4} height={16} rx={8} fill="#5AE0FF" />
        <text x={960} y={780} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#F6EFE3">{`UPLOADING... ${p}%`}</text>
      </g>
    </g>
  );
};

// ---------- S19: close, Mo, grumbling: slower than my grandma ----------
export const S19 = faceCU({ look: MO, Bg: DIM, faces: [[0, 'tired']], yaw: -0.3, zoom: [3.2, 3.35], words: W, talk: span(W, "'This", 'grandma', 1) });

// ---------- S20: down the street: a dog in the road, howling up at the dim Sun ----------
const Dog: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={-60} rx={80} ry={40} fill="#B8864A" stroke="#100E16" strokeWidth={7} />
    {[-55, -25, 25, 55].map((lx) => <rect key={lx} x={lx - 9} y={-40} width={18} height={44} fill="#B8864A" stroke="#100E16" strokeWidth={6} />)}
    <path d="M -80 -70 Q -110 -90 -120 -70" stroke="#100E16" strokeWidth={8} fill="none" />
    <g transform={`translate(70 -90) rotate(${-40 + Math.sin(t / 4) * 4})`}>
      <ellipse cx={20} cy={-10} rx={42} ry={30} fill="#B8864A" stroke="#100E16" strokeWidth={7} />
      <ellipse cx={60} cy={-6} rx={22} ry={14} fill="#C89A5A" stroke="#100E16" strokeWidth={6} />
      <path d="M 0 -30 L -10 -60 L 16 -38 Z" fill="#7A5A30" stroke="#100E16" strokeWidth={5} />
      <circle cx={30} cy={-18} r={5} fill="#100E16" />
      <ellipse cx={78} cy={0} rx={6} ry={10} fill="#100E16" />
    </g>
    {[0, 1, 2].map((k) => <path key={k} d={`M ${150 + k * 26} ${-200 - k * 26} q 10 -14 0 -28`} stroke="#F6EFE3" strokeWidth={6} fill="none" opacity={0.5 + 0.5 * Math.sin(t / 3 + k)} />)}
  </g>
);
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 940]]), 520, 1.1)}>
    <FadeStreet t={t + 500} sun={0.2} />
    <Dog x={900} y={STREETM.kerb + 90} s={0.9} t={t} />
  </g>
);

// ---------- S21: the street party in the half-dark: a barbecue smoking, neighbours, string of lamps ----------
export const S21 = streetShot({
  sun: 0.12,
  cam: { from: [960, 540, 1.0], to: [960, 540, 1.06] },
  cast: [
    { look: MODAD, x: 760, scale: 0.85, yaw: 0.3, faces: [[0, 'happy']], pose: (t) => ({ armR: { a: 60 + Math.sin(t / 5) * 10, b: -60 } }) },
    { look: MOM, x: 1120, scale: 0.85, yaw: -0.4, faces: [[0, 'happy']] },
    { look: YOU, x: 1350, scale: 0.8, yaw: -0.4, faces: [[0, 'happy']] },
    { look: MO, x: 1520, scale: 0.8, yaw: -0.5, faces: [[0, 'happy']] },
  ],
  front: (t) => <Barbecue x={930} y={STREETM.feet + 10} s={0.9} t={t} />,
});

// ---------- S22: close, Ellie, delighted: a darkness party! ----------
export const S22 = faceCU({ look: ELLIE, Bg: DIM, faces: [[0, 'happy']], yaw: 0.3, zoom: [3.3, 3.5], light: { x: 800, y: 560, kind: 'warm', o: 0.6 }, pose: { armL: { a: -150, b: -20 }, armR: { a: 150, b: 20 } } });

// ---------- S23: people holding phones up at the sky, flashes popping ----------
export const S23 = streetShot({
  sun: 0.1,
  cam: { from: [960, 540, 1.1], to: [980, 540, 1.15] },
  cast: [
    { look: MOM, x: 500, scale: 0.85, yaw: 0.1, pose: () => ({ armR: { a: 170, b: 0 }, headTilt: -12 }) },
    { look: MODAD, x: 900, scale: 0.85, yaw: -0.1, pose: () => ({ armR: { a: 170, b: 0 }, headTilt: -12 }) },
    { look: MO, x: 1300, scale: 0.8, yaw: 0.1, pose: () => ({ armR: { a: 170, b: 0 }, headTilt: -12 }) },
  ],
  front: (t) => (
    <g>
      {[[520, 1], [920, 2], [1320, 3]].map(([x, k]) => {
        const flash = Math.floor((t + k * 11) / 24) !== Math.floor((t + k * 11 - 3) / 24);
        return flash ? <Glow key={x} x={x + 30} y={360} r={140} kind="cool" o={0.9} /> : null;
      })}
    </g>
  ),
});

// ---------- S24: the call: your phone, Grandma's on the far side of the globe; your "hi" crawls around the Earth ----------
export const S24 = withHud(((p: ShotProps) => {
  const { t, len } = p;
  const k = clamp(t / Math.max(1, len));
  const a0 = Math.PI * 0.85, a1 = Math.PI * 0.15;
  const a = a0 + (a1 - a0 - Math.PI * 2 * 0) * k * 0.5;
  return (
    <g>
      <Schematic t={t} id="c3call" />
      <circle cx={960} cy={600} r={300} fill="#2E6AB8" stroke={SCH.line} strokeWidth={6} />
      <path d="M 800 470 q 80 -40 120 30 q 60 60 -20 120 q -60 40 -100 -30 Z M 1060 680 q 60 -10 90 40 q 10 60 -60 70 Z" fill="#4E9A5E" />
      <Smartphone x={540} y={420} s={0.32} mode="home" t={t} />
      <Smartphone x={1380} y={760} s={0.32} mode="home" t={t} />
      <text x={540} y={250} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.line}>YOU</text>
      <text x={1380} y={1000} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.line}>GRANDMA</text>
      <LightDot x0={600} y0={420} x1={1320} y1={760} p={0.02 + 0.6 * k} r={14} />
      <text x={600 + 720 * (0.02 + 0.6 * k)} y={420 + 340 * (0.02 + 0.6 * k) - 40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFD23A">"hi"</text>
      {a > 99 ? null : null}
    </g>
  );
}) as React.FC<ShotProps>, 10, '5:00 PM');

// ---------- S25: the stopwatch: almost a minute ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g filter="url(#blur16)"><DARK t={t + 600} /></g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.4} />
    <Stopwatch t={t} len={len} from={20} to={51} s={1.05} />
  </g>
);

// ---------- S26: close, you with the phone to your ear, a small smile: like sending letters ----------
export const S26 = faceCU({ look: YOU, Bg: DARK, faces: [[0, 'neutral'], [30, 'happy']], yaw: 0.3, zoom: [3.2, 3.3], pose: { armR: { a: 150, b: 140 } }, light: { x: 860, y: 520, kind: 'cool', o: 0.5 } });

// ---------- S27: wide, evening: the Sun is gone, only the lamps ----------
export const S27: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <FadeStreet t={t + 700} sun={0} stars={0.3} />
  </g>
);

// ---------- S28: you and Mo on the pavement, looking up: "Wait. Where's the Moon?" ----------
export const S28 = streetShot({
  sun: 0, stars: 0.3, words: W,
  cam: { from: [1000, 500, 1.5], to: [1000, 480, 1.6] },
  cast: [
    { look: YOU, x: 880, scale: 0.85, yaw: 0.3, faces: [[0, 'neutral'], [60, 'worried']], pose: () => ({ headTilt: -12 }) },
    { look: MO, x: 1120, scale: 0.85, yaw: -0.3, faces: [[0, 'worried']], talk: [span(W, "'Wait", 'Moon', 1)], pose: () => ({ headTilt: -14, armR: { a: 150, b: 20 } }) },
  ],
});

// ---------- S29: the diagram: Sun, Moon, Earth: the Moon only shines with the Sun's light; the light stalls, the Moon goes dark ----------
export const S29: React.FC<ShotProps> = ({ t }) => {
  const dark = clamp((t - 30) / 30);
  return (
    <g>
      <Schematic t={t} id="c3moon" />
      <Glow x={260} y={540} r={260} kind="warm" o={0.8 * (1 - dark * 0.3)} />
      <circle cx={260} cy={540} r={130} fill="#FFC94A" stroke="#FF8A3D" strokeWidth={8} />
      <circle cx={1300} cy={360} r={70} fill="#D8D8E0" opacity={1 - dark * 0.85} stroke={SCH.line} strokeWidth={5} />
      <circle cx={1650} cy={700} r={90} fill="#2E6AB8" stroke={SCH.line} strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => <LightDot key={i} x0={400} y0={500} x1={1230} y1={370} p={Math.min(0.6, ((t * 0.02 + i / 4) % 1)) * (1 - dark) + 0.01} r={10} />)}
      {dark < 0.8 ? <LightDot x0={1340} y0={400} x1={1600} y1={660} p={(t * 0.03) % 1} r={8} color="#D8D8E0" /> : null}
      <SchLabel x={260} y={760} t={t} text="SUN" size={36} />
      <SchLabel x={1300} y={250} t={t} text="MOON = A MIRROR" size={36} color={SCH.live} />
      <SchLabel x={1650} y={860} t={t} text="EARTH" size={36} />
    </g>
  );
};

// ---------- S30: looking up: black sky, no Moon, a few stars ----------
export const S30: React.FC<ShotProps> = ({ t, len }) => <g transform={camT(960, 600, kf(t, [[0, 1.0], [len, 1.12]]))}><SkyUp t={t} sun={0} stars={kf(t, [[0, 0.5], [len, 0.25]])} /></g>;
