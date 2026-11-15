import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, chapterCard, Schematic, SchLabel, SCH,
  bedSit, BedDuvet, Bedroom, CLS, stand, talkShot, FocusRings, Sparkle, rnd, UI, FloatLabel,
} from '../../../engine';
import { YOU, ELLIE, TEACHER, faceCU, bigWord, Soft, cues, BED_NIGHT, CLASS, iqCard, DoublingBars, IqHud, live, Icon, asleep } from '../common';
import words from './words.json';

// Chapter 2, the rules: 100 yesterday, 200 today, 400, 800; every morning at seven, while you sleep; how rare 200 is
// (one in 76 billion, eight billion alive); faster, not just more; you notice everything; it can't be stopped; and
// the plant: it only happens to you. Ellie in the doorway as we say it.

const { rel } = cues(words);

/** The IQ bell curve on the schematic, 40 to 220; a dot at `iq` (it can fly past the edge). */
const Bell: React.FC<{ t: number; iq: number; label?: string; zoom?: number; tail?: number }> = ({ t, iq, label, zoom = 1, tail = 0 }) => {
  const X = (q: number) => 960 + (q - 100) * 9 * zoom;
  const Y = (q: number) => 820 - 520 * Math.exp(-Math.pow((q - 100) / 15, 2) / 2);
  let d = `M ${X(40)} 820`;
  for (let q = 40; q <= 230; q += 2) d += ` L ${X(q)} ${Y(q)}`;
  const draw = clamp(t / 16);
  const dx = X(iq), dy = Y(iq) - 24;
  return (
    <g>
      <path d={`M 120 820 L 1800 820`} stroke={SCH.dim} strokeWidth={4} />
      <path d={d + ` L ${X(230)} 820 Z`} fill={SCH.live} opacity={0.12 * draw} />
      <path d={d} stroke={SCH.line} strokeWidth={8} fill="none" strokeDasharray={4000} strokeDashoffset={4000 * (1 - draw)} />
      {[70, 100, 130, 160, 200].map((q) => X(q) < 1840 ? (
        <g key={q}>
          <path d={`M ${X(q)} 820 L ${X(q)} 840`} stroke={SCH.dim} strokeWidth={4} />
          <text x={X(q)} y={880} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill={SCH.dim}>{q}</text>
        </g>
      ) : null)}
      {tail > 0 ? <path d={`M ${X(180)} 812 L ${X(230)} 812`} stroke="#FF4A3A" strokeWidth={10} opacity={tail} /> : null}
      <circle cx={dx} cy={dy} r={22} fill="#FFD23A" stroke="#100E16" strokeWidth={5} />
      <Glow x={dx} y={dy} r={80} o={0.7} />
      {label ? <text x={dx} y={dy - 46} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">{label}</text> : null}
    </g>
  );
};

// ---------- S1: chapter card ----------
export const S1 = chapterCard({ kicker: 'CHAPTER 2', title: 'THE RULES', ground: 'schematic' });

// ---------- S2: the bell curve: most people near 100; a dot at 100: YOU, YESTERDAY ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}><Schematic t={t} id="c2s2" /></g>
    <SchLabel x={960} y={160} t={t - 4} text="IQ: MOST PEOPLE" size={44} color={SCH.dim} />
    <Bell t={t} iq={100} label={t > rel('Most', 'Yesterday') ? 'YOU, YESTERDAY' : '100'} />
  </g>
);

// ---------- S3: TODAY: 200 ----------
export const S3 = iqCard({ kicker: 'TODAY', iq: 200, from: 100, Bg: BED_NIGHT });

// ---------- S4: the bars: 200, 400, 800, each one twice the last ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}><Schematic t={t} id="c2s4" /></g>
    <SchLabel x={960} y={150} t={t - 2} text="EVERY DAY, TWICE AS MUCH" size={44} color={SCH.live} />
    <g transform="translate(0 -40)">
      <DoublingBars t={t} days={4} at={-10} step={rel('Tomorrow', 'Then') / 2 + 4} label={(d) => `${100 * Math.pow(2, d)}`} />
    </g>
  </g>
);

// ---------- S5: night, you asleep; the clock rolls to 07:00 and a ring of light goes through your head ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.12);
  const flip = rel('Every', 'brain');
  return (
    <g transform={camT(kf(t, [[0, b.x + 200], [len, b.x + 160]]), b.y - 40, kf(t, [[0, 1.7], [len, 1.9]]))}>
      <Bedroom t={t + 400} duvet={false} clock={t >= flip ? '07:00' : '06:59'} lamp={0} veil={0.72} />
      <Hero look={YOU} pose={{ ...basePose, ...asleep(b, t) } as Pose} shadow={0} />
      <BedDuvet />
      <FocusRings x={b.x} y={b.y - 150 * b.scale} t={t - flip} r0={30} color="#FFD23A" />
      {t >= flip ? <Glow x={b.x} y={b.y - 150 * b.scale} r={160} o={0.6 * clamp(1 - (t - flip) / 40)} /> : null}
    </g>
  );
};

