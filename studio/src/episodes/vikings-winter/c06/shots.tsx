import React from 'react';
import { ShotProps, Word, clamp, easeOut, backOut, kf, camT, FONT, Glow, Hero, basePose, PhoneInHand } from '../../../engine';
import { YOU_WOOL, KETIL, GUDRUN, ASA, LH, Farmyard, Longhouse, Flames, OilLamp, Tafl, FireKit, Spindle, Sleeper, Breath, INK } from '../norse';
import { scene, faceCU, insert, bigWord, inside, outside, Caption, wordF, span, SIT, seatFeet, WHITE } from '../common';
import words from './words.json';

// Chapter 6, the longest night: pitch black by four; the fire and a fish-oil lamp; no screens, so each other: Ketil's
// story of the giant who stole a god's hammer, Gudrun's spindle, Asa winning at hnefatafl four times; bed on the
// benches, bodies packed (+100 W each); ash raked over the embers so the fire sleeps; you're on fire watch... and you
// fall asleep. The house goes dark, the embers nearly black, your breath shows, Asa shivers, 36, 35.5. Flint, steel,
// tinder fungus; strike, nothing; strike again, a glow; blow; a flame; twig, stick, log; the light climbs the walls,
// Asa stops shivering, nobody ever knows. But the fire never went out.

const W = words as Word[];
const at = (a: string, n = 1) => wordF(W, a, n);
const NIGHT = inside({ mode: 'night', fire: 1 });
const LOW = inside({ mode: 'night', fire: 0.35 });
const DARK = inside({ mode: 'dark', fire: 0.04 });
const NIGHT_OUT = outside({ tod: 'night', door: 0.8, snow: 0.4 });

const Label: React.FC<{ t: number; text: string; x?: number; y?: number; c?: string; s?: number }> = ({ t, text, x = 960, y = 960, c = '#FFD23A', s = 1 }) => {
  const k = easeOut(clamp(t / 8));
  const w = text.length * 36 + 120;
  return (
    <g opacity={k} transform={`translate(${x} ${y + (1 - k) * 40}) scale(${s})`}>
      <rect x={-w / 2} y={-56} width={w} height={100} rx={50} fill="#0B0816" opacity={0.8} />
      <text y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={58} fill={c}>{text}</text>
    </g>
  );
};
const Lids: React.FC<{ k: number }> = ({ k }) => {
  const h = 560 * clamp(k);
  return (
    <g>
      <rect x={0} y={0} width={1920} height={h} fill="#05040A" />
      <rect x={0} y={1080 - h} width={1920} height={h} fill="#05040A" />
    </g>
  );
};
/** The hearth bed close up: embers, `glow` 0..1, `ash` 0..1 covered. */
const Embers: React.FC<{ t: number; glow: number; ash?: number }> = ({ t, glow, ash = 0 }) => (
  <g>
    <rect x={-200} y={0} width={2400} height={1100} fill="#120C10" />
    <Glow x={960} y={640} r={700} kind="warm" o={0.55 * glow} />
    {Array.from({ length: 34 }).map((_, i) => {
      const x = 200 + ((i * 211) % 1520), y = 560 + ((i * 97) % 320);
      const p = glow * (0.6 + 0.4 * Math.sin(t / 6 + i));
      const r = 40 + 215 * p, g = 20 + 90 * p * p, b = 20 + 10 * p;
      const a = clamp(ash * 1.2 - (i % 5) * 0.08);
      const mix = (c: number, d: number) => Math.round(c * (1 - a) + d * a);
      return <ellipse key={i} cx={x} cy={y} rx={74} ry={36} fill={`rgb(${mix(r, 106)}, ${mix(g, 100)}, ${mix(b, 96)})`} stroke={INK} strokeWidth={5} />;
    })}
    {ash > 0 ? Array.from({ length: 60 }).map((_, i) => <circle key={i} cx={180 + ((i * 53) % 1560)} cy={540 + ((i * 71) % 360)} r={5 + (i % 3) * 2} fill="#9A948E" opacity={clamp(ash * 1.5 - (i % 4) * 0.2)} />) : null}
  </g>
);

