import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Text from '../Text';
import { getColor } from '../../_helpers/theme';

const StyledText = styled(Text)`
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

const Link = ({ size, children, href }) => {
  return (
    <StyledText as="a" size={size} href={href}>
      {children}
    </StyledText>
  );
};

Link.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  href: PropTypes.string,
};

Link.defaultProps = {
  size: 'medium',
  href: '#',
};

export default Link;
