import React from 'react';
import {
  Hero, basePose, kf, camT, clamp, backOut, lerp, ShotProps, FONT, MONEY, Schematic, SCH, LEG_LEN, DaySky,
} from '../../../engine';
import words from './words.json';
import timeline from './timeline.json';
import { WhiteRoom, LAB, CarParkRoof, BoxPile } from '../kit';
import {
  YOU, SUIT, billCU, faceCU, talkShot, cueIn, billCard, propCU, span, bigWord, people, LabSet, HospSet, Soft,
} from '../common';

// Chapter 7, respawn scheduled: the company's building, a white room, the bill paid in full and Mum's envelope
// cancelled. Then a door slides open on the car park roof, rebuilt indoors, boxes at the bottom: respawn number
// fifteen, scheduled. Is any of this real? The prices are. The outro: would you sign; part two; the series playlist.

const W = words as { w: string; s: number; e: number; p: string }[];
const TL = timeline as { segments: { shot: string; a: number; t0: number }[] };
const cue = (shot: string, w: string, nth = 1, d = 10) => cueIn(TL, W, shot, w, nth, d);
const LAB0 = LabSet(0);
const LAB1 = LabSet(1);
const LHIP = LAB.feet - LEG_LEN;
const SUIT_LINES: [number, number][] = [span(W, 'Thank', 'test'), span(W, 'We', 'again')];

/** The company tower from the street: glass doors, no name, only the heartbeat logo. */
const Tower: React.FC<{ t: number; night?: boolean }> = ({ t, night = false }) => (
  <g>
    <DaySky id={night ? 'twn' : 'twd'} horizonY={900} tod={night ? 'night' : 'day'} />
    <rect x={360} y={-900} width={1200} height={1800} fill={night ? '#2A3448' : '#5A7A9A'} stroke="#100E16" strokeWidth={6} />
    {Array.from({ length: 30 }).map((_, r) => Array.from({ length: 10 }).map((_, c) => (
      <rect key={`${r}-${c}`} x={400 + c * 116} y={-860 + r * 56} width={90} height={38} fill={night ? ((r * 7 + c * 3) % 5 === 0 ? '#FFE6A0' : '#1A2232') : '#8AB4CC'} opacity={0.9} />
    )))}
    <rect x={720} y={560} width={480} height={340} fill="#1A2232" stroke="#100E16" strokeWidth={6} />
    <rect x={740} y={580} width={210} height={320} fill="#4A6A8A" opacity={0.8} />
    <rect x={970} y={580} width={210} height={320} fill="#4A6A8A" opacity={0.8} />
    <g transform="translate(960 500)">
      <path d="M -120 0 L -45 0 L -22 -40 L 8 50 L 30 -15 L 45 0 L 120 0" stroke="#D82E4A" strokeWidth={12} fill="none" strokeLinejoin="round" strokeLinecap="round" opacity={night ? 0.6 + 0.4 * Math.abs(Math.sin(t / 12)) : 1} />
    </g>
    <rect x={-400} y={900} width={2800} height={400} fill="#4A4850" />
  </g>
);

/** The suit's tablet, held up to camera: a dark screen with lines that land at their frames. */
const Tablet: React.FC<{ t: number; rows: { at: number; label: string; value: string; color?: string }[]; stamp?: string; stampAt?: number }> = ({ t, rows, stamp, stampAt = 999 }) => (
  <g transform="translate(960 560) rotate(-3)">
    <rect x={-560} y={-380} width={1120} height={760} rx={50} fill="#1A1820" stroke="#100E16" strokeWidth={8} />
    <rect x={-520} y={-340} width={1040} height={680} rx={20} fill="#F6F8FA" />
    <path d="M -440 -260 L -400 -260 L -388 -284 L -372 -236 L -360 -270 L -350 -260 L -320 -260" stroke="#D82E4A" strokeWidth={6} fill="none" />
    <text x={-290} y={-248} fontFamily={FONT.ui} fontSize={34} fill="#5A5666">PATIENT: YOU</text>
    {rows.map((r, i) => (
      <g key={i} opacity={clamp((t - r.at) / 5)} transform={`translate(0 ${-140 + i * 110})`}>
        <text x={-440} fontFamily={FONT.ui} fontSize={44} fill="#1D2033">{r.label}</text>
        <text x={440} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={54} fill={r.color ?? '#1D2033'}>{r.value}</text>
        <rect x={-440} y={30} width={880} height={3} fill="#D8DCE0" />
      </g>
    ))}
    {stamp ? (
      <g opacity={clamp((t - stampAt) / 3)} transform={`translate(160 200) rotate(-12) scale(${lerp(1.6, 1, clamp((t - stampAt) / 5))})`}>
        <rect x={-260} y={-70} width={520} height={120} rx={14} fill="none" stroke="#2EA85A" strokeWidth={10} />
        <text y={20} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#2EA85A">{stamp}</text>
      </g>
    ) : null}
  </g>
);

