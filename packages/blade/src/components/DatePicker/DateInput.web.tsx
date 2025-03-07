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
import type { BladeElementRef, DataAnalyticsAttribute } from '~utils/types';
import { useIsMobile } from '~utils/useIsMobile';
import { makeAnalyticsAttribute } from '~utils/makeAnalyticsAttribute';

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

const HiddenInput = ({
  value,
  name,
  isRequired,
  isDisabled,
  ...rest
}: {
  value: string;
  name?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
} & DataAnalyticsAttribute): React.ReactElement => {
  if (isReactNative()) return <></>;

  return (
    <input
      hidden={true}
      name={name}
      value={value}
      required={isRequired}
      disabled={isDisabled}
      readOnly
      {...makeAnalyticsAttribute(rest)}
    />
  );
};

const iconVerticalMargin = {
  medium: sizeTokens[14],
  large: sizeTokens[24],
} as const;
const LEFT_LABEL_WIDTH = 132;

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
    necessityIndicator,
    successText,
    errorText,
    helpText,
    format,
    placeholder,
    ...props
  }: DatePickerInputProps,
  ref: React.ForwardedRef<any>,
): React.ReactElement => {
  const isMobile = useIsMobile();
  const isLarge = size === 'large';
  const hasLabel = typeof label === 'string' ? Boolean(label) : Boolean(label?.start || label?.end);
  const isLabelPositionLeft = labelPosition === 'left';
  const isLabelPositionTop = labelPosition === 'top';
  const isLabelPositionVisuallyTop = hasLabel && (isLabelPositionTop || isMobile);

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
        <HiddenInput
          value={dateValue}
          name={name}
          isRequired={props.isRequired}
          isDisabled={props.isDisabled}
        />
        <DateInput
          ref={ref as never}
          id="start-date"
          labelPosition={labelPosition}
          label={label}
          placeholder={placeholder || format}
          popupId={referenceProps['aria-controls']}
          isPopupExpanded={referenceProps['aria-expanded']}
          size={size}
          autoFocus={autoFocus}
          value={dateValue}
          componentName="DatePickerInput"
          necessityIndicator={necessityIndicator}
          successText={successText}
          errorText={errorText}
          helpText={helpText}
          {...props}
          {...referenceProps}
        />
      </BaseBox>
    );
  }

  if (selectionType == 'range') {
    const shouldRenderEndLabel = (): string | undefined => {
      let finalLabel: string | undefined = '';

      const labelEnd = isLabelPositionLeft ? undefined : label?.end;
      if (isLabelPositionVisuallyTop && labelEnd === undefined) {
        // Empty space, nbsp;
        finalLabel = '\u00A0';
      } else if (isLabelPositionLeft) {
        finalLabel = undefined;
      } else {
        finalLabel = label?.end;
      }
      return finalLabel;
    };

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
        alignItems="flex-start"
        ref={ref as never}
      >
        <BaseBox flex={1} flexBasis={isLabelPositionLeft ? LEFT_LABEL_WIDTH : '0px'}>
          <HiddenInput
            value={startValue}
            name={name?.start}
            isRequired={props.isRequired}
            isDisabled={props.isDisabled}
          />
          <DateInput
            setInputWrapperRef={(node) => ((inputRef as any)!.current = node)}
            id="start-date"
            leadingIcon={CalendarIcon}
            label={label?.start}
            labelPosition={labelPosition}
            placeholder={placeholder}
            popupId={referenceProps['aria-controls']}
            isPopupExpanded={referenceProps['aria-expanded']}
            size={size}
            autoFocus={autoFocus}
            value={startValue}
            componentName="DatePickerInputStart"
            necessityIndicator={necessityIndicator}
            successText={successText?.start}
            errorText={errorText?.start}
            helpText={helpText?.start}
            {...props}
            {...referenceProps}
          />
        </BaseBox>
        <BaseBox flexShrink={0} alignSelf="start">
          <ArrowRightIcon
            size="medium"
            marginTop={
              // Hacky layouting because the we cannot put this inside the internal layout of BaseInput.
              hasLabel && (!isLabelPositionLeft || isMobile)
                ? `calc(${makeSize(iconVerticalMargin[size])} + ${makeSize(
                    isLarge ? sizeTokens[20] : sizeTokens[15],
                  )})`
                : makeSize(iconVerticalMargin[size])
            }
          />
        </BaseBox>
        <BaseBox flex={1}>
          <HiddenInput
            value={endValue}
            name={name?.end}
            isRequired={props.isRequired}
            isDisabled={props.isDisabled}
            {...makeAnalyticsAttribute(props)}
          />
          <DateInput
            id="end-date"
            placeholder={placeholder}
            leadingIcon={CalendarIcon}
            label={shouldRenderEndLabel()}
            labelPosition={isLabelPositionLeft ? undefined : labelPosition}
            popupId={referenceProps['aria-controls']}
            isPopupExpanded={referenceProps['aria-expanded']}
            size={size}
            value={endValue}
            componentName="DatePickerInputEnd"
            successText={successText?.end}
            errorText={errorText?.end}
            helpText={helpText?.end}
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
