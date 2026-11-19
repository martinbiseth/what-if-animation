import React from 'react';
import { Kitchen, KITCHEN, KitchenIsland, stand } from '../../../engine';
import {
  Station, Counter, Cell, CellClock, Bars, HotDog, Star, Big, PopWord, Soft, Glow, PhoneFrame, VideoPost, CallScreen,
  versus, Schematic, SCH,
  YOU_NOHOOD, MO, MOM, COP, CELLMAN, Body, standAt, sitPose, hipAt, GROUND,
  camT, kf, clamp, backOut, easeOut, basePose, FONT, span, rnd, ShotProps, Word,
} from '../common';
import words from './words.json';

// Chapter 6, one phone call: 9 PM the station, no loading screen; fingerprints, photo front and side, the plastic bag
// (napkin from hot dog six); booking takes hours. The holding cell, the man who asks the time, no stars, a slow clock.
// The phone call (not a real rule everywhere). Mo, or Mom. Mom picks up on the first ring: she saw the video. The
// choice: a joke, or the truth. You tell her everything. Her keys, her shoes, your full name. "I'm coming."

const W = words as Word[];
const ST: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Station t={t} id={id} />;
const CL: React.FC<{ t: number; id?: string }> = ({ t, id }) => <Cell t={t} id={id} />;
const ME = YOU_NOHOOD;

// ---------------------------------------------------------------- S1: 9 PM, the police station
export const S1: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 300], [len, 900]]);
  const ph = t * 0.3;
  const walk = (dx: number) => ({ legL: { a: 22 * Math.sin(ph + dx), b: -20 }, legR: { a: -22 * Math.sin(ph + dx), b: -20 } });
  return (
    <g>
      <g transform={camT(900, 600, 1.15)}>
        <Station t={t} />
        <Body look={ME} pose={standAt(x, 1, GROUND, { yaw: 0.6, armL: { a: -20, b: 20 }, armR: { a: -20, b: 20 }, ...walk(0) })} t={t} faces={[[0, 'worried']]} shadow={1} />
        <Body look={COP} pose={standAt(x - 220, 1.05, GROUND, { yaw: 0.6, armR: { a: 60, b: -20 }, ...walk(1) })} t={t} faces={[[0, 'neutral']]} seed={12} shadow={1} />
        <Counter />
      </g>
      <text x={80} y={110} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={clamp(t / 6)}>9:00 PM</text>
    </g>
  );
};

// ---------------------------------------------------------------- S2: no loading screen, no skip button
export const S2: React.FC<ShotProps> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#0C0A16" />
    <g opacity={clamp(t / 5)}>
      <text x={960} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#F6EFE3">LOADING...</text>
      <rect x={560} y={430} width={800} height={50} rx={25} fill="none" stroke="#F6EFE3" strokeWidth={5} />
      <rect x={570} y={440} width={20} height={30} rx={15} fill="#F6EFE3" />
    </g>
    <g opacity={clamp((t - 24) / 5)}>
      <rect x={760} y={620} width={400} height={110} rx={55} fill="#2A2638" stroke="#6A6672" strokeWidth={5} />
      <text x={960} y={695} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#6A6672">SKIP ▶</text>
      <path d="M 740 600 L 1180 750" stroke="#FF3A2E" strokeWidth={14} strokeLinecap="round" opacity={clamp((t - 34) / 4)} />
    </g>
  </g>
);

