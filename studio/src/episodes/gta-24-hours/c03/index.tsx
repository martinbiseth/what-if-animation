import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { hud, wordF } from '../common';

const W = words as Word[];
export const c03 = defineEpisode('Gta24HoursC03', {
  timeline: timeline as Timeline, shots,
  hud: hud([[0, '9:00 AM', 1], [wordF(W, 'whistle'), '10:05 AM', 2], [wordF(W, 'Eleven'), '11:00 AM', 2], [wordF(W, 'Noon'), '12:00 PM', 2], [wordF(W, 'Twelve'), '12:30 PM', 2]]),
});
