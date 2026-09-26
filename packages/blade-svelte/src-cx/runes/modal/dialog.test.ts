import { describe, it, expect, vi } from 'vitest';
import { createDialogModel } from './dialog.svelte';

describe('close and dismiss', () => {
  it('is born open; cross always closes and reports its source once', () => {
    const onClose = vi.fn();
    const onCloseLogged = vi.fn();
    const dialog = createDialogModel({ onClose, hooks: { onCloseLogged } });
    expect(dialog.isOpen()).toBe(true);

    dialog.close('cross');
    expect(dialog.isOpen()).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledWith('cross');
    expect(onCloseLogged).toHaveBeenCalledWith('cross');

    dialog.close('cross');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('cross closes even a non-dismissable dialog; dismiss does not', () => {
    const onClose = vi.fn();
    const dialog = createDialogModel({ allowDismiss: () => false, onClose });
    expect(dialog.dismiss('blur')).toBe(false);
    expect(dialog.isOpen()).toBe(true);
    dialog.close('cross');
    expect(dialog.isOpen()).toBe(false);
  });

  it('a dismissable dialog closes on backdrop and Escape sources', () => {
    const onClose = vi.fn();
    const dialog = createDialogModel({ onClose });
    expect(dialog.dismiss('escape')).toBe(true);
    expect(onClose).toHaveBeenCalledWith('escape');
    expect(dialog.dismiss('escape')).toBe(false);
  });
});

describe('back', () => {
  it('closes a dismissable dialog and stays handled', () => {
    const onClose = vi.fn();
    const dialog = createDialogModel({ onClose });
    expect(dialog.back()).toBe(true);
    expect(dialog.isOpen()).toBe(false);
    expect(onClose).toHaveBeenCalledWith('back');
    // Closed: no opinion — the enclosing stack applies its default.
    expect(dialog.back()).toBeUndefined();
  });

  it('a non-dismissable dialog swallows back without closing', () => {
    const onClose = vi.fn();
    const dialog = createDialogModel({ allowDismiss: () => false, onClose });
    expect(dialog.back()).toBe(true);
    expect(dialog.isOpen()).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('content owning back keeps the dialog open', () => {
    const dialog = createDialogModel({ preventBack: () => true });
    expect(dialog.back()).toBe(true);
    expect(dialog.isOpen()).toBe(true);
  });

  it('content explicitly ceding closes even a non-dismissable dialog', () => {
    const onClose = vi.fn();
    const dialog = createDialogModel({
      allowDismiss: () => false,
      preventBack: () => false,
      onClose,
    });
    expect(dialog.back()).toBe(true);
    expect(dialog.isOpen()).toBe(false);
    expect(onClose).toHaveBeenCalledWith('back');
  });
});

describe('allowDismiss', () => {
  it('is read live from the host on every dismiss', () => {
    let allowDismiss = true;
    const dialog = createDialogModel({ allowDismiss: () => allowDismiss });
    allowDismiss = false;
    expect(dialog.dismiss()).toBe(false);
    expect(dialog.isOpen()).toBe(true);
    allowDismiss = true;
    expect(dialog.dismiss()).toBe(true);
  });
});
