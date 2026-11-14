import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, FONT, Classroom, Barbecue, Football, BoardGame, PotSpeaker, PaperMap, Schematic, SCH,
  SUBURB, ModernCar,
} from '../../../engine';
import words from './words.json';
import {
  YOU, MO, ELLIE, MUM, DAD, KID, N1, N2, N3, GRAN, NURSE, StreetSet, phoneCU, propCU, faceCU, bigWord, talkShot, netCard, listCard, HeldPhone, at, crowd, span,
} from '../common';

// Chapter 3, the fun part: school's off, Mo knocks instead of texting, the whole street comes outside (barbecue,
// football, a board game), your downloaded songs in a cooking pot, a street party, sunset; Mum's promise; the turn.

const DAY = StreetSet('day');
const NOCARS = StreetSet('day', { cars: false });
const DUSK = StreetSet('dusk', { cars: false });
const NIGHT = StreetSet('night', { cars: false, lit: 0.85 });

export const S1 = netCard({ kicker: 'CHAPTER 3', title: 'THE BEST DAY', red: 0, lit: 0.7 });
export const S2 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'neutral'], [12, 'smug']], yaw: 0.25, zoom: [3.0, 3.2] });

// ---------- S3: the classroom: GO HOME on the board, the class erupts ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(900, 470, kf(t, [[0, 1.0], [len, 1.08]]))}>
    <Classroom t={t} laugh={clamp((t - 10) / 10)} board={
      <g>
        <text x={740} y={330} textAnchor="middle" fontFamily="Kalam, cursive" fontWeight={700} fontSize={96} fill="#F6EFE3">NO WI-FI.</text>
        <text x={740} y={450} textAnchor="middle" fontFamily="Kalam, cursive" fontWeight={700} fontSize={110} fill="#FFD86A">GO HOME!</text>
      </g>
    } />
  </g>
);

export const S4 = listCard({
  items: [{ at: 2, text: 'HOMEWORK PORTAL', ok: false }, { at: 36, text: 'GRADES', ok: false }, { at: 66, text: 'GROUP CHAT AT MIDNIGHT', ok: false }],
});

// ---------- S5: two-shot at your front door: Mo knocking, then asking ----------
const moLine = span(words, 'Is', 'too');
export const S5 = talkShot({
  Set: DAY, setT: 800, words,
  cast: [
    { look: MO, x: 760, y: at(0).y, yaw: 0.45, talk: [moLine], faces: [[0, 'neutral'], [100, 'worried']], pose: { armR: { a: 80, b: -60 } } },
    { look: YOU, x: 1080, y: at(0).y, yaw: -0.4, faces: [[0, 'shock'], [60, 'neutral']] },
  ],
  cam: { from: [930, 560, 1.7], to: [930, 560, 1.8] },
});

export const S6 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'neutral'], [20, 'smug']], yaw: -0.2, zoom: [3.1, 3.3] });

// ---------- S7: wide, the whole street out on the pavement, comparing phones ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const people = crowd(9, 160, 1760, 5, { expr: 'neutral', faceTo: 960 });
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 540, 1.05)}>
      <DAY t={t + 900} id="s7" />
      {people.map((c, i) => {
        const p: Pose = { ...basePose, x: c.x, y: c.y, scale: c.scale ?? 1, yaw: i % 2 ? 0.5 : -0.5, expr: i % 3 ? 'worried' : 'neutral', armR: { a: 70, b: -60 }, blink: idleBlink(t, i + 1), look: i % 2 ? 0.6 : -0.6 };
        return (
          <g key={i}>
            <Hero look={c.look} pose={p} />
            <HeldPhone pose={p} t={t} glow={0.4} />
          </g>
        );
      })}
    </g>
  );
};

