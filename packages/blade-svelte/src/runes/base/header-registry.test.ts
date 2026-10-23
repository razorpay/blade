import { describe, it, expect } from 'vitest';
import { createHeaderRegistry } from './header-registry.svelte';

describe('createHeaderRegistry', () => {
  it('forgets a header once it unregisters', () => {
    const registry = createHeaderRegistry('sheet');
    const remove = registry.add({ title: true, subtitle: true });
    expect([registry.hasHeader, registry.hasTitle, registry.hasSubtitle]).toEqual([
      true,
      true,
      true,
    ]);
    remove();
    expect([registry.hasHeader, registry.hasTitle, registry.hasSubtitle]).toEqual([
      false,
      false,
      false,
    ]);
  });
});
