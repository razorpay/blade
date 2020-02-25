import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

export default function CheckboxFilled({ width, height, fill }) {
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
        d="M4.80005 7.20005C4.80005 5.87457 5.87457 4.80005 7.20005 4.80005H16.8C18.1255 4.80005 19.2 5.87457 19.2 7.20005V16.8C19.2 18.1255 18.1255 19.2 16.8 19.2H7.20005C5.87457 19.2 4.80005 18.1255 4.80005 16.8V7.20005ZM15.1699 10.6846C15.4376 10.4251 15.4442 9.99778 15.1846 9.73015C14.9251 9.46252 14.4978 9.45595 14.2302 9.71547L10.9875 12.8598L9.76995 11.6791C9.50232 11.4196 9.07498 11.4262 8.81547 11.6938C8.55595 11.9614 8.56252 12.3888 8.83015 12.6483L10.5177 14.2846C10.7795 14.5385 11.1956 14.5385 11.4574 14.2846L15.1699 10.6846Z"
        fill={fill}
        fillOpacity="0.87"
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
