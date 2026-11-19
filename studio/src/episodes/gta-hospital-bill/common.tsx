import React from 'react';
import {
  Hero, LOOKS, Look, Pose, ShotProps, Word, basePose, camT, clamp, kf, backOut, idleBlink, faceAt, Expr, talkAt, FONT, LookDef,
  Suburb, Tod, Kitchen, Bedroom, Stairwell, Classroom, Office, Concourse, Schematic, SCH, SchLabel, CountUp, UI, MONEY, fmtMoney, LEG_LEN,
} from '../../engine';
import {
  phoneCU, propCU, bigWord, faceCU, people, at, span, Soft, talkShot, Who, HeldPhone, handAt, SetC, crowd,
} from '../bank-balance/common';
import {
  HospitalFront, hospHip, Shimmer, Hill, Bridge, CarPark, CarParkRoof, DownView, HospitalBay, WhiteRoom, Bill, Line, BillChip, HOSPF,
} from './kit';

// Shared by every chapter of "What if you got the GTA6 hospital bill in real life?": the cast, the sets as clocked
// components, the grey look (you go down), the respawn at the hospital doors, the bill on the phone, the running
// total in the corner, and the fact cards.

export { phoneCU, propCU, bigWord, faceCU, people, at, span, Soft, talkShot, HeldPhone, handAt, crowd };
export type { Who, SetC };

const noHat = (l: Look): Look => ({ ...l, hat: undefined, hatColor: undefined, noPhones: undefined });
export const YOU = LOOKS.you;
export const MO: Look = { ...noHat(LOOKS.mo26), jacket: '#4E7A4A', jacketShade: '#3E6238', accent: '#E9C46A', shoe: '#E8504A' };
export const ELLIE = LOOKS.ellie;
export const MUM: Look = { ...LOOKS.mom26, jacket: '#8A5A8A', jacketShade: '#704870' };
export const SUIT: Look = { ...noHat(LOOKS.suit26), jacket: '#6A707C', jacketShade: '#545A66', accent: '#2A2E38' };
export const NURSE: Look = { ...noHat(LOOKS.lady), jacket: '#4AA8C8', jacketShade: '#3A8AA8', accent: '#E8F4F8', extra: 'bob' };
export const DOC: Look = { ...noHat(LOOKS.doctor), jacket: '#F2F4F6', jacketShade: '#D8DCE0', accent: '#4AA8C8' };
export const MEDIC: Look = { ...noHat(LOOKS.worker), jacket: '#2E5A3A', jacketShade: '#244A2E', accent: '#F2B33D' };
export const MOSDAD: Look = { ...noHat(LOOKS.gent), jacket: '#B8503A', jacketShade: '#9A4030', extra: undefined };
export const RECEP: Look = { ...noHat(LOOKS.lady), jacket: '#8A6AB8', jacketShade: '#6E549A', extra: 'bob' };
export const REPORTER: Look = { ...noHat(LOOKS.lady), jacket: '#E8C04A', jacketShade: '#C8A03A', extra: 'bob' };
export const MOSMUM: Look = { ...noHat(LOOKS.mom26), jacket: '#3A7A8A', jacketShade: '#2E6270' };

