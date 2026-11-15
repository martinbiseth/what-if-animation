import React from 'react';
import { Hero, Pose, ShotProps, camT, clamp, kf, easeOut, backOut, idleBlink, FONT, Drone, Giza, Dunes, Block, Papyrus, DroneBattery, factCard, lerp, egyptHip, Glow, walkPose } from '../../../engine';
import { YOU, NEFER, HEMIUNU, DJEDI, GUARD, GizaSet, NileSet, DunesSet, at, propCU, faceCU, screenCU, viewGiza, egCard, bigWord, talkShot, crowd, span } from '../common';
import words from './words.json';

// Chapter 4, the catch: it can't lift a stone (2.5 t against under a kilo, 2.3 million blocks), heat (40 °C), sand,
// worn-out batteries, the language, and the people stepping off the golden boat.

const W = words as { w: string; s: number; e: number }[];
const DAY = GizaSet('day');
const GOLD = GizaSet('gold');

const Caption: React.FC<{ t: number; text: string; y?: number; color?: string; size?: number }> = ({ t, text, y = 980, color = '#F6EFE3', size = 80 }) => (
  <g transform={`translate(960 ${y}) scale(${backOut(clamp((t - 3) / 9))})`}>
    <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#140C10" strokeWidth={12} paintOrder="stroke">{text}</text>
  </g>
);

export const S1 = egCard({ kicker: 'THE CATCH', title: 'THE PROBLEM', tod: 'gold' });

// ---------- S2: workers tie a rope round a block and look hopefully at the drone ----------
export const S2 = talkShot({
  Set: DAY, setT: 200,
  back: () => (
    <g>
      <Block x={980} y={800} s={1.2} />
      <path d="M 900 700 Q 960 520 1000 380" stroke="#C8A060" strokeWidth={8} fill="none" />
    </g>
  ),
  cast: crowd(4, 420, 1560, 5, { expr: 'happy', faceTo: 1000 }).map((c, i) => ({ ...c, x: [460, 700, 1300, 1540][i], pose: { ...c.pose, headTilt: -10, look: 0 } })),
  cam: { from: [980, 520, 1.25], to: [980, 500, 1.3] },
  front: (t) => <Drone x={1000} y={330 + Math.sin(t / 8) * 6} s={0.4} t={t} />,
});

// ---------- S3: Hemiunu asks how many it can carry ----------
export const S3 = talkShot({
  Set: GOLD, setT: 300, words: W,
  cast: [
    { look: HEMIUNU, x: 820, y: egyptHip(1), yaw: 0.5, faces: [[0, 'happy']], talk: [span(W, 'Hemiunu', 'day')] },
    { look: YOU, x: 1120, y: egyptHip(1), yaw: -0.5, faces: [[0, 'neutral'], [40, 'oops']] },
  ],
  cam: { from: [970, 540, 1.7], to: [980, 540, 1.8] },
});

export const S4 = bigWord({ kicker: 'BLOCKS IT CAN CARRY', word: '0', size: 400, color: '#FF4A3A', Bg: GOLD });
export const S5 = factCard({ value: 2.5, suffix: ' t', label: 'ONE BLOCK OF THE GREAT PYRAMID', sub: 'about two and a half tonnes', format: (v) => v.toFixed(1) });

// ---------- S6: a see-saw: the block slams down, the drone flies up ----------
export const S6 = propCU({ bgColor: '#1E1A28', draw: (t) => {
  const tip = easeOut(clamp(t / 14));
  const a = -18 * tip;
  return (
    <g>
      <path d="M 960 760 L 880 900 H 1040 Z" fill="#5A5E6A" stroke="#101116" strokeWidth={6} />
      <g transform={`rotate(${-a} 960 760)`}>
        <rect x={360} y={740} width={1200} height={30} rx={10} fill="#8A5A34" stroke="#2A1A10" strokeWidth={5} />
        <Block x={520} y={740} s={1.3} />
        <Drone x={1420} y={690} s={0.45} t={t} on={false} />
      </g>
      <Caption t={t - 10} text="UNDER 1 KG vs 2,500 KG" y={1010} size={70} />
    </g>
  );
} });

export const S7 = factCard({ value: 2800, suffix: '×', label: 'THE STONE IS HEAVIER BY ABOUT', sub: '2,500 kg ÷ 0.9 kg' });
export const S8 = factCard({ value: 2300000, label: 'BLOCKS IN THE GREAT PYRAMID', sub: 'about 2.3 million' });

// ---------- S9: the site at work: one block every two or three minutes ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 460, 1.05)}>
      <Giza t={t * 3 + 500} tod="day" id="s9" />
    </g>
    <Caption t={t} text="1 BLOCK EVERY 2–3 MINUTES" color="#FFD45A" />
    <Caption t={t - 50} text="FOR 20 YEARS" y={860} size={64} />
  </g>
);

export const S10 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'oops']], yaw: 0.25, look_: -0.3, bgCam: [1100, 400, 1.4], pose: { headTilt: 6 } });

