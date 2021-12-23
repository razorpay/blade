import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Trash(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7 5V4a3 3 0 013-3h4a3 3 0 013 3v1h4a1 1 0 110 2h-1v13a3 3 0 01-3 3H7a3 3 0 01-3-3V7H3a1 1 0 010-2h4zm2-1a1 1 0 011-1h4a1 1 0 011 1v1H9V4zM6 7h12v13a1 1 0 01-1 1H7a1 1 0 01-1-1V7z"
      />
    </Icon>
  );
}

Trash.propTypes = IconPropTypes;

Trash.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default Trash;
