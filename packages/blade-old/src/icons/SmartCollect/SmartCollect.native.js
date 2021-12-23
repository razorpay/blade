import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function SmartCollect(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.407 1.195a1 1 0 011.186 0l9.5 7A1 1 0 0121.5 10h-19a1 1 0 01-.593-1.805l9.5-7zM18.457 8L12 3.242 5.543 8h12.914z"
      />
      <Path d="M2 21a1 1 0 011-1h18a1 1 0 110 2H3a1 1 0 01-1-1zM8 12.5a1 1 0 10-2 0v5a1 1 0 102 0v-5zM17.026 11.5a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zM13.014 12.5a1 1 0 10-2 0v5a1 1 0 002 0v-5z" />
    </Icon>
  );
}

SmartCollect.propTypes = IconPropTypes;

SmartCollect.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default SmartCollect;
