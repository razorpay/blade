import React from 'react';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import View from '../View';
import { getColor, getColorKeys } from '../../_helpers/theme';

const StyledView = styled(View)`
  height: ${(props) => (props.dividerDirection === 'horizontal' ? '1px' : '100%')};
  width: ${(props) => (props.dividerDirection === 'horizontal' ? '100%' : '1px')};
  background-color: ${(props) => getColor(props.theme, props.color)};
`;

const Divider = ({ direction, color }) => <StyledView dividerDirection={direction} color={color} />;

Divider.propTypes = {
  direction: PropTypes.oneOf(['horizontal', 'vertical']),
  color: PropTypes.oneOf(getColorKeys()),
};

Divider.defaultProps = {
  direction: 'horizontal',
  color: 'tone.960',
};

export default Divider;
