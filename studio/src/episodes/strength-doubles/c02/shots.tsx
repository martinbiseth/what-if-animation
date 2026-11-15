import React from 'react';
import { Pose, ShotProps, Bedroom, BedDuvet, bedSit, BEDROOM, AlarmClock, Schematic, SCH, SchLabel, DrawOn, FONT } from '../../../engine';
import { listCard } from '../../internet-gone/common';
import {
  YOU, MO, Hero, basePose, camT, clamp, kf, lerp, easeOut, backOut, idleBlink, faceAt, Glow, POWER,
  StreetSet, propCU, faceCU, talkShot, ladderCard, thingCard, sdCard, at, HIP, XRay, Soft, liftKg,
} from '../common';

// Chapter 2, the premise and the rules: day one (the alarm clock in two pieces), how doubling works from one heavy
// suitcase to the Titanic, the rules, and the one planted for later: your bones stay normal. Then the title.

const STREET = StreetSet('day', { car: true });
const BedNoDuvet: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} veil={0.25} duvet={false} clock="06:00" lamp={0.4} />;

export const S1 = sdCard({ kicker: 'CHAPTER 2', title: 'THE RULES' });

// ---------- S2: in bed, the alarm goes; you slap it ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.2);
  const slap = clamp((t - 30) / 5);
  const face = faceAt(t, [[0, 'tired'], [36, 'shock']]);
  const me: Pose = { ...basePose, ...sit, yaw: 0.6, ...face, blink: t < 20 ? 1 : face.blink, armR: { a: lerp(20, 110, slap), b: lerp(-30, 10, slap) }, tilt: lerp(0, 8, slap) };
  return (
    <g transform={camT(800, 520, kf(t, [[0, 1.7], [len, 1.85]]))}>
      <BedNoDuvet t={t + 20} id="s2" />
      <Hero look={YOU} pose={me} />
      <BedDuvet knees={0.5} />
    </g>
  );
};

// ---------- S3: the alarm clock, in two pieces ----------
export const S3 = propCU({ Bg: BedNoDuvet, push: 0.06, draw: (t) => {
  const p = easeOut(clamp(t / 8));
  return (
    <g>
      <rect x={300} y={760} width={1320} height={60} fill="#5A3E2E" />
      <g transform={`translate(${880 - p * 70} 600) rotate(${-p * 14})`}>
        <svg x={-260} y={-200} width={260} height={400} viewBox="0 0 260 400" overflow="hidden"><g transform="translate(260 200)"><AlarmClock x={0} y={0} s={2.6} text="06:00" /></g></svg>
      </g>
      <g transform={`translate(${1040 + p * 70} 600) rotate(${p * 18})`}>
        <svg x={0} y={-200} width={260} height={400} viewBox="0 0 260 400" overflow="hidden"><g transform="translate(0 200)"><AlarmClock x={0} y={0} s={2.6} text="06:00" on={0} /></g></svg>
      </g>
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={960 + Math.cos(i * 1.3) * 200 * p} y={700 - Math.abs(Math.sin(i * 1.7)) * 150 * p + p * p * 60} width={14} height={8} fill="#26232F" />)}
    </g>
  );
} });

// ---------- S4: you, staring at your hand: day one ----------
export const S4 = faceCU({ look: YOU, Bg: BedNoDuvet, faces: [[0, 'shock'], [24, 'worried']], yaw: 0.3, zoom: [3.0, 3.25], pose: { armR: { a: 60, b: -100 } }, glint: 0.5 });

// ---------- S5: day 0: fifty kilos, one heavy suitcase ----------
export const S5 = thingCard({ day: 0, thing: 'suitcase', label: 'ONE HEAVY SUITCASE' });

// ---------- S6: the first doublings ----------
export const S6 = ladderCard({ days: [1, 2, 3, 4], step: 46, title: 'EVERY MORNING AT SIX' });

// ---------- S7: Mo shrugs: doesn't sound so crazy ----------
export const S7 = talkShot({
  Set: STREET, setT: 200,
  cast: [
    { look: MO, x: 820, y: HIP, yaw: 0.5, faces: [[0, 'neutral'], [30, 'smug']], pose: { armL: { a: 40, b: -60 }, armR: { a: 40, b: -60 } } },
    { look: YOU, x: 1100, y: HIP, yaw: -0.4, faces: [[0, 'neutral']] },
  ],
  cam: { from: [960, 470, 1.8], to: [960, 470, 1.9] },
});

