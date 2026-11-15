import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { tempHud, wordF } from '../common';

const W = words as Word[];
const w = (a: string, n = 1) => wordF(W, a, n);
export const c06 = defineEpisode('VikingsWinterC06', { timeline: timeline as Timeline, shots, hud: tempHud([[0, 37], [w('When'), 36.6], [w('number'), 36.2], [w('six'), 36.0], [w('five'), 35.5], [w('flame'), 35.5], [w('went'), 36.4]], 0) });
