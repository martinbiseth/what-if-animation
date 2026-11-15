import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { tempHud, wordF } from '../common';

const W = words as Word[];
const w = (a: string, n = 1) => wordF(W, a, n);
export const c02 = defineEpisode('VikingsWinterC02', { timeline: timeline as Timeline, shots, hud: tempHud([[0, 37], [w('Drop'), 37], [w('hypothermia'), 35], [w('hands'), 35.6], [w('man'), 37]], 0) });
