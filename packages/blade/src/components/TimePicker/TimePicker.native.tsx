import React from 'react';
import { Pressable, View } from 'react-native';
import { SpinWheel, ITEM_HEIGHT, SPACER } from './SpinWheel.native';
import { useTimePickerState } from './useTimePickerState';
import {
  createDateFromSelection,
  getNearestStepValue,
  getTimeComponents,
} from './utils';
import type { TimePickerProps, TimeFormat } from './types';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
} from '~components/BottomSheet';
import { Button } from '~components/Button';
import { Box } from '~components/Box';
import { Divider } from '~components/Divider';
import { Text } from '~components/Typography';
import { ClockIcon } from '~components/Icons';
import { useTheme } from '~components/BladeProvider';
import { FocusRingWrapper } from '~utils/getFocusRingStyles/getFocusRingStyles';
import getIn from '~utils/lodashButBetter/get';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { getStyledProps } from '~components/Box/styledProps';
import type { DataAnalyticsAttribute } from '~utils/types';

/**
 * Formats the selected `Date` into the trigger's display string, matching the
 * web segmented input output: `hh:mm AM/PM` for 12h, `HH:mm` for 24h.
 */
const formatTriggerValue = (date: Date | null, timeFormat: TimeFormat): string | null => {
  if (!date) return null;
  const { selectedHour, selectedMinute, selectedPeriod } = getTimeComponents(date, timeFormat);
  const mm = String(selectedMinute).padStart(2, '0');
  const hh = String(selectedHour).padStart(2, '0');
  return timeFormat === '12h' ? `${hh}:${mm} ${selectedPeriod}` : `${hh}:${mm}`;
};

/**
 * TimePicker (native)
 *
 * Lets the user pick a time via scrollable spin wheels. On native the picker
 * renders a tap-to-open trigger; the wheels open inside a `BottomSheet`.
 *
 * #### UX deviations from web
 *
 * - No segmented/keyboard-editable input — selection is wheel-only inside a
 *   `BottomSheet` (this matches the web `isMobile` experience).
 * - The decorative top/bottom fade gradient is omitted; only the center
 *   highlight band is rendered.
 *
 * #### Usage
 *
 * ```tsx
 * <TimePicker
 *   label="Pick time"
 *   timeFormat="12h"
 *   minuteStep={15}
 *   onApply={({ value }) => console.log(value)}
 * />
 * ```
 */
