import React from 'react';
import {
  Look, LOOKS, Pose, ShotProps, Word, basePose, camT, clamp, kf, backOut, easeOut, easeInOut, faceAt, idleBlink, talkAt, Expr, FONT, Glow, rnd,
  Schematic, SCH, SchLabel, DrawOn, UI, LEG_LEN, Bedroom, BEDROOM, BedDuvet, stand, Kitchen, KITCHEN, KitchenIsland, Classroom, CLS, SchoolDesk,
  Rooftop, makeRoom, RoomShell, BackWindow, Pendant, WallLight, Box, FloorShadow, LightVeil, joints, toWorld, Smartphone, Mug, LEG_LEN as LL,
} from '../../engine';
import {
  YOU, MO, MOM, Soft, span, wordF, faceCU, bigWord, handAt, Body, Dog, shk, clockCard, setShot, phoneShot, PhoneFrame, Messages, CallScreen,
  ShopStreet, standAt, sitPose, GROUND, PopWord, Big, hipAt, runPose, shopX, Park,
} from '../gta-24-hours/common';

// Shared by every chapter of "What if you never slept again?": the cast, the AWAKE counter (top right), the sets
// (bedroom at night, kitchen, classroom, shop street, rooftop at sunrise, the sleep clinic, the schematic) and the
// props (the talking fridge, the brain and its wash, the EEG, the wires, the photo, the rats, leashes, a teddy).

export { YOU, MO, MOM, Soft, span, wordF, faceCU, bigWord, handAt, Body, Dog, shk, clockCard, setShot, phoneShot, PhoneFrame, Messages, CallScreen };
export { ShopStreet, standAt, sitPose, GROUND, PopWord, Big, hipAt, runPose, shopX, Park };
export { Bedroom, BEDROOM, BedDuvet, stand, Kitchen, KITCHEN, KitchenIsland, Classroom, CLS, SchoolDesk, Rooftop, Schematic, SCH, SchLabel, DrawOn, Smartphone, Mug };
export { basePose, camT, clamp, kf, backOut, easeOut, easeInOut, faceAt, idleBlink, talkAt, FONT, Glow, rnd, UI, LEG_LEN, joints, toWorld };
export type { Pose, Expr, Word, ShotProps, Look };

export const ELLIE: Look = LOOKS.ellie;
export const SUIT: Look = { ...LOOKS.suit26, hat: undefined };
export const TECH: Look = { ...LOOKS.doctor, jacket: '#E9E4DA', jacketShade: '#C9C2B4', accent: '#4A9AC8', limb: '#E9E4DA', hair: '#17131C', extra: 'bob' };
export const DOC: Look = { ...LOOKS.doctor, jacket: '#F2EEE6', jacketShade: '#D2CCC0', accent: '#3A6A9A', limb: '#F2EEE6' };
export const TEACHER: Look = { ...LOOKS.worker, jacket: '#6A4A7A', jacketShade: '#563C64', accent: '#E9C46A', hat: undefined, hair: '#9A948A' };
export const YOU_PJ: Look = { ...YOU, jacket: '#4A6AA8', jacketShade: '#3A5488', extra: undefined, limb: '#4A6AA8' };
export const YOU_GOWN: Look = { ...YOU, jacket: '#9AC0D0', jacketShade: '#7AA0B0', extra: undefined, limb: '#3B3646', accent: '#F6EFE3' };
export const ELLIE_PJ: Look = { ...ELLIE, jacket: '#E89AAE', jacketShade: '#C87E92', limb: '#E89AAE' };

export type SetFC = React.FC<{ t: number; id?: string }>;

/** The head centre of a posed character, in world units (for wires, sweat, zzz, thought marks). */
export const headAt = (pose: Pose) => toWorld(pose, joints(pose).head);

