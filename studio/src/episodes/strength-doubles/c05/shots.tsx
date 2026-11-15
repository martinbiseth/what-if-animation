import React from 'react';
import { Pose, ShotProps, KITCHEN, stand, KitchenIsland, islandTop, ModernCar, Paper, Schematic, SCH, SchLabel, FONT, Smartphone, Bedroom, BedDuvet, bedSit } from '../../../engine';
import words from './words.json';
import {
  YOU, MO, MUM, SUIT, N1, N2, Hero, basePose, camT, clamp, kf, lerp, easeOut, backOut, idleBlink, faceAt, Glow, POWER,
  StreetSet, KitchenSet, propCU, faceCU, talkShot, sdCard, thingCard, at, HIP, STREETM, Soft, BigHand, span, HeldPhone, liftLabel,
} from '../common';

// Chapter 5, someone notices: the news, the scientists, the black car, the man in the grey suit at the door and at
// the kitchen table doing the maths (200 tonnes, a cargo ship, the Great Pyramid on day 27), the offer, the bent
// table, the folder that knows too much, the price, Mo's warning, the card, and the call you weren't meant to hear.

const STREET = StreetSet('day', { car: false });
const DUSK = StreetSet('dusk', { car: false });
const KIT = KitchenSet(0.32);
const NightBed: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} veil={0.5} duvet={false} clock="23:40" lamp={0} />;
const KA = stand(KITCHEN, 0.36, 0.4), KB = stand(KITCHEN, 0.64, 0.4);

export const S1 = sdCard({ kicker: 'CHAPTER 5', title: 'THE MAN IN THE SUIT', day: 12, tint: '#3A3A4A' });

/** A TV screen filling the frame: `children` is the picture. */
const TV: React.FC<{ t: number; children: React.ReactNode; ticker: string }> = ({ t, children, ticker }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A1620" />
    <rect x={160} y={90} width={1600} height={900} rx={24} fill="#0E0C14" stroke="#2A2834" strokeWidth={20} />
    <svg x={180} y={110} width={1560} height={860} viewBox="0 0 1560 860">
      <rect width={1560} height={860} fill="#2A4A8A" />
      {children}
      <rect y={720} width={1560} height={140} fill="#C83A3A" />
      <text x={30} y={790} fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#F6EFE3">BREAKING</text>
      <rect y={800} width={1560} height={60} fill="#F6EFE3" />
      <text x={1560 - ((t * 8) % 2600)} y={844} fontFamily={FONT.ui} fontSize={36} fill="#100E16">{ticker}</text>
    </svg>
  </g>
);

// ---------- S2: your face on every news channel ----------
export const S2: React.FC<ShotProps> = ({ t }) => (
  <TV t={t} ticker="TEEN LIFTS DELIVERY VAN · 'STRONGEST KID ALIVE?' · VIDEO PASSES 40 MILLION VIEWS ·">
    <g transform="translate(780 520) scale(2.2)">
      <Hero look={YOU} pose={{ ...basePose, x: 0, y: 0, expr: 'smug', blink: idleBlink(t, 3) }} shadow={0} />
    </g>
    <text x={1200} y={160} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#F6EFE3">STRONGEST KID?</text>
  </TV>
);

// ---------- S3: two scientists arguing in split screen ----------
export const S3: React.FC<ShotProps> = ({ t }) => {
  const talkA = t < 105 ? Math.abs(Math.sin(t / 3)) * 0.7 : 0, talkB = t >= 105 ? Math.abs(Math.sin(t / 3)) * 0.7 : 0;
  return (
    <TV t={t + 100} ticker="EXPERTS DIVIDED · HOAX OR HISTORY? ·">
      <rect width={780} height={720} fill="#3A5A9A" />
      <rect x={780} width={780} height={720} fill="#5A3A7A" />
      <path d="M 780 0 V 720" stroke="#F6EFE3" strokeWidth={8} />
      <g transform="translate(390 560) scale(1.6)"><Hero look={N1} pose={{ ...basePose, x: 0, y: 0, yaw: 0.3, expr: t < 105 ? 'smug' : 'worried', talk: talkA, blink: idleBlink(t, 2), glasses: 1 }} shadow={0} /></g>
      <g transform="translate(1170 560) scale(1.6)"><Hero look={N2} pose={{ ...basePose, x: 0, y: 0, yaw: -0.3, expr: t >= 105 ? 'shock' : 'neutral', talk: talkB, blink: idleBlink(t, 5) }} shadow={0} /></g>
      <g opacity={clamp((t - 80) / 6)}><rect x={40} y={40} width={260} height={70} rx={12} fill="#0B0816" /><text x={170} y={92} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#FF3A2A">HOAX</text></g>
      <g opacity={clamp((t - 112) / 6)}><rect x={820} y={40} width={700} height={70} rx={12} fill="#0B0816" /><text x={1170} y={92} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill={POWER}>MOST IMPORTANT PERSON ALIVE</text></g>
    </TV>
  );
};

