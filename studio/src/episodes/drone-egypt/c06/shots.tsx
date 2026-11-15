import React from 'react';
import { Hero, Pose, ShotProps, camT, clamp, kf, easeOut, backOut, idleBlink, FONT, Drone, Camp, Dunes, DroneBattery, Camel, Torch, TinyWorker, lerp, egyptHip, walkPose, FIRE, EG } from '../../../engine';
import { YOU, NEFER, DJEDI, GUARD, CampSet, DunesSet, at, propCU, faceCU, screenCU, povShot, viewNight, egCard, bigWord, talkShot, HeldController } from '../common';

// Chapter 6, the choice: Nefer's father lost in the desert after a sandstorm, the soldiers won't go, the full battery
// or the king's sunrise; you fly. Brown screen, grey dunes, the battery falling, a fire, six people waving, the
// soldiers ride out, signal lost, and Return to Home brings it back to your feet at nine percent as the sun comes up.

const CAMP = CampSet();
const NIGHT = DunesSet('night');

const Caption: React.FC<{ t: number; text: string; y?: number; color?: string; size?: number }> = ({ t, text, y = 980, color = '#F6EFE3', size = 80 }) => (
  <g transform={`translate(960 ${y}) scale(${backOut(clamp((t - 3) / 9))})`}>
    <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke="#140C10" strokeWidth={12} paintOrder="stroke">{text}</text>
  </g>
);
const sitting = (x: number, o: Partial<Pose> = {}): Pose => {
  const sc = o.scale ?? 1;
  return { ...at(x, { legL: { a: -80, b: 80 }, legR: { a: -80, b: 80 }, ...o }, sc), y: egyptHip(sc) + 70 * sc };
};

export const S1 = egCard({ kicker: 'THAT NIGHT', title: 'THE CHOICE', tod: 'night' });

// ---------- S2: the camp, Nefer comes running to you at the fire ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const x = lerp(-100, 520, clamp(t / Math.max(1, len - 10)));
  const me = sitting(1000, { yaw: -0.4, look: -0.7, expr: t > 30 ? 'worried' : 'neutral', blink: idleBlink(t, 2) });
  return (
    <g transform={camT(760, 620, 1.25)}>
      <Camp t={t} id="s2" />
      <Hero look={YOU} pose={me} rimId="rimL" />
      <Hero look={NEFER} pose={walkPose(x, t * 0.9, 830, 0.72, { expr: 'worried', tilt: 12 })} rimId="rimR" />
    </g>
  );
};

// ---------- S3: her father's team walking into the desert ----------
export const S3: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 560, 1.2)}>
    <Dunes t={t} tod="dusk" storm={0.2 + clamp(t / 90) * 0.4} id="s3" />
    {Array.from({ length: 6 }).map((_, i) => (
      <TinyWorker key={i} x={700 + i * 50 + t * 0.6} y={EG.horizon + 200 - i * 4} s={1.6} t={t} seed={i} lean={10} />
    ))}
  </g>
);

// ---------- S4: the sandstorm ----------
export const S4: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960 + Math.sin(t / 2) * 6, 540, 1.1)}>
    <Dunes t={t * 2} tod="dusk" storm={0.9} id="s4" />
  </g>
);

export const S5 = faceCU({ look: NEFER, Bg: CAMP, faces: [[0, 'worried']], yaw: 0.25, look_: 0.4, zoom: [2.6, 2.8], pose: { scale: 0.72, y: 760 }, bgCam: [760, 700, 1.6], light: '#FF8A3D' });

// ---------- S6: the empty desert at night, with no water ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 540, 1.05)}>
    <Dunes t={t} tod="night" id="s6" />
  </g>
);

// ---------- S7: the king's soldiers shrug and turn away ----------
export const S7 = talkShot({
  Set: CAMP, setT: 300,
  cast: [
    { look: GUARD, x: 1300, y: egyptHip(1) + 30, yaw: -0.2, faces: [[0, 'smug']], pose: { armL: { a: 20, b: -60 }, armR: { a: 20, b: -60 } }, rim: 'rimL' },
    { look: GUARD, x: 1520, y: egyptHip(1) + 30, yaw: 0.6, faces: [[0, 'cool']], rim: 'rimL' },
  ],
  cam: { from: [1380, 600, 1.7], to: [1400, 600, 1.8] },
});

// ---------- S8: insert, the batteries: one full, one half ----------
export const S8 = propCU({ Bg: CAMP, draw: (t) => (
  <g>
    {[1, 0.5].map((l, k) => (
      <g key={k} transform={`translate(${720 + k * 480} 520) scale(${backOut(clamp((t - k * 6) / 9)) * 2.4})`}>
        <DroneBattery x={0} y={0} level={l} />
        <text x={0} y={100} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#F6EFE3" stroke="#140C10" strokeWidth={8} paintOrder="stroke">{l === 1 ? 'FLY NOW' : 'SUNRISE'}</text>
      </g>
    ))}
  </g>
) });

