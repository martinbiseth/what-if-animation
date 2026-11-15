import React from 'react';
import { Look, LOOKS, LEG_LEN, Glow, LightVeil, Stars, Moon, rnd, clamp, lerp, FONT, Foreground } from '../../engine';

// Viking Norway, January AD 900, for "How Vikings Survived -30°C Winters With NO Electricity" (Ancient For A Day,
// episode 1): the longhouse inside (timber wall, turf roof on rafters, the smoke hole, benches with furs, the long
// hearth, the byre with two cows, a loom), the farmyard outside in the snow (the longhouse under a snowed-in turf roof,
// the well, the woodpile, pines, mountains), the frozen lake, and the props and the household. Flat fills, a darker
// side, warm rims from the fire, cold blue outside.

export const INK = '#100E16';
const SKIN = '#26232F', SKIN2 = '#1C1A24';

// ---------------------------------------------------------------- cast
export const norse = (o: Partial<Look>): Look => ({
  skin: SKIN, skinShade: SKIN2, hand: SKIN, jacket: '#6A7A44', jacketShade: '#56643A', accent: '#D8B040', limb: '#4A4038', line: INK,
  shoe: '#5A3A22', face: '#F6EFE3', hair: '#17131C', robe: 'tunic', belt: '#4A2E1A', noPhones: true, ...o,
});
/** You, from the present: the orange hoodie, white trainers. */
export const YOU = LOOKS.you;
/** You, dressed by Gudrun: a brown wool tunic, a grey cloak, a fur hat. */
export const YOU_WOOL: Look = norse({ jacket: '#8A6440', jacketShade: '#70502E', cloak: '#6A6E78', hat: 'fur', hatColor: '#7A5232', limb: '#5A4A3A', shoe: '#6A4A2E' });
/** Ketil: the farmer. A green wool tunic, a big red beard, red hair. */
export const KETIL: Look = norse({ jacket: '#5E6E3A', jacketShade: '#4A582C', hair: '#C2501E', beard: '#C2501E', belt: '#3A2414' });
export const KETIL_OUT: Look = { ...KETIL, cloak: '#4A3A30', hat: 'fur', hatColor: '#6A4428' };
/** Gudrun: runs the house. A long blue wool dress, a linen headscarf, the keys on her belt. */
export const GUDRUN: Look = norse({ jacket: '#3E5A8A', jacketShade: '#2F4870', robe: 'dress', belt: '#C8A040', hat: 'kerchief', hatColor: '#E8DCC0', keys: true, hair: '#E0B060' });
/** Asa: their daughter, nine. A rust-red dress, blond bunches. Draw her at about 0.72. */
export const ASA: Look = norse({ jacket: '#B0503A', jacketShade: '#8E3E2C', robe: 'dress', belt: '#E8C060', extra: 'bunches', hair: '#E8C060', accent: '#3E7A72' });
export const ASA_OUT: Look = { ...ASA, cloak: '#6A4A3A' };

/** Hip y for someone whose feet are on floor y at this scale. */
export const hipAt = (feet: number, s = 1) => feet - LEG_LEN * s;

// ---------------------------------------------------------------- fire
/** A row of flames along a hearth from x0 to x1 at base y; `k` 0..1.2 scales them (0 = embers only). */
export const Flames: React.FC<{ x0: number; x1: number; y: number; t: number; k?: number; seed?: number }> = ({ x0, x1, y, t, k = 1, seed = 1 }) => {
  const n = Math.max(3, Math.round((x1 - x0) / 46));
  return (
    <g>
      {/* embers bed */}
      <path d={`M ${x0} ${y} Q ${(x0 + x1) / 2} ${y - 22} ${x1} ${y} Z`} fill="#3A1A10" />
      {Array.from({ length: n * 2 }).map((_, i) => (
        <circle key={`e${i}`} cx={x0 + rnd(seed, i) * (x1 - x0)} cy={y - 4 - rnd(seed + 3, i) * 10} r={4 + rnd(seed + 5, i) * 5}
          fill="#FF7A2A" opacity={0.35 + 0.5 * Math.abs(Math.sin(t / (6 + rnd(seed, i) * 6) + i))} />
      ))}
      {k > 0.02
        ? Array.from({ length: n }).map((_, i) => {
            const x = x0 + ((i + 0.5) / n) * (x1 - x0);
            const h = (70 + rnd(seed + 9, i) * 70) * k * (0.8 + 0.25 * Math.sin(t / 3.2 + i * 1.7));
            const w = 30 + rnd(seed + 2, i) * 18;
            const lean = Math.sin(t / 7 + i) * 10;
            return (
              <g key={i}>
                <path d={`M ${x - w} ${y} Q ${x - w * 0.6} ${y - h * 0.5} ${x + lean} ${y - h} Q ${x + w * 0.6} ${y - h * 0.5} ${x + w} ${y} Z`} fill="#FF7A1E" />
                <path d={`M ${x - w * 0.55} ${y} Q ${x - w * 0.3} ${y - h * 0.35} ${x + lean * 0.7} ${y - h * 0.68} Q ${x + w * 0.3} ${y - h * 0.35} ${x + w * 0.55} ${y} Z`} fill="#FFC23A" />
                <path d={`M ${x - w * 0.25} ${y} Q ${x} ${y - h * 0.3} ${x + lean * 0.4} ${y - h * 0.38} Q ${x + w * 0.2} ${y - h * 0.2} ${x + w * 0.25} ${y} Z`} fill="#FFF1B0" />
              </g>
            );
          })
        : null}
    </g>
  );
};

/** Rising smoke from (x, y) toward (tx, ty), puffs looping. */
export const Smoke: React.FC<{ x: number; y: number; tx: number; ty: number; t: number; o?: number; n?: number; r?: number }> = ({ x, y, tx, ty, t, o = 0.35, n = 7, r = 40 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const q = ((t * 0.6 + i * (90 / n)) % 90) / 90;
      const px = lerp(x, tx, q) + Math.sin(q * 6 + i) * 30;
      const py = lerp(y, ty, q);
      return <circle key={i} cx={px} cy={py} r={r * (0.6 + q * 1.4)} fill="#B8B0A8" opacity={o * Math.sin(q * Math.PI)} />;
    })}
  </g>
);

