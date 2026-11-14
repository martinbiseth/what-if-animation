import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, chapterCard, factCard, Street26, ShotProps, talkShot, idleBlink, Glow, faceAt,
  Bedroom, Kitchen, JazzClub, clubStand, Newspaper, FONT, Smartphone, SmartphoneBack, Look, Expr,
} from '../../../engine';
import { L, YOU, StreetSet, crowd, phoneCU, faceCU, Soft, span, HeldPhone, handAt } from '../common';
import words from './words.json';

// Chapter 3, the fun part: the jazz club, Mo and the talking pictures, "It's Tuesday", the lightning box, racing the
// human computers, the banker's voice, the boarding house and Ellie's star. Battery 96 to 62.

const DUSK = StreetSet();
const NIGHT = StreetSet({ night: true, cars: false });
const Club: React.FC<{ t: number; id?: string }> = ({ t, id }) => <JazzClub t={t} id={id} />;
const ClubQuiet: React.FC<{ t: number; id?: string }> = ({ t, id }) => <JazzClub t={t} id={id} play={0} />;
const Home: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} />;
const Room: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} lamp={0} duvet clock="" />;

/** One person in the club, placed on the floor with the room's perspective. */
const clubber = (look: Look, u: number, w: number, o: Partial<Pose> & { t: number; seed: number; dance?: number; expr?: Expr }) => {
  const p = clubStand(u, w);
  const b = (o.dance ?? 0) * Math.abs(Math.sin((o.t + o.seed * 7) / 5));
  const { t, seed, dance, ...rest } = o;
  return (
    <Hero key={`${u}-${w}`} look={look} pose={{ ...basePose, x: p.x, y: p.y - b * 14 * p.scale, scale: p.scale, armL: { a: 30 + b * 90, b: -40 }, armR: { a: 30 + b * 70, b: -50 }, blink: idleBlink(t, seed), ...rest }} />
  );
};

const notes = (t: number, x: number, y: number, n = 3) =>
  Array.from({ length: n }).map((_, k) => {
    const d = (t * 3 + k * 47) % 160;
    return (
      <text key={k} x={x + k * 60 + Math.sin(t / 6 + k) * 24} y={y - d} fontFamily={FONT.title} fontSize={56} fill="#FFE27A" stroke="#100E16" strokeWidth={4} paintOrder="stroke" opacity={1 - d / 160}>
        {k % 2 ? '♫' : '♪'}
      </text>
    );
  });

export const S1 = chapterCard({ kicker: 'CHAPTER 3', title: 'THE FUN PART' });

/** Wide, the club: you walk in on the dance floor and hold the phone up, playing. */
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const p = clubStand(kf(t, [[0, 0.4], [40, 0.5]], easeOut), 0.7);
  const me: Pose = { ...basePose, x: p.x, y: p.y, scale: p.scale, yaw: 0.1, expr: 'smug', armR: { a: kf(t, [[0, 30], [30, 150]], easeOut), b: 10 }, blink: idleBlink(t, 2) };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <Club t={t + 100} id="c3s2" />
      {clubber(L.lady, 0.22, 0.6, { t, seed: 1, yaw: 0.4, expr: t > 40 ? 'shock' : 'neutral' })}
      {clubber(L.gent, 0.78, 0.62, { t, seed: 2, yaw: -0.4, expr: t > 46 ? 'shock' : 'neutral' })}
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={me} mode="music" t={t} battery={96} />
      {t > 30 ? notes(t, p.x + 40, p.y - 200 * p.scale) : null}
    </g>
  );
};

export const S3 = phoneCU({ mode: 'music', battery: 96, Bg: Club, push: 0.1 });

/** The band freezes mid-note, all four silhouettes stop, the trumpet comes down. */
export const S4 = talkShot({
  Set: ClubQuiet, setT: 200,
  cast: [],
  cam: { from: [960, 380, 1.6], to: [960, 380, 1.75] },
  front: (t) => (
    <text x={960} y={250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFE27A" stroke="#100E16" strokeWidth={8} paintOrder="stroke" opacity={backOut(clamp((t - 10) / 8))}>
      ?!
    </text>
  ),
});

/** By midnight: the whole room dancing, the band back on, you in the middle. */
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const people: [Look, number, number][] = [
    [L.lady, 0.18, 0.5], [L.gent, 0.32, 0.62], [L.worker, 0.68, 0.6], [L.mom26, 0.84, 0.5], [L.doctor, 0.1, 0.7], [L.lady, 0.9, 0.7], [L.gent, 0.36, 0.48], [L.worker, 0.64, 0.46],
  ];
  const p = clubStand(0.5, 0.74);
  const b = Math.abs(Math.sin(t / 5));
  const me: Pose = { ...basePose, x: p.x, y: p.y - b * 12, scale: p.scale, expr: 'happy', armR: { a: 150, b: 10 }, armL: { a: 40 + b * 60, b: -30 }, blink: idleBlink(t, 3) };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.08], [len, 1.0]]))}>
      <Club t={t + 400} id="c3s5" />
      {people.map(([lk, u, w], i) => clubber(lk, u, w, { t, seed: i + 4, dance: 1, expr: 'happy', yaw: (0.5 - u) * 1.2 }))}
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={me} mode="music" t={t} battery={93} />
      {notes(t, 820, 300, 4)}
    </g>
  );
};

