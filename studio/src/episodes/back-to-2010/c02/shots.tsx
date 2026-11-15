import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, FONT, KITCHEN, stand, KitchenIsland, CitySkyline, TitleCard, ModernCar } from '../../../engine';
import words from './words.json';
import {
  YOU, MO, MUM10, ELLIE, KIT, BEDN, DAY, propCU, faceCU, bigWord, talkShot, netCard, listCard, tvCU, chartShot, HundredBill, NewsScreen,
  FootballScreen, at, span, Soft,
} from '../common';

// Chapter 2, the rules: asleep in 2026, awake in 2010; same age, house, family; every memory; $100; the rules (nothing
// comes back, nobody believes you, money must survive to 2026), the planted rule (change too much and your
// memories stop being true), the title.

export const S1 = netCard({ kicker: 'CHAPTER 2', title: 'THE RULES', red: 0.1, lit: 0.6 });

// ---------- S2: the year rolls back, 2026 to 2010, over your sleeping room ----------
export const S2: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(clamp((t - 10) / 50));
  const yr = Math.round(2026 - 16 * k);
  return (
    <g>
      <Soft blur={10} dim={0.35}><BEDN t={t} id="s2" /></Soft>
      <g transform={`translate(960 610) scale(${1 + Math.sin(t / 2) * 0.01 * (k < 1 ? 1 : 0)})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={300} fill={k >= 1 ? '#FFD86A' : '#F6EFE3'} stroke="#0B0816" strokeWidth={18} paintOrder="stroke">{yr}</text>
      </g>
      <text x={960} y={780} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#C8C2D8" opacity={clamp((t - 60) / 6)}>1 MAY 2010</text>
    </g>
  );
};

// ---------- S3: the same kitchen, the same family, sixteen years younger ----------
const K1 = stand(KITCHEN, 0.3, 0.45), K2 = stand(KITCHEN, 0.55, 0.5), K3 = stand(KITCHEN, 0.77, 0.42);
export const S3 = talkShot({
  Set: KIT, setT: 400,
  cast: [
    { look: MUM10, ...K1, yaw: 0.3, faces: [[0, 'happy']], pose: { armR: { a: 100, b: 30 } } },
    { look: ELLIE, ...K2, scale: K2.scale * 0.6, y: K2.y + 70, yaw: 0, faces: [[0, 'happy']] },
    { look: YOU, ...K3, yaw: -0.4, faces: [[0, 'worried']] },
  ],
  cam: { from: [960, 560, 1.15], to: [960, 560, 1.22] },
  front: () => <KitchenIsland />,
});

// ---------- S4: the street in 2010: same houses, older cars ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 540, 1.08)}>
    <DAY t={t + 500} id="s4" />
    <ModernCar x={kf(t, [[0, -300], [len, 700]])} y={950} s={1.05} color="#B8B8C0" />
  </g>
);

export const S5 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'neutral'], [12, 'smug']], yaw: 0.25, zoom: [3.0, 3.3], glint: 1 });
export const S6 = chartShot({ p0: 0.0, p1: 0.35, title: 'EVERY PRICE' });
export const S7 = tvCU((t) => <NewsScreen t={t} head="STOCKS CRASH" ticker="MAY 2010" pic={<rect width={640} height={250} fill="#3A4A6A" />} />);
export const S8 = tvCU((t) => <FootballScreen t={t} goal={clamp((t - 2) / 12)} score="1 - 0" />);

// ---------- S9: your one hundred dollars, flat on the table ----------
export const S9 = propCU({ Bg: KIT, push: 0.1, draw: (t) => <HundredBill x={960} y={560} s={1.9} rot={-4} glow={0.7} crumple={0.3} /> });
export const S10 = bigWord({ kicker: 'NOT A CENT MORE', word: '$100', color: '#7FE08A', Bg: KIT });

// ---------- S11: the rules, one by one ----------
export const S11 = listCard({
  title: 'THE RULES',
  items: [
    { at: 4, text: 'BRING NOTHING BACK', ok: true },
    { at: 60, text: 'ONLY WHAT’S IN YOUR HEAD', ok: true },
  ],
});

// ---------- S12: you tell Mo you're from the future; he laughs ----------
export const S12 = talkShot({
  Set: DAY, setT: 700, words,
  cast: [
    { look: YOU, x: 800, y: at(0).y, yaw: 0.45, faces: [[0, 'neutral']], pose: { armR: { a: 70, b: -40 } } },
    { look: MO, x: 1120, y: at(0).y, yaw: -0.4, faces: [[0, 'neutral'], [20, 'happy']], pose: { tilt: -4 } },
  ],
  cam: { from: [960, 560, 1.7], to: [960, 560, 1.8] },
});

// ---------- S13: money only counts if it survives to 2026 ----------
export const S13 = bigWord({ kicker: 'MONEY ONLY COUNTS IF IT SURVIVES UNTIL', word: '2026', color: '#FFD86A', size: 260 });
export const S14 = bigWord({ kicker: 'AND ONE MORE', word: 'RULE', color: '#FF5A4A' });

// ---------- S15: the future as a line: change too much and it bends away from what you remember ----------
export const S15: React.FC<ShotProps> = ({ t }) => {
  const bend = easeOut(clamp((t - 70) / 40));
  return (
    <g>
      <rect width={1920} height={1080} fill="#101828" />
      <text x={260} y={560} fontFamily={FONT.ui} fontSize={40} fill="#9AA8C8">2010</text>
      <text x={1560} y={300} fontFamily={FONT.ui} fontSize={40} fill="#9AA8C8">2026</text>
      <path d="M 400 540 C 900 540 1200 360 1540 290" stroke="#5BE08A" strokeWidth={12} fill="none" strokeDasharray="22 14" opacity={0.9} />
      <text x={1180} y={300} fontFamily={FONT.ui} fontSize={30} fill="#5BE08A" opacity={0.9}>WHAT YOU REMEMBER</text>
      <path d={`M 400 540 C 900 ${540 + bend * 60} ${1200} ${360 + bend * 420} 1540 ${290 + bend * 560}`} stroke="#F2A93A" strokeWidth={14} fill="none" />
      <circle cx={400} cy={540} r={20} fill="#F2A93A" />
      <g opacity={clamp((t - 100) / 8)} transform={`translate(1560 ${290 + bend * 560}) scale(${backOut(clamp((t - 100) / 9))})`}>
        <path d="M -40 -40 L 40 40 M 40 -40 L -40 40" stroke="#FF3A2A" strokeWidth={16} strokeLinecap="round" />
      </g>
      <text x={960} y={980} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" opacity={clamp((t - 70) / 8)}>CHANGE IT TOO MUCH…</text>
    </g>
  );
};

export const S16 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'worried']], yaw: -0.25, zoom: [3.2, 3.45] });

// ---------- S17: the title over the 2010 city ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1.08], [len, 1.0]]))}>
      <CitySkyline t={t} id="title" red={0.1} lit={0.7} />
    </g>
    <rect width={1920} height={1080} fill="#0E0C1E" opacity={0.3} />
    <TitleCard t={t} lines={['WHAT IF YOU WENT BACK', 'TO 2010 WITH $100?']} accent="#7FE08A" accentT={22} y={420} size={120} />
  </g>
);
