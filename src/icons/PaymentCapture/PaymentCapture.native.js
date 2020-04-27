import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function PaymentCapture({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <Path
        d="M3 0a3 3 0 00-3 3v3a1 1 0 002 0V3a1 1 0 011-1h3a1 1 0 000-2H3zM14 0a1 1 0 100 2h3a1 1 0 011 1v3a1 1 0 102 0V3a3 3 0 00-3-3h-3zM2 14a1 1 0 10-2 0v3a3 3 0 003 3h3a1 1 0 100-2H3a1 1 0 01-1-1v-3zM20 14a1 1 0 10-2 0v3a1 1 0 01-1 1h-3a1 1 0 100 2h3a3 3 0 003-3v-3zM5.5 5a1 1 0 011-1h7a1 1 0 110 2h-.44c.165.31.288.646.361 1h.079a1 1 0 110 2h-.079a3.772 3.772 0 01-3.692 3h-.487l3.998 3.332a1 1 0 11-1.28 1.536l-6-5a1.001 1.001 0 01-.116-.113A1 1 0 016.5 10h3.23a1.77 1.77 0 001.594-1H7.5a1 1 0 010-2h3.824a1.77 1.77 0 00-1.595-1H6.5a1 1 0 01-1-1z"
        fill={fill}
      />
    </Svg>
  );
}

PaymentCapture.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

PaymentCapture.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default PaymentCapture;