// ---------------------------------------------------------------- S3: fingerprints, one finger at a time
export const S3: React.FC<ShotProps> = ({ t, len }) => {
  const n = Math.min(5, Math.floor(t / 12) + 1);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.06]]))}>
      <rect width={1920} height={1080} fill="#6A5E52" />
      <rect x={360} y={260} width={1200} height={560} rx={10} fill="#F2EEE6" stroke="#14121C" strokeWidth={6} />
      <text x={400} y={320} fontFamily={FONT.ui} fontSize={34} fill="#2A2E36">FINGERPRINT RECORD</text>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i} transform={`translate(${480 + i * 240} 560)`}>
          <rect x={-100} y={-140} width={200} height={260} fill="none" stroke="#2A2E36" strokeWidth={4} />
          {i < n
            ? Array.from({ length: 7 }).map((_, k) => <ellipse key={k} cx={0} cy={0} rx={20 + k * 11} ry={28 + k * 13} fill="none" stroke="#2A2E46" strokeWidth={5} opacity={clamp((t - i * 12) / 6) * 0.9} />)
            : null}
        </g>
      ))}
      <g transform={`translate(${480 + (n - 1) * 240} ${560 - 40 + 40 * Math.abs(Math.sin(t / 4))})`}>
        <ellipse cx={0} cy={-200} rx={80} ry={110} fill={ME.skin} stroke="#0B0816" strokeWidth={8} />
        <rect x={-80} y={-420} width={160} height={240} fill={ME.skin} stroke="#0B0816" strokeWidth={8} />
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S4: your photo, front and side
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const side = t > len / 2;
  const fl = (t > 4 && t < 8) || (t > len / 2 + 4 && t < len / 2 + 8);
  return (
    <g>
      <g transform={camT(570, 520, 1.6)}>
        <Station t={t + 60} />
        <Body look={ME} pose={standAt(570, 1, GROUND, { yaw: side ? 1 : 0, armL: { a: 10, b: -10 }, armR: { a: 10, b: -10 } })} t={t} faces={[[0, 'worried'], [Math.round(len / 2), 'tired']]} shadow={1} />
        <g transform={`translate(570 ${hipAt(1) - 40})`}>
          <rect x={-120} y={-30} width={240} height={70} rx={6} fill="#14121C" stroke="#F6EFE3" strokeWidth={4} />
          <text x={0} y={16} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#F6EFE3">2119-2104</text>
        </g>
      </g>
      {fl ? <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.75} /> : null}
    </g>
  );
};

// ---------------------------------------------------------------- S5: the plastic bag (and the napkin from hot dog six)
export const S5: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.08]]))}>
    <rect width={1920} height={1080} fill="#6A5E52" />
    <path d="M 560 220 L 1360 220 L 1400 900 L 520 900 Z" fill="#E6F0F6" opacity={0.6} stroke="#9AB0C8" strokeWidth={8} />
    <rect x={560} y={210} width={800} height={40} fill="#3A8AC8" opacity={0.8} />
    <text x={960} y={330} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#2A2E46">PROPERTY</text>
    <g opacity={clamp(t / 6)}><rect x={640} y={520} width={150} height={290} rx={24} fill="#1A1922" stroke="#4A4858" strokeWidth={6} /></g>
    <g opacity={clamp((t - 8) / 6)}>
      <circle cx={900} cy={720} r={40} fill="none" stroke="#C9B48A" strokeWidth={10} />
      <rect x={930} y={710} width={130} height={22} rx={6} fill="#C9B48A" />
    </g>
    <g opacity={clamp((t - 18) / 6)} transform="translate(1180 620) rotate(8)">
      <rect x={-120} y={-100} width={240} height={200} fill="#FFFFFF" stroke="#14121C" strokeWidth={5} />
      <path d="M -70 -20 q 30 -30 60 0 t 60 0" stroke="#F2D02A" strokeWidth={14} fill="none" />
      <circle cx={50} cy={50} r={18} fill="#E8453A" opacity={0.7} />
    </g>
    <PopWord t={t} at={30} x={1180} y={440} text="HOT DOG #6" size={60} fill="#FFD23A" hold={80} />
  </g>
);

export const S6 = versus({
  game: 'BOOKED: 3 SECONDS', real: 'BOOKED: HOURS', at: 36,
  gameIcon: (t) => <text textAnchor="middle" y={40} fontFamily={FONT.title} fontWeight={800} fontSize={180} fill="#4AD06A">0:03</text>,
  realIcon: (t) => <text textAnchor="middle" y={40} fontFamily={FONT.title} fontWeight={800} fontSize={180} fill="#FF5A4A">{`${Math.min(4, 1 + Math.floor(t / 10))}:${String((t * 7) % 60).padStart(2, '0')}`}</text>,
});

// ---------------------------------------------------------------- S7: the holding cell: a metal bench, a toilet with no seat
export const S7: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(kf(t, [[0, 900], [len, 1100]]), 560, 1.05)}>
      <Cell t={t} />
      <CellClock hh={22} mm={14} />
      <Body look={ME} pose={sitPose(600, 640 - 10, 1, 0.2, { armL: { a: 30, b: -40 }, armR: { a: 30, b: -40 }, tilt: 6 })} t={t} faces={[[0, 'worried']]} />
      <Body look={CELLMAN} pose={sitPose(1050, 630, 1, -0.4, { tilt: -4 })} t={t} faces={[[0, 'tired']]} seed={14} />
      <Bars />
    </g>
  </g>
);