// ---------- S8: Someone's dad drags a barbecue onto the pavement ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 700], [60, 980]]);
  const dad: Pose = at(x - 170, { yaw: 0.5, expr: 'happy', armR: { a: 70, b: 0 }, armL: { a: 60, b: 0 }, tilt: t < 60 ? -8 : 0, blink: idleBlink(t, 2) });
  return (
    <g transform={camT(980, 560, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <NOCARS t={t + 950} id="s8" />
      <Hero look={DAD} pose={dad} />
      <Barbecue x={x} y={SUBURB.feet + 4} s={1.1} t={t} />
      <Hero look={N2} pose={at(1350, { yaw: -0.4, expr: 'happy', blink: idleBlink(t, 6) })} />
    </g>
  );
};

// ---------- S9: kids play football in the empty road ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const k = (t % 50) / 50;
  const bx = 600 + Math.sin((t / 50) * Math.PI) * 600;
  const by = SUBURB.kerb + 250 - Math.abs(Math.sin(k * Math.PI)) * 220;
  const roadY = SUBURB.kerb + 290;
  const kid1: Pose = { ...basePose, x: 520, y: roadY - 280, yaw: 0.5, expr: 'happy', legR: { a: Math.sin(t / 4) * 30, b: 10 }, legL: { a: -Math.sin(t / 4) * 30, b: 10 }, blink: idleBlink(t, 1) };
  const kid2: Pose = { ...basePose, x: 1340, y: roadY - 280, yaw: -0.5, expr: 'happy', armL: { a: 60, b: -20 }, armR: { a: 60, b: -20 }, blink: idleBlink(t, 4) };
  return (
    <g transform={camT(960, 760, kf(t, [[0, 1.3], [len, 1.35]]))}>
      <NOCARS t={t + 1000} id="s9" />
      <Hero look={KID} pose={kid1} />
      <Hero look={ELLIE} pose={kid2} />
      <Football x={bx} y={by} rot={t * 12} r={30} />
    </g>
  );
};

// ---------- S10: the board game on a garden wall, half the pieces missing, four heads round it ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.6], [len, 1.75]]))}>
    <NOCARS t={t + 1100} id="s10" />
    {[[640, N1, 0.5], [800, GRAN, 0.3], [1120, N3, -0.3], [1280, KID, -0.5]].map(([x, look, yaw], i) => (
      <Hero key={i} look={look as typeof N1} pose={at(x as number, { yaw: yaw as number, expr: t > 30 + i * 6 ? 'happy' : 'neutral', look: -(yaw as number), blink: idleBlink(t, i + 3) })} />
    ))}
    <rect x={700} y={700} width={520} height={110} fill="#8A6A5A" />
    <BoardGame x={960} y={690} s={0.9} />
  </g>
);

// ---------- S11: close, you: the lightbulb moment ----------
export const S11 = faceCU({ look: YOU, Bg: NOCARS, faces: [[0, 'neutral'], [16, 'shock'], [34, 'happy']], yaw: 0.2, zoom: [3.0, 3.25], glint: 1 });

// ---------- S12: flashback: the download before the flight ----------
export const S12 = phoneCU({ mode: 'download', text: 'Road trip playlist|200 songs', bgColor: '#1A2A4A', push: 0.08 });

// ---------- S13: the street turns: everyone hears your phone ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const people = crowd(8, 200, 1720, 9, { faceTo: 960, skip: [3, 4] });
  const me: Pose = at(960, { yaw: 0, expr: 'smug', armR: { a: 140, b: 10 }, blink: idleBlink(t, 3) });
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.15], [len, 1.25]]))}>
      <NOCARS t={t + 1200} id="s13" />
      {people.map((c, i) => (
        <Hero key={i} look={c.look} pose={{ ...basePose, x: c.x, y: c.y, scale: c.scale ?? 1, yaw: c.x < 960 ? 0.5 : -0.5, expr: t > 10 + i * 3 ? 'shock' : 'neutral', look: c.x < 960 ? 0.8 : -0.8, blink: idleBlink(t, i), armL: { a: 15, b: -10 } }} />
      ))}
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={me} t={t} mode="music" glow={1.4} />
    </g>
  );
};

// ---------- S14: insert, the phone in a cooking pot on the garden wall ----------
export const S14 = propCU({ Bg: NOCARS, push: 0.1, draw: (t) => (
  <g>
    <rect x={300} y={820} width={1320} height={300} fill="#8A6A5A" />
    <rect x={300} y={810} width={1320} height={20} fill="#A8887A" />
    <PotSpeaker x={960} y={820} s={1.6} t={t} />
  </g>
) });

