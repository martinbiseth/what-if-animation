import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, camT, clamp, easeOut, easeIn, backOut, rnd, settle, shake, Smartphone, SmartphoneBack, Newspaper,
  Street26, street26Hip, STREET, Rooftop, TitleCard, Glow, Foreground, OldCar, ShotProps, talkShot, idleBlink, FONT, DizzyStars,
} from '../../../engine';
import { L, YOU, StreetSet, crowd, phoneCU, faceCU, Soft, bigWord, span, HeldPhone } from '../common';
import words from './words.json';

// Chapter 1, the cold open: you wake up on a 1926 street with your phone; three quick demos (a photo, a song, a cat
// video for a policeman), the date on a newspaper, the title, the turn. 24+ cuts a minute.

const DUSK = StreetSet();
const HIP = street26Hip(1);

// ---------- S1: high angle, you lying on the cobbles, eyes opening; the phone glowing in your hand ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const face = faceAt(t, [[0, 'tired'], [26, 'neutral'], [40, 'shock']]);
  const pose: Pose = { ...basePose, x: 960, y: 900, scale: 1.1, spin: -90, yaw: 0, armR: { a: 70, b: -30 }, armL: { a: 20, b: 0 }, legL: { a: 6, b: 0 }, legR: { a: -4, b: 0 }, ...face, blink: t < 24 ? 1 : face.blink, look: t > 40 ? -0.8 : 0 };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 930]]), kf(t, [[0, 860], [len, 840]]), kf(t, [[0, 1.9], [len, 1.7]]))}>
      <Street26 t={t + 20} id="s1" cars={false} />
      <rect x={-400} y={STREET.kerb} width={2800} height={900} fill="#000" opacity={0.15} />
      <Hero look={YOU} pose={pose} shadow={0} />
      <Smartphone x={1040} y={760} s={0.16} rot={-70} mode="home" t={t} battery={100} glow={0.9} status={false} />
    </g>
  );
};

// ---------- S2: wide, the street: a car rattles past, hats everywhere, smoke from a chimney ----------
export const S2 = talkShot({
  Set: StreetSet({ cars: true }), setT: 900,
  cast: crowd(7, 120, 1800, 2, { expr: 'neutral', faceTo: 960 }).map((c, i) => ({ ...c, faces: [[0, 'neutral'], [18 + i * 3, 'shock']] })),
  cam: { from: [960, 520, 1.0], to: [980, 520, 1.06] },
  front: (t) => <OldCar x={kf(t, [[0, -300], [80, 2300]], (k) => k)} y={STREET.kerb + 190} s={1.1} wheel={t * 8} />,
});

// ---------- S3: medium, three faces staring at the glow (the light on their faces) ----------
export const S3 = talkShot({
  Set: DUSK, setT: 400,
  cast: [
    { look: L.gent, x: 760, y: HIP, yaw: 0.45, faces: [[0, 'shock']], seed: 1 },
    { look: L.lady, x: 960, y: HIP, yaw: 0.1, faces: [[0, 'neutral'], [8, 'shock']], seed: 2 },
    { look: L.worker, x: 1170, y: HIP, yaw: -0.45, faces: [[0, 'shock']], seed: 3 },
  ],
  cam: { from: [960, 520, 1.8], to: [960, 520, 1.95] },
  front: () => <Glow x={960} y={700} r={420} kind="cool" o={0.45} />,
});

// ---------- S4: insert, the phone glowing in your hand ----------
export const S4 = phoneCU({ mode: 'home', battery: 100, Bg: DUSK, push: 0.1 });