// ---------------------------------------------------------------- sets with a clock
export const HospSet = (o: { tod?: Tod; open?: number; amb?: boolean; lights?: number; van?: boolean } = {}): SetC => {
  const S: SetC = ({ t, id }) => <HospitalFront t={t} id={id} tod={o.tod} open={o.open} amb={o.amb ?? true} ambLights={o.lights} van={o.van} />;
  return S;
};
export const StreetSet = (tod: Tod = 'day'): SetC => {
  const S: SetC = ({ t, id }) => <Suburb t={t} id={id} tod={tod} cars />;
  return S;
};
export const HillSet = (spray = 0): SetC => {
  const S: SetC = ({ t, id }) => <Hill t={t} id={id} spray={spray} />;
  return S;
};
export const BridgeSet = (boat = -1): SetC => {
  const S: SetC = ({ t, id }) => <Bridge t={t} id={id} boat={boat} />;
  return S;
};
export const CarParkSet = (tod: Tod = 'day'): SetC => {
  const S: SetC = ({ t, id }) => <CarPark t={t} id={id} tod={tod} />;
  return S;
};
export const RoofSet = (indoor = false): SetC => {
  const S: SetC = ({ t, id }) => <CarParkRoof t={t} id={id} indoor={indoor} />;
  return S;
};
export const KitchenSet = (veil = 0.35): SetC => {
  const S: SetC = ({ t, id }) => <Kitchen t={t} id={id} veil={veil} />;
  return S;
};
export const BedroomSet = (o: { veil?: number; clock?: string; lamp?: number } = {}): SetC => {
  const S: SetC = ({ t, id }) => <Bedroom t={t} id={id} veil={o.veil ?? 0.2} clock={o.clock ?? '09:40'} lamp={o.lamp ?? 0} />;
  return S;
};
export const StairSet: SetC = ({ t, id }) => <Stairwell t={t} id={id} />;
export const BaySet: SetC = ({ t, id }) => <HospitalBay t={t} id={id} />;
export const LabSet = (door = 0): SetC => {
  const S: SetC = ({ t, id }) => <WhiteRoom t={t} id={id} door={door} />;
  return S;
};
export const OfficeSet: SetC = ({ t, id }) => <Office t={t} id={id} />;
export const MallSet: SetC = ({ t, id }) => <Concourse t={t} id={id} />;
export const ClassSet: SetC = ({ t }) => <Classroom t={t} laugh={0} />;
export const HHIP = hospHip(1);

