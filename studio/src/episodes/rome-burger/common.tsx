import React from 'react';
import {
  Hero, LOOKS, Look, Pose, ShotProps, Word, basePose, camT, clamp, kf, backOut, faceAt, idleBlink, talkAt, Expr, FONT, Glow, joints, toWorld, rnd,
} from '../../engine';
import { Schematic } from '../../engine';
export const SchematicBg: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Schematic t={t} id={id ?? 'rsch'} />;

// Shared by every chapter of "What if you opened a McDonald's in ancient Rome?": the cast (you and Ellie from the
// present; Tullia, Felix and the Romans in tunics and togas), word spans for lip sync, and the shot builders.

export const L = LOOKS;
export const YOU = LOOKS.you;
export const ELLIE = LOOKS.ellie;
const INK = '#26232F', INK2 = '#1C1A24';
const roman = (o: Partial<Look>): Look => ({ skin: INK, skinShade: INK2, hand: INK, jacket: '#C8B08A', jacketShade: '#A8906A', accent: '#E9DCC0', limb: '#3B3646', line: '#100E16', shoe: '#6A4A2E', face: '#F6EFE3', hair: '#17131C', robe: 'tunic', belt: '#5A3A22', ...o });
/** Tullia: the widow who owns the counter. A long teal dress, a terracotta mantle over her head. */
export const TULLIA = roman({ jacket: '#3E7A72', jacketShade: '#2F625B', robe: 'dress', belt: '#D8A03A', extra: 'bob', hat: 'palla', hatColor: '#B8604A' });
/** Felix, her son (your age): an ochre tunic, a leather belt, curls. */
export const FELIX = roman({ jacket: '#D89A3A', jacketShade: '#B87E2A', extra: 'curls', noPhones: true });
/** The man from the palace: a white toga with a wide purple stripe, combed hair. */
export const OFFICIAL = roman({ jacket: '#E9E2D2', jacketShade: '#C8C0B0', robe: 'toga', toga: '#F2ECDE', stripe: '#6A2C7A', extra: 'suit', shoe: '#2A1E1A' });
/** A senator in the queue (same toga, older, grey hair). */
export const SENATOR = roman({ jacket: '#E9E2D2', jacketShade: '#C8C0B0', robe: 'toga', toga: '#EDE6D6', stripe: '#7A2C5A', extra: 'suit', hair: '#B9B4AA' });
/** A soldier: a red tunic, a dark belt, a helmet with a red crest. */
export const SOLDIER = roman({ jacket: '#A8323A', jacketShade: '#882830', belt: '#3A2A20', hat: 'helmet', hatColor: '#B8B0A0', shoe: '#3A2A20' });
/** A gladiator: a bare-shouldered brown tunic, a wide belt (draw him big). */
export const GLADIATOR = roman({ jacket: '#6A4A32', jacketShade: '#523826', belt: '#C8A040', limb: '#26232F' });
/** A baker covered in flour. */
export const BAKER = roman({ jacket: '#EDE6D6', jacketShade: '#D0C8B8', belt: '#A8906A', hair: '#E9E2D2' });
/** A street boy (the messenger). */
export const BOY = roman({ jacket: '#8A9A6A', jacketShade: '#707E54' });
/** Customers in plain tunics, by index. */
export const CITIZENS: Look[] = ['#8A5A6A', '#5A6A8A', '#C8B08A', '#6A8A5A', '#B86A4A', '#7A6A9A'].map((c, i) =>
  roman({ jacket: c, jacketShade: c, robe: i % 3 === 2 ? 'dress' : 'tunic', extra: i % 3 === 2 ? 'bob' : i % 2 ? 'curls' : undefined, noPhones: true, hat: i === 5 ? 'palla' : undefined, hatColor: '#C8A878' }),
);

/** Seconds from the start of word `a` (its nth occurrence) to the end of word `b` after it: a character's line. */
export const span = (words: Word[], a: string, b: string, nth = 1): [number, number] => {
  const n = (w: string) => w.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '').replace(/^'+|'+$/g, '');
  let seen = 0;
  const i = words.findIndex((w) => n(w.w) === n(a) && ++seen === nth);
  if (i < 0) return [0, 0];
  const j = words.findIndex((w, k) => k >= i && n(w.w) === n(b));
  return [words[i].s, words[j >= 0 ? j : i].e + 0.05];
};
/** The frame (on the chapter's clock) where word `a` (nth occurrence) starts. */
export const wordF = (words: Word[], a: string, nth = 1, fps = 30) => Math.round(span(words, a, a, nth)[0] * fps);

