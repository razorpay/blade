import { BaseText } from '../Typography/BaseText/BaseText.web';
import { amountTextSizes, prefixSuffixTextSizes } from './amountTokens';
import type { AmountProps } from './Amount';

const getDecimalFontWeight = (isSuffixPrefixHighlighted: true | false): 'regular' | 'bold' => {
  if (isSuffixPrefixHighlighted) return 'regular';
  return 'bold';
};

export const getSuffixPrefixFontSize = (
  isSuffixPrefixHighlighted: NonNullable<AmountProps['isSuffixPrefixHighlighted']>,
  size: NonNullable<AmountProps['size']>,
): number => {
  if (isSuffixPrefixHighlighted) return prefixSuffixTextSizes[size];
  return amountTextSizes[size].fontSize;
};

const BaseAmount = ({
  value,
  size,
  fontWeight,
  textColor,
  isSuffixPrefixHighlighted,
  suffix,
  prefixSuffixColor,
}) => {
  if (suffix === 'Decimals' && isSuffixPrefixHighlighted) {
    const integer = value.split('.')[0];
    const decimal = value.split('.')[1];
    return (
      <>
        <BaseText {...amountTextSizes[size]} fontWeight={fontWeight} color={textColor}>
          {integer}.
        </BaseText>
        <BaseText
          {...amountTextSizes[size]}
          fontWeight={getDecimalFontWeight(isSuffixPrefixHighlighted, fontWeight)}
          fontSize={getSuffixPrefixFontSize(isSuffixPrefixHighlighted, size)}
          color={prefixSuffixColor}
        >
          {decimal}
        </BaseText>
      </>
    );
  }
  return (
    <BaseText {...amountTextSizes[size]} fontWeight={fontWeight} color={textColor}>
      {value}
    </BaseText>
  );
};

export default BaseAmount;
