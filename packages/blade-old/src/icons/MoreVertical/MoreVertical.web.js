import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function MoreVertical(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 12a3 3 0 116 0 3 3 0 01-6 0zM9 4a3 3 0 116 0 3 3 0 01-6 0zM9 20a3 3 0 116 0 3 3 0 01-6 0z"
      />
    </Icon>
  );
}

MoreVertical.propTypes = IconPropTypes;

MoreVertical.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default MoreVertical;
