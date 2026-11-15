import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { tempHud, wordF } from '../common';

const W = words as Word[];
export const c01 = defineEpisode('VikingsWinterC01', { timeline: timeline as Timeline, shots, hud: tempHud([[0, 37]], wordF(W, 'find')) });
