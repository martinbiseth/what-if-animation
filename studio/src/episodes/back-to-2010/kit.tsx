import React from 'react';
import { FONT, clamp, kf, backOut, easeOut, lerp, rnd, Glow, SUBURB } from '../../engine';

// Props for "What if you went back to 2010 with $100?": the hundred dollar bill, bitcoins, the price chart, a 2010
// laptop with the forum, a chunky TV, a button phone, the briefcase of cash, Captain Buttons the teddy, the
// password note, the suit's card, a hard drive, the landfill, the bank letter and a "SOLD" house sign.

const INK = '#100E16';
const GREEN = '#7FAF7A';

/** A US hundred dollar bill: green-grey paper, the oval portrait (a generic face), 100 in the corners. */
export const HundredBill: React.FC<{ x: number; y: number; s?: number; rot?: number; crumple?: number; glow?: number }> = ({ x, y, s = 1, rot = 0, crumple = 0, glow = 0 }) => {
  const w = 520, h = 222;
  const k = crumple * 18;
  const edge = `M ${-w / 2} ${-h / 2 + k} L ${-w / 6} ${-h / 2 - k} L ${w / 6} ${-h / 2 + k * 0.6} L ${w / 2} ${-h / 2 - k * 0.4} L ${w / 2 - k * 0.5} ${h / 2 + k * 0.3} L ${w / 6} ${h / 2 - k} L ${-w / 6} ${h / 2 + k} L ${-w / 2 + k * 0.4} ${h / 2 - k * 0.5} Z`;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {glow > 0 ? <Glow x={0} y={0} r={360} kind="warm" o={0.5 * glow} /> : null}
      <path d={edge} fill="#C9D6B8" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <rect x={-w / 2 + 22} y={-h / 2 + 20} width={w - 44} height={h - 40} rx={10} fill="none" stroke="#6E8A68" strokeWidth={4} />
      <ellipse cx={0} cy={0} rx={62} ry={78} fill="#A9BC98" stroke="#5E7A58" strokeWidth={4} />
      <circle cx={0} cy={-14} r={26} fill="#6E8A68" />
      <path d="M -40 56 Q 0 14 40 56" fill="#6E8A68" />
      {[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([a, b], i) => (
        <text key={i} x={a * (w / 2 - 70)} y={b * (h / 2 - 50) + 16} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#3E5A3A">100</text>
      ))}
      <text x={-150} y={10} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#4E6A48">ONE HUNDRED</text>
      <text x={150} y={10} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#4E6A48">DOLLARS</text>
      {crumple > 0 ? <path d={`M ${-w / 3} ${-h / 2} L ${-w / 8} ${h / 2} M ${w / 5} ${-h / 2} L ${w / 3} ${h / 2}`} stroke="#8EA07E" strokeWidth={3} opacity={crumple} /> : null}
    </g>
  );
};

