import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'styled-components/native';
import icons from '../../icons';
import { getColorKeys, getColor } from '../../_helpers/theme';

const iconSize = {
  xsmall: 12,
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 28,
};

const Icon = ({ size, name, fill, testID, ...rest }) => {
  const IconComponent = icons[name];
  const theme = useTheme();
  return (
    <IconComponent
      fill={getColor(theme, fill)}
      height={iconSize[size]}
      width={iconSize[size]}
      testID={testID}
      {...rest}
    />
  );
};

Icon.defaultProps = {
  size: 'medium',
  testID: 'ds-icon',
  fill: 'shade.950',
};

Icon.propTypes = {
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']),
  name: PropTypes.oneOf(Object.keys(icons)).isRequired,
  fill: PropTypes.oneOf(getColorKeys()),
  testID: PropTypes.string,
};

export default Icon;
