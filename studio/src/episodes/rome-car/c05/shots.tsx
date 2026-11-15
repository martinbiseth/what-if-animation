import React from 'react';
import { Hero, Pose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, factCard, FONT, walkPose, SchLabel, SCH, DrawOn, FloatLabel, talkAt, LEG_LEN } from '../../../engine';
import { YOU, MO, GUARD, EMPEROR, ENGINEER, CITIZENS, faceCU, wordF, span, SchematicBg, carShot, onGround, fuelShot, CarHeads } from '../common';
import { Country, Forum, Palace, PALACE, GoldRoom, GOLDROOM, GROUND, Car, CarFront, Spear, WaxTablet, Crowd } from '../sets';
import words from './words.json';

// Chapter 5, the emperor: the Praetorian Guard at dawn; marched up the Palatine through flowers and rocks; Trajan in a
// courtyard of marble and gold, circling the car, tapping the glass, admiring himself in the mirror, gripping the
// wheel like a kid; "Show me." Apollodorus (Trajan's Bridge, 1,135 m) opens the bonnet and sketches: "I can copy the
// shape. I cannot copy what is inside." "Then you will drive it for me": a war in the east. Mo stays as a hostage.
// A room of gold you can't leave; a quarter of a tank.

const W = words as { w: string; s: number; e: number }[];
const rel = (a: string, b: string) => wordF(W, b) - wordF(W, a);
const DAWN: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Country t={t} id={id} mode="dusk" stone />;
const PAL: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Palace t={t} id={id} />;
const PF = PALACE.feet;
const onPal = (x: number, s = 1, o: Partial<Pose> = {}): Pose => ({ ...onGround(x, s), y: PF - LEG_LEN * s, ...o });
const guards = (t: number, xs: number[], s = 0.9, face: 'neutral' | 'shock' = 'neutral') =>
  xs.map((x, i) => (
    <g key={i}>
      <Spear x={x + (x < 960 ? 30 : -30) * s} y={GROUND - 20} len={480 * s} rot={x < 960 ? 6 : -6} />
      <Hero look={GUARD} pose={onGround(x, s, { yaw: x < 960 ? 0.5 : -0.5, look: x < 960 ? 0.6 : -0.6, expr: face, armR: { a: 30, b: -60 }, blink: idleBlink(t, i + 3) })} />
    </g>
  ));

// ---------- S1: you wake up in the car seat at dawn ----------
export const S1 = faceCU({ look: YOU, Bg: DAWN, faces: [[0, 'tired'], [14, 'shock']], yaw: 0.3, zoom: [3.4, 3.5], pose: { headTilt: 14 }, light: { x: 1200, y: 480, o: 0.6 } });

// ---------- S2: Praetorian guards round the car ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 620, kf(t, [[0, 1.25], [len, 1.1]]))}>
    <DAWN t={t + 30} />
    <Car x={960} y={GROUND} s={0.75} t={t} id="c5s2" inside={<CarHeads t={t} you={{ expr: 'shock' }} mo={{ expr: 'shock' }} />} />
    {guards(t, [380, 520, 1400, 1540], 0.85)}
  </g>
);

// ---------- S3: the procession through the streets ----------
export const S3 = carShot({
  Bg: (t) => <Forum t={t + 40} />,
  car: { x: [500, 1100], s: 0.6, ease: 'lin', you: { expr: 'worried' }, mo: { expr: 'worried' } },
  cam: { from: [900, 620, 1.1], to: [1100, 620, 1.1] },
  back: (t) => <g>{[0, 1, 2].map((k) => <Hero key={k} look={GUARD} pose={walkPose(80 + k * 120 + t * 4, t * 0.5 + k, GROUND - 30, 0.75, {}, 1)} />)}</g>,
  front: (t) => <g>{[0, 1, 2].map((k) => <Hero key={k} look={GUARD} pose={walkPose(1100 + k * 130 + t * 4, t * 0.5 + k + 1, GROUND + 40, 0.8, {}, 1)} />)}</g>,
});

