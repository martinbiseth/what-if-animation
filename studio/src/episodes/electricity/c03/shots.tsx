import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, talkShot, factCard, faceAt, talkAt, LEG_LEN,
} from '../../../engine';
import { YOU, MOM, ELLIE, MO, NEIGHBOR, faceCU, bigWord, wordF, span, Soft, handAt, DarkBg } from '../common';
import {
  StreetModern, streetHip, STREETM, LivingRoom, LIVING, sofaSit, Candle, BoardGame, Barbecue, IceCream, Bike, Car, RoofNight, roofHip, ROOF, MilkyWay,
} from '../sets';
import words from './words.json';

// Chapter 3, the fun part: no school, candles and a board game (Ellie cheats), the street eats its freezers, Mo on his
// bike, kids on the empty highway, free ice cream, rice on a fire pit, the quiet, the Milky Way for everyone, and Mo
// on the roof: "the best week ever". Then: tomorrow, the water stops.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (cue: string, w: string, n = 1, cn = 1) => at(w, n) - at(cue, cn);
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" power={0} />;
const DUSK: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="dusk" power={0} />;
const CANDLES = [LIVING.P(0.42, 0.86, 0.56), LIVING.P(0.58, 0.86, 0.6), LIVING.P(0.2, 0.28, 0.07)];
const CANDLELR: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={0} candles={CANDLES} veil={0.62} />;
const MO_DAD = { ...NEIGHBOR, jacket: '#8A3A3A', jacketShade: '#702E2E', hat: undefined };

/** Someone walking: a pose at x with the legs and arms swinging on phase ph. */
const walk = (x: number, y: number, s: number, ph: number, o: Partial<Pose> = {}): Pose => {
  const sw = Math.sin(ph);
  return {
    ...basePose, x, y: y - Math.abs(Math.cos(ph)) * 5 * s, scale: s, yaw: 0.7, facing: 1,
    legL: { a: 22 * sw, b: -10 }, legR: { a: -22 * sw, b: -10 }, armL: { a: -16 * sw, b: -10 }, armR: { a: 16 * sw, b: -10 }, ...o,
  };
};
/** Someone riding a bike: hips on the saddle, hands on the bars, legs pedalling. */
const ride = (x: number, groundY: number, s: number, ph: number, o: Partial<Pose> = {}): Pose => ({
  ...basePose, x: x - 20 * s, y: groundY - 176 * s, scale: s * 0.9, yaw: 0.7, facing: 1, tilt: 14,
  legL: { a: 40 + 30 * Math.sin(ph), b: -60 - 20 * Math.cos(ph) }, legR: { a: 40 - 30 * Math.sin(ph), b: -60 + 20 * Math.cos(ph) },
  armL: { a: 70, b: -20 }, armR: { a: 66, b: -18 }, ...o,
});

// ---------- S1: DAY ONE: NO SCHOOL? over the sunny street ----------
export const S1 = bigWord({ kicker: 'DAY ONE', word: 'NO SCHOOL?', color: '#FFD23A', Bg: DAY, size: 200 });

// ---------- S2: close, you on the front step in the sun, shrugging, grinning ----------
export const S2 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'neutral'], [16, 'happy']], yaw: 0.25, zoom: [3, 3.2], pose: { armL: { a: 40, b: 100 }, armR: { a: 40, b: 100 } } });

// ---------- S3: the living room, mum lighting candle after candle ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(3, Math.floor(t / 14) + 1);
  const m: Pose = { ...basePose, x: 900, y: 860 - LEG_LEN * 1.0, scale: 1.0, yaw: 0.4, expr: 'neutral', armR: { a: 60, b: 40 }, blink: idleBlink(t, 2), look: 0.6, tilt: 8 };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 600, 1.45)}>
      <LivingRoom t={t + 200} power={0} candles={CANDLES.slice(0, n)} veil={0.7} />
      <Hero look={MOM} pose={m} />
      <Candle x={handAt(m).x + 10} y={handAt(m).y} s={0.35} t={t} seed={7} glow={0.6} />
    </g>
  );
};

