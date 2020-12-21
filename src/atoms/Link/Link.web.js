import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Text from '../Text';
import { getColor } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';

const styles = {
  color({ disabled, theme }) {
    if (disabled) {
      return getColor(theme, 'shade.960');
    }
    return getColor(theme, 'primary.800');
  },
  cursor({ disabled }) {
    if (disabled) {
      return 'not-allowed';
    }
    return 'pointer';
  },
  textDecoration({ disabled }) {
    if (disabled) {
      return 'none';
    }
    return 'underline';
  },
};

const StyledText = styled(Text)`
  color: ${styles.color};
  text-decoration: none;
  cursor: ${styles.cursor};
  &:hover {
    text-decoration: ${styles.textDecoration};
    color: ${(props: any) => !props.disabled && getColor(props.theme, 'primary.800')};
  }
  &:focus {
    outline: none;
    text-decoration: ${styles.textDecoration};
    color: ${(props: any) => !props.disabled && getColor(props.theme, 'primary.900')};
  }
  &:active {
    outline: none;
    text-decoration: ${styles.textDecoration};
    color: ${(props: any) => !props.disabled && getColor(props.theme, 'primary.700')};
  }
  &:visited {
    outline: none;
    color: ${(props: any) => !props.disabled && getColor(props.theme, 'primary.700')};
  }
`;

const Link = ({ size, children, href, target, testID, rel, disabled }) => {
  return (
    <StyledText
      as="a"
      rel={rel}
      size={size}
      href={disabled ? '' : href}
      target={target}
      disabled={disabled}
      {...automation(testID)}
    >
      {children}
    </StyledText>
  );
};

Link.propTypes = {
  children: PropTypes.string.isRequired,
  size: PropTypes.oneOf(['xxsmall', 'xsmall', 'small', 'medium', 'large']),
  href: PropTypes.string,
  target: PropTypes.oneOf(['_blank', '_self', '_parent', '_top']),
  testID: PropTypes.string,
  rel: PropTypes.string,
  disabled: PropTypes.bool,
};

Link.defaultProps = {
  size: 'medium',
  testID: 'ds-text',
  target: '_self',
  disabled: false,
};

export default Link;