// ---------- S4: the black car outside your house, engine running ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 920]]), 520, 1.1)}>
    <STREET t={t + 100} id="s4" />
    <g transform={`translate(0 ${Math.sin(t * 2) * 1.5})`}><ModernCar x={1100} y={STREETM.feet + 60} s={1.1} dark lights={0.4} /></g>
    {Array.from({ length: 4 }, (_, i) => {
      const k = ((t + i * 12) % 48) / 48;
      return <circle key={i} cx={1360 + k * 80} cy={STREETM.feet + 30 - k * 40} r={14 + k * 26} fill="#8A8A9A" opacity={0.4 * (1 - k)} />;
    })}
  </g>
);

// ---------- S5: a man in a grey suit rings the doorbell ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const ring = clamp((t - 30) / 6) * (1 - clamp((t - 46) / 6));
  return (
    <g transform={camT(1440, 470, kf(t, [[0, 1.7], [len, 1.85]]))}>
      <STREET t={t + 160} id="s5" />
      <Hero look={SUIT} pose={at(1440, { yaw: 0.6, expr: 'neutral', armR: { a: lerp(20, 80, ring), b: -10 }, blink: idleBlink(t, 6) })} />
    </g>
  );
};

// ---------- S6: Mum opens the door; he smiles at you over her shoulder ----------
const suitLine1 = span(words, "'We've", 'videos');
export const S6 = talkShot({
  Set: STREET, setT: 220, words,
  cast: [
    { look: SUIT, x: 1180, y: HIP, yaw: -0.4, talk: [suitLine1], faces: [[0, 'neutral'], [40, 'smug']], look_: -0.8 },
    { look: MUM, x: 900, y: HIP, yaw: 0.5, faces: [[0, 'neutral'], [100, 'worried']] },
    { look: YOU, x: 660, y: HIP + 20, scale: 0.95, yaw: 0.4, faces: [[0, 'neutral'], [60, 'worried']] },
  ],
  cam: { from: [940, 460, 1.55], to: [960, 460, 1.7] },
});

// ---------- S7: at the kitchen table, he does the maths out loud ----------
const suitMaths = span(words, "'Today", 'ship');
export const S7 = talkShot({
  Set: KIT, setT: 100, words,
  cast: [
    { look: SUIT, ...KA, yaw: 0.4, talk: [suitMaths], faces: [[0, 'smug']], pose: { armR: { a: 70, b: -40 } } },
    { look: YOU, ...KB, yaw: -0.4, faces: [[0, 'worried']] },
  ],
  cam: { from: [960, 470, 1.9], to: [960, 470, 2.05] },
  front: () => <KitchenIsland />,
});

// ---------- S8: day 27: the Great Pyramid ----------
export const S8 = thingCard({ day: 27, thing: 'pyramid', label: 'THE GREAT PYRAMID OF GIZA' });

// ---------- S9: that one's real too: 6 million vs 6.7 million ----------
export const S9: React.FC<ShotProps> = ({ t }) => {
  const a = easeOut(clamp((t - 70) / 24)), b = easeOut(clamp((t - 195) / 24));
  return (
    <g>
      <Schematic t={t} id="pyr" />
      <SchLabel x={960} y={200} t={t - 2} text="THAT ONE'S REAL TOO" size={44} color={SCH.dim} />
      <text x={320} y={445} textAnchor="end" fontFamily={FONT.ui} fontSize={36} fill={SCH.dim}>PYRAMID</text>
      <rect x={350} y={400} width={1100 * (6.0 / 6.7) * a} height={64} rx={10} fill={SCH.live} />
      <text x={370 + 1100 * (6.0 / 6.7) * a} y={445} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#F6EFE3" opacity={a}>~6 MILLION T</text>
      <text x={320} y={605} textAnchor="end" fontFamily={FONT.ui} fontSize={36} fill={SCH.dim}>DAY 27</text>
      <rect x={350} y={560} width={1100 * b} height={64} rx={10} fill={POWER} />
      <text x={370 + 1100 * b} y={605} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={POWER} opacity={b}>6.7 MILLION T</text>
      <SchLabel x={960} y={760} t={t - 170} text="50 KG x 2^27 = 6,710,886,400 KG" size={36} />
      <g opacity={clamp((t - 220) / 6)} transform={`translate(960 880) scale(${backOut(clamp((t - 220) / 9))})`}>
        <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#0B0816" stroke={SCH.live} strokeWidth={3} />
        <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
      </g>
    </g>
  );
};

