import { describe, it, expect, vi } from 'vitest';
import { flushSync, createRawSnippet } from 'svelte';
import { fireEvent, render } from '@testing-library/svelte';
import Button from '../components/button/Button.svelte';
import ButtonHarness from './fixtures/ButtonHarness.svelte';
import { expectClass, expectMarkup, expectNoClass } from './classes';

const label = createRawSnippet(() => ({ render: () => '<span>Pay</span>' }));

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
    // Blade's DotLoader: three dots rising in turn.
    expectMarkup(loader, 'animate-dot');
    expect(loader?.children).toHaveLength(3);
    // The live region announces the busy state (aria-busy alone is not
    // announced by most screen readers).
    expect(button.querySelector('[role="status"]')?.textContent).toContain('Loading');
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

  it('is a medium primary (blue) type="button" by default, inline-flex', () => {
    const { getByTestId } = render(Button, {
      props: { children: label, testID: 'b' },
    });
    const button = getByTestId('b') as HTMLButtonElement;
    expect(button.type).toBe('button');
    expectClass(button, 'inline-flex');
    expectClass(button, 'bg-interactive-primary-default');
    expectClass(button, 'min-h-9');
    expectClass(button, 'font-medium');
  });

  it('renders an anchor with href, and ignores isDisabled there', () => {
    const { getByTestId } = render(Button, {
      props: { children: label, href: '/pay', isDisabled: true, testID: 'b' },
    });
    const anchor = getByTestId('b') as HTMLAnchorElement;
    expect(anchor.tagName).toBe('A');
    expect(anchor.getAttribute('href')).toBe('/pay');
    expect(anchor.hasAttribute('disabled')).toBe(false);
  });

  it.each([
    ['xsmall', 'min-h-7', 'px-2', 'text-75'],
    ['small', 'min-h-8', 'px-2', 'text-75'],
    ['medium', 'min-h-9', 'px-3', 'text-100'],
    ['large', 'min-h-12', 'px-4', 'text-200'],
  ] as const)('%s: Blade’s height, padding and type', (size, height, pad, type) => {
    const { getByTestId } = render(Button, {
      props: { children: label, size, testID: 'b' },
    });
    const button = getByTestId('b');
    expectClass(button, height);
    expectClass(button, pad);
    expectClass(button, type);
  });

  it('white: a white fill with black text; outlined, a white rim', () => {
    const filled = render(Button, {
      props: { children: label, color: 'white', testID: 'a' },
    }).getByTestId('a');
    expectClass(filled, 'bg-interactive-static-white-default');
    expectClass(filled, 'text-interactive-static-black-muted');
    const outlined = render(Button, {
      props: { children: label, color: 'white', variant: 'secondary', testID: 'b' },
    }).getByTestId('b');
    expectClass(outlined, 'shadow-button-white-outlined');
    expectClass(outlined, 'text-interactive-static-white-normal');
  });

  it('tertiary takes primary or white; another colour draws as primary', () => {
    const tertiary = render(Button, {
      props: { children: label, variant: 'tertiary', color: 'negative', testID: 'b' },
    }).getByTestId('b');
    expectClass(tertiary, 'shadow-button-outlined');
    expectClass(tertiary, 'text-interactive-gray-normal');
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
    expectClass(button.querySelector('[data-part="content"]'), 'group-active:enabled:scale-95');
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
