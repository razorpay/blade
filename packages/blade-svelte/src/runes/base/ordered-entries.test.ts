import { describe, it, expect } from 'vitest';
import { createOrderedEntries } from './ordered-entries.svelte';

const entry = (element: HTMLElement): { getElement: () => HTMLElement } => ({
  getElement: () => element,
});

describe('createOrderedEntries', () => {
  it('reads entries back in document order, not mount order', () => {
    const list = document.createElement('ul');
    const [first, second] = [document.createElement('li'), document.createElement('li')];
    list.append(first, second);
    const entries = createOrderedEntries<ReturnType<typeof entry>>();
    const late = entry(second);
    const early = entry(first);
    entries.register(late);
    entries.register(early);
    expect(entries.ordered).toEqual([early, late]);
  });

  it('keeps mount order for nodes in different trees: they have no order', () => {
    const entries = createOrderedEntries<ReturnType<typeof entry>>();
    const one = entry(document.createElement('li'));
    const two = entry(document.createElement('li'));
    const three = entry(document.createElement('li'));
    entries.register(one);
    entries.register(two);
    entries.register(three);
    expect(entries.ordered).toEqual([one, two, three]);
  });
});
