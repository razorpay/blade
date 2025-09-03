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

// Styled component for time segment with focus styles
const StyledTimeSegment = styled.div`
  &:focus {
    background-color: #7c3aed !important;
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
  console.log('qswap idk segment', segment);
  let ref = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  const [isFocused, setIsFocused] = useState(false);

  // For editable segments, use React Aria's useDateSegment
  let { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <StyledTimeSegment
      ref={ref}
      {...segmentProps}
      style={{
        ...segmentProps.style,
        minWidth: segment.maxValue != null ? String(segment.maxValue).length + 'ch' : undefined,
        paddingLeft: '0.125rem', // px-0.5
        paddingRight: '0.125rem',
        boxSizing: 'content-box', // box-content
        fontVariantNumeric: 'tabular-nums', // tabular-nums
        textAlign: 'right', // text-right
        outline: 'none', // outline-none
        borderRadius: '0.125rem', // rounded-sm
      }}
      onFocus={(e: any) => {
        setIsFocused(true);
        segmentProps.onFocus?.(e); // Call React Aria's focus handler
      }}
      onBlur={(e: any) => {
        setIsFocused(false);
        segmentProps.onBlur?.(e); // Call React Aria's blur handler
      }}
    >
      {/* Always reserve space for the placeholder, to prevent layout shift when editing. */}
      <BaseBox
        as="span"
        style={{
          display: 'block', // block
          width: '100%', // w-full
          textAlign: 'center', // text-center
          color: isFocused ? '#ffffff' : theme.colors.surface.text.gray.disabled,
          // Show placeholder when segment is empty, hide when it has value
          visibility: segment.isPlaceholder ? undefined : 'hidden',
          height: segment.isPlaceholder ? 'auto' : 0,
          pointerEvents: 'none',
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
 * SEGMENTS STRUCTURE:
 * [
 *   { type: "literal", text: "⁦", isEditable: false },     // Formatting
 *   { type: "hour", text: "12", isEditable: true },        // Editable hour
 *   { type: "literal", text: ":", isEditable: false },     // Separator
 *   { type: "minute", text: "30", isEditable: true },      // Editable minute
 *   { type: "literal", text: "⁩", isEditable: false },     // Formatting
 *   { type: "literal", text: " ", isEditable: false },     // Space
 *   { type: "dayPeriod", text: "PM", isEditable: true }    // Editable AM/PM
 * ]
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
        {/* Filter out bi-directional text control characters (⁦⁩) that React Aria adds for RTL support
            but aren't needed for our UI - they appear as extra literal segments in some environments */}
        {state.segments
          .filter(
            (segment) =>
              segment.isEditable ||
              (segment.type === 'literal' && segment.text !== '⁦' && segment.text !== '⁩'),
          )
          .map((segment, i) => {
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
