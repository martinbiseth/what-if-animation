import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, FONT, Glow, Schematic, SCH } from '../../../engine';
import words from './words.json';
import {
  YOU, SUIT, BED, KIT, propCU, faceCU, bigWord, phoneCU, netCard, moneyCard, Teddy, PasswordNote, Briefcase, Coin, Soft, span,
} from '../common';

// Chapter 7, the cliffhanger: asleep in 2011, awake in 2026; the attic, old Captain Buttons, the paper still inside;
// 8,000 coins, about a billion dollars at the peak; one transaction you never made: "We kept a copy too." The
// doorbell. Is any of this real? The question for the comments; part two.

export const S1 = netCard({ kicker: 'CHAPTER 7', title: 'THE MESSAGE', red: 0.2, lit: 0.5 });

// ---------- S2: the year rolls forward, 2011 to 2026 ----------
export const S2: React.FC<ShotProps> = ({ t }) => {
  const k = easeOut(clamp((t - 4) / 30));
  const yr = Math.round(2011 + 15 * k);
  return (
    <g>
      <Soft blur={10} dim={0.35}><BED t={t} id="s2" /></Soft>
      <text x={960} y={640} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={300} fill={k >= 1 ? '#7FD4FF' : '#F6EFE3'} stroke="#0B0816" strokeWidth={18} paintOrder="stroke">{yr}</text>
    </g>
  );
};

export const S3 = phoneCU({ mode: 'home', Bg: BED, push: 0.08, time: '7:12', battery: 92 });
export const S4 = faceCU({ look: YOU, Bg: BED, faces: [[0, 'neutral'], [16, 'worried']], yaw: 0.25, zoom: [3.0, 3.2] });

// ---------- S5: the attic: a beam of light, boxes, and on top, Captain Buttons ----------
const Attic: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2028" />
    <path d="M 0 0 L 960 -200 L 1920 0 L 1920 1080 L 0 1080 Z" fill="#33262E" />
    <path d="M 0 300 L 960 -100 L 1920 300" stroke="#1A1218" strokeWidth={30} fill="none" />
    <rect y={860} width={1920} height={220} fill="#4A3A34" />
    {[[420, 780, 300, 180], [700, 820, 260, 140], [1300, 760, 340, 200], [1340, 600, 260, 160]].map(([x, y, w, h], i) => (
      <rect key={i} x={x} y={y} width={w} height={h} fill={['#8A6A4A', '#7A5A3A', '#9A7A54', '#8A6A44'][i]} stroke="#100E16" strokeWidth={6} />
    ))}
    <path d="M 860 -40 L 1060 -40 L 1300 1080 L 620 1080 Z" fill="#FFF3C0" opacity={0.1 + Math.sin(t / 20) * 0.02} />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={760 + ((i * 97 + t) % 420)} cy={200 + ((i * 131 + t * 0.6) % 700)} r={3} fill="#FFF3C0" opacity={0.5} />)}
  </g>
);
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1000, 620, kf(t, [[0, 1.0], [len, 1.25]]))}>
    <Attic t={t} />
    <Teddy x={1470} y={480} s={0.4} old={1} />
  </g>
);

export const S6 = propCU({ bgColor: '#2A2028', push: 0.1, draw: () => <Teddy x={960} y={440} s={1.35} old={1} /> });
export const S7 = propCU({
  bgColor: '#2A2028',
  draw: (t) => {
    const k = easeOut(clamp((t - 6) / 20));
    return (
      <g>
        <Teddy x={960} y={360} s={1.35} old={1} seam={1} />
        <PasswordNote x={960} y={600 + k * 160} s={1.2} fold={1} rot={k * 12} />
      </g>
    );
  },
});