// ---------- S15: the street party: everyone dancing, Mo's mum on guitar ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const dancers = [N1, ELLIE, DAD, GRAN, KID, N3, NURSE];
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1.12]]))}>
      <DUSK t={t + 1300} id="s15" />
      {dancers.map((look, i) => {
        const b = Math.abs(Math.sin((t + i * 7) / 6));
        const x = 220 + i * 230;
        const sc = look === ELLIE || look === KID ? 0.75 : 1;
        return <Hero key={i} look={look} pose={at(x, { y: at(0, {}, sc).y - b * 16, scale: sc, yaw: Math.sin(t / 20 + i), expr: 'happy', armL: { a: 120 + b * 40, b: -30 }, armR: { a: 100 + b * 50, b: -40 }, blink: idleBlink(t, i) }, sc)} />;
      })}
      {(() => {
        const mm: Pose = at(1760, { yaw: -0.4, expr: 'happy', armR: { a: 50, b: -70 + Math.sin(t) * 10 }, armL: { a: 40, b: -90 }, blink: idleBlink(t, 9) });
        return (
          <g>
            <Hero look={N2} pose={mm} />
            <g transform={`translate(1745 ${mm.y + 10}) rotate(-25)`}>
              <ellipse cx={0} cy={0} rx={70} ry={56} fill="#C8783A" stroke="#100E16" strokeWidth={6} />
              <circle cx={0} cy={0} r={16} fill="#2A1A10" />
              <rect x={60} y={-10} width={170} height={20} fill="#6A3A1A" stroke="#100E16" strokeWidth={4} />
            </g>
          </g>
        );
      })()}
      <PotSpeaker x={960} y={SUBURB.feet - 40} s={0.4} t={t} />
    </g>
  );
};

// ---------- S16: two-shot: Mo looks at you like you're a genius ----------
export const S16 = talkShot({
  Set: DUSK, setT: 1400,
  cast: [
    { look: MO, x: 820, y: at(0).y, yaw: 0.5, faces: [[0, 'shock'], [20, 'happy']], pose: { armL: { a: 30, b: -20 } }, look_: 0.8 },
    { look: YOU, x: 1100, y: at(0).y, yaw: -0.3, faces: [[0, 'smug']] },
  ],
  cam: { from: [960, 560, 1.8], to: [960, 560, 1.95] },
});

// ---------- S17: sunset: neighbours sitting on garden walls, talking ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const sit = (x: number, look: typeof N1, yaw: number, i: number) => (
    <Hero key={i} look={look} pose={{ ...basePose, x, y: SUBURB.feet - 90, yaw, expr: 'happy', legL: { a: 80, b: -80 }, legR: { a: 70, b: -80 }, armR: { a: Math.sin((t + i * 9) / 8) > 0.3 ? 50 : 15, b: -40 }, blink: idleBlink(t, i), headTilt: Math.sin((t + i * 13) / 18) * 4 }} />
  );
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1040]]), 560, 1.15)}>
      <DUSK t={t + 1500} id="s17" />
      {sit(300, N1, 0.4, 1)}{sit(470, MUM, -0.3, 2)}{sit(860, N3, 0.3, 3)}{sit(1020, GRAN, -0.4, 4)}{sit(1400, YOU, 0.4, 5)}{sit(1560, MO, -0.4, 6)}
    </g>
  );
};

// ---------- S18: screen time: 0h 0m ----------
export const S18 = phoneCU({ mode: 'clock', text: '0h 0m', Bg: DUSK, push: 0.1, time: '20:14' });