// ---------- S1: by four o'clock it's pitch black outside ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, kf(t, [[0, 520], [Math.max(1, len), 500]]), 1.0)}>
      <Farmyard t={t + 40} tod="night" door={0.8} snow={0.4} />
    </g>
    <Caption t={t} text="4:00 PM" />
  </g>
);

// ---------- S2: inside, the only light is the fire ----------
export const S2 = scene({ Set: NIGHT, setT: 60, cam: [[960, 600, 1.1], [960, 620, 1.2]] });

// ---------- S3: and a little stone lamp burning fish oil ----------
export const S3 = insert({ Bg: NIGHT, dim: 0.5, draw: (t) => <g><OilLamp x={960} y={700} s={3.4} t={t} /><Label t={t - 14} text="FISH OIL" y={900} /></g> });

// ---------- S4: it smells exactly like you think it smells ----------
export const S4 = faceCU({
  look: YOU_WOOL, Bg: NIGHT, faces: [[0, 'neutral'], [8, 'oops']], yaw: 0.2, zoom: [3.2, 3.4], light: { x: 900, y: 640, o: 0.6 },
  extra: (t) => <g opacity={0.8}>{[0, 1, 2].map((i) => <path key={i} d={`M ${880 + i * 30} ${600 - ((t + i * 10) % 30) * 3} q 10 -14 0 -28 q -10 -14 0 -28`} stroke="#9AC86A" strokeWidth={5} fill="none" strokeLinecap="round" />)}</g>,
});

// ---------- S5: nobody has a screen ----------
export const S5 = insert({
  Bg: NIGHT, dim: 0.5,
  draw: (t) => (
    <g>
      <PhoneInHand x={960} y={420} s={0.95} rot={-4} mode="off" battery={0} t={t} from="right" />
      <g opacity={easeOut(clamp((t - 8) / 6))} stroke="#E8303A" strokeWidth={30} strokeLinecap="round">
        <path d="M 760 220 L 1160 760" />
        <path d="M 1160 220 L 760 760" />
      </g>
    </g>
  ),
});

// ---------- S6: so they have each other ----------
export const S6 = scene({
  Set: NIGHT, setT: 160,
  cast: [
    { look: KETIL, x: 560, feet: seatFeet(1), s: 1, yaw: 0.4, faces: [[0, 'happy']], pose: SIT },
    { look: GUDRUN, x: 800, feet: seatFeet(0.97), s: 0.97, yaw: 0.3, faces: [[0, 'happy']], pose: SIT },
    { look: ASA, x: 1010, feet: seatFeet(0.72), s: 0.72, yaw: 0.2, faces: [[0, 'happy']], pose: SIT },
    { look: YOU_WOOL, x: 1220, feet: seatFeet(0.95), s: 0.95, yaw: -0.3, faces: [[0, 'happy']], pose: SIT },
  ],
  cam: [[900, 640, 1.45], [910, 640, 1.55]],
});

// ---------- S7: Ketil tells a story ----------
export const S7 = scene({
  Set: NIGHT, setT: 200, words: W,
  cast: [{ look: KETIL, x: 960, feet: LH.back, s: 1, yaw: 0.2, faces: [[0, 'happy'], [30, 'shock']], talk: [span(W, 'Ketil', 'hammer')], keys: [{ f: 6, p: { armL: { a: 150, b: -30 }, armR: { a: 150, b: -30 } } }] }],
  cam: [[960, 560, 1.6], [960, 540, 1.75]],
  back: (t) => (
    <g opacity={0.35} fill="#0B0816" transform={`translate(${1250 + Math.sin(t / 8) * 10} 0)`}>
      <circle cx={0} cy={200} r={70} />
      <path d="M -30 140 L -46 90 L -14 130 Z M 30 140 L 46 90 L 14 130 Z" />
      <path d="M -90 280 L 90 280 L 110 640 L -110 640 Z" />
      <path d="M 80 300 L 220 200" stroke="#0B0816" strokeWidth={44} strokeLinecap="round" />
    </g>
  ),
});

