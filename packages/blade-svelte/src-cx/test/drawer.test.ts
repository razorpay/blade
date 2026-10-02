import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { resolveModal } from '../components/modal/styles';
import DrawerHarness from './fixtures/DrawerHarness.svelte';

// Blade-owned: Drawer ships whole, over Modal in its drawer variants. The modal's behaviour (model, layers, focus, back) is tested in
// modal.test.ts; this covers the spelling — the edge it docks to.
describe('Drawer (blade)', () => {
  it('renders nothing while closed and a right-docked modal once open', async () => {
    const { queryByTestId, getByTestId, getByRole } = render(DrawerHarness);
    expect(queryByTestId('drawer')).toBeNull();

    await fireEvent.click(getByTestId('trigger'));

    const panel = getByRole('dialog', { name: 'Filters' });
    expect(panel).toBe(getByTestId('drawer'));
    expect(panel.className).toContain('h-full');
    expect(panel.className).toContain('m:w-[420px]');
    expect(panel.className).toContain('group-data-[state=closed]:translate-x-full');
    expect(panel.parentElement?.className).toContain('justify-end');
    expect(queryByTestId('drawer-drag-zone')).toBeNull();
    expect(getByTestId('bound').textContent).toBe('open');
  });

  it('docks to the left edge as a left-drawer', () => {
    const { getByTestId } = render(DrawerHarness, {
      props: { isOpen: true, variant: 'left-drawer' },
    });
    const panel = getByTestId('drawer');
    expect(panel.parentElement?.className).toContain('justify-start');
    expect(panel.className).toContain('group-data-[state=closed]:-translate-x-full');
  });

  it('closes from its content and the binding follows', async () => {
    const onDismiss = vi.fn();
    const { getByTestId, queryByTestId } = render(DrawerHarness, {
      props: { isOpen: true, onDismiss },
    });
    await fireEvent.click(getByTestId('cancel'));
    expect(onDismiss).not.toHaveBeenCalled();
    expect(queryByTestId('drawer')).toBeNull();
    expect(getByTestId('bound').textContent).toBe('closed');
  });

  it('keeps the pace axis and appends the caller class last', () => {
    const { getByTestId } = render(DrawerHarness, {
      props: { isOpen: true, pace: 'snappy', className: '[z-index:70]' },
    });
    const panel = getByTestId('drawer');
    expect(panel.className).toContain(
      '[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]'
    );
    expect(panel.className.endsWith('[z-index:70]')).toBe(true);
  });

  it('a non-dismissible drawer reports the backdrop, stays open and has no close button', async () => {
    const onDismiss = vi.fn();
    const { getByTestId, queryByRole, queryByTestId } = render(DrawerHarness, {
      props: { isOpen: true, isDismissible: false, onDismiss },
    });
    await fireEvent.click(getByTestId('host-backdrop'));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ source: 'blur' })
    );
    expect(queryByTestId('drawer')).not.toBeNull();
    expect(queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it("both drawer variants are Blade's drawer, whatever the size", () => {
    for (const variant of ['drawer', 'left-drawer'] as const) {
      const classes = resolveModal({ variant, size: 'large' });
      expect(classes.panel).toContain('m:w-[420px]');
      expect(classes.panel).not.toContain('m:w-[1024px]');
      expect(classes.drag.isEnabled).toBe(false);
    }
  });
});

describe('Drawer isDraggable', () => {
  // jsdom has no PointerEvent: a plain event carrying what the handler reads.
  function pointer(type: string, clientX: number, timeStamp: number) {
    const event = new Event(type, { bubbles: true });
    Object.defineProperties(event, {
      clientX: { value: clientX },
      clientY: { value: 0 },
      timeStamp: { value: timeStamp },
      pointerId: { value: 1 },
    });
    return event;
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('is off by default: the header is plain content', () => {
    const { queryByTestId } = render(DrawerHarness, { props: { isOpen: true } });
    expect(queryByTestId('drawer-drag-zone')).toBeNull();
  });

  it.each([
    ['drawer', 1],
    ['left-drawer', -1],
  ] as const)('a %s follows the finger toward its edge and dismisses past half its width', async (variant, sign) => {
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(400);
    const onDismiss = vi.fn();
    const { getByTestId, getByText } = render(DrawerHarness, {
      props: { isOpen: true, isDraggable: true, variant, onDismiss },
    });
    const zone = getByTestId('drawer-drag-zone');
    // The header is the zone; a drawer has no handle.
    expect(zone.contains(getByText('Filters'))).toBe(true);
    expect(getByTestId('drawer-chrome').querySelector('div[aria-hidden="true"]')).toBeNull();

    await fireEvent(zone, pointer('pointerdown', 200, 0));
    await fireEvent(zone, pointer('pointermove', 200 + sign * 250, 2000));
    expect(getByTestId('drawer').style.transform).toBe(`translateX(${sign * 250}px)`);
    await fireEvent(zone, pointer('pointerup', 200 + sign * 250, 2010));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ source: 'drag' })
    );
  });

  it('a pull the other way, into the page, does not move it', async () => {
    const { getByTestId } = render(DrawerHarness, {
      props: { isOpen: true, isDraggable: true },
    });
    const zone = getByTestId('drawer-drag-zone');
    await fireEvent(zone, pointer('pointerdown', 200, 0));
    await fireEvent(zone, pointer('pointermove', 50, 2000));
    expect(getByTestId('drawer').style.transform).toBe('translateX(0px)');
  });
});
