import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { fireEvent, render } from '@testing-library/svelte';
import Button from '../components/button/Button.svelte';
import ButtonHarness from './fixtures/ButtonHarness.svelte';
import { expectClass, expectGlyph, expectMarkup, expectNoClass, glyphsIn } from './classes';
import { ArrowRightIcon, CloseIcon, WalletIcon } from '../icons';

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
    expect(loader?.querySelectorAll('.animate-dot')).toHaveLength(3);
    // The provider's one live region says the busy state (aria-busy alone
    // is not announced by most screen readers); the button has none.
    expect(getByTestId('host-live').textContent).toContain('Loading');
    expect(button.querySelector('[role="status"], [aria-live]')).toBeNull();
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
    // Figma's label is Semi Bold.
    expectClass(button, 'font-semibold');
  });

  it('a loading link is busy as the button is, and refuses the click', () => {
    const onClick = vi.fn();
    const { getByTestId } = render(Button, {
      props: { children: label, href: '/pay', isLoading: true, onClick, testID: 'b' },
    });
    const anchor = getByTestId('b');
    expect(anchor.getAttribute('aria-busy')).toBe('true');
    expect(anchor.getAttribute('aria-disabled')).toBe('true');
    expect(anchor.getAttribute('href')).toBe('/pay');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    anchor.dispatchEvent(click);
    expect(click.defaultPrevented).toBe(true);
    expect(onClick).not.toHaveBeenCalled();
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
    ['xsmall', 'min-h-7', 'px-2', 'text-75', 'tracking-50'],
    ['small', 'min-h-8', 'px-2', 'text-75', 'tracking-50'],
    ['medium', 'min-h-9', 'px-3', 'text-100', 'tracking-50'],
    ['large', 'min-h-12', 'px-4', 'text-200', 'tracking-25'],
  ] as const)('%s: Figma’s height, padding and type', (size, height, pad, type, tracking) => {
    const { getByTestId } = render(Button, {
      props: { children: label, size, testID: 'b' },
    });
    const button = getByTestId('b');
    expectClass(button, height);
    expectClass(button, pad);
    expectClass(button, type);
    expectClass(button, tracking);
  });

  it.each([
    ['xsmall', 'w-3 h-3'],
    ['small', 'w-3 h-3'],
    ['medium', 'w-4 h-4'],
    ['large', 'w-4 h-4'],
  ] as const)(
    '%s: leading and trailing icons on the row, the label 4px each side',
    (size, iconBox) => {
      const { getByTestId } = render(Button, {
        props: {
          children: label,
          size,
          icon: WalletIcon,
          trailingIcon: ArrowRightIcon,
          testID: 'b',
        },
      });
      const content = getByTestId('b').querySelector('[data-part="content"]')!;
      const [leading, labelBox, trailing] = [...content.children] as HTMLElement[];
      expectGlyph(leading.parentElement, WalletIcon);
      expect(leading.dataset.icon).toBe('wallet');
      expectClass(labelBox, 'px-1');
      expect(trailing.dataset.icon).toBe('arrow-right');
      expectClass(leading, iconBox);
      expectClass(content, 'whitespace-nowrap');
      expect(content.className).not.toContain('gap-');
    },
  );

  it('an icon alone is a square of the height around a 16px glyph, named by its label', () => {
    const { getByTestId } = render(Button, {
      props: { icon: CloseIcon, size: 'small', accessibilityLabel: 'Close', testID: 'b' },
    });
    const button = getByTestId('b');
    expectClass(button, 'w-8 h-8');
    expect(button.className).not.toContain('px-2');
    expect(button.getAttribute('aria-label')).toBe('Close');
    expectClass(glyphsIn(button)[0], 'w-4 h-4');
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

  it('has no tertiary: Blade DSL (Figma) deprecates it', async () => {
    const { BUTTON_AXES } = await import('../components/button/styles');
    expect(BUTTON_AXES.variant).toEqual(['primary', 'secondary']);
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
    // Its own `:active`, not a `group`: a press on a `.group` ancestor (a
    // modal) must not press it.
    expect(button.className).not.toMatch(/(^|\s)group(\s|$)/);
    expectClass(
      button,
      '[&:active:not(:disabled):not([aria-disabled=true])>[data-part=content]]:scale-95',
    );
  });

  it('a neutral button is a filled surface: light loader dots', () => {
    const { getByTestId } = render(ButtonHarness, {
      props: { color: 'neutral', isLoading: true },
    });
    const button = getByTestId('solo');
    expectClass(button, 'bg-interactive-neutral-default');
    // The layer sets the colour; the DotLoader's dots take it.
    expectClass(button.querySelector('[aria-hidden]'), 'icon-interactive-on-neutral-normal');
    expectClass(button.querySelector('.animate-dot'), 'bg-current');
  });
});

describe('Button and the adapters', () => {
  it('says busy and done through the provider’s live region, in Blade’s words by default', async () => {
    const { getByTestId, rerender } = render(ButtonHarness, { props: { isLoading: true } });
    expect(getByTestId('host-live').textContent).toContain('Started loading');
    await rerender({ isLoading: false });
    expect(getByTestId('host-live').textContent).toContain('Stopped loading');
  });

  it('an app’s announce adapter takes the message instead', async () => {
    const announce = vi.fn();
    const { getByTestId, rerender } = render(ButtonHarness, {
      props: { adapters: { announce }, loadingAnnouncement: 'Paying' },
    });
    await rerender({ adapters: { announce }, loadingAnnouncement: 'Paying', isLoading: true });
    expect(announce).toHaveBeenCalledWith('Paying');
    expect(getByTestId('host-live').textContent).toBe('');
  });

  it('reports a press to the vibrate adapter, which decides; a swapped adapter is the one told', async () => {
    const first = vi.fn();
    const second = vi.fn();
    const { getByTestId, rerender } = render(ButtonHarness, {
      props: { adapters: { vibrate: first } },
    });
    await fireEvent.click(getByTestId('solo'));
    await Promise.resolve();
    expect(first).toHaveBeenCalledWith('press');
    await rerender({ adapters: { vibrate: second } });
    await fireEvent.click(getByTestId('solo'));
    await Promise.resolve();
    expect(second).toHaveBeenCalledWith('press');
    expect(first).toHaveBeenCalledTimes(1);
  });

  it('passes data-analytics-* to the button', () => {
    const { getByTestId } = render(ButtonHarness);
    expect(getByTestId('solo').getAttribute('data-analytics-action')).toBe('pay');
  });

  it('an href routes a plain internal click through adapters.navigate, as Link', () => {
    const navigate = vi.fn(() => true);
    const onClick = vi.fn();
    const { getByTestId } = render(ButtonHarness, {
      props: { href: '/orders', onClick, adapters: { navigate } },
    });
    const anchor = getByTestId('solo');
    expect(anchor.tagName).toBe('A');
    expect(anchor.getAttribute('data-analytics-action')).toBe('pay');
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
    anchor.dispatchEvent(event);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(navigate.mock.calls.length).toBe(1);
    expect((navigate.mock.calls[0] as unknown[])[0]).toBe('/orders');
    expect(event.defaultPrevented).toBe(true);
  });

  it('an href with target _blank gets noopener noreferrer', () => {
    const { getByTestId } = render(ButtonHarness, {
      props: { href: 'https://razorpay.com', target: '_blank' },
    });
    expect(getByTestId('solo').getAttribute('rel')).toBe('noopener noreferrer');
  });
});
