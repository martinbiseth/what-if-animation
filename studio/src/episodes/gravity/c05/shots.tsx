import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, easeIn, backOut, ShotProps, FONT, rnd, Schematic, SCH, SchLabel, DrawOn, factCard,
  DuskSky, Skyline, Haze, talkShot, stand,
} from '../../../engine';
import { YOU, MOM, ELLIE, PATEL, Soft, wordF, faceCU, Body, lie, Dog, PoolYard, YARD, NewsPicture, bigWord, shk } from '../common';
import { LivingRoom, LIVING, LIVING_TV, Hospital, HOSP } from '../../electricity/sets';
import words from './words.json';

// Chapter 5, someone notices: the scientist on TV, lying down like every anchor on Earth. It doubles at exactly the
// top of the hour: something is doing this on purpose. The planes race to land before nine (airliners are built for
// about 2.5 g), the satellites are too slow and the low ones fall, hospitals put patients on the floor, a pilot radios
// in. Then the one useful thing: get into water, it pushes back harder as gravity grows (real). Mr. Patel's pool.
// 8:41. Nineteen minutes.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const s = (a: string, n = 1) => at(a, n) / 30;
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const LR: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={1} veil={0.25} tv={1} />;
const fl = LIVING.P(0.55, 1, 0.68);
const sc = stand(LIVING, 0.55, 0.68).scale;

/** An airliner in profile facing right, x y its centre. */
const Airliner: React.FC<{ x: number; y: number; s?: number; rot?: number; gear?: boolean }> = ({ x, y, s = 1, rot = 0, gear = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -300 -10 Q -300 -40 -250 -40 L 240 -40 Q 320 -36 330 0 Q 320 30 240 30 L -260 30 Q -300 30 -300 -10 Z" fill="#E9EEF4" stroke="#1A1E28" strokeWidth={6} />
    <path d="M -240 -40 L -300 -140 L -250 -140 L -170 -40 Z" fill="#3A6AA8" stroke="#1A1E28" strokeWidth={6} />
    <path d="M -40 10 L -140 120 L -90 120 L 60 10 Z" fill="#C9D2DE" stroke="#1A1E28" strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, i) => <circle key={i} cx={-180 + i * 34} cy={-12} r={7} fill="#3A4A6A" />)}
    <path d="M 250 -30 Q 300 -28 312 -6 L 260 -6 Z" fill="#3A4A6A" />
    {gear ? <path d="M -60 30 L -60 70 M 160 30 L 160 66" stroke="#1A1E28" strokeWidth={10} /> : null}
  </g>
);
const Sky: React.FC<{ t: number; id?: string }> = ({ t, id = 'c5sky' }) => (
  <g>
    <DuskSky id={id} horizonY={900} red={0.2} />
    <Skyline y={940} seed={4} color="#4A3A60" h={120} />
    <Haze y={820} o={0.3} />
    {Array.from({ length: 5 }).map((_, i) => (
      <ellipse key={i} cx={((rnd(3, i) * 2400 - t * 2) % 2600) - 300} cy={200 + rnd(4, i) * 400} rx={180} ry={40} fill="#F6EFE3" opacity={0.5} />
    ))}
  </g>
);

// ---------- S1: the living-room floor: you and Mom flat, the TV on its side of the room ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, fl.x + 120], [len, fl.x + 80]]), fl.y - 170, kf(t, [[0, 1.5], [len, 1.65]]))}>
    <LR t={t + 100} />
    <Body look={YOU} pose={lie(fl.x, fl.y, sc, -1, { look: -0.8 })} t={t} faces={[[0, 'worried']]} />
    <Body look={MOM} pose={lie(fl.x + 420, fl.y + 40, sc, 1, { look: 0.8 })} t={t} faces={[[0, 'tired']]} seed={3} />
    <Dog x={fl.x + 200} y={fl.y + 90} s={0.4} t={t} flat={1} />
  </g>
);

// ---------- S2: the TV: the scientist lying on the studio floor: "to the millisecond... exactly" ----------
export const S2: React.FC<ShotProps> = ({ t, len, f }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <NewsPicture t={t} f={f} words={W} talk={[[s('We'), s('Exactly') + 0.4]]} headline="SCIENTIST: IT'S EXACT" faces={[[0, 'neutral']]} />
  </g>
);

// ---------- S3: Mom on the floor goes quiet ----------
export const S3 = faceCU({ look: MOM, Bg: LR, faces: [[0, 'neutral'], [30, 'worried']], yaw: 0.1, zoom: [3.2, 3.5], pose: { spin: -90 }, dark: 0.1 });

// ---------- S4: the TV, closer: "Something is doing this on purpose. Nature doesn't keep a schedule." ----------
export const S4: React.FC<ShotProps> = ({ t, len, f }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 880]]), 620, kf(t, [[0, 1.3], [len, 1.42]]))}>
    <NewsPicture t={t + 60} f={f} words={W} talk={[[s('Something'), s('schedule') + 0.4]]} headline="'SOMETHING IS DOING THIS'" faces={[[0, 'worried']]} />
  </g>
);

