import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, chapterCard, factCard, Street26, street26Hip, ShotProps, talkShot, idleBlink, Glow,
  Kitchen, JazzClub, clubStand, Newspaper, FONT, Schematic, SchLabel, SCH, Look,
} from '../../../engine';
import { L, YOU, StreetSet, phoneCU, faceCU, bigWord, HeldPhone, handAt } from '../common';

// Chapter 4, the catch: no sockets, the DC city, the hotel porter, what you're actually holding (35 trillion ops vs
// ENIAC), the papers call it "the device", the $75 phone call. Battery 62 to 41.

const DUSK = StreetSet();
const NIGHT = StreetSet({ night: true, cars: false });
const HIP = street26Hip(1);
const Home: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} period />;

/** The charger: a white brick with two flat prongs, in your mitten. */
const Charger: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -10 -40 v -34 M 10 -40 v -34" stroke="#C9C2B0" strokeWidth={8} strokeLinecap="round" />
    <rect x={-30} y={-42} width={60} height={64} rx={10} fill="#F6EFE3" stroke="#100E16" strokeWidth={5} />
    <path d="M 0 22 q 4 50 -10 90" stroke="#F6EFE3" strokeWidth={8} fill="none" strokeLinecap="round" />
  </g>
);

/** A 1926 hotel lobby: panelled wall, a clock, a front desk with a brass bell, one socket low on the wall. */
const Lobby: React.FC<{ t: number; socket?: boolean }> = ({ t, socket = true }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#3A2A26" />
    {Array.from({ length: 14 }).map((_, i) => (
      <rect key={i} x={-200 + i * 180} y={140} width={150} height={520} rx={6} fill="#4A3630" stroke="#2A1C18" strokeWidth={6} />
    ))}
    <rect x={-400} y={660} width={2800} height={900} fill="#5A2A2A" />
    {Array.from({ length: 30 }).map((_, i) => (
      <path key={`r${i}`} d={`M ${-400 + i * 100} 660 L ${-1400 + i * 160} 1500`} stroke="#4A2222" strokeWidth={4} />
    ))}
    <circle cx={960} cy={240} r={70} fill="#EDE3CC" stroke="#C9A050" strokeWidth={12} />
    <path d={`M 960 240 L ${960 + Math.sin(t / 60) * 40} ${240 - Math.cos(t / 60) * 40} M 960 240 L 990 260`} stroke="#1E1A14" strokeWidth={6} strokeLinecap="round" />
    {socket ? (
      <g transform="translate(1420 600)">
        <rect x={-22} y={-30} width={44} height={60} rx={6} fill="#C9A050" stroke="#2A1C18" strokeWidth={4} />
        <circle cx={0} cy={-10} r={5} fill="#2A1C18" />
        <circle cx={0} cy={12} r={5} fill="#2A1C18" />
      </g>
    ) : null}
    {[300, 1640].map((x) => (
      <g key={x}>
        <rect x={x - 6} y={300} width={12} height={360} fill="#C9A050" />
        <ellipse cx={x} cy={300} rx={40} ry={20} fill="#FFD38A" />
        <Glow x={x} y={300} r={180} o={0.5} />
      </g>
    ))}
  </g>
);

/** The front desk, drawn in front of whoever stands behind it. */
const Desk: React.FC<{ bell?: boolean }> = ({ bell = true }) => (
  <g>
    <rect x={620} y={660} width={680} height={260} fill="#6A4430" stroke="#2A1C18" strokeWidth={6} />
    <rect x={600} y={640} width={720} height={30} fill="#8A5A3A" stroke="#2A1C18" strokeWidth={6} />
    {Array.from({ length: 4 }).map((_, i) => (
      <rect key={i} x={650 + i * 165} y={690} width={140} height={200} rx={6} fill="#5A3828" stroke="#2A1C18" strokeWidth={4} />
    ))}
    {bell ? (
      <g transform="translate(700 640)">
        <path d="M -24 0 A 24 22 0 0 1 24 0 Z" fill="#E9B85A" stroke="#2A1C18" strokeWidth={4} />
        <rect x={-30} y={-2} width={60} height={6} fill="#C9A050" />
      </g>
    ) : null}
  </g>
);

