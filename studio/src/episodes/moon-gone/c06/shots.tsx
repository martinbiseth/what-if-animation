import React from 'react';
import { basePose, kf, camT, clamp, backOut, ShotProps, FONT, LEG_LEN, Glow } from '../../../engine';
import {
  YOU, MO, ELLIE, NEIGH, NEIGH2, GRANDPA, Body, faceCU, bigWord, wordF, SchBg, SchLabel, Arrow, Soft,
  Beach, BEACH, Nest, Hatchlings,
} from '../common';
import words from './words.json';

// Chapter 6, the choice: the hatchlings boil out, and with no Moon over the sea they turn toward the Moon Vigil's
// floodlights. Phone flashlights make it worse. You climb the lifeguard tower: LIGHTS OFF. Mo flips the floodlights,
// grandpa's truck goes dark, the phones go out one by one, and the faint starlight over the sea is the brightest thing left.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const LIVE = '#FF8A3D';
const B = BEACH;
const N = B.nest;
const r = (s: number, i: number) => { const x = Math.sin(s * 127.1 + i * 311.7) * 43758.5453; return x - Math.floor(x); };
const BeachOn: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Beach t={t} id={id} />;
const BeachDark: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Beach t={t} id={id} lights={0} stars={1} seaGlow={1} />;
const ellie = (o: Partial<typeof basePose> = {}) => ({ ...basePose, x: 1150, y: N.y - LEG_LEN * 0.72 + 10, scale: 0.72, yaw: -0.5, ...o });
const you = (o: Partial<typeof basePose> = {}) => ({ ...basePose, x: 640, y: N.y - LEG_LEN * 0.72 + 30, scale: 0.72, yaw: 0.5, ...o });
// headings: out of the nest; toward the lights (up and left); toward the sea (right)
const spill = (k: number) => (i: number): [number, number] => [(r(3, i) - 0.5) * 300 * k, (r(4, i) - 0.3) * 120 * k];
const wrong = (d: number) => (i: number): [number, number] => [-d * (0.7 + r(5, i) * 0.6), -d * 0.28 * (0.6 + r(6, i))];
const right = (d: number) => (i: number): [number, number] => [d * (0.7 + r(7, i) * 0.6), d * 0.12 * (r(8, i) - 0.3)];

// ---------- S1: the beach after dark ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 600], [len, 760]]), 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <Beach t={t} />
  </g>
);

// ---------- S2: Ellie inside the orange fence, flashlight off ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1000], [len, 1040]]), 640, kf(t, [[0, 1.6], [len, 1.7]]))}>
    <Beach t={t + 30} />
    <Body look={ELLIE} pose={ellie({ armR: { a: 30, b: -30 } })} t={t} faces={[[0, 'neutral']]} seed={5} />
    <rect x={1190} y={N.y - 150} width={14} height={50} rx={4} fill="#3A3646" transform={`rotate(-20 1197 ${N.y - 125})`} />
  </g>
);

// ---------- S3: the sand starts to move ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(N.x, N.y - 10, kf(t, [[0, 3.0], [len, 3.4]]))}>
    <Beach t={t + 60} />
    <Nest x={N.x} y={N.y} move={1} t={t} />
  </g>
);

// ---------- S4: a tiny flipper, then another ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(N.x, N.y - 10, kf(t, [[0, 4.0], [len, 4.4]]))}>
    <Beach t={t + 90} />
    <Nest x={N.x} y={N.y} move={0.6} t={t} open={0.6} />
    {[[-14, 10], [18, 30]].map(([dx, d], i) => {
      const k = clamp((t - d) / 8);
      return <path key={i} d={`M ${N.x + dx} ${N.y} q ${6 * (i ? 1 : -1)} ${-22 * k} ${16 * (i ? 1 : -1)} ${-30 * k}`} stroke="#3E5A48" strokeWidth={9} strokeLinecap="round" fill="none" opacity={k} />;
    })}
  </g>
);

// ---------- S5: a hundred hatchlings boil out ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(N.x, N.y - 40, kf(t, [[0, 2.6], [len, 2.2]]))}>
    <Beach t={t + 120} />
    <Nest x={N.x} y={N.y} move={0.3} t={t} open={1} />
    <Hatchlings n={60} x={N.x} y={N.y + 4} spread={50} t={t} s={0.6} go={spill(clamp(t / 40))} />
  </g>
);

