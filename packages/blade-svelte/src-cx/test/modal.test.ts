import { tick } from 'svelte';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { fireEvent, render } from '@testing-library/svelte';
import { globalLayers } from '../runes/layer/layers';
import ModalHarness from './fixtures/ModalHarness.svelte';
import { expectClass } from './classes';
import type { RenderResult } from '@testing-library/svelte';
import type { Mock } from 'vitest';

const escape = (): Promise<boolean> => fireEvent.keyDown(document, { key: 'Escape' });

describe('Modal', () => {
  it('renders nothing while closed and a named modal dialog once open', async () => {
    const { queryByTestId, getByTestId, getByRole } = render(ModalHarness);
    expect(queryByTestId('modal')).toBeNull();

    await fireEvent.click(getByTestId('trigger'));

    const modal = getByRole('dialog', { name: 'Remove card' });
    expect(modal).toBe(getByTestId('modal'));
    expect(modal.getAttribute('aria-modal')).toBe('true');
    // Classes come from the component's own styles.
    expectClass(modal, 'bg-popup-gray-subtle');
    expect(getByRole('button', { name: 'Close' })).toBeTruthy();
  });

  it('accessibilityLabel names the modal when there is no title', () => {
    const { getByRole } = render(ModalHarness, {
      props: { isOpen: true, title: '', accessibilityLabel: 'Confirm' },
    });
    expect(getByRole('dialog', { name: 'Confirm' })).toBeTruthy();
  });

  it('title takes a snippet and still names the modal', () => {
    const { getByRole } = render(ModalHarness, {
      props: { isOpen: true, withTitleSnippet: true },
    });
    expect(getByRole('dialog', { name: 'Remove this card' })).toBeTruthy();
  });

  it('header receives the drawn title and subtitle and places them; the title still names the modal', () => {
    const { getByRole, getByTestId, getByText } = render(ModalHarness, {
      props: { isOpen: true, withHeader: true, subtitle: 'Visa' },
    });
    const modal = getByRole('dialog', { name: 'Remove card' });
    const row = getByTestId('title-row');
    // The header put the title between a back button and a badge.
    const title = getByText('Remove card');
    expect(title.parentElement).toBe(row);
    expect(title.previousElementSibling).toBe(getByTestId('header-back'));
    expect(title.nextElementSibling).toBe(getByTestId('badge-beside'));
    // Figma's Heading/SmallSemibold, 18/24.
    expectClass(title, 'font-heading font-blade-semibold text-300 leading-300');
    // The subtitle keeps its look and still describes the modal.
    const subtitle = getByText('Visa');
    expectClass(subtitle, 'text-surface-gray-muted');
    expect(modal.getAttribute('aria-describedby')).toBe(subtitle.id);
    expectClass(row.closest('.border-b-thin'), 'px-5 pt-5 pb-4');
  });

  it('without header, title and subtitle render on their own', () => {
    const { getByText } = render(ModalHarness, {
      props: { isOpen: true, subtitle: 'Visa' },
    });
    const title = getByText('Remove card');
    expect(title.nextElementSibling).toBe(getByText('Visa'));
  });

  it('body gets the padded container; children render raw and win over body', () => {
    const asBody = render(ModalHarness, {
      props: { isOpen: true, content: 'body' },
    });
    const wrapped = asBody.getByTestId('body-first').parentElement;
    expect(wrapped).not.toBe(asBody.getByTestId('modal'));
    expectClass(wrapped, 'p-5');
    asBody.unmount();

    const both = render(ModalHarness, {
      props: { isOpen: true, content: 'both' },
    });
    // Raw: straight in the panel's clipping content box.
    expect(both.getByTestId('first').parentElement).toBe(both.getByTestId('modal-content'));
    expect(both.queryByTestId('body-first')).toBeNull();
  });

  it('the close button exists only when it has a name', () => {
    const { queryByRole } = render(ModalHarness, {
      props: { isOpen: true, closeLabel: '' },
    });
    expect(queryByRole('button', { name: 'Close' })).toBeNull();
  });

  it('resolves style props and appends the caller class last', () => {
    const { getByTestId } = render(ModalHarness, {
      props: { isOpen: true, variant: 'sheet', className: '[z-index:70]' },
    });
    const panel = getByTestId('modal');
    expectClass(panel.parentElement, 'items-end');
    expect(panel.className.endsWith('[z-index:70]')).toBe(true);
  });

  it('the drawer variant parks off the right edge, at the pace asked for', () => {
    const { getByTestId } = render(ModalHarness, {
      props: { isOpen: true, variant: 'drawer', pace: 'snappy' },
    });
    const panel = getByTestId('modal');
    expect(panel.parentElement?.className).toContain('justify-end');
    expect(panel.className).toContain('group-data-[state=closed]:translate-x-full');
    expect(panel.className).toContain('[transition-timing-function:cubic-bezier(0.16,1,0.3,1)]');
    expect(panel.className).not.toContain('ease-entrance');
  });

  it('size: a fixed desktop column by default, the host width as full', async () => {
    const { getByTestId, rerender } = render(ModalHarness, {
      props: { isOpen: true },
    });
    expect(getByTestId('modal').className).toContain('d:w-[400px]');

    await rerender({ isOpen: true, size: 'full' });
    const panel = getByTestId('modal');
    expect(panel.className).toContain('w-full');
    expect(panel.className).not.toMatch(/m:w-/);
  });

  it.each([
    ['the close button', 'cross'],
    ['the backdrop', 'blur'],
    ['Escape', 'escape'],
  ])('%s reports %s, then it closes', async (_via, source) => {
    const onDismiss = vi.fn();
    const { getByTestId, getByRole, queryByTestId } = render(ModalHarness, {
      props: { withHost: true, onDismiss },
    });
    await fireEvent.click(getByTestId('trigger'));

    if (source === 'cross') {
      await fireEvent.click(getByRole('button', { name: 'Close' }));
    } else if (source === 'blur') {
      // The scrim is the host's, one under every open modal.
      await fireEvent.click(getByTestId('host-backdrop'));
    } else {
      await escape();
    }

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ source }));
    expect(queryByTestId('modal')).toBeNull();
  });

  it('a dismissible modal closes even when onDismiss does nothing', async () => {
    const { getByTestId, queryByTestId } = render(ModalHarness, {
      props: {
        withHost: true,
        isOpen: true,
        onDismiss: () => {
          // noop
        },
      },
    });
    await fireEvent.click(getByTestId('host-backdrop'));
    expect(queryByTestId('modal')).toBeNull();
  });

  it.each([
    ['children', 'cancel'],
    ['body', 'body-cancel'],
    ['header', 'header-back'],
    ['footer', 'last'],
  ])('close from the %s snippet closes it without a dismissal', async (_slot, id) => {
    const onDismiss = vi.fn();
    const { getByTestId, queryByTestId } = render(ModalHarness, {
      props: {
        isOpen: true,
        onDismiss,
        withHeader: true,
        content: id === 'body-cancel' ? 'body' : 'children',
      },
    });
    await fireEvent.click(getByTestId(id));
    expect(queryByTestId('modal')).toBeNull();
    expect(onDismiss).not.toHaveBeenCalled();
  });

  it('a non-dismissible modal reports every dismissal and closes only on close', async () => {
    const onDismiss = vi.fn();
    const { getByTestId, queryByRole, queryByTestId } = render(ModalHarness, {
      props: { withHost: true, isDismissible: false, onDismiss },
    });
    await fireEvent.click(getByTestId('trigger'));

    await fireEvent.click(getByTestId('host-backdrop'));
    await escape();
    expect(onDismiss).toHaveBeenCalledTimes(2);
    expect(onDismiss).toHaveBeenNthCalledWith(1, expect.objectContaining({ source: 'blur' }));
    expect(onDismiss).toHaveBeenNthCalledWith(2, expect.objectContaining({ source: 'escape' }));
    expect(queryByTestId('modal')).not.toBeNull();
    // Blade: the close button shows only while it is dismissible.
    expect(queryByRole('button', { name: 'Close', hidden: false })).toBeNull();

    // The owner decides: the event's close ends it.
    onDismiss.mock.calls[1][0].close();
    await tick();
    expect(queryByTestId('modal')).toBeNull();
    expect(getByTestId('trigger')).toBeTruthy();
  });

  it('subtitle: a muted line under the title that describes the dialog', () => {
    const { getByRole, getByText } = render(ModalHarness, {
      props: { isOpen: true, subtitle: 'Ending 4242' },
    });
    const dialog = getByRole('dialog', { name: 'Remove card' });
    const line = getByText('Ending 4242');
    expect(line.className).toContain('text-surface-gray-muted');
    expect(dialog.getAttribute('aria-describedby')).toBe(line.id);
    // Under the title, inside the same block.
    expect(line.previousElementSibling?.textContent).toBe('Remove card');
  });

  it('a subtitle alone still draws the header', () => {
    const { getByText, getByRole } = render(ModalHarness, {
      props: { isOpen: true, title: '', accessibilityLabel: 'Card', subtitle: 'Ending 4242' },
    });
    expect(getByText('Ending 4242')).toBeTruthy();
    expect(getByRole('dialog', { name: 'Card' }).hasAttribute('aria-describedby')).toBe(true);
  });

  it("chrome: a box on the panel, outside its clipping content, holding the close and the caller's items", async () => {
    const { getByTestId, getByRole, queryByTestId } = render(ModalHarness, {
      props: { isOpen: true, withChrome: true },
    });
    const panel = getByTestId('modal');
    const chrome = getByTestId('modal-chrome');
    const content = getByTestId('modal-content');
    expect(chrome.parentElement).toBe(panel);
    expect(content.contains(chrome)).toBe(false);
    expectClass(chrome, 'h-0');
    expectClass(content, 'overflow-hidden');
    expect(panel.className).not.toMatch(/(^|\s)overflow-hidden(\s|$)/);

    // The close button and the caller's items share it, close first.
    const close = getByRole('button', { name: 'Close' });
    expect(chrome.contains(close)).toBe(true);
    expect(chrome.contains(getByTestId('badge'))).toBe(true);
    expect(close.compareDocumentPosition(getByTestId('badge'))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );

    await fireEvent.click(getByTestId('chrome-close'));
    expect(queryByTestId('modal')).toBeNull();
  });

  it('the close button floats when there is no header, and is gone when not dismissible', async () => {
    const { getByRole, getByTestId, rerender, queryByRole } = render(ModalHarness, {
      props: { isOpen: true, title: '', accessibilityLabel: 'Card' },
    });
    expectClass(getByRole('button', { name: 'Close' }), 'rounded-max');
    expect(getByTestId('modal-chrome').contains(getByRole('button', { name: 'Close' }))).toBe(true);

    await rerender({ isOpen: true, title: 'Remove card', isDismissible: false, withChrome: true });
    expect(queryByRole('button', { name: 'Close' })).toBeNull();
    // The caller's chrome stays.
    expect(getByTestId('badge')).toBeTruthy();
  });

  it('the header row leaves room for the close button only while it shows', async () => {
    const { getByText, rerender } = render(ModalHarness, { props: { isOpen: true } });
    const block = (): HTMLElement => getByText('Remove card').parentElement!.parentElement!;
    expectClass(block(), 'pr-11');
    await rerender({ isOpen: true, isDismissible: false });
    expect(block().className).not.toContain('pr-11');
  });

  it('a close made by the host does not report a dismiss', async () => {
    const onDismiss = vi.fn();
    const { queryByTestId, rerender } = render(ModalHarness, {
      props: { isOpen: true, onDismiss },
    });

    await rerender({ isOpen: false, onDismiss });

    expect(queryByTestId('modal')).toBeNull();
    expect(onDismiss).not.toHaveBeenCalled();
    // The layer is gone too: Escape and back find nothing.
    expect(globalLayers.back()).toBe(false);
  });

  it('moves focus in, wraps Tab at both ends and returns focus on close', async () => {
    const { getByTestId, getByRole } = render(ModalHarness);
    const trigger = getByTestId('trigger');
    trigger.focus();
    await fireEvent.click(trigger);

    const modal = getByTestId('modal');
    expect(document.activeElement).toBe(modal);

    const close = getByRole('button', { name: 'Close' });
    const last = getByTestId('last');
    last.focus();
    await fireEvent.keyDown(last, { key: 'Tab' });
    expect(document.activeElement).toBe(close);

    await fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);

    await escape();
    expect(document.activeElement).toBe(trigger);
  });
});

