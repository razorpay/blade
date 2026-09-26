/**
 * Where the caret lands after `raw` is re-parsed and re-formatted: at the end
 * of the formatted text the caret's left half produces. A format that inserts
 * separators (`4111 1111`) keeps the caret after the same digits it was after
 * before the rewrite. Returns null when the caret sits at the end of `raw` —
 * a rewrite puts it at the end anyway, so the anatomy must leave it alone.
 */
export function caretAfterFormat(
  raw: string,
  selectionStart: number | null,
  parse: (value: string) => unknown,
  format: (value: unknown) => unknown
): number | null {
  if (selectionStart === null || selectionStart >= raw.length) {
    return null;
  }
  const left = format(parse(raw.slice(0, selectionStart)));
  return left === null || left === undefined ? 0 : String(left).length;
}
