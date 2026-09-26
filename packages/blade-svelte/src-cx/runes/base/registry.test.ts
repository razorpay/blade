import { describe, it, expect } from 'vitest';
import { createRegistry } from './registry.svelte';

describe('createRegistry', () => {
  it('keeps registration order and drops unregistered items', () => {
    const r = createRegistry<string>();
    const offA = r.register('a');
    expect(r.items).toEqual(['a']);
    r.register('b');
    expect(r.items).toEqual(['a', 'b']);
    expect(r.indexOf('b')).toBe(1);
    expect(r.at(0)).toBe('a');
    offA();
    expect(r.items).toEqual(['b']);
    expect(r.size()).toBe(1);
  });

  it('inserts at the index hint so a remounting child keeps its position', () => {
    const r = createRegistry<string>();
    r.register('a');
    const offB = r.register('b');
    r.register('c');
    offB();
    r.register('b', 1);
    expect(r.items).toEqual(['a', 'b', 'c']);
  });

  it('appends when the hint is out of range', () => {
    const r = createRegistry<string>();
    r.register('a');
    r.register('b', 5);
    r.register('c', -1);
    expect(r.items).toEqual(['a', 'b', 'c']);
  });
});
