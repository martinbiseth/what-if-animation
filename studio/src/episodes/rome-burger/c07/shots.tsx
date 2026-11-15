import React from 'react';
import { Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, idleBlink, faceAt, Glow, FONT, factCard, Schematic, SCH, walkPose, LEG_LEN } from '../../../engine';
import { YOU, FELIX, OFFICIAL, SOLDIER, CITIZENS, faceCU, bigWord, wordF, span } from '../common';
import { RomeStreet, ShopInside, ShopCounter, Grill, Smoke, RomeMap, romeHip, SHOP, P0 } from '../sets';
import { insert, streetSet, shopSet, realCard, walker, Chip } from '../kit';
import words from './words.json';

// Chapter 7, the night of the fire: you remember history class; on the night of 18 July AD 64 a fire broke out in the
// shops around the Circus Maximus (Tacitus): six days, only four of fourteen districts untouched. You're in a shop by
// the Circus with a grill that has to burn all night. You turn to put it out; the man with the purple stripe in the
// doorway with two soldiers: "The grill stays lit." A shout; the sky over the Circus glows orange. Did you start it,
// or did someone want it to look like you did? Comments; is any of this real (the recap); part two.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const FIRE = streetSet({ mode: 'night', fire: 1 });
const NSHOP = shopSet({ night: true, grill: 1 });
const FSHOP = shopSet({ night: true, grill: 1, fire: 1 });

// ---------- S1: and that's when you remember ----------
export const S1 = faceCU({ look: YOU, Bg: NSHOP, faces: [[0, 'neutral'], [20, 'shock']], yaw: 0.1, zoom: [3.3, 3.9], glint: 0.7, glintColor: '#FF6A3A', dark: 0.3 });

// ---------- S2: the night of 18 July AD 64: a fire in the shops around the Circus Maximus ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
      <RomeMap t={t} burn={clamp((t - 60) / 400)} />
    </g>
    <Chip t={t - 4} text="18 JULY, AD 64" x={120} y={110} color="#FF4A3A" />
    <text x={960} y={1000} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} letterSpacing={6} fill="#F6EFE3" opacity={clamp((t - (at('Circus') - at('On'))) / 6)}>CIRCUS MAXIMUS</text>
  </g>
);

// ---------- S3: THE GREAT FIRE OF ROME ----------
export const S3 = bigWord({ kicker: 'THE GREAT FIRE OF ROME', word: 'AD 64', color: '#FF6A2A', Bg: FIRE, size: 220 });

// ---------- S4: it burned for six days ----------
export const S4 = factCard({ value: 6, suffix: ' DAYS', label: 'THE GREAT FIRE BURNED FOR', sub: 'Tacitus, Annals 15.40', real: false });

// ---------- S5: of fourteen districts, only four untouched ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <RomeMap t={t + 200} burn={1} />
    <text x={960} y={130} textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={70} fill="#FF8A3D" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={clamp(t / 6)}>ONLY 4 OF 14 DISTRICTS UNTOUCHED</text>
    <g opacity={clamp((t - (at('real') - at('Of'))) / 6)} transform={`translate(960 1000) scale(${backOut(clamp((t - (at('real') - at('Of'))) / 9))})`}>
      <rect x={-150} y={-46} width={300} height={70} rx={35} fill="#140E1C" stroke={SCH.live} strokeWidth={3} />
      <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>{"THAT'S REAL."}</text>
    </g>
  </g>
);

// ---------- S6: you, alone in a shop by the Circus Maximus, the grill burning ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 700], [len, 520]]), 500, kf(t, [[0, 1.2], [len, 1.5]]))}>
    <ShopInside t={t + 100} night grill={1} />
    <Hero look={YOU} pose={{ ...basePose, x: 480, y: SHOP.hip, yaw: -0.6, look: -0.8, expr: 'worried', blink: idleBlink(t, 1) }} rimId="rimRed" />
    <ShopCounter night />
  </g>
);

// ---------- S7: on the eighteenth of July ----------
export const S7 = bigWord({ word: '18 JULY', color: '#FF4A3A', Bg: NSHOP, size: 240 });

