export interface PasswordReveal {
  /** Whether the password shows as text. Never while disabled. Tracked. */
  readonly isRevealed: boolean;
  toggle(): void;
}

/**
 * A password field's show/hide state, as Blade's PasswordInput: masked by
 * default, and masked again while disabled — a disabled field has no reveal
 * button to hide it with.
 */
export function createPasswordReveal(options: {
  isDisabled: () => boolean;
}): PasswordReveal {
  let revealed = $state(false);
  return {
    get isRevealed() {
      return revealed && !options.isDisabled();
    },
    toggle() {
      revealed = !revealed;
    },
  };
}
