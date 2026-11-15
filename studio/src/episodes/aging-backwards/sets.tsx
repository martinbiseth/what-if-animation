import React from 'react';
import {
  makeRoom, Box, RoomShell, Glow, LightVeil, FloorPlant, WallFrame, Hero, Look, Pose, basePose, LEG_LEN, rnd, clamp, lerp, FONT, Pt,
} from '../../engine';

// The sets and props of "What if you aged backwards and couldn't stop?": the kitchen door frame with its pencil
// marks (the episode's hero prop), a bathroom mirror, a phone that won't recognise you, a soccer field, a doctor's
// room with an X-ray light box, a white lab with the machine, and the small things the story turns on (a kids'
// menu, a roof hatch, a stuffed rabbit, a foggy car window with a drawing in it).

const P0 = '#100E16';
const PAPER = '#F6EFE3';

// ---------------------------------------------------------------- ages
/** How tall someone is drawn at a given age: the rig's scale (you at 15 is about 1). */
export const ageK = (age: number) => 0.42 + 0.038 * age;
/** Where the top of the head of someone that age lands on the door frame (as a fraction of its height, drawn at 1.5x). */
export const markH = (age: number) => 0.758 * ageK(age);

// ---------------------------------------------------------------- the door frame
export type Mark = { h: number; label: string; color?: string; on?: number; side?: 'L' | 'R' };
/**
 * A white door frame on a kitchen-yellow wall, pencil height marks on its left jamb. x, y: the foot of the left jamb;
 * h: the frame's height on screen. Each mark's h is a fraction of the frame's height (a 15-year-old about 0.78).
 */