// ---------- S10: "We can help you": the suit, close ----------
const suitHelp = span(words, "'We", 'live');
export const S10 = faceCU({ look: SUIT, Bg: KIT, faces: [[0, 'smug']], yaw: 0.3, words, talk: suitHelp, zoom: [3.0, 3.2] });

// ---------- S11: the contract slides across the table ----------
export const S11 = propCU({ Bg: KIT, push: 0.05, draw: (t) => {
  const p = easeOut(clamp(t / 20));
  return (
    <g>
      <rect x={0} y={560} width={1920} height={600} fill="#9A7A5A" />
      <g transform={`translate(${lerp(500, 900, p)} 760) rotate(-6)`}>
        <rect x={-200} y={-140} width={400} height={280} fill="#F6F2E8" stroke="#100E16" strokeWidth={5} />
        <text x={0} y={-80} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#100E16">AGREEMENT</text>
        {[-30, 0, 30, 60].map((y) => <path key={y} d={`M -160 ${y} H 160`} stroke="#B8B2A8" strokeWidth={5} />)}
        <path d="M 40 110 H 170" stroke="#100E16" strokeWidth={3} />
      </g>
      <BigHand x={lerp(380, 780, p)} y={740} s={0.9} sleeve="#4A4A56" rot={-6} />
    </g>
  );
} });

// ---------- S12: the table bends under your elbow ----------
export const S12 = propCU({ Bg: KIT, push: 0.04, draw: (t) => {
  const b = easeOut(clamp(t / 16));
  return (
    <g>
      <path d={`M 0 640 Q 960 ${640 + 120 * b} 1920 640 V 1100 H 0 Z`} fill="#9A7A5A" stroke="#100E16" strokeWidth={6} />
      <path d={`M 0 640 Q 960 ${640 + 120 * b} 1920 640`} stroke="#B8987A" strokeWidth={10} fill="none" />
      <rect x={780} y={300} width={300} height={140} rx={60} fill="#F07A2A" stroke="#100E16" strokeWidth={8} transform={`rotate(70 930 ${560 + 120 * b})`} />
      <ellipse cx={940} cy={630 + 120 * b} rx={90} ry={50} fill="#F07A2A" stroke="#100E16" strokeWidth={8} />
      <Glow x={940} y={640 + 120 * b} r={220} kind="warm" o={0.3 * b} />
    </g>
  );
} });

// ---------- S13: the folder: he knows things he shouldn't ----------
export const S13 = propCU({ Bg: KIT, push: 0.07, draw: (t) => (
  <g>
    <rect x={380} y={180} width={1160} height={760} rx={10} fill="#C8A86A" stroke="#100E16" strokeWidth={6} />
    <rect x={430} y={230} width={520} height={660} fill="#F6F2E8" stroke="#100E16" strokeWidth={4} />
    <rect x={990} y={230} width={500} height={660} fill="#F6F2E8" stroke="#100E16" strokeWidth={4} />
    <g transform="translate(690 520) scale(1.3)"><Hero look={YOU} pose={{ ...basePose, x: 0, y: 0, expr: 'neutral' }} shadow={0} /></g>
    <rect x={540} y={300} width={300} height={300} fill="none" stroke="#100E16" strokeWidth={4} />
    <text x={690} y={680} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#100E16">SUBJECT 1</text>
    {[['SHOE SIZE: 7', 50], ['SCHOOL: ✓', 85], ['FRACTURE: RIGHT HAND', 120]].map(([s, a], i) => (
      <text key={i} x={1030} y={360 + i * 110} fontFamily={FONT.hand} fontWeight={700} fontSize={46} fill="#100E16" opacity={clamp((t - (a as number)) / 6)}>{s}</text>
    ))}
    <g opacity={clamp((t - 20) / 6)} transform="translate(1240 780) rotate(-12)">
      <rect x={-160} y={-40} width={320} height={80} fill="none" stroke="#C83A3A" strokeWidth={8} />
      <text textAnchor="middle" y={18} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#C83A3A">CLASSIFIED</text>
    </g>
  </g>
) });

