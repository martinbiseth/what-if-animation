import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, ShotProps, idleBlink, FONT, KITCHEN, stand, KitchenIsland, ModernCar, BlackCarFront, Smartphone, Glow, Mug } from '../../../engine';
import words from './words.json';
import {
  YOU, MO, MUM10, SUIT, KID, N3, KIT, DAY, MORN, DUSK, NIGHT, propCU, faceCU, bigWord, talkShot, netCard, laptopCU, ForumScreen, WalletScreen,
  Briefcase, at, span,
} from '../common';

// Chapter 5, someone notices: Mo tells his cousin, the forum post, the black car, the man in the grey suit in your
// kitchen with Mum (polite, knows everything, spotless shoes, a phone from the future), his offer of $50,000 in a
// briefcase, Mum's face, and the line: "I know what they're worth in 2024."

export const S1 = netCard({ kicker: 'CHAPTER 5', title: 'THE MAN IN THE GREY SUIT', red: 0.3, lit: 0.4 });

const COUSIN = { ...KID, jacket: '#3A8AB8', jacketShade: '#2E6E94' };
export const S2 = talkShot({
  Set: DAY, setT: 200, words,
  cast: [
    { look: MO, x: 820, y: at(0).y, yaw: 0.45, talk: [span(words, 'He', 'cousin')], faces: [[0, 'happy']] },
    { look: COUSIN, x: 1100, y: at(0).y, yaw: -0.45, faces: [[0, 'neutral'], [60, 'shock']] },
  ],
  cam: { from: [960, 560, 1.6], to: [960, 560, 1.7] },
});

export const S3 = talkShot({
  Set: MORN, setT: 400,
  cast: [
    { look: COUSIN, x: 860, y: at(0).y, yaw: 0.45, faces: [[0, 'smug']], pose: { armR: { a: 80, b: -60 } } },
    { look: N3, x: 1100, y: at(0).y, yaw: -0.45, faces: [[0, 'shock']] },
  ],
  cam: { from: [980, 560, 1.7], to: [980, 560, 1.8] },
});

export const S4 = laptopCU((t) => <ForumScreen hot="Kid says he's from the future" t={t} posts={['Kid predicted the World Cup', "Kid says he's from the future", 'lol fake', 'Pizza for bitcoins?']} />);
export const S5 = faceCU({ look: YOU, Bg: DAY, faces: [[0, 'smug']], yaw: 0.3, zoom: [3.0, 3.2] });

// ---------- S6: night: headlights turn into your street ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 640, kf(t, [[0, 1.3], [len, 1.45]]))}>
    <NIGHT t={t + 100} id="s6" />
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.35} />
    <BlackCarFront x={kf(t, [[0, 1700], [len, 1150]])} y={900} s={1.2} lights={1} />
  </g>
);

// ---------- S7-S9: the black car across the street: day, morning, after school ----------
const parked = (Set: typeof DAY, look: 'neutral' | 'worried', walk = false): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const x = walk ? kf(t, [[0, 400], [len, 900]], (k) => k) : 520;
    const step = walk ? Math.sin(t / 4) : 0;
    const me: Pose = { ...at(x, { yaw: walk ? 0.5 : 0.6, expr: look, blink: idleBlink(t, 3), look: 0.8 }), legL: { a: step * 25, b: 8 }, legR: { a: -step * 25, b: 8 } };
    return (
      <g transform={camT(1000, 600, kf(t, [[0, 1.15], [len, 1.22]]))}>
        <Set t={t + 800} id="pk" />
        <ModernCar x={1350} y={950} s={1.15} color="#16141C" />
        <Hero look={YOU} pose={me} />
      </g>
    );
  };
  return Shot;
};
export const S7 = parked(DAY, 'neutral');
export const S8 = parked(MORN, 'worried');
export const S9 = parked(DUSK, 'worried', true);

// ---------- S10: the kitchen: the man in the grey suit, drinking tea with Mum ----------
const K1 = stand(KITCHEN, 0.32, 0.45), K2 = stand(KITCHEN, 0.6, 0.45), K3 = stand(KITCHEN, 0.84, 0.4);
export const S10 = talkShot({
  Set: KIT, setT: 900,
  cast: [
    { look: MUM10, ...K1, yaw: 0.4, faces: [[0, 'happy']] },
    { look: SUIT, ...K2, yaw: -0.3, faces: [[0, 'smug']], pose: { armR: { a: 100, b: 40 } } },
    { look: YOU, ...K3, yaw: -0.5, faces: [[0, 'shock']] },
  ],
  cam: { from: [1000, 560, 1.15], to: [1000, 560, 1.22] },
  front: () => <KitchenIsland />,
});

