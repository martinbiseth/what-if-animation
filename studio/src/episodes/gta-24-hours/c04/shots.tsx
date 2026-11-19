import React from 'react';
import { factCard } from '../../../engine';
import {
  ShopStreet, Backyard, TaxiFront, TaxiBack, Fence, Hoodie, Car, Scooter, Big, PopWord, Soft, PhoneFrame, VideoPost, Glow,
  clockCard, versus, phoneShot, bigWord, Schematic, SCH,
  YOU, YOU_NOHOOD, MO, DRIVER, Body, runPose, standAt, sitPose, hipAt, GROUND, shopX,
  camT, kf, clamp, backOut, easeOut, basePose, FONT, shk, span, rnd, ShotProps, Pose, Word, Hero,
} from '../common';
import words from './words.json';

// Chapter 4, the catch: 1 PM the taxi ("Follow that car!" "Which car?"), twenty minutes to a grocery store, $38 on the
// meter, you run. Theft of services; the bakery car (a car is stolen every ~32 s in the US); the driver's dash camera.
// 2 PM 50K views and the hoodie on the fence. 3 PM the red-light camera (~$490 in California). 4 PM the list: real
// life doesn't reset. Then a siren.

const W = words as Word[];
const DAY: React.FC<{ t: number; id?: string }> = ({ t, id }) => <ShopStreet t={t} id={id} />;
const TAXI = '#F2C02A';
const BAK = shopX(1);

// ---------------------------------------------------------------- the taxi from outside
const Taxi: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g>
    <Car x={x} y={y} s={s} color={TAXI} />
    <g transform={`translate(${x} ${y - 230 * s}) scale(${s})`}>
      <rect x={-60} y={-24} width={120} height={36} rx={8} fill="#F6EFE3" stroke="#0B0816" strokeWidth={5} />
      <text x={0} y={4} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={26} fill="#14121C">TAXI</text>
    </g>
  </g>
);

export const S1 = clockCard({ clock: '1:00 PM', kicker: 'RULE TWO, AGAIN', Bg: DAY });

// ---------------------------------------------------------------- S2: you and Mo dive into the back of a taxi
export const S2: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len - 10));
  return (
    <g transform={camT(1000, 700, 1.25)}>
      <ShopStreet t={t + 20} />
      <Taxi x={1150} y={1030} s={1.05} />
      <Body look={MO} pose={runPose(kf(t, [[0, 400], [len, 1000]]), t * 0.7, GROUND, 1)} t={t} faces={[[0, 'happy']]} seed={2} shadow={1} />
      <Body look={YOU_NOHOOD} pose={runPose(kf(t, [[0, 650], [len, 1100]]), t * 0.7 + 1, GROUND, 1)} t={t} faces={[[0, 'happy']]} shadow={1} />
      {k > 2 ? null : null}
    </g>
  );
};

// ---------------------------------------------------------------- S3: "Follow that car!"
export const S3: React.FC<ShotProps> = ({ t, len, f }) => {
  const line = span(W, 'Follow', 'car');
  return (
    <g transform={camT(960, 620, kf(t, [[0, 1.2], [len, 1.3]]))}>
      <TaxiBack t={t} />
      <Body look={MO} pose={sitPose(640, 690, 1.05, 0.2, { armL: { a: 20, b: -40 } })} t={t} faces={[[0, 'happy']]} seed={2} />
      <Body look={YOU_NOHOOD} pose={sitPose(1240, 690, 1.05, -0.1, { armR: { a: 160, b: -10 }, tilt: -6 })} t={t} f={f} words={W} talk={[line]} faces={[[0, 'happy']]} />
      <PopWord t={t} at={4} x={960} y={340} text="FOLLOW THAT CAR!" size={100} fill="#FFD23A" hold={50} />
    </g>
  );
};

