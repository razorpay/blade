import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function HomeFilled(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.614 1.21a1 1 0 00-1.228 0l-9 7A1 1 0 002 9v11a3 3 0 003 3h4v-9h6v9h4a3 3 0 003-3V9a1 1 0 00-.386-.79l-9-7z"
      />
    </Icon>
  );
}

HomeFilled.propTypes = IconPropTypes;

HomeFilled.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default HomeFilled;
