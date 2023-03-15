import React from 'react';
import styled from 'styled-components';
import { getBaseBoxStyles, getDependencyProps } from './baseBoxStyles';
import type { BaseBoxProps } from './types';
import { useMemoizedStyles } from './useMemoizedStyles';

const BaseBox = styled.div<BaseBoxProps>((props) => {
  const cssObject = useMemoizedStyles(props);
  return cssObject;
});

export { BaseBox };
