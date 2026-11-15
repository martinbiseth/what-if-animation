import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, factCard, Schematic, SchLabel, SCH,
  KITCHEN, stand, talkShot, Sparkle, rnd, FloatLabel, KitchenIsland, islandTop, Plate, bedSit, BedDuvet, Bedroom, CLS, Paper,
} from '../../../engine';
import {
  YOU, MO, MOM, ELLIE, faceCU, bigWord, Soft, cues, span, CLASS, iqCard, IqHud, live, handAt, Icon, Thermo, DoublingBars, KIT, BED_MORNING, BED_NIGHT,
  TileFloor, Peas, lying, asleep, DAY, streetHip,
} from '../common';
import words from './words.json';

// Chapter 4, the catch. Day four, 1,600, and starving: three breakfasts, more than the family by lunch. Why: the
// brain is 2% of you and burns 20%; 80 watts for the body, 20 for the brain, a light bulb in your head, now sixteen.
// Fuel makes heat. The second catch: everyone at quarter speed, Mo's punchline, lonely in a full room. Day five:
// the soaked pillow, Mom's hand, 39.4; heatstroke at 40; doubling feels slow, then it isn't; day 10, day 30; the
// bathroom floor and the frozen peas: your brain cooks in three days.

const W = words as any;
const { rel, at } = cues(words);
const HOT = '#FF4A3A';

/** A plain head outline on the schematic, a light bulb (or many) glowing inside. */
const HeadBulbs: React.FC<{ t: number; n: number; heat?: number; label?: string }> = ({ t, n, heat = 0, label }) => {
  const cols = Math.ceil(Math.sqrt(n));
  return (
    <g>
      <path d="M 960 200 Q 1220 200 1250 470 Q 1260 560 1320 640 Q 1330 670 1290 680 L 1270 690 Q 1280 760 1240 790 Q 1180 820 1120 810 L 1110 900 L 760 900 L 760 760 Q 640 660 660 470 Q 690 200 960 200 Z" fill="#14223A" stroke={heat > 0.5 ? HOT : SCH.line} strokeWidth={8} />
      <Glow x={960} y={460} r={300 + 100 * heat} kind={heat > 0.5 ? 'red' : 'warm'} o={0.4 + 0.4 * heat} />
      {Array.from({ length: n }).map((_, i) => {
        const c = i % cols, r = Math.floor(i / cols);
        const s = n === 1 ? 1.6 : 1.6 / cols * 1.6;
        const x = 960 + (c - (cols - 1) / 2) * 110 * s, y = 470 + (r - (Math.ceil(n / cols) - 1) / 2) * 120 * s;
        const on = backOut(clamp((t - i * 1.2) / 6));
        return (
          <g key={i} transform={`translate(${x} ${y}) scale(${s * on})`}>
            <circle cy={-20} r={34} fill={heat > 0.5 ? '#FF8A5A' : '#FFE27A'} stroke="#100E16" strokeWidth={5} />
            <rect x={-16} y={10} width={32} height={26} rx={4} fill="#9A9AAA" stroke="#100E16" strokeWidth={4} />
          </g>
        );
      })}
      {label ? <SchLabel x={960} y={980} t={t - 6} text={label} size={46} color={heat > 0.5 ? HOT : SCH.live} /> : null}
    </g>
  );
};

// ---------- S1: DAY FOUR: 1,600 ----------
export const S1 = iqCard({ kicker: 'DAY FOUR', iq: 1600, from: 800, Bg: KIT });

// ---------- S2: close-up, you, hollow-eyed, a stomach growl wobbling the frame ----------
export const S2 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'tired']], yaw: 0.2, zoom: [3.3, 3.5], pose: { armL: { a: 20, b: 60 }, armR: { a: 20, b: 60 } }, extra: (t) => <FloatLabel x={300} y={60} t={t - 4} text="GRRRR" size={60} color="#FF8A3D" /> });

