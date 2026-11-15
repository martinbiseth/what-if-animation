import React from 'react';
import {
  Hero, Pose, basePose, kf, camT, clamp, easeOut, easeIn, backOut, ShotProps, idleBlink, Glow, FONT, faceAt, talkAt,
  Bedroom, BEDROOM, bedSit, Kitchen, KITCHEN, KitchenIsland, stand, AlarmClock, Rooftop, TitleCard, walkPose, Sparkle, LEG_LEN,
} from '../../../engine';
import { YOU, ELLIE, MOM, faceCU, bigWord, Soft, relW, dayK, ELLIE_K, MOM_K, span } from '../common';
import { Bathroom, BATH, LockPhone, DoorFrame, ageK } from '../sets';
import { StreetModern, STREETM, streetHip } from '../../electricity/sets';
import words from './words.json';

// Chapter 1, the cold open: 7 AM, the morning you wake up a year younger. The pants, the mirror, the knee, Face ID,
// the voice crack, Ellie's cereal, the sneakers, the pencil marks on the kitchen door frame. 15 becomes 14. The
// title over a sun clock running backwards, then the turn. 24 cuts a minute.

const W = words;
const rel = relW(W);
const P0 = '#100E16';
const K14 = dayK(1);
const MORNING: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Bedroom t={t} id={id} veil={0.25} clock="07:00" />;
const KIT: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Kitchen t={t} id={id} veil={0.18} />;
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <StreetModern t={t} id={id} mode="day" />;

// ---------- S1: the alarm clock on the night stand: 7:00, ringing (it shakes) ----------
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const ring = t < rel('Seven', 'You') - 6 ? Math.sin(t * 2.2) * 6 : 0;
  return (
    <g>
      <Soft blur={16} dim={0.25}>
        <g transform={camT(1000, 520, 1.6)}><MORNING t={t} /></g>
      </Soft>
      <g transform={`translate(960 640) scale(${kf(t, [[0, 2.1], [len, 2.3]])}) rotate(${ring}) translate(-960 -640)`}>
        <AlarmClock x={960} y={700} s={1.4} text="7:00" on={Math.floor(t / 8) % 2 ? 1 : 0.6} />
      </g>
      {t < rel('Seven', 'You') - 6 ? (
        <g stroke="#FFD23A" strokeWidth={10} strokeLinecap="round" opacity={Math.floor(t / 4) % 2 ? 1 : 0.4}>
          <path d="M 560 430 l -60 -40 M 540 520 l -80 0 M 1360 430 l 60 -40 M 1380 520 l 80 0" />
        </g>
      ) : null}
    </g>
  );
};

// ---------- S2: wide, the bedroom: you swing out of bed and stand ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const sit = bedSit(0.32);
  const up = easeOut(clamp(t / 18));
  const st = stand(BEDROOM, 0.4, 0.62, 0.62 * K14);
  const me: Pose = {
    ...basePose, x: kf(up, [[0, sit.x], [1, st.x]]), y: kf(up, [[0, sit.y], [1, st.y]]), scale: st.scale, yaw: 0.3,
    legL: { a: kf(up, [[0, 80], [1, 4]]), b: kf(up, [[0, -80], [1, 0]]) }, legR: { a: kf(up, [[0, 76], [1, -4]]), b: kf(up, [[0, -76], [1, 0]]) },
    armL: { a: 160 - 120 * up, b: 0 }, armR: { a: 160 - 120 * up, b: 0 }, expr: 'tired', blink: idleBlink(t, 2),
  };
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 880]]), 540, kf(t, [[0, 1.25], [len, 1.3]]))}>
      <MORNING t={t + 40} />
      <Hero look={YOU} pose={me} />
    </g>
  );
};

