import React from 'react';
import { factCard } from '../../../engine';
import {
  Cell, CellClock, Bars, Station, Counter, Backyard, Steps, Big, PopWord, Soft, Glow, Star, Messages, HotDog,
  phoneShot, bigWord, Schematic, SCH,
  YOU_NOHOOD, MOM, ROBE, Body, standAt, sitPose, GROUND, PoliceDog,
  camT, kf, clamp, backOut, basePose, FONT, wordF, ShotProps, Word,
} from '../common';
import { Mug } from '../../../engine';
import words from './words.json';

// Chapter 7, no respawn: 3 AM on the bench, no save point. 8 AM, 24 hours exactly: Mom signs the papers; a judge has
// to look at an arrest within about 48 hours (US); the real list, and an apology to the man in the bathrobe. The
// scoreboard. Rule five lasted eight minutes; real life keeps every save. On the steps, Mo texts: tomorrow, the cheat
// codes, and this time you're filming. Is any of this real? Which rule would you break first?

const W = words as Word[];
const ME = YOU_NOHOOD;
const STP: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Steps t={t} id={id} />;

// ---------------------------------------------------------------- S1: 3 AM, a bench in a cold room
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 800], [len, 760]]), 560, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <Cell t={t} />
      <CellClock hh={3} mm={0} />
      <Body look={ME} pose={{ ...basePose, x: 640, y: 600, scale: 1, spin: -90, yaw: 0, armL: { a: 150, b: -100 }, armR: { a: 10, b: -4 }, legL: { a: 4, b: -20 }, legR: { a: -4, b: -10 } }} t={t} faces={[[0, 'tired']]} />
      <Bars />
    </g>
    <rect width={1920} height={1080} fill="#0A1030" opacity={0.35} />
    <text x={80} y={110} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={clamp(t / 6)}>3:00 AM</text>
  </g>
);

// ---------------------------------------------------------------- S2: no respawn, no save point
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#0C0A16" />
    {[['RESPAWN', 400, 6], ['SAVE GAME', 700, 26]].map(([txt, y, at], i) => (
      <g key={i} opacity={clamp((t - (at as number)) / 5)}>
        <rect x={610} y={(y as number) - 80} width={700} height={130} rx={65} fill="#22203A" stroke="#6A6672" strokeWidth={6} />
        <text x={960} y={(y as number) + 10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#6A6672">{txt}</text>
        <path d={`M 590 ${(y as number) - 100} L 1330 ${(y as number) + 70}`} stroke="#FF3A2E" strokeWidth={14} strokeLinecap="round" opacity={clamp(((t - (at as number)) - 8) / 4)} />
      </g>
    ))}
  </g>
);

// ---------------------------------------------------------------- S3: 8 AM, twenty-four hours exactly
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 400, kf(t, [[0, 1.4], [len, 1.6]]))}>
      <Cell t={t + 40} dawn={1} />
      <CellClock hh={8} mm={0} />
      <Body look={ME} pose={sitPose(640, 630, 1, 0.3, { armL: { a: 20, b: -40 }, armR: { a: 20, b: -40 }, headTilt: -10, look: 0.6 })} t={t} faces={[[0, 'tired']]} />
      <Bars />
    </g>
    <g opacity={clamp((t - 10) / 6)}>
      <Big x={960} y={960} size={90} fill="#FFD23A">24 HOURS. EXACTLY.</Big>
    </g>
  </g>
);

// ---------------------------------------------------------------- S4: Mom signs the papers
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1300, 580, kf(t, [[0, 1.45], [len, 1.55]]))}>
    <Station t={t + 60} />
    <Body look={MOM} pose={standAt(1300, 1, GROUND, { yaw: 0.6, tilt: 10, armR: { a: 70 + Math.sin(t / 2) * 6, b: -50 } })} t={t} faces={[[0, 'neutral']]} seed={3} shadow={1} />
    <Body look={ME} pose={standAt(1020, 0.95, GROUND, { yaw: 0.5, headTilt: 12, look: 0.4 })} t={t} faces={[[0, 'worried']]} shadow={1} />
    <Counter x={1360} />
    <rect x={1450} y={620} width={180} height={24} fill="#F6EFE3" stroke="#14121C" strokeWidth={4} />
  </g>
);

