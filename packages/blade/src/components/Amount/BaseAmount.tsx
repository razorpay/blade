import type { ReactElement } from 'react';

import type { FontSize } from '../../tokens/global/typography';
import type { BaseTextProps } from '../Typography/BaseText/types';
import { amountTextSizes, prefixSuffixTextSizes } from './amountTokens';
import type { AmountProps } from './Amount';
import { suffixTypes } from './Amount';
import { BaseText } from '~components/Typography/BaseText';

const getDecimalFontWeight = (isAffixSubtle: true | false): 'regular' | 'bold' => {
  if (isAffixSubtle) return 'regular';
  return 'bold';
};

export const getSuffixPrefixFontSize = (
  isAffixSubtle: NonNullable<AmountProps['isAffixSubtle']>,
  size: NonNullable<AmountProps['size']>,
): keyof FontSize | undefined => {
  if (isAffixSubtle) return prefixSuffixTextSizes[size];
  return amountTextSizes[size];
};

interface BaseAmount extends Omit<AmountProps, 'value'> {
  prefixSuffixColor: BaseTextProps['color'];
  textColor: BaseTextProps['color'];
  value: string;
}

const BaseAmount = ({
  value,
  size = 'medium',
  weight = 'regular',
  textColor,
  isAffixSubtle = true,
  suffix = 'decimals',
  prefixSuffixColor,
}: BaseAmount): ReactElement => {
  if (suffix === suffixTypes.DECIMALS && isAffixSubtle) {
    const integer = value.split('.')[0];
    const decimal = value.split('.')[1];
    const affixFontWeight = getDecimalFontWeight(isAffixSubtle);
    const affixFontSize = getSuffixPrefixFontSize(isAffixSubtle, size);
    return (
      <>
        <BaseText fontSize={amountTextSizes[size]} fontWeight={weight} color={textColor}>
          {integer}.
        </BaseText>
        <BaseText fontWeight={affixFontWeight} fontSize={affixFontSize} color={prefixSuffixColor}>
          {decimal}
        </BaseText>
      </>
    );
  }
  return (
    <BaseText fontSize={amountTextSizes[size]} fontWeight={weight} color={textColor}>
      {value}
    </BaseText>
  );
};

export default BaseAmount;
