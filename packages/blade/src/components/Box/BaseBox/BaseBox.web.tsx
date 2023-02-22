import React from 'react';
import styled from 'styled-components';
import { getBaseBoxStyles, getDependencyProps } from './getBaseBoxStyles';
import type { BaseBoxProps } from './types';

const BaseBox = styled.div<BaseBoxProps>((props) => {
  const dependencyProp = getDependencyProps(props);

  // Without memo, the Box style recalculations will run on things like screen size change or randomly during scroll.
  // With memo, it only runs once for each box and then runs when any of the prop changes
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cssObject = React.useMemo(() => getBaseBoxStyles(props), [dependencyProp]);
  return cssObject;
});

export { BaseBox };