/** The bandleader offers to buy the song; you shake your head. */
export const S6 = talkShot({
  Set: Club, setT: 700, words,
  cast: [
    { look: L.gent, x: 820, y: 640, yaw: 0.5, faces: [[0, 'happy']], talk: [span(words, 'bandleader', 'song')], seed: 7, pose: { armR: { a: 70, b: -30 } } },
    { look: YOU, x: 1120, y: 640, yaw: -0.5, faces: [[0, 'neutral'], [40, 'smug']], talk: [span(words, 'You', 'sell')], seed: 8 },
  ],
  cam: { from: [970, 420, 1.9], to: [970, 420, 2.05] },
});

/** The street by day: you walk, and a kid in a cap ducks behind a lamp post every time you look back. */
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const HIP = 640;
  const back = Math.floor(t / 24) % 2 === 1;
  const me: Pose = { ...basePose, x: kf(t, [[0, 1000], [len, 1200]]), y: HIP, yaw: back ? -0.7 : 0.6, look: back ? -1 : 0.4, expr: back ? 'worried' : 'neutral', blink: idleBlink(t, 4), legL: { a: Math.sin(t / 4) * 14, b: 0 }, legR: { a: -Math.sin(t / 4) * 14, b: 0 } };
  const mo: Pose = { ...basePose, x: kf(t, [[0, 520], [len, 720]]), y: HIP + 40 * 0.15, scale: 0.85, yaw: 0.6, look: 0.8, expr: back ? 'oops' : 'happy', squash: back ? 0.12 : 0, blink: idleBlink(t, 5) };
  return (
    <g transform={camT(900, 540, kf(t, [[0, 1.45], [len, 1.5]]))}>
      <Street26 t={t + 300} id="c3s7" cars={false} />
      <Hero look={L.mo26} pose={mo} />
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={me} t={t} battery={92} />
    </g>
  );
};

export const S8 = phoneCU({ mode: 'video', battery: 91, Bg: DUSK, from: 'left', push: 0.08 });

/** Mo's face, lit by the screen, eyes wide, not blinking. */
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = { ...basePose, x: 960, y: 700, yaw: 0.25, look: -0.3, expr: 'shock', blink: 0, glint: 1, headTilt: Math.sin(t / 30) * 2 };
  return (
    <g>
      <Soft blur={16} dim={0.3}>
        <g transform={camT(960, 520, 1.6)}>
          <Street26 t={t + 320} id="c3s9" cars={false} />
        </g>
      </Soft>
      <g transform={camT(960, 540, kf(t, [[0, 3.3], [len, 3.7]]))}>
        <Hero look={L.mo26} pose={pose} shadow={0} />
        <Glow x={880} y={560} r={200} kind="cool" o={0.6} />
      </g>
    </g>
  );
};

export const S10 = factCard({ value: 1927, label: 'THE FIRST FEATURE FILM WITH SPOKEN SCENES', sub: 'OCTOBER 6, 1927', format: (v) => String(Math.round(v)) });

export const S11 = phoneCU({ mode: 'city', battery: 89, Bg: NIGHT, push: 0.1 });

/** Mo whispers "Is that heaven?"; you answer "No. It's Tuesday." */
export const S12 = talkShot({
  Set: NIGHT, setT: 500, words,
  cast: [
    { look: L.mo26, x: 840, y: 700, scale: 0.85, yaw: 0.5, faces: [[0, 'shock']], talk: [span(words, 'Is', 'heaven')], seed: 9 },
    { look: YOU, x: 1100, y: 640, yaw: -0.4, faces: [[0, 'neutral'], [50, 'smug']], talk: [span(words, 'No', 'Tuesday')], seed: 10 },
  ],
  cam: { from: [970, 440, 2.0], to: [970, 440, 2.15] },
  front: () => <Glow x={960} y={520} r={260} kind="cool" o={0.4} />,
});

