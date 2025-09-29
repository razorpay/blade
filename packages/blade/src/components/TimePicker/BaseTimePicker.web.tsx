import React, { useRef } from 'react';
import { FloatingFocusManager, FloatingPortal } from '@floating-ui/react';
import type { TimePickerProps } from './types';
import { TimeInput } from './TimeInput.web';
import { useTimePickerState } from './useTimePickerState';
import { TimePickerContent } from './TimePickerContent';
import type { DataAnalyticsAttribute } from '~utils/types';
import type { StyledPropsBlade } from '~components/Box/styledProps';
import { BottomSheet, BottomSheetBody, BottomSheetHeader } from '~components/BottomSheet';
import BaseBox from '~components/Box/BaseBox';
import { assignWithoutSideEffects } from '~utils/assignWithoutSideEffects';
import { makeAccessible } from '~utils/makeAccessible';
import { useId } from '~utils/useId';
import { useIsMobile } from '~utils/useIsMobile';
import { useTheme } from '~utils';
import { usePopup } from '~components/DatePicker/usePopup';
import { getStyledProps } from '~components/Box/styledProps';
import { metaAttribute, MetaConstants } from '~utils/metaAttribute';
import { size as sizeTokens } from '~tokens/global';

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
  testID,
  ...props
}: TimePickerProps & StyledPropsBlade & DataAnalyticsAttribute): React.ReactElement => {
  const referenceRef = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const { theme } = useTheme();
  const titleId = useId('timepicker-title');

  const {
    timeValue,
    setTimeValue,
    internalTimeValue,
    setInternalTimeValue,
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
    // crossAxisOffset calculation for left label positioning:
    // Medium: 120px (label width) + 12px (padding) = 132px
    // Large: 176px (label width) + 16px (padding) = 192px
    crossAxisOffset:
      labelPosition === 'left' ? (size === 'large' ? sizeTokens[192] : sizeTokens[132]) : 0,
  });

  // Fix for React Aria contentEditable focus issue with Floating UI
  // React Aria's contentEditable segments don't properly trigger Floating UI's dismiss
  // See: https://github.com/adobe/react-spectrum/issues/3164
  React.useEffect(() => {
    const handleClick = (e: MouseEvent): void => {
      const target = e.target as Node;
      const isClickOnInput = referenceRef.current?.contains(target);
      const isClickOnDropdown = refs.floating.current?.contains(target);

      // On mobile, also check if click is inside TimePicker content (BottomSheet)
      const isClickOnTimePickerContent = (target as Element).closest?.('.timepicker-content');

      // Only close dropdown if click is outside input, dropdown, and TimePicker content
      // This ensures clicking different segments within the input keeps dropdown open
      if (isDropdownOpen && !isClickOnInput && !isClickOnDropdown) {
        if (isClickOnTimePickerContent && showFooterActions) {
          // Inside TimePicker with footer actions - don't close
          return;
        }
        handleApply();
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
    return undefined;
  }, [isDropdownOpen, showFooterActions, handleCancel, handleApply]);

  // Mobile: Blur input when bottom sheet opens
  React.useEffect(() => {
    if (isMobile && isDropdownOpen) {
      // Find the currently focused time segment and blur it

      const activeElement = document.activeElement as HTMLElement | null;
      if (activeElement && 'blur' in activeElement && typeof activeElement.blur === 'function') {
        setTimeout(() => {
          activeElement.blur();
        }, 0);
      }
    }
  }, [isMobile, isDropdownOpen]);

  const content = (
    <TimePickerContent
      selectedTime={timeValue}
      setSelectedTime={setTimeValue}
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
    <BaseBox
      width="100%"
      {...getStyledProps(props)}
      {...metaAttribute({ name: MetaConstants.TimePicker })}
    >
      <TimeInput
        ref={referenceRef}
        inputRef={refs.setReference}
        referenceProps={getReferenceProps()}
        timeValue={timeValue}
        internalTimeValue={internalTimeValue}
        onChange={setTimeValue}
        onTimeValueChange={(timeValue) => {
          if (timeValue) {
            setInternalTimeValue(timeValue);
          }
        }}
        createCompleteTime={createCompleteTime}
        label={label}
        helpText={helpText}
        errorText={errorText}
        successText={successText}
        validationState={validationState}
        isDisabled={isDisabled}
        isRequired={isRequired}
        necessityIndicator={necessityIndicator}
        autoFocus={autoFocus} // eslint-disable-line jsx-a11y/no-autofocus
        name={name}
        placeholder={placeholder}
        size={size}
        labelPosition={labelPosition}
        labelSuffix={labelSuffix}
        labelTrailing={labelTrailing}
        timeFormat={timeFormat}
        isDropdownOpen={isDropdownOpen}
        setIsDropdownOpen={setIsDropdownOpen}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
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
