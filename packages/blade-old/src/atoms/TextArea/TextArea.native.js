import React from 'react';
import PropTypes from 'prop-types';
import TextInput from '../TextInput';
import automation from '../../_helpers/automation-attributes';
import isEmpty from '../../_helpers/isEmpty';

const TextArea = React.forwardRef(
  (
    {
      accessibilityLabel,
      autoFocus,
      placeholder,
      helpText,
      errorText,
      onChange,
      variant,
      prefix,
      suffix,
      disabled,
      value,
      iconLeft,
      iconRight,
      maxLength,
      label,
      testID,
      labelPosition,
      width,
      onSubmitEditing,
      onFocus,
      onBlur,
    },
    ref,
  ) => {
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
        ref={ref}
        autoFocus={autoFocus}
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
        width={width}
        value={value}
        onSubmitEditing={onSubmitEditing}
        onFocus={onFocus}
        onBlur={onBlur}
        _isMultiline={true}
        {...automation({ accessibilityLabel, testID })}
      />
    );
  },
);

TextArea.propTypes = {
  accessibilityLabel: PropTypes.string,
  placeholder: PropTypes.string,
  autoFocus: PropTypes.bool,
  helpText: PropTypes.string,
  errorText: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['filled', 'outlined']),
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  disabled: PropTypes.bool,
  value: PropTypes.string,
  iconLeft: PropTypes.string,
  iconRight: PropTypes.string,
  maxLength: PropTypes.number,
  label: PropTypes.string,
  testID: PropTypes.string,
  labelPosition: PropTypes.oneOf(['top', 'left']),
  width: PropTypes.oneOf(['small', 'medium', 'auto']),
  onSubmitEditing: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

TextArea.defaultProps = {
  accessibilityLabel: null,
  placeholder: '',
  onChange: () => {},
  disabled: false,
  variant: 'outlined',
  label: 'Label',
  testID: 'ds-text-area',
  labelPosition: 'top',
  width: 'medium',
};

TextArea.displayName = 'TextArea';

export default TextArea;
