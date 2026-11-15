import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, chapterCard, factCard, Schematic, SchLabel, SCH,
  CLS, STUDY, KITCHEN, stand, talkShot, Sparkle, rnd, FloatLabel, BookTower, OpenBook, Desk, KitchenIsland, islandTop, UI,
} from '../../../engine';
import {
  YOU, MO, MOM, ELLIE, TEACHER, faceCU, bigWord, Soft, cues, span, CLASS, iqCard, IqHud, live, handAt, BoardMath, ChessBoard, LaptopFront, DocLines,
  TvFront, STUDY_SET, KIT, DAY, Bus, streetHip, LIVING,
} from '../common';
import words from './words.json';

// Chapter 3, the fun part. Day one: the board problem before the pen is down, the teacher sits; the whole science
// shelf at lunch; Mo: "Since when are you smart?" Day two: Japanese from a cooking show, a sunset on the tablecloth
// for Ellie, the chess computer told how it will lose. Day three: the seven million-dollar problems, one solved by
// lunch, posted without a name. Mo closes the laptop. The best week of your life. But something is getting worse.

const W = words as any;
const { rel } = cues(words);
const BOARD = CLASS(<BoardMath t={0} write={1} />);
const SOLVED = CLASS(<BoardMath t={0} write={1} answer={1} />);
const LIB: React.FC<{ t: number; id?: string }> = ({ t, id }) => <STUDY_SET t={t} id={id} />;

// ---------- S1: chapter card ----------
export const S1 = chapterCard({ kicker: 'DAY ONE', title: 'THE FUN PART' });

// ---------- S2: math class: the teacher writes a monster of a problem on the board ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const write = clamp(t / Math.max(1, len - 10));
  const tch = stand(CLS, 0.62, 0.3);
  const reach = Math.sin(t / 4);
  const Set = CLASS(<BoardMath t={t} write={write} />);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 860]]), 470, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <Set t={t + 100} />
      <Hero look={TEACHER} pose={live(t, { ...tch, yaw: -0.8, armR: { a: 150 + reach * 10, b: 20 }, look: -1 }, [[0, 'neutral']], 2)} />
    </g>
  );
};

// ---------- S3: you, at your desk, hand straight up before she's even put the pen down ----------
export const S3 = talkShot({
  Set: BOARD, setT: 200,
  cast: [
    { look: TEACHER, ...stand(CLS, 0.7, 0.3), yaw: -0.6, faces: [[0, 'neutral'], [12, 'shock']], pose: { armR: { a: 120, b: 20 } } },
    { look: YOU, ...stand(CLS, 0.36, 0.62, 0.5), yaw: 0.4, faces: [[0, 'smug']], pose: { armR: { a: 175, b: 0 } } },
  ],
  cam: { from: [900, 520, 1.2], to: [880, 520, 1.3] },
});

// ---------- S4: she checks the answer twice, then just sits down, behind her the answer in a box ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const sit = rel('checks', 'sits');
  const down = easeOut(clamp((t - sit) / 10));
  const tch = stand(CLS, 0.55, 0.32);
  return (
    <g transform={camT(940, 480, kf(t, [[0, 1.6], [len, 1.7]]))}>
      <SOLVED t={t + 300} />
      <Hero look={TEACHER} pose={live(t, { ...tch, y: tch.y + down * 60 * tch.scale, yaw: t < sit ? (Math.floor(t / 14) % 2 ? -0.7 : 0.2) : 0, legL: { a: 80 * down, b: -80 * down }, legR: { a: 76 * down, b: -76 * down }, armL: { a: 30, b: 40 }, armR: { a: 30, b: 40 }, look: t < sit ? -1 : 0 }, [[0, 'worried'], [sit, 'shock']], 2)} />
    </g>
  );
};

