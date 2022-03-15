import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Package(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.493 2.638L2.56 4.603C1.972 4.888 1 5.76 1 7.24v9.517a3 3 0 001.65 2.696l.003.001 8 4a3 3 0 002.684 0l7.998-3.998.001-.001A3 3 0 0023 16.77V7.24a3 3 0 00-1.664-2.685h-.001l-7.998-4h-.002a3 3 0 00-2.67 0L6.614 2.577a1.004 1.004 0 00-.12.06zm2.747.864l2.315-1.156c.28-.14.61-.14.89 0l7.314 3.657L17 7.382l-7.76-3.88zM7.002 4.619L14.764 8.5 12 9.882 4.237 6l2.765-1.38zM3 7.618v9.149a1 1 0 00.55.9L11 21.392v-9.774l-8-4zm10 13.769l7.443-3.721.002-.002A1 1 0 0021 16.77V7.62l-8 3.999v9.769z"
      />
    </Icon>
  );
}

Package.propTypes = IconPropTypes;

Package.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default Package;
