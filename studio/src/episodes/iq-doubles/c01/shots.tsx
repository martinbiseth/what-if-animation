import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, TitleCard, Rooftop, AlarmClock, Paper,
  OpenBook, FocusRings, Sparkle, FloatLabel, bedSit, BedDuvet, Bedroom, KITCHEN, KitchenIsland, islandTop, stand, talkShot, Schematic, SchLabel, rnd, faceAt,
} from '../../../engine';
import {
  YOU, MOM, ELLIE, faceCU, bigWord, Soft, cues, BED_MORNING, KIT, Bus, PuzzleCube, IqHud, Icon, live, handAt, asleep,
} from '../common';
import words from './words.json';

// Chapter 1, the cold open: 7:00 and you're awake, really awake; Ellie's homework done in your head before the
// toast; Mom's puzzle cube in eleven seconds; a whole book on the bus; the math on yourself: twice as good, and
// tomorrow again. Title. 24+ cuts a minute.

const { rel } = cues(words);

/** A toaster on the worktop; `pop` 0..1 shoots the toast up. */
const Toaster: React.FC<{ x: number; y: number; s?: number; pop: number }> = ({ x, y, s = 1, pop }) => {
  const up = backOut(clamp(pop)) * 120;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-50, 50].map((dx) => (
        <g key={dx} transform={`translate(${dx} ${-up - 60})`}>
          <path d="M -40 60 L -40 -30 Q -40 -60 -10 -60 Q 0 -70 10 -60 Q 40 -60 40 -30 L 40 60 Z" fill="#E0A85A" stroke="#100E16" strokeWidth={6} />
          <path d="M -30 50 L -30 -24 Q -30 -48 0 -50 Q 30 -48 30 -24 L 30 50 Z" fill="#F4D8A0" />
        </g>
      ))}
      <rect x={-130} y={-80} width={260} height={160} rx={40} fill="#C9C4BA" stroke="#100E16" strokeWidth={8} />
      <rect x={-100} y={-86} width={70} height={14} rx={6} fill="#24202C" />
      <rect x={30} y={-86} width={70} height={14} rx={6} fill="#24202C" />
      <rect x={130} y={-20} width={20} height={50} rx={6} fill="#24202C" stroke="#100E16" strokeWidth={4} />
      <path d="M -100 -40 L 100 -40" stroke="#FFFFFF" strokeWidth={6} opacity={0.5} />
    </g>
  );
};

/** Two hands (orange sleeves from below) holding the cube up to camera, the cube twisting. */
const CubeInHands: React.FC<{ t: number; solved: number; twist: number; s?: number; shake?: number }> = ({ t, solved, twist, s = 1, shake = 0 }) => {
  const j = shake * Math.sin(t * 2.3) * 8;
  return (
    <g transform={`translate(${960 + j} 640) scale(${s})`}>
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M ${sd * 360} 600 Q ${sd * 380} 300 ${sd * 300} 120 L ${sd * 200} 160 Q ${sd * 230} 380 ${sd * 160} 600 Z`} fill="#F07A2A" stroke="#100E16" strokeWidth={8} />
      ))}
      <PuzzleCube x={0} y={60} s={1.15} solved={solved} twist={twist} />
      {[-1, 1].map((sd) => (
        <g key={`h${sd}`}>
          <ellipse cx={sd * 250} cy={110} rx={95} ry={80} fill="#26232F" stroke="#100E16" strokeWidth={8} />
          <ellipse cx={sd * 205} cy={20} rx={40} ry={30} fill="#26232F" stroke="#100E16" strokeWidth={7} />
        </g>
      ))}
    </g>
  );
};

// ---------- S1: insert, the alarm clock: 07:00, ringing, rattling ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const ring = Math.sin(t * 2.8) * 3;
  return (
    <g>
      <Soft blur={16} dim={0.3}>
        <g transform={camT(1150, 520, 2.2)}>
          <BED_MORNING t={t + 50} />
        </g>
      </Soft>
      <g transform={`translate(960 700) scale(${kf(t, [[0, 3.1], [len, 3.3]])}) rotate(${ring})`}>
        <AlarmClock x={0} y={0} s={1} text="07:00" on={t % 10 < 7 ? 1 : 0.6} />
      </g>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${560 - i * 40} ${380 - i * 30} q -30 40 0 80`} stroke="#FFE7B3" strokeWidth={8} fill="none" strokeLinecap="round" opacity={t % 8 < 5 ? 0.8 : 0.2} />
      ))}
      {[0, 1, 2].map((i) => (
        <path key={`r${i}`} d={`M ${1360 + i * 40} ${380 - i * 30} q 30 40 0 80`} stroke="#FFE7B3" strokeWidth={8} fill="none" strokeLinecap="round" opacity={t % 8 < 5 ? 0.8 : 0.2} />
      ))}
    </g>
  );
};

