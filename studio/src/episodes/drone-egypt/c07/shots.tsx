import React from 'react';
import { Hero, Pose, ShotProps, camT, clamp, kf, easeOut, backOut, idleBlink, FONT, Drone, Giza, Schematic, SCH, lerp, egyptHip, Glow, EgyptSky } from '../../../engine';
import { YOU, KING, DJEDI, GUARD, NEFER, GizaSet, at, propCU, faceCU, screenCU, povShot, viewGiza, egCard, bigWord, talkShot, span, HeldController } from '../common';
import words from './words.json';

// Chapter 7, aircraft nearby: sunrise, the last battery at 48%, the king sees Egypt from the sky, Djedi doesn't smile,
// the king is about to speak, and the controller warns of a manned aircraft nearby. In 2560 BC. The real parts, and
// the question for the comments.

const W = words as { w: string; s: number; e: number }[];
const DAWN = GizaSet('dawn');

const Caption: React.FC<{ t: number; text: string; y?: number; color?: string; size?: number }> = ({ t, text, y = 980, color = '#F6EFE3', size = 80 }) => (
  <g transform={`translate(960 ${y}) scale(${backOut(clamp((t - 3) / 9))})`}>
    <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#140C10" strokeWidth={12} paintOrder="stroke">{text}</text>
  </g>
);

export const S1 = egCard({ kicker: 'SUNRISE', title: 'THE LAST BATTERY', tod: 'dawn' });

// ---------- S2: wide, sunrise: the king, the magician and the guards; you in front with the controller ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = at(560, { yaw: 0.4, look: 0.6, expr: 'worried', armR: { a: 50, b: -80 }, blink: idleBlink(t, 2) });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 520, kf(t, [[0, 1.1], [len, 1.2]]))}>
      <Giza t={t + 100} tod="dawn" id="s2" />
      <Hero look={GUARD} pose={at(1580, { yaw: -0.3, blink: idleBlink(t, 5) }, 0.95)} />
      <Hero look={DJEDI} pose={at(1380, { yaw: -0.4, expr: 'smug', blink: idleBlink(t, 4) })} />
      <Hero look={KING} pose={at(1160, { yaw: -0.4, expr: 'neutral', armL: { a: 20, b: -60 }, armR: { a: 20, b: -60 }, blink: idleBlink(t, 3) })} />
      <Hero look={NEFER} pose={at(380, { yaw: 0.4, expr: 'worried', blink: idleBlink(t, 6) }, 0.72)} />
      <Hero look={YOU} pose={me} />
      <HeldController pose={me} t={t} battery={48} />
    </g>
  );
};

// ---------- S3: forty-eight percent ----------
export const S3 = propCU({ Bg: DAWN, bgCam: [1100, 420, 1.3], push: 0.1, draw: (t) => {
  const p = backOut(clamp((t - 2) / 10));
  return (
    <g transform={`translate(960 540) scale(${p})`}>
      <rect x={-420} y={-170} width={760} height={340} rx={50} fill="#101014" stroke="#F6EFE3" strokeWidth={22} />
      <rect x={340} y={-70} width={60} height={140} rx={14} fill="#F6EFE3" />
      <rect x={-385} y={-135} width={690 * 0.48} height={270} rx={24} fill="#FFC23A" />
      <text x={-20} y={60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#F6EFE3" stroke="#101014" strokeWidth={14} paintOrder="stroke">48%</text>
    </g>
  );
} });

// ---------- S4: straight up, higher than any bird ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeOut(clamp(t / Math.max(1, len)));
  return (
    <g transform={camT(960, lerp(560, 300, up), 1.2)}>
      <Giza t={t + 200} tod="dawn" id="s4" />
      <Drone x={960} y={lerp(700, -100, up)} s={lerp(0.5, 0.15, up)} t={t} />
      {[0, 1].map((k) => (
        <path key={k} d={`M ${400 + k * 900 + t * 2} ${380 + k * 60} q 20 -14 40 0 q 20 -14 40 0`} stroke="#2A1E2A" strokeWidth={6} fill="none" />
      ))}
    </g>
  );
};

// ---------- S5: the camera climbs: pyramid, river, desert, the edge of the world ----------
export const S5 = povShot({ view: viewGiza({ cx: 900, cy: 600, z: [0.9, 0.22], len: 200 }), battery: (t) => 47 - t * 0.02, alt: (t) => 120 + t * 2.5, dist: 40 });

export const S6 = faceCU({ look: KING, Bg: DAWN, faces: [[0, 'shock'], [30, 'happy']], yaw: 0.2, look_: 0, bgCam: [1100, 420, 1.4], light: '#9AD0FF', pose: { headTilt: 6 } });
export const S7 = faceCU({ look: DJEDI, Bg: DAWN, faces: [[0, 'worried']], yaw: -0.3, look_: -0.6, bgCam: [1100, 420, 1.4] });

// ---------- S8: the king turns to you; for once you're not a servant ----------
export const S8 = talkShot({
  Set: DAWN, setT: 300,
  cast: [
    { look: YOU, x: 820, y: egyptHip(1), yaw: 0.5, faces: [[0, 'worried'], [40, 'happy']], pose: { armR: { a: 50, b: -80 } } },
    { look: KING, x: 1120, y: egyptHip(1), yaw: -0.5, faces: [[0, 'happy']], pose: { armR: { a: 40, b: -40 } } },
  ],
  cam: { from: [970, 540, 1.7], to: [970, 530, 1.85] },
});

