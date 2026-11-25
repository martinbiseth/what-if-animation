import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const c01 = defineEpisode("MoonGoneC01", { timeline: timeline as Timeline, shots });
