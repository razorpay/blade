import React from 'react';
import styled from 'styled-components';
import { getBaseBoxStyles, getDependencyProps } from './getBaseBoxStyles';
import type { BaseBoxProps } from './types';

const BaseBox = styled.div<BaseBoxProps>((props) => {
  const dependencyProp = getDependencyProps(props);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cssObject = React.useMemo(() => getBaseBoxStyles(props), [dependencyProp]);
  return cssObject;
});

export { BaseBox };