// ---------------------------------------------------------------- S4: the driver's eyes in the mirror: "Which car?"
export const S4: React.FC<ShotProps> = ({ t, len }) => {
  const blink = t % 70 < 3;
  const lift = kf(t, [[0, 0], [20, 1]]);
  return (
    <g transform={camT(960, 540, kf(t, [[0, 1], [len, 1.08]]))}>
      <rect width={1920} height={1080} fill="#14121A" />
      <rect x={260} y={300} width={1400} height={420} rx={60} fill="#2A2830" stroke="#0B0816" strokeWidth={20} />
      <rect x={300} y={340} width={1320} height={340} rx={40} fill="#3A4A5A" />
      <g transform="translate(960 520)">
        <rect x={-660} y={-180} width={1320} height={110} fill="#E9B92A" />
        <rect x={-660} y={-70} width={1320} height={250} fill="#26232F" />
        {[-220, 220].map((ex) => (
          <g key={ex} transform={`translate(${ex} 30)`}>
            <path d={`M -90 ${-40 - 20 * lift} Q 0 ${-70 - 20 * lift} 90 ${-40 - 20 * lift}`} stroke="#14121C" strokeWidth={16} fill="none" />
            {blink ? <path d="M -70 0 L 70 0" stroke="#F6EFE3" strokeWidth={10} /> : <ellipse cx={0} cy={0} rx={70} ry={50} fill="#F6EFE3" />}
            {blink ? null : <circle cx={30} cy={6} r={24} fill="#14121C" />}
          </g>
        ))}
      </g>
      <PopWord t={t} at={Math.round(len * 0.35)} x={960} y={900} text="WHICH CAR?" size={100} fill="#FFFFFF" hold={60} rot={0} />
    </g>
  );
};

// ---------------------------------------------------------------- S5: you point at a random blue car; he follows it
export const S5: React.FC<ShotProps> = ({ t }) => (
  <g>
    <TaxiFront t={t} meter={`$ ${(4.5 + t * 0.02).toFixed(2)}`} />
    <g transform={`translate(${1100 - 200 * easeOut(clamp(t / 12))} 980)`}>
      <rect x={0} y={-50} width={700} height={100} rx={50} fill={YOU_NOHOOD.jacket} stroke="#0B0816" strokeWidth={8} />
      <ellipse cx={0} cy={0} rx={70} ry={55} fill={YOU.skin} stroke="#0B0816" strokeWidth={8} />
      <rect x={-130} y={-20} width={100} height={30} rx={15} fill={YOU.skin} stroke="#0B0816" strokeWidth={6} transform="rotate(-25)" />
    </g>
    <PopWord t={t} at={20} x={960} y={300} text="THAT ONE!" size={80} fill="#FFD23A" hold={50} />
  </g>
);

// ---------------------------------------------------------------- S6: twenty minutes... straight to a grocery store
export const S6: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len));
  const mins = Math.round(20 * k);
  return (
    <g>
      <TaxiFront t={t * 3} meter={`$ ${(6 + 32 * k).toFixed(2)}`} store={clamp((k - 0.6) / 0.25)} blue={k < 0.9 ? 1 : 0} />
      <g transform="translate(260 900)">
        <rect x={-30} y={-60} width={360} height={90} rx={45} fill="#14121C" opacity={0.85} />
        <text x={150} y={4} textAnchor="middle" fontFamily={FONT.ui} fontSize={48} fill="#F6EFE3">{`${mins} MIN`}</text>
      </g>
    </g>
  );
};

// ---------------------------------------------------------------- S7: the driver, side on: "the most boring car chase of my life"
export const S7: React.FC<ShotProps> = ({ t, len, f }) => {
  const line = span(W, 'That', 'life');
  return (
    <g>
      <rect width={1920} height={1080} fill="#1A1820" />
      <rect x={-100} y={150} width={2100} height={450} fill="#9AC8E8" />
      <rect x={-100} y={420} width={2100} height={180} fill="#4AA84E" opacity={0.6} />
      <rect x={300} y={160} width={900} height={300} fill="#E8E2D6" />
      <text x={750} y={240} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#4AA84E">GROCERY</text>
      <g transform={camT(960, 520, kf(t, [[0, 2.4], [len, 2.55]]))}>
        <Body look={DRIVER} pose={{ ...basePose, x: 960, y: 700, yaw: -0.7, armR: { a: 50, b: -70 }, armL: { a: 40, b: -70 } }} t={t} f={f} words={W} talk={[line]} faces={[[0, 'tired']]} seed={11} />
      </g>
      <rect x={-100} y={880} width={2100} height={300} fill="#2A2632" />
    </g>
  );
};

// ---------------------------------------------------------------- S8: the meter: $38.00
export const S8: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1340, 720, kf(t, [[0, 2.6], [len, 3.0]]))}>
    <TaxiFront t={t} meter="$ 38.00" blue={0} store={1} />
    {Math.floor(t / 8) % 2 ? <Glow x={1340} y={720} r={220} kind="red" o={0.6} /> : null}
  </g>
);

