import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

export default function Lock({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 10V7a6 6 0 1112 0v3h1a3 3 0 013 3v7a3 3 0 01-3 3H5a3 3 0 01-3-3v-7a3 3 0 013-3h1zm2-3a4 4 0 118 0v3H8V7zm-3 5a1 1 0 00-1 1v7a1 1 0 001 1h14a1 1 0 001-1v-7a1 1 0 00-1-1H5z"
        fill={fill}
      />
    </Svg>
  );
}

Lock.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

Lock.defaultProps = {
  width: 24,
  height: 24,
};
