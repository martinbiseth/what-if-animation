import React from 'react';
import { Hero, factCard } from '../../../engine';
import {
  YOU_GOWN, ELLIE_PJ, SUIT, TECH, Soft, Body, Bedroom, BEDROOM, stand, Schematic, SCH, SchLabel, standAt, PopWord, Big, faceCU, bigWord,
  hourCard, Clinic, CLINIC, Wires, Teddy, Bubble, Rat, handAt, headAt, Glow, basePose, camT, clamp, kf, backOut, easeOut, easeInOut,
  idleBlink, FONT, UI, rnd, phrase, ShotProps, Pose, Word, schShot,
} from '../common';
import words from './words.json';

// Chapter 6, the choice: day 10 in the white room (camera, tests every hour); falling apart (shaking hands, words in
// the wrong order, <6 h sleepers 4x the colds, you have three, a sneeze gets written down); the rat slide (1980s,
// 2-4 weeks); "Your record falls on day eleven. Day twenty-one is the real question."; Ellie's video call and the
// hallway light; behind her your bed; you decide: no record, home; wires off, past the camera: "Can someone please
// turn off the lights?"; the suit writes in his folder and smiles.

const W = words as Word[];
const rel = (a: string, b: string) => Math.max(0, Math.round((phrase(W, b)[0] - phrase(W, a)[0]) * 30));
const CLN: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Clinic t={t} id={id} day={1} />;
const ROOMS: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} clock="20:30" crossed={10} lamp={1} veil={0.4} />;

export const S1 = hourCard({ big: 'DAY 10', kicker: 'THE WHITE ROOM', Bg: CLN });

// ---------------------------------------------------------------- S2: the white room: a window, a bed you never use, the camera
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const me = stand(CLINIC, 0.3, 0.55);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 540, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <CLN t={t + 100} />
      <Body look={YOU_GOWN} pose={{ ...basePose, ...me, yaw: -0.4, look: -0.5, armL: { a: 10, b: -8 }, armR: { a: 10, b: -8 } }} t={t} faces={[[0, 'tired']]} seed={2} shadow={1} />
      <PopWord t={t} at={rel('Day ten', 'camera')} x={1500} y={300} text="REC ●" size={50} fill="#FF3A2E" hold={300} rot={0} />
      <PopWord t={t} at={rel('Day ten', 'test you')} x={700} y={300} text="TEST #241" size={50} fill="#F6EFE3" hold={300} />
    </g>
  );
};

