import React from 'react';
import {
  Hero, Pose, ShotProps, basePose, camT, kf, clamp, idleBlink, Schematic, SCH, SchLabel, Glow, FONT, walkPose, LOOKS, easeOut,
} from '../../../engine';
import { YOU, MO, ELLIE, MOM, MODAD, faceCU, bigWord, span, Soft } from '../common';
import { FadeStreet, Bus, Beam, HospitalLit, hospStand, ShoutLines, Tunnel, STREETM } from '../sets';
import { Bike, Car } from '../../electricity/sets';
import { streetShot, withHud, Caption, onStreet } from '../kit';
import words from './words.json';

// Chapter 6, the choice: Mo wants you on the bus; you take Ellie on your bike the other way, to the hospital. Light is
// slower than your bike now: you outride your own beam; a driver can't see you in time. At the hospital everything you
// see is old: Mom isn't where you see her. You shout, sound is fast, she answers from behind you. 11:40. The bus you
// see waiting already left; Ellie's scream catches it. Down the ramp, into the tunnel, the city goes dark.

const W = words;
const NIGHT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <FadeStreet t={t} id={id} sun={0} stars={0.25} />;
const HOSP: React.FC<{ t: number; id?: string }> = ({ t, id }) => <HospitalLit t={t} id={id} />;
const SCRUBS = { ...MOM, jacket: '#5AA8A0', jacketShade: '#4A8A84' };

const ride = (x: number, gy: number, s: number, ph: number, o: Partial<Pose> = {}, dir = 1): Pose => ({
  ...basePose, x: x - 20 * s * dir, y: gy - 176 * s, scale: s * 0.9, yaw: 0.7 * dir, facing: dir as 1 | -1, tilt: 14 * dir,
  legL: { a: 40 + 30 * Math.sin(ph), b: -60 - 20 * Math.cos(ph) }, legR: { a: 40 - 30 * Math.sin(ph), b: -60 + 20 * Math.cos(ph) },
  armL: { a: 70, b: -20 }, armR: { a: 66, b: -18 }, ...o,
});
/** You on the bike with Ellie on the back (behind you), riding right at x. */
const Riders: React.FC<{ x: number; gy: number; s: number; t: number; ex?: Pose['expr']; eex?: Pose['expr']; color?: string; ellie?: boolean }> = ({ x, gy, s, t, ex = 'cool', eex = 'worried', color = '#E8252A', ellie = true }) => {
  const ph = t * 0.5;
  const me = ride(x, gy, s, ph, { expr: ex, blink: idleBlink(t, 3) });
  const el: Pose = { ...basePose, x: x - 110 * s, y: gy - 150 * s, scale: s * 0.62, yaw: 0.6, tilt: 10, expr: eex, blink: idleBlink(t, 5), legL: { a: 70, b: -40 }, legR: { a: 66, b: -44 }, armL: { a: 80, b: -10 }, armR: { a: 76, b: -10 } };
  return (
    <g>
      <Bike x={x} y={gy} s={s} spin={ph * 20} color={color} />
      {ellie ? <Hero look={ELLIE} pose={el} shadow={0} /> : null}
      <Hero look={YOU} pose={me} shadow={0} />
    </g>
  );
};

// ---------- S1: Mo grabs your arm: come with us ----------
export const S1 = streetShot({
  sun: 0, stars: 0.25, words: W,
  cam: { from: [960, 560, 1.7], to: [960, 560, 1.8] },
  cast: [
    { look: YOU, x: 860, scale: 0.85, yaw: 0.4, faces: [[0, 'worried']] },
    { look: MO, x: 1060, scale: 0.85, yaw: -0.4, faces: [[0, 'worried']], talk: [span(W, "'Come", 'there', 1)], pose: () => ({ armR: { a: 80, b: -20 } }) },
  ],
});

// ---------- S2: close, you: but what if she doesn't? ----------
export const S2 = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'worried']], yaw: 0.3, eyes: -0.6, zoom: [3.2, 3.35] });

// ---------- S3: what if: the last bus pulling away from an empty stop ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, 1.05)}>
    <NIGHT t={t + 120} />
    <Bus x={kf(t, [[0, 960], [len, 1900]], (k) => k * k)} y={STREETM.kerb + 110} s={0.8} spin={t * 5} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#3A4A7A" opacity={0.25} />
    <Caption t={t} text="WHAT IF...?" y={220} size={100} color="#F6EFE3" />
  </g>
);

