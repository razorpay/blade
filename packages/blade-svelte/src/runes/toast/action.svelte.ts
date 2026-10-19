import { getAdapters } from '../../adapters';
import { isPromise } from '../base/promise';
import type { ToastAction } from './toasts.svelte';

export interface ToastActionModel {
  /** The action's promise is in flight: it shows busy and takes no press. Tracked. */
  readonly isBusy: boolean;
  press(): void;
}

/**
 * A toast's action button: a press runs `onClick`, and a returned promise
 * holds the button busy until it settles — a rejection goes to
 * `adapters.reportError`, as a Button's does. Call during component init.
 */
export function createToastAction(action: () => ToastAction | undefined): ToastActionModel {
  const adapters = getAdapters();
  let isBusy = $state(false);
  return {
    get isBusy() {
      return isBusy;
    },
    press() {
      if (isBusy) {
        return;
      }
      const result = action()?.onClick();
      if (!isPromise(result)) {
        return;
      }
      isBusy = true;
      result
        .catch((error: unknown) => {
          adapters.reportError?.(error);
        })
        .finally(() => {
          isBusy = false;
        });
    },
  };
}