export const S9 = bigWord({ kicker: 'FOR THE KING AT SUNRISE', word: '50%', size: 300, color: '#FFC23A', Bg: CAMP });
export const S10 = faceCU({ look: DJEDI, Bg: CAMP, faces: [[0, 'smug']], yaw: -0.25, look_: -0.4, bgCam: [1300, 500, 1.4], light: '#FF8A3D' });

// ---------- S11: close, Nefer just looks at you ----------
export const S11 = faceCU({ look: NEFER, Bg: CAMP, faces: [[0, 'worried']], yaw: 0.1, look_: 0.1, zoom: [3.0, 3.2], pose: { scale: 0.72, y: 760, headTilt: -6 }, bgCam: [760, 700, 1.6], light: '#FF8A3D' });

// ---------- S12: you fly: the drone lifts off by the fire ----------
export const S12: React.FC<ShotProps> = ({ t }) => {
  const up = easeOut(clamp(t / 20));
  return (
    <g transform={camT(860, 600, 1.4)}>
      <Camp t={t + 60} id="s12" />
      <Hero look={YOU} pose={at(560, { yaw: 0.4, look: 0.6, expr: 'cool', armR: { a: 50, b: -80 }, headTilt: -8 * up })} rimId="rimR" />
      <Drone x={960} y={lerp(800, 380, up)} s={0.4} t={t} dust={up < 0.5} />
    </g>
  );
};

// ---------- S13: low and slow under the wind: the screen goes brown, clear, brown ----------
export const S13 = povShot({ view: viewNight({ pan: [700, 600, 1200, 500], len: 200, brown: (t) => 0.5 * Math.max(0, Math.sin(t / 18)) }), battery: (t) => 98 - t * 0.02, alt: 12, dist: 900 });

// ---------- S14: grey on black: dunes, rocks, nothing ----------
export const S14 = povShot({ view: viewNight({ pan: [1100, 500, 1700, 300], len: 200 }), battery: 62, alt: 30, dist: 2600 });

// ---------- S15: Nefer holds your sleeve tight; the screen lights your faces ----------
export const S15: React.FC<ShotProps> = ({ t }) => {
  const me = sitting(1000, { yaw: -0.1, look: 0, expr: 'worried', armR: { a: 50, b: -90 }, armL: { a: 40, b: -90 }, blink: idleBlink(t, 2) });
  const her = sitting(820, { yaw: 0.4, look: 0.5, expr: 'worried', armR: { a: 70, b: -30 }, scale: 0.72, blink: idleBlink(t, 6) });
  return (
    <g transform={camT(930, 560, 2.1)}>
      <Camp t={t + 120} id="s15" />
      <Hero look={NEFER} pose={her} rimId="rimBlue" />
      <Hero look={YOU} pose={me} rimId="rimBlue" />
      <HeldController pose={me} t={t} view={viewNight({ pan: [1500, 400, 1700, 300] })} battery={40} />
    </g>
  );
};

// ---------- S16: the battery falls: forty, thirty, twenty ----------
export const S16 = screenCU({ Bg: CAMP, view: viewNight({ pan: [1700, 300, 2000, 200], len: 120 }), battery: (t) => Math.max(20, 42 - t * 0.33) });

// ---------- S17: far out, a tiny orange dot ----------
export const S17 = povShot({ view: viewNight({ fire: [1500, 600], pan: [1200, 520, 1300, 560], z: [0.9, 1.0], len: 120 }), battery: 19, alt: 60, dist: 5100 });

// ---------- S18: lower: six people round a fire, waving at the sky ----------
export const S18 = povShot({ view: viewNight({ fire: [1500, 600], pan: [1500, 600, 1500, 600], z: [2.2, 2.8], len: 120, wave: true }), battery: 17, alt: (t) => 40 - t * 0.15, dist: 5200 });

// ---------- S19: you mark the spot; the soldiers ride out with torches ----------
export const S19: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(960, 620, 1.2)}>
    <Camp t={t + 160} id="s19" />
    {[0, 1, 2].map((k) => {
      const x = lerp(300 + k * 120, 2100 + k * 120, clamp((t - k * 8) / 90));
      return (
        <g key={k}>
          <Camel x={x} y={840 - k * 10} s={0.8} t={t} run />
          <Torch x={x + 40} y={560 - k * 10} s={0.8} t={t} rot={10} />
        </g>
      );
    })}
  </g>
);

// ---------- S20: the screen freezes: signal lost ----------
export const S20 = povShot({ view: viewNight({ fire: [1500, 600], pan: [1500, 600, 1500, 600], z: [2.4, 2.4], len: 120 }), freeze: 4, battery: 14, signal: (t) => (t > 4 ? 0 : 1), warn: (t) => (t > 6 ? 'SIGNAL LOST' : undefined) });

