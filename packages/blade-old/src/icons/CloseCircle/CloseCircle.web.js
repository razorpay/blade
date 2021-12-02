import React from 'react';
import PropType from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function CloseCircle({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="12" fill={fill} />
      <path
        d="M16.4716 8.47206C16.7319 8.21171 16.7319 7.7896 16.4716 7.52925C16.2112 7.2689 15.7891 7.2689 15.5288 7.52925L12.0002 11.0578L8.47157 7.52925C8.21122 7.2689 7.78911 7.2689 7.52876 7.52925C7.26841 7.7896 7.26841 8.21171 7.52876 8.47206L11.0574 12.0007L7.52876 15.5292C7.26841 15.7896 7.26841 16.2117 7.52876 16.4721C7.78911 16.7324 8.21122 16.7324 8.47157 16.4721L12.0002 12.9435L15.5288 16.4721C15.7891 16.7324 16.2112 16.7324 16.4716 16.4721C16.7319 16.2117 16.7319 15.7896 16.4716 15.5292L12.943 12.0007L16.4716 8.47206Z"
        fill="white"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

CloseCircle.propTypes = {
  width: PropType.number,
  height: PropType.number,
  fill: PropType.oneOf(getThemeColors()),
};

CloseCircle.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default CloseCircle;
