import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, faceAt, Glow, factCard, FONT, Foreground, talkAt } from '../../../engine';
import { YOU, ELLIE, TULLIA, FELIX, OFFICIAL, SOLDIER, CITIZENS, faceCU, wordF, span } from '../common';
import { RomeStreet, ShopInside, ShopCounter, CircusMaximus, CrowdFront, BurgerBasket, WaxTablet, HoneyCake, Coin, FarRome, RomeSky, romeHip, SHOP, CIRCUS, P0 } from '../sets';
import { street, shop, onStreet, atCounter, insert, streetSet, shopSet, circusSet, realCard, inStands, Chip } from '../kit';
import words from './words.json';

// Chapter 5, someone notices: selling at the chariot races (the Circus Maximus seats about 150,000); Felix and his
// friends in the stands; the crowd chants BURGUS instead of cheering the chariots; up in the emperor's box someone
// notices. Next morning, a man in a toga with a wide purple stripe at your counter: bread and circuses (Juvenal), free
// grain for about 200,000 men; the contract on a wax tablet (the palace takes Burgus Maximus, every other cookshop
// closed); Tullia's silence; "Rome can be so dangerous for children."

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const BUSY = shopSet({});
const CIRC = circusSet({ cheer: 1, race: true });

// ---------- S1: you, pleased with yourself (a mistake) ----------
export const S1 = faceCU({ look: YOU, Bg: BUSY, faces: [[0, 'smug']], yaw: -0.2, zoom: [3.0, 3.1] });

// ---------- S2: the chariot races ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 0.85], [len, 0.95]]))}>
    <CircusMaximus t={t + 50} cheer={0.8} race={clamp(t / 90)} />
  </g>
);

// ---------- S3: about 150,000 seats ----------
export const S3 = factCard({ value: 150000, label: 'SEATS IN THE CIRCUS MAXIMUS', sub: 'Dionysius of Halicarnassus, Roman Antiquities 3.68' });

// ---------- S4: Felix and his friends in the stands with baskets of burgers, shouting ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const shout = Math.max(0, Math.sin(t / 3));
  const fx: Pose = { ...basePose, x: 900, y: CIRCUS.feet - 140, yaw: 0.3, expr: 'happy', armL: { a: 150, b: 20 }, armR: { a: 60, b: -70 }, talk: 0.3 + 0.6 * shout, blink: idleBlink(t, 2) };
  const fr: Pose = { ...basePose, x: 1300, y: CIRCUS.feet - 140 * 0.9, scale: 0.9, yaw: -0.3, expr: 'happy', armR: { a: 60, b: -70 }, talk: 0.6 * Math.max(0, Math.sin(t / 3 + 1)), blink: idleBlink(t, 4) };
  return (
    <g transform={camT(kf(t, [[0, 1000], [len, 1100]]), 640, 1.35)}>
      <CircusMaximus t={t + 100} cheer={0.6} />
      <Hero look={FELIX} pose={fx} />
      <BurgerBasket x={990} y={CIRCUS.feet - 120} s={0.8} />
      <Hero look={CITIZENS[3]} pose={fr} />
      <BurgerBasket x={1380} y={CIRCUS.feet - 110} s={0.7} />
    </g>
  );
};

// ---------- S5: by the fourth race, nobody is watching the chariots ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 640, 1.0)}>
      <CircusMaximus t={t + 200} cheer={0.2} race={(t % 70) / 70} />
    </g>
    <Chip t={t - 4} text="RACE IV" x={120} y={110} />
  </g>
);