// ---------- S8: a giant who stole a god's hammer ----------
export const S8 = insert({
  Bg: NIGHT, dim: 0.55,
  draw: (t) => {
    const k = easeOut(clamp(t / 16));
    return (
      <g>
        <Glow x={960} y={1000} r={600} kind="warm" o={0.5} />
        <g fill="#0B0816" transform={`translate(${700 + k * 120} 0)`}>
          <circle cx={0} cy={300} r={90} />
          <path d="M -40 230 L -60 170 L -20 220 Z M 40 230 L 60 170 L 20 220 Z" />
          <path d="M -120 400 L 120 400 L 150 900 L -150 900 Z" />
          <path d="M 110 420 L 300 300" stroke="#0B0816" strokeWidth={60} strokeLinecap="round" />
          <g transform="translate(320 270) rotate(20)"><rect x={-14} y={-10} width={28} height={130} /><rect x={-70} y={-60} width={140} height={70} rx={8} /></g>
        </g>
        <Label t={t - 18} text="A GIANT + A GOD'S HAMMER" y={150} />
      </g>
    );
  },
});

// ---------- S9: and does all the voices ----------
export const S9 = faceCU({
  look: KETIL, Bg: NIGHT, faces: [[0, 'shock'], [12, 'smug'], [24, 'happy'], [36, 'shock']], yaw: 0.1, zoom: [3.0, 3.2], words: W, talk: [span(W, 'does', 'voices')], light: { x: 900, y: 700, o: 0.7 },
  pose: { armL: { a: 150, b: -30 } },
});

// ---------- S10: Gudrun spins wool while she listens ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 820], [Math.max(1, len), 830]]), 600, 2.0)}>
    <NIGHT t={t + 260} id="s10" />
    <Hero look={GUDRUN} pose={{ ...basePose, x: 800, y: seatFeet(0.97) - 140 * 0.97, scale: 0.97, yaw: 0.3, look: 0.4, ...SIT, armR: { a: 150, b: -40 }, armL: { a: 50, b: -60 }, headTilt: 6, expr: 'happy' }} rimId="rimR" shadow={1} />
    <Spindle x={890} y={430} s={0.9} t={t} len={140} />
  </g>
);

// ---------- S11: Asa beats you at a board game called hnefatafl ----------
export const S11 = insert({ Bg: NIGHT, dim: 0.5, draw: (t) => <g><Tafl x={960} y={520} s={1.6} t={t} win={clamp((t - 20) / 30)} /><Label t={t - 30} text="HNEFATAFL" y={940} /></g> });

// ---------- S12: four times ----------
export const S12 = faceCU({
  look: ASA, Bg: NIGHT, faces: [[0, 'smug']], yaw: -0.2, zoom: [3.6, 3.8], light: { x: 900, y: 640, o: 0.6 },
  extra: (t) => (
    <g transform={`translate(1110 410) scale(${backOut(clamp((t - 4) / 8)) * 0.4})`}>
      <rect x={-150} y={-80} width={300} height={130} rx={30} fill="#0B0816" stroke="#FFD23A" strokeWidth={8} />
      <text y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFD23A">4–0</text>
    </g>
  ),
});

// ---------- S13: then it's time to sleep ----------
export const S13 = faceCU({ look: YOU_WOOL, Bg: LOW, faces: [[0, 'tired']], yaw: 0.2, zoom: [3.0, 3.1], light: { x: 900, y: 680, o: 0.5 }, pose: { headTilt: -8 } });

