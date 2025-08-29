import { DatePickerType, DatePickerValue } from '@mantine/dates';
declare function convertIntlToDayjsLocale(lang: string): string;
/**
 * Used to dynamically load a script
 */
declare function loadScript(src: string, callback?: () => void): void;
interface DateFormatterInput {
    type: DatePickerType;
    date: DatePickerValue<DatePickerType>;
    locale: string;
    format: string;
    labelSeparator: string;
}
type DateFormatter = (input: DateFormatterInput) => string;
interface GetFormattedDateInput extends DateFormatterInput {
    formatter?: DateFormatter;
}
declare function getFormattedDate({ formatter, ...others }: GetFormattedDateInput): string;
declare const rangeFormattedValue: (startValue: string, endValue: string) => string;
declare const rangeInputPlaceHolder: (placeholder: string | undefined, format: string) => string;
declare const finalInputFormat: (startValue: string, endValue: string, format: string | undefined) => string | undefined;
/**
 * Converts date format string to TextInput pattern for masking.
 * TextInput format only recognizes # as input placeholder, so we replace
 * date characters (Y,M,D) with # while preserving delimiters.
 *
 * @example "DD/MM/YYYY" – "##/##/####"
 * @example "MMMM" – "################" (longest month: "September")
 * @example "MMM" – "###"
 */
declare const getTextInputFormat: (formatStr?: string, isRangeInput?: boolean) => string;
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
 * // → { isValid: false, error: "Please enter a valid date" }
 *
 * @example
 * // Invalid year range
 * validateDateComponents("25/12/999")
 * // → { isValid: false, error: "Year must be between 1000 and 3000" }
 *
 * @example
 * // Empty input
 * validateDateComponents("")
 * // → { isValid: true }
 */
declare const validateDateComponents: (dateStr: string) => {
    isValid: boolean;
    error?: string;
    parsedDate?: Date;
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
 * validateAndParseDateInput("25/12/2024  –  31/12/2024", true, "DD/MM/YYYY")
 * // → { shouldBlock: false, parsedValue: [Date(2024, 11, 25), Date(2024, 11, 31)] }
 *
 * @example
 * // Invalid date with error
 * validateAndParseDateInput("31/02/2024", false, "DD/MM/YYYY")
 * // → { shouldBlock: true, error: "Please enter a valid date in DD/MM/YYYY format" }
 *
 * @example
 * // Date excluded by constraint
 * validateAndParseDateInput("25/12/2024", false, "DD/MM/YYYY", {
 *   excludeDate: (date) => date.getDay() === 0 // No Sundays
 * })
 * // → { shouldBlock: true, error: "This date is not available for selection" }
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
declare const validateAndParseDateInput: (inputValue: string, isRange: boolean, format?: string, options?: {
    excludeDate?: ((date: Date) => boolean) | undefined;
    minDate?: Date | undefined;
    maxDate?: Date | undefined;
} | undefined) => {
    shouldBlock: boolean;
    error?: string;
    parsedValue?: Date | null | [Date | null, Date | null];
};
/**
 * Simple partial date validation using / splitting
 * Since special formats (MMM, MMMM, YYYY) are handled before this function
 *
 * @param input - The partial date input to validate
 * @returns Object with validation result and optional error message
 *
 * @example
 * // Valid partial input
 * validatePartialDateSimple("15")
 * // → { isValid: true }
 *
 * @example
 * // Invalid day
 * validatePartialDateSimple("35")
 * // → { isValid: false, error: "Day cannot be greater than 31" }
 *
 * @example
 * // Invalid month
 * validatePartialDateSimple("15/13")
 * // → { isValid: false, error: "Month cannot be greater than 12" }
 *
 * @example
 * // Invalid day-month combination
 * validatePartialDateSimple("30/02")
 * // → { isValid: false, error: "February cannot have more than 29 days" }
 */
declare function validatePartialDateSimple(input: string): {
    isValid: boolean;
    error?: string;
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
declare const stripDelimiters: (str?: string) => string;
export { convertIntlToDayjsLocale, loadScript, getFormattedDate, rangeFormattedValue, rangeInputPlaceHolder, finalInputFormat, getTextInputFormat, validateDateComponents, validateAndParseDateInput, validatePartialDateSimple, stripDelimiters, };
