import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, Schematic, SchLabel, SCH,
  KITCHEN, stand, talkShot, rnd, FloatLabel, KitchenIsland, Paper,
} from '../../../engine';
import {
  YOU, MOM, ELLIE, SUIT, faceCU, bigWord, Soft, cues, span, live, Icon, KIT, TvFront, LaptopFront, DocLines, Car, streetHip, STREETM,
} from '../common';
import { StreetModern } from '../../electricity/sets';
import words from './words.json';

// Chapter 5, someone notices. The black car outside since lunch; the proof that nobody can break, on the TV news;
// traced to the school computer; the man in the grey suit at the kitchen table: a lab, the best doctors, every
// unsolved problem. But you read him like a book: his eyes on Ellie, "keep you cool", the second man in the car.
// They want everything before day eight. And if you say no? A thousand futures, some with Ellie in them.

const W = words as any;
const { rel } = cues(words);
const RED = '#FF4A3A';
const HOME: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" power={0} car={false} />;
const BLACK = '#17181F';

// ---------- S1: the street by day: a black car parked across from your house ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1180]]), 560, kf(t, [[0, 1.05], [len, 1.25]]))}>
    <HOME t={t + 100} />
    <Car x={1320} y={STREETM.kerb + 60} s={1} color={BLACK} />
    <rect x={1230} y={STREETM.kerb - 110} width={130} height={46} fill="#05050A" opacity={0.6} />
  </g>
);

// ---------- S2: closer: the windscreen, a shape behind it, not moving; a clock chip SINCE 12:04 ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(1320, STREETM.kerb - 40, kf(t, [[0, 3.2], [len, 3.4]]))}>
      <HOME t={t + 200} />
      <Car x={1320} y={STREETM.kerb + 60} s={1} color={BLACK} />
      <clipPath id="c5win2"><rect x={1196} y={STREETM.kerb - 124} width={150} height={66} /></clipPath>
      <g clipPath="url(#c5win2)"><Hero look={SUIT} pose={{ ...basePose, x: 1250, y: STREETM.kerb - 20, scale: 0.42, yaw: -0.2, expr: 'neutral', blink: 0, look: -0.6 }} shadow={0} /></g>
      <path d={`M 1200 ${STREETM.kerb - 110} L 1340 ${STREETM.kerb - 110} L 1340 ${STREETM.kerb - 60} L 1200 ${STREETM.kerb - 60} Z`} fill="#8AB0D0" opacity={0.25} />
    </g>
    <g transform="translate(1620 120)" opacity={clamp(t / 6)}>
      <rect x={-170} y={-44} width={340} height={88} rx={44} fill="#16131F" opacity={0.85} stroke={RED} strokeWidth={4} />
      <text y={14} textAnchor="middle" fontFamily={FONT.ui} fontSize={38} fill={RED}>SINCE 12:04</text>
    </g>
  </g>
);

// ---------- S3: the proof you posted, the name field empty ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A1A26" />
    <g transform={`translate(960 860) scale(${kf(t, [[0, 1.6], [len, 1.7]])}) translate(-960 -860)`}>
      <LaptopFront x={960} y={860} w={900} t={t} screen={
        <g>
          <DocLines w={856} n={13} title="A proof (12 pages), posted by: anonymous" seed={3} />
          <rect x={600} y={436} width={220} height={52} rx={26} fill="#5AE09A" />
          <text x={710} y={470} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#FFFFFF">POSTED ✓</text>
        </g>
      } />
    </g>
  </g>
);

