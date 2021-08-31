import * as React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

export default function Download({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M13 2a1 1 0 10-2 0v11.586l-2.293-2.293a1 1 0 00-1.414 1.414l4 4 .007.007a.996.996 0 00.697.286h.006c.272 0 .518-.11.697-.286l.008-.008 4-3.999a1 1 0 00-1.415-1.414L13 13.586V2z"
        fill={fill}
      />
      <path
        d="M3 16a1 1 0 011 1v3a1 1 0 001 1h14a1 1 0 001-1v-3a1 1 0 112 0v3a3 3 0 01-3 3H5a3 3 0 01-3-3v-3a1 1 0 011-1z"
        fill={fill}
      />
    </svg>
  );
}

Download.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Download.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};
