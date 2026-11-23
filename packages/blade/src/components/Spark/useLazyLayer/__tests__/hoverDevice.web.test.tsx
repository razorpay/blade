import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { canHover, whenHoverOrKeyboardFocus } from '../hoverSlots';
import { ButtonRazorSenseLayer } from '../../ButtonRazorSense/ButtonRazorSenseLayer.web';
import { ButtonRayLayer } from '../../ButtonRay/ButtonRayLayer.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

// what the layers load first: the engine (both) and Ray (the Ray hover). Never resolved: only whether they were asked for counts
const mockLoadEngine = jest.fn(() => new Promise(() => undefined));
const mockLoadRay = jest.fn(() => new Promise(() => undefined));
jest.mock('../../RazorSenseEngine', () => ({
  FreshStage: jest.fn(),
  loadFreshEngine: () => mockLoadEngine(),
  measureScreen: jest.fn(),
  whyCantAnimate: () => null,
}));
jest.mock('../../Ray/loadRay', () => ({ loadRay: () => mockLoadRay() }));

/** a device that can hover or not (any-hover), which a mouse plugged in can change; no reduced motion */
const device = (canHoverNow: boolean): { plugInMouse: () => void } => {
  let matches = canHoverNow;
  const listeners = new Set<() => void>();
  window.matchMedia = (((query: string) => ({
    get matches() {
      return query.includes('any-hover') ? matches : false;
    },
    media: query,
    addEventListener: (_: string, listener: () => void) => listeners.add(listener),
    removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
  })) as unknown) as typeof window.matchMedia;
  return {
    plugInMouse: () => {
      matches = true;
      listeners.forEach((listener) => listener());
    },
  };
};

/** a button whose focus is from the keyboard (`:focus-visible`) or not (a tap's, a click's) */
const focusOf = (button: HTMLElement, isKeyboard: boolean): void => {
  const matches = button.matches.bind(button);
  button.matches = (selector: string) =>
    selector === ':focus-visible' ? isKeyboard : matches(selector);
  act(() => {
    button.focus();
  });
};

// (the layers wait to be on screen: these observers say they are at once)
const observers = {
  IntersectionObserver: class {
    private callback: (entries: { isIntersecting: boolean }[]) => void;
    constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
      this.callback = callback;
    }
    observe(): void {
      this.callback([{ isIntersecting: true }]);
    }
    disconnect(): void {
      // (nothing to stop)
    }
  },
  ResizeObserver: class {
    observe(): void {
      // (sizes don't change here)
    }
    disconnect(): void {
      // (nothing to stop)
    }
  },
};
const saved = {
  matchMedia: window.matchMedia,
  IntersectionObserver: window.IntersectionObserver,
  ResizeObserver: window.ResizeObserver,
};
beforeEach(() => {
  mockLoadEngine.mockClear();
  mockLoadRay.mockClear();
  Object.assign(window, observers);
});
afterEach(() => {
  Object.assign(window, saved);
});

const layers = {
  razorsense: () => <ButtonRazorSenseLayer isEnabled />,
  'ray-investigate': () => <ButtonRayLayer isEnabled variant="investigate" size="medium" />,
};

describe('Spark hovers on a device that can hover or not', () => {
  it('can hover where it isn’t known (no matchMedia)', () => {
    window.matchMedia = (undefined as unknown) as typeof window.matchMedia;
    expect(canHover()).toBe(true);
  });

  it('waits for a pointer that can hover, or a keyboard focus (not a tap’s), and stops when told', () => {
    const { plugInMouse } = device(false);
    expect(canHover()).toBe(false);
    const button = document.createElement('button');
    document.body.append(button);

    const onTap = jest.fn();
    const stopTap = whenHoverOrKeyboardFocus(button, onTap);
    focusOf(button, false);
    expect(onTap).not.toHaveBeenCalled();
    stopTap();
    act(() => {
      button.blur();
    });

    const onKeyboard = jest.fn();
    whenHoverOrKeyboardFocus(button, onKeyboard);
    focusOf(button, true);
    focusOf(button, true);
    expect(onKeyboard).toHaveBeenCalledTimes(1);

    // already focused from the keyboard when it starts waiting: at once
    const onAlready = jest.fn();
    whenHoverOrKeyboardFocus(button, onAlready);
    expect(onAlready).toHaveBeenCalledTimes(1);
    act(() => {
      button.blur();
    });

    const onMouse = jest.fn();
    const onStopped = jest.fn();
    whenHoverOrKeyboardFocus(button, onMouse);
    whenHoverOrKeyboardFocus(button, onStopped)();
    plugInMouse();
    expect(onMouse).toHaveBeenCalledTimes(1);
    expect(onStopped).not.toHaveBeenCalled();
    button.remove();
  });

  it.each(Object.entries(layers))(
    'loads nothing of the %s hover on a phone (no hover) until its button is focused from the keyboard',
    async (_, Layer) => {
      device(false);
      const { getByRole } = renderWithTheme(
        <button type="button">
          <Layer />
          Ask Ray
        </button>,
      );
      const button = getByRole('button');
      await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
      expect(mockLoadEngine).not.toHaveBeenCalled();
      expect(mockLoadRay).not.toHaveBeenCalled();

      // a tap's focus: still nothing
      focusOf(button, false);
      await act(() => new Promise((resolve) => setTimeout(resolve, 50)));
      expect(mockLoadEngine).not.toHaveBeenCalled();
      act(() => {
        button.blur();
      });

      // a tablet's keyboard: it loads, to play on that focus
      focusOf(button, true);
      await waitFor(() => expect(mockLoadEngine).toHaveBeenCalled());
    },
  );

  it.each(Object.entries(layers))(
    'loads the %s hover as its button comes on screen where the device can hover',
    async (name, Layer) => {
      device(true);
      renderWithTheme(
        <button type="button">
          <Layer />
          Ask Ray
        </button>,
      );
      await waitFor(() => expect(mockLoadEngine).toHaveBeenCalled());
      if (name === 'ray-investigate') expect(mockLoadRay).toHaveBeenCalled();
    },
  );
});
