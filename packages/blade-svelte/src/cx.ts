/**
 * Joins class fragments. No conflict resolution on purpose: recipes never
 * emit outer spacing/position and a caller's `class` adds only outer
 * spacing/position, so conflicts are impossible by contract — overriding a
 * recipe's internal tokens is not a supported API.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
