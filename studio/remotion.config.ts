import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
Config.setEntryPoint('src/index.ts');

// Optional: an installed Chrome instead of the one Remotion downloads (offline machines, CI, sandboxes).
if (process.env.REMOTION_BROWSER_EXECUTABLE) Config.setBrowserExecutable(process.env.REMOTION_BROWSER_EXECUTABLE);