// ---------------------------------------------------------------- S3: your hands shake
export const S3: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Soft blur={16} dim={0.3}>
      <g transform={camT(960, 520, 1.6)}>
        <CLN t={t + 200} />
      </g>
    </Soft>
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`translate(${960 + sd * 260 + Math.sin(t * 2.3 + sd) * 8} ${620 + Math.cos(t * 2.9 + sd) * 6}) rotate(${sd * 12})`}>
        <rect x={-70} y={60} width={140} height={500} fill="#9AC0D0" stroke="#14121C" strokeWidth={8} />
        <ellipse cx={0} cy={0} rx={110} ry={130} fill="#26232F" stroke="#14121C" strokeWidth={8} />
        <ellipse cx={sd * -100} cy={-20} rx={40} ry={70} fill="#26232F" stroke="#14121C" strokeWidth={8} transform={`rotate(${sd * -30} ${sd * -100} -20)`} />
      </g>
    ))}
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M ${520 + i * 300} ${300 + (i % 2) * 40} q 20 -20 40 0 q 20 20 40 0`} stroke="#F6EFE3" strokeWidth={5} fill="none" opacity={0.6} />)}
  </g>
);

// ---------------------------------------------------------------- S4: your words come out in the wrong order
export const S4 = faceCU({
  look: YOU_GOWN, Bg: CLN, faces: [[0, 'tired']], yaw: 0.3, zoom: [3.0, 3.2], words: W, talk: phrase(W, 'Your words come out in the wrong order'),
  extra: (t) => <Bubble x={1180} y={420} text={'order wrong\nin the words...'} t={t} at={6} size={40} />,
});

// ---------------------------------------------------------------- S5: under 6 hours: about 4x more likely to catch a cold
export const S5 = factCard({ value: 4.2, format: (v) => `${v.toFixed(1)}x`, label: 'SLEEP UNDER 6 HOURS: CATCHING A COLD', sub: 'Prather et al., Sleep, 2015' });

// ---------------------------------------------------------------- S6: three colds; you sneeze; the scientist writes it down
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const me = stand(CLINIC, 0.4, 0.6);
  const sn = rel('You have three colds', 'You sneeze');
  const ach = t > sn ? clamp(1 - (t - sn) / 10) : 0;
  return (
    <g transform={camT(1000, 560, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <CLN t={t + 300} />
      {/* the window into the observation room, the scientist writing */}
      <g transform="translate(1230 460)">
        <rect x={-150} y={-120} width={300} height={200} fill="#2A3440" stroke="#5E6A74" strokeWidth={8} />
        <Hero look={TECH} pose={{ ...basePose, x: 0, y: 80, scale: 0.55, yaw: -0.3, armR: { a: 60, b: -90 + Math.sin(t) * 10 }, expr: 'neutral', blink: idleBlink(t, 5) }} shadow={0} />
        <rect x={-150} y={-120} width={300} height={200} fill="#9AC0D0" opacity={0.18} />
      </g>
      <Body look={YOU_GOWN} pose={{ ...basePose, ...me, yaw: 0.3, tilt: -10 * ach, headTilt: 10 * ach, armL: { a: 40 + 60 * ach, b: -100 }, armR: { a: 20, b: -10 } }} t={t} faces={[[0, 'tired'], [Math.max(1, sn - 4), 'oops']]} seed={2} shadow={1} />
      <PopWord t={t} at={sn} x={me.x - 120} y={me.y - 330} text="ACHOO!" size={70} fill="#F6EFE3" hold={60} />
      {[0, 1, 2].map((i) => <PopWord key={i} t={t} at={4 + i * 8} x={560 + i * 170} y={300} text={`COLD ${i + 1}`} size={40} fill="#9AD0E0" hold={sn} />)}
    </g>
  );
};

// ---------------------------------------------------------------- S7: the rat slide: 1980s, kept awake, 2-4 weeks
export const S7 = schShot({
  title: '1980s: RATS KEPT AWAKE AROUND THE CLOCK',
  real: 90,
  draw: (t) => (
    <g>
      {Array.from({ length: 8 }).map((_, i) => {
        const gone = clamp((t - 40 - i * 5) / 10);
        return <Rat key={i} x={420 + (i % 4) * 360} y={430 + Math.floor(i / 4) * 230} s={1.2} o={1 - 0.75 * gone} color={gone > 0.5 ? '#FF5A4A' : SCH.line} />;
      })}
      <g transform={`translate(960 880) scale(${backOut(clamp((t - 30) / 9))})`}>
        <Big x={0} y={30} size={90} fill="#FF5A4A">2 TO 4 WEEKS</Big>
      </g>
    </g>
  ),
});

// ---------------------------------------------------------------- S8: "Your record falls on day eleven. Day twenty-one is the real question."
export const S8 = faceCU({
  look: SUIT, Bg: CLN, faces: [[0, 'neutral'], [50, 'smug']], yaw: -0.3, zoom: [3.1, 3.5], words: W, talk: [phrase(W, 'Your record falls on day eleven')[0], phrase(W, 'Day twenty-one is the real question')[1]],
  light: { x: 800, y: 400, kind: 'red', o: 0.3 },
  extra: (t) => <PopWord t={t} at={rel('Your record falls', 'Day twenty-one')} x={1300} y={260} text="DAY 21?" size={80} fill="#FF5A4A" hold={300} />,
});

/** Ellie on a video call: her bedroom behind her, drawn into a landscape phone. */
const VideoCall: React.FC<{ t: number; f: number; z: number; behind?: number }> = ({ t, f, z, behind = 0 }) => {
  const e: Pose = { ...basePose, x: 760 - 500 * behind, y: 980, scale: 2.4, yaw: 0.2, armL: { a: 40, b: -80 }, armR: { a: 20, b: -20 } };
  return (
    <g transform={`translate(960 540) scale(${z}) translate(-960 -540)`}>
      <rect x={430} y={230} width={1060} height={620} rx={60} fill="#1A1922" stroke="#4A4858" strokeWidth={8} />
      <svg x={470} y={262} width={980} height={556} viewBox="0 0 1920 1080">
        <g transform={camT(kf(behind, [[0, 860], [1, 760]]), 520, kf(behind, [[0, 1.5], [1, 1.25]]))}>
          <ROOMS t={t + 400} />
        </g>
        <g opacity={1 - behind * 0.85}>
          <Body look={ELLIE_PJ} pose={e} t={t} faces={[[0, 'happy'], [60, 'worried']]} seed={8} shadow={0} words={W} f={f} talk={[phrase(W, "Mum says you're helping scientists"), phrase(W, 'Are you coming home'), phrase(W, 'I leave the hallway light on'), phrase(W, 'Like you do for me')]} />
          <Teddy x={e.x + 300} y={e.y + 240} s={2} rot={10} />
        </g>
        <text x={80} y={100} fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3">ELLIE · 20:31</text>
        <circle cx={1840} cy={84} r={14} fill="#5AE08A" />
      </svg>
    </g>
  );
};

// ---------------------------------------------------------------- S9: that night, Ellie video calls you
export const S9: React.FC<ShotProps> = ({ t, len, f }) => (
  <g>
    <Soft blur={16} dim={0.5}>
      <g transform={camT(960, 520, 1.4)}>
        <Clinic t={t + 500} />
      </g>
    </Soft>
    <VideoCall t={t} f={f} z={kf(t, [[0, 0.95], [len, 1.12]])} />
  </g>
);

// ---------------------------------------------------------------- S10: behind her: your bedroom, your bed, your pillow
export const S10: React.FC<ShotProps> = ({ t, len, f }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B0816" />
    <VideoCall t={t} f={f} z={kf(t, [[0, 1.15], [len, 1.6]], easeInOut)} behind={easeInOut(clamp(t / 40))} />
  </g>
);

// ---------------------------------------------------------------- S11: and you decide: no record
export const S11 = faceCU({ look: YOU_GOWN, Bg: CLN, faces: [[0, 'tired'], [24, 'cool']], yaw: 0.2, eyes: 0, zoom: [3.3, 3.7], light: { x: 1200, y: 360, kind: 'warm', o: 0.5 },
  extra: (t) => <PopWord t={t} at={rel('And you decide', 'No record')} x={960} y={250} text="NO RECORD." size={90} fill="#FFD23A" hold={300} /> });

// ---------------------------------------------------------------- S12: wires off, past the camera
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 700], [len, 1250]]);
  const off = clamp((t - 6) / 20);
  const me: Pose = standAt(x, 1, 990, { yaw: 0.6, legL: { a: Math.sin(t / 3) * 22, b: 0 }, legR: { a: -Math.sin(t / 3) * 22, b: 0 }, armR: { a: 150 - 120 * off, b: -40 }, armL: { a: 20, b: -10 } });
  return (
    <g transform={camT(1000, 560, 1.25)}>
      <CLN t={t + 600} />
      <Body look={YOU_GOWN} pose={me} t={t} faces={[[0, 'cool']]} seed={2} shadow={1} />
      <Wires pose={me} to={[kf(off, [[0, x + 200], [1, 600]]), kf(off, [[0, 700], [1, 960]])]} o={1 - off} />
      {Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M ${560 + i * 18} 960 q 60 -${20 + i * 6} 120 0`} stroke={['#E8453A', '#4A9AC8', '#E9C46A', '#5AE08A', '#F6EFE3', '#C87ED8', '#F28C6A'][i]} strokeWidth={4} fill="none" opacity={off} />)}
    </g>
  );
};

