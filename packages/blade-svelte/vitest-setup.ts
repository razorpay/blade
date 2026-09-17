import '@testing-library/jest-dom/vitest';
// Side-effect import: registers Testing Library `setup()`/`cleanup()` around every
// test so components are unmounted and the DOM is reset between cases.
import '@testing-library/svelte/vitest';
import { vi } from 'vitest';

// jsdom does not implement these browser APIs that some Blade components touch
// (layout observers, media queries). Provide inert mocks so rendering never throws.
globalThis.ResizeObserver = (vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
})) as unknown) as typeof ResizeObserver;

globalThis.IntersectionObserver = (vi.fn().mockImplementation(() => ({
  root: null,
  rootMargin: '',
  thresholds: [],
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  takeRecords: vi.fn(() => []),
})) as unknown) as typeof IntersectionObserver;

if (typeof globalThis.matchMedia !== 'function') {
  globalThis.matchMedia = (vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  })) as unknown) as typeof globalThis.matchMedia;
}
