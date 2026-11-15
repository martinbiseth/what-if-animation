import React from 'react';
import { Hero, Pose, ShotProps, camT, clamp, kf, easeOut, backOut, idleBlink, faceAt, FONT, Drone, DroneCase, Controller, Camel, Spear, Giza, egyptHip, lerp } from '../../../engine';
import { YOU, WORKER, WORKER3, GUARD, GizaSet, at, propCU, faceCU, screenCU, povShot, viewGiza, droneShot, talkShot, crowd, HeldController, Soft, bigWord } from '../common';

// Chapter 1, the cold open: the case, the arms, the button, the scream into the sky; Giza reacts (ropes, camel, the
// old man), the view from above, two spears, the shouting, "this is Egypt", 91 percent, the question. 24+ cuts a minute.

const DAY = GizaSet('day');
const PANIC = GizaSet('day', { scatter: 1 });

// ---------- S1: insert, the case opens on the sand ----------
export const S1 = propCU({
  Bg: DAY, bgCam: [600, 760, 1.6],
  draw: (t) => (
    <g>
      <rect x={-200} y={700} width={2400} height={600} fill="#D9AE6E" />
      <DroneCase x={960} y={720} s={1.5} open={easeOut(clamp((t - 4) / 12))} t={t} />
    </g>
  ),
});

// ---------- S2: insert, you unfold the four arms ----------
export const S2 = propCU({
  Bg: DAY, bgCam: [600, 760, 1.6], push: 0.1,
  draw: (t) => (
    <g>
      <rect x={-200} y={700} width={2400} height={600} fill="#D9AE6E" />
      <ellipse cx={960} cy={820} rx={360} ry={50} fill="#000" opacity={0.2} />
      <Drone x={960} y={680} s={1.7} on={false} folded={t < 14} lights={t > 14} t={t} />
      <g transform={`translate(${t < 14 ? 1420 : 1500} ${t < 14 ? 640 : 560})`}>
        <path d="M 60 40 L 400 300" stroke="#F07A2A" strokeWidth={110} strokeLinecap="round" />
        <ellipse cx={0} cy={0} rx={60} ry={74} fill="#26232F" stroke="#100E16" strokeWidth={8} />
      </g>
    </g>
  ),
});

// ---------- S3: insert, the controller: your thumb presses the button, the screen lights ----------
export const S3 = screenCU({
  Bg: DAY, view: (t) => <rect width={1920} height={1080} fill={t > 8 ? '#C8A878' : '#101014'} />, battery: 91,
  sticks: (t) => (t > 6 ? [0, -1, 0, -1] : [0, 0, 0, 0]),
});

// ---------- S4: low wide, the drone screams up off the sand in a cloud of dust; you look up ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const rise = easeOut(clamp(t / 30));
  const me: Pose = at(700, { yaw: 0.3, look: 0.6, expr: 'happy', armR: { a: 40, b: -60 }, armL: { a: 20, b: -40 }, blink: idleBlink(t, 2) });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 920]]), kf(t, [[0, 600], [len, 520]]), 1.3)}>
      <Giza t={t + 100} tod="day" id="s4" />
      <ellipse cx={1050} cy={790} rx={260 * (1 - rise * 0.5)} ry={30} fill="#F2DCA8" opacity={0.6 * (1 - rise)} />
      <Hero look={YOU} pose={me} />
      <HeldController pose={me} t={t} />
      <Drone x={1050} y={lerp(770, 280, rise)} s={0.5} t={t} dust={rise < 0.6} />
    </g>
  );
};

// ---------- S5: wide, two thousand workers drop their ropes ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1050], [len, 1000]]), 480, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Giza t={t + 200} tod="day" id="s5" scatter={clamp((t - 6) / 30)} />
    <Drone x={kf(t, [[0, 600], [len, 900]])} y={220} s={0.25} t={t} />
  </g>
);

// ---------- S6: a camel bolts across the sand ----------
export const S6: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 560, 1.4)}>
    <Giza t={t + 300} tod="day" id="s6" sledge={false} />
    <Camel x={lerp(1500, 300, clamp(t / 45))} y={EGF} s={1.2} t={t} run />
    <path d={`M ${lerp(1700, 500, clamp(t / 45))} ${EGF - 20} q 120 -40 260 0`} stroke="#F2DCA8" strokeWidth={30} opacity={0.4} fill="none" strokeLinecap="round" />
  </g>
);
const EGF = 800;

