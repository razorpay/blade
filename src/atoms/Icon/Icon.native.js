import React from 'react';
import PropTypes from 'prop-types';
import icons from '../../icons';

const iconSize = {
  xsmall: 12,
  small: 16,
  medium: 40,
  large: 24,
};

const Icon = ({ size, name, fill, testID, ...rest }) => {
  const IconComponent = icons[name];
  return (
    <IconComponent
      fill={fill}
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
};

Icon.propTypes = {
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  name: PropTypes.oneOf(Object.keys(icons)).isRequired,
  fill: PropTypes.string,
  testID: PropTypes.string,
};

export default Icon;