describe('Modal presence', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (Element.prototype as { animate?: unknown }).animate;
  });

  it('stays mounted with data-state=closed until the style transition ends', async () => {
    // jsdom computes no transitions and has no WAAPI: report the styles'
    // 300ms and hand Svelte a controllable animation clock.
    const real = window.getComputedStyle.bind(window);
    vi.spyOn(window, 'getComputedStyle').mockImplementation((element) =>
      Object.assign(Object.create(real(element)), {
        transitionDuration: '0.3s',
        transitionDelay: '0s',
      }),
    );
    const running: Array<{ onfinish: () => void }> = [];
    (Element.prototype as { animate?: unknown }).animate = () => {
      const animation = {
        onfinish: () => {
          // noop
        },
        cancel: () => {
          // noop
        },
        currentTime: 0,
      };
      running.push(animation);
      return animation;
    };
    const finish = async (): Promise<void> => {
      while (running.length) {
        running.shift()?.onfinish();
        // eslint-disable-next-line no-await-in-loop -- one animation settles at a time
        await Promise.resolve();
      }
    };

    const { getByTestId, queryByTestId } = render(ModalHarness);
    await fireEvent.click(getByTestId('trigger'));
    const root = getByTestId('modal').parentElement!;
    expect(root.dataset.state).toBe('closed');
    await new Promise((resolve) => requestAnimationFrame(resolve));
    expect(root.dataset.state).toBe('open');
    await finish();

    await escape();
    // Closed for the model and the host, but still in the DOM, animating.
    expect(queryByTestId('modal')).not.toBeNull();
    expect(root.dataset.state).toBe('closed');

    await finish();
    expect(queryByTestId('modal')).toBeNull();
  });
});

