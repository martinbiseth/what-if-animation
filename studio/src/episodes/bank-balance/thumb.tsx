import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Hero, Pose, basePose, Glow, FONT, ShotFrame, LOOKS, Look, BalanceTag, MONEY } from '../../engine';

// Thumbnail for "What If You Could See Everyone's Bank Balance?": you, a huge close-up in shock, eyes glowing green;
// a rich-looking woman with a gold bag beside you, and over her head a giant red "-$61,240". Text: "YOUR MONEY",
// MONEY in yellow.

const T: React.FC<{ x: number; y: number; size: number; fill: string; children: React.ReactNode }> = ({ x, y, size, fill, children }) => (
  <text x={x} y={y} fontFamily={FONT.title} fontWeight={800} fontSize={size} fill={fill} stroke="#0B0816" strokeWidth={size * 0.13} strokeLinejoin="round" paintOrder="stroke">
    {children}
  </text>
);

const RICH: Look = { ...LOOKS.lady, jacket: '#E84A8A', jacketShade: '#C03A72', accent: '#FFD34A', hat: undefined, hatColor: undefined };

/** Coins and notes raining softly behind, for colour. */
const Notes: React.FC = () => {
  const out: React.ReactNode[] = [];
  for (let i = 0; i < 22; i++) {
    const r = (k: number) => Math.abs(Math.sin(i * 12.9898 + k * 78.233) * 43758.5453) % 1;
    const x = r(1) * 1920;
    const y = r(2) * 1080;
    const rot = r(3) * 80 - 40;
    out.push(
      <g key={i} transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.6 + r(4) * 0.6})`} opacity={0.55}>
        <rect x={-70} y={-34} width={140} height={68} rx={8} fill="#5FBF7A" stroke="#2E7A48" strokeWidth={5} />
        <circle r={20} fill="none" stroke="#2E7A48" strokeWidth={5} />
        <text y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={32} fill="#2E7A48">$</text>
      </g>,
    );
  }
  return <g filter="url(#blur6)">{out}</g>;
};

export const BankBalanceThumb: React.FC = () => {
  const me: Pose = { ...basePose, x: 0, y: 0, yaw: -0.35, expr: 'shock', headTilt: -4, look: -0.8, blink: 0, glint: 1, glintColor: MONEY.green, armL: { a: 20, b: -10 }, armR: { a: 20, b: -10 } };
  const her: Pose = { ...basePose, x: 0, y: 0, yaw: 0.35, look: 0.4, expr: 'smug', blink: 0, glint: 0, headTilt: 6, armL: { a: 30, b: -70 }, armR: { a: 16, b: -10 } };
  return (
    <AbsoluteFill style={{ background: '#0E1430' }}>
      <ShotFrame>
        <linearGradient id="bbsky" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#123A5A" />
          <stop offset="0.55" stopColor="#1F6A5A" />
          <stop offset="1" stopColor="#0E2A30" />
        </linearGradient>
        <rect width={1920} height={1080} fill="url(#bbsky)" />
        <Notes />
        <radialGradient id="bbv" cx="0.6" cy="0.5" r="0.8">
          <stop offset="0.45" stopColor="#000" stopOpacity={0} />
          <stop offset="1" stopColor="#06060F" stopOpacity={0.85} />
        </radialGradient>
        <rect width={1920} height={1080} fill="url(#bbv)" />
        {/* the rich woman, mid-ground left, smug, gold bag on her arm */}
        <g transform="translate(800 1150) scale(2.25)">
          <Hero look={RICH} pose={her} shadow={0} />
          <g transform="translate(-58 -96)">
            <path d="M -22 -26 Q 0 -60 22 -26" stroke="#C89A2A" strokeWidth={7} fill="none" />
            <rect x={-38} y={-28} width={76} height={56} rx={10} fill="#FFD34A" stroke="#8A6A1A" strokeWidth={5} />
            <rect x={-10} y={-12} width={20} height={14} rx={3} fill="#8A6A1A" />
          </g>
        </g>
        <Glow x={760} y={620} r={420} kind="red" o={0.75} />
        <BalanceTag x={760} y={630} v={-61240} s={2.15} t={0} bob={false} flash={0.15} />
        {/* you, a huge close-up on the right, in shock */}
        <Glow x={1500} y={430} r={460} kind="cool" o={0.5} />
        <g transform="translate(1530 1250) scale(4.6)">
          <Hero look={LOOKS.you} pose={me} shadow={0} />
        </g>
        {/* text */}
        <T x={60} y={190} size={190} fill="#FFFFFF">YOUR</T>
        <T x={60} y={380} size={190} fill="#FFD23A">MONEY</T>
      </ShotFrame>
    </AbsoluteFill>
  );
};
