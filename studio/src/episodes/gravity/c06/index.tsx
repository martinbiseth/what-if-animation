import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { gHud, wordF } from '../common';

export const c06 = defineEpisode("GravityC06", { timeline: timeline as Timeline, shots, hud: gHud([[0, 4, '8:41'], [wordF(words as Word[], 'eight'), 4, '8:52'], [wordF(words as Word[], 'eight', 3), 4, '8:58']]) });
