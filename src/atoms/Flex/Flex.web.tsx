import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Flex = styled(
  ({
    alignContent,
    alignItems,
    alignSelf,
    display,
    flex,
    flexBasis,
    flexDirection,
    flexGrow,
    flexShrink,
    flexWrap,
    justifyContent,
    order,
    children,
    ...props
  }) => {
    if (React.Children.toArray(children).length !== 1) {
      throw new Error('Expected a single child for Space component');
    }
    return React.cloneElement(children, props);
  },
)`
  &&& {
    ${(props: any) => (props.alignContent ? `align-content: ${props.alignContent};` : '')};
    ${(props: any) => (props.alignItems ? `align-items: ${props.alignItems};` : '')};
    ${(props: any) => (props.alignSelf ? `align-self: ${props.alignSelf};` : '')};
    ${(props: any) => (props.flex ? `flex: ${props.flex};` : '')};
    ${(props: any) => (props.flexBasis ? `flex-basis: ${props.flexBasis};` : '')};
    ${(props: any) => (props.flexDirection ? `flex-direction: ${props.flexDirection};` : '')};
    ${(props: any) => (props.flexGrow ? `flex-grow: ${props.flexGrow};` : '')};
    ${(props: any) => (props.flexShrink ? `flex-shrink: ${props.flexShrink};` : '')};
    ${(props: any) => (props.flexWrap ? `flex-wrap: ${props.flexWrap};` : '')};
    ${(props: any) => (props.justifyContent ? `justify-content: ${props.justifyContent};` : '')};
    ${(props: any) => (props.display ? `display: ${props.display};` : '')};
  }
`;

Flex.propTypes = {
  alignContent: PropTypes.oneOf([
    'center',
    'flex-end',
    'flex-start',
    'space-around',
    'space-between',
    'stretch',
  ]),
  alignItems: PropTypes.oneOf(['baseline', 'center', 'flex-end', 'flex-start', 'stretch']),
  alignSelf: PropTypes.oneOf(['baseline', 'center', 'flex-end', 'flex-start', 'stretch']),
  flex: PropTypes.number,
  flexBasis: PropTypes.string,
  flexDirection: PropTypes.oneOf(['column-reverse', 'column', 'row-reverse', 'row']),
  flexGrow: PropTypes.number,
  flexShrink: PropTypes.number,
  flexWrap: PropTypes.oneOf(['nowrap', 'wrap-reverse', 'wrap']),
  justifyContent: PropTypes.oneOf([
    'center',
    'flex-end',
    'flex-start',
    'space-around',
    'space-between',
    'space-evenly',
  ]),
  children: PropTypes.element.isRequired,
};

Flex.defaultProps = {
  display: 'flex',
  flexDirection: 'row',
};

export default Flex;