// ---------- S4: close, Ellie looking up at you, waiting ----------
export const S4 = faceCU({ look: ELLIE, Bg: NIGHT, faces: [[0, 'worried']], yaw: -0.3, eyes: 0.2, zoom: [3.4, 3.5], pose: { headTilt: -8 } });

// ---------- S5: close, you decide ----------
export const S5 = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'worried'], [12, 'cool']], yaw: 0.1, eyes: 0, zoom: [3.3, 3.6] });

// ---------- S6: you and Ellie push off on the bike, the other way from everyone walking to the station ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 500], [len, 1500]], easeOut);
  return (
    <g transform={camT(kf(t, [[0, 800], [len, 1200]]), 560, 1.15)}>
      <NIGHT t={t + 200} />
      {[0, 1, 2].map((k) => <Hero key={k} look={[MODAD, MO, LOOKS.lady][k]} pose={walkPose(1700 - k * 160 - t * 3, t * 0.5 + k, STREETM.feet, 0.8, { blink: idleBlink(t, k + 2) }, -1)} />)}
      <Riders x={x} gy={STREETM.kerb + 80} s={0.85} t={t} />
    </g>
  );
};

// ---------- S7: HOUR 26 ----------
export const S7 = withHud(bigWord({ kicker: 'HOUR 26', word: 'SLOWER THAN YOUR BIKE', color: '#FFD23A', Bg: NIGHT, size: 130 }), 26, '9:00 AM');

// ---------- S8: you ride into the dark, ahead of your own bike light: its bright front falls behind you ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 600], [len, 1500]], (k) => k);
  const reach = (x - 600) * 0.6 + 40;
  return (
    <g transform={camT(x - 100, 560, 1.25)}>
      <NIGHT t={t + 300} />
      <rect x={-400} y={-400} width={3200} height={1900} fill="#05050F" opacity={0.5} />
      <Beam x={560} y={STREETM.kerb - 20} reach={reach} t={t} s={0.5} />
      <Riders x={x} gy={STREETM.kerb + 80} s={0.85} t={t} ex="shock" />
    </g>
  );
};

// ---------- S9: a car comes round the corner, way too fast, straight at you ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, 1.1)}>
    <NIGHT t={t + 400} />
    <Car x={kf(t, [[0, 2300], [len, 1500]], (k) => k)} y={STREETM.kerb + 120} s={1} color="#3E6E9A" flip lights={1} />
    <Riders x={500 + t * 2} gy={STREETM.kerb + 90} s={0.8} t={t} />
  </g>
);

// ---------- S10: close, the driver behind the wheel: sees nothing, then sees you, too late ----------
export const S10 = faceCU({ look: { ...LOOKS.worker, hat: undefined }, Bg: NIGHT, faces: [[0, 'neutral'], [30, 'shock']], yaw: -0.4, zoom: [3.1, 3.3], light: { x: 800, y: 520, kind: 'cool', o: 0.4 }, pose: { armL: { a: 70, b: -80 }, armR: { a: 70, b: -80 } } });

// ---------- S11: the swerve: the car skids past behind your back wheel ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, 1.15 + Math.sin(t) * 0.004)}>
    <NIGHT t={t + 500} />
    <g transform={`rotate(${kf(t, [[0, 0], [len, -14]])} 1100 ${STREETM.kerb + 120})`}>
      <Car x={kf(t, [[0, 1500], [len, 300]], (k) => k)} y={STREETM.kerb + 180} s={1} color="#3E6E9A" flip lights={1} />
    </g>
    <Riders x={900 + t * 3} gy={STREETM.kerb + 60} s={0.8} t={t} ex="shock" eex="shock" />
  </g>
);

// ---------- S12: close, Ellie's eyes squeezed shut, arms locked around you ----------
export const S12 = faceCU({ look: ELLIE, Bg: NIGHT, faces: [[0, 'tired']], yaw: 0.35, zoom: [3.4, 3.6], pose: { armL: { a: 90, b: -30 }, armR: { a: 90, b: -30 } } });

// ---------- S13: the hospital: lit, quiet, a long corridor ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => <g transform={camT(960, 500, kf(t, [[0, 1.0], [len, 1.08]]))}><HOSP t={t} /></g>;

// ---------- S14: Mom at the far end of the corridor; you run toward her ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const far = hospStand(0.5, 0.85);
  const w = kf(t, [[0, 0.05], [len, 0.5]]);
  const me = hospStand(0.42, w);
  return (
    <g transform={camT(960, 500, 1.05)}>
      <HOSP t={t + 60} />
      <Hero look={SCRUBS} pose={{ ...basePose, ...far, yaw: 0.2, expr: 'tired', blink: idleBlink(t, 2) }} />
      <Hero look={YOU} pose={{ ...walkPose(me.x, t * 0.9, me.y + 230 * me.scale, me.scale, { yaw: 0, facing: 1 }), yaw: 0 }} />
    </g>
  );
};

