import React from 'react';
import { Hero, Pose, ShotProps, camT, clamp, kf, easeOut, backOut, idleBlink, faceAt, FONT, Drone, Giza, Goat, Rations, Papyrus, Block, walkPose, lerp, factCard, rnd, egyptHip } from '../../../engine';
import { YOU, NEFER, HEMIUNU, GUARD, WORKER, WORKER2, GizaSet, NileSet, at, propCU, faceCU, screenCU, povShot, viewGiza, egCard, bigWord, talkShot, crowd, HeldController } from '../common';
import words from './words.json';

// Chapter 3, the sky eye: the buzzing scarab, Hemiunu sees his pyramid from above, the shortcut and the stuck boat,
// Merer's logbook, the square base, Nefer's goat, how the builders really lived, the nickname, the golden boat.

const DAY = GizaSet('day');
const GOLD = GizaSet('gold');
const W = words as { w: string; s: number; e: number }[];

const Caption: React.FC<{ t: number; text: string; y?: number; color?: string; size?: number; at0?: number }> = ({ t, text, y = 960, color = '#F6EFE3', size = 84, at0 = 3 }) => (
  <g transform={`translate(960 ${y}) scale(${backOut(clamp((t - at0) / 9))})`}>
    <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#140C10" strokeWidth={12} paintOrder="stroke">{text}</text>
  </g>
);

// ---------- S1: chapter card ----------
export const S1 = egCard({ kicker: "THE FIRST WEEK", title: "THE SKY EYE", tod: "day" });

// ---------- S2: workers on their break point up: the buzzing scarab ----------
export const S2 = talkShot({
  Set: DAY, setT: 300,
  cast: crowd(5, 420, 1500, 4, { expr: 'happy', arms: 'point', faceTo: 1500 }),
  cam: { from: [960, 520, 1.2], to: [980, 510, 1.28] },
  front: (t) => (
    <g>
      <Drone x={1500 + Math.sin(t / 15) * 60} y={250} s={0.3} t={t} />
      <Caption t={t - 20} text="THE BUZZING SCARAB" y={1000} color="#FFD45A" />
    </g>
  ),
});

// ---------- S3: two guards walk you across the site ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const x = lerp(500, 900, clamp(t / Math.max(len, 1)));
  return (
    <g transform={camT(x + 100, 520, 1.35)}>
      <Giza t={t + 400} tod="gold" id="s3" />
      <Hero look={GUARD} pose={walkPose(x - 230, t * 0.6, 800, 1, { blink: idleBlink(t, 1) })} />
      <Hero look={YOU} pose={walkPose(x, t * 0.6 + 1, 800, 1, { expr: 'worried', blink: idleBlink(t, 2) })} />
      <Hero look={GUARD} pose={walkPose(x + 230, t * 0.6 + 2, 800, 1, { blink: idleBlink(t, 3) })} />
    </g>
  );
};

// ---------- S4: medium, Hemiunu in front of his pyramid ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 1000], [len, 1030]]), 520, 1.6)}>
      <Giza t={t + 500} tod="gold" id="s4" />
      <Hero look={HEMIUNU} pose={at(1000, { yaw: -0.2, look: -0.3, expr: 'neutral', armL: { a: 20, b: -60 }, armR: { a: 20, b: -60 }, blink: idleBlink(t, 4), tilt: Math.sin(t / 22) })} />
    </g>
    <g opacity={clamp((t - 6) / 8)}>
      <rect x={1180} y={760} width={600} height={130} rx={20} fill="#140C10" opacity={0.75} />
      <text x={1480} y={820} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFD45A">HEMIUNU</text>
      <text x={1480} y={866} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#F6EFE3">the king's nephew · the architect</text>
    </g>
  </g>
);

// ---------- S5: close, Hemiunu looks up at the pyramid he has never seen from above ----------
export const S5 = faceCU({ look: HEMIUNU, Bg: GOLD, faces: [[0, 'neutral'], [40, 'tired']], yaw: 0.2, look_: 0.2, pose: { headTilt: -10 }, bgCam: [1150, 380, 1.4] });

