import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function HomeFilled(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.6139 1.21065C12.2528 0.929784 11.7472 0.929784 11.3861 1.21065L2.38606 8.21065C2.14247 8.4001 2 8.69141 2 9V20C2 21.6569 3.34315 23 5 23H9V14H15V23H19C20.6569 23 22 21.6569 22 20V9C22 8.69141 21.8575 8.4001 21.6139 8.21065L12.6139 1.21065Z"
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