// ---------- S3: insert, your legs: the striped pajama pants slide down to your ankles ----------
export const S3: React.FC<ShotProps> = ({ t }) => {
  const drop = easeIn(clamp((t - rel('pajama', 'slide') - 2) / 12));
  const y0 = 120 + drop * 620;
  return (
    <g>
      <Soft blur={16} dim={0.2}><g transform={camT(900, 640, 1.6)}><MORNING t={t + 60} /></g></Soft>
      {/* two legs, dark, from the top of the frame to the floor */}
      <rect x={-400} y={900} width={2800} height={400} fill="#5A3E3A" />
      {[820, 1100].map((x) => <rect key={x} x={x - 45} y={-100} width={90} height={1020} rx={40} fill="#26232F" stroke={P0} strokeWidth={6} />)}
      {[820, 1100].map((x, i) => <ellipse key={x} cx={x + (i ? 40 : -40)} cy={930} rx={90} ry={34} fill="#F6EFE3" stroke={P0} strokeWidth={6} />)}
      {/* the pants: blue stripes, bunching as they fall */}
      <g transform={`translate(0 ${y0})`}>
        <path d={`M 700 -400 L 1220 -400 L 1220 ${180 - drop * 120} L 980 ${180 - drop * 120} L 960 0 L 940 ${180 - drop * 120} L 700 ${180 - drop * 120} Z`} fill="#6A8ACA" stroke={P0} strokeWidth={8} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={i} d={`M ${730 + i * 72} -400 L ${730 + i * 72} ${170 - drop * 120}`} stroke="#F6EFE3" strokeWidth={14} opacity={0.6} />)}
      </g>
      <text x={960} y={140} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={90} fill="#FFD23A" stroke={P0} strokeWidth={12} paintOrder="stroke" opacity={clamp((drop - 0.6) * 4)}>
        ...TOO BIG?
      </text>
    </g>
  );
};

// ---------- S4: the bathroom mirror: your face, the zit on your chin pops away with a sparkle ----------
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const gone = rel('In', 'gone') - 4;
  const me: Pose = { ...basePose, x: BATH.mx, y: BATH.my + 400, scale: 2.1, yaw: 0, expr: t > gone ? 'happy' : 'shock', blink: idleBlink(t, 3), headTilt: Math.sin(t / 12) * 3 };
  const zit = t < gone ? 1 : 0;
  return (
    <g transform={camT(BATH.mx, BATH.my + 40, kf(t, [[0, 1.35], [len, 1.5]]))}>
      <Bathroom t={t} glass={
        <g>
          <Hero look={YOU} pose={me} shadow={0} />
          {zit ? <circle cx={BATH.mx + 6} cy={me.y - 176 * 2.1 + 80} r={16} fill="#E8584A" stroke={P0} strokeWidth={3} /> : null}
          {!zit ? <Sparkle x={BATH.mx + 8} y={me.y - 176 * 2.1 + 80} t={t - gone} s={0.8} /> : null}
        </g>
      } />
    </g>
  );
};

// ---------- S5: insert, your knee: the pink scar from the bike crash fades away ----------
export const S5: React.FC<ShotProps> = ({ t, len }) => {
  const fade = clamp((t - rel('So', 'scar')) / 30);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.1]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#8FB0BC" />
      <rect x={-400} y={-400} width={2800} height={1900} fill="#BFD6D4" opacity={0.6} />
      {/* a bent leg, the shorts rolled up */}
      <path d="M 300 1200 Q 700 620 980 520 Q 1260 620 1620 1200 Z" fill="#26232F" stroke={P0} strokeWidth={10} />
      <path d="M 120 300 L 760 300 L 900 560 Q 620 700 400 640 Z" fill="#6A8ACA" stroke={P0} strokeWidth={10} />
      <path d="M 900 600 q 40 -30 80 0 t 80 0 t 80 0" stroke="#E87A8A" strokeWidth={22} fill="none" strokeLinecap="round" opacity={1 - fade} />
      <path d="M 920 640 l 20 -24 M 980 640 l 20 -24 M 1040 640 l 20 -24" stroke="#E87A8A" strokeWidth={10} strokeLinecap="round" opacity={1 - fade} />
      {fade > 0.7 ? <Sparkle x={1000} y={610} t={(fade - 0.7) * 60} s={1.2} /> : null}
      <text x={1480} y={280} textAnchor="middle" fontFamily={FONT.ui} fontSize={52} letterSpacing={6} fill={P0} opacity={clamp(t / 8)}>LAST SUMMER</text>
      <path d="M 1300 320 L 1080 560" stroke={P0} strokeWidth={6} strokeDasharray="14 12" opacity={clamp(t / 8) * (1 - fade)} />
    </g>
  );
};

