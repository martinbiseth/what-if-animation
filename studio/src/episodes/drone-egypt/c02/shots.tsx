import React from 'react';
import { Hero, Pose, ShotProps, camT, clamp, kf, easeOut, backOut, idleBlink, FONT, Drone, Controller, DroneBattery, SolarPanel, Giza, walkPose, egyptHip, lerp, Glow } from '../../../engine';
import { YOU, GizaSet, at, propCU, faceCU, screenCU, povShot, viewGiza, egCard, bigWord, HeldController } from '../common';

// Chapter 2, the rules: when and where, the kit laid out one piece at a time (drone, sugar, controller, three
// batteries, the panel, the socket 4,500 years away), the sun and the wait, and the one rule to remember: Return to Home.

const DAY = GizaSet('day');
const sand = <rect x={-400} y={-400} width={2800} height={1900} fill="#D9AE6E" />;

const Title: React.FC<{ t: number; text: string; sub?: string; y?: number; color?: string }> = ({ t, text, sub, y = 900, color = '#F6EFE3' }) => (
  <g>
    <g transform={`translate(960 ${y}) scale(${backOut(clamp((t - 3) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill={color} stroke="#140C10" strokeWidth={12} paintOrder="stroke">{text}</text>
    </g>
    {sub ? <text x={960} y={y + 70} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3" stroke="#140C10" strokeWidth={6} paintOrder="stroke" opacity={clamp((t - 10) / 8)}>{sub}</text> : null}
  </g>
);

// ---------- S1: chapter card ----------
export const S1 = egCard({ kicker: 'THE DEAL', title: 'GIZA, 2560 BC', tod: 'day' });

// ---------- S2: wide, you walk in across the sand toward the site ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const x = lerp(380, 820, clamp(t / Math.max(len, 1)));
  const me = walkPose(x, t * 0.6, 800, 1, { expr: 'happy', blink: idleBlink(t, 2) });
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 960]]), 500, 1.15)}>
      <Giza t={t + 100} tod="day" id="s2" />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S3: the Great Pyramid of King Khufu, being built right now ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1180, kf(t, [[0, 420], [len, 380]]), kf(t, [[0, 1.2], [len, 1.35]]))}>
      <Giza t={t + 200} tod="day" id="s3" />
    </g>
    <Title t={t} text="KING KHUFU'S PYRAMID" sub="under construction" y={880} color="#FFD45A" />
  </g>
);

// ---------- S4: insert, out of the backpack: one normal camera drone ----------
export const S4 = propCU({ Bg: DAY, bgCam: [600, 760, 1.6], draw: (t) => (
  <g>
    {sand}
    <ellipse cx={960} cy={760} rx={380} ry={50} fill="#000" opacity={0.2} />
    <g transform={`translate(960 600) scale(${backOut(clamp(t / 10))}) translate(-960 -600)`}><Drone x={960} y={600} s={1.6} on={false} t={t} /></g>
  </g>
) });

// ---------- S5: on a kitchen scale against a bag of sugar: under a kilo ----------
export const S5 = propCU({ Bg: DAY, bgCam: [600, 760, 1.6], draw: (t) => {
  const tip = Math.sin(clamp(t / 20) * Math.PI) * 3;
  return (
    <g>
      {sand}
      <g transform={`rotate(${tip} 960 700)`}>
        <path d="M 360 700 H 1560" stroke="#3A3D46" strokeWidth={24} strokeLinecap="round" />
        <Drone x={620} y={590} s={0.8} on={false} t={t} />
        <g transform="translate(1300 690)">
          <path d="M -120 0 L -110 -240 Q -60 -270 0 -260 Q 60 -270 110 -240 L 120 0 Z" fill="#F2EEE4" stroke="#3A3030" strokeWidth={6} />
          <rect x={-90} y={-170} width={180} height={90} fill="#2A6AC8" />
          <text x={0} y={-112} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#FFFFFF">SUGAR</text>
          <text x={0} y={-30} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#3A3030">1 kg</text>
        </g>
      </g>
      <path d="M 960 700 L 900 900 H 1020 Z" fill="#3A3D46" />
      <Title t={t} text="UNDER 1 KG" y={1000} />
    </g>
  );
} });

// ---------- S6: the controller with its screen ----------
export const S6 = screenCU({ Bg: DAY, view: viewGiza({ z: [0.45, 0.5] }), battery: 100 });

// ---------- S7: three batteries, 30 minutes each ----------
export const S7 = propCU({ Bg: DAY, bgCam: [600, 760, 1.6], draw: (t) => (
  <g>
    {sand}
    {[0, 1, 2].map((k) => {
      const p = backOut(clamp((t - k * 6) / 9));
      return (
        <g key={k} transform={`translate(${560 + k * 400} 560) scale(${p * 2})`}>
          <DroneBattery x={0} y={0} s={1} level={1} />
          <text x={0} y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#F6EFE3" stroke="#140C10" strokeWidth={8} paintOrder="stroke">~30 MIN</text>
        </g>
      );
    })}
  </g>
) });

// ---------- S8: the folding solar panel opens out ----------
export const S8 = propCU({ Bg: DAY, bgCam: [600, 760, 1.6], draw: (t) => {
  const o = easeOut(clamp(t / 16));
  return (
    <g>
      {sand}
      <g transform={`translate(960 600) scale(${lerp(0.4, 1.9, o)} 1.9)`}><SolarPanel x={0} y={0} s={1} sun={1} /></g>
      <Glow x={1400} y={300} r={400} o={0.4} />
    </g>
  );
} });

// ---------- S9: the nearest wall socket: 4,500 years away ----------
export const S9 = propCU({ bgColor: '#1A1218', draw: (t) => (
  <g>
    <rect x={760} y={260} width={400} height={400} rx={40} fill="#F2EEE4" stroke="#3A3030" strokeWidth={8} />
    <circle cx={960} cy={460} r={120} fill="#E2DCD0" stroke="#3A3030" strokeWidth={6} />
    <circle cx={915} cy={460} r={20} fill="#3A3030" />
    <circle cx={1005} cy={460} r={20} fill="#3A3030" />
    <Title t={t} text="4,500 YEARS AWAY" y={860} color="#FFB15A" />
  </g>
) });

// ---------- S10: wide, the panel in the sun, a battery charging beside you ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = at(560, { yaw: 0.4, look: 0.7, expr: 'happy', armR: { a: 30, b: -30 }, blink: idleBlink(t, 3), headTilt: -4 });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 600, 1.5)}>
      <Giza t={t + 300} tod="day" id="s10" sledge={false} />
      <g transform="translate(1020 780) scale(0.5 0.28)"><SolarPanel x={0} y={0} s={1} sun={1} /></g>
      <DroneBattery x={1260} y={790} s={0.5} level={clamp(t / 200 + 0.2)} />
      <path d="M 1190 780 Q 1220 800 1225 790" stroke="#141418" strokeWidth={5} fill="none" />
      <Hero look={YOU} pose={me} />
      <Glow x={1500} y={200} r={600} o={0.35} />
    </g>
  );
};

// ---------- S11: half an hour of magic, then you wait ----------
export const S11: React.FC<ShotProps> = ({ t }) => {
  const sweep = clamp(t / 50);
  return (
    <g>
      <g filter="url(#blur16)"><g transform={camT(1100, 420, 1)}><Giza t={t + 400} tod="gold" id="s11" /></g></g>
      <rect width={1920} height={1080} fill="#140C10" opacity={0.4} />
      <circle cx={960} cy={500} r={250} fill="#140C10" opacity={0.6} stroke="#F6EFE3" strokeWidth={12} />
      <path d={`M 960 500 L 960 250 A 250 250 0 ${sweep > 0.5 ? 1 : 0} 1 ${960 + Math.sin(sweep * Math.PI * 2) * 250} ${500 - Math.cos(sweep * Math.PI * 2) * 250} Z`} fill="#FFB15A" opacity={0.85} />
      <text x={960} y={530} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3" stroke="#140C10" strokeWidth={10} paintOrder="stroke">30 MIN</text>
      <text x={960} y={880} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#F6EFE3" stroke="#140C10" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 40) / 8)}>THEN YOU WAIT</text>
    </g>
  );
};

// ---------- S12: close, you: one more thing ----------
export const S12 = faceCU({ look: YOU, Bg: GizaSet('gold'), faces: [[0, 'neutral'], [10, 'smug']], yaw: -0.25, look_: -0.6, pose: { armR: { a: 150, b: 20 }, handR: 'point' }, bgCam: [1150, 420, 1.4] });

// ---------- S13: the camera: SIGNAL LOST ----------
export const S13 = povShot({ view: viewGiza({ cx: 1600, cy: 300, z: [0.9, 0.9], drift: [400, 0] }), battery: 64, signal: (t) => (t > 12 ? 0 : 2), warn: (t) => (t > 12 ? 'SIGNAL LOST' : undefined) });

// ---------- S14: the drone turns round in the sky and flies straight back ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const turn = easeOut(clamp(t / 20));
  const back = clamp((t - 20) / Math.max(1, len - 20));
  return (
    <g transform={camT(960, 500, 1.1)}>
      <Giza t={t + 500} tod="gold" id="s14" sledge={false} />
      <path d="M 1500 260 Q 1100 300 500 600" stroke="#F6EFE3" strokeWidth={6} strokeDasharray="16 16" fill="none" opacity={0.6} />
      <Drone x={lerp(1500, 600, back)} y={lerp(260, 560, back)} s={lerp(0.25, 0.5, back)} t={t} tilt={-20 * turn + 10} />
      <g transform="translate(500 790)">
        <ellipse cx={0} cy={0} rx={90} ry={18} fill="#F6EFE3" opacity={0.5} />
        <text x={0} y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#140C10">H</text>
      </g>
    </g>
  );
};

// ---------- S15: the screen: RETURN TO HOME ----------
export const S15 = screenCU({ Bg: GizaSet('gold'), view: viewGiza({ z: [0.6, 0.75], cx: 500, cy: 900 }), battery: 63, warn: 'RETURN TO HOME' });

// ---------- S16: remember that ----------
export const S16 = bigWord({ kicker: 'REMEMBER THIS', word: 'RETURN TO HOME', size: 150, color: '#5BE08A', Bg: GizaSet('gold') });

// ---------- S17: the title over Giza at dusk ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1150, 430, kf(t, [[0, 0.95], [len, 1.05]]))}>
      <Giza t={t + 700} tod="dusk" id="s17" />
      <Drone x={760} y={260} s={0.3} t={t} />
    </g>
    <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.35} />
    <g transform={`translate(960 430) scale(${backOut(clamp((t - 2) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3" stroke="#140C10" strokeWidth={12} paintOrder="stroke">WHAT IF YOU BROUGHT</text>
    </g>
    <g transform={`translate(960 580) scale(${backOut(clamp((t - 8) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFD45A" stroke="#140C10" strokeWidth={12} paintOrder="stroke">A DRONE TO ANCIENT EGYPT?</text>
    </g>
  </g>
);
void Controller; void egyptHip; void HeldController;
