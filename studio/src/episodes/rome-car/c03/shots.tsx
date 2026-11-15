import React from 'react';
import { Hero, Pose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, factCard, FONT, walkPose, talkAt, FloatLabel } from '../../../engine';
import { YOU, MO, SOLDIER, OFFICIAL, SENATOR, CHARIOTEER, CITIZENS, faceCU, bigWord, wordF, span, carShot, onGround, fuelShot, ChariotTeam, CarHeads } from '../common';
import { CityGate, Forum, Circus, GROUND, Car, CarFront, Spear, WaxTablet, CoinBag, Notes, Crowd } from '../sets';
import words from './words.json';

// Chapter 3, gods on wheels: the soldiers at the gate fall flat at the horn; gods, or friends of the gods; Caesar's
// daytime cart ban and an official who can't decide if it applies; the Forum, the music, senators paying for rides,
// kids and the wipers; the headlights in the dark city; the Circus Maximus and the race; Mo through the sunroof.
// Then the fuel gauge: half.

const W = words as { w: string; s: number; e: number }[];
const rel = (a: string, b: string) => wordF(W, b) - wordF(W, a);
const GATE: React.FC<{ t: number; id?: string }> = ({ t, id }) => <CityGate t={t} id={id} />;
const FORUM: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Forum t={t} id={id} />;
const NIGHT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Forum t={t} id={id} mode="night" torches={1} />;
const CIRC: React.FC<{ t: number; id?: string; cheer?: number }> = ({ t, id, cheer }) => <Circus t={t} id={id} cheer={cheer} />;
const SOLX = [560, 680, 800, 1120, 1240, 1360];

/** A soldier at the gate: levelled spear, then (fall 0..1) dropping it and going flat on his face. */
const Soldier: React.FC<{ x: number; t: number; fall?: number; kneel?: number; i: number; s?: number }> = ({ x, t, fall = 0, kneel = 0, i, s = 1 }) => {
  const f = easeOut(clamp(fall));
  const pose: Pose = onGround(x, s, {
    yaw: x < 960 ? 0.5 : -0.5, look: x < 960 ? 0.6 : -0.6, expr: fall > 0 || kneel > 0 ? 'shock' : 'neutral', blink: idleBlink(t, i + 2),
    armR: { a: 60 + f * 100, b: -20 }, armL: { a: 40 + f * 110, b: 0 },
    spin: (x < 960 ? 1 : -1) * f * 84, tilt: kneel * (x < 960 ? 30 : -30),
    legL: { a: kneel * 70, b: -kneel * 100 }, legR: { a: -kneel * 10, b: -kneel * 60 },
  });
  pose.y += f * 112 * s + kneel * 50 * s;
  const sp = x < 960 ? 1 : -1;
  return (
    <g>
      {fall < 0.4 && kneel === 0 ? <Spear x={x + sp * 10 * s} y={pose.y - 30 * s} len={420 * s} rot={sp * 70} /> : <Spear x={x + sp * 40} y={GROUND} len={420 * s} rot={sp * (88 + i)} />}
      <Hero look={SOLDIER} pose={pose} />
    </g>
  );
};

// ---------- S1: a dozen soldiers at the gate, spears levelled at the car rolling up ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 620, kf(t, [[0, 1.05], [len, 1.18]]))}>
    <GATE t={t + 20} />
    <Car x={kf(t, [[0, 2300], [len, 1700]], easeOut)} y={GROUND + 60} s={0.75} flip t={t} spin={-t * 6} id="c3s1" />
    {SOLX.map((x, i) => <Soldier key={i} x={x} t={t} i={i} s={0.85} />)}
  </g>
);

// ---------- S2: the car head-on: the horn ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.5], [len, 1.62]]))}>
    <GATE t={t + 60} />
    <CarFront x={960} y={GROUND + 60} s={1.05} id="c3s2" bounce={t > 3 ? Math.sin(t * 1.5) * 2 : 0} />
    {t > 3
      ? [0, 1, 2, 3].map((k) => {
          const p = ((t - 3) / 16 + k / 4) % 1;
          return <ellipse key={k} cx={960} cy={GROUND - 80} rx={260 + p * 700} ry={120 + p * 320} fill="none" stroke="#FFF6D0" strokeWidth={10 * (1 - p)} opacity={1 - p} />;
        })
      : null}
    <FloatLabel x={960} y={360} t={t - 3} text="HONK!" color="#FFD23A" size={120} />
  </g>
);

