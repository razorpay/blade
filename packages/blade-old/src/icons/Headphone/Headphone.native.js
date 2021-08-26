import React from 'react';
import PropTypes from 'prop-types';
import Svg, { Path, Mask, G, Defs, ClipPath } from 'react-native-svg';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Gallery({ width, height, fill }) {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <G clipPath="url(#clip0)">
        <Mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={16} height={16}>
          <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2.667 8a5.333 5.333 0 0110.666 0v.666H12a2 2 0 00-2 2v2a2 2 0 002 2h.667a2 2 0 002-2V8A6.667 6.667 0 001.333 8v4.666a2 2 0 002 2H4a2 2 0 002-2v-2a2 2 0 00-2-2H2.667V8zm0 2v2.666c0 .368.298.667.666.667H4a.667.667 0 00.667-.667v-2A.667.667 0 004 10H2.667zm10.666 0H12a.667.667 0 00-.667.666v2c0 .368.299.667.667.667h.667a.667.667 0 00.666-.667V10z"
            fill="#fff"
          />
        </Mask>
        <G mask="url(#a)">
          <Path fill={fill} d="M0 0H16V16H0z" />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0">
          <Path fill="#fff" d="M0 0H16V16H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
}

Gallery.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Gallery.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Gallery;
