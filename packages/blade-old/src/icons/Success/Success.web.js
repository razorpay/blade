import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Success({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <g clipPath="url(#prefix__clip0)" fill={fill}>
        <path d="M4.158 7.147a9 9 0 0110.505-2.374 1 1 0 10.814-1.826A11 11 0 1022 13v-.93a1 1 0 10-2 0V13A9 9 0 114.158 7.146z" />
        <path d="M22.707 4.707a1 1 0 00-1.414-1.414L11 13.586l-2.293-2.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l11-11z" />
      </g>
      <defs>
        <clipPath id="prefix__clip0">
          <path fill={fill} d="M0 0h24v24H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

Success.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Success.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Success;