// ---------- S14: "And in return?" ----------
const youLine = span(words, "'And", "return?'");
const suitReturn = span(words, "'In", "move.'");
export const S14 = talkShot({
  Set: KIT, setT: 300, words,
  cast: [
    { look: SUIT, ...KA, yaw: 0.4, talk: [suitReturn], faces: [[0, 'neutral'], [40, 'smug']], pose: { armR: { a: 60, b: -40 } } },
    { look: YOU, ...KB, yaw: -0.4, talk: [youLine], faces: [[0, 'worried']] },
  ],
  cam: { from: [1080, 470, 2.2], to: [900, 470, 2.3] },
  front: () => <KitchenIsland />,
});

// ---------- S15: he pauses: "things we'd rather not talk about in front of your mother" ----------
const suitMother = span(words, "'And", "mother.'", 2);
export const S15 = faceCU({ look: SUIT, Bg: KIT, faces: [[0, 'neutral'], [20, 'smug']], yaw: -0.25, words, talk: suitMother, zoom: [3.4, 3.8] });

// ---------- S16: that night, in bed, Mo on the phone: "They want a weapon" ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.2);
  const me: Pose = { ...basePose, ...sit, yaw: 0.5, expr: 'worried', armR: { a: 150, b: -150 }, blink: idleBlink(t, 3), headTilt: 8 };
  return (
    <g transform={camT(760, 470, kf(t, [[0, 2.0], [len, 2.2]]))}>
      <NightBed t={t + 100} id="s16" />
      <Hero look={YOU} pose={me} rimId="rimBlue" />
      <BedDuvet knees={0.6} />
      <Glow x={sit.x + 30} y={sit.y - 200} r={140} kind="cool" o={0.7} />
      <g opacity={clamp((t - 50) / 8)}>
        <rect x={sit.x + 80} y={sit.y - 330} width={290} height={70} rx={20} fill="#0B0816" opacity={0.8} />
        <text x={sit.x + 225} y={sit.y - 284} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#8FF0FF">MO: "a weapon"</text>
      </g>
    </g>
  );
};

// ---------- S17: the card he left ----------
export const S17 = propCU({ Bg: KIT, push: 0.08, draw: (t) => (
  <g>
    <rect x={0} y={560} width={1920} height={600} fill="#9A7A5A" />
    <g transform="translate(960 700) rotate(-5)">
      <rect x={-300} y={-160} width={600} height={320} rx={10} fill="#F6F6F8" stroke="#100E16" strokeWidth={5} />
      <text y={-40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#100E16">NO NAME.</text>
      <text y={50} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill="#100E16">+00 0000 0000</text>
    </g>
  </g>
) });

// ---------- S18: dusk: by his car, on the phone ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const suit: Pose = at(1300, { yaw: -0.3, expr: 'neutral', armR: { a: 150, b: -150 }, blink: idleBlink(t, 4) });
  return (
    <g transform={camT(1150, 500, kf(t, [[0, 1.4], [len, 1.55]]))}>
      <DUSK t={t + 200} id="s18" />
      <ModernCar x={1000} y={STREETM.feet + 60} s={1.1} dark lights={0.6} />
      <Hero look={SUIT} pose={suit} />
      <Hero look={YOU} pose={at(620, { yaw: 0.5, expr: 'worried', blink: idleBlink(t, 2), scale: 0.8, y: HIP - 60 }, 0.8)} />
    </g>
  );
};

// ---------- S19: "by day twenty, nobody will be able to stop him" ----------
const suitCall = span(words, "'No", "him.'");
export const S19 = faceCU({ look: SUIT, Bg: DUSK, faces: [[0, 'neutral'], [40, 'smug']], yaw: -0.35, words, talk: suitCall, zoom: [3.6, 4.2], pose: { armR: { a: 150, b: -150 } } });

// ---------- S20: in ten more days, a cargo ship ----------
export const S20 = thingCard({ day: 22, thing: 'ship', label: 'A LOADED CARGO SHIP' });
