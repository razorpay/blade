/**
 * The element surface a model may rely on. Mirrors the parity surface of the
 * native DOM shim (packages/native/renderer/src/dom.js): a real HTMLElement
 * satisfies it structurally, but `style`, `innerHTML`, `getComputedStyle`,
 * key/pointer events and observers are deliberately absent so model code
 * cannot reach them without a visible cast.
 */
export type ElementEvent =
  | 'click'
  | 'input'
  | 'change'
  | 'focus'
  | 'blur'
  | 'scroll'
  | 'resize'
  | 'keyintercept';

export interface ElementHandle {
  focus(): void;
  blur(): void;
  click(): void;
  // Present on form controls only.
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  selectionStart?: number | null;
  selectionEnd?: number | null;
  scrollIntoView(): void;
  scrollTo(x: number, y: number): void;
  getBoundingClientRect(): {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  textContent: string | null;
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
  closest(simpleSelector: string): ElementHandle | null;
  addEventListener(
    type: ElementEvent,
    listener: (event: { target: ElementHandle; detail?: unknown }) => void,
  ): void;
  removeEventListener(type: ElementEvent, listener: unknown): void;
}
