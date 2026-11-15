import React from 'react';
import {
  Hero, Pose, basePose, poseAt, faceAt, kf, camT, clamp, easeOut, easeIn, backOut, shake, ShotProps, idleBlink, Glow, FONT,
  Kitchen, KITCHEN, KitchenIsland, stand, Bedroom, BEDROOM, BedDuvet, bedSit, AlarmClock, TitleCard, Smartphone, rnd, LEG_LEN,
} from '../../../engine';
import { YOU, MOM, Soft, wordF, faceCU, Dog, Pigeon, PoolYard, YARD, WallDial, gCard, phoneG, Body, lie, heavy } from '../common';
import { LivingRoom, LIVING } from '../../electricity/sets';
import words from './words.json';

// Chapter 1, the cold open: 7 AM, the alarm, you hit the floor, the phone smacks the carpet, the cereal shoots into the
// bowl, the milk hits the ceiling, Biscuit flat as a rug, the pigeon that gives up, the gravity app reads 19.6, 2G,
// the clock heading for eight, the title. 24+ cuts a minute.

const W = words;
const at = (a: string, n = 1) => wordF(W, a, n);
/** Frame on this shot's clock where word a (nth in the chapter) starts. */
const rel = (f: number, t: number, a: string, n = 1) => at(a, n) - (f - t);
const BED: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} clock="07:00" lamp={1} veil={0.3} duvet={false} />;
const KIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} veil={0.25} />;
const LR: React.FC<{ t: number; id?: string }> = ({ t, id }) => <LivingRoom t={t} id={id} power={1} veil={0.2} />;
const floorAt = (u: number, w: number) => BEDROOM.P(u, 1, w);

// ---------- S1: the alarm clock, 07:00, ringing ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const ring = Math.sin(t * 2.2) * 4;
  return (
    <g>
      <Soft blur={16} dim={0.4}>
        <g transform={camT(940, 560, 1.6)}>
          <BED t={t + 100} />
        </g>
      </Soft>
      <g transform={`translate(960 640) scale(${kf(t, [[0, 2.4], [len, 2.6]])}) rotate(${ring}) translate(-960 -640)`}>
        <AlarmClock x={960} y={640} text="07:00" on={Math.floor(t / 6) % 2 ? 1 : 0.4} />
      </g>
      {[-1, 1].map((sd) => (
        <g key={sd} stroke="#FFD23A" strokeWidth={10} strokeLinecap="round" fill="none" opacity={Math.floor(t / 4) % 2 ? 1 : 0.3}>
          <path d={`M ${960 + sd * 360} 420 l ${sd * 50} -40`} />
          <path d={`M ${960 + sd * 380} 520 l ${sd * 70} 0`} />
          <path d={`M ${960 + sd * 360} 620 l ${sd * 50} 40`} />
        </g>
      ))}
    </g>
  );
};

// ---------- S2: wide bedroom: you swing out of bed and slam into the floor, much too fast ----------
export const S2: React.FC<ShotProps> = ({ t, len, f }) => {
  const hit = rel(f, t, 'hit');
  const st = stand(BEDROOM, 0.36, 0.5);
  const fl = floorAt(0.42, 0.62);
  const sit = bedSit(0.3);
  const k = easeIn(clamp((t - (hit - 6)) / 6));
  const sitPose: Pose = { ...basePose, ...sit, yaw: 0.4, legL: { a: 80, b: -80 }, legR: { a: 76, b: -76 }, expr: 'tired', armL: { a: 20, b: -10 }, armR: { a: 24, b: -10 } };
  const lying = lie(fl.x, fl.y, st.scale, -1, { expr: 'shock', armL: { a: 28, b: -10 }, armR: { a: 40, b: -10 }, squash: 0 });
  const p = t < hit - 6 ? sitPose : t < hit ? { ...sitPose, x: sitPose.x + (fl.x - sitPose.x) * k, y: sitPose.y + (lying.y - sitPose.y) * k, spin: -90 * k, expr: 'shock' as const } : lying;
  const bounce = t >= hit ? Math.max(0, 1 - (t - hit) / 6) : 0;
  return (
    <g transform={`${shake(t, hit, 8, 14)} ${camT(kf(t, [[0, 900], [len, 920]]), 560, kf(t, [[0, 1.55], [len, 1.65]]))}`}>
      <BED t={t + 160} />
      <Hero look={YOU} pose={{ ...p, squash: bounce * 0.2, blink: idleBlink(t, 2) }} shadow={0} />
      {t < hit - 6 ? <BedDuvet from={0.05} knees={0} /> : <BedDuvet from={0.05} knees={0} />}
      {t >= hit && t < hit + 14 ? (
        <g opacity={1 - (t - hit) / 14}>
          {Array.from({ length: 8 }).map((_, i) => (
            <circle key={i} cx={fl.x - 140 + i * 40} cy={fl.y - (t - hit) * 3 * rnd(2, i)} r={8 + rnd(3, i) * 8} fill="#E9DCC0" opacity={0.6} />
          ))}
        </g>
      ) : null}
    </g>
  );
};

