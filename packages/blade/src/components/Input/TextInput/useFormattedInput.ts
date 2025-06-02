import React, { useCallback, useRef, useState, useEffect } from 'react';
import type { FormInputOnEvent } from '~components/Form/FormTypes';

/**
 * No-operation function used as default callback
 */
function noop(): void {}

/**
 * Formats a value according to a pattern where # represents user input characters
 * This algorithm handles cursor positioning and edge cases more elegantly than simple replacement
 *
 * @param value - Raw input value (user-entered characters)
 * @param pattern - Format pattern (e.g., "#### #### #### ####")
 * @returns Formatted value with pattern characters inserted
 *
 * @example
 * format("1234567890123456", "#### #### #### ####") // "1234 5678 9012 3456"
 * format("1234", "##/##") // "12/34"
 */
function format(value: string, pattern: string): string {
  if (!pattern) return value;

  const placeholder = '#';
  let endOfValue = 0;
  let characterIndex = 0;
  const newValue = value;

  return [...pattern]
    .map((patternCharacter, index) => {
      const character = newValue[characterIndex];
      const patternLength = pattern.length;

      if (!endOfValue) {
        if (index === patternLength - 1) endOfValue = patternLength;
        if (character === undefined) {
          endOfValue = pattern.indexOf(placeholder, index);
        }
      }

      if (patternCharacter === placeholder) {
        characterIndex = characterIndex + 1;
        return character;
      }

      return patternCharacter;
    })
    .splice(0, endOfValue)
    .join('');
}

/**
 * Removes all pattern characters from a formatted value, leaving only user input
 * Supports both digits and alphanumeric characters
 *
 * @param value - Formatted value with delimiters
 * @returns Raw value with only user input characters
 *
 * @example
 * stripPatternCharacters("1234 5678 9012 3456") // "1234567890123456"
 * stripPatternCharacters("12/34") // "1234"
 */
function stripPatternCharacters(value: string): string {
  return value.replace(/[^\dA-z]/g, '');
}

/**
 * Determines if a character is user input (digit or letter) vs pattern character
 *
 * @param character - Character to test
 * @returns True if character is user input, false if it's a pattern delimiter
 *
 * @example
 * isUserCharacter('1') // true
 * isUserCharacter('A') // true
 * isUserCharacter(' ') // false
 * isUserCharacter('/') // false
 */
function isUserCharacter(character: string): boolean {
  return /[\dA-z]/.test(character);
}

/**
 * Gets the maximum length based on the format pattern
 * @param pattern - Format pattern (e.g., "#### #### #### ####")
 * @returns Maximum number of characters allowed in the formatted input
 */
export const getMaxLengthFromPattern = (pattern: string): number => {
  return pattern ? pattern.length : 0;
};

/**
 * Gets the maximum number of user input characters based on the format pattern
 * @param pattern - Format pattern (e.g., "#### #### #### ####")
 * @returns Maximum number of user input characters allowed
 */
