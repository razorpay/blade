import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import ImageHarness from './fixtures/ImageHarness.svelte';
import { expectClass } from './classes';

describe('Image', () => {
  it('renders a URL as an img in the caller-sized box', () => {
    const onLoad = vi.fn();
    const { getByTestId } = render(ImageHarness, {
      props: { src: '/hdfc.png', onLoad },
    });
    const box = getByTestId('logo');
    const img = box.querySelector('img')!;
    expectClass(box, 'overflow-hidden');
    expect(box.className.endsWith('w-8 h-8')).toBe(true);
    expect(img.getAttribute('src')).toBe('/hdfc.png');
    expect(img.alt).toBe('HDFC Bank');
    expectClass(img, 'object-contain');
    return fireEvent.load(img).then(() => {
      expect(onLoad).toHaveBeenCalledTimes(1);
    });
  });

  it('renders markup through a data URI, never as HTML', () => {
    const { getByTestId } = render(ImageHarness, {
      props: { src: '<svg onload="alert(1)"></svg>' },
    });
    const box = getByTestId('logo');
    expect(box.querySelector('svg')).toBeNull();
    expect(box.querySelector('img')?.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
  });

  it('a load error falls back to the initial of alt, named by alt', () => {
    const onError = vi.fn();
    const { getByTestId } = render(ImageHarness, {
      props: { src: '/missing.png', onError },
    });
    const img = getByTestId('logo').querySelector('img')!;
    return fireEvent.error(img).then(() => {
      const stand = getByTestId('logo').firstElementChild;
      expect(stand?.textContent).toBe('H');
      expect(stand?.getAttribute('aria-label')).toBe('HDFC Bank');
      expectClass(stand, 'bg-interactive-neutral-faded');
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  it('prefers the caller’s fallback, also when there is no source', () => {
    const { getByTestId } = render(ImageHarness, {
      props: { src: undefined, withFallback: true },
    });
    expect(getByTestId('own')).toBeTruthy();
  });

  it('awaits a promised source, marking the wait only when asked', () => {
    let load: (value: { default: string }) => void = () => {
      // noop
    };
    const src = new Promise<{ default: string }>((resolve) => {
      load = resolve;
    });
    const { getByTestId } = render(ImageHarness, {
      props: { src, isPendingShown: true },
    });
    const box = getByTestId('logo');
    expectClass(box.firstElementChild, 'animate-skeleton');
    load({ default: '/lazy.svg' });
    return waitFor(() => expect(box.querySelector('img')?.getAttribute('src')).toBe('/lazy.svg'));
  });

  it('a rejected source falls back', () => {
    const { getByTestId } = render(ImageHarness, {
      props: { src: Promise.reject<string>(new Error('chunk')) },
    });
    return waitFor(() => expect(getByTestId('logo').textContent).toBe('H'));
  });
});