/** A selfie with strangers: your arm out, the crowd squeezing in behind you, then the flash. */
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const fl = t >= 30 && t < 36 ? 1 - (t - 30) / 6 : 0;
  const people = crowd(6, 640, 1300, 11, { expr: 'happy', faceTo: 960 });
  const me: Pose = { ...basePose, x: 960, y: 690, scale: 1.05, yaw: 0, expr: 'happy', armR: { a: 110, b: 0 }, blink: idleBlink(t, 6) };
  return (
    <g>
      <g transform={camT(960, 500, kf(t, [[0, 1.7], [len, 1.8]]))}>
        <Street26 t={t + 1000} id="c3s13" cars={false} />
        {people.map((c, i) => (
          <Hero key={i} look={c.look} pose={{ ...basePose, x: c.x, y: 640 - (i % 2) * 20, scale: 0.95, yaw: c.yaw ?? 0, expr: t > 36 ? 'shock' : 'happy', armL: { a: 40, b: -60 }, blink: idleBlink(t, i + 20) }} />
        ))}
        <Hero look={YOU} pose={me} />
        <SmartphoneBack x={handAt(me).x} y={handAt(me).y - 30} s={0.16} rot={-8} flash={fl} />
      </g>
      {fl > 0 ? <rect width={1920} height={1080} fill="#FFFFFF" opacity={fl * 0.9} /> : null}
    </g>
  );
};

