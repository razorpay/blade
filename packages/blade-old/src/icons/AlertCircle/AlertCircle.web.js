import React from 'react';
import Icon from '../../atoms/Icon';
import { IconPropTypes } from '../../atoms/Icon/Icon.web';

function AlertCircle(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm.05-19a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 11-3 0v-5a1.5 1.5 0 011.5-1.5zm1.45 11.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
      />
    </Icon>
  );
}

AlertCircle.propTypes = IconPropTypes;

AlertCircle.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default AlertCircle;
