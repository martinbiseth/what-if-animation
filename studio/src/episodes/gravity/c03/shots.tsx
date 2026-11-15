import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, easeIn, backOut, shake, ShotProps, FONT, Kitchen, KITCHEN, KitchenIsland, stand, rnd,
  Schematic, SCH, SchLabel, DrawOn, factCard, walkPose, idleBlink, talkAt, Smartphone, LEG_LEN,
} from '../../../engine';
import { YOU, MOM, ELLIE, MO, PATEL, Soft, wordF, faceCU, Body, lie, heavy, Balloon, WallDial, bigWord, shk } from '../common';
import { LivingRoom, LIVING, StreetModern, STREETM, streetHip } from '../../electricity/sets';
import words from './words.json';

// Chapter 3, the weird hour: 7:15, the first hour is hilarious. Half-height jumps, Ellie on her butt laughing, the
// spoon that slams, balls fall 30% sooner, the balloon that rockets into the ceiling, the tea that takes forever (water
// boils near 120 °C), Mo calls, the street waddles, Mr. Patel loses to his trash can, a skateboarder at double speed,
// Mo stuck halfway up his ladder, "my hair is heavy". Then the kitchen clock says 7:59.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const KIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} veil={0.25} />;
const LR: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={1} veil={0.2} />;
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" car={true} />;
const floorL = (u: number, w: number) => LIVING.P(u, 1, w);
const standL = (u: number, w: number) => stand(LIVING, u, w);

// ---------- S1: 7:15 ----------
export const S1 = bigWord({ kicker: 'THE FIRST HOUR', word: '7:15 AM', color: '#FFD23A', Bg: LR, size: 220 });

// ---------- S2: you try to jump in the living room: a sad little hop, half as high ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const st = standL(0.45, 0.62);
  const cyc = t % 30;
  const air = cyc > 8 && cyc < 18 ? Math.sin(((cyc - 8) / 10) * Math.PI) : 0;
  const crouch = cyc <= 8 ? Math.sin((cyc / 8) * Math.PI) : 0;
  const pose: Pose = { ...basePose, ...st, y: st.y - 30 * air * st.scale, yaw: 0.3, squash: 0.15 * crouch - 0.05 * air, armL: { a: 30 + 120 * air, b: -10 }, armR: { a: 30 + 120 * air, b: -10 }, legL: { a: 10 * crouch, b: -30 * crouch }, legR: { a: -6 * crouch, b: -30 * crouch } };
  const ghost = { ...pose, y: st.y - 70 * air * st.scale };
  return (
    <g transform={camT(st.x, st.y - 20, kf(t, [[0, 1.8], [len, 1.9]]))}>
      <LR t={t + 100} />
      <g opacity={0.25}>
        <Hero look={YOU} pose={{ ...ghost, expr: 'happy' }} shadow={0} />
      </g>
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'happy'], [20, 'worried']]} shadow={1} />
      <text x={st.x + 160} y={st.y - 230} fontFamily={FONT.ui} fontSize={30} fill="#F6EFE3" opacity={0.7}>USUAL JUMP</text>
    </g>
  );
};

// ---------- S3: Ellie tries it too and lands on her butt ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const st = standL(0.5, 0.66);
  const s = st.scale * 0.7;
  const k = easeIn(clamp((t - 10) / 6));
  const hop = t < 10 ? Math.sin((t / 10) * Math.PI) : 0;
  const fl = floorL(0.5, 0.66);
  const sitY = fl.y - 34 * s;
  const y = t < 10 ? fl.y - LEG_LEN * s - 20 * hop * s : (fl.y - LEG_LEN * s) * (1 - k) + sitY * k;
  const pose: Pose = { ...basePose, x: st.x, y, scale: s, yaw: 0.2, armL: { a: 60 + 60 * k, b: -20 }, armR: { a: 60 + 60 * k, b: -20 }, legL: { a: 80 * k, b: -10 * k }, legR: { a: 70 * k, b: -10 * k }, squash: t > 16 && t < 22 ? 0.18 : 0 };
  return (
    <g transform={`${shk(t, 16, 6, 6)} ${camT(st.x, st.y + 30, kf(t, [[0, 2.8], [len, 2.95]]))}`}>
      <LR t={t + 140} />
      <Body look={ELLIE} pose={pose} t={t} faces={[[0, 'happy'], [16, 'shock'], [24, 'happy']]} seed={5} shadow={1} />
      {t > 24 ? <text x={st.x + 120} y={st.y - 120} fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">HA HA HA</text> : null}
    </g>
  );
};