// ---------------------------------------------------------------- the AWAKE counter
/** Top right: how long you've been awake. keys: [frame, label, red?]. The label pops when it changes. */
export const awakeHud = (keys: [number, string, number?][]): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
    let k = 0;
    keys.forEach((kk, i) => {
      if (f >= kk[0]) k = i;
    });
    const [f0, label, red = 0] = keys[k];
    const pop = k > 0 ? 1 + 0.25 * clamp(1 - (f - f0) / 10) : 1;
    const eye = 0.5 + 0.5 * Math.sin(f / 9);
    return (
      <g transform={`translate(1640 92) scale(${pop})`}>
        <rect x={-210} y={-46} width={420} height={92} rx={46} fill={UI.pill} opacity={0.88} stroke={red ? '#FF5A4A' : 'none'} strokeWidth={3} />
        {/* a wide-open eye */}
        <g transform="translate(-150 0)">
          <path d="M -34 0 Q 0 -30 34 0 Q 0 30 -34 0 Z" fill="#F6EFE3" />
          <circle r={12 + eye * 2} fill={red ? '#FF5A4A' : '#E9A84A'} />
          <circle r={5} fill="#0B0816" />
        </g>
        <text x={-100} y={-8} fontFamily={FONT.ui} fontSize={22} letterSpacing={4} fill="#C8C0D8">AWAKE</text>
        <text x={-100} y={26} fontFamily={FONT.ui} fontSize={36} fill={red ? '#FF7A6A' : '#F6EFE3'}>{label}</text>
      </g>
    );
  };
  return Hud;
};

// ---------------------------------------------------------------- the sleep clinic
export const CLINIC = makeRoom({ x: 960, y: 500 }, { x0: 500, x1: 1420, y0: 320, y1: 745 }, 3.3);
/** A white clinic room: a window onto the night, a bed with rails, a monitor on a stand, a camera in the corner,
 * a door with a small window, cold strip light. `table` puts a small table and two chairs mid-room for the interview;
 * `day` for daylight in the window. */
export const Clinic: React.FC<{ t: number; id?: string; veil?: number; table?: boolean; day?: number; eeg?: number; lights?: number; bed?: boolean }> = ({
  t, id = 'cl', veil = 0.3, table = false, day = 0, eeg = 1, lights = 1, bed = true,
}) => {
  const R = CLINIC;
  const { P, Q } = R;
  const cam = P(0.97, 0.06, 0.02);
  const blink = Math.floor(t / 20) % 2 === 0;
  const mon = P(0.78, 0.42, 0.18);
  return (
    <g>
      <RoomShell r={R} id={id} floor="tiles" wall="#C9CED2" side="#A9B0B6" floorC="#8E979E" />
      <BackWindow r={R} id={`${id}w`} t={t} x0={620} x1={860} y0={380} y1={570} night={day < 0.5} cols={2} />
      {/* strip light */}
      <rect x={760} y={330} width={400} height={14} rx={7} fill={lights ? '#F6FAFF' : '#5A6068'} />
      {/* door on the right wall */}
      <polygon points={Q([[1, 0.3, 0.3], [1, 0.3, 0.55], [1, 1, 0.55], [1, 1, 0.3]])} fill="#8E9AA4" stroke="#5E6A74" strokeWidth={4} />
      <polygon points={Q([[1, 0.38, 0.36], [1, 0.38, 0.48], [1, 0.52, 0.48], [1, 0.52, 0.36]])} fill="#2A3440" />
      {/* the camera in the corner */}
      <g transform={`translate(${cam.x - 30} ${cam.y + 10})`}>
        <rect x={-36} y={-16} width={64} height={34} rx={6} fill="#2E3440" />
        <circle cx={-40} cy={0} r={12} fill="#141A22" stroke="#4A5562" strokeWidth={3} />
        <circle cx={20} cy={-6} r={5} fill={blink ? '#FF3A2E' : '#5A2020'} />
      </g>
      {/* the bed: back left, headboard on the back wall */}
      {bed ? (
        <g>
          <FloorShadow r={R} u={[0.05, 0.42]} w={[0.02, 0.5]} />
          <Box r={R} u={[0.05, 0.42]} v={[0.82, 0.9]} w={[0.02, 0.5]} front="#B8C0C8" side="#98A0A8" top="#F2F4F6" />
          <Box r={R} u={[0.05, 0.42]} v={[0.66, 0.82]} w={[0.0, 0.02]} front="#8E9AA4" side="#6E7A84" top="#A8B4BE" />
          <polygon points={Q([[0.1, 0.8, 0.03], [0.36, 0.8, 0.03], [0.36, 0.8, 0.13], [0.1, 0.8, 0.13]])} fill="#FFFFFF" stroke="#C8D0D8" strokeWidth={3} />
          <path d={`M ${P(0.42, 0.74, 0.12).x} ${P(0.42, 0.74, 0.12).y} L ${P(0.42, 0.74, 0.44).x} ${P(0.42, 0.74, 0.44).y}`} stroke="#6E7A84" strokeWidth={6} />
        </g>
      ) : null}
      {/* the monitor on its stand */}
      <g>
        <rect x={mon.x - 6} y={mon.y + 60} width={12} height={170} fill="#5E6A74" />
        <rect x={mon.x - 120} y={mon.y - 70} width={240} height={150} rx={10} fill="#1A222C" stroke="#3E4A56" strokeWidth={5} />
        {eeg ? <EEGLines x={mon.x - 108} y={mon.y - 56} w={216} h={124} t={t} awake={1} /> : null}
      </g>
      {table ? (
        <g>
          <FloorShadow r={R} u={[0.35, 0.65]} w={[0.45, 0.62]} />
          <Box r={R} u={[0.35, 0.65]} v={[0.72, 0.76]} w={[0.45, 0.62]} front="#E9E4DA" side="#C9C2B4" top="#F6F2EA" />
          <path d={`M ${P(0.37, 0.76, 0.6).x} ${P(0.37, 0.76, 0.6).y} L ${P(0.37, 1, 0.6).x} ${P(0.37, 1, 0.6).y} M ${P(0.63, 0.76, 0.6).x} ${P(0.63, 0.76, 0.6).y} L ${P(0.63, 1, 0.6).x} ${P(0.63, 1, 0.6).y}`} stroke="#8E979E" strokeWidth={8} />
        </g>
      ) : null}
      <LightVeil id={`${id}v`} lights={[[960, 360, 520], [mon.x, mon.y, 200]]} o={veil} />
      <Glow x={960} y={350} r={420} kind="cool" o={0.35 * lights} />
    </g>
  );
};
/** A point on the clinic table's top (u 0.35..0.65). */
export const clinicTable = (u: number, w = 0.5) => CLINIC.P(u, 0.72, w);