// ---------------------------------------------------------------- S8: the man in the corner: what time is it?
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.2}>
      <g transform={camT(1000, 500, 1.5)}>
        <Cell t={t + 40} />
      </g>
    </Soft>
    <g transform={camT(960, 500, kf(t, [[0, 2.8], [len, 3.0]]))}>
      <Body look={CELLMAN} pose={{ ...basePose, x: 960, y: 700, yaw: -0.4, look: -0.6, headTilt: Math.sin(t / 10) * 4 }} t={t} faces={[[0, 'tired']]} seed={14} />
    </g>
    {[0, 1].map((i) => (
      <g key={i} transform={`translate(${1300 + i * 60} ${300 + i * 140}) scale(${backOut(clamp((t - 10 - i * 30) / 8))})`}>
        <rect x={0} y={-50} width={430} height={80} rx={40} fill="#F6EFE3" stroke="#0B0816" strokeWidth={5} />
        <text x={30} y={4} fontFamily={FONT.ui} fontSize={34} fill="#14121C">what time is it?</text>
      </g>
    ))}
  </g>
);

// ---------------------------------------------------------------- S9: you check for the stars: there are none
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.2}>
      <g transform={camT(700, 500, 1.5)}>
        <Cell t={t + 60} />
      </g>
    </Soft>
    <g transform={camT(960, 520, kf(t, [[0, 2.8], [len, 3.0]]))}>
      <Body look={ME} pose={{ ...basePose, x: 960, y: 700, yaw: 0.2, headTilt: -14, look: 0.4 }} t={t} faces={[[0, 'worried']]} />
    </g>
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i} transform={`translate(${1460 + i * 80} 150)`} opacity={0.4}>
        <polygon points="0,-30 9,-9 30,-9 13,5 19,28 0,14 -19,28 -13,5 -30,-9 -9,-9" fill="none" stroke="#F6EFE3" strokeWidth={3} strokeDasharray="8 6" />
      </g>
    ))}
    <PopWord t={t} at={Math.round(len * 0.5)} x={1620} y={280} text="NO STARS." size={60} fill="#FFFFFF" hold={80} rot={0} />
  </g>
);

// ---------------------------------------------------------------- S10: the clock on the wall, very slow
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 230, kf(t, [[0, 3.6], [len, 4.0]]))}>
    <Cell t={t + 80} />
    <CellClock hh={22} mm={14 + t / 200} />
  </g>
);

// ---------------------------------------------------------------- the wall phone
const WallPhone: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-60} y={-110} width={120} height={220} rx={14} fill="#3A3E46" stroke="#0B0816" strokeWidth={6} />
    {Array.from({ length: 12 }).map((_, i) => <rect key={i} x={-40 + (i % 3) * 30} y={-40 + Math.floor(i / 3) * 30} width={20} height={20} rx={4} fill="#9AA0A8" />)}
  </g>
);

// ---------------------------------------------------------------- S11: the phone call
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const st = standAt(1300, 1, GROUND);
  return (
    <g transform={camT(1320, 560, kf(t, [[0, 1.5], [len, 1.6]]))}>
      <Station t={t + 100} />
      <WallPhone x={1480} y={480} />
      <path d={`M 1480 560 Q 1440 700 ${st.x + 60} ${st.y - 210}`} stroke="#14121C" strokeWidth={6} fill="none" />
      <Body look={ME} pose={{ ...st, yaw: 0.6, armR: { a: 150, b: -150 } }} t={t} faces={[[0, 'worried']]} shadow={1} />
      <Body look={COP} pose={standAt(900, 1.05, GROUND, { yaw: 0.4, armL: { a: 50, b: -110 }, armR: { a: 50, b: -110 } })} t={t} faces={[[0, 'neutral']]} seed={12} shadow={1} />
    </g>
  );
};

