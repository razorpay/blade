import React, { useRef } from 'react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import type { TimePickerProps } from './types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { DataAnalyticsAttribute } from '~utils/types';
import { TimeInput } from './TimeInput.web';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTimePickerState } from './useTimePickerState';
import { TimePickerContent } from './TimePickerContent';
import { useIsMobile } from '~utils/useIsMobile';
import { BottomSheet, BottomSheetBody, BottomSheetHeader } from '~components/BottomSheet';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { useId } from '~utils/useId';
import { componentZIndices } from '~utils/componentZIndices';
import { usePopup } from '~components/DatePicker/usePopup';

const _BaseTimePicker = ({
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
  validationState,
  size = 'medium',
  autoFocus,
  necessityIndicator,
  name,
  placeholder,
  showFooterActions = true,
  timeFormat = '12h',
  minuteStep = 1,
  labelSuffix,
  labelTrailing,
  zIndex = componentZIndices.popover,

  ...props
}: TimePickerProps &
  StyledPropsBlade &
  DataAnalyticsAttribute & {
    zIndex?: number;
  }): React.ReactElement => {
  const referenceRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const titleId = useId('timepicker-title');

  const {
    selectedTime,
    setSelectedTime,
    selectedTimeValue,
    setSelectedTimeValue,
    selectedHour,
    selectedMinute,
    selectedPeriod,
    isOpen: isDropdownOpen,
    setIsOpen: setIsDropdownOpen,
    onApply: handleApply,
    onCancel: handleCancel,
    createCompleteTime,
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

  const {
    refs,
    context,
    isMounted,
    floatingStyles,
    animationStyles,
    getReferenceProps,
    getFloatingProps,
  } = usePopup({
    enabled: !isMobile,
    placement: 'bottom-start',
    open: isDropdownOpen,
    onOpenChange: (isOpen, _, reason) => {
      if (isDisabled) return;
      setIsDropdownOpen(isOpen);
      if (reason === 'escape-key') {
        handleCancel();
      }
    },
    referenceRef,
  });
  // Mobile: Blur input when bottom sheet opens
  React.useEffect(() => {
    if (isMobile && isDropdownOpen) {
      // Find the currently focused time segment and blur it

      const activeElement = document.activeElement as HTMLElement | null;
      console.log('Qswap', activeElement);
      if (activeElement && 'blur' in activeElement && typeof activeElement.blur === 'function') {
        setTimeout(() => {
          activeElement.blur();
        }, 0);
      }
    }
  }, [isMobile, isDropdownOpen]);

  const content = (
    <TimePickerContent
      selectedTime={selectedTime}
      setSelectedTime={setSelectedTime}
      selectedHour={selectedHour}
      selectedMinute={selectedMinute}
      selectedPeriod={selectedPeriod}
      timeFormat={timeFormat}
      minuteStep={minuteStep}
      showFooterActions={showFooterActions}
      onApply={handleApply}
      onCancel={handleCancel}
    />
  );

  return (
    <BaseBox width="100%">
      <TimeInput
        ref={referenceRef}
        inputRef={refs.setReference}
        referenceProps={getReferenceProps()}
        time={selectedTime}
        timeValue={selectedTimeValue}
        onChange={setSelectedTime}
        onTimeValueChange={(timeValue) => setSelectedTimeValue(() => timeValue)}
        createCompleteTime={createCompleteTime}
        label={label}
        helpText={helpText}
        errorText={errorText}
        successText={successText}
        validationState={validationState}
        isDisabled={isDisabled}
        isRequired={isRequired}
        necessityIndicator={necessityIndicator}
        autoFocus={autoFocus}
        name={name}
        placeholder={placeholder}
        size={size}
        labelPosition={labelPosition}
        labelSuffix={labelSuffix}
        labelTrailing={labelTrailing}
        timeFormat={timeFormat}
        {...props}
      />

      {!isMobile && isMounted && (
        <FloatingPortal>
          <FloatingFocusManager
            initialFocus={-1}
            context={context}
            guards={false}
            order={['reference', 'content']}
          >
            <BaseBox
              ref={refs.setFloating}
              style={floatingStyles}
              zIndex={zIndex}
              {...getFloatingProps()}
              {...makeAccessible({ labelledBy: titleId })}
            >
              <BaseBox
                backgroundColor="popup.background.subtle"
                borderColor="popup.border.subtle"
                borderWidth="thin"
                borderStyle="solid"
                borderRadius="large"
                overflow="hidden"
                style={{
                  ...animationStyles,
                  boxShadow: `${theme.elevation.midRaised}`,
                }}
              >
                {content}
              </BaseBox>
            </BaseBox>
          </FloatingFocusManager>
        </FloatingPortal>
      )}

      {/* Mobile Bottom Sheet */}
      {isMobile && !isDisabled && (
        <BottomSheet snapPoints={[0.6, 0.6, 1]} isOpen={isDropdownOpen} onDismiss={handleCancel}>
          <BottomSheetHeader title="Select Time" />
          <BottomSheetBody>{content}</BottomSheetBody>
        </BottomSheet>
      )}
    </BaseBox>
  );
};

const BaseTimePicker = assignWithoutSideEffects(_BaseTimePicker, {
  displayName: 'BaseTimePicker',
  componentId: 'BaseTimePicker',
});

export { BaseTimePicker };
