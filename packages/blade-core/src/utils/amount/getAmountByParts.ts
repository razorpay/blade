import type { CurrencyCodeType } from '@razorpay/i18nify-js/currency';
import { formatNumberByParts } from '@razorpay/i18nify-js/currency';

/**
 * Pollyfill function to get around the node 18 error
 *
 * This function is maintained by i18nify team. Reach out to them for any change regarding this.
 */
const stripTrailingZerosFromParts = (
  parts: ReturnType<typeof formatNumberByParts>,
): ReturnType<typeof formatNumberByParts> => {
  const decimalPart = parts.rawParts
    .filter(({ type }) => type === 'fraction')
    .map(({ value }) => value)
    .join('');

  const hasFraction = parts.rawParts.some(({ type }) => type === 'fraction');

  if (hasFraction && /^0+$/.test(decimalPart)) {
    delete parts.decimal;
    delete parts.fraction;
    parts.rawParts = parts.rawParts.filter(({ type }) => type !== 'decimal' && type !== 'fraction');
  }

  return parts;
};

/**
 * Wrapper that uses pollyfill of i18nify team
 */
const pollyfilledFormatNumberByParts: typeof formatNumberByParts = (value, options) => {
  const parts = formatNumberByParts(value, options);

  if (options?.intlOptions?.trailingZeroDisplay === 'stripIfInteger') {
    return stripTrailingZerosFromParts(parts);
  }

  return parts;
};

export type AmountType = Partial<ReturnType<typeof formatNumberByParts>>;

type FormatAmountWithSuffixType = {
  suffix: 'decimals' | 'none' | 'humanize';
  value: number;
  currency: CurrencyCodeType;
  fractionDigits?: number;
};

/**
 * Returns a parsed object based on the suffix passed in parameters
 * === Logic ===
 * value = 12500.45
 * if suffix === 'decimals' => {
    "integer": "12,500",
    "decimal": ".",
    "fraction": "45",
    "compact": "K",
    "isPrefixSymbol": false,
    "rawParts": [{"type": "integer","value": "12"},{"type": "group","value": ","},{"type": "integer","value": "500"},{"type": "decimal","value": "."},{"type": "fraction","value": "45"}]
}
 * @returns {AmountType}
 */
export const getAmountByParts = ({
  suffix,
  value,
  currency,
  fractionDigits = 2,
}: FormatAmountWithSuffixType): AmountType => {
  try {
    switch (suffix) {
      case 'decimals': {
        const options = {
          intlOptions: {
            maximumFractionDigits: fractionDigits,
            minimumFractionDigits: fractionDigits,
          },
          currency,
        } as const;
        return pollyfilledFormatNumberByParts(value, options);
      }
      case 'humanize': {
        const options = {
          intlOptions: {
            notation: 'compact',
            maximumFractionDigits: 2,
            trailingZeroDisplay: 'stripIfInteger',
          },
          currency,
        } as const;
        return pollyfilledFormatNumberByParts(value, options);
      }

      default: {
        const options = {
          intlOptions: {
            maximumFractionDigits: 0,
            roundingMode: 'floor',
          },
          currency,
        } as const;
        return pollyfilledFormatNumberByParts(value, options);
      }
    }
  } catch (err: unknown) {
    return {
      integer: `${value}`,
      currency,
    };
  }
};