// ---------- S4: Ellie on her back laughing, legs kicking, can't get up ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const fl = floorL(0.5, 0.7);
  const s = standL(0.5, 0.7).scale * 0.7;
  const kick = Math.sin(t / 3);
  const pose = lie(fl.x, fl.y, s, -1, { legL: { a: 30 + 20 * kick, b: -40 }, legR: { a: 20 - 20 * kick, b: -40 }, armL: { a: 40 + 10 * kick, b: -30 }, armR: { a: 50, b: -30 } });
  return (
    <g transform={camT(kf(t, [[0, fl.x + 20], [len, fl.x]]), fl.y - 60, kf(t, [[0, 2.8], [len, 3.0]]))}>
      <LR t={t + 180} />
      <Body look={ELLIE} pose={{ ...pose, tilt: Math.sin(t / 2) * 3 }} t={t} faces={[[0, 'happy']]} seed={5} />
      {[0, 1].map((i) => (
        <text key={i} x={fl.x - 140 + i * 60} y={fl.y - 120 - ((t * 2 + i * 30) % 60)} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFD23A" opacity={0.8}>ha</text>
      ))}
    </g>
  );
};

// ---------- S5: Mom drops a spoon in the kitchen: it doesn't fall, it SLAMS ----------
const MOMP = stand(KITCHEN, 0.42, 0.4);
export const S5: React.FC<ShotProps> = ({ t, len, f }) => {
  const sl = rel(f, t, 'slams');
  const drop = clamp((t - (sl - 5)) / 5);
  const y0 = MOMP.y - 40;
  const y1 = MOMP.y + 160;
  const sy = y0 + (y1 - y0) * easeIn(drop);
  return (
    <g transform={`${shk(t, sl, 6, 10)} ${camT(kf(t, [[0, MOMP.x + 60], [len, MOMP.x + 60]]), MOMP.y + 20, kf(t, [[0, 2.0], [len, 2.15]]))}`}>
      <KIT t={t + 100} />
      <Body look={MOM} pose={{ ...basePose, ...MOMP, yaw: 0.3, ...heavy(2), armR: { a: 60, b: -40 }, look: 0.5 }} t={t} faces={[[0, 'neutral'], [Math.max(1, sl), 'shock']]} seed={3} />
      <KitchenIsland />
      <g transform={`translate(${MOMP.x + 120} ${t >= sl ? y1 - 50 : sy}) rotate(${t >= sl ? 80 : 30})`}>
        <rect x={-6} y={-60} width={12} height={90} rx={6} fill="#C9CED8" stroke="#1A1620" strokeWidth={4} />
        <ellipse cx={0} cy={-70} rx={20} ry={28} fill="#C9CED8" stroke="#1A1620" strokeWidth={4} />
      </g>
      {t >= sl && t < sl + 12 ? (
        <g opacity={1 - (t - sl) / 12}>
          <text x={MOMP.x + 160} y={y1 - 120} fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">CLANG!</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S6: the schematic drop test: two balls from a table, last night and today, today lands first ----------
export const S6: React.FC<ShotProps> = ({ t, len, f }) => {
  const st = Math.max(0, rel(f, t, 'Drop'));
  const tt = t - st;
  const T1 = 27; // 0.45 s at 1 g, in frames x2 slowed for the eye
  const T2 = 19; // 0.32 s at 2 g
  const y = (T: number) => 380 + 420 * Math.min(1, Math.pow(Math.max(0, tt) / T, 2));
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
        <Schematic t={t} id="c3s6" />
      </g>
      {[[620, T1, 'LAST NIGHT', '1G'], [1300, T2, 'TODAY', '2G']].map(([x, T, lab, g], i) => (
        <g key={i}>
          <DrawOn d={`M ${(x as number) - 160} 360 L ${(x as number) + 160} 360 M ${(x as number) + 120} 360 L ${(x as number) + 120} 820 M ${(x as number) - 120} 360 L ${(x as number) - 120} 820`} t={t} dur={8} />
          <DrawOn d={`M ${(x as number) - 260} 820 L ${(x as number) + 260} 820`} t={t} dur={8} />
          <circle cx={x as number} cy={y(T as number) - 20} r={20} fill={i ? SCH.live : SCH.line} />
          <SchLabel x={x as number} y={300} t={t - 4} text={`${lab} · ${g}`} size={38} color={i ? SCH.live : SCH.line} />
          {tt >= (T as number) ? <SchLabel x={x as number} y={900} t={tt - (T as number)} text={i ? '0.32 s' : '0.45 s'} size={52} color={i ? SCH.live : SCH.line} /> : null}
        </g>
      ))}
      <SchLabel x={960} y={1000} t={t - (st + 40)} text="ABOUT 30% SOONER" size={46} color={SCH.live} />
    </g>
  );
};

// ---------- S7: Ellie with her birthday balloon, grinning ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const st = standL(0.4, 0.64);
  const s = st.scale * 0.7;
  const fl = floorL(0.4, 0.64);
  const pose: Pose = { ...basePose, x: st.x, y: fl.y - LEG_LEN * s, scale: s, yaw: 0.3, ...heavy(2), armR: { a: 150, b: -10 }, expr: 'smug' };
  return (
    <g transform={camT(st.x + 20, st.y - 60, kf(t, [[0, 2.0], [len, 2.15]]))}>
      <LR t={t + 220} />
      <Body look={ELLIE} pose={pose} t={t} faces={[[0, 'smug']]} seed={5} shadow={1} />
      <Balloon x={st.x + 50 * s} y={pose.y - 300 * s} s={s * 1.1} t={t} string={130} />
    </g>
  );
};

// ---------- S8: she lets go: the balloon rockets up and BONKS the ceiling ----------
export const S8: React.FC<ShotProps> = ({ t, len, f }) => {
  const go = rel(f, t, 'rockets');
  const ceiling = 120;
  const k = easeIn(clamp((t - go + 6) / 7));
  const by = 760 - (760 - ceiling - 180) * k;
  const bonk = t >= go + 1 ? Math.max(0, 1 - (t - go - 1) / 10) : 0;
  return (
    <g transform={shk(t, go + 1, 6, 8)}>
      <Soft blur={10} dim={0.2}>
        <g transform={camT(960, 360, 1.4)}>
          <LR t={t + 260} />
        </g>
      </Soft>
      <rect x={-200} y={-200} width={2400} height={ceiling + 200} fill="#3A3048" />
      <rect x={-200} y={ceiling - 10} width={2400} height={14} fill="#5A4A66" />
      <g transform={`translate(${960 + Math.sin(t / 3) * 4 * (1 - k)} ${by})`}>
        {k > 0.1 && k < 1 ? <path d="M -30 60 L -30 260 M 0 60 L 0 300 M 30 60 L 30 260" stroke="#F6EFE3" strokeWidth={6} opacity={0.5} /> : null}
        <Balloon x={0} y={180} s={1.3} t={t} string={140} squish={bonk} />
      </g>
      {bonk > 0 ? (
        <g transform={`translate(1260 ${ceiling + 120}) scale(${backOut(clamp((t - go - 1) / 5))}) rotate(8)`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFD23A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke">BONK!</text>
        </g>
      ) : null}
      {len > 0 ? null : null}
    </g>
  );
};

// ---------- S9: why: denser air, twice the push: the balloon on the schematic with its up arrows growing ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}>
      <Schematic t={t} id="c3s9" />
    </g>
    <circle cx={960} cy={480} r={130} fill="none" stroke={SCH.line} strokeWidth={6} />
    <path d="M 960 610 L 960 800" stroke={SCH.line} strokeWidth={4} />
    {[-80, 0, 80].map((dx, i) => {
      const g = easeOut(clamp((t - 10 - i * 3) / 14));
      return (
        <g key={i}>
          <path d={`M ${960 + dx} ${860} L ${960 + dx} ${860 - 160 - 120 * g}`} stroke={SCH.live} strokeWidth={10 + 6 * g} strokeLinecap="round" />
        </g>
      );
    })}
    <SchLabel x={960} y={200} t={t - 4} text="HEAVIER AIR PUSHES UP HARDER" size={46} />
    <g opacity={clamp((t - 30) / 6)} transform={`translate(960 960) scale(${backOut(clamp((t - 30) / 9))})`}>
      <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#0B0816" stroke={SCH.live} strokeWidth={3} />
      <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
    </g>
  </g>
);

// ---------- S10: the kettle on the hob, Mom waiting, waiting ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const k = KITCHEN.P(0.62, 0.72, 0.02);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1040]]), 560, kf(t, [[0, 1.6], [len, 1.8]]))}>
      <KIT t={t + 300} />
      <Body look={MOM} pose={{ ...basePose, ...stand(KITCHEN, 0.5, 0.4), yaw: 0.6, ...heavy(2), armL: { a: 30, b: -100 }, armR: { a: 30, b: -100 }, look: 0.8 }} t={t} faces={[[0, 'tired']]} seed={3} />
      <KitchenIsland />
      <g transform={`translate(${k.x} ${k.y - 30})`}>
        {[0, 1, 2].map((i) => (
          <text key={i} x={30 + i * 26} y={-60 - ((t + i * 15) % 45)} fontFamily={FONT.title} fontSize={36} fill="#F6EFE3" opacity={0.5}>.</text>
        ))}
      </g>
      <text x={1180} y={360} fontFamily={FONT.ui} fontSize={34} fill="#F6EFE3" opacity={clamp((t - 20) / 6)}>STILL NOT BOILING</text>
    </g>
  );
};

