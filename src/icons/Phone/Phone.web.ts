import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Phone({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.883 1.818C1.48 1.253 2.285 1 3 1h3.11c.979 0 1.702.448 2.177.976.454.504.701 1.096.798 1.523l.01.045.006.045c.117.885.333 1.754.645 2.59a3 3 0 01-.675 3.164l-.004.004-.717.717a15 15 0 004.586 4.586l.717-.717.004-.004a3 3 0 013.164-.675c.836.312 1.705.528 2.59.645h.009A3 3 0 0122 16.932V20c0 1.1-.558 1.854-1.032 2.192a3 3 0 01-2.238.724h-.01l-.008-.002a20.789 20.789 0 01-9.062-3.223 20.5 20.5 0 01-6.302-6.301A20.79 20.79 0 01.131 4.332c-.2-1.038.123-1.917.752-2.514zM2.26 3.27c-.126.12-.243.31-.16.706l.01.049.005.05a18.79 18.79 0 002.915 8.231l.005.008a18.5 18.5 0 005.692 5.692l.008.005a18.789 18.789 0 008.184 2.914 1 1 0 00.758-.26l.07-.063.06-.038a.556.556 0 00.085-.113A.884.884 0 0020 20v-3.105a1 1 0 00-.856-1.014 13.836 13.836 0 01-3.024-.754h-.002a1 1 0 00-1.053.222l-1.268 1.268a1 1 0 01-1.201.162 17 17 0 01-6.375-6.375 1 1 0 01.162-1.201L7.65 7.935a1 1 0 00.223-1.053V6.88a13.84 13.84 0 01-.748-2.974 1.56 1.56 0 00-.325-.592A.878.878 0 006.11 3H3c-.285 0-.572.11-.741.27z"
        fill={fill}
      />
    </svg>
  );
}

Phone.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Phone.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Phone;