// ---------- S1: chapter card ----------
export const S1 = billCard({ kicker: 'CHAPTER 7', title: 'RESPAWN SCHEDULED', tod: 'dusk' });

// ---------- S2: the building has no name on the door ----------
export const S2: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, kf(t, [[0, 300], [len, 640]]), kf(t, [[0, 0.8], [len, 1.3]]))}>
    <Tower t={t} />
  </g>
);

// ---------- S3: a white room with a single chair ----------
export const S3: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.05], [len, 1.15]]))}>
    <WhiteRoom t={t} id="s3" />
    {people(t, [
      { look: SUIT, pose: { x: 1080, y: LHIP, yaw: -0.4 }, faces: [[0, 'smug']] },
      { look: YOU, pose: { x: lerp(260, 560, clamp(t / 40)), y: LHIP, yaw: 0.5 }, faces: [[0, 'worried']] },
    ])}
  </g>
);

// ---------- S4: his tablet: your bill, zero, paid in full ----------
export const S4 = propCU({
  Bg: LAB0, push: 0.06,
  draw: (t) => <Tablet t={t} rows={[{ at: 4, label: 'Amount due', value: '$0.00', color: '#2EA85A' }, { at: 4, label: 'Was', value: '$2,140,312', color: '#8A8496' }]} stamp="PAID IN FULL" stampAt={cue('S4', 'Paid', 1, 30)} />,
});

// ---------- S5: Mum's envelope: cancelled ----------
export const S5 = billCU({ Bg: LAB0, lines: [{ label: 'To: Mum', v: 2140000, at: -1 }], total: 2140000, totalAt: -1, stamp: 'CANCELLED', stampAt: 6 });

// ---------- S6: "Thank you. Now, the first test." ----------
export const S6 = talkShot({
  Set: LAB0, words: W,
  cast: [
    { look: SUIT, x: 1080, y: LHIP, yaw: -0.5, faces: [[0, 'happy']], talk: SUIT_LINES, gesture: true },
    { look: YOU, x: 700, y: LHIP, yaw: 0.5, faces: [[0, 'worried']] },
  ],
  cam: { from: [890, 520, 1.6], to: [890, 520, 1.72] },
});

// ---------- S7: you ask what kind of test ----------
export const S7 = faceCU({ look: YOU, Bg: LAB0, faces: [[0, 'worried']], yaw: 0.3, zoom: [3.0, 3.2] });
// ---------- S8: he just smiles, the same smile as before ----------
export const S8 = faceCU({ look: SUIT, Bg: LAB0, faces: [[0, 'smug']], yaw: -0.3, zoom: [3.2, 3.6] });

// ---------- S9: behind him, a door slides open ----------
export const S9: React.FC<ShotProps> = ({ t, len }) => {
  const d = clamp((t - 8) / 30);
  return (
    <g transform={camT(lerp(1100, 1380, d), 560, kf(t, [[0, 1.2], [len, 1.45]]))}>
      <WhiteRoom t={t} id="s9" door={d * d * (3 - 2 * d)} />
      {people(t, [{ look: SUIT, pose: { x: 1080, y: LHIP, yaw: -0.4 }, faces: [[0, 'smug']] }])}
    </g>
  );
};

// ---------- S10: the car park roof, rebuilt, indoors ----------
export const S10: React.FC<ShotProps> = ({ t, len }) => (
  <g transform={camT(960, 560, kf(t, [[0, 1.0], [len, 1.12]]))}>
    <CarParkRoof t={t} indoor id="s10" />
    {people(t, [{ look: YOU, pose: { x: 960, y: 830 - LEG_LEN, yaw: 0.1 }, faces: [[0, 'shock']] }])}
  </g>
);

// ---------- S11: a pile of cardboard boxes at the bottom ----------
export const S11: React.FC<ShotProps> = ({ t, len }) => {
  const z = kf(t, [[0, 1], [Math.max(1, len), 1.25]]);
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2C32" />
      <g transform={`translate(960 560) scale(${z}) translate(-960 -560)`}>
        {/* looking down an indoor shaft: the floors stepping away, white walls, the boxes far below */}
        {Array.from({ length: 7 }).map((_, i) => {
          const k = Math.pow(0.72, i);
          return <rect key={i} x={960 - 980 * k} y={560 - 600 * k} width={1960 * k} height={1200 * k} fill={i % 2 ? '#E4E8EC' : '#D4D8DC'} stroke="#B8BEC4" strokeWidth={4} />;
        })}
        <rect x={960 - 980 * 0.14} y={560 - 600 * 0.14} width={1960 * 0.14} height={1200 * 0.14} fill="#9A968E" />
        <BoxPile x={960} y={600} s={0.35} />
        <path d="M -20 -20 L 2000 -20 L 2000 160 L 1700 120 L 220 120 L -20 160 Z" fill="#B8B4AC" stroke="#100E16" strokeWidth={6} />
      </g>
    </g>
  );
};

