import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, FONT, factCard, Glow, BlackCarFront } from '../../../engine';
import {
  YOU, ELLIE, KIT, BEDN, DAY, NIGHT, propCU, faceCU, bigWord, talkShot, netCard, tvCU, laptopCU, chartShot, moneyCard, Coin, CoinPile, NewsScreen,
  PasswordNote, HardDrive, Landfill, OldLaptop, crowd, Soft, PriceChart, BTC,
} from '../common';

// Chapter 4, the catch: the hack and the one-cent price, back to $100; you have to keep it fourteen years; Mt. Gox's
// 850,000 coins; the crashes of 2018 and 2022; "bitcoin is dead"; a bitcoin is a password: the drive in the Welsh
// landfill, two guesses left, one in five lost; your password on the family computer; three problems, then a fourth.

export const S1 = netCard({ kicker: 'CHAPTER 4', title: 'THE CATCH', red: 0.5, lit: 0.4 });

export const S2 = tvCU((t) => <NewsScreen t={t} head="EXCHANGE HACKED" ticker="19 JUNE 2011" pic={<g><rect width={640} height={250} fill="#1A1A2A" />{Array.from({ length: 12 }, (_, i) => <text key={i} x={20 + (i % 4) * 160} y={40 + Math.floor(i / 4) * 70} fontFamily={FONT.ui} fontSize={26} fill="#5BE08A" opacity={0.4 + ((i + Math.floor(t / 3)) % 3) * 0.2}>{'01101001'}</text>)}</g>} />);

// ---------- S3: the price falls off a cliff ----------
export const S3: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(clamp((t - 8) / 30));
  const pts: [number, number][] = [[2011.3, 8], [2011.38, 18], [2011.44, 31], [2011.46, 17], [2011.465, 17 * (1 - k) + 0.01 * k]];
  return <PriceChart t={t} p={1} points={pts} years={[2011.25, 2011.5]} logMin={-2.4} logMax={2} title="19 JUNE 2011" />;
};

export const S4 = factCard({ value: 1, suffix: '¢', label: 'ONE BITCOIN, FOR A FEW MINUTES', sub: 'Mt. Gox, 19 June 2011' });
export const S5 = moneyCard({ kicker: 'YOUR COINS ARE WORTH', from: 310000, to: 100, color: '#FF5A4A', dur: 26 });
export const S6 = faceCU({ look: YOU, Bg: BEDN, faces: [[0, 'shock'], [20, 'worried']], yaw: 0.25, zoom: [3.0, 3.25] });
export const S7 = chartShot({ p0: 0.16, p1: 1, dur: 120, title: 'IT COMES BACK. BUT…' });
export const S8 = bigWord({ kicker: "YOU DON'T JUST HAVE TO BUY IT. YOU HAVE TO", word: 'KEEP IT', color: '#FFD86A', size: 220 });
export const S9 = bigWord({ kicker: 'FOR', word: '14 YEARS', color: '#F2A93A', size: 230 });

export const S10 = tvCU((t) => <NewsScreen t={t} head="MT. GOX COLLAPSES" ticker="FEBRUARY 2014" pic={<rect width={640} height={250} fill="#3A2A3A" />} />);
export const S11 = factCard({ value: 850000, suffix: ' ₿', label: 'MISSING WHEN MT. GOX COLLAPSED, 2014', sub: 'about 200,000 were found again later' });

// ---------- S12: people on the street, staring at their screens, worried ----------
export const S12 = talkShot({
  Set: DAY, setT: 900,
  cast: crowd(7, 260, 1660, 3, { expr: 'worried', faceTo: 960 }),
  cam: { from: [960, 560, 1.15], to: [960, 560, 1.22] },
});

