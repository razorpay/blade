import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

export default function CheckboxOutlined({ width, height, fill }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.8 6.00005H7.20005C6.53731 6.00005 6.00005 6.53731 6.00005 7.20005V16.8C6.00005 17.4628 6.53731 18 7.20005 18H16.8C17.4628 18 18 17.4628 18 16.8V7.20005C18 6.53731 17.4628 6.00005 16.8 6.00005ZM7.20005 4.80005C5.87457 4.80005 4.80005 5.87457 4.80005 7.20005V16.8C4.80005 18.1255 5.87457 19.2 7.20005 19.2H16.8C18.1255 19.2 19.2 18.1255 19.2 16.8V7.20005C19.2 5.87457 18.1255 4.80005 16.8 4.80005H7.20005Z"
        fill={fill}
        fillOpacity="0.38"
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
