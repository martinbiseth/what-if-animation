import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { healthHud, wordF } from '../common';

const W = words as Word[];
const at = (a: string, n = 1) => wordF(W, a, n);
export const c02 = defineEpisode('GtaPhysicsC02', {
  timeline: timeline as Timeline, shots,
  hud: healthHud([[0, -1], [at('Ding'), 1], [at('chunk') + 4, 0.85], [at('fills'), 1], [at('zero'), 0.4], [at('everything'), 0], [at('wake'), 1]]),
});
