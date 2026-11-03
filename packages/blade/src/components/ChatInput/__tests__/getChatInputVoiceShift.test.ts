import { getChatInputVoiceShift } from '../getChatInputVoiceShift';
import { bladeTheme } from '~tokens/theme';

const theme = { ...bladeTheme, colors: bladeTheme.colors.onLight } as never;

describe('getChatInputVoiceShift', () => {
  it('moves the mic by Send plus the gap while Send is hidden', () => {
    const base = { theme, status: 'ready' as const, isDisabled: false };
    expect(getChatInputVoiceShift({ ...base, hasContent: false, buttonSize: 'small' })).toBe(40);
    expect(getChatInputVoiceShift({ ...base, hasContent: false, buttonSize: 'xsmall' })).toBe(36);
    expect(
      getChatInputVoiceShift({ ...base, hasContent: true, isDisabled: true, buttonSize: 'small' }),
    ).toBe(40);
  });

  it('keeps the mic in place when Send, Stop, the loader or Retry shows', () => {
    const base = { theme, isDisabled: false, buttonSize: 'small' as const };
    expect(getChatInputVoiceShift({ ...base, status: 'ready', hasContent: true })).toBe(0);
    for (const status of ['submitted', 'streaming', 'error'] as const) {
      expect(getChatInputVoiceShift({ ...base, status, hasContent: false })).toBe(0);
    }
  });
});
