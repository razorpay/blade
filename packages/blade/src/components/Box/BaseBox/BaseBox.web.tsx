import styled from 'styled-components';
import type { BaseBoxProps } from './types';
import { useMemoizedStyles } from './useMemoizedStyles';
import { omitPropsFromHTML } from '~utils/omitPropsFromHTML';

const BaseBox = styled.div.withConfig({
  shouldForwardProp: omitPropsFromHTML,
  displayName: 'BaseBox',
})<BaseBoxProps>((props) => {
  const cssObject = useMemoizedStyles(props);
  return cssObject;
});

export { BaseBox };
