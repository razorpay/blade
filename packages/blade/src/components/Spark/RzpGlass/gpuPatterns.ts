/**
 * Patterns that indicate a software / CPU renderer (potato tier).
 * These devices cannot run WebGL at any usable framerate.
 */
const POTATO_TIER_PATTERNS: RegExp[] = [
  /swiftshader/,
  /llvmpipe/,
  /softpipe/,
  /microsoft basic render/,
  /virgl/,
];

export { POTATO_TIER_PATTERNS };
