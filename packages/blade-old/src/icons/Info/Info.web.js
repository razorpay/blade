import React from 'react';
import Icon from '../../atoms/Icon';
import { IconPropTypes } from '../../atoms/Icon/Icon.web';

function Info(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10A10 10 0 0012 2m-1 15h2v-6h-2v6z" />
    </Icon>
  );
}

Info.propTypes = IconPropTypes;

Info.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default Info;