// ---------------------------------------------------------------- props
/** A cow side on, facing left (flip to face right). `moo` opens the mouth, `chew` moves the jaw. */
export const Cow: React.FC<{ x: number; y: number; s?: number; t?: number; flip?: boolean; c?: string; chew?: boolean; breath?: number; look?: number }> = ({ x, y, s = 1, t = 0, flip = false, c = '#8A5A3A', chew = false, breath = 0, look = 0 }) => {
  const j = chew ? Math.max(0, Math.sin(t / 3)) * 6 : 0;
  const b = Math.sin(t / 20) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {[-120, -70, 80, 130].map((lx, i) => (
        <g key={i}>
          <rect x={lx - 13} y={-30} width={26} height={110} rx={10} fill={i % 2 ? c : '#6A4428'} stroke={INK} strokeWidth={5} />
          <rect x={lx - 14} y={66} width={28} height={16} rx={4} fill="#2A2018" />
        </g>
      ))}
      <path d="M 180 -110 Q 230 -60 210 10" stroke={INK} strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M 180 -110 Q 230 -60 210 10" stroke={c} strokeWidth={8} fill="none" strokeLinecap="round" />
      <ellipse cx={20} cy={-90 + b * 0.3} rx={190} ry={95 + b} fill={c} stroke={INK} strokeWidth={6} />
      <ellipse cx={60} cy={-120} rx={60} ry={40} fill="#F2EAD8" opacity={0.9} />
      <ellipse cx={-60} cy={-50} rx={40} ry={28} fill="#F2EAD8" opacity={0.9} />
      <ellipse cx={30} cy={-12} rx={36} ry={18} fill="#E8A8A0" stroke={INK} strokeWidth={4} />
      <g transform={`translate(-180 -130) rotate(${Math.sin(t / 30) * 4 + look * 8})`}>
        <path d="M -20 -40 L -40 -70 M 30 -40 L 50 -66" stroke="#E8DCC0" strokeWidth={10} strokeLinecap="round" />
        <ellipse cx={-34} cy={-26} rx={26} ry={12} fill={c} stroke={INK} strokeWidth={4} transform="rotate(-20 -34 -26)" />
        <path d="M -30 -40 Q 0 -60 40 -40 L 30 40 Q 0 70 -30 40 Z" fill={c} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d={`M -34 40 Q 0 ${70 + j} 34 40 Q 30 ${80 + j} 0 ${84 + j} Q -30 ${80 + j} -34 40 Z`} fill="#E8B0A0" stroke={INK} strokeWidth={5} />
        <circle cx={-12} cy={56 + j * 0.4} r={5} fill={INK} />
        <circle cx={12} cy={56 + j * 0.4} r={5} fill={INK} />
        <circle cx={-14} cy={-6} r={9} fill="#F6EFE3" />
        <circle cx={-14 - look * 3} cy={-5} r={5} fill={INK} />
        {breath > 0 ? (
          <g opacity={breath}>
            {[0, 1, 2].map((k) => {
              const q = ((t + k * 12) % 36) / 36;
              return <circle key={k} cx={-10 - q * 90} cy={84 + q * 10} r={14 + q * 30} fill="#E8EEF6" opacity={0.6 * (1 - q)} />;
            })}
          </g>
        ) : null}
      </g>
    </g>
  );
};

/** A wooden bowl, steam optional. */
export const Bowl: React.FC<{ x: number; y: number; s?: number; t?: number; steam?: boolean; fill?: string }> = ({ x, y, s = 1, t = 0, steam = true, fill = '#D8C8A0' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={-30} rx={70} ry={16} fill={fill} stroke={INK} strokeWidth={5} />
    <path d="M -70 -30 Q -64 30 0 34 Q 64 30 70 -30 Q 40 -16 0 -14 Q -40 -16 -70 -30 Z" fill="#8A5A32" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M 30 -10 Q 50 10 40 24" stroke="#6A4428" strokeWidth={5} fill="none" />
    {steam
      ? [0, 1, 2].map((k) => {
          const q = ((t + k * 14) % 42) / 42;
          return <path key={k} d={`M ${-24 + k * 24} ${-40 - q * 90} q 12 -16 0 -32 q -12 -16 0 -32`} stroke="#FFFFFF" strokeWidth={7} fill="none" strokeLinecap="round" opacity={0.5 * Math.sin(q * Math.PI)} />;
        })
      : null}
  </g>
);

/** Stockfish: a flat, grey, rigid dried cod. */
export const Stockfish: React.FC<{ x: number; y: number; s?: number; rot?: number; split?: number }> = ({ x, y, s = 1, rot = 0, split = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -160 0 Q -100 -46 40 -40 L 120 -10 L 170 -50 L 160 0 L 170 50 L 120 10 L 40 40 Q -100 46 -160 0 Z" fill="#B8B0A0" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M -110 -20 Q -20 -30 80 -20 M -110 20 Q -20 30 80 20" stroke="#8A8274" strokeWidth={4} fill="none" />
    <circle cx={-128} cy={-6} r={7} fill={INK} />
    {split > 0 ? <path d={`M -60 ${-30} l 12 22 l -10 14 l 14 22`} stroke={INK} strokeWidth={4} fill="none" opacity={split} /> : null}
  </g>
);

/** A wooden mallet, head at the origin, handle down-right. */
export const Hammer: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-8} y={0} width={16} height={150} rx={6} fill="#8A6440" stroke={INK} strokeWidth={4} />
    <rect x={-50} y={-34} width={100} height={52} rx={10} fill="#6A4428" stroke={INK} strokeWidth={5} />
  </g>
);

/** A wooden bucket with an iron band; `water` 0..1 fill. */
export const Bucket: React.FC<{ x: number; y: number; s?: number; water?: number; ice?: boolean }> = ({ x, y, s = 1, water = 0, ice = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -50 -100 Q 0 -150 50 -100" stroke={INK} strokeWidth={5} fill="none" />
    <path d="M -50 -100 L 50 -100 L 40 0 L -40 0 Z" fill="#8A6440" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -46 -64 L 46 -64 M -42 -24 L 42 -24" stroke="#4A4A50" strokeWidth={7} />
    {water > 0 ? <ellipse cx={0} cy={-100 + (1 - water) * 10} rx={48} ry={10} fill={ice ? '#DDEEFF' : '#6AA8D8'} stroke={INK} strokeWidth={3} /> : null}
  </g>
);

/** An axe, the blade at the origin. */
export const Axe: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-8} y={-10} width={16} height={190} rx={6} fill="#8A6440" stroke={INK} strokeWidth={4} />
    <path d="M -6 -14 L -66 -40 Q -80 0 -66 40 L -6 14 Z" fill="#9AA0A8" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
  </g>
);

