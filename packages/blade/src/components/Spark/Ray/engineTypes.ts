/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Types for the generated engine (`./engine`, written by ray-spec/studio/blade/export.mjs) and the host films run against.
 * The engine itself is plain JavaScript from Ray Studio, so these describe its edges only.
 */
import type { FilmHost } from './FilmHost';

/** A message between a film and the component, as the film pages and their host page exchanged them: `{ ray: 'ready' }` ... */
type FilmMessage = { ray: string; [key: string]: any };

/** One Ray Studio film: its page's script as a function, its canvases (bottom to top), its page markup, the helpers it uses. */
type FilmModule = {
  mount: (host: FilmHost) => void;
  canvases: string[];
  ui: string;
  shared: Record<string, SharedFactory>;
};

/** A stateful shared module (wardrobe, nightcap, tour, flip), made once per film. */
type SharedFactory = (host: FilmHost) => Record<string, any>;

export type { FilmMessage, FilmModule, SharedFactory };
