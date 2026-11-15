import React from 'react';
import { Hero, Pose, ShotProps, camT, clamp, kf, easeOut, backOut, idleBlink, FONT, Drone, Controller, ThroneHall, Camp, SolarPanel, DroneBattery, Spear, lerp, egyptHip, walkPose, Glow, Sparkle, HALL, FIRE, talkAt } from '../../../engine';
import { YOU, NEFER, KING, DJEDI, GUARD, GizaSet, NileSet, HallSet, CampSet, at, inHall, propCU, faceCU, screenCU, viewGiza, egCard, bigWord, talkShot, span, HeldController } from '../common';
import words from './words.json';

// Chapter 5, the king's magician: Djedi and the goose, up the river to Khufu's hall, the drone between the columns,
// the king flies it into a column and the sensors save it, "it belongs to the king", the whisper, the order for
// sunrise, and back at camp the panel cracks under a boot.

const W = words as { w: string; s: number; e: number }[];
const HALL_ = HallSet();
const CAMP = CampSet();

const Caption: React.FC<{ t: number; text: string; y?: number; color?: string; size?: number }> = ({ t, text, y = 980, color = '#F6EFE3', size = 80 }) => (
  <g transform={`translate(960 ${y}) scale(${backOut(clamp((t - 3) / 9))})`}>
    <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#140C10" strokeWidth={12} paintOrder="stroke">{text}</text>
  </g>
);
const kingLine = (a: string, b: string, nth = 1) => span(W, a, b, nth);

export const S1 = egCard({ kicker: 'THE PALACE', title: "THE KING'S MAGICIAN", tod: 'dusk' });

// ---------- S2: Djedi on the bank, a name plate ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const N = NileSet('gold', { gold: true, boatX: 700 });
  return (
    <g>
      <g transform={camT(kf(t, [[0, 1000], [len, 1030]]), 520, 1.6)}>
        <N t={t + 200} id="s2" />
        <Hero look={DJEDI} pose={at(1060, { yaw: -0.3, look: -0.5, expr: 'smug', armL: { a: 20, b: -70 }, armR: { a: 20, b: -70 }, blink: idleBlink(t, 3), tilt: Math.sin(t / 25) })} />
      </g>
      <g opacity={clamp((t - 6) / 8)}>
        <rect x={1180} y={760} width={600} height={130} rx={20} fill="#140C10" opacity={0.75} />
        <text x={1480} y={820} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFD45A">DJEDI</text>
        <text x={1480} y={866} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#F6EFE3">the king's magician</text>
      </g>
    </g>
  );
};

// ---------- S3: the old story: a goose's head goes back on ----------
export const S3 = propCU({ bgColor: '#2A1E2A', draw: (t) => {
  const back = easeOut(clamp((t - 16) / 10));
  return (
    <g>
      <g transform="translate(960 640)">
        <ellipse cx={0} cy={0} rx={200} ry={110} fill="#F2EEE4" stroke="#2A2020" strokeWidth={8} />
        <path d="M 150 -40 Q 210 -120 200 -200" stroke="#F2EEE4" strokeWidth={50} fill="none" strokeLinecap="round" />
        <path d="M 150 -40 Q 210 -120 200 -200" stroke="#2A2020" strokeWidth={8} fill="none" strokeDasharray="0" opacity={0.2} />
        <g transform={`translate(${lerp(260, 0, back)} ${lerp(160, 0, back)}) rotate(${lerp(80, 0, back)} 200 -220)`}>
          <circle cx={200} cy={-220} r={44} fill="#F2EEE4" stroke="#2A2020" strokeWidth={8} />
          <path d="M 236 -224 L 300 -210 L 236 -200 Z" fill="#E8A83A" stroke="#2A2020" strokeWidth={5} />
          <circle cx={214} cy={-232} r={7} fill="#1A1010" />
        </g>
        {[[-60, 110], [60, 110]].map(([x, y], k) => <path key={k} d={`M ${x} ${y - 20} V ${y + 60}`} stroke="#E8A83A" strokeWidth={14} />)}
      </g>
      {back > 0.9 ? <Sparkle x={1160} y={420} t={t - 26} s={2} /> : null}
      <Caption t={t} text="THE OLD STORIES" y={980} color="#FFD45A" size={70} />
    </g>
  );
} });

// ---------- S4: the golden boat carries you up the river ----------
export const S4 = talkShot({ Set: NileSet('dusk', { gold: true }), setT: 600, cast: [], cam: { from: [900, 520, 1.1], to: [1000, 520, 1.2] } });

