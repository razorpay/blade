import React from 'react';
import PropTypes from 'prop-types';
import icons from '../../icons';

const iconSize = {
  s: 10,
  m: 16,
  l: 20,
};

const Icon = ({ size, name, fill }) => {
  const IconComponent = icons[name];
  return <IconComponent fill={fill} height={iconSize[size]} width={iconSize[size]} />;
};

Icon.propTypes = {
  size: PropTypes.oneOf(['s', 'm', 'l']),
  name: PropTypes.oneOf(Object.keys(icons)),
  fill: PropTypes.string,
};

export default Icon;
