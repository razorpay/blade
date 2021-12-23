import React from 'react';
import { Path, Circle } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

export default function CheckedCircle(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Circle cx="12" cy="12" r="12" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 12L10 16L18 8"
        stroke="white"
        strokeWidth="2.4"
      />
    </Icon>
  );
}

CheckedCircle.propTypes = IconPropTypes;

CheckedCircle.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};