// ---------- S15: you arrive at the end: nobody there ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const s = hospStand(0.5, 0.7);
  return (
    <g transform={camT(960, 480, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <HOSP t={t + 90} />
      <Hero look={YOU} pose={{ ...basePose, ...s, yaw: 0.6, expr: 'shock', blink: idleBlink(t, 3), look: 0.8 }} />
    </g>
  );
};

// ---------- S16: what you saw: a faded ghost of Mom where she WAS, "1 MINUTE AGO" ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const s = hospStand(0.5, 0.7);
  return (
    <g transform={camT(960, 480, 1.3)}>
      <HOSP t={t + 120} />
      <g opacity={kf(t, [[0, 0.7], [len, 0.15]])}>
        <Hero look={SCRUBS} pose={{ ...basePose, ...s, x: s.x + 60, yaw: 0.2, expr: 'tired' }} />
      </g>
      <text x={s.x + 60} y={s.y - 140 * s.scale - 30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#FFD23A" stroke="#0B0816" strokeWidth={6} paintOrder="stroke">1 MINUTE AGO</text>
    </g>
  );
};

// ---------- S17: close, you shout: MOM! ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    {faceCU({ look: YOU, Bg: HOSP, faces: [[0, 'shock']], yaw: 0.3, zoom: [3.2, 3.4], words: W, talk: span(W, "'Mom", "'Mom", 1) })({ t, len, f: t })}
    <ShoutLines x={1150} y={420} t={t} />
  </g>
);

// ---------- S18: behind you, close: Mom, shouting back ----------
export const S18 = faceCU({ look: SCRUBS, Bg: HOSP, faces: [[0, 'shock']], yaw: -0.3, zoom: [3.2, 3.4], light: { x: 900, y: 360, kind: 'cool', o: 0.4 } });

// ---------- S19: the hug: Mom pulls you both in ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const s = hospStand(0.5, 0.35);
  return (
    <g transform={camT(960, 470, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <HOSP t={t + 150} />
      <Hero look={YOU} pose={{ ...basePose, ...s, x: s.x - 70, yaw: 0.6, expr: 'happy', blink: 1, armR: { a: 80, b: -40 } }} />
      <Hero look={ELLIE} pose={{ ...basePose, ...s, x: s.x + 10, y: s.y + 60 * s.scale, scale: s.scale * 0.65, yaw: 0.5, expr: 'happy', blink: 1, armR: { a: 90, b: -30 } }} />
      <Hero look={SCRUBS} pose={{ ...basePose, ...s, x: s.x + 80, yaw: -0.6, expr: 'happy', blink: 1, armL: { a: -90, b: 40 }, armR: { a: 90, b: -40 } }} />
    </g>
  );
};

// ---------- S20: 11:40 ----------
export const S20 = bigWord({ kicker: 'BUSES LEAVE AT 12:00', word: '11:40', color: '#FF5A5A', Bg: HOSP, size: 260 });

// ---------- S21: two bikes flying down the dark street: Mom on one, you and Ellie on the other ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 400], [len, 1500]], (k) => k);
  const ph = t * 0.6;
  return (
    <g transform={camT(x, 560, 1.2)}>
      <NIGHT t={t + 600} />
      <Riders x={x} gy={STREETM.kerb + 90} s={0.8} t={t} />
      <Bike x={x - 380} y={STREETM.kerb + 60} s={0.8} spin={ph * 20} color="#3A8AE0" />
      <Hero look={SCRUBS} pose={ride(x - 380, STREETM.kerb + 60, 0.8, ph, { expr: 'worried', blink: idleBlink(t, 4) })} shadow={0} />
    </g>
  );
};

// ---------- S22: the station: the last bus still at the stop... ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.05]]))}>
    <NIGHT t={t + 700} />
    <Bus x={1100} y={STREETM.kerb + 110} s={0.85} />
  </g>
);

// ---------- S23: ...but that's old light: the bus you see fades; the real one is already down the road ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1200, 560, 1.0)}>
    <NIGHT t={t + 720} />
    <g opacity={kf(t, [[0, 0.9], [len * 0.6, 0.25]])}><Bus x={1100} y={STREETM.kerb + 110} s={0.85} /></g>
    <Bus x={kf(t, [[0, 1700], [len, 2000]])} y={STREETM.kerb + 110} s={0.85} spin={t * 4} />
    <Caption t={t} text="OLD LIGHT" y={220} size={110} color="#FFD23A" />
  </g>
);