// ---------- S6: the crowd chants BURGUS! BURGUS! BURGUS! ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const beats = [at('Burgus', 1), at('Burgus', 2), at('Burgus', 3)].map((b) => b - at("They're"));
  const n = beats.filter((b) => t >= b).length;
  const last = beats[Math.max(0, n - 1)];
  const pulse = n ? 1 + 0.25 * Math.max(0, 1 - (t - last) / 8) : 0;
  return (
    <g>
      <g transform={camT(960, 360, 1.25)}>
        <CircusMaximus t={t + 260} cheer={1.4} />
      </g>
      <Foreground blur={6}><CrowdFront t={t} cheer={1.4} y={980} /></Foreground>
      {n ? (
        <g transform={`translate(960 520) scale(${pulse})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={220} fill="#FFD23A" stroke="#0B0816" strokeWidth={18} paintOrder="stroke">BURGUS!</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S7: up in the emperor's box, a figure in purple leans forward ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1180, kf(t, [[0, 330], [len, 290]]), kf(t, [[0, 2.2], [len, 3.4]]))}>
    <CircusMaximus t={t + 300} cheer={1} />
    <rect x={1100} y={210} width={160} height={150} fill="#0B0816" opacity={0.25} />
    <Glow x={1180} y={280} r={140} kind="red" o={0.4} />
  </g>
);

// ---------- S8: next morning: the man in the purple-striped toga at your counter ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 900], [len, 1000]]), 520, kf(t, [[0, 1.1], [len, 1.25]]))}>
    <ShopInside t={t + 400} />
    <Hero look={YOU} pose={{ ...basePose, x: 700, y: SHOP.hip, yaw: 0.4, expr: 'neutral', blink: idleBlink(t, 1) }} />
    <Hero look={TULLIA} pose={{ ...basePose, x: 960, y: SHOP.hip, yaw: 0.3, expr: 'worried', blink: idleBlink(t, 3) }} />
    <ShopCounter />
    <Hero look={OFFICIAL} pose={{ ...basePose, x: 1340, y: 800, scale: 2.0, yaw: -0.6, expr: 'smug', armL: { a: 50, b: -90 }, blink: idleBlink(t, 4) }} shadow={0} />
    <Chip t={t - 4} text="NEXT MORNING" x={120} y={110} />
  </g>
);

const offTalk = (a: string, b: string, n = 1) => span(W, a, b, n);
// ---------- S9: he explains how Rome works ----------
export const S9 = faceCU({ look: OFFICIAL, Bg: BUSY, faces: [[0, 'smug']], yaw: -0.3, zoom: [3.0, 3.2], words: W, talk: offTalk('He', 'works', 2) });

// ---------- S10: the emperor keeps the people quiet with free food and shows ----------
export const S10 = realCard({ kicker: 'HOW ROME WORKS', big: ['FREE FOOD', '+ SHOWS'], real: false });

// ---------- S11: bread and circuses ----------
export const S11 = realCard({ kicker: 'A ROMAN POET CALLED IT', big: ['BREAD AND CIRCUSES'], sub: 'Juvenal, Satire 10: "panem et circenses"' });

// ---------- S12: free grain every month for about 200,000 men ----------
export const S12 = factCard({ value: 200000, label: 'MEN IN ROME GIVEN FREE GRAIN EACH MONTH', sub: 'Res Gestae of Augustus, 15' });

// ---------- S13: "The people love your food. So from tomorrow, it's the emperor's food." ----------
export const S13 = shop({
  cast: [atCounter(YOU, 780, { yaw: 0.5, faces: [[0, 'neutral'], [70, 'shock']] }), atCounter(TULLIA, 560, { yaw: 0.5, faces: [[0, 'worried']] })],
  words: W, cam: { from: [1000, 500, 1.5], to: [1040, 500, 1.65] },
  front: (t) => <Hero look={OFFICIAL} pose={{ ...basePose, x: 1260, y: 780, scale: 1.8, yaw: -0.6, expr: 'smug', talk: 0, armR: { a: 40 + Math.max(0, Math.sin(t / 9)) * 30, b: -60 }, blink: idleBlink(t, 4) }} shadow={0} />,
});

// ---------- S14: he slides a wax tablet across the counter ----------
export const S14 = insert({
  Bg: BUSY, zoom: [1.8, 1.9], cy: 600, dim: 0.25,
  draw: (t) => {
    const k = easeOut(clamp(t / 30));
    return (
      <g>
        <rect x={200} y={560} width={1520} height={500} fill="#EDE6DA" />
        <rect x={200} y={550} width={1520} height={20} fill="#F6F0E6" />
        <WaxTablet x={1500 - 540 * k} y={700} s={1.3} rot={-4 + 4 * k} />
        <path d={`M ${1620 - 540 * k} 800 L ${1760 - 540 * k} 860`} stroke={OFFICIAL.line} strokeWidth={34} strokeLinecap="round" />
        <path d={`M ${1620 - 540 * k} 800 L ${1760 - 540 * k} 860`} stroke="#F2ECDE" strokeWidth={26} strokeLinecap="round" />
        <ellipse cx={1610 - 540 * k} cy={790} rx={30} ry={22} fill="#26232F" stroke={P0} strokeWidth={4} />
      </g>
    );
  },
});

// ---------- S15: the contract: Burgus Maximus becomes property of the palace ----------
export const S15 = insert({
  Bg: BUSY, zoom: [2.2, 2.3], cy: 560, dim: 0.35,
  draw: (t) => (
    <g>
      <WaxTablet x={960} y={560} s={2} lines={6} />
      <g opacity={clamp((t - 10) / 6)}>
        <text x={960} y={470} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={44} fill="#F2E6C8">BVRGVS MAXIMVS</text>
        <text x={960} y={540} textAnchor="middle" fontFamily={FONT.hand} fontWeight={700} fontSize={36} fill="#F2E6C8">→ PROPERTY OF THE PALACE</text>
      </g>
    </g>
  ),
});

// ---------- S16: what you'd get: a house on the Palatine, money forever ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(400, kf(t, [[0, 460], [len, 420]]), kf(t, [[0, 1.6], [len, 1.8]]))}>
      <RomeSky id="pal" t={t} mode="dusk" />
      <FarRome mode="dusk" circus={false} />
      <Glow x={180} y={330} r={400} kind="warm" o={0.8} />
    </g>
    {Array.from({ length: 14 }).map((_, k) => {
      const q = ((t * 1.2 + k * 17) % 90) / 90;
      return <Coin key={k} x={200 + ((k * 137) % 1500)} y={-60 + q * 1200} r={34} metal={k % 3 ? 'bronze' : 'silver'} spin={t / 4 + k} />;
    })}
    <Chip t={t - 6} text="PALATINE HILL" x={1300} y={110} />
  </g>
);

// ---------- S17: every other cookshop on the street, closed by order: soldiers board them up ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 1300], [len, 1400]]), 540, 1.25)}>
    <RomeStreet t={t + 500} />
    {[1100, 1500, 1900].map((bx, k) => (
      <g key={k} opacity={clamp((t - k * 12) / 4)}>
        <path d={`M ${bx} ${romeHip(1) - 40} L ${bx + 200} ${romeHip(1) - 120} M ${bx} ${romeHip(1) - 120} L ${bx + 200} ${romeHip(1) - 40}`} stroke="#6A4026" strokeWidth={26} strokeLinecap="round" />
      </g>
    ))}
    <Hero look={SOLDIER} pose={{ ...basePose, x: 1400, y: romeHip(1), yaw: 0.5, expr: 'smug', armR: { a: 110 + Math.abs(Math.sin(t / 3)) * 30, b: -40 }, blink: idleBlink(t, 2) }} />
  </g>
);

// ---------- S18: Tullia looks at you; she doesn't say a word ----------
export const S18 = faceCU({ look: TULLIA, Bg: BUSY, faces: [[0, 'worried']], yaw: 0.3, eyes: 0.6, zoom: [3.2, 3.6], dark: 0.1 });

// ---------- S19: you say you need to think; "Of course," he says ----------
export const S19 = shop({
  cast: [atCounter(YOU, 820, { yaw: 0.5, faces: [[0, 'worried']], talk: [span(W, 'You', 'it', 2)] }), atCounter(ELLIE, 1040, { yaw: 0.3, faces: [[0, 'happy']] }, 0.7)],
  words: W, cam: { from: [1040, 500, 1.55], to: [1060, 500, 1.6] },
  front: (t) => <Hero look={OFFICIAL} pose={{ ...basePose, x: 1340, y: 780, scale: 1.8, yaw: -0.6, expr: 'smug', blink: idleBlink(t, 4) }} shadow={0} />,
});

// ---------- S20: he smiles at Ellie and gives her a honey cake ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const give = easeOut(clamp((t - 30) / 12));
  return (
    <g transform={camT(1000, 560, kf(t, [[0, 1.5], [len, 1.65]]))}>
      <RomeStreet t={t + 600} />
      <Hero look={ELLIE} pose={{ ...basePose, x: 900, y: romeHip(0.7), scale: 0.7, yaw: 0.5, expr: give > 0.6 ? 'happy' : 'neutral', armR: { a: 80 * give, b: -20 }, blink: idleBlink(t, 2) }} />
      <Hero look={OFFICIAL} pose={{ ...basePose, x: 1140, y: romeHip(1) + 20, yaw: -0.5, tilt: -14, expr: 'happy', armR: { a: 70, b: -10 }, blink: idleBlink(t, 3) }} />
      <HoneyCake x={1060 - 80 * give} y={romeHip(1) - 10 + 20 * give} s={0.5} />
    </g>
  );
};

// ---------- S21: "What a sweet girl. Rome can be so dangerous for children." ----------
export const S21 = faceCU({ look: OFFICIAL, Bg: streetSet({ mode: 'dusk' }), faces: [[0, 'happy'], [40, 'smug']], yaw: -0.25, zoom: [3.4, 3.9], words: W, talk: span(W, "'What", "children"), light: { x: 960, y: 420, kind: 'red', o: 0.4 }, dark: 0.25 });
