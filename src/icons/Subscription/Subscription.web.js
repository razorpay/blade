import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Subscription({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M14.217 2.317a8 8 0 00-9.764 5.017 1 1 0 01-1.886-.668 10 10 0 0116.489-3.744L22 5.688V4a1 1 0 112 0v4a.997.997 0 01-1 1h-4a1 1 0 110-2h1.476l-2.8-2.631a8 8 0 00-3.458-2.051zM.282 15.304A.996.996 0 011 15h4a1 1 0 110 2H3.525l2.8 2.631a8 8 0 0013.223-2.965 1 1 0 011.885.668 10 10 0 01-16.489 3.744L2 18.312V20a1 1 0 11-2 0v-4a1.012 1.012 0 01.072-.373.995.995 0 01.21-.323z"
        fill={fill}
      />
      <path
        d="M8.5 6a1 1 0 100 2h3.23a1.77 1.77 0 011.594 1H9.5a1 1 0 100 2h3.824a1.77 1.77 0 01-1.595 1H8.5a1 1 0 00-.656 1.755c.035.04.073.078.116.113l6 5a1 1 0 001.28-1.536L11.242 14h.487a3.772 3.772 0 003.692-3h.079a1 1 0 100-2h-.079a3.744 3.744 0 00-.362-1h.441a1 1 0 100-2h-7z"
        fill={fill}
      />
    </svg>
  );
}

Subscription.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Subscription.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Subscription;
