import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { gHud, wordF } from '../common';

export const c01 = defineEpisode("GravityC01", { timeline: timeline as Timeline, shots, hud: gHud([[0, 1, '7:00'], [wordF(words as Word[], 'nineteen'), 2, '7:00']]) });