// ---------- S9: close, the king opens his mouth to say something ----------
export const S9 = faceCU({ look: KING, Bg: DAWN, faces: [[0, 'happy'], [30, 'neutral']], yaw: -0.3, look_: -0.5, bgCam: [1100, 420, 1.4], words: W, talk: span(W, 'He', 'something', 1) });

// ---------- S10: beep: MANNED AIRCRAFT NEARBY ----------
export const S10 = screenCU({ Bg: DAWN, view: viewGiza({ cx: 900, cy: 600, z: [0.25, 0.25] }), battery: 41, warn: (t) => (t > 4 ? 'MANNED AIRCRAFT NEARBY' : undefined), push: 0.12 });

// ---------- S11: how it works: the drone listens for real planes' signals ----------
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="s11" />
    <g transform="translate(560 640)"><Drone x={0} y={0} s={0.7} t={t} /></g>
    <g transform={`translate(1380 360)`} opacity={clamp((t - 10) / 8)}>
      <path d="M -160 0 L 160 0 M -40 0 L -100 -80 L -60 -80 L 40 0 M -40 0 L -100 80 L -60 80 L 40 0 M -150 0 L -170 -40 M -150 0 L -170 40" stroke={SCH.live} strokeWidth={10} fill="none" strokeLinejoin="round" />
    </g>
    {[0, 1, 2, 3].map((k) => {
      const r = ((t * 4 + k * 60) % 240);
      return <circle key={k} cx={1380} cy={360} r={r} fill="none" stroke={SCH.live} strokeWidth={4} opacity={clamp((t - 14) / 8) * (1 - r / 240)} />;
    })}
    <text x={1380} y={520} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim} opacity={clamp((t - 20) / 8)}>a real plane's transponder</text>
    <text x={560} y={800} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.dim} opacity={clamp((t - 30) / 8)}>your drone's receiver</text>
    <text x={960} y={180} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill="#F6EFE3" opacity={clamp((t - 2) / 8)}>AIRCRAFT WARNING</text>
  </g>
);

export const S12 = bigWord({ kicker: 'A TRANSPONDER. IN', word: '2560 BC', size: 260, color: '#FF4A3A', Bg: DAWN });

// ---------- S13: you look up into the dawn sky ----------
export const S13 = faceCU({ look: YOU, Bg: DAWN, faces: [[0, 'worried'], [30, 'shock']], yaw: 0.15, look_: 0.2, pose: { headTilt: -14 }, bgCam: [1100, 300, 1.4], zoom: [2.8, 3.2] });

// ---------- S14: the sky: a blinking light, very high, that isn't yours ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const x = lerp(700, 1300, clamp(t / Math.max(1, len)));
  return (
    <g>
      <g transform={camT(960, kf(t, [[0, 200], [len, 160]]), 1.2)}>
        <EgyptSky id="s14" tod="dawn" t={t} />
      </g>
      <path d={`M 200 360 Q 600 330 ${x} 300`} stroke="#FFFFFF" strokeWidth={6} opacity={0.5} fill="none" strokeLinecap="round" />
      <circle cx={x} cy={300} r={6} fill="#20202A" />
      <circle cx={x} cy={300} r={7} fill={Math.floor(t / 10) % 2 ? '#FF3A2A' : '#5A2020'} opacity={0.9} />
      {Math.floor(t / 10) % 2 ? <Glow x={x} y={300} r={60} kind="red" o={0.8} /> : null}
      <Caption t={t - 30} text="AND IT ISN'T YOURS" y={900} color="#FF4A3A" />
    </g>
  );
};

// ---------- S15: is any of this real? the checklist ----------
const REAL = ['THE GREAT PYRAMID', 'BREAD AND BEER', 'HEMIUNU', 'BATTERY LIMITS', 'THE AIRCRAFT WARNING'];
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="s15" />
    <text x={960} y={180} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={8} fill="#F6EFE3">IS ANY OF THIS REAL?</text>
    {REAL.map((r, i) => {
      const p = backOut(clamp((t - 30 - i * 18) / 8));
      return (
        <g key={i} transform={`translate(600 ${320 + i * 130}) scale(${p})`} opacity={clamp((t - 30 - i * 18) / 4)}>
          <path d="M -40 0 L -10 30 L 44 -34" stroke="#5BE08A" strokeWidth={18} fill="none" strokeLinecap="round" />
          <text x={90} y={26} fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F6EFE3">{r}</text>
        </g>
      );
    })}
  </g>
);

// ---------- S16: who else is up there? ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1100, kf(t, [[0, 420], [len, 300]]), kf(t, [[0, 1.0], [len, 1.15]]))}>
      <Giza t={t + 500} tod="dawn" id="s16" />
      <circle cx={1500} cy={60} r={5} fill={Math.floor(t / 10) % 2 ? '#FF3A2A' : '#5A2020'} />
    </g>
    <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.35} />
    <Caption t={t} text="WHO ELSE IS UP THERE?" y={480} size={110} color="#FFD45A" />
    <Caption t={t - 30} text="TELL ME IN THE COMMENTS" y={640} size={64} />
    <Caption t={t - 60} text="PART 2 IS COMING" y={800} size={80} color="#FF8A3D" />
  </g>
);
void lerp; void bigWord;