// ---------- S4: the world on the schematic: dots lighting up everywhere: CHECKING... 0 MISTAKES ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const none = rel('Mathematicians', 'single');
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}><Schematic t={t} id="c5s4" /></g>
      <ellipse cx={960} cy={540} rx={760} ry={330} fill="#14223A" stroke={SCH.dim} strokeWidth={5} />
      {[[560, 420], [700, 520], [820, 380], [1000, 450], [1100, 600], [1280, 420], [1400, 520], [640, 640], [1500, 380], [900, 620], [1200, 300], [760, 300]].map(([x, y], i) => {
        const on = clamp((t - 4 - i * 3) / 6);
        return (
          <g key={i} opacity={on}>
            <circle cx={x} cy={y} r={12} fill={SCH.live} />
            <Glow x={x} y={y} r={50} o={0.6} />
            <path d={`M ${x} ${y} L 960 540`} stroke={SCH.live} strokeWidth={2} opacity={0.4} />
          </g>
        );
      })}
      <circle cx={960} cy={540} r={34} fill="#F4EEE0" stroke="#100E16" strokeWidth={5} />
      <SchLabel x={960} y={150} t={t - 2} text="CHECKING THE PROOF..." size={44} color={SCH.line} />
      <SchLabel x={960} y={950} t={t - none} text="MISTAKES FOUND: 0" size={52} color="#5AE09A" />
    </g>
  );
};

// ---------- S5: the TV news: a professor holds up a printout: "just changed mathematics forever" ----------
export const S5: React.FC<ShotProps> = ({ t, len, f }) => {
  const [a, b] = span(W, 'Whoever', 'forever');
  const s = (f ?? t) / 30;
  const talk = s >= a && s < b ? Math.abs(Math.sin(t / 2.2)) : 0;
  return (
    <TvFront t={t} Bg={KIT} s={kf(t, [[0, 0.95], [len, 1.02]])}>
      <rect width={1200} height={680} fill="#2A3A5A" />
      <rect x={760} y={60} width={380} height={260} fill="#3A4A6A" />
      <Hero look={{ ...MOM, jacket: '#8A2E3A', jacketShade: '#70252E', extra: 'bob' } as any} pose={live(t, { x: 420, y: 470, scale: 1.25, yaw: 0.1, talk, armR: { a: 150, b: 30 } }, [[0, 'happy']], 8)} />
      <g transform={`translate(560 210) rotate(6)`}><Paper x={0} y={0} w={150} done={false} fill={1} /></g>
      <rect y={540} width={1200} height={140} fill="#C8322E" />
      <text x={30} y={600} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFFFFF">MYSTERY PROOF SOLVES 100-YEAR PROBLEM</text>
      <text x={30} y={652} fontFamily={FONT.ui} fontSize={30} fill="#FFFFFF">Author unknown · Mathematicians: "no mistakes"</text>
      <text x={1160} y={50} textAnchor="end" fontFamily={FONT.ui} fontSize={28} fill="#FFFFFF">● LIVE</text>
    </TvFront>
  );
};

// ---------- S6: traced: a line from the post back to SCHOOL COMPUTER 3, 11:42; ONE STUDENT IN THE ROOM ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp((t - 4) / 24));
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}><Schematic t={t} id="c5s6" /></g>
      <Icon name="message" x={360} y={540} s={1.2} />
      <path d={`M 480 540 L ${480 + 900 * k} 540`} stroke={RED} strokeWidth={8} strokeDasharray="22 12" />
      {k > 0.95 ? (
        <g>
          <Icon name="screen" x={1500} y={520} s={1.4} live={1} />
          <SchLabel x={1500} y={720} t={t - 30} text="SCHOOL COMPUTER 3" size={40} color={SCH.line} />
          <SchLabel x={1500} y={780} t={t - 36} text="11:42 AM" size={40} color={RED} />
        </g>
      ) : null}
      <SchLabel x={960} y={940} t={t - rel('And', 'only')} text="IN THE ROOM: 1 STUDENT" size={46} color={RED} />
    </g>
  );
};

