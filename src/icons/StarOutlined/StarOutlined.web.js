import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function StarOutlined({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 1a1 1 0 01.897.557l2.857 5.79 6.39.934a1 1 0 01.554 1.705l-4.623 4.503 1.09 6.362a1 1 0 01-1.45 1.054L12 18.9l-5.715 3.005a1 1 0 01-1.45-1.054l1.09-6.362-4.623-4.503a1 1 0 01.553-1.705l6.39-.935 2.858-5.789A1 1 0 0112 1zm0 3.26L9.807 8.702a1 1 0 01-.752.546l-4.907.718 3.55 3.457a1 1 0 01.288.885l-.838 4.883 4.386-2.307a1 1 0 01.931 0l4.387 2.307-.838-4.883a1 1 0 01.288-.885l3.55-3.457-4.907-.718a1 1 0 01-.752-.546L12 4.259z"
        fill={fill}
      />
    </svg>
  );
}

StarOutlined.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

StarOutlined.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default StarOutlined;