// ---------- S6: the phone, held up: Face ID fails, three times ----------
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const f0 = rel('grab', 'doesnt') + 4;
  const fails = [f0, f0 + 26, f0 + 50];
  const n = fails.filter((x) => t >= x).length;
  const last = fails[Math.max(0, n - 1)];
  const fail = n ? clamp((t - last) / 20) || 0.01 : 0;
  return (
    <g>
      <Soft blur={16} dim={0.3}><g transform={camT(960, 500, 1.4)}><MORNING t={t + 80} /></g></Soft>
      <g transform={`translate(960 ${kf(t, [[0, 1300], [12, 560]], easeOut)}) scale(${kf(t, [[0, 0.95], [len, 1.05]])})`}>
        <LockPhone x={0} y={0} t={t} fail={n ? Math.max(0.01, fail) : 0} tries={n} />
      </g>
    </g>
  );
};

// ---------- S7: Enter Passcode ----------
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.3}><g transform={camT(960, 500, 1.4)}><MORNING t={t + 200} /></g></Soft>
    <g transform={`translate(960 560) scale(${kf(t, [[0, 1.05], [len, 1.15]])})`}>
      <LockPhone x={0} y={0} t={t} fail={0} pass={1} />
    </g>
  </g>
);

// ---------- S8: breakfast at the kitchen island: you say good morning, Ellie with her cereal, mum at the counter ----------
const A = stand(KITCHEN, 0.36, 0.42, 0.62 * K14);
const B = stand(KITCHEN, 0.6, 0.42, 0.62 * ELLIE_K);
const M = stand(KITCHEN, 0.78, 0.25, 0.62 * MOM_K);
export const S8: React.FC<ShotProps> = ({ t, len, f }) => {
  const talk = talkAt(W, f, 30, [span(W, 'good', 'morning')]);
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 920]]), 560, kf(t, [[0, 1.45], [len, 1.55]]))}>
      <KIT t={t + 60} />
      <Hero look={MOM} pose={{ ...basePose, ...M, yaw: -0.6, facing: -1, expr: 'happy', blink: idleBlink(t, 5), armL: { a: 30, b: -90 }, armR: { a: 20, b: -60 } }} />
      <Hero look={ELLIE} pose={{ ...basePose, ...B, yaw: -0.5, facing: -1, expr: 'happy', blink: idleBlink(t, 3), armR: { a: 40, b: -100 } }} />
      <Hero look={YOU} pose={{ ...basePose, ...A, yaw: 0.5, expr: 'happy', blink: idleBlink(t, 2), talk, armR: { a: 70 + Math.sin(t / 4) * 10, b: 40 } }} />
      <KitchenIsland />
    </g>
  );
};

// ---------- S9: close, you: the voice cracks (the eyes go wide; a squeaky note shoots up) ----------
export const S9 = faceCU({
  look: YOU, Bg: KIT, faces: [[0, 'shock']], yaw: 0.3, zoom: [3.2, 3.5], talk: [0, 30], words: W,
  pose: { scale: K14 / 0.95 },
  front: (t) => (
    <g opacity={clamp(t / 4)} transform={`translate(${1250} ${560 - easeOut(clamp(t / 20)) * 300})`}>
      <text fontFamily={FONT.title} fontWeight={800} fontSize={180} fill="#FFD23A" stroke={P0} strokeWidth={14} paintOrder="stroke">♪</text>
      <text x={-40} y={160} fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#F6EFE3" stroke={P0} strokeWidth={10} paintOrder="stroke">SQUEAK!</text>
    </g>
  ),
});

// ---------- S10: close, Ellie: she spits out her cereal ----------
export const S10: React.FC<ShotProps> = (p) => {
  const spit = rel('Your', 'spits') + 2;
  const Face = faceCU({ look: ELLIE, Bg: KIT, faces: [[0, 'neutral'], [spit, 'shock']], yaw: -0.3, zoom: [3.0, 3.3], pose: { scale: 1 } });
  const k = clamp((p.t - spit) / 14);
  return (
    <g>
      <Face {...p} />
      {p.t > spit ? Array.from({ length: 14 }).map((_, i) => {
        const a = -0.4 + (i / 14) * 0.9;
        const d = 120 + k * (300 + (i % 4) * 90);
        return <ellipse key={i} cx={900 - Math.cos(a) * d} cy={640 + Math.sin(a) * d + k * k * 160} rx={22} ry={12} fill={i % 3 ? '#F2D27A' : '#F6F2EA'} stroke={P0} strokeWidth={4} opacity={1 - k * 0.3} />;
      }) : null}
    </g>
  );
};