// ---------- S24: close, Ellie screams ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    {faceCU({ look: ELLIE, Bg: NIGHT, faces: [[0, 'shock']], yaw: 0.3, zoom: [3.4, 3.6] })({ t, len, f: t })}
    <ShoutLines x={1150} y={460} t={t} />
  </g>
);

// ---------- S25: the scream crosses the street: sound arcs racing ahead, light dots crawling behind ----------
export const S25: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="c6snd" />
    <circle cx={300} cy={600} r={40} fill={SCH.live} />
    <text x={300} y={700} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.line}>ELLIE</text>
    <rect x={1460} y={500} width={300} height={180} rx={20} fill="#E8B83A" stroke={SCH.line} strokeWidth={5} />
    <text x={1610} y={740} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.line}>BUS</text>
    {[0, 1, 2, 3].map((k) => {
      const r = ((t * 14 + k * 160) % 1300);
      return <path key={k} d={`M ${300 + r * 0.6} ${600 - r * 0.5} Q ${300 + r} 600 ${300 + r * 0.6} ${600 + r * 0.5}`} stroke={SCH.line} strokeWidth={6} fill="none" opacity={1 - r / 1300} />;
    })}
    <circle cx={360 + t * 2} cy={600} r={12} fill="#FFD23A" />
    <SchLabel x={960} y={200} t={t} text="SOUND ARRIVES FIRST" size={46} color={SCH.live} />
  </g>
);

// ---------- S26: the bus brakes, the door folds open: Mo inside, waving like crazy ----------
export const S26: React.FC<ShotProps> = ({ t }) => {
  const door = clamp((t - 20) / 10);
  const bx = kf(t, [[0, 1100], [18, 1000]], easeOut);
  return (
    <g transform={camT(1250, 800, 1.6)}>
      <NIGHT t={t + 800} />
      <Bus x={bx} y={STREETM.kerb + 110} s={0.85} door={door} />
      {door > 0.4 ? <Hero look={MO} pose={{ ...basePose, x: bx + 260, y: STREETM.kerb + 110 - 40 - 100, scale: 0.36, yaw: -0.3, expr: 'happy', blink: idleBlink(t, 2), armR: { a: 150 + Math.sin(t / 2) * 20, b: 30 }, armL: { a: -150 - Math.sin(t / 2) * 20, b: -30 } }} shadow={0} /> : null}
    </g>
  );
};

// ---------- S27: Mo's dad hauls you up the steps; the cat in its basket goes in last ----------
export const S27 = streetShot({
  sun: 0, stars: 0.25,
  cam: { from: [1100, 520, 1.5], to: [1120, 520, 1.55] },
  cast: [
    { look: MODAD, x: 1260, scale: 0.85, yaw: -0.5, faces: [[0, 'happy']], pose: () => ({ armR: { a: 90, b: 0 } }) },
    { look: YOU, x: 1060, scale: 0.8, yaw: 0.5, faces: [[0, 'happy']], pose: () => ({ armR: { a: 90, b: 0 } }) },
    { look: ELLIE, x: 920, scale: 0.6, yaw: 0.5, faces: [[0, 'happy']], pose: () => ({ armR: { a: 60, b: -60 } }) },
  ],
  front: (t) => <Bus x={1760} y={STREETM.kerb + 110} s={0.85} door={1} />,
});

// ---------- S28: the bus rolls down a ramp into a tunnel mouth ----------
export const S28: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#08080F" />
    <path d="M 0 700 L 1920 700 L 1920 1080 L 0 1080 Z" fill="#2A2C34" />
    <path d="M 1100 700 Q 1400 480 1700 700 Z" fill="#05050A" stroke="#4A4E58" strokeWidth={20} />
    <Glow x={1400} y={650} r={160} kind="warm" o={0.4} />
    <g transform={`rotate(10 ${kf(t, [[0, 500], [len, 1450]])} 760)`}>
      <Bus x={kf(t, [[0, 500], [len, 1450]], (k) => k)} y={kf(t, [[0, 820], [len, 860]])} s={0.6} spin={t * 5} lights={1} />
    </g>
  </g>
);

// ---------- S29: behind: the city's last lights going out, block by block ----------
export const S29: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <NIGHT t={t + 900} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#000" opacity={kf(t, [[0, 0], [len, 0.9]])} />
  </g>
);
