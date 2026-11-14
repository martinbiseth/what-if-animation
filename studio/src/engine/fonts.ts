import { loadFont } from '@remotion/fonts';
import { staticFile } from 'remotion';
import { STUDIO } from '../studio.config';

// Three faces: a heavy display face for the title card, a mono for on-screen readouts (timers, labels, chips),
// and a handwriting face for chalk and notes. They ship in public/fonts/ (SIL Open Font License), so renders work
// offline and behind proxies; a title face of your own from studio.config.ts loads the same way.

const local = (family: string, file: string, weight: string) => loadFont({ family, url: staticFile(`fonts/${file}`), weight });
local('Bricolage Grotesque', 'BricolageGrotesque-700.woff2', '600 800');
local('Fragment Mono', 'FragmentMono-400.woff2', '400');
local('Kalam', 'Kalam-400.woff2', '400');
local('Kalam', 'Kalam-700.woff2', '700');
if (STUDIO.titleFont) loadFont({ family: STUDIO.titleFont.family, url: staticFile(STUDIO.titleFont.file), weight: STUDIO.titleFont.weight });

export const FONT = {
  title: STUDIO.titleFont ? STUDIO.titleFont.family : 'Bricolage Grotesque',
  ui: 'Fragment Mono',
  hand: 'Kalam',
};
