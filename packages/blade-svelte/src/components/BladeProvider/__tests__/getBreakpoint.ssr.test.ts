import { render } from 'svelte/server';
import { describe, expect, it } from 'vitest';
import BreakpointHarness from './BreakpointHarness.svelte';

describe('getBreakpoint SSR', () => {
  it('server-renders with no matched breakpoint and desktop device type', () => {
    const { body } = render(BreakpointHarness);

    expect(body).toContain('data-testid="breakpoint">none<');
    expect(body).toContain('data-testid="device">desktop<');
  });
});