// ---------------------------------------------------------------- S9: you jump out and run (the driver stays put)
export const S9: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(1000, 660, 1.2)}>
    <ShopStreet t={t + 60} shops={[{ name: 'GROCERY', wall: '#E8E2D6', awning: '#4AA84E' }, { name: 'GROCERY', wall: '#E8E2D6', awning: '#4AA84E' }, { name: 'PARKING', wall: '#6A6A7A', awning: '#3A8AC8' }, { name: 'CAFE', wall: '#5A6A8A', awning: '#F6EFE3' }, { name: 'SHOES', wall: '#8A4A4A', awning: '#3A8AC8' }, { name: 'BOOKS', wall: '#6A5A4A', awning: '#E8453A' }]} />
    <Taxi x={700} y={1030} s={1.05} />
    <Body look={MO} pose={runPose(kf(t, [[0, 900], [len, 1900]], (k) => k), t * 0.8, GROUND, 1)} t={t} faces={[[0, 'happy']]} seed={2} shadow={1} />
    <Body look={YOU_NOHOOD} pose={runPose(kf(t, [[0, 1000], [len, 2100]], (k) => k), t * 0.8 + 1, GROUND, 1)} t={t} faces={[[0, 'happy']]} shadow={1} />
  </g>
);

export const S10 = bigWord({ kicker: 'AND THIS IS WHERE', word: 'REAL LIFE', color: '#FF5A4A', Bg: DAY, size: 220 });

// ---------------------------------------------------------------- S11: theft of services
export const S11: React.FC<ShotProps> = ({ t }) => (
  <g>
    <Schematic t={t} id="c4s11" />
    <g opacity={clamp(t / 6)}>
      <text x={960} y={250} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={8} fill={SCH.dim}>RUNNING OFF WITHOUT PAYING A FARE</text>
    </g>
    <g transform={`translate(960 520) scale(${backOut(clamp((t - 10) / 10))})`}>
      <rect x={-560} y={-90} width={1120} height={150} rx={20} fill="none" stroke={SCH.live} strokeWidth={8} />
      <text x={0} y={22} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={100} fill={SCH.live}>THEFT OF SERVICES</text>
    </g>
    <g opacity={clamp((t - 60) / 8)}>
      <text x={960} y={780} textAnchor="middle" fontFamily={FONT.ui} fontSize={42} fill={SCH.line}>SAME FAMILY AS SHOPLIFTING</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- S12: flashback: the bakery car, this morning
export const S12: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g style={{ filter: 'grayscale(0.85) sepia(0.2)' }}>
      <g transform={camT(BAK - 200, 660, kf(t, [[0, 1.4], [len, 1.55]]))}>
        <ShopStreet t={t} />
        <Car x={BAK} y={1030} s={1.05} color="#3E6E9A" />
        <Body look={YOU_NOHOOD} pose={standAt(BAK - 330, 1, GROUND, { yaw: 0.6, armR: { a: 80, b: -10 } })} t={t} faces={[[0, 'oops']]} shadow={1} />
      </g>
    </g>
    <g transform={`translate(960 640) scale(${backOut(clamp((t - 8) / 10))})`}>
      <ellipse cx={0} cy={0} rx={520} ry={300} fill="none" stroke="#FF3A2E" strokeWidth={14} />
    </g>
    <text x={80} y={110} fontFamily={FONT.ui} fontSize={44} letterSpacing={6} fill="#F6EFE3">THIS MORNING, 8:05 AM</text>
  </g>
);

export const S13 = factCard({ value: 32, suffix: ' s', label: 'HOW OFTEN A CAR IS STOLEN IN THE US', sub: 'about a million cars a year (2023)' });

