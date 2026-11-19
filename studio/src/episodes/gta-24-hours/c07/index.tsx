import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { hud, wordF } from '../common';

const W = words as Word[];
export const c07 = defineEpisode('Gta24HoursC07', {
  timeline: timeline as Timeline, shots,
  hud: hud([[0, '3:00 AM', -2], [wordF(W, 'Eight'), '8:00 AM', -2]]),
});