// ---------- S6: how hatchlings find the sea ----------
const SchFC: React.FC<{ t: number; id?: string }> = ({ t, id }) => <SchBg t={t} len={100} id={id ?? 'c6s6b'} />;
export const S6 = bigWord({ kicker: 'HOW HATCHLINGS', word: 'FIND THE SEA', color: '#F6EFE3', Bg: SchFC, size: 140 });

// ---------- S7: they crawl to the brightest horizon ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <SchBg t={t} len={len} id="c6s7" />
    <path d="M 120 640 L 1800 640" stroke="#F6EFE3" strokeWidth={4} />
    <rect x={120} y={640} width={700} height={300} fill="#5A5060" opacity={0.5} />
    <rect x={1100} y={640} width={700} height={300} fill="#3E7AC8" opacity={0.4} />
    <Glow x={1600} y={560} r={360} kind="cool" o={0.7} />
    <Hatchlings n={8} x={500} y={780} spread={120} t={t} s={1.4} go={right(t * 5)} />
    <Arrow x0={700} y0={500} x1={1400} y1={500} t={t - 6} color={LIVE} bend={0} />
    <SchLabel x={960} y={420} t={t - 8} text="TOWARD THE BRIGHTEST HORIZON" size={48} color={LIVE} />
  </g>
);

// ---------- S8: millions of years: the moonlit sea ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1300], [len, 1450]]), 560, 1.25)}>
    <Beach t={t} moon={1} lights={0} crowd={0} vigil={false} stars={1} />
    <Hatchlings n={30} x={1200} y={900} spread={160} t={t} s={0.7} go={right(t * 4)} seed={11} />
  </g>
);

// ---------- S9: no Moon: the sea pitch black ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 1700], [len, 1650]]), 640, 1.3)}><Beach t={t} /></g>
    <rect width={1920} height={1080} fill="#000" opacity={0.25} />
  </g>
);

// ---------- S10: the boardwalk like a stadium: Moon Vigil ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 200], [len, 320]]), kf(t, [[0, 360], [len, 400]]), kf(t, [[0, 1.5], [len, 1.4]]))}>
    <Beach t={t} />
  </g>
);

// ---------- S11: the hatchlings turn around ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(N.x - 60, N.y - 40, kf(t, [[0, 2.6], [len, 2.8]]))}>
    <Beach t={t + 150} />
    <Nest x={N.x} y={N.y} open={1} />
    <Hatchlings n={50} x={N.x + 40} y={N.y + 30} spread={140} t={t} s={0.6} go={t < 14 ? right(14 - t) : wrong((t - 14) * 1.4)} seed={21} />
  </g>
);

// ---------- S12: up the sand toward the lights ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 700]]), 600, 1.35)}>
    <Beach t={t + 180} />
    <Nest x={N.x} y={N.y} open={1} />
    <Hatchlings n={80} x={N.x - 40} y={N.y + 10} spread={200} t={t} s={0.55} go={wrong(40 + t * 2.4)} seed={31} />
    <Body look={ELLIE} pose={ellie({ armL: { a: 120, b: -30 } })} t={t} faces={[[0, 'shock']]} seed={5} />
  </g>
);

// ---------- S13: Ellie: they're going the wrong way! ----------
export const S13 = faceCU({ look: ELLIE, Bg: BeachOn, faces: [[0, 'shock']], yaw: -0.3, eyes: 0.4, zoom: [3.2, 3.4], words: W, talk: [at('wrong') / 30 - 1.0, at('wrong') / 30 + 0.6] });

// ---------- S14: people from the vigil run over ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(800, 620, 1.3)}>
    <Beach t={t + 200} />
    <Hatchlings n={60} x={N.x - 160} y={N.y - 20} spread={220} t={t} s={0.55} go={wrong(80 + t * 2)} seed={41} />
    {[0, 1, 2].map((i) => (
      <Body key={i} look={i % 2 ? NEIGH2 : NEIGH} pose={{ ...basePose, x: kf(t, [[0, 100 + i * 90], [len, 420 + i * 110]]), y: N.y - 40 - LEG_LEN * 0.7 + i * 20, scale: 0.7, yaw: 0.6, legL: { a: 30 * Math.sin(t / 3 + i), b: 0 }, legR: { a: -30 * Math.sin(t / 3 + i), b: 0 } }} t={t + i * 7} faces={[[0, 'worried']]} seed={30 + i} />
    ))}
  </g>
);

