import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useLocale } from '@react-aria/i18n';
import { useTimeField, useDateSegment } from '@react-aria/datepicker';
import { useTimeFieldState } from '@react-stately/datepicker';
import type { TimePickerInputProps, TimeSegmentProps } from './types';
import type { BladeElementRef } from '~utils/types';
import { BaseBox } from '~components/Box/BaseBox';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import { useTheme } from '~components/BladeProvider';
import { ClockIcon } from '~components/Icons';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { mergeRefs } from '~utils/useMergeRefs';

const StyledTimeSegment = styled.div<{ segmentMaxValue?: number }>`
  padding-left: 0.125rem;
  padding-right: 0.125rem;
  box-sizing: content-box;
  font-variant-numeric: tabular-nums;
  text-align: right;
  outline: none;
  border-radius: 0.125rem;

  min-width: ${(props: { segmentMaxValue?: number }) =>
    props.segmentMaxValue != null ? `${String(props.segmentMaxValue).length}ch` : 'auto'};

  &:focus {
    background-color: ${({ theme }) =>
      theme.colors.interactive.background.primary.faded} !important;
    color: #ffffff !important;

    span {
      color: #000000 !important;
    }
  }
`;

/**
 * TimeSegment Component
 *
 * Renders individual time segments (hour, minute, AM/PM) or literal text (separators like ":", " ").
 *
 * For EDITABLE segments (hour, minute, dayPeriod):
 * - Uses React Aria's useDateSegment for full keyboard/accessibility support
 * - Renders as contentEditable div that users can click and type in
 * - Handles arrow keys, number input, focus management automatically
 *
 * For LITERAL segments (separators):
 * - Just renders static text in a span
 * - No interaction or focus behavior
 *
 * Key features:
 * - Placeholder text that reserves space to prevent layout shifts
 * - Proper ARIA labels for screen readers
 * - Auto-sizing based on max possible value length
 * - Full keyboard navigation support
 */
