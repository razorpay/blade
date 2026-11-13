/**
 * His box on the page: his rest footprint (CSS px), which never changes with what he does. The heights are his rest pose's,
 * as RayMount's geometry() works them out from the engine (rayBoxSize); written out here so Ray can lay out his box without
 * loading the engine, which comes with his first render instead (the PR review). A test keeps the two the same.
 */
const RAY_BOX = {
  small: { width: 38, height: 31.51 },
  medium: { width: 48, height: 39.8 },
} as const;

export { RAY_BOX };
