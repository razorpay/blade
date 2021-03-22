import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function ExternalLink({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M14 3a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 11-2 0V5.414l-9.293 9.293a1 1 0 01-1.414-1.414L18.586 4H15a1 1 0 01-1-1z"
        fill={fill}
      />
      <Path
        d="M5 7a1 1 0 00-1 1v11a1 1 0 001 1h11a1 1 0 001-1v-6a1 1 0 112 0v6a3 3 0 01-3 3H5a3 3 0 01-3-3V8a3 3 0 013-3h6a1 1 0 110 2H5z"
        fill={fill}
      />
    </Svg>
  );
}

ExternalLink.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

ExternalLink.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default ExternalLink;
