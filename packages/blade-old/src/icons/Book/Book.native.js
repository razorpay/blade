import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Book(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21 2a1 1 0 00-1-1H6.5A3.5 3.5 0 003 4.5v15A3.5 3.5 0 006.5 23H20a1 1 0 001-1V2zM5 4.5A1.5 1.5 0 016.5 3H19v13H6.5c-.537 0-1.045.12-1.5.337V4.5zm0 15A1.5 1.5 0 006.5 21H19v-3H6.5A1.5 1.5 0 005 19.5z"
      />
    </Icon>
  );
}

Book.propTypes = IconPropTypes;

Book.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default Book;
