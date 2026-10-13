import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import TooltipBubbleNative from '../components/tooltip/TooltipBubble.native.svelte';
import { resolveTooltip } from '../components/tooltip';
import TooltipHarness from './fixtures/TooltipHarness.svelte';
import { expectClass } from './classes';

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
    x: left,
    y: top,
    toJSON: () => ({}),
  } as DOMRect;
}

// jsdom has no PointerEvent, so `fireEvent.pointerDown` drops pointerType.
function pointerDown(target: Element, pointerType: string): Promise<boolean> {
  const event = new Event('pointerdown', { bubbles: true });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  return fireEvent(target, event);
}

describe('Tooltip', () => {
  it('takes a title snippet, in the title box', async () => {
    const { getByTestId, getByRole } = render(TooltipHarness, { props: { richTitle: true } });
    await fireEvent.focusIn(getByTestId('trigger'));
    const bubble = getByRole('tooltip');
    expect(bubble.contains(getByTestId('rich-title'))).toBe(true);
    expect(bubble.textContent).toContain('Fee details');
  });

  it('the trigger snippet reads the open state; children replace content', async () => {
    const { getByTestId, getByRole } = render(TooltipHarness, { props: { rich: true } });
    const trigger = getByTestId('trigger');
    expect(trigger.dataset.open).toBe('false');
    await fireEvent.focusIn(trigger);
    expect(trigger.dataset.open).toBe('true');
    const bubble = getByRole('tooltip');
    expect(bubble.contains(getByTestId('rich'))).toBe(true);
    expect(bubble.textContent).not.toContain('Charged by your bank');
  });

  it('opens on keyboard focus, describes the trigger, closes on blur', async () => {
    const onOpenChange = vi.fn();
    const { getByTestId, getByRole, queryByRole } = render(TooltipHarness, {
      props: { onOpenChange },
    });
    const trigger = getByTestId('trigger');
    expectClass(trigger.parentElement, 'ml-2');

    await fireEvent.focusIn(trigger);
    const bubble = getByRole('tooltip');
    expect(bubble.textContent).toContain('Charged by your bank');
    expect(trigger.getAttribute('aria-describedby')).toBe(bubble.id);
    expect(onOpenChange).toHaveBeenLastCalledWith({ isOpen: true });

    await fireEvent.focusOut(trigger);
    await waitFor(() => expect(queryByRole('tooltip')).toBeNull());
    expect(trigger.hasAttribute('aria-describedby')).toBe(false);
    expect(onOpenChange).toHaveBeenLastCalledWith({ isOpen: false });
  });

  it('a tap toggles; a mouse click and a keyboard click do not', async () => {
    const { getByTestId, queryByRole } = render(TooltipHarness);
    const trigger = getByTestId('trigger');

    await pointerDown(trigger, 'mouse');
    await fireEvent.click(trigger, { detail: 1 });
    await fireEvent.click(trigger, { detail: 0 });
    expect(queryByRole('tooltip')).toBeNull();

    await pointerDown(trigger, 'touch');
    // Focus made by the tap is not what opens it…
    await fireEvent.focusIn(trigger);
    expect(queryByRole('tooltip')).toBeNull();
    // …the tap itself is, and the next one closes it.
    await fireEvent.click(trigger, { detail: 1 });
    expect(queryByRole('tooltip')).not.toBeNull();
    await fireEvent.click(trigger, { detail: 1 });
    await waitFor(() => expect(queryByRole('tooltip')).toBeNull());
  });

  it('closes on a press outside the trigger and the bubble', async () => {
    const { getByTestId, getByRole, queryByRole } = render(TooltipHarness);
    await fireEvent.focusIn(getByTestId('trigger'));
    await fireEvent.pointerDown(getByRole('tooltip'));
    expect(queryByRole('tooltip')).not.toBeNull();
    await fireEvent.pointerDown(getByTestId('elsewhere'));
    await waitFor(() => expect(queryByRole('tooltip')).toBeNull());
  });

  it('never opens while disabled', async () => {
    const { getByTestId, queryByRole } = render(TooltipHarness, {
      props: { isDisabled: true },
    });
    await fireEvent.focusIn(getByTestId('trigger'));
    expect(queryByRole('tooltip')).toBeNull();
  });

  it('renders into the LayerHost without making the page inert', async () => {
    const { getByTestId, getByRole } = render(TooltipHarness, {
      props: { withHost: true },
    });
    await fireEvent.focusIn(getByTestId('trigger'));
    expect(getByTestId('host').contains(getByRole('tooltip'))).toBe(true);
    expect(getByTestId('page').hasAttribute('inert')).toBe(false);
  });

  it('Escape closes the tooltip and leaves the modal beneath it open', async () => {
    const { getByTestId, queryByRole } = render(TooltipHarness, {
      props: { inModal: true },
    });
    await fireEvent.focusIn(getByTestId('trigger'));
    expect(queryByRole('tooltip')).not.toBeNull();

    await fireEvent.keyDown(document.body, { key: 'Escape' });
    await waitFor(() => expect(queryByRole('tooltip')).toBeNull());
    expect(queryByRole('dialog')).not.toBeNull();
  });

  it('places the measured bubble and flips when the wanted side lacks room', async () => {
    const measured = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(() => rect(100, 4, 40, 20));
    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(80);
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(30);

    const { getByTestId, getByRole } = render(TooltipHarness, {
      props: { placement: 'top' },
    });
    await fireEvent.focusIn(getByTestId('trigger'));
    const bubble = getByRole('tooltip');
    await waitFor(() => expect(bubble.dataset.side).toBe('bottom'));
    // Below the anchor (4 + 20) by the preset's gap, centred on it.
    expect(bubble.style.top).toBe('36px');
    expect(bubble.style.left).toBe('80px');
    expect(bubble.style.getPropertyValue('--tooltip-arrow')).toBe('40px');

    measured.mockRestore();
    vi.restoreAllMocks();
  });
});

describe('TooltipBubble.native', () => {
  it('renders in place at the static placement', () => {
    const { container } = render(TooltipBubbleNative, {
      props: {
        id: 'fee-tip',
        placement: 'bottom-start',
        classes: resolveTooltip({}),
        content: createRawSnippet(() => ({ render: () => '<b>Fee</b>' })),
      },
    });
    const bubble = container.firstElementChild as HTMLElement;
    // The id the trigger's aria-describedby names, and the role, as on web.
    expect(bubble.id).toBe('fee-tip');
    expect(bubble.getAttribute('role')).toBe('tooltip');
    expectClass(bubble, 'top-full');
    expectClass(bubble, 'left-0');
    expect(bubble.textContent).toContain('Fee');
  });
});

describe('Tooltip, as Blade', () => {
  it("draws Blade's bubble: 12px round and in, 200px at most, a title over the content", async () => {
    const { resolveTooltip } = await import('../components/tooltip/styles');
    const look = resolveTooltip({});
    expect(look.bubble).toContain('rounded-medium');
    expect(look.bubble).toContain('p-3');
    expect(look.bubble).toContain('max-w-[200px]');
    expect(look.title).toContain('font-semibold');
    expect(look.content).toContain('text-75');
    expect(look.arrowSide.top).toContain('w-[14px]');
    expect(look.gap).toBe(12);
  });
});
