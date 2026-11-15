import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT, SchLabel, SCH, Schematic,
} from '../../../engine';
import { YOU, MOM, ELLIE, faceCU, bigWord, wordF, Soft, iconBoard } from '../common';
import { Valley, VALLEY_LIGHT, Trailer } from '../sets';
import words from './words.json';

// Chapter 7, the light: the third night on a hill; Ellie's fever going down; across the dark valley a steady, white,
// electric light. Mum sees it too. Impossible: every wire on Earth is dead. Then it blinks three times. The question for
// the comments, what's real, and part two.

const W = words;
const norm = (w: string) => w.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '').replace(/^'+|'+$/g, '');
/** Frames from word `cue` to the first word `w` after it. */
const rel = (cue: string, w: string, nth = 1) => {
  let seen = 0;
  const i = W.findIndex((x) => norm(x.w) === norm(cue) && ++seen === nth);
  const j = W.findIndex((x, k) => k > i && norm(x.w) === norm(w));
  return j < 0 || i < 0 ? 0 : Math.round((W[j].s - W[i].s) * 30);
};
const P0 = '#100E16';
const GROUND = 740;
const hillY = (x: number) => GROUND - 10 + Math.abs(x - 600) * 0.02;
const DARKV: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Valley t={t} id={id} />;
const LITV: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Valley t={t} id={id} light={1} />;

/** Someone sitting on the ground, legs out (hip on the ground at x). */
const sit = (x: number, k: number, extra: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y: hillY(x) - 10 * k, scale: k, yaw: 1, facing: 1, legL: { a: 86, b: -8 }, legR: { a: 82, b: -6 }, armL: { a: 20, b: -40 }, armR: { a: 20, b: -40 }, ...extra,
});
/** The blink of the far light: off for three short beats starting at frame b0. */
const blinkAt = (t: number, b0: number) => ([0, 10, 20].some((d) => t >= b0 + d && t < b0 + d + 5) ? 1 : 0);

// ---------- S1: the third night: the hill, the tent, the dark valley, the Milky Way overhead ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 820], [len, 900]]), 480, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <DARKV t={t} />
      <Trailer x={620} y={GROUND} s={0.5} load={1} />
    </g>
    <text x={960} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={12} fill="#F6EFE3" opacity={clamp(t / 10) * clamp((len - t) / 10)}>NIGHT 3</text>
  </g>
);

// ---------- S2: close on the ground: Ellie asleep in her blanket, mum asleep sitting up beside her ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const mom: Pose = { ...sit(1100, 1.1, { yaw: -0.3, facing: -1, expr: 'tired', blink: 1, headTilt: 14 }), y: 860 };
  return (
    <g>
      <Soft blur={10} dim={0.2}>
        <g transform={camT(960, 420, 1.4)}><DARKV t={t + 100} /></g>
      </Soft>
      <g transform={camT(960, 620, kf(t, [[0, 1.3], [len, 1.4]]))}>
        <path d="M -400 840 Q 960 800 2400 850 L 2400 1500 L -400 1500 Z" fill="#0C0C18" />
        <Glow x={900} y={780} r={360} kind="cool" o={0.35} />
        <Hero shadow={0} look={MOM} pose={mom} />
        <ellipse cx={820} cy={860} rx={170} ry={44} fill="#8A5AA0" stroke={P0} strokeWidth={6} />
        <circle cx={680} cy={828} r={40} fill="#3B3646" stroke={P0} strokeWidth={6} />
        <path d="M 650 812 q 14 -24 34 -10 M 690 806 q 14 -18 30 0" stroke="#2A2230" strokeWidth={10} fill="none" />
        {/* the fever going down: a small thermometer, the red sinking */}
        <g transform="translate(1340 640)">
          <rect x={-14} y={-140} width={28} height={160} rx={14} fill="#F6EFE3" stroke={P0} strokeWidth={5} />
          <rect x={-7} y={-130 + 100 * easeOut(clamp(t / 50))} width={14} height={140 - 100 * easeOut(clamp(t / 50))} fill="#FF3A3A" />
          <circle cy={20} r={24} fill="#FF3A3A" stroke={P0} strokeWidth={5} />
        </g>
      </g>
    </g>
  );
};

// ---------- S3: you, awake, sitting on the edge of the hill, looking out over the dark valley ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 760], [len, 860]]), 560, kf(t, [[0, 1.3], [len, 1.22]]))}>
    <DARKV t={t + 200} />
    <Hero look={YOU} pose={sit(700, 0.7, { expr: 'tired', blink: idleBlink(t, 4), look: 0.5 })} />
  </g>
);

