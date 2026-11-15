import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { gHud, wordF } from '../common';

export const c07 = defineEpisode("GravityC07", { timeline: timeline as Timeline, shots, hud: gHud([[0, 8, '9:00'], [wordF(words as Word[], 'nine', 2), 8, '9:59'], [wordF(words as Word[], 'ten'), 8, '10:00'], [wordF(words as Word[], 'disappears'), 0, '10:00']]) });
