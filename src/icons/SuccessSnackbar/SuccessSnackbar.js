import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Test({ width, height, fill }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.46542 4.95585C5.62348 2.43093 9.18525 1.62619 12.2192 2.97805C12.6396 3.16537 13.1323 2.97642 13.3196 2.55603C13.5069 2.13563 13.3179 1.64299 12.8976 1.45567C9.18937 -0.196599 4.8361 0.786966 2.19847 3.87299C-0.439156 6.959 -0.732808 11.4123 1.47676 14.818C3.68633 18.2236 7.87276 19.7703 11.7658 18.6192C15.6588 17.4682 18.3311 13.8932 18.3334 9.83353V9.05853C18.3334 8.59829 17.9603 8.22519 17.5001 8.22519C17.0398 8.22519 16.6667 8.59829 16.6667 9.05853V9.83305C16.6648 13.1546 14.4784 16.0792 11.2932 17.021C8.10803 17.9627 4.68276 16.6973 2.87493 13.9108C1.06711 11.1244 1.30737 7.48078 3.46542 4.95585Z"
        fill={fill}
      />
      <path
        d="M18.9226 2.92278C19.2481 2.59735 19.2481 2.06971 18.9226 1.74427C18.5972 1.41883 18.0696 1.41883 17.7441 1.74427L9.16672 10.3217L7.25597 8.41094C6.93054 8.0855 6.4029 8.0855 6.07746 8.41094C5.75203 8.73637 5.75203 9.26401 6.07746 9.58945L8.57746 12.0894C8.9029 12.4149 9.43054 12.4149 9.75597 12.0894L18.9226 2.92278Z"
        fill={fill}
      />
    </svg>
  );
}

Test.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Test.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Test;
