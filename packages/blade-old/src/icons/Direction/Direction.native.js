import * as React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

export default function Direction({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 23.679688 0.320312 C 23.976562 0.617188 24.078125 1.054688 23.9375 1.449219 L 16.300781 23.269531 C 16.15625 23.691406 15.765625 23.980469 15.316406 24 C 14.871094 24.015625 14.457031 23.761719 14.277344 23.351562 L 10.082031 13.917969 L 0.648438 9.722656 C 0.238281 9.542969 -0.015625 9.128906 0 8.683594 C 0.0195312 8.234375 0.308594 7.84375 0.730469 7.699219 L 22.523438 0.0703125 C 22.914062 -0.078125 23.367188 0.0078125 23.679688 0.320312 Z M 18.757812 3.699219 L 4.046875 8.847656 L 10.667969 11.789062 Z M 18.757812 3.699219"
        fill={fill}
      />
    </Svg>
  );
}

Direction.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Direction.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};
