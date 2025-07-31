/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { FloatingPortal } from '@floating-ui/react';
import TimePickerSelection from './TimePickerSelection';
import './styles.css';
import { Box } from '~components/Box';
import { TimeInput } from '@mantine/dates';
import { ClockIcon } from '~components/Icons';

function TimePicker({
  // value: initialValue = null,
  cellHeight = 28,
  // placeHolder = 'Select Time',
  pickerDefaultValue = '10:00',
  // onChange = () => {},
  onFocus = () => {},
  onSave = () => {},
  onCancel = () => {},
  // disabled = false,
  isOpen: initialIsOpenValue = false,
  required = false,
  cancelButtonText = 'Cancel',
  saveButtonText = 'Save',
  controllers = true,
  seperator = true,
  id = null,
  use12Hours = true,
  onAmPmChange = () => {},
  name = null,
  onOpen = () => {},
  popupClassName = null,
  inputClassName = null,

  //
  label,
  value: initialValue = null,
  onChange,
  isDisabled = false,
  placeholder = 'Select Time',
}) {
  const [isOpen, setIsOpen] = useState(initialIsOpenValue);
  const [height, setHeight] = useState(cellHeight);
  const [inputValue, setInputValue] = useState(initialValue);

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  const handleFocus = () => {
    onFocus();
    onOpen();
  };

  let finalValue = inputValue;

  if (initialValue === null) {
    finalValue = `${pickerDefaultValue} AM`;
  }

  const params = {
    onChange,
    height,
    onSave,
    onCancel,
    cancelButtonText,
    saveButtonText,
    controllers,
    setInputValue,
    setIsOpen,
    seperator,
    use12Hours,
    onAmPmChange,
    initialValue: finalValue,
    pickerDefaultValue,
  };

  return (
    <>
      {/* use our label */}
      <TimeInput
        name={name}
        value={inputValue}
        icon={<ClockIcon size="medium" />}
        label={label}
        placeholder={placeholder}
        disabled={isDisabled}
        data-timepicker-input
        style={{
          width: '100%',
          cursor: isDisabled ? 'not-allowed' : 'text', // Show text cursor, not pointer
        }}
        onClick={handleClick}
        onFocus={handleFocus}
      />

      {isOpen && !isDisabled && (
        <FloatingPortal>
          <div className="react-ios-time-picker-popup">
            <div
              className={`react-ios-time-picker-popup-overlay ${popupClassName || ''}`}
              onClick={() => setIsOpen(!isOpen)}
            />
            <TimePickerSelection {...params} />
          </div>
        </FloatingPortal>
      )}
    </>
  );
}

export { TimePicker };