/** EEG traces: wide-awake busy lines (awake 1) or slow big waves (awake 0). */
export const EEGLines: React.FC<{ x: number; y: number; w: number; h: number; t: number; awake?: number; color?: string }> = ({ x, y, w, h, t, awake = 1, color = '#5AE08A' }) => {
  const rows = 4;
  return (
    <g>
      {Array.from({ length: rows }).map((_, r) => {
        const cy = y + (r + 0.5) * (h / rows);
        let d = '';
        for (let i = 0; i <= 60; i++) {
          const px = x + (i / 60) * w;
          const ph = i + t * 1.6 + r * 7;
          const fast = (rnd(r * 13 + 1, Math.floor(ph)) - 0.5) * 2;
          const slow = Math.sin(ph / 6);
          const v = awake * fast * 0.9 + (1 - awake) * slow;
          d += `${i ? 'L' : 'M'} ${px.toFixed(1)} ${(cy + v * (h / rows) * 0.38).toFixed(1)} `;
        }
        return <path key={r} d={d} stroke={color} strokeWidth={2.5} fill="none" opacity={0.9} />;
      })}
    </g>
  );
};

// ---------------------------------------------------------------- props
/** Wires glued to a head: n coloured leads from the scalp falling to the right edge of frame. */
export const Wires: React.FC<{ pose: Pose; n?: number; to?: [number, number]; o?: number }> = ({ pose, n = 7, to = [1500, 700], o = 1 }) => {
  const h = headAt(pose);
  const r = 62 * pose.scale;
  const cols = ['#E8453A', '#4A9AC8', '#E9C46A', '#5AE08A', '#F6EFE3', '#C87ED8', '#F28C6A'];
  return (
    <g opacity={o}>
      {Array.from({ length: n }).map((_, i) => {
        const a = -150 + (i / (n - 1)) * 120;
        const sx = h.x + Math.cos((a * Math.PI) / 180) * r * 0.92;
        const sy = h.y + Math.sin((a * Math.PI) / 180) * r * 0.92;
        const ex = to[0] + i * 14;
        const ey = to[1] + i * 10;
        return (
          <g key={i}>
            <path d={`M ${sx} ${sy} C ${sx + 30} ${sy - 80 * pose.scale}, ${ex - 200} ${ey - 260}, ${ex} ${ey}`} stroke={cols[i % cols.length]} strokeWidth={3.5 * pose.scale} fill="none" />
            <circle cx={sx} cy={sy} r={7 * pose.scale} fill="#F6EFE3" stroke="#14121C" strokeWidth={2} />
          </g>
        );
      })}
    </g>
  );
};

