import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Briefcase(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2a3 3 0 00-3 3v1H4a3 3 0 00-3 3v10a3 3 0 003 3h16a3 3 0 003-3V9a3 3 0 00-3-3h-3V5a3 3 0 00-3-3h-4zm5 4V5a1 1 0 00-1-1h-4a1 1 0 00-1 1v1h6zM9 8h6v12H9V8zM7 8H4a1 1 0 00-1 1v10a1 1 0 001 1h3V8zm10 12V8h3a1 1 0 011 1v10a1 1 0 01-1 1h-3z"
      />
    </Icon>
  );
}

Briefcase.propTypes = IconPropTypes;

Briefcase.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default Briefcase;
