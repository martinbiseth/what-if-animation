import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, LOOKS, FONT, KitDefs, SetDefs } from '../../engine';

// Channel art for "Ancient For A Day": the profile picture (800x800) and the banner (2560x1440, everything that
// must be read sits inside YouTube's 1546x423 safe area in the middle). Same hero as the What If channel: the
// dark face and orange hoodie, now dropped into the ancient world.

const YOU = LOOKS.you;
const INK = '#0B0816';
const GOLD = '#FFD23A';

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode; anchor?: 'start' | 'middle' | 'end'; stroke?: number }> = ({ x, y, size, fill, children, anchor = 'start', stroke = 0.13 }) => (
  <text x={x} y={y} textAnchor={anchor} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke={INK} strokeWidth={size * stroke} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

// ---------- era silhouettes, each drawn standing on y = 0 ----------
const Pyramid: React.FC<{ s?: number; fill: string }> = ({ s = 1, fill }) => (
  <g transform={`scale(${s})`}>
    <path d="M -260 0 L 0 -250 L 260 0 Z" fill={fill} />
    <path d="M 0 -250 L 260 0 L 90 0 Z" fill="#000" opacity={0.18} />
  </g>
);
const Mammoth: React.FC<{ s?: number; fill: string }> = ({ s = 1, fill }) => (
  <g transform={`scale(${s})`} fill={fill}>
    <ellipse cx={0} cy={-120} rx={150} ry={95} />
    <circle cx={120} cy={-170} r={70} />
    <circle cx={60} cy={-215} r={45} />
    {[-110, -55, 45, 100].map((x) => <rect key={x} x={x - 22} y={-90} width={44} height={90} rx={10} />)}
    <path d="M 175 -150 Q 215 -80 190 -10 L 170 -10 Q 185 -80 150 -130 Z" />
    <path d="M 160 -120 Q 250 -110 255 -190" stroke={fill} strokeWidth={14} fill="none" strokeLinecap="round" />
    <path d="M -150 -120 Q -175 -90 -165 -60" stroke={fill} strokeWidth={10} fill="none" strokeLinecap="round" />
  </g>
);
const Columns: React.FC<{ s?: number; fill: string }> = ({ s = 1, fill }) => (
  <g transform={`scale(${s})`} fill={fill}>
    <path d="M -230 -250 L 0 -330 L 230 -250 Z" />
    <rect x={-240} y={-250} width={480} height={26} />
    {[-190, -95, 0, 95, 190].map((x) => <rect key={x} x={x - 22} y={-224} width={44} height={200} />)}
    <rect x={-250} y={-24} width={500} height={24} />
  </g>
);
const Stones: React.FC<{ s?: number; fill: string }> = ({ s = 1, fill }) => (
  <g transform={`scale(${s})`} fill={fill}>
    <rect x={-210} y={-170} width={60} height={170} rx={6} />
    <rect x={-90} y={-190} width={64} height={190} rx={6} />
    <rect x={30} y={-190} width={64} height={190} rx={6} />
    <rect x={-100} y={-226} width={204} height={44} rx={6} />
    <rect x={150} y={-150} width={58} height={150} rx={6} />
  </g>
);

/** A sky and a ground at a given size, the sun behind the hero, and the silhouette skyline. */
const Backdrop: React.FC<{ w: number; h: number; horizon: number; sunX: number; sunY: number; sunR: number; id: string }> = ({ w, h, horizon, sunX, sunY, sunR, id }) => (
  <g>
    <defs>
      <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#3A1E4E" />
        <stop offset="0.55" stopColor="#C2502C" />
        <stop offset="1" stopColor="#F5A13A" />
      </linearGradient>
      <radialGradient id={`${id}sun`}>
        <stop offset="0" stopColor="#FFF4C2" />
        <stop offset="0.6" stopColor={GOLD} />
        <stop offset="1" stopColor="#FFB02E" />
      </radialGradient>
      <radialGradient id={`${id}halo`}>
        <stop offset="0" stopColor="#FFE38A" stopOpacity={0.7} />
        <stop offset="1" stopColor="#FFE38A" stopOpacity={0} />
      </radialGradient>
    </defs>
    <rect width={w} height={h} fill={`url(#${id}sky)`} />
    <circle cx={sunX} cy={sunY} r={sunR * 1.9} fill={`url(#${id}halo)`} />
    <circle cx={sunX} cy={sunY} r={sunR} fill={`url(#${id}sun)`} stroke={INK} strokeWidth={sunR * 0.035} />
    <rect y={horizon} width={w} height={h - horizon} fill="#2A1430" />
  </g>
);

const heroPose = (p: Partial<Pose>): Pose => ({ ...basePose, x: 0, y: 0, blink: 0, glint: 1, glintColor: '#FFE38A', ...p });

// ---------- the profile picture: 800 x 800, read at 98 px and in a circle ----------
export const AncientLogo: React.FC = () => {
  const me = heroPose({ expr: 'shock', look: 0, yaw: 0, headTilt: -4 });
  return (
    <AbsoluteFill style={{ background: '#2A1430' }}>
      <svg width={800} height={800} viewBox="0 0 800 800">
        <KitDefs />
        <SetDefs />
        <Backdrop w={800} h={800} horizon={690} sunX={400} sunY={330} sunR={250} id="lg" />
        <g transform="translate(150 700)"><Pyramid s={0.75} fill="#2A1430" /></g>
        <g transform="translate(680 700)"><Pyramid s={0.5} fill="#2A1430" /></g>
        {/* the hero, head and shoulders, filling the circle */}
        <g transform="translate(400 1040) scale(3.25)">
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ---------- the banner: 2560 x 1440, safe area x 507..2053, y 508..931 ----------
export const AncientBanner: React.FC = () => {
  const me = heroPose({ expr: 'shock', look: 0.6, yaw: 0.2, armL: { a: 150, b: 20 }, armR: { a: 40, b: -30 }, headTilt: 6 });
  const H = 1000; // horizon, just under the safe area
  const sil = '#2A1430';
  return (
    <AbsoluteFill style={{ background: '#2A1430' }}>
      <svg width={2560} height={1440} viewBox="0 0 2560 1440">
        <KitDefs />
        <SetDefs />
        <Backdrop w={2560} h={1440} horizon={H} sunX={760} sunY={720} sunR={250} id="bn" />
        {/* the ancient world on the skyline: stone age, Egypt, Rome, Vikings */}
        <g opacity={0.95}>
          <g transform={`translate(260 ${H})`}><Mammoth s={1.15} fill={sil} /></g>
          <g transform={`translate(1240 ${H})`}><Pyramid s={0.55} fill={sil} /></g>
          <g transform={`translate(1520 ${H})`}><Pyramid s={0.38} fill={sil} /></g>
          <g transform={`translate(2210 ${H})`}><Columns s={1.05} fill={sil} /></g>
          <g transform={`translate(2470 ${H + 10})`}><Stones s={0.7} fill={sil} /></g>
        </g>
        {/* the hero, in front of the sun, inside the safe area */}
        <g transform={`translate(760 ${H + 120}) scale(2.2)`}>
          <Hero look={YOU} pose={me} shadow={0} />
        </g>
        {/* title and promise */}
        <T x={1010} y={700} size={150} fill="#FFFFFF">ANCIENT</T>
        <T x={1010} y={840} size={150} fill={GOLD}>FOR A DAY</T>
        <text x={1016} y={900} fontFamily={FONT.title} fontWeight={700} fontSize={38} fill="#FFF4E0" stroke={INK} strokeWidth={8} strokeLinejoin="round" paintOrder="stroke">
          One normal guy. One ancient day. Can he survive it?
        </text>
        {/* the upload promise, a small badge top right of the safe area */}
        <g transform="translate(1800 575) rotate(6)">
          <rect x={-230} y={-42} width={460} height={84} rx={24} fill="#E8252A" stroke={INK} strokeWidth={8} />
          <T x={0} y={15} size={40} fill="#FFFFFF" anchor="middle" stroke={0.08}>NEW EVERY WEEK</T>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
