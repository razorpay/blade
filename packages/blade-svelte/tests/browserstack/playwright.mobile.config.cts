import path from 'path';
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

process.env.BROWSERSTACK_MOBILE = '1';

const BROWSERSTACK_USERNAME = process.env.BROWSERSTACK_USERNAME;
const BROWSERSTACK_ACCESS_KEY = process.env.BROWSERSTACK_ACCESS_KEY;
const CHROMATIC_URL = process.env.CHROMATIC_URL ?? '';

if (!BROWSERSTACK_USERNAME || !BROWSERSTACK_ACCESS_KEY) {
  throw new Error('BROWSERSTACK_USERNAME and BROWSERSTACK_ACCESS_KEY must be set');
}

if (!CHROMATIC_URL) {
  throw new Error('CHROMATIC_URL must be set');
}

export default defineConfig({
  testDir: './',
  use: {
    baseURL: `${CHROMATIC_URL.replace(/\/$/, '')}/svelte/`,
  },
});