// ---------- S3: close on the floor: your face pressed into the carpet, arms spread like sandbags ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const fl = floorAt(0.5, 0.75);
  const s = 1;
  const pose = lie(960, 800, s, -1, { expr: 'tired', armL: { a: 24, b: -6 + Math.sin(t / 5) * 4 }, armR: { a: 36, b: -6 }, headTilt: -8 });
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2234" />
      <g transform={camT(kf(t, [[0, 820], [len, 800]]), 700, kf(t, [[0, 2.0], [len, 2.15]]))}>
        <Soft blur={10} dim={0.2}>
          <g transform={camT(fl.x, fl.y - 120, 1.4)}>
            <BED t={t + 200} />
          </g>
        </Soft>
        <rect x={0} y={735} width={1920} height={600} fill="#5A4A6A" />
        {Array.from({ length: 30 }).map((_, i) => (
          <path key={i} d={`M ${200 + i * 52} ${760 + (i % 4) * 30} l 8 -10`} stroke="#4A3A5A" strokeWidth={4} />
        ))}
        <Body look={YOU} pose={pose} t={t} faces={[[0, 'tired'], [Math.round(len * 0.5), 'worried']]} />
        {[0, 1, 2].map((i) => (
          <text key={i} x={560 + i * 90} y={640 - ((t * 1.5 + i * 20) % 60)} fontFamily={FONT.title} fontWeight={800} fontSize={48} fill="#F6EFE3" opacity={0.6}>
            ↓
          </text>
        ))}
      </g>
    </g>
  );
};

// ---------- S4: the phone slides off the nightstand and smacks into the carpet. "Hard." ----------
export const S4: React.FC<ShotProps> = ({ t, len, f }) => {
  const smack = rel(f, t, 'smacks');
  const hard = rel(f, t, 'Hard');
  const k = clamp(t / Math.max(1, smack - 4));
  const fall = easeIn(clamp((t - (smack - 4)) / 4));
  const x = 700 + 220 * k + 80 * fall;
  const y = 520 + 420 * fall;
  const rot = 40 * fall;
  const land = t >= smack;
  return (
    <g transform={shake(t, smack, 8, 18)}>
      <Soft blur={16} dim={0.35}>
        <g transform={camT(940, 600, 1.8)}>
          <BED t={t + 260} />
        </g>
      </Soft>
      <rect x={0} y={560} width={1100} height={90} fill="#4A3A34" />
      <rect x={0} y={560} width={1100} height={20} fill="#6A5244" />
      <rect x={-200} y={950} width={2400} height={300} fill="#5A4A6A" />
      <g transform={`translate(${land ? 1000 : x} ${land ? 960 : y}) rotate(${land ? 90 : rot})`}>
        <Smartphone x={0} y={0} s={0.42} mode="off" glow={0} />
      </g>
      {land && t < smack + 10 ? (
        <g opacity={1 - (t - smack) / 10}>
          <path d="M 860 930 l -60 -40 M 1140 930 l 60 -40 M 1000 900 l 0 -70" stroke="#F6EFE3" strokeWidth={10} strokeLinecap="round" />
        </g>
      ) : null}
      {t >= at('Hard') - at('Your', 2) ? (
        <g transform={`translate(1400 420) scale(${backOut(clamp((t - hard) / 6))}) rotate(-8)`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={150} fill="#FFD23A" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">THUD.</text>
        </g>
      ) : null}
      {len > 0 ? null : null}
    </g>
  );
};

// ---------- S5: the kitchen: Mom at the island, about to pour the cereal, already tired ----------
const MOMP = stand(KITCHEN, 0.5, 0.4);
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const pose: Pose = { ...basePose, ...MOMP, yaw: 0.25, ...heavy(2), armR: { a: 70, b: -50 }, armL: { a: 40, b: -70 }, expr: 'worried' };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 970]]), 560, kf(t, [[0, 1.5], [len, 1.62]]))}>
      <KIT t={t + 100} />
      <Body look={MOM} pose={pose} t={t} faces={[[0, 'neutral'], [16, 'worried']]} seed={3} />
      <KitchenIsland />
      <CerealBox x={MOMP.x + 150} y={MOMP.y - 20} s={0.5} rot={-40} />
      <Bowl x={MOMP.x + 60} y={MOMP.y + 40} s={0.5} fill={0} />
    </g>
  );
};

