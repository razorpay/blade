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

const warned = new Set<string>();

// A type outside the union reaches here from untyped code, or from Blade
// 0.x's names (`telephone`, `search`): the field renders as text rather than
// failing to mount, and says so once per type.
function warnUnknownType(type: string): void {
  if (warned.has(type)) {
    return;
  }
  warned.add(type);
  console.warn(
    `[blade-svelte] TextInput type="${type}" is not one of ${Object.keys(DEFAULTS).join(
      ', ',
    )}; rendering as text. ` +
      `Blade 0.x's "telephone" is "tel"; for "search" use SearchInput, or role="searchbox" with enterKeyHint="search".`,
  );
}

/**
 * The `<input>`'s type and keyboard attributes for a field `type`, each
 * given attribute winning over the type's default; an unknown type renders
 * as text. As Blade, `number` renders as `text` with the decimal keypad: a
 * number input spins, steps on
 * scroll and ignores `maxlength`, and iOS shows it the wrong keyboard.
 */
export function resolveKeyboard(type: TextInputType, given: KeyboardAttributes): ResolvedKeyboard {
  const known = Object.prototype.hasOwnProperty.call(DEFAULTS, type);
  if (!known) {
    warnUnknownType(type);
  }
  const defaults = known ? DEFAULTS[type] : DEFAULTS.text;
  return {
    type: type === 'number' || !known ? 'text' : type,
    inputMode: given.inputMode ?? defaults.inputMode,
    enterKeyHint: given.enterKeyHint ?? defaults.enterKeyHint,
    autoComplete: given.autoComplete ?? defaults.autoComplete,
    autoCapitalize: given.autoCapitalize ?? defaults.autoCapitalize,
  };
}
