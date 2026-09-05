/**
 * Standard Indian Permanent Account Number (PAN) regular expression pattern.
 * Format: 5 uppercase letters, 4 digits, 1 uppercase letter (e.g., ABCDE1234F).
 */
const PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

/**
 * Validates a PAN number by trimming whitespace and matching against the 10-character PAN pattern (`^[A-Z]{5}[0-9]{4}[A-Z]{1}$`).
 *
 * @param pan - The PAN string to validate.
 * @returns `true` if the input is a valid 10-character PAN number, `false` otherwise.
 */
const validatePAN = (pan?: string | null): boolean => {
  if (!pan || typeof pan !== 'string') {
    return false;
  }

  const trimmed = pan.trim().toUpperCase();
  return PAN_REGEX.test(trimmed);
};

const isValidPAN = validatePAN;

export { PAN_REGEX, validatePAN, isValidPAN };