// ---------- S4: Ellie drags the old board game out of the closet, beaming ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeOut(clamp(t / 14));
  const e: Pose = { ...basePose, x: 1000, y: 860 - LEG_LEN * 0.7, scale: 0.7, yaw: -0.2, expr: t > 10 ? 'happy' : 'neutral', armL: { a: 170 * up, b: 0 }, armR: { a: 170 * up, b: 0 }, blink: idleBlink(t, 5), squash: t > 14 && t < 18 ? 0.08 : 0 };
  const hb = handAt(e, 'L'), hb2 = handAt(e, 'R');
  const box = { x: (hb.x + hb2.x) / 2, y: (hb.y + hb2.y) / 2 - 70 };
  return (
    <g transform={camT(980, 560, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <CANDLELR t={t + 300} />
      <Hero look={ELLIE} pose={e} />
      <g transform={`translate(${box.x} ${box.y}) rotate(${Math.sin(t / 6) * 3})`}>
        <rect x={-130} y={-70} width={260} height={110} rx={8} fill="#C84A3A" stroke="#100E16" strokeWidth={6} />
        <rect x={-110} y={-56} width={220} height={40} fill="#FFD23A" />
        <text x={0} y={-26} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#100E16">BOARD GAME</text>
        <path d="M -130 40 L 130 40" stroke="#100E16" strokeWidth={4} />
      </g>
    </g>
  );
};

// ---------- S5: the board on the table by candlelight, three hands moving pieces ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={10} dim={0.35}>
      <g transform={camT(960, 640, 1.8)}>
        <CANDLELR t={t + 400} />
      </g>
    </Soft>
    <g transform={`translate(960 600) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-960 -600)`}>
      <ellipse cx={960} cy={700} rx={700} ry={180} fill="#5A4038" />
      <BoardGame x={960} y={700} s={2.4} t={t} />
      <Candle x={1500} y={700} s={1.4} t={t} />
      <path d={`M 0 ${700 + Math.sin(t / 8) * 10} Q 300 640 ${560 + Math.sin(t / 8) * 20} ${660}`} stroke="#F07A2A" strokeWidth={70} strokeLinecap="round" fill="none" />
      <ellipse cx={600 + Math.sin(t / 8) * 20} cy={660} rx={50} ry={40} fill="#26232F" stroke="#100E16" strokeWidth={6} />
      <path d={`M 1920 ${780} Q 1600 760 ${1300 - Math.sin(t / 7) * 30} ${740}`} stroke="#3E8C86" strokeWidth={50} strokeLinecap="round" fill="none" />
      <ellipse cx={1290 - Math.sin(t / 7) * 30} cy={740} rx={38} ry={30} fill="#26232F" stroke="#100E16" strokeWidth={6} />
    </g>
  </g>
);

// ---------- S6: Ellie, smug, a piece hidden in her fist: she cheats every time ----------
export const S6 = faceCU({ look: ELLIE, Bg: CANDLELR, faces: [[0, 'happy'], [14, 'smug']], yaw: 0.3, zoom: [3.6, 3.9], light: { x: 1150, y: 640, o: 0.8 }, pose: { armR: { a: 70, b: 70 } } });

// ---------- S7: day two, wide: the whole street in the road with barbecues, smoke going up ----------
export const S7 = talkShot({
  Set: DAY, setT: 500,
  cast: [
    { look: NEIGHBOR, x: 420, y: streetHip(0.8), scale: 0.8, yaw: 0.4, faces: [[0, 'happy']] },
    { look: MOM, x: 900, y: streetHip(0.82), scale: 0.82, yaw: -0.3, faces: [[0, 'happy']] },
    { look: MO_DAD, x: 1260, y: streetHip(0.84), scale: 0.84, yaw: -0.4, faces: [[0, 'happy']] },
    { look: ELLIE, x: 1040, y: streetHip(0.58), scale: 0.58, yaw: -0.2, faces: [[0, 'happy']] },
    { look: { ...MOM, jacket: '#4A6A8A', jacketShade: '#3A5470' }, x: 1560, y: streetHip(0.8), scale: 0.8, yaw: -0.5, faces: [[0, 'happy']] },
  ],
  cam: { from: [960, 560, 1.05], to: [1000, 560, 1.12] },
  front: (t) => (
    <g>
      <Barbecue x={600} y={STREETM.kerb + 120} s={1} t={t} />
      <Barbecue x={1420} y={STREETM.kerb + 140} s={1.05} t={t + 40} />
      <rect x={760} y={STREETM.kerb + 50} width={380} height={20} fill="#C8B08A" stroke="#100E16" strokeWidth={5} />
      <path d={`M 790 ${STREETM.kerb + 70} L 790 ${STREETM.kerb + 160} M 1110 ${STREETM.kerb + 70} L 1110 ${STREETM.kerb + 160}`} stroke="#5A4A3A" strokeWidth={10} />
      <IceCream x={860} y={STREETM.kerb + 52} s={0.5} open />
      <IceCream x={960} y={STREETM.kerb + 52} s={0.5} open color="#C88A5A" />
    </g>
  ),
});