// ---------- S4: the crowd throws flowers and rocks ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 600, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <Forum t={t + 80} />
    <Car x={960} y={GROUND + 20} s={0.7} t={t} id="c5s4" inside={<CarHeads t={t} you={{ expr: 'worried' }} mo={{ expr: 'oops' }} />} />
    {Array.from({ length: 10 }).map((_, k) => {
      const flower = k % 2 === 0;
      const p = ((t / 24 + k / 10) % 1);
      const sx = k < 5 ? 200 : 1720, ex = 800 + (k % 5) * 80;
      const x = sx + (ex - sx) * p, y = 900 - Math.sin(p * Math.PI) * 400 + p * -200;
      return flower ? (
        <g key={k} transform={`translate(${x} ${y}) rotate(${t * 10 + k * 40})`}>
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx={0} cy={-12} rx={8} ry={12} fill="#F28C9A" transform={`rotate(${a})`} />)}
          <circle r={7} fill="#FFD23A" />
        </g>
      ) : (
        <ellipse key={k} cx={x} cy={y} rx={14} ry={11} fill="#7A7468" stroke="#100E16" strokeWidth={3} />
      );
    })}
    <Crowd x0={-200} x1={2200} y={1040} s={1.1} rows={2} t={t * 2} cheer={0.8} seed={12} />
  </g>
);

// ---------- S5: the courtyard: the emperor waiting ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 1060]]), 560, kf(t, [[0, 1.0], [len, 1.15]]))}>
    <PAL t={t} />
    <Hero look={GUARD} pose={onPal(500, 0.85, { yaw: 0.3, blink: idleBlink(t, 3) })} />
    <Hero look={GUARD} pose={onPal(1600, 0.85, { yaw: -0.3, blink: idleBlink(t, 5) })} />
    <Hero look={EMPEROR} pose={onPal(1180, 1, { yaw: -0.3, look: -0.6, armL: { a: 20, b: -90 }, armR: { a: 20, b: -90 }, blink: idleBlink(t, 7) })} />
    <Car x={kf(t, [[0, 300], [len, 520]], easeOut)} y={PF + 60} s={0.65} t={t} spin={t * 4} id="c5s5" />
  </g>
);

// ---------- S6: the emperor, unreadable ----------
export const S6 = faceCU({ look: EMPEROR, Bg: PAL, faces: [[0, 'neutral']], yaw: -0.25, zoom: [3.2, 3.45], eyes: -0.6 });

// ---------- S7: he walks slowly round the car, three times ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const ph = (t / 70) * Math.PI * 2;
  const x = 960 + Math.cos(ph) * 520;
  const behind = Math.sin(ph) < 0;
  const p = walkPose(x, t * 0.35, PF - 10, 0.95, { expr: 'neutral', yaw: Math.sin(ph) > 0 ? -1 : 1, look: 0, armL: { a: 20, b: -100 }, armR: { a: 20, b: -100 }, blink: idleBlink(t, 7) }, Math.sin(ph) > 0 ? -1 : 1);
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.25], [len, 1.3]]))}>
      <PAL t={t + 40} />
      {behind ? <Hero look={EMPEROR} pose={{ ...p, y: p.y - 30, scale: 0.85 }} /> : null}
      <Car x={960} y={PF + 60} s={0.8} t={t} id="c5s7" />
      {!behind ? <Hero look={EMPEROR} pose={{ ...p, y: p.y + 60 }} /> : null}
    </g>
  );
};

// ---------- S8: his finger taps the windscreen ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const tap = Math.max(0, Math.sin(t / 3.5)) ** 4;
  return (
    <g transform={camT(1000, 520, kf(t, [[0, 2.4], [len, 2.6]]))}>
      <PAL t={t + 80} />
      <CarFront x={900} y={PF + 120} s={1.1} id="c5s8" />
      <Hero look={EMPEROR} pose={onPal(1260, 1.05, { y: PF + 120 - LEG_LEN * 1.05, yaw: -0.5, look: -0.8, expr: 'neutral', armR: { a: 100 + tap * 6, b: 10 }, handR: 'point', blink: idleBlink(t, 7) })} />
      {tap > 0.6 ? <circle cx={1050} cy={400} r={20 + tap * 20} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.6} /> : null}
    </g>
  );
};

