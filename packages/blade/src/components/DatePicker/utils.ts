/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { DatePickerType, DatePickerValue } from '@mantine/dates';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const dayjs_locales = [
  'af',
  'ar',
  'ar-dz',
  'ar-kw',
  'ar-ly',
  'ar-ma',
  'ar-sa',
  'ar-tn',
  'az',
  'be',
  'bg',
  'bm',
  'bn',
  'bo',
  'br',
  'bs',
  'ca',
  'cs',
  'cv',
  'cy',
  'da',
  'de',
  'de-at',
  'de-ch',
  'dv',
  'el',
  'en',
  'en-au',
  'en-ca',
  'en-gb',
  'en-ie',
  'en-il',
  'en-nz',
  'en-SG',
  'eo',
  'es',
  'es-do',
  'es-us',
  'et',
  'eu',
  'fa',
  'fi',
  'fo',
  'fr',
  'fr-ca',
  'fr-ch',
  'fy',
  'ga',
  'gd',
  'gl',
  'gom-latn',
  'gu',
  'he',
  'hi',
  'hr',
  'hu',
  'hy-am',
  'id',
  'is',
  'it',
  'it-ch',
  'ja',
  'jv',
  'ka',
  'kk',
  'km',
  'kn',
  'ko',
  'ku',
  'ky',
  'lb',
  'lo',
  'lt',
  'lv',
  'me',
  'mi',
  'mk',
  'ml',
  'mn',
  'mr',
  'ms',
  'ms-my',
  'mt',
  'my',
  'nb',
  'ne',
  'nl',
  'nl-be',
  'nn',
  'oc-lnc',
  'pa-in',
  'pl',
  'pt',
  'pt-br',
  'ro',
  'ru',
  'sd',
  'se',
  'si',
  'sk',
  'sl',
  'sq',
  'sr',
  'sr-cyrl',
  'ss',
  'sv',
  'sw',
  'ta',
  'te',
  'tet',
  'tg',
  'th',
  'tl-ph',
  'tlh',
  'tr',
  'tzl',
  'tzm',
  'tzm-latn',
  'ug-cn',
  'uk',
  'ur',
  'uz',
  'uz-latn',
  'vi',
  'x-pseudo',
  'yo',
  'zh-cn',
  'zh-hk',
  'zh-tw',
];

// https://github.com/iamkun/dayjs/issues/732#issuecomment-554383261
function patchLocale(locale: string): string | boolean {
  if (['en', 'en-us'].includes(locale)) return 'en';
  if (locale === 'zn') return 'zh-cn';
  if (locale === 'no') return 'nb';
  if (dayjs_locales.includes(locale)) return locale;
  return false;
}

function convertIntlToDayjsLocale(lang: string): string {
  lang = lang.toLowerCase();
  const locale = patchLocale(lang) || (lang.includes('-') && patchLocale(lang.split('-')[0]));
  if (!locale) return 'en';

  return `${locale}`;
}

function isScriptLoaded(src: string): boolean {
  return Boolean(document.querySelector(`script[src="${src}"]`));
}

/**
 * Used to dynamically load a script
 */
function loadScript(src: string, callback?: () => void): void {
  if (isScriptLoaded(src)) {
    callback?.();
    return;
  }
  const localeScript = document.createElement('script');
  localeScript.async = true;
  localeScript.src = src;
  localeScript.onload = () => callback?.();
  document.head.appendChild(localeScript);
}

interface DateFormatterInput {
  type: DatePickerType;
  date: DatePickerValue<DatePickerType>;
  locale: string;
  format: string;
  labelSeparator: string;
}

type DateFormatter = (input: DateFormatterInput) => string;

function defaultDateFormatter({ type, date, locale, format, labelSeparator }: DateFormatterInput) {
  const formatDate = (value: Date) => dayjs(value).locale(locale).format(format);

  if (type === 'default') {
    return date === null ? '' : formatDate(date as Date);
  }

  if (type === 'range' && Array.isArray(date)) {
    if (date[0] && date[1]) {
      return `${formatDate(date[0])} ${labelSeparator} ${formatDate(date[1])}`;
    }

    if (date[0]) {
      return `${formatDate(date[0])} ${labelSeparator} `;
    }

    return '';
  }

  return '';
}

interface GetFormattedDateInput extends DateFormatterInput {
  formatter?: DateFormatter;
}

function getFormattedDate({ formatter, ...others }: GetFormattedDateInput) {
  return (formatter || defaultDateFormatter)(others);
}

