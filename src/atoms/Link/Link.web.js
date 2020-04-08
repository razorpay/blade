import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Text from '../Text';
import { getColor } from '../../_helpers/theme';

const Anchor = styled(Text)`
  color: ${(props) => getColor(props.theme, 'primary.800')};
  text-decoration: none;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
    color: ${(props) => getColor(props.theme, 'primary.800')};
  }
  &:focus {
    outline: none;
    text-decoration: underline;
    color: ${(props) => getColor(props.theme, 'primary.900')};
  }
  &:active {
    outline: none;
    text-decoration: underline;
    color: ${(props) => getColor(props.theme, 'primary.700')};
  }
  &:visited {
    outline: none;
    color: ${(props) => getColor(props.theme, 'primary.700')};
  }
`;

const Link = ({ size, children, onClick }) => {
  return (
    <Anchor as="a" size={size} onClick={onClick}>
      {children}
    </Anchor>
  );
};

Link.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
};

Link.defaultProps = {
  onClick: () => {},
  size: 'medium',
};

export default Link;
