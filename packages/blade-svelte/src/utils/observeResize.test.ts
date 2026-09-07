import { afterEach, describe, expect, it, vi } from 'vitest';
import { observeResize } from './observeResize';

const OriginalResizeObserver = globalThis.ResizeObserver;

afterEach(() => {
  globalThis.ResizeObserver = OriginalResizeObserver;
  vi.restoreAllMocks();
});

describe('observeResize', () => {
  it('observes a single node and returns a cleanup that disconnects', () => {
    const observe = vi.fn();
    const disconnect = vi.fn();
    globalThis.ResizeObserver = (vi.fn(() => ({
      observe,
      disconnect,
      unobserve: vi.fn(),
    })) as unknown) as typeof ResizeObserver;

    const node = document.createElement('div');
    const callback = vi.fn();

    const cleanup = observeResize(node, callback);

    expect(observe).toHaveBeenCalledTimes(1);
    expect(observe).toHaveBeenCalledWith(node);
    expect(typeof cleanup).toBe('function');

    cleanup?.();
    expect(disconnect).toHaveBeenCalledTimes(1);
  });

  it('observes every node when given an array', () => {
    const observe = vi.fn();
    globalThis.ResizeObserver = (vi.fn(() => ({
      observe,
      disconnect: vi.fn(),
      unobserve: vi.fn(),
    })) as unknown) as typeof ResizeObserver;

    const nodeA = document.createElement('div');
    const nodeB = document.createElement('div');

    observeResize([nodeA, nodeB], vi.fn());

    expect(observe).toHaveBeenCalledTimes(2);
    expect(observe).toHaveBeenNthCalledWith(1, nodeA);
    expect(observe).toHaveBeenNthCalledWith(2, nodeB);
  });

  it('degrades gracefully to undefined when ResizeObserver is unavailable', () => {
    // @ts-expect-error deliberately removing the global for the unsupported path
    delete globalThis.ResizeObserver;

    const node = document.createElement('div');

    expect(observeResize(node, vi.fn())).toBeUndefined();
  });
});