export const S11 = faceCU({ look: SUIT, Bg: KIT, faces: [[0, 'smug']], yaw: -0.3, zoom: [3.0, 3.2] });
export const S12 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'worried']], yaw: 0.3, zoom: [3.1, 3.35] });
export const S13 = faceCU({ look: MUM10, Bg: KIT, faces: [[0, 'happy'], [30, 'shock']], yaw: 0.3, zoom: [3.0, 3.2] });

// ---------- S14: his shoes, spotless, a glint ----------
export const S14 = propCU({
  Bg: KIT,
  draw: (t) => (
    <g>
      <rect y={820} width={1920} height={300} fill="#2C2A30" />
      {[760, 1120].map((x, i) => (
        <g key={i}>
          <rect x={x - 70} y={420} width={140} height={360} fill="#5A5A64" stroke="#100E16" strokeWidth={8} />
          <path d={`M ${x - 90} 780 L ${x + 180} 780 Q ${x + 220} 820 ${x + 180} 850 L ${x - 90} 850 Z`} fill="#141218" stroke="#100E16" strokeWidth={8} />
          <path d={`M ${x + 20} 792 Q ${x + 100} 786 ${x + 160} 800`} stroke="#F6EFE3" strokeWidth={8} fill="none" opacity={0.8} />
        </g>
      ))}
      <circle cx={1290} cy={800} r={30 * Math.max(0, Math.sin(t / 6))} fill="#FFF" opacity={0.85} />
    </g>
  ),
});

// ---------- S15: his phone on the table: thinner than anything in 2011 ----------
export const S15 = propCU({
  Bg: KIT,
  push: 0.1,
  draw: (t) => (
    <g>
      <rect y={700} width={1920} height={400} fill="#B9AE9C" />
      <Mug x={560} y={700} rot={0} f={t} />
      <Glow x={1100} y={600} r={320} kind="cool" o={0.4} />
      <Smartphone x={1100} y={600} s={0.9} rot={-70} mode="lock" t={t} battery={88} glow={1} status={false} />
    </g>
  ),
});
export const S16 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'neutral'], [16, 'shock']], yaw: 0.25, zoom: [3.2, 3.5], glint: 1 });

// ---------- S17: two-shot across the table: he says what you did ----------
export const S17 = talkShot({
  Set: KIT, setT: 1000, words,
  cast: [
    { look: SUIT, x: 820, y: K2.y, scale: K2.scale, yaw: 0.45, talk: [span(words, 'You', 'to')], faces: [[0, 'smug']] },
    { look: YOU, x: 1150, y: K3.y, scale: K3.scale, yaw: -0.45, faces: [[0, 'worried']] },
  ],
  cam: { from: [980, 520, 1.6], to: [980, 520, 1.72] },
  front: () => <KitchenIsland />,
});

// ---------- S18: he opens the briefcase: cash ----------
export const S18 = propCU({ Bg: KIT, draw: (t) => <Briefcase x={960} y={640} s={1.6} open={easeOut(clamp((t - 6) / 20))} /> });
export const S19 = bigWord({ kicker: 'IN 2011, FOR A KID', word: '$50,000', color: '#7FE08A', Bg: KIT });
export const S20 = faceCU({ look: SUIT, Bg: KIT, faces: [[0, 'smug']], yaw: -0.25, zoom: [3.2, 3.45], words, talk: span(words, 'coins', 'Tonight') });
export const S21 = faceCU({ look: MUM10, Bg: KIT, faces: [[0, 'shock']], yaw: 0.3, zoom: [3.1, 3.3] });
export const S22 = laptopCU(() => <WalletScreen coins="10,000 ₿" usd="≈ $150,000" note="on paper · until the crash" />, KIT);
export const S23 = faceCU({ look: YOU, Bg: KIT, faces: [[0, 'worried']], yaw: 0.2, zoom: [3.3, 3.6] });

// ---------- S24: he leans in, close to you ----------
export const S24 = talkShot({
  Set: KIT, setT: 1100,
  cast: [
    { look: SUIT, x: 900, y: K2.y, scale: K2.scale, yaw: 0.5, faces: [[0, 'smug']], pose: { tilt: 10 } },
    { look: YOU, x: 1110, y: K3.y, scale: K3.scale, yaw: -0.45, faces: [[0, 'worried']] },
  ],
  cam: { from: [1000, 470, 2.0], to: [1000, 470, 2.25] },
});

// ---------- S25: "I know what they're worth in 2024." ----------
export const S25 = faceCU({
  look: SUIT, Bg: KIT, faces: [[0, 'smug']], yaw: -0.2, zoom: [3.6, 4.0], words, talk: span(words, 'I', '2024'),
  front: (t) => <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FF5A4A" stroke="#0B0816" strokeWidth={12} paintOrder="stroke" opacity={clamp((t - 50) / 8)}>2024</text>,
});
