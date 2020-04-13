import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Text from '../Text';
import { getColor } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';

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

const Link = ({ size, children, href, target, testId }) => {
  return (
    <StyledText as="a" size={size} href={href} target={target} {...automation(testId)}>
      {children}
    </StyledText>
  );
};

Link.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  href: PropTypes.string,
  target: PropTypes.oneOf(['_blank', '_self']),
  testId: PropTypes.string,
};

Link.defaultProps = {
  size: 'medium',
  href: '#',
  target: '_self',
  testId: 'ds-text',
};

export default Link;
