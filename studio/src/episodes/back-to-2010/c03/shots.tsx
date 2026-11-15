import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, FONT, factCard, PizzaBox, Glow } from '../../../engine';
import words from './words.json';
import {
  YOU, MO, KIT, BEDN, DAY, DUSK, propCU, faceCU, bigWord, talkShot, netCard, listCard, tvCU, laptopCU, chartShot, moneyCard, Coin, CoinPile,
  ForumScreen, WalletScreen, FootballScreen, OldLaptop, PriceChart, BTC, at, span, Soft,
} from '../common';

// Chapter 3, the fun part: you buy bitcoin (less than a penny, the pizza day), ten thousand coins for $100, the
// nightly check under the covers, the World Cup prediction, the photo app and the block game, $1 in February 2011,
// $31 in June: $310,000. "How?" "Pizza." The turn.

export const S1 = netCard({ kicker: 'CHAPTER 3', title: 'TEN THOUSAND COINS', red: 0.1, lit: 0.6 });

export const S2 = listCard({
  items: [
    { at: 2, text: 'TOYS', ok: false },
    { at: 22, text: 'TRAINERS', ok: false },
  ],
});

// ---------- S3: one gold coin, spinning ----------
export const S3 = propCU({
  bgColor: '#1A1430',
  draw: (t) => (
    <g>
      <Glow x={960} y={520} r={500} kind="warm" o={0.5} />
      <Coin x={960} y={520} r={230} spin={t / 40} />
      <text x={960} y={900} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFD86A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp((t - 6) / 6)}>BITCOIN</text>
    </g>
  ),
});

export const S4 = laptopCU((t) => <ForumScreen t={t} posts={['What is this coin?', 'Mining on my laptop', 'Is this thing worth anything?', 'New to bitcoin, help']} />);
export const S5 = bigWord({ kicker: 'ONE BITCOIN, MAY 2010', word: '< 1¢', color: '#F2A93A', size: 260 });

// ---------- S6: the pizza day ----------
export const S6 = factCard({ value: 10000, suffix: ' ₿', label: 'FOR TWO PIZZAS · 22 MAY 2010', sub: 'the first real thing ever bought with bitcoin' });

export const S7 = laptopCU((t) => <ForumScreen hot="Selling 10,000 BTC" t={t} posts={['Pizza for bitcoins?', 'Selling 10,000 BTC', 'Is this thing worth anything?', 'New to bitcoin, help']} />);
export const S8 = laptopCU(() => <WalletScreen coins="10,000 ₿" usd="paid: $100" note="received" />);
export const S9 = faceCU({ look: YOU, Bg: BEDN, faces: [[0, 'smug']], yaw: 0.3, zoom: [3.1, 3.35] });

// ---------- S10: night, a lump under the duvet, lit from inside by a screen ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.2], [len, 1.3]]))}>
    <BEDN t={t + 300} id="s10" />
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
    <path d="M 640 760 Q 820 560 1100 600 Q 1320 620 1380 760 Z" fill="#E87A4A" stroke="#141826" strokeWidth={8} />
    <Glow x={960} y={680} r={260 + Math.sin(t / 7) * 20} kind="cool" o={0.55} />
  </g>
);

// ---------- S11: under the covers: the price, checked again ----------
export const S11 = laptopCU((t) => <WalletScreen coins="10,000 ₿" usd={`$${(60 + Math.floor(t / 4) % 30).toLocaleString()}`} note="checked again" />);

// ---------- S12: you and Mo on the street, laughing ----------
const moLine = span(words, 'Do', 'again');
export const S12 = talkShot({
  Set: DAY, setT: 300,
  cast: [
    { look: YOU, x: 820, y: at(0).y, yaw: 0.45, faces: [[0, 'happy']] },
    { look: MO, x: 1100, y: at(0).y, yaw: -0.45, faces: [[0, 'happy']] },
  ],
  cam: { from: [960, 560, 1.5], to: [960, 560, 1.6] },
});

export const S13 = faceCU({ look: MO, Bg: DAY, faces: [[0, 'happy']], yaw: -0.3, zoom: [3.0, 3.2] });

// ---------- S14: you tell him the final: the score, the minute ----------
export const S14 = talkShot({
  Set: DAY, setT: 500,
  cast: [
    { look: YOU, x: 820, y: at(0).y, yaw: 0.45, faces: [[0, 'smug']], pose: { armR: { a: 130, b: 30 } } },
    { look: MO, x: 1100, y: at(0).y, yaw: -0.45, faces: [[0, 'neutral'], [100, 'happy']] },
  ],
  cam: { from: [960, 560, 1.7], to: [900, 560, 1.85] },
  front: (t) => (
    <text x={820} y={330} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFD86A" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 30) / 8)}>1–0 · 116'</text>
  ),
});

export const S15 = faceCU({ look: MO, Bg: DAY, faces: [[0, 'happy']], yaw: -0.35, zoom: [3.0, 3.25], pose: { headTilt: 8 } });

