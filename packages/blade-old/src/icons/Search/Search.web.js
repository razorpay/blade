import React from 'react';
import Icon, { IconPropTypes } from '../../atoms/Icon';

function Search(props) {
  return (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.618 18.032a9 9 0 111.414-1.414l3.675 3.675a1 1 0 01-1.414 1.414l-3.675-3.675zM4 11a7 7 0 1112.041 4.857 1.009 1.009 0 00-.185.184A7 7 0 014 11z"
      />
    </Icon>
  );
}

Search.propTypes = IconPropTypes;

Search.defaultProps = {
  size: 'medium',
  fill: 'shade.950',
};

export default Search;