// ---------- S8: you turn to put the fire out: a bucket of water ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const turn = easeOut(clamp(t / 10));
  return (
    <g transform={camT(560, 500, 1.6)}>
      <ShopInside t={t + 240} night grill={1} />
      <Hero look={YOU} pose={{ ...basePose, x: 560, y: SHOP.hip, yaw: -0.6 + 1.2 * turn, expr: 'shock', armR: { a: 60, b: -60 }, armL: { a: 60, b: -60 }, blink: idleBlink(t, 1) }} rimId="rimRed" />
      <path d={`M ${560 + 30 * turn} ${SHOP.hip - 20} L ${640 + 30 * turn} ${SHOP.hip - 20} L ${630 + 30 * turn} ${SHOP.hip + 60} L ${570 + 30 * turn} ${SHOP.hip + 60} Z`} fill="#8A6A4A" stroke={P0} strokeWidth={5} />
      <ShopCounter night />
    </g>
  );
};

// ---------- S9: the man with the purple stripe in the doorway, two soldiers behind him ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(600, kf(t, [[0, 600], [len, 560]]), kf(t, [[0, 1.5], [len, 1.75]]))}>
    <RomeStreet t={t + 300} mode="night" fire={0.25} />
    <Hero look={SOLDIER} pose={{ ...basePose, x: 380, y: romeHip(1), yaw: 0.3, expr: 'neutral', blink: idleBlink(t, 2) }} rimId="rimRed" />
    <Hero look={SOLDIER} pose={{ ...basePose, x: 820, y: romeHip(1), yaw: -0.3, expr: 'neutral', blink: idleBlink(t, 5) }} rimId="rimRed" />
    <Hero look={OFFICIAL} pose={{ ...basePose, x: 600, y: romeHip(1) + 10, scale: 1.05, yaw: 0, expr: 'smug', armL: { a: 30, b: -60 }, blink: idleBlink(t, 3) }} rimId="rimRed" />
  </g>
);

// ---------- S10: "The emperor's feast. The grill stays lit." ----------
export const S10 = faceCU({ look: OFFICIAL, Bg: NSHOP, faces: [[0, 'smug']], yaw: -0.15, zoom: [3.6, 4.0], words: W, talk: span(W, "'The", 'lit'), light: { x: 960, y: 440, kind: 'red', o: 0.6 }, dark: 0.35 });

// ---------- S11: somewhere down the street, someone shouts; people run ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, 1.15)}>
    <RomeStreet t={t + 400} mode="night" fire={0.4 + 0.3 * clamp(t / len)} shop={false} />
    {walker(CITIZENS[0], 1900, 0, len * 0.6, t * 1.6, romeHip(0.9), 0.9, { expr: 'shock', armR: { a: 150, b: 0 } })}
    {walker(CITIZENS[2], 2100, 200, len * 0.7, t * 1.6, romeHip(0.85), 0.85, { expr: 'shock' })}
    {walker(CITIZENS[4], 2300, 400, len * 0.8, t * 1.6, romeHip(0.95), 0.95, { expr: 'shock', armL: { a: 150, b: 0 } })}
  </g>
);

// ---------- S12: the sky over the Circus starts to glow orange ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 960], [len, 1100]]), kf(t, [[0, 540], [len, 480]]), kf(t, [[0, 0.95], [len, 0.85]]))}>
    <RomeStreet t={t + 500} mode="night" fire={clamp(t / 50)} />
    <Hero look={YOU} pose={{ ...basePose, x: 600, y: romeHip(1), yaw: 0.6, look: 0.8, headTilt: -10, expr: 'shock', blink: idleBlink(t, 2) }} rimId="rimRed" />
    <Hero look={FELIX} pose={{ ...basePose, x: 760, y: romeHip(0.92), scale: 0.92, yaw: 0.6, look: 0.8, headTilt: -10, expr: 'shock', blink: idleBlink(t, 4) }} rimId="rimRed" />
  </g>
);

