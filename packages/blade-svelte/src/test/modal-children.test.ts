import { afterEach, describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import Harness from './fixtures/ModalChildrenHarness.svelte';
import {
  resolveBottomSheetBody,
  resolveBottomSheetHeader,
  resolveDrawerFooter,
  resolveDrawerHeader,
  resolveModalBody,
  resolveModalHeader,
} from '../components/modal-children';
import { expectClass } from './classes';

function pointer(type: string, clientY: number, timeStamp: number): Event {
  const event = new Event(type, { bubbles: true });
  Object.defineProperties(event, {
    clientY: { value: clientY },
    timeStamp: { value: timeStamp },
    pointerId: { value: 1 },
  });
  return event;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Modal, BottomSheet and Drawer parts', () => {
  it('a ModalHeader names and describes the dialog, and leaves room for its close', async () => {
    const { getByTestId, getByRole } = render(Harness, { props: { which: 'modal' } });
    const dialog = await waitFor(() => getByRole('dialog', { name: 'Remove card?' }));
    expect(document.getElementById(dialog.getAttribute('aria-describedby')!)?.textContent).toBe(
      'Ending 1111',
    );
    expectClass(getByTestId('header').firstElementChild, 'pr-11');
    // The composed header replaces the overlay's empty one.
    expect(getByTestId('overlay').querySelector('.h-2.shrink-0')).toBeNull();
    expectClass(getByTestId('body'), 'p-5');
    expectClass(getByTestId('footer'), 'border-t-thin');
  });

  it('without a header the overlay keeps its empty one and its own label', async () => {
    const { getByRole, getByTestId } = render(Harness, { props: { which: 'modal-no-header' } });
    const dialog = await waitFor(() => getByRole('dialog', { name: 'Notice' }));
    expect(dialog.hasAttribute('aria-labelledby')).toBe(false);
    expect(getByTestId('overlay').querySelector('.h-2.shrink-0')).not.toBeNull();
  });

  it('a BottomSheetHeader sits under the handle, drags the sheet and has a back button', async () => {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
    const onBack = vi.fn();
    const onDismiss = vi.fn();
    const { getByTestId, getByRole } = render(Harness, {
      props: { which: 'sheet', onBack, onDismiss },
    });
    const header = await waitFor(() => getByTestId('header'));
    expectClass(header, 'pt-3');
    expectClass(header, 'touch-none');
    await fireEvent.click(getByRole('button', { name: 'Back' }));
    expect(onBack).toHaveBeenCalledTimes(1);
    await fireEvent(header, pointer('pointerdown', 100, 0));
    await fireEvent(header, pointer('pointermove', 350, 2000));
    await fireEvent(header, pointer('pointerup', 350, 2010));
    expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ source: 'drag' }));
  });

  it('a header built from the classes and useModalHeader is wired as the part is', async () => {
    const { getByTestId, getByRole } = render(Harness, { props: { which: 'custom' } });
    await waitFor(() => getByRole('dialog', { name: 'My own header' }));
    const header = getByTestId('custom-header');
    expectClass(header, 'touch-none');
    expectClass(header.firstElementChild, 'pr-9');
  });

  it('outside an overlay a part is its classes, with nothing wired', () => {
    const { getByTestId, getByText } = render(Harness, { props: { which: 'standalone' } });
    expectClass(getByTestId('header'), 'px-5 pt-5 pb-4');
    expect(getByText('On its own').hasAttribute('id')).toBe(false);
  });

  it('the classes are exported apart, per part and per look', () => {
    expect(resolveModalHeader().closeClearance).toBe('pr-11');
    expect(resolveBottomSheetHeader({ hasHandle: false }).root).toContain('p-4');
    expect(resolveDrawerHeader({ color: 'positive', showDivider: true }).root).toContain(
      'bg-feedback-positive-subtle',
    );
    expect(resolveModalBody({ padding: 'spacing.0' }).root).not.toContain('p-5');
    expect(resolveBottomSheetBody().root).toContain('p-4');
    expect(resolveDrawerFooter({ showDivider: false }).root).not.toContain('border-t-thin');
  });
});
