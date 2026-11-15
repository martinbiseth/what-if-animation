import { defineEpisode, Timeline, Word } from '../../../engine';
import timeline from './timeline.json';
import words from './words.json';
import * as shots from './shots';
import { gHud, wordF } from '../common';

export const c04 = defineEpisode("GravityC04", { timeline: timeline as Timeline, shots, hud: gHud([[0, 4, '8:00']]) });
