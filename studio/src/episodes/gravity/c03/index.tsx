import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const c03 = defineEpisode("GravityC03", { timeline: timeline as Timeline, shots });
