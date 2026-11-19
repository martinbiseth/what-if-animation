import React from 'react';
import { FONT, Glow, clamp, backOut, rnd, kf, lerp, DaySky, Tod } from '../../engine';

// Props for "What if video game cheat codes worked in real life?": the yard-sale controller, the list of codes, the
// glowing CHEAT ACTIVATED letters only you can see, the money bag and its copied bills, the sports car that drops out
// of thin air, the jetpack, the plane, the power company's graph and the GAME PAUSED screen. All ours: a generic grey
// controller with coloured round buttons, no real console, game, code or logo.

export const CHEAT = { glow: '#5BF0C8', glowDeep: '#0E3A34', gold: '#FFD34A', red: '#FF4A4A', blue: '#3A8AF0', green: '#4BD86A' };

/** The controller: a chunky old grey pad, a d-pad on the left, four coloured round buttons on the right. `press` lights
 * one button ('r' | 'b' | 'g' | 'y' | 'up' | 'down' | 'left' | 'right'); `glow` makes the whole pad hum. */
export const Controller: React.FC<{ x: number; y: number; s?: number; rot?: number; press?: string; glow?: number; worn?: boolean }> = ({ x, y, s = 1, rot = 0, press, glow = 0, worn = true }) => {
  const btn = (k: string, cx: number, cy: number, c: string) => (
    <g key={k}>
      <circle cx={cx} cy={cy + 5} r={24} fill="#1A1820" opacity={0.6} />
      <circle cx={cx} cy={press === k ? cy + 4 : cy} r={24} fill={c} stroke="#16141C" strokeWidth={5} />
      <circle cx={cx - 7} cy={(press === k ? cy + 4 : cy) - 8} r={7} fill="#FFFFFF" opacity={0.45} />
      {press === k ? <Glow x={cx} y={cy} r={90} o={0.9} /> : null}
    </g>
  );
  const dp = (k: string, d: string) => <path key={k} d={d} fill={press === k ? '#6A6878' : '#2A2830'} />;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {glow > 0 ? <Glow x={0} y={0} r={420} kind="cool" o={0.6 * glow} /> : null}
      {/* cable stub */}
      <path d="M 0 -120 Q 10 -170 -20 -210" stroke="#26242C" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M -260 -40 Q -270 -120 -170 -125 H 170 Q 270 -120 260 -40 L 250 70 Q 240 160 170 150 Q 120 140 90 80 H -90 Q -120 140 -170 150 Q -240 160 -250 70 Z" fill="#8A8894" stroke="#16141C" strokeWidth={8} />
      <path d="M -240 -60 Q -240 -110 -170 -112 H 170 Q 240 -110 240 -60" stroke="#B8B6C2" strokeWidth={8} fill="none" opacity={0.7} />
      {worn ? (
        <g opacity={0.5}>
          <path d="M -120 40 l 30 -8 M 60 -90 l 40 6 M 150 100 l 20 18" stroke="#5A5864" strokeWidth={4} strokeLinecap="round" />
          <circle cx={-200} cy={80} r={6} fill="#6A6874" />
        </g>
      ) : null}
      {/* the d-pad */}
      <g transform="translate(-150 -10)">
        <circle r={62} fill="#6E6C78" />
        {dp('up', 'M -18 -54 H 18 V -18 H -18 Z')}
        {dp('down', 'M -18 18 H 18 V 54 H -18 Z')}
        {dp('left', 'M -54 -18 H -18 V 18 H -54 Z')}
        {dp('right', 'M 18 -18 H 54 V 18 H 18 Z')}
        <rect x={-18} y={-18} width={36} height={36} fill="#2A2830" />
      </g>
      {/* start/select */}
      <rect x={-46} y={-30} width={36} height={12} rx={6} fill="#3A3842" />
      <rect x={10} y={-30} width={36} height={12} rx={6} fill="#3A3842" />
      {/* the four round buttons */}
      <g transform="translate(150 -10)">
        {btn('y', 0, -50, '#F2C14E')}
        {btn('b', 50, 0, CHEAT.blue)}
        {btn('g', 0, 50, CHEAT.green)}
        {btn('r', -50, 0, CHEAT.red)}
      </g>
    </g>
  );
};

/** The list of codes on yellowed paper, taped to the controller's back: twelve lines of button symbols and names, and
 * a thirteenth scribbled out. `reveal` (0..1) lets the sun through and shows RESET under the scribbles; `hi` lights
 * one line (its index). */
