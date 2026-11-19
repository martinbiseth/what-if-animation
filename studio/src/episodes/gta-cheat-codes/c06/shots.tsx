import React from 'react';
import { Hero, basePose, kf, camT, clamp, backOut, ShotProps, FONT, Glow, LEG_LEN, stepTop, SUBURB, Suburb, Pose, rnd } from '../../../engine';
import words from './words.json';
import {
  YOU, MUM, SUIT, AGENT, AGENT2, ELLIE, StairSet, BedSet, faceCU, scene, fig, propCU, textCard, talkShot, span, msgCU, listCU, ctrlCU,
  MoneyBag, SportsCar, Controller, CheatText, CHEAT, OUR_DOOR, ROAD, SetC, Soft,
} from '../common';

// Chapter 6, the choice: "We'll take that", Mum in the way, two more men, Ellie crying on the stairs; you run up and
// lock the door, press the list to the window and read RESET; footsteps, Mo's text, and you enter the code.

const Dusk: SetC = ({ t, id }) => <Suburb t={t} id={id} tod="dusk" cars={false} windowsLit={0.7} />;
const standY = (s = 1) => SUBURB.feet - LEG_LEN * s;

// ---------- S1: "We'll take that. And you'll come with us." ----------
export const S1 = talkShot({
  Set: Dusk, words, setT: 800,
  cast: [
    { look: SUIT, x: OUR_DOOR - 260, y: standY(), yaw: 0.5, talk: [span(words, "We'll", 'that'), span(words, 'And', 'questions')], faces: [[0, 'smug']], pose: { armR: { a: 50, b: -30 }, handR: 'point' } },
    { look: YOU, x: OUR_DOOR - 20, y: standY(), yaw: -0.5, faces: [[0, 'worried'], [90, 'shock']] },
  ],
  cam: { from: [OUR_DOOR - 140, 520, 1.6], to: [OUR_DOOR - 140, 520, 1.85] },
});

// ---------- S2: you know what that means ----------
export const S2 = faceCU({ look: YOU, Bg: Dusk, faces: [[0, 'worried']], yaw: -0.3, zoom: [3.0, 3.25] });

// ---------- S3: the only person on Earth who can make money, cars and energy ----------
export const S3 = textCard({
  kicker: 'THE ONLY PERSON ON EARTH WHO CAN MAKE', lines: ['MONEY · CARS · ENERGY'], size: 110, color: '#FFE27A', sub: 'out of nothing', y: 380,
  art: (t) => (
    <g>
      <g opacity={clamp((t - 20) / 6)}><MoneyBag x={560} y={850} s={0.6} /></g>
      <g opacity={clamp((t - 30) / 6)}><SportsCar x={1000} y={860} s={0.5} /></g>
      <g opacity={clamp((t - 40) / 6)} transform="translate(1420 760)"><path d="M 20 -100 L -40 10 H 10 L -20 110 L 60 -20 H 10 Z" fill="#FFB15A" stroke="#0B0816" strokeWidth={6} /></g>
    </g>
  ),
});

// ---------- S4: nobody is letting you go home ----------
export const S4 = faceCU({ look: SUIT, Bg: Dusk, faces: [[0, 'smug']], yaw: 0.3, zoom: [3.0, 3.1] });

// ---------- S5: Mum steps between: "He's fourteen." ----------
export const S5 = talkShot({
  Set: Dusk, words, setT: 1000,
  cast: [
    { look: SUIT, x: OUR_DOOR - 330, y: standY(), yaw: 0.5, faces: [[0, 'neutral']] },
    { look: MUM, x: OUR_DOOR - 150, y: standY(), yaw: -0.4, talk: [span(words, "He's", 'fourteen'), span(words, "He's", 'anywhere', 2)], faces: [[0, 'worried']], pose: { armL: { a: 70, b: 0 }, armR: { a: 70, b: 0 } } },
    { look: YOU, x: OUR_DOOR + 10, y: standY(), yaw: -0.4, faces: [[0, 'worried']] },
  ],
  cam: { from: [OUR_DOOR - 160, 520, 1.5], to: [OUR_DOOR - 160, 520, 1.6] },
});

