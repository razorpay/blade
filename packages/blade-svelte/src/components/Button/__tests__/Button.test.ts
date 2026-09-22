import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import Button from '../Button.svelte';
import type { ButtonProps } from '../types';

describe('<Button />', () => {
  it('renders a button with its text content', () => {
    render(Button, { props: { children: 'Pay Now' } });

    const button = screen.getByRole('button', { name: 'Pay Now' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Pay Now');
  });

  it.each<NonNullable<ButtonProps['size']>>(['xsmall', 'small', 'medium', 'large'])(
    'renders %s size without crashing',
    (size) => {
      render(Button, { props: { children: 'Pay Now', size } });
      expect(screen.getByRole('button', { name: 'Pay Now' })).toBeInTheDocument();
    },
  );

  it.each<NonNullable<ButtonProps['variant']>>(['primary', 'secondary', 'tertiary'])(
    'renders %s variant without crashing',
    (variant) => {
      render(Button, { props: { children: 'Pay Now', variant } });
      expect(screen.getByRole('button', { name: 'Pay Now' })).toBeInTheDocument();
    },
  );

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(Button, { props: { children: 'Pay Now', onClick } });

    await user.click(screen.getByRole('button', { name: 'Pay Now' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled and does not fire onClick when isDisabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(Button, { props: { children: 'Pay Now', isDisabled: true, onClick } });

    const button = screen.getByRole('button', { name: 'Pay Now' });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('exposes accessibilityLabel as the accessible name', () => {
    render(Button, {
      props: { children: 'Pay Now', accessibilityLabel: 'Complete payment' },
    });
    expect(screen.getByRole('button', { name: 'Complete payment' })).toBeInTheDocument();
  });

  describe('indefinite loading', () => {
    it('renders three dots and hides them from assistive tech', () => {
      const { container } = render(Button, {
        props: { children: 'Pay Now', isLoading: true },
      });

      const loader = container.querySelector('[aria-hidden="true"]');
      expect(loader).toBeInTheDocument();
      expect(loader?.children).toHaveLength(3);
    });

    it.each([
      ['xsmall', false],
      ['small', false],
      ['medium', false],
      ['large', true],
    ] as const)('uses the %s-appropriate loader size', (size, expectsLargeLoader) => {
      const { container } = render(Button, {
        props: { children: 'Pay Now', isLoading: true, size },
      });

      const loader = container.querySelector('[aria-hidden="true"]');
      // The large class is a CSS-module hash, so match on its stable prefix.
      const hasLargeLoader = /dot-loader-large/.test(loader?.className ?? '');
      expect(hasLargeLoader).toBe(expectsLargeLoader);
    });

    it('resolves the dot color through --btn-dots-color so the shipped override still works', () => {
      const { container } = render(Button, {
        props: { children: 'Pay Now', isLoading: true },
      });

      // The wrapper (not the loader itself) carries the custom property, so a
      // consumer setting --btn-dots-color on the button still wins.
      const wrapper = container.querySelector<HTMLElement>('[style*="--dot-loader-color"]');
      expect(wrapper).toBeInTheDocument();
      expect(wrapper?.style.getPropertyValue('--dot-loader-color')).toContain('--btn-dots-color');
    });
  });
});
