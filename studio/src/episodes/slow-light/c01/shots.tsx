import React from 'react';
import {
  Hero, Pose, ShotProps, basePose, camT, kf, clamp, idleBlink, walkPose, TitleCard, Classroom, Glow, easeOut,
} from '../../../engine';
import { YOU, MO, ELLIE, MOM, faceCU, bigWord, Soft } from '../common';
import { FadeStreet, SkyUp, Beam, LightDot, SunEarth, Tunnel, tunHip, STREETM } from '../sets';
import { onStreet, streetShot, withHud, wave, Stopwatch, Caption } from '../kit';

// Chapter 1, the cold open: three demos of slow light. You wave at Mo across the street and he waves back fifteen
// seconds later; you outrun your own flashlight beam; the Sun goes out at noon without going anywhere. Then the
// title, and the promise of the next 24 hours. 24+ cuts a minute.

const NIGHT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <FadeStreet t={t} id={id} sun={0} />;
const DIM: React.FC<{ t: number; id?: string }> = ({ t, id }) => <FadeStreet t={t} id={id} sun={0.3} />;

// ---------- S1: wide, the dark street under its lamps: you on the left wave at Mo, far right. He doesn't move. ----------
export const S1 = withHud(streetShot({
  sun: 0,
  cam: { from: [960, 560, 1.0], to: [960, 560, 1.06] },
  cast: [
    { look: YOU, x: 420, scale: 0.9, yaw: 0.6, faces: [[0, 'happy']], pose: (t) => wave(t, t > 6 ? 1 : 0) },
    { look: MO, x: 1560, scale: 0.8, yaw: -0.6, faces: [[0, 'neutral']] },
  ],
}), 28, '11:00 AM');

// ---------- S2: close, Mo: a blank stare, straight past you ----------
export const S2 = faceCU({ look: MO, Bg: NIGHT, faces: [[0, 'neutral']], yaw: -0.3, eyes: 0, zoom: [3.2, 3.35], light: { x: 900, y: 360, kind: 'warm', o: 0.4 } });

// ---------- S3: medium, you wave again, both arms, jumping a little ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const hop = Math.abs(Math.sin(t / 5)) * 18;
  const me = onStreet(700, 0.95, { yaw: 0.5, expr: 'oops', blink: idleBlink(t, 3), y: onStreet(700, 0.95).y - hop, armL: { a: -150 - Math.sin(t / 2.2) * 14, b: -20 }, ...wave(t) });
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 780]]), 520, kf(t, [[0, 1.7], [len, 1.8]]))}>
      <NIGHT t={t + 200} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S4: the stopwatch: fifteen seconds ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.55}><NIGHT t={t + 300} /></Soft>
    <Stopwatch t={t} len={len} to={15} s={1.1} />
  </g>
);

// ---------- S5: Mo finally waves back, big grin, far across the street ----------
export const S5 = withHud(streetShot({
  sun: 0,
  cam: { from: [1300, 540, 1.6], to: [1330, 540, 1.7] },
  cast: [
    { look: YOU, x: 420, scale: 0.9, yaw: 0.6, faces: [[0, 'worried']] },
    { look: MO, x: 1560, scale: 0.8, yaw: -0.6, faces: [[0, 'happy']], pose: (t) => wave(t) },
  ],
}), 28, '11:01 AM');

// ---------- S6: the same street, slowed: a packet of light leaves your hand and crawls across to Mo's eye ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / Math.max(1, len - 4));
  return (
    <g transform={camT(990, 520, 1.05)}>
      <NIGHT t={t + 400} />
      <Hero look={YOU} pose={onStreet(420, 0.9, { yaw: 0.6, expr: 'happy', blink: idleBlink(t, 2), ...wave(t) })} />
      <Hero look={MO} pose={onStreet(1560, 0.8, { yaw: -0.6, expr: 'neutral', blink: idleBlink(t, 5) })} />
      {[0, 0.12, 0.24].map((d, i) => <LightDot key={i} x0={500} y0={420} x1={1520} y1={470} p={p - d} r={14} />)}
      <text x={1000} y={330} textAnchor="middle" fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={58} fill="#FFD23A" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp(t / 8)}>15 SECONDS</text>
    </g>
  );
};