export const S13 = chartShot({ p0: 0.5, p1: 0.62, dur: 60, marks: [{ year: 2017.96, price: 19500, label: '$19,500', at: 10, color: '#FFD86A' }, { year: 2018.96, price: 3200, label: '−84%', at: 60, color: '#FF5A4A' }] });
export const S14 = chartShot({ p0: 0.62, p1: 0.85, dur: 50, marks: [{ year: 2022.9, price: 16000, label: 'AGAIN · 2022', at: 50, color: '#FF5A4A' }] });
export const S15 = tvCU((t) => <NewsScreen t={t} head="BITCOIN IS DEAD" ticker="AGAIN" pic={<rect width={640} height={250} fill="#2A2A3A" />} />);
export const S16 = bigWord({ kicker: 'EVERY TIME, ALMOST EVERYONE', word: 'SELLS', color: '#FF5A4A' });
export const S17 = faceCU({ look: YOU, Bg: BEDN, faces: [[0, 'worried']], yaw: -0.25, zoom: [3.2, 3.45] });

export const S18 = propCU({ bgColor: '#1A1430', push: 0.08, draw: (t) => <PasswordNote x={960} y={540} s={1.8} rot={-3} /> });

// ---------- S19: the note burns away; the coins go with it ----------
export const S19 = propCU({
  bgColor: '#120C18',
  draw: (t) => {
    const k = clamp((t - 10) / 40);
    return (
      <g>
        <g opacity={1 - k}><PasswordNote x={700} y={520} s={1.1} rot={-6} /></g>
        <g opacity={1 - clamp((t - 30) / 40)}><CoinPile x={1300} y={700} n={10} r={60} seed={9} /></g>
        <text x={960} y={960} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FF5A4A" opacity={clamp((t - 50) / 8)}>GONE. FOREVER.</text>
      </g>
    );
  },
});

// ---------- S20: an old hard drive drops into a bin bag ----------
export const S20 = propCU({
  bgColor: '#2A2A3A',
  draw: (t) => {
    const k = easeOut(clamp(t / 30));
    return (
      <g>
        <path d="M 640 1100 L 700 760 Q 960 700 1220 760 L 1280 1100 Z" fill="#1A1A22" stroke="#100E16" strokeWidth={8} />
        <HardDrive x={960} y={lerp2(200, 760, k)} s={0.9} rot={k * 30} />
        <path d="M 640 1100 L 690 830 Q 960 780 1230 830 L 1280 1100 Z" fill="#22222C" stroke="#100E16" strokeWidth={8} />
        <text x={960} y={140} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={8} fill="#C8C2D8">WALES · 2013</text>
      </g>
    );
  },
});
function lerp2(a: number, b: number, k: number) { return a + (b - a) * k; }

// ---------- S21: the landfill, still there ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.1]]))}>
    <Landfill t={t} />
    <text x={960} y={200} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke" opacity={clamp((t - 8) / 8)}>8,000 ₿ IN HERE</text>
  </g>
);

// ---------- S22: a locked drive: TWO GUESSES LEFT ----------
export const S22 = propCU({
  bgColor: '#141A2A',
  draw: (t) => (
    <g transform="translate(960 560)">
      <rect x={-420} y={-120} width={840} height={240} rx={40} fill="#3A3A46" stroke="#100E16" strokeWidth={10} />
      <rect x={420} y={-60} width={120} height={120} fill="#B8BCC8" stroke="#100E16" strokeWidth={8} />
      <rect x={-360} y={-70} width={460} height={140} rx={12} fill="#0E1A12" />
      <text x={-130} y={22} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} fill={Math.sin(t / 4) > 0 ? '#FF5A4A' : '#8A2A2A'}>2 GUESSES</text>
      <circle cx={250} cy={0} r={44} fill="#C8283A" stroke="#100E16" strokeWidth={6} />
      <text y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#F2A93A" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">7,002 ₿</text>
    </g>
  ),
});

