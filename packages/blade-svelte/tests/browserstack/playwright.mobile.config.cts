import path from 'path';
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

process.env.BROWSERSTACK_MOBILE = '1';

const CHROMATIC_URL = process.env.CHROMATIC_URL ?? '';

if (!CHROMATIC_URL) {
  throw new Error('CHROMATIC_URL must be set');
}

export default defineConfig({
  testDir: './',
  use: {
    baseURL: `${CHROMATIC_URL.replace(/\/$/, '')}/svelte/`,
  },
});
