import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { healthHud, wordF } from '../common';

const W = words as Word[];
const at = (a: string, n = 1) => wordF(W, a, n);
export const c03 = defineEpisode('GtaPhysicsC03', {
  timeline: timeline as Timeline, shots,
  hud: healthHud([[0, 1], [at('sliver'), 0.98], [at('hedge'), 0.78], [at('trash'), 0.6], [at('evening'), 0.08], [at('zero'), 0], [at('Everything'), -1], [at('open'), 1]]),
});
