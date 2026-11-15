import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const c02 = defineEpisode("DroneEgyptC02", { timeline: timeline as Timeline, shots });
