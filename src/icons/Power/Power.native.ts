import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Power({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2a1 1 0 10-2 0v10a1 1 0 102 0V2z" fill={fill} />
      <Path
        d="M6.337 7.347a1 1 0 00-1.414-1.414c-3.905 3.906-3.904 10.237.001 14.141 3.905 3.905 10.236 3.905 14.142 0 3.905-3.904 3.905-10.235.001-14.141a1 1 0 10-1.414 1.414 8 8 0 11-11.316 0z"
        fill={fill}
      />
    </Svg>
  );
}

Power.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Power.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Power;