// The sheet variant, and the drag it switches on, are blade's.
describe('Modal variant="sheet"', () => {
  // jsdom has no PointerEvent: a plain event carrying what the handler reads.
  function pointer(type: string, clientY: number, timeStamp: number): Event {
    const event = new Event(type, { bubbles: true });
    Object.defineProperties(event, {
      clientY: { value: clientY },
      timeStamp: { value: timeStamp },
      pointerId: { value: 1 },
    });
    return event;
  }

  function sheet(
    props: Record<string, unknown> = {},
  ): RenderResult<typeof ModalHarness> & { onDismiss: Mock } {
    vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockReturnValue(400);
    const onDismiss = vi.fn();
    const queries = render(ModalHarness, {
      props: { isOpen: true, variant: 'sheet', onDismiss, ...props },
    });
    return { ...queries, onDismiss };
  }

  it('sits at the bottom with a handle; the modal variant has none', () => {
    const { getByTestId, unmount, container } = sheet();
    expectClass(getByTestId('modal'), 'rounded-tl-large');
    expectClass(getByTestId('modal-drag-zone'), 'touch-none');
    // The handle is drawn in the chrome, over the zone's strip.
    const handle = getByTestId('modal-chrome').querySelector('div[aria-hidden="true"]');
    expect(handle?.className).toContain('pointer-events-none');
    expect(container.ownerDocument.body.contains(handle)).toBe(true);
    unmount();
    vi.restoreAllMocks();

    const plain = render(ModalHarness, { props: { isOpen: true } });
    expect(plain.queryByTestId('modal-drag-zone')).toBeNull();
  });

  it('follows the finger, then dismisses with source drag past half its height', async () => {
    const { getByTestId, onDismiss } = sheet();
    const handle = getByTestId('modal-drag-zone');
    const panel = getByTestId('modal');

    await fireEvent(handle, pointer('pointerdown', 100, 0));
    await fireEvent(handle, pointer('pointermove', 350, 2000));
    expect(panel.style.getPropertyValue('--blade-translate-y')).toBe('250px');
    expect(panel.style.transition).toBe('none');

    await fireEvent(handle, pointer('pointerup', 350, 2010));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ source: 'drag' }));
    // Inline styles are gone: the component's own transition carries it out.
    expect(panel.style.getPropertyValue('--blade-translate-y')).toBe('');
    vi.restoreAllMocks();
  });

  it('the close button sits in the chrome, outside the drag zone: a press is a click', async () => {
    const { getByTestId, getByLabelText, onDismiss } = sheet();
    const close = getByLabelText('Close');
    expect(getByTestId('modal-chrome').contains(close)).toBe(true);
    expect(getByTestId('modal-drag-zone').contains(close)).toBe(false);
    await fireEvent(close, pointer('pointerdown', 100, 0));
    expect(getByTestId('modal').style.getPropertyValue('--blade-translate-y')).toBe('');
    await fireEvent(close, pointer('pointerup', 100, 0));
    await fireEvent.click(close);
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ source: 'cross' }));
    vi.restoreAllMocks();
  });

  it('the header is part of the drag zone', async () => {
    const { getByTestId, getByText, onDismiss } = sheet();
    const zone = getByTestId('modal-drag-zone');
    const title = getByText('Remove card');
    expect(zone.contains(title)).toBe(true);

    await fireEvent(title, pointer('pointerdown', 100, 0));
    await fireEvent(title, pointer('pointermove', 350, 2000));
    expect(getByTestId('modal').style.getPropertyValue('--blade-translate-y')).toBe('250px');
    await fireEvent(title, pointer('pointerup', 350, 2010));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ source: 'drag' }));
    vi.restoreAllMocks();
  });

  it('a short drag settles back and dismisses nothing', async () => {
    const { getByTestId, onDismiss } = sheet();
    const handle = getByTestId('modal-drag-zone');
    await fireEvent(handle, pointer('pointerdown', 100, 0));
    await fireEvent(handle, pointer('pointermove', 160, 2000));
    await fireEvent(handle, pointer('pointerup', 160, 2010));
    expect(onDismiss).not.toHaveBeenCalled();
    expect(getByTestId('modal').style.getPropertyValue('--blade-translate-y')).toBe('');
    vi.restoreAllMocks();
  });

  it('thins the host scrim as it follows the finger, and hands it back on release', async () => {
    const { getByTestId } = sheet({ withHost: true });
    const zone = getByTestId('modal-drag-zone');
    const scrim = getByTestId('host-backdrop');
    await fireEvent(zone, pointer('pointerdown', 100, 0));
    await fireEvent(zone, pointer('pointermove', 200, 2000));
    expect(scrim.style.opacity).toBe('0.75');
    expect(scrim.style.transition).toBe('none');
    await fireEvent(zone, pointer('pointerup', 200, 2010));
    expect(scrim.style.opacity).toBe('');
    expect(scrim.style.transition).toBe('');
    vi.restoreAllMocks();
  });

  it('resists and stays open when it is not dismissible', async () => {
    const { getByTestId, onDismiss } = sheet({ isDismissible: false });
    const handle = getByTestId('modal-drag-zone');
    await fireEvent(handle, pointer('pointerdown', 100, 0));
    await fireEvent(handle, pointer('pointermove', 500, 2000));
    expect(getByTestId('modal').style.getPropertyValue('--blade-translate-y')).toBe('100px');
    await fireEvent(handle, pointer('pointerup', 500, 2010));
    expect(onDismiss).not.toHaveBeenCalled();
    vi.restoreAllMocks();
  });

  it('a fling on a non-dismissible sheet asks, and it settles back open', async () => {
    const { getByTestId, onDismiss } = sheet({ isDismissible: false });
    const handle = getByTestId('modal-drag-zone');
    await fireEvent(handle, pointer('pointerdown', 100, 0));
    await fireEvent(handle, pointer('pointermove', 500, 50));
    await fireEvent(handle, pointer('pointerup', 500, 60));
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ source: 'drag' }));
    expect(getByTestId('modal').style.getPropertyValue('--blade-translate-y')).toBe('');
    vi.restoreAllMocks();
  });
});

