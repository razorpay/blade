import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

export default function CheckboxOutlined(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 7H8a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1zM8 6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2H8z"
        fillOpacity={0.38}
      />
    </Icon>
  );
}

CheckboxOutlined.propTypes = IconPropTypes;

CheckboxOutlined.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};
