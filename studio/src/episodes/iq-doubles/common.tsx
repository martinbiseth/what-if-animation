import React from 'react';
import {
  Hero, Look, Pose, ShotProps, basePose, camT, clamp, kf, backOut, easeOut, FONT, Glow, rnd, idleBlink, faceAt, Expr, Schematic, UI,
  Bedroom, Kitchen, Classroom, Study, BEDROOM, KITCHEN, CLS, STUDY, stand, LEG_LEN,
} from '../../engine';
import { YOU, MOM, ELLIE, MO, faceCU, bigWord, wordF, span, Soft, handAt, DarkBg, Icon } from '../electricity/common';
import { LivingRoom, StreetModern, Car, streetHip, STREETM } from '../electricity/sets';

// Shared by every chapter of "What if your IQ doubled every day?": the cast (the same family as the electricity
// episode), the sets with their times of day, and the props the story turns on: the puzzle cube, the IQ readout, the
// thermometer, the notebooks, the black car.

export { YOU, MOM, ELLIE, MO, faceCU, bigWord, wordF, span, Soft, handAt, DarkBg, Icon, Car, streetHip, STREETM };
/** The man in the grey suit (no hat indoors) and his partner in the car. */
export const SUIT: Look = { ...(YOU as Look), jacket: '#5A5F6B', jacketShade: '#474B55', accent: '#7A1F2A', limb: '#3B3646', shoe: '#14151A', hair: '#17141A', extra: 'suit', hat: undefined } as Look;
export const TEACHER: Look = { ...(MOM as Look), jacket: '#4E6A5A', jacketShade: '#3E5648', accent: '#E9DCC0' } as Look;

export type SetFC = React.FC<{ t: number; id?: string }>;
export const BED_MORNING: SetFC = ({ t, id }) => <Bedroom t={t} id={id} clock="07:00" />;
export const BED_NIGHT: SetFC = ({ t, id }) => <Bedroom t={t} id={id} clock="03:12" />;
export const KIT: SetFC = ({ t, id }) => <Kitchen t={t} id={id} />;
export const STUDY_SET: SetFC = ({ t, id }) => <Study t={t} id={id} />;
export const LIVING: SetFC = ({ t, id }) => <LivingRoom t={t} id={id} power={1} />;
export const DAY: SetFC = ({ t, id }) => <StreetModern t={t} id={id} mode="day" power={0} />;
export const SCH: SetFC = ({ t, id }) => <Schematic t={t} id={id ?? 'iqsch'} />;
export const CLASS = (board?: React.ReactNode): SetFC => ({ t, id }) => <Classroom t={t} id={id} board={board} />;

/** A word timing helper bound to one chapter's words. */
export const cues = (W: { w: string; s: number; e: number }[]) => {
  const at = (a: string, n = 1) => wordF(W as any, a, n);
  const rel = (cue: string, w: string, n = 1, cn = 1) => at(w, n) - at(cue, cn);
  return { at, rel };
};

