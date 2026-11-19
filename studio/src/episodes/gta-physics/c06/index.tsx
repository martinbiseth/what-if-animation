import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { healthHud, wordF } from '../common';

const W = words as Word[];
const at = (a: string, n = 1) => wordF(W, a, n);
export const c06 = defineEpisode('GtaPhysicsC06', {
  timeline: timeline as Timeline, shots,
  hud: healthHud([[0, -1], [at('Bar'), 1], [at('beanbag', 2), 0.3], [at('flashing'), 0.08], [at('Zero'), 0]]),
});
