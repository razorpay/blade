import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Feather(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.043 4.043a7.003 7.003 0 019.905 9.903v.001l-6.74 6.759A1 1 0 0113.5 21H5.414l-2.707 2.707a1 1 0 01-1.414-1.414L4 19.586V11.5a1 1 0 01.293-.707l6.75-6.75zM13.085 19h-5.67l2-2h5.664l-1.994 2zm3.986-3.998l2.46-2.468.002-.001a5.003 5.003 0 00-7.076-7.076L6 11.914v5.672l9.293-9.293a1 1 0 111.414 1.414L11.414 15H17c.024 0 .047 0 .07.002z"
      />
    </Icon>
  );
}

Feather.propTypes = IconPropTypes;
Feather.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default Feather;
