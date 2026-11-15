import React from 'react';
import {
  Hero, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, FONT, Glow, LEG_LEN, Schematic, SchLabel, SCH,
} from '../../../engine';
import { YOU, ELLIE, SUIT, DOCTOR, faceCU, bigWord, relW, dayK, span } from '../common';
import { Lab, LAB, DoorFrame, markH, ageK } from '../sets';
import words from './words.json';

// Chapter 7, the rule breaks: the white lab, 11:59, the machine. Midnight, and nothing happens: still six. The
// scientists cheer; one year a month, time. Then the suit's phone: a photo from mum, Ellie at the door frame, her
// newest mark lower than last week's. It only happens to you. Not any more. "Turn the car around. We need the
// sister." What's real, the question for the comments, subscribe for part two.

const W = words;
const rel = relW(W);
const P0 = '#100E16';
const K6 = ageK(6);
const LAB59: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Lab t={t} id={id} clock="11:59" glow={0.4} />;
const LAB00: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Lab t={t} id={id} clock="12:00" glow={0.9} bed={1} />;
const c = LAB.P(0.5, 0.62, 0.35);

// ---------- S1: the lab: white, silent, the machine waiting ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
    <LAB59 t={t} />
  </g>
);

// ---------- S2: 11:59: you lie on the bed, the rabbit on your chest, sliding into the ring ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const slide = easeOut(clamp(t / 60));
  const bedFront = LAB.P(0.5, 0.78, 0.35 + 0.5 * (1 - slide) + 0.3);
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.3], [len, 1.45]]))}>
      <Lab t={t + 40} clock="11:59" glow={0.5} bed={slide} />
      <g transform={`translate(${bedFront.x} ${bedFront.y - 30}) rotate(-90) scale(0.55)`}>
        <Hero look={YOU} pose={{ ...basePose, x: 0, y: 0, scale: K6, expr: 'worried', blink: idleBlink(t, 3), look: -0.5 }} shadow={0} />
      </g>
    </g>
  );
};

// ---------- S3: the lab clock rolls from 11:59 to 12:00 ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const p = LAB.P(0.82, 0.3, 0);
  return (
    <g transform={camT(p.x, p.y + 25, kf(t, [[0, 4.0], [len, 4.4]]))}>
      <Lab t={t + 80} clock={t < 8 ? '11:59' : '12:00'} glow={0.6} bed={1} />
    </g>
  );
};

// ---------- S4: close, you inside the ring, blue light, holding your breath: nothing happens ----------
export const S4: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: YOU, Bg: LAB00, faces: [[0, 'worried'], [rel('nothing', 'still') - 4, 'shock']], yaw: 0.1, zoom: [3.5, 3.7], light: { x: 960, y: 400, kind: 'cool', o: 0.6 }, pose: { scale: K6 / 0.95 } });
  return (
    <g>
      <F {...p} />
      <g transform="translate(1640 200)">
        <rect x={-150} y={-60} width={300} height={120} rx={20} fill="#0B0816" opacity={0.85} />
        <text x={-120} y={18} fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">AGE</text>
        <text x={120} y={30} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#5AE0B0">6</text>
      </g>
    </g>
  );
};

// ---------- S5: STILL 6 ----------
export const S5 = bigWord({ kicker: 'FOR THE FIRST TIME', word: 'STILL 6', color: '#5AE0B0', Bg: LAB00, size: 260 });

// ---------- S6: the lab: two scientists throw their arms up; the suit at the back, the corner of a smile ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const jump = Math.abs(Math.sin(t / 4)) * 20;
  const a = LAB.P(0.25, 1, 0.6);
  const b = LAB.P(0.75, 1, 0.6);
  const s = LAB.P(0.85, 1, 0.3);
  const k = (w: number) => (0.62 * 420 * LAB.s(w)) / 378;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.15], [len, 1.22]]))}>
      <LAB00 t={t + 100} />
      <Hero look={SUIT} pose={{ ...basePose, x: s.x, y: s.y - LEG_LEN * k(0.3) * 1.05, scale: k(0.3) * 1.05, yaw: -0.3, facing: -1, expr: t > rel('scientists', 'smiles') ? 'smug' : 'neutral', blink: idleBlink(t, 6) }} />
      {[a, b].map((p, i) => (
        <Hero key={i} look={{ ...DOCTOR, hair: i ? '#B9B4AA' : '#17131C', extra: i ? undefined : 'bob' }} pose={{ ...basePose, x: p.x, y: p.y - LEG_LEN * k(0.6) - (i ? jump : 20 - jump), scale: k(0.6), yaw: i ? -0.3 : 0.3, expr: 'happy', blink: idleBlink(t, i + 2), armL: { a: 160, b: -10 }, armR: { a: 160, b: -10 } }} />
      ))}
    </g>
  );
};