// ---------- S5: from the crowd's side: you lift the phone, the flash goes off ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const fl = t >= 14 && t < 18 ? 1 - (t - 14) / 4 : 0;
  return (
    <g>
      <Soft blur={10} dim={0.2}>
        <g transform={camT(960, 500, 1.3)}>
          <Street26 t={t + 500} id="s5" cars={false} />
        </g>
      </Soft>
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.05]])}) translate(-960 -540)`}>
        <path d="M 1200 1200 Q 1150 900 1080 760 L 940 790 Q 990 950 1000 1200 Z" fill="#F07A2A" stroke="#100E16" strokeWidth={8} />
        <SmartphoneBack x={960} y={kf(t, [[0, 640], [10, 520]], easeOut)} s={1.15} rot={-3} flash={fl} />
        <ellipse cx={1080} cy={kf(t, [[0, 820], [10, 700]], easeOut)} rx={80} ry={100} fill="#26232F" stroke="#100E16" strokeWidth={8} />
      </g>
      {fl > 0 ? <rect width={1920} height={1080} fill="#FFFFFF" opacity={fl * 0.8} /> : null}
    </g>
  );
};

// ---------- S6: insert, the photo on screen, in colour ----------
export const S6 = phoneCU({ mode: 'photo', battery: 99, Bg: DUSK, from: 'left', push: 0.08 });

// ---------- S7: medium, the man in the bowler hat faints backwards ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const fall = easeIn(clamp((t - 14) / 12));
  const pose = poseAt(t, [
    { f: 0, p: { x: 960, y: HIP, yaw: 0.2, armL: { a: 20, b: -20 }, armR: { a: 20, b: -20 }, expr: 'shock' } },
    { f: 8, p: { armL: { a: 60, b: 50 }, armR: { a: 60, b: 50 }, headTilt: -8 }, ease: easeOut },
    { f: 14, p: { armL: { a: 120, b: 10 }, armR: { a: 120, b: 10 }, expr: 'dizzy' } },
  ]);
  const p: Pose = { ...pose, spin: -86 * fall, y: HIP + 60 * fall, x: 960 - 80 * fall, squash: t > 26 && t < 30 ? 0.1 : 0 };
  return (
    <g transform={shake(t, 26, 6, 8) + ' ' + camT(960, 560, kf(t, [[0, 1.9], [len, 1.8]]))}>
      <Street26 t={t + 600} id="s7" cars={false} />
      <Hero look={L.lady} pose={{ ...basePose, x: 1260, y: HIP, yaw: -0.4, expr: t > 20 ? 'shock' : 'neutral', armL: { a: 70, b: 60 }, blink: idleBlink(t, 4) }} />
      <Hero look={L.gent} pose={p} />
      {t > 30 ? <DizzyStars x={820} y={HIP + 50} t={t - 30} rx={70} ry={26} /> : null}
    </g>
  );
};

// ---------- S8: insert, the music app playing ----------
export const S8 = phoneCU({ mode: 'music', battery: 99, Bg: DUSK, push: 0.06 });

// ---------- S9: wide, a crowd forms round you, people stepping in from both sides ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const people = crowd(10, 260, 1660, 7, { expr: 'happy', faceTo: 960, skip: [4, 5] });
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.05], [len, 1.15]]))}>
      <Street26 t={t + 700} id="s9" />
      {people.map((c, i) => {
        const side = c.x < 960 ? -1 : 1;
        const arrive = easeOut(clamp((t - i * 2) / 18));
        const x = c.x + side * 500 * (1 - arrive);
        const bounce = Math.abs(Math.sin((t + i * 5) / 5)) * 6;
        return <Hero key={i} look={c.look} pose={{ ...basePose, x, y: HIP - bounce, scale: c.scale ?? 1, yaw: c.yaw ?? 0, expr: t > 20 ? 'happy' : 'shock', armL: { a: 30 + bounce * 3, b: -40 }, armR: { a: 30 + bounce * 2, b: -40 }, blink: idleBlink(t, i + 2) }} />;
      })}
      {(() => {
        const me: Pose = { ...basePose, x: 960, y: HIP, yaw: 0, expr: 'smug', armR: { a: 130, b: 10 }, headTilt: Math.sin(t / 5) * 4 };
        return (
          <g>
            <Hero look={YOU} pose={me} />
            <HeldPhone pose={me} mode="music" t={t} battery={99} />
          </g>
        );
      })()}
      {[0, 1, 2].map((k) => (
        <text key={k} x={1040 + k * 50 + Math.sin(t / 6 + k) * 20} y={HIP - 160 - ((t * 3 + k * 40) % 140)} fontFamily={FONT.title} fontSize={50} fill="#FFE27A" opacity={1 - ((t * 3 + k * 40) % 140) / 140}>
          ♪
        </text>
      ))}
    </g>
  );
};

// ---------- S10: close-up, the lady in the cloche, delighted ----------
export const S10 = faceCU({ look: L.lady, Bg: DUSK, faces: [[0, 'shock'], [10, 'happy']], yaw: 0.35 });

// ---------- S11: medium, the policeman pushes through: "is it a bomb?" ----------
export const S11 = talkShot({
  Set: DUSK, setT: 800, words,
  cast: [
    { look: L.cop, x: 840, y: HIP, yaw: 0.5, faces: [[0, 'worried']], talk: [span(words, 'policeman', 'bomb')], seed: 5, pose: { armR: { a: 80, b: -10 }, handR: 'point' } },
    { look: YOU, x: 1130, y: HIP, yaw: -0.5, faces: [[0, 'worried']], seed: 6 },
  ],
  cam: { from: [990, 520, 1.85], to: [990, 520, 2.0] },
});

// ---------- S12: insert, the cat video ----------
export const S12 = phoneCU({ mode: 'video', battery: 98, Bg: DUSK, from: 'left', push: 0.05 });

// ---------- S13: medium close, the policeman laughing; his whistle drops ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const shakeX = Math.sin(t * 1.4) * 5;
  const drop = clamp((t - 18) / 14);
  return (
    <g transform={camT(960, 470, kf(t, [[0, 2.4], [len, 2.55]]))}>
      <Street26 t={t + 900} id="s13" cars={false} />
      <Hero look={L.cop} pose={{ ...basePose, x: 960 + shakeX, y: HIP, yaw: 0.2, expr: 'happy', tilt: Math.sin(t * 0.9) * 6, headTilt: -10 + Math.sin(t * 1.2) * 6, armL: { a: 40, b: 90 }, armR: { a: 50, b: 100 }, talk: 0.6 + 0.4 * Math.abs(Math.sin(t * 0.8)) }} />
      <g transform={`translate(${1010 + drop * 30} ${HIP - 110 + easeIn(drop) * 300}) rotate(${drop * 400})`}>
        <rect x={-20} y={-7} width={40} height={14} rx={6} fill="#C9C2B0" stroke="#100E16" strokeWidth={3} />
        <circle cx={22} cy={0} r={10} fill="#C9C2B0" stroke="#100E16" strokeWidth={3} />
      </g>
    </g>
  );
};

// ---------- S14: insert, the newspaper: the date ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2026" />
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.2], [18, 2.0], [len, 2.1]], easeOut)}) translate(-960 -${kf(t, [[0, 520], [18, 330]], easeOut)})`}>
      <Newspaper x={960} y={600} w={760} rot={-2} date="TUESDAY, OCTOBER 12, 1926" headline="MYSTERY LIGHT ON 7TH AVE." />
    </g>
  </g>
);

