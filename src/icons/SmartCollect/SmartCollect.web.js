import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function SmartCollect({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 22 21" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.407.195a1 1 0 011.186 0l9.5 7A1 1 0 0120.5 9h-19a1 1 0 01-.593-1.805l9.5-7zM17.457 7L11 2.242 4.543 7h12.914z"
        fill={fill}
      />
      <path
        d="M1 20a1 1 0 011-1h18a1 1 0 110 2H2a1 1 0 01-1-1zM7 11.5a1 1 0 10-2 0v5a1 1 0 102 0v-5zM16.026 10.5a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zM12.014 11.5a1 1 0 10-2 0v5a1 1 0 002 0v-5z"
        fill={fill}
      />
    </svg>
  );
}

SmartCollect.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

SmartCollect.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default SmartCollect;