export const DoorFrame: React.FC<{ x: number; y: number; h: number; marks: Mark[]; wall?: boolean; dark?: number }> = ({ x, y, h, marks, wall = true, dark = 0 }) => {
  const w = h * 0.45;
  const j = h * 0.05;
  return (
    <g>
      {wall ? <rect x={x - 2000} y={y - h * 2} width={4000 + w} height={h * 3} fill="#E3C27A" /> : null}
      {wall ? <rect x={x - 2000} y={y} width={4000 + w} height={h} fill="#8A6A4A" /> : null}
      {/* the doorway: the hall beyond, darker */}
      <rect x={x + j} y={y - h} width={w - j * 2} height={h} fill="#5A4A5A" />
      <rect x={x + j} y={y - h} width={w - j * 2} height={h} fill="#000" opacity={0.25 + dark} />
      {/* jambs and the lintel */}
      <rect x={x} y={y - h - j} width={j} height={h + j} fill="#F4EEE2" stroke={P0} strokeWidth={h * 0.006} />
      <rect x={x + w - j} y={y - h - j} width={j} height={h + j} fill="#F4EEE2" stroke={P0} strokeWidth={h * 0.006} />
      <rect x={x} y={y - h - j} width={w} height={j} fill="#F4EEE2" stroke={P0} strokeWidth={h * 0.006} />
      <rect x={x + j * 0.6} y={y - h} width={j * 0.18} height={h} fill="#D8CFC0" />
      {marks.map((m, i) => {
        const my = y - h * m.h;
        const on = m.on ?? 1;
        const left = (m.side ?? 'L') === 'L';
        const x0 = left ? x - j * 0.1 : x + w - j * 0.9;
        return (
          <g key={i} opacity={clamp(on * 3)}>
            <path d={`M ${x0} ${my} l ${j * 1.0 * clamp(on)} 0`} stroke={m.color ?? '#3A3440'} strokeWidth={h * 0.006} strokeLinecap="round" />
            <text x={left ? x0 - j * 0.15 : x0 + j * 1.2} y={my + h * 0.009} textAnchor={left ? 'end' : 'start'} fontFamily={FONT.ui} fontSize={h * 0.026} fill={m.color ?? '#3A3440'}>
              {m.label}
            </text>
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- bathroom
/** A bathroom wall, front on: tiles, a mirror (its glass from mx-mw/2 to mx+mw/2, my-mh/2 to my+mh/2), a sink below. */
export const BATH = { mx: 960, my: 470, mw: 620, mh: 460, sink: 820 };
export const Bathroom: React.FC<{ t: number; id?: string; glass?: React.ReactNode }> = ({ glass }) => {
  const { mx, my, mw, mh, sink } = BATH;
  const tiles: React.ReactNode[] = [];
  for (let x = -400; x < 2400; x += 90) tiles.push(<path key={`x${x}`} d={`M ${x} -400 L ${x} 1500`} stroke="#9FB8B8" strokeWidth={3} />);
  for (let y = -400; y < 1500; y += 90) tiles.push(<path key={`y${y}`} d={`M -400 ${y} L 2400 ${y}`} stroke="#9FB8B8" strokeWidth={3} />);
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#BFD6D4" />
      {tiles}
      <Glow x={960} y={120} r={700} kind="warm" o={0.35} />
      {/* the mirror */}
      <rect x={mx - mw / 2 - 22} y={my - mh / 2 - 22} width={mw + 44} height={mh + 44} rx={20} fill="#E9E2D2" stroke={P0} strokeWidth={6} />
      <defs>
        <clipPath id="bathGlass">
          <rect x={mx - mw / 2} y={my - mh / 2} width={mw} height={mh} rx={8} />
        </clipPath>
      </defs>
      <rect x={mx - mw / 2} y={my - mh / 2} width={mw} height={mh} rx={8} fill="#8FB0BC" />
      <g clipPath="url(#bathGlass)">
        <rect x={mx - mw / 2} y={my - mh / 2} width={mw} height={mh} fill="#A9C6CC" />
        <rect x={mx - mw / 2} y={my + mh * 0.1} width={mw} height={mh} fill="#8FB0BC" />
        {glass}
        <path d={`M ${mx - mw / 2 + 60} ${my - mh / 2} l -120 ${mh} l 60 0 l 120 ${-mh} Z`} fill="#FFFFFF" opacity={0.18} />
        <path d={`M ${mx + 80} ${my - mh / 2} l -90 ${mh} l 26 0 l 90 ${-mh} Z`} fill="#FFFFFF" opacity={0.12} />
      </g>
      {/* the sink */}
      <path d={`M ${mx - 360} ${sink} L ${mx + 360} ${sink} L ${mx + 330} ${sink + 70} Q ${mx} ${sink + 120} ${mx - 330} ${sink + 70} Z`} fill="#F4F2EC" stroke={P0} strokeWidth={6} />
      <rect x={mx - 30} y={sink - 70} width={60} height={70} rx={8} fill="#C8CCD0" stroke={P0} strokeWidth={5} />
      <path d={`M ${mx} ${sink - 60} q 0 -40 60 -40 l 30 0`} stroke="#C8CCD0" strokeWidth={22} fill="none" strokeLinecap="round" />
      <path d={`M ${mx} ${sink - 60} q 0 -40 60 -40 l 30 0`} stroke={P0} strokeWidth={4} fill="none" strokeLinecap="round" opacity={0.5} />
      <rect x={mx + 200} y={sink - 50} width={34} height={50} rx={6} fill="#E86A5A" stroke={P0} strokeWidth={4} />
      <rect x={mx - 260} y={sink - 44} width={60} height={44} rx={8} fill="#7AB8E0" stroke={P0} strokeWidth={4} />
    </g>
  );
};

// ---------------------------------------------------------------- phone lock screen
/** A phone held up, the lock screen: FACE ID, then NOT RECOGNIZED (shake), then ENTER PASSCODE. */
export const LockPhone: React.FC<{ x: number; y: number; s?: number; t: number; fail: number; tries?: number; pass?: number; rot?: number }> = ({ x, y, s = 1, t, fail, tries = 0, pass = 0, rot = 0 }) => {
  const shakeX = fail > 0 && fail < 1 ? Math.sin(fail * 40) * 14 * (1 - fail) : 0;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-200} y={-400} width={400} height={800} rx={56} fill="#15141C" stroke={P0} strokeWidth={8} />
      <rect x={-180} y={-380} width={360} height={760} rx={42} fill={pass > 0.5 ? '#1A2238' : '#2A3A6A'} />
      <rect x={-60} y={-368} width={120} height={28} rx={14} fill="#000" />
      <text x={0} y={-250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill={PAPER}>7:00</text>
      {pass > 0.5 ? (
        <g>
          <text x={0} y={-120} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={PAPER}>Enter Passcode</text>
          {[0, 1, 2, 3, 4, 5].map((i) => <circle key={i} cx={-100 + i * 40} cy={-70} r={10} fill="none" stroke={PAPER} strokeWidth={3} />)}
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <g key={i}>
              <circle cx={-110 + (i % 3) * 110} cy={30 + Math.floor(i / 3) * 110} r={44} fill="#FFFFFF" opacity={0.15} />
              <text x={-110 + (i % 3) * 110} y={44 + Math.floor(i / 3) * 110} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={PAPER}>{i + 1}</text>
            </g>
          ))}
        </g>
      ) : (
        <g transform={`translate(${shakeX} 0)`}>
          {/* the Face ID glyph: corners, two eyes, a mouth that turns down on a fail */}
          <g transform="translate(0 20)" stroke={fail > 0 ? '#FF6A5A' : PAPER} strokeWidth={10} fill="none" strokeLinecap="round">
            <path d="M -70 -40 L -70 -70 L -40 -70 M 40 -70 L 70 -70 L 70 -40 M 70 40 L 70 70 L 40 70 M -40 70 L -70 70 L -70 40" />
            <path d="M -24 -20 L -24 -8 M 24 -20 L 24 -8" />
            <path d={fail > 0 ? 'M -28 36 Q 0 18 28 36' : 'M -28 22 Q 0 44 28 22'} />
          </g>
          <text x={0} y={180} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={fail > 0 ? '#FF8A7A' : PAPER}>{fail > 0 ? 'Face Not Recognized' : 'Face ID'}</text>
          {tries > 0 ? <text x={0} y={240} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill={PAPER} opacity={0.7}>{`Try again (${tries}/3)`}</text> : null}
        </g>
      )}
    </g>
  );
};

// ---------------------------------------------------------------- soccer field
export const FIELD = { feet: 860, horizon: 600 };
export const fieldHip = (scale = 1) => FIELD.feet - LEG_LEN * scale;
export const SoccerField: React.FC<{ t: number; id?: string; goal?: boolean }> = ({ t, id = 'fld', goal = true }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5AA8E6" />
        <stop offset="100%" stopColor="#BFE3F6" />
      </linearGradient>
    </defs>
    <rect x={-400} y={-400} width={2800} height={1100} fill={`url(#${id}sky)`} />
    {[[200, 160, 1], [1300, 110, 1.3], [1900, 200, 0.9]].map(([cx, cy, k], i) => (
      <g key={i} transform={`translate(${cx + ((t * 0.3) % 2400) - 400} ${cy}) scale(${k})`} fill="#FFFFFF" opacity={0.92}>
        <ellipse cx={0} cy={0} rx={110} ry={40} />
        <ellipse cx={60} cy={-24} rx={70} ry={44} />
        <ellipse cx={-50} cy={-14} rx={60} ry={36} />
      </g>
    ))}
    {/* the far tree line and a little stand */}
    {Array.from({ length: 30 }).map((_, i) => (
      <circle key={i} cx={-400 + i * 100} cy={FIELD.horizon - 40 - rnd(4, i) * 50} r={70 + rnd(5, i) * 30} fill={i % 2 ? '#3E7A46' : '#4A8A50'} />
    ))}
    <rect x={1300} y={FIELD.horizon - 110} width={420} height={110} fill="#8A9AAA" stroke={P0} strokeWidth={4} />
    {[0, 1, 2].map((k) => <rect key={k} x={1300} y={FIELD.horizon - 100 + k * 34} width={420} height={8} fill="#6A7A8A" />)}
    {/* grass in mowed stripes */}
    <rect x={-400} y={FIELD.horizon} width={2800} height={1000} fill="#5AA84E" />
    {Array.from({ length: 14 }).map((_, i) => (
      <polygon key={i} points={`${-400 + i * 200},${FIELD.horizon} ${-300 + i * 200},${FIELD.horizon} ${-700 + i * 400},1500 ${-900 + i * 400},1500`} fill="#4E9A44" opacity={i % 2 ? 0.9 : 0} />
    ))}
    <path d={`M -400 ${FIELD.horizon + 70} L 2400 ${FIELD.horizon + 70}`} stroke="#F4F4EC" strokeWidth={8} opacity={0.85} />
    <ellipse cx={960} cy={FIELD.horizon + 200} rx={420} ry={70} fill="none" stroke="#F4F4EC" strokeWidth={8} opacity={0.85} />
    {goal ? (
      <g>
        <path d={`M 1520 ${FIELD.horizon + 70} L 1520 ${FIELD.horizon - 120} L 1880 ${FIELD.horizon - 120} L 1880 ${FIELD.horizon + 70}`} stroke="#F8F8F2" strokeWidth={14} fill="none" />
        {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${1530 + i * 40} ${FIELD.horizon - 115} L ${1530 + i * 40} ${FIELD.horizon + 66}`} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} />)}
        {Array.from({ length: 5 }).map((_, i) => <path key={i} d={`M 1526 ${FIELD.horizon - 110 + i * 40} L 1874 ${FIELD.horizon - 110 + i * 40}`} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} />)}
      </g>
    ) : null}
  </g>
);

/** A soccer ball (x, y its centre). */
export const Ball: React.FC<{ x: number; y: number; r?: number; spin?: number }> = ({ x, y, r = 28, spin = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${spin})`}>
    <circle r={r} fill="#FFFFFF" stroke={P0} strokeWidth={r * 0.14} />
    <polygon points={[0, 1, 2, 3, 4].map((i) => `${Math.cos((i * 72 - 90) * Math.PI / 180) * r * 0.38},${Math.sin((i * 72 - 90) * Math.PI / 180) * r * 0.38}`).join(' ')} fill={P0} />
    {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M ${Math.cos((i * 72 - 90) * Math.PI / 180) * r * 0.38} ${Math.sin((i * 72 - 90) * Math.PI / 180) * r * 0.38} L ${Math.cos((i * 72 - 90) * Math.PI / 180) * r} ${Math.sin((i * 72 - 90) * Math.PI / 180) * r}`} stroke={P0} strokeWidth={r * 0.1} />)}
  </g>
);

// ---------------------------------------------------------------- the doctor's room
export const CLINIC = makeRoom({ x: 960, y: 500 }, { x0: 520, x1: 1400, y0: 320, y1: 740 }, 3.4);
/** Two hand X-rays on a light box on the back wall (ages a and b), a desk, a window onto the car park at the left. */
export const LIGHTBOX = { x: 1010, y: 360, w: 300, h: 190 };
export const Clinic: React.FC<{ t: number; id?: string; xr?: [number, number]; box?: number }> = ({ t, id = 'cln', xr = [8, 7], box = 1 }) => {
  const r = CLINIC;
  const { P, Q } = r;
  const W = { x0: P(0, 0.25, 0.25), x1: P(0, 0.62, 0.62) };
  return (
    <g>
      <RoomShell r={r} id={id} floor="tiles" wall="#DCE6E4" side="#C4D2D0" floorC="#AEB8BC" ceiling="#E8EEEC" lines="#8E9A9E" />
      {/* the window on the left wall: the car park, grey sky */}
      <polygon points={Q([[0, 0.22, 0.2], [0, 0.22, 0.62], [0, 0.66, 0.62], [0, 0.66, 0.2]])} fill="#B9CCD6" stroke={P0} strokeWidth={5} />
      <polygon points={Q([[0, 0.5, 0.2], [0, 0.5, 0.62], [0, 0.66, 0.62], [0, 0.66, 0.2]])} fill="#7A8490" />
      <polygon points={Q([[0, 0.22, 0.41], [0, 0.22, 0.42], [0, 0.66, 0.42], [0, 0.66, 0.41]])} fill="#E8EEEC" />
      {/* the light box and its two X-rays */}
      <rect x={LIGHTBOX.x - 10} y={LIGHTBOX.y - 10} width={LIGHTBOX.w + 20} height={LIGHTBOX.h + 20} rx={8} fill="#8A949A" stroke={P0} strokeWidth={4} />
      <rect x={LIGHTBOX.x} y={LIGHTBOX.y} width={LIGHTBOX.w} height={LIGHTBOX.h} fill={box ? '#EAF6FF' : '#5A646A'} />
      {box ? <Glow x={LIGHTBOX.x + LIGHTBOX.w / 2} y={LIGHTBOX.y + LIGHTBOX.h / 2} r={300} kind="cool" o={0.5} /> : null}
      <HandXray x={LIGHTBOX.x + 8} y={LIGHTBOX.y + 8} w={LIGHTBOX.w / 2 - 12} h={LIGHTBOX.h - 16} age={xr[0]} />
      <HandXray x={LIGHTBOX.x + LIGHTBOX.w / 2 + 4} y={LIGHTBOX.y + 8} w={LIGHTBOX.w / 2 - 12} h={LIGHTBOX.h - 16} age={xr[1]} />
      {/* an eye chart, a height scale, a cabinet, the desk */}
      <rect x={600} y={380} width={90} height={130} fill="#FFFFFF" stroke={P0} strokeWidth={3} />
      {['E', 'F P', 'T O Z', 'L P E D'].map((s, i) => <text key={i} x={645} y={410 + i * 28} textAnchor="middle" fontFamily={FONT.ui} fontSize={28 - i * 5} fill={P0}>{s}</text>)}
      <Box r={r} u={[0.82, 0.98]} v={[0.55, 1]} w={[0.02, 0.2]} front="#C8D2D6" top="#DCE4E8" side="#B0BCC0" />
      <FloorPlant r={r} u={0.08} w={0.12} size={0.9} />
      <Box r={r} u={[0.3, 0.75]} v={[0.76, 0.8]} w={[0.42, 0.62]} front="#9A7A5A" top="#B8946E" side="#7A5E44" />
      <Box r={r} u={[0.32, 0.36]} v={[0.8, 1]} w={[0.44, 0.6]} front="#7A5E44" top="#7A5E44" side="#6A4E38" />
      <Box r={r} u={[0.69, 0.73]} v={[0.8, 1]} w={[0.44, 0.6]} front="#7A5E44" top="#7A5E44" side="#6A4E38" />
      <LightVeil id={`${id}v`} lights={[[1160, 420, 600], [700, 300, 700]]} o={0.12} />
      {void t}
    </g>
  );
};

/** A hand X-ray: dark film, the bones pale. A younger hand has wider gaps at the growth plates and fewer wrist bones. */
export const HandXray: React.FC<{ x: number; y: number; w: number; h: number; age: number; label?: boolean }> = ({ x, y, w, h, age, label = true }) => {
  const k = w / 140;
  const gap = (3 + (15 - age) * 0.7) * k;
  const carpals = Math.max(2, Math.min(8, Math.round(age * 0.6)));
  const fingers = [-44, -20, 2, 24, 50];
  const lens = [[34, 22, 18], [40, 26, 18], [44, 28, 20], [40, 26, 18], [26, 20, 0]];
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={4} fill="#121822" />
      <g transform={`translate(${x + w / 2} ${y + h * 0.66}) scale(${k * 0.98})`} fill="#DDE8F0" opacity={0.9}>
        <rect x={-34} y={20} width={22} height={60} rx={8} />
        <rect x={6} y={20} width={22} height={60} rx={8} />
        {Array.from({ length: carpals }).map((_, i) => <circle key={i} cx={-30 + (i % 4) * 18} cy={4 - Math.floor(i / 4) * 16} r={7} />)}
        {fingers.map((fx, i) => {
          let yy = -16;
          const a = i === 4 ? 30 : (i - 2) * 5;
          return (
            <g key={i} transform={`rotate(${a} ${fx * 0.4} 0)`}>
              {lens[i].filter((l) => l > 0).map((l, j) => {
                const top = yy - l;
                const el = <rect key={j} x={fx - 5} y={top} width={10} height={l} rx={5} />;
                yy = top - gap / k;
                return el;
              })}
            </g>
          );
        })}
      </g>
      {label ? <text x={x + 8} y={y + 20} fontFamily={FONT.ui} fontSize={14 * k} fill="#9FC0FF">{`AGE ${age}`}</text> : null}
    </g>
  );
};

/** A manila folder lying on a desk (x, y its centre), with a red CONFIDENTIAL stamp. */
export const Folder: React.FC<{ x: number; y: number; s?: number; rot?: number; open?: number }> = ({ x, y, s = 1, rot = 0, open = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -170 -110 L -60 -110 L -40 -130 L 60 -130 L 70 -110 L 170 -110 L 170 110 L -170 110 Z" fill="#D9B26A" stroke={P0} strokeWidth={6} />
    {open > 0 ? (
      <g opacity={clamp(open)}>
        <rect x={-150} y={-96} width={300} height={190} fill="#FFFFFF" stroke={P0} strokeWidth={3} />
        <text x={-130} y={-60} fontFamily={FONT.ui} fontSize={22} fill={P0}>NORTH RIDGE LAB</text>
        {[0, 1, 2, 3].map((i) => <rect key={i} x={-130} y={-40 + i * 26} width={200 - i * 30} height={8} fill="#9AA0A8" />)}
        <rect x={60} y={-30} width={70} height={90} fill="#DDE6EE" stroke={P0} strokeWidth={2} />
      </g>
    ) : null}
    <g transform="translate(0 30) rotate(-8)" opacity={open > 0 ? 0 : 1}>
      <rect x={-130} y={-26} width={260} height={52} fill="none" stroke="#C8323A" strokeWidth={6} />
      <text x={0} y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#C8323A">CONFIDENTIAL</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- the lab
export const LAB = makeRoom({ x: 960, y: 480 }, { x0: 560, x1: 1360, y0: 300, y1: 720 }, 3.6);
/** The white lab: tiles, monitors on the back wall, a big ring machine (an open tube) in the middle, a clock. */
export const Lab: React.FC<{ t: number; id?: string; clock?: string; glow?: number; bed?: number }> = ({ t, id = 'lab', clock = '11:59', glow = 0.5, bed = 0 }) => {
  const r = LAB;
  const { P, Q } = r;
  const c = P(0.5, 0.62, 0.35);
  const R = 150 * r.s(0.35) / r.s(0);
  return (
    <g>
      <RoomShell r={r} id={id} floor="tiles" wall="#E8EEF2" side="#D2DAE0" floorC="#C4CCD2" ceiling="#F2F6F8" lines="#A8B2BA" />
      {[0.2, 0.5, 0.8].map((u, i) => (
        <polygon key={i} points={Q([[u - 0.08, 0, 0.2], [u + 0.08, 0, 0.2], [u + 0.08, 0, 0.5], [u - 0.08, 0, 0.5]])} fill="#FFFFFF" />
      ))}
      {/* monitors with lines that crawl */}
      {[0.12, 0.3].map((u, i) => {
        const p = P(u, 0.32, 0);
        return (
          <g key={i}>
            <rect x={p.x - 70} y={p.y} width={140} height={90} rx={6} fill="#14202A" stroke={P0} strokeWidth={4} />
            <path d={Array.from({ length: 14 }).map((_, k) => `${k ? 'L' : 'M'} ${p.x - 60 + k * 9} ${p.y + 45 + Math.sin(k * 1.3 + t / 6 + i) * 18}`).join(' ')} stroke="#5AE0B0" strokeWidth={3} fill="none" />
          </g>
        );
      })}
      {(() => {
        const p = P(0.82, 0.3, 0);
        return (
          <g>
            <rect x={p.x - 90} y={p.y - 10} width={180} height={70} rx={10} fill="#14181E" stroke={P0} strokeWidth={4} />
            <text x={p.x} y={p.y + 44} textAnchor="middle" fontFamily={FONT.ui} fontSize={50} fill={clock === '12:00' ? '#FF5A4A' : '#5AE0B0'}>{clock}</text>
          </g>
        );
      })()}
      {/* the machine: a thick ring standing on the floor, a bed sliding into it */}
      <Glow x={c.x} y={c.y} r={R * 1.6} kind="cool" o={0.4 * glow + 0.15} />
      <ellipse cx={c.x} cy={c.y} rx={R * 1.15} ry={R * 1.2} fill="#F4F6F8" stroke={P0} strokeWidth={6} />
      <ellipse cx={c.x} cy={c.y} rx={R * 0.62} ry={R * 0.66} fill="#3A4A5A" stroke={P0} strokeWidth={5} />
      <ellipse cx={c.x} cy={c.y} rx={R * 0.62} ry={R * 0.66} fill="#9FD8FF" opacity={0.3 + 0.5 * glow} />
      <ellipse cx={c.x} cy={c.y} rx={R * 0.9} ry={R * 0.94} fill="none" stroke="#9FD8FF" strokeWidth={6} opacity={0.4 + 0.5 * glow} strokeDasharray="20 14" strokeDashoffset={-t * 2} />
      <polygon points={Q([[0.42, 0.78, 0.35 + 0.5 * (1 - bed)], [0.58, 0.78, 0.35 + 0.5 * (1 - bed)], [0.58, 0.78, 0.95], [0.42, 0.78, 0.95]])} fill="#FFFFFF" stroke={P0} strokeWidth={4} />
      <Box r={r} u={[0.45, 0.55]} v={[0.8, 1]} w={[0.7, 0.9]} front="#B8C2CA" top="#D0D8DE" side="#A0AAB2" />
      <LightVeil id={`${id}v`} lights={[[c.x, c.y, 700]]} o={0.08} />
    </g>
  );
};

// ---------------------------------------------------------------- small props
/** Ellie's stuffed rabbit: grey-brown, long ears, a pink nose, one ear bent. */
export const Rabbit: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <ellipse cx={-26} cy={-120} rx={16} ry={52} fill="#B8A08A" stroke={P0} strokeWidth={6} transform="rotate(-12 -26 -120)" />
    <path d="M 24 -150 Q 30 -200 70 -186 Q 60 -150 34 -120 Z" fill="#B8A08A" stroke={P0} strokeWidth={6} />
    <ellipse cx={0} cy={20} rx={58} ry={64} fill="#B8A08A" stroke={P0} strokeWidth={6} />
    <ellipse cx={0} cy={30} rx={32} ry={38} fill="#E8DCCB" />
    <circle cx={0} cy={-64} r={50} fill="#B8A08A" stroke={P0} strokeWidth={6} />
    <circle cx={-18} cy={-70} r={6} fill={P0} />
    <circle cx={18} cy={-70} r={6} fill={P0} />
    <ellipse cx={0} cy={-52} rx={8} ry={6} fill="#F28C9A" />
    <ellipse cx={-50} cy={70} rx={22} ry={16} fill="#B8A08A" stroke={P0} strokeWidth={5} />
    <ellipse cx={50} cy={70} rx={22} ry={16} fill="#B8A08A" stroke={P0} strokeWidth={5} />
  </g>
);

/** A step stool (x, y the middle of its feet). */
export const StepStool: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -70 0 L -56 -90 M 70 0 L 56 -90" stroke="#3A6EB0" strokeWidth={14} strokeLinecap="round" />
    <rect x={-80} y={-104} width={160} height={24} rx={8} fill="#4A8AD0" stroke={P0} strokeWidth={5} />
    <rect x={-64} y={-50} width={128} height={18} rx={6} fill="#4A8AD0" stroke={P0} strokeWidth={4} />
  </g>
);

/** A school portrait in a frame on a fridge door: the face of whoever `look` is, at `age`. */
export const SchoolPhoto: React.FC<{ x: number; y: number; s?: number; look: Look; label?: string; rot?: number }> = ({ x, y, s = 1, look, label = 'GRADE 4', rot = 0 }) => {
  const pose: Pose = { ...basePose, x: 0, y: 150, scale: 1, expr: 'happy', yaw: 0.15 };
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-130} y={-160} width={260} height={320} fill="#FFFFFF" stroke={P0} strokeWidth={6} />
      <defs>
        <clipPath id={`sp${label.replace(/\W/g, '')}`}>
          <rect x={-110} y={-140} width={220} height={240} />
        </clipPath>
      </defs>
      <rect x={-110} y={-140} width={220} height={240} fill="#6A9ACA" />
      <g clipPath={`url(#sp${label.replace(/\W/g, '')})`}>
        <g transform="scale(0.85)">
          <Hero look={look} pose={pose} shadow={0} />
        </g>
      </g>
      <text x={0} y={140} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill={P0}>{label}</text>
      <circle cx={0} cy={-170} r={16} fill="#E83A3A" stroke={P0} strokeWidth={4} />
    </g>
  );
};

/** The fridge door, front on: white, a handle, magnets and drawings (fill the frame behind a school photo). */
export const FridgeDoor: React.FC = () => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#E8EAEC" />
    <rect x={1500} y={-400} width={60} height={1900} fill="#C8CCD0" stroke={P0} strokeWidth={6} />
    <rect x={1620} y={200} width={40} height={600} rx={20} fill="#B0B6BC" stroke={P0} strokeWidth={6} />
    <g transform="translate(420 300) rotate(-6)">
      <rect x={-140} y={-110} width={280} height={220} fill="#FFF8E6" stroke={P0} strokeWidth={4} />
      <circle cx={-40} cy={-20} r={40} fill="none" stroke="#E8823A" strokeWidth={8} />
      <path d="M -120 80 L -60 20 L 0 70 L 60 0 L 120 80" stroke="#4A9A5A" strokeWidth={8} fill="none" />
      <circle cx={0} cy={-120} r={14} fill="#3A8AD0" stroke={P0} strokeWidth={3} />
    </g>
    <g transform="translate(1250 760) rotate(5)">
      <rect x={-120} y={-80} width={240} height={160} fill="#FFFFFF" stroke={P0} strokeWidth={4} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={-100} y={-56 + i * 32} width={200 - i * 30} height={8} fill="#9AA0A8" />)}
      <circle cx={0} cy={-90} r={14} fill="#F2C43A" stroke={P0} strokeWidth={3} />
    </g>
  </g>
);

/** The kids' menu on a diner table: a paper placemat with a maze, KIDS MENU, three crayons. */
export const KidsMenu: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#B8423A" />
    {Array.from({ length: 30 }).map((_, i) => <path key={i} d={`M ${-400 + i * 100} -400 L ${-400 + i * 100} 1500`} stroke="#A8362E" strokeWidth={40} />)}
    <g transform={`translate(960 560) rotate(${-4 + Math.sin(t / 30)})`}>
      <rect x={-520} y={-360} width={1040} height={720} rx={10} fill="#FFFDF4" stroke={P0} strokeWidth={8} />
      <text x={0} y={-250} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#E8823A" stroke={P0} strokeWidth={6} paintOrder="stroke">KIDS MENU</text>
      <text x={0} y={-180} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={P0}>AGES 12 AND UNDER</text>
      {['MINI BURGER ....... $4', 'CHICKEN BITES ..... $4', 'MAC & CHEESE ...... $3'].map((s, i) => (
        <text key={i} x={-440} y={-80 + i * 70} fontFamily={FONT.ui} fontSize={40} fill={P0}>{s}</text>
      ))}
      {/* a maze, half drawn in with a crayon */}
      <g transform="translate(260 150)" stroke={P0} strokeWidth={8} fill="none">
        <rect x={-150} y={-120} width={300} height={240} />
        <path d="M -150 -60 L 60 -60 M -90 0 L 150 0 M -150 60 L 60 60 M 0 -120 L 0 -60 M -30 60 L -30 120" />
        <path d="M -120 -90 L 90 -90 L 90 -30 L -120 -30 L -120 30 L 120 30 L 120 90" stroke="#3A8AD0" strokeWidth={10} strokeDasharray={900} strokeDashoffset={900 - 900 * clamp(t / 60)} />
      </g>
    </g>
    {[['#3A8AD0', 1360, 760, 30], ['#E8C23A', 1420, 830, 18], ['#3AAA5A', 1300, 870, 40]].map(([c, x, y, r], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${r})`}>
        <rect x={-120} y={-16} width={240} height={32} rx={6} fill={c as string} stroke={P0} strokeWidth={5} />
        <path d="M 120 -16 L 160 0 L 120 16 Z" fill={c as string} stroke={P0} strokeWidth={5} />
        <rect x={-60} y={-16} width={70} height={32} fill="#FFFFFF" opacity={0.5} />
      </g>
    ))}
  </g>
);

/** A cinema ticket: ADMIT ONE, CHILD, the price stamped. */
export const Ticket: React.FC<{ x: number; y: number; s?: number; rot?: number; stamp?: number }> = ({ x, y, s = 1, rot = 0, stamp = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -300 -140 L 300 -140 L 300 -40 A 40 40 0 0 0 300 40 L 300 140 L -300 140 L -300 40 A 40 40 0 0 0 -300 -40 Z" fill="#F4D36A" stroke={P0} strokeWidth={8} />
    <path d="M 160 -140 L 160 140" stroke={P0} strokeWidth={4} strokeDasharray="12 10" />
    <text x={-260} y={-70} fontFamily={FONT.ui} fontSize={40} fill={P0}>ADMIT ONE</text>
    <text x={-260} y={50} fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#C8323A">CHILD</text>
    <text x={230} y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill={P0} transform="rotate(-90 230 0)">$6</text>
    <g opacity={stamp} transform="translate(-40 100) rotate(-12)">
      <text textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#3A6EB0">UNDER 12</text>
    </g>
  </g>
);

/** The roof hatch from below: a square in a ceiling, a ladder, the handle up out of reach. */
export const RoofHatch: React.FC<{ t: number; open?: number }> = ({ open = 0 }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#2A2438" />
    <rect x={-400} y={-400} width={2800} height={700} fill="#3A3448" />
    <rect x={700} y={60} width={520} height={240} fill="#14101E" />
    <g transform={`translate(700 60) scale(1 ${1 - 0.8 * open})`}>
      <rect x={0} y={0} width={520} height={240} fill="#6A5A4A" stroke={P0} strokeWidth={8} />
      <rect x={30} y={30} width={460} height={180} fill="none" stroke="#4A3E32" strokeWidth={6} />
    </g>
    <rect x={930} y={250} width={60} height={24} rx={8} fill="#C8CCD0" stroke={P0} strokeWidth={5} />
    {/* the ladder */}
    <path d="M 780 300 L 740 1200 M 1140 300 L 1180 1200" stroke="#9A8A6A" strokeWidth={26} />
    {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M ${775 - i * 7} ${400 + i * 150} L ${1145 + i * 7} ${400 + i * 150}`} stroke="#9A8A6A" strokeWidth={20} />)}
  </g>
);