/** A split log, end on (circle with rings) or side on. */
export const Log: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-90} y={-24} width={180} height={48} rx={20} fill="#7A5232" stroke={INK} strokeWidth={5} />
    <ellipse cx={90} cy={0} rx={14} ry={24} fill="#D8B888" stroke={INK} strokeWidth={4} />
    <path d="M -60 -8 L 40 -10 M -40 10 L 60 8" stroke="#5A3A22" strokeWidth={3} />
  </g>
);

/** A soapstone oil lamp with a small flame. */
export const OilLamp: React.FC<{ x: number; y: number; s?: number; t?: number; lit?: number }> = ({ x, y, s = 1, t = 0, lit = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {lit > 0 ? <Glow x={0} y={-40} r={160} kind="warm" o={0.7 * lit} /> : null}
    <path d="M -50 -20 Q 0 20 50 -20 L 44 -30 L -44 -30 Z" fill="#7A7A70" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <ellipse cx={0} cy={-30} rx={44} ry={9} fill="#C8A040" opacity={0.8} />
    {lit > 0 ? (
      <g opacity={lit}>
        <path d={`M 26 -30 Q 18 -50 ${28 + Math.sin(t / 3) * 3} -72 Q 36 -50 32 -30 Z`} fill="#FFB23A" />
        <path d={`M 28 -32 Q 24 -44 ${29 + Math.sin(t / 3) * 2} -56 Q 32 -44 30 -32 Z`} fill="#FFF1B0" />
      </g>
    ) : null}
  </g>
);

/** A hnefatafl board seen from above: a 9x9 grid, the king in the middle, defenders light, attackers dark. */
export const Tafl: React.FC<{ x: number; y: number; s?: number; t?: number; win?: number }> = ({ x, y, s = 1, t = 0, win = 0 }) => {
  const c = 34;
  const light = [[4, 2], [4, 3], [4, 5], [4, 6], [2, 4], [3, 4], [5, 4], [6, 4]];
  const dark = [[0, 3], [0, 4], [0, 5], [1, 4], [8, 3], [8, 4], [8, 5], [7, 4], [3, 0], [4, 0], [5, 0], [4, 1], [3, 8], [4, 8], [5, 8], [4, 7]];
  const kx = lerp(4, 0, clamp(win)), ky = lerp(4, 0, clamp(win));
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-c * 5} y={-c * 5} width={c * 10} height={c * 10} rx={10} fill="#A8784A" stroke={INK} strokeWidth={6} />
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}>
          <path d={`M ${-c * 4.5 + i * c} ${-c * 4.5} L ${-c * 4.5 + i * c} ${c * 4.5}`} stroke="#6A4428" strokeWidth={2} />
          <path d={`M ${-c * 4.5} ${-c * 4.5 + i * c} L ${c * 4.5} ${-c * 4.5 + i * c}`} stroke="#6A4428" strokeWidth={2} />
        </g>
      ))}
      {dark.map(([a, b], i) => <circle key={`d${i}`} cx={-c * 4 + a * c} cy={-c * 4 + b * c} r={12} fill="#2A2018" stroke={INK} strokeWidth={2} />)}
      {light.map(([a, b], i) => <circle key={`l${i}`} cx={-c * 4 + a * c} cy={-c * 4 + b * c} r={12} fill="#F2EAD8" stroke={INK} strokeWidth={2} />)}
      <circle cx={-c * 4 + kx * c} cy={-c * 4 + ky * c} r={15} fill="#E8C060" stroke={INK} strokeWidth={3} />
    </g>
  );
};

/** Skis: two long wooden boards, side view. */
export const Skis: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -180 0 L 160 0 Q 200 0 210 -30 Q 196 10 160 12 L -180 12 Z" fill="#B88A5A" stroke={INK} strokeWidth={4} />
  </g>
);

/** Flint, the steel striker and a lump of tinder fungus, from above; `glow` 0..1 lights the fungus. */
export const FireKit: React.FC<{ x: number; y: number; s?: number; glow?: number; t?: number }> = ({ x, y, s = 1, glow = 0, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -220 -20 L -170 -60 L -120 -40 L -110 10 L -170 30 Z" fill="#8A8A90" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M -170 -60 L -150 -10" stroke="#B8B8C0" strokeWidth={4} />
    <path d="M -40 -50 Q 40 -70 80 -40 Q 96 -24 80 -10 Q 40 -36 -40 -20 Z" fill="#5A5A62" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <g transform="translate(170 0)">
      <path d="M -60 10 Q -64 -40 0 -46 Q 64 -40 60 10 Q 0 30 -60 10 Z" fill="#8A6A4A" stroke={INK} strokeWidth={5} />
      <path d="M -40 -20 Q 0 -30 40 -20 M -46 -4 Q 0 -12 46 -4" stroke="#6A4A2E" strokeWidth={3} fill="none" />
      {glow > 0 ? (
        <g opacity={glow}>
          <Glow x={0} y={-10} r={140} kind="warm" o={0.9} />
          <ellipse cx={0} cy={-14} rx={22 + Math.sin(t / 2) * 3} ry={12} fill="#FF7A1E" />
          <ellipse cx={0} cy={-14} rx={10} ry={6} fill="#FFE27A" />
        </g>
      ) : null}
    </g>
  </g>
);

/** Needle-bound mittens, a pair. */
export const Mittens: React.FC<{ x: number; y: number; s?: number; c?: string }> = ({ x, y, s = 1, c = '#B8503A' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-1, 1].map((d) => (
      <g key={d} transform={`translate(${d * 70} 0) scale(${d} 1)`}>
        <path d="M -40 60 L -44 -40 Q -40 -90 0 -90 Q 40 -90 40 -40 L 40 60 Z" fill={c} stroke={INK} strokeWidth={5} />
        <path d="M -44 -10 Q -80 -20 -70 -50 Q -60 -60 -44 -40" fill={c} stroke={INK} strokeWidth={5} />
        <rect x={-46} y={40} width={90} height={24} rx={6} fill="#E8DCC0" stroke={INK} strokeWidth={4} />
        {[-60, -36, -12, 12].map((yy) => <path key={yy} d={`M -36 ${yy} q 12 8 24 0 q 12 8 24 0 q 12 8 24 0`} stroke="#00000033" strokeWidth={3} fill="none" />)}
      </g>
    ))}
  </g>
);

