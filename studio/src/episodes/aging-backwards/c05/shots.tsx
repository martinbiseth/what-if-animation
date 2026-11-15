import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, FONT, Glow, LEG_LEN, talkAt,
  stand, Schematic, SchLabel, SCH, walkPose,
} from '../../../engine';
import { YOU, ELLIE, MOM, SUIT, DOCTOR, faceCU, bigWord, Soft, relW, dayK, span, ELLIE_K, MOM_K } from '../common';
import { Clinic, CLINIC, LIGHTBOX, HandXray, Folder, Lab, FoggyWindow } from '../sets';
import { StreetModern, STREETM, Car } from '../../electricity/sets';
import words from './words.json';

// Chapter 5, someone notices: day 8, the doctor and the bone age test (8 yesterday, 7 today); she leaves, and a man in
// a grey suit comes in instead. He sits at your eye level: there have been others, three in forty years. What happened
// to them? No answer. The folder: a lab two hours north, one year a month instead of one a night. The price: tonight,
// no visits, no calls, until midnight to decide. Through the window, Ellie draws the two of you in the fog.

const W = words;
const rel = relW(W);
const P0 = '#100E16';
const K = dayK(8);
const CLN: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Clinic t={t} id={id} />;
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" />;
const YOU_POS = stand(CLINIC, 0.42, 0.62, 0.62 * K);
const MOM_POS = stand(CLINIC, 0.24, 0.55, 0.62 * MOM_K);
const DOC_POS = stand(CLINIC, 0.66, 0.5, 0.62 * MOM_K);
const SUIT_POS = stand(CLINIC, 0.64, 0.6, 0.62 * 1.1);

