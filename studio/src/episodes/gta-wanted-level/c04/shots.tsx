import React from 'react';
import {
  ShotProps, camT, kf, clamp, backOut, factCard, Helicopter, Dumpster, ThermalView, ThermalHud, HOT, Hero, basePose, WantedStars, FONT, WANT, SUB, ALLEY, TOWN, SUBURB,
  stand, KITCHEN, KitchenIsland, TicketGate, Alley, LampPost, rnd, DispatchMap,
} from '../../../engine';
import words from './words.json';
import { YOU, MO, MUM, ELLIE, TownSet, SubSet, AlleySet, HomeSet, KitchenSet, scene, faceCU, starsCU, bigWord, insert, walk, run, cueAt, starCard, crouch, span, people, Soft } from '../common';

// Chapter 4, the catch: Mo's plan, three stars at the subway gate; you run and hide behind the dumpsters; 28, 29, 30
// and nothing flashes. In real life: the helicopter (150 mph, thermal), Boston 2013, the plate cameras, the city's
// cameras, warrants that never run out, running is a crime of its own. Home with three stars; Mum, Ellie.

const SUBQ = SubSet();
const SUBA = SubSet({ alarm: 1 });
const AL = AlleySet(0, 'dusk');
const NIGHT = HomeSet('night', { lit: 0.6 });
const KIT = KitchenSet({ veil: 0.35 });
const CCSET = TownSet('dusk', { cars: false });
const fmtN = (v: number) => Math.round(v).toLocaleString('en-US');

// ---------- S1: chapter 4 ----------
export const S1 = starCard({ kicker: 'CHAPTER 4', title: 'THE CATCH', seed: 11, n: 3 });

// ---------- S2: Mo has a plan: "Three stars. Just to see." ----------
export const S2 = scene({
  Set: SUBQ, setT: 50, cam: { from: [1250, 540, 1.55], to: [1250, 540, 1.65] }, words,
  cast: [
    { look: MO, pose: { x: 1080, y: SUB.feet - 170, yaw: 0.5, armR: { a: 60, b: -60 }, handR: 'point' }, faces: [[0, 'smug']], talk: [span(words, 'Three', 'see')] },
    { look: YOU, pose: { x: 1420, y: SUB.feet - 170, yaw: -0.5 }, faces: [[0, 'worried'], [60, 'smug']], stars: 2 },
  ],
});

// ---------- S3: you hop over the ticket gate. The third star snaps on ----------
export const S3 = scene({
  Set: SUBQ, setT: 100, cam: { from: [880, 560, 1.25], to: [900, 560, 1.32] }, words,
  over: (t, len, f) => (cueAt(words, f, t, 'third') < t ? <rect width={1920} height={1080} fill={WANT.red} opacity={0.12 * (Math.floor(t / 6) % 2)} /> : null),
  cast: (t, f) => {
    const hop = cueAt(words, f, t, 'hop');
    const k = clamp((t - hop) / 20);
    const x = kf(t, [[hop - 20, 640], [hop + 22, 1020]]);
    const air = Math.sin(k * Math.PI) * 150;
    const jump = t > hop && t < hop + 20;
    return [{
      look: YOU, pose: jump ? { x, y: SUB.feet - 170 - air, yaw: 1, facing: 1, legL: { a: 70, b: -90 }, legR: { a: 30, b: -60 }, armL: { a: 140, b: -20 }, armR: { a: 40, b: -20 }, tilt: 10 } : walk(t, 640, 1020, hop - 20, hop + 22, SUB.feet),
      faces: [[0, 'smug'], [hop + 24, 'oops']], stars: [[0, 2], [cueAt(words, f, t, 'third'), 3.25]],
    }];
  },
});

// ---------- S4: three stars ----------
export const S4 = starsCU({ k: [[0, 2], [3, 3.25]], Bg: SUBA, siren: 0.3 });

// ---------- S5: you do what you've learned: you run ----------
export const S5 = scene({
  Set: SUBA, setT: 200, cam: { from: [960, 560, 1.2], to: [1100, 560, 1.25] }, words,
  cast: (t) => [{ look: YOU, pose: run(t, 700, 2100, 0, 60, SUB.feet), faces: [[0, 'shock']], stars: 3 }],
});

