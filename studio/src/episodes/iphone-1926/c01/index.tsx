import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';
import { batteryHud } from '../common';

export const c01 = defineEpisode('Iphone1926C01', { timeline: timeline as Timeline, shots, hud: batteryHud(100, 97, 9999) });