// ---------- S7: medium, an old man falls to his knees, arms up ----------
export const S7: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(clamp(t / 10));
  const man: Pose = { ...at(960, {}, 1), y: egyptHip(1) + k * 70, yaw: 0.1, look: 0, expr: 'shock', legL: { a: -60 * k, b: 110 * k }, legR: { a: -60 * k, b: 110 * k }, armL: { a: 30 + 120 * k, b: 10 }, armR: { a: 30 + 120 * k, b: 10 }, headTilt: -8 * k, blink: idleBlink(t, 4) };
  return (
    <g transform={camT(960, 560, 1.8)}>
      <Giza t={t + 400} tod="day" id="s7" sledge={false} />
      <Hero look={{ ...WORKER3, hair: '#C8C2B8' }} pose={man} />
    </g>
  );
};

// ---------- S8: insert, the screen: all of it from above ----------
export const S8 = screenCU({ Bg: DAY, view: viewGiza({ z: [0.5, 0.56], len: 90 }), battery: 91, sticks: () => [0, 0, 0.2, -0.4] });

// ---------- S9: the drone's camera: the pyramid half finished ----------
export const S9 = povShot({ view: viewGiza({ cx: 1100, cy: 560, z: [0.85, 1.05], len: 110 }), battery: 91, alt: (t) => 110 + t * 0.2 });

// ---------- S10: the camera tilts toward the crowd: thousands of tiny people staring up ----------
export const S10 = povShot({ view: viewGiza({ cx: 900, cy: 1060, z: [1.6, 1.8], len: 110 }), battery: 91, alt: 96 });

// ---------- S11: medium, a soldier hurls a spear ----------
export const S11: React.FC<ShotProps> = ({ t }) => {
  const wind = easeOut(clamp(t / 8));
  const thr = easeOut(clamp((t - 9) / 4));
  const g: Pose = at(820, { yaw: 0.5, look: 0.9, expr: 'shock', tilt: -10 * wind + 18 * thr, armR: { a: 150 - 40 * thr, b: 30 - 30 * thr }, armL: { a: 60, b: -20 }, legL: { a: 18, b: 0 }, legR: { a: -14, b: 0 }, blink: idleBlink(t, 5) });
  return (
    <g transform={camT(980, 540, 1.6)}>
      <Giza t={t + 500} tod="day" id="s11" sledge={false} />
      <Hero look={GUARD} pose={g} />
      {t < 11 ? <Spear x={760} y={330} rot={-30} s={0.9} /> : <Spear x={lerp(900, 1700, clamp((t - 11) / 8))} y={lerp(330, 0, clamp((t - 11) / 8))} rot={-30} s={0.9} />}
    </g>
  );
};

// ---------- S12/S13: the drone slips sideways, the spear flies past: miss ----------
const missShot = (dir: 1 | -1, textAt: number, dodgeAt: number): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const dodge = backOut(clamp((t - dodgeAt) / 7));
    const sp = clamp((t - dodgeAt + 4) / 12);
    return (
      <g transform={camT(960, 420, 1.5)}>
        <Giza t={t + 600} tod="day" id={`miss${dir}`} sledge={false} pyrX={1400} />
        <Drone x={960 + dir * dodge * 160} y={360} s={0.75} t={t} tilt={dir * 20 * Math.sin(dodge * Math.PI)} />
        <Spear x={lerp(dir > 0 ? 500 : 1500, dir > 0 ? 1500 : 400, sp)} y={lerp(560, 280, sp)} rot={dir > 0 ? -16 : 196} s={0.8} />
        {t > textAt ? <text x={960} y={760} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#F6EFE3" stroke="#0B0816" strokeWidth={14} paintOrder="stroke" transform={`rotate(-4 960 760)`}>MISS</text> : null}
      </g>
    );
  };
  return Shot;
};
export const S12 = missShot(1, 3, 0);
export const S13 = missShot(-1, 34, 22);

