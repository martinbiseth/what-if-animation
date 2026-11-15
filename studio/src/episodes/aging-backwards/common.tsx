import React from 'react';
import { AbsoluteFill } from 'remotion';
import { LOOKS, Look, Word, ShotFrame, Hero, basePose, Kitchen, Bedroom } from '../../engine';
import { StreetModern, RoofNight } from '../electricity/sets';
import { ageK, Bathroom, SoccerField, Clinic, Lab, FoggyWindow, DoorFrame, KidsMenu, RoofHatch } from './sets';

// Shared by every chapter of "What if you aged backwards and couldn't stop?": the cast, the ages, word cues and the
// shot builders (re-used from the electricity episode, which has the same modern cast and street).

export { Soft, faceCU, bigWord, span, wordF, handAt, Handheld } from '../electricity/common';

export const YOU = LOOKS.you;
export const ELLIE = LOOKS.ellie;
export const MOM = LOOKS.mom26;
/** Mo, your best friend: curls and headphones, a green bomber jacket (as in the electricity episode). */
export const MO: Look = { ...LOOKS.mo26, jacket: '#4E7A4A', jacketShade: '#3E6238', accent: '#E9C46A', limb: '#3B3646', shoe: '#E9E2D2', noPhones: false, hat: undefined };
/** Grandma: a lilac cardigan, grey bob. */
export const GRANDMA: Look = { ...LOOKS.mom26, jacket: '#9A86B8', jacketShade: '#7E6C9A', accent: '#F2E6C8', hair: '#C8C4CC' };
/** The doctor: a white coat over teal. */
export const DOCTOR: Look = { ...LOOKS.mom26, jacket: '#F2F4F2', jacketShade: '#D4D8D6', accent: '#3E8C86', limb: '#2E5A58', hair: '#17131C', extra: 'bob' };
/** The man in the grey suit: no hat, a dark red tie. */
export const SUIT: Look = { ...LOOKS.suit26, hat: undefined };
/** The other team's coach: a red cap and a tracksuit. */
export const COACH: Look = { ...LOOKS.worker, jacket: '#2E5AA8', jacketShade: '#23468A', accent: '#F4F4F0', hat: 'cap', hatColor: '#C8323A' };
export const TEACHER: Look = { ...LOOKS.lady, hat: undefined, jacket: '#B8704A', jacketShade: '#9A5A3A' };

/** Your scale on day d (day 1 = 14 years old). */
export const dayK = (day: number) => ageK(15 - day);
export const ELLIE_K = ageK(8);
export const MOM_K = 1.06;

const norm = (w: string) => w.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '').replace(/^'+|'+$/g, '');
/** Frames from word `cue` (nth) to the first word `w` after it. */
export const relW = (W: Word[]) => (cue: string, w: string, nth = 1) => {
  let seen = 0;
  const i = W.findIndex((x) => norm(x.w) === norm(cue) && ++seen === nth);
  const j = W.findIndex((x, k) => k > i && norm(x.w) === norm(w));
  return j < 0 || i < 0 ? 0 : Math.round((W[j].s - W[i].s) * 30);
};

// A dev sheet of the episode's sets.
const cells: React.ReactNode[] = [
  <Kitchen key="a" t={40} />,
  <DoorFrame key="b" x={760} y={1000} h={900} marks={[{ h: 0.78, label: '15' }, { h: 0.74, label: '14' }, { h: 0.5, label: 'ELLIE 8', side: 'R', color: '#C8323A' }]} />,
  <Bathroom key="c" t={40} />,
  <SoccerField key="d" t={40} />,
  <Clinic key="e" t={40} />,
  <Lab key="f" t={40} />,
  <StreetModern key="g" t={40} mode="day" />,
  <Bedroom key="h" t={40} />,
  <RoofNight key="i" t={40} power={1} milky={0} />,
  <FoggyWindow key="j" t={40} draw={1} />,
  <KidsMenu key="k" t={40} />,
  <RoofHatch key="l" t={40} />,
];
export const AgingSets: React.FC = () => (
  <AbsoluteFill style={{ background: '#000' }}>
    <ShotFrame>
      {cells.map((c, i) => (
        <g key={i} transform={`translate(${(i % 4) * 480} ${Math.floor(i / 4) * 360}) scale(0.25 0.3333)`}>
          <svg width={1920} height={1080} viewBox="0 0 1920 1080" overflow="hidden">
            {c}
            {i === 0 ? <Hero look={YOU} pose={{ ...basePose, x: 900, y: 700, scale: dayK(1) }} /> : null}
          </svg>
        </g>
      ))}
    </ShotFrame>
  </AbsoluteFill>
);
