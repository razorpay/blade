import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Clipboard(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1a2 2 0 00-2 2H6a3 3 0 00-3 3v14a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3h-1a2 2 0 00-2-2H9zm8 4a2 2 0 01-2 2H9a2 2 0 01-2-2H6a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1h-1zM9 4v1h6V3H9v1z"
      />
    </Icon>
  );
}

Clipboard.propTypes = IconPropTypes;

Clipboard.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default Clipboard;
