import type { ReactElement } from 'react';
import React from 'react';
import type { AmountTypeProps, Currency } from './amountTokens';
import {
  normalAmountSizes,
  getCurrencyAbbreviations,
  currencyIndicatorMapping,
  subtleFontSizes,
  amountLineHeights,
  currencyPositionMapping,
} from './amountTokens';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import BaseBox from '~components/Box/BaseBox';
import type { TestID } from '~utils/types';
import { getPlatformType } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { objectKeysWithType } from '~utils/objectKeysWithType';
import { BaseText } from '~components/Typography/BaseText';
import { Text } from '~components/Typography';
import { opacity } from '~tokens/global';
import type { FontFamily } from '~tokens/global';

type AmountCommonProps = {
  /**
   * The value to be rendered within the component.
   *
   */
  value: number;
  /**
   * Sets the color of the amount.
   *
   * @default undefined
   */
  color?: BaseTextProps['color'];
  /**
   * Indicates what the suffix of amount should be
   *
   * @default 'decimals'
   */
  suffix?: 'decimals' | 'none' | 'humanize';
  /**
   * Makes the currency indicator(currency symbol/code) and decimal digits small and faded
   *
   * @default true
   */
  isAffixSubtle?: true | false;
  /**
   * Determines the visual representation of the currency, choose between displaying the currency symbol or code.
   *
   * @default 'currency-symbol'
   */
  currencyIndicator?: 'currency-symbol' | 'currency-code';
  /**
   * The currency of the amount.  Note that this component
   * only displays the provided value in the specified currency, it does not perform any currency conversion.
   *
   * @default 'INR'
   * */
  currency?: Currency;
  /**
   * If true, the amount text will have a line through it.
   *
   * @default false
   */
  isStrikethrough?: boolean;
} & TestID &
  StyledPropsBlade;

type ColorProps = {
  amountValueColor: BaseTextProps['color'];
};

type AmountProps = AmountTypeProps & AmountCommonProps;

const getTextColorProps = ({ color }: { color: AmountProps['color'] }): ColorProps => {
  const props: ColorProps = {
    amountValueColor: 'surface.text.gray.normal',
  };
  if (!color) return props;
  props.amountValueColor = color;
  return props;
};

interface AmountValue extends Omit<AmountProps, 'value'> {
  amountValueColor: BaseTextProps['color'];
  value: string;
  size: Exclude<AmountProps['size'], undefined>;
}

const AmountValue = ({
  value,
  size = 'medium',
  type = 'body',
  weight = 'regular',
  amountValueColor,
  isAffixSubtle,
  suffix,
}: AmountValue): ReactElement => {
  const isReactNative = getPlatformType() === 'react-native';
  const affixFontSize = isAffixSubtle ? subtleFontSizes[type][size] : normalAmountSizes[type][size];
  const numberFontFamily: keyof FontFamily = type === 'body' ? 'text' : 'heading';
  if (suffix === 'decimals' && isAffixSubtle) {
    const integer = value.split('.')[0];
    const decimal = value.split('.')[1];

    // Native does not support alignItems of Text inside a div, instead we need to wrap is in a Text
    const AmountWrapper = isReactNative ? Text : React.Fragment;

    return (
      <AmountWrapper>
        <BaseText
          fontSize={normalAmountSizes[type][size]}
          fontWeight={weight}
          lineHeight={amountLineHeights[type][size]}
          color={amountValueColor}
          fontFamily={numberFontFamily}
          as={isReactNative ? undefined : 'span'}
        >
          {integer}
        </BaseText>
        <BaseText
          fontWeight={weight}
          fontSize={affixFontSize}
          fontFamily={numberFontFamily}
          color={amountValueColor}
          as={isReactNative ? undefined : 'span'}
          opacity={isAffixSubtle ? opacity[8] : 1}
        >
          .{decimal || '00'}
        </BaseText>
      </AmountWrapper>
    );
  }
  return (
    <BaseText
      fontSize={normalAmountSizes[type][size]}
      fontWeight={weight}
      fontFamily={numberFontFamily}
      color={amountValueColor}
      lineHeight={amountLineHeights[type][size]}
    >
      {value}
    </BaseText>
  );
};

// This function rounds a number to a specified number of decimal places
// and floors the result.
export const getFlooredFixed = (value: number, decimalPlaces: number): number => {
  const factor = 100 ** decimalPlaces;
  const roundedValue = Math.floor(value * factor) / factor;
  return Number(roundedValue.toFixed(decimalPlaces));
};

export const addCommas = (amountValue: number, currency: Currency, decimalPlaces = 0): string => {
  // If the currency is 'INR', set the locale to 'en-IN' (Indian English).
  // Otherwise, set the locale to 'en-US' (U.S. English).
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return amountValue.toLocaleString(locale, { minimumFractionDigits: decimalPlaces });
};
/**
 * This function returns the humanized amount
 * ie: for INR 2000 => 2K
 * for MYR 2000000 => 2M
 */