/** A face on the fridge (in the kitchen's own coordinates): two eyes and a mouth that talks when `talk` > 0. */
export const FridgeFace: React.FC<{ t: number; o?: number; talk?: number; look?: number }> = ({ t, o = 1, talk = 0, look = 0 }) => {
  const P = KITCHEN.P;
  const e1 = P(0.84, 0.3, 0.2);
  const e2 = P(0.93, 0.3, 0.2);
  const m = P(0.885, 0.56, 0.2);
  const open = talk > 0 ? 6 + Math.abs(Math.sin(t * 0.9)) * 26 : 4;
  const bl = idleBlink(t, 11);
  return (
    <g opacity={o}>
      {[e1, e2].map((e, i) => (
        <g key={i}>
          <ellipse cx={e.x} cy={e.y} rx={22} ry={26 * (1 - bl * 0.9)} fill="#F6EFE3" stroke="#14121C" strokeWidth={4} />
          <circle cx={e.x + look * 8} cy={e.y + 3} r={10 * (1 - bl)} fill="#14121C" />
        </g>
      ))}
      <ellipse cx={m.x} cy={m.y} rx={42} ry={open} fill="#3A1A22" stroke="#14121C" strokeWidth={4} />
      <path d={`M ${m.x - 52} ${m.y - 8} Q ${m.x} ${m.y + open + 18} ${m.x + 52} ${m.y - 8}`} stroke="#14121C" strokeWidth={4} fill="none" opacity={0.7} />
    </g>
  );
};

/** A speech bubble. */
export const Bubble: React.FC<{ x: number; y: number; text: string; t: number; at?: number; w?: number; size?: number; tail?: 'l' | 'r' }> = ({ x, y, text, t, at = 0, w, size = 44, tail = 'l' }) => {
  const k = backOut(clamp((t - at) / 8));
  if (k <= 0) return null;
  const lines = text.split('\n');
  const W = w ?? Math.max(...lines.map((l) => l.length)) * size * 0.56 + 60;
  const H = lines.length * size * 1.2 + 40;
  return (
    <g transform={`translate(${x} ${y}) scale(${k})`}>
      <path d={tail === 'l' ? `M ${-W / 2 + 40} ${H / 2 - 4} L ${-W / 2 + 10} ${H / 2 + 40} L ${-W / 2 + 90} ${H / 2 - 4} Z` : `M ${W / 2 - 40} ${H / 2 - 4} L ${W / 2 - 10} ${H / 2 + 40} L ${W / 2 - 90} ${H / 2 - 4} Z`} fill="#F6EFE3" stroke="#14121C" strokeWidth={5} />
      <rect x={-W / 2} y={-H / 2} width={W} height={H} rx={30} fill="#F6EFE3" stroke="#14121C" strokeWidth={5} />
      <rect x={-W / 2 + 4} y={H / 2 - 12} width={110} height={12} fill="#F6EFE3" />
      {lines.map((l, i) => (
        <text key={i} x={0} y={-H / 2 + 20 + (i + 0.8) * size * 1.2} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={size} fill="#14121C">{l}</text>
      ))}
    </g>
  );
};

/** Little floating z's, crossed out (you can't sleep). */
export const NoZ: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 1, 2].map((i) => {
      const k = ((t / 40 + i / 3) % 1);
      return (
        <text key={i} x={i * 34 + Math.sin(k * 6) * 8} y={-k * 160} fontFamily={FONT.title} fontWeight={800} fontSize={44 + i * 12} fill="#C8D8F0" opacity={Math.sin(k * Math.PI) * 0.9}>z</text>
      );
    })}
    <path d="M -20 -150 L 130 10" stroke="#FF5A4A" strokeWidth={10} strokeLinecap="round" opacity={clamp(t / 20)} />
  </g>
);