// ---------- S3: every one drops his spear and hits the ground ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.2], [len, 1.1]]))}>
    <GATE t={t + 90} />
    {SOLX.map((x, i) => <Soldier key={i} x={x} t={t} i={i} s={0.85} fall={(t - 3 - i * 2) / 10} />)}
  </g>
);

// ---------- S4: Mo laughing so hard he cries ----------
export const S4 = faceCU({
  look: MO, Bg: GATE, faces: [[0, 'happy']], yaw: -0.3, zoom: [3.3, 3.5], pose: { headTilt: 10, blink: 0.85 },
  extra: (t) => (
    <g transform={`translate(0 ${Math.sin(t * 1.3) * 4})`}>
      {[[-34, 1], [34, -1]].map(([dx, sd], i) => {
        const p = ((t / 14 + i * 0.5) % 1);
        return <path key={i} d={`M ${960 + dx} ${520 + p * 50} q ${sd * 6} 10 0 16 q ${-sd * 6} -6 0 -16`} fill="#A9D4F0" opacity={1 - p} />;
      })}
    </g>
  ),
});

// ---------- S5: the soldiers kneel and bow to the car ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 640, 1.3)}>
    <GATE t={t + 140} />
    <Car x={1700} y={GROUND + 60} s={0.75} flip t={t} id="c3s5" inside={<CarHeads t={t} you={{ expr: 'smug' }} mo={{ expr: 'happy' }} />} />
    {SOLX.slice(0, 4).map((x, i) => <Soldier key={i} x={x - 100} t={t} i={i} s={0.85} kneel={1} />)}
  </g>
);

// ---------- S6: Caesar's law: no carts by day ----------
export const S6 = bigWord({ kicker: "JULIUS CAESAR'S LAW, 45 BC", word: 'NO CARTS BY DAY', color: '#FFD23A', size: 150, Bg: FORUM });

// ---------- S7: an official runs after the car, waving a wax tablet ----------
export const S7 = carShot({
  Bg: (t) => <Forum t={t + 40} />,
  car: { x: [900, 1500], s: 0.6, ease: 'lin' },
  cam: { from: [1000, 620, 1.15], to: [1100, 620, 1.15] },
  back: (t) => {
    const x = 300 + t * 6.5;
    const p = walkPose(x, t * 0.9, GROUND, 0.75, { expr: 'worried', armR: { a: 150 + Math.sin(t / 2) * 20, b: 10 }, tilt: 10 }, 1);
    return (
      <g>
        <Hero look={OFFICIAL} pose={p} />
        <WaxTablet x={x + 40} y={p.y - 250 + Math.sin(t / 2) * 20} s={0.45} rot={Math.sin(t / 2) * 20} />
      </g>
    );
  },
});

// ---------- S8: the official, baffled ----------
export const S8 = faceCU({
  look: OFFICIAL, Bg: FORUM, faces: [[0, 'worried'], [30, 'dizzy']], yaw: 0.3, zoom: [3.1, 3.3], pose: { headTilt: -8, armR: { a: 150, b: 60 } },
  extra: (t) => (
    <g>
      <WaxTablet x={1050} y={440} s={0.4} rot={-10} />
      <text x={880} y={360 - Math.sin(t / 6) * 6} fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={clamp(t / 6)}>?</text>
    </g>
  ),
});

// ---------- S9: the car rolls through the Forum at walking speed, crowds following ----------
export const S9 = carShot({
  Bg: (t) => <Forum t={t + 80} />,
  car: { x: [700, 1200], s: 0.55, ease: 'lin' },
  cam: { from: [960, 600, 1.05], to: [1060, 600, 1.1] },
  front: (t) => <Crowd x0={-200} x1={2200} y={1010} s={0.9} rows={2} t={t} cheer={0.3} seed={8} />,
});

