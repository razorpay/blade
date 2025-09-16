import React from 'react';
import styled from 'styled-components';
import { SpinWheel } from './SpinWheel';
import { TimePickerFooter } from './TimePickerFooter';
import type { TimePickerContentProps } from './types';
import { getNearestStepValue, createDateFromSelection } from './utils';
import { Divider } from '~components/Divider';
import { useTheme } from '~components/BladeProvider';
import BaseBox from '~components/Box/BaseBox';
import { useIsMobile } from '~utils/useIsMobile';

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
      ${({ theme }) => theme.colors.surface.background.gray.intense} 0px,
      transparent 48px,
      transparent calc(100% - 48px),
      ${({ theme }) => theme.colors.surface.background.gray.intense} 100%
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

  const focusWheel = (index: number): void => {
    setActiveWheelIndex(index);
    // ensure tabindex update applies before focusing
    requestAnimationFrame(() => {
      wheelRefs[index]?.current?.focus();
    });
  };

  const handleContainerKeyDown = (e: React.KeyboardEvent<HTMLDivElement>): void => {
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

  const handleContainerFocus = (e: React.FocusEvent<HTMLDivElement>): void => {
    const target = e.target as HTMLElement;
    const idx = wheelRefs.findIndex((ref) => ref.current === target);
    if (idx !== -1 && idx !== activeWheelIndex) {
      setActiveWheelIndex(idx);
    }
  };

  // Generate values for each wheel with leading zeros
  const hourValues = is12HourFormat
    ? Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
    : Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

  const minuteValues = Array.from({ length: 60 / minuteStep }, (_, i) =>
    String(i * minuteStep).padStart(2, '0'),
  );
  const periodValues: ('AM' | 'PM')[] = ['AM', 'PM'];

  // Calculate display value for minute wheel positioning when minuteStep > 1
  // This allows typed values like "03" to position at nearest step "00" while preserving actual value
  const displayMinute = minuteStep > 1 ? getNearestStepValue(currentMinute, minuteStep) : undefined;

  // Handle value changes - directly update selectedTime
  const handleHourChange = (value: string | number): void => {
    const hour = Number(value);
    const newDate = createDateFromSelection(
      currentHour,
      currentMinute,
      currentPeriod,
      timeFormat,
      hour,
    );
    setSelectedTime(newDate);
  };

  const handleMinuteChange = (value: string | number): void => {
    const minute = Number(value);
    const newDate = createDateFromSelection(
      currentHour,
      currentMinute,
      currentPeriod,
      timeFormat,
      undefined,
      minute,
    );
    setSelectedTime(newDate);
  };

  const handlePeriodChange = (value: string | number): void => {
    const period = value as 'AM' | 'PM';
    const newDate = createDateFromSelection(
      currentHour,
      currentMinute,
      currentPeriod,
      timeFormat,
      undefined,
      undefined,
      period,
    );
    setSelectedTime(newDate);
  };

  const handleApply = (): void => {
    const newDate = createDateFromSelection(currentHour, currentMinute, currentPeriod, timeFormat);
    setSelectedTime(newDate);
    onApply();
  };

  return (
    <BaseBox
      display="flex"
      className="timepicker-content"
      flexDirection="column"
      height={showFooterActions ? '250px' : '196px'}
      width={isMobile ? '100%' : '198px'}
      data-allow-scroll="true"
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
        {/* Center highlight area */}
        <BaseBox
          position="absolute"
          top="50%"
          left="spacing.0"
          right="spacing.0"
          height="36px"
          transform="translateY(-50%)"
          backgroundColor="interactive.background.gray.faded"
          pointerEvents="none"
          zIndex={1}
        />

        {/* Hour Wheel */}
        <SpinWheel
          className="timepicker-hour-wheel"
          label="Hour"
          values={hourValues}
          selectedValue={String(currentHour).padStart(2, '0')}
          onValueChange={handleHourChange}
          scrollContainerRef={hourRef}
          tabIndex={activeWheelIndex === 0 ? 0 : -1}
        />
        <Divider orientation="vertical" />
        {/* Minute Wheel */}
        <SpinWheel
          className="timepicker-minute-wheel"
          label="Min"
          values={minuteValues}
          selectedValue={String(currentMinute).padStart(2, '0')}
          displayValue={displayMinute ? String(displayMinute).padStart(2, '0') : undefined}
          onValueChange={handleMinuteChange}
          scrollContainerRef={minuteRef}
          tabIndex={activeWheelIndex === 1 ? 0 : -1}
        />
        {/* Period Wheel (only for 12-hour format) */}

        {is12HourFormat && (
          <>
            <Divider orientation="vertical" />
            <SpinWheel
              className="timepicker-period-wheel"
              label="Period"
              values={periodValues}
              selectedValue={currentPeriod}
              onValueChange={handlePeriodChange}
              scrollContainerRef={periodRef}
              tabIndex={activeWheelIndex === 2 ? 0 : -1}
            />
          </>
        )}
      </StyledFadeContainer>

      {/* Footer with Apply/Cancel buttons */}
      {showFooterActions && <TimePickerFooter onApply={handleApply} onCancel={onCancel} />}
    </BaseBox>
  );
};

export { TimePickerContent };