// ---------- S9: the emperor's face in the side mirror ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, 1.4)} filter="url(#blur10)">
      <PAL t={t + 120} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.3} />
    <g transform={`translate(960 560) scale(${kf(t, [[0, 1], [len, 1.06]])})`}>
      <path d="M -520 -300 L 500 -340 Q 560 -330 560 -260 L 540 260 Q 530 320 470 320 L -480 300 Q -560 290 -560 220 L -580 -220 Q -580 -290 -520 -300 Z" fill="#D8352B" stroke="#100E16" strokeWidth={14} />
      <clipPath id="c5mir">
        <path d="M -470 -250 L 460 -290 Q 500 -280 500 -240 L 486 220 Q 480 260 440 260 L -440 244 Q -500 236 -500 190 L -516 -190 Q -516 -240 -470 -250 Z" />
      </clipPath>
      <g clipPath="url(#c5mir)">
        <rect x={-600} y={-400} width={1200} height={800} fill="#8AA8C8" />
        <g transform="translate(0 220) scale(2.8)">
          <Hero look={EMPEROR} pose={{ ...onPal(0, 1), x: 0, y: 0, yaw: 0.15, expr: t > 30 ? 'smug' : 'neutral', headTilt: Math.sin(t / 15) * 6, blink: idleBlink(t, 7) }} shadow={0} />
        </g>
        <path d="M -400 -240 L -200 -250 L -440 240 L -500 200 Z" fill="#FFFFFF" opacity={0.15} />
      </g>
    </g>
  </g>
);

// ---------- S10: the emperor at the wheel, delighted like a kid ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1020, 560, kf(t, [[0, 2.0], [len, 2.15]]))}>
    <PAL t={t + 160} />
    <Car x={960} y={PF + 60} s={0.95} t={t} id="c5s10" inside={<Hero look={EMPEROR} pose={{ ...onPal(0, 0.62), x: 110, y: -132, yaw: 0.6, look: 0.7, expr: t > 12 ? 'happy' : 'neutral', armR: { a: 70, b: -60 }, headTilt: Math.sin(t / 4) * 4, blink: idleBlink(t, 7) }} shadow={0} />} />
  </g>
);

// ---------- S11: "A chariot that needs no horses. Show me." ----------
export const S11 = faceCU({ look: EMPEROR, Bg: PAL, faces: [[0, 'smug']], yaw: -0.3, zoom: [3.3, 3.45], words: W, talk: [span(W, 'A', 'me')[0], span(W, 'A', 'me')[1]] as [number, number], eyes: -0.6 });

// ---------- S12: you drive a lap of the courtyard; he watches ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / Math.max(1, len));
  const x = 300 + p * 1400;
  return (
    <g transform={camT(960, 560, 1.05)}>
      <PAL t={t + 200} />
      <Hero look={EMPEROR} pose={onPal(1500, 0.85, { y: PF - 60 - LEG_LEN * 0.85, yaw: -0.2, look: (x - 1300) / 800, armL: { a: 20, b: -90 }, armR: { a: 20, b: -90 }, blink: idleBlink(t, 7) })} />
      <Car x={x} y={PF + 120} s={0.6} t={t} spin={t * 10} id="c5s12" inside={<CarHeads t={t} you={{ expr: 'worried' }} mo={{ expr: 'worried' }} />} />
    </g>
  );
};

// ---------- S13: the emperor, thinking ----------
export const S13 = faceCU({ look: EMPEROR, Bg: PAL, faces: [[0, 'neutral'], [20, 'smug']], yaw: 0.4, zoom: [3.5, 3.7], eyes: 0.8, pose: { armR: { a: 150, b: 110 } } });

// ---------- S14: Apollodorus the engineer strides in ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.1], [len, 1.2]]))}>
    <PAL t={t + 240} />
    <Car x={760} y={PF + 80} s={0.7} t={t} id="c5s14" />
    <Hero look={EMPEROR} pose={onPal(1180, 0.9, { yaw: -0.5, armL: { a: 60, b: 0 }, blink: idleBlink(t, 7) })} />
    <Hero look={ENGINEER} pose={walkPose(kf(t, [[0, 1820], [len, 1480]]), t * 0.5, PF, 0.9, { expr: 'neutral' }, -1)} />
    <WaxTablet x={kf(t, [[0, 1820], [len, 1480]]) - 60} y={PF - 180} s={0.35} rot={-20} />
  </g>
);

