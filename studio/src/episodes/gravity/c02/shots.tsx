import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, backOut, ShotProps, FONT, Kitchen, KITCHEN, stand, rnd, Schematic, SCH, SchLabel, DrawOn, Arrow, UI,
} from '../../../engine';
import { YOU, MOM, ELLIE, Soft, wordF, faceCU, Dog, Body, lie, heavy, doublingShot, setShot, bigWord } from '../common';
import { LivingRoom, LIVING, StreetModern, STREETM, streetHip, LIVING_TV } from '../../electricity/sets';
import words from './words.json';

// Chapter 2, the rule: at seven gravity doubled everywhere at once, nobody knows why, the Earth is the same size and
// just pulls harder. It doubles every hour on the hour: 2, 4, 8, 16. Everything weighs that much more (Mom on the
// scale). Light, phones and TV still work. It only goes one way... until ten o'clock.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const KIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} veil={0.25} />;
const LR: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={1} veil={0.2} tv={1} />;
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" car={true} />;

/** The Earth on the schematic with its pull: arrows from all round pointing in, `k` how hard (1 normal, 2 double...). */
const EarthPull: React.FC<{ t: number; k: number; x?: number; y?: number; r?: number }> = ({ t, k, x = 960, y = 560, r = 230 }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill="#1E4A7A" stroke={SCH.line} strokeWidth={6} />
    <path d={`M ${x - 150} ${y - 120} q 60 -40 120 0 q 30 60 -40 90 q -70 0 -80 -90 Z M ${x + 40} ${y + 40} q 80 -30 120 30 q -20 80 -90 60 Z`} fill="#3E8A5A" opacity={0.9} />
    {Array.from({ length: 12 }).map((_, i) => {
      const a = (i / 12) * Math.PI * 2;
      const r0 = r + 200;
      const r1 = r + 40;
      const w = 4 + 5 * k;
      const pulse = (t * 2 + i * 10) % 40;
      return (
        <g key={i}>
          <path d={`M ${x + Math.cos(a) * r0} ${y + Math.sin(a) * r0} L ${x + Math.cos(a) * r1} ${y + Math.sin(a) * r1}`} stroke={k > 1 ? SCH.live : SCH.line} strokeWidth={w} strokeLinecap="round" />
          <path d={`M ${x + Math.cos(a) * (r1 + 2)} ${y + Math.sin(a) * (r1 + 2)} l ${Math.cos(a + 2.6) * 30} ${Math.sin(a + 2.6) * 30} M ${x + Math.cos(a) * (r1 + 2)} ${y + Math.sin(a) * (r1 + 2)} l ${Math.cos(a - 2.6) * 30} ${Math.sin(a - 2.6) * 30}`} stroke={k > 1 ? SCH.live : SCH.line} strokeWidth={w} strokeLinecap="round" />
          <circle cx={x + Math.cos(a) * (r0 - pulse * 4)} cy={y + Math.sin(a) * (r0 - pulse * 4)} r={5} fill={SCH.glow} opacity={0.6} />
        </g>
      );
    })}
  </g>
);

