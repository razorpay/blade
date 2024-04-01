import { defineConfig } from '@playwright/test';
import config from './playwright.config';

const devConfig = defineConfig({
  ...config,
  use: {
    ...config.use,
    baseURL: 'http://localhost:9009/iframe.html',
  },
  webServer: {
    command: 'yarn workspace @razorpay/blade start:web',
    ignoreHTTPSErrors: true,
    url: 'http://localhost:9009',
  },
});

export default devConfig;