// ---------- S6: two more men get out of the cars ----------
export const S6 = scene({
  Set: Dusk, cam: [[960, 600, 1.0], [960, 600, 1.03]],
  draw: (t) => (
    <g>
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${520 + i * 520} ${ROAD + 170}) scale(0.62)`}>
          <path d="M -290 -24 L -290 -110 Q -280 -130 -220 -136 L -130 -140 L -70 -210 H 120 L 190 -140 L 270 -130 Q 300 -120 300 -90 V -24 Z" fill="#14151C" stroke="#05050A" strokeWidth={6} />
          <circle cx={-170} cy={-20} r={42} fill="#05050A" />
          <circle cx={170} cy={-20} r={42} fill="#05050A" />
        </g>
      ))}
      {fig(AGENT, t, { x: kf(t, [[0, 1040], [40, 980]]), y: standY() + 60, yaw: -0.4, look: -0.5 }, [[0, 'neutral']], 4)}
      {fig(AGENT2, t, { x: kf(t, [[6, 1560], [46, 1480]]), y: standY() + 60, yaw: -0.4, look: -0.5 }, [[0, 'neutral']], 6)}
      {fig(SUIT, t, { x: OUR_DOOR - 330, y: standY(), yaw: 0.5 }, [[0, 'neutral']], 3)}
      {fig(MUM, t, { x: OUR_DOOR - 150, y: standY(), yaw: -0.2, armL: { a: 70, b: 0 }, armR: { a: 70, b: 0 } }, [[0, 'worried']], 2)}
      {fig(YOU, t, { x: OUR_DOOR + 10, y: standY(), yaw: -0.2 }, [[0, 'worried']], 1)}
    </g>
  ),
});

// ---------- S7: Ellie on the stairs in her pajamas, crying ----------
const EP = { ...ELLIE, jacket: '#B8A8E8', jacketShade: '#9A8AC8' };
export const S7 = scene({
  Set: StairSet, cam: [[700, 520, 1.9], [700, 520, 2.0]], setT: 500,
  draw: (t) => (
    <g>
      {fig(EP, t, { x: 700, y: stepTop(700) - LEG_LEN * 0.7, scale: 0.7, yaw: 0.2, headTilt: 10, armL: { a: 20, b: -120 }, armR: { a: 20, b: -120 } }, [[0, 'worried']], 3)}
      {[0, 1].map((i) => <ellipse key={i} cx={690 + i * 26} cy={stepTop(700) - LEG_LEN * 0.7 - 120 + ((t * 1.5 + i * 20) % 40)} rx={4} ry={7} fill="#7FC8F0" />)}
    </g>
  ),
});

// ---------- S8: you can't run; it isn't hurting you, it's taking you ----------
export const S8 = faceCU({ look: YOU, Bg: Dusk, faces: [[0, 'worried'], [80, 'tired']], yaw: 0.2, zoom: [2.6, 2.9] });

// ---------- S9: a hundred bags, a hundred cars: none of it helps ----------
export const S9 = propCU({
  bgColor: '#120C18',
  draw: (t) => (
    <g>
      {Array.from({ length: 24 }).map((_, i) => (
        <g key={i} opacity={clamp((t - i * 2) / 5) * 0.8}>
          {i % 2 ? <MoneyBag x={200 + (i % 6) * 300} y={300 + Math.floor(i / 6) * 220} s={0.4} /> : <SportsCar x={200 + (i % 6) * 300} y={300 + Math.floor(i / 6) * 220} s={0.4} color={['#E83A3A', '#3A8AF0', '#F07AB8'][i % 3]} />}
        </g>
      ))}
    </g>
  ),
});
export const S9b = textCard({ kicker: 'NOTHING ON THAT LIST', lines: ['MAKES PEOPLE', 'FORGET'], size: 130, color: '#FF5A4A', y: 460 });

// ---------- S10: grab the controller, up the stairs ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 60);
  const x = 1500 - k * 1050;
  const pose: Pose = {
    ...basePose, x, y: stepTop(x) - LEG_LEN * 0.8 - 6, scale: 0.8, facing: -1, yaw: -0.7, tilt: -12, expr: 'worried',
    legL: { a: 30 * Math.sin(t / 2.5), b: -20 }, legR: { a: -30 * Math.sin(t / 2.5), b: -20 }, armL: { a: 30, b: -80 }, armR: { a: 40 * Math.sin(t / 2.5), b: -40 },
  };
  return (
    <g transform={camT(kf(t, [[0, 1200], [len, 800]]), 600, 1.2)}>
      <StairSet t={t + 700} id="s10" />
      <Hero look={YOU} pose={pose} />
      <Controller x={x - 40} y={pose.y + 30} s={0.13} glow={0.4} />
    </g>
  );
};

// ---------- S11: lock the door ----------
export const S11 = propCU({
  Bg: BedSet,
  draw: (t) => {
    const turn = kf(t, [[4, 0], [14, 90]]);
    return (
      <g>
        <rect x={560} y={0} width={800} height={1080} fill="#E8DCCC" />
        <rect x={1100} y={420} width={160} height={260} rx={20} fill="#B8A890" />
        <g transform={`translate(1180 550) rotate(${turn})`}>
          <rect x={-70} y={-18} width={140} height={36} rx={18} fill="#C8A040" stroke="#5A4010" strokeWidth={5} />
        </g>
        <ellipse cx={1180 + Math.sin((turn / 180) * Math.PI) * 30} cy={590} rx={60} ry={70} fill="#1A1620" />
        {t > 14 && t < 22 ? <text x={1300} y={480} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#2A2418">CLICK</text> : null}
      </g>
    );
  },
});

// ---------- S12, S13: the list against the window; the sun through the paper ----------
export const S12 = listCU({ window: true, reveal: (t) => kf(t, [[0, 0.05], [100, 0.3]]) });
export const S13 = listCU({ window: true, focus: 'bottom', reveal: (t) => kf(t, [[0, 0.3], [90, 1]]) });

// ---------- S14: RESET ----------
export const S14: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#081A1A" />
    <Glow x={960} y={540} r={800} kind="cool" o={0.6} />
    <g transform={`translate(960 600) scale(${backOut(clamp(t / 6))})`}>
      <text textAnchor="middle" fontFamily="Kalam, cursive" fontWeight={700} fontSize={300} fill={CHEAT.glow} stroke="#03100C" strokeWidth={14} paintOrder="stroke">RESET</text>
    </g>
  </g>
);

// ---------- S15: downstairs the door opens; footsteps on the stairs ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len));
  const x = 1500 - k * 600;
  const pose: Pose = { ...basePose, x, y: stepTop(x) - LEG_LEN * 0.8 - 6, scale: 0.8, facing: -1, yaw: -0.6, expr: 'neutral', legL: { a: 25 * Math.sin(t / 5), b: -20 }, legR: { a: -25 * Math.sin(t / 5), b: -20 } };
  return (
    <g transform={camT(1100, 600, 1.2)}>
      <StairSet t={t + 900} id="s15" />
      <Hero look={SUIT} pose={pose} />
      <rect x={-200} y={-200} width={2400} height={1500} fill="#05050E" opacity={0.35} />
    </g>
  );
};

// ---------- S16: "Don't do anything stupid," through the door ----------
export const S16 = propCU({
  bgColor: '#1A1420',
  draw: (t) => (
    <g>
      <rect x={560} y={0} width={800} height={1000} fill="#5A4A3A" stroke="#2A1A14" strokeWidth={10} />
      <rect x={620} y={80} width={680} height={380} fill="#6A5A48" />
      <rect x={620} y={520} width={680} height={420} fill="#6A5A48" />
      <rect x={560} y={990} width={800} height={14} fill="#FFE8B0" opacity={0.9} />
      {/* two shadows of feet under the door */}
      <rect x={860} y={992} width={70} height={10} fill="#0A0808" />
      <rect x={990} y={992} width={70} height={10} fill="#0A0808" />
      <g transform={`translate(1180 560) rotate(${Math.sin(t / 3) * 6})`}><rect x={-70} y={-18} width={140} height={36} rx={18} fill="#C8A040" /></g>
    </g>
  ),
});

// ---------- S17: Mo: whatever you're about to do, don't ----------
export const S17 = msgCU({ Bg: BedSet, bubbles: [{ at: -20, text: ['Dude.'], big: true }, { at: -20, text: ['Why is there a', 'helicopter over', 'your house??'] }, { at: 14, text: ["Whatever you're", "about to do,", "don't."] }] });

// ---------- S18: what does reset mean? ----------
export const S18 = faceCU({ look: YOU, Bg: BedSet, faces: [[0, 'worried']], yaw: 0, zoom: [2.6, 2.8], glint: 0.6, glintColor: CHEAT.glow });

// ---------- S19, S19b, S19c: reset what? ----------
const q = (line: string): React.FC<ShotProps> => textCard({ kicker: 'RESET', lines: [line], size: 170, color: CHEAT.glow, y: 600 });
export const S19 = q('THE CHEATS?');
export const S19b = q('THE HOUSE?');
export const S19c = q('YOU?');

// ---------- S20: the only code left ----------
export const S20 = ctrlCU({ Bg: BedSet, glow: (t) => 0.4 + 0.2 * Math.sin(t / 5) });

// ---------- S21: Red. Red. Down. Blue. Up. (pressed on the words) ----------
const KEYS: [string, string][] = [['Red', 'r'], ['Red', 'r'], ['Down', 'down'], ['Blue', 'b'], ['Up', 'up']];
const pressAt = (() => {
  const out: [number, string][] = [];
  let from = words.length - 12;
  KEYS.forEach(([w, k]) => {
    const i = words.findIndex((x, j) => j >= from && x.w.toLowerCase() === w.toLowerCase());
    if (i >= 0) {
      out.push([Math.round(words[i].s * 30), k]);
      from = i + 1;
    }
  });
  return out;
})();
const ctrl21 = (seq: [number, string][]) => ctrlCU({ Bg: BedSet, seq, glow: (t) => 0.5 + clamp((t - 60) / 40) });
export const S21: React.FC<ShotProps> = (p) => {
  const start = p.f - p.t;
  return ctrl21(pressAt.map(([fr, k]) => [fr - start, k] as [number, string]))(p);
};
