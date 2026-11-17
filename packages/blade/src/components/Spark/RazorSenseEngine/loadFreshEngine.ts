import type { CreateFreshEngine } from './FreshStage';

/**
 * The engine (about 54 KB gzipped) is loaded only when a Fresh component mounts: apps that never show one don't download it.
 * It can be made at once, or a step at a time (`steps`: a stage makes it ahead of its comp while the page is idle).
 */
const loadFreshEngine = async (): Promise<CreateFreshEngine> => {
  const { createFreshEngine, freshEngineSteps } = await import('./freshEngine');
  const create: CreateFreshEngine = (host, exp, switches) => createFreshEngine(host, exp, switches);
  create.steps = freshEngineSteps;
  return create;
};

export { loadFreshEngine };
