import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, FONT, stand, CLS, THINK, ThoughtBubble, factCard, hallHip, HALL, BigClock, walkPose,
  Schematic, SCH, Smartphone, KITCHEN, KitchenIsland,
} from '../../../engine';
import words from './words.json';
import tl from './timeline.json';
import {
  YOU, MO, MUM, NORA, LEO, LEOMUM, TEACHER, PRIYA, N1, N2, N3, N4, N5, N6, KID, SHOPMAN, ClassSet, HallSet, KitchenSet,
  faceCU, thinkCard, Silent, bigWord, people, scene, ThoughtField, cueIn, span, Soft, HeldPhone, propCU,
} from '../common';

// Chapter 5, someone notices: the lost boy at the station, his tiny voice under the noise ("wait by the big clock"),
// you find him; filmed, a million views, mum's very loud "That's my kid."; real brain implants (2023: 62 words a
// minute; 2025: inner speech); Monday, Nora, the one perfectly silent head; she looks up and smiles.

const c = (shot: string, w: string, n = 1) => cueIn(words, tl, shot, w, n);
const STATION = HallSet('station', { time: 255 });
const CLASS = ClassSet(0);
const KIT = KitchenSet(0.4);
const FOLK = [N1, N2, N3, N4, N5, N6, SHOPMAN];

export const S1 = thinkCard({ kicker: 'CHAPTER 5', title: 'SOMEONE NOTICES', seed: 17 });

// ---------- S2: the station: a woman screaming a name ----------
export const S2 = scene({
  Set: STATION, cam: [960, 520, 1.05], to: [1000, 520, 1.12], setT: 100, words, talk: { 0: [span(words, 'Leo', 'Leo')] },
  cast: [
    { look: LEOMUM, pose: { x: 960, y: hallHip(1), yaw: 0.1, armL: { a: 150, b: -30 }, armR: { a: 40, b: -60 } }, faces: [[0, 'shock']] },
    ...FOLK.slice(0, 5).map((look, i) => ({ look, pose: { x: [180, 480, 1340, 1580, 1800][i], y: hallHip(1), yaw: i < 2 ? 0.3 : -0.3 }, waves: 0.5 })),
  ],
  over: (t) => (
    <text x={1160} y={300} fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FF5A5A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={t > c('S2', 'Leo') ? 1 : 0} transform={`rotate(-6 1160 300)`}>
      LEO!
    </text>
  ),
});
export const S3 = faceCU({ look: LEOMUM, Bg: STATION, faces: [[0, 'shock']], yaw: 0.2, zoom: [3.0, 3.2], shake: 1 });

// ---------- S4: hundreds of people: noise ----------
export const S4 = scene({
  Set: STATION, cam: [960, 500, 1.0], to: [960, 500, 1.06], setT: 200, shake: () => 3,
  cast: Array.from({ length: 9 }).map((_, i) => ({ look: FOLK[i % 7], pose: { x: 100 + i * 215, y: hallHip(1), yaw: i % 2 ? -0.3 : 0.3 }, waves: 0.8, think: { th: ['late!', 'coffee', 'platform 4?', 'ugh', 'SO late', 'my bag', 'where?', 'tickets!', 'hmm'][i], pop: i * 2, s: 0.45 } })),
});

// ---------- S5: you close your eyes and listen ----------
export const S5 = faceCU({ look: YOU, Bg: STATION, faces: [[0, 'worried'], [c('S5', 'close'), 'tired']], yaw: 0.05, zoom: [3.1, 3.3], pose: { blink: 1 }, waves: 0.6, extra: (t) => null });

// ---------- S6: under the noise, one tiny voice, coming clear ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const k = c('S6', 'Mummy');
  const k2 = c('S6', 'Wait');
  const text = t < k2 ? 'Mummy said wait by the big clock.' : 'Mummy said wait by the big clock. Wait by the big clock.';
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
        <ThoughtField t={t * 2} n={22} seed={21} />
      </g>
      <rect width={1920} height={1080} fill="#0B0816" opacity={kf(t, [[0, 0.1], [k, 0.7]])} />
      {t > k - 10 ? (
        <ThoughtBubble x={900} y={820} text={text} s={kf(t, [[k - 10, 0.5], [k + 10, 1.0]])} pop={(t - k + 10) / 8} t={t} type={clamp((t - k) / 70)} side={0.2} wrap={18} color={THINK.calm} />
      ) : null}
    </g>
  );
};

