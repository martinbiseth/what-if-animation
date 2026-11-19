import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, FONT, Glow, LEG_LEN, rnd, easeIn, SUBURB, PizzaBox, Suburb, Rooftop,
} from '../../../engine';
import words from './words.json';
import {
  YOU, MO, ELLIE, DRIVER, KitSet, BedSet, DayStreet, Sky, RoofSet, faceCU, ctrlCU, scene, fig, codeCard, propCU, span, talkShot, Flyer,
  Controller, SportsCar, SpawnFlash, MoneyBag, CashStack, WeatherTV, CHEAT, OUR_DOOR, ROAD, SetC, Soft, Jetpack,
} from '../common';
import { HillSet, hillY, Hedge, BusSide, Rain, KeyFob, Skateboard } from '../kit';

// Chapter 3, the fun part: Dead Man's Hill and the hedge, the money bags, eleven hundred pizzas, the sunshine code
// and the weather lady, the red car and the blue one, Ellie's car, the jetpack to school, Mo on the roof.

const HILL: SetC = ({ t, id }) => <HillSet t={t} id={id} />;
const FEETY = SUBURB.feet;
const standY = (s = 1) => FEETY - LEG_LEN * s;

export const S1 = codeCard({ kicker: 'MONDAY', title: 'THE FUN PART', seed: 6 });

// ---------- S2: the top of the hill: Mo bets you can't ----------
export const S2 = scene({
  Set: HILL, cam: [[400, 300, 1.6], [430, 300, 1.66]],
  draw: (t, f) => (
    <g>
      {fig(MO, t, { x: 520, y: hillY(520) - LEG_LEN - 40, yaw: -0.5, look: -0.6, armR: { a: 60 + Math.sin(t / 6) * 15, b: -60 }, handR: 'point' }, [[0, 'smug']], 2)}
      {fig(YOU, t, { x: 300, y: hillY(300) - LEG_LEN - 40, yaw: 0.5, look: 0.6, armL: { a: 30, b: -40 } }, [[0, 'neutral'], [40, 'cool']], 1)}
      <Skateboard x={300} y={hillY(300) - 34} rot={23} />
    </g>
  ),
});

// ---------- S3: the hill, looking down it ----------
export const S3 = scene({ Set: HILL, cam: [[900, 600, 1.0], [1100, 700, 1.12]] });

// ---------- S4: down it at full speed ----------
export const S4 = scene({
  Set: HILL, cam: [[700, 600, 1.2], [1500, 950, 1.2]],
  draw: (t, f, len) => {
    const x = kf(t, [[0, 500], [len, 1700]], easeIn);
    const y = hillY(x) - 40;
    const pose: Pose = { ...basePose, x, y: y - LEG_LEN * 0.95 + 10, scale: 0.95, yaw: 0.6, tilt: 10, look: 0.6, expr: t > len * 0.6 ? 'shock' : 'happy', armL: { a: 70, b: -10 }, armR: { a: 80, b: -20 }, legL: { a: 20, b: -20 }, legR: { a: -10, b: 10 }, sway: 10 };
    return (
      <g>
        <Skateboard x={x} y={y} rot={23} />
        <Hero look={YOU} pose={pose} />
      </g>
    );
  },
});