// ---------- S6: two-shot, you hand him the controller ----------
export const S6: React.FC<ShotProps> = ({ t }) => {
  const give = easeOut(clamp(t / 14));
  const me: Pose = at(820, { yaw: 0.5, look: 0.7, expr: 'happy', armR: { a: 60 + 20 * give, b: -40 + 30 * give }, blink: idleBlink(t, 2) });
  const him: Pose = at(1140, { yaw: -0.5, look: -0.6, expr: t > 16 ? 'shock' : 'neutral', armL: { a: 40 + 30 * give, b: -60 }, armR: { a: 40 + 30 * give, b: -60 }, blink: idleBlink(t, 4) });
  return (
    <g transform={camT(980, 540, 1.7)}>
      <Giza t={t + 600} tod="gold" id="s6" sledge={false} />
      <Hero look={YOU} pose={me} />
      <Hero look={HEMIUNU} pose={him} />
      <HeldController pose={give > 0.9 ? him : me} t={t} view={viewGiza({ z: [0.5, 0.5] })} />
    </g>
  );
};

// ---------- S7: close, his face lit by the screen, a long silence ----------
export const S7 = faceCU({
  look: HEMIUNU, Bg: GOLD, faces: [[0, 'shock'], [70, 'happy']], yaw: -0.15, look_: 0, pose: { headTilt: 6, armL: { a: 50, b: -90 }, armR: { a: 50, b: -90 } }, bgCam: [1150, 380, 1.4], light: '#9AD0FF',
  zoom: [3.0, 3.4],
});

// ---------- S8: medium, then he starts pointing ----------
export const S8: React.FC<ShotProps> = ({ t }) => {
  const p = Math.sin(t / 6);
  const him: Pose = at(960, { yaw: 0.3, look: 0.4, expr: 'happy', armR: { a: 120 + p * 15, b: 0 }, handR: 'point', armL: { a: 40, b: -80 }, blink: idleBlink(t, 4) });
  return (
    <g transform={camT(1000, 520, 1.8)}>
      <Giza t={t + 700} tod="gold" id="s8" sledge={false} />
      <Hero look={HEMIUNU} pose={him} />
      <HeldController pose={{ ...him, armR: him.armL }} t={t} />
    </g>
  );
};

// ---------- S9/S10: from the sky: the long way round, then the shortcut ----------
export const S9 = povShot({ view: viewGiza({ cx: 600, cy: 1350, z: [0.62, 0.58], shortcut: () => 0.0001 }), battery: 88, alt: 140 });
export const S10 = povShot({ view: viewGiza({ cx: 600, cy: 1350, z: [0.58, 0.58], shortcut: (t) => clamp(t / 40) }), battery: 87, alt: 140 });

// ---------- S11: the Nile: a stone boat stuck on a sandbank ----------
export const S11 = talkShot({
  Set: NileSet('day', { stuck: true, boatX: 1000 }), setT: 100,
  cast: [],
  cam: { from: [1000, 560, 1.4], to: [1000, 560, 1.5] },
  front: (t) => <Drone x={lerp(400, 700, clamp(t / 60))} y={260} s={0.3} t={t} />,
});

// ---------- S12: the camera flies down the river and finds the deep channel ----------
export const S12 = povShot({ view: viewGiza({ cx: -760, cy: lerp(300, 300, 1), z: [0.9, 0.8], stuck: true, drift: [0, -500], len: 150 }), battery: 85, alt: 60 });

// ---------- S13: the crew's logbook ----------
export const S13 = propCU({ Bg: NileSet('day'), bgCam: [1000, 560, 1.4], draw: (t) => <Papyrus x={960} y={540} s={2.2} rot={-3 + Math.sin(t / 30)} /> });

// ---------- S14: the Diary of Merer, found in 2013 ----------
export const S14 = factCard({ value: 2013, label: 'THE DIARY OF MERER, FOUND IN', sub: 'oldest papyrus with writing ever found', format: (v) => String(Math.round(v)) });