export const CODES = ['INVINCIBLE', 'SUNSHINE', 'SLOW MO', 'MONEY', 'MOON JUMP', 'NO RAIN', 'SPAWN CAR', 'BIG HEAD', 'JETPACK', 'FAST RUN', 'NIGHT', 'PARTY'];
const SYM: Record<string, string> = { r: CHEAT.red, b: CHEAT.blue, g: CHEAT.green, y: '#F2C14E' };
export const CodeList: React.FC<{ x: number; y: number; s?: number; rot?: number; reveal?: number; hi?: number; back?: boolean; lines?: number }> = ({ x, y, s = 1, rot = 0, reveal = 0, hi = -1, back = false, lines = 12 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {reveal > 0 ? <Glow x={0} y={0} r={700} o={0.6 * reveal} /> : null}
    <path d="M -260 -380 L 260 -370 L 250 390 L -255 380 Z" fill={reveal > 0 ? `rgb(${lerp(234, 255, reveal)},${lerp(222, 238, reveal)},${lerp(180, 190, reveal)})` : '#EADFB4'} stroke="#6A5A3A" strokeWidth={4} />
    <rect x={-80} y={-400} width={160} height={44} fill="#E8E4D0" opacity={0.75} transform="rotate(-3)" />
    {back ? (
      <g fontFamily="Kalam, cursive" fontWeight={700} fill="#2A2418">
        <text x={-210} y={-270} fontSize={46}>RULES</text>
        <text x={-210} y={-170} fontSize={36}>1. A cheat stays on until</text>
        <text x={-170} y={-125} fontSize={36}>you enter it again.</text>
        <text x={-210} y={-40} fontSize={36}>2. Nobody else can</text>
        <text x={-170} y={5} fontSize={36}>see the letters.</text>
        <text x={-210} y={90} fontSize={36} fill="#9A1A1A">3. NEVER enter</text>
        <text x={-170} y={135} fontSize={36} fill="#9A1A1A">the last code.</text>
      </g>
    ) : (
      <g>
        {CODES.slice(0, lines).map((c, i) => {
          const yy = -320 + i * 52;
          return (
            <g key={c}>
              {hi === i ? <rect x={-240} y={yy - 34} width={480} height={46} fill="#FFE27A" opacity={0.8} /> : null}
              <text x={-230} y={yy} fontFamily="Kalam, cursive" fontWeight={700} fontSize={30} fill="#2A2418">{i + 1}.</text>
              {[0, 1, 2, 3, 4].map((k) => {
                const key = 'rbgy'[Math.floor(rnd(i + 3, k) * 4)];
                return <circle key={k} cx={-160 + k * 30} cy={yy - 10} r={10} fill={SYM[key]} stroke="#2A2418" strokeWidth={2} />;
              })}
              <text x={10} y={yy} fontFamily="Kalam, cursive" fontWeight={700} fontSize={32} fill="#2A2418">{c}</text>
            </g>
          );
        })}
        {/* line 13: scribbled out so hard the pen went through */}
        <g transform="translate(0 330)">
          <text x={-60} y={0} fontFamily="Kalam, cursive" fontWeight={700} fontSize={44} fill="#2A2418" opacity={reveal > 0.5 ? (reveal - 0.5) * 2 : 0.06}>RESET</text>
          <g opacity={1 - 0.75 * reveal}>
            {Array.from({ length: 9 }).map((_, k) => (
              <path key={k} d={`M ${-230 + k * 4} ${-30 + (k % 3) * 8} Q ${-100} ${k % 2 ? -50 : 10} ${30} ${-20 + k * 3} T ${230 - k * 5} ${-12 + (k % 4) * 6}`} stroke="#14121A" strokeWidth={9} fill="none" strokeLinecap="round" />
            ))}
          </g>
          <path d="M 120 -10 l 22 6 l -8 14 Z" fill="#6A5A3A" opacity={0.8} />
        </g>
      </g>
    )}
  </g>
);

/** The letters only you can see: CHEAT ACTIVATED and the cheat's name, glowing, with a scanline shimmer. `p` is the
 * clock since it came on (frames). `head` overrides the top line (GAME PAUSED). */
export const CheatText: React.FC<{ x: number; y: number; p: number; name?: string; s?: number; head?: string; color?: string; out?: number }> = ({ x, y, p, name, s = 1, head = 'CHEAT ACTIVATED', color = CHEAT.glow, out = 0 }) => {
  if (p < 0) return null;
  const pop = backOut(clamp(p / 8));
  const o = clamp(p / 4) * (1 - out);
  const flick = p < 10 ? (Math.floor(p) % 3 === 1 ? 0.5 : 1) : 1;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * pop})`} opacity={o * flick}>
      <rect x={-560} y={-110} width={1120} height={name ? 250 : 150} rx={22} fill="#06140F" opacity={0.55} />
      <rect x={-560} y={-110} width={1120} height={name ? 250 : 150} rx={22} fill="none" stroke={color} strokeWidth={5} opacity={0.8} />
      <text x={0} y={10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={700} fontSize={84} letterSpacing={8} fill={color} stroke="#03100C" strokeWidth={6} paintOrder="stroke">
        {head}
      </text>
      {name ? (
        <text x={0} y={110} textAnchor="middle" fontFamily={FONT.ui} fontSize={60} letterSpacing={12} fill="#F6FFF8" opacity={clamp((p - 8) / 6)}>
          {name}
        </text>
      ) : null}
      {/* scanlines */}
      {Array.from({ length: 8 }).map((_, k) => (
        <rect key={k} x={-560} y={-110 + ((k * 34 + p * 3) % (name ? 250 : 150))} width={1120} height={3} fill={color} opacity={0.12} />
      ))}
    </g>
  );
};

/** A hundred-dollar-style bill (ours: plain, green, a big 100 and a serial number). */
export const Bill: React.FC<{ x: number; y: number; s?: number; rot?: number; serial?: string; hiSerial?: number }> = ({ x, y, s = 1, rot = 0, serial = 'KB 40261187 C', hiSerial = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-300} y={-130} width={600} height={260} rx={10} fill="#CFE3C4" stroke="#2E5A3A" strokeWidth={6} />
    <rect x={-280} y={-110} width={560} height={220} rx={6} fill="none" stroke="#5E8A64" strokeWidth={4} />
    <ellipse cx={0} cy={0} rx={70} ry={86} fill="#B8D4AA" stroke="#5E8A64" strokeWidth={4} />
    <circle cx={0} cy={-14} r={30} fill="#8AB07E" />
    <path d="M -44 52 Q 0 20 44 52" fill="#8AB07E" />
    <text x={-250} y={-60} fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#2E5A3A">100</text>
    <text x={250} y={96} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill="#2E5A3A">100</text>
    {hiSerial > 0 ? <rect x={58} y={-104} width={226} height={40} rx={6} fill="#FFE27A" opacity={hiSerial} /> : null}
    <text x={272} y={-74} textAnchor="end" fontFamily={FONT.ui} fontSize={28} fill="#2A4A30">{serial}</text>
    <text x={-272} y={92} fontFamily={FONT.ui} fontSize={24} fill="#2A4A30">{serial}</text>
  </g>
);

/** A banded stack of bills, seen side-on. */
export const CashStack: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-80} y={-34} width={160} height={34} rx={4} fill="#BFD8B2" stroke="#2E5A3A" strokeWidth={4} />
    {[0, 1, 2, 3].map((k) => <path key={k} d={`M -78 ${-28 + k * 8} H 78`} stroke="#8AB07E" strokeWidth={2} />)}
    <rect x={-16} y={-36} width={32} height={38} fill="#F2E3A0" stroke="#8A7A3A" strokeWidth={3} />
  </g>
);

/** The sports bag the money cheat drops: open, stacks inside. */
export const MoneyBag: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={240} ry={22} fill="#000" opacity={0.3} />
    <path d="M -110 -150 Q 0 -230 110 -150" stroke="#1A1A22" strokeWidth={16} fill="none" />
    <path d="M -230 0 Q -250 -150 -150 -160 H 150 Q 250 -150 230 0 Z" fill="#C8382A" stroke="#12141E" strokeWidth={7} />
    <path d="M -236 -60 H 236" stroke="#E8E4D8" strokeWidth={10} opacity={0.6} />
    {open > 0 ? (
      <g opacity={open}>
        <path d="M -150 -160 Q 0 -120 150 -160" fill="#12141E" stroke="#12141E" strokeWidth={6} />
        {[-110, -40, 30, 100].map((cx, k) => <CashStack key={k} x={cx} y={-142 - (k % 2) * 10} s={0.55} rot={(k - 1.5) * 6} />)}
      </g>
    ) : null}
  </g>
);

/** A low two-door sports car from the side (generic wedge, no badge). Wheels on y. */
export const SportsCar: React.FC<{ x: number; y: number; s?: number; color?: string; flip?: boolean; shine?: number }> = ({ x, y, s = 1, color = '#E83A3A', flip = false, shine = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={8} rx={300} ry={18} fill="#000" opacity={0.35} />
    <path d="M -290 -24 L -292 -78 Q -280 -96 -230 -100 L -110 -108 Q -60 -170 20 -172 Q 110 -170 170 -120 L 270 -100 Q 300 -92 302 -60 L 300 -24 Z" fill={color} stroke="#0E0F14" strokeWidth={6} />
    <path d="M -84 -112 Q -40 -158 20 -160 L 26 -112 Z" fill="#1E2A3A" />
    <path d="M 40 -160 Q 100 -156 148 -116 L 40 -112 Z" fill="#1E2A3A" />
    {shine > 0 ? <path d="M -250 -88 Q -60 -104 250 -92" stroke="#FFFFFF" strokeWidth={8} opacity={0.35 * shine} fill="none" /> : null}
    <path d="M -200 -60 L 180 -60" stroke="#000" strokeOpacity={0.2} strokeWidth={5} />
    <path d="M 270 -84 L 300 -80 L 298 -66 L 268 -70 Z" fill="#FFF6C8" />
    <rect x={-294} y={-84} width={14} height={14} rx={3} fill="#C81A1A" />
    <path d="M -292 -100 L -250 -104 L -246 -92 L -290 -88 Z" fill="#14151C" />
    {[-190, 190].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-20} r={46} fill="#121218" />
        <circle cx={wx} cy={-20} r={26} fill="#B8BCC8" />
        {[0, 1, 2, 3, 4].map((k) => <path key={k} d={`M ${wx} ${-20} L ${wx + 24 * Math.cos(k * 1.256)} ${-20 + 24 * Math.sin(k * 1.256)}`} stroke="#5A5E6A" strokeWidth={5} />)}
      </g>
    ))}
  </g>
);

/** A flash where a thing appears out of thin air: a ring and rays. p: frames since. */
export const SpawnFlash: React.FC<{ x: number; y: number; p: number; r?: number; color?: string }> = ({ x, y, p, r = 300, color = '#FFFFFF' }) => {
  if (p < 0 || p > 18) return null;
  const k = p / 18;
  return (
    <g opacity={1 - k}>
      <Glow x={x} y={y} r={r * (0.6 + k)} o={1} />
      <circle cx={x} cy={y} r={r * (0.3 + k * 1.2)} fill="none" stroke={color} strokeWidth={14 * (1 - k)} />
      {Array.from({ length: 10 }).map((_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <path key={i} d={`M ${x + Math.cos(a) * r * 0.3 * (1 + k)} ${y + Math.sin(a) * r * 0.3 * (1 + k)} L ${x + Math.cos(a) * r * (0.6 + k)} ${y + Math.sin(a) * r * (0.6 + k)}`} stroke={color} strokeWidth={8} strokeLinecap="round" />;
      })}
    </g>
  );
};

/** The jetpack, drawn on a back: two silver tanks, a frame, flames under it. Place at the character's chest
 * (hip y - 120*scale) with the same scale. `flame` 0..1, `t` for flicker, `side` to show it behind (profile) or
 * the nozzles only (front). */
export const Jetpack: React.FC<{ x: number; y: number; s?: number; flame?: number; t?: number; rot?: number }> = ({ x, y, s = 1, flame = 1, t = 0, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    {flame > 0
      ? [-36, 36].map((nx, k) => {
          const len = (120 + 40 * Math.sin(t * 1.7 + k * 2) + 20 * rnd(k, Math.floor(t))) * flame;
          return (
            <g key={k}>
              <Glow x={nx} y={80 + len * 0.4} r={160 * flame} o={0.8} />
              <path d={`M ${nx - 22} 70 Q ${nx} ${70 + len * 1.1} ${nx + 22} 70 Z`} fill="#FF8A2A" />
              <path d={`M ${nx - 12} 70 Q ${nx} ${70 + len * 0.7} ${nx + 12} 70 Z`} fill="#FFE27A" />
            </g>
          );
        })
      : null}
    {[-36, 36].map((nx) => (
      <g key={nx}>
        <rect x={nx - 26} y={-80} width={52} height={140} rx={24} fill="#C8CCD6" stroke="#22242C" strokeWidth={5} />
        <rect x={nx - 18} y={-70} width={10} height={110} rx={5} fill="#FFFFFF" opacity={0.5} />
        <path d={`M ${nx - 20} 58 L ${nx - 24} 74 H ${nx + 24} L ${nx + 20} 58 Z`} fill="#3A3C46" stroke="#22242C" strokeWidth={4} />
      </g>
    ))}
    <rect x={-14} y={-60} width={28} height={100} rx={6} fill="#E84A3A" stroke="#22242C" strokeWidth={4} />
  </g>
);

/** A skateboard, side-on. */
export const Skateboard: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <path d="M -120 -24 Q -130 -40 -110 -36 H 110 Q 130 -40 120 -24 Z" fill="#E8504A" stroke="#1A1A22" strokeWidth={5} />
    {[-70, 70].map((wx) => <circle key={wx} cx={wx} cy={-10} r={13} fill="#F2E3A0" stroke="#1A1A22" strokeWidth={4} />)}
  </g>
);

/** A bird, wings open (frozen mid-flap when `t` stops). */
export const Bird: React.FC<{ x: number; y: number; s?: number; flap?: number }> = ({ x, y, s = 1, flap = 0 }) => {
  const w = Math.sin(flap) * 30;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M -90 ${-20 - w} Q -40 -40 0 0 Q 40 -40 90 ${-20 - w}`} stroke="#1A1A22" strokeWidth={12} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={4} rx={16} ry={10} fill="#1A1A22" />
    </g>
  );
};