// ---------- S5: off the kerb, over a parked van, into a hedge ----------
export const S5 = scene({
  Set: DayStreet, cam: [[960, 560, 1.05], [960, 560, 1.08]],
  draw: (t) => {
    const k = clamp(t / 50);
    const x = 100 + k * 1400;
    const y = kf(k, [[0, 600], [0.45, 180], [1, 640]]);
    const shake = t > 50 && t < 64 ? Math.sin((t - 50) * 2) * 4 : 0;
    return (
      <g>
        <g transform={`translate(700 ${ROAD}) scale(0.9) translate(-700 ${-ROAD})`}>
          <rect x={460} y={ROAD - 300} width={500} height={280} rx={24} fill="#E8E8EE" stroke="#1A1A22" strokeWidth={6} />
          <circle cx={560} cy={ROAD - 16} r={40} fill="#16161C" />
          <circle cx={860} cy={ROAD - 16} r={40} fill="#16161C" />
        </g>
        <Skateboard x={kf(t, [[0, 100], [20, 400]])} y={ROAD - 10 + Math.min(0, Math.sin(t / 3) * 10)} rot={t * 6} />
        <Hedge x={1500} y={FEETY} w={500} shake={shake} />
        {t < 52 ? <Hero look={YOU} pose={{ ...basePose, x, y, scale: 0.9, spin: k * 400, expr: 'shock', armL: { a: 150, b: 0 }, armR: { a: 150, b: 0 }, legL: { a: 40, b: 30 }, legR: { a: -30, b: 20 } }} /> : null}
        {t >= 52 ? (
          <g>
            <path d="M 1500 700 l 20 100 M 1470 700 l -30 90" stroke="#1A1620" strokeWidth={22} strokeLinecap="round" />
            <ellipse cx={1530} cy={810} rx={26} ry={12} fill="#F6EFE3" />
            <ellipse cx={1440} cy={790} rx={26} ry={12} fill="#F6EFE3" />
          </g>
        ) : null}
        {t >= 52 ? Array.from({ length: 8 }).map((_, i) => (
          <ellipse key={i} cx={1500 + Math.cos(i) * (t - 52) * 8} cy={640 - (t - 52) * 6 + ((t - 52) ** 2) * 0.3 + i * 4} rx={14} ry={8} fill="#5A8A4A" transform={`rotate(${i * 40})`} />
        )) : null}
      </g>
    );
  },
});

// ---------- S6: you stand up out of the hedge, a leaf in your hair ----------
export const S6 = scene({
  Set: DayStreet, cam: [[1400, 560, 1.8], [1400, 560, 1.9]], setT: 300,
  draw: (t) => {
    const up = kf(t, [[0, 0], [20, 1]]);
    const pick = kf(t, [[40, 0], [55, 1]]);
    return (
      <g>
        <Hedge x={1500} y={FEETY} w={500} />
        {fig(YOU, t, { x: 1420, y: standY() + (1 - up) * 160, yaw: -0.2, armR: { a: 20 + pick * 140, b: -20 - pick * 60 } }, [[0, 'dizzy'], [24, 'neutral'], [60, 'happy']])}
        <ellipse cx={1420 + 40 * (1 - pick) + pick * 60} cy={standY() + (1 - up) * 160 - 250 + pick * 20} rx={22} ry={10} fill="#5A8A4A" transform={`rotate(${30 - pick * 60} 1440 400)`} />
      </g>
    );
  },
});

// ---------- S7: Mo drops his phone ----------
export const S7 = faceCU({
  look: MO, Bg: DayStreet, faces: [[0, 'shock']], yaw: -0.25, zoom: [2.6, 2.7],
  front: (t) => (
    <g transform={`translate(1240 ${kf(t, [[0, 760], [18, 1300]], easeIn)}) rotate(${t * 9})`}>
      <rect x={-60} y={-120} width={120} height={240} rx={20} fill="#16161C" />
      <rect x={-50} y={-108} width={100} height={216} rx={12} fill="#3A6AB8" />
    </g>
  ),
});

// ---------- S8: "Do it again." ----------
export const S8 = faceCU({ look: MO, Bg: DayStreet, faces: [[0, 'happy']], yaw: -0.3, zoom: [2.8, 2.9], words, talk: span(words, 'Do', 'again') });

// ---------- S9: code number four: MONEY ----------
export const S9 = ctrlCU({ Bg: BedSet, seq: [[6, 'g'], [13, 'g'], [20, 'left'], [27, 'y'], [34, 'r']], cheat: { at: 44, name: 'MONEY' }, glow: (t) => kf(t, [[34, 0], [44, 0.8]]) });