// ---------- S21: far out, a tiny light behind a dune ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1100], [len, 1200]]), 560, 1.1)}>
    <Dunes t={t} tod="night" id="s21" />
    <circle cx={1500} cy={EG.horizon + 40} r={5} fill={Math.floor(t / 8) % 2 ? '#5BE08A' : '#2A5A3A'} />
    <Caption t={t - 10} text="KILOMETRES AWAY" y={960} size={64} />
  </g>
);

export const S22 = bigWord({ kicker: 'THE RULE', word: 'RETURN TO HOME', size: 150, color: '#5BE08A', Bg: CAMP });

// ---------- S23: you both look up into the dark: a buzz getting louder ----------
export const S23 = talkShot({
  Set: CAMP, setT: 400,
  cast: [
    { look: NEFER, x: 800, y: egyptHip(0.72) + 30, scale: 0.72, yaw: 0.2, faces: [[0, 'worried'], [60, 'shock']], pose: { headTilt: -14, look: 0 }, rim: 'rimR' },
    { look: YOU, x: 1000, y: egyptHip(1) + 30, yaw: -0.1, faces: [[0, 'worried'], [50, 'happy']], pose: { headTilt: -14, look: 0 }, rim: 'rimR' },
  ],
  cam: { from: [900, 560, 1.7], to: [900, 540, 1.8] },
});

// ---------- S24: out of the dark the drone comes home by itself ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const p = easeOut(clamp(t / Math.max(1, len)));
  return (
    <g transform={camT(960, 500, 1.3)}>
      <Camp t={t + 200} id="s24" />
      <Drone x={lerp(1700, 980, p)} y={lerp(150, 600, p)} s={lerp(0.12, 0.45, p)} t={t} tilt={-14 * (1 - p)} />
      <Caption t={t - 20} text="RETURN TO HOME" y={980} color="#5BE08A" size={70} />
    </g>
  );
};

// ---------- S25: it lands in the sand at your feet ----------
export const S25: React.FC<ShotProps> = ({ t }) => {
  const d = easeOut(clamp(t / 24));
  return (
    <g transform={camT(FIRE.x + 300, 780, 2.4)}>
      <Camp t={t + 240} id="s25" />
      <ellipse cx={FIRE.x + 300} cy={850} rx={120 * d + 20} ry={14} fill="#000" opacity={0.3} />
      <Drone x={FIRE.x + 300} y={lerp(560, 810, d)} s={0.35} t={t} on={t < 34} dust={d > 0.6 && t < 40} />
      {[-1, 1].map((sd) => <ellipse key={sd} cx={FIRE.x + 300 + sd * 120} cy={850} rx={34} ry={14} fill="#F6EFE3" stroke="#100E16" strokeWidth={4} />)}
    </g>
  );
};

// ---------- S26: battery: nine percent ----------
export const S26 = propCU({ Bg: CAMP, push: 0.1, draw: (t) => {
  const p = backOut(clamp((t - 2) / 10));
  return (
    <g transform={`translate(960 540) scale(${p})`}>
      <rect x={-420} y={-170} width={760} height={340} rx={50} fill="#101014" stroke="#F6EFE3" strokeWidth={22} />
      <rect x={340} y={-70} width={60} height={140} rx={14} fill="#F6EFE3" />
      <rect x={-385} y={-135} width={690 * 0.09} height={270} rx={20} fill="#FF4A3A" opacity={Math.floor(t / 10) % 2 ? 1 : 0.5} />
      <text x={-20} y={60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#FF4A3A" stroke="#101014" strokeWidth={14} paintOrder="stroke">9%</text>
    </g>
  );
} });

// ---------- S27: and the sun is coming up ----------
export const S27: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1100, kf(t, [[0, 520], [len, 470]]), 1.0)}>
    <Camp t={t + 300} id="s27" fire={false} dawn={clamp(t / 60)} />
  </g>
);
void NIGHT; void Dunes;

// ---------- S28: the drone low over moonlit dunes, sand still blowing ----------
export const S28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1050]]), 560, 1.5)}>
    <Dunes t={t * 2} tod="night" storm={0.3} id="s28" />
    <Drone x={kf(t, [[0, 800], [len, 1150]])} y={640 + Math.sin(t / 6) * 10} s={0.35} t={t} tilt={12 + Math.sin(t / 3) * 6} />
  </g>
);

// ---------- S29: the screen: brown, then clear, then brown again ----------
export const S29 = screenCU({ Bg: CAMP, view: viewNight({ pan: [900, 600, 1100, 520], len: 120, brown: (t) => (t < 25 || t > 55 ? 0.7 : 0.05) }), battery: 71 });