/** A set drawn soft, for the background of an insert or a close-up. */
export const Soft: React.FC<{ blur?: 6 | 10 | 16; children: React.ReactNode; dim?: number }> = ({ blur = 10, children, dim = 0.25 }) => (
  <g>
    <g filter={`url(#blur${blur})`}>{children}</g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0816" opacity={dim} />
  </g>
);

type SetFC = React.FC<{ t: number; id?: string }>;

/** A character close-up: one face filling the frame over a soft set, for reactions. `light` adds a glow on the face. */
export const faceCU = (o: {
  look: Look; Bg: SetFC; faces: [number, Expr][]; yaw?: number; eyes?: number; talk?: [number, number]; words?: Word[];
  zoom?: [number, number]; side?: number; pose?: Partial<Pose>; extra?: (t: number) => React.ReactNode; glint?: number; glintColor?: string;
  light?: { x: number; y: number; kind?: 'warm' | 'cool' | 'red'; o?: number }; dark?: number; front?: (t: number) => React.ReactNode;
}): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const face = faceAt(t, o.faces);
    const z = kf(t, [[0, o.zoom?.[0] ?? 3.2], [Math.max(1, len), o.zoom?.[1] ?? 3.45]]);
    const x = 960 + (o.side ?? 0);
    const open = o.words && o.talk ? talkAt(o.words, f, 30, [o.talk]) : 0;
    const pose: Pose = {
      ...basePose, x, y: 700, scale: 1, yaw: o.yaw ?? 0.3, look: o.eyes ?? -Math.sign(o.yaw ?? 0.3) * 0.4,
      headTilt: Math.sin(t / 25) * 2, ...o.pose, expr: face.expr, blink: Math.max(face.blink, idleBlink(t, 3)), talk: open, glint: o.glint, glintColor: o.glintColor,
    };
    return (
      <g>
        <Soft blur={16} dim={0.15 + (o.dark ?? 0)}>
          <g transform={camT(960, 520, 1.6)}>
            <o.Bg t={t + 120} id="fcu" />
          </g>
        </Soft>
        <g transform={camT(x, 540, z)}>
          {o.light ? <Glow x={o.light.x} y={o.light.y} r={260} kind={o.light.kind ?? 'warm'} o={o.light.o ?? 0.8} /> : null}
          <Hero look={o.look} pose={pose} shadow={0} />
          {o.extra?.(t)}
        </g>
        {o.front?.(t)}
      </g>
    );
  };
  return Shot;
};