// ---------- S10: a sports bag drops onto the bed ----------
export const S10 = scene({
  Set: BedSet, cam: [[700, 600, 1.5], [720, 600, 1.55]], setT: 500,
  draw: (t) => {
    const y = kf(t, [[2, 200], [12, 640]], easeIn);
    const sq = t > 12 && t < 20 ? Math.sin(((t - 12) / 8) * Math.PI) * 0.15 : 0;
    return (
      <g>
        <SpawnFlash x={560} y={220} p={t} r={200} />
        <g transform={`translate(560 ${y}) scale(${1 + sq} ${1 - sq})`}>
          <MoneyBag x={0} y={0} s={0.55} open={0} />
        </g>
        {fig(YOU, t, { x: 940, y: 818 - LEG_LEN, yaw: -0.5, look: -0.7 }, [[0, 'neutral'], [14, 'shock']])}
      </g>
    );
  },
});

// ---------- S11: inside: twenty-five stacks, $250,000 ----------
export const S11 = propCU({
  Bg: BedSet,
  draw: (t) => (
    <g>
      <Glow x={960} y={500} r={600} o={0.5} />
      <g transform="translate(960 900) scale(2.2)">
        <MoneyBag x={0} y={0} s={1} />
      </g>
      {Array.from({ length: 25 }).map((_, i) => (
        <g key={i} opacity={clamp((t - 10 - i * 2) / 4)}>
          <CashStack x={560 + (i % 5) * 200} y={260 + Math.floor(i / 5) * 60} s={0.9} rot={(rnd(9, i) - 0.5) * 10} />
        </g>
      ))}
      <text x={960} y={160} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#4BE38A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp((t - 60) / 8)}>
        ${Math.round(kf(t, [[60, 0], [100, 250000]]) / 1000) * 1000 >= 250000 ? '250,000' : Math.round(kf(t, [[60, 0], [100, 250000]])).toLocaleString('en-US')}
      </text>
    </g>
  ),
});

// ---------- S12: by dinner, a room of bags ----------
export const S12 = scene({
  Set: BedSet, cam: [[960, 600, 1.15], [960, 600, 1.25]], setT: 700,
  draw: (t, f, len) => {
    const n = Math.floor(kf(t, [[0, 2], [len * 0.8, 30]]));
    return (
      <g>
        {Array.from({ length: n }).map((_, i) => (
          <MoneyBag key={i} x={560 + (i % 8) * 120 + (Math.floor(i / 8) % 2) * 60} y={830 - Math.floor(i / 8) * 70} s={0.4} open={0} />
        ))}
        {fig(YOU, t, { x: 1300, y: 818 - LEG_LEN, yaw: -0.4, armR: { a: 50, b: -90 } }, [[0, 'happy'], [Math.round(len * 0.5), 'smug']])}
      </g>
    );
  },
});

// ---------- S13: eleven hundred pizzas; the driver cries a little ----------
export const S13 = scene({
  Set: DayStreet, cam: [[960, 560, 1.4], [980, 560, 1.48]], setT: 1100,
  draw: (t) => (
    <g>
      {Array.from({ length: 6 }).map((_, c) =>
        Array.from({ length: 9 }).map((_, r) => <PizzaBox key={`${c}-${r}`} x={560 + c * 110} y={FEETY - r * 34} w={100} lid />),
      )}
      {fig(DRIVER, t, { x: 1300, y: standY(), yaw: -0.4, look: -0.5, headTilt: -6 }, [[0, 'worried']], 4)}
      {[0, 1].map((i) => (
        <ellipse key={i} cx={1290 + i * 34} cy={standY() - 160 + ((t * 2 + i * 20) % 50)} rx={6} ry={9} fill="#7FC8F0" />
      ))}
      {fig(YOU, t, { x: 420, y: standY(), yaw: 0.4, armR: { a: 90, b: -10 }, handR: 'point' }, [[0, 'happy']], 5)}
    </g>
  ),
});

