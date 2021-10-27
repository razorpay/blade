import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function LifeBuoy(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1 12C1 5.925 5.925 1 12 1s11 4.925 11 11-4.925 11-11 11S1 18.075 1 12zm3.968-5.618A8.962 8.962 0 003 12c0 2.125.736 4.078 1.968 5.618l2.86-2.86A4.977 4.977 0 017 12c0-1.02.305-1.967.828-2.757l-2.86-2.86zm4.275 9.79l-2.86 2.86A8.962 8.962 0 0012 21a8.962 8.962 0 005.618-1.968l-2.86-2.86A4.977 4.977 0 0112 17a4.977 4.977 0 01-2.757-.828zM21 12a8.962 8.962 0 01-1.968 5.618l-2.86-2.86c.523-.791.828-1.739.828-2.758 0-1.02-.305-1.967-.828-2.757l2.86-2.86A8.962 8.962 0 0121 12zm-3.382-7.032l-2.86 2.86A4.977 4.977 0 0012 7c-1.02 0-1.967.305-2.757.828l-2.86-2.86A8.962 8.962 0 0112 3c2.125 0 4.078.736 5.618 1.968zM12 9a3 3 0 100 6 3 3 0 000-6z"
      />
    </Icon>
  );
}

LifeBuoy.propTypes = IconPropTypes;

LifeBuoy.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default LifeBuoy;
