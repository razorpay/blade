import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Clock(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M13 6a1 1 0 10-2 0v6a1 1 0 00.293.707l3 3a1 1 0 001.414-1.414L13 11.586V6z" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM3 12a9 9 0 1118 0 9 9 0 01-18 0z"
      />
    </Icon>
  );
}

Clock.propTypes = IconPropTypes;

Clock.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default Clock;
