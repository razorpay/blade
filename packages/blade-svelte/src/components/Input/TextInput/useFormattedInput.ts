/**
 * Input formatting utilities
 * Ported from packages/blade/src/components/Input/TextInput/useFormattedInput.ts
 *
 * These are pure functions used by TextInput.svelte to implement the formatting
 * logic inline (with Svelte runes). They live in a plain `.ts` module so they
 * can be imported anywhere without dragging in reactive state.
 */

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
