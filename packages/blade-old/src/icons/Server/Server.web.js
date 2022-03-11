import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Server(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 4a3 3 0 00-3-3H4a3 3 0 00-3 3v4a3 3 0 003 3h16a3 3 0 003-3V4zm-3-1a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1h16zM23 16a3 3 0 00-3-3H4a3 3 0 00-3 3v4a3 3 0 003 3h16a3 3 0 003-3v-4zm-3-1a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4a1 1 0 011-1h16z"
      />
      <path d="M17 6a1 1 0 102 0 1 1 0 00-2 0zM17 18a1 1 0 102 0 1 1 0 00-2 0z" />
    </Icon>
  );
}

Server.propTypes = IconPropTypes;

Server.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default Server;