// ---------- S2: wide, the bedroom: you sit bolt upright in bed in one move, eyes wide ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.14);
  const up = easeOut(clamp((t - 6) / 6));
  const me: Pose = {
    ...basePose, ...b, y: b.y + (1 - up) * 40, yaw: 0.25, tilt: -50 * (1 - up), squash: t > 12 && t < 16 ? -0.06 : 0,
    expr: up > 0.5 ? 'shock' : 'tired', blink: up < 0.5 ? 1 : idleBlink(t, 3), armL: { a: 20 + 30 * up, b: 20 }, armR: { a: 20 + 30 * up, b: 20 }, look: 0.2,
  };
  return (
    <g transform={camT(kf(t, [[0, b.x + 120], [len, b.x + 100]]), b.y - 20, kf(t, [[0, 2.1], [len, 2.25]]))}>
      <Bedroom t={t + 100} duvet={false} clock="07:00" />
      <Hero look={YOU} pose={me} shadow={0} />
      <BedDuvet />
    </g>
  );
};

// ---------- S3: close-up: "you're... awake." the eyes open wider, a glint ----------
export const S3 = faceCU({ look: YOU, Bg: BED_MORNING, faces: [[0, 'neutral'], [18, 'shock']], yaw: 0.15, zoom: [3.4, 3.8], glint: 1, glintColor: '#FFE7B3', extra: (t) => <FocusRings x={0} y={-300} t={t - 18} r0={80} /> });

// ---------- S4: AWAKE. ----------
export const S4 = bigWord({ word: 'REALLY AWAKE.', color: '#FFD23A', Bg: BED_MORNING, size: 190 });

// ---------- S5: the kitchen, Ellie at the island over her homework, crying; you walk in behind ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const e = stand(KITCHEN, 0.42, 0.42, 0.45);
  const y = stand(KITCHEN, 0.68, 0.36);
  const sob = Math.sin(t / 3) * 2;
  const p = islandTop(0.42, 0.4);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 920]]), 520, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <KIT t={t + 200} />
      <Hero look={YOU} pose={live(t, { ...y, x: kf(t, [[0, y.x + 120], [30, y.x]], easeOut), yaw: -0.4, look: -0.6 }, [[0, 'neutral']], 2)} />
      <Hero look={ELLIE} pose={live(t, { ...e, yaw: 0.2, tilt: 10 + sob, headTilt: 14, armL: { a: 60, b: 90 }, armR: { a: 60, b: 90 } }, [[0, 'worried']], 4)} />
      <KitchenIsland stools />
      <Paper x={p.x} y={p.y - 6} w={70} rot={-8} done={false} fill={0.3} />
      {[0, 1].map((k) => {
        const tt = (t + k * 9) % 18;
        return <circle key={k} cx={e.x + 20 + k * 10} cy={e.y - 200 * e.scale + tt * 3} r={5} fill="#7AC8FF" opacity={1 - tt / 18} />;
      })}
    </g>
  );
};