// ---------- S5: wide, the hall: Khufu himself on the throne ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 1.0], [len, 1.15]]))}>
      <ThroneHall t={t} id="s5" />
      <Hero look={KING} pose={{ ...inHall(960, HALL.dais - 20, { yaw: 0, expr: 'neutral', blink: idleBlink(t, 3), armL: { a: 30, b: -40 }, armR: { a: 30, b: -40 } }) }} />
      <Hero look={GUARD} pose={inHall(760, HALL.dais + 20, { yaw: 0.3 })} />
      <Hero look={GUARD} pose={inHall(1160, HALL.dais + 20, { yaw: -0.3 })} />
    </g>
    <Caption t={t - 6} text="KING KHUFU" y={980} color="#FFD45A" />
  </g>
);

// ---------- S6: the drone weaves between the columns ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const p = clamp(t / Math.max(1, len));
  const me: Pose = inHall(960, 1000, { yaw: 0, look: 0, expr: 'happy', armR: { a: 50, b: -70 }, blink: idleBlink(t, 2) });
  return (
    <g transform={camT(960, 560, 1.05)}>
      <ThroneHall t={t + 20} id="s6" />
      <Hero look={KING} pose={inHall(960, HALL.dais - 20, { expr: 'shock', armL: { a: 30, b: -40 }, armR: { a: 30, b: -40 } })} />
      <Drone x={960 + Math.sin(p * Math.PI * 3) * 420} y={lerp(300, 420, p)} s={lerp(0.35, 0.25, p)} t={t} tilt={Math.cos(p * Math.PI * 3) * 20} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S7: the guards drop their spears ----------
export const S7: React.FC<ShotProps> = ({ t }) => {
  const d = easeOut(clamp(t / 12));
  return (
    <g transform={camT(960, 520, 1.6)}>
      <ThroneHall t={t + 40} id="s7" />
      {[700, 1220].map((x, k) => (
        <g key={k}>
          <Hero look={GUARD} pose={inHall(x, 880, { yaw: k ? -0.3 : 0.3, look: 0, headTilt: -12, expr: 'shock', armL: { a: 150, b: 10 }, armR: { a: 150, b: 10 }, blink: idleBlink(t, k + 2) })} />
          <Spear x={x + (k ? -60 : 60)} y={lerp(500, 860, d)} rot={lerp(-80, k ? -170 : -10, d)} s={0.8} />
        </g>
      ))}
      <Drone x={960} y={260} s={0.3} t={t} />
    </g>
  );
};

// ---------- S8: close, the king doesn't flinch, then laughs ----------
export const S8 = faceCU({ look: KING, Bg: HALL_, faces: [[0, 'neutral'], [36, 'happy']], yaw: -0.1, look_: 0.2, pose: { headTilt: -6 }, bgCam: [960, 400, 1.4] });

// ---------- S9: he takes the controller himself; you hover beside him ----------
export const S9 = talkShot({
  Set: HALL_, setT: 100,
  cast: [
    { look: KING, x: 880, y: egyptHip(1) + 40, yaw: 0.3, faces: [[0, 'happy']], pose: { armL: { a: 50, b: -90 }, armR: { a: 50, b: -90 } } },
    { look: YOU, x: 1150, y: egyptHip(1) + 40, yaw: -0.4, faces: [[0, 'worried']], pose: { armR: { a: 60, b: -60 } } },
  ],
  cam: { from: [1000, 540, 1.6], to: [1000, 540, 1.7] },
  front: (t) => <HeldController pose={{ ...at(880, { armR: { a: 50, b: -90 }, yaw: 0.3 }), y: egyptHip(1) + 40 }} t={t} />,
});

// ---------- S10: both sticks forward: the column fills the screen ----------
export const S10 = screenCU({
  Bg: HALL_,
  view: (t) => {
    const g = clamp(t / 30);
    return (
      <g>
        <rect width={1920} height={1080} fill="#4A3430" />
        <rect x={960 - lerp(120, 700, g)} y={-100} width={lerp(240, 1400, g)} height={1300} fill="#D8C49A" />
        <rect x={960 - lerp(120, 700, g)} y={300} width={lerp(240, 1400, g)} height={lerp(14, 60, g)} fill="#2A5AA8" />
      </g>
    );
  },
  battery: 70, sticks: (t) => (t > 2 ? [0, -1, 0, -1] : [0, 0, 0, 0]), warn: (t) => (t > 18 ? 'OBSTACLE AHEAD' : undefined),
});

// ---------- S11: the drone shoots at a column ----------
export const S11: React.FC<ShotProps> = ({ t }) => {
  const p = easeOut(clamp(t / 14));
  return (
    <g transform={camT(1300, 480, 1.7)}>
      <ThroneHall t={t + 60} id="s11" />
      <Drone x={lerp(800, 1440, p)} y={420} s={0.4} t={t} tilt={22} />
      {[0, 1, 2].map((k) => <path key={k} d={`M ${lerp(800, 1440, p) - 140 - k * 60} ${400 + k * 20} h -120`} stroke="#F6EFE3" strokeWidth={6} opacity={0.5} strokeLinecap="round" />)}
    </g>
  );
};

export const S12 = faceCU({ look: YOU, Bg: HALL_, faces: [[0, 'shock']], yaw: 0.35, look_: 0.7, bgCam: [960, 400, 1.4], pose: { armL: { a: 150, b: 60 }, armR: { a: 150, b: 60 } } });

// ---------- S13: it stops half a metre from the stone and just hangs there, humming ----------
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <g transform={camT(1420, 440, 2.4)}>
      <ThroneHall t={t + 80} id="s13" />
      <Drone x={1470} y={430} s={0.4} t={t} tilt={-8 * Math.exp(-t / 10) * Math.cos(t / 2)} />
      <path d="M 1530 470 H 1620" stroke="#5BE08A" strokeWidth={4} strokeDasharray="8 8" opacity={clamp((t - 6) / 6)} />
    </g>
    <Caption t={t - 10} text="OBSTACLE SENSORS: STOP" y={980} color="#5BE08A" size={70} />
  </g>
);

