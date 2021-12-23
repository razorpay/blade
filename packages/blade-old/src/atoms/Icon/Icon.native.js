import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'styled-components/native';
import Svg from 'react-native-svg';
import { getColorKeys, getColor } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes.native';

const iconSize = {
  xsmall: 12,
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 28,
};

const Icon = ({ size, fill, testID, children, ...rest }) => {
  const theme = useTheme();

  return (
    <Svg
      accessibilityElementsHidden={true}
      fill={getColor(theme, fill)}
      height={iconSize[size]}
      width={iconSize[size]}
      {...automation(testID)}
      {...rest}
    >
      {children}
    </Svg>
  );
};

export const IconPropTypes = {
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']),
  fill: PropTypes.oneOf(getColorKeys()),
  testID: PropTypes.string,
  children: PropTypes.node,
};

Icon.propTypes = IconPropTypes;
Icon.defaultProps = {
  size: 'medium',
  testID: 'ds-icon',
  fill: 'shade.950',
};

export default Icon;