// ---------- S8: insert, steak on the grill for breakfast, sizzling ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.2}>
      <g transform={camT(960, 560, 1.6)}>
        <DAY t={t + 600} />
      </g>
    </Soft>
    <g transform={`translate(960 760) scale(${kf(t, [[0, 3.2], [len, 3.4]])})`}>
      <Barbecue x={0} y={110} s={1} t={t} />
    </g>
    <text x={1180} y={240} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFFFFF" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" transform="rotate(6 1180 240)" opacity={clamp(t / 6)}>STEAK FOR BREAKFAST</text>
  </g>
);

// ---------- S9: you, eating ice cream straight from the tub, delighted ----------
export const S9 = faceCU({
  look: YOU, Bg: DAY, faces: [[0, 'happy']], yaw: -0.25, zoom: [2.8, 3],
  pose: { armL: { a: 30, b: 120 }, armR: { a: 30, b: 120 } },
  extra: (t) => <IceCream x={960} y={760} s={1} open melt={clamp(t / 40)} />,
});

// ---------- S10: a lone box of fish fingers on the table: nobody wants them ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.25}>
      <g transform={camT(960, 560, 1.6)}>
        <DAY t={t + 700} />
      </g>
    </Soft>
    <g transform={`translate(960 620) scale(${kf(t, [[0, 1], [len, 1.1]])}) rotate(-4)`}>
      <rect x={-500} y={140} width={1000} height={400} fill="#C8B08A" stroke="#100E16" strokeWidth={8} />
      <rect x={-200} y={-40} width={400} height={190} rx={10} fill="#3A7AC8" stroke="#100E16" strokeWidth={8} />
      <text x={0} y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#FFFFFF">FISH</text>
      <text x={0} y={90} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill="#FFD23A">FINGERS</text>
      {[0, 1, 2].map((k) => (
        <rect key={k} x={-150 + k * 100} y={110} width={80} height={24} rx={8} fill="#E8A84A" stroke="#100E16" strokeWidth={4} />
      ))}
    </g>
    {[0, 1].map((k) => (
      <path key={k} d={`M ${1300 + k * 60} ${400 - ((t * 1.5 + k * 30) % 60)} l 20 0`} stroke="#3A3A4A" strokeWidth={6} opacity={0.6} />
    ))}
  </g>
);

// ---------- S11: Mo rides in on his bike from the left, skids to a stop beside you, grinning ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const stopF = 30;
  const x = t < stopF ? kf(t, [[0, -200], [stopF, 820]], easeOut) : 820;
  const ph = t < stopF ? t * 0.5 : stopF * 0.5;
  const s = 0.82;
  const gy = STREETM.kerb + 60;
  const mo = ride(x, gy, s, ph, { expr: 'happy', blink: idleBlink(t, 3) });
  const me: Pose = { ...basePose, x: 1220, y: gy - LEG_LEN * 0.8, scale: 0.8, yaw: -0.4, expr: t > stopF ? 'happy' : 'neutral', blink: idleBlink(t, 6), armR: { a: t > stopF ? 150 : 10, b: 10 } };
  return (
    <g transform={camT(kf(t, [[0, 760], [len, 960]]), 560, 1.35)}>
      <DAY t={t + 800} />
      <Hero look={YOU} pose={me} />
      <Bike x={x} y={gy} s={s} spin={ph * 20} color="#E8252A" />
      <Hero look={MO} pose={mo} />
    </g>
  );
};