/** Juggling balls around a centre. */
export const Juggle: React.FC<{ x: number; y: number; t: number; s?: number; drop?: number }> = ({ x, y, t, s = 1, drop = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {['#E8453A', '#4A9AC8', '#E9C46A'].map((c, i) => {
      const ph = t / 9 + (i * 2 * Math.PI) / 3;
      const bx = Math.cos(ph) * 90;
      const by = -Math.abs(Math.sin(ph)) * 200 + (i === 0 ? drop * 260 : 0);
      return <circle key={i} cx={bx} cy={by} r={22} fill={c} stroke="#14121C" strokeWidth={4} />;
    })}
  </g>
);

/** A guitar held across the body (centre at x, y). */
export const Guitar: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -25 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={40} y={-10} width={220} height={20} fill="#5A3E2E" stroke="#14121C" strokeWidth={4} />
    <rect x={250} y={-16} width={40} height={32} rx={6} fill="#3A2A20" stroke="#14121C" strokeWidth={4} />
    <ellipse cx={-30} cy={0} rx={70} ry={58} fill="#D9894A" stroke="#14121C" strokeWidth={5} />
    <ellipse cx={-90} cy={0} rx={52} ry={48} fill="#D9894A" stroke="#14121C" strokeWidth={5} />
    <ellipse cx={-55} cy={0} rx={70} ry={50} fill="#D9894A" />
    <circle cx={-30} cy={0} r={18} fill="#2A1A14" />
  </g>
);

/** A stack of pancakes with syrup and a pat of butter. */
export const Pancakes: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 5 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={10} rx={110} ry={22} fill="#F6EFE3" stroke="#14121C" strokeWidth={4} />
    {Array.from({ length: n }).map((_, i) => (
      <ellipse key={i} cx={0} cy={-i * 16} rx={80} ry={18} fill={i % 2 ? '#E0A050' : '#D8963F'} stroke="#14121C" strokeWidth={4} />
    ))}
    <path d={`M -60 ${-n * 16 + 12} Q -40 ${-n * 16 + 40} -30 ${-n * 16 + 10} Q 0 ${-n * 16 + 50} 30 ${-n * 16 + 8} Q 50 ${-n * 16 + 36} 64 ${-n * 16 + 10}`} fill="#8A4A1A" opacity={0.85} />
    <rect x={-14} y={-n * 16 - 6} width={28} height={16} rx={3} fill="#F6E27A" stroke="#14121C" strokeWidth={3} />
  </g>
);

/** A glass of orange juice. */
export const Juice: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -26 -90 L 26 -90 L 20 0 L -20 0 Z" fill="#F6EFE3" opacity={0.6} stroke="#14121C" strokeWidth={4} />
    <path d="M -24 -66 L 24 -66 L 20 -2 L -20 -2 Z" fill="#F2A03A" />
  </g>
);