// ---------- S15: big word, the year ----------
export const S15 = bigWord({ kicker: '100 YEARS AGO', word: '1926', Bg: DUSK });

// ---------- S16: high and wide, the street at night, you alone and glowing ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 560], [len, 520]]), kf(t, [[0, 1.5], [len, 0.95]]))}>
    <Street26 t={t + 1000} id="s16" night cars={false} />
    <Glow x={960} y={HIP} r={360} kind="cool" o={0.55} />
    {(() => {
      const me: Pose = { ...basePose, x: 960, y: HIP, yaw: 0, expr: 'neutral', armR: { a: 40, b: -80 }, look: 0.2, blink: idleBlink(t, 9) };
      return (
        <g>
          <Hero look={YOU} pose={me} />
          <HeldPhone pose={me} t={t} battery={98} glow={1.6} />
        </g>
      );
    })()}
  </g>
);

// ---------- S17: the title over the 1926 rooftop at dusk ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.05]]))}>
      <Rooftop t={t + 300} sunY={700} />
    </g>
    <TitleCard t={t} lines={['WHAT IF YOU HAD AN', 'IPHONE 100 YEARS AGO?']} accent="100" size={96} y={190} />
  </g>
);

// ---------- S18: low angle, you on the roof edge, smug: "you'd be a god" ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 500]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
    <Rooftop t={t + 400} sunY={760} low={140} />
    {(() => {
      const me: Pose = { ...basePose, x: 960, y: 640, scale: 1.2, yaw: 0.25, expr: 'cool', armL: { a: 160, b: 6 }, armR: { a: 20, b: -10 }, headTilt: -6, blink: idleBlink(t, 2) };
      return (
        <g>
          <Hero look={YOU} pose={me} rimId="rimR" />
          <HeldPhone pose={me} side="L" t={t} battery={97} s={0.16} glow={1.8} />
        </g>
      );
    })()}
  </g>
);

// ---------- S19: the turn: the phone alone, the screen glowing red, pushing in ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B0610" />
    <Glow x={960} y={540} r={700} kind="red" o={0.6 + 0.1 * Math.sin(t / 4)} />
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.3]])}) translate(-960 -540)`}>
      <Smartphone x={960} y={540} s={1.2} rot={0} mode="home" t={t} battery={97} glow={0} />
    </g>
  </g>
);

// ---------- S20: the battery screen: 97 percent; the countdown starts ----------
export const S20 = phoneCU({ mode: 'battery', battery: 97, bgColor: '#0B0610', push: 0.15, batteryAt: [[0, 100], [30, 97]] });
