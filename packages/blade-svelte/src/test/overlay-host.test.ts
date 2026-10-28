import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import { tick } from 'svelte';
import NestedHostHarness from './fixtures/NestedHostHarness.svelte';
import FirstRenderHarness from './fixtures/FirstRenderHarness.svelte';
import type { Layers } from '../runes/layer/layers';

describe('BladeProvider overlay host', () => {
  it('renders one host, the outermost provider’s, after the content', () => {
    const { getByTestId, queryByTestId } = render(NestedHostHarness);
    expect(getByTestId('outer')).toBeTruthy();
    expect(getByTestId('outer-backdrop')).toBeTruthy();
    expect(getByTestId('outer-surfaces')).toBeTruthy();
    expect(queryByTestId('outer-toasts')).toBeNull();
    expect(queryByTestId('inner')).toBeNull();
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

  it('isolatePage={false} keeps the page live behind an open modal', async () => {
    const { getByTestId } = render(FirstRenderHarness, { props: { isolatePage: false } });
    await tick();
    expect(getByTestId('host-surfaces').contains(getByTestId('modal'))).toBe(true);
    expect(getByTestId('page').hasAttribute('inert')).toBe(false);
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