const rangeFormattedValue = (startValue: string, endValue: string) => {
  // Both values exist
  if (startValue && endValue) {
    if (startValue === endValue) {
      return startValue; // Same date, show single value
    }
    return `${startValue} - ${endValue}`; // Different dates, show range
  }

  // Only start value exists
  if (startValue) {
    return `${startValue} - `;
  }

  // Only end value exists
  if (endValue) {
    return ` - ${endValue}`;
  }

  // No values
  return '';
};

const rangeInputPlaceHolder = (placeholder: string | undefined, format: string) => {
  if (placeholder) {
    return `${placeholder} - ${placeholder}`;
  }
  return `${format} - ${format}`;
};

const finalInputFormat = (startValue: string, endValue: string, format: string | undefined) => {
  // For case: when start and end are the same, return the format
  if (startValue === endValue && (startValue || endValue)) {
    return format;
  }
  return `${format} - ${format}`;
};

/**
 * Converts date format string to TextInput pattern for masking.
 * TextInput format only recognizes # as input placeholder, so we replace
 * date characters (Y,M,D) with # while preserving delimiters.
 *
 * @example "DD/MM/YYYY" - "##/##/####"
 * @example "MMMM" - "################" (longest month: "September")
 * @example "MMM" - "###"
 */
const getTextInputFormat = (formatStr?: string, isRangeInput?: boolean): string => {
  if (!formatStr) {
    return isRangeInput ? '##/##/#### - ##/##/####' : '##/##/####';
  } else if (formatStr === 'MMMM') {
    return formatStr.replace(/MMMM/g, '#########');
  }
  return formatStr.replace(/[YMD]/g, '#');
};

/**
 * Validates date string using DayJS strict parsing and business rules
 *
 * @param dateStr - The date string to validate in DD/MM/YYYY format
 * @returns Object with validation result, error message if invalid, and parsed Date if valid
 *
 * @example
 * // Valid date
 * validateDateComponents("25/12/2024")
 * // → { isValid: true, parsedDate: Date(2024, 11, 25) }
 *
 * @example
 * // Invalid date (non-existent)
 * validateDateComponents("31/02/2024")
 * // → { isValid: false, error: "Invalid date" }
 *
 * @example
 * // Invalid year range
 * validateDateComponents("25/12/999")
 * // → { isValid: false, error: "Invalid year" }
 *
 * @example
 * // Empty input
 * validateDateComponents("")
 * // → { isValid: true }
 */
const validateDateComponents = (
  dateStr: string,
): {
  isValid: boolean;
  error?: string;
  parsedDate?: Date;
} => {
  // Empty strings are considered valid (user hasn't started typing)
  if (!dateStr?.trim()) {
    return { isValid: true };
  }

  // Use DayJS strict parsing to validate DD/MM/YYYY format and date existence
  const parsed = dayjs(dateStr, 'DD/MM/YYYY', true);

  // DayJS strict mode catches invalid days/months and non-existent dates (e.g., Feb 30th)
  if (!parsed.isValid()) {
    return { isValid: false, error: 'Invalid date' };
  }

  // Business rule: restrict year range to reasonable values for most applications
  const year = parsed.year();
  if (year < 1000 || year > 3000) {
    return { isValid: false, error: 'Invalid year' };
  }

  // Return both validation result AND parsed date to avoid double parsing
  return { isValid: true, parsedDate: parsed.toDate() };
};

/**
 * Detects and parses special single date formats (MMM, MMMM, YYYY)
 * These formats preserve current date/month/year and only change the specified component
 *
 * @param inputValue - The input string to parse
 * @param format - The expected format ('MMM', 'MMMM', or 'YYYY')
 * @returns Object with special format detection, parsed date, and validation result
 *
 * @example
 * // Year format - preserves current month/day, changes year
 * parseSpecialSingleFormat("2024", "YYYY")
 * // → { isSpecialFormat: true, parsedDate: Date(2024, currentMonth, currentDay), shouldBlock: false }
 *
 * @example
 * // Short month format - preserves current day/year, changes month
 * parseSpecialSingleFormat("Aug", "MMM")
 * // → { isSpecialFormat: true, parsedDate: Date(currentYear, 7, currentDay), shouldBlock: false }
 *
 * @example
 * // Full month format - preserves current day/year, changes month
 * parseSpecialSingleFormat("August", "MMMM")
 * // → { isSpecialFormat: true, parsedDate: Date(currentYear, 7, currentDay), shouldBlock: false }
 *
 * @example
 * // Invalid year
 * parseSpecialSingleFormat("999", "YYYY")
 * // → { isSpecialFormat: true, shouldBlock: true }
 *
 * @example
 * // Not a special format
 * parseSpecialSingleFormat("25/12/2024", "DD/MM/YYYY")
 * // → { isSpecialFormat: false, shouldBlock: false }
 */
