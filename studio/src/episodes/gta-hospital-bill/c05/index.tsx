import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const c05 = defineEpisode("GtaHospitalBillC05", { timeline: timeline as Timeline, shots });
