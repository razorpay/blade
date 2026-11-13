import type { CreateFreshEngine } from './FreshStage';

/**
 * The engine (about 54 KB gzipped) is loaded only when a Fresh component mounts: apps that never show one don't download it.
 */
const loadFreshEngine = async (): Promise<CreateFreshEngine> => {
  const { createFreshEngine } = await import('./freshEngine');
  return createFreshEngine;
};

export { loadFreshEngine };