// ---------- the phone in your hands, a wallet app on it ----------
const WalletPhone: React.FC<{ t: number; children: React.ReactNode; shake?: number }> = ({ t, children, shake = 0 }) => (
  <g transform={`translate(${960 + Math.sin(t * 1.7) * shake} 540)`}>
    <Glow x={0} y={0} r={500} kind="cool" o={0.35} />
    <rect x={-250} y={-470} width={500} height={940} rx={70} fill="#16141C" stroke="#100E16" strokeWidth={10} />
    <rect x={-222} y={-440} width={444} height={880} rx={50} fill="#121A2E" />
    <svg x={-222} y={-440} width={444} height={880} viewBox="0 0 444 880">{children}</svg>
  </g>
);
export const S8 = propCU({
  Bg: BED,
  draw: (t) => (
    <WalletPhone t={t} shake={4}>
      <text x={222} y={120} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#8A9ABF">ENTER KEY</text>
      <rect x={30} y={170} width={384} height={80} rx={14} fill="#1E2A44" />
      <text x={50} y={224} fontFamily={FONT.ui} fontSize={30} fill="#F6EFE3">{'5Kb8kLf9zgWQnog'.slice(0, Math.floor(t / 2))}</text>
    </WalletPhone>
  ),
});
export const S9 = propCU({
  Bg: BED,
  draw: (t) => (
    <WalletPhone t={t}>
      <text x={222} y={120} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#8A9ABF">BALANCE</text>
      <g transform={`translate(222 360) scale(${backOut(clamp(t / 10))})`}>
        <Coin x={0} y={-110} r={70} />
        <text y={40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={86} fill="#F2A93A">8,000 ₿</text>
      </g>
    </WalletPhone>
  ),
});
export const S10 = moneyCard({ kicker: "AT BITCOIN'S PEAK, ABOUT", from: 0, to: 1000000000, color: '#FFD86A', dur: 40 });

// ---------- S11: one transaction you never made ----------
export const S11 = propCU({
  Bg: BED,
  draw: (t) => (
    <WalletPhone t={t}>
      <text x={222} y={100} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#8A9ABF">HISTORY</text>
      {[['YESTERDAY', '+0.00001 ₿', true], ['8 JUN 2011', '−2,000 ₿', false], ['JUN 2010', '+10,000 ₿', false]].map(([d, a, hot], i) => (
        <g key={i} transform={`translate(30 ${170 + i * 130})`}>
          <rect width={384} height={110} rx={16} fill={hot ? '#3A2A1A' : '#1E2A44'} stroke={hot ? (Math.sin(t / 3) > 0 ? '#FFB15A' : '#8A5A2A') : 'none'} strokeWidth={5} />
          <text x={20} y={44} fontFamily={FONT.ui} fontSize={24} fill="#8A9ABF">{d as string}</text>
          <text x={20} y={88} fontFamily={FONT.title} fontWeight={800} fontSize={36} fill={hot ? '#FFB15A' : '#F6EFE3'}>{a as string}</text>
        </g>
      ))}
    </WalletPhone>
  ),
});
export const S12 = faceCU({ look: YOU, Bg: BED, faces: [[0, 'worried']], yaw: -0.25, zoom: [3.2, 3.5] });

// ---------- S13: the message, typed out ----------
const MSG = 'We kept a copy too.';
export const S13: React.FC<ShotProps> = ({ t, f }) => {
  const [a] = span(words, 'We', 'too');
  const n = Math.max(0, Math.min(MSG.length, Math.floor((f / 30 - a + 0.2) * 14)));
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0816" />
      <text x={960} y={330} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill="#8A9ABF" opacity={clamp(t / 6)}>MESSAGE ATTACHED</text>
      <text x={960} y={600} textAnchor="middle" fontFamily={FONT.ui} fontSize={110} fill="#FF5A4A">{MSG.slice(0, n)}{Math.sin(t / 3) > 0 ? '▍' : ' '}</text>
    </g>
  );
};

export const S14 = faceCU({ look: YOU, Bg: BED, faces: [[0, 'shock']], yaw: 0.2, zoom: [3.4, 3.8] });

