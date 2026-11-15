import React from 'react';
import { ShotProps, kf, clamp, camT, FONT, backOut, Look, LOOKS } from '../../engine';
import { PriceChart, BTC, OldLaptop, FlatTV } from './kit';
import { propCU, SetC, KitchenSet, BedroomSet, StreetSet } from '../internet-gone/common';

// Shared by every chapter of "What if you went back to 2010 with $100?". The cast, sets and shot builders come from
// the internet episode (same ink cast, same suburb); the 2010 props are in ./kit.

export {
  YOU, MO, ELLIE, MUM, DAD, SUIT, N1, N2, N3, GRAN, KID, StreetSet, KitchenSet, BedroomSet, ShopSet, phoneCU, propCU, faceCU,
  bigWord, talkShot, netCard, listCard, crowd, at, span, Soft, HeldPhone, HIP, handAt,
} from '../internet-gone/common';
export type { SetC } from '../internet-gone/common';
export * from './kit';

/** Mum, sixteen years younger: a brighter cardigan. */
export const MUM10: Look = { ...LOOKS.mom26, jacket: '#C86A8A', jacketShade: '#A85470' };

export const KIT = KitchenSet(0.3);
export const KITN = KitchenSet(0.6);
export const BED = BedroomSet({ clock: '07:12' });
export const BEDN = BedroomSet({ veil: 0.55, clock: '23:48' });
export const DAY = StreetSet('day');
export const MORN = StreetSet('morning');
export const DUSK = StreetSet('dusk');
export const NIGHT = StreetSet('night', { lit: 0.8 });

/** The TV, big, over the soft kitchen: `draw` fills its 640x360 screen on the shot clock. */
export const tvCU = (draw: (t: number, len: number) => React.ReactNode, Bg: SetC = KIT): React.FC<ShotProps> =>
  propCU({ Bg, push: 0.08, draw: (t, len) => <FlatTV x={960} y={900} s={1.75}>{draw(t, len)}</FlatTV> });

/** The 2010 laptop, big, over the soft bedroom. */
export const laptopCU = (draw: (t: number, len: number) => React.ReactNode, Bg: SetC = BEDN): React.FC<ShotProps> =>
  propCU({ Bg, push: 0.07, draw: (t, len) => <OldLaptop x={960} y={900} s={1.7}>{draw(t, len)}</OldLaptop> });

/** The bitcoin price chart drawing from p0 to p1 of the history over the shot, with labelled marks. */
export const chartShot = (o: { p0: number; p1: number; marks?: { year: number; price: number; label: string; at: number; color?: string }[]; title?: string; dur?: number; years?: [number, number]; logMin?: number; logMax?: number }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t, len }) => {
    const p = kf(t, [[0, o.p0], [o.dur ?? Math.max(1, len - 10), o.p1]]);
    const z = kf(t, [[0, 1], [Math.max(1, len), 1.04]]);
    return (
      <g transform={camT(960, 540, z)}>
        <PriceChart t={t} p={p} points={BTC} marks={o.marks} title={o.title ?? 'ONE BITCOIN, IN DOLLARS'} years={o.years} logMin={o.logMin} logMax={o.logMax} />
      </g>
    );
  };
  return Shot;
};

/** A big money figure counting from a to b over the shot, with a kicker above and a sub below. */
export const moneyCard = (o: { kicker: string; from: number; to: number; sub?: string; prefix?: string; color?: string; dur?: number; Bg?: SetC }): React.FC<ShotProps> => {
  const Shot: React.FC<ShotProps> = ({ t }) => {
    const k = clamp((t - 6) / (o.dur ?? 30));
    const e = 1 - Math.pow(1 - k, 3);
    const v = Math.round(o.from + (o.to - o.from) * e);
    return (
      <g>
        <rect width={1920} height={1080} fill="#120C18" />
        <text x={960} y={380} textAnchor="middle" fontFamily={FONT.ui} fontSize={46} letterSpacing={10} fill="#C8C2D8" opacity={clamp(t / 6)}>{o.kicker}</text>
        <g transform={`translate(960 610) scale(${backOut(clamp(t / 9))})`}>
          <text textAnchor="middle" fontFamily={FONT.title} fontWeight={800} fontSize={210} fill={o.color ?? '#7FE08A'} stroke="#0B0816" strokeWidth={16} paintOrder="stroke">{`${o.prefix ?? '$'}${v.toLocaleString('en-US')}`}</text>
        </g>
        {o.sub ? <text x={960} y={780} textAnchor="middle" fontFamily={FONT.ui} fontSize={40} fill="#C8C2D8" opacity={clamp((t - 14) / 8)}>{o.sub}</text> : null}
      </g>
    );
  };
  return Shot;
};