// ---------- S23: one in five bitcoins: lost ----------
export const S23: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#120C18" />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} transform={`scale(1)`} opacity={clamp((t - i * 4) / 6)}>
        <Coin x={480 + i * 240} y={520} r={100} dull={i === 4 && t > 40 ? 1 : 0} />
        {i === 4 && t > 40 ? <path d={`M ${400 + i * 240} 440 L ${560 + i * 240} 600 M ${560 + i * 240} 440 L ${400 + i * 240} 600`} stroke="#FF3A2A" strokeWidth={16} strokeLinecap="round" /> : null}
      </g>
    ))}
    <text x={960} y={800} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#F6EFE3" opacity={clamp((t - 40) / 8)}>1 IN 5: LOST FOREVER</text>
    <text x={960} y={880} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill="#C8C2D8" opacity={clamp((t - 48) / 8)}>Chainalysis, 2020</text>
  </g>
);

// ---------- S24: the family computer: one file, wallet.dat ----------
export const S24 = laptopCU(() => (
  <g>
    <rect width={536} height={340} fill="#3A7AC8" />
    <rect x={200} y={90} width={136} height={150} rx={8} fill="#F6EFE3" stroke="#1A2A4A" strokeWidth={4} />
    <circle cx={268} cy={150} r={34} fill="#F2A93A" />
    <text x={268} y={162} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#FFF">₿</text>
    <text x={268} y={280} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#FFF">wallet.dat</text>
  </g>
), KIT);

// ---------- S25: tiny Ellie at the family computer, hammering the keys ----------
export const S25: React.FC<ShotProps> = ({ t, len }) => {
  const tap = Math.sin(t / 1.5) > 0 ? 1 : 0;
  const ellie: Pose = { ...basePose, x: 860, y: 760, scale: 0.62, yaw: 0.6, expr: 'happy', blink: idleBlink(t, 2), look: 0.7, armR: { a: 70 + tap * 12, b: -30 }, armL: { a: 60 - tap * 12, b: -20 } };
  return (
    <g transform={camT(1000, 640, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <KIT t={t + 700} id="s25" />
      <Hero look={ELLIE} pose={ellie} />
      <rect x={880} y={800} width={560} height={30} fill="#8A6A4A" stroke="#100E16" strokeWidth={6} />
      <OldLaptop x={1160} y={800} s={0.45}><rect width={536} height={340} fill="#E8C04A" /><circle cx={268 + Math.sin(t / 3) * 120} cy={170} r={40} fill="#E8503A" /></OldLaptop>
    </g>
  );
};

// ---------- S26: the blue crash screen ----------
export const S26 = laptopCU((t) => (
  <g>
    <rect width={536} height={340} fill="#1A3AA8" />
    <text x={268} y={130} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#FFF">:(</text>
    <text x={268} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={26} fill="#FFF">Your PC ran into a problem</text>
    <text x={268} y={250} textAnchor="middle" fontFamily={FONT.ui} fontSize={22} fill="#C8D0F0">(it's Tuesday)</text>
  </g>
), KIT);

// ---------- S27: three problems ----------
export const S27: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#14101E" />
    {[['1', 'HACKERS', 10], ['2', 'CRASHES', 30], ['3', 'A LITTLE SISTER', 52]].map(([n, txt, a], i) => {
      const p = backOut(clamp((t - (a as number)) / 8));
      return (
        <g key={i} transform={`translate(520 ${330 + i * 190}) scale(${p})`}>
          <circle r={60} fill="#FF5A4A" stroke="#0B0816" strokeWidth={6} />
          <text y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFF">{n}</text>
          <text x={110} y={28} fontFamily={FONT.title} fontWeight={800} fontSize={84} fill="#F6EFE3">{txt}</text>
        </g>
      );
    })}
  </g>
);

// ---------- S28: night: a black car parked across the street, lights off ----------
export const S28: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.2], [len, 1.4]]))}>
    <NIGHT t={t + 300} id="s28" />
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.3} />
    <BlackCarFront x={1100} y={900} s={1.2} lights={0} />
    <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={140} fill="#FF5A4A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp((t - 30) / 8)}>4</text>
  </g>
);
