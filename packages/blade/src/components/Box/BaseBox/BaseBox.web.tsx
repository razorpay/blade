import styled from 'styled-components';
import type { BaseBoxProps } from './types';
import { useMemoizedStyles } from './useMemoizedStyles';

const BaseBox = styled.div<BaseBoxProps>((props) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const cssObject = useMemoizedStyles(props);
  return cssObject;
});

export { BaseBox };