const parseSpecialSingleFormat = (
  inputValue: string,
  format?: string,
): { isSpecialFormat: boolean; parsedDate?: Date; shouldBlock: boolean } => {
  if (!format) return { isSpecialFormat: false, shouldBlock: false };

  const trimmedInput = inputValue.trim();
  const today = new Date();

  // Handle year-only format (YYYY) - keep current month and day, change year
  if (format === 'YYYY' && /^\d{4}$/.test(trimmedInput)) {
    const year = parseInt(trimmedInput, 10);
    if (year >= 1000 && year <= 3000) {
      return {
        isSpecialFormat: true,
        parsedDate: new Date(year, today.getMonth(), today.getDate()),
        shouldBlock: false,
      };
    } else {
      return {
        isSpecialFormat: true,
        shouldBlock: true,
      };
    }
  }

  // Handle month formats (MMM, MMMM) - keep current day and year, change month
  if ((format === 'MMM' || format === 'MMMM') && trimmedInput.length >= 3) {
    // Using DayJS to parse month names (handles both short "Aug" and full "August")
    const monthDate = dayjs(trimmedInput, format === 'MMM' ? 'MMM' : 'MMMM', true);

    if (!monthDate.isValid()) {
      return {
        isSpecialFormat: true,
        shouldBlock: true,
      };
    }
    return {
      isSpecialFormat: true,
      parsedDate: new Date(today.getFullYear(), monthDate.month(), today.getDate()),
      shouldBlock: false,
    };
  }

  return { isSpecialFormat: false, shouldBlock: false };
};

/**
 * Validates and parses date input with comprehensive error handling and constraint checking
 * Combines validation + parsing to avoid redundant operations and supports both single dates and ranges
 *
 * @param inputValue - The input string to validate and parse
 * @param isRange - Whether this is a range input (true) or single date (false)
 * @param format - The expected date format ('DD/MM/YYYY', 'MMM', 'MMMM', 'YYYY')
 * @param options - Additional validation constraints
 * @param options.excludeDate - Function to exclude specific dates (single dates only)
 * @param options.minDate - Minimum allowed date
 * @param options.maxDate - Maximum allowed date
 * @returns Object with shouldBlock flag, optional error message, and parsed values if valid
 *
 * @example
 * // Valid single date
 * validateAndParseDateInput("25/12/2024", false, "DD/MM/YYYY")
 * // → { shouldBlock: false, parsedValue: Date(2024, 11, 25) }
 *
 * @example
 * // Valid range input
 * validateAndParseDateInput("25/12/2024 - 31/12/2024", true, "DD/MM/YYYY")
 * // → { shouldBlock: false, parsedValue: [Date(2024, 11, 25), Date(2024, 11, 31)] }
 *
 * @example
 * // Invalid date with error
 * validateAndParseDateInput("31/02/2024", false, "DD/MM/YYYY")
 * // → { shouldBlock: true, error: "Invalid date" }
 *
 * @example
 * // Date excluded by constraint
 * validateAndParseDateInput("25/12/2024", false, "DD/MM/YYYY", {
 *   excludeDate: (date) => date.getDay() === 0 // No Sundays
 * })
 * // → { shouldBlock: true, error: "Date is not allowed" }
 *
 * @example
 * // Special format - year only
 * validateAndParseDateInput("2024", false, "YYYY")
 * // → { shouldBlock: false, parsedValue: Date(2024, currentMonth, currentDay) }
 *
 * @example
 * // Incomplete input - allow continued typing
 * validateAndParseDateInput("25/12", false, "DD/MM/YYYY")
 * // → { shouldBlock: false } (no parsedValue, allows user to continue typing)
 */