// ---------- S7: ONE YEAR A MONTH: YEARS OF TIME ----------
export const S7: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#0C1A16" />
    <Glow x={960} y={560} r={600} kind="cool" o={0.3} />
    <text x={960} y={340} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>ONE YEAR A MONTH</text>
    <g transform={`translate(960 640) scale(${backOut(clamp((t - rel('One', 'time')) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={200} fill="#5AE0B0" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">YOU HAVE TIME</text>
    </g>
  </g>
);

// ---------- S8: the suit's phone buzzes on the lab table: MOM · 1 PHOTO ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const buzz = t < 30 ? Math.sin(t * 3) * 5 : 0;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#D2DAE0" />
      <g transform={`translate(${960 + buzz} 560) rotate(-8)`}>
        <rect x={-220} y={-400} width={440} height={800} rx={56} fill="#15141C" stroke={P0} strokeWidth={8} />
        <rect x={-198} y={-378} width={396} height={756} rx={42} fill="#1A2238" />
        <text y={-240} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3">00:03</text>
        <g transform={`translate(0 -80) scale(${backOut(clamp((t - 6) / 8))})`}>
          <rect x={-180} y={-60} width={360} height={130} rx={24} fill="#F2F2F6" opacity={0.95} />
          <text x={-150} y={-10} fontFamily={FONT.ui} fontSize={32} fill={P0}>MOM</text>
          <text x={-150} y={40} fontFamily={FONT.ui} fontSize={28} fill="#5A5E68">📷 1 photo</text>
        </g>
      </g>
      {t < 30 ? <g stroke="#26232F" strokeWidth={8} strokeLinecap="round"><path d="M 680 400 l -40 -20 M 680 560 l -50 0 M 1240 400 l 40 -20 M 1240 560 l 50 0" /></g> : null}
    </g>
  );
};

// ---------- S9: the photo: Ellie against the kitchen door frame; her newest mark is lower than last week's ----------
const FX = 760;
const FY = 980;
const FH = 820;
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const low = rel('Ellie', 'lower');
  const ke = ageK(7) * 1.5;
  const ring = clamp((t - low) / 8);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, FX + 120]]), kf(t, [[0, 560], [len, FY - FH * markH(8) + 40]]), kf(t, [[0, 1.0], [len, 1.9]]))}>
      <DoorFrame x={FX} y={FY} h={FH} marks={[{ h: markH(15), label: '15' }, { h: markH(7), label: 'YOU 7' }, { h: markH(8), label: 'ELLIE · LAST WEEK', side: 'R', color: '#3A3440' }, { h: markH(7), label: 'ELLIE · TODAY', side: 'R', color: '#C8323A', on: clamp((t - low + 20) / 10) }]} />
      <Hero look={ELLIE} pose={{ ...basePose, x: FX + 230, y: FY - LEG_LEN * ke, scale: ke, yaw: 0, expr: 'worried', blink: idleBlink(t, 3) }} />
      {ring > 0 ? <ellipse cx={FX + FH * 0.45 + 60} cy={FY - FH * markH(7)} rx={150} ry={50} fill="none" stroke="#C8323A" strokeWidth={6} opacity={ring} /> : null}
      {/* the photo's white border */}
      <path d="M -2000 -2000 L 4000 -2000 L 4000 4000 L -2000 4000 Z M 300 60 L 1620 60 L 1620 1020 L 300 1020 Z" fill="#FFFDF4" fillRule="evenodd" opacity={kf(t, [[0, 1], [len * 0.4, 0]])} />
    </g>
  );
};

// ---------- S10: the rule card again: IT ONLY HAPPENS TO YOU, struck through: NOT ANYMORE ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const strike = clamp((t - rel('Remember', 'Not')) / 8);
  return (
    <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.1]])}) translate(-960 -540)`}>
      <Schematic t={t} id="c7r" />
      <SchLabel x={960} y={260} t={t - 2} text="REMEMBER THE RULE?" size={50} color={SCH.live} />
      <g transform="translate(960 560)">
        <rect x={-640} y={-120} width={1280} height={240} rx={20} fill="#F6EFE3" stroke={P0} strokeWidth={10} />
        <text y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill={P0}>IT ONLY HAPPENS TO YOU</text>
        <path d={`M -600 10 L ${-600 + 1200 * strike} 0`} stroke="#E8323A" strokeWidth={22} strokeLinecap="round" />
      </g>
      {strike > 0.5 ? (
        <g transform={`translate(960 860) scale(${backOut(clamp((strike - 0.5) * 3))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={130} fill="#FF5A3A" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">NOT ANYMORE.</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S11: close, you: where did your year go? ----------
export const S11: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: YOU, Bg: LAB00, faces: [[0, 'shock']], yaw: 0.2, zoom: [3.4, 3.8], light: { x: 960, y: 400, kind: 'cool', o: 0.5 }, pose: { scale: K6 / 0.95 } });
  return (
    <g>
      <F {...p} />
      <text x={960} y={200} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#FFD23A" stroke={P0} strokeWidth={12} paintOrder="stroke" opacity={clamp(p.t / 4)}>WHERE DID IT GO?</text>
    </g>
  );
};

// ---------- S12: close, the suit, phone to his ear: "Turn the car around. We need the sister." ----------
export const S12: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: SUIT, Bg: LAB00, faces: [[0, 'neutral']], yaw: -0.3, zoom: [3.0, 3.4], talk: span(W, 'Turn', 'sister'), words: W, dark: 0.15, pose: { armL: { a: 150, b: 120 } } });
  return (
    <g>
      <F {...p} />
      <rect x={720} y={300} width={70} height={140} rx={14} fill="#15141C" stroke={P0} strokeWidth={5} transform="rotate(-14 755 370)" />
      <g transform={`translate(960 940) scale(${backOut(clamp((p.t - rel('man', 'need', 2) ) / 8))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#FF5A3A" stroke={P0} strokeWidth={14} paintOrder="stroke">"WE NEED THE SISTER."</text>
      </g>
    </g>
  );
};

// ---------- S13: is any of this real? the three facts tick on ----------
export const S13: React.FC<ShotProps> = ({ t }) => {
  const rows: [string, string, number][] = [
    ['KIDS GROW ~2 INCHES A YEAR', 'CDC', rel('any', 'Kids')],
    ['BABIES: ~300 BONES', 'REAL', rel('any', 'Babies')],
    ['NOBODY REMEMBERS BEING A BABY', '3.2 YRS', rel('any', 'nobody')],
  ];
  return (
    <g>
      <Schematic t={t} id="c7real" />
      <SchLabel x={960} y={200} t={t - 2} text="IS ANY OF THIS REAL?" size={56} color={SCH.live} />
      {rows.map(([name, tag, a], i) => {
        const k = clamp((t - a) / 6);
        return (
          <g key={name} opacity={k} transform={`translate(${300 + (1 - k) * -40} ${380 + i * 170})`}>
            <path d="M 0 -6 l 16 18 l 34 -40" stroke={SCH.live} strokeWidth={10} fill="none" strokeLinecap="round" opacity={clamp((t - a - 6) / 4)} />
            <text x={90} y={14} fontFamily={FONT.ui} fontSize={50} fill={SCH.line}>{name}</text>
            <text x={1320} y={14} textAnchor="end" fontFamily={FONT.ui} fontSize={50} fill={SCH.glow}>{tag}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- S14: STAY OR GO? ----------
export const S14 = bigWord({ kicker: 'WHAT WOULD YOU DO?', word: 'STAY OR GO?', color: '#FFD23A', size: 200 });

// ---------- S15: TELL ME IN THE COMMENTS ----------
export const S15 = bigWord({ kicker: 'TELL ME', word: 'IN THE COMMENTS', color: '#FF8A3D', size: 150 });

// ---------- S16: end card: the door frame in the dark kitchen, Ellie's two marks; PART 2 ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(FX + 200, 560, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <DoorFrame x={FX} y={FY} h={FH} dark={0.3} marks={[{ h: markH(8), label: 'ELLIE · LAST WEEK', side: 'R' }, { h: markH(7), label: 'ELLIE · TODAY', side: 'R', color: '#C8323A' }]} />
    </g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.5} />
    <text x={960} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 8)}>WHAT'S HAPPENING TO ELLIE?</text>
    <g transform={`translate(960 600) scale(${backOut(clamp((t - 8) / 10))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={220} fill="#FF8A3D" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">PART 2</text>
    </g>
    <g opacity={clamp((t - 20) / 8)} transform="translate(960 820)">
      <rect x={-200} y={-50} width={400} height={90} rx={45} fill="#E8323A" />
      <text y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#FFFFFF">SUBSCRIBE</text>
    </g>
  </g>
);

void dayK; void c;
