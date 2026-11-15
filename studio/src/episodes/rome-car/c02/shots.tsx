import React from 'react';
import { Hero, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, Glow, factCard, SchLabel, SCH, DrawOn, FONT, Toast } from '../../../engine';
import { YOU, faceCU, bigWord, wordF, iconBoard, SchematicBg, onGround, romeCard, DarkBg } from '../common';
import { Country, Forum, CityGate, GROUND, Car, CarFront } from '../sets';
import words from './words.json';

// Chapter 2, the rule: Rome, AD 113, Trajan's empire from the Atlantic to the Red Sea, a million people; what you
// have (one car, a full tank, two dead phones, a charger, chips, Mo's playlist); the car works perfectly; the rule:
// the nearest gas station is 1,800 years away. And yours is the only engine on the planet.

const W = words as { w: string; s: number; e: number }[];
const rel = (a: string, b: string) => wordF(W, b) - wordF(W, a);
const DUSK: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Country t={t} id={id} mode="dusk" />;

// ---------- S1: card: ROME, AD 113 ----------
export const S1 = romeCard({ kicker: 'ROME', title: 'AD 113', Bg: ({ t, id }) => <Forum t={t} id={id} crowd={1} /> });

// ---------- S2: the empire: a rough Mediterranean, the Roman lands drawing on around it, Atlantic to the Red Sea ----------
const SEA = 'M 300 520 Q 420 430 600 470 Q 760 400 900 480 Q 1040 420 1180 470 Q 1320 430 1460 500 Q 1560 560 1600 640 Q 1480 690 1320 650 Q 1160 700 1000 660 Q 860 720 700 650 Q 540 700 420 640 Q 320 610 300 520 Z';
const EMPIRE = 'M 160 380 Q 400 250 700 300 Q 1000 230 1300 300 Q 1560 330 1720 520 Q 1780 700 1680 820 Q 1500 860 1300 800 Q 1000 860 700 820 Q 400 840 220 740 Q 120 600 160 380 Z';
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <SchematicBg t={t} />
    <path d={EMPIRE} fill={SCH.live} opacity={0.18 * clamp((t - 10) / 20)} />
    <DrawOn d={EMPIRE} t={t - 4} dur={30} color={SCH.live} width={8} />
    <DrawOn d={SEA} t={t} dur={20} color={SCH.line} width={5} />
    <SchLabel x={960} y={150} t={t - 2} text="THE ROMAN EMPIRE, AD 113" size={46} color={SCH.dim} />
    <SchLabel x={190} y={300} t={t - rel('emperor', 'Atlantic')} text="ATLANTIC" size={34} />
    <SchLabel x={1700} y={900} t={t - rel('emperor', 'Red')} text="RED SEA" size={34} />
    <g opacity={clamp((t - 14) / 6)}>
      <circle cx={860} cy={500} r={14 + Math.sin(t / 5) * 3} fill={SCH.live} />
      <SchLabel x={860} y={460} t={t - 16} text="ROME" size={30} color={SCH.live} />
    </g>
  </g>
);

// ---------- S3: about a million people ----------
export const S3 = factCard({ value: 1000000, label: 'PEOPLE IN ROME (ABOUT)', sub: 'the biggest city on Earth', format: (v) => Math.round(v).toLocaleString('en-US') });

// ---------- S4: what you've got ----------
export const S4 = iconBoard({
  title: "WHAT YOU'VE GOT",
  cols: 3,
  s: 0.8,
  items: [
    { name: 'car', label: 'ONE CAR', at: rel("Here's", 'car') },
    { name: 'fuel', label: 'FULL TANK: 600 KM', at: rel("Here's", 'full'), live: rel("Here's", 'full') },
    { name: 'phone', label: 'NO SIGNAL', at: rel("Here's", 'phones'), cross: rel("Here's", 'signal') + 6 },
    { name: 'plug', label: 'A CHARGER', at: rel("Here's", 'charger') },
    { name: 'chips', label: 'HALF A BAG', at: rel("Here's", 'chips') },
    { name: 'music', label: "MO'S PLAYLIST", at: rel("Here's", 'playlist'), live: rel("Here's", 'playlist') },
  ],
});

// ---------- S5: the car works: lights flash on the words, horn waves, the speakers thump ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const lt = rel('The', 'lights'), hn = rel('The', 'horn'), sp = rel('The', 'speakers');
  const lights = t >= lt ? 1 : 0;
  const thump = t >= sp ? 1 + 0.04 * Math.abs(Math.sin(t / 2.5)) : 1;
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 980]]), 640, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <CityGate t={t + 40} />
      <g transform={`translate(960 ${GROUND}) scale(${thump}) translate(-960 ${-GROUND})`}>
        <Car x={960} y={GROUND} s={0.9} lights={lights} t={t} id="c2s5" bounce={t >= sp ? Math.abs(Math.sin(t / 2.5)) * 6 : 0} />
      </g>
      {t >= hn
        ? [0, 1, 2].map((k) => {
            const p = ((t - hn) / 14 + k / 3) % 1;
            return <path key={k} d={`M ${1400 + p * 160} ${640 - 60 - p * 60} Q ${1440 + p * 200} 640 ${1400 + p * 160} ${640 + 60 + p * 60}`} stroke="#FFF6D0" strokeWidth={8} fill="none" opacity={1 - p} />;
          })
        : null}
    </g>
  );
};

// ---------- S6: low and heroic: the car head-on at dusk, headlights blazing ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 700], [len, 660]]), kf(t, [[0, 1.6], [len, 1.75]]))}>
    <DUSK t={t + 100} />
    <CarFront x={960} y={GROUND + 60} s={1.1} lights={1} high={0.3 + 0.1 * Math.sin(t / 6)} id="c2s6" />
  </g>
);

