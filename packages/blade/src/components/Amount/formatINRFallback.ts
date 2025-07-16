import type { AmountProps, AmountType } from './types';

/**
 * Fallback function for INR currency formatting when i18nify fails
 * Implements Indian numbering system (lakhs, crores) with proper comma placement
 */
export const formatINRFallback = ({
  value,
  suffix,
  fractionDigits = 2,
}: {
  value: number;
  suffix: AmountProps['suffix'];
  fractionDigits?: number;
}): AmountType => {
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);

  // Handle different suffix types
  if (suffix === 'humanize') {
    // Simplified humanization for INR
    if (absoluteValue >= 10000000) {
      // 1 crore
      const crores = absoluteValue / 10000000;
      const formattedCrores = crores >= 100 ? Math.floor(crores) : Math.round(crores * 10) / 10;
      return {
        integer: `${isNegative ? '-' : ''}${formattedCrores}`,
        compact: 'Cr',
        currency: '₹',
        isPrefixSymbol: true,
      };
    } else if (absoluteValue >= 100000) {
      // 1 lakh
      const lakhs = absoluteValue / 100000;
      const formattedLakhs = lakhs >= 100 ? Math.floor(lakhs) : Math.round(lakhs * 10) / 10;
      return {
        integer: `${isNegative ? '-' : ''}${formattedLakhs}`,
        compact: 'L',
        currency: '₹',
        isPrefixSymbol: true,
      };
    } else if (absoluteValue >= 1000) {
      // 1 thousand
      const thousands = absoluteValue / 1000;
      const formattedThousands =
        thousands >= 100 ? Math.floor(thousands) : Math.round(thousands * 10) / 10;
      return {
        integer: `${isNegative ? '-' : ''}${formattedThousands}`,
        compact: 'K',
        currency: '₹',
        isPrefixSymbol: true,
      };
    }
  }

  // Format integer part with Indian comma system
  const formatWithIndianCommas = (num: number): string => {
    const numStr = Math.floor(num).toString();
    if (numStr.length <= 3) return numStr;

    // Indian numbering: first comma after 3 digits from right, then every 2 digits
    const reversed = numStr.split('').reverse();
    const formatted: string[] = [];

    for (let i = 0; i < reversed.length; i++) {
      if (i === 3 || (i > 3 && (i - 3) % 2 === 0)) {
        formatted.push(',');
      }
      formatted.push(reversed[i]);
    }

    return formatted.reverse().join('');
  };

  // Handle decimal formatting
  const getDecimalParts = (): { decimal: string; fraction: string } => {
    if (suffix === 'none') {
      return { decimal: '', fraction: '' };
    }

    const decimalPart = (absoluteValue % 1).toFixed(fractionDigits).split('.')[1];
    if (!decimalPart || decimalPart === '00') {
      return { decimal: '.', fraction: '00' };
    }

    return {
      decimal: '.',
      fraction: decimalPart,
    };
  };

  const integerPart = formatWithIndianCommas(absoluteValue);
  const { decimal, fraction } = getDecimalParts();

  return {
    minusSign: isNegative ? '-' : undefined,
    integer: integerPart,
    decimal,
    fraction,
    currency: '₹',
    isPrefixSymbol: true,
  };
};
