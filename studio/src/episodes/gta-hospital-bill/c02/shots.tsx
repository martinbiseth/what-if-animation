import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, FONT, MONEY, TitleCard, Schematic, SCH, Bedroom, BedDuvet, bedSit, Stairwell, SW, stepTop,
  hipGround, shake, idleBlink, LEG_LEN, fmtMoney, stand, KITCHEN, KitchenIsland,
} from '../../../engine';
import words from './words.json';
import timeline from './timeline.json';
import { GameScreen, Controller } from '../borrowed';
import { Bill } from '../kit';
import {
  YOU, MUM, NURSE, respawn, billPhone, billCU, faceCU, talkShot, HospSet, KitchenSet, cueIn, Soft, phoneCU, tumble, HHIP, people,
} from '../common';

// Chapter 2, the premise and its rules: Saturday morning after a night of gaming, a trip on the stairs, grey, and
// you're outside City General in your pyjamas. The first bill. You test it; the title; the three rules (the third
// one, "only you pay", breaks in chapter 6); the total by ten in the morning, and the eleven dollars you have.

const W = words as { w: string; s: number; e: number; p: string }[];
const TL = timeline as { segments: { shot: string; a: number; t0: number }[] };
const cue = (shot: string, w: string, nth = 1, d = 10) => cueIn(TL, W, shot, w, nth, d);
const HOSP = HospSet();
const KITCH = KitchenSet(0.3);
const DUSK = HospSet({ tod: 'dusk', lights: 1 });

// ---------- S1: Saturday morning: asleep at the foot of the bed, controller in hand, the game still on ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.3);
  const me: Pose = { ...basePose, x: sit.x, y: sit.y, scale: sit.scale, yaw: -0.4, tilt: -18, headTilt: -20, expr: 'tired', blink: 1, armL: { a: 40, b: -90 }, armR: { a: 40, b: -90 } };
  return (
    <g transform={camT(sit.x + 150, sit.y - 60, kf(t, [[0, 2.0], [len, 2.15]]))}>
      <Bedroom t={t} id="b2" veil={0.2} clock="09:40" lamp={0} duvet={false} />
      <Hero look={YOU} pose={me} />
      <BedDuvet knees={1} />
      <Controller x={sit.x - 40} y={sit.y - 40} s={0.5} rot={-20} />
      <GameScreen x={sit.x + 260} y={sit.y - 260} w={260} h={160} t={t} on={1} />
    </g>
  );
};

// ---------- S2: the stairs: one step, a sock, gone ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp((t - 8) / 22);
  const x = SW.x0 - 60 + k * 700;
  const fall = k > 0;
  const me: Pose = fall
    ? tumble(x, stepTop(x) - LEG_LEN - 40 - Math.sin(k * Math.PI) * 60, k * 400, { scale: 0.9 })
    : { ...basePose, x: SW.x0 - 60 + t * 2, y: hipGround(SW.x0 - 60) - 4, scale: 0.9, yaw: 0.6, expr: 'tired', armL: { a: 15, b: -10 }, armR: { a: 15, b: -10 } };
  const sh = shake(t, 30, 10, 16);
  return (
    <g transform={`translate(${sh.x} ${sh.y}) ${camT(900, 600, kf(t, [[0, 1.1], [len, 1.2]]))}`}>
      <Stairwell t={t} id="st" />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S3: grey: at the bottom of the stairs ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const x = SW.x0 + SW.w * SW.n + 120;
  return (
    <g transform={camT(x, 820, kf(t, [[0, 1.6], [len, 1.8]]))}>
      <Stairwell t={t + 40} id="st3" />
      <Hero look={YOU} pose={tumble(x, SW.top + SW.h * SW.n - 50, 90, { expr: 'dizzy', blink: 1, scale: 0.9 })} />
    </g>
  );
};

// ---------- S4: City General, in your pyjamas ----------
export const S4 = respawn({ appear: 3, faces: [[0, 'shock'], [24, 'oops']] });

// ---------- S5: a nurse stares at you ----------
export const S5 = talkShot({
  Set: HOSP, words: W,
  cast: [
    { look: NURSE, x: 1080, y: HHIP, yaw: 0.5, faces: [[0, 'shock']] },
    { look: YOU, x: 1440, y: HHIP, yaw: -0.5, faces: [[0, 'oops'], [30, 'happy']] },
  ],
  cam: { from: [1260, 560, 1.75], to: [1260, 560, 1.88] },
});

// ---------- S6: the first bill ----------
export const S6 = billPhone({ v: 2909, time: '9:52', label: 'City General: fall, stairs' });

// ---------- S7: on purpose this time: a few more things ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const k = (t % 30) / 30;
  const x = SW.x0 + 40 + k * 640;
  return (
    <g transform={camT(900, 600, 1.1)}>
      <Stairwell t={t + 80} id="st7" />
      <Hero look={YOU} pose={{ ...tumble(x, stepTop(x) - LEG_LEN - 60 - Math.sin(k * Math.PI) * 90, k * 360 + 180, { scale: 0.9 }), expr: 'happy' }} />
    </g>
  );
};