// ---------- S7: a man in a grey suit walks up to your door and knocks ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const knock = rel('A', 'knocks', 1, 5);
  const walk = clamp(t / Math.max(1, knock));
  const ph = t * 0.5;
  const x = 820 + 220 * walk;
  const kn = t > knock ? Math.sin((t - knock) * 1.2) : 0;
  const pose: Pose = {
    ...basePose, x, y: streetHip(0.95) - (walk < 1 ? Math.abs(Math.cos(ph)) * 5 : 0), scale: 0.95, yaw: walk < 1 ? 0.7 : 0.6, facing: 1,
    legL: { a: walk < 1 ? 22 * Math.sin(ph) : 0, b: -10 }, legR: { a: walk < 1 ? -22 * Math.sin(ph) : 0, b: -10 },
    armR: walk < 1 ? { a: 16 * Math.sin(ph), b: -10 } : { a: 100 + kn * 10, b: 60 }, armL: { a: -10, b: -10 }, expr: 'smug', blink: idleBlink(t, 4),
  };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1060]]), 620, 1.7)}>
      <HOME t={t + 300} />
      <Car x={1500} y={STREETM.kerb + 60} s={1} color={BLACK} />
      <Hero look={SUIT} pose={pose} />
      {t > knock ? [0, 1].map((i) => <text key={i} x={1180 + i * 40} y={STREETM.feet - 200 - i * 30} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFFFFF" stroke="#0B0816" strokeWidth={6} paintOrder="stroke" opacity={clamp((t - knock - i * 6) / 3) * clamp(1 - (t - knock - i * 6 - 12) / 6)}>KNOCK</text>) : null}
    </g>
  );
};

// ---------- S8: the kitchen table: the suit sits, smiles: "We've been looking for someone like you" ----------
export const S8 = talkShot({
  Set: KIT, setT: 400, words: W,
  cast: [
    { look: MOM, ...stand(KITCHEN, 0.28, 0.4), yaw: 0.4, faces: [[0, 'worried']], pose: { armL: { a: 40, b: 120 }, armR: { a: 40, b: 120 } } },
    { look: SUIT, ...stand(KITCHEN, 0.48, 0.44), yaw: 0.35, talk: [span(W, "We've", 'time')], faces: [[0, 'smug']] },
    { look: YOU, ...stand(KITCHEN, 0.68, 0.42), yaw: -0.4, faces: [[0, 'neutral']] },
  ],
  cam: { from: [960, 520, 1.45], to: [940, 520, 1.6] },
  front: () => <KitchenIsland stools />,
});

