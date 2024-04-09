/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable no-template-curly-in-string */
import type { Options } from '@wdio/types';
import { config as baseConfig } from './wdio.base.conf.js';

const commonCapabilities = {
  buildName: 'blade browserstack build',
};

const bstackConfig: Options.Testrunner = {
  maxInstances: 5,
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_ACCESS_KEY,

  services: [
    [
      'browserstack',
      {
        buildIdentifier: '#${BUILD_NUMBER}',
        browserstackLocal: true,
      },
    ],
  ],
  capabilities: [
    {
      browserName: 'Chrome',
      'bstack:options': {
        browserVersion: 'latest',
        os: 'OS X',
        osVersion: 'Sonoma',
        ...commonCapabilities,
      },
    },
    {
      browserName: 'Firefox',
      'bstack:options': {
        browserVersion: 'latest',
        os: 'OS X',
        osVersion: 'Sonoma',
        ...commonCapabilities,
      },
    },
    // Skipping safari for now, our storybook is broken in safari desktop :(
    // {
    //   browserName: 'Safari',
    //   'bstack:options': {
    //     browserVersion: 'latest',
    //     os: 'OS X',
    //     osVersion: 'Sonoma',
    //   },
    // },
    {
      browserName: 'Chrome',
      'bstack:options': {
        browserVersion: 'latest',
        os: 'Windows',
        osVersion: '11',
        ...commonCapabilities,
      },
    },
    // Mobile devices
    {
      browserName: 'safari',
      'bstack:options': {
        deviceOrientation: 'portrait',
        deviceName: 'iPhone 15 Pro Max',
        osVersion: '17',
        ...commonCapabilities,
      },
    },
    {
      browserName: 'chrome',
      'bstack:options': {
        deviceOrientation: 'portrait',
        deviceName: 'Samsung Galaxy S23 Ultra',
        osVersion: '13.0',
        ...commonCapabilities,
      },
    },
  ],
};

const config = { ...baseConfig, ...bstackConfig };

// Code to support common capabilities
// config.capabilities.forEach(function (caps) {
//   for (const i in exports.config.commonCapabilities)
//     caps[i] = { ...caps[i], ...exports.config.commonCapabilities[i] };
// });

export { config };
