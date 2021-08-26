import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Book({ width, height, fill }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0)">
        <mask id="a" maskUnits="userSpaceOnUse" x={0} y={0} width={16} height={16}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14 1.334a.667.667 0 00-.667-.667h-9A2.333 2.333 0 002 3v10a2.333 2.333 0 002.333 2.334h9a.667.667 0 00.667-.667V1.334zM3.333 3a1 1 0 011-1h8.334v8.667H4.333c-.358 0-.697.08-1 .225V3zm0 10a1 1 0 001 1h8.334v-2H4.333a1 1 0 00-1 1z"
            fill={'#fff'}
          />
        </mask>
        <g mask="url(#a)">
          <path fill={fill} d="M0 0H16V16H0z" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0">
          <path fill="#fff" d="M0 0H16V16H0z" />
        </clipPath>
      </defs>
    </svg>
  );
}

Book.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Book.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Book;
