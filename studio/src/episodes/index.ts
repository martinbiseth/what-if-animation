// The registry: add each new episode here (one import, one entry).
import { rewind } from './rewind';
import { copyPaste } from './copy-paste';

import { iphone1926Chapters } from './iphone-1926';

import { internetGoneChapters } from './internet-gone';

import { backTo2010Chapters } from './back-to-2010';

export const EPISODES = [rewind, copyPaste, ...iphone1926Chapters, ...internetGoneChapters, ...backTo2010Chapters];
