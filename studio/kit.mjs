import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
const [, , comp, out, ...frames] = process.argv;
const serveUrl = await bundle({ entryPoint: path.resolve('src/index.ts') });
const browserExecutable = process.env.REMOTION_BROWSER_EXECUTABLE;
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable });
for (const f of frames) await renderStill({ serveUrl, composition, frame: +f, output: `${out}/${comp}-${f}.png`, overwrite: true, scale: 0.5, browserExecutable });
console.log('ok');
