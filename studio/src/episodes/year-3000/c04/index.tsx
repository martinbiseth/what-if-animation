import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { hud, wordF } from '../common';

const W = words as Word[];
export const c04 = defineEpisode('Year3000C04', { timeline: timeline as Timeline, shots, hud: hud([[0, 'DAY 4', 48200], [wordF(W, 'fixes') + 30, 'DAY 4', 2300], [wordF(W, 'worst'), 'DAY 6', 300]]) });