/** A book, open, held or on a desk. */
export const Book: React.FC<{ x: number; y: number; s?: number; c?: string; rot?: number }> = ({ x, y, s = 1, c = '#4A7AA0', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -110 -60 L 0 -46 L 110 -60 L 110 40 L 0 54 L -110 40 Z" fill={c} stroke="#14121C" strokeWidth={4} />
    <path d="M -100 -52 L 0 -40 L 100 -52 L 100 32 L 0 44 L -100 32 Z" fill="#F6EFE3" />
    {Array.from({ length: 5 }).map((_, i) => (
      <g key={i}>
        <path d={`M -88 ${-34 + i * 14} L -14 ${-26 + i * 14}`} stroke="#9A948A" strokeWidth={3} />
        <path d={`M 14 ${-26 + i * 14} L 88 ${-34 + i * 14}`} stroke="#9A948A" strokeWidth={3} />
      </g>
    ))}
    <path d="M 0 -40 L 0 44" stroke="#14121C" strokeWidth={3} />
  </g>
);

/** A teddy bear. */
export const Teddy: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`} stroke="#14121C" strokeWidth={4}>
    <circle cx={-34} cy={-112} r={18} fill="#B07A4A" />
    <circle cx={34} cy={-112} r={18} fill="#B07A4A" />
    <ellipse cx={0} cy={-20} rx={52} ry={60} fill="#B07A4A" />
    <circle cx={0} cy={-88} r={42} fill="#B07A4A" />
    <ellipse cx={0} cy={-76} rx={18} ry={13} fill="#E0B88A" />
    <circle cx={-14} cy={-96} r={5} fill="#14121C" />
    <circle cx={14} cy={-96} r={5} fill="#14121C" />
    <circle cx={0} cy={-80} r={5} fill="#14121C" />
  </g>
);

/** A sticky note with handwriting. */
export const Sticky: React.FC<{ x: number; y: number; text: string; s?: number; rot?: number; c?: string }> = ({ x, y, text, s = 1, rot = -4, c = '#F6E27A' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-90} y={-80} width={180} height={160} fill={c} stroke="#14121C" strokeWidth={3} />
    <rect x={-90} y={-80} width={180} height={26} fill="#000000" opacity={0.06} />
    {text.split('\n').map((l, i) => (
      <text key={i} x={0} y={-10 + i * 46} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={44} fill="#2A2230">{l}</text>
    ))}
  </g>
);

/** A black-and-white photo: a grinning teenager surrounded by scientists in lab coats (silhouettes). */
export const OldPhoto: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = -5 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-200} y={-150} width={400} height={300} fill="#F2EEE6" stroke="#14121C" strokeWidth={4} />
    <rect x={-180} y={-130} width={360} height={220} fill="#9A9690" />
    <rect x={-180} y={30} width={360} height={60} fill="#6E6A66" />
    {[-120, -60, 60, 120].map((px, i) => (
      <g key={i} fill={i % 2 ? '#D8D4CC' : '#C8C4BC'} stroke="#3A3834" strokeWidth={3}>
        <circle cx={px} cy={-60} r={22} fill="#4A4844" />
        <path d={`M ${px - 32} 90 L ${px - 28} -30 Q ${px} -44 ${px + 28} -30 L ${px + 32} 90 Z`} />
      </g>
    ))}
    {/* the boy in the middle, grinning */}
    <circle cx={0} cy={-50} r={28} fill="#3A3834" />
    <path d="M -14 -44 Q 0 -32 14 -44" stroke="#F2EEE6" strokeWidth={4} fill="none" />
    <circle cx={-10} cy={-56} r={4} fill="#F2EEE6" />
    <circle cx={10} cy={-56} r={4} fill="#F2EEE6" />
    <path d="M -36 90 L -32 -16 Q 0 -30 32 -16 L 36 90 Z" fill="#5A5854" stroke="#3A3834" strokeWidth={3} />
    <text x={0} y={128} textAnchor="middle" fontFamily={FONT.hand} fontSize={30} fill="#3A3834">San Diego, 1964</text>
  </g>
);

/** A cartoon rat icon for the schematic. */
export const Rat: React.FC<{ x: number; y: number; s?: number; o?: number; color?: string }> = ({ x, y, s = 1, o = 1, color = SCH.line }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o} fill="none" stroke={color} strokeWidth={5} strokeLinecap="round">
    <path d="M -60 10 Q -60 -40 0 -40 Q 50 -40 60 0 L 80 6 Q 60 20 40 20 L -50 20 Q -60 18 -60 10 Z" />
    <circle cx={30} cy={-38} r={14} />
    <circle cx={58} cy={-4} r={3} fill={color} />
    <path d="M -60 12 Q -110 10 -120 -30" />
  </g>
);

/** A schematic brain in profile with its folds; `draw` is frames since it started drawing on; `wash` (0..1) runs blue fluid through it, `gaps` widens the spaces
 * between cells (the sleep wash), `dirt` scatters orange waste specks that the wash carries away. */
export const Brain: React.FC<{ x: number; y: number; s?: number; t: number; draw?: number; wash?: number; dirt?: number; color?: string }> = ({ x, y, s = 1, t, draw = 99, wash = 0, dirt = 0, color = SCH.line }) => {
  const outline = 'M -230 40 C -260 -60 -200 -170 -80 -190 C 20 -230 160 -200 220 -110 C 270 -40 250 60 190 90 C 160 140 90 150 40 130 C 20 170 -30 180 -60 150 C -140 160 -220 120 -230 40 Z';
  const folds = [
    'M -170 -80 C -120 -120 -60 -60 -10 -110 C 40 -150 90 -100 140 -130',
    'M -200 10 C -150 -30 -100 30 -40 -20 C 10 -60 70 0 130 -40 C 170 -60 200 -20 220 -40',
    'M -170 80 C -120 50 -70 100 -10 60 C 40 30 90 80 160 50',
    'M -90 -170 C -70 -130 -110 -100 -80 -60',
    'M 60 -190 C 40 -150 80 -130 60 -90',
  ];
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <DrawOn d={outline} t={draw} dur={30} color={color} width={6} />
      {folds.map((d, i) => <DrawOn key={i} d={d} t={draw - 14 - i * 4} dur={20} color={color} width={4} />)}
      <path d="M 40 130 C 50 180 40 220 20 260" stroke={color} strokeWidth={6} fill="none" opacity={clamp(draw / 30)} />
      {dirt > 0
        ? Array.from({ length: 40 }).map((_, i) => {
            const px = -200 + rnd(21, i) * 400;
            const py = -170 + rnd(23, i) * 300;
            const gone = clamp(wash * 1.6 - rnd(25, i) * 0.6);
            return <circle key={i} cx={px + gone * 300} cy={py + gone * 120} r={7} fill="#F2A03A" opacity={dirt * (1 - gone)} />;
          })
        : null}
      {wash > 0
        ? Array.from({ length: 34 }).map((_, i) => {
            const k = (t / 60 + rnd(31, i)) % 1;
            const px = -220 + k * 440;
            const py = -150 + rnd(33, i) * 260 + Math.sin(k * 8 + i) * 16;
            return <circle key={i} cx={px} cy={py} r={9} fill="#4AC8F0" opacity={wash * Math.sin(k * Math.PI) * 0.9} />;
          })
        : null}
    </g>
  );
};

/** Brain cells close up: blobs with gaps between them that open by `open` (0..1, the 60%). */
export const Cells: React.FC<{ x: number; y: number; t: number; open: number; flow?: number }> = ({ x, y, t, open, flow = 0 }) => {
  const cells: React.ReactNode[] = [];
  for (let r = 0; r < 4; r++)
    for (let c = 0; c < 6; c++) {
      const g = 1 + 0.6 * open;
      const cx = (c - 2.5) * 130 * g + (r % 2 ? 40 : 0);
      const cy = (r - 1.5) * 120 * g;
      cells.push(<ellipse key={`${r}${c}`} cx={cx} cy={cy} rx={58} ry={50} fill="none" stroke={SCH.line} strokeWidth={5} />);
    }
  return (
    <g transform={`translate(${x} ${y})`}>
      {flow > 0
        ? Array.from({ length: 30 }).map((_, i) => {
            const k = (t / 50 + rnd(41, i)) % 1;
            return <circle key={i} cx={-460 + k * 920} cy={(Math.floor(rnd(43, i) * 4) - 1.5) * 120 * (1 + 0.6 * open) + 60 * (1 + 0.6 * open) - 60} r={10} fill="#4AC8F0" opacity={flow * Math.sin(k * Math.PI)} />;
          })
        : null}
      {cells}
    </g>
  );
};

/** A dog on a lead from a point (the hand) to the dog's collar. */
export const Lead: React.FC<{ from: { x: number; y: number }; to: { x: number; y: number }; c?: string }> = ({ from, to, c = '#E8453A' }) => (
  <path d={`M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${Math.max(from.y, to.y) + 40} ${to.x} ${to.y}`} stroke={c} strokeWidth={4} fill="none" />
);

/** A coat on a hook that reads as a standing figure (the hallucination): `who` 0..1 turns it into a shadow with eyes. */
export const CoatFigure: React.FC<{ x: number; y: number; s?: number; who?: number; t?: number }> = ({ x, y, s = 1, who = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <circle cx={0} cy={-10} r={10} fill="#8E8A80" />
    <path d="M -10 0 Q -70 30 -80 120 L -90 380 L 90 380 L 80 120 Q 70 30 10 0 Z" fill={who > 0.5 ? '#0B0816' : '#5A4A3E'} stroke={who > 0.5 ? '#C87ED8' : '#14121C'} strokeWidth={5} />
    <ellipse cx={0} cy={-40} rx={46} ry={56} fill="#0B0816" stroke="#C87ED8" strokeWidth={4} strokeOpacity={who} opacity={who} />
    {who > 0.6 ? (
      <g opacity={clamp((who - 0.6) / 0.4) * (0.6 + 0.4 * Math.sin(t / 5))}>
        <circle cx={-16} cy={-44} r={6} fill="#F6EFE3" />
        <circle cx={16} cy={-44} r={6} fill="#F6EFE3" />
      </g>
    ) : null}
  </g>
);

/** A wobble filter for hallucination shots: wrap a group in it (filter id `wob<id>`), strength 0..1. */
export const Wobble: React.FC<{ id: string; t: number; amp: number; children: React.ReactNode }> = ({ id, t, amp, children }) => (
  <g>
    <defs>
      <filter id={`wob${id}`} x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency={`${0.004} ${0.012}`} numOctaves={2} seed={Math.floor(t / 3) % 50} result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale={amp * 40} xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </defs>
    <g filter={amp > 0.01 ? `url(#wob${id})` : undefined}>{children}</g>
  </g>
);

// ---------------------------------------------------------------- shot builders
/** A day/hour card: the counter slamming in big over the blurred set. */
export const hourCard = (o: { big: string; kicker?: string; Bg: SetFC; color?: string }) => clockCard({ clock: o.big, kicker: o.kicker, Bg: o.Bg, color: o.color });

/** A schematic shot with a title and anything drawn by `draw(t, len)`. */
export const schShot = (o: { title?: string; sub?: string; draw: (t: number, len: number) => React.ReactNode; real?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [Math.max(1, len), 1.05]]))}>
        <Schematic t={t} id="ns" />
        {o.draw(t, len)}
      </g>
      {o.title ? <SchLabel x={960} y={150} t={t - 2} text={o.title} size={46} color={SCH.dim} /> : null}
      {o.sub ? <SchLabel x={960} y={980} t={t - 30} text={o.sub} size={34} /> : null}
      {o.real !== undefined ? (
        <g opacity={clamp((t - o.real) / 6)} transform={`translate(1650 960) scale(${backOut(clamp((t - o.real) / 9))})`}>
          <rect x={-150} y={-46} width={300} height={70} rx={35} fill={UI.pill} stroke={SCH.live} strokeWidth={3} />
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
        </g>
      ) : null}
    </g>
  );
  return Shot;
};

