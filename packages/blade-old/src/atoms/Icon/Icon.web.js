import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'styled-components';
import icons from '../../icons';
import automation from '../../_helpers/automation-attributes';
import { getColorKeys, getColor } from '../../_helpers/theme';

const iconSize = {
  xsmall: 12,
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 28,
};

const Icon = ({ accessibilityLabel, size, name, fill, testID, ...rest }) => {
  const IconComponent = icons[name];
  const theme = useTheme();
  return (
    <IconComponent
      fill={getColor(theme, fill)}
      height={iconSize[size]}
      width={iconSize[size]}
      {...automation({ accessibilityLabel, testID })}
      {...rest}
    />
  );
};

Icon.defaultProps = {
  accessibilityLabel: null,
  fill: 'shade.950',
  size: 'medium',
  testID: 'ds-icon',
};

Icon.propTypes = {
  accessibilityLabel: PropTypes.string,
  fill: PropTypes.oneOf(getColorKeys()),
  name: PropTypes.oneOf(Object.keys(icons)).isRequired,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']),
  testID: PropTypes.string,
};

export default Icon;
