import { defineContext } from '../context';

/**
 * What a ButtonGroup hands the Buttons inside it, as Blade's does: the look
 * for all of them, and a disabled state that joins each button's own.
 * `Shared` is the library's style payload (checkout's: variant, size,
 * colour); the rune only passes it through.
 */
export interface ButtonGroupContext<Shared> {
  readonly shared: Shared;
  readonly isDisabled: boolean;
}

const BUTTON_GROUP = defineContext<unknown>('blade-button-group');

export function provideButtonGroup<Shared>(group: ButtonGroupContext<Shared>): void {
  BUTTON_GROUP.set(group);
}

export function getButtonGroup<Shared>(): ButtonGroupContext<Shared> | undefined {
  return BUTTON_GROUP.get() as ButtonGroupContext<Shared> | undefined;
}

/**
 * Inside an overlay (a popover's content) a Button is its own again, as
 * Blade's OverlayContextReset does: call it in the overlay's content.
 */
export function resetButtonGroup(): void {
  BUTTON_GROUP.set(undefined);
}
