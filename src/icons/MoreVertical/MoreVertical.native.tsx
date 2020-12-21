import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function MoreVertical({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 12a3 3 0 116 0 3 3 0 01-6 0zM9 4a3 3 0 116 0 3 3 0 01-6 0zM9 20a3 3 0 116 0 3 3 0 01-6 0z"
        fill={fill}
      />
    </Svg>
  );
}

MoreVertical.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

MoreVertical.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default MoreVertical;