// ---------- S1: the schematic Earth: at seven, its pull doubles (the arrows thicken and turn orange) ----------
export const S1: React.FC<ShotProps> = ({ t, len, f }) => {
  const k = rel(f, t, 'twice');
  const g = t >= k ? 2 : 1;
  return (
    <g>
      <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.08]]))}>
        <Schematic t={t} id="c2s1" />
        <EarthPull t={t} k={g} />
      </g>
      <SchLabel x={960} y={150} t={t - 4} text="7:00 AM" size={48} color={SCH.dim} />
      {t >= k ? (
        <g transform={`translate(1500 560) scale(${backOut(clamp((t - k) / 8))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={140} fill={SCH.live}>×2</text>
        </g>
      ) : null}
    </g>
  );
};

// ---------- S2: everywhere at once: a wide street, people bent over, a car's suspension squashed low ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const people = [640, 980, 1340, 1640];
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 1100]]), 560, 1.0)}>
      <DAY t={t + 100} />
      {people.map((x, i) => {
        const s = 0.75;
        return <Body key={i} look={[YOU, MOM, ELLIE, MOM][i]} pose={{ ...basePose, x: x + Math.sin(t / 20 + i) * 6, y: streetHip(s) + 8, scale: i === 2 ? 0.55 : s, yaw: i % 2 ? -0.6 : 0.6, ...heavy(2), facing: i % 2 ? -1 : 1 }} t={t} seed={i + 2} shadow={1} />;
      })}
    </g>
  );
};

// ---------- S3: same Earth, same size, just pulling harder: a ruler shows the size didn't change ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1]]))}>
      <Schematic t={t} id="c2s3" />
      <EarthPull t={t} k={2} />
      <DrawOn d="M 730 860 L 1190 860" t={t - 30} dur={10} color={SCH.line} width={6} />
      <DrawOn d="M 730 840 L 730 880 M 1190 840 L 1190 880" t={t - 30} dur={4} color={SCH.line} width={6} />
    </g>
    <SchLabel x={960} y={140} t={t - 6} text="NO FLASH. NO SOUND." size={52} />
    <SchLabel x={960} y={950} t={t - 40} text="SAME SIZE. JUST PULLING HARDER." size={44} color={SCH.live} />
  </g>
);

// ---------- S4: the ladder: 2 at seven, 4 at eight, 8 at nine, 16 at ten, each bar popping on its word ----------
export const S4: React.FC<ShotProps> = (p) => {
  const r = (w: string, n = 1) => rel(p.f, p.t, w, n);
  const lit = p.t >= r('Sixteen') ? 4 : p.t >= r('Eight') ? 3 : p.t >= r('Four') ? 2 : 1;
  return doublingShot({ lit, at: [0, r('Two'), r('Four'), r('Eight'), r('Sixteen')] })(p);
};

// ---------- S5: you weigh times that number: you, your backpack, the dog, the air, each with ×2 ----------
const Weight: React.FC<{ x: number; y: number; t: number; t0: number; label: string; children: React.ReactNode }> = ({ x, y, t, t0, label, children }) => {
  const pop = backOut(clamp((t - t0) / 8));
  if (pop <= 0) return null;
  return (
    <g transform={`translate(${x} ${y}) scale(${pop})`}>
      {children}
      <text x={0} y={190} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} letterSpacing={4} fill={SCH.line}>{label}</text>
      <g transform={`translate(110 -120) scale(${backOut(clamp((t - t0 - 8) / 8))})`}>
        <rect x={-60} y={-40} width={120} height={70} rx={35} fill={UI.pill} stroke={SCH.live} strokeWidth={4} />
        <text x={0} y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill={SCH.live}>×2</text>
      </g>
    </g>
  );
};
export const S5: React.FC<ShotProps> = ({ t, len, f }) => {
  const r = (w: string, n = 1) => rel(f, t, w, n);
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.04]]))}>
        <Schematic t={t} id="c2s5" />
      </g>
      <Weight x={330} y={520} t={t} t0={0} label="YOU">
        <g transform="scale(0.55) translate(0 160)"><Hero look={YOU} pose={{ ...basePose, x: 0, y: 0, ...heavy(2) }} shadow={0} /></g>
      </Weight>
      <Weight x={760} y={520} t={t} t0={r('backpack')} label="BACKPACK">
        <g>
          <rect x={-80} y={-110} width={160} height={200} rx={40} fill="#3E8C86" stroke={SCH.line} strokeWidth={6} />
          <rect x={-56} y={-10} width={112} height={70} rx={14} fill="#2F6E69" stroke={SCH.line} strokeWidth={5} />
          <path d="M -40 -110 Q 0 -170 40 -110" stroke={SCH.line} strokeWidth={8} fill="none" />
        </g>
      </Weight>
      <Weight x={1190} y={520} t={t} t0={r('dog')} label="DOG">
        <Dog x={-40} y={60} s={0.6} t={t} flat={0.4} />
      </Weight>
      <Weight x={1610} y={520} t={t} t0={r('air')} label="THE AIR">
        <g stroke={SCH.line} strokeWidth={6} fill="none" strokeLinecap="round">
          {[-60, 0, 60].map((y, i) => (
            <path key={i} d={`M -110 ${y} q 40 -30 80 0 t 80 0 t 60 0`} transform={`translate(${Math.sin(t / 8 + i) * 8} 0)`} />
          ))}
          <path d="M 0 90 L 0 160 M -26 134 L 0 160 L 26 134" stroke={SCH.live} />
        </g>
      </Weight>
    </g>
  );
};

// ---------- S6: insert, the bathroom scale from above: the number spins up to double, Mom's slippers on it ----------
export const S6: React.FC<ShotProps> = ({ t, len, f }) => {
  const look = rel(f, t, 'looks');
  const v = Math.round(64 * (1 + clamp(t / 18)));
  const off = rel(f, t, 'off');
  const on = t < off;
  return (
    <g>
      <rect width={1920} height={1080} fill="#BFD6DA" />
      {Array.from({ length: 12 }).map((_, i) => (
        <path key={i} d={`M ${i * 180} 0 L ${i * 180} 1080 M 0 ${i * 180} L 1920 ${i * 180}`} stroke="#A8C2C6" strokeWidth={6} />
      ))}
      <g transform={camT(960, 560, kf(t, [[0, 1.2], [len, 1.32]]))}>
        <rect x={640} y={260} width={640} height={640} rx={80} fill="#F6F2EA" stroke="#1A1620" strokeWidth={10} />
        <rect x={800} y={320} width={320} height={130} rx={16} fill="#1A2420" />
        <text x={960} y={420} textAnchor="middle" fontFamily={FONT.ui} fontSize={92} fill={v > 100 ? '#FF5A4A' : '#5BE08A'}>{on ? v : 0}</text>
        <text x={1100} y={436} textAnchor="end" fontFamily={FONT.ui} fontSize={26} fill="#8FA2C0">kg</text>
        {on ? (
          <g>
            {[-1, 1].map((sd) => (
              <g key={sd} transform={`translate(${960 + sd * 120} 700)`}>
                <ellipse rx={80} ry={140} fill="#8A5A6A" stroke="#1A1620" strokeWidth={8} />
                <ellipse cy={-30} rx={56} ry={60} fill="#F2D2C8" stroke="#1A1620" strokeWidth={6} />
              </g>
            ))}
          </g>
        ) : null}
      </g>
      {t >= look && on ? <text x={1500} y={300} fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#1A1620" opacity={clamp((t - look) / 6)}>...</text> : null}
    </g>
  );
};

// ---------- S7: Mom's face: she steps off, and never mentions it again ----------
export const S7 = faceCU({ look: MOM, Bg: KIT, faces: [[0, 'shock'], [18, 'smug']], yaw: -0.25, zoom: [3.1, 3.3], eyes: 0.6 });

// ---------- S8: the TV still works: you on the sofa in the living room, the news on, everyone else panicking ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const a = LIVING_TV.a;
  const fl = LIVING.P(0.6, 1, 0.66);
  const pose = lie(fl.x, fl.y, 0.85, -1, { expr: 'neutral', look: -0.8 });
  return (
    <g transform={camT(kf(t, [[0, fl.x - 120], [len, fl.x - 200]]), fl.y - 170, kf(t, [[0, 1.9], [len, 2.05]]))}>
      <LR t={t + 200} />
      <g transform={`translate(${a.x + 20} ${a.y + 30})`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <circle key={i} cx={20 + i * 14 + Math.sin(t / 3 + i) * 6} cy={60 + Math.cos(t / 4 + i) * 6} r={6} fill="#F6EFE3" opacity={0.7} />
        ))}
      </g>
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'neutral'], [30, 'smug']]} />
      <Dog x={fl.x + 260} y={fl.y + 10} s={0.45} t={t} flat={1} />
    </g>
  );
};

// ---------- S9: the rule, said plainly: one arrow, UP, doubling ----------
export const S9: React.FC<ShotProps> = ({ t, len, f }) => {
  const r = (w: string, n = 1) => rel(f, t, w, n);
  const marks = [r('Double'), r('double', 2), r('double', 3)];
  return (
    <g>
      <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.05]]))}>
        <Schematic t={t} id="c2s9" />
      </g>
      <Arrow x0={960} y0={940} x1={960} y1={180} t={t - r('Up')} dur={10} color={SCH.live} bend={0} />
      {['×2', '×2', '×2'].map((s, i) =>
        t >= marks[i] ? (
          <g key={i} transform={`translate(${1140} ${760 - i * 220}) scale(${backOut(clamp((t - marks[i]) / 6))})`}>
            <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill={SCH.live}>{s}</text>
          </g>
        ) : null,
      )}
      <SchLabel x={620} y={560} t={t - 4} text="ONLY ONE WAY" size={50} />
      <SchLabel x={620} y={630} t={t - r('every')} text="EVERY 60 MINUTES" size={40} color={SCH.dim} />
    </g>
  );
};

// ---------- S10: "Until ten o'clock": the clock face, 10:00, in red, with a question ----------
export const S10 = bigWord({ kicker: "THAT'S WHAT EVERYONE BELIEVES", word: '10:00 ?', color: '#FF4A3A', Bg: DAY, size: 260 });

