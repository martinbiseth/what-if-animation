import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, backOut, ShotProps, idleBlink, FONT, factCard, PinnedPage, OldRadio, ModernCar, SUBURB, Glow, Smartphone } from '../../../engine';
import words from './words.json';
import {
  YOU, SUIT, KID, FARMER, NURSE, N1, N3, GRAN, N2, StreetSet, phoneCU, propCU, faceCU, talkShot, netCard, listCard, HeldPhone, at, crowd, span,
} from '../common';

// Chapter 5, someone notices: everyone's phone is a torch, yours holds all of Wikipedia; you become the town's
// library (questions at the door, pages on the library door, a boy's radio brought back to life); a black car;
// the man in the grey suit with clean shoes: "We'd like to borrow it."

const DAY = StreetSet('day', { cars: false });
const DUSK = StreetSet('dusk', { cars: false });
const NIGHT = StreetSet('night', { cars: false, lit: 0.5 });

export const S1 = netCard({ kicker: 'CHAPTER 5', title: 'THE LIBRARY', red: 0.3 });

// ---------- S2: dusk: neighbours using their phones as torches, beams sweeping ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const people = crowd(7, 220, 1700, 31, { faceTo: 960 });
  return (
    <g transform={camT(960, 560, kf(t, [[0, 1.1], [len, 1.18]]))}>
      <NIGHT t={t + 3000} id="s2" />
      {people.map((c, i) => {
        const p: Pose = { ...basePose, x: c.x, y: c.y, scale: c.scale ?? 1, yaw: i % 2 ? 0.4 : -0.4, expr: 'neutral', armR: { a: 80, b: -20 }, blink: idleBlink(t, i) };
        const sw = Math.sin((t + i * 20) / 18) * 0.5;
        return (
          <g key={i}>
            <path d={`M ${c.x + 40} ${c.y - 80} L ${c.x + 40 + Math.cos(sw + 0.4) * 700} ${c.y + 200 + Math.sin(sw) * 200} L ${c.x + 40 + Math.cos(sw - 0.1) * 700} ${c.y + 380 + Math.sin(sw) * 200} Z`} fill="#FFF6C8" opacity={0.12} />
            <Hero look={c.look} pose={p} />
          </g>
        );
      })}
    </g>
  );
};

export const S3 = faceCU({ look: YOU, Bg: DUSK, faces: [[0, 'neutral'], [10, 'smug']], yaw: 0.2, zoom: [3.0, 3.2] });
export const S4 = phoneCU({ mode: 'download', text: 'Wikipedia (English)|102 GB', bgColor: '#1A2A4A', push: 0.08 });
export const S5 = factCard({ value: 7, suffix: ' MILLION', label: 'ARTICLES: ALL OF WIKIPEDIA, WITH PICTURES', sub: 'ABOUT 100 GB · FITS ON A PHONE', format: (v) => (v >= 6.95 ? 'ALMOST 7' : v.toFixed(0)) });
export const S6 = faceCU({ look: YOU, Bg: DUSK, faces: [[0, 'tired']], yaw: -0.2, zoom: [3.1, 3.3] });
export const S7 = phoneCU({ mode: 'wikihome', Bg: DUSK, push: 0.1, battery: 38 });
export const S8 = listCard({
  title: 'IN YOUR POCKET',
  items: [{ at: 3, text: 'PURIFY WATER', ok: true }, { at: 45, text: 'TREAT A BURN', ok: true }, { at: 78, text: 'FIX AN ENGINE', ok: true }, { at: 120, text: 'GROW POTATOES', ok: true }],
});

// ---------- S9: a queue at your front door; you read answers off the phone ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const line = [FARMER, NURSE, N1, GRAN, N3];
  const me: Pose = at(1500, { yaw: -0.5, expr: 'neutral', armR: { a: 80, b: -40 }, blink: idleBlink(t, 3), talk: Math.abs(Math.sin(t / 3)) * 0.6 });
  return (
    <g transform={camT(kf(t, [[0, 1100], [len, 1180]]), 560, 1.2)}>
      <DAY t={t + 3100} id="s9" />
      {line.map((look, i) => <Hero key={i} look={look} pose={at(1280 - i * 200, { yaw: 0.5, expr: i === 0 ? 'happy' : 'neutral', look: 0.8, blink: idleBlink(t, i + 5) })} />)}
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={me} t={t} mode="wiki" />
    </g>
  );
};

// ---------- S10: the farmer, the nurse, the solar guy: one after another at your door ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const who = t < 50 ? FARMER : t < 95 ? NURSE : N3;
  const me: Pose = at(1110, { yaw: -0.4, expr: 'neutral', armR: { a: 80, b: -40 }, blink: idleBlink(t, 3) });
  return (
    <g transform={camT(960, 560, 1.75)}>
      <DAY t={t + 3200} id="s10" />
      <Hero look={who} pose={at(800, { yaw: 0.45, expr: 'worried', blink: idleBlink(t, 8), armR: { a: 40, b: -60 } })} />
      <Hero look={YOU} pose={me} />
      <HeldPhone pose={me} t={t} mode="wiki" />
      {t > 95 ? (
        <g transform="translate(560 640)">
          <rect x={-90} y={-60} width={180} height={120} fill="#2A3A6A" stroke="#100E16" strokeWidth={5} />
          {[0, 1, 2].map((k) => <path key={k} d={`M ${-90 + k * 60} -60 V 60`} stroke="#5A7AB8" strokeWidth={3} />)}
        </g>
      ) : null}
    </g>
  );
};

