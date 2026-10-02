import type { HTMLInputAttributes } from 'svelte/elements';

export type TextInputType = 'text' | 'tel' | 'email' | 'url' | 'number' | 'password';

/** The keyboard and autofill attributes a caller may set. */
export interface KeyboardAttributes {
  inputMode?: HTMLInputAttributes['inputmode'];
  enterKeyHint?: HTMLInputAttributes['enterkeyhint'];
  autoComplete?: HTMLInputAttributes['autocomplete'];
  autoCapitalize?: HTMLInputAttributes['autocapitalize'];
}

/** What lands on the `<input>`: its DOM type, and the attributes. */
export interface ResolvedKeyboard extends KeyboardAttributes {
  type: Exclude<TextInputType, 'number'>;
}

// Blade's getKeyboardAndAutocompleteProps, in HTML terms: what each type
// brings when the caller does not say.
const DEFAULTS: Record<TextInputType, KeyboardAttributes> = {
  text: {},
  password: {},
  tel: { enterKeyHint: 'done', autoComplete: 'tel' },
  email: { enterKeyHint: 'done', autoComplete: 'email', autoCapitalize: 'none' },
  url: { enterKeyHint: 'go', autoCapitalize: 'none' },
  number: { inputMode: 'decimal', enterKeyHint: 'done' },
};

/**
 * The `<input>`'s type and keyboard attributes for a field `type`, each
 * given attribute winning over the type's default. As Blade, `number`
 * renders as `text` with the decimal keypad: a number input spins, steps on
 * scroll and ignores `maxlength`, and iOS shows it the wrong keyboard.
 */
export function resolveKeyboard(
  type: TextInputType,
  given: KeyboardAttributes
): ResolvedKeyboard {
  const defaults = DEFAULTS[type];
  return {
    type: type === 'number' ? 'text' : type,
    inputMode: given.inputMode ?? defaults.inputMode,
    enterKeyHint: given.enterKeyHint ?? defaults.enterKeyHint,
    autoComplete: given.autoComplete ?? defaults.autoComplete,
    autoCapitalize: given.autoCapitalize ?? defaults.autoCapitalize,
  };
}