// ---------- S14: the king, arms wide: an eye that flies ----------
export const S14 = talkShot({
  Set: HALL_, setT: 140, words: W,
  cast: [{ look: KING, x: 960, y: egyptHip(1) + 40, yaw: 0.1, faces: [[0, 'happy']], talk: [kingLine('An', 'enemy')], pose: { armL: { a: 110, b: 10 }, armR: { a: 110, b: 10 } } }],
  cam: { from: [960, 480, 1.9], to: [960, 470, 2.05] },
});

// ---------- S15: every corner of Egypt, every mine, every enemy ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    {viewGiza({ cx: 900, cy: 700, z: [0.45, 0.3], len })(t)}
    <rect width={1920} height={1080} fill="#140C10" opacity={0.25} />
    <Caption t={t - 4} text="EVERY MINE" y={420} color="#FFD45A" />
    <Caption t={t - 26} text="EVERY ENEMY" y={600} color="#FF4A3A" />
  </g>
);

// ---------- S16: close, the king points at it: it belongs to the king ----------
export const S16 = faceCU({
  look: KING, Bg: HALL_, faces: [[0, 'smug']], yaw: -0.2, look_: -0.3, bgCam: [960, 400, 1.4], words: W, talk: kingLine('It', 'king', 1),
  pose: { armR: { a: 120, b: 0 }, handR: 'point' },
  front: (t) => <Caption t={t - 30} text={'"IT BELONGS TO THE KING."'} y={980} color="#FFD45A" size={70} />,
});

// ---------- S17: Djedi leans in and whispers ----------
export const S17 = talkShot({
  Set: HALL_, setT: 180,
  cast: [
    { look: KING, x: 880, y: egyptHip(1) + 40, yaw: 0.3, faces: [[0, 'neutral'], [40, 'worried']] },
    { look: DJEDI, x: 1080, y: egyptHip(1) + 40, yaw: -0.6, faces: [[0, 'smug']], pose: { tilt: -14, armR: { a: 80, b: -100 } } },
  ],
  cam: { from: [980, 470, 2.1], to: [980, 470, 2.2] },
});

export const S18 = faceCU({ look: NEFER, Bg: HALL_, faces: [[0, 'worried']], yaw: 0.3, look_: 0.5, zoom: [2.6, 2.8], pose: { scale: 0.72, y: 760 }, bgCam: [400, 500, 1.6] });
export const S19 = bigWord({ kicker: 'A MAN WHO COMMANDS A SKY SPIRIT IS', word: 'MORE DANGEROUS', size: 170, color: '#FF4A3A', sub: 'than an army', Bg: HALL_ });

// ---------- S20: wide, the king stands and points at you ----------
export const S20: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 600, 1.1)}>
    <ThroneHall t={t + 200} id="s20" />
    <Hero look={KING} pose={inHall(960, HALL.dais + 10, { expr: 'smug', armR: { a: 120, b: 0 }, handR: 'point', look: 0, blink: idleBlink(t, 3) })} />
    <Hero look={DJEDI} pose={inHall(1130, HALL.dais + 20, { expr: 'smug', yaw: -0.3 })} />
    <Hero look={YOU} pose={inHall(900, 1000, { yaw: 0.1, expr: 'worried', look: 0 })} rimId="rimL" />
  </g>
);

