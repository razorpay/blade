import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Gallery({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 8.5a2.5 2.5 0 115 0 2.5 2.5 0 01-5 0zM8.5 8a.5.5 0 100 1 .5.5 0 000-1z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M2 5a3 3 0 013-3h14a3 3 0 013 3v14a3 3 0 01-3 3H5a3 3 0 01-3-3V5zm3-1a1 1 0 00-1 1v14a1 1 0 00.65.937L15.292 9.293a1 1 0 011.414 0L20 12.586V5a1 1 0 00-1-1H5zm15 11.414l-4-4L7.414 20H19a1 1 0 001-1v-3.586z"
        fill={fill}
      />
    </svg>
  );
}

Gallery.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Gallery.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Gallery;
