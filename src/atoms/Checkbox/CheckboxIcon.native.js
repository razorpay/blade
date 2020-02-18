import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components/native';
import Icon from './../Icon';
function CheckboxIcon({ checked, size, disabled }) {
  const theme = useContext(ThemeContext);
  if (checked) {
    return (
      <Icon
        size={size}
        name="checkedSquare"
        fill={disabled ? theme.colors.shade['300'] : theme.colors.primary['800']}
      />
    );
  }
  return (
    <Icon
      size={size}
      name="uncheckedSquare"
      fill={disabled ? theme.colors.shade['300'] : theme.colors.shade['500']}
    />
  );
}

CheckboxIcon.propTypes = {
  size: PropTypes.oneOf(['large', 'medium', 'small']),
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
};

export default CheckboxIcon;
