import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, AlarmClock, Sparkle,
  bedSit, BedDuvet, Bedroom, KITCHEN, KitchenIsland, islandTop, stand, Schematic, SchLabel, SCH, rnd, Desk,
} from '../../../engine';
import {
  YOU, MOM, ELLIE, faceCU, Soft, cues, span, live, BED_MORNING, KIT, STUDY_SET, DAY, PuzzleCube, IqHud, Notebook, OpenNotebook,
} from '../common';
import words from './words.json';

// Chapter 7, the last morning. 7:00, normal tired, a hundred again. A stack of notebooks you can't read, one line
// you can: "Don't let them have this." The black car is gone. Downstairs Ellie solves Mom's cube one-handed:
// "Why does everything feel so easy today?" It only happens to you. That was the rule. The question, the comments,
// the science check, and Part 2.

const W = words as any;
const { rel } = cues(words);
const RED = '#FF4A3A';

/** Two small hands (Ellie's sleeves from below) holding the cube up to camera. */
const CubeInHands: React.FC<{ t: number; solved: number; twist: number; s?: number; shake?: number }> = ({ t, solved, twist, s = 1, shake = 0 }) => {
  const j = shake * Math.sin(t * 2.3) * 8;
  const sleeve = (ELLIE as any).jacket ?? '#3AA6A0';
  return (
    <g transform={`translate(${960 + j} 640) scale(${s})`}>
      {[-1, 1].map((sd) => (
        <path key={sd} d={`M ${sd * 330} 600 Q ${sd * 350} 320 ${sd * 290} 140 L ${sd * 200} 170 Q ${sd * 225} 380 ${sd * 160} 600 Z`} fill={sleeve} stroke="#100E16" strokeWidth={8} />
      ))}
      <PuzzleCube x={0} y={60} s={1.05} solved={solved} twist={twist} />
      {[-1, 1].map((sd) => (
        <g key={`h${sd}`}>
          <ellipse cx={sd * 235} cy={120} rx={78} ry={66} fill="#26232F" stroke="#100E16" strokeWidth={8} />
          <ellipse cx={sd * 195} cy={40} rx={32} ry={25} fill="#26232F" stroke="#100E16" strokeWidth={7} />
        </g>
      ))}
    </g>
  );
};

const Bowl: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={-26} rx={46} ry={12} fill="#F6EFE3" stroke="#100E16" strokeWidth={4} />
    {[-24, -8, 10, 26].map((dx, i) => <circle key={i} cx={dx} cy={-28 + (i % 2) * 3} r={6} fill="#E0A85A" stroke="#100E16" strokeWidth={2} />)}
    <path d="M -46 -26 Q -40 10 0 10 Q 40 10 46 -26" fill="#4A90C8" stroke="#100E16" strokeWidth={4} />
  </g>
);