// ---------- S6: you crouch behind the dumpsters and start counting ----------
export const S6 = scene({
  Set: AL, cam: { from: [1150, 640, 1.6], to: [1150, 660, 1.7] }, words,
  cast: (t) => [{ look: YOU, pose: crouch(1240, ALLEY.feet + 30, -1, 1, { look: -0.8 }), faces: [[0, 'worried']], stars: 3, floor: ALLEY.feet + 30 }],
  front: () => <Dumpster x={1000} y={ALLEY.feet + 60} s={1.15} />,
});

// ---------- S7: twenty-eight seconds, your record. Twenty-nine. Thirty. The stars don't even flash ----------
export const S7: React.FC<ShotProps> = (p) => {
  const c = (w: string) => cueAt(words, p.f, p.t, w);
  const I = insert({
    Bg: AL, push: 0.06,
    draw: (t) => {
      const sec = t < c('Twentynine') ? 28 : t < c('Thirty') ? 29 : 30;
      return (
        <g>
          <WantedStars x={960} y={430} n={3} s={1.8} t={t} />
          <text x={960} y={700} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={240} fill={sec > 28 ? WANT.red : '#F6EFE3'} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">{`0:${sec}`}</text>
          <text x={960} y={800} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#C8C2D8">{sec === 28 ? 'YOUR RECORD' : 'NOTHING'}</text>
        </g>
      );
    },
  });
  return <I {...p} />;
};

// ---------- S8: in the game, this is where you wait it out ----------
export const S8 = faceCU({ look: YOU, Bg: AL, faces: [[0, 'worried'], [50, 'shock']], yaw: -0.4, stars: 3, zoom: [2.8, 3.1] });

// ---------- S9: in real life, this is where it stops being a game ----------
export const S9 = bigWord({ kicker: 'IN REAL LIFE', word: 'GAME OVER', color: WANT.red, size: 210, sub: 'this is where it stops being a game' });

// ---------- S10: first, the helicopter ----------
export const S10 = scene({
  Set: TownSet('dusk', { lit: 0.7 }), setT: 400, cam: { from: [960, 280, 1.3], to: [960, 260, 1.36] },
  back: (t) => <Helicopter x={kf(t, [[0, -300], [90, 2200]])} y={180} s={0.75} t={t} tilt={10} />,
});

// ---------- S11: about 150 miles an hour ----------
export const S11 = factCard({ value: 150, suffix: ' MPH', label: 'POLICE HELICOPTER, CRUISING', sub: 'faster than anything on the road below' });

// ---------- S12: it doesn't need to see you. Its thermal camera sees heat ----------
const Thermal: React.FC<{ t: number; lock: number; z: number }> = ({ t, lock, z }) => (
  <g>
    <g transform={camT(1150, 640, z)}>
      <ThermalView id="th">
        <Alley t={t} tod="night" />
        <Dumpster x={1000} y={ALLEY.feet + 60} s={1.15} />
      </ThermalView>
      <g filter="url(#blur6)" opacity={0.9}>
        <Hero look={HOT as never} pose={{ ...basePose, ...(crouch(1240, ALLEY.feet + 30, -1) as object), expr: 'worried', blink: 0 } as never} shadow={0} />
      </g>
      <ellipse cx={1240} cy={ALLEY.feet - 120} rx={150} ry={190} fill="#FFD23A" opacity={0.25} filter="url(#blur16)" />
      <g opacity={0.5}><Dumpster x={1000} y={ALLEY.feet + 60} s={1.15} color="#2A3048" /></g>
    </g>
    <ThermalHud t={t} lock={lock} x={kf(z, [[1.3, 1080], [1.9, 1140]])} y={560} />
  </g>
);
export const S12: React.FC<ShotProps> = ({ t, len }) => <Thermal t={t} lock={clamp((t - 30) / 20)} z={kf(t, [[0, 1.2], [len, 1.4]])} />;

// ---------- S13: Boston, 2013 ----------
export const S13 = factCard({ value: 2013, label: 'FOUND BY BODY HEAT ALONE', sub: 'a police helicopter\'s thermal camera, Boston, at night', format: (v) => String(Math.round(v)) });

// ---------- S14: your hiding place glows like a light bulb ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => <Thermal t={t} lock={1} z={kf(t, [[0, 1.6], [len, 1.9]])} />;

// ---------- S15: one company alone: more than 100,000 license plate cameras ----------
export const S15 = factCard({ value: 100000, suffix: '+', label: 'LICENSE PLATE CAMERAS, ONE COMPANY', sub: 'on American streets (Pew Research Center, 2026)', format: fmtN });