/** Bedroom at night, with you in bed (eyes open) or sitting up. */
export const BedroomNight: SetFC = ({ t, id }) => <Bedroom t={t} id={id ?? 'bn'} clock="03:00" crossed={0} />;
export const KitchenDay: SetFC = ({ t, id }) => <Kitchen t={t} id={id ?? 'kd'} />;
export const ClassDay: SetFC = ({ t, id }) => <Classroom t={t} id={id ?? 'cd'} />;
export const StreetDay: SetFC = ({ t, id }) => <ShopStreet t={t} id={id ?? 'sd'} />;
export const StreetNight: SetFC = ({ t, id }) => <ShopStreet t={t} id={id ?? 'snn'} mode="night" />;
export const ClinicNight: SetFC = ({ t, id }) => <Clinic t={t} id={id ?? 'cn'} />;
export const RoofDawn: SetFC = ({ t, id }) => <Rooftop t={t} sunY={760} />;

/** In bed: the bed drawn without the duvet, the character sitting/lying at bedSit, then the duvet over the legs. */
export const bedPose = (u = 0.22, extra: Partial<Pose> = {}): Pose => {
  const p = BEDROOM.P(u, 0.74, 0.25);
  const s = BEDROOM.s(0.25) / BEDROOM.s(0.05) * 0.62;
  return { ...basePose, x: p.x, y: p.y - 30 * s, scale: s, yaw: 0.2, legL: { a: 85, b: 0 }, legR: { a: 82, b: 0 }, armL: { a: 20, b: -20 }, armR: { a: 20, b: -20 }, ...extra };
};

/** The time span of a phrase (a run of consecutive words, punctuation ignored), [start, end] in seconds. */
export const phrase = (words: Word[], text: string, nth = 1): [number, number] => {
  const n = (w: string) => w.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '').replace(/^'+|'+$/g, '');
  const want = text.split(/\s+/).map(n);
  let seen = 0;
  for (let i = 0; i + want.length <= words.length; i++) {
    if (want.every((w, k) => n(words[i + k].w) === w) && ++seen === nth) return [words[i].s, words[i + want.length - 1].e + 0.05];
  }
  return [0, 0];
};
/** The frame a phrase starts at. */
export const phraseF = (words: Word[], text: string, nth = 1) => Math.round(phrase(words, text, nth)[0] * 30);