/** A foggy car window from outside, a drawing in the fog by a finger: two stick figures holding hands, a heart. */
export const FoggyWindow: React.FC<{ t: number; draw: number }> = ({ t, draw }) => {
  const path = 'M 760 420 m -40 0 a 40 40 0 1 0 80 0 a 40 40 0 1 0 -80 0 M 760 460 L 760 600 M 760 600 L 720 700 M 760 600 L 800 700 M 760 500 L 860 520 '
    + 'M 1080 470 m -30 0 a 30 30 0 1 0 60 0 a 30 30 0 1 0 -60 0 M 1080 500 L 1080 610 M 1080 610 L 1050 690 M 1080 610 L 1110 690 M 1080 530 L 860 520 '
    + 'M 920 360 c -30 -40 -80 0 0 50 c 80 -50 30 -90 0 -50';
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#5A6470" />
      {/* the car's red door around the glass */}
      <rect x={-400} y={820} width={2800} height={800} fill="#B8423A" />
      <path d="M 300 820 L 420 160 L 1500 160 L 1700 820 Z" fill="#2A3440" stroke={P0} strokeWidth={14} />
      <defs>
        <clipPath id="fogClip">
          <path d="M 300 820 L 420 160 L 1500 160 L 1700 820 Z" />
        </clipPath>
        <mask id="fogMask">
          <rect x={0} y={0} width={1920} height={1080} fill="#FFFFFF" />
          <path d={path} stroke="#000" strokeWidth={34} fill="none" strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - draw} />
        </mask>
      </defs>
      <g clipPath="url(#fogClip)">
        {/* inside the car: Ellie's dark face low, seen through where the fog is wiped */}
        <rect x={0} y={0} width={1920} height={1080} fill="#1A2028" />
        <circle cx={1300} cy={760} r={130} fill="#26232F" />
        <circle cx={1260} cy={740} r={16} fill={PAPER} />
        <circle cx={1330} cy={740} r={16} fill={PAPER} />
        <rect x={0} y={0} width={1920} height={1080} fill="#C8D2DA" opacity={0.86} mask="url(#fogMask)" />
        {Array.from({ length: 16 }).map((_, i) => (
          <circle key={i} cx={450 + rnd(2, i) * 1100} cy={200 + rnd(3, i) * 560 + (t * (0.3 + rnd(4, i))) % 60} r={4 + rnd(5, i) * 5} fill="#FFFFFF" opacity={0.35} />
        ))}
      </g>
    </g>
  );
};

/** A black car at night, lights off (a side view). */
export const BlackCar: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <path d="M -260 -40 L -220 -110 L -120 -170 L 110 -170 L 190 -110 L 270 -90 L 280 -30 L -270 -30 Z" fill="#15151C" stroke="#000" strokeWidth={6} />
    <path d="M -190 -110 L -110 -158 L -10 -158 L -10 -110 Z M 10 -110 L 10 -158 L 100 -158 L 160 -110 Z" fill="#2A3444" />
    <path d="M -180 -112 L -120 -150" stroke="#5A6A80" strokeWidth={4} opacity={0.6} />
    <circle cx={-170} cy={-30} r={46} fill="#0A0A0E" stroke="#3A3A44" strokeWidth={8} />
    <circle cx={180} cy={-30} r={46} fill="#0A0A0E" stroke="#3A3A44" strokeWidth={8} />
    <rect x={250} y={-84} width={26} height={16} rx={4} fill="#3A3A44" />
  </g>
);

export { lerp, Pt };