/** A small helicopter silhouette with a spotlight. */
export const Helicopter: React.FC<{ x: number; y: number; s?: number; t: number; beam?: number; flip?: boolean }> = ({ x, y, s = 1, t, beam = 0, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    {beam > 0 ? <path d="M -10 30 L -260 900 L 240 900 Z" fill="#FFF6D8" opacity={0.18 * beam} /> : null}
    <ellipse cx={0} cy={0} rx={90} ry={50} fill="#1C1E26" />
    <path d="M 70 -10 L 260 -20 L 270 -60 L 250 -60 L 230 -30 L 70 -30 Z" fill="#1C1E26" />
    <path d="M -60 -20 Q -60 -40 -20 -40 L 10 -40 Q 30 -10 -10 10 Z" fill="#3A4A6A" />
    <path d="M -40 60 H 60 M -20 50 V 60 M 40 50 V 60" stroke="#1C1E26" strokeWidth={8} />
    <rect x={-6} y={-70} width={12} height={22} fill="#1C1E26" />
    <ellipse cx={0} cy={-70} rx={220 * Math.abs(Math.cos(t * 0.9))} ry={8} fill="#1C1E26" opacity={0.85} />
    <circle cx={-80} cy={20} r={8} fill={Math.floor(t / 8) % 2 ? '#FF4A4A' : '#5A1A1A'} />
  </g>
);

/** A white van with a satellite dish on the roof. Wheels on y. */
export const SatVan: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip = false }) => (
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
    <ellipse cx={0} cy={8} rx={280} ry={18} fill="#000" opacity={0.3} />
    <path d="M -270 -20 V -250 Q -270 -270 -250 -270 H 140 Q 180 -270 200 -220 L 260 -120 Q 272 -100 272 -70 V -20 Z" fill="#E8E8EE" stroke="#1A1A22" strokeWidth={6} />
    <path d="M 150 -250 L 200 -160 H 150 Z" fill="#2A3040" />
    <path d="M -240 -120 H 130" stroke="#1A1A22" strokeOpacity={0.2} strokeWidth={6} />
    <g transform="translate(-80 -280)">
      <rect x={-6} y={-30} width={12} height={30} fill="#3A3C46" />
      <path d="M -70 -40 Q 0 -110 70 -60 Z" fill="#F2F2F6" stroke="#1A1A22" strokeWidth={5} />
      <path d="M 0 -60 L 30 -110" stroke="#1A1A22" strokeWidth={4} />
    </g>
    {[-170, 170].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-16} r={40} fill="#16161C" />
        <circle cx={wx} cy={-16} r={18} fill="#8A8C98" />
      </g>
    ))}
  </g>
);