// ---------- S8: the trick with doubling: a curve that lies flat, then explodes ----------
export const S8: React.FC<ShotProps> = ({ t }) => {
  const pts = Array.from({ length: 21 }, (_, d) => {
    const x = 340 + d * 62;
    const y = 880 - (liftKg(d) / liftKg(20)) * 640 - d * 2;
    return `${d ? 'L' : 'M'} ${x} ${y}`;
  }).join(' ');
  return (
    <g>
      <Schematic t={t} id="curve" />
      <path d="M 340 880 H 1640 M 340 880 V 200" stroke={SCH.dim} strokeWidth={4} />
      <SchLabel x={990} y={950} t={t} text="DAYS" size={34} color={SCH.dim} />
      <DrawOn d={pts} t={t - 4} dur={50} color={POWER} width={10} />
      <SchLabel x={700} y={820} t={t - 20} text="STARTS SLOW" size={40} />
      <SchLabel x={1420} y={260} t={t - 50} text="...THEN EXPLODES" size={48} color={POWER} />
    </g>
  );
};

// ---------- S9: day 10, a truck ----------
export const S9 = thingCard({ day: 10, thing: 'truck', label: 'MORE THAN A FULLY LOADED TRUCK', sub: '50 KG x 2^10 = 51,200 KG' });

// ---------- S10: day 20, the Titanic ----------
export const S10 = thingCard({ day: 20, thing: 'ship', label: 'ABOUT THE WEIGHT OF THE TITANIC', sub: '50 KG DOUBLED 20 TIMES', real: true });

// ---------- S11: the rules ----------
export const S11 = listCard({ title: 'THE RULES', items: [{ at: 46, text: 'STRENGTH  x2', ok: true, hot: true }, { at: 92, text: 'SPEED', ok: false }, { at: 126, text: 'SIZE', ok: false }] });

// ---------- S12: you, last week and today: identical ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 470, kf(t, [[0, 1.5], [len, 1.6]]))}>
    <STREET t={t + 300} id="s12" />
    {[[760, 'LAST WEEK'], [1160, 'TODAY']].map(([x, l], i) => (
      <g key={i}>
        <Hero look={YOU} pose={at(x as number, { yaw: i ? -0.3 : 0.3, expr: 'neutral', blink: idleBlink(t, i + 2) })} />
        <g opacity={clamp((t - 6 - i * 10) / 6)}>
          <rect x={(x as number) - 120} y={190} width={240} height={60} rx={30} fill="#0B0816" opacity={0.7} />
          <text x={x as number} y={232} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={i ? POWER : '#F6EFE3'}>{l}</text>
        </g>
      </g>
    ))}
    <text x={960} y={470} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 30) / 6)}>=</text>
  </g>
);

// ---------- S13: bones, skin, tendons: normal ----------
export const S13: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="bones" />
    <XRay x={720} y={640} s={0.95} label="AGE 14" />
    {[['BONES', 14], ['SKIN', 30], ['TENDONS', 50]].map(([w, a], i) => (
      <SchLabel key={i} x={1380} y={380 + i * 110} t={t - (a as number)} text={`${w}: NORMAL`} size={52} anchor="middle" />
    ))}
    <g opacity={clamp((t - 90) / 6)} transform={`translate(1380 760) scale(${backOut(clamp((t - 90) / 9))})`}>
      <rect x={-200} y={-50} width={400} height={76} rx={38} fill="#0B0816" stroke={POWER} strokeWidth={3} />
      <text textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={POWER}>14-YEAR-OLD NORMAL</text>
    </g>
  </g>
);

// ---------- S14: remember that ----------
export const S14 = faceCU({ look: YOU, Bg: STREET, faces: [[0, 'neutral'], [20, 'worried']], yaw: -0.25, zoom: [3.3, 3.7] });

// ---------- S15: the title ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const pop = (d: number) => backOut(clamp((t - d) / 9));
  return (
    <g>
      <g transform={camT(960, 500, kf(t, [[0, 1], [len, 1.06]]))}>
        <STREET t={t + 400} id="s15" />
        <Hero look={YOU} pose={at(960, { yaw: 0, expr: 'smug', armR: { a: 150, b: -40 }, blink: idleBlink(t, 3), glint: 1, glintColor: POWER })} />
      </g>
      <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.45} />
      <g transform={`translate(960 400) scale(${pop(2)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">WHAT IF YOUR STRENGTH</text>
      </g>
      <g transform={`translate(960 560) scale(${pop(8)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={130} fill="#F6EFE3" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">
          <tspan fill={POWER}>DOUBLED</tspan> EVERY DAY?
        </text>
      </g>
      <Glow x={960} y={520} r={500} kind="warm" o={0.25} />
    </g>
  );
};

// ---------- S16: fifty kilos doubled twenty times: the whole ladder ----------
export const S16 = ladderCard({ days: [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20], step: 4, title: '50 KG, DOUBLED 20 TIMES', hot: 20 });
