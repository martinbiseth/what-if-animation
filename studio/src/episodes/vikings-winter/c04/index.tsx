import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { tempHud, wordF } from '../common';

const W = words as Word[];
const w = (a: string, n = 1) => wordF(W, a, n);
export const c04 = defineEpisode('VikingsWinterC04', { timeline: timeline as Timeline, shots, hud: tempHud([[0, 37], [w('Watch'), 37], [w('forty'), 36.4], [w('First'), 36.5], [w('again'), 36.9], [w('five'), 37]], 0) });