// ---------- S16: the city's own cameras have your hoodie, your face, which way you ran ----------
export const S16: React.FC<ShotProps> = ({ t, len, f }) => {
  const x = kf(t, [[0, 300], [len, 1500]]);
  const p = run(t, 300, 1500, 0, len, TOWN.feet, 1);
  return (
    <g>
      <defs>
        <filter id="cctv" filterUnits="userSpaceOnUse" x={-400} y={-400} width={2800} height={1900}>
          <feColorMatrix type="matrix" values="0.25 0.5 0.1 0 0.02  0.3 0.55 0.12 0 0.05  0.2 0.4 0.1 0 0.02  0 0 0 1 0" />
        </filter>
      </defs>
      <g filter="url(#cctv)">
        <g transform={camT(900, 520, 1.05)}>
          <CCSET t={t + 300} id="cc" />
          {people(t, [{ look: YOU, pose: p, faces: [[0, 'shock']] }])}
        </g>
      </g>
      {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={0} y={(t * 9 + i * 97) % 1080} width={1920} height={3} fill="#FFFFFF" opacity={0.06} />)}
      <g transform={camT(900, 520, 1.05)}>
        <rect x={x - 110} y={TOWN.feet - 470} width={220} height={480} fill="none" stroke="#7CFF7A" strokeWidth={5} />
        <text x={x + 120} y={TOWN.feet - 440} fontFamily={FONT.ui} fontSize={30} fill="#7CFF7A">ORANGE HOODIE</text>
        <text x={x + 120} y={TOWN.feet - 400} fontFamily={FONT.ui} fontSize={30} fill="#7CFF7A">HEADING EAST</text>
      </g>
      <circle cx={80} cy={80} r={16} fill="#FF3B3B" opacity={Math.floor(t / 15) % 2 ? 1 : 0.3} />
      <text x={110} y={92} fontFamily={FONT.ui} fontSize={36} fill="#F6EFE3">REC  CAM 114  MAIN ST</text>
      <text x={1840} y={92} textAnchor="end" fontFamily={FONT.ui} fontSize={36} fill="#F6EFE3">{`17:42:${String(10 + Math.floor(t / 30)).padStart(2, '0')}`}</text>
    </g>
  );
};

// ---------- S17: third, the stars don't fade ----------
export const S17 = starsCU({ k: 3, Bg: NIGHT, label: "THIRD: THEY DON'T FADE" });

// ---------- S18: an arrest warrant has no expiry date ----------
export const S18 = insert({
  bgColor: '#2A2430', push: 0.08,
  draw: (t) => (
    <g transform="translate(960 560) rotate(-3)">
      <rect x={-380} y={-470} width={760} height={940} fill="#F8F4E6" stroke="#8A8270" strokeWidth={6} />
      <text x={0} y={-370} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#14121C">ARREST WARRANT</text>
      <path d="M -300 -330 H 300" stroke="#14121C" strokeWidth={4} />
      {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-300} y={-280 + i * 52} width={420 + rnd(3, i) * 180} height={16} rx={6} fill="#C8C0B0" />)}
      <text x={-300} y={250} fontFamily={FONT.ui} fontSize={40} fill="#14121C">EXPIRES:</text>
      <g transform={`translate(80 330) rotate(-12) scale(${backOut(clamp((t - 20) / 10))})`} opacity={clamp((t - 20) / 4)}>
        <rect x={-270} y={-70} width={540} height={130} rx={12} fill="none" stroke="#E8402A" strokeWidth={10} />
        <text x={0} y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#E8402A">NEVER</text>
      </g>
    </g>
  ),
});

// ---------- S19: it doesn't flash after thirty seconds. It waits. For years ----------
export const S19 = insert({
  bgColor: '#141826', push: 0.06,
  draw: (t, len) => {
    const yr = Math.floor(kf(t, [[10, 2026], [Math.max(20, len - 10), 2036]]));
    return (
      <g>
        <WantedStars x={960} y={360} n={3} s={1.4} t={t} />
        <g transform="translate(960 640)">
          <rect x={-260} y={-150} width={520} height={330} rx={20} fill="#F8F4E6" stroke="#14121C" strokeWidth={8} />
          <rect x={-260} y={-150} width={520} height={90} rx={20} fill="#D8262A" />
          {[-150, 150].map((x) => <rect key={x} x={x - 14} y={-190} width={28} height={80} rx={10} fill="#3A3E4A" />)}
          <text x={0} y={110} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={170} fill="#14121C">{yr}</text>
        </g>
      </g>
    );
  },
});