// ---------- S12: the highway: cars stopped where they died; kids ride bikes down the middle lanes ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const kids = [0, 1, 2];
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 560, 1.05)}>
      <StreetModern t={t + 900} mode="day" power={0} car={false} />
      {/* stalled cars, nose to tail, doors open on one */}
      {[-60, 520, 1140, 1760].map((cx, i) => (
        <Car key={i} x={cx} y={STREETM.kerb + 110} s={0.85} color={['#C84A3A', '#3E6E9A', '#E8C84A', '#5A8A5A'][i]} />
      ))}
      {[-200, 380, 1000, 1600].map((cx, i) => (
        <Car key={`b${i}`} x={cx} y={STREETM.kerb + 230} s={0.95} color={['#8A5A9A', '#D8D0C8', '#2E4A6A', '#C86A3A'][i]} flip />
      ))}
      {kids.map((k) => {
        const x = ((t * 6 + k * 520) % 2600) - 300;
        const gy = STREETM.kerb + 170 + k * 6;
        const ph = t * 0.5 + k;
        return (
          <g key={k}>
            <Bike x={x} y={gy} s={0.62} spin={ph * 20} color={['#3A8AE0', '#FFD23A', '#2E9A5A'][k]} />
            <Hero look={[ELLIE, MO, YOU][k]} pose={ride(x, gy, 0.62, ph, { expr: 'happy' })} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- S13: the supermarket doors wide open; the manager hands out melting tubs of ice cream for free ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const gy = 900;
  const mgr: Pose = { ...basePose, x: 1080, y: gy - LEG_LEN * 1.1, scale: 1.1, yaw: -0.4, expr: 'happy', armL: { a: 60, b: 50 }, armR: { a: 70, b: 40 }, blink: idleBlink(t, 2) };
  const me: Pose = { ...basePose, x: 620, y: gy - LEG_LEN * 1.0, scale: 1.0, yaw: 0.5, expr: 'happy', armR: { a: 60, b: 30 }, blink: idleBlink(t, 4) };
  const mo: Pose = { ...basePose, x: 420, y: gy - LEG_LEN * 1.02, scale: 1.02, yaw: 0.5, expr: 'happy', blink: idleBlink(t, 7) };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 920]]), 540, kf(t, [[0, 1.1], [len, 1.16]]))}>
      <rect x={-400} y={-400} width={2800} height={1300} fill="#9AC8E8" />
      <rect x={-200} y={140} width={2300} height={760} fill="#D8D0C8" stroke="#100E16" strokeWidth={8} />
      <rect x={-200} y={140} width={2300} height={150} fill="#2E9A5A" stroke="#100E16" strokeWidth={8} />
      <text x={960} y={250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFFFFF">SUPERMARKET</text>
      {/* the doors, slid wide open; dark inside */}
      <rect x={760} y={420} width={560} height={480} fill="#1A1A26" stroke="#100E16" strokeWidth={8} />
      <rect x={560} y={420} width={190} height={480} fill="#A8C8E0" stroke="#100E16" strokeWidth={6} opacity={0.7} />
      <rect x={1330} y={420} width={190} height={480} fill="#A8C8E0" stroke="#100E16" strokeWidth={6} opacity={0.7} />
      {[0, 1, 2, 3].map((k) => (
        <rect key={k} x={800 + k * 130} y={520} width={100} height={380} fill="#2A2A36" />
      ))}
      <rect x={-400} y={gy} width={2800} height={400} fill="#8A8690" />
      <rect x={1240} y={gy - 140} width={300} height={140} fill="#8A5A3A" stroke="#100E16" strokeWidth={6} />
      {[0, 1, 2, 3].map((k) => (
        <IceCream key={k} x={1290 + k * 70} y={gy - 140} s={0.6} open color={['#F6B8C8', '#C88A5A', '#F2E6CC', '#9AD8A8'][k]} melt={0.6} />
      ))}
      <rect x={1600} y={300} width={260} height={110} fill="#FFD23A" stroke="#100E16" strokeWidth={6} transform="rotate(6 1730 355)" />
      <text x={1730} y={378} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#E8252A" transform="rotate(6 1730 355)">FREE</text>
      <Hero look={NEIGHBOR} pose={mgr} />
      <IceCream x={handAt(mgr, 'L').x} y={handAt(mgr, 'L').y + 30} s={0.55} open melt={0.4} />
      <Hero look={MO} pose={mo} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S14: six tubs stacked in Mo's bike basket ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(6, Math.floor(t / 4) + 1);
  return (
    <g>
      <Soft blur={16} dim={0.2}>
        <g transform={camT(960, 560, 1.4)}>
          <DAY t={t + 1000} />
        </g>
      </Soft>
      <g transform={`translate(960 600) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-960 -600)`}>
        <path d="M 560 560 L 1360 560 L 1300 900 L 620 900 Z" fill="#8A6A3A" stroke="#100E16" strokeWidth={8} />
        {Array.from({ length: 8 }).map((_, k) => (
          <path key={k} d={`M ${600 + k * 100} 560 L ${630 + k * 90} 900`} stroke="#6A4A2A" strokeWidth={6} />
        ))}
        {Array.from({ length: n }).map((_, k) => {
          const pop = backOut(clamp((t - k * 4) / 6));
          return (
            <g key={k} transform={`translate(${700 + (k % 3) * 260} ${k < 3 ? 640 : 470}) scale(${1.6 * pop})`}>
              <IceCream x={0} y={0} s={1} color={['#F6B8C8', '#C88A5A', '#F2E6CC'][k % 3]} />
            </g>
          );
        })}
      </g>
      <text x={1560} y={260} fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FFFFFF" stroke="#0B0816" strokeWidth={14} paintOrder="stroke" transform="rotate(-8 1560 260)">x{n}</text>
    </g>
  );
};