// ---------- S15: Trajan's Bridge over the Danube: 1,135 m ----------
export const S15: React.FC<ShotProps> = ({ t }) => {
  const arches = Array.from({ length: 10 }).map((_, i) => `M ${260 + i * 140} 700 Q ${330 + i * 140} 560 ${400 + i * 140} 700`).join(' ');
  return (
    <g>
      <SchematicBg t={t} />
      <path d="M 120 760 Q 960 800 1800 760" stroke="#2A4A72" strokeWidth={60} fill="none" opacity={0.6} />
      <DrawOn d="M 200 560 L 1720 560" t={t - 4} dur={20} color={SCH.line} width={8} />
      <DrawOn d={arches} t={t - 10} dur={30} color={SCH.line} width={6} />
      {Array.from({ length: 11 }).map((_, i) => <DrawOn key={i} d={`M ${260 + i * 140} 560 L ${260 + i * 140} 760`} t={t - 8 - i} dur={10} color={SCH.line} width={10} />)}
      <SchLabel x={960} y={200} t={t - 2} text="TRAJAN'S BRIDGE OVER THE DANUBE, AD 105" size={40} color={SCH.dim} />
      <SchLabel x={960} y={420} t={t - 30} text="1,135 METRES" size={90} color={SCH.live} />
      <SchLabel x={960} y={900} t={t - 40} text="BUILT BY APOLLODORUS OF DAMASCUS" size={34} />
    </g>
  );
};

// ---------- S16: the engineer at the open bonnet, sketching ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.6], [len, 1.75]]))}>
    <PAL t={t + 280} />
    <CarFront x={820} y={PF + 80} s={1} id="c5s16" />
    {/* the bonnet propped up */}
    <path d="M 660 650 L 980 650 L 1000 430 L 640 430 Z" fill="#B82A22" stroke="#100E16" strokeWidth={6} />
    <path d="M 680 700 L 960 700" stroke="#3A3A44" strokeWidth={40} />
    <Hero look={ENGINEER} pose={onPal(1250, 0.95, { yaw: -0.4, look: -0.7, expr: 'neutral', armL: { a: 50, b: -100 }, armR: { a: 40, b: -80 + Math.sin(t / 2) * 12 }, blink: idleBlink(t, 5) })} />
    <WaxTablet x={1190} y={PF - 230} s={0.5} rot={-12} />
  </g>
);

// ---------- S17: "I can copy the shape. I cannot copy what is inside." ----------
export const S17 = faceCU({
  look: ENGINEER, Bg: PAL, faces: [[0, 'neutral'], [40, 'worried']], yaw: 0.3, zoom: [3.1, 3.3], words: W,
  talk: [span(W, 'I', 'inside')[0], span(W, 'I', 'inside')[1]] as [number, number],
  pose: { armR: { a: 40, b: -90 } },
  extra: () => (
    <g transform="translate(1080 640) rotate(-8)">
      <WaxTablet x={0} y={0} s={0.7} />
      <path d="M -40 10 L -30 -10 L 20 -12 L 40 10 Z M -30 10 a 8 8 0 1 0 1 0 M 30 10 a 8 8 0 1 0 1 0" stroke="#E8DCC0" strokeWidth={3} fill="none" />
      <text x={0} y={32} textAnchor="middle" fontFamily={FONT.hand} fontSize={22} fill="#E8DCC0">???</text>
    </g>
  ),
});

// ---------- S18: the emperor to you: "Then you will drive it for me." ----------
export const S18: React.FC<ShotProps> = ({ t, len, f }) => {
  const sp = span(W, 'Then', 'me');
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 560, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <PAL t={t + 320} />
      <Hero look={YOU} pose={onPal(720, 0.95, { yaw: 0.5, look: 0.7, expr: 'worried', blink: idleBlink(t, 2) })} />
      <Hero look={EMPEROR} pose={onPal(1180, 1, { yaw: -0.5, look: -0.7, expr: 'smug', armR: { a: 80, b: -10 }, handR: 'point', talk: talkAt(W, f, 30, [sp]), blink: idleBlink(t, 7) })} />
    </g>
  );
};

