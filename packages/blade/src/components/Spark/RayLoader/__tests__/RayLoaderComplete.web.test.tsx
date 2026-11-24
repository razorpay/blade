/* eslint-disable @typescript-eslint/no-explicit-any */
// onComplete is for the page being ready: never while it's still loading, whatever happens to his film or his director's chunk (the
// fresh-eyes review). On a stand-in director, as if he could be drawn.
import React from 'react';
import { act, render, waitFor } from '@testing-library/react';
import { RayLoader } from '../RayLoader';
import { BladeProvider } from '~components/BladeProvider';
import { bladeTheme } from '~tokens/theme';

const mockMounts: any[] = [];
const mockState = { failToStart: false, failImport: false };
jest.mock('../../Ray/canDraw', () => ({ canDraw: () => true }));
jest.mock('../RayLoaderMount', () => ({
  __esModule: true,
  // (its chunk failing to load: `import()` adopts a module that's a thenable, so this one rejects it while failImport is set)
  get then() {
    return mockState.failImport
      ? (_resolve: unknown, reject: (error: Error) => void) => reject(new Error('its chunk failed'))
      : undefined;
  },
  RayLoaderMount: class {
    onDone: () => void;
    onShown: () => void;
    finish = jest.fn();
    update = jest.fn();
    dispose = jest.fn();

    constructor(_root: HTMLElement, _options: unknown, onDone: () => void, onShown: () => void) {
      if (mockState.failToStart) throw new Error('its chunk failed');
      this.onDone = onDone;
      this.onShown = onShown;
      mockMounts.push(this);
    }
  },
}));

const ui = (isLoading: boolean, onComplete: () => void): React.ReactElement => (
  <BladeProvider themeTokens={bladeTheme} colorScheme="light">
    <RayLoader testID="loader" isLoading={isLoading} onComplete={onComplete} />
  </BladeProvider>
);

beforeEach(() => {
  mockMounts.length = 0;
  mockState.failToStart = false;
  mockState.failImport = false;
  jest.spyOn(console, 'error').mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

describe('<RayLoader /> onComplete', () => {
  it('waits for loading to end when his film gives up (slow to load, or failed) while the page loads', async () => {
    const onComplete = jest.fn();
    const { rerender, getByRole } = render(ui(true, onComplete));
    await waitFor(() => expect(mockMounts).toHaveLength(1));
    mockMounts[0].onDone(); // (START_WAIT_MS, or its film's chunk failing: he's gone)
    expect(onComplete).not.toHaveBeenCalled();
    expect(getByRole('progressbar')).toBeInTheDocument(); // (still loading, as far as anyone's told)
    rerender(ui(false, onComplete));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(mockMounts[0].finish).not.toHaveBeenCalled(); // (nothing to finish)
  });

  it('waits for loading to end when his director fails to start', async () => {
    mockState.failToStart = true;
    const onComplete = jest.fn();
    const { rerender } = render(ui(true, onComplete));
    await waitFor(() => expect(console.error).toHaveBeenCalled());
    expect(onComplete).not.toHaveBeenCalled();
    rerender(ui(false, onComplete));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('is called once his finish is over, not before', async () => {
    const onComplete = jest.fn();
    const { rerender } = render(ui(true, onComplete));
    await waitFor(() => expect(mockMounts).toHaveLength(1));
    rerender(ui(false, onComplete));
    expect(mockMounts[0].finish).toHaveBeenCalledTimes(1);
    expect(onComplete).not.toHaveBeenCalled();
    mockMounts[0].onDone();
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('shows his still from the first render till his film has drawn him (Saurav: the box was empty while it loaded)', async () => {
    const { rerender, container } = render(ui(true, jest.fn()));
    const still = (): HTMLImageElement | null => container.querySelector('img');
    expect(still()?.getAttribute('src')).toMatch(/^data:image\/webp;base64,/); // (at once, before anything has loaded)
    await waitFor(() => expect(mockMounts).toHaveLength(1));
    expect(still()).not.toBeNull(); // (his film still loading)
    act(() => {
      mockMounts[0].onShown();
    });
    expect(still()).toBeNull();
    rerender(ui(false, jest.fn()));
    expect(still()).toBeNull();
  });

  it('keeps his still while loading when his film gives up, and lets it go once the page is ready', async () => {
    const { rerender, container } = render(ui(true, jest.fn()));
    await waitFor(() => expect(mockMounts).toHaveLength(1));
    act(() => {
      mockMounts[0].onDone(); // (his film never came: the still is the loader)
    });
    expect(container.querySelector('img')).not.toBeNull();
    rerender(ui(false, jest.fn()));
    expect(container.querySelector('img')).toBeNull();
  });

  it('is never called once unmounted, even if his director then fails', async () => {
    // the page ready while his director still loads, the loader gone, then the director's chunk fails to load: nothing's called
    mockState.failImport = true;
    const onComplete = jest.fn();
    const { unmount } = render(ui(false, onComplete));
    unmount();
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(mockMounts).toHaveLength(0);
    expect(onComplete).not.toHaveBeenCalled();
  });
});