// ---------- S7: you run ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 400], [len, 1100]]);
  const p = walkPose(x, t * 1.4, HALL.feet, 1, { tilt: 12 }, 1);
  return (
    <g transform={camT(x + 100, 520, 1.6)}>
      <STATION t={t + 260} id="s7" />
      <Hero look={YOU} pose={{ ...p, expr: 'worried' }} />
    </g>
  );
};

// ---------- S8: he's under the clock, holding a toy bus ----------
const ToyBus: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-50} y={-30} width={100} height={50} rx={10} fill="#E8302A" stroke="#26232F" strokeWidth={4} />
    <rect x={-40} y={-22} width={24} height={16} fill="#BFE4FF" />
    <rect x={-10} y={-22} width={24} height={16} fill="#BFE4FF" />
    <rect x={20} y={-22} width={20} height={16} fill="#BFE4FF" />
    <circle cx={-28} cy={22} r={10} fill="#26232F" />
    <circle cx={28} cy={22} r={10} fill="#26232F" />
  </g>
);
const LEOP: Partial<Pose> = { x: 960, y: hallHip(0.6), scale: 0.6, yaw: 0.1, armL: { a: 40, b: -90 }, armR: { a: 40, b: -90 } };
export const S8 = scene({
  Set: STATION, cam: [960, 590, 2.2], to: [960, 600, 2.35], setT: 300,
  cast: [{ look: LEO, pose: LEOP, faces: [[0, 'worried']], think: { th: 'wait by the big clock', pop: 4, s: 0.8, side: 0.5, color: THINK.calm } }],
  front: () => <ToyBus x={960} y={hallHip(0.6) - 20} s={0.7} />,
});
export const S9 = scene({
  Set: STATION, cam: [960, 560, 1.7], to: [960, 560, 1.8], setT: 340,
  cast: [
    { look: LEOMUM, pose: { x: 900, y: hallHip(1), yaw: 0.4, tilt: 14, armL: { a: 70, b: -80 }, armR: { a: 70, b: -80 } }, faces: [[0, 'happy']] },
    { look: LEO, pose: { ...LEOP, x: 1010, yaw: -0.4, armL: { a: 130, b: -40 }, armR: { a: 130, b: -40 } }, faces: [[0, 'happy']] },
    { look: YOU, pose: { x: 1380, y: hallHip(1), yaw: -0.4 }, faces: [[0, 'happy']] },
  ],
});

// ---------- S10: someone films it; "How did you know where he was?" ----------
export const S10: React.FC<ShotProps> = (p) =>
  scene({
    Set: STATION, cam: [1100, 470, 1.6], to: [1100, 470, 1.7], setT: 380, words, talk: { 0: [span(words, 'How', 'was')] },
    cast: [
      { look: LEOMUM, pose: { x: 1000, y: hallHip(1), yaw: 0.4, armR: { a: 60, b: -40 } }, faces: [[0, 'happy']] },
      { look: YOU, pose: { x: 1280, y: hallHip(1), yaw: -0.4 }, faces: [[0, 'neutral']] },
      { look: N6, pose: { x: 1560, y: hallHip(1), yaw: -0.5, armR: { a: 110, b: -60 } }, held: 'record' },
    ],
  })(p);
export const S11 = faceCU({ look: YOU, Bg: STATION, faces: [[0, 'smug']], yaw: -0.3, zoom: [3.0, 3.2], words, talk: span(words, 'Lucky', 'guess') });

