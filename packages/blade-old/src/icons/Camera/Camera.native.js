import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Camera({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 8a5 5 0 100 10 5 5 0 000-10zm-3 5a3 3 0 116 0 3 3 0 01-6 0z"
        fill={fill}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9 2a1 1 0 00-.832.445L6.465 5H3a3 3 0 00-3 3v11a3 3 0 003 3h18a3 3 0 003-3V8a3 3 0 00-3-3h-3.465l-1.703-2.555A1 1 0 0015 2H9zM7.832 6.555L9.535 4h4.93l1.703 2.555A1 1 0 0017 7h4a1 1 0 011 1v11a1 1 0 01-1 1H3a1 1 0 01-1-1V8a1 1 0 011-1h4a1 1 0 00.832-.445z"
        fill={fill}
      />
    </Svg>
  );
}

Camera.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Camera.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Camera;
