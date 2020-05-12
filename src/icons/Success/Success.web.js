import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Success({ width, height, fill }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.465 4.956a7.5 7.5 0 018.754-1.978.833.833 0 00.679-1.522 9.167 9.167 0 105.435 8.378v-.775a.833.833 0 10-1.666 0v.774A7.5 7.5 0 113.465 4.956z"
        fill={fill}
      />
      <path
        d="M18.923 2.923a.833.833 0 10-1.179-1.179l-8.577 8.578L7.256 8.41a.833.833 0 10-1.179 1.178l2.5 2.5a.833.833 0 001.179 0l9.167-9.166z"
        fill={fill}
      />
    </svg>
  );
}

Success.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Success.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Success;