// ---------------------------------------------------------------- S12: one phone call? not a real rule everywhere
export const S12: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="c6s12" />
    <g opacity={clamp(t / 6)}>
      <text x={960} y={330} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill={SCH.line}>"ONE PHONE CALL"</text>
    </g>
    <g transform={`translate(960 520) rotate(-8) scale(${backOut(clamp((t - 18) / 9))})`}>
      <rect x={-260} y={-80} width={520} height={150} rx={16} fill="none" stroke="#FF5A4A" strokeWidth={12} />
      <text x={0} y={28} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill="#FF5A4A">NOT A RULE</text>
    </g>
    <g opacity={clamp((t - 50) / 8)}>
      <text x={960} y={770} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill={SCH.dim}>IT DEPENDS WHERE YOU ARE</text>
      <text x={960} y={840} textAnchor="middle" fontFamily={FONT.ui} fontSize={36} fill={SCH.dim}>(CALIFORNIA: AT LEAST THREE CALLS)</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- S13: but tonight, they let you call
export const S13: React.FC<ShotProps> = ({ t, len }) => {
  const st = standAt(1300, 1, GROUND);
  return (
    <g transform={camT(1340, 500, kf(t, [[0, 2.2], [len, 2.35]]))}>
      <Station t={t + 140} />
      <WallPhone x={1480} y={480} />
      <Body look={ME} pose={{ ...st, yaw: 0.7, armR: { a: 110, b: -40 } }} t={t} faces={[[0, 'worried']]} shadow={1} />
    </g>
  );
};

// ---------------------------------------------------------------- S14: you could call Mo; Mo would think it's hilarious
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <rect width={1920} height={1080} fill="#14102A" />
    <g transform={camT(560, 500, 2.4)}>
      <Body look={ME} pose={{ ...basePose, x: 560, y: 700, yaw: 0.4, look: 0.6 }} t={t} faces={[[0, 'worried']]} />
    </g>
    <g transform={`translate(1400 520) scale(${backOut(clamp((t - Math.round(len * 0.4)) / 10))})`}>
      <circle r={300} fill="#F6EFE3" stroke="#0B0816" strokeWidth={8} />
      <circle cx={-170} cy={260} r={30} fill="#F6EFE3" stroke="#0B0816" strokeWidth={6} />
      <g transform="translate(0 70) scale(1.25)">
        <Body look={MO} pose={{ ...basePose, x: 0, y: 160, yaw: -0.2, headTilt: Math.sin(t / 3) * 8, armL: { a: 120, b: -20 }, armR: { a: 40, b: -90 } }} t={t} faces={[[0, 'happy']]} seed={2} />
      </g>
      {[0, 1].map((i) => <text key={i} x={120 + i * 40} y={-120 - ((t * 2 + i * 20) % 40)} fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#E8453A">HA</text>)}
    </g>
  </g>
);

// ---------------------------------------------------------------- S15: or you could call your mom
export const S15: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <Soft blur={16} dim={0.3}>
      <g transform={camT(1300, 500, 1.6)}>
        <Station t={t + 160} />
      </g>
    </Soft>
    <g transform={camT(960, 500, kf(t, [[0, 3.0], [len, 3.3]]))}>
      <Body look={ME} pose={{ ...basePose, x: 960, y: 700, yaw: 0.1, look: 0 }} t={t} faces={[[0, 'worried']]} />
    </g>
  </g>
);

// ---------------------------------------------------------------- S16: Mom picks up on the first ring: she saw the video
const MP = stand(KITCHEN, 0.45, 0.4);
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(MP.x + 40, MP.y, kf(t, [[0, 2.0], [len, 2.15]]))}>
    <Kitchen t={t + 100} veil={0.55} />
    <Glow x={MP.x + 200} y={MP.y} r={400} kind="cool" o={0.5} />
    <Body look={MOM} pose={{ ...basePose, ...MP, yaw: 0.3, armR: { a: 150, b: -150 } }} t={t} faces={[[0, 'worried']]} seed={3} />
    <KitchenIsland />
    <g transform={`translate(${MP.x + 260} ${MP.y + 60}) scale(0.45)`}>
      <PhoneFrame x={0} y={0} rot={-8}><VideoPost t={t} views={210000} /></PhoneFrame>
    </g>
  </g>
);

// ---------------------------------------------------------------- S17: one choice: a joke, or the truth
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const pick = clamp((t - (len - 30)) / 10);
  return (
    <g>
      <rect width={1920} height={1080} fill="#14102A" />
      <text x={960} y={240} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} letterSpacing={10} fill="#F6EFE3" opacity={clamp(t / 6)}>ONE CHOICE LEFT</text>
      {[['"IT WAS A JOKE"', '#6A6672', 520], ['THE TRUTH', '#FFD23A', 1400]].map(([txt, col, x], i) => (
        <g key={i} transform={`translate(${x} 560) scale(${backOut(clamp((t - 10 - i * 40) / 9)) * (i === 1 ? 1 + 0.08 * pick : 1 - 0.1 * pick)})`} opacity={i === 0 ? 1 - 0.6 * pick : 1}>
          <rect x={-380} y={-110} width={760} height={220} rx={110} fill="#22203A" stroke={col as string} strokeWidth={10} />
          <text x={0} y={30} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={84} fill={col as string}>{txt}</text>
        </g>
      ))}
    </g>
  );
};

