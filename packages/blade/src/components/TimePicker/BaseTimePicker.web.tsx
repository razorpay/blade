import React, { useRef } from 'react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import type { TimePickerProps } from './types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { DataAnalyticsAttribute } from '~utils/types';
import { TimeInput } from './TimeInput.web';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { useTimePickerState } from './useTimePickerState';
import { TimePickerContent } from './TimePickerContent';
import { useTimePickerPopup } from './useTimePickerPopup';
import { useIsMobile } from '~utils/useIsMobile';
import {
  BottomSheet,
  BottomSheetBody,
  BottomSheetFooter,
  BottomSheetHeader,
} from '~components/BottomSheet';
import { TimePickerFooter } from './TimePickerFooter';
import BaseBox from '~components/Box/BaseBox';
import { useTheme } from '~utils';
import { makeAccessible } from '~utils/makeAccessible';
import { useId } from '~utils/useId';
import { componentZIndices } from '~utils/componentZIndices';

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

  // Use the hook instead of context
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
    showFooterActions: showActions,
    createCompleteTime,
  } = useTimePickerState({
    value,
    defaultValue,
    onChange,
    isOpen,
    defaultIsOpen,
    onOpenChange,
    timeFormat,
    minuteStep,
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
  } = useTimePickerPopup({
    isOpen: !isMobile ? isDropdownOpen : false, // Don't use floating on mobile
    onOpenChange: (open, _, reason) => {
      setIsDropdownOpen(open);
      if (reason === 'escape-key') {
        handleCancel();
      }
    },
    referenceRef,
  });
  // Mobile: Blur input when bottom sheet opens
  React.useEffect(() => {
    if (isMobile && isOpen) {
      const refEl = (refs.reference?.current as unknown) as { blur?: () => void } | null;
      if (refEl?.blur) {
        setTimeout(() => {
          refEl.blur?.();
        }, 0);
      }
    }
  }, [isMobile, isOpen, refs.reference]);

  console.log('qswap0 base', selectedHour, selectedMinute, selectedPeriod);
  console.log('qswap0.1 base', selectedTimeValue);
  console.log('qswap0.2 base', selectedTime);
  return (
    <BaseBox width="100%">
      <TimeInput
        ref={referenceRef}
        inputRef={refs.setReference}
        referenceProps={getReferenceProps()}
        time={selectedTime}
        timeValue={selectedTimeValue}
        onChange={setSelectedTime}
        onTimeValueChange={setSelectedTimeValue}
        onInputClick={() => setIsDropdownOpen(true)}
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

      {/* Desktop Floating Popup */}
      {!isMobile && isMounted && (
        <FloatingPortal>
          <FloatingFocusManager
            initialFocus={-1}
            context={context}
            guards={true}
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
                borderColor="surface.border.gray.subtle"
                borderWidth="thin"
                borderStyle="solid"
                borderRadius="medium"
                overflow="hidden"
                style={{
                  ...animationStyles,
                  boxShadow: `${theme.elevation.lowRaised}`,
                }}
              >
                <TimePickerContent
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  selectedHour={selectedHour}
                  selectedMinute={selectedMinute}
                  selectedPeriod={selectedPeriod}
                  timeFormat={timeFormat}
                  minuteStep={minuteStep}
                  showFooterActions={showActions}
                  onApply={handleApply}
                  onCancel={handleCancel}
                />
              </BaseBox>
            </BaseBox>
          </FloatingFocusManager>
        </FloatingPortal>
      )}

      {/* Mobile Bottom Sheet */}
      {isMobile && (
        <BottomSheet snapPoints={[0.6, 0.6, 1]} isOpen={isDropdownOpen} onDismiss={handleCancel}>
          <BottomSheetHeader title="Select Time" />
          <BottomSheetBody>
            <TimePickerContent
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              selectedHour={selectedHour}
              selectedMinute={selectedMinute}
              selectedPeriod={selectedPeriod}
              timeFormat={timeFormat}
              minuteStep={minuteStep}
              showFooterActions={showActions}
              onApply={handleApply}
              onCancel={handleCancel}
            />
          </BottomSheetBody>
          {showActions && (
            <BottomSheetFooter>
              <TimePickerFooter onApply={handleApply} onCancel={handleCancel} />
            </BottomSheetFooter>
          )}
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
