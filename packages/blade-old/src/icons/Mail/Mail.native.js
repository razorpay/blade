import React from 'react';
import { Path } from 'react-native-svg';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Mail(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23 6.018V18c0 1.652-1.348 3-3 3H4c-1.652 0-3-1.348-3-3V6c0-1.652 1.348-3 3-3h16a3.006 3.006 0 013 3.018zM3.107 5.554C3.272 5.227 3.612 5 4 5h16c.388 0 .728.227.893.554L12 11.779 3.107 5.554zM3 7.92V18c0 .548.452 1 1 1h16c.548 0 1-.452 1-1V7.92l-8.427 5.9a1 1 0 01-1.146 0L3 7.92z"
      />
    </Icon>
  );
}

Mail.propTypes = IconPropTypes;

Mail.defaultProps = {
  size: 'medium',
  fill: 'sapphire.800',
};

export default Mail;