// ---------- S15: dusk, Mo's backyard: his dad over a fire pit, a pot hanging over the flames ----------
const FirePit: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={-80} r={420} o={0.9} />
    <ellipse cx={0} cy={0} rx={150} ry={36} fill="#3A3442" stroke="#100E16" strokeWidth={6} />
    {[-60, 0, 60].map((fx, i) => {
      const h = 120 + 30 * Math.sin(t / 3 + i * 2);
      return <path key={i} d={`M ${fx - 40} -10 Q ${fx - 30} ${-h * 0.6} ${fx + Math.sin(t / 4 + i) * 10} ${-h} Q ${fx + 30} ${-h * 0.6} ${fx + 40} -10 Z`} fill={i === 1 ? '#FFD23A' : '#FF8A2A'} />;
    })}
    <path d="M -180 -260 L -180 20 M 180 -260 L 180 20 M -200 -250 L 200 -250" stroke="#2A2026" strokeWidth={12} />
    <path d="M 0 -250 L 0 -200" stroke="#2A2026" strokeWidth={6} />
    <path d="M -80 -200 L 80 -200 L 66 -120 Q 0 -100 -66 -120 Z" fill="#2A2832" stroke="#100E16" strokeWidth={6} />
    {[0, 1].map((k) => <circle key={k} cx={Math.sin(t / 8 + k) * 20} cy={-230 - ((t * 1.2 + k * 40) % 80)} r={20 + ((t * 1.2 + k * 40) % 80) * 0.4} fill="#E8E0E8" opacity={0.3 * (1 - ((t * 1.2 + k * 40) % 80) / 80)} />)}
  </g>
);
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const dad: Pose = { ...basePose, x: 1140, y: streetHip(0.95), scale: 0.95, yaw: -0.5, expr: 'happy', armL: { a: 70, b: 30 }, blink: idleBlink(t, 3) };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 560, 1.35)}>
      <DUSK t={t + 1100} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#1A0A20" opacity={0.25} />
      <Hero look={MO_DAD} pose={dad} />
      <FirePit x={900} y={STREETM.kerb + 60} s={0.9} t={t} />
      <Hero look={MO} pose={{ ...basePose, x: 640, y: streetHip(0.82), scale: 0.82, yaw: 0.4, expr: 'happy', blink: idleBlink(t, 5) }} />
    </g>
  );
};

