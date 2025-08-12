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
  return startValue && endValue
    ? startValue === endValue
      ? startValue
      : `${startValue} → ${endValue}`
    : startValue
    ? `${startValue} → `
    : endValue
    ? ` → ${endValue}`
    : '';
};

const rangeInputPlaceHolder = (placeholder: string | undefined, format: string) => {
  if (placeholder) {
    return `${placeholder} → ${placeholder}`;
  }
  return `${format} → ${format}`;
};

const finalInputFormat = (startValue: string, endValue: string, format: string | undefined) => {
  // For case: when start and end are the same, return the format
  if (startValue === endValue && (startValue || endValue)) {
    return format;
  }
  return `${format} → ${format}`;
};

/**
 * Converts date format string to TextInput pattern for masking.
 * TextInput format only recognizes # as input placeholder, so we replace
 * date characters (Y,M,D) with # while preserving delimiters.
 *
 * @example "DD/MM/YYYY" → "##/##/####"
 */
const getTextInputFormat = (formatStr?: string, isRangeInput?: boolean): string => {
  if (!formatStr) {
    return isRangeInput ? '##/##/#### → ##/##/####' : '##/##/####';
  }
  return formatStr.replace(/[YMD]/g, '#');
};

/**
 * Simple date validation using DayJS with strict parsing
 * @param dateStr - The date string to validate (e.g., "25/12/2024")
 * @returns Object with isValid flag, error message if invalid, and parsed date if valid
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

// Helper to detect and parse special single date formats (MMM, MMMM, YYYY)
const parseSpecialSingleFormat = (
  inputValue: string,
  format?: string,
): { isSpecialFormat: boolean; parsedDate?: Date } => {
  if (!format) return { isSpecialFormat: false };

  const trimmedInput = inputValue.trim();
  const today = new Date();

  // Handle year-only format (YYYY) - keep current month and day, change year
  if (format === 'YYYY' && /^\d{4}$/.test(trimmedInput)) {
    const year = parseInt(trimmedInput, 10);
    if (year >= 1000 && year <= 3000) {
      return {
        isSpecialFormat: true,
        parsedDate: new Date(year, today.getMonth(), today.getDate()),
      };
    }
  }

  // Handle month formats (MMM, MMMM) - keep current day and year, change month
  if ((format === 'MMM' || format === 'MMMM') && trimmedInput.length >= 3) {
    // Using DayJS to parse month names (handles both short "Aug" and full "August")
    const monthDate = dayjs(trimmedInput, format === 'MMM' ? 'MMM' : 'MMMM', true);
    if (monthDate.isValid()) {
      return {
        isSpecialFormat: true,
        parsedDate: new Date(today.getFullYear(), monthDate.month(), today.getDate()),
      };
    }
  }

  return { isSpecialFormat: false };
};

/**
 * Validates and parses date input, returning validation result with parsed values
 * @param inputValue - The input string to validate and parse
 * @param isRange - Whether this is a range input or single date
 * @returns Object with shouldBlock flag, optional error message, and parsed values if valid
 */
const validateAndParseDateInput = (
  inputValue: string,
  isRange: boolean,
  format?: string,
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
    if (specialParse.isSpecialFormat) {
      return { shouldBlock: false, parsedValue: specialParse.parsedDate || null };
    }
  }

  if (isRange) {
    // Split range input on arrow separator (e.g., "25/12/2024 → 31/12/2024")
    const parts = inputValue.split(/\s*→\s*/);

    // Block incomplete input to prevent premature validation (e.g., "25/12/202" is being typed)
    if (
      (parts[0]?.trim() && parts[0].trim().length < 10) ||
      (parts[1]?.trim() && parts[1].trim().length < 10)
    ) {
      return { shouldBlock: true };
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

    // Return parsed dates ready for setControlledValue
    return { shouldBlock: false, parsedValue: [startDate, endDate] };
  } else if (inputValue.length >= 10) {
    // Single date: validate and parse if it looks complete
    const validation = validateDateComponents(inputValue);
    if (!validation.isValid) {
      return { shouldBlock: true, error: validation.error };
    }
    // Return parsed date ready for setControlledValue
    return { shouldBlock: false, parsedValue: validation.parsedDate || null };
  }

  // Input is incomplete but valid so far - allow continued typing
  return { shouldBlock: false };
};

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
};
