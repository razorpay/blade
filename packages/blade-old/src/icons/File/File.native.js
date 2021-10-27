import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function File(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path d="M8 12a1 1 0 100 2h8a1 1 0 100-2H8zM7 17a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zM8 8a1 1 0 000 2h2a1 1 0 100-2H8z" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3 4a3 3 0 013-3h8a1 1 0 01.707.293l6 6A1 1 0 0121 8v12a3 3 0 01-3 3H6a3 3 0 01-3-3V4zm3-1a1 1 0 00-1 1v16a1 1 0 001 1h12a1 1 0 001-1V9h-5a1 1 0 01-1-1V3H6zm9 1.414L17.586 7H15V4.414z"
      />
    </Icon>
  );
}

File.propTypes = IconPropTypes;
File.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default File;
