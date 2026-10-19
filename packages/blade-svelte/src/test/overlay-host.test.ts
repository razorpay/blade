import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import NestedHostHarness from './fixtures/NestedHostHarness.svelte';
import NestedToastsHarness from './fixtures/NestedToastsHarness.svelte';
import FirstRenderHarness from './fixtures/FirstRenderHarness.svelte';
import { createToasts } from '../components/toast/toasts';
import type { Layers } from '../runes/layer/layers';

describe('BladeProvider overlay host', () => {
  it('renders one host, the outermost provider’s, after the content', () => {
    const { getByTestId, queryByTestId } = render(NestedHostHarness);
    expect(getByTestId('outer')).toBeTruthy();
    expect(getByTestId('outer-backdrop')).toBeTruthy();
    expect(getByTestId('outer-surfaces')).toBeTruthy();
    expect(getByTestId('outer-toasts').getAttribute('aria-label')).toBe('Notifications');
    expect(queryByTestId('inner')).toBeNull();
  });
});

describe('BladeProvider toasts, nested', () => {
  it('a nested provider with a queue of its own renders its toasts, in the enclosing host', async () => {
    const outerToasts = createToasts();
    const innerToasts = createToasts();
    const { getByTestId, findByText } = render(NestedToastsHarness, {
      props: { outerToasts, innerToasts },
    });
    expect(getByTestId('inner-toasts')).toBeTruthy();
    innerToasts.showToast({ content: 'Inner saved', duration: 0 });
    const toast = await findByText('Inner saved');
    expect(getByTestId('outer').contains(toast)).toBe(true);
  });

  it('a nested provider without a queue of its own renders no host and no second stack, and leaves the toasts working when it goes', async () => {
    const outerToasts = createToasts();
    const { queryByTestId, findAllByText, rerender } = render(NestedToastsHarness, {
      props: { outerToasts },
    });
    expect(queryByTestId('inner')).toBeNull();
    expect(queryByTestId('inner-toasts')).toBeNull();
    void outerToasts.showToast({ content: 'Paid', duration: 0 });
    expect(await findAllByText('Paid')).toHaveLength(1);

    await rerender({ outerToasts, showInner: false });
    void outerToasts.showToast({ content: 'Refunded', duration: 0 });
    expect(await findAllByText('Refunded')).toHaveLength(1);
  });
});

describe('an overlay open on the first render', () => {
  it('moves into the host once it mounts, and only the page goes inert', async () => {
    const { getByTestId } = render(FirstRenderHarness);
    await tick();
    const modal = getByTestId('modal');
    expect(getByTestId('host-surfaces').contains(modal)).toBe(true);
    expect(modal.closest('[inert]')).toBeNull();
    expect(getByTestId('page').hasAttribute('inert')).toBe(true);
  });

  it('a popover lands in the host, and the page stays live', async () => {
    const { getByTestId } = render(FirstRenderHarness, { props: { kind: 'popover' } });
    await tick();
    expect(getByTestId('popover').parentElement).toBe(getByTestId('host'));
    expect(getByTestId('page').hasAttribute('inert')).toBe(false);
  });

  it('a popover open before the host registers moves in once it does', async () => {
    let layers: Layers | undefined;
    const { getByTestId } = render(FirstRenderHarness, {
      props: {
        kind: 'popover',
        onLayers: (provided) => {
          layers = provided;
        },
      },
    });
    await tick();
    // The host registering after the panel: as a host that mounts late.
    const late = document.createElement('div');
    document.body.append(late);
    layers?.setHost(late);
    await tick();
    expect(getByTestId('popover').parentElement).toBe(late);
    late.remove();
  });
});

describe('the live region', () => {
  it('one polite region per host, in the host, outside what a modal inerts', () => {
    const { getAllByRole, getByTestId } = render(NestedHostHarness);
    const regions = getAllByRole('log', { hidden: true });
    expect(regions).toHaveLength(1);
    expect(getByTestId('outer-live').getAttribute('aria-live')).toBe('polite');
    expect(getByTestId('outer').contains(getByTestId('outer-live'))).toBe(true);
  });
});
