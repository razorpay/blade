import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import TabsHarness from './fixtures/TabsHarness.svelte';
import { expectClass, expectGlyph } from './classes';
import { InfoIcon } from '../icons';
import { createRawSnippet } from 'svelte';
import TabItem from '../components/tabs/TabItem.svelte';
import { resolveTabs } from '../components/tabs/styles';

describe('Tabs', () => {
  it("children and trailing receive the tab's state; icon draws a glyph", async () => {
    const { getByTestId, queryByTestId, getAllByRole } = render(TabsHarness);
    expect(getByTestId('picked-upi')).toBeTruthy();
    expect(queryByTestId('picked-card')).toBeNull();
    expect(getByTestId('trailing-upi').dataset.selected).toBe('true');
    expect(getByTestId('trailing-emi').dataset.disabled).toBe('true');
    const card = getAllByRole('tab')[1];
    expectGlyph(card, InfoIcon);
    await fireEvent.click(card);
    expect(getByTestId('picked-card')).toBeTruthy();
    expect(getByTestId('trailing-upi').dataset.selected).toBe('false');
  });

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

  it('marks the pick with one indicator beside the tabs, not on a tab', () => {
    const { getByRole, getAllByRole } = render(TabsHarness, {
      props: { value: 'card' },
    });
    const box = getByRole('tablist').parentElement!;
    const indicator = box.lastElementChild as HTMLElement;
    expect(indicator.getAttribute('aria-hidden')).toBe('true');
    expectClass(indicator, 'bg-interactive-neutral-highlighted');
    expect(indicator.style.getPropertyValue('--tab-w')).toMatch(/px$/);
    // Bordered: the track under the row.
    expectClass(box, 'border-surface-gray-muted');
    expect(getAllByRole('tab')[1].className).not.toContain('bg-interactive-neutral-highlighted');
  });

  it('filled and vertical: the picked tab fills itself, with no indicator', () => {
    const { getByRole, getAllByRole } = render(TabsHarness, {
      props: { variant: 'filled', orientation: 'vertical' },
    });
    expect(getByRole('tablist').getAttribute('aria-orientation')).toBe('vertical');
    expect(
      getByRole('tablist').parentElement!.querySelector(':scope > [aria-hidden="true"]'),
    ).toBeNull();
    expectClass(getAllByRole('tab')[0], 'bg-surface-gray-intense');
  });

  it('keeps every panel mounted and hidden, unless lazy', () => {
    const eager = render(TabsHarness);
    expect(eager.getAllByTestId('panel-text')).toHaveLength(4);
    expect(eager.getAllByRole('tabpanel', { hidden: true }).filter((p) => p.hidden)).toHaveLength(
      3,
    );
    eager.unmount();
    const lazy = render(TabsHarness, { props: { isLazy: true } });
    expect(lazy.getAllByTestId('panel-text')).toHaveLength(1);
  });

  it("spaces horizontal tabs per size, as Figma's Tabs: 24px small, 32px medium and large", () => {
    expect(resolveTabs({ size: 'small' }).list).toContain('gap-6');
    expect(resolveTabs({ size: 'medium' }).list).toContain('gap-8');
    expect(resolveTabs({ size: 'large', variant: 'borderless' }).list).toContain('gap-8');
    expect(resolveTabs({ size: 'medium' }).list).not.toContain('d:gap');
  });

  it('a leading asset sits in the icon box, on the 8px row with the label', () => {
    const leading = createRawSnippet(() => ({ render: () => '<img data-testid="logo" alt="" />' }));
    const children = createRawSnippet(() => ({ render: () => '<span>Bank</span>' }));
    const { getByTestId, getByRole } = render(TabItem, { props: { value: 'bank', leading, children } });
    const box = getByTestId('logo').parentElement!;
    expectClass(box, 'w-4 h-4');
    const tab = getByRole('tab');
    expectClass(tab, 'gap-2');
    expectClass(tab, 'whitespace-nowrap');
    expect(tab.firstElementChild).toBe(box);
  });
});
