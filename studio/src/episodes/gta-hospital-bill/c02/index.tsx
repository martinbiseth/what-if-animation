import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { LOOKS_GTA, billHud, wordF } from '../common';

const W = words as Word[];
const w = (x: string, n = 1) => wordF(W, x, n);
export const c02 = defineEpisode("GtaHospitalBillC02", {
  timeline: timeline as Timeline, shots, looks: LOOKS_GTA,
  hud: billHud([[0, -1], [w('By'), 63320]]),
});