export const S5 = factCard({ value: 48, suffix: ' h', label: 'A JUDGE MUST LOOK AT AN ARREST WITHIN', sub: 'usually, in the US (Supreme Court, 1991)' });

// ---------------------------------------------------------------- S6: and an apology to the man in the bathrobe
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const rb = standAt(1560, 1, 820);
  const me = standAt(1250, 1, 840);
  return (
    <g transform={camT(1400, 560, kf(t, [[0, 1.35], [len, 1.45]]))}>
      <Backyard t={t + 300} />
      <Body look={ROBE} pose={{ ...rb, yaw: -0.5, armR: { a: 70, b: -110 } }} t={t} faces={[[0, 'neutral'], [Math.round(len * 0.7), 'smug']]} seed={9} shadow={1} />
      <Mug x={rb.x - 70} y={rb.y - 90} rot={0} steam={1} f={t} />
      <Body look={ME} pose={{ ...me, yaw: 0.6, tilt: 20 * clamp((t - 20) / 10), headTilt: 10 }} t={t} faces={[[0, 'oops']]} shadow={1} />
      <PoliceDog x={1800} y={840} s={0.7} t={t} harness={false} fur="#6A5A4A" flip sit={1} wag={1} />
      <PopWord t={t} at={Math.round(len * 0.5)} x={1250} y={300} text="SORRY." size={70} fill="#FFFFFF" hold={80} rot={0} />
    </g>
  );
};

