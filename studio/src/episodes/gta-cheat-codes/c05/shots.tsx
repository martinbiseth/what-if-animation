import React from 'react';
import {
  Hero, basePose, kf, camT, clamp, backOut, ShotProps, FONT, Glow, LEG_LEN, rnd, SUBURB, BANK, Suburb, Jet, KITCHEN, stand, factCard,
} from '../../../engine';
import words from './words.json';
import {
  YOU, MO, SUIT, TELLER, ENGINEER, PILOT, AGENT, KitSet, BankS, HighSky, faceCU, scene, fig, propCU, textCard, Flyer, Bill, SportsCar, PowerGraph,
  Helicopter, SatVan, Controller, OUR_DOOR, ROAD, SetC, msgCU, span, talkShot,
} from '../common';

// Chapter 5, someone notices: the pilot, the real 2020 sighting, the news and Mo's laughing faces, the power company's
// graph, the teller's call, the Secret Service (1865), black cars, the man in the grey suit with two bills, the
// satellite van, a helicopter, and his eyes on the controller.

const Dusk: SetC = ({ t, id }) => <Suburb t={t} id={id} tod="dusk" cars={false} windowsLit={0.7} />;
const FEET = SUBURB.feet;
const standY = (s = 1) => FEET - LEG_LEN * s;

// ---------- S2: the pilot, his mouth open, you outside his window ----------
export const S2 = faceCU({
  look: PILOT, Bg: HighSky, faces: [[0, 'shock']], yaw: 0.3, zoom: [2.4, 2.5],
  extra: (t) => <path d="M -70 -230 Q 0 -300 70 -230" stroke="#2A2C34" strokeWidth={14} fill="none" transform="translate(0 0)" />,
  front: (t) => <g transform="translate(1500 300) scale(0.5)"><Flyer x={0} y={0} t={t} socks /></g>,
});

// ---------- S3: through the plane's window: you, waving ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.05]]))}>
      <HighSky t={t + 200} id="s3" />
      <Flyer x={960} y={560} s={1.1} t={t} socks expr="happy" />
    </g>
    {/* the cabin wall with its round window */}
    <path d="M -10 -10 H 1930 V 1090 H -10 Z M 960 540 m -380 0 a 380 450 0 1 0 760 0 a 380 450 0 1 0 -760 0 Z" fill="#E8E4DC" fillRule="evenodd" />
    <ellipse cx={960} cy={540} rx={380} ry={450} fill="none" stroke="#B8B4AC" strokeWidth={30} />
  </g>
);

// ---------- S4, S4c, S4b: the real sighting ----------
export const S4 = textCard({ kicker: 'THIS HAS ACTUALLY HAPPENED', lines: ['2020', 'LOS ANGELES'], size: 130, real: true, y: 420 });
export const S4c = textCard({
  kicker: 'AIRLINE PILOTS REPORTED', lines: ['A JETPACK AT', '3,000 FEET'], size: 110, y: 330, sub: 'Federal Aviation Administration, Aug 2020',
  art: (t) => (
    <g opacity={0.9}>
      <Jet x={kf(t, [[0, 600], [100, 800]])} y={810} s={0.6} />
      <g transform={`translate(${kf(t, [[0, 1250], [100, 1300]])} 800) scale(0.4)`}>
        <circle r={40} fill="#F6EFE3" />
        <path d="M -20 30 l -20 60 M 20 30 l 20 60" stroke="#FF8A2A" strokeWidth={16} />
      </g>
    </g>
  ),
});
export const S4b = textCard({ kicker: 'AND THEN', lines: ['THE FBI', 'WENT LOOKING'], size: 120, color: '#FFE27A', y: 440 });

// ---------- S5: on the news ----------
export const S5 = propCU({
  Bg: KitSet,
  draw: (t) => (
    <g transform="translate(960 540)">
      <rect x={-640} y={-380} width={1280} height={760} rx={24} fill="#16161C" />
      <g transform="translate(0 -20)">
        <rect x={-610} y={-350} width={1220} height={680} fill="#7FB4EA" />
        <g transform={`translate(${kf(t, [[0, -400], [68, 300]])} -80) scale(0.5)`}><Flyer x={0} y={0} t={t} /></g>
        <rect x={-610} y={180} width={1220} height={70} fill="#C8382A" />
        <text x={-580} y={228} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFFFFF">BREAKING: JETPACK SPOTTED. AGAIN.</text>
        <rect x={-610} y={250} width={1220} height={80} fill="#1A1A22" />
        <text x={-580 + ((-t * 6) % 600)} y={300} fontFamily={FONT.ui} fontSize={30} fill="#F6EFE3">PILOTS BAFFLED  ·  POLICE ASK PUBLIC FOR VIDEO  ·  PILOTS BAFFLED  ·  POLICE ASK</text>
        <rect x={-580} y={-330} width={110} height={44} fill="#C8382A" />
        <text x={-525} y={-298} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#FFFFFF">LIVE</text>
      </g>
    </g>
  ),
});