// ---------------------------------------------------------------- S13: "Can someone please turn off the lights?"
export const S13 = faceCU({
  look: YOU_GOWN, Bg: CLN, faces: [[0, 'neutral'], [40, 'happy']], yaw: -0.3, zoom: [3.0, 3.2], words: W, talk: phrase(W, 'Can someone please turn off the lights'),
  extra: (t) => <Bubble x={640} y={300} text={'Can someone please\nturn off the lights?'} t={t} at={rel('ask for the one thing', 'Can someone please')} size={38} tail="r" />,
});

// ---------------------------------------------------------------- S14: the suit doesn't stop you; writes in his folder, and smiles
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(CLINIC, 0.7, 0.55);
  const me: Pose = { ...basePose, ...s, yaw: -0.3, armL: { a: 50, b: -90 }, armR: { a: 40 + Math.sin(t) * 6, b: -100 } };
  const h = handAt(me, 'L');
  return (
    <g transform={camT(s.x - 60, 520, kf(t, [[0, 2.0], [len, 2.4]]))}>
      <CLN t={t + 700} />
      <Body look={SUIT} pose={me} t={t} faces={[[0, 'neutral'], [Math.max(1, len - 45), 'smug']]} seed={9} shadow={1} />
      <g transform={`translate(${h.x + 10} ${h.y - 10}) rotate(-10)`}>
        <rect x={-60} y={-80} width={120} height={160} fill="#C8A06A" stroke="#14121C" strokeWidth={4} />
        <rect x={-50} y={-70} width={100} height={140} fill="#F6EFE3" />
        {Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M -40 ${-50 + i * 24} L ${-40 + 80 * clamp((t - i * 8) / 8)} ${-50 + i * 24}`} stroke="#2A2230" strokeWidth={4} />)}
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S9B: closer: "I leave the hallway light on for you every night."
export const S9B: React.FC<ShotProps> = ({ t, len, f }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B0816" />
    <g transform={`translate(${kf(t, [[0, 200], [len, 240]])} 0)`}>
      <VideoCall t={t} f={f} z={kf(t, [[0, 1.55], [len, 1.7]])} />
    </g>
  </g>
);
