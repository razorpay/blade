import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Headphone(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4 12a8 8 0 1116 0v1h-2a3 3 0 00-3 3v3a3 3 0 003 3h1a3 3 0 003-3v-7c0-5.523-4.477-10-10-10S2 6.477 2 12v7a3 3 0 003 3h1a3 3 0 003-3v-3a3 3 0 00-3-3H4v-1zm0 3v4a1 1 0 001 1h1a1 1 0 001-1v-3a1 1 0 00-1-1H4zm16 0h-2a1 1 0 00-1 1v3a1 1 0 001 1h1a1 1 0 001-1v-4z"
      />
    </Icon>
  );
}

Headphone.propTypes = IconPropTypes;

Headphone.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default Headphone;
