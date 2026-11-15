import { defineEpisode, Timeline } from '../../../engine';
import timeline from './timeline.json';
import * as shots from './shots';

export const c04 = defineEpisode("BankBalanceC04", { timeline: timeline as Timeline, shots });
