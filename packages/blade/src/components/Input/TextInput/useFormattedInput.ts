import type React from 'react';
import { useCallback, useRef, useState, useEffect, useMemo } from 'react';
import type { FormInputOnEvent } from '~components/Form/FormTypes';

/**
 * Formats user input according to pattern. format("1234", "##/##") → "12/34"
 */
const format = (value: string, pattern: string): string => {
  if (!pattern) return value;

  let result = '';
  let valueIndex = 0;

  for (let i = 0; i < pattern.length; i++) {
    const patternChar = pattern[i]; // "#" or "/"

    if (patternChar === '#') {
      if (valueIndex < value.length) {
        result += value[valueIndex]; // add "1" from "1234"
        valueIndex++;
      } else {
        break; // No more input chars, stop
      }
    } else {
      result += patternChar; // add "/" delimiter
    }
  }

  return result; // "12/34"
};

/**
 * Removes delimiters, keeps only user input. stripPatternCharacters("12/34") → "1234"
 */
const stripPatternCharacters = (value: string): string => {
  return value.replace(/[^\dA-z]/g, ''); // "12/34" → "1234" (removes "/")
};

/**
 * Checks if character is user input vs delimiter. isUserCharacter('1') → true, isUserCharacter('/') → false
 */
const isUserCharacter = (character: string): boolean => {
  return /[\dA-z]/.test(character); // "1" → true, "/" → false
};

type UseFormattedInputProps = {
  format?: string;
  onChange?: (params: { name?: string; value?: string; rawValue?: string }) => void;
  value?: string;
  defaultValue?: string;
};

type UseFormattedInputReturn = {
  formattedValue: string;
  handleChange: FormInputOnEvent;
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  maxLength?: number;
};

/**
 * Hook for pattern-based input formatting with smart cursor positioning.
 * useFormattedInput({ format: "##/##" }) transforms "1234" → "12/34"
 */
export const useFormattedInput = ({
  format: pattern,
  onChange,
  value: userValue,
  defaultValue = '',
}: UseFormattedInputProps): UseFormattedInputReturn => {
  const initialValue = useMemo(() => {
    return format(userValue ?? defaultValue, pattern ?? '');
  }, [userValue, defaultValue, pattern]);

  const [internalValue, setInternalValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const infoRef = useRef<{
    cursorPosition?: number;
    endOfSection?: boolean;
  }>({});

  const maxLength = useMemo(() => pattern?.length, [pattern]);

  // Reset internal formatting state when external value becomes empty
  useEffect(() => {
    if ((userValue === '' || userValue === undefined) && defaultValue === '') {
      setInternalValue('');
    }
  }, [userValue]);

  const handleChange: FormInputOnEvent = useCallback(
    ({ name, value: inputValue }) => {
      if (!pattern) {
        // No pattern = regular input
        const cleanValue = inputValue ?? '';
        onChange?.({ name, value: cleanValue });
        setInternalValue(cleanValue);
        return;
      }

      const currentValue = internalValue; // "12/34" (user wants to delete "/")
      const newInputValue = inputValue ?? ''; // "1234" (after deleting "/")
      const cursorPosition = inputRef.current?.selectionStart ?? 0; // 2 (cursor where "/" was)
      const didDelete = newInputValue.length < currentValue.length; // 4 < 5 → true

      infoRef.current.cursorPosition = cursorPosition;

      let rawValue = stripPatternCharacters(newInputValue); // "1234" → "1234"

      // Handle special case: user deleted a delimiter (like deleting "/" in "12/|34")
      if (didDelete) {
        const deletedChar = currentValue[cursorPosition] ?? ''; // "12/34"[2] → "/"
        const deletedDelimiter = !isUserCharacter(deletedChar); // "/" → true (is delimiter)

        if (deletedDelimiter) {
          // true (will execute for "/" deletion)
          const beforeCursor = newInputValue.substring(0, cursorPosition); // "12" (before cursor)
          const afterCursor = newInputValue.substring(cursorPosition); // "34" (after cursor)
          const rawBefore = stripPatternCharacters(beforeCursor); // "12" → "12"
          const rawAfter = stripPatternCharacters(afterCursor); // "34" → "34"

          rawValue = rawBefore.slice(0, -1) + rawAfter; // "12".slice(0,-1) + "34" → "1" + "34" → "134"

          // Position cursor after remaining chars
          infoRef.current.cursorPosition =
            beforeCursor.replace(/([\d\w]+)[^\dA-z]+$/, '$1').length - 1; // "12" → 2-1 → 1
        }
      }

      const formattedValue = format(rawValue, pattern); // format("134", "##/##") → "13/4"
      infoRef.current.endOfSection = false;

      // Handle cursor positioning when typing (not deleting)
      if (!didDelete) {
        // User types "2" in "1|" → becomes "12|/" → should jump to "12/|"
        const nextChar = formattedValue[cursorPosition]; // "12/"[2] → "/" (delimiter)
        const nextIsDelimiter = nextChar ? !isUserCharacter(nextChar) : false; // "/" → true

        const remainingText = formattedValue.substring(cursorPosition); // "12/".substring(2) → "/"
        const nextUserCharIndex = remainingText.search(/[\dA-z]/); // "/".search() → -1 (no user chars)
        const hasMoreUserChars = nextUserCharIndex !== -1; // -1 !== -1 → false

        infoRef.current.endOfSection = nextIsDelimiter && !hasMoreUserChars; // true && false → false

        // Move cursor past auto-inserted delimiters for smooth typing
        if (nextIsDelimiter && hasMoreUserChars) {
          const prevChar = formattedValue[cursorPosition - 1] ?? '';
          const prevIsDelimiter = !isUserCharacter(prevChar);

          if (prevIsDelimiter) {
            infoRef.current.cursorPosition = cursorPosition + nextUserCharIndex + 1;
          }
        }
      }

      onChange?.({ name, value: formattedValue, rawValue });
      setInternalValue(formattedValue);
    },
    [pattern, onChange, internalValue],
  );

  // Apply calculated cursor position after value updates
  useEffect(() => {
    const { cursorPosition, endOfSection } = infoRef.current;

    if (endOfSection || cursorPosition === undefined) return; // Skip if no position or end section

    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [internalValue]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.currentTarget && inputRef.current !== event.currentTarget) {
      (inputRef as React.MutableRefObject<HTMLInputElement>).current = event.currentTarget;
    }
  }, []);

  return {
    formattedValue: internalValue,
    handleChange,
    handleKeyDown,
    maxLength,
  };
};