// ---------- S11: the fact: at 2 atmospheres, water boils near 120 °C ----------
export const S11 = factCard({ value: 120, suffix: ' °C', label: 'WATER BOILS AT, UNDER TWICE THE AIR PRESSURE', sub: 'like a pressure cooker (normal: 100 °C)' });

// ---------- S12: Mo calls: split screen, you flat on the floor, Mo flat on his ----------
export const S12: React.FC<ShotProps> = ({ t, len, f }) => {
  const talk = talkAt(W, f, 30, [[at('Bro') / 30, at('window') / 30 + 0.5]]);
  return (
    <g>
      <g>
        <clipPath id="c3l"><rect x={0} y={0} width={955} height={1080} /></clipPath>
        <g clipPath="url(#c3l)">
          <g transform={`translate(-480 0) ${camT(940, 660, 1.8)}`}>
            <LR t={t + 400} />
            <Hero look={YOU} pose={{ ...lie(960, 720, 1, -1, { armR: { a: 150, b: -110 } }), expr: 'neutral', blink: idleBlink(t, 2) }} shadow={0} />
          </g>
        </g>
        <clipPath id="c3r"><rect x={965} y={0} width={955} height={1080} /></clipPath>
        <g clipPath="url(#c3r)">
          <rect x={965} y={0} width={955} height={1080} fill="#4A5A3A" />
          <g transform="translate(480 0)">
            <g transform={camT(980, 660, 1.8)}>
              <rect x={0} y={720} width={1920} height={400} fill="#7A6A4A" />
              <Hero look={MO} pose={{ ...lie(960, 720, 1, 1, { armL: { a: 150, b: -110 } }), expr: 'happy', talk, blink: idleBlink(t, 6) }} shadow={0} />
            </g>
          </g>
        </g>
        <rect x={955} y={0} width={10} height={1080} fill="#0B0816" />
      </g>
      <g transform={`translate(1440 220) scale(${backOut(clamp((t - 4) / 8))})`}>
        <rect x={-230} y={-60} width={460} height={100} rx={50} fill="#F6EFE3" stroke="#0B0816" strokeWidth={6} />
        <text textAnchor="middle" y={8} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#0B0816">"BRO. LOOK OUTSIDE."</text>
      </g>
      {len > 0 ? null : null}
    </g>
  );
};

