import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { ButtonRayLayer } from '../ButtonRayLayer.web';
import renderWithTheme from '~utils/testing/renderWithTheme.web';

// Ray, as far as the slot cares: mounted while the hover holds him, and his GPU context let go as he unmounts
const mockRayGone = jest.fn();
jest.mock('../../Ray', () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  const { createElement, useEffect } = require('react') as typeof React;
  return {
    Ray: (): React.ReactElement => {
      useEffect(() => () => mockRayGone(), []);
      return createElement('i', { 'data-testid': 'ray' });
    },
  };
});
jest.mock('../../Ray/loadRay', () => ({ loadRay: () => Promise.resolve() }));
// the strip's engine: a stage that plays nothing (what it's mounted with, noted)
const mockMountedWith: unknown[] = [];
jest.mock('../../RazorSenseEngine', () => ({
  FreshStage: class {
    mount(_: unknown, switches: unknown): unknown {
      mockMountedWith.push(switches);
      return {
        player: { restart: jest.fn(), pause: jest.fn(), seek: jest.fn(), shapes: jest.fn() },
      };
    }
    setPaused(): void {
      // (nothing plays)
    }
    destroy(): void {
      // (nothing made)
    }
    hasDrawn(): boolean {
      return false;
    }
    hasEngine(): boolean {
      return true;
    }
    setOnError(): void {
      // (nothing fails)
    }
  },
  loadFreshEngine: () => Promise.resolve(jest.fn()),
  measureScreen: jest.fn(),
  whyCantAnimate: () => null,
}));
// the page's slots: this one's onHold, called by hand
const mockOnHold: { current: ((isHeld: boolean) => void) | null } = { current: null };
jest.mock('../../useLazyLayer/hoverSlots', () => ({
  ...jest.requireActual('../../useLazyLayer/hoverSlots'),
  holdNearPointer: (_: HTMLElement, { onHold }: { onHold: (isHeld: boolean) => void }) => {
    mockOnHold.current = onHold;
    return { update: jest.fn(), focus: jest.fn(), remove: jest.fn() };
  },
}));

const saved = {
  IntersectionObserver: window.IntersectionObserver,
  ResizeObserver: window.ResizeObserver,
};
beforeAll(() => {
  Object.assign(window, {
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
  });
});
afterAll(() => Object.assign(window, saved));

describe('ButtonRayLayer', () => {
  it('lets Ray (and his GPU context) go in the same task as its slot, before the slot holds another button', async () => {
    const { getByRole, queryByTestId } = renderWithTheme(
      <button type="button">
        <ButtonRayLayer isEnabled variant="investigate" size="medium" />
        Investigate
      </button>,
    );
    // (jsdom has no layout: a button that grows as its padding does, so Ray can widen it)
    const button = getByRole('button');
    Object.defineProperty(button, 'offsetWidth', {
      get: () => 100 + (parseFloat(button.style.paddingRight) || 0),
    });
    await waitFor(() => expect(mockOnHold.current).not.toBeNull());
    act(() => mockOnHold.current?.(true));
    await waitFor(() => expect(queryByTestId('ray')).not.toBeNull());
    // (its layers made only over the strip's spot of the card: FreshSwitches.view)
    expect(mockMountedWith).toEqual([{ view: true }]);

    act(() => {
      mockOnHold.current?.(false);
      // (still inside the slot's own call: React hasn't had a turn of its own yet)
      expect(mockRayGone).toHaveBeenCalledTimes(1);
    });
    expect(queryByTestId('ray')).toBeNull();
  });
});