// ---------- S6: how rare is 200? the dot slides out to the far tail; ONE IN 76 BILLION ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const slide = easeOut(clamp((t - 6) / 26));
  const iq = 100 + 100 * slide;
  const num = rel('How', 'seventy');
  return (
    <g>
      <g transform={camT(960, 540, 1)}><Schematic t={t} id="c2s6" /></g>
      <g transform="translate(-380 0)">
        <Bell t={t + 20} iq={iq} label={`${Math.round(iq)}`} zoom={0.9} tail={clamp((t - 20) / 10)} />
      </g>
      {t > num ? (
        <g transform={`translate(1500 300) scale(${backOut(clamp((t - num) / 9))})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill={SCH.dim}>ONE IN</text>
          <text y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FFD23A">76</text>
          <text y={170} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill={SCH.line}>BILLION PEOPLE</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S7: eight billion alive: a field of tiny people, and not one of them at 200 ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.05], [len, 1]]))}><Schematic t={t} id="c2s7" /></g>
    {Array.from({ length: 120 }).map((_, i) => {
      const x = 260 + (i % 20) * 72, y = 330 + Math.floor(i / 20) * 80;
      const on = clamp((t - i * 0.15) / 4);
      return (
        <g key={i} transform={`translate(${x} ${y}) scale(${on})`} stroke={SCH.dim} strokeWidth={4} fill="none">
          <circle cy={-18} r={10} />
          <path d="M 0 -8 L 0 14 M -12 2 L 12 2 M 0 14 L -8 30 M 0 14 L 8 30" />
        </g>
      );
    })}
    <SchLabel x={960} y={200} t={t - 4} text="8,000,000,000 PEOPLE ALIVE" size={48} color={SCH.line} />
    <SchLabel x={960} y={900} t={t - 20} text="EXPECTED AT IQ 200: NOBODY" size={44} color={SCH.live} />
  </g>
);

// ---------- S8: off the chart: the dot leaves the paper; the next one doesn't even fit ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const nxt = rel("You're", 'tomorrow');
  const iq = t < nxt ? 200 : 200 + 200 * easeOut(clamp((t - nxt) / 20));
  return (
    <g>
      <g transform={camT(960, 540, 1)}><Schematic t={t} id="c2s8" /></g>
      <Bell t={t + 30} iq={iq} label={`${Math.round(iq)}`} zoom={1.25} tail={1} />
      {t > nxt + 16 ? <FloatLabel x={1700} y={420} t={t - nxt - 16} text="OFF THE CHART" size={60} color="#FF4A3A" /> : null}
    </g>
  );
};

// ---------- S9: the classroom: you, upright, looking everywhere at once, the room in focus ----------
const NOTICE = CLASS(<g />);
export const S9 = talkShot({
  Set: NOTICE, setT: 200,
  cast: [{ look: YOU, ...stand(CLS, 0.55, 0.62, 0.55), yaw: -0.2, faces: [[0, 'cool']], pose: { headTilt: -4 } }],
  cam: { from: [1000, 560, 1.15], to: [1020, 540, 1.3] },
  front: (t) => <FloatLabel x={1250} y={480} t={(t % 40) - 6} text="FASTER" size={40} />,
});

// ---------- S10: insert, the ceiling: a hairline crack, a focus ring snaps onto it ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A3346" />
    {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${-100 + i * 420} 0 L ${-100 + i * 420} 1080`} stroke="#2E2838" strokeWidth={10} />)}
    <rect x={760} y={120} width={420} height={60} rx={10} fill="#E9E4DA" opacity={0.85} />
    <Glow x={970} y={160} r={300} o={0.4} />
    <path d={`M 700 600 L 760 580 L 800 620 L 870 590 L 920 640 L 990 610 ${t > 6 ? 'L 1060 660 L 1110 640' : ''}`} stroke="#1E1A24" strokeWidth={5} fill="none" />
    <FocusRings x={900} y={610} t={t - 4} r0={40} />
    <g opacity={clamp((t - 10) / 6)}>
      <circle cx={900} cy={610} r={140} fill="none" stroke="#FFD23A" strokeWidth={6} strokeDasharray="20 14" />
      <text x={900} y={810} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#FFD23A">CRACK: 31 CM</text>
    </g>
  </g>
);

