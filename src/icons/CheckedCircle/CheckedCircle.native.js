import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

export default function CheckedCircle({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm7.06-14.94a1.5 1.5 0 10-2.12-2.12l-7.008 7.007-2.944-2.576a1.5 1.5 0 00-1.976 2.258l4 3.5a1.5 1.5 0 002.049-.068l8-8z"
        fill={fill}
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