/** A gold coin with the ₿ mark, seen face on; `spin` 0..1 squashes it as it turns. */
export const Coin: React.FC<{ x: number; y: number; r?: number; spin?: number; rot?: number; dull?: number }> = ({ x, y, r = 80, spin = 0, rot = 0, dull = 0 }) => {
  const sx = Math.max(0.08, Math.abs(Math.cos(spin * Math.PI * 2)));
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${sx} 1)`}>
      <circle r={r} fill={dull ? '#8A7A5A' : '#F2A93A'} stroke={INK} strokeWidth={r * 0.08} />
      <circle r={r * 0.8} fill="none" stroke={dull ? '#6A5A3A' : '#FFD27A'} strokeWidth={r * 0.06} />
      <text y={r * 0.36} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={r * 1.05} fill={dull ? '#5A4A2A' : '#FFF4D6'} stroke={INK} strokeWidth={r * 0.04}>₿</text>
      {!dull ? <path d={`M ${-r * 0.55} ${-r * 0.45} Q ${-r * 0.2} ${-r * 0.75} ${r * 0.2} ${-r * 0.7}`} stroke="#FFF4D6" strokeWidth={r * 0.08} fill="none" strokeLinecap="round" opacity={0.8} /> : null}
    </g>
  );
};

/** A pile of coins, n of them, scattered in a heap around (x, y). */
export const CoinPile: React.FC<{ x: number; y: number; n: number; r?: number; seed?: number; spread?: number }> = ({ x, y, n, r = 46, seed = 3, spread = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const row = Math.floor(Math.sqrt(i));
      const cx = x + (rnd(seed, i) - 0.5) * (260 - row * 30) * spread;
      const cy = y - row * r * 0.55 + rnd(seed + 1, i) * 20;
      return <Coin key={i} x={cx} y={cy} r={r} spin={rnd(seed + 2, i) * 0.18} rot={(rnd(seed + 3, i) - 0.5) * 40} />;
    })}
  </g>
);

/** The price chart on a dark panel: points [[year, price]] on a log scale, drawn up to `p` (0..1). */
export const PriceChart: React.FC<{
  t: number; p: number; points: [number, number][]; x0?: number; x1?: number; y0?: number; y1?: number; years?: [number, number];
  logMax?: number; logMin?: number; marks?: { year: number; price: number; label: string; at: number; color?: string }[]; title?: string;
}> = ({ t, p, points, x0 = 260, x1 = 1680, y0 = 860, y1 = 220, years = [2010, 2025], logMin = -3, logMax = 5.2, marks = [], title }) => {
  const X = (yr: number) => lerp(x0, x1, (yr - years[0]) / (years[1] - years[0]));
  const Y = (pr: number) => lerp(y0, y1, (Math.log10(Math.max(pr, 1e-3)) - logMin) / (logMax - logMin));
  const n = Math.max(2, Math.ceil(points.length * p));
  const shown = points.slice(0, n);
  const last = shown[shown.length - 1];
  const d = shown.map(([a, b], i) => `${i ? 'L' : 'M'} ${X(a).toFixed(1)} ${Y(b).toFixed(1)}`).join(' ');
  return (
    <g>
      <rect width={1920} height={1080} fill="#0F1424" />
      {[-2, 0, 2, 4].map((e) => (
        <g key={e}>
          <line x1={x0} x2={x1} y1={Y(10 ** e)} y2={Y(10 ** e)} stroke="#26304A" strokeWidth={3} />
          <text x={x0 - 24} y={Y(10 ** e) + 12} textAnchor="end" fontFamily={FONT.ui} fontSize={30} fill="#6A7AA0">{e < 0 ? `$0.0${e === -2 ? '1' : '01'}` : `$${(10 ** e).toLocaleString('en-US')}`}</text>
        </g>
      ))}
      {[2010, 2014, 2018, 2022].filter((yr) => yr >= years[0] && yr <= years[1]).map((yr) => (
        <text key={yr} x={X(yr)} y={y0 + 60} textAnchor="middle" fontFamily={FONT.ui} fontSize={32} fill="#6A7AA0">{yr}</text>
      ))}
      {title ? <text x={x0} y={y1 - 70} fontFamily={FONT.ui} fontSize={40} letterSpacing={6} fill="#9AA8C8">{title}</text> : null}
      <path d={d} stroke="#F2A93A" strokeWidth={10} fill="none" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={X(last[0])} cy={Y(last[1])} r={16 + Math.sin(t / 4) * 3} fill="#FFD27A" stroke={INK} strokeWidth={4} />
      {marks.map((m, i) => {
        const o = clamp((t - m.at) / 6);
        if (o <= 0) return null;
        const c = m.color ?? '#F6EFE3';
        return (
          <g key={i} opacity={o} transform={`translate(${X(m.year)} ${Y(m.price)})`}>
            <circle r={14} fill={c} />
            <g transform={`scale(${backOut(o)})`}>
              <rect x={-m.label.length * 12 - 20} y={-110} width={m.label.length * 24 + 40} height={64} rx={14} fill="#0B0816" stroke={c} strokeWidth={4} />
              <text y={-66} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill={c}>{m.label}</text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

/** Real bitcoin prices (USD), for the chart: a coarse history, 2010 to 2025. */
export const BTC: [number, number][] = [
  [2010.3, 0.004], [2010.55, 0.06], [2010.9, 0.25], [2011.1, 1], [2011.44, 31], [2011.47, 15], [2011.8, 3], [2012.0, 5], [2012.7, 12],
  [2013.3, 130], [2013.6, 90], [2013.92, 1100], [2014.2, 500], [2015.0, 220], [2016.0, 430], [2016.9, 900], [2017.5, 2500],
  [2017.96, 19500], [2018.5, 6500], [2018.96, 3200], [2019.5, 11000], [2020.2, 5000], [2020.9, 19000], [2021.3, 60000],
  [2021.55, 30000], [2021.86, 68000], [2022.5, 20000], [2022.9, 16000], [2023.5, 30000], [2024.2, 70000], [2024.6, 58000],
  [2024.93, 100000], [2025.2, 85000], [2025.77, 124000],
];

/** A thick 2010 laptop, open, seen from the front, with something on its screen. */
export const OldLaptop: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode; glow?: number }> = ({ x, y, s = 1, children, glow = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow ? <Glow x={0} y={-200} r={420} kind="cool" o={0.35 * glow} /> : null}
    <rect x={-300} y={-420} width={600} height={400} rx={22} fill="#2A2A30" stroke={INK} strokeWidth={8} />
    <rect x={-268} y={-390} width={536} height={340} fill="#E8ECF4" />
    <svg x={-268} y={-390} width={536} height={340} viewBox="0 0 536 340">{children}</svg>
    <path d="M -340 -20 L 340 -20 L 380 40 L -380 40 Z" fill="#3A3A42" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <rect x={-80} y={4} width={160} height={22} rx={6} fill="#2A2A30" />
  </g>
);

/** The forum page of 2010 on the laptop: a grey table of posts, one highlighted. */
export const ForumScreen: React.FC<{ hot?: string; posts?: string[]; t?: number }> = ({ hot, posts = ['Pizza for bitcoins?', 'Selling 10,000 BTC', 'Is this thing worth anything?', 'New to bitcoin, help'], t = 0 }) => (
  <g>
    <rect width={536} height={46} fill="#5A6A8A" />
    <text x={16} y={31} fontFamily={FONT.ui} fontSize={22} fill="#F6EFE3">bitcoin forum · 2010</text>
    {posts.map((p, i) => (
      <g key={i}>
        <rect x={10} y={60 + i * 66} width={516} height={56} fill={p === hot ? '#FFE9A8' : i % 2 ? '#F2F4F8' : '#DDE2EC'} stroke={p === hot ? '#E8A83A' : 'none'} strokeWidth={4} />
        <text x={24} y={96 + i * 66} fontFamily={FONT.ui} fontSize={22} fill="#1A2A4A">{p}</text>
      </g>
    ))}
    {hot ? <rect x={460} y={74 + posts.indexOf(hot) * 66} width={50} height={28} rx={6} fill="#E8503A" opacity={Math.sin(t / 3) > 0 ? 1 : 0.5} /> : null}
  </g>
);

/** A wallet screen: big balance. */
export const WalletScreen: React.FC<{ coins: string; usd?: string; note?: string }> = ({ coins, usd, note }) => (
  <g>
    <rect width={536} height={340} fill="#1A2238" />
    <text x={268} y={60} textAnchor="middle" fontFamily={FONT.ui} fontSize={24} fill="#8A9ABF">WALLET</text>
    <text x={268} y={160} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#F2A93A">{coins}</text>
    {usd ? <text x={268} y={230} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={48} fill="#7FE08A">{usd}</text> : null}
    {note ? <text x={268} y={300} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#C8D0E8">{note}</text> : null}
  </g>
);

/** A chunky 2010 flat TV on a stand; `children` draws in a 640x360 screen. */
export const FlatTV: React.FC<{ x: number; y: number; s?: number; children?: React.ReactNode }> = ({ x, y, s = 1, children }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Glow x={0} y={-220} r={500} kind="cool" o={0.3} />
    <rect x={-360} y={-440} width={720} height={430} rx={18} fill="#1A1A22" stroke={INK} strokeWidth={8} />
    <svg x={-320} y={-405} width={640} height={360} viewBox="0 0 640 360">
      <rect width={640} height={360} fill="#2A3A5A" />
      {children}
    </svg>
    <rect x={-40} y={-10} width={80} height={40} fill="#2A2A30" />
    <rect x={-160} y={28} width={320} height={22} rx={10} fill="#2A2A30" stroke={INK} strokeWidth={5} />
  </g>
);

/** On the TV: a news ticker and a big headline over a picture. */
export const NewsScreen: React.FC<{ head: string; ticker?: string; t: number; pic?: React.ReactNode }> = ({ head, ticker = 'BREAKING NEWS', t, pic }) => (
  <g>
    {pic}
    <rect y={250} width={640} height={70} fill="#C8283A" />
    <text x={20} y={298} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FFF">{head}</text>
    <rect y={320} width={640} height={40} fill="#0B0816" />
    <text x={640 - ((t * 6) % 1400)} y={348} fontFamily={FONT.ui} fontSize={24} fill="#FFD86A">{`${ticker}  ·  ${ticker}  ·  ${ticker}`}</text>
  </g>
);

/** A 2010 smartphone silhouette for the TV ad: thin glass slab with a steel band. */
export const PhoneAd: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={640} height={360} fill="#F4F4F6" />
    <g transform={`translate(320 175) rotate(${Math.sin(t / 30) * 6})`}>
      <rect x={-70} y={-140} width={140} height={280} rx={18} fill="#16161C" stroke="#B8BCC8" strokeWidth={8} />
      <rect x={-56} y={-110} width={112} height={200} fill="#3A6AB8" />
      <circle cx={0} cy={118} r={10} fill="none" stroke="#6A6A72" strokeWidth={3} />
    </g>
    <text x={500} y={150} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} fill="#16161C">NEW</text>
    <text x={500} y={210} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill="#6A6A72">June 2010</text>
  </g>
);

/** A football final on TV: the pitch, a ball in the net, and the clock. */
export const FootballScreen: React.FC<{ t: number; minute?: string; goal?: number; score?: string }> = ({ t, minute = "116'", goal = 0, score = '0 - 0' }) => (
  <g>
    <rect width={640} height={360} fill="#3E8A4A" />
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={i * 120 - 20} width={60} height={360} fill="#468F52" />)}
    <rect x={430} y={90} width={180} height={150} fill="none" stroke="#F6EFE3" strokeWidth={6} />
    <path d="M 430 90 L 470 120 L 610 120 M 470 120 L 470 240" stroke="#DDE" strokeWidth={3} fill="none" />
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={470 + i * 18} y1={120} x2={470 + i * 18} y2={240} stroke="#E8ECF4" strokeWidth={1.5} opacity={0.6} />)}
    <circle cx={lerp(200, 540, easeOut(goal))} cy={lerp(250, 180, easeOut(goal))} r={16} fill="#F6EFE3" stroke={INK} strokeWidth={3} />
    <rect x={14} y={14} width={220} height={50} rx={8} fill="#0B0816" opacity={0.8} />
    <text x={30} y={50} fontFamily={FONT.ui} fontSize={30} fill="#F6EFE3">{`${score}  ${minute}`}</text>
    {goal >= 1 ? <text x={320} y={330} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#FFD86A" stroke={INK} strokeWidth={6} paintOrder="stroke" opacity={Math.sin(t / 3) > -0.3 ? 1 : 0.6}>GOAL!</text> : null}
  </g>
);

/** A button phone of 2010 (keypad, small screen). */
export const ButtonPhone: React.FC<{ x: number; y: number; s?: number; rot?: number; text?: string }> = ({ x, y, s = 1, rot = 0, text = '12:00' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-70} y={-150} width={140} height={300} rx={26} fill="#3A3A46" stroke={INK} strokeWidth={6} />
    <rect x={-52} y={-126} width={104} height={90} rx={6} fill="#9ACCA8" />
    <text x={0} y={-72} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#1A3A2A">{text}</text>
    {Array.from({ length: 12 }, (_, i) => (
      <rect key={i} x={-50 + (i % 3) * 36} y={-14 + Math.floor(i / 3) * 34} width={28} height={24} rx={6} fill="#C8CCD6" />
    ))}
  </g>
);

/** The wall calendar, big: month and year. */
export const BigCalendar: React.FC<{ x: number; y: number; s?: number; month?: string; year?: string; ring?: number; rot?: number }> = ({ x, y, s = 1, month = 'MAY', year = '2010', ring, rot = -2 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-210} y={-260} width={420} height={520} rx={12} fill="#F6EFE3" stroke={INK} strokeWidth={8} />
    <rect x={-210} y={-260} width={420} height={150} rx={12} fill="#C8283A" />
    <text x={0} y={-168} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFF">{month}</text>
    <text x={0} y={-126} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#FFE0E0">{year}</text>
    {Array.from({ length: 35 }, (_, i) => (
      <g key={i}>
        <rect x={-180 + (i % 7) * 52} y={-80 + Math.floor(i / 7) * 62} width={44} height={50} fill={i + 1 === ring ? '#FFE27A' : '#E8E0D2'} />
        {i < 31 ? <text x={-158 + (i % 7) * 52} y={-46 + Math.floor(i / 7) * 62} textAnchor="middle" fontFamily={FONT.ui} fontSize={20} fill="#5A4A4A">{i + 1}</text> : null}
      </g>
    ))}
    {ring ? <circle cx={-158 + ((ring - 1) % 7) * 52} cy={-55 + Math.floor((ring - 1) / 7) * 62} r={34} fill="none" stroke="#C8283A" strokeWidth={6} /> : null}
    <circle cx={-120} cy={-262} r={14} fill="#3A3A46" />
    <circle cx={120} cy={-262} r={14} fill="#3A3A46" />
  </g>
);

/** A briefcase, lid opening (open 0..1), full of banded cash. */
export const Briefcase: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 0 }) => {
  const lid = 260 * open;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <rect x={-320} y={-40} width={640} height={220} rx={16} fill="#2A2026" stroke={INK} strokeWidth={8} />
      {open > 0.1 ? (
        <g>
          <rect x={-290} y={-30} width={580} height={150} fill="#3A2A30" />
          {Array.from({ length: 10 }, (_, i) => (
            <g key={i} transform={`translate(${-250 + (i % 5) * 112} ${-20 + Math.floor(i / 5) * 70})`}>
              <rect width={100} height={60} rx={4} fill="#A9C098" stroke="#4E6A48" strokeWidth={3} />
              <rect x={38} width={24} height={60} fill="#E8D8A8" />
              <text x={14} y={38} fontFamily={FONT.title} fontWeight={800} fontSize={20} fill="#3E5A3A">100</text>
            </g>
          ))}
          <Glow x={0} y={30} r={300} kind="warm" o={0.35 * open} />
        </g>
      ) : null}
      <path d={`M -320 -40 L 320 -40 L 320 ${-40 - lid} L -320 ${-40 - lid} Z`} fill="#3A2C34" stroke={INK} strokeWidth={8} opacity={open > 0.05 ? 1 : 0} />
      <rect x={-70} y={-80} width={140} height={40} rx={14} fill="none" stroke="#1A1218" strokeWidth={14} opacity={open < 0.05 ? 1 : 0} />
      <rect x={-200} y={-50} width={30} height={22} fill="#C8A84A" />
      <rect x={170} y={-50} width={30} height={22} fill="#C8A84A" />
    </g>
  );
};

/** Captain Buttons: a brown teddy with two button eyes (or one, old). `old` fades and patches it. */
export const Teddy: React.FC<{ x: number; y: number; s?: number; rot?: number; old?: number; seam?: number }> = ({ x, y, s = 1, rot = 0, old = 0, seam = 0 }) => {
  const fur = old ? '#9A8064' : '#B07A4A';
  const dark = old ? '#7A644E' : '#8A5A34';
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <ellipse cx={0} cy={120} rx={130} ry={150} fill={fur} stroke={INK} strokeWidth={8} />
      <ellipse cx={0} cy={140} rx={70} ry={90} fill={old ? '#B8A48A' : '#D8B08A'} />
      <ellipse cx={-130} cy={110} rx={46} ry={70} fill={fur} stroke={INK} strokeWidth={7} transform="rotate(30 -130 110)" />
      <ellipse cx={130} cy={110} rx={46} ry={70} fill={fur} stroke={INK} strokeWidth={7} transform="rotate(-30 130 110)" />
      <ellipse cx={-80} cy={250} rx={56} ry={44} fill={fur} stroke={INK} strokeWidth={7} />
      <ellipse cx={80} cy={250} rx={56} ry={44} fill={fur} stroke={INK} strokeWidth={7} />
      <circle cx={-90} cy={-120} r={46} fill={fur} stroke={INK} strokeWidth={7} />
      <circle cx={90} cy={-120} r={46} fill={fur} stroke={INK} strokeWidth={7} />
      <circle cx={-90} cy={-120} r={22} fill={dark} />
      <circle cx={90} cy={-120} r={22} fill={dark} />
      <circle cx={0} cy={-50} r={110} fill={fur} stroke={INK} strokeWidth={8} />
      <ellipse cx={0} cy={-14} rx={52} ry={40} fill={old ? '#B8A48A' : '#D8B08A'} />
      <ellipse cx={0} cy={-30} rx={18} ry={13} fill={INK} />
      <path d="M -18 0 Q 0 14 18 0" stroke={INK} strokeWidth={5} fill="none" />
      {/* button eyes */}
      <g>
        <circle cx={-40} cy={-74} r={18} fill="#3A6AB8" stroke={INK} strokeWidth={4} />
        <circle cx={-46} cy={-78} r={3} fill={INK} /><circle cx={-34} cy={-70} r={3} fill={INK} />
      </g>
      {old ? (
        <path d="M 30 -84 L 50 -64 M 50 -84 L 30 -64" stroke={INK} strokeWidth={5} />
      ) : (
        <g>
          <circle cx={40} cy={-74} r={18} fill="#E8503A" stroke={INK} strokeWidth={4} />
          <circle cx={34} cy={-78} r={3} fill={INK} /><circle cx={46} cy={-70} r={3} fill={INK} />
        </g>
      )}
      {old ? <rect x={-100} y={70} width={60} height={50} fill="#6A8AB0" stroke={INK} strokeWidth={4} transform="rotate(-12 -70 95)" /> : null}
      {seam > 0 ? (
        <path d={`M 0 60 L 0 ${60 + 120 * seam}`} stroke="#F6EFE3" strokeWidth={5} strokeDasharray="10 8" />
      ) : null}
    </g>
  );
};

/** The password, written on a small paper, folded (fold 0 = flat, 1 = folded small). */
export const PasswordNote: React.FC<{ x: number; y: number; s?: number; rot?: number; fold?: number; text?: string[] }> = ({ x, y, s = 1, rot = 0, fold = 0, text = ['wallet key:', '5Kb8kLf9zgWQnog', 'idTDhqJ2ZtHzD...'] }) => {
  const w = lerp(420, 120, fold), h = lerp(300, 90, fold);
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#FBF6E8" stroke={INK} strokeWidth={5} />
      {fold < 0.4 ? text.map((l, i) => (
        <text key={i} x={-w / 2 + 24} y={-h / 2 + 70 + i * 70} fontFamily={FONT.hand} fontWeight={700} fontSize={i ? 36 : 40} fill={i ? '#1A2A6A' : '#5A4A4A'} opacity={1 - fold * 2.5}>{l}</text>
      )) : <path d={`M ${-w / 2} 0 L ${w / 2} 0 M 0 ${-h / 2} L 0 ${h / 2}`} stroke="#C8C0A8" strokeWidth={3} />}
    </g>
  );
};

/** A plain white card: just a phone number and a date. */
export const SuitCard: React.FC<{ x: number; y: number; s?: number; rot?: number; date?: string }> = ({ x, y, s = 1, rot = 0, date = '20 JUNE' }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-230} y={-130} width={460} height={260} rx={10} fill="#F8F8FA" stroke={INK} strokeWidth={6} />
    <text x={0} y={-10} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#1A1A22">555-0142</text>
    <text x={0} y={70} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} fill="#C8283A">{date}</text>
  </g>
);

/** An old hard drive: the metal case, label, a little scuffed. */
export const HardDrive: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-150} y={-210} width={300} height={420} rx={14} fill="#9AA0AA" stroke={INK} strokeWidth={7} />
    <circle cx={0} cy={-40} r={110} fill="#B8BEC8" stroke="#6A707A" strokeWidth={5} />
    <circle cx={0} cy={-40} r={20} fill="#6A707A" />
    <rect x={-110} y={100} width={220} height={80} fill="#F6EFE3" stroke="#6A707A" strokeWidth={3} />
    <text x={0} y={150} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#3A3A46">8,000 BTC</text>
  </g>
);

/** A landfill: grey-brown heaps, gulls, a bulldozer silhouette. */
export const Landfill: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#9AB0C8" />
    <rect y={0} width={1920} height={420} fill="#B8C8D8" />
    {[[200, 620, 520], [760, 560, 640], [1400, 600, 600]].map(([cx, cy, w], i) => (
      <path key={i} d={`M ${cx - w / 2 - 200} 1080 Q ${cx} ${cy - 200} ${cx + w / 2 + 200} 1080 Z`} fill={['#7A6A5A', '#6A5E52', '#857464'][i]} stroke={INK} strokeWidth={6} />
    ))}
    {Array.from({ length: 40 }, (_, i) => (
      <rect key={i} x={rnd(4, i) * 1900} y={700 + rnd(5, i) * 360} width={20 + rnd(6, i) * 40} height={14 + rnd(7, i) * 24} fill={['#C8283A', '#3A6AB8', '#E8C04A', '#F6EFE3', '#5A8A5A'][i % 5]} opacity={0.7} transform={`rotate(${rnd(8, i) * 90} ${rnd(4, i) * 1900} ${700 + rnd(5, i) * 360})`} />
    ))}
    {[0, 1, 2].map((i) => {
      const gx = (t * (3 + i) + i * 600) % 2200 - 140, gy = 220 + i * 60 + Math.sin(t / 6 + i) * 20;
      return <path key={i} d={`M ${gx - 30} ${gy} Q ${gx - 15} ${gy - 18 * Math.abs(Math.sin(t / 3 + i))} ${gx} ${gy} Q ${gx + 15} ${gy - 18 * Math.abs(Math.sin(t / 3 + i))} ${gx + 30} ${gy}`} stroke={INK} strokeWidth={5} fill="none" />;
    })}
    <g transform="translate(1500 600)">
      <rect x={-120} y={-80} width={200} height={90} fill="#E8A83A" stroke={INK} strokeWidth={6} />
      <rect x={-60} y={-150} width={100} height={80} fill="#E8A83A" stroke={INK} strokeWidth={6} />
      <rect x={-220} y={-20} width={90} height={60} fill="#5A5A62" stroke={INK} strokeWidth={6} />
      <rect x={-130} y={10} width={240} height={40} rx={20} fill="#3A3A42" stroke={INK} strokeWidth={6} />
    </g>
  </g>
);

/** The bank's letter: FINAL NOTICE in red. */
export const BankLetter: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-260} y={-340} width={520} height={680} fill="#FBFBF8" stroke={INK} strokeWidth={6} />
    <text x={-200} y={-250} fontFamily={FONT.ui} fontSize={30} fill="#3A3A46">FIRST CITY BANK</text>
    <text x={0} y={-130} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={66} fill="#C8283A">FINAL NOTICE</text>
    {[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={-200} y={-60 + i * 50} width={i === 5 ? 220 : 400} height={14} rx={7} fill="#C8C8D0" />)}
    <text x={0} y={290} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#3A3A46">FORECLOSURE</text>
  </g>
);

/** A sign on a post in a front garden. */
export const YardSign: React.FC<{ x: number; y: number; s?: number; text?: string; color?: string; rot?: number }> = ({ x, y, s = 1, text = 'BANK OWNED', color = '#C8283A', rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-10} y={-260} width={20} height={260} fill="#8A6A4A" stroke={INK} strokeWidth={5} />
    <rect x={-200} y={-300} width={400} height={150} rx={8} fill="#F6EFE3" stroke={INK} strokeWidth={7} />
    <text x={0} y={-205} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={text.length > 10 ? 52 : 64} fill={color}>{text}</text>
  </g>
);

/** The chip top right: the date and what the coins are worth (the episode's clock). */
export const yearHud = (date: string, value?: string, hideUntil = 18): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
    if (f < hideUntil) return null;
    const pop = clamp((f - hideUntil) / 8);
    const txt = value ? `${date} · ${value}` : date;
    const w = 120 + txt.length * 27;
    return (
      <g transform={`translate(${1860 - w} 70)`} opacity={pop}>
        <rect x={0} y={0} width={w} height={86} rx={43} fill="#0B0816" opacity={0.65} />
        <circle cx={50} cy={43} r={24} fill="#F2A93A" stroke="#100E16" strokeWidth={3} />
        <text x={50} y={54} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={30} fill="#FFF4D6">₿</text>
        <text x={92} y={57} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#F6EFE3">{txt}</text>
      </g>
    );
  };
  return Hud;
};

export const kerbY = SUBURB.feet;