// ---------- S8: the title ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1200, 560, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <Soft blur={10} dim={0.35}>
        <DUSK t={t + 200} id="ti" />
      </Soft>
    </g>
    <TitleCard t={t} lines={['WHAT IF YOU GOT THE HOSPITAL BILL', 'IN REAL LIFE?']} accent={MONEY.red} accentT={30} y={420} size={118} />
  </g>
);

/** A rule on the schematic: "RULE 1", the rule, and a sub-line. */
const rule = (n: number, text: string, sub?: string, color = '#F6EFE3'): React.FC<ShotProps> => {
  const R: React.FC<ShotProps> = ({ t }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    return (
      <g>
        <Schematic t={t} id={`r${n}`} />
        <g transform={`translate(960 380) scale(${pop(0)})`}>
          <rect x={-150} y={-60} width={300} height={84} rx={42} fill={MONEY.red} />
          <text y={2} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#FFFFFF">RULE {n}</text>
        </g>
        <g transform={`translate(960 560) scale(${pop(4)})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={text.length > 20 ? 96 : 120} fill={color} stroke="#0B0816" strokeWidth={10} paintOrder="stroke">{text}</text>
        </g>
        {sub ? <text x={960} y={680} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={SCH.dim} opacity={clamp((t - 14) / 8)}>{sub}</text> : null}
      </g>
    );
  };
  return R;
};

// ---------- S9: rule one ----------
export const S9 = rule(1, "YOU CAN'T DIE");
// ---------- S10: back at the doors, healed ----------
export const S10 = respawn({ appear: 2, faces: [[0, 'cool']], zoom: [1.4, 1.5] });
// ---------- S11: rule two ----------
export const S11 = rule(2, 'THE BILL IS REAL', 'real American hospital prices', MONEY.red);
// ---------- S12: every line is the real price ----------
export const S12 = billCU({
  lines: [
    { label: 'Ambulance', v: 1200, at: 2 },
    { label: 'Emergency room', v: 2909, at: 10 },
    { label: 'CT scan', v: 3150, at: 18 },
    { label: 'Orthopedic surgery', v: 24800, at: 26, hot: true },
    { label: 'Two nights, ward', v: 6594, at: 34 },
  ],
  s: 0.95,
});

// ---------- S13: a broken leg gets billed like a broken leg: the x-ray, the crack healing in a blink ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const heal = clamp((t - cue('S13', 'heals', 1, 50)) / 8);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0C1420" />
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-960 -540)`}>
        <rect x={560} y={140} width={800} height={800} rx={20} fill="#16222E" stroke="#3A5A6A" strokeWidth={6} />
        <path d="M 900 200 Q 880 540 910 900 M 1010 200 Q 1030 540 1000 900" stroke="#C8DCE8" strokeWidth={44} strokeLinecap="round" fill="none" opacity={0.85} />
        <path d="M 860 520 L 960 560 L 900 600 L 1060 640" stroke="#FF4A4A" strokeWidth={12} fill="none" opacity={1 - heal} />
        {heal > 0 ? <circle cx={960} cy={580} r={60 + heal * 200} fill="none" stroke="#4BE38A" strokeWidth={10 * (1 - heal)} /> : null}
        <text x={600} y={200} fontFamily={FONT.ui} fontSize={30} fill="#8AB4C8">L. TIBIA · FRACTURE</text>
        <text x={1320} y={910} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill={heal > 0.5 ? '#4BE38A' : '#FF4A4A'}>{heal > 0.5 ? 'HEALED' : 'BILLED'}</text>
      </g>
    </g>
  );
};

// ---------- S14: rule three ----------
export const S14 = rule(3, 'ONLY YOU PAY', 'nobody else pays a cent');
const MU = stand(KITCHEN, 0.32, 0.4), ME = stand(KITCHEN, 0.68, 0.4);
// ---------- S15: Mum at the kitchen table with her coffee, no idea ----------
export const S15 = talkShot({
  Set: KITCH, words: W,
  cast: [
    { look: MUM, ...MU, yaw: 0.6, faces: [[0, 'happy']], pose: { armR: { a: 60, b: -100 } } },
    { look: YOU, ...ME, yaw: -0.4, faces: [[0, 'smug']] },
  ],
  cam: { from: [960, 560, 1.3], to: [960, 560, 1.4] },
  front: () => <KitchenIsland />,
});

// ---------- S16: ten in the morning: the number at the top of your phone ----------
export const S16 = phoneCU({ mode: 'bank', Bg: KITCH, time: '10:00', text: `-${fmtMoney(63320)}|City General: amount due`, push: 0.08 });
// ---------- S17: your bank account: eleven dollars ----------
export const S17 = phoneCU({ mode: 'bank', Bg: KITCH, time: '10:00', from: 'left', text: '$11.00|Current account', push: 0.08 });
// ---------- S18: and it's only Saturday ----------
export const S18 = faceCU({ look: YOU, Bg: KITCH, faces: [[0, 'worried'], [20, 'oops']], yaw: -0.25, zoom: [3.1, 3.35] });