export const S11 = bigWord({ kicker: 'PROBLEM TWO', word: 'HEAT', size: 300, color: '#FF8A3D', Bg: DAY });
export const S12 = factCard({ value: 40, suffix: ' °C', label: 'DRONE BATTERIES ARE RATED UP TO', sub: 'summer afternoons at Giza: about 35 °C in the shade' });

// ---------- S13: noon, no shade: you melt under the sun ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = at(960, { yaw: 0.1, look: 0, expr: 'tired', armR: { a: 150, b: 40 }, armL: { a: 10, b: -10 }, headTilt: -4, blink: idleBlink(t, 3) });
  return (
    <g transform={camT(960, kf(t, [[0, 480], [len, 520]]), 1.4)}>
      <Giza t={t + 600} tod="day" id="s13" sledge={false} />
      <circle cx={960} cy={80} r={200} fill="#FFF2C8" opacity={0.6} />
      <Glow x={960} y={80} r={800} o={0.5} />
      <Hero look={YOU} pose={me} />
      {[0, 1, 2, 3, 4].map((k) => (
        <path key={k} d={`M ${700 + k * 130} ${780 - ((t * 2 + k * 30) % 200)} q 15 -20 0 -40 q -15 -20 0 -40`} stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={5} fill="none" />
      ))}
    </g>
  );
};

export const S14 = screenCU({ Bg: DAY, view: viewGiza({ z: [0.5, 0.52] }), battery: 74, warn: (t) => (t > 6 ? 'BATTERY TEMPERATURE TOO HIGH' : undefined) });

// ---------- S15: so you fly at dawn, and at dusk ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const dusk = t > len / 2;
  return (
    <g>
    <g transform={camT(1050, 420, 1.05)}>
      <Giza t={t + 700} tod={dusk ? 'dusk' : 'dawn'} id={dusk ? 's15b' : 's15'} />
      <Drone x={lerp(500, 1500, (t % (len / 2)) / (len / 2))} y={260} s={0.3} t={t} />
    </g>
    <Caption t={dusk ? t - len / 2 : t} text={dusk ? 'EVENING' : 'EARLY MORNING'} y={960} />
    </g>
  );
};

// ---------- S16: a gust of sand ----------
export const S16: React.FC<ShotProps> = ({ t }) => {
  const me: Pose = at(960, { yaw: -0.6, look: -0.5, expr: 'worried', tilt: -12, armR: { a: 140, b: 60 }, armL: { a: 120, b: 80 }, blink: t % 30 < 20 ? 1 : 0 });
  return (
    <g transform={camT(960 + Math.sin(t) * 6, 540, 1.5)}>
      <Dunes t={t} tod="day" storm={0.7} id="s16" />
      <Hero look={YOU} pose={me} />
      <Drone x={1300} y={500} s={0.4} t={t} tilt={Math.sin(t / 2) * 15} />
      {Array.from({ length: 24 }).map((_, k) => (
        <path key={k} d={`M ${((k * 137 + t * 30) % 2400) - 200} ${300 + (k * 53) % 600} h 180`} stroke="#F2D8A8" strokeWidth={6} strokeOpacity={0.5} strokeLinecap="round" />
      ))}
    </g>
  );
};

// ---------- S17: close, the motors grind ----------
export const S17 = propCU({ Bg: DunesSet('day'), draw: (t) => (
  <g transform={`translate(${Math.sin(t * 2.3) * 8} ${Math.cos(t * 1.7) * 6})`}>
    <Drone x={960} y={500} s={2} t={t} tilt={Math.sin(t) * 3} />
    {[0, 1, 2, 3].map((k) => <circle key={k} cx={660 + k * 200} cy={420 - ((t * 4 + k * 20) % 120)} r={10 + k * 3} fill="#C8A878" opacity={0.6} />)}
    <Caption t={t - 6} text="GRRRRRRK" y={960} color="#FF8A3D" size={110} />
  </g>
) });

// ---------- S18: insert, a tiny brush and a lot of hope ----------
export const S18 = propCU({ Bg: CampBg(), draw: (t) => {
  const sweep = Math.sin(t / 4) * 60;
  return (
    <g>
      <Drone x={960} y={560} s={1.8} t={t} on={false} />
      <g transform={`translate(${1180 + sweep} ${430}) rotate(-30)`}>
        <rect x={-14} y={-200} width={28} height={200} rx={10} fill="#C8302A" />
        <path d="M -24 0 L 24 0 L 30 60 L -30 60 Z" fill="#2A2420" />
      </g>
    </g>
  );
} });
function CampBg() {
  const S: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Giza t={t} id={id} tod="dusk" sledge={false} />;
  return S;
}

