import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Clipboard({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 1a2 2 0 00-2 2H6a3 3 0 00-3 3v14a3 3 0 003 3h12a3 3 0 003-3V6a3 3 0 00-3-3h-1a2 2 0 00-2-2H9zm8 4a2 2 0 01-2 2H9a2 2 0 01-2-2H6a1 1 0 00-1 1v14a1 1 0 001 1h12a1 1 0 001-1V6a1 1 0 00-1-1h-1zM9 4v1h6V3H9v1z"
        fill={fill}
      />
    </svg>
  );
}

Clipboard.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Clipboard.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Clipboard;