// ---------- S7: close, your hand clicks on the flashlight, its glow on your face ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const on = t > 8 ? 1 : 0;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.08]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0A14" />
      <Beam x={700} y={560} reach={on ? Math.min(140, (t - 8) * 4) : 0} t={t} s={2.2} />
      <ellipse cx={560} cy={560} rx={110} ry={90} fill="#1E1C26" stroke="#100E16" strokeWidth={8} />
      <ellipse cx={600} cy={510 + (t > 6 && t < 10 ? 6 : 0)} rx={40} ry={30} fill="#1E1C26" stroke="#100E16" strokeWidth={7} />
      <path d="M 300 760 Q 420 640 520 600 L 560 660 Q 460 720 380 820 Z" fill="#F07A2A" stroke="#100E16" strokeWidth={8} />
      {t > 8 && t < 12 ? <text x={760} y={420} fontFamily="Bricolage Grotesque, sans-serif" fontWeight={800} fontSize={64} fill="#F6EFE3" transform="rotate(-8 760 420)">click</text> : null}
    </g>
  );
};

// ---------- S8: the race, wide: you sprint down the dark street, the beam's bright front crawling behind you ----------
const race = (t: number, len: number, x0: number, x1: number) => {
  const k = clamp(t / Math.max(1, len));
  const x = x0 + (x1 - x0) * easeOut(k);
  return { x, beam: (x - x0) * 0.72 };
};
export const S8 = withHud(((p: ShotProps) => {
  const { t, len } = p;
  const { x, beam } = race(t, len, 260, 1500);
  const me: Pose = walkPose(x, t * 0.9, STREETM.feet, 0.85, { expr: 'happy', blink: idleBlink(t, 4), tilt: 14, armL: { a: 60 * Math.sin(t * 0.9), b: 70 }, armR: { a: -60 * Math.sin(t * 0.9), b: 70 } });
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1150]]), 560, 1.15)}>
      <FadeStreet t={t + 500} sun={0} />
      <Beam x={240} y={560} reach={beam} t={t} s={0.8} />
      <Hero look={YOU} pose={me} />
    </g>
  );
}) as React.FC<ShotProps>, 25, '8:00 AM');

// ---------- S9: low at the finish: you skid to a stop, turn; the beam arrives a beat later and lights you up ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const reach = kf(t, [[0, 380], [len, 760]]);
  const lit = clamp((reach - 700) / 60);
  const me = onStreet(1240, 1.0, { yaw: -0.5, expr: 'happy', blink: idleBlink(t, 6), armL: { a: -150, b: -10 }, armR: { a: 150, b: 10 } });
  return (
    <g transform={camT(1000, 560, 1.5)}>
      <FadeStreet t={t + 560} sun={0} />
      <Beam x={430} y={600} reach={reach} t={t} s={0.9} />
      <Glow x={1240} y={520} r={200} kind="warm" o={0.6 * lit} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S10: close, you, out of breath, grinning in the beam ----------
export const S10 = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'happy']], yaw: -0.35, zoom: [3.1, 3.3], light: { x: 760, y: 520, kind: 'warm', o: 0.9 } });

// ---------- S11: looking straight up: a clear blue sky, and the Sun fading in the middle of it ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 700], [len, 520]]), 1.05)}>
    <SkyUp t={t} sun={kf(t, [[0, 0.7], [len, 0.35]])} />
  </g>
);

// ---------- S12: 12:00 PM over the dim street ----------
export const S12 = bigWord({ kicker: 'NO CLOUDS', word: '12:00 PM', color: '#FFD23A', Bg: DIM, size: 220 });

