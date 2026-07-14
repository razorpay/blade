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
  isRequired?: boolean;
  label?: string;
  labelId: string;
  labelPosition?: 'top' | 'left';
  necessityIndicator?: 'required' | 'optional' | 'none';
  showValue: boolean;
  size: SliderSize;
  variant: NonNullable<SliderProps['variant']>;
};

const SliderHeader = ({
  displayValue,
  inputId,
  isRequired,
  label,
  labelId,
  labelPosition = 'top',
  necessityIndicator = 'required',
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
      <FormLabel
        as="label"
        htmlFor={inputId}
        id={labelId}
        labelTrailing={value}
        size={size}
        position={labelPosition}
        necessityIndicator={isRequired ? necessityIndicator : 'none'}
      >
        {label}
      </FormLabel>
    ) : (
      <FormLabel
        as="span"
        id={labelId}
        labelTrailing={value}
        size={size}
        position={labelPosition}
        necessityIndicator={isRequired ? necessityIndicator : 'none'}
      >
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
  successText?: string;
  successTextId: string;
  hasSuccess: boolean;
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
  successText,
  successTextId,
  hasSuccess,
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
      type={hasError ? 'error' : hasSuccess ? 'success' : 'help'}
      errorText={errorText}
      errorTextId={errorTextId}
      helpText={helpText}
      helpTextId={helpTextId}
      successText={successText}
      successTextId={successTextId}
      size={size}
    />
  </>
);

export { SliderFooter, SliderHeader };
