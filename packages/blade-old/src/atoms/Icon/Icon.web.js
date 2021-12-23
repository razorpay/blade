import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from 'styled-components';
import automation from '../../_helpers/automation-attributes.web';
import { getColorKeys, getColor } from '../../_helpers/theme';

const iconSize = {
  xsmall: 12,
  small: 16,
  medium: 20,
  large: 24,
  xlarge: 28,
};

const Icon = ({ size, fill, children, ...rest }) => {
  const theme = useTheme();

  return (
    <svg
      focusable={false}
      aria-hidden={true}
      fill={getColor(theme, fill)}
      height={iconSize[size]}
      width={iconSize[size]}
      {...automation('ds-icon')}
      {...rest}
    >
      {children}
    </svg>
  );
};

export const IconPropTypes = {
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large', 'xlarge']),
  fill: PropTypes.oneOf(getColorKeys()),
  children: PropTypes.node,
};

Icon.propTypes = IconPropTypes;
Icon.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default Icon;