describe('Modal layers', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Escape reaches only the top modal, and the lower one goes inert', async () => {
    const onDismiss = vi.fn();
    const onNestedDismiss = vi.fn();
    const { getByTestId, queryByTestId } = render(ModalHarness, {
      props: { isOpen: true, nestedOpen: true, onDismiss, onNestedDismiss },
    });
    const lower = getByTestId('modal').parentElement!;
    expect(lower.inert).toBe(true);

    await escape();
    expect(onNestedDismiss).toHaveBeenCalledWith(expect.objectContaining({ source: 'escape' }));
    expect(onDismiss).not.toHaveBeenCalled();
    expect(queryByTestId('nested')).toBeNull();
    expect(lower.inert).toBe(false);

    await escape();
    expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ source: 'escape' }));
  });

  it('back is a dismissal: handled while open, closing only when dismissible', async () => {
    const onDismiss = vi.fn();
    const { queryByTestId, rerender } = render(ModalHarness, {
      props: { isOpen: true, isDismissible: false, onDismiss },
    });

    // Not dismissible: reported, handled, still open.
    expect(globalLayers.back()).toBe(true);
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ source: 'back' }));
    expect(queryByTestId('modal')).not.toBeNull();

    // Dismissible: reported, then it closes.
    await rerender({ isOpen: true, isDismissible: true, onDismiss });
    expect(globalLayers.back()).toBe(true);
    await tick();
    expect(onDismiss).toHaveBeenCalledTimes(2);
    expect(queryByTestId('modal')).toBeNull();
    // Closed: nothing left to answer.
    expect(globalLayers.back()).toBe(false);
  });

  it('renders into the LayerHost and makes the rest of the frame inert', async () => {
    const { getByTestId } = render(ModalHarness, {
      props: { withHost: true },
    });
    const host = getByTestId('host');
    const page = getByTestId('page');
    expect(page.hasAttribute('inert')).toBe(false);

    await fireEvent.click(getByTestId('trigger'));
    expect(host.contains(getByTestId('modal'))).toBe(true);
    expect(getByTestId('host-surfaces').contains(getByTestId('modal'))).toBe(true);
    expect(getByTestId('host-backdrop').dataset.state).toBe('open');
    expect(page.hasAttribute('inert')).toBe(true);

    await escape();
    expect(getByTestId('host-surfaces').children).toHaveLength(0);
    expect(getByTestId('host-backdrop').dataset.state).toBe('closed');
    expect(page.hasAttribute('inert')).toBe(false);
  });

  it('stacked modals share the host scrim, and a tap on it closes the top one only', async () => {
    const onDismiss = vi.fn();
    const onNestedDismiss = vi.fn();
    // Both open at mount, in tree order: the nested one is on top.
    const { getByTestId, queryByTestId } = render(ModalHarness, {
      props: {
        withHost: true,
        isOpen: true,
        nestedOpen: true,
        onDismiss,
        onNestedDismiss,
      },
    });
    const surfaces = getByTestId('host-surfaces');
    const scrim = getByTestId('host-backdrop');
    expect(surfaces.children).toHaveLength(2);
    // No scrim of their own: each root starts with its panel.
    expect(getByTestId('modal').parentElement?.firstElementChild).toBe(getByTestId('modal'));
    expect(getByTestId('nested').parentElement?.firstElementChild).toBe(getByTestId('nested'));
    expect(scrim.dataset.state).toBe('open');

    await fireEvent.click(scrim);
    expect(onNestedDismiss).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({ source: 'blur' }),
    );
    expect(onDismiss).not.toHaveBeenCalled();
    expect(queryByTestId('nested')).toBeNull();
    // One modal still open: the scrim stays.
    expect(scrim.dataset.state).toBe('open');

    await fireEvent.click(scrim);
    expect(onDismiss).toHaveBeenCalledExactlyOnceWith(expect.objectContaining({ source: 'blur' }));
    expect(scrim.dataset.state).toBe('closed');
  });
});

