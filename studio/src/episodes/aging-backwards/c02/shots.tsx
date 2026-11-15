import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, FONT,
  Bedroom, bedSit, Kitchen, KITCHEN, stand, AlarmClock, Schematic, SchLabel, SCH, BedDuvet, Paper,
} from '../../../engine';
import { YOU, ELLIE, MOM, MO, faceCU, bigWord, Soft, relW, dayK, ELLIE_K, MOM_K } from '../common';
import { StreetModern } from '../../electricity/sets';
import words from './words.json';

// Chapter 2, the rule: every night at midnight you lose a year, body only. Staying awake doesn't stop it (sleeves,
// socks, four seconds). Mo, mum and Ellie's cures. Only you: everyone else keeps getting older. The math on your
// homework: fourteen nights to zero. Nobody knows what happens at zero. And the planted rule: it only happens to you.

const W = words;
const rel = relW(W);
const P0 = '#100E16';
const K = dayK(2);
const NIGHT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} veil={0.7} clock="23:59" lamp={0.4} />;
const KIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} veil={0.18} />;
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" />;

/** A word said by someone in a close-up: a big label that pops on at frame a. */
const Says: React.FC<{ t: number; a: number; text: string; color?: string; y?: number }> = ({ t, a, text, color = '#FFD23A', y = 200 }) => (
  <g transform={`translate(960 ${y}) scale(${backOut(clamp((t - a) / 8))})`}>
    <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill={color} stroke={P0} strokeWidth={14} paintOrder="stroke">{text}</text>
  </g>
);

// ---------- S1: EVERY NIGHT AT 12:00 ----------
export const S1 = bigWord({ kicker: 'THE RULE: EVERY NIGHT AT', word: '12:00', color: '#FF5A3A', size: 280 });

// ---------- S2: the schematic: your memories stay; height, voice, bones, face each rewind one year ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const rows: [string, string][] = [['HEIGHT', 'height'], ['VOICE', 'voice'], ['BONES', 'bones'], ['FACE', 'face']];
  const rw = rel('Not', 'rewinds');
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}>
      <Schematic t={t} id="c2s" />
      <SchLabel x={560} y={250} t={t - 2} text="MEMORIES" size={60} />
      <SchLabel x={560} y={330} t={t - 8} text="KEPT" size={44} color="#5AE0B0" />
      <SchLabel x={1360} y={250} t={t - rel('Not', 'Just')} text="BODY" size={60} />
      {rows.map(([name, cue], i) => {
        const a = rel('Not', cue);
        const spin = clamp((t - rw) / 14);
        return (
          <g key={name} opacity={clamp((t - a) / 5)} transform={`translate(1360 ${400 + i * 120})`}>
            <text x={-40} y={18} textAnchor="end" fontFamily={FONT.ui} fontSize={50} fill={SCH.line}>{name}</text>
            <g transform={`translate(60 0) rotate(${-spin * 360})`}>
              <path d="M 30 0 A 30 30 0 1 1 0 -30" stroke={SCH.live} strokeWidth={8} fill="none" />
              <path d="M -2 -44 L 14 -30 L -2 -16 Z" fill={SCH.live} />
            </g>
            <text x={120} y={18} fontFamily={FONT.ui} fontSize={44} fill={SCH.live} opacity={spin}>−1 YEAR</text>
          </g>
        );
      })}
      {/* a brain glyph, safe in a ring */}
      <g transform="translate(560 560)" opacity={clamp((t - 6) / 8)}>
        <circle r={150} fill="none" stroke="#5AE0B0" strokeWidth={6} strokeDasharray="12 10" />
        <path d="M -70 20 Q -100 -60 -20 -80 Q 30 -110 70 -60 Q 110 -20 80 40 Q 40 90 -20 70 Q -70 70 -70 20 Z" fill="#F2A6B8" stroke={P0} strokeWidth={6} />
        <path d="M -40 -40 Q 0 -20 -10 20 M 20 -60 Q 40 -20 20 30 M -50 30 Q 0 40 50 10" stroke="#C8708A" strokeWidth={6} fill="none" />
      </g>
    </g>
  );
};

