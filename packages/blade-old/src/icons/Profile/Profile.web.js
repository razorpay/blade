import React from 'react';
import PropTypes from 'prop-types';
import { getThemeColors } from '../../_helpers/theme';
import colors from '../../tokens/colors';

function Profile({ width, height, fill }) {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.6667 20.2767C15.2883 21.0555 13.6961 21.5 12 21.5C10.3039 21.5 8.71166 21.0555 7.33333 20.2767V18.9C7.33333 17.7402 8.22876 16.8 9.33333 16.8H14.6667C15.7712 16.8 16.6667 17.7402 16.6667 18.9V20.2767ZM18 19.3658V18.9C18 16.967 16.5076 15.4 14.6667 15.4H9.33333C7.49238 15.4 6 16.967 6 18.9V19.3658C3.86401 17.6238 2.5 14.9712 2.5 12C2.5 6.75329 6.75329 2.5 12 2.5C17.2467 2.5 21.5 6.75329 21.5 12C21.5 14.9712 20.136 17.6238 18 19.3658ZM23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM12 6.99998C10.159 6.99998 8.66667 8.56699 8.66667 10.5C8.66667 12.433 10.159 14 12 14C13.841 14 15.3333 12.433 15.3333 10.5C15.3333 8.56699 13.841 6.99998 12 6.99998ZM10 10.5C10 9.34018 10.8954 8.39998 12 8.39998C13.1046 8.39998 14 9.34018 14 10.5C14 11.6598 13.1046 12.6 12 12.6C10.8954 12.6 10 11.6598 10 10.5Z"
        fill={fill}
      />
    </svg>
  );
}

Profile.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  fill: PropTypes.oneOf(getThemeColors()),
};

Profile.defaultProps = {
  width: 24,
  height: 24,
  fill: colors.sapphire[800],
};

export default Profile;
