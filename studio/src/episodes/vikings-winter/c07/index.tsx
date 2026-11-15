import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { tempHud, wordF } from '../common';

const W = words as Word[];
const w = (a: string, n = 1) => wordF(W, a, n);
export const c07 = defineEpisode('VikingsWinterC07', { timeline: timeline as Timeline, shots, hud: tempHud([[0, 36.8], [w('made'), 36.9], [w('blink'), 37]], 0, undefined, w('And', 3)) });