// ---------- S14: three days of rain; S15: the clouds slide apart over your town ----------
const RainStreet: SetC = ({ t, id }) => <Suburb t={t} id={id} tod="morning" cars={false} />;
export const S14 = scene({
  Set: RainStreet, cam: [[960, 540, 1.05], [960, 540, 1.1]],
  draw: (t) => fig(YOU, t, { x: OUR_DOOR - 100, y: standY(), yaw: 0.1, armR: { a: 40, b: -70 } }, [[0, 'tired']]),
  front: (t) => <Rain t={t} />,
});
export const S15 = scene({
  Set: DayStreet, cam: [[960, 540, 1.0], [960, 520, 1.06]], setT: 1300,
  draw: (t, f, len) => {
    const open = kf(t, [[6, 0], [len * 0.7, 1]]);
    return (
      <g>
        {/* the grey lid drawn back from the middle */}
        <rect x={-400} y={-400} width={1360 - open * 900} height={720} fill="#8A92A6" />
        <rect x={960 + open * 900} y={-400} width={1360} height={720} fill="#8A92A6" />
        <Glow x={960} y={300} r={700 * open + 1} o={0.7} />
        {fig(YOU, t, { x: OUR_DOOR - 100, y: standY(), yaw: 0.1, look: 0, armL: { a: 160, b: 0 }, armR: { a: 160, b: 0 } }, [[0, 'shock'], [40, 'happy']])}
      </g>
    );
  },
  front: (t, f, len) => <Rain t={t} o={1 - kf(t, [[6, 0], [len * 0.6, 1]])} />,
});

// ---------- S16: the weather lady's map: a hole in the clouds ----------
export const S16 = propCU({ bgColor: '#1E1A26', draw: (t) => <WeatherTV x={960} y={540} s={1.7} clear={kf(t, [[0, 0.3], [40, 1]])} t={t} /> });

// ---------- S17: code number seven: SPAWN CAR ----------
export const S17 = ctrlCU({ Bg: DayStreet, seq: [[4, 'b'], [10, 'b'], [16, 'down'], [22, 'r'], [28, 'g']], cheat: { at: 36, name: 'SPAWN CAR' } });

// ---------- S18: a low rumble, a flash, the red car on the driveway ----------
export const S18 = scene({
  Set: DayStreet, cam: [[900, 600, 1.15], [900, 600, 1.2]], setT: 1500,
  draw: (t) => {
    const fall = clamp((t - 20) / 10);
    const y = -400 + easeIn(fall) * (ROAD + 400);
    const sh = t > 4 && t < 30 ? Math.sin(t * 3) * 4 : 0;
    return (
      <g transform={`translate(${sh} 0)`}>
        <SpawnFlash x={1050} y={ROAD - 100} p={t - 18} r={400} />
        <SportsCar x={1050} y={y} s={0.95} />
        <SpawnFlash x={1050} y={ROAD - 60} p={t - 30} r={300} color="#FFE27A" />
        {fig(YOU, t, { x: 520, y: standY(), yaw: 0.5, look: 0.7 }, [[0, 'worried'], [32, 'shock'], [60, 'happy']])}
      </g>
    );
  },
});

// ---------- S18b: brand new, keys in ----------
export const S18b = propCU({
  Bg: DayStreet,
  draw: (t) => (
    <g>
      <g transform="translate(960 900) scale(2.6)"><SportsCar x={0} y={0} /></g>
      <KeyFob x={1180} y={560} s={1.6} rot={Math.sin(t / 5) * 10} />
      <path d="M 300 420 l 30 -30 l 30 30 l -30 30 Z" fill="#FFFFFF" opacity={0.6 + 0.4 * Math.sin(t / 3)} />
    </g>
  ),
});

// ---------- S19: you can't drive; another one, in blue ----------
export const S19 = scene({
  Set: DayStreet, cam: [[1000, 600, 1.0], [1000, 600, 1.03]], setT: 1700,
  draw: (t, f, len) => {
    const at = len * 0.55;
    return (
      <g>
        <SportsCar x={700} y={ROAD} s={0.8} />
        {t > at + 6 ? <SportsCar x={1400} y={ROAD} s={0.8} color={CHEAT.blue} /> : null}
        <SpawnFlash x={1400} y={ROAD - 60} p={t - at} r={260} />
        {fig(YOU, t, { x: 1000, y: standY(), yaw: -0.1, armL: { a: 40, b: -20 }, armR: { a: 40, b: -20 } }, [[0, 'oops'], [Math.round(at), 'smug']])}
        <KeyFob x={1060} y={standY() - 10} s={0.5} />
      </g>
    );
  },
});