// ---------- S14: everyone climbs onto the benches ----------
const SLEEPERS = (t: number, tags = -1, shiverAsa = 0) => (
  <g>
    {[
      { x: 180, s: 0.8, c: '#7A5A3A', hair: '#C2501E', beard: '#C2501E' },
      { x: 520, s: 0.8, c: '#5A6A8A', hair: '#E0B060' },
      { x: 820, s: 0.6, c: '#8A4A3A', hair: '#E8C060', asa: true },
      { x: 1120, s: 0.8, c: '#6A6E78', hair: '#7A5232' },
    ].map((p, i) => (
      <g key={i}>
        <Sleeper x={p.x} y={LH.bench + 6} s={p.s} t={t + i * 20} c={p.c} hair={p.hair} beard={p.beard} shiver={p.asa ? shiverAsa : 0} />
        {tags >= 0 ? (
          <g opacity={clamp((tags - i * 6) / 6)} transform={`translate(${p.x + 20} ${LH.bench - 150 - clamp((tags - i * 6) / 6) * 20})`}>
            <rect x={-90} y={-40} width={180} height={64} rx={32} fill="#0B0816" opacity={0.8} />
            <text y={6} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#FF8A3D">+100 W</text>
          </g>
        ) : null}
      </g>
    ))}
  </g>
);
export const S14 = scene({ Set: LOW, setT: 340, cam: [[640, 640, 1.4], [660, 640, 1.5]], back: (t) => SLEEPERS(t) });

// ---------- S15: furs, wool blankets, bodies packed close ----------
export const S15 = scene({ Set: LOW, setT: 380, cam: [[660, 600, 2.0], [680, 600, 2.1]], back: (t) => SLEEPERS(t) });

// ---------- S16: every person in the pile is another hundred watts ----------
export const S16 = scene({ Set: LOW, setT: 420, cam: [[640, 600, 1.5], [650, 600, 1.55]], back: (t) => SLEEPERS(t, t - 4) });

// ---------- S17: Gudrun rakes ash over the glowing embers ----------
export const S17 = insert({ Bg: LOW, dim: 0, draw: (t) => <Embers t={t} glow={1} ash={easeOut(clamp((t - 6) / 40)) * 0.8} /> });

// ---------- S18: covered like this, a fire can sleep through the night ----------
export const S18 = insert({ Bg: LOW, dim: 0, draw: (t) => <g><Embers t={t} glow={0.5 + Math.sin(t / 10) * 0.15} ash={0.8} /><Label t={t - 10} text="THE FIRE SLEEPS" y={220} /></g> });

// ---------- S19: then she points at you ----------
export const S19 = scene({
  Set: LOW, setT: 460,
  cast: [
    { look: GUDRUN, x: 800, feet: LH.back, s: 0.97, yaw: 0.5, faces: [[0, 'neutral']], keys: [{ f: 4, p: { armR: { a: 90, b: -5 } } }] },
    { look: YOU_WOOL, x: 1120, feet: LH.back, s: 0.95, yaw: -0.4, faces: [[0, 'neutral'], [16, 'worried']] },
  ],
  cam: [[960, 620, 1.75], [960, 620, 1.85]],
});

// ---------- S20: you're on fire watch ----------
export const S20 = bigWord({ kicker: "YOU'RE ON", word: 'FIRE WATCH', Bg: LOW, size: 190, color: '#FF8A3D' });

// ---------- S21: you mean to stay awake. You really do ----------
export const S21: React.FC<ShotProps> = (p) => {
  const F = faceCU({ look: YOU_WOOL, Bg: LOW, faces: [[0, 'neutral'], [20, 'tired']], yaw: 0.15, zoom: [3.0, 3.4], light: { x: 900, y: 700, o: 0.4 }, pose: { headTilt: -6 } });
  const L = Math.max(1, p.len);
  const k = clamp(p.t / L);
  const lids = k < 0.4 ? k * 0.8 : k < 0.5 ? 0.32 - (k - 0.4) * 3 : (k - 0.5) * 2;
  return <g><F {...p} /><Lids k={lids} /></g>;
};