// ---------- S1: insert, the alarm clock: 07:00, ringing like any other morning ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const ring = Math.sin(t * 2.8) * 3;
  return (
    <g>
      <Soft blur={16} dim={0.3}><g transform={camT(1150, 520, 2.2)}><BED_MORNING t={t + 50} /></g></Soft>
      <g transform={`translate(960 700) scale(${kf(t, [[0, 3.0], [len, 3.2]])}) rotate(${ring})`}>
        <AlarmClock x={0} y={0} s={1} text="07:00" on={t % 10 < 7 ? 1 : 0.6} />
      </g>
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${560 - i * 40} ${380 - i * 30} q -30 40 0 80`} stroke="#FFE7B3" strokeWidth={8} fill="none" strokeLinecap="round" opacity={t % 8 < 5 ? 0.8 : 0.2} />
      ))}
      {[0, 1, 2].map((i) => (
        <path key={`r${i}`} d={`M ${1360 + i * 40} ${380 - i * 30} q 30 40 0 80`} stroke="#FFE7B3" strokeWidth={8} fill="none" strokeLinecap="round" opacity={t % 8 < 5 ? 0.8 : 0.2} />
      ))}
    </g>
  );
};

// ---------- S2: the bedroom in daylight: you sit up slowly, rub your eyes. Normal tired. ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const b = bedSit(0.14);
  const up = easeOut(clamp((t - 4) / 30));
  const rub = t > 30 && t < 60;
  const me: Pose = {
    ...basePose, ...b, y: b.y + (1 - up) * 40, yaw: 0.25, tilt: -40 * (1 - up), headTilt: 8,
    expr: 'tired', blink: up < 0.4 ? 1 : idleBlink(t, 3), armL: { a: 20, b: 20 }, armR: rub ? { a: 150, b: 120 + Math.sin(t) * 10 } : { a: 20 + 10 * up, b: 20 }, look: 0.1,
  };
  return (
    <g transform={camT(kf(t, [[0, b.x + 120], [len, b.x + 110]]), b.y - 20, kf(t, [[0, 2.0], [len, 2.1]]))}>
      <Bedroom t={t + 100} duvet={false} clock="07:00" />
      <Hero look={YOU} pose={me} shadow={0} />
      <BedDuvet />
    </g>
  );
};

// ---------- S3: close-up, calm: head cool, mind quiet; the HUD counts all the way back down to 100 ----------
const S3Face = faceCU({ look: YOU, Bg: BED_MORNING, faces: [[0, 'tired'], [50, 'neutral']], yaw: 0.15, zoom: [3.3, 3.5], light: { x: 1200, y: 300, kind: 'cool', o: 0.4 } });
export const S3: React.FC<ShotProps> = (p) => {
  const h = rel('Your', 'hundred', 1, 2);
  return (
    <g>
      <S3Face {...p} />
      <IqHud t={p.t} iq={100} from={3200} at={Math.max(4, h - 30)} />
    </g>
  );
};

// ---------- S4: the desk: a stack of notebooks, your own handwriting on the spines; a slow push ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 960]]), kf(t, [[0, 640], [len, 700]]), kf(t, [[0, 1.5], [len, 1.9]]))}>
    <STUDY_SET t={t + 200} />
    <Desk x0={620} x1={1300} y={880} laptop={false} lamp />
    {Array.from({ length: 9 }).map((_, i) => {
      const cols = ['#C8553D', '#3E6A8A', '#4E7A4A', '#C9A13A', '#7A4A6A'];
      const w = 230 + Math.sin(i * 2.3) * 16;
      return (
        <g key={i} transform={`translate(${900 + Math.sin(i * 2.7) * 10} ${872 - i * 22}) rotate(${Math.sin(i * 1.9) * 2})`}>
          <rect x={-w / 2} y={-20} width={w} height={20} rx={4} fill={cols[i % 5]} stroke="#100E16" strokeWidth={4} />
          <path d={`M ${-w / 2 + 30} -10 q 20 -5 40 0 t 40 0`} stroke="#F6EFE3" strokeWidth={3} fill="none" opacity={0.8} />
        </g>
      );
    })}
    <Glow x={960} y={560} r={500} kind="cool" o={0.25} />
  </g>
);

// ---------- S5: the first notebook open: dense, wild, unreadable; a question mark floats up ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2232" />
    <Glow x={960} y={300} r={800} kind="cool" o={0.3} />
    <g transform={`translate(960 600) scale(${kf(t, [[0, 1], [len, 1.12]])}) translate(-960 -600)`}>
      <OpenNotebook x={960} y={600} w={1300} fill={1} seed={11} />
    </g>
    <text x={1560} y={360 - clamp(t / 30) * 60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={200} fill="#FFD23A" stroke="#0B0816" strokeWidth={14} paintOrder="stroke" opacity={clamp((t - 20) / 8)} transform={`rotate(10 1560 300)`}>?</text>
  </g>
);

// ---------- S6: the last page: one line in plain words. Don't let them have this. Push in on it. ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const at = rel('On', "Don't", 1, 2);
  const z = kf(t, [[0, 1], [Math.max(at, 1), 1.05], [len, 2.2]], easeOut);
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2232" />
      <g transform={`translate(960 540) scale(${z}) translate(${-kf(t, [[0, 960], [Math.max(at, 1), 1000], [len, 1285]], easeOut)} ${-kf(t, [[0, 600], [Math.max(at, 1), 640], [len, 975]], easeOut)})`}>
        <OpenNotebook x={960} y={600} w={1300} fill={0.25} seed={23} readable={t > at - 10 ? "Don't let them have this." : undefined} />
      </g>
    </g>
  );
};

// ---------- S7: through the bedroom window: the street in morning light, and the kerb where the car was, empty ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 1180], [len, 1260]]), 640, 1.6)}><DAY t={t + 500} /></g>
    {/* window frame */}
    <path d="M 0 0 H 1920 V 1080 H 0 Z M 260 120 V 1000 H 1660 V 120 Z" fill="#2B2436" fillRule="evenodd" />
    <rect x={952} y={120} width={16} height={880} fill="#2B2436" />
    <rect x={260} y={548} width={1400} height={16} fill="#2B2436" />
    <path d={`M 0 0 L 420 0 Q ${330 + Math.sin(t / 20) * 6} 500 360 1080 L 0 1080 Z`} fill="#6A4E7A" stroke="#100E16" strokeWidth={6} />
    <path d={`M 1920 0 L 1500 0 Q ${1590 + Math.sin(t / 20) * 6} 500 1560 1080 L 1920 1080 Z`} fill="#6A4E7A" stroke="#100E16" strokeWidth={6} />
    <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.04} />
  </g>
);

// ---------- S8: the kitchen: Ellie already at the island with her cereal, the cube in her other hand; you come in ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const e = stand(KITCHEN, 0.42, 0.42, 0.45);
  const y = stand(KITCHEN, 0.7, 0.36);
  const p = islandTop(0.36, 0.4);
  const spoon = Math.sin(t / 5);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 900]]), 520, kf(t, [[0, 1.4], [len, 1.55]]))}>
      <KIT t={t + 200} />
      <Hero look={YOU} pose={live(t, { ...y, x: kf(t, [[0, y.x + 160], [40, y.x]], easeOut), yaw: -0.4, look: -0.6 }, [[0, 'tired']], 2)} />
      <Hero look={ELLIE} pose={live(t, { ...e, yaw: 0.2, headTilt: 8, armR: { a: 70 + spoon * 20, b: 100 }, armL: { a: 60, b: 90 } }, [[0, 'neutral']], 4)} />
      <KitchenIsland stools />
      <Bowl x={p.x} y={p.y} s={0.9} />
      <PuzzleCube x={p.x + 90} y={p.y - 10} s={0.22} solved={0} seed={4} />
    </g>
  );
};

// ---------- S9: the cube in Ellie's hands, filling the frame ----------
export const S9: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Soft blur={16} dim={0.35}><g transform={camT(800, 420, 2.2)}><KIT t={t + 340} /></g></Soft>
    <CubeInHands t={t} solved={0} twist={Math.sin(clamp((t - 20) / 10) * Math.PI) * 0.4} s={kf(t, [[0, 0.95], [30, 1.02]])} />
  </g>
);

// ---------- S10: click, click, click: the layers blur, the colours sort themselves ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const clicks = [rel('Click', 'click', 1), rel('Click', 'click', 2), rel('Click', 'click', 3)];
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2232" />
      <CubeInHands t={t} solved={clamp(t / Math.max(1, len)) * 0.85} twist={Math.sin(t * 1.4)} s={1.08} shake={1} />
      {clicks.map((c, i) => (t > c ? (
        <text key={i} x={1380 + i * 140} y={220 + i * 120} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFD23A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke"
          transform={`rotate(8 ${1380 + i * 140} ${220 + i * 120}) scale(1)`} opacity={clamp((t - c) / 3)}>CLICK</text>
      ) : null))}
    </g>
  );
};

// ---------- S11: solved, held up ----------
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2232" />
    <Glow x={960} y={620} r={600} o={0.6} />
    <CubeInHands t={t} solved={1} twist={0} s={kf(t, [[0, 1.05], [10, 1.15]])} />
    <Sparkle x={700} y={380} t={t - 2} s={1.4} />
    <Sparkle x={1240} y={420} t={t - 5} s={1.1} />
  </g>
);

// ---------- S12: Ellie close-up, looking up at you, puzzled: Why does everything feel so easy today? ----------
export const S12 = faceCU({ look: ELLIE, Bg: KIT, words: W, talk: span(W, 'Why', 'today'), faces: [[0, 'neutral'], [40, 'worried']], yaw: 0.3, zoom: [3.6, 3.9], glint: 1, glintColor: '#9FF3E4' });

// ---------- S13: the Earth on the schematic, one dot lit (YOU), and then a second, right beside it (ELLIE) ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const her = rel('It', 'her', 2);
  return (
    <g>
      <g transform={camT(kf(t, [[0, 960], [len, 1040]]), kf(t, [[0, 540], [len, 480]]), kf(t, [[0, 1], [len, 1.5]]))}>
        <Schematic t={t} id="c7s13" />
        <circle cx={960} cy={540} r={330} fill="#1A2A44" stroke={SCH.line} strokeWidth={8} />
        <path d="M 760 380 Q 840 330 900 400 Q 880 470 800 470 Q 740 440 760 380 Z M 1000 300 Q 1100 280 1150 360 Q 1120 430 1040 420 Q 990 380 1000 300 Z M 900 560 Q 980 540 1020 640 Q 980 760 920 720 Q 870 640 900 560 Z M 1120 520 Q 1200 520 1220 600 Q 1180 650 1130 620 Z" fill="#2E4A6A" stroke={SCH.dim} strokeWidth={4} />
        {Array.from({ length: 60 }).map((_, i) => {
          const a = rnd(2, i) * Math.PI * 2, r = Math.sqrt(rnd(3, i)) * 290;
          return <circle key={i} cx={960 + Math.cos(a) * r} cy={540 + Math.sin(a) * r} r={6} fill={SCH.dim} opacity={0.7} />;
        })}
        <circle cx={1060} cy={460} r={14} fill="#FFD23A" />
        <Glow x={1060} y={460} r={90 + 10 * Math.sin(t / 4)} o={0.8} />
        <SchLabel x={1010} y={420} t={t - 4} text="YOU" size={34} color="#FFD23A" />
        {t > her - 6 ? (
          <g>
            <circle cx={1100} cy={490} r={14 * backOut(clamp((t - her + 6) / 8))} fill={RED} />
            <Glow x={1100} y={490} r={80 + 10 * Math.sin(t / 3)} kind="red" o={0.8} />
            <SchLabel x={1160} y={540} t={t - her + 2} text="ELLIE" size={34} color={RED} />
          </g>
        ) : null}
      </g>
      <SchLabel x={960} y={980} t={t - 6} text="IT ONLY HAPPENS TO YOU" size={44} color={SCH.line} />
    </g>
  );
};

// ---------- S14: the question, split down the middle: KEEP THE BRAIN | KEEP YOUR FAMILY ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const a = rel('What', 'brain');
  const b = rel('What', 'family');
  const k = (x: number) => clamp((t - x + 4) / 8);
  return (
    <g>
      <clipPath id="c7L"><rect x={0} y={0} width={960} height={1080} /></clipPath>
      <clipPath id="c7R"><rect x={960} y={0} width={960} height={1080} /></clipPath>
      <g clipPath="url(#c7L)">
        <rect width={1920} height={1080} fill="#170B14" />
        <Glow x={480} y={460} r={420 + 20 * Math.sin(t / 4)} kind="red" o={0.75} />
        <Hero look={YOU} pose={live(t, { x: 480, y: 900 - 170 * 1.7, scale: 1.7, yaw: 0.1, look: 0.1 }, [[0, 'neutral']], 3)} shadow={0} />
        <text x={480} y={120} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#FFB1A8" opacity={k(a)}>IQ 3,200</text>
        <text x={480} y={980} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill={RED} stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={k(a)} transform={`translate(0 ${(1 - k(a)) * 30})`}>KEEP THE BRAIN</text>
      </g>
      <g clipPath="url(#c7R)">
        <Soft blur={10} dim={0.15}><g transform={camT(980, 520, 1.5)}><KIT t={t + 600} /></g></Soft>
        <Hero look={MOM} pose={live(t, { x: 1300, y: 900 - 170 * 1.7, scale: 1.7, yaw: 0.3, look: 0.4 }, [[0, 'happy']], 5)} shadow={0} />
        <Hero look={ELLIE} pose={live(t, { x: 1600, y: 900 - 170 * 1.25, scale: 1.25, yaw: -0.3, look: -0.4 }, [[0, 'happy']], 6)} shadow={0} />
        <text x={1440} y={980} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#FFD23A" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={k(b)} transform={`translate(0 ${(1 - k(b)) * 30})`}>KEEP YOUR FAMILY</text>
      </g>
      <rect x={952} y={0} width={16} height={1080} fill="#0B0816" />
      <g transform={`translate(960 540) scale(${backOut(clamp((t - b - 6) / 8))})`}>
        <circle r={70} fill="#0B0816" stroke="#F6EFE3" strokeWidth={6} />
        <text y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3">OR</text>
      </g>
      {len ? null : null}
    </g>
  );
};

// ---------- S15: tell me in the comments: a comment box, a reply typing itself, a pointing hand ----------
export const S15: React.FC<ShotProps> = ({ t }) => {
  const msg = 'I would keep...';
  const n = Math.floor(clamp((t - 8) / 30) * msg.length);
  return (
    <g>
      <rect width={1920} height={1080} fill="#1A1624" />
      <Glow x={960} y={540} r={700} kind="warm" o={0.25} />
      <text x={960} y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#F6EFE3" opacity={clamp(t / 6)}>WHAT WOULD YOU DO?</text>
      <g transform={`translate(960 560) scale(${backOut(clamp((t - 2) / 10))})`}>
        <rect x={-620} y={-110} width={1240} height={220} rx={30} fill="#26212F" stroke="#F6EFE3" strokeWidth={4} />
        <circle cx={-520} cy={0} r={52} fill="#F07A2A" stroke="#100E16" strokeWidth={5} />
        <text x={-440} y={-30} fontFamily={FONT.ui} fontSize={30} fill="#B9B0C4">Add a comment...</text>
        <text x={-440} y={40} fontFamily={FONT.ui} fontSize={52} fill="#F6EFE3">{msg.slice(0, n)}{t % 16 < 8 ? '|' : ''}</text>
      </g>
      <text x={960} y={860 + Math.sin(t / 4) * 14} textAnchor="middle" fontSize={120}>👇</text>
    </g>
  );
};

// ---------- S16: is any of this real? a checklist, each line ticking on as it's named; sources in the description ----------
export const S16: React.FC<ShotProps> = ({ t }) => {
  const items: [string, number][] = [
    ['IQ 200: ABOUT 1 IN 76 BILLION', rel('Is', 'rarity', 1, 6)],
    ['BRAIN: 2% OF YOU, 20% OF YOUR ENERGY', rel('Is', 'hunger', 1, 6)],
    ['JAPANESE: ABOUT 2,200 HOURS', rel('Is', 'Japanese', 1, 6)],
    ['$1,000,000 PER MILLENNIUM PROBLEM', rel('Is', 'problems', 1, 6)],
  ];
  const src = rel('Is', 'sources', 1, 6);
  return (
    <g>
      <g transform="translate(0 0)"><Schematic t={t} id="c7s16" /></g>
      <text x={960} y={190} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill={SCH.line} opacity={clamp(t / 6)}>IS ANY OF THIS REAL?</text>
      {items.map(([txt, at], i) => {
        const k = clamp((t - at + 2) / 6);
        const tick = backOut(clamp((t - at - 4) / 8));
        return (
          <g key={i} transform={`translate(330 ${360 + i * 130})`} opacity={k}>
            <rect x={0} y={-44} width={80} height={80} rx={14} fill="none" stroke={SCH.line} strokeWidth={6} />
            <path d="M 14 0 L 34 22 L 70 -26" stroke="#7CF29A" strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" transform={`translate(40 0) scale(${tick}) translate(-40 0)`} />
            <text x={120} y={18} fontFamily={FONT.ui} fontSize={50} fill="#F6EFE3">{txt}</text>
          </g>
        );
      })}
      <text x={960} y={960} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#FFD23A" opacity={clamp((t - src + 2) / 6)}>SOURCES IN THE DESCRIPTION ↓</text>
    </g>
  );
};

// ---------- S17: and Ellie? a slow push on her face, a glint in her eyes; PART 2 ----------
const S17Face = faceCU({ look: ELLIE, Bg: KIT, faces: [[0, 'neutral'], [30, 'smug']], yaw: 0.1, zoom: [3.6, 4.4], glint: 1, glintColor: '#9FF3E4', dark: 0.25 });
export const S17: React.FC<ShotProps> = (p) => {
  const { t } = p;
  const part = rel('And', 'part', 1, 3);
  const k = backOut(clamp((t - part + 2) / 10));
  return (
    <g>
      <S17Face {...p} />
      <rect width={1920} height={1080} fill="#000" opacity={t > part ? clamp((t - part) / 10) * 0.55 : 0} />
      <text x={960} y={980} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#FFD23A" stroke="#0B0816" strokeWidth={16} paintOrder="stroke" transform={`translate(960 930) scale(${k}) translate(-960 -930)`}>PART 2</text>
    </g>
  );
};