// ---------------------------------------------------------------- S14: the dash camera saw everything
export const S14: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g style={{ filter: 'saturate(0.5) contrast(1.15)' }}>
      <g transform={camT(1400, 660, 1.05)}>
        <ShopStreet t={t + 60} shops={[{ name: 'GROCERY', wall: '#E8E2D6', awning: '#4AA84E' }, { name: 'GROCERY', wall: '#E8E2D6', awning: '#4AA84E' }, { name: 'PARKING', wall: '#6A6A7A', awning: '#3A8AC8' }, { name: 'CAFE', wall: '#5A6A8A', awning: '#F6EFE3' }, { name: 'SHOES', wall: '#8A4A4A', awning: '#3A8AC8' }, { name: 'BOOKS', wall: '#6A5A4A', awning: '#E8453A' }]} />
        <Body look={MO} pose={runPose(kf(t, [[0, 1300], [len, 1800]], (k) => k), t * 0.8, GROUND, 1)} t={t} faces={[[0, 'happy']]} seed={2} shadow={1} />
        <Body look={YOU_NOHOOD} pose={runPose(kf(t, [[0, 1450], [len, 2000]], (k) => k), t * 0.8 + 1, GROUND, 1)} t={t} faces={[[0, 'happy']]} shadow={1} />
      </g>
    </g>
    {Array.from({ length: 40 }).map((_, i) => <rect key={i} x={0} y={i * 28 + ((t * 2) % 28)} width={1920} height={2} fill="#FFFFFF" opacity={0.05} />)}
    <rect x={0} y={0} width={1920} height={1080} fill="none" stroke="#000" strokeWidth={60} opacity={0.4} />
    <g opacity={Math.floor(t / 15) % 2 ? 1 : 0.4}>
      <circle cx={100} cy={100} r={18} fill="#FF3A2E" />
    </g>
    <text x={135} y={114} fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">DASHCAM</text>
    <text x={1840} y={1020} textAnchor="end" fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">{`13:21:${String(10 + Math.floor(t / 30)).padStart(2, '0')}`}</text>
    <g transform={`translate(1500 360) scale(${backOut(clamp((t - 30) / 8))})`}>
      <rect x={-200} y={-60} width={400} height={100} fill="none" stroke="#FFD23A" strokeWidth={6} />
      <text x={0} y={80} textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill="#FFD23A">FACE: CLEAR</text>
    </g>
  </g>
);

// ---------------------------------------------------------------- S15: 2 PM, 50K views
export const S15 = phoneShot({ Bg: DAY, screen: (t) => <VideoPost t={t} views={Math.min(50000, 5000 + t * 900)} /> });

// ---------------------------------------------------------------- S16: someone recognised the hoodie on the fence
export const S16: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(860, 480, kf(t, [[0, 1.7], [len, 1.9]]))}>
      <Backyard t={t + 200} />
      <Fence x0={720} x1={1000} y0={500} y1={860} c="#B88A5A" />
      <Hoodie x={860} y={470} rot={Math.sin(t / 8) * 4} s={1.1} />
    </g>
    {[
      { at: 6, text: "that's the hoodie on my street 👀", x: 1180, y: 260 },
      { at: 24, text: 'same fence lol', x: 1260, y: 420 },
      { at: 40, text: 'ok who is this', x: 1140, y: 580 },
    ].map((c, i) => (
      <g key={i} transform={`translate(${c.x} ${c.y}) scale(${backOut(clamp((t - c.at) / 8))})`}>
        <rect x={0} y={-50} width={620} height={80} rx={40} fill="#F6EFE3" stroke="#0B0816" strokeWidth={5} />
        <text x={30} y={4} fontFamily={FONT.ui} fontSize={32} fill="#14121C">{c.text}</text>
      </g>
    ))}
  </g>
);

// ---------------------------------------------------------------- S17: 3 PM, the red light, the camera flash
export const S17: React.FC<ShotProps> = ({ t, len }) => {
  const x = kf(t, [[0, 600], [len, 2100]], (k) => k);
  const fl = t > 26 && t < 32;
  return (
    <g>
      <g transform={camT(1400, 760, 1.15)}>
        <ShopStreet t={t + 300} light={{ x: 1500, c: 'red' }} />
        <Scooter x={x} y={1000} s={0.95} spin={t * 20} />
        <Body look={YOU_NOHOOD} pose={standAt(x, 0.95, 960, { yaw: 0.6, tilt: 12, armR: { a: 70, b: -30 } })} t={t} faces={[[0, 'cool'], [28, 'shock']]} shadow={0} />
        <g transform="translate(1560 300)">
          <rect x={-50} y={-30} width={100} height={60} rx={8} fill="#2A2632" stroke="#0B0816" strokeWidth={5} />
          <circle cx={-10} cy={0} r={18} fill="#14121C" stroke="#6A6672" strokeWidth={4} />
        </g>
      </g>
      {fl ? <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.8} /> : null}
      <text x={80} y={110} fontFamily={FONT.title} fontWeight={800} fontSize={64} fill="#FFD23A" stroke="#0B0816" strokeWidth={8} paintOrder="stroke" opacity={clamp(t / 6)}>3:00 PM</text>
    </g>
  );
};

export const S18 = factCard({ value: 490, label: 'A RED-LIGHT TICKET IN CALIFORNIA', sub: '$100 base fine, plus fees', format: (v) => `$${Math.round(v)}` });