// ---------- S20: Ellie settles for a car ----------
export const S20 = scene({
  Set: DayStreet, cam: [[1000, 640, 1.5], [1000, 640, 1.56]], setT: 1900,
  draw: (t, f, len) => {
    const pink = t > len * 0.6;
    return (
      <g>
        {pink ? <SportsCar x={1050} y={ROAD} s={0.8} color="#F07AB8" /> : null}
        <SpawnFlash x={1050} y={ROAD - 60} p={t - len * 0.6} r={260} />
        {pink
          ? fig(ELLIE, t, { x: 1000, y: ROAD - 170 - LEG_LEN * 0.7, scale: 0.7, yaw: 0.3, armL: { a: 150, b: 0 }, armR: { a: 150, b: 0 } }, [[0, 'happy']], 3)
          : fig(ELLIE, t, { x: 1000, y: standY(0.7), scale: 0.7, yaw: -0.2, armR: { a: 40, b: -60 }, headTilt: 8 }, [[0, 'worried']], 3)}
        {fig(YOU, t, { x: 700, y: standY(), yaw: 0.4, armR: { a: 30, b: -50 } }, [[0, 'neutral'], [Math.round(len * 0.6), 'happy']])}
      </g>
    );
  },
});

// ---------- S21: code number nine: JETPACK ----------
export const S21 = ctrlCU({ Bg: DayStreet, seq: [[4, 'up'], [10, 'up'], [16, 'y'], [22, 'y'], [28, 'b']], cheat: { at: 36, name: 'JETPACK' } });

// ---------- S22: a bang, straight up; your shoes stay on the lawn ----------
export const S22 = scene({
  Set: DayStreet, cam: [[OUR_DOOR, 460, 1.3], [OUR_DOOR, 300, 1.3]], setT: 2100,
  draw: (t) => {
    const up = t < 14 ? 0 : (t - 14) ** 1.6 * 2.2;
    const pose: Pose = { ...basePose, x: OUR_DOOR - 100, y: standY() - up, expr: t < 14 ? 'shock' : 'happy', armL: { a: 160, b: 0 }, armR: { a: 160, b: 0 }, legL: { a: 6, b: 0 }, legR: { a: -6, b: 0 } };
    return (
      <g>
        <SpawnFlash x={OUR_DOOR - 100} y={standY() - 100} p={t - 2} r={260} />
        {/* the shoes left behind */}
        {t >= 14 ? [-24, 24].map((dx) => <ellipse key={dx} cx={OUR_DOOR - 100 + dx} cy={FEETY - 6} rx={26} ry={12} fill="#F6EFE3" stroke="#1A1018" strokeWidth={4} />) : null}
        <Jetpack x={OUR_DOOR - 100} y={standY() - up - 110} s={0.8} t={t} flame={t < 14 ? 0.3 : 1} />
        <Hero look={t >= 14 ? { ...YOU, shoe: '#2A2A34' } : YOU} pose={pose} />
        {t > 14 && t < 30 ? <circle cx={OUR_DOOR - 100} cy={FEETY} r={(t - 14) * 18} fill="none" stroke="#FFFFFF" strokeWidth={10} opacity={1 - (t - 14) / 16} /> : null}
      </g>
    );
  },
});

// ---------- S23: over the traffic jam and the bus; faces at the windows ----------
export const S23 = scene({
  Set: Sky, cam: [[960, 640, 1.2], [1100, 640, 1.25]], setT: 600,
  draw: (t, f, len) => (
    <g>
      {Array.from({ length: 12 }).map((_, i) => (
        <rect key={i} x={-200 + i * 220} y={930} width={160} height={60} rx={14} fill={['#C84A3A', '#4A7AB8', '#E8E4D8', '#F2C14E'][i % 4]} stroke="#1A1A22" strokeWidth={4} />
      ))}
      <BusSide x={1000} y={1000} s={0.75} faces={kf(t, [[len * 0.45, 0], [len * 0.6, 1]])} />
      <Flyer x={kf(t, [[0, 200], [len, 1700]])} y={kf(t, [[0, 520], [len, 480]])} s={0.8} t={t} />
    </g>
  ),
});

