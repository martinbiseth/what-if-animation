import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { hud, wordF } from '../common';

const W = words as Word[];
export const c03 = defineEpisode('Year3000C03', { timeline: timeline as Timeline, shots, hud: hud([[0, 'DAY 1', 6400], [wordF(W, 'Every'), 'DAY 3', 48200], [wordF(W, 'four'), 'DAY 4', 48200]]) });
