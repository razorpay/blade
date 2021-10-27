import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

export default function CheckedCircle(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24ZM19.0607 9.06066C19.6465 8.47487 19.6465 7.52513 19.0607 6.93934C18.4749 6.35355 17.5251 6.35355 16.9394 6.93934L9.93166 13.947L6.98778 11.3711C6.36432 10.8256 5.41668 10.8888 4.87116 11.5122C4.32563 12.1357 4.38881 13.0833 5.01226 13.6289L9.01226 17.1289C9.60657 17.6489 10.5023 17.6191 11.0607 17.0607L19.0607 9.06066Z"
      />
    </Icon>
  );
}

CheckedCircle.propTypes = IconPropTypes;

CheckedCircle.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};
