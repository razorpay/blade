import React from 'react';
import { ScrollView } from 'react-native';
import TextInput from '../TextInput';
import PropTypes from 'prop-types';

const TextArea = ({
  placeholder,
  helpText,
  errorText,
  onChangeText,
  variant,
  prefix,
  suffix,
  disabled,
  children,
  iconLeft,
  iconRight,
  maxLength,
  showCharacterCount,
  label,
  testID,
  labelPosition,
  size,
}) => {
  return (
    <ScrollView style={{ marginTop: 40 }}>
      <TextInput
        placeholder={placeholder}
        helpText={helpText}
        errorText={errorText}
        onChangeText={onChangeText}
        variant={variant}
        prefix={prefix}
        suffix={suffix}
        disabled={disabled}
        iconLeft={iconLeft}
        iconRight={iconRight}
        maxLength={maxLength}
        showCharacterCount={showCharacterCount}
        label={label}
        testID={testID}
        labelPosition={labelPosition}
        size={size}
        _isMultiline={true}
      >
        {children}
      </TextInput>
    </ScrollView>
  );
};

TextArea.propTypes = {
  placeholder: PropTypes.string,
  helpText: PropTypes.string,
  errorText: PropTypes.string,
  onChangeText: PropTypes.func,
  variant: PropTypes.oneOf(['filled', 'outline']),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  disabled: PropTypes.bool,
  children: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  maxLength: PropTypes.number,
  showCharacterCount: PropTypes.bool,
  label: PropTypes.string,
  testID: PropTypes.string,
  labelPosition: PropTypes.oneOf(['top', 'left']),
  size: PropTypes.oneOf(['small', 'medium']),
};

TextArea.defaultProps = {
  placeholder: 'Enter text here',
  variant: 'outline',
  label: 'Label',
  testID: 'ds-text-input',
  labelPosition: 'top',
  size: 'medium',
};

export default TextArea;