// ---------- S11: the library door filling up with your hand-written pages ----------
export const S11 = propCU({
  Bg: DAY,
  draw: (t) => {
    const titles = ['CLEAN WATER', 'FIRST AID', 'BURNS', 'POTATOES', 'ENGINES', 'SOLAR', 'RADIO', 'FEVER'];
    return (
      <g>
        <rect x={560} y={60} width={800} height={1100} fill="#5A3A2A" stroke="#2A1A10" strokeWidth={12} />
        <text x={960} y={40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" stroke="#0B0816" strokeWidth={8} paintOrder="stroke">LIBRARY</text>
        {titles.map((ti, i) => (t > i * 12 ? <PinnedPage key={i} x={720 + (i % 3) * 240} y={260 + Math.floor(i / 3) * 330} s={0.8} rot={(i % 2 ? 4 : -3)} title={ti} /> : null))}
      </g>
    );
  },
});

// ---------- S12: the boy with his grandad's radio; ten minutes later it crackles ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const on = t > 171 ? 1 : 0;
  return (
    <g transform={camT(960, 640, kf(t, [[0, 1.7], [len, 1.85]]))}>
      <DUSK t={t + 3300} id="s12" />
      <Hero look={KID} pose={at(820, { y: at(0, {}, 0.72).y, scale: 0.72, yaw: 0.4, expr: on ? 'happy' : 'worried', blink: idleBlink(t, 2), armL: { a: 60, b: -60 }, armR: { a: 60, b: -60 } }, 0.72)} />
      <Hero look={YOU} pose={at(1120, { yaw: -0.4, expr: on ? 'happy' : 'neutral', blink: idleBlink(t, 4), armR: { a: 70, b: -40 } })} />
      <OldRadio x={830} y={660} s={0.5} on={on} t={t} />
    </g>
  );
};

// ---------- S13: night, the empty street: a black car rolls in, headlights on, and stops ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, -500], [90, 1000]], (k) => 1 - Math.pow(1 - k, 3));
  return (
    <g transform={camT(960, 600, kf(t, [[0, 1.0], [len, 1.08]]))}>
      <NIGHT t={t + 3400} id="s13" />
      <ModernCar x={x} y={SUBURB.kerb + 230} s={1.1} dark lights={1} />
    </g>
  );
};

// ---------- S14: the man in the grey suit gets out of the car ----------
export const S14 = talkShot({
  Set: NIGHT, setT: 3500,
  cast: [{ look: SUIT, x: 1180, y: at(0).y, yaw: -0.3, faces: [[0, 'neutral'], [30, 'smug']] }],
  cam: { from: [1050, 600, 1.6], to: [1050, 600, 1.7] },
  back: () => <ModernCar x={900} y={SUBURB.kerb + 140} s={1.1} dark lights={1} />,
});

// ---------- S15: insert, his shoes: spotless, shining ----------
export const S15 = propCU({
  Bg: NIGHT,
  draw: (t) => (
    <g>
      <rect x={-400} y={760} width={2800} height={600} fill="#2A2830" />
      {[760, 1100].map((x, i) => (
        <g key={i}>
          <rect x={x - 40} y={300} width={110} height={420} fill="#474B55" />
          <path d={`M ${x - 60} 700 H ${x + 80} Q ${x + 230} 710 ${x + 240} 780 H ${x - 60} Z`} fill="#14151A" stroke="#05050A" strokeWidth={6} />
          <path d={`M ${x + 40} 720 Q ${x + 140} 722 ${x + 190} 750`} stroke="#FFFFFF" strokeWidth={10} opacity={0.6} fill="none" strokeLinecap="round" />
          {Math.floor(t / 8 + i) % 3 === 0 ? <path d={`M ${x + 150} 690 l 10 -30 l 10 30 l 30 10 l -30 10 l -10 30 l -10 -30 l -30 -10 Z`} fill="#FFFFFF" /> : null}
        </g>
      ))}
    </g>
  ),
});

// ---------- S16: your doorway at night: you open it; he's just standing there ----------
export const S16 = talkShot({
  Set: NIGHT, setT: 3600,
  cast: [
    { look: SUIT, x: 820, y: at(0).y, yaw: 0.4, faces: [[0, 'neutral']] },
    { look: YOU, x: 1140, y: at(0).y, yaw: -0.4, faces: [[0, 'worried']] },
  ],
  cam: { from: [980, 600, 1.75], to: [980, 600, 1.85] },
  front: () => <Glow x={1300} y={500} r={500} o={0.35} />,
});
export const S17 = faceCU({ look: SUIT, Bg: NIGHT, faces: [[0, 'neutral'], [80, 'smug']], yaw: 0.35, words, talk: [61.1, 65.3], zoom: [3.0, 3.15] });
export const S18 = faceCU({ look: YOU, Bg: NIGHT, faces: [[0, 'worried']], yaw: -0.3, zoom: [3.0, 3.2] });
export const S19 = faceCU({ look: SUIT, Bg: NIGHT, faces: [[0, 'smug']], yaw: 0.25, words, talk: [68.2, 69.9], zoom: [3.1, 3.4] });
