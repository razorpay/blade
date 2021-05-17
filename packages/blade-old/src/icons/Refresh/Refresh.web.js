import * as React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

export default function Refresh({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M10.229 4.2a8 8 0 017.446 2.169L20.525 9H17a1 1 0 100 2h6a1 1 0 001-1V4a1 1 0 10-2 0v3.64l-2.944-2.718A10 10 0 002.567 8.666a1 1 0 001.886.668A8 8 0 0110.229 4.2zM2 16.36V20a1 1 0 11-2 0v-6a1 1 0 011-1h6a1 1 0 110 2H3.474l2.85 2.631a8 8 0 0013.223-2.965 1 1 0 011.886.668 10 10 0 01-16.489 3.744L2 16.361z"
        fill={fill}
      />
    </svg>
  );
}

Refresh.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Refresh.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};
