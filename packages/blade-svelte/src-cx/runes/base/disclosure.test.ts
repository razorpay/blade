import { describe, it, expect, vi } from 'vitest';
import { createDisclosure } from './disclosure';

describe('createDisclosure', () => {
  it('opens, closes and reports the source', () => {
    const onOpenChange = vi.fn();
    const d = createDisclosure({ onOpenChange });
    d.toggle();
    d.close('escape');
    expect(onOpenChange.mock.calls).toEqual([
      [true, 'trigger'],
      [false, 'escape'],
    ]);
    expect(d.isOpen()).toBe(false);
    expect(d.isDismissible()).toBe(true);
  });

  it('dismiss and back respect dismissible', () => {
    let dismissible = false;
    const d = createDisclosure({
      defaultOpen: true,
      dismissible: () => dismissible,
    });
    expect(d.dismiss()).toBe(false);
    expect(d.back()).toBe(true);
    expect(d.isOpen()).toBe(true);
    dismissible = true;
    expect(d.back()).toBe(true);
    expect(d.isOpen()).toBe(false);
    // Closed: no opinion — an enclosing layer stack applies its default.
    expect(d.back()).toBeUndefined();
  });

  it('lets the content own back and mirrors a controlled host', () => {
    let open = true;
    const d = createDisclosure({
      open: () => open,
      onBack: () => false,
      onOpenChange: (next) => {
        open = next;
      },
    });
    expect(d.back()).toBe(false);
    expect(d.isOpen()).toBe(true);
    d.close();
    expect(open).toBe(false);
    expect(d.isOpen()).toBe(false);
  });

  it('reads dismissible live from the host', () => {
    let dismissible = true;
    const d = createDisclosure({
      defaultOpen: true,
      dismissible: () => dismissible,
    });
    expect(d.isDismissible()).toBe(true);
    dismissible = false;
    expect(d.isDismissible()).toBe(false);
    expect(d.dismiss()).toBe(false);
  });
});