export const getMaxUserCharactersFromPattern = (pattern: string): number => {
  return pattern ? (pattern.match(/#/g) || []).length : 0;
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
 * Hook for managing formatted input with advanced cursor positioning and edge case handling
 *
 * This hook provides:
 * - Pattern-based formatting with # as placeholder for user input
 * - Intelligent cursor positioning during typing and deletion
 * - Proper handling of delimiter deletion
 * - End-of-section detection for better UX
 * - Support for both controlled and uncontrolled inputs
 *
 * @param props - Configuration object
 * @param props.format - Format pattern where # represents user input positions
 * @param props.onChange - Standard onChange callback, will receive rawValue when format is provided
 * @param props.value - Controlled value
 * @param props.defaultValue - Default value for uncontrolled input
 *
 * @returns Object with formatted value and event handlers
 *
 * @example
 * const { formattedValue, handleChange } = useFormattedInput({
 *   format: "#### #### #### ####",
 *   onChange: ({ value, rawValue }) => {
 *     console.log('Formatted:', value); // "1234 5678"
 *     console.log('Raw:', rawValue);    // "12345678" (only when format is provided)
 *   }
 * });
 */
export const useFormattedInput = ({
  format: pattern,
  onChange,
  value: userValue = '',
  defaultValue = '',
}: UseFormattedInputProps): UseFormattedInputReturn => {
  const [value, setValue] = useState(() => format(userValue || defaultValue, pattern || ''));
  const inputRef = useRef<HTMLInputElement>(null);
  const infoRef = useRef<{
    cursorPosition?: number;
    endOfSection?: boolean;
  }>({});

  /**
   * Handles input changes with intelligent cursor positioning and formatting
   *
   * Algorithm:
   * 1. Detect if user deleted characters
   * 2. Handle deletion of pattern characters (delimiters)
   * 3. Format the raw input according to pattern
   * 4. Calculate optimal cursor position
   * 5. Detect end-of-section scenarios
   */
  const handleChange: FormInputOnEvent = useCallback(
    ({ name, value: inputValue }) => {
      if (!pattern) {
        const cleanValue = inputValue || '';
        // No formatting - call onChange with just value (no rawValue)
        onChange?.({ name, value: cleanValue });
        setValue(cleanValue);
        return;
      }

      const currentValue = value;
      const newInputValue = inputValue || '';
      const cursorPosition = inputRef.current?.selectionStart || 0;
      const didDelete = newInputValue.length < currentValue.length;

      infoRef.current.cursorPosition = cursorPosition;

      let rawValue = stripPatternCharacters(newInputValue);

      // Handle deletion of pattern characters (delimiters)
      if (didDelete) {
        const patternCharacterDeleted = !isUserCharacter([...currentValue][cursorPosition] || '');

        if (patternCharacterDeleted) {
          const firstBit = newInputValue.substr(0, cursorPosition);
          const rawFirstBit = stripPatternCharacters(firstBit);

          rawValue =
            rawFirstBit.substr(0, rawFirstBit.length - 1) +
            stripPatternCharacters(newInputValue.substr(cursorPosition, newInputValue.length));

          infoRef.current.cursorPosition = firstBit.replace(/([\d\w]+)[^\dA-z]+$/, '$1').length - 1;
        }
      }

      const formattedValue = format(rawValue, pattern);

      infoRef.current.endOfSection = false;

      // Handle cursor positioning for insertions
      if (!didDelete) {
        const formattedCharacters = [...formattedValue];
        const nextCharacter = formattedCharacters[cursorPosition];
        const nextCharacterIsPattern = !isUserCharacter(nextCharacter || '');
        const nextUserCharacterIndex = formattedValue.substr(cursorPosition).search(/[\dA-z]/);
        const numbersAhead = nextUserCharacterIndex !== -1;

        infoRef.current.endOfSection = nextCharacterIsPattern && !numbersAhead;

        if (
          nextCharacterIsPattern &&
          !isUserCharacter(formattedCharacters[cursorPosition - 1] || '') &&
          numbersAhead
        ) {
          infoRef.current.cursorPosition = cursorPosition + nextUserCharacterIndex + 1;
        }
      }

      // Call onChange with both formatted value and rawValue when formatting is enabled
      onChange?.({ name, value: formattedValue, rawValue });
      setValue(formattedValue);
    },
    [pattern, onChange, value],
  );

  /**
   * Applies cursor position after value changes
   * Skips positioning when at end of section to prevent cursor jumping
   */
  useEffect(() => {
    const { cursorPosition, endOfSection } = infoRef.current;

    if (endOfSection || cursorPosition === undefined) return;

    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [value]);

  /**
   * Handles keyboard events - currently a pass-through but available for future enhancements
   */
  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    // Store reference for potential cursor management
    if (event.currentTarget && inputRef.current !== event.currentTarget) {
      // Update the ref to point to the current input element
      (inputRef as React.MutableRefObject<HTMLInputElement>).current = event.currentTarget;
    }
  }, []);

  return {
    formattedValue: value,
    handleChange,
    handleKeyDown,
    maxLength: pattern ? getMaxLengthFromPattern(pattern) : undefined,
  };
};