// ---------- S19: Ellie teaching half the street a card game on the pavement ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const ellie: Pose = at(960, { y: at(0, {}, 0.75).y, scale: 0.75, yaw: 0, expr: 'smug', armR: { a: 90 + Math.sin(t / 5) * 20, b: -20 }, blink: idleBlink(t, 2) }, 0.75);
  return (
    <g transform={camT(960, 620, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <DUSK t={t + 1600} id="s19" />
      {[[640, N1, 0.5], [770, DAD, 0.3], [1160, NURSE, -0.3], [1290, N3, -0.5]].map(([x, look, yaw], i) => (
        <Hero key={i} look={look as typeof N1} pose={at(x as number, { yaw: yaw as number, expr: 'neutral', look: -(yaw as number), blink: idleBlink(t, i + 3), armR: { a: 60, b: -60 } })} />
      ))}
      <Hero look={ELLIE} pose={ellie} />
      {[0, 1, 2, 3, 4].map((k) => (
        <rect key={k} x={900 + k * 26} y={600 - Math.abs(k - 2) * 6} width={30} height={44} rx={4} fill="#F6F6F6" stroke="#100E16" strokeWidth={3} transform={`rotate(${(k - 2) * 12} ${915 + k * 26} 640)`} />
      ))}
    </g>
  );
};

// ---------- S20: Mum unfolds a paper map, everyone crowds round ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 600, kf(t, [[0, 1.55], [len, 1.7]]))}>
    <DUSK t={t + 1700} id="s20" />
    {[[650, N1, 0.5], [780, GRAN, 0.4], [1140, KID, -0.4], [1270, N2, -0.5]].map(([x, look, yaw], i) => (
      <Hero key={i} look={look as typeof N1} pose={at(x as number, { yaw: yaw as number, expr: t > 20 ? 'happy' : 'neutral', look: -(yaw as number), blink: idleBlink(t, i + 1) }, look === KID ? 0.75 : 1)} />
    ))}
    <Hero look={MUM} pose={at(960, { yaw: 0, expr: 'happy', armL: { a: 70, b: -40 }, armR: { a: 70, b: -40 }, blink: idleBlink(t, 7) })} />
    <PaperMap x={960} y={560} s={kf(t, [[0, 0.3], [15, 0.6]])} />
  </g>
);

// ---------- S21: Ellie asks; Mum answers ----------
const mumLine = span(words, 'Of', 'will');
export const S21 = talkShot({
  Set: NIGHT, setT: 1800, words,
  cast: [
    { look: MUM, x: 860, y: at(0).y, yaw: 0.4, talk: [mumLine], faces: [[0, 'neutral'], [70, 'happy']] },
    { look: ELLIE, x: 1080, y: at(0, {}, 0.72).y, scale: 0.72, yaw: -0.4, faces: [[0, 'worried']], look_: -0.8 },
  ],
  cam: { from: [960, 600, 1.9], to: [960, 600, 2.0] },
});
export const S22 = bigWord({ word: "SHE'S WRONG.", color: '#FF3A2A', size: 180, Bg: NIGHT });

// ---------- S23: night: the whole street still outside, windows lit ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const people = crowd(10, 140, 1780, 13, { expr: 'happy', faceTo: 960 });
  return (
    <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 0.95]]))}>
      <NIGHT t={t + 1900} id="s23" />
      {people.map((c, i) => <Hero key={i} look={c.look} pose={{ ...basePose, x: c.x, y: c.y, scale: c.scale ?? 1, yaw: i % 2 ? 0.4 : -0.4, expr: 'happy', blink: idleBlink(t, i), headTilt: Math.sin((t + i * 10) / 15) * 4 }} />)}
      <rect width={1920} height={1080} fill="#FFB860" opacity={0.06} />
    </g>
  );
};

export const S24 = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'neutral'], [40, 'worried']], yaw: 0.1, look_: 0, zoom: [2.8, 3.3] });

// ---------- S25: the hub: INTERNET in the middle, lines out to everything it was holding up ----------
export const S25: React.FC<ShotProps> = ({ t }) => {
  const THINGS = ['MONEY', 'FOOD', 'HOSPITALS', 'PLANES', 'WATER', 'FUEL', 'PHONES', 'POWER GRID'];
  return (
    <g>
      <Schematic t={t} id="hub" />
      {THINGS.map((th, i) => {
        const a = (i / THINGS.length) * Math.PI * 2 - Math.PI / 2;
        const x = 960 + Math.cos(a) * 640;
        const y = 540 + Math.sin(a) * 360;
        const d = clamp((t - i * 6) / 14);
        return (
          <g key={i}>
            <path d={`M 960 540 L ${960 + (x - 960) * d} ${540 + (y - 540) * d}`} stroke={SCH.live} strokeWidth={5} />
            <g opacity={clamp((t - i * 6 - 10) / 6)}>
              <rect x={x - 130} y={y - 40} width={260} height={80} rx={40} fill="#101A2A" stroke={SCH.line} strokeWidth={4} />
              <text x={x} y={y + 14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#F6EFE3">{th}</text>
            </g>
          </g>
        );
      })}
      <g transform={`translate(960 540) scale(${backOut(clamp(t / 10))})`}>
        <circle r={120} fill="#FF8A3D" stroke="#0B0816" strokeWidth={10} />
        <text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#0B0816">INTERNET</text>
      </g>
    </g>
  );
};