// ---------- S5: the planes: an airliner coming down fast through the sky, everyone trying to land before nine ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Sky t={t} />
    <Airliner x={kf(t, [[0, 300], [len, 1500]])} y={kf(t, [[0, 260], [len, 640]])} s={0.8} rot={10} gear={t > len * 0.5} />
    <Airliner x={kf(t, [[0, -200], [len, 700]])} y={kf(t, [[0, 120], [len, 380]])} s={0.4} rot={12} />
    <text x={1600} y={140} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#FFD23A">LAND BEFORE 9:00</text>
  </g>
);

// ---------- S6: the fact: an airliner is built for about 2.5 g ----------
export const S6 = factCard({ value: 2.5, suffix: ' G', label: 'WHAT AN AIRLINER IS BUILT TO HANDLE', sub: 'at 9:00 it will be 8 G', format: (v) => v.toFixed(1) });

// ---------- S7: the satellites: a circular orbit for normal gravity; now too slow, it dips into the air ----------
export const S7: React.FC<ShotProps> = ({ t, len, f }) => {
  const slow = rel(f, t, 'slow');
  const k = easeOut(clamp((t - slow) / 30));
  const ang = t / 12;
  const rx = 330;
  const ry = 330 - 0 * k;
  const ex = 330 - 120 * k;
  const ox = -120 * k;
  const px = 960 + ox + Math.cos(ang) * (k > 0 ? ex : rx);
  const py = 560 + Math.sin(ang) * (k > 0 ? ex * 0.92 : ry);
  return (
    <g>
      <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.05]]))}>
        <Schematic t={t} id="c5s7" />
      </g>
      <circle cx={960} cy={560} r={200} fill="#1E4A7A" stroke={SCH.line} strokeWidth={6} />
      <circle cx={960} cy={560} r={240} fill="none" stroke="#7FD4FF" strokeWidth={3} strokeDasharray="6 10" opacity={0.6} />
      <circle cx={960} cy={560} r={rx} fill="none" stroke={SCH.dim} strokeWidth={3} strokeDasharray="10 12" />
      {k > 0 ? <ellipse cx={960 + ox} cy={560} rx={ex} ry={ex * 0.92} fill="none" stroke={SCH.live} strokeWidth={5} /> : null}
      <g transform={`translate(${px} ${py})`}>
        <rect x={-18} y={-12} width={36} height={24} fill={SCH.line} />
        <rect x={-58} y={-8} width={34} height={16} fill="#3A6AA8" stroke={SCH.line} strokeWidth={2} />
        <rect x={24} y={-8} width={34} height={16} fill="#3A6AA8" stroke={SCH.line} strokeWidth={2} />
      </g>
      <SchLabel x={960} y={140} t={t - 4} text="SPEED SET FOR NORMAL GRAVITY" size={44} />
      {k > 0 ? <SchLabel x={960} y={990} t={t - slow - 10} text="TOO SLOW: THE LOW ONES FALL" size={44} color={SCH.live} /> : null}
    </g>
  );
};

// ---------- S8: down here: a hospital corridor, patients moved onto the floor on mattresses ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 600, kf(t, [[0, 1.3], [len, 1.45]]))}>
    <Hospital t={t + 100} candles={[]} />
    {[0.3, 0.5, 0.7].map((w, i) => {
      const p = HOSP.P(i % 2 ? 0.7 : 0.3, 1, w);
      const sc2 = stand(HOSP, 0.5, w).scale;
      return (
        <g key={i}>
          <rect x={p.x - 200 * sc2} y={p.y - 30 * sc2} width={400 * sc2} height={50 * sc2} rx={10} fill="#E9EEF4" stroke="#1A1E28" strokeWidth={4} />
          <Body look={[MOM, YOU, PATEL][i]} pose={lie(p.x, p.y - 30 * sc2, sc2, i % 2 ? 1 : -1)} t={t} faces={[[0, 'tired']]} seed={i + 3} />
        </g>
      );
    })}
  </g>
);

// ---------- S9: somewhere over the ocean, a pilot radios: "We're coming down early." ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A4A7A" />
    <rect y={700} width={1920} height={400} fill="#1E3A6A" />
    {Array.from({ length: 12 }).map((_, i) => (
      <path key={i} d={`M ${((i * 200 - t * 3) % 2200) - 100} ${760 + (i % 3) * 80} q 40 -14 80 0`} stroke="#5A8AC0" strokeWidth={5} fill="none" />
    ))}
    <Airliner x={kf(t, [[0, 700], [len, 1100]])} y={kf(t, [[0, 380], [len, 460]])} s={1.1} rot={8} />
    <g transform={`translate(1300 200) scale(${backOut(clamp((t - 30) / 8))})`}>
      <rect x={-380} y={-60} width={760} height={110} rx={55} fill="#F6EFE3" stroke="#0B0816" strokeWidth={6} />
      <text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#0B0816">"WE DON'T HAVE A CHOICE."</text>
    </g>
  </g>
);

