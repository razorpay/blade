/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DatesRangeValue } from '@mantine/dates';
import { useDatesContext, getFormattedDate } from '@mantine/dates';
import React from 'react';
import BaseBox from '~components/Box/BaseBox';
import { ArrowRightIcon, CalendarIcon } from '~components/Icons';
import type { BaseInputProps } from '~components/Input/BaseInput';
import { BaseInput } from '~components/Input/BaseInput';
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
      // Form Props
      // hideLabelText={props.label?.length === 0}
      // labelPosition={props.labelPosition === 'inside-input' ? undefined : props.labelPosition}
      // isLabelInsideInput={props.labelPosition === 'inside-input'}
      autoCompleteSuggestionType="none"
      // a11y Props
      // id={`${dropdownBaseId}-trigger`}
      // labelId={`${dropdownBaseId}-label`}
      // hasPopup={getActionListContainerRole(hasFooterAction, dropdownTriggerer)}
      // isPopupExpanded={isOpen}
      // popupId={`${dropdownBaseId}-actionlist`}
      // Special Props for Unique behaviour between Select and AutoComplete
      size={props.size}
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

type DatePickerInputProps = {
  date: Date | DatesRangeValue;
  inputRef: React.Ref<any>;
  referenceProps: any;
};

const _DatePickerInput = (
  { referenceProps, inputRef, date }: DatePickerInputProps,
  ref: React.ForwardedRef<any>,
): React.ReactElement => {
  const format = 'DD/MM/YYYY';
  const { locale } = useDatesContext();
  if (date instanceof Date) {
    return (
      <DateInput
        ref={inputRef as never}
        id="start-date"
        value={getFormattedDate({
          date,
          format,
          labelSeparator: '-',
          locale,
          type: 'default',
        })}
        label="Start date"
        placeholder="DD MMM YYYY"
        {...referenceProps}
      />
    );
  }

  if (Array.isArray(date)) {
    return (
      <BaseBox
        width="100%"
        display="flex"
        flexDirection="row"
        gap="spacing.3"
        alignItems="center"
        ref={ref as never}
      >
        <DateInput
          ref={inputRef as never}
          id="start-date"
          value={getFormattedDate({
            type: 'default',
            date: date[0],
            format,
            labelSeparator: '-',
            locale,
          })}
          leadingIcon={CalendarIcon}
          label="Start date"
          placeholder={format}
          {...referenceProps}
        />
        <ArrowRightIcon marginTop="22px" size="small" />
        <DateInput
          ref={inputRef as never}
          id="end-date"
          value={getFormattedDate({
            type: 'default',
            date: date[1],
            format,
            labelSeparator: '-',
            locale,
          })}
          placeholder={format}
          leadingIcon={CalendarIcon}
          label="End date"
          {...referenceProps}
        />
      </BaseBox>
    );
  }

  return <></>;
};

const DatePickerInput = React.forwardRef(_DatePickerInput);
export { DatePickerInput };
