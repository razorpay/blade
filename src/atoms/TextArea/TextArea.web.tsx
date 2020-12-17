import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';

const TextArea = ({
  placeholder,
  helpText,
  errorText,
  onChange,
  onBlur,
  variant,
  disabled,
  value,
  maxLength,
  label,
  testID,
  labelPosition,
  width,
  id,
  name,
  autoCapitalize,
}) => {
  // Outlined TextArea has only a top label
  if (labelPosition === 'left' && variant === 'outlined') {
    throw Error('Cannot have a left label on an outlined Text Area');
  }

  return (
    <TextInput
      id={id}
      name={name}
      placeholder={placeholder}
      helpText={helpText}
      errorText={errorText}
      onChange={onChange}
      onBlur={onBlur}
      variant={variant}
      disabled={disabled}
      maxLength={maxLength}
      label={label}
      labelPosition={labelPosition}
      width={width}
      value={value}
      testID={testID}
      autoCapitalize={autoCapitalize}
      _isMultiline
    />
  );
};

TextArea.propTypes = {
  placeholder: PropTypes.string,
  helpText: PropTypes.string,
  errorText: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  variant: PropTypes.oneOf(['filled', 'outlined']),
  disabled: PropTypes.bool,
  value: PropTypes.string,
  maxLength: PropTypes.number,
  label: PropTypes.string,
  testID: PropTypes.string,
  labelPosition: PropTypes.oneOf(['top', 'left']),
  width: PropTypes.oneOf(['small', 'medium', 'auto']),
  id: PropTypes.string,
  name: PropTypes.string,
  autoCapitalize: PropTypes.oneOf(['none', 'characters', 'words', 'sentences']),
};

TextArea.defaultProps = {
  placeholder: '',
  onChange: () => {},
  onBlur: () => {},
  disabled: false,
  variant: 'outlined',
  label: 'Label',
  testID: 'ds-text-area',
  labelPosition: 'top',
  width: 'medium',
  autoCapitalize: 'none',
};

export default TextArea;
