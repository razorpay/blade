/**
 * Blade's TextInput `format`: a pattern where `#` takes one typed
 * character and anything else is a delimiter the field places itself
 * (`#### #### #### ####`, `##/##`). Ported from React's useFormattedInput,
 * quirks included: typing keeps letters and digits only, and a delimiter
 * before the first `#` shows on an empty field (`(###)` reads `(`).
 */

/** The typed characters of a masked text: delimiters dropped. */
export function stripMask(value: string): string {
  // React's character class, `A-z` and all.
  return value.replace(/[^\dA-z]/g, '');
}

function isUserCharacter(character: string): boolean {
  return /[\dA-z]/.test(character);
}

/** Lays `raw` (typed characters only) into `pattern`: `('1234', '##/##')` → `12/34`. */
export function applyMask(raw: string, pattern: string): string {
  if (!pattern) {
    return raw;
  }
  let result = '';
  let index = 0;
  for (const slot of pattern) {
    if (slot === '#') {
      if (index >= raw.length) {
        break;
      }
      result += raw[index];
      index += 1;
    } else {
      result += slot;
    }
  }
  return result;
}

/** Any text, typed or stored, as the field shows it under `pattern`. */
export function maskValue(value: unknown, pattern: string): string {
  return applyMask(stripMask(value === null || value === undefined ? '' : String(value)), pattern);
}

export interface MaskEdit {
  /** The control's new text, masked. */
  value: string;
  /** Where the caret goes; null = leave it where the platform put it. */
  caret: number | null;
}

/**
 * One edit of a masked control, as React's handleChange: `previous` is the
 * text before it, `next` the control's text after it and `caret` where the
 * caret sits now. Deleting a delimiter deletes the character before it;
 * typing up to a delimiter steps the caret over it.
 */
export function maskEdit(previous: string, next: string, caret: number, pattern: string): MaskEdit {
  const didDelete = next.length < previous.length;
  let cursor = caret;
  let raw = stripMask(next);

  if (didDelete && !isUserCharacter(previous[caret] ?? '')) {
    const before = next.substring(0, caret);
    raw = stripMask(before).slice(0, -1) + stripMask(next.substring(caret));
    cursor = before.replace(/([\d\w]+)[^\dA-z]+$/, '$1').length - 1;
  }

  const value = applyMask(raw, pattern);
  let endOfSection = false;

  if (!didDelete) {
    const nextChar = value[caret];
    const nextIsDelimiter = nextChar ? !isUserCharacter(nextChar) : false;
    const nextUserCharIndex = value.substring(caret).search(/[\dA-z]/);
    const hasMoreUserChars = nextUserCharIndex !== -1;
    endOfSection = nextIsDelimiter && !hasMoreUserChars;

    if (nextIsDelimiter && hasMoreUserChars) {
      const prevIsDelimiter = !isUserCharacter(value[caret - 1] ?? '');
      if (prevIsDelimiter) {
        cursor = caret + nextUserCharIndex + 1;
      } else if (previous[caret] === value[caret]) {
        cursor = caret + 1;
      }
    }
  }

  return { value, caret: endOfSection ? null : cursor };
}