/** The power company's graph: a line along the top with three deep dips, drawn on as `p` goes 0..1. */
export const PowerGraph: React.FC<{ x: number; y: number; w?: number; h?: number; p: number; hi?: number }> = ({ x, y, w = 1200, h = 500, p, hi = 0 }) => {
  const n = 120;
  const dips = [0.22, 0.51, 0.78];
  const pts: string[] = [];
  for (let i = 0; i <= n * clamp(p); i++) {
    const u = i / n;
    let v = 0.82 + Math.sin(u * 40) * 0.025 + (rnd(4, i) - 0.5) * 0.03;
    dips.forEach((d) => {
      v -= 0.6 * Math.exp(-Math.pow((u - d) / 0.008, 2));
    });
    pts.push(`${x + u * w},${y + h - v * h}`);
  }
  return (
    <g>
      <rect x={x - 30} y={y - 30} width={w + 60} height={h + 80} rx={14} fill="#0E1626" stroke="#2A3A5A" strokeWidth={4} />
      {[0.25, 0.5, 0.75].map((g) => <path key={g} d={`M ${x} ${y + h * g} H ${x + w}`} stroke="#22304A" strokeWidth={3} />)}
      <polyline points={pts.join(' ')} fill="none" stroke="#5BD0FF" strokeWidth={6} strokeLinejoin="round" />
      {dips.map((d, i) =>
        p > d + 0.02 ? (
          <g key={i} opacity={clamp((p - d - 0.02) * 20) * (hi ? 1 : 0.9)}>
            <circle cx={x + d * w} cy={y + h - 0.22 * h} r={34} fill="none" stroke="#FF4A4A" strokeWidth={6} />
          </g>
        ) : null,
      )}
      <text x={x} y={y + h + 40} fontFamily={FONT.ui} fontSize={26} fill="#7E8DA6">MON        TUE        WED        THU        FRI</text>
    </g>
  );
};

