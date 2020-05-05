import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function EllipsisVertical({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 12a3 3 0 116 0 3 3 0 01-6 0zm3-1a1 1 0 100 2 1 1 0 000-2zM9 4a3 3 0 116 0 3 3 0 01-6 0zm3-1a1 1 0 100 2 1 1 0 000-2zM9 20a3 3 0 116 0 3 3 0 01-6 0zm3-1a1 1 0 100 2 1 1 0 000-2z"
        fill={fill}
      />
    </svg>
  );
}

EllipsisVertical.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

EllipsisVertical.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default EllipsisVertical;
