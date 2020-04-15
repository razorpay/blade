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

const Link = ({ size, children, href, target, testID, rel }) => {
  return (
    <StyledText as="a" rel={rel} size={size} href={href} target={target} {...automation(testID)}>
      {children}
    </StyledText>
  );
};

Link.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  href: PropTypes.string,
  target: PropTypes.oneOf(['_blank', '_self', '_parent', '_top']),
  testID: PropTypes.string,
  rel: PropTypes.string,
};

Link.defaultProps = {
  size: 'medium',
  testID: 'ds-text',
  target: '_self',
};

export default Link;
