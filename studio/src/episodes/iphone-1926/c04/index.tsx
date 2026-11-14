import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';
import { batteryHud } from '../common';

export const c04 = defineEpisode('Iphone1926C04', { timeline: timeline as Timeline, shots, hud: batteryHud(62, 41, 90) });