// ---------- S7: THE RULE ----------
export const S7 = bigWord({ kicker: "BUT HERE'S", word: 'THE RULE', color: '#FF4A3A', Bg: DUSK });

// ---------- S8: the nearest gas station, 1,800 years away ----------
export const S8: React.FC<ShotProps> = ({ t }) => {
  const yrs = Math.round(1800 * easeOut(clamp((t - rel('nearest', 'eighteen') + 4) / 30)));
  return (
    <g>
      <DarkBg t={t} />
      <SchLabel x={960} y={300} t={t - 2} text="NEAREST GAS STATION" size={50} color={SCH.dim} />
      <g transform={`translate(960 600) scale(${backOut(clamp((t - 6) / 9))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={210} fill="#FFD23A" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">{yrs.toLocaleString('en-US')}</text>
      </g>
      <SchLabel x={960} y={760} t={t - 14} text="YEARS AWAY" size={64} />
      {/* a tiny pump icon at the far end of a long timeline */}
      <path d={`M 300 900 L ${300 + 1320 * clamp(t / 40)} 900`} stroke={SCH.line} strokeWidth={5} strokeDasharray="14 10" />
      <circle cx={300} cy={900} r={12} fill={SCH.live} />
      <text x={300} y={960} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={SCH.dim}>AD 113</text>
      <text x={1620} y={960} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill={SCH.dim} opacity={clamp((t - 40) / 6)}>1900s</text>
    </g>
  );
};

// ---------- S9: one drop of fuel falls, and is gone ----------
export const S9: React.FC<ShotProps> = ({ t }) => {
  const p = clamp(t / 26);
  const y = 200 + easeOut(p) * 0 + p * p * 520;
  const gone = clamp((t - 26) / 10);
  return (
    <g>
      <DarkBg t={t} />
      <Glow x={960} y={720} r={400} o={0.3 * gone} />
      <g transform={`translate(960 ${y}) scale(${1 - gone})`} opacity={1 - gone}>
        <path d="M 0 -90 Q 56 -10 56 30 Q 56 84 0 84 Q -56 84 -56 30 Q -56 -10 0 -90 Z" fill="#E8B84A" stroke="#100E16" strokeWidth={6} />
        <path d="M -24 10 Q -26 50 0 60" stroke="#FFF2B0" strokeWidth={8} fill="none" strokeLinecap="round" />
      </g>
      {Array.from({ length: 8 }).map((_, k) => {
        const a = (k / 8) * Math.PI * 2;
        return <circle key={k} cx={960 + Math.cos(a) * 140 * gone} cy={720 + Math.sin(a) * 60 * gone - 80 * gone} r={10 * (1 - gone) + 2} fill="#FF8A3D" opacity={gone > 0 ? 1 - gone : 0} />;
      })}
      <Toast x={960} y={900} t={t - 30} text="GONE FOREVER" hold={60} />
    </g>
  );
};

// ---------- S10: you look at the car, uneasy ----------
export const S10 = faceCU({ look: YOU, Bg: DUSK, faces: [[0, 'neutral'], [16, 'worried']], yaw: 0.5, zoom: [3.2, 3.4], light: { x: 1150, y: 480, o: 0.6 } });

// ---------- S11: the globe, and one engine on it ----------
export const S11: React.FC<ShotProps> = ({ t }) => {
  const spin = t * 1.2;
  return (
    <g>
      <SchematicBg t={t} />
      <circle cx={960} cy={540} r={300} fill="#14243A" stroke={SCH.line} strokeWidth={6} />
      {[-1, -0.5, 0, 0.5, 1].map((k, i) => (
        <ellipse key={i} cx={960} cy={540} rx={Math.abs(Math.cos(((spin + i * 36) * Math.PI) / 180)) * 300} ry={300} fill="none" stroke={SCH.grid} strokeWidth={4} />
      ))}
      {[-200, -100, 0, 100, 200].map((dy) => (
        <path key={dy} d={`M ${960 - Math.sqrt(300 * 300 - dy * dy)} ${540 + dy} L ${960 + Math.sqrt(300 * 300 - dy * dy)} ${540 + dy}`} stroke={SCH.grid} strokeWidth={4} />
      ))}
      <circle cx={900} cy={430} r={16 + 6 * Math.abs(Math.sin(t / 6))} fill={SCH.live} />
      <circle cx={900} cy={430} r={40 + ((t * 2) % 60)} fill="none" stroke={SCH.live} strokeWidth={4} opacity={1 - ((t * 2) % 60) / 60} />
      <SchLabel x={960} y={170} t={t - 2} text="ENGINES ON EARTH" size={46} color={SCH.dim} />
      <g transform={`translate(1420 560) scale(${backOut(clamp((t - 10) / 9))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={220} fill={SCH.live} stroke="#0B0816" strokeWidth={14} paintOrder="stroke">1</text>
      </g>
    </g>
  );
};

// ---------- S12: the car alone at dusk, a slow push: remember that ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 1060]]), kf(t, [[0, 600], [len, 650]]), kf(t, [[0, 1.2], [len, 1.9]]))}>
    <DUSK t={t + 160} />
    <Car x={960} y={GROUND} s={0.8} t={t} id="c2s12" />
    <Hero look={YOU} pose={onGround(1420, 0.8, { yaw: -0.5, look: -0.7, expr: 'worried', blink: idleBlink(t, 2) })} />
  </g>
);
