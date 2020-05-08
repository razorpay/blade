import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

export default function CheckboxFilled({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 8a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8zm8.642 2.904a.562.562 0 10-.784-.808l-2.702 2.62-1.014-.983a.563.563 0 00-.784.807l1.407 1.364a.562.562 0 00.783 0l3.094-3z"
        fill={fill}
      />
    </Svg>
  );
}

CheckboxFilled.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string, // TODO: replace this type with range of available DS based colors
};

CheckboxFilled.defaultProps = {
  width: 24,
  height: 24,
};
