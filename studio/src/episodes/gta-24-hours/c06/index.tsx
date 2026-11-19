import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { hud, wordF } from '../common';

const W = words as Word[];
export const c06 = defineEpisode('Gta24HoursC06', {
  timeline: timeline as Timeline, shots,
  hud: hud([[0, '9:00 PM', -2], [wordF(W, 'Then'), '10:14 PM', -2], [wordF(W, 'Then', 2), '11:30 PM', -2]]),
});