/** A TV with a weather map: a town, a cloud band, and a clean round hole of sun over one town (`clear` 0..1). */
export const WeatherTV: React.FC<{ x: number; y: number; s?: number; clear: number; t: number }> = ({ x, y, s = 1, clear, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-420} y={-250} width={840} height={500} rx={20} fill="#16161C" />
    <rect x={-396} y={-226} width={792} height={452} fill="#3A7A4A" />
    <path d="M -396 60 Q -200 20 0 70 T 396 40 V 226 H -396 Z" fill="#2E6A3E" />
    <path d="M -396 -226 H 396 V -40 Q 200 -10 0 -40 T -396 -20 Z" fill="#4A8ACA" opacity={0.6} />
    {/* the cloud band */}
    <g opacity={0.92}>
      {Array.from({ length: 14 }).map((_, i) => (
        <circle key={i} cx={-380 + i * 60 + Math.sin(t / 30 + i) * 6} cy={-20 + (i % 3) * 30} r={70} fill="#D8DCE6" />
      ))}
    </g>
    {/* the hole over our town */}
    <circle cx={60} cy={10} r={120 * clear} fill="#3A7A4A" />
    {clear > 0.4 ? <g transform={`translate(60 10) scale(${clear})`}><circle r={44} fill="#FFD34A" /><text y={100} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#F6EFE3">YOUR TOWN</text></g> : null}
    <rect x={-396} y={170} width={792} height={56} fill="#C83A3A" />
    <text x={-370} y={208} fontFamily={FONT.ui} fontSize={30} fill="#FFFFFF">WEATHER  ·  RAIN ALL WEEK</text>
  </g>
);

/** The pause screen over a frozen world: a grey-blue wash, a thin frame, the two words. */
export const PauseScreen: React.FC<{ p: number }> = ({ p }) => {
  if (p < 0) return null;
  const o = clamp(p / 10);
  return (
    <g opacity={o}>
      <rect x={-200} y={-200} width={2400} height={1500} fill="#0A1420" opacity={0.35} />
      <rect x={60} y={60} width={1800} height={960} fill="none" stroke={CHEAT.glow} strokeWidth={4} opacity={0.5} />
    </g>
  );
};

/** A plain sky with soft clouds drifting and a little town far below: the jetpack's ground. */
export const SkySet: React.FC<{ t: number; id?: string; tod?: Tod; town?: number; drift?: number }> = ({ t, id = 'sky', tod = 'day', town = 1, drift = 1 }) => (
  <g>
    <DaySky id={`${id}d`} horizonY={900} tod={tod} />
    {town > 0 ? (
      <g opacity={town}>
        <rect x={-400} y={860} width={2800} height={700} fill="#6A8A5A" />
        {Array.from({ length: 40 }).map((_, i) => (
          <rect key={i} x={-380 + i * 70 + rnd(3, i) * 30} y={880 + rnd(4, i) * 120} width={40 + rnd(5, i) * 30} height={24 + rnd(6, i) * 20} fill={['#C98B6A', '#E2C79A', '#8FB0A8', '#D9A8A0', '#B8B8C8'][i % 5]} />
        ))}
        <path d="M -400 960 Q 600 900 2400 1000" stroke="#4A4A52" strokeWidth={14} fill="none" />
      </g>
    ) : null}
    {Array.from({ length: 9 }).map((_, i) => {
      const cx = ((rnd(7, i) * 3000 - t * (2 + rnd(8, i) * 3) * drift) % 3000 + 3000) % 3000 - 500;
      const cy = 120 + rnd(9, i) * 600;
      const r = 70 + rnd(10, i) * 60;
      return (
        <g key={i} opacity={0.9}>
          <circle cx={cx} cy={cy} r={r} fill="#FFFFFF" />
          <circle cx={cx + r * 0.9} cy={cy + 10} r={r * 0.75} fill="#FFFFFF" />
          <circle cx={cx - r * 0.9} cy={cy + 14} r={r * 0.7} fill="#F2F4FA" />
        </g>
      );
    })}
  </g>
);

/** Flames for a burning sleeve or a pan: a flickering tongue cluster at (x, y). */
export const Flames: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={-40} r={180} o={0.8} />
    {[-30, 0, 30].map((dx, k) => {
      const h = 90 + 30 * Math.sin(t * 0.9 + k * 2) + 10 * rnd(k, Math.floor(t / 2));
      return (
        <g key={k}>
          <path d={`M ${dx - 26} 0 Q ${dx - 30} ${-h * 0.5} ${dx + Math.sin(t / 3 + k) * 10} ${-h} Q ${dx + 30} ${-h * 0.5} ${dx + 26} 0 Z`} fill="#FF7A2A" />
          <path d={`M ${dx - 14} 0 Q ${dx - 16} ${-h * 0.35} ${dx + Math.sin(t / 3 + k) * 6} ${-h * 0.6} Q ${dx + 16} ${-h * 0.35} ${dx + 14} 0 Z`} fill="#FFE27A" />
        </g>
      );
    })}
  </g>
);

