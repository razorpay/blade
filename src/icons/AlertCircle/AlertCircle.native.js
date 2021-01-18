import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function AlertCircle({ width, height, fill }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm.05-19a1.5 1.5 0 011.5 1.5v5a1.5 1.5 0 11-3 0v-5a1.5 1.5 0 011.5-1.5zm1.45 11.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
        fill={fill}
      />
    </Svg>
  );
}

AlertCircle.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

AlertCircle.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default AlertCircle;
