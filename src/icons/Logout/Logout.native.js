import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

export default function Logout({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 3a1 1 0 00-1 1v16a1 1 0 001 1h5a1 1 0 110 2H5a3 3 0 01-3-3V4a3 3 0 013-3h5a1 1 0 110 2H5z"
        fill={fill}
      />
      <Path
        d="M16.293 7.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L18.586 13H9a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z"
        fill={fill}
      />
    </Svg>
  );
}

Logout.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

Logout.defaultProps = {
  width: 24,
  height: 24,
};