export const S1 = chapterCard({ kicker: 'CHAPTER 4', title: 'THE CATCH', red: 0.3 });

/** Mo's building: a bare bulb on a cord, you turning with the plug, no socket on any wall. */
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const look = Math.sin(t / 12);
  const me: Pose = { ...basePose, x: 960, y: 640, yaw: look * 0.6, look, expr: 'worried', armL: { a: 70, b: -40 }, blink: idleBlink(t, 3) };
  const h = handAt(me, 'L');
  return (
    <g transform={camT(960, 470, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Home t={t + 900} id="c4s2" />
      <path d="M 960 120 V 300" stroke="#1A1620" strokeWidth={4} />
      <circle cx={960} cy={318} r={20} fill="#FFE8B0" />
      <Glow x={960} y={318} r={240} o={0.6} />
      <Hero look={YOU} pose={me} />
      <Charger x={h.x} y={h.y} s={0.6} />
    </g>
  );
};

/** Insert: the charger in your hand, held up to a wall with nothing in it. */
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#4F5A58" />
    {Array.from({ length: 9 }).map((_, i) => (
      <rect key={i} x={i * 240} y={0} width={4} height={1080} fill="#45504E" />
    ))}
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-960 -540)`}>
      <path d="M 1400 1200 Q 1300 900 1120 700 L 1000 760 Q 1120 950 1180 1200 Z" fill="#F07A2A" stroke="#100E16" strokeWidth={8} />
      <Charger x={kf(t, [[0, 1100], [len, 820]], easeOut)} y={600} s={3.2} rot={-8} />
      <ellipse cx={kf(t, [[0, 1150], [len, 870]], easeOut)} cy={700} rx={110} ry={90} fill="#26232F" stroke="#100E16" strokeWidth={8} />
    </g>
  </g>
);

/** Night: a whole block with dark windows, one lamp. */
export const S4 = talkShot({
  Set: ({ t, id }) => <Street26 t={t} id={id} night lit={0.15} cars={false} />, setT: 2000,
  cast: [{ look: YOU, x: 960, y: HIP, scale: 0.8, yaw: 0, look_: -0.4, faces: [[0, 'worried']], seed: 2 }],
  cam: { from: [960, 420, 1.0], to: [960, 440, 1.08] },
});

export const S5 = factCard({ value: 21, suffix: '%', label: 'OF AMERICAN HOMES HAD NO ELECTRIC LIGHT', sub: 'US CENSUS, 1940' });

/** The hotel lobby: you kneel at the socket and plug in. */
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 1300, y: 760 - 140, yaw: 0.6, look: 0.8, headTilt: 12, expr: t > 40 ? 'worried' : 'happy', armR: { a: 40, b: 20 }, blink: idleBlink(t, 4) };
  return (
    <g transform={camT(1300, 520, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Lobby t={t} />
      <path d="M 1404 610 q -40 30 -90 40" stroke="#F6EFE3" strokeWidth={6} fill="none" />
      <Hero look={YOU} pose={me} />
      <rect x={1396} y={570} width={30} height={34} rx={5} fill="#F6EFE3" stroke="#100E16" strokeWidth={3} />
    </g>
  );
};

export const S7 = phoneCU({ mode: 'battery', battery: 60, bgColor: '#3A2A26', push: 0.06 });

/** The two kinds of electricity: DC's flat line next to AC's wave, and a red cross between them. */
export const S8: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="c4dc" />
    <SchLabel x={560} y={300} t={t - 2} text="DIRECT CURRENT (DC)" size={40} />
    <SchLabel x={1360} y={300} t={t - 8} text="YOUR CHARGER (AC)" size={40} />
    <path d={`M 300 540 H ${300 + 520 * clamp(t / 16)}`} stroke={SCH.live} strokeWidth={10} strokeLinecap="round" />
    <path
      d={Array.from({ length: 53 }).map((_, i) => `${i ? 'L' : 'M'} ${1100 + i * 10} ${540 - Math.sin(i / 4 + t / 4) * 80}`).join(' ')}
      stroke={SCH.glow} strokeWidth={10} fill="none" opacity={clamp((t - 8) / 6)} />
    <g opacity={backOut(clamp((t - 20) / 8))} transform="translate(960 540)">
      <path d="M -50 -50 L 50 50 M 50 -50 L -50 50" stroke="#FF4A4A" strokeWidth={22} strokeLinecap="round" />
    </g>
  </g>
);

/** Hunting sockets: you walk the night street, from door to door, the HUD falling. */
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: kf(t, [[0, 500], [len, 1500]]), y: HIP, yaw: 0.6, look: Math.sin(t / 10), expr: 'tired', armL: { a: 50, b: -40 }, legL: { a: Math.sin(t / 4) * 16, b: 0 }, legR: { a: -Math.sin(t / 4) * 16, b: 0 }, blink: idleBlink(t, 6) };
  const h = handAt(me, 'L');
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1260]]), 520, 1.3)}>
      <Street26 t={t + 2400} id="c4s9" night cars={false} />
      <Hero look={YOU} pose={me} />
      <Charger x={h.x} y={h.y} s={0.5} />
    </g>
  );
};

/** Behind the front desk: you on a stool, phone plugged in, the porter pocketing his dollar, guests staring. */
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const guests: [Look, number, number][] = [[L.lady, 380, 0.5], [L.gent, 1560, -0.5], [L.doctor, 1720, -0.6]];
  const me: Pose = { ...basePose, x: 1060, y: 560, yaw: -0.2, look: 0.6, headTilt: 8, expr: 'tired', armR: { a: 60, b: -70 }, blink: idleBlink(t, 7) };
  const porter: Pose = { ...basePose, x: 820, y: 580, yaw: 0.4, expr: 'smug', armR: { a: kf(t, [[0, 90], [30, 20]], easeOut), b: -30 }, blink: idleBlink(t, 8) };
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <Lobby t={t + 400} socket={false} />
      {guests.map(([lk, x, yaw], i) => (
        <Hero key={i} look={lk} pose={{ ...basePose, x, y: 640, yaw, look: Math.sign(yaw) * 0.9, expr: 'shock', blink: idleBlink(t, i + 9) }} />
      ))}
      <Hero look={L.worker} pose={porter} />
      <Hero look={YOU} pose={me} />
      <Desk />
      <g transform="translate(1100 628) rotate(-90)">
        <rect x={-14} y={-60} width={28} height={120} rx={8} fill="#1A1820" stroke="#100E16" strokeWidth={3} />
      </g>
      <Glow x={1100} y={620} r={160} kind="cool" o={0.7} />
      {t < 30 ? (
        <g transform={`translate(${kf(t, [[0, 960], [30, 860]])} ${kf(t, [[0, 520], [30, 560]])}) rotate(-10)`}>
          <rect x={-40} y={-20} width={80} height={40} rx={3} fill="#9CC59A" stroke="#1A2A1A" strokeWidth={3} />
          <text x={0} y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={24} fill="#1A3A1A">$1</text>
        </g>
      ) : null}
    </g>
  );
};

/** A guest close: a lady in a cloche, staring at the glowing brick. */
export const S11 = faceCU({ look: L.lady, Bg: ({ t }) => <Lobby t={t} />, faces: [[0, 'shock'], [40, 'worried']], yaw: 0.35, glint: 1 });

export const S12 = phoneCU({ mode: 'chip', battery: 50, bgColor: '#101A2A', push: 0.16 });

export const S13 = factCard({ value: 35, suffix: ' TRILLION', label: 'OPERATIONS EVERY SECOND', sub: 'THE CHIP IN A RECENT IPHONE' });

/** ENIAC in schematic: a room of racks drawn on, valves blinking, a tiny figure for scale. */
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Schematic t={t} id="c4en" />
    <SchLabel x={960} y={200} t={t - 2} text="ENIAC, 1946" size={56} />
    {Array.from({ length: 10 }).map((_, i) => {
      const x = 260 + i * 145;
      const on = clamp((t - i * 2) / 6);
      return (
        <g key={i} opacity={on}>
          <rect x={x} y={340} width={120} height={420} fill="none" stroke={SCH.line} strokeWidth={4} />
          {Array.from({ length: 24 }).map((_, k) => (
            <circle key={k} cx={x + 20 + (k % 4) * 27} cy={370 + Math.floor(k / 4) * 62} r={7} fill={Math.sin(t / 3 + i * 7 + k * 3) > 0.3 ? SCH.glow : SCH.grid} />
          ))}
        </g>
      );
    })}
    <g stroke={SCH.line} strokeWidth={4} fill="none" opacity={clamp((t - 24) / 6)}>
      <circle cx={180} cy={666} r={14} />
      <path d="M 180 680 V 720 M 180 690 L 164 706 M 180 690 L 196 706 M 180 720 L 168 760 M 180 720 L 192 760" />
    </g>
    <SchLabel x={960} y={850} t={t - 30} text="27 TONNES · 150 KILOWATTS · A WHOLE ROOM" size={40} color={SCH.dim} />
  </g>
);

export const S15 = factCard({ value: 5000, label: 'ADDITIONS EVERY SECOND', sub: 'ENIAC, 1946', format: (v) => Math.round(v).toLocaleString('en-US') });

/** Back in the club, but quiet: you look at the phone like it's a bomb. */
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const p = clubStand(0.5, 0.72);
  const me: Pose = { ...basePose, x: p.x, y: p.y, scale: p.scale, yaw: 0.15, look: 0.5, headTilt: 10, expr: 'worried', armR: { a: 110, b: -60 }, blink: idleBlink(t, 10) };
  return (
    <g>
      <g transform={camT(p.x, p.y - 160 * p.scale, kf(t, [[0, 1.9], [len, 2.1]]))}>
        <JazzClub t={t + 900} id="c4s16" play={0.3} veil={0.6} />
        <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={0.4} />
        <Hero look={YOU} pose={me} rimId="rimBlue" />
        <HeldPhone pose={me} t={t} battery={46} glow={1.6} />
      </g>
    </g>
  );
};

/** The paper again: the headline is just THE DEVICE. */
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#1E1614" />
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1.0], [len, 1.18]])}) translate(-960 -540)`}>
      <Newspaper x={960} y={560} w={720} rot={-3} date="MONDAY, NOVEMBER 8, 1926" headline="THE DEVICE"
        drawing={
          <g>
            <rect x={-40} y={-80} width={80} height={160} rx={14} fill="#2A2420" />
            <path d="M -70 -110 L -50 -90 M 70 -110 L 50 -90 M -90 0 L -60 0 M 90 0 L 60 0" stroke="#2A2420" strokeWidth={5} />
          </g>
        } />
    </g>
  </g>
);

