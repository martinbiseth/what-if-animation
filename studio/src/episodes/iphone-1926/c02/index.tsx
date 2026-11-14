import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';
import { batteryHud } from '../common';

export const c02 = defineEpisode('Iphone1926C02', { timeline: timeline as Timeline, shots, hud: batteryHud(100, 96, 90) });
