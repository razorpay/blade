import type { ReactElement } from 'react';
import { BaseText } from '../Typography/BaseText/BaseText.web';
import type { FontSize } from '../../tokens/global/typography';
import type { BaseTextProps } from '../Typography/BaseText/types';
import { amountTextSizes, prefixSuffixTextSizes } from './amountTokens';
import type { AmountProps } from './Amount';
import { suffixTypes } from './Amount';

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

interface BaseAmount extends AmountProps {
  prefixSuffixColor: BaseTextProps['color'];
  textColor: BaseTextProps['color'];
  mainValue: string;
}

const BaseAmount = ({
  mainValue,
  size,
  weight,
  textColor,
  isAffixSubtle,
  suffix,
  prefixSuffixColor,
}: BaseAmount): ReactElement => {
  if (suffix === suffixTypes.DECIMALS && isAffixSubtle) {
    const integer = mainValue.split('.')[0];
    const decimal = mainValue.split('.')[1];
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
    <BaseText {...amountTextSizes[size]} fontWeight={weight} color={textColor}>
      {mainValue}
    </BaseText>
  );
};

export default BaseAmount;
