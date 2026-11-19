import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { hud, wordF } from '../common';

const W = words as Word[];
export const c01 = defineEpisode('Gta24HoursC01', { timeline: timeline as Timeline, shots, hud: hud([[0, '8:00 AM', 0], [wordF(W, 'alarm'), '8:05 AM', 1]]) });
