import React from 'react';
import type { SliderProps } from './types';
import { sliderTokens } from './sliderTokens';
import BaseBox from '~components/Box/BaseBox';
import { FormHint, FormLabel } from '~components/Form';
import { Text } from '~components/Typography';

type SliderSize = NonNullable<SliderProps['size']>;

type SliderHeaderProps = {
  displayValue: string;
  inputId: string;
  label?: string;
  labelId: string;
  showValue: boolean;
  size: SliderSize;
  variant: NonNullable<SliderProps['variant']>;
};

const SliderHeader = ({
  displayValue,
  inputId,
  label,
  labelId,
  showValue,
  size,
  variant,
}: SliderHeaderProps): React.ReactElement | null => {
  const value = showValue ? (
    <Text size={sliderTokens.size[size].label} color="surface.text.gray.normal">
      {displayValue}
    </Text>
  ) : undefined;

  if (label) {
    return variant === 'single' ? (
      <FormLabel as="label" htmlFor={inputId} id={labelId} labelTrailing={value} size={size}>
        {label}
      </FormLabel>
    ) : (
      <FormLabel as="span" id={labelId} labelTrailing={value} size={size}>
        {label}
      </FormLabel>
    );
  }

  return showValue ? <BaseBox alignSelf="flex-end">{value}</BaseBox> : null;
};

type SliderFooterProps = {
  errorText?: string;
  errorTextId: string;
  hasError: boolean;
  helpText?: string;
  helpTextId: string;
  maxText: string;
  minText: string;
  showMinMax: boolean;
  size: SliderSize;
};

const SliderFooter = ({
  errorText,
  errorTextId,
  hasError,
  helpText,
  helpTextId,
  maxText,
  minText,
  showMinMax,
  size,
}: SliderFooterProps): React.ReactElement => (
  <>
    {showMinMax ? (
      <BaseBox display="flex" justifyContent="space-between">
        <Text variant="caption" size="small" color="surface.text.gray.muted">
          {minText}
        </Text>
        <Text variant="caption" size="small" color="surface.text.gray.muted">
          {maxText}
        </Text>
      </BaseBox>
    ) : null}
    <FormHint
      type={hasError ? 'error' : 'help'}
      errorText={errorText}
      errorTextId={errorTextId}
      helpText={helpText}
      helpTextId={helpTextId}
      size={size}
    />
  </>
);

export { SliderFooter, SliderHeader };
