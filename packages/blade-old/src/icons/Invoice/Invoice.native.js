import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Invoice(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path d="M7 11a1 1 0 011-1h3a1 1 0 110 2H8a1 1 0 01-1-1zM7 14a1 1 0 011-1h2.4a1 1 0 110 2H8a1 1 0 01-1-1zM16 10a1 1 0 110 2h-1a1 1 0 110-2h1zM16 13a1 1 0 110 2h-1a1 1 0 110-2h1zM16 16a1 1 0 110 2h-1a1 1 0 110-2h1z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.523 3A3.4 3.4 0 0111.9 0h.2a3.4 3.4 0 013.377 3H19a3 3 0 013 3v15a3 3 0 01-3 3H5a3 3 0 01-3-3V6a3 3 0 013-3h3.523zM11.9 2a1.4 1.4 0 00-1.4 1.4A1.6 1.6 0 018.9 5H5a1 1 0 00-1 1v15a1 1 0 001 1h14a1 1 0 001-1V6a1 1 0 00-1-1h-3.9a1.6 1.6 0 01-1.6-1.6A1.4 1.4 0 0012.1 2h-.2z"
      />
    </Icon>
  );
}

Invoice.propTypes = IconPropTypes;

Invoice.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default Invoice;