/** The next morning's paper: a drawing of you and your box shooting lightning. */
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A1E1A" />
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.12]])}) translate(-960 -540)`}>
      <Newspaper x={960} y={560} w={720} rot={2} date="WEDNESDAY, OCTOBER 20, 1926" headline="THE BOY WITH THE LIGHTNING BOX"
        drawing={
          <g stroke="#2A2420" strokeWidth={5} fill="none" strokeLinecap="round">
            <circle cx={0} cy={-40} r={34} />
            <path d="M 0 -6 L 0 70 M 0 10 L 60 -20 M 0 10 L -40 40 M 0 70 L -24 120 M 0 70 L 24 120" />
            <rect x={56} y={-50} width={24} height={40} rx={4} />
            <path d="M 90 -40 L 130 -70 L 120 -44 L 160 -66 M 88 -24 L 140 -20" />
          </g>
        } />
    </g>
  </g>
);

/** 1926: a room of human computers at their desks, pencils going. */
const Computers: React.FC<{ t: number; done?: boolean }> = ({ t, done = false }) => {
  const looks = [L.lady, L.gent, L.lady, L.worker, L.lady, L.doctor, L.mom26, L.lady, L.gent, L.lady];
  return (
    <g>
      <rect width={1920} height={1080} fill="#3A3440" />
      <rect y={0} width={1920} height={520} fill="#4A4250" />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={200 + k * 420} y={120} width={200} height={260} fill="#9FB6C8" opacity={0.5} stroke="#2A2430" strokeWidth={10} />
      ))}
      <rect y={520} width={1920} height={560} fill="#2E2A30" />
      {[0, 1].map((row) =>
        Array.from({ length: 5 }).map((_, i) => {
          const k = row * 5 + i;
          const x = 260 + i * 350 + row * 60;
          const y = 600 + row * 180;
          const s = 0.7 + row * 0.15;
          const w = Math.sin((t + k * 5) / 2) * 6;
          const me: Pose = { ...basePose, x, y: y - 40 * s, scale: s, yaw: 0.2, look: 0.6, headTilt: 14, expr: done ? 'shock' : 'tired', armR: { a: 60 + w, b: -60 }, blink: idleBlink(t, k + 30) };
          return (
            <g key={k}>
              <Hero look={looks[k]} pose={me} shadow={0} />
              <rect x={x - 150 * s} y={me.y - 30 * s} width={300 * s} height={250 * s} fill="#5A3E2C" stroke="#1A1218" strokeWidth={4} />
              <rect x={x - 160 * s} y={me.y - 44 * s} width={320 * s} height={20 * s} fill="#7A5A40" stroke="#1A1218" strokeWidth={4} />
              <rect x={x - 50 * s} y={me.y - 52 * s} width={100 * s} height={10 * s} fill="#F6EFE3" transform={`rotate(-4 ${x} ${me.y})`} />
            </g>
          );
        }),
      )}
    </g>
  );
};

export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Computers t={t} />
    <text x={960} y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#F6EFE3" stroke="#100E16" strokeWidth={8} paintOrder="stroke" opacity={clamp((t - 6) / 8)}>
      "COMPUTERS"
    </text>
  </g>
);

export const S16 = phoneCU({ mode: 'calc', battery: 84, bgColor: '#2E2A30', push: 0.12, buzz: (t) => (Math.sin(t) > 0.6 ? 1 : 0) });

/** Before lunch: the computers look up, pencils frozen, and you lean back smug. */
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 1680, y: 620, yaw: -0.5, expr: 'smug', armR: { a: 150, b: 20 }, headTilt: -6, blink: idleBlink(t, 12) };
  return (
    <g transform={camT(1200, 560, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Computers t={0} done />
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={me} mode="calc" t={t} battery={83} />
    </g>
  );
};

export const S18 = phoneCU({ mode: 'record', battery: 80, Bg: DUSK, push: 0.08 });

/** The banker hears his own voice: astonished, then delighted, pulling out a twenty. */
export const S19 = faceCU({
  look: L.doctor, Bg: DUSK, faces: [[0, 'shock'], [30, 'happy']], yaw: -0.3, zoom: [2.6, 2.8],
  extra: (t) => (
    <g opacity={clamp((t - 36) / 6)} transform={`translate(1120 ${kf(t, [[36, 760], [50, 680]], easeOut)}) rotate(-12)`}>
      <rect x={-70} y={-34} width={140} height={68} rx={4} fill="#9CC59A" stroke="#1A2A1A" strokeWidth={4} />
      <text x={0} y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#1A3A1A">$20</text>
    </g>
  ),
});

/** The boarding house kitchen: Mo's mom hands you a key. */
export const S20 = talkShot({
  Set: Home, setT: 100,
  cast: [
    { look: L.mom26, x: 820, y: 640, yaw: 0.5, faces: [[0, 'happy']], seed: 13, pose: { armR: { a: 80, b: -20 } } },
    { look: L.mo26, x: 1000, y: 680, scale: 0.85, yaw: 0, faces: [[0, 'happy']], seed: 14 },
    { look: YOU, x: 1180, y: 640, yaw: -0.5, faces: [[0, 'happy']], seed: 15 },
  ],
  cam: { from: [1000, 450, 1.6], to: [1000, 450, 1.7] },
});

/** Night, the little bedroom: Ellie under the covers, you shine the flashlight on the ceiling, a star. */
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const ellie: Pose = { ...basePose, x: 820, y: 700, scale: 0.8, yaw: 0.4, look: 0.8, headTilt: -20, expr: 'happy', blink: idleBlink(t, 16) };
  const me: Pose = { ...basePose, x: 1140, y: 640, yaw: -0.4, look: 0.2, headTilt: -10, expr: 'happy', armR: { a: 160, b: 10 }, blink: idleBlink(t, 17) };
  const h = handAt(me);
  return (
    <g>
      <g transform={camT(980, 470, kf(t, [[0, 1.5], [len, 1.6]]))}>
        <Room t={t + 50} id="c3s21" />
        <rect x={-400} y={-400} width={2800} height={1900} fill="#06081A" opacity={0.45} />
        <path d={`M ${h.x} ${h.y - 50} L ${880} ${180} L ${1080} ${180} Z`} fill="#FFF3C0" opacity={0.18} />
        <g transform={`translate(980 200) scale(${1 + Math.sin(t / 8) * 0.06})`}>
          <circle r={110} fill="#FFF3C0" opacity={0.25} />
          <path d="M 0 -60 L 16 -18 L 60 -18 L 24 8 L 38 52 L 0 26 L -38 52 L -24 8 L -60 -18 L -16 -18 Z" fill="#FFE27A" />
        </g>
        <Hero look={L.ellie} pose={ellie} rimId="rimBlue" />
        <Hero look={YOU} pose={me} rimId="rimBlue" />
        <Smartphone x={h.x} y={h.y - 30} s={0.13} rot={0} mode="flash" t={t} battery={70} glow={1.6} status={false} />
      </g>
    </g>
  );
};

/** Ellie close: "Make the star again." */
export const S22 = faceCU({ look: L.ellie, Bg: Room, faces: [[0, 'happy']], yaw: 0.3, talk: span(words, 'Make', 'again'), words, zoom: [3.0, 3.25] });

/** The corner of the screen: sixty-two percent. */
export const S23 = phoneCU({ mode: 'battery', battery: 62, bgColor: '#120C18', push: 0.14, batteryAt: [[0, 64], [30, 62]] });
