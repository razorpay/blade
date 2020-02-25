import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import { getPxScale } from '../../_helpers/theme';

const Space = styled(({ margin, padding, children, ...props }) =>
  React.cloneElement(children, props),
)`
  ${(props) => (props.margin ? `margin: ${getPxScale(props.margin)}` : '')};
  ${(props) => (props.padding ? `padding: ${getPxScale(props.padding)}` : '')};
`;

Space.propTypes = {
  margin: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
  padding: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.number, PropTypes.string])),
};

export default Space;