// ---------- S12: "We need to see it happen. Again and again." ----------
export const S12 = faceCU({ look: SUIT, Bg: LAB1, faces: [[0, 'smug']], yaw: -0.3, zoom: [3.0, 3.2], words: W, talk: SUIT_LINES[1] });

// ---------- S13: respawn number fifteen: scheduled ----------
export const S13 = propCU({
  Bg: LAB1, push: 0.1,
  draw: (t) => (
    <Tablet t={t} rows={[
      { at: 0, label: 'Admissions', value: '14' },
      { at: 0, label: 'Amount due', value: '$0.00', color: '#2EA85A' },
      { at: cue('S13', 'Respawn', 1, 40), label: 'Respawn #15', value: 'SCHEDULED', color: MONEY.red },
    ]} />
  ),
});

// ---------- S14: you look at the boxes ----------
export const S14 = faceCU({ look: YOU, Bg: RoofIn(), faces: [[0, 'worried']], yaw: -0.5, zoom: [3.0, 3.1] });
// ---------- S15: you look at the man ----------
export const S15 = faceCU({ look: SUIT, Bg: LAB1, faces: [[0, 'smug']], yaw: -0.3, zoom: [2.8, 2.9] });
// ---------- S16: for the first time since Saturday, you're scared ----------
export const S16 = faceCU({ look: YOU, Bg: RoofIn(), faces: [[0, 'worried'], [40, 'shock']], yaw: 0.1, zoom: [3.0, 3.8] });

function RoofIn() {
  const S: React.FC<{ t: number; id?: string }> = ({ t, id }) => <CarParkRoof t={t} id={id} indoor />;
  return S;
}

// ---------- S17: is any of this real? ----------
export const S17 = bigWord({ kicker: 'SO', word: 'IS ANY OF THIS REAL?', color: '#F6EFE3', Bg: HospSet({ tod: 'dusk', lights: 1 }), size: 130 });
// ---------- S18: the prices are ----------
export const S18 = bigWord({ kicker: 'THE PRICES ARE', word: 'REAL', color: MONEY.red, Bg: HospSet({ tod: 'dusk', lights: 1 }), size: 200 });

// ---------- S19: the recap: helicopter, trauma fee, spine ----------
export const S19: React.FC<ShotProps> = ({ t }) => {
  const rows = [
    { at: 2, label: 'Helicopter ambulance, median price', v: '$36,400', src: 'GAO-19-292' },
    { at: cue('S19', 'Trauma', 1, 60), label: 'Trauma team activation, up to', v: '$50,659', src: 'KFF Health News' },
    { at: cue('S19', 'spinal', 1, 110), label: 'High spinal cord injury, year one', v: '$1,369,755', src: 'NSCISC 2024' },
  ];
  return (
    <g>
      <Schematic t={t} id="rc" />
      <text x={960} y={200} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill={SCH.dim}>REAL US PRICES</text>
      {rows.map((r, i) => {
        const p = backOut(clamp((t - r.at) / 8));
        return (
          <g key={i} transform={`translate(960 ${360 + i * 200}) scale(${p})`}>
            <rect x={-720} y={-80} width={1440} height={150} rx={20} fill="#0B0816" opacity={0.55} />
            <text x={-680} y={-10} fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3">{r.label}</text>
            <text x={-680} y={44} fontFamily={FONT.ui} fontSize={28} fill={SCH.dim}>{r.src}</text>
            <text x={680} y={20} textAnchor="end" fontFamily={FONT.title} fontWeight={800} fontSize={80} fill="#FFD23A">{r.v}</text>
          </g>
        );
      })}
    </g>
  );
};

// ---------- S20: in real life, there's no respawn ----------
export const S20 = bigWord({ kicker: 'IN REAL LIFE', word: 'NO RESPAWN', color: MONEY.red, Bg: HospSet({ tod: 'dusk', lights: 1 }), size: 190 });

