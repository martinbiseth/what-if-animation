import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, talkShot, factCard, chapterCard, LEG_LEN,
  Kitchen, KITCHEN, KitchenIsland, stand, Bedroom, bedSit, BedDuvet, CountUp, SchLabel, SCH,
} from '../../../engine';
import { YOU, MOM, ELLIE, faceCU, bigWord, wordF, Soft, handAt, DarkBg, iconBoard, Icon, SchematicBg, HeldCandle } from '../common';
import { LivingRoom, LIVING, Candle, WaterBottle, Can } from '../sets';
import words from './words.json';

// Chapter 4, the catch, from real numbers: water needs pumps (Detroit 2003: 126 communities boiling water after two
// days); the toilets; the fridge's four hours and the freezer's two days; the shops can't refill; the bathtub; the
// dark; 1.6 billion people in 1900, 8 billion now; fertilizer feeds half of them; the factories, tractors and pumps
// stop. The danger isn't the dark. It's dinner.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (cue: string, w: string, n = 1, cn = 1) => at(w, n) - at(cue, cn);
const DARKK: React.FC<{ t: number; id?: string }> = ({ t, id }) => (
  <g>
    <Kitchen t={t} id={id} veil={0.85} />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.5} />
  </g>
);
const CAND = [LIVING.P(0.5, 0.86, 0.57)];
const CANDLELR: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={0} candles={CAND} veil={0.72} />;

// ---------- S1: chapter card: THE CATCH ----------
export const S1 = chapterCard({ kicker: 'THE CATCH', title: 'WATER NEEDS POWER', ground: 'schematic' });

// ---------- S2: the water system on the schematic: river, pump, water tower, your tap; flow, then the pump stops ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const stop = rel('Water', 'stop');
  const flow = t < stop ? 1 : clamp(1 - (t - stop) / 20);
  const tower = t < stop ? 1 : clamp(1 - (t - stop) / 40);
  const path = [[180, 820], [520, 820], [520, 560], [900, 560], [900, 360], [1060, 360], [1060, 700], [1500, 700], [1500, 520]];
  const len2 = path.slice(1).reduce((a, p, i) => a + Math.hypot(p[0] - path[i][0], p[1] - path[i][1]), 0);
  const ptAt = (d: number) => {
    let acc = 0;
    for (let i = 1; i < path.length; i++) {
      const sl = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
      if (acc + sl >= d) {
        const k = (d - acc) / sl;
        return { x: path[i - 1][0] + (path[i][0] - path[i - 1][0]) * k, y: path[i - 1][1] + (path[i][1] - path[i - 1][1]) * k };
      }
      acc += sl;
    }
    return { x: path[path.length - 1][0], y: path[path.length - 1][1] };
  };
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.05]]))}>
      <SchematicBg t={t} />
      <path d={`M ${path.map((p) => p.join(' ')).join(' L ')}`} stroke="#3A5A7A" strokeWidth={26} fill="none" strokeLinejoin="round" />
      {Array.from({ length: 40 }).map((_, i) => {
        const d = ((i / 40) * len2 + t * 9 * (t < stop ? 1 : 0) + (t >= stop ? stop * 9 : 0)) % len2;
        const p = ptAt(d);
        return <circle key={i} cx={p.x} cy={p.y} r={9} fill="#6AB8E8" opacity={flow} />;
      })}
      {/* the river */}
      <path d="M 60 880 Q 200 860 340 880 T 620 880" stroke="#6AB8E8" strokeWidth={12} fill="none" />
      <SchLabel x={240} y={950} t={t} text="RIVER" size={34} />
      <Icon name="pump" x={520} y={700} s={0.9} t={t < stop ? t : stop} live={t < stop ? 1 : 0} />
      <SchLabel x={520} y={480} t={t - 4} text="ELECTRIC PUMP" size={34} color={t < stop ? SCH.live : SCH.dim} />
      {/* the water tower, draining */}
      <g transform="translate(900 300)">
        <rect x={-110} y={-150} width={220} height={160} rx={10} fill="none" stroke="#F6EFE3" strokeWidth={8} />
        <rect x={-104} y={10 - 154 * tower} width={208} height={154 * tower} fill="#6AB8E8" opacity={0.5} />
        <path d="M -80 10 L -100 260 M 80 10 L 100 260" stroke="#F6EFE3" strokeWidth={8} />
      </g>
      <SchLabel x={900} y={110} t={t - 8} text="WATER TOWER" size={34} />
      <Icon name="tap" x={1560} y={460} s={1} />
      <SchLabel x={1560} y={360} t={t - 12} text="YOUR TAP" size={34} />
      {t > stop + 30 ? <text x={960} y={980} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#FF3A3A">NO PRESSURE</text> : null}
    </g>
  );
};