/** Food on a board: porridge, butter, cheese, skyr, salted meat (the c05 spread). `n` items shown (pops on). */
export const Spread: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 5 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {n > 0 ? <Bowl x={-360} y={0} s={1.1} steam fill="#D8C8A0" /> : null}
    {n > 1 ? <g><rect x={-210} y={-60} width={110} height={60} rx={14} fill="#F2D86A" stroke={INK} strokeWidth={5} /></g> : null}
    {n > 2 ? <g><path d="M -60 0 L -60 -70 L 60 -90 L 60 0 Z" fill="#E8C060" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><circle cx={0} cy={-40} r={8} fill="#C8A040" /><circle cx={30} cy={-60} r={6} fill="#C8A040" /></g> : null}
    {n > 3 ? <Bowl x={200} y={0} s={0.9} steam={false} fill="#F6F2E8" /> : null}
    {n > 4 ? <g><path d="M 300 0 Q 290 -70 360 -80 Q 430 -76 420 0 Z" fill="#B8504A" stroke={INK} strokeWidth={5} /><path d="M 320 -40 Q 360 -56 400 -40" stroke="#F2EAD8" strokeWidth={6} fill="none" /></g> : null}
  </g>
);

// ---------------------------------------------------------------- the longhouse, inside
/** Floor heights inside: feet on the walkway behind the hearth (BACK), in front of it (FRONT). */
export const LH = { back: 805, front: 1020, hearthY: 935, hx0: 560, hx1: 1360, bench: 650, byre: 1520 };
type Mode = 'day' | 'night' | 'dark';

export const Longhouse: React.FC<{ t: number; id?: string; mode?: Mode; fire?: number; cows?: boolean; smoke?: number; loom?: boolean }> = ({ t, id = 'lh', mode = 'day', fire = 1, cows = true, smoke = 1, loom = true }) => {
  const dark = mode === 'dark';
  const night = mode !== 'day';
  return (
    <g>
      <rect x={-600} y={-400} width={3100} height={1900} fill="#1E1410" />
      {/* roof underside: rafters rising to the ridge */}
      <path d="M -600 300 L 960 -120 L 2500 300 L 2500 -400 L -600 -400 Z" fill="#2A1C14" />
      {Array.from({ length: 16 }).map((_, i) => {
        const x = -500 + i * 200;
        return <path key={i} d={`M ${x} 300 L ${960 + (x - 960) * 0.15} -120`} stroke="#3A281C" strokeWidth={22} />;
      })}
      <path d="M -600 250 L 2500 250" stroke="#4A3222" strokeWidth={34} />
      {/* the smoke hole, high in the roof */}
      <rect x={890} y={-40} width={140} height={70} fill={night ? '#0E1630' : '#9AB8D8'} stroke="#140E0A" strokeWidth={8} />
      {night ? <Stars seed={4} x0={890} y0={-40} w={140} h={70} t={t} n={6} /> : <Glow x={960} y={0} r={160} kind="cool" o={0.4} />}
      {/* the far wall: vertical timber */}
      <rect x={-600} y={262} width={3100} height={420} fill="#5A3E2C" />
      {Array.from({ length: 34 }).map((_, i) => (
        <path key={i} d={`M ${-580 + i * 92} 262 L ${-580 + i * 92} 682`} stroke="#3E2A1E" strokeWidth={5} />
      ))}
      {/* hanging things: herbs, a shield, a sickle */}
      {[[200, 300], [260, 300], [1700, 300]].map(([x, y], i) => (
        <g key={i}>
          <path d={`M ${x} ${y} L ${x} ${y + 40}`} stroke="#2A1C14" strokeWidth={4} />
          <path d={`M ${x - 18} ${y + 40} L ${x} ${y + 110} L ${x + 18} ${y + 40} Z`} fill="#6A7A3A" stroke={INK} strokeWidth={3} />
        </g>
      ))}
      <g transform="translate(640 400)">
        {/* a round wooden shield: painted planks, an iron boss */}
        <circle r={74} fill="#C8A060" stroke={INK} strokeWidth={6} />
        <path d="M 0 -74 A 74 74 0 0 1 0 74 Z" fill="#A8443A" />
        {[-48, -24, 24, 48].map((x) => <path key={x} d={`M ${x} ${-Math.sqrt(74 * 74 - x * x)} L ${x} ${Math.sqrt(74 * 74 - x * x)}`} stroke="#00000040" strokeWidth={4} />)}
        <circle r={74} fill="none" stroke="#5A3A22" strokeWidth={8} />
        <circle r={22} fill="#7A7A80" stroke={INK} strokeWidth={4} />
      </g>
      {loom ? (
        // the warp-weighted loom against the wall: two uprights, a cloth half woven, clay weights
        <g transform="translate(60 300)">
          <path d="M -60 0 L -90 360 M 160 0 L 190 360" stroke="#7A5232" strokeWidth={18} strokeLinecap="round" />
          <rect x={-70} y={0} width={240} height={20} fill="#7A5232" stroke={INK} strokeWidth={4} />
          <rect x={-60} y={20} width={220} height={120} fill="#C8B080" stroke={INK} strokeWidth={3} />
          {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${-54 + i * 16} 140 L ${-54 + i * 16} 300`} stroke="#E8DCC0" strokeWidth={2} />)}
          {Array.from({ length: 14 }).map((_, i) => <circle key={`w${i}`} cx={-54 + i * 16} cy={310} r={9} fill="#A8644A" stroke={INK} strokeWidth={2} />)}
        </g>
      ) : null}
      {/* the bench platform along the wall, furs and blankets */}
      <rect x={-600} y={LH.bench} width={2140} height={30} fill="#7A5232" stroke={INK} strokeWidth={4} />
      <rect x={-600} y={LH.bench + 30} width={2140} height={110} fill="#4A3222" />
      {Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M ${-560 + i * 210} ${LH.bench + 30} L ${-560 + i * 210} ${LH.bench + 140}`} stroke="#2E2018" strokeWidth={6} />)}
      {[[-200, '#8A6A4A'], [150, '#B8A080'], [460, '#5A6A8A'], [1180, '#8A4A3A'], [1420, '#A88A60']].map(([x, c], i) => (
        <path key={i} d={`M ${x as number} ${LH.bench + 4} q 40 -26 110 -18 q 70 -10 120 14 l 6 40 q -120 14 -236 0 Z`} fill={c as string} stroke={INK} strokeWidth={4} />
      ))}
      {/* the byre at the far end: a wattle partition, two cows */}
      {cows ? (
        <g>
          <rect x={LH.byre} y={300} width={1000} height={540} fill="#3A2A1E" />
          <Cow x={1780} y={720} s={0.9} t={t} c="#8A5A3A" breath={night ? 0.6 : 0.3} chew />
          <Cow x={2180} y={730} s={0.85} t={t + 40} c="#5A4434" flip />
          <g>
            <path d={`M ${LH.byre} 620 L 2500 620 M ${LH.byre} 700 L 2500 700 M ${LH.byre} 780 L 2500 780`} stroke="#6A4A2E" strokeWidth={14} />
            {Array.from({ length: 12 }).map((_, i) => <path key={i} d={`M ${LH.byre + 10 + i * 90} 600 L ${LH.byre + 10 + i * 90} 850`} stroke="#4A3222" strokeWidth={12} />)}
          </g>
        </g>
      ) : null}
      {/* the floor */}
      <rect x={-600} y={LH.bench + 140} width={3100} height={900} fill="#4A3426" />
      <path d={`M -600 ${LH.bench + 140} L 2500 ${LH.bench + 140}`} stroke="#2E2018" strokeWidth={6} />
      {Array.from({ length: 30 }).map((_, i) => (
        <ellipse key={i} cx={-500 + rnd(7, i) * 2900} cy={820 + rnd(9, i) * 240} rx={20 + rnd(3, i) * 30} ry={5} fill="#3A281C" opacity={0.6} />
      ))}
      {/* roof posts */}
      {[380, 1460].map((x) => <rect key={x} x={x - 24} y={-400} width={48} height={1240} fill="#5A3E2C" stroke={INK} strokeWidth={5} />)}
      {/* the long hearth: a stone-lined pit down the middle of the floor */}
      <path d={`M ${LH.hx0 - 30} ${LH.hearthY} Q ${(LH.hx0 + LH.hx1) / 2} ${LH.hearthY - 34} ${LH.hx1 + 30} ${LH.hearthY} Q ${(LH.hx0 + LH.hx1) / 2} ${LH.hearthY + 44} ${LH.hx0 - 30} ${LH.hearthY} Z`} fill="#2A1A12" />
      <Flames x0={LH.hx0} x1={LH.hx1} y={LH.hearthY + 6} t={t} k={fire} />
      {Array.from({ length: 22 }).map((_, i) => {
        const a = (i / 22) * Math.PI * 2;
        const x = (LH.hx0 + LH.hx1) / 2 + Math.cos(a) * ((LH.hx1 - LH.hx0) / 2 + 30);
        const y = LH.hearthY + 4 + Math.sin(a) * 30;
        return Math.sin(a) > -0.2 ? <ellipse key={i} cx={x} cy={y} rx={30} ry={14} fill="#7A7268" stroke={INK} strokeWidth={4} /> : null;
      })}
      {/* a cauldron on a chain over the fire */}
      <path d="M 1150 -120 L 1150 760" stroke="#2A2420" strokeWidth={6} strokeDasharray="14 6" />
      <path d="M 1090 760 Q 1150 860 1210 760 Z" fill="#2A2A2E" stroke={INK} strokeWidth={6} />
      <path d="M 1080 760 L 1220 760" stroke="#3A3A40" strokeWidth={12} strokeLinecap="round" />
      {smoke > 0 ? <Smoke x={960} y={820} tx={960} ty={0} t={t} o={0.22 * smoke} n={8} r={50} /> : null}
      {/* light */}
      {fire > 0.02 ? <Glow x={960} y={820} r={700 * Math.min(1.1, 0.4 + fire)} kind="warm" o={0.8 * Math.min(1, fire + 0.2)} /> : null}
      <LightVeil id={`${id}v`} lights={[[960, 840, 260 + 380 * clamp(fire)]]} o={dark ? 0.86 : night ? 0.6 : 0.38} />
      {dark ? <rect x={-600} y={-400} width={3100} height={1900} fill="#0A1430" opacity={0.35} /> : null}
      {fire > 0.02 ? <Glow x={960} y={860} r={380} kind="warm" o={0.6 * clamp(fire)} /> : <Glow x={960} y={880} r={120} kind="red" o={0.4} />}
    </g>
  );
};

