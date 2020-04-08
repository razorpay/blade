import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function ArrowDown({ width, height, fill }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M13 4C13 3.44772 12.5523 3 12 3C11.4477 3 11 3.44772 11 4V17.5858L6.70711 13.2929C6.31658 12.9024 5.68342 12.9024 5.29289 13.2929C4.90237 13.6834 4.90237 14.3166 5.29289 14.7071L11.2929 20.7071C11.6834 21.0976 12.3166 21.0976 12.7071 20.7071L18.7071 14.7071C19.0976 14.3166 19.0976 13.6834 18.7071 13.2929C18.3166 12.9024 17.6834 12.9024 17.2929 13.2929L13 17.5858V4Z"
        fill={fill}
      />
    </svg>
  );
}

ArrowDown.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

ArrowDown.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default ArrowDown;
