import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from 'styled-components';
import icons from '../../icons';
import { getColorKeys, getColor } from '../../_helpers/theme';

const iconSize = {
  xsmall: 12,
  small: 16,
  medium: 20,
  large: 24,
};

const Icon = ({ size, name, fill, testID, ...rest }) => {
  const IconComponent = icons[name];
  const theme = useContext(ThemeContext);
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
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  name: PropTypes.oneOf(Object.keys(icons)).isRequired,
  fill: PropTypes.oneOf(getColorKeys()),
  testID: PropTypes.string,
};

export default Icon;