/** The hearth's near stones and flames again, for a shot where characters stand behind the fire. */
export const HearthFront: React.FC<{ t: number; fire?: number }> = ({ t, fire = 1 }) => (
  <g>
    <Flames x0={LH.hx0 + 40} x1={LH.hx1 - 40} y={LH.hearthY + 20} t={t + 7} k={fire * 0.7} seed={5} />
    {Array.from({ length: 22 }).map((_, i) => {
      const a = (i / 22) * Math.PI * 2;
      const x = (LH.hx0 + LH.hx1) / 2 + Math.cos(a) * ((LH.hx1 - LH.hx0) / 2 + 30);
      const y = LH.hearthY + 4 + Math.sin(a) * 30;
      return Math.sin(a) > 0.3 ? <ellipse key={i} cx={x} cy={y} rx={30} ry={14} fill="#7A7268" stroke={INK} strokeWidth={4} /> : null;
    })}
  </g>
);

// ---------------------------------------------------------------- outside
export type Tod = 'dawn' | 'day' | 'dusk' | 'night';
const SKY: Record<Tod, [string, string, string]> = {
  dawn: ['#2A3A6A', '#C87A8A', '#F6B87A'],
  day: ['#5A8AC8', '#A8C8E8', '#E8F0F8'],
  dusk: ['#1E2450', '#6A4A8A', '#E8866A'],
  night: ['#050A1E', '#0E1A3A', '#1E2E5A'],
};
export const FEET = 800;