// ---------- S10: music from the car, the crowd dancing (badly) ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <Forum t={t + 120} crowd={1} cheer={0.9} />
    <Car x={960} y={GROUND + 80} s={0.65} t={t} bounce={Math.abs(Math.sin(t / 2.5)) * 8} id="c3s10" inside={<CarHeads t={t} you={{ expr: 'happy', headTilt: Math.sin(t / 5) * 10 }} mo={{ expr: 'cool', headTilt: Math.sin(t / 5 + 1) * 12 }} />} />
    <Notes x={960} y={520} t={t} s={1.2} n={6} />
    {CITIZENS.slice(0, 4).map((l, i) => {
      const x = [420, 600, 1340, 1520][i];
      const b = Math.sin(t / 4 + i * 1.3);
      return <Hero key={i} look={l} pose={onGround(x, 0.8, { y: GROUND + 60 - 112 + Math.abs(b) * -10, yaw: i < 2 ? 0.4 : -0.4, expr: 'happy', armL: { a: 120 + b * 40, b: 30 }, armR: { a: 60 - b * 50, b: -40 }, tilt: b * 12, legL: { a: b * 20, b: 0 }, blink: idleBlink(t, i) })} />;
    })}
  </g>
);

// ---------- S11: a senator at the car window, holding up a bag of gold ----------
export const S11: React.FC<ShotProps> = ({ t, len, f }) => {
  const sp = span(W, 'senator', 'block');
  const pose: Pose = onGround(1300, 1, { yaw: -0.5, look: -0.6, expr: 'smug', armR: { a: 130, b: 20 }, blink: idleBlink(t, 3), talk: 0 });
  return (
    <g transform={camT(kf(t, [[0, 1080], [len, 1120]]), 600, kf(t, [[0, 1.55], [len, 1.65]]))}>
      <FORUM t={t + 160} />
      <Car x={760} y={GROUND} s={0.95} t={t} id="c3s11" inside={<CarHeads t={t} f={f} you={{ expr: 'neutral', look: 0.8 }} mo={{ expr: 'smug' }} />} />
      <Hero look={SENATOR} pose={pose} />
      <CoinBag x={1400} y={430 + Math.sin(t / 4) * 6} s={0.8} />
    </g>
  );
};

// ---------- S12: the senator riding in the car, toga flapping, thrilled; the car zips past ----------
export const S12 = carShot({
  Bg: (t) => <Forum t={t + 200} />,
  car: { x: [-200, 2200], s: 0.75, ease: 'lin', cast: (t) => (
    <g>
      <Hero look={SENATOR} pose={{ ...onGround(-150), y: -128, scale: 0.62, yaw: 0.6, expr: 'happy', armR: { a: 150, b: 0 }, blink: idleBlink(t, 3) }} shadow={0} />
      <Hero look={YOU} pose={{ ...onGround(110), y: -132, scale: 0.62, yaw: 0.6, expr: 'smug', blink: idleBlink(t, 2) }} shadow={0} />
    </g>
  ) },
  cam: { from: [960, 620, 1.2] },
  front: (t) => <FloatLabel x={1500} y={300} t={t - 8} text="x5" color="#FFD23A" size={90} />,
  back: () => null,
});

// ---------- S13: kids running alongside the car ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const cx = kf(t, [[0, 600], [len, 1300]]);
  return (
    <g transform={camT(cx + 100, 620, 1.35)}>
      <Forum t={t + 240} />
      <Car x={cx} y={GROUND} s={0.7} t={t} spin={t * 8} id="c3s13" inside={<CarHeads t={t} you={{ expr: 'happy' }} mo={{ expr: 'happy' }} />} />
      {[0, 1, 2, 3].map((k) => (
        <Hero key={k} look={CITIZENS[k + 1]} pose={walkPose(cx - 380 + k * 260, t * 0.9 + k, GROUND + 20, 0.6, { expr: 'happy', armR: { a: 140, b: 0 } }, 1)} />
      ))}
    </g>
  );
};

