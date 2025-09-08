import React from 'react';
import { SpinWheel } from './SpinWheel';
import { TimePickerFooter } from './TimePickerFooter';
import type { TimePickerContentProps } from './types';
import { useIsMobile } from '~utils/useIsMobile';
import { Divider } from '~components/Divider';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import styled from 'styled-components';
import { getNearestStepValue } from './utils';

/**
 * Helper function for time conversion
 */
const convertTo24Hour = (hour12: number, period: string): number => {
  if (period === 'AM') {
    return hour12 === 12 ? 0 : hour12;
  } else {
    return hour12 === 12 ? 12 : hour12 + 12;
  }
};

// Styled container with fade overlay
const StyledFadeContainer = styled(BaseBox)`
  position: relative;

  /* Fade overlay that sits above content */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      ${(props: any) => props.theme.colors.surface.background.gray.intense} 0px,
      transparent 48px,
      transparent calc(100% - 48px),
      ${(props: any) => props.theme.colors.surface.background.gray.intense} 100%
    );
    pointer-events: none;
    z-index: 10;
  }
`;

/**
 * Content component for TimePicker dropdown
 * Contains the time selection wheels and footer
 */
const TimePickerContent = ({
  selectedTime,
  setSelectedTime,
  selectedHour,
  selectedMinute,
  selectedPeriod,
  timeFormat,
  minuteStep,
  showFooterActions,
  onApply,
  onCancel,
}: TimePickerContentProps): React.ReactElement => {
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  // Use values from hook instead of local state
  const currentHour = selectedHour;
  const currentMinute = selectedMinute;
  const currentPeriod = selectedPeriod;

  const is12HourFormat = timeFormat === '12h';

  // Roving tabindex + focus management across wheels
  const [activeWheelIndex, setActiveWheelIndex] = React.useState(0);
  const hourRef = React.useRef<HTMLDivElement>(null);
  const minuteRef = React.useRef<HTMLDivElement>(null);
  const periodRef = React.useRef<HTMLDivElement>(null);

  const wheelRefs = is12HourFormat ? [hourRef, minuteRef, periodRef] : [hourRef, minuteRef];

  const focusWheel = (index: number) => {
    setActiveWheelIndex(index);
    // ensure tabindex update applies before focusing
    requestAnimationFrame(() => {
      wheelRefs[index]?.current?.focus();
    });
  };

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Up/Down should be handled by individual wheels; Left/Right move to next wheel
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(activeWheelIndex + 1, wheelRefs.length - 1);
      if (next !== activeWheelIndex) focusWheel(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(activeWheelIndex - 1, 0);
      if (prev !== activeWheelIndex) focusWheel(prev);
    }
  };

  const handleContainerFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const idx = wheelRefs.findIndex((ref) => ref.current === target);
    if (idx !== -1 && idx !== activeWheelIndex) {
      setActiveWheelIndex(idx);
    }
  };

  // Generate values for each wheel
  const hourValues = is12HourFormat
    ? Array.from({ length: 12 }, (_, i) => i + 1) // 1-12 for 12-hour
    : Array.from({ length: 24 }, (_, i) => i); // 0-23 for 24-hour

  const minuteValues = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep);
  const periodValues: ('AM' | 'PM')[] = ['AM', 'PM'];

  // Calculate display value for minute wheel positioning when minuteStep > 1
  // This allows typed values like "03" to position at nearest step "00" while preserving actual value
  const displayMinute = minuteStep > 1 ? getNearestStepValue(currentMinute, minuteStep) : undefined;

  // Create Date object from selection parameters
  const createDateFromSelection = (hour?: number, minute?: number, period?: string): Date => {
    const date = new Date();
    const useHour = hour ?? currentHour;
    const useMinute = minute ?? currentMinute;
    const usePeriod = period ?? currentPeriod;

    const hour24 = is12HourFormat ? convertTo24Hour(useHour, usePeriod) : useHour;
    date.setHours(hour24, useMinute, 0, 0);
    return date;
  };

  // Handle value changes - directly update selectedTime
  const handleHourChange = (value: string | number) => {
    const hour = Number(value);
    const newDate = createDateFromSelection(hour, currentMinute, currentPeriod);
    setSelectedTime(newDate);
  };

  const handleMinuteChange = (value: string | number) => {
    const minute = Number(value);
    const newDate = createDateFromSelection(currentHour, minute, currentPeriod);
    setSelectedTime(newDate);
  };

  const handlePeriodChange = (value: string | number) => {
    const period = value as 'AM' | 'PM';
    const newDate = createDateFromSelection(currentHour, currentMinute, period);
    setSelectedTime(newDate);
  };

  const handleApply = () => {
    const newDate = createDateFromSelection();
    setSelectedTime(newDate);
    onApply();
  };

  return (
    <BaseBox
      display="flex"
      flexDirection="column"
      height="249px"
      width={isMobile ? '100%' : '198px'}
    >
      {/* Time Selection Wheels */}
      <StyledFadeContainer
        theme={theme}
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="flex-start"
        margin={['spacing.4', 'spacing.0']}
        onKeyDown={handleContainerKeyDown}
        onFocus={handleContainerFocus}
      >
        {/* Hour Wheel */}
        <SpinWheel
          label="Hour"
          values={hourValues}
          selectedValue={currentHour}
          onValueChange={handleHourChange}
          scrollContainerRef={hourRef}
          tabIndex={activeWheelIndex === 0 ? 0 : -1}
        />
        <Divider orientation="vertical" />
        {/* Minute Wheel */}
        <SpinWheel
          label="Min"
          values={minuteValues}
          selectedValue={currentMinute}
          displayValue={displayMinute}
          onValueChange={handleMinuteChange}
          scrollContainerRef={minuteRef}
          tabIndex={activeWheelIndex === 1 ? 0 : -1}
        />
        <Divider orientation="vertical" />
        {/* Period Wheel (only for 12-hour format) */}
        {is12HourFormat && (
          <SpinWheel
            label="Period"
            values={periodValues}
            selectedValue={currentPeriod}
            onValueChange={handlePeriodChange}
            scrollContainerRef={periodRef}
            tabIndex={activeWheelIndex === 2 ? 0 : -1}
          />
        )}
      </StyledFadeContainer>

      {/* Footer with Apply/Cancel buttons */}
      {showFooterActions && <TimePickerFooter onApply={handleApply} onCancel={onCancel} />}
    </BaseBox>
  );
};

export { TimePickerContent };
