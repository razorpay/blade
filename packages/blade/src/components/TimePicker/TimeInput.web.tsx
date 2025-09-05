import React, { useRef, useState } from 'react';
import styled from 'styled-components';

import type { TimePickerInputProps, TimeSegmentProps } from './types';
import { BaseBox } from '~components/Box/BaseBox';
import type { BladeElementRef } from '~utils/types';

import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { mergeRefs } from '~utils/useMergeRefs';

import { useLocale } from '@react-aria/i18n';
import { useTimeFieldState } from '@react-stately/datepicker';
import { useTimeField } from '@react-aria/datepicker';
import { BaseInput } from '~components/Input/BaseInput/BaseInput';
import { useDateSegment } from '@react-aria/datepicker';
import { useTheme } from '~components/BladeProvider';
import { ClockIcon } from '~components/Icons';

const StyledTimeSegment = styled.div<{ segmentMaxValue?: number }>`
  padding-left: 0.125rem;
  padding-right: 0.125rem;
  box-sizing: content-box;
  font-variant-numeric: tabular-nums;
  text-align: right;
  outline: none;
  border-radius: 0.125rem;

  min-width: ${(props: any) =>
    props.segmentMaxValue != null ? String(props.segmentMaxValue).length + 'ch' : 'auto'};

  &:focus {
    background-color: ${(props: any) =>
      props.theme.colors.interactive.background.primary.highlighted} !important;
    color: #ffffff !important;
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
}) => {
  /* Filter out bi-directional text control characters (⁦⁩) that React Aria adds for RTL support
            but aren't needed for our UI - they appear as extra literal segments in some environments */

  if ((segment.type === 'literal' && segment.text === '⁦') || segment.text === '⁩') {
    return null;
  }

  let ref = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { theme } = useTheme();
  let { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <StyledTimeSegment
      ref={ref}
      segmentMaxValue={segment.maxValue}
      theme={theme}
      style={segmentProps.style}
      onFocus={(e: any) => {
        setIsFocused(true);
        segmentProps.onFocus?.(e);
      }}
      onBlur={(e: any) => {
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
      {segment.isPlaceholder ? '' : segment.text}
    </StyledTimeSegment>
  );
};

/**
 * TimeInput Component
 *
 * A complete time input field built with React Aria for accessibility and keyboard interaction.
 *
 * ARCHITECTURE:
 * - Uses React Aria's useTimeFieldState for time value management
 * - Uses React Aria's useTimeField for field-level behavior
 * - Uses Blade's BaseInput (as="custom") for styling and form integration
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
    time,
    timeValue,
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
    inputRef,
    referenceProps,
    onInputClick,
    createCompleteTime,
    ...props
  },
  ref,
) => {
  const currentTimeFormat = timeFormat ?? '12h';
  let { locale } = useLocale();

  let state = useTimeFieldState({
    label,
    locale,
    hourCycle: currentTimeFormat === '12h' ? 12 : 24,
    value: timeValue as any, // Use TimeValue directly from hook
    onChange: onTimeValueChange, // Use TimeValue onChange directly
  });

  let timeFieldRef = useRef<HTMLDivElement>(null);
  let { fieldProps } = useTimeField(
    {
      label,
    },
    state,
    timeFieldRef as any,
  );

  const handleInputClick = () => {
    onInputClick?.();
  };

  return (
    <BaseBox {...fieldProps} ref={mergeRefs(timeFieldRef, ref as any)}>
      <BaseInput
        ref={inputRef}
        as="custom"
        id="timepicker"
        label={label || 'Select Time'}
        helpText={helpText}
        errorText={errorText}
        successText={successText}
        validationState={validationState}
        isDisabled={isDisabled}
        isRequired={isRequired}
        necessityIndicator={necessityIndicator}
        autoFocus={autoFocus}
        name={name}
        size={size}
        labelPosition={labelPosition}
        labelSuffix={labelSuffix}
        labelTrailing={labelTrailing}
        leadingIcon={ClockIcon}
        onClick={handleInputClick}
        popupId={referenceProps['aria-controls']}
        isPopupExpanded={referenceProps['aria-expanded']}
        hasPopup={referenceProps['aria-haspopup']}
        {...props}
        {...referenceProps}
      >
        {state.segments.map((segment, i) => {
          return <TimeSegment key={i} segment={segment} state={state} />;
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