// ---------- S3: your hand turns the kitchen tap all the way: a gurgle, nothing ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const turn = kf(t, [[0, 0], [12, 80]], easeOut);
  return (
    <g>
      <Soft blur={16} dim={0.3}><g transform={camT(960, 560, 1.6)}><DARKK t={t + 100} /></g></Soft>
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1.3], [len, 1.4]])}) translate(-960 -540)`}>
        <rect x={500} y={760} width={920} height={60} fill="#8A8EA0" stroke="#100E16" strokeWidth={8} />
        <path d="M 760 760 L 760 420 Q 760 330 860 330 L 1020 330 Q 1080 330 1080 390 L 1080 440" stroke="#B8BCC8" strokeWidth={44} fill="none" strokeLinecap="round" />
        <g transform={`rotate(${turn} 760 530)`}>
          <rect x={620} y={510} width={280} height={40} rx={14} fill="#9A9EAA" stroke="#100E16" strokeWidth={6} />
        </g>
        <path d={`M ${880 + turn} 1200 Q ${860 + turn} 800 ${860 + turn * 0.4} 560`} stroke="#F07A2A" strokeWidth={110} strokeLinecap="round" fill="none" />
        <ellipse cx={860 + turn * 0.4} cy={540} rx={66} ry={56} fill="#26232F" stroke="#100E16" strokeWidth={7} />
        {t > 16 && t < 22 ? <ellipse cx={1080} cy={480} rx={6} ry={10} fill="#6AB8E8" /> : null}
      </g>
      {t > 18 ? <text x={1300} y={380} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" opacity={clamp(1 - (t - 30) / 10)} transform="rotate(-6 1300 380)">gurgle...</text> : null}
    </g>
  );
};

// ---------- S4: DETROIT, AUGUST 2003 ----------
export const S4 = bigWord({ kicker: 'DETROIT, AUGUST', word: '2003', color: '#FFD23A' });

// ---------- S5: the fact: 126 communities told to boil their water ----------
export const S5 = factCard({ value: 126, label: 'COMMUNITIES TOLD TO BOIL THEIR WATER', sub: 'Detroit blackout, 2003: the pumps lost pressure' });

// ---------- S6: two bars: that blackout, two days; yours, forever (the bar runs off the frame) ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const yours = rel('lasted', 'Yours');
  const grow = clamp((t - yours) / 30);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
      <SchematicBg t={t} />
      <text x={200} y={420} fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill="#7E8DA6">DETROIT 2003</text>
      <rect x={200} y={450} width={260 * easeOut(clamp(t / 12))} height={90} fill="#6AB8E8" />
      <text x={490} y={515} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" opacity={clamp((t - 10) / 6)}>2 DAYS</text>
      {t >= yours ? (
        <g>
          <text x={200} y={680} fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill="#FF8A3D">YOURS</text>
          <rect x={200} y={710} width={1900 * grow} height={90} fill="#FF3A3A" />
          <text x={1500} y={660} fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#FF3A3A" opacity={clamp((t - yours - 12) / 6)}>FOREVER →</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S7: Ellie holds her nose in the hallway, eyes watering ----------
export const S7 = faceCU({
  look: ELLIE, Bg: CANDLELR, faces: [[0, 'oops']], yaw: 0.2, zoom: [3.6, 3.8], light: { x: 900, y: 640, o: 0.6 },
  pose: { armR: { a: 150, b: 60 } },
  extra: (t) => (
    <g>
      {[0, 1, 2].map((k) => (
        <path key={k} d={`M ${1040 + k * 30} ${420 - ((t * 1.4 + k * 14) % 50)} q 10 -14 0 -28 q -10 -14 0 -28`} stroke="#8AB84A" strokeWidth={6} fill="none" opacity={0.8 * (1 - ((t * 1.4 + k * 14) % 50) / 50)} />
      ))}
    </g>
  ),
});

// ---------- S8: the kitchen by candlelight: mum opens the fridge; no light inside, a warm breath out ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const m = stand(KITCHEN, 0.72, 0.42);
  const mom: Pose = { ...basePose, ...m, yaw: 0.6, expr: t > 14 ? 'worried' : 'neutral', armR: { a: 80, b: 10 }, blink: idleBlink(t, 3), look: 0.6 };
  const door = kf(t, [[0, 0], [12, 1]], easeOut);
  const a = KITCHEN.P(0.79, 0.16, 0.2);
  const b = KITCHEN.P(0.79, 1, 0.2);
  return (
    <g transform={camT(kf(t, [[0, 1180], [len, 1160]]), 560, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <DARKK t={t + 200} />
      {/* the open fridge door swung toward us, the inside dark with a few things */}
      <polygon points={`${a.x},${a.y} ${a.x - 160 * door},${a.y + 30 * door} ${b.x - 160 * door},${b.y - 30 * door} ${b.x},${b.y}`} fill="#7C8285" stroke="#100E16" strokeWidth={5} />
      <Hero look={MOM} pose={mom} />
      <Candle x={handAt(mom, 'L').x} y={handAt(mom, 'L').y} s={0.4} t={t} seed={4} />
    </g>
  );
};

// ---------- S9: the fact on the schematic: fridge 4 HOURS, full freezer 2 DAYS ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const second = rel('fridge', 'freezer');
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
      <SchematicBg t={t} />
      <SchLabel x={960} y={200} t={t} text="FOOD STAYS SAFE WITHOUT POWER FOR ABOUT" size={40} color={SCH.dim} />
      <Icon name="fridge" x={560} y={480} s={1.2} live={1} />
      <CountUp x={560} y={780} t={t - 6} to={4} dur={20} size={110} suffix=" HOURS" />
      <SchLabel x={560} y={860} t={t - 10} text="FRIDGE" size={36} />
      {t > second - 4 ? (
        <g>
          <Icon name="fridge" x={1360} y={480} s={1.2} live={1} />
          <CountUp x={1360} y={780} t={t - second} to={2} dur={16} size={110} suffix=" DAYS" />
          <SchLabel x={1360} y={860} t={t - second - 4} text="FULL FREEZER" size={36} />
        </g>
      ) : null}
      <SchLabel x={960} y={980} t={t - second - 20} text="USDA Food Safety and Inspection Service" size={30} color={SCH.dim} />
    </g>
  );
};

// ---------- S10: insert, the leftovers turning: a plate going green, flies circling ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const rot = clamp(t / 40);
  return (
    <g>
      <DarkBg t={t} />
      <Glow x={960} y={600} r={600} o={0.5} />
      <g transform={`translate(960 640) scale(${kf(t, [[0, 2], [len, 2.2]])})`}>
        <ellipse cx={0} cy={0} rx={200} ry={70} fill="#E8E0D0" stroke="#100E16" strokeWidth={6} />
        <ellipse cx={-40} cy={-10} rx={70} ry={26} fill={rot > 0.5 ? '#6A7A3A' : '#8A3A2A'} stroke="#100E16" strokeWidth={4} />
        <ellipse cx={60} cy={4} rx={50} ry={20} fill={rot > 0.3 ? '#8AA84A' : '#E8A84A'} stroke="#100E16" strokeWidth={4} />
        {Array.from({ length: 10 }).map((_, i) => (
          <circle key={i} cx={-100 + i * 22} cy={-14 + (i % 3) * 8} r={6 * rot} fill="#9AC86A" opacity={0.8} />
        ))}
        {[0, 1, 2].map((k) => {
          const a = t / 4 + k * 2.1;
          return <circle key={`f${k}`} cx={Math.cos(a) * (120 + k * 20)} cy={-90 + Math.sin(a * 1.7) * 30} r={6} fill="#100E16" />;
        })}
      </g>
    </g>
  );
};

// ---------- S11: icons: the truck needs fuel, the fuel pump needs power: crossed ----------
export const S11 = iconBoard({
  title: 'THE SHOPS CAN’T REFILL',
  items: [
    { name: 'truck', label: 'TRUCKS NEED FUEL', at: rel('shops', 'Trucks') - 4 },
    { name: 'fuel', label: 'FUEL PUMPS ARE ELECTRIC', at: rel('shops', 'pump') - 4, cross: rel('shops', 'electric') + 2 },
  ],
});

// ---------- S12: inside the supermarket: aisles in perspective, the shelves bare ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 560], [len, 540]]), kf(t, [[0, 1], [len, 1.12]]))}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#2A2A36" />
    <polygon points="-400,1300 2320,1300 1060,560 860,560" fill="#4A4652" />
    {[-1, 1].map((sd) => (
      <g key={sd}>
        <polygon points={sd < 0 ? '-400,-200 860,440 860,700 -400,1300' : '2320,-200 1060,440 1060,700 2320,1300'} fill="#5A5A6A" stroke="#100E16" strokeWidth={6} />
        {[0, 1, 2, 3].map((k) => {
          const y0 = 100 + k * 260;
          const p = (y: number) => (sd < 0 ? `-400,${y} 860,${440 + (y - -200) * (260 / 1500)}` : `2320,${y} 1060,${440 + (y - -200) * (260 / 1500)}`);
          return <polyline key={k} points={p(y0)} stroke="#2A2A36" strokeWidth={10} fill="none" />;
        })}
        {/* one dented can left, far down on the left */}
        {sd < 0 ? <Can x={420} y={612} s={0.9} /> : null}
      </g>
    ))}
    <rect x={860} y={420} width={200} height={140} fill="#1A1A24" />
    <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.3} />
  </g>
);

// ---------- S13: the bathroom: mum fills the bathtub with the last of the tap water ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const lvl = clamp(t / 60) * 0.6 + 0.1;
  const m: Pose = { ...basePose, x: 640, y: 900 - LEG_LEN * 1.15, scale: 1.15, yaw: 0.5, expr: 'neutral', armR: { a: 70, b: 30 }, blink: idleBlink(t, 4), look: 0.5, tilt: 10 };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 560, kf(t, [[0, 1.2], [len, 1.28]]))}>
      <rect x={-400} y={-400} width={2800} height={1300} fill="#3A4A5A" />
      {Array.from({ length: 16 }).map((_, i) => (
        <path key={i} d={`M ${-400 + i * 180} -400 L ${-400 + i * 180} 900`} stroke="#33424F" strokeWidth={4} />
      ))}
      <rect x={-400} y={900} width={2800} height={500} fill="#2A3440" />
      <rect x={1500} y={220} width={200} height={260} rx={10} fill="#8AA8C0" stroke="#100E16" strokeWidth={6} />
      {/* the tub */}
      <path d="M 820 640 L 1640 640 Q 1640 900 1500 920 L 960 920 Q 820 900 820 640 Z" fill="#F2F0EA" stroke="#100E16" strokeWidth={8} />
      <clipPath id="tubc"><path d="M 840 650 L 1620 650 Q 1620 890 1490 905 L 970 905 Q 840 890 840 650 Z" /></clipPath>
      <rect x={820} y={905 - 255 * lvl} width={820} height={300} fill="#6AB8E8" opacity={0.75} clipPath="url(#tubc)" />
      <path d="M 1580 640 L 1580 540 Q 1580 500 1540 500 L 1500 500 L 1500 530" stroke="#B8BCC8" strokeWidth={26} fill="none" strokeLinecap="round" />
      <rect x={1494} y={540} width={12} height={360 - 255 * lvl} fill="#6AB8E8" opacity={0.7} />
      <Hero look={MOM} pose={m} />
      <WaterBottle x={700} y={900} s={1} level={1} />
      <WaterBottle x={500} y={900} s={1} level={1} />
      <Candle x={1720} y={640} s={0.5} t={t} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.3} />
    </g>
  );
};

// ---------- S14: the bathtub, full, glowing like treasure: the most important thing you own ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <DarkBg t={t} />
    <Glow x={960} y={620} r={700} kind="cool" o={0.6} />
    <g transform={`translate(960 640) scale(${kf(t, [[0, 1.2], [len, 1.3]])}) translate(-1230 -780)`}>
      <path d="M 820 640 L 1640 640 Q 1640 900 1500 920 L 960 920 Q 820 900 820 640 Z" fill="#F2F0EA" stroke="#100E16" strokeWidth={8} />
      <ellipse cx={1230} cy={660} rx={390} ry={24} fill="#6AB8E8" />
      {[0, 1, 2, 3].map((k) => (
        <path key={k} d={`M ${900 + k * 200} 560 l 10 -30 l 10 30`} stroke="#FFF2B0" strokeWidth={6} fill="none" opacity={0.5 + 0.5 * Math.sin(t / 4 + k)} />
      ))}
    </g>
    <text x={960} y={220} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFD23A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp((t - 6) / 6)}>THE MOST VALUABLE THING YOU OWN</text>
  </g>
);

// ---------- S15: the living room, one candle stub burning down; Ellie yawns on mum's lap ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const c = LIVING.P(0.5, 0.86, 0.57);
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1000]]), 600, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <LivingRoom t={t + 400} power={0} candles={[]} veil={0.86} />
      <Candle x={c.x} y={c.y} s={0.45} t={t} h={kf(t, [[0, 0.5], [len, 0.15]])} glow={kf(t, [[0, 0.8], [len, 0.4]])} />
      <Hero look={MOM} pose={{ ...basePose, x: 1220, y: 840 - LEG_LEN * 1.0, scale: 1.0, yaw: -0.4, expr: 'tired', blink: idleBlink(t, 2) }} />
      <Hero look={ELLIE} pose={{ ...basePose, x: 1090, y: 860 - LEG_LEN * 0.7, scale: 0.7, yaw: -0.2, expr: t % 60 > 30 ? 'tired' : 'dizzy', blink: t % 60 > 30 ? 1 : 0, headTilt: 10 }} />
    </g>
  );
};

// ---------- S16: your bedroom at sunset-dark, you in bed, eyes open, the room going dark early ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.12);
  const me: Pose = { ...basePose, ...b, yaw: 0.3, expr: 'tired', blink: idleBlink(t, 3) };
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 800]]), 560, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Bedroom t={t + 100} lamp={0} veil={0.75} duvet={false} clock="" />
      <Hero look={YOU} pose={me} shadow={0} />
      <BedDuvet />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={kf(t, [[0, 0.45], [len, 0.65]])} />
    </g>
  );
};

// ---------- S17: THE BIG ONE ----------
export const S17 = bigWord({ kicker: 'THE BIGGEST PROBLEM', word: 'FOOD', color: '#FF8A3D' });

// ---------- S18: people icons multiplying: 1900, 1.6 billion; today, 8 billion ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const today = rel('nineteen', 'Today');
  const n = t < today ? 4 : Math.min(20, 4 + Math.floor((t - today) / 2));
  const Person: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => (
    <g transform={`translate(${x} ${y}) scale(${backOut(clamp(on))})`} stroke="#F6EFE3" strokeWidth={7} fill="none">
      <circle cx={0} cy={-60} r={22} />
      <path d="M 0 -36 L 0 20 M -30 -10 L 30 -10 M 0 20 L -22 70 M 0 20 L 22 70" strokeLinecap="round" />
    </g>
  );
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
      <SchematicBg t={t} />
      <SchLabel x={960} y={170} t={t} text={t < today ? 'IN 1900' : 'TODAY'} size={50} color={SCH.live} />
      {Array.from({ length: n }).map((_, i) => (
        <Person key={i} x={360 + (i % 10) * 135} y={430 + Math.floor(i / 10) * 230} on={(t - (i < 4 ? i * 2 : today + (i - 4) * 2)) / 6} />
      ))}
      <text x={960} y={960} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#F6EFE3">{t < today ? '1.6 BILLION' : '8 BILLION'}</text>
    </g>
  );
};

// ---------- S19: how do you feed them: machines, cold trucks, water pumps, fertilizer factories ----------
export const S19 = iconBoard({
  title: 'HOW 8 BILLION PEOPLE EAT',
  items: [
    { name: 'tractor', label: 'MACHINES', at: rel('Machines', 'Machines'), live: 0 },
    { name: 'truck', label: 'COLD TRUCKS', at: rel('Machines', 'cold') - 4, live: rel('Machines', 'cold') },
    { name: 'pump', label: 'WATER PUMPS', at: rel('Machines', 'pumps') - 4, live: rel('Machines', 'pumps') },
    { name: 'factory', label: 'FERTILIZER', at: rel('Machines', 'fertilizer') - 4, live: rel('Machines', 'fertilizer') },
  ],
});

// ---------- S20: the fact: factory fertilizer feeds about half the people alive ----------
export const S20 = factCard({ value: 48, suffix: '%', label: 'OF PEOPLE ALIVE ARE FED BY FACTORY-MADE FERTILIZER', sub: 'Erisman et al., Nature Geoscience 2008: about half' });

// ---------- S21: and without power, each one stops: crossed out on its word ----------
export const S21 = iconBoard({
  title: 'WITHOUT POWER',
  items: [
    { name: 'factory', label: 'FACTORIES', at: 0, cross: rel('Without', 'factories') + 6 },
    { name: 'tractor', label: 'TRACTORS', at: rel('Without', 'tractors') - 4, cross: rel('Without', 'tractors') + 10 },
    { name: 'pump', label: 'IRRIGATION', at: rel('Without', 'pumps') - 4, cross: rel('Without', 'pumps') + 10 },
  ],
});

// ---------- S22: the kitchen table at night: three plates, one can of beans, one candle ----------
export const S22 = talkShot({
  Set: DARKK, setT: 600,
  cast: [
    { look: YOU, ...stand(KITCHEN, 0.36, 0.4), yaw: 0.3, faces: [[0, 'worried']] },
    { look: MOM, ...stand(KITCHEN, 0.52, 0.38), yaw: 0, faces: [[0, 'worried']] },
    { look: ELLIE, ...stand(KITCHEN, 0.66, 0.42, 0.45), yaw: -0.3, faces: [[0, 'neutral']] },
  ],
  cam: { from: [960, 600, 1.5], to: [960, 610, 1.62] },
  front: (t) => (
    <g>
      <KitchenIsland />
      <Glow x={960} y={640} r={420} o={0.8} />
      <Candle x={1060} y={668} s={0.4} t={t} />
      <Can x={900} y={672} s={0.7} />
      {[780, 960, 1140].map((x, i) => (
        <ellipse key={i} cx={x} cy={690} rx={60} ry={14} fill="#E8E0D0" stroke="#100E16" strokeWidth={4} />
      ))}
    </g>
  ),
});

// ---------- S23: IT'S DINNER. ----------
export const S23 = bigWord({ kicker: "THE REAL DANGER ISN'T THE DARK", word: 'DINNER.', color: '#FF3A3A' });

void HeldCandle;
