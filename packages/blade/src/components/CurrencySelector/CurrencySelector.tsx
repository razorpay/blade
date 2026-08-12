import React from 'react';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { getStyledProps } from '~components/Box/styledProps';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import BaseBox from '~components/Box/BaseBox';
import { Text } from '~components/Typography';
import type { DataAnalyticsAttribute, TestID } from '~utils/types';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';
import { throwBladeError } from '~utils/logger';
import { isReactNative } from '~utils';

type CurrencyOption = {
  /** ISO 4217 currency code, e.g. "USD", "INR" */
  code: string;
  /** Flag or icon emoji displayed before the currency code, e.g. "🇺🇸" */
  emoji: string;
};

type CurrencySelectorProps = {
  /**
   * Array of currency options to display in the selector.
   * Must have at least 2 items.
   */
  currencies: CurrencyOption[];
  /**
   * The currently selected currency code (controlled).
   */
  value?: string;
  /**
   * The initially selected currency code (uncontrolled).
   * Defaults to the first currency in the list.
   */
  defaultValue?: string;
  /**
   * Callback invoked when the selected currency changes.
   */
  onChange?: (value: string) => void;
  /**
   * Disables all interactions when `true`.
   *
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Accessibility label for the selector group (used by screen readers).
   */
  accessibilityLabel: string;
} & TestID &
  DataAnalyticsAttribute &
  StyledPropsBlade;

const _CurrencySelector: React.ForwardRefRenderFunction<
  HTMLDivElement,
  CurrencySelectorProps
> = (
  {
    currencies,
    value: controlledValue,
    defaultValue,
    onChange,
    isDisabled = false,
    accessibilityLabel,
    testID,
    ...rest
  },
  ref,
) => {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = React.useState<string | undefined>(
    defaultValue ?? currencies[0]?.code,
  );

  if (__DEV__) {
    if (!currencies || currencies.length < 2) {
      throwBladeError({
        moduleName: 'CurrencySelector',
        message: 'CurrencySelector requires at least 2 currency options.',
      });
    }
  }

  const selectedValue = isControlled ? controlledValue : internalValue;

  const handleSelect = React.useCallback(
    (code: string) => {
      if (isDisabled) return;
      if (!isControlled) {
        setInternalValue(code);
      }
      onChange?.(code);
    },
    [isControlled, isDisabled, onChange],
  );

  return (
    <BaseBox
      {...metaAttribute({ name: MetaConstants.CurrencySelector, testID })}
      {...getStyledProps(rest)}
      {...makeAnalyticsAttribute(rest)}
      ref={ref as never}
      display={(isReactNative() ? 'flex' : 'inline-flex') as never}
      flexDirection="row"
      alignItems="center"
      backgroundColor="surface.background.gray.moderate"
      borderRadius="max"
      padding="spacing.1"
      role="radiogroup"
      aria-label={accessibilityLabel}
      aria-disabled={isDisabled}
    >
      {currencies.map(({ code, emoji }) => {
        const isSelected = selectedValue === code;
        return (
          <BaseBox
            key={code}
            {...metaAttribute({ name: MetaConstants.CurrencySelectorItem })}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={isDisabled}
            tabIndex={isDisabled ? -1 : 0}
            onClick={isReactNative() ? undefined : () => handleSelect(code)}
            onKeyDown={
              isReactNative()
                ? undefined
                : (e: React.KeyboardEvent) => {
                    if (e.key === ' ' || e.key === 'Enter') {
                      e.preventDefault();
                      handleSelect(code);
                    }
                  }
            }
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            paddingTop="spacing.2"
            paddingBottom="spacing.2"
            paddingLeft="spacing.4"
            paddingRight="spacing.4"
            borderRadius="max"
            elevation={isSelected ? 'lowRaised' : undefined}
            backgroundColor={isSelected ? 'surface.background.gray.intense' : 'transparent'}
            cursor={isReactNative() ? undefined : isDisabled ? 'not-allowed' : 'pointer'}
            userSelect={isReactNative() ? undefined : 'none'}
          >
            <Text
              variant="body"
              size="medium"
              color={
                isDisabled
                  ? 'interactive.text.gray.disabled'
                  : isSelected
                  ? 'surface.text.gray.normal'
                  : 'surface.text.gray.subtle'
              }
            >
              {emoji} {code}
            </Text>
          </BaseBox>
        );
      })}
    </BaseBox>
  );
};

const CurrencySelector = assignWithoutSideEffects(React.forwardRef(_CurrencySelector), {
  displayName: 'CurrencySelector',
});

export { CurrencySelector };
export type { CurrencySelectorProps, CurrencyOption };
