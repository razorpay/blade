import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import IconButtonHarness from './fixtures/IconButtonHarness.svelte';
import { expectClass, expectMarkup } from './classes';

describe('IconButton', () => {
  it('is named by its label, holds a decorative glyph and leaves the form alone', () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn();
    const { getByTestId } = render(IconButtonHarness, {
      props: { onClick, onSubmit },
    });
    const button = getByTestId('dismiss') as HTMLButtonElement;
    expect(button.type).toBe('button');
    expect(button.getAttribute('aria-label')).toBe('Dismiss');
    expect(button.className.endsWith('ml-2')).toBe(true);

    const glyph = button.querySelector('svg')?.parentElement;
    expect(glyph?.getAttribute('aria-hidden')).toBe('true');

    return fireEvent.click(button).then(() => {
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onSubmit).not.toHaveBeenCalled();
    });
  });

  it('sizes the glyph 12, 16, 20px; bare, the button is the glyph', () => {
    const sizes = [
      ['small', 'w-3 h-3'],
      ['medium', 'w-4 h-4'],
      ['large', 'w-5 h-5'],
    ] as const;
    for (const [size, glyph] of sizes) {
      const { getByTestId, unmount } = render(IconButtonHarness, {
        props: { size },
      });
      const button = getByTestId('dismiss');
      expect(button.className).not.toMatch(/\bw-\d/);
      expectClass(button, 'rounded-2xsmall');
      expect(button.querySelector('svg')?.parentElement?.className).toContain(glyph);
      unmount();
    }
  });

  it('highlighted: a 24 or 32px box, gray on hover; large never boxes', () => {
    const small = render(IconButtonHarness, {
      props: { size: 'small', isHighlighted: true },
    });
    expectClass(small.getByTestId('dismiss'), 'w-6');
    expectClass(
      small.getByTestId('dismiss'),
      'hover:enabled:bg-interactive-gray-faded-highlighted',
    );
    small.unmount();
    const large = render(IconButtonHarness, {
      props: { size: 'large', isHighlighted: true },
    });
    expect(large.getByTestId('dismiss').className).not.toContain('w-');
  });

  it('intense is gray; subtle and moderate are white, moderate on a faint box', () => {
    const intense = render(IconButtonHarness).getByTestId('dismiss');
    expectClass(intense, 'icon-interactive-gray-muted');
    intense.remove();
    const moderate = render(IconButtonHarness, {
      props: { emphasis: 'moderate' },
    }).getByTestId('dismiss');
    expectClass(moderate, 'icon-interactive-static-white-normal');
    expectClass(moderate, 'bg-interactive-static-white-faded');
    expectClass(moderate, 'w-8');
  });

  it('a disabled button swallows a synthetic click', () => {
    const onClick = vi.fn();
    const { getByTestId } = render(IconButtonHarness, {
      props: { onClick, isDisabled: true },
    });
    const button = getByTestId('dismiss') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
    return fireEvent.click(button).then(() => {
      expect(onClick).not.toHaveBeenCalled();
    });
  });

  it('is busy while an async press settles: spinner for the glyph, second press swallowed', () => {
    let settle: () => void = () => {
      // noop
    };
    const onClick = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          settle = resolve;
        }),
    );
    const { getByTestId } = render(IconButtonHarness, { props: { onClick } });
    const button = getByTestId('dismiss');

    return fireEvent
      .click(button)
      .then(() => waitFor(() => expect(button.getAttribute('aria-busy')).toBe('true')))
      .then(() => {
        expect(button.querySelector('svg')).toBeNull();
        expectMarkup(button, 'animate-spin');
        expect(button.getAttribute('aria-label')).toBe('Dismiss');
        expect(button.querySelector('[role="status"]')?.textContent).toContain('Working');
        return fireEvent.click(button);
      })
      .then(() => {
        expect(onClick).toHaveBeenCalledTimes(1);
        settle();
        return waitFor(() => expect(button.hasAttribute('aria-busy')).toBe(false));
      })
      .then(() => {
        expect(button.querySelector('svg')).not.toBeNull();
      });
  });

  it('shows the host busy state', () => {
    const { getByTestId } = render(IconButtonHarness, {
      props: { isLoading: true },
    });
    expect(getByTestId('dismiss').getAttribute('aria-busy')).toBe('true');
  });

  it('submits the enclosing form when asked to', () => {
    const onSubmit = vi.fn();
    const { getByTestId } = render(IconButtonHarness, {
      props: { type: 'submit', onSubmit },
    });
    const button = getByTestId('dismiss') as HTMLButtonElement;
    expect(button.type).toBe('submit');
    return fireEvent
      .click(button)
      .then(() => waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1)))
      .then(() => {
        expect(onSubmit.mock.calls[0]?.[0]).toEqual({ query: 'upi' });
      });
  });
});