/** A big label that pops on at frame a, with an optional second line. */
const Pop: React.FC<{ t: number; a: number; text: string; color?: string; y?: number; size?: number }> = ({ t, a, text, color = '#FFD23A', y = 200, size = 110 }) =>
  t < a ? null : (
    <g transform={`translate(960 ${y}) scale(${backOut(clamp((t - a) / 8))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={color} stroke={P0} strokeWidth={14} paintOrder="stroke">{text}</text>
    </g>
  );

// ---------- S1: the doctor's room: mum walks you in; the doctor waits by the light box ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 40);
  return (
    <g transform={camT(kf(t, [[0, 940], [len, 980]]), 540, kf(t, [[0, 1.3], [len, 1.4]]))}>
      <CLN t={t} />
      <Hero look={DOCTOR} pose={{ ...basePose, ...DOC_POS, yaw: -0.4, facing: -1, expr: 'neutral', blink: idleBlink(t, 4) }} />
      <Hero look={MOM} pose={walkPose(MOM_POS.x - 120 + k * 120, t / 3, MOM_POS.y + LEG_LEN * MOM_POS.scale, MOM_POS.scale, { expr: 'worried', blink: idleBlink(t, 2) })} />
      <Hero look={YOU} pose={walkPose(YOU_POS.x - 140 + k * 140, t / 3 + 1, YOU_POS.y + LEG_LEN * YOU_POS.scale, YOU_POS.scale, { expr: 'worried', blink: idleBlink(t, 5) })} />
    </g>
  );
};

// ---------- S2: your small hand flat on the X-ray plate, a scan line passing ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const scan = (t % 30) / 30;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#2A3440" />
      <rect x={460} y={220} width={1000} height={680} rx={20} fill="#1A222C" stroke="#5A6A7A" strokeWidth={10} />
      <g transform="translate(960 640)">
        <path d="M -500 400 L -140 120 Q -150 -60 -110 -140 L -80 -320 Q -60 -350 -40 -320 L -30 -150 L -10 -380 Q 10 -410 30 -380 L 40 -150 L 70 -350 Q 90 -380 110 -350 L 100 -120 L 160 -290 Q 180 -310 200 -280 L 160 -40 Q 230 -100 280 -60 Q 260 0 150 120 L 0 400 Z" fill="#26232F" stroke={P0} strokeWidth={8} />
      </g>
      <rect x={460} y={220 + scan * 660} width={1000} height={20} fill="#7FD4FF" opacity={0.5} />
      <Glow x={960} y={220 + scan * 660} r={300} kind="cool" o={0.4} />
    </g>
  );
};

// ---------- S3: the X-ray, big: the growth plates light up; BONE AGE TEST ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}>
    <Schematic t={t} id="c5x" />
    <HandXray x={560} y={180} w={520} h={700} age={8} label={false} />
    <g opacity={clamp((t - rel('Doctors', 'growth')) / 6)}>
      {[[760, 420], [840, 360], [900, 400], [960, 430]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={28 + 4 * Math.sin(t / 4 + i)} fill="none" stroke={SCH.live} strokeWidth={6} />
      ))}
      <SchLabel x={1440} y={420} t={t - rel('Doctors', 'growth')} text="GROWTH PLATES" size={48} color={SCH.live} />
    </g>
    <SchLabel x={1440} y={600} t={t - rel('Doctors', 'bone')} text="= BONE AGE TEST" size={48} />
    <g opacity={clamp((t - rel('Doctors', "That's")) / 6)} transform="translate(1440 760)">
      <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#1A1626" stroke={SCH.live} strokeWidth={3} />
      <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
    </g>
  </g>
);

// ---------- S4: the light box: YESTERDAY 8, then TODAY 7 ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const today = (rel('bone', 'today', 2) + 6) - 2;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#DCE6E4" />
      <rect x={260} y={160} width={1400} height={760} rx={16} fill="#EAF6FF" stroke={P0} strokeWidth={10} />
      <Glow x={960} y={540} r={900} kind="cool" o={0.4} />
      <HandXray x={300} y={200} w={640} h={680} age={8} label={false} />
      <g opacity={t > today ? 1 : 0.15}><HandXray x={980} y={200} w={640} h={680} age={7} label={false} /></g>
      <g transform="translate(620 990)"><text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill={P0}>YESTERDAY: 8</text></g>
      {t > today ? <g transform={`translate(1300 990) scale(${backOut(clamp((t - today) / 8))})`}><text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#C8323A">TODAY: 7</text></g> : null}
    </g>
  );
};

// ---------- S5: close, the doctor, blue light from the box on her face, very still ----------
export const S5 = faceCU({ look: DOCTOR, Bg: CLN, faces: [[0, 'neutral'], [40, 'worried']], yaw: 0.4, eyes: 0.7, zoom: [3.0, 3.6], light: { x: 1260, y: 420, kind: 'cool', o: 0.6 } });

// ---------- S6: the doctor walks out; you and mum left in the bright room ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 940]]), 540, kf(t, [[0, 1.4], [len, 1.45]]))}>
    <CLN t={t + 100} />
    <Hero look={DOCTOR} pose={walkPose(DOC_POS.x + t * 8, t / 3, DOC_POS.y + LEG_LEN * DOC_POS.scale, DOC_POS.scale, { expr: 'worried', blink: idleBlink(t, 4) })} />
    <Hero look={MOM} pose={{ ...basePose, ...MOM_POS, yaw: 0.4, expr: 'worried', blink: idleBlink(t, 2), look: 0.7 }} />
    <Hero look={YOU} pose={{ ...basePose, ...YOU_POS, yaw: 0.4, expr: 'worried', blink: idleBlink(t, 5), look: 0.7 }} />
  </g>
);

// ---------- S7: the door swings open: a tall dark silhouette against the corridor light ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => {
  const open = easeOut(clamp(t / 18));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#C4D2D0" />
      <rect x={640} y={120} width={640} height={960} fill="#FFFDF2" />
      <Glow x={960} y={600} r={600} kind="warm" o={0.4 * open} />
      <g opacity={clamp((t - 8) / 8)}>
        <Hero look={{ ...SUIT, jacket: '#121018', jacketShade: '#0E0C14', accent: '#121018', face: '#121018' }} pose={{ ...basePose, x: 960, y: 1080 - LEG_LEN * 1.9, scale: 1.9, expr: 'neutral' }} shadow={0} />
      </g>
      <polygon points={`640,120 ${640 + 640 * (1 - open)},${120 + 60 * open} ${640 + 640 * (1 - open)},${1080 - 30 * open} 640,1080`} fill="#8A9AA6" stroke={P0} strokeWidth={8} />
      <rect x={600} y={90} width={720} height={30} fill="#E8EEEC" stroke={P0} strokeWidth={6} />
    </g>
  );
};

// ---------- S8: the man in the grey suit, full figure, in the bright room ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1100], [len, 1060]]), 500, kf(t, [[0, 1.7], [len, 1.85]]))}>
    <CLN t={t + 200} />
    <Hero look={SUIT} pose={{ ...basePose, ...SUIT_POS, yaw: -0.3, facing: -1, expr: 'neutral', blink: idleBlink(t, 6), armL: { a: 8, b: 0 }, armR: { a: 8, b: 0 } }} />
    <text x={1460} y={260} fontFamily={FONT.ui} fontSize={30} letterSpacing={6} fill={P0} opacity={clamp((t - rel('man', 'name')) / 6)}>NO NAME.</text>
  </g>
);

// ---------- S9: he pulls a chair over and sits, his face level with yours ----------
const seat = (x: number, y: number, k: number, yaw: number, o: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y, scale: k, yaw, facing: yaw > 0 ? 1 : -1, legL: { a: 84, b: -84 }, legR: { a: 78, b: -80 }, armL: { a: 30, b: -70 }, armR: { a: 30, b: -70 }, ...o,
});
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const down = easeOut(clamp(t / 20));
  const sk = SUIT_POS.scale;
  const sy = kf(down, [[0, SUIT_POS.y], [1, SUIT_POS.y + 110 * sk]]);
  return (
    <g transform={camT(kf(t, [[0, 1020], [len, 1000]]), 560, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <CLN t={t + 300} />
      <rect x={SUIT_POS.x - 20} y={SUIT_POS.y + 110 * sk} width={120 * sk} height={14} fill="#5A646A" />
      <Hero look={SUIT} pose={down > 0.5 ? seat(SUIT_POS.x + 30, sy, sk, -0.5, { expr: 'neutral', blink: idleBlink(t, 6) }) : { ...basePose, ...SUIT_POS, y: sy, yaw: -0.5, facing: -1, expr: 'neutral' }} />
      <Hero look={YOU} pose={{ ...basePose, ...YOU_POS, x: YOU_POS.x + 160, yaw: 0.5, expr: 'worried', blink: idleBlink(t, 3) }} />
      <path d={`M ${YOU_POS.x + 100} ${YOU_POS.y - 176 * YOU_POS.scale} L ${SUIT_POS.x + 80} ${YOU_POS.y - 176 * YOU_POS.scale}`} stroke="#C8323A" strokeWidth={4} strokeDasharray="12 10" opacity={clamp((t - 30) / 8)} />
      <text x={(YOU_POS.x + SUIT_POS.x) / 2 + 100} y={YOU_POS.y - 176 * YOU_POS.scale - 30} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#C8323A" opacity={clamp((t - rel('sits', 'low')) / 6)}>EYE LEVEL (LOW)</text>
    </g>
  );
};

// ---------- S10: close, the suit: "We've been watching cases like yours" ----------
export const S10 = faceCU({ look: SUIT, Bg: CLN, faces: [[0, 'neutral']], yaw: -0.3, zoom: [2.9, 3.15], talk: span(W, "We've", 'others'), words: W, light: { x: 760, y: 400, kind: 'cool', o: 0.25 } });

// ---------- S11: THREE, IN FORTY YEARS ----------
export const S11 = bigWord({ kicker: 'OTHER CASES', word: '3 IN 40 YEARS', color: '#FF8A3D', Bg: CLN, size: 190 });

// ---------- S12: close, you: "What happened to them?" ----------
export const S12 = faceCU({ look: YOU, Bg: CLN, faces: [[0, 'worried']], yaw: 0.3, zoom: [3.3, 3.5], talk: span(W, 'What', 'them'), words: W, pose: { scale: K / 0.95 } });

// ---------- S13: close, the suit: silence; he looks away ----------
export const S13 = faceCU({ look: SUIT, Bg: CLN, faces: [[0, 'neutral']], yaw: -0.3, eyes: 0.6, zoom: [3.15, 3.4], dark: 0.1 });

// ---------- S14: the desk from above: the folder slides across to you; it opens on the lab ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const slide = easeOut(clamp(t / 24));
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.08]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#9A7A5A" />
      {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M -400 ${i * 110} Q 960 ${i * 110 + 30} 2400 ${i * 110}`} stroke="#8A6A4A" strokeWidth={4} fill="none" />)}
      <path d={`M ${1900 - slide * 700} 560 L 2400 560`} stroke="#26232F" strokeWidth={90} strokeLinecap="round" opacity={1 - clamp((t - 30) / 10)} />
      <Folder x={1500 - slide * 540} y={540} s={1.6} rot={-6 + slide * 4} open={clamp((t - 30) / 10)} />
    </g>
  );
};