// ---------------------------------------------------------------- S18: you tell her everything
const ICONS = ['THE FENCE', 'THE TAXI', 'THE CAR', '6 HOT DOGS'];
export const S18: React.FC<ShotProps> = ({ t, len, f }) => {
  const line = span(W, 'everything', 'dogs', 2);
  return (
    <g>
      <Soft blur={16} dim={0.3}>
        <g transform={camT(1300, 500, 1.6)}>
          <Station t={t + 180} />
        </g>
      </Soft>
      <g transform={camT(760, 500, kf(t, [[0, 2.9], [len, 3.1]]))}>
        <Body look={ME} pose={{ ...basePose, x: 760, y: 700, yaw: 0.4, armR: { a: 150, b: -150 } }} t={t} f={f} words={W} talk={[line]} faces={[[0, 'worried']]} />
      </g>
      {ICONS.map((txt, i) => {
        const at = Math.round(len * 0.35) + i * 18;
        return (
          <g key={i} transform={`translate(1460 ${220 + i * 190}) scale(${backOut(clamp((t - at) / 8))})`}>
            <rect x={-260} y={-60} width={520} height={110} rx={55} fill="#F6EFE3" stroke="#0B0816" strokeWidth={6} />
            <text x={0} y={18} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={56} fill="#14121C">{txt}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------------------------------------------------------------- S19: her car keys, her shoes, your full name
export const S19: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, MP.x], [len, MP.x - 300]]);
  return (
    <g transform={camT(MP.x - 100, MP.y, kf(t, [[0, 1.8], [len, 1.95]]))}>
      <Kitchen t={t + 200} veil={0.55} />
      <Body look={MOM} pose={{ ...basePose, ...MP, x, yaw: -0.6, armR: { a: 150, b: -150 }, armL: { a: 40, b: -60 }, legL: { a: 18 * Math.sin(t * 0.4), b: -20 }, legR: { a: -18 * Math.sin(t * 0.4), b: -20 } }} t={t} faces={[[0, 'worried'], [Math.round(len * 0.6), 'shock']]} seed={3} />
      <g transform={`translate(${x - 70} ${MP.y + 20})`}>
        <circle r={16} fill="none" stroke="#C9B48A" strokeWidth={6} />
        <rect x={10} y={-6} width={40} height={12} rx={4} fill="#C9B48A" />
      </g>
      <KitchenIsland />
      <PopWord t={t} at={6} x={MP.x - 200} y={MP.y - 260} text="JINGLE" size={44} fill="#FFD23A" hold={30} />
      <PopWord t={t} at={40} x={MP.x - 100} y={MP.y - 260} text="CLICK CLACK" size={44} fill="#FFFFFF" hold={30} />
      <PopWord t={t} at={Math.round(len * 0.62)} x={MP.x - 160} y={MP.y - 300} text="FIRST. MIDDLE. LAST." size={52} fill="#FF4A3A" hold={90} />
    </g>
  );
};

// ---------------------------------------------------------------- S20: a long silence; "I'm coming."
export const S20: React.FC<ShotProps> = ({ t, len }) => {
  const at = Math.round(len * 0.42);
  return (
    <g>
      <Soft blur={16} dim={0.45}>
        <g transform={camT(1300, 500, 1.6)}>
          <Station t={t + 220} />
        </g>
      </Soft>
      <g transform={camT(960, 500, kf(t, [[0, 3.0], [len, 3.6]]))}>
        <Body look={ME} pose={{ ...basePose, x: 960, y: 700, yaw: 0.3, armR: { a: 150, b: -150 } }} t={t} faces={[[0, 'worried'], [at + 10, 'shock']]} />
      </g>
      <g opacity={clamp((t - at) / 6)}>
        <Big x={960} y={940} size={90} fill="#F6EFE3">"I'M COMING."</Big>
      </g>
    </g>
  );
};

