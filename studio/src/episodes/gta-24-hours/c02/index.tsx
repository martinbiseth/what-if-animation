import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';
import { hud } from '../common';

export const c02 = defineEpisode('Gta24HoursC02', { timeline: timeline as Timeline, shots, hud: hud([[0, '8:10 AM', 1]]) });
