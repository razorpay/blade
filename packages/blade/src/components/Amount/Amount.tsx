import type { ReactElement } from 'react';
import React from 'react';
import { formatNumberByParts } from '@razorpay/i18nify-js/currency';
import { normalAmountSizes, subtleFontSizes, amountLineHeights } from './amountTokens';
import { formatINRFallback } from './formatINRFallback';
import type { AmountProps, AmountType, ColorProps } from './types';
import type { BaseTextProps } from '~components/Typography/BaseText/types';
import BaseBox from '~components/Box/BaseBox';
import type { BladeElementRef } from '~utils/types';
import { getPlatformType } from '~utils';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { getStyledProps } from '~components/Box/styledProps';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { throwBladeError } from '~utils/logger';
import { objectKeysWithType } from '~utils/objectKeysWithType';
import { BaseText } from '~components/Typography/BaseText';
import { Text } from '~components/Typography';
import { opacity } from '~tokens/global';
import type { FontFamily } from '~tokens/global';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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
          opacity={isAffixSubtle ? opacity[800] : 1}
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
      {amount.integer}
      {amount.decimal}
      {amount.fraction}
      {amount.compact}
    </BaseText>
  );
};

type FormatAmountWithSuffixType = {
  suffix: AmountProps['suffix'];
  value: number;
  currency: AmountProps['currency'];
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
    console.log('[Amount] Error in getAmountByParts', err);
    // Use robust fallback for INR, simple fallback for other currencies
    if (currency === 'INR') {
      // INR can be formatted without INTL and i18nify dependency
      return formatINRFallback({ value, suffix, fractionDigits });
    }

    // Basic fallback for non-INR currencies
    return {
      integer: `${value}`,
      currency,
    };
  }
};

const _Amount = (
  {
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
    fractionDigits = 2,
    testID,
    ...rest
  }: AmountProps,
  ref: React.Ref<BladeElementRef>,
): ReactElement => {
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

  const renderedValue = getAmountByParts({ suffix, value, currency, fractionDigits });
  const isPrefixSymbol = renderedValue.isPrefixSymbol ?? true;
  const currencySymbol = renderedValue.currency ?? currency;

  const currencyPosition = isPrefixSymbol ? 'left' : 'right';
  const currencySymbolOrCode = currencyIndicator === 'currency-symbol' ? currencySymbol : currency;
  // console.log('renderedValue', renderedValue);
  // console.log(currencySymbolOrCode);

  const currencyFontSize = isAffixSubtle
    ? subtleFontSizes[type][size]
    : normalAmountSizes[type][size];
  const isReactNative = getPlatformType() === 'react-native';

  return (
    <BaseBox
      ref={ref as never}
      display={(isReactNative ? 'flex' : 'inline-flex') as never}
      flexDirection="row"
      {...metaAttribute({ name: MetaConstants.Amount, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
    >
      <BaseBox
        display={(isReactNative ? 'flex' : 'inline-flex') as never}
        alignItems="baseline"
        flexDirection="row"
        position="relative"
      >
        {renderedValue.minusSign ? (
          <BaseText
            fontSize={normalAmountSizes[type][size]}
            fontWeight={weight}
            lineHeight={amountLineHeights[type][size]}
            color={amountValueColor}
            as={isReactNative ? undefined : 'span'}
            marginX="spacing.2"
          >
            {renderedValue.minusSign}
          </BaseText>
        ) : null}
        {currencyPosition === 'left' && (
          <BaseText
            marginRight="spacing.1"
            fontWeight={weight}
            fontSize={currencyFontSize}
            color={amountValueColor}
            as={isReactNative ? undefined : 'span'}
            opacity={isAffixSubtle ? opacity[800] : 1}
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
            opacity={isAffixSubtle ? opacity[800] : 1}
          >
            {currencySymbolOrCode}
          </BaseText>
        )}
        {isStrikethrough && (
          // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
          // @ts-ignore: the borderBottomColor error below is thrown here as well
          <BaseBox
            // eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
            // @ts-ignore- intentionally setting the border color to the color prop for this hacky strikethrough
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

const Amount = assignWithoutSideEffects(React.forwardRef(_Amount), {
  displayName: 'Amount',
  componentId: 'Amount',
});

export type { AmountProps };
export { Amount };
