import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Text from '../Text';
import { getColor } from '../../_helpers/theme';

const styles = {
  color({ disabled, theme }) {
    if (disabled) {
      return getColor(theme, 'primary.800');
    }
    return getColor(theme, 'primary.600');
  },
  pointerEvents({ disabled }) {
    if (disabled) {
      return 'none';
    }
    return '';
  },
  hover: {
    color({ disabled, theme }) {
      if (disabled) {
        return getColor(theme, 'primary.800');
      }
      return getColor(theme, 'primary.600');
    },
  },
  focus: {
    color({ disabled, theme }) {
      if (disabled) {
        return getColor(theme, 'primary.800');
      }
      return getColor(theme, 'primary.600');
    },
  },
};

const Anchor = styled(Text)`
  color: ${styles.color};
  text-decoration: none;
  cursor: pointer;
  pointer-events: ${styles.pointerEvents};
  &:hover {
    color: ${styles.hover.color};
  }
  &:focus {
    outline: none;
    text-decoration: underline;
    color: ${styles.focus.color};
  }
`;

const Link = ({ size, children, color, onClick, ...props }) => {
  return (
    <Anchor as="a" size={size} {...props} onClick={onClick}>
      {children}{' '}
    </Anchor>
  );
};

Link.propTypes = {
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  color: PropTypes.string,
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
};

Link.defaultProps = {
  onClick: () => {},
  color: 'primary.800',
  size: 'medium',
};

export default Link;