// ---------- S3: the island: plate after plate in front of you; the third one is Ellie's ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const p2 = rel('eat', 'second'), p3 = rel('eat', "Ellie's");
  const me = stand(KITCHEN, 0.48, 0.42);
  const el = stand(KITCHEN, 0.68, 0.44, 0.45);
  const plates = [0, p2, p3].filter((k) => t >= k).length;
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 960]]), 520, kf(t, [[0, 1.6], [len, 1.75]]))}>
      <KIT t={t + 100} />
      <Hero look={ELLIE} pose={live(t, { ...el, yaw: -0.4, look: -0.8, armL: { a: 30, b: 90 }, armR: t > p3 ? { a: 80, b: 10 } : { a: 30, b: 90 } }, [[0, 'neutral'], [Math.max(1, p3 + 4), 'worried']], 5)} />
      <Hero look={YOU} pose={live(t, { ...me, yaw: 0.1, headTilt: 14 + Math.sin(t / 2) * 4, armL: { a: 60 + Math.sin(t / 2) * 20, b: 90 }, armR: { a: 60 + Math.cos(t / 2) * 20, b: 90 } }, [[0, 'happy']], 3)} />
      <KitchenIsland stools />
      {Array.from({ length: plates }).map((_, i) => {
        const p = islandTop(0.42 + i * 0.07, 0.35);
        return <Plate key={i} x={p.x} y={p.y} s={0.35} />;
      })}
    </g>
  );
};

// ---------- S4: lunch: a tower of empty wrappers and plates; MORE THAN YOUR WHOLE FAMILY ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const still = rel('By', 'still');
  return (
    <g>
      <Soft blur={16} dim={0.35}><g transform={camT(960, 520, 1.8)}><KIT t={t + 200} /></g></Soft>
      <g transform={`translate(960 900) scale(${kf(t, [[0, 1], [len, 1.08]])})`}>
        {Array.from({ length: Math.min(12, Math.floor(t / 7) + 3) }).map((_, i) => (
          <g key={i} transform={`translate(${Math.sin(i * 1.7) * 12} ${-i * 46})`}>
            <ellipse cx={0} cy={0} rx={200} ry={30} fill="#F4F1EA" stroke="#100E16" strokeWidth={6} />
            <ellipse cx={0} cy={-6} rx={140} ry={18} fill="#E6DED0" />
          </g>
        ))}
      </g>
      <text x={960} y={170} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#FFD23A" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 6) / 6)}>MORE THAN THE WHOLE FAMILY</text>
      {t > still ? <FloatLabel x={1500} y={500} t={t - still} text="STILL HUNGRY" size={60} color="#FF8A3D" /> : null}
    </g>
  );
};

