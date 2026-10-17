import type { ConstraintCode, FieldConstraints, FieldRecord } from './types';

// HTML spec "valid e-mail address" grammar, as browsers apply it to type=email.
const EMAIL_PATTERN = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const compiledPatterns = new Map<string, RegExp | null>();

/**
 * Compile a `pattern` attribute the way browsers do: anchored to the whole
 * value with the `v` flag, falling back to `u`. An uncompilable pattern is
 * ignored rather than failing the field, matching browser behaviour.
 */
function compilePattern(pattern: string): RegExp | null {
  if (compiledPatterns.has(pattern)) {
    return compiledPatterns.get(pattern) ?? null;
  }
  let compiled: RegExp | null = null;
  for (const flags of ['v', 'u']) {
    try {
      compiled = new RegExp(`^(?:${pattern})$`, flags);
      break;
    } catch {
      compiled = null;
    }
  }
  compiledPatterns.set(pattern, compiled);
  return compiled;
}

function isMissing(constraints: FieldConstraints, field: FieldRecord): boolean {
  switch (constraints.kind) {
    case 'checkbox':
      return !field.value;
    case 'radio':
      // A multiple choice holds an array: none picked is missing too.
      return (
        field.value === null ||
        field.value === undefined ||
        (Array.isArray(field.value) && field.value.length === 0)
      );
    default:
      return displayValue(field) === '';
  }
}

function displayValue(field: FieldRecord): string {
  if (field.getDisplayValue) {
    return field.getDisplayValue();
  }
  return field.value === null || field.value === undefined ? '' : String(field.value);
}

/**
 * Evaluate a field's declarative constraints with browser semantics:
 * `required` first, then `type=email`, then `pattern`; the latter two only
 * apply to a non-empty value. Returns the first failing constraint.
 */
export function evaluateConstraints(field: FieldRecord): ConstraintCode | null {
  const { constraints } = field;
  if (!constraints) {
    return null;
  }
  if (constraints.required && isMissing(constraints, field)) {
    return 'required';
  }
  if (constraints.kind !== 'text') {
    return null;
  }
  const value = displayValue(field);
  if (value === '') {
    return null;
  }
  if (constraints.email && !EMAIL_PATTERN.test(value)) {
    return 'email';
  }
  if (constraints.pattern) {
    const compiled = compilePattern(constraints.pattern);
    if (compiled && !compiled.test(value)) {
      return 'pattern';
    }
  }
  return null;
}