const validateAndParseDateInput = (
  inputValue: string,
  isRange: boolean,
  format?: string,
  options?: {
    excludeDate?: (date: Date) => boolean;
    minDate?: Date;
    maxDate?: Date;
  },
): {
  shouldBlock: boolean;
  error?: string;
  parsedValue?: Date | null | [Date | null, Date | null];
} => {
  // Allow empty input - user hasn't started typing yet
  if (!inputValue?.trim()) return { shouldBlock: false };

  // Handle special single date formats (MMM, MMMM, YYYY) - skip normal validation
  if (!isRange && format) {
    const specialParse = parseSpecialSingleFormat(inputValue, format);
    if (specialParse.isSpecialFormat && !specialParse.shouldBlock) {
      return { shouldBlock: false, parsedValue: specialParse.parsedDate || null };
    } else if (specialParse.shouldBlock) {
      return { shouldBlock: true, error: 'Invalid date' };
    }
  }

  if (isRange) {
    // Split range input on hyphen separator (e.g., "25/12/2024 - 31/12/2024")
    const parts = inputValue.split(/\s*-\s*/);

    // Block incomplete input to prevent premature validation (e.g., "25/12/202" is being typed)
    if (
      (parts[0]?.trim() && parts[0].trim().length < 10) ||
      (parts[1]?.trim() && parts[1].trim().length < 10)
    ) {
      return { shouldBlock: true, error: 'Invalid date' };
    }

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    // Validate and parse start date if it looks complete (10+ chars = DD/MM/YYYY)
    if (parts[0]?.trim() && parts[0].trim().length >= 10) {
      const startValidation = validateDateComponents(parts[0].trim());
      if (!startValidation.isValid) {
        return { shouldBlock: true, error: `Start date: ${startValidation.error}` };
      }
      // Use the already-parsed date from validation to avoid double parsing
      startDate = startValidation.parsedDate || null;
    }

    // Validate and parse end date if it looks complete
    if (parts[1]?.trim() && parts[1].trim().length >= 10) {
      const endValidation = validateDateComponents(parts[1].trim());
      if (!endValidation.isValid) {
        return { shouldBlock: true, error: `End date: ${endValidation.error}` };
      }
      // Use the already-parsed date from validation to avoid double parsing
      endDate = endValidation.parsedDate || null;
    }

    // Business logic: start date cannot be after end date
    if (startDate && endDate && startDate > endDate) {
      return { shouldBlock: true, error: 'Start date cannot be greater than end date' };
    }

    // Additional validation for date range constraints
    if (options) {
      if (startDate && options.minDate && dayjs(startDate).isBefore(dayjs(options.minDate))) {
        return { shouldBlock: true, error: 'Start date is not allowed' };
      }
      if (startDate && options.maxDate && dayjs(startDate).isAfter(dayjs(options.maxDate))) {
        return { shouldBlock: true, error: 'Start date is not allowed' };
      }
      if (endDate && options.minDate && dayjs(endDate).isBefore(dayjs(options.minDate))) {
        return { shouldBlock: true, error: 'End date is not allowed' };
      }
      if (endDate && options.maxDate && dayjs(endDate).isAfter(dayjs(options.maxDate))) {
        return { shouldBlock: true, error: 'End date is not allowed' };
      }
    }

    // Return parsed dates ready for setControlledValue
    return { shouldBlock: false, parsedValue: [startDate, endDate] };
  } else if (inputValue.length >= 10) {
    // Single date: validate and parse if it looks complete
    const validation = validateDateComponents(inputValue);
    if (!validation.isValid) {
      return { shouldBlock: true, error: validation.error };
    }

    const parsedDate = validation.parsedDate;

    // Additional validation for single date constraints
    if (options && parsedDate) {
      if (options.excludeDate?.(parsedDate)) {
        return { shouldBlock: true, error: 'Date is not allowed' };
      }
      if (options.minDate && dayjs(parsedDate).isBefore(dayjs(options.minDate))) {
        return { shouldBlock: true, error: 'Date is not allowed' };
      }
      if (options.maxDate && dayjs(parsedDate).isAfter(dayjs(options.maxDate))) {
        return { shouldBlock: true, error: 'Date is not allowed' };
      }
    }

    // Return parsed date ready for setControlledValue
    return { shouldBlock: false, parsedValue: parsedDate || null };
  }

  // Input is incomplete but valid so far - allow continued typing
  return { shouldBlock: false };
};

/**
 * Removes date delimiters (slashes) from formatted date strings for internal processing
 * Used to convert external formatted values to internal state for easier validation and length checks
 *
 * @param str - The date string with delimiters
 * @returns String without delimiters, or empty string if input is null/undefined
 *
 * @example
 * // Remove slashes from single date
 * stripDelimiters("25/12/2024")
 * // → "25122024"
 *
 * @example
 * // Handle null/undefined input
 * stripDelimiters(undefined)
 * // → ""
 *
 * @example
 * // Used for internal state conversion
 * stripDelimiters("31/12/2024")
 * // → "31122024" (easier for length checks: inputValue.length === 8)
 */
const stripDelimiters = (str?: string): string => str?.replace(/\//g, '') ?? '';

export {
  convertIntlToDayjsLocale,
  loadScript,
  getFormattedDate,
  rangeFormattedValue,
  rangeInputPlaceHolder,
  finalInputFormat,
  getTextInputFormat,
  validateDateComponents,
  validateAndParseDateInput,
  stripDelimiters,
};
