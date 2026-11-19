import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { hud, wordF } from '../common';

const W = words as Word[];
export const c05 = defineEpisode('Gta24HoursC05', {
  timeline: timeline as Timeline, shots,
  hud: hud([[0, '5:00 PM', 4], [wordF(W, 'Run'), '5:01 PM', 5], [wordF(W, 'stars', 2), '5:04 PM', -1], [wordF(W, 'Eight'), '5:09 PM', -2]]),
});
