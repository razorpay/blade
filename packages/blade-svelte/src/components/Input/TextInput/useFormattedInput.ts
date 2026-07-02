import type { FormInputOnEvent } from '../BaseInput/types';

/**
 * Formats user input according to pattern. `format("1234", "##/##") → "12/34"`.
 */
export const format = (value: string, pattern: string): string => {
  if (!pattern) return value;

  let result = '';
  let valueIndex = 0;

  for (let i = 0; i < pattern.length; i++) {
    const patternChar = pattern[i];
    if (patternChar === '#') {
      if (valueIndex < value.length) {
        result += value[valueIndex];
        valueIndex++;
      } else {
        break;
      }
    } else {
      result += patternChar;
    }
  }

  return result;
};

/** Removes delimiters, keeps only user input. `stripPatternCharacters("12/34") → "1234"`. */
export const stripPatternCharacters = (value: string): string => value.replace(/[^\dA-z]/g, '');

/** Checks if a character is user input vs a delimiter. */
export const isUserCharacter = (character: string): boolean => /[\dA-z]/.test(character);

type FormatterCursorInfo = { cursorPosition?: number; endOfSection?: boolean };

export type FormattedInputController = {
  /** Max input length implied by the pattern. */
  readonly maxLength?: number;
  /** Format an external value for display. */
  formatValue: (value: string) => string;
  /**
   * Handle an input change. Computes the formatted value + rawValue, applies
   * smart cursor positioning to the provided element, and returns the new
   * formatted value (the component stores it in `$state`).
   */
  handleChange: (
    payload: { name?: string; value?: string },
    currentFormatted: string,
    inputEl: HTMLInputElement | null,
  ) => string;
};

/**
 * Ported from React `useFormattedInput` (see file history). The stateful bits
 * (internal value, re-render) are owned by the Svelte component via `$state`;
 * this controller keeps the pure formatting + cursor logic. `onChange` emits
 * `{ value, rawValue }` exactly like React.
 *
 * Cursor positioning is applied synchronously against the passed `inputEl`
 * using `setSelectionRange`, mirroring React's post-render effect closely
 * enough for the supported delimiter patterns.
 */
export const createFormattedInput = ({
  pattern,
  onChange,
}: {
  pattern?: string;
  onChange?: (params: { name?: string; value?: string; rawValue?: string }) => void;
}): FormattedInputController => {
  const info: FormatterCursorInfo = {};
  const maxLength = pattern?.length;

  const applyCursor = (inputEl: HTMLInputElement | null): void => {
    const { cursorPosition, endOfSection } = info;
    if (endOfSection || cursorPosition === undefined || !inputEl) return;
    inputEl.setSelectionRange(cursorPosition, cursorPosition);
  };

  const handleChange = (
    { name, value: inputValue }: Parameters<FormInputOnEvent>[0],
    currentFormatted: string,
    inputEl: HTMLInputElement | null,
  ): string => {
    if (!pattern) {
      const cleanValue = inputValue ?? '';
      onChange?.({ name, value: cleanValue });
      return cleanValue;
    }

    const currentValue = currentFormatted;
    const newInputValue = inputValue ?? '';
    const cursorPosition = inputEl?.selectionStart ?? 0;
    const didDelete = newInputValue.length < currentValue.length;

    info.cursorPosition = cursorPosition;

    let rawValue = stripPatternCharacters(newInputValue);

    if (didDelete) {
      const deletedChar = currentValue[cursorPosition] ?? '';
      const deletedDelimiter = !isUserCharacter(deletedChar);

      if (deletedDelimiter) {
        const beforeCursor = newInputValue.substring(0, cursorPosition);
        const afterCursor = newInputValue.substring(cursorPosition);
        const rawBefore = stripPatternCharacters(beforeCursor);
        const rawAfter = stripPatternCharacters(afterCursor);

        rawValue = rawBefore.slice(0, -1) + rawAfter;

        info.cursorPosition = beforeCursor.replace(/([\d\w]+)[^\dA-z]+$/, '$1').length - 1;
      }
    }

    const formattedValue = format(rawValue, pattern);
    info.endOfSection = false;

    if (!didDelete) {
      const nextChar = formattedValue[cursorPosition];
      const nextIsDelimiter = nextChar ? !isUserCharacter(nextChar) : false;

      const remainingText = formattedValue.substring(cursorPosition);
      const nextUserCharIndex = remainingText.search(/[\dA-z]/);
      const hasMoreUserChars = nextUserCharIndex !== -1;

      info.endOfSection = nextIsDelimiter && !hasMoreUserChars;

      if (nextIsDelimiter && hasMoreUserChars) {
        const prevChar = formattedValue[cursorPosition - 1] ?? '';
        const prevIsDelimiter = !isUserCharacter(prevChar);

        if (prevIsDelimiter) {
          info.cursorPosition = cursorPosition + nextUserCharIndex + 1;
        } else {
          const delimiterExistedBefore =
            currentValue[cursorPosition] === formattedValue[cursorPosition];
          if (delimiterExistedBefore) {
            info.cursorPosition = cursorPosition + 1;
          }
        }
      }
    }

    onChange?.({ name, value: formattedValue, rawValue });
    // Apply cursor on the next microtask so the DOM value is updated first.
    void Promise.resolve().then(() => applyCursor(inputEl));
    return formattedValue;
  };

  return {
    maxLength,
    formatValue: (value: string) => format(value, pattern ?? ''),
    handleChange,
  };
};
