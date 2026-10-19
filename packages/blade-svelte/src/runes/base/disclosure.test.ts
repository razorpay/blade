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

  it('dismiss and back respect dismissible, after onDismiss heard them', () => {
    let dismissible = false;
    const onDismiss = vi.fn();
    const d = createDisclosure({
      defaultOpen: true,
      dismissible: () => dismissible,
      onDismiss,
    });
    expect(d.dismiss('escape')).toBe(false);
    expect(d.back()).toBe(true);
    expect(d.isOpen()).toBe(true);
    expect(onDismiss.mock.calls.map(([event]) => event.source)).toEqual(['escape', 'back']);
    dismissible = true;
    expect(d.back()).toBe(true);
    expect(d.isOpen()).toBe(false);
    // Closed: no opinion — an enclosing layer stack applies its default.
    expect(d.back()).toBeUndefined();
  });

  it("the event's close ends a non-dismissible one, under the dismissal's source", () => {
    const onOpenChange = vi.fn();
    const d = createDisclosure({
      defaultOpen: true,
      dismissible: () => false,
      onDismiss: ({ close }) => close(),
      onOpenChange,
    });
    expect(d.dismiss('escape')).toBe(true);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(false, 'escape');
  });

  it('mirrors a controlled host', () => {
    let open = true;
    const d = createDisclosure({
      open: () => open,
      onOpenChange: (next) => {
        open = next;
      },
    });
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
    expect(d.dismiss('escape')).toBe(false);
  });
});
