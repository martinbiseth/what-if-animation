import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, FONT, OldRadio, Glow } from '../../../engine';
import { YOU, SUIT, StreetSet, KitchenSet, phoneCU, propCU, faceCU, bigWord, talkShot, netCard, listCard, at } from '../common';

// Chapter 7, the cliffhanger: the last page you read out was "Internet", downloaded the night before; at the bottom an
// edit dated 7:41 that Tuesday: "Shutdown complete. Do not attempt to restore." Who wrote it? Why does he want the
// phone? The radio says your name. Is any of this real? The comment ask; Part 2.

const MORNING = StreetSet('morning', { cars: false });
const KIT = KitchenSet(0.45);

export const S1 = netCard({ kicker: 'CHAPTER 7', title: 'ONE MINUTE BEFORE', red: 0.8, lit: 0.2 });

// ---------- S2: the doorstep: he walks away with the phone; you watch ----------
export const S2 = talkShot({
  Set: MORNING, setT: 5000,
  cast: [
    { look: SUIT, x: 700, y: at(0).y, yaw: -0.6, faces: [[0, 'smug']], pose: { armR: { a: 70, b: -40 } } },
    { look: YOU, x: 1150, y: at(0).y, yaw: -0.4, faces: [[0, 'worried']], look_: -0.8 },
  ],
  cam: { from: [930, 600, 1.6], to: [930, 600, 1.7] },
});

export const S3 = phoneCU({ mode: 'wiki', text: 'Internet', Bg: MORNING, push: 0.14, battery: 31, sleeve: '#5A5F6B' });

// ---------- S4: the bottom of the page, huge: the edit, then the line typing itself in ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const scroll = kf(t, [[0, 0], [60, -260]]);
  const msg = 'Shutdown complete. Do not attempt to restore.';
  const typed = msg.slice(0, Math.floor(clamp((t - 282) / 40) * msg.length));
  const stamp = t > 160;
  return (
    <g>
      <rect width={1920} height={1080} fill="#F8F8F6" />
      <g transform={`translate(0 ${scroll}) scale(${kf(t, [[0, 1], [len, 1.08]])})`}>
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={240} y={140 + i * 64} width={i % 4 === 3 ? 900 : 1440} height={24} rx={12} fill="#C8C8D0" />
        ))}
        <rect x={240} y={940} width={1440} height={3} fill="#C8C8CC" />
        <text x={240} y={1020} fontFamily={FONT.ui} fontSize={40} fill="#6A6A74">Last downloaded: Monday, 23:58</text>
        {stamp ? (
          <g opacity={clamp((t - 160) / 8)}>
            <text x={240} y={1100} fontFamily={FONT.ui} fontSize={44} fill="#C83A3A">Edited: Tuesday, 07:41</text>
          </g>
        ) : null}
        <text x={240} y={1220} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#101014">{typed}{t > 282 && Math.floor(t / 8) % 2 ? '|' : ''}</text>
      </g>
      {t > 200 && t < 282 ? (
        <g transform={`translate(1500 780) scale(${backOut(clamp((t - 200) / 9))})`}>
          <rect x={-210} y={-70} width={420} height={140} rx={70} fill="#C83A3A" />
          <text y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={62} fill="#FFFFFF">1 MIN BEFORE</text>
        </g>
      ) : null}
    </g>
  );
};

export const S5 = faceCU({ look: YOU, Bg: MORNING, faces: [[0, 'shock']], yaw: 0.1, look_: 0.4, zoom: [2.8, 3.3] });
export const S6 = bigWord({ word: 'WHO WROTE THAT?', color: '#FFB15A', size: 150 });
export const S7 = faceCU({ look: SUIT, Bg: MORNING, faces: [[0, 'neutral'], [40, 'smug']], yaw: -0.5, look_: 0.6, zoom: [3.0, 3.2] });

// ---------- S8: the old radio on the kitchen table: it crackles on by itself ----------
export const S8 = propCU({
  Bg: KIT, push: 0.14,
  draw: (t) => {
    const on = t > 30 ? 1 : 0;
    const jit = on ? (Math.random() > 0.5 ? 0 : 0) : 0;
    return (
      <g>
        <rect x={-200} y={760} width={2400} height={600} fill="#8A6A4A" />
        <OldRadio x={960 + jit} y={770} s={1.8} on={on} t={t} />
        {on ? <Glow x={960} y={560} r={600} o={0.3} /> : null}
      </g>
    );
  },
});

export const S9 = faceCU({
  look: YOU, Bg: KIT, faces: [[0, 'worried'], [16, 'shock']], yaw: -0.5, look_: -0.8, zoom: [2.9, 3.2],
  front: (t) => (t > 30 ? (
    <g transform={`translate(1500 260) scale(${backOut(clamp((t - 30) / 8))})`}>
      <rect x={-260} y={-70} width={520} height={140} rx={30} fill="#0B0816" opacity={0.75} />
      <text y={24} textAnchor="middle" fontFamily={FONT.ui} fontSize={56} fill="#FFE7A8">"...is that you?"</text>
    </g>
  ) : null),
});

export const S10 = bigWord({ word: 'IS ANY OF THIS REAL?', color: '#F6EFE3', size: 130 });
export const S11 = listCard({
  title: 'IS ANY OF THIS REAL?',
  items: [
    { at: 39, text: '6 HOURS OFFLINE · 2021', ok: true }, { at: 111, text: '8.5M COMPUTERS · 2024', ok: true },
    { at: 192, text: '3 DAYS OF FOOD', ok: true }, { at: 246, text: 'WIKIPEDIA ON A PHONE', ok: true }, { at: 309, text: 'ALL REAL.', ok: true, hot: true },
  ],
});
export const S12 = faceCU({ look: YOU, Bg: MORNING, faces: [[0, 'neutral'], [30, 'smug']], yaw: 0, look_: 0, zoom: [2.7, 3.0] });
export const S13: React.FC<ShotProps> = (p) => {
  const B = bigWord({ kicker: 'COMING SOON', word: 'PART 2', color: '#FF3A2A', size: 240 });
  return <B {...p} />;
};
