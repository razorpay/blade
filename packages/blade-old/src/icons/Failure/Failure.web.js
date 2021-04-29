import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Failure({ width, height, fill }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 9C12.5523 9 13 9.44771 13 10V14C13 14.5523 12.5523 15 12 15C11.4477 15 11 14.5523 11 14V10C11 9.44771 11.4477 9 12 9Z"
        fill={fill}
      />
      <path
        d="M12 19C12.5523 19 13 18.5523 13 18C13 17.4477 12.5523 17 12 17C11.4477 17 11 17.4477 11 18C11 18.5523 11.4477 19 12 19Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.43502 4.34136C9.97887 3.44479 10.9514 2.89725 12 2.89725C13.0486 2.89725 14.0212 3.44479 14.565 4.34136L14.5679 4.34611L23.0379 18.4861L23.046 18.4999C23.5791 19.423 23.5822 20.5597 23.0544 21.4857C22.5265 22.4118 21.5469 22.9882 20.481 22.9999L20.47 23.0001L3.51903 23C2.45315 22.9883 1.47353 22.4118 0.94567 21.4857C0.41781 20.5597 0.420993 19.423 0.95403 18.4999L0.962153 18.4861L9.43502 4.34136ZM11.1462 5.37663L2.6827 19.5058C2.50833 19.8125 2.50837 20.1886 2.68322 20.4953C2.85842 20.8027 3.1829 20.9945 3.53642 21H20.4636C20.8171 20.9945 21.1416 20.8027 21.3168 20.4953C21.4917 20.1886 21.4917 19.8125 21.3174 19.5059L12.855 5.37862L12.8538 5.37663C12.6723 5.07895 12.3488 4.89725 12 4.89725C11.6513 4.89725 11.3277 5.07895 11.1462 5.37663Z"
        fill={fill}
      />
    </svg>
  );
}

Failure.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Failure.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Failure;