// ---------- S15: phone flashlights switch on ----------
const Torch: React.FC<{ x: number; y: number; on: number; ang?: number }> = ({ x, y, on, ang = 20 }) => (
  <g>
    <rect x={x - 12} y={y - 22} width={24} height={44} rx={5} fill="#14121C" stroke="#3A3848" strokeWidth={3} />
    {on > 0 ? (
      <g opacity={on}>
        <path d={`M ${x} ${y} L ${x + 520} ${y + 260 + ang * 4} L ${x + 300} ${y + 420 + ang * 4} Z`} fill="#F4F8FF" opacity={0.22} />
        <Glow x={x} y={y} r={70} kind="cool" o={0.9} />
      </g>
    ) : null}
  </g>
);
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(760, 680, 1.8)}><Beach t={t + 220} lights={0.4} /></g>
    <rect width={1920} height={1080} fill="#05051A" opacity={0.3} />
    {[[360, 380, 4], [760, 300, 12], [1160, 360, 20]].map(([x, y, d], i) => <Torch key={i} x={x} y={y} on={clamp((t - d) / 3)} ang={i * 10} />)}
  </g>
);

// ---------- S16: even more turtles turn to the lights ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 820], [len, 720]]), 620, 1.3)}>
    <Beach t={t + 240} />
    <Hatchlings n={110} x={N.x - 80} y={N.y} spread={260} t={t} s={0.55} go={wrong(120 + t * 2)} seed={51} />
    {[0, 1, 2].map((i) => (
      <g key={i}>
        <Body look={i % 2 ? NEIGH2 : NEIGH} pose={{ ...basePose, x: 380 + i * 120, y: N.y - 40 - LEG_LEN * 0.7 + i * 20, scale: 0.7, yaw: 0.5, armR: { a: 70, b: -20 } }} t={t + i * 7} faces={[[0, 'worried']]} seed={30 + i} />
        <Glow x={430 + i * 120} y={N.y - 150 + i * 20} r={80} kind="cool" o={0.9} />
      </g>
    ))}
  </g>
);

// ---------- S17: you: can't carry a hundred ----------
export const S17 = faceCU({ look: YOU, Bg: BeachOn, faces: [[0, 'worried'], [40, 'neutral']], yaw: 0.3, eyes: -0.2, zoom: [3.1, 3.3] });

// ---------- S18: they need the dark ----------
export const S18 = bigWord({ word: 'THEY NEED THE DARK', color: '#F6EFE3', Bg: BeachOn, size: 150 });

// ---------- S19: you climb the lifeguard tower ----------
const T = B.tower;
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(20, len - 8));
  return (
    <g transform={camT(T.x, 560, kf(t, [[0, 1.6], [len, 1.5]]))}>
      <Beach t={t + 260} />
      <Body look={YOU} pose={{ ...basePose, x: T.x + 110 - 90 * k, y: kf(k, [[0, B.sand + 200 - LEG_LEN * 0.75], [1, T.deck - 20 - LEG_LEN * 0.75]]), scale: 0.75, yaw: -0.3, armL: { a: 150 + 20 * Math.sin(t / 3), b: -20 }, armR: { a: 140 - 20 * Math.sin(t / 3), b: -20 }, legL: { a: 30 * Math.sin(t / 3), b: -30 }, legR: { a: -30 * Math.sin(t / 3), b: -30 } }} t={t} faces={[[0, 'worried']]} />
    </g>
  );
};

