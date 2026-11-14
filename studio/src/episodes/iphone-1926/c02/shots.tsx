import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, chapterCard, factCard, Rooftop, Street26, street26Hip, ShotProps, idleBlink, Glow, faceAt, Bedroom,
} from '../../../engine';
import { YOU, StreetSet, phoneCU, faceCU, HeldPhone, handAt } from '../common';

// Chapter 2, the premise and its rules: no signal, no network until 1979, no GPS until 1978; what still works;
// your whole life in the photos; the battery.

const DUSK = StreetSet();
const NIGHT = StreetSet({ night: true, cars: false });
const HIP = street26Hip(1);

export const S1 = chapterCard({ kicker: 'CHAPTER 2', title: 'THE RULES' });

/** You on the corner, the phone in one hand and the charger's cable dangling from the other. */
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 960, y: HIP, yaw: 0.15, expr: 'neutral', armR: { a: 40, b: -70 }, armL: { a: 38, b: -60 }, headTilt: Math.sin(t / 20) * 3, blink: idleBlink(t, 3), look: 0.3 };
  const hl = handAt(me, 'L');
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <Street26 t={t + 1200} id="c2s2" cars={false} />
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={me} t={t} battery={100} />
      <path d={`M ${hl.x} ${hl.y + 6} q 6 40 -4 70 q -10 30 6 60`} stroke="#F6EFE3" strokeWidth={5} fill="none" strokeLinecap="round" />
      <rect x={hl.x - 14} y={hl.y - 22} width={28} height={30} rx={5} fill="#F6EFE3" stroke="#100E16" strokeWidth={3} />
    </g>
  );
};

export const S3 = phoneCU({ mode: 'nosignal', battery: 100, Bg: DUSK, text: 'Hello??' });

export const S4 = factCard({ value: 1979, label: 'THE FIRST CELLULAR PHONE NETWORK', sub: 'JAPAN, 1979', format: (v) => String(Math.round(v)) });

export const S5 = phoneCU({ mode: 'map', battery: 99, Bg: DUSK, from: 'left' });

/** The rooftop: you at the parapet, the phone held up to the sky, turning, searching. */
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: kf(t, [[0, 760], [len, 900]]), y: 640, yaw: 0.1 + Math.sin(t / 12) * 0.3, expr: 'worried', armR: { a: 168, b: 4 }, armL: { a: 20, b: -10 }, look: -0.4, headTilt: -10, blink: idleBlink(t, 5) };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Rooftop t={t + 2000} sunY={820} low={0} />
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={me} t={t} battery={99} s={0.16} glow={1.4} />
    </g>
  );
};

/** A pigeon on the parapet, head cocked, judging you. */
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const cock = Math.floor(t / 12) % 2 ? 12 : -8;
  return (
    <g transform={camT(960, 640, kf(t, [[0, 2.6], [len, 2.8]]))}>
      <Rooftop t={t + 2100} sunY={820} />
      <g transform="translate(980 760)">
        <ellipse cx={0} cy={30} rx={70} ry={10} fill="#000" opacity={0.3} />
        <path d="M -60 0 Q -40 -50 10 -46 Q 50 -40 60 -10 Q 40 20 -10 22 Q -50 22 -60 0 Z" fill="#7A8090" stroke="#1A1620" strokeWidth={4} />
        <path d="M -60 0 L -95 -6 L -90 12 Z" fill="#5A6070" stroke="#1A1620" strokeWidth={4} />
        <path d="M -20 -20 Q 10 -34 34 -18" stroke="#5A6070" strokeWidth={10} fill="none" strokeLinecap="round" />
        <g transform={`translate(44 -52) rotate(${cock})`}>
          <circle r={24} fill="#6A7080" stroke="#1A1620" strokeWidth={4} />
          <path d="M -10 16 Q 0 30 14 18" stroke="#7FB08A" strokeWidth={8} fill="none" />
          <circle cx={8} cy={-4} r={6} fill="#F0A040" stroke="#1A1620" strokeWidth={2} />
          <circle cx={9} cy={-4} r={2.5} fill="#100E16" />
          <path d="M 22 0 L 38 4 L 22 8 Z" fill="#3A3438" />
        </g>
        <path d="M -14 22 L -18 34 M 10 22 L 8 34" stroke="#E07A5A" strokeWidth={5} />
      </g>
    </g>
  );
};

