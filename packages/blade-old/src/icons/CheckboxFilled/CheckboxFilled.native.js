import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

export default function CheckboxFilled(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm8.642 2.904a.562.562 0 10-.784-.808l-2.702 2.62-1.014-.983a.563.563 0 00-.784.807l1.407 1.364a.562.562 0 00.783 0l3.094-3z"
      />
    </Icon>
  );
}

CheckboxFilled.propTypes = IconPropTypes;

CheckboxFilled.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};
