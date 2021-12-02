import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, Circle } from 'react-native-svg';

export default function CheckedCircle({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Circle cx="12" cy="12" r="12" fill={fill} />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 12L10 16L18 8"
        stroke="white"
        strokeWidth="2.4"
      />
    </Svg>
  );
}

CheckedCircle.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

CheckedCircle.defaultProps = {
  width: 24,
  height: 24,
};