// ---------- S23b: over the principal's car (PRINCIPAL on the parking sign) ----------
export const S23b = scene({
  Set: Sky, cam: [[960, 700, 1.4], [1000, 700, 1.4]], setT: 800,
  draw: (t) => (
    <g>
      <rect x={600} y={880} width={700} height={300} fill="#5A5A64" />
      <rect x={660} y={760} width={170} height={60} fill="#F6EFE3" stroke="#1A1A22" strokeWidth={4} />
      <text x={745} y={800} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#1A1A22">PRINCIPAL</text>
      <rect x={740} y={820} width={10} height={60} fill="#3A3C46" />
      <rect x={880} y={860} width={260} height={80} rx={20} fill="#6A6E7A" stroke="#1A1A22" strokeWidth={5} />
      <Flyer x={kf(t, [[0, 500], [34, 1400]])} y={560} s={0.9} t={t} />
    </g>
  ),
});

// ---------- S24: down on the school roof as the bell rings ----------
export const S24 = scene({
  Set: RoofSet, cam: [[960, 560, 1.15], [960, 560, 1.2]],
  draw: (t) => {
    const down = kf(t, [[0, -500], [24, 0]]);
    return (
      <g>
        <Jetpack x={760} y={540 - 30 + down - 110} s={0.8} t={t} flame={t < 26 ? 1 : 0} />
        {fig({ ...YOU, shoe: '#2A2A34' }, t, { x: 760, y: 540 + down - 30, yaw: 0.3, squash: t > 24 && t < 30 ? 0.12 : 0, armL: { a: 40, b: -20 }, armR: { a: 40, b: -20 } }, [[0, 'happy'], [30, 'cool']])}
        {/* the bell, ringing on the stair hut */}
        <g transform={`translate(1400 330) rotate(${t > 20 ? Math.sin(t * 2) * 14 : 0})`}>
          <path d="M -40 40 Q -40 -40 0 -40 Q 40 -40 40 40 Z" fill="#E8B83A" stroke="#2A2418" strokeWidth={5} />
          <circle cx={0} cy={46} r={10} fill="#2A2418" />
        </g>
      </g>
    );
  },
});

// ---------- S25: Mo has been waiting since seven ----------
export const S25 = scene({
  Set: RoofSet, cam: [[1100, 520, 1.7], [1100, 520, 1.78]], setT: 200,
  draw: (t) => fig(MO, t, { x: 1150, y: 540 - 30, yaw: -0.4, look: -0.6, armL: { a: 60, b: -130 }, armR: { a: 60, b: -130 }, legL: { a: 8, b: 0 } }, [[0, 'tired']], 2),
});

// ---------- S26: "Okay. Okay. Jetpack. Me next." ----------
export const S26 = faceCU({ look: MO, Bg: RoofSet, faces: [[0, 'shock'], [30, 'happy']], yaw: -0.25, zoom: [2.7, 2.9], words, talk: span(words, 'Okay', 'next') });

// ---------- S27: the luckiest person who has ever lived ----------
export const S27 = scene({
  Set: RoofSet, cam: [[960, 560, 1.0], [960, 540, 1.08]], setT: 300,
  draw: (t) => (
    <g>
      {fig(YOU, t, { x: 860, y: 540 - 30, yaw: 0.2, armL: { a: 165, b: 0 }, armR: { a: 165, b: 0 } }, [[0, 'happy']])}
      {fig(MO, t, { x: 1080, y: 540 - 30, yaw: -0.3, look: -0.6, armR: { a: 150, b: -10 } }, [[0, 'happy']], 2)}
    </g>
  ),
});

// ---------- S28: Friday morning, something burning: you sniff, and look down ----------
export const S28 = faceCU({
  look: YOU, Bg: KitSet, faces: [[0, 'neutral'], [40, 'worried']], yaw: 0.2, zoom: [3.0, 3.3],
  pose: { headTilt: 0 },
  front: (t) => (
    <g>
      {Array.from({ length: 6 }).map((_, i) => {
        const k = ((t * 0.5 + i * 12) % 60) / 60;
        return <circle key={i} cx={1300 + Math.sin(i + t / 20) * 40} cy={1100 - k * 700} r={30 + k * 80} fill="#8A8890" opacity={0.45 * (1 - k)} />;
      })}
    </g>
  ),
});