/** A grey smoke puff rising. */
export const Smoke: React.FC<{ x: number; y: number; t: number; n?: number }> = ({ x, y, t, n = 5 }) => (
  <g>
    {Array.from({ length: n }).map((_, i) => {
      const k = ((t * 0.6 + i * 14) % 70) / 70;
      return <circle key={i} cx={x + Math.sin(i * 2 + t / 20) * 30 * k} cy={y - k * 260} r={20 + k * 60} fill="#8A8890" opacity={0.5 * (1 - k)} />;
    })}
  </g>
);

export { kf };

/** Dead Man's Hill: a steep street falling from top left to bottom right, houses stepping down it, a warning sign.
 * hillY(x) is the road surface under x. */
export const hillY = (x: number) => 380 + (x + 200) * 0.42;
export const HillSet: React.FC<{ t: number; id?: string }> = ({ t, id = 'hill' }) => (
  <g>
    <DaySky id={`${id}s`} horizonY={700} tod="day" />
    <rect x={-400} y={700} width={2800} height={600} fill="#6A8A5A" />
    {Array.from({ length: 9 }).map((_, i) => {
      const x = -260 + i * 300;
      const g = hillY(x + 150) - 40;
      return (
        <g key={i}>
          <rect x={x} y={g - 260} width={260} height={260} fill={['#C98B6A', '#E2C79A', '#8FB0A8', '#D9A8A0', '#B8B8C8'][i % 5]} />
          <path d={`M ${x - 12} ${g - 260} L ${x + 130} ${g - 360} L ${x + 272} ${g - 260} Z`} fill={i % 2 ? '#5A3A3A' : '#4A4250'} />
          <rect x={x + 40} y={g - 210} width={70} height={70} fill="#6E8AA8" stroke="#F2EEE6" strokeWidth={6} />
          <rect x={x + 160} y={g - 140} width={60} height={140} fill="#3E5A7A" stroke="#F2EEE6" strokeWidth={6} />
        </g>
      );
    })}
    <path d={`M -400 ${hillY(-400) - 40} L 2400 ${hillY(2400) - 40} L 2400 1500 L -400 1500 Z`} fill="#9A949A" />
    <path d={`M -400 ${hillY(-400)} L 2400 ${hillY(2400)} L 2400 1500 L -400 1500 Z`} fill="#3E3E46" />
    {Array.from({ length: 14 }).map((_, k) => {
      const x = -300 + k * 200;
      return <path key={k} d={`M ${x} ${hillY(x) + 110} L ${x + 100} ${hillY(x + 100) + 110}`} stroke="#E8E4D8" strokeWidth={10} />;
    })}
    <g transform={`translate(260 ${hillY(260) - 50})`}>
      <rect x={-6} y={-230} width={12} height={230} fill="#3A3C46" />
      <path d="M 0 -330 L 90 -230 L -90 -230 Z" fill="#F2C14E" stroke="#2A2418" strokeWidth={6} />
      <text x={0} y={-252} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#2A2418">!</text>
      <rect x={-120} y={-215} width={240} height={50} fill="#F6EFE3" stroke="#2A2418" strokeWidth={4} />
      <text x={0} y={-180} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#2A2418">DEAD MAN'S HILL</text>
    </g>
  </g>
);

