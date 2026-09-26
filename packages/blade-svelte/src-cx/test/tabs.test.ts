import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import TabsHarness from './fixtures/TabsHarness.svelte';
import { expectClass } from './classes';

describe('Tabs', () => {
  it('picks the first tab and wires tab ↔ panel', () => {
    const { getByRole, getAllByRole } = render(TabsHarness);
    const list = getByRole('tablist', { name: 'Payment methods' });
    const tabs = getAllByRole('tab');
    const panel = getByRole('tabpanel');
    expect(list.contains(tabs[0])).toBe(true);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
    expect(tabs[0].getAttribute('aria-controls')).toBe(panel.id);
    expect(panel.getAttribute('aria-labelledby')).toBe(tabs[0].id);
    expect(panel.textContent).toContain('Pay with UPI');
    expect(tabs.map((tab) => tab.tabIndex)).toEqual([0, -1, -1, -1]);
    expectClass(tabs[0], 'text-interactive-gray-normal');
    expectClass(tabs[1], 'text-interactive-gray-muted');
    expectClass(tabs[2], 'text-interactive-gray-disabled');
    expect(tabs[2].getAttribute('aria-disabled')).toBe('true');
  });

  it('a click picks; arrows move and pick, skip a disabled tab and wrap', () => {
    const onChange = vi.fn();
    const { getAllByRole, getByRole } = render(TabsHarness, {
      props: { onChange },
    });
    const tabs = getAllByRole('tab');

    return fireEvent
      .click(tabs[1])
      .then(() => {
        expect(onChange).toHaveBeenLastCalledWith('card');
        expect(getByRole('tabpanel').textContent).toContain('Pay with Card');
        tabs[1].focus();
        return fireEvent.keyDown(tabs[1], { key: 'ArrowRight' });
      })
      .then(() => waitFor(() => expect(document.activeElement).toBe(tabs[3])))
      .then(() => {
        expect(onChange).toHaveBeenLastCalledWith('wallet');
        return fireEvent.keyDown(tabs[3], { key: 'ArrowRight' });
      })
      .then(() => waitFor(() => expect(document.activeElement).toBe(tabs[0])))
      .then(() => {
        expect(onChange).toHaveBeenLastCalledWith('upi');
        return fireEvent.click(tabs[2]);
      })
      .then(() => {
        expect(onChange).toHaveBeenCalledTimes(3);
      });
  });

  it('manual activation: arrows only move focus, Enter picks', () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(TabsHarness, {
      props: { onChange, activation: 'manual' },
    });
    const tabs = getAllByRole('tab');
    tabs[0].focus();
    return fireEvent
      .keyDown(tabs[0], { key: 'End' })
      .then(() => waitFor(() => expect(document.activeElement).toBe(tabs[3])))
      .then(() => {
        expect(onChange).not.toHaveBeenCalled();
        return fireEvent.keyDown(tabs[3], { key: 'Enter' });
      })
      .then(() => {
        expect(onChange).toHaveBeenCalledWith('wallet');
      });
  });

  it('follows a value the host drives', () => {
    const { getByRole, rerender } = render(TabsHarness, {
      props: { value: 'wallet' },
    });
    expect(getByRole('tabpanel').textContent).toContain('Pay with Wallet');
    return rerender({ value: 'card' }).then(() => {
      expect(getByRole('tabpanel').textContent).toContain('Pay with Card');
    });
  });

  it('fill: one sliding underline, none on the picked tab itself', () => {
    const { getByRole, getAllByRole } = render(TabsHarness, {
      props: { layout: 'fill', value: 'card' },
    });
    const underline = getByRole('tablist').lastElementChild as HTMLElement;
    expect(underline.getAttribute('aria-hidden')).toBe('true');
    expect(underline.style.getPropertyValue('--tab-index')).toBe('1');
    expect(underline.style.getPropertyValue('--tab-count')).toBe('4');
    expect(underline.className).toContain(
      'border-interactive-neutral-highlighted'
    );
    expect(getAllByRole('tab')[1].className).not.toContain(
      'border-interactive-neutral-highlighted'
    );
  });
});
