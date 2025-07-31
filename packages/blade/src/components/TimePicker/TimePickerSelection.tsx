/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useEffect, useState } from 'react';
import HourFormat from './HourFormat';
import HourWheel from './HourWheel';
import MinuteWheel from './MinuteWheel';
import { Box } from '~components/Box';
import { Button } from '~components/Button';
import { Text } from '~components/Typography';

function TimePickerSelection({
  pickerDefaultValue,
  initialValue,
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
}) {
  const initialTimeValue = use12Hours ? initialValue.slice(0, 5) : initialValue;
  const [value, setValue] = useState(initialValue === null ? pickerDefaultValue : initialTimeValue);
  const [hourFormat, setHourFormat] = useState({
    mount: false,
    hourFormat: initialValue.slice(6, 8),
  });

  useEffect(() => {
    if (controllers === false) {
      const finalSelectedValue = use12Hours ? `${value} ${hourFormat.hourFormat}` : value;
      setInputValue(finalSelectedValue);
      onChange(finalSelectedValue);
    }
  }, [value]);

  useEffect(() => {
    if (hourFormat.mount) {
      onAmPmChange(hourFormat.hourFormat);
    }
  }, [hourFormat]);

  const params = {
    height,
    value,
    setValue,
    controllers,
    use12Hours,
    onAmPmChange,
    setHourFormat,
    hourFormat,
  };

  const handleSave = () => {
    const finalSelectedValue = use12Hours ? `${value} ${hourFormat.hourFormat}` : value;
    setInputValue(finalSelectedValue);
    onChange(finalSelectedValue);
    onSave(finalSelectedValue);
    setIsOpen(false);
  };
  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return (
    <Box
      backgroundColor="surface.background.gray.moderate"
      boxShadow="0 11px 15px #0005"
      borderRadius="medium"
      overflow="hidden"
    >
      <Box
        height={`${height * 5 + 40}px`}
        display="flex"
        justifyContent="center"
        overflow="hidden"
        width="220px"
        padding={['spacing.6', 'spacing.0']}
        position="relative"
      >
        <Box
          top={`${height * 2 + 20}px`}
          height={`${height}px`}
          backgroundColor="surface.background.sea.intense"
          position="absolute"
          left="0"
          right="0"
          zIndex="1"
          borderRadius="medium"
          margin={['spacing.0', 'spacing.4']}
        />
        <HourWheel {...params} />
        {seperator && (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            position="relative"
            zIndex="100"
            fontWeight="semibold"
          >
            <Text color="surface.text.onSea.onIntense">:</Text>
          </Box>
        )}
        <MinuteWheel {...params} />
        {use12Hours && <HourFormat {...params} />}
      </Box>
      <Box padding="spacing.3" display="flex" justifyContent="space-between">
        <Button variant="tertiary" onClick={handleCancel}>
          {cancelButtonText}
        </Button>
        <Button onClick={handleSave}>{saveButtonText}</Button>
      </Box>
    </Box>
  );
}

export default TimePickerSelection;