// ---------- S12: a million views by evening ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const v = Math.round(1000000 * Math.pow(clamp(t / 70), 2));
  return (
    <g>
      <Soft blur={16} dim={0.5}><g transform={camT(960, 520, 1.3)}><KIT t={t + 500} id="s12" /></g></Soft>
      <g transform={`translate(960 560) scale(${kf(t, [[0, 1], [len, 1.06]])})`}>
        <rect x={-260} y={-460} width={520} height={920} rx={60} fill="#16121E" stroke="#3A3446" strokeWidth={10} />
        <rect x={-230} y={-400} width={460} height={280} rx={16} fill="#5A4E72" />
        <path d="M -40 -310 L 50 -260 L -40 -210 Z" fill="#F6EFE3" />
        <text x={-210} y={-60} fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#F6EFE3">KID FINDS LOST BOY</text>
        <text x={-210} y={-12} fontFamily={FONT.title} fontWeight={800} fontSize={38} fill="#F6EFE3">IN 4 SECONDS</text>
        <text x={-210} y={70} fontFamily={FONT.ui} fontSize={44} fill={THINK.warm}>{v.toLocaleString('en-US')} views</text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={-210} y={140 + i * 90} width={420} height={60} rx={14} fill="#26203A" />
        ))}
      </g>
    </g>
  );
};

// ---------- S13: strangers argue: FAKE / REAL ----------
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#16121E" />
    {[
      ['FAKE. 100% staged', '#FF7A6A'], ['how did he KNOW??', '#F6EFE3'], ["it's real, I was there", '#5BE08A'], ['actor kid lol', '#FF7A6A'], ['psychic???', THINK.glow], ['the clock tho', '#F6EFE3'],
    ].map(([s, col], i) => {
      const pop = backOut(clamp((t - i * 10) / 8));
      return (
        <g key={i} transform={`translate(${i % 2 ? 1180 : 620} ${200 + i * 130}) scale(${pop})`} opacity={clamp((t - i * 10) / 4)}>
          <rect x={-380} y={-50} width={760} height={96} rx={40} fill="#26203A" stroke="#3A3446" strokeWidth={4} />
          <circle cx={-320} cy={-2} r={30} fill="#5A4E72" />
          <text x={-270} y={14} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill={col}>{s}</text>
        </g>
      );
    })}
  </g>
);

// ---------- S14: mum watches it four times and thinks, very loudly ----------
const MU = stand(KITCHEN, 0.4, 0.4);
export const S14: React.FC<ShotProps> = (p) => {
  const k = c('S14', "That's");
  return scene({
    Set: KIT, cam: [MU.x + 90, MU.y - 250, 2.0], to: [MU.x + 90, MU.y - 260, 2.15], setT: 560,
    cast: [{ look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.3, look: 0.4, headTilt: 8, armR: { a: 100, b: -100 } }, faces: [[0, 'happy']], held: 'video', think: { th: [[k, "THAT'S MY KID."]], s: 0.75, loud: 0.9, side: 0.5, color: THINK.warm } }],
    front: () => <KitchenIsland />,
  })(p);
};

// ---------- S15: and you aren't the only one listening to heads ----------
const Brain: React.FC<{ x: number; y: number; s?: number; t: number; glow?: number }> = ({ x, y, s = 1, t, glow = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -160 20 C -200 -80 -120 -170 -20 -150 C 40 -200 160 -160 170 -60 C 220 0 170 110 80 110 C 30 150 -60 150 -100 110 C -170 110 -190 60 -160 20 Z" fill="none" stroke={SCH.live} strokeWidth={8} />
    <path d="M -100 -60 C -60 -100 -20 -40 20 -80 C 60 -120 100 -60 120 -20 M -120 40 C -60 0 0 60 60 20 C 100 0 130 40 140 60" fill="none" stroke={SCH.live} strokeWidth={6} opacity={0.6} />
    <rect x={-30} y={-176} width={60} height={30} rx={6} fill={SCH.live} opacity={0.4 + 0.6 * glow * (0.5 + 0.5 * Math.sin(t / 4))} />
    <path d={`M 0 -176 C 0 -260 200 -260 300 -230`} fill="none" stroke={SCH.live} strokeWidth={5} strokeDasharray="10 8" strokeDashoffset={-t * 3} />
  </g>
);
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="s15" />
    <Brain x={800} y={600} s={1.4} t={t} />
    <g transform={`translate(1380 300) scale(${backOut(clamp((t - 10) / 8))})`}>
      <rect x={-140} y={-90} width={280} height={180} rx={12} fill="#0E1A2E" stroke={SCH.live} strokeWidth={5} />
      <text x={-110} y={10} fontFamily={FONT.ui} fontSize={40} fill={SCH.live}>{'hello_'.slice(0, Math.floor(clamp((t - 14) / 30) * 6))}</text>
    </g>
  </g>
);

