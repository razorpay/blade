import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

export default function CheckboxOutlined({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16 7H8a1 1 0 00-1 1v8a1 1 0 001 1h8a1 1 0 001-1V8a1 1 0 00-1-1zM8 6a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2H8z"
        fill={fill}
        fillOpacity={0.38}
      />
    </Svg>
  );
}

CheckboxOutlined.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string, // TODO: replace this type with range of available DS based colors
};

CheckboxOutlined.defaultProps = {
  width: 24,
  height: 24,
};
