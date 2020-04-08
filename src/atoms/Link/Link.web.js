import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Text from '../Text';
import { getColor } from '../../_helpers/theme';

const Anchor = styled(Text)`
  color: ${(props) => getColor(props.theme, 'primary.600')};
  text-decoration: none;
  cursor: pointer;
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