// ---------- S16: the eleventh of July: the ball hits the net in the 116th minute ----------
export const S16 = tvCU((t) => <FootballScreen t={t} goal={clamp((t - 30) / 16)} minute="116'" score={t > 46 ? '1 - 0' : '0 - 0'} />);
export const S17 = faceCU({ look: MO, Bg: KIT, faces: [[0, 'shock'], [50, 'happy']], yaw: 0.3, zoom: [3.1, 3.4], words, talk: moLine });

// ---------- S18: a photo app, coming in October ----------
export const S18 = propCU({
  Bg: DAY,
  draw: (t) => (
    <g transform={`translate(960 520) scale(${backOut(clamp(t / 10))})`}>
      <rect x={-200} y={-200} width={400} height={400} rx={90} fill="#E86A5A" stroke="#100E16" strokeWidth={10} />
      <rect x={-120} y={-100} width={240} height={190} rx={30} fill="none" stroke="#FFF" strokeWidth={22} />
      <circle cy={-5} r={58} fill="none" stroke="#FFF" strokeWidth={22} />
      <text y={320} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">OCTOBER 2010</text>
    </g>
  ),
});

// ---------- S19: a block game: a castle of cubes builds itself ----------
const Blocks: React.FC<{ t: number; s?: number }> = ({ t, s = 1 }) => (
  <g transform={`scale(${s})`}>
    {Array.from({ length: 30 }, (_, i) => {
      const col = i % 6, row = Math.floor(i / 6);
      const tall = col === 0 || col === 5 ? 5 : 3;
      if (row >= tall) return null;
      const p = clamp((t - i * 1.6) / 6);
      return <rect key={i} x={col * 60} y={-row * 60 - 60 - (1 - p) * 200} width={58} height={58} fill={row === 0 ? '#7A5A3A' : '#8A8A92'} stroke="#100E16" strokeWidth={4} opacity={p} />;
    })}
  </g>
);
export const S19 = propCU({ bgColor: '#5AB0E8', draw: (t) => <g transform="translate(780 760)"><rect x={-600} y={0} width={1600} height={400} fill="#5AA84A" /><Blocks t={t} s={1.2} /></g> });

// ---------- S20: Mo at night, building a castle on his laptop ----------
export const S20 = laptopCU((t) => (
  <g>
    <rect width={536} height={340} fill="#5AB0E8" />
    <rect y={250} width={536} height={90} fill="#5AA84A" />
    <g transform="translate(180 250)"><Blocks t={t + 40} s={0.55} /></g>
  </g>
));

// ---------- S21: February 2011: one bitcoin is worth one dollar ----------
export const S21 = chartShot({ p0: 0.03, p1: 0.13, years: [2010.2, 2011.6], logMin: -3, logMax: 2, dur: 40, marks: [{ year: 2011.1, price: 1, label: '$1 · FEB 2011', at: 40, color: '#7FE08A' }] });
export const S22 = moneyCard({ kicker: 'YOUR $100 IS NOW', from: 100, to: 10000 });

// ---------- S23: early June: thirty-one dollars ----------
export const S23 = chartShot({ p0: 0.13, p1: 0.16, years: [2010.2, 2011.6], logMin: -3, logMax: 2, dur: 30, marks: [{ year: 2011.1, price: 1, label: '$1', at: 0, color: '#7FE08A' }, { year: 2011.44, price: 31, label: '$31 · JUNE 2011', at: 30, color: '#FFD86A' }] });
export const S24 = moneyCard({ kicker: 'YOUR $100 IS NOW', from: 10000, to: 310000, color: '#FFD86A' });

// ---------- S25: dusk, you walk down your street, past every house ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 500], [len, 1300]], (k) => k);
  const step = Math.sin(t / 4);
  const me: Pose = { ...at(x, { yaw: 0.5, expr: 'smug', blink: idleBlink(t, 3) }), legL: { a: step * 25, b: 8 }, legR: { a: -step * 25, b: 8 } };
  return (
    <g transform={camT(x + 100, 560, 1.4)}>
      <DUSK t={t + 400} id="s25" />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S26: Mo whispers "How?"; you: "Pizza." ----------
export const S26 = talkShot({
  Set: DUSK, setT: 600, words,
  cast: [
    { look: MO, x: 840, y: at(0).y, yaw: 0.5, talk: [span(words, 'How', 'How')], faces: [[0, 'shock']] },
    { look: YOU, x: 1080, y: at(0).y, yaw: -0.4, talk: [span(words, 'Pizza', 'Pizza')], faces: [[0, 'smug']] },
  ],
  cam: { from: [960, 560, 1.9], to: [960, 560, 2.0] },
});

// ---------- S27: the coins flicker, fading out ----------
export const S27 = propCU({
  bgColor: '#120C18',
  draw: (t) => (
    <g opacity={Math.max(0.15, 1 - clamp((t - 20) / 60)) * (Math.sin(t * 1.3) > -0.6 ? 1 : 0.4)}>
      <CoinPile x={960} y={760} n={16} r={70} seed={4} spread={3} />
    </g>
  ),
});

