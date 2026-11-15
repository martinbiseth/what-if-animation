import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, camT, clamp, easeOut, easeIn, backOut, shake, Smartphone, ShotProps, idleBlink, Glow, FONT,
  Kitchen, KITCHEN, TitleCard, talkShot, LightVeil,
} from '../../../engine';
import { YOU, ELLIE, MOM, faceCU, bigWord, Soft, Handheld, wordF, HeldCandle, DarkBg, handAt } from '../common';
import {
  LivingRoom, LIVING, sofaSit, StreetModern, streetHip, STREETM, Car, RoofNight, roofHip, MilkyWay, Candle, CityWindowView,
} from '../sets';
import words from './words.json';

// Chapter 1, the cold open: 8:14 PM, one level from the end of the game, and everything goes dark at once: the
// console, the TV, the fridge, the lights, your phone, the flashlight, the street, the city. Then the Milky Way, the
// title, and the turn. 24+ cuts a minute.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const LIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={1} />;
const DARK: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={0} />;
const NIGHT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} power={0} car={false} />;

const sit = (w: number, o: Partial<Pose> = {}): Pose => ({
  ...basePose, ...sofaSit(w), yaw: -0.55, facing: -1, legL: { a: 84, b: -84 }, legR: { a: 78, b: -80 },
  armL: { a: 40, b: 70 }, armR: { a: 36, b: 74 }, ...o,
});

// ---------- S1: the game, full frame: LEVEL 99, the boss nearly beaten; a clock chip reads 8:14 PM ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.35}>
      <g transform={camT(960, 520, 1.4)}>
        <LivingRoom t={t + 100} power={1} />
      </g>
    </Soft>
    <g transform={`translate(960 560) scale(${kf(t, [[0, 1.05], [len, 1.18]])}) translate(-960 -560)`}>
      <Handheld x={960} y={560} s={1.25} t={t + 40} on={1} rot={Math.sin(t / 9) * 1.5} />
    </g>
    <g transform="translate(120 120)" opacity={clamp(t / 6)}>
      <rect x={0} y={0} width={300} height={84} rx={20} fill="#0B0816" opacity={0.8} />
      <text x={150} y={58} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={52} fill="#FFFFFF">8:14 PM</text>
    </g>
  </g>
);

// ---------- S2: medium, you on the sofa, leaning in, the TV's blue on your face ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const me = sit(0.6, { armL: { a: 22, b: -112 }, armR: { a: 26, b: -108 }, expr: 'cool', blink: idleBlink(t, 2), tilt: -6 + Math.sin(t / 7) * 2, headTilt: Math.sin(t / 5) * 3, look: -0.6 });
  const s = me.scale;
  return (
    <g transform={camT(kf(t, [[0, 1250], [len, 1230]]), 520, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <LivingRoom t={t + 200} power={1} />
      <Glow x={me.x - 160} y={me.y - 120 * s} r={260} kind="cool" o={0.5} />
      <Hero look={YOU} pose={me} shadow={0} />
      {(() => {
        const a = handAt(me, 'L');
        const b = handAt(me, 'R');
        return (
          <g transform={`translate(${(a.x + b.x) / 2} ${(a.y + b.y) / 2 - 6 * s}) rotate(-8) scale(${0.1 * s})`}>
            <Handheld x={0} y={0} t={t} on={1} />
          </g>
        );
      })()}
    </g>
  );
};

// ---------- S3: the console in your hands; the screen dies on "black" ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const off = at('black') - at('And');
  const on = t < off ? 1 : 0;
  return (
    <g>
      <Soft blur={16} dim={on ? 0.35 : 0.7}>
        <g transform={camT(960, 520, 1.4)}>
          <LivingRoom t={t + 100} power={on} />
        </g>
      </Soft>
      <g transform={`translate(960 560) scale(${kf(t, [[0, 1.2], [len, 1.3]])}) translate(-960 -560)`}>
        <Handheld x={960} y={560} s={1.25} t={t + 60} on={on} glitch={t > off - 6 && t < off ? 1 : 0} />
      </g>
      {t >= off && t < off + 3 ? <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.25} /> : null}
    </g>
  );
};

// ---------- S4: wide, the living room: the TV across the room dies too, then the lamp and the pendant ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const me = sit(0.6, { expr: t > 8 ? 'shock' : 'neutral', blink: idleBlink(t, 4), look: t > 10 ? 0.4 : -0.6, armL: { a: 30, b: 50 }, armR: { a: 28, b: 52 } });
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 980]]), 540, kf(t, [[0, 1.02], [len, 1.08]]))}>
      <LivingRoom t={t + 260} power={1} tv={t < 4 ? 1 : 0} />
      <Hero look={YOU} pose={me} shadow={0} />
    </g>
  );
};