/** A big word or number on its own (DAY 2, 8:14 PM), popping on over a dark ground or a soft set. */
export const bigWord = (o: { kicker?: string; word: string; color?: string; Bg?: SetFC; size?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const pop = backOut(clamp((t - 3) / 9));
    return (
      <g>
        {o.Bg ? (
          <Soft blur={16} dim={0.5}>
            <o.Bg t={t + 500} id="bw" />
          </Soft>
        ) : (
          <rect width={1920} height={1080} fill="#0C0A16" />
        )}
        {o.kicker ? (
          <text x={960} y={400} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>
            {o.kicker}
          </text>
        ) : null}
        <g transform={`translate(960 600) scale(${pop})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={o.size ?? 230} fill={o.color ?? '#FFD23A'} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">
            {o.word}
          </text>
        </g>
      </g>
    );
  };
  return Shot;
};

/** Where a character's hand is (left or right). */
export const handAt = (pose: Pose, side: 'L' | 'R' = 'R') => toWorld(pose, (side === 'L' ? joints(pose).armL : joints(pose).armR).end);

/** A dark ground with a faint vignette, for inserts that happen in the blackout. */
export const DarkBg: SetFC = ({ t }) => (
  <g>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#0A0A14" />
    {Array.from({ length: 30 }).map((_, i) => (
      <circle key={i} cx={rnd(3, i) * 1920} cy={rnd(4, i) * 1080} r={1 + rnd(5, i) * 2} fill="#3A3A5A" opacity={0.3 + 0.2 * Math.sin(t / 20 + i)} />
    ))}
  </g>
);

// ---------------------------------------------------------------- schematic icons
// Line icons in the schematic's cream ink, about 200 units across, centred on (0, 0).
const IC = { line: '#F6EFE3', live: '#FF8A3D', sw: 9 };
export type IconName = 'battery' | 'generator' | 'solar' | 'watch' | 'bike' | 'boat' | 'train' | 'clock' | 'wire' | 'chip' | 'screen' | 'brain' | 'heart' | 'photo' | 'message' | 'game' | 'fire' | 'plug' | 'tower' | 'pump' | 'tap' | 'fridge' | 'truck' | 'fuel' | 'factory' | 'tractor' | 'reactor' | 'radio' | 'phone' | 'wheat';
export const Icon: React.FC<{ name: IconName; x: number; y: number; s?: number; live?: number; t?: number }> = ({ name, x, y, s = 1, live = 0, t = 0 }) => {
  const c = live > 0 ? IC.live : IC.line;
  const p = { stroke: c, strokeWidth: IC.sw, fill: 'none', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  const body: Record<IconName, React.ReactNode> = {
    battery: <g><rect x={-90} y={-50} width={170} height={100} rx={14} {...p} /><rect x={80} y={-20} width={16} height={40} rx={4} {...p} /><path d="M -60 -26 L -60 26 M -36 -26 L -36 26" {...p} /></g>,
    generator: <g><rect x={-100} y={-60} width={200} height={110} rx={10} {...p} /><circle cx={-30} cy={-5} r={34} {...p} /><path d="M 40 -30 L 70 -30 M 40 0 L 70 0 M -90 50 L -90 80 M 90 50 L 90 80" {...p} /></g>,
    solar: <g><path d="M -110 30 L -70 -60 L 110 -60 L 70 30 Z M -40 -60 L -80 30 M 20 -60 L -10 30 M 80 -60 L 50 30 M -90 -15 L 90 -15" {...p} /><path d="M 0 30 L 0 80 M -40 80 L 40 80" {...p} /></g>,
    watch: <g><circle r={60} {...p} /><path d="M -34 -55 L -28 -100 L 28 -100 L 34 -55 M -34 55 L -28 100 L 28 100 L 34 55" {...p} /></g>,
    bike: <g><circle cx={-70} cy={30} r={44} {...p} /><circle cx={70} cy={30} r={44} {...p} /><path d="M -70 30 L -20 -40 L 40 -40 L 70 30 M -20 -40 L 0 30 L 40 -40 M -30 -60 L -6 -60 M 40 -40 L 50 -66 L 70 -66" {...p} /></g>,
    boat: <g><path d="M -110 30 L 110 30 L 80 70 L -80 70 Z M 0 30 L 0 -100 L 80 10 L 0 10 M 0 -80 L -70 10 L 0 10" {...p} /></g>,
    train: <g><path d="M -110 40 L -110 -30 L 20 -30 L 20 -80 L 80 -80 L 80 40 Z M -80 -30 L -80 -70 L -50 -70 L -50 -30" {...p} /><circle cx={-70} cy={60} r={24} {...p} /><circle cx={40} cy={60} r={24} {...p} /><circle cx={-70 + Math.sin(t / 6) * 6} cy={-100 - (t % 30)} r={12 + (t % 30) * 0.5} {...p} strokeWidth={5} opacity={1 - (t % 30) / 30} /></g>,
    clock: <g><circle r={80} {...p} /><path d={`M 0 0 L ${Math.sin(t / 20) * 50} ${-Math.cos(t / 20) * 50} M 0 0 L 30 0`} {...p} /><path d="M -50 -80 L -70 -100 M 50 -80 L 70 -100 M -20 -110 L 20 -110 M 0 -110 L 0 -80" {...p} /></g>,
    wire: <g><path d="M -120 0 Q -60 -50 0 0 T 120 0" {...p} /><circle cx={-120} cy={0} r={10} {...p} /><circle cx={120} cy={0} r={10} {...p} /></g>,
    chip: <g><rect x={-60} y={-60} width={120} height={120} rx={8} {...p} /><rect x={-30} y={-30} width={60} height={60} {...p} />{[-40, -13, 13, 40].map((k) => <path key={k} d={`M ${k} -60 L ${k} -86 M ${k} 60 L ${k} 86 M -60 ${k} L -86 ${k} M 60 ${k} L 86 ${k}`} {...p} strokeWidth={6} />)}</g>,
    screen: <g><rect x={-110} y={-70} width={220} height={130} rx={8} {...p} /><path d="M -30 60 L -40 90 L 40 90 L 30 60" {...p} /></g>,
    brain: <g><path d="M -10 -80 Q -90 -90 -90 -20 Q -110 40 -40 60 Q 0 80 10 50 Q 60 80 90 30 Q 110 -30 70 -60 Q 40 -100 -10 -80 Z M -10 -80 L 0 60 M -60 -30 Q -30 -20 -40 10 M 40 -40 Q 20 -10 50 10" {...p} /></g>,
    heart: <path d="M 0 70 C -140 -10 -100 -110 0 -40 C 100 -110 140 -10 0 70 Z" {...p} />,
    photo: <g><rect x={-100} y={-70} width={200} height={140} rx={10} {...p} /><path d="M -80 50 L -20 -10 L 20 30 L 50 0 L 80 50" {...p} /><circle cx={50} cy={-35} r={14} {...p} /></g>,
    message: <g><path d="M -100 -60 L 100 -60 L 100 40 L -20 40 L -60 80 L -60 40 L -100 40 Z" {...p} /><path d="M -60 -20 L 60 -20 M -60 10 L 30 10" {...p} /></g>,
    game: <g><path d="M -90 -30 Q -60 -50 0 -44 Q 60 -50 90 -30 Q 120 40 90 56 Q 70 64 50 30 L -50 30 Q -70 64 -90 56 Q -120 40 -90 -30 Z" {...p} /><path d="M -60 -10 L -30 -10 M -45 -25 L -45 5" {...p} /><circle cx={50} cy={-10} r={8} {...p} /></g>,
    fire: <g><path d="M 0 -100 Q 70 -30 50 30 Q 30 80 0 80 Q -30 80 -50 30 Q -70 -30 0 -100 Z M 0 -20 Q 26 10 16 40 Q 8 60 0 60 Q -8 60 -16 40 Q -26 10 0 -20 Z" {...p} /></g>,
    plug: <g><rect x={-50} y={-40} width={100} height={80} rx={14} {...p} /><path d="M -20 -40 L -20 -80 M 20 -40 L 20 -80 M 0 40 L 0 100" {...p} /></g>,
    tower: <g><path d="M -50 100 L 0 -100 L 50 100 M -70 -50 L 70 -50 M -55 -10 L 55 -10 M -30 30 L 30 70 M 30 30 L -30 70" {...p} /></g>,
    pump: <g><circle cx={-20} cy={0} r={60} {...p} /><path d="M -20 -60 L -20 -100 L 100 -100 M 40 0 L 110 0 M -20 60 L -20 100 M -60 100 L 20 100" {...p} /><path d={`M -20 0 L ${-20 + Math.cos(t / 3) * 40} ${Math.sin(t / 3) * 40}`} {...p} /></g>,
    tap: <g><path d="M -100 -40 L 20 -40 Q 60 -40 60 0 L 60 20 M -100 -10 L 20 -10 Q 30 -10 30 0 L 30 20 M -40 -40 L -40 -80 M -70 -80 L -10 -80" {...p} /></g>,
    fridge: <g><rect x={-60} y={-100} width={120} height={200} rx={10} {...p} /><path d="M -60 -30 L 60 -30 M 40 -80 L 40 -50 M 40 -10 L 40 40" {...p} /></g>,
    truck: <g><path d="M -110 40 L -110 -50 L 40 -50 L 40 40 Z M 40 -20 L 90 -20 L 110 10 L 110 40 L 40 40" {...p} /><circle cx={-70} cy={50} r={20} {...p} /><circle cx={70} cy={50} r={20} {...p} /></g>,
    fuel: <g><rect x={-60} y={-90} width={90} height={180} rx={8} {...p} /><rect x={-40} y={-70} width={50} height={40} {...p} /><path d="M 30 -50 L 70 -30 L 70 40 Q 70 60 50 50" {...p} /></g>,
    factory: <g><path d="M -110 80 L -110 -10 L -50 -50 L -50 -10 L 10 -50 L 10 -10 L 70 -50 L 70 80 Z M 70 80 L 110 80 L 110 -100 L 80 -100 L 80 -50" {...p} /></g>,
    tractor: <g><circle cx={-50} cy={30} r={50} {...p} /><circle cx={70} cy={50} r={30} {...p} /><path d="M -50 -20 L -50 -90 L 20 -90 L 30 -20 L 100 -20 L 100 30" {...p} /></g>,
    reactor: <g><path d="M -70 90 Q -40 0 -60 -90 L 60 -90 Q 40 0 70 90 Z" {...p} /><path d={`M -20 -110 Q -40 -130 -20 -150`} {...p} strokeWidth={5} /></g>,
    radio: <g><rect x={-100} y={-50} width={200} height={110} rx={12} {...p} /><circle cx={-40} cy={5} r={30} {...p} /><path d="M 30 -10 L 80 -10 M 30 20 L 80 20 M 60 -50 L 100 -100" {...p} /></g>,
    phone: <g><rect x={-50} y={-90} width={100} height={180} rx={16} {...p} /><path d="M -14 70 L 14 70" {...p} /></g>,
    wheat: <g><path d="M 0 100 L 0 -100" {...p} />{[-70, -40, -10, 20].map((k) => <path key={k} d={`M 0 ${k} Q -30 ${k - 20} -36 ${k - 46} M 0 ${k} Q 30 ${k - 20} 36 ${k - 46}`} {...p} />)}</g>,
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {live > 0 ? <Glow x={0} y={0} r={160} o={0.5 * live} /> : null}
      {body[name]}
    </g>
  );
};

/** A red cross drawn over an icon, from frame `t0` over 6 frames. */
export const Cross: React.FC<{ x: number; y: number; s?: number; t: number; t0: number }> = ({ x, y, s = 1, t, t0 }) => {
  const k = clamp((t - t0) / 6);
  if (k <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke="#FF3A3A" strokeWidth={18} strokeLinecap="round">
      <path d={`M -90 -90 L ${-90 + 180 * Math.min(1, k * 2)} ${-90 + 180 * Math.min(1, k * 2)}`} />
      {k > 0.5 ? <path d={`M 90 -90 L ${90 - 180 * (k - 0.5) * 2} ${-90 + 180 * (k - 0.5) * 2}`} /> : null}
    </g>
  );
};

/** A row (or grid) of icons popping on at their own frames on the schematic, each with a label; `cross` crosses them out. */
export const iconBoard = (o: { items: { name: IconName; label?: string; at: number; cross?: number; live?: number }[]; cols?: number; title?: string; s?: number; y?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const n = o.items.length;
    const cols = o.cols ?? n;
    const rows = Math.ceil(n / cols);
    const gx = Math.min(420, 1600 / cols);
    const gy = 340;
    return (
      <g>
        <g transform={camT(960, 540, kf(t, [[0, 1], [Math.max(1, len), 1.05]]))}>
          <SchematicBg t={t} />
        </g>
        {o.title ? <text x={960} y={160} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={8} fill="#FF8A3D" opacity={clamp(t / 6)}>{o.title}</text> : null}
        {o.items.map((it, i) => {
          const c = i % cols;
          const r = Math.floor(i / cols);
          const x = 960 + (c - (Math.min(cols, n - r * cols) - 1) / 2) * gx;
          const y = (o.y ?? 560) + (r - (rows - 1) / 2) * gy;
          const pop = backOut(clamp((t - it.at) / 8));
          if (pop <= 0) return null;
          return (
            <g key={i}>
              <g transform={`translate(${x} ${y}) scale(${pop}) translate(${-x} ${-y})`}>
                <Icon name={it.name} x={x} y={y} s={o.s ?? 1} t={t} live={it.live !== undefined ? (t >= it.live ? 1 : 0) : 0} />
                {it.label ? <text x={x} y={y + 150 * (o.s ?? 1)} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} letterSpacing={4} fill="#F6EFE3">{it.label}</text> : null}
              </g>
              {it.cross !== undefined ? <Cross x={x} y={y} s={o.s ?? 1} t={t} t0={it.cross} /> : null}
            </g>
          );
        })}
      </g>
    );
  };
  return Shot;
};