// ---------- S15: the corners from the sky ----------
export const S15 = povShot({
  view: (t) => (
    <g>
      {viewGiza({ cx: 1100, cy: 540, z: [0.85, 0.85] })(t)}
      <g transform={camT(1100, 540, 0.85)}>
        {[[720, 160], [1480, 160], [1480, 920], [720, 920]].map(([x, y], k) => (
          <g key={k} opacity={clamp((t - 6 - k * 8) / 6)}>
            <path d={`M ${x - 60} ${y} H ${x + 60} M ${x} ${y - 60} V ${y + 60}`} stroke="#5BE08A" strokeWidth={10} />
            <circle cx={x} cy={y} r={40} fill="none" stroke="#5BE08A" strokeWidth={8} />
          </g>
        ))}
      </g>
    </g>
  ),
  battery: 82, alt: 180,
});

// ---------- S16: each side about 230 m, all within a hand's length ----------
export const S16 = factCard({ value: 230, suffix: ' m', label: 'EACH SIDE OF THE BASE', sub: 'the sides differ by about 20 cm' });

// ---------- S17: by night, a rope between two stakes, the stars above ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 470]]), 1.3)}>
    <Giza t={t + 800} tod="night" id="s17" sledge={false} workers={false} />
    <path d={`M 560 760 Q 960 ${770 + Math.sin(t / 10) * 4} 1360 760`} stroke="#E8D6A0" strokeWidth={6} fill="none" />
    {[560, 1360].map((x) => <path key={x} d={`M ${x} 800 V 720`} stroke="#8A6A44" strokeWidth={12} />)}
    <Hero look={WORKER} pose={at(480, { yaw: 0.5, look: 0.5, expr: 'neutral', armR: { a: 70, b: -20 }, blink: idleBlink(t, 3) })} rimId="rimBlue" />
    <Hero look={WORKER2} pose={at(1440, { yaw: -0.5, look: -0.2, expr: 'neutral', armR: { a: 140, b: 10 }, handR: 'point', headTilt: -12, blink: idleBlink(t, 5) })} rimId="rimBlue" />
  </g>
);

// ---------- S18: close, Nefer: she has lost her goat ----------
export const S18 = faceCU({ look: NEFER, Bg: DAY, faces: [[0, 'worried']], yaw: 0.3, look_: 0.3, zoom: [2.6, 2.8], pose: { scale: 0.72, y: 760 }, bgCam: [600, 600, 1.5] });

// ---------- S19: from above: a white dot behind the rubble ----------
export const S19 = povShot({ view: viewGiza({ cx: 1700, cy: 300, z: [1.2, 1.7], goat: [1780, 280], mark: [1780, 280] }), battery: 79, alt: 70 });

// ---------- S20: the goat behind the rubble, eating somebody's lunch ----------
export const S20: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 640, 2)}>
    <Giza t={t + 900} tod="day" id="s20" sledge={false} />
    <Block x={1250} y={800} s={1} />
    <Block x={700} y={800} s={0.8} />
    <Rations x={880} y={800} s={0.45} />
    <Goat x={1040} y={800} s={1.2} t={t} chew flip />
  </g>
);

// ---------- S21: Nefer follows you everywhere ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const x = lerp(600, 1000, clamp(t / Math.max(len, 1)));
  return (
    <g transform={camT(x, 560, 1.4)}>
      <Giza t={t + 1000} tod="day" id="s21" />
      <Hero look={YOU} pose={walkPose(x + 120, t * 0.6, 800, 1, { expr: 'happy', blink: idleBlink(t, 2) })} />
      <Hero look={NEFER} pose={walkPose(x - 140, t * 0.75, 800, 0.72, { expr: 'happy', blink: idleBlink(t, 6) })} />
      <Goat x={x - 330} y={800} s={0.7} t={t} flip />
    </g>
  );
};

// ---------- S22: the workers' town: Nefer shows you how they really live ----------
export const S22 = talkShot({
  Set: GizaSet('day', { pyrX: 1500 }), setT: 1100, words: W,
  cast: [
    { look: NEFER, x: 760, y: egyptHip(0.72), scale: 0.72, yaw: 0.4, faces: [[0, 'happy']], pose: { armR: { a: 110, b: 0 }, handR: 'point' } },
    { look: YOU, x: 1060, y: egyptHip(1), yaw: -0.3, faces: [[0, 'neutral']] },
  ],
  cam: { from: [900, 560, 1.6], to: [920, 560, 1.7] },
});