// ---------- S5: lunch, the library: books stack up beside you faster and faster; the librarian stares ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(14, Math.floor(t / 8));
  const me = stand(STUDY, 0.42, 0.55);
  const lb = stand(STUDY, 0.82, 0.32);
  const late = t > rel('At', 'librarian');
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 540, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <LIB t={t + 100} />
      <Hero look={{ ...MOM, jacket: '#6A5A8A', jacketShade: '#54476E', extra: 'bob' } as any} pose={live(t, { ...lb, yaw: -0.5, look: -1 }, [[0, 'neutral'], [Math.max(1, rel('At', 'librarian')), 'shock']], 7)} />
      <Hero look={YOU} pose={live(t, { ...me, yaw: 0.2, armL: { a: 60, b: 80 }, armR: { a: 60, b: 80 }, headTilt: 10 + Math.sin(t) * 4 }, [[0, 'happy']], 3)} />
      <OpenBook {...handAt({ ...basePose, ...me, yaw: 0.2, armL: { a: 60, b: 80 }, armR: { a: 60, b: 80 } } as Pose)} w={130} turn={(t / 2) % 1} />
      <BookTower x={me.x + 170 * me.scale} y={me.y + 170 * me.scale} n={n} s={me.scale * 1.1} />
      <BookTower x={me.x - 190 * me.scale} y={me.y + 170 * me.scale} n={Math.max(0, n - 5)} s={me.scale * 1.1} />
      <text x={me.x} y={me.y - 260 * me.scale} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FFE27A">{`${Math.min(40, Math.floor(t / 4))} MIN`}</text>
      {late ? null : null}
    </g>
  );
};

// ---------- S6: after school on the street: Mo stares. "Since when are you smart?" "Since about seven." ----------
export const S6 = talkShot({
  Set: DAY, setT: 400, words: W,
  cast: [
    { look: MO, x: 820, y: streetHip(1), yaw: 0.4, talk: [span(W, 'Since', 'smart')], faces: [[0, 'shock'], [40, 'neutral']] },
    { look: YOU, x: 1100, y: streetHip(1), yaw: -0.4, talk: [span(W, 'Since', 'morning', 2)], faces: [[0, 'smug']] },
  ],
  cam: { from: [960, 560, 1.5], to: [960, 560, 1.6] },
});

// ---------- S7: DAY TWO: 400 ----------
export const S7 = iqCard({ kicker: 'DAY TWO', iq: 400, from: 200, Bg: LIVING });

// ---------- S8: the sofa, you watching a Japanese cooking show, cross-legged, a notebook ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <TvFront t={t} Bg={LIVING} s={kf(t, [[0, 0.9], [len, 0.95]])}>
    <rect width={1200} height={680} fill="#F2E2C2" />
    <rect y={480} width={1200} height={200} fill="#8A5A3E" />
    <ellipse cx={600} cy={500} rx={260} ry={40} fill="#3A3446" />
    <Hero look={{ ...MOM, jacket: '#F4F1EA', jacketShade: '#D6D0C4', extra: undefined, hat: undefined } as any} pose={live(t, { x: 600, y: 300, scale: 1, yaw: 0, armR: { a: 60 + Math.sin(t / 3) * 20, b: 60 }, talk: Math.abs(Math.sin(t / 2)) }, [[0, 'happy']], 4)} />
    <text x={600} y={90} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#C8322E">料理の時間</text>
    <rect x={200} y={590} width={800} height={60} rx={8} fill="#000" opacity={0.6} />
    <text x={600} y={632} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#FFFFFF">今日はラーメンを作ります</text>
  </TvFront>
);

// ---------- S9: the fact: 2,200 hours ----------
export const S9 = factCard({ value: 2200, suffix: ' HOURS', label: 'JAPANESE, FOR AN ENGLISH SPEAKER', sub: 'U.S. FOREIGN SERVICE INSTITUTE: ABOUT 88 WEEKS OF CLASS' });

// ---------- S10: the subtitles: the English line crossed out, you writing the right one on a note ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const fix = rel('You', 'correcting', 1, 6);
  return (
    <TvFront t={t} Bg={LIVING} s={kf(t, [[0, 1], [len, 1.08]])}>
      <rect width={1200} height={680} fill="#F2E2C2" />
      <rect y={480} width={1200} height={200} fill="#8A5A3E" />
      <circle cx={600} cy={430} r={110} fill="#F4F1EA" stroke="#100E16" strokeWidth={6} />
      <path d="M 520 420 Q 600 380 680 420" stroke="#C88A3E" strokeWidth={14} fill="none" />
      <rect x={150} y={560} width={900} height={90} rx={8} fill="#000" opacity={0.65} />
      <text x={600} y={600} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FFFFFF">Now we put the soup in the shoe.</text>
      {t > fix ? <path d={`M 230 592 L ${230 + 740 * clamp((t - fix) / 8)} 592`} stroke="#E8322E" strokeWidth={6} /> : null}
      {t > fix + 8 ? <text x={600} y={636} textAnchor="middle" fontFamily={FONT.hand} fontSize={34} fill="#FFE27A">"Now we pour the soup into the bowl."</text> : null}
    </TvFront>
  );
};

