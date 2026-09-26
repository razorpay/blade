import { describe, it, expect, vi } from 'vitest';
import { createTabsModel } from './tabs.svelte';

const tabs = ['upi', 'card', 'netbanking'];

describe('createTabsModel', () => {
  it('automatic activation selects as the focus moves, wrapping at the ends', () => {
    const onChange = vi.fn();
    const t = createTabsModel({
      items: () => tabs,
      defaultValue: 'upi',
      onChange,
    });
    t.setActive(0);
    expect(t.handleKey('ArrowRight')).toBe('next');
    expect(t.selected()).toBe('card');
    t.handleKey('End');
    expect(t.selected()).toBe('netbanking');
    t.handleKey('ArrowRight');
    expect(t.selected()).toBe('upi');
    expect(t.handleKey('ArrowDown')).toBeNull();
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it('manual activation moves without selecting until Enter, and never deselects', () => {
    const t = createTabsModel({
      items: () => tabs,
      defaultValue: 'upi',
      activation: 'manual',
    });
    t.setActive(0);
    t.handleKey('ArrowRight');
    expect(t.selected()).toBe('upi');
    t.handleKey('Enter');
    expect(t.selected()).toBe('card');
    t.select('card');
    expect(t.selected()).toBe('card');
  });

  it('skips disabled tabs', () => {
    const t = createTabsModel({
      items: () => tabs,
      defaultValue: 'upi',
      isDisabled: (tab) => tab === 'card',
    });
    t.setActive(0);
    t.handleKey('ArrowRight');
    expect(t.selected()).toBe('netbanking');
  });
});
