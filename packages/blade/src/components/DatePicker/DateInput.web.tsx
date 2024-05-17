/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useDatesContext, getFormattedDate } from '@mantine/dates';
import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import type { FormInputValidationProps } from '~components/Form';
import { ArrowRightIcon, CalendarIcon } from '~components/Icons';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { BaseInput } from '~components/Input/BaseInput';
import { size } from '~tokens/global';
import { makeSize } from '~utils';
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

type DatePickerRangeInputProps = {
  selectionType: 'range';
  label?: { start: string; end?: string };
  date: [Date, Date];
};
type DatePickerSingleInputProps = {
  selectionType: 'single';
  label?: string;
  date: Date;
};

type DatePickerCommonInputProps = {
  labelPosition?: BaseInputProps['labelPosition'];
  inputRef: React.Ref<any>;
  referenceProps: any;
} & Pick<BaseInputProps, 'size' | 'isRequired' | 'isDisabled' | 'accessibilityLabel'> &
  FormInputValidationProps;

type DatePickerInputProps = DatePickerCommonInputProps &
  (DatePickerRangeInputProps | DatePickerSingleInputProps);

const iconVerticalMargin = {
  medium: size[16],
  large: size[24],
} as const;
const _DatePickerInput = (
  {
    selectionType,
    referenceProps,
    inputRef,
    date,
    label,
    labelPosition,
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
    return (
      <DateInput
        ref={ref as never}
        id="start-date"
        labelPosition={labelPosition}
        label={label}
        placeholder="DD MMM YYYY"
        popupId={referenceProps['aria-controls']}
        isPopupExpanded={referenceProps['aria-expanded']}
        size={size}
        value={getFormattedDate({
          date,
          format,
          labelSeparator: '-',
          locale,
          type: 'default',
        })}
        {...props}
        {...referenceProps}
      />
    );
  }

  if (selectionType == 'range') {
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
            value={getFormattedDate({
              type: 'default',
              date: date[0],
              format,
              labelSeparator: '-',
              locale,
            })}
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
                ? `calc(${makeSize(iconVerticalMargin[size])} + ${isLarge ? '20px' : '15px'})`
                : makeSize(iconVerticalMargin[size])
            }
          />
        </BaseBox>
        <BaseBox flex={1}>
          <DateInput
            id="end-date"
            placeholder={format}
            leadingIcon={CalendarIcon}
            label={isLabelPositionLeft ? undefined : label?.end}
            labelPosition={isLabelPositionLeft ? undefined : labelPosition}
            popupId={referenceProps['aria-controls']}
            isPopupExpanded={referenceProps['aria-expanded']}
            size={size}
            value={getFormattedDate({
              type: 'default',
              date: date[1],
              format,
              labelSeparator: '-',
              locale,
            })}
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
export type { DatePickerCommonInputProps };
export { DatePickerInput };