// ---------- S3: night, you sit up in bed, eyes wide open, staring at the clock ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const s = bedSit(0.22);
  const me: Pose = { ...basePose, ...s, scale: s.scale * K, yaw: 0.6, expr: 'tired', blink: 0, look: 0.8, armL: { a: 20, b: -40 }, armR: { a: 20, b: -40 }, headTilt: Math.sin(t / 20) * 3 };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 880]]), 470, kf(t, [[0, 2.3], [len, 2.5]]))}>
      <NIGHT t={t} />
      <Hero look={YOU} pose={me} />
      <BedDuvet from={0.13} knees={0.6} />
    </g>
  );
};

// ---------- S4: 12:00 ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.55}><g transform={camT(1000, 520, 1.6)}><NIGHT t={t + 300} /></g></Soft>
    <g transform={`translate(960 640) scale(${kf(t, [[0, 2.4], [len, 2.7]])}) translate(-960 -640)`}>
      <AlarmClock x={960} y={700} s={1.4} text="12:00" on={1} />
    </g>
    <rect width={1920} height={1080} fill="#FF3A2A" opacity={0.2 * (1 - clamp(t / 12))} />
  </g>
);

// ---------- S5: insert, your arm: the orange sleeve slides down over your hand ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const g = easeOut(clamp((t - 4) / 24));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.08]]))}>
      <Soft blur={16} dim={0.5}><g transform={camT(800, 520, 1.6)}><NIGHT t={t + 400} /></g></Soft>
      <path d="M -200 620 L 1100 560" stroke="#26232F" strokeWidth={110} strokeLinecap="round" />
      <g transform="translate(1180 556)">
        <ellipse rx={80} ry={60} fill="#26232F" stroke={P0} strokeWidth={6} />
        <ellipse cx={30} cy={-50} rx={26} ry={34} fill="#26232F" stroke={P0} strokeWidth={6} transform="rotate(30 30 -50)" />
      </g>
      {/* the sleeve, its cuff sliding from the wrist to past the fingers */}
      <path d={`M -300 500 L ${900 + g * 400} 470 L ${900 + g * 400} 670 L -300 760 Z`} fill="#F07A2A" stroke={P0} strokeWidth={8} />
      <rect x={880 + g * 400} y={466} width={60} height={208} rx={14} fill="#C85E1C" stroke={P0} strokeWidth={8} />
      <path d="M 200 560 q 100 30 200 0 M 500 540 q 100 30 200 0" stroke="#C85E1C" strokeWidth={8} fill="none" />
    </g>
  );
};

// ---------- S6: insert, your feet in socks: the toes pull back from the end, the sock tip goes floppy ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const g = easeOut(clamp((t - 4) / 24));
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.06]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#2A2438" />
      <rect x={-400} y={700} width={2800} height={800} fill="#3A3048" />
      {[620, 1180].map((x, k) => (
        <g key={k} transform={`translate(${x} 760) rotate(${k ? 4 : -4})`}>
          <path d="M -90 -520 L 90 -520 L 90 -60 Q 200 -50 230 20 Q 230 70 160 70 L -90 70 Z" fill="#E9E4DA" stroke={P0} strokeWidth={8} />
          <path d="M -90 -470 L 90 -470 M -90 -440 L 90 -440" stroke="#C8323A" strokeWidth={12} />
          {/* the foot inside: a darker shape, shrinking back from the tip */}
          <path d={`M -70 -500 L 70 -500 L 70 -60 Q ${170 - g * 110} -46 ${190 - g * 120} 20 Q ${190 - g * 120} 56 ${130 - g * 100} 56 L -70 56 Z`} fill="#000" opacity={0.12} />
          <path d={`M ${190 - g * 110} 40 Q ${210} 60 ${230} 30`} stroke="#B8B2A6" strokeWidth={6} fill="none" opacity={g} />
        </g>
      ))}
      <text x={960} y={200} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#FFD23A" stroke={P0} strokeWidth={12} paintOrder="stroke" opacity={clamp((t - rel('feet', 'four')) / 6)}>4 SECONDS</text>
    </g>
  );
};