export const Sky: React.FC<{ id: string; tod: Tod; t: number; sun?: [number, number] | null }> = ({ id, tod, t, sun }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={SKY[tod][0]} />
        <stop offset="0.6" stopColor={SKY[tod][1]} />
        <stop offset="1" stopColor={SKY[tod][2]} />
      </linearGradient>
    </defs>
    <rect x={-600} y={-400} width={3100} height={1100} fill={`url(#${id}sky)`} />
    {tod === 'night' ? (
      <g>
        <Stars seed={9} x0={-600} y0={-400} w={3100} h={900} t={t} n={140} />
        {/* the northern lights */}
        <path d={`M -200 ${180 + Math.sin(t / 40) * 20} Q 400 ${40 + Math.sin(t / 30) * 30} 900 160 T 2100 ${120 + Math.sin(t / 35) * 30}`} stroke="#5BE08A" strokeWidth={70} fill="none" opacity={0.18} filter="url(#blur16)" />
        <Moon x={1600} y={120} r={46} />
      </g>
    ) : null}
    {sun ? <g><Glow x={sun[0]} y={sun[1]} r={340} kind="warm" o={0.8} /><circle cx={sun[0]} cy={sun[1]} r={60} fill="#FFE8B0" /></g> : null}
  </g>
);

export const Mountains: React.FC<{ tod: Tod; y?: number }> = ({ tod, y = 590 }) => {
  const far = tod === 'night' ? '#1A2648' : tod === 'dusk' ? '#4A3A6A' : '#7A92B8';
  const near = tod === 'night' ? '#14203A' : tod === 'dusk' ? '#3A2E58' : '#5E7AA0';
  const snow = tod === 'night' ? '#8A9AC0' : tod === 'dusk' ? '#E8B8C8' : '#F2F8FF';
  return (
    <g>
      <path d={`M -600 ${y} L -300 ${y - 260} L 0 ${y - 120} L 400 ${y - 330} L 800 ${y - 140} L 1200 ${y - 300} L 1600 ${y - 110} L 2000 ${y - 280} L 2500 ${y - 60} L 2500 ${y + 40} L -600 ${y + 40} Z`} fill={far} />
      <path d={`M 400 ${y - 330} L 470 ${y - 262} L 430 ${y - 268} L 400 ${y - 240} L 360 ${y - 266} L 320 ${y - 262} Z M 1200 ${y - 300} L 1270 ${y - 232} L 1230 ${y - 238} L 1200 ${y - 210} L 1160 ${y - 236} L 1120 ${y - 232} Z M 2000 ${y - 280} L 2070 ${y - 212} L 2030 ${y - 218} L 2000 ${y - 190} L 1960 ${y - 216} L 1920 ${y - 212} Z M -300 ${y - 260} L -230 ${y - 192} L -270 ${y - 198} L -300 ${y - 170} L -340 ${y - 196} L -380 ${y - 192} Z`} fill={snow} />
      <path d={`M -600 ${y + 10} L -100 ${y - 120} L 300 ${y - 30} L 700 ${y - 150} L 1100 ${y - 20} L 1500 ${y - 140} L 1900 ${y - 30} L 2500 ${y - 120} L 2500 ${y + 60} L -600 ${y + 60} Z`} fill={near} />
    </g>
  );
};

export const Pine: React.FC<{ x: number; y: number; s?: number; c?: string; snow?: string }> = ({ x, y, s = 1, c = '#1E3A34', snow = '#EEF4FA' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-10} y={-40} width={20} height={40} fill="#3A2A1E" />
    {[0, 1, 2].map((k) => (
      <g key={k}>
        <path d={`M ${-90 + k * 22} ${-40 - k * 90} L 0 ${-170 - k * 90} L ${90 - k * 22} ${-40 - k * 90} Z`} fill={c} stroke={INK} strokeWidth={3} />
        <path d={`M ${-60 + k * 16} ${-80 - k * 90} L 0 ${-170 - k * 90} L ${60 - k * 16} ${-80 - k * 90} Q 0 ${-100 - k * 90} ${-60 + k * 16} ${-80 - k * 90} Z`} fill={snow} />
      </g>
    ))}
  </g>
);

/** Falling snow over a region, looping. */
export const Snowfall: React.FC<{ t: number; n?: number; wind?: number; o?: number; seed?: number }> = ({ t, n = 80, wind = 1, o = 0.8, seed = 2 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const sp = 2 + rnd(seed, i) * 3;
      const y = ((rnd(seed + 1, i) * 1400 + t * sp) % 1400) - 200;
      const x = ((rnd(seed + 2, i) * 2600 + t * sp * wind * 1.2 + Math.sin(t / 20 + i) * 20) % 2600) - 340;
      return <circle key={i} cx={x} cy={y} r={3 + rnd(seed + 3, i) * 6} fill="#FFFFFF" opacity={o * (0.4 + rnd(seed + 4, i) * 0.6)} />;
    })}
  </g>
);

/** Breath in the cold: a puff from (x, y) drifting in direction d, looping every 50 frames. */
export const Breath: React.FC<{ x: number; y: number; t: number; d?: number; s?: number; o?: number }> = ({ x, y, t, d = 1, s = 1, o = 0.7 }) => {
  const q = (t % 50) / 50;
  return <g opacity={o * Math.sin(q * Math.PI)}>{[0, 1, 2].map((k) => <circle key={k} cx={x + d * (q * 90 + k * 24) * s} cy={y - k * 10 * s - q * 20} r={(18 + q * 26 - k * 4) * s} fill="#F2F8FF" />)}</g>;
};

