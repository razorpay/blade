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

  it('maps autoCompleteSuggestionType=oneTimeCode to the one-time-code autocomplete', async () => {
    render(OTPInput, {
      props: {
        accessibilityLabel: 'OTP',
        otpLength: 6,
        autoCompleteSuggestionType: 'oneTimeCode',
      },
    });

    const fields = await findFields();
    expect(fields[0]).toHaveAttribute('autocomplete', 'one-time-code');
  });

  it('respects event.defaultPrevented and skips internal key handling', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn(({ event }) => {
      event.preventDefault();
    });
    render(OTPInput, {
      props: { label: 'OTP', otpLength: 6, onKeyDown },
    });

    const fields = await findFields();
    await user.click(fields[1]);

    // Without the guard, Backspace on an empty focused field would move focus
    // back to the previous field. defaultPrevented must skip that internal nav.
    await user.keyboard('{Backspace}');

    await waitFor(() => {
      const call = onKeyDown.mock.calls.find(([payload]) => payload.event instanceof KeyboardEvent);
      expect(call).toBeDefined();
    });

    expect(fields[1]).toHaveFocus();
  });
});
