import { render, screen, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import OTPInput from '../OTPInput.svelte';

async function findFields(): Promise<HTMLInputElement[]> {
  return screen.findAllByRole('textbox');
}

describe('<OTPInput />', () => {
  it('fires onKeyDown with the field index', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(OTPInput, {
      props: { label: 'OTP', otpLength: 6, onKeyDown },
    });

    const fields = await findFields();
    await user.click(fields[2]);
    await user.keyboard('{ArrowRight}');

    await waitFor(() => {
      const call = onKeyDown.mock.calls.find(([payload]) => payload.event instanceof KeyboardEvent);
      expect(call).toBeDefined();
      expect(call[0].inputIndex).toBe(2);
      expect(call[0].key).toBe('ArrowRight');
    });
  });

  it('maps autoCompleteSuggestionType=newOtp to the one-time-code autocomplete', async () => {
    render(OTPInput, {
      props: { accessibilityLabel: 'OTP', otpLength: 6, autoCompleteSuggestionType: 'newOtp' },
    });

    const fields = await findFields();
    // The first field (and every field) receives the autocomplete value mapped
    // from `newOtp` → `one-time-code`.
    expect(fields[0]).toHaveAttribute('autocomplete', 'one-time-code');
  });
});