// ---------- S15: the lab: white, a machine humming; NORTH RIDGE LAB · 2 HOURS NORTH ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 520, kf(t, [[0, 1.05], [len, 1.2]]))}>
      <Lab t={t} clock="14:20" glow={0.6} />
    </g>
    <g opacity={clamp(t / 8)}>
      <rect x={60} y={60} width={560} height={110} rx={16} fill="#0B0816" opacity={0.8} />
      <text x={90} y={130} fontFamily={FONT.ui} fontSize={42} fill="#F6EFE3">2 HOURS NORTH</text>
    </g>
    {[['DOCTORS', 'Doctors'], ['MACHINES', 'Machines'], ['NEVER TRIED ON A PERSON', 'never']].map(([s, cue], i) => (
      <g key={s} opacity={clamp((t - rel('lab', cue)) / 6)}>
        <rect x={60} y={820 - (2 - i) * 0 + i * 0} width={0} height={0} />
        <text x={1860} y={860 + i * 70 - 140} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={i === 2 ? '#FF5A3A' : '#26232F'} stroke="#F6EFE3" strokeWidth={8} paintOrder="stroke">{s}</text>
      </g>
    ))}
  </g>
);

// ---------- S16: the suit, talking: 1 YEAR / NIGHT becomes 1 YEAR / MONTH ----------
export const S16: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: SUIT, Bg: CLN, faces: [[0, 'neutral']], yaw: -0.35, zoom: [2.6, 2.75], side: 0, eyes: 0.6, talk: span(W, 'We', 'cure'), words: W });
  const sw = clamp((p.t - rel('think', 'instead')) / 8);
  return (
    <g>
      <F {...p} />
      <g transform="translate(1500 420)">
        <rect x={-380} y={-150} width={760} height={420} rx={24} fill="#0B0816" opacity={0.85} />
        <text y={-50} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3" opacity={clamp((p.t - rel('think', 'slow')) / 6)}>SLOW IT DOWN</text>
        <text y={60} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill={sw > 0.5 ? '#5AE0B0' : '#FF5A3A'} opacity={clamp((p.t - rel('think', 'One')) / 6)}>
          {sw > 0.5 ? '1 YEAR / MONTH' : '1 YEAR / NIGHT'}
        </text>
        <text y={180} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#FFD23A" opacity={clamp((p.t - rel('think', 'buys')) / 6)}>= YEARS TO FIND A CURE</text>
      </g>
    </g>
  );
};