// ---------- S10: the scientist again: "If you can, get into water." ----------
export const S10: React.FC<ShotProps> = ({ t, len, f }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 860]]), 600, kf(t, [[0, 1.3], [len, 1.5]]))}>
    <NewsPicture t={t + 120} f={f} words={W} talk={[[s('If'), s('back') + 0.4]]} headline="GET INTO WATER" ticker="GET INTO WATER IF YOU CAN · POOLS · BATHTUBS · LAKES · " faces={[[0, 'neutral']]} />
  </g>
);

// ---------- S11: the fact: a floating body, the water's push doubling with gravity ----------
export const S11: React.FC<ShotProps> = ({ t, len, f }) => {
  const dbl = rel(f, t, 'Double');
  const k = t >= dbl ? 1 : 0;
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
        <Schematic t={t} id="c5s11" />
      </g>
      <rect x={460} y={560} width={1000} height={360} fill="#1E4A7A" opacity={0.7} />
      <path d={`M 460 560 ${Array.from({ length: 11 }).map((_, i) => `L ${460 + i * 100} ${560 + Math.sin(t / 6 + i) * 8}`).join(' ')}`} stroke="#7FD4FF" strokeWidth={6} fill="none" />
      <DrawOn d="M 760 560 Q 760 510 960 510 Q 1160 510 1160 560 Q 1160 610 960 610 Q 760 610 760 560 Z" t={t} dur={10} width={6} />
      <path d={`M 960 470 L 960 ${380 - 60 * k}`} stroke="#B8BCC8" strokeWidth={10 + 8 * k} />
      <SchLabel x={1060} y={400} t={t} text={k ? 'WEIGHT ×2' : 'WEIGHT'} size={36} anchor="start" />
      {[-140, 0, 140].map((dx, i) => (
        <path key={i} d={`M ${960 + dx} ${860} L ${960 + dx} ${650 - 60 * k}`} stroke={SCH.live} strokeWidth={10 + 8 * k} strokeLinecap="round" />
      ))}
      <SchLabel x={1220} y={800} t={t} text={k ? 'WATER PUSH ×2' : 'WATER PUSH'} size={36} color={SCH.live} anchor="start" />
      <g opacity={clamp((t - 20) / 6)} transform={`translate(960 140) scale(${backOut(clamp((t - 20) / 9))})`}>
        <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#0B0816" stroke={SCH.live} strokeWidth={3} />
        <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
      </g>
    </g>
  );
};

// ---------- S12: on the floor, you and Mom turn your heads and look at each other ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(fl.x + 210, fl.y - 60, kf(t, [[0, 2.1], [len, 2.25]]))}>
    <LR t={t + 300} />
    <Body look={YOU} pose={lie(fl.x, fl.y, sc, -1, { look: 1, yaw: 0.4 })} t={t} faces={[[0, 'worried'], [40, 'neutral']]} />
    <Body look={MOM} pose={lie(fl.x + 420, fl.y + 40, sc, 1, { look: -1, yaw: -0.4 })} t={t} faces={[[0, 'worried'], [30, 'neutral']]} seed={3} />
  </g>
);

// ---------- S13: Mr. Patel next door has a swimming pool: the yard, the water shining ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 600], [len, 1040]]), 720, kf(t, [[0, 1.3], [len, 1.1]]))}>
    <PoolYard t={t + 200} broken={0.6} />
    {Array.from({ length: 4 }).map((_, i) => (
      <path key={i} d={`M ${YARD.poolX0 + 200 + i * 200} ${YARD.poolY0 + 60} l 0 -30 M ${YARD.poolX0 + 185 + i * 200} ${YARD.poolY0 + 45} l 30 0`} stroke="#FFFFFF" strokeWidth={6} opacity={0.5 + 0.5 * Math.sin(t / 4 + i)} />
    ))}
  </g>
);

// ---------- S14: 8:41. Nineteen minutes. ----------
export const S14 = bigWord({ kicker: 'NINETEEN MINUTES', word: '8:41', color: '#FF4A3A', Bg: LR, size: 260 });


// ---------- S15: every news anchor on Earth lying down: a wall of four channels ----------
export const S15: React.FC<ShotProps> = ({ t, len, f }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B0816" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(${60 + (i % 2) * 920} ${50 + Math.floor(i / 2) * 510}) scale(0.43)`}>
        <clipPath id={`c5tv${i}`}><rect width={1920} height={1080} /></clipPath>
        <g clipPath={`url(#c5tv${i})`}>
          <NewsPicture t={t + i * 40} f={f} headline={['BREAKING', 'GRAVITY ×4', 'STAY DOWN', 'LIVE'][i]} ticker={'STAY DOWN · '} />
        </g>
        <rect width={1920} height={1080} fill="none" stroke="#3A3448" strokeWidth={20} />
      </g>
    ))}
    {len > 0 ? null : null}
  </g>
);

// ---------- S16: you on the floor, listening: the one useful thing anyone says all day ----------
export const S16 = faceCU({ look: YOU, Bg: LR, faces: [[0, 'tired'], [40, 'neutral']], yaw: 0.1, zoom: [3.2, 3.5], pose: { spin: -90 }, light: { x: 900, y: 500, kind: 'cool', o: 0.4 } });