/** A word's start frame (its nth occurrence) in a chapter's words.json: for HUD keys. */
export const wordF = (words: Word[], w: string, nth = 1) => {
  const n = (x: string) => x.toLowerCase().replace(/’/g, "'").replace(/[^\w']/g, '');
  let seen = 0;
  const i = words.findIndex((x) => n(x.w) === n(w) && ++seen === nth);
  return i < 0 ? 0 : Math.round(words[i].s * 30);
};

// ---------------------------------------------------------------- the grey look: you go down
/** "Grey." The picture drains to grey and a flat monitor line runs across, then the doors. */
export const LOOKS_GTA: Record<string, LookDef> = {
  grey: {
    grade: (lv) => `grayscale(${lv}) brightness(${1 - 0.3 * lv}) contrast(${1 + 0.15 * lv})`,
    Overlay: ({ p }) => {
      const x = 1920 * Math.min(1, p * 1.6);
      return (
        <g>
          <rect width={1920} height={1080} fill="#000" opacity={0.18} />
          <path d={`M 0 540 L ${Math.min(x, 820)} 540 ${x > 820 ? `L 860 470 L 900 620 L 940 540 L ${x} 540` : ''}`} stroke="#F6EFE3" strokeWidth={6} fill="none" opacity={0.9} />
        </g>
      );
    },
  },
};

/** The running total as an episode HUD: keys [global frame, value]; value < 0 hides it. Shows "+$X" when it jumps. */
export const billHud = (keys: [number, number][], label?: string): React.FC<{ f: number; total: number }> => {
  const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
    let i = -1;
    for (let k = 0; k < keys.length; k++) if (f >= keys[k][0]) i = k;
    if (i < 0 || keys[i][1] < 0) return null;
    const v = keys[i][1];
    const prev = i > 0 && keys[i - 1][1] >= 0 ? keys[i - 1][1] : v;
    const since = f - keys[i][0];
    const shown = since < 14 && prev < v ? Math.round(prev + (v - prev) * clamp(since / 14)) : v;
    return <BillChip v={shown} prev={prev} since={since} label={label} o={clamp(since / 4 + (i > 0 && keys[i - 1][1] >= 0 ? 1 : 0))} />;
  };
  return Hud;
};

// ---------------------------------------------------------------- the respawn at the hospital doors
/** You blink back into existence outside the emergency doors: a shimmer, the doors slide, you look down at yourself.
 * `appear` frame of the shimmer; `faces` your expressions; `others` extra people (a nurse staring, the suit waiting). */
export const respawn = (o: {
  tod?: Tod; appear?: number; faces?: [number, Expr][]; others?: Who[]; zoom?: [number, number]; cx?: number; x?: number; lights?: number; van?: boolean;
  phone?: boolean; front?: (t: number) => React.ReactNode;
}): React.FC<ShotProps> => {
  const Set = HospSet({ tod: o.tod, open: 0, lights: o.lights, van: o.van });
  const Shot: React.FC<ShotProps> = ({ t, len, f }) => {
    const ap = o.appear ?? 4;
    const x = o.x ?? 1440;
    const vis = t >= ap + 3;
    const look = clamp((t - ap - 6) / 10);
    const me: Pose = {
      ...basePose, x, y: HHIP, yaw: 0, look: 0, headTilt: -look * 14,
      armL: { a: 20 + look * 10, b: -20 }, armR: { a: o.phone ? 40 : 20 + look * 10, b: o.phone ? -110 : -20 },
    };
    return (
      <g transform={camT(o.cx ?? 1240, 580, kf(t, [[0, o.zoom?.[0] ?? 1.55], [Math.max(len, 1), o.zoom?.[1] ?? 1.68]]))}>
        <Set t={t + 300} id="rsp" />
        {o.others ? people(t, o.others, f) : null}
        {vis ? people(t, [{ look: YOU, pose: me, faces: o.faces ?? [[0, 'shock'], [ap + 20, 'oops']] }]) : null}
        {o.phone && vis ? <HeldPhone pose={{ ...me }} t={t} mode="bank" /> : null}
        <Shimmer x={x} y={HHIP - 40} p={(t - ap) / 16} />
        {o.front?.(t)}
      </g>
    );
  };
  return Shot;
};

/** The phone buzzing with the bill: the bank app in red, "-$6,411.00|Hospital bill". */
export const billPhone = (o: { v: number; label?: string; Bg?: SetC; from?: 'left' | 'right'; buzzTo?: number; time?: string; prev?: number }): React.FC<ShotProps> =>
  phoneCU({
    mode: 'bank', Bg: o.Bg ?? HospSet(), from: o.from ?? 'right', time: o.time ?? '10:02',
    text: `-${fmtMoney(o.v)}|${o.label ?? 'City General: amount due'}`,
    textAt: o.prev !== undefined ? [[0, `-${fmtMoney(o.prev)}|${o.label ?? 'City General: amount due'}`], [8, `-${fmtMoney(o.v)}|${o.label ?? 'City General: amount due'}`]] : undefined,
    buzz: (t) => (t < (o.buzzTo ?? 14) ? 1 : 0),
  });

/** The itemised bill, big, over a soft set. Lines land at their frames; the total counts up at `totalAt`. */
export const billCU = (o: { lines: Line[]; total?: number; totalAt?: number; Bg?: SetC; rot?: number; s?: number; stamp?: string; stampAt?: number; title?: string; y?: number }): React.FC<ShotProps> =>
  propCU({
    Bg: o.Bg ?? HospSet(), push: 0.05,
    draw: (t) => (
      <g transform={`translate(0 ${kf(t, [[0, 260], [10, 0]])})`}>
        <Bill x={960} y={o.y ?? 560} s={o.s ?? 1.1} rot={o.rot ?? -2} t={t} lines={o.lines} total={o.total} totalAt={o.totalAt} stamp={o.stamp} stampAt={o.stampAt} title={o.title} />
      </g>
    ),
  });

/** A fact on the schematic, the What If house style: label, a number counting, the source, "THAT'S REAL." */
export const moneyFact = (o: { value: number; label: string; sub?: string; src?: string; prefix?: string; suffix?: string; realAt?: number; dur?: number }): React.FC<ShotProps> => {
  const Fact: React.FC<ShotProps> = ({ t }) => {
    const ra = o.realAt ?? 54;
    return (
      <g>
        <Schematic t={t} id="mf" />
        <SchLabel x={960} y={340} t={t - 2} text={o.label} size={44} color={SCH.dim} />
        <CountUp x={960} y={560} t={t - 6} to={o.value} dur={o.dur ?? 34} size={150} suffix={o.suffix ?? ''} format={(v: number) => `${o.prefix ?? '$'}${Math.round(v).toLocaleString('en-US')}`} />
        {o.sub ? <SchLabel x={960} y={670} t={t - 30} text={o.sub} size={38} /> : null}
        {o.src ? (
          <text x={960} y={1010} textAnchor="middle" fontFamily={FONT.ui} fontSize={28} fill={SCH.dim} opacity={clamp((t - 20) / 8)}>
            {o.src}
          </text>
        ) : null}
        <g opacity={clamp((t - ra) / 6)} transform={`translate(960 830) scale(${backOut(clamp((t - ra) / 9))})`}>
          <rect x={-150} y={-46} width={300} height={70} rx={35} fill={UI.pill} stroke={SCH.live} strokeWidth={3} />
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={34} fill={SCH.live}>
            {"THAT'S REAL."}
          </text>
        </g>
      </g>
    );
  };
  return Fact;
};

/** A chapter opener for this episode: kicker and title over a red-tinted hospital at dusk. */
export const billCard = (o: { kicker: string; title: string; tod?: Tod }): React.FC<ShotProps> => {
  const Set = HospSet({ tod: o.tod ?? 'dusk', lights: 1 });
  const Card: React.FC<ShotProps> = ({ t, len }) => {
    const pop = (d: number) => backOut(clamp((t - d) / 9));
    const z = kf(t, [[0, 1], [Math.max(len, 1), 1.06]]);
    return (
      <g>
        <Soft blur={16} dim={0.62}>
          <g transform={camT(960, 620, z * 1.1)}>
            <Set t={t + 100} id="card" />
          </g>
        </Soft>
        <g transform={`translate(960 430) scale(${pop(1)})`}>
          <text textAnchor="middle" fontFamily={FONT.ui} fontSize={40} letterSpacing={8} fill={MONEY.red}>{o.kicker}</text>
        </g>
        <g transform={`translate(960 560) scale(${pop(3)})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={700} fontSize={o.title.length > 18 ? 100 : 124} fill="#F6EFE3" stroke="#1A1230" strokeWidth={12} paintOrder="stroke">{o.title}</text>
        </g>
      </g>
    );
  };
  return Card;
};

/** You falling or tumbling: a pose with spin, arms flung. */
export const tumble = (x: number, y: number, spin: number, o: Partial<Pose> = {}): Pose => ({
  ...basePose, x, y, spin, expr: 'shock', armL: { a: 150, b: -30 }, armR: { a: 140, b: -40 }, legL: { a: 30, b: 40 }, legR: { a: -20, b: 60 }, ...o,
});

/** Hip height on a flat ground for a scale. */
export const hipOn = (feet: number, scale = 1) => feet - LEG_LEN * scale;

export { HOSPF, Hero, idleBlink, faceAt, talkAt };

/** A word's frame on a shot's own clock: where `word` (nth) falls inside the first segment of `shot`. For timing a
 * line on the bill to the voice. Falls back to `dflt` before the timeline is planned. */
export const cueIn = (tl: { segments: { shot: string; a: number; t0: number }[] }, words: Word[], shot: string, word: string, nth = 1, dflt = 10) => {
  const seg = tl.segments.find((s) => s.shot === shot);
  const w = wordF(words, word, nth);
  if (!seg || !w) return dflt;
  return Math.max(0, w - seg.a + seg.t0);
};
