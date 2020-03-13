import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';
import automation from '../../_helpers/automation-attributes';
import isEmpty from '../../_helpers/isEmpty';

const TextArea = ({
  placeholder,
  helpText,
  errorText,
  onChange,
  variant,
  prefix,
  suffix,
  disabled,
  children,
  iconLeft,
  iconRight,
  maxLength,
  label,
  testID,
  labelPosition,
  size,
}) => {
  if (!isEmpty(prefix) && !isEmpty(iconLeft)) {
    throw Error('Cannot have prefix and left icon together');
  }

  if (!isEmpty(suffix) && !isEmpty(iconRight)) {
    throw Error('Cannot have suffix and right icon together');
  }

  if (labelPosition === 'left' && variant === 'outlined') {
    // Outlined Text Area has only a top label
    throw Error('Cannot have a left label on an outlined Text Area');
  }

  return (
    <TextInput
      placeholder={placeholder}
      helpText={helpText}
      errorText={errorText}
      onChange={onChange}
      variant={variant}
      prefix={prefix}
      suffix={suffix}
      disabled={disabled}
      iconLeft={iconLeft}
      iconRight={iconRight}
      maxLength={maxLength}
      label={label}
      labelPosition={labelPosition}
      size={size}
      _isMultiline={true}
      {...automation(testID)}
    >
      {children}
    </TextInput>
  );
};

TextArea.propTypes = {
  placeholder: PropTypes.string,
  helpText: PropTypes.string,
  errorText: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['filled', 'outlined']),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  maxLength: PropTypes.number,
  label: PropTypes.string,
  testID: PropTypes.string,
  labelPosition: PropTypes.oneOf(['top', 'left']),
  size: PropTypes.oneOf(['small', 'medium', 'block']),
};

TextArea.defaultProps = {
  placeholder: 'Enter text here',
  helpText: undefined,
  errorText: undefined,
  onChange: () => {},
  prefix: undefined,
  suffix: undefined,
  disabled: false,
  children: undefined,
  iconLeft: undefined,
  iconRight: undefined,
  maxLength: undefined,
  variant: 'outlined',
  label: 'Label',
  testID: 'ds-text-area',
  labelPosition: 'top',
  size: 'medium',
};

export default TextArea;
