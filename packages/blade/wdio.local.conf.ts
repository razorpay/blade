/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable no-template-curly-in-string */
import type { Options } from '@wdio/types';
import { config as baseConfig } from './wdio.base.conf.js';

const localConfig: Options.Testrunner = {
  maxInstances: 3,
  runner: 'local',
  capabilities: [
    {
      browserName: 'chrome',
      browserVersion: '121',
    },
    {
      browserName: 'firefox',
    },
    // Skipping safari for now, our storybook is broken in safari desktop :(
    // {
    //   // run safaridriver --enable on macOS to enable automation
    //   browserName: 'safari',
    // },
  ],
};

const config = { ...baseConfig, ...localConfig };

export { config };