// ---------- S21: would you have signed the contract? ----------
export const S21: React.FC<ShotProps> = ({ t, len }) => {
  const k = clamp(t / 18);
  return (
    <g>
      <rect width={1920} height={1080} fill="#3A3E4A" />
      <rect x={-100} y={420} width={2120} height={800} fill="#5A3E2E" />
      <g transform="translate(860 640) rotate(-4)">
        <rect x={-260} y={-320} width={520} height={640} fill="#FBF8F0" stroke="#100E16" strokeWidth={5} />
        <text x={0} y={-230} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={60} fill="#1D2033">CONTRACT</text>
        {Array.from({ length: 9 }).map((_, i) => <rect key={i} x={-210} y={-170 + i * 40} width={i % 3 === 2 ? 260 : 420} height={10} fill="#8A8478" />)}
        <path d="M -200 250 L 120 250" stroke="#1D2033" strokeWidth={4} />
        <text x={-200} y={290} fontFamily={FONT.ui} fontSize={28} fill="#7A7468">SIGN HERE</text>
      </g>
      <g transform={`translate(${lerp(1500, 1000, k)} ${lerp(400, 560, k) + Math.sin(t / 8) * 10}) rotate(30)`}>
        <rect x={-14} y={-200} width={28} height={260} rx={10} fill="#1D2033" />
        <path d="M -14 60 L 0 100 L 14 60 Z" fill="#C8B070" />
      </g>
      <g transform={`translate(960 160) scale(${backOut(clamp((t - 6) / 9))})`}>
        <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={96} fill="#F6EFE3" stroke="#0B0816" strokeWidth={10} paintOrder="stroke">WOULD YOU SIGN?</text>
      </g>
      <text x={960} y={1030} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#F6EFE3" opacity={clamp((t - cue('S21', 'comments', 1, 40)) / 6)}>tell us in the comments</text>
    </g>
  );
};

// ---------- S22: part two is coming ----------
export const S22: React.FC<ShotProps> = ({ t, len }) => (
  <g>
    <g transform={camT(960, 420, kf(t, [[0, 0.9], [len, 1.0]]))}>
      <Soft blur={6} dim={0.3}>
        <Tower t={t} night />
      </Soft>
    </g>
    <g transform={`translate(960 520) scale(${backOut(clamp((t - 3) / 9))})`}>
      <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={180} fill="#F6EFE3" stroke="#0B0816" strokeWidth={14} paintOrder="stroke">PART 2</text>
    </g>
    <text x={960} y={640} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} fill="#F6EFE3" opacity={clamp((t - 14) / 8)}>what does the company really want?</text>
  </g>
);

// ---------- S23: the In Real Life series: check the playlist ----------
const SERIES = ['THE HOSPITAL BILL', '24 HOURS', 'THE PHYSICS', '5-STAR WANTED LEVEL', 'CHEAT CODES'];
export const S23: React.FC<ShotProps> = ({ t }) => {
  const hot = t >= cue('S23', 'five', 1, 80);
  return (
    <g>
      <Schematic t={t} id="ser" />
      <text x={960} y={190} textAnchor="middle" fontFamily={FONT.ui} fontSize={44} letterSpacing={10} fill={SCH.dim}>THE SERIES</text>
      <text x={960} y={300} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={110} fill="#F6EFE3">WHAT IF... IN REAL LIFE</text>
      {SERIES.map((s, i) => {
        const p = backOut(clamp((t - 6 - i * 4) / 8));
        const on = i === 0 ? !hot : i === 3 && hot;
        const x = 960 + (i - 2) * 350;
        return (
          <g key={s} transform={`translate(${x} 620) scale(${p * (on ? 1.12 : 1)})`}>
            <rect x={-160} y={-120} width={320} height={240} rx={18} fill={on ? MONEY.red : '#1D2033'} stroke={on ? '#FFD23A' : '#3A4058'} strokeWidth={6} />
            <text x={0} y={-30} textAnchor="middle" fontFamily={FONT.ui} fontSize={30} fill="#C8C2D0">{`EP ${i + 1}`}</text>
            {s.split(' ').reduce<string[]>((a, w) => { const l = a[a.length - 1]; if (l && (l + ' ' + w).length <= 12) a[a.length - 1] = l + ' ' + w; else a.push(w); return a; }, []).map((ln, j) => (
              <text key={j} x={0} y={20 + j * 40} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={36} fill="#F6EFE3">{ln}</text>
            ))}
          </g>
        );
      })}
      <g opacity={clamp((t - cue('S23', 'playlist', 1, 60)) / 6)} transform="translate(960 880)">
        <rect x={-260} y={-50} width={520} height={90} rx={45} fill="#F6EFE3" />
        <text y={12} textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={44} fill="#1D2033">▶ THE PLAYLIST</text>
      </g>
    </g>
  );
};