// ---------------------------------------------------------------- S19: 4 PM, you add it up
const ITEMS = ['THE FENCE', 'THE BACKYARD', 'THE SCOOTER', 'THE TAXI', 'THE CAR'];
const LABELS = ['TRESPASSING', 'TRESPASSING', 'TRAFFIC VIOLATION', 'THEFT OF SERVICES', 'POLICE WANT A WORD'];
const ListShot: React.FC<{ t: number; labels: number; title: string }> = ({ t, labels, title }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9E2D2" />
    {Array.from({ length: 16 }).map((_, i) => <rect key={i} x={0} y={140 + i * 60} width={1920} height={3} fill="#9AB0C8" opacity={0.5} />)}
    <rect x={300} y={0} width={4} height={1080} fill="#E8453A" opacity={0.6} />
    <text x={360} y={130} fontFamily={FONT.title} fontWeight={800} fontSize={70} fill="#14121C">{title}</text>
    {ITEMS.map((it, i) => (
      <g key={i} opacity={labels ? 1 : clamp((t - i * 12) / 6)}>
        <text x={360} y={270 + i * 150} fontFamily={FONT.title} fontWeight={800} fontSize={72} fill="#2A2E46">{`${i + 1}. ${it}`}</text>
        {labels ? (
          <g transform={`translate(1500 ${250 + i * 150}) rotate(-6) scale(${backOut(clamp((t - i * 10) / 8))})`}>
            <rect x={-300} y={-55} width={600} height={90} rx={10} fill="none" stroke="#E8253A" strokeWidth={8} />
            <text x={0} y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={46} fill="#E8253A">{LABELS[i]}</text>
          </g>
        ) : null}
      </g>
    ))}
  </g>
);
export const S19: React.FC<ShotProps> = ({ t }) => <ListShot t={t} labels={0} title="4:00 PM: THE LIST" />;

export const S20 = versus({ game: 'EACH ONE: NOTHING', real: 'IT KEEPS A LIST', at: 40, gameIcon: (t) => <g transform="scale(1.2)"><circle r={130} fill="none" stroke="#4AD06A" strokeWidth={14} /><path d="M -90 90 L 90 -90" stroke="#4AD06A" strokeWidth={14} /></g>, realIcon: (t) => <g transform="scale(0.5)"><rect x={-180} y={-240} width={360} height={480} rx={20} fill="#E9E2D2" stroke="#FF5A4A" strokeWidth={14} />{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-130} y={-180 + i * 85} width={260 * clamp((t - i * 6) / 6)} height={24} rx={12} fill="#2A2E46" />)}</g> });

export const S21: React.FC<ShotProps> = ({ t }) => <ListShot t={t} labels={1} title="EVERY ONE HAS A NAME" />;

// ---------------------------------------------------------------- S22: and Mo's video is the evidence, in HD
export const S22 = phoneShot({
  Bg: DAY, zoom: [1.35, 1.55], screen: (t) => (
    <g>
      <VideoPost t={t} views={50000 + t * 300} title="MY FRIEND IS LIVING LIKE A GAME 😂" />
      <g transform={`translate(60 -230) scale(${backOut(clamp((t - 10) / 8))})`}>
        <rect x={-50} y={-26} width={100} height={52} rx={10} fill="#FFD23A" stroke="#0B0816" strokeWidth={4} />
        <text x={0} y={14} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={34} fill="#14121C">HD</text>
      </g>
    </g>
  ),
});

// ---------------------------------------------------------------- S23: a siren, getting closer
export const S23: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / Math.max(1, len));
  const ph = Math.floor(t / 5) % 2;
  return (
    <g>
      <g transform={camT(960, 520, kf(t, [[0, 2.2], [len, 2.8]]))}>
        <ShopStreet t={t + 400} mode="dusk" id="s23" />
        <Body look={YOU_NOHOOD} pose={standAt(960, 1, GROUND, { yaw: kf(t, [[0, 0.3], [20, -0.6]]), look: -0.8 })} t={t} faces={[[0, 'neutral'], [16, 'shock']]} shadow={1} />
      </g>
      <Glow x={0} y={540} r={900} kind={ph ? 'red' : 'cool'} o={0.7 * k} />
      <PopWord t={t} at={10} x={400} y={300} text="WEE-OOO" size={90} fill="#FF4A3A" hold={80} rot={-8} />
    </g>
  );
};