// ---------- S15: the front door from the hall: a silhouette behind the frosted glass ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <rect width={1920} height={1080} fill="#2A2430" />
    <rect x={640} y={140} width={640} height={940} fill="#4A3A44" stroke="#100E16" strokeWidth={10} />
    <rect x={740} y={220} width={440} height={420} fill="#9AA8C8" opacity={0.85} />
    <g opacity={clamp((t - 6) / 12)}>
      <circle cx={960} cy={380} r={70} fill="#1A1622" opacity={0.75} />
      <path d="M 840 640 L 860 470 Q 960 440 1060 470 L 1080 640 Z" fill="#1A1622" opacity={0.75} />
    </g>
    <circle cx={1220} cy={660} r={18} fill="#C8A84A" />
    <rect y={1000} width={1920} height={80} fill="#1A1418" />
  </g>
);

// ---------- S16: is any of this real? Each fact ticks on as it's said ----------
const FACTS: [string, string][] = [['The', '10,000 ₿ FOR 2 PIZZAS'], ['one', 'THE ONE-CENT CRASH'], ['eight', '8,000 ₿ IN A LANDFILL'], ['five', '1 IN 5 BITCOINS LOST']];
export const S16 = bigWord({ word: 'REAL?', color: '#FFD86A', kicker: 'IS ANY OF THIS', size: 260 });
export const S17: React.FC<ShotProps> = ({ t, f }) => {
  const sec = f / 30;
  const times = FACTS.map(([w], i) => {
    const after = i === 0 ? span(words, 'real', 'real')[0] : span(words, FACTS[i - 1][0], FACTS[i - 1][0])[0];
    const k = words.findIndex((x) => x.s > after && x.w.toLowerCase().replace(/[^a-z0-9]/g, '') === w);
    return k >= 0 ? words[k].s : 0;
  });
  const allReal = span(words, 'All', 'All')[0];
  return (
    <g>
      <Schematic t={t} id="facts" />
      {FACTS.map(([, txt], i) => {
        const p = backOut(clamp((sec - times[i]) * 30 / 8));
        return (
          <g key={i} transform={`translate(440 ${300 + i * 150}) scale(${p})`} opacity={clamp((sec - times[i]) * 4)}>
            <path d="M -40 0 L -10 30 L 44 -34" stroke="#5BE08A" strokeWidth={18} fill="none" strokeLinecap="round" />
            <text x={90} y={26} fontFamily={FONT.title} fontWeight={800} fontSize={76} fill="#F6EFE3">{txt}</text>
          </g>
        );
      })}
      <g opacity={clamp((sec - allReal) * 4)} transform={`translate(960 940) scale(${backOut(clamp((sec - allReal) * 30 / 9))})`}>
        <rect x={-190} y={-52} width={380} height={80} rx={40} fill="#0B0816" stroke={SCH.live} strokeWidth={4} />
        <text textAnchor="middle" fontFamily={FONT.ui} fontSize={42} fill={SCH.live}>ALL REAL.</text>
      </g>
    </g>
  );
};

// ---------- S18: the question: the open briefcase ----------
export const S18 = propCU({
  Bg: KIT,
  draw: (t) => (
    <g>
      <Briefcase x={960} y={700} s={1.4} open={1} />
      <text x={960} y={260} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#F6EFE3" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp(t / 6)}>TAKE THE $50,000?</text>
    </g>
  ),
});

// ---------- S19: end card: you and the man in the suit, PART 2 ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 760, y: 700, scale: 1, yaw: 0.4, expr: 'worried', blink: idleBlink(t, 2), look: 0.6 };
  const him: Pose = { ...basePose, x: 1160, y: 700, scale: 1, yaw: -0.4, expr: 'smug', blink: idleBlink(t, 5), look: -0.6 };
  return (
    <g>
      <rect width={1920} height={1080} fill="#120C18" />
      <Glow x={960} y={600} r={700} kind="warm" o={0.25} />
      <g transform={camT(960, 520, kf(t, [[0, 1.75], [len, 1.85]]))}>
        <Hero look={YOU} pose={me} />
        <Hero look={SUIT} pose={him} />
      </g>
      <g transform={`translate(960 200) scale(${backOut(clamp((t - 30) / 10))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={120} fill="#FFD86A" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">PART 2 IS COMING</text>
      </g>
    </g>
  );
};