// ---------- S16: insert, the pot: rice, black at the bottom, smoking ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <DarkBg t={t} />
    <Glow x={960} y={900} r={700} o={0.8} />
    <g transform={`translate(960 600) scale(${kf(t, [[0, 2.2], [len, 2.35]])})`}>
      <ellipse cx={0} cy={-60} rx={170} ry={44} fill="#F6EFE3" stroke="#100E16" strokeWidth={6} />
      {Array.from({ length: 30 }).map((_, i) => (
        <ellipse key={i} cx={-140 + (i * 37) % 280} cy={-64 + ((i * 13) % 30) - 15} rx={9} ry={5} fill={i % 4 === 0 ? '#2A2020' : '#E8E0D0'} />
      ))}
      <path d="M -170 -60 L -150 60 Q 0 90 150 60 L 170 -60" fill="#2A2832" stroke="#100E16" strokeWidth={6} />
      {[0, 1, 2].map((k) => <circle key={k} cx={Math.sin(t / 6 + k) * 40 - 40 + k * 40} cy={-120 - ((t * 1.5 + k * 25) % 70)} r={18 + ((t * 1.5 + k * 25) % 70) * 0.3} fill="#4A4450" opacity={0.5 * (1 - ((t * 1.5 + k * 25) % 70) / 70)} />)}
    </g>
    <text x={1400} y={260} fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFFFFF" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" transform="rotate(8 1400 260)" opacity={clamp((t - 8) / 6)}>BURNT.</text>
  </g>
);

// ---------- S17: everyone round the fire eating out of bowls, happy anyway ----------
export const S17 = talkShot({
  Set: DUSK, setT: 1200,
  cast: [
    { look: YOU, x: 720, y: streetHip(0.82), scale: 0.82, yaw: 0.4, faces: [[0, 'happy']], pose: { armL: { a: 40, b: 100 }, armR: { a: 40, b: 100 } } },
    { look: MO, x: 860, y: streetHip(0.82), scale: 0.82, yaw: 0.2, faces: [[0, 'happy']], pose: { armL: { a: 40, b: 100 }, armR: { a: 40, b: 100 } } },
    { look: ELLIE, x: 1000, y: streetHip(0.58), scale: 0.58, yaw: -0.1, faces: [[0, 'happy']], pose: { armL: { a: 40, b: 100 }, armR: { a: 40, b: 100 } } },
    { look: MOM, x: 1140, y: streetHip(0.84), scale: 0.84, yaw: -0.3, faces: [[0, 'happy']] },
    { look: MO_DAD, x: 1290, y: streetHip(0.88), scale: 0.88, yaw: -0.4, faces: [[0, 'happy']] },
  ],
  cam: { from: [1000, 600, 1.4], to: [1000, 600, 1.5] },
  front: (t) => (
    <g>
      <Glow x={1000} y={STREETM.kerb} r={600} o={0.7} />
      <FirePit x={1000} y={STREETM.kerb + 140} s={0.7} t={t} />
    </g>
  ),
});

// ---------- S18: the quiet street at noon: no cars moving, birds on the dead wires ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 960]]), kf(t, [[0, 420], [len, 380]]), kf(t, [[0, 1.4], [len, 1.5]]))}>
    <DAY t={t + 1300} />
    {Array.from({ length: 9 }).map((_, i) => {
      const x = 380 + i * 64 + (i > 4 ? 420 : 0);
      const y = STREETM.feet - 560 + Math.pow((x - 330) / 530 - 1, 2) * -60 + 40;
      const hop = i === 3 && t % 40 < 6 ? -10 : 0;
      return (
        <g key={i} transform={`translate(${x} ${y + hop})`}>
          <ellipse cx={0} cy={-14} rx={16} ry={12} fill="#2A2632" />
          <circle cx={10} cy={-26} r={8} fill="#2A2632" />
          <path d="M 16 -26 L 24 -24 L 16 -22 Z" fill="#E8A84A" />
          <path d="M -14 -12 L -26 -6" stroke="#2A2632" strokeWidth={5} />
        </g>
      );
    })}
    {[0, 1, 2].map((k) => {
      const bx = ((t * 2.2 + k * 600) % 2400) - 200;
      const by = 160 + k * 50;
      const fl = Math.sin(t / 2.6 + k) * 7;
      return <path key={k} d={`M ${bx - 13} ${by + fl * 0.4} Q ${bx - 6} ${by - 6 + fl} ${bx} ${by} Q ${bx + 6} ${by - 6 + fl} ${bx + 13} ${by + fl * 0.4}`} stroke="#2A1A30" strokeWidth={3.5} fill="none" />;
    })}
  </g>
);

