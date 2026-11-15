import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { gHud, wordF } from '../common';

export const c03 = defineEpisode("GravityC03", { timeline: timeline as Timeline, shots, hud: gHud([[0, 2, '7:15'], [wordF(words as Word[], 'clicks'), 2, '7:59']]) });