// ---------- S14: close, a worker shouts a word you don't understand ----------
export const S14 = faceCU({ look: WORKER, Bg: DAY, faces: [[0, 'shock']], yaw: -0.3, look_: 0.2, pose: { headTilt: -10, armR: { a: 150, b: 20 }, handR: 'point' }, bgCam: [1100, 400, 1.6] });

// ---------- S15: wide, everyone shouting it, arms in the air ----------
export const S15 = talkShot({
  Set: PANIC, setT: 800,
  cast: crowd(7, 300, 1650, 3, { expr: 'shock', arms: 'up', faceTo: 960 }),
  cam: { from: [960, 520, 1.15], to: [960, 500, 1.22] },
  front: (t) => <Drone x={960} y={kf(t, [[0, 140], [90, 120]])} s={0.3} t={t} />,
});

// ---------- S16: the title of the place: Giza, about 2560 BC ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1150, 430, kf(t, [[0, 0.9], [len, 1.0]]))}>
      <Giza t={t + 900} tod="gold" id="s16" />
    </g>
    <rect width={1920} height={1080} fill="#1A0E10" opacity={0.25} />
    <g transform={`translate(960 860) scale(${backOut(clamp((t - 4) / 10))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FFD45A" stroke="#1A0E10" strokeWidth={14} paintOrder="stroke">EGYPT · 2560 BC</text>
    </g>
  </g>
);

// ---------- S17: low, faces turned up at the thing in the sky ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 480]]), 1.5)}>
    <Giza t={t + 1000} tod="gold" id="s17" sledge={false} />
    {crowd(5, 560, 1380, 9, { expr: 'shock', faceTo: 960 }).map((c, i) => (
      <Hero key={i} look={c.look} pose={{ ...at(c.x, { ...c.pose, yaw: c.yaw ?? 0, expr: i === 2 ? 'oops' : 'shock', look: 0, headTilt: -14, blink: idleBlink(t, i + 3) }, c.scale) }} />
    ))}
    <Drone x={960 + Math.sin(t / 20) * 40} y={130} s={0.4} t={t} />
  </g>
);

// ---------- S18: close, you, with the controller: smug ----------
export const S18 = faceCU({ look: YOU, Bg: GizaSet('gold'), faces: [[0, 'happy'], [20, 'smug']], yaw: 0.35, look_: 0.5, pose: { armR: { a: 60, b: -90 } }, bgCam: [1150, 420, 1.4] });

// ---------- S19: insert, the battery reading, big: 91% ----------
export const S19 = propCU({
  Bg: GizaSet('gold'), bgCam: [1150, 420, 1.4], push: 0.1,
  draw: (t) => {
    const p = backOut(clamp((t - 2) / 10));
    return (
      <g transform={`translate(960 540) scale(${p})`}>
        <rect x={-420} y={-170} width={760} height={340} rx={50} fill="#101014" stroke="#F6EFE3" strokeWidth={22} />
        <rect x={340} y={-70} width={60} height={140} rx={14} fill="#F6EFE3" />
        <rect x={-385} y={-135} width={690 * 0.91 * clamp((t - 4) / 16)} height={270} rx={30} fill="#5BE08A" />
        <text x={-40} y={60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#F6EFE3" stroke="#101014" strokeWidth={14} paintOrder="stroke">91%</text>
      </g>
    );
  },
});

// ---------- S20: wide, you and the drone above the half-built pyramid: the question ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = at(760, { yaw: 0.2, look: 0.5, expr: 'neutral', armR: { a: 40, b: -70 }, blink: idleBlink(t, 6), headTilt: -6 });
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 900]]), kf(t, [[0, 480], [len, 560]]), kf(t, [[0, 0.95], [len, 1.4]]))}>
      <Giza t={t + 1100} tod="gold" id="s20" />
      <Hero look={YOU} pose={me} />
      <HeldController pose={me} t={t} />
      <Drone x={1000 + Math.sin(t / 25) * 30} y={420} s={0.32} t={t} />
    </g>
  );
};

// ---------- S21: the title ----------
export const S21 = bigWord({ kicker: 'WHAT IF YOU BROUGHT A DRONE TO', word: 'ANCIENT EGYPT?', size: 170, color: '#FFD45A', Bg: GizaSet('dusk') });
void Soft;
