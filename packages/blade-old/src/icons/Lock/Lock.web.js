import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

export default function Lock(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 10V7a6 6 0 1112 0v3h1a3 3 0 013 3v7a3 3 0 01-3 3H5a3 3 0 01-3-3v-7a3 3 0 013-3h1zm2-3a4 4 0 118 0v3H8V7zm-3 5a1 1 0 00-1 1v7a1 1 0 001 1h14a1 1 0 001-1v-7a1 1 0 00-1-1H5z"
      />
    </Icon>
  );
}

Lock.propTypes = IconPropTypes;

Lock.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};
