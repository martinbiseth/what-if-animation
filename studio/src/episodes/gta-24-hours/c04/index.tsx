import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { hud, wordF } from '../common';

const W = words as Word[];
export const c04 = defineEpisode('Gta24HoursC04', {
  timeline: timeline as Timeline, shots,
  hud: hud([[0, '1:00 PM', 2], [wordF(W, 'do'), '1:22 PM', 3], [wordF(W, 'Two'), '2:00 PM', 3], [wordF(W, 'Three'), '3:00 PM', 3], [wordF(W, 'flashes'), '3:00 PM', 4], [wordF(W, 'Four'), '4:00 PM', 4]]),
});