// ---------- S20: you shout: LIGHTS OFF! ----------
export const S20: React.FC<ShotProps> = (p) => {
  const Face = faceCU({ look: YOU, Bg: BeachOn, faces: [[0, 'shock']], yaw: 0.1, eyes: 0, zoom: [2.6, 2.8], pose: { armL: { a: 160, b: -30 }, armR: { a: 160, b: -30 } }, words: W, talk: [at('Everybody') / 30 - 0.05, at('Now', 2) / 30 + 0.5] });
  const { t } = p;
  return (
    <g>
      <Face {...p} />
      <g transform={`translate(960 170) scale(${backOut(clamp((t - 8) / 6))}) rotate(-3)`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={140} fill="#FFD23A" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">LIGHTS OFF!</text>
      </g>
    </g>
  );
};

// ---------- S21: for a second, nobody moves ----------
export const S21: React.FC<ShotProps> = ({ t }) => (
  <g transform={camT(160, 400, 1.6)}>
    <Beach t={300} />
  </g>
);

// ---------- S22: Mo flips the floodlight switch ----------
const SHACK = { x: 560, y: B.sand - 210 };
const Shack: React.FC<{ flip: number }> = ({ flip }) => (
  <g>
    <rect x={SHACK.x - 40} y={SHACK.y - 240} width={260} height={240} fill="#6A4A3A" stroke="#14121C" strokeWidth={6} />
    <path d={`M ${SHACK.x - 60} ${SHACK.y - 240} L ${SHACK.x + 90} ${SHACK.y - 300} L ${SHACK.x + 240} ${SHACK.y - 240} Z`} fill="#C8452A" stroke="#14121C" strokeWidth={6} />
    <text x={SHACK.x + 90} y={SHACK.y - 190} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#FFE27A">SNACKS</text>
    <rect x={SHACK.x - 30} y={SHACK.y - 140} width={70} height={100} rx={6} fill="#B8BCC8" stroke="#14121C" strokeWidth={5} />
    <g transform={`rotate(${-40 + 80 * flip} ${SHACK.x + 5} ${SHACK.y - 90})`}>
      <path d={`M ${SHACK.x + 5} ${SHACK.y - 90} L ${SHACK.x + 5} ${SHACK.y - 150}`} stroke="#14121C" strokeWidth={10} strokeLinecap="round" />
      <circle cx={SHACK.x + 5} cy={SHACK.y - 150} r={14} fill="#C8452A" />
    </g>
  </g>
);
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const flip = clamp((t - 16) / 5);
  return (
    <g transform={camT(SHACK.x - 20, SHACK.y - 140, 2.3)}>
      <Beach t={t + 320} lights={1 - flip} />
      <Shack flip={flip} />
      <Body look={MO} pose={{ ...basePose, x: SHACK.x - 140, y: SHACK.y - LEG_LEN * 0.6, scale: 0.6, yaw: 0.5, armR: { a: 100 - 40 * flip, b: -20 } }} t={t} faces={[[0, 'worried'], [20, 'smug']]} seed={3} />
    </g>
  );
};

// ---------- S23: grandpa's truck lights go off ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const on = t < 12 ? 1 : 0;
  return (
    <g>
      <Soft blur={16} dim={0.6}><g transform={camT(300, 400, 1.5)}><Beach t={t + 340} lights={0.5} /></g></Soft>
      <g transform="translate(960 640)">
        <rect x={-420} y={-200} width={840} height={260} rx={30} fill="#2E5A7A" stroke="#14121C" strokeWidth={8} />
        <rect x={-300} y={-360} width={600} height={180} rx={20} fill="#2E5A7A" stroke="#14121C" strokeWidth={8} />
        <rect x={-260} y={-330} width={520} height={130} rx={10} fill="#1A2030" />
        <rect x={-380} y={-40} width={760} height={50} rx={10} fill="#8A8E9A" stroke="#14121C" strokeWidth={5} />
        {[-300, 300].map((x, i) => (
          <g key={i}>
            <circle cx={x} cy={-110} r={56} fill={on ? '#FFF6D0' : '#4A4E5A'} stroke="#14121C" strokeWidth={6} />
            {on ? <Glow x={x} y={-110} r={260} kind="warm" o={0.9} /> : null}
          </g>
        ))}
        <circle cx={-300} cy={80} r={70} fill="#14121C" />
        <circle cx={300} cy={80} r={70} fill="#14121C" />
      </g>
      {on ? null : <rect width={1920} height={1080} fill="#000" opacity={0.25} />}
    </g>
  );
};

// ---------- S24: one by one, the phones and lanterns go out ----------
export const S24: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 400], [len, 700]]), 480, kf(t, [[0, 1.3], [len, 1.1]]))}>
    <Beach t={t + 360} lights={1} sweep={clamp(t / Math.max(20, len - 10))} />
  </g>
);

// ---------- S25: the faint starlight over the sea ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1300], [len, 1500]]), kf(t, [[0, 600], [len, 500]]), kf(t, [[0, 1.2], [len, 1.1]]))}>
    <Beach t={t + 380} lights={0} stars={1} seaGlow={clamp(t / 30)} />
    <Nest x={N.x} y={N.y} open={1} />
    <Hatchlings n={60} x={N.x - 300} y={N.y - 60} spread={260} t={t} s={0.55} o={0.9} go={(i) => [-100 + r(9, i) * 60 + Math.min(t, 50) * 0.6, 0]} seed={61} />
    <Body look={ELLIE} pose={ellie({ x: 1180, headTilt: -6 })} t={t} faces={[[0, 'worried']]} seed={5} />
  </g>
);

void GRANDPA;
