import { defineConfig } from 'vitest/config';
// Copies the knowledgebase on config load so every vitest entry point (yarn test, -u, IDE runners) reads fresh docs.
import './scripts/copyKnowledgebase.mjs';

export default defineConfig({});