// ---------- S13: outside: everyone waddles; Mr. Patel and his trash can, the trash can winning ----------
const TrashCan: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -70 0 L -80 -200 L 80 -200 L 70 0 Z" fill="#3E6A4A" stroke="#14201A" strokeWidth={6} />
    <rect x={-90} y={-224} width={180} height={30} rx={8} fill="#2E5238" stroke="#14201A" strokeWidth={6} />
    {[-40, 0, 40].map((dx) => <path key={dx} d={`M ${dx} -170 L ${dx * 0.9} -30`} stroke="#2E5238" strokeWidth={6} />)}
  </g>
);
export const S13: React.FC<ShotProps> = ({ t, len, f }) => {
  const s = 0.8;
  const pat = rel(f, t, 'Patel');
  const tug = Math.sin(t / 5);
  const walkers = [0, 1, 2].map((i) => walkPose(200 + i * 300 + t * 1.2, t * 0.25 + i, STREETM.feet, 0.7, { ...heavy(2), yaw: 1, tilt: 10 + 6 * Math.sin(t * 0.25 + i), legL: { a: 18 * Math.sin(t * 0.25 + i), b: -24 }, legR: { a: -18 * Math.sin(t * 0.25 + i), b: -24 } }, 1));
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 1200]], easeOut), 560, kf(t, [[0, 1.05], [len, 1.3]]))}>
      <DAY t={t + 100} />
      {walkers.map((p, i) => <Body key={i} look={[YOU, MOM, MO][i]} pose={{ ...p, sway: 30 * Math.sin(t / 4 + i) }} t={t} seed={i + 1} shadow={1} />)}
      <Body look={PATEL} pose={{ ...basePose, x: 1420, y: streetHip(s) + 10, scale: s, yaw: 0.6, ...heavy(2), tilt: -18 + 4 * tug, armL: { a: 70, b: -10 }, armR: { a: 64, b: -10 }, legL: { a: -20, b: -20 }, legR: { a: 10, b: -30 } }} t={t} faces={[[0, 'worried'], [Math.max(1, pat), 'oops']]} seed={7} shadow={1} />
      <TrashCan x={1560 - 6 * tug} y={STREETM.feet} s={0.9} rot={8 + 6 * tug} />
    </g>
  );
};