/** The farmyard: the longhouse under a snowed-in turf roof, banked snow, the well, the woodpile, pines. */
export const Farmyard: React.FC<{ t: number; id?: string; tod?: Tod; door?: number; snow?: number; wind?: number; well?: boolean; houseX?: number; smoke?: boolean; banks?: number }> = ({ t, id = 'fy', tod = 'day', door = 0.6, snow = 0.6, wind = 1, well = true, houseX = 0, smoke = true, banks = 1 }) => {
  const hx = 300 + houseX;
  const wall = tod === 'night' ? '#2A2028' : '#5A3E2C';
  const snowC = tod === 'night' ? '#9AAACE' : tod === 'dusk' ? '#E8D0DC' : '#F2F8FF';
  const snowS = tod === 'night' ? '#6A7AA0' : tod === 'dusk' ? '#B8A0C0' : '#C8DCF0';
  return (
    <g>
      <Sky id={id} tod={tod} t={t} sun={tod === 'dawn' ? [1500, 560] : null} />
      <Mountains tod={tod} />
      {[[-260, 640, 1.2], [-80, 660, 0.9], [1780, 640, 1.1], [2000, 660, 1.3], [1640, 620, 0.7]].map(([x, y, s], i) => <Pine key={i} x={x} y={y} s={s} />)}
      <rect x={-600} y={640} width={3100} height={900} fill={snowC} />
      <path d="M -600 660 Q 300 620 960 650 Q 1600 680 2500 640 L 2500 700 L -600 700 Z" fill={snowS} opacity={0.5} />
      {/* the longhouse: a long low timber wall under a curved turf roof deep in snow */}
      <g>
        <path d={`M ${hx} 700 L ${hx + 30} 520 L ${hx + 1000} 520 L ${hx + 1030} 700 Z`} fill={wall} stroke={INK} strokeWidth={5} />
        {Array.from({ length: 22 }).map((_, i) => <path key={i} d={`M ${hx + 40 + i * 45} 522 L ${hx + 36 + i * 45} 700`} stroke="#3E2A1E" strokeWidth={4} opacity={0.8} />)}
        <path d={`M ${hx - 60} 540 Q ${hx + 515} 300 ${hx + 1090} 540 Q ${hx + 515} 470 ${hx - 60} 540 Z`} fill="#4A5A3A" stroke={INK} strokeWidth={5} />
        <path d={`M ${hx - 70} 536 Q ${hx + 515} 280 ${hx + 1100} 536 Q ${hx + 1080} 520 ${hx + 1060} 524 Q ${hx + 515} 340 ${hx - 40} 526 Q ${hx - 56} 528 ${hx - 70} 536 Z`} fill={snowC} stroke={INK} strokeWidth={4} />
        <path d={`M ${hx - 60} 520 Q ${hx + 515} 290 ${hx + 1090} 520`} stroke={snowC} strokeWidth={40} fill="none" />
        {/* icicles */}
        {Array.from({ length: 16 }).map((_, i) => <path key={`ic${i}`} d={`M ${hx + 10 + i * 64} 538 l 8 ${18 + rnd(5, i) * 30} l 8 ${-(18 + rnd(5, i) * 30)} Z`} fill="#DDEEFF" opacity={0.9} />)}
        {/* the door, warm light inside */}
        <rect x={hx + 470} y={580} width={90} height={120} fill={door > 0 ? '#FFB347' : '#1A1210'} opacity={door > 0 ? 0.4 + 0.6 * door : 1} stroke={INK} strokeWidth={6} />
        {door > 0 ? <Glow x={hx + 515} y={640} r={200} kind="warm" o={0.6 * door} /> : null}
        {/* snow banked against the walls */}
        <path d={`M ${hx - 80} 710 Q ${hx + 100} ${700 - 110 * banks} ${hx + 440} ${700 - 60 * banks} L ${hx + 450} 712 Z M ${hx + 590} 712 L ${hx + 600} ${700 - 70 * banks} Q ${hx + 900} ${700 - 120 * banks} ${hx + 1110} 712 Z`} fill={snowC} stroke={snowS} strokeWidth={4} />
        {smoke ? <Smoke x={hx + 515} y={340} tx={hx + 515 + 200 * wind} ty={-100} t={t} o={0.4} n={7} r={36} /> : null}
      </g>
      {well ? (
        <g transform="translate(1560 720)">
          <ellipse cx={0} cy={0} rx={110} ry={30} fill="#7A7268" stroke={INK} strokeWidth={5} />
          <path d="M -110 0 L -110 -60 Q 0 -90 110 -60 L 110 0 Q 0 30 -110 0 Z" fill="#8A8278" stroke={INK} strokeWidth={5} />
          <path d="M -110 -60 Q 0 -100 110 -60" stroke={snowC} strokeWidth={22} fill="none" strokeLinecap="round" />
          <path d="M -90 -60 L -90 -220 M 90 -60 L 90 -220 M -110 -220 L 110 -220" stroke="#6A4A2E" strokeWidth={14} strokeLinecap="round" />
          <path d="M 0 -220 L 0 -150" stroke="#3A2A1E" strokeWidth={4} />
        </g>
      ) : null}
      {/* the woodpile */}
      <g transform="translate(1780 760)">
        {Array.from({ length: 18 }).map((_, i) => <circle key={i} cx={-120 + (i % 6) * 48 + (Math.floor(i / 6) % 2) * 24} cy={-Math.floor(i / 6) * 44} r={24} fill="#C8A070" stroke={INK} strokeWidth={4} />)}
        <path d="M -150 -110 Q 0 -150 150 -110" stroke={snowC} strokeWidth={26} fill="none" strokeLinecap="round" />
      </g>
      <Snowfall t={t} n={Math.round(90 * snow)} wind={wind} />
      {tod !== 'day' && tod !== 'dawn' ? <rect x={-600} y={-400} width={3100} height={1900} fill="#0A1030" opacity={tod === 'night' ? 0.35 : 0.15} /> : null}
    </g>
  );
};

/** The frozen lake in the short daylight, low sun, forest edge, mountains. */
export const Lake: React.FC<{ t: number; id?: string; tod?: Tod }> = ({ t, id = 'lk', tod = 'day' }) => (
  <g>
    <Sky id={id} tod={tod} t={t} sun={tod === 'dusk' ? [1300, 560] : [1500, 470]} />
    <Mountains tod={tod} y={570} />
    {Array.from({ length: 22 }).map((_, i) => <Pine key={i} x={-500 + i * 140 + rnd(3, i) * 60} y={640} s={0.5 + rnd(4, i) * 0.35} />)}
    <rect x={-600} y={630} width={3100} height={900} fill="#BFD8EA" />
    {Array.from({ length: 14 }).map((_, i) => <path key={i} d={`M ${-500 + rnd(6, i) * 2800} ${700 + rnd(7, i) * 360} l ${120 + rnd(8, i) * 200} ${-6 + rnd(9, i) * 12}`} stroke="#FFFFFF" strokeWidth={4} opacity={0.6} />)}
    <path d="M -600 630 Q 960 610 2500 640 L 2500 660 Q 960 650 -600 668 Z" fill="#F2F8FF" />
    {tod === 'dusk' ? <rect x={-600} y={-400} width={3100} height={1900} fill="#3A1A40" opacity={0.18} /> : null}
  </g>
);

/** A plain dark frame for "you blink" and the dead phone. */
export const Black: React.FC<{ t: number; id?: string }> = () => <rect x={-600} y={-400} width={3100} height={1900} fill="#05040A" />;

export { Foreground };
export const FONT_UI = FONT.ui;

