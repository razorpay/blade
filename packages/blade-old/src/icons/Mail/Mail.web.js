import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Mail({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 6.018V18c0 1.652-1.348 3-3 3H4c-1.652 0-3-1.348-3-3V6c0-1.652 1.348-3 3-3h16a3.006 3.006 0 013 3.018zM3.107 5.554C3.272 5.227 3.612 5 4 5h16c.388 0 .728.227.893.554L12 11.779 3.107 5.554zM3 7.92V18c0 .548.452 1 1 1h16c.548 0 1-.452 1-1V7.92l-8.427 5.9a1 1 0 01-1.146 0L3 7.92z"
        fill={fill}
      />
    </svg>
  );
}

Mail.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Mail.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Mail;