export const S21 = bigWord({ kicker: 'TOMORROW AT SUNRISE: ALL OF EGYPT', word: 'OR ELSE', size: 220, color: '#FF8A3D', Bg: GizaSet('dawn') });

// ---------- S22: in the shadows, Nefer squeezes your hand ----------
export const S22 = talkShot({
  Set: HallSet({ dim: 0.3 }), setT: 220,
  cast: [
    { look: NEFER, x: 880, y: egyptHip(0.72) + 40, scale: 0.72, yaw: 0.5, faces: [[0, 'worried']], pose: { armR: { a: 50, b: 0 } } },
    { look: YOU, x: 1060, y: egyptHip(1) + 40, yaw: -0.4, faces: [[0, 'worried']], pose: { armL: { a: 30, b: 0 } } },
  ],
  cam: { from: [970, 500, 2.0], to: [970, 500, 2.1] },
});

// ---------- S23: back at the camp, by the fire, you unfold the panel ----------
export const S23: React.FC<ShotProps> = ({ t }) => {
  const me: Pose = { ...at(1000, { yaw: -0.3, look: -0.6, expr: 'tired', tilt: 25, armR: { a: 60, b: -20 }, armL: { a: 50, b: -30 }, blink: idleBlink(t, 3) }) };
  return (
    <g transform={camT(980, 620, 1.5)}>
      <Camp t={t} id="s23" />
      <g transform="translate(1180 840) scale(0.45 0.25)"><SolarPanel x={0} y={0} s={1} /></g>
      <Hero look={YOU} pose={me} rimId="rimL" />
    </g>
  );
};

// ---------- S24: one of Djedi's men walks straight across it ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const x = lerp(1600, 900, clamp(t / Math.max(1, len)));
  return (
    <g transform={camT(1150, 650, 1.6)}>
      <Camp t={t + 30} id="s24" />
      <g transform="translate(1180 840) scale(0.45 0.25)"><SolarPanel x={0} y={0} s={1} crack={x < 1200 ? 1 : 0} /></g>
      <Hero look={GUARD} pose={walkPose(x, t * 0.55, 830, 1, { expr: 'smug' }, -1)} rimId="rimL" />
    </g>
  );
};

// ---------- S25: insert, crack ----------
export const S25 = propCU({ Bg: CAMP, draw: (t) => (
  <g transform={`translate(${t < 6 ? Math.sin(t * 3) * 10 : 0} 0)`}>
    <g transform="translate(960 560) scale(2.2)"><SolarPanel x={0} y={0} s={1} crack={clamp(t / 8)} /></g>
    <Caption t={t - 2} text="CRACK" y={980} color="#FF4A3A" size={120} />
  </g>
) });

// ---------- S26: it still works, barely: a tenth of the power ----------
export const S26 = propCU({ Bg: CAMP, draw: (t) => (
  <g>
    <g transform="translate(960 480) scale(1.6)"><SolarPanel x={0} y={0} s={1} crack={1} /></g>
    <rect x={560} y={780} width={800} height={60} rx={30} fill="#140C10" stroke="#F6EFE3" strokeWidth={6} />
    <rect x={570} y={790} width={780 * 0.1 * clamp(t / 20)} height={40} rx={20} fill="#FF4A3A" />
    <text x={960} y={940} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#F6EFE3" stroke="#140C10" strokeWidth={10} paintOrder="stroke">10% POWER</text>
  </g>
) });

// ---------- S27: one full, one half, nothing more ----------
export const S27 = propCU({ Bg: CAMP, draw: (t) => (
  <g>
    {[1, 0.5, 0].map((l, k) => (
      <g key={k} transform={`translate(${560 + k * 400} 520) scale(${backOut(clamp((t - k * 6) / 9)) * 2.2})`}>
        <DroneBattery x={0} y={0} level={l} />
        <text x={0} y={100} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill={l === 0 ? '#FF4A3A' : '#F6EFE3'} stroke="#140C10" strokeWidth={8} paintOrder="stroke">{l === 1 ? 'FULL' : l === 0.5 ? 'HALF' : 'EMPTY'}</text>
      </g>
    ))}
  </g>
) });
void Controller; void Glow; void FIRE; void talkAt; void screenCU; void viewGiza;

// ---------- S28: close, Djedi smiles: if it doesn't, the magician was right ----------
export const S28 = faceCU({ look: DJEDI, Bg: HALL_, faces: [[0, 'neutral'], [50, 'smug']], yaw: -0.25, look_: -0.5, bgCam: [960, 400, 1.4], light: '#FF8A3D' });