// ---------- S13: wide, the street at noon, dim as dusk: neighbours out on the pavement, shading their eyes ----------
export const S13 = withHud(streetShot({
  sun: (t) => kf(t, [[0, 0.32], [90, 0.22]]),
  cam: { from: [960, 540, 1.0], to: [980, 540, 1.05] },
  cast: [
    { look: MOM, x: 360, scale: 0.85, yaw: 0.3, faces: [[0, 'worried']], pose: () => ({ headTilt: -10, armR: { a: 150, b: 120 } }) },
    { look: ELLIE, x: 520, scale: 0.6, yaw: 0.4, faces: [[0, 'neutral']], pose: () => ({ headTilt: -14 }) },
    { look: YOU, x: 980, scale: 0.85, yaw: 0, faces: [[0, 'shock']], pose: () => ({ headTilt: -12 }) },
    { look: MO, x: 1500, scale: 0.8, yaw: -0.3, faces: [[0, 'worried']], pose: () => ({ armL: { a: -150, b: -120 }, headTilt: -10 }) },
  ],
}), 5, '12:00 PM');

// ---------- S14: close, your face, the last of the sunlight going grey on it ----------
export const S14 = faceCU({ look: YOU, Bg: DIM, faces: [[0, 'worried']], yaw: 0.2, eyes: -0.2, zoom: [3.3, 3.5], light: { x: 1100, y: 300, kind: 'warm', o: 0.25 }, pose: { headTilt: -10 } });

// ---------- S15: the diagram: light leaves the Sun, slows, stalls half way. NEVER ARRIVES. ----------
export const S15: React.FC<ShotProps> = ({ t }) => <SunEarth t={t} speed={kf(t, [[0, 2], [40, 0.4]])} stall={0.55} earthDim={clamp((t - 14) / 40) * 0.7} cut={18} />;

// ---------- S16: the title over the dark street ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 520, kf(t, [[0, 1.02], [len, 1.1]]))}>
      <FadeStreet t={t + 900} sun={kf(t, [[0, 0.25], [len, 0.05]])} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
    <TitleCard t={t} lines={['WHAT IF LIGHT', 'KEPT GETTING SLOWER?']} accent="SLOWER?" size={104} y={190} />
  </g>
);

// ---------- S17: a normal sunny morning, people walking to work: nobody notices ----------
export const S17 = streetShot({
  sun: 1,
  cam: { from: [940, 540, 1.0], to: [980, 540, 1.04] },
  cast: [
    { look: MOM, x: 1300, scale: 0.85, yaw: -0.5, faces: [[0, 'happy']] },
    { look: ELLIE, x: 1160, scale: 0.6, yaw: -0.5, faces: [[0, 'happy']] },
  ],
  back: (t) => <Hero look={{ ...MO, jacket: '#8A5A3A' }} pose={walkPose(200 + t * 6, t * 0.6, STREETM.feet, 0.8, { expr: 'neutral', blink: idleBlink(t, 3) })} />,
});

// ---------- S18: the classroom erupts: everybody sent home ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(900, 480, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Classroom t={t + 120} laugh={1} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={0.25} />
    <Caption t={t} text="NO SCHOOL!" y={260} size={130} />
  </g>
);

// ---------- S19: a dark tunnel, deep underground, lamps strung along it ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <Tunnel t={t} />
  </g>
);

// ---------- S20: close, you in the tunnel's lamp light, looking back up ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 960, y: tunHip(1), scale: 1, yaw: 0.25, expr: 'worried', blink: idleBlink(t, 4), headTilt: -8, look: 0.3 };
  return (
    <g>
      <Soft blur={10} dim={0.2}><g transform={camT(960, 520, 1.4)}><Tunnel t={t + 60} people={false} /></g></Soft>
      <g transform={camT(960, 520, kf(t, [[0, 2.8], [len, 3.0]]))}>
        <Glow x={1060} y={340} r={260} kind="warm" o={0.6} />
        <Hero look={YOU} pose={me} shadow={0} />
      </g>
    </g>
  );
};
