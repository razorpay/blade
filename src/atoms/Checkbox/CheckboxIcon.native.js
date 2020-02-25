import React from 'react';
import PropTypes from 'prop-types';
import Icon from './../Icon';
function CheckboxIcon({ checked, size, disabled }) {
  if (checked) {
    return (
      <Icon
        size={size}
        name="checkboxFilled"
        fill={disabled ? 'shade.300' : 'primary.800'}
        testID="ds-checkbox-icon-checked"
      />
    );
  }
  return (
    <Icon
      size={size}
      name="checkboxOutlined"
      fill={disabled ? 'shade.300' : 'shade.500'}
      testID="ds-checkbox-icon-unchecked"
    />
  );
}

CheckboxIcon.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
};

CheckboxIcon.defaultProps = {
  size: 'medium',
};

export default CheckboxIcon;