// ---------- S19: problem three: every charge wears the battery a little ----------
export const S19 = propCU({ bgColor: '#1E1A28', draw: (t) => {
  const n = Math.floor(clamp(t / 90) * 400);
  const cap = 1 - n / 400 * 0.3;
  return (
    <g>
      <g transform="translate(960 470) scale(3.4)"><DroneBattery x={0} y={0} level={cap} /></g>
      <text x={960} y={760} textAnchor="middle" fontFamily={FONT.ui} fontSize={56} fill="#F6EFE3">{`CHARGES: ${n}`}</text>
      <text x={960} y={850} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill={cap < 0.8 ? '#FFC23A' : '#5BE08A'}>{`CAPACITY ${Math.round(cap * 100)}%`}</text>
    </g>
  );
} });

// ---------- S20: a year or two, and it's just a plastic bug ----------
export const S20: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 700, 2.4)}>
    <Giza t={t + 900} tod="gold" id="s20" sledge={false} />
    <Drone x={960} y={760} s={0.6} t={t} on={false} lights={false} tilt={8} />
    <Caption t={t - 20} text="JUST A PLASTIC BUG" y={880} size={60} />
  </g>
);

// ---------- S21: dusk, you sit on a block with the drone in your lap ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...at(960, { yaw: 0.2, look: -0.2, expr: 'tired', armR: { a: 40, b: -90 }, armL: { a: 30, b: -90 }, legL: { a: -80, b: 80 }, legR: { a: -80, b: 80 }, headTilt: 8, blink: idleBlink(t, 4) }), y: egyptHip(1) + 40 };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 520, kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Giza t={t + 1000} tod="dusk" id="s21" />
      <Block x={940} y={800} s={1} />
      <Hero look={YOU} pose={me} />
      <Drone x={990} y={690} s={0.22} t={t} on={false} lights={false} />
    </g>
  );
};

// ---------- S22: the language: Nefer tries words on you ----------
export const S22 = talkShot({
  Set: GOLD, setT: 1100,
  cast: [
    { look: NEFER, x: 820, y: egyptHip(0.72), scale: 0.72, yaw: 0.5, faces: [[0, 'happy']], pose: { armR: { a: 70, b: -40 } } },
    { look: YOU, x: 1100, y: egyptHip(1), yaw: -0.4, faces: [[0, 'dizzy']] },
  ],
  cam: { from: [960, 560, 1.7], to: [970, 560, 1.8] },
  front: (t) => <text x={1180} y={300} fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#F6EFE3" stroke="#140C10" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 20) / 6)}>?!</text>,
});

// ---------- S23: written without the vowels ----------
export const S23 = propCU({ Bg: GOLD, draw: (t) => (
  <g>
    <Papyrus x={960} y={480} s={2} />
    <Caption t={t - 10} text="WRITTEN WITHOUT VOWELS" y={940} color="#FFD45A" />
  </g>
) });

// ---------- S24: two-shot, close: Nefer is teaching you ----------
export const S24 = talkShot({
  Set: GOLD, setT: 1200,
  cast: [
    { look: NEFER, x: 860, y: egyptHip(0.72), scale: 0.72, yaw: 0.5, faces: [[0, 'smug']], pose: { armR: { a: 120, b: 0 }, handR: 'point' } },
    { look: YOU, x: 1080, y: egyptHip(1), yaw: -0.4, faces: [[0, 'neutral']] },
  ],
  cam: { from: [970, 470, 2.4], to: [970, 470, 2.5] },
});

export const S25 = bigWord({ kicker: 'WORD 1', word: 'WATER', size: 240, color: '#6AC8F0', Bg: GOLD });
export const S26 = bigWord({ kicker: 'WORD 2', word: 'BREAD', size: 240, color: '#E8B070', Bg: GOLD });
export const S27 = bigWord({ kicker: 'WORD 3', word: 'NO', size: 300, color: '#FF4A3A', Bg: GOLD });

// ---------- S28: the golden boat docks; the people step off ----------
export const S28: React.FC<ShotProps> = ({ t, len }) => {
  const x = lerp(820, 1150, clamp(t / Math.max(1, len)));
  return (
    <g transform={camT(980, 540, 1.3)}>
      <SetGold t={t} />
      <Hero look={GUARD} pose={walkPose(x - 220, t * 0.5, 800, 0.95)} />
      <Hero look={DJEDI} pose={walkPose(x, t * 0.5 + 1, 800, 1, { expr: 'smug' })} />
      <Hero look={GUARD} pose={walkPose(x + 200, t * 0.5 + 2, 800, 0.95)} />
    </g>
  );
};
const SetGold: React.FC<{ t: number }> = ({ t }) => {
  const N = NileSet('gold', { gold: true, boatX: 700 });
  return <N t={t + 100} id="s28" />;
};

// ---------- S29: close, the magician: a god's eye in a box, and the king doesn't have one ----------
export const S29 = faceCU({ look: DJEDI, Bg: NileSet('gold', { gold: true, boatX: 700 }), faces: [[0, 'neutral'], [30, 'smug']], yaw: -0.3, look_: -0.6, bgCam: [800, 500, 1.5] });
void HEMIUNU; void Dunes;
