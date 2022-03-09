import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function ProductsFilled(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V3a1 1 0 00-1-1H3zm1 7V4h5v5H4zM14 2a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1V3a1 1 0 00-1-1h-7zm1 7V4h5v5h-5zM13 14a1 1 0 011-1h7a1 1 0 011 1v7a1 1 0 01-1 1h-7a1 1 0 01-1-1v-7zm2 1v5h5v-5h-5zM3 13a1 1 0 00-1 1v7a1 1 0 001 1h7a1 1 0 001-1v-7a1 1 0 00-1-1H3zm1 7v-5h5v5H4z"
      />
      <Path d="M3 3H10V10H3z" />
      <Path d="M14 3H21V10H14z" />
      <Path d="M14 14H21V21H14z" />
      <Path d="M3 14H10V21H3z" />
    </Icon>
  );
}

ProductsFilled.propTypes = IconPropTypes;

ProductsFilled.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default ProductsFilled;