/** A cereal box in profile, rotating about its base corner. */
const CerealBox: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-90} y={-260} width={180} height={260} rx={8} fill="#E8603A" stroke="#1A1018" strokeWidth={8} />
    <rect x={-70} y={-220} width={140} height={60} rx={8} fill="#FFD23A" />
    <text x={0} y={-176} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#1A1018">CRUNCH</text>
    <circle cx={0} cy={-90} r={48} fill="#F6EFE3" stroke="#1A1018" strokeWidth={5} />
    {[[-14, -96], [14, -84], [0, -104]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={10} fill="#D9A262" />)}
  </g>
);
/** A bowl seen from the side, `fill` 0..1 of cereal, `milk` 0..1. */
const Bowl: React.FC<{ x: number; y: number; s?: number; fill?: number; milk?: number }> = ({ x, y, s = 1, fill = 0, milk = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={200} ry={20} fill="#000" opacity={0.3} />
    {fill > 0 ? (
      <g>
        {Array.from({ length: Math.round(18 * fill) }).map((_, i) => (
          <circle key={i} cx={-140 + rnd(1, i) * 280} cy={-120 - rnd(2, i) * 30 * fill} r={18} fill="#D9A262" stroke="#8A5A30" strokeWidth={4} />
        ))}
      </g>
    ) : null}
    {milk > 0 ? <ellipse cx={0} cy={-124} rx={170 * milk} ry={20} fill="#F6F2EA" /> : null}
    <path d="M -190 -130 Q -180 0 0 0 Q 180 0 190 -130 Z" fill="#3A8AB0" stroke="#1A1018" strokeWidth={8} />
    <ellipse cx={0} cy={-130} rx={190} ry={24} fill="none" stroke="#1A1018" strokeWidth={8} />
  </g>
);

// ---------- S6: insert, the pour: the cereal doesn't fall, it SHOOTS, in hard streaks ----------
export const S6: React.FC<ShotProps> = ({ t, len, f }) => {
  const shoot = rel(f, t, 'shoots');
  const fast = t >= shoot ? 1 : 0.4;
  return (
    <g>
      <Soft blur={16} dim={0.3}>
        <g transform={camT(960, 560, 2.2)}>
          <KIT t={t + 200} />
        </g>
      </Soft>
      <rect x={-100} y={860} width={2200} height={400} fill="#C9B89A" />
      <rect x={-100} y={860} width={2200} height={18} fill="#E9DCC0" />
      <g transform={camT(960, 540, kf(t, [[0, 1.6], [len, 1.75]]))}>
        <CerealBox x={1100} y={330} s={0.9} rot={-118} />
        <Bowl x={940} y={720} s={0.9} fill={clamp(t / Math.max(1, len))} />
        {Array.from({ length: 10 }).map((_, i) => {
          const ph = ((t * (fast ? 40 : 14) + i * 37) % 260) / 260;
          const x = 980 + (rnd(4, i) - 0.5) * 60;
          const y = 380 + ph * 240;
          return (
            <g key={i}>
              {fast ? <path d={`M ${x} ${y - 60} L ${x} ${y}`} stroke="#FFFFFF" strokeWidth={6} opacity={0.5} /> : null}
              <circle cx={x} cy={y} r={15} fill="#D9A262" stroke="#8A5A30" strokeWidth={4} />
            </g>
          );
        })}
        {t >= shoot && t < shoot + 10 ? <circle cx={940} cy={600} r={60 + (t - shoot) * 14} fill="none" stroke="#FFD23A" strokeWidth={6} opacity={1 - (t - shoot) / 10} /> : null}
      </g>
    </g>
  );
};

// ---------- S7: the milk lands so hard it splashes the ceiling: tilt up with the splash ----------
export const S7: React.FC<ShotProps> = ({ t, len, f }) => {
  const sp = rel(f, t, 'splashes');
  const up = easeOut(clamp((t - sp) / 10));
  return (
    <g transform={camT(960, 540 - 380 * up, 1.4)}>
      <Soft blur={10} dim={0.15}>
        <g transform={camT(960, 520, 1.6)}>
          <KIT t={t + 260} />
        </g>
      </Soft>
      <rect x={-200} y={-500} width={2400} height={140} fill="#E9DCC0" />
      <rect x={-200} y={860} width={2400} height={400} fill="#C9B89A" />
      <Bowl x={960} y={860} s={1} fill={1} milk={t > sp - 6 ? 1 : 0} />
      {t < sp ? (
        <g>
          <rect x={1000} y={200} width={90} height={150} rx={10} fill="#F6F2EA" stroke="#1A1018" strokeWidth={6} transform="rotate(-150 1045 275)" />
          <path d={`M 990 340 L 970 ${340 + 380 * clamp(t / Math.max(1, sp))}`} stroke="#F6F2EA" strokeWidth={22} strokeLinecap="round" />
        </g>
      ) : (
        <g>
          {Array.from({ length: 16 }).map((_, i) => {
            const a = -Math.PI / 2 + (rnd(5, i) - 0.5) * 1.2;
            const d = (t - sp) * (40 + rnd(6, i) * 30);
            const x = 960 + Math.cos(a) * d;
            const y = Math.max(-360, 720 + Math.sin(a) * d);
            return <circle key={i} cx={x} cy={y} r={14 + rnd(7, i) * 16} fill="#F6F2EA" stroke="#C9C2B6" strokeWidth={3} />;
          })}
          {t > sp + 9 ? (
            <g>
              {Array.from({ length: 9 }).map((_, i) => (
                <path key={i} d={`M ${760 + i * 50} -360 q 6 ${30 + rnd(8, i) * 40 + (t - sp - 9) * 2} 12 0`} fill="#F6F2EA" stroke="#C9C2B6" strokeWidth={3} />
              ))}
            </g>
          ) : null}
        </g>
      )}
      {len > 0 ? null : null}
    </g>
  );
};

// ---------- S8: Biscuit lying flat on the living-room floor like a rug ----------
export const S8: React.FC<ShotProps> = ({ t, len }) => {
  const p = LIVING.P(0.45, 1, 0.7);
  return (
    <g transform={camT(kf(t, [[0, p.x - 40], [len, p.x]]), p.y - 140, kf(t, [[0, 2.1], [len, 2.25]]))}>
      <LR t={t + 100} />
      <Dog x={p.x} y={p.y} s={0.75} t={t} flat={1} look={0.5} />
    </g>
  );
};

// ---------- S9: close on Biscuit: one eye opens, looks at you, and he doesn't even try ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.3}>
      <g transform={camT(960, 600, 1.8)}>
        <LR t={t + 200} />
      </g>
    </Soft>
    <rect x={-200} y={760} width={2400} height={500} fill="#6A4E44" />
    <g transform={camT(1100, 640, kf(t, [[0, 2.3], [len, 2.45]]))}>
      <Dog x={960} y={760} s={1} t={t} flat={1} look={Math.sin(t / 12)} />
      <text x={1220} y={560 - (t % 40)} fontFamily={FONT.title} fontWeight={800} fontSize={40} fill="#F6EFE3" opacity={0.6}>
        sigh
      </text>
    </g>
  </g>
);

