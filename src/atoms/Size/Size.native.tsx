import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { makePxValue } from '../../_helpers/theme';

const Size = styled(
  ({ minWidth, width, maxWidth, minHeight, height, maxHeight, children, style, ...props }) => {
    if (React.Children.toArray(children).length !== 1) {
      throw new Error('Expected a single child for Size component');
    }
    return React.cloneElement(children, {
      ...props,
      style: [style, children.props.style].filter(Boolean),
    });
  },
)`
  ${(props: any) => (props.width ? `width: ${makePxValue(props.width)}` : '')};
  ${(props: any) => (props.height ? `height: ${makePxValue(props.height)}` : '')};
  ${(props: any) => (props.minWidth ? `min-width: ${makePxValue(props.minWidth)}` : '')};
  ${(props: any) => (props.maxWidth ? `max-width: ${makePxValue(props.maxWidth)}` : '')};
  ${(props: any) => (props.minHeight ? `min-height: ${makePxValue(props.minHeight)}` : '')};
  ${(props: any) => (props.maxHeight ? `max-height: ${makePxValue(props.maxHeight)}` : '')};
`;

Size.propTypes = {
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  minHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default Size;
