import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Card(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 6a3 3 0 013-3h18a3 3 0 013 3v12a3 3 0 01-3 3H3a3 3 0 01-3-3V6zm2 0a1 1 0 011-1h18a1 1 0 011 1v3H2V6zm20 5v7a1 1 0 01-1 1H3a1 1 0 01-1-1v-7h20z"
      />
    </Icon>
  );
}

Card.propTypes = IconPropTypes;

Card.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default Card;