const TimePicker = ({
  value,
  defaultValue,
  onChange,
  onApply,
  isOpen,
  defaultIsOpen,
  onOpenChange,
  label,
  labelPosition = 'top',
  accessibilityLabel,
  errorText,
  helpText,
  isDisabled,
  isRequired,
  successText,
  validationState = 'none',
  size = 'medium',
  necessityIndicator = 'none',
  placeholder,
  showFooterActions = true,
  timeFormat = '12h',
  minuteStep = 1,
  testID,
  ...props
}: TimePickerProps & StyledPropsBlade & DataAnalyticsAttribute): React.ReactElement => {
  const { theme } = useTheme();

  const {
    timeValue,
    setTimeValue,
    selectedHour,
    selectedMinute,
    selectedPeriod,
    isOpen: isDropdownOpen,
    setIsOpen: setIsDropdownOpen,
    onApply: handleApply,
    onCancel: handleCancel,
  } = useTimePickerState({
    value,
    defaultValue,
    onChange,
    isOpen,
    defaultIsOpen,
    onOpenChange,
    timeFormat,
    showFooterActions,
    onApply,
  });

  const is12HourFormat = timeFormat === '12h';

  const open = (): void => {
    if (isDisabled) return;
    setIsDropdownOpen(true);
  };

  // Wheel value sets (mirrors TimePickerContent.web).
  const hourValues = is12HourFormat
    ? Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))
    : Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minuteValues = Array.from({ length: 60 / minuteStep }, (_, i) =>
    String(i * minuteStep).padStart(2, '0'),
  );
  const periodValues: ('AM' | 'PM')[] = ['AM', 'PM'];

  // When minuteStep > 1 keep the typed/selected minute but visually align the
  // wheel to the nearest valid step (mirrors web `displayValue`).
  const displayMinute =
    minuteStep > 1 ? getNearestStepValue(selectedMinute, minuteStep) : undefined;

  const handleHourChange = (val: string | number): void => {
    const hour = Number(val);
    setTimeValue(
      createDateFromSelection(selectedHour, selectedMinute, selectedPeriod, timeFormat, hour),
    );
  };

  const handleMinuteChange = (val: string | number): void => {
    const minute = Number(val);
    setTimeValue(
      createDateFromSelection(
        selectedHour,
        selectedMinute,
        selectedPeriod,
        timeFormat,
        undefined,
        minute,
      ),
    );
  };

  const handlePeriodChange = (val: string | number): void => {
    const period = String(val);
    setTimeValue(
      createDateFromSelection(
        selectedHour,
        selectedMinute,
        selectedPeriod,
        timeFormat,
        undefined,
        undefined,
        period,
      ),
    );
  };

  const isError = validationState === 'error';
  const isSuccess = validationState === 'success';
  const helperRenderText = isError ? errorText : isSuccess ? successText : helpText;
  const helperRenderColor:
    | 'feedback.text.negative.intense'
    | 'feedback.text.positive.intense'
    | 'surface.text.gray.muted' = isError
    ? 'feedback.text.negative.intense'
    : isSuccess
    ? 'feedback.text.positive.intense'
    : 'surface.text.gray.muted';

  const necessitySuffix =
    isRequired && necessityIndicator === 'required'
      ? ' *'
      : isRequired && necessityIndicator === 'optional'
      ? ' (optional)'
      : '';

  const displayValue = formatTriggerValue(timeValue, timeFormat);
  const triggerText = displayValue ?? placeholder ?? 'Select time';
  const hasValue = displayValue !== null;

  const labelNode = label ? (
    <Text size="small" color="surface.text.gray.muted">
      {`${label}${necessitySuffix}`}
    </Text>
  ) : null;

  const triggerNode = (
    <FocusRingWrapper
      isFocused={isDropdownOpen}
      borderRadius={theme.border.radius.medium}
      disabled={isDisabled}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? label}
        disabled={isDisabled}
        onPress={open}
      >
        <Box
          paddingX="spacing.4"
          paddingY={size === 'large' ? 'spacing.4' : 'spacing.3'}
          borderWidth={isDropdownOpen && !isDisabled ? 'thick' : 'thin'}
          borderColor={
            isDropdownOpen && !isDisabled
              ? 'interactive.border.primary.default'
              : 'surface.border.gray.muted'
          }
          borderRadius="medium"
          backgroundColor={
            isDisabled ? 'surface.background.gray.subtle' : 'surface.background.gray.intense'
          }
          display="flex"
          flexDirection="row"
          alignItems="center"
        >
          <Box marginRight="spacing.3">
            <ClockIcon
              size="medium"
              color={isDisabled ? 'surface.icon.gray.disabled' : 'surface.icon.gray.muted'}
            />
          </Box>
          <Text
            size="medium"
            color={hasValue ? 'surface.text.gray.normal' : 'surface.text.gray.muted'}
          >
            {triggerText}
          </Text>
        </Box>
      </Pressable>
    </FocusRingWrapper>
  );

  const highlightBandColor = getIn(theme.colors, 'interactive.background.gray.faded');

  return (
    <Box
      width="100%"
      {...getStyledProps(props)}
      {...metaAttribute({ name: MetaConstants.TimePicker, testID })}
    >
      {labelPosition === 'left' && labelNode ? (
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box paddingRight="spacing.3">{labelNode}</Box>
          <Box flex={1}>{triggerNode}</Box>
        </Box>
      ) : (
        <>
          {labelNode ? <Box paddingBottom="spacing.2">{labelNode}</Box> : null}
          {triggerNode}
        </>
      )}

      {helperRenderText ? (
        <Box paddingTop="spacing.2">
          <Text size="small" color={helperRenderColor}>
            {helperRenderText}
          </Text>
        </Box>
      ) : null}

      {!isDisabled && (
        <BottomSheet
          isOpen={isDropdownOpen}
          onDismiss={showFooterActions ? handleCancel : handleApply}
          enableContentPanningGesture={false}
        >
          <BottomSheetHeader title="Select Time" />
          <BottomSheetBody padding="spacing.0">
            <Box paddingX="spacing.5" paddingY="spacing.3">
              <Box
                display="flex"
                flexDirection="row"
                justifyContent="center"
                alignItems="flex-start"
                position="relative"
              >
                {/* Center highlight band. Sits behind the wheel values under the
                    centered row. `overflow: hidden` + explicit borderRadius avoid
                    Android white-bleed clipping. */}
                <View
                  pointerEvents="none"
                  style={{
                    position: 'absolute',
                    top: SPACER,
                    left: 0,
                    right: 0,
                    height: ITEM_HEIGHT,
                    borderRadius: theme.border.radius.small,
                    overflow: 'hidden',
                    backgroundColor: highlightBandColor,
                  }}
                />

                <SpinWheel
                label="Hour"
                values={hourValues}
                selectedValue={String(selectedHour).padStart(2, '0')}
                onChange={handleHourChange}
              />
              <Divider orientation="vertical" />
              <SpinWheel
                label="Minute"
                values={minuteValues}
                selectedValue={String(selectedMinute).padStart(2, '0')}
                displayValue={displayMinute}
                onChange={handleMinuteChange}
              />
              {is12HourFormat && (
                <>
                  <Divider orientation="vertical" />
                  <SpinWheel
                    label="Period"
                    values={periodValues}
                    selectedValue={selectedPeriod}
                    onChange={handlePeriodChange}
                  />
                </>
              )}
              </Box>
            </Box>
          </BottomSheetBody>
          {showFooterActions ? (
            <BottomSheetFooter>
              <Box display="flex" flexDirection="row">
                <Box flex={1} marginRight="spacing.2">
                  <Button variant="secondary" isFullWidth onClick={() => handleCancel()}>
                    Cancel
                  </Button>
                </Box>
                <Box flex={1}>
                  <Button isFullWidth onClick={() => handleApply()}>
                    Apply
                  </Button>
                </Box>
              </Box>
            </BottomSheetFooter>
          ) : null}
        </BottomSheet>
      )}
    </Box>
  );
};

export { TimePicker };
