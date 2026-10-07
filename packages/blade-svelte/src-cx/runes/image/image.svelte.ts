import { imageUrl, type ImageData } from './source';
import { getAdapters } from '../../adapters';

type Module<T> = T | { default: T };

export type ImageSource = ImageData | Promise<Module<ImageData>> | undefined;

export interface ImageOptions {
  /** A URL, SVG markup, or the promise of either (a lazy asset chunk). */
  src: () => ImageSource;
  onError?: (error: unknown) => void;
}

export interface Image {
  /** What the `<img>` shows, once the source has resolved. */
  readonly url: string | undefined;
  readonly status: 'pending' | 'ready' | 'failed';
  /** The element failed to load what it was given. */
  fail(error: unknown): void;
}

/**
 * Resolves an image source, promised or not, into a URL and a status.
 * Call during component initialisation.
 */
export function createImage(options: ImageOptions): Image {
  const adapters = getAdapters();
  let url = $state<string>();
  let status = $state<'pending' | 'ready' | 'failed'>('pending');

  function fail(error: unknown): void {
    status = 'failed';
    options.onError?.(error);
  }

  // Markup goes through a data URI as well: an <img> runs no script, so a
  // source the app did not bundle cannot inject any.
  function show(source: ImageData | undefined): void {
    if (source) {
      url = imageUrl(source);
      status = 'ready';
    } else {
      status = 'failed';
    }
  }

  $effect(() => {
    const current = options.src();
    if (typeof current === 'string' || current === undefined) {
      show(current);
      return undefined;
    }
    let isCurrent = true;
    status = 'pending';
    current
      .then((loaded) => {
        if (isCurrent) {
          show(typeof loaded === 'string' ? loaded : loaded.default);
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          adapters.captureError?.(error);
          fail(error);
        }
      });
    return () => {
      isCurrent = false;
    };
  });

  return {
    get url() {
      return url;
    },
    get status() {
      return status;
    },
    fail,
  };
}