// ---------- S19: a war in the east: arrows across the map ----------
const EMPIRE = 'M 160 380 Q 400 250 700 300 Q 1000 230 1300 300 Q 1560 330 1720 520 Q 1780 700 1680 820 Q 1500 860 1300 800 Q 1000 860 700 820 Q 400 840 220 740 Q 120 600 160 380 Z';
export const S19: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SchematicBg t={t} />
    <path d={EMPIRE} fill="none" stroke={SCH.dim} strokeWidth={5} />
    <circle cx={860} cy={500} r={14} fill={SCH.live} />
    {[0, 1, 2].map((k) => <DrawOn key={k} d={`M 900 ${480 + k * 30} Q 1300 ${380 + k * 60} 1820 ${560 + k * 40}`} t={t - 4 - k * 6} dur={26} color="#FF4A3A" width={10} />)}
    <SchLabel x={1700} y={460} t={t - 30} text="THE EAST" size={44} color="#FF4A3A" />
    <SchLabel x={960} y={180} t={t - 2} text="A WAR IS COMING" size={46} color={SCH.dim} />
  </g>
);

// ---------- S20: you explain the fuel; he turns away ----------
export const S20: React.FC<ShotProps> = ({ t, len, f }) => {
  const sp = span(W, 'try', 'fuel');
  const away = clamp((t - rel('try', 'care')) / 8);
  return (
    <g transform={camT(940, 560, kf(t, [[0, 1.6], [len, 1.65]]))}>
      <PAL t={t + 360} />
      <Hero look={YOU} pose={onPal(720, 0.95, { yaw: 0.5, look: 0.7, expr: 'worried', armR: { a: 60 + Math.sin(t / 3) * 20, b: -60 }, armL: { a: 50, b: -40 }, talk: talkAt(W, f, 30, [sp]), blink: idleBlink(t, 2) })} />
      <Hero look={EMPEROR} pose={onPal(1180, 1, { yaw: -0.5 + away * 1.4, look: -0.7 + away * 1.5, expr: 'neutral', armL: { a: 20, b: -100 }, blink: idleBlink(t, 7) })} />
    </g>
  );
};

// ---------- S21: guards take Mo by the arms ----------
export const S21: React.FC<ShotProps> = ({ t, len, f }) => {
  const sp = span(W, 'Your', 'agree');
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 560, kf(t, [[0, 1.45], [len, 1.55]]))}>
      <PAL t={t + 400} />
      <Hero look={GUARD} pose={onPal(780, 0.95, { yaw: 0.4, armR: { a: 70, b: -20 }, blink: idleBlink(t, 3) })} />
      <Hero look={MO} pose={onPal(960, 0.9, { yaw: 0.1, expr: 'shock', armL: { a: 60, b: 0 }, armR: { a: 60, b: 0 }, squash: Math.sin(t / 3) * 0.02, blink: idleBlink(t, 4) })} />
      <Hero look={GUARD} pose={onPal(1140, 0.95, { yaw: -0.4, armR: { a: 70, b: -20 }, blink: idleBlink(t, 5) })} />
      <Hero look={EMPEROR} pose={onPal(1560, 0.9, { yaw: -0.6, expr: 'smug', talk: talkAt(W, f, 30, [sp]), blink: idleBlink(t, 7) })} />
    </g>
  );
};

// ---------- S22: alone in the gold room ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const p = GOLDROOM.P(0.3, 0.8, 0.2);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 900]]), 560, kf(t, [[0, 1.05], [len, 1.3]]))}>
      <GoldRoom t={t} />
      <Hero look={YOU} pose={{ ...onGround(p.x, 0.62), y: p.y - 70, yaw: 0.3, expr: 'tired', legL: { a: 80, b: -80 }, legR: { a: 76, b: -76 }, armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 }, headTilt: 8, blink: idleBlink(t, 2) }} />
    </g>
  );
};

// ---------- S23: the fuel gauge: one quarter ----------
export const S23 = fuelShot(0.32, 0.25, 0);