// ---------- S11: the phone: a message from Mo: "Bus in 5" ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const pop = backOut(clamp((t - rel('Mo', 'Bus') + 2) / 8));
  return (
    <g>
      <Soft blur={16} dim={0.3}><g transform={camT(960, 520, 1.5)}><KIT t={t + 140} /></g></Soft>
      <g transform={`translate(960 560) scale(${kf(t, [[0, 1], [len, 1.08]])})`}>
        <rect x={-260} y={-460} width={520} height={920} rx={64} fill="#15141C" stroke={P0} strokeWidth={8} />
        <rect x={-236} y={-436} width={472} height={872} rx={48} fill="#F2F2F6" />
        <rect x={-236} y={-436} width={472} height={120} rx={48} fill="#E2E2EA" />
        <circle cx={-170} cy={-376} r={32} fill="#4E7A4A" />
        <text x={-120} y={-366} fontFamily={FONT.ui} fontSize={36} fill={P0}>Mo</text>
        <g transform={`translate(-200 -200) scale(${clamp(t / 6)})`}>
          <rect x={0} y={-50} width={320} height={84} rx={36} fill="#E2E2EA" />
          <text x={24} y={6} fontFamily={FONT.ui} fontSize={34} fill={P0}>you up??</text>
        </g>
        <g transform={`translate(-200 -60) scale(${pop})`}>
          <rect x={0} y={-50} width={360} height={84} rx={36} fill="#E2E2EA" />
          <text x={24} y={6} fontFamily={FONT.ui} fontSize={34} fill={P0}>BUS IN 5 🚌</text>
        </g>
      </g>
    </g>
  );
};

// ---------- S12: wide, the street: you run out of the front door ----------
export const S12: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 560], [len, 1080]], (v) => v);
  return (
    <g transform={camT(kf(t, [[0, 820], [len, 960]]), 560, 1.15)}>
      <DAY t={t + 30} />
      <Hero look={YOU} pose={walkPose(x, t / 2.2, STREETM.feet, K14, { expr: 'worried', blink: idleBlink(t, 2), tilt: 12, armL: { a: 50 * Math.sin(t / 2.2), b: 70 }, armR: { a: -50 * Math.sin(t / 2.2), b: 70 } })} />
    </g>
  );
};

// ---------- S13: insert, your feet: the sneakers flop, your heel slides out with each step ----------
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const step = (k: number) => Math.sin(t / 4 + k * Math.PI);
  return (
    <g transform={camT(kf(t, [[0, 900], [len, 1020]]), 760, 1)}>
      <rect x={-400} y={-400} width={2800} height={1400} fill="#8AA0B8" />
      <rect x={-400} y={850} width={2800} height={600} fill="#6A6A72" />
      {[0, 1].map((k) => {
        const lift = Math.max(0, step(k)) * 60;
        const x = 760 + k * 360;
        return (
          <g key={k} transform={`translate(${x} ${840 - lift})`}>
            <rect x={-30} y={-600} width={60} height={560 + lift * 0.4} fill="#3B3646" />
            {/* the shoe: too long, the heel gap showing when lifted */}
            <path d="M -110 -40 Q -110 -110 -20 -110 L 60 -110 Q 200 -80 220 -20 L 220 10 L -110 10 Z" fill="#F6EFE3" stroke={P0} strokeWidth={8} />
            <path d="M -110 0 L 220 0" stroke="#C85E1C" strokeWidth={14} />
            <ellipse cx={-30} cy={-60 - lift * 0.5} rx={40} ry={26} fill="#26232F" />
            {lift > 20 ? <path d="M -90 -96 l -30 -20 M -70 -110 l -10 -30" stroke="#FFD23A" strokeWidth={8} strokeLinecap="round" /> : null}
          </g>
        );
      })}
      <text x={960} y={440} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#FFD23A" stroke={P0} strokeWidth={14} paintOrder="stroke" opacity={clamp((t - 20) / 6)}>HALF A SIZE TOO BIG</text>
    </g>
  );
};