// ---------- S13: did you just start the Great Fire of Rome? ----------
export const S13 = faceCU({ look: YOU, Bg: FIRE, faces: [[0, 'shock']], yaw: 0.2, eyes: 0.7, zoom: [3.4, 3.8], light: { x: 1100, y: 400, kind: 'red', o: 0.8 }, glint: 0.5, glintColor: '#FF6A3A' });

// ---------- S14: or did someone want it to look like you did? The official, against the glow ----------
export const S14 = faceCU({ look: OFFICIAL, Bg: FIRE, faces: [[0, 'smug']], yaw: -0.4, eyes: -0.6, zoom: [3.0, 3.3], light: { x: 800, y: 400, kind: 'red', o: 0.8 }, dark: 0.3 });

// ---------- S15: tell me what you'd do, in the comments ----------
export const S15: React.FC<ShotProps> = ({ t }) => (
  <g>
    <g filter="url(#blur16)"><FIRE t={t + 600} id="cm" /></g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.45} />
    <g transform={`translate(960 520) scale(${backOut(clamp(t / 9))})`}>
      <path d="M -520 -170 L 520 -170 Q 560 -170 560 -130 L 560 110 Q 560 150 520 150 L -300 150 L -380 240 L -380 150 L -520 150 Q -560 150 -560 110 L -560 -130 Q -560 -170 -520 -170 Z" fill="#F6EFE3" stroke={P0} strokeWidth={8} />
      <text y={-30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={88} fill={P0}>DID YOU START IT?</text>
      <text y={70} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} fill="#C83A2A">TELL ME IN THE COMMENTS</text>
    </g>
  </g>
);

// ---------- S16: is any of this real? ----------
export const S16 = realCard({ kicker: 'IS ANY OF THIS REAL?', big: ['THE HISTORY IS.'], real: false, color: '#6AE08A' });

// ---------- S17-S20: the recap, one line at a time ----------
const RECAP = ['ROME HAD FAST FOOD COUNTERS', 'A ROMAN COOKBOOK HAS A MEAT PATTY', 'NO TOMATOES OR POTATOES UNTIL AFTER 1492', 'NERO BANNED HOT FOOD IN TAVERNS', 'THE FIRE STARTED BY THE CIRCUS, 18 JULY'];
const recap = (from: number, to: number, cues: number[]): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [Math.max(1, len), 1.03]]))}><Schematic t={t + from * 90} id="recap" /></g>
      <text x={960} y={170} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill={SCH.dim}>IS ANY OF THIS REAL?</text>
      {RECAP.slice(0, to).map((r, k) => {
        const t0 = k < from ? -99 : cues[k - from];
        const p = clamp((t - t0) / 8);
        return (
          <g key={k} opacity={p} transform={`translate(${(1 - easeOut(p)) * 40} 0)`}>
            <path d={`M 300 ${330 + k * 140} l 26 28 l 50 -56`} stroke="#6AE08A" strokeWidth={14} fill="none" strokeLinecap="round" />
            <text x={420} y={350 + k * 140} fontFamily={FONT.title} fontWeight={700} fontSize={60} fill="#F6EFE3">{r}</text>
          </g>
        );
      })}
    </g>
  );
  return Shot;
};
export const S17 = recap(0, 2, [4, at('cookbook') - at('Rome', 3) - 4]);
export const S18 = recap(2, 3, [4]);
export const S19 = recap(3, 4, [4]);
export const S20 = recap(4, 5, [4]);

// ---------- S21: what happens next? Part two. End card ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 520, kf(t, [[0, 0.9], [Math.max(1, len), 1.0]]))}><RomeStreet t={t + 700} mode="night" fire={1} /></g>
    <rect width={1920} height={1080} fill="#0B0816" opacity={0.4} />
    <g transform={`translate(960 470) scale(${backOut(clamp((t - 30) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={200} fill="#FF8A3D" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">PART 2</text>
    </g>
    <g transform={`translate(960 680) scale(${backOut(clamp((t - 50) / 9))})`}>
      <rect x={-300} y={-60} width={600} height={100} rx={50} fill="#E8252A" stroke="#0B0816" strokeWidth={6} />
      <text y={10} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#FFFFFF">SUBSCRIBE</text>
    </g>
  </g>
);
