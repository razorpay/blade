import type { ReactElement } from 'react';

import type { FontSize } from '../../tokens/global/typography';
import type { BaseTextProps } from '../Typography/BaseText/types';
import { amountTextSizes, prefixSuffixTextSizes } from './amountTokens';
import type { AmountProps } from './Amount';
import { suffixTypes } from './Amount';
import BaseBox from '~components/Box/BaseBox';
import { BaseText } from '~components/Typography/BaseText';

const getAffixFontWeight = (isAffixSubtle: true | false): 'regular' | 'bold' => {
  if (isAffixSubtle) return 'regular';
  return 'bold';
};

const getMainValuetWeight = (size: NonNullable<AmountProps['size']>): 'regular' | 'bold' => {
  return size.includes('bold') || size.includes('title') ? 'bold' : 'regular';
};

export const getAffixFontSize = (
  isAffixSubtle: NonNullable<AmountProps['isAffixSubtle']>,
  size: NonNullable<AmountProps['size']>,
): keyof FontSize | undefined => {
  if (isAffixSubtle) return prefixSuffixTextSizes[size];
  return amountTextSizes[size];
};

interface AmountValue extends Omit<AmountProps, 'value'> {
  prefixSuffixColor: BaseTextProps['color'];
  textColor: BaseTextProps['color'];
  value: string;
}

const AmountValue = ({
  value,
  size = 'heading-small',
  textColor,
  isAffixSubtle = true,
  suffix = 'decimals',
  prefixSuffixColor,
}: AmountValue): ReactElement => {
  const affixFontWeight = getAffixFontWeight(isAffixSubtle);
  const affixFontSize = getAffixFontSize(isAffixSubtle, size);
  const valueForWeight = getMainValuetWeight(size);
  if (suffix === suffixTypes.DECIMALS && isAffixSubtle) {
    const integer = value.split('.')[0];
    const decimal = value.split('.')[1];

    return (
      <>
        <BaseBox paddingRight="spacing.1">
          <BaseText fontSize={amountTextSizes[size]} fontWeight={valueForWeight} color={textColor}>
            {integer}.
          </BaseText>
        </BaseBox>
        <BaseText fontWeight={affixFontWeight} fontSize={affixFontSize} color={prefixSuffixColor}>
          {decimal || '00'}
        </BaseText>
      </>
    );
  }
  return (
    <BaseBox paddingRight="spacing.2">
      <BaseText fontSize={amountTextSizes[size]} fontWeight={valueForWeight} color={textColor}>
        {value}
      </BaseText>
    </BaseBox>
  );
};

export default AmountValue;