// ---------- S14: the windscreen wipers sweep, kids' faces pressed close ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 2.2], [len, 2.35]]))}>
    <FORUM t={t + 280} />
    <CarFront x={960} y={GROUND + 60} s={1.1} wipe={t / 24} id="c3s14" inside={<CarHeads t={t} you={{ x: -60, y: -150, yaw: 0, expr: 'smug' }} mo={{ x: 60, y: -150, yaw: 0, expr: 'shock' }} />} />
    {[640, 1280].map((x, i) => (
      <Hero key={i} look={CITIZENS[i + 2]} pose={onGround(x, 0.6, { y: GROUND + 60 - 84, yaw: i ? -0.5 : 0.5, expr: 'shock', look: i ? -0.8 : 0.8, armR: { a: 120, b: 30 }, blink: idleBlink(t, i + 5) })} />
    ))}
  </g>
);

// ---------- S15: Mo, just as amazed ----------
export const S15 = faceCU({ look: MO, Bg: FORUM, faces: [[0, 'shock']], yaw: 0.2, zoom: [3.4, 3.6], glint: 0.6, glintColor: '#FFE27A' });

// ---------- S16: Rome at night: torches and the moon ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <NIGHT t={t + 20} />
    <Car x={1100} y={GROUND + 60} s={0.6} flip t={t} id="c3s16" />
    <Crowd x0={-200} x1={2200} y={1000} s={0.9} rows={2} t={t} dark={0.8} seed={4} facing="back" />
  </g>
);

// ---------- S17: the headlights switch on: the whole street lit white ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const on = clamp((t - 4) / 2);
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <NIGHT t={t + 60} />
      <rect x={-600} y={-500} width={3100} height={2100} fill="#FFF6D0" opacity={0.12 * on} />
      <CarFront x={960} y={GROUND + 120} s={0.85} lights={on} high={on * 0.8} id="c3s17" />
      <Crowd x0={-200} x1={700} y={1000} s={1} rows={2} t={0} seed={5} cheer={0} />
      <Crowd x0={1250} x1={2200} y={1000} s={1} rows={2} t={0} seed={6} cheer={0} />
      <rect x={-600} y={-500} width={3100} height={2100} fill="#05050F" opacity={0.45 * (1 - on)} />
    </g>
  );
};

// ---------- S18: a thousand people scream ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960 + Math.sin(t * 2) * 6, 600, kf(t, [[0, 1.3], [len, 1.2]]))}>
    <NIGHT t={t + 100} />
    <Glow x={960} y={700} r={900} o={0.6} />
    <Crowd x0={-200} x1={2200} y={760} s={0.8} rows={3} t={t * 3} cheer={1} seed={9} />
    <Crowd x0={-200} x1={2200} y={1040} s={1.2} rows={2} t={t * 3} cheer={1} seed={10} />
  </g>
);

// ---------- S19: the Circus Maximus ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 800], [len, 1100]]), kf(t, [[0, 500], [len, 560]]), kf(t, [[0, 1.15], [len, 1.0]]))}>
    <CIRC t={t} cheer={0.6} />
  </g>
);

// ---------- S20: 150,000 seats ----------
export const S20 = factCard({ value: 150000, label: 'SEATS IN THE CIRCUS MAXIMUS', sub: 'Dionysius of Halicarnassus; Encyclopaedia Britannica', format: (v) => Math.round(v).toLocaleString('en-US') });

// ---------- S21: the charioteer points at you: race ----------
export const S21: React.FC<ShotProps> = ({ t, len, f }) => {
  const pose: Pose = onGround(760, 1, { yaw: 0.5, look: 0.7, expr: 'smug', armR: { a: 100, b: 0 }, handR: 'point', blink: idleBlink(t, 2), tilt: Math.sin(t / 20) * 2 });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 600, kf(t, [[0, 1.45], [len, 1.6]]))}>
      <CIRC t={t + 80} cheer={0.4} />
      <ChariotTeam x={160} y={GROUND} s={0.8} t={t} run={0} driver={{ expr: 'neutral' }} />
      <Hero look={CHARIOTEER} pose={pose} />
      <Car x={1500} y={GROUND} s={0.7} flip t={t} id="c3s21" inside={<CarHeads t={t} f={f} you={{ expr: 'smug' }} mo={{ expr: 'shock' }} />} />
    </g>
  );
};