// ---------- S14: a kid on a skateboard going down the hill twice as fast, screaming ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const x = -200 + t * 40;
  const s = 0.6;
  return (
    <g transform={camT(kf(t, [[0, 400], [len, 1400]]), 560, 1.1)}>
      <DAY t={t + 140} />
      <g transform={`translate(${x} ${STREETM.feet + 10})`}>
        {Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M ${-120 - i * 30} ${-80 - i * 30} L ${-260 - i * 40} ${-80 - i * 30}`} stroke="#F6EFE3" strokeWidth={6} strokeLinecap="round" opacity={0.6} />)}
        <rect x={-80} y={-26} width={160} height={16} rx={8} fill="#E8252A" stroke="#0B0816" strokeWidth={4} />
        {[-50, 50].map((wx) => <circle key={wx} cx={wx} cy={-6} r={12} fill="#F6EFE3" stroke="#0B0816" strokeWidth={4} />)}
      </g>
      <Body look={MO} pose={{ ...basePose, x, y: STREETM.feet - 30 - LEG_LEN * s, scale: s, yaw: 0.8, tilt: -20, armL: { a: 150, b: -10 }, armR: { a: 140, b: -10 }, legL: { a: 30, b: -20 }, legR: { a: -20, b: -10 }, expr: 'shock', sway: 40 }} t={t} seed={9} shadow={0} />
      <text x={x + 100} y={STREETM.feet - 260} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">AAAAAA!</text>
    </g>
  );
};

// ---------- S15: Mo climbs his own ladder to wave, and has to sit down halfway up ----------
export const S15: React.FC<ShotProps> = ({ t, len, f }) => {
  const sitT = rel(f, t, 'sit');
  const s = 0.75;
  const k = easeOut(clamp((t - sitT) / 8));
  const lx = 1220;
  const climbY = STREETM.feet - 200 - Math.min(t, sitT) * 2;
  const pose: Pose = { ...basePose, x: lx - 30 * k, y: climbY + 30 * k, scale: s, yaw: -0.4, ...heavy(2), armL: { a: 160 - 120 * k, b: -20 }, armR: { a: 120 + 40 * Math.sin(t / 3) * (1 - k), b: -30 }, legL: { a: 50 + 30 * k, b: -60 }, legR: { a: 20 + 60 * k, b: -40 } };
  return (
    <g transform={camT(lx, STREETM.feet - 300, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <DAY t={t + 180} />
      <g stroke="#B8A27A" strokeWidth={14} strokeLinecap="round">
        <path d={`M ${lx - 70} ${STREETM.feet} L ${lx - 10} ${STREETM.feet - 620}`} />
        <path d={`M ${lx + 70} ${STREETM.feet} L ${lx + 130} ${STREETM.feet - 620}`} />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${lx - 64 + i * 6.5} ${STREETM.feet - 40 - i * 64} L ${lx + 76 + i * 6.5} ${STREETM.feet - 40 - i * 64}`} strokeWidth={10} />)}
      </g>
      <Body look={MO} pose={pose} t={t} faces={[[0, 'happy'], [Math.max(1, sitT), 'tired']]} seed={9} />
    </g>
  );
};

