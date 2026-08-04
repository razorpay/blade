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
});