// ---------- S7-S9: the cures: Mo (cold shower), mum (a doctor), Ellie (just don't sleep) ----------
export const S7: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: MO, Bg: DAY, faces: [[0, 'happy']], yaw: -0.35, zoom: [3.0, 3.25], talk: [W.find((w) => w.w === 'Mo')?.s ?? 0, W.find((w) => w.w === 'shower.')?.e ?? 0], words: W });
  return (<g><F {...p} /><Says t={p.t} a={rel('Mo', 'cold')} text="COLD SHOWER?" color="#7FD4FF" /></g>);
};
export const S8: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: MOM, Bg: KIT, faces: [[0, 'worried']], yaw: 0.35, zoom: [2.8, 3.0] });
  return (<g><F {...p} /><Says t={p.t} a={rel('mom', 'doctor')} text="A DOCTOR?" color="#F6EFE3" /></g>);
};
export const S9: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: ELLIE, Bg: NIGHT, faces: [[0, 'smug'], [rel('Ellie', 'which'), 'neutral']], yaw: -0.3, zoom: [3.3, 3.5] });
  return (
    <g>
      <F {...p} />
      <Says t={p.t} a={rel('Ellie', 'dont')} text="DON'T SLEEP!" color="#F28C6A" />
      <g opacity={clamp((p.t - rel('Ellie', 'which')) / 6)}>
        <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={6} fill="#F6EFE3">(YOU ALREADY TRIED THAT)</text>
      </g>
    </g>
  );
};

// ---------- S10: NOTHING WORKS. ----------
export const S10 = bigWord({ word: 'NOTHING WORKS.', color: '#FF5A3A', size: 190 });

// ---------- S11: the kitchen: mum, Mo and Ellie, an age tag over each one ticking up; yours ticks down ----------
const PM = stand(KITCHEN, 0.2, 0.45, 0.62 * MOM_K);
const PO = stand(KITCHEN, 0.42, 0.45, 0.62 * dayK(1));
const PE = stand(KITCHEN, 0.62, 0.45, 0.62 * ELLIE_K);
const PY = stand(KITCHEN, 0.82, 0.45, 0.62 * K);
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const tags: [typeof PM, string, string, string, number][] = [
    [PM, 'MOM', 'MOM +1 DAY', '#5AE0B0', rel('only', 'mom')],
    [PO, 'MO', 'MO +1 DAY', '#5AE0B0', rel('only', 'Mo')],
    [PE, 'ELLIE', 'ELLIE +1 DAY', '#5AE0B0', rel('only', 'Ellie')],
    [PY, 'YOU', 'YOU −1 YEAR', '#FF5A3A', 0],
  ];
  return (
    <g transform={camT(kf(t, [[0, 980], [len, 960]]), 520, kf(t, [[0, 1.35], [len, 1.4]]))}>
      <KIT t={t + 200} />
      <Hero look={MOM} pose={{ ...basePose, ...PM, yaw: 0.3, expr: 'neutral', blink: idleBlink(t, 5) }} />
      <Hero look={MO} pose={{ ...basePose, ...PO, yaw: 0.2, expr: 'happy', blink: idleBlink(t, 2) }} />
      <Hero look={ELLIE} pose={{ ...basePose, ...PE, yaw: -0.2, expr: 'happy', blink: idleBlink(t, 4) }} />
      <Hero look={YOU} pose={{ ...basePose, ...PY, yaw: -0.4, facing: -1, expr: 'worried', blink: idleBlink(t, 3) }} />
      {tags.map(([p, a, b, c, at], i) => {
        const k = clamp((t - at) / 6);
        const flip = i === 3 ? clamp((t - rel('only', 'Ellie') - 50) / 8) : clamp((t - at - 30) / 8);
        const top = p.y - 176 * p.scale - 62 * p.scale - 50;
        return (
          <g key={i} transform={`translate(${p.x} ${top}) scale(${backOut(k) * 0.8})`}>
            <rect x={-130} y={-34} width={260} height={52} rx={14} fill="#0B0816" opacity={0.85} />
            <text y={4} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={c}>{flip > 0.5 ? b : a}</text>
            <text x={146} y={6} fontFamily={FONT.title} fontWeight={800} fontSize={34} fill={c}>{i === 3 ? '▼' : '▲'}</text>
          </g>
        );
      })}
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#FFD23A" stroke={P0} strokeWidth={10} paintOrder="stroke" opacity={clamp(t / 8)}>ONLY YOU</text>
    </g>
  );
};

