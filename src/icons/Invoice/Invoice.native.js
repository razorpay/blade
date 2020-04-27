import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Invoice({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 24" fill="none">
      <Path
        d="M5 11a1 1 0 011-1h3a1 1 0 110 2H6a1 1 0 01-1-1zM5 14a1 1 0 011-1h2.4a1 1 0 110 2H6a1 1 0 01-1-1zM14 10a1 1 0 110 2h-1a1 1 0 110-2h1zM14 13a1 1 0 110 2h-1a1 1 0 110-2h1zM14 16a1 1 0 110 2h-1a1 1 0 110-2h1z"
        fill={fill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.523 3A3.4 3.4 0 019.9 0h.2a3.4 3.4 0 013.377 3H17a3 3 0 013 3v15a3 3 0 01-3 3H3a3 3 0 01-3-3V6a3 3 0 013-3h3.523zM9.9 2a1.4 1.4 0 00-1.4 1.4A1.6 1.6 0 016.9 5H3a1 1 0 00-1 1v15a1 1 0 001 1h14a1 1 0 001-1V6a1 1 0 00-1-1h-3.9a1.6 1.6 0 01-1.6-1.6A1.4 1.4 0 0010.1 2h-.2z"
        fill={fill}
      />
    </Svg>
  );
}

Invoice.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Invoice.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Invoice;