// ---------- S9: the offer on the schematic: A LAB, THE BEST DOCTORS, COOLING ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const items = [['A LAB', 'factory'], ['THE BEST DOCTORS', 'heart'], ['TO KEEP YOU COOL', 'pump']] as const;
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}><Schematic t={t} id="c5s9" /></g>
      {items.map(([label, icon], i) => {
        const x = 960 + (i - 1) * 520;
        const pop = backOut(clamp((t - 4 - i * 26) / 8));
        return (
          <g key={label} transform={`translate(${x} 520) scale(${pop}) translate(${-x} -520)`}>
            <Icon name={icon as any} x={x} y={500} s={1.4} live={1} />
            <text x={x} y={720} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={SCH.line}>{label}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- S10: every unsolved problem: cards fanning out: CANCER, CLEAN ENERGY, ... ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const cards = ['CANCER', 'CLEAN ENERGY', 'ALZHEIMER\'S', 'FUSION', 'AGEING', 'DARK MATTER', 'P vs NP'];
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}><Schematic t={t} id="c5s10" /></g>
      <SchLabel x={960} y={160} t={t - 2} text="EVERY UNSOLVED PROBLEM" size={48} color={SCH.live} />
      {cards.map((c, i) => {
        const on = backOut(clamp((t - 6 - i * 6) / 9));
        const gx = 960 + ((i < 4 ? i : i - 4) - (i < 4 ? 1.5 : 1)) * 380, gy = i < 4 ? 420 : 680;
        return (
          <g key={c} transform={`translate(${gx} ${gy}) rotate(${(rnd(2, i) - 0.5) * 8}) scale(${on})`} opacity={clamp(on)}>
            <rect x={-150} y={-90} width={300} height={180} rx={16} fill="#14223A" stroke={SCH.line} strokeWidth={5} />
            <text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={c.length > 10 ? 32 : 40} fill={SCH.line}>{c}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- S11: close-up, you: amazing... then the eyes narrow: you're smarter than him now ----------
export const S11 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'happy'], [rel('It', 'Except', 1, 3), 'cool']], yaw: -0.3, zoom: [3.2, 3.5] });

// ---------- S12: the suit's face, and analysis brackets snapping onto him: you read him like a book ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const Inner = faceCU({ look: SUIT, Bg: KIT, faces: [[0, 'smug']], yaw: 0.3, zoom: [3.1, 3.3] });
  const br = (x: number, y: number, w: number, h: number, d: number, label: string) => {
    const k = backOut(clamp((t - d) / 6));
    return (
      <g opacity={clamp((t - d) / 3)} stroke="#FFD23A" strokeWidth={6} fill="none">
        <path d={`M ${x - w / 2 * k} ${y - h / 2 + 30} L ${x - w / 2 * k} ${y - h / 2} L ${x - w / 2 * k + 30} ${y - h / 2} M ${x + w / 2 * k - 30} ${y + h / 2} L ${x + w / 2 * k} ${y + h / 2} L ${x + w / 2 * k} ${y + h / 2 - 30}`} />
        <text x={x + w / 2 + 20} y={y} stroke="none" fill="#FFD23A" fontFamily={FONT.ui} fontSize={30}>{label}</text>
      </g>
    );
  };
  return (
    <g>
      <Inner t={t} len={len} f={t} />
      {br(900, 380, 300, 140, 4, 'SMILE: PRACTISED')}
      {br(980, 720, 240, 120, 14, 'HANDS: STILL')}
    </g>
  );
};

// ---------- S13: his eyes go to Ellie in the doorway, a red line from his eyes to her ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const s = stand(KITCHEN, 0.42, 0.46);
  const e = stand(KITCHEN, 0.86, 0.3, 0.45);
  const look = clamp((t - 10) / 8);
  const eye = { x: s.x + 20 * s.scale, y: s.y - 230 * s.scale };
  const head = { x: e.x, y: e.y - 230 * e.scale };
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1040]]), 500, 1.5)}>
      <KIT t={t + 500} />
      <Hero look={ELLIE} pose={live(t, { ...e, yaw: -0.4, look: -0.8 }, [[0, 'neutral']], 6)} />
      <Hero look={SUIT} pose={live(t, { ...s, yaw: 0.5 + 0.3 * look, look: 0.4 + 0.6 * look }, [[0, 'smug']], 2)} />
      <KitchenIsland stools />
      {look > 0 ? <path d={`M ${eye.x} ${eye.y} L ${eye.x + (head.x - eye.x) * look} ${eye.y + (head.y - eye.y) * look}`} stroke={RED} strokeWidth={4} strokeDasharray="14 10" /> : null}
      {look >= 1 ? <circle cx={head.x} cy={head.y} r={70 * e.scale + 30} fill="none" stroke={RED} strokeWidth={4} /> : null}
    </g>
  );
};

// ---------- S14: his words on a card: KEEP YOU COOL, and below, crossed out: KEEP YOU SAFE ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const safe = rel('You', 'safe', 1, 1);
  return (
    <g>
      <Soft blur={16} dim={0.55}><g transform={camT(960, 520, 1.8)}><KIT t={t + 600} /></g></Soft>
      <text x={960} y={460} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={130} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" transform={`scale(1)`} opacity={clamp(t / 6)}>"KEEP YOU COOL"</text>
      <g opacity={clamp((t - 30) / 6)}>
        <text x={960} y={680} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#7E8DA6" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">"KEEP YOU SAFE"</text>
        <path d={`M 520 650 L ${520 + 880 * clamp((t - 40) / 8)} 650`} stroke={RED} strokeWidth={14} strokeLinecap="round" />
      </g>
      {safe > 1e9 ? null : null}
    </g>
  );
};

// ---------- S15: the black car, the second man in it, a timer: 4 HOURS. HASN'T MOVED. ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 1300], [len, 1290]]), STREETM.kerb - 60, kf(t, [[0, 2.6], [len, 3.1]]))}>
      <HOME t={t + 700} />
      <Car x={1320} y={STREETM.kerb + 60} s={1} color={BLACK} />
      <clipPath id="c5win15"><rect x={1196} y={STREETM.kerb - 124} width={150} height={66} /></clipPath>
      <g clipPath="url(#c5win15)"><Hero look={{ ...SUIT, jacket: '#2A2D36', jacketShade: '#20232A' } as any} pose={{ ...basePose, x: 1260, y: STREETM.kerb - 20, scale: 0.42, yaw: -0.6, expr: 'neutral', blink: 0, look: -1 }} shadow={0} /></g>
      <path d={`M 1200 ${STREETM.kerb - 110} L 1340 ${STREETM.kerb - 110} L 1340 ${STREETM.kerb - 60} L 1200 ${STREETM.kerb - 60} Z`} fill="#8AB0D0" opacity={0.25} />
    </g>
    <text x={960} y={980} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={6} fill={RED} opacity={clamp((t - 8) / 6)}>{`HASN'T MOVED: 4:00:${String(Math.floor(t / 30) % 60).padStart(2, '0')}`}</text>
  </g>
);

