import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { LOOKS_GTA, billHud, wordF } from '../common';

const W = words as Word[];
// The running total: hidden until the first bill's total, then each buzz adds to it.
export const c01 = defineEpisode("GtaHospitalBillC01", {
  timeline: timeline as Timeline, shots, looks: LOOKS_GTA,
  hud: billHud([[0, -1], [wordF(W, 'Total'), 6411], [wordF(W, 'Eleven'), 17411], [wordF(W, 'Thirty'), 51411], [wordF(W, 'Nine'), 60411]]),
});
