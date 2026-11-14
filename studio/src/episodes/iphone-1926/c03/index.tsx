import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';
import { batteryHud } from '../common';

export const c03 = defineEpisode('Iphone1926C03', { timeline: timeline as Timeline, shots, hud: batteryHud(96, 62, 90) });
