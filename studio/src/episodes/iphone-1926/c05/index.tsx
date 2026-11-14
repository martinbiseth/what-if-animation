import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';
import { batteryHud } from '../common';

export const c05 = defineEpisode('Iphone1926C05', { timeline: timeline as Timeline, shots, hud: batteryHud(41, 27, 90) });
