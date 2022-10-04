/* eslint-disable @typescript-eslint/ban-ts-comment */

// Modified version of @react-aria/live-announcer
// https://github.com/adobe/react-spectrum/blob/main/packages/@react-aria/live-announcer/src/LiveAnnouncer.tsx
// LiveAnnouncer is implemented using vanilla DOM, not React.
// While the spectrum team had their own reasons for using vanillajs,
// For us:
// 1. It's significantly easier to maintain & understand LiveAnnouncer code in vanillajs than React.
//    With React maintaining a singleton instance of LiveAnnouncer is tricky because we need
//    to save the instance of ReactElement to a top level ref, and then use ReactDOM.render() to render it
// 2. Providing imperative APIs like `announce()` is also trikcky which involves using lesser known
//    React hook `useImperativeHandle` to give users imperative access.

import type { Assertiveness } from './types';
import { screenReaderStyles } from '~components/VisuallyHidden/ScreenReaderStyles';

const LIVEREGION_TIMEOUT_DELAY = 1000;
let liveAnnouncer: LiveAnnouncer | null = null;

class LiveAnnouncer {
  node: HTMLElement;
  assertiveLog: HTMLElement;
  politeLog: HTMLElement;

  constructor() {
    this.node = document.createElement('div');
    this.node.dataset.liveAnnouncer = 'true';
    Object.assign(this.node.style, screenReaderStyles);

    this.assertiveLog = this.createLog('assertive');
    this.node.appendChild(this.assertiveLog);

    this.politeLog = this.createLog('polite');
    this.node.appendChild(this.politeLog);

    document.body.prepend(this.node);
  }

  createLog(ariaLive: string): HTMLDivElement {
    const node = document.createElement('div');
    node.setAttribute('role', 'log');
    node.setAttribute('aria-live', ariaLive);
    node.setAttribute('aria-relevant', 'additions');
    return node;
  }

  destroy(): void {
    if (!this.node) {
      return;
    }

    document.body.removeChild(this.node);
    // @ts-expect-error
    this.node = null;
  }

  announce(message: string, assertiveness: Assertiveness = 'assertive'): void {
    if (!this.node) {
      return;
    }

    const node = document.createElement('div');
    node.textContent = message;

    if (assertiveness === 'assertive') {
      this.assertiveLog.appendChild(node);
    } else {
      this.politeLog.appendChild(node);
    }

    if (message !== '') {
      setTimeout(() => {
        node.remove();
      }, LIVEREGION_TIMEOUT_DELAY);
    }
  }

  clear(assertiveness: Assertiveness): void {
    if (!this.node) {
      return;
    }

    if (!assertiveness || assertiveness === 'assertive') {
      this.assertiveLog.innerHTML = '';
    }

    if (!assertiveness || assertiveness === 'polite') {
      this.politeLog.innerHTML = '';
    }
  }
}

/**
 * Announces the message using screen reader technology.
 */
export function announce(message: string, assertiveness: Assertiveness = 'assertive'): void {
  if (!liveAnnouncer) {
    liveAnnouncer = new LiveAnnouncer();
  }

  liveAnnouncer.announce(message, assertiveness);
}

/**
 * Stops all queued announcements.
 */
export function clearAnnouncer(assertiveness: Assertiveness): void {
  if (liveAnnouncer) {
    liveAnnouncer.clear(assertiveness);
  }
}

/**
 * Removes the announcer from the DOM.
 */
export function destroyAnnouncer(): void {
  if (liveAnnouncer) {
    liveAnnouncer.destroy();
    liveAnnouncer = null;
  }
}
