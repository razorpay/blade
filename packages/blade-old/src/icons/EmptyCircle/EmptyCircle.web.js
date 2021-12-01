import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

export default function EmptyCircle(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 3c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"
      />
    </Icon>
  );
}

EmptyCircle.propTypes = IconPropTypes;

EmptyCircle.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};
