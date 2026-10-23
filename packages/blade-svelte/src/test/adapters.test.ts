import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render, waitFor } from '@testing-library/svelte';
import AdaptersHarness from './fixtures/AdaptersHarness.svelte';
import PhoneNumberInputHarness from './fixtures/PhoneNumberInputHarness.svelte';

describe('BladeProvider adapters', () => {
  it('back asks the open modal first', async () => {
    let back: (() => boolean) | undefined;
    const onDismiss = vi.fn();
    const { getByTestId, queryByTestId, rerender } = render(AdaptersHarness, {
      props: {
        onDismiss,
        onReady: (_layers, provided) => {
          back = provided;
        },
      },
    });
    expect(back?.()).toBe(false);
    await rerender({ isOpen: true, onDismiss });
    await waitFor(() => getByTestId('modal'));
    expect(back?.()).toBe(true);
    expect(onDismiss).toHaveBeenCalledWith(expect.objectContaining({ source: 'back' }));
    await waitFor(() => expect(queryByTestId('modal')).toBeNull());
    expect(back?.()).toBe(false);
  });

  it('presentDropdown: an app shows a library dropdown its own way', async () => {
    const presentDropdown = vi.fn((_kind: string, _request: unknown) => Promise.resolve(undefined));
    const { getByTestId, queryByTestId } = render(PhoneNumberInputHarness, {
      props: { presentDropdown: presentDropdown as never },
    });
    await fireEvent.click(getByTestId('phone-country'));
    expect(presentDropdown).toHaveBeenCalledTimes(1);
    const [kind, request] = presentDropdown.mock.calls[0] as [string, Record<string, unknown>];
    expect(kind).toBe('dial-code');
    expect(request).not.toHaveProperty('anchor');
    expect(request).toEqual(expect.objectContaining({ label: 'Country', testID: 'phone' }));
    expect(queryByTestId('phone-picker')).toBeNull();
  });
});
