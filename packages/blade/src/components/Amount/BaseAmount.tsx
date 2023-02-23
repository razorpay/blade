import type { ReactElement } from 'react';
import { BaseText } from '../Typography/BaseText/BaseText.web';
import type { FontSize } from '../../tokens/global/typography';
import type { BaseTextProps } from '../Typography/BaseText/types';
import { amountTextSizes, prefixSuffixTextSizes } from './amountTokens';
import type { AmountProps } from './Amount';

const getDecimalFontWeight = (isSuffixPrefixHighlighted: true | false): 'regular' | 'bold' => {
  if (isSuffixPrefixHighlighted) return 'regular';
  return 'bold';
};

export const getSuffixPrefixFontSize = (
  isSuffixPrefixHighlighted: NonNullable<AmountProps['isSuffixPrefixHighlighted']>,
  size: NonNullable<AmountProps['size']>,
): keyof FontSize | undefined => {
  if (isSuffixPrefixHighlighted) return prefixSuffixTextSizes[size];
  return amountTextSizes[size].fontSize;
};

interface BaseAmount extends AmountProps {
  prefixSuffixColor: BaseTextProps['color'];
  textColor: BaseTextProps['color'];
  value: string;
}

const BaseAmount = ({
  value,
  size,
  fontWeight,
  textColor,
  isSuffixPrefixHighlighted,
  suffix,
  prefixSuffixColor,
}: BaseAmount): ReactElement => {
  if (suffix === 'Decimals' && isSuffixPrefixHighlighted) {
    const integer = value.split('.')[0];
    const decimal = value.split('.')[1];
    const affixFontWeight = getDecimalFontWeight(isSuffixPrefixHighlighted);
    const affixFontSize = getSuffixPrefixFontSize(isSuffixPrefixHighlighted, size);
    return (
      <>
        <BaseText
          fontSize={amountTextSizes[size].fontSize}
          fontWeight={fontWeight}
          color={textColor}
        >
          {integer}.
        </BaseText>
        <BaseText fontWeight={affixFontWeight} fontSize={affixFontSize} color={prefixSuffixColor}>
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