// ---------- S14: the door frame: you stand against it, mum lays a book flat on your head and reaches for the pencil ----------
const FX = 720;
const FY = 980;
const FH = 820;
const FRAME_K = 1.7; // the rig's scale against this frame (a 15-year-old's head reaches the 0.78 mark)
export const S14: React.FC<ShotProps> = ({ t, len }) => {
  const me: Pose = { ...basePose, x: FX + 120, y: FY - LEG_LEN * FRAME_K * K14, scale: FRAME_K * K14, yaw: 0.05, expr: 'worried', blink: idleBlink(t, 2), armL: { a: 6, b: 0 }, armR: { a: 6, b: 0 } };
  const mom: Pose = { ...basePose, x: FX + 470, y: FY - LEG_LEN * FRAME_K * MOM_K, scale: FRAME_K * MOM_K, yaw: -0.7, facing: -1, expr: 'neutral', blink: idleBlink(t, 4), armL: { a: 125, b: -40 + Math.sin(t / 6) * 8 }, armR: { a: 20, b: -30 } };
  return (
    <g transform={camT(kf(t, [[0, 960], [len, 920]]), 560, kf(t, [[0, 1], [len, 1.06]]))}>
      <DoorFrame x={FX} y={FY} h={FH} marks={[{ h: 0.42, label: '6' }, { h: 0.55, label: '10' }, { h: 0.7, label: '13' }, { h: 0.74, label: '14' }, { h: 0.78, label: '15' }]} />
      <Hero look={YOU} pose={me} />
      <Hero look={MOM} pose={mom} />
    </g>
  );
};

// ---------- S15: close on the jamb: last night's mark (15) is well above your head; mum draws the new line at 14 ----------
export const S15: React.FC<ShotProps> = ({ t, len }) => {
  const draw = clamp((t - rel("You're", 'mark', 2)) / 12);
  const hiY = FY - FH * 0.78;
  return (
    <g transform={camT(FX + 40, kf(t, [[0, hiY + 40], [len, hiY + 20]]), kf(t, [[0, 3.2], [len, 3.4]]))}>
      <DoorFrame x={FX} y={FY} h={FH} marks={[{ h: 0.7, label: '13' }, { h: 0.74, label: '14' }, { h: 0.78, label: '15', color: '#C8323A' }, { h: 0.74, label: '', color: '#3A6EB0', on: draw }]} />
      {/* the top of your head, just under the 14 */}
      <g transform={`translate(${FX + 120} ${FY - FH * 0.74 + 66})`}>
        <circle r={62} fill="#26232F" stroke={P0} strokeWidth={4} />
      </g>
      <g transform={`translate(${FX + 70 + draw * 20} ${FY - FH * 0.74 - 4})`} opacity={draw > 0 ? 1 : 0}>
        <rect x={0} y={-6} width={110} height={12} rx={4} fill="#F2C43A" stroke={P0} strokeWidth={2} transform="rotate(-20)" />
      </g>
      <text x={FX - 60} y={hiY - 14} textAnchor="end" fontFamily={FONT.ui} fontSize={12} fill="#C8323A" opacity={clamp(t / 6)}>LAST NIGHT</text>
    </g>
  );
};

