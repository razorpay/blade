import { render, screen } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import CardGroupItem from '../CardGroupItem.svelte';
import CardGroupTestHarness from './CardGroupTestHarness.svelte';

describe('<CardGroupItem />', () => {
  it('renders a navigating row as a link with an href', () => {
    render(CardGroupItem, { props: { children: 'Cards', href: '/cards' } });

    const link = screen.getByRole('link', { name: 'Cards' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/cards');
  });

  it('renders a selecting row as a button and fires onClick', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(CardGroupItem, { props: { children: 'Wallet', onClick } });

    const button = screen.getByRole('button', { name: 'Wallet' });
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(CardGroupItem, { props: { children: 'Wallet', isDisabled: true, onClick } });

    const button = screen.getByRole('button', { name: 'Wallet' });
    expect(button).toBeDisabled();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('marks a selected row with aria-current', () => {
    render(CardGroupItem, { props: { children: 'Wallet', isSelected: true, onClick: vi.fn() } });

    expect(screen.getByRole('button', { name: 'Wallet' })).toHaveAttribute('aria-current', 'true');
  });

  it('renders a plain container when the row is neither navigating nor selecting', () => {
    render(CardGroupItem, { props: { children: 'Static' } });

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Static')).toBeInTheDocument();
  });
});

describe('<CardGroup /> composition', () => {
  it('renders the group with its accessible label', () => {
    render(CardGroupTestHarness);

    expect(screen.getByRole('group', { name: 'Payment methods' })).toBeInTheDocument();
  });

  it('renders navigating and selecting rows inside the group', () => {
    render(CardGroupTestHarness);

    expect(screen.getByRole('link', { name: 'Cards' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Wallet' })).toBeInTheDocument();
  });

  it('acts as a collapsible trigger with aria-expanded that toggles on click', async () => {
    const user = userEvent.setup();
    render(CardGroupTestHarness);

    const trigger = screen.getByRole('button', { name: 'UPI' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');

    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('reflects defaultIsExpanded on the trigger', () => {
    render(CardGroupTestHarness, { props: { defaultIsExpanded: true } });

    expect(screen.getByRole('button', { name: 'UPI' })).toHaveAttribute('aria-expanded', 'true');
  });
});
