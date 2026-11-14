import React from 'react';
import { defineEpisode, Timeline, BatteryHud, kf } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

// The HUD falls from 9 to 1 by the moment the message appears (S8), and vanishes when the screen goes black (S10).
const tl = timeline as Timeline;
const start = (id: string) => tl.segments.find((s) => s.shot === id)?.a ?? 0;
const Hud: React.FC<{ f: number; total: number }> = ({ f }) => {
  const msg = start('S8');
  const dark = start('S10');
  if (f >= dark) return null;
  const p = kf(f, [[0, 9], [Math.max(1, msg), 1]]);
  return <BatteryHud p={p} t={f + 200} pulse={f > msg} />;
};

export const c07 = defineEpisode('Iphone1926C07', { timeline: tl, shots, hud: Hud });