// ---------- S23: not slaves ----------
export const S23 = bigWord({ kicker: 'THE BUILDERS WERE', word: 'NOT SLAVES', size: 200, color: '#FFD45A', Bg: DAY });

// ---------- S24: paid in bread and beer, every day ----------
export const S24 = propCU({ Bg: DAY, bgCam: [400, 700, 1.6], draw: (t) => (
  <g>
    <rect x={-200} y={760} width={2400} height={500} fill="#8A5A34" />
    <g transform={`translate(960 760) scale(${backOut(clamp(t / 10)) * 2}) translate(-960 -760)`}><Rations x={940} y={770} s={1} /></g>
    <Caption t={t - 8} text="PAID IN BREAD AND BEER" y={1000} />
  </g>
) });

// ---------- S25: the town: bakeries, breweries, doctors ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 0], [len, 300]]), 620, 2)}>
      <Giza t={t + 1200} tod="day" id="s25" />
      {Array.from({ length: 5 }).map((_, k) => (
        <path key={k} d={`M ${-30 + k * 120} 600 q 10 -30 0 -60 q -10 -30 0 -60`} stroke="#F2EEE4" strokeWidth={8} opacity={0.4 + 0.2 * Math.sin(t / 10 + k)} fill="none" />
      ))}
    </g>
    <Caption t={t} text="BAKERIES · BREWERIES · DOCTORS" size={70} y={980} />
  </g>
);

// ---------- S26: buried beside it, with their names on their tombs ----------
export const S26 = propCU({ Bg: GizaSet('gold'), bgCam: [1100, 450, 1.3], draw: (t) => (
  <g>
    <rect x={-200} y={780} width={2400} height={500} fill="#C89858" />
    {[560, 960, 1360].map((x, k) => (
      <g key={k} transform={`translate(${x} 800)`} opacity={clamp((t - k * 6) / 8)}>
        <path d="M -130 0 V -300 Q -130 -380 0 -380 Q 130 -380 130 -300 V 0 Z" fill="#D8C090" stroke="#3A2A1A" strokeWidth={6} />
        {Array.from({ length: 8 }).map((_, r) => (
          <circle key={r} cx={-60 + (r % 3) * 60} cy={-300 + Math.floor(r / 3) * 70} r={14} fill="none" stroke="#2A1A10" strokeWidth={5} opacity={rnd(k, r) > 0.3 ? 1 : 0} />
        ))}
        <path d="M -70 -90 H 70" stroke="#A8302A" strokeWidth={8} />
      </g>
    ))}
  </g>
) });

// ---------- S27: the whole site on lunch break, watching you fly ----------
export const S27 = talkShot({
  Set: GOLD, setT: 1300,
  cast: crowd(7, 300, 1650, 11, { expr: 'happy', faceTo: 960 }),
  cam: { from: [960, 500, 1.15], to: [960, 480, 1.2] },
  front: (t) => <Drone x={960 + Math.sin(t / 18) * 300} y={180 + Math.cos(t / 12) * 40} s={0.3} t={t} tilt={Math.cos(t / 18) * 12} />,
});

// ---------- S28: close, you: the one with the sky eye ----------
export const S28 = faceCU({
  look: YOU, Bg: GOLD, faces: [[0, 'happy'], [20, 'cool']], yaw: 0.3, look_: 0.4, bgCam: [1150, 420, 1.4],
  front: (t) => <Caption t={t - 20} text="THE ONE WITH THE SKY EYE" y={980} color="#FFD45A" />,
});

// ---------- S29: a golden boat arrives from the palace ----------
export const S29 = talkShot({
  Set: NileSet('gold', { gold: true }), setT: 900,
  cast: [],
  cam: { from: [960, 520, 1.1], to: [960, 540, 1.3] },
});
void faceAt; void screenCU; void bigWord;

// ---------- S30: a stone boat sails for Giza: the oldest written papyrus ever found ----------
export const S30 = talkShot({
  Set: NileSet('day'), setT: 500,
  cast: [],
  cam: { from: [900, 520, 1.15], to: [980, 520, 1.25] },
  front: (t) => <Caption t={t} text="OLDEST WRITTEN PAPYRUS EVER FOUND" size={66} y={950} color="#FFD45A" />,
});