// ---------- S10: outside: a pigeon on the fence flaps like crazy ----------
const PIG = { x: 300, y: YARD.fence - 170 };
export const S10: React.FC<ShotProps> = ({ t, len }) => {
  const flap = 0.5 + 0.5 * Math.sin(t * 1.6);
  const lift = Math.max(0, Math.sin(t / 8)) * (t > 20 ? 14 : 0);
  return (
    <g transform={camT(kf(t, [[0, 320], [len, 310]]), PIG.y - 60, kf(t, [[0, 2.6], [len, 2.8]]))}>
      <PoolYard t={t + 100} />
      <Pigeon x={PIG.x} y={PIG.y} s={1} flap={flap} lift={lift} />
      {Array.from({ length: 3 }).map((_, i) => (
        <path key={i} d={`M ${PIG.x - 80 - i * 20} ${PIG.y - 120 + i * 30} l -40 0`} stroke="#F6EFE3" strokeWidth={6} strokeLinecap="round" opacity={0.6 * flap} />
      ))}
    </g>
  );
};

// ---------- S11: ... and gives up: it sits down on the fence, wings drooping ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const k = easeOut(clamp(t / 10));
  return (
    <g transform={camT(320, PIG.y - 60, kf(t, [[0, 2.9], [len, 3.0]]))}>
      <PoolYard t={t + 140} />
      <g transform={`translate(${PIG.x} ${PIG.y}) scale(1 ${1 - 0.15 * k}) translate(${-PIG.x} ${-PIG.y})`}>
        <Pigeon x={PIG.x} y={PIG.y} s={1} flap={(1 - k) * 0.6} lift={0} />
      </g>
      <text x={PIG.x + 90} y={PIG.y - 140} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#1A1018" opacity={clamp((t - 12) / 6)}>
        nope.
      </text>
    </g>
  );
};