// ---------- S11: insert, the teacher's ankles: one striped sock, one spotted ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={10} dim={0.3}><g transform={camT(800, 600, 2.4)}><NOTICE t={t + 300} /></g></Soft>
    <g transform={`translate(960 640) scale(${kf(t, [[0, 1.6], [len, 1.7]])}) translate(-960 -640)`}>
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${960 + sd * 140} 0)`}>
          <rect x={-50} y={300} width={100} height={260} fill="#3B3646" stroke="#100E16" strokeWidth={6} />
          <rect x={-50} y={560} width={100} height={140} fill={sd < 0 ? '#E8322E' : '#2E7DE0'} stroke="#100E16" strokeWidth={6} />
          {sd < 0
            ? [0, 1, 2, 3].map((k) => <rect key={k} x={-50} y={570 + k * 32} width={100} height={14} fill="#F6EFE3" />)
            : [0, 1, 2, 3, 4, 5].map((k) => <circle key={k} cx={-25 + (k % 2) * 50} cy={590 + Math.floor(k / 2) * 40} r={10} fill="#FFD23A" />)}
          <path d={`M -60 700 L 90 700 Q 120 700 120 740 L -60 740 Z`} transform={sd < 0 ? 'scale(-1 1)' : ''} fill="#24202C" stroke="#100E16" strokeWidth={6} />
        </g>
      ))}
      <Sparkle x={820} y={540} t={t - 6} s={1} />
      <Sparkle x={1110} y={560} t={t - 10} s={1} />
    </g>
  </g>
);

// ---------- S12: close-up, you trying to hold your eyes open: you can't stop it ----------
export const S12 = faceCU({ look: YOU, Bg: BED_NIGHT, faces: [[0, 'worried'], [40, 'tired']], yaw: 0.2, zoom: [3.2, 3.5], dark: 0.2, light: { x: 1100, y: 600, kind: 'cool', o: 0.4 } });

// ---------- S13: split: asleep, x2; awake with a mug, x2 anyway ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const a = rel('Sleep', 'doubles'), b = rel('Sleep', 'doubles', 2);
  const half = (side: number, awake: boolean, pop: number) => {
    const bs = bedSit(0.12);
    return (
      <g>
        <svg x={side * 960} y={0} width={960} height={1080} viewBox={`${bs.x - 330} ${bs.y - 360} 660 740`} overflow="hidden">
          <Bedroom t={t + 400} duvet={false} clock="07:00" lamp={awake ? 1 : 0} veil={awake ? 0.5 : 0.75} />
          <Hero look={YOU} pose={awake ? { ...basePose, ...bs, yaw: 0.2, expr: 'tired', blink: idleBlink(t, 3), armR: { a: 70, b: 90 } } : { ...basePose, ...asleep(bs, t) } as Pose} shadow={0} />
          <BedDuvet />
        </svg>
        <text x={side * 960 + 480} y={140} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#F6EFE3">{awake ? 'STAY AWAKE' : 'SLEEP'}</text>
        {pop > 0 ? <text x={side * 960 + 480} y={560} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={200 * backOut(clamp(pop))} fill="#FFD23A" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">×2</text> : null}
      </g>
    );
  };
  return (
    <g>
      {half(0, false, (t - a) / 9)}
      {half(1, true, (t - b) / 9)}
      <rect x={952} y={0} width={16} height={1080} fill="#0B0816" />
    </g>
  );
};

// ---------- S14: ONE MORE RULE ----------
export const S14 = bigWord({ kicker: 'AND', word: 'ONE MORE RULE', color: '#FF8A3D', size: 170 });

// ---------- S15: the Earth on the schematic, dark dots everywhere, one lit: YOU ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.08]]))}>
      <Schematic t={t} id="c2s15" />
      <circle cx={960} cy={540} r={330} fill="#1A2A44" stroke={SCH.line} strokeWidth={8} />
      <path d="M 760 380 Q 840 330 900 400 Q 880 470 800 470 Q 740 440 760 380 Z M 1000 300 Q 1100 280 1150 360 Q 1120 430 1040 420 Q 990 380 1000 300 Z M 900 560 Q 980 540 1020 640 Q 980 760 920 720 Q 870 640 900 560 Z M 1120 520 Q 1200 520 1220 600 Q 1180 650 1130 620 Z" fill="#2E4A6A" stroke={SCH.dim} strokeWidth={4} />
      {Array.from({ length: 60 }).map((_, i) => {
        const a = rnd(2, i) * Math.PI * 2, r = Math.sqrt(rnd(3, i)) * 290;
        return <circle key={i} cx={960 + Math.cos(a) * r} cy={540 + Math.sin(a) * r} r={6} fill={SCH.dim} opacity={0.7} />;
      })}
      <circle cx={1060} cy={460} r={14} fill="#FFD23A" />
      <Glow x={1060} y={460} r={90 + 10 * Math.sin(t / 4)} o={0.8} />
      <SchLabel x={1060} y={410} t={t - 10} text="YOU" size={40} color="#FFD23A" />
    </g>
    <SchLabel x={960} y={970} t={t - rel('It', 'Nobody')} text="NOBODY ELSE IS CHANGING" size={44} color={SCH.line} />
  </g>
);

// ---------- S16: remember that one: the hallway door, Ellie in it, watching you, a slow push ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const e = stand(CLS, 0.5, 0.5, 0.45);
  return (
    <g transform={camT(980, 560, kf(t, [[0, 1.5], [len, 1.9]]))}>
      <Bedroom t={t + 600} clock="07:30" lamp={1} veil={0.55} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0814" opacity={0.25} />
      <Hero look={ELLIE} pose={live(t, { x: 1000, y: 820 - 170 * 0.62, scale: 0.62, yaw: 0, look: 0 }, [[0, 'neutral']], 6)} />
      <Glow x={1000} y={640} r={300} kind="warm" o={0.3} />
      {e ? null : null}
    </g>
  );
};
