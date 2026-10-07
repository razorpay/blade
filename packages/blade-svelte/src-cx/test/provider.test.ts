import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import ProviderHarness from './fixtures/ProviderHarness.svelte';
import { snapSize } from '../runes/defaults/defaults.svelte';

const inputBox = (input: HTMLElement): HTMLElement => input.parentElement!;
const checkboxBox = (input: HTMLElement): HTMLElement => input.nextElementSibling as HTMLElement;
const switchTrack = (input: HTMLElement): HTMLElement => input.nextElementSibling as HTMLElement;

describe('BladeProvider defaults', () => {
  afterEach(() => {
    delete (window as { matchMedia?: unknown }).matchMedia;
  });

  it('leaves Blade’s defaults alone without values', () => {
    const { getByTestId } = render(ProviderHarness);
    expect(getByTestId('button').className).toContain('min-h-9');
    expect(inputBox(getByTestId('input')).className).toContain('min-h-9');
  });

  it('an overall size reaches every sized control, snapped to its scale', () => {
    const { getByTestId } = render(ProviderHarness, { props: { size: 'large' } });
    expect(getByTestId('button').className).toContain('min-h-12');
    expect(inputBox(getByTestId('input')).className).toContain('min-h-12');
    expect(checkboxBox(getByTestId('checkbox')).className).toContain('w-5 h-5');
    // Switch has small and medium only (Figma): large snaps to medium, 36×20.
    expect(switchTrack(getByTestId('switch')).className).toContain('h-5 w-9');
  });

  it('leaves display components out of the overall size', () => {
    const plain = render(ProviderHarness);
    const badge = plain.getByTestId('badge').className;
    plain.unmount();
    const { getByTestId } = render(ProviderHarness, { props: { size: 'large' } });
    expect(getByTestId('badge').className).toBe(badge);
  });

  it('a component’s own entry beats the overall size, and its prop beats both', async () => {
    const { getByTestId, rerender } = render(ProviderHarness, {
      props: {
        size: 'large',
        defaults: { Checkbox: { size: 'small' }, Button: { color: 'neutral' } },
      },
    });
    expect(checkboxBox(getByTestId('checkbox')).className).toContain('w-3 h-3');
    const neutral = getByTestId('button').className;
    expect(neutral).toContain('min-h-12');
    await rerender({
      size: 'large',
      defaults: { Checkbox: { size: 'small' }, Button: { color: 'neutral' } },
      buttonSize: 'small',
    });
    expect(getByTestId('button').className).toContain('min-h-8');
  });

  it('the nearer provider wins, its overall size over an outer component entry', () => {
    const { getByTestId } = render(ProviderHarness, {
      props: { defaults: { Button: { size: 'large' } }, innerSize: 'small' },
    });
    expect(getByTestId('button').className).toContain('min-h-12');
    expect(getByTestId('inner-button').className).toContain('min-h-8');
  });

  it('an inner provider without values inherits the outer ones', () => {
    const { getByTestId } = render(ProviderHarness, { props: { size: 'large' } });
    expect(getByTestId('inner-button').className).toContain('min-h-12');
  });

  it('merges adapters over the enclosing ones', async () => {
    const outer = vi.fn();
    const inner = vi.fn();
    const { getByTestId } = render(ProviderHarness, {
      props: { adapters: { track: outer, captureError: vi.fn() }, innerAdapters: { track: inner } },
    });
    await fireEvent.click(getByTestId('probe'));
    expect(inner).toHaveBeenCalledWith('probe');
    expect(outer).not.toHaveBeenCalled();
  });
});

describe('snapSize', () => {
  it('snaps to the nearest size on the scale, the larger on a tie', () => {
    expect(snapSize('large', ['small', 'medium'])).toBe('medium');
    expect(snapSize('xsmall', ['medium', 'large'])).toBe('medium');
    expect(snapSize('medium', ['small', 'large'])).toBe('large');
    expect(snapSize('small', ['small', 'medium'])).toBe('small');
  });

});

describe('BladeProvider and the modal variant', () => {
  it('one default makes every Modal a sheet; BottomSheets stay sheets', async () => {
    const { default: Harness } = await import('./fixtures/ProviderModalHarness.svelte');
    const sheet = render(Harness, { props: { defaults: { Modal: { variant: 'sheet' } } } });
    expect(sheet.getByTestId('modal-drag-zone')).toBeTruthy();
    sheet.unmount();
    const modal = render(Harness, { props: { defaults: { Modal: { variant: 'modal' } } } });
    expect(modal.queryByTestId('modal-drag-zone')).toBeNull();
    // The Modal default does not reach a BottomSheet: it stays a sheet.
    expect(modal.getByTestId('sheet-drag-zone')).toBeTruthy();
  });
});

describe('BladeProvider and isDraggable', () => {
  it('sheets drag and drawers do not by default; provider defaults flip both', async () => {
    const { default: Harness } = await import('./fixtures/ProviderModalHarness.svelte');
    const plain = render(Harness);
    expect(plain.getByTestId('sheet-drag-zone')).toBeTruthy();
    expect(plain.queryByTestId('drawer-drag-zone')).toBeNull();
    plain.unmount();

    const flipped = render(Harness, {
      props: {
        defaults: { BottomSheet: { isDraggable: false }, Drawer: { isDraggable: true } },
      },
    });
    expect(flipped.queryByTestId('sheet-drag-zone')).toBeNull();
    // No handle without the drag.
    expect(flipped.getByTestId('sheet-chrome').querySelector('div[aria-hidden="true"]')).toBeNull();
    expect(flipped.getByTestId('drawer-drag-zone')).toBeTruthy();
  });
});
