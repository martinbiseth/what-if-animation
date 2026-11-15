import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { tempHud, wordF } from '../common';

const W = words as Word[];
const w = (a: string, n = 1) => wordF(W, a, n);
export const c05 = defineEpisode('VikingsWinterC05', { timeline: timeline as Timeline, shots, hud: tempHud([[0, 37], [w('After'), 37], [w('fall'), 36.7], [w('People'), 36.8], [w('light'), 36.6]], 0) });