// ---------- S16: Mo on the ladder, close: "weirdest day of my life. My hair is heavy." ----------
export const S16: React.FC<ShotProps> = (p) =>
  faceCU({ look: MO, Bg: DAY, words: W, talk: [at('This') / 30, at('heavy', 2) / 30 + 0.5], faces: [[0, 'tired'], [40, 'worried']], yaw: -0.3, zoom: [3.0, 3.3], pose: { squash: 0.06, sway: 0 } })(p);

// ---------- S17: the kitchen clock clicks to 7:59 ----------
export const S17: React.FC<ShotProps> = ({ t, len, f }) => {
  const click = rel(f, t, 'clicks');
  const mm = t >= click ? 59 : 58;
  return (
    <g transform={shk(t, click, 4, 4)}>
      <Soft blur={16} dim={0.4}>
        <g transform={camT(960, 520, 1.6)}>
          <KIT t={t + 500} />
        </g>
      </Soft>
      <g transform={`translate(960 540) scale(${kf(t, [[0, 2.4], [len, 2.8]])}) translate(-960 -540)`}>
        <WallDial x={960} y={540} r={150} hh={7} mm={mm} red={1} />
      </g>
      {len > 0 ? null : null}
    </g>
  );
};

// ---------- S18: and everybody stops laughing: you and Ellie on the floor, the smiles going ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const fl = floorL(0.45, 0.7);
  const s = standL(0.45, 0.7).scale;
  return (
    <g transform={camT(fl.x, fl.y - 120, kf(t, [[0, 2.0], [len, 2.3]]))}>
      <LR t={t + 600} />
      <Body look={YOU} pose={{ ...basePose, x: fl.x - 120, y: fl.y - 34 * s, scale: s, yaw: 0.3, legL: { a: 80, b: -10 }, legR: { a: 70, b: -10 }, ...heavy(2), armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } }} t={t} faces={[[0, 'happy'], [12, 'worried']]} seed={2} />
      <Body look={ELLIE} pose={{ ...basePose, x: fl.x + 120, y: fl.y - 34 * s * 0.7, scale: s * 0.7, yaw: -0.3, legL: { a: 80, b: -10 }, legR: { a: 70, b: -10 }, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } }} t={t} faces={[[0, 'happy'], [18, 'worried']]} seed={5} />
    </g>
  );
};

// ---------- S19: the air presses down twice as hard on the pot: arrows on the schematic, the gauge at 2 atm ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}>
      <Schematic t={t} id="c3s19" />
    </g>
    <DrawOn d="M 760 600 L 760 840 Q 760 870 790 870 L 1130 870 Q 1160 870 1160 840 L 1160 600" t={t} dur={10} width={7} />
    <path d={`M 770 ${660 + Math.sin(t / 5) * 6} Q 960 ${640 - Math.sin(t / 5) * 6} 1150 ${660 + Math.sin(t / 5) * 6}`} stroke="#7FD4FF" strokeWidth={6} fill="none" />
    {Array.from({ length: 7 }).map((_, i) => {
      const g = easeOut(clamp((t - 8 - i * 2) / 10));
      const x = 640 + i * 107;
      return <path key={i} d={`M ${x} 200 L ${x} ${200 + 300 * g} M ${x - 22} ${176 + 300 * g} L ${x} ${200 + 300 * g} L ${x + 22} ${176 + 300 * g}`} stroke={SCH.live} strokeWidth={12} strokeLinecap="round" fill="none" />;
    })}
    <SchLabel x={960} y={140} t={t - 4} text="AIR PRESSURE ×2" size={48} color={SCH.live} />
    <SchLabel x={960} y={960} t={t - 30} text="MORE PRESSURE = HOTTER BOIL" size={42} />
  </g>
);
