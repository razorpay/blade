import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';
import automation from '../../_helpers/automation-attributes';

const TextArea = ({
  placeholder,
  helpText,
  errorText,
  onChange,
  variant,
  disabled,
  value,
  maxLength,
  label,
  testID,
  labelPosition,
  width,
  id,
}) => {
  // Outlined TextArea has only a top label
  if (labelPosition === 'left' && variant === 'outlined') {
    throw Error('Cannot have a left label on an outlined Text Area');
  }

  return (
    <TextInput
      placeholder={placeholder}
      helpText={helpText}
      errorText={errorText}
      onChange={onChange}
      variant={variant}
      disabled={disabled}
      maxLength={maxLength}
      label={label}
      labelPosition={labelPosition}
      width={width}
      value={value}
      id={id}
      _isMultiline={true}
      {...automation(testID)}
    />
  );
};

TextArea.propTypes = {
  placeholder: PropTypes.string,
  helpText: PropTypes.string,
  errorText: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['filled', 'outlined']),
  disabled: PropTypes.bool,
  value: PropTypes.string,
  maxLength: PropTypes.number,
  label: PropTypes.string,
  testID: PropTypes.string,
  labelPosition: PropTypes.oneOf(['top', 'left']),
  width: PropTypes.oneOf(['small', 'medium', 'auto']),
  id: PropTypes.string,
};

TextArea.defaultProps = {
  placeholder: '',
  onChange: () => {},
  disabled: false,
  variant: 'outlined',
  label: 'Label',
  testID: 'ds-text-area',
  labelPosition: 'top',
  width: 'medium',
};

export default TextArea;
