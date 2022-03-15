import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Navigation(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.707 2.293a1 1 0 01.197 1.135l-9 19a1 1 0 01-1.874-.186l-1.855-7.417-7.418-1.855a1 1 0 01-.185-1.874l19-9a1 1 0 011.135.197zM4.953 11.708l5.29 1.322a1 1 0 01.727.728l1.322 5.289 6.606-13.945-13.945 6.606z"
      />
    </Icon>
  );
}

Navigation.propTypes = IconPropTypes;

Navigation.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default Navigation;