// ---------- S6: Mo's text: forty-two crying-laughing faces ----------
const Laugh: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle r={20} fill="#FFD34A" stroke="#8A6A1A" strokeWidth={2} />
    <path d="M -12 -4 l 6 -4 M 12 -4 l -6 -4" stroke="#2A2418" strokeWidth={3} />
    <path d="M -10 4 Q 0 16 10 4 Z" fill="#2A2418" />
    <ellipse cx={-17} cy={4} rx={4} ry={7} fill="#7FC8F0" />
    <ellipse cx={17} cy={4} rx={4} ry={7} fill="#7FC8F0" />
  </g>
);
const moClip = msgCU({ bubbles: [{ at: 4, text: ['[video] jetpack_again.mp4'] }] });
export const S6: React.FC<ShotProps> = (p) => (
  <g>
    {moClip(p)}
    <g transform="translate(960 560) rotate(-3)">
      {Array.from({ length: 42 }).map((_, i) => (
        <g key={i} opacity={clamp((p.t - 14 - i * 0.8) / 3)}>
          <Laugh x={-230 + (i % 9) * 56} y={30 + Math.floor(i / 9) * 56} s={1.2} />
        </g>
      ))}
    </g>
  </g>
);

// ---------- S7: the power company: an engineer staring at a graph ----------
export const S7 = propCU({
  bgColor: '#0A0E18',
  draw: (t) => (
    <g>
      <PowerGraph x={180} y={200} w={1100} h={500} p={kf(t, [[0, 0.1], [100, 1]])} />
      <g transform="translate(1560 1080) scale(1.7)">
        <Hero look={ENGINEER} pose={{ ...basePose, x: 0, y: 0, yaw: -0.5, look: -0.8, expr: t > 60 ? 'shock' : 'neutral', blink: 0 }} shadow={0} />
      </g>
    </g>
  ),
});

// ---------- S8, S8b: three huge dips, one street; yours ----------
export const S8 = propCU({ bgColor: '#0A0E18', push: 0.12, draw: (t) => <PowerGraph x={260} y={260} w={1400} h={560} p={1} hi={1} /> });
export const S8b = propCU({
  bgColor: '#0A0E18',
  draw: (t) => (
    <g>
      {/* a street map, one street red */}
      <rect x={260} y={140} width={1400} height={800} fill="#1A2238" />
      {Array.from({ length: 8 }).map((_, i) => <path key={i} d={`M ${260 + i * 200} 140 V 940 M 260 ${140 + i * 115} H 1660`} stroke="#2A3A5A" strokeWidth={10} />)}
      <path d="M 460 485 H 1460" stroke="#FF4A4A" strokeWidth={22} opacity={0.6 + 0.4 * Math.sin(t / 3)} />
      <circle cx={960} cy={485} r={26} fill="#FF4A4A" />
      <text x={960} y={440} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#FFFFFF" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={clamp((t - 6) / 6)}>YOUR STREET</text>
    </g>
  ),
});

// ---------- S9: the teller makes a call ----------
export const S9 = scene({
  Set: BankS, cam: [[1450, 480, 2.0], [1450, 480, 2.1]], setT: 600,
  draw: (t) => (
    <g>
      {fig(TELLER, t, { x: 1500, y: BANK.feet - LEG_LEN - 20, yaw: -0.2, look: -0.3, armR: { a: 150, b: -150 } }, [[0, 'worried']], 2, Math.abs(Math.sin(t / 4)) * 0.6)}
      <rect x={1160} y={BANK.counter - 22} width={600} height={28} fill="#8A6A52" />
    </g>
  ),
});

// ---------- S10, S10b, S11: the Secret Service ----------
export const S10 = textCard({ kicker: 'IN AMERICA, FAKE MONEY', lines: ["ISN'T JUST A JOB", 'FOR THE POLICE'], size: 110, y: 440 });
export const S10b = textCard({ kicker: "IT'S A JOB FOR THE", lines: ['SECRET SERVICE'], size: 140, color: '#FFE27A', sub: 'the same people who guard the President', y: 540 });
export const S11 = factCard({ value: 1865, label: 'SECRET SERVICE FOUNDED', format: (v) => String(Math.round(v)), sub: 'to catch people making fake money (U.S. Secret Service)' });