// ---------- S16: 2023, Stanford: a brain implant ----------
export const S16 = bigWord({ kicker: '2023 · STANFORD', word: 'BRAIN IMPLANT', color: SCH.live, sub: "attempted speech -> words on a screen", size: 150 });
// ---------- S27: 62 words a minute ----------
export const S27 = factCard({ value: 62, label: 'WORDS A MINUTE, FROM BRAIN SIGNALS', sub: 'Willett et al., Nature, 2023', real: false });
// ---------- S17: 2025: inner speech ----------
export const S17: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="s17" />
    <text x={960} y={260} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill={SCH.dim}>2025</text>
    <Brain x={700} y={640} s={1.1} t={t} />
    <ThoughtBubble x={1240} y={760} text="words people only thought" s={0.95} pop={(t - c('S17', 'inner')) / 8} t={t} type={clamp((t - c('S17', 'inner')) / 30)} side={0.2} wrap={14} />
    <text x={960} y={980} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim} opacity={clamp((t - 30) / 10)}>Kunz et al., Stanford, Cell 2025</text>
  </g>
);
// ---------- S18: that's real; machines are learning to do what you do ----------
export const S18: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="s18" />
    <Brain x={600} y={600} s={1.1} t={t} />
    <g transform={`translate(960 820) scale(${backOut(clamp(t / 9))})`}>
      <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#0E1A2E" stroke={SCH.live} strokeWidth={3} />
      <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
    </g>
    <g transform={`translate(1400 520)`}>
      <circle r={kf(t, [[20, 0], [60, 140]])} fill="none" stroke={THINK.glow} strokeWidth={6} opacity={0.6} />
      <Hero look={YOU} pose={{ ...basePose, x: 0, y: 40, scale: 0.6, yaw: -0.3, expr: 'worried', blink: 0 }} />
    </g>
  </g>
);

// ---------- Nora ----------
const ME_C = stand(CLS, 0.5, 0.62), NO_C = stand(CLS, 0.7, 0.4);
export const S19: React.FC<ShotProps> = (p) =>
  scene({
    Set: CLASS, cam: [(ME_C.x + NO_C.x) / 2, ME_C.y - 140, 1.45], to: [(ME_C.x + NO_C.x) / 2, ME_C.y - 150, 1.55], setT: 600,
    cast: (t) => [
      { look: NORA, pose: { x: kf(t, [[0, NO_C.x + 300], [50, NO_C.x]]), y: NO_C.y, scale: NO_C.scale, yaw: -0.3 }, faces: [[0, 'neutral']] },
      { look: YOU, pose: { x: ME_C.x, y: ME_C.y, scale: ME_C.scale, yaw: 0.3, look: 0.8 }, faces: [[0, 'neutral']] },
      { look: PRIYA, pose: { x: ME_C.x - 300, y: ME_C.y, scale: ME_C.scale, yaw: 0.3 }, waves: 0.6 },
    ],
  })(p);