// ---------- S6: over your shoulder: the homework, and the answers filling in by themselves, one after another ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.3}>
      <g transform={camT(960, 560, 2)}>
        <KIT t={t + 260} />
      </g>
    </Soft>
    <g transform={`translate(960 560) scale(${kf(t, [[0, 1], [len, 1.06]])})`}>
      <rect x={-470} y={-330} width={940} height={660} fill="#F4EEE0" stroke="#100E16" strokeWidth={6} />
      <text x={-420} y={-260} fontFamily={FONT.ui} fontSize={40} fill="#3A3446">MATH HOMEWORK, 20 QUESTIONS</text>
      {Array.from({ length: 10 }).map((_, i) => {
        const col = i % 2, row = Math.floor(i / 2);
        const x = -420 + col * 450, y = -170 + row * 100;
        const q = `${12 + i * 7} × ${3 + (i % 4)} =`;
        const done = t > 2 + i * 1.6;
        return (
          <g key={i}>
            <text x={x} y={y} fontFamily={FONT.ui} fontSize={38} fill="#3A3446">{`${i + 1}. ${q}`}</text>
            {done ? <text x={x + 290} y={y} fontFamily={FONT.hand} fontSize={44} fill="#2A4AA0">{(12 + i * 7) * (3 + (i % 4))}</text> : null}
          </g>
        );
      })}
    </g>
    <IqHud t={t} iq={200} />
  </g>
);

// ---------- S7: DONE: the sheet slides round, every answer ticked, 20/20 ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.35}>
      <g transform={camT(960, 560, 2)}>
        <KIT t={t + 300} />
      </g>
    </Soft>
    <g transform={`translate(960 ${560 + (1 - easeOut(clamp(t / 8))) * 300}) rotate(${kf(t, [[0, -12], [10, -3]])}) scale(2.2)`}>
      <Paper x={0} y={0} w={300} done grade="20/20" />
    </g>
    <Sparkle x={1260} y={300} t={t - 6} s={1.4} />
    <Sparkle x={660} y={360} t={t - 10} s={1} />
  </g>
);

// ---------- S8: close-up, you tap your temple: in your head ----------
export const S8 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'smug']], yaw: -0.3, zoom: [3.2, 3.35], pose: { armR: { a: 150, b: 120 }, headTilt: -6 } });

// ---------- S9: insert, the toaster pops, a beat late ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={10} dim={0.25}>
      <g transform={camT(800, 470, 2.4)}>
        <KIT t={t + 320} />
      </g>
    </Soft>
    <g transform={`translate(960 760) scale(${kf(t, [[0, 2.3], [len, 2.4]])})`}>
      <Toaster x={0} y={0} pop={(t - rel('Before', 'pops')) / 6} />
    </g>
  </g>
);

// ---------- S10: the shelf: Mom's old puzzle cube, scrambled, in the dust, a cobweb ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.35}>
      <g transform={camT(700, 400, 2.2)}>
        <KIT t={t + 340} />
      </g>
    </Soft>
    <g transform={`translate(960 600) scale(${kf(t, [[0, 1.5], [len, 1.62]])}) translate(-960 -600)`}>
      <rect x={300} y={720} width={1320} height={40} fill="#6A4A3E" stroke="#100E16" strokeWidth={6} />
      <rect x={300} y={760} width={1320} height={20} fill="#3A2826" />
      <PuzzleCube x={960} y={720} s={0.9} solved={0} seed={4} />
      <rect x={450} y={560} width={60} height={160} fill="#7A4A4A" stroke="#100E16" strokeWidth={5} />
      <rect x={515} y={580} width={50} height={140} fill="#4A5A7A" stroke="#100E16" strokeWidth={5} />
      <rect x={1340} y={620} width={140} height={100} rx={12} fill="#C9B48A" stroke="#100E16" strokeWidth={5} />
      <path d="M 1100 450 L 1180 560 M 1100 450 L 1200 470 M 1100 450 L 1140 600 M 1130 490 Q 1150 500 1175 490 M 1120 530 Q 1150 540 1160 520" stroke="#F4F1EA" strokeWidth={3} opacity={0.5} fill="none" />
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={700 + rnd(3, i) * 520} cy={400 + ((rnd(4, i) * 400 + t * 1.2) % 400)} r={3} fill="#F4F1EA" opacity={0.35} />
      ))}
    </g>
  </g>
);