export const S18 = bigWord({ kicker: 'NEW YORK TO LONDON, 3 MINUTES, 1927', word: '$75', color: '#FFE27A', Bg: DUSK });

export const S19 = factCard({ value: 1350, label: "THAT SAME CALL IN TODAY'S MONEY", sub: 'ADJUSTED FOR INFLATION', format: (v) => `$${Math.round(v).toLocaleString('en-US')}` });

/** The street: you, the phone in your pocket glowing through the hoodie, and across the road a man in a grey suit, watching. */
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 700, y: HIP, yaw: 0.3, look: 0.3, expr: 'neutral', armR: { a: 14, b: -20 }, blink: idleBlink(t, 11) };
  const suit: Pose = { ...basePose, x: 1520, y: HIP - 30, scale: 0.8, yaw: -0.5, look: -1, expr: 'smug', blink: idleBlink(t, 12) };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1100]]), 520, kf(t, [[0, 1.2], [len, 1.35]]))}>
      <Street26 t={t + 3000} id="c4s20" />
      <Hero look={L.suit26} pose={suit} />
      <Hero look={YOU} pose={me} />
      <Glow x={720} y={HIP + 30} r={60} kind="cool" o={0.8} />
    </g>
  );
};

export const S21 = phoneCU({ mode: 'battery', battery: 41, bgColor: '#120C18', push: 0.14, batteryAt: [[0, 43], [30, 41]] });



export const S22 = bigWord({ kicker: 'ENIAC WEIGHED', word: '27 TONNES', color: '#FF8A3D' });
