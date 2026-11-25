import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { hud, wordF } from '../common';

const W = words as Word[];
export const c02 = defineEpisode('Year3000C02', { timeline: timeline as Timeline, shots, hud: hud([[wordF(W, 'seven'), 'DAY 1', 7000]]) });