// ---------- S22: when you open your eyes the house is dark ----------
export const S22: React.FC<ShotProps> = (p) => {
  const S = scene({ Set: DARK, setT: 520, cam: [[960, 600, 1.1], [960, 600, 1.15]] });
  return <g><S {...p} /><Lids k={1 - easeOut(clamp(p.t / 14))} /></g>;
};

// ---------- S23: the embers are almost black ----------
export const S23 = insert({ Bg: DARK, dim: 0, draw: (t) => <Embers t={t} glow={0.12 + Math.sin(t / 12) * 0.04} ash={0.3} /> });

// ---------- S24: you can see your breath ----------
export const S24 = faceCU({ look: YOU_WOOL, Bg: DARK, faces: [[0, 'worried']], yaw: 0.2, zoom: [3.2, 3.5], dark: 0.35, shiver: 1.2, light: { x: 960, y: 520, kind: 'cool', o: 0.4 },
  extra: (t) => <Breath x={995} y={560} t={t} s={0.6} o={0.8} /> });

// ---------- S25: Asa curled up tight, shivering in her sleep ----------
export const S25 = scene({ Set: DARK, setT: 560, cam: [[830, 620, 2.4], [830, 620, 2.5]], back: (t) => SLEEPERS(t, -1, 2) });

// ---------- S26: the number in the corner is dropping. 36. 35.5 ----------
export const S26: React.FC<ShotProps> = ({ t }) => {
  const t0 = at('number');
  const v = t < at('six') - t0 ? 36.4 - clamp(t / 30) * 0.4 : t < at('five') - t0 ? 36.0 : 35.5;
  const pop = backOut(clamp((t - (t < at('five') - t0 ? at('six') - t0 : at('five') - t0)) / 8));
  return (
    <g>
      <rect width={1920} height={1080} fill="#06080F" />
      <Glow x={960} y={560} r={600} kind="cool" o={0.35} />
      <text x={960} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={10} fill={WHITE}>BODY TEMPERATURE</text>
      <g transform={`translate(960 640) scale(${0.85 + 0.15 * pop})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={240} fill="#7FD4FF" stroke="#0B0816" strokeWidth={16} paintOrder="stroke">{v.toFixed(1)}°C</text>
      </g>
      <path d={`M 960 760 l 0 ${60 + Math.sin(t / 4) * 10} m -30 -30 l 30 30 l 30 -30`} stroke="#7FD4FF" strokeWidth={12} fill="none" strokeLinecap="round" />
    </g>
  );
};

// ---------- S27: you remember what Ketil showed you ----------
export const S27 = faceCU({ look: YOU_WOOL, Bg: DARK, faces: [[0, 'worried'], [18, 'cool']], yaw: 0.2, zoom: [3.3, 3.0], dark: 0.3, light: { x: 960, y: 520, kind: 'cool', o: 0.4 } });

// ---------- S28: a piece of flint, a steel striker, a dried mushroom ----------
export const S28 = insert({
  Bg: DARK, dim: 0.3,
  draw: (t) => {
    const t0 = at('flint');
    return (
      <g>
        <Glow x={960} y={600} r={500} kind="cool" o={0.25} />
        <FireKit x={960} y={600} s={2.6} />
        <Label t={t - 2} text="FLINT" x={480} y={820} s={0.8} c={WHITE} />
        <Label t={t - (at('steel') - t0)} text="STEEL" x={1000} y={820} s={0.8} c={WHITE} />
        <Label t={t - (at('mushroom') - t0)} text="FUNGUS" x={1400} y={820} s={0.8} c={WHITE} />
      </g>
    );
  },
});

// ---------- S29: tinder fungus, from birch trees: catches a spark and holds it ----------
export const S29 = insert({
  Bg: DARK, dim: 0.3,
  draw: (t) => (
    <g>
      <rect x={720} y={-20} width={300} height={1120} fill="#EEE8DC" stroke={INK} strokeWidth={8} />
      {[120, 300, 520, 760, 940].map((y, i) => <path key={i} d={`M ${720 + (i % 2) * 40} ${y} l ${80 + i * 10} 0`} stroke="#2A2620" strokeWidth={10} strokeLinecap="round" />)}
      <path d="M 1010 420 Q 1240 400 1260 470 Q 1220 560 1010 560 Z" fill="#8A6A4A" stroke={INK} strokeWidth={8} />
      <path d="M 1030 460 Q 1180 450 1220 480 M 1030 510 Q 1170 505 1210 520" stroke="#6A4A2E" strokeWidth={5} fill="none" />
      <Label t={t - 4} text="TINDER FUNGUS" x={960} y={820} />
      <text x={960} y={940} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={WHITE} opacity={clamp((t - 20) / 8)}>catches a spark and holds it</text>
    </g>
  ),
});

// ---------- S30: you strike. Nothing ----------
const Strike: React.FC<{ t: number; hit: number; spark: boolean; glow?: number }> = ({ t, hit, spark, glow = 0 }) => {
  const rot = kf(t, [[0, -40], [hit, 10], [hit + 6, 0]], easeOut);
  return (
    <g>
      <Glow x={960} y={600} r={500} kind={glow > 0 ? 'warm' : 'cool'} o={0.2 + glow * 0.4} />
      <path d="M 700 640 L 820 560 L 940 590 L 960 700 L 820 740 Z" fill="#8A8A90" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <g transform={`rotate(${rot} 1300 400)`}><path d="M 940 520 Q 1100 470 1180 520 Q 1210 550 1180 580 Q 1100 530 940 570 Z" fill="#5A5A62" stroke={INK} strokeWidth={8} /></g>
      <g transform="translate(1180 760)">
        <path d="M -110 20 Q -116 -60 0 -70 Q 116 -60 110 20 Q 0 50 -110 20 Z" fill="#8A6A4A" stroke={INK} strokeWidth={8} />
        {glow > 0 ? <g opacity={glow}><Glow x={0} y={-20} r={200} kind="warm" o={0.9} /><ellipse cx={-20} cy={-30} rx={40 + Math.sin(t / 2) * 5} ry={18} fill="#FF7A1E" /><ellipse cx={-20} cy={-30} rx={16} ry={8} fill="#FFE27A" /></g> : null}
      </g>
      {spark && t >= hit && t < hit + 14
        ? Array.from({ length: 9 }).map((_, i) => {
            const q = (t - hit) / 14;
            return <circle key={i} cx={950 + Math.cos(i * 0.5 - 0.6) * q * 300} cy={600 + Math.sin(i * 0.5 - 0.6) * q * 160 + q * q * 160} r={7 * (1 - q) + 2} fill="#FFE27A" />;
          })
        : null}
    </g>
  );
};
export const S30 = insert({ Bg: DARK, dim: 0.2, draw: (t) => <g><Strike t={t} hit={10} spark={false} /><Label t={t - (at('Nothing') - at('strike'))} text="NOTHING" y={220} c={WHITE} /></g> });

// ---------- S31: you strike again; a spark lands, the fungus starts to glow ----------
export const S31 = insert({ Bg: DARK, dim: 0.2, draw: (t) => <Strike t={t} hit={8} spark glow={clamp((t - (at('glow') - at('again'))) / 12)} /> });

// ---------- S32: you blow. Gently. Then harder ----------
export const S32: React.FC<ShotProps> = (p) => {
  const k = clamp(p.t / Math.max(1, p.len));
  const F = faceCU({ look: YOU_WOOL, Bg: DARK, faces: [[0, 'neutral']], yaw: 0.1, zoom: [3.4, 3.7], dark: 0.4, light: { x: 960, y: 760, kind: 'warm', o: 0.3 + 0.6 * k }, pose: { headTilt: 10 },
    extra: (t) => <g opacity={0.6}>{[0, 1, 2].map((i) => <path key={i} d={`M ${990 + i * 8} ${570 + ((t * (1 + k) + i * 8) % 24) * 3} l 0 30`} stroke="#F2F8FF" strokeWidth={4} strokeLinecap="round" />)}</g> });
  return <F {...p} />;
};

// ---------- S33: a flame ----------
export const S33 = insert({
  Bg: DARK, dim: 0.2,
  draw: (t) => (
    <g>
      <Glow x={960} y={700} r={500 * backOut(clamp(t / 10))} kind="warm" o={0.8} />
      <g transform={`translate(960 820) scale(${3 * backOut(clamp(t / 10))})`}><Flames x0={-40} x1={40} y={0} t={t} k={0.6} /></g>
    </g>
  ),
});

// ---------- S34: you feed it a twig. Then a stick. Then a log ----------
export const S34 = insert({
  Bg: DARK, dim: 0.2,
  draw: (t) => {
    const t0 = at('feed');
    const n = [at('twig'), at('stick'), at('log')].filter((f) => t >= f - t0).length;
    const k = 0.6 + n * 0.4;
    return (
      <g>
        <Glow x={960} y={700} r={500 + n * 160} kind="warm" o={0.8} />
        {n > 0 ? <path d="M 840 830 L 1080 800" stroke="#7A5232" strokeWidth={10} strokeLinecap="round" /> : null}
        {n > 1 ? <path d="M 780 850 L 1140 820" stroke="#6A4428" strokeWidth={24} strokeLinecap="round" /> : null}
        {n > 2 ? <rect x={700} y={840} width={520} height={60} rx={26} fill="#7A5232" stroke={INK} strokeWidth={6} /> : null}
        <g transform={`translate(960 820) scale(3)`}><Flames x0={-40 - n * 30} x1={40 + n * 30} y={0} t={t} k={k} /></g>
        {n > 0 ? <Label t={t - ([at('twig'), at('stick'), at('log')][n - 1] - t0)} text={['TWIG', 'STICK', 'LOG'][n - 1]} y={200} c={WHITE} /> : null}
      </g>
    );
  },
});

// ---------- S35: the light climbs up the walls ----------
export const S35: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len));
  const Set = inside({ mode: k < 0.5 ? 'dark' : 'night', fire: 0.1 + 0.9 * k });
  return (
    <g transform={camT(960, kf(t, [[0, 640], [Math.max(1, len), 520]]), kf(t, [[0, 1.3], [Math.max(1, len), 1.1]]))}>
      <Set t={t + 600} id="s35" />
    </g>
  );
};

// ---------- S36: Asa stops shivering ----------
export const S36 = scene({ Set: NIGHT, setT: 640, cam: [[830, 620, 2.4], [830, 620, 2.5]], back: (t) => SLEEPERS(t, -1, Math.max(0, 1.5 - t / 20)) });

// ---------- S37: nobody wakes up ----------
export const S37 = scene({ Set: NIGHT, setT: 680, cam: [[660, 640, 1.4], [700, 640, 1.45]], back: (t) => SLEEPERS(t) });

// ---------- S38: nobody ever knows ----------
export const S38 = faceCU({ look: YOU_WOOL, Bg: NIGHT, faces: [[0, 'tired'], [14, 'smug']], yaw: 0.2, zoom: [3.0, 3.2], light: { x: 900, y: 700, o: 0.8 } });

// ---------- S39: but the fire never went out ----------
export const S39 = insert({
  Bg: NIGHT, dim: 0.4,
  draw: (t) => (
    <g>
      <Glow x={960} y={760} r={800} kind="warm" o={0.7} />
      <g transform="translate(960 900) scale(2.6)"><Flames x0={-220} x1={220} y={0} t={t} k={1.2} /></g>
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#FFD23A" stroke="#0B0816" strokeWidth={14} paintOrder="stroke" opacity={clamp((t - 6) / 8)}>THE FIRE NEVER WENT OUT</text>
    </g>
  ),
});

void [Longhouse, NIGHT_OUT];
