import { describe, it, expect, vi } from 'vitest';
import { createRawSnippet } from 'svelte';
import { fireEvent, render } from '@testing-library/svelte';
import LayerHostNative from '../components/layer/LayerHost.native.svelte';
import SurfaceNative from '../components/layer/Surface.native.svelte';
import { globalLayers } from '../runes/layer/layers';
import { resolveModal } from '../components/modal';

const children = createRawSnippet(() => ({
  render: () => '<p>Content</p>',
}));

function props(overrides: Record<string, unknown> = {}) {
  return {
    isOpen: true,
    isTop: true,
    role: 'dialog' as const,
    classes: resolveModal({ size: 'full' }),
    onDismissRequest: vi.fn(),
    testID: 'sheet',
    children,
    ...overrides,
  };
}

// The native twin hands presence, scrim, focus and BACK to the platform's
// sheet host; what is left to verify in JS is the element contract.
describe('Surface.native', () => {
  it('renders the platform sheet element shaped by the styles', () => {
    const { getByTestId } = render(SurfaceNative, { props: props() });
    const sheet = getByTestId('sheet');

    expect(sheet.tagName.toLowerCase()).toBe('native-bottom-sheet');
    expect(sheet.getAttribute('data-height')).toBe('full');
    expect(sheet.getAttribute('data-radius')).toBe('0');
    expect(sheet.className).toContain('bg-popup-gray-subtle');
    expect(sheet.textContent).toContain('Content');
  });

  it('forwards a platform dismissal as a request and leaves by unmounting', async () => {
    const onDismissRequest = vi.fn();
    const { getByTestId, queryByTestId, rerender } = render(SurfaceNative, {
      props: props({ onDismissRequest }),
    });

    await fireEvent(getByTestId('sheet'), new Event('dismiss'));
    expect(onDismissRequest).toHaveBeenCalledTimes(1);
    // Still mounted: the owner's model decides, not the platform.
    expect(queryByTestId('sheet')).not.toBeNull();

    await rerender(props({ onDismissRequest, isOpen: false }));
    expect(queryByTestId('sheet')).toBeNull();
  });

  it('a bottom sheet asks the platform for its own drag and handle', () => {
    const { getByTestId } = render(SurfaceNative, {
      props: props({ classes: resolveModal({ variant: 'sheet' }) }),
    });
    const sheet = getByTestId('sheet');
    expect(sheet.getAttribute('data-draggable')).toBe('true');
    expect(sheet.getAttribute('data-showhandle')).toBe('true');
  });
});

// The host's native twin: the element the stack knows, with no scrim and no
// surfaces box — the platform's sheet host owns both.
describe('LayerHost.native', () => {
  it('renders one empty element and registers it', () => {
    const { getByTestId, unmount } = render(LayerHostNative, {
      props: { testID: 'host' },
    });
    const host = getByTestId('host');
    expect(host.children).toHaveLength(0);
    expect(globalLayers.host()).toBe(host);
    expect(globalLayers.scrim()).toBeUndefined();
    expect(globalLayers.surfaces()).toBeUndefined();
    unmount();
    expect(globalLayers.host()).toBeUndefined();
  });
});
