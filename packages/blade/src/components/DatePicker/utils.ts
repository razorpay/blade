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
  if (!dateStr?.trim()) {
    return { isValid: true };
  }

  const parsed = dayjs(dateStr, 'DD/MM/YYYY', true);

  if (!parsed.isValid()) {
    return { isValid: false, error: 'Invalid date' };
  }

  const year = parsed.year();
  if (year < 1000 || year > 3000) {
    return { isValid: false, error: 'Invalid year' };
  }

  return { isValid: true, parsedDate: parsed.toDate() };
};

/**
 * Shared validation function for date input blocking
 * @param inputValue - The input string to validate
 * @param isRange - Whether this is a range input or single date
 * @returns Object with shouldBlock flag, optional error message, and parsed values if valid
 */
const validateInputAndBlock = (
  inputValue: string,
  isRange: boolean,
): {
  shouldBlock: boolean;
  error?: string;
  parsedValue?: Date | null | [Date | null, Date | null];
} => {
  if (!inputValue?.trim()) return { shouldBlock: false };

  if (isRange) {
    const parts = inputValue.split(/\s*→\s*/);

    // Block if any part is incomplete (between 1-9 characters)
    if (
      (parts[0]?.trim() && parts[0].trim().length < 10) ||
      (parts[1]?.trim() && parts[1].trim().length < 10)
    ) {
      return { shouldBlock: true };
    }

    let startDate: Date | null = null;
    let endDate: Date | null = null;

    // Validate complete parts (10+ characters) and get parsed dates
    if (parts[0]?.trim() && parts[0].trim().length >= 10) {
      const startValidation = validateDateComponents(parts[0].trim());
      if (!startValidation.isValid) {
        return { shouldBlock: true, error: `Start date: ${startValidation.error}` };
      }
      startDate = startValidation.parsedDate || null;
    }

    if (parts[1]?.trim() && parts[1].trim().length >= 10) {
      const endValidation = validateDateComponents(parts[1].trim());
      if (!endValidation.isValid) {
        return { shouldBlock: true, error: `End date: ${endValidation.error}` };
      }
      endDate = endValidation.parsedDate || null;
    }

    return { shouldBlock: false, parsedValue: [startDate, endDate] };
  } else {
    if (inputValue.length >= 10) {
      const validation = validateDateComponents(inputValue);
      if (!validation.isValid) {
        return { shouldBlock: true, error: validation.error };
      }
      return { shouldBlock: false, parsedValue: validation.parsedDate || null };
    }
  }

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
  validateInputAndBlock,
};