// ---------- S12: on the bedroom floor, you lift the phone above your face. Even that is hard ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const fl = floorAt(0.42, 0.62);
  const st = stand(BEDROOM, 0.36, 0.5);
  const lift = kf(t, [[0, 0], [14, 1]], easeOut);
  const pose = lie(fl.x, fl.y, st.scale, -1, { armR: { a: 30 + 60 * lift, b: -90 * lift }, armL: { a: 26, b: -10 }, expr: 'tired' });
  return (
    <g transform={camT(kf(t, [[0, fl.x], [len, fl.x + 20]]), fl.y - 90, kf(t, [[0, 2.4], [len, 2.6]]))}>
      <BED t={t + 300} />
      <Body look={YOU} pose={pose} t={t} faces={[[0, 'tired'], [20, 'neutral']]} />
      {(() => {
        const j = { x: fl.x - 60 * st.scale, y: fl.y - 40 * st.scale - 110 * st.scale * lift };
        return (
          <g transform={`translate(${j.x} ${j.y}) rotate(180) scale(${0.2 * st.scale})`}>
            <Smartphone x={0} y={0} mode="home" t={t} glow={0.4} />
          </g>
        );
      })()}
    </g>
  );
};

// ---------- S13: the gravity app: 9.8, then 19.6 ----------
export const S13: React.FC<ShotProps> = (p) => {
  const k = rel(p.f, p.t, 'nineteen');
  return phoneG({ from: '9.81', to: '19.6', at: k, Bg: BED, zoom: [1, 1.12] })(p);
};

// ---------- S14: your face, close: it's supposed to say 9.8 ----------
export const S14 = faceCU({ look: YOU, Bg: BED, faces: [[0, 'worried'], [14, 'shock']], yaw: 0.2, zoom: [3.3, 3.6], pose: { squash: 0.04 }, light: { x: 900, y: 500, kind: 'cool', o: 0.5 } });

// ---------- S15: 2G slams down ----------
export const S15 = gCard({ g: '2G', clock: '7:00 AM', Bg: KIT });

// ---------- S16: the kitchen clock, the minute hand sweeping toward eight ----------
export const S16: React.FC<ShotProps> = ({ t, len }) => {
  const mm = 2 + 55 * easeIn(clamp(t / Math.max(1, len)));
  return (
    <g>
      <Soft blur={16} dim={0.35}>
        <g transform={camT(960, 520, 1.6)}>
          <KIT t={t + 400} />
        </g>
      </Soft>
      <g transform={`translate(960 540) scale(${kf(t, [[0, 2.2], [len, 2.5]])}) translate(-960 -540)`}>
        <WallDial x={960} y={540} r={150} hh={7} mm={mm} red={1} />
      </g>
      <text x={960} y={980} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={8} fill="#FF5A4A" opacity={clamp((t - 6) / 6)}>
        NEXT: 8:00
      </text>
    </g>
  );
};

// ---------- S17: the title over the yard, everything sagging a little ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.05]]))}>
      <PoolYard t={t + 300} />
    </g>
    <TitleCard t={t} lines={['WHAT IF GRAVITY', 'DOUBLED EVERY HOUR?']} accent="EVERY HOUR?" size={104} y={190} />
  </g>
);
