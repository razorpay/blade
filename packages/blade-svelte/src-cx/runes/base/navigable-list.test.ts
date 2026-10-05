import { describe, it, expect } from 'vitest';
import { createNavigableList } from './navigable-list.svelte';

const items = ['Axis', 'Bank of Baroda', 'Canara', 'HDFC', 'ICICI'];

function manualSchedule(): { schedule: (fn: () => void) => () => void; flush: () => void } {
  const pending: Array<() => void> = [];
  return {
    schedule: (fn: () => void) => {
      pending.push(fn);
      return () => {
        pending.splice(pending.indexOf(fn), 1);
      };
    },
    flush: () => {
      pending.splice(0).forEach((fn) => fn());
    },
  };
}

describe('createNavigableList', () => {
  it('moves over enabled items only, clamping without loop', () => {
    const list = createNavigableList({
      items: () => items,
      isDisabled: (item) => item === 'Canara',
    });
    list.move('next');
    expect(list.activeIndex()).toBe(0);
    list.move('next');
    list.move('next');
    expect(list.active()).toBe('HDFC');
    list.move('last');
    list.move('next');
    expect(list.activeIndex()).toBe(4);
    list.move('first');
    list.move('prev');
    expect(list.activeIndex()).toBe(0);
  });

  it('wraps with loop and pages by pageSize', () => {
    const list = createNavigableList({
      items: () => items,
      loop: true,
      pageSize: 2,
    });
    list.move('prev');
    expect(list.activeIndex()).toBe(4);
    list.move('next');
    expect(list.activeIndex()).toBe(0);
    list.move('pageDown');
    expect(list.activeIndex()).toBe(2);
    list.move('pageUp');
    expect(list.activeIndex()).toBe(0);
  });

  it('maps keys to actions per orientation and ignores chords', () => {
    const vertical = createNavigableList({
      items: () => items,
      typeahead: (i) => i,
    });
    expect(vertical.keyAction('ArrowDown')).toBe('next');
    expect(vertical.keyAction('ArrowRight')).toBeNull();
    expect(vertical.keyAction('Home')).toBe('first');
    expect(vertical.keyAction('Enter')).toBe('select');
    expect(vertical.keyAction(' ')).toBe('select');
    expect(vertical.keyAction('Escape')).toBe('close');
    expect(vertical.keyAction('h')).toBe('type');
    expect(vertical.keyAction('ArrowDown', { alt: true })).toBe('open');
    expect(vertical.keyAction('ArrowDown', { ctrl: true })).toBeNull();
    const horizontal = createNavigableList({
      items: () => items,
      orientation: 'horizontal',
    });
    expect(horizontal.keyAction('ArrowRight')).toBe('next');
    expect(horizontal.keyAction('h')).toBeNull();
  });

  it('typeahead matches a prefix, cycles on a repeated letter and resets after the delay', () => {
    const timer = manualSchedule();
    const list = createNavigableList({
      items: () => items,
      typeahead: (i) => i,
      schedule: timer.schedule,
    });
    list.type('h');
    expect(list.active()).toBe('HDFC');
    list.type('d');
    expect(list.active()).toBe('HDFC');
    timer.flush();
    list.setActive(0);
    list.type('b');
    expect(list.active()).toBe('Bank of Baroda');
    timer.flush();
    list.setActive(-1);
    list.type('c');
    list.type('c');
    expect(list.active()).toBe('Canara');
  });

  it('ignores out-of-range indices', () => {
    const list = createNavigableList({ items: () => items });
    list.setActive(9);
    expect(list.activeIndex()).toBe(-1);
    list.setActive(2);
    list.clearActive();
    expect(list.active()).toBeUndefined();
  });
});