// ---------- S5: a body on the schematic; the brain lights: 2% OF YOUR WEIGHT ----------
const Body: React.FC<{ t: number; brain: number }> = ({ t, brain }) => (
  <g stroke={SCH.line} strokeWidth={8} fill="#14223A">
    <circle cx={640} cy={300} r={90} />
    <path d="M 560 420 L 720 420 L 760 720 L 700 720 L 690 960 L 590 960 L 580 720 L 520 720 Z" />
    <path d="M 560 440 L 460 640 M 720 440 L 820 640" fill="none" />
    <path d="M 600 270 Q 640 230 680 270 Q 700 320 640 330 Q 590 320 600 270 Z" fill={brain > 0 ? '#FF8A3D' : '#14223A'} stroke={brain > 0 ? '#FF8A3D' : SCH.line} strokeWidth={5} />
    {brain > 0 ? <Glow x={640} y={290} r={120} o={0.8 * brain} /> : null}
  </g>
);
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const two = rel("Here's", 'two');
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}><Schematic t={t} id="c4s5" /></g>
      <Body t={t} brain={clamp((t - two + 6) / 8)} />
      {t > two ? (
        <g transform={`translate(1300 520) scale(${backOut(clamp((t - two) / 9))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={190} fill="#FFD23A">2%</text>
          <text y={90} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={SCH.line}>OF YOUR WEIGHT</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S6: the energy pie: one fifth for the brain: 20% OF YOUR ENERGY ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 6) / 16));
  const a = k * 0.2 * Math.PI * 2;
  const R = 260;
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1.04], [len, 1]]))}><Schematic t={t} id="c4s6" /></g>
      <Body t={t} brain={1} />
      <g transform="translate(1300 520)">
        <circle r={R} fill="#14223A" stroke={SCH.line} strokeWidth={8} />
        <path d={`M 0 0 L 0 ${-R} A ${R} ${R} 0 ${a > Math.PI ? 1 : 0} 1 ${Math.sin(a) * R} ${-Math.cos(a) * R} Z`} fill="#FF8A3D" stroke="#100E16" strokeWidth={5} />
        <text x={120} y={-120} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFFFFF" opacity={k}>20%</text>
        <text y={R + 70} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={SCH.line}>OF YOUR ENERGY</text>
      </g>
    </g>
  );
};

// ---------- S7: asleep, and the brain still glowing through your head: the hungriest thing you own ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.12);
  return (
    <g transform={camT(kf(t, [[0, b.x + 220], [len, b.x + 160]]), b.y - 60, kf(t, [[0, 1.8], [len, 2.0]]))}>
      <Bedroom t={t + 400} duvet={false} clock="02:40" lamp={0} veil={0.75} />
      <Hero look={YOU} pose={{ ...basePose, ...asleep(b, t) } as Pose} shadow={0} />
      <BedDuvet />
      <Glow x={b.x + 14} y={b.y - 160 * b.scale} r={140 + 10 * Math.sin(t / 5)} o={0.7} />
    </g>
  );
};

// ---------- S8: the fact: 80 watts ----------
export const S8 = factCard({ value: 80, suffix: ' WATTS', label: 'YOUR WHOLE BODY, SITTING STILL', sub: 'ABOUT 20 OF THEM GO TO YOUR BRAIN' });

// ---------- S9: a 20-watt bulb inside a head ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}><Schematic t={t} id="c4s9" /></g>
    <HeadBulbs t={t} n={1} label="20 W. ALL DAY. EVERY DAY." />
  </g>
);

// ---------- S10: sixteen bulbs, the head turning hot: x16 ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.08]]))}><Schematic t={t} id="c4s10" /></g>
    <HeadBulbs t={t * 1.4} n={16} heat={clamp((t - 30) / 40)} label="×16 THE WORK" />
    <IqHud t={t} iq={1600} heat={clamp((t - 30) / 40)} />
  </g>
);

// ---------- S11: fuel makes heat: an arrow from a plate to a flame ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, 1)}><Schematic t={t} id="c4s11" /></g>
    <g transform={`translate(560 540) scale(${backOut(clamp(t / 8))})`}>
      <ellipse rx={150} ry={40} fill="none" stroke={SCH.line} strokeWidth={9} />
      <text y={120} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={SCH.line}>FUEL</text>
    </g>
    <path d={`M 760 540 L ${760 + 360 * clamp((t - 8) / 10)} 540`} stroke={SCH.live} strokeWidth={10} />
    {t > 18 ? <Icon name="fire" x={1360} y={530} s={1.6 * backOut(clamp((t - 18) / 8))} live={1} /> : null}
    {t > 18 ? <text x={1360} y={720} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={HOT}>HEAT</text> : null}
  </g>
);

// ---------- S12: catch two: Mo talking at quarter speed, a 0.25x chip, his words dragging ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const Inner = talkShot({
    Set: DAY, setT: 300,
    cast: [
      { look: MO, x: 820, y: streetHip(1), yaw: 0.4, faces: [[0, 'happy']], pose: { talk: 0.5 + 0.5 * Math.sin(t / 10), armR: { a: 40 + 20 * Math.sin(t / 12), b: -40 } } },
      { look: YOU, x: 1100, y: streetHip(1), yaw: -0.4, faces: [[0, 'tired']] },
    ],
    cam: { from: [960, 560, 1.5], to: [960, 560, 1.6] },
  });
  return (
    <g>
      <Inner t={t / 4} len={len / 4} f={0} />
      <g transform="translate(1680 110)">
        <rect x={-110} y={-44} width={220} height={88} rx={44} fill="#16131F" opacity={0.85} stroke="#FF8A3D" strokeWidth={4} />
        <text y={16} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#FF8A3D">0.25×</text>
      </g>
      <text x={700} y={240} fontFamily={FONT.hand} fontSize={56} fill="#FFFFFF" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">{'Sooo... whaaat... diiid...'.slice(0, Math.floor(t / 3))}</text>
    </g>
  );
};

// ---------- S13: Mo tells a joke and cracks up; you laugh a beat late ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const late = rel('Mo', 'laugh');
  const Inner = talkShot({
    Set: CLASS(<g />), setT: 500, words: W,
    cast: [
      { look: MO, ...stand(CLS, 0.4, 0.62, 0.55), yaw: 0.4, talk: [span(W, 'tells', 'it')], faces: [[0, 'happy']] },
      { look: YOU, ...stand(CLS, 0.58, 0.62, 0.55), yaw: -0.4, faces: [[0, 'neutral'], [late, 'happy']] },
    ],
    cam: { from: [960, 540, 1.35], to: [960, 540, 1.45] },
  });
  return (
    <g>
      <Inner t={t} len={len} f={t + at('Mo')} />
      <g opacity={clamp((t - 10) / 4)} transform="translate(1260 300)">
        <rect x={-120} y={-60} width={240} height={100} rx={24} fill="#F6EFE3" stroke="#100E16" strokeWidth={5} />
        <text y={4} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#100E16">(knew it)</text>
      </g>
    </g>
  );
};

// ---------- S14: you, alone in the middle of the noisy class, everyone blurred round you ----------
export const S14 = faceCU({ look: YOU, Bg: CLASS(<g />), faces: [[0, 'neutral'], [40, 'worried']], yaw: 0, eyes: 0, zoom: [2.6, 3.2], dark: 0.3, light: { x: 960, y: 300, kind: 'cool', o: 0.4 } });

// ---------- S15: DAY FIVE: 3,200 ----------
export const S15 = iqCard({ kicker: 'DAY FIVE', iq: 3200, from: 1600, Bg: BED_MORNING, color: '#FF8A3D' });

// ---------- S16: morning, you sitting up, sweat-soaked; Mom's hand on your forehead, pulled back fast ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.14);
  const touch = rel('You', 'puts', 1, 9), back = rel('You', 'back', 1, 9);
  const m = { x: b.x + 210 * b.scale * 1.0, y: b.y + 40 * b.scale, scale: b.scale * 1.12 };
  const reach = t < touch ? 0 : t < back ? easeOut(clamp((t - touch) / 8)) : 1 - easeOut(clamp((t - back) / 4));
  return (
    <g transform={camT(b.x + 120, b.y - 80, kf(t, [[0, 2.1], [len, 2.25]]))}>
      <Bedroom t={t + 500} duvet={false} clock="07:01" />
      <Hero look={YOU} pose={live(t, { ...b, yaw: 0.25, tilt: -6, headTilt: 10, armL: { a: 20, b: 20 }, armR: { a: 20, b: 20 } }, [[0, 'tired']], 3)} shadow={0} />
      <BedDuvet />
      <Hero look={MOM} pose={live(t, { ...m, yaw: -0.5, look: -1, armL: { a: 30 + 70 * reach, b: 10 }, tilt: -6 * reach }, [[0, 'worried'], [Math.max(1, back), 'shock']], 4)} />
      {[0, 1, 2].map((i) => {
        const k = (t + i * 11) % 30;
        return <path key={i} d={`M ${b.x - 40 + i * 40} ${b.y - 220 * b.scale + k * 2} q 6 10 0 16 q -8 -6 0 -16`} fill="#7AC8FF" opacity={1 - k / 30} />;
      })}
      {t > back ? <FloatLabel x={m.x} y={m.y - 260 * m.scale} t={t - back} text="HOT!" size={40} color={HOT} /> : null}
    </g>
  );
};

// ---------- S17: the thermometer: 39.4 ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const v = 37 + 2.4 * easeOut(clamp((t - 4) / 30));
  return (
    <g>
      <Soft blur={16} dim={0.35}><g transform={camT(800, 520, 2.2)}><BED_MORNING t={t + 600} /></g></Soft>
      <Thermo x={960} y={560} s={kf(t, [[0, 2.2], [len, 2.35]])} rot={-6} temp={v} />
    </g>
  );
};

// ---------- S18: the fact: 40 degrees, heatstroke ----------
export const S18 = factCard({ value: 40, suffix: ' °C', label: 'HEATSTROKE STARTS AT ABOUT', sub: '104 °F: THE BODY STARTS TO BREAK DOWN, THE BRAIN TOO' });

// ---------- S19: your temperature, day by day, creeping up to the red line ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const temps = [37.0, 37.2, 37.6, 38.3, 39.4];
  const X = (d: number) => 360 + d * 170, Y = (c: number) => 820 - (c - 36.5) * 180;
  const shown = clamp(t / 24) * (temps.length - 1);
  let d = `M ${X(0)} ${Y(temps[0])}`;
  temps.forEach((c, i) => { if (i > 0 && i <= shown + 1) { const k = Math.min(1, shown - (i - 1)); d += ` L ${X(i - 1) + (X(i) - X(i - 1)) * k} ${Y(temps[i - 1]) + (Y(c) - Y(temps[i - 1])) * k}`; } });
  return (
    <g>
      <g transform={camT(960, 540, 1)}><Schematic t={t} id="c4s19" /></g>
      <path d={`M 300 ${Y(40)} L 1700 ${Y(40)}`} stroke={HOT} strokeWidth={6} strokeDasharray="24 14" />
      <text x={1700} y={Y(40) - 20} textAnchor="end" fontFamily={FONT.ui} fontSize={36} fill={HOT}>40 °C</text>
      <path d={d} stroke={SCH.live} strokeWidth={10} fill="none" strokeLinejoin="round" />
      {temps.map((c, i) => (i <= shown ? <circle key={i} cx={X(i)} cy={Y(c)} r={12} fill={SCH.live} /> : null))}
      {[1, 2, 3, 4, 5, 6, 7, 8].map((dd) => <text key={dd} x={X(dd - 1)} y={900} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill={SCH.dim}>DAY {dd}</text>)}
      <path d={`M ${X(4)} ${Y(39.4)} L ${X(7)} ${Y(41.6)}`} stroke={HOT} strokeWidth={6} strokeDasharray="12 10" opacity={clamp((t - 30) / 10)} />
    </g>
  );
};

// ---------- S20: doubling: slow, then it isn't: ten bars, the last ones off the top; DAY 10: 102,400 ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const ten = rel("That's", 'ten', 1, 3);
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}><Schematic t={t} id="c4s20" /></g>
      <DoublingBars t={t} days={10} at={2} step={Math.max(3, (ten - 10) / 10)} y0={920} />
      {t > ten ? (
        <g transform={`translate(560 300) scale(${backOut(clamp((t - ten) / 9))})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={SCH.dim}>DAY 10</text>
          <text y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FFD23A">102,400</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S21: DAY 30: 107,374,182,400 ----------
export const S21 = bigWord({ kicker: 'DAY 30: IQ', word: '107,374,182,400', color: HOT, Bg: Schematic as any, size: 150 });

// ---------- S22: close-up: you won't make it to day thirty ----------
export const S22 = faceCU({ look: YOU, Bg: BED_MORNING, faces: [[0, 'worried']], yaw: 0.1, zoom: [3.5, 3.8], dark: 0.35, light: { x: 960, y: 300, kind: 'red', o: 0.6 } });

// ---------- S23: from above: you on the bathroom tiles, a bag of frozen peas on your head, doing the math in the air ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const p = lying(980, 560, 1.7, { expr: 'tired', blink: idleBlink(t, 3), look: 0 });
  const cook = rel('math', 'cooks');
  return (
    <g>
      <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1.25]]))}>
        <TileFloor t={t} />
        <Hero look={YOU} pose={p} shadow={0} />
        <Peas x={980 - 330} y={560 - 110} s={0.9} rot={-60} />
      </g>
      {['2ⁿ', '39.4 → 40', 'DAY 8'].map((w, i) => (
        <text key={w} x={560 + i * 400} y={130 + (i % 2) * 50} textAnchor="middle" fontFamily={FONT.hand} fontSize={60} fill="#FFFFFF" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={clamp((t - 6 - i * 14) / 6)}>{w}</text>
      ))}
      {t > cook ? <text x={960} y={980} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill={HOT} stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - cook) / 6)}>3 DAYS</text> : null}
    </g>
  );
};