// ---------- S11: Mom and Ellie, arms folded: nobody has ever solved it ----------
export const S11 = talkShot({
  Set: KIT, setT: 380, words: words as any,
  cast: [
    { look: MOM, ...stand(KITCHEN, 0.36, 0.4), yaw: 0.35, faces: [[0, 'smug']], pose: { armL: { a: 40, b: 120 }, armR: { a: 40, b: 120 } } },
    { look: ELLIE, ...stand(KITCHEN, 0.5, 0.42, 0.45), yaw: 0.3, faces: [[0, 'smug']], pose: { armL: { a: 40, b: 120 }, armR: { a: 40, b: 120 } } },
  ],
  cam: { from: [900, 520, 1.7], to: [920, 520, 1.8] },
  front: () => <KitchenIsland stools />,
});

// ---------- S12: the cube in your hands, filling the frame; a first twist ----------
export const S12: React.FC<ShotProps> = ({ t }) => <CubeInHands t={t} solved={0} twist={Math.sin(clamp((t - 10) / 8) * Math.PI) * 0.5} s={kf(t, [[0, 0.95], [16, 1.05]])} />;

// ---------- S13: click, click: the layers spin in a blur, the colours sorting themselves ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2232" />
    <CubeInHands t={t} solved={clamp(t / Math.max(1, len)) * 0.85} twist={Math.sin(t * 1.4)} s={1.1} shake={1} />
    {[0, 1, 2, 3].map((i) => (
      <path key={i} d={`M ${700 + i * 160} 300 q 40 -40 80 0`} stroke="#FFE7B3" strokeWidth={8} fill="none" opacity={(t + i * 3) % 9 < 4 ? 0.9 : 0} />
    ))}
    <text x={1600} y={200} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFD23A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" transform={`rotate(8 1600 200)`}>CLICK</text>
  </g>
);

// ---------- S14: the last click: solved, held up ----------
export const S14: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2232" />
    <Glow x={960} y={620} r={600} o={0.6} />
    <CubeInHands t={t} solved={1} twist={0} s={kf(t, [[0, 1.1], [10, 1.2]])} />
    <Sparkle x={700} y={380} t={t - 2} s={1.4} />
    <Sparkle x={1240} y={420} t={t - 5} s={1.1} />
  </g>
);

// ---------- S15: Mom, mouth open, the cube in your hand: 0:11 on a float ----------
export const S15 = faceCU({ look: MOM, Bg: KIT, faces: [[0, 'shock']], yaw: -0.25, zoom: [2.8, 2.95], extra: (t) => <FloatLabel x={260} y={-260} t={t - 2} text="0:11" size={90} /> });

// ---------- S16: the bus: you on a seat by the window, the town sliding past, a fat history book open ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.25;
  const me: Pose = live(t, { x: 760, y: 820 - 170 * s, scale: s, yaw: 0.35, look: 0.5, headTilt: 12, legL: { a: 84, b: -84 }, legR: { a: 80, b: -80 }, armL: { a: 50, b: 80 }, armR: { a: 50, b: 80 } }, [[0, 'neutral']], 3);
  const h = handAt(me, 'R');
  return (
    <g transform={camT(kf(t, [[0, 860], [len, 900]]), 560, 1.05)}>
      <Bus t={t} />
      <Hero look={YOU} pose={me} />
      <OpenBook x={h.x + 20} y={h.y + 10} w={220} rot={-6} turn={(t / 6) % 1} cover="#5A3E2E" />
    </g>
  );
};

// ---------- S17: insert, the pages flick past like a flip book ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={10} dim={0.25}>
      <g transform={camT(960, 500, 1.6)}>
        <Bus t={t + 40} />
      </g>
    </Soft>
    <g transform={`translate(960 760) scale(${kf(t, [[0, 3.2], [len, 3.4]])})`}>
      <OpenBook x={0} y={0} w={260} turn={(t / 2.5) % 1} cover="#5A3E2E" />
    </g>
    <text x={960} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill="#F6EFE3">{`PAGE ${Math.min(412, Math.floor(t * 4.2) + 1)} / 412`}</text>
  </g>
);

