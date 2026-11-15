import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { gHud, wordF } from '../common';

export const c05 = defineEpisode("GravityC05", { timeline: timeline as Timeline, shots, hud: gHud([[0, 4, '8:30'], [wordF(words as Word[], "It's"), 4, '8:41']]) });
