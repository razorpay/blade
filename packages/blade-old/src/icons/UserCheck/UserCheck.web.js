import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function UserCheck({ size, fill }) {
  return (
    <Icon viewBox="0 0 24 24" size={size} fill={fill}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.5 7a5 5 0 1110 0 5 5 0 01-10 0zm5-3a3 3 0 100 6 3 3 0 000-6z"
      />
      <path d="M0 19a5 5 0 015-5h7a5 5 0 015 5v2a1 1 0 11-2 0v-2a3 3 0 00-3-3H5a3 3 0 00-3 3v2a1 1 0 11-2 0v-2zM23.707 9.707a1 1 0 00-1.414-1.414L19 11.586l-1.293-1.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
    </Icon>
  );
}

UserCheck.propTypes = IconPropTypes;

UserCheck.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default UserCheck;