export const getHumanizedAmount = ({
  value,
  currency,
  denominationPosition = 'right',
}: {
  value: number;
  currency: Currency;
  denominationPosition?: 'left' | 'right';
}): string => {
  let amountValue = value;
  const abbreviations = getCurrencyAbbreviations(currency);
  const abbreviation = abbreviations.find((abbr) => amountValue >= abbr.value);

  if (abbreviation) {
    amountValue = amountValue / abbreviation.value;
    const formattedAmountValue = getFlooredFixed(amountValue, 2);

    if (denominationPosition === 'right') {
      return `${addCommas(formattedAmountValue, currency)}${abbreviation.symbol}`;
    }

    return `${abbreviation.symbol}${addCommas(formattedAmountValue, currency)}`;
  }

  return amountValue.toString();
};

type FormatAmountWithSuffixType = {
  suffix: AmountProps['suffix'];
  value: number;
  currency: Currency;
  denominationPosition?: 'left' | 'right';
};

export const formatAmountWithSuffix = ({
  suffix,
  value,
  currency,
  denominationPosition,
}: FormatAmountWithSuffixType): string => {
  switch (suffix) {
    case 'decimals': {
      const decimalNumber = getFlooredFixed(value, 2);
      return addCommas(decimalNumber, currency, 2);
    }
    case 'humanize': {
      return getHumanizedAmount({ value, currency, denominationPosition });
    }
    case 'none': {
      return addCommas(getFlooredFixed(value, 0), currency);
    }
    default:
      return addCommas(getFlooredFixed(value, 0), currency);
  }
};

const _Amount = ({
  value,
  suffix = 'decimals',
  type = 'body',
  size = 'medium',
  weight = 'regular',
  isAffixSubtle = true,
  isStrikethrough = false,
  color,
  currencyIndicator = 'currency-symbol',
  currency = 'INR',
  testID,
  ...styledProps
}: AmountProps): ReactElement => {
  if (__DEV__) {
    if (typeof value !== 'number') {
      throwBladeError({
        message: '`value` prop must be of type `number` for Amount.',
        moduleName: 'Amount',
      });
    }
    // @ts-expect-error neutral color should throw error
    if (color === 'neutral') {
      throwBladeError({
        message: '`neutral` color is not supported.',
        moduleName: 'Amount',
      });
    }

    const bodySizes = objectKeysWithType(normalAmountSizes.body);
    if ((type === 'body' || !type) && !bodySizes.includes(size)) {
      throwBladeError({
        message: `size="${size}" is not allowed with type="body"`,
        moduleName: 'Amount',
      });
    }

    const displaySizes = objectKeysWithType(normalAmountSizes.display);
    if (type === 'display' && !displaySizes.includes(size)) {
      throwBladeError({
        message: `size="${size}" is not allowed with type="display"`,
        moduleName: 'Amount',
      });
    }

    const headingSizes = objectKeysWithType(normalAmountSizes.heading);
    if (type === 'heading' && !headingSizes.includes(size)) {
      throwBladeError({
        message: `size="${size}" is not allowed with type="heading"`,
        moduleName: 'Amount',
      });
    }
  }

  const currencySymbolOrCode = currencyIndicatorMapping[currency][currencyIndicator];
  const currencyPosition = currencyPositionMapping[currency] || 'left';
  const denominationPosition = currencyPosition === 'left' ? 'right' : 'left';
  const renderedValue = formatAmountWithSuffix({ suffix, value, currency, denominationPosition });
  const { amountValueColor } = getTextColorProps({
    color,
  });

  const currencyFontSize = isAffixSubtle
    ? subtleFontSizes[type][size]
    : normalAmountSizes[type][size];
  const isReactNative = getPlatformType() === 'react-native';

  return (
    <BaseBox
      display={(isReactNative ? 'flex' : 'inline-flex') as never}
      flexDirection="row"
      {...metaAttribute({ name: MetaConstants.Amount, testID })}
      {...getStyledProps(styledProps)}
    >
      <BaseBox
        display={(isReactNative ? 'flex' : 'inline-flex') as never}
        alignItems="baseline"
        flexDirection="row"
        position="relative"
      >
        {currencyPosition === 'left' && (
          <BaseText
            marginRight="spacing.1"
            fontWeight={weight}
            fontSize={currencyFontSize}
            color={amountValueColor}
            as={isReactNative ? undefined : 'span'}
            opacity={isAffixSubtle ? opacity[8] : 1}
          >
            {currencySymbolOrCode}
          </BaseText>
        )}
        <AmountValue
          value={renderedValue}
          amountValueColor={amountValueColor}
          type={type}
          weight={weight}
          size={size}
          isAffixSubtle={isAffixSubtle}
          suffix={suffix}
        />
        {currencyPosition === 'right' && (
          <BaseText
            marginLeft="spacing.1"
            fontWeight={weight}
            fontSize={currencyFontSize}
            color={amountValueColor}
            as={isReactNative ? undefined : 'span'}
            opacity={isAffixSubtle ? opacity[8] : 1}
          >
            {currencySymbolOrCode}
          </BaseText>
        )}
        {isStrikethrough && (
          <BaseBox
            // @ts-expect-error - intentionally setting the border color to the color prop for this hacky strikethrough
            borderBottomColor={amountValueColor}
            borderBottomWidth={type === 'body' ? 'thin' : 'thicker'}
            borderBottomStyle="solid"
            position="absolute"
            width="100%"
            top="50%"
          />
        )}
      </BaseBox>
    </BaseBox>
  );
};

const Amount = assignWithoutSideEffects(_Amount, {
  displayName: 'Amount',
  componentId: 'Amount',
});

export type { AmountProps };
export { Amount };
