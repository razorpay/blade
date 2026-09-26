import { describe, it, expect, vi } from 'vitest';
import { flushSync } from 'svelte';
import { fireEvent, render } from '@testing-library/svelte';
import ButtonHarness from './fixtures/ButtonHarness.svelte';
import { expectClass, expectMarkup, expectNoClass } from './classes';

describe('Button standalone', () => {
  it('forwards the click with the platform event and renders recipe classes', async () => {
    const onClick = vi.fn();
    const { getByTestId } = render(ButtonHarness, { props: { onClick } });

    const button = getByTestId('solo');
    // Classes come from the component's own styles.
    expectClass(button, 'rounded-small');

    await fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
  });

  it('isDisabled renders a disabled button that does not fire', async () => {
    const onClick = vi.fn();
    const { getByTestId } = render(ButtonHarness, {
      props: { onClick, isDisabled: true },
    });

    const button = getByTestId('solo') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    await fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('isLoading fades the children in place under the loader and blocks interaction', async () => {
    const onClick = vi.fn();
    const { getByTestId } = render(ButtonHarness, {
      props: { isLoading: true, onClick, loadingAnnouncement: 'Loading' },
    });

    const button = getByTestId('solo') as HTMLButtonElement;
    // Busy must not set `disabled` — that would eject keyboard focus.
    expect(button.disabled).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
    // The children stay rendered, faded, so the button keeps its width and
    // its accessible name; the dots draw in a layer above them.
    const content = button.querySelector('[data-part="content"]');
    expect(content?.textContent).toContain('Go');
    expectClass(content, 'opacity-0');
    const loader = button.querySelector('[aria-hidden="true"]');
    expectClass(loader, 'absolute');
    expectMarkup(loader, 'animate-bounce');
    // The live region announces the busy state (aria-busy alone is not
    // announced by most screen readers).
    expect(button.querySelector('[role="status"]')?.textContent).toContain(
      'Loading'
    );
    // The anatomy swallows impatient presses before they reach the model,
    // whose blocked path would still forward onClick.
    await fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('a button at rest renders its children unfaded and no loader', () => {
    const { getByTestId } = render(ButtonHarness);
    const button = getByTestId('solo');
    expectNoClass(button.querySelector('[data-part="content"]'), 'opacity-0');
    expect(button.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('the link variant is inline-flex: only as wide as its content', () => {
    const { getByTestId } = render(ButtonHarness, {
      props: { variant: 'link' },
    });
    const button = getByTestId('solo');
    expectClass(button, 'inline-flex');
    expectClass(button, 'relative');
    expect(button.className.split(' ')).not.toContain('inline');
  });

  it('resolves preset style props and appends the caller class last', () => {
    const { getByTestId } = render(ButtonHarness, {
      props: { variant: 'secondary', className: 'w-full' },
    });
    const className = getByTestId('solo').className;
    // The preset's resolver decides the variant classes; width is the
    // caller's layout concern via `class`.
    expectClass({ className }, 'shadow-button-outlined');
    expect(className.endsWith('w-full')).toBe(true);
  });

  it('a filled button wears its accent under the frame and presses by scaling its content', () => {
    const { getByTestId } = render(ButtonHarness, {
      props: { color: 'neutral' },
    });
    const button = getByTestId('solo');
    expectClass(button, 'shadow-button-neutral');
    expectClass(button, 'before:bg-button-sheen-medium');
    expectClass(button, 'group');
    expectClass(
      button.querySelector('[data-part="content"]'),
      'group-active:scale-95'
    );
  });

  it('the link variant neither wears a frame nor presses', () => {
    const { getByTestId } = render(ButtonHarness, {
      props: { variant: 'link' },
    });
    const button = getByTestId('solo');
    expectNoClass(button, 'shadow-button');
    expectNoClass(
      button.querySelector('[data-part="content"]'),
      'group-active:scale-95'
    );
  });

  it('a neutral button is a filled surface: light loader dots', () => {
    const { getByTestId } = render(ButtonHarness, {
      props: { color: 'neutral', isLoading: true },
    });
    const button = getByTestId('solo');
    expectClass(button, 'bg-interactive-neutral-default');
    expectClass(button.querySelector('[aria-hidden] > span'), 'bg-current');
  });
});

describe('Button autoPressAfter', () => {
  it('fills as the seconds run, then presses itself once', () => {
    vi.useFakeTimers();
    const onClick = vi.fn();
    const { getByTestId } = render(ButtonHarness, {
      props: { onClick, autoPressAfter: 4 },
    });
    const button = getByTestId('solo');
    vi.advanceTimersByTime(1000);
    flushSync();
    const fill = button.querySelector<HTMLElement>('[aria-hidden="true"]');
    expectClass(fill, '[scale:var(--progress)_1]');
    expect(fill?.style.getPropertyValue('--progress')).toBe('0.25');

    vi.advanceTimersByTime(3000);
    flushSync();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(button.querySelector('[style*="--progress"]')).toBeNull();
    vi.advanceTimersByTime(10000);
    expect(onClick).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('a press by hand ends the wait', () => {
    vi.useFakeTimers();
    const onClick = vi.fn();
    const { getByTestId } = render(ButtonHarness, {
      props: { onClick, autoPressAfter: 4 },
    });
    getByTestId('solo').click();
    vi.advanceTimersByTime(10000);
    expect(onClick).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('a disabled button does not count', () => {
    vi.useFakeTimers();
    const onClick = vi.fn();
    render(ButtonHarness, {
      props: { onClick, autoPressAfter: 2, isDisabled: true },
    });
    vi.advanceTimersByTime(10000);
    expect(onClick).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