// ---------- S17: close, you: "And if I come with you?" ----------
export const S17 = faceCU({ look: YOU, Bg: CLN, faces: [[0, 'worried']], yaw: 0.3, zoom: [3.3, 3.45], talk: span(W, 'And', 'you', 3), words: W, pose: { scale: K / 0.95 } });

// ---------- S18: the suit: TONIGHT. NO VISITS. NO CALLS. UNTIL MIDNIGHT ----------
export const S18: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: SUIT, Bg: CLN, faces: [[0, 'neutral']], yaw: -0.3, zoom: [3.0, 3.35], talk: span(W, 'Then', 'decide', 2), words: W, dark: 0.1 });
  const items: [string, string, string][] = [['TONIGHT.', 'tonight', '#F6EFE3'], ['NO VISITS.', 'visits', '#FF5A3A'], ['NO CALLS.', 'calls', '#FF5A3A'], ['UNTIL MIDNIGHT', 'midnight', '#FFD23A']];
  return (
    <g>
      <F {...p} />
      {items.map(([s, cue, c], i) => (
        <g key={s} opacity={clamp((p.t - rel('Then', cue, 2)) / 5)} transform={`translate(${i % 2 ? 1540 : 380} ${i < 2 ? 260 : 860})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill={c} stroke={P0} strokeWidth={12} paintOrder="stroke">{s}</text>
        </g>
      ))}
    </g>
  );
};

// ---------- S19: through the window blinds: the car park, mum by the red car, Ellie inside it ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 900], [len, 940]]), 640, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <DAY t={t + 300} />
      <Car x={980} y={STREETM.kerb + 70} s={0.95} color="#B8423A" />
      <Hero look={MOM} pose={{ ...basePose, x: 720, y: STREETM.kerb + 60 - LEG_LEN * 0.95, scale: 0.95, yaw: 0.4, expr: 'worried', blink: idleBlink(t, 3) }} />
      <circle cx={1040} cy={STREETM.kerb - 40} r={32} fill="#26232F" />
    </g>
    {/* the blinds and the window frame */}
    {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={0} y={i * 130} width={1920} height={18} fill="#E8EEEC" opacity={0.9} />)}
    <rect x={0} y={0} width={1920} height={1080} fill="none" stroke="#E8EEEC" strokeWidth={80} />
    <rect x={940} y={0} width={40} height={1080} fill="#E8EEEC" />
  </g>
);

// ---------- S20: the foggy car window: Ellie's finger draws two figures holding hands, a heart ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 520, kf(t, [[0, 1], [len, 1.08]]))}>
    <FoggyWindow t={t} draw={clamp((t - 6) / Math.max(30, (rel('drawing', 'holding') + 20)))} />
  </g>
);

// ---------- S21: 7 NIGHTS LEFT ----------
export const S21 = bigWord({ kicker: 'YOU HAVE', word: '7 NIGHTS LEFT', color: '#FF5A3A', size: 190 });

void ELLIE; void ELLIE_K; void Lab; void talkAt; void Soft; void LIGHTBOX;