// ---------- S19: night: people on every roof, small silhouettes, all looking up ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 940], [len, 980]]), 600, kf(t, [[0, 1], [len, 1.05]]))}>
    <RoofNight t={t + 200} power={0} milky={1} />
    {[[560, 0.62], [700, 0.6], [1180, 0.64], [1320, 0.46], [1640, 0.62]].map(([x, s], i) => (
      <Hero key={i} look={[YOU, MOM, MO, ELLIE, NEIGHBOR][i]} pose={{ ...basePose, x, y: roofHip(s), scale: s, yaw: i % 2 ? -0.2 : 0.2, headTilt: -14, expr: 'happy', blink: 0, glint: 0.4, glintColor: '#CFE0FF' }} shadow={0} />
    ))}
  </g>
);

// ---------- S20: the fact: 80% of North Americans can't see the Milky Way ----------
export const S20 = factCard({ value: 80, suffix: '%', label: "OF NORTH AMERICANS CAN'T SEE THE MILKY WAY", sub: 'light pollution, Falchi et al., Science Advances 2016' });

// ---------- S21: tonight everyone sees it: the band across the sky over the dark city ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 520], [len, 440]]), kf(t, [[0, 1.05], [len, 1.12]]))}>
    <RoofNight t={t + 300} power={0} milky={1} />
    <MilkyWay x0={-200} y0={700} x1={2100} y1={-100} o={0.6} t={t} w={300} />
  </g>
);

// ---------- S22: you and Mo lying on the roof side by side, the last ice cream; Mo talks ----------
export const S22: React.FC<ShotProps> = ({ t, len, f }) => {
  const moLine = span(W, 'Honestly', 'ever');
  const open = talkAt(W, f, 30, [moLine]);
  const sitp = (x: number, yaw: number, o: Partial<Pose>): Pose => ({
    ...basePose, x, y: ROOF.feet - 30, scale: 1, yaw, facing: yaw > 0 ? 1 : -1, headTilt: -12,
    legL: { a: 70, b: -110 }, legR: { a: 64, b: -104 }, armL: { a: 14, b: -30 }, armR: { a: 14, b: -30 }, ...o,
  });
  const me = sitp(820, 0.35, { expr: 'happy', blink: idleBlink(t, 3), look: 0.2 });
  const mo = sitp(1080, -0.35, { expr: 'happy', blink: idleBlink(t, 6), talk: open, look: -0.3, armR: { a: 100, b: 60 } });
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 950]]), ROOF.feet - 260, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <RoofNight t={t + 400} power={0} milky={1} />
      <Hero look={YOU} pose={me} />
      <Hero look={MO} pose={mo} />
      <IceCream x={1220} y={ROOF.feet - 10} s={0.5} open melt={0.8} />
    </g>
  );
};

// ---------- S23: close, you: the smile goes; he's wrong ----------
export const S23 = faceCU({ look: YOU, Bg: ({ t, id }) => <RoofNight t={t} id={id} power={0} milky={1} />, faces: [[0, 'happy'], [10, 'worried']], yaw: -0.2, zoom: [3.3, 3.6], light: { x: 960, y: 300, kind: 'cool', o: 0.3 } });

// ---------- S24: the kitchen tap: a trickle, a drip, a last drop. Nothing. ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => {
  const flow = clamp(1 - t / 24);
  const drop = t > 24 ? ((t - 24) % 30) : -1;
  return (
    <g>
      <DarkBg t={t} />
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1.4], [len, 1.6]])}) translate(-960 -540)`}>
        <rect x={500} y={760} width={920} height={60} fill="#8A8EA0" stroke="#100E16" strokeWidth={8} />
        <path d="M 600 820 L 640 1000 L 1280 1000 L 1320 820" fill="#5A5E70" stroke="#100E16" strokeWidth={8} />
        <path d="M 760 760 L 760 420 Q 760 330 860 330 L 1020 330 Q 1080 330 1080 390 L 1080 440" stroke="#B8BCC8" strokeWidth={44} fill="none" strokeLinecap="round" />
        <rect x={720} y={500} width={80} height={60} rx={10} fill="#9A9EAA" stroke="#100E16" strokeWidth={6} />
        {flow > 0 ? <rect x={1080 - 10 * flow} y={460} width={20 * flow} height={300} fill="#6AB8E8" opacity={0.8} /> : null}
        {drop >= 0 && drop < 20 && t < 60 ? <ellipse cx={1080} cy={470 + drop * drop * 0.8} rx={8} ry={12} fill="#6AB8E8" /> : null}
      </g>
    </g>
  );
};

void faceAt; void Car; void walk; void sofaSit; void MilkyWay;