// ---------------------------------------------------------------- the IQ readout
/** A HUD pill, top left: IQ and its number. `heat` (0..1) turns it from orange to red and makes it throb. */
export const IqHud: React.FC<{ t: number; iq: number; from?: number; at?: number; heat?: number; x?: number; y?: number }> = ({ t, iq, from, at = 6, heat = 0, x = 120, y = 92 }) => {
  const k = from !== undefined ? easeOut(clamp((t - at) / 18)) : 1;
  const v = from !== undefined ? Math.round(from + (iq - from) * k) : iq;
  const pop = from !== undefined && t >= at + 18 && t < at + 28 ? 1 + 0.12 * Math.sin(((t - at - 18) / 10) * Math.PI) : 1;
  const col = heat > 0.5 ? '#FF4A3A' : UI.live;
  const throb = heat > 0 ? 1 + 0.03 * heat * Math.sin(t / 3) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${pop * throb})`} opacity={clamp(t / 4)}>
      <rect x={0} y={-48} width={330} height={96} rx={48} fill={UI.pill} opacity={0.82} stroke={col} strokeWidth={4} />
      <text x={42} y={14} fontFamily={FONT.ui} fontSize={34} letterSpacing={6} fill="#F6EFE3" opacity={0.8}>IQ</text>
      <text x={300} y={22} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={62} fill={col}>{v.toLocaleString('en-US')}</text>
    </g>
  );
};

/** The big IQ number on its own, popping on (or counting from `from`), over a set or dark. */
export const iqCard = (o: { kicker: string; iq: number; from?: number; Bg?: SetFC; color?: string; sub?: string }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const pop = backOut(clamp((t - 3) / 9));
    const k = o.from !== undefined ? easeOut(clamp((t - 6) / 22)) : 1;
    const v = o.from !== undefined ? Math.round(o.from + (o.iq - o.from) * k) : o.iq;
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.5}>
            <o.Bg t={t + 500} id="iqc" />
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill="#0C0A16" />
        )}
        <text x={960} y={300} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>{o.kicker}</text>
        <g transform={`translate(960 640) scale(${pop})`}>
          <text x={-20} y={-215} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} letterSpacing={14} fill={UI.live}>IQ</text>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={250} fill={o.color ?? '#FFD23A'} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">{v.toLocaleString('en-US')}</text>
        </g>
        {o.sub ? <text x={960} y={820} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={6} fill="#F6EFE3" opacity={clamp((t - 14) / 6)}>{o.sub}</text> : null}
      </g>
    );
  };
  return Shot;
};

// ---------------------------------------------------------------- puzzle cube
const CUBE_COLS = ['#F4F1EA', '#E8322E', '#2E7DE0', '#F6C22E', '#2FB564', '#F27A22'];
/**
 * A 3x3 puzzle cube in three-quarter view (top, left, right faces). `solved` 0..1 turns the scrambled stickers into
 * solid faces one by one; `twist` rotates the top layer a little (a turn in progress).
 */
export const PuzzleCube: React.FC<{ x: number; y: number; s?: number; solved?: number; twist?: number; rot?: number; seed?: number }> = ({ x, y, s = 1, solved = 0, twist = 0, rot = 0, seed = 4 }) => {
  const a = 90; // edge length of the cube /3 per sticker
  const iso = (u: number, v: number, face: 'top' | 'left' | 'right') => {
    // u, v in 0..3 on the face; returns screen point
    const cx = Math.cos(Math.PI / 6) * a, cy = Math.sin(Math.PI / 6) * a;
    if (face === 'top') return { x: (u - v) * cx, y: -3 * a + (u + v) * cy - 0 };
    if (face === 'left') return { x: -3 * cx + u * cx, y: -3 * a + 3 * cy + u * cy + v * a - 0 };
    return { x: u * cx, y: -3 * a + 6 * cy - u * cy + v * a - 0 };
  };
  const faces: ('top' | 'left' | 'right')[] = ['top', 'left', 'right'];
  const base = [3, 1, 2];
  const stickers: React.ReactNode[] = [];
  faces.forEach((fc, fi) => {
    for (let u = 0; u < 3; u++)
      for (let v = 0; v < 3; v++) {
        const i = fi * 9 + u * 3 + v;
        const done = solved >= (rnd(seed + 7, i) * 0.85 + 0.1);
        const col = done ? CUBE_COLS[base[fi]] : CUBE_COLS[Math.floor(rnd(seed, i) * 6)];
        const p = [iso(u, v, fc), iso(u + 1, v, fc), iso(u + 1, v + 1, fc), iso(u, v + 1, fc)];
        const c = { x: (p[0].x + p[2].x) / 2, y: (p[0].y + p[2].y) / 2 };
        const sh = p.map((q) => ({ x: c.x + (q.x - c.x) * 0.84, y: c.y + (q.y - c.y) * 0.84 }));
        const lift = fc === 'top' ? 0 : fc === 'left' && v === 0 ? 0 : 0;
        stickers.push(<polygon key={i} points={sh.map((q) => `${q.x},${q.y + lift}`).join(' ')} fill={col} stroke="#100E16" strokeWidth={3} opacity={fc === 'top' ? 1 : fc === 'left' ? 0.86 : 0.74} />);
      }
  });
  const out = [iso(0, 0, 'top'), iso(3, 0, 'top'), iso(3, 3, 'right'), iso(3, 3, 'right'), iso(0, 3, 'right'), iso(0, 3, 'left'), iso(0, 0, 'left')];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={0} cy={18} rx={190} ry={30} fill="#000" opacity={0.3} />
      <g transform={`translate(0 0)`}>
        <polygon points={`${iso(0, 0, 'top').x},${iso(0, 0, 'top').y} ${iso(3, 0, 'top').x},${iso(3, 0, 'top').y} ${iso(3, 3, 'top').x},${iso(3, 3, 'top').y} ${iso(3, 3, 'right').x},${iso(3, 3, 'right').y} ${iso(0, 3, 'right').x},${iso(0, 3, 'right').y} ${iso(0, 3, 'left').x},${iso(0, 3, 'left').y}`} fill="#15131B" stroke="#100E16" strokeWidth={10} strokeLinejoin="round" />
        <g transform={`rotate(${twist * 30} 0 ${-3 * a + 3 * Math.sin(Math.PI / 6) * a})`}>{stickers.slice(0, 9)}</g>
        {stickers.slice(9)}
      </g>
      {out.length ? null : null}
    </g>
  );
};

// ---------------------------------------------------------------- thermometer
/** A digital fever thermometer, its reading in degrees C; red past 38. */
export const Thermo: React.FC<{ x: number; y: number; s?: number; rot?: number; temp: number }> = ({ x, y, s = 1, rot = 0, temp }) => {
  const hot = temp >= 38;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M -260 -40 L 160 -40 Q 220 -40 260 0 Q 220 40 160 40 L -260 40 Q -290 40 -290 0 Q -290 -40 -260 -40 Z" fill="#F4F1EA" stroke="#100E16" strokeWidth={8} />
      <rect x={260} y={-8} width={90} height={16} rx={8} fill="#C9C4BA" stroke="#100E16" strokeWidth={5} />
      <rect x={-230} y={-26} width={250} height={52} rx={8} fill={hot ? '#3A1414' : '#1E2A22'} stroke="#100E16" strokeWidth={5} />
      <text x={-105} y={16} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill={hot ? '#FF5A4A' : '#7AF0A0'}>{temp.toFixed(1)}°C</text>
      <circle cx={80} cy={0} r={16} fill={hot ? '#E8322E' : '#3A8AE0'} stroke="#100E16" strokeWidth={5} />
    </g>
  );
};

// ---------------------------------------------------------------- notebooks
/** A closed notebook (cover colour, a label stripe), seen from above at an angle. */
export const Notebook: React.FC<{ x: number; y: number; w?: number; rot?: number; color?: string; i?: number }> = ({ x, y, w = 240, rot = 0, color, i = 0 }) => {
  const h = w * 1.3;
  const c = color ?? ['#3E5A8A', '#8A3E3E', '#3E7A5A', '#7A5A2E', '#5A3E7A'][i % 5];
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + 8} y={-h / 2 + 10} width={w} height={h} rx={10} fill="#000" opacity={0.3} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10} fill={c} stroke="#100E16" strokeWidth={6} />
      <rect x={-w / 2} y={-h / 2} width={w * 0.1} height={h} fill="#000" opacity={0.25} />
      <rect x={-w * 0.25} y={-h * 0.28} width={w * 0.6} height={h * 0.16} rx={6} fill="#F4EEE0" />
      <path d={`M ${-w * 0.18} ${-h * 0.2} L ${w * 0.28} ${-h * 0.2}`} stroke="#3A3446" strokeWidth={4} />
    </g>
  );
};
/** A notebook lying open, both pages dense with tiny handwriting and diagrams; `fill` 0..1 is how far written. */
export const OpenNotebook: React.FC<{ x: number; y: number; w?: number; rot?: number; fill?: number; seed?: number; readable?: string }> = ({ x, y, w = 700, rot = 0, fill = 1, seed = 2, readable }) => {
  const h = w * 0.66;
  const lines: React.ReactNode[] = [];
  const n = 14;
  for (let side = 0; side < 2; side++)
    for (let i = 0; i < n; i++) {
      const k = side * n + i;
      if (k / (2 * n) > fill) continue;
      const x0 = side === 0 ? -w / 2 + 40 : 30;
      const ly = -h / 2 + 50 + i * ((h - 90) / n);
      const len = (w / 2 - 80) * (0.6 + rnd(seed, k) * 0.4);
      if (rnd(seed + 3, k) < 0.12 && i < n - 3) {
        // a little diagram
        lines.push(<g key={k} stroke="#2A2A5A" strokeWidth={3} fill="none"><circle cx={x0 + 50} cy={ly + 14} r={22} /><path d={`M ${x0 + 90} ${ly + 30} Q ${x0 + 150} ${ly - 20} ${x0 + 220} ${ly + 20} M ${x0 + 30} ${ly + 14} L ${x0 + 70} ${ly + 14}`} /></g>);
        continue;
      }
      let d = `M ${x0} ${ly}`;
      for (let j = 0; j < len; j += 9) d += ` L ${x0 + j} ${ly + Math.sin(j * 0.9 + k) * 3 + (rnd(seed, k * 100 + j) - 0.5) * 3}`;
      lines.push(<path key={k} d={d} stroke="#2A2A5A" strokeWidth={2.4} fill="none" opacity={0.85} />);
    }
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <rect x={-w / 2 + 10} y={-h / 2 + 14} width={w} height={h} rx={10} fill="#000" opacity={0.3} />
      <rect x={-w / 2 - 10} y={-h / 2 - 8} width={w + 20} height={h + 16} rx={12} fill="#3E5A8A" stroke="#100E16" strokeWidth={6} />
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={6} fill="#F4EEE0" stroke="#100E16" strokeWidth={4} />
      {Array.from({ length: 15 }).map((_, i) => (
        <path key={i} d={`M ${-w / 2 + 10} ${-h / 2 + 40 + i * ((h - 60) / 14)} L ${w / 2 - 10} ${-h / 2 + 40 + i * ((h - 60) / 14)}`} stroke="#9AB4D6" strokeWidth={1.5} opacity={0.6} />
      ))}
      <path d={`M 0 ${-h / 2} L 0 ${h / 2}`} stroke="#C9BFA8" strokeWidth={6} />
      {lines}
      {readable ? <text x={w / 4} y={h / 2 - 40} textAnchor="middle" fontFamily={FONT.hand} fontSize={32} fill="#1A1A3A">{readable}</text> : null}
    </g>
  );
};

// ---------------------------------------------------------------- chess
/** A chessboard from above in perspective-free top view, a handful of pieces as discs; `win` lights the king red. */
export const ChessBoard: React.FC<{ x: number; y: number; s?: number; t: number; move?: number; win?: number }> = ({ x, y, s = 1, t, move = 0, win = 0 }) => {
  const c = 60;
  const pcs: [number, number, 'w' | 'b', string][] = [[4, 7, 'w', 'K'], [3, 7, 'w', 'Q'], [5, 6, 'w', 'P'], [2, 5, 'w', 'N'], [6, 7, 'w', 'R'], [4, 0, 'b', 'K'], [3, 1, 'b', 'P'], [5, 1, 'b', 'P'], [1, 2, 'b', 'B'], [7, 0, 'b', 'R']];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-4 * c - 16} y={-4 * c - 16} width={8 * c + 32} height={8 * c + 32} rx={10} fill="#5A3E2E" stroke="#100E16" strokeWidth={6} />
      {Array.from({ length: 64 }).map((_, i) => {
        const u = i % 8, v = Math.floor(i / 8);
        return <rect key={i} x={-4 * c + u * c} y={-4 * c + v * c} width={c} height={c} fill={(u + v) % 2 ? '#7A5A3E' : '#E9D8B8'} />;
      })}
      {pcs.map(([u, v, side, k], i) => {
        const mv = i === 1 ? move : 0;
        const px = -4 * c + (u + 0.5) * c + mv * c * 1;
        const py = -4 * c + (v + 0.5) * c - mv * c * 5;
        const red = side === 'b' && k === 'K' && win > 0;
        return (
          <g key={i}>
            <circle cx={px} cy={py} r={c * 0.36} fill={red ? '#E8322E' : side === 'w' ? '#F6F1E6' : '#24202C'} stroke="#100E16" strokeWidth={4} />
            <text x={px} y={py + 10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill={side === 'w' ? '#24202C' : '#F6F1E6'}>{k}</text>
          </g>
        );
      })}
      {win > 0 ? <Glow x={-4 * c + 4.5 * c} y={-4 * c + 0.5 * c} r={120} kind="red" o={0.8 * win} /> : null}
      {t < 0 ? null : null}
    </g>
  );
};

// ---------------------------------------------------------------- doubling chart
/** Bars per day on the schematic, each double the last; the bars past the frame's top go off the chart. */
export const DoublingBars: React.FC<{ t: number; days: number; at?: number; step?: number; y0?: number; label?: (d: number) => string; hot?: number }> = ({ t, days, at = 4, step = 7, y0 = 900, label, hot = 99 }) => {
  const w = Math.min(150, 1500 / days);
  return (
    <g>
      {Array.from({ length: days }).map((_, i) => {
        const k = easeOut(clamp((t - at - i * step) / 10));
        const h = Math.min(640, 70 * Math.pow(2, i)) * k;
        const x = 960 + (i - (days - 1) / 2) * (w + 20);
        const red = i + 1 >= hot;
        return (
          <g key={i} opacity={k > 0 ? 1 : 0}>
            <rect x={x - w / 2} y={y0 - h} width={w} height={h} rx={8} fill={red ? '#E8322E' : UI.live} stroke="#100E16" strokeWidth={4} />
            <text x={x} y={y0 + 50} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#7E8DA6">DAY {i + 1}</text>
            {label ? <text x={x} y={y0 - h - 18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={w > 120 ? 40 : 30} fill="#F6EFE3">{label(i + 1)}</text> : null}
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- bus
/** Inside a bus: seats in rows, a long window with the town sliding past. */
export const Bus: SetFC = ({ t }) => {
  const off = (t * 9) % 600;
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#2E2A3A" />
      <rect x={-200} y={180} width={2400} height={420} fill="#8EC5E8" />
      <g>
        {Array.from({ length: 10 }).map((_, i) => {
          const x = -400 + i * 300 - off;
          const h = 160 + rnd(5, i) * 160;
          return (
            <g key={i}>
              <rect x={x} y={600 - h} width={200} height={h} fill={['#8A6A7A', '#6A7A8A', '#7A8A6A', '#9A7A5A'][i % 4]} stroke="#100E16" strokeWidth={4} />
              {[0, 1].map((r) => <rect key={r} x={x + 40} y={600 - h + 30 + r * 60} width={40} height={36} fill="#F4EEE0" opacity={0.7} />)}
              <circle cx={x + 260} cy={540} r={50} fill="#4E8A4A" stroke="#100E16" strokeWidth={4} />
            </g>
          );
        })}
      </g>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} x={-200 + i * 380} y={170} width={26} height={440} fill="#1E1A28" />)}
      <rect x={-200} y={600} width={2400} height={30} fill="#1E1A28" />
      <rect x={-200} y={160} width={2400} height={24} fill="#1E1A28" />
      <rect x={-400} y={630} width={2800} height={900} fill="#3A3448" />
      <rect x={-400} y={40} width={2800} height={60} fill="#C9C4BA" opacity={0.25} />
      {[200, 760, 1320, 1880].map((x) => (
        <g key={x}>
          <rect x={x - 150} y={560} width={300} height={260} rx={30} fill="#3E6A9A" stroke="#100E16" strokeWidth={6} />
          <rect x={x - 150} y={760} width={300} height={90} rx={20} fill="#2E5480" stroke="#100E16" strokeWidth={6} />
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- frozen peas, bathroom floor
export const Peas: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -110 -70 Q 0 -96 110 -70 Q 130 0 110 70 Q 0 92 -110 70 Q -130 0 -110 -70 Z" fill="#3E9A4A" stroke="#100E16" strokeWidth={7} />
    <circle cx={-30} cy={-6} r={34} fill="#7AD06A" stroke="#100E16" strokeWidth={4} />
    <circle cx={22} cy={10} r={30} fill="#7AD06A" stroke="#100E16" strokeWidth={4} />
    <text x={0} y={-40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={28} fill="#F6EFE3">PEAS</text>
    <path d="M -80 50 L 80 50" stroke="#CFF0FF" strokeWidth={5} opacity={0.7} />
  </g>
);
export const TileFloor: SetFC = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#9AB0B8" />
    {Array.from({ length: 30 }).map((_, i) => <path key={`v${i}`} d={`M ${-400 + i * 120} -400 L ${-400 + i * 120} 1500`} stroke="#7A9098" strokeWidth={5} />)}
    {Array.from({ length: 18 }).map((_, i) => <path key={`h${i}`} d={`M -400 ${-400 + i * 120} L 2400 ${-400 + i * 120}`} stroke="#7A9098" strokeWidth={5} />)}
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0A20" opacity={0.25 + 0.02 * Math.sin(t / 30)} />
  </g>
);

/** Someone lying on their back seen from above (rotated -90 so the head is screen-left). */
export const lying = (x: number, y: number, s: number, o: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y, scale: s, spin: -90, yaw: 0, legL: { a: 8, b: 0 }, legR: { a: -8, b: 0 }, armL: { a: -30, b: 20 }, armR: { a: 30, b: -20 }, ...o,
});

// ---------------------------------------------------------------- a laptop seen from the front (screen toward camera)
export const LaptopFront: React.FC<{ x: number; y: number; w?: number; t: number; screen?: React.ReactNode; open?: number }> = ({ x, y, w = 520, t, screen, open = 1 }) => {
  const h = w * 0.62 * open;
  return (
    <g transform={`translate(${x} ${y})`}>
      <Glow x={0} y={-h / 2} r={w * 0.8} kind="cool" o={0.4 * open} />
      <rect x={-w / 2} y={-h} width={w} height={h} rx={14} fill="#2A2834" stroke="#100E16" strokeWidth={8} />
      {open > 0.3 ? (
        <g>
          <rect x={-w / 2 + 22} y={-h + 20} width={w - 44} height={h - 40} rx={4} fill="#EAF2FA" />
          <g transform={`translate(${-w / 2 + 22} ${-h + 20})`}>{screen}</g>
        </g>
      ) : null}
      <path d={`M ${-w / 2 - 50} 0 L ${w / 2 + 50} 0 L ${w / 2 + 20} 28 L ${-w / 2 - 20} 28 Z`} fill="#3A3846" stroke="#100E16" strokeWidth={7} strokeLinejoin="round" />
      {t < 0 ? null : null}
    </g>
  );
};
/** Lines of a document on a screen (a proof): `n` lines of grey bars and a few symbols, `w` wide. */
export const DocLines: React.FC<{ w: number; n: number; title?: string; seed?: number; shown?: number }> = ({ w, n, title, seed = 1, shown = 1 }) => (
  <g>
    {title ? <text x={24} y={44} fontFamily={FONT.ui} fontSize={26} fill="#1A2A44">{title}</text> : null}
    {Array.from({ length: Math.ceil(n * shown) }).map((_, i) => (
      <g key={i}>
        <rect x={24} y={66 + i * 26} width={(w - 48) * (0.5 + rnd(seed, i) * 0.5)} height={10} rx={5} fill="#8A9AB0" />
        {rnd(seed + 2, i) < 0.3 ? <text x={(w - 48) * (0.5 + rnd(seed, i) * 0.5) + 34} y={78 + i * 26} fontFamily={FONT.ui} fontSize={20} fill="#3A4A7A">∑ ∂ ∞</text> : null}
      </g>
    ))}
  </g>
);

/** Chalk on the classroom board: a long equation that the teacher writes; `solved` adds the answer and a box. */
export const BoardMath: React.FC<{ t: number; write?: number; answer?: number }> = ({ t, write = 1, answer = 0 }) => {
  const lines = ['∫ x² e^(-x) dx  from 0 to ∞', '+  Σ 1/2ⁿ  (n = 1 … ∞)', '=  ?'];
  return (
    <g fontFamily={FONT.hand} fill="#F4F1EA">
      {lines.map((l, i) => (
        <text key={i} x={460} y={270 + i * 80} fontSize={50} opacity={clamp(write * 3 - i)}>{l}</text>
      ))}
      {answer > 0 ? (
        <g opacity={answer}>
          <text x={700} y={430} fontSize={64} fill="#FFE27A">3</text>
          <rect x={680} y={375} width={80} height={76} fill="none" stroke="#FFE27A" strokeWidth={5} />
        </g>
      ) : null}
      {t < 0 ? null : null}
    </g>
  );
};

/** A plain shot builder: one character placed on a set by hand, with a pose that changes over keys, a camera drift. */
export const scene = (o: {
  Set: SetFC; setT?: number; cam: [number, number, number][]; // [t-fraction 0..1, x, y, z] flattened as [x,y,z] at 0 and 1
  draw: (t: number, len: number, f: number) => React.ReactNode; front?: (t: number, len: number) => React.ReactNode;
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const L = Math.max(1, len);
    const [a, b] = [o.cam[0], o.cam[o.cam.length - 1]];
    return (
      <g transform={camT(kf(t, [[0, a[0]], [L, b[0]]]), kf(t, [[0, a[1]], [L, b[1]]]), kf(t, [[0, a[2]], [L, b[2]]]))}>
        <o.Set t={t + (o.setT ?? 80)} id="sc" />
        {o.draw(t, L, f)}
        {o.front?.(t, L)}
      </g>
    );
  };
  return Shot;
};

/** A pose for one character, with breathing, a blink and a face from keys; pass the rest. */
export const live = (t: number, p: Partial<Pose>, faces: [number, Expr][] = [[0, 'neutral']], seed = 1): Pose => {
  const face = faceAt(t, faces);
  const br = Math.sin((t + seed * 17) / 22);
  return { ...basePose, tilt: br * 1.2, headTilt: br * 1.5, ...p, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, seed)) } as Pose;
};

export const K = { BEDROOM, KITCHEN, CLS, STUDY, stand, LEG_LEN, Hero };

/** Asleep sitting back against the pillows, head lolled, eyes shut (lying flat reads badly on this rig). */
export const asleep = (b: { x: number; y: number; scale: number }, t = 0): Partial<Pose> => ({
  ...b, y: b.y + 12, yaw: 0.25, tilt: -12, headTilt: 22 + Math.sin(t / 30) * 2, expr: 'tired', blink: 1, armL: { a: 20, b: 20 }, armR: { a: 20, b: 20 },
});
