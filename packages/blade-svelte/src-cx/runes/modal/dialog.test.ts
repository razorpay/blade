import { describe, it, expect, vi } from 'vitest';
import { createDialogModel } from './dialog.svelte';

describe('close and dismiss', () => {
  it('is born open; close always closes, once, without a dismissal', () => {
    const onClose = vi.fn();
    const onDismiss = vi.fn();
    const onCloseLogged = vi.fn();
    const dialog = createDialogModel({
      isDismissible: () => false,
      onDismiss,
      onClose,
      hooks: { onCloseLogged },
    });
    expect(dialog.isOpen()).toBe(true);

    dialog.close();
    expect(dialog.isOpen()).toBe(false);
    expect(onClose).toHaveBeenCalledExactlyOnceWith('programmatic');
    expect(onCloseLogged).toHaveBeenCalledWith('programmatic');
    expect(onDismiss).not.toHaveBeenCalled();

    dialog.close();
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('a dismissible dialog reports the dismissal, then closes with its source', () => {
    const order: string[] = [];
    const dialog = createDialogModel({
      onDismiss: ({ source }) => order.push(`dismiss:${source}`),
      onClose: (source) => order.push(`close:${source}`),
    });
    expect(dialog.dismiss('escape')).toBe(true);
    expect(order).toEqual(['dismiss:escape', 'close:escape']);
    // Closed: a later dismissal reaches nobody.
    expect(dialog.dismiss('escape')).toBe(false);
    expect(order).toHaveLength(2);
  });

  it('a non-dismissible dialog reports the dismissal and stays open', () => {
    const onClose = vi.fn();
    const onDismiss = vi.fn();
    const dialog = createDialogModel({
      isDismissible: () => false,
      onDismiss,
      onClose,
    });
    expect(dialog.dismiss('blur')).toBe(false);
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ source: 'blur' }));
    expect(dialog.isOpen()).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("the event's close ends a non-dismissible dialog, tracked under the dismissal's source", () => {
    const onClose = vi.fn();
    const dialog = createDialogModel({
      isDismissible: () => false,
      onDismiss: ({ close }) => close(),
      onClose,
    });
    expect(dialog.dismiss('drag')).toBe(true);
    expect(onClose).toHaveBeenCalledExactlyOnceWith('drag');
  });

  it('a dismissible dialog closes once even when onDismiss closes it too', () => {
    const onClose = vi.fn();
    const dialog = createDialogModel({
      onDismiss: ({ close }) => close(),
      onClose,
    });
    expect(dialog.dismiss('cross')).toBe(true);
    expect(onClose).toHaveBeenCalledExactlyOnceWith('cross');
  });

  it('reads isDismissible live on every dismissal', () => {
    let isDismissible = false;
    const dialog = createDialogModel({ isDismissible: () => isDismissible });
    expect(dialog.dismiss('blur')).toBe(false);
    expect(dialog.isOpen()).toBe(true);
    isDismissible = true;
    expect(dialog.dismiss('blur')).toBe(true);
  });
});

describe('back', () => {
  it('is a dismissal: a dismissible dialog closes and stays handled', () => {
    const onClose = vi.fn();
    const onDismiss = vi.fn();
    const dialog = createDialogModel({ onDismiss, onClose });
    expect(dialog.back()).toBe(true);
    expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ source: 'back' }));
    expect(dialog.isOpen()).toBe(false);
    expect(onClose).toHaveBeenCalledWith('back');
    // Closed: no opinion — the enclosing stack applies its default.
    expect(dialog.back()).toBeUndefined();
  });

  it('a non-dismissible dialog reports back and swallows it, still open', () => {
    const onDismiss = vi.fn();
    const dialog = createDialogModel({ isDismissible: () => false, onDismiss });
    expect(dialog.back()).toBe(true);
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(dialog.isOpen()).toBe(true);
  });
});