/** Someone asleep under a blanket on the bench: a fur hump and a head on the pillow; `shiver` shakes it. */
export const Sleeper: React.FC<{ x: number; y: number; s?: number; t?: number; c?: string; hair?: string; shiver?: number; flip?: boolean; beard?: string }> = ({ x, y, s = 1, t = 0, c = '#8A6A4A', hair = '#17131C', shiver = 0, flip = false, beard }) => {
  const sh = shiver ? Math.sin(t * 2.8) * 3 * shiver : 0;
  const br = Math.sin(t / 25) * 3;
  return (
    <g transform={`translate(${x + sh} ${y}) scale(${flip ? -s : s} ${s})`}>
      <circle cx={-150} cy={-40} r={48} fill="#26232F" stroke={INK} strokeWidth={5} />
      <path d="M -190 -70 q 30 -30 70 -10" stroke={hair} strokeWidth={14} fill="none" strokeLinecap="round" />
      {beard ? <path d="M -180 -20 Q -150 30 -110 -10 Z" fill={beard} stroke={INK} strokeWidth={4} /> : null}
      <path d="M -160 -40 q 10 6 20 0" stroke="#F6EFE3" strokeWidth={5} fill="none" strokeLinecap="round" />
      <path d={`M -120 0 Q -110 ${-90 - br} 20 ${-96 - br} Q 160 ${-90 - br} 200 0 Z`} fill={c} stroke={INK} strokeWidth={6} />
      <path d={`M -80 -40 Q 40 ${-70 - br} 160 -30`} stroke="#00000030" strokeWidth={6} fill="none" />
    </g>
  );
};

/** A drying rack (hjell) with stockfish hanging in pairs. */
export const DryingRack: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-300, 0, 300].map((px) => <path key={px} d={`M ${px - 40} 0 L ${px} -320 L ${px + 40} 0`} stroke="#6A4A2E" strokeWidth={16} fill="none" strokeLinecap="round" />)}
    <path d="M -360 -300 L 360 -300" stroke="#7A5232" strokeWidth={18} strokeLinecap="round" />
    {Array.from({ length: 12 }).map((_, i) => (
      <g key={i} transform={`translate(${-310 + i * 56} -300) rotate(${Math.sin(t / 20 + i) * 4})`}>
        <path d="M -10 0 L -14 150 Q -10 175 -2 150 L 0 10 M 10 0 L 14 150 Q 10 175 2 150 L 0 10" fill="#B8B0A0" stroke={INK} strokeWidth={4} />
      </g>
    ))}
  </g>
);

/** A drop spindle hanging from a thread, turning. */
export const Spindle: React.FC<{ x: number; y: number; s?: number; t?: number; len?: number }> = ({ x, y, s = 1, t = 0, len = 160 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M 0 0 L 0 ${len}`} stroke="#E8DCC0" strokeWidth={3} />
    <ellipse cx={0} cy={len + 20} rx={12} ry={24} fill="#E8DCC0" stroke={INK} strokeWidth={3} />
    <ellipse cx={0} cy={len + 40} rx={34 * Math.abs(Math.cos(t / 4)) + 6} ry={9} fill="#A8644A" stroke={INK} strokeWidth={3} />
    <path d={`M 0 ${len} L 0 ${len + 70}`} stroke="#7A5232" strokeWidth={6} />
  </g>
);

/** Modern white sneakers side on, from the ankle. */
export const Sneakers: React.FC<{ x: number; y: number; s?: number; grass?: number }> = ({ x, y, s = 1, grass = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[-140, 140].map((dx) => (
      <g key={dx} transform={`translate(${dx} 0)`}>
        <rect x={-40} y={-200} width={70} height={170} fill="#3B3646" stroke={INK} strokeWidth={6} />
        <path d="M -60 0 L -50 -60 Q 0 -80 40 -50 Q 110 -30 120 0 Z" fill="#F6EFE3" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <path d="M -60 0 L 120 0" stroke="#C8C2B6" strokeWidth={14} />
        {grass > 0 ? <path d="M -40 -60 l -10 -40 M -20 -64 l 0 -46 M 0 -66 l 12 -40" stroke="#C8B860" strokeWidth={6} strokeLinecap="round" opacity={grass} /> : null}
      </g>
    ))}
  </g>
);

/** A leather turnshoe stuffed with dry grass. */
export const GrassShoe: React.FC<{ x: number; y: number; s?: number; grass?: number }> = ({ x, y, s = 1, grass = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({ length: 9 }).map((_, i) => <path key={i} d={`M ${-60 + i * 14} -60 l ${(i % 3 - 1) * 14} ${-50 - (i % 2) * 30}`} stroke="#D8C870" strokeWidth={7} strokeLinecap="round" opacity={clamp(grass * 9 - i)} />)}
    <path d="M -110 0 Q -120 -60 -60 -70 L 60 -70 Q 140 -50 150 0 Z" fill="#7A5232" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M -80 -50 Q 0 -40 90 -50" stroke="#5A3A22" strokeWidth={5} fill="none" strokeDasharray="10 8" />
  </g>
);

/** A bone ice skate: a horse leg bone, flattened underneath, a leather strap. */
export const BoneSkate: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M -200 0 Q -220 -40 -170 -50 L 170 -50 Q 230 -40 210 0 Z" fill="#EEE6D2" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <circle cx={-170} cy={-30} r={30} fill="#EEE6D2" stroke={INK} strokeWidth={6} />
    <circle cx={175} cy={-30} r={34} fill="#EEE6D2" stroke={INK} strokeWidth={6} />
    <path d="M -60 -50 Q -40 -120 0 -110 Q 40 -120 60 -50" stroke="#7A5232" strokeWidth={14} fill="none" />
    <circle cx={-170} cy={-30} r={9} fill="#3A2A1E" />
  </g>
);

/** A snow shovel (wood). */
export const Shovel: React.FC<{ x: number; y: number; s?: number; rot?: number; load?: boolean }> = ({ x, y, s = 1, rot = 0, load = false }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-6} y={-200} width={12} height={200} rx={5} fill="#8A6440" stroke={INK} strokeWidth={3} />
    <path d="M -40 0 L 40 0 L 34 70 L -34 70 Z" fill="#B88A5A" stroke={INK} strokeWidth={4} />
    {load ? <ellipse cx={0} cy={4} rx={44} ry={16} fill="#F2F8FF" /> : null}
  </g>
);