// ---------- S22: four horses against the car at the start line ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <CIRC t={t + 120} cheer={0.7} />
    <ChariotTeam x={260} y={GROUND - 70} s={0.75} t={t} run={0} />
    <Car x={700} y={GROUND + 110} s={0.68} t={t} id="c3s22" lights={1} inside={<CarHeads t={t} you={{ expr: 'cool', glasses: 1 }} mo={{ expr: 'happy' }} />} />
    <FloatLabel x={600} y={330} t={t - 4} text="4 HORSES" color="#F6EFE3" size={64} />
    <FloatLabel x={1300} y={420} t={t - 18} text="150 HP" color="#FFD23A" size={80} />
  </g>
);

// ---------- S23: the chariot leads, the car cruising behind, the track flying past ----------
export const S23: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 620, 0.95)}>
    <Circus t={t + 160} cheer={0.8} scroll={t * 30} spina={false} />
    <ChariotTeam x={900} y={GROUND - 40} s={0.65} t={t} run={1.4} />
    <Car x={250} y={GROUND + 90} s={0.6} t={t} spin={t * 30} id="c3s23" inside={<CarHeads t={t} you={{ expr: 'smug' }} mo={{ expr: 'neutral' }} />} />
  </g>
);

// ---------- S24: foot down: the car roars past ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 250], [len, 2300]], (p) => p * p);
  return (
    <g transform={camT(960 + Math.sin(t * 2.5) * 4, 620, 0.95)}>
      <Circus t={t + 200} cheer={1} scroll={t * 30} spina={false} />
      <ChariotTeam x={900} y={GROUND - 40} s={0.65} t={t} run={1.4} driver={{ expr: 'shock' }} />
      <Car x={x} y={GROUND + 90} s={0.6} t={t} spin={t * 60} dust={0.8} id="c3s24" inside={<CarHeads t={t} you={{ expr: 'happy', tilt: -8 }} mo={{ expr: 'shock', tilt: -12 }} />} />
    </g>
  );
};

// ---------- S25: three laps clear: the lap dolphins tip, the crowd on its feet ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1400], [len, 1550]]), 700, 1.35)}>
    <Circus t={t + 240} cheer={1} laps={Math.min(7, 4 + Math.floor(t / 10))} />
    <Car x={kf(t, [[0, 900], [len, 1900]])} y={GROUND + 140} s={0.55} t={t} spin={t * 30} id="c3s25" />
    <FloatLabel x={1550} y={420} t={t - 6} text="+3 LAPS" color="#FFD23A" size={90} />
  </g>
);

// ---------- S26: Mo up through the sunroof, arms in the air: "We're legends!" ----------
export const S26: React.FC<ShotProps> = ({ t, len, f }) => {
  const sp = span(W, "We're", 'legends');
  const open = talkAt(W, f, 30, [sp]);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 960]]), 560, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <CIRC t={t + 280} cheer={1} />
      <Hero look={MO} pose={{ ...onGround(910, 0.9), y: GROUND + 40 - 300 * 0.9 - Math.abs(Math.sin(t / 4)) * 6, yaw: 0.1, expr: 'happy', armL: { a: 150 + Math.sin(t / 3) * 10, b: 10 }, armR: { a: 150 - Math.sin(t / 3) * 10, b: -10 }, talk: open, blink: idleBlink(t, 4) }} shadow={0} />
      <Car x={960} y={GROUND + 40} s={0.9} t={t} sunroof id="c3s26" inside={<CarHeads t={t} mo={null} you={{ expr: 'happy' }} />} />
    </g>
  );
};

// ---------- S27: the fuel gauge: already at half ----------
export const S27 = fuelShot(0.62, 0.5, 0);
