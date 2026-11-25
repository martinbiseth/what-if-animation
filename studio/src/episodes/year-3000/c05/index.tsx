import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';
import { hud } from '../common';

export const c05 = defineEpisode('Year3000C05', { timeline: timeline as Timeline, shots, hud: hud([[0, 'DAY 6', 300]]) });