// ---------------------------------------------------------------- S7: the scoreboard
const SCORE = ['RED-LIGHT TICKET', 'TAXI FARE', 'CHARGES FOR RUNNING', 'NEW PEOPLE WHO KNOW YOUR FACE', 'HOT DOGS YOU CAN NEVER EAT AGAIN'];
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const step = Math.max(14, Math.floor((len - 20) / SCORE.length));
  return (
    <g>
      <rect width={1920} height={1080} fill="#14102A" />
      <text x={900} y={195} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={62} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">ONE DAY: THE SCOREBOARD</text>
      {SCORE.map((s, i) => (
        <g key={i} transform={`translate(260 ${290 + i * 150})`} opacity={clamp((t - 10 - i * step) / 6)}>
          <rect x={0} y={-70} width={1400} height={110} rx={20} fill="#22203A" stroke="#4A4660" strokeWidth={4} />
          <text x={40} y={8} fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F6EFE3">{s}</text>
          <text x={1360} y={8} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#FF5A4A">{i === 4 ? 'x6' : i === 3 ? '210K' : '✓'}</text>
          {i === 4 ? <HotDog x={1230} y={-10} s={0.45} /> : null}
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- S8: real life keeps every save
export const S8: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#0C0A16" />
    <g transform={`translate(960 330) scale(${backOut(clamp(t / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#FF5A4A">RULE FIVE LASTED 8 MINUTES</text>
    </g>
    <g transform={`translate(960 600) scale(${backOut(clamp((t - 40) / 10))})`}>
      <Big x={0} y={0} size={110} fill="#FFFFFF">REAL LIFE KEEPS</Big>
      <Big x={0} y={130} size={130} fill="#FFD23A">EVERY SAVE</Big>
    </g>
  </g>
);

// ---------------------------------------------------------------- S9: on the steps, your phone buzzes
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const buzz = t > 20 ? Math.sin(t * 3) * 6 : 0;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 600, kf(t, [[0, 1.2], [len, 1.4]]))}>
      <Steps t={t} />
      <Body look={MOM} pose={standAt(1180, 1, GROUND, { yaw: 0.4, armL: { a: 30, b: -20 } })} t={t} faces={[[0, 'tired']]} seed={3} shadow={1} />
      <Body look={ME} pose={standAt(920, 0.95, GROUND, { yaw: 0.3, armR: { a: 30 + (t > 20 ? 50 : 0), b: -80 } })} t={t} faces={[[0, 'tired'], [24, 'oops']]} shadow={1} />
      {t > 20 ? (
        <g transform={`translate(${880 + buzz} ${GROUND - 230})`}>
          <rect x={-22} y={-40} width={44} height={80} rx={8} fill="#1A1922" stroke="#4A4858" strokeWidth={4} />
          <path d="M -40 -30 q -10 30 0 60 M 40 -30 q 10 30 0 60" stroke="#CFE6FF" strokeWidth={5} fill="none" />
        </g>
      ) : null}
      <Glow x={1500} y={200} r={700} kind="warm" o={0.35} />
    </g>
  );
};

// ---------------------------------------------------------------- S10: Mo: tomorrow, the cheat codes
export const S10: React.FC<ShotProps> = ({ t, len, f }) => {
  const at2 = wordF(W, 'second') - (f - t);
  return phoneShot({
    Bg: STP, zoom: [1.35, 1.5],
    screen: (tt) => <Messages t={tt} from="Mo" msgs={[{ text: "Bro. Tomorrow I'm trying the cheat codes.", at: 6 }, { text: "And this time, you're filming.", at: Math.max(20, at2) }]} />,
  })({ t, len, f });
};

// ---------------------------------------------------------------- S11: is any of this real? the facts are
const FACTS = ['10 SECONDS OF ALL-OUT SPRINT', "A DOG'S NOSE: 300 MILLION RECEPTORS", 'THERMAL CAMERAS SEE BODY HEAT', '"ONE PHONE CALL" IS A MYTH'];
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const step = Math.max(12, Math.floor((len - 30) / FACTS.length));
  return (
    <g>
      <Schematic t={t} id="c7s11" />
      <text x={900} y={215} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill={SCH.line} opacity={clamp(t / 6)}>IS ANY OF THIS REAL?</text>
      {FACTS.map((s, i) => (
        <g key={i} opacity={clamp((t - 24 - i * step) / 6)} transform={`translate(360 ${360 + i * 150})`}>
          <text x={0} y={0} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={SCH.live}>✓</text>
          <text x={90} y={0} fontFamily={FONT.title} fontWeight={800} fontSize={54} fill={SCH.line}>{s}</text>
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- S12: which game rule would you break first?
const RULES = ['1. NEVER WALK', '2. WHEELS = RIDE', '3. EAT TO HEAL', '4. THE CITY IS YOUR MAP', '5. HIDE TILL THE STARS FADE'];
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <Steps t={t + 200} />
    </g>
    <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.6} />
    <g transform={`translate(960 190) scale(${backOut(clamp(t / 9))})`}>
      <Big x={0} y={0} size={86} fill="#FFD23A">WHICH RULE WOULD</Big>
      <Big x={0} y={100} size={86} fill="#FFD23A">YOU BREAK FIRST?</Big>
    </g>
    {RULES.map((r, i) => (
      <g key={i} opacity={clamp((t - 14 - i * 6) / 6)} transform={`translate(960 ${450 + i * 100})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#F6EFE3">{r}</text>
      </g>
    ))}
    <g opacity={clamp((t - 50) / 8)} transform="translate(960 1000)">
      <rect x={-300} y={-55} width={600} height={90} rx={45} fill="#E8253A" />
      <text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#FFFFFF">TELL ME IN THE COMMENTS</text>
    </g>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} transform={`translate(${200 + i * 0} ${450 + i * 100})`} opacity={0}>
        <Star x={0} y={0} r={20} on={0} />
      </g>
    ))}
  </g>
);