// ---------- S4: close, you: then you see it (eyes go wide, a cold glint) ----------
export const S4 = faceCU({ look: YOU, Bg: DARKV, faces: [[0, 'tired'], [rel("That's", 'light') - 6, 'shock']], yaw: 0.5, eyes: 0.6, zoom: [3.2, 3.6], glint: 1, glintColor: '#CFE8FF', light: { x: 1300, y: 480, kind: 'cool', o: 0.45 } });

// ---------- S5: the valley: a light, far away, steady ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, VALLEY_LIGHT.x - 100]], easeOut), kf(t, [[0, 480], [len, VALLEY_LIGHT.y - 20]], easeOut), kf(t, [[0, 1.0], [len, 1.5]], easeOut))}>
    <Valley t={t + 300} light={easeOut(clamp(t / 10))} />
  </g>
);

// ---------- S6: closer on the light: steady, white, ELECTRIC ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(VALLEY_LIGHT.x, VALLEY_LIGHT.y - 30, kf(t, [[0, 2.4], [len, 2.8]]))}>
      <LITV t={t + 400} />
    </g>
    <text x={960} y={260} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} letterSpacing={12} fill="#F6EFE3" opacity={clamp(t / 6)}>STEADY. WHITE.</text>
    <g transform={`translate(960 860) scale(${backOut(clamp((t - rel('steady', 'electric')) / 8))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#CFE8FF" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">ELECTRIC</text>
    </g>
  </g>
);

// ---------- S7: you wake mum: a hand on her shoulder, her eyes open ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const wake = rel('wake', 'sees') - 10;
  const me: Pose = { ...sit(860, 1, { yaw: -0.6, facing: -1, expr: 'shock', blink: idleBlink(t, 5), armL: { a: 70, b: 10 }, armR: { a: 60, b: 20 }, legL: { a: 60, b: -120 }, legR: { a: 50, b: -110 } }), y: 840 - 60 };
  const mom: Pose = { ...sit(1080, 1.05, { yaw: -0.4, facing: -1, expr: t > wake ? 'worried' : 'tired', blink: t > wake ? idleBlink(t, 3) : 1, headTilt: t > wake ? 0 : 14 }), y: 850 };
  return (
    <g>
      <Soft blur={10} dim={0.2}>
        <g transform={camT(1100, 440, 1.4)}><LITV t={t + 500} /></g>
      </Soft>
      <g transform={camT(980, 620, kf(t, [[0, 1.35], [len, 1.45]]))}>
        <path d="M -400 840 Q 960 800 2400 850 L 2400 1500 L -400 1500 Z" fill="#0C0C18" />
        <Glow x={1000} y={700} r={380} kind="cool" o={0.3} />
        <Hero shadow={0} look={MOM} pose={mom} />
        <Hero shadow={0} look={YOU} pose={me} />
      </g>
    </g>
  );
};

// ---------- S8: the two of you on the hill, looking at the light; she doesn't say a word ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 980]]), 540, kf(t, [[0, 1.25], [len, 1.35]]))}>
    <LITV t={t + 600} />
    <Hero look={MOM} pose={sit(820, 0.78, { expr: "shock", blink: idleBlink(t, 6), look: 0.6 })} />
    <Hero look={YOU} pose={sit(600, 0.66, { expr: 'shock', blink: idleBlink(t, 4), look: 0.6 })} />
  </g>
);

// ---------- S9: insert: mum's hand grabs yours ----------
export const S9: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(clamp(t / 14));
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0A16" />
      <Glow x={1300} y={300} r={700} kind="cool" o={0.35} />
      <path d="M -100 760 L 700 700 L 700 840 L -100 960 Z" fill="#FF8A3D" stroke={P0} strokeWidth={8} />
      <ellipse cx={780} cy={770} rx={110} ry={70} fill="#3B3646" stroke={P0} strokeWidth={8} />
      <g transform={`translate(${(1 - k) * 260} ${(1 - k) * -60})`}>
        <path d="M 2000 600 L 1000 680 L 1000 820 L 2000 780 Z" fill="#8A4E66" stroke={P0} strokeWidth={8} />
        <path d="M 1000 690 Q 820 660 760 730 Q 740 790 820 800 Q 900 820 1000 810 Z" fill="#3B3646" stroke={P0} strokeWidth={8} />
      </g>
    </g>
  );
};

// ---------- S10: IMPOSSIBLE. ----------
export const S10 = bigWord({ kicker: "IT'S", word: 'IMPOSSIBLE.', color: '#CFE8FF', size: 190, Bg: LITV });

// ---------- S11: every wire on Earth is dead ----------
export const S11 = iconBoard({
  title: 'EVERY WIRE ON EARTH',
  items: [
    { name: 'wire', label: 'WIRES', at: 0, cross: rel('Every', 'dead') - 2 },
    { name: 'tower', label: 'GRIDS', at: 4, cross: rel('Every', 'dead') + 2 },
    { name: 'battery', label: 'BATTERIES', at: 8, cross: rel('Every', 'dead') + 6 },
  ],
});

// ---------- S12: unless someone found a way around the rule: one icon lights, a question mark ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
    <Schematic t={t} id="c7un" />
    <SchLabel x={960} y={200} t={t - 2} text="UNLESS..." size={56} color={SCH.live} />
    <g transform={`translate(960 560) scale(${backOut(clamp((t - rel('Unless', 'way')) / 10))})`}>
      <text textAnchor="middle" y={70} fontFamily={FONT.title} fontWeight={800} fontSize={300} fill={SCH.live} opacity={0.9}>?</text>
    </g>
    <SchLabel x={960} y={880} t={t - rel('Unless', 'around')} text="A WAY AROUND THE RULE" size={44} />
  </g>
);

// ---------- S13: the light blinks: once, twice, three times ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const b0 = rel('Then', 'blinks') + 2;
  return (
    <g transform={camT(VALLEY_LIGHT.x - 200, VALLEY_LIGHT.y - 40, kf(t, [[0, 1.8], [len, 2.1]]))}>
      <Valley t={t + 700} light={1} blink={blinkAt(t, b0)} />
    </g>
  );
};

// ---------- S14: close, you, the cold light flickering on your face: like it knows you're watching ----------
export const S14 = faceCU({ look: YOU, Bg: LITV, faces: [[0, 'shock'], [40, 'worried']], yaw: 0.45, eyes: 0.6, zoom: [3.4, 3.9], glint: 1, glintColor: '#CFE8FF', light: { x: 1300, y: 480, kind: 'cool', o: 0.6 }, dark: 0.1 });

// ---------- S15: the question: STAY OR GO? ----------
export const S15 = bigWord({ kicker: 'WHAT WOULD YOU DO?', word: 'STAY OR GO?', color: '#FFD23A', size: 200, Bg: DARKV });

// ---------- S16: TELL ME IN THE COMMENTS ----------
export const S16 = bigWord({ kicker: 'TELL ME', word: 'IN THE COMMENTS', color: '#FF8A3D', size: 150 });

// ---------- S17: what's real: the science, ticking on with the voice ----------
export const S17: React.FC<ShotProps> = ({ t }) => {
  const rows: [string, string, number][] = [
    ['PUMPS PUSH YOUR WATER', 'REAL', rel('And', 'Pumps', 2)],
    ['A FRIDGE: 4 HOURS', 'USDA', rel('And', 'fridge', 2)],
    ['FERTILIZER FEEDS HALF', '48%', rel('And', 'Fertilizer', 2)],
  ];
  return (
    <g>
      <Schematic t={t} id="c7real" />
      <SchLabel x={960} y={200} t={t - 2} text="IS ANY OF THIS REAL?" size={56} color={SCH.live} />
      {rows.map(([name, tag, a], i) => {
        const k = clamp((t - a) / 6);
        return (
          <g key={name} opacity={k} transform={`translate(${380 + (1 - k) * -40} ${380 + i * 170})`}>
            <path d="M 0 -6 l 16 18 l 34 -40" stroke={SCH.live} strokeWidth={10} fill="none" strokeLinecap="round" opacity={clamp((t - a - 6) / 4)} />
            <text x={90} y={14} fontFamily={FONT.ui} fontSize={52} fill={SCH.line}>{name}</text>
            <text x={1160} y={14} textAnchor="end" fontFamily={FONT.ui} fontSize={52} fill={SCH.glow}>{tag}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- S18: and whoever is behind that light? Slow push back toward it ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, VALLEY_LIGHT.x]], easeOut), kf(t, [[0, 500], [len, VALLEY_LIGHT.y]], easeOut), kf(t, [[0, 1.1], [len, 2.6]], easeOut))}>
    <LITV t={t + 800} />
  </g>
);

// ---------- S19: end card: the valley, the light, PART 2 ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 480, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <Valley t={t + 900} light={1} blink={blinkAt(t, 40)} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
    <text x={960} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 8)}>WHO IS BEHIND THE LIGHT?</text>
    <g transform={`translate(960 600) scale(${backOut(clamp((t - 8) / 10))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={220} fill="#FF8A3D" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">PART 2</text>
    </g>
  </g>
);

void ELLIE; void wordF;
