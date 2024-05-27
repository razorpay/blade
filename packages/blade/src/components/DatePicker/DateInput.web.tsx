/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { useDatesContext } from '@mantine/dates';
import type { DatePickerInputProps } from './types';
import { getFormattedDate } from './utils';
import BaseBox from '~components/Box/BaseBox';
import { ArrowRightIcon, CalendarIcon } from '~components/Icons';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { BaseInput } from '~components/Input/BaseInput';
import { size as sizeTokens } from '~tokens/global';
import { isReactNative, makeSize } from '~utils';
import type { BladeElementRef } from '~utils/types';

const _DateInput = (
  props: BaseInputProps,
  ref: React.ForwardedRef<BladeElementRef>,
): React.ReactElement => {
  return (
    <BaseInput
      {...props}
      ref={ref}
      as="button"
      textAlign="left"
      hideLabelText={props.label?.length === 0}
      autoCompleteSuggestionType="none"
      hasPopup="dialog"
      onClick={(e) => {
        if (props.isDisabled) {
          return;
        }
        props.onClick?.(e);
      }}
      onKeyDown={({ event }) => {
        // @ts-expect-error
        props.onKeyDown?.(event);
      }}
    />
  );
};

const DateInput = React.forwardRef(_DateInput);

const HiddenInput = ({ value, name }: { value: string; name?: string }): React.ReactElement => {
  if (isReactNative()) return <></>;

  return <input hidden={true} name={name} value={value} readOnly />;
};

const iconVerticalMargin = {
  medium: sizeTokens[16],
  large: sizeTokens[24],
} as const;

const _DatePickerInput = (
  {
    selectionType,
    referenceProps,
    inputRef,
    date,
    label,
    labelPosition,
    autoFocus,
    name,
    size = 'medium',
    ...props
  }: DatePickerInputProps,
  ref: React.ForwardedRef<any>,
): React.ReactElement => {
  const format = 'DD/MM/YYYY';
  const isLarge = size === 'large';
  const isLabelPositionLeft = labelPosition === 'left';
  const hasLabel = Boolean(label);
  const { locale } = useDatesContext();

  if (selectionType == 'single') {
    const dateValue = getFormattedDate({
      date,
      format,
      labelSeparator: '-',
      locale,
      type: 'default',
    });
    return (
      <BaseBox width="100%">
        <HiddenInput value={dateValue} name={name} />
        <DateInput
          ref={ref as never}
          id="start-date"
          labelPosition={labelPosition}
          label={label}
          placeholder={format}
          popupId={referenceProps['aria-controls']}
          isPopupExpanded={referenceProps['aria-expanded']}
          size={size}
          autoFocus={autoFocus}
          value={dateValue}
          componentName="DatePickerInput"
          {...props}
          {...referenceProps}
        />
      </BaseBox>
    );
  }

  if (selectionType == 'range') {
    const startValue = getFormattedDate({
      type: 'default',
      date: date[0],
      format,
      labelSeparator: '-',
      locale,
    });
    const endValue = getFormattedDate({
      type: 'default',
      date: date[1],
      format,
      labelSeparator: '-',
      locale,
    });
    return (
      <BaseBox
        width="100%"
        display="flex"
        flexDirection="row"
        gap="spacing.4"
        alignItems="flex-end"
        ref={ref as never}
      >
        <BaseBox flex={1}>
          <HiddenInput value={startValue} name={name?.start} />
          <DateInput
            setInputWrapperRef={(node) => ((inputRef as any)!.current = node)}
            id="start-date"
            leadingIcon={CalendarIcon}
            label={label?.start}
            labelPosition={labelPosition}
            placeholder={format}
            popupId={referenceProps['aria-controls']}
            isPopupExpanded={referenceProps['aria-expanded']}
            size={size}
            autoFocus={autoFocus}
            value={startValue}
            componentName="DatePickerInputStart"
            {...props}
            {...referenceProps}
          />
        </BaseBox>
        <BaseBox flexShrink={0} alignSelf="start">
          <ArrowRightIcon
            size="medium"
            marginTop={
              // Hacky layouting because the we cannot put this inside the internal layout of BaseInput.
              hasLabel && !isLabelPositionLeft
                ? `calc(${makeSize(iconVerticalMargin[size])} + ${makeSize(
                    isLarge ? sizeTokens[20] : sizeTokens[15],
                  )})`
                : makeSize(iconVerticalMargin[size])
            }
          />
        </BaseBox>
        <BaseBox flex={1}>
          <HiddenInput value={endValue} name={name?.end} />
          <DateInput
            id="end-date"
            placeholder={format}
            leadingIcon={CalendarIcon}
            label={isLabelPositionLeft ? undefined : label?.end}
            labelPosition={isLabelPositionLeft ? undefined : labelPosition}
            popupId={referenceProps['aria-controls']}
            isPopupExpanded={referenceProps['aria-expanded']}
            size={size}
            value={endValue}
            componentName="DatePickerInputEnd"
            {...props}
            {...referenceProps}
          />
        </BaseBox>
      </BaseBox>
    );
  }

  return <></>;
};

const DatePickerInput = React.forwardRef(_DatePickerInput);
export { DatePickerInput };
