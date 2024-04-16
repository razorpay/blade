import type { ReactElement } from 'react';
import React from 'react';
import type { CurrencyCodeType } from '@razorpay/i18nify-js/currency';
import { formatNumber, formatNumberByParts } from '@razorpay/i18nify-js/currency';
import type { AmountTypeProps } from './amountTokens';
import { normalAmountSizes, subtleFontSizes, amountLineHeights } from './amountTokens';
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
   * Note: Currency symbol and code is determined by the locale set in user's browser or set via @razorpay/i18nify-react library.
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
  currency?: CurrencyCodeType;
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

type AmountType = Partial<ReturnType<typeof formatNumberByParts>> & { formatted: string };

interface AmountValue extends Omit<AmountProps, 'value'> {
  amountValueColor: BaseTextProps['color'];
  amount: AmountType;
  size: Exclude<AmountProps['size'], undefined>;
}

const AmountValue = ({
  amount,
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
          {amount.integer}
        </BaseText>
        <BaseText
          fontWeight={weight}
          fontSize={affixFontSize}
          fontFamily={numberFontFamily}
          color={amountValueColor}
          as={isReactNative ? undefined : 'span'}
          opacity={isAffixSubtle ? opacity[8] : 1}
        >
          {amount.decimal}
          {amount.fraction}
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
      {amount.formatted}
    </BaseText>
  );
};

type FormatAmountWithSuffixType = {
  suffix: AmountProps['suffix'];
  value: number;
};

/**
 * Returns a parsed object based on the suffix passed in parameters
 * === Logic ===
 * value = 12500.45 
 * if suffix === 'decimals' => {
    "formatted": "12,500.45",
    "integer": "12,500",
    "decimal": ".",
    "fraction": "45",
    "isPrefixSymbol": false,
    "rawParts": [{"type": "integer","value": "12"},{"type": "group","value": ","},{"type": "integer","value": "500"},{"type": "decimal","value": "."},{"type": "fraction","value": "45"}]
}
 * else if suffix === 'humanize' => { formatted: "1.2T" }
 * else => { formatted: "1,23,456" }
 * @returns {AmountType}
 */
export const formatAmountWithSuffix = ({
  suffix,
  value,
}: FormatAmountWithSuffixType): AmountType => {
  try {
    switch (suffix) {
      case 'decimals': {
        const options = {
          intlOptions: {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
          },
        };
        return {
          ...formatNumberByParts(value, options),
          formatted: formatNumber(value, options),
        };
      }
      case 'humanize': {
        const formatted = formatNumber(value, {
          intlOptions: {
            notation: 'compact',
            maximumFractionDigits: 2,
            trailingZeroDisplay: 'stripIfInteger',
          },
        });
        return {
          formatted,
        };
      }

      default: {
        const formatted = formatNumber(value, {
          intlOptions: {
            maximumFractionDigits: 0,
            roundingMode: 'floor',
          },
        });
        return {
          formatted,
        };
      }
    }
  } catch (err: unknown) {
    return {
      formatted: `${value}`,
    };
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

  const { amountValueColor } = getTextColorProps({
    color,
  });

  let isPrefixSymbol, currencySymbol;
  try {
    const byParts = formatNumberByParts(value, {
      currency,
    });
    isPrefixSymbol = byParts.isPrefixSymbol;
    currencySymbol = byParts.currency;
  } catch (err: unknown) {
    isPrefixSymbol = true;
    currencySymbol = currency;
  }

  const currencyPosition = isPrefixSymbol ? 'left' : 'right';
  const renderedValue = formatAmountWithSuffix({ suffix, value });
  const currencySymbolOrCode = currencyIndicator === 'currency-symbol' ? currencySymbol : currency;

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
          amount={renderedValue}
          amountValueColor={amountValueColor}
          type={type}
          weight={weight}
          size={size}
          isAffixSubtle={isAffixSubtle}
          suffix={suffix}
          currency={currency}
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
