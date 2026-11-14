import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';
import { batteryHud } from '../common';

export const c06 = defineEpisode('Iphone1926C06', { timeline: timeline as Timeline, shots, hud: batteryHud(27, 9, 90) });