export const S8 = phoneCU({ mode: 'camera', battery: 99, Bg: NIGHT });
export const S9 = phoneCU({ mode: 'flash', battery: 99, Bg: NIGHT, from: 'left' });
export const S10 = phoneCU({ mode: 'calc', battery: 98, Bg: NIGHT });
export const S11 = phoneCU({ mode: 'photos', battery: 98, Bg: NIGHT, from: 'left', push: 0.08 });

/** Night, the boarding-house bed: you lying awake, scrolling, your face lit by the screen. */
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const face = faceAt(t, [[0, 'neutral'], [40, 'tired']]);
  const me: Pose = { ...basePose, x: 960, y: 700, yaw: 0.35, ...face, blink: Math.max(face.blink, idleBlink(t, 7)), look: 0.6, armR: { a: 120, b: -100 }, headTilt: 6 };
  return (
    <g>
      <g filter="url(#blur10)">
        <g transform={camT(960, 520, 1.8)}>
          <Bedroom t={t + 300} id="c2b" lamp={0} />
        </g>
      </g>
      <rect width={1920} height={1080} fill="#06081A" opacity={0.55} />
      <g transform={camT(960, 520, kf(t, [[0, 3.0], [len, 3.25]]))}>
        <Glow x={1040} y={500} r={260} kind="cool" o={0.7} />
        <Hero look={YOU} pose={me} rimId="rimBlue" shadow={0} />
        <HeldPhone pose={me} mode="photos" t={t} battery={97} s={0.16} glow={1.5} rot={-20} />
      </g>
    </g>
  );
};

export const S13 = phoneCU({ mode: 'battery', battery: 100, bgColor: '#120C18', push: 0.12, batteryAt: [[0, 100], [60, 100], [90, 99]] });

/** Night street: you with the charger's plug, looking up and down for a socket that isn't there. */
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const look = Math.sin(t / 14);
  const me: Pose = { ...basePose, x: kf(t, [[0, 820], [len, 1080]]), y: HIP, yaw: look * 0.6, look, expr: 'worried', armL: { a: 70, b: -40 }, armR: { a: 20, b: -10 }, blink: idleBlink(t, 8) };
  const hl = handAt(me, 'L');
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1.4], [len, 1.5]]))}>
      <Street26 t={t + 1600} id="c2s14" night cars={false} />
      <Hero look={YOU} pose={me} />
      <rect x={hl.x - 12} y={hl.y - 24} width={24} height={28} rx={4} fill="#F6EFE3" stroke="#100E16" strokeWidth={3} />
      <path d={`M ${hl.x - 6} ${hl.y - 24} v -12 M ${hl.x + 6} ${hl.y - 24} v -12`} stroke="#C9C2B0" strokeWidth={4} />
      <text x={hl.x + 20} y={hl.y - 60} fontFamily="Bricolage Grotesque" fontWeight={800} fontSize={60} fill="#FFE27A" opacity={backOut(clamp((t - 20) / 8))} stroke="#100E16" strokeWidth={6} paintOrder="stroke">?</text>
        </g>
  );
};

export const S15 = phoneCU({ mode: 'music', battery: 98, Bg: NIGHT, from: 'left', push: 0.1 });

const Roof: React.FC<{ t: number; id?: string }> = ({ t }) => <Rooftop t={t + 2000} sunY={820} />;
/** Close on you at the parapet: the search is over, you lower the phone and decide. */
export const S16 = faceCU({ look: YOU, Bg: Roof, faces: [[0, 'worried'], [30, 'neutral']], yaw: 0.25 });
