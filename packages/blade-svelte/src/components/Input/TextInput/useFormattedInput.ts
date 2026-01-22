/**
 * Input formatting utilities
 * Ported from packages/blade/src/components/Input/TextInput/useFormattedInput.ts
 */

import type { FormInputOnEvent } from '../BaseInput/types';

/**
 * Formats user input according to pattern
 * format("1234", "##/##") → "12/34"
 */
export function formatValue(value: string, pattern: string): string {
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
}

/**
 * Removes delimiters, keeps only user input
 * stripPatternCharacters("12/34") → "1234"
 */
export function stripPatternCharacters(value: string): string {
  return value.replace(/[^\dA-Za-z]/g, '');
}

/**
 * Checks if character is user input vs delimiter
 */
export function isUserCharacter(character: string): boolean {
  return /[\dA-Za-z]/.test(character);
}

export type UseFormattedInputOptions = {
  format?: string;
  onChange?: (event: FormInputOnEvent & { rawValue?: string }) => void;
  value?: string;
  defaultValue?: string;
};

export type UseFormattedInputResult = {
  formattedValue: string;
  rawValue: string;
  maxLength: number | undefined;
  handleChange: (event: FormInputOnEvent) => void;
  handleKeyDown: (event: KeyboardEvent) => void;
};

/**
 * Creates formatted input state and handlers
 */
export function createFormattedInputState(options: UseFormattedInputOptions): UseFormattedInputResult {
  const { format: pattern, onChange, value, defaultValue = '' } = options;

  // Initial formatted value
  const initialRaw = stripPatternCharacters(value ?? defaultValue);
  let formattedValue = $state(formatValue(initialRaw, pattern ?? ''));
  let rawValue = $state(initialRaw);
  let inputElement: HTMLInputElement | null = null;
  let cursorInfo: { position?: number; endOfSection?: boolean } = {};

  const maxLength = pattern?.length;

  function handleChange(event: FormInputOnEvent): void {
    if (!pattern) {
      // No pattern = regular input
      onChange?.(event);
      return;
    }

    const inputValue = event.value ?? '';
    const currentValue = formattedValue;
    const cursorPosition = inputElement?.selectionStart ?? 0;
    const didDelete = inputValue.length < currentValue.length;

    cursorInfo.position = cursorPosition;

    let newRawValue = stripPatternCharacters(inputValue);

    // Handle special case: user deleted a delimiter
    if (didDelete) {
      const deletedChar = currentValue[cursorPosition] ?? '';
      const deletedDelimiter = !isUserCharacter(deletedChar);

      if (deletedDelimiter) {
        const beforeCursor = inputValue.substring(0, cursorPosition);
        const afterCursor = inputValue.substring(cursorPosition);
        const rawBefore = stripPatternCharacters(beforeCursor);
        const rawAfter = stripPatternCharacters(afterCursor);

        newRawValue = rawBefore.slice(0, -1) + rawAfter;
        cursorInfo.position = beforeCursor.replace(/([\d\w]+)[^\dA-Za-z]+$/, '$1').length - 1;
      }
    }

    const newFormattedValue = formatValue(newRawValue, pattern);
    cursorInfo.endOfSection = false;

    // Handle cursor positioning when typing
    if (!didDelete) {
      const nextChar = newFormattedValue[cursorPosition];
      const nextIsDelimiter = nextChar ? !isUserCharacter(nextChar) : false;

      const remainingText = newFormattedValue.substring(cursorPosition);
      const nextUserCharIndex = remainingText.search(/[\dA-Za-z]/);
      const hasMoreUserChars = nextUserCharIndex !== -1;

      cursorInfo.endOfSection = nextIsDelimiter && !hasMoreUserChars;

      if (nextIsDelimiter && hasMoreUserChars) {
        const prevChar = newFormattedValue[cursorPosition - 1] ?? '';
        const prevIsDelimiter = !isUserCharacter(prevChar);

        if (prevIsDelimiter) {
          cursorInfo.position = cursorPosition + nextUserCharIndex + 1;
        } else {
          const delimiterExistedBefore =
            currentValue[cursorPosition] === newFormattedValue[cursorPosition];
          if (delimiterExistedBefore) {
            cursorInfo.position = cursorPosition + 1;
          }
        }
      }
    }

    formattedValue = newFormattedValue;
    rawValue = newRawValue;

    onChange?.({ name: event.name, value: newFormattedValue, rawValue: newRawValue });

    // Apply cursor position after state update
    if (inputElement && cursorInfo.position !== undefined && !cursorInfo.endOfSection) {
      requestAnimationFrame(() => {
        inputElement?.setSelectionRange(cursorInfo.position!, cursorInfo.position!);
      });
    }
  }

  function handleKeyDown(event: KeyboardEvent): void {
    if (event.currentTarget && inputElement !== event.currentTarget) {
      inputElement = event.currentTarget as HTMLInputElement;
    }
  }

  // Update when external value changes
  $effect(() => {
    if (value !== undefined && pattern) {
      const newRaw = stripPatternCharacters(value);
      const newFormatted = formatValue(newRaw, pattern);
      if (newFormatted !== formattedValue) {
        formattedValue = newFormatted;
        rawValue = newRaw;
      }
    }
  });

  return {
    get formattedValue() { return formattedValue; },
    get rawValue() { return rawValue; },
    maxLength,
    handleChange,
    handleKeyDown,
  };
}

