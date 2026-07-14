import path from 'path';
import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env.local') });

const CHROMATIC_URL = process.env.CHROMATIC_URL ?? '';

export default defineConfig({
  testDir: './',
  use: {
    baseURL: `${CHROMATIC_URL.replace(/\/$/, '')}/svelte/`,
  },
});