describe('Modal, as Blade', () => {
  it("takes Blade's sizes: a column, capped at 80% when centred, or the host 8px in", async () => {
    const { resolveModal } = await import('../components/modal/styles');
    expect(resolveModal({}).panel).toContain('d:w-[400px]');
    expect(resolveModal({}).panel).toContain('!max-h-[80%]');
    expect(resolveModal({ size: 'medium' }).panel).toContain('d:w-[760px]');
    expect(resolveModal({ size: 'large' }).panel).toContain('d:w-[1024px]');
    const full = resolveModal({ size: 'full' });
    expect(full.panel).toContain('h-full');
    expect(full.panel).not.toContain('max-h-[80%]');
    expect(full.root.split(' ')).toContain('p-2');
    expect(full.root.split(' ')).not.toContain('p-4');
    expect(resolveModal({}).panel).toContain('rounded-large');
  });

  it('leaves the footer to its content: a padded box, no layout of its own', async () => {
    const { resolveModal } = await import('../components/modal/styles');
    const { footer } = resolveModal({});
    // Figma's _Modal Footer: 16px under the hairline, 20px beside and below from `m`.
    expect(footer).toContain('p-4 d:px-5 d:pb-5');
    expect(footer).not.toContain('flex');
  });

  it("header slots sit where Figma's _Modal Header puts them", () => {
    const { getByText, getByTestId } = render(ModalHarness, {
      props: { isOpen: true, withSlots: 'leading' },
    });
    const title = getByText('Remove card');
    const titleRow = title.parentElement!;
    const block = titleRow.parentElement!;
    const row = block.parentElement!;
    // The leading item, 8px before the title block.
    const leading = getByTestId('logo').parentElement!;
    expect(row.firstElementChild).toBe(leading);
    expectClass(leading, 'me-2');
    // Figma's 32px leading slot, centred on the title block.
    expectClass(leading, 'w-8 h-8');
    expectClass(leading, 'self-center');
    // The suffix beside the title, 8px from it, centred on its 28px line.
    expectClass(titleRow, 'gap-2');
    expectClass(getByTestId('count').parentElement, 'h-7');
    // The trailing item after the block, 16px clear, with room for the close.
    const trailing = getByTestId('trailing-action').parentElement!;
    expect(row.lastElementChild).toBe(trailing);
    expectClass(trailing, 'ms-4');
    // Figma: 16px, then the close's 28px box.
    expectClass(row, 'pr-11');
  });

  it('a leading icon is a large glyph on the title line', () => {
    const { getByText } = render(ModalHarness, { props: { isOpen: true, withSlots: 'icon' } });
    const row = getByText('Remove card').parentElement!.parentElement!.parentElement!;
    const box = row.firstElementChild as HTMLElement;
    expectClass(box, 'h-7');
    expectClass(box.firstElementChild as HTMLElement, 'w-5 h-5');
  });

  it("each variant takes its Figma header, title and close position", async () => {
    const { resolveModal } = await import('../components/modal/styles');
    const modal = resolveModal({});
    // Figma: 20px above and beside, 16px below, at every width.
    expect(modal.header).toContain('px-5 pt-5 pb-4');
    expect(modal.close).toContain('top-6 right-6');
    expect(modal.title).toContain('font-heading font-blade-semibold text-300 leading-300');
    const sheet = resolveModal({ variant: 'sheet' });
    expect(sheet.header).toContain('px-4 pt-3 pb-4');
    expect(sheet.title).toContain('font-blade-text text-200 leading-200');
    expect(sheet.close).toContain('top-9 right-4');
    const drawer = resolveModal({ variant: 'drawer' });
    expect(drawer.header).toBe('shrink-0 p-5');
    expect(drawer.footer).toContain('p-5');
    expect(drawer.close).toContain('top-6 right-5');
    expect(drawer.panel).toContain('w-[calc(100%_-_1.5rem)] d:w-[380px]');
  });
});
