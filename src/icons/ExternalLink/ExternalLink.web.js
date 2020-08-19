import * as React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function ExternalLink({ width, height, fill }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 1C12 0.447715 12.4477 0 13 0H19C19.5523 0 20 0.447715 20 1V7C20 7.55228 19.5523 8 19 8C18.4477 8 18 7.55228 18 7V3.41421L8.70711 12.7071C8.31658 13.0976 7.68342 13.0976 7.29289 12.7071C6.90237 12.3166 6.90237 11.6834 7.29289 11.2929L16.5858 2H13C12.4477 2 12 1.55228 12 1Z"
        fill={fill}
      />
      <path
        d="M3 5C2.44772 5 2 5.44772 2 6V17C2 17.5523 2.44772 18 3 18H14C14.5523 18 15 17.5523 15 17V11C15 10.4477 15.4477 10 16 10C16.5523 10 17 10.4477 17 11V17C17 18.6569 15.6569 20 14 20H3C1.34315 20 0 18.6569 0 17V6C0 4.34315 1.34315 3 3 3H9C9.55229 3 10 3.44772 10 4C10 4.55228 9.55229 5 9 5H3Z"
        fill={fill}
      />
    </svg>
  );
}

ExternalLink.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

ExternalLink.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default ExternalLink;
