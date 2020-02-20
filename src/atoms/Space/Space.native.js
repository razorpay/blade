import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { View } from 'react-native';

import { getPxScale } from '../../_helpers/theme';
import automation from '../../_helpers/automation-attributes';

const Space = styled(({ margin, padding, children, ...props }) =>
  children ? (
    React.cloneElement(children, props)
  ) : (
    <View {...props} {...automation('space-default-view')} />
  ),
)`
  ${(props) => (props.margin ? `margin: ${getPxScale(props.margin)}` : '')};
  ${(props) => (props.padding ? `padding: ${getPxScale(props.padding)}` : '')};
`;

Space.propTypes = {
  margin: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  padding: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
};

export default Space;