// ---------- S5: the kitchen in the dark: the fridge's little display goes out, its hum lines stop ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const dead = t > 6;
  const d = KITCHEN.P(0.885, 0.3, 0.2);
  return (
    <g transform={camT(d.x - 40, d.y + 80, kf(t, [[0, 2.1], [len, 2.25]]))}>
      <Kitchen t={t + 300} veil={0.85} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.55} />
      <rect x={d.x - 30} y={d.y} width={60} height={26} rx={4} fill="#0B0A10" stroke="#100E16" strokeWidth={3} />
      {!dead ? (
        <g>
          <text x={d.x} y={d.y + 20} textAnchor="middle" fontFamily={FONT.ui} fontSize={18} fill="#5AE0FF">4°C</text>
          <Glow x={d.x} y={d.y + 12} r={60} kind="cool" o={0.7} />
          {[0, 1, 2].map((k) => (
            <path key={k} d={`M ${d.x + 70 + k * 16} ${d.y - 10 + Math.sin(t + k) * 4} q 6 10 0 20 q -6 10 0 20`} stroke="#9AB8FF" strokeWidth={3} fill="none" opacity={0.6} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

// ---------- S6: wide from the door: every light in the house goes out at once ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const p = t < 5 ? 1 : 0;
  const me = sit(0.6, { expr: 'shock', blink: idleBlink(t, 5), look: 0.3, armL: { a: 20, b: 30 }, armR: { a: 18, b: 32 }, yaw: -0.2 });
  return (
    <g transform={camT(960, 520, kf(t, [[0, 0.95], [len, 0.9]]))}>
      <LivingRoom t={t + 320} power={p} tv={0} />
      <Hero look={YOU} pose={me} shadow={0} />
      {p === 0 ? <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.2} /> : null}
    </g>
  );
};

// ---------- S7: close, your face in the dark, only the window's starlight on it ----------
export const S7 = faceCU({ look: YOU, Bg: DARK, faces: [[0, 'shock']], yaw: -0.3, eyes: 0.2, zoom: [3.4, 3.7], dark: 0.4, light: { x: 1080, y: 420, kind: 'cool', o: 0.35 } });

// ---------- S8: your phone: you press and hold the button; nothing, a black screen ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const press = t > 6 && t < 30 ? 1 : 0;
  return (
    <g>
      <DarkBg t={t} />
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.08]])}) translate(-960 -540)`}>
        <path d="M 1300 1200 Q 1250 900 1160 760 L 1000 800 Q 1060 980 1060 1200 Z" fill="#F07A2A" stroke="#100E16" strokeWidth={8} />
        <Smartphone x={960} y={540} s={1.15} rot={-4} mode="off" t={t} battery={0} glow={0} status={false} />
        <ellipse cx={1100} cy={700} rx={90} ry={110} fill="#26232F" stroke="#100E16" strokeWidth={8} />
        <ellipse cx={1150 - press * 10} cy={430} rx={34} ry={46} fill="#26232F" stroke="#100E16" strokeWidth={7} />
      </g>
      {[0, 1, 2].map((k) => (t > 8 + k * 6 ? <circle key={k} cx={1200} cy={420} r={(t - 8 - k * 6) * 4} fill="none" stroke="#F6EFE3" strokeWidth={3} opacity={Math.max(0, 0.5 - (t - 8 - k * 6) / 30)} /> : null))}
    </g>
  );
};

// ---------- S9: close, worried: not low battery. Dead. ----------
export const S9 = faceCU({ look: YOU, Bg: DARK, faces: [[0, 'worried']], yaw: 0.35, zoom: [3.1, 3.3], dark: 0.4, light: { x: 900, y: 560, kind: 'cool', o: 0.2 } });

// ---------- S10: the kitchen drawer, the flashlight: click, click, nothing ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const clicks = [8, 16, 24].filter((c) => t >= c).length;
  return (
    <g>
      <DarkBg t={t} />
      <g transform={`translate(960 540) scale(${kf(t, [[0, 1], [len, 1.06]])}) translate(-960 -540)`}>
        {/* the drawer front and its contents, seen from above */}
        <rect x={360} y={600} width={1200} height={520} fill="#3A3040" stroke="#100E16" strokeWidth={8} />
        <rect x={400} y={640} width={1120} height={440} fill="#241E2A" />
        {[[520, 760, 30], [1340, 820, -20], [700, 960, 10]].map(([x, y, r], i) => (
          <rect key={i} x={x - 60} y={y - 10} width={120} height={20} rx={8} fill={['#C84A3A', '#8A8A9A', '#3A8A4A'][i]} transform={`rotate(${r} ${x} ${y})`} />
        ))}
        {/* the flashlight, lifted */}
        <g transform={`translate(960 ${kf(t, [[0, 820], [6, 560]], easeOut)}) rotate(-20)`}>
          <rect x={-200} y={-46} width={300} height={92} rx={20} fill="#2E3A5A" stroke="#100E16" strokeWidth={8} />
          <path d="M 100 -60 L 220 -86 L 220 86 L 100 60 Z" fill="#3A4A6A" stroke="#100E16" strokeWidth={8} />
          <ellipse cx={220} cy={0} rx={18} ry={86} fill="#9AA8C0" stroke="#100E16" strokeWidth={6} />
          <rect x={-40} y={-62} width={50} height={20} rx={6} fill="#E8252A" stroke="#100E16" strokeWidth={5} />
          <ellipse cx={-10} cy={-70 + (clicks % 2) * 4} rx={46} ry={34} fill="#26232F" stroke="#100E16" strokeWidth={7} />
          <path d="M -60 -30 Q -180 60 -320 120" stroke="#F07A2A" strokeWidth={90} strokeLinecap="round" fill="none" />
        </g>
      </g>
      {[8, 16, 24].map((c) => (t >= c && t < c + 4 ? <text key={c} x={760} y={380} fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#F6EFE3" opacity={1 - (t - c) / 4} transform={`rotate(-8 760 380)`}>click</text> : null))}
    </g>
  );
};

// ---------- S11: close, oops: dead too ----------
export const S11 = faceCU({ look: YOU, Bg: DARK, faces: [[0, 'worried'], [8, 'oops']], yaw: -0.25, zoom: [3.3, 3.2], dark: 0.4 });

// ---------- S12: wide, the street at night with no light at all; you come out of your front door ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 1240], [len, 1320]], (k) => k);
  const me: Pose = { ...basePose, x, y: streetHip(0.8), scale: 0.8, yaw: 0.2, expr: 'worried', blink: idleBlink(t, 6), look: -0.3 };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 1000]]), 520, kf(t, [[0, 1.0], [len, 1.06]]))}>
      <StreetModern t={t + 400} power={0} car={false} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S13: a car rolls to a stop, no lights, no sound; the driver stares at the dash ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const stop = 34;
  const x = t < stop ? kf(t, [[0, -200], [stop, 820]], easeOut) : 820;
  return (
    <g transform={camT(kf(t, [[0, 700], [len, 820]]), 640, 1.35)}>
      <StreetModern t={t + 500} power={0} car={false} />
      <Car x={x} y={STREETM.kerb + 140} s={1.1} color="#C84A3A" lights={0} />
    </g>
  );
};

// ---------- S14: the street lamp overhead: dead ----------
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(600, kf(t, [[0, 470], [len, 440]]), kf(t, [[0, 3.4], [len, 3.7]]))}>
    <StreetModern t={t + 600} power={0} car={false} />
  </g>
);

// ---------- S15: the traffic light at the corner: dark in all three ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1599, kf(t, [[0, 420], [len, 400]]), kf(t, [[0, 3.2], [len, 3.5]]))}>
    <StreetModern t={t + 700} power={0} car={false} signal="off" />
  </g>
);

// ---------- S16: the whole city from up high, pan right: not one light to the horizon ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(kf(t, [[0, 820], [len, 1100]]), 600, 1.05)}>
    <RoofNight t={t + 100} power={0} milky={0} />
  </g>
);

// ---------- S17: wide, you in the middle of the silent street, a parked car, nothing moving ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: 960, y: STREETM.kerb + 80 - 400 * 0.85 * 0 - 0, scale: 0.85, yaw: 0, expr: 'worried', blink: idleBlink(t, 7), look: Math.sin(t / 16) };
  me.y = STREETM.kerb + 120 - 378 * 0.85 * 0.55;
  return (
    <g transform={camT(960, 560, kf(t, [[0, 0.95], [len, 0.9]]))}>
      <StreetModern t={t + 800} power={0} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S18: low angle, you tip your head back and look up ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => {
  const up = easeOut(clamp(t / 18));
  const me: Pose = { ...basePose, x: 960, y: 700, scale: 1.3, yaw: 0.15, headTilt: -14 * up, look: 0, expr: t > 20 ? 'shock' : 'neutral', blink: idleBlink(t, 2), glint: up, glintColor: '#CFE0FF' };
  return (
    <g transform={camT(960, kf(t, [[0, 560], [len, 520]]), 1.7)}>
      <StreetModern t={t + 900} power={0} milky={up} car={false} />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#05050F" opacity={0.25} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S19: tilt up off the dark roofs into the sky: stars, more stars ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 640], [len, 280]]), 1.1)}>
    <StreetModern t={t + 1000} power={0} milky={kf(t, [[0, 0.3], [len, 1]])} car={false} />
  </g>
);

// ---------- S20: the Milky Way across the whole frame ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={`translate(960 540) rotate(${kf(t, [[0, -3], [len, 2]])}) scale(${kf(t, [[0, 1.05], [len, 1.15]])}) translate(-960 -540)`}>
    <rect x={-400} y={-400} width={2800} height={1900} fill="#070818" />
    <MilkyWay x0={-300} y0={900} x1={2200} y1={150} o={1} t={t} w={420} />
    {Array.from({ length: 160 }).map((_, i) => (
      <circle key={i} cx={(Math.abs(Math.sin(i * 12.9898) * 43758.5) % 1) * 1920} cy={(Math.abs(Math.sin(i * 78.233) * 43758.5) % 1) * 1080} r={0.8 + (i % 3) * 0.6} fill="#EAF0FF" opacity={0.5 + 0.4 * Math.sin(t / 8 + i)} />
    ))}
  </g>
);

// ---------- S21: the title over the dark city under the Milky Way ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.05]]))}>
      <RoofNight t={t + 300} power={0} milky={1} />
    </g>
    <TitleCard t={t} lines={['WHAT IF ELECTRICITY', 'DISAPPEARED FOREVER?']} accent="FOREVER?" size={104} y={190} />
  </g>
);

// ---------- S22: the first night: the family round one candle in the living room, almost cosy ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => {
  const c = LIVING.P(0.5, 0.86, 0.57);
  return talkShot({
    Set: ({ t: tt, id }) => <LivingRoom t={tt} id={id} power={0} candles={[c]} veil={0.7} />, setT: 400,
    cast: [
      { look: YOU, ...sofaSit(0.5), yaw: -0.5, faces: [[0, 'neutral'], [30, 'happy']], pose: { facing: -1, legL: { a: 84, b: -84 }, legR: { a: 78, b: -80 } } },
      { look: MOM, x: 760, y: 820 - 378 * 0.95 * 0.55, scale: 0.95, yaw: 0.4, faces: [[0, 'happy']] },
      { look: ELLIE, x: 900, y: 860 - 378 * 0.7 * 0.55, scale: 0.7, yaw: 0.2, faces: [[0, 'happy']] },
    ],
    cam: { from: [1000, 600, 1.45], to: [1000, 600, 1.55] },
  })({ t, len, f: t });
};

// ---------- S23: a city drawn in light lines like veins, pulsing with a heartbeat, then fading out ----------
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const beat = Math.pow(Math.max(0, Math.sin(t / 5)), 8);
  const fade = clamp(1 - (t - len * 0.55) / (len * 0.35));
  const lines = [
    'M 200 800 Q 500 700 760 760 T 1300 700 T 1720 760',
    'M 960 980 L 960 760 L 820 600 M 960 760 L 1120 560',
    'M 480 760 L 480 520 M 1480 720 L 1480 460 M 760 760 L 700 600',
    'M 300 900 Q 640 860 960 980 Q 1280 860 1620 900',
  ];
  return (
    <g>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0B0A18" />
      {Array.from({ length: 14 }).map((_, i) => {
        const bx = 140 + i * 120;
        const bh = 120 + (Math.abs(Math.sin(i * 3.1)) * 320);
        return <rect key={i} x={bx} y={820 - bh} width={100} height={bh} fill="#16152A" stroke="#2A2A4A" strokeWidth={3} />;
      })}
      {lines.map((d, i) => (
        <g key={i} opacity={fade}>
          <path d={d} stroke="#FF5A5A" strokeWidth={10 + beat * 8} fill="none" strokeLinecap="round" opacity={0.35} filter="url(#blur6)" />
          <path d={d} stroke="#FFC0A0" strokeWidth={4 + beat * 3} fill="none" strokeLinecap="round" />
        </g>
      ))}
      <g transform={`translate(960 260) scale(${1 + beat * 0.15})`} opacity={fade}>
        <path d="M 0 60 C -120 -20 -90 -110 0 -50 C 90 -110 120 -20 0 60 Z" fill="#E8252A" stroke="#100E16" strokeWidth={6} />
      </g>
    </g>
  );
};

// ---------- S24: DAY 1, the clock starts ----------
export const S24 = bigWord({ kicker: 'THE CLOCK STARTS', word: 'DAY 1', color: '#FF3A3A', Bg: NIGHT });

// keep the unused imports honest for the linter
void LIT; void poseAt; void faceAt; void easeIn; void backOut; void shake; void roofHip; void Candle; void CityWindowView; void HeldCandle; void LightVeil;