// ---------- S18: close-up, you, and the words of the book swirling round your head, staying ----------
export const S18 = faceCU({
  look: YOU, Bg: Bus, faces: [[0, 'happy']], yaw: 0.2, zoom: [3.1, 3.3],
  extra: (t) => (
    <g>
      {['1066', 'MAGNA CARTA', 'ROME', '1492', 'PHARAOH', 'NAPOLEON', 'MOON 1969'].map((w, i) => {
        const a = t / 14 + (i / 7) * Math.PI * 2;
        return <text key={w} x={Math.cos(a) * 260} y={-330 + Math.sin(a) * 90} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#FFE27A" opacity={clamp((t - i * 2) / 6)}>{w}</text>;
      })}
    </g>
  ),
});

// ---------- S19: the schematic: a brain, then a second brain beside it, twice as bright: x2 ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const twice = rel('Something', 'twice');
  const k = backOut(clamp((t - twice) / 9));
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
        <Schematic t={t} id="c1s19" />
      </g>
      <Icon name="brain" x={k > 0 ? 960 - 330 * k : 960} y={540} s={1.8} />
      <SchLabel x={k > 0 ? 960 - 330 * k : 960} y={780} t={t - 4} text="YESTERDAY" size={40} />
      {k > 0 ? (
        <g>
          <Icon name="brain" x={960 + 330 * k} y={540} s={1.8 * k} live={1} />
          <SchLabel x={960 + 330 * k} y={780} t={t - twice - 4} text="TODAY" size={40} color="#FF8A3D" />
          <text x={960} y={570} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110 * k} fill="#FFD23A">×2</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S20: night, your bedroom, the clock at 06:59: and it's going to happen again ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.12);
  const flip = t > len - 14;
  return (
    <g transform={camT(kf(t, [[0, b.x + 260], [len, b.x + 120]]), kf(t, [[0, 480], [len, b.y - 60]]), kf(t, [[0, 1.5], [len, 2.2]]))}>
      <Bedroom t={t + 400} duvet={false} clock={flip ? '07:00' : '06:59'} lamp={0} veil={0.7} />
      <Hero look={YOU} pose={{ ...basePose, ...asleep(b, t) } as Pose} shadow={0} />
      <BedDuvet />
      {flip ? <Glow x={1010} y={560} r={500} kind="warm" o={0.6 * clamp((t - (len - 14)) / 4)} /> : null}
    </g>
  );
};

// ---------- S21: title over the dusk rooftop ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.05]]))}>
      <Rooftop t={t + 300} />
    </g>
    <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.25} />
    <TitleCard t={t} lines={['WHAT IF YOUR IQ', 'DOUBLED EVERY DAY?']} accent="DOUBLED" size={112} y={200} />
    <Hero look={YOU} pose={{ ...basePose, x: 960, y: 860 - 170 * 1.1, scale: 1.1, yaw: 0, expr: 'happy', blink: idleBlink(t, 2), armL: { a: 30, b: 10 }, armR: { a: 30, b: 10 } }} />
    <IqHud t={t - 10} iq={400} from={200} at={20} x={1470} y={940} />
  </g>
);

// ---------- S22: close-up on the bus: you narrow your eyes, sums hanging in the air ----------
export const S22 = faceCU({
  look: YOU, Bg: Bus, faces: [[0, 'neutral'], [10, 'smug']], yaw: -0.2, zoom: [3.3, 3.5], pose: { headTilt: -8 },
  extra: (t) => (
    <g>
      {['100 → 200', '× 2', '?'].map((w, i) => (
        <text key={w} x={-260 + i * 260} y={-360 - i * 10} textAnchor="middle" fontFamily={FONT.hand} fontSize={44} fill="#FFE27A" opacity={clamp((t - 4 - i * 8) / 6)}>{w}</text>
      ))}
    </g>
  ),
});