// ---------- S12: three black cars park behind the three sports cars ----------
export const S12 = scene({
  Set: Dusk, cam: [[960, 560, 1.0], [960, 560, 1.04]],
  draw: (t, f, len) => (
    <g>
      <SportsCar x={420} y={ROAD} s={0.6} />
      <SportsCar x={860} y={ROAD} s={0.6} color="#3A8AF0" />
      <SportsCar x={1290} y={ROAD} s={0.6} color="#F07AB8" />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${kf(t, [[i * 12, 2600 + i * 400], [70 + i * 18, 0]])} 0)`}>
          <g transform={`translate(${520 + i * 520} ${ROAD + 170}) scale(0.62)`}>
            <path d="M -290 -24 L -290 -110 Q -280 -130 -220 -136 L -130 -140 L -70 -210 H 120 L 190 -140 L 270 -130 Q 300 -120 300 -90 V -24 Z" fill="#14151C" stroke="#05050A" strokeWidth={6} />
            <path d="M -110 -146 L -60 -198 H 40 V -146 Z M 60 -198 H 112 L 160 -146 H 60 Z" fill="#2A3040" />
            <circle cx={-170} cy={-20} r={42} fill="#05050A" />
            <circle cx={170} cy={-20} r={42} fill="#05050A" />
            <rect x={270} y={-110} width={26} height={16} fill="#FFF6D8" />
          </g>
        </g>
      ))}
    </g>
  ),
});

// ---------- S13: the man in the grey suit rings the doorbell ----------
export const S13 = scene({
  Set: Dusk, cam: [[OUR_DOOR - 60, 520, 1.8], [OUR_DOOR - 60, 520, 1.88]], setT: 200,
  draw: (t) => fig(SUIT, t, { x: OUR_DOOR - 200, y: standY(), yaw: 0.6, look: 0.6, armR: { a: kf(t, [[10, 20], [22, 90]]), b: -10 }, handR: 'point' }, [[0, 'neutral']], 3),
});

// ---------- S13b: two bills held up, the same number ----------
export const S13b = propCU({
  Bg: Dusk,
  draw: (t) => (
    <g>
      <Bill x={760} y={kf(t, [[0, 700], [12, 520]])} s={1.0} rot={-6} hiSerial={clamp((t - 20) / 6)} />
      <Bill x={1180} y={kf(t, [[0, 700], [12, 540]])} s={1.0} rot={5} hiSerial={clamp((t - 20) / 6)} />
      <ellipse cx={560} cy={kf(t, [[0, 780], [12, 600]])} rx={50} ry={66} fill="#1A1620" />
      <ellipse cx={1390} cy={kf(t, [[0, 800], [12, 620]])} rx={50} ry={66} fill="#1A1620" />
    </g>
  ),
});

// ---------- S14: "These are very good. Too good." ----------
export const S14 = talkShot({
  Set: Dusk, words, setT: 400,
  cast: [
    { look: SUIT, x: OUR_DOOR - 260, y: standY(), yaw: 0.5, talk: [span(words, 'These', 'good'), span(words, 'Too', 'it')], faces: [[0, 'smug']] },
    { look: YOU, x: OUR_DOOR - 20, y: standY(), yaw: -0.5, faces: [[0, 'worried']] },
  ],
  cam: { from: [OUR_DOOR - 140, 520, 1.7], to: [OUR_DOOR - 140, 520, 1.8] },
});

// ---------- S15: a van with a satellite dish parks across the road ----------
export const S15 = scene({
  Set: Dusk, cam: [[960, 600, 1.0], [960, 600, 1.03]], setT: 600,
  draw: (t) => (
    <g>
      {fig(SUIT, t, { x: OUR_DOOR - 200, y: standY(), yaw: 0.3 }, [[0, 'neutral']], 3)}
      {fig(AGENT, t, { x: 420, y: standY(), yaw: 0.3 }, [[0, 'neutral']], 5)}
      <SatVan x={kf(t, [[0, 2400], [60, 1300]])} y={ROAD + 230} s={0.8} />
    </g>
  ),
});

// ---------- S16: Mo: why is there a helicopter over your house? ----------
export const S16 = msgCU({ Bg: Dusk, bubbles: [{ at: 6, text: ['Dude.'], big: true }, { at: 22, text: ['Why is there a', 'helicopter over', 'your house??'] }] });

// ---------- S17: the helicopter, its beam on the house ----------
const Night: SetC = ({ t, id }) => <Suburb t={t} id={id} tod="night" cars={false} windowsLit={0.8} />;
export const S17 = scene({
  Set: Night, cam: [[960, 520, 1.0], [960, 500, 1.04]],
  draw: (t) => <Helicopter x={kf(t, [[0, 600], [94, 900]])} y={150} s={0.9} t={t} beam={1} />,
});

// ---------- S18: he looks past you, at the controller on the kitchen table ----------
const K = stand(KITCHEN, 0.5, 0.7);
export const S18 = scene({
  Set: KitSet, cam: [[K.x, 620, 1.6], [K.x, 640, 2.4]],
  draw: (t) => (
    <g>
      <rect x={K.x - 200} y={K.y + 40} width={400} height={20} fill="#8A6A52" />
      <path d={`M ${K.x - 180} ${K.y + 60} V ${K.y + 200} M ${K.x + 180} ${K.y + 60} V ${K.y + 200}`} stroke="#5A4030" strokeWidth={14} />
      <Controller x={K.x} y={K.y + 30} s={0.25} glow={0.5 + 0.3 * Math.sin(t / 6)} />
    </g>
  ),
});
