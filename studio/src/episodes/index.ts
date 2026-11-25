// The registry: add each new episode here (one import, one entry).
import { rewind } from './rewind';
import { copyPaste } from './copy-paste';

import { iphone1926Chapters } from './iphone-1926';

import { electricityChapters } from './electricity';

import { gravityChapters } from './gravity';

import { gta24HoursChapters } from './gta-24-hours';

import { neverSleepChapters } from './never-sleep';

export const EPISODES = [rewind, copyPaste, ...iphone1926Chapters, ...electricityChapters, ...gravityChapters, ...gta24HoursChapters, ...neverSleepChapters];
