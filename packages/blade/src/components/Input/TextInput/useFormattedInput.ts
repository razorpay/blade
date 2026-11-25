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
  const openBrackets: string[] = [];

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
      // Track opening brackets so their matching closings are always emitted.
      if ('([{'.includes(patternChar)) openBrackets.push(patternChar);

      // Stop before appending a delimiter when the value ended exactly on a
      // group boundary; otherwise a trailing delimiter leaks into the output
      // (e.g. 16 digits into "#### #### #### #### ###" → "6785 ").
      // Closing brackets that match an already-emitted opening bracket are
      // always emitted so structural delimiters like "(###)" stay intact
      // (e.g. format('123', '(###) ###-####') → "(123)" not "(123").
      if (valueIndex >= value.length) {
        if (')]}'.includes(patternChar) && openBrackets.length > 0) {
          openBrackets.pop();
          result += patternChar;
          continue;
        }
        break;
      }

      if (')]}'.includes(patternChar) && openBrackets.length > 0) openBrackets.pop();
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
  const inputRef = useRef<HTMLInputElement | null>(null);
  const infoRef = useRef<{
    cursorPosition?: number;
    endOfSection?: boolean;
  }>({});

  const maxLength = useMemo(() => pattern?.length, [pattern]);

  // In controlled mode the parent's `value` is the source of truth, so reconcile
  // the display against it after EVERY change — not just when `value` changes.
  // Depending on `internalValue` is what makes consumer sanitisation stick: when
  // the parent strips a just-typed character (e.g. a letter in a digit-only card
  // field), the sanitised value is byte-identical to the previous one, so a
  // `value`-only effect never re-runs and the rejected character lingers on
  // screen. Re-deriving here snaps the field back to exactly what the consumer
  // stored (letter stripping, IIN truncation, programmatic prefill/reset —
  // including DatePicker writing the value from the calendar).
  useEffect(() => {
    if (!pattern) return;
    // Uncontrolled (`value` never supplied): keep the optimistic display so
    // typing works without a parent feeding the value back.
    if (userValue === undefined) return;

    // Controlled: empty string resets to the formatted shell; otherwise reformat
    // from the raw characters the consumer stored.
    const expected =
      userValue === '' ? format('', pattern) : format(stripPatternCharacters(userValue), pattern);

    if (expected !== internalValue) {
      setInternalValue(expected);
    }
  }, [userValue, pattern, internalValue]);

  // Apply calculated cursor position after value updates
  useEffect(() => {
    const { cursorPosition, endOfSection } = infoRef.current;

    if (endOfSection || cursorPosition === undefined) return; // Skip if no position or end section

    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [internalValue]);

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

          // Removes trailing non-alphanumeric characters from the end of the string, preserving the last alphanumeric word before them.
          infoRef.current.cursorPosition =
            beforeCursor.replace(/([\d\w]+)[^\dA-z]+$/, '$1').length - 1;
        }
      }

      const formattedValue = format(rawValue, pattern); // format("134", "##/##") → "13/4"
      infoRef.current.endOfSection = false;

      // Handle cursor positioning when typing (not deleting).
      // Anchor on user characters rather than raw position: selectionStart counts
      // positions in the pre-format string, so it ignores delimiters the formatter
      // inserts before the caret at a group boundary (e.g. "1234" + "5" → "1234 5":
      // the space pushes "5" to index 5, so a raw caret of 5 would sit *before* it).
      if (!didDelete) {
        const userCharsBeforeCursor = stripPatternCharacters(
          newInputValue.substring(0, cursorPosition),
        ).length;

        let seenUserChars = 0;
        let nextCursor = formattedValue.length;
        for (let i = 0; i < formattedValue.length; i++) {
          if (seenUserChars === userCharsBeforeCursor) {
            nextCursor = i;
            break;
          }
          if (isUserCharacter(formattedValue[i])) seenUserChars++;
        }
        infoRef.current.cursorPosition = nextCursor;
        infoRef.current.endOfSection = false;
      }

      onChange?.({ name, value: formattedValue, rawValue });
      setInternalValue(formattedValue);
    },
    [pattern, onChange, internalValue],
  );

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.currentTarget && inputRef.current !== event.currentTarget) {
      inputRef.current = event.currentTarget;
    }
  }, []);

  return {
    formattedValue: internalValue,
    handleChange,
    handleKeyDown,
    maxLength,
  };
};