/** A hedge (a long rounded bush). */
export const Hedge: React.FC<{ x: number; y: number; w?: number; shake?: number }> = ({ x, y, w = 420, shake = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${shake})`}>
    <rect x={-w / 2} y={-150} width={w} height={150} rx={60} fill="#3E6A3A" />
    {Array.from({ length: 8 }).map((_, i) => <circle key={i} cx={-w / 2 + 30 + i * ((w - 60) / 7)} cy={-140 + (i % 2) * 14} r={44} fill="#4E7A4A" />)}
  </g>
);

/** A city bus from the side, faces pressed to the windows (`faces` 0..1 slides them in). Wheels on y. */
export const BusSide: React.FC<{ x: number; y: number; s?: number; faces?: number }> = ({ x, y, s = 1, faces = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={8} rx={480} ry={20} fill="#000" opacity={0.3} />
    <rect x={-480} y={-330} width={960} height={310} rx={30} fill="#E8B83A" stroke="#1A1A22" strokeWidth={7} />
    {Array.from({ length: 7 }).map((_, i) => (
      <g key={i}>
        <rect x={-440 + i * 125} y={-300} width={105} height={110} rx={10} fill="#A8C8E8" />
        <g opacity={faces}>
          <circle cx={-388 + i * 125} cy={-230 + (1 - faces) * 40} r={34} fill="#1A1620" />
          <circle cx={-398 + i * 125} cy={-236 + (1 - faces) * 40} r={7} fill="#FFFFFF" />
          <circle cx={-376 + i * 125} cy={-236 + (1 - faces) * 40} r={7} fill="#FFFFFF" />
          <ellipse cx={-388 + i * 125} cy={-214 + (1 - faces) * 40} rx={8} ry={10} fill="#FFFFFF" />
        </g>
      </g>
    ))}
    <rect x={-480} y={-160} width={960} height={20} fill="#C8382A" />
    {[-320, 300].map((wx) => (
      <g key={wx}>
        <circle cx={wx} cy={-20} r={46} fill="#16161C" />
        <circle cx={wx} cy={-20} r={20} fill="#8A8C98" />
      </g>
    ))}
  </g>
);

/** Rain streaks over the frame. */
export const Rain: React.FC<{ t: number; o?: number }> = ({ t, o = 1 }) => (
  <g opacity={o}>
    <rect x={-200} y={-200} width={2400} height={1500} fill="#2A3448" opacity={0.35} />
    {Array.from({ length: 120 }).map((_, i) => {
      const x = rnd(21, i) * 2100 - 100;
      const y = ((rnd(22, i) * 1200 + t * 40) % 1200) - 100;
      return <path key={i} d={`M ${x} ${y} l -12 50`} stroke="#C8D8F0" strokeWidth={3} opacity={0.6} />;
    })}
  </g>
);

/** A car key fob. */
export const KeyFob: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <circle cx={0} cy={-60} r={18} fill="none" stroke="#C8CCD6" strokeWidth={6} />
    <rect x={-32} y={-46} width={64} height={100} rx={22} fill="#1A1A22" />
    <circle cx={0} cy={-10} r={10} fill="#E83A3A" />
    <circle cx={0} cy={22} r={10} fill="#5A5E6A" />
  </g>
);