const TimeSegment: React.ForwardRefRenderFunction<BladeElementRef, TimeSegmentProps> = ({
  segment,
  state,
  isDisabled,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();
  const { segmentProps } = useDateSegment(segment, state, ref);

  /* Filter out bi-directional text control characters (⁦⁩) that React Aria adds for RTL support
            but aren't needed for our UI - they appear as extra literal segments in some environments */

  if ((segment.type === 'literal' && segment.text === '⁦') || segment.text === '⁩') {
    return null;
  }

  return (
    <StyledTimeSegment
      ref={ref}
      segmentMaxValue={segment.maxValue}
      theme={theme}
      style={segmentProps.style}
      onFocus={(e: React.FocusEvent<HTMLDivElement>) => {
        setIsFocused(true);
        segmentProps.onFocus?.(e);
      }}
      onBlur={(e: React.FocusEvent<HTMLDivElement>) => {
        setIsFocused(false);
        segmentProps.onBlur?.(e);
      }}
      {...segmentProps}
    >
      {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
      <BaseBox
        as="span"
        display="block"
        width="100%"
        textAlign="center"
        visibility={segment.isPlaceholder ? undefined : 'hidden'}
        height={segment.isPlaceholder ? 'auto' : 'spacing.0'}
        pointerEvents="none"
        style={{
          color: isFocused
            ? theme.colors.surface.text.gray.normal
            : theme.colors.surface.text.gray.disabled,
        }}
      >
        {segment.placeholder} {/* Placeholder text like "––" or "am" */}
      </BaseBox>
      {/* Show actual value when not placeholder, empty string when placeholder */}
      <BaseBox
        as="span"
        style={{
          color: isDisabled
            ? theme.colors.surface.text.gray.disabled
            : theme.colors.surface.text.gray.normal,
        }}
      >
        {segment.isPlaceholder ? '' : segment.text}
      </BaseBox>
    </StyledTimeSegment>
  );
};

/**
 * TimeInput Component
 *
 * A complete time input field built with React Aria for accessibility and keyboard interaction.
 *
 * ARCHITECTURE:
 * - Uses React Aria's useTimeFieldState for time value management & field-level behavior
 * - Uses Blade's BaseInput (as="div") for styling and form integration
 * - Renders multiple TimeSegment components for individual time parts
 *
 * USER INTERACTION:
 * - Click on any segment (hour, minute, AM/PM) to focus and edit
 * - Type numbers directly to change values
 * - Use arrow keys to increment/decrement values
 * - Tab between segments for navigation
 * - Full keyboard accessibility support
 *

 */
const _TimeInput: React.ForwardRefRenderFunction<BladeElementRef, TimePickerInputProps> = (
  {
    timeValue,
    internalTimeValue,
    onChange,
    onTimeValueChange,
    label,
    helpText,
    errorText,
    successText,
    validationState,
    isDisabled,
    isRequired,
    necessityIndicator,
    autoFocus,
    name,
    placeholder,
    size = 'medium',
    labelPosition,
    labelSuffix,
    labelTrailing,
    timeFormat,
    testID,
    accessibilityLabel,
    inputRef,
    referenceProps,
    createCompleteTime,
    setIsDropdownOpen,
    ...props
  },
  ref: React.ForwardedRef<BladeElementRef>,
) => {
  const currentTimeFormat = timeFormat ?? '12h';
  const { locale } = useLocale();

  const state = useTimeFieldState({
    label,
    locale,
    hourCycle: currentTimeFormat === '12h' ? 12 : 24,
    value: internalTimeValue, // Use TimeValue directly from hook
    onChange: onTimeValueChange, // Use TimeValue onChange directly
    isDisabled,
    shouldForceLeadingZeros: true, // Force leading zeros (01, 02, 03...)
  });

  const timeFieldRef = useRef<HTMLDivElement>(null);
  const { fieldProps } = useTimeField(
    {
      label,
    },
    state,
    timeFieldRef,
  );

  // Extract onKeyDown from referenceProps to handle Enter key for dropdown opening
  const { onKeyDown: referenceOnKeyDown, ...otherReferenceProps } = referenceProps;

  // Handle Enter key to open dropdown while preserving React Aria's keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter' && !isDisabled) {
      // Trigger dropdown opening (same as clicking the input)
      referenceOnKeyDown?.(event);
      return;
    }

    // Let React Aria handle all other keys for segment navigation
    fieldProps.onKeyDown?.(event);
  };

  const handleInputClick = React.useCallback(
    (_e: React.MouseEvent): void => {
      if (isDisabled) return;

      setIsDropdownOpen?.(true);
    },
    [isDisabled, setIsDropdownOpen],
  );

  return (
    <BaseBox
      {...fieldProps}
      onClick={handleInputClick}
      onKeyDown={handleKeyDown}
      ref={mergeRefs(timeFieldRef, ref as React.Ref<HTMLDivElement>)}
    >
      <BaseInput
        ref={inputRef}
        as="div"
        id="timepicker"
        label={label || 'Select Time'}
        helpText={helpText}
        errorText={errorText}
        successText={successText}
        validationState={validationState}
        isDisabled={isDisabled}
        isRequired={isRequired}
        necessityIndicator={necessityIndicator}
        autoFocus={autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
        name={name}
        size={size}
        labelPosition={labelPosition}
        labelSuffix={labelSuffix}
        labelTrailing={labelTrailing}
        leadingIcon={ClockIcon}
        popupId={referenceProps['aria-controls']}
        isPopupExpanded={referenceProps['aria-expanded']}
        hasPopup={referenceProps['aria-haspopup']}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        {...props}
        {...otherReferenceProps}
      >
        {state.segments.map((segment, i) => {
          return (
            // Fix for React Aria contentEditable focus issue
            // Wrapping each segment in a div prevents unwanted focus when clicking outside
            // See: https://github.com/adobe/react-spectrum/issues/3164
            <BaseBox key={i}>
              <TimeSegment segment={segment} state={state} isDisabled={isDisabled} />
            </BaseBox>
          );
        })}
      </BaseInput>
    </BaseBox>
  );
};

const TimeInput = assignWithoutSideEffects(React.forwardRef(_TimeInput), {
  displayName: 'TimeInput',
  componentId: 'TimeInput',
});
export { TimeInput };