export const S20 = faceCU({ look: YOU, Bg: CLASS, faces: [[0, 'worried']], yaw: 0.35, zoom: [3.1, 3.3], look_: 0.9 });
export const S21 = faceCU({ look: NORA, Bg: CLASS, faces: [[0, 'neutral']], yaw: -0.25, zoom: [2.6, 2.75], extra: (t, pose) => <Silent x={pose.x} y={pose.y - 120} s={0.8} t={t} /> });
const T = stand(CLS, 0.3, 0.3);
export const S22 = scene({
  Set: CLASS, cam: [960, 460, 1.15], to: [960, 460, 1.2], setT: 640, words, talk: { 1: [span(words, 'answers', 'loud')] },
  cast: [
    { look: TEACHER, pose: { x: T.x, y: T.y, scale: T.scale, yaw: 0.4, armL: { a: 100, b: -20 } }, faces: [[0, 'happy']], think: { th: 'new girl. be nice.', pop: 6, s: 0.6 } },
    { look: NORA, pose: { x: NO_C.x, y: NO_C.y, scale: NO_C.scale, yaw: -0.3 }, faces: [[0, 'neutral']] },
    { look: YOU, pose: { x: ME_C.x, y: ME_C.y, scale: ME_C.scale, yaw: 0.3, look: 0.8 }, faces: [[0, 'worried']] },
  ],
  over: (t) => <g transform={camT(960, 460, 1.15 + 0.05 * clamp(t / 117))}><Silent x={NO_C.x} y={NO_C.y - 180 * NO_C.scale} s={0.6} t={t} /></g>,
});
export const S23 = faceCU({ look: YOU, Bg: CLASS, faces: [[0, 'cool']], yaw: 0.4, zoom: [3.2, 3.5], look_: 0.9, glint: 1, glintColor: THINK.glow });
export const S24: React.FC<ShotProps> = (p) =>
  scene({
    Set: CLASS, cam: [1300, 520, 2.0], to: [1300, 520, 2.1], setT: 680,
    cast: [
      { look: NORA, pose: { x: 1220, y: NO_C.y + 60, scale: NO_C.scale, yaw: 0.2 }, faces: [[0, 'neutral']] },
      { look: YOU, pose: { x: 1380, y: NO_C.y + 60, scale: NO_C.scale, yaw: -0.4, headTilt: -14 }, faces: [[0, 'cool']] },
    ],
    front: () => <rect x={1270} y={NO_C.y + 40} width={70} height={110} rx={8} fill="#5A6A7A" stroke="#26232F" strokeWidth={4} />,
    over: (t) => <g transform={camT(1300, 520, 2.0 + 0.1 * clamp(t / 87))}><Silent x={1220} y={NO_C.y - 60} s={0.5} t={t} /></g>,
  })(p);
export const S25 = scene({
  Set: CLASS, cam: [960, 480, 1.0], to: [960, 480, 1.06], setT: 720,
  cast: [
    { look: PRIYA, pose: { x: 420, y: ME_C.y, scale: ME_C.scale, yaw: 0.3 }, think: { th: 'lunch?', pop: 2, s: 0.5 } },
    { look: MO, pose: { x: 700, y: ME_C.y, scale: ME_C.scale, yaw: 0.3 }, think: { th: 'is she an alien', pop: 8, s: 0.5 } },
    { look: YOU, pose: { x: ME_C.x, y: ME_C.y, scale: ME_C.scale, yaw: 0.4, look: 0.8 }, faces: [[0, 'worried']] },
    { look: NORA, pose: { x: NO_C.x, y: NO_C.y, scale: NO_C.scale, yaw: -0.3 } },
    { look: TEACHER, pose: { x: T.x, y: T.y, scale: T.scale, yaw: 0.4 }, think: { th: 'coffee. coffee.', pop: 14, s: 0.5 } },
  ],
  over: (t) => <g transform={camT(960, 480, 1.0 + 0.06 * clamp(t / 105))}><Silent x={NO_C.x} y={NO_C.y - 170 * NO_C.scale} s={0.55} t={t} /></g>,
});
export const S26 = faceCU({ look: NORA, Bg: CLASS, faces: [[0, 'neutral'], [c('S26', 'smiles'), 'smug']], yaw: -0.25, zoom: [3.0, 3.25], pose: { headTilt: 8 }, look_: -0.2, glint: 1, glintColor: THINK.glow });
