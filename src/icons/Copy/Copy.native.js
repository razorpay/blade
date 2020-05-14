import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Copy({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 4a1 1 0 011-1h9a1 1 0 011 1v1a1 1 0 102 0V4a3 3 0 00-3-3H4a3 3 0 00-3 3v9a3 3 0 003 3h1a1 1 0 100-2H4a1 1 0 01-1-1V4z"
        fill={fill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11 8a3 3 0 00-3 3v9a3 3 0 003 3h9a3 3 0 003-3v-9a3 3 0 00-3-3h-9zm-1 3a1 1 0 011-1h9a1 1 0 011 1v9a1 1 0 01-1 1h-9a1 1 0 01-1-1v-9z"
        fill={fill}
      />
    </Svg>
  );
}

Copy.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Copy.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Copy;
