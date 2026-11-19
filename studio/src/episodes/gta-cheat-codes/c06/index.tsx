import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const c06 = defineEpisode("GtaCheatCodesC06", { timeline: timeline as Timeline, shots });
