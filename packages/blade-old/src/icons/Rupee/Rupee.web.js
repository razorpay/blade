import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Rupee(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.471 4.682a.464.464 0 00-.41.683c.245.46.428.957.537 1.481.044.216.234.37.454.37h.127a1.14 1.14 0 010 2.282h-.127c-.22 0-.41.155-.454.37a5.591 5.591 0 01-5.473 4.446h-.782a.464.464 0 00-.297.822l6.418 5.349a1.14 1.14 0 11-1.46 1.753L5.37 14.21a1.157 1.157 0 01-.133-.13.469.469 0 00-.045-.046 1.141 1.141 0 01.749-2.002h5.183a3.307 3.307 0 002.978-1.868.464.464 0 00-.418-.667H7.546a1.141 1.141 0 010-2.282h6.14a.464.464 0 00.417-.667 3.307 3.307 0 00-2.978-1.867H5.941a1.141 1.141 0 110-2.282h11.238a1.14 1.14 0 010 2.282h-.708z"
      />
    </Icon>
  );
}

Rupee.propTypes = IconPropTypes;

Rupee.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default Rupee;