// ---------- S11: the kitchen table at night: Ellie asks why the sky is blue ----------
export const S11 = talkShot({
  Set: KIT, setT: 500,
  cast: [
    { look: ELLIE, ...stand(KITCHEN, 0.42, 0.42, 0.45), yaw: 0.4, faces: [[0, 'neutral']], pose: { headTilt: -10 } },
    { look: YOU, ...stand(KITCHEN, 0.6, 0.38), yaw: -0.3, faces: [[0, 'neutral'], [60, 'smug']] },
  ],
  cam: { from: [960, 520, 1.6], to: [960, 520, 1.7] },
  front: () => <KitchenIsland stools />,
});

// ---------- S12: insert, the glass of water and the lamp: a beam goes in white and comes out as a sunset ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const on = clamp((t - rel('Tonight', 'lamp')) / 10);
  const sun = clamp((t - rel('Tonight', 'sunset')) / 12);
  return (
    <g>
      <rect width={1920} height={1080} fill="#1A1622" />
      <rect y={640} width={1920} height={440} fill="#E9E0CC" />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${i * 180} 640 L ${i * 180 - 200} 1080`} stroke="#D8CCB4" strokeWidth={6} />)}
      <g transform="translate(260 380)">
        <path d="M -60 -120 L 60 -120 L 30 0 L -30 0 Z" fill="#E9D3AE" stroke="#100E16" strokeWidth={6} />
        <path d="M 0 0 L 0 260 M -70 260 L 70 260" stroke="#24202C" strokeWidth={14} />
        <Glow x={0} y={0} r={240} o={0.9 * on} />
      </g>
      {on > 0 ? <path d="M 260 380 L 900 560 L 900 600 L 260 400 Z" fill="#FFF8E0" opacity={0.5 * on} /> : null}
      <g transform="translate(960 620)">
        <path d="M -90 -260 L 90 -260 L 70 40 L -70 40 Z" fill="#BFE6FF" opacity={0.5} stroke="#100E16" strokeWidth={6} />
        <path d="M -82 -170 L 82 -170 L 70 40 L -70 40 Z" fill="#7AC8FF" opacity={0.55} />
      </g>
      {sun > 0 ? (
        <g opacity={sun}>
          <path d="M 1000 600 L 1600 700 L 1600 820 L 1000 640 Z" fill="#FF8A3D" opacity={0.35} />
          <ellipse cx={1500} cy={800} rx={220 * sun} ry={60 * sun} fill="#FF7A2A" opacity={0.8} />
          <ellipse cx={1500} cy={800} rx={120 * sun} ry={32 * sun} fill="#FFD23A" />
          <Glow x={1500} y={800} r={300} o={0.7 * sun} />
        </g>
      ) : null}
      <text x={960} y={160} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={6} fill="#F6EFE3" opacity={sun}>BLUE SCATTERS. RED GETS THROUGH.</text>
    </g>
  );
};

// ---------- S13: Ellie, mouth open, then a grin: why is it blue again? ----------
export const S13 = faceCU({ look: ELLIE, Bg: KIT, faces: [[0, 'shock'], [rel("Ellie's", 'Then', 2), 'happy']], yaw: -0.2, zoom: [3.6, 3.8], light: { x: 1200, y: 760, o: 0.7 } });

// ---------- S14: that night, Mo's room: the laptop with the chess computer, Mo daring you ----------
export const S14 = talkShot({
  Set: STUDY_SET, setT: 600,
  cast: [
    { look: MO, ...stand(STUDY, 0.36, 0.52), yaw: 0.5, faces: [[0, 'smug']], pose: { armR: { a: 70, b: 40 } } },
    { look: YOU, ...stand(STUDY, 0.62, 0.52), yaw: -0.4, faces: [[0, 'neutral']] },
  ],
  cam: { from: [960, 560, 1.35], to: [960, 560, 1.45] },
  front: () => <Desk x0={700} x1={1260} y={860} laptop lamp={false} />,
});

// ---------- S15: the board: game one LOST, game two WON ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const won = t > rel('lose', 'win');
  return (
    <g>
      <rect width={1920} height={1080} fill="#1E1A28" />
      <ChessBoard x={760} y={540} s={1.5} t={t} move={clamp((t - 6) / 10)} />
      <g transform="translate(1500 400)">
        <text textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3">GAME 1</text>
        <text y={70} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#E8322E">LOST</text>
        {won ? (
          <g transform={`translate(0 220) scale(${backOut(clamp((t - rel('lose', 'win')) / 8))})`}>
            <text textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3">GAME 2</text>
            <text y={70} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#5AE09A">WON</text>
          </g>
        ) : null}
      </g>
    </g>
  );
};

// ---------- S16: game three: you point at the screen, a speech line: MATE IN 20; Mo's jaw drops ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#1E1A28" />
    <ChessBoard x={700} y={540} s={1.4} t={t} win={clamp((t - 40) / 10)} />
    <Hero look={YOU} pose={live(t, { x: 1480, y: 760, scale: 1.4, yaw: -0.5, armR: { a: 100, b: 0 }, handR: 'point', talk: Math.abs(Math.sin(t / 2.5)) * (t < 70 ? 1 : 0) }, [[0, 'smug']], 3)} />
    <g transform={`translate(1300 230) scale(${backOut(clamp((t - 10) / 8))})`}>
      <rect x={-260} y={-60} width={520} height={110} rx={30} fill="#F6EFE3" stroke="#100E16" strokeWidth={6} />
      <text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#100E16">YOU LOSE IN 20.</text>
    </g>
  </g>
);

// ---------- S17: DAY THREE: 800 ----------
export const S17 = iqCard({ kicker: 'DAY THREE', iq: 800, from: 400, Bg: STUDY_SET });

// ---------- S18: the seven problems on the schematic: $1,000,000 each, one ticked SOLVED ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const names = ['P vs NP', 'HODGE', 'RIEMANN', 'YANG-MILLS', 'NAVIER-STOKES', 'BIRCH & SWINNERTON-DYER', 'POINCARÉ'];
  const money = rel('In', 'One', 2, 3);
  const only = rel('In', 'only', 1, 3);
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}><Schematic t={t} id="c3s18" /></g>
      <SchLabel x={960} y={130} t={t - 2} text="THE MILLENNIUM PRIZE PROBLEMS, 2000" size={44} color={SCH.dim} />
      {names.map((n, i) => {
        const x = 300 + (i % 4) * 440 - (i >= 4 ? -220 : 0), y = i < 4 ? 360 : 640;
        const pop = backOut(clamp((t - 6 - i * 4) / 8));
        const solved = i === 6 && t > only;
        return (
          <g key={n} transform={`translate(${x} ${y}) scale(${pop})`}>
            <rect x={-190} y={-90} width={380} height={180} rx={18} fill="#14223A" stroke={solved ? '#5AE09A' : SCH.line} strokeWidth={5} />
            <text y={-20} textAnchor="middle" fontFamily={FONT.ui} fontSize={n.length > 14 ? 22 : 30} fill={SCH.line}>{n}</text>
            <text y={44} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={t > money ? '#FFD23A' : SCH.dim}>$1,000,000</text>
            {solved ? <text y={-120} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#5AE09A">SOLVED</text> : null}
          </g>
        );
      })}
      <SchLabel x={960} y={930} t={t - only} text="26 YEARS. ONE SOLVED." size={46} color={SCH.live} />
    </g>
  );
};

// ---------- S19: the bus: you reading the list, scribbling, done; a tick ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const s = 1.25;
  const done = rel('read', 'solved', 2, 2);
  const me: Pose = live(t, { x: 760, y: 820 - 170 * s, scale: s, yaw: 0.35, look: 0.5, headTilt: 12, legL: { a: 84, b: -84 }, legR: { a: 80, b: -80 }, armL: { a: 50, b: 80 }, armR: { a: 60 + Math.sin(t * 1.5) * 6, b: 80 } }, [[0, 'neutral'], [done, 'happy']], 3);
  const h = handAt(me, 'R');
  return (
    <g transform={camT(kf(t, [[0, 860], [len, 900]]), 560, 1.1)}>
      <Bus t={t + 200} />
      <Hero look={YOU} pose={me} />
      <rect x={h.x - 60} y={h.y - 50} width={140} height={100} fill="#F4EEE0" stroke="#100E16" strokeWidth={4} transform={`rotate(-8 ${h.x} ${h.y})`} />
      {t > done ? <FloatLabel x={h.x} y={h.y - 120} t={t - done} text="✓ SOLVED" size={56} color="#5AE09A" /> : null}
    </g>
  );
};

// ---------- S20: the school computer: the proof, the name field empty, POST ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const post = rel('type', 'online');
  return (
    <g>
      <rect width={1920} height={1080} fill="#1A1A26" />
      <g transform={`translate(960 860) scale(${kf(t, [[0, 1.5], [len, 1.6]])}) translate(-960 -860)`}>
        <LaptopFront x={960} y={860} w={900} t={t} screen={
          <g>
            <DocLines w={856} n={13} title="A proof (12 pages)" seed={3} shown={clamp(t / 30)} />
            <rect x={24} y={440} width={300} height={44} rx={8} fill="#FFFFFF" stroke="#8A9AB0" strokeWidth={3} />
            <text x={36} y={472} fontFamily={FONT.ui} fontSize={24} fill="#8A9AB0">Name: (anonymous)</text>
            <rect x={600} y={436} width={220} height={52} rx={26} fill={t > post ? '#5AE09A' : '#2E7DE0'} />
            <text x={710} y={470} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#FFFFFF">{t > post ? 'POSTED ✓' : 'POST'}</text>
          </g>
        } />
      </g>
    </g>
  );
};

// ---------- S21: Mo reads, line one, line two, then slowly closes the laptop. "Okay. You're scaring me now." ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const close = rel('Mo', 'closes', 1, 3);
  const shut = clamp((t - close) / 20);
  const mo = { x: 820, y: 940, scale: 2.3 };
  return (
    <g transform={camT(960, 560, 1)}>
      <Soft blur={10} dim={0.35}><g transform={camT(960, 520, 1.6)}><STUDY_SET t={t + 800} /></g></Soft>
      <Hero look={MO} pose={live(t, { ...mo, yaw: 0.3, look: 0.4, headTilt: 8, armL: { a: 18, b: 24 }, armR: { a: 22, b: 30 }, talk: 0 }, [[0, 'neutral'], [Math.max(1, rel('Mo', 'Then', 3, 3)), 'worried'], [Math.max(2, close + 20), 'shock']], 5)} />
      <LaptopFront x={1180} y={1010} w={720} t={t} open={1 - shut * 0.9} screen={<DocLines w={516} n={9} seed={5} />} />
    </g>
  );
};

// ---------- S22: you laugh: the best week of your life ----------
export const S22 = faceCU({ look: YOU, Bg: STUDY_SET, faces: [[0, 'happy']], yaw: 0.25, zoom: [3.1, 3.3], pose: { headTilt: -10 }, extra: (t) => <Sparkle x={280} y={-320} t={t - 4} s={1.2} /> });

// ---------- S23: but: the same face, the light turning red, a faint heat shimmer over your head; the IQ readout goes red ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const heat = clamp(t / Math.max(1, len));
  const Inner = faceCU({ look: YOU, Bg: STUDY_SET, faces: [[0, 'neutral'], [20, 'worried']], yaw: 0.1, zoom: [3.4, 3.9], dark: 0.25, light: { x: 960, y: 300, kind: 'red', o: 0.4 + 0.5 * heat } });
  return (
    <g>
      <Inner t={t} len={len} f={t} />
      {[0, 1, 2].map((i) => (
        <path key={i} d={`M ${820 + i * 140} ${200 - ((t * 2 + i * 20) % 60)} q 20 -30 0 -60 q -20 -30 0 -60`} stroke="#FF8A5A" strokeWidth={6} fill="none" opacity={0.5 * heat} />
      ))}
      <IqHud t={t + 10} iq={800} heat={heat} />
    </g>
  );
};

// ---------- S24: $1,000,000 for each one ----------
export const S24 = bigWord({ kicker: 'FOR EACH ONE YOU SOLVE', word: '$1,000,000', color: '#5AE09A', Bg: Schematic as any, size: 210 });

// ---------- S25: 26 years: one solved (a tally of 26 years, one green) ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}><Schematic t={t} id="c3s25" /></g>
    <SchLabel x={960} y={250} t={t - 2} text="26 YEARS LATER" size={48} color={SCH.dim} />
    {Array.from({ length: 7 }).map((_, i) => {
      const x = 960 + (i - 3) * 200;
      const on = backOut(clamp((t - 4 - i * 3) / 8));
      const ok = i === 6;
      return (
        <g key={i} transform={`translate(${x} 560) scale(${on})`}>
          <rect x={-70} y={-70} width={140} height={140} rx={16} fill="#14223A" stroke={ok ? '#5AE09A' : SCH.dim} strokeWidth={6} />
          <text y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill={ok ? '#5AE09A' : '#7E8DA6'}>{ok ? '✓' : '?'}</text>
        </g>
      );
    })}
    <SchLabel x={960} y={820} t={t - 30} text="SOLVED: ONE" size={52} color={SCH.live} />
  </g>
);