// ---------- S16: close-up, you: they don't care if your brain cooks; the light turns red ----------
export const S16 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'worried']], yaw: 0.2, zoom: [3.4, 3.8], dark: 0.3, light: { x: 960, y: 300, kind: 'red', o: 0.6 } });

// ---------- S17: BEFORE DAY 8 ----------
export const S17 = bigWord({ kicker: 'EVERY ANSWER', word: 'BEFORE DAY 8', color: RED, size: 190 });

// ---------- S18-19: the futures: a tree of branches growing from YOU; most turn red; one with Ellie in it ----------
const Tree: React.FC<{ t: number; red: number; ellie: number }> = ({ t, red, ellie }) => {
  const lines: React.ReactNode[] = [];
  let k = 0;
  const grow = (x: number, y: number, a: number, len: number, depth: number) => {
    if (depth > 5) return;
    const i = k++;
    const on = clamp((t - depth * 7) / 7);
    const x2 = x + Math.cos(a) * len * on, y2 = y + Math.sin(a) * len * on;
    const isRed = rnd(9, i) < red;
    lines.push(<path key={i} d={`M ${x} ${y} L ${x2} ${y2}`} stroke={isRed ? RED : SCH.line} strokeWidth={Math.max(2, 9 - depth * 1.4)} opacity={on} />);
    if (depth === 5 && on >= 1 && ellie > 0 && i % 9 === 3) lines.push(<g key={`e${i}`} opacity={ellie}><circle cx={x2} cy={y2} r={16} fill={RED} /><text x={x2} y={y2 - 26} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill={RED}>ELLIE</text></g>);
    if (on >= 1) { grow(x2, y2, a - 0.42, len * 0.72, depth + 1); grow(x2, y2, a + 0.42, len * 0.72, depth + 1); }
  };
  grow(960, 980, -Math.PI / 2, 260, 0);
  return <g>{lines}</g>;
};
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}><Schematic t={t} id="c5s18" /></g>
    <Tree t={t} red={0} ellie={0} />
    <SchLabel x={960} y={120} t={t - 4} text="AND IF YOU SAY NO?" size={48} color={SCH.line} />
    <SchLabel x={960} y={1040} t={t - 2} text="YOU" size={36} color="#FFD23A" />
  </g>
);
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const some = rel('most', 'some');
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1.04], [len, 1.1]]))}><Schematic t={t} id="c5s19" /></g>
      <Tree t={t + 60} red={clamp(t / 30) * 0.8} ellie={clamp((t - some) / 8)} />
      <SchLabel x={960} y={120} t={t - 4} text={t < some ? 'MOST: THEY TAKE YOU ANYWAY' : 'SOME: THEY TAKE ELLIE TOO'} size={46} color={RED} />
    </g>
  );
};

// ---------- S20: at the door, leaving: "Take the night. We'll be right outside." ----------
export const S20 = talkShot({
  Set: KIT, setT: 800, words: W,
  cast: [
    { look: SUIT, ...stand(KITCHEN, 0.3, 0.5), yaw: 0.5, talk: [span(W, 'Take', 'night', 3), span(W, "We'll", 'outside')], faces: [[0, 'smug']], pose: { armR: { a: 30, b: -20 } } },
    { look: YOU, ...stand(KITCHEN, 0.62, 0.42), yaw: -0.4, faces: [[0, 'worried']] },
  ],
  cam: { from: [880, 520, 1.6], to: [860, 520, 1.85] },
});
