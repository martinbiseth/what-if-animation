import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const c07 = defineEpisode("Iphone1926C07", { timeline: timeline as Timeline, shots });
