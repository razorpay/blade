import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';

export default function Plus({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path 
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.8335 1.16671C7.8335 0.70647 7.4604 0.333374 7.00016 0.333374C6.53993 0.333374 6.16683 0.70647 6.16683 1.16671V6.16671H1.16683C0.706592 6.16671 0.333496 6.5398 0.333496 7.00004C0.333496 7.46028 0.706592 7.83337 1.16683 7.83337H6.16683V12.8334C6.16683 13.2936 6.53993 13.6667 7.00016 13.6667C7.4604 13.6667 7.8335 13.2936 7.8335 12.8334V7.83337H12.8335C13.2937 7.83337 13.6668 7.46028 13.6668 7.00004C13.6668 6.5398 13.2937 6.16671 12.8335 6.16671H7.8335V1.16671Z" 
        fill={fill}
      />
    </Svg>
  );
}

Plus.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

Plus.defaultProps = {
  width: 24,
  height: 24,
};