// ---------- S12: your homework, flipped over: the math, line by line ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const lines: [string, string, string][] = [['14 YEARS OLD', 'Fourteen', '#26232F'], ['− 1 YEAR / NIGHT', 'One', '#26232F'], ['= 14 NIGHTS', "That's", '#C8323A'], ['→ 0', 'Then', '#C8323A']];
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#7A5A44" />
      <g transform="translate(960 560) rotate(-3)">
        <rect x={-520} y={-420} width={1040} height={840} fill="#FFFDF4" stroke={P0} strokeWidth={6} />
        {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M -520 ${-340 + i * 56} L 520 ${-340 + i * 56}`} stroke="#B8D0E8" strokeWidth={3} />)}
        <path d="M -400 -420 L -400 420" stroke="#E8A0A0" strokeWidth={4} />
        {lines.map(([s, cue, c], i) => {
          const a = rel('math', cue);
          const w = clamp((t - a) / 10);
          return (
            <g key={i}>
              <defs><clipPath id={`hw${i}`}><rect x={-360} y={-320 + i * 160} width={820 * w} height={130} /></clipPath></defs>
              <text x={-340} y={-220 + i * 160} clipPath={`url(#hw${i})`} fontFamily="'Comic Sans MS', 'Bricolage Grotesque', sans-serif" fontWeight={700} fontSize={i === 3 ? 120 : 84} fill={c}>{s}</text>
            </g>
          );
        })}
      </g>
    </g>
  );
};

// ---------- S13: AGE 0 = ? ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />
    <Glow x={960} y={560} r={600} kind="red" o={0.3} />
    <text x={960} y={330} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>NOBODY KNOWS WHAT HAPPENS AT</text>
    <g transform={`translate(960 720) scale(${backOut(clamp((t - 4) / 10))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={420} fill="#FF5A3A" stroke="#0B0816" strokeWidth={18} paintOrder="stroke">0</text>
    </g>
  </g>
);

// ---------- S14: the rule on a card, stamped: IT ONLY HAPPENS TO YOU. On "breaks", it cracks ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const crack = clamp((t - rel('remember', 'breaks') - 2) / 6);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.12]])}) translate(-960 -540)`}>
      <Schematic t={t} id="c2r" />
      <SchLabel x={960} y={260} t={t - 2} text="REMEMBER THE RULE" size={50} color={SCH.live} />
      <g transform={`translate(960 560) scale(${backOut(clamp((t - rel('remember', 'only') + 4) / 10))})`}>
        <rect x={-640} y={-120} width={1280} height={240} rx={20} fill="#F6EFE3" stroke={P0} strokeWidth={10} />
        <text y={36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill={P0}>IT ONLY HAPPENS TO YOU</text>
        {crack > 0 ? (
          <path d={`M -120 -130 L -60 -40 L -110 10 L -20 60 L -60 130`} stroke="#0B0816" strokeWidth={14} fill="none" strokeDasharray={600} strokeDashoffset={600 - 600 * crack} strokeLinejoin="round" />
        ) : null}
      </g>
      {crack > 0 ? <rect x={-400} y={-400} width={2800} height={1900} fill="#FFFFFF" opacity={0.4 * (1 - crack)} /> : null}
      <SchLabel x={960} y={880} t={t - rel('remember', 'breaks')} text="...UNTIL IT DOESN'T" size={46} />
    </g>
  );
};

void Paper; void ELLIE_K;