// ---------- S16: 15 rolls back to 14 ----------
export const S16: React.FC<ShotProps> = ({ t }) => {
  const flip = clamp((t - rel('Yesterday', 'Today') + 2) / 8);
  const pop = backOut(clamp((t - 2) / 9));
  return (
    <g>
      <rect width={1920} height={1080} fill="#0C0A16" />
      <Glow x={960} y={560} r={600} kind="warm" o={0.3} />
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>{flip < 0.5 ? 'YESTERDAY' : 'TODAY'}</text>
      <g transform={`translate(960 680) scale(${pop} ${pop * Math.abs(Math.cos(flip * Math.PI))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={420} fill={flip < 0.5 ? '#F6EFE3' : '#FFD23A'} stroke="#0B0816" strokeWidth={18} paintOrder="stroke">{flip < 0.5 ? '15' : '14'}</text>
      </g>
      <text x={960} y={900} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#F6EFE3" opacity={clamp((flip - 0.5) * 4)}>YEARS OLD</text>
    </g>
  );
};

// ---------- S17: night, the alarm clock: 11:59 rolls to 12:00, the red glow pulses ----------
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const mid = rel('And', 'midnight') + 4;
  return (
    <g>
      <Soft blur={16} dim={0.55}><g transform={camT(1000, 520, 1.6)}><Bedroom t={t + 300} veil={0.75} clock="23:59" lamp={0} /></g></Soft>
      <g transform={`translate(960 640) scale(${kf(t, [[0, 2.2], [len, 2.6]])}) translate(-960 -640)`}>
        <AlarmClock x={960} y={700} s={1.4} text={t < mid ? '11:59' : '12:00'} on={t < mid ? 0.8 : 1} />
      </g>
      {t >= mid ? <rect width={1920} height={1080} fill="#FF3A2A" opacity={0.18 * (1 - clamp((t - mid) / 10))} /> : null}
    </g>
  );
};

// ---------- S18: the title over the dusk roof, the sun clock spinning backwards ----------
export const S18: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 560, kf(t, [[0, 1], [len, 1.05]]))}>
      <Rooftop t={t + 300} clock spin={-t * 9} />
    </g>
    <TitleCard t={t} lines={['WHAT IF YOU AGED', 'BACKWARDS?']} accent="BACKWARDS?" size={118} y={190} />
  </g>
);

// ---------- S19: on the street: you strike a superhero pose, cape-less, grinning; SUPERPOWER? ----------
export const S19: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 960], [len, 940]]), 520, kf(t, [[0, 1.7], [len, 1.85]]))}>
      <DAY t={t + 200} />
      <Hero look={YOU} pose={{ ...basePose, x: 960, y: streetHip(K14), scale: K14, yaw: 0.1, expr: 'smug', blink: idleBlink(t, 3), armL: { a: 95, b: 85 }, armR: { a: 95, b: 85 }, legL: { a: 14, b: 0 }, legR: { a: -14, b: 0 } }} />
    </g>
    <g transform={`translate(960 210) scale(${backOut(clamp((t - rel('At', 'superpower') + 2) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={130} fill="#FFD23A" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">SUPERPOWER?</text>
    </g>
  </g>
);

// ---------- S20: a big clock face, the hand ticking backwards; the count: 14 ----------
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const ang = -Math.floor(t / 6) * 30;
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.12]]))}>
      <rect x={-400} y={-400} width={2800} height={1900} fill="#0C0A16" />
      <Glow x={960} y={540} r={560} kind="red" o={0.35} />
      <circle cx={960} cy={540} r={330} fill="#F6EFE3" stroke={P0} strokeWidth={16} />
      {Array.from({ length: 12 }).map((_, i) => (
        <text key={i} x={960 + Math.sin(i * Math.PI / 6) * 260} y={540 - Math.cos(i * Math.PI / 6) * 260 + 18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={50} fill={P0}>
          {14 - i}
        </text>
      ))}
      <path d={`M 960 540 L ${960 + Math.sin(ang * Math.PI / 180) * 220} ${540 - Math.cos(ang * Math.PI / 180) * 220}`} stroke="#C8323A" strokeWidth={18} strokeLinecap="round" />
      <circle cx={960} cy={540} r={22} fill={P0} />
      <text x={960} y={980} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill="#F6EFE3" opacity={clamp(t / 8)}>COUNTING DOWN</text>
    </g>
  );
};

// ---------- S21: close, you in bed that night, eyes open, the red clock light on your face ----------
export const S21 = faceCU({
  look: YOU, Bg: ({ t, id }) => <Bedroom t={t} id={id} veil={0.8} clock="23:59" lamp={0} />, faces: [[0, 'worried']], yaw: 0.35, zoom: [3.3, 3.8],
  light: { x: 1260, y: 560, kind: 'red', o: 0.55 }, dark: 0.25, pose: { scale: K14 / 0.95 },
});

void ageK; void Glow; void faceAt;