// ---------- S20: the part the game never tells you: running is a crime of its own ----------
export const S20 = bigWord({ kicker: 'IN EVERY US STATE', word: 'RUNNING IS A CRIME', color: WANT.red, size: 130, sub: 'running from the police is a crime of its own' });

// ---------- S21: the gate was a fine. Running made it serious ----------
export const S21: React.FC<ShotProps> = ({ t, f }) => {
  const right = clamp((cueAt(words, f, t, 'Running') > t ? 0 : 1));
  return (
    <g>
      <rect width={1920} height={1080} fill="#141826" />
      <g transform="translate(480 0)">
        <rect x={-400} y={120} width={800} height={840} rx={30} fill="#1E2A44" />
        <TicketGate x={0} y={720} s={1.2} />
        <text x={0} y={870} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#4BE38A">A FINE</text>
      </g>
      <g transform="translate(1440 0)" opacity={0.25 + 0.75 * right}>
        <rect x={-400} y={120} width={800} height={840} rx={30} fill="#3A1420" />
        <g transform="translate(0 0)">
          {people(t, [{ look: YOU, pose: run(t + 20, -60, 60, 0, 999, 760, 0.9), faces: [[0, 'shock']] }])}
        </g>
        <text x={0} y={870} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill={WANT.red}>SERIOUS</text>
      </g>
    </g>
  );
};

// ---------- S22: that night you get home, and the three stars are still there ----------
export const S22 = scene({
  Set: NIGHT, setT: 300, cam: { from: [960, 540, 1.3], to: [1100, 540, 1.4] }, words,
  cast: (t) => [{ look: YOU, pose: walk(t, 600, 1260, 0, 90, SUBURB.feet), faces: [[0, 'tired'], [100, 'worried']], stars: 3 }],
});

// ---------- S23: Mum asks why there was a helicopter over the station all afternoon. You say you don't know ----------
const MU = stand(KITCHEN, 0.32, 0.4), EL = stand(KITCHEN, 0.5, 0.46), ME = stand(KITCHEN, 0.7, 0.4);
export const S23 = scene({
  Set: KIT, setT: 300, cam: { from: [960, 560, 1.3], to: [960, 560, 1.4] }, words,
  cast: (t, f) => [
    { look: MUM, pose: { x: MU.x, y: MU.y, scale: MU.scale, yaw: 0.5, armR: { a: 40, b: -60 } }, faces: [[0, 'neutral']] },
    { look: ELLIE, pose: { x: EL.x, y: EL.y, scale: EL.scale * 0.72, yaw: 0.2 }, faces: [[0, 'happy']] },
    { look: YOU, pose: { x: ME.x, y: ME.y, scale: ME.scale, yaw: -0.5, look: -0.7 }, faces: [[0, 'oops']], stars: 3 },
  ],
  front: () => <KitchenIsland />,
});

// ---------- S24: Ellie says helicopters are cool ----------
export const S24 = faceCU({ look: ELLIE, Bg: KIT, faces: [[0, 'happy']], yaw: 0.3, zoom: [3.0, 3.2], pose: { scale: 0.75, y: 690, armR: { a: 150, b: -20 }, armL: { a: 150, b: -20 } } });

// ---------- S15B: every car you get into leaves a trail ----------
export const S15B = insert({
  bgColor: '#0E1626', push: 0.08,
  draw: (t, len) => {
    const pts: [number, number][] = [[200, 820], [520, 820], [520, 560], [900, 560], [900, 300], [1350, 300], [1350, 640], [1720, 640]];
    const k = clamp(t / Math.max(1, len - 10)) * (pts.length - 1);
    return (
      <g>
        <DispatchMap t={t} close={0} n={0} dot={{ x: -500, y: -500 }} />
        {pts.slice(0, Math.floor(k) + 1).map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 26} y={y - 70} width={52} height={40} rx={8} fill="#F6EFE3" />
            <circle cx={x} cy={y - 50} r={10} fill="#14121C" />
            <circle cx={x} cy={y} r={16} fill="#FFD23A" />
            {i > 0 ? <path d={`M ${pts[i - 1][0]} ${pts[i - 1][1]} L ${x} ${y}`} stroke="#FFD23A" strokeWidth={8} strokeDasharray="14 10" /> : null}
          </g>
        ))}
        <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3">EVERY CAMERA LOGS THE PLATE, THE PLACE, THE TIME</text>
      </g>
    );
  },
});
