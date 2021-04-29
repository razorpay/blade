import React from 'react';
import PropTypes from 'prop-types';

export default function EmptyCircle({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 3c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z"
        fill={fill}
      />
    </svg>
  );
}

EmptyCircle.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.string,
};

EmptyCircle.defaultProps = {
  width: 24,
  height: 24,
};
